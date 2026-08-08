"use client";

import { useMemo, useRef, useState } from "react";
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
 * drawn as nested circles that sink to the bottom so each level keeps an open
 * crescent at the top for its name, with that level's example systems sitting
 * as tappable pills inside its own band — the region that is "this level but
 * not the next one in". The red deepens inward, so the innermost transformer
 * circle is the reddest.
 *
 * The grey hatched margin between "AI" and "Narrow AI" is AI that is not
 * narrow — theoretical or absurd, i.e. it does not exist — so the geometry
 * itself carries that meaning.
 *
 * Layout is deterministic, not measured: `layout()` places each name in its
 * crescent and greedily packs its examples into rows sized to the band's chord
 * at that height, so nothing overflows and nothing overlaps the ring below.
 * Tapping a pill opens its what/why in the side panel; +/− and drag zoom and
 * pan for a closer look at the inner rings.
 *
 * Trap: inner circles paint last and take clicks over the shared centre, so a
 * ring is selected from its crescent, never the middle; pan arms only when a
 * drag starts on the background, so a press on a pill stays a select.
 */

const VBW = 1120;
const VBH = 1210;
const AI = { cx: 560, cy: 585, r: 560 };
const RED_BOTTOM = 1170;
const RED_R0 = 490;
const RED_STEP = 70;

/** i=0 is the grey AI field; 1..6 are the red rings, innermost last. */
function levelCircle(i: number) {
  if (i === 0) return { cx: AI.cx, cy: AI.cy, r: AI.r };
  const r = RED_R0 - (i - 1) * RED_STEP;
  return { cx: AI.cx, cy: RED_BOTTOM - r, r };
}

function redOpacity(i: number) {
  return 0.12 + (i - 1) * 0.15;
}

// Rough label width in SVG units (no DOM measurement at render).
const EX_FS = 20;
const NAME_FS = 32;
const PILL_H = 30;
const estPill = (name: string) => name.length * EX_FS * 0.56 + 22;

type PlacedPill = { li: number; ei: number; name: string; x: number; y: number; w: number };
type PlacedName = { name: string; x: number; y: number; light: boolean };

function packRows(names: { li: number; ei: number; name: string }[], maxW: number) {
  const rows: { li: number; ei: number; name: string; w: number }[][] = [[]];
  let w = 0;
  for (const it of names) {
    const iw = estPill(it.name);
    const row = rows[rows.length - 1];
    if (row.length && w + 10 + iw > maxW) {
      rows.push([]);
      w = 0;
    }
    rows[rows.length - 1].push({ ...it, w: iw });
    w += (row.length ? 10 : 0) + iw;
  }
  return rows;
}

