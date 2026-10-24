import { afterEach, describe, expect, it, vi } from 'vitest';
import { clickGuard } from '../src/logic/click-guard';

// The click a phone sends after a long-press is hit-tested where the finger lifts,
// i.e. on the sheet the long-press just opened. It must not reach that sheet.
describe('click guard after a long-press', () => {
  afterEach(() => vi.useRealTimers());

  const setup = () => {
    vi.useFakeTimers();
    const root = new EventTarget();
    const guard = clickGuard(root); // on window (capture) in the browser, so it runs first
    const backdrop = vi.fn();
    root.addEventListener('click', backdrop);
    return { root, backdrop, guard };
  };
  const click = (t: EventTarget) => t.dispatchEvent(new Event('click', { cancelable: true }));

  it('swallows exactly the one click that follows the release', () => {
    const { root, backdrop, guard } = setup();
    guard.arm();
    guard.release();
    click(root);
    expect(backdrop).not.toHaveBeenCalled();
    click(root);
    expect(backdrop).toHaveBeenCalledTimes(1);
  });

  it('stays armed while the finger is still down, however long', () => {
    const { root, backdrop, guard } = setup();
    guard.arm();
    vi.advanceTimersByTime(5000);
    guard.release();
    click(root);
    expect(backdrop).not.toHaveBeenCalled();
  });

  it('disarms shortly after release when no click comes', () => {
    const { root, backdrop, guard } = setup();
    guard.arm();
    guard.release();
    vi.advanceTimersByTime(600);
    click(root);
    expect(backdrop).toHaveBeenCalledTimes(1);
  });
});
