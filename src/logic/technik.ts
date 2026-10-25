import type { CardConfig, HomeAssistant, TechnikConfig } from '../types';
import { durationText, fmt, friendlyName, minutesSince, num } from './util';

/** The `technik` options, or null when the feature is switched off. */
export function technikConfig(config: CardConfig): TechnikConfig | null {
  if (config.technik === false) return null;
  return config.technik ?? {};
}

/** Users listed in `technik.users` (by id or name), or admins when no list is set. */
export function isTechUser(hass: HomeAssistant, config: CardConfig): boolean {
  const t = technikConfig(config);
  const user = hass.user;
  if (!t || !user) return false;
  if (!t.users) return !!user.is_admin;
  const keys = [user.id, user.name].filter(Boolean).map((k) => k!.toLowerCase());
  return t.users.some((u) => keys.includes(String(u).toLowerCase()));
}

// ---------- Uptime Kuma ----------

export const SERVICE_DOWN_MIN = 3;
export const CERT_WARN_DAYS = 7;
const DEFAULT_GROUPS: Record<string, string> = { DNS: '^DNS\\b' };

export type ServiceKind = 'down' | 'pending' | 'cert' | 'ok';

export interface ServiceRow {
  name: string;
  kind: ServiceKind;
  text: string;
  /** Group rows: number of monitors and how many are down. */
  members?: number;
  down?: number;
}

export interface Services {
  /** Down, pending and certificate rows, in that order. */
  problems: ServiceRow[];
  /** Rows without a problem, by name. */
  ok: ServiceRow[];
  /** Monitors (not rows) without a problem. */
  okMonitors: number;
  total: number;
  /** Rows that count as a problem (red dot, Aktuell). */
  down: ServiceRow[];
}

interface Monitor {
  name: string;
  kind: ServiceKind;
  text: string;
  certDays?: number;
}

/** Uptime Kuma monitors: every `uptime_kuma` sensor with translation_key `status`, named after its device. */
function monitors(hass: HomeAssistant, config: CardConfig, now: Date): Monitor[] {
  const exclude = new Set(technikConfig(config)?.services_exclude ?? []);
  const regs = Object.values(hass.entities).filter((e) => e.platform === 'uptime_kuma');
  const out: Monitor[] = [];
  for (const reg of regs) {
    if (reg.translation_key !== 'status') continue;
    const st = hass.states[reg.entity_id];
    if (!st) continue;
    const dev = reg.device_id ? hass.devices[reg.device_id] : undefined;
    const name = dev?.name_by_user || dev?.name || friendlyName(hass, reg.entity_id).replace(/\s*Status$/, '');
    if (exclude.has(name)) continue;
    const certId = regs.find((r) => r.device_id && r.device_id === reg.device_id && r.translation_key === 'cert_days_remaining')?.entity_id;
    const certDays = num(hass, certId) ?? undefined;
    const mins = minutesSince(hass, reg.entity_id, now);
    let m: Monitor;
    if (st.state === 'down' && mins >= SERVICE_DOWN_MIN) m = { name, kind: 'down', text: `down seit ${durationText(mins)}` };
    else if (st.state === 'down' || st.state === 'pending' || st.state === 'unavailable' || st.state === 'unknown') m = { name, kind: 'pending', text: 'prüft …' };
    else if (st.state === 'up' && certDays !== undefined && certDays < CERT_WARN_DAYS) m = { name, kind: 'cert', text: `Zertifikat ${fmt(Math.floor(certDays))} Tage` };
    else m = { name, kind: 'ok', text: '' };
    m.certDays = certDays;
    out.push(m);
  }
  return out;
}

const RANK: Record<ServiceKind, number> = { down: 0, pending: 1, cert: 2, ok: 3 };

function groupRegexes(config: CardConfig): [string, RegExp][] {
  const groups = technikConfig(config)?.service_groups ?? DEFAULT_GROUPS;
  const out: [string, RegExp][] = [];
  for (const [name, src] of Object.entries(groups)) {
    try {
      out.push([name, new RegExp(src)]);
    } catch {
      // invalid pattern: skip this group
    }
  }
  return out;
}

export function services(hass: HomeAssistant, config: CardConfig, now: Date): Services {
  const all = monitors(hass, config, now);
  const groups = groupRegexes(config);
  const rows: ServiceRow[] = [];
  const grouped = new Set<Monitor>();
  for (const [name, re] of groups) {
    const members = all.filter((m) => !grouped.has(m) && re.test(m.name));
    if (!members.length) continue;
    members.forEach((m) => grouped.add(m));
    const downCount = members.filter((m) => m.kind === 'down').length;
    const worst = members.reduce((a, b) => (RANK[b.kind] < RANK[a.kind] ? b : a));
    const text = worst.kind === 'down' ? `${downCount} von ${members.length} down` : worst.text;
    rows.push({ name, kind: worst.kind, text, members: members.length, down: downCount });
  }
  for (const m of all) if (!grouped.has(m)) rows.push({ name: m.name, kind: m.kind, text: m.text });
  const byName = (a: ServiceRow, b: ServiceRow) => a.name.localeCompare(b.name, 'de');
  const problems = rows.filter((r) => r.kind !== 'ok').sort((a, b) => RANK[a.kind] - RANK[b.kind] || byName(a, b));
  return {
    problems,
    ok: rows.filter((r) => r.kind === 'ok').sort(byName),
    okMonitors: all.filter((m) => m.kind === 'ok').length,
    total: all.length,
    down: problems.filter((r) => r.kind === 'down'),
  };
}

