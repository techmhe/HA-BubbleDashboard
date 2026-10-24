import { html } from 'lit';
import { I } from '../icons';
import type { PersonInfo } from '../logic/persons';
import { icon, mdi } from './ui';

export const PLACE_COLOR: Record<PersonInfo['place'], string> = { home: '#30d158', zone: '#64d2ff', away: '#8e8e93', unknown: '#8e8e93' };

const PIN = 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z';
const AWAY = 'M5 12h14M13 6l6 6-6 6';

/** Profile picture (or initials) with a badge showing the zone's icon. Styles: .pp-* in the Schutz page. */
export function personAvatar(p: PersonInfo, size = 40) {
  const out = p.place === 'away' || p.place === 'unknown';
  return html`<span class="pp-av ${out ? 'out' : ''}" style="width:${size}px;height:${size}px" title="${p.name}: ${p.zoneName}">
    ${p.picture ? html`<img src=${p.picture} alt="" />` : html`<span class="pp-ini">${p.initials}</span>`}
    <span class="pp-zone" style="background:${PLACE_COLOR[p.place]}">
      ${p.place === 'away' ? icon(AWAY, 10, '#111', 2.6) : p.place === 'unknown' ? icon(PIN, 10, '#111', 2.4) : mdi(p.zoneIcon, p.place === 'home' ? I.home : PIN, '#111', 12)}
    </span>
  </span>`;
}
