import { css, html, nothing, type TemplateResult } from 'lit';
import { hold } from '../components/hold';
import { icon, sheet } from '../components/ui';
import { loadMonthEnergy } from '../data/series';
import { I, IC } from '../icons';
import {
  amsNote, amsSlots, clockOf, findPrinter, label, nozzleMax, NOZZLE_LOCK_C, powerLocked, printerState,
  type Printer, type PrinterState,
} from '../logic/printer';
import { isTechUser } from '../logic/technik';
import { BED_COOL_C } from '../logic/technik-now';
import { fmt, num, state } from '../logic/util';
import type { PageContext } from '../pages/context';
import { powerButton } from './technik';

const PURPLE = '#bf9bff';
const GREEN = '#30d158';
const RED = '#ff453a';
const YELLOW = '#ffd60a';
const ORANGE = '#ff9f0a';
const HOT = '#ffb37a';

const HEAD: Record<PrinterState['kind'], [string, string, string]> = {
  printing: [PURPLE, 'rgba(191,155,255,0.22)', '#1a0f2e'],
  finished: [GREEN, 'rgba(48,209,88,0.18)', '#06200e'],
  error: [RED, 'rgba(255,69,58,0.22)', '#1f0606'],
  idle: ['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.06)', '#fff'],
  off: ['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.05)', '#fff'],
  starting: ['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.05)', '#fff'],
  disconnected: ['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.05)', '#fff'],
};

function ring(progress: number, size: number, stroke: number, color: string) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, progress));
  return html`<svg width=${size} height=${size} viewBox="0 0 ${size} ${size}" aria-hidden="true" style="transform:rotate(-90deg)">
    <circle cx=${size / 2} cy=${size / 2} r=${r} fill="none" stroke="rgba(255,255,255,0.1)" stroke-width=${stroke}></circle>
    <circle cx=${size / 2} cy=${size / 2} r=${r} fill="none" stroke=${color} stroke-width=${stroke} stroke-linecap="round"
      stroke-dasharray="${c * p} ${c}"></circle></svg>`;
}

function remainText(hours: number | null): string | undefined {
  if (hours === null) return undefined;
  const m = Math.max(0, Math.round(hours * 60));
  return m < 60 ? `noch ${m} min` : `noch ${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')} min`;
}

function weight(ctx: PageContext, p: Printer): string | undefined {
  const g = num(ctx.hass, p.e.print_weight);
  return g === null ? undefined : `${fmt(Math.round(g))} g`;
}

function cover(ctx: PageContext, p: Printer) {
  const pic = p.e.cover_image ? ctx.hass.states[p.e.cover_image]?.attributes.entity_picture : undefined;
  return html`<span class="pr-cover" aria-label="Titelbild des Drucks">
    ${pic ? html`<img src=${pic} alt="" />` : icon(I.cube, 22, 'rgba(255,255,255,0.7)', 1.8)}</span>`;
}

function lightTile(ctx: PageContext, p: Printer, grid = false) {
  const id = p.e.chamber_light;
  if (!id || !ctx.hass.states[id]) return nothing;
  const on = state(ctx.hass, id) === 'on';
  const tap = () => ctx.call('light', on ? 'turn_off' : 'turn_on', {}, { entity_id: id });
  if (grid) {
    return html`<button class="pr-ctl" style="background:${on ? 'rgba(255,214,10,0.16)' : ''}" @click=${tap}>
      <span class="circle" style="width:34px;height:34px;background:${on ? YELLOW : 'rgba(255,255,255,0.12)'}">${icon(I.bulb, 16, on ? '#2b2200' : '#fff', 2.2)}</span>${on ? 'Licht an' : 'Licht aus'}</button>`;
  }
  return html`<button class="pr-tile" style="background:${on ? 'rgba(255,214,10,0.16)' : ''}" @click=${tap}>
    <span class="circle" style="width:40px;height:40px;background:${on ? YELLOW : 'rgba(255,255,255,0.12)'}">${icon(I.bulb, 18, on ? '#2b2200' : '#fff', 2.2)}</span>
    <span><span class="pr-t">Licht</span><span class="pr-s" style=${on ? 'color:#ffe680' : ''}>${on ? 'an' : 'aus'}</span></span></button>`;
}

