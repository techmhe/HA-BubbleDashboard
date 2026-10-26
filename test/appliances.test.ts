import { describe, expect, it } from 'vitest';
import { applianceRun, findAppliances, type PowerPoint } from '../src/logic/appliances';
import { nowItems } from '../src/logic/overview';
import { resolveRooms } from '../src/logic/rooms';
import type { CardConfig } from '../src/types';
import { makeHass, NOW } from './fixture';

const cfg: CardConfig = { type: 'custom:ha-start-dashboard' };
const min = (m: number) => NOW.getTime() - m * 60_000;
const at = (h: number, m: number) => new Date(2026, 9, 24, h, m).getTime();

const FLAGS_OLD = Object.fromEntries(['waschmaschine', 'trockner', 'spulmaschine'].map((s) => [`input_boolean.${s}_fertig`, { minutesAgo: 1000 }]));

const POWER: Record<string, [string, Record<string, unknown>?, number?]> = {
  'sensor.spulmaschine_power': ['2209', { friendly_name: 'Spülmaschine Power' }, 1],
  'sensor.spulmaschine_device_power': ['5', {}, 1],
  'sensor.trockner_power': ['0', {}, 1],
  'sensor.waschmaschine_power': ['0', {}, 1],
};

function setup(ov: Parameters<typeof makeHass>[0] = {}, config = cfg, history?: Record<string, PowerPoint[]>) {
  const extra = Object.fromEntries(Object.entries(POWER).map(([id, [s, a, ago]]) => [id, [s, a ?? {}, ago]]));
  const h = makeHass({ ...FLAGS_OLD, ...ov }, NOW, extra as never);
  const items = nowItems(h, config, resolveRooms(h, config), NOW, [], undefined, [], history ?? {});
  return { h, items, appliance: items.find((i) => i.id === 'appliance:spulmaschine') };
}

const dish = (config = cfg) => {
  const h = makeHass(FLAGS_OLD, NOW, Object.fromEntries(Object.entries(POWER).map(([id, [s, a, ago]]) => [id, [s, a ?? {}, ago]])) as never);
  return { h, a: findAppliances(h, config).find((x) => x.slug === 'spulmaschine')! };
};

describe('appliance detection', () => {
  it('pairs the fertig flag with sensor.<slug>_power, never _device_power', () => {
    const { h } = dish();
    const found = findAppliances(h, cfg);
    expect(found.map((a) => a.slug).sort()).toEqual(['spulmaschine', 'trockner', 'waschmaschine']);
    const a = found.find((x) => x.slug === 'spulmaschine')!;
    expect(a).toEqual({ slug: 'spulmaschine', name: 'Spülmaschine', power: 'sensor.spulmaschine_power', done: 'input_boolean.spulmaschine_fertig', kind: 'dishwasher' });
    expect(found.find((x) => x.slug === 'trockner')!.kind).toBe('dryer');
    expect(found.find((x) => x.slug === 'waschmaschine')!.kind).toBe('washer');
  });

  it('ignores a fertig flag without power sensor', () => {
    const h = makeHass();
    expect(findAppliances(h, cfg)).toEqual([]);
  });

  it('config overrides the detection', () => {
    const { h } = dish();
    const found = findAppliances(h, { ...cfg, appliances: [{ name: 'Kaffeemaschine', power: 'sensor.trockner_power', done: 'input_boolean.trockner_fertig' }] });
    expect(found).toEqual([{ slug: 'trockner', name: 'Kaffeemaschine', power: 'sensor.trockner_power', done: 'input_boolean.trockner_fertig', kind: 'dryer' }]);
    const other = findAppliances(h, { ...cfg, appliances: [{ name: 'Ofen', power: 'sensor.x_power', done: 'input_boolean.ofen_fertig' }] });
    expect(other[0]).toMatchObject({ slug: 'ofen', kind: 'other' });
  });
});

