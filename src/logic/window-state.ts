import type { CardConfig, HomeAssistant } from '../types';
import type { Point } from './climate';
import { ent } from './entities';
import type { Room } from './rooms';
import { num, state } from './util';

/**
 * One airing state per room, shown the same way on Übersicht, Klima and the room card:
 * - recommend: airing recommended, window closed (blue wind icon)
 * - airing: window open and still useful, with the time left of the recommended duration
 * - overdue: open longer than the duration + grace, or airing no longer helps (red)
 * - stuck: the sensor says open but the room shows no sign of it, or it is unavailable (grey)
 * - open: open, but the warning was snoozed ("1 h ignorieren")
 */
export type WindowKind = 'none' | 'recommend' | 'airing' | 'overdue' | 'stuck' | 'open';

export interface WindowState {
  kind: WindowKind;
  /** Minutes since the window opened. */
  openMin: number;
  /** Seconds left of the recommended duration (airing). */
  remaining: number;
  reason?: 'Zeit um' | 'bringt nichts';
}

export const GRACE_MIN = 5;

/** Compact open time for pills: "33 min", "2 h". */
export function shortOpen(min: number): string {
  return min < 60 ? `${min} min` : `${Math.floor(min / 60)} h`;
}
export const STUCK_AFTER_MIN = 30;

export function windowState(
  hass: HomeAssistant, room: Room, config: CardConfig, now: Date, o: { stuck?: boolean; snoozed?: boolean } = {},
): WindowState {
  const w = room.window ? hass.states[room.window] : undefined;
  const airing = state(hass, room.airing);
  const none: WindowState = { kind: airing === 'Jetzt lüften' ? 'recommend' : 'none', openMin: 0, remaining: 0 };
  if (!w) return none;
  if (w.state === 'unavailable') return o.snoozed ? none : { ...none, kind: 'stuck' };
  if (w.state !== 'on') return none;
  const openSec = Math.max(0, Math.floor((now.getTime() - new Date(w.last_changed).getTime()) / 1000));
  const openMin = Math.floor(openSec / 60);
  const base = { openMin, remaining: 0 };
  if (o.stuck) return { ...base, kind: 'stuck' };
  if (o.snoozed) return { ...base, kind: 'open' };
  const dur = num(hass, ent(config, 'airing_duration')) ?? 15;
  if (airing === 'Nicht lüften' && openMin >= GRACE_MIN) return { ...base, kind: 'overdue', reason: 'bringt nichts' };
  if (openMin >= dur + GRACE_MIN) return { ...base, kind: 'overdue', reason: 'Zeit um' };
  return { ...base, kind: 'airing', remaining: Math.max(0, dur * 60 - openSec) };
}

// ---------- snooze ("1 h ignorieren"), kept in an input_text so every phone sees it ----------

const objectId = (entityId: string) => entityId.split('.').pop()!;

/** `object_id@until;…` with `until` in minutes since the epoch, base 36. */
export function parseSnooze(value: string | undefined): Record<string, number> {
  const out: Record<string, number> = {};
  for (const part of (value ?? '').split(';')) {
    const [id, until] = part.split('@');
    const min = parseInt(until ?? '', 36);
    if (id && Number.isFinite(min)) out[id] = min * 60_000;
  }
  return out;
}

export function isSnoozed(map: Record<string, number>, entityId: string, now: number): boolean {
  return (map[objectId(entityId)] ?? 0) > now;
}

/** New helper value with `entityId` snoozed until `until`; expired entries dropped, max 255 characters. */
export function snoozeValue(current: string | undefined, entityId: string, until: number, now: number): string {
  const id = objectId(entityId);
  // The new entry goes first, so it survives when the oldest ones must go.
  const entries = [[id, until] as const, ...Object.entries(parseSnooze(current)).filter(([k]) => k !== id)];
  const parts = entries
    .filter(([, t]) => t > now)
    .sort((a, b) => b[1] - a[1])
    .map(([id, t]) => `${id}@${Math.ceil(t / 60_000).toString(36)}`);
  while (parts.join(';').length > 255) parts.pop();
  return parts.join(';');
}

// ---------- stuck sensor ----------

/**
 * A window reported open shows in the room: it gets colder or the humidity moves. When it is
 * clearly colder outside (≥ 3 K) and neither happened since the window opened, the contact is
 * probably stuck.
 */
export function looksStuck(temps: Point[], hums: Point[], openedAt: number, outdoor: number | null): boolean {
  if (outdoor === null || temps.length < 4) return false;
  const before = [...temps].reverse().find((p) => p.t <= openedAt) ?? temps[0];
  const after = temps.filter((p) => p.t > openedAt);
  if (!after.length || before.v - outdoor < 3) return false;
  const drop = before.v - Math.min(...after.map((p) => p.v));
  const hv = hums.map((p) => p.v);
  const humMove = hv.length ? Math.max(...hv) - Math.min(...hv) : 0;
  return drop < 0.3 && humMove < 3;
}
