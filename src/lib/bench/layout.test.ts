import { describe, expect, it } from "vitest";
import {
  CANVAS_PAD,
  LEVEL_GAP,
  NODE_W,
  ROOT_H,
  SIBLING_GAP,
  isNearSeededLayout,
  layoutTree,
  withSeededPositions,
} from "./layout";
import { BENCH_ROOT_ID, type BenchNode } from "./types";

function makeNodes(
  specs: { id: string; parentId: string | null }[],
): Record<string, BenchNode> {
  const nodes: Record<string, BenchNode> = {};
  specs.forEach((s, i) => {
    nodes[s.id] = {
      id: s.id,
      label: s.id,
      parentId: s.parentId,
      gate: "AND",
      tags: [],
      createdTurn: 0,
      seq: i,
    };
  });
  return nodes;
}

describe("bench tree layout", () => {
  it("root alone fills a one-node canvas, centered", () => {
    const layout = layoutTree(makeNodes([{ id: BENCH_ROOT_ID, parentId: null }]));
    expect(layout.nodes).toHaveLength(1);
    expect(layout.width).toBe(NODE_W + 2 * CANVAS_PAD);
    expect(layout.nodes[0].x).toBe(CANVAS_PAD);
    expect(layout.edges).toHaveLength(0);
    expect(layout.pills).toHaveLength(0);
  });

  it("three siblings pack with gaps and the parent centers over them", () => {
    const layout = layoutTree(
      makeNodes([
        { id: BENCH_ROOT_ID, parentId: null },
        { id: "a", parentId: BENCH_ROOT_ID },
        { id: "b", parentId: BENCH_ROOT_ID },
        { id: "c", parentId: BENCH_ROOT_ID },
      ]),
    );
    expect(layout.width).toBe(3 * NODE_W + 2 * SIBLING_GAP + 2 * CANVAS_PAD);
    const root = layout.nodes.find((p) => p.node.id === BENCH_ROOT_ID)!;
    const a = layout.nodes.find((p) => p.node.id === "a")!;
    const c = layout.nodes.find((p) => p.node.id === "c")!;
    const rootCenter = root.x + root.w / 2;
    expect(rootCenter).toBeCloseTo((a.x + a.w / 2 + c.x + c.w / 2) / 2);
    // Siblings share a level and sit in seq order.
    expect(a.y).toBe(c.y);
    expect(a.x).toBeLessThan(c.x);
  });

  it("a single child gets an edge but no gate pill", () => {
    const layout = layoutTree(
      makeNodes([
        { id: BENCH_ROOT_ID, parentId: null },
        { id: "a", parentId: BENCH_ROOT_ID },
      ]),
    );
    expect(layout.edges).toHaveLength(1);
    expect(layout.pills).toHaveLength(0);
    // The only child centers under the root.
    const root = layout.nodes.find((p) => p.node.id === BENCH_ROOT_ID)!;
    const a = layout.nodes.find((p) => p.node.id === "a")!;
    expect(a.x + a.w / 2).toBeCloseTo(root.x + root.w / 2);
  });

  it("two or more siblings get one pill, mid-gap, centered on the bundle", () => {
    const layout = layoutTree(
      makeNodes([
        { id: BENCH_ROOT_ID, parentId: null },
        { id: "a", parentId: BENCH_ROOT_ID },
        { id: "b", parentId: BENCH_ROOT_ID },
      ]),
    );
    expect(layout.pills).toHaveLength(1);
    const pill = layout.pills[0];
    const root = layout.nodes.find((p) => p.node.id === BENCH_ROOT_ID)!;
    expect(pill.parentId).toBe(BENCH_ROOT_ID);
    expect(pill.x).toBeCloseTo(root.x + root.w / 2);
    expect(pill.y).toBeCloseTo(CANVAS_PAD + ROOT_H + LEVEL_GAP / 2);
  });

  it("a narrow subtree under a wide sibling block stays centered", () => {
    // root -> [a (with two children), b] ; b's single-node span is narrower
    // than a's two-child span, so centering must hold at every level.
    const layout = layoutTree(
      makeNodes([
        { id: BENCH_ROOT_ID, parentId: null },
        { id: "a", parentId: BENCH_ROOT_ID },
        { id: "b", parentId: BENCH_ROOT_ID },
        { id: "a1", parentId: "a" },
        { id: "a2", parentId: "a" },
      ]),
    );
    const a = layout.nodes.find((p) => p.node.id === "a")!;
    const a1 = layout.nodes.find((p) => p.node.id === "a1")!;
    const a2 = layout.nodes.find((p) => p.node.id === "a2")!;
    expect(a.x + a.w / 2).toBeCloseTo(
      (a1.x + a1.w / 2 + (a2.x + a2.w / 2)) / 2,
    );
    // No overlap between a's children and b.
    const b = layout.nodes.find((p) => p.node.id === "b")!;
    expect(a2.x + a2.w).toBeLessThanOrEqual(b.x + b.w);
  });

  it("isNearSeededLayout tolerates nudges and flags real re-arrangement", () => {
    const nodes = withSeededPositions(
      makeNodes([
        { id: BENCH_ROOT_ID, parentId: null },
        { id: "a", parentId: BENCH_ROOT_ID },
        { id: "b", parentId: BENCH_ROOT_ID },
      ]),
    );
    expect(isNearSeededLayout(nodes)).toBe(true);
    const nudged = { ...nodes, a: { ...nodes.a, x: nodes.a.x! + 20 } };
    expect(isNearSeededLayout(nudged)).toBe(true);
    const moved = { ...nodes, a: { ...nodes.a, x: nodes.a.x! + 200 } };
    expect(isNearSeededLayout(moved)).toBe(false);
  });

  it("withSeededPositions fills missing positions and keeps existing ones", () => {
    const nodes = makeNodes([
      { id: BENCH_ROOT_ID, parentId: null },
      { id: "a", parentId: BENCH_ROOT_ID },
    ]);
    nodes.a = { ...nodes.a, x: 999, y: 111 };
    const seeded = withSeededPositions(nodes);
    expect(seeded.a.x).toBe(999);
    expect(seeded.a.y).toBe(111);
    expect(seeded[BENCH_ROOT_ID].x).toBeTypeOf("number");
    expect(seeded[BENCH_ROOT_ID].y).toBeTypeOf("number");
    // Already-complete records are returned unchanged (same reference).
    expect(withSeededPositions(seeded)).toBe(seeded);
  });
});
