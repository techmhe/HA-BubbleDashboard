import { css, html, nothing } from 'lit';
import { hold } from '../components/hold';
import { applianceIcon, weatherAnim } from '../components/motion';
import { icon } from '../components/ui';
import { I } from '../icons';
import {
  dateLine, greeting, lightsOn, nowItems, nowLayout, roomSummaries, statusBubbles, weatherInfo,
  type NowItem, type StatusBubble,
} from '../logic/overview';
import { ent } from '../logic/entities';
import { clock } from '../logic/climate';
import { roomAccent, shortOpen, type WindowState } from '../logic/window-state';
import type { PageContext } from './context';
import { technikItems, technikProblemCount } from '../logic/technik-now';
import { hasTechnik, isTechUser } from '../logic/technik';

function statusActions(ctx: PageContext, b: StatusBubble) {
  const { config } = ctx;
  switch (b.key) {
    case 'robby':
      return {
        tap: () => ctx.openSheet({ id: 'robby' }),
        hold: () => ctx.confirm({
          title: 'Robby', text: 'EG jetzt saugen?', confirm: 'Starten', color: '#ffffff', iconPath: I.vacuum,
          onConfirm: () => ctx.call('button', 'press', {}, { entity_id: ent(config, 'vacuum_quick') }),
        }),
      };
    case 'light':
      return {
        tap: () => ctx.go('rooms', { roomsFilter: 'on' }),
        hold: () => {
          const on = lightsOn(ctx.hass);
          if (!on.length) return;
          ctx.confirm({
            title: 'Licht', text: `Alle ${on.length} Lichter ausschalten?`, confirm: 'Alle aus', color: '#ffd60a', iconPath: I.bulb,
            onConfirm: () => ctx.call('light', 'turn_off', {}, { entity_id: on }),
          });
        },
      };
    case 'energy':
      return { tap: () => ctx.go('energy') };
    case 'alarm':
      return {
        tap: () => ctx.openSheet({ id: 'alarm' }),
        hold: () => ctx.confirm({
          title: 'Alarm', text: 'Alarm scharf schalten (Abwesend)?', confirm: 'Scharf', color: '#bf9bff', iconPath: I.shield,
          onConfirm: () => ctx.call('alarm_control_panel', 'alarm_arm_away', {}, { entity_id: ent(config, 'alarm') }),
        }),
      };
  }
}

/** Airing state on a room pill: an icon (wind = recommended, window = open) and a short value. */
function winMark(w: WindowState) {
  const mark = (path: string, color: string, label: string, text = '') =>
    html`<span class="room-air" style="color:${color}" title=${label} aria-label=${label}>${icon(path, 13, color, 2.4)}${text}</span>`;
  switch (w.kind) {
    case 'recommend':
      return mark(I.wind, '#5ac8fa', 'Lüften empfohlen');
    case 'airing':
      return mark(I.window, '#5ac8fa', 'Lüftet', w.remaining > 0 ? clock(w.remaining) : '');
    case 'overdue':
      return mark(I.window, '#ff6b61', `Fenster offen seit ${w.openMin} min`, w.openMin < 60 ? `${w.openMin}′` : shortOpen(w.openMin));
    case 'stuck':
      return mark(I.window, '#aeb4c0', 'Fenstersensor prüfen', '?');
    case 'open':
      return mark(I.window, '#aeb4c0', 'Fenster offen');
    default:
      return nothing;
  }
}

function itemTap(ctx: PageContext, n: NowItem): (() => void) | undefined {
  const t = n.tap;
  if (!t) return undefined;
  if (typeof t === 'object') return 'room' in t ? () => ctx.openSheet({ id: 'room', slug: t.room }) : () => ctx.moreInfo(t.moreInfo);
  switch (t) {
    case 'airing':
      return () => ctx.openSheet({ id: 'airing' });
    case 'weather':
      return () => ctx.openSheet({ id: 'weather' });
    case 'robby':
      return () => ctx.openSheet({ id: 'robby' });
    case 'alarm':
      return () => ctx.openSheet({ id: 'alarm' });
    case 'rooms':
      return () => ctx.go('rooms');
    case 'care':
      return () => ctx.openSheet({ id: 'care' });
    case 'technik':
      return () => ctx.openSheet({ id: 'technik' });
    case 'printer':
      return () => ctx.openSheet({ id: 'printer' });
  }
}

