"use client";

import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import {
  keyTotal,
  type MarkingKey as Key,
} from "@/lib/verification/data/marking-keys";

/**
 * The marking key, and the learner marking their own work against it.
 *
 * Every constructed exercise in 2.4 ends here. None of them is graded by the
 * page — the specs rule that out and it is the right call, because a string
 * match cannot see whether a case holds together — so the marking is the
 * learner's, and the key's job is to make it specific rather than a feeling
 * about how it went.
 *
 * The form is the same in all four and the reasons are in
 * data/marking-keys.ts: credit per element, a bare correct label worth
 * nothing where a mechanism was asked for, wording free, and what earns
 * nothing said out loud rather than left to be inferred.
 *
 * The score is not progress and never leaves the browser. It is not sent
 * anywhere, does not complete anything, and is stored beside the answer it
 * belongs to so that reopening the page shows the marking you did, not a
 * blank slate that implies you never marked.
 */
export function MarkingKeyPanel({
  storageKey,
  keyData,
}: {
  /** Its own localStorage document, permanent. */
  storageKey: string;
  keyData: Key;
}) {
  const [ticked, setTicked] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const total = keyTotal(keyData);

  useEffect(() => {
    let restored: number[] = [];
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed: unknown = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed)) {
        restored = parsed.filter(
          (n): n is number =>
            typeof n === "number" && n >= 0 && n < keyData.criteria.length
        );
      }
    } catch {
      /* unreadable storage just means starting fresh */
    }
    queueMicrotask(() => {
      setTicked(restored);
      setHydrated(true);
    });
  }, [storageKey, keyData.criteria.length]);

  const persist = useCallback(
    (next: number[]) => {
      setTicked(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* private mode / full quota */
      }
    },
    [storageKey]
  );

  const scored = hydrated
    ? ticked.reduce((sum, i) => sum + (keyData.criteria[i]?.points ?? 0), 0)
    : 0;

  return (
    <section className="border-border rounded-xl border p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
          Marking key
        </h4>
        <p
          className="text-muted-foreground font-mono text-xs"
          aria-live="polite"
        >
          {hydrated ? scored : 0} / {total}
        </p>
      </div>

      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        Mark your own answer. Any wording that does not distort the meaning
        counts — no criterion needs a particular term. Where a criterion asks
        for a mechanism, a correct label without it earns nothing.
      </p>

      <ul className="mt-3 space-y-2">
        {keyData.criteria.map((criterion, i) => {
          const on = ticked.includes(i);
          return (
            <li key={criterion.text}>
              <button
                type="button"
                aria-pressed={on}
                disabled={!hydrated}
                onClick={() =>
                  persist(on ? ticked.filter((n) => n !== i) : [...ticked, i])
                }
                className={cn(
                  "border-border flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                  on ? "border-primary bg-primary/5" : "hover:bg-muted"
                )}
              >
                <span
                  className={cn(
                    "border-border mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border font-mono text-[11px]",
                    on && "border-primary bg-primary text-primary-foreground"
                  )}
                  aria-hidden
                >
                  {criterion.points}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm leading-relaxed">
                    {criterion.text}
                  </span>
                  {criterion.needsReasoning ? (
                    <span className="text-muted-foreground mt-0.5 block text-xs leading-relaxed">
                      The judgement alone is not the point — the reasoning has
                      to be on the page.
                    </span>
                  ) : null}
                  {criterion.grounds ? (
                    <span className="text-muted-foreground mt-0.5 block text-xs leading-relaxed">
                      {criterion.grounds}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-3">
        <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
          No credit
        </p>
        <ul className="mt-1.5 space-y-1">
          {keyData.noCredit.map((line) => (
            <li
              key={line}
              className="text-muted-foreground flex gap-3 text-sm leading-relaxed"
            >
              <span aria-hidden>—</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
        This score is yours. It is not sent anywhere, counts towards nothing,
        and completes nothing.
      </p>
    </section>
  );
}
