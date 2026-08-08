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

/**
 * The written-answer deck both question units use: every question on the page
 * at once, each with its own box.
 *
 * The house rule is one step at a time, and this is the exception it names.
 * The questions are what the learner is looking for while they page through a
 * treaty or a working paper, so revealing question 3 once question 2 is
 * answered sends them back through the document a second time.
 *
 * No key, no score, no marking — see each deck's data file for why, and do
 * not reintroduce one unasked.
 *
 * Typing autosaves; Save answer is a separate deliberate act and it is the
 * one that counts toward the rule. Notes in progress therefore never complete
 * a unit on their own, and nothing here auto-completes.
 */
export function QuestionWorkspace({
  storageKey,
  rule,
  questions,
  intro,
  placeholder = "Quote the words you are talking about.",
  onComplete,
}: {
  /** localStorage document for this deck. Permanent — it holds learner work. */
  storageKey: string;
  rule: WorkspaceRule;
  questions: readonly WorkspaceQuestion[];
  intro?: ReactNode;
  placeholder?: string;
  onComplete: () => void;
}) {
  const [state, setState] = useState<Saved>(EMPTY);

  useEffect(() => {
    // Read after mount: localStorage exists only on the client, and reading it
    // during render would make the server and client markup disagree.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(read(storageKey));
  }, [storageKey]);

  const save = useCallback(
    (next: Saved) => {
      setState(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* private mode */
      }
    },
    [storageKey],
  );

  const answered = new Set(
    Object.entries(state.done)
      .filter(([, v]) => v)
      .map(([k]) => k),
  );
  const owed = answersOwed(rule, questions);
  const counted = questions.filter(
    (q) => q.requirement !== "optional" && answered.has(q.id),
  ).length;
  const choices = choiceNumbers(questions);

  return (
    <div className="not-prose my-6 space-y-4">
      {intro}

      <p
        className="text-muted-foreground text-right font-mono text-xs"
        aria-live="polite"
      >
        {Math.min(counted, owed)} of {owed} answered
      </p>

      {questions.map((q) => {
        const committed = !!state.done[q.id];
        return (
          <div key={q.id} className="border-border bg-card rounded-xl border p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h3 className="text-base font-semibold">
                {q.n}. {q.title}
              </h3>
              <Badge rule={rule} requirement={q.requirement} choices={choices} />
            </div>

            <div className="mt-1 space-y-2 text-sm">
              {q.body.map((block, i) =>
                "list" in block ? (
                  // The card is not-prose, so the list carries its own markers
                  // and indent — preflight has taken both away.
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
                ),
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
              className="border-border bg-background mt-3 w-full rounded-md border p-3 text-sm"
            />

            <div className="mt-3">
              {committed ? (
                <p className="text-muted-foreground text-xs">
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
                        .map(([k]) => k),
                    );
                    if (isWorkspaceComplete(rule, questions, next)) onComplete();
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

/**
 * What this question is for. A word, not a colour — the three states have to
 * survive a reader who cannot tell the hues apart, and the choose-one badge
 * has to name its own group or "choose one" tells nobody which ones.
 */
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
    <span className="border-border text-muted-foreground rounded-full border px-2 py-0.5 font-mono text-xs select-none">
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