function renderItem(ctx: PageContext, n: NowItem, wide = true) {
  const tap = itemTap(ctx, n);
  const act = n.action;
  return html`
    <div class="now ${wide ? 'wide' : ''}" style="background: linear-gradient(90deg, ${n.tint}, rgba(255,255,255,0.05) ${wide ? 75 : 100}%)">
      <button class="now-main" ?disabled=${!tap} @click=${() => tap?.()}>
        <span class="circle" style="width:34px;height:34px;background:${n.color}">${n.appliance ? applianceIcon(n.appliance, true, 16, '#101010') : icon(n.icon, 16, '#101010')}</span>
        <span class="now-text">
          <span class="now-title ellipsis">${n.title}</span>
          <span class="now-sub ellipsis">${n.text}</span>
        </span>
        ${n.value ? html`<span class="now-value" style="color:${n.color}">${n.value}</span>` : nothing}
      </button>
      ${act
        ? html`<button class="now-action" style="background:${n.color}"
            @click=${() => ctx.call(act.domain, act.service, act.data, act.target)}>${act.label}</button>`
        : n.dismiss
          ? html`<button class="now-action" style="background:${n.color}" @click=${() => ctx.dismiss(n.dismiss!.key)}>${n.dismiss.label}</button>`
          : nothing}
      ${n.progress !== undefined
        ? html`<span class="now-progress" style="width:calc((100% - 60px) * ${Math.max(0, Math.min(1, n.progress))});background:${n.color}"></span>`
        : nothing}
    </div>
  `;
}

export function renderOverview(ctx: PageContext) {
  const { hass, config, now } = ctx;
  const weatherId = ent(config, 'weather');
  const w = weatherInfo(hass, weatherId);
  const bubbles = statusBubbles(hass, config);
  const items = [
    ...nowItems(hass, config, ctx.rooms, now, ctx.heating(), (r) => ctx.window(r), ctx.alarmoSensors?.() ?? [], ctx.applianceRuns?.() ?? {}),
    ...technikItems(hass, config, now, { dismissed: ctx.dismissed, pauseUntil: ctx.piholePause }),
  ];
  const rooms = roomSummaries(hass, ctx.rooms, (r) => ctx.window(r));
  const tech = isTechUser(hass, config) && hasTechnik(hass, config);
  const techAlert = tech && technikProblemCount(hass, config, now, { dismissed: ctx.dismissed, pauseUntil: ctx.piholePause }) > 0;

  return html`
    <div class="overview">
      <header class="head">
        <div>
          <div class="date">${dateLine(now)}</div>
          <h1>${greeting(now)}</h1>
        </div>
        <span class="head-actions">
        ${tech
          ? html`<button class="tech-btn" aria-label=${techAlert ? 'Technik öffnen, es gibt Meldungen' : 'Technik öffnen'} @click=${() => ctx.openSheet({ id: 'technik' })}>
              ${icon(I.server, 20, 'rgba(255,255,255,0.85)', 2)}${techAlert ? html`<span class="tech-dot"></span>` : nothing}
            </button>`
          : nothing}
        <button class="weather" aria-label="Wetter öffnen" @click=${() => ctx.openSheet({ id: 'weather' })}>
          <span class="circle" style="width:40px;height:40px;background:rgba(143,208,255,0.2)">${weatherAnim(hass.states[weatherId]?.state ?? '', 20, '#8fd0ff')}</span>
          <span>
            <span class="wp-temp">${w.temp}</span>
            <span class="wp-label">${w.label}</span>
          </span>
        </button>
        </span>
      </header>

      <div class="status">
        ${bubbles.map((b) => html`
          <button class="bubble" aria-label="${b.label}: ${b.value}" ${hold(statusActions(ctx, b))}>
            <span class="circle ${b.wobble ? 'wobble' : ''}" style="width:34px;height:34px;background:${b.color}">${icon(b.icon, 17, '#111')}</span>
            <span class="b-value ellipsis">${b.value}</span>
            <span class="b-label ellipsis">${b.label}</span>
          </button>
        `)}
      </div>

      <section class="section" aria-labelledby="now-h">
        <div class="section-head">
          <h2 id="now-h">Aktuell</h2>
          <span class="rule" aria-hidden="true"></span>
          <span class="meta">${items.length || ''}</span>
        </div>
        ${items.length
          ? html`<div class="now-grid">${nowLayout(items).map((l) => renderItem(ctx, l.item, l.wide))}</div>`
          : html`
            <div class="now calm wide">
              <span class="circle" style="width:34px;height:34px;background:#30d158">${icon(I.check, 16, '#101010', 2.4)}</span>
              <span class="now-text">
                <span class="now-title">Alles ruhig</span>
                <span class="now-sub">Gerade gibt es nichts zu tun</span>
              </span>
            </div>`}
      </section>

      <section class="section" aria-labelledby="rk-h">
        <div class="section-head">
          <h2 id="rk-h">Zusammenfassung</h2>
          <span class="rule" aria-hidden="true"></span>
          ${rooms.some((r) => r.aq)
            ? html`<span class="meta" style="font-size:11px">
                <span class="dot" style="background:#30d158"></span><span class="dot" style="background:#ffd60a"></span><span class="dot" style="background:#ff453a;margin-right:3px"></span>Luftqualität
              </span>`
            : nothing}
        </div>
        <div class="sum-grid">
          ${rooms.map((r) => {
            const accent = roomAccent(r.win, r.heating);
            return html`
              <button class="room ${accent}" @click=${() => ctx.openSheet({ id: 'room', slug: r.room.slug })}
                aria-label="${r.room.name}: ${r.temp} Grad, ${r.hum} Prozent">
                <span class="circle room-circle">${icon(r.icon, 16, accent ? '#141008' : '#fff', 2)}</span>
                <span class="room-text">
                  <span class="room-name"><span class="ellipsis">${r.room.name}</span>${r.aq ? html`<span class="dot" style="background:${r.aq}"></span>` : nothing}</span>
                  <span class="room-sub">${r.hum} %${r.note ? ` · ${r.note}` : ''}${winMark(r.win)}</span>
                </span>
                <span class="room-temp">${r.temp}°</span>
              </button>
            `;
          })}
        </div>
      </section>
    </div>
  `;
}

