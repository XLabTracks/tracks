"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { countWords } from "../kit/constructed-response";
import {
  CONSEQUENCE_ROWS,
  INFER_INSTRUCTION,
  INFER_PROMPT,
  INFER_REVEAL,
  INFER_SECOND_STEP,
  POLICY_RULES,
  RULE_ANNOTATIONS,
  SECOND_STEP_MAX_WORDS,
} from "@/lib/verification/data/infer-the-system";
import type { VerificationWidgetProps } from "../kit/types";
import { writingArea, writingCardFocus } from "../kit/writing-surface";

/**
 * UNMOUNTED. 2.4.2's exercise is Policy on Paper (policy-critique.tsx); this
 * one was built against an earlier draft of the spec and is kept, as the other
 * stood-down widgets are, because its data and its shape may be wanted again.
 *
 * 2.4.2 — Read the Rules, Infer the System. It replaces the reporting lab,
 * whose operation was picking a supported statement per link; this one asks
 * what the rules do to the person inside them, which no list of options can
 * ask.
 *
 * Three rows, and a row is only a row when it cites rules AND says what
 * follows: the citation is what makes it an inference rather than an opinion
 * about the policy. Rules are cited by pressing their numbers, so a
 * consequence can name a combination — most of the interesting ones here do,
 * and a single-select would have hidden exactly that.
 *
 * The policy is shown with nothing said about it, and no rule is marked. Both
 * are the spec's constraints: a page that flagged rule 3 would have done the
 * exercise. The institutional vocabulary lives in the reveal and nowhere
 * else, which is also why the annotations cannot be reached before Submit.
 *
 * Nothing is graded — the spec's grading rule is to grade the causal
 * inference and not the vocabulary, and that is not something this can do, so
 * it does not pretend to. Submitting is the section's finish event.
 */

interface Row {
  rules: number[];
  text: string;
}

interface Saved {
  rows: Row[];
  submitted: boolean;
  change: string;
}

const STORAGE_KEY = "v-infer-the-system:v1";
const EMPTY: Saved = {
  rows: Array.from({ length: CONSEQUENCE_ROWS }, () => ({
    rules: [],
    text: "",
  })),
  submitted: false,
  change: "",
};

function prune(raw: unknown): Saved {
  const box = (
    typeof raw === "object" && raw !== null ? raw : {}
  ) as Partial<Saved>;
  const rows = EMPTY.rows.map((blank, i) => {
    const row = Array.isArray(box.rows) ? box.rows[i] : undefined;
    if (!row || typeof row !== "object") return blank;
    const rules = Array.isArray(row.rules)
      ? row.rules.filter(
          (n): n is number =>
            typeof n === "number" && n >= 1 && n <= POLICY_RULES.length
        )
      : [];
    return { rules, text: typeof row.text === "string" ? row.text : "" };
  });
  return {
    rows,
    submitted: box.submitted === true,
    change: typeof box.change === "string" ? box.change : "",
  };
}

export function InferTheSystem({
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

  function setRow(index: number, patch: Partial<Row>) {
    const rows = saved.rows.map((row, i) =>
      i === index ? { ...row, ...patch } : row
    );
    persist({ ...saved, rows });
  }

  function toggleRule(index: number, rule: number) {
    const row = saved.rows[index]!;
    const rules = row.rules.includes(rule)
      ? row.rules.filter((n) => n !== rule)
      : [...row.rules, rule].sort((a, b) => a - b);
    setRow(index, { rules });
  }

  const ready = saved.rows.every((row) => row.rules.length && row.text.trim());
  const changeWords = countWords(saved.change);

  return (
    <div className="not-prose my-6 space-y-4">
      {/* The policy, said plainly and not characterised. Numbers are here to
          be cited with, which is the only reason they are numbers. */}
      <section className="border-border bg-card rounded-xl border p-4">
        <h4 className="text-sm font-semibold">Internal Reporting Policy</h4>
        <ol className="mt-3 space-y-2">
          {POLICY_RULES.map((rule, i) => (
            <li key={rule} className="flex gap-3 text-sm leading-relaxed">
              <span className="border-border text-muted-foreground flex size-5 shrink-0 items-center justify-center rounded-full border text-3xs">
                {i + 1}
              </span>
              <span>{rule}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="space-y-1">
        <p className="text-sm leading-relaxed">{INFER_PROMPT}</p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {INFER_INSTRUCTION}
        </p>
      </div>

      <ol className="space-y-3">
        {saved.rows.map((row, index) => (
          <li
            key={index}
            className={cn(
              "border-border bg-card rounded-xl border p-4",
              writingCardFocus
            )}
          >
            <p className="text-muted-foreground eyebrow">
              Consequence {index + 1}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground text-xs">Rules:</span>
              {POLICY_RULES.map((_, n) => {
                const rule = n + 1;
                const on = row.rules.includes(rule);
                return (
                  <button
                    key={rule}
                    type="button"
                    aria-pressed={on}
                    aria-label={`Rule ${rule}`}
                    disabled={saved.submitted}
                    onClick={() => toggleRule(index, rule)}
                    className={cn(
                      "border-border size-7 rounded-full border text-xs transition-colors",
                      on
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                      saved.submitted && "opacity-70"
                    )}
                  >
                    {rule}
                  </button>
                );
              })}
            </div>

            <textarea
              rows={3}
              readOnly={saved.submitted}
              value={row.text}
              onChange={(e) => setRow(index, { text: e.target.value })}
              placeholder="What follows for an employee who has noticed something?"
              aria-label={`Consequence ${index + 1}`}
              className={cn(writingArea, saved.submitted && "opacity-70")}
            />
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs">
          {saved.submitted
            ? "Submitted."
            : "Each row needs at least one rule and a consequence."}
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
            {INFER_REVEAL.map((line, i) => (
              <p
                key={line}
                className={cn("text-sm leading-relaxed", i > 0 && "mt-2")}
              >
                {line}
              </p>
            ))}
          </section>

          {/* The annotated policy: several mechanisms these rules can be read
              to produce, against the rule or pair that produces each. Not a
              key — the exercise has none — and not a complete list. */}
          <section className="space-y-2">
            <h4 className="text-muted-foreground eyebrow">
              The same policy, annotated
            </h4>
            {POLICY_RULES.map((rule, i) => (
              <div
                key={rule}
                className="border-border bg-card rounded-xl border p-4"
              >
                <p className="flex gap-3 text-sm leading-relaxed">
                  <span className="border-border text-muted-foreground flex size-5 shrink-0 items-center justify-center rounded-full border text-3xs">
                    {i + 1}
                  </span>
                  <span>{rule}</span>
                </p>
                <p className="text-muted-foreground mt-2 pl-8 text-sm leading-relaxed">
                  {RULE_ANNOTATIONS[i]}
                </p>
              </div>
            ))}
          </section>

          <section
            className={cn(
              "border-border rounded-xl border p-4",
              writingCardFocus
            )}
          >
            <p className="text-sm font-medium">{INFER_SECOND_STEP}</p>
            <textarea
              rows={3}
              value={saved.change}
              onChange={(e) => persist({ ...saved, change: e.target.value })}
              aria-label={INFER_SECOND_STEP}
              className={writingArea}
            />
            <p
              className={cn(
                "mt-1 text-right text-xs",
                changeWords > SECOND_STEP_MAX_WORDS
                  ? "text-defect"
                  : "text-muted-foreground"
              )}
              aria-live="polite"
            >
              {changeWords} / {SECOND_STEP_MAX_WORDS} words
            </p>
          </section>
        </div>
      ) : null}
    </div>
  );
}
