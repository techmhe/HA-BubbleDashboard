import { css, html, nothing } from 'lit';
import { icon, sheet } from '../components/ui';
import { I, IC } from '../icons';
import { ent } from '../logic/entities';
import {
  CLEAN_MODES,
  consumables,
  FAN_SPEEDS,
  MOP_LEVELS,
  robbyMaps,
  robbyPrograms,
  robbySelection,
  robbyStatus,
  startLabel,
} from '../logic/robby';
import { num, state } from '../logic/util';
import type { PageContext } from '../pages/context';

const R = {
  pause: 'M7 4h3v16H7zM14 4h3v16h-3z',
  dock: 'M3 10.5 12 3l9 7.5V21H3z',
  locate: 'M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12zM12 7a2 2 0 1 0 0 4a2 2 0 1 0 0-4',
};

/** Segmented slider style: filled up to the active step, rounded ends. */
function seg(i: number, active: number, n: number, color: string): string {
  const radius = i === 0 ? '17px 6px 6px 17px' : i === n - 1 ? '6px 17px 17px 6px' : '6px';
  return i <= active
    ? `border-radius:${radius};background:${color};opacity:${0.55 + (0.45 * (i + 1)) / n};color:#08121c`
    : `border-radius:${radius};background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.5)`;
}

export function robbySheet(ctx: PageContext) {
  const { hass, config } = ctx;
  const vac = ent(config, 'vacuum');
  const st = robbyStatus(hass, config);
  const cons = consumables(hass, config);
  const maps = robbyMaps(hass, config);
  const mapId = ent(config, 'vacuum_map');
  const currentMap = state(hass, mapId) ?? maps[0]?.name;
  const map = maps.find((m) => m.name === currentMap) ?? maps[0];
  const selected = robbySelection(hass, config);
  const nSel = map ? map.rooms.filter((r) => selected.includes(r.segment)).length : 0;
  const modeId = ent(config, 'vacuum_mode');
  const mode = state(hass, modeId) ?? 'vacuum';
  const fan = String(hass.states[vac]?.attributes.fan_speed ?? '');
  const fanIdx = FAN_SPEEDS.findIndex((f) => f.id === fan);
  const mopId = ent(config, 'vacuum_mop');
  const mopIdx = MOP_LEVELS.findIndex((m) => m.id === state(hass, mopId));
  const passesId = ent(config, 'vacuum_passes');
  const passes = Math.round(num(hass, passesId) ?? 1);
  const vacCall = (service: string, data: Record<string, unknown> = {}) => ctx.call('vacuum', service, data, { entity_id: vac });
  const select = (entity: string, option: string) => ctx.call('select', 'select_option', { option }, { entity_id: entity });
  const dot = st.error ? '#ff453a' : st.cleaning ? '#64d2ff' : '#30d158';

  return sheet({
    title: 'Robby',
    subtitle: st.label,
    color: 'radial-gradient(circle at 40% 35%, #4a505c, #23262e)',
    glow: st.error ? 'rgba(255,69,58,0.18)' : 'rgba(48,209,88,0.1)',
    iconPath: I.vacuum,
    iconStroke: dot,
    onClose: ctx.closeSheet,
    headerExtra: html`
      ${st.cleaning
        ? html`<button class="rb-ctl" aria-label="Pause" title="Pause" @click=${() => vacCall('pause')}>${icon(R.pause, 16, '#fff', 2.2)}</button>`
        : html`<button class="rb-ctl" aria-label="Start" title="Start" @click=${() => vacCall('start')}>${icon(IC.play, 16, '#fff', 2.2)}</button>`}
      <button class="rb-ctl" aria-label="Zur Station" title="Zur Station" @click=${() => vacCall('return_to_base')}>${icon(R.dock, 16, '#fff', 2.2)}</button>
      <button class="rb-ctl" aria-label="Orten" title="Orten" @click=${() => vacCall('locate')}>${icon(R.locate, 16, '#fff', 2.2)}</button>
    `,
    body: html`
      ${cons.length
        ? html`<div class="rb-stats" style="grid-template-columns: repeat(${cons.length}, minmax(0, 1fr))">
            ${cons.map((c) => html`<button class="rb-stat ${c.due ? 'due' : ''}" aria-label="${c.name}: ${c.value}${c.reset ? ', tippen zum Zurücksetzen' : ''}"
              @click=${() => (c.reset
                ? ctx.confirm({
                    title: c.name, text: `${c.name} gereinigt oder getauscht? Der Zähler wird zurückgesetzt.`, confirm: 'Zurücksetzen',
                    color: '#ff9f0a', iconPath: I.vacuum, onConfirm: () => ctx.call('button', 'press', {}, { entity_id: c.reset! }),
                  })
                : ctx.moreInfo(c.id))}>
              <span class="rb-sv">${c.value}</span><span class="rb-sn">${c.name}</span>
            </button>`)}
          </div>`
        : nothing}

      <div class="section-head"><h2>Programme</h2><span class="rule" aria-hidden="true"></span><span class="meta">Tippen startet</span></div>
      <div class="rb-progs">
        ${robbyPrograms(config).map((p) => html`
          <button class="rb-prog" @click=${() => (p.button ? ctx.call('button', 'press', {}, { entity_id: p.button }) : vacCall('start'))}>
            <span class="rb-tag" style="background:${p.color ?? '#7ee8a0'}">${p.tag}</span>
            <span class="rb-pn">${p.name}</span>
          </button>`)}
      </div>

      ${map
        ? html`
            <div class="section-head"><h2>Selbst auswählen</h2><span class="rule" aria-hidden="true"></span></div>
            <section class="rb-custom" aria-label="Individuelle Reinigung">
              <div class="rb-tabs" role="tablist" aria-label="Karte" style="grid-template-columns: repeat(${maps.length}, minmax(0, 1fr))">
                ${maps.map((m) => html`<button role="tab" aria-selected=${m.name === map.name} class=${m.name === map.name ? 'sel' : ''}
                  @click=${() => m.name !== map.name && ctx.runScript(ent(config, 'vacuum_map_script'), { karte: m.name })}>${m.name}</button>`)}
              </div>
              ${map.rooms.length
                ? html`<div class="rb-rooms">
                    ${map.rooms.map((r) => {
                      const sel = selected.includes(r.segment);
                      return html`<button class="rb-room ${sel ? 'sel' : ''}" aria-pressed=${sel}
                        @click=${() => ctx.runScript(ent(config, 'vacuum_room_script'), { segment: r.segment })}>${r.name}</button>`;
                    })}
                  </div>`
                : nothing}

              <div class="rb-modes" role="radiogroup" aria-label="Modus">
                ${CLEAN_MODES.map((m) => {
                  const sel = mode === m.id;
                  return html`<button class="rb-mode ${sel ? 'sel' : ''}" role="radio" aria-checked=${sel} @click=${() => select(modeId, m.id)}>
                    <span class="rb-mi">
                      ${m.id !== 'mop' ? icon(IC.fan, 18, 'currentColor', 2.1) : nothing}
                      ${m.id !== 'vacuum' ? icon(IC.drop, 18, 'currentColor', 2.1) : nothing}
                    </span>
                    <span class="rb-mn">${m.name}</span>
                  </button>`;
                })}
              </div>

              ${mode !== 'mop'
                ? html`<div class="rb-slider">
                    <div class="rb-sh">${icon(IC.fan, 15, '#7ee8a0', 2.2)}<span>Saugkraft</span><span class="grow"></span>
                      <strong style="color:#9af0b5">${FAN_SPEEDS[fanIdx]?.name ?? fan}</strong></div>
                    <div class="rb-segs" role="radiogroup" aria-label="Saugkraft" style="grid-template-columns: repeat(${FAN_SPEEDS.length}, minmax(0, 1fr))">
                      ${FAN_SPEEDS.map((f, i) => html`<button role="radio" aria-checked=${i === fanIdx} aria-label=${f.name} title=${f.name}
                        style=${seg(i, fanIdx, FAN_SPEEDS.length, '#30d158')} @click=${() => vacCall('set_fan_speed', { fan_speed: f.id })}></button>`)}
                    </div>
                  </div>`
                : nothing}

              ${mode !== 'vacuum'
                ? html`<div class="rb-slider">
                    <div class="rb-sh">${icon(IC.drop, 15, '#8fd8ff', 2.2)}<span>Wasser</span><span class="grow"></span>
                      <strong style="color:#bfe8ff">${MOP_LEVELS[mopIdx]?.name ?? '–'}</strong></div>
                    <div class="rb-segs" role="radiogroup" aria-label="Wischintensität" style="grid-template-columns: repeat(${MOP_LEVELS.length}, minmax(0, 1fr))">
                      ${MOP_LEVELS.map((m, i) => html`<button role="radio" aria-checked=${i === mopIdx} aria-label=${m.name} title=${m.name}
                        style=${seg(i, mopIdx, MOP_LEVELS.length, '#5ac8fa')} @click=${() => select(mopId, m.id)}>
                        ${Array.from({ length: i + 1 }, () => html`<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d=${IC.drop}></path></svg>`)}
                      </button>`)}
                    </div>
                  </div>`
                : nothing}

              <div class="rb-start">
                <div class="rb-passes" role="radiogroup" aria-label="Durchgänge">
                  ${[1, 2].map((p) => html`<button role="radio" aria-checked=${passes === p} class=${passes === p ? 'sel' : ''}
                    @click=${() => ctx.call('input_number', 'set_value', { value: p }, { entity_id: passesId })}>${p}×</button>`)}
                </div>
                <button class="rb-go" ?disabled=${nSel === 0} @click=${() => ctx.runScript(ent(config, 'vacuum_clean_script'))}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d=${IC.play}></path></svg>${startLabel(nSel)}
                </button>
              </div>
            </section>`
        : nothing}
    `,
  });
}

