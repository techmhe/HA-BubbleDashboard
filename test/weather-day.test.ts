import { describe, expect, it } from 'vitest';
import { dailyRows, dayDetail, type ForecastItem } from '../src/logic/weather';

// Sunday 25 Oct 2026; DWD daily items are stamped at UTC midnight
const DAY: ForecastItem = {
  datetime: '2026-10-25T00:00:00Z', condition: 'rainy', temperature: 12.4, templow: 7.6, precipitation: 26.5,
  sun_duration: 15420, wind_speed: 48.2, wind_gust_speed: 77.8, wind_bearing: 240, humidity: 98, uv_index: 2,
};
const hour = (h: number, temp: number, rain = 0): ForecastItem => ({
  datetime: new Date(2026, 9, 25, h).toISOString(), temperature: temp, precipitation: rain, condition: 'rainy',
});
const HOURLY = [
  { ...hour(23, 9), datetime: new Date(2026, 9, 24, 23).toISOString() }, // day before: left out
  ...Array.from({ length: 24 }, (_, h) => hour(h, 8 + h / 6, h === 6 ? 2.4 : 0)),
];

describe('weather day detail', () => {
  it('links each day row to its forecast item', () => {
    expect(dailyRows([DAY])[0]).toMatchObject({ date: DAY.datetime });
  });

  it('summarises a forecast day with facts, 3-hourly slots and the temperature curve', () => {
    const d = dayDetail(DAY, HOURLY);
    expect(d.title).toBe('Sonntag, 25. Oktober');
    expect([d.label, d.max, d.min]).toEqual(['Regen', 12, 8]);
    expect(d.facts.map((f) => f.label)).toEqual(['Regen 26,5 mm', 'Sonne 4,3 h', 'Wind 48 km/h SW · Böen 78', 'Feuchte 98 %', 'UV 2']);
    expect(d.hours.map((h) => [h.t, h.temp, h.rain])).toEqual([
      ['00', 8, ''], ['03', 9, ''], ['06', 9, '2,4'], ['09', 10, ''], ['12', 10, ''], ['15', 11, ''], ['18', 11, ''], ['21', 12, ''],
    ]);
    expect(d.temps).toHaveLength(24);
    // local midnight to midnight; 25 Oct 2026 has 25 h (end of summer time)
    expect([d.start, d.end]).toEqual([new Date(2026, 9, 25).getTime(), new Date(2026, 9, 26).getTime()]);
  });

  it('works without hourly data for far days', () => {
    const d = dayDetail(DAY, []);
    expect(d.hours).toEqual([]);
    expect(d.temps).toEqual([]);
    expect(d.facts.length).toBe(5);
  });
});
