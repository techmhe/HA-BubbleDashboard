/** Card layout, chosen from the card's own width. */
export type Layout = 'phone' | 'tablet' | 'wide';

/** phone < 700 px, tablet 700–999 px (iPad portrait), wide ≥ 1000 px (iPad landscape, MacBook). */
export function layoutFor(width: number): Layout {
  if (!(width >= 700)) return 'phone';
  return width >= 1000 ? 'wide' : 'tablet';
}