function powerTile(ctx: PageContext, p: Printer, s: PrinterState, grid = false) {
  if (!p.plug) return nothing;
  const on = state(ctx.hass, p.plug) === 'on';
  const locked = on && powerLocked(ctx.hass, p, s);
  const sub = locked ? 'gesperrt' : on ? 'ausschalten' : 'einschalten';
  const btn = powerButton(ctx, p, s, grid ? 'pr-power-grid' : 'pr-power-tile');
  if (grid) return html`<span class="pr-ctl ${locked ? 'dim' : ''}">${btn}Strom</span>`;
  return html`<span class="pr-tile ${locked ? 'dim' : ''}">${btn}<span><span class="pr-t">Strom</span><span class="pr-s">${sub}</span></span></span>`;
}

function temps(ctx: PageContext, p: Printer) {
  const pills: [string | undefined, string][] = [
    [p.e.left_nozzle_temp ?? p.e.nozzle_temp, p.e.left_nozzle_temp ? 'Düse L' : 'Düse'],
    [p.e.right_nozzle_temp, 'Düse R'],
    [p.e.bed_temp, 'Bett'],
    [p.e.chamber_temp, 'Druckraum'],
  ];
  const shown = pills.filter(([id]) => num(ctx.hass, id) !== null);
  if (!shown.length) return nothing;
  return html`<div class="pr-grid" style="grid-template-columns:repeat(${shown.length}, minmax(0, 1fr))">
    ${shown.map(([id, l]) => {
      const v = num(ctx.hass, id)!;
      return html`<div class="pr-pill"><span class="pr-pv" style="color:${v >= NOZZLE_LOCK_C ? HOT : '#fff'}">${fmt(Math.round(v))}°</span><span class="pr-pl">${l}</span></div>`;
    })}</div>`;
}

function amsCard(ctx: PageContext, p: Printer) {
  const slots = amsSlots(ctx.hass, p);
  if (!slots.length) return nothing;
  const note = amsNote(ctx.hass, p);
  return html`<div class="pr-card pr-ams">
    <div class="pr-row"><span class="pr-h">AMS</span>${note ? html`<span class="pr-note">${note}</span>` : nothing}</div>
    <div class="pr-grid" style="grid-template-columns:repeat(${Math.max(4, slots.length)}, minmax(0, 1fr))">
      ${slots.map((sl) => html`<div class="pr-slot">
        <span class="circle ${sl.empty ? 'empty' : ''}" style="width:40px;height:40px;background:${sl.color ?? 'transparent'};box-shadow:${sl.active ? `0 0 0 3px #181a22, 0 0 0 5px ${PURPLE}` : 'inset 0 0 0 1px rgba(255,255,255,0.18)'}"></span>
        <span class="pr-st">${sl.type || '–'}</span>
        <span class="pr-pl ellipsis">${sl.name}</span>
        ${sl.remain !== undefined ? html`<span class="pr-pl">${fmt(sl.remain)} %</span>` : nothing}
      </div>`)}
    </div>
  </div>`;
}

function plugRow(ctx: PageContext, p: Printer) {
  const w = num(ctx.hass, p.plugPower);
  if (w === null) return nothing;
  return html`<div class="pr-line">${icon(I.power, 18, 'rgba(255,255,255,0.7)', 2)}<span class="pr-grow pr-b">Steckdose · ${fmt(Math.round(w))} W</span></div>`;
}

function monthRow(ctx: PageContext, p: Printer) {
  const id = p.plugEnergy;
  if (!id) return nothing;
  const d = ctx.series(`printer-month:${id}`, () => loadMonthEnergy(ctx.hass, id, ctx.now.getTime()), 15 * 60_000);
  const v = d.total;
  return html`<div class="pr-line">${icon(I.bolt, 18, 'rgba(255,255,255,0.7)', 2)}
    <span class="pr-grow pr-b">Diesen Monat</span>
    <span class="pr-v">${v === undefined || v === null ? (d.loading ? '…' : '–') : `${fmt(v, 1)} kWh`}</span></div>`;
}

