import type { HomeAssistant } from '../types';

export interface MapEntity {
  entity_id: string;
  color?: string;
  focus?: boolean;
}

/** Card-styled map controls: round glass buttons. ha-map renders MapLibre (HA 2026) or Leaflet (older). */
const CONTROLS_CSS = `
.maplibregl-ctrl-top-left .maplibregl-ctrl { margin: 10px 0 0 10px !important; }
.maplibregl-ctrl-group, .leaflet-bar {
  background: none !important; box-shadow: none !important; border: none !important;
  display: flex; flex-direction: column; gap: 6px;
}
.maplibregl-ctrl-group button, .leaflet-bar a, .leaflet-bar a:hover {
  width: 36px !important; height: 36px !important; line-height: 36px !important;
  border: none !important; border-radius: 50% !important;
  background: rgba(20, 22, 28, 0.72) !important; color: #fff !important;
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12) !important;
}
.maplibregl-ctrl-group button + button { border-top: none !important; }
.maplibregl-ctrl-group button .maplibregl-ctrl-icon { filter: brightness(0) invert(1); }
.maplibregl-ctrl-group button:disabled .maplibregl-ctrl-icon { opacity: 0.35; }
.leaflet-bar a.leaflet-disabled { color: rgba(255, 255, 255, 0.35) !important; }
.leaflet-control-zoom { margin: 10px !important; }
.maplibregl-ctrl-attrib, .leaflet-control-attribution {
  background: rgba(20, 22, 28, 0.72) !important; color: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border-radius: 14px !important; margin: 0 8px 8px 0 !important;
}
.maplibregl-ctrl-attrib a, .leaflet-control-attribution a { color: rgba(255, 255, 255, 0.8) !important; }
.maplibregl-ctrl-attrib-button { background-color: transparent !important; filter: brightness(0) invert(1); opacity: 0.7; }
`;

/**
 * HA's own map (`ha-map`, Leaflet) inside the card. HA loads it lazily with the map card,
 * so the element asks the card helpers for a map card once, then renders `ha-map`.
 * Without HA (dev preview) it shows a placeholder.
 */
class SdMap extends HTMLElement {
  private _hass?: HomeAssistant;
  private _entities: MapEntity[] = [];
  private _map?: HTMLElement & Record<string, unknown>;

  set hass(h: HomeAssistant) {
    this._hass = h;
    if (this._map) this._map.hass = h;
  }

  set entities(e: MapEntity[]) {
    this._entities = e;
    if (this._map) this._map.entities = e;
  }

  connectedCallback() {
    if (this._map) return;
    if (customElements.get('ha-map')) this._render();
    else {
      this._placeholder('Karte wird geladen …');
      void this._load();
    }
  }

  private async _load() {
    const helpers = await (window as unknown as { loadCardHelpers?: () => Promise<{ createCardElement(c: object): HTMLElement }> })
      .loadCardHelpers?.().catch(() => undefined);
    if (!helpers) return this._placeholder('Karte nicht verfügbar');
    helpers.createCardElement({ type: 'map', entities: ['zone.home'] });
    const ok = await Promise.race([
      customElements.whenDefined('ha-map').then(() => true),
      new Promise<boolean>((r) => setTimeout(() => r(false), 8000)),
    ]);
    if (ok) this._render();
    else this._placeholder('Karte nicht verfügbar');
  }

  private _placeholder(text: string) {
    this.replaceChildren(Object.assign(document.createElement('div'), { className: 'map-ph', textContent: text }));
  }

  private _render() {
    const map = document.createElement('ha-map') as HTMLElement & Record<string, unknown>;
    Object.assign(map, { hass: this._hass, entities: this._entities, autoFit: true, fitZones: false, themeMode: 'dark', zoom: 14 });
    map.style.cssText = 'display:block;width:100%;height:100%';
    this._map = map;
    this.replaceChildren(map);
    void this._styleControls(map);
  }

  /** ha-map has its own shadow root; add the control styles there once it has rendered. */
  private async _styleControls(map: HTMLElement) {
    await (map as unknown as { updateComplete?: Promise<unknown> }).updateComplete;
    const root = map.shadowRoot;
    if (!root || root.querySelector('style.sd-map')) return;
    const style = document.createElement('style');
    style.className = 'sd-map';
    style.textContent = CONTROLS_CSS;
    root.appendChild(style);
  }
}

if (!customElements.get('start-dashboard-map')) customElements.define('start-dashboard-map', SdMap);
