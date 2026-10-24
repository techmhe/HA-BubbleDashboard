import type { CardConfig, HomeAssistant } from '../types';
import { ent } from './entities';
import { fmt, num } from './util';

/** One entry of weather.get_forecasts (hourly or daily). */
export interface ForecastItem {
  datetime: string;
  condition?: string;
  temperature?: number;
  templow?: number;
  precipitation?: number;
  precipitation_probability?: number;
  wind_speed?: number;
  wind_gust_speed?: number;
}

export const CONDITIONS: Record<string, string> = {
  'clear-night': 'Klar',
  cloudy: 'Bewölkt',
  exceptional: 'Unwetter',
  fog: 'Nebel',
  hail: 'Hagel',
  lightning: 'Gewitter',
  'lightning-rainy': 'Gewitter',
  partlycloudy: 'Teils bewölkt',
  pouring: 'Starkregen',
  rainy: 'Regen',
  snowy: 'Schnee',
  'snowy-rainy': 'Schneeregen',
  sunny: 'Sonnig',
  windy: 'Windig',
  'windy-variant': 'Windig',
};

const POINTS = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];

export function compass(deg: number): string {
  return POINTS[Math.round((((deg % 360) + 360) % 360) / 45) % 8];
}

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const mm = (v: number) => fmt(v, 1);

export interface WeatherNow {
  temp: string;
  label: string;
  condition: string;
  today: string;
  source: string;
  chips: { key: string; label: string }[];
}

export function weatherNow(hass: HomeAssistant, config: CardConfig, daily: ForecastItem[], now = new Date()): WeatherNow {
  const w = hass.states[ent(config, 'weather')];
  const a = w?.attributes ?? {};
  const t = Number(a.temperature);
  const first = daily[0];
  const today = first && sameDay(new Date(first.datetime), now) ? first : undefined;
  let todayLine = '';
  if (today?.temperature !== undefined) {
    const lo = today.templow !== undefined ? `${Math.round(today.templow)}° – ` : '';
    todayLine = `heute ${lo}${Math.round(today.temperature)}°${today.precipitation ? ` · ${mm(today.precipitation)} mm` : ''}`;
  }
  const updated = a.latest_update ? new Date(a.latest_update) : undefined;
  const provider = /DWD|Deutscher Wetterdienst/.test(String(a.attribution ?? '')) ? 'DWD' : '';
  const source = [provider, updated && !Number.isNaN(updated.getTime()) ? `Stand ${updated.getHours()} Uhr` : ''].filter(Boolean).join(' · ');
  const chips: WeatherNow['chips'] = [];
  const has = (k: string) => a[k] !== undefined && a[k] !== null && Number.isFinite(Number(a[k]));
  if (has('humidity')) chips.push({ key: 'humidity', label: `Feuchte ${Math.round(a.humidity)} %` });
  if (has('wind_speed')) chips.push({ key: 'wind', label: `Wind ${Math.round(a.wind_speed)} ${a.wind_speed_unit ?? 'km/h'}${has('wind_bearing') ? ` ${compass(Number(a.wind_bearing))}` : ''}` });
  if (has('pressure')) chips.push({ key: 'pressure', label: `${Math.round(a.pressure)} ${a.pressure_unit ?? 'hPa'}` });
  if (has('uv_index')) chips.push({ key: 'uv', label: `UV ${Math.round(a.uv_index)}` });
  if (has('visibility')) chips.push({ key: 'visibility', label: `Sicht ${Math.round(a.visibility)} ${a.visibility_unit ?? 'km'}` });
  const condition = w?.state ?? '';
  return {
    temp: Number.isFinite(t) ? `${Math.round(t)}°` : '–',
    label: CONDITIONS[condition] ?? condition,
    condition,
    today: todayLine,
    source,
    chips,
  };
}

export interface HourSlot {
  t: string;
  temp: number | null;
  rain: string;
  condition: string;
}

/** `count` slots, every `step` hours, starting with the current hour. */
export function hourlySlots(hourly: ForecastItem[], now: Date, count = 6, step = 2): HourSlot[] {
  const from = new Date(now);
  from.setMinutes(0, 0, 0);
  const upcoming = hourly.filter((h) => new Date(h.datetime).getTime() >= from.getTime());
  return upcoming
    .filter((_, i) => i % step === 0)
    .slice(0, count)
    .map((h) => ({
      t: String(new Date(h.datetime).getHours()).padStart(2, '0'),
      temp: h.temperature !== undefined ? Math.round(h.temperature) : null,
      rain: h.precipitation !== undefined ? mm(h.precipitation) : '',
      condition: h.condition ?? '',
    }));
}

