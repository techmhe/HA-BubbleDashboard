import { describe, expect, it } from 'vitest';
import { nowItems } from '../src/logic/overview';
import { resolveRooms } from '../src/logic/rooms';
import { makeHass, NOW } from './fixture';

const cfg = { type: 'custom:ha-start-dashboard' };

const running = (secondsLeft: number) => ({
  state: 'active',
  attributes: { duration: '0:10:00', finishes_at: new Date(NOW.getTime() + secondsLeft * 1000).toISOString() },
});

describe('airing countdown on Übersicht', () => {
  it('shows the time left and the open windows while the timer runs', () => {
    const h = makeHass({ 'timer.luften': running(512), 'binary_sensor.fenster_wohnzimmer': { state: 'on' } });
    const item = nowItems(h, cfg, resolveRooms(h, cfg), NOW).find((i) => i.id === 'airing');
    expect(item).toMatchObject({ title: 'Lüften läuft', text: 'noch 8:32 · Wohnzimmer offen' });
  });

  it('shows only the time left when no window is open', () => {
    const h = makeHass({ 'timer.luften': running(65) });
    const item = nowItems(h, cfg, resolveRooms(h, cfg), NOW).find((i) => i.id === 'airing');
    expect(item?.text).toBe('noch 1:05');
  });
});
