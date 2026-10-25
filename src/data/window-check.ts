import type { Point } from '../logic/climate';
import { ent } from '../logic/entities';
import type { Room } from '../logic/rooms';
import { num } from '../logic/util';
import { looksStuck, STUCK_AFTER_MIN } from '../logic/window-state';
import type { CardConfig, HomeAssistant } from '../types';

type StatRow = { start: number | string; mean?: number | null };
const BEFORE = 15 * 60_000;
const MAX_LOOKBACK = 6 * 3600_000;

/** Rooms whose window has been open ≥ 30 min, the key that changes when that set changes. */
export function longOpenRooms(hass: HomeAssistant, rooms: Room[], now: number): Room[] {
  return rooms.filter((r) => {
    const w = r.window ? hass.states[r.window] : undefined;
    return w?.state === 'on' && now - new Date(w.last_changed).getTime() >= STUCK_AFTER_MIN * 60_000;
  });
}

/** Slugs of rooms whose open window looks stuck (one statistics request for the open ones). */
export async function loadStuckWindows(hass: HomeAssistant, rooms: Room[], config: CardConfig, now = Date.now()): Promise<string[]> {
  const open = longOpenRooms(hass, rooms, now);
  const outdoor = num(hass, ent(config, 'outdoor_temp'));
  if (!open.length || outdoor === null) return [];
  const opened = (r: Room) => new Date(hass.states[r.window!].last_changed).getTime();
  const start = Math.max(Math.min(...open.map(opened)) - BEFORE, now - MAX_LOOKBACK);
  const stats = await hass.callWS<Record<string, StatRow[]>>({
    type: 'recorder/statistics_during_period',
    start_time: new Date(start).toISOString(),
    end_time: new Date(now).toISOString(),
    statistic_ids: open.flatMap((r) => [r.temperature, r.humidity]),
    period: '5minute',
    types: ['mean'],
  });
  const points = (id: string, from: number): Point[] =>
    (stats[id] ?? [])
      .map((r) => ({ t: typeof r.start === 'number' ? r.start : Date.parse(r.start), v: Number(r.mean) }))
      .filter((p) => Number.isFinite(p.v) && p.t >= from);
  return open
    .filter((r) => {
      const at = opened(r);
      return looksStuck(points(r.temperature, at - BEFORE), points(r.humidity, at - BEFORE).filter((p) => p.t > at), at, outdoor);
    })
    .map((r) => r.slug);
}
