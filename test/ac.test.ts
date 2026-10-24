import { describe, expect, it } from 'vitest';
import { acInfo } from '../src/logic/ac';
import { makeHass, NOW, type Def } from './fixture';

const config = { type: 'custom:ha-start-dashboard' };
const dev = (name: string, state = 'off'): Def => [state, { friendly_name: `Flur 1.OG Klimaanlage ${name}` }, 10, { device: 'dev_ac' }];

const AC: Record<string, Def> = {
  'climate.flur_1_og_klimaanlage': ['cool', {
    friendly_name: 'Klimaanlage', hvac_modes: ['fan_only', 'dry', 'cool', 'heat', 'auto', 'off'], fan_modes: ['silent', 'low', 'medium', 'high', 'auto', 'max'],
    fan_mode: 'auto', preset_modes: ['none', 'away', 'sleep', 'boost'], preset_mode: 'none', swing_modes: ['off', 'vertical'], swing_mode: 'vertical',
    current_temperature: 24.5, temperature: 22, min_temp: 16, max_temp: 30, target_temp_step: 1,
  }, 10, { area: 'flur_1_og', device: 'dev_ac' }],
  'switch.flur_1_og_klimaanlage_flustermodus_ausseneinheit': dev('Flüstermodus Außeneinheit', 'on'),
  'switch.flur_1_og_klimaanlage_luftreiniger': dev('Luftreiniger'),
  'switch.flur_1_og_klimaanlage_gerateanzeige': dev('Geräteanzeige', 'on'),
  'button.flur_1_og_klimaanlage_selbstreinigung_starten': dev('Selbstreinigung starten', 'unknown'),
  'sensor.flur_1_og_klimaanlage_aussentemperatur': ['12.5', { device_class: 'temperature', friendly_name: 'Flur 1.OG Klimaanlage Außentemperatur' }, 10, { device: 'dev_ac' }],
  'sensor.klimaanlage_power': ['640', { device_class: 'power', unit_of_measurement: 'W' }],
};

function hass() {
  const h = makeHass({}, NOW, AC);
  h.devices.dev_ac = { id: 'dev_ac', area_id: 'flur_1_og', name: 'Flur 1.OG Klimaanlage' };
  return h;
}

describe('air conditioner', () => {
  it('describes modes, fan, swing, presets and the device extras in German', () => {
    const a = acInfo(hass(), config)!;
    expect(a.status).toBe('Kühlt auf 22° · innen 24,5° · außen 12,5° · 640 W');
    expect(a.modes.map((m) => m.name)).toEqual(['Kühlen', 'Trocknen', 'Lüften', 'Heizen', 'Auto', 'Aus']);
    expect(a.fans.map((f) => [f.id, f.name])).toEqual([
      ['auto', 'Auto'], ['silent', 'Leise'], ['low', 'Niedrig'], ['medium', 'Mittel'], ['high', 'Hoch'], ['max', 'Max'],
    ]);
    expect(a.presets.map((p) => p.name)).toEqual(['Normal', 'Abwesend', 'Schlafen', 'Boost']);
    expect(a.swing).toEqual({ on: true, onMode: 'vertical' });
    expect(a.switches.map((s) => [s.name, s.on])).toEqual([
      ['Flüstermodus Außeneinheit', true],
      ['Luftreiniger', false],
      ['Geräteanzeige', true],
    ]);
    expect(a.selfClean).toBe('button.flur_1_og_klimaanlage_selbstreinigung_starten');
  });

  it('puts the outdoor quiet mode first among the switches', () => {
    expect(acInfo(hass(), config)!.switches[0].id).toBe('switch.flur_1_og_klimaanlage_flustermodus_ausseneinheit');
  });
});
