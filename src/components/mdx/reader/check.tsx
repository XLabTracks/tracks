"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { shuffleAnswerOptions } from "@/lib/shuffle";
import { cn } from "@/lib/utils";

import { useMark, writeMark } from "./marks";

/**
 * One question, committed before anything is revealed.
 *
 * The pick is locked in first and the explanation then breathes — no
 * auto-advance, and the wrong option the learner actually chose is marked as
 * well as the right one, because "you picked this, the answer is that" teaches
 * and a bare tick does not.
 *
 * It grades nothing. There is no score anywhere, and Try again is always
 * offered: the question exists to make a claim in the reading concrete, not to
 * assess anyone.
 *
 * The options are shuffled for display, seeded on the block's own id. What is
 * stored, and what `answer` is compared against, is always the AUTHORED index
 * — the position the option occupies in the `options` prop. That is what keeps
 * `answer={2}` meaning the same thing after the shuffle, and what keeps a pick
 * a learner made before this existed pointing at the option they picked: the
 * mark is permanent storage and could not be renumbered even if we wanted to.
 */
export function Check({
  id,
  q,
  options,
  answer,
  why,
}: {
  /** Permanent — the storage key for this learner's pick. */
  id: string;
  q: string;
  options: string[];
  /** Zero-based index into `options`, as authored. */
  answer: number;
  why: string;
}) {
  const pick = useMark<number | null>(`check:${id}`, null);
  const shown = useMemo(
    () => shuffleAnswerOptions(`check:${id}`, options, (o) => o),
    [id, options],
  );

  const choose = (k: number) => writeMark(`check:${id}`, k);
  const clear = () => writeMark(`check:${id}`, undefined);

  const done = pick !== null;
  const right = done && pick === answer;

  return (
    <div className="not-prose border-border bg-card my-6 rounded-xl border p-5">
      <span className="text-muted-foreground block text-xs font-medium tracking-wide uppercase">
        Check yourself
      </span>
      <p className="mt-2 font-medium">{q}</p>

      <div className="mt-4 grid gap-2">
        {shown.map(({ item: o, from }) => (
          <button
            key={from}
            type="button"
            disabled={done}
            onClick={() => choose(from)}
            className={cn(
              "border-border rounded-lg border px-3 py-2 text-left text-sm select-none",
              !done && "hover:bg-muted cursor-pointer",
              done && from === answer && "border-comply/50 bg-comply/10",
              done &&
                from === pick &&
                !right &&
                "border-destructive/50 bg-destructive/10",
            )}
          >
            {o}
          </button>
        ))}
      </div>

      {done ? (
        <div
          className={cn(
            "mt-4 rounded-lg border p-4",
            right ? "border-comply/40" : "border-destructive/40",
          )}
        >
          <span className="text-xs font-medium tracking-wide uppercase">
            {right ? "Correct" : "Not quite"}
          </span>
          <p className="mt-2 text-sm leading-relaxed">{why}</p>
          <Button size="sm" variant="outline" className="mt-3" onClick={clear}>
            Try again
          </Button>
        </div>
      ) : null}
    </div>
  );
}
