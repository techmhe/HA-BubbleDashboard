import { describe, expect, it } from 'vitest';
import { curvePoints, rainHint, tileRows } from '../src/logic/wide';

describe('Zusammenfassung tile rows', () => {
  it('gives every floor a label row and one stretching row per two tiles', () => {
    expect(tileRows([6, 4])).toBe('auto repeat(3, minmax(84px, 1fr)) auto repeat(2, minmax(84px, 1fr))');
    expect(tileRows([3])).toBe('auto repeat(2, minmax(84px, 1fr))');
  });

  it('takes the column count and minimum row height for other grids', () => {
    expect(tileRows([6, 3], 3, 170)).toBe('auto repeat(2, minmax(170px, 1fr)) auto repeat(1, minmax(170px, 1fr))');
  });

  it('skips empty floors', () => {
    expect(tileRows([0, 2])).toBe('auto repeat(1, minmax(84px, 1fr))');
  });
});

describe('curve points', () => {
  it('spreads the values over the width and scales them into the height', () => {
    expect(curvePoints([0, 5, 10], 200, 40)).toEqual([[0, 40], [100, 20], [200, 0]]);
  });

  it('uses a shared maximum when given', () => {
    expect(curvePoints([0, 5], 100, 40, 20)).toEqual([[0, 40], [100, 30]]);
  });

  it('keeps a flat line at the bottom for all-zero values', () => {
    expect(curvePoints([0, 0], 100, 40)).toEqual([[0, 40], [100, 40]]);
  });

  it('draws a single value as a flat line', () => {
    expect(curvePoints([3], 100, 40)).toEqual([[0, 0], [100, 0]]);
  });
});

describe('rain hint', () => {
  const now = new Date('2026-11-07T20:14:00');
  const h = (hour: number, mm: number, day = 7) => ({ datetime: new Date(2026, 10, day, hour).toISOString(), precipitation: mm });

  it('says until when it rains while it rains now', () => {
    expect(rainHint([h(20, 0.6), h(21, 1.2), h(22, 0.4), h(23, 0), h(0, 0, 8)], now)).toBe('Regen bis 23 Uhr');
  });

  it('says when rain starts later', () => {
    expect(rainHint([h(20, 0), h(21, 0), h(22, 0.8), h(23, 0.2)], now)).toBe('Regen ab 22 Uhr');
  });

  it('ignores drizzle below 0.2 mm and says nothing when dry', () => {
    expect(rainHint([h(20, 0.1), h(21, 0), h(22, 0.05)], now)).toBe('');
  });

  it('says it keeps raining when the forecast does not see the end', () => {
    expect(rainHint([h(20, 1), h(21, 1)], now)).toBe('Regen hält an');
  });
});
