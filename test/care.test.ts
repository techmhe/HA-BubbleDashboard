import { describe, expect, it } from 'vitest';
import { batteryCare, filterCare } from '../src/logic/care';
import { consumables } from '../src/logic/robby';
import { makeCareHass } from './fixture-care';

const config = { type: 'custom:ha-start-dashboard' };

describe('battery care', () => {
  it('lists low batteries with type and the Battery Notes "replaced" button', () => {
    const items = batteryCare(makeCareHass());
    expect(items.map((i) => [i.name, i.detail, i.reset])).toEqual([
      ['Präsenzmelder Bad', '5 % · 2× AAA', 'button.presenzmelder_bad_battery_replaced'],
      ['Türsensor Keller', '9 %', undefined],
    ]);
  });
});

describe('filter care', () => {
  it('lists filter alarms and worn filters; no reset where the device has none', () => {
    const items = filterCare(makeCareHass(), config);
    expect(items.map((i) => [i.name, i.detail, i.reset])).toEqual([
      ['Klimaanlage', 'Filter reinigen', undefined],
      ['Luftreiniger Esszimmer', 'Filter 0 %', undefined],
    ]);
  });
});

describe('robby consumables', () => {
  it('carry the matching reset button of the vacuum', () => {
    const c = consumables(makeCareHass(), config);
    expect(c.map((x) => [x.name, x.reset])).toEqual([
      ['Filter', 'button.robby_luftfilter_verbrauchsmaterial_zurucksetzen'],
      ['Sensoren', 'button.robby_sensor_verbrauchsmaterial_zurucksetzen'],
      ['Hauptbürste', 'button.robby_hauptbursten_verbrauchsmaterial_zurucksetzen'],
      ['Seitenbürste', 'button.robby_seitenbursten_verbrauchsmaterial_zurucksetzen'],
    ]);
  });
});
