"use client";

// Static + animated attack-tree figures for lesson prose. Same visual
// vocabulary as the Threat Modelling Bench canvas — tidy layout, spline
// edges, one AND/OR gate pill per sibling bundle, dotted grid, red root —
// but read-only: no panning, dragging, or editing. Wide trees render at
// natural size inside a horizontally scrollable frame (scroll starts
// centered) so labels stay legible instead of shrinking to fit.
//
// <AttackTreeMorph> renders two specs and tweens between them: nodes shared
// by id glide to their new positions, entering nodes fade in emerging from
// their nearest surviving ancestor, exiting nodes fade out toward theirs.
// That is the lesson's "splitting a node grows the tree" animation.

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { animate, type AnimationHandle } from "@/lib/bench/animate";
import { layoutTree, NODE_W } from "@/lib/bench/layout";
import { BENCH_ROOT_ID, type BenchNode } from "@/lib/bench/types";
import {
  ATTACK_TREES,
  flattenSpec,
  type AttackTreeName,
  type AttackNodeVariant,
  type FlatAttackTree,
} from "./trees";

/** Fallback until a node's box has been measured from the DOM. */
const FALLBACK_H = 40;
/** foreignObject band a node box is vertically centered inside. */
const FO_H = 220;

interface TreeSide {
  flat: FlatAttackTree;
  /** Node centers, pre-shifted so the tree is centered on the shared canvas. */
  pos: Record<string, { cx: number; cy: number }>;
  width: number;
  height: number;
}

function buildSide(flat: FlatAttackTree, canvasWidth: number): TreeSide {
  const layout = layoutTree(flat.nodes);
  const dx = Math.max(0, (canvasWidth - layout.width) / 2);
  const pos: Record<string, { cx: number; cy: number }> = {};
  for (const p of layout.nodes)
    pos[p.node.id] = { cx: p.x + p.w / 2 + dx, cy: p.y + p.h / 2 };
  return { flat, pos, width: layout.width, height: layout.height };
}

/** A node's anchor in a side it does not exist in: its nearest ancestor
 *  (walking the parent chain of the side it DOES exist in) present there. */
