import type { Point } from '../logic/climate';
import { roomClimate } from '../logic/climate';
import { HEATING_CHECK_DEFAULTS, heatingAlerts, wasHeating, wasOpen, type HeatingAlert, type HeatingCheckOptions } from '../logic/heating-check';
import type { Room } from '../logic/rooms';
import { roomPowerIds } from '../logic/rooms-page';
import type { HomeAssistant } from '../types';

const HOUR = 3600_000;
/** Heating and open windows count a bit before the window too (residual heat, recovery after airing). */
const LEAD = HOUR;

type StatRow = { start: number | string; mean?: number | null; max?: number | null };
type HistRow = { s: string; a?: Record<string, unknown> };

/** VTherm publishes the heating demand as `sensor.<climate>_power_percent` (with statistics). */
export function powerPercentId(hass: HomeAssistant, climate: string): string | undefined {
  const id = `sensor.${climate.split('.')[1]}_power_percent`;
  return hass.states[id] ? id : undefined;
}

/**
 * Loads what the heating check needs: 5-minute statistics (temperature, humidity, room power,
 * PV, the thermostats' heating demand) and the window sensors' history, kept small
 * (no attributes). Only thermostats without a demand sensor fall back to their history.
 */
export async function loadHeatingAlerts(
  hass: HomeAssistant, rooms: Room[], pvIds: string[], opts: Partial<HeatingCheckOptions> = {}, now = Date.now(),
): Promise<HeatingAlert[]> {
  const o = { ...HEATING_CHECK_DEFAULTS, ...opts };
  const checked = rooms.filter((r) => r.climate && hass.states[r.temperature]);
  if (!checked.length) return [];
  const start = now - o.hours * HOUR;
  const power = new Map(checked.map((r) => [r.slug, roomPowerIds(hass, r)]));
  const demand = new Map(checked.map((r) => [r.slug, powerPercentId(hass, r.climate!)]));
  const statIds = [...new Set([
    ...checked.flatMap((r) => [r.temperature, r.humidity, ...power.get(r.slug)!, demand.get(r.slug) ?? '']),
    ...pvIds,
  ].filter((id) => id && hass.states[id]))];
  const windows = checked.flatMap((r) => (r.window ? [r.window] : []));
  const fallback = checked.filter((r) => !demand.get(r.slug)).map((r) => r.climate!);
  const history = (ids: string[], attributes: boolean) =>
    ids.length
      ? hass.callWS<Record<string, HistRow[]>>({
          type: 'history/history_during_period',
          start_time: new Date(start - LEAD).toISOString(),
          end_time: new Date(now).toISOString(),
          entity_ids: ids,
          ...(attributes ? { significant_changes_only: false } : { minimal_response: true, no_attributes: true }),
        })
      : Promise.resolve({} as Record<string, HistRow[]>);
  const [stats, winHist, climHist] = await Promise.all([
    hass.callWS<Record<string, StatRow[]>>({
      type: 'recorder/statistics_during_period',
      start_time: new Date(start - LEAD).toISOString(),
      end_time: new Date(now).toISOString(),
      statistic_ids: statIds,
      period: '5minute',
      types: ['mean', 'max'],
    }),
    history(windows, false),
    history(fallback, true),
  ]);
  const rows = (id: string, from = start) =>
    (stats[id] ?? []).map((r) => ({ ...r, t: typeof r.start === 'number' ? r.start : Date.parse(r.start) })).filter((r) => r.t >= from);
  const points = (id: string): Point[] => rows(id).map((r) => ({ t: r.t, v: Number(r.mean) })).filter((p) => Number.isFinite(p.v));
  const mean = (id: string) => {
    const p = points(id);
    return p.length ? p.reduce((s, x) => s + x.v, 0) / p.length : 0;
  };
  const demanded = (id: string) => rows(id, start - LEAD).some((r) => Number(r.max ?? r.mean) > 0);
  const pv = pvIds.reduce((s, id) => s + Math.max(0, mean(id)), 0);
  return heatingAlerts(
    checked.map((r) => {
      const c = roomClimate(hass, r);
      const d = demand.get(r.slug);
      return {
        slug: r.slug,
        name: r.name,
        temps: points(r.temperature),
        hums: points(r.humidity),
        power: power.get(r.slug)!.reduce((s, id) => s + Math.max(0, mean(id)), 0),
        heated: c.heating || (d ? demanded(d) : wasHeating(climHist[r.climate!] ?? [])),
        windowOpened: c.windowOpen || (!!r.window && wasOpen(winHist[r.window] ?? [])),
        off: c.off,
        cur: c.cur,
        target: c.target,
      };
    }),
    pv,
    o,
  );
}
