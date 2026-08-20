"use client";

// The bench's graph canvas: an infinite pannable/zoomable surface with a
// dotted world-space grid. Nodes live at free positions (seeded by the tidy
// layout, then owned by the student's drags — dragging a node carries its
// subtree; dragging any selected node carries the whole selection). Editing
// happens on the graph itself: hover reveals a + under a node (add child)
// and edit/delete icons in its corner; double-click opens inline label +
// description editing; clicking empty canvas ends editing and deselects.
// Shift-click toggles selection; Shift-drag on empty canvas sweeps a
// marquee. Splines connect parent bottom-centers to child top-centers, and
// each sibling bundle carries its parent's AND/OR gate pill.

import { useEffect, useRef, useState } from "react";
import {
  AlignLeft,
  Check,
  Maximize2,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NODE_W, seedPositions } from "@/lib/bench/layout";
import {
  BENCH_ROOT_ID,
  subtreeIds,
  type BenchAffordance,
  type BenchNode,
  type BenchRelation,
} from "@/lib/bench/types";

export const RELATION_CHIP: Record<BenchRelation, string> = {
  prevents:
    "border-emerald-600/50 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  detects: "border-sky-600/50 bg-sky-500/15 text-sky-700 dark:text-sky-400",
  deters:
    "border-amber-600/50 bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

/** Fallback height until a node's box has been measured. */
const FALLBACK_H = 68;
const MIN_K = 0.3;
const MAX_K = 2.5;

interface View {
  tx: number;
  ty: number;
  k: number;
}

interface WorldRect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

type DragState =
  | {
      mode: "pan";
      startX: number;
      startY: number;
      view0: View;
      moved: boolean;
    }
  | {
      mode: "marquee";
      view0: View;
      wx0: number;
      wy0: number;
      moved: boolean;
      rect?: WorldRect;
    }
  | {
      mode: "node";
      id: string;
      ids: string[];
      shift: boolean;
      lastX: number;
      lastY: number;
      k: number;
      moved: boolean;
    };

export interface BenchCanvasProps {
  nodes: Record<string, BenchNode>;
  affordances: BenchAffordance[];
  rootSub?: string;
  selectedIds: string[];
  editingId: string | null;
  canEditStructure: boolean;
  onSelect: (ids: string[]) => void;
  onToggleSelect: (id: string) => void;
  onBeginEdit: (id: string) => void;
  onEndEdit: () => void;
  onRename: (id: string, label: string) => void;
  onSetDescription: (id: string, text: string) => void;
  onAddChild: (parentId: string) => void;
  onDelete: (id: string) => void;
  onToggleGate: (id: string) => void;
  onMoveNodes: (ids: string[], dx: number, dy: number) => void;
  onSetPositions: (positions: Record<string, { x: number; y: number }>) => void;
}

export function BenchCanvas({
  nodes,
  affordances,
  rootSub,
  selectedIds,
  editingId,
  canEditStructure,
  onSelect,
  onToggleSelect,
  onBeginEdit,
  onEndEdit,
  onRename,
  onSetDescription,
  onAddChild,
  onDelete,
  onToggleGate,
  onMoveNodes,
  onSetPositions,
}: BenchCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ tx: 0, ty: 0, k: 1 });
  const [marquee, setMarquee] = useState<WorldRect | null>(null);
  const [panning, setPanning] = useState(false);
  const dragRef = useRef<DragState | null>(null);
  /** Once the user pans or zooms, container resizes stop re-fitting the view. */
  const userMovedViewRef = useRef(false);

  // Boxes size to their content (title, chips, open editor), so heights are
  // measured from the DOM after each render. offsetHeight is layout size —
  // unaffected by the canvas zoom transform.
  const [heights, setHeights] = useState<Record<string, number>>({});
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const boxes = el.querySelectorAll<HTMLElement>("[data-node-id]");
    setHeights((prev) => {
      let changed = false;
      const next = { ...prev };
      boxes.forEach((box) => {
        const id = box.dataset.nodeId!;
        const h = box.offsetHeight;
        if (Math.abs((next[id] ?? 0) - h) >= 1) {
          next[id] = h;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [nodes, editingId]);

  const nodeH = (id: string) => heights[id] ?? FALLBACK_H;
  const pos = (n: BenchNode) => ({ x: n.x ?? 0, y: n.y ?? 0 });

  // --- viewport ------------------------------------------------------------

  const fitToNodes = (
    positions: Record<string, { x: number; y: number }>,
  ) => {
    const el = containerRef.current;
    const pts = Object.values(positions);
    if (!el || pts.length === 0) return;
    const minX = Math.min(...pts.map((p) => p.x)) - NODE_W / 2;
    const maxX = Math.max(...pts.map((p) => p.x)) + NODE_W / 2;
    const minY = Math.min(...pts.map((p) => p.y)) - FALLBACK_H / 2;
    const maxY = Math.max(...pts.map((p) => p.y)) + FALLBACK_H / 2;
    const { width: cw, height: ch } = el.getBoundingClientRect();
    const bw = Math.max(1, maxX - minX);
    const bh = Math.max(1, maxY - minY);
    const k = Math.min(
      MAX_K,
      Math.max(MIN_K, Math.min((cw - 80) / bw, (ch - 80) / bh, 1)),
    );
    setView({
      k,
      tx: (cw - bw * k) / 2 - minX * k,
      ty: (ch - bh * k) / 2 - minY * k,
    });
  };

  const currentPositions = () =>
    Object.fromEntries(
      Object.values(nodes).map((n) => [n.id, pos(n)]),
    );
  // Mirror for effects that must see fresh positions without re-subscribing.
  const positionsRef = useRef<Record<string, { x: number; y: number }>>({});
  useEffect(() => {
    positionsRef.current = Object.fromEntries(
      Object.values(nodes).map((n) => [n.id, { x: n.x ?? 0, y: n.y ?? 0 }]),
    );
  });

  // Fit on mount, and keep fitting on container resizes (breakpoint changes,
  // hydration reflow) until the user takes over the viewport.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const refit = () => {
      if (!userMovedViewRef.current) fitToNodes(positionsRef.current);
    };
    refit();
    const observer = new ResizeObserver(refit);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Plain wheel zooms around the cursor (needs a non-passive listener).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      userMovedViewRef.current = true;
      const rect = el.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      setView((v) => {
        const k = Math.min(
          MAX_K,
          Math.max(MIN_K, v.k * Math.exp(-e.deltaY * 0.0015)),
        );
        const wx = (sx - v.tx) / v.k;
        const wy = (sy - v.ty) / v.k;
        return { k, tx: sx - wx * k, ty: sy - wy * k };
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const resetStructure = () => {
    const seeds = seedPositions(nodes);
    onSetPositions(seeds);
    fitToNodes(seeds);
  };

  // --- drag machinery ------------------------------------------------------

  const beginWindowDrag = () => {
    const onMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      if (drag.mode === "pan") {
        const dx = e.clientX - drag.startX;
        const dy = e.clientY - drag.startY;
        if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
        setView({ ...drag.view0, tx: drag.view0.tx + dx, ty: drag.view0.ty + dy });
      } else if (drag.mode === "node") {
        const dx = (e.clientX - drag.lastX) / drag.k;
        const dy = (e.clientY - drag.lastY) / drag.k;
        drag.lastX = e.clientX;
        drag.lastY = e.clientY;
        if (Math.abs(dx) + Math.abs(dy) > 0) drag.moved = true;
        onMoveNodes(drag.ids, dx, dy);
      } else {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const wx =
          (e.clientX - rect.left - drag.view0.tx) / drag.view0.k;
        const wy = (e.clientY - rect.top - drag.view0.ty) / drag.view0.k;
        drag.moved = true;
        drag.rect = { x0: drag.wx0, y0: drag.wy0, x1: wx, y1: wy };
        setMarquee(drag.rect);
      }
    };
    const onUp = () => {
      const drag = dragRef.current;
      dragRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setPanning(false);
      if (!drag) return;
      if (drag.mode === "pan" && !drag.moved) {
        // A clean click on empty canvas: deselect and end editing.
        onSelect([]);
        onEndEdit();
      } else if (drag.mode === "node" && !drag.moved) {
        if (drag.shift) onToggleSelect(drag.id);
        else onSelect([drag.id]);
      } else if (drag.mode === "marquee") {
        if (drag.rect && drag.moved) {
          const { rect } = drag;
          const minX = Math.min(rect.x0, rect.x1);
          const maxX = Math.max(rect.x0, rect.x1);
          const minY = Math.min(rect.y0, rect.y1);
          const maxY = Math.max(rect.y0, rect.y1);
          const hit = Object.values(nodes)
            .filter((n) => {
              const p = pos(n);
              return p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY;
            })
            .map((n) => n.id);
          onSelect(hit);
        }
        setMarquee(null);
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const backgroundDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const el = containerRef.current;
    if (!el) return;
    if (e.shiftKey) {
      const rect = el.getBoundingClientRect();
      const wx = (e.clientX - rect.left - view.tx) / view.k;
      const wy = (e.clientY - rect.top - view.ty) / view.k;
      dragRef.current = {
        mode: "marquee",
        view0: view,
        wx0: wx,
        wy0: wy,
        moved: false,
      };
    } else {
      userMovedViewRef.current = true;
      dragRef.current = {
        mode: "pan",
        startX: e.clientX,
        startY: e.clientY,
        view0: view,
        moved: false,
      };
      setPanning(true);
    }
    beginWindowDrag();
  };

  const nodeDown = (e: React.PointerEvent, id: string) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    if (editingId === id) return; // typing inside the open editor
    // Dragging a selected node carries the whole selection; each carried
    // node brings its subtree along.
    const heads = selectedIds.includes(id) ? selectedIds : [id];
    const ids = [...new Set(heads.flatMap((h) => subtreeIds(nodes, h)))];
    dragRef.current = {
      mode: "node",
      id,
      ids,
      shift: e.shiftKey,
      lastX: e.clientX,
      lastY: e.clientY,
      k: view.k,
      moved: false,
    };
    beginWindowDrag();
  };

  // --- derived geometry ----------------------------------------------------

  const nodeList = Object.values(nodes);
  const childrenByParent = new Map<string, BenchNode[]>();
  for (const n of nodeList) {
    if (!n.parentId) continue;
    const list = childrenByParent.get(n.parentId) ?? [];
    list.push(n);
    childrenByParent.set(n.parentId, list);
  }
  for (const list of childrenByParent.values())
    list.sort((a, b) => a.seq - b.seq);

  const edges: { key: string; path: string }[] = [];
  const pills: { parentId: string; x: number; y: number; gate: string }[] = [];
  for (const [parentId, kids] of childrenByParent) {
    const parent = nodes[parentId];
    if (!parent) continue;
    const p = pos(parent);
    const pb = p.y + nodeH(parentId) / 2;
    for (const kid of kids) {
      const c = pos(kid);
      const ct = c.y - nodeH(kid.id) / 2;
      const o = Math.max(24, Math.abs(ct - pb) * 0.5);
      edges.push({
        key: `${parentId}-${kid.id}`,
        path: `M ${p.x} ${pb} C ${p.x} ${pb + o}, ${c.x} ${ct - o}, ${c.x} ${ct}`,
      });
    }
    if (kids.length >= 2) {
      const meanX =
        kids.reduce((s, kid) => s + pos(kid).x, 0) / kids.length;
      const meanTop =
        kids.reduce((s, kid) => s + (pos(kid).y - nodeH(kid.id) / 2), 0) /
        kids.length;
      pills.push({
        parentId,
        x: (meanX + p.x) / 2,
        y: (pb + meanTop) / 2,
        gate: parent.gate,
      });
    }
  }

  const affordanceIndex = (id: string) =>
    affordances.findIndex((a) => a.id === id);

  // --- render --------------------------------------------------------------

  return (
    <div className="space-y-1.5">
      <div
        ref={containerRef}
        className="border-border bg-card relative h-[560px] touch-none overflow-hidden rounded-xl border-2"
      >
        <svg
          width="100%"
          height="100%"
          className="block"
          role="application"
          aria-label="Your threat-model tree on a pannable canvas: the threat at the top, necessary conditions below it."
        >
          <defs>
            <pattern
              id="bench-dots"
              width={24}
              height={24}
              patternUnits="userSpaceOnUse"
            >
              <circle cx={1.4} cy={1.4} r={1.4} className="fill-muted-foreground/25" />
            </pattern>
          </defs>
          <g transform={`translate(${view.tx}, ${view.ty}) scale(${view.k})`}>
            <rect
              x={-10000}
              y={-10000}
              width={20000}
              height={20000}
              fill="url(#bench-dots)"
              onPointerDown={backgroundDown}
              className={panning ? "cursor-grabbing" : "cursor-grab"}
            />

            {edges.map((edge) => (
              <path
                key={edge.key}
                d={edge.path}
                fill="none"
                className="stroke-muted-foreground/60"
                strokeWidth={1.5}
              />
            ))}

            {pills.map((pill) => (
              <g
                key={pill.parentId}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  if (canEditStructure) onToggleGate(pill.parentId);
                }}
                className={cn(canEditStructure && "cursor-pointer")}
              >
                <title>
                  {canEditStructure
                    ? "Gate over these siblings — click to toggle AND/OR"
                    : "Gate over these siblings"}
                </title>
                <rect
                  x={pill.x - 19}
                  y={pill.y - 9}
                  width={38}
                  height={18}
                  rx={9}
                  className={cn(
                    "fill-card stroke-muted-foreground/70",
                    canEditStructure && "hover:stroke-foreground",
                  )}
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

            {[...nodeList]
              .sort(
                // SVG stacks by document order — the node being edited must
                // render last so its expanded editor paints over everything.
                (a, b) =>
                  (a.id === editingId ? 1 : 0) - (b.id === editingId ? 1 : 0),
              )
              .map((node) => {
              const p = pos(node);
              const h = nodeH(node.id);
              const isRoot = node.id === BENCH_ROOT_ID;
              const isSelected = selectedIds.includes(node.id);
              const isEditing = node.id === editingId;
              return (
                <foreignObject
                  key={node.id}
                  x={p.x - NODE_W / 2}
                  y={p.y - h / 2}
                  width={NODE_W}
                  height={320}
                  style={{ overflow: "visible", pointerEvents: "none" }}
                >
                  <div
                    className={cn(
                      "group relative mx-auto",
                      isEditing ? "w-full" : "w-fit max-w-full",
                    )}
                    style={{ pointerEvents: "auto" }}
                    title={
                      !isEditing && node.description
                        ? node.description
                        : undefined
                    }
                    onPointerDown={(e) => nodeDown(e, node.id)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onSelect([node.id]);
                      onBeginEdit(node.id);
                    }}
                  >
                    <div
                      data-node-id={node.id}
                      className={cn(
                        "flex cursor-move flex-col rounded-lg border-2 px-2 py-1.5",
                        isEditing
                          ? "w-full justify-start"
                          : "min-w-[96px] justify-center text-center",
                        isRoot
                          ? "border-red-600/80 bg-red-500/10"
                          : "border-muted-foreground/50 bg-card",
                        isSelected &&
                          "border-foreground ring-foreground/25 ring-2",
                      )}
                    >
                      {isEditing ? (
                        <div
                          className="space-y-1.5"
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={node.label}
                            maxLength={120}
                            placeholder="Name the condition…"
                            disabled={isRoot}
                            autoFocus={!isRoot}
                            onChange={(e) => onRename(node.id, e.target.value)}
                            className="border-border bg-background text-foreground w-full rounded border px-1.5 py-1 text-[11px] disabled:opacity-60"
                          />
                          <textarea
                            value={node.description ?? ""}
                            placeholder="Optional description…"
                            rows={5}
                            onChange={(e) =>
                              onSetDescription(node.id, e.target.value)
                            }
                            className="border-border bg-background text-foreground w-full resize-none rounded border px-1.5 py-1 text-[10px]"
                          />
                        </div>
                      ) : (
                        <>
                          <p
                            className={cn(
                              "text-foreground text-[11px] leading-tight font-medium break-words",
                              !node.label && "text-muted-foreground italic",
                            )}
                          >
                            {node.label || "unnamed condition"}
                          </p>
                          {isRoot && rootSub && (
                            <p className="text-muted-foreground mt-0.5 text-[8.5px]">
                              {rootSub}
                            </p>
                          )}
                          {node.tags.length > 0 && (
                            <div className="mt-1 flex flex-wrap justify-center gap-1">
                              {node.tags.map((tag) => (
                                <span
                                  key={tag.affordanceId}
                                  title={`${tag.relation}: ${tag.why}`}
                                  className={cn(
                                    "rounded-full border px-1.5 text-[8px] font-semibold",
                                    RELATION_CHIP[tag.relation],
                                  )}
                                >
                                  A{affordanceIndex(tag.affordanceId) + 1}
                                </span>
                              ))}
                            </div>
                          )}
                          {node.description && (
                            <AlignLeft
                              aria-label="Has a description — hover to read it"
                              className="text-muted-foreground absolute top-1 right-1 size-2.5"
                            />
                          )}
                        </>
                      )}

                      {/* Corner actions: edit toggles editing; delete removes the subtree. */}
                      <div
                        className={cn(
                          "absolute right-1 bottom-1 gap-0.5",
                          isEditing
                            ? "flex"
                            : "hidden group-hover:flex",
                        )}
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          aria-label={isEditing ? "Stop editing" : "Edit node"}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isEditing) onEndEdit();
                            else {
                              onSelect([node.id]);
                              onBeginEdit(node.id);
                            }
                          }}
                          className="border-border bg-card text-muted-foreground hover:text-foreground rounded border p-0.5"
                        >
                          {isEditing ? (
                            <Check className="size-3" aria-hidden />
                          ) : (
                            <Pencil className="size-3" aria-hidden />
                          )}
                        </button>
                        {canEditStructure && !isRoot && (
                          <button
                            type="button"
                            aria-label="Delete node and subtree"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(node.id);
                            }}
                            className="border-border bg-card text-destructive rounded border p-0.5"
                          >
                            <Trash2 className="size-3" aria-hidden />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Hover +: add a child condition below this node. */}
                    {canEditStructure && !isEditing && (
                      <button
                        type="button"
                        aria-label="Add a condition below this node"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddChild(node.id);
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="border-muted-foreground/60 bg-card text-foreground hover:border-foreground absolute -bottom-3 left-1/2 hidden size-6 -translate-x-1/2 items-center justify-center rounded-full border-2 group-hover:flex"
                      >
                        <Plus className="size-3.5" aria-hidden />
                      </button>
                    )}
                  </div>
                </foreignObject>
              );
            })}

            {marquee && (
              <rect
                x={Math.min(marquee.x0, marquee.x1)}
                y={Math.min(marquee.y0, marquee.y1)}
                width={Math.abs(marquee.x1 - marquee.x0)}
                height={Math.abs(marquee.y1 - marquee.y0)}
                className="fill-foreground/5 stroke-foreground/50"
                strokeWidth={1}
                strokeDasharray="4 3"
              />
            )}
          </g>
        </svg>

        {/* Viewport controls */}
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1 px-2 text-xs"
            onClick={() => fitToNodes(currentPositions())}
          >
            <Maximize2 className="size-3" aria-hidden /> Fit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1 px-2 text-xs"
            onClick={resetStructure}
          >
            <RotateCcw className="size-3" aria-hidden /> Reset structure
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground text-xs">
        Scroll to zoom · drag the canvas to pan · drag nodes to arrange
        (subtrees follow) · double-click a node to edit · Shift-click or
        Shift-drag to select several.
      </p>
    </div>
  );
}
