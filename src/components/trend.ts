import { css, html, nothing, svg } from 'lit';
import { timeChart, type Point } from '../logic/climate';
import { fmt } from '../logic/util';
import type { SeriesData } from '../pages/context';
import { scrubPoints } from '../logic/scrub';
import { scrub } from './scrub';

const VW = 338;
const W = 300;
const TOP = 18;
const BOTTOM = 130;

export interface TrendOptions {
  title: string;
  color: string;
  unit: string;
  digits: number;
  snap: number;
  data: SeriesData;
  /** Bars per bucket (energy) instead of a line. */
  bars?: boolean;
  /** Scale starts at 0. */
  zero?: boolean;
  /** Fixed top of the scale (100 for percentages). */
  max?: number;
  /** Dot on the last point ("now"); off for curves that are not up to now. */
  dot?: boolean;
  /** Text right of the title (sum, range, ...). */
  caption?: string;
  /** Labels under the chart, spread evenly. */
  labels: string[];
  /** Second, thinner line from data.compare (e.g. outdoor), on the same scale. */
  compareColor?: string;
  /** Name of the comparison line in the scrub bubble (e.g. "außen"). */
  compareName?: string;
  /** Background bands from data.bands, coloured by level. */
  bandColors?: Record<string, string>;
  /** Rain bars (mm per hour) along the bottom, on their own scale (temperature forecast). */
  rain?: Point[];
}

const RAIN_COLOR = '#5ac8fa';
/** Rain bars use the lower 45 % of the plot; 2 mm/h fills it unless more is forecast. */
const RAIN_TOP = BOTTOM - (BOTTOM - TOP) * 0.45;

