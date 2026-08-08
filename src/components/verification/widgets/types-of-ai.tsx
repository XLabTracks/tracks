"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AI_LEVELS,
  AI_REGIONS,
  TYPES_OF_AI_COPY as C,
} from "@/lib/verification/data/types-of-ai";
import type { VerificationWidgetProps } from "../kit/types";

/**
 * "Types of AI" — the nested-containment picture from the outline, rebuilt in
 * the course palette. AI ⊃ Narrow AI ⊃ ML ⊃ Deep Learning ⊃ Generative AI ⊃
 * LLM ⊃ Transformer LLMs; every named system is a button that opens what it is
 * and why it sits at that ring and not the next one in. All content is data
 * (types-of-ai.ts); this file is geometry and interaction only.
 *
 * Geometry: seven circles sharing a tangent point at the bottom, so each inner
 * ring opens a horizontal shelf at its top for that level's label and chips.
 * The stage is a fixed 600-wide box that scrolls sideways on a narrow screen
 * rather than shrinking its labels into soup — the chips carry their own card
 * background so they stay legible over any ring tint.
 */

const CX = 300;
const BOTTOM = 590;
// Outermost first — index matches AI_LEVELS. Equal radius gaps (37) so every
// ring opens the same-height shelf at its top for a label plus a chip row.
const R = [285, 248, 211, 174, 137, 100, 63];
const LABEL_Y = [38, 112, 186, 260, 334, 408, 482];
// Chip cluster per level (null = the outer "AI" ring, which is region-only).
// `y` is the cluster's TOP, set just under the label so a multi-row cluster
// grows downward into its own ring and never rides up over the label.
const CHIP: ({ y: number; w: number } | null)[] = [
  null,
  { y: 128, w: 300 },
  { y: 202, w: 264 },
  { y: 276, w: 226 },
  { y: 350, w: 202 },
  { y: 424, w: 150 },
  { y: 500, w: 134 },
];
// Ring fills: the theoretical outer ring reads grey (not real yet); narrow AI
// is a clean white ground; each deeper ring adds a light navy wash.
const RING_FILL = [
  { fill: "var(--muted)", opacity: 1 },
  { fill: "var(--card)", opacity: 1 },
  { fill: "var(--primary)", opacity: 0.05 },
  { fill: "var(--primary)", opacity: 0.05 },
  { fill: "var(--primary)", opacity: 0.05 },
  { fill: "var(--primary)", opacity: 0.05 },
  { fill: "var(--primary)", opacity: 0.05 },
];

type Sel =
  | { kind: "ex"; li: number; ei: number }
  | { kind: "level"; li: number }
  | { kind: "region"; key: "theoretical" | "absurd" }
  | null;

