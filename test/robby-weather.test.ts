import { describe, expect, it } from 'vitest';
import { consumables, robbyMaps, robbyPrograms, robbySelection, robbyStatus, startLabel } from '../src/logic/robby';
import { compass, dailyRows, hourlySlots, pollenInfo, weatherNow } from '../src/logic/weather';
import { NOW } from './fixture';
import { DAILY, HOURLY, makeM5Hass } from './fixture-m5';

const config = { type: 'custom:ha-start-dashboard' };

describe('weather', () => {
  it('summarises now with today from the daily forecast', () => {
    const w = weatherNow(makeM5Hass(), config, DAILY, NOW);
    expect(w).toMatchObject({ temp: '9°', label: 'Regen', today: 'heute 8° – 9° · 3,4 mm', source: 'DWD · Stand 18 Uhr' });
    expect(w.chips.map((c) => c.label)).toEqual(['Feuchte 80 %', 'Wind 30 km/h SW', '1012 hPa', 'UV 2', 'Sicht 47 km']);
  });

  it('turns degrees into compass points', () => {
    expect([0, 44, 90, 180, 225, 315, 350].map(compass)).toEqual(['N', 'NO', 'O', 'S', 'SW', 'NW', 'N']);
  });

  it('picks every second hour from the current hour', () => {
    const h = hourlySlots(HOURLY, NOW);
    expect(h.map((x) => [x.t, x.temp, x.rain])).toEqual([
      ['19', 8, '0,1'], ['21', 8, '0,7'], ['23', 9, '1,5'], ['01', 9, '2,6'], ['03', 9, '2,9'], ['05', 9, '2,7'],
    ]);
  });

  it('builds 7 day rows with a shared temperature scale', () => {
    const d = dailyRows(DAILY);
    expect(d.map((x) => x.day)).toEqual(['Sa', 'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr']);
    expect(d.map((x) => x.rain)).toEqual(['3,4 mm', '24,6 mm', '1,5 mm', '', '', '', '']);
    expect(d[0]).toMatchObject({ min: 8, max: 9, left: 10, width: 10 });
    expect(d[3]).toMatchObject({ min: 11, max: 17, left: 40, width: 60 });
  });

  it('reports pollen', () => {
    expect(pollenInfo(makeM5Hass(), config)).toMatchObject({ level: 0, title: 'Kein Pollenflug', text: 'alle 8 Pollenarten 0' });
    const p = pollenInfo(makeM5Hass({ 'sensor.pollenflug_birke_41': { state: '2' }, 'sensor.pollenflug_graeser_41': { state: '0.5' } }), config);
    expect(p).toMatchObject({ level: 2, title: 'Pollenflug', text: 'Birke 2 · Gräser 0,5' });
  });
});

describe('robby', () => {
  it('shows status and battery', () => {
    expect(robbyStatus(makeM5Hass(), config)).toMatchObject({ label: 'Geladen · 100 %', cleaning: false, error: false });
    const h = makeM5Hass({ 'sensor.robby_status': { state: 'cleaning' }, 'sensor.robby_batterie': { state: '80' }, 'vacuum.robby': { state: 'cleaning' } });
    expect(robbyStatus(h, config)).toMatchObject({ label: 'Reinigt · 80 %', cleaning: true });
  });

  it('lists consumables, due at or below zero', () => {
    expect(consumables(makeM5Hass(), config).map((c) => [c.name, c.value, c.due])).toEqual([
      ['Filter', 'fällig', true], ['Sensoren', 'fällig', true], ['Hauptbürste', '127 h', false], ['Seitenbürste', '27 h', false],
    ]);
  });

  it('knows maps, rooms and the current selection', () => {
    const maps = robbyMaps(makeM5Hass(), config);
    expect(maps.map((m) => m.name)).toEqual(['EG', 'OG', 'Schlafzimmer']);
    expect(maps[0].rooms).toEqual([{ segment: 16, name: 'Küche' }, { segment: 17, name: 'Wohnen' }, { segment: 18, name: 'Flur' }, { segment: 19, name: 'Essen' }]);
    expect(robbySelection(makeM5Hass(), config)).toEqual([16, 19]);
    expect(robbySelection(makeM5Hass({ 'input_text.robby_raumauswahl': { state: 'unknown' } }), config)).toEqual([]);
  });

  it('takes rooms per map from the config', () => {
    const maps = robbyMaps(makeM5Hass(), { ...config, vacuum_maps: { EG: { 1: 'Alles' } } });
    expect(maps[0].rooms).toEqual([{ segment: 1, name: 'Alles' }]);
    expect(maps[1].rooms).toEqual([]);
  });

  it('has six default programmes', () => {
    expect(robbyPrograms(config).map((p) => `${p.tag} ${p.name}`)).toEqual([
      'EG Saugen', 'EG Saugen + Wischen', 'EG Täglich K/E/F', 'OG Saugen', 'SZ Schlafzimmer', 'Alle Karte komplett',
    ]);
  });

  it('labels the start button', () => {
    expect([0, 1, 3].map(startLabel)).toEqual(['Raum wählen', '1 Raum starten', '3 Räume starten']);
  });
});
