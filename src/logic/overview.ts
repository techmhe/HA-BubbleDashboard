import type { CardConfig, HomeAssistant } from '../types';
import { I, roomIcon, weatherIcon } from '../icons';
import type { Room } from './rooms';
import { ent, filterAlarmIds, scriptService } from './entities';
import { weatherWarnings } from './weather';
import { airingInfo, clock } from './climate';
import { deviceName, durationText, fmt, friendlyName, minutesSince, num, state } from './util';

export const DEVICE_LABEL = 'dashboard_gerat';

const STORM_KMH = 60;
const WINDOW_OPEN_MIN = 20;
const DOOR_OPEN_MIN = 5;
const BATTERY_LOW = 15;
const FILTER_LIFE_LOW = 10;

// ---------- header ----------

export function greeting(now: Date): string {
  const h = now.getHours();
  if (h >= 5 && h < 11) return 'Guten Morgen';
  if (h >= 11 && h < 18) return 'Guten Tag';
  if (h >= 18 && h < 23) return 'Guten Abend';
  return 'Gute Nacht';
}

export function dateLine(now: Date): string {
  return now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
}

const CONDITIONS: Record<string, string> = {
  'clear-night': 'Klar',
  cloudy: 'Bewölkt',
  exceptional: 'Unwetter',
  fog: 'Nebel',
  hail: 'Hagel',
  lightning: 'Gewitter',
  'lightning-rainy': 'Gewitter',
  partlycloudy: 'Heiter',
  pouring: 'Starkregen',
  rainy: 'Regen',
  snowy: 'Schnee',
  'snowy-rainy': 'Schneeregen',
  sunny: 'Sonnig',
  windy: 'Windig',
  'windy-variant': 'Windig',
};

export function weatherInfo(hass: HomeAssistant, entityId: string) {
  const w = hass.states[entityId];
  const t = w ? Number(w.attributes.temperature) : NaN;
  return {
    temp: Number.isFinite(t) ? `${fmt(Math.round(t))}°` : '–',
    label: w ? (CONDITIONS[w.state] ?? w.state) : 'Wetter',
    icon: weatherIcon(w?.state ?? ''),
  };
}

// ---------- status bubbles ----------

/** Icon of the armed mode (like the mode buttons); the shield when disarmed, triggered or unknown. */
export function alarmIcon(state: string): string {
  const icons: Record<string, string> = { armed_away: I.car, armed_vacation: I.car, armed_home: I.home, armed_night: I.moon };
  return icons[state] ?? I.shield;
}

export type StatusKey = 'robby' | 'light' | 'energy' | 'alarm';

export interface StatusBubble {
  key: StatusKey;
  value: string;
  label: string;
  icon: string;
  color: string;
}

const VACUUM_STATES: Record<string, string> = {
  docked: 'Dockt',
  cleaning: 'Saugt',
  returning: 'Fährt heim',
  paused: 'Pause',
  idle: 'Bereit',
  error: 'Fehler',
  unavailable: 'Offline',
};

export const ALARM_STATES: Record<string, string> = {
  disarmed: 'Aus',
  armed_away: 'Abwesend',
  armed_home: 'Zuhause',
  armed_night: 'Nacht',
  armed_vacation: 'Urlaub',
  armed_custom_bypass: 'Scharf',
  arming: 'Wird scharf',
  pending: 'Countdown',
  triggered: 'Alarm!',
  unavailable: 'Offline',
};

/** Lights shown on the dashboard: labelled `dashboard_gerat`; falls back to all non-group lights. */
export function dashboardLights(hass: HomeAssistant): string[] {
  const lights = Object.keys(hass.states).filter(
    (id) => id.startsWith('light.') && !Array.isArray(hass.states[id].attributes.entity_id) && !hass.entities[id]?.hidden,
  );
  const labelled = lights.filter((id) => hass.entities[id]?.labels?.includes(DEVICE_LABEL));
  return labelled.length ? labelled : lights;
}

export function lightsOn(hass: HomeAssistant): string[] {
  return dashboardLights(hass).filter((id) => hass.states[id].state === 'on');
}

export function gridPower(hass: HomeAssistant, config: CardConfig): { value: string; label: string } {
  const imp = num(hass, ent(config, 'grid_import')) ?? 0;
  const exp = num(hass, ent(config, 'grid_export')) ?? 0;
  if (exp > imp && exp > 0) return { value: `${fmt(Math.round(exp))} W`, label: 'Einspeisung' };
  return { value: `${fmt(Math.round(imp))} W`, label: 'Netzbezug' };
}

