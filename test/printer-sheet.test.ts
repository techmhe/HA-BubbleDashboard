import { describe, expect, it } from 'vitest';
import { printerSheet } from '../src/sheets/printer';
import type { PageContext } from '../src/pages/context';
import { NOW } from './fixture';
import { cfg, PLUG, PRINTER, pid, plugCfg, techHass } from './fixture-technik';
import { templateText, visibleText } from './template-text';
import type { CardConfig } from '../src/types';

type Over = Parameters<typeof techHass>[0];

function ctx(over: Over = {}, opts: { config?: CardConfig; buttons?: boolean; user?: 'max' | 'anna' } = {}) {
  const hass = techHass(over, opts.user ?? 'max');
  if (opts.buttons) {
    for (const k of ['pause', 'resume', 'stop']) {
      const id = `button.x2d_musterdrucker_${k}`;
      hass.entities[id] = { entity_id: id, area_id: null, labels: [], device_id: PRINTER, platform: 'bambu_lab', translation_key: k };
      hass.states[id] = { entity_id: id, state: 'unknown', attributes: {}, last_changed: NOW.toISOString(), last_updated: NOW.toISOString() };
    }
  }
  const calls: [string, string, unknown, unknown][] = [];
  const c = {
    hass, config: opts.config ?? plugCfg(), rooms: [], now: NOW, ui: {},
    openSheet() {}, closeSheet() {}, confirm() {}, setUi() {},
    async call(d: string, s: string, data: unknown, target: unknown) { calls.push([d, s, data, target]); },
    dismissed: () => false, dismiss() {}, setPiholePause() {},
    series: () => ({ loading: false, past: [], start: 0, end: 0, total: 11.4 }),
  } as unknown as PageContext;
  return { c, calls };
}

const iso = (min: number) => new Date(NOW.getTime() + min * 60000).toISOString();
const count = (s: string, sub: string) => s.split(sub).length - 1;

describe('printer sheet', () => {
  it('printing: layer once, no pause/stop without control entities', () => {
    const t = visibleText(printerSheet(ctx().c));
    expect(count(t, 'Schicht 182/290')).toBe(1);
    expect(t).toContain('63 %');
    expect(t).toContain('fertig um');
    expect(t).toContain('Halterung');
    expect(t).not.toContain('Pause');
    expect(t).not.toContain('Stopp');
    expect(t).toContain('Düse L');
  });

  it('printing: pause and stop when the integration exposes them', () => {
    const t = visibleText(printerSheet(ctx({}, { buttons: true }).c));
    expect(t).toContain('Pause');
    expect(t).toContain('Stopp');
  });

  it('locks the power button while printing', () => {
    expect(templateText(printerSheet(ctx().c))).toMatch(/tk-power[^"]*locked/);
  });

  it('finished: shows the end time', () => {
    const t = visibleText(printerSheet(ctx({ [pid.status]: { state: 'finish' }, [pid.end]: { state: iso(-30) } }).c));
    expect(t).toContain('fertig um');
    expect(t).toContain('19:00');
    expect(t).toContain('Druckbett 65°');
  });

  it('error by failed only: hint to continue on the printer', () => {
    const t = visibleText(printerSheet(ctx({ [pid.status]: { state: 'failed' }, [pid.end]: { state: iso(-30) } }).c));
    expect(t).toContain('Am Drucker oder in Bambu Handy fortsetzen.');
    expect(t).toContain('Fehler am Drucker');
  });

  it('off: Einschalten turns the plug on', () => {
    const { c, calls } = ctx({ [PLUG]: { state: 'off' }, [pid.status]: { state: 'offline' } });
    const r = printerSheet(c);
    expect(visibleText(r)).toContain('Einschalten');
    const btn = findHandler(r, 'Einschalten');
    btn?.();
    expect(calls).toContainEqual(['switch', 'turn_on', {}, { entity_id: PLUG }]);
  });

  it('starting: wait text', () => {
    const t = visibleText(printerSheet(ctx({ [PLUG]: { state: 'on', minutesAgo: 1 }, [pid.status]: { state: 'offline' } }).c));
    expect(t).toContain('Drucker startet, das dauert etwa 1 min.');
  });

  it('disconnected: text with and without plug', () => {
    const over = { [PLUG]: { state: 'on', minutesAgo: 30 }, [pid.status]: { state: 'unavailable' } };
    expect(visibleText(printerSheet(ctx(over).c))).toContain('Steckdose an, aber keine Verbindung zum Drucker.');
    expect(visibleText(printerSheet(ctx(over, { config: cfg() }).c))).toContain('Keine Verbindung zum Drucker.');
  });

  it('shows nothing to other users', () => {
    expect(templateText(printerSheet(ctx({}, { user: 'anna' }).c))).toBe('');
  });
});

/** Click handler of the first button whose text contains `label`. */
function findHandler(r: unknown, label: string): (() => void) | undefined {
  let found: (() => void) | undefined;
  const walk = (v: unknown): void => {
    if (found || !v || typeof v !== 'object') return;
    if (Array.isArray(v)) return v.forEach(walk);
    const t = v as { strings?: readonly string[]; values?: unknown[] };
    if (t.strings && t.values) {
      t.values.forEach((val, i) => {
        if (found || typeof val !== 'function') return;
        const rest = t.strings!.slice(i + 1).join('');
        const text = templateText({ strings: t.strings!.slice(i + 1), values: t.values!.slice(i + 1) });
        if (/@click=\s*$/.test(t.strings![i]) && text.split('</button>')[0].includes(label) && rest.length) found = val as () => void;
      });
      t.values.forEach(walk);
    }
  };
  walk(r);
  return found;
}
