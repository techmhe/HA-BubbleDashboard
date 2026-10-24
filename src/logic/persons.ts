import type { CardConfig, HassEntity, HomeAssistant } from '../types';

export interface PersonInfo {
  id: string;
  /** First name for labels. */
  name: string;
  initials: string;
  picture?: string;
  place: 'home' | 'zone' | 'away' | 'unknown';
  zoneName: string;
  zoneIcon?: string;
}

function zoneOf(hass: HomeAssistant, p: HassEntity): HassEntity | undefined {
  const fromAttr = (p.attributes.in_zones as string[] | undefined)?.map((id) => hass.states[id]).find(Boolean);
  if (fromAttr) return fromAttr;
  const name = p.state.trim();
  return Object.values(hass.states).find(
    (s) => s.entity_id.startsWith('zone.') && String(s.attributes.friendly_name ?? '').trim() === name,
  );
}

/** Persons with a device tracker (or the configured ones), with their current zone. */
export function persons(hass: HomeAssistant, config: CardConfig): PersonInfo[] {
  const ids = config.persons
    ?? Object.keys(hass.states)
      .filter((id) => id.startsWith('person.') && (hass.states[id].attributes.device_trackers?.length ?? 0) > 0)
      .sort((a, b) => String(hass.states[a].attributes.friendly_name ?? a).localeCompare(String(hass.states[b].attributes.friendly_name ?? b), 'de'));
  return ids.flatMap((id): PersonInfo[] => {
    const p = hass.states[id];
    if (!p) return [];
    const full = String(config.names?.[id] ?? p.attributes.friendly_name ?? id.split('.')[1]).trim();
    const words = full.split(/\s+/);
    const initials = words.map((w) => w[0]).slice(0, 2).join('').toUpperCase();
    const base = { id, name: words[0], initials, picture: p.attributes.entity_picture as string | undefined };
    if (p.state === 'home') {
      return [{ ...base, place: 'home' as const, zoneName: 'Zu Hause', zoneIcon: String(hass.states['zone.home']?.attributes.icon ?? 'mdi:home') }];
    }
    if (p.state === 'not_home') return [{ ...base, place: 'away' as const, zoneName: 'Unterwegs' }];
    if (p.state === 'unknown' || p.state === 'unavailable') return [{ ...base, place: 'unknown' as const, zoneName: 'Unbekannt' }];
    const zone = zoneOf(hass, p);
    return [{
      ...base,
      place: 'zone' as const,
      zoneName: String(zone?.attributes.friendly_name ?? p.state).trim(),
      zoneIcon: zone?.attributes.icon as string | undefined,
    }];
  });
}

/** Short text next to the avatars. */
export function presenceLabel(list: PersonInfo[]): string {
  const home = list.filter((p) => p.place === 'home').length;
  if (home === list.length) return 'Alle da';
  if (home === 0) return 'Niemand da';
  return `${home} von ${list.length} da`;
}

/** "seit 07:05" today, "seit Fr 18:30" within the last week, else "seit 10.10.". */
export function sinceLabel(iso: string, now: Date): string {
  const d = new Date(iso);
  const hm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  const day = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((day(now) - day(d)) / 86_400_000);
  if (days <= 0) return `seit ${hm}`;
  if (days < 7) return `seit ${d.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '')} ${hm}`;
  return `seit ${d.getDate()}.${d.getMonth() + 1}.`;
}
