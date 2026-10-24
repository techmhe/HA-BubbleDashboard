import { describe, expect, it } from 'vitest';
import { consumerEnergyStat, energyNow, energyStatIds, energyToday, pvSensors, statChanges } from '../src/logic/energy';
import { WEATHER_METRICS, weatherSeries } from '../src/logic/weather';
import { timeChart } from '../src/logic/climate';
import { makeM4Hass } from './fixture-m4';

const config = { type: 'custom:ha-start-dashboard' };

const PREFS = {
  energy_sources: [
    { type: 'solar', stat_energy_from: 'sensor.solarenergytotal' },
    { type: 'solar', stat_energy_from: 'sensor.marstek_venus_a_pv_erzeugte_leistung', stat_rate: 'sensor.marstek_venus_a_pv_aktuelle_leistung' },
    { type: 'battery', stat_energy_from: 'sensor.bat_out', stat_energy_to: 'sensor.bat_in' },
    { type: 'grid', stat_energy_from: 'sensor.stromverbrauch_shelly_kwh', stat_energy_to: 'sensor.ruckeinspeisung_shelly_kwh' },
  ],
  device_consumption: [
    { stat_consumption: 'sensor.heimkino_energy', stat_rate: 'sensor.heimkino_power', name: 'Heimkino' },
  ],
};

describe('energy dashboard sources', () => {
  it('collects the statistic ids per role', () => {
    expect(energyStatIds(PREFS)).toEqual({
      solar: ['sensor.solarenergytotal', 'sensor.marstek_venus_a_pv_erzeugte_leistung'],
      import: ['sensor.stromverbrauch_shelly_kwh'],
      export: ['sensor.ruckeinspeisung_shelly_kwh'],
      solarRate: ['sensor.marstek_venus_a_pv_aktuelle_leistung'],
    });
  });

  it('sums PV power over the configured sensor and the solar rates of the energy dashboard', () => {
    const h = makeM4Hass({
      'sensor.solar_total_power': { state: '310' },
      'sensor.marstek_venus_a_pv_aktuelle_leistung': { state: '120' },
    });
    expect(pvSensors(config, PREFS)).toEqual(['sensor.solar_total_power', 'sensor.marstek_venus_a_pv_aktuelle_leistung']);
    expect(energyNow(h, config, PREFS).pv).toBe(430);
  });

  it('sums the daily change of statistics', () => {
    const rows = {
      'sensor.solarenergytotal': [{ start: 0, change: 1.5 }, { start: 1, change: 2 }],
      'sensor.marstek_venus_a_pv_erzeugte_leistung': [{ start: 0, change: 0.25 }],
      'sensor.stromverbrauch_shelly_kwh': [{ start: 0, change: 4 }],
    };
    expect(statChanges(rows, ['sensor.solarenergytotal', 'sensor.marstek_venus_a_pv_erzeugte_leistung'])).toBeCloseTo(3.75);
    expect(statChanges(rows, ['sensor.missing'])).toBe(0);
  });

  it('prefers statistics over the daily utility meters for "Heute"', () => {
    const t = energyToday(makeM4Hass({ 'sensor.pv_heute': { state: 'unknown' } }), config, { pv: 3.75, import: 4, export: 1 });
    expect(t).toMatchObject({ pv: 3.75, import: 4, export: 1, consumed: 6.75 });
  });

  it('finds the energy statistic of a consumer', () => {
    expect(consumerEnergyStat(makeM4Hass(), 'sensor.heimkino_power', PREFS)).toBe('sensor.heimkino_energy');
    expect(consumerEnergyStat(makeM4Hass(), 'sensor.netzwerkschrank_power', PREFS)).toBeUndefined();
  });
});

describe('weather metric series', () => {
  it('turns history rows and the hourly forecast into past and future points', () => {
    const hist = [
      { s: 'rainy', a: { humidity: 80, visibility: 40 }, lu: 1000 },
      { s: 'rainy', a: { humidity: 84, visibility: 30 }, lu: 2000 },
    ];
    const fc = [{ datetime: new Date(3_000_000).toISOString(), humidity: 87, visibility: 33000 }];
    expect(weatherSeries('humidity', hist, fc)).toEqual({
      past: [{ t: 1_000_000, v: 80 }, { t: 2_000_000, v: 84 }],
      future: [{ t: 3_000_000, v: 87 }],
    });
    // forecast visibility comes in metres, the entity in km
    expect(weatherSeries('visibility', hist, fc).future).toEqual([{ t: 3_000_000, v: 33 }]);
    expect(Object.keys(WEATHER_METRICS)).toEqual(['humidity', 'wind', 'pressure', 'uv', 'visibility']);
  });
});

describe('time chart', () => {
  it('places points by time between start and end', () => {
    const g = timeChart([{ t: 0, v: 0 }, { t: 50, v: 10 }, { t: 100, v: 20 }], 0, 100, 200, 10, 110, { snap: 10 });
    expect(g.x(50)).toBe(100);
    expect(g.lo).toBe(0);
    expect(g.hi).toBe(20);
    expect(g.line).toBe('0,110 100,60 200,10');
  });
});
