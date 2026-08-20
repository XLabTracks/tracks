// Data model for the Threat Modelling Bench (/bench).
//
// The bench is a practice environment, not a graded exercise: students
// decompose a threat into a tree they build themselves, with NO feedback.
// Per scenario we author only a closed world, a root threat, and an ordered
// list of specific blue-team affordances. The student loops through roles:
// red states a best strategy and maps necessary conditions (creating nodes);
// blue receives the next affordance and tags which node(s) it prevents,
// detects, or deters; red then revises — growing the graph only if the
// attack now requires new conditions. Graph semantics follow attack-tree
// formalism: the AND/OR gate is a property of the PARENT (one gate over all
// its children, AND by default); mixing gates requires an intermediate
// grouping node. This avoids the ambiguity of pairwise sibling gates.

export type BenchGate = "AND" | "OR";

export type BenchRelation = "prevents" | "detects" | "deters";

export const BENCH_RELATIONS: BenchRelation[] = ["prevents", "detects", "deters"];

export const BENCH_RELATION_LABELS: Record<BenchRelation, string> = {
  prevents: "Prevents",
  detects: "Detects",
  deters: "Deters",
};

/** One blue-team measure, specific enough that node-mapping isn't debatable. */
export interface BenchAffordance {
  id: string;
  title: string;
  /** The affordance card: what blue gets and how it is deployed. */
  grant: string;
}

export interface BenchScenario {
  id: string;
  slug: string;
  title: string;
  /** One-sentence card blurb for the scenario list. */
  blurb: string;
  /** The closed world, as paragraphs. Everything decomposition needs. */
  worldCard: string[];
  /** Red's wall — what the adversary can and can't do, as bullet lines. */
  redWall: string[];
  /** The threat — the given root node (threat at the top of the tree). */
  rootLabel: string;
  rootSub?: string;
  /** Ordered: revealed one at a time, each followed by a red revision. */
  affordances: BenchAffordance[];
}

/** A blue-turn annotation: this affordance touches this node, and why. */
export interface BenchTag {
  affordanceId: string;
  relation: BenchRelation;
  why: string;
}

export interface BenchNode {
  id: string;
  label: string;
  /** Optional longer note; shown on hover / in edit mode, kept off the box. */
  description?: string;
  /** null only for the root. */
  parentId: string | null;
  /** Gate over this node's CHILDREN (unused until it has two). */
  gate: BenchGate;
  tags: BenchTag[];
  /** Turn the node was created on — lets a later feedback layer replay growth. */
  createdTurn: number;
  /** Monotonic creation counter; children render in seq order. */
  seq: number;
  /**
   * Canvas position (node center, world coordinates). Seeded by the tidy
   * layout, then owned by the student's drags; "Reset structure" re-seeds.
   */
  x?: number;
  y?: number;
}

export interface BenchState {
  nodes: Record<string, BenchNode>;
  nextSeq: number;
  turnIndex: number;
  /** Red strategy statements, keyed by the turn they were committed on. */
  strategies: Record<number, string>;
}

export type BenchPhase =
  | { kind: "red-base" }
  | { kind: "blue"; affordanceIndex: number }
  | { kind: "red-revise"; affordanceIndex: number }
  | { kind: "done" };

/**
 * Turn 0 is the base-case red turn; then each affordance k contributes a
 * blue turn (2k+1) and a red revision (2k+2); past the list, the bench is done.
 */
export function phaseForTurn(
  turnIndex: number,
  affordanceCount: number,
): BenchPhase {
  if (turnIndex === 0) return { kind: "red-base" };
  const k = Math.floor((turnIndex - 1) / 2);
  if (k >= affordanceCount) return { kind: "done" };
  return (turnIndex - 1) % 2 === 0
    ? { kind: "blue", affordanceIndex: k }
    : { kind: "red-revise", affordanceIndex: k };
}

export const BENCH_ROOT_ID = "root";

export function initialBenchState(scenario: BenchScenario): BenchState {
  return {
    nodes: {
      [BENCH_ROOT_ID]: {
        id: BENCH_ROOT_ID,
        label: scenario.rootLabel,
        parentId: null,
        gate: "AND",
        tags: [],
        createdTurn: 0,
        seq: 0,
      },
    },
    nextSeq: 1,
    turnIndex: 0,
    strategies: {},
  };
}

/** Ids of `id` and every descendant — the unit of deletion. */
export function subtreeIds(
  nodes: Record<string, BenchNode>,
  id: string,
): string[] {
  const childIds = Object.values(nodes)
    .filter((n) => n.parentId === id)
    .map((n) => n.id);
  return [id, ...childIds.flatMap((c) => subtreeIds(nodes, c))];
}

/**
 * Whether `id` may be re-parented under `targetId`: both must exist, a node
 * can't be its own parent, can't move under its own subtree (would orphan a
 * cycle), and moving under its current parent is a no-op.
 */
export function canReparent(
  nodes: Record<string, BenchNode>,
  id: string,
  targetId: string,
): boolean {
  const node = nodes[id];
  if (!node || !nodes[targetId]) return false;
  if (id === targetId || node.parentId === targetId) return false;
  return !subtreeIds(nodes, id).includes(targetId);
}