// ---------- Pi-hole ----------

/** Off longer than the longest pause (1 h) plus time for the integration to poll. */
export const PIHOLE_PROBLEM_MIN = 70;

export interface PiholeState {
  entity: string;
  kind: 'on' | 'off' | 'paused';
  /** Share of blocked queries today (%), whole numbers; one decimal below 1 %. */
  percent?: number;
  /** Off since (ms). */
  offSince?: number;
  remainingSec?: number;
  problem: boolean;
}

function platformEntities(hass: HomeAssistant, platform: string) {
  return Object.values(hass.entities).filter((e) => e.platform === platform);
}

export function piholeEntity(hass: HomeAssistant, config: CardConfig): string | undefined {
  const t = technikConfig(config);
  if (!t) return undefined;
  return t.pihole ?? platformEntities(hass, 'pi_hole').find((e) => e.entity_id.startsWith('switch.'))?.entity_id;
}

export function pihole(hass: HomeAssistant, config: CardConfig, now: Date, pauseUntil?: number): PiholeState | null {
  const entity = piholeEntity(hass, config);
  const st = entity ? hass.states[entity] : undefined;
  if (!entity || !st || (st.state !== 'on' && st.state !== 'off')) return null;
  if (st.state === 'on') {
    const pctId = platformEntities(hass, 'pi_hole').find((e) => e.translation_key === 'percent_ads_blocked')?.entity_id;
    const pct = num(hass, pctId);
    return { entity, kind: 'on', percent: pct === null ? undefined : pct < 1 ? Math.round(pct * 10) / 10 : Math.round(pct), problem: false };
  }
  if (pauseUntil && pauseUntil > now.getTime()) {
    return { entity, kind: 'paused', remainingSec: Math.ceil((pauseUntil - now.getTime()) / 1000), problem: false };
  }
  return { entity, kind: 'off', offSince: new Date(st.last_changed).getTime(), problem: minutesSince(hass, entity, now) >= PIHOLE_PROBLEM_MIN };
}

// ---------- Guest WLAN ----------

export interface GuestWifi {
  entity: string;
  on: boolean;
  clients?: number;
  /** image entity with the QR code (only when enabled in HA). */
  qr?: string;
  /** button entity that regenerates the password (only when enabled in HA). */
  regenerate?: string;
}

export function guestWifi(hass: HomeAssistant, config: CardConfig): GuestWifi | null {
  const t = technikConfig(config);
  if (!t) return null;
  const unifi = platformEntities(hass, 'unifi');
  const entity = t.guest_wifi ?? unifi.find((e) => e.translation_key === 'wlan_control' && e.entity_id.includes('guest'))?.entity_id
    ?? unifi.find((e) => e.translation_key === 'wlan_control' && /gast|gaest|gäst/.test(e.entity_id))?.entity_id;
  const st = entity ? hass.states[entity] : undefined;
  if (!entity || !st) return null;
  const device = hass.entities[entity]?.device_id;
  const siblings = device ? Object.values(hass.entities).filter((e) => e.device_id === device && hass.states[e.entity_id]) : [];
  const pick = (key: string, domain: string) =>
    (siblings.find((e) => e.translation_key === key) ?? siblings.find((e) => e.entity_id.startsWith(`${domain}.`)))?.entity_id;
  const clients = num(hass, pick('wlan_clients', 'sensor'));
  return {
    entity,
    on: st.state === 'on',
    clients: clients === null ? undefined : clients,
    qr: pick('qr_code', 'image'),
    regenerate: pick('regenerate_password', 'button'),
  };
}

// ---------- Summary ----------

/** True when any technical source exists (printer, Pi-hole, guest WLAN or a monitor). */
export function hasTechnik(hass: HomeAssistant, config: CardConfig): boolean {
  const t = technikConfig(config);
  if (!t) return false;
  const printer = !!t.printer || platformEntities(hass, 'bambu_lab').some((e) => e.translation_key === 'print_status');
  return printer || !!piholeEntity(hass, config) || !!guestWifi(hass, config) || services(hass, config, new Date()).total > 0;
}

/** Problems for the red dot and the sheet headline. */
export function technikProblems(hass: HomeAssistant, config: CardConfig, now: Date, printerError: boolean, pauseUntil?: number): number {
  return services(hass, config, now).down.length + (pihole(hass, config, now, pauseUntil)?.problem ? 1 : 0) + (printerError ? 1 : 0);
}
