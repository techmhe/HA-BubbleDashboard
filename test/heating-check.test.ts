import { describe, expect, it } from 'vitest';
import { heatingAlerts, wasHeating, wasOpen, type HeatingRoomInput } from '../src/logic/heating-check';

const M5 = 5 * 60_000;
/** 2 h of 5-minute points rising linearly from `from` to `to`. */
const ramp = (from: number, to: number) => Array.from({ length: 24 }, (_, i) => ({ t: i * M5, v: from + ((to - from) * i) / 23 }));

const base: HeatingRoomInput = {
  slug: 'badezimmer', name: 'Badezimmer',
  temps: ramp(19.5, 21), hums: ramp(60, 62), power: 20,
  heated: false, windowOpened: false, off: false, cur: 21, target: 18,
};
const check = (r: Partial<HeatingRoomInput>, pv = 0) => heatingAlerts([{ ...base, ...r }], pv);

describe('heating check', () => {
  it('flags a room that keeps warming without calling for heat', () => {
    expect(check({})).toEqual([{ slug: 'badezimmer', name: 'Badezimmer', rise: 1.5, hours: 2 }]);
  });

  it('also flags a room whose thermostat is off', () => {
    expect(check({ off: true, target: null })).toHaveLength(1);
  });

  it('ignores small rises and rooms below target', () => {
    expect(check({ temps: ramp(20.5, 21.2) })).toEqual([]);
    expect(check({ cur: 17.5, target: 18, temps: ramp(16, 17.5) })).toEqual([]);
  });

  it('ignores rooms that heated, had a window open, or have a heat source', () => {
    expect(check({ heated: true })).toEqual([]);
    expect(check({ windowOpened: true })).toEqual([]);
    expect(check({ power: 400 })).toEqual([]); // gaming PC, dryer
    expect(check({}, 900)).toEqual([]); // sun
    expect(check({ hums: ramp(60, 78) })).toEqual([]); // shower
  });

  it('rules out the sun only for rooms that get sun', () => {
    const living = { ...base, slug: 'wohnzimmer', name: 'Wohnzimmer' };
    const alerts = heatingAlerts([base, living], 900, { sunny: ['badezimmer', 'schlafzimmer'] });
    expect(alerts.map((a) => a.slug)).toEqual(['wohnzimmer']);
  });

  it('needs enough data and honours custom limits', () => {
    expect(check({ temps: ramp(19, 21).slice(0, 4) })).toEqual([]);
    expect(heatingAlerts([{ ...base, power: 120 }], 0, { max_power: 100 })).toEqual([]);
    expect(heatingAlerts([{ ...base, temps: ramp(20.3, 21) }], 0, { min_rise: 0.5 })).toHaveLength(1);
  });

  it('reads heating and open windows from history rows', () => {
    expect(wasHeating([{ s: 'heat', a: { hvac_action: 'idle' } }, { s: 'heat', a: { hvac_action: 'heating' } }])).toBe(true);
    expect(wasHeating([{ s: 'heat', a: { hvac_action: 'idle' } }])).toBe(false);
    expect(wasOpen([{ s: 'off' }, { s: 'on' }, { s: 'off' }])).toBe(true);
    expect(wasOpen([{ s: 'off' }])).toBe(false);
  });
});

import { nowItems } from '../src/logic/overview';
import { resolveRooms } from '../src/logic/rooms';
import { makeHass, NOW } from './fixture';

describe('heating check in Aktuell', () => {
  const cfg = { type: 'custom:ha-start-dashboard' };
  it('lists rooms that warm without heating and opens the room', () => {
    const h = makeHass();
    const items = nowItems(h, cfg, resolveRooms(h, cfg), NOW, [
      { slug: 'badezimmer', name: 'Badezimmer', rise: 1.4, hours: 2 },
      { slug: 'wohnzimmer', name: 'Wohnzimmer', rise: 1.1, hours: 2 },
    ]);
    const heat = items.find((i) => i.id === 'heat')!;
    expect(heat).toMatchObject({ title: 'Heizung prüfen', text: 'Badezimmer +1,4° · Wohnzimmer +1,1° in 2 h ohne Heizbedarf', tap: { room: 'badezimmer' } });
    expect(nowItems(h, cfg, resolveRooms(h, cfg), NOW).some((i) => i.id === 'heat')).toBe(false);
  });
});

import { loadHeatingAlerts } from '../src/data/heating-check';

describe('heating check loader', () => {
  it('reads heating demand from statistics and keeps the window history small', async () => {
    const cfg = { type: 'custom:ha-start-dashboard' };
    const base = makeHass({ 'sensor.vtherm_badezimmer_power_percent': { state: '0' } });
    const rooms = resolveRooms(base, cfg).filter((r) => r.slug === 'badezimmer');
    const calls: Record<string, unknown>[] = [];
    const now = NOW.getTime();
    const temps = Array.from({ length: 24 }, (_, i) => ({ start: now - (23 - i) * M5, mean: 19 + i * 0.08 }));
    const hass = {
      ...base,
      states: { ...base.states, [rooms[0].climate!]: { ...base.states[rooms[0].climate!], state: 'heat', attributes: { ...base.states[rooms[0].climate!].attributes, hvac_action: 'idle', temperature: 18, current_temperature: 20.8 } } },
      callWS: async (msg: Record<string, unknown>) => {
        calls.push(msg);
        if (msg.type === 'recorder/statistics_during_period') {
          return { [rooms[0].temperature]: temps, 'sensor.vtherm_badezimmer_power_percent': [{ start: now - 3 * 3600_000, mean: 0, max: 0 }] };
        }
        return {};
      },
    } as unknown as typeof base;
    const alerts = await loadHeatingAlerts(hass, rooms, [], {}, now);
    expect(calls.filter((c) => c.type === 'history/history_during_period').every((c) => c.no_attributes === true)).toBe(true);
    expect((calls[0].statistic_ids as string[])).toContain('sensor.vtherm_badezimmer_power_percent');
    expect(alerts.map((a) => a.slug)).toEqual(['badezimmer']);
  });
});
