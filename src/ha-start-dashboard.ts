import { css, html, LitElement, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { confirmSheet, icon, sheetStyles, type ConfirmOptions } from './components/ui';
import { I } from './icons';
import { bucket, stepTarget, type Point } from './logic/climate';
import { ent, scriptService } from './logic/entities';
import { dateLine } from './logic/overview';
import { resolveRooms, type Room } from './logic/rooms';
import { num } from './logic/util';
import { baseStyles } from './styles';
import { loadDismissed, saveDismissed, type Dismissed } from './logic/dismiss';
import { haptic } from './components/hold';
import { repeat } from 'lit/directives/repeat.js';
import { sheetKey, sheetParent } from './logic/sheet-stack';
import { lensBox, tabAt } from './logic/gestures';
import { applyHeader, removeHeader, type HeaderMode } from './header';
import type { CardConfig, HomeAssistant, PageId } from './types';
import { loadEnergyToday } from './data/series';
import { loadHeatingAlerts } from './data/heating-check';
import type { HeatingAlert } from './logic/heating-check';
import { shouldLoadAlarmo, type AlarmoSensor } from './logic/health';
import { findAppliances, type PowerPoint } from './logic/appliances';
import { loadStuckWindows, longOpenRooms } from './data/window-check';
import { isSnoozed, parseSnooze, windowState, type WindowState } from './logic/window-state';
import { batteryStatIds, energyStatIds, gridTariff, pvSensors, type EnergyPrefs } from './logic/energy';
import type { SceneConfig } from './logic/devices';
import type { EnergyInfo, SeriesData } from './pages/context';
import type { AllRoomsState, ForecastData, HistoryData, HistoryRange, PageContext, SheetState, Target } from './pages/context';
import { climateStyles, renderClimate } from './pages/climate';
import { overviewStyles, renderOverview } from './pages/overview';
import { renderRooms, roomsStyles } from './pages/rooms';
import { energyStyles, renderEnergy } from './pages/energy';
import { renderSecurity, securityStyles } from './pages/security';
import { deviceSheet, deviceStyles } from './sheets/device';
import { robbySheet, robbyStyles } from './sheets/robby';
import { weatherDaySheet, weatherMetricSheet, weatherRainSheet, weatherSheet, weatherStyles } from './sheets/weather';
import { dewSheet, dewStyles } from './sheets/dew';
import { trendStyles } from './components/trend';
import { scrubStyles } from './components/scrub';
import { careSheet, careStyles } from './sheets/care';
import { acSheet, acStyles } from './sheets/ac';
import { energyChartSheet } from './sheets/energy-chart';
import type { ForecastItem } from './logic/weather';
import { airingSheet, airingStyles } from './sheets/airing';
import { alarmSheet, alarmStyles } from './sheets/alarm';
import { personsSheet, personsStyles } from './sheets/persons';
import { allRoomsSheet, allRoomsStyles, DURATIONS } from './sheets/all-rooms';
import { historySheet, historyStyles } from './sheets/history';
import { roomSheet, roomStyles } from './sheets/room';
import { technikSheet, technikStyles } from './sheets/technik';
import { printerSheet, printerStyles } from './sheets/printer';

declare const __VERSION__: string;
const VERSION = typeof __VERSION__ === 'string' ? __VERSION__ : 'dev';

const PAGES: { id: PageId; name: string; icon: string; milestone: number }[] = [
  { id: 'overview', name: 'Übersicht', icon: I.home, milestone: 1 },
  { id: 'climate', name: 'Klima', icon: I.thermo, milestone: 2 },
  { id: 'rooms', name: 'Räume', icon: I.grid, milestone: 3 },
  { id: 'energy', name: 'Energie', icon: I.bolt, milestone: 4 },
  { id: 'security', name: 'Schutz', icon: I.shield, milestone: 4 },
];

const PAGE_GLOW: Record<PageId, string> = {
  overview: 'radial-gradient(100% 30% at 0% 0%, rgba(110,90,200,0.34), transparent 70%), radial-gradient(80% 30% at 100% 40%, rgba(90,200,250,0.12), transparent 70%)',
  climate: 'radial-gradient(100% 30% at 50% 0%, rgba(255,140,60,0.26), transparent 70%), radial-gradient(80% 30% at 0% 55%, rgba(90,200,250,0.12), transparent 70%)',
  rooms: 'radial-gradient(100% 28% at 50% 0%, rgba(255,214,10,0.18), transparent 70%)',
  energy: 'radial-gradient(100% 28% at 50% 0%, rgba(48,209,88,0.2), transparent 70%)',
  security: 'radial-gradient(100% 28% at 50% 0%, rgba(191,155,255,0.22), transparent 70%)',
};

const HOUR = 3600_000;
const RANGE_SPEC: Record<HistoryRange, { ms: number; bucket: number; period: 'hour' | 'day' }> = {
  '24h': { ms: 24 * HOUR, bucket: HOUR, period: 'hour' },
  '7d': { ms: 7 * 24 * HOUR, bucket: HOUR, period: 'hour' },
  '30d': { ms: 30 * 24 * HOUR, bucket: 24 * HOUR, period: 'day' },
};
const TARGET_DEBOUNCE_MS = 700;
const TARGET_HOLD_MS = 15_000;

function loadFont() {
  const id = 'ha-start-dashboard-font';
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);
}

