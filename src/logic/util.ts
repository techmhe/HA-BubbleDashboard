import type { HomeAssistant } from '../types';

/** Numeric state or null for unknown/unavailable/non-numeric. */
export function num(hass: HomeAssistant, entityId: string | undefined): number | null {
  if (!entityId) return null;
  const s = hass.states[entityId]?.state;
  if (s === undefined || s === '' || s === 'unknown' || s === 'unavailable') return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export function state(hass: HomeAssistant, entityId: string | undefined): string | undefined {
  return entityId ? hass.states[entityId]?.state : undefined;
}

/** German decimal formatting, e.g. 19.5 -> "19,5". */
export function fmt(value: number, digits = 0): string {
  return value.toLocaleString('de-DE', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

/** Area of an entity: entity registry area wins over the device area. */
export function entityArea(hass: HomeAssistant, entityId: string): string | undefined {
  const reg = hass.entities[entityId];
  if (!reg) return undefined;
  if (reg.area_id) return reg.area_id;
  const dev = reg.device_id ? hass.devices[reg.device_id] : undefined;
  return dev?.area_id ?? undefined;
}

export function deviceName(hass: HomeAssistant, entityId: string): string | undefined {
  const reg = hass.entities[entityId];
  const dev = reg?.device_id ? hass.devices[reg.device_id] : undefined;
  return dev ? (dev.name_by_user || dev.name || undefined) : undefined;
}

export function friendlyName(hass: HomeAssistant, entityId: string, overrides?: Record<string, string>): string {
  if (overrides?.[entityId]) return overrides[entityId];
  return hass.states[entityId]?.attributes.friendly_name ?? entityId.split('.')[1];
}

/** Minutes since the entity last changed state. */
export function minutesSince(hass: HomeAssistant, entityId: string, now: Date): number {
  const lc = hass.states[entityId]?.last_changed;
  if (!lc) return 0;
  return Math.max(0, Math.floor((now.getTime() - new Date(lc).getTime()) / 60000));
}

export function durationText(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}
