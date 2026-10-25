import { describe, expect, it } from 'vitest';
import { I, weatherIcon } from '../src/icons';
import { batteryNote } from '../src/logic/energy';
import { roomSummaries, statusBubbles } from '../src/logic/overview';
import { robbyStatus } from '../src/logic/robby';
import { resolveRooms } from '../src/logic/rooms';
import { makeHass } from './fixture';
import { makeM5Hass } from './fixture-m5';

const cfg = { type: 'custom:ha-start-dashboard' };

describe('review fixes', () => {
  it('shows a moon for clear nights', () => {
    expect(weatherIcon('clear-night')).toBe(I.moon);
    expect(weatherIcon('sunny')).toBe(I.sun);
  });

  it('tells recommended airing apart from an open window on the overview pills', () => {
    const h = makeHass({ 'binary_sensor.fenster_flur_1_og': { state: 'on' } });
    const s = roomSummaries(h, resolveRooms(h, cfg));
    const note = (slug: string) => s.find((r) => r.room.slug === slug)!.note;
    const anna = s.find((r) => r.room.slug === 'arbeitszimmer_anna')!;
    expect(anna).toMatchObject({ note: 'heizt', recommend: true });
    expect(note('flur_1_og')).toBe('lüftet');
  });

  it('says Geladen once Robby is full', () => {
    const full = makeM5Hass();
    expect(statusBubbles(full, cfg)[0].value).toBe('Geladen');
    const h = makeM5Hass({ 'sensor.robby_batterie': { state: '60' } });
    expect(robbyStatus(h, cfg).label).toBe('Lädt · 60 %');
    expect(statusBubbles(h, cfg)[0].value).toBe('Dockt');
  });

  it('explains an idle battery at its reserve or when full', () => {
    const bat = { reserve: 25, full: 95 };
    expect(batteryNote({ soc: 25, power: 4 }, bat)).toBe('Reserve');
    expect(batteryNote({ soc: 96, power: 0 }, bat)).toBe('voll');
    expect(batteryNote({ soc: 25, power: 300 }, bat)).toBeNull();
    expect(batteryNote({ soc: 60, power: 0 }, bat)).toBeNull();
    expect(batteryNote({ soc: 20, power: 0 }, undefined)).toBeNull();
    expect(batteryNote({ soc: 100, power: 0 }, undefined)).toBe('voll');
  });
});
