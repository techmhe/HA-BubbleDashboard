/**
 * After a long-press opens a sheet, a phone sends one more `click`, hit-tested where the
 * finger lifts: on the new sheet or its backdrop, which then closes it. The guard swallows
 * that one click in the capture phase. Armed when the hold fires, it stays armed while the
 * finger is down and disarms shortly after release if no click comes.
 */
export function clickGuard(target: EventTarget, graceMs = 400) {
  let armed = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const disarm = () => {
    armed = false;
    clearTimeout(timer);
  };
  target.addEventListener(
    'click',
    (e: Event) => {
      if (!armed) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      disarm();
    },
    true,
  );
  return {
    arm() {
      clearTimeout(timer);
      armed = true;
    },
    release() {
      if (!armed) return;
      clearTimeout(timer);
      timer = setTimeout(disarm, graceMs);
    },
  };
}
