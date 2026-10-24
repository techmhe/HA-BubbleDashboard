import type { HassEntity, HomeAssistant } from '../src/types';

export type Def = [state: string, attrs?: Record<string, any>, minutesAgo?: number, reg?: { area?: string; labels?: string[]; device?: string; platform?: string }];

export const NOW = new Date(2026, 9, 24, 19, 30); // Sat 24 Oct 2026, 19:30 local

const rooms: [slug: string, area: string, t: number, h: number, heating: boolean, vent: string, pm?: number][] = [
  ['arbeitszimmer_anna', 'arbeitszimmer_anna', 19.0, 62, true, 'Jetzt lüften', 8],
  ['arbeitszimmer_max', 'arbeitszimmer_von_max', 19.2, 57, false, 'Lüften möglich', 5],
  ['badezimmer', 'badezimmer', 19.1, 61, false, 'Jetzt lüften'],
  ['schlafzimmer', 'schlafzimmer', 19.1, 58, true, 'Lüften möglich'],
  ['flur_1_og', 'flur_1_og', 19.5, 59, false, 'Nicht lüften'],
  ['wohnzimmer', 'wohnzimmer', 19.9, 60, true, 'Lüften möglich', 20],
  ['kuche_esszimmer', 'kuche', 19.5, 58, false, 'Lüften möglich', 40],
  ['flur_eg', 'flur_eg', 18.9, 58, true, 'Nicht lüften'],
];

export function defs(): Record<string, Def> {
  const d: Record<string, Def> = {
    'weather.musterstadt': ['rainy', { temperature: 8.5, humidity: 80, friendly_name: 'Musterstadt' }],
    'input_boolean.heizbetrieb': ['on'],
    'sensor.aussen_temperature': ['10.5'],
    'sensor.aussen_taupunkt_messung': ['7.2'],
    'climate.flur_1_og_klimaanlage': ['off', { current_temperature: 20.5, temperature: 24, hvac_modes: ['cool', 'dry', 'off'] }, 60, { area: 'flur_1_og' }],
    'input_number.alle_raume_temperatur': ['19.0', { min: 7, max: 25, step: 0.5 }],
    'input_select.alle_raume_dauer': ['Dauerhaft', { options: ['Dauerhaft', '1 h', '2 h', '4 h'] }],
    'input_text.alle_raume_auswahl': ['unknown'],
    'scene.cozy_evening': ['unknown', { friendly_name: 'Cozy Evening', icon: 'mdi:sofa' }, 600, { area: 'wohnzimmer' }],
    'scene.heimkino': ['unknown', { friendly_name: 'Heimkino', icon: 'mdi:theater' }, 600, { area: 'wohnzimmer' }],
    'scene.wohnzimmer_off': ['unknown', { friendly_name: 'Wohnzimmer aus' }, 600, { area: 'wohnzimmer' }],
    'fan.luftreiniger_wohnzimmer': ['on', { friendly_name: 'Luftreiniger Wohnzimmer', preset_mode: 'auto', preset_modes: ['auto', 'sleep'], percentage: null, percentage_step: 100 / 3 }, 60, { area: 'wohnzimmer' }],
    'sensor.musterstadt_windboen': ['41', { unit_of_measurement: 'km/h' }],
    'vacuum.robby': ['docked', { friendly_name: 'Robby' }],
    'sensor.robby_status': ['charging'],
    'sensor.sensor_robby_verbleibende_filterzeit_minutes': ['-1380.0'],
    'sensor.robby_verbleibende_sensorzeit_minutes': ['-659'],
    'sensor.robby_verbleibende_zeit_der_hauptburste_minutes': ['7647'],
    'sensor.robby_verbleibende_zeit_der_seitenburste_minutes': ['1647'],
    'alarm_control_panel.alarmo': ['disarmed'],
    'sensor.stromverbrauch_shelly_messung': ['775.4'],
    'sensor.ruckeinspeisung_shelly_messung': ['0'],
    'sensor.stossluften_dauer': ['15'],
    'timer.luften': ['idle'],
    'sensor.naechster_abfalltermin': ["'4'", { '2026-10-28': 'Grünschnitt, Restmüll', '2026-10-29': 'Plastikmüll', daysTo: 4 }],
    'input_boolean.waschmaschine_fertig': ['off', { friendly_name: 'Waschmaschine fertig' }],
    'input_boolean.trockner_fertig': ['off', { friendly_name: 'Trockner fertig' }],
    'input_boolean.spulmaschine_fertig': ['off', { friendly_name: 'Spülmaschine fertig' }],
    'binary_sensor.flur_1_og_klimaanlage_filteralarm': ['off'],
    'sensor.luftreiniger_w_filter_life': ['78', { unit_of_measurement: '%' }],
    'sensor.presenzmelder_bad_battery_plus': ['5', { device_class: 'battery' }],
    'sensor.thermostat_bad_battery': ['80', { device_class: 'battery' }],
    'light.wohnzimmer_stehlampe': ['on', { friendly_name: 'Stehlampe Wohnzimmer' }, 30, { area: 'wohnzimmer', labels: ['dashboard_gerat'] }],
    'light.wohnzimmer_vasenleuchte': ['on', {}, 30, { area: 'wohnzimmer', labels: ['dashboard_gerat'] }],
    'light.flur_1_og_lampe': ['on', {}, 30, { area: 'flur_1_og', labels: ['dashboard_gerat'] }],
    'light.flur_eg_lampe_uhr': ['on', {}, 30, { area: 'flur_eg', labels: ['dashboard_gerat'] }],
    'light.wandlampe_treppe': ['on', {}, 30, { area: 'flur_eg', labels: ['dashboard_gerat'] }],
    'light.kuche_decke': ['off', {}, 30, { area: 'kuche', labels: ['dashboard_gerat'] }],
    'light.core01_led': ['on', {}, 30, {}],
    'light.wohnzimmer_alle': ['on', { entity_id: ['light.wohnzimmer_stehlampe'] }, 30, { area: 'wohnzimmer' }],
    'binary_sensor.fenstersensor_haustur_contact': ['off', { device_class: 'door' }, 200, { area: 'flur_eg' }],
  };
  for (const [slug, area, t, h, heating, vent, pm] of rooms) {
    d[`sensor.${slug}_temperature`] = [String(t), { device_class: 'temperature' }, 5, { area }];
    d[`sensor.${slug}_humidity`] = [String(h), { device_class: 'humidity' }, 5, { area }];
    d[`sensor.${slug}_luftung`] = [vent, { friendly_name: `${slug} Lüftung` }];
    d[`sensor.${slug}_taupunkt`] = [String(Math.round((t - (100 - h) / 5) * 10) / 10), {}, 5, { area }];
    d[`climate.vtherm_${slug}`] = ['heat', {
      hvac_action: heating ? 'heating' : 'idle', current_temperature: t, temperature: heating ? 20 : 19, min_temp: 7, max_temp: 30,
      target_temp_step: 0.5, valve_open_percent: heating ? 16 : 0, preset_mode: 'none',
      preset_temperatures: { eco_temp: 18, comfort_temp: 19, boost_temp: 20, frost_temp: 7 },
    }, 60, { area }];
    d[`binary_sensor.fenster_${slug}`] = ['off', { device_class: 'window' }, 120, { area }];
    if (pm !== undefined) d[`sensor.luftreiniger_${slug}_pm25`] = [String(pm), { device_class: 'pm25' }, 1, { area }];
  }
  return d;
}