export function statusBubbles(hass: HomeAssistant, config: CardConfig): StatusBubble[] {
  const vac = state(hass, ent(config, 'vacuum')) ?? 'unavailable';
  const alarm = state(hass, ent(config, 'alarm')) ?? 'unavailable';
  const grid = gridPower(hass, config);
  return [
    { key: 'robby', value: VACUUM_STATES[vac] ?? vac, label: 'Robby', icon: I.vacuum, color: vac === 'error' ? '#ff453a' : '#ffffff' },
    { key: 'light', value: `${lightsOn(hass).length} an`, label: 'Licht', icon: I.bulb, color: '#ffd60a' },
    { key: 'energy', value: grid.value, label: grid.label, icon: I.bolt, color: grid.label === 'Einspeisung' ? '#30d158' : '#ff9f0a' },
    { key: 'alarm', value: ALARM_STATES[alarm] ?? alarm, label: 'Alarm', icon: alarmIcon(alarm), color: alarm === 'triggered' ? '#ff453a' : '#bf9bff' },
  ];
}

// ---------- "Aktuell" ----------

export type NowAction =
  | { kind: 'service'; label: string; domain: string; service: string; data: Record<string, unknown>; target?: { entity_id: string | string[] } }
  | { kind: 'none' };

export type NowTap = 'airing' | 'weather' | 'robby' | 'alarm' | 'rooms' | 'care' | { moreInfo: string } | null;

export interface NowItem {
  id: string;
  title: string;
  text: string;
  icon: string;
  color: string;
  tint: string;
  action?: NowAction & { kind: 'service' };
  tap: NowTap;
}

const C = {
  blue: ['#5ac8fa', 'rgba(90,200,250,0.3)'],
  purple: ['#bf9bff', 'rgba(191,155,255,0.26)'],
  orange: ['#ff9f0a', 'rgba(255,159,10,0.26)'],
  green: ['#7ee8a0', 'rgba(126,232,160,0.18)'],
  red: ['#ff453a', 'rgba(255,69,58,0.3)'],
  yellow: ['#ffd60a', 'rgba(255,214,10,0.22)'],
} as const;

function item(id: string, title: string, text: string, icon: string, c: readonly [string, string], tap: NowTap, action?: NowItem['action']): NowItem {
  return { id, title, text, icon, color: c[0], tint: c[1], tap, action };
}

const isOpen = (hass: HomeAssistant, id?: string) => !!id && state(hass, id) === 'on';

