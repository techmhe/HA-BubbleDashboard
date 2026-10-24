import { css, html } from 'lit';
import { icon, sheet } from '../components/ui';
import { I } from '../icons';
import { ent } from '../logic/entities';
import { alarmIcon } from '../logic/overview';
import { ALARM_MODES, alarmLabel } from '../logic/security';
import type { PageContext } from '../pages/context';

export function alarmSheet(ctx: PageContext) {
  const id = ent(ctx.config, 'alarm');
  const st = ctx.hass.states[id]?.state ?? 'unavailable';
  const label = alarmLabel(st);
  return sheet({
    title: label,
    color: st === 'triggered' ? '#ff453a' : '#bf9bff',
    glow: 'rgba(191,155,255,0.22)',
    iconPath: alarmIcon(st),
    iconStroke: '#1d1030',
    onClose: ctx.closeSheet,
    body: html`
      <div class="alarm-grid">
        ${ALARM_MODES.map((m) => {
          const active = m.state === st;
          return html`
            <button class="alarm-mode ${active ? 'active' : ''}" aria-pressed=${active}
              @click=${() => { ctx.call('alarm_control_panel', m.service, {}, { entity_id: id }); ctx.closeSheet(); }}>
              <span class="circle" style="width:44px;height:44px;background:${active ? '#1d1030' : 'rgba(255,255,255,0.12)'}">
                ${icon(I[m.icon], 20, active ? '#bf9bff' : '#e2d3ff', 2.1)}
              </span>
              ${m.name}
            </button>
          `;
        })}
      </div>
      <button class="btn" @click=${() => { ctx.closeSheet(); ctx.moreInfo(id); }}>Details</button>
    `,
  });
}

export const alarmStyles = css`
  .alarm-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .alarm-mode {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 64px;
    padding: 0 10px;
    border-radius: 32px;
    background: var(--sd-fill);
    font-size: 15px;
    font-weight: 700;
  }
  .alarm-mode.active {
    background: #bf9bff;
    color: #1d1030;
  }
`;
