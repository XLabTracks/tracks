"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { VerificationWidgetProps } from "../kit/types";
import {
  TREATY,
  WORKSPACE_QUESTIONS,
  WORKSPACE_REQUIRED,
} from "@/lib/verification/data/treaty-workspace";

/**
 * Four questions on the MIRI treaty, all four on the page at once.
 *
 * The house rule is one step at a time, and this is the exception it names:
 * the learner reads all four before opening the treaty, because the questions
 * are what they are looking for while they page through fifteen Articles.
 * Revealing question 3 after question 2 is answered would send them back
 * through the document a third time.
 *
 * No key, no score, no marking. The learner writes and keeps their answer;
 * the practice guide above is what they check themselves against. See the
 * data file for why the key was removed and why it should not come back
 * unasked.
 *
 * Answers persist under `vt-workspace:1.1`. Typing autosaves; Save answer is
 * a separate, deliberate act, and it is the one that counts toward
 * WORKSPACE_REQUIRED — so notes-in-progress never complete the unit on their
 * own, and nothing here auto-completes.
 *
 * Trap: WORKSPACE_REQUIRED is below the question count on purpose. Fifteen
 * Articles against a fixed hour means somebody runs out of time, and a unit
 * that then reads as unfinished teaches them only that the course does not
 * believe them. Never raise it to the full four.
 */

const KEY = "vt-workspace:1.1";

interface Saved {
  answers: Record<string, string>;
  done: Record<string, boolean>;
}

const EMPTY: Saved = { answers: {}, done: {} };

function read(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function TreatyWorkspace({ onComplete }: VerificationWidgetProps) {
  const [state, setState] = useState<Saved>(EMPTY);

  useEffect(() => {
    // Read after mount: localStorage exists only on the client, and reading it
    // during render would make the server and client markup disagree.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(read());
  }, []);

  const save = useCallback((next: Saved) => {
    setState(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* private mode */
    }
  }, []);

  const answered = Object.values(state.done).filter(Boolean).length;

  return (
    <div className="not-prose my-6 space-y-4">
      {/* Which pages of the practice guide to read is the reading card in the
          lesson body, and only there. Two places that name pages are two
          places to keep in step. */}
      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-sm">
          Open{" "}
          <a
            href={`/tracks/verification/policy-scoping/${TREATY.paperSlug}`}
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            the treaty
          </a>{" "}
          by the {TREATY.authors}. Do not read it end to end. Page through it, one
          Article at a time, until you can answer the questions below.
        </p>
        <p className="text-muted-foreground mt-3 text-sm">
          Answer any {WORKSPACE_REQUIRED} of the {WORKSPACE_QUESTIONS.length}.
          Read all four first — they are what you are looking for while you page
          through.
        </p>
      </div>

      <p
        className="text-muted-foreground text-right font-mono text-xs"
        aria-live="polite"
      >
        {answered} of {WORKSPACE_REQUIRED} answered
      </p>

      {WORKSPACE_QUESTIONS.map((q) => {
        const committed = !!state.done[q.id];
        return (
          <div key={q.id} className="border-border bg-card rounded-xl border p-5">
            <h3 className="text-base font-semibold">{q.title}</h3>
            <p className="mt-1 text-sm">{q.prompt}</p>
            {q.hint && (
              <p className="text-muted-foreground mt-2 font-mono text-xs">
                {q.hint}
              </p>
            )}

            <textarea
              rows={7}
              value={state.answers[q.id] ?? ""}
              onChange={(e) =>
                save({
                  ...state,
                  answers: { ...state.answers, [q.id]: e.target.value },
                })
              }
              placeholder="Quote the words you are talking about."
              className="border-border bg-background mt-3 w-full rounded-md border p-3 text-sm"
            />

            <div className="mt-3 flex flex-wrap items-center gap-3">
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
                    if (
                      Object.values(done).filter(Boolean).length >=
                      WORKSPACE_REQUIRED
                    ) {
                      onComplete();
                    }
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
