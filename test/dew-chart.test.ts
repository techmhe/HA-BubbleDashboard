import { describe, expect, it } from 'vitest';
import { airingBands } from '../src/logic/climate';

const H = 3600_000;
const row = (s: string, h: number) => ({ s, lu: (h * H) / 1000 });

describe('airing bands for the dew point chart', () => {
  it('turns the airing sensor history into "now" and "possible" bands', () => {
    const rows = [
      row('Nicht lüften', -2), // state at the window start
      row('Lüften möglich', 3),
      row('Jetzt lüften', 5),
      row('Lüften möglich', 6),
      row('Nicht lüften', 8),
      row('Jetzt lüften', 20),
    ];
    expect(airingBands(rows, 0, 24 * H)).toEqual([
      { from: 3 * H, to: 5 * H, level: 'possible' },
      { from: 5 * H, to: 6 * H, level: 'now' },
      { from: 6 * H, to: 8 * H, level: 'possible' },
      { from: 20 * H, to: 24 * H, level: 'now' },
    ]);
  });

  it('clips a band that started before the window and ignores unknown states', () => {
    expect(airingBands([row('Jetzt lüften', -5), row('unavailable', 2), row('Lüften möglich', 4)], 0, 6 * H)).toEqual([
      { from: 0, to: 2 * H, level: 'now' },
      { from: 4 * H, to: 6 * H, level: 'possible' },
    ]);
  });
});