const AREAS: [string, string, string][] = [
  ['arbeitszimmer_anna', 'Büro Anna', 'og'],
  ['arbeitszimmer_von_max', 'Büro Max', 'og'],
  ['badezimmer', 'Badezimmer', 'og'],
  ['schlafzimmer', 'Schlafzimmer', 'og'],
  ['flur_1_og', 'Flur 1.OG', 'og'],
  ['wohnzimmer', 'Wohnzimmer', 'eg'],
  ['kuche', 'Küche & Essen', 'eg'],
  ['flur_eg', 'Flur EG', 'eg'],
  ['garten', 'Garten', ''],
  ['esszimmer_kuche', 'Esszimmer', 'eg'],
];

const DEVICES: [id: string, area: string, name: string][] = [
  ['dev_sideboard', 'wohnzimmer', 'Sideboard Wohnzimmer'],
  ['dev_heimkino', 'wohnzimmer', 'Heimkino'],
  ['dev_rack', 'arbeitszimmer_von_max', 'Netzwerkschrank'],
  ['dev_meter', 'flur_eg', 'Stromzähler'],
];

export interface MockHass extends HomeAssistant {
  calls: [string, string, Record<string, unknown> | undefined][];
}

export function makeHass(
  overrides: Record<string, Partial<{ state: string; attributes: Record<string, any>; minutesAgo: number }>> = {},
  now = NOW,
  extra: Record<string, Def> = {},
): MockHass {
  const states: Record<string, HassEntity> = {};
  const entities: HomeAssistant['entities'] = {};
  const all = { ...defs(), ...extra };
  for (const [id, [st, attrs = {}, ago = 10, reg]] of Object.entries(all)) {
    const o = overrides[id] ?? {};
    const changed = new Date(now.getTime() - (o.minutesAgo ?? ago) * 60000).toISOString();
    states[id] = { entity_id: id, state: o.state ?? st, attributes: { ...attrs, ...o.attributes }, last_changed: changed, last_updated: changed };
    if (reg) entities[id] = { entity_id: id, area_id: reg.area ?? null, labels: reg.labels ?? [], device_id: reg.device ?? null, platform: reg.platform };
  }
  for (const [id, o] of Object.entries(overrides)) {
    if (states[id]) continue;
    const changed = new Date(now.getTime() - (o.minutesAgo ?? 10) * 60000).toISOString();
    states[id] = { entity_id: id, state: o.state ?? 'unknown', attributes: o.attributes ?? {}, last_changed: changed, last_updated: changed };
  }
  const calls: MockHass['calls'] = [];
  return {
    states,
    entities,
    devices: Object.fromEntries(DEVICES.map(([id, area_id, name]) => [id, { id, area_id, name }])),
    areas: Object.fromEntries(AREAS.map(([area_id, name, floor_id]) => [area_id, { area_id, name, floor_id: floor_id || null }])),
    floors: { og: { floor_id: 'og', name: 'OG', level: 1 }, eg: { floor_id: 'eg', name: 'EG', level: 0 } },
    user: { name: 'Max' },
    locale: { language: 'de' },
    calls,
    async callService(domain, service, data) {
      calls.push([domain, service, data]);
    },
    async callWS() {
      return {} as never;
    },
  };
}
