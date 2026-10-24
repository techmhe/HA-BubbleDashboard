import { describe, expect, it } from 'vitest';
import { I } from '../src/icons';
import { alarmIcon, statusBubbles } from '../src/logic/overview';
import { makeHass } from './fixture';

describe('alarm icon', () => {
  it('shows the armed mode and keeps the shield when inactive', () => {
    expect(alarmIcon('armed_away')).toBe(I.car);
    expect(alarmIcon('armed_home')).toBe(I.home);
    expect(alarmIcon('armed_night')).toBe(I.moon);
    expect(alarmIcon('disarmed')).toBe(I.shield);
    expect(alarmIcon('triggered')).toBe(I.shield);
    expect(alarmIcon('unavailable')).toBe(I.shield);
  });

  it('uses it for the Alarm status bubble', () => {
    const hass = makeHass({ 'alarm_control_panel.alarmo': { state: 'armed_night' } });
    const b = statusBubbles(hass, { type: 'custom:ha-start-dashboard' }).find((x) => x.key === 'alarm');
    expect(b?.icon).toBe(I.moon);
  });
});
