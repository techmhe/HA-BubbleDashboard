import { describe, expect, it } from 'vitest';
import { trendFigure } from '../src/components/trend';
import { loadAiringRoom } from '../src/data/series';
import { airingForecast, cooledBy, rhAtDew } from '../src/logic/climate';
import { resolveRooms } from '../src/logic/rooms';
import type { PageContext, SheetState } from '../src/pages/context';
import { airingRoomSheet, airingSheet } from '../src/sheets/airing';
import type { CardConfig } from '../src/types';
import { makeHass, NOW } from './fixture';
import { templateText, visibleText } from './template-text';

const MIN = 60_000;
const END = NOW.getTime();
const START = END - 15 * MIN;

describe('15 minute room history', () => {
  it('loads the last 15 minutes of one sensor', async () => {
    const sent: Record<string, unknown>[] = [];
    const s = (iso: number) => iso / 1000;
    const hass = {
      callWS: async (msg: Record<string, unknown>) => {
        sent.push(msg);
        return {
          'sensor.bad_humidity': [{ s: '71', lu: s(START - 5 * MIN) }, { s: '64', lu: s(START + 8 * MIN) }],
        };
      },
    } as unknown as Parameters<typeof loadAiringRoom>[0];
    const r = await loadAiringRoom(hass, 'sensor.bad_humidity', END);
    expect(sent[0].entity_ids).toEqual(['sensor.bad_humidity']);
    expect(Date.parse(String(sent[0].start_time))).toBe(START);
    expect(r.start).toBe(START);
    expect(r.end).toBe(END);
    expect(r.past[0]).toEqual({ t: START, v: 71 });
    expect(r.past[r.past.length - 1].v).toBe(64);
  });
});

describe('how far airing can still dry the room', () => {
  it('converts a dew point to relative humidity at the room temperature (Magnus)', () => {
    expect(rhAtDew(20, 20)).toBeCloseTo(100, 5);
    expect(rhAtDew(20, 10)).toBeCloseTo(52.5, 0);
  });

  it('stops 2 K above the outdoor dew point (where the sensor says "Nicht lüften"), never below 45 %', () => {
    const pts = (v: number) => [{ t: START, v }, { t: END, v }];
    expect(airingForecast(pts(70), 20, 8)!.stopAt).toBeCloseTo(rhAtDew(20, 10), 5);
    expect(airingForecast(pts(70), 20, 2)!.stopAt).toBe(45);
    expect(airingForecast(pts(70), 20, 8)!.left).toBeCloseTo(70 - rhAtDew(20, 10), 5);
    expect(airingForecast(pts(48), 20, 8)!.left).toBeLessThan(0);
  });

  it('raises the limit while the room cools', () => {
    const pts = [{ t: START, v: 70 }, { t: END, v: 70 }];
    expect(airingForecast(pts, 17, 8)!.stopAt).toBeGreaterThan(airingForecast(pts, 20, 8)!.stopAt);
  });

  it('estimates the minutes left from the falling curve towards the outdoor dew point', () => {
    const tIn = 20, dewOut = 8;
    const floor = rhAtDew(tIn, dewOut);
    const k = 0.08; // per minute
    const pts = Array.from({ length: 16 }, (_, i) => ({ t: START + i * MIN, v: floor + (90 - floor) * Math.exp(-k * i) }));
    const now = pts[15].v;
    const expected = Math.log((now - floor) / (rhAtDew(tIn, dewOut + 2) - floor)) / k;
    expect(airingForecast(pts, tIn, dewOut)!.minutes).toBeCloseTo(expected, 0);
  });

  it('gives no time while humidity is not falling', () => {
    const flat = [{ t: START, v: 70 }, { t: END, v: 70 }];
    expect(airingForecast(flat, 20, 8)!.minutes).toBeNull();
    expect(airingForecast([], 20, 8)).toBeNull();
  });
});