/** Line or bar chart over time; a forecast part (data.future) is drawn dashed after a "jetzt" marker. */
export function trendFigure(o: TrendOptions) {
  const d = o.data;
  const past = d.past ?? [];
  const future = d.future ?? [];
  const step = d.step ?? 0;
  const compare = d.compare ?? [];
  const g = timeChart(past, d.start, d.end, W, TOP, BOTTOM, {
    snap: o.snap, zero: o.zero, max: o.max, padLo: o.snap / 2, padHi: o.snap / 2, extra: [...future, ...compare].map((p) => p.v),
  });
  const cmp = compare.length
    ? timeChart(compare, d.start, d.end, W, TOP, BOTTOM, { snap: o.snap, zero: o.zero, max: o.max, padLo: o.snap / 2, padHi: o.snap / 2, extra: [...past, ...future].map((p) => p.v) })
    : null;
  const fut = future.length ? timeChart(future, d.start, d.end, W, TOP, BOTTOM, { snap: o.snap, zero: o.zero, max: o.max, padLo: o.snap / 2, padHi: o.snap / 2, extra: past.map((p) => p.v) }) : null;
  const unit = o.unit ? ` ${o.unit}` : '';
  const grid = [g.hi, (g.lo + g.hi) / 2, g.lo];
  const nowX = future.length ? g.x(future[0].t) : null;
  const label = `${o.title}: ${o.caption ?? ''}`;
  const rain = (o.rain ?? []).filter((p) => p.v > 0);
  const rainMax = Math.max(2, ...rain.map((p) => p.v));
  const rainY = (v: number) => BOTTOM - (v / rainMax) * (BOTTOM - RAIN_TOP);
  const rainAt = new Map((o.rain ?? []).map((p) => [p.t, p.v]));
  const points = scrubPoints({
    past, future, compare, step, bars: !!(o.bars && step), start: d.start, end: d.end, x: g.x, y: g.y,
    value: (v) => `${fmt(v, o.digits)}${unit}`, compareName: o.compareName,
    extra: o.rain ? (t) => {
      const v = rainAt.get(t);
      return v ? `Regen ${fmt(v, 1)} mm` : undefined;
    } : undefined,
  });
  const bar = (p: Point, fill: string, opacity: number, y: (v: number) => number) => {
    const x0 = g.x(p.t);
    const w = Math.max(1, g.x(p.t + (step || 3600_000)) - x0 - 2);
    const top = y(p.v);
    return svg`<rect x=${x0 + 1} y=${top} width=${w} height=${Math.max(0, BOTTOM - top)} rx=${Math.min(3, w / 2)} fill=${fill} opacity=${opacity}></rect>`;
  };

  return html`
    <figure class="tr-fig" style="background:${o.color}14">
      <figcaption>
        <span class="tr-title" style="color:${o.color}">${o.title}</span>
        ${o.caption ? html`<span class="tr-cap">${o.caption}</span>` : nothing}
      </figcaption>
      ${d.error && !past.length
        ? html`<div class="tr-msg">Keine Daten: ${d.error}</div>`
        : d.loading && !past.length
          ? html`<div class="tr-msg">Lade Verlauf …</div>`
          : html`
            <div class="sc-wrap" ${scrub({ points, width: VW, height: 150, color: o.color })}>
            <svg width="100%" viewBox="0 0 ${VW} 150" role="img" aria-label=${label}>
              ${grid.map((v) => svg`
                <line x1="0" y1=${g.y(v)} x2=${VW} y2=${g.y(v)} stroke="rgba(255,255,255,0.08)"></line>
                <text x=${VW - 4} y=${g.y(v) - 4} fill="rgba(255,255,255,0.55)" font-size="10" text-anchor="end">${fmt(v, v % 1 ? 1 : 0)}${unit}</text>`)}
              ${(d.bands ?? []).map((band) => svg`<rect x=${g.x(band.from)} y=${TOP - 6} width=${Math.max(1, g.x(band.to) - g.x(band.from))}
                height=${BOTTOM - TOP + 6} fill=${o.bandColors?.[band.level] ?? 'rgba(255,255,255,0.08)'}></rect>`)}
              ${cmp?.line ? svg`<polyline points=${cmp.line} fill="none" stroke=${o.compareColor ?? 'rgba(255,255,255,0.6)'} stroke-width="1.6" stroke-linejoin="round" opacity="0.9"></polyline>` : nothing}
              ${o.bars && step
                ? svg`${past.map((p) => bar(p, o.color, 0.85, g.y))}
                  ${future.map((p) => bar(p, o.color, 0.4, g.y))}
                  ${nowX !== null
                    ? svg`<line x1=${nowX} y1=${TOP - 6} x2=${nowX} y2=${BOTTOM} stroke="rgba(255,255,255,0.35)" stroke-dasharray="2 3"></line>
                        <text x=${nowX + 4} y=${TOP - 2} fill="rgba(255,255,255,0.7)" font-size="10">Vorhersage</text>`
                    : nothing}`
                : svg`
                  ${g.area ? svg`<polygon points=${g.area} fill=${o.color} opacity="0.16"></polygon>` : nothing}
                  ${rain.map((p) => bar(p, RAIN_COLOR, 0.7, rainY))}
                  ${g.line ? svg`<polyline points=${g.line} fill="none" stroke=${o.color} stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"></polyline>` : nothing}
                  ${fut?.line ? svg`<polyline points=${fut.line} fill="none" stroke=${o.color} stroke-width="2" stroke-dasharray="5 5" opacity="0.7"></polyline>` : nothing}
                  ${nowX !== null
                    ? svg`<line x1=${nowX} y1=${TOP - 6} x2=${nowX} y2=${BOTTOM} stroke="rgba(255,255,255,0.35)" stroke-dasharray="2 3"></line>
                        <text x=${nowX + 4} y=${TOP - 2} fill="rgba(255,255,255,0.7)" font-size="10">Vorhersage</text>`
                    : nothing}
                  ${g.last && o.dot !== false ? svg`<circle cx=${g.last.x} cy=${g.last.y} r="4.5" fill=${o.color} stroke="#181a22" stroke-width="2"></circle>` : nothing}`}
            </svg>
            <div class="sc-layer"></div>
            </div>
            <div class="tr-x">${o.labels.map((l) => html`<span>${l}</span>`)}</div>`}
    </figure>
  `;
}

export const trendStyles = css`
  .tr-fig {
    margin: 0;
    padding: 14px 12px 10px;
    border-radius: 28px;
  }
  .tr-fig figcaption {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
    padding: 0 4px 6px;
  }
  .tr-title {
    font-size: 14px;
    font-weight: 600;
  }
  .tr-cap {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.75);
    text-align: right;
  }
  .tr-x {
    display: flex;
    justify-content: space-between;
    padding: 2px 40px 0 0;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
  }
  .tr-msg {
    padding: 50px 10px;
    text-align: center;
    color: var(--sd-muted);
    font-size: 14px;
  }
`;
