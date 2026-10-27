import type { CardConfig, HomeAssistant } from '../types';
import { ent } from './entities';
import { aqColor } from './overview';
import type { Room } from './rooms';
import { entityArea, fmt, num, state } from './util';


export const PRESETS = [
  { id: 'eco', name: 'Eco', color: '#30d158' },
  { id: 'comfort', name: 'Komfort', color: '#ff9f0a' },
  { id: 'boost', name: 'Boost', color: '#ff6b5e' },
  { id: 'frost', name: 'Frost', color: '#64d2ff' },
] as const;

export type PresetId = (typeof PRESETS)[number]['id'];

export interface RoomClimate {
  cur: number | null;
  target: number | null;
  hum: number | null;
  dew: number | null;
  heating: boolean;
  vent: boolean;
  /** Airing recommended (sensor "Jetzt lüften"); shown as an icon. */
  recommend: boolean;
  off: boolean;
  valve: number | null;
  preset: string | null;
  presetTemps: Partial<Record<PresetId, number>>;
  min: number;
  max: number;
  step: number;
  pm25: number | null;
  aq: string | null;
  fanOn: boolean;
  windowOpen: boolean;
  airing: string | undefined;
  /** "heizt" / "lüften" / "Soll erreicht" / "Aus" (never "ruht"). */
  label: string;
}

function presetTemps(raw: unknown): Partial<Record<PresetId, number>> {
  let obj: Record<string, unknown> = {};
  if (typeof raw === 'string') {
    try {
      obj = JSON.parse(raw);
    } catch {
      obj = {};
    }
  } else if (raw && typeof raw === 'object') obj = raw as Record<string, unknown>;
  const out: Partial<Record<PresetId, number>> = {};
  for (const p of PRESETS) {
    const v = Number(obj[`${p.id}_temp`]);
    if (Number.isFinite(v) && v > 0) out[p.id] = v;
  }
  return out;
}

export function roomClimate(hass: HomeAssistant, room: Room, targetOverride?: number): RoomClimate {
  const c = room.climate ? hass.states[room.climate] : undefined;
  const a = c?.attributes ?? {};
  const cur = num(hass, room.temperature) ?? (Number.isFinite(Number(a.current_temperature)) ? Number(a.current_temperature) : null);
  const rawHum = num(hass, room.humidity) ?? (Number.isFinite(Number(a.current_humidity)) ? Number(a.current_humidity) : null);
  const hum = rawHum === null ? null : Math.round(rawHum);
  const target = targetOverride ?? (Number.isFinite(Number(a.temperature)) ? Number(a.temperature) : null);
  const off = !c || c.state === 'off' || c.state === 'unavailable';
  const heating = !off && a.hvac_action === 'heating';
  const windowOpen = !!room.window && state(hass, room.window) === 'on';
  const airing = state(hass, room.airing);
  const recommend = airing === 'Jetzt lüften';
  const vent = recommend || windowOpen;
  const pm25 = room.pm25 ? num(hass, room.pm25) : null;
  const valve = Number.isFinite(Number(a.valve_open_percent)) ? Math.round(Number(a.valve_open_percent)) : null;
  return {
    cur,
    target,
    hum,
    dew: num(hass, `sensor.${room.slug}_taupunkt`),
    heating,
    vent,
    recommend,
    off,
    valve,
    preset: typeof a.preset_mode === 'string' && a.preset_mode !== 'none' ? a.preset_mode : null,
    presetTemps: presetTemps(a.preset_temperatures),
    min: Number(a.min_temp) || 7,
    max: Number(a.max_temp) || 30,
    step: Number(a.target_temp_step) || 0.5,
    pm25,
    aq: room.pm25 ? aqColor(pm25) : null,
    fanOn: !!room.purifier && state(hass, room.purifier) === 'on',
    windowOpen,
    airing,
    label: off ? 'Aus' : windowOpen ? 'lüftet' : heating ? 'heizt' : 'Soll erreicht',
  };
}

/** Clamp and snap a target temperature to the climate's limits and step. */
export function stepTarget(current: number, delta: number, min: number, max: number, step = 0.5): number {
  const v = Math.round((current + delta) / step) * step;
  return Math.min(max, Math.max(min, Math.round(v * 10) / 10));
}

