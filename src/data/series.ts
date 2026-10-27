import { airingBands, bucket, type AiringBand, type Point } from '../logic/climate';
import { consumptionSeries, shareSeries, statChanges, type EnergyTotals, type GridTariff, type ShareKind } from '../logic/energy';
import { weatherSeries, type ForecastItem, type HistoryRow, type WeatherMetric } from '../logic/weather';
import type { HomeAssistant } from '../types';

const HOUR = 3600_000;
const DAY = 24 * HOUR;

export type ChartRange = '4h' | '24h' | '7d' | '30d';

export interface SeriesResult {
  past: Point[];
  future?: Point[];
  start: number;
  end: number;
  /** Bucket size in ms (bars). */
  step?: number;
  /** Total over the whole range, where the mean of the buckets would be wrong (percentages). */
  total?: number | null;
  /** Second line for comparison (e.g. outdoor dew point). */
  compare?: Point[];
  /** Background bands (e.g. when airing was recommended). */
  bands?: AiringBand[];
}

type StatRow = { start: number | string; change?: number | null; mean?: number | null };
const ts = (v: number | string) => (typeof v === 'number' ? v : Date.parse(v));

/**
 * Long-term statistics only exist for finished hours, so the running hour comes from the
 * 5-minute statistics (from the start of the hour until now).
 */
async function runningHour(hass: HomeAssistant, ids: string[], type: 'change' | 'mean', now = Date.now()) {
  const start = Math.floor(now / HOUR) * HOUR;
  if (!ids.length) return { start, rows: {} as Record<string, StatRow[]> };
  const rows = await hass.callWS<Record<string, StatRow[]>>({
    type: 'recorder/statistics_during_period',
    start_time: new Date(start).toISOString(),
    end_time: new Date(now).toISOString(),
    statistic_ids: ids,
    period: '5minute',
    types: [type],
    ...(type === 'change' ? { units: { energy: 'kWh' } } : {}),
  });
  return { start, rows };
}

function rangeSpec(range: ChartRange, now = Date.now()) {
  if (range === '4h') {
    // Short-term statistics (kept ~10 days by the recorder): 48 points.
    const step = 5 * 60_000;
    const end = Math.ceil(now / step) * step;
    return { start: end - 4 * HOUR, end, period: '5minute' as const, step };
  }
  if (range === '24h') {
    const end = Math.ceil(now / HOUR) * HOUR;
    return { start: end - 24 * HOUR, end, period: 'hour' as const, step: HOUR };
  }
  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0);
  const days = range === '7d' ? 7 : 30;
  const end = midnight.getTime() + DAY;
  return { start: end - days * DAY, end, period: 'day' as const, step: DAY };
}

/** Energy per hour (24 h) or per day (7/30 days), summed over the given statistics (kWh). */
export async function loadEnergy(hass: HomeAssistant, ids: string[], range: ChartRange): Promise<SeriesResult> {
  const r = rangeSpec(range);
  const [rows, live] = await Promise.all([
    hass.callWS<Record<string, StatRow[]>>({
      type: 'recorder/statistics_during_period',
      start_time: new Date(r.start).toISOString(),
      end_time: new Date(r.end).toISOString(),
      statistic_ids: ids,
      period: r.period,
      types: ['change'],
      units: { energy: 'kWh' },
    }),
    r.period === '5minute' ? null : runningHour(hass, ids, 'change'),
  ]);
  const sums = new Map<number, number>();
  for (const id of ids) {
    for (const row of rows[id] ?? []) {
      const t = ts(row.start);
      sums.set(t, (sums.get(t) ?? 0) + (Number(row.change) || 0));
    }
  }
  if (live) {
    // Hourly view: the running hour's own bar (unless HA already compiled it); daily view: today.
    const t = r.period === 'hour' ? live.start : r.end - r.step;
    if (r.period !== 'hour' || !sums.has(t)) sums.set(t, (sums.get(t) ?? 0) + statChanges(live.rows, ids));
  }
  const past: Point[] = [];
  for (let t = r.start; t < r.end; t += r.step) past.push({ t, v: Math.max(0, sums.get(t) ?? 0) });
  return { past, start: r.start, end: r.end, step: r.step };
}

