import { describe, expect, it } from 'vitest';
import { devicePower, lightCaps, lightPresets, lightTone, purifierState, sheetKind } from '../src/logic/devices';
import { applyRoomsFilter, minutesUntil, roomPower, roomsFilters, roomsHeader, roomsView } from '../src/logic/rooms-page';
import { resolveRooms } from '../src/logic/rooms';
import { NOW } from './fixture';
import { makeRoomsHass, ROOM_EXTRAS } from './fixture-rooms';

const config = { type: 'custom:ha-start-dashboard' };

function view(h = makeRoomsHass()) {
  return roomsView(h, config, resolveRooms(h, config));
}

describe('roomsView', () => {
  it('lists OG rooms first, then EG, then areas without floor that hold devices', () => {
    expect(view().map((v) => v.room.slug)).toEqual([
      'arbeitszimmer_anna', 'arbeitszimmer_max', 'badezimmer', 'schlafzimmer', 'flur_1_og',
      'wohnzimmer', 'kuche_esszimmer', 'flur_eg',
      'garten',
    ]);
  });

  it('adds a room for an area with labelled devices but no climate room', () => {
    const g = view().find((v) => v.room.slug === 'garten')!;
    expect(g.room.name).toBe('Garten');
    expect(g.devices.map((d) => d.id)).toEqual(['switch.brunnen']);
    expect(g.sub).toBe('alles aus');
  });

  it('counts devices that are on and builds the sub line with the floor', () => {
    const w = view().find((v) => v.room.slug === 'wohnzimmer')!;
    expect(w.devices.map((d) => d.id)).toEqual([
      'fan.luftreiniger_wohnzimmer',
      'light.wohnzimmer_stehlampe',
      'light.wohnzimmer_vasenleuchte',
      'light.sideboard_wohnzimmer',
      'switch.heimkino',
      'humidifier.entfeuchter',
    ]);
    expect(w.sub).toBe('EG · 4 von 6 an');
    expect(w.active).toBe(true);
    expect(view().find((v) => v.room.slug === 'badezimmer')!.sub).toBe('OG · keine Geräte');
  });

  it('shows brightness, power or An/Aus on the tiles', () => {
    const h = makeRoomsHass({ 'light.wohnzimmer_vasenleuchte': { attributes: { brightness: 3 } } });
    const w = view(h).find((v) => v.room.slug === 'wohnzimmer')!;
    const st = Object.fromEntries(w.devices.map((d) => [d.id, d.tileState]));
    expect(st['switch.heimkino']).toBe('291 W');
    expect(st['light.wohnzimmer_vasenleuchte']).toBe('1 %');
    expect(st['light.wohnzimmer_stehlampe']).toBe('An');
    expect(st['light.sideboard_wohnzimmer']).toBe('Aus');
  });

  it('marks unavailable devices', () => {
    const h = makeRoomsHass({ 'light.sideboard_wohnzimmer': { state: 'unavailable' } });
    const d = view(h).find((v) => v.room.slug === 'wohnzimmer')!.devices.find((x) => x.id === 'light.sideboard_wohnzimmer')!;
    expect(d.unavailable).toBe(true);
    expect(d.tileState).toBe('n. v.');
  });
});

describe('room power', () => {
  it('uses the exact sensor, sums partial matches, and returns null when nothing matches', () => {
    const h = makeRoomsHass();
    const rooms = resolveRooms(h, config);
    const by = (slug: string) => roomPower(h, rooms.find((r) => r.slug === slug)!);
    expect(by('wohnzimmer')).toBeCloseTo(319.3);
    expect(by('kuche_esszimmer')).toBeCloseTo(13.4);
    expect(by('flur_eg')).toBeNull();
  });

  it('honours power sensors from the room config', () => {
    const h = makeRoomsHass();
    const rooms = resolveRooms(h, { ...config, rooms: [{ slug: 'flur_eg', power: ['sensor.kuche_leistung'] }] });
    expect(roomPower(h, rooms[0])).toBeCloseTo(7.8);
  });
});

