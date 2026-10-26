import type { CardConfig, HomeAssistant } from '../types';
import { friendlyName, num } from './util';

/** Power at or above this (W) means the appliance is working. */
export const RUN_W = 10;
/** A pause below RUN_W shorter than this (min) still counts as running (e.g. dishwasher drying). */
export const PAUSE_MIN = 15;

export interface Appliance {
  slug: string;
  name: string;
  /** Power sensor. */
  power: string;
  /** `input_boolean` that turns on when the programme is finished. */
  done: string;
  kind: 'washer' | 'dryer' | 'dishwasher' | 'other';
}

/** Power reading `w` that started at `t` (ms) and held until the next point. */
export type PowerPoint = { t: number; w: number };

const KINDS: Record<string, Appliance['kind']> = { waschmaschine: 'washer', trockner: 'dryer', spulmaschine: 'dishwasher' };

function make(hass: HomeAssistant, power: string, done: string, name?: string): Appliance {
  const slug = (done.split('.')[1] ?? done).replace(/_fertig$/, '');
  return {
    slug,
    name: name ?? friendlyName(hass, done).replace(/\s*fertig$/i, ''),
    power,
    done,
    kind: KINDS[slug] ?? 'other',
  };
}

/** Appliances from `config.appliances`, else every `input_boolean.<slug>_fertig` with a `sensor.<slug>_power`. */
export function findAppliances(hass: HomeAssistant, config: CardConfig): Appliance[] {
  if (config.appliances) return config.appliances.map((a) => make(hass, a.power, a.done, a.name));
  return Object.keys(hass.states)
    .map((id) => /^input_boolean\.(.+)_fertig$/.exec(id))
    .filter((m): m is RegExpExecArray => !!m && `sensor.${m[1]}_power` in hass.states)
    .map((m) => make(hass, `sensor.${m[1]}_power`, m[0]));
}

/**
 * Whether the appliance is running: power >= RUN_W now, or it was within the last PAUSE_MIN and the
 * done flag is off. Readings older than the done flag's last change are ignored. `since` is the first
 * high reading after the last pause of PAUSE_MIN or more; unknown without history.
 */
export function applianceRun(
  hass: HomeAssistant, a: Appliance, now: Date, history: PowerPoint[] | undefined,
): { running: boolean; since?: number; power: number } {
  const power = num(hass, a.power) ?? 0;
  if (hass.states[a.done]?.state === 'on') return { running: false, power };
  const flag = hass.states[a.done]?.last_changed;
  const cutoff = flag ? new Date(flag).getTime() : -Infinity;
  const lc = hass.states[a.power]?.last_changed;
  const live = lc ? new Date(lc).getTime() : now.getTime();
  // Only a reading that changed after the done flag counts.
  const highNow = power >= RUN_W && live > cutoff;
  if (!history) return highNow ? { running: true, power } : { running: false, power };

  const pts = history.filter((p) => p.t > cutoff);
  if (hass.states[a.power] && live > cutoff && (!pts.length || live > pts[pts.length - 1].t)) pts.push({ t: live, w: power });

  // High stretches [start, end]; a stretch ends where the next reading starts.
  let since: number | undefined;
  let lastEnd: number | undefined;
  pts.forEach((p, i) => {
    if (p.w < RUN_W) return;
    const end = i + 1 < pts.length ? pts[i + 1].t : now.getTime();
    if (lastEnd === undefined || p.t - lastEnd >= PAUSE_MIN * 60_000) since = p.t;
    lastEnd = Math.max(lastEnd ?? end, end);
  });
  const running = highNow || (lastEnd !== undefined && now.getTime() - lastEnd < PAUSE_MIN * 60_000);
  return running ? { running, since, power } : { running, power };
}
