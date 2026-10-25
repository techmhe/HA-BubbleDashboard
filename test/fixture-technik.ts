import { makeHass, NOW, type Def, type MockHass } from './fixture';
import type { CardConfig } from '../src/types';

/** Technik fixture: a printing 3D printer with AMS, Pi-hole, a guest WLAN and six Uptime Kuma monitors. */

export const PRINTER = 'dev_drucker';
export const AMS = 'dev_ams';
export const GUEST = 'dev_gaeste';
export const PLUG = 'switch.drucker_steckdose';
const pre = 'x2d_musterdrucker';

const bam = (key: string, device = PRINTER) => ({ device, platform: 'bambu_lab', translation_key: key });
const kuma = (device: string, key: string) => ({ device, platform: 'uptime_kuma', translation_key: key });

export const MONITORS: [device: string, name: string, http: boolean][] = [
  ['kuma_nextcloud', 'Nextcloud', true],
  ['kuma_wiki', 'Musterwiki', true],
  ['kuma_ha', 'Home Assistant', true],
  ['kuma_dns1', 'DNS (pihole01)', false],
  ['kuma_dns2', 'DNS (pihole02)', false],
  ['kuma_vrrp', 'DNS (VRRP)', false],
];

const iso = (minutesFromNow: number) => new Date(NOW.getTime() + minutesFromNow * 60000).toISOString();

export function technikDefs(): Record<string, Def> {
  const d: Record<string, Def> = {
    [`sensor.${pre}_druckstatus`]: ['running', { options: ['failed', 'finish', 'idle', 'init', 'offline', 'pause', 'prepare', 'running', 'slicing', 'unknown'] }, 90, bam('print_status')],
    [`sensor.${pre}_aktueller_arbeitsschritt`]: ['printing', {}, 30, bam('stage')],
    [`sensor.${pre}_druckfortschritt`]: ['63', { unit_of_measurement: '%' }, 1, bam('print_progress')],
    [`sensor.${pre}_verbleibende_zeit`]: ['1.2', { unit_of_measurement: 'h', device_class: 'duration' }, 1, bam('remaining_time')],
    [`sensor.${pre}_endzeit`]: [iso(72), { device_class: 'timestamp' }, 1, bam('end_time')],
    [`sensor.${pre}_aktuelle_schicht`]: ['182', {}, 1, bam('current_layer')],
    [`sensor.${pre}_gesamtzahl_der_schichten`]: ['290', {}, 90, bam('total_layers')],
    [`sensor.${pre}_name_der_aufgabe`]: ['Halterung', {}, 90, bam('subtask_name')],
    [`sensor.${pre}_gewicht_des_drucks`]: ['86', { unit_of_measurement: 'g' }, 90, bam('print_weight')],
    [`sensor.${pre}_geschwindigkeitsprofil`]: ['standard', {}, 90, bam('speed_profile')],
    [`sensor.${pre}_linke_dusentemperatur`]: ['220', { unit_of_measurement: '°C' }, 1, bam('left_nozzle_temp')],
    [`sensor.${pre}_rechte_dusentemperatur`]: ['38', { unit_of_measurement: '°C' }, 1, bam('right_nozzle_temp')],
    [`sensor.${pre}_temperatur_der_duse`]: ['220', { unit_of_measurement: '°C' }, 1, bam('nozzle_temp')],
    [`sensor.${pre}_druckbetttemperatur`]: ['65', { unit_of_measurement: '°C' }, 1, bam('bed_temp')],
    [`sensor.${pre}_temperatur_im_druckraum`]: ['34', { unit_of_measurement: '°C' }, 1, bam('chamber_temp')],
    [`binary_sensor.${pre}_hms_fehler`]: ['off', { Count: 0, device_class: 'problem' }, 90, bam('hms_errors')],
    [`binary_sensor.${pre}_druckfehler`]: ['off', { device_class: 'problem' }, 90, bam('print_error')],
    [`binary_sensor.${pre}_online`]: ['on', {}, 90, bam('online')],
    [`binary_sensor.${pre}_gehausetur`]: ['off', {}, 90, bam('door_open')],
    [`light.${pre}_druckraumbeleuchtung`]: ['on', {}, 90, bam('chamber_light')],
    [`image.${pre}_titelbild`]: [iso(-90), { entity_picture: '/api/image_proxy/image.x2d_musterdrucker_titelbild?token=t' }, 90, bam('cover_image')],
    [`switch.${pre}_kamera_aktivieren`]: ['off', {}, 90, bam('camera')],
    [`sensor.${pre}_ams_1_luftfeuchtigkeit`]: ['18', { unit_of_measurement: '%' }, 10, bam('humidity', AMS)],
    [`binary_sensor.${pre}_ams_1_trocknen`]: ['off', {}, 300, bam('drying', AMS)],
    [`sensor.${pre}_ams_1_verbleibende_trocknungszeit`]: ['0.0', { unit_of_measurement: 'h' }, 300, bam('remaining_drying_time', AMS)],
    [PLUG]: ['on', { friendly_name: 'Drucker Steckdose' }, 120],
    'sensor.drucker_steckdose_power': ['182', { unit_of_measurement: 'W' }, 1],
    'sensor.drucker_steckdose_energy': ['25.7', { unit_of_measurement: 'kWh' }, 1],
    'switch.pi_hole': ['on', { friendly_name: 'Pi-hole' }, 600, { platform: 'pi_hole' }],
    'sensor.pi_hole_anteil': ['9.3', { unit_of_measurement: '%' }, 5, { platform: 'pi_hole', translation_key: 'percent_ads_blocked' }],
    'switch.gaeste_wlan': ['on', {}, 600, { device: GUEST, platform: 'unifi', translation_key: 'wlan_control' }],
    'sensor.gaeste_wlan': ['1', {}, 5, { device: GUEST, platform: 'unifi', translation_key: 'wlan_clients' }],
    'image.gaeste_wlan_qr_code': ['2026-10-24T10:00:00', { entity_picture: '/api/image_proxy/image.gaeste_wlan_qr_code?token=q' }, 600, { device: GUEST, platform: 'unifi', translation_key: 'qr_code' }],
    'button.gaeste_wlan_regenerate_password': ['unknown', {}, 600, { device: GUEST, platform: 'unifi', translation_key: 'regenerate_password' }],
    'switch.heim_wlan': ['on', {}, 600, { device: 'dev_heim', platform: 'unifi', translation_key: 'wlan_control' }],
  };
  const trays: [string, string, string, boolean, boolean, number][] = [
    ['#F2F2F2FF', 'PETG', 'Bambu PETG HF', false, false, 80],
    ['#000000FF', 'PLA', 'Bambu PLA Basic', true, false, 66],
    ['#A0784FFF', 'PLA', 'Bambu PLA Wood', false, false, 40],
    ['#00000000', '', 'Empty', false, true, 0],
  ];
  trays.forEach(([color, type, name, active, empty, remain], i) => {
    d[`sensor.${pre}_ams_1_slot_${i + 1}`] = [name, { slot: i + 1, color, type, name, active, empty, remain, remain_enabled: !empty }, 60, bam('tray', AMS)];
  });
  for (const [device, , http] of MONITORS) {
    const slug = device.replace('kuma_', 'mon_');
    d[`sensor.${slug}_status`] = ['up', { options: ['down', 'up', 'pending', 'maintenance'], device_class: 'enum' }, 600, kuma(device, 'status')];
    if (http) d[`sensor.${slug}_zertifikatsablauf`] = ['40', { unit_of_measurement: 'd' }, 600, kuma(device, 'cert_days_remaining')];
  }
  return d;
}

