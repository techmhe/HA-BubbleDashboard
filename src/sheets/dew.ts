import { css, html, nothing } from 'lit';
import { icon, sheet } from '../components/ui';
import { trendFigure } from '../components/trend';
import { loadDewPoint, type DewRange } from '../data/series';
import { IC } from '../icons';
import { ent } from '../logic/entities';
import { fmt, num } from '../logic/util';
import type { PageContext } from '../pages/context';

const RANGES: { id: DewRange; name: string }[] = [
  { id: '24h', name: '24 h' },
  { id: '3d', name: '3 Tage' },
  { id: '7d', name: '7 Tage' },
];
const ROOM = '#8fd8ff';
const OUTDOOR = 'rgba(255,255,255,0.65)';
const BANDS = { now: 'rgba(48,209,88,0.28)', possible: 'rgba(48,209,88,0.12)' };

function labels(range: DewRange, start: number, end: number): string[] {
  if (!start) return [];
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(start + ((end - start) * i) / 5);
    return range === '24h'
      ? `${String(d.getHours()).padStart(2, '0')} Uhr`
      : `${d.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '')} ${String(d.getHours()).padStart(2, '0')}h`;
  });
}

/** Room dew point vs. outdoor; green bands where the room's airing sensor said airing helps. */
export function dewSheet(ctx: PageContext, slug: string, range: DewRange) {
  const room = ctx.rooms.find((r) => r.slug === slug);
  if (!room) return nothing;
  const roomId = `sensor.${slug}_taupunkt`;
  const outdoor = ent(ctx.config, 'outdoor_dew');
  const data = ctx.series(`dew:${slug}:${range}`, () => loadDewPoint(ctx.hass, { room: roomId, outdoor, airing: room.airing }, range), 5 * 60_000);
  const nowIn = num(ctx.hass, roomId);
  const nowOut = num(ctx.hass, outdoor);
  const caption = [nowIn !== null ? `innen ${fmt(nowIn, 1)}°` : '', nowOut !== null ? `außen ${fmt(nowOut, 1)}°` : ''].filter(Boolean).join(' · ');

  return sheet({
    title: 'Taupunkt',
    subtitle: room.name,
    color: ROOM,
    glow: `${ROOM}33`,
    iconPath: IC.drop,
    iconStroke: '#0a1a2a',
    onClose: ctx.closeSheet,
    onBack: () => ctx.openSheet({ id: 'room', slug }),
    body: html`
      <div class="tabs3" role="tablist" aria-label="Zeitraum">
        ${RANGES.map((r) => html`<button role="tab" aria-selected=${r.id === range} class=${r.id === range ? 'sel' : ''}
          @click=${() => ctx.openSheet({ id: 'dew', slug, range: r.id })}>${r.name}</button>`)}
      </div>
      ${trendFigure({
        title: 'Taupunkt', color: ROOM, unit: '°C', digits: 1, snap: 2, data, caption: caption || undefined,
        compareColor: OUTDOOR, bandColors: BANDS, labels: labels(range, data.start, data.end),
      })}
      <div class="dw-legend">
        <span><i style="background:${ROOM}"></i>innen</span>
        <span><i style="background:${OUTDOOR}"></i>außen</span>
        <span><i class="dw-box" style="background:${BANDS.now}"></i>Jetzt lüften</span>
        <span><i class="dw-box" style="background:${BANDS.possible}"></i>Lüften möglich</span>
      </div>
      <p class="dw-hint">${icon(IC.drop, 13, 'rgba(255,255,255,0.6)', 2.2)}Lüften trocknet, wenn der Taupunkt draußen unter dem im Raum liegt.</p>
    `,
  });
}

export const dewStyles = css`
  .dw-legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px 14px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.75);
  }
  .dw-legend span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .dw-legend i {
    display: block;
    width: 14px;
    height: 3px;
    border-radius: 2px;
  }
  .dw-legend i.dw-box {
    height: 10px;
    border-radius: 3px;
  }
  .dw-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0;
    padding: 0 8px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
  }
`;
