import { makeHass, NOW, type Def } from './fixture';

/** Extra entities for the Räume page: colour light, metered switch, dehumidifier, garden, room power. */
export const ROOM_EXTRAS: Record<string, Def> = {
    'light.sideboard_wohnzimmer': ['off', {
      friendly_name: 'Sideboard Wohnzimmer', supported_color_modes: ['color_temp', 'xy'], color_mode: null,
      min_color_temp_kelvin: 2000, max_color_temp_kelvin: 6666, effect_list: ['blink', 'colorloop'],
    }, 30, { labels: ['dashboard_gerat'], device: 'dev_sideboard' }],
    'sensor.sideboard_wohnzimmer_power': ['18.25', { device_class: 'power', unit_of_measurement: 'W' }, 1, { device: 'dev_sideboard' }],
    'switch.heimkino': ['on', { friendly_name: 'Heimkino' }, 30, { area: 'wohnzimmer', labels: ['dashboard_gerat'], device: 'dev_heimkino' }],
    'sensor.heimkino_device_power': ['1.07', { device_class: 'power', unit_of_measurement: 'W' }, 1, { device: 'dev_heimkino' }],
    'sensor.heimkino_power': ['291', { device_class: 'power', unit_of_measurement: 'W' }, 1, { device: 'dev_heimkino' }],
    'humidifier.entfeuchter': ['off', {
      friendly_name: 'Luftentfeuchter', min_humidity: 35, max_humidity: 85, humidity: 50, current_humidity: 70, mode: 'manual',
      available_modes: ['manual', 'continuous', 'auto', 'clothes_dry', 'shoes_dry'],
    }, 30, { area: 'wohnzimmer', labels: ['dashboard_gerat'] }],
    'switch.brunnen': ['off', { friendly_name: 'Brunnen' }, 30, { area: 'garten', labels: ['dashboard_gerat'] }],
    'sensor.wohnzimmer_leistung': ['319.3', { device_class: 'power' }, 1, { labels: ['raumverbrauch'] }],
    'sensor.kuche_leistung': ['7.8', { device_class: 'power' }, 1, { labels: ['raumverbrauch'] }],
    'sensor.esszimmer_leistung': ['5.6', { device_class: 'power' }, 1, { labels: ['raumverbrauch'] }],
    'sensor.garten_leistung': ['0.0', { device_class: 'power' }, 1, { labels: ['raumverbrauch'] }],
};

export function makeRoomsHass(overrides: Parameters<typeof makeHass>[0] = {}) {
  return makeHass(overrides, NOW, ROOM_EXTRAS);
}
