import type { CardConfig, HomeAssistant } from '../types';
import { DEVICE_LABEL, roomDevices, roomScenes, type DeviceInfo, type SceneInfo } from './devices';
import { complete, type Room } from './rooms';
import { entityArea, num } from './util';

export const ROOM_POWER_LABEL = 'raumverbrauch';
const IGNORE_POWER_LABEL = 'raumverbrauch_ignorieren';

export interface RoomView {
  room: Room;
  devices: DeviceInfo[];
  scenes: SceneInfo[];
  onCount: number;
  lightsOn: number;
  sub: string;
  /** Any light on: the card gets the yellow glow. */
  active: boolean;
  power: number | null;
  floorShort?: string;
}

/**
 * Rooms for the Räume page: the climate rooms plus any other area that holds a
 * device with the `dashboard_gerat` label (e.g. Garten). Upper floors first (OG before EG),
 * rooms without a floor last.
 */
export function roomsView(hass: HomeAssistant, config: CardConfig, rooms: Room[]): RoomView[] {
  const covered = new Set(rooms.flatMap((r) => r.areas));
  const extraAreas: string[] = [];
  for (const [id, reg] of Object.entries(hass.entities)) {
    if (!hass.states[id] || !hasDeviceLabel(hass, id, reg.labels)) continue;
    const a = entityArea(hass, id);
    if (a && hass.areas[a] && !covered.has(a) && !extraAreas.includes(a)) extraAreas.push(a);
  }
  const all = [...rooms, ...extraAreas.map((a) => complete(hass, { slug: a, areas: [a] }))];
  const level = (r: Room) => {
    const l = r.floor ? hass.floors?.[r.floor]?.level : undefined;
    return l ?? Number.NEGATIVE_INFINITY;
  };
  const sorted = all.map((r, i) => ({ r, i })).sort((a, b) => level(b.r) - level(a.r) || a.i - b.i).map((x) => x.r);

  return sorted.map((room) => {
    const devices = roomDevices(hass, room, config.names);
    const onCount = devices.filter((d) => d.on).length;
    const lightsOn = devices.filter((d) => d.on && d.kind === 'light').length;
    const floorShort = room.floor ? (hass.floors?.[room.floor]?.name ?? room.floor.toUpperCase()) : undefined;
    const count = !devices.length ? 'keine Geräte' : onCount ? `${onCount} von ${devices.length} an` : 'alles aus';
    return {
      room,
      devices,
      scenes: roomScenes(hass, room),
      onCount,
      lightsOn,
      sub: floorShort ? `${floorShort} · ${count}` : count,
      active: lightsOn > 0,
      power: roomPower(hass, room),
      floorShort,
    };
  });
}

function hasDeviceLabel(hass: HomeAssistant, id: string, labels?: string[]): boolean {
  if (labels?.includes(DEVICE_LABEL)) return true;
  const dev = hass.entities[id]?.device_id;
  return !!(dev && (hass.devices[dev] as { labels?: string[] } | undefined)?.labels?.includes(DEVICE_LABEL));
}

/**
 * Current room power. Config `power:` wins; otherwise `sensor.<slug>_leistung`
 * (or one per area), else the sum of sensors named after parts of the slug
 * (kuche_esszimmer = kuche + esszimmer).
 */
export function roomPower(hass: HomeAssistant, room: Room): number | null {
  let ids = room.power;
  if (!ids?.length) {
    const sensors = powerSensors(hass);
    const own = `sensor.${room.slug}_leistung`;
    if (sensors.has(own)) ids = [own];
    else {
      const keys = [...room.areas, ...room.slug.split('_').filter((p) => p.length > 3)];
      ids = [...new Set(keys.map((k) => `sensor.${k}_leistung`).filter((id) => sensors.has(id)))];
    }
  }
  const values = ids.map((id) => num(hass, id)).filter((v): v is number => v !== null);
  return values.length ? values.reduce((a, b) => a + b, 0) : null;
}

/** Room power sensors: labelled `raumverbrauch` if any carry the label, else every `sensor.*_leistung`. */
function powerSensors(hass: HomeAssistant): Set<string> {
  const ids = Object.keys(hass.states).filter((id) => /^sensor\..+_leistung$/.test(id));
  const labels = (id: string) => hass.entities[id]?.labels ?? [];
  const labelled = ids.filter((id) => labels(id).includes(ROOM_POWER_LABEL));
  return new Set((labelled.length ? labelled : ids).filter((id) => !labels(id).includes(IGNORE_POWER_LABEL)));
}

export function roomsHeader(views: RoomView[]): string {
  const lights = views.reduce((n, v) => n + v.lightsOn, 0);
  const other = views.reduce((n, v) => n + v.onCount - v.lightsOn, 0);
  if (!lights && !other) return 'Alles aus';
  const parts = [];
  if (lights) parts.push(`${lights} ${lights === 1 ? 'Licht' : 'Lichter'}`);
  if (other) parts.push(`${other} ${other === 1 ? 'Gerät' : 'Geräte'}`);
  return `${parts.join(' · ')} an`;
}

export interface RoomsFilter {
  id: string;
  label: string;
}

/** Alle, An, then one per floor that has rooms (highest level first). */
export function roomsFilters(hass: HomeAssistant, views: RoomView[]): RoomsFilter[] {
  const floors = [...new Set(views.map((v) => v.room.floor).filter((f): f is string => !!f))];
  floors.sort((a, b) => (hass.floors?.[b]?.level ?? -99) - (hass.floors?.[a]?.level ?? -99));
  return [
    { id: 'all', label: 'Alle' },
    { id: 'on', label: 'An' },
    ...floors.map((f) => ({ id: f, label: hass.floors?.[f]?.name ?? f.toUpperCase() })),
  ];
}

export function applyRoomsFilter(views: RoomView[], filter: string): RoomView[] {
  if (filter === 'all') return views;
  // "An": only what is on, plus the room's "Alles aus" scene to switch it all off.
  if (filter === 'on') {
    return views
      .filter((v) => v.onCount > 0)
      .map((v) => ({ ...v, devices: v.devices.filter((d) => d.on), scenes: v.scenes.filter((s) => s.off) }));
  }
  return views.filter((v) => v.room.floor === filter);
}

/** Minutes from now until the next occurrence of "HH:MM" (1..1440). */
export function minutesUntil(now: Date, hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  let diff = Math.round((target.getTime() - now.getTime()) / 60000);
  if (diff <= 0) diff += 1440;
  return diff;
}
