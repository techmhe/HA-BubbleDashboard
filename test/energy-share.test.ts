import { describe, expect, it } from 'vitest';
import { energyToday, shareSeries } from '../src/logic/energy';

const H = 3600_000;
const pts = (vals: number[]) => vals.map((v, i) => ({ t: i * H, v }));
// three hours: night (grid only), noon (PV covers all, surplus exported), evening (mixed)
const parts = { pv: pts([0, 3, 1]), import: pts([0.4, 0, 0.5]), export: pts([0, 2, 0]) };

describe('autarky and self-use per bucket', () => {
  it('autarky: share of consumption covered locally, per bucket and in total', () => {
    const r = shareSeries('autarky', parts);
    expect(r.points).toEqual([{ t: 0, v: 0 }, { t: H, v: 100 }, { t: 2 * H, v: 67 }]);
    // total like the "Heute" bar: consumed 2.9, from the grid 0.9
    expect(r.total).toBe(69);
  });

  it('self-use: share of solar used in the house; hours without solar are left out', () => {
    const r = shareSeries('selfuse', parts);
    expect(r.points).toEqual([{ t: H, v: 33 }, { t: 2 * H, v: 100 }]);
    expect(r.total).toBe(50);
  });

  it('has no total without any energy', () => {
    expect(shareSeries('selfuse', { pv: pts([0]), import: pts([1]), export: pts([0]) })).toEqual({ points: [], total: null });
  });
});

describe('battery in autarky', () => {
  it('counts battery discharge as local supply and charging as not consumed', () => {
    // night: battery runs the house; noon: PV charges the battery and exports the rest
    const r = shareSeries('autarky', {
      pv: pts([0, 3]), import: pts([0.1, 0]), export: pts([0, 1]),
      batteryOut: pts([0.4, 0]), batteryIn: pts([0, 1]),
    });
    expect(r.points).toEqual([{ t: 0, v: 80 }, { t: H, v: 100 }]);
    expect(r.total).toBe(93);
  });

  it('uses the battery in the "Heute" numbers too', () => {
    const t = energyToday({} as never, { type: 'x' } as never, { pv: 3, import: 0.1, export: 1, batteryOut: 0.4, batteryIn: 1 });
    expect([t.consumed, t.local, t.autarky, t.selfUse]).toEqual([1.5, 1.4, 93, 67]);
  });
});
