/** Items hidden on this device ("OK" on a finished print), kept 48 h in localStorage. */

const KEY = 'hsd-dismissed';
const KEEP_MS = 48 * 3600_000;

export type Dismissed = Record<string, number>;

export function loadDismissed(now = Date.now()): Dismissed {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Dismissed;
    return Object.fromEntries(Object.entries(raw).filter(([, at]) => typeof at === 'number' && now - at < KEEP_MS));
  } catch {
    return {};
  }
}

export function saveDismissed(map: Dismissed): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    // private mode or blocked storage: keep it in memory only
  }
}
