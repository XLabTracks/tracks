"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  answersOwed,
  choiceNumbers,
  isWorkspaceComplete,
  type WorkspaceQuestion,
  type WorkspaceRule,
} from "@/lib/verification/question-workspace";
import { writingArea, writingCardFocus } from "./writing-surface";
import { cn } from "@/lib/utils";

export function QuestionWorkspace({
  storageKey,
  rule,
  questions,
  intro,
  placeholder = "Quote the words you are talking about.",
  onComplete,
}: {
  storageKey: string;
  rule: WorkspaceRule;
  questions: readonly WorkspaceQuestion[];
  intro?: ReactNode;
  placeholder?: string;
  onComplete: () => void;
}) {
  const [state, setState] = useState<Saved>(EMPTY);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(read(storageKey));
  }, [storageKey]);

  const save = useCallback(
    (next: Saved) => {
      setState(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
      }
    },
    [storageKey]
  );

  const answered = new Set(
    Object.entries(state.done)
      .filter(([, v]) => v)
      .map(([k]) => k)
  );
  const owed = answersOwed(rule, questions);
  const counted = questions.filter(
    (q) => q.requirement !== "optional" && answered.has(q.id)
  ).length;
  const choices = choiceNumbers(questions);

  return (
    <div className="not-prose my-6 space-y-4">
      {intro}

      <p
        className="text-muted-foreground text-right text-xs"
        aria-live="polite"
      >
        {Math.min(counted, owed)} of {owed} answered
      </p>

      {questions.map((q) => {
        const committed = !!state.done[q.id];
        return (
          <div
            key={q.id}
            className={cn(
              "panel",
              writingCardFocus
            )}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h3 className="text-lg font-semibold">
                {q.n}. {q.title}
              </h3>
              <Badge
                rule={rule}
                requirement={q.requirement}
                choices={choices}
              />
            </div>

            <div className="mt-1 space-y-2 text-sm">
              {q.body.map((block, i) =>
                "list" in block ? (
                  <ul
                    key={i}
                    className="marker:text-muted-foreground list-disc space-y-1 pl-5"
                  >
                    {block.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={i}>{block.text}</p>
                )
              )}
            </div>

            <textarea
              rows={7}
              value={state.answers[q.id] ?? ""}
              onChange={(e) =>
                save({
                  ...state,
                  answers: { ...state.answers, [q.id]: e.target.value },
                })
              }
              placeholder={placeholder}
              className={writingArea}
            />

            <div className="mt-3">
              {committed ? (
                <p className="text-muted-foreground text-sm">
                  Saved. Keep editing if you want — it stays saved.
                </p>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {
                    const done = { ...state.done, [q.id]: true };
                    save({ ...state, done });
                    const next = new Set(
                      Object.entries(done)
                        .filter(([, v]) => v)
                        .map(([k]) => k)
                    );
                    if (isWorkspaceComplete(rule, questions, next))
                      onComplete();
                  }}
                >
                  Save answer
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Badge({
  rule,
  requirement,
  choices,
}: {
  rule: WorkspaceRule;
  requirement: WorkspaceQuestion["requirement"];
  choices: number[];
}) {
  if (rule.kind === "any") return null;
  if (requirement === "required") return null;
  const label =
    requirement === "optional"
      ? "Optional"
      : `Answer one of ${listNumbers(choices)}`;
  return (
    <span className="border-border text-muted-foreground rounded-full border px-2 py-0.5 text-xs select-none">
      {label}
    </span>
  );
}

function listNumbers(ns: number[]): string {
  if (ns.length <= 1) return String(ns[0] ?? "");
  return `${ns.slice(0, -1).join(", ")} or ${ns[ns.length - 1]}`;
}

interface Saved {
  answers: Record<string, string>;
  done: Record<string, boolean>;
}

const EMPTY: Saved = { answers: {}, done: {} };

function read(key: string): Saved {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}