function layout(): { names: PlacedName[]; pills: PlacedPill[] } {
  const names: PlacedName[] = [];
  const pills: PlacedPill[] = [];
  for (let i = 0; i < AI_LEVELS.length; i++) {
    const c = levelCircle(i);
    const top = c.cy - c.r;
    names.push({
      name: AI_LEVELS[i].name,
      x: c.cx,
      y: top + 34,
      light: i > 0 && redOpacity(i) >= 0.45,
    });
    const exs = AI_LEVELS[i].examples.map((ex, ei) => ({
      li: i,
      ei,
      name: ex.name,
    }));
    if (exs.length === 0) continue;

    const isDisk = i === AI_LEVELS.length - 1;
    // Row width available in this band: the chord of this circle a little
    // below the name (above the next ring, so the full chord is free).
    const probeY = isDisk ? c.cy : top + 66;
    const dy = probeY - c.cy;
    const chord = 2 * Math.sqrt(Math.max(0, c.r * c.r - dy * dy));
    const maxW = chord * (isDisk ? 0.94 : 0.9);
    const rows = packRows(exs, maxW);
    const rowY0 = isDisk
      ? c.cy - ((rows.length - 1) * (PILL_H + 6)) / 2
      : top + 74;
    rows.forEach((row, ri) => {
      const total = row.reduce((s, it) => s + it.w, 0) + (row.length - 1) * 10;
      let x = c.cx - total / 2;
      const y = rowY0 + ri * (PILL_H + 6);
      for (const it of row) {
        pills.push({ li: it.li, ei: it.ei, name: it.name, x: x + it.w / 2, y, w: it.w });
        x += it.w + 10;
      }
    });
  }
  return { names, pills };
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
  const { names, pills } = useMemo(() => layout(), []);
  const [view, setView] = useState<View>({ kind: "none" });
  const [t, setT] = useState({ z: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const selLevel = view.kind === "level" ? view.i : view.kind === "example" ? view.i : null;
  const selPill = view.kind === "example" ? view : null;

  const clamp1 = (v: number, m: number) => Math.max(-m, Math.min(m, v));
  function zoomBy(delta: number) {
    setT((s) => {
      const z = Math.max(MIN_Z, Math.min(MAX_Z, Math.round((s.z + delta) * 100) / 100));
      const mx = ((z - 1) * VBW) / 2;
      const my = ((z - 1) * VBH) / 2;
      return { z, x: clamp1(s.x, mx), y: clamp1(s.y, my) };
    });
  }
  function resetView() {
    setT({ z: 1, x: 0, y: 0 });
  }
  function onBgPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: t.x, oy: t.y };
    setDragging(true);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const s = VBW / rect.width;
    const dx = (e.clientX - drag.current.x) * s;
    const dy = (e.clientY - drag.current.y) * s;
    setT((st) => {
      const mx = ((st.z - 1) * VBW) / 2;
      const my = ((st.z - 1) * VBH) / 2;
      return { ...st, x: clamp1(drag.current!.ox + dx, mx), y: clamp1(drag.current!.oy + dy, my) };
    });
  }
  function onPointerUp() {
    drag.current = null;
    setDragging(false);
  }

  const gTransform = `translate(${t.x}px, ${t.y}px) translate(${VBW / 2}px, ${VBH / 2}px) scale(${t.z}) translate(${-VBW / 2}px, ${-VBH / 2}px)`;

  return (
    <div className="not-prose my-6">
      <p className="text-muted-foreground mb-3 text-xs">{C.legend}</p>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="border-border bg-card relative min-w-0 overflow-hidden rounded-xl border">
          <div className="relative w-full" style={{ aspectRatio: `${VBW} / ${VBH}` }}>
            <svg
              viewBox={`0 0 ${VBW} ${VBH}`}
              className="absolute inset-0 h-full w-full touch-none select-none"
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              <defs>
                <pattern id="tao-hatch" width={13} height={13} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1={0} y1={0} x2={0} y2={13} className="stroke-muted-foreground/25" strokeWidth={1.4} />
                </pattern>
              </defs>

              <rect
                x={0}
                y={0}
                width={VBW}
                height={VBH}
                fill="transparent"
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={onBgPointerDown}
                onClick={() => setView({ kind: "none" })}
              />

              <g
                style={{
                  transform: gTransform,
                  transformOrigin: "0 0",
                  transition: dragging ? "none" : "transform 250ms ease-out",
                }}
              >
                <g>
                  <circle cx={AI.cx} cy={AI.cy} r={AI.r} fill="var(--muted)" />
                  <circle cx={AI.cx} cy={AI.cy} r={AI.r} fill="url(#tao-hatch)" />

                  {AI_LEVELS.map((lvl, i) => {
                    const c = levelCircle(i);
                    const selected = selLevel === i;
                    if (i === 0) {
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
                            selected ? "stroke-foreground" : "stroke-muted-foreground/40 hover:stroke-muted-foreground/70",
                          )}
                          style={{ strokeWidth: selected ? 3 : 1.5, vectorEffect: "non-scaling-stroke" }}
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
                          stroke: selected ? "var(--foreground)" : "var(--primary-foreground)",
                          strokeOpacity: selected ? 1 : 0.4,
                          strokeWidth: selected ? 3 : 1.25,
                          vectorEffect: "non-scaling-stroke",
                        }}
                      />
                    );
                  })}

                  {/* level names */}
                  {names.map((n) => (
                    <text
                      key={n.name}
                      x={n.x}
                      y={n.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      onClick={(e) => {
                        e.stopPropagation();
                        const i = AI_LEVELS.findIndex((l) => l.name === n.name);
                        setView({ kind: "level", i });
                      }}
                      className={cn("cursor-pointer font-semibold", n.light ? "fill-primary-foreground" : "fill-foreground")}
                      style={{
                        fontSize: NAME_FS,
                        paintOrder: "stroke",
                        stroke: n.light ? "rgba(0,0,0,0.30)" : "var(--card)",
                        strokeWidth: 5,
                        strokeLinejoin: "round",
                      }}
                    >
                      {n.name}
                    </text>
                  ))}

                  {/* example pills, sitting in their own band */}
                  {pills.map((p) => {
                    const active = selPill && selPill.i === p.li && selPill.ei === p.ei;
                    return (
                      <g
                        key={`${p.li}-${p.ei}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setView({ kind: "example", i: p.li, ei: p.ei });
                        }}
                        className="cursor-pointer"
                      >
                        <rect
                          x={p.x - p.w / 2}
                          y={p.y - PILL_H / 2}
                          width={p.w}
                          height={PILL_H}
                          rx={8}
                          className={cn(
                            "fill-card transition-[stroke]",
                            active ? "stroke-foreground" : "stroke-border hover:stroke-foreground",
                          )}
                          style={{ strokeWidth: active ? 2 : 1.25, vectorEffect: "non-scaling-stroke" }}
                        />
                        <text
                          x={p.x}
                          y={p.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-foreground"
                          style={{ fontSize: EX_FS }}
                        >
                          {p.name}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </g>
            </svg>
          </div>

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
                <h4 className="mt-1 text-base font-semibold">{AI_REGIONS[view.r].label}</h4>
                <p className="mt-2">{AI_REGIONS[view.r].body}</p>
              </PanelShell>
            )}

            {view.kind === "level" && (
              <PanelShell onClose={() => setView({ kind: "none" })} eyebrow="Level">
                <h4 className="mt-1 text-base font-semibold">{AI_LEVELS[view.i].name}</h4>
                <p className="mt-2">{AI_LEVELS[view.i].blurb}</p>
                {AI_LEVELS[view.i].examples.length > 0 && (
                  <p className="text-muted-foreground mt-2 text-xs">
                    Tap a system in this ring to see why it sits here, not one ring deeper.
                  </p>
                )}
              </PanelShell>
            )}

            {view.kind === "example" && (
              <PanelShell onClose={() => setView({ kind: "level", i: view.i })} closeLabel="Back to level" eyebrow={AI_LEVELS[view.i].name}>
                <h4 className="mt-1 text-base font-semibold">{AI_LEVELS[view.i].examples[view.ei].name}</h4>
                <p className="mt-2">{AI_LEVELS[view.i].examples[view.ei].what}</p>
                <p className="border-border mt-3 border-t pt-2">
                  <span className="text-muted-foreground mr-1 text-[11px] tracking-[0.08em] uppercase">Why here</span>
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
      <p className="text-muted-foreground text-[11px] tracking-[0.12em] uppercase">{eyebrow}</p>
      {children}
    </>
  );
}
