import { css, html, nothing } from 'lit';
import { icon } from '../components/ui';
import { I, IC, PRESET_ICONS, roomIcon, weatherIcon } from '../icons';
import {
  airingInfo, average, climateSummary, clock, entityFloor, floorGroups, outdoor, PRESETS, roomClimate, temp, type FloorGroup,
} from '../logic/climate';
import type { Room } from '../logic/rooms';
import { fmt, state } from '../logic/util';
import { ent } from '../logic/entities';
import type { PageContext } from './context';

function renderRoom(ctx: PageContext, room: Room) {
  const c = roomClimate(ctx.hass, room, ctx.target(room.climate));
  const accent = c.heating ? 'heat' : c.vent ? 'vent' : '';
  const climate = room.climate;
  return html`
    <div class="kroom ${accent}">
      <button class="kroom-main" @click=${() => ctx.openSheet({ id: 'room', slug: room.slug })}>
        <span class="circle kroom-circle">${icon(roomIcon(room.name, room.icon), 19, accent ? '#141008' : '#fff', 2)}</span>
        <span class="kroom-text">
          <span class="kroom-name">
            <span class="ellipsis">${room.name}</span>
            ${c.aq || c.fanOn
              ? html`<span class="aqchip" title=${c.pm25 !== null ? `PM2.5 ${fmt(c.pm25)} µg/m³` : 'Luftreiniger an'}
                  style="background:${c.aq ? c.aq + '2e' : 'rgba(48,209,88,0.18)'}">
                  ${c.aq ? html`<span class="dot" style="width:6px;height:6px;background:${c.aq}"></span>` : nothing}
                  ${c.fanOn ? icon(IC.fan, 11, '#7ee8a0', 2.6) : nothing}
                </span>`
              : nothing}
            ${c.windowOpen
              ? html`<span class="winchip" title="Fenster offen" aria-label="Fenster offen">${icon(I.window, 11, '#5ac8fa', 2.6)}</span>`
              : nothing}
          </span>
          <span class="kroom-sub">${temp(c.cur)}° · ${c.hum ?? '–'} % · ${c.label}</span>
        </span>
      </button>
      ${climate
        ? html`<span class="stepper">
            <button class="step" aria-label="Soll senken" @click=${() => ctx.stepTarget(climate, -0.5)}>−</button>
            <span class="target">${temp(c.target)}°</span>
            <button class="step" aria-label="Soll erhöhen" @click=${() => ctx.stepTarget(climate, 0.5)}>+</button>
          </span>`
        : nothing}
    </div>
  `;
}

const AC_MODES = [
  { mode: 'cool', name: 'Kühlen', icon: IC.snowflake, stroke: '#8fd8ff' },
  { mode: 'dry', name: 'Trocknen', icon: IC.drop, stroke: '#fff' },
  { mode: 'off', name: 'Aus', icon: IC.power, stroke: '#fff' },
];

const HVAC_DE: Record<string, string> = { off: 'Aus', cool: 'Kühlt', dry: 'Trocknet', heat: 'Heizt', fan_only: 'Lüfter', auto: 'Auto', heat_cool: 'Auto' };

function renderAc(ctx: PageContext, id: string) {
  const s = ctx.hass.states[id];
  if (!s) return nothing;
  const a = s.attributes;
  const sub = [HVAC_DE[s.state] ?? s.state, a.current_temperature != null ? `${fmt(Number(a.current_temperature), 1)}° innen` : '', a.temperature != null ? `Soll ${fmt(Number(a.temperature), 1)}°` : '']
    .filter(Boolean)
    .join(' · ');
  return html`
    <div class="ac">
      <button class="ac-main" aria-label="Klimaanlage öffnen" @click=${() => ctx.openSheet({ id: 'ac' })}>
        <span class="circle" style="width:44px;height:44px;background:rgba(100,210,255,0.18)">${icon(IC.snowflake, 19, '#8fd8ff', 2)}</span>
        <span><span class="t1">Klimaanlage</span><span class="t2">${sub}</span></span>
      </button>
      <span class="ac-modes">
        ${AC_MODES.map((m) => {
          const active = s.state === m.mode;
          return html`<button class="ac-mode ${active ? 'active' : ''}" aria-label=${m.name} title=${m.name} aria-pressed=${active}
            @click=${() => ctx.call('climate', 'set_hvac_mode', { hvac_mode: m.mode }, { entity_id: id })}>
            ${icon(m.icon, 16, active ? '#101218' : m.stroke, 2.2)}</button>`;
        })}
      </span>
    </div>
  `;
}

