import { css, html, nothing, type TemplateResult } from 'lit';
import '../components/slider';
import { icon, sheet } from '../components/ui';
import { deviceIcon, I, ID, IC } from '../icons';
import { ent } from '../logic/entities';
import {
  DEHUMIDIFIER_MODES,
  devicePower,
  displayName,
  lightCaps,
  lightPresets,
  lightTone,
  purifierState,
  sheetKind,
  watts,
} from '../logic/devices';
import { minutesUntil } from '../logic/rooms-page';
import type { Room } from '../logic/rooms';
import { aqColor } from '../logic/overview';
import { entityArea, fmt, num } from '../logic/util';
import type { PageContext } from '../pages/context';

const YELLOW = '#ffd60a';
const GREEN = '#30d158';
const BLUE = '#5ac8fa';

const SWATCHES: [name: string, css: string, hs: [number, number]][] = [
  ['Rot', '#ff453a', [3, 100]],
  ['Orange', '#ff9f0a', [35, 100]],
  ['Gelb', '#ffd60a', [50, 100]],
  ['Grün', '#30d158', [135, 90]],
  ['Türkis', '#64d2ff', [195, 80]],
  ['Blau', '#0a84ff', [215, 100]],
  ['Lila', '#bf5af2', [285, 80]],
];

/** Tap on a device tile: lights via light.toggle, everything else via homeassistant.toggle. */
export function toggleDevice(ctx: PageContext, id: string) {
  const st = ctx.hass.states[id]?.state;
  if (!st || st === 'unavailable' || st === 'unknown') return;
  if (id.startsWith('light.')) ctx.call('light', 'toggle', {}, { entity_id: id });
  else ctx.call('homeassistant', 'toggle', {}, { entity_id: id });
}

function roomOf(ctx: PageContext, id: string): Room | undefined {
  const a = entityArea(ctx.hass, id);
  return a ? ctx.rooms.find((r) => r.areas.includes(a)) : undefined;
}

function roomLabel(ctx: PageContext, id: string, room?: Room): string {
  if (room) return room.name;
  const a = entityArea(ctx.hass, id);
  return a ? (ctx.hass.areas[a]?.name ?? a) : '';
}

function toggleSwitch(ctx: PageContext, id: string, on: boolean, color: string, name: string) {
  return html`<button class="tgl ${on ? 'on' : ''}" aria-pressed=${on} aria-label="${name} ein/aus"
    style=${on ? `background:${color}` : ''} @click=${() => toggleDevice(ctx, id)}><span></span></button>`;
}

export function deviceSheet(ctx: PageContext, id: string): TemplateResult | typeof nothing {
  const s = ctx.hass.states[id];
  if (!s) return nothing;
  switch (sheetKind(ctx.hass, id)) {
    case 'light':
      return lightSheet(ctx, id);
    case 'purifier':
      return purifierSheet(ctx, id);
    case 'dehumidifier':
      return dehumidifierSheet(ctx, id);
    default:
      return switchSheet(ctx, id);
  }
}

// ---------- light ----------