/** Autarky or self-use in percent per hour/day, from the energy dashboard's PV and grid statistics. */
export async function loadEnergyShare(
  hass: HomeAssistant,
  ids: { solar: string[]; import: string[]; export: string[]; batteryOut: string[]; batteryIn: string[] },
  range: ChartRange,
  kind: ShareKind,
): Promise<SeriesResult> {
  const none = (): Promise<SeriesResult> => Promise.resolve({ past: [], start: 0, end: 0 });
  const lists = kind === 'autarky'
    ? [ids.solar, ids.import, ids.export, ids.batteryOut, ids.batteryIn]
    : [ids.solar, ids.import, ids.export];
  const [pv, imp, exp, bOut, bIn] = await Promise.all(lists.map((list) => (list.length ? loadEnergy(hass, list, range) : none())));
  const base = [pv, imp, exp].find((r) => r.start) ?? pv;
  const share = shareSeries(kind, { pv: pv.past, import: imp.past, export: exp.past, batteryOut: bOut?.past, batteryIn: bIn?.past });
  return { past: share.points, start: base.start, end: base.end, step: base.step, total: share.total };
}

/** House consumption in kWh per hour/day from the energy dashboard's PV, grid and battery statistics. */
export async function loadConsumption(
  hass: HomeAssistant,
  ids: { solar: string[]; import: string[]; export: string[]; batteryOut: string[]; batteryIn: string[] },
  range: ChartRange,
): Promise<SeriesResult> {
  const none = (): Promise<SeriesResult> => Promise.resolve({ past: [], start: 0, end: 0 });
  const [pv, imp, exp, bOut, bIn] = await Promise.all(
    [ids.solar, ids.import, ids.export, ids.batteryOut, ids.batteryIn].map((l) => (l.length ? loadEnergy(hass, l, range) : none())),
  );
  const base = [pv, imp, exp].find((r) => r.start) ?? pv;
  const past = consumptionSeries({ pv: pv.past, import: imp.past, export: exp.past, batteryOut: bOut.past, batteryIn: bIn.past });
  return { past, start: base.start, end: base.end, step: base.step };
}

export type DewRange = '24h' | '3d' | '7d';

/**
 * Room dew point with the outdoor dew point and the room's airing recommendation, from the
 * recorder history (the room dew sensors keep no long-term statistics, so 7 days at most).
 */
export async function loadDewPoint(
  hass: HomeAssistant, ids: { room: string; outdoor?: string; airing?: string }, range: DewRange,
): Promise<SeriesResult> {
  const now = Date.now();
  const size = range === '24h' ? HOUR / 2 : HOUR;
  const end = Math.ceil(now / size) * size;
  const start = end - (range === '24h' ? 1 : range === '3d' ? 3 : 7) * DAY;
  const entityIds = [ids.room, ids.outdoor, ids.airing].filter((x): x is string => !!x);
  const rows = await hass.callWS<Record<string, HistoryRow[]>>({
    type: 'history/history_during_period',
    start_time: new Date(start).toISOString(),
    end_time: new Date(now).toISOString(),
    entity_ids: entityIds,
    minimal_response: true,
    no_attributes: true,
    significant_changes_only: false,
  });
  // The first row is the state at the window start; clamp it so the line starts there.
  const pts = (id?: string) =>
    (id ? rows[id] ?? [] : [])
      .map((r) => ({ t: Math.max(start, Math.round(r.lu * 1000)), v: Number(r.s) }))
      .filter((p) => Number.isFinite(p.v));
  return {
    past: bucket(pts(ids.room), start, end, size),
    compare: ids.outdoor ? bucket(pts(ids.outdoor), start, end, size) : undefined,
    bands: ids.airing ? airingBands(rows[ids.airing] ?? [], start, now) : undefined,
    start,
    end,
  };
}

/**
 * One room sensor over the last 15 minutes (30 s steps) with the room's airing bands, for the
 * airing sheet's room chart.
 */
