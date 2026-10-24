import type { CardConfig, HomeAssistant } from '../types';
import { filterAlarmIds } from './entities';
import { lowBatteries } from './overview';
import { deviceName, fmt, friendlyName, num, state } from './util';

const FILTER_LIFE_LOW = 10;
const RESET = /zurucksetzen|zuruecksetzen|reset/;

/** A battery or filter that needs attention; `reset` is the button that confirms the swap. */
export interface CareItem {
  id: string;
  name: string;
  detail: string;
  reset?: string;
}

/** Other entities of the same device. */
export function deviceEntities(hass: HomeAssistant, entityId: string): string[] {
  const dev = hass.entities[entityId]?.device_id;
  if (!dev) return [];
  return Object.values(hass.entities)
    .filter((e) => e.device_id === dev)
    .map((e) => e.entity_id);
}

/** First button of the entity's device whose id matches `re`. */
export function deviceButton(hass: HomeAssistant, entityId: string, re: RegExp): string | undefined {
  return deviceEntities(hass, entityId).find((id) => id.startsWith('button.') && re.test(id));
}

export function batteryCare(hass: HomeAssistant): CareItem[] {
  return lowBatteries(hass).map((b) => {
    const siblings = deviceEntities(hass, b.id);
    const typeId = siblings.find((id) => id.startsWith('sensor.') && id.endsWith('_battery_type'));
    const type = typeId ? state(hass, typeId) : undefined;
    const known = type && !['unknown', 'unavailable', ''].includes(type);
    return {
      id: b.id,
      name: b.name,
      detail: known ? `${fmt(b.level)} % · ${type}` : `${fmt(b.level)} %`,
      reset: deviceButton(hass, b.id, /_battery_replaced$/),
    };
  });
}

export function filterCare(hass: HomeAssistant, config: CardConfig): CareItem[] {
  const out: CareItem[] = [];
  const name = (id: string) => deviceName(hass, id) ?? friendlyName(hass, id);
  const reset = (id: string) => deviceButton(hass, id, new RegExp(`filter.*(${RESET.source})|(${RESET.source}).*filter`));
  for (const id of filterAlarmIds(config)) {
    if (state(hass, id) === 'on') out.push({ id, name: name(id), detail: 'Filter reinigen', reset: reset(id) });
  }
  for (const id of Object.keys(hass.states)) {
    if (!id.startsWith('sensor.') || !id.endsWith('filter_life')) continue;
    const v = num(hass, id);
    if (v !== null && v < FILTER_LIFE_LOW) out.push({ id, name: name(id), detail: `Filter ${fmt(v)} %`, reset: reset(id) });
  }
  return out;
}

export { RESET as RESET_BUTTON };
