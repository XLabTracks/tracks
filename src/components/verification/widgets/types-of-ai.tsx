"use client";

import { useRef, useState } from "react";
import { Minus, Plus, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AI_LEVELS,
  AI_REGIONS,
  TYPES_OF_AI_COPY as C,
} from "@/lib/verification/data/types-of-ai";
import type { VerificationWidgetProps } from "../kit/types";

/**
 * "Types of AI" — the containment onion. AI ⊃ Narrow AI ⊃ Machine Learning ⊃
 * Deep Learning ⊃ Generative AI ⊃ Large Language Model ⊃ Transformer LLMs,
 * drawn as nested circles that sink toward the bottom so each level keeps an
 * open crescent at the top for its name. The red deepens inward, so the
 * smallest circle (transformer LLMs) is the reddest.
 *
 * The geometry carries meaning: the grey margin between the outer "AI" circle
 * and "Narrow AI" is AI that is *not* narrow — theoretical or absurd, i.e. it
 * does not exist. That is why the outer ring is grey and hatched while
 * everything real (narrow AI inward) is red.
 *
 * Only level names sit on the diagram; the example systems that live at each
 * level (and the one line on why each sits there, not one ring deeper) open in
 * the side panel, so nothing has to be crammed into a thin band. Click a
 * level's crescent or name to open it; the +/− buttons and drag pan the
 * picture for a closer look at the inner rings.
 *
 * Trap: inner circles are painted last, so they sit on top and take the clicks
 * over the shared centre — each level is therefore selected from the crescent
 * where it alone is visible, never from the middle. Pan is armed only when a
 * drag begins on the background, so a press on a ring stays a select.
 */

const VB = 1000;
/** Outer "AI" circle — the whole field. */
const AI = { cx: 500, cy: 496, r: 490 };
/** Red levels sink to this baseline; bottom-tangent rings keep even top crescents. */
const RED_BOTTOM = 950;
const RED_R0 = 432;
const RED_STEP = 60;

/** One circle per level; index 0 is AI (grey), 1..6 are the red rings. */
function levelCircle(i: number) {
  if (i === 0) return { cx: AI.cx, cy: AI.cy, r: AI.r };
  const r = RED_R0 - (i - 1) * RED_STEP;
  return { cx: AI.cx, cy: RED_BOTTOM - r, r };
}

/** Wash for red level i (1..6): deepens inward so transformers are reddest. */
function redOpacity(i: number) {
  return 0.14 + (i - 1) * 0.156;
}

type View =
  | { kind: "none" }
  | { kind: "level"; i: number }
  | { kind: "example"; i: number; ei: number }
  | { kind: "region"; r: "theoretical" | "absurd" };

const MIN_Z = 1;
const MAX_Z = 4;

