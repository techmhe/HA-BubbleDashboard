import { describe, expect, it } from 'vitest';
import { sheetKey, sheetParent } from '../src/logic/sheet-stack';

describe('sheet stack', () => {
  it('knows which sheet a child sheet was opened from', () => {
    expect(sheetParent({ id: 'weatherMetric', metric: 'humidity' })).toEqual({ id: 'weather' });
    expect(sheetParent({ id: 'weatherDay', date: '2026-10-25T00:00:00Z' })).toEqual({ id: 'weather' });
    expect(sheetParent({ id: 'history', slug: 'bad', range: '7d' })).toEqual({ id: 'room', slug: 'bad' });
    expect(sheetParent({ id: 'device', entity: 'light.a', back: { id: 'room', slug: 'bad' } })).toEqual({ id: 'room', slug: 'bad' });
    expect(sheetParent({ id: 'device', entity: 'light.a' })).toBeNull();
    const device = { id: 'device', entity: 'switch.tv', back: { id: 'room', slug: 'bad' } } as const;
    expect(sheetParent({ id: 'energyChart', key: 'sensor.tv_power', range: '24h', back: device })).toEqual(device);
    expect(sheetParent({ id: 'energyChart', key: 'pv', range: '24h' })).toBeNull();
    expect(sheetParent({ id: 'weather' })).toBeNull();
  });

  it('keys a sheet by what it shows, not by its view options', () => {
    // a parent keeps its key when it comes back to the top, so it is not re-created
    expect(sheetKey({ id: 'weather' })).toBe(sheetKey(sheetParent({ id: 'weatherMetric', metric: 'wind' })!));
    // switching the range of a chart keeps the same sheet
    expect(sheetKey({ id: 'history', slug: 'bad', range: '24h' })).toBe(sheetKey({ id: 'history', slug: 'bad', range: '30d' }));
    expect(sheetKey({ id: 'energyChart', key: 'pv', range: 'day' } as never)).toBe(sheetKey({ id: 'energyChart', key: 'pv', range: 'week' } as never));
    expect(sheetKey({ id: 'room', slug: 'bad' })).not.toBe(sheetKey({ id: 'room', slug: 'kueche' }));
  });
});
