"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { shuffleAnswerOptions } from "@/lib/shuffle";
import { cn } from "@/lib/utils";
import { QUICK_QUESTIONS } from "@/lib/verification/data/policy-quick-check";
import type { VerificationWidgetProps } from "../kit/types";

/** Display letters, which is now all a letter is. */
const SLOT = "ABCDE";

/**
 * 2.4.2 — On Paper. Five single-answer questions, answered in one pass.
 *
 * All five are on the page at once and one Submit marks them all. That is the
 * commit-before-reveal rule and it also makes the deck fast: no waiting for a
 * verdict between questions, and no chance to learn the pattern from question
 * one and coast.
 *
 * Nothing is labelled before submission — not the source, not what the
 * question is testing. Recognising which of three texts a question comes from
 * is half of answering it.
 *
 * On submission each question shows whether it was right, why, and the passage
 * the answer rests on, and the deck shows the total. The score records nothing
 * and completes nothing: the exercise is optional and unbridged like the rest
 * of the section's labs.
 *
 * The options are shuffled, seeded on each question's own id, so the order is
 * stable for everybody and across visits (src/lib/shuffle.ts says why) and the
 * pick is stored by choice id — nothing about the shuffle reaches storage. The
 * badge therefore shows the letter of the SLOT and not the choice's id, which
 * happens to be a..d and would print as a list labelled B, D, A, C. And no
 * explanation may name an option by its letter, because a letter is a
 * position; answer-order.test.ts fails on one that does.
 */


interface Saved {
  picks: Record<string, string>;
  submitted: boolean;
}

// v2: the deck was replaced wholesale, so the old picks mean nothing.
const STORAGE_KEY = "v-policy-quick-check:v2";
const EMPTY: Saved = { picks: {}, submitted: false };

function prune(raw: unknown): Saved {
  const box = (
    typeof raw === "object" && raw !== null ? raw : {}
  ) as Partial<Saved>;
  const picks: Record<string, string> = {};
  for (const question of QUICK_QUESTIONS) {
    const pick = box.picks?.[question.id];
    if (
      typeof pick === "string" &&
      question.choices.some((c) => c.id === pick)
    ) {
      picks[question.id] = pick;
    }
  }
  return { picks, submitted: box.submitted === true };
}

// The host's props are taken and not used. The spec is explicit that the score
// records nothing toward completion, and today it cannot: the registry has this
// id unbridged and useVerificationCompletion hands an unbridged widget a no-op.
// Calling it anyway would leave a trap for whoever flips that flag — an optional
// exercise that quietly starts reporting a section finished. Same shape as
// whistleblower-levers next door.
export function PolicyQuickCheck({}: VerificationWidgetProps) {
  const [saved, setSaved] = useState<Saved>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  // Seeded on the question id, so this is the same list on the server, on the
  // client, and on the learner's next visit. useMemo is for the work, not for
  // the stability — the seed already guarantees that.
  const shown = useMemo(
    () =>
      QUICK_QUESTIONS.map((question) => ({
        question,
        choices: shuffleAnswerOptions(
          question.id,
          question.choices,
          (c) => c.text,
        ).map((s) => s.item),
      })),
    [],
  );

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

  /**
   * Takes an updater, not a value.
   *
   * It used to take the next state, built by spreading the `saved` of the
   * render the handler was created in. Two picks landing in one tick therefore
   * both read the same snapshot and the second dropped the first — which
   * ordinary clicking never does, because a re-render sits between them, but a
   * fast keyboard pass or a double event does.
   */
  const persist = useCallback((update: (prev: Saved) => Saved) => {
    setSaved((prev) => {
      const next = update(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* private mode / full quota */
      }
      return next;
    });
  }, []);

  if (!hydrated) return <div className="not-prose my-6 min-h-64" aria-busy />;

  const answered = QUICK_QUESTIONS.filter((q) => saved.picks[q.id]).length;
  const right = QUICK_QUESTIONS.filter(
    (q) => saved.picks[q.id] === q.answerId
  ).length;

  return (
    <div className="not-prose my-6 space-y-4">
      <ol className="space-y-3">
        {shown.map(({ question, choices }, index) => {
          const pick = saved.picks[question.id];
          const correct = pick === question.answerId;
          return (
            <li
              key={question.id}
              className="border-border bg-card rounded-xl border p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="text-muted-foreground font-mono text-[11px] tracking-[0.12em] uppercase">
                  {index + 1} of {QUICK_QUESTIONS.length}
                </p>
                {saved.submitted ? (
                  <p
                    className={cn(
                      "flex items-center gap-1.5 font-mono text-[11px] tracking-wide",
                      correct ? "text-comply" : "text-defect"
                    )}
                  >
                    {correct ? (
                      <CircleCheck className="size-3.5 shrink-0" aria-hidden />
                    ) : (
                      <CircleAlert className="size-3.5 shrink-0" aria-hidden />
                    )}
                    {correct ? "Correct" : "Not quite"}
                  </p>
                ) : null}
              </div>

              <div className="border-border mt-2 space-y-2 border-l-2 pl-3 text-sm leading-relaxed">
                <p>{question.fragment}</p>
                {question.facts ? (
                  <ul className="list-disc space-y-1 pl-5">
                    {question.facts.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                ) : null}
                {question.fragmentAfter ? <p>{question.fragmentAfter}</p> : null}
              </div>
              <p className="mt-3 text-sm font-medium">{question.stem}</p>

              <div
                className="mt-3 grid gap-1.5"
                role="radiogroup"
                aria-label={question.stem}
              >
                {choices.map((choice, slot) => {
                  const chosen = pick === choice.id;
                  const isAnswer = choice.id === question.answerId;
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      role="radio"
                      aria-checked={chosen}
                      disabled={saved.submitted}
                      onClick={() =>
                        persist((prev) => ({
                          ...prev,
                          picks: { ...prev.picks, [question.id]: choice.id },
                        }))
                      }
                      className={cn(
                        "border-border flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left text-sm leading-relaxed transition-colors",
                        !saved.submitted && "hover:bg-muted",
                        chosen &&
                          !saved.submitted &&
                          "border-primary bg-primary/5",
                        saved.submitted &&
                          isAnswer &&
                          "border-comply bg-comply/5",
                        saved.submitted &&
                          chosen &&
                          !isAnswer &&
                          "border-defect bg-defect/5",
                        saved.submitted && !isAnswer && !chosen && "opacity-55"
                      )}
                    >
                      <span className="border-border mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] uppercase">
                        {SLOT[slot]}
                      </span>
                      <span>{choice.text}</span>
                    </button>
                  );
                })}
              </div>

              {saved.submitted ? (
                <div className="mt-3 space-y-1.5">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {question.explanation}
                  </p>
                  {/* Where to go back to, which is more use after the fact
                      than a label naming what the question was testing. */}
                  <p className="text-muted-foreground text-xs">
                    <span className="font-medium">Source: </span>
                    {question.source}
                  </p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs" aria-live="polite">
          {saved.submitted
            ? `${right} of ${QUICK_QUESTIONS.length}.`
            : `${answered} of ${QUICK_QUESTIONS.length} answered.`}
        </p>
        {saved.submitted ? (
          <Button size="sm" variant="outline" onClick={() => persist(() => EMPTY)}>
            Start over
          </Button>
        ) : (
          <Button
            size="sm"
            disabled={answered < QUICK_QUESTIONS.length}
            onClick={() => persist((prev) => ({ ...prev, submitted: true }))}
          >
            Check all five
          </Button>
        )}
      </div>
    </div>
  );
}
