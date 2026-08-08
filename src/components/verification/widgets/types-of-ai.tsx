"use client";

import { useMemo, useState } from "react";
import {
  hierarchy,
  pack,
  type HierarchyCircularNode,
} from "d3-hierarchy";
import { RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AI_LEVELS,
  AI_REGIONS,
  TYPES_OF_AI_COPY as C,
} from "@/lib/verification/data/types-of-ai";
import type { VerificationWidgetProps } from "../kit/types";

/**
 * "Types of AI" — the nested-containment picture, laid out by D3's circle
 * packing (d3-hierarchy `pack`) rather than hand-placed coordinates. AI ⊃
 * Narrow AI ⊃ ML ⊃ Deep Learning ⊃ Generative AI ⊃ LLM ⊃ Transformer LLMs;
 * each category is a circle holding the next category plus its own example
 * systems as leaf circles.
 *
 * Interaction is the standard zoomable-circle-packing one: click a category to
 * zoom into it (its children's labels appear, so the view is never crowded),
 * click a leaf for what-it-is / why-it's-there, click the focused circle to
 * zoom back out. The wash reddens with depth, so the innermost transformer
 * circle is the reddest. Only d3-hierarchy's layout math is borrowed — the
 * SVG, palette and interaction are the course's own.
 */

const SIZE = 920;

type Datum = {
  name: string;
  key?: string;
  li?: number;
  ei?: number;
  value?: number;
  children?: Datum[];
};

function buildData(): Datum {
  function node(i: number): Datum {
    const lvl = AI_LEVELS[i];
    const exs: Datum[] = lvl.examples.map((ex, ei) => ({
      name: ex.name,
      li: i,
      ei,
      value: 1,
    }));
    const inner = i + 1 < AI_LEVELS.length ? [node(i + 1)] : [];
    const children = [...exs, ...inner];
    return children.length
      ? { name: lvl.name, key: lvl.key, children }
      : { name: lvl.name, key: lvl.key, value: 1 };
  }
  return node(0);
}

type Node = HierarchyCircularNode<Datum>;
type Sel = { li: number; ei: number } | { region: "theoretical" | "absurd" } | null;

function isLeaf(n: Node) {
  return n.data.li !== undefined;
}