function lightSheet(ctx: PageContext, id: string) {
  const { hass } = ctx;
  const s = hass.states[id];
  const a = s.attributes;
  const on = s.state === 'on';
  const room = roomOf(ctx, id);
  const name = displayName(hass, id, room, ctx.config.names);
  const caps = lightCaps(a);
  const bri = on ? Math.max(1, Math.round((Number(a.brightness) / 255) * 100) || 100) : 0;
  const tone = on ? lightTone(a) : undefined;
  const ct = caps.colorTemp;
  const kelvin = Number(a.color_temp_kelvin);
  const call = (data: Record<string, unknown>) => ctx.call('light', 'turn_on', data, { entity_id: id });

  return sheet({
    title: name,
    subtitle: [roomLabel(ctx, id, room), on ? (tone ?? 'an') : s.state === 'off' ? 'aus' : 'nicht erreichbar'].filter(Boolean).join(' · '),
    color: on ? YELLOW : 'rgba(255,255,255,0.12)',
    iconStroke: on ? '#2b2200' : '#fff',
    glow: on ? 'rgba(255,240,200,0.18)' : 'rgba(255,255,255,0.05)',
    iconPath: deviceIcon(id, name),
    headerExtra: toggleSwitch(ctx, id, on, YELLOW, name),
    onClose: ctx.closeSheet,
    body: html`
      <start-dashboard-slider variant="bubble" label="Helligkeit" .min=${0} .max=${100} .step=${1} .value=${bri}
        .format=${(v: number) => `${v} %`}
        @slide-change=${(e: CustomEvent<{ value: number }>) =>
          e.detail.value <= 0 ? ctx.call('light', 'turn_off', {}, { entity_id: id }) : call({ brightness_pct: e.detail.value })}>
        ${icon(ID.brightness, 22, bri > 8 ? '#2b2200' : '#fff', 2.2)}
      </start-dashboard-slider>

      ${ct
        ? html`<div>
            <start-dashboard-slider variant="knob" label="Farbtemperatur" .min=${ct.min} .max=${ct.max} .step=${50}
              .value=${Number.isFinite(kelvin) ? kelvin : Math.round((ct.min + ct.max) / 2)}
              .track=${'linear-gradient(90deg, #ffa94d, #fff1d6 50%, #d6ecff)'}
              .format=${(v: number) => `${fmt(v)} K`}
              @slide-change=${(e: CustomEvent<{ value: number }>) => call({ color_temp_kelvin: e.detail.value })}></start-dashboard-slider>
            <div class="ends"><span>warm ${fmt(ct.min)} K</span><span>kalt ${fmt(ct.max)} K</span></div>
          </div>`
        : nothing}

      ${caps.color
        ? html`<div>
            <div class="sublabel">Farbe</div>
            <div class="swatches">
              ${SWATCHES.map(([n, c, hs]) => html`<button class="swatch" aria-label=${n} style="background:${c}" @click=${() => call({ hs_color: hs })}></button>`)}
            </div>
          </div>`
        : nothing}

      ${caps.brightness
        ? html`<div class="grid3">
            ${lightPresets(caps).map((p) => html`<button class="dchip" @click=${() => call(p.data)}>${p.name}</button>`)}
          </div>`
        : nothing}
    `,
  });
}

// ---------- plug / switch / on-off lamp ----------