export async function loadAiringRoom(hass: HomeAssistant, id: string, airing: string, now = Date.now()): Promise<SeriesResult> {
  const end = now;
  const start = end - 15 * 60_000;
  const rows = await hass.callWS<Record<string, HistoryRow[]>>({
    type: 'history/history_during_period',
    start_time: new Date(start).toISOString(),
    end_time: new Date(end).toISOString(),
    entity_ids: [id, airing],
    minimal_response: true,
    no_attributes: true,
    significant_changes_only: false,
  });
  const pts = (rows[id] ?? [])
    .map((r) => ({ t: Math.max(start, Math.round(r.lu * 1000)), v: Number(r.s) }))
    .filter((p) => Number.isFinite(p.v));
  return { past: bucket(pts, start, end, 30_000), bands: airingBands(rows[airing] ?? [], start, end), start, end };
}

/** Mean power per hour/day for sensors without an energy statistic. */
export async function loadPower(hass: HomeAssistant, id: string, range: ChartRange): Promise<SeriesResult> {
  const r = rangeSpec(range);
  const [rows, live] = await Promise.all([
    hass.callWS<Record<string, StatRow[]>>({
      type: 'recorder/statistics_during_period',
      start_time: new Date(r.start).toISOString(),
      end_time: new Date(r.end).toISOString(),
      statistic_ids: [id],
      period: r.period,
      types: ['mean'],
    }),
    r.period === 'hour' ? runningHour(hass, [id], 'mean') : null,
  ]);
  const past = (rows[id] ?? []).map((row) => ({ t: ts(row.start), v: Math.abs(Number(row.mean)) })).filter((p) => Number.isFinite(p.v));
  if (live && !past.some((p) => p.t === live.start)) {
    // Running hour: mean of its finished 5-minute means.
    const vals = (live.rows[id] ?? []).map((row) => Math.abs(Number(row.mean))).filter(Number.isFinite);
    if (vals.length) past.push({ t: live.start, v: vals.reduce((a, b) => a + b, 0) / vals.length });
  }
  return { past, start: r.start, end: r.end, step: r.step };
}

/** Today's kWh per role from the energy dashboard statistics. */
export async function loadEnergyToday(
  hass: HomeAssistant, ids: { solar: string[]; import: string[]; export: string[]; batteryOut: string[]; batteryIn: string[] },
  tariff?: GridTariff,
): Promise<EnergyTotals> {
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);
  // Cost statistics are only needed when the price is not a fixed number.
  const costIds = tariff && tariff.importPrice === null ? tariff.costStats : [];
  const compIds = tariff && tariff.exportPrice === null ? tariff.compensationStats : [];
  const all = [...ids.solar, ...ids.import, ...ids.export, ...ids.batteryOut, ...ids.batteryIn, ...costIds, ...compIds];
  const [hours, live] = await Promise.all([
    hass.callWS<Record<string, StatRow[]>>({
      type: 'recorder/statistics_during_period',
      start_time: midnight.toISOString(),
      statistic_ids: all,
      period: 'hour',
      types: ['change'],
      units: { energy: 'kWh' },
    }),
    runningHour(hass, all, 'change'),
  ]);
  // Finished hours plus the running hour (skipped if HA already compiled it).
  const rows: Record<string, StatRow[]> = {};
  for (const id of all) {
    const done = hours[id] ?? [];
    const partial = done.some((r) => ts(r.start) === live.start) ? [] : live.rows[id] ?? [];
    if (hours[id] || live.rows[id]) rows[id] = [...done, ...partial];
  }
  return {
    pv: statChanges(rows, ids.solar),
    import: statChanges(rows, ids.import),
    export: statChanges(rows, ids.export),
    batteryOut: statChanges(rows, ids.batteryOut),
    batteryIn: statChanges(rows, ids.batteryIn),
    ...(costIds.some((id) => rows[id]) ? { cost: statChanges(rows, costIds), compensation: statChanges(rows, compIds) } : {}),
  };
}

