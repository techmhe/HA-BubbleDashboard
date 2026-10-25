import { describe, expect, it } from 'vitest';
import { applyRoomsFilter, roomsView } from '../src/logic/rooms-page';
import { resolveRooms } from '../src/logic/rooms';
import { makeRoomsHass } from './fixture-rooms';

const config = { type: 'custom:ha-start-dashboard' };
const view = (h = makeRoomsHass()) => roomsView(h, config, resolveRooms(h, config));

describe('"An" filter', () => {
  it('keeps only devices that are on and only the room\'s "Alles aus" scene', () => {
    const w = applyRoomsFilter(view(), 'on').find((v) => v.room.slug === 'wohnzimmer')!;
    expect(w.devices.every((d) => d.on)).toBe(true);
    expect(w.devices.map((d) => d.id)).not.toContain('light.sideboard_wohnzimmer');
    expect(w.devices).toHaveLength(4);
    expect(w.scenes.map((s) => s.id)).toEqual(['scene.wohnzimmer_off']);
  });

  it('leaves devices and scenes untouched in the other views', () => {
    const w = applyRoomsFilter(view(), 'all').find((v) => v.room.slug === 'wohnzimmer')!;
    expect(w.devices).toHaveLength(6);
    expect(w.scenes.map((s) => s.id)).toContain('scene.cozy_evening');
  });
});
