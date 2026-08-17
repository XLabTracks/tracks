"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { SteelmanDeck } from "./steelman-deck";
import { writingArea, writingCardFocus } from "./writing-surface";
import { cn } from "@/lib/utils";

/**
 * The shared shell for 2.4's constructed answers: a set of named fields the
 * learner fills, one deliberate Submit that freezes them, and only then the
 * reveal.
 *
 * It exists because three of 2.4's four exercises are the same interaction
 * with different fields — construct a case, infer a system from its rules,
 * re-read one claim under four circumstances — and the module's whole problem
 * was four concepts wearing one mechanic. Sharing the CHROME is not that: what
 * has to differ between them is the operation and the fields, and those are
 * each exercise's own.
 *
 * Freezing is load-bearing. The reveal carries worked examples, and a page
 * that let you keep typing after seeing them would be showing you the answer
 * to a question you had not yet answered. Start over clears everything and is
 * the only way back, deliberately.
 *
 * Nothing here grades. No key, no keyword matching, no score — the specs are
 * explicit about that, because what is being tested is a causal construction
 * and a string match cannot see one.
 */

export interface ConstructedField {
  /** Storage key inside the deck's document. Permanent. */
  id: string;
  label: string;
  /** One line under the label saying what belongs in it. */
  hint?: string;
  rows?: number;
}

interface Saved {
  values: Record<string, string>;
  submitted: boolean;
}

const EMPTY: Saved = { values: {}, submitted: false };

/** Three severities, the same three the writing desk uses. */
const DOT: Record<"ok" | "warn" | "bad", string> = {
  ok: "mt-2 size-1.5 shrink-0 rounded-full bg-[var(--ok,theme(colors.emerald.600))]",
  warn: "mt-2 size-1.5 shrink-0 rounded-full bg-amber-500",
  bad: "mt-2 size-1.5 shrink-0 rounded-full bg-[var(--no,theme(colors.red.600))]",
};

export function countWords(text: string): number {
  return (text.trim().match(/[^\s]+/g) ?? []).length;
}

export function ConstructedResponse({
  storageKey,
  fields,
  intro,
  reveal,
  words,
  submitLabel = "Submit",
  onSubmit,
  checks,
  steelman,
}: {
  /** localStorage document for this exercise. Permanent — learner work. */
  storageKey: string;
  fields: readonly ConstructedField[];
  intro?: ReactNode;
  /** Shown only after Submit. */
  reveal: ReactNode;
  /** The spec's target length, counted across every field. */
  words?: { min: number; max: number };
  submitLabel?: string;
  /** Fired once, on the first submit — the section's finish event. */
  onSubmit?: () => void;
  /**
   * The desk rail: transparent rules run over the answer as it is written.
   * Given the current values, returns rows that each name what they looked
   * for. Nothing here judges the answer — see case-checks.ts.
   */
  checks?: (values: Record<string, string>) => {
    id: string;
    severity: "ok" | "warn" | "bad";
    message: string;
  }[];
  /** Shown beside the checks while writing — the writing desk's steelman. */
  steelman?: readonly string[];
}) {
  const [saved, setSaved] = useState<Saved>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let restored = EMPTY;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const box = JSON.parse(raw) as Partial<Saved>;
        const values: Record<string, string> = {};
        for (const field of fields) {
          const v = box.values?.[field.id];
          if (typeof v === "string") values[field.id] = v;
        }
        restored = { values, submitted: box.submitted === true };
      }
    } catch {
      /* unreadable storage just means starting fresh */
    }
    queueMicrotask(() => {
      setSaved(restored);
      setHydrated(true);
    });
  }, [storageKey, fields]);

  const persist = useCallback(
    (next: Saved) => {
      setSaved(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* private mode / full quota — a convenience, not the record */
      }
    },
    [storageKey]
  );

  if (!hydrated) return <div className="not-prose my-6 min-h-64" aria-busy />;

  const total = fields.reduce(
    (sum, f) => sum + countWords(saved.values[f.id] ?? ""),
    0
  );
  const started = fields.some((f) => (saved.values[f.id] ?? "").trim());
  const complete = fields.every((f) => (saved.values[f.id] ?? "").trim());

  return (
    <div className="not-prose my-6 space-y-4">
      {intro}

      <div className="space-y-3">
        {fields.map((field) => (
          <div
            key={field.id}
            className={cn(
              "border-border bg-card rounded-xl border p-4",
              writingCardFocus
            )}
          >
            <label
              className="block text-sm font-semibold"
              htmlFor={`${storageKey}-${field.id}`}
            >
              {field.label}
            </label>
            {field.hint ? (
              <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                {field.hint}
              </p>
            ) : null}
            <textarea
              id={`${storageKey}-${field.id}`}
              rows={field.rows ?? 3}
              readOnly={saved.submitted}
              value={saved.values[field.id] ?? ""}
              onChange={(e) =>
                persist({
                  ...saved,
                  values: { ...saved.values, [field.id]: e.target.value },
                })
              }
              className={cn(writingArea, saved.submitted && "opacity-70")}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          className="text-muted-foreground text-xs"
          aria-live="polite"
        >
          {words
            ? `${total} words · aim for ${words.min}–${words.max}`
            : `${total} words`}
        </p>
        {saved.submitted ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => persist({ values: {}, submitted: false })}
          >
            Start over
          </Button>
        ) : (
          <Button
            size="sm"
            disabled={!complete}
            onClick={() => {
              persist({ ...saved, values: saved.values, submitted: true });
              onSubmit?.();
            }}
          >
            {submitLabel}
          </Button>
        )}
      </div>

      {/* The desk rail, live while writing. It is lint, not marking: it can
          see that a failure point gives no reason, and it cannot see whether
          the case holds together — which is why every row says what it looked
          for, and why the five criteria are marked by hand after submitting. */}
      {checks && !saved.submitted && started ? (
        <section className="border-border rounded-xl border p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h4 className="text-muted-foreground eyebrow">
              Desk checks
            </h4>
            <p className="text-muted-foreground text-xs">Rules, not marking.</p>
          </div>
          <div className="mt-3 space-y-2">
            {checks(saved.values).map((row) => (
              <p key={row.id} className="flex gap-2.5 text-sm leading-relaxed">
                <span aria-hidden className={DOT[row.severity]} />
                <span>{row.message}</span>
              </p>
            ))}
          </div>
        </section>
      ) : null}

      {steelman && !saved.submitted && started ? (
        <SteelmanDeck deck={steelman} />
      ) : null}

      {saved.submitted ? reveal : null}
    </div>
  );
}
