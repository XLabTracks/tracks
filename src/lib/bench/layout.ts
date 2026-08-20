// Tidy-tree layout for the Threat Modelling Bench: threat at the top, levels
// down the page, parent centered over its children, spline edges, and one
// AND/OR gate pill per sibling bundle (parents with two or more children).
// Pure functions of the node record — unit-tested, no React.

import { BENCH_ROOT_ID, type BenchGate, type BenchNode } from "./types";

export const NODE_W = 172;
export const NODE_H = 68;
export const ROOT_H = 64;
export const SIBLING_GAP = 18;
/** Vertical gap between levels — room for the gate pill on the bundle. */
export const LEVEL_GAP = 56;
export const CANVAS_PAD = 20;

export interface PositionedNode {
  node: BenchNode;
  /** Top-left corner. */
  x: number;
  y: number;
  w: number;
  h: number;
  depth: number;
}

export interface BenchEdge {
  from: string;
  to: string;
  /** Cubic spline, parent bottom-center → child top-center. */
  path: string;
}

export interface GatePill {
  parentId: string;
  /** Pill center. */
  x: number;
  y: number;
  gate: BenchGate;
}

export interface BenchLayout {
  nodes: PositionedNode[];
  edges: BenchEdge[];
  pills: GatePill[];
  width: number;
  height: number;
}

function nodeHeight(depth: number): number {
  return depth === 0 ? ROOT_H : NODE_H;
}

function levelY(depth: number): number {
  if (depth === 0) return CANVAS_PAD;
  return (
    CANVAS_PAD + ROOT_H + LEVEL_GAP + (depth - 1) * (NODE_H + LEVEL_GAP)
  );
}

export function childrenOf(
  nodes: Record<string, BenchNode>,
  id: string,
): BenchNode[] {
  return Object.values(nodes)
    .filter((n) => n.parentId === id)
    .sort((a, b) => a.seq - b.seq);
}

/** Width of the horizontal span a subtree needs (node or children, wider wins). */
function subtreeWidth(nodes: Record<string, BenchNode>, id: string): number {
  const kids = childrenOf(nodes, id);
  if (kids.length === 0) return NODE_W;
  const kidsWidth =
    kids.reduce((sum, k) => sum + subtreeWidth(nodes, k.id), 0) +
    SIBLING_GAP * (kids.length - 1);
  return Math.max(NODE_W, kidsWidth);
}

export interface NodePosition {
  x: number;
  y: number;
}

/** Tidy-layout center positions for every node — the seed/reset positions. */
export function seedPositions(
  nodes: Record<string, BenchNode>,
): Record<string, NodePosition> {
  const layout = layoutTree(nodes);
  return Object.fromEntries(
    layout.nodes.map((p) => [p.node.id, { x: p.x + p.w / 2, y: p.y + p.h / 2 }]),
  );
}

/**
 * True while the student hasn't meaningfully re-arranged the graph: every
 * node sits within `tolerance` of where the tidy layout would put it. While
 * this holds, structural changes (add/delete) re-run the tidy layout so the
 * tree stays groomed; once the student arranges things, their positions win.
 */
export function isNearSeededLayout(
  nodes: Record<string, BenchNode>,
  tolerance = 48,
): boolean {
  const seeds = seedPositions(nodes);
  return Object.values(nodes).every((n) => {
    const s = seeds[n.id];
    return (
      Math.hypot((n.x ?? s.x) - s.x, (n.y ?? s.y) - s.y) < tolerance
    );
  });
}

/** Fill in positions for nodes that don't have one yet (v1 states, resets). */
export function withSeededPositions(
  nodes: Record<string, BenchNode>,
): Record<string, BenchNode> {
  if (Object.values(nodes).every((n) => n.x !== undefined && n.y !== undefined))
    return nodes;
  const seeds = seedPositions(nodes);
  return Object.fromEntries(
    Object.entries(nodes).map(([id, n]) => [
      id,
      n.x !== undefined && n.y !== undefined
        ? n
        : { ...n, x: seeds[id].x, y: seeds[id].y },
    ]),
  );
}

export function layoutTree(nodes: Record<string, BenchNode>): BenchLayout {
  const positioned: PositionedNode[] = [];
  const edges: BenchEdge[] = [];
  const pills: GatePill[] = [];
  let maxDepth = 0;

  // Place a subtree so its span starts at `left`; return its center x.
  const place = (id: string, left: number, depth: number): number => {
    const node = nodes[id];
    const kids = childrenOf(nodes, id);
    const span = subtreeWidth(nodes, id);
    const h = nodeHeight(depth);
    const y = levelY(depth);
    maxDepth = Math.max(maxDepth, depth);

    let centerX: number;
    if (kids.length === 0) {
      centerX = left + span / 2;
    } else {
      // Center the children block within the subtree span (the span is the
      // node's own width when the node is wider than its children).
      const kidsWidth =
        kids.reduce((sum, k) => sum + subtreeWidth(nodes, k.id), 0) +
        SIBLING_GAP * (kids.length - 1);
      let cursor = left + Math.max(0, (span - kidsWidth) / 2);
      const kidCenters = kids.map((k) => {
        const kSpan = subtreeWidth(nodes, k.id);
        const c = place(k.id, cursor, depth + 1);
        cursor += kSpan + SIBLING_GAP;
        return c;
      });
      centerX = (kidCenters[0] + kidCenters[kidCenters.length - 1]) / 2;

      const parentBottom = y + h;
      const childTop = levelY(depth + 1);
      for (let i = 0; i < kids.length; i++) {
        const cx = kidCenters[i];
        edges.push({
          from: id,
          to: kids[i].id,
          path: `M ${centerX} ${parentBottom} C ${centerX} ${
            parentBottom + LEVEL_GAP / 2
          }, ${cx} ${childTop - LEVEL_GAP / 2}, ${cx} ${childTop}`,
        });
      }
      if (kids.length >= 2) {
        pills.push({
          parentId: id,
          x: centerX,
          y: parentBottom + LEVEL_GAP / 2,
          gate: node.gate,
        });
      }
    }

    positioned.push({ node, x: centerX - NODE_W / 2, y, w: NODE_W, h, depth });
    return centerX;
  };

  if (nodes[BENCH_ROOT_ID]) place(BENCH_ROOT_ID, CANVAS_PAD, 0);

  const width =
    (nodes[BENCH_ROOT_ID] ? subtreeWidth(nodes, BENCH_ROOT_ID) : 0) +
    2 * CANVAS_PAD;
  const height = levelY(maxDepth) + nodeHeight(maxDepth) + CANVAS_PAD;
  return { nodes: positioned, edges, pills, width, height };
}
