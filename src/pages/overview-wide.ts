import { css, html, nothing, svg } from 'lit';
import { hold } from '../components/hold';
import { weatherAnim } from '../components/motion';
import { icon } from '../components/ui';
import { I, IC } from '../icons';
import { loadConsumption, loadEnergy } from '../data/series';
import { entityFloor, floorGroups } from '../logic/climate';
import { batteryStatIds, energyNow, energyStatIds, energyToday, houseSources } from '../logic/energy';
import { ent } from '../logic/entities';
import { dateLine, greeting, nowItems, roomSummaries, statusBubbles, type RoomSummary } from '../logic/overview';
import { roomsView } from '../logic/rooms-page';
import { technikItems, technikProblemCount } from '../logic/technik-now';
import { hasTechnik, isTechUser } from '../logic/technik';
import { fmt } from '../logic/util';
import { CONDITIONS, dailyRows, weatherNow, type ForecastItem } from '../logic/weather';
import { curvePoints, rainHint, tileRows } from '../logic/wide';
import { roomAccent } from '../logic/window-state';
import { watts } from '../logic/devices';
import type { PageContext } from './context';
import { renderItem, statusActions, winMark } from './overview';
import { cameraLabel } from './security';

const HVAC_DE: Record<string, string> = { off: 'Aus', cool: 'Kühlt', dry: 'Trocknet', heat: 'Heizt', fan_only: 'Lüfter', auto: 'Auto', heat_cool: 'Auto' };
const kwh = (v: number) => `${fmt(v, v < 10 ? 1 : 0)} kWh`;

/** Übersicht on tablets and wide screens (docs/design/ipad/UebersichtQuerB, UebersichtHochB). */
export function renderOverviewWide(ctx: PageContext) {
  const { hass, config, now } = ctx;
  const bubbles = statusBubbles(hass, config);
  const items = [
    ...nowItems(hass, config, ctx.rooms, now, ctx.heating(), (r) => ctx.window(r), ctx.alarmoSensors?.() ?? [], ctx.applianceRuns?.() ?? {}),
    ...technikItems(hass, config, now, { dismissed: ctx.dismissed, pauseUntil: ctx.piholePause }),
  ];
  const tech = isTechUser(hass, config) && hasTechnik(hass, config);
  const techAlert = tech && technikProblemCount(hass, config, now, { dismissed: ctx.dismissed, pauseUntil: ctx.piholePause }) > 0;
  const wide = ctx.layout === 'wide';

  const bubbleRow = html`
    <div class="ow-bubbles">
      ${bubbles.map((b) => html`
        <button class="ow-bubble" aria-label="${b.label}: ${b.value}" ${hold(statusActions(ctx, b))}>
          <span class="circle ${b.wobble ? 'wobble' : ''}" style="width:40px;height:40px;background:${b.color}">${icon(b.icon, 18, '#111')}</span>
          <span class="ow-btext"><span class="ow-bv ellipsis">${b.value}</span><span class="ow-bl ellipsis">${b.label}</span></span>
        </button>`)}
    </div>`;

  const now_ = html`
    <section class="section" aria-labelledby="ow-now-h">
      <div class="section-head">
        <h2 id="ow-now-h">Aktuell</h2><span class="rule" aria-hidden="true"></span><span class="meta">${items.length || ''}</span>
      </div>
      ${items.length
        ? html`<div class="ow-now">${items.map((n) => renderItem(ctx, n, true))}</div>`
        : html`<div class="now calm wide">
            <span class="circle" style="width:34px;height:34px;background:#30d158">${icon(I.check, 16, '#101010', 2.4)}</span>
            <span class="now-text"><span class="now-title">Alles ruhig</span><span class="now-sub">Gerade gibt es nichts zu tun</span></span>
          </div>`}
    </section>`;

  return html`
    <div class="ow ${wide ? 'ow-wide' : 'ow-tablet'}">
      <header class="ow-head">
        <div class="ow-greet">
          <div class="date">${dateLine(now)}</div>
          <h1>${greeting(now)}</h1>
        </div>
        ${wide ? bubbleRow : html`<span class="grow"></span>`}
        ${tech
          ? html`<button class="tech-btn" aria-label=${techAlert ? 'Technik öffnen, es gibt Meldungen' : 'Technik öffnen'} @click=${() => ctx.openSheet({ id: 'technik' })}>
              ${icon(I.server, 20, 'rgba(255,255,255,0.85)', 2)}${techAlert ? html`<span class="tech-dot"></span>` : nothing}
            </button>`
          : nothing}
      </header>
      ${wide ? nothing : bubbleRow}
      <div class="ow-grid">
        <div class="wcol ow-c1">${now_}${cameraCard(ctx)}</div>
        <div class="wcol ow-c2">${summary(ctx)}</div>
        <div class="wcol ow-c3">${weatherCard(ctx)}${energyCard(ctx)}</div>
      </div>
    </div>
  `;
}

