import { describe, expect, it } from 'vitest';
import { aqColor, dateLine, greeting, nowItems, roomSummaries, statusBubbles, weatherInfo } from '../src/logic/overview';
import { resolveRooms } from '../src/logic/rooms';
import { makeHass, NOW } from './fixture';

const cfg = { type: 'custom:ha-start-dashboard' };

describe('header', () => {
  it('greets by time of day and formats the German date', () => {
    expect(greeting(NOW)).toBe('Guten Abend');
    expect(greeting(new Date(2026, 9, 24, 7))).toBe('Guten Morgen');
    expect(greeting(new Date(2026, 9, 24, 2))).toBe('Gute Nacht');
    expect(dateLine(NOW)).toBe('Samstag, 24. Oktober');
  });
  it('shows rounded weather temperature and German condition', () => {
    expect(weatherInfo(makeHass(), 'weather.musterstadt')).toMatchObject({ temp: '9°', label: 'Regen' });
  });
});

describe('rooms', () => {
  it('auto-detects rooms from *_luftung sensors with areas, climate, pm25 and window', () => {
    const rooms = resolveRooms(makeHass(), cfg);
    expect(rooms).toHaveLength(8);
    const max = rooms.find((r) => r.slug === 'arbeitszimmer_max')!;
    expect(max).toMatchObject({
      name: 'Büro Max',
      areas: ['arbeitszimmer_von_max'],
      climate: 'climate.vtherm_arbeitszimmer_max',
      pm25: 'sensor.luftreiniger_arbeitszimmer_max_pm25',
      window: 'binary_sensor.fenster_arbeitszimmer_max',
      floor: 'og',
    });
  });
  it('uses configured rooms verbatim when given', () => {
    const rooms = resolveRooms(makeHass(), { ...cfg, rooms: [{ slug: 'wohnzimmer', name: 'Wohnen', pm25: 'sensor.x' }] });
    expect(rooms).toHaveLength(1);
    expect(rooms[0]).toMatchObject({ name: 'Wohnen', pm25: 'sensor.x', climate: 'climate.vtherm_wohnzimmer' });
  });
});

describe('status bubbles', () => {
  it('summarises robby, lights (labelled, no groups), grid import and alarm', () => {
    const b = statusBubbles(makeHass(), cfg);
    expect(b.map((x) => x.value)).toEqual(['Dockt', '5 an', '775 W', 'Aus']);
    expect(b[2].label).toBe('Netzbezug');
  });
  it('shows export when feeding in', () => {
    const b = statusBubbles(
      makeHass({ 'sensor.stromverbrauch_shelly_messung': { state: '0' }, 'sensor.ruckeinspeisung_shelly_messung': { state: '1234' } }),
      cfg,
    );
    expect(b[2]).toMatchObject({ value: '1.234 W', label: 'Einspeisung' });
  });
});

