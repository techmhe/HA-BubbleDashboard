import { makeHass, NOW, type Def } from './fixture';
import type { ForecastItem } from '../src/logic/weather';

const POLLEN = ['roggen', 'hasel', 'erle', 'graeser', 'birke', 'ambrosia', 'esche', 'beifuss'];
const POLLEN_NAMES: Record<string, string> = { graeser: 'Gräser', beifuss: 'Beifuss' };

/** Robby helpers, pollen sensors and a fuller weather entity. */
export const M5_EXTRAS: Record<string, Def> = {
  'weather.musterstadt': ['rainy', {
    friendly_name: 'Musterstadt', temperature: 8.5, humidity: 80, wind_speed: 30, wind_bearing: 225, pressure: 1012.3,
    uv_index: 2, visibility: 47.2, attribution: 'Data provided by Deutscher Wetterdienst (DWD)',
    latest_update: new Date(2026, 9, 24, 18, 5).toISOString(),
  }],
  'sensor.robby_batterie': ['100', { device_class: 'battery', unit_of_measurement: '%' }],
  'select.robby_ausgewahlte_karte': ['EG', { options: ['EG', 'OG', 'Schlafzimmer'] }],
  'select.flur_eg_robby_reinigungsmodus': ['vac_and_mop', { options: ['vacuum', 'vac_and_mop', 'mop', 'custom'] }],
  'select.robby_wischmopp_intensiat': ['intense', { options: ['off', 'mild', 'standard', 'intense', 'custom'] }],
  'input_text.robby_raumauswahl': ['16,19'],
  'input_number.robby_durchgange': ['1.0', { min: 1, max: 3, step: 1 }],
  ...Object.fromEntries(POLLEN.map((p) => [`sensor.pollenflug_${p}_41`, ['0', { friendly_name: POLLEN_NAMES[p] ?? p[0].toUpperCase() + p.slice(1) }] as Def])),
};

export function makeM5Hass(overrides: Parameters<typeof makeHass>[0] = {}) {
  return makeHass(overrides, NOW, M5_EXTRAS);
}

const RAIN = [0.1, 0.4, 0.7, 1.0, 1.5, 2.0, 2.6, 2.7, 2.9, 2.8, 2.7, 2.5, 2.0];

/** Hourly forecast from 19:00 on the fixture day. */
export const HOURLY: ForecastItem[] = RAIN.map((mm, i) => ({
  datetime: new Date(2026, 9, 24, 19 + i).toISOString(),
  condition: 'rainy',
  temperature: i >= 4 ? 9 : 8,
  precipitation: mm,
}));

const D: [min: number, max: number, mm: number, condition: string, gust?: number][] = [
  [8, 9, 3.4, 'rainy', 45],
  [8, 12, 24.6, 'pouring', 78],
  [8, 12, 1.5, 'rainy', 40],
  [11, 17, 0, 'cloudy'],
  [9, 12, 0, 'partlycloudy'],
  [9, 12, 0, 'cloudy'],
  [7, 11, 0, 'sunny'],
];

/** Daily forecast starting on the fixture day (Saturday). */
export const DAILY: ForecastItem[] = D.map(([min, max, mm, condition, gust], i) => ({
  datetime: new Date(2026, 9, 24 + i).toISOString(),
  condition,
  temperature: max,
  templow: min,
  precipitation: mm,
  wind_gust_speed: gust,
}));
