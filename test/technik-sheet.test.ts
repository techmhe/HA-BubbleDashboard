import { describe, expect, it } from 'vitest';
import { technikHeadline, technikSheet } from '../src/sheets/technik';
import { renderOverview } from '../src/pages/overview';
import type { PageContext } from '../src/pages/context';
import { NOW } from './fixture';
import { monitorStatus, plugCfg, techHass } from './fixture-technik';
import { templateText, visibleText } from './template-text';

function ctx(over: Parameters<typeof techHass>[0] = {}, user: 'max' | 'anna' = 'max', extra: Partial<PageContext> = {}): PageContext {
  const hass = techHass(over, user);
  return {
    hass, config: plugCfg(), rooms: [], now: NOW, ui: {},
    openSheet() {}, closeSheet() {}, confirm() {}, async call() {}, async runScript() {}, setUi() {},
    dismissed: () => false, dismiss() {}, setPiholePause() {},
    heating: () => [], window: () => ({ kind: 'none' }), forecast: () => ({ loading: false, hourly: [], daily: [], at: 0 }),
    ...extra,
  } as unknown as PageContext;
}

describe('technik headline', () => {
  it('counts problems', () => {
    expect(technikHeadline(0)).toEqual({ text: 'alles in Ordnung', alert: false });
    expect(technikHeadline(1)).toEqual({ text: '1 Meldung', alert: true });
    expect(technikHeadline(2)).toEqual({ text: '2 Meldungen', alert: true });
  });
});

describe('technik button', () => {
  it('is shown to tech users only, with a red dot for problems', () => {
    expect(templateText(renderOverview(ctx({}, 'anna')))).not.toContain('tech-btn');
    const ok = templateText(renderOverview(ctx()));
    expect(ok).toContain('tech-btn');
    expect(ok).not.toContain('tech-dot');
    expect(templateText(renderOverview(ctx({ [monitorStatus('Nextcloud')]: { state: 'down', minutesAgo: 5 } })))).toContain('tech-dot');
  });
});

describe('technik sheet', () => {
  it('lists problem services and the rest as a collapsed row', () => {
    const t = visibleText(technikSheet(ctx({ [monitorStatus('Nextcloud')]: { state: 'down', minutesAgo: 5 } })));
    expect(t).toContain('1 Meldung');
    expect(t).toContain('Nextcloud down seit 5 min');
    expect(t).toContain('5 von 6 ok · Uptime Kuma');
    expect(t).toContain('3 weitere erreichbar');
    expect(t).not.toContain('Musterwiki');
  });

  it('expands the full list', () => {
    const t = visibleText(technikSheet(ctx({}, 'max', { ui: { servicesOpen: true } })));
    expect(t).toContain('alle 6 erreichbar');
    expect(t).toContain('Musterwiki');
    expect(t).toContain('DNS');
  });

  it('shows the ad blocker, guest WLAN and printer row', () => {
    const t = visibleText(technikSheet(ctx()));
    expect(t).toContain('Werbeblocker an');
    expect(t).toContain('heute 9 % aller Anfragen blockiert');
    expect(t).toContain('5 min pausieren');
    expect(t).toContain('Gäste-WLAN');
    expect(t).toContain('an · 1 Gerät');
    expect(t).toContain('3D-Drucker');
    expect(t).not.toContain('NAS');
    expect(templateText(technikSheet(ctx()))).toContain('image.gaeste_wlan_qr_code');
  });

  it('shows a running pause with a countdown', () => {
    const t = visibleText(technikSheet(ctx({ 'switch.pi_hole': { state: 'off', minutesAgo: 1 } }, 'max', { piholePause: NOW.getTime() + 222_000 })));
    expect(t).toContain('Pausiert noch 3:42');
    expect(t).toContain('Fortsetzen');
  });

  it('shows nothing to other users', () => {
    expect(templateText(technikSheet(ctx({}, 'anna')))).toBe('');
  });
});
