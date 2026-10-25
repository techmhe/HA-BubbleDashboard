// Local preview: renders the card against the mocked hass from test/fixture.ts.
// Query params toggle scenarios, e.g. ?calm, ?busy.
import '../src/ha-start-dashboard';
import { makeHass } from '../test/fixture';
import { ROOM_EXTRAS } from '../test/fixture-rooms';
import { ENERGY_EXTRAS, SECURITY_EXTRAS } from '../test/fixture-m4';
import { DAILY, HOURLY, M5_EXTRAS } from '../test/fixture-m5';

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
const hass = makeHass(overrides, now, { ...ROOM_EXTRAS, ...ENERGY_EXTRAS, ...SECURITY_EXTRAS, ...M5_EXTRAS });
hass.callService = async (domain, service, data, target) => {
  console.log('[mock] callService', domain, service, JSON.stringify(data), 'target=' + JSON.stringify(target));
};
// Synthetic hourly statistics for the history sheet.
hass.callWS = (async (msg: Record<string, any>) => {
  if (msg.type === 'call_service' && msg.service === 'get_forecasts') {
    return { response: { [msg.target.entity_id]: { forecast: msg.service_data.type === 'hourly' ? HOURLY : DAILY } } };
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
card.setConfig({ type: 'custom:ha-start-dashboard', page: q.get('page') ?? 'overview', header: 'default' });
card.hass = hass;
card.addEventListener('hass-more-info', (e: CustomEvent) => console.log('[mock] more-info', e.detail.entityId));
