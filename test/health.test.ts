import { describe, expect, it } from 'vitest';
import { healthItems, shouldLoadAlarmo } from '../src/logic/health';
import { friendlyName } from '../src/logic/util';
import { nowItems } from '../src/logic/overview';
import { resolveRooms } from '../src/logic/rooms';
import { snoozeValue } from '../src/logic/window-state';
import type { CardConfig } from '../src/types';
import { NOW } from './fixture';
import { ALARMO, healthHass, MEMBERS, offline } from './fixture-health';

const cfg: CardConfig = { type: 'custom:ha-start-dashboard' };
const run = (ov: Parameters<typeof healthHass>[0], config = cfg, alarmo = ALARMO) => {
  const h = healthHass(ov);
  return healthItems(h, config, resolveRooms(h, config), NOW, alarmo);
};

describe('sensor health', () => {
  it('titles by kind', () => {
    const [motion] = run(offline('binary_sensor.pir_flur_eg'));
    expect(motion).toMatchObject({ id: 'health:pir_flur_eg', title: 'Bewegungsmelder prüfen', text: 'Flur EG · Sensor nicht erreichbar', color: '#aeb4c0', tap: { room: 'flur_eg' } });
    expect(run(offline('binary_sensor.kontakt_terrasse_tur'))[0].title).toBe('Türsensor prüfen');
    expect(run(offline('binary_sensor.kontakt_schlafzimmer'))[0].title).toBe('Fenstersensor prüfen');
    expect(run(offline('sensor.badezimmer_temperature'))[0]).toMatchObject({ title: 'Temperatursensor prüfen', text: 'Badezimmer · Sensor nicht erreichbar' });
  });

  it('ignores tamper, disabled, unknown and online sensors', () => {
    expect(run(offline('binary_sensor.kontakt_wz_manip', 'binary_sensor.kontakt_deaktiviert'))).toEqual([]);
    expect(run({ 'binary_sensor.pir_flur_eg': { state: 'unknown' } })).toEqual([]);
    expect(run({})).toEqual([]);
  });

  it('honours health.exclude and health.extra', () => {
    const ov = offline('binary_sensor.pir_flur_eg', 'binary_sensor.garagentor');
    expect(run(ov, { ...cfg, health: { exclude: ['binary_sensor.pir_flur_eg'] } })).toEqual([]);
    const [g] = run(ov, { ...cfg, health: { extra: ['binary_sensor.garagentor'], exclude: ['binary_sensor.pir_flur_eg'] } });
    expect(g).toMatchObject({ id: 'health:garagentor', title: 'Sensor prüfen', tap: { moreInfo: 'binary_sensor.garagentor' } });
  });

  it('leaves a room window to the existing window item, but reports the front door', () => {
    const ov = offline('binary_sensor.fenster_schlafzimmer', 'binary_sensor.fenstersensor_haustur_contact');
    const items = run(ov, cfg, [{ entity_id: 'binary_sensor.fenster_schlafzimmer', type: 'window', enabled: true }, ...ALARMO]);
    expect(items.map((i) => i.id)).toEqual(['health:fenstersensor_haustur_contact']);
    expect(items[0].title).toBe('Türsensor prüfen');
    const h = healthHass(ov);
    const all = nowItems(h, cfg, resolveRooms(h, cfg), NOW, [], undefined, ALARMO).map((i) => i.id);
    expect(all).toContain('sensor:schlafzimmer');
  });

  it('reports one member of a group window, none when the group is down', () => {
    const one = run(offline(MEMBERS[1]));
    expect(one.map((i) => i.id)).toEqual(['health:kontakt_wz_mitte']);
    expect(one[0].text).toBe('Wohnzimmer · Sensor nicht erreichbar');
    expect(run(offline('binary_sensor.fenster_wohnzimmer', ...MEMBERS))).toEqual([]);
  });

  it('hides snoozed sensors and offers 1 h ignorieren', () => {
    const [it1] = run(offline('binary_sensor.pir_flur_eg'));
    expect(it1.action).toMatchObject({
      label: '1 h ignorieren', domain: 'input_text', service: 'set_value', target: { entity_id: 'input_text.fenster_ignorieren' },
      data: { value: snoozeValue('', 'binary_sensor.pir_flur_eg', NOW.getTime() + 3600_000, NOW.getTime()) },
    });
    const snoozed = snoozeValue('', 'binary_sensor.pir_flur_eg', NOW.getTime() + 1800_000, NOW.getTime());
    expect(run({ ...offline('binary_sensor.pir_flur_eg'), 'input_text.fenster_ignorieren': { state: snoozed } })).toEqual([]);
  });

  it('collapses above three', () => {
    const ids = ['binary_sensor.pir_flur_eg', 'binary_sensor.kontakt_terrasse_tur', 'binary_sensor.kontakt_schlafzimmer', 'sensor.badezimmer_temperature'];
    const items = run(offline(...ids));
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ id: 'health-many', title: '4 Sensoren offline', tap: { moreInfo: ids[0] } });
    expect(items[0].action).toBeUndefined();
    expect(items[0].text.split(' · ')).toHaveLength(4);
    const names = ids.map((id) => friendlyName(healthHass(), id));
    expect(items[0].text.split(' · ').sort()).toEqual(names.sort());
    expect(new Set(names).size).toBe(4);
    expect(run(offline(...ids.slice(0, 3)))).toHaveLength(3);
  });

  it('still reports room temperature and front door when alarmo is empty', () => {
    const items = run(offline('sensor.wohnzimmer_temperature', 'binary_sensor.fenstersensor_haustur_contact', 'binary_sensor.pir_flur_eg'), cfg, []);
    expect(items.map((i) => i.title).sort()).toEqual(['Temperatursensor prüfen', 'Türsensor prüfen']);
  });
});

describe('alarmo loading', () => {
  it('skips the admin-only call for non-admin users', () => {
    expect(shouldLoadAlarmo({ user: { is_admin: false } } as never)).toBe(false);
    expect(shouldLoadAlarmo({ user: { is_admin: true } } as never)).toBe(true);
    expect(shouldLoadAlarmo({} as never)).toBe(true);
  });
});
