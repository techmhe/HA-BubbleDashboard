import { css, html, nothing } from 'lit';
import { icon, sheet } from '../components/ui';
import { IC } from '../icons';
import { acInfo } from '../logic/ac';
import { temp } from '../logic/climate';
import type { PageContext } from '../pages/context';

const BLUE = '#8fd8ff';
const MODE_ICONS: Record<string, string> = {
  cool: IC.snowflake, dry: IC.drop, fan_only: IC.fan, heat: IC.flame, auto: 'M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0M9 15l3-7 3 7M10 13h4', heat_cool: 'M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0', off: IC.power,
};

/** Air conditioner: target, mode, fan, swing, presets and the device's switches (e.g. outdoor quiet mode). */
export function acSheet(ctx: PageContext) {
  const a = acInfo(ctx.hass, ctx.config);
  if (!a) return nothing;
  const on = a.state !== 'off' && a.state !== 'unavailable';
  const target = ctx.target(a.id) ?? a.target;
  const climate = (service: string, data: Record<string, unknown>) => ctx.call('climate', service, data, { entity_id: a.id });
  const toggle = (id: string, isOn: boolean) => ctx.call('switch', isOn ? 'turn_off' : 'turn_on', {}, { entity_id: id });

  return sheet({
    title: 'Klimaanlage',
    subtitle: a.status,
    color: on ? BLUE : 'rgba(255,255,255,0.16)',
    glow: on ? 'rgba(100,210,255,0.22)' : 'rgba(255,255,255,0.06)',
    iconPath: IC.snowflake,
    iconStroke: on ? '#08202c' : '#fff',
    onClose: ctx.closeSheet,
    body: html`
      <div class="tcard" style="background: linear-gradient(140deg, ${on ? 'rgba(100,210,255,0.24)' : 'rgba(255,255,255,0.1)'}, rgba(255,255,255,0.05) 70%)">
        <div class="tcontrol">
          <button class="bigstep" aria-label="Soll senken" ?disabled=${target === null} @click=${() => ctx.stepTarget(a.id, -a.step)}>−</button>
          <div class="tcenter">
            <div class="tstate">${on ? 'Soll' : 'Aus · Soll'}</div>
            <div class="tbig">${target !== null ? `${temp(target, a.step % 1 ? 1 : 0)}°` : '–'}</div>
            <div class="tsoll">${a.min}° – ${a.max}°</div>
          </div>
          <button class="bigstep" aria-label="Soll erhöhen" ?disabled=${target === null} @click=${() => ctx.stepTarget(a.id, a.step)}>+</button>
        </div>
      </div>

      <div class="acs-modes" role="group" aria-label="Betriebsart">
        ${a.modes.map((m) => {
          const active = a.state === m.id;
          return html`<button class="acs-mode ${active ? 'active' : ''}" aria-pressed=${active} @click=${() => climate('set_hvac_mode', { hvac_mode: m.id })}>
            ${icon(MODE_ICONS[m.id] ?? IC.power, 18, active ? '#08202c' : '#fff', 2.1)}<span>${m.name}</span>
          </button>`;
        })}
      </div>

      ${a.fans.length
        ? html`<div class="section-head"><h2>Lüfter</h2><span class="rule" aria-hidden="true"></span></div>
            <div class="acs-seg" role="group" aria-label="Lüfterstufe" style="grid-template-columns: repeat(${a.fans.length}, minmax(0, 1fr))">
              ${a.fans.map((f) => html`<button class=${a.fan === f.id ? 'sel' : ''} aria-pressed=${a.fan === f.id}
                @click=${() => climate('set_fan_mode', { fan_mode: f.id })}>${f.name}</button>`)}
            </div>`
        : nothing}

      ${a.presets.length
        ? html`<div class="acs-seg" role="group" aria-label="Modus" style="grid-template-columns: repeat(${a.presets.length}, minmax(0, 1fr))">
            ${a.presets.map((p) => html`<button class=${a.preset === p.id ? 'sel' : ''} aria-pressed=${a.preset === p.id}
              @click=${() => climate('set_preset_mode', { preset_mode: p.id })}>${p.name}</button>`)}
          </div>`
        : nothing}

      <div class="acs-toggles">
        ${a.swing
          ? html`<button class="acs-tog ${a.swing.on ? 'on' : ''}" aria-pressed=${a.swing.on}
              @click=${() => climate('set_swing_mode', { swing_mode: a.swing!.on ? 'off' : a.swing!.onMode })}>
              <span class="acs-dot"></span><span class="ellipsis">Lamellen schwenken</span></button>`
          : nothing}
        ${a.switches.map((s) => html`<button class="acs-tog ${s.on ? 'on' : ''}" aria-pressed=${s.on} @click=${() => toggle(s.id, s.on)}>
          <span class="acs-dot"></span><span class="ellipsis">${s.name}</span></button>`)}
      </div>

      <div class="confirm-row">
        ${a.selfClean
          ? html`<button class="btn" @click=${() => ctx.confirm({
              title: 'Selbstreinigung', text: 'Selbstreinigung jetzt starten? Das Gerät läuft dann eine Weile.', confirm: 'Starten',
              color: BLUE, iconPath: IC.snowflake, onConfirm: () => ctx.call('button', 'press', {}, { entity_id: a.selfClean! }),
            })}>Selbstreinigung</button>`
          : nothing}
        <button class="btn" @click=${() => { ctx.closeSheet(); ctx.moreInfo(a.id); }}>Details</button>
      </div>
    `,
  });
}

export const acStyles = css`
  .acs-modes {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }
  .acs-mode {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 46px;
    border-radius: 23px;
    background: rgba(255, 255, 255, 0.08);
    font-size: 13px;
    font-weight: 600;
  }
  .acs-mode.active {
    background: #8fd8ff;
    color: #08202c;
  }
  .acs-seg {
    display: grid;
    gap: 4px;
    padding: 4px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.06);
  }
  .acs-seg button {
    height: 36px;
    border-radius: 18px;
    font-size: 12px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.8);
  }
  .acs-seg button.sel {
    background: #fff;
    color: #101218;
  }
  .acs-toggles {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }
  .acs-tog {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 46px;
    padding: 0 12px;
    border-radius: 23px;
    background: rgba(255, 255, 255, 0.08);
    font-size: 12px;
    font-weight: 600;
    text-align: left;
    min-width: 0;
  }
  .acs-tog.on {
    background: rgba(100, 210, 255, 0.2);
  }
  .acs-dot {
    flex-shrink: 0;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.25);
  }
  .acs-tog.on .acs-dot {
    background: #8fd8ff;
    box-shadow: 0 0 8px #8fd8ff;
  }
`;
