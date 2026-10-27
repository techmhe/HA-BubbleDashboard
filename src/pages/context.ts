import type { TemplateResult } from 'lit';
import type { Point } from '../logic/climate';
import type { ForecastItem, WeatherMetric } from '../logic/weather';
import type { EnergyPrefs, EnergyTotals } from '../logic/energy';
import type { SceneConfig } from '../logic/devices';
import type { ChartRange, SeriesResult, DewRange } from '../data/series';
import type { Room } from '../logic/rooms';
import type { HeatingAlert } from '../logic/heating-check';
import type { AlarmoSensor } from '../logic/health';
import type { PowerPoint } from '../logic/appliances';
import type { WindowState } from '../logic/window-state';
import type { CardConfig, HomeAssistant, PageId } from '../types';
import type { ConfirmOptions } from '../components/ui';

export interface Target {
  entity_id: string | string[];
}

export type HistoryRange = '24h' | '7d' | '30d';

export type SheetState =
  | { id: 'alarm' }
  | { id: 'persons' }
  | { id: 'room'; slug: string }
  | { id: 'history'; slug: string; range: HistoryRange }
  | { id: 'airing' }
  /** One room from the airing sheet: last 15 min of temperature and humidity with the dew point verdict. */
  | { id: 'airingRoom'; slug: string }
  | { id: 'allRooms' }
  | { id: 'robby' }
  | { id: 'weather' }
  | { id: 'care' }
  | { id: 'ac' }
  | { id: 'weatherMetric'; metric: WeatherMetric }
  | { id: 'weatherRain' }
  /** Pi-hole, services, guest WLAN, printer row (tech users only). */
  | { id: 'technik' }
  | { id: 'printer' }
  /** Room dew point vs. outdoor, with the airing recommendation as bands. */
  | { id: 'dew'; slug: string; range: DewRange }
  /** One forecast day; `date` is the daily forecast item's datetime. */
  | { id: 'weatherDay'; date: string }
  /** Energy chart: 'pv' | 'import' | 'export' | 'house' | 'battery' (charged/discharged) | 'autarky' | 'selfuse' or a consumer's power sensor. */
  | { id: 'energyChart'; key: string; range: ChartRange; name?: string; back?: SheetState }
  /** Long-press sheet for a device; `back` returns to the sheet it was opened from. */
  | { id: 'device'; entity: string; back?: SheetState };

export interface HistoryData {
  loading: boolean;
  error?: string;
  temp: Point[];
  hum: Point[];
  start: number;
  end: number;
}

export interface ForecastData {
  loading: boolean;
  error?: string;
  hourly: ForecastItem[];
  daily: ForecastItem[];
  at: number;
}

export interface SeriesData extends SeriesResult {
  loading: boolean;
  error?: string;
}

export interface EnergyInfo {
  /** HA energy dashboard config, once loaded. */
  prefs?: EnergyPrefs;
  /** Today's kWh from the energy dashboard statistics, once loaded. */
  today?: EnergyTotals;
}

export interface AllRoomsState {
  temp: number;
  selected: Set<string>;
  duration: string;
}

/** Everything a page needs to render and act; provided by the card. */
export interface PageContext {
  hass: HomeAssistant;
  config: CardConfig;
  rooms: Room[];
  now: Date;
  go(page: PageId, opts?: { roomsFilter?: string }): void;
  moreInfo(entityId: string): void;
  /** Navigate inside the HA frontend, e.g. to /energy. */
  navigate(path: string): void;
  openSheet(sheet: SheetState): void;
  closeSheet(): void;
  confirm(opts: Omit<ConfirmOptions, 'onClose'>): void;
  /** Service call; entities go in `target`, never in `data`. */
  call(domain: string, service: string, data?: Record<string, unknown>, target?: Target): Promise<void>;
  /** Run a script entity (e.g. script.luften_starten) with optional fields. */
  runScript(entityId: string, data?: Record<string, unknown>): Promise<void>;
  /** Target temperature incl. a pending (optimistic) change. */
  target(climate: string | undefined): number | undefined;
  /** Change a climate target by delta (0.5 steps), optimistic + debounced. */
  stepTarget(climate: string, delta: number): void;
  history(slug: string, range: HistoryRange): HistoryData;
  /** Hourly + daily forecast of the weather entity (loaded on demand, cached 15 min). */
  forecast(): ForecastData;
  /** Energy dashboard config and today's totals (loaded on demand, refreshed every 5 min). */
  energy(): EnergyInfo;
  /** Rooms that keep warming without calling for heat (loaded on demand, refreshed every 10 min). */
  heating(): HeatingAlert[];
  /** Alarmo's sensors (loaded on demand, refreshed every 30 min; empty until loaded or when not allowed). */
  alarmoSensors(): AlarmoSensor[];
  /** Power history of the appliances' sensors, keyed by entity (last 6 h, loaded once, then extended from live states). */
  applianceRuns(): Record<string, PowerPoint[]>;
  /** Airing state of a room (recommend / airing / overdue / stuck / open), incl. sensor check and snoozes. */
  window(room: Room): WindowState;
  /** Cached chart data under `key`; `load` runs when missing or older than `maxAgeMs` (default 5 min). */
  series(key: string, load: () => Promise<SeriesResult>, maxAgeMs?: number): SeriesData;
  /** Stored states of UI scenes (loaded once; empty without admin rights). */
  sceneConfigs(): Record<string, SceneConfig | undefined>;
  allRooms: AllRoomsState;
  setAllRooms(patch: Partial<AllRoomsState>): void;
  /** Räume filter: 'all', 'on' or a floor id. */
  roomsFilter: string;
  setRoomsFilter(filter: string): void;
  /** Energie: all current consumers instead of the top six. */
  consumersAll: boolean;
  setConsumersAll(all: boolean): void;
  /** Optimistic attribute value (e.g. humidifier target) while a debounced call is pending. */
  pending(entityId: string, attr: string): number | undefined;
  setPending(entityId: string, attr: string, value: number, send: () => void): void;
  /** Small per-sheet UI state (time input open, chosen time, ...); reset when the sheet changes. */
  ui: Record<string, unknown>;
  setUi(patch: Record<string, unknown>): void;
  /** Items hidden on this device (e.g. a finished print after "OK"). */
  dismissed(key: string): boolean;
  dismiss(key: string): void;
  /** End of a Pi-hole pause started from this card (ms), if any. */
  piholePause?: number;
  setPiholePause(until?: number): void;
}

export type PageRenderer = (ctx: PageContext) => TemplateResult;