export function nowItems(hass: HomeAssistant, config: CardConfig, rooms: Room[], now: Date): NowItem[] {
  const out: NowItem[] = [];
  const S = hass.states;
  const frontDoor = ent(config, 'front_door');

  // Alarm triggered
  const alarmId = ent(config, 'alarm');
  if (state(hass, alarmId) === 'triggered') {
    out.push(item('alarm', 'Alarm ausgelöst', 'Jetzt prüfen', I.shield, C.red, 'alarm'));
  }

  // Front door open > 5 min
  if (isOpen(hass, frontDoor) && minutesSince(hass, frontDoor, now) >= DOOR_OPEN_MIN) {
    out.push(item('door', 'Haustür offen', `seit ${durationText(minutesSince(hass, frontDoor, now))}`, I.door, C.red, { moreInfo: frontDoor }));
  }

  // Official DWD warnings in force; current gusts as fallback without them
  const warnings = weatherWarnings(hass, config, now).filter((w) => w.current);
  const gust = num(hass, ent(config, 'gusts'));
  if (warnings.length) {
    const [top, ...rest] = warnings;
    const text = [top.when, ...rest.map((w) => `${w.title} ${w.when}`)].filter(Boolean).join(' · ');
    out.push(item('warn', `${top.level >= 3 ? 'Unwetterwarnung' : 'Warnung'}: ${top.title}`, text, I.storm, [top.color, `${top.color}44`], 'weather'));
  } else if (gust !== null && gust >= STORM_KMH) {
    out.push(item('storm', 'Sturmböen', `Böen bis ${fmt(Math.round(gust))} km/h`, I.storm, C.purple, 'weather'));
  }

  // Airing
  const timer = S[ent(config, 'airing_timer')];
  if (timer && timer.state === 'active') {
    const a = airingInfo(hass, rooms, config, now);
    const open = a.openWindows.map((r) => r.name);
    const text = [`noch ${clock(a.remaining)}`, open.length ? `${open.join(', ')} offen` : ''].filter(Boolean).join(' · ');
    out.push(item('airing', 'Lüften läuft', text, I.wind, C.blue, 'airing'));
  } else {
    const recommend = rooms.filter((r) => state(hass, r.airing) === 'Jetzt lüften');
    if (recommend.length) {
      const parts = recommend.map((r) => {
        const h = num(hass, r.humidity);
        return h === null ? r.name : `${r.name} ${fmt(Math.round(h))} %`;
      });
      const dur = num(hass, ent(config, 'airing_duration'));
      if (dur !== null) parts.push(`${fmt(Math.round(dur))} min`);
      out.push(
        item('airing', 'Jetzt lüften', parts.join(' · '), I.wind, C.blue, 'airing', {
          kind: 'service', label: 'Start', domain: scriptService(ent(config, 'airing_start'))[0], service: scriptService(ent(config, 'airing_start'))[1], data: {},
        }),
      );
    }
  }

  // Windows open > 20 min (front door handled above)
  const longOpen = rooms
    .filter((r) => r.window && r.window !== frontDoor && isOpen(hass, r.window))
    .map((r) => ({ r, min: minutesSince(hass, r.window!, now) }))
    .filter((x) => x.min >= WINDOW_OPEN_MIN);
  if (longOpen.length) {
    const title = longOpen.length === 1 ? 'Fenster offen' : `${longOpen.length} Fenster offen`;
    const text = longOpen.map((x) => `${x.r.name} ${durationText(x.min)}`).join(' · ');
    out.push(item('windows', title, text, I.window, C.blue, 'airing'));
  }

  // Appliances done
  for (const id of Object.keys(S).filter((k) => /^input_boolean\..+_fertig$/.test(k))) {
    if (S[id].state !== 'on') continue;
    const name = friendlyName(hass, id).replace(/\s*fertig$/i, '');
    out.push(
      item(id, `${name} fertig`, 'Bitte ausräumen', I.washer, C.green, null, {
        kind: 'service', label: 'OK', domain: 'input_boolean', service: 'turn_off', data: {}, target: { entity_id: id },
      }),
    );
  }

  // Robby error / maintenance
  const vacId = ent(config, 'vacuum');
  const vacState = state(hass, vacId);
  const vacStatus = state(hass, ent(config, 'vacuum_status'));
  if (vacState === 'error' || vacStatus === 'error') {
    const err = S[vacId]?.attributes.error ?? S[vacId]?.attributes.status ?? 'Bitte prüfen';
    out.push(item('robby-error', 'Robby: Fehler', String(err), I.vacuum, C.red, 'robby'));
  }
  const due = robbyMaintenance(hass, vacId);
  if (due.length) {
    out.push(item('robby-due', 'Robby: Wartung fällig', `${joinDe(due)} reinigen`, I.vacuum, C.orange, 'robby'));
  }

  // Waste: day before and day of collection
  const waste = wasteItem(hass, config, now);
  if (waste) out.push(waste);

  // Filters
  const filters = filterAlarms(hass, config);
  if (filters.length) {
    out.push(item('filter', 'Filter prüfen', filters.join(' · '), I.filter, C.yellow, 'care'));
  }

  // Batteries
  const low = lowBatteries(hass);
  if (low.length) {
    out.push(
      item('battery', low.length === 1 ? 'Batterie schwach' : `${low.length} Batterien schwach`,
        low.map((b) => `${b.name} ${fmt(b.level)} %`).join(' · '), I.battery, C.orange,
        'care'),
    );
  }

  return out;
}

function joinDe(parts: string[]): string {
  if (parts.length <= 1) return parts.join('');
  return `${parts.slice(0, -1).join(', ')} & ${parts[parts.length - 1]}`;
}

/** Consumables of the vacuum (`sensor.*robby*_minutes`) at or below zero. */
export function robbyMaintenance(hass: HomeAssistant, vacuumId: string): string[] {
  const key = vacuumId.split('.')[1];
  const names: [RegExp, string][] = [
    [/filter/, 'Filter'],
    [/sensor/, 'Sensoren'],
    [/haupt/, 'Hauptbürste'],
    [/seiten/, 'Seitenbürste'],
  ];
  const out: string[] = [];
  for (const id of Object.keys(hass.states)) {
    if (!id.startsWith('sensor.') || !id.includes(key) || !id.endsWith('_minutes')) continue;
    const v = num(hass, id);
    if (v === null || v > 0) continue;
    const rest = id.slice(7).replace(/^sensor_/, '');
    const label = names.find(([re]) => re.test(rest))?.[1] ?? friendlyName(hass, id);
    if (!out.includes(label)) out.push(label);
  }
  const order = ['Filter', 'Sensoren', 'Hauptbürste', 'Seitenbürste'];
  return [...order.filter((o) => out.includes(o)), ...out.filter((o) => !order.includes(o))];
}

function localIsoDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function wasteItem(hass: HomeAssistant, config: CardConfig, now: Date): NowItem | null {
  const wasteId = ent(config, 'waste');
  const w = hass.states[wasteId];
  if (!w) return null;
  const days = Number(w.attributes.daysTo);
  if (!Number.isFinite(days) || days < 0 || days > 1) return null;
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  const types = w.attributes[localIsoDate(date)];
  return item('waste', days === 0 ? 'Müll heute' : 'Müll morgen', typeof types === 'string' ? types : 'Abfuhr', I.trash, C.green, { moreInfo: wasteId });
}

export function filterAlarms(hass: HomeAssistant, config: CardConfig): string[] {
  const out: string[] = [];
  for (const id of filterAlarmIds(config)) {
    if (state(hass, id) === 'on') out.push(deviceName(hass, id) ?? friendlyName(hass, id));
  }
  for (const id of Object.keys(hass.states)) {
    if (!id.startsWith('sensor.') || !id.endsWith('filter_life')) continue;
    const v = num(hass, id);
    if (v !== null && v < FILTER_LIFE_LOW) out.push(`${deviceName(hass, id) ?? friendlyName(hass, id)} ${fmt(v)} %`);
  }
  return out;
}

export function lowBatteries(hass: HomeAssistant): { id: string; name: string; level: number }[] {
  const out: { id: string; name: string; level: number }[] = [];
  for (const [id, s] of Object.entries(hass.states)) {
    if (!id.startsWith('sensor.') || s.attributes.device_class !== 'battery') continue;
    if (/robby|phone|iphone|handy|pixel|ipad|watch|_plus$/.test(id)) continue;
    const v = num(hass, id);
    if (v === null || v >= BATTERY_LOW) continue;
    const name = deviceName(hass, id) ?? friendlyName(hass, id).replace(/\s*(Batterie|Battery)$/i, '');
    out.push({ id, name, level: v });
  }
  return out.sort((a, b) => a.level - b.level);
}

// ---------- "Zusammenfassung" ----------

export interface RoomSummary {
  room: Room;
  icon: string;
  temp: string;
  hum: string;
  heating: boolean;
  vent: boolean;
  aq: string | null;
}

export function aqColor(pm25: number | null): string | null {
  if (pm25 === null) return null;
  if (pm25 <= 12) return '#30d158';
  if (pm25 <= 35) return '#ffd60a';
  return '#ff453a';
}

export function roomSummaries(hass: HomeAssistant, rooms: Room[]): RoomSummary[] {
  return rooms.map((room) => {
    const t = num(hass, room.temperature) ?? (room.climate ? Number(hass.states[room.climate]?.attributes.current_temperature) : NaN);
    const h = num(hass, room.humidity);
    return {
      room,
      icon: roomIcon(room.name, room.icon),
      temp: t !== null && Number.isFinite(t) ? fmt(t, 1) : '–',
      hum: h !== null ? fmt(Math.round(h)) : '–',
      heating: !!room.climate && hass.states[room.climate]?.attributes.hvac_action === 'heating',
      vent: state(hass, room.airing) === 'Jetzt lüften',
      aq: room.pm25 ? aqColor(num(hass, room.pm25)) : null,
    };
  });
}


/** Items that keep a full-width row: urgent ones, so their text stays readable. */
const WIDE = new Set(['alarm', 'door', 'warn']);

/**
 * Two-column layout for "Aktuell": urgent and actionable items full width first, the rest as
 * half tiles in their order; a lone half tile at the end takes the full width.
 */
export function nowLayout(items: NowItem[]): { item: NowItem; wide: boolean }[] {
  const wide = items.filter((i) => i.action || WIDE.has(i.id));
  const half = items.filter((i) => !wide.includes(i));
  return [
    ...wide.map((item) => ({ item, wide: true })),
    ...half.map((item, i) => ({ item, wide: half.length % 2 === 1 && i === half.length - 1 })),
  ];
}
