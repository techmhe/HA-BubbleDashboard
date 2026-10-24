import type { HomeAssistant } from '../types';

export interface MapEntity {
  entity_id: string;
  color?: string;
  focus?: boolean;
}

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
  }
}

if (!customElements.get('start-dashboard-map')) customElements.define('start-dashboard-map', SdMap);
