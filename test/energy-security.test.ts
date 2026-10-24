import { describe, expect, it } from 'vitest';
import { consumers, energyHeadline, energyNow, energyToday } from '../src/logic/energy';
import { alarmInfo, openings, openingsSummary } from '../src/logic/security';
import { resolveRooms } from '../src/logic/rooms';
import { NOW } from './fixture';
import { makeHass } from './fixture';
import { ENERGY_EXTRAS, makeM4Hass, SECURITY_EXTRAS } from './fixture-m4';
import { ROOM_EXTRAS } from './fixture-rooms';

const config = { type: 'custom:ha-start-dashboard' };

describe('energy now', () => {
  it('reads PV, house, grid and battery', () => {
    expect(energyNow(makeM4Hass(), config)).toEqual({
      pv: 0, house: 790, import: 775.4, export: 0, battery: { soc: 25, power: 16 },
    });
  });

  it('describes the situation with the part of day', () => {
    const h = makeM4Hass();
    expect(energyHeadline(NOW, energyNow(h, config))).toBe('Abend · PV aus, Strom kommt aus dem Netz');
    const noon = new Date(2026, 9, 24, 12, 0);
    expect(energyHeadline(noon, { pv: 2400, house: 600, import: 0, export: 1800, battery: null })).toBe('Mittag · Sonne liefert, Überschuss geht ins Netz');
    expect(energyHeadline(noon, { pv: 300, house: 600, import: 300, export: 0, battery: null })).toBe('Mittag · PV deckt 50 %, Rest aus dem Netz');
    expect(energyHeadline(noon, { pv: 600, house: 600, import: 0, export: 0, battery: null })).toBe('Mittag · PV deckt den Verbrauch');
    expect(energyHeadline(NOW, { pv: 0, house: 300, import: 10, export: 0, battery: { soc: 60, power: 290 } })).toBe('Abend · Akku versorgt das Haus');
  });
});

describe('energy today', () => {
  it('computes consumption, autarky and self-use', () => {
    const t = energyToday(makeM4Hass(), config);
    expect(t.pv).toBeCloseTo(6.5);
    expect(t.consumed).toBeCloseTo(8.3);
    expect(t.local).toBeCloseTo(3.6);
    expect(t.autarky).toBe(43);
    expect(t.selfUse).toBe(55);
  });

  it('treats unknown daily meters as zero and leaves self-use empty without PV', () => {
    const t = energyToday(makeM4Hass({ 'sensor.pv_heute': { state: 'unknown' }, 'sensor.einspeisung_heute': { state: 'unknown' } }), config);
    expect(t.pv).toBe(0);
    expect(t.consumed).toBeCloseTo(4.7);
    expect(t.autarky).toBe(0);
    expect(t.selfUse).toBeNull();
  });
});

describe('consumers', () => {
  it('lists measured devices with an area plus the untracked rest, largest first', () => {
    const c = consumers(makeM4Hass(), config);
    expect(c.map((x) => [x.name, x.value])).toEqual([
      ['Nicht erfasst', 694],
      ['Heimkino', 291],
      ['Netzwerkschrank', 71],
      ['Sideboard Wohnzimmer', 18.25],
    ]);
    expect(c[0].untracked).toBe(true);
  });

  it('skips grid meter devices, PoE ports, Powercalc duplicates and zero values', () => {
    const ids = consumers(makeM4Hass(), config).map((x) => x.id);
    expect(ids).not.toContain('sensor.stromzahler_shelly_phase_a_active_power');
    expect(ids).not.toContain('sensor.core01_port_1_poe_power');
    expect(ids).not.toContain('sensor.heimkino_device_power');
    expect(ids).not.toContain('sensor.kuhlschrank_power');
  });

  it('shows negative readings as positive values', () => {
    const c = consumers(makeM4Hass({ 'sensor.netzwerkschrank_power': { state: '-71' } }), config);
    expect(c.find((x) => x.name === 'Netzwerkschrank')?.value).toBe(71);
  });
});

