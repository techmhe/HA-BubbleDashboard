import type { CardConfig, HomeAssistant, VacuumProgram } from '../types';
import { ent } from './entities';
import { num, state } from './util';
import { deviceButton, RESET_BUTTON } from './care';

const STATUS: Record<string, string> = {
  charging: 'Lädt',
  charging_complete: 'Geladen',
  cleaning: 'Reinigt',
  segment_cleaning: 'Reinigt',
  zoned_cleaning: 'Reinigt',
  spot_cleaning: 'Reinigt',
  room_clean: 'Reinigt',
  returning: 'Fährt zur Station',
  returning_home: 'Fährt zur Station',
  idle: 'Bereit',
  paused: 'Pausiert',
  error: 'Fehler',
  docked: 'Angedockt',
  sleeping: 'Schläft',
  emptying_the_bin: 'Leert Behälter',
  washing_the_mop: 'Wäscht Mopp',
  going_to_wash_the_mop: 'Fährt zum Waschen',
  remote_control: 'Fernsteuerung',
  manual_mode: 'Manuell',
  updating: 'Update',
};

export interface RobbyStatus {
  label: string;
  battery: number | null;
  cleaning: boolean;
  docked: boolean;
  error: boolean;
}

export function robbyStatus(hass: HomeAssistant, config: CardConfig): RobbyStatus {
  const vac = hass.states[ent(config, 'vacuum')];
  const raw = state(hass, ent(config, 'vacuum_status')) ?? vac?.state ?? 'unavailable';
  const battery = num(hass, ent(config, 'vacuum_battery')) ?? (Number.isFinite(Number(vac?.attributes.battery_level)) ? Number(vac!.attributes.battery_level) : null);
  const err = state(hass, ent(config, 'vacuum_error'));
  const error = vac?.state === 'error' || raw === 'error' || (!!err && !['none', 'unknown', 'unavailable', ''].includes(err));
  const text = raw === 'unavailable' ? 'Offline' : (STATUS[raw] ?? raw);
  return {
    label: battery !== null ? `${text} · ${Math.round(battery)} %` : text,
    battery,
    cleaning: vac?.state === 'cleaning' || /cleaning/.test(raw),
    docked: vac?.state === 'docked',
    error,
  };
}

export interface Consumable {
  id: string;
  name: string;
  value: string;
  due: boolean;
  /** Button on the vacuum that resets this consumable. */
  reset?: string;
}

const CONSUMABLES: [RegExp, string, RegExp][] = [
  [/filter/, 'Filter', /filter/],
  [/sensor(?!_robby)|sensorzeit/, 'Sensoren', /_sensor_/],
  [/haupt/, 'Hauptbürste', /haupt/],
  [/seiten/, 'Seitenbürste', /seiten/],
];

/** Remaining time of the vacuum's consumables (`sensor.*<vacuum>*_minutes`). */
export function consumables(hass: HomeAssistant, config: CardConfig): Consumable[] {
  const vacuum = ent(config, 'vacuum');
  const key = vacuum.split('.')[1];
  const out: Consumable[] = [];
  for (const id of Object.keys(hass.states)) {
    if (!id.startsWith('sensor.') || !id.includes(key) || !id.endsWith('_minutes')) continue;
    const rest = id.slice(7).replace(/^sensor_/, '');
    const match = CONSUMABLES.find(([re]) => re.test(rest));
    const name = match?.[1];
    if (!match || !name || out.some((c) => c.name === name)) continue;
    const v = num(hass, id);
    if (v === null) continue;
    out.push({ id, name, due: v <= 0, value: v <= 0 ? 'fällig' : `${Math.round(v / 60)} h`,
      reset: deviceButton(hass, vacuum, new RegExp(`${match[2].source}.*(${RESET_BUTTON.source})`)) });
  }
  const order = CONSUMABLES.map(([, n]) => n);
  return out.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
}

export const DEFAULT_VACUUM_MAPS: Record<string, Record<string, string>> = {
  EG: { 16: 'Küche', 17: 'Wohnen', 18: 'Flur', 19: 'Essen' },
  OG: { 16: 'Büro 1', 17: 'Büro 2', 18: 'Flur', 19: 'WC', 20: 'Bad' },
  Schlafzimmer: { 0: 'Schlafz.' },
};

export interface RobbyMap {
  name: string;
  rooms: { segment: number; name: string }[];
}

export function robbyMaps(hass: HomeAssistant, config: CardConfig): RobbyMap[] {
  const options: string[] = hass.states[ent(config, 'vacuum_map')]?.attributes.options ?? Object.keys(DEFAULT_VACUUM_MAPS);
  const maps = config.vacuum_maps ?? DEFAULT_VACUUM_MAPS;
  return options
    .filter((o) => o !== 'custom')
    .map((name) => ({
      name,
      rooms: Object.entries(maps[name] ?? {})
        .map(([seg, n]) => ({ segment: Number(seg), name: n }))
        .filter((r) => Number.isFinite(r.segment))
        .sort((a, b) => a.segment - b.segment),
    }));
}

export function robbySelection(hass: HomeAssistant, config: CardConfig): number[] {
  const raw = state(hass, ent(config, 'vacuum_selection')) ?? '';
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => /^\d+$/.test(s))
    .map(Number);
}

export const DEFAULT_PROGRAMS: VacuumProgram[] = [
  { tag: 'EG', name: 'Saugen', color: '#64d2ff', button: 'button.robby_eg_saugen' },
  { tag: 'EG', name: 'Saugen + Wischen', color: '#5ac8fa', button: 'button.robby_eg_weekend' },
  { tag: 'EG', name: 'Täglich K/E/F', color: '#8fd8ff', button: 'button.robby_eg_taglich' },
  { tag: 'OG', name: 'Saugen', color: '#bf9bff', button: 'button.robby_og_saugen' },
  { tag: 'SZ', name: 'Schlafzimmer', color: '#ffb340', button: 'button.robby_schlafzimmer' },
  { tag: 'Alle', name: 'Karte komplett', color: '#7ee8a0' },
];

export function robbyPrograms(config: CardConfig): VacuumProgram[] {
  return config.vacuum_programs ?? DEFAULT_PROGRAMS;
}

export function startLabel(n: number): string {
  if (n <= 0) return 'Raum wählen';
  return n === 1 ? '1 Raum starten' : `${n} Räume starten`;
}

export const CLEAN_MODES = [
  { id: 'vacuum', name: 'Saugen' },
  { id: 'vac_and_mop', name: 'Saugen + Wischen' },
  { id: 'mop', name: 'Wischen' },
];

export const FAN_SPEEDS = [
  { id: 'quiet', name: 'Leise' },
  { id: 'balanced', name: 'Normal' },
  { id: 'turbo', name: 'Turbo' },
  { id: 'max', name: 'Max' },
  { id: 'max_plus', name: 'Max+' },
];

export const MOP_LEVELS = [
  { id: 'mild', name: 'Mild' },
  { id: 'standard', name: 'Standard' },
  { id: 'intense', name: 'Intensiv' },
];
