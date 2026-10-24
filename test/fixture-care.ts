import { makeHass, NOW, type Def } from './fixture';

/** Battery Notes buttons, filter sensors and Robby reset buttons, each on its own device. */
export const CARE_EXTRAS: Record<string, Def> = {
  'sensor.presenzmelder_bad_battery': ['5', { device_class: 'battery', friendly_name: 'Presenzmelder Bad Batterie' }, 10, { device: 'dev_pm_bad' }],
  'sensor.presenzmelder_bad_battery_type': ['2× AAA', {}, 10, { device: 'dev_pm_bad' }],
  'button.presenzmelder_bad_battery_replaced': ['unknown', {}, 10, { device: 'dev_pm_bad' }],
  'sensor.tursensor_keller_battery': ['9', { device_class: 'battery' }, 10, { device: 'dev_keller' }],
  'sensor.core_300s_series_filter_life': ['0', { unit_of_measurement: '%' }, 10, { device: 'dev_core' }],
  'binary_sensor.flur_1_og_klimaanlage_filteralarm': ['on', {}, 10, { device: 'dev_ac' }],
  'vacuum.robby': ['docked', { friendly_name: 'Robby' }, 10, { device: 'dev_robby' }],
  'button.robby_luftfilter_verbrauchsmaterial_zurucksetzen': ['unknown', {}, 10, { device: 'dev_robby' }],
  'button.robby_sensor_verbrauchsmaterial_zurucksetzen': ['unknown', {}, 10, { device: 'dev_robby' }],
  'button.robby_hauptbursten_verbrauchsmaterial_zurucksetzen': ['unknown', {}, 10, { device: 'dev_robby' }],
  'button.robby_seitenbursten_verbrauchsmaterial_zurucksetzen': ['unknown', {}, 10, { device: 'dev_robby' }],
  'button.robby_eg_saugen': ['unknown', {}, 10, { device: 'dev_robby' }],
};

const CARE_DEVICES: [string, string][] = [
  ['dev_pm_bad', 'Präsenzmelder Bad'],
  ['dev_keller', 'Türsensor Keller'],
  ['dev_core', 'Luftreiniger Esszimmer'],
  ['dev_ac', 'Klimaanlage'],
  ['dev_robby', 'Robby'],
];

export function makeCareHass(overrides: Parameters<typeof makeHass>[0] = {}) {
  const hass = makeHass(overrides, NOW, CARE_EXTRAS);
  for (const [id, name] of CARE_DEVICES) hass.devices[id] = { id, area_id: null, name };
  return hass;
}