function anchorIn(
  side: TreeSide,
  own: Record<string, BenchNode>,
  id: string,
): { cx: number; cy: number } {
  let cur: string | null = id;
  while (cur && !side.pos[cur]) cur = own[cur]?.parentId ?? null;
  return cur ? side.pos[cur] : { cx: 0, cy: 0 };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface TreeCanvasProps {
  a: TreeSide;
  b?: TreeSide;
  /** 0 = tree A, 1 = tree B. Static figures stay at 0 with no B. */
  t: number;
  ariaLabel: string;
}

function TreeCanvas({ a, b, t, ariaLabel }: TreeCanvasProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // useId keeps SSR and client markup identical; colons are stripped because
  // the id is referenced through url(#...).
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const patternId = `atf-dots-${uid}`;

  // Labels (and so box heights) come from whichever side currently shows.
  const showAfter = Boolean(b) && t >= 0.5;
  const shown = showAfter && b ? b.flat : a.flat;

  // Boxes size to their labels, so edge/pill endpoints use measured heights
  // (offsetHeight is layout size — the figure renders 1:1, no zoom).
  const [heights, setHeights] = useState<Record<string, number>>({});
  const labelsKey = useMemo(
    () =>
      Object.values(shown.nodes)
        .map((n) => `${n.id}:${n.label}`)
        .join("|"),
    [shown],
  );
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const boxes = el.querySelectorAll<HTMLElement>("[data-atf-id]");
    setHeights((prev) => {
      let changed = false;
      const next = { ...prev };
      boxes.forEach((box) => {
        const h = box.offsetHeight;
        const id = box.dataset.atfId!;
        if (Math.abs((next[id] ?? 0) - h) >= 1) {
          next[id] = h;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [labelsKey]);

  // Wide trees overflow horizontally — start the scroll centered on the root.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);

  const nodeH = (id: string) => heights[id] ?? FALLBACK_H;

  // --- per-frame geometry ---------------------------------------------------

  const width = Math.max(a.width, b?.width ?? 0);
  const height = Math.round(lerp(a.height, b ? b.height : a.height, t));

  interface Placed {
    node: BenchNode;
    variant?: AttackNodeVariant;
    cx: number;
    cy: number;
    opacity: number;
  }
  const placed: Placed[] = [];
  const seen = new Set<string>();
  // After-side first so shared nodes carry B's document order during morphs.
  const sides: { side: TreeSide; other?: TreeSide; isAfter: boolean }[] = b
    ? [
        { side: b, other: a, isAfter: true },
        { side: a, other: b, isAfter: false },
      ]
    : [{ side: a, isAfter: false }];
  for (const { side, other, isAfter } of sides) {
    for (const node of Object.values(side.flat.nodes)) {
      if (seen.has(node.id)) continue;
      seen.add(node.id);
      const here = side.pos[node.id];
      const inOther = other?.pos[node.id];
      const there =
        inOther ?? (other ? anchorIn(other, side.flat.nodes, node.id) : here);
      // `here` belongs to this side; order the lerp so t always runs A → B.
      const [pa, pb] = isAfter ? [there, here] : [here, there];
      placed.push({
        node: shown.nodes[node.id] ?? node,
        variant: shown.variants[node.id] ?? side.flat.variants[node.id],
        cx: lerp(pa.cx, pb.cx, t),
        cy: lerp(pa.cy, pb.cy, t),
        opacity: !b || inOther ? 1 : isAfter ? t : 1 - t,
      });
    }
  }
  const byId = new Map(placed.map((p) => [p.node.id, p]));

  // Edges + pills recomputed from the interpolated centers each frame —
  // exactly the bench-canvas recipe (spline pull `o`, midpoint pills).
  interface Edge {
    key: string;
    path: string;
    opacity: number;
    /** Set on ellipsis fan edges: gradient stroke that fades out downward. */
    stroke?: string;
  }
  const edges: Edge[] = [];
  const edgeKeys = new Set<string>();
  const fadeSpans: { key: string; y1: number; y2: number }[] = [];
  /** Per-side pill geometry (from that side's own sibling bundle, at the
   *  bundle's current interpolated position) — merged after the loop so a
   *  pill present in both sides lerps between its two geometries. */
  const pillGeo = new Map<
    string,
    { a?: { x: number; y: number }; b?: { x: number; y: number }; gate: string }
  >();

  for (const { side, isAfter } of sides) {
    const kidsByParent = new Map<string, BenchNode[]>();
    for (const n of Object.values(side.flat.nodes)) {
      if (!n.parentId) continue;
      const list = kidsByParent.get(n.parentId) ?? [];
      list.push(n);
      kidsByParent.set(n.parentId, list);
    }
    for (const list of kidsByParent.values()) list.sort((x, y) => x.seq - y.seq);

    for (const [parentId, kids] of kidsByParent) {
      const parent = byId.get(parentId);
      if (!parent) continue;
      const pBottom = parent.cy + nodeH(parentId) / 2;
      for (const kid of kids) {
        const key = `${parentId}-${kid.id}`;
        if (edgeKeys.has(key)) continue;
        edgeKeys.add(key);
        const c = byId.get(kid.id);
        if (!c) continue;
        const inA = a.flat.nodes[kid.id]?.parentId === parentId;
        const inB = b ? b.flat.nodes[kid.id]?.parentId === parentId : inA;
        const opacity = !b || (inA && inB) ? 1 : isAfter ? t : 1 - t;
        const cTop = c.cy - nodeH(kid.id) / 2;
        const o = Math.max(24, Math.abs(cTop - pBottom) * 0.5);
        if (side.flat.variants[kid.id] === "ellipsis") {
          // "And many more like these": a fan of edges that fade out on the
          // way down, ending at a boxless ⋯ instead of a node.
          const gradientId = `${patternId}-fade-${key}`;
          fadeSpans.push({ key: gradientId, y1: pBottom, y2: cTop });
          for (const off of [-20, 0, 20]) {
            edges.push({
              key: `${key}:${off}`,
              path: `M ${parent.cx} ${pBottom} C ${parent.cx} ${pBottom + o}, ${
                c.cx + off
              } ${cTop - o}, ${c.cx + off} ${cTop}`,
              opacity,
              stroke: `url(#${gradientId})`,
            });
          }
          continue;
        }
        edges.push({
          key,
          path: `M ${parent.cx} ${pBottom} C ${parent.cx} ${pBottom + o}, ${
            c.cx
          } ${cTop - o}, ${c.cx} ${cTop}`,
          opacity,
        });
      }
      if (kids.length >= 2) {
        const centers = kids
          .map((k) => byId.get(k.id))
          .filter((k): k is Placed => Boolean(k));
        if (centers.length < 2) continue;
        const meanX = centers.reduce((s, k) => s + k.cx, 0) / centers.length;
        const meanTop =
          centers.reduce((s, k) => s + (k.cy - nodeH(k.node.id) / 2), 0) /
          centers.length;
        const geo = pillGeo.get(parentId) ?? {
          gate: (shown.nodes[parentId] ?? side.flat.nodes[parentId]).gate,
        };
        geo[isAfter ? "b" : "a"] = {
          x: (meanX + parent.cx) / 2,
          y: (pBottom + meanTop) / 2,
        };
        pillGeo.set(parentId, geo);
      }
    }
  }

  const pills = [...pillGeo.entries()].map(([parentId, geo]) => {
    const pa = geo.a ?? geo.b!;
    const pb = geo.b ?? geo.a!;
    return {
      key: parentId,
      x: lerp(pa.x, pb.x, t),
      y: lerp(pa.y, pb.y, t),
      gate: geo.gate,
      opacity: !b || (geo.a && geo.b) ? 1 : geo.b ? t : 1 - t,
    };
  });

  return (
    <div
      ref={scrollRef}
      className="border-border bg-card overflow-x-auto rounded-xl border-2"
    >
      {/* text-muted-foreground supplies currentColor to the gradient stops. */}
      <svg
        width={width}
        height={height}
        className="text-muted-foreground mx-auto block"
        role="img"
        aria-label={ariaLabel}
      >
        <defs>
          <pattern
            id={patternId}
            width={24}
            height={24}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={1.4}
              cy={1.4}
              r={1.4}
              className="fill-muted-foreground/25"
            />
          </pattern>
          {fadeSpans.map((s) => (
            <linearGradient
              key={s.key}
              id={s.key}
              gradientUnits="userSpaceOnUse"
              x1={0}
              y1={s.y1}
              x2={0}
              y2={s.y2}
            >
              <stop offset="0" stopColor="currentColor" stopOpacity={0.55} />
              <stop offset="0.8" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <rect width={width} height={height} fill={`url(#${patternId})`} />

        {edges.map((edge) => (
          <path
            key={edge.key}
            d={edge.path}
            fill="none"
            stroke={edge.stroke}
            className={edge.stroke ? undefined : "stroke-muted-foreground/60"}
            strokeWidth={1.5}
            opacity={edge.opacity}
          />
        ))}

        {pills.map((pill) => (
          <g key={pill.key} opacity={pill.opacity}>
            <rect
              x={pill.x - 19}
              y={pill.y - 9}
              width={38}
              height={18}
              rx={9}
              className="fill-card stroke-muted-foreground/70"
              strokeWidth={1.25}
            />
            <text
              x={pill.x}
              y={pill.y + 3.5}
              textAnchor="middle"
              className="fill-foreground text-[9px] font-bold tracking-wide select-none"
            >
              {pill.gate}
            </text>
          </g>
        ))}

        {placed.map(({ node, variant, cx, cy, opacity }) => (
          <foreignObject
            key={node.id}
            x={cx - NODE_W / 2}
            y={cy - FO_H / 2}
            width={NODE_W}
            height={FO_H}
            style={{ overflow: "visible", pointerEvents: "none" }}
            opacity={opacity}
          >
            <div
              className="flex items-center justify-center"
              style={{ height: FO_H }}
            >
              {variant === "ellipsis" ? (
                <span
                  data-atf-id={node.id}
                  className="text-muted-foreground text-lg leading-none font-semibold tracking-widest select-none"
                >
                  ⋯
                </span>
              ) : (
                <div
                  data-atf-id={node.id}
                  className={cn(
                    "flex max-w-full min-w-[96px] flex-col justify-center rounded-lg border-2 px-2 py-1.5 text-center",
                    node.id === BENCH_ROOT_ID
                      ? "border-red-600/80 bg-red-500/10"
                      : variant === "flag"
                        ? "border-amber-600/70 bg-amber-500/10"
                        : "border-muted-foreground/50 bg-card",
                  )}
                >
                  <p className="text-foreground text-[11px] leading-tight font-medium break-words">
                    {node.label}
                  </p>
                </div>
              )}
            </div>
          </foreignObject>
        ))}
      </svg>
    </div>
  );
}

// --- Public MDX components --------------------------------------------------

export interface AttackTreeProps {
  name: AttackTreeName;
  caption?: string;
}

/** A read-only attack tree rendered in the bench's visual style. */
export function AttackTree({ name, caption }: AttackTreeProps) {
  const side = useMemo(() => buildSide(flattenSpec(ATTACK_TREES[name]), 0), [
    name,
  ]);
  return (
    <figure className="not-prose my-6 space-y-2">
      <TreeCanvas
        a={side}
        t={0}
        ariaLabel={`Attack tree: ${side.flat.nodes[BENCH_ROOT_ID].label}`}
      />
      {caption && (
        <figcaption className="text-muted-foreground text-center text-xs">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export interface AttackTreeMorphProps {
  before: AttackTreeName;
  after: AttackTreeName;
  /** Button label that plays the forward morph, e.g. "Decompose the node". */
  actionLabel: string;
  caption?: string;
}

/**
 * Two trees and a button: forward tweens before → after (shared nodes glide,
 * new nodes fade in out of their parents), and the button then reverts.
 */
export function AttackTreeMorph({
  before,
  after,
  actionLabel,
  caption,
}: AttackTreeMorphProps) {
  const { a, b } = useMemo(() => {
    const flatA = flattenSpec(ATTACK_TREES[before]);
    const flatB = flattenSpec(ATTACK_TREES[after]);
    const canvasWidth = Math.max(
      layoutTree(flatA.nodes).width,
      layoutTree(flatB.nodes).width,
    );
    return {
      a: buildSide(flatA, canvasWidth),
      b: buildSide(flatB, canvasWidth),
    };
  }, [before, after]);

  const [t, setT] = useState(0);
  const [target, setTarget] = useState(0);
  const animRef = useRef<AnimationHandle | null>(null);
  useEffect(() => () => animRef.current?.cancel(), []);

  const play = () => {
    const from = t;
    const to = target === 0 ? 1 : 0;
    setTarget(to);
    animRef.current?.cancel();
    animRef.current = animate((p) => setT(from + (to - from) * p), 450);
  };

  return (
    <figure className="not-prose my-6 space-y-2">
      <TreeCanvas
        a={a}
        b={b}
        t={t}
        ariaLabel={`Attack tree, morphing between two versions: ${a.flat.nodes[BENCH_ROOT_ID].label}`}
      />
      <div className="flex items-center justify-center">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-7 px-3 text-xs"
          onClick={play}
        >
          {target === 0 ? actionLabel : "Put it back"}
        </Button>
      </div>
      {caption && (
        <figcaption className="text-muted-foreground text-center text-xs">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
