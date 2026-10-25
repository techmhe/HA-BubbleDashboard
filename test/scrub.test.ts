import { describe, expect, it } from 'vitest';
import { nearestIndex, scrubPoints, scrubTime } from '../src/logic/scrub';

const H = 3600_000;
const D = 24 * H;
const at = (d: number, h: number) => new Date(2026, 9, d, h).getTime();

describe('nearestIndex', () => {
  it('picks the point closest to the finger', () => {
    expect(nearestIndex([0, 10, 20, 30], 14)).toBe(1);
    expect(nearestIndex([0, 10, 20, 30], 16)).toBe(2);
    expect(nearestIndex([0, 10, 20, 30], -5)).toBe(0);
    expect(nearestIndex([0, 10, 20, 30], 99)).toBe(3);
    expect(nearestIndex([], 5)).toBe(-1);
  });
});

describe('scrubTime', () => {
  it('labels hourly bars as a slot and daily bars as a date', () => {
    expect(scrubTime(at(24, 14), { step: H, bars: true, span: D })).toBe('14–15 Uhr');
    expect(scrubTime(at(23, 0), { step: D, bars: true, span: 7 * D })).toBe('Fr 23.10.');
  });
  it('labels points with the time, adding the weekday beyond a day', () => {
    expect(scrubTime(at(24, 14), { step: H, span: D })).toBe('14:00');
    expect(scrubTime(at(23, 9), { step: H, span: 7 * D })).toBe('Fr 09:00');
    expect(scrubTime(at(23, 0), { step: D, span: 30 * D })).toBe('Fr 23.10.');
  });
});

describe('scrubPoints', () => {
  const x = (t: number) => (t - at(24, 0)) / H;
  const y = (v: number) => 100 - v;
  const value = (v: number) => `${v} kWh`;

  it('centres bars on their slot and formats the value', () => {
    const pts = scrubPoints({ past: [{ t: at(24, 1), v: 2 }], step: H, bars: true, start: at(24, 0), end: at(25, 0), x, y, value });
    expect(pts).toEqual([{ x: 1.5, y: 98, time: '01–02 Uhr', value: '2 kWh' }]);
  });

  it('adds the matching comparison value and marks the forecast', () => {
    const pts = scrubPoints({
      past: [{ t: at(24, 1), v: 11 }], future: [{ t: at(24, 3), v: 12 }], compare: [{ t: at(24, 1), v: 7 }, { t: at(24, 2), v: 8 }],
      step: H, start: at(24, 0), end: at(25, 0), x, y, value: (v) => `${v}°`, compareName: 'außen',
    });
    expect(pts.map((p) => [p.time, p.value, p.extra])).toEqual([
      ['01:00', '11°', 'außen 7°'],
      ['03:00', '12°', 'Vorhersage'],
    ]);
  });
});