export function temp(v: number | null, digits = 1): string {
  return v === null ? '–' : fmt(v, digits);
}

// ---------- floors ----------

export const FLOOR_NAMES: Record<string, string> = { OG: 'Obergeschoss', EG: 'Erdgeschoss', UG: 'Untergeschoss', DG: 'Dachgeschoss', KG: 'Keller' };

export interface FloorGroup {
  id: string;
  name: string;
  short: string;
  rooms: Room[];
}

export function floorGroups(hass: HomeAssistant, rooms: Room[]): FloorGroup[] {
  const groups = new Map<string, Room[]>();
  for (const r of rooms) {
    const f = r.floor ?? '';
    if (!groups.has(f)) groups.set(f, []);
    groups.get(f)!.push(r);
  }
  const level = (id: string) => hass.floors?.[id]?.level ?? -99;
  return [...groups.entries()]
    .sort(([a], [b]) => level(b) - level(a))
    .map(([id, rs]) => {
      const short = hass.floors?.[id]?.name ?? (id ? id.toUpperCase() : 'Weitere');
      return { id, short, name: FLOOR_NAMES[short] ?? short, rooms: rs };
    });
}

/** Floor of an entity via its area. */
export function entityFloor(hass: HomeAssistant, entityId: string): string | undefined {
  const a = entityArea(hass, entityId);
  return a ? (hass.areas[a]?.floor_id ?? undefined) : undefined;
}

export function average(values: (number | null)[]): number | null {
  const v = values.filter((x): x is number => x !== null);
  return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null;
}

// ---------- header + outdoor ----------

export function climateSummary(hass: HomeAssistant, rooms: Room[]): string {
  const cl = rooms.map((r) => roomClimate(hass, r));
  const heating = cl.filter((c) => c.heating).length;
  const pms = cl.map((c) => c.pm25).filter((x): x is number => x !== null);
  const worst = pms.length ? Math.max(...pms) : null;
  const air = worst === null ? '' : worst <= 12 ? 'Luft überall gut' : worst <= 35 ? 'Luft teils mäßig' : 'Luft schlecht';
  const first = heating ? `${heating} von ${rooms.length} Räumen heizen` : 'Kein Raum heizt';
  return air ? `${first} · ${air}` : first;
}

export function outdoor(hass: HomeAssistant, rooms: Room[], config: CardConfig) {
  const weatherId = ent(config, 'weather');
  const t = num(hass, ent(config, 'outdoor_temp')) ?? (Number(hass.states[weatherId]?.attributes.temperature) || null);
  const hRaw = hass.states[weatherId]?.attributes.humidity;
  const h = Number.isFinite(Number(hRaw)) ? Number(hRaw) : null;
  const dew = num(hass, ent(config, 'outdoor_dew'));
  const indoorDew = average(rooms.map((r) => num(hass, `sensor.${r.slug}_taupunkt`)));
  let compare = '';
  if (dew !== null && indoorDew !== null) compare = dew < indoorDew - 1 ? 'draußen trockener' : dew > indoorDew + 1 ? 'draußen feuchter' : 'ähnlich feucht';
  const title = [t !== null ? `Außen ${fmt(t, 1)}°` : 'Außen', h !== null ? `${fmt(Math.round(h))} %` : ''].filter(Boolean).join(' · ');
  const sub = [dew !== null ? `Taupunkt ${fmt(dew, 1)}°` : '', compare].filter(Boolean).join(' · ');
  return { title, sub, minutes: num(hass, ent(config, 'airing_duration')) };
}

// ---------- airing ----------

export interface AiringInfo {
  active: boolean;
  paused: boolean;
  /** Seconds left (active/paused) or the full duration (idle). */
  remaining: number;
  duration: number;
  openWindows: Room[];
  recommended: Room[];
}

export function parseDuration(s: unknown): number {
  if (typeof s !== 'string') return 0;
  const parts = s.split(':').map(Number);
  if (parts.some((p) => !Number.isFinite(p))) return 0;
  return parts.reduce((acc, p) => acc * 60 + p, 0);
}

