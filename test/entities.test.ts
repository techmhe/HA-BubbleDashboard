import { describe, expect, it } from 'vitest';
import { ent, ENTITY_DEFAULTS, filterAlarmIds, scriptService } from '../src/logic/entities';
import { nowItems, statusBubbles } from '../src/logic/overview';
import { resolveRooms } from '../src/logic/rooms';
import { makeHass, NOW } from './fixture';

const cfg = { type: 'custom:ha-start-dashboard' };

describe('configurable entities', () => {
  it('falls back to the defaults', () => {
    expect(ent(cfg, 'gusts')).toBe(ENTITY_DEFAULTS.gusts);
    expect(filterAlarmIds(cfg)).toContain('binary_sensor.flur_1_og_klimaanlage_filteralarm');
  });
  it('prefers entities: over legacy top-level keys over defaults', () => {
    expect(ent({ ...cfg, weather: 'weather.legacy' }, 'weather')).toBe('weather.legacy');
    expect(ent({ ...cfg, weather: 'weather.legacy', entities: { weather: 'weather.new' } }, 'weather')).toBe('weather.new');
    expect(filterAlarmIds({ ...cfg, entities: { filter_alarms: ['binary_sensor.x'] } })).toEqual(['binary_sensor.x']);
  });
  it('turns a script entity into its service name', () => {
    expect(scriptService('script.luften_starten')).toEqual(['script', 'luften_starten']);
  });
  it('uses configured entities in the status logic', () => {
    const h = makeHass({ 'sensor.my_import': { state: '42' } });
    const b = statusBubbles(h, { ...cfg, entities: { grid_import: 'sensor.my_import' } });
    expect(b[2].value).toBe('42 W');
    const g = makeHass({ 'sensor.boeen': { state: '70' } });
    const items = nowItems(g, { ...cfg, entities: { gusts: 'sensor.boeen' } }, resolveRooms(g, cfg), NOW);
    expect(items.find((i) => i.id === 'storm')?.text).toBe('Böen bis 70 km/h');
  });
});

describe('service calls use target, not entity_id in data', () => {
  it('appliance OK action targets the helper', () => {
    const h = makeHass({ 'input_boolean.trockner_fertig': { state: 'on' } });
    const item = nowItems(h, cfg, [], NOW).find((i) => i.id === 'input_boolean.trockner_fertig')!;
    expect(item.action).toMatchObject({ domain: 'input_boolean', service: 'turn_off', target: { entity_id: 'input_boolean.trockner_fertig' } });
    expect(item.action!.data).toEqual({});
  });
});
