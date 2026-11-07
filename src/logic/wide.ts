import type { ForecastItem } from './weather';

/** Grid rows of a floor-grouped grid: a label row per floor, then one stretching row per `cols` tiles. */
export function tileRows(tilesPerFloor: number[], cols = 2, minPx = 84): string {
  return tilesPerFloor
    .filter((n) => n > 0)
    .map((n) => `auto repeat(${Math.ceil(n / cols)}, minmax(${minPx}px, 1fr))`)
    .join(' ');
}

/** SVG points for `values` across `width`, scaled into `height` (0 at the bottom); `max` shares a scale between curves. */
export function curvePoints(values: number[], width: number, height: number, max?: number): [number, number][] {
  if (!values.length) return [];
  const top = max ?? Math.max(...values);
  // Without a shared scale a flat non-zero line sits at the top, an all-zero line at the bottom.
  const span = top > 0 ? top : 1;
  const y = (v: number) => Math.round((height - (Math.max(0, v) / span) * height) * 10) / 10;
  if (values.length === 1) return [[0, y(values[0])], [width, y(values[0])]];
  const step = width / (values.length - 1);
  return values.map((v, i) => [Math.round(i * step * 10) / 10, y(v)]);
}

const RAIN_MM = 0.2;

/** "Regen bis 23 Uhr" while it rains, "Regen ab 22 Uhr" when it starts within the next 12 h, else ''. */
export function rainHint(hourly: ForecastItem[], now: Date): string {
  const from = new Date(now);
  from.setMinutes(0, 0, 0);
  const next = hourly.filter((h) => new Date(h.datetime).getTime() >= from.getTime()).slice(0, 12);
  const wet = (h: ForecastItem) => (h.precipitation ?? 0) >= RAIN_MM;
  const hour = (h: ForecastItem) => new Date(h.datetime).getHours();
  if (!next.length) return '';
  if (wet(next[0])) {
    const dry = next.find((h) => !wet(h));
    return dry ? `Regen bis ${hour(dry)} Uhr` : 'Regen hält an';
  }
  const start = next.find(wet);
  return start ? `Regen ab ${hour(start)} Uhr` : '';
}
