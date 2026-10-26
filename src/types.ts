// Minimal typings for the parts of the Home Assistant frontend `hass` object we use.

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

export interface HassEntityRegistryEntry {
  entity_id: string;
  device_id?: string | null;
  area_id?: string | null;
  labels?: string[];
  hidden?: boolean;
  entity_category?: string | null;
  name?: string | null;
  /** Integration domain, e.g. versatile_thermostat. */
  platform?: string;
  /** Stable, language-independent key of the entity within its integration. */
  translation_key?: string | null;
}

export interface HassDevice {
  id: string;
  area_id?: string | null;
  name?: string | null;
  name_by_user?: string | null;
  model?: string | null;
  manufacturer?: string | null;
}

export interface HassArea {
  area_id: string;
  name: string;
  floor_id?: string | null;
  icon?: string | null;
}

export interface HassFloor {
  floor_id: string;
  name: string;
  level?: number | null;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities: Record<string, HassEntityRegistryEntry>;
  devices: Record<string, HassDevice>;
  areas: Record<string, HassArea>;
  floors?: Record<string, HassFloor>;
  user?: { id?: string; name: string; is_admin?: boolean };
  locale?: { language: string };
  callService(domain: string, service: string, data?: Record<string, unknown>, target?: Record<string, unknown>): Promise<unknown>;
  /** Translated state label (HA 2023.12+). */
  formatEntityState?(stateObj: HassEntity): string;
  callWS<T = unknown>(msg: Record<string, unknown>): Promise<T>;
  callApi?<T = unknown>(method: 'GET' | 'POST', path: string): Promise<T>;
}

export type PageId = 'overview' | 'climate' | 'rooms' | 'energy' | 'security';

export interface VacuumProgram {
  tag: string;
  name: string;
  color?: string;
  button?: string;
}

export interface RoomConfig {
  /** Sensor slug: sensor.<slug>_temperature, _humidity, _luftung, ... */
  slug: string;
  name?: string;
  climate?: string;
  pm25?: string;
  purifier?: string;
  window?: string;
  areas?: string[];
  floor?: string;
  /** Power sensors summed for the room (default: sensor.<slug>_leistung or matching parts). */
  power?: string[];
  /** Icon key from src/icons.ts (desk, bath, bed, door, sofa, pot, home). */
  icon?: string;
}

export interface CardConfig {
  type: string;
  /** Tab shown first. */
  page?: PageId;
  /** Render the internal tab bar (default true). */
  nav?: boolean;
  /** HA toolbar above the dashboard: 'hide' (default), 'blend' (transparent) or 'default'. */
  header?: import('./header').HeaderMode;
  /** Inject the Rubik web font into the document (default true). */
  load_font?: boolean;
  rooms?: RoomConfig[];
  /** Display name overrides per entity_id. */
  names?: Record<string, string>;
  weather?: string;
  front_door?: string;
  alarm?: string;
  vacuum?: string;
  /** Air conditioner shown in its floor on the Klima page. */
  ac?: string;
  /** Entity/script overrides, see ENTITY_DEFAULTS in src/logic/entities.ts. */
  /** Robby rooms per map: { EG: { 16: 'Küche', ... } } (segment id -> chip name). */
  vacuum_maps?: Record<string, Record<string, string>>;
  /** Programme tiles; without `button` the tile runs vacuum.start. */
  vacuum_programs?: VacuumProgram[];
  /** Persons in the Schutz header (default: every person with a device tracker). */
  persons?: string[];
  /** DWD warning sensors (default: every dwd_weather_warnings sensor). */
  warnings?: string[];
  /** Pollen sensors (default: every sensor.pollenflug_*). */
  pollen?: string[];
  /** Leave entities or whole integrations (platforms) out of a list. */
  exclude?: { openings?: string[]; consumers?: string[] };
  /** Home battery limits (SoC %), to explain why it is idle: discharge stops at `reserve`, charging at `full`. */
  battery?: { reserve?: number; full?: number };
  /** Stuck-valve check: limits, or false to switch it off. */
  heating_check?: Partial<import('./logic/heating-check').HeatingCheckOptions> | false;
  /** Offline sensor warnings: extra entities to watch, entities to leave out. */
  health?: { extra?: string[]; exclude?: string[] };
  /** Washer, dryer, dishwasher etc.; replaces the detection from `input_boolean.<slug>_fertig` + `sensor.<slug>_power`. */
  appliances?: { name: string; power: string; done: string }[];
  entities?: Partial<Record<import('./logic/entities').EntityKey, string>> & {
    filter_alarms?: string[];
    /** Sensor with the last successful backup (default: the `backup` integration's sensor). */
    backup_last?: string;
  };
  /** Technik button, sheets and Aktuell items; false turns them off for everyone. */
  technik?: TechnikConfig | false;
}

export interface TechnikConfig {
  /** HA user ids or names that see the technical parts (default: admins). */
  users?: string[];
  /** Device id of the 3D printer (default: first ha-bambulab printer). */
  printer?: string;
  printer_plug?: string;
  printer_plug_power?: string;
  printer_plug_energy?: string;
  /** Pi-hole blocking switch (default: first pi_hole switch). */
  pihole?: string;
  /** Guest WLAN switch (default: first UniFi WLAN switch with "guest" in its id). */
  guest_wifi?: string;
  /** Uptime Kuma monitor names to leave out. */
  services_exclude?: string[];
  /** Merge monitors into one row: { name: regex on the monitor name }. Default { DNS: '^DNS\\b' }. */
  service_groups?: Record<string, string>;
}