function renderFloor(ctx: PageContext, f: FloorGroup, acId: string, acFloor: string | undefined) {
  const avg = average(f.rooms.map((r) => roomClimate(ctx.hass, r).cur));
  return html`
    <section class="section">
      <div class="section-head" style="margin-top:8px">
        <h2>${f.name}</h2>
        <span class="rule" aria-hidden="true"></span>
        <span class="meta">${avg !== null ? `Ø ${fmt(avg, 1)}°` : ''}</span>
      </div>
      ${f.rooms.map((r) => renderRoom(ctx, r))}
      ${acFloor === f.id ? renderAc(ctx, acId) : nothing}
    </section>
  `;
}

export function renderClimate(ctx: PageContext) {
  const { hass, rooms } = ctx;
  const heatingId = ent(ctx.config, 'heating');
  const heatingOn = state(hass, heatingId) === 'on';
  const out = outdoor(hass, rooms, ctx.config);
  const acId = ent(ctx.config, 'ac');
  const acFloor = hass.states[acId] ? entityFloor(hass, acId) : undefined;
  const floors = floorGroups(hass, rooms);
  const weather = hass.states[ent(ctx.config, 'weather')]?.state ?? '';
  const airing = airingInfo(hass, rooms, ctx.config, ctx.now);

  return html`
    <div class="climate">
      <header class="khead">
        <div>
          <div class="date">${climateSummary(hass, rooms)}</div>
          <h1>Klima</h1>
        </div>
        ${hass.states[heatingId]
          ? html`<button class="heat-toggle ${heatingOn ? 'on' : ''}" aria-pressed=${heatingOn}
              aria-label="Zentralheizung ${heatingOn ? 'an' : 'aus'}" title="Zentralheizung"
              @click=${() => ctx.call('input_boolean', 'toggle', {}, { entity_id: heatingId })}>
              <span class="track"><span class="knob">${icon(IC.flame, 14, heatingOn ? '#ff9f0a' : '#888', 2.6)}</span></span>
            </button>`
          : nothing}
      </header>

      <button class="pill outdoor" @click=${() => ctx.openSheet({ id: 'airing' })}>
        <span class="circle" style="width:44px;height:44px;background:rgba(143,208,255,0.2)">${icon(weatherIcon(weather), 20, '#8fd0ff', 2)}</span>
        <span class="grow"><span class="t1">${out.title}</span><span class="t2">${out.sub}</span></span>
        ${airing.active
          ? html`<span class="air-badge running" aria-label="Lüften läuft, noch ${clock(airing.remaining)}">${icon(I.wind, 14, '#06202c', 2.4)}${clock(airing.remaining)}</span>`
          : out.minutes !== null
          ? html`<span class="air-badge">${icon(I.wind, 14, '#06202c', 2.4)}${fmt(Math.round(out.minutes))} min</span>`
          : nothing}
      </button>

      <div class="pill allrooms">
        <span class="grow" style="font-size:14px;font-weight:600">Alle Räume</span>
        ${PRESETS.map((p) => html`
          <button class="preset" style="background:${p.color}" aria-label="Alle auf ${p.name}" title=${p.name}
            @click=${() => ctx.runScript(ent(ctx.config, 'preset_all'), { preset: p.id })}>
            ${icon(PRESET_ICONS[p.id], 18, '#101010', 2.3)}
          </button>`)}
        <button class="preset" style="background:#fff" aria-label="Temperatur für alle Räume einstellen"
          @click=${() => ctx.openSheet({ id: 'allRooms' })}>${icon(IC.tune, 18, '#101218', 2.3)}</button>
      </div>

      ${floors.map((f) => renderFloor(ctx, f, acId, acFloor))}
    </div>
  `;
}

