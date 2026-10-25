import { describe, expect, it } from 'vitest';
import { guestWifi, hasTechnik, pihole, technikProblems } from '../src/logic/technik';
import { makeHass, NOW } from './fixture';
import { cfg, monitorStatus, techHass } from './fixture-technik';

describe('pi-hole', () => {
  it('becomes a problem after 70 min off', () => {
    expect(pihole(techHass({ 'switch.pi_hole': { state: 'off', minutesAgo: 69 } }), cfg(), NOW)).toMatchObject({ kind: 'off', problem: false });
    const p = pihole(techHass({ 'switch.pi_hole': { state: 'off', minutesAgo: 70 } }), cfg(), NOW)!;
    expect(p).toMatchObject({ kind: 'off', problem: true, entity: 'switch.pi_hole' });
    expect(p.offSince).toBe(NOW.getTime() - 70 * 60000);
  });

  it('shows a running pause started from this card', () => {
    const p = pihole(techHass({ 'switch.pi_hole': { state: 'off', minutesAgo: 1 } }), cfg(), NOW, NOW.getTime() + 222_000);
    expect(p).toMatchObject({ kind: 'paused', remainingSec: 222, problem: false });
  });

  it('ignores an expired pause', () => {
    expect(pihole(techHass({ 'switch.pi_hole': { state: 'off', minutesAgo: 1 } }), cfg(), NOW, NOW.getTime() - 1000)).toMatchObject({ kind: 'off' });
  });

  it('reports the blocked share when on', () => {
    expect(pihole(techHass(), cfg(), NOW)).toMatchObject({ kind: 'on', percent: 9, problem: false });
  });

  it('follows the config override and hides an unavailable switch', () => {
    const hass = techHass({ 'switch.werbung': { state: 'off', minutesAgo: 100 } });
    expect(pihole(hass, cfg({ technik: { pihole: 'switch.werbung' } }), NOW)).toMatchObject({ entity: 'switch.werbung', problem: true });
    expect(pihole(techHass({ 'switch.pi_hole': { state: 'unavailable', minutesAgo: 500 } }), cfg(), NOW)).toBeNull();
  });
});

describe('guest wlan', () => {
  it('finds the guest WLAN and its QR code, password button and clients', () => {
    expect(guestWifi(techHass(), cfg())).toEqual({
      entity: 'switch.gaeste_wlan', on: true, clients: 1,
      qr: 'image.gaeste_wlan_qr_code', regenerate: 'button.gaeste_wlan_regenerate_password',
    });
  });

  it('leaves out disabled QR and password entities', () => {
    const hass = techHass();
    delete hass.states['image.gaeste_wlan_qr_code'];
    delete hass.states['button.gaeste_wlan_regenerate_password'];
    const g = guestWifi(hass, cfg())!;
    expect(g.qr).toBeUndefined();
    expect(g.regenerate).toBeUndefined();
  });

  it('uses the configured switch', () => {
    expect(guestWifi(techHass(), cfg({ technik: { guest_wifi: 'switch.heim_wlan' } }))).toMatchObject({ entity: 'switch.heim_wlan' });
  });
});

describe('problems', () => {
  it('counts down services, pi-hole and printer errors', () => {
    const hass = techHass({ [monitorStatus('Nextcloud')]: { state: 'down', minutesAgo: 5 }, 'switch.pi_hole': { state: 'off', minutesAgo: 80 } });
    expect(technikProblems(hass, cfg(), NOW, false)).toBe(2);
    expect(technikProblems(hass, cfg(), NOW, true)).toBe(3);
    expect(technikProblems(techHass(), cfg(), NOW, false)).toBe(0);
  });

  it('knows when there is nothing technical', () => {
    expect(hasTechnik(makeHass(), cfg())).toBe(false);
    expect(hasTechnik(techHass(), cfg())).toBe(true);
  });
});
