import { describe, expect, it } from 'vitest';
import { energyHeadline, energyNow, houseSources } from '../src/logic/energy';
import type { PageContext } from '../src/pages/context';
import { energyStyles, renderEnergy } from '../src/pages/energy';
import { resolveRooms } from '../src/logic/rooms';
import type { CardConfig } from '../src/types';
import { makeHass, NOW, type Def } from './fixture';
import { templateText, visibleText } from './template-text';

const W = { device_class: 'power', unit_of_measurement: 'W' };
const PV = 'sensor.marstek_venus_a_pv_aktuelle_leistung';
const AC = 'sensor.marstek_venus_a_ac_leistung';

/** PV panels feed a battery inverter; only its AC output reaches the house. */
function coupledHass(pv: string, ac: string, imp = '1654', house = '2440', reg: Def[3] = { device: 'dev_battery' }) {
  return makeHass({}, NOW, {
    'sensor.hausverbrauch': [house, W],
    [PV]: [pv, W, 1, reg],
    [AC]: [ac, W, 1, reg],
    'sensor.marstek_venus_a_batterie_ladezustand': ['26', { device_class: 'battery', unit_of_measurement: '%' }],
    'sensor.stromverbrauch_shelly_messung': [imp, W],
    'sensor.ruckeinspeisung_shelly_messung': ['0', W],
  });
}

const config: CardConfig = { type: 'custom:ha-start-dashboard', entities: { pv_power: PV } } as CardConfig;

function ctx(hass: ReturnType<typeof makeHass>, cfg: CardConfig = config): PageContext {
  return {
    hass, config: cfg, rooms: resolveRooms(hass, cfg), now: NOW, ui: {},
    openSheet() {}, navigate() {}, energy: () => ({ loading: false }), consumersAll: false,
  } as unknown as PageContext;
}

describe('PV coupled to the battery', () => {
  it('detects coupling when the PV sensor sits on the battery device', () => {
    expect(energyNow(coupledHass('860', '786'), config).coupled).toBeDefined();
    expect(energyNow(coupledHass('860', '786', '1654', '2440', {}), config).coupled).toBeUndefined();
  });

  it('detects coupling through a PV group whose members sit on the battery device', () => {
    const h = coupledHass('860', '786', '1654', '2440', {});
    h.entities[AC] = { ...h.entities[AC], entity_id: AC, device_id: 'dev_battery' } as (typeof h.entities)[string];
    h.states[PV].attributes.entity_id = ['sensor.mppt1_leistung', 'sensor.mppt2_leistung'];
    h.entities['sensor.mppt1_leistung'] = { entity_id: 'sensor.mppt1_leistung', device_id: 'dev_battery' } as (typeof h.entities)[string];
    expect(energyNow(h, config).coupled).toBeDefined();
  });

  it('honours battery.pv_coupled from the card config', () => {
    const off = { ...config, battery: { pv_coupled: false } } as CardConfig;
    const on = { ...config, battery: { pv_coupled: true } } as CardConfig;
    expect(energyNow(coupledHass('860', '786'), off).coupled).toBeUndefined();
    expect(energyNow(coupledHass('860', '786', '1654', '2440', {}), on).coupled).toBeDefined();
  });

  it('splits the battery output into current PV and stored energy', () => {
    expect(energyNow(coupledHass('860', '786'), config).coupled).toEqual({ pv: 860, output: 786, fromPv: 786, fromBattery: 0, charge: 74 });
    expect(energyNow(coupledHass('0', '410'), config).coupled).toEqual({ pv: 0, output: 410, fromPv: 0, fromBattery: 410, charge: 0 });
    expect(energyNow(coupledHass('300', '500'), config).coupled).toEqual({ pv: 300, output: 500, fromPv: 300, fromBattery: 200, charge: 0 });
    expect(energyNow(coupledHass('777', '0'), config).coupled).toEqual({ pv: 777, output: 0, fromPv: 0, fromBattery: 0, charge: 777 });
  });

  it('does not count coupled PV twice when the house sensor is missing', () => {
    const h = coupledHass('860', '786');
    delete h.states['sensor.hausverbrauch'];
    expect(energyNow(h, config).house).toBe(1654 + 786);
  });

  it('the headline counts only PV that reaches the house', () => {
    const noon = new Date(2026, 9, 24, 12, 0);
    expect(energyHeadline(noon, energyNow(coupledHass('860', '786'), config))).toBe('Mittag · PV deckt 32 %, Rest aus dem Netz');
    expect(energyHeadline(NOW, energyNow(coupledHass('0', '410', '10', '420'), config))).toBe('Abend · Akku versorgt das Haus');
  });

  it('splits the house consumption by source', () => {
    expect(houseSources(energyNow(coupledHass('860', '786'), config))).toEqual({ pv: 786, battery: 0, grid: 1654 });
    expect(houseSources(energyNow(coupledHass('0', '410', '10', '420'), config))).toEqual({ pv: 0, battery: 410, grid: 10 });
    const h = coupledHass('978', '786', '0', '510');
    h.states['sensor.ruckeinspeisung_shelly_messung'].state = '276';
    expect(houseSources(energyNow(h, config))).toEqual({ pv: 510, battery: 0, grid: 0 });
    expect(houseSources(energyNow(coupledHass('300', '500', '120', '620'), config))).toEqual({ pv: 300, battery: 200, grid: 120 });
  });

  it('shows the house split and the chain PV, Akku, Haus, Netz', () => {
    const t = visibleText(renderEnergy(ctx(coupledHass('860', '786'))));
    expect(t).toMatch(/Haus jetzt 2\.440 W/);
    expect(t).toMatch(/Sonne 786 W Akku 0 W Netz 1\.654 W/);
    expect(t).toMatch(/860 W PV 26 % lädt 74 W 786 W ins Haus 1\.654 W Bezug/);
    const raw = templateText(renderEnergy(ctx(coupledHass('860', '786'))));
    expect(raw).toContain('sbar');
    expect(raw).not.toContain('pvline');
  });

  it('at night the Akku delivers and fills the Akku part of the bar', () => {
    const t = visibleText(renderEnergy(ctx(coupledHass('0', '410', '10', '420'))));
    expect(t).toContain('liefert 410 W');
    expect(t).toMatch(/Sonne 0 W Akku 410 W Netz 10 W/);
  });

  it('moves the flow dashes with transform, never by repainting the background', () => {
    const css = String(energyStyles.cssText);
    for (const k of css.matchAll(/@keyframes [\w-]+\s*\{[\s\S]*?\n {2}\}/g)) expect(k[0]).not.toContain('background-position');
    expect(css).toMatch(/@keyframes dash-x[\s\S]*?transform/);
  });

  it('keeps the classic layout without coupling', () => {
    const raw = templateText(renderEnergy(ctx(coupledHass('860', '786', '1654', '2440', {}))));
    expect(raw).not.toContain('pvline');
    expect(raw).not.toContain('aus PV');
  });
});
