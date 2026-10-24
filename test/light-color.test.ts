import { describe, expect, it } from 'vitest';
import { lightFill, lightRgb } from '../src/logic/devices';

describe('brightness bar in the light colour', () => {
  it('uses the colour of a colour light', () => {
    expect(lightRgb({ color_mode: 'hs', rgb_color: [255, 0, 0], hs_color: [0, 100] })).toEqual([255, 0, 0]);
    expect(lightRgb({ color_mode: 'xy', hs_color: [240, 100] })).toEqual([0, 0, 255]);
  });

  it('uses the white tone of a colour-temperature light', () => {
    expect(lightRgb({ color_mode: 'color_temp', color_temp_kelvin: 2700 })).toEqual([255, 167, 87]);
    expect(lightRgb({ color_mode: 'color_temp', color_temp_kelvin: 6500 })).toEqual([255, 254, 250]);
  });

  it('has no colour for dimmer-only lights', () => {
    expect(lightRgb({ color_mode: 'brightness' })).toBeNull();
  });

  it('builds the fill and an icon colour that stays readable', () => {
    expect(lightFill([0, 0, 255])).toEqual({ fill: 'linear-gradient(90deg, rgba(0,0,255,0.35), rgb(0,0,255))', icon: '#fff' });
    expect(lightFill([255, 254, 250]).icon).toBe('#2b2200');
  });
});
