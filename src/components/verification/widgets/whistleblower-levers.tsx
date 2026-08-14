"use client";

import { useCallback, useEffect, useState } from "react";
import { CircleAlert, CircleCheck, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { shuffleAnswerOptions } from "@/lib/shuffle";
import { cn } from "@/lib/utils";
import {
  LEVERS_LEAD,
  WHISTLEBLOWER_LEVERS as LEVERS,
} from "@/lib/verification/data/whistleblower-levers";
import type { VerificationWidgetProps } from "../kit/types";

/**
 * 2.4.2's four levers: assign each its effect, commit once, then read what
 * the course says each one changes.
 *
 * One commit for all four, not four commits: the reasoning is comparative —
 * SB 53's duty and the ACM Code's duty are the pair that has to be told
 * apart — and four separate picks would hand the last one over by
 * elimination. Each effect is used exactly once, so choosing is also
 * excluding; picking one that is already placed moves it rather than
 * refusing, because a swap is what an assignment actually is.
 *
 * Unbridged on purpose. This is a three-minute block inside a section whose
 * lab is "Follow the Report"; that widget is the bridged one, and a second
 * completion event in one lesson would mean the section finishes at whichever
 * fired first.
 *
 * No score is kept. The reveal is the course's own sentence per row with the
 * document that authorizes it — see data/whistleblower-levers.ts for what came
 * from where.
 *
 * Answers persist under `v-whistleblower-levers:v1`, applied off the effect
 * body behind `hydrated` so the first client render matches the server's, and
 * pruned against the current rows before they are trusted.
 */

type Placed = Record<string, string>;

const STORAGE_KEY = "v-whistleblower-levers:v1";
const ids = new Set(LEVERS.map((l) => l.id));

function prune(raw: unknown): Placed {
  const out: Placed = {};
  if (typeof raw !== "object" || raw === null) return out;
  for (const lever of LEVERS) {
    const v = (raw as Record<string, unknown>)[lever.id];
    if (typeof v === "string" && ids.has(v)) out[lever.id] = v;
  }
  return out;
}

// The host's props are taken and not used: onComplete is a no-op for an
// unbridged widget, and calling it from a block that is not the section's
// finish would claim the section had ended. The signature stays because the
// registry types every widget the same way.
export function WhistleblowerLevers({}: VerificationWidgetProps) {
  const [placed, setPlaced] = useState<Placed>({});
  const [committed, setCommitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let restored: Placed = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) restored = prune(JSON.parse(raw));
    } catch {
      /* unreadable storage just means starting fresh */
    }
    queueMicrotask(() => {
      setPlaced(restored);
      setCommitted(Object.keys(restored).length === LEVERS.length);
      setHydrated(true);
    });
  }, []);

  const persist = useCallback((next: Placed) => {
    setPlaced(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* private mode / full quota — progress is a convenience, not the record */
    }
  }, []);

  /* Assigning an effect that already sits on another row moves it here. The
     alternative — refusing the click — makes the learner undo before they can
     rethink, which is friction on exactly the comparison this asks for. */
  function assign(leverId: string, effectId: string) {
    if (committed) return;
    const next: Placed = {};
    for (const [row, effect] of Object.entries(placed)) {
      if (row !== leverId && effect !== effectId) next[row] = effect;
    }
    next[leverId] = effectId;
    persist(next);
  }

  const done = Object.keys(placed).length === LEVERS.length;

  if (!hydrated) return <div className="not-prose my-6 min-h-64" aria-busy />;

  /**
   * The chips were offered in `LEVERS` order under rows that are also in
   * `LEVERS` order, so row 1's answer was chip 1, row 2's chip 2, and the whole
   * matching could be finished on the diagonal without reading a word of it.
   *
   * One shuffled order, shared by every row, is what breaks that: the answers
   * land on a fixed permutation instead of the identity, and the reader still
   * scans the same four chips in the same places down the column. Per-row
   * shuffling would break it too and would make them re-read four chips four
   * times, which is work the exercise is not asking for.
   *
   * Nothing is keyed on position here — `placed` maps lever id to lever id —
   * so this is display only.
   */
  const chips = shuffleAnswerOptions(
    "whistleblower-levers",
    LEVERS,
    (l) => l.chip,
  );

  return (
    <div className="not-prose my-6 space-y-4">
      <p className="text-sm leading-relaxed">
        {LEVERS_LEAD} Give each one the effect it produces — each effect is used
        once.
      </p>

      <ol className="space-y-3">
        {LEVERS.map((lever) => {
          const choice = placed[lever.id];
          const right = choice === lever.id;
          return (
            <li
              key={lever.id}
              className="border-border bg-card rounded-xl border p-4"
            >
              <p className="font-semibold">{lever.name}</p>

              {/* The author's sentences name their own source ("SB 53 says…",
                  "Wasil et al. propose…"), so a label above them repeats the
                  name four times over. The citation goes under the words as a
                  citation instead — the em-dash form the two pull quotes in
                  this same lesson already use — and carries the locator the
                  sentence does not have (§22757.13(c), §1.2). */}
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {lever.source}
              </p>
              <p className="mt-1 text-xs">
                <a
                  href={lever.cite.href}
                  target="_blank"
                  rel="noopener"
                  className="text-muted-foreground underline-offset-4 hover:underline"
                >
                  — {lever.cite.label}
                </a>
              </p>

              {committed ? (
                <div className="mt-3 space-y-1.5">
                  <p
                    className={cn(
                      "flex items-center gap-1.5 font-mono text-xs tracking-wide",
                      right ? "text-comply" : "text-defect",
                    )}
                  >
                    {right ? (
                      <CircleCheck className="size-3.5 shrink-0" aria-hidden />
                    ) : (
                      <CircleAlert className="size-3.5 shrink-0" aria-hidden />
                    )}
                    {right ? "You matched this one" : "You put it elsewhere"}
                  </p>
                  <p className="text-sm leading-relaxed">{lever.effect}</p>
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {chips.map(({ item: option }) => {
                    const active = choice === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => assign(lever.id, option.id)}
                        className={cn(
                          "border-border rounded-lg border px-2.5 py-1.5 text-left text-xs transition-colors",
                          active
                            ? "border-primary bg-primary/10 font-medium"
                            : "hover:bg-muted",
                        )}
                      >
                        {option.chip}
                      </button>
                    );
                  })}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs">
          {committed
            ? "Each row now carries what the course says it changes."
            : done
              ? "All four placed — commit to see what each one changes."
              : `${Object.keys(placed).length} of ${LEVERS.length} placed.`}
        </p>
        {committed ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setCommitted(false);
              persist({});
            }}
          >
            <RotateCcw className="size-3.5" aria-hidden />
            Start over
          </Button>
        ) : (
          <Button
            size="sm"
            disabled={!done}
            onClick={() => setCommitted(true)}
          >
            Commit
          </Button>
        )}
      </div>
    </div>
  );
}
