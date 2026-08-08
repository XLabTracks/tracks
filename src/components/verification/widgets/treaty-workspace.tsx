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
 * Four questions on the MIRI treaty, one at a time.
 *
 * No key, no score, no marking. The learner writes, keeps their answer, and
 * moves on; the reference above the questions is what they check themselves
 * against. See the data file for why the key was removed and why it should
 * not come back unasked.
 *
 * Answers persist under `vt-workspace:1.1`. They are learner work: they feed
 * no meter. The unit completes when enough questions are answered —
 * WORKSPACE_REQUIRED, which allows exactly one to be skipped — because
 * committing an answer is a thing the learner did, unlike scrolling past.
 *
 * Trap: `Skip` must stay available on an unanswered question. The point of a
 * fifteen-Article treaty and a fixed hour is that somebody will run out of
 * time, and a unit that then reads as unfinished teaches them nothing except
 * that the course does not believe them.
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
  const [at, setAt] = useState(0);

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

  const q = WORKSPACE_QUESTIONS[at];
  const answered = Object.values(state.done).filter(Boolean).length;
  const committed = !!state.done[q.id];

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
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-muted-foreground font-mono text-xs">
            Question {at + 1} / {WORKSPACE_QUESTIONS.length}
          </p>
          <p className="text-muted-foreground text-xs">
            {answered} of {WORKSPACE_REQUIRED} answered
          </p>
        </div>

        <h3 className="mt-2 text-base font-semibold">{q.title}</h3>
        <p className="mt-1 text-sm">{q.prompt}</p>
        {q.hint && (
          <p className="text-muted-foreground mt-2 font-mono text-xs">{q.hint}</p>
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

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {!committed && (
            <Button
              size="sm"
              onClick={() => {
                const done = { ...state.done, [q.id]: true };
                save({ ...state, done });
                if (
                  Object.values(done).filter(Boolean).length >= WORKSPACE_REQUIRED
                ) {
                  onComplete();
                }
              }}
            >
              Save answer
            </Button>
          )}
          {committed && (
            <p className="text-muted-foreground text-xs">Saved.</p>
          )}
          {at > 0 && (
            <Button size="sm" variant="ghost" onClick={() => setAt(at - 1)}>
              Back
            </Button>
          )}
          {at < WORKSPACE_QUESTIONS.length - 1 && (
            <Button size="sm" variant="ghost" onClick={() => setAt(at + 1)}>
              {committed ? "Next" : "Skip this one"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
