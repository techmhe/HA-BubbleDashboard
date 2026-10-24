import { noChange } from 'lit';
import { Directive, directive, PartType, type ElementPart, type PartInfo } from 'lit/directive.js';

export interface HoldOptions {
  tap?: () => void;
  hold?: () => void;
}

const HOLD_MS = 500;
const MOVE_TOLERANCE = 10;

interface State {
  opts: HoldOptions;
  timer?: number;
  held: boolean;
  x: number;
  y: number;
}

const states = new WeakMap<Element, State>();

function haptic(el: Element, type = 'medium') {
  el.dispatchEvent(new CustomEvent('haptic', { detail: type, bubbles: true, composed: true }));
}

function attach(el: HTMLElement) {
  const st = () => states.get(el)!;
  const cancel = () => {
    window.clearTimeout(st().timer);
    st().timer = undefined;
  };
  el.addEventListener('pointerdown', (e: PointerEvent) => {
    const s = st();
    s.held = false;
    if (!s.opts.hold || e.button > 0) return;
    s.x = e.clientX;
    s.y = e.clientY;
    s.timer = window.setTimeout(() => {
      s.held = true;
      s.timer = undefined;
      haptic(el);
      s.opts.hold?.();
    }, HOLD_MS);
  });
  el.addEventListener('pointermove', (e: PointerEvent) => {
    const s = st();
    if (s.timer && Math.hypot(e.clientX - s.x, e.clientY - s.y) > MOVE_TOLERANCE) cancel();
  });
  el.addEventListener('pointerup', cancel);
  el.addEventListener('pointercancel', cancel);
  el.addEventListener('pointerleave', cancel);
  el.addEventListener('contextmenu', (e) => {
    if (st().opts.hold) e.preventDefault();
  });
  // Taps go through `click` so keyboard activation works too.
  el.addEventListener('click', (e) => {
    const s = st();
    if (s.held) {
      s.held = false;
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (s.opts.tap) {
      haptic(el, 'light');
      s.opts.tap();
    }
  });
}

class HoldDirective extends Directive {
  constructor(info: PartInfo) {
    super(info);
    if (info.type !== PartType.ELEMENT) throw new Error('hold() must be used as an element directive');
  }
  render(_opts: HoldOptions) {
    return noChange;
  }
  override update(part: ElementPart, [opts]: [HoldOptions]) {
    const el = part.element as HTMLElement;
    const existing = states.get(el);
    if (existing) existing.opts = opts;
    else {
      states.set(el, { opts, held: false, x: 0, y: 0 });
      attach(el);
    }
    return noChange;
  }
}

/** Tap + long-press (~500 ms, haptic feedback) on any element. */
export const hold = directive(HoldDirective);