export function TypesOfAi(_: VerificationWidgetProps) {
  void _;
  const [sel, setSel] = useState<Sel>(null);
  const selKey =
    sel === null
      ? "none"
      : sel.kind === "ex"
        ? `e-${sel.li}-${sel.ei}`
        : sel.kind === "level"
          ? `l-${sel.li}`
          : `r-${sel.key}`;

  return (
    <div className="not-prose my-6">
      <p className="text-muted-foreground mb-3 text-xs">{C.legend}</p>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        {/* Diagram: fixed stage, scrolls sideways when the column is narrow. */}
        <div className="min-w-0 overflow-x-auto">
          <div className="relative mx-auto h-[600px] w-[600px]">
            <svg
              viewBox="0 0 600 600"
              className="absolute inset-0 h-full w-full"
              aria-hidden
            >
              {R.map((r, i) => (
                <circle
                  key={i}
                  cx={CX}
                  cy={BOTTOM - r}
                  r={r}
                  fill={RING_FILL[i].fill}
                  fillOpacity={RING_FILL[i].opacity}
                  className="stroke-primary/25"
                  strokeWidth={1}
                />
              ))}
            </svg>

            {/* Level labels — clickable for the category's definition. */}
            {AI_LEVELS.map((lvl, i) => (
              <button
                key={lvl.key}
                type="button"
                onClick={() => setSel({ kind: "level", li: i })}
                style={{ top: LABEL_Y[i] }}
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded px-1.5 text-sm font-semibold whitespace-nowrap transition-colors",
                  "text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  sel?.kind === "level" && sel.li === i && "underline",
                )}
              >
                {lvl.name}
              </button>
            ))}

            {/* Example chips per level. */}
            {AI_LEVELS.map((lvl, li) => {
              const c = CHIP[li];
              if (!c) return null;
              return (
                <div
                  key={lvl.key}
                  style={{ top: c.y, maxWidth: c.w }}
                  className="absolute left-1/2 flex -translate-x-1/2 flex-wrap justify-center gap-1"
                >
                  {lvl.examples.map((ex, ei) => {
                    const active =
                      sel?.kind === "ex" && sel.li === li && sel.ei === ei;
                    return (
                      <button
                        key={ex.name}
                        type="button"
                        onClick={() => setSel({ kind: "ex", li, ei })}
                        className={cn(
                          "border-border bg-card text-foreground shadow-soft rounded-full border px-2 py-0.5 text-xs whitespace-nowrap transition-shadow",
                          "hover:ring-2 hover:ring-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                          active && "ring-2 ring-foreground",
                        )}
                      >
                        {ex.name}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail panel — floats in on each new selection. */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div
            key={selKey}
            className={cn(
              "border-border bg-card shadow-soft-md rounded-xl border p-4 text-sm",
              "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-2 motion-safe:duration-300",
            )}
          >
            {sel === null ? (
              <>
                <p className="text-muted-foreground italic">{C.prompt}</p>
                <div className="mt-3 flex flex-col gap-2">
                  {(["theoretical", "absurd"] as const).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSel({ kind: "region", key })}
                      className="border-border hover:bg-muted rounded-lg border px-3 py-2 text-left"
                    >
                      <span className="font-medium">{AI_REGIONS[key].label}</span>
                      <span className="text-muted-foreground block text-xs">
                        The two regions beyond real AI — tap to read.
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setSel(null)}
                  aria-label="Close detail"
                  className="text-muted-foreground hover:text-foreground float-right -mt-1 -mr-1 rounded p-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <X className="size-4" aria-hidden />
                </button>
                {sel.kind === "ex" ? (
                  <ExampleDetail
                    ex={AI_LEVELS[sel.li].examples[sel.ei]}
                    levelName={AI_LEVELS[sel.li].name}
                  />
                ) : sel.kind === "level" ? (
                  <div>
                    <p className="text-muted-foreground font-mono text-[11px] tracking-[0.12em] uppercase">
                      Level
                    </p>
                    <h4 className="mt-1 text-base font-semibold">
                      {AI_LEVELS[sel.li].name}
                    </h4>
                    <p className="mt-2">{AI_LEVELS[sel.li].blurb}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-muted-foreground font-mono text-[11px] tracking-[0.12em] uppercase">
                      Beyond real AI
                    </p>
                    <h4 className="mt-1 text-base font-semibold">
                      {AI_REGIONS[sel.key].label}
                    </h4>
                    <p className="mt-2">{AI_REGIONS[sel.key].body}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExampleDetail({
  ex,
  levelName,
}: {
  ex: { name: string; what: string; why: string };
  levelName: string;
}) {
  return (
    <div>
      <p className="text-muted-foreground font-mono text-[11px] tracking-[0.12em] uppercase">
        {levelName}
      </p>
      <h4 className="mt-1 text-base font-semibold">{ex.name}</h4>
      <p className="mt-2">{ex.what}</p>
      <p className="border-border mt-3 border-t pt-2">
        <span className="text-muted-foreground mr-1 font-mono text-[11px] tracking-[0.1em] uppercase">
          Why here
        </span>
        {ex.why}
      </p>
    </div>
  );
}