function lastPrint(ctx: PageContext, p: Printer) {
  const name = state(ctx.hass, p.e.subtask_name);
  const end = state(ctx.hass, p.e.end_time);
  if (!name || name === 'unknown' || name === 'unavailable') return nothing;
  const t = clockOf(end);
  let when = '';
  if (t && end) {
    const d = new Date(Date.parse(end));
    const today = new Date(ctx.now); today.setHours(0, 0, 0, 0);
    const day = new Date(d); day.setHours(0, 0, 0, 0);
    const diff = Math.round((today.getTime() - day.getTime()) / 86400_000);
    when = diff === 0 ? `heute ${t}` : diff === 1 ? `gestern ${t}` : `${d.toLocaleDateString('de-DE', { day: 'numeric', month: 'numeric' })} ${t}`;
  }
  return html`<div class="pr-line">${icon(I.cube, 18, 'rgba(255,255,255,0.7)', 2)}
    <span class="pr-grow"><span class="pr-b ellipsis" style="display:block">Letzter Druck: ${name}</span>${when ? html`<span class="pr-pl">${when}</span>` : nothing}</span></div>`;
}

function camera(ctx: PageContext, p: Printer) {
  const id = p.controls.camera;
  const st = id ? ctx.hass.states[id] : undefined;
  if (!st || st.state === 'unavailable' || !customElements.get('ha-camera-stream')) return nothing;
  return html`<div class="pr-cam"><ha-camera-stream .hass=${ctx.hass} .stateObj=${st} .muted=${true} .controls=${false}></ha-camera-stream>
    <span class="pr-chip"><span class="pr-dotl"></span>Live</span></div>`;
}

function printing(ctx: PageContext, p: Printer, s: PrinterState) {
  const { hass } = ctx;
  const pct = Math.round((s.progress ?? 0) * 100);
  const cur = state(hass, p.e.current_layer);
  const tot = state(hass, p.e.total_layers);
  const end = clockOf(state(hass, p.e.end_time));
  const remain = remainText(num(hass, p.e.remaining_time));
  const name = state(hass, p.e.subtask_name);
  const w = weight(ctx, p);
  const speed = label(hass, p.e.speed_profile);
  const { pause, resume, stop } = p.controls;
  const pr = s.paused ? resume : pause;
  const controls: TemplateResult[] = [];
  if (pr) {
    controls.push(html`<button class="pr-ctl" style="background:rgba(255,214,10,0.16)" @click=${() => ctx.call('button', 'press', {}, { entity_id: pr })}>
      <span class="circle" style="width:34px;height:34px;background:${YELLOW}">${icon(s.paused ? IC.play : I.pause, 16, '#2b2200', 2.4)}</span>${s.paused ? 'Fortsetzen' : 'Pause'}</button>`);
  }
  if (stop) {
    const confirmStop = () => ctx.confirm({
      title: 'Druck abbrechen', text: 'Der laufende Druck wird abgebrochen und kann nicht fortgesetzt werden.', confirm: 'Abbrechen',
      color: RED, iconPath: I.printer, onConfirm: () => ctx.call('button', 'press', {}, { entity_id: stop }),
    });
    controls.push(html`<button class="pr-ctl" style="background:rgba(255,69,58,0.14)" ${hold({ hold: confirmStop })}>
      <span class="circle" style="width:34px;height:34px;background:${RED}">${icon(IC.stop, 16, '#1f0606', 2.4)}</span>Stopp</button>`);
  }
  const light = lightTile(ctx, p, true);
  const power = powerTile(ctx, p, s, true);
  const n = controls.length + (light === nothing ? 0 : 1) + (power === nothing ? 0 : 1);
  return html`
    ${camera(ctx, p)}
    <div class="pr-card pr-hero">
      <div class="pr-ring">${ring(s.progress ?? 0, 118, 10, s.paused ? YELLOW : PURPLE)}
        <span class="pr-ring-in"><span class="pr-big">${pct} %</span>${cur && tot ? html`<span class="pr-pl">Schicht ${cur}/${tot}</span>` : nothing}</span>
      </div>
      <div class="pr-hero-main">
        <div class="pr-row">${cover(ctx, p)}
          <span class="pr-grow"><span class="pr-b ellipsis" style="display:block">${name ?? ''}</span>${w ? html`<span class="pr-pl">${w}</span>` : nothing}</span></div>
        ${end ? html`<span><span class="pr-pl">fertig um</span><span class="pr-clock">${end}</span></span>` : nothing}
        ${remain ? html`<span class="pr-remain">${remain}</span>` : nothing}
      </div>
    </div>
    <div class="pr-status">
      <span class="pr-sdot" style="background:${s.paused ? YELLOW : GREEN}"></span>
      <span class="pr-b">${s.paused ? 'Pausiert' : 'Druckt'}</span>
      <span class="pr-grow pr-dim ellipsis">· Arbeitsschritt: ${label(hass, p.e.stage)}</span>
      ${speed ? html`<span class="pr-pl">${speed}</span>` : nothing}
    </div>
    ${n ? html`<div class="pr-grid" style="grid-template-columns:repeat(${n}, minmax(0, 1fr))">${controls}${light}${power}</div>` : nothing}
    ${p.plug ? html`<span class="pr-hint">${stop ? 'Stopp: halten zum Bestätigen · ' : ''}Strom gesperrt während Druck und bis Düse &lt; ${NOZZLE_LOCK_C}°</span>` : nothing}
    ${temps(ctx, p)}
    ${amsCard(ctx, p)}
    ${plugRow(ctx, p)}`;
}

