import { describe, expect, it } from 'vitest';
import {
  airingInfo, airingInsight, allRoomsSelection, bucket, chart, climateSummary, clock, floorGroups, outdoor, roomClimate, stepTarget,
} from '../src/logic/climate';
import { displayName, roomDevices, roomScenes } from '../src/logic/devices';
import { resolveRooms } from '../src/logic/rooms';
import { makeHass, NOW } from './fixture';

const cfg = { type: 'custom:ha-start-dashboard' };
const roomsOf = (h = makeHass()) => resolveRooms(h, cfg);
const room = (slug: string, h = makeHass()) => roomsOf(h).find((r) => r.slug === slug)!;

describe('roomClimate', () => {
  it('reads current, target, valve, presets and state label', () => {
    const h = makeHass({
      'climate.vtherm_wohnzimmer': {
        attributes: { temperature: 20, valve_open_percent: 16, preset_mode: 'none', preset_temperatures: { eco_temp: 18, comfort_temp: 19, boost_temp: 20, frost_temp: 7 } },
      },
    });
    const c = roomClimate(h, room('wohnzimmer', h));
    expect(c).toMatchObject({ cur: 19.9, target: 20, valve: 16, preset: null, label: 'heizt', heating: true, aq: '#ffd60a' });
    expect(c.presetTemps).toEqual({ eco: 18, comfort: 19, boost: 20, frost: 7 });
  });
  it('labels lüften (recommended or window open), Soll erreicht and Aus — never ruht', () => {
    const h = makeHass({
      'binary_sensor.fenster_flur_1_og': { state: 'on' },
      'climate.vtherm_flur_eg': { state: 'off' },
    });
    expect(roomClimate(h, room('arbeitszimmer_anna', h)).label).toBe('lüften');
    expect(roomClimate(h, room('flur_1_og', h)).label).toBe('lüften');
    expect(roomClimate(h, room('arbeitszimmer_max', h)).label).toBe('Soll erreicht');
    expect(roomClimate(h, room('flur_eg', h)).label).toBe('Aus');
  });
  it('rounds humidity from sensors with decimals', () => {
    const h = makeHass({ 'sensor.wohnzimmer_humidity': { state: '61.88' } });
    expect(roomClimate(h, room('wohnzimmer', h)).hum).toBe(62);
  });
  it('parses preset temperatures given as a JSON string', () => {
    const h = makeHass({ 'climate.vtherm_badezimmer': { attributes: { preset_temperatures: '{"eco_temp":17.5,"frost_away_temp":0}' } } });
    expect(roomClimate(h, room('badezimmer', h)).presetTemps).toEqual({ eco: 17.5 });
  });
});

describe('helpers', () => {
  it('steps targets in 0.5 within limits', () => {
    expect(stepTarget(19, 0.5, 7, 30)).toBe(19.5);
    expect(stepTarget(7, -0.5, 7, 30)).toBe(7);
    expect(stepTarget(19.3, 0.5, 7, 30)).toBe(20);
  });
  it('groups rooms by floor, upper floor first, with long names', () => {
    const g = floorGroups(makeHass(), roomsOf());
    expect(g.map((f) => [f.name, f.rooms.length])).toEqual([['Obergeschoss', 5], ['Erdgeschoss', 3]]);
  });
  it('summarises heating rooms and air quality', () => {
    expect(climateSummary(makeHass(), roomsOf())).toBe('4 von 8 Räumen heizen · Luft schlecht');
  });
  it('builds the outdoor line', () => {
    const h = makeHass({
      'sensor.aussen_temperature': { state: '10.5' },
      'sensor.aussen_taupunkt_messung': { state: '7.2' },
      'weather.musterstadt': { attributes: { humidity: 80 } },
      'sensor.wohnzimmer_taupunkt': { state: '11.8' },
    });
    expect(outdoor(h, roomsOf(h), cfg)).toEqual({ title: 'Außen 10,5° · 80 %', sub: 'Taupunkt 7,2° · draußen trockener', minutes: 15 });
  });
  it('encodes the all-rooms selection as vtherm suffixes, empty for all', () => {
    const rooms = roomsOf();
    expect(allRoomsSelection(rooms, new Set(rooms.map((r) => r.slug)))).toBe('');
    expect(allRoomsSelection(rooms, new Set(['wohnzimmer', 'badezimmer']))).toBe('badezimmer,wohnzimmer');
  });
});