describe('Aktuell', () => {
  const ids = (h = makeHass()) => nowItems(h, cfg, resolveRooms(h, cfg), NOW).map((i) => i.id);

  it('lists airing and robby maintenance in the default fixture, nothing else', () => {
    const h = makeHass();
    const items = nowItems(h, cfg, resolveRooms(h, cfg), NOW);
    expect(items.map((i) => i.id)).toEqual(['airing', 'robby-due']);
    expect(items[0].text).toBe('Büro Anna 62 % · Badezimmer 61 % · 15 min');
    expect(items[0].action).toMatchObject({ label: 'Start', domain: 'script', service: 'luften_starten' });
    expect(items[1].text).toBe('Filter & Sensoren reinigen');
  });

  it('is empty when nothing applies ("Alles ruhig")', () => {
    const h = makeHass({
      'sensor.arbeitszimmer_anna_luftung': { state: 'Lüften möglich' },
      'sensor.badezimmer_luftung': { state: 'Lüften möglich' },
      'sensor.sensor_robby_verbleibende_filterzeit_minutes': { state: '100' },
      'sensor.robby_verbleibende_sensorzeit_minutes': { state: '100' },
    });
    expect(ids(h)).toEqual([]);
  });

  it('shows "Lüften läuft" instead of the recommendation while the timer runs', () => {
    expect(ids(makeHass({ 'timer.luften': { state: 'active' } }))).toContain('airing');
    const h = makeHass({ 'timer.luften': { state: 'active' } });
    expect(nowItems(h, cfg, resolveRooms(h, cfg), NOW)[0]).toMatchObject({ title: 'Lüften läuft', action: undefined });
  });

  it('reports windows open for 20+ minutes and the front door after 5 minutes', () => {
    const h = makeHass({
      'binary_sensor.fenster_wohnzimmer': { state: 'on', minutesAgo: 34 },
      'binary_sensor.fenster_schlafzimmer': { state: 'on', minutesAgo: 5 },
      'binary_sensor.fenstersensor_haustur_contact': { state: 'on', minutesAgo: 6 },
    });
    const items = nowItems(h, cfg, resolveRooms(h, cfg), NOW);
    expect(items.find((i) => i.id === 'windows')).toMatchObject({ title: 'Fenster offen', text: 'Wohnzimmer 34 min' });
    expect(items.find((i) => i.id === 'door')).toMatchObject({ title: 'Haustür offen', text: 'seit 6 min' });
  });

  it('reports finished appliances with an OK action that turns the flag off', () => {
    const h = makeHass({ 'input_boolean.trockner_fertig': { state: 'on' } });
    const it = nowItems(h, cfg, resolveRooms(h, cfg), NOW).find((i) => i.id === 'input_boolean.trockner_fertig')!;
    expect(it.title).toBe('Trockner fertig');
    expect(it.action).toMatchObject({ label: 'OK', domain: 'input_boolean', service: 'turn_off', target: { entity_id: 'input_boolean.trockner_fertig' } });
  });

  it('reports waste on the day before and the day of collection only', () => {
    const wasteAttrs = { '2026-10-25': 'Restmüll', '2026-10-24': 'Altpapier' };
    const tomorrow = makeHass({ 'sensor.naechster_abfalltermin': { attributes: { ...wasteAttrs, daysTo: 1 } } });
    expect(nowItems(tomorrow, cfg, [], NOW).find((i) => i.id === 'waste')).toMatchObject({ title: 'Müll morgen', text: 'Restmüll' });
    const today = makeHass({ 'sensor.naechster_abfalltermin': { attributes: { ...wasteAttrs, daysTo: 0 } } });
    expect(nowItems(today, cfg, [], NOW).find((i) => i.id === 'waste')).toMatchObject({ title: 'Müll heute', text: 'Altpapier' });
    expect(ids(makeHass())).not.toContain('waste');
  });

  it('reports storm gusts >= 60 km/h, low batteries (skipping _plus) and filters', () => {
    const h = makeHass({
      'sensor.musterstadt_windboen': { state: '78.2' },
      'sensor.thermostat_bad_battery': { state: '9' },
      'sensor.luftreiniger_w_filter_life': { state: '0' },
      'binary_sensor.flur_1_og_klimaanlage_filteralarm': { state: 'on', attributes: { friendly_name: 'Klimaanlage Filteralarm' } },
      'alarm_control_panel.alarmo': { state: 'triggered' },
    });
    const items = nowItems(h, cfg, resolveRooms(h, cfg), NOW);
    expect(items[0].id).toBe('alarm');
    expect(items.find((i) => i.id === 'storm')!.text).toBe('Böen bis 78 km/h');
    expect(items.find((i) => i.id === 'battery')).toMatchObject({ title: 'Batterie schwach' });
    expect(items.find((i) => i.id === 'filter')!.text).toContain('Klimaanlage Filteralarm');
    expect(items.find((i) => i.id === 'filter')!.text).toContain('0 %');
  });

  it('reports a robby error', () => {
    expect(ids(makeHass({ 'vacuum.robby': { state: 'error' } }))).toContain('robby-error');
  });
});

describe('Zusammenfassung', () => {
  it('builds room pills with heating/airing flags and AQ only for PM2.5 rooms', () => {
    const h = makeHass();
    const s = roomSummaries(h, resolveRooms(h, cfg));
    const anna = s.find((r) => r.room.slug === 'arbeitszimmer_anna')!;
    expect(anna).toMatchObject({ temp: '19,0', hum: '62', heating: true, vent: true, aq: '#30d158' });
    expect(s.find((r) => r.room.slug === 'badezimmer')!.aq).toBeNull();
    expect(s.find((r) => r.room.slug === 'wohnzimmer')!.aq).toBe('#ffd60a');
    expect(s.find((r) => r.room.slug === 'kuche_esszimmer')!.aq).toBe('#ff453a');
  });
  it('maps PM2.5 thresholds', () => {
    expect([aqColor(12), aqColor(12.1), aqColor(35), aqColor(36), aqColor(null)]).toEqual(['#30d158', '#ffd60a', '#ffd60a', '#ff453a', null]);
  });
});
