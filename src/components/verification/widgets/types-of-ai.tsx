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

const VBW = 1180;
const VBH = 1240;
const AI = { cx: 590, cy: 600, r: 585 };
const RED_BOTTOM = 1160;
const RED_R0 = 505;
const RED_STEP = 73;

function levelCircle(i: number) {
  if (i === 0) return { cx: AI.cx, cy: AI.cy, r: AI.r };
  const r = RED_R0 - (i - 1) * RED_STEP;
  return { cx: AI.cx, cy: RED_BOTTOM - r, r };
}

function redOpacity(i: number) {
  return 0.12 + (i - 1) * 0.15;
}

const EX_FS = 21;
const NAME_FS = 34;
const NAME_FLOOR = 21;
const PILL_H = 30;
const LINE_H = 1.08;
const EX_GAP = 14;
const CHAR_W = 0.56;
const ASCENT = 0.74;
const nameAsc = (fs: number) => fs * (ASCENT - LINE_H / 2);
const PAD_NAME = 15;
const PAD_EX = 13;
const PAD_TOP = 8;
const PAD_BOT = 12;
const GAP_NE = 10;
const estPill = (name: string) => name.length * EX_FS * CHAR_W + 8;

type PlacedPill = { li: number; ei: number; name: string; x: number; y: number; w: number };
type PlacedName = { i: number; lines: string[]; fs: number; x: number; yTop: number; light: boolean };

function balancedSplit(name: string): string[] | null {
  const words = name.split(" ");
  if (words.length < 2) return null;
  let best: string[] | null = null;
  let bestDiff = Infinity;
  for (let k = 1; k < words.length; k++) {
    const a = words.slice(0, k).join(" ");
    const b = words.slice(k).join(" ");
    if (Math.abs(a.length - b.length) <= bestDiff) {
      bestDiff = Math.abs(a.length - b.length);
      best = [a, b];
    }
  }
  return best;
}

function bandWidth(c: { cy: number; r: number }, y: number, pad: number) {
  const rr = c.r - pad;
  const v = rr * rr - (y - c.cy) * (y - c.cy);
  return v > 0 ? 2 * Math.sqrt(v) : 0;
}

function highestTop(c: { cy: number; r: number }, hw: number, pad: number) {
  const rr = c.r - pad;
  const v = rr * rr - hw * hw;
  return v > 0 ? c.cy - Math.sqrt(v) : null;
}

function packRows(names: { li: number; ei: number; name: string }[], maxW: number) {
  const rows: { li: number; ei: number; name: string; w: number }[][] = [[]];
  let w = 0;
  for (const it of names) {
    const iw = estPill(it.name);
    const row = rows[rows.length - 1];
    if (row.length && w + EX_GAP + iw > maxW) {
      rows.push([]);
      w = 0;
    }
    rows[rows.length - 1].push({ ...it, w: iw });
    w += (row.length ? EX_GAP : 0) + iw;
  }
  return rows;
}

function topEdge(i: number) {
  const c = levelCircle(i);
  return c.cy - c.r;
}

type Placed = {
  lines: string[];
  fs: number;
  nameTop: number;
  rows: ReturnType<typeof packRows>;
  exTop: number;
};

function fitCrescent(
  name: string,
  c: { cy: number; r: number },
  spanTop: number,
  spanBot: number,
  exs: { li: number; ei: number; name: string }[],
): Placed {
  const zoneBot = spanBot - PAD_BOT;
  for (let fs = NAME_FS; fs >= NAME_FLOOR; fs -= 1) {
    for (const lines of [[name], balancedSplit(name) ?? [name]]) {
      const nameW = Math.max(...lines.map((l) => l.length * fs * CHAR_W));
      const top = highestTop(c, nameW / 2, PAD_NAME);
      if (top === null) continue;
      const nameTop = Math.max(spanTop + PAD_TOP, top + nameAsc(fs));
      const nameH = lines.length * fs * LINE_H;
      const zoneTop = nameTop + nameH + (exs.length ? GAP_NE : 0);
      if (!exs.length) return { lines, fs, nameTop, rows: [], exTop: zoneTop };
      const maxRows = Math.floor((zoneBot - zoneTop) / PILL_H);
      for (let r = 1; r <= maxRows; r += 1) {
        const rowTop = zoneBot - r * PILL_H + PILL_H / 2 - ASCENT * EX_FS;
        const packed = packRows(exs, bandWidth(c, rowTop, PAD_EX));
        if (packed.length <= r) {
          return { lines, fs, nameTop, rows: packed, exTop: zoneBot - packed.length * PILL_H };
        }
      }
    }
  }
  const lines = balancedSplit(name) ?? [name];
  const hw = (Math.max(...lines.map((l) => l.length)) * NAME_FLOOR * CHAR_W) / 2;
  const nameTop = Math.max(
    spanTop + PAD_TOP,
    (highestTop(c, hw, PAD_NAME) ?? spanTop + PAD_TOP) + nameAsc(NAME_FLOOR),
  );
  const nameH = lines.length * NAME_FLOOR * LINE_H;
  const exTop = nameTop + nameH + (exs.length ? GAP_NE : 0);
  const rows = exs.length ? packRows(exs, bandWidth(c, exTop + (PILL_H - EX_FS) / 2, PAD_EX)) : [];
  return { lines, fs: NAME_FLOOR, nameTop, rows, exTop };
}

