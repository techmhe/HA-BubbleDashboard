import { html, svg, type TemplateResult } from 'lit';
import { icon } from './ui';
import { deviceIcon, I, IC, ID, weatherIcon } from '../icons';
import { purifierState } from '../logic/devices';
import type { DeviceInfo } from '../logic/devices';
import type { Appliance } from '../logic/appliances';

/** Fan speed class: 1 slow, 2 medium, 3 fast; "auto" spins slowly like level 1. */
export type FanLevel = 1 | 2 | 3 | 'auto';

/** Level of a purifier from `percentage` / `preset_mode`; sleep is the slowest, auto and unknown levels slow. */
export function fanLevel(state: string, attrs: Record<string, any>): FanLevel {
  const p = purifierState(state, attrs);
  if (p.mode === 'sleep') return 1;
  if (p.mode !== 'manual' || p.level === null) return 'auto';
  return Math.max(1, Math.min(3, Math.ceil((p.level / p.levels) * 3))) as 1 | 2 | 3;
}

function frame(size: number, stroke: string, inner: TemplateResult, width = 2.2): TemplateResult {
  return html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${stroke} stroke-width=${width}
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

/** Fan whose blades turn while on (2.4 s / 1.4 s / 0.8 s per turn for level 1 or auto / 2 / 3). */
export function fanIcon(on: boolean, level: FanLevel, size: number, stroke: string, width = 2.2): TemplateResult {
  const speed = level === 'auto' ? 1 : level;
  return frame(size, stroke, on ? svg`<path class="spin s${speed}" d=${IC.fan}></path>` : svg`<path d=${IC.fan}></path>`, width);
}

const DRUM = 'M12 10a4 4 0 1 0 0 8a4 4 0 1 0 0-8';
const PADDLE = 'M9.5 14h5';
const DISHWASHER_FRAME = 'M5 3h14v18H5zM5 7h14';

/** Washer / dryer: the drum tumbles while running. Dishwasher: spray dots pulse. Others stay still. */
export function applianceIcon(kind: Appliance['kind'], running: boolean, size: number, stroke: string, width = 2.2): TemplateResult {
  if (kind === 'dishwasher') {
    const dots = 'M9 12h.01M12 15h.01M15 12h.01M10.5 18h.01M13.5 18h.01';
    return frame(size, stroke, svg`<path d=${DISHWASHER_FRAME}></path><path class=${running ? 'spray' : ''} d=${dots}></path>`, width);
  }
  if (kind === 'washer' || kind === 'dryer') {
    const box = kind === 'washer' ? 'M5 3h14v18H5zM5 7h14' : 'M4 3h16v18H4zM7 6h.01';
    return frame(size, stroke, svg`<path d=${box}></path><g class=${running ? 'tumble' : ''}><path d=${DRUM}></path><path d=${PADDLE}></path></g>`, width);
  }
  return frame(size, stroke, svg`<path d=${I.washer}></path>`, width);
}

/** Droplet that bobs gently while the dehumidifier runs. */
export function dropIcon(on: boolean, size: number, stroke: string, width = 2.2): TemplateResult {
  return frame(size, stroke, svg`<path class=${on ? 'bob' : ''} d=${ID.drop}></path>`, width);
}

/** Device tile icon: the purifier fan and the dehumidifier droplet move while the device is on. */
export function deviceGlyph(d: Pick<DeviceInfo, 'id' | 'name' | 'kind' | 'on'>, attrs: Record<string, any> | undefined, size: number, stroke: string, width = 2.2): TemplateResult {
  if (d.kind === 'fan') return fanIcon(d.on, fanLevel(d.on ? 'on' : 'off', attrs ?? {}), size, stroke, width);
  if (d.kind === 'humidifier') return dropIcon(d.on, size, stroke, width);
  return icon(deviceIcon(d.id, d.name), size, stroke, width);
}

const CLOUD = 'M7 15a5 5 0 1 1 3-9 6 6 0 0 1 9 5 4 4 0 0 1-2 4H7';
const SUN_DISC = 'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8';
const SUN_RAYS = 'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4';
const DROPS = 'M8 18l-1 3M12 18l-1 3M16 18l-1 3';
const FLAKES = 'M8 19h.01M12 19h.01M16 19h.01M10 22h.01M14 22h.01';
const BOLT = 'M13 12l-3 5h4l-3 5';
const CLOUD_STORM = 'M7 15a5 5 0 1 1 3-9 6 6 0 0 1 9 5 4 4 0 0 1-2 4';

/** Weather icon: rain/snow fall under a still cloud, clouds drift, sun rays turn (20 s), lightning flashes every 6 s. */
export function weatherAnim(condition: string, size: number, stroke: string): TemplateResult {
  // Falling parts live in a clipped area under the cloud so they never cross the cloud body.
  const falling = (cls: string, d: string) =>
    svg`<clipPath id="wx-under"><rect x="0" y="16.5" width="24" height="7.5"></rect></clipPath>
      <g clip-path="url(#wx-under)"><path class=${cls} d=${d}></path></g>`;
  switch (condition) {
    case 'rainy':
    case 'pouring':
      return frame(size, stroke, svg`<path d=${CLOUD}></path>${falling('rain', DROPS)}`, 2);
    case 'lightning-rainy':
      return frame(size, stroke, svg`<path d=${CLOUD_STORM}></path><path d=${BOLT}></path>${falling('rain', DROPS)}`, 2);
    case 'snowy':
    case 'snowy-rainy':
      return frame(size, stroke, svg`<path d=${CLOUD}></path>${falling('snow', FLAKES)}`, 2);
    case 'cloudy':
    case 'partlycloudy':
      return frame(size, stroke, svg`<path class="drift" d=${I.cloud}></path>`, 2);
    case 'sunny':
      return frame(size, stroke, svg`<path d=${SUN_DISC}></path><path class="rays" d=${SUN_RAYS}></path>`, 2);
    case 'lightning':
      return frame(size, stroke, svg`<path d=${CLOUD_STORM}></path><path class="flash" d=${BOLT}></path>`, 2);
    default:
      return icon(weatherIcon(condition), size, stroke, 2);
  }
}
