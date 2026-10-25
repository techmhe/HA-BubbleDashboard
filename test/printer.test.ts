import { describe, expect, it } from 'vitest';
import { amsNote, amsSlots, findPrinter, powerLocked, printerState } from '../src/logic/printer';
import { NOW } from './fixture';
import { cfg, PLUG, pid, plugCfg, techHass } from './fixture-technik';

const none = () => false;
const iso = (min: number) => new Date(NOW.getTime() + min * 60000).toISOString();

function st(over: Parameters<typeof techHass>[0] = {}, config = plugCfg(), dismissed: (k: string) => boolean = none) {
  const hass = techHass(over);
  const p = findPrinter(hass, config)!;
  return { hass, p, s: printerState(hass, p, NOW, dismissed) };
}

describe('printer detection', () => {
  it('finds the printer, its AMS and the configured plug by translation key', () => {
    const { p } = st();
    expect(p.device).toBe('dev_drucker');
    expect(p.e.print_status).toBe(pid.status);
    expect(p.ams).toBe('dev_ams');
    expect(p.plug).toBe(PLUG);
    expect(p.controls).toEqual({});
  });

  it('picks up pause/stop buttons and a camera when the integration has them', () => {
    const hass = techHass({}, 'max');
    for (const [id, key] of [['button.drucker_pause', 'pause'], ['button.drucker_stop', 'stop'], ['camera.drucker', 'camera']]) {
      hass.states[id] = { entity_id: id, state: 'unknown', attributes: {}, last_changed: NOW.toISOString(), last_updated: NOW.toISOString() };
      hass.entities[id] = { entity_id: id, device_id: 'dev_drucker', platform: 'bambu_lab', translation_key: key };
    }
    expect(findPrinter(hass, cfg())!.controls).toEqual({ pause: 'button.drucker_pause', stop: 'button.drucker_stop', camera: 'camera.drucker' });
  });

  it('is null without a printer or with technik off', () => {
    expect(findPrinter(techHass(), cfg({ technik: false }))).toBeNull();
    const hass = techHass();
    for (const id of Object.keys(hass.entities)) if (hass.entities[id].platform === 'bambu_lab') delete hass.entities[id];
    expect(findPrinter(hass, cfg())).toBeNull();
  });
});

describe('printer state', () => {
  it('is off when the plug is off', () => {
    expect(st({ [PLUG]: { state: 'off' }, [pid.status]: { state: 'offline' } }).s).toMatchObject({ kind: 'off', status: 'Aus' });
  });

  it('is starting for 5 min after the plug turned on, then disconnected', () => {
    expect(st({ [PLUG]: { state: 'on', minutesAgo: 4 }, [pid.status]: { state: 'offline' } }).s).toMatchObject({ kind: 'starting', status: 'startet …' });
    expect(st({ [PLUG]: { state: 'on', minutesAgo: 5 }, [pid.status]: { state: 'offline' } }).s).toMatchObject({ kind: 'disconnected', status: 'nicht verbunden' });
  });

  it('is disconnected without a plug when the printer is unavailable', () => {
    expect(st({ [pid.status]: { state: 'unavailable' } }, cfg()).s.kind).toBe('disconnected');
  });

  it('is printing while running, with the stage label from HA', () => {
    const { hass, p } = st();
    hass.formatEntityState = (s) => (s.state === 'printing' ? 'Drucken' : s.state);
    expect(printerState(hass, p, NOW, none)).toMatchObject({ kind: 'printing', paused: false, progress: 0.63, status: 'Druckt · Drucken' });
    expect(st().s.status).toBe('Druckt · printing');
  });

  it('is printing and paused while paused without an error', () => {
    expect(st({ [pid.status]: { state: 'pause' } }).s).toMatchObject({ kind: 'printing', paused: true, status: 'Pausiert · printing' });
  });

  it('is an error with the HMS text', () => {
    const s = st({ [pid.status]: { state: 'pause' }, [pid.hms]: { state: 'on', attributes: { Count: 1, '1-Error': 'HMS_0700_2000_0002_0001: Filament gerissen' } } }).s;
    expect(s).toMatchObject({ kind: 'error', failedOnly: false, errorText: 'Filament gerissen', status: 'Fehler' });
  });

  it('is an error for a failed print within 12 h, idle after or when dismissed', () => {
    const failed = (endMin: number) => ({ [pid.status]: { state: 'failed' }, [pid.end]: { state: iso(endMin) } });
    expect(st(failed(-120)).s).toMatchObject({ kind: 'error', failedOnly: true, errorText: 'Fehler am Drucker', jobKey: iso(-120) });
    expect(st(failed(-13 * 60)).s.kind).toBe('idle');
    expect(st(failed(-120), plugCfg(), (k) => k === `print-error:${iso(-120)}`).s.kind).toBe('idle');
  });

  it('falls back to last_changed for the job when end_time is unknown', () => {
    const s = st({ [pid.status]: { state: 'failed', minutesAgo: 30 }, [pid.end]: { state: 'unknown' } }).s;
    expect(s.jobKey).toBe(new Date(NOW.getTime() - 30 * 60000).toISOString());
    expect(s.kind).toBe('error');
  });

  it('is finished, idle, and idle for unknown values', () => {
    expect(st({ [pid.status]: { state: 'finish' } }).s).toMatchObject({ kind: 'finished', status: 'Fertig' });
    expect(st({ [pid.status]: { state: 'idle' } }).s).toMatchObject({ kind: 'idle', status: 'Bereit' });
    expect(st({ [pid.status]: { state: 'weird' } }).s.kind).toBe('idle');
  });
});

describe('power lock', () => {
  it('locks while printing or in error', () => {
    const { hass, p, s } = st();
    expect(powerLocked(hass, p, s)).toBe(true);
  });

  it('locks while a nozzle is at 50 °C or more', () => {
    const cool = { [pid.status]: { state: 'idle' }, [pid.left]: { state: '49' }, [pid.right]: { state: '30' }, [pid.nozzle]: { state: '49' } };
    const a = st(cool);
    expect(powerLocked(a.hass, a.p, a.s)).toBe(false);
    const b = st({ ...cool, [pid.right]: { state: '50' } });
    expect(powerLocked(b.hass, b.p, b.s)).toBe(true);
  });
});

describe('AMS', () => {
  it('lists the four slots', () => {
    const { hass, p } = st();
    expect(amsSlots(hass, p)).toEqual([
      { color: '#F2F2F2', type: 'PETG', name: 'Bambu PETG HF', active: false, empty: false, remain: 80 },
      { color: '#000000', type: 'PLA', name: 'Bambu PLA Basic', active: true, empty: false, remain: 66 },
      { color: '#A0784F', type: 'PLA', name: 'Bambu PLA Wood', active: false, empty: false, remain: 40 },
      { color: undefined, type: '', name: 'leer', active: false, empty: true, remain: undefined },
    ]);
  });

  it('shows drying or humidity', () => {
    const { hass, p } = st();
    expect(amsNote(hass, p)).toBe('18 % Feuchte');
    const d = st({ [pid.drying]: { state: 'on' }, [pid.dryTime]: { state: '2.1667' } });
    expect(amsNote(d.hass, d.p)).toBe('trocknet · noch 2 h 10 min');
  });
});
