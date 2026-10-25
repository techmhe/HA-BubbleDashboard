import { describe, expect, it } from 'vitest';
import { loadPower } from '../src/data/series';
import { powerEnergyKWh } from '../src/logic/energy';
import { chartRanges } from '../src/sheets/energy-chart';
import type { HomeAssistant } from '../src/types';

const MIN5 = 5 * 60_000;

describe('device power curves', () => {
  it('loads the last 4 hours from 5-minute statistics', async () => {
    const calls: Record<string, unknown>[] = [];
    const hass = {
      callWS: async (msg: Record<string, unknown>) => {
        calls.push(msg);
        return { 'sensor.tv_power': [{ start: Date.now() - 2 * MIN5, mean: 120 }, { start: Date.now() - MIN5, mean: -80 }] };
      },
    } as unknown as HomeAssistant;
    const r = await loadPower(hass, 'sensor.tv_power', '4h');
    expect(calls[0].period).toBe('5minute');
    expect(r.end - r.start).toBe(4 * 3600_000);
    expect(r.end % MIN5).toBe(0);
    expect(r.step).toBe(MIN5);
    expect(r.past.map((p) => p.v)).toEqual([120, 80]);
  });

  it('turns mean power per bucket into energy', () => {
    expect(powerEnergyKWh([{ t: 0, v: 1000 }, { t: 1, v: 500 }], 3600_000)).toBeCloseTo(1.5);
    expect(powerEnergyKWh([{ t: 0, v: 600 }], MIN5)).toBeCloseTo(0.05);
    expect(powerEnergyKWh([], 3600_000)).toBe(0);
  });

  it('offers 4 h only for power curves', () => {
    expect(chartRanges('W').map((r) => r.id)).toEqual(['4h', '24h', '7d', '30d']);
    expect(chartRanges('kWh').map((r) => r.id)).toEqual(['24h', '7d', '30d']);
  });
});