export interface DayRow {
  day: string;
  min: number;
  max: number;
  rain: string;
  condition: string;
  /** Position of the min–max bar on the shared scale, in %. */
  left: number;
  width: number;
}

const r2 = (v: number) => Math.round(v * 100) / 100;

export function dailyRows(daily: ForecastItem[], count = 7): DayRow[] {
  const days = daily.slice(0, count).filter((d) => d.temperature !== undefined);
  const mins = days.map((d) => d.templow ?? d.temperature!);
  const lo = Math.min(...mins);
  const hi = Math.max(...days.map((d) => d.temperature!));
  const span = hi - lo || 1;
  return days.map((d, i) => {
    const min = Math.round(mins[i]);
    const max = Math.round(d.temperature!);
    return {
      day: new Date(d.datetime).toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', ''),
      min,
      max,
      rain: d.precipitation ? `${mm(d.precipitation)} mm` : '',
      condition: d.condition ?? '',
      left: r2(((mins[i] - lo) / span) * 100),
      width: r2(Math.max(((d.temperature! - mins[i]) / span) * 100, 4)),
    };
  });
}

export const STORM_GUST = 60;

/** Storm hint: gusts now, else the first forecast day with gusts ≥ 60 km/h. */
export function stormHint(daily: ForecastItem[], gustNow: number | null, now: Date): { title: string; text: string } | null {
  if (gustNow !== null && gustNow >= STORM_GUST) return { title: 'Jetzt stürmisch', text: `Böen bis ${Math.round(gustNow)} km/h` };
  const d = daily.find((x) => (x.wind_gust_speed ?? 0) >= STORM_GUST);
  if (!d) return null;
  const date = new Date(d.datetime);
  const name = sameDay(date, now) ? 'Heute' : date.toLocaleDateString('de-DE', { weekday: 'long' });
  return {
    title: `${name} stürmisch`,
    text: `Böen bis ${Math.round(d.wind_gust_speed!)} km/h${d.precipitation ? ` · ${mm(d.precipitation)} mm Regen` : ''}`,
  };
}

export interface PollenInfo {
  level: number;
  title: string;
  text: string;
}

export function pollenInfo(hass: HomeAssistant, config: CardConfig): PollenInfo | null {
  const ids = config.pollen ?? Object.keys(hass.states).filter((id) => id.startsWith('sensor.pollenflug_'));
  const values = ids
    .map((id) => ({ name: String(hass.states[id]?.attributes.friendly_name ?? id.split('.')[1]), v: num(hass, id) }))
    .filter((x): x is { name: string; v: number } => x.v !== null);
  if (!values.length) return null;
  const active = values.filter((x) => x.v > 0).sort((a, b) => b.v - a.v);
  if (!active.length) return { level: 0, title: 'Kein Pollenflug', text: `alle ${values.length} Pollenarten 0` };
  return {
    level: active[0].v,
    title: 'Pollenflug',
    text: active.map((x) => `${x.name} ${fmt(x.v, x.v % 1 ? 1 : 0)}`).join(' · '),
  };
}

// ---------- DWD weather warnings (integration dwd_weather_warnings) ----------

export interface WeatherWarning {
  title: string;
  headline: string;
  text: string;
  level: number;
  color: string;
  /** true = in force now (current level sensor), false = advance warning. */
  current: boolean;
  when: string;
  start?: string;
}

const WARN_SENSOR = /_(current_warning_level|advance_warning_level|aktuelle_warnstufe|vorwarnstufe)$/;
const LEVEL_COLORS = ['#7ee8a0', '#ffd60a', '#ff9f0a', '#ff453a', '#bf5af2'];

export function warningSensors(hass: HomeAssistant, config: CardConfig): string[] {
  if (config.warnings) return config.warnings;
  return Object.keys(hass.states).filter(
    (id) => id.startsWith('sensor.') && (hass.entities[id]?.platform === 'dwd_weather_warnings' || WARN_SENSOR.test(id)),
  );
}

function dayWord(d: Date, now: Date): string {
  if (sameDay(d, now)) return 'heute';
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (sameDay(d, tomorrow)) return 'morgen';
  return d.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '');
}

const hhmm = (d: Date) => d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

function warningWhen(start: Date | null, end: Date | null, current: boolean, now: Date): string {
  if (current || (start && start <= now)) {
    if (!end) return 'jetzt';
    return sameDay(end, now) ? `bis ${hhmm(end)}` : `bis ${dayWord(end, now)} ${hhmm(end)}`;
  }
  if (!start) return '';
  const from = `${dayWord(start, now)} ${hhmm(start)}`;
  if (!end) return `ab ${from}`;
  return sameDay(start, end) ? `${from} – ${hhmm(end)}` : `${from} – ${dayWord(end, now)} ${hhmm(end)}`;
}

