import type { AlarmoSensor } from '../src/logic/health';
import { makeHass, NOW, type Def } from './fixture';

export const MEMBERS = ['binary_sensor.kontakt_wz_links', 'binary_sensor.kontakt_wz_mitte', 'binary_sensor.kontakt_wz_rechts'];

export const ALARMO: AlarmoSensor[] = [
  { entity_id: 'binary_sensor.pir_flur_eg', type: 'motion', enabled: true },
  { entity_id: 'binary_sensor.kontakt_terrasse_tur', type: 'door', enabled: true },
  { entity_id: 'binary_sensor.kontakt_schlafzimmer', type: 'window', enabled: true },
  { entity_id: 'binary_sensor.kontakt_wz_manip', type: 'tamper', enabled: true },
  { entity_id: 'binary_sensor.kontakt_deaktiviert', type: 'window', enabled: false },
  ...MEMBERS.map((entity_id) => ({ entity_id, type: 'window', enabled: true })),
];

const contact = (area: string, name: string): Def => ['off', { friendly_name: name }, 60, { area }];

const extra: Record<string, Def> = {
  'binary_sensor.pir_flur_eg': ['off', { friendly_name: 'Bewegung Flur' }, 60, { area: 'flur_eg' }],
  'binary_sensor.kontakt_terrasse_tur': contact('wohnzimmer', 'Terrassentür'),
  'binary_sensor.kontakt_schlafzimmer': contact('schlafzimmer', 'Kontakt Schlafzimmer'),
  'binary_sensor.kontakt_wz_manip': contact('wohnzimmer', 'Manipulation'),
  'binary_sensor.kontakt_deaktiviert': contact('flur_1_og', 'Deaktiviert'),
  'binary_sensor.kontakt_wz_links': contact('wohnzimmer', 'Fenster links'),
  'binary_sensor.kontakt_wz_mitte': contact('wohnzimmer', 'Fenster mitte'),
  'binary_sensor.kontakt_wz_rechts': contact('wohnzimmer', 'Fenster rechts'),
  'binary_sensor.garagentor': ['off', { friendly_name: 'Garagentor' }, 60],
  'input_text.fenster_ignorieren': [''],
};

/** Hass with the Alarmo contacts above and the living room window as a group of three contacts. */
export function healthHass(overrides: Parameters<typeof makeHass>[0] = {}) {
  const group = overrides['binary_sensor.fenster_wohnzimmer'];
  return makeHass(
    { ...overrides, 'binary_sensor.fenster_wohnzimmer': { ...group, attributes: { ...group?.attributes, entity_id: MEMBERS } } },
    NOW,
    extra,
  );
}

export const offline = (...ids: string[]) => Object.fromEntries(ids.map((id) => [id, { state: 'unavailable' }]));