describe('header and filters', () => {
  it('summarises lights and other devices that are on', () => {
    expect(roomsHeader(view())).toBe('5 Lichter · 2 Geräte an');
    const off = Object.fromEntries(
      Object.keys(makeRoomsHass().states).filter((id) => /^(light|switch|fan)\./.test(id)).map((id) => [id, { state: 'off' }]),
    );
    expect(roomsHeader(view(makeRoomsHass(off)))).toBe('Alles aus');
  });

  it('offers Alle, An and one filter per floor (highest first)', () => {
    const h = makeRoomsHass();
    expect(roomsFilters(h, view(h)).map((f) => f.label)).toEqual(['Alle', 'An', 'OG', 'EG']);
  });

  it('filters by on-state and floor', () => {
    const v = view();
    expect(applyRoomsFilter(v, 'on').map((x) => x.room.slug)).toEqual(['flur_1_og', 'wohnzimmer', 'flur_eg']);
    expect(applyRoomsFilter(v, 'og')).toHaveLength(5);
    expect(applyRoomsFilter(v, 'all')).toHaveLength(9);
  });
});

describe('device helpers', () => {
  it('picks the sheet by device type', () => {
    const h = makeRoomsHass();
    expect(sheetKind(h, 'light.sideboard_wohnzimmer')).toBe('light');
    expect(sheetKind(h, 'light.wohnzimmer_stehlampe')).toBe('switch');
    expect(sheetKind(h, 'switch.heimkino')).toBe('switch');
    expect(sheetKind(h, 'fan.luftreiniger_wohnzimmer')).toBe('purifier');
    expect(sheetKind(h, 'humidifier.entfeuchter')).toBe('dehumidifier');
  });

  it('prefers the measured power sensor over Powercalc', () => {
    const h = makeRoomsHass();
    expect(devicePower(h, 'switch.heimkino')).toEqual({ id: 'sensor.heimkino_power', value: 291 });
    expect(devicePower(h, 'light.sideboard_wohnzimmer')).toEqual({ id: 'sensor.sideboard_wohnzimmer_power', value: 18.25 });
    expect(devicePower(h, 'light.wohnzimmer_stehlampe')).toBeNull();
  });

  it('reads light capabilities and offers matching presets', () => {
    const caps = lightCaps(ROOM_EXTRAS['light.sideboard_wohnzimmer'][1]!);
    expect(caps).toEqual({ brightness: true, colorTemp: { min: 2000, max: 6666 }, color: true, effects: ['blink', 'colorloop'] });
    expect(lightPresets(caps).map((p) => [p.name, p.data])).toEqual([
      ['Lesen', { brightness_pct: 100, color_temp_kelvin: 4000 }],
      ['Gemütlich', { brightness_pct: 40, color_temp_kelvin: 2700 }],
      ['Farbschleife', { effect: 'colorloop' }],
    ]);
    expect(lightCaps({ supported_color_modes: ['onoff'] }).brightness).toBe(false);
    expect(lightPresets(lightCaps({ supported_color_modes: ['brightness'] })).map((p) => p.name)).toEqual(['Lesen', 'Gemütlich']);
  });

  it('names the colour tone', () => {
    expect(lightTone({ color_mode: 'color_temp', color_temp_kelvin: 6535 })).toBe('kaltweiß');
    expect(lightTone({ color_mode: 'color_temp', color_temp_kelvin: 4000 })).toBe('neutralweiß');
    expect(lightTone({ color_mode: 'color_temp', color_temp_kelvin: 2700 })).toBe('warmweiß');
    expect(lightTone({ color_mode: 'xy' })).toBe('farbig');
    expect(lightTone({ color_mode: 'brightness' })).toBeUndefined();
  });

  it('derives purifier mode and level', () => {
    const base = { preset_modes: ['auto', 'sleep'], percentage_step: 100 / 3 };
    expect(purifierState('on', { ...base, preset_mode: 'auto', percentage: null })).toEqual({ mode: 'auto', level: null, levels: 3 });
    expect(purifierState('on', { ...base, preset_mode: null, percentage: 67 })).toEqual({ mode: 'manual', level: 2, levels: 3 });
    expect(purifierState('off', { ...base, preset_mode: null, percentage: 0 })).toEqual({ mode: 'off', level: null, levels: 3 });
  });
});

describe('minutesUntil', () => {
  it('counts to the next occurrence of a clock time', () => {
    expect(minutesUntil(NOW, '21:00')).toBe(90);
    expect(minutesUntil(NOW, '19:00')).toBe(1410);
    expect(minutesUntil(NOW, '19:30')).toBe(1440);
  });
});