function cameraCard(ctx: PageContext) {
  const { hass, config, now } = ctx;
  const camera = ent(config, 'camera');
  const cam = hass.states[camera];
  if (!cam) return nothing;
  const pic = cam.attributes.entity_picture as string | undefined;
  // A still that follows the card clock (30 s); the live stream stays on the Schutz page.
  const src = pic ? `${pic}${pic.includes('?') ? '&' : '?'}_t=${Math.floor(now.getTime() / 30_000)}` : '';
  const events = [
    { id: ent(config, 'camera_person'), what: 'Person erkannt', color: '#ff9f0a' },
    { id: ent(config, 'camera_motion'), what: 'Bewegung', color: '#5ac8fa' },
  ]
    .map((e) => ({ ...e, s: hass.states[e.id] }))
    .filter((e) => e.s);
  const hm = (iso: string) => new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  return html`
    <button class="wcard ow-cam" aria-label="${cameraLabel(ctx, camera)}-Kamera, Schutz öffnen" @click=${() => ctx.go('security')}>
      <span class="ow-camhead">
        <span class="grow">${cameraLabel(ctx, camera)}</span>
        <span class="ow-chip"><span class="dot" style="background:${cam.state === 'unavailable' ? '#888' : '#30d158'}"></span>${cam.state === 'unavailable' ? 'Offline' : 'Standbild'}</span>
      </span>
      <span class="ow-camimg">
        ${src && cam.state !== 'unavailable'
          ? html`<img src=${src} alt="" loading="lazy" />`
          : html`<span class="ow-camph">${icon('M3 7h12v10H3zM15 10l6-3v10l-6-3', 30, 'rgba(255,255,255,0.45)', 1.8)}</span>`}
        <span class="ow-camtime">${hm(now.toISOString())}</span>
      </span>
      ${events.length
        ? html`<span class="ow-events">
            ${events.map((e) => html`<span class="ow-ev">
              <span class="dot" style="width:8px;height:8px;background:${e.s!.state === 'on' ? e.color : 'rgba(255,255,255,0.3)'}"></span>
              <span class="grow">${e.s!.state === 'on' ? e.what : `${e.what} zuletzt`}</span>
              <span class="ow-evt">${hm(e.s!.last_changed)}</span></span>`)}
          </span>`
        : nothing}
    </button>`;
}

interface Tile {
  key: string;
  view: unknown;
}

