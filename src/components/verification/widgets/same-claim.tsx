"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { countWords } from "../kit/constructed-response";
import {
  CLAIM_ACTIONS,
  CLAIM_COMPARISON,
  CLAIM_COMPARISON_MAX_WORDS,
  CLAIM_FIELDS,
  CLAIM_NOT_A_RANKING,
  CLAIM_PROMPT,
  CLAIM_REVEAL,
  CLAIM_TRANSFER,
  CLAIM_VARIANTS,
  FIXED_CLAIM,
} from "@/lib/verification/data/same-claim";
import { SAME_CLAIM_KEY } from "@/lib/verification/data/marking-keys";
import { CLAIM_DECK } from "@/lib/verification/data/steelman-decks";
import { SteelmanDeck } from "../kit/steelman-deck";
import { MarkingKeyPanel } from "../kit/marking-key";
import type { VerificationWidgetProps } from "../kit/types";

/**
 * 2.4.3 — Same Claim, Different Circumstances. It replaces "Build the
 * Inspection Order", which ran on the same decision-lab engine as 2.4.4: two
 * sections, one mechanic.
 *
 * All four variants stay on the page at once. That is the spec's constraint
 * and the reason the exercise works — the variation is controlled, and you
 * can only see what is being controlled for by reading C against A. Answers
 * stay editable until Submit, then freeze, then the reveal.
 *
 * The five actions are printed once above the four, not as options under each
 * one. An option list per variant would turn a comparison into four
 * independent multiple-choice questions, which is exactly what the spec
 * forbids, and the same action really can be right for two of them.
 *
 * Nothing is graded, and the exercise is optional: submitting records no
 * completion.
 */

type Answers = Record<string, string>;

interface Saved {
  answers: Answers;
  submitted: boolean;
  comparison: string;
  transfer: string;
}

const STORAGE_KEY = "v-same-claim:v1";
const EMPTY: Saved = {
  answers: {},
  submitted: false,
  comparison: "",
  transfer: "",
};
const KEYS = CLAIM_VARIANTS.flatMap((v) =>
  CLAIM_FIELDS.map((f) => `${v.id}.${f.id}`)
);

function prune(raw: unknown): Saved {
  const box = (
    typeof raw === "object" && raw !== null ? raw : {}
  ) as Partial<Saved>;
  const answers: Answers = {};
  for (const key of KEYS) {
    const v = box.answers?.[key];
    if (typeof v === "string") answers[key] = v;
  }
  return {
    answers,
    submitted: box.submitted === true,
    comparison: typeof box.comparison === "string" ? box.comparison : "",
    transfer: typeof box.transfer === "string" ? box.transfer : "",
  };
}

