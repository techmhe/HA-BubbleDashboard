import type { CardConfig, HomeAssistant } from '../types';
import { FLOOR_NAMES } from './climate';
import { ent } from './entities';
import { ALARM_STATES } from './overview';
import type { Room } from './rooms';
import { entityArea } from './util';

export const ALARM_MODES = [
  { name: 'Abwesend', icon: 'car', service: 'alarm_arm_away', state: 'armed_away' },
  { name: 'Zuhause', icon: 'home', service: 'alarm_arm_home', state: 'armed_home' },
  { name: 'Nacht', icon: 'moon', service: 'alarm_arm_night', state: 'armed_night' },
  { name: 'Aus', icon: 'power', service: 'alarm_disarm', state: 'disarmed' },
] as const;

export function alarmLabel(state: string): string {
  if (state === 'disarmed') return 'Alarm unscharf';
  if (state === 'triggered') return 'Alarm ausgelöst!';
  return `Alarm: ${ALARM_STATES[state] ?? state}`;
}

export interface AlarmInfo {
  id: string;
  state: string;
  label: string;
  sub: string;
}

export function alarmInfo(hass: HomeAssistant, config: CardConfig, now: Date): AlarmInfo {
  const id = ent(config, 'alarm');
  const s = hass.states[id];
  const state = s?.state ?? 'unavailable';
  let sub = '';
  const last = s?.attributes.last_triggered;
  const lastDate = last ? new Date(String(last).replace(' ', 'T')) : undefined;
  if (lastDate && !Number.isNaN(lastDate.getTime())) {
    sub = `zuletzt ausgelöst ${lastDate.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}`;
  } else if (s?.last_changed) {
    const lc = new Date(s.last_changed);
    const sameDay = lc.toDateString() === now.toDateString();
    sub = `seit ${sameDay ? lc.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : lc.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}`;
  }
  return { id, state, label: alarmLabel(state), sub };
}

// ---------- windows & doors ----------

export const OPENING_CLASSES = ['window', 'door', 'opening', 'garage_door'];
/** Integrations whose "door"/"window" sensors are not house openings. */
export const OPENING_PLATFORMS_EXCLUDED = ['versatile_thermostat', 'bambu_lab'];
const SENSOR_WORDS = /^((fenster|tür|tur)sensor(en)?|sensor|contact|kontakt|fensterstatus|status)$/i;

export interface Opening {
  id: string;
  title: string;
  kind: 'window' | 'door';
  open: boolean;
  unavailable: boolean;
}

export interface OpeningArea {
  id: string;
  name: string;
  items: Opening[];
}

export interface OpeningFloor {
  id: string;
  name: string;
  areas: OpeningArea[];
}

function words(s: string): string[] {
  return s.toLowerCase().split(/[\s&,._\-]+/).filter(Boolean);
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function openingTitle(hass: HomeAssistant, id: string, areaId: string, kind: Opening['kind']): string {
  const fn = hass.states[id]?.attributes.friendly_name as string | undefined;
  const full = fn ?? id.split('.')[1].split('_').map(cap).join(' ');
  const area = hass.areas[areaId];
  const drop = new Set([...words(area?.name ?? ''), ...words(areaId)]);
  // A token goes when it is a sensor word or made only of area words ("1.OG" in "Flur 1.OG").
  const isAreaWord = (w: string) => {
    const parts = words(w);
    return parts.length > 0 && parts.every((p) => drop.has(p));
  };
  const kept = full.split(/\s+/).filter((w) => w && !SENSOR_WORDS.test(w) && !isAreaWord(w));
  const title = kept.join(' ').trim();
  if (!title || /^(fenster|tür|tur)$/i.test(title)) return kind === 'door' ? 'Tür' : 'Fenster';
  return title;
}

/**
 * Window and door contacts, grouped by floor (lowest first) and area. Groups,
 * thermostat-derived window states and excluded integrations are left out.
 */
export function openings(hass: HomeAssistant, config: CardConfig, rooms: Room[]): OpeningFloor[] {
  const exclude = new Set([...OPENING_PLATFORMS_EXCLUDED, ...(config.exclude?.openings ?? [])]);
  const byArea = new Map<string, Opening[]>();
  for (const [id, s] of Object.entries(hass.states)) {
    if (!id.startsWith('binary_sensor.') || !OPENING_CLASSES.includes(s.attributes.device_class)) continue;
    if (Array.isArray(s.attributes.entity_id)) continue; // group
    const reg = hass.entities[id];
    if (exclude.has(id) || (reg?.platform && exclude.has(reg.platform))) continue;
    const area = entityArea(hass, id);
    if (!area || !hass.areas[area]) continue;
    const name = String(s.attributes.friendly_name ?? id);
    const kind: Opening['kind'] = /t[üu]r|door|tor\b/i.test(name) || s.attributes.device_class === 'garage_door' ? 'door' : 'window';
    const unavailable = s.state === 'unavailable' || s.state === 'unknown';
    if (!byArea.has(area)) byArea.set(area, []);
    byArea.get(area)!.push({ id, title: openingTitle(hass, id, area, kind), kind, open: s.state === 'on', unavailable });
  }

  // Area order follows the rooms (configured order), other areas after.
  const roomOrder = rooms.flatMap((r) => r.areas);
  const rank = (a: string) => {
    const i = roomOrder.indexOf(a);
    return i < 0 ? roomOrder.length : i;
  };
  const floors = new Map<string, OpeningArea[]>();
  for (const area of [...byArea.keys()].sort((a, b) => rank(a) - rank(b))) {
    const floor = hass.areas[area]?.floor_id ?? '';
    if (!floors.has(floor)) floors.set(floor, []);
    // Single-area rooms use the room name (Büro Max), shared areas keep their own (Küche, Esszimmer).
    const room = rooms.find((r) => r.areas.length === 1 && r.areas[0] === area);
    floors.get(floor)!.push({ id: area, name: room?.name ?? hass.areas[area].name, items: byArea.get(area)! });
  }
  const level = (f: string) => (f ? (hass.floors?.[f]?.level ?? 50) : 99);
  return [...floors.entries()]
    .sort(([a], [b]) => level(a) - level(b))
    .map(([id, areas]) => {
      const short = id ? (hass.floors?.[id]?.name ?? id.toUpperCase()) : 'Weitere';
      return { id, name: FLOOR_NAMES[short] ?? short, areas };
    });
}

export function openingsSummary(floors: OpeningFloor[], alarmState: string): string {
  const items = floors.flatMap((f) => f.areas.flatMap((a) => a.items));
  const open = items.filter((i) => i.open).length;
  const counts = `${items.length - open} von ${items.length} zu`;
  if (alarmState === 'triggered') return `Alarm ausgelöst! · ${counts}`;
  return open ? `${open} offen · ${counts}` : `Alles ruhig · ${counts}`;
}