describe('room cooling while airing', () => {
  it('measures the drop from the warmest point since the window opened', () => {
    const pts = [{ t: START, v: 19 }, { t: START + 2 * MIN, v: 21.2 }, { t: START + 9 * MIN, v: 18.4 }, { t: END, v: 18.1 }];
    expect(cooledBy(pts, START + MIN)).toBeCloseTo(3.1, 5);
    expect(cooledBy(pts, START + 10 * MIN)).toBe(0);
    expect(cooledBy([], START)).toBe(0);
  });
});

describe('level line in a trend chart', () => {
  it('draws a dashed horizontal line with its label', () => {
    const data = { loading: false, past: [{ t: START, v: 70 }, { t: END, v: 65 }], start: START, end: END };
    const out = templateText(trendFigure({ title: 'Luftfeuchte', color: '#5ac8fa', unit: '%', digits: 0, snap: 5, data, labels: [], level: { v: 60, label: 'lüften bis 60 %' } }));
    expect(out).toContain('tr-level');
    expect(out).toContain('lüften bis 60 %');
  });
});

const config = { type: 'custom:ha-start-dashboard' } as CardConfig;

function ctx(hass: ReturnType<typeof makeHass>, temps = [{ t: START, v: 20 }, { t: END, v: 20 }], opened: SheetState[] = []): PageContext {
  return {
    hass, config, rooms: resolveRooms(hass, config), now: NOW, ui: {},
    openSheet: (s: SheetState) => opened.push(s), closeSheet() {}, runScript() {}, call() {},
    series: (key: string) => ({ loading: false, past: key.includes('temperature') ? temps : [{ t: START, v: 70 }, { t: END, v: 60 }], start: START, end: END }),
  } as unknown as PageContext;
}

describe('airing sheet rooms', () => {
  it('opens the room chart from an open window and from a recommended room', () => {
    const hass = makeHass({ 'binary_sensor.fenster_wohnzimmer': { state: 'on' }, 'sensor.badezimmer_luftung': { state: 'Jetzt lüften' } });
    const raw = templateText(airingSheet(ctx(hass)));
    expect(raw).toMatch(/<button class="chip open"/);
    expect(raw).toMatch(/<button class="chip rec"/);
  });

  it('shows temperature and humidity with how far airing still dries the room', () => {
    const hass = makeHass({ 'sensor.badezimmer_humidity': { state: '68' }, 'sensor.badezimmer_temperature': { state: '20' }, 'sensor.aussen_taupunkt_messung': { state: '8' } });
    const sheet = airingRoomSheet(ctx(hass), 'badezimmer');
    const t = visibleText(sheet);
    expect(t).toContain('Temperatur');
    expect(t).toContain('Luftfeuchte');
    expect(t).toContain(`noch ~${Math.round(68 - rhAtDew(20, 10))} %`);
    expect(t).toContain(`lüften bis ${Math.round(rhAtDew(20, 10))} %`);
    expect(templateText(sheet)).toContain('tr-level');
  });

  it('says the window can close once the humidity reached the line', () => {
    const hass = makeHass({ 'sensor.badezimmer_humidity': { state: '48' }, 'sensor.badezimmer_temperature': { state: '20' }, 'sensor.aussen_taupunkt_messung': { state: '8' } });
    expect(visibleText(airingRoomSheet(ctx(hass), 'badezimmer'))).toContain('Ziel erreicht');
  });

  it('says close the window once the room cooled by 3 K', () => {
    const hass = makeHass({ 'sensor.badezimmer_humidity': { state: '68' }, 'sensor.badezimmer_temperature': { state: '18' }, 'sensor.aussen_taupunkt_messung': { state: '8' } });
    const t = visibleText(airingRoomSheet(ctx(hass, [{ t: START, v: 21.4 }, { t: END, v: 18 }]), 'badezimmer'));
    expect(t).toContain('3 K kühler · Fenster zu');
  });
});