export const robbyStyles = css`
  .rb-ctl {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .rb-stats {
    display: grid;
    gap: 4px;
  }
  .rb-stat {
    padding: 7px 2px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.06);
    text-align: center;
  }
  .rb-stat.due {
    color: #ffc061;
    background: rgba(255, 159, 10, 0.18);
  }
  .rb-sv {
    display: block;
    font-size: 13px;
    font-weight: 700;
  }
  .rb-sn {
    display: block;
    font-size: 10px;
    opacity: 0.8;
  }
  .rb-progs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }
  .rb-prog {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 4px;
    height: 58px;
    padding: 6px 10px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.08);
    text-align: left;
  }
  .rb-tag {
    height: 20px;
    padding: 0 8px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    font-size: 11px;
    font-weight: 700;
    color: #101010;
  }
  .rb-pn {
    font-size: 12px;
    font-weight: 600;
    line-height: 1.15;
  }
  .rb-custom {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px;
    border-radius: 28px;
    border: 1px solid rgba(48, 209, 88, 0.35);
    background: rgba(48, 209, 88, 0.06);
  }
  .rb-tabs {
    display: grid;
    gap: 4px;
    padding: 3px;
    border-radius: 19px;
    background: rgba(0, 0, 0, 0.25);
  }
  .rb-tabs button {
    height: 34px;
    border-radius: 17px;
    font-size: 12px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
  }
  .rb-tabs button.sel {
    background: #fff;
    color: #101218;
  }
  .rb-rooms {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 4px;
  }
  .rb-room {
    height: 38px;
    padding: 0 2px;
    border-radius: 19px;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.16);
  }
  .rb-room.sel {
    border-color: transparent;
    background: #30d158;
    color: #0b1a10;
  }
  .rb-modes {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }
  .rb-mode {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 60px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.07);
    text-align: center;
  }
  .rb-mode.sel {
    background: #30d158;
    color: #0b1a10;
  }
  .rb-mi {
    display: flex;
    gap: 2px;
  }
  .rb-mn {
    font-size: 12px;
    font-weight: 700;
  }
  .rb-slider {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .rb-sh {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    padding: 0 4px;
  }
  .rb-segs {
    display: grid;
    gap: 3px;
    height: 34px;
  }
  .rb-segs button {
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1px;
  }
  .rb-start {
    display: flex;
    gap: 6px;
    margin-top: 2px;
  }
  .rb-passes {
    display: flex;
    gap: 3px;
    padding: 3px;
    border-radius: 25px;
    background: rgba(0, 0, 0, 0.25);
  }
  .rb-passes button {
    width: 44px;
    height: 44px;
    border-radius: 22px;
    font-size: 13px;
    font-weight: 700;
    text-align: center;
  }
  .rb-passes button.sel {
    background: #fff;
    color: #101218;
  }
  .rb-go {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 50px;
    border-radius: 25px;
    background: #30d158;
    color: #0b1a10;
    font-size: 14px;
    font-weight: 700;
  }
  .rb-go:disabled {
    opacity: 0.45;
    cursor: default;
  }
`;
