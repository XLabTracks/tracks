"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useMark, writeMark } from "./marks";

type State = { fill: (string | null)[]; checked: boolean; sel: number };

/**
 * Fill the blanks in a passage from a bank of words.
 *
 * Words are placed, not typed: what is being asked is whether the learner can
 * pick the load-bearing word out of a line they have just read, not whether
 * they can spell it. Pick a word then a blank, or click a filled blank to lift
 * its word back into the bank.
 *
 * The bank carries distractors on purpose — with exactly as many words as
 * blanks the last few place themselves, and filling the passage stops being a
 * decision. A placed word leaves the bank, so what is left in the bank is also
 * how many blanks are left.
 *
 * Like Check, it grades nothing that counts. The count after Check is feedback,
 * not a score, and Try again is always there.
 */
export function GapFill({
  id,
  lead,
  text,
  blanks,
  bank,
  why,
  src,
}: {
  /** Permanent — the storage key for this learner's placements. */
  id: string;
  lead?: string;
  /** The passage, with `___` marking each blank. */
  text: string;
  /** The correct word for each blank, in order. */
  blanks: string[];
  /** Every word offered, correct ones and distractors together. */
  bank: string[];
  why: string;
  src?: string;
}) {
  // `empty` is the fallback identity useMark returns while nothing is stored,
  // so it has to be stable or the snapshot changes on every render.
  const empty = useMemo<State>(
    () => ({ fill: blanks.map(() => null), checked: false, sel: 0 }),
    [blanks],
  );
  const stored = useMark<State>(`gap:${id}`, empty);
  // A stored run whose length no longer matches the passage belongs to an
  // older wording of this gap; start clean rather than misalign the blanks.
  const st = stored.fill?.length === blanks.length ? stored : empty;

  const put = (next: State) => writeMark(`gap:${id}`, next);

  const fill = st.fill;
  const checked = st.checked;

  // A word is gone from the bank once it is placed. Counting occurrences (not
  // membership) is what lets the same word appear twice in the bank and be
  // placed twice.
  const used: Record<string, number> = {};
  fill.forEach((w) => {
    if (w != null) used[w] = (used[w] ?? 0) + 1;
  });

  const placed = fill.filter((w) => w != null).length;
  const rightCount = blanks.filter((b, k) => fill[k] === b).length;

  // A word goes into the blank the learner selected, or into the first empty
  // one if they have not selected any — so the passage can be filled left to
  // right without ever touching a blank.
  function pickWord(w: string) {
    if (checked) return;
    const target = fill[st.sel] == null ? st.sel : fill.findIndex((v) => v == null);
    if (target < 0) return;
    const next = fill.slice();
    next[target] = w;
    const nextSel = next.findIndex((v) => v == null);
    put({ fill: next, checked: false, sel: nextSel < 0 ? target : nextSel });
  }

  function tapBlank(k: number) {
    if (checked) return;
    if (fill[k] != null) {
      const next = fill.slice();
      next[k] = null;
      put({ fill: next, checked: false, sel: k });
      return;
    }
    put({ ...st, fill, sel: k });
  }

  const segments = text.split("___");

  return (
    <div className="not-prose border-border bg-card my-6 rounded-xl border p-5">
      <span className="text-muted-foreground block text-xs font-medium tracking-wide uppercase">
        Fill the gaps
      </span>
      {lead ? <p className="mt-2 text-sm leading-relaxed">{lead}</p> : null}

      <p className="mt-3 leading-loose">
        {segments.map((seg, k) => (
          <span key={k}>
            {seg}
            {k < blanks.length ? (
              <button
                type="button"
                disabled={checked}
                onClick={() => tapBlank(k)}
                className={cn(
                  "mx-0.5 inline-flex min-w-24 justify-center rounded border px-2 py-0.5 align-baseline text-sm select-none",
                  !checked && "cursor-pointer",
                  !checked && st.sel === k && "border-primary",
                  fill[k] == null && "border-border border-dashed",
                  checked &&
                    (fill[k] === blanks[k]
                      ? "border-emerald-600/50 bg-emerald-600/10"
                      : "border-destructive/50 bg-destructive/10"),
                )}
              >
                {fill[k] ?? " "}
              </button>
            ) : null}
          </span>
        ))}
      </p>

      {!checked ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {bank.map((w, k) => {
            if (used[w]) {
              used[w] -= 1;
              return null;
            }
            return (
              <button
                key={`${w}-${k}`}
                type="button"
                onClick={() => pickWord(w)}
                className="border-border hover:bg-muted cursor-pointer rounded-full border px-3 py-1 text-sm select-none"
              >
                {w}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {checked ? (
          <>
            <span className="text-muted-foreground text-sm">
              {rightCount} / {blanks.length} right
            </span>
            <Button size="sm" variant="outline" onClick={() => put({ ...empty })}>
              Try again
            </Button>
          </>
        ) : (
          <>
            <span className="text-muted-foreground text-sm">
              {placed} / {blanks.length} placed
            </span>
            <Button
              size="sm"
              disabled={placed !== blanks.length}
              onClick={() => put({ ...st, fill, checked: true })}
            >
              Check
            </Button>
          </>
        )}
      </div>

      {checked ? (
        <div
          className={cn(
            "mt-4 rounded-lg border p-4",
            rightCount === blanks.length ? "border-emerald-600/40" : "border-destructive/40",
          )}
        >
          <span className="text-xs font-medium tracking-wide uppercase">
            {rightCount === blanks.length ? "All right" : "Not all of them"}
          </span>
          <p className="mt-2 text-sm leading-relaxed">{why}</p>
          {src ? <p className="text-muted-foreground mt-2 text-xs">{src}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
