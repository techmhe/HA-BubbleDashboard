import type { CardConfig, HomeAssistant, RoomConfig } from '../types';
import { entityArea } from './util';

export interface Room extends RoomConfig {
  name: string;
  areas: string[];
  temperature: string;
  humidity: string;
  airing: string;
}

const AIRING_RE = /^sensor\.(.+)_luftung$/;

/**
 * Rooms come from the card config when given, otherwise they are auto-detected
 * from the `sensor.<slug>_luftung` template sensors and the area registry.
 */
export function resolveRooms(hass: HomeAssistant, config: CardConfig): Room[] {
  const base: RoomConfig[] = config.rooms?.length ? config.rooms : detectRooms(hass);
  return base.map((r) => complete(hass, r));
}

function detectRooms(hass: HomeAssistant): RoomConfig[] {
  return Object.keys(hass.states)
    .map((id) => AIRING_RE.exec(id)?.[1])
    .filter((slug): slug is string => !!slug && !slug.startsWith('aussen'))
    .map((slug) => ({ slug }));
}

function inAreas(hass: HomeAssistant, domain: string, areas: string[], pred: (id: string) => boolean): string | undefined {
  if (!areas.length) return undefined;
  return Object.keys(hass.states).find(
    (id) => id.startsWith(domain + '.') && areas.includes(entityArea(hass, id) ?? '') && pred(id),
  );
}

/** Fill in areas, climate and sensors for a room from the registries. */
export function complete(hass: HomeAssistant, r: RoomConfig): Room {
  const S = hass.states;
  const areas = r.areas?.length
    ? r.areas
    : hass.areas[r.slug]
      ? [r.slug]
      : (() => {
          const a = entityArea(hass, `sensor.${r.slug}_temperature`);
          return a ? [a] : [];
        })();
  const dc = (id: string) => S[id]?.attributes.device_class;
  const climate =
    r.climate ??
    (S[`climate.vtherm_${r.slug}`] ? `climate.vtherm_${r.slug}` : undefined) ??
    inAreas(hass, 'climate', areas, () => true);
  const firstArea = areas[0] ? hass.areas[areas[0]] : undefined;
  const name =
    r.name ??
    firstArea?.name ??
    String(S[`sensor.${r.slug}_luftung`]?.attributes.friendly_name ?? r.slug).replace(/\s*Lüftung$/i, '');
  return {
    ...r,
    name,
    areas,
    climate,
    floor: r.floor ?? firstArea?.floor_id ?? undefined,
    pm25: r.pm25 ?? inAreas(hass, 'sensor', areas, (id) => dc(id) === 'pm25'),
    purifier: r.purifier ?? inAreas(hass, 'fan', areas, () => true),
    window: r.window ?? inAreas(hass, 'binary_sensor', areas, (id) => ['window', 'opening'].includes(dc(id))),
    temperature: `sensor.${r.slug}_temperature`,
    humidity: `sensor.${r.slug}_humidity`,
    airing: `sensor.${r.slug}_luftung`,
  };
}