export function airingInfo(hass: HomeAssistant, rooms: Room[], config: CardConfig, now: Date): AiringInfo {
  const t = hass.states[ent(config, 'airing_timer')];
  const durMin = num(hass, ent(config, 'airing_duration'));
  const duration = parseDuration(t?.attributes.duration) || (durMin ?? 15) * 60;
  let remaining = durMin !== null ? durMin * 60 : duration;
  const active = t?.state === 'active';
  const paused = t?.state === 'paused';
  if (active && t?.attributes.finishes_at) {
    remaining = Math.max(0, Math.round((new Date(t.attributes.finishes_at).getTime() - now.getTime()) / 1000));
  } else if (paused) {
    remaining = parseDuration(t?.attributes.remaining);
  }
  return {
    active,
    paused,
    remaining,
    duration: active || paused ? duration : remaining,
    openWindows: rooms.filter((r) => r.window && state(hass, r.window) === 'on'),
    recommended: rooms.filter((r) => state(hass, r.airing) === 'Jetzt lüften'),
  };
}

export function clock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ---------- all rooms ----------

/** Selection value for input_text.alle_raume_auswahl: vtherm suffixes, empty = all rooms. */
export function allRoomsSelection(rooms: Room[], selected: Set<string>): string {
  const chosen = rooms.filter((r) => selected.has(r.slug));
  if (chosen.length === rooms.length) return '';
  return chosen
    .map((r) => r.climate?.replace(/^climate\.vtherm_/, ''))
    .filter((x): x is string => !!x && !x.includes('.'))
    .join(',');
}

// ---------- history ----------

export interface Point {
  t: number;
  v: number;
}

/** Average raw history states into fixed buckets (hour or day). */
export function bucket(points: Point[], start: number, end: number, size: number): Point[] {
  const n = Math.ceil((end - start) / size);
  const sums = new Array(n).fill(0);
  const counts = new Array(n).fill(0);
  for (const p of points) {
    const i = Math.floor((p.t - start) / size);
    if (i < 0 || i >= n) continue;
    sums[i] += p.v;
    counts[i]++;
  }
  const out: Point[] = [];
  let last: number | null = null;
  for (let i = 0; i < n; i++) {
    if (counts[i]) last = sums[i] / counts[i];
    // carry the previous value forward: sensors only report on change
    if (last !== null) out.push({ t: start + i * size, v: last });
  }
  return out;
}

export interface ChartGeometry {
  line: string;
  area: string;
  last: { x: number; y: number } | null;
  lo: number;
  hi: number;
  y: (v: number) => number;
}

export function chart(points: Point[], width: number, top: number, bottom: number, padLo: number, padHi: number, snap: number): ChartGeometry {
  const vals = points.map((p) => p.v);
  const minV = vals.length ? Math.min(...vals) : 0;
  const maxV = vals.length ? Math.max(...vals) : 1;
  let lo = Math.floor((minV - padLo) / snap) * snap;
  let hi = Math.ceil((maxV + padHi) / snap) * snap;
  if (hi - lo < snap * 2) hi = lo + snap * 2;
  const y = (v: number) => Math.round((bottom - ((v - lo) / (hi - lo)) * (bottom - top)) * 10) / 10;
  const pts = points.map((p, i) => [Math.round((i / Math.max(1, points.length - 1)) * width * 10) / 10, y(p.v)] as const);
  const line = pts.map((p) => `${p[0]},${p[1]}`).join(' ');
  const area = pts.length ? `${line} ${pts[pts.length - 1][0]},${bottom} 0,${bottom}` : '';
  const lastP = pts[pts.length - 1];
  return { line, area, last: lastP ? { x: lastP[0], y: lastP[1] } : null, lo, hi, y };
}

/** Find the largest humidity drop (an airing) within 3 buckets; null if < 4 points. */
export function airingInsight(hum: Point[], tmp: Point[]): string | null {
  let best: { i: number; j: number; drop: number } | null = null;
  for (let i = 0; i < hum.length; i++) {
    for (let j = i + 1; j <= Math.min(i + 3, hum.length - 1); j++) {
      const drop = hum[i].v - hum[j].v;
      if (drop >= 4 && (!best || drop > best.drop)) best = { i, j, drop };
    }
  }
  if (!best) return null;
  const hour = new Date(hum[best.i].t).getHours();
  const when = hour < 11 ? 'Vormittags' : hour < 14 ? 'Mittags' : hour < 18 ? 'Nachmittags' : hour < 23 ? 'Abends' : 'Nachts';
  const from = Math.round(hum[best.i].v);
  const to = Math.round(hum[best.j].v);
  const t0 = tmp.find((p) => p.t === hum[best!.i].t)?.v;
  const lows = tmp.filter((p) => p.t >= hum[best!.i].t && p.t <= hum[best!.j].t + 3600_000).map((p) => p.v);
  const low = lows.length ? Math.min(...lows) : null;
  const cooled = t0 !== undefined && low !== null && t0 - low >= 0.5 ? `, Raum kurz auf ${fmt(low, 1)}° abgekühlt` : '';
  return `${when} gelüftet: Feuchte ${from} → ${to} %${cooled}.`;
}

