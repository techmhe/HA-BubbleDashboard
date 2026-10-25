import type { Point } from './climate';

const HOUR = 3600_000;
const DAY = 24 * HOUR;

/** One value the finger can land on, in chart (viewBox) coordinates. */
export interface ScrubPoint {
  x: number;
  y: number;
  time: string;
  value: string;
  /** Second line, e.g. the comparison value or "Vorhersage". */
  extra?: string;
}

/** Index of the x closest to `x`; -1 for no points. */
export function nearestIndex(xs: number[], x: number): number {
  let best = -1;
  let dist = Infinity;
  xs.forEach((v, i) => {
    const d = Math.abs(v - x);
    if (d < dist) {
      dist = d;
      best = i;
    }
  });
  return best;
}

const hh = (d: Date) => String(d.getHours()).padStart(2, '0');
const weekday = (d: Date) => d.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '');

/**
 * Time label for a value: daily buckets as "Fr 23.10.", hourly bars as "14–15 Uhr",
 * points as "14:00" (with the weekday when the chart spans more than a day).
 */
export function scrubTime(t: number, o: { step?: number; bars?: boolean; span: number }): string {
  const d = new Date(t);
  if ((o.step ?? 0) >= DAY - HOUR) return `${weekday(d)} ${d.getDate()}.${d.getMonth() + 1}.`;
  const day = o.span > 1.5 * DAY ? `${weekday(d)} ` : '';
  if (o.bars && o.step) return `${day}${hh(d)}–${hh(new Date(t + o.step))} Uhr`;
  return `${day}${hh(d)}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export interface ScrubInput {
  past: Point[];
  future?: Point[];
  compare?: Point[];
  step?: number;
  bars?: boolean;
  start: number;
  end: number;
  x: (t: number) => number;
  y: (v: number) => number;
  value: (v: number) => string;
  /** Label for the comparison value, e.g. "außen". */
  compareName?: string;
}

/** The points a finger can scrub over: bars centred on their slot, forecast marked. */
export function scrubPoints(o: ScrubInput): ScrubPoint[] {
  const span = o.end - o.start;
  const step = o.step ?? 0;
  const tolerance = Math.max(step, HOUR);
  const compare = o.compare ?? [];
  const cmpAt = (t: number) => {
    const i = nearestIndex(compare.map((p) => p.t), t);
    return i >= 0 && Math.abs(compare[i].t - t) <= tolerance ? compare[i] : null;
  };
  const point = (p: Point, future: boolean): ScrubPoint => {
    const x = o.bars && step ? (o.x(p.t) + o.x(p.t + step)) / 2 : o.x(p.t);
    const out: ScrubPoint = { x, y: o.y(p.v), time: scrubTime(p.t, { step, bars: o.bars, span }), value: o.value(p.v) };
    if (future) out.extra = 'Vorhersage';
    else if (o.compareName) {
      const c = cmpAt(p.t);
      if (c) out.extra = `${o.compareName} ${o.value(c.v)}`;
    }
    return out;
  };
  return [...o.past.map((p) => point(p, false)), ...(o.future ?? []).map((p) => point(p, true))];
}