function offTimer(ctx: PageContext, id: string, options: [label: string, minutes: number][]) {
  const on = ctx.hass.states[id]?.state === 'on';
  const timeOpen = ctx.ui.timeInput === id;
  const set = ctx.ui.offAt as { id: string; at: number } | undefined;
  const start = (minutes: number) => {
    ctx.runScript(ent(ctx.config, 'delayed_off'), { entity: id, minutes });
    ctx.setUi({ offAt: { id, at: ctx.now.getTime() + minutes * 60_000 }, timeInput: undefined });
  };
  const until = set?.id === id && set.at > ctx.now.getTime() ? new Date(set.at) : undefined;
  return html`
    <div class="sublabel">Ausschalten in</div>
    <div class="grid4 ${on ? '' : 'disabled'}">
      ${options.map(([label, m]) => html`<button class="dchip sm" ?disabled=${!on} @click=${() => start(m)}>${label}</button>`)}
      <button class="dchip sm ${timeOpen ? 'sel' : ''}" ?disabled=${!on} aria-expanded=${timeOpen}
        @click=${() => ctx.setUi({ timeInput: timeOpen ? undefined : id })}>Zeit…</button>
    </div>
    ${timeOpen && on
      ? html`<div class="timerow">
          <input type="time" class="time" aria-label="Ausschalten um" .value=${(ctx.ui.timeValue as string) ?? ''}
            @input=${(e: Event) => ctx.setUi({ timeValue: (e.target as HTMLInputElement).value })} />
          <button class="dchip sm sel" ?disabled=${!ctx.ui.timeValue}
            @click=${() => ctx.ui.timeValue && start(minutesUntil(ctx.now, ctx.ui.timeValue as string))}>Starten</button>
        </div>`
      : nothing}
    ${until && on
      ? html`<div class="hint">${icon(IC.clock, 13, 'rgba(255,255,255,0.6)', 2.2)}Schaltet um
          ${until.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr aus</div>`
      : nothing}
  `;
}

function switchSheet(ctx: PageContext, id: string) {
  const { hass } = ctx;
  const s = hass.states[id];
  const on = s.state === 'on';
  const room = roomOf(ctx, id);
  const name = displayName(hass, id, room, ctx.config.names);
  const color = id.startsWith('light.') ? YELLOW : GREEN;
  const power = devicePower(hass, id);
  const state = on ? 'an' : s.state === 'off' ? 'aus' : 'nicht erreichbar';
  return sheet({
    title: name,
    subtitle: [roomLabel(ctx, id, room), state].filter(Boolean).join(' · '),
    color: on ? color : 'rgba(255,255,255,0.12)',
    iconStroke: on ? '#0b1a10' : '#fff',
    glow: on ? `${color}2e` : 'rgba(255,255,255,0.05)',
    iconPath: deviceIcon(id, name),
    headerExtra: toggleSwitch(ctx, id, on, color, name),
    onClose: ctx.closeSheet,
    body: html`
      ${power
        ? html`<button class="powerrow" @click=${() => ctx.moreInfo(power.id)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffc061" aria-hidden="true"><path d=${I.bolt}></path></svg>
            <span class="grow">${power.value !== null ? `verbraucht gerade ${watts(power.value)}` : 'Leistung nicht verfügbar'}</span>
            <span class="more">Verlauf ›</span>
          </button>`
        : nothing}
      ${offTimer(ctx, id, [['30 min', 30], ['1 h', 60], ['2 h', 120]])}
    `,
  });
}

// ---------- air purifier ----------

function purifierSheet(ctx: PageContext, id: string) {
  const { hass } = ctx;
  const s = hass.states[id];
  const a = s.attributes;
  const room = roomOf(ctx, id);
  const name = displayName(hass, id, room, ctx.config.names);
  const p = purifierState(s.state, a);
  const on = p.mode !== 'off';
  const presets: string[] = a.preset_modes ?? [];
  const step = 100 / p.levels;
  const pm = num(hass, room?.pm25);
  const modeName = { auto: 'Auto', sleep: 'Schlaf', manual: 'Manuell', off: 'aus' }[p.mode];
  const modes: [id: PurifierMode, label: string][] = [
    ['auto', 'Auto'],
    ...(presets.includes('sleep') ? ([['sleep', 'Schlaf']] as [PurifierMode, string][]) : []),
    ['manual', 'Manuell'],
  ];
  const setMode = (m: PurifierMode) => {
    if (m === 'manual') ctx.call('fan', 'set_percentage', { percentage: Math.round((p.level ?? 1) * step) }, { entity_id: id });
    else ctx.call('fan', 'set_preset_mode', { preset_mode: m }, { entity_id: id });
  };
  return sheet({
    title: name,
    subtitle: [roomLabel(ctx, id, room), modeName].filter(Boolean).join(' · '),
    color: on ? GREEN : 'rgba(255,255,255,0.12)',
    iconStroke: on ? '#0b1a10' : '#fff',
    glow: on ? 'rgba(48,209,88,0.16)' : 'rgba(255,255,255,0.05)',
    iconPath: ID.fan,
    headerExtra: html`
      ${pm !== null
        ? html`<span class="pmchip" style="background:${aqColor(pm)}2e;color:${aqColor(pm)}">
            <span class="dot" style="background:${aqColor(pm)}"></span>PM2.5 ${fmt(pm)}</span>`
        : nothing}
      ${toggleSwitch(ctx, id, on, GREEN, name)}`,
    onClose: ctx.closeSheet,
    body: html`
      <div class="grid3" role="radiogroup" aria-label="Modus">
        ${modes.map(([m, label]) => {
          const sel = p.mode === m;
          return html`<button class="dchip lg ${sel ? 'selg' : ''}" role="radio" aria-checked=${sel} @click=${() => setMode(m)}>${label}</button>`;
        })}
      </div>
      <div class="levelrow">
        <span class="lvl">Stufe</span>
        <div class="levels ${p.mode === 'manual' ? '' : 'disabled'}" style="grid-template-columns: repeat(${p.levels}, minmax(0, 1fr))">
          ${Array.from({ length: p.levels }, (_, i) => i + 1).map((n) => html`
            <button class="dchip md ${p.mode === 'manual' && p.level === n ? 'selg' : ''}" ?disabled=${p.mode !== 'manual'}
              aria-pressed=${p.level === n}
              @click=${() => ctx.call('fan', 'set_percentage', { percentage: Math.round(n * step) }, { entity_id: id })}>${n}</button>`)}
        </div>
      </div>
      <div class="hint">Stufen nur im Modus „Manuell“ aktiv.</div>
    `,
  });
}

type PurifierMode = 'auto' | 'sleep' | 'manual';

// ---------- dehumidifier ----------

function dehumidifierSheet(ctx: PageContext, id: string) {
  const { hass } = ctx;
  const s = hass.states[id];
  const a = s.attributes;
  const on = s.state === 'on';
  const room = roomOf(ctx, id);
  const name = displayName(hass, id, room, ctx.config.names);
  const min = Number(a.min_humidity) || 35;
  const max = Number(a.max_humidity) || 85;
  const step = Number(a.target_humidity_step) || 5;
  const target = ctx.pending(id, 'humidity') ?? (Number(a.humidity) || min);
  const cur = Number(a.current_humidity);
  const modes: string[] = (a.available_modes ?? Object.keys(DEHUMIDIFIER_MODES)) as string[];
  const stepBy = (d: number) => {
    const v = Math.min(max, Math.max(min, Math.round((target + d * step) / step) * step));
    ctx.setPending(id, 'humidity', v, () => ctx.call('humidifier', 'set_humidity', { humidity: v }, { entity_id: id }));
  };
  return sheet({
    title: name,
    subtitle: [roomLabel(ctx, id, room), on ? 'an' : 'aus', Number.isFinite(cur) ? `Gerät misst ${fmt(cur)} %` : ''].filter(Boolean).join(' · '),
    color: on ? BLUE : 'rgba(255,255,255,0.12)',
    iconStroke: on ? '#06202c' : '#fff',
    glow: on ? 'rgba(90,200,250,0.18)' : 'rgba(255,255,255,0.05)',
    iconPath: ID.drop,
    headerExtra: toggleSwitch(ctx, id, on, BLUE, name),
    onClose: ctx.closeSheet,
    body: html`
      <div class="humrow">
        <button class="hstep" aria-label="Zielfeuchte senken" ?disabled=${target <= min} @click=${() => stepBy(-1)}>−</button>
        <span class="hval"><span class="big">${fmt(target)} %</span><span class="small">Zielfeuchte · ${min}–${max} %</span></span>
        <button class="hstep" aria-label="Zielfeuchte erhöhen" ?disabled=${target >= max} @click=${() => stepBy(1)}>+</button>
      </div>
      <div class="modes" role="radiogroup" aria-label="Modus" style="grid-template-columns: repeat(${modes.length}, minmax(0, 1fr))">
        ${modes.map((m) => {
          const sel = a.mode === m;
          return html`<button class="dchip sm ${sel ? 'selb' : ''}" role="radio" aria-checked=${sel}
            @click=${() => ctx.call('humidifier', 'set_mode', { mode: m }, { entity_id: id })}>${DEHUMIDIFIER_MODES[m] ?? m}</button>`;
        })}
      </div>
      ${offTimer(ctx, id, [['1 h', 60], ['2 h', 120], ['4 h', 240]])}
    `,
  });
}

export const deviceStyles = css`
  .tgl {
    position: relative;
    flex-shrink: 0;
    width: 56px;
    height: 34px;
    border-radius: 17px;
    background: rgba(255, 255, 255, 0.18);
    transition: background 0.2s;
  }
  .tgl span {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 28px;
    height: 28px;
    border-radius: 14px;
    background: #fff;
    transition: left 0.2s;
  }
  .tgl.on span {
    left: 25px;
  }
  .ends {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
    padding: 4px 8px 0;
  }
  .sublabel {
    font-size: 13px;
    font-weight: 600;
    padding: 2px 8px 0;
  }
  .swatches {
    display: flex;
    justify-content: space-between;
    padding: 6px 4px 0;
  }
  .swatch {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    border: 2px solid rgba(255, 255, 255, 0.15);
  }
  .grid4 {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 6px;
  }
  .dchip {
    height: 44px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.08);
    font-size: 12px;
    font-weight: 600;
    text-align: center;
  }
  .dchip.sm {
    height: 40px;
    border-radius: 20px;
  }
  .dchip.md {
    height: 36px;
    border-radius: 18px;
    font-weight: 700;
  }
  .dchip.lg {
    font-size: 13px;
    font-weight: 700;
  }
  .dchip.sel {
    background: rgba(255, 255, 255, 0.22);
  }
  .dchip.selg {
    background: rgba(48, 209, 88, 0.3);
    color: #d6f8e0;
  }
  .dchip.selb {
    background: rgba(90, 200, 250, 0.3);
    color: #dff2ff;
  }
  .dchip:disabled {
    cursor: default;
  }
  .disabled {
    opacity: 0.5;
  }
  .powerrow {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 52px;
    padding: 0 14px;
    border-radius: 26px;
    background: rgba(255, 159, 10, 0.12);
    font-size: 14px;
    font-weight: 600;
  }
  .powerrow .more {
    font-size: 12px;
    font-weight: 400;
    color: var(--sd-muted);
  }
  .timerow {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 6px;
  }
  .timerow .dchip {
    padding: 0 18px;
  }
  .time {
    height: 40px;
    border-radius: 20px;
    border: none;
    padding: 0 14px;
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    font: 600 15px Rubik, system-ui, sans-serif;
    color-scheme: dark;
  }
  .hint {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.55);
    padding: 0 8px;
  }
  .pmchip {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 5px;
    height: 30px;
    padding: 0 10px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: 700;
  }
  .levelrow {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .lvl {
    width: 62px;
    font-size: 12px;
    font-weight: 600;
    padding-left: 8px;
    color: var(--sd-muted);
  }
  .levels {
    flex: 1;
    display: grid;
    gap: 4px;
  }
  .levels .dchip {
    background: rgba(255, 255, 255, 0.1);
  }
  .levels .dchip.selg {
    background: rgba(48, 209, 88, 0.3);
  }
  .humrow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    padding: 0 8px;
    border-radius: 32px;
    background: rgba(90, 200, 250, 0.1);
  }
  .hstep {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.12);
    font-size: 24px;
    text-align: center;
  }
  .hstep:disabled {
    opacity: 0.4;
  }
  .hval {
    text-align: center;
  }
  .hval .big {
    display: block;
    font-size: 26px;
    font-weight: 700;
    line-height: 1;
  }
  .hval .small {
    display: block;
    font-size: 11px;
    color: var(--sd-muted);
  }
  .modes {
    display: grid;
    gap: 4px;
  }
  .modes .dchip {
    font-size: 11px;
    font-weight: 700;
  }
`;
