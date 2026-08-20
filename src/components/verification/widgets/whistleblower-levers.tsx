"use client";

import { useState } from "react";
import { CircleAlert, CircleCheck, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { shuffleAnswerOptions } from "@/lib/shuffle";
import { cn } from "@/lib/utils";
import { useStoredState } from "../kit/use-stored-state";
import {
  LEVERS_LEAD,
  WHISTLEBLOWER_LEVERS as LEVERS,
} from "@/lib/verification/data/whistleblower-levers";
import type { VerificationWidgetProps } from "../kit/types";

type Placed = Record<string, string>;

const STORAGE_KEY = "v-whistleblower-levers:v1";
const EMPTY: Placed = {};
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

export function WhistleblowerLevers({}: VerificationWidgetProps) {
  const [committed, setCommitted] = useState(false);
  const [placed, persist, hydrated] = useStoredState<Placed>(
    STORAGE_KEY,
    EMPTY,
    prune,
    (restored) => setCommitted(Object.keys(restored).length === LEVERS.length),
  );

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

  const chips = shuffleAnswerOptions(
    "whistleblower-levers",
    LEVERS,
    (l) => l.chip,
  );

  return (
    <div className="not-prose my-6 space-y-4">
      <p className="text-sm leading-relaxed">{LEVERS_LEAD}</p>

      <ol className="space-y-3">
        {LEVERS.map((lever) => {
          const choice = placed[lever.id];
          const right = choice === lever.id;
          return (
            <li
              key={lever.id}
              className="panel"
            >
              <p className="font-semibold">{lever.name}</p>

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
                      "flex items-center gap-1.5 text-xs tracking-wide",
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
