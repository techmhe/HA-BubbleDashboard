import { I } from '../icons';
import type { CardConfig, HomeAssistant } from '../types';
import { ent } from './entities';
import type { NowItem } from './overview';
import type { Room } from './rooms';
import { entityArea, friendlyName, state } from './util';
import { isSnoozed, parseSnooze, snoozeValue } from './window-state';

/** Alarmo's websocket API is admin-only; other users skip the call. */
export function shouldLoadAlarmo(hass: Pick<HomeAssistant, 'user'>): boolean {
  return hass.user?.is_admin !== false;
}

/** One sensor of Alarmo's `alarmo/sensors` answer. */
export type AlarmoSensor = { entity_id: string; type: string; enabled: boolean };

const MAX_SINGLE = 3;
const GREY = { color: '#aeb4c0', tint: 'rgba(255,255,255,0.12)' };

type Kind = 'motion' | 'door' | 'window' | 'temperature' | 'other';

const TITLES: Record<Kind, string> = {
  motion: 'Bewegungsmelder prüfen',
  door: 'Türsensor prüfen',
  window: 'Fenstersensor prüfen',
  temperature: 'Temperatursensor prüfen',
  other: 'Sensor prüfen',
};

const ICONS: Record<Kind, string> = { motion: I.alert, door: I.door, window: I.window, temperature: I.thermo, other: I.alert };

/** Members of a group entity (its `entity_id` attribute). */
function members(hass: HomeAssistant, id: string): string[] {
  const m = hass.states[id]?.attributes.entity_id;
  return Array.isArray(m) ? m : [];
}

/**
 * Sensors that report `unavailable`: Alarmo sensors (except tamper), room temperatures, the front
 * door and `health.extra`, minus `health.exclude`, snoozed ones and the room windows the window
 * loop of `nowItems` already warns about. More than three collapse into one item.
 */
export function healthItems(hass: HomeAssistant, config: CardConfig, rooms: Room[], now: Date, alarmo: AlarmoSensor[]): NowItem[] {
  const frontDoor = ent(config, 'front_door');
  const alarmoType = new Map(alarmo.filter((a) => a.enabled && a.type !== 'tamper').map((a) => [a.entity_id, a.type]));

  const watched = new Map<string, Kind | 'alarmo'>();
  for (const id of alarmoType.keys()) watched.set(id, 'alarmo');
  for (const r of rooms) if (r.temperature) watched.set(r.temperature, 'temperature');
  if (frontDoor) watched.set(frontDoor, 'door');
  for (const id of config.health?.extra ?? []) if (!watched.has(id)) watched.set(id, 'alarmo');
  for (const id of config.health?.exclude ?? []) watched.delete(id);

  // Handled by the window loop, or covered by a group window that is down itself.
  const covered = new Set<string>();
  for (const r of rooms) {
    if (!r.window || r.window === frontDoor) continue;
    covered.add(r.window);
    if (state(hass, r.window) === 'unavailable') members(hass, r.window).forEach((m) => covered.add(m));
  }

  const snoozeId = ent(config, 'window_snooze');
  const snoozes = parseSnooze(hass.states[snoozeId]?.state);
  const kindOf = (id: string, source: Kind | 'alarmo'): Kind => {
    if (source !== 'alarmo') return source;
    const type = alarmoType.get(id);
    if (type === 'motion') return 'motion';
    if (type === 'window') return 'window';
    if (type === 'door') return /t(ü|u)r/i.test(`${id} ${friendlyName(hass, id)}`) ? 'door' : 'window';
    return 'other';
  };

  const found: { id: string; kind: Kind; where: string; room?: Room }[] = [];
  for (const [id, source] of watched) {
    if (covered.has(id) || state(hass, id) !== 'unavailable' || isSnoozed(snoozes, id, now.getTime())) continue;
    const area = entityArea(hass, id);
    const room = rooms.find((r) => r.temperature === id || r.window === id || (!!area && r.areas.includes(area)));
    found.push({ id, kind: kindOf(id, source), room, where: room?.name ?? (area && hass.areas[area]?.name) ?? friendlyName(hass, id) });
  }

  if (found.length > MAX_SINGLE) {
    return [{
      id: 'health-many', title: `${found.length} Sensoren offline`, text: found.map((f) => friendlyName(hass, f.id)).join(' · '),
      icon: I.alert, ...GREY, tap: { moreInfo: found[0].id },
    }];
  }
  const S = hass.states;
  return found.map((f) => ({
    id: `health:${f.id.split('.').pop()}`,
    title: TITLES[f.kind],
    text: `${f.where} · Sensor nicht erreichbar`,
    icon: ICONS[f.kind],
    ...GREY,
    tap: f.room ? { room: f.room.slug } : { moreInfo: f.id },
    action: S[snoozeId]
      ? {
          kind: 'service' as const, label: '1 h ignorieren', domain: 'input_text', service: 'set_value', target: { entity_id: snoozeId },
          data: { value: snoozeValue(S[snoozeId].state, f.id, now.getTime() + 3600_000, now.getTime()) },
        }
      : undefined,
  }));
}
