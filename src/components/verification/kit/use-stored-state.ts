"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Restore-once from localStorage, then write through on every update — the
 * block every widget that remembers a learner's work was repeating by hand.
 *
 * Restore runs in an effect, never during render, so the server HTML and the
 * first client render agree; `hydrated` stays false until it lands, which is
 * what widgets gate their "submitted"/"done" chrome on. `onRestore` runs in
 * the same microtask, for widgets that seed extra state from what was saved
 * (a resume position, a derived draft).
 *
 * `persist` takes React's own setState signature, and the updater form is the
 * reason it does: a handler that builds the next value by spreading the
 * `saved` of its own render drops the first of two updates landing in one
 * tick. Ordinary clicking never does that — a re-render sits between the two
 * — but a fast keyboard pass or a doubled event does.
 */
export function useStoredState<T>(
  storageKey: string,
  empty: T,
  prune: (raw: unknown) => T,
  onRestore?: (restored: T) => void,
): [T, (next: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(empty);
  const [hydrated, setHydrated] = useState(false);

  // Captured at mount and never rewritten: restoring happens once, so an
  // inline prune or onRestore — a new function identity on every render —
  // must not re-run it and stamp over live work. The callbacks close over
  // setState functions, which React keeps stable.
  const atMount = useRef({ prune, onRestore, empty });

  useEffect(() => {
    const { prune: parse, onRestore: seed, empty: blank } = atMount.current;
    let restored = blank;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) restored = parse(JSON.parse(raw));
    } catch {
      /* unreadable storage just means starting fresh */
    }
    queueMicrotask(() => {
      setValue(restored);
      seed?.(restored);
      setHydrated(true);
    });
  }, [storageKey]);

  const persist = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          localStorage.setItem(storageKey, JSON.stringify(resolved));
        } catch {
          /* private mode / full quota — progress is a convenience, not the record */
        }
        return resolved;
      });
    },
    [storageKey],
  );

  return [value, persist, hydrated];
}
