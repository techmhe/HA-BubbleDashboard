import { describe, expect, it } from 'vitest';
import { applianceIcon, dropIcon, fanIcon, fanLevel, weatherAnim } from '../src/components/motion';
import { renderClimate } from '../src/pages/climate';
import type { PageContext } from '../src/pages/context';
import { renderOverview } from '../src/pages/overview';
import { renderRooms } from '../src/pages/rooms';
import { resolveRooms } from '../src/logic/rooms';
import { weatherSheet } from '../src/sheets/weather';
import { baseStyles } from '../src/styles';
import { makeHass, NOW } from './fixture';
import { makeRoomsHass } from './fixture-rooms';
import { templateText } from './template-text';

const config = { type: 'custom:ha-start-dashboard' };

function ctx(hass: ReturnType<typeof makeHass>, extra: Partial<PageContext> = {}): PageContext {
  return {
    hass, config, rooms: resolveRooms(hass, config), now: NOW, ui: {}, roomsFilter: 'all',
    openSheet() {}, closeSheet() {}, confirm() {}, async call() {}, async runScript() {}, setUi() {},
    dismissed: () => false, dismiss() {}, target: () => undefined, sceneConfigs: () => ({}), applianceRuns: () => ({}),
    heating: () => [], window: () => ({ kind: 'none' }), forecast: () => ({ loading: false, hourly: [], daily: [], at: 0 }),
    ...extra,
  } as unknown as PageContext;
}

describe('fan icon', () => {
  it('spins only when on, with the speed class of the level', () => {
    expect(templateText(fanIcon(true, 3, 15, '#fff'))).toContain('spin s3');
    expect(templateText(fanIcon(true, 1, 15, '#fff'))).toContain('spin s1');
    expect(templateText(fanIcon(true, 'auto', 15, '#fff'))).toContain('spin s1');
    expect(templateText(fanIcon(false, 3, 15, '#fff'))).not.toContain('spin');
  });

  it('maps purifier attributes to a level', () => {
    expect(fanLevel('on', { preset_mode: 'auto' })).toBe('auto');
    expect(fanLevel('on', { preset_mode: 'sleep', percentage_step: 100 / 3 })).toBe(1);
    expect(fanLevel('on', { percentage: 100, percentage_step: 100 / 3 })).toBe(3);
    expect(fanLevel('on', { percentage: 34, percentage_step: 100 / 3 })).toBe(1);
    expect(fanLevel('on', { percentage: 100, percentage_step: 25 })).toBe(3);
  });
});

describe('appliance and drop icons', () => {
  it('tumbles the drum of washer and dryer and sprays in the dishwasher while running', () => {
    expect(templateText(applianceIcon('washer', true, 16, '#000'))).toContain('tumble');
    expect(templateText(applianceIcon('dryer', true, 16, '#000'))).toContain('tumble');
    expect(templateText(applianceIcon('dishwasher', true, 16, '#000'))).toContain('spray');
    expect(templateText(applianceIcon('washer', false, 16, '#000'))).not.toContain('tumble');
    expect(templateText(applianceIcon('other', true, 16, '#000'))).not.toMatch(/tumble|spray/);
  });

  it('bobs the droplet only when on', () => {
    expect(templateText(dropIcon(true, 15, '#fff'))).toContain('bob');
    expect(templateText(dropIcon(false, 15, '#fff'))).not.toContain('bob');
  });
});

describe('weather icon', () => {
  const cls = (c: string) => templateText(weatherAnim(c, 20, '#fff'));
  it('animates the moving part per condition', () => {
    for (const c of ['rainy', 'pouring', 'lightning-rainy']) expect(cls(c), c).toContain('rain');
    for (const c of ['snowy', 'snowy-rainy']) expect(cls(c), c).toContain('snow');
    for (const c of ['cloudy', 'partlycloudy']) expect(cls(c), c).toContain('drift');
    expect(cls('sunny')).toContain('rays');
    expect(cls('lightning')).toContain('flash');
  });

  it('keeps other conditions static', () => {
    for (const c of ['clear-night', 'fog', 'hail', 'windy']) expect(cls(c), c).not.toMatch(/rain|snow|drift|rays|flash/);
  });

  it('weather sheet head uses the animated template', () => {
    const sheetTpl = weatherSheet(ctx(makeHass()));
    expect(templateText(sheetTpl)).toContain('rain');
  });

  it('overview pill animates the current condition', () => {
    expect(templateText(renderOverview(ctx(makeHass())))).toContain('rain');
  });
});

