"use client";

import { cn } from "@/lib/utils";

import { useMark, writeMark } from "./marks";

/**
 * A committed position with no answer key: the learner selects one option and
 * the essay under the block argues the choice. The outline's 0.2 final essays
 * each end on a recommendation — "Adopt / adopt with amendments / reject" for
 * Option A, "Plan A or Plan S" for Option B — so the pick is a control the
 * essay refers back to, not a quiz: nothing is revealed, nothing is graded,
 * and the selection stays changeable while the essay is drafted (pressing the
 * selected option again clears it).
 *
 * Learner work on the vt-marks store, same as <Check/>: it feeds no meter,
 * unlocks nothing, and completes no unit. The `id` is the storage key and is
 * permanent. Selected state is carried by the ✓ glyph and the word
 * "selected", never by colour alone.
 */
export function VerdictSelect({
  id,
  prompt,
  options,
}: {
  /** Permanent — the storage key for this learner's selection. */
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
}) {
  const pick = useMark<string | null>(`verdict:${id}`, null);

  return (
    <div className="not-prose border-border bg-card my-6 rounded-xl border p-5">
      <span className="text-muted-foreground block text-xs font-medium tracking-wide uppercase">
        Your recommendation
      </span>
      <p className="mt-2 font-medium">{prompt}</p>

      <div className="mt-4 grid gap-2">
        {options.map((option) => {
          const selected = pick === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() =>
                writeMark(`verdict:${id}`, selected ? undefined : option.id)
              }
              className={cn(
                "flex cursor-pointer items-baseline gap-2 rounded-lg border px-3 py-2 text-left text-sm select-none",
                selected ? "border-foreground bg-muted" : "border-border hover:bg-muted",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(selected ? "text-foreground" : "text-transparent")}
              >
                ✓
              </span>
              <span className="min-w-0">
                {option.text}
                {selected ? (
                  <span className="text-muted-foreground ml-1.5 text-xs">
                    · selected
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
