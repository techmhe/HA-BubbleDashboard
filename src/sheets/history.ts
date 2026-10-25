import { css, html, nothing, svg } from 'lit';
import { icon, sheet } from '../components/ui';
import { I } from '../icons';
import { airingInsight, chart, type Point } from '../logic/climate';
import { fmt } from '../logic/util';
import { scrubTime, type ScrubPoint } from '../logic/scrub';
import { scrub } from '../components/scrub';
import type { HistoryRange, PageContext } from '../pages/context';

const W = 300;
const TOP = 20;
const BOTTOM = 120;
const RANGES: { id: HistoryRange; name: string }[] = [
  { id: '24h', name: '24 h' },
  { id: '7d', name: '7 Tage' },
  { id: '30d', name: '30 Tage' },
];

function xLabels(range: HistoryRange, start: number, end: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < 4; i++) {
    const d = new Date(start + ((end - start) * i) / 4);
    if (range === '24h') out.push(i === 0 ? `${d.getHours()} Uhr` : String(d.getHours()).padStart(2, '0'));
    else if (range === '7d') out.push(d.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', ''));
    else out.push(`${d.getDate()}.${d.getMonth() + 1}.`);
  }
  out.push('jetzt');
  return out;
}

function figure(kind: 'temp' | 'hum', points: Point[], range: HistoryRange) {
  const isT = kind === 'temp';
  const color = isT ? '#ff9f0a' : '#5ac8fa';
  const g = isT ? chart(points, W, TOP, BOTTOM, 0.3, 0.3, 1) : chart(points, W, TOP, BOTTOM, 1, 1, 2);
  const vals = points.map((p) => p.v);
  const now = vals[vals.length - 1];
  const unit = isT ? '°' : ' %';
  const f = (v: number) => (isT ? fmt(v, 1) : fmt(Math.round(v)));
  const caption = vals.length
    ? `${f(Math.min(...vals))}${isT ? '°' : ''} – ${f(Math.max(...vals))}${unit} · jetzt ${f(now)}${unit}`
    : 'keine Daten';
  const mid = (g.lo + g.hi) / 2;
  const span = points.length > 1 ? points[points.length - 1].t - points[0].t : 0;
  const step = range === '30d' ? 24 * 3600_000 : 3600_000;
  const scrubbed: ScrubPoint[] = points.map((p, i) => ({
    x: Math.round((i / Math.max(1, points.length - 1)) * W * 10) / 10,
    y: g.y(p.v),
    time: scrubTime(p.t, { step, span }),
    value: `${f(p.v)}${unit}`,
  }));
  const y60 = g.y(60);
  const show60 = !isT && 60 > g.lo && 60 < g.hi;
  return html`
    <figure class="fig" style="background:${isT ? 'rgba(255,159,10,0.08)' : 'rgba(90,200,250,0.08)'}">
      <figcaption>
        <span style="font-size:14px;font-weight:600;color:${isT ? '#ffc061' : '#8fd8ff'}">${isT ? 'Temperatur' : 'Luftfeuchte'}</span>
        <span class="cap">${caption}</span>
      </figcaption>
      <div class="sc-wrap" ${scrub({ points: scrubbed, width: 338, height: 140, color })}>
      <svg width="100%" viewBox="0 0 338 140" role="img" aria-label="${isT ? 'Temperaturverlauf' : 'Luftfeuchteverlauf'}: ${caption}">
        ${isT
          ? svg`${[g.hi, mid, g.lo].map((v) => svg`
              <line x1="0" y1=${g.y(v)} x2="338" y2=${g.y(v)} stroke="rgba(255,255,255,0.08)"></line>
              <text x="334" y=${g.y(v) - 4} fill="rgba(255,255,255,0.55)" font-size="10" text-anchor="end">${fmt(v, v % 1 ? 1 : 0)}°</text>`)}`
          : svg`
              ${show60 ? svg`
                <rect x="0" y=${TOP} width="338" height=${Math.max(0, y60 - TOP)} fill="rgba(255,255,255,0.04)"></rect>
                <line x1="0" y1=${y60} x2="338" y2=${y60} stroke="rgba(90,200,250,0.5)" stroke-dasharray="4 4"></line>
                <text x="4" y=${y60 - 4} fill="rgba(143,216,255,0.85)" font-size="10">60 % Lüftgrenze</text>` : nothing}
              <line x1="0" y1=${BOTTOM} x2="338" y2=${BOTTOM} stroke="rgba(255,255,255,0.08)"></line>
              <text x="334" y=${TOP - 4} fill="rgba(255,255,255,0.55)" font-size="10" text-anchor="end">${fmt(g.hi)} %</text>
              <text x="334" y=${BOTTOM - 4} fill="rgba(255,255,255,0.55)" font-size="10" text-anchor="end">${fmt(g.lo)} %</text>`}
        ${g.area ? svg`<polygon points=${g.area} fill=${isT ? 'rgba(255,159,10,0.16)' : 'rgba(90,200,250,0.16)'}></polygon>` : nothing}
        ${g.line ? svg`<polyline points=${g.line} fill="none" stroke=${color} stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"></polyline>` : nothing}
        ${g.last ? svg`<circle cx=${g.last.x} cy=${g.last.y} r="4.5" fill=${color} stroke="#181a22" stroke-width="2"></circle>` : nothing}
      </svg>
      <div class="sc-layer"></div>
      </div>
    </figure>
  `;
}

export function historySheet(ctx: PageContext, slug: string, range: HistoryRange) {
  const room = ctx.rooms.find((r) => r.slug === slug);
  if (!room) return nothing;
  const data = ctx.history(slug, range);
  const insight = range === '24h' && !data.loading ? airingInsight(data.hum, data.temp) : null;
  const labels = xLabels(range, data.start, data.end);
  return sheet({
    title: `${room.name} · Verlauf`,
    subtitle: range === '30d' ? 'Tagesmittel' : 'Stundenmittel',
    color: '#ff9f0a',
    glow: 'rgba(255,159,10,0.12)',
    iconPath: I.thermo,
    onClose: ctx.closeSheet,
    onBack: () => ctx.openSheet({ id: 'room', slug }),
    body: html`
      <div class="tabs3" role="tablist" aria-label="Zeitraum">
        ${RANGES.map((r) => html`<button role="tab" aria-selected=${r.id === range} class=${r.id === range ? 'sel' : ''}
          @click=${() => ctx.openSheet({ id: 'history', slug, range: r.id })}>${r.name}</button>`)}
      </div>
      ${data.loading
        ? html`<div class="hist-msg">Lade Verlauf …</div>`
        : data.error
          ? html`<div class="hist-msg">Verlauf nicht verfügbar: ${data.error}</div>`
          : html`
            ${figure('temp', data.temp, range)}
            <div>
              ${figure('hum', data.hum, range)}
              <div class="xlabels">${labels.map((l) => html`<span>${l}</span>`)}</div>
            </div>
            ${insight
              ? html`<div class="insight">${icon(I.wind, 16, '#8fd8ff', 2.2)}<span>${insight}</span></div>`
              : nothing}`}
    `,
  });
}

export const historyStyles = css`
  .tabs3 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 4px;
    padding: 4px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.06);
  }
  .tabs3 button {
    height: 38px;
    border-radius: 19px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
    font-weight: 700;
    text-align: center;
  }
  .tabs3 button.sel {
    background: #fff;
    color: #101218;
  }
  .fig {
    margin: 0;
    padding: 14px 12px 10px;
    border-radius: 28px;
  }
  .fig figcaption {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 0 4px 6px;
  }
  .cap {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.75);
  }
  .xlabels {
    display: flex;
    justify-content: space-between;
    padding: 4px 16px 0;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
  }
  .insight {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 48px;
    padding: 8px 14px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.06);
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.4;
  }
  .hist-msg {
    padding: 40px 10px;
    text-align: center;
    color: var(--sd-muted);
    font-size: 14px;
  }
`;

