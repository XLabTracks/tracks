"use client";

import { useMemo } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useStoredState } from "../kit/use-stored-state";
import { shuffleAnswerOptions } from "@/lib/shuffle";
import { splitEmphasis } from "@/lib/verification/emphasis";
import { cn } from "@/lib/utils";
import { QUICK_QUESTIONS } from "@/lib/verification/data/policy-quick-check";
import { ChoiceList } from "../kit/choice-list";
import type { VerificationWidgetProps } from "../kit/types";

function Rich({ children }: { children: string }) {
  return (
    <>
      {splitEmphasis(children).map((run, i) =>
        run.strong ? (
          <strong key={i} className="font-semibold">
            {run.text}
          </strong>
        ) : (
          <span key={i}>{run.text}</span>
        ),
      )}
    </>
  );
}

interface Saved {
  picks: Record<string, string>;
  submitted: boolean;
}

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

export function PolicyQuickCheck({}: VerificationWidgetProps) {
  const [saved, persist, hydrated] = useStoredState(STORAGE_KEY, EMPTY, prune);

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

  if (!hydrated) return <div className="not-prose my-6 min-h-64" aria-busy />;

  const answered = QUICK_QUESTIONS.filter((q) => saved.picks[q.id]).length;
  const right = QUICK_QUESTIONS.filter(
    (q) => saved.picks[q.id] === q.answerId
  ).length;

  return (
    <div className="not-prose my-6 space-y-4">
      <ol>
        {shown.map(({ question, choices }, index) => {
          const pick = saved.picks[question.id];
          const correct = pick === question.answerId;
          return (
            <li
              key={question.id}
              className="[&+li]:border-muted-foreground/60 [&+li]:mt-6 [&+li]:border-t [&+li]:pt-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h4 className="text-base font-semibold">
                  Question {index + 1}/{QUICK_QUESTIONS.length}
                </h4>
                {saved.submitted ? (
                  <p
                    className={cn(
                      "flex items-center gap-1.5 text-3xs tracking-wide",
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
                <p>
                  <Rich>{question.fragment}</Rich>
                </p>
                {question.facts ? (
                  <ul className="list-disc space-y-1 pl-5">
                    {question.facts.map((f) => (
                      <li key={f}>
                        <Rich>{f}</Rich>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {question.fragmentAfter ? (
                  <p>
                    <Rich>{question.fragmentAfter}</Rich>
                  </p>
                ) : null}
              </div>
              <p className="mt-3 text-sm font-medium">
                <Rich>{question.stem}</Rich>
              </p>

              <div className="mt-3">
                <ChoiceList
                  options={choices.map((choice) => ({
                    id: choice.id,
                    node: <Rich>{choice.text}</Rich>,
                    correct: choice.id === question.answerId,
                  }))}
                  value={pick ?? null}
                  committed={saved.submitted}
                  label={question.stem}
                  onPick={(id) =>
                    persist((prev) => ({
                      ...prev,
                      picks: { ...prev.picks, [question.id]: id },
                    }))
                  }
                />
              </div>

              {saved.submitted ? (
                <div className="mt-3 space-y-1.5">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    <Rich>{question.explanation}</Rich>
                  </p>
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
