import { describe, expect, it } from 'vitest';
import { technikItems } from '../src/logic/technik-now';
import { NOW } from './fixture';
import { cfg, monitorStatus, pid, plugCfg, techHass } from './fixture-technik';

const iso = (min: number) => new Date(NOW.getTime() + min * 60000).toISOString();
const items = (over: Parameters<typeof techHass>[0] = {}, user: 'max' | 'anna' = 'max', dismissed: (k: string) => boolean = () => false, config = plugCfg()) =>
  technikItems(techHass(over, user), config, NOW, { dismissed });

describe('technical Aktuell items', () => {
  it('shows a running print with progress, finish time and remaining time', () => {
    const [p] = items();
    expect(p).toMatchObject({ id: 'print', title: '3D-Druck · 63 %', text: 'Halterung · fertig um 20:42', value: '1:12 h', progress: 0.63, tap: 'printer' });
  });

  it('marks a paused print', () => {
    expect(items({ [pid.status]: { state: 'pause' } })[0].title).toBe('3D-Druck pausiert · 63 %');
  });

  it('shows a finished print until it is dismissed or 12 h old', () => {
    const done = { [pid.status]: { state: 'finish' }, [pid.end]: { state: iso(-30) }, [pid.bed]: { state: '41' } };
    const [d] = items(done);
    expect(d).toMatchObject({ id: 'print-done', title: '3D-Druck fertig', text: 'Halterung · Bett 41°, noch abkühlen', dismiss: { label: 'OK', key: `print-done:${iso(-30)}` } });
    expect(items({ ...done, [pid.bed]: { state: '30' } })[0].text).toBe('Halterung · kann entnommen werden');
    expect(items(done, 'max', (k) => k === `print-done:${iso(-30)}`)).toEqual([]);
    expect(items({ ...done, [pid.end]: { state: iso(-13 * 60) } })).toEqual([]);
  });

  it('shows a failed print as dismissable and an HMS error as not dismissable', () => {
    const [f] = items({ [pid.status]: { state: 'failed' }, [pid.end]: { state: iso(-10) } });
    expect(f).toMatchObject({ id: 'print-error', title: '3D-Druck angehalten', text: 'Fehler am Drucker', tap: 'printer', dismiss: { label: 'OK', key: `print-error:${iso(-10)}` } });
    const [h] = items({ [pid.status]: { state: 'pause' }, [pid.hms]: { state: 'on', attributes: { '1-Error': 'HMS_0700: Filament gerissen' } } });
    expect(h).toMatchObject({ id: 'print-error', text: 'Filament gerissen' });
    expect(h.dismiss).toBeUndefined();
  });

  it('shows nothing for an idle or switched-off printer', () => {
    expect(items({ [pid.status]: { state: 'idle' } })).toEqual([]);
    expect(items({ 'switch.drucker_steckdose': { state: 'off' } })).toEqual([]);
  });

  it('reports one or several services down', () => {
    const one = items({ [pid.status]: { state: 'idle' }, [monitorStatus('Nextcloud')]: { state: 'down', minutesAgo: 5 } });
    expect(one).toEqual([expect.objectContaining({ id: 'services', title: 'Nextcloud nicht erreichbar', text: 'seit 5 min', tap: 'technik' })]);
    const two = items({ [pid.status]: { state: 'idle' }, [monitorStatus('Nextcloud')]: { state: 'down', minutesAgo: 5 }, [monitorStatus('Musterwiki')]: { state: 'down', minutesAgo: 9 } });
    expect(two[0]).toMatchObject({ title: '2 Dienste nicht erreichbar', text: 'Musterwiki · Nextcloud' });
  });

  it('warns about the ad blocker after 70 min off, with a button to turn it on', () => {
    const [p] = items({ [pid.status]: { state: 'idle' }, 'switch.pi_hole': { state: 'off', minutesAgo: 70 } });
    expect(p).toMatchObject({ id: 'pihole', title: 'Werbeblocker aus', text: 'Pi-hole · seit 18:20', tap: 'technik' });
    expect(p.action).toMatchObject({ label: 'Einschalten', domain: 'switch', service: 'turn_on', target: { entity_id: 'switch.pi_hole' } });
    const old = items({ [pid.status]: { state: 'idle' }, 'switch.pi_hole': { state: 'off', minutesAgo: 24 * 60 } });
    expect(old[0].text).toBe('Pi-hole · seit gestern 19:30');
  });

  it('shows nothing technical to other users', () => {
    const all = { [pid.status]: { state: 'failed' }, [monitorStatus('Nextcloud')]: { state: 'down', minutesAgo: 5 }, 'switch.pi_hole': { state: 'off', minutesAgo: 100 } };
    expect(items(all, 'anna')).toEqual([]);
    expect(items(all, 'max', () => false, cfg({ technik: false }))).toEqual([]);
  });
});