export function TypesOfAi(_: VerificationWidgetProps) {
  void _;
  const [view, setView] = useState<View>({ kind: "none" });
  // One transform state (zoom + pan) so a functional update always reads the
  // fresh zoom when it re-clamps pan — no stale closure, no effect.
  const [t, setT] = useState({ z: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(
    null,
  );

  const selectedLevel =
    view.kind === "level" ? view.i : view.kind === "example" ? view.i : null;

  const clamp1 = (v: number, m: number) => Math.max(-m, Math.min(m, v));
  // Relative zoom via a functional update, so rapid clicks accumulate rather
  // than all reading the same stale value; pan re-clamps against the new zoom.
  function zoomBy(delta: number) {
    setT((s) => {
      const z = Math.max(
        MIN_Z,
        Math.min(MAX_Z, Math.round((s.z + delta) * 100) / 100),
      );
      const m = ((z - 1) * VB) / 2;
      return { z, x: clamp1(s.x, m), y: clamp1(s.y, m) };
    });
  }
  function resetView() {
    setT({ z: 1, x: 0, y: 0 });
  }

  // Pan only when the gesture starts on the background (see trap above).
  function onBgPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: t.x, oy: t.y };
    setDragging(true);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scale = VB / rect.width;
    const dx = (e.clientX - drag.current.x) * scale;
    const dy = (e.clientY - drag.current.y) * scale;
    setT((s) => {
      const m = ((s.z - 1) * VB) / 2;
      return { ...s, x: clamp1(drag.current!.ox + dx, m), y: clamp1(drag.current!.oy + dy, m) };
    });
  }
  function onPointerUp() {
    drag.current = null;
    setDragging(false);
  }

  const gTransform = `translate(${t.x} ${t.y}) translate(${VB / 2} ${VB / 2}) scale(${t.z}) translate(${-VB / 2} ${-VB / 2})`;

  return (
    <div className="not-prose my-6">
      <p className="text-muted-foreground mb-3 text-xs">{C.legend}</p>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="border-border bg-card relative min-w-0 overflow-hidden rounded-xl border">
          <div className="relative aspect-square w-full">
            <svg
              viewBox={`0 0 ${VB} ${VB}`}
              className="absolute inset-0 h-full w-full touch-none select-none"
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              <defs>
                <pattern
                  id="tao-hatch"
                  width={12}
                  height={12}
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <line
                    x1={0}
                    y1={0}
                    x2={0}
                    y2={12}
                    className="stroke-muted-foreground/25"
                    strokeWidth={1.4}
                  />
                </pattern>
              </defs>

              {/* Background: arms pan, and a click clears the selection. */}
              <rect
                x={0}
                y={0}
                width={VB}
                height={VB}
                fill="transparent"
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={onBgPointerDown}
                onClick={() => setView({ kind: "none" })}
              />

              <g
                transform={gTransform}
                style={{ transition: dragging ? "none" : "transform 250ms ease-out" }}
              >
                {/* Outer field + the hatched "not real" margin it leaves. */}
                <circle cx={AI.cx} cy={AI.cy} r={AI.r} fill="var(--muted)" />
                <circle cx={AI.cx} cy={AI.cy} r={AI.r} fill="url(#tao-hatch)" />

                {AI_LEVELS.map((lvl, i) => {
                  const c = levelCircle(i);
                  const selected = selectedLevel === i;
                  if (i === 0) {
                    // The grey field is selectable from its top/side margin.
                    return (
                      <circle
                        key={lvl.key}
                        cx={c.cx}
                        cy={c.cy}
                        r={c.r}
                        fill="transparent"
                        onClick={(e) => {
                          e.stopPropagation();
                          setView({ kind: "level", i });
                        }}
                        className={cn(
                          "cursor-pointer",
                          selected
                            ? "stroke-foreground"
                            : "stroke-muted-foreground/40 hover:stroke-muted-foreground/70",
                        )}
                        style={{
                          strokeWidth: selected ? 2.5 : 1.5,
                          vectorEffect: "non-scaling-stroke",
                        }}
                      />
                    );
                  }
                  return (
                    <circle
                      key={lvl.key}
                      cx={c.cx}
                      cy={c.cy}
                      r={c.r}
                      onClick={(e) => {
                        e.stopPropagation();
                        setView({ kind: "level", i });
                      }}
                      className="cursor-pointer"
                      style={{
                        fill: "var(--primary)",
                        fillOpacity: redOpacity(i),
                        stroke: selected
                          ? "var(--foreground)"
                          : "var(--primary-foreground)",
                        strokeOpacity: selected ? 1 : 0.4,
                        strokeWidth: selected ? 2.5 : 1.25,
                        vectorEffect: "non-scaling-stroke",
                      }}
                    />
                  );
                })}

                {/* Level names, each in its own top crescent. */}
                {AI_LEVELS.map((lvl, i) => {
                  const c = levelCircle(i);
                  const inner = levelCircle(i + 1);
                  const top = c.cy - c.r;
                  // Midline of the crescent between this ring's top and the
                  // next ring's top (or this ring's own middle if innermost).
                  const ly =
                    i < AI_LEVELS.length - 1
                      ? (top + (inner.cy - inner.r)) / 2
                      : top + 34;
                  const light = i > 0 && redOpacity(i) >= 0.5;
                  return (
                    <text
                      key={lvl.key}
                      x={c.cx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      onClick={(e) => {
                        e.stopPropagation();
                        setView({ kind: "level", i });
                      }}
                      className={cn(
                        "cursor-pointer font-semibold",
                        light ? "fill-primary-foreground" : "fill-foreground",
                      )}
                      style={{
                        fontSize: 26,
                        paintOrder: "stroke",
                        stroke: light ? "rgba(0,0,0,0.28)" : "var(--card)",
                        strokeWidth: 4,
                        strokeLinejoin: "round",
                      }}
                    >
                      {lvl.name}
                    </text>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Zoom / pan controls. */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => zoomBy(-0.6)}
              disabled={t.z <= MIN_Z}
              className="border-border bg-card text-foreground hover:bg-muted shadow-soft flex size-8 items-center justify-center rounded-lg border disabled:opacity-40"
            >
              <Minus className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => zoomBy(0.6)}
              disabled={t.z >= MAX_Z}
              className="border-border bg-card text-foreground hover:bg-muted shadow-soft flex size-8 items-center justify-center rounded-lg border disabled:opacity-40"
            >
              <Plus className="size-4" aria-hidden />
            </button>
            {(t.z !== 1 || t.x !== 0 || t.y !== 0) && (
              <button
                type="button"
                aria-label="Reset view"
                onClick={resetView}
                className="border-border bg-card text-foreground hover:bg-muted shadow-soft flex size-8 items-center justify-center rounded-lg border"
              >
                <RotateCcw className="size-3.5" aria-hidden />
              </button>
            )}
          </div>
        </div>

        {/* Detail panel. */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div
            key={
              view.kind === "example"
                ? `e-${view.i}-${view.ei}`
                : view.kind === "level"
                  ? `l-${view.i}`
                  : view.kind === "region"
                    ? `r-${view.r}`
                    : "none"
            }
            className={cn(
              "border-border bg-card shadow-soft-md rounded-xl border p-4 text-sm",
              "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-2 motion-safe:duration-300",
            )}
          >
            {view.kind === "none" && (
              <>
                <p className="text-muted-foreground italic">{C.prompt}</p>
                <div className="mt-3 flex flex-col gap-2">
                  {(["theoretical", "absurd"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setView({ kind: "region", r })}
                      className="border-border hover:bg-muted rounded-lg border px-3 py-2 text-left"
                    >
                      <span className="font-medium">{AI_REGIONS[r].label}</span>
                      <span className="text-muted-foreground block text-xs">
                        In the grey margin — AI that is not narrow. Tap to read.
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {view.kind === "region" && (
              <PanelShell onClose={() => setView({ kind: "none" })} eyebrow="Beyond real AI">
                <h4 className="mt-1 text-base font-semibold">
                  {AI_REGIONS[view.r].label}
                </h4>
                <p className="mt-2">{AI_REGIONS[view.r].body}</p>
              </PanelShell>
            )}

            {view.kind === "level" && (
              <PanelShell onClose={() => setView({ kind: "none" })} eyebrow="Level">
                <h4 className="mt-1 text-base font-semibold">
                  {AI_LEVELS[view.i].name}
                </h4>
                <p className="mt-2">{AI_LEVELS[view.i].blurb}</p>
                {AI_LEVELS[view.i].examples.length > 0 && (
                  <div className="mt-3">
                    <p className="text-muted-foreground mb-2 text-xs">
                      Here, but not one level deeper:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {AI_LEVELS[view.i].examples.map((ex, ei) => (
                        <button
                          key={ex.name}
                          type="button"
                          onClick={() =>
                            setView({ kind: "example", i: view.i, ei })
                          }
                          className="border-border hover:bg-muted rounded-md border px-2.5 py-1 text-xs font-medium"
                        >
                          {ex.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </PanelShell>
            )}

            {view.kind === "example" && (
              <PanelShell
                onClose={() => setView({ kind: "level", i: view.i })}
                closeLabel="Back to level"
                eyebrow={AI_LEVELS[view.i].name}
              >
                <h4 className="mt-1 text-base font-semibold">
                  {AI_LEVELS[view.i].examples[view.ei].name}
                </h4>
                <p className="mt-2">{AI_LEVELS[view.i].examples[view.ei].what}</p>
                <p className="border-border mt-3 border-t pt-2">
                  <span className="text-muted-foreground mr-1 text-[11px] tracking-[0.08em] uppercase">
                    Why here
                  </span>
                  {AI_LEVELS[view.i].examples[view.ei].why}
                </p>
              </PanelShell>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelShell({
  eyebrow,
  onClose,
  closeLabel = "Close",
  children,
}: {
  eyebrow: string;
  onClose: () => void;
  closeLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring float-right -mt-1 -mr-1 rounded p-1 focus-visible:ring-2 focus-visible:outline-none"
      >
        <X className="size-4" aria-hidden />
      </button>
      <p className="text-muted-foreground text-[11px] tracking-[0.12em] uppercase">
        {eyebrow}
      </p>
      {children}
    </>
  );
}