export class HaStartDashboard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _page: { state: true },
    _sheet: { state: true },
    _confirm: { state: true },
    _now: { state: true },
    _roomsFilter: { state: true },
    _consumersAll: { state: true },
    _pending: { state: true },
    _history: { state: true },
    _allRooms: { state: true },
    _ui: { state: true },
    _forecast: { state: true },
    _hdr: { state: true },
    _energy: { state: true },
    _series: { state: true },
    _heating: { state: true },
    _stuck: { state: true },
    _scenes: { state: true },
    _navDrag: { state: true },
    _dismissed: { state: true },
    _piholePause: { state: true },
  };

  hass?: HomeAssistant;
  private _config?: CardConfig;
  private _page: PageId = 'overview';
  private _sheet: SheetState | null = null;
  private _confirm: Omit<ConfirmOptions, 'onClose'> | null = null;
  private _now = new Date();
  private _roomsFilter = 'all';
  private _consumersAll = false;
  private _tick?: number;
  private _fastTick?: number;
  private _rooms: Room[] = [];
  private _roomsKey?: unknown;
  /** Optimistic values ("entity|attribute" -> value + time of the last tap), e.g. climate targets. */
  private _pending: Record<string, { value: number; at: number }> = {};
  private _ui: Record<string, unknown> = {};
  /** Header mode actually applied to HA's toolbar ('' when HA's toolbar is untouched). */
  private _hdr: HeaderMode | '' = '';
  private _energy: EnergyInfo = {};
  private _energyAt = 0;
  private _energyLoading = false;
  private _series: Record<string, SeriesData & { at: number }> = {};
  private _heating: { at: number; loading: boolean; alerts: HeatingAlert[] } = { at: 0, loading: false, alerts: [] };
  private _alarmo: { at: number; loading: boolean; sensors: AlarmoSensor[] } = { at: 0, loading: false, sensors: [] };
  private _appliances: { loaded: boolean; runs: Record<string, PowerPoint[]> } = { loaded: false, runs: {} };
  private _stuck: { at: number; key: string; loading: boolean; slugs: string[] } = { at: 0, key: '', loading: false, slugs: [] };
  private _winMemo?: { hass: HomeAssistant; now: Date; rooms: Room[]; key: string };
  private _navDrag: { left: number; width: number; hover: number } | null = null;
  private _scenes: Record<string, SceneConfig | undefined> | null = null;
  private _forecast: ForecastData = { loading: false, hourly: [], daily: [], at: 0 };
  private _debounce: Record<string, number> = {};
  private _history: Record<string, HistoryData> = {};
  private _allRooms: AllRoomsState = { temp: 19, selected: new Set(), duration: 'Dauerhaft' };
  private _dismissed: Dismissed = loadDismissed();
  private _piholePause?: number;

  static getStubConfig(): Partial<CardConfig> {
    return { page: 'overview' };
  }

  setConfig(config: CardConfig) {
    if (!config) throw new Error('Invalid configuration');
    if (config.page && !PAGES.some((p) => p.id === config.page)) {
      throw new Error(`Unknown page "${config.page}" (use ${PAGES.map((p) => p.id).join(', ')})`);
    }
    this._config = config;
    this._page = config.page ?? 'overview';
    this._roomsKey = undefined;
    if (config.load_font !== false) loadFont();
  }

  getCardSize() {
    return 12;
  }

  getGridOptions() {
    return { columns: 'full', rows: 'auto' };
  }

  connectedCallback() {
    super.connectedCallback();
    this._now = new Date();
    this._tick = window.setInterval(() => (this._now = new Date()), 30_000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.clearInterval(this._tick);
    window.clearInterval(this._fastTick);
    this._fastTick = undefined;
    removeHeader(this);
  }

  protected updated(changed: PropertyValues) {
    const mode = this._config?.header ?? 'hide';
    const hdr = applyHeader(this, mode) ? mode : '';
    if (hdr !== this._hdr) this._hdr = hdr;
    // 1 s clock while an airing countdown is visible (pop-up open or timer running).
    if (changed.has('_sheet') || changed.has('hass') || changed.has('_piholePause')) {
      const timer = this.hass && this._config ? this.hass.states[ent(this._config, 'airing_timer')] : undefined;
      const paused = !!this._piholePause && this._piholePause > Date.now();
      const fast = this._sheet?.id === 'airing' || timer?.state === 'active' || (this._sheet?.id === 'technik' && paused);
      if (fast && !this._fastTick) this._fastTick = window.setInterval(() => (this._now = new Date()), 1000);
      else if (!fast && this._fastTick) {
        window.clearInterval(this._fastTick);
        this._fastTick = undefined;
      }
    }
  }

  protected willUpdate(changed: PropertyValues) {
    // Rooms only depend on the registries and config; recompute when those change.
    if (this.hass && this._config && (changed.has('hass') || changed.has('_config'))) {
      const key = [this.hass.areas, this.hass.entities, this.hass.devices, this._config];
      const prev = this._roomsKey as unknown[] | undefined;
      if (!prev || key.some((k, i) => k !== prev[i])) {
        this._rooms = resolveRooms(this.hass, this._config);
        this._roomsKey = key;
      }
    }
    // Drop optimistic targets once HA reports them, or after a timeout.
    if (this.hass && changed.has('hass')) {
      const now = Date.now();
      let dirty = false;
      const next = { ...this._pending };
      for (const [key, p] of Object.entries(next)) {
        const [id, attr] = key.split('|');
        const real = Number(this.hass.states[id]?.attributes[attr]);
        if ((real === p.value && now - p.at > TARGET_DEBOUNCE_MS) || now - p.at > TARGET_HOLD_MS) {
          delete next[key];
          dirty = true;
        }
      }
      if (dirty) this._pending = next;
    }
  }

  private _target(id: string | undefined): number | undefined {
    if (!id) return undefined;
    const p = this._pending[`${id}|temperature`];
    if (p) return p.value;
    const t = Number(this.hass?.states[id]?.attributes.temperature);
    return Number.isFinite(t) ? t : undefined;
  }

  /** Set an optimistic value and send it once the user stops tapping. */
  private _setPending(id: string, attr: string, value: number, send: () => void) {
    const key = `${id}|${attr}`;
    this._pending = { ...this._pending, [key]: { value, at: Date.now() } };
    window.clearTimeout(this._debounce[key]);
    this._debounce[key] = window.setTimeout(send, TARGET_DEBOUNCE_MS);
  }

  private _stepTarget(id: string, delta: number) {
    const a = this.hass?.states[id]?.attributes;
    if (!a) return;
    const cur = this._target(id) ?? 19;
    const value = stepTarget(cur, delta, Number(a.min_temp) || 7, Number(a.max_temp) || 30, Number(a.target_temp_step) || 0.5);
    this._setPending(id, 'temperature', value, () =>
      this._call('climate', 'set_temperature', { temperature: value }, { entity_id: id }),
    );
  }

  private async _call(domain: string, service: string, data?: Record<string, unknown>, target?: Target) {
    try {
      await this.hass!.callService(domain, service, data ?? {}, target as Record<string, unknown> | undefined);
    } catch (err) {
      console.error('[ha-start-dashboard]', domain, service, err);
    }
  }

  private _openSheet(sheet: SheetState) {
    if (sheet.id === 'allRooms' && this.hass) {
      const t = num(this.hass, ent(this._config!, 'all_rooms_temperature'));
      const d = this.hass.states[ent(this._config!, 'all_rooms_duration')]?.state;
      this._allRooms = {
        temp: t !== null && t >= 7 ? t : 19,
        selected: new Set(this._rooms.map((r) => r.slug)),
        duration: d && DURATIONS.includes(d) ? d : 'Dauerhaft',
      };
    }
    this._ui = {};
    this._sheet = sheet;
  }

  private _closeSheet() {
    this._ui = {};
    this._sheet = this._sheet?.id === 'device' && this._sheet.back ? this._sheet.back : null;
  }

  private _historyFor(slug: string, range: HistoryRange): HistoryData {
    const key = `${slug}:${range}`;
    const cached = this._history[key];
    // refresh after 5 minutes
    if (cached && (cached.loading || Date.now() - cached.end < 5 * 60_000)) return cached;
    const spec = RANGE_SPEC[range];
    const end = Date.now();
    const start = Math.floor((end - spec.ms) / spec.bucket) * spec.bucket;
    const entry: HistoryData = { loading: true, temp: [], hum: [], start, end };
    this._history = { ...this._history, [key]: entry };
    const room = this._rooms.find((r) => r.slug === slug);
    if (room) this._loadHistory(key, room, start, end, spec).catch(() => undefined);
    return entry;
  }

  private async _loadHistory(key: string, room: Room, start: number, end: number, spec: (typeof RANGE_SPEC)[HistoryRange]) {
    const ids = [room.temperature, room.humidity];
    const done = (temp: Point[], hum: Point[], error?: string) => {
      this._history = { ...this._history, [key]: { loading: false, temp, hum, start, end, error } };
    };
    try {
      // Long-term statistics first (hourly/daily means), raw history as fallback.
      const stats = await this.hass!.callWS<Record<string, { start: number | string; mean?: number | null; state?: number | null }[]>>({
        type: 'recorder/statistics_during_period',
        start_time: new Date(start).toISOString(),
        end_time: new Date(end).toISOString(),
        statistic_ids: ids,
        period: spec.period,
        types: ['mean'],
      });
      const fromStats = (id: string): Point[] =>
        (stats[id] ?? [])
          .map((r) => ({ t: typeof r.start === 'number' ? r.start : Date.parse(r.start), v: Number(r.mean ?? r.state) }))
          .filter((p) => Number.isFinite(p.v));
      let temp = fromStats(ids[0]);
      let hum = fromStats(ids[1]);
      if (temp.length < 2 || hum.length < 2) {
        const hist = await this.hass!.callWS<Record<string, { s: string; lu: number }[]>>({
          type: 'history/history_during_period',
          start_time: new Date(start).toISOString(),
          end_time: new Date(end).toISOString(),
          entity_ids: ids,
          minimal_response: true,
          no_attributes: true,
        });
        const raw = (id: string): Point[] =>
          (hist[id] ?? []).map((r) => ({ t: r.lu * 1000, v: Number(r.s) })).filter((p) => Number.isFinite(p.v));
        if (temp.length < 2) temp = bucket(raw(ids[0]), start, end, spec.bucket);
        if (hum.length < 2) hum = bucket(raw(ids[1]), start, end, spec.bucket);
      }
      done(temp, hum);
    } catch (err) {
      done([], [], (err as { message?: string })?.message ?? String(err));
    }
  }

  private _forecastData(): ForecastData {
    const f = this._forecast;
    if (!f.loading && Date.now() - f.at > 15 * 60_000) {
      this._forecast = { ...f, loading: true };
      this._loadForecast().catch(() => undefined);
    }
    return this._forecast;
  }

  private async _loadForecast() {
    const entity = ent(this._config!, 'weather');
    const get = async (type: 'hourly' | 'daily'): Promise<ForecastItem[]> => {
      const res = await this.hass!.callWS<{ response?: Record<string, { forecast?: ForecastItem[] }> }>({
        type: 'call_service',
        domain: 'weather',
        service: 'get_forecasts',
        service_data: { type },
        target: { entity_id: entity },
        return_response: true,
      });
      return res.response?.[entity]?.forecast ?? [];
    };
    try {
      const [hourly, daily] = await Promise.all([get('hourly'), get('daily')]);
      this._forecast = { loading: false, hourly, daily, at: Date.now() };
    } catch (err) {
      // Keep old data; retry after a minute.
      this._forecast = { ...this._forecast, loading: false, at: Date.now() - 14 * 60_000, error: (err as { message?: string })?.message ?? String(err) };
    }
  }

  /** Heating check (stuck valve), refreshed every 10 min; off with `heating_check: false`. */
  private _heatingAlerts(): HeatingAlert[] {
    const cfg = this._config!.heating_check;
    if (cfg === false) return [];
    const h = this._heating;
    if (!h.loading && Date.now() - h.at > 10 * 60_000) {
      this._heating = { ...h, loading: true };
      loadHeatingAlerts(this.hass!, resolveRooms(this.hass!, this._config!), pvSensors(this._config!, this._energy.prefs), cfg ?? {})
        .then((alerts) => (this._heating = { at: Date.now(), loading: false, alerts }))
        .catch((err) => {
          console.warn('[ha-start-dashboard] heating check', err);
          this._heating = { ...this._heating, loading: false, at: Date.now() };
        });
    }
    return h.alerts;
  }

  /** Alarmo's sensors for the offline check, refreshed every 30 min; empty when the call is not allowed. */
  private _alarmoSensors(): AlarmoSensor[] {
    const a = this._alarmo;
    if (!a.loading && Date.now() - a.at > 30 * 60_000 && !shouldLoadAlarmo(this.hass!)) {
      this._alarmo = { at: Date.now(), loading: false, sensors: [] };
    } else if (!a.loading && Date.now() - a.at > 30 * 60_000) {
      this._alarmo = { ...a, loading: true };
      this.hass!
        .callWS<Record<string, { type?: string; enabled?: boolean }>>({ type: 'alarmo/sensors' })
        .then((res) =>
          Object.entries(res ?? {}).map(([entity_id, s]) => ({ entity_id, type: String(s?.type ?? ''), enabled: s?.enabled !== false })),
        )
        .catch(() => [] as AlarmoSensor[])
        .then((sensors) => (this._alarmo = { at: Date.now(), loading: false, sensors }));
    }
    return a.sensors;
  }

  /** Power history of the appliances (6 h, fetched once; `{}` on error), extended by live state changes. */
  private _applianceRuns(): Record<string, PowerPoint[]> {
    const hass = this.hass!;
    const a = this._appliances;
    const ids = findAppliances(hass, this._config!).map((x) => x.power);
    if (!a.loaded && ids.length) {
      a.loaded = true;
      const start = new Date(Date.now() - 6 * 3600_000).toISOString();
      hass
        .callWS<Record<string, { s: string; lu?: number; lc?: number }[]>>({
          type: 'history/history_during_period', start_time: start, entity_ids: ids,
          minimal_response: true, no_attributes: true, significant_changes_only: false,
        })
        .then((res) => {
          for (const id of ids) {
            const pts = (res?.[id] ?? [])
              .map((e) => ({ t: (e.lu ?? e.lc ?? 0) * 1000, w: Number(e.s) }))
              .filter((p) => p.t > 0 && Number.isFinite(p.w));
            a.runs[id] = [...pts, ...(a.runs[id] ?? []).filter((p) => !pts.length || p.t > pts[pts.length - 1].t)];
          }
          this.requestUpdate();
        })
        .catch(() => undefined);
    }
    // Live changes since the fetch (or without one).
    if (a.loaded) {
      for (const id of ids) {
        const st = hass.states[id];
        const w = Number(st?.state);
        const t = st ? new Date(st.last_changed).getTime() : 0;
        const pts = a.runs[id];
        if (!pts || !st || !Number.isFinite(w) || !Number.isFinite(t)) continue;
        if (!pts.length || t > pts[pts.length - 1].t) pts.push({ t, w });
        const from = Date.now() - 6 * 3600_000;
        while (pts.length > 1 && pts[1].t < from) pts.shift();
      }
    }
    return a.runs;
  }

  /** Airing state of a room, incl. the stuck-sensor check (refreshed every 10 min) and snoozes. */
  private _windowState(room: Room): WindowState {
    const hass = this.hass!;
    const config = this._config!;
    const now = this._now;
    let memo = this._winMemo;
    if (!memo || memo.hass !== hass || memo.now !== now) {
      const rooms = resolveRooms(hass, config);
      memo = this._winMemo = { hass, now, rooms, key: longOpenRooms(hass, rooms, now.getTime()).map((r) => r.slug).join(',') };
    }
    const { rooms, key } = memo;
    const st = this._stuck;
    if (!st.loading && (st.key !== key || Date.now() - st.at > 10 * 60_000)) {
      this._stuck = { ...st, key, loading: true };
      loadStuckWindows(hass, rooms, config)
        .then((slugs) => (this._stuck = { at: Date.now(), key, loading: false, slugs }))
        .catch((err) => {
          console.warn('[ha-start-dashboard] window check', err);
          this._stuck = { ...this._stuck, at: Date.now(), loading: false };
        });
    }
    const snoozes = parseSnooze(hass.states[ent(config, 'window_snooze')]?.state);
    return windowState(hass, room, config, now, {
      stuck: key ? st.key === key && st.slugs.includes(room.slug) : false,
      snoozed: !!room.window && isSnoozed(snoozes, room.window, now.getTime()),
    });
  }

  private _energyInfo(): EnergyInfo {
    if (!this._energyLoading && Date.now() - this._energyAt > 5 * 60_000) {
      this._energyLoading = true;
      this._loadEnergy().finally(() => {
        this._energyLoading = false;
        this._energyAt = Date.now();
      });
    }
    return this._energy;
  }

  private async _loadEnergy() {
    try {
      const prefs = this._energy.prefs ?? (await this.hass!.callWS<EnergyPrefs>({ type: 'energy/get_prefs' }));
      this._energy = { ...this._energy, prefs };
      const ids = energyStatIds(prefs);
      if (ids.solar.length + ids.import.length + ids.export.length) {
        const today = await loadEnergyToday(this.hass!, { ...ids, ...batteryStatIds(prefs) }, gridTariff(prefs));
        this._energy = { ...this._energy, today };
      }
    } catch (err) {
      // No energy dashboard or no admin rights: the card falls back to the daily meters.
      console.warn('[ha-start-dashboard] energy', err);
    }
  }

  private _seriesData(key: string, load: () => Promise<import('./data/series').SeriesResult>, maxAgeMs = 5 * 60_000): SeriesData {
    const cached = this._series[key];
    if (cached && (cached.loading || Date.now() - cached.at < maxAgeMs)) return cached;
    const entry = { loading: true, past: cached?.past ?? [], future: cached?.future, start: cached?.start ?? 0, end: cached?.end ?? 0, at: Date.now() };
    this._series = { ...this._series, [key]: entry };
    load()
      .then((r) => (this._series = { ...this._series, [key]: { ...r, loading: false, at: Date.now() } }))
      .catch((err) => (this._series = {
        ...this._series,
        [key]: { ...entry, loading: false, at: Date.now() - maxAgeMs + 60_000, error: (err as { message?: string })?.message ?? String(err) },
      }));
    return entry;
  }

  private _sceneConfigs(): Record<string, SceneConfig | undefined> {
    if (this._scenes) return this._scenes;
    this._scenes = {};
    const hass = this.hass!;
    if (!hass.callApi) return this._scenes;
    const ids = Object.keys(hass.states).filter((id) => id.startsWith('scene.') && hass.states[id].attributes.id);
    Promise.all(ids.map(async (id) => {
      try {
        const cfg = await hass.callApi!<{ entities?: SceneConfig }>('GET', `config/scene/config/${hass.states[id].attributes.id}`);
        return [id, cfg.entities] as const;
      } catch {
        return [id, undefined] as const;
      }
    })).then((pairs) => (this._scenes = Object.fromEntries(pairs)));
    return this._scenes;
  }

  private _ctx(): PageContext {
    return {
      hass: this.hass!,
      config: this._config!,
      rooms: this._rooms,
      now: this._now,
      go: (page, opts) => {
        this._page = page;
        this._sheet = null;
        if (opts?.roomsFilter) this._roomsFilter = opts.roomsFilter;
        this._scrollTop('instant');
      },
      moreInfo: (entityId) => {
        this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId }, bubbles: true, composed: true }));
      },
      navigate: (path) => {
        history.pushState(null, '', path);
        window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
      },
      openSheet: (sheet) => this._openSheet(sheet),
      closeSheet: () => this._closeSheet(),
      confirm: (opts) => (this._confirm = opts),
      call: (domain, service, data, target) => this._call(domain, service, data, target),
      runScript: (id, data) => this._call(...scriptService(id), data),
      target: (id) => this._target(id),
      stepTarget: (id, delta) => this._stepTarget(id, delta),
      history: (slug, range) => this._historyFor(slug, range),
      forecast: () => this._forecastData(),
      energy: () => this._energyInfo(),
      heating: () => this._heatingAlerts(),
      alarmoSensors: () => this._alarmoSensors(),
      applianceRuns: () => this._applianceRuns(),
      window: (room) => this._windowState(room),
      sceneConfigs: () => this._sceneConfigs(),
      series: (key, load, maxAge) => this._seriesData(key, load, maxAge),
      allRooms: this._allRooms,
      setAllRooms: (patch) => (this._allRooms = { ...this._allRooms, ...patch }),
      roomsFilter: this._roomsFilter,
      setRoomsFilter: (f) => (this._roomsFilter = f),
      consumersAll: this._consumersAll,
      setConsumersAll: (v) => (this._consumersAll = v),
      pending: (id, attr) => this._pending[`${id}|${attr}`]?.value,
      setPending: (id, attr, value, send) => this._setPending(id, attr, value, send),
      ui: this._ui,
      setUi: (patch) => (this._ui = { ...this._ui, ...patch }),
      dismissed: (key) => key in this._dismissed,
      dismiss: (key) => {
        this._dismissed = { ...loadDismissed(), ...this._dismissed, [key]: Date.now() };
        saveDismissed(this._dismissed);
      },
      piholePause: this._piholePause,
      setPiholePause: (until) => (this._piholePause = until),
    };
  }

  protected render() {
    if (!this.hass || !this._config) return nothing;
    const ctx = this._ctx();
    const showNav = this._config.nav !== false;
    return html`
      <div class="wrap ${this._hdr ? `hdr-${this._hdr}` : ''}" style="background-image:${PAGE_GLOW[this._page]}">
        <main class="content">${this._renderPage(ctx)}</main>
        ${showNav ? this._renderNav() : nothing}
      </div>
      ${this._renderSheets(ctx)}
    `;
  }

  private _renderPage(ctx: PageContext): TemplateResult {
    if (this._page === 'overview') return renderOverview(ctx);
    if (this._page === 'climate') return renderClimate(ctx);
    if (this._page === 'rooms') return renderRooms(ctx);
    if (this._page === 'energy') return renderEnergy(ctx);
    if (this._page === 'security') return renderSecurity(ctx);
    const page = PAGES.find((p) => p.id === this._page)!;
    return html`
      <header class="page-head">
        <div class="date">${dateLine(ctx.now)}</div>
        <h1>${page.name}</h1>
      </header>
      <div class="todo">
        <span class="circle" style="width:42px;height:42px;background:rgba(255,255,255,0.12)">${icon(page.icon, 18, '#fff')}</span>
        <span>Diese Seite kommt in Etappe ${page.milestone}.</span>
      </div>
    `;
  }

  /** Tab bar: tap a tab, or slide a finger along the bar; a glass lens follows and snaps on release. */
  private _renderNav() {
    const n = PAGES.length;
    const idx = Math.max(0, PAGES.findIndex((p) => p.id === this._page));
    const drag = this._navDrag;
    // At rest the lens sits under the active tab (flex 2, the others flex 1, gap 4 px, padding 6 px).
    const unit = `((100% - 12px - ${(n - 1) * 4}px) / ${n + 1})`;
    const lensStyle = drag
      ? `left:${drag.left}px;width:${drag.width}px`
      : `left:calc(6px + ${idx} * (${unit} + 4px));width:calc(2 * ${unit})`;
    return html`
      <nav class="nav ${drag ? 'dragging' : ''}" aria-label="Bereiche"
        @pointerdown=${this._navDown} @pointermove=${this._navMove} @pointerup=${this._navUp} @pointercancel=${this._navCancel}>
        <span class="lens" style=${lensStyle} aria-hidden="true"></span>
        ${PAGES.map((p, i) => {
          const active = p.id === this._page;
          const hover = drag?.hover === i;
          return html`
            <button class="tab ${active ? 'active' : ''} ${hover ? 'hover' : ''}" aria-label=${p.name} aria-current=${active ? 'page' : 'false'}
              @click=${() => this._selectPage(p.id)}>
              ${icon(p.icon, 20, 'currentColor')}${active ? html`<span>${p.name}</span>` : nothing}
            </button>
          `;
        })}
      </nav>
    `;
  }

  /** A new tab starts at the top; tapping the current tab scrolls it back up smoothly (iOS). */
  private _selectPage(id: PageId) {
    const same = id === this._page;
    this._page = id;
    if (id === 'rooms' && !same) this._roomsFilter = 'all';
    this._scrollTop(same ? 'smooth' : 'instant');
  }

  /** HA scrolls the window or a container around the view, depending on version and layout. */
  private _scrollTop(behavior: ScrollBehavior) {
    window.scrollTo({ top: 0, behavior });
    for (let el: Node | null = this; el; el = el.parentNode ?? (el as ShadowRoot).host ?? null) {
      if (el instanceof HTMLElement && el.scrollTop > 0) el.scrollTo({ top: 0, behavior });
    }
  }

  private _navStart?: { x: number; id: number; tabs: { left: number; right: number }[]; width: number; barWidth: number; navLeft: number };

  private _navDown = (e: PointerEvent) => {
    if (e.button > 0) return;
    const nav = e.currentTarget as HTMLElement;
    const r = nav.getBoundingClientRect();
    const tabs = [...nav.querySelectorAll<HTMLElement>('.tab')].map((t) => {
      const b = t.getBoundingClientRect();
      return { left: b.left - r.left, right: b.right - r.left };
    });
    const unit = (r.width - 12 - (PAGES.length - 1) * 4) / (PAGES.length + 1);
    this._navStart = { x: e.clientX, id: e.pointerId, tabs, width: Math.round(unit * 1.6), barWidth: r.width, navLeft: r.left };
  };

  private _navMove = (e: PointerEvent) => {
    const s = this._navStart;
    if (!s || e.pointerId !== s.id) return;
    if (!this._navDrag && Math.abs(e.clientX - s.x) < 8) return;
    const nav = e.currentTarget as HTMLElement;
    if (!this._navDrag) {
      try {
        nav.setPointerCapture(e.pointerId);
      } catch {
        // pointer already gone; the drag still works while it stays over the bar
      }
    }
    const x = e.clientX - s.navLeft;
    const hover = tabAt(x, s.tabs);
    if (this._navDrag && hover !== this._navDrag.hover) haptic(this, 'selection');
    this._navDrag = { ...lensBox(x, s.width, s.barWidth, 6), hover };
  };

  private _navUp = (e: PointerEvent) => {
    const drag = this._navDrag;
    this._navStart = undefined;
    if (!drag) return;
    const nav = e.currentTarget as HTMLElement;
    if (nav.hasPointerCapture?.(e.pointerId)) nav.releasePointerCapture(e.pointerId);
    this._navDrag = null;
    this._selectPage(PAGES[drag.hover].id);
  };

  private _navCancel = () => {
    this._navStart = undefined;
    this._navDrag = null;
  };

  /**
   * Open sheets as layers: a child sheet (chart, device) sits on top of the sheet it was
   * opened from, which stays visible underneath. A confirm dialog sits on top of the current
   * sheet. Layers are keyed so a sheet keeps its DOM (and does not replay its entry
   * animation) when it moves between underneath and on top.
   */
  private _renderSheets(ctx: PageContext) {
    const layers: { key: string; view: unknown }[] = [];
    const sh = this._sheet;
    if (sh) {
      const parent = sheetParent(sh);
      if (parent) layers.push({ key: sheetKey(parent), view: this._sheetView(ctx, parent) });
      layers.push({ key: sheetKey(sh), view: this._sheetView(ctx, sh) });
    }
    if (this._confirm) {
      layers.push({ key: 'confirm', view: confirmSheet({ ...this._confirm, onClose: () => (this._confirm = null) }) });
    }
    if (!layers.length) return nothing;
    const top = layers.length - 1;
    return repeat(layers, (l) => l.key, (l, i) => html`
      <div class="layer ${i < top ? 'under' : ''} ${i > 0 ? 'stacked' : ''}" ?inert=${i < top}>${l.view}</div>`);
  }

  private _sheetView(ctx: PageContext, sh: SheetState) {
    switch (sh.id) {
      case 'persons':
        return personsSheet(ctx);
      case 'alarm':
        return alarmSheet(ctx);
      case 'room':
        return roomSheet(ctx, sh.slug);
      case 'history':
        return historySheet(ctx, sh.slug, sh.range);
      case 'airing':
        return airingSheet(ctx);
      case 'allRooms':
        return allRoomsSheet(ctx);
      case 'device':
        return deviceSheet(ctx, sh.entity, sh);
      case 'robby':
        return robbySheet(ctx);
      case 'weather':
        return weatherSheet(ctx);
      case 'care':
        return careSheet(ctx);
      case 'ac':
        return acSheet(ctx);
      case 'energyChart':
        return energyChartSheet(ctx, sh.key, sh.range, sh.name, sh.back);
      case 'weatherMetric':
        return weatherMetricSheet(ctx, sh.metric);
      case 'weatherRain':
        return weatherRainSheet(ctx);
      case 'dew':
        return dewSheet(ctx, sh.slug, sh.range);
      case 'weatherDay':
        return weatherDaySheet(ctx, sh.date);
      case 'technik':
        return technikSheet(ctx);
      case 'printer':
        return printerSheet(ctx);
    }
  }

  static styles = [
    baseStyles,
    sheetStyles,
    overviewStyles,
    climateStyles,
    alarmStyles,
    personsStyles,
    roomStyles,
    historyStyles,
    airingStyles,
    allRoomsStyles,
    roomsStyles,
    deviceStyles,
    energyStyles,
    securityStyles,
    robbyStyles,
    weatherStyles,
    dewStyles,
    careStyles,
    acStyles,
    technikStyles,
    printerStyles,
    trendStyles,
    scrubStyles,
    css`
      .wrap {
        position: relative;
        min-height: calc(100vh - var(--header-height, 56px));
        background-color: var(--sd-bg);
        background-repeat: no-repeat;
        /* iOS rubber-band scrolling shows what lies below the page (the HA theme background);
           a shadow paints the card background there without growing the scroll area. */
        box-shadow: 0 100vh 0 0 var(--sd-bg);
        display: flex;
        flex-direction: column;
      }
      .wrap.hdr-hide,
      .wrap.hdr-blend {
        min-height: 100vh;
        padding-top: env(safe-area-inset-top);
      }
      .wrap.hdr-blend {
        padding-top: calc(var(--header-height, 56px) + env(safe-area-inset-top));
      }
      .content {
        flex: 1;
        width: 100%;
        max-width: 480px;
        margin: 0 auto;
        padding: 22px 14px 24px;
      }
      .nav {
        position: sticky;
        touch-action: pan-y;
        user-select: none;
        -webkit-user-select: none;
        bottom: calc(16px + env(safe-area-inset-bottom));
        z-index: 10;
        width: calc(100% - 28px);
        max-width: 452px;
        margin: 0 auto calc(16px + env(safe-area-inset-bottom));
        display: flex;
        gap: 4px;
        padding: 6px;
        border-radius: 34px;
        background: rgba(30, 32, 40, 0.88);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.55);
      }
      .lens {
        position: absolute;
        top: 6px;
        bottom: 6px;
        border-radius: 23px;
        background: #fff;
        transition:
          left 0.42s cubic-bezier(0.25, 1.3, 0.4, 1),
          width 0.42s cubic-bezier(0.25, 1.3, 0.4, 1),
          background 0.2s ease,
          transform 0.2s ease;
        pointer-events: none;
      }
      .nav.dragging .lens {
        transition:
          background 0.2s ease,
          transform 0.2s ease;
        top: 2px;
        bottom: 2px;
        border-radius: 27px;
        background: rgba(255, 255, 255, 0.16);
        backdrop-filter: blur(6px) saturate(1.8) brightness(1.15);
        -webkit-backdrop-filter: blur(6px) saturate(1.8) brightness(1.15);
        box-shadow:
          inset 0 1px 1px rgba(255, 255, 255, 0.7),
          inset 0 -1px 1px rgba(255, 255, 255, 0.25),
          0 6px 18px rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.35);
        transform: scale(1.06);
      }
      .tab {
        position: relative;
        color: rgba(255, 255, 255, 0.8);
        transition:
          flex 0.3s cubic-bezier(0.25, 1.2, 0.4, 1),
          color 0.2s ease,
          transform 0.2s ease;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        height: 46px;
        border-radius: 23px;
        font-size: 13px;
        font-weight: 700;
      }
      .tab.active {
        flex: 2;
        color: #101218;
      }
      .nav.dragging .tab.active {
        color: #fff;
      }
      .tab.hover {
        transform: scale(1.18);
        color: #fff;
      }
      @media (prefers-reduced-motion: reduce) {
        .lens,
        .tab {
          transition: none;
        }
      }
      .page-head {
        padding: 0 6px 12px;
      }
      .page-head h1 {
        margin-top: 2px;
        font-size: 30px;
        font-weight: 700;
      }
      .todo {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 58px;
        padding: 0 8px;
        border-radius: 29px;
        background: var(--sd-fill);
        font-size: 14px;
        color: var(--sd-muted);
      }
    `,
  ];
}

if (!customElements.get('ha-start-dashboard')) {
  customElements.define('ha-start-dashboard', HaStartDashboard);
}

const w = window as unknown as { customCards?: unknown[] };
w.customCards = w.customCards ?? [];
w.customCards.push({
  type: 'ha-start-dashboard',
  name: 'Start Dashboard',
  description: 'Phone-first Start dashboard (Übersicht, Klima, Räume, Energie, Schutz) in one card.',
  preview: false,
});

console.info(`%c START-DASHBOARD %c ${VERSION} `, 'background:#bf9bff;color:#1d1030;font-weight:700', 'background:#181a22;color:#fff');