export const MAX = { id: 'u-max', name: 'Max', is_admin: true };
export const ANNA = { id: 'u-anna', name: 'Anna', is_admin: false };

type Over = Parameters<typeof makeHass>[0];

/** Base home plus the technik entities; `user` picks who is logged in. */
export function techHass(over: Over = {}, user: 'max' | 'anna' = 'max', now = NOW): MockHass {
  const hass = makeHass(over, now, technikDefs());
  hass.user = user === 'max' ? MAX : ANNA;
  hass.devices[PRINTER] = { id: PRINTER, area_id: 'arbeitszimmer_von_max', name: 'x2d_musterdrucker' };
  hass.devices[AMS] = { id: AMS, area_id: null, name: 'x2d_musterdrucker_AMS_1' };
  hass.devices[GUEST] = { id: GUEST, area_id: null, name: 'Gäste@Home' };
  hass.devices.dev_heim = { id: 'dev_heim', area_id: null, name: 'Heim' };
  for (const [device, name] of MONITORS) hass.devices[device] = { id: device, area_id: null, name };
  return hass;
}

/** Monitor status entity id for a monitor name from MONITORS. */
export function monitorStatus(name: string): string {
  const dev = MONITORS.find(([, n]) => n === name)![0];
  return `sensor.${dev.replace('kuma_', 'mon_')}_status`;
}

export function monitorCert(name: string): string {
  return monitorStatus(name).replace(/_status$/, '_zertifikatsablauf');
}

export const pid = {
  status: `sensor.${pre}_druckstatus`,
  stage: `sensor.${pre}_aktueller_arbeitsschritt`,
  progress: `sensor.${pre}_druckfortschritt`,
  end: `sensor.${pre}_endzeit`,
  hms: `binary_sensor.${pre}_hms_fehler`,
  printError: `binary_sensor.${pre}_druckfehler`,
  left: `sensor.${pre}_linke_dusentemperatur`,
  right: `sensor.${pre}_rechte_dusentemperatur`,
  nozzle: `sensor.${pre}_temperatur_der_duse`,
  bed: `sensor.${pre}_druckbetttemperatur`,
  drying: `binary_sensor.${pre}_ams_1_trocknen`,
  dryTime: `sensor.${pre}_ams_1_verbleibende_trocknungszeit`,
  humidity: `sensor.${pre}_ams_1_luftfeuchtigkeit`,
  light: `light.${pre}_druckraumbeleuchtung`,
};

export function cfg(c: Partial<CardConfig> = {}): CardConfig {
  return { type: 'custom:ha-start-dashboard', ...c };
}

/** Config with the printer plug wired. */
export function plugCfg(c: Partial<CardConfig> = {}): CardConfig {
  return cfg({ technik: { printer_plug: PLUG, printer_plug_power: 'sensor.drucker_steckdose_power', printer_plug_energy: 'sensor.drucker_steckdose_energy' }, ...c });
}
