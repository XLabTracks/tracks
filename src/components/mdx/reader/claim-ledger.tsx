"use client";

import { CLAIM_LEDGER_SETS } from "@/lib/verification/data/hardware-opening-puzzle";
import { cn } from "@/lib/utils";

import { useMark, writeMark } from "./marks";

/**
 * A list of proposed conclusions, each graded on the same scale, committed
 * with no key.
 *
 * 2.1's opening puzzle is a table in the outline: seven conclusions down the
 * left, a blank "Your judgment" column down the right, and the instruction
 * "Keep your answers. You will return to them at the end of the section." A
 * blank column is a page a reader can fill in; on screen it is nothing at
 * all, so the column is the control — one row per conclusion, the scale
 * repeated across it — and the answers are kept where the reader blocks keep
 * learner work.
 *
 * `recall` is that promised return: the same rows, read-only, showing what
 * this learner recorded before the section and naming the rows they left
 * blank. It reads the same mark, so the puzzle and its recall cannot drift
 * apart, and the closing prose beside it is the reveal — there is no key
 * here, in either mode, because the section's answer is a paragraph and not
 * a tick.
 *
 * Learner work on the vt-marks store, same as `<Check/>` and
 * `<VerdictSelect/>`: it feeds no meter, unlocks nothing and completes no
 * unit. `id` is the storage key and is permanent.
 */
export function ClaimLedger({
  id,
  set,
  recall = false,
}: {
  /** Permanent — the storage key for this learner's judgments. */
  id: string;
  /** Which authored claim set to print: a key of CLAIM_LEDGER_SETS. */
  set: string;
  /** Read the recorded judgments back instead of collecting them. */
  recall?: boolean;
}) {
  const ledger = CLAIM_LEDGER_SETS[set];
  const marks = useMark<Record<string, string>>(`ledger:${id}`, {});

  if (!ledger) return null;

  const choose = (row: number, option: string) => {
    const next = { ...marks };
    if (next[row] === option) delete next[row];
    else next[row] = option;
    writeMark(`ledger:${id}`, Object.keys(next).length ? next : undefined);
  };

  return (
    <div className="not-prose border-border bg-card my-6 rounded-xl border p-5">
      <span className="text-muted-foreground block text-xs font-medium tracking-wide uppercase">
        {recall ? "What you recorded" : "Your judgment"}
      </span>

      <ol role="list" className="mt-4 grid gap-4">
        {ledger.claims.map((claim, row) => {
          const picked = marks[row];
          return (
            <li key={claim} className="grid gap-2">
              <p className="text-sm font-medium">{claim}</p>

              {recall ? (
                <p className="text-muted-foreground text-sm">
                  {picked
                    ? (ledger.options.find((o) => o.id === picked)?.text ??
                      picked)
                    : "— you did not record a judgment for this one"}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {ledger.options.map((option) => {
                    const selected = picked === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => choose(row, option.id)}
                        className={cn(
                          "flex min-h-11 cursor-pointer items-baseline gap-1.5 rounded-lg border px-3 py-2 text-left text-sm select-none sm:min-h-0",
                          selected
                            ? "border-foreground bg-muted"
                            : "border-border hover:bg-muted",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            selected ? "text-foreground" : "text-transparent",
                          )}
                        >
                          ✓
                        </span>
                        <span className="min-w-0">{option.text}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
