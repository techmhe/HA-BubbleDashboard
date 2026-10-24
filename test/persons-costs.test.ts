import { describe, expect, it } from 'vitest';
import { makeHass } from './fixture';
import { persons, presenceLabel } from '../src/logic/persons';
import { energyCost, gridTariff } from '../src/logic/energy';

const config = { type: 'custom:ha-start-dashboard' };

const PEOPLE = {
  'person.max_muster': {
    state: 'home',
    attributes: { friendly_name: 'Max Muster', entity_picture: '/api/image/serve/abc/512x512', device_trackers: ['device_tracker.max'], in_zones: ['zone.home'] },
  },
  'person.anna_muster': {
    state: 'Büro Anna ',
    attributes: { friendly_name: 'Anna Muster', device_trackers: ['device_tracker.anna'], in_zones: ['zone.buro_anna'] },
  },
  'person.mqtt': { state: 'unknown', attributes: { friendly_name: 'mqtt', device_trackers: [] } },
  'zone.home': { state: '1', attributes: { friendly_name: 'Home', icon: 'mdi:home' } },
  'zone.buro_anna': { state: '1', attributes: { friendly_name: 'Büro Anna ', icon: 'mdi:briefcase' } },
};

describe('persons', () => {
  it('lists tracked persons with their zone, skipping persons without a tracker', () => {
    const list = persons(makeHass(PEOPLE), config);
    expect(list.map((p) => p.id)).toEqual(['person.anna_muster', 'person.max_muster']);
    expect(list[1]).toMatchObject({ name: 'Max', picture: '/api/image/serve/abc/512x512', place: 'home', zoneName: 'Zu Hause', zoneIcon: 'mdi:home' });
    expect(list[0]).toMatchObject({ name: 'Anna', initials: 'AM', place: 'zone', zoneName: 'Büro Anna', zoneIcon: 'mdi:briefcase' });
  });

  it('marks persons outside every zone as away and finds zones by name without in_zones', () => {
    const hass = makeHass({
      ...PEOPLE,
      'person.max_muster': { state: 'not_home', attributes: { friendly_name: 'Max Muster', device_trackers: ['device_tracker.max'] } },
      'person.anna_muster': { state: 'Büro Anna', attributes: { friendly_name: 'Anna Muster', device_trackers: ['device_tracker.anna'] } },
    });
    const [anna, max] = persons(hass, config);
    expect(max).toMatchObject({ place: 'away', zoneName: 'Unterwegs' });
    expect(anna).toMatchObject({ place: 'zone', zoneIcon: 'mdi:briefcase' });
  });

  it('uses the configured persons in their order', () => {
    const list = persons(makeHass(PEOPLE), { ...config, persons: ['person.max_muster'] });
    expect(list.map((p) => p.id)).toEqual(['person.max_muster']);
  });

  it('summarises who is home', () => {
    const list = persons(makeHass(PEOPLE), config);
    expect(presenceLabel(list)).toBe('1 von 2 da');
    expect(presenceLabel(list.map((p) => ({ ...p, place: 'home' as const })))).toBe('Alle da');
    expect(presenceLabel(list.map((p) => ({ ...p, place: 'away' as const })))).toBe('Niemand da');
  });
});

const PREFS = {
  energy_sources: [
    { type: 'solar', stat_energy_from: 'sensor.pv_kwh' },
    {
      type: 'grid', stat_energy_from: 'sensor.import_kwh', stat_energy_to: 'sensor.export_kwh',
      stat_cost: null, stat_compensation: null, number_energy_price: 0.3, number_energy_price_export: 0.08,
    },
  ],
  device_consumption: [],
};

describe('energy cost', () => {
  it('reads fixed prices and the cost statistics HA keeps for the grid', () => {
    expect(gridTariff(PREFS)).toEqual({
      importPrice: 0.3,
      exportPrice: 0.08,
      costStats: ['sensor.import_kwh_cost'],
      compensationStats: ['sensor.export_kwh_compensation'],
    });
  });

  it('prices import, export and the locally covered energy with fixed prices', () => {
    const c = energyCost(gridTariff(PREFS), { import: 4, export: 2.5, local: 6 });
    expect(c).toEqual({ cost: 1.2, compensation: 0.2, saved: 1.8, net: 1 });
  });

  it('falls back to cost statistics when the price comes from an entity', () => {
    const prefs = {
      ...PREFS,
      energy_sources: [{ type: 'grid', stat_energy_from: 'sensor.import_kwh', stat_energy_to: 'sensor.export_kwh', stat_cost: 'sensor.my_cost', entity_energy_price: 'sensor.price' }],
    };
    const t = gridTariff(prefs);
    expect(t).toMatchObject({ importPrice: null, exportPrice: null, costStats: ['sensor.my_cost'] });
    expect(energyCost(t, { import: 4, export: 0, local: 6 }, { cost: 1.37, compensation: 0 })).toEqual({ cost: 1.37, compensation: 0, saved: null, net: 1.37 });
    expect(energyCost(t, { import: 4, export: 0, local: 6 })).toBeNull();
  });

  it('has no cost without a grid source', () => {
    expect(energyCost(gridTariff({ energy_sources: [], device_consumption: [] }), { import: 1, export: 0, local: 0 })).toBeNull();
  });
});
