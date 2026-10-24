import { noChange } from 'lit';
import { Directive, directive, PartType, type ElementPart, type PartInfo } from 'lit/directive.js';
import { dragOffset, shouldDismiss } from '../logic/gestures';

/**
 * Pull a bottom sheet down to close it: from the grabber/header anywhere, from the content
 * only while it is scrolled to the top. Touch via touch events (so content scrolling stays
 * native), mouse via pointer events on the grabber/header.
 */
interface State {
  onClose: () => void;
  startX: number;
  startY: number;
  active: boolean;
  decided: boolean;
  fromHead: boolean;
  samples: { y: number; t: number }[];
  dy: number;
}

const HANDLE = '.grabber, .sheet-head';
const states = new WeakMap<HTMLElement, State>();

function backdrop(el: HTMLElement): HTMLElement | null {
  const prev = el.previousElementSibling;
  return prev instanceof HTMLElement && prev.classList.contains('backdrop') ? prev : null;
}

function setOffset(el: HTMLElement, dy: number) {
  el.style.setProperty('--drag', `${dy}px`);
  const bd = backdrop(el);
  if (bd) bd.style.opacity = String(Math.max(0.15, 1 - Math.max(0, dy) / (el.offsetHeight || 600)));
}

function reset(el: HTMLElement) {
  el.style.removeProperty('--drag');
  el.style.transition = '';
  const bd = backdrop(el);
  if (bd) {
    bd.style.opacity = '';
    bd.style.transition = '';
  }
}

function begin(s: State, x: number, y: number, fromHead: boolean) {
  Object.assign(s, { startX: x, startY: y, active: false, decided: false, fromHead, samples: [{ y, t: performance.now() }], dy: 0 });
}

/** Returns true while the gesture owns the movement. */
function move(el: HTMLElement, s: State, x: number, y: number): boolean {
  const dy = y - s.startY;
  const dx = x - s.startX;
  if (!s.decided) {
    if (Math.abs(dy) < 6 && Math.abs(dx) < 6) return false;
    s.decided = true;
    s.active = Math.abs(dy) > Math.abs(dx) && dy > 0 && (s.fromHead || el.scrollTop <= 0);
    if (s.active) {
      el.style.transition = 'none';
      const bd = backdrop(el);
      if (bd) bd.style.transition = 'none';
    }
  }
  if (!s.active) return false;
  s.dy = dragOffset(dy);
  s.samples.push({ y, t: performance.now() });
  if (s.samples.length > 5) s.samples.shift();
  setOffset(el, s.dy);
  return true;
}

function end(el: HTMLElement, s: State) {
  if (!s.active) return;
  s.active = false;
  const first = s.samples[0];
  const last = s.samples[s.samples.length - 1];
  // Ignore speed over less than one frame; it is noise, not a flick.
  const velocity = last.t - first.t >= 16 ? (last.y - first.y) / (last.t - first.t) : 0;
  const bd = backdrop(el);
  if (shouldDismiss(s.dy, velocity, el.offsetHeight)) {
    el.style.transition = 'transform 0.2s ease-in';
    if (bd) bd.style.transition = 'opacity 0.2s ease-in';
    setOffset(el, el.offsetHeight + 40);
    if (bd) bd.style.opacity = '0';
    window.setTimeout(() => {
      s.onClose();
      reset(el); // the element may be reused for the next sheet
    }, 190);
  } else {
    el.style.transition = 'transform 0.32s cubic-bezier(0.2, 0.9, 0.3, 1.15)';
    if (bd) bd.style.transition = 'opacity 0.3s ease-out';
    setOffset(el, 0);
    if (bd) bd.style.opacity = '';
    window.setTimeout(() => reset(el), 340);
  }
}

function attach(el: HTMLElement) {
  const st = () => states.get(el)!;
  // touch
  el.addEventListener('touchstart', (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    const target = e.target as Element;
    if (target.closest('start-dashboard-slider, input')) return;
    begin(st(), t.clientX, t.clientY, !!target.closest(HANDLE));
  }, { passive: true });
  el.addEventListener('touchmove', (e: TouchEvent) => {
    const t = e.touches[0];
    if (t && move(el, st(), t.clientX, t.clientY) && e.cancelable) e.preventDefault();
  }, { passive: false });
  el.addEventListener('touchend', () => end(el, st()));
  el.addEventListener('touchcancel', () => end(el, st()));
  // mouse on the handle
  el.addEventListener('pointerdown', (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !(e.target as Element).closest(HANDLE)) return;
    begin(st(), e.clientX, e.clientY, true);
    const onMove = (ev: PointerEvent) => move(el, st(), ev.clientX, ev.clientY);
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      const wasDrag = st().active;
      end(el, st());
      // swallow the click that follows a drag (e.g. on the close button)
      if (wasDrag) el.addEventListener('click', (c) => c.stopPropagation(), { capture: true, once: true });
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  });
}

class SwipeToCloseDirective extends Directive {
  constructor(part: PartInfo) {
    super(part);
    if (part.type !== PartType.ELEMENT) throw new Error('swipeToClose() must be used as an element directive');
  }

  render(_onClose: () => void) {
    return noChange;
  }

  update(part: ElementPart, [onClose]: [() => void]) {
    const el = part.element as HTMLElement;
    const s = states.get(el);
    if (s) s.onClose = onClose;
    else {
      states.set(el, { onClose, startX: 0, startY: 0, active: false, decided: false, fromHead: false, samples: [], dy: 0 });
      attach(el);
    }
    return noChange;
  }
}

export const swipeToClose = directive(SwipeToCloseDirective);
