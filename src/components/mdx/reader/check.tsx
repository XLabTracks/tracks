"use client";

import { Button } from "@/components/ui/button";
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
  /** Zero-based index into `options`. */
  answer: number;
  why: string;
}) {
  const pick = useMark<number | null>(`check:${id}`, null);

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
        {options.map((o, k) => (
          <button
            key={k}
            type="button"
            disabled={done}
            onClick={() => choose(k)}
            className={cn(
              "border-border rounded-lg border px-3 py-2 text-left text-sm select-none",
              !done && "hover:bg-muted cursor-pointer",
              done && k === answer && "border-comply/50 bg-comply/10",
              done && k === pick && !right && "border-destructive/50 bg-destructive/10",
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
