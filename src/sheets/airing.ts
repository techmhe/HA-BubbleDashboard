import { css, html, nothing } from 'lit';
import { icon, sheet } from '../components/ui';
import { I, IC } from '../icons';
import { trendFigure } from '../components/trend';
import { loadAiringRoom } from '../data/series';
import { airingInfo, airingVerdict, clock } from '../logic/climate';
import { ent } from '../logic/entities';
import { durationText, fmt, minutesSince, num, state } from '../logic/util';
import type { PageContext } from '../pages/context';

export function airingSheet(ctx: PageContext) {
  const { hass, now } = ctx;
  const a = airingInfo(hass, ctx.rooms, ctx.config, now);
  const start = () => ctx.runScript(ent(ctx.config, 'airing_start'));
  const running = a.active || a.paused;
  const pct = running && a.duration ? Math.max(0, Math.min(100, (a.remaining / a.duration) * 100)) : 100;
  const status = a.paused ? 'pausiert' : a.active ? (a.remaining > 0 ? 'läuft' : 'fertig') : 'bereit';
  const openRoom = (slug: string) => ctx.openSheet({ id: 'airingRoom', slug });
  const single = a.recommended.length === 1 ? a.recommended[0] : a.openWindows.length === 1 ? a.openWindows[0] : null;

  return sheet({
    title: single ? `Lüften · ${single.name}` : 'Lüften',
    color: '#5ac8fa',
    glow: 'rgba(90,200,250,0.24)',
    iconPath: I.wind,
    iconStroke: '#06202c',
    onClose: ctx.closeSheet,
    body: html`
      <div class="ringcard">
        <span class="ring" style="background: conic-gradient(#5ac8fa 0 ${pct}%, rgba(255,255,255,0.1) ${pct}% 100%)">
          <span class="ring-in">
            <span class="ring-time">${clock(a.remaining)}</span>
            <span class="ring-status">${status}</span>
          </span>
        </span>
        <div class="ring-info">
          <span><span class="muted">Fenster offen</span> <strong>${a.openWindows.length || 'keins'}</strong></span>
          <span><span class="muted">Empfohlen</span> <strong>${a.recommended.length ? `${a.recommended.length} ${a.recommended.length === 1 ? 'Raum' : 'Räume'}` : 'keiner'}</strong></span>
        </div>
      </div>

      ${a.openWindows.length
        ? html`
          <div class="section-head"><h2>Offene Fenster</h2><span class="rule" aria-hidden="true"></span></div>
          <div class="chips">
            ${a.openWindows.map((r) => html`<button class="chip open" @click=${() => openRoom(r.slug)}>${icon(I.window, 14, '#ff8a80', 2.4)}${r.name}
              <span class="chip-meta">${durationText(minutesSince(hass, r.window!, now))}</span></button>`)}
          </div>`
        : nothing}

      ${a.recommended.length
        ? html`
          <div class="section-head"><h2>Lüften empfohlen</h2><span class="rule" aria-hidden="true"></span></div>
          <div class="chips">
            ${a.recommended.map((r) => {
              const h = num(hass, r.humidity);
              return html`<button class="chip rec" @click=${() => openRoom(r.slug)}>${icon(IC.drop, 14, '#8fd8ff', 2.4)}${r.name}${h !== null ? html`<span class="chip-meta">${fmt(Math.round(h))} %</span>` : nothing}</button>`;
            })}
          </div>`
        : nothing}

      ${running
        ? html`<div class="confirm-row" style="margin-top:4px">
            <button class="btn" @click=${start}>Neu starten</button>
            <button class="btn primary" style="background:#5ac8fa;color:#06202c"
              @click=${() => ctx.call('timer', 'cancel', {}, { entity_id: ent(ctx.config, 'airing_timer') })}>Stopp</button>
          </div>`
        : html`<button class="btn primary" style="background:#5ac8fa;color:#06202c;margin-top:4px"
            @click=${start}>Lüften starten</button>`}
    `,
  });
}


