"use client";

import { useCallback, useSyncExternalStore } from "react";

/* Where an inline check's pick and a gap-fill's placements are kept.
 *
 * This is learner work, not progress: it feeds no meter, unlocks nothing and
 * completes no unit, which is why it stays in the browser instead of going to
 * the account the way `LessonProgress` does.
 *
 * Read through useSyncExternalStore rather than an effect, because the value
 * only exists on the client: the server snapshot is the fallback, so the first
 * paint matches the server and the stored value arrives in the same commit as
 * hydration — no flash of an unanswered question, and no setState in an effect.
 *
 * Trap: getSnapshot must return a stable reference or React re-renders forever,
 * so parsed values are cached per id and the cache is dropped only on write.
 *
 * Trap: a mark is keyed by the `id` the author gives the component, never by
 * its position on the page. Renaming an id discards that learner's work on it,
 * so treat an id as permanent — the same rule as a unit id.
 */

const KEY = "vt-marks.v1";

const listeners = new Set<() => void>();
let cache: Record<string, unknown> | null = null;

function all(): Record<string, unknown> {
  if (cache) return cache;
  if (typeof window === "undefined") return (cache = {});
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) || "null");
    cache = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  } catch {
    cache = {};
  }
  return cache;
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function writeMark(id: string, value: unknown): void {
  const next = { ...all() };
  if (value === undefined) delete next[id];
  else next[id] = value;
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode: the mark is lost on reload, and nothing depends on it */
  }
  for (const fn of listeners) fn();
}

/** The stored mark for `id`, or `fallback` while there is none (and always on
 *  the server). */
export function useMark<T>(id: string, fallback: T): T {
  const snapshot = useCallback(() => {
    const v = all()[id];
    return v === undefined ? fallback : (v as T);
  }, [id, fallback]);
  const server = useCallback(() => fallback, [fallback]);
  return useSyncExternalStore(subscribe, snapshot, server);
}