const titleCase = (s: string) => s.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, a: string, b: string) => a + b.toUpperCase());

/**
 * Current warnings first, then advance warnings; each group most severe first.
 * DWD issues the same type several times for different time windows; those are merged
 * into one warning with the highest level (its text and colour) and the full time span.
 */
export function weatherWarnings(hass: HomeAssistant, config: CardConfig, now: Date): WeatherWarning[] {
  type Raw = Omit<WeatherWarning, 'when' | 'start'> & { from: Date | null; to: Date | null };
  const merged = new Map<string, Raw>();
  for (const id of warningSensors(hass, config)) {
    const a = hass.states[id]?.attributes;
    if (!a) continue;
    const current = !/advance|vorwarn/.test(id);
    const count = Number(a.warning_count) || 0;
    for (let i = 0; i <= count; i++) {
      const g = (k: string) => a[`warning_${i}_${k}`];
      if (!g('headline') && !g('name')) continue;
      const level = Number(g('level')) || 0;
      if (level < 1) continue;
      const from = g('start') ? new Date(String(g('start'))) : null;
      const to = g('end') ? new Date(String(g('end'))) : null;
      if (to && to < now) continue;
      const w: Raw = {
        title: g('name') ? titleCase(String(g('name'))) : String(g('headline')),
        headline: String(g('headline') ?? g('name')),
        text: String(g('description') ?? ''),
        level,
        color: typeof g('color') === 'string' && g('color') ? String(g('color')) : LEVEL_COLORS[Math.min(level, 4)],
        current,
        from,
        to,
      };
      const key = `${current}|${w.title}`;
      const prev = merged.get(key);
      if (!prev) {
        merged.set(key, w);
        continue;
      }
      const span = {
        from: prev.from && w.from ? (w.from < prev.from ? w.from : prev.from) : null,
        to: prev.to && w.to ? (w.to > prev.to ? w.to : prev.to) : null,
      };
      merged.set(key, { ...(w.level > prev.level ? w : prev), ...span });
    }
  }
  return [...merged.values()]
    .map(({ from, to, ...w }) => ({ ...w, when: warningWhen(from, to, w.current, now), start: from?.toISOString() }))
    .sort((x, y) => Number(y.current) - Number(x.current) || y.level - x.level);
}

// ---------- metric charts (chips in the weather sheet) ----------

export type WeatherMetric = 'humidity' | 'wind' | 'pressure' | 'uv' | 'visibility';

export const WEATHER_METRICS: Record<WeatherMetric, { name: string; unit: string; color: string; attr: string; digits: number; snap: number }> = {
  humidity: { name: 'Luftfeuchte', unit: '%', color: '#5ac8fa', attr: 'humidity', digits: 0, snap: 5 },
  wind: { name: 'Wind', unit: 'km/h', color: '#7ee8a0', attr: 'wind_speed', digits: 0, snap: 5 },
  pressure: { name: 'Luftdruck', unit: 'hPa', color: '#bf9bff', attr: 'pressure', digits: 0, snap: 2 },
  uv: { name: 'UV-Index', unit: '', color: '#ffd60a', attr: 'uv_index', digits: 0, snap: 1 },
  visibility: { name: 'Sicht', unit: 'km', color: '#8fd0ff', attr: 'visibility', digits: 0, snap: 5 },
};

export interface HistoryRow {
  s: string;
  a?: Record<string, unknown>;
  /** last updated, seconds */
  lu: number;
}

/** Past values from the weather entity's history, future values from the hourly forecast. */
export function weatherSeries(metric: WeatherMetric, history: HistoryRow[], forecast: ForecastItem[]) {
  const attr = WEATHER_METRICS[metric].attr;
  const past = history
    .map((r) => ({ t: Math.round(r.lu * 1000), v: Number(r.a?.[attr]) }))
    .filter((p) => r0(p.v));
  const future = forecast
    .map((f) => {
      let v = Number((f as unknown as Record<string, unknown>)[attr]);
      // DWD reports forecast visibility in metres, the entity in km
      if (metric === 'visibility' && v > 200) v = v / 1000;
      return { t: Date.parse(f.datetime), v };
    })
    .filter((p) => r0(p.v) && Number.isFinite(p.t));
  return { past, future };
}

const r0 = (v: number) => Number.isFinite(v);
