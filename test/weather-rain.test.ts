import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadWeatherRain } from '../src/data/series';
import { scrubPoints } from '../src/logic/scrub';
import { dayDetail, weatherNow, type ForecastItem } from '../src/logic/weather';
import type { HomeAssistant } from '../src/types';

const HOUR = 3600_000;
const NOW = new Date(2026, 9, 25, 18, 47);
const config = { type: 'custom:ha-start-dashboard' };
const hour = (d: number, h: number, rain: number, temp = 9): ForecastItem => ({
  datetime: new Date(2026, 9, d, h).toISOString(), temperature: temp, precipitation: rain, condition: 'rainy',
});
const HOURLY = Array.from({ length: 30 }, (_, i) => hour(25, 18 + i, i === 2 ? 1.5 : 0.2));

function hass(states: Record<string, { state: string }>, ws?: (msg: Record<string, unknown>) => unknown) {
  return {
    states: { 'weather.musterstadt': { state: 'rainy', attributes: { humidity: 80 } }, ...states },
    callWS: async (msg: Record<string, unknown>) => ws?.(msg) ?? {},
  } as unknown as HomeAssistant;
}

describe('precipitation in the weather sheet', () => {
  it('shows a rain chip from the precipitation sensor', () => {
    const w = weatherNow(hass({ 'sensor.musterstadt_niederschlag': { state: '0.4' } }), config, [], NOW, HOURLY);
    expect(w.chips.map((c) => c.label)).toEqual(['Regen 0,4 mm/h', 'Feuchte 80 %']);
    expect(w.chips[0].key).toBe('precipitation');
  });

  it('falls back to the current hour of the forecast without the sensor', () => {
    const w = weatherNow(hass({}), config, [], NOW, HOURLY);
    expect(w.chips[0].label).toBe('Regen 0,2 mm/h');
  });

  it('leaves the chip out without sensor and forecast', () => {
    expect(weatherNow(hass({}), config, [], NOW).chips.map((c) => c.key)).toEqual(['humidity']);
  });

  describe('rain chart', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(NOW);
    });
    afterEach(() => vi.useRealTimers());

    it('loads 24 h of hourly statistics and 24 h of forecast as bars', async () => {
      const calls: Record<string, unknown>[] = [];
      const start = new Date(2026, 9, 24, 19).getTime();
      const h = hass({}, (msg) => {
        calls.push(msg);
        return { 'sensor.musterstadt_niederschlag': [{ start, mean: 2.5 }, { start: start + HOUR, mean: 0 }] };
      });
      const r = await loadWeatherRain(h, 'sensor.musterstadt_niederschlag', HOURLY);
      expect(calls[0]).toMatchObject({ type: 'recorder/statistics_during_period', period: 'hour', types: ['mean'] });
      expect(r.step).toBe(HOUR);
      expect(r.start).toBe(start);
      expect(r.past.slice(0, 2)).toEqual([{ t: start, v: 2.5 }, { t: start + HOUR, v: 0 }]);
      // Forecast from the running hour (18:00) on, 24 bars.
      expect(r.future?.[0]).toEqual({ t: new Date(2026, 9, 25, 18).getTime(), v: 0.2 });
      expect(r.future).toHaveLength(24);
      expect(r.future?.[2].v).toBe(1.5);
    });

    it('works on the forecast alone without a sensor', async () => {
      const r = await loadWeatherRain(hass({}), undefined, HOURLY);
      expect(r.past).toEqual([]);
      expect(r.future).toHaveLength(24);
    });
  });
});

describe('precipitation in the day forecast', () => {
  it('adds hourly rain to the temperature chart data', () => {
    const day: ForecastItem = { datetime: '2026-10-26T00:00:00Z', condition: 'rainy', temperature: 12, templow: 7 };
    const hourly = Array.from({ length: 24 }, (_, h) => hour(26, h, h === 7 ? 3.1 : 0));
    const d = dayDetail(day, hourly);
    expect(d.rain).toHaveLength(24);
    expect(d.rain[7]).toEqual({ t: new Date(2026, 9, 26, 7).getTime(), v: 3.1 });
  });

  it('names the rain of the hour in the scrub bubble', () => {
    const t0 = new Date(2026, 9, 26, 7).getTime();
    const pts = scrubPoints({
      past: [{ t: t0, v: 9 }], start: t0, end: t0 + HOUR, x: () => 0, y: () => 0, value: (v) => `${v} °C`,
      extra: (t) => (t === t0 ? 'Regen 3,1 mm' : undefined),
    });
    expect(pts[0].extra).toBe('Regen 3,1 mm');
  });
});
