// Local preview: renders the card against the mocked hass from test/fixture.ts.
// Query params toggle scenarios, e.g. ?calm, ?busy.
import '../src/ha-start-dashboard';
import { makeHass } from '../test/fixture';
import { ROOM_EXTRAS } from '../test/fixture-rooms';
import { ENERGY_EXTRAS, SECURITY_EXTRAS } from '../test/fixture-m4';
import { DAILY, HOURLY, M5_EXTRAS } from '../test/fixture-m5';
import { AMS, GUEST, MONITORS, PLUG, PRINTER, technikDefs, monitorStatus } from '../test/fixture-technik';

const q = new URLSearchParams(location.search);
const now = new Date();
let overrides: Parameters<typeof makeHass>[0] = {};
if (q.has('calm')) {
  overrides = {
    'sensor.arbeitszimmer_anna_luftung': { state: 'Lüften möglich' },
    'sensor.badezimmer_luftung': { state: 'Lüften möglich' },
    'sensor.sensor_robby_verbleibende_filterzeit_minutes': { state: '100' },
    'sensor.robby_verbleibende_sensorzeit_minutes': { state: '100' },
  };
}
if (q.has('airing')) {
  overrides = {
    'timer.luften': { state: 'active', attributes: { duration: '0:15:00', finishes_at: new Date(Date.now() + 9 * 60_000 + 23_000).toISOString() } },
    'binary_sensor.fenster_badezimmer': { state: 'on', minutesAgo: 6 },
  };
}
if (q.has('busy')) {
  overrides = {
    'sensor.musterstadt_windboen': { state: '78' },
    'input_boolean.waschmaschine_fertig': { state: 'on' },
    'binary_sensor.fenster_wohnzimmer': { state: 'on', minutesAgo: 34 },
    'sensor.thermostat_bad_battery': { state: '9' },
    'sensor.luftreiniger_w_filter_life': { state: '4' },
  };
}
// ?technik: printer, Pi-hole, guest WLAN and Uptime Kuma; ?technik=down adds a failing service.
const technik = q.has('technik');
if (q.get('technik') === 'down') overrides = { ...overrides, [monitorStatus('Nextcloud')]: { state: 'down', minutesAgo: 12 } };
// ?health: an offline Alarmo motion sensor and an unavailable room temperature.
const health = q.has('health');
const MOTION = 'binary_sensor.bewegung_flur_og';
if (health) overrides = { ...overrides, 'sensor.badezimmer_temperature': { state: 'unavailable' } };
// ?appliances: the dishwasher runs at 2 200 W (history: started 40 minutes ago).
const appliances = q.has('appliances');
if (appliances) overrides = { ...overrides, 'sensor.spulmaschine_power': { state: '2200', minutesAgo: 1 } };
// ?pvbattery: PV feeds the battery inverter (morning: PV 860 W, output 786 W); ?pvbattery=night: output 410 W from storage.
const pvBattery = q.has('pvbattery');
const BAT_PV = 'sensor.marstek_venus_a_pv_aktuelle_leistung';
const BAT_AC = 'sensor.marstek_venus_a_ac_leistung';
if (pvBattery) {
  const night = q.get('pvbattery') === 'night';
  overrides = {
    ...overrides,
    [BAT_PV]: { state: night ? '0' : '860' },
    [BAT_AC]: { state: night ? '410' : '786' },
    'sensor.hausverbrauch': { state: night ? '420' : '2440' },
    'sensor.stromverbrauch_shelly_messung': { state: night ? '10' : '1654' },
  };
}
// The fixture weather is rainy, so the weather icon shows rain in every scenario.
const extra = {
  ...ROOM_EXTRAS, ...ENERGY_EXTRAS, ...SECURITY_EXTRAS, ...M5_EXTRAS, ...(technik ? technikDefs() : {}),
  ...(health ? { [MOTION]: ['unavailable', { device_class: 'motion', friendly_name: 'Bewegung Flur OG' }, 30] as [string, Record<string, unknown>, number] } : {}),
  ...(appliances ? { 'sensor.spulmaschine_power': ['2200', { friendly_name: 'Spülmaschine Power', unit_of_measurement: 'W', device_class: 'power' }, 1] as [string, Record<string, unknown>, number] } : {}),
};
const hass = makeHass(overrides, now, extra);
hass.user = { id: 'u-max', name: 'Max', is_admin: true };
if (pvBattery) {
  for (const id of [BAT_PV, BAT_AC]) hass.entities[id] = { entity_id: id, area_id: null, labels: [], device_id: 'dev_battery', platform: 'marstek' };
}
if (technik) {
  hass.devices[PRINTER] = { id: PRINTER, area_id: null, name: 'x2d_musterdrucker' };
  hass.devices[AMS] = { id: AMS, area_id: null, name: 'x2d_musterdrucker_AMS_1' };
  hass.devices[GUEST] = { id: GUEST, area_id: null, name: 'Gäste' };
  for (const [device, name] of MONITORS) hass.devices[device] = { id: device, area_id: null, name };
  hass.formatEntityState = (s) => ({ printing: 'Drucken', standard: 'Standard' })[s.state] ?? s.state;
}
hass.callService = async (domain, service, data, target) => {
  console.log('[mock] callService', domain, service, JSON.stringify(data), 'target=' + JSON.stringify(target));
};
// Synthetic hourly statistics for the history sheet.
hass.callWS = (async (msg: Record<string, any>) => {
  if (msg.type === 'call_service' && msg.service === 'get_forecasts') {
    return { response: { [msg.target.entity_id]: { forecast: msg.service_data.type === 'hourly' ? HOURLY : DAILY } } };
  }
  if (msg.type === 'alarmo/sensors') {
    return { [MOTION]: { type: 'motion', enabled: true } };
  }
  if (msg.type === 'history/history_during_period' && (msg.entity_ids as string[]).includes('sensor.spulmaschine_power')) {
    const t0 = Date.now() - 40 * 60_000;
    return { 'sensor.spulmaschine_power': [{ s: '0', lu: (t0 - 3600_000) / 1000 }, { s: '2200', lu: t0 / 1000 }] };
  }
  if (msg.type === 'energy/get_prefs') {
    return {
      energy_sources: [
        { type: 'solar', stat_energy_from: 'sensor.solarenergytotal' },
        { type: 'grid', stat_energy_from: 'sensor.stromverbrauch_shelly_kwh', stat_energy_to: 'sensor.ruckeinspeisung_shelly_kwh', number_energy_price: 0.3, number_energy_price_export: 0.08 },
        { type: 'battery', stat_energy_from: 'sensor.akku_entladen_kwh', stat_energy_to: 'sensor.akku_geladen_kwh' },
      ],
      device_consumption: [],
    };
  }
  // Airing room chart: window opened 15 min ago, humidity and temperature drop.
  if (msg.type === 'history/history_during_period' && (msg.entity_ids as string[]).length === 1
    && /_(temperature|humidity)$/.test(msg.entity_ids[0])) {
    const id = msg.entity_ids[0] as string;
    const start = Date.parse(msg.start_time);
    const rows = [];
    for (let t = start, i = 0; t < Date.now(); t += 60_000, i++) {
      const k = 1 - Math.exp(-i / 12);
      rows.push({ s: String(id.endsWith('_humidity') ? 78 - 18 * k : 21.4 - 2.2 * k), lu: t / 1000 });
    }
    return { [id]: rows };
  }
  if (msg.type === 'history/history_during_period' && (msg.entity_ids as string[]).some((id) => id.endsWith('_taupunkt'))) {
    const start = Date.parse(msg.start_time);
    const out: Record<string, { s: string; lu: number }[]> = {};
    for (const id of msg.entity_ids as string[]) {
      const rows = [];
      for (let t = start, i = 0; t < Date.now(); t += 1800_000, i++) {
        const h = new Date(t).getHours();
        const inside = 12 + Math.sin(i / 9) * 0.8;
        const outside = 8 + Math.sin((h - 15) / 24 * 2 * Math.PI) * 4;
        if (id.endsWith('_luftung')) rows.push({ s: outside < inside - 3 ? 'Jetzt lüften' : outside < inside - 1 ? 'Lüften möglich' : 'Nicht lüften', lu: t / 1000 });
        else rows.push({ s: String(id.includes('aussen') ? outside : inside), lu: t / 1000 });
      }
      out[id] = rows;
    }
    return out;
  }
  if (msg.type === 'history/history_during_period') {
    const start = Date.parse(msg.start_time);
    const rows = [];
    for (let t = start, i = 0; t < Date.now(); t += 1800_000, i++) {
      rows.push({ s: 'rainy', lu: t / 1000, a: { humidity: 80 + Math.sin(i / 6) * 8, wind_speed: 25 + Math.sin(i / 4) * 10, pressure: 1012 - i * 0.1, uv_index: Math.max(0, Math.sin(i / 8) * 3), visibility: 30 + Math.sin(i / 5) * 10 } });
    }
    return { [msg.entity_ids[0]]: rows };
  }
  if (msg.type !== 'recorder/statistics_during_period') return {};
  const start = Date.parse(msg.start_time);
  const end = msg.end_time ? Date.parse(msg.end_time) : Date.now();
  if (msg.types?.includes('change')) {
    const step = msg.period === 'day' ? 86400_000 : 3600_000;
    const out: Record<string, { start: number; change: number }[]> = {};
    for (const id of msg.statistic_ids as string[]) {
      const rows = [];
      for (let t = start; t < end; t += step) {
        const h = new Date(t).getHours();
        const sun = Math.max(0, Math.sin(((h - 7) / 12) * Math.PI));
        const v = id.includes('solar') ? sun * 0.8 : id.includes('ruck') ? sun * 0.3 : 0.25 + (1 - sun) * 0.3;
        rows.push({ start: t, change: step > 3600_000 ? v * 9 : v });
      }
      out[id] = rows;
    }
    return out;
  }
  const step = msg.period === 'day' ? 86400_000 : msg.period === '5minute' ? 300_000 : 3600_000;
  const out: Record<string, { start: number; mean: number }[]> = {};
  for (const id of msg.statistic_ids as string[]) {
    if (id.includes('niederschlag')) {
      // A shower in the past evening, dry since.
      const rows = [];
      for (let t = start, i = 0; t < end; t += step, i++) rows.push({ start: t, mean: i >= 3 && i <= 9 ? [0.4, 1.2, 2.6, 1.8, 0.9, 0.3, 0.1][i - 3] : 0 });
      out[id] = rows;
      continue;
    }
    const isT = id.endsWith('_temperature');
    const rows = [];
    for (let t = start, i = 0; t < end; t += step, i++) {
      const wave = Math.sin(i / 3.5);
      const airing = i % 24 === 14 ? 1 : 0;
      rows.push({ start: t, mean: isT ? 19 + wave * 0.8 - airing * 1.3 : 60 + wave * 2.5 - airing * 6 });
    }
    out[id] = rows;
  }
  await new Promise((r) => setTimeout(r, 300));
  return out;
}) as typeof hass.callWS;
const card = document.getElementById('card') as any;
(hass as any).callApi = async (_m: string, path: string) => {
  if (path.endsWith('/c1')) return { entities: { 'light.wohnzimmer_stehlampe': { state: 'on' }, 'light.wohnzimmer_vasenleuchte': { state: 'on' } } };
  throw new Error('not found');
};
hass.states['scene.cozy_evening'].attributes.id = 'c1';
// Persons for the Schutz header: one at home, one in a work zone.
const st = (id: string, state: string, attributes: Record<string, unknown>) => {
  hass.states[id] = { entity_id: id, state, attributes, last_changed: now.toISOString(), last_updated: now.toISOString() };
};
st('zone.home', '1', { friendly_name: 'Home', icon: 'mdi:home' });
st('zone.buro_anna', '1', { friendly_name: 'Büro Anna', icon: 'mdi:briefcase' });
st('person.max_muster', 'home', { friendly_name: 'Max Muster', device_trackers: ['device_tracker.max'], in_zones: ['zone.home'] });
st('person.anna_muster', 'Büro Anna', { friendly_name: 'Anna Muster', device_trackers: ['device_tracker.anna'], in_zones: ['zone.buro_anna'] });
card.setConfig({
  type: 'custom:ha-start-dashboard', page: q.get('page') ?? 'overview', header: 'default',
  ...(pvBattery ? { entities: { pv_power: BAT_PV } } : {}),
  ...(technik ? { technik: { printer_plug: PLUG, printer_plug_power: 'sensor.drucker_steckdose_power', printer_plug_energy: 'sensor.drucker_steckdose_energy' } } : {}),
});
card.hass = hass;
card.addEventListener('hass-more-info', (e: CustomEvent) => console.log('[mock] more-info', e.detail.entityId));