function summary(ctx: PageContext) {
  const { hass, config } = ctx;
  const sums = roomSummaries(hass, ctx.rooms, (r) => ctx.window(r));
  const bySlug = new Map(sums.map((s) => [s.room.slug, s]));
  const lights = new Map(roomsView(hass, config, ctx.rooms).map((v) => [v.room.slug, v.lightsOn]));
  const acId = ent(config, 'ac');
  const ac = hass.states[acId];
  const acFloor = ac ? entityFloor(hass, acId) : undefined;
  const floors = floorGroups(hass, ctx.rooms);
  const groups = floors.map((f, i) => {
    const tiles: Tile[] = f.rooms.map((r) => ({ key: r.slug, view: roomTile(ctx, bySlug.get(r.slug)!, lights.get(r.slug) ?? 0) }));
    if (ac && acFloor === f.id) tiles.push({ key: 'ac', view: acTile(ctx, ac.state, ac.attributes) });
    if (i === floors.length - 1) tiles.push({ key: 'all', view: actionTile(IC.tune, 'Alle Räume', 'einstellen', () => ctx.openSheet({ id: 'allRooms' })) });
    return { name: f.name, tiles };
  });
  const aq = sums.some((s) => s.aq);
  return html`
    <section class="section ow-sum" aria-labelledby="ow-sum-h">
      <div class="section-head">
        <h2 id="ow-sum-h">Zusammenfassung</h2><span class="rule" aria-hidden="true"></span>
        ${aq
          ? html`<span class="meta" style="font-size:11px"><span class="dot" style="background:#30d158"></span><span class="dot" style="background:#ffd60a"></span><span class="dot" style="background:#ff453a;margin-right:3px"></span>Luftqualität</span>`
          : nothing}
      </div>
      <div class="ow-tiles" style="grid-template-rows:${tileRows(groups.map((g) => g.tiles.length))}">
        ${groups.map((g) => html`<span class="ow-floor">${g.name}</span>${g.tiles.map((t) => t.view)}`)}
      </div>
    </section>`;
}

function roomTile(ctx: PageContext, r: RoomSummary, lightsOn: number) {
  const accent = roomAccent(r.win, r.heating);
  const sub = `${r.hum} %${r.vent && r.win.kind === 'none' ? ' · lüften' : r.note ? ` · ${r.note}` : ''}`;
  return html`
    <button class="ow-tile ${accent}" @click=${() => ctx.openSheet({ id: 'room', slug: r.room.slug })}
      aria-label="${r.room.name}: ${r.temp} Grad, ${r.hum} Prozent">
      <span class="ow-trow">
        <span class="circle ow-tcircle">${icon(r.icon, 16, accent ? '#141008' : '#fff', 2)}</span>
        <span class="ow-ttemp">${r.temp}°</span>
      </span>
      <span class="ow-tname">${r.room.name}</span>
      <span class="ow-tsub">
        <span class="ow-tstate">${sub}${winMark(r.win)}</span>
        <span class="grow"></span>
        ${lightsOn ? html`<span class="ow-tlight">${icon(I.bulb, 13, '#ffe37a', 2.2)}${lightsOn}</span>` : nothing}
        ${r.aq ? html`<span class="dot" style="width:8px;height:8px;background:${r.aq}"></span>` : nothing}
      </span>
    </button>`;
}

function acTile(ctx: PageContext, st: string, a: Record<string, unknown>) {
  const inside = a.current_temperature != null ? `${fmt(Number(a.current_temperature), 1)}° innen` : 'Klimaanlage';
  return html`
    <button class="ow-tile ow-dashed" @click=${() => ctx.openSheet({ id: 'ac' })} aria-label="Klimaanlage: ${HVAC_DE[st] ?? st}">
      <span class="ow-trow">
        <span class="circle ow-tcircle">${icon(IC.snowflake, 16, '#8fd8ff', 2)}</span>
        <span class="ow-ttemp small">${HVAC_DE[st] ?? st}</span>
      </span>
      <span class="ow-tname">Klimaanlage</span>
      <span class="ow-tsub"><span class="ow-tstate muted">${inside}</span></span>
    </button>`;
}

function actionTile(path: string, name: string, sub: string, tap: () => void) {
  return html`
    <button class="ow-tile ow-dashed" @click=${tap}>
      <span class="ow-trow"><span class="circle ow-tcircle">${icon(path, 16, '#fff', 2)}</span></span>
      <span class="ow-tname">${name}</span>
      <span class="ow-tsub"><span class="ow-tstate muted">${sub}</span></span>
    </button>`;
}

