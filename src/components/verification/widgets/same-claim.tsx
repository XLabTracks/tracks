"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { countWords } from "../kit/constructed-response";
import {
  CLAIM_COMPARISON,
  CLAIM_COMPARISON_MAX_WORDS,
  CLAIM_INTRO,
  CLAIM_JUSTIFY,
  CLAIM_SELF_CHECK,
  CLAIM_SELF_CHECK_LEAD,
  CLAIM_TASKS,
  CLAIM_TASK_LEAD,
  CLAIM_TRANSFER,
  CLAIM_VARIANTS,
  FIXED_CLAIM,
} from "@/lib/verification/data/same-claim";
import { SAME_CLAIM_KEY } from "@/lib/verification/data/marking-keys";
import { CLAIM_DECK } from "@/lib/verification/data/steelman-decks";
import { SteelmanDeck } from "../kit/steelman-deck";
import { MarkingKeyPanel } from "../kit/marking-key";
import type { VerificationWidgetProps } from "../kit/types";
import { writingArea, writingCardFocus } from "../kit/writing-surface";

/**
 * 2.4.3 — Four Sources, to the owner's revised spec (2026-08-15; see the
 * data file's header for what the revision added and removed).
 *
 * The shape her brackets dictate, in order: allegation once, above all four
 * and kept visible while the student works (sticky); one free-response box
 * per case, never split into fields; all four on the page at once; Submit
 * enabled only when all four carry an answer; on Submit the four freeze and
 * the reveal opens — the self-check pair, then the case-specific marking
 * guidance, then the 50-word final question, then the optional transfer.
 * No per-case correctness feedback anywhere.
 *
 * Nothing is graded, and the exercise is optional: submitting records no
 * completion. The steelman deck rides pre-submission, as before — the spec
 * revision did not touch it, and reading its removal into the spec's
 * silence was wrong (owner: "вернуть").
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

/** The pre-revision widget stored three fields per case under
 *  `<case>.<field>` keys; a draft in that shape folds into the case's one
 *  analysis box instead of vanishing. */
const LEGACY_FIELDS = ["response", "changed", "unestablished"];

function prune(raw: unknown): Saved {
  const box = (
    typeof raw === "object" && raw !== null ? raw : {}
  ) as Partial<Saved>;
  const answers: Answers = {};
  for (const variant of CLAIM_VARIANTS) {
    const v = box.answers?.[variant.id];
    if (typeof v === "string" && v.trim()) {
      answers[variant.id] = v;
      continue;
    }
    const legacy = LEGACY_FIELDS.map((f) => box.answers?.[`${variant.id}.${f}`])
      .filter((s): s is string => typeof s === "string" && s.trim() !== "")
      .join("\n");
    if (legacy) answers[variant.id] = legacy;
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

  const ready = CLAIM_VARIANTS.every((v) => (saved.answers[v.id] ?? "").trim());
  const comparisonWords = countWords(saved.comparison);

  return (
    <div className="not-prose my-6 space-y-4">
      {/* Once, above all four, and it stays on screen while the cases are
          worked — her spec. The wrapper is opaque so the sticky card never
          shows the cases scrolling underneath its tint. */}
      <div className="bg-background sticky top-0 z-10 rounded-xl">
        <section className="border-primary/40 bg-primary/5 rounded-xl border p-4">
          <p className="text-muted-foreground text-[11px] tracking-[0.14em] uppercase">
            The allegation, in all four cases
          </p>
          <p className="mt-2 leading-relaxed font-medium">
            &ldquo;{FIXED_CLAIM}&rdquo;
          </p>
        </section>
      </div>

      {/* Olympiad-style registers, same as construct-case: setup at full
          weight, the numbered demands indented under their lead, the tail
          instruction muted — a statement, not a wall. */}
      <div className="space-y-3">
        <p className="text-base leading-relaxed font-medium">{CLAIM_INTRO}</p>
        <div className="space-y-2">
          <p className="text-sm leading-relaxed">{CLAIM_TASK_LEAD}</p>
          <ol className="marker:text-primary marker:font-medium list-decimal space-y-1 pl-6 text-sm leading-relaxed">
            {CLAIM_TASKS.map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ol>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {CLAIM_JUSTIFY}
        </p>
      </div>

      <div className="space-y-3">
        {CLAIM_VARIANTS.map((variant) => (
          <section
            key={variant.id}
            className={cn(
              "border-border bg-card rounded-xl border p-4",
              writingCardFocus
            )}
          >
            <p className="text-sm font-semibold">
              {variant.letter} · {variant.label}
            </p>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              {variant.body}
            </p>
            <div className="mt-3">
              <label
                className="text-muted-foreground text-[11px] tracking-[0.12em] uppercase"
                htmlFor={`claim-${variant.id}`}
              >
                Your analysis
              </label>
              <textarea
                id={`claim-${variant.id}`}
                rows={4}
                readOnly={saved.submitted}
                value={saved.answers[variant.id] ?? ""}
                onChange={(e) =>
                  persist({
                    ...saved,
                    answers: { ...saved.answers, [variant.id]: e.target.value },
                  })
                }
                className={cn(writingArea, saved.submitted && "opacity-70")}
              />
            </div>
          </section>
        ))}
      </div>

      {saved.submitted ? null : <SteelmanDeck deck={CLAIM_DECK} />}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs">
          {saved.submitted
            ? "Submitted. The four answers are frozen."
            : "Submit opens once all four cases carry an analysis."}
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
            <h4 className="text-muted-foreground text-[11px] tracking-[0.14em] uppercase">
              After submission
            </h4>
            <p className="mt-2 text-sm leading-relaxed">
              {CLAIM_SELF_CHECK_LEAD}
            </p>
            <ul className="mt-2 space-y-2">
              {CLAIM_SELF_CHECK.map((line) => (
                <li key={line} className="flex gap-3 text-sm leading-relaxed">
                  <span aria-hidden className="text-muted-foreground">
                    —
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>

          <MarkingKeyPanel
            storageKey="v-same-claim-key:v1"
            keyData={SAME_CLAIM_KEY}
          />

          <section
            className={cn(
              "border-border rounded-xl border p-4",
              writingCardFocus
            )}
          >
            <p className="text-sm font-medium">{CLAIM_COMPARISON}</p>
            <textarea
              rows={3}
              value={saved.comparison}
              onChange={(e) =>
                persist({ ...saved, comparison: e.target.value })
              }
              aria-label={CLAIM_COMPARISON}
              className={writingArea}
            />
            <p
              className={cn(
                "mt-1 text-right text-xs",
                comparisonWords > CLAIM_COMPARISON_MAX_WORDS
                  ? "text-defect"
                  : "text-muted-foreground"
              )}
              aria-live="polite"
            >
              {comparisonWords} / {CLAIM_COMPARISON_MAX_WORDS} words
            </p>
          </section>

          <section
            className={cn(
              "border-border rounded-xl border p-4",
              writingCardFocus
            )}
          >
            <p className="text-sm font-medium">{CLAIM_TRANSFER}</p>
            <textarea
              rows={3}
              value={saved.transfer}
              onChange={(e) => persist({ ...saved, transfer: e.target.value })}
              aria-label={CLAIM_TRANSFER}
              className={writingArea}
            />
            <p className="text-muted-foreground mt-1 text-xs">Optional.</p>
          </section>
        </div>
      ) : null}
    </div>
  );
}
