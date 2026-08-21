// Static attack-tree specs for the module-1 "Attack Trees" lesson (adapted
// from Schneier's 1999 safe example). Specs are nested for authoring comfort
// and flattened into BenchNode records so the lesson figures render through
// the same tidy layout as the Threat Modelling Bench.
//
// Gate semantics follow the bench: `op` on a node is the gate over its
// CHILDREN. Schneier's figures default to OR ("children are alternatives"),
// so that is the default here too — the bench itself defaults to AND, so
// every spec below states the gate explicitly where it matters.

import { BENCH_ROOT_ID, type BenchGate, type BenchNode } from "@/lib/bench/types";

export type AttackNodeVariant = "ellipsis" | "flag";

export interface AttackTreeSpec {
  /** Stable id — morphs match nodes across the two trees by id. */
  id: string;
  label: string;
  /** Gate over this node's children. Default OR (Schneier's convention). */
  op?: BenchGate;
  children?: AttackTreeSpec[];
  /**
   * "ellipsis" renders as a boxless "⋯" with edges that fade out before
   * reaching it — the "and many more like these" marker. "flag" tints the
   * box amber to mark the node the surrounding prose is criticising.
   */
  variant?: AttackNodeVariant;
}

export interface FlatAttackTree {
  nodes: Record<string, BenchNode>;
  variants: Record<string, AttackNodeVariant>;
}

export function flattenSpec(spec: AttackTreeSpec): FlatAttackTree {
  const nodes: Record<string, BenchNode> = {};
  const variants: Record<string, AttackNodeVariant> = {};
  let seq = 0;
  const walk = (s: AttackTreeSpec, parentId: string | null, isRoot: boolean) => {
    const id = isRoot ? BENCH_ROOT_ID : s.id;
    nodes[id] = {
      id,
      label: s.label,
      parentId,
      gate: s.op ?? "OR",
      tags: [],
      createdTurn: 0,
      seq: seq++,
    };
    if (s.variant) variants[id] = s.variant;
    for (const child of s.children ?? []) walk(child, id, false);
  };
  walk(spec, null, true);
  return { nodes, variants };
}

// --- The canonical safe tree (Schneier 1999, abridged) ---

const safe: AttackTreeSpec = {
  id: "open-safe",
  label: "Open Safe",
  op: "OR",
  children: [
    { id: "pick-lock", label: "Pick Lock" },
    {
      id: "learn-combo",
      label: "Learn Combo",
      op: "OR",
      children: [
        { id: "find-written", label: "Find Written Combo" },
        {
          id: "from-target",
          label: "Get Combo From Target",
          op: "OR",
          children: [
            { id: "threaten", label: "Threaten" },
            { id: "blackmail", label: "Blackmail" },
            {
              id: "eavesdrop",
              label: "Eavesdrop",
              op: "AND",
              children: [
                { id: "listen", label: "Listen to Conversation" },
                { id: "get-stated", label: "Get Target to State Combo" },
              ],
            },
            { id: "bribe", label: "Bribe" },
          ],
        },
      ],
    },
    { id: "cut-open", label: "Cut Open Safe" },
    { id: "install", label: "Install Improperly" },
  ],
};

// --- Tip 1: too specific. Each variant IS a complete attack, but the weapon
// is an irrelevant detail — compose them and the tree gets shorter and more
// general at once. ---

const overSpecific: AttackTreeSpec = {
  id: "from-target",
  label: "Get Combo From Target",
  op: "OR",
  children: [
    { id: "threaten", label: "Threaten With a Knife" },
    { id: "threaten-gun", label: "Threaten With a Gun" },
    { id: "threaten-crowbar", label: "Threaten With a Crowbar" },
    { id: "more", label: "⋯", variant: "ellipsis" },
  ],
};

const composed: AttackTreeSpec = {
  id: "from-target",
  label: "Get Combo From Target",
  op: "OR",
  children: [
    { id: "threaten", label: "Threaten" },
    { id: "blackmail", label: "Blackmail" },
    { id: "eavesdrop", label: "Eavesdrop" },
    { id: "bribe", label: "Bribe" },
  ],
};

// --- Tip 2: one overloaded node hides a whole subtree. Decomposing it both
// exposes the AND structure and makes room for attacks the compound phrasing
// was silently excluding. ---

const overloaded: AttackTreeSpec = {
  id: "open-safe",
  label: "Open Safe",
  op: "OR",
  children: [
    { id: "pick-lock", label: "Pick Lock" },
    {
      id: "learn-combo",
      label: "Learn Combo by Eavesdropping on the Target Saying the Combo",
      variant: "flag",
    },
    { id: "cut-open", label: "Cut Open Safe" },
  ],
};

const decomposed: AttackTreeSpec = {
  id: "open-safe",
  label: "Open Safe",
  op: "OR",
  children: [
    { id: "pick-lock", label: "Pick Lock" },
    {
      id: "learn-combo",
      label: "Learn Combo",
      op: "OR",
      children: [
        { id: "find-written", label: "Find Written Combo" },
        {
          id: "from-target",
          label: "Get Combo From Target",
          op: "OR",
          children: [
            { id: "threaten", label: "Threaten" },
            {
              id: "eavesdrop",
              label: "Eavesdrop",
              op: "AND",
              children: [
                { id: "listen", label: "Listen to Conversation" },
                { id: "get-stated", label: "Get Target to State Combo" },
              ],
            },
            { id: "bribe", label: "Bribe" },
          ],
        },
      ],
    },
    { id: "cut-open", label: "Cut Open Safe" },
  ],
};

export const ATTACK_TREES = {
  safe,
  overSpecific,
  composed,
  overloaded,
  decomposed,
} satisfies Record<string, AttackTreeSpec>;

export type AttackTreeName = keyof typeof ATTACK_TREES;
