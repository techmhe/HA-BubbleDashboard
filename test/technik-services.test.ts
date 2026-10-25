import { describe, expect, it } from 'vitest';
import { services } from '../src/logic/technik';
import { NOW } from './fixture';
import { cfg, monitorCert, monitorStatus, techHass } from './fixture-technik';

const down = (name: string, minutesAgo = 5) => ({ [monitorStatus(name)]: { state: 'down', minutesAgo } });

describe('uptime kuma services', () => {
  it('lists a monitor down for 5 min as down', () => {
    const s = services(techHass(down('Nextcloud')), cfg(), NOW);
    expect(s.problems[0]).toMatchObject({ name: 'Nextcloud', kind: 'down', text: 'down seit 5 min' });
    expect(s.down.map((r) => r.name)).toEqual(['Nextcloud']);
  });

  it('treats a monitor down for under 3 min as pending (debounce)', () => {
    const s = services(techHass(down('Nextcloud', 2)), cfg(), NOW);
    expect(s.problems[0]).toMatchObject({ name: 'Nextcloud', kind: 'pending', text: 'prüft …' });
    expect(s.down).toEqual([]);
  });

  it('shows pending and unavailable as pending', () => {
    const s = services(techHass({ [monitorStatus('Nextcloud')]: { state: 'pending' }, [monitorStatus('Musterwiki')]: { state: 'unavailable' } }), cfg(), NOW);
    expect(s.problems.map((r) => [r.name, r.kind])).toEqual([['Musterwiki', 'pending'], ['Nextcloud', 'pending']]);
  });

  it('counts maintenance as ok', () => {
    const s = services(techHass({ [monitorStatus('Nextcloud')]: { state: 'maintenance' } }), cfg(), NOW);
    expect(s.problems).toEqual([]);
    expect(s.okMonitors).toBe(6);
  });

  it('warns about certificates under 7 days on up monitors', () => {
    const s = services(techHass({ [monitorCert('Nextcloud')]: { state: '6' }, [monitorCert('Musterwiki')]: { state: '7' } }), cfg(), NOW);
    expect(s.problems).toEqual([expect.objectContaining({ name: 'Nextcloud', kind: 'cert', text: 'Zertifikat 6 Tage' })]);
    expect(s.down).toEqual([]);
  });

  it('groups the DNS monitors; one member down makes the group down', () => {
    const ok = services(techHass(), cfg(), NOW);
    expect(ok.ok.map((r) => r.name)).toEqual(['DNS', 'Home Assistant', 'Musterwiki', 'Nextcloud']);
    expect(ok.ok[0]).toMatchObject({ members: 3 });
    const s = services(techHass(down('DNS (pihole02)')), cfg(), NOW);
    expect(s.problems[0]).toMatchObject({ name: 'DNS', kind: 'down', text: '1 von 3 down', members: 3, down: 1 });
    expect(s.down.map((r) => r.name)).toEqual(['DNS']);
  });

  it('counts monitors, not rows', () => {
    const s = services(techHass(down('Nextcloud')), cfg(), NOW);
    expect(s.total).toBe(6);
    expect(s.okMonitors).toBe(5);
  });

  it('orders problems down, pending, cert', () => {
    const s = services(techHass({ ...down('Nextcloud'), [monitorStatus('Musterwiki')]: { state: 'pending' }, [monitorCert('Home Assistant')]: { state: '3' } }), cfg(), NOW);
    expect(s.problems.map((r) => r.kind)).toEqual(['down', 'pending', 'cert']);
  });

  it('leaves out excluded monitors', () => {
    const s = services(techHass(down('Musterwiki')), cfg({ technik: { services_exclude: ['Musterwiki'] } }), NOW);
    expect(s.total).toBe(5);
    expect(s.problems).toEqual([]);
    expect([...s.ok, ...s.problems].map((r) => r.name)).not.toContain('Musterwiki');
  });

  it('skips a group with an invalid regex and replaces the default groups', () => {
    const s = services(techHass(), cfg({ technik: { service_groups: { X: '([' } } }), NOW);
    expect(s.ok.map((r) => r.name)).toContain('DNS (VRRP)');
    expect(s.ok.map((r) => r.name)).not.toContain('X');
    expect(s.total).toBe(6);
  });

  it('is empty without Uptime Kuma', () => {
    const hass = techHass();
    for (const id of Object.keys(hass.entities)) if (hass.entities[id].platform === 'uptime_kuma') delete hass.entities[id];
    expect(services(hass, cfg(), NOW)).toMatchObject({ total: 0, problems: [], ok: [] });
  });
});
