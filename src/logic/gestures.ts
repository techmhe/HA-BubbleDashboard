/** Pull distance (px) and speed (px/ms) that close a bottom sheet. */
export function shouldDismiss(dy: number, velocity: number, height: number): boolean {
  if (dy < 30) return false;
  return dy >= Math.max(80, Math.min(140, height * 0.25)) || velocity >= 0.5;
}

/** Sheet offset for a finger delta: 1:1 downwards, rubber band upwards (max 40 px). */
export function dragOffset(dy: number): number {
  if (dy >= 0) return dy;
  return -Math.min(40, Math.round(-dy * 0.15));
}

/** Index of the tab under x; the nearest one when x is in a gap or outside. */
export function tabAt(x: number, tabs: { left: number; right: number }[]): number {
  let best = 0;
  let dist = Infinity;
  tabs.forEach((t, i) => {
    const d = x < t.left ? t.left - x : x > t.right ? x - t.right : 0;
    if (d < dist) {
      dist = d;
      best = i;
    }
  });
  return best;
}

/** Lens of `width` centred on x, kept inside a bar of `barWidth` with `pad` inset. */
export function lensBox(x: number, width: number, barWidth: number, pad: number): { left: number; width: number } {
  const left = Math.max(pad, Math.min(barWidth - pad - width, x - width / 2));
  return { left: Math.round(left), width };
}