export const overviewStyles = css`
  .overview {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px 0 6px;
  }
  .date {
    font-size: 14px;
    color: var(--sd-muted);
  }
  .head h1 {
    margin-top: 2px;
    font-size: 28px;
    font-weight: 700;
  }
  .head-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .tech-btn {
    position: relative;
    width: 52px;
    height: 52px;
    border-radius: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.08);
  }
  .tech-dot {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 11px;
    height: 11px;
    border-radius: 6px;
    background: #ff453a;
    box-shadow: 0 0 0 2.5px var(--sd-bg, #0e1016);
  }
  .weather {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 52px;
    padding: 0 14px 0 6px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.08);
  }
  .wp-temp {
    display: block;
    font-size: 18px;
    font-weight: 700;
    line-height: 1;
  }
  .wp-label {
    display: block;
    font-size: 11px;
    color: var(--sd-muted);
  }
  .status {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 6px;
  }
  .bubble {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 2px 8px;
    border-radius: 22px;
    background: var(--sd-fill);
    min-width: 0;
    touch-action: manipulation;
  }
  .bubble > span:not(.circle) {
    max-width: 100%;
  }
  .b-value {
    font-size: 13px;
    font-weight: 700;
  }
  .b-label {
    font-size: 11px;
    color: var(--sd-muted);
  }
  .now-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }
  .now {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 50px;
    padding: 0 8px;
    border-radius: 25px;
    width: 100%;
    min-width: 0;
  }
  .now.wide {
    grid-column: 1 / -1;
  }
  .now {
    position: relative;
    overflow: hidden;
  }
  .now-value {
    flex-shrink: 0;
    font-size: 13px;
    font-weight: 700;
    margin-right: 8px;
    filter: brightness(1.25);
  }
  .now-progress {
    position: absolute;
    left: 42px;
    bottom: 0;
    height: 3px;
    border-radius: 2px;
  }
  .now-main {
    flex: 1;
    min-width: 0;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    text-align: left;
  }
  .now-main:disabled {
    cursor: default;
  }
  .now.calm {
    background: linear-gradient(90deg, rgba(48, 209, 88, 0.2), rgba(255, 255, 255, 0.05) 75%);
  }
  .now-text {
    flex: 1;
    min-width: 0;
  }
  .now-title {
    display: block;
    font-size: 13px;
    font-weight: 600;
  }
  /* Half-width tiles: smaller title so "Waschmaschine läuft" fits at 390 px. */
  .now:not(.wide) .now-title {
    font-size: 11px;
    letter-spacing: -0.1px;
  }
  .now-sub {
    display: block;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.8);
  }
  .now-action {
    flex-shrink: 0;
    height: 32px;
    padding: 0 14px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 700;
    margin-right: 2px;
    color: #101010;
  }
  .sum-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }
  .room {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 48px;
    padding: 0 4px 0 5px;
    border-radius: 24px;
    background: var(--sd-fill);
    min-width: 0;
  }
  .room-circle {
    width: 36px;
    height: 36px;
    background: var(--sd-fill-2);
  }
  .room.heat {
    background: rgba(255, 159, 10, 0.12);
  }
  .room.heat .room-circle {
    background: #ff9f0a;
  }
  .room.vent {
    background: rgba(90, 200, 250, 0.14);
  }
  .room.vent .room-circle {
    background: #5ac8fa;
  }
  .room-text {
    flex: 1;
    min-width: 0;
  }
  .room-name {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 600;
  }
  .room-air {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    margin-left: 5px;
    vertical-align: -2px;
    font-weight: 700;
  }
  .room.alert {
    background: rgba(255, 69, 58, 0.14);
  }
  .room.alert .room-circle {
    background: #ff453a;
  }
  .room-sub {
    display: block;
    font-size: 11px;
    color: var(--sd-muted);
  }
  .room.heat .room-sub {
    color: #ffc061;
  }
  .room.vent .room-sub {
    color: #8fd8ff;
    font-weight: 600;
  }
  .room-temp {
    font-size: 15px;
    font-weight: 700;
    margin-right: 8px;
  }
`;
