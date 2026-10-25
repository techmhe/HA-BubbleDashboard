import type { Point } from '../logic/climate';
import { roomClimate } from '../logic/climate';
import { HEATING_CHECK_DEFAULTS, heatingAlerts, wasHeating, wasOpen, type HeatingAlert, type HeatingCheckOptions } from '../logic/heating-check';
import type { Room } from '../logic/rooms';
import { roomPowerIds } from '../logic/rooms-page';
import type { HomeAssistant } from '../types';

const HOUR = 3600_000;
/** Heating and open windows count a bit before the window too (residual heat, recovery after airing). */
const LEAD = HOUR;

type StatRow = { start: number | string; mean?: number | null };
type HistRow = { s: string; a?: Record<string, unknown> };

/**
 * Loads what the heating check needs in two requests: 5-minute statistics (temperature,
 * humidity, room power, PV) and the history of thermostats and window sensors.
 */
export async function loadHeatingAlerts(
  hass: HomeAssistant, rooms: Room[], pvIds: string[], opts: Partial<HeatingCheckOptions> = {}, now = Date.now(),
): Promise<HeatingAlert[]> {
  const o = { ...HEATING_CHECK_DEFAULTS, ...opts };
  const checked = rooms.filter((r) => r.climate && hass.states[r.temperature]);
  if (!checked.length) return [];
  const start = now - o.hours * HOUR;
  const power = new Map(checked.map((r) => [r.slug, roomPowerIds(hass, r)]));
  const statIds = [...new Set([
    ...checked.flatMap((r) => [r.temperature, r.humidity, ...power.get(r.slug)!]),
    ...pvIds,
  ].filter((id) => id && hass.states[id]))];
  const histIds = checked.flatMap((r) => [r.climate!, ...(r.window ? [r.window] : [])]);
  const [stats, hist] = await Promise.all([
    hass.callWS<Record<string, StatRow[]>>({
      type: 'recorder/statistics_during_period',
      start_time: new Date(start).toISOString(),
      end_time: new Date(now).toISOString(),
      statistic_ids: statIds,
      period: '5minute',
      types: ['mean'],
    }),
    hass.callWS<Record<string, HistRow[]>>({
      type: 'history/history_during_period',
      start_time: new Date(start - LEAD).toISOString(),
      end_time: new Date(now).toISOString(),
      entity_ids: histIds,
      significant_changes_only: false,
    }),
  ]);
  const points = (id: string): Point[] =>
    (stats[id] ?? [])
      .map((r) => ({ t: typeof r.start === 'number' ? r.start : Date.parse(r.start), v: Number(r.mean) }))
      .filter((p) => Number.isFinite(p.v));
  const mean = (id: string) => {
    const p = points(id);
    return p.length ? p.reduce((s, x) => s + x.v, 0) / p.length : 0;
  };
  const pv = pvIds.reduce((s, id) => s + Math.max(0, mean(id)), 0);
  return heatingAlerts(
    checked.map((r) => {
      const c = roomClimate(hass, r);
      return {
        slug: r.slug,
        name: r.name,
        temps: points(r.temperature),
        hums: points(r.humidity),
        power: power.get(r.slug)!.reduce((s, id) => s + Math.max(0, mean(id)), 0),
        heated: c.heating || wasHeating(hist[r.climate!] ?? []),
        windowOpened: c.windowOpen || (!!r.window && wasOpen(hist[r.window] ?? [])),
        off: c.off,
        cur: c.cur,
        target: c.target,
      };
    }),
    pv,
    o,
  );
}
