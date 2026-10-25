import type { Point } from './climate';

/**
 * Heating check: a room that keeps getting warmer although its thermostat does not call for
 * heat may have a stuck valve. Internal heat sources are ruled out first: an open window,
 * appliances in the room (room power, e.g. dryer or gaming PC), the sun (PV power) and a
 * shower (humidity jump).
 */
export interface HeatingCheckOptions {
  /** Window the rise is measured over. */
  hours: number;
  /** Minimum rise in K. */
  min_rise: number;
  /** Mean room power above which appliances explain the warmth (W). */
  max_power: number;
  /** Mean PV power above which the sun explains the warmth (W). */
  max_pv: number;
  /** Humidity rise (percentage points) that points to a shower or cooking. */
  max_hum_rise: number;
}

export const HEATING_CHECK_DEFAULTS: HeatingCheckOptions = { hours: 2, min_rise: 1, max_power: 150, max_pv: 300, max_hum_rise: 10 };

export interface HeatingRoomInput {
  slug: string;
  name: string;
  /** Temperature over the window, oldest first. */
  temps: Point[];
  hums: Point[];
  /** Mean room power over the window (W); 0 without a sensor. */
  power: number;
  /** The thermostat called for heat during the window (or shortly before). */
  heated: boolean;
  /** The window was open during the window (or shortly before). */
  windowOpened: boolean;
  off: boolean;
  cur: number | null;
  target: number | null;
}

export interface HeatingAlert {
  slug: string;
  name: string;
  /** Rise in K, one decimal. */
  rise: number;
  hours: number;
}

const MIN_POINTS = 6;

export function heatingAlerts(rooms: HeatingRoomInput[], pv: number, opts: Partial<HeatingCheckOptions> = {}): HeatingAlert[] {
  const o = { ...HEATING_CHECK_DEFAULTS, ...opts };
  if (pv > o.max_pv) return [];
  const out: HeatingAlert[] = [];
  for (const r of rooms) {
    if (r.temps.length < MIN_POINTS || r.heated || r.windowOpened || r.power > o.max_power) continue;
    if (!r.off && (r.cur === null || r.target === null || r.cur <= r.target)) continue;
    const last = r.temps[r.temps.length - 1].v;
    const low = Math.min(...r.temps.slice(0, -1).map((p) => p.v));
    const rise = Math.round((last - low) * 10) / 10;
    if (rise < o.min_rise) continue;
    if (r.hums.length && Math.max(...r.hums.map((p) => p.v)) - r.hums[0].v >= o.max_hum_rise) continue;
    out.push({ slug: r.slug, name: r.name, rise, hours: o.hours });
  }
  return out;
}

/** History rows (`history/history_during_period`, compressed): did the thermostat heat? */
export function wasHeating(rows: { s: string; a?: Record<string, unknown> }[]): boolean {
  return rows.some((r) => r.a?.hvac_action === 'heating');
}

/** History rows of a window/door sensor: was it open at any point? */
export function wasOpen(rows: { s: string }[]): boolean {
  return rows.some((r) => r.s === 'on');
}