function finished(ctx: PageContext, p: Printer, s: PrinterState) {
  const { hass } = ctx;
  const end = clockOf(state(hass, p.e.end_time));
  const bed = num(hass, p.e.bed_temp);
  const nozzle = nozzleMax(hass, p);
  const w = weight(ctx, p);
  const unlocked = !!p.plug && state(hass, p.plug) === 'on' && !powerLocked(hass, p, s);
  const plugW = num(hass, p.plugPower);
  return html`
    <div class="pr-card pr-hero" style="background:linear-gradient(160deg, rgba(48,209,88,0.2), rgba(255,255,255,0.05) 70%)">
      <div class="pr-ring" style="width:96px;height:96px">${ring(1, 96, 9, GREEN)}<span class="pr-ring-in">${icon(I.check, 34, GREEN, 3)}</span></div>
      <div class="pr-hero-main" style="gap:4px">
        ${end ? html`<span class="pr-pl">fertig um</span><span class="pr-clock">${end}</span>` : html`<span class="pr-clock">Fertig</span>`}
        <span class="pr-b ellipsis">${state(hass, p.e.subtask_name) ?? ''}</span>
        ${w ? html`<span class="pr-pl">${w}</span>` : nothing}
      </div>
    </div>
    ${bed !== null && bed >= BED_COOL_C
      ? html`<div class="pr-bed"><span class="circle" style="width:40px;height:40px;background:${ORANGE}">${icon(I.thermo, 18, '#2b1600', 2.2)}</span>
          <span class="pr-grow"><span class="pr-t">Druckbett ${fmt(Math.round(bed))}°</span><span class="pr-s" style="color:#ffc061">noch abkühlen lassen · unter ${BED_COOL_C}° entnehmen</span></span></div>`
      : nothing}
    <div class="pr-tiles">${lightTile(ctx, p)}${powerTile(ctx, p, s)}</div>
    ${unlocked && nozzle !== null
      ? html`<span class="pr-hint">Düse ist abgekühlt (${fmt(Math.round(nozzle))}°) · Ausschalten frei${plugW !== null ? ` · Steckdose ${fmt(Math.round(plugW))} W` : ''}</span>`
      : nothing}
    ${amsCard(ctx, p)}`;
}

function error(ctx: PageContext, p: Printer, s: PrinterState) {
  const { hass } = ctx;
  const cur = state(hass, p.e.current_layer);
  const tot = state(hass, p.e.total_layers);
  const { resume, stop } = p.controls;
  const pct = Math.round((s.progress ?? 0) * 100);
  return html`
    <div class="pr-err">
      <span class="pr-row"><span class="circle" style="width:34px;height:34px;background:${RED}">${icon(I.alert, 16, '#1f0606', 2.4)}</span>
        <span class="pr-t">${s.errorText ?? 'Fehler am Drucker'}</span></span>
      ${resume || stop ? nothing : html`<span class="pr-s" style="color:rgba(255,255,255,0.85)">Am Drucker oder in Bambu Handy fortsetzen.</span>`}
    </div>
    <div class="pr-line" style="height:auto;padding:12px 14px">
      <span class="pr-ring" style="width:56px;height:56px">${ring(s.progress ?? 0, 56, 6, 'rgba(255,255,255,0.45)')}<span class="pr-ring-in pr-b">${pct} %</span></span>
      <span class="pr-grow"><span class="pr-b ellipsis" style="display:block">${state(hass, p.e.subtask_name) ?? ''}</span>
        ${cur && tot ? html`<span class="pr-pl">Schicht ${cur} von ${tot} · angehalten</span>` : nothing}</span>
    </div>
    ${resume || stop
      ? html`<div class="pr-grid" style="grid-template-columns:repeat(${resume && stop ? 2 : 1}, minmax(0, 1fr))">
          ${resume ? html`<button class="pr-big-btn" style="background:${GREEN};color:#06200e" @click=${() => ctx.call('button', 'press', {}, { entity_id: resume })}>Fortsetzen</button>` : nothing}
          ${stop ? html`<button class="pr-big-btn" style="background:rgba(255,69,58,0.18);color:#ff8a80" @click=${() => ctx.confirm({
            title: 'Druck abbrechen', text: 'Der Druck wird abgebrochen.', confirm: 'Abbrechen', color: RED, iconPath: I.printer,
            onConfirm: () => ctx.call('button', 'press', {}, { entity_id: stop }),
          })}>Abbrechen</button>` : nothing}
        </div>`
      : nothing}
    <div class="pr-tiles">${lightTile(ctx, p)}${powerTile(ctx, p, s)}</div>`;
}