describe('running appliances', () => {
  it('running now', () => {
    const { appliance } = setup({}, cfg, { 'sensor.spulmaschine_power': [{ t: at(18, 5), w: 2200 }] });
    expect(appliance).toMatchObject({ title: 'Spülmaschine läuft', text: 'seit 18:05 · 2.209 W', color: '#5ac8fa', tap: { moreInfo: 'sensor.spulmaschine_power' } });
    expect(appliance!.action).toBeUndefined();
  });

  it('drying pause: low now, high 12 min ago', () => {
    const { h, a } = dish();
    h.states[a.power].state = '2';
    const hist = [{ t: at(18, 5), w: 2200 }, { t: min(12), w: 2 }];
    expect(applianceRun(h, a, NOW, hist)).toMatchObject({ running: true, since: at(18, 5), power: 2 });
  });

  it('stopped: last high 20 min ago', () => {
    const { h, a } = dish();
    h.states[a.power].state = '2';
    expect(applianceRun(h, a, NOW, [{ t: at(18, 5), w: 2200 }, { t: min(20), w: 2 }]).running).toBe(false);
  });

  it('since starts after the last gap of 15 min below 10 W', () => {
    const { h, a } = dish();
    const hist = [{ t: min(200), w: 500 }, { t: min(150), w: 1 }, { t: min(60), w: 300 }];
    expect(applianceRun(h, a, NOW, hist).since).toBe(min(60));
  });

  it('done wins', () => {
    const { items } = setup({ 'input_boolean.spulmaschine_fertig': { state: 'on' } }, cfg, { 'sensor.spulmaschine_power': [{ t: at(18, 5), w: 2200 }] });
    expect(items.find((i) => i.id === 'appliance:spulmaschine')).toBeUndefined();
    expect(items.find((i) => i.id === 'input_boolean.spulmaschine_fertig')).toBeDefined();
  });

  it('after done: readings before the flag changed do not count', () => {
    const { h, a } = dish({ ...cfg });
    h.states[a.power].state = '2';
    h.states[a.done].last_changed = new Date(min(5)).toISOString();
    expect(applianceRun(h, a, NOW, [{ t: min(30), w: 2200 }, { t: min(8), w: 2 }]).running).toBe(false);
  });

  it('no history: live power only, no since', () => {
    const { h, a } = dish();
    expect(applianceRun(h, a, NOW, undefined)).toEqual({ running: true, power: 2209 });
    const { items } = setup();
    expect(items.find((i) => i.id === 'appliance:spulmaschine')).toMatchObject({ text: '2.209 W' });
  });

  it('idle without history is not running', () => {
    const { h, a } = dish();
    h.states[a.power].state = '3';
    expect(applianceRun(h, a, NOW, undefined).running).toBe(false);
  });
});

describe('final review fixes', () => {
  it('a reading older than the done flag does not count after OK', () => {
    const { h, a } = dish();
    h.states[a.done] = { ...h.states[a.done], state: 'off', last_changed: new Date(min(5)).toISOString() };
    h.states[a.power] = { ...h.states[a.power], state: '12', last_changed: new Date(min(60)).toISOString() };
    expect(applianceRun(h, a, NOW, [{ t: min(90), w: 12 }]).running).toBe(false);
  });

  it('a reading newer than the done flag still counts', () => {
    const { h, a } = dish();
    h.states[a.done] = { ...h.states[a.done], state: 'off', last_changed: new Date(min(30)).toISOString() };
    h.states[a.power] = { ...h.states[a.power], state: '12', last_changed: new Date(min(5)).toISOString() };
    expect(applianceRun(h, a, NOW, [{ t: min(90), w: 12 }]).running).toBe(true);
  });

  it('a configured done entity without domain never throws', () => {
    const { h } = dish();
    const found = findAppliances(h, { ...cfg, appliances: [{ name: 'Spüler', power: 'sensor.spulmaschine_power', done: 'spulmaschine_fertig' }] });
    expect(found.every((a) => typeof a.slug === 'string')).toBe(true);
    expect(() => findAppliances(h, { ...cfg, appliances: [{ name: 'X', power: 'sensor.x', done: '' }] })).not.toThrow();
  });
});