describe('airing', () => {
  it('counts down an active timer and lists windows and recommendations', () => {
    const h = makeHass({
      'timer.luften': { state: 'active', attributes: { duration: '0:15:00', finishes_at: new Date(NOW.getTime() + 125_000).toISOString() } },
      'binary_sensor.fenster_badezimmer': { state: 'on' },
    });
    const a = airingInfo(h, roomsOf(h), cfg, NOW);
    expect(a).toMatchObject({ active: true, remaining: 125, duration: 900 });
    expect(a.openWindows.map((r) => r.slug)).toEqual(['badezimmer']);
    expect(a.recommended.map((r) => r.slug)).toEqual(['arbeitszimmer_anna', 'badezimmer']);
    expect(clock(a.remaining)).toBe('2:05');
  });
  it('shows the planned duration when idle', () => {
    expect(airingInfo(makeHass(), [], cfg, NOW)).toMatchObject({ active: false, remaining: 900, duration: 900 });
  });
});

describe('history', () => {
  const H = 3600_000;
  it('buckets raw states into hourly means and carries values forward', () => {
    const pts = [{ t: 0, v: 18 }, { t: 0.5 * H, v: 20 }, { t: 2.2 * H, v: 21 }];
    expect(bucket(pts, 0, 3 * H, H)).toEqual([{ t: 0, v: 19 }, { t: H, v: 19 }, { t: 2 * H, v: 21 }]);
  });
  it('maps points into the chart box', () => {
    const g = chart([{ t: 0, v: 18 }, { t: 1, v: 20 }], 300, 20, 120, 0.3, 0.3, 1);
    expect([g.lo, g.hi]).toEqual([17, 21]);
    expect(g.line).toBe('0,95 300,45');
    expect(g.last).toEqual({ x: 300, y: 45 });
  });
  it('detects an airing as a humidity drop', () => {
    const base = new Date(2026, 9, 24, 8).getTime();
    const hum = [63, 63, 59, 55, 56].map((v, i) => ({ t: base + i * H, v }));
    const tmp = [19.1, 18.5, 17.7, 18.2, 19].map((v, i) => ({ t: base + i * H, v }));
    expect(airingInsight(hum, tmp)).toBe('Vormittags gelüftet: Feuchte 63 → 55 %, Raum kurz auf 17,7° abgekühlt.');
    expect(airingInsight(hum.map((p) => ({ ...p, v: 60 })), tmp)).toBeNull();
  });
});

describe('room devices and scenes', () => {
  it('lists labelled devices of the room areas plus the purifier, names without room words', () => {
    const h = makeHass({
      'fan.luftreiniger_w': { state: 'on', attributes: { friendly_name: 'Luftreiniger Wohnzimmer', preset_mode: 'Auto' } },
    });
    const r = { ...room('wohnzimmer', h), purifier: 'fan.luftreiniger_w' };
    const d = roomDevices(h, r, { 'light.wohnzimmer_vasenleuchte': 'Vase' });
    expect(d.map((x) => [x.name, x.status])).toEqual([
      ['Luftreiniger', 'An · auto'],
      ['Stehlampe', 'An'],
      ['Vase', 'An'],
    ]);
  });
  it('lists area scenes, off scenes last', () => {
    const h = makeHass();
    expect(roomScenes(h, room('wohnzimmer', h)).map((s) => s.name)).toEqual(['Cozy Evening', 'Heimkino', 'Alles aus']);
    expect(roomScenes(h, room('badezimmer', h))).toEqual([]);
  });
  it('keeps the full name when stripping would leave nothing', () => {
    const h = makeHass({ 'light.x': { state: 'on', attributes: { friendly_name: 'Wohnzimmer' } } });
    expect(displayName(h, 'light.x', room('wohnzimmer', h))).toBe('Wohnzimmer');
  });
});