function quiet(ctx: PageContext, p: Printer, s: PrinterState) {
  const plugged = !!p.plug;
  const texts: Partial<Record<PrinterState['kind'], [string, string]>> = {
    off: ['Steckdose aus', 'Nach dem Einschalten braucht der Drucker etwa 1 min, bis er sich meldet.'],
    starting: ['Startet …', 'Drucker startet, das dauert etwa 1 min.'],
    disconnected: ['Nicht verbunden', plugged ? 'Steckdose an, aber keine Verbindung zum Drucker.' : 'Keine Verbindung zum Drucker.'],
  };
  const t = texts[s.kind];
  return html`
    ${t
      ? html`<div class="pr-quiet">
          <span class="circle" style="width:56px;height:56px;background:rgba(255,255,255,0.08)">${icon(I.printer, 26, 'rgba(255,255,255,0.75)', 1.8)}</span>
          <span class="pr-qt">${t[0]}</span>
          <span class="pr-pl" style="max-width:260px">${t[1]}</span>
          ${s.kind === 'off' && p.plug
            ? html`<button class="pr-on" @click=${() => ctx.call('switch', 'turn_on', {}, { entity_id: p.plug! })}>${icon(I.power, 16, '#06200e', 2.4)}Einschalten</button>`
            : nothing}
        </div>`
      : nothing}
    ${s.kind === 'idle' ? html`${temps(ctx, p)}${amsCard(ctx, p)}<div class="pr-tiles">${lightTile(ctx, p)}${powerTile(ctx, p, s)}</div>` : nothing}
    ${lastPrint(ctx, p)}
    ${monthRow(ctx, p)}`;
}

export function printerSheet(ctx: PageContext) {
  const { hass, config, now } = ctx;
  if (!isTechUser(hass, config)) return nothing;
  const p = findPrinter(hass, config);
  if (!p) return nothing;
  const s = printerState(hass, p, now, ctx.dismissed);
  const [color, glow, stroke] = HEAD[s.kind];
  const body = s.kind === 'printing' ? printing(ctx, p, s) : s.kind === 'finished' ? finished(ctx, p, s) : s.kind === 'error' ? error(ctx, p, s) : quiet(ctx, p, s);
  return sheet({
    title: '3D-Drucker',
    subtitle: s.status,
    color, glow, iconPath: I.printer, iconStroke: stroke,
    onClose: ctx.closeSheet,
    body: html`${body}`,
  });
}