export interface TimeChart {
  line: string;
  area: string;
  last: { x: number; y: number } | null;
  lo: number;
  hi: number;
  x: (t: number) => number;
  y: (v: number) => number;
}

/** Like chart(), but x follows time between start and end (for gaps, bars and past/future splits). */
export function timeChart(
  points: Point[], start: number, end: number, width: number, top: number, bottom: number,
  o: { padLo?: number; padHi?: number; snap?: number; zero?: boolean; extra?: number[]; max?: number } = {},
): TimeChart {
  const snap = o.snap ?? 1;
  const vals = [...points.map((p) => p.v), ...(o.extra ?? [])];
  const minV = o.zero ? 0 : vals.length ? Math.min(...vals) : 0;
  const maxV = vals.length ? Math.max(...vals) : 1;
  let lo = o.zero ? 0 : Math.floor((minV - (o.padLo ?? 0)) / snap) * snap;
  let hi = Math.ceil((maxV + (o.padHi ?? 0)) / snap) * snap;
  if (hi - lo < snap * 2) hi = lo + snap * 2;
  if (o.max !== undefined) hi = o.max; // fixed top, e.g. 100 % for shares
  const r = (n: number) => Math.round(n * 10) / 10;
  const x = (t: number) => r(((t - start) / Math.max(1, end - start)) * width);
  const y = (v: number) => r(bottom - ((v - lo) / (hi - lo)) * (bottom - top));
  const pts = points.map((p) => [x(p.t), y(p.v)] as const);
  const line = pts.map((p) => `${p[0]},${p[1]}`).join(' ');
  const area = pts.length ? `${line} ${pts[pts.length - 1][0]},${bottom} ${pts[0][0]},${bottom}` : '';
  const lastP = pts[pts.length - 1];
  return { line, area, last: lastP ? { x: lastP[0], y: lastP[1] } : null, lo, hi, x, y };
}

export interface AiringBand {
  from: number;
  to: number;
  level: 'now' | 'possible';
}

const AIRING_LEVEL: Record<string, AiringBand['level']> = { 'Jetzt lüften': 'now', 'Lüften möglich': 'possible' };

/**
 * Periods in which the room's airing sensor recommended airing ("Jetzt lüften") or allowed it
 * ("Lüften möglich"), from its history rows (`s` state, `lu` seconds), clipped to [start, end].
 */
export function airingBands(rows: { s: string; lu: number }[], start: number, end: number): AiringBand[] {
  const sorted = [...rows].sort((a, b) => a.lu - b.lu);
  const out: AiringBand[] = [];
  sorted.forEach((r, i) => {
    const level = AIRING_LEVEL[r.s];
    if (!level) return;
    const from = Math.max(start, Math.round(r.lu * 1000));
    const to = Math.min(end, i + 1 < sorted.length ? Math.round(sorted[i + 1].lu * 1000) : end);
    if (to <= from) return;
    const prev = out[out.length - 1];
    if (prev && prev.level === level && prev.to === from) prev.to = to;
    else out.push({ from, to, level });
  });
  return out;
}

export type AiringVerdict = { kind: 'running' } | { kind: 'ended'; at: number } | { kind: 'none' };

/**
 * Whether airing still pays off by the dew point: running while the latest "Jetzt lüften"
 * band reaches `end`, otherwise ended where that band stopped; none without such a band.
 */
export function airingVerdict(bands: AiringBand[], end: number): AiringVerdict {
  const last = [...bands].reverse().find((b) => b.level === 'now');
  if (!last) return { kind: 'none' };
  return last.to >= end ? { kind: 'running' } : { kind: 'ended', at: last.to };
}
