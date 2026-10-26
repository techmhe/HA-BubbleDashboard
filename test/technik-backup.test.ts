import { describe, expect, it } from 'vitest';
import { backupState, BACKUP_STALE_H, technikProblems } from '../src/logic/technik';
import { backupWhen, technikItems, technikProblemCount } from '../src/logic/technik-now';
import { technikHeadline, technikSheet } from '../src/sheets/technik';
import { durationText } from '../src/logic/util';
import type { PageContext } from '../src/pages/context';
import { NOW } from './fixture';
import { cfg, plugCfg, techHass } from './fixture-technik';
import { visibleText } from './template-text';

const BACKUP = 'sensor.backup_letzte_erfolgreiche_automatische_sicherung';
const ago = (h: number) => new Date(NOW.getTime() - h * 3600_000).toISOString();

function withBackup(state: string, user: 'max' | 'anna' = 'max') {
  const hass = techHass({}, user);
  hass.states[BACKUP] = { entity_id: BACKUP, state, attributes: { device_class: 'timestamp' }, last_changed: ago(1), last_updated: ago(1) };
  hass.entities[BACKUP] = { entity_id: BACKUP, area_id: null, labels: [], device_id: null, platform: 'backup', translation_key: 'last_successful_automatic_backup' };
  return hass;
}

const items = (hass: ReturnType<typeof withBackup>) => technikItems(hass, cfg(), NOW, { dismissed: () => false });

function ctx(hass: ReturnType<typeof withBackup>): PageContext {
  return {
    hass, config: plugCfg(), rooms: [], now: NOW, ui: {},
    openSheet() {}, closeSheet() {}, confirm() {}, async call() {}, async runScript() {}, setUi() {},
    dismissed: () => false, dismiss() {}, setPiholePause() {},
    heating: () => [], window: () => ({ kind: 'none' }), forecast: () => ({ loading: false, hourly: [], daily: [], at: 0 }),
  } as unknown as PageContext;
}

describe('backup state', () => {
  it('threshold is 36 h', () => expect(BACKUP_STALE_H).toBe(36));

  it('reads the platform sensor', () => {
    const b = backupState(withBackup(ago(37)), cfg(), NOW)!;
    expect(b.entity).toBe(BACKUP);
    expect(b.ageH).toBeCloseTo(37, 5);
    expect(b.stale).toBe(true);
    expect(backupState(withBackup(ago(35)), cfg(), NOW)!.stale).toBe(false);
  });

  it('falls back to entities.backup_last', () => {
    const hass = techHass();
    hass.states['sensor.my_backup'] = { entity_id: 'sensor.my_backup', state: ago(40), attributes: {}, last_changed: ago(1), last_updated: ago(1) };
    expect(backupState(hass, cfg({ entities: { backup_last: 'sensor.my_backup' } }), NOW)?.stale).toBe(true);
  });

  it('is null without a usable sensor', () => {
    expect(backupState(techHass(), cfg(), NOW)).toBeNull();
    expect(backupState(withBackup('unavailable'), cfg(), NOW)).toBeNull();
    expect(backupState(withBackup('unknown'), cfg(), NOW)).toBeNull();
  });
});

describe('backup in Aktuell', () => {
  it('shows nothing at 35 h', () => expect(items(withBackup(ago(35))).find((i) => i.id === 'backup')).toBeUndefined());

  it('warns tech users at 37 h', () => {
    const i = items(withBackup(ago(37))).find((x) => x.id === 'backup')!;
    expect(i.title).toBe('Backup veraltet');
    expect(i.text).toBe(`letztes erfolgreiches vor ${durationText(37 * 60)}`);
    expect(i.tap).toEqual({ moreInfo: BACKUP });
  });

  it('is hidden from other users and when unavailable', () => {
    expect(items(withBackup(ago(37), 'anna'))).toEqual([]);
    expect(items(withBackup('unavailable')).find((i) => i.id === 'backup')).toBeUndefined();
  });
});

describe('backup as Technik problem', () => {
  it('counts when stale', () => {
    const item = { dismissed: () => false };
    const base = technikProblemCount(withBackup(ago(1)), cfg(), NOW, item);
    expect(technikProblemCount(withBackup(ago(37)), cfg(), NOW, item)).toBe(base + 1);
    expect(technikProblems(withBackup(ago(37)), cfg(), NOW, false)).toBe(1);
  });

  it('sheet shows the stale row and the headline counts it', () => {
    const t = visibleText(technikSheet(ctx(withBackup(ago(37)))));
    expect(t).toContain('Backup');
    expect(t).toContain(`vor ${durationText(37 * 60)}`);
    expect(t).toContain(technikHeadline(1).text);
  });

  it('sheet shows the last backup time when fresh', () => {
    const t = visibleText(technikSheet(ctx(withBackup(ago(2)))));
    expect(t).toContain('Backup');
    expect(t).toMatch(/letztes erfolgreiches heute \d\d:\d\d/);
  });
});

describe('backup date', () => {
  it('older than yesterday is D.M. HH:MM without leading zeros', () => {
    const t = new Date(2026, 2, 5, 14, 5).getTime();
    expect(backupWhen(t, new Date(2026, 2, 9, 10, 0))).toBe('5.3. 14:05');
    expect(backupWhen(t, new Date(2026, 2, 6, 10, 0))).toBe('gestern 14:05');
    expect(backupWhen(t, new Date(2026, 2, 5, 18, 0))).toBe('14:05');
  });
});
