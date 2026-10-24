import type { CardConfig, HomeAssistant } from '../types';
import { deviceButton, deviceEntities } from './care';
import { ent } from './entities';
import { deviceName, fmt, num } from './util';

const MODES: Record<string, string> = { cool: 'Kühlen', dry: 'Trocknen', fan_only: 'Lüften', heat: 'Heizen', auto: 'Auto', heat_cool: 'Auto', off: 'Aus' };
const MODE_ORDER = ['cool', 'dry', 'fan_only', 'heat', 'auto', 'heat_cool', 'off'];
const ACTIVE: Record<string, string> = { cool: 'Kühlt', dry: 'Trocknet', fan_only: 'Lüftet', heat: 'Heizt', auto: 'Auto', heat_cool: 'Auto', off: 'Aus' };
const FANS: Record<string, string> = {
  auto: 'Auto', silent: 'Leise', quiet: 'Leise', low: 'Niedrig', medium: 'Mittel', middle: 'Mittel', high: 'Hoch', max: 'Max', full: 'Max', turbo: 'Turbo',
};
const PRESETS: Record<string, string> = { none: 'Normal', away: 'Abwesend', sleep: 'Schlafen', boost: 'Boost', eco: 'Eco', comfort: 'Komfort' };
const QUIET = /flust|fluest|silent|quiet|leise/;

export interface AcInfo {
  id: string;
  state: string;
  status: string;
  target: number | null;
  min: number;
  max: number;
  step: number;
  modes: { id: string; name: string }[];
  fans: { id: string; name: string }[];
  fan: string;
  presets: { id: string; name: string }[];
  preset: string;
  /** Swing toggle: on = any mode except "off". */
  swing: { on: boolean; onMode: string } | null;
  /** Switches of the AC device (outdoor quiet mode first). */
  switches: { id: string; name: string; on: boolean }[];
  selfClean?: string;
}

export function acInfo(hass: HomeAssistant, config: CardConfig): AcInfo | null {
  const id = ent(config, 'ac');
  const s = hass.states[id];
  if (!s) return null;
  const a = s.attributes;
  const siblings = deviceEntities(hass, id);
  const dev = deviceName(hass, id) ?? '';
  const short = (eid: string) => {
    const fn = String(hass.states[eid]?.attributes.friendly_name ?? eid);
    return fn.startsWith(dev) && dev ? fn.slice(dev.length).trim() : fn;
  };
  const outdoorId = siblings.find((e) => e.startsWith('sensor.') && /aussen|outdoor/.test(e) && hass.states[e]?.attributes.device_class === 'temperature');
  const outdoor = num(hass, outdoorId);
  const power = num(hass, ent(config, 'ac_power'));
  const cur = Number(a.current_temperature);
  const target = Number.isFinite(Number(a.temperature)) && a.temperature !== null ? Number(a.temperature) : null;
  const t = (v: number) => `${fmt(v, v % 1 ? 1 : 0)}°`;
  const head = s.state === 'off' || target === null || ['dry', 'fan_only'].includes(s.state)
    ? (ACTIVE[s.state] ?? s.state)
    : `${ACTIVE[s.state] ?? s.state} auf ${t(target)}`;
  const status = [
    s.state === 'unavailable' ? 'Offline' : head,
    Number.isFinite(cur) ? `innen ${fmt(cur, 1)}°` : '',
    outdoor !== null ? `außen ${fmt(outdoor, 1)}°` : '',
    power !== null && power >= 1 ? `${fmt(Math.round(power))} W` : '',
  ].filter(Boolean).join(' · ');

  const hvac: string[] = a.hvac_modes ?? [];
  const fanModes: string[] = a.fan_modes ?? [];
  const swingModes: string[] = a.swing_modes ?? [];
  const switches = siblings
    .filter((e) => e.startsWith('switch.') && !hass.entities[e]?.hidden)
    .map((e) => ({ id: e, name: short(e), on: hass.states[e]?.state === 'on' }))
    .sort((x, y) => Number(QUIET.test(y.id)) - Number(QUIET.test(x.id)));

  return {
    id,
    state: s.state,
    status,
    target,
    min: Number(a.min_temp) || 16,
    max: Number(a.max_temp) || 30,
    step: Number(a.target_temp_step) || 1,
    modes: MODE_ORDER.filter((m) => hvac.includes(m)).map((m) => ({ id: m, name: MODES[m] })),
    fans: [...fanModes.filter((f) => f === 'auto'), ...fanModes.filter((f) => f !== 'auto')].map((f) => ({ id: f, name: FANS[f] ?? f })),
    fan: String(a.fan_mode ?? ''),
    presets: (a.preset_modes ?? []).map((p: string) => ({ id: p, name: PRESETS[p] ?? p })),
    preset: String(a.preset_mode ?? ''),
    swing: swingModes.length > 1 && swingModes.includes('off')
      ? { on: !!a.swing_mode && a.swing_mode !== 'off', onMode: swingModes.find((m) => m !== 'off')! }
      : null,
    switches,
    selfClean: deviceButton(hass, id, /reinigung|clean/),
  };
}
