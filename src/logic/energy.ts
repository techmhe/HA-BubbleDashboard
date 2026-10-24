import type { CardConfig, HomeAssistant } from '../types';
import { ent } from './entities';
import { ROOM_POWER_LABEL } from './rooms-page';
import { entityArea, friendlyName, num } from './util';

export interface EnergyNow {
  pv: number;
  house: number;
  import: number;
  export: number;
  /** power > 0: battery feeds the house, < 0: battery charges. */
  battery: { soc: number | null; power: number } | null;
}

const z = (v: number | null) => v ?? 0;

/** The parts of HA's energy dashboard config (energy/get_prefs) the card uses. */
export interface EnergyPrefs {
  energy_sources: { type: string; stat_energy_from?: string; stat_energy_to?: string; stat_rate?: string }[];
  device_consumption: { stat_consumption: string; stat_rate?: string; name?: string; included_in_stat?: string }[];
}

export interface EnergyStatIds {
  solar: string[];
  import: string[];
  export: string[];
  solarRate: string[];
}

export function energyStatIds(prefs: EnergyPrefs): EnergyStatIds {
  const src = prefs.energy_sources ?? [];
  const ids = (type: string, key: 'stat_energy_from' | 'stat_energy_to' | 'stat_rate') =>
    src.filter((s) => s.type === type && s[key]).map((s) => s[key]!);
  return {
    solar: ids('solar', 'stat_energy_from'),
    import: ids('grid', 'stat_energy_from'),
    export: ids('grid', 'stat_energy_to'),
    solarRate: ids('solar', 'stat_rate'),
  };
}

/** PV power sensors: the configured one plus the solar power sensors of the energy dashboard. */
export function pvSensors(config: CardConfig, prefs?: EnergyPrefs): string[] {
  const ids = [ent(config, 'pv_power'), ...(prefs ? energyStatIds(prefs).solarRate : [])];
  return [...new Set(ids)];
}

/** Sum of `change` over all rows of the given statistics (recorder/statistics_during_period). */
export function statChanges(rows: Record<string, { change?: number | null }[]>, ids: string[]): number {
  return ids.reduce((sum, id) => sum + (rows[id] ?? []).reduce((s, r) => s + (Number(r.change) || 0), 0), 0);
}

/** Energy statistic of a consumer's power sensor: energy dashboard entry, else an energy sensor of the same device. */
export function consumerEnergyStat(hass: HomeAssistant, powerId: string, prefs?: EnergyPrefs): string | undefined {
  const fromPrefs = prefs?.device_consumption?.find((d) => d.stat_rate === powerId)?.stat_consumption;
  if (fromPrefs) return fromPrefs;
  const dev = hass.entities[powerId]?.device_id;
  if (!dev) return undefined;
  return Object.values(hass.entities).find(
    (e) => e.device_id === dev && e.entity_id.startsWith('sensor.') && hass.states[e.entity_id]?.attributes.device_class === 'energy',
  )?.entity_id;
}

export function energyNow(hass: HomeAssistant, config: CardConfig, prefs?: EnergyPrefs): EnergyNow {
  const pv = pvSensors(config, prefs).reduce((s, id) => s + Math.max(0, z(num(hass, id))), 0);
  const imp = Math.max(0, z(num(hass, ent(config, 'grid_import'))));
  const exp = Math.max(0, z(num(hass, ent(config, 'grid_export'))));
  const batPower = num(hass, ent(config, 'battery_power'));
  const soc = num(hass, ent(config, 'battery_soc'));
  const battery = batPower !== null || soc !== null ? { soc, power: z(batPower) } : null;
  const house = num(hass, ent(config, 'house_power')) ?? Math.max(0, pv + imp - exp + z(battery?.power ?? null));
  return { pv, house, import: imp, export: exp, battery };
}

export function partOfDay(now: Date): string {
  const h = now.getHours();
  if (h >= 5 && h < 11) return 'Morgen';
  if (h >= 11 && h < 14) return 'Mittag';
  if (h >= 14 && h < 18) return 'Nachmittag';
  if (h >= 18 && h < 23) return 'Abend';
  return 'Nacht';
}

/** One line under "Energie": part of day + where the power comes from right now. */
export function energyHeadline(now: Date, e: EnergyNow): string {
  const IDLE = 50;
  let text: string;
  if (e.pv > IDLE && e.export > e.import) text = 'Sonne liefert, Überschuss geht ins Netz';
  else if (e.pv > IDLE && e.import > IDLE) text = `PV deckt ${Math.min(99, Math.round((e.pv / Math.max(e.house, 1)) * 100))} %, Rest aus dem Netz`;
  else if (e.pv > IDLE) text = 'PV deckt den Verbrauch';
  else if ((e.battery?.power ?? 0) > IDLE && e.import < IDLE) text = 'Akku versorgt das Haus';
  else text = 'PV aus, Strom kommt aus dem Netz';
  return `${partOfDay(now)} · ${text}`;
}

export interface EnergyToday {
  pv: number;
  import: number;
  export: number;
  consumed: number;
  /** Consumption covered by PV and battery. */
  local: number;
  autarky: number | null;
  selfUse: number | null;
}

/** Daily meter in kWh; utility meters stay "unknown" until the first change after reset, so that counts as 0. */
function kwh(hass: HomeAssistant, id: string): number {
  const v = num(hass, id);
  if (v === null) return 0;
  return hass.states[id]?.attributes.unit_of_measurement === 'Wh' ? v / 1000 : v;
}