describe('pages', () => {
  it('rooms: a purifier spins only while on', () => {
    expect(templateText(renderRooms(ctx(makeRoomsHass())))).toContain('spin s1');
    expect(templateText(renderRooms(ctx(makeRoomsHass({ 'fan.luftreiniger_wohnzimmer': { state: 'off' } }))))).not.toContain('spin');
  });

  it('rooms: the dehumidifier droplet bobs only while on', () => {
    expect(templateText(renderRooms(ctx(makeRoomsHass())))).not.toContain('bob');
    expect(templateText(renderRooms(ctx(makeRoomsHass({ 'humidifier.entfeuchter': { state: 'on' } }))))).toContain('bob');
  });

  it('overview: Robby wobbles only while cleaning', () => {
    expect(templateText(renderOverview(ctx(makeHass({ 'vacuum.robby': { state: 'cleaning' } }))))).toContain('wobble');
    expect(templateText(renderOverview(ctx(makeHass())))).not.toContain('wobble');
  });

  it('overview: a running dishwasher sprays', () => {
    const h = makeHass(
      Object.fromEntries(['waschmaschine', 'trockner', 'spulmaschine'].map((s) => [`input_boolean.${s}_fertig`, { minutesAgo: 1000 }])),
      NOW,
      { 'sensor.spulmaschine_power': ['2209', { friendly_name: 'Spülmaschine Power' }, 1] } as never,
    );
    expect(templateText(renderOverview(ctx(h)))).toContain('spray');
  });

  it('klima: only a heating room breathes', () => {
    const t = templateText(renderClimate(ctx(makeHass())));
    expect(t).toContain('breathe');
    const cold = templateText(renderClimate(ctx(makeHass({ 'input_boolean.heizbetrieb': { state: 'off' } }))));
    expect(cold.includes('breathe')).toBe(cold.includes('kroom heat'));
  });
});

describe('reduced motion', () => {
  const css = baseStyles.cssText;
  const reduced = css.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?\})\s*\}/)?.[1] ?? '';

  it('disables every class animated by this task', () => {
    for (const c of ['spin', 'tumble', 'spray', 'bob', 'wobble', 'breathe']) {
      expect(css, c).toMatch(new RegExp(`\\.${c}\\b[^{]*\\{[^}]*animation:`));
      expect(reduced, c).toContain(`.${c}`);
    }
    expect(reduced).toContain('animation: none');
  });

  it('disables the weather icon animations too', () => {
    for (const c of ['rain', 'snow', 'drift', 'rays', 'flash']) {
      expect(css, c).toMatch(new RegExp(`\\.${c}\\b[^{]*\\{[^}]*animation:`));
      expect(reduced, c).toContain(`.${c}`);
    }
  });

  it('never loops faster than 0.6 s', () => {
    for (const m of css.matchAll(/animation:\s*[\w-]+\s+([\d.]+)s/g)) expect(Number(m[1])).toBeGreaterThanOrEqual(0.6);
  });
});

describe('final review fixes', () => {
  it('auto and sleep purifier modes spin slowly, manual level 2 at medium speed', () => {
    expect(templateText(fanIcon(true, fanLevel('on', { preset_mode: 'sleep' }), 15, '#fff'))).toContain('spin s1');
    expect(templateText(fanIcon(true, 2, 15, '#fff'))).toContain('spin s2');
    expect(templateText(fanIcon(true, 'auto', 15, '#fff'))).not.toContain('s2');
  });

  it('lightning-rainy keeps the bolt and animates only the drops', () => {
    const t = templateText(weatherAnim('lightning-rainy', 20, '#fff'));
    expect(t).toContain('M13 12l-3 5h4l-3 5');
    expect(t).toContain('rain');
    expect(t).not.toContain('flash');
  });
});