describe('openings', () => {
  const groups = () => {
    const h = makeM4Hass();
    return openings(h, config, resolveRooms(h, config));
  };

  it('groups contact sensors by floor and area, EG first', () => {
    const g = groups();
    expect(g.map((f) => f.name)).toEqual(['Erdgeschoss', 'Obergeschoss']);
    expect(g[0].areas.map((a) => a.name)).toEqual(['Wohnzimmer', 'Küche & Essen', 'Flur EG', 'Esszimmer']);
  });

  it('names windows and doors without sensor and room words', () => {
    const eg = groups()[0].areas;
    const wz = eg.find((a) => a.id === 'wohnzimmer')!;
    expect(wz.items.map((i) => [i.title, i.kind, i.open])).toEqual([
      ['Fenster', 'window', false],
      ['Straße 1', 'window', false],
      ['Straße 2', 'window', true],
    ]);
    expect(eg.find((a) => a.id === 'flur_eg')!.items.map((i) => [i.title, i.kind])).toEqual([['Haustür', 'door'], ['Fenster', 'window']]);
    expect(eg.find((a) => a.id === 'esszimmer_kuche')!.items.map((i) => [i.title, i.kind])).toEqual([['Tür', 'door']]);
  });

  it('drops dotted area words like 1.OG from titles', () => {
    const h = makeHass({}, NOW, {
      ...ROOM_EXTRAS, ...ENERGY_EXTRAS, ...SECURITY_EXTRAS,
      'binary_sensor.fenstersensor_1_og_contact': ['off', { device_class: 'door', friendly_name: 'Fenstersensor 1.OG' }, 30, { area: 'flur_1_og' }],
    });
    const og = openings(h, config, resolveRooms(h, config))[1].areas.find((a) => a.id === 'flur_1_og')!;
    expect(og.items.map((i) => i.title)).toEqual(['Fenster', 'Fenster']);
  });

  it('uses the room name for single-area rooms and the area name otherwise', () => {
    const h = makeM4Hass();
    const cfg = { ...config, rooms: [{ slug: 'wohnzimmer', name: 'Wohnbereich' }, { slug: 'kuche_esszimmer', name: 'Küche & Esszimmer', areas: ['kuche', 'esszimmer_kuche'] }] };
    const names = openings(h, cfg, resolveRooms(h, cfg))[0].areas.map((a) => a.name);
    expect(names).toEqual(['Wohnbereich', 'Küche & Essen', 'Esszimmer', 'Flur EG']);
  });

  it('leaves out thermostat-derived and printer sensors', () => {
    const ids = groups().flatMap((f) => f.areas.flatMap((a) => a.items.map((i) => i.id)));
    expect(ids).not.toContain('binary_sensor.vtherm_wohnzimmer_window_state');
    expect(ids).not.toContain('binary_sensor.x2d_gehausetur');
    expect(ids).toHaveLength(12);
  });

  it('summarises open and closed', () => {
    expect(openingsSummary(groups(), 'disarmed')).toBe('1 offen · 11 von 12 zu');
    const h = makeM4Hass({ 'binary_sensor.fenstersensor_wohnzimmer_strasse_2_contact': { state: 'off' } });
    const g = openings(h, config, resolveRooms(h, config));
    expect(openingsSummary(g, 'disarmed')).toBe('Alles ruhig · 12 von 12 zu');
    expect(openingsSummary(g, 'triggered')).toBe('Alarm ausgelöst! · 12 von 12 zu');
  });
});

describe('alarm info', () => {
  it('shows the state and when it last triggered', () => {
    expect(alarmInfo(makeM4Hass(), config, NOW)).toMatchObject({ state: 'disarmed', label: 'Alarm unscharf', sub: 'zuletzt ausgelöst 5. Aug.' });
  });

  it('falls back to the time of the last change', () => {
    const h = makeM4Hass({ 'alarm_control_panel.alarmo': { state: 'armed_away', attributes: { last_triggered: null } } });
    expect(alarmInfo(h, config, NOW)).toMatchObject({ label: 'Alarm: Abwesend', sub: 'seit 19:20' });
  });
});
