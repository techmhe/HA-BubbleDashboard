import { describe, expect, it } from 'vitest';
import { dragOffset, lensBox, shouldDismiss, tabAt } from '../src/logic/gestures';

describe('swipe to close', () => {
  it('closes after a long or a fast pull, springs back otherwise', () => {
    expect(shouldDismiss(160, 0.1, 700)).toBe(true); // far enough
    expect(shouldDismiss(60, 0.9, 700)).toBe(true); // flick
    expect(shouldDismiss(60, 0.2, 700)).toBe(false);
    expect(shouldDismiss(20, 2, 700)).toBe(false); // tiny jitter, even if fast
    expect(shouldDismiss(90, 0.1, 300)).toBe(true); // short sheet: a quarter is enough
    expect(shouldDismiss(60, 0.2, 170)).toBe(false); // tiny sheet: at least 80 px
  });

  it('follows the finger downwards and resists upwards', () => {
    expect(dragOffset(120)).toBe(120);
    expect(dragOffset(-100)).toBe(-15);
    expect(dragOffset(-1000)).toBe(-40);
  });
});

describe('tab bar lens', () => {
  const tabs = [{ left: 6, right: 70 }, { left: 74, right: 138 }, { left: 142, right: 270 }, { left: 274, right: 338 }];

  it('finds the tab under the finger, nearest when between or outside', () => {
    expect(tabAt(100, tabs)).toBe(1);
    expect(tabAt(73, tabs)).toBe(1);
    expect(tabAt(-30, tabs)).toBe(0);
    expect(tabAt(900, tabs)).toBe(3);
  });

  it('centres the lens on the finger inside the bar', () => {
    expect(lensBox(200, 100, 344, 6)).toEqual({ left: 150, width: 100 });
    expect(lensBox(10, 100, 344, 6)).toEqual({ left: 6, width: 100 });
    expect(lensBox(340, 100, 344, 6)).toEqual({ left: 238, width: 100 });
  });
});