export const printerStyles = css`
  .pr-grow { flex: 1; min-width: 0; }
  .pr-row { display: flex; align-items: center; gap: 8px; }
  .pr-card { border-radius: 28px; background: rgba(255, 255, 255, 0.06); padding: 14px; }
  .pr-hero { display: flex; gap: 14px; align-items: center; background: linear-gradient(160deg, rgba(191, 155, 255, 0.18), rgba(255, 255, 255, 0.05) 70%); }
  .pr-ring { position: relative; width: 118px; height: 118px; flex-shrink: 0; }
  .pr-ring-in { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .pr-big { font-size: 30px; font-weight: 700; line-height: 1; }
  .pr-hero-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .pr-cover { width: 46px; height: 46px; border-radius: 12px; background: rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
  .pr-cover img { width: 100%; height: 100%; object-fit: cover; }
  .pr-clock { display: block; font-size: 26px; font-weight: 700; line-height: 1.05; }
  .pr-remain { font-size: 13px; color: #d6c4ff; font-weight: 600; }
  .pr-b { font-size: 14px; font-weight: 600; }
  .pr-t { display: block; font-size: 14px; font-weight: 600; }
  .pr-s { display: block; font-size: 12px; color: rgba(255, 255, 255, 0.72); }
  .pr-pl { display: block; font-size: 11px; color: rgba(255, 255, 255, 0.72); }
  .pr-dim { font-size: 13px; color: rgba(255, 255, 255, 0.72); }
  .pr-status { display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 14px; border-radius: 20px; background: rgba(255, 255, 255, 0.06); font-size: 13px; }
  .pr-sdot { width: 8px; height: 8px; border-radius: 4px; flex-shrink: 0; }
  .pr-grid { display: grid; gap: 6px; }
  .pr-ctl { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; height: 72px; border-radius: 24px; font-size: 12px; font-weight: 600; color: #fff; background: rgba(255, 255, 255, 0.07); }
  .pr-ctl.dim { color: rgba(255, 255, 255, 0.45); }
  .pr-ctl .tk-power { width: 34px; height: 34px; }
  .pr-hint { margin: -4px 8px 0; font-size: 11px; color: rgba(255, 255, 255, 0.72); }
  .pr-pill { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 10px 4px; border-radius: 20px; background: rgba(255, 255, 255, 0.07); }
  .pr-pv { font-size: 15px; font-weight: 700; }
  .pr-ams { display: flex; flex-direction: column; gap: 12px; }
  .pr-h { flex: 1; font-size: 14px; font-weight: 600; }
  .pr-note { font-size: 12px; color: #7ee8a0; }
  .pr-slot { display: flex; flex-direction: column; align-items: center; gap: 3px; min-width: 0; text-align: center; }
  .pr-slot .circle.empty { border: 1.5px dashed rgba(255, 255, 255, 0.35); box-shadow: none !important; }
  .pr-slot .pr-pl { max-width: 100%; }
  .pr-st { font-size: 12px; font-weight: 600; }
  .pr-line { display: flex; align-items: center; gap: 12px; min-height: 52px; padding: 0 14px; border-radius: 26px; background: rgba(255, 255, 255, 0.06); }
  .pr-v { font-size: 13px; color: rgba(255, 255, 255, 0.85); }
  .pr-bed { display: flex; align-items: center; gap: 10px; height: 56px; padding: 0 8px; border-radius: 28px; background: rgba(255, 159, 10, 0.12); }
  .pr-tiles { display: flex; gap: 6px; }
  .pr-tile { flex: 1; min-width: 0; display: flex; align-items: center; gap: 10px; height: 56px; padding: 0 8px; border-radius: 28px; color: #fff; text-align: left; background: rgba(255, 255, 255, 0.07); }
  .pr-tile.dim .pr-s { color: rgba(255, 255, 255, 0.5); }
  .pr-err { display: flex; flex-direction: column; gap: 6px; padding: 14px; border-radius: 24px; border: 1px solid rgba(255, 69, 58, 0.45); background: linear-gradient(90deg, rgba(255, 69, 58, 0.24), rgba(255, 69, 58, 0.06)); }
  .pr-err .pr-t { font-size: 15px; font-weight: 700; }
  .pr-big-btn { height: 48px; border-radius: 24px; font-size: 14px; font-weight: 700; }
  .pr-quiet { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 20px 16px; border-radius: 28px; background: rgba(255, 255, 255, 0.05); text-align: center; }
  .pr-quiet .pr-pl { font-size: 12px; }
  .pr-qt { font-size: 16px; font-weight: 600; }
  .pr-on { margin-top: 6px; height: 44px; padding: 0 22px; border-radius: 22px; font-size: 14px; font-weight: 700; background: #30d158; color: #06200e; display: flex; align-items: center; gap: 8px; }
  .pr-cam { position: relative; border-radius: 28px; overflow: hidden; background: #111116; }
  .pr-cam ha-camera-stream { display: block; width: 100%; }
  .pr-chip { position: absolute; left: 12px; top: 12px; display: flex; align-items: center; gap: 5px; height: 26px; padding: 0 10px; border-radius: 13px; font-size: 11px; font-weight: 600; background: rgba(0, 0, 0, 0.55); }
  .pr-dotl { width: 7px; height: 7px; border-radius: 4px; background: #ff453a; }
`;
