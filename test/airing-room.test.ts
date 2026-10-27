import { describe, expect, it } from 'vitest';
import { trendFigure } from '../src/components/trend';
import { loadAiringRoom } from '../src/data/series';
import { airingVerdict, type AiringBand } from '../src/logic/climate';
import { resolveRooms } from '../src/logic/rooms';
import type { PageContext, SheetState } from '../src/pages/context';
import { airingRoomSheet, airingSheet } from '../src/sheets/airing';
import type { CardConfig } from '../src/types';
import { makeHass, NOW } from './fixture';
import { templateText, visibleText } from './template-text';

const MIN = 60_000;
const END = NOW.getTime();
const START = END - 15 * MIN;
const band = (level: AiringBand['level'], from: number, to: number): AiringBand => ({ level, from: START + from * MIN, to: START + to * MIN });

describe('where airing stopped paying off', () => {
  it('ends when the last "Jetzt lüften" band ends before now', () => {
    expect(airingVerdict([band('now', 0, 9), band('possible', 9, 15)], END)).toEqual({ kind: 'ended', at: START + 9 * MIN });
  });
  it('is still running while the sensor says "Jetzt lüften"', () => {
    expect(airingVerdict([band('possible', 0, 4), band('now', 4, 15)], END)).toEqual({ kind: 'running' });
  });
  it('was not recommended in the window', () => {
    expect(airingVerdict([band('possible', 0, 15)], END)).toEqual({ kind: 'none' });
    expect(airingVerdict([], END)).toEqual({ kind: 'none' });
  });
});

describe('15 minute room history', () => {
  it('loads the last 15 minutes of one sensor with the airing bands', async () => {
    const sent: Record<string, unknown>[] = [];
    const s = (iso: number) => iso / 1000;
    const hass = {
      callWS: async (msg: Record<string, unknown>) => {
        sent.push(msg);
        return {
          'sensor.bad_humidity': [{ s: '71', lu: s(START - 5 * MIN) }, { s: '64', lu: s(START + 8 * MIN) }],
          'sensor.bad_luftung': [{ s: 'Jetzt lüften', lu: s(START - 20 * MIN) }, { s: 'Lüften möglich', lu: s(START + 10 * MIN) }],
        };
      },
    } as unknown as Parameters<typeof loadAiringRoom>[0];
    const r = await loadAiringRoom(hass, 'sensor.bad_humidity', 'sensor.bad_luftung', END);
    expect(sent[0].entity_ids).toEqual(['sensor.bad_humidity', 'sensor.bad_luftung']);
    expect(Date.parse(String(sent[0].start_time))).toBe(START);
    expect(r.start).toBe(START);
    expect(r.end).toBe(END);
    expect(r.past[0]).toEqual({ t: START, v: 71 });
    expect(r.past[r.past.length - 1].v).toBe(64);
    expect(r.bands).toEqual([band('now', 0, 10), band('possible', 10, 15)]);
  });
});

describe('vertical marker in a trend chart', () => {
  it('draws a dashed line with its label at the given time', () => {
    const data = { loading: false, past: [{ t: START, v: 60 }, { t: END, v: 55 }], start: START, end: END };
    const out = templateText(trendFigure({ title: 'Luftfeuchte', color: '#5ac8fa', unit: '%', digits: 0, snap: 5, data, labels: [], marker: { t: START + 9 * MIN, label: 'Taupunkt erreicht' } }));
    expect(out).toContain('tr-marker');
    expect(out).toContain('Taupunkt erreicht');
  });
});

const config = { type: 'custom:ha-start-dashboard' } as CardConfig;

function ctx(hass: ReturnType<typeof makeHass>, bands: AiringBand[], opened: SheetState[] = []): PageContext {
  return {
    hass, config, rooms: resolveRooms(hass, config), now: NOW, ui: {},
    openSheet: (s: SheetState) => opened.push(s), closeSheet() {}, runScript() {}, call() {},
    series: () => ({ loading: false, past: [{ t: START, v: 70 }, { t: END, v: 60 }], start: START, end: END, bands }),
  } as unknown as PageContext;
}

describe('airing sheet rooms', () => {
  it('opens the room chart from an open window and from a recommended room', () => {
    const hass = makeHass({ 'binary_sensor.fenster_wohnzimmer': { state: 'on' }, 'sensor.badezimmer_luftung': { state: 'Jetzt lüften' } });
    const raw = templateText(airingSheet(ctx(hass, [])));
    expect(raw).toMatch(/<button class="chip open"/);
    expect(raw).toMatch(/<button class="chip rec"/);
  });

  it('shows temperature and humidity with the moment the dew point said stop', () => {
    const hass = makeHass();
    const sheet = airingRoomSheet(ctx(hass, [band('now', 0, 9), band('possible', 9, 15)]), 'badezimmer');
    const t = visibleText(sheet);
    const at = new Date(START + 9 * MIN);
    const hhmm = `${String(at.getHours()).padStart(2, '0')}:${String(at.getMinutes()).padStart(2, '0')}`;
    expect(t).toContain('Temperatur');
    expect(t).toContain('Luftfeuchte');
    expect(t).toContain(`Taupunkt erreicht · ${hhmm}`);
    expect(templateText(sheet)).toContain('tr-marker');
  });

  it('says airing still pays off while the sensor says "Jetzt lüften"', () => {
    const t = visibleText(airingRoomSheet(ctx(makeHass(), [band('now', 0, 15)]), 'badezimmer'));
    expect(t).toContain('Lüften lohnt noch');
  });

});