export const climateStyles = css`
  .climate {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .khead {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 6px 4px;
  }
  .khead h1 {
    margin-top: 2px;
    font-size: 30px;
    font-weight: 700;
  }
  .heat-toggle {
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0 6px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.08);
  }
  .heat-toggle.on {
    background: rgba(255, 159, 10, 0.2);
  }
  .track {
    position: relative;
    width: 52px;
    height: 32px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.2);
    transition: background 0.2s;
  }
  .heat-toggle.on .track {
    background: #ff9f0a;
  }
  .knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 26px;
    height: 26px;
    border-radius: 13px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: left 0.2s;
  }
  .heat-toggle.on .knob {
    left: 23px;
  }
  .pill {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 60px;
    padding: 0 8px;
    border-radius: 30px;
    background: var(--sd-fill);
    width: 100%;
  }
  .t1 {
    display: block;
    font-size: 15px;
    font-weight: 600;
  }
  .t2 {
    display: block;
    font-size: 12px;
    color: var(--sd-muted);
  }
  .air-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 34px;
    padding: 0 12px;
    border-radius: 17px;
    background: #5ac8fa;
    color: #06202c;
    font-size: 12px;
    font-weight: 700;
    margin-right: 4px;
    flex-shrink: 0;
  }
  .air-badge.running {
    font-variant-numeric: tabular-nums;
    animation: air-pulse 2s ease-in-out infinite;
  }
  @keyframes air-pulse {
    50% {
      box-shadow: 0 0 0 4px rgba(90, 200, 250, 0.28);
    }
  }
  .winchip {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    background: rgba(90, 200, 250, 0.2);
  }
  .allrooms {
    gap: 6px;
    padding: 0 8px 0 16px;
  }
  .preset {
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    border-radius: 21px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .kroom {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 60px;
    padding: 0 6px 0 8px;
    border-radius: 30px;
    background: var(--sd-fill);
  }
  .kroom.heat {
    background: linear-gradient(90deg, rgba(255, 159, 10, 0.24), rgba(255, 255, 255, 0.06) 65%);
  }
  .kroom.vent {
    background: linear-gradient(90deg, rgba(90, 200, 250, 0.22), rgba(255, 255, 255, 0.06) 65%);
  }
  .kroom-main {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
    height: 100%;
  }
  .kroom-circle {
    width: 44px;
    height: 44px;
    background: var(--sd-fill-2);
  }
  .kroom.heat .kroom-circle {
    background: #ff9f0a;
  }
  .kroom.vent .kroom-circle {
    background: #5ac8fa;
  }
  .kroom-text {
    min-width: 0;
  }
  .kroom-name {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    font-weight: 600;
  }
  .aqchip {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 3px;
    height: 18px;
    padding: 0 6px 0 5px;
    border-radius: 9px;
  }
  .kroom-sub {
    display: block;
    font-size: 12px;
    color: var(--sd-muted);
    white-space: nowrap;
  }
  .kroom.heat .kroom-sub {
    color: #ffc061;
  }
  .kroom.vent .kroom-sub {
    color: #8fd8ff;
  }
  .stepper {
    display: flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
  }
  .step {
    width: 36px;
    height: 36px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.1);
    font-size: 18px;
    text-align: center;
    touch-action: manipulation;
  }
  .target {
    min-width: 46px;
    text-align: center;
    font-size: 15px;
    font-weight: 700;
  }
  .kroom.heat .target {
    color: #ffc061;
  }
  .ac {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 60px;
    padding: 0 6px 0 8px;
    border-radius: 30px;
    background: var(--sd-fill);
  }
  .ac-main {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 100%;
  }
  .ac-modes {
    display: flex;
    gap: 4px;
  }
  .ac-mode {
    width: 36px;
    height: 36px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ac-mode.active {
    background: #fff;
  }
`;
