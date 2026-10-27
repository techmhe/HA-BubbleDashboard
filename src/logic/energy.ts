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
  /** Set when PV feeds the battery inverter instead of the house (see `battery.pv_coupled`). */
  coupled?: BatteryCoupling;
}

/** PV behind the battery inverter: its AC output splits into current PV and stored energy. */
export interface BatteryCoupling {
  /** PV power going into the battery inverter. */
  pv: number;
  /** AC output of the battery inverter into the house. */
  output: number;
  fromPv: number;
  fromBattery: number;
  /** PV (and AC charging) going into the battery. */
  charge: number;
}

export function batteryCoupling(pv: number, power: number): BatteryCoupling {
  const output = Math.max(0, power);
  return {
    pv,
    output,
    fromPv: Math.min(pv, output),
    fromBattery: Math.max(0, output - pv),
    charge: Math.max(0, pv - output) + Math.max(0, -power),
  };
}

const z = (v: number | null) => v ?? 0;

/** The parts of HA's energy dashboard config (energy/get_prefs) the card uses. */
export interface EnergyPrefs {
  energy_sources: {
    type: string; stat_energy_from?: string; stat_energy_to?: string; stat_rate?: string;
    stat_cost?: string | null; stat_compensation?: string | null;
    number_energy_price?: number | null; number_energy_price_export?: number | null;
  }[];
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

/** Battery discharge (energy into the house) and charge statistics of the energy dashboard. */
export function batteryStatIds(prefs: EnergyPrefs): { batteryOut: string[]; batteryIn: string[] } {
  const bat = (prefs.energy_sources ?? []).filter((s) => s.type === 'battery');
  return {
    batteryOut: bat.filter((s) => s.stat_energy_from).map((s) => s.stat_energy_from!),
    batteryIn: bat.filter((s) => s.stat_energy_to).map((s) => s.stat_energy_to!),
  };
}

export interface GridTariff {
  /** Fixed prices in €/kWh (only with a single grid source). */
  importPrice: number | null;
  exportPrice: number | null;
  /** Cost statistics HA keeps for the grid (stat_cost, else the generated <stat>_cost sensor). */
  costStats: string[];
  compensationStats: string[];
}

export function gridTariff(prefs: EnergyPrefs): GridTariff {
  const grid = (prefs.energy_sources ?? []).filter((s) => s.type === 'grid');
  const one = grid.length === 1 ? grid[0] : undefined;
  return {
    importPrice: one?.number_energy_price ?? null,
    exportPrice: one?.number_energy_price_export ?? null,
    costStats: grid.filter((s) => s.stat_cost || s.stat_energy_from).map((s) => s.stat_cost || `${s.stat_energy_from}_cost`),
    compensationStats: grid.filter((s) => s.stat_compensation || s.stat_energy_to).map((s) => s.stat_compensation || `${s.stat_energy_to}_compensation`),
  };
}

export interface EnergyCost {
  /** Paid for grid import, €. */
  cost: number;
  /** Earned for feed-in, €. */
  compensation: number;
  /** Import avoided by PV and battery at the import price, € (fixed price only). */
  saved: number | null;
  net: number;
}

/** Today's grid cost: fixed prices × kWh, else HA's cost statistics; null when neither is known. */
export function energyCost(
  t: GridTariff, kwh: { import: number; export: number; local: number }, stats?: { cost: number; compensation: number },
): EnergyCost | null {
  const r2 = (v: number) => Math.round(v * 100) / 100;
  const cost = t.importPrice !== null ? kwh.import * t.importPrice : stats?.cost;
  if (cost === undefined) return null;
  const compensation = t.exportPrice !== null ? kwh.export * t.exportPrice : stats?.compensation ?? 0;
  return {
    cost: r2(cost),
    compensation: r2(compensation),
    saved: t.importPrice !== null ? r2(kwh.local * t.importPrice) : null,
    net: r2(cost - compensation),
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

/** The sensor, or one member of a sensor group (its `entity_id` attribute), belongs to the device. */
function onDevice(hass: HomeAssistant, id: string, device: string): boolean {
  if (hass.entities[id]?.device_id === device) return true;
  const members = hass.states[id]?.attributes.entity_id;
  return Array.isArray(members) && members.some((m) => hass.entities[m]?.device_id === device);
}

export function energyNow(hass: HomeAssistant, config: CardConfig, prefs?: EnergyPrefs): EnergyNow {
  const sum = (ids: string[]) => ids.reduce((s, id) => s + Math.max(0, z(num(hass, id))), 0);
  const pvIds = pvSensors(config, prefs);
  const pv = sum(pvIds);
  const imp = Math.max(0, z(num(hass, ent(config, 'grid_import'))));
  const exp = Math.max(0, z(num(hass, ent(config, 'grid_export'))));
  const batId = ent(config, 'battery_power');
  const batPower = num(hass, batId);
  const soc = num(hass, ent(config, 'battery_soc'));
  const battery = batPower !== null || soc !== null ? { soc, power: z(batPower) } : null;
  const forced = config.battery?.pv_coupled;
  const batDevice = hass.entities[batId]?.device_id;
  const coupledIds = forced === false || !battery ? []
    : forced === true ? pvIds
    : pvIds.filter((id) => !!batDevice && onDevice(hass, id, batDevice));
  const coupled = coupledIds.length ? batteryCoupling(sum(coupledIds), battery!.power) : undefined;
  // Coupled PV reaches the house only through the battery output, so it is not added on its own.
  const direct = pv - (coupled?.pv ?? 0);
  const house = num(hass, ent(config, 'house_power')) ?? Math.max(0, direct + imp - exp + z(battery?.power ?? null));
  return coupled ? { pv, house, import: imp, export: exp, battery, coupled } : { pv, house, import: imp, export: exp, battery };
}

/** Where the house's power comes from right now: PV (direct or through the battery), stored energy, grid. */
export function houseSources(e: EnergyNow): { pv: number; battery: number; grid: number } {
  const pvToHouse = e.coupled ? e.pv - e.coupled.pv + e.coupled.fromPv : e.pv;
  const stored = e.coupled ? e.coupled.fromBattery : Math.max(0, e.battery?.power ?? 0);
  const pv = Math.min(pvToHouse, e.house);
  const battery = Math.max(0, Math.min(stored, e.house - pv));
  return { pv: Math.round(pv), battery: Math.round(battery), grid: Math.round(e.import) };
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
  // PV behind the battery reaches the house only as part of the battery output.
  const toHouse = e.coupled ? e.pv - e.coupled.pv + e.coupled.fromPv : e.pv;
  let text: string;
  if (e.pv > IDLE && e.export > e.import) text = 'Sonne liefert, Überschuss geht ins Netz';
  else if (e.coupled && e.pv > IDLE && toHouse <= IDLE) text = e.import > IDLE ? 'PV lädt den Akku, Strom aus dem Netz' : 'PV lädt den Akku';
  else if (e.pv > IDLE && e.import > IDLE) text = `PV deckt ${Math.min(99, Math.round((toHouse / Math.max(e.house, 1)) * 100))} %, Rest aus dem Netz`;
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
export interface EnergyTotals {
  pv: number;
  import: number;
  export: number;
  batteryOut?: number;
  batteryIn?: number;
  /** Grid cost statistics today, € (only loaded when the price is not fixed). */
  cost?: number;
  compensation?: number;
}

/** Consumption and the locally covered part: PV + import + battery discharge − export − battery charge. */
function consumption(pv: number, imp: number, exp: number, bOut = 0, bIn = 0) {
  const r3 = (v: number) => Math.round(v * 1000) / 1000;
  const consumed = r3(Math.max(0, pv + imp + bOut - exp - bIn));
  return { consumed, local: r3(Math.max(0, consumed - imp)) };
}

export function energyToday(hass: HomeAssistant, config: CardConfig, stats?: EnergyTotals): EnergyToday {
  const pv = stats ? stats.pv : kwh(hass, ent(config, 'pv_today'));
  const imp = stats ? stats.import : kwh(hass, ent(config, 'import_today'));
  const exp = stats ? stats.export : kwh(hass, ent(config, 'export_today'));
  const { consumed, local } = consumption(pv, imp, exp, stats?.batteryOut, stats?.batteryIn);
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
export function shareSeries(
  kind: ShareKind,
  parts: { pv: SharePoint[]; import: SharePoint[]; export: SharePoint[]; batteryOut?: SharePoint[]; batteryIn?: SharePoint[] },
) {
  const byT = (p: SharePoint[]) => new Map(p.map((x) => [x.t, x.v]));
  const imp = byT(parts.import);
  const exp = byT(parts.export);
  const pv = byT(parts.pv);
  const bo = byT(parts.batteryOut ?? []);
  const bi = byT(parts.batteryIn ?? []);
  const ts = [...new Set([...pv.keys(), ...imp.keys(), ...exp.keys(), ...bo.keys(), ...bi.keys()])].sort((a, b) => a - b);
  const share = (p: number, i: number, e: number, o: number, n: number): number | null => {
    if (kind === 'selfuse') return p > 0.01 ? Math.max(0, p - e) / p : null;
    const { consumed, local } = consumption(p, i, e, o, n);
    return consumed > 0.01 ? local / consumed : null;
  };
  const points: SharePoint[] = [];
  let sp = 0;
  let si = 0;
  let se = 0;
  let so = 0;
  let sn = 0;
  for (const t of ts) {
    const p = pv.get(t) ?? 0;
    const i = imp.get(t) ?? 0;
    const e = exp.get(t) ?? 0;
    const o = bo.get(t) ?? 0;
    const n = bi.get(t) ?? 0;
    sp += p;
    si += i;
    se += e;
    so += o;
    sn += n;
    const v = share(p, i, e, o, n);
    if (v !== null) points.push({ t, v: Math.round(Math.min(1, v) * 100) });
  }
  const total = share(sp, si, se, so, sn);
  return { points, total: total === null ? null : Math.round(Math.min(1, total) * 100) };
}

/** House consumption (kWh) per bucket: PV + import + battery out − export − battery in. */
export function consumptionSeries(parts: {
  pv: SharePoint[]; import: SharePoint[]; export: SharePoint[]; batteryOut?: SharePoint[]; batteryIn?: SharePoint[];
}): SharePoint[] {
  const all = [parts.pv, parts.import, parts.export, parts.batteryOut ?? [], parts.batteryIn ?? []].map((p) => new Map(p.map((x) => [x.t, x.v])));
  const ts = [...new Set(all.flatMap((m) => [...m.keys()]))].sort((a, b) => a - b);
  return ts.map((t) => {
    const [p, i, e, o, n] = all.map((m) => m.get(t) ?? 0);
    return { t, v: consumption(p, i, e, o, n).consumed };
  });
}

/** Energy in kWh from mean power per bucket (W) and the bucket size in ms. */
export function powerEnergyKWh(points: { t: number; v: number }[], step: number): number {
  return points.reduce((sum, p) => sum + (p.v * step) / 3600_000 / 1000, 0);
}

/**
 * Why an idle battery does nothing: "Reserve" at or below the discharge limit, "voll" at or
 * above the charge limit (default 100 %). Limits come from the card config (`battery`).
 */
export function batteryNote(bat: { soc: number | null; power: number }, limits?: { reserve?: number; full?: number }): string | null {
  if (bat.soc === null || Math.abs(bat.power) > 10) return null;
  if (limits?.reserve !== undefined && bat.soc <= limits.reserve) return 'Reserve';
  if (bat.soc >= (limits?.full ?? 100)) return 'voll';
  return null;
}
