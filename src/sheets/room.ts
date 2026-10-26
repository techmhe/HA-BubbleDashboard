import { css, html, nothing } from 'lit';
import { hold } from '../components/hold';
import { deviceGlyph } from '../components/motion';
import { icon, mdi, SCENE_COLORS, sheet } from '../components/ui';
import { I, IC, PRESET_ICONS, roomIcon } from '../icons';
import { clock, PRESETS, roomClimate, temp } from '../logic/climate';
import { roomAccent, type WindowState } from '../logic/window-state';
import { ent } from '../logic/entities';
import { activeScenes, lightTint, roomDevices, roomScenes } from '../logic/devices';
import { durationText, fmt, num, state } from '../logic/util';
import type { PageContext } from '../pages/context';
import { toggleDevice } from './device';

/** Window fact in the room card, by airing state. */
function windowFact(w: WindowState) {
  const f = (value: string, c: string, tint: string) => ({ value, label: 'Fenster', icon: I.window, c, tint });
  switch (w.kind) {
    case 'airing':
      return f(w.remaining > 0 ? `lüftet ${clock(w.remaining)}` : 'lüftet', '#5ac8fa', 'rgba(90,200,250,0.14)');
    case 'overdue':
      return f(`offen ${durationText(w.openMin)} · ${w.reason}`, '#ff6b61', 'rgba(255,69,58,0.14)');
    case 'stuck':
      return f('Sensor prüfen', '#aeb4c0', 'rgba(255,255,255,0.07)');
    case 'open':
      return f('offen (ignoriert)', '#aeb4c0', 'rgba(255,255,255,0.07)');
    default:
      return f('zu', '#7ee8a0', 'rgba(255,255,255,0.07)');
  }
}

