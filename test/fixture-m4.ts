import { makeHass, NOW, type Def } from './fixture';
import { ROOM_EXTRAS } from './fixture-rooms';

const W = { device_class: 'power', unit_of_measurement: 'W' };
const KWH = { device_class: 'energy', unit_of_measurement: 'kWh' };

/** Energie: evening, no PV, battery delivers a little, grid import. */
export const ENERGY_EXTRAS: Record<string, Def> = {
  'sensor.hausverbrauch': ['790', W],
  'sensor.marstek_venus_a_pv_aktuelle_leistung': ['0.0', W],
  'sensor.marstek_venus_a_ac_leistung': ['16', W],
  'sensor.marstek_venus_a_batterie_ladezustand': ['25', { device_class: 'battery', unit_of_measurement: '%' }],
  'sensor.stromverbrauch_shelly_messung': ['775.4', W, 1, { area: 'flur_eg', device: 'dev_meter' }],
  'sensor.stromzahler_shelly_phase_a_active_power': ['94.7', W, 1, { device: 'dev_meter' }],
  'sensor.pv_heute': ['6.5', KWH],
  'sensor.netzbezug_heute': ['4.7', KWH],
  'sensor.einspeisung_heute': ['2.9', KWH],
  'sensor.stromverbrauch_nicht_erfasst': ['694', W],
  'sensor.netzwerkschrank_power': ['71', W, 1, { device: 'dev_rack' }],
  'sensor.core01_port_1_poe_power': ['6.57', W, 1, { area: 'arbeitszimmer_von_max' }],
  'sensor.kuhlschrank_power': ['0', W, 1, { area: 'kuche' }],
};

const contact = (name: string, area: string, state = 'off', platform?: string): Def =>
  [state, { device_class: 'door', friendly_name: name }, 30, { area, platform }];

/** Schutz: contact sensors (all classed as door, like the real ones). */
export const SECURITY_EXTRAS: Record<string, Def> = {
  'binary_sensor.fenstersensor_haustur_contact': contact('Fenstersensor Haustür', 'flur_eg'),
  'binary_sensor.fenstersensor_wohnzimmer_strasse_1_contact': contact('Fenstersensor Wohnzimmer Straße 1', 'wohnzimmer'),
  'binary_sensor.fenstersensor_wohnzimmer_strasse_2_contact': contact('Fenstersensor Wohnzimmer Straße 2', 'wohnzimmer', 'on'),
  'binary_sensor.tursensor_esszimmer_contact': contact('Türsensor Esszimmer', 'esszimmer_kuche'),
  'binary_sensor.vtherm_wohnzimmer_window_state': [
    'off', { device_class: 'window', friendly_name: 'vTherm Wohnzimmer Fensterstatus' }, 30, { area: 'wohnzimmer', platform: 'versatile_thermostat' },
  ],
  'binary_sensor.x2d_gehausetur': contact('Gehäusetür', 'arbeitszimmer_von_max', 'unavailable', 'bambu_lab'),
  'alarm_control_panel.alarmo': ['disarmed', { last_triggered: '2026-08-05 05:20:54' }, 10],
  'camera.doorbell01': ['idle', { friendly_name: 'Doorbell' }],
  'binary_sensor.doorbell01_bewegung': ['off', { device_class: 'motion' }],
  'binary_sensor.doorbell01_person': ['on', { device_class: 'occupancy' }],
};

export function makeM4Hass(overrides: Parameters<typeof makeHass>[0] = {}) {
  return makeHass(overrides, NOW, { ...ROOM_EXTRAS, ...ENERGY_EXTRAS, ...SECURITY_EXTRAS });
}