/** Grid cost in € per hour/day: fixed price × imported kWh, else HA's cost statistics. `total` = feed-in compensation. */
export async function loadCost(
  hass: HomeAssistant, tariff: GridTariff, ids: { import: string[]; export: string[] }, range: ChartRange,
): Promise<SeriesResult> {
  const scaled = async (stats: string[], price: number | null, fallback: string[]) => {
    if (price !== null) {
      const r = await loadEnergy(hass, stats, range);
      return { ...r, past: r.past.map((p) => ({ t: p.t, v: p.v * price })) };
    }
    return loadEnergy(hass, fallback, range);
  };
  const [cost, comp] = await Promise.all([
    scaled(ids.import, tariff.importPrice, tariff.costStats),
    ids.export.length || tariff.compensationStats.length
      ? scaled(ids.export, tariff.exportPrice, tariff.compensationStats)
      : Promise.resolve({ past: [] as Point[] }),
  ]);
  const total = Math.round(comp.past.reduce((s, p) => s + p.v, 0) * 100) / 100;
  return { ...cost, total };
}

/**
 * Rain bars per hour: the last 24 h from the precipitation sensor's hourly statistics (mean
 * mm/h = mm in that hour), the running hour and the next 23 from the hourly forecast.
 */
export async function loadWeatherRain(hass: HomeAssistant, sensor: string | undefined, hourly: ForecastItem[]): Promise<SeriesResult> {
  const now = Date.now();
  const hourStart = Math.floor(now / HOUR) * HOUR;
  const start = Math.floor((now - 24 * HOUR) / HOUR) * HOUR;
  const end = hourStart + 24 * HOUR;
  const rows = sensor
    ? await hass.callWS<Record<string, StatRow[]>>({
        type: 'recorder/statistics_during_period',
        start_time: new Date(start).toISOString(),
        end_time: new Date(hourStart).toISOString(),
        statistic_ids: [sensor],
        period: 'hour',
        types: ['mean'],
      })
    : {};
  const past = (sensor ? rows[sensor] ?? [] : [])
    .map((row) => ({ t: ts(row.start), v: Math.max(0, Number(row.mean)) }))
    .filter((p) => Number.isFinite(p.v) && p.t < hourStart);
  const future = hourly
    .map((f) => ({ t: Date.parse(f.datetime), v: Number(f.precipitation) }))
    .filter((p) => Number.isFinite(p.t) && Number.isFinite(p.v) && p.t >= hourStart && p.t < end)
    .slice(0, 24);
  return { past, future, start, end, step: HOUR };
}

/** Last 24 h from the weather entity's history (hourly means) and the next 24 h from the hourly forecast. */
export async function loadWeatherMetric(
  hass: HomeAssistant, entity: string, metric: WeatherMetric, hourly: ForecastItem[],
): Promise<SeriesResult> {
  const now = Date.now();
  const start = Math.floor((now - 24 * HOUR) / HOUR) * HOUR;
  const end = start + 48 * HOUR;
  const hist = await hass.callWS<Record<string, HistoryRow[]>>({
    type: 'history/history_during_period',
    start_time: new Date(start).toISOString(),
    end_time: new Date(now).toISOString(),
    entity_ids: [entity],
    minimal_response: false,
    no_attributes: false,
    significant_changes_only: false,
  });
  const { past, future } = weatherSeries(metric, hist[entity] ?? [], hourly);
  const pastHourly = bucket(past, start, now, HOUR);
  const nowPoint = past.length ? [{ t: now, v: past[past.length - 1].v }] : [];
  return {
    past: [...pastHourly, ...nowPoint],
    future: [...nowPoint, ...future.filter((p) => p.t > now && p.t <= end)],
    start,
    end,
  };
}

/** Energy of one meter since the start of the calendar month (kWh) in `total`. */
export async function loadMonthEnergy(hass: HomeAssistant, id: string, now = Date.now()): Promise<SeriesResult> {
  const first = new Date(now);
  first.setDate(1);
  first.setHours(0, 0, 0, 0);
  const rows = await hass.callWS<Record<string, StatRow[]>>({
    type: 'recorder/statistics_during_period',
    start_time: first.toISOString(),
    end_time: new Date(now).toISOString(),
    statistic_ids: [id],
    period: 'month',
    types: ['change'],
    units: { energy: 'kWh' },
  });
  const hour = await runningHour(hass, [id], 'change', now);
  const sum = (r: StatRow[] | undefined) => (r ?? []).reduce((a, x) => a + (x.change ?? 0), 0);
  return { past: [], start: first.getTime(), end: now, total: sum(rows[id]) + sum(hour.rows[id]) };
}
