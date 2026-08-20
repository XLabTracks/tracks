// Tiny rAF tween used for the bench's animated relayouts and viewport fits.
// One eased scalar t drives whatever the caller interpolates; respects
// prefers-reduced-motion by jumping straight to the end state.

export interface AnimationHandle {
  cancel(): void;
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/**
 * Drive `onFrame` with an eased progress value, always ending exactly at 1.
 * Returns a handle whose cancel() stops any pending frames.
 *
 * rAF starves in hidden/background pages, so a timeout backstop forces the
 * final frame regardless — the end state must always land (positions are
 * persisted; a tween frozen mid-flight would save wrong coordinates).
 */
export function animate(
  onFrame: (t: number) => void,
  duration = 200,
): AnimationHandle {
  if (duration <= 0 || prefersReducedMotion()) {
    onFrame(1);
    return { cancel() {} };
  }
  const start = performance.now();
  let raf = 0;
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    cancelAnimationFrame(raf);
    onFrame(1);
  };
  const backstop = setTimeout(finish, duration + 100);
  const step = (now: number) => {
    if (done) return;
    const t = Math.min(1, (now - start) / duration);
    if (t >= 1) {
      clearTimeout(backstop);
      finish();
      return;
    }
    onFrame(easeOutCubic(t));
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  return {
    cancel: () => {
      done = true;
      clearTimeout(backstop);
      cancelAnimationFrame(raf);
    },
  };
}
