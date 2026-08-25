"use client";

import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import {
  keyTotal,
  type MarkingKey as Key,
} from "@/lib/verification/data/marking-keys";

export function MarkingKeyPanel({
  storageKey,
  keyData,
}: {
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
      }
    },
    [storageKey]
  );

  const scored = hydrated
    ? ticked.reduce((sum, i) => sum + (keyData.criteria[i]?.points ?? 0), 0)
    : 0;

  return (
    <section className="panel">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-muted-foreground eyebrow">
          Marking key
        </p>
        <p
          className="text-muted-foreground text-xs"
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
                    "border-border mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border text-3xs",
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
        <p className="text-muted-foreground eyebrow">
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
