import type { SheetState } from '../pages/context';

/** The sheet a child sheet was opened from; it stays visible underneath. */
export function sheetParent(sh: SheetState): SheetState | null {
  switch (sh.id) {
    case 'weatherMetric':
    case 'weatherDay':
      return { id: 'weather' };
    case 'history':
      return { id: 'room', slug: sh.slug };
    case 'device':
    case 'energyChart':
      return sh.back ?? null;
    default:
      return null;
  }
}

/** Stable identity of a sheet: what it shows, without view options such as the chart range. */
export function sheetKey(sh: SheetState): string {
  switch (sh.id) {
    case 'room':
    case 'history':
      return `${sh.id}:${sh.slug}`;
    case 'weatherMetric':
      return `${sh.id}:${sh.metric}`;
    case 'weatherDay':
      return `${sh.id}:${sh.date}`;
    case 'energyChart':
      return `${sh.id}:${sh.key}`;
    case 'device':
      return `${sh.id}:${sh.entity}`;
    default:
      return sh.id;
  }
}
