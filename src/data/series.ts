import { bucket, type Point } from '../logic/climate';
import { shareSeries, statChanges, type ShareKind } from '../logic/energy';
import { weatherSeries, type ForecastItem, type HistoryRow, type WeatherMetric } from '../logic/weather';
import type { HomeAssistant } from '../types';

const HOUR = 3600_000;
const DAY = 24 * HOUR;

export type ChartRange = '24h' | '7d' | '30d';

export interface SeriesResult {
  past: Point[];
  future?: Point[];
  start: number;
  end: number;
  /** Bucket size in ms (bars). */
  step?: number;
  /** Total over the whole range, where the mean of the buckets would be wrong (percentages). */
  total?: number | null;
}

type StatRow = { start: number | string; change?: number | null; mean?: number | null };
const ts = (v: number | string) => (typeof v === 'number' ? v : Date.parse(v));

function rangeSpec(range: ChartRange, now = Date.now()) {
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
  const rows = await hass.callWS<Record<string, StatRow[]>>({
    type: 'recorder/statistics_during_period',
    start_time: new Date(r.start).toISOString(),
    end_time: new Date(r.end).toISOString(),
    statistic_ids: ids,
    period: r.period,
    types: ['change'],
    units: { energy: 'kWh' },
  });
  const sums = new Map<number, number>();
  for (const id of ids) {
    for (const row of rows[id] ?? []) {
      const t = ts(row.start);
      sums.set(t, (sums.get(t) ?? 0) + (Number(row.change) || 0));
    }
  }
  const past: Point[] = [];
  for (let t = r.start; t < r.end; t += r.step) past.push({ t, v: Math.max(0, sums.get(t) ?? 0) });
  return { past, start: r.start, end: r.end, step: r.step };
}

/** Autarky or self-use in percent per hour/day, from the energy dashboard's PV and grid statistics. */
export async function loadEnergyShare(
  hass: HomeAssistant,
  ids: { solar: string[]; import: string[]; export: string[] },
  range: ChartRange,
  kind: ShareKind,
): Promise<SeriesResult> {
  const none = (): Promise<SeriesResult> => Promise.resolve({ past: [], start: 0, end: 0 });
  const [pv, imp, exp] = await Promise.all(
    [ids.solar, ids.import, ids.export].map((list) => (list.length ? loadEnergy(hass, list, range) : none())),
  );
  const base = [pv, imp, exp].find((r) => r.start) ?? pv;
  const share = shareSeries(kind, { pv: pv.past, import: imp.past, export: exp.past });
  return { past: share.points, start: base.start, end: base.end, step: base.step, total: share.total };
}

/** Mean power per hour/day for sensors without an energy statistic. */
export async function loadPower(hass: HomeAssistant, id: string, range: ChartRange): Promise<SeriesResult> {
  const r = rangeSpec(range);
  const rows = await hass.callWS<Record<string, StatRow[]>>({
    type: 'recorder/statistics_during_period',
    start_time: new Date(r.start).toISOString(),
    end_time: new Date(r.end).toISOString(),
    statistic_ids: [id],
    period: r.period,
    types: ['mean'],
  });
  const past = (rows[id] ?? []).map((row) => ({ t: ts(row.start), v: Math.abs(Number(row.mean)) })).filter((p) => Number.isFinite(p.v));
  return { past, start: r.start, end: r.end, step: r.step };
}

/** Today's kWh per role from the energy dashboard statistics. */
export async function loadEnergyToday(
  hass: HomeAssistant, ids: { solar: string[]; import: string[]; export: string[] },
): Promise<{ pv: number; import: number; export: number }> {
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);
  const all = [...ids.solar, ...ids.import, ...ids.export];
  const rows = await hass.callWS<Record<string, { change?: number | null }[]>>({
    type: 'recorder/statistics_during_period',
    start_time: midnight.toISOString(),
    statistic_ids: all,
    period: 'hour',
    types: ['change'],
    units: { energy: 'kWh' },
  });
  return { pv: statChanges(rows, ids.solar), import: statChanges(rows, ids.import), export: statChanges(rows, ids.export) };
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
