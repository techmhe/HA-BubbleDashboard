import { css, html } from 'lit';
import '../components/map';
import { PLACE_COLOR, personAvatar } from '../components/avatar';
import { sheet } from '../components/ui';
import { persons, presenceLabel, sinceLabel } from '../logic/persons';
import type { PageContext } from '../pages/context';

const USER = 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0';

/** Who is where: HA's map with persons and zones, and one row per person. */
export function personsSheet(ctx: PageContext) {
  const { hass } = ctx;
  const people = persons(hass, ctx.config);
  const zones = Object.keys(hass.states).filter((id) => id.startsWith('zone.'));
  const entities = [
    ...people.map((p) => ({ entity_id: p.id, color: PLACE_COLOR[p.place], focus: true })),
    ...zones.map((id) => ({ entity_id: id, focus: false })),
  ];
  return sheet({
    title: 'Personen',
    subtitle: presenceLabel(people),
    color: '#30d158',
    glow: 'rgba(48,209,88,0.2)',
    iconPath: USER,
    iconStroke: '#0b1a10',
    onClose: ctx.closeSheet,
    body: html`
      <div class="ps-map"><start-dashboard-map .hass=${hass} .entities=${entities}></start-dashboard-map></div>
      <div class="ps-list">
        ${people.map((p) => {
          const st = hass.states[p.id];
          return html`<div class="ps-row">
            ${personAvatar(p, 44)}
            <span class="ps-text">
              <span class="ps-name">${p.name}</span>
              <span class="ps-sub">${p.zoneName}${st ? ` · ${sinceLabel(st.last_changed, ctx.now)}` : ''}</span>
            </span>
          </div>`;
        })}
      </div>
    `,
  });
}

export const personsStyles = css`
  .ps-map {
    height: 260px;
    border-radius: 22px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.06);
  }
  .ps-map start-dashboard-map {
    display: block;
    height: 100%;
  }
  .map-ph {
    display: grid;
    place-items: center;
    height: 100%;
    font-size: 13px;
    color: var(--sd-muted);
  }
  .ps-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
  }
  .ps-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 22px;
    background: var(--sd-fill);
  }
  .ps-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .ps-name {
    font-size: 15px;
    font-weight: 700;
  }
  .ps-sub {
    font-size: 12px;
    color: var(--sd-muted);
  }
`;
