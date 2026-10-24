import { describe, expect, it } from 'vitest';
import { weatherWarnings } from '../src/logic/weather';
import { nowItems } from '../src/logic/overview';
import { resolveRooms } from '../src/logic/rooms';
import { makeHass, NOW, type Def } from './fixture';

const config = { type: 'custom:ha-start-dashboard' };
const iso = (h: number, d = 24) => new Date(2026, 9, d, h, 0).toISOString();

const WARN: Record<string, Def> = {
  'sensor.musterstadt_aktuelle_warnstufe': ['2', {
    region_name: 'Kreis Musterland', warning_count: 2,
    warning_1_name: 'STURMBÖEN', warning_1_level: 2, warning_1_headline: 'Amtliche WARNUNG vor STURMBÖEN',
    warning_1_description: 'Es treten Sturmböen mit Geschwindigkeiten um 70 km/h auf.', warning_1_start: iso(18), warning_1_end: iso(23), warning_1_color: '#ffaa00',
    warning_2_name: 'DAUERREGEN', warning_2_level: 1, warning_2_headline: 'Amtliche WARNUNG vor DAUERREGEN',
    warning_2_start: iso(12), warning_2_end: iso(6, 25), warning_2_color: '#ffeb3b',
  }, 10, { platform: 'dwd_weather_warnings' }],
  'sensor.musterstadt_vorwarnstufe': ['3', {
    region_name: 'Kreis Musterland', warning_count: 1,
    warning_1_name: 'ORKANBÖEN', warning_1_level: 3, warning_1_headline: 'Amtliche UNWETTERWARNUNG vor ORKANBÖEN',
    warning_1_start: iso(8, 25), warning_1_end: iso(14, 25), warning_1_color: '#ff0000',
  }, 10, { platform: 'dwd_weather_warnings' }],
};

describe('DWD weather warnings', () => {
  it('reads current and advance warnings, most severe first', () => {
    const w = weatherWarnings(makeHass({}, NOW, WARN), config, NOW);
    expect(w.map((x) => [x.title, x.level, x.current, x.when])).toEqual([
      ['Sturmböen', 2, true, 'bis 23:00'],
      ['Dauerregen', 1, true, 'bis morgen 06:00'],
      ['Orkanböen', 3, false, 'morgen 08:00 – 14:00'],
    ]);
    expect(w[0]).toMatchObject({ color: '#ffaa00', text: 'Es treten Sturmböen mit Geschwindigkeiten um 70 km/h auf.' });
  });

  it('merges warnings of the same type into one with the highest level and the full span', () => {
    const h = makeHass({}, NOW, {
      'sensor.musterstadt_aktuelle_warnstufe': ['2', {
        warning_count: 4,
        warning_1_name: 'WINDBÖEN', warning_1_level: 1, warning_1_headline: 'Amtliche WARNUNG vor WINDBÖEN',
        warning_1_description: 'Windböen bis 60 km/h.', warning_1_start: iso(18), warning_1_end: iso(22), warning_1_color: '#ffeb3b',
        warning_2_name: 'STURMBÖEN', warning_2_level: 2, warning_2_headline: 'Amtliche WARNUNG vor STURMBÖEN',
        warning_2_description: 'Sturmböen bis 80 km/h.', warning_2_start: iso(22), warning_2_end: iso(14, 25), warning_2_color: '#fb8c00',
        warning_3_name: 'WINDBÖEN', warning_3_level: 1, warning_3_headline: 'Amtliche WARNUNG vor WINDBÖEN',
        warning_3_description: 'Windböen bis 60 km/h, später Südwest.', warning_3_start: iso(22), warning_3_end: iso(17, 25), warning_3_color: '#ffeb3b',
        warning_4_name: 'STURMBÖEN', warning_4_level: 3, warning_4_headline: 'Amtliche UNWETTERWARNUNG vor STURMBÖEN',
        warning_4_description: 'Schwere Sturmböen bis 90 km/h.', warning_4_start: iso(23), warning_4_end: iso(5, 25), warning_4_color: '#e53935',
      }, 10, { platform: 'dwd_weather_warnings' }],
    });
    const w = weatherWarnings(h, config, NOW);
    expect(w.map((x) => [x.title, x.level, x.when, x.color, x.text])).toEqual([
      ['Sturmböen', 3, 'bis morgen 14:00', '#e53935', 'Schwere Sturmböen bis 90 km/h.'],
      ['Windböen', 1, 'bis morgen 17:00', '#ffeb3b', 'Windböen bis 60 km/h.'],
    ]);
  });

  it('is empty without the integration or without warnings', () => {
    expect(weatherWarnings(makeHass(), config, NOW)).toEqual([]);
    const calm = makeHass({ 'sensor.musterstadt_aktuelle_warnstufe': { state: '0', attributes: { warning_count: 0 } }, 'sensor.musterstadt_vorwarnstufe': { state: '0', attributes: { warning_count: 0 } } }, NOW, WARN);
    expect(weatherWarnings(calm, config, NOW)).toEqual([]);
  });

  it('shows current warnings in Aktuell instead of the gust fallback', () => {
    const h = makeHass({ 'sensor.musterstadt_windboen': { state: '72' } }, NOW, WARN);
    const items = nowItems(h, config, resolveRooms(h, config), NOW).filter((i) => i.id.startsWith('warn') || i.id === 'storm');
    expect(items.map((i) => [i.title, i.text])).toEqual([
      ['Warnung: Sturmböen', 'bis 23:00 · Dauerregen bis morgen 06:00'],
    ]);
  });
});