/** 12 h temperature line over rain bars, in a fixed 280 × 112 box (scales with the card width). */
function hourChart(hourly: ForecastItem[], now: Date) {
  const from = new Date(now);
  from.setMinutes(0, 0, 0);
  const hours = hourly.filter((h) => new Date(h.datetime).getTime() >= from.getTime()).slice(0, 13);
  if (hours.length < 2) return nothing;
  const temps = hours.map((h) => h.temperature ?? 0);
  const lo = Math.min(...temps);
  const hi = Math.max(...temps);
  const pts = curvePoints(temps.map((t) => t - lo), 256, 40, Math.max(1, hi - lo)).map(([x, y]) => [x + 12, y + 26] as const);
  const rainMax = Math.max(2, ...hours.map((h) => h.precipitation ?? 0));
  return svg`<svg class="ow-hours" viewBox="0 0 280 112" role="img" aria-label="Temperatur und Regen der nächsten 12 Stunden">
    <line x1="4" y1="92" x2="276" y2="92" stroke="rgba(255,255,255,0.12)"></line>
    ${hours.map((h, i) => {
      const mm = h.precipitation ?? 0;
      const bh = Math.round((mm / rainMax) * 34);
      return mm >= 0.1 ? svg`<rect x=${pts[i][0] - 4} y=${92 - Math.max(2, bh)} width="8" height=${Math.max(2, bh)} rx="2" fill="rgba(90,200,250,0.55)"></rect>` : nothing;
    })}
    <polyline points=${pts.map((p) => p.join(',')).join(' ')} fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></polyline>
    ${hours.map((h, i) => i % 2
      ? nothing
      : svg`<text x=${pts[i][0]} y=${pts[i][1] - 7} text-anchor="middle" font-size="10" font-weight="600" fill="#fff">${Math.round(temps[i])}°</text>
        <text x=${pts[i][0]} y="108" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.6)">${new Date(h.datetime).getHours()}</text>`)}
  </svg>`;
}

function weatherCard(ctx: PageContext) {
  const { hass, config, now } = ctx;
  const f = ctx.forecast();
  const w = weatherNow(hass, config, f.daily, now, f.hourly);
  const hint = rainHint(f.hourly, now);
  const days = dailyRows(f.daily, 5);
  const condIcon = (c: string) => weatherAnim(c, 18, /rain|pour/.test(c) ? '#8fd0ff' : /sunny|clear/.test(c) ? '#ffd60a' : /lightning/.test(c) ? '#bf9bff' : '#cfd6e0');
  return html`
    <button class="wcard ow-weather" aria-label="Wetter öffnen" @click=${() => ctx.openSheet({ id: 'weather' })}>
      <span class="ow-wtop">
        <span class="circle" style="width:44px;height:44px;background:rgba(143,208,255,0.2)">${weatherAnim(w.condition, 22, '#8fd0ff')}</span>
        <span class="grow"><span class="ow-wt">${w.temp}</span><span class="ow-wl">${CONDITIONS[w.condition] ?? w.label}${w.today ? ` · ${w.today.replace(/^heute /, '')}` : ''}</span></span>
        ${hint ? html`<span class="ow-whint">${hint}</span>` : nothing}
      </span>
      ${hourChart(f.hourly, now)}
      ${days.length
        ? html`<span class="ow-days">
            ${days.map((d) => html`<span class="ow-day">
              <span class="ow-dn">${d.day}</span>${condIcon(d.condition)}
              <span class="ow-dlo">${d.min}°</span>
              <span class="ow-dbar"><span style="left:${d.left}%;width:${d.width}%"></span></span>
              <span class="ow-dhi">${d.max}°</span></span>`)}
          </span>`
        : nothing}
    </button>`;
}

function energyCard(ctx: PageContext) {
  const { hass, config } = ctx;
  const energy = ctx.energy();
  const e = energyNow(hass, config, energy.prefs);
  const src = houseSources(e);
  const total = Math.max(1, src.pv + src.battery + src.grid);
  const today = energyToday(hass, config, energy.today);
  const tile = (label: string, value: string, color: string) =>
    html`<span class="ow-etile"><span style="color:${color}">${label}</span><strong>${value}</strong></span>`;
  return html`
    <button class="wcard ow-energy" aria-label="Energie öffnen" @click=${() => ctx.go('energy')}>
      <span class="ow-etop"><span class="ow-elabel">Haus jetzt</span><span class="ow-ev2">${watts(e.house)}</span></span>
      <span class="ow-ebar" aria-hidden="true">
        ${src.pv > 0 ? html`<span style="flex:${src.pv / total};background:#ffd60a"></span>` : nothing}
        ${src.battery > 0 ? html`<span style="flex:${src.battery / total};background:#30d158"></span>` : nothing}
        ${src.grid > 0 ? html`<span style="flex:${src.grid / total};background:#ff9f0a"></span>` : nothing}
      </span>
      <span class="ow-elegend"><span>Sonne ${watts(src.pv)}</span>${e.battery ? html`<span style="color:#9af0b5">Akku ${watts(src.battery)}</span>` : nothing}<span style="color:#ffc061">Netz ${watts(src.grid)}</span></span>
      ${dayCurve(ctx)}
      <span class="ow-etiles">
        ${tile('PV heute', kwh(today.pv), '#ffe37a')}
        ${tile('Bezug', kwh(today.import), '#ffc061')}
        ${tile('autark', today.autarky !== null ? `${today.autarky} %` : '–', 'rgba(255,255,255,0.65)')}
      </span>
    </button>`;
}

/** Today's PV (area) against house consumption (line), kWh per hour from the energy dashboard statistics. */
export function dayCurve(ctx: PageContext, title?: string) {
  const { hass } = ctx;
  const energy = ctx.energy();
  const ids = energy.prefs ? { ...energyStatIds(energy.prefs), ...batteryStatIds(energy.prefs) } : null;
  // Same cache keys as the energy chart sheet, so opening a chart reuses the data.
  const pv = ids?.solar.length ? ctx.series('energy:pv:24h:kWh', () => loadEnergy(hass, ids.solar, '24h')) : null;
  const house = ids ? ctx.series('energy:house:24h:kWh', () => loadConsumption(hass, ids, '24h')) : null;
  const pvV = pv?.past.map((p) => p.v) ?? [];
  const hoV = house?.past.map((p) => p.v) ?? [];
  const max = Math.max(0.5, ...pvV, ...hoV);
  const line = (vals: number[]) => curvePoints(vals, 280, 76, max).map(([x, y]) => `${x},${y + 2}`).join(' ');
  const start = house?.start || pv?.start || 0;
  const labels = start ? [0, 6, 12, 18, 24].map((h) => new Date(start + h * 3600_000).getHours()) : [];
  const legend = html`<span class="ow-elegend2">
    <span><i style="background:rgba(255,214,10,0.6)"></i>Sonne</span><span><i class="line" style="background:#ff9f0a"></i>Verbrauch</span></span>`;
  return html`
    ${title ? html`<span class="ow-dhead"><h2>${title}</h2>${legend}</span>` : nothing}
      ${hoV.length || pvV.length
        ? html`<span class="ow-echart">
            <svg viewBox="0 0 280 80" preserveAspectRatio="none" aria-label="Heute: Solarertrag gegen Verbrauch" role="img">
              <line x1="0" y1="78" x2="280" y2="78" stroke="rgba(255,255,255,0.14)" vector-effect="non-scaling-stroke"></line>
              ${pvV.length ? svg`<polygon points="0,78 ${line(pvV)} 280,78" fill="rgba(255,214,10,0.26)" stroke="#ffd60a" stroke-width="1.5" vector-effect="non-scaling-stroke"></polygon>` : nothing}
              ${hoV.length ? svg`<polyline points=${line(hoV)} fill="none" stroke="#ff9f0a" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round"></polyline>` : nothing}
            </svg>
          </span>
          <span class="ow-eaxis" aria-hidden="true">${labels.map((h) => html`<span>${h}</span>`)}</span>`
        : html`<span class="ow-enodata">${ids ? 'Lädt …' : 'Kein Energie-Dashboard'}</span>`}
  `;
}