export function roomSheet(ctx: PageContext, slug: string) {
  const { hass } = ctx;
  const room = ctx.rooms.find((r) => r.slug === slug);
  if (!room) return nothing;
  const c = roomClimate(hass, room, ctx.target(room.climate));
  const climate = room.climate;
  const accent = roomAccent(room.window ? ctx.window(room) : { kind: 'none', openMin: 0, remaining: 0 }, c.heating);
  const color = { alert: '#ff453a', vent: '#5ac8fa', heat: '#ff9f0a', '': 'rgba(255,255,255,0.16)' }[accent];
  const glow = { alert: 'rgba(255,69,58,0.2)', vent: 'rgba(90,200,250,0.2)', heat: 'rgba(255,159,10,0.2)', '': 'rgba(255,255,255,0.06)' }[accent];
  const heat = ctx.heating().find((a) => a.slug === room.slug);
  const stateLine = heat
    ? `Heizung prüfen · +${fmt(heat.rise, 1)}° in ${heat.hours} h ohne Heizbedarf`
    : c.off ? 'Aus' : c.heating ? `heizt${c.valve !== null ? ` · Ventile ${c.valve} %` : ''}` : 'Soll erreicht';
  const scenes = roomScenes(hass, room);
  const active = activeScenes(hass, scenes.map((s) => s.id), ctx.sceneConfigs(), ctx.now);
  const devices = roomDevices(hass, room, ctx.config.names);
  const outDew = num(hass, ent(ctx.config, 'outdoor_dew'));
  const timerActive = state(hass, ent(ctx.config, 'airing_timer')) === 'active';

  const facts = [
    c.pm25 !== null
      ? { value: fmt(c.pm25), label: 'PM2.5', icon: IC.leaf, c: c.aq!, tint: c.aq + '1f' }
      : null,
    c.dew !== null
      ? { value: `${fmt(c.dew, 1)}°`, label: 'Taupunkt', icon: IC.drop, c: '#8fd8ff', tint: 'rgba(143,216,255,0.12)',
          tap: () => ctx.openSheet({ id: 'dew', slug, range: '24h' }) }
      : null,
    room.window ? windowFact(ctx.window(room)) : null,
  ].filter((f): f is NonNullable<typeof f> => !!f);

  const airText = [c.dew !== null ? `Taupunkt ${fmt(c.dew, 1)}°` : '', outDew !== null ? `außen ${fmt(outDew, 1)}°` : ''].filter(Boolean).join(' vs. ');

  return sheet({
    title: room.name,
    color,
    glow,
    iconPath: roomIcon(room.name, room.icon),
    iconStroke: accent ? '#1a1206' : '#fff',
    onClose: ctx.closeSheet,
    headerExtra: html`
      <button class="histpill" aria-label="Verlauf Temperatur und Luftfeuchte"
        @click=${() => ctx.openSheet({ id: 'history', slug, range: '24h' })}>
        ${icon(I.thermo, 14, '#ffc061', 2.4)}${temp(c.cur)}°
        ${icon(IC.drop, 14, '#8fd8ff', 2.4)}${c.hum ?? '–'} %
        ${icon(IC.trend, 12, 'rgba(255,255,255,0.7)', 2.6)}
      </button>`,
    body: html`
      <div class="tcard" style="background: linear-gradient(140deg, ${c.heating ? 'rgba(255,159,10,0.3)' : 'rgba(255,255,255,0.1)'}, rgba(255,255,255,0.05) 70%)">
        <div class="tcontrol">
          <button class="bigstep" aria-label="Soll senken" ?disabled=${!climate} @click=${() => climate && ctx.stepTarget(climate, -0.5)}>−</button>
          <div class="tcenter">
            <div class="tstate" style="color:${heat ? '#ff9f0a' : c.heating ? '#ffd29a' : 'rgba(255,255,255,0.75)'}">
              ${c.heating ? icon(IC.flame, 13, '#ffd29a', 2.4) : nothing}${stateLine}
            </div>
            <div class="tbig" style="color:${c.heating ? '#ffc061' : '#fff'}">${temp(c.target)}°</div>
            <div class="tsoll">Ist <strong>${temp(c.cur)}°</strong></div>
          </div>
          <button class="bigstep" aria-label="Soll erhöhen" ?disabled=${!climate} @click=${() => climate && ctx.stepTarget(climate, 0.5)}>+</button>
        </div>
        ${climate
          ? html`<div class="presets" role="group" aria-label="Preset">
              ${PRESETS.map((p) => {
                const active = c.preset === p.id;
                const t = c.presetTemps[p.id];
                return html`
                  <button class="rpreset ${active ? 'active' : ''}" aria-pressed=${active}
                    @click=${() => ctx.call('climate', 'set_preset_mode', { preset_mode: p.id }, { entity_id: climate })}>
                    <span class="circle" style="width:32px;height:32px;background:${p.color}">${icon(PRESET_ICONS[p.id], 16, '#101010', 2.3)}</span>
                    <span class="pname">${p.name}</span>
                    <span class="ptemp">${t !== undefined ? `${fmt(t, t % 1 ? 1 : 0)}°` : '–'}</span>
                  </button>`;
              })}
            </div>`
          : nothing}
      </div>

      ${scenes.length
        ? html`<div class="grid3" role="group" aria-label="Szenen">
            ${scenes.map((s, i) => {
              const bg = s.off ? 'rgba(255,255,255,0.14)' : SCENE_COLORS[i % SCENE_COLORS.length];
              const stroke = s.off ? '#fff' : '#101010';
              const on = active.has(s.id);
              return html`<button class="scene ${on ? 'on' : ''}" aria-pressed=${on} style=${on ? `background:${s.off ? 'rgba(255,255,255,0.2)' : bg + '33'};box-shadow:0 0 18px ${s.off ? 'rgba(255,255,255,0.08)' : bg + '40'}` : ''}
                @click=${() => ctx.call('scene', 'turn_on', {}, { entity_id: s.id })}>
                <span class="circle" style="width:36px;height:36px;background:${bg}">${s.off ? icon(IC.power, 16, stroke, 2.1) : mdi(s.icon, IC.scene, stroke)}</span>
                <span class="ellipsis">${s.name}</span>
              </button>`;
            })}
          </div>`
        : nothing}

      ${facts.length
        ? html`<div class="facts" style="grid-template-columns: repeat(${facts.length}, minmax(0, 1fr))">
            ${facts.map((f) => {
              const inner = html`${icon(f.icon, 18, f.c, 2)}<span class="fv">${f.value}</span><span class="fl">${f.label}</span>`;
              return 'tap' in f && f.tap
                ? html`<button class="fact" style="background:${f.tint}" aria-label="${f.label}, Verlauf anzeigen" @click=${f.tap}>${inner}</button>`
                : html`<div class="fact" style="background:${f.tint}">${inner}</div>`;
            })}
          </div>`
        : nothing}

      ${c.airing
        ? html`<div class="airrow">
            <span class="circle" style="width:40px;height:40px;background:rgba(90,200,250,0.25)">${icon(I.wind, 18, '#8fd8ff', 2.2)}</span>
            <span class="grow"><span class="t1s">${timerActive ? 'Lüften läuft' : c.airing}</span><span class="t2s">${airText}</span></span>
            ${timerActive
              ? html`<button class="airbtn" @click=${() => ctx.openSheet({ id: 'airing' })}>Ansehen</button>`
              : c.airing !== 'Nicht lüften'
                ? html`<button class="airbtn" @click=${() => { ctx.runScript(ent(ctx.config, 'airing_start')); ctx.openSheet({ id: 'airing' }); }}>Start</button>`
                : nothing}
          </div>`
        : nothing}

      ${devices.length
        ? html`<div class="grid2">
            ${devices.map((d) => {
              const lt = d.kind === 'light' ? lightTint(ctx.hass.states[d.id]?.attributes ?? {}) : null;
              const col = lt ? lt.color : '#30d158';
              return html`<button class="dev ${d.on ? 'on' : ''} ${d.unavailable ? 'na' : ''}" style=${d.on ? `background:${lt ? lt.bg : `${col}24`}` : ''}
                ${hold({ tap: () => toggleDevice(ctx, d.id), hold: () => ctx.openSheet({ id: 'device', entity: d.id, back: { id: 'room', slug } }) })}>
                <span class="circle" style="width:38px;height:38px;background:${d.on ? col : 'rgba(255,255,255,0.12)'}">${deviceGlyph(d, ctx.hass.states[d.id]?.attributes, 16, d.on ? (lt ? lt.icon : '#0b1a10') : '#fff', 2)}</span>
                <span class="devtext"><span class="t1s ellipsis">${d.name}</span><span class="t2s ellipsis">${d.status}</span></span>
              </button>`;
            })}
          </div>`
        : nothing}
    `,
  });
}

