import type { CardConfig } from '../types';

/**
 * Every entity and script the card uses outside the registries. All of them can be
 * overridden under `entities:` in the card config; the defaults match this home.
 */
export const ENTITY_DEFAULTS = {
  weather: 'weather.musterstadt',
  gusts: 'sensor.musterstadt_windboen',
  alarm: 'alarm_control_panel.alarmo',
  vacuum: 'vacuum.robby',
  vacuum_status: 'sensor.robby_status',
  /** Button pressed by a long-press on the Robby bubble. */
  vacuum_quick: 'button.robby_eg_saugen',
  front_door: 'binary_sensor.fenstersensor_haustur_contact',
  grid_import: 'sensor.stromverbrauch_shelly_messung',
  grid_export: 'sensor.ruckeinspeisung_shelly_messung',
  waste: 'sensor.naechster_abfalltermin',
  heating: 'input_boolean.heizbetrieb',
  outdoor_temp: 'sensor.aussen_temperature',
  outdoor_dew: 'sensor.aussen_taupunkt_messung',
  ac: 'climate.flur_1_og_klimaanlage',
  /** Power of the AC (smart plug). */
  ac_power: 'sensor.klimaanlage_power',
  airing_timer: 'timer.luften',
  airing_duration: 'sensor.stossluften_dauer',
  airing_start: 'script.luften_starten',
  /** input_text with snoozed window warnings ("1 h ignorieren"), shared by every phone. */
  window_snooze: 'input_text.fenster_ignorieren',
  preset_all: 'script.heizung_preset_alle',
  all_rooms_apply: 'script.alle_raume_anwenden',
  all_rooms_temperature: 'input_number.alle_raume_temperatur',
  all_rooms_selection: 'input_text.alle_raume_auswahl',
  all_rooms_duration: 'input_select.alle_raume_dauer',
  /** Script with fields `entity` and `minutes` ("Ausschalten in …"). */
  delayed_off: 'script.gerat_verzogert_ausschalten',
  // Energie
  house_power: 'sensor.hausverbrauch',
  /** PV power; solar power sensors from the energy dashboard are added on top. */
  pv_power: 'sensor.solar_total_power',
  /** Battery AC power, positive = battery feeds the house. */
  battery_power: 'sensor.marstek_venus_a_ac_leistung',
  battery_soc: 'sensor.marstek_venus_a_batterie_ladezustand',
  pv_today: 'sensor.pv_heute',
  import_today: 'sensor.netzbezug_heute',
  export_today: 'sensor.einspeisung_heute',
  untracked_power: 'sensor.stromverbrauch_nicht_erfasst',
  // Schutz
  camera: 'camera.doorbell01',
  camera_motion: 'binary_sensor.doorbell01_bewegung',
  camera_person: 'binary_sensor.doorbell01_person',
  // Robby
  vacuum_battery: 'sensor.robby_batterie',
  vacuum_error: 'sensor.robby_staubsauger_fehler',
  vacuum_map: 'select.robby_ausgewahlte_karte',
  vacuum_mode: 'select.flur_eg_robby_reinigungsmodus',
  vacuum_mop: 'select.robby_wischmopp_intensiat',
  vacuum_selection: 'input_text.robby_raumauswahl',
  vacuum_passes: 'input_number.robby_durchgange',
  /** Script with field `karte`. */
  vacuum_map_script: 'script.robby_karte_wahlen',
  /** Script with field `segment`. */
  vacuum_room_script: 'script.robby_raum_umschalten',
  vacuum_clean_script: 'script.robby_auswahl_reinigen',
} as const;

export type EntityKey = keyof typeof ENTITY_DEFAULTS;

export const FILTER_ALARM_DEFAULTS = [
  'binary_sensor.flur_1_og_klimaanlage_filteralarm',
  'binary_sensor.klima_eg_filter_cleaning_reminder',
];

/** Top-level keys from v0.1/v0.2 that still work as shortcuts. */
const LEGACY: Partial<Record<EntityKey, keyof CardConfig>> = {
  weather: 'weather',
  alarm: 'alarm',
  vacuum: 'vacuum',
  front_door: 'front_door',
  ac: 'ac',
};

export function ent(config: CardConfig, key: EntityKey): string {
  const fromEntities = config.entities?.[key];
  if (typeof fromEntities === 'string' && fromEntities) return fromEntities;
  const legacyKey = LEGACY[key];
  const legacy = legacyKey ? config[legacyKey] : undefined;
  if (typeof legacy === 'string' && legacy) return legacy;
  return ENTITY_DEFAULTS[key];
}

export function filterAlarmIds(config: CardConfig): string[] {
  return config.entities?.filter_alarms ?? FILTER_ALARM_DEFAULTS;
}

/** `script.foo` -> ['script', 'foo'] for hass.callService. */
export function scriptService(entityId: string): [string, string] {
  const [domain, object] = entityId.split('.');
  return [domain, object];
}