export const overviewWideStyles = css`
  .ow {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .ow-head {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 24px;
    padding-left: 4px;
  }
  .ow-greet {
    flex-shrink: 0;
  }
  .ow-greet h1 {
    margin-top: 2px;
    font-size: 28px;
    font-weight: 700;
  }
  .ow-bubbles {
    flex: 1;
    min-width: 0;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
  }
  .ow-bubble {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    height: 58px;
    padding: 0 12px 0 8px;
    border-radius: 29px;
    background: var(--sd-fill);
    touch-action: manipulation;
  }
  .ow-btext {
    min-width: 0;
  }
  .ow-bv {
    display: block;
    font-size: 15px;
    font-weight: 700;
  }
  .ow-bl {
    display: block;
    font-size: 12px;
    color: var(--sd-muted);
  }
  .ow-grid {
    flex: 1;
    min-height: 0;
    display: grid;
    gap: 16px;
  }
  .ow-wide .ow-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr) minmax(0, 1fr);
  }
  .ow-tablet .ow-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-areas: 'c1 c2' 'c3 c3';
  }
  .ow-tablet .ow-c1 {
    grid-area: c1;
  }
  .ow-tablet .ow-c2 {
    grid-area: c2;
  }
  .ow-tablet .ow-c3 {
    grid-area: c3;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: stretch;
  }
  .ow-now {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .ow-now .now {
    height: 60px;
    border-radius: 30px;
  }
  .ow-now .now .circle {
    width: 44px !important;
    height: 44px !important;
  }
  .ow-now .now-title {
    font-size: 14px;
  }
  .ow-now .now-sub {
    font-size: 12px;
  }
  .ow-now .now-action {
    height: 40px;
    padding: 0 16px;
    border-radius: 20px;
    font-size: 14px;
  }
  .ow-cam {
    flex: 1;
    min-height: 220px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    text-align: left;
  }
  .ow-camhead {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 2px;
    font-size: 14px;
    font-weight: 600;
  }
  .ow-chip {
    display: flex;
    align-items: center;
    gap: 5px;
    height: 24px;
    padding: 0 9px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.8);
  }
  .ow-camimg {
    position: relative;
    flex-shrink: 0;
    aspect-ratio: 4 / 3;
    border-radius: 16px;
    overflow: hidden;
    background: linear-gradient(175deg, #3a4356 0%, #262c39 45%, #1a1e27 100%);
  }
  .ow-wide .ow-camimg {
    flex: 1;
    min-height: 120px;
    aspect-ratio: auto;
  }
  .ow-camimg img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .ow-camph {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ow-camtime {
    position: absolute;
    right: 8px;
    bottom: 8px;
    padding: 3px 7px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.45);
    font-size: 11px;
    font-weight: 600;
  }
  .ow-events {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .ow-ev {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.85);
  }
  .ow-evt {
    color: rgba(255, 255, 255, 0.6);
  }
  .ow-sum {
    flex: 1;
    min-height: 0;
  }
  .ow-tiles {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
  .ow-floor {
    grid-column: 1 / -1;
    margin: 2px 8px 0;
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
  }
  .ow-tile {
    min-height: 84px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 4px;
    padding: 10px 12px 10px 10px;
    border-radius: 22px;
    background: var(--sd-fill);
    text-align: left;
  }
  .ow-tile.heat {
    background: rgba(255, 159, 10, 0.12);
  }
  .ow-tile.vent {
    background: rgba(90, 200, 250, 0.14);
  }
  .ow-tile.alert {
    background: rgba(255, 69, 58, 0.14);
  }
  .ow-dashed {
    background: transparent;
    border: 1px dashed rgba(255, 255, 255, 0.18);
  }
  .ow-trow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .ow-tcircle {
    width: 34px;
    height: 34px;
    background: rgba(255, 255, 255, 0.12);
  }
  .ow-tile.heat .ow-tcircle {
    background: #ff9f0a;
  }
  .ow-tile.vent .ow-tcircle {
    background: #5ac8fa;
  }
  .ow-tile.alert .ow-tcircle {
    background: #ff453a;
  }
  .ow-ttemp {
    font-size: 20px;
    font-weight: 700;
  }
  .ow-ttemp.small {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.75);
  }
  .ow-tname {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
  }
  .ow-tsub {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
  }
  .ow-tstate {
    color: rgba(255, 255, 255, 0.72);
    white-space: nowrap;
  }
  .ow-tstate.muted {
    color: rgba(255, 255, 255, 0.6);
  }
  .ow-tile.heat .ow-tstate {
    color: #ffc061;
  }
  .ow-tile.vent .ow-tstate {
    color: #8fd8ff;
    font-weight: 600;
  }
  .ow-tlight {
    display: flex;
    align-items: center;
    gap: 3px;
    color: #ffe37a;
  }
  .ow-weather {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    text-align: left;
    background: linear-gradient(160deg, rgba(143, 208, 255, 0.16), rgba(255, 255, 255, 0.05) 60%);
  }
  .ow-wtop {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .ow-wt {
    display: block;
    font-size: 26px;
    font-weight: 700;
    line-height: 1;
  }
  .ow-wl {
    display: block;
    font-size: 12px;
    color: var(--sd-muted);
  }
  .ow-whint {
    max-width: 90px;
    text-align: right;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.35;
    color: #8fd0ff;
  }
  .ow-hours {
    width: 100%;
    height: auto;
  }
  .ow-days {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-top: 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  .ow-day {
    display: grid;
    grid-template-columns: 26px 20px 28px minmax(0, 1fr) 28px;
    align-items: center;
    gap: 8px;
    font-size: 13px;
  }
  .ow-dn {
    font-weight: 600;
  }
  .ow-dlo {
    text-align: right;
    color: rgba(255, 255, 255, 0.6);
  }
  .ow-dhi {
    font-weight: 700;
  }
  .ow-dbar {
    position: relative;
    height: 6px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.1);
  }
  .ow-dbar span {
    position: absolute;
    top: 0;
    bottom: 0;
    border-radius: 3px;
    background: linear-gradient(90deg, #8fd0ff, #ffd60a);
  }
  .ow-energy {
    flex: 1;
    min-height: 260px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    text-align: left;
  }
  .ow-etop {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }
  .ow-elabel {
    font-size: 13px;
    color: var(--sd-muted);
  }
  .ow-ev2 {
    font-size: 22px;
    font-weight: 700;
  }
  .ow-ebar {
    display: flex;
    gap: 2px;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.08);
  }
  .ow-elegend {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.75);
  }
  .ow-echart {
    flex: 1;
    min-height: 70px;
    position: relative;
  }
  .ow-echart svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .ow-eaxis {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.6);
  }
  .ow-etiles {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }
  .ow-etile {
    padding: 8px 10px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.06);
    font-size: 11px;
  }
  .ow-etile strong {
    display: block;
    font-size: 14px;
    color: #fff;
  }

  .ow-dhead {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .ow-dhead h2 {
    flex: 1;
    font-size: 15px;
    font-weight: 600;
  }
  .ow-elegend2 {
    display: flex;
    gap: 14px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.75);
  }
  .ow-elegend2 span {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .ow-elegend2 i {
    width: 10px;
    height: 10px;
    border-radius: 3px;
  }
  .ow-elegend2 i.line {
    width: 12px;
    height: 3px;
  }
  .ow-enodata {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  }
`;