const BANDS = { now: 'rgba(48,209,88,0.2)', possible: 'rgba(0,0,0,0)' };
const hhmm = (t: number) => {
  const d = new Date(t);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

/** Last 15 minutes of a room's temperature and humidity, marked where the dew point said airing no longer helps. */
export function airingRoomSheet(ctx: PageContext, slug: string) {
  const room = ctx.rooms.find((r) => r.slug === slug);
  if (!room) return nothing;
  const { hass } = ctx;
  const load = (id: string) => ctx.series(`airroom:${id}`, () => loadAiringRoom(hass, id, room.airing), 30_000);
  const temp = load(room.temperature);
  const hum = load(room.humidity);
  const bands = hum.bands ?? temp.bands ?? [];
  const end = hum.end || temp.end || ctx.now.getTime();
  const v = airingVerdict(bands, end);
  const marker = v.kind === 'ended' ? { t: v.at, label: hhmm(v.at) } : undefined;
  const verdict = v.kind === 'running'
    ? { text: 'Lüften lohnt noch', color: '#30d158' }
    : v.kind === 'ended'
      ? { text: `Taupunkt erreicht · ${hhmm(v.at)}`, color: '#8fd8ff' }
      : { text: `Nicht empfohlen · ${state(hass, room.airing) ?? '–'}`, color: 'rgba(255,255,255,0.75)' };
  const start = hum.start || temp.start;
  const labels = start ? [hhmm(start), hhmm(start + 5 * 60_000), hhmm(start + 10 * 60_000), 'jetzt'] : [];
  const t = num(hass, room.temperature);
  const h = num(hass, room.humidity);
  const dewIn = num(hass, `sensor.${slug}_taupunkt`);
  const dewOut = num(hass, ent(ctx.config, 'outdoor_dew'));
  const open = room.window && state(hass, room.window) === 'on';

  return sheet({
    title: 'Lüften',
    subtitle: room.name,
    color: '#5ac8fa',
    glow: 'rgba(90,200,250,0.24)',
    iconPath: I.wind,
    iconStroke: '#06202c',
    onClose: ctx.closeSheet,
    onBack: () => ctx.openSheet({ id: 'airing' }),
    body: html`
      <div class="ar-status" style="color:${verdict.color}">
        <span class="dot" style="background:${verdict.color}"></span>${verdict.text}
        ${open ? html`<span class="ar-meta">Fenster offen · ${durationText(minutesSince(hass, room.window!, ctx.now))}</span>` : nothing}
      </div>
      ${trendFigure({
        title: 'Temperatur', color: '#ff9f0a', unit: '°C', digits: 1, snap: 0.5, data: temp, labels, marker, bandColors: BANDS,
        caption: t !== null ? `jetzt ${fmt(t, 1)}°` : undefined,
      })}
      ${trendFigure({
        title: 'Luftfeuchte', color: '#5ac8fa', unit: '%', digits: 0, snap: 2, data: hum, labels, marker, bandColors: BANDS,
        caption: h !== null ? `jetzt ${fmt(Math.round(h))} %` : undefined,
      })}
      <p class="ar-hint">${icon(IC.drop, 13, 'rgba(255,255,255,0.6)', 2.2)}Taupunkt
        ${dewIn !== null ? html`innen <strong>${fmt(dewIn, 1)}°</strong>` : nothing}
        ${dewOut !== null ? html` · außen <strong>${fmt(dewOut, 1)}°</strong>` : nothing}
        · grün = Lüften empfohlen</p>
    `,
  });
}

export const airingStyles = css`
  .ringcard {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-radius: 34px;
    background: rgba(90, 200, 250, 0.1);
  }
  .ring {
    flex-shrink: 0;
    width: 112px;
    height: 112px;
    border-radius: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ring-in {
    width: 92px;
    height: 92px;
    border-radius: 46px;
    background: var(--sd-sheet);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .ring-time {
    font-size: 26px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .ring-status {
    font-size: 11px;
    color: #8fd8ff;
  }
  .ring-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 13px;
  }
  .muted {
    color: var(--sd-muted);
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .chip {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 38px;
    padding: 0 12px 0 10px;
    border-radius: 19px;
    font-size: 13px;
    font-weight: 600;
  }
  button.chip {
    font-size: 13px;
    font-weight: 600;
  }
  .ar-status {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-radius: 22px;
    background: var(--sd-fill);
    font-size: 14px;
    font-weight: 600;
  }
  .ar-meta {
    margin-left: auto;
    font-size: 12px;
    font-weight: 400;
    color: var(--sd-muted);
  }
  .ar-hint {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    margin: 0 6px;
    font-size: 12px;
    color: var(--sd-muted);
  }
  .chip.open {
    background: rgba(255, 69, 58, 0.16);
  }
  .chip.rec {
    background: rgba(90, 200, 250, 0.16);
  }
  .chip-meta {
    font-weight: 400;
    color: var(--sd-muted);
  }
`;
