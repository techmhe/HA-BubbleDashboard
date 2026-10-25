import type { CardConfig, HomeAssistant } from '../types';
import { technikConfig } from './technik';
import { durationText, fmt, minutesSince, num, state } from './util';

/** 3D printer (HACS ha-bambulab) found by translation keys, so entity ids may be in any language. */

export const NOZZLE_LOCK_C = 50;
export const START_GRACE_MIN = 5;
export const JOB_MAX_H = 12;

const KEYS = [
  'print_status', 'stage', 'print_progress', 'remaining_time', 'end_time', 'current_layer', 'total_layers',
  'subtask_name', 'print_weight', 'speed_profile', 'left_nozzle_temp', 'right_nozzle_temp', 'nozzle_temp',
  'bed_temp', 'chamber_temp', 'hms_errors', 'print_error', 'online', 'door_open', 'chamber_light', 'cover_image',
] as const;
export type PrinterKey = (typeof KEYS)[number];

export interface Printer {
  device: string;
  e: Partial<Record<PrinterKey, string>>;
  /** AMS device id. */
  ams?: string;
  plug?: string;
  plugPower?: string;
  plugEnergy?: string;
  controls: { pause?: string; resume?: string; stop?: string; camera?: string };
}

export type PrinterKind = 'off' | 'starting' | 'disconnected' | 'error' | 'printing' | 'finished' | 'idle';

export interface PrinterState {
  kind: PrinterKind;
  paused: boolean;
  /** Error only because the print ended as `failed` (dismissable). */
  failedOnly: boolean;
  /** Identifies the current/last job (end time), for dismissals. */
  jobKey?: string;
  errorText?: string;
  /** 0–1 */
  progress?: number;
  /** Head subtitle, e.g. "Druckt · Drucken". */
  status: string;
}

export interface AmsSlot {
  color?: string;
  type: string;
  name: string;
  active: boolean;
  empty: boolean;
  remain?: number;
}

export function findPrinter(hass: HomeAssistant, config: CardConfig): Printer | null {
  const t = technikConfig(config);
  if (!t) return null;
  const bambu = Object.values(hass.entities).filter((r) => r.platform === 'bambu_lab');
  const device = t.printer ?? bambu.find((r) => r.translation_key === 'print_status' && r.device_id)?.device_id ?? undefined;
  if (!device) return null;
  const own = bambu.filter((r) => r.device_id === device);
  const e: Printer['e'] = {};
  for (const r of own) {
    const k = r.translation_key as PrinterKey;
    if (k && (KEYS as readonly string[]).includes(k) && !e[k]) e[k] = r.entity_id;
  }
  if (!e.print_status) return null;
  const ams = bambu.find((r) => r.translation_key === 'tray' && r.device_id)?.device_id ?? undefined;
  const controls: Printer['controls'] = {};
  for (const r of own) {
    const k = r.translation_key ?? '';
    if (r.entity_id.startsWith('button.')) {
      if (/resume/.test(k)) controls.resume ??= r.entity_id;
      else if (/pause/.test(k)) controls.pause ??= r.entity_id;
      else if (/stop/.test(k)) controls.stop ??= r.entity_id;
    } else if (r.entity_id.startsWith('camera.')) controls.camera ??= r.entity_id;
  }
  return { device, e, ams, plug: t.printer_plug, plugPower: t.printer_plug_power, plugEnergy: t.printer_plug_energy, controls };
}

const PRINTING = new Set(['running', 'prepare', 'init', 'slicing', 'pause']);
const OFFLINE = new Set(['offline', 'unavailable', 'unknown']);

/** Translated state of an entity (HA's formatter), falling back to the raw state. */
export function label(hass: HomeAssistant, entityId: string | undefined): string {
  const s = entityId ? hass.states[entityId] : undefined;
  if (!s) return '';
  try {
    return hass.formatEntityState?.(s) ?? s.state;
  } catch {
    return s.state;
  }
}

function valid(v: string | undefined): v is string {
  return !!v && v !== 'unknown' && v !== 'unavailable';
}

/** Job identity and its time: the end time, or the status change when HA has no end time. */
export function printerJob(hass: HomeAssistant, p: Printer): { key?: string; at?: number } {
  const end = state(hass, p.e.end_time);
  if (valid(end) && Number.isFinite(Date.parse(end))) return { key: end, at: Date.parse(end) };
  const lc = hass.states[p.e.print_status!]?.last_changed;
  return lc ? { key: lc, at: Date.parse(lc) } : {};
}

/** First HMS error text without its code, else the print error text. */
export function printerErrorText(hass: HomeAssistant, p: Printer): string {
  const hms = hass.states[p.e.hms_errors ?? '']?.attributes ?? {};
  const first = hms['1-Error'];
  if (typeof first === 'string' && first.trim()) return first.replace(/^[A-Z0-9_]+:\s*/, '').trim();
  const pe = hass.states[p.e.print_error ?? '']?.attributes?.error;
  if (typeof pe === 'string' && pe.trim()) return pe.trim();
  return 'Fehler am Drucker';
}

