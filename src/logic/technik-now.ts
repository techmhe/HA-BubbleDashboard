import type { CardConfig, HomeAssistant } from '../types';
import { I } from '../icons';
import type { NowItem } from './overview';
import { clockOf, findPrinter, hoursClock, JOB_MAX_H, printerJob, printerState } from './printer';
import { isTechUser, pihole, services, technikProblems } from './technik';
import { fmt, num, state } from './util';

const PURPLE = ['#bf9bff', 'rgba(191,155,255,0.26)'] as const;
const GREEN = ['#30d158', 'rgba(48,209,88,0.24)'] as const;
const RED = ['#ff453a', 'rgba(255,69,58,0.28)'] as const;

/** Bed temperature below which a print can be taken off. */
export const BED_COOL_C = 35;

export interface TechnikItemCtx {
  dismissed(key: string): boolean;
  /** End of a Pi-hole pause started from this card (ms). */
  pauseUntil?: number;
}

function base(id: string, title: string, text: string, icon: string, c: readonly [string, string], tap: NowItem['tap']): NowItem {
  return { id, title, text, icon, color: c[0], tint: c[1], tap };
}

/** "18:20", or "gestern 18:20" / "22.10. 18:20" for older times. */
export function sinceText(ms: number, now: Date): string {
  const d = new Date(ms);
  const time = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const day = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((day(now) - day(d)) / 86_400_000);
  if (diff <= 0) return time;
  if (diff === 1) return `gestern ${time}`;
  return `${d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} ${time}`;
}

function printerItems(hass: HomeAssistant, config: CardConfig, now: Date, ctx: TechnikItemCtx): NowItem[] {
  const p = findPrinter(hass, config);
  if (!p) return [];
  const s = printerState(hass, p, now, ctx.dismissed);
  const name = state(hass, p.e.subtask_name);
  const job = valid(name) ? name : '3D-Druck';
  const pct = s.progress !== undefined ? `${fmt(Math.round(s.progress * 100))} %` : '';
  if (s.kind === 'printing') {
    const end = clockOf(state(hass, p.e.end_time));
    const rem = num(hass, p.e.remaining_time);
    return [{
      ...base('print', `3D-Druck${s.paused ? ' pausiert' : ''}${pct ? ` · ${pct}` : ''}`, [job, end ? `fertig um ${end}` : ''].filter(Boolean).join(' · '), s.paused ? I.pause : I.printer, PURPLE, 'printer'),
      progress: s.progress,
      value: rem !== null ? hoursClock(rem) : undefined,
    }];
  }
  if (s.kind === 'error') {
    const item = base('print-error', '3D-Druck angehalten', s.errorText ?? 'Fehler am Drucker', I.alert, RED, 'printer');
    if (s.failedOnly && s.jobKey) item.dismiss = { label: 'OK', key: `print-error:${s.jobKey}` };
    return [item];
  }
  if (s.kind === 'finished') {
    const j = printerJob(hass, p);
    if (j.at === undefined || now.getTime() - j.at >= JOB_MAX_H * 3600_000) return [];
    const key = `print-done:${j.key}`;
    if (ctx.dismissed(key)) return [];
    const bed = num(hass, p.e.bed_temp);
    const hint = bed !== null && bed >= BED_COOL_C ? `Bett ${fmt(Math.round(bed))}°, noch abkühlen` : 'kann entnommen werden';
    return [{ ...base('print-done', '3D-Druck fertig', `${job} · ${hint}`, I.check, GREEN, 'printer'), dismiss: { label: 'OK', key } }];
  }
  return [];
}

function valid(v: string | undefined): v is string {
  return !!v && v !== 'unknown' && v !== 'unavailable';
}

/** Technical "Aktuell" items, only for tech users; appended after the household items. */
export function technikItems(hass: HomeAssistant, config: CardConfig, now: Date, ctx: TechnikItemCtx): NowItem[] {
  if (!isTechUser(hass, config)) return [];
  const out = printerItems(hass, config, now, ctx);
  const down = services(hass, config, now).down;
  if (down.length === 1) {
    const d = down[0];
    const text = d.members ? d.text : d.text.replace(/^down /, '');
    out.push(base('services', `${d.name} nicht erreichbar`, text, I.server, RED, 'technik'));
  } else if (down.length > 1) {
    out.push(base('services', `${down.length} Dienste nicht erreichbar`, down.map((d) => d.name).join(' · '), I.server, RED, 'technik'));
  }
  const ph = pihole(hass, config, now, ctx.pauseUntil);
  if (ph?.problem && ph.offSince !== undefined) {
    out.push({
      ...base('pihole', 'Werbeblocker aus', `Pi-hole · seit ${sinceText(ph.offSince, now)}`, I.shieldOff, RED, 'technik'),
      action: { kind: 'service', label: 'Einschalten', domain: 'switch', service: 'turn_on', data: {}, target: { entity_id: ph.entity } },
    });
  }
  return out;
}


/** Problems for the red dot and the Technik headline (services down, Pi-hole off, printer error). */
export function technikProblemCount(hass: HomeAssistant, config: CardConfig, now: Date, ctx: TechnikItemCtx): number {
  const p = findPrinter(hass, config);
  const printerError = !!p && printerState(hass, p, now, ctx.dismissed).kind === 'error';
  return technikProblems(hass, config, now, printerError, ctx.pauseUntil);
}
