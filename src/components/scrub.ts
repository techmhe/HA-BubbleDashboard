import { css, noChange } from 'lit';
import { Directive, directive, PartType, type ElementPart, type PartInfo } from 'lit/directive.js';
import { nearestIndex, type ScrubPoint } from '../logic/scrub';
import { haptic } from './hold';

/**
 * Drag a finger (or hover the mouse) along a chart to read its values: a vertical line, a dot
 * on the bar/curve and a bubble with time and value. Goes on the chart wrapper (`.sc-wrap`),
 * which holds the SVG and an empty `.sc-layer` the overlay is drawn into, so Lit's own
 * rendering is never touched. Vertical swipes still scroll the sheet (touch-action: pan-y).
 */
export interface ScrubConfig {
  points: ScrubPoint[];
  /** SVG viewBox size, to map points onto the wrapper. */
  width: number;
  height: number;
  color: string;
}

const LINGER_MS = 1800;

interface State {
  cfg: ScrubConfig;
  index: number;
  pressed: boolean;
  timer?: number;
}

const states = new WeakMap<HTMLElement, State>();

function layer(el: HTMLElement): HTMLElement | null {
  return el.querySelector(':scope > .sc-layer');
}

function hide(el: HTMLElement) {
  const st = states.get(el);
  if (st) st.index = -1;
  layer(el)?.classList.remove('on');
}

function show(el: HTMLElement, clientX: number) {
  const st = states.get(el);
  const box = layer(el);
  if (!st || !box || !st.cfg.points.length) return;
  const rect = el.getBoundingClientRect();
  if (!rect.width) return;
  const vx = ((clientX - rect.left) / rect.width) * st.cfg.width;
  const i = nearestIndex(st.cfg.points.map((p) => p.x), vx);
  if (i < 0) return;
  if (i !== st.index && st.index >= 0) haptic(el, 'selection');
  st.index = i;
  const p = st.cfg.points[i];
  if (!box.firstChild) {
    box.innerHTML = '<div class="sc-line"></div><div class="sc-dot"></div><div class="sc-tip"><span class="sc-t"></span><span class="sc-v"></span><span class="sc-e"></span></div>';
  }
  const px = (p.x / st.cfg.width) * rect.width;
  const py = (p.y / st.cfg.height) * rect.height;
  const [line, dot, tip] = Array.from(box.children) as HTMLElement[];
  line.style.left = `${px}px`;
  dot.style.left = `${px}px`;
  dot.style.top = `${py}px`;
  dot.style.background = st.cfg.color;
  const [t, v, e] = Array.from(tip.children) as HTMLElement[];
  t.textContent = p.time;
  v.textContent = p.value;
  v.style.color = st.cfg.color;
  e.textContent = p.extra ?? '';
  e.hidden = !p.extra;
  box.classList.add('on');
  const w = tip.offsetWidth;
  tip.style.left = `${Math.min(Math.max(0, px - w / 2), Math.max(0, rect.width - w))}px`;
}

function attach(el: HTMLElement) {
  const linger = () => {
    const st = states.get(el);
    if (!st) return;
    window.clearTimeout(st.timer);
    st.timer = window.setTimeout(() => hide(el), LINGER_MS);
  };
  el.addEventListener('pointerdown', (ev) => {
    const st = states.get(el);
    if (!st) return;
    window.clearTimeout(st.timer);
    st.pressed = true;
    show(el, ev.clientX);
  });
  el.addEventListener('pointermove', (ev) => {
    const st = states.get(el);
    if (st && (st.pressed || ev.pointerType === 'mouse')) show(el, ev.clientX);
  });
  const release = () => {
    const st = states.get(el);
    if (!st) return;
    st.pressed = false;
    linger();
  };
  el.addEventListener('pointerup', release);
  el.addEventListener('pointercancel', release);
  el.addEventListener('pointerleave', (ev) => {
    if (ev.pointerType === 'mouse') hide(el);
    else release();
  });
}

class ScrubDirective extends Directive {
  constructor(part: PartInfo) {
    super(part);
    if (part.type !== PartType.ELEMENT) throw new Error('scrub() must be used on an element');
  }

  render(_cfg: ScrubConfig) {
    return noChange;
  }

  update(part: ElementPart, [cfg]: [ScrubConfig]) {
    const el = part.element as HTMLElement;
    const st = states.get(el);
    if (st) {
      st.cfg = cfg;
      if (st.index >= cfg.points.length) hide(el);
    } else {
      states.set(el, { cfg, index: -1, pressed: false });
      attach(el);
    }
    return noChange;
  }
}

export const scrub = directive(ScrubDirective);

export const scrubStyles = css`
  .sc-wrap {
    position: relative;
    touch-action: pan-y;
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
  }
  .sc-wrap > svg {
    display: block;
  }
  .sc-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .sc-layer.on {
    opacity: 1;
  }
  .sc-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(255, 255, 255, 0.45);
  }
  .sc-dot {
    position: absolute;
    width: 10px;
    height: 10px;
    margin: -5px 0 0 -5px;
    border-radius: 50%;
    box-shadow: 0 0 0 2px #181a22;
  }
  .sc-tip {
    position: absolute;
    top: -8px;
    transform: translateY(-100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px 10px;
    border-radius: 12px;
    background: rgba(20, 22, 28, 0.92);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12), 0 6px 18px rgba(0, 0, 0, 0.4);
    white-space: nowrap;
    line-height: 1.25;
  }
  .sc-t {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.65);
  }
  .sc-v {
    font-size: 14px;
    font-weight: 700;
  }
  .sc-e {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.75);
  }
`;