/**
 * Today's totals: from energy dashboard statistics when the card has loaded them,
 * else from the daily utility meters.
 */
export function energyToday(hass: HomeAssistant, config: CardConfig, stats?: { pv: number; import: number; export: number }): EnergyToday {
  const pv = stats ? stats.pv : kwh(hass, ent(config, 'pv_today'));
  const imp = stats ? stats.import : kwh(hass, ent(config, 'import_today'));
  const exp = stats ? stats.export : kwh(hass, ent(config, 'export_today'));
  const consumed = Math.max(0, pv + imp - exp);
  const local = Math.max(0, consumed - imp);
  return {
    pv,
    import: imp,
    export: exp,
    consumed,
    local,
    autarky: consumed > 0 ? Math.round((local / consumed) * 100) : null,
    selfUse: pv > 0 ? Math.round((Math.max(0, pv - exp) / pv) * 100) : null,
  };
}

export interface Consumer {
  id: string;
  name: string;
  value: number;
  untracked?: boolean;
}

const SKIP_RE = /_phase_|_poe_|standby/;

function watts(hass: HomeAssistant, id: string): number | null {
  const v = num(hass, id);
  if (v === null) return null;
  return Math.abs(hass.states[id]?.attributes.unit_of_measurement === 'kW' ? v * 1000 : v);
}

/**
 * Devices drawing power right now: every `*_power` sensor that sits in an area, one per
 * device (measured before Powercalc's `*_device_power`), without the grid meter, battery
 * and PV devices, phase and PoE port readings. Plus "Nicht erfasst". Largest first.
 */
export function consumers(hass: HomeAssistant, config: CardConfig, limit = 6, prefs?: EnergyPrefs): Consumer[] {
  const exclude = new Set(config.exclude?.consumers ?? []);
  const systemDevices = new Set(
    [...(['grid_import', 'grid_export', 'battery_power', 'house_power'] as const).map((k) => ent(config, k)), ...pvSensors(config, prefs)]
      .map((id) => hass.entities[id]?.device_id)
      .filter((d): d is string => !!d),
  );
  const groups = new Map<string, string[]>();
  for (const id of Object.keys(hass.states)) {
    if (!/^sensor\..+_power$/.test(id) || SKIP_RE.test(id) || exclude.has(id)) continue;
    const a = hass.states[id].attributes;
    if (a.device_class !== 'power' && !['W', 'kW'].includes(a.unit_of_measurement)) continue;
    const reg = hass.entities[id];
    if (reg?.platform && exclude.has(reg.platform)) continue;
    const labels = reg?.labels ?? [];
    if (labels.includes(ROOM_POWER_LABEL) || labels.includes('raumverbrauch_ignorieren')) continue;
    if (reg?.device_id && systemDevices.has(reg.device_id)) continue;
    if (!entityArea(hass, id)) continue;
    const key = reg?.device_id ?? id;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(id);
  }

  const out: Consumer[] = [];
  for (const [key, ids] of groups) {
    const measured = ids.filter((i) => !/_device_power$/.test(i));
    const pick = measured.find((i) => watts(hass, i) !== null) ?? ids.find((i) => watts(hass, i) !== null);
    if (!pick) continue;
    const value = watts(hass, pick)!;
    if (value < 1) continue;
    const dev = hass.devices[key];
    const name =
      config.names?.[pick] ||
      dev?.name_by_user ||
      dev?.name ||
      friendlyName(hass, pick).replace(/\s*(device\s+)?(power|leistung)$/i, '');
    out.push({ id: pick, name: name || pick, value });
  }

  const untrackedId = ent(config, 'untracked_power');
  const untracked = watts(hass, untrackedId);
  if (untracked !== null && untracked >= 1) out.push({ id: untrackedId, name: 'Nicht erfasst', value: untracked, untracked: true });
  return out.sort((a, b) => b.value - a.value).slice(0, limit);
}

export type ShareKind = 'autarky' | 'selfuse';
interface SharePoint {
  t: number;
  v: number;
}

/**
 * Percent per bucket from PV, grid import and export energy, with the same formulas as the
 * "Heute" bars: autarky = locally covered share of consumption, self-use = share of solar
 * used in the house. Buckets without consumption (or without solar) are left out.
 */
export function shareSeries(kind: ShareKind, parts: { pv: SharePoint[]; import: SharePoint[]; export: SharePoint[] }) {
  const byT = (p: SharePoint[]) => new Map(p.map((x) => [x.t, x.v]));
  const imp = byT(parts.import);
  const exp = byT(parts.export);
  const pv = byT(parts.pv);
  const ts = [...new Set([...pv.keys(), ...imp.keys(), ...exp.keys()])].sort((a, b) => a - b);
  const share = (p: number, i: number, e: number): number | null => {
    if (kind === 'selfuse') return p > 0.01 ? Math.max(0, p - e) / p : null;
    const consumed = Math.max(0, p + i - e);
    return consumed > 0.01 ? Math.max(0, consumed - i) / consumed : null;
  };
  const points: SharePoint[] = [];
  let sp = 0;
  let si = 0;
  let se = 0;
  for (const t of ts) {
    const p = pv.get(t) ?? 0;
    const i = imp.get(t) ?? 0;
    const e = exp.get(t) ?? 0;
    sp += p;
    si += i;
    se += e;
    const v = share(p, i, e);
    if (v !== null) points.push({ t, v: Math.round(Math.min(1, v) * 100) });
  }
  const total = share(sp, si, se);
  return { points, total: total === null ? null : Math.round(Math.min(1, total) * 100) };
}
