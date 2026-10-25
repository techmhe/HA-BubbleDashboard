import { describe, expect, it } from 'vitest';
import { isSnoozed, looksStuck, parseSnooze, shortOpen, snoozeValue, windowState } from '../src/logic/window-state';
import { resolveRooms } from '../src/logic/rooms';
import { makeHass, NOW } from './fixture';

const cfg = { type: 'custom:ha-start-dashboard' };
const MIN = 60_000;
const at = (h: ReturnType<typeof makeHass>, slug: string, o = {}) =>
  windowState(h, resolveRooms(h, cfg).find((r) => r.slug === slug)!, cfg, NOW, o);

describe('window state', () => {
  it('recommends airing while the window is closed', () => {
    expect(at(makeHass(), 'arbeitszimmer_anna').kind).toBe('recommend');
    expect(at(makeHass(), 'wohnzimmer').kind).toBe('none');
  });

  it('counts down the recommended duration while airing', () => {
    const h = makeHass({ 'binary_sensor.fenster_wohnzimmer': { state: 'on', minutesAgo: 4 } }); // stossluften_dauer 15
    expect(at(h, 'wohnzimmer')).toMatchObject({ kind: 'airing', remaining: 11 * 60, openMin: 4 });
  });

  it('keeps airing through a 5 minute grace, then says the window is open too long', () => {
    expect(at(makeHass({ 'binary_sensor.fenster_wohnzimmer': { state: 'on', minutesAgo: 18 } }), 'wohnzimmer'))
      .toMatchObject({ kind: 'airing', remaining: 0 });
    expect(at(makeHass({ 'binary_sensor.fenster_wohnzimmer': { state: 'on', minutesAgo: 20 } }), 'wohnzimmer'))
      .toMatchObject({ kind: 'overdue', reason: 'Zeit um', openMin: 20 });
  });

  it('says the window is open too long when airing does not help', () => {
    const h = makeHass({
      'binary_sensor.fenster_wohnzimmer': { state: 'on', minutesAgo: 6 },
      'sensor.wohnzimmer_luftung': { state: 'Nicht lüften' },
    });
    expect(at(h, 'wohnzimmer')).toMatchObject({ kind: 'overdue', reason: 'bringt nichts' });
  });

  it('marks a doubtful sensor, and a snoozed window as plainly open', () => {
    const h = makeHass({ 'binary_sensor.fenster_wohnzimmer': { state: 'on', minutesAgo: 90 } });
    expect(at(h, 'wohnzimmer', { stuck: true }).kind).toBe('stuck');
    expect(at(h, 'wohnzimmer', { snoozed: true }).kind).toBe('open');
    expect(at(makeHass({ 'binary_sensor.fenster_wohnzimmer': { state: 'unavailable' } }), 'wohnzimmer').kind).toBe('stuck');
  });
});

describe('snooze helper value', () => {
  const now = NOW.getTime();
  it('adds, replaces and drops expired entries', () => {
    const v1 = snoozeValue('', 'binary_sensor.fenster_bad', now + 60 * MIN, now);
    const m1 = parseSnooze(v1);
    expect(isSnoozed(m1, 'binary_sensor.fenster_bad', now)).toBe(true);
    expect(isSnoozed(m1, 'binary_sensor.fenster_bad', now + 61 * MIN)).toBe(false);
    const v2 = snoozeValue(v1, 'binary_sensor.fenster_kueche', now + 130 * MIN, now + 70 * MIN);
    expect(Object.keys(parseSnooze(v2))).toEqual(['fenster_kueche']);
    expect(snoozeValue(v1, 'binary_sensor.fenster_bad', now + 120 * MIN, now).split(';')).toHaveLength(1);
  });
  it('stays within the 255 characters of an input_text', () => {
    let v = '';
    for (let i = 0; i < 20; i++) v = snoozeValue(v, `binary_sensor.fenstersensor_raum_nummer_${i}_contact`, now + 60 * MIN, now);
    expect(v.length).toBeLessThanOrEqual(255);
    expect(isSnoozed(parseSnooze(v), 'binary_sensor.fenstersensor_raum_nummer_19_contact', now)).toBe(true);
  });
});

describe('stuck sensor', () => {
  const opened = 0;
  const pts = (vals: number[]) => vals.map((v, i) => ({ t: (i - 2) * 5 * MIN, v }));
  it('flags a room that shows no sign of an open window although it is much colder outside', () => {
    expect(looksStuck(pts([20, 20, 20, 19.9, 20, 20, 20, 20]), pts([60, 60, 60, 61, 60, 60, 60, 60]), opened, 8)).toBe(true);
  });
  it('trusts the sensor when the room cooled, humidity moved or outside is not colder', () => {
    expect(looksStuck(pts([20, 20, 19.4, 19, 18.8, 18.9, 19, 19]), pts([60, 60, 58, 57, 56, 56, 56, 56]), opened, 8)).toBe(false);
    expect(looksStuck(pts([20, 20, 20, 20, 20, 20, 20, 20]), pts([60, 60, 55, 54, 54, 54, 54, 54]), opened, 8)).toBe(false);
    expect(looksStuck(pts([20, 20, 20, 20, 20, 20, 20, 20]), pts([60, 60, 60, 60, 60, 60, 60, 60]), opened, 18.5)).toBe(false);
    expect(looksStuck([], [], opened, 8)).toBe(false);
  });
});

import { nowItems } from '../src/logic/overview';

describe('window items in Aktuell', () => {
  it('offers to ignore an overdue window for an hour via the snooze helper', () => {
    const h = makeHass({
      'binary_sensor.fenster_wohnzimmer': { state: 'on', minutesAgo: 34 },
      'input_text.fenster_ignorieren': { state: '' },
    });
    const item = nowItems(h, cfg, resolveRooms(h, cfg), NOW).find((i) => i.id === 'window:wohnzimmer')!;
    expect(item.action).toMatchObject({ label: '1 h ignorieren', domain: 'input_text', service: 'set_value', target: { entity_id: 'input_text.fenster_ignorieren' } });
    const map = parseSnooze(String(item.action!.data.value));
    expect(isSnoozed(map, 'binary_sensor.fenster_wohnzimmer', NOW.getTime() + 59 * MIN)).toBe(true);
  });

  it('asks to check a doubtful sensor and hides snoozed windows', () => {
    const h = makeHass({ 'binary_sensor.fenster_wohnzimmer': { state: 'on', minutesAgo: 90 } });
    const rooms = resolveRooms(h, cfg);
    const win = (o: object) => (r: (typeof rooms)[number]) => windowState(h, r, cfg, NOW, r.slug === 'wohnzimmer' ? o : {});
    const stuck = nowItems(h, cfg, rooms, NOW, [], win({ stuck: true }));
    expect(stuck.find((i) => i.id === 'sensor:wohnzimmer')).toMatchObject({ title: 'Fenstersensor prüfen', tap: { room: 'wohnzimmer' } });
    const snoozed = nowItems(h, cfg, rooms, NOW, [], win({ snoozed: true }));
    expect(snoozed.some((i) => i.id.endsWith(':wohnzimmer'))).toBe(false);
  });
});

describe('short open time', () => {
  it('fits a pill', () => {
    expect([5, 59, 60, 124].map(shortOpen)).toEqual(['5 min', '59 min', '1 h', '2 h']);
  });
});
