"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { SteelmanDeck } from "./steelman-deck";
import { writingArea, writingCardFocus } from "./writing-surface";
import { cn } from "@/lib/utils";
import { readStored, writeStored } from "@/components/verification/kit/stored";

export interface ConstructedField {
  id: string;
  label: string;
  hint?: string;
  rows?: number;
}

interface Saved {
  values: Record<string, string>;
  submitted: boolean;
}

const EMPTY: Saved = { values: {}, submitted: false };

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
  storageKey: string;
  fields: readonly ConstructedField[];
  intro?: ReactNode;
  reveal: ReactNode;
  words?: { min: number; max: number };
  submitLabel?: string;
  onSubmit?: () => void;
  checks?: (values: Record<string, string>) => {
    id: string;
    severity: "ok" | "warn" | "bad";
    message: string;
  }[];
  steelman?: readonly string[];
}) {
  const [saved, setSaved] = useState<Saved>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let restored = EMPTY;
    try {
      const raw = readStored(storageKey);
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
        writeStored(storageKey, JSON.stringify(next));
      } catch {
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
              "panel",
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

      {checks && !saved.submitted && started ? (
        <section className="panel">
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
