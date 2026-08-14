"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { shuffleAnswerOptions } from "@/lib/shuffle";
import { cn } from "@/lib/utils";
import { QUICK_QUESTIONS } from "@/lib/verification/data/policy-quick-check";
import type { VerificationWidgetProps } from "../kit/types";

/** Display letters, which is now all a letter is. */
const SLOT = "ABCDE";

/**
 * 2.4.2 — On Paper. Five short discriminations, answered in one pass.
 *
 * All five are on the page at once and one Submit marks them all. That is the
 * commit-before-reveal rule and it also makes the deck fast: five to seven
 * minutes, no waiting for a verdict between questions, no chance to learn the
 * pattern from question one and coast.
 *
 * Every question shows what it was testing only after submission, because the
 * distinction is what the question is asking you to find.
 *
 * The score is shown because these have right answers — unlike everything else
 * in 2.4 — but it records nothing and completes nothing: the exercise is
 * optional and unbridged like the rest of the section's labs.
 *
 * The options are shuffled. Authored, four of the five answers were B, which
 * is a pattern a learner can read off the page instead of the fragment. The
 * order is seeded on each question's own id, so it is stable for everybody and
 * across visits (src/lib/shuffle.ts says why), and the pick is stored by
 * choice id, so nothing about the shuffle reaches storage.
 *
 * Two things had to move with it. The badge shows the letter of the SLOT, not
 * the choice's id — the ids happen to be a..d and printing them shuffled would
 * be a list labelled B, D, A, C. And the explanations used to say "A and C are
 * real weaknesses"; a letter is a position, and positions are display now, so
 * they name the options by what they say instead.
 */

interface Saved {
  picks: Record<string, string>;
  submitted: boolean;
}

const STORAGE_KEY = "v-policy-quick-check:v1";
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

export function PolicyQuickCheck({
  onComplete,
  initialCompleted,
}: VerificationWidgetProps) {
  const [saved, setSaved] = useState<Saved>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const fired = useRef(initialCompleted);

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

  const persist = useCallback((next: Saved) => {
    setSaved(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* private mode / full quota */
    }
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
                    {question.covers}
                  </p>
                ) : null}
              </div>

              <blockquote className="border-border mt-2 border-l-2 pl-3 text-sm leading-relaxed italic">
                {question.fragment}
              </blockquote>
              <p className="mt-2 text-sm font-medium">{question.stem}</p>

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
                        persist({
                          ...saved,
                          picks: { ...saved.picks, [question.id]: choice.id },
                        })
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
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {question.explanation}
                </p>
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
          <Button size="sm" variant="outline" onClick={() => persist(EMPTY)}>
            Start over
          </Button>
        ) : (
          <Button
            size="sm"
            disabled={answered < QUICK_QUESTIONS.length}
            onClick={() => {
              persist({ ...saved, submitted: true });
              if (!fired.current) {
                fired.current = true;
                onComplete();
              }
            }}
          >
            Check all five
          </Button>
        )}
      </div>
    </div>
  );
}