export const roomStyles = css`
  .histpill {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 5px;
    height: 40px;
    padding: 0 12px;
    border-radius: 20px;
    background: var(--sd-fill-2);
    font-size: 13px;
    font-weight: 700;
  }
  .tcard {
    border-radius: 34px;
    padding: 18px 16px 14px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .tcontrol {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .bigstep {
    width: 56px;
    height: 56px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.14);
    font-size: 28px;
    text-align: center;
    touch-action: manipulation;
  }
  .bigstep:disabled {
    opacity: 0.4;
  }
  .tcenter {
    text-align: center;
  }
  .tstate {
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
  .tbig {
    font-size: 56px;
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.05;
  }
  .tsoll {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
  }
  .presets {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 6px;
  }
  .rpreset {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 2px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.1);
  }
  .rpreset.active {
    background: rgba(255, 255, 255, 0.28);
    box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.6);
  }
  .pname {
    font-size: 12px;
    font-weight: 600;
  }
  .ptemp {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.75);
  }
  .grid3 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }
  .grid2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }
  .scene {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 48px;
    padding: 0 8px 0 6px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.08);
    font-size: 12px;
    font-weight: 600;
    min-width: 0;
  }
  .facts {
    display: grid;
    gap: 6px;
  }
  .fact {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 2px;
    border-radius: 22px;
  }
  .fv {
    font-size: 13px;
    font-weight: 700;
  }
  .fl {
    font-size: 11px;
    color: var(--sd-muted);
  }
  .airrow {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 56px;
    padding: 0 8px;
    border-radius: 28px;
    background: rgba(90, 200, 250, 0.1);
    border: 1px solid rgba(90, 200, 250, 0.25);
  }
  .t1s {
    display: block;
    font-size: 14px;
    font-weight: 600;
  }
  .t2s {
    display: block;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.75);
  }
  .airbtn {
    flex-shrink: 0;
    height: 36px;
    padding: 0 14px;
    border-radius: 18px;
    background: #5ac8fa;
    color: #06202c;
    font-size: 13px;
    font-weight: 700;
  }
  .dev {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 50px;
    padding: 0 6px;
    border-radius: 25px;
    background: rgba(255, 255, 255, 0.06);
    min-width: 0;
    touch-action: manipulation;
  }
  .dev.na {
    background: transparent;
    border: 1.5px dashed rgba(255, 255, 255, 0.2);
    opacity: 0.7;
  }
  .devtext {
    min-width: 0;
    text-align: left;
  }
`;