export function TypesOfAi(_: VerificationWidgetProps) {
  void _;
  const root = useMemo(
    () =>
      pack<Datum>()
        .size([SIZE, SIZE])
        .padding(8)(
        hierarchy<Datum>(buildData())
          .sum((d) => d.value ?? 0)
          .sort((a, b) => (b.value ?? 0) - (a.value ?? 0)),
      ),
    [],
  );
  const [focus, setFocus] = useState<Node>(root);
  const [sel, setSel] = useState<Sel>(null);

  const margin = 1.08;
  const k = SIZE / (focus.r * 2 * margin);
  const tx = SIZE / 2 - focus.x * k;
  const ty = SIZE / 2 - focus.y * k;
  const nodes = root.descendants();

  function onCircle(n: Node) {
    if (isLeaf(n)) {
      setSel({ li: n.data.li!, ei: n.data.ei! });
      return;
    }
    if (n === focus) setFocus((n.parent as Node) ?? root);
    else setFocus(n);
  }

  return (
    <div className="not-prose my-6">
      <p className="text-muted-foreground mb-3 text-xs">
        {C.legend} Click a ring to zoom in; click it again to zoom out.
      </p>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="border-border bg-card relative min-w-0 overflow-hidden rounded-xl border">
          <div className="relative aspect-square w-full">
            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="absolute inset-0 h-full w-full"
            >
              {/* click-away target: zoom out one level */}
              <rect
                x={0}
                y={0}
                width={SIZE}
                height={SIZE}
                fill="transparent"
                onClick={() => setFocus((focus.parent as Node) ?? root)}
              />
              <g
                style={{
                  transform: `translate(${tx}px, ${ty}px) scale(${k})`,
                  transition: "transform 600ms cubic-bezier(0.22,0.61,0.36,1)",
                }}
              >
                {nodes.map((n, i) => {
                  const leaf = isLeaf(n);
                  const active =
                    leaf &&
                    sel &&
                    "li" in sel &&
                    sel.li === n.data.li &&
                    sel.ei === n.data.ei;
                  return (
                    <circle
                      key={i}
                      cx={n.x}
                      cy={n.y}
                      r={n.r}
                      onClick={(e) => {
                        e.stopPropagation();
                        onCircle(n);
                      }}
                      className={cn(
                        "cursor-pointer transition-[stroke]",
                        leaf
                          ? "fill-card stroke-border hover:stroke-foreground"
                          : "stroke-primary-foreground/35 hover:stroke-primary-foreground/70",
                        active && "stroke-foreground",
                      )}
                      style={{
                        fill: leaf
                          ? "var(--card)"
                          : n.depth === 0
                            ? "var(--muted)"
                            : "var(--primary)",
                        fillOpacity: leaf
                          ? 1
                          : n.depth === 0
                            ? 1
                            : Math.min(0.85, 0.08 + n.depth * 0.13),
                        strokeWidth: 1,
                        vectorEffect: "non-scaling-stroke",
                      }}
                    />
                  );
                })}
              </g>

              {/* Labels sit above the circles, constant size. Each one shows
                  once its circle is big enough (and, for a leaf, once its name
                  fits), so the overview reads as the category structure and
                  zooming reveals the systems inside. */}
              {nodes.map((n, i) => {
                const leaf = isLeaf(n);
                const sx = n.x * k + tx;
                const sy = n.y * k + ty;
                const sr = n.r * k;
                if (leaf) {
                  const fs = Math.min(14, Math.max(9, sr * 0.44));
                  const fits = n.data.name.length * fs * 0.5 < sr * 1.85;
                  if (sr < 15 || !fits) return null;
                  return (
                    <text
                      key={i}
                      x={sx}
                      y={sy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCircle(n);
                      }}
                      className="fill-foreground cursor-pointer font-medium"
                      style={{ fontSize: fs }}
                    >
                      {n.data.name}
                    </text>
                  );
                }
                // Only the focused ring and its direct child categories are
                // labelled, so category names never stack; zooming in reveals
                // the next one. Leaf-example labels (above) always show when
                // they fit.
                if (n !== focus && n.parent !== focus) return null;
                if (sr < 22) return null;
                const fs = Math.min(20, Math.max(11, sr * 0.14));
                // Sit the label in the ring's open crescent — the side away
                // from the inner category circle — so nested categories don't
                // stack their labels on top of each other.
                const inner = n.children?.find((c) => c.data.li === undefined);
                let lx = n.x;
                let ly = n.y - n.r * 0.82;
                if (inner) {
                  const vx = n.x - inner.x;
                  const vy = n.y - inner.y;
                  const m = Math.hypot(vx, vy);
                  if (m > n.r * 0.12) {
                    lx = n.x + (vx / m) * n.r * 0.7;
                    ly = n.y + (vy / m) * n.r * 0.7;
                  }
                }
                return (
                  <text
                    key={i}
                    x={lx * k + tx}
                    y={ly * k + ty}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCircle(n);
                    }}
                    className={cn(
                      "cursor-pointer font-semibold",
                      n.depth === 0 ? "fill-foreground" : "fill-primary-foreground",
                    )}
                    style={{
                      fontSize: fs,
                      paintOrder: "stroke",
                      stroke: n.depth === 0 ? "transparent" : "rgba(0,0,0,0.3)",
                      strokeWidth: n.depth === 0 ? 0 : 3,
                    }}
                  >
                    {n.data.name}
                  </text>
                );
              })}
            </svg>
          </div>

          {focus !== root && (
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => setFocus((focus.parent as Node) ?? root)}
              className="border-border bg-card text-foreground hover:bg-muted shadow-soft absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium"
            >
              <RotateCcw className="size-3.5" aria-hidden /> Out
            </button>
          )}
        </div>

        {/* Detail panel. */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div
            key={sel && "li" in sel ? `e-${sel.li}-${sel.ei}` : sel ? `r-${sel.region}` : "none"}
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
                      onClick={() => setSel({ region: key })}
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
                {"li" in sel ? (
                  <ExampleDetail
                    ex={AI_LEVELS[sel.li].examples[sel.ei]}
                    levelName={AI_LEVELS[sel.li].name}
                  />
                ) : (
                  <div>
                    <p className="text-muted-foreground font-mono text-[11px] tracking-[0.12em] uppercase">
                      Beyond real AI
                    </p>
                    <h4 className="mt-1 text-base font-semibold">
                      {AI_REGIONS[sel.region].label}
                    </h4>
                    <p className="mt-2">{AI_REGIONS[sel.region].body}</p>
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
