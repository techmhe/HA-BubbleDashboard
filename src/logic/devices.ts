import type { HomeAssistant } from '../types';
import type { Room } from './rooms';
import { entityArea, fmt, friendlyName } from './util';

export const DEVICE_LABEL = 'dashboard_gerat';

function words(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[\s&,.\-_]+/)
    .filter((w) => w.length > 1);
}

/** Friendly name with room words removed ("Stehlampe Wohnzimmer" -> "Stehlampe"). */
export function displayName(hass: HomeAssistant, entityId: string, room?: Room, overrides?: Record<string, string>): string {
  if (overrides?.[entityId]) return overrides[entityId];
  const full = friendlyName(hass, entityId);
  if (!room) return full;
  const roomWords = new Set([
    ...words(room.name),
    ...room.areas.flatMap((a) => words(hass.areas[a]?.name ?? a)),
    ...words(room.slug),
  ]);
  const kept = full.split(/\s+/).filter((w) => !roomWords.has(w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')));
  const out = kept.join(' ').replace(/^[\s\-–·]+|[\s\-–·]+$/g, '');
  return out || full;
}

function hasLabel(hass: HomeAssistant, entityId: string, label: string): boolean {
  const reg = hass.entities[entityId];
  if (reg?.labels?.includes(label)) return true;
  const dev = reg?.device_id ? (hass.devices[reg.device_id] as { labels?: string[] } | undefined) : undefined;
  return !!dev?.labels?.includes(label);
}

export type SheetKind = 'light' | 'switch' | 'purifier' | 'dehumidifier';

export interface DeviceInfo {
  id: string;
  name: string;
  on: boolean;
  unavailable: boolean;
  status: string;
  kind: 'light' | 'fan' | 'humidifier' | 'switch' | 'other';
  /** Short state for the Räume tile: "An", "Aus", "100 %", "18 W", "n. v.". */
  tileState: string;
  power: PowerInfo | null;
  sheet: SheetKind;
}

export interface PowerInfo {
  id: string;
  value: number | null;
}

/** Which long-press sheet a device gets. On/off-only lights use the switch sheet. */
export function sheetKind(hass: HomeAssistant, id: string): SheetKind {
  const a = hass.states[id]?.attributes ?? {};
  if (id.startsWith('light.')) return lightCaps(a).brightness ? 'light' : 'switch';
  if (id.startsWith('fan.')) return Array.isArray(a.preset_modes) && a.preset_modes.length ? 'purifier' : 'switch';
  if (id.startsWith('humidifier.')) return 'dehumidifier';
  return 'switch';
}

// ---------- power ----------

const powerIndexCache = new WeakMap<object, Map<string, string[]>>();

/** device_id -> power sensor ids, built once per entity registry object. */
function powerIndex(hass: HomeAssistant): Map<string, string[]> {
  const cached = powerIndexCache.get(hass.entities);
  if (cached) return cached;
  const idx = new Map<string, string[]>();
  for (const e of Object.values(hass.entities)) {
    if (!e.device_id || !e.entity_id.startsWith('sensor.') || !/_power$/.test(e.entity_id)) continue;
    if (!idx.has(e.device_id)) idx.set(e.device_id, []);
    idx.get(e.device_id)!.push(e.entity_id);
  }
  powerIndexCache.set(hass.entities, idx);
  return idx;
}

function numeric(hass: HomeAssistant, id: string): number | null {
  const s = hass.states[id]?.state;
  if (s === undefined || s === '' || s === 'unknown' || s === 'unavailable') return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** Current power of a device: its measured `*_power` sensor, else Powercalc's `*_device_power`. */
export function devicePower(hass: HomeAssistant, id: string): PowerInfo | null {
  const dev = hass.entities[id]?.device_id;
  let candidates = dev ? (powerIndex(hass).get(dev) ?? []).filter((p) => hass.states[p]) : [];
  if (!candidates.length) {
    const guess = `sensor.${id.split('.')[1]}_power`;
    if (hass.states[guess]) candidates = [guess];
  }
  if (!candidates.length) return null;
  const measured = candidates.filter((p) => !/_device_power$/.test(p));
  const pick = measured.find((p) => numeric(hass, p) !== null) ?? measured[0] ?? candidates[0];
  return { id: pick, value: numeric(hass, pick) };
}

export function watts(v: number): string {
  return `${fmt(v, v > 0 && v < 10 && v % 1 ? 1 : 0)} W`;
}

function tileState(hass: HomeAssistant, id: string, power: PowerInfo | null): string {
  const s = hass.states[id];
  if (!s || s.state === 'unavailable' || s.state === 'unknown') return 'n. v.';
  if (s.state !== 'on') return 'Aus';
  const b = Number(s.attributes.brightness);
  if (id.startsWith('light.') && s.attributes.brightness != null && Number.isFinite(b)) return `${Math.max(1, Math.round((b / 255) * 100))} %`;
  if (!id.startsWith('light.') && power?.value != null && power.value >= 1) return watts(power.value);
  return 'An';
}

// ---------- lights ----------

export interface LightCaps {
  brightness: boolean;
  colorTemp: { min: number; max: number } | null;
  color: boolean;
  effects: string[];
}

const COLOR_MODES = ['hs', 'xy', 'rgb', 'rgbw', 'rgbww'];

export function lightCaps(a: Record<string, any>): LightCaps {
  const modes: string[] = Array.isArray(a.supported_color_modes) ? a.supported_color_modes : [];
  const ct = modes.includes('color_temp');
  return {
    brightness: modes.some((m) => m !== 'onoff'),
    colorTemp: ct ? { min: Number(a.min_color_temp_kelvin) || 2000, max: Number(a.max_color_temp_kelvin) || 6500 } : null,
    color: modes.some((m) => COLOR_MODES.includes(m)),
    effects: Array.isArray(a.effect_list) ? a.effect_list : [],
  };
}

export function lightTone(a: Record<string, any>): string | undefined {
  if (COLOR_MODES.includes(a.color_mode)) return 'farbig';
  if (a.color_mode !== 'color_temp') return undefined;
  const k = Number(a.color_temp_kelvin);
  if (!Number.isFinite(k)) return undefined;
  return k < 3300 ? 'warmweiß' : k < 5000 ? 'neutralweiß' : 'kaltweiß';
}

export interface LightPreset {
  name: string;
  data: Record<string, unknown>;
}

export function lightPresets(caps: LightCaps): LightPreset[] {
  if (!caps.brightness) return [];
  const ct = (k: number) => (caps.colorTemp ? { color_temp_kelvin: Math.min(caps.colorTemp.max, Math.max(caps.colorTemp.min, k)) } : {});
  const out: LightPreset[] = [
    { name: 'Lesen', data: { brightness_pct: 100, ...ct(4000) } },
    { name: 'Gemütlich', data: { brightness_pct: 40, ...ct(2700) } },
  ];
  if (caps.effects.includes('colorloop')) out.push({ name: 'Farbschleife', data: { effect: 'colorloop' } });
  return out;
}

// ---------- purifier ----------

export interface PurifierState {
  mode: 'auto' | 'sleep' | 'manual' | 'off';
  level: number | null;
  levels: number;
}

export function purifierState(state: string, a: Record<string, any>): PurifierState {
  const step = Number(a.percentage_step) || 100 / 3;
  const levels = Math.max(1, Math.round(100 / step));
  if (state !== 'on') return { mode: 'off', level: null, levels };
  if (a.preset_mode === 'auto' || a.preset_mode === 'sleep') return { mode: a.preset_mode, level: null, levels };
  const pct = Number(a.percentage);
  return { mode: 'manual', level: Number.isFinite(pct) && pct > 0 ? Math.max(1, Math.round(pct / step)) : null, levels };
}

export const DEHUMIDIFIER_MODES: Record<string, string> = {
  manual: 'Manuell',
  continuous: 'Dauer',
  auto: 'Auto',
  clothes_dry: 'Wäsche',
  shoes_dry: 'Schuhe',
};

export function deviceStatus(hass: HomeAssistant, id: string): string {
  const s = hass.states[id];
  if (!s || s.state === 'unavailable' || s.state === 'unknown') return 'Nicht erreichbar';
  const on = s.state === 'on';
  if (!on) return 'Aus';
  const a = s.attributes;
  if (id.startsWith('light.') && Number.isFinite(Number(a.brightness))) return `An · ${Math.round((Number(a.brightness) / 255) * 100)} %`;
  if (id.startsWith('fan.') && a.preset_mode) return `An · ${String(a.preset_mode).toLowerCase()}`;
  if (id.startsWith('humidifier.') && Number.isFinite(Number(a.humidity))) return `An · ${a.humidity} %`;
  return 'An';
}

export function roomDevices(hass: HomeAssistant, room: Room, overrides?: Record<string, string>): DeviceInfo[] {
  const ids = Object.keys(hass.states).filter(
    (id) => hasLabel(hass, id, DEVICE_LABEL) && room.areas.includes(entityArea(hass, id) ?? ''),
  );
  if (room.purifier && hass.states[room.purifier] && !ids.includes(room.purifier)) ids.unshift(room.purifier);
  return ids.map((id) => {
    const domain = id.split('.')[0];
    const st = hass.states[id]?.state;
    const power = devicePower(hass, id);
    return {
      tileState: tileState(hass, id, power),
      power,
      sheet: sheetKind(hass, id),
      id,
      name: displayName(hass, id, room, overrides),
      on: st === 'on',
      unavailable: !st || st === 'unavailable' || st === 'unknown',
      status: deviceStatus(hass, id),
      kind: (['light', 'fan', 'humidifier', 'switch'].includes(domain) ? domain : 'other') as DeviceInfo['kind'],
    };
  });
}

export interface SceneInfo {
  id: string;
  name: string;
  icon?: string;
  off: boolean;
}

export function roomScenes(hass: HomeAssistant, room: Room): SceneInfo[] {
  return Object.keys(hass.states)
    .filter((id) => id.startsWith('scene.') && room.areas.includes(entityArea(hass, id) ?? ''))
    .map((id) => {
      const off = /_off$|_aus$/.test(id);
      return {
        id,
        name: off ? 'Alles aus' : displayName(hass, id, room),
        icon: hass.states[id].attributes.icon,
        off,
      };
    })
    .sort((a, b) => Number(a.off) - Number(b.off));
}


/** Stored entity states of a scene (from config/scene/config/<id>), keyed by entity_id. */
export type SceneConfig = Record<string, { state?: string; brightness?: number }>;

const BRIGHTNESS_TOLERANCE = 13; // ~5 %

/**
 * Scenes that are "on": every entity still matches the stored scene state. Without the scene
 * config (non-admin, YAML scenes) the last activated scene counts while its entities stayed untouched.
 */
export function activeScenes(hass: HomeAssistant, sceneIds: string[], configs: Record<string, SceneConfig | undefined>, now: Date): Set<string> {
  const out = new Set<string>();
  const activated = (id: string) => Date.parse(hass.states[id]?.state ?? '');
  for (const id of sceneIds) {
    const cfg = configs[id];
    if (!cfg) continue;
    const entries = Object.entries(cfg).filter(([e]) => hass.states[e]);
    const match = entries.length > 0 && entries.every(([e, want]) => {
      const live = hass.states[e];
      if (want.state && live.state !== want.state) return false;
      const b = Number(live.attributes.brightness);
      if (want.state === 'on' && want.brightness !== undefined && Number.isFinite(b)) return Math.abs(b - want.brightness) <= BRIGHTNESS_TOLERANCE;
      return true;
    });
    if (match) out.add(id);
  }
  const newest = sceneIds
    .filter((id) => Number.isFinite(activated(id)) && activated(id) <= now.getTime())
    .sort((a, b) => activated(b) - activated(a))[0];
  if (newest && !configs[newest]) {
    const members: string[] = hass.states[newest].attributes.entity_id ?? [];
    const limit = activated(newest) + 10_000;
    if (members.length && members.every((e) => !hass.states[e] || Date.parse(hass.states[e].last_changed) <= limit)) out.add(newest);
  }
  return out;
}

type Rgb = [number, number, number];
const clamp255 = (v: number) => Math.round(Math.min(255, Math.max(0, v)));

/** Approximate colour of a black body at `k` kelvin (Tanner Helland). */
function kelvinRgb(k: number): Rgb {
  const t = k / 100;
  const r = t <= 66 ? 255 : 329.698727446 * Math.pow(t - 60, -0.1332047592);
  const g = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * Math.pow(t - 60, -0.0755148492);
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  return [clamp255(r), clamp255(g), clamp255(b)];
}

/** Hue/saturation (HA's hs_color) at full value. */
function hsRgb(h: number, s: number): Rgb {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return 255 * (1 - (s / 100) * Math.max(0, Math.min(k, 4 - k, 1)));
  };
  return [clamp255(f(5)), clamp255(f(3)), clamp255(f(1))];
}

/** The colour a light shows right now: its colour, or its white tone; null for dimmer-only lights. */
export function lightRgb(a: Record<string, any>): Rgb | null {
  if (COLOR_MODES.includes(a.color_mode)) {
    if (Array.isArray(a.rgb_color) && a.rgb_color.length === 3) return a.rgb_color.map(Number) as Rgb;
    if (Array.isArray(a.hs_color)) return hsRgb(Number(a.hs_color[0]), Number(a.hs_color[1]));
    return null;
  }
  if (a.color_mode === 'color_temp') {
    const k = Number(a.color_temp_kelvin);
    return Number.isFinite(k) && k > 0 ? kelvinRgb(k) : null;
  }
  return null;
}

/** Fill for the brightness bar in that colour, and an icon colour that stays readable on it. */
export function lightFill([r, g, b]: Rgb): { fill: string; icon: string } {
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return {
    fill: `linear-gradient(90deg, rgba(${r},${g},${b},0.35), rgb(${r},${g},${b}))`,
    icon: lum > 0.5 ? '#2b2200' : '#fff',
  };
}