export function printerState(hass: HomeAssistant, p: Printer, now: Date, dismissed: (key: string) => boolean): PrinterState {
  const raw = state(hass, p.e.print_status);
  const base = { paused: false, failedOnly: false };
  const plug = p.plug ? state(hass, p.plug) : undefined;
  if (plug === 'off') return { ...base, kind: 'off', status: 'Aus' };
  if (!raw || OFFLINE.has(raw)) {
    if (plug === 'on' && minutesSince(hass, p.plug!, now) < START_GRACE_MIN) return { ...base, kind: 'starting', status: 'startet …' };
    return { ...base, kind: 'disconnected', status: 'nicht verbunden' };
  }
  const job = printerJob(hass, p);
  const progress = num(hass, p.e.print_progress);
  const extra = { jobKey: job.key, progress: progress === null ? undefined : progress / 100 };
  const flagged = state(hass, p.e.hms_errors) === 'on' || state(hass, p.e.print_error) === 'on';
  if (flagged) return { ...base, ...extra, kind: 'error', errorText: printerErrorText(hass, p), status: 'Fehler' };
  if (raw === 'failed') {
    const recent = job.at !== undefined && now.getTime() - job.at < JOB_MAX_H * 3600_000;
    if (recent && !dismissed(`print-error:${job.key}`)) {
      return { ...base, ...extra, kind: 'error', failedOnly: true, errorText: printerErrorText(hass, p), status: 'Fehler' };
    }
    return { ...base, ...extra, kind: 'idle', status: 'Bereit' };
  }
  if (PRINTING.has(raw)) {
    const paused = raw === 'pause';
    return { ...base, ...extra, kind: 'printing', paused, status: `${paused ? 'Pausiert' : 'Druckt'} · ${label(hass, p.e.stage)}` };
  }
  if (raw === 'finish') return { ...base, ...extra, kind: 'finished', status: 'Fertig' };
  return { ...base, ...extra, kind: 'idle', status: 'Bereit' };
}

/** Highest nozzle temperature, or null when unknown. */
export function nozzleMax(hass: HomeAssistant, p: Printer): number | null {
  const temps = [p.e.left_nozzle_temp, p.e.right_nozzle_temp, p.e.nozzle_temp].map((id) => num(hass, id)).filter((v): v is number => v !== null);
  return temps.length ? Math.max(...temps) : null;
}

/** The plug must not be switched off while printing, in an error or with a hot nozzle. */
export function powerLocked(hass: HomeAssistant, p: Printer, s: PrinterState): boolean {
  if (s.kind === 'printing' || s.kind === 'error') return true;
  return (nozzleMax(hass, p) ?? 0) >= NOZZLE_LOCK_C;
}

function amsEntities(hass: HomeAssistant, p: Printer) {
  return p.ams ? Object.values(hass.entities).filter((r) => r.device_id === p.ams && r.platform === 'bambu_lab' && hass.states[r.entity_id]) : [];
}

export function amsSlots(hass: HomeAssistant, p: Printer): AmsSlot[] {
  const trays = amsEntities(hass, p).filter((r) => r.translation_key === 'tray').map((r) => hass.states[r.entity_id]);
  trays.sort((a, b) => (Number(a.attributes.slot) || 0) - (Number(b.attributes.slot) || 0) || a.entity_id.localeCompare(b.entity_id));
  return trays.map((s) => {
    const a = s.attributes;
    const empty = a.empty === true || s.state === 'Empty';
    const color = typeof a.color === 'string' && /^#[0-9a-f]{6}/i.test(a.color) && !empty ? a.color.slice(0, 7) : undefined;
    return {
      color,
      type: empty ? '' : String(a.type ?? ''),
      name: empty ? 'leer' : String(a.name ?? s.state),
      active: a.active === true,
      empty,
      remain: !empty && a.remain_enabled && Number.isFinite(Number(a.remain)) ? Number(a.remain) : undefined,
    };
  });
}

/** AMS headline: drying time while it dries, else the humidity. */
export function amsNote(hass: HomeAssistant, p: Printer): string {
  const ents = amsEntities(hass, p);
  const id = (k: string) => ents.find((r) => r.translation_key === k)?.entity_id;
  if (state(hass, id('drying')) === 'on') {
    const h = num(hass, id('remaining_drying_time'));
    return h === null ? 'trocknet' : `trocknet · noch ${durationText(Math.round(h * 60))}`;
  }
  const hum = num(hass, id('humidity'));
  return hum === null ? '' : `${fmt(Math.round(hum))} % Feuchte`;
}

/** Remaining hours as "1:12 h". */
export function hoursClock(hours: number): string {
  const m = Math.max(0, Math.round(hours * 60));
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')} h`;
}

/** Local time HH:MM of a timestamp state. */
export function clockOf(iso: string | undefined): string | undefined {
  if (!valid(iso)) return undefined;
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return undefined;
  return new Date(t).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}
