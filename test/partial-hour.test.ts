import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadEnergy, loadEnergyToday, loadPower } from '../src/data/series';
import type { HomeAssistant } from '../src/types';

const HOUR = 3600_000;
const MIN5 = 5 * 60_000;
// 18:47 local time: hourly statistics exist up to 17:00–18:00 only.
const NOW = new Date(2026, 9, 25, 18, 47).getTime();
const HOUR_START = new Date(2026, 9, 25, 18, 0).getTime();

/** Long-term rows only for finished hours; 5-minute rows for the running hour. */
function mockHass(calls: Record<string, unknown>[] = []) {
  return {
    callWS: async (msg: Record<string, unknown>) => {
      calls.push(msg);
      const ids = msg.statistic_ids as string[];
      const out: Record<string, unknown[]> = {};
      for (const id of ids) {
        if (msg.period === '5minute') {
          const rows = [];
          for (let t = HOUR_START; t + MIN5 <= NOW; t += MIN5) rows.push({ start: t, change: 0.05, mean: 400 });
          out[id] = rows;
        } else if (msg.period === 'hour') {
          out[id] = [{ start: HOUR_START - HOUR, change: 1, mean: 300 }];
        } else {
          const midnight = new Date(2026, 9, 25).getTime();
          out[id] = [{ start: midnight, change: 5, mean: 300 }];
        }
      }
      return out;
    },
  } as unknown as HomeAssistant;
}

describe('running hour in energy charts', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });
  afterEach(() => vi.useRealTimers());

  it('fills the current hour bar from 5-minute statistics', async () => {
    const calls: Record<string, unknown>[] = [];
    const r = await loadEnergy(mockHass(calls), ['sensor.grid_in'], '24h');
    const cur = r.past.find((p) => p.t === HOUR_START);
    // 18:00–18:45 → 9 finished 5-minute rows of 0.05 kWh.
    expect(cur?.v).toBeCloseTo(0.45);
    expect(r.past.find((p) => p.t === HOUR_START - HOUR)?.v).toBe(1);
    const short = calls.find((c) => c.period === '5minute');
    expect(short?.start_time).toBe(new Date(HOUR_START).toISOString());
  });

  it('adds the current hour to today in the daily view', async () => {
    const r = await loadEnergy(mockHass(), ['sensor.grid_in'], '7d');
    const today = r.past[r.past.length - 1];
    expect(today.v).toBeCloseTo(5.45);
  });

  it('includes the current hour in today\'s totals', async () => {
    const t = await loadEnergyToday(mockHass(), { solar: ['sensor.pv'], import: ['sensor.grid_in'], export: [], batteryOut: [], batteryIn: [] });
    expect(t.pv).toBeCloseTo(1.45);
    expect(t.import).toBeCloseTo(1.45);
  });

  it('adds the running hour to the 24 h power curve', async () => {
    const r = await loadPower(mockHass(), 'sensor.tv_power', '24h');
    expect(r.past.map((p) => p.t)).toEqual([HOUR_START - HOUR, HOUR_START]);
    expect(r.past[1].v).toBe(400);
  });

  it('does not count the running hour twice when the long-term row exists', async () => {
    const hass = mockHass();
    const base = hass.callWS.bind(hass);
    hass.callWS = (async (msg: Record<string, unknown>) => {
      const out = (await base(msg)) as Record<string, { start: number; change: number }[]>;
      if (msg.period === 'hour') out['sensor.grid_in'].push({ start: HOUR_START, change: 0.7 });
      return out;
    }) as HomeAssistant['callWS'];
    const r = await loadEnergy(hass, ['sensor.grid_in'], '24h');
    expect(r.past.find((p) => p.t === HOUR_START)?.v).toBeCloseTo(0.7);
  });
});