export function SameClaim({
  onComplete,
  initialCompleted,
}: VerificationWidgetProps) {
  const [saved, setSaved] = useState<Saved>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const fired = useRef(initialCompleted);

  useEffect(() => {
    let restored = EMPTY;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) restored = prune(JSON.parse(raw));
    } catch {
      /* unreadable storage just means starting fresh */
    }
    queueMicrotask(() => {
      setSaved(restored);
      setHydrated(true);
    });
  }, []);

  const persist = useCallback((next: Saved) => {
    setSaved(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* private mode / full quota */
    }
  }, []);

  if (!hydrated) return <div className="not-prose my-6 min-h-64" aria-busy />;

  const ready = KEYS.every((key) => (saved.answers[key] ?? "").trim());
  const comparisonWords = countWords(saved.comparison);

  return (
    <div className="not-prose my-6 space-y-4">
      <section className="border-primary/40 bg-primary/5 rounded-xl border p-4">
        <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
          The allegation, in all four cases
        </p>
        <p className="mt-2 leading-relaxed font-medium">
          &ldquo;{FIXED_CLAIM}&rdquo;
        </p>
      </section>

      <div className="space-y-2">
        <p className="text-sm leading-relaxed">{CLAIM_PROMPT}</p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {CLAIM_NOT_A_RANKING}
        </p>
        {/* Once, above all four — never as options under each. */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          Actions available to the body:{" "}
          {CLAIM_ACTIONS.map((action, i) => (
            <span key={action}>
              {i > 0 ? "; " : ""}
              <span className="text-foreground">{action}</span>
            </span>
          ))}
          .
        </p>
      </div>

      <div className="space-y-3">
        {CLAIM_VARIANTS.map((variant) => (
          <section
            key={variant.id}
            className="border-border bg-card rounded-xl border p-4"
          >
            <p className="text-sm font-semibold">
              {variant.letter} · {variant.label}
            </p>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              {variant.body}
            </p>
            <div className="mt-3 space-y-2">
              {CLAIM_FIELDS.map((field) => {
                const key = `${variant.id}.${field.id}`;
                return (
                  <div key={field.id}>
                    <label
                      className="text-muted-foreground font-mono text-[11px] tracking-[0.12em] uppercase"
                      htmlFor={key}
                    >
                      {field.label}
                    </label>
                    <textarea
                      id={key}
                      rows={2}
                      readOnly={saved.submitted}
                      value={saved.answers[key] ?? ""}
                      onChange={(e) =>
                        persist({
                          ...saved,
                          answers: { ...saved.answers, [key]: e.target.value },
                        })
                      }
                      className={cn(
                        "border-border bg-background mt-1 w-full rounded-md border p-2.5 text-sm",
                        saved.submitted && "opacity-70"
                      )}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {saved.submitted ? null : <SteelmanDeck deck={CLAIM_DECK} />}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs">
          {saved.submitted
            ? "Submitted. The four answers are frozen."
            : "Four cases, three lines each."}
        </p>
        {saved.submitted ? (
          <Button size="sm" variant="outline" onClick={() => persist(EMPTY)}>
            Start over
          </Button>
        ) : (
          <Button
            size="sm"
            disabled={!ready}
            onClick={() => {
              persist({ ...saved, submitted: true });
              if (!fired.current) {
                fired.current = true;
                onComplete();
              }
            }}
          >
            Submit
          </Button>
        )}
      </div>

      {saved.submitted ? (
        <div className="space-y-4">
          <section className="border-border rounded-xl border p-4">
            <h4 className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
              Four things that were moving separately
            </h4>
            <dl className="mt-3 space-y-3">
              {CLAIM_REVEAL.map((row) => (
                <div key={row.term}>
                  <dt className="text-sm font-semibold">{row.term}</dt>
                  <dd className="text-muted-foreground text-sm leading-relaxed">
                    {row.body}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <MarkingKeyPanel
            storageKey="v-same-claim-key:v1"
            keyData={SAME_CLAIM_KEY}
          />

          <section className="border-border rounded-xl border p-4">
            <p className="text-sm font-medium">{CLAIM_COMPARISON}</p>
            <textarea
              rows={3}
              value={saved.comparison}
              onChange={(e) =>
                persist({ ...saved, comparison: e.target.value })
              }
              aria-label={CLAIM_COMPARISON}
              className="border-border bg-background mt-2 w-full rounded-md border p-3 text-sm"
            />
            <p
              className={cn(
                "mt-1 text-right font-mono text-xs",
                comparisonWords > CLAIM_COMPARISON_MAX_WORDS
                  ? "text-defect"
                  : "text-muted-foreground"
              )}
              aria-live="polite"
            >
              {comparisonWords} / {CLAIM_COMPARISON_MAX_WORDS} words
            </p>
          </section>

          <section className="border-border rounded-xl border p-4">
            <p className="text-sm font-medium">{CLAIM_TRANSFER}</p>
            <textarea
              rows={3}
              value={saved.transfer}
              onChange={(e) => persist({ ...saved, transfer: e.target.value })}
              aria-label={CLAIM_TRANSFER}
              className="border-border bg-background mt-2 w-full rounded-md border p-3 text-sm"
            />
            <p className="text-muted-foreground mt-1 text-xs">Optional.</p>
          </section>
        </div>
      ) : null}
    </div>
  );
}