function fitDisk(
  name: string,
  c: { cy: number; r: number },
  exs: { li: number; ei: number; name: string }[],
): Placed {
  const spanBot = c.cy + c.r - PAD_BOT;
  for (let fs = NAME_FS; fs >= NAME_FLOOR; fs -= 1) {
    for (const lines of [[name], balancedSplit(name) ?? [name]]) {
      const nameW = Math.max(...lines.map((l) => l.length * fs * CHAR_W));
      const nameH = lines.length * fs * LINE_H;
      const rows = exs.length
        ? packRows(exs, bandWidth(c, c.cy + nameH / 2 + GAP_NE, PAD_EX))
        : [];
      const blockH = nameH + (rows.length ? GAP_NE : 0) + rows.length * PILL_H;
      const nameTop = c.cy - blockH / 2;
      if (bandWidth(c, nameTop - nameAsc(fs), PAD_NAME) >= nameW && nameTop + blockH <= spanBot) {
        return { lines, fs, nameTop, rows, exTop: nameTop + nameH + (rows.length ? GAP_NE : 0) };
      }
    }
  }
  const lines = balancedSplit(name) ?? [name];
  const nameH = lines.length * NAME_FLOOR * LINE_H;
  const rows = exs.length ? packRows(exs, bandWidth(c, c.cy + 20, PAD_EX)) : [];
  const blockH = nameH + (rows.length ? GAP_NE : 0) + rows.length * PILL_H;
  const nameTop = c.cy - blockH / 2;
  return { lines, fs: NAME_FLOOR, nameTop, rows, exTop: nameTop + nameH + (rows.length ? GAP_NE : 0) };
}

function layout(): { names: PlacedName[]; pills: PlacedPill[] } {
  const names: PlacedName[] = [];
  const pills: PlacedPill[] = [];
  for (let i = 0; i < AI_LEVELS.length; i++) {
    const c = levelCircle(i);
    const isDisk = i === AI_LEVELS.length - 1;
    const exs = AI_LEVELS[i].examples.map((ex, ei) => ({ li: i, ei, name: ex.name }));

    if (i === 0) {
      names.push({
        i,
        lines: [AI_LEVELS[0].name],
        fs: NAME_FS,
        x: c.cx,
        yTop: topEdge(0) + 26,
        light: false,
      });
      continue;
    }

    const placed = isDisk
      ? fitDisk(AI_LEVELS[i].name, c, exs)
      : fitCrescent(AI_LEVELS[i].name, c, topEdge(i), topEdge(i + 1), exs);

    names.push({
      i,
      lines: placed.lines,
      fs: placed.fs,
      x: c.cx,
      yTop: placed.nameTop,
      light: redOpacity(i) >= 0.45,
    });

    placed.rows.forEach((row, ri) => {
      const total = row.reduce((s, it) => s + it.w, 0) + (row.length - 1) * EX_GAP;
      let x = c.cx - total / 2;
      const y = placed.exTop + ri * PILL_H + PILL_H / 2;
      for (const it of row) {
        pills.push({ li: it.li, ei: it.ei, name: it.name, x: x + it.w / 2, y, w: it.w });
        x += it.w + EX_GAP;
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

                  {names.map((n) => (
                    <text
                      key={n.i}
                      textAnchor="middle"
                      onClick={(e) => {
                        e.stopPropagation();
                        setView({ kind: "level", i: n.i });
                      }}
                      className={cn("cursor-pointer font-semibold", n.light ? "fill-primary-foreground" : "fill-foreground")}
                      style={{
                        fontSize: n.fs,
                        paintOrder: "stroke",
                        stroke: n.light ? "rgba(0,0,0,0.30)" : "var(--card)",
                        strokeWidth: 5,
                        strokeLinejoin: "round",
                      }}
                    >
                      {n.lines.map((ln, li) => (
                        <tspan
                          key={li}
                          x={n.x}
                          y={n.yTop + (li + 0.5) * n.fs * LINE_H}
                          dominantBaseline="middle"
                        >
                          {ln}
                        </tspan>
                      ))}
                    </text>
                  ))}

                  {pills.map((p) => {
                    const active = selPill && selPill.i === p.li && selPill.ei === p.ei;
                    const light = redOpacity(p.li) >= 0.45;
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
                          fill="transparent"
                        />
                        <text
                          x={p.x}
                          y={p.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className={cn(
                            light ? "fill-primary-foreground" : "fill-foreground",
                            active && "font-semibold",
                          )}
                          style={{
                            fontSize: EX_FS,
                            paintOrder: "stroke",
                            stroke: light ? "rgba(0,0,0,0.34)" : "var(--card)",
                            strokeWidth: 4,
                            strokeLinejoin: "round",
                            textDecoration: active ? "underline" : undefined,
                          }}
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
                        AI that is not narrow, out in the grey margin. Tap to read.
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
                  <span className="text-muted-foreground mr-1 eyebrow">Why here</span>
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
      <p className="text-muted-foreground eyebrow">{eyebrow}</p>
      {children}
    </>
  );
}
