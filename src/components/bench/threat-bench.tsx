"use client";

// The Threat Modelling Bench: a practice environment where the student builds
// the threat-model tree themselves — no grading, no reveals. The graph lives
// on a free canvas (see BenchCanvas): threat at the top, spline edges, one
// AND/OR gate pill per sibling bundle (AND default), node creation/editing
// on the graph itself. Turn machine: red states a strategy and maps necessary
// conditions (creating nodes) → an affordance is revealed and blue tags the
// node(s) it prevents / detects / deters → red revises (an unchanged graph
// with a changed strategy is legitimate) → next affordance. Structural edits
// are allowed only on red turns; tagging only on blue turns; renaming and
// arranging always.
//
// Persistence: localStorage per scenario (v2 adds node positions and
// descriptions; v1 states are migrated by seeding positions). The state shape
// (createdTurn on nodes, per-turn strategies) is chosen so a later feedback
// layer can replay the graph's growth without migration.

import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { animate, type AnimationHandle } from "@/lib/bench/animate";
import {
  childrenOf,
  isNearSeededLayout,
  seedPositions,
  withSeededPositions,
} from "@/lib/bench/layout";
import {
  BENCH_RELATIONS,
  BENCH_RELATION_LABELS,
  BENCH_ROOT_ID,
  canReparent,
  initialBenchState,
  phaseForTurn,
  subtreeIds,
  type BenchNode,
  type BenchPhase,
  type BenchRelation,
  type BenchScenario,
  type BenchState,
} from "@/lib/bench/types";
import { BenchCanvas, RELATION_CHIP, type BenchEditKey } from "./bench-canvas";

const HISTORY_CAP = 100;

/** Center positions of every node, for animation endpoints. */
function positionsOf(
  nodes: Record<string, BenchNode>,
): Record<string, { x: number; y: number }> {
  return Object.fromEntries(
    Object.values(nodes).map((n) => [n.id, { x: n.x ?? 0, y: n.y ?? 0 }]),
  );
}
const STOPPING_RULE =
  "Stop decomposing a node when it's (a) a choice the adversary makes, (b) a fact of the environment, or (c) something a defense could directly touch.";

function RoleBadge({ role }: { role: "red" | "blue" }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase",
        role === "red"
          ? "border-red-600/50 bg-red-500/15 text-red-700 dark:text-red-400"
          : "border-sky-600/50 bg-sky-500/15 text-sky-700 dark:text-sky-400",
      )}
    >
      {role === "red" ? "You are red" : "You are blue"}
    </span>
  );
}

/** Serialize the finished bench into vault-ready markdown. */
function toMarkdown(scenario: BenchScenario, state: BenchState): string {
  const lines: string[] = [`# ${scenario.title} — threat model (bench)`, ""];
  const affordanceIndex = (id: string) =>
    scenario.affordances.findIndex((a) => a.id === id);

  const walk = (id: string, depth: number) => {
    const node = state.nodes[id];
    const kids = childrenOf(state.nodes, id);
    const gate = kids.length >= 2 ? ` [${node.gate}]` : "";
    const description = node.description ? ` — ${node.description}` : "";
    const tags = node.tags
      .map(
        (t) =>
          ` (A${affordanceIndex(t.affordanceId) + 1} ${t.relation}: ${t.why})`,
      )
      .join("");
    lines.push(
      `${"  ".repeat(depth)}- ${node.label}${gate}${description}${tags}`,
    );
    kids.forEach((k) => walk(k.id, depth + 1));
  };
  walk(BENCH_ROOT_ID, 0);

  lines.push("", "## Rounds", "");
  for (let t = 0; t <= state.turnIndex; t++) {
    const phase = phaseForTurn(t, scenario.affordances.length);
    if (phase.kind === "red-base" && state.strategies[t]) {
      lines.push(`- **Red, base case:** ${state.strategies[t]}`);
    } else if (phase.kind === "blue") {
      const a = scenario.affordances[phase.affordanceIndex];
      lines.push(`- **Affordance A${phase.affordanceIndex + 1} — ${a.title}**`);
    } else if (phase.kind === "red-revise" && state.strategies[t]) {
      lines.push(
        `- **Red, after A${phase.affordanceIndex + 1}:** ${state.strategies[t]}`,
      );
    }
  }
  return lines.join("\n");
}

export function ThreatBench({ scenario }: { scenario: BenchScenario }) {
  const storageKey = `bench:${scenario.id}`;
  const [state, setState] = useState<BenchState | null>(null);

  // Load once on mount (localStorage is client-only).
  useEffect(() => {
    let loaded: BenchState | null = null;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as { v: number; state: BenchState };
        if (
          (parsed.v === 1 || parsed.v === 2) &&
          parsed.state?.nodes?.[BENCH_ROOT_ID]
        ) {
          loaded = parsed.state;
        }
      }
    } catch {
      // Corrupt storage — start fresh.
    }
    const base = loaded ?? initialBenchState(scenario);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ ...base, nodes: withSeededPositions(base.nodes) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  if (!state) {
    return (
      <div className="border-border bg-card text-muted-foreground rounded-lg border p-8 text-sm">
        Loading the bench…
      </div>
    );
  }

  return (
    <BenchBody
      scenario={scenario}
      storageKey={storageKey}
      state={state}
      setState={setState}
    />
  );
}

/**
 * The bench once state exists — split from the loader so every hook below
 * (autosave, history, the global keyboard handler) runs unconditionally
 * against a non-null state.
 */
function BenchBody({
  scenario,
  storageKey,
  state,
  setState,
}: {
  scenario: BenchScenario;
  storageKey: string;
  state: BenchState;
  setState: Dispatch<SetStateAction<BenchState | null>>;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagRelation, setTagRelation] = useState<BenchRelation>("prevents");
  const [tagWhy, setTagWhy] = useState("");
  const [copied, setCopied] = useState(false);
  const [exportText, setExportText] = useState<string | null>(null);
  /** Bumped to ask the canvas to re-fit the viewport (tidy add/delete). */
  const [fitNonce, setFitNonce] = useState(0);
  // Snapshot undo: state is immutable-updated, so a history entry is a free
  // reference push. Stacks clear on turn advance (undo must never un-reveal
  // an affordance) and on Reset bench. Viewport and strategy text excluded.
  const [undoStack, setUndoStack] = useState<BenchState[]>([]);
  const [redoStack, setRedoStack] = useState<BenchState[]>([]);
  /** Pulses the turn card when a gated action is attempted on the wrong turn. */
  const [gateFlash, setGateFlash] = useState(false);
  const gateFlashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animRef = useRef<AnimationHandle | null>(null);

  // Autosave, debounced — drags and tweens write many states per second.
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.localStorage.setItem(
          storageKey,
          JSON.stringify({ v: 2, state }),
        );
      } catch {
        // Storage full/unavailable — the bench still works, it just won't persist.
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [state, storageKey]);

  const phase: BenchPhase = phaseForTurn(
    state.turnIndex,
    scenario.affordances.length,
  );
  const canEditStructure =
    phase.kind === "red-base" || phase.kind === "red-revise";
  const canTag = phase.kind === "blue";
  const currentAffordance =
    phase.kind === "blue" || phase.kind === "red-revise"
      ? scenario.affordances[phase.affordanceIndex]
      : null;
  const revealedCount =
    phase.kind === "red-base"
      ? 0
      : phase.kind === "done"
        ? scenario.affordances.length
        : phase.affordanceIndex + 1;
  const selectedNodes = selectedIds
    .map((id) => state.nodes[id])
    .filter((n): n is BenchNode => Boolean(n));
  const strategy = state.strategies[state.turnIndex] ?? "";

  // --- state ops -----------------------------------------------------------

  const update = (fn: (prev: BenchState) => BenchState) =>
    setState((prev) => (prev ? fn(prev) : prev));

  const pushHistory = () => {
    setUndoStack((prev) => [...prev.slice(-(HISTORY_CAP - 1)), state]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const restored = undoStack[undoStack.length - 1];
    animRef.current?.cancel();
    setUndoStack((s) => s.slice(0, -1));
    setRedoStack((s) => [...s, state]);
    // Strategy text lives outside the undo system: carry the live drafts.
    setState({ ...restored, strategies: state.strategies });
    setSelectedIds((ids) => ids.filter((id) => restored.nodes[id]));
    setEditingId(null);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const restored = redoStack[redoStack.length - 1];
    animRef.current?.cancel();
    setRedoStack((s) => s.slice(0, -1));
    setUndoStack((s) => [...s, state]);
    setState({ ...restored, strategies: state.strategies });
    setSelectedIds((ids) => ids.filter((id) => restored.nodes[id]));
    setEditingId(null);
  };

  const flashGate = () => {
    setGateFlash(true);
    if (gateFlashTimer.current) clearTimeout(gateFlashTimer.current);
    gateFlashTimer.current = setTimeout(() => setGateFlash(false), 700);
  };

  /** Tween every shared id from `from` to `to`; other nodes are untouched. */
  const animatePositions = (
    from: Record<string, { x: number; y: number }>,
    to: Record<string, { x: number; y: number }>,
  ) => {
    animRef.current?.cancel();
    animRef.current = animate((t) => {
      update((prev) => ({
        ...prev,
        nodes: Object.fromEntries(
          Object.entries(prev.nodes).map(([id, n]) => {
            const f = from[id];
            const g = to[id];
            if (!f || !g) return [id, n];
            return [
              id,
              { ...n, x: f.x + (g.x - f.x) * t, y: f.y + (g.y - f.y) * t },
            ];
          }),
        ),
      }));
    });
  };

  const addChild = (parentId: string) => {
    const parent = state.nodes[parentId];
    if (!parent) return;
    // While the graph still sits where the tidy layout put it, adding keeps
    // it groomed: animated re-layout (the new node slots in to the right of
    // its siblings, tweening out from its parent's center) plus a viewport
    // re-fit. Once the student has arranged things manually, new nodes spawn
    // near their parent instead.
    const tidy = isNearSeededLayout(state.nodes);
    const siblings = childrenOf(state.nodes, parentId).length;
    const id = `n${state.nextSeq}`;
    pushHistory();
    const node: BenchNode = {
      id,
      label: "",
      parentId,
      gate: "AND",
      tags: [],
      createdTurn: state.turnIndex,
      seq: state.nextSeq,
      x: (parent.x ?? 0) + (tidy ? 0 : siblings * 56),
      y: (parent.y ?? 0) + (tidy ? 0 : 150),
    };
    const nodes = { ...state.nodes, [id]: node };
    setSelectedIds([id]);
    setEditingId(id);
    setState({ ...state, nextSeq: state.nextSeq + 1, nodes });
    if (tidy) {
      animatePositions(positionsOf(nodes), seedPositions(nodes));
      setFitNonce((n) => n + 1);
    }
  };

  const rename = (id: string, label: string) =>
    update((prev) => ({
      ...prev,
      nodes: { ...prev.nodes, [id]: { ...prev.nodes[id], label } },
    }));

  const setDescription = (id: string, text: string) =>
    update((prev) => ({
      ...prev,
      nodes: {
        ...prev.nodes,
        [id]: { ...prev.nodes[id], description: text || undefined },
      },
    }));

  /** Delete these heads (and their subtrees) as one undoable step. */
  const deleteHeads = (heads: string[]) => {
    const valid = heads.filter((id) => id !== BENCH_ROOT_ID && state.nodes[id]);
    if (valid.length === 0) return;
    const tidy = isNearSeededLayout(state.nodes);
    pushHistory();
    const doomed = new Set(valid.flatMap((h) => subtreeIds(state.nodes, h)));
    const nodes = Object.fromEntries(
      Object.entries(state.nodes).filter(([nid]) => !doomed.has(nid)),
    );
    setState({ ...state, nodes });
    setSelectedIds((prev) => prev.filter((nid) => !doomed.has(nid)));
    setEditingId((prev) => (prev && doomed.has(prev) ? null : prev));
    if (tidy) {
      animatePositions(positionsOf(nodes), seedPositions(nodes));
      setFitNonce((n) => n + 1);
    }
  };

  const removeSubtree = (id: string) => deleteHeads([id]);

  /** Keyboard delete: top-most selected heads only (nested selections skip). */
  const deleteSelection = () => {
    deleteHeads(
      selectedIds.filter((id) => {
        let p = state.nodes[id]?.parentId ?? null;
        while (p) {
          if (selectedIds.includes(p)) return false;
          p = state.nodes[p]?.parentId ?? null;
        }
        return true;
      }),
    );
  };

  const toggleGate = (id: string) => {
    pushHistory();
    update((prev) => ({
      ...prev,
      nodes: {
        ...prev.nodes,
        [id]: {
          ...prev.nodes[id],
          gate: prev.nodes[id].gate === "AND" ? "OR" : "AND",
        },
      },
    }));
  };

  const moveNodes = (ids: string[], dx: number, dy: number) =>
    update((prev) => {
      const nodes = { ...prev.nodes };
      for (const id of ids) {
        const n = nodes[id];
        if (n) nodes[id] = { ...n, x: (n.x ?? 0) + dx, y: (n.y ?? 0) + dy };
      }
      return { ...prev, nodes };
    });

  const resetStructure = () => {
    pushHistory();
    animatePositions(positionsOf(state.nodes), seedPositions(state.nodes));
    setFitNonce((n) => n + 1);
  };

  const reparent = (id: string, targetId: string) => {
    if (!canEditStructure || !canReparent(state.nodes, id, targetId)) return;
    // The drag that produced this drop already pushed history at drag start,
    // so the whole gesture (move + reparent) is one undo step. Tidiness is
    // judged on the pre-drag snapshot — the reparenting drag itself must not
    // count as "the student arranged the graph."
    const preDrag = undoStack[undoStack.length - 1];
    const tidy = isNearSeededLayout((preDrag ?? state).nodes);
    const target = state.nodes[targetId];
    const head = state.nodes[id];
    const priorKids = childrenOf(state.nodes, targetId).length;
    const nodes = {
      ...state.nodes,
      [id]: { ...head, parentId: targetId, seq: state.nextSeq },
    };
    setState({ ...state, nextSeq: state.nextSeq + 1, nodes });
    const from = positionsOf(nodes);
    if (tidy) {
      animatePositions(from, seedPositions(nodes));
      setFitNonce((n) => n + 1);
    } else {
      // Arranged graph: carry the subtree under its new parent, keeping the
      // subtree's internal offsets and everything else where the student
      // put it.
      const gx = (target.x ?? 0) + priorKids * 56;
      const gy = (target.y ?? 0) + 150;
      const dx = gx - (head.x ?? 0);
      const dy = gy - (head.y ?? 0);
      const to = { ...from };
      for (const sid of subtreeIds(state.nodes, id))
        to[sid] = { x: from[sid].x + dx, y: from[sid].y + dy };
      animatePositions(from, to);
    }
  };

  // --- edit sessions --------------------------------------------------------

  const beginEdit = (id: string) => {
    // One history entry per edit session (not per keystroke).
    pushHistory();
    setEditingId(id);
  };

  const finishEdit = () => {
    if (!editingId) return;
    const node = state.nodes[editingId];
    setEditingId(null);
    if (!node) return;
    const isGhost =
      node.id !== BENCH_ROOT_ID &&
      !node.label.trim() &&
      !node.description?.trim() &&
      node.tags.length === 0 &&
      childrenOf(state.nodes, node.id).length === 0;
    if (isGhost) {
      // An abandoned empty node cancels the add that created it. When the
      // top history entry IS that add (its snapshot's nextSeq equals the
      // ghost's seq), consume it — otherwise undo would carry a no-op step.
      const top = undoStack[undoStack.length - 1];
      if (top && top.nextSeq === node.seq) {
        setUndoStack((prev) => prev.slice(0, -1));
        const from = positionsOf(state.nodes);
        setState({ ...top, strategies: state.strategies });
        setSelectedIds((ids) => ids.filter((i) => top.nodes[i]));
        animatePositions(from, positionsOf(top.nodes));
        return;
      }
      const tidy = isNearSeededLayout(state.nodes);
      const nodes = Object.fromEntries(
        Object.entries(state.nodes).filter(([nid]) => nid !== node.id),
      );
      setState({ ...state, nodes });
      setSelectedIds((ids) => ids.filter((i) => i !== node.id));
      if (tidy) {
        animatePositions(positionsOf(nodes), seedPositions(nodes));
        setFitNonce((n) => n + 1);
      }
    } else if (
      undoStack.length > 0 &&
      undoStack[undoStack.length - 1] === state
    ) {
      // The edit session changed nothing — drop its no-op history entry.
      setUndoStack((prev) => prev.slice(0, -1));
    }
  };

  /** Keys pressed inside a node's inline editor (canvas forwards them). */
  const handleEditKey = (id: string, key: BenchEditKey) => {
    const node = state.nodes[id];
    const hadLabel = !!node?.label.trim();
    finishEdit();
    if (!node) return;
    if (key === "tab" && hadLabel) {
      // Commit and go deeper: a child of the node just edited.
      if (canEditStructure) addChild(id);
      else flashGate();
    } else if (key === "enter" && hadLabel && node.parentId) {
      // The mind-map chain: commit and start the next sibling.
      if (canEditStructure) addChild(node.parentId);
      else flashGate();
    }
  };

  // Global keyboard model. Re-attached each render so the handlers close
  // over fresh state; field-level keys are handled on the fields themselves
  // (the `typing` guard) so native input editing and undo stay untouched.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        !!t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable);
      if ((e.ctrlKey || e.metaKey) && !typing) {
        const k = e.key.toLowerCase();
        if (k === "z" && !e.shiftKey) {
          e.preventDefault();
          undo();
          return;
        }
        if ((k === "z" && e.shiftKey) || k === "y") {
          e.preventDefault();
          redo();
          return;
        }
      }
      if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Tab" && !editingId && selectedIds.length === 1) {
        e.preventDefault();
        if (canEditStructure) addChild(selectedIds[0]);
        else flashGate();
      } else if (
        (e.key === "Enter" || e.key === "F2") &&
        !editingId &&
        selectedIds.length === 1
      ) {
        e.preventDefault();
        beginEdit(selectedIds[0]);
      } else if (
        (e.key === "Delete" || e.key === "Backspace") &&
        !editingId &&
        selectedIds.length > 0
      ) {
        e.preventDefault();
        if (canEditStructure) deleteSelection();
        else flashGate();
      } else if (e.key === "Escape") {
        if (editingId) finishEdit();
        else setSelectedIds([]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const addTagToSelection = () => {
    if (!currentAffordance || !tagWhy.trim() || selectedIds.length === 0)
      return;
    update((prev) => {
      const nodes = { ...prev.nodes };
      for (const id of selectedIds) {
        const node = nodes[id];
        if (!node) continue;
        nodes[id] = {
          ...node,
          tags: [
            ...node.tags.filter((t) => t.affordanceId !== currentAffordance.id),
            {
              affordanceId: currentAffordance.id,
              relation: tagRelation,
              why: tagWhy.trim(),
            },
          ],
        };
      }
      return { ...prev, nodes };
    });
    setTagWhy("");
  };

  const removeTag = (nodeId: string, affordanceId: string) =>
    update((prev) => {
      const node = prev.nodes[nodeId];
      return {
        ...prev,
        nodes: {
          ...prev.nodes,
          [nodeId]: {
            ...node,
            tags: node.tags.filter((t) => t.affordanceId !== affordanceId),
          },
        },
      };
    });

  const setStrategy = (text: string) =>
    update((prev) => ({
      ...prev,
      strategies: { ...prev.strategies, [prev.turnIndex]: text },
    }));

  const canAdvance = (() => {
    if (phase.kind === "done") return false;
    if (phase.kind === "blue") {
      return Object.values(state.nodes).some((n) =>
        n.tags.some((t) => t.affordanceId === currentAffordance?.id),
      );
    }
    const hasStrategy = strategy.trim().length > 0;
    if (phase.kind === "red-base") {
      return hasStrategy && childrenOf(state.nodes, BENCH_ROOT_ID).length > 0;
    }
    return hasStrategy;
  })();

  const advance = () => {
    finishEdit();
    // A locked turn is a commitment: undo must not cross it.
    setUndoStack([]);
    setRedoStack([]);
    update((prev) => ({ ...prev, turnIndex: prev.turnIndex + 1 }));
  };

  const reset = () => {
    if (
      !window.confirm(
        "Reset the bench? Your graph and every round's strategy will be erased.",
      )
    )
      return;
    const base = initialBenchState(scenario);
    animRef.current?.cancel();
    setState({ ...base, nodes: withSeededPositions(base.nodes) });
    setSelectedIds([]);
    setEditingId(null);
    setUndoStack([]);
    setRedoStack([]);
  };

  const copyMarkdown = async () => {
    const md = toMarkdown(scenario, state);
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — show the markdown for manual copying instead.
      setExportText(md);
    }
  };

  const advanceLabel =
    phase.kind === "red-base"
      ? "Lock strategy → reveal the first affordance"
      : phase.kind === "blue"
        ? "Done tagging → back to red"
        : phase.kind === "red-revise" &&
            phase.affordanceIndex === scenario.affordances.length - 1
          ? "Lock revision → finish"
          : "Lock revision → reveal the next affordance";

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      {/* ------------------------------------------------ the graph canvas */}
      <BenchCanvas
        nodes={state.nodes}
        affordances={scenario.affordances}
        rootSub={scenario.rootSub}
        selectedIds={selectedIds}
        editingId={editingId}
        canEditStructure={canEditStructure}
        fitNonce={fitNonce}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={undo}
        onRedo={redo}
        onSelect={setSelectedIds}
        onToggleSelect={(id) =>
          setSelectedIds((prev) =>
            prev.includes(id)
              ? prev.filter((x) => x !== id)
              : [...prev, id],
          )
        }
        onBeginEdit={beginEdit}
        onEndEdit={finishEdit}
        onEditKey={handleEditKey}
        onRename={rename}
        onSetDescription={setDescription}
        onAddChild={addChild}
        onDelete={removeSubtree}
        onToggleGate={toggleGate}
        onMoveNodes={moveNodes}
        onBeginNodeDrag={pushHistory}
        onReparent={reparent}
        onResetStructure={resetStructure}
      />

      {/* --------------------------------------------------- control panel */}
      <div className="space-y-3">
        {/* Turn card */}
        <div
          className={cn(
            "border-border bg-card rounded-xl border p-4 transition-shadow duration-300",
            gateFlash && "ring-2 ring-red-500/70",
          )}
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            {phase.kind === "done" ? (
              <span className="flex items-center gap-1 text-sm font-medium">
                <Check className="size-4 text-emerald-500" aria-hidden /> Bench
                complete
              </span>
            ) : (
              <RoleBadge role={phase.kind === "blue" ? "blue" : "red"} />
            )}
            <span className="text-muted-foreground text-xs tabular-nums">
              {revealedCount}/{scenario.affordances.length} affordances
            </span>
          </div>

          {phase.kind === "red-base" && (
            <div className="space-y-2 text-sm">
              <p>
                The system has no measures beyond the world card. What&apos;s
                your best strategy as the attacker? Commit it — then map the
                necessary conditions: hover the threat at the top and use{" "}
                <strong>+</strong> to build the tree of what must <em>all</em>{" "}
                be true for it to occur.
              </p>
              <Textarea
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                placeholder="Red's best strategy in the bare system…"
                rows={3}
                className="resize-y"
              />
              <p className="text-muted-foreground text-xs">{STOPPING_RULE}</p>
            </div>
          )}

          {phase.kind === "blue" && currentAffordance && (
            <div className="space-y-2 text-sm">
              <p className="font-medium">
                Affordance A{phase.affordanceIndex + 1} —{" "}
                {currentAffordance.title}
              </p>
              <p className="text-muted-foreground">{currentAffordance.grant}</p>
              <p>
                Which node(s) does this measure <strong>prevent</strong>,{" "}
                <strong>detect</strong>, or <strong>deter</strong>? Select
                nodes on the graph (Shift-click for several) and tag them, with
                a sentence on why.
              </p>
            </div>
          )}

          {phase.kind === "red-revise" && currentAffordance && (
            <div className="space-y-2 text-sm">
              <p>
                The defense changed: <em>{currentAffordance.title}</em> is now
                in place, and you know exactly how it works. What&apos;s your
                best strategy now — and what does a successful attack require
                that it didn&apos;t before? Revise the graph if new conditions
                exist.
              </p>
              <p className="text-muted-foreground text-xs">
                An unchanged graph with a changed strategy is a legitimate
                answer — a defense often moves <em>where you sit</em> on a
                choice rather than adding a condition.
              </p>
              <Textarea
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                placeholder="Red's best strategy against the new defense…"
                rows={3}
                className="resize-y"
              />
              <p className="text-muted-foreground text-xs">{STOPPING_RULE}</p>
            </div>
          )}

          {phase.kind === "done" && (
            <div className="space-y-2 text-sm">
              <p>
                Every affordance is on the board. The graph and your round-by-
                round strategies below are the artifact — there&apos;s no
                answer key here, deliberately.
              </p>
              <Button size="sm" variant="outline" onClick={copyMarkdown}>
                {copied ? "Copied" : "Copy as markdown"}
              </Button>
              {exportText && (
                <Textarea
                  readOnly
                  value={exportText}
                  rows={10}
                  className="mt-2 font-mono text-xs"
                  onFocus={(e) => e.target.select()}
                />
              )}
            </div>
          )}

          {phase.kind !== "done" && (
            <Button
              size="sm"
              className="mt-3 w-full"
              disabled={!canAdvance}
              onClick={advance}
            >
              {advanceLabel}
            </Button>
          )}
        </div>

        {/* Selection */}
        {selectedNodes.length > 0 && (
          <div className="border-border bg-card rounded-xl border p-4">
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
              Selected ({selectedNodes.length})
            </p>
            <ul className="space-y-0.5 text-sm">
              {selectedNodes.map((node) => (
                <li key={node.id} className="truncate">
                  {node.label || (
                    <span className="text-muted-foreground italic">
                      unnamed condition
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {!canEditStructure && phase.kind !== "done" && (
              <p className="text-muted-foreground mt-2 text-xs">
                Adding and deleting nodes unlocks on red turns.
              </p>
            )}

            {/* Existing tags — shown for a single selection. */}
            {selectedNodes.length === 1 && selectedNodes[0].tags.length > 0 && (
              <ul className="mt-3 space-y-1">
                {selectedNodes[0].tags.map((tag) => {
                  const idx = scenario.affordances.findIndex(
                    (a) => a.id === tag.affordanceId,
                  );
                  const removable =
                    canTag && tag.affordanceId === currentAffordance?.id;
                  return (
                    <li
                      key={tag.affordanceId}
                      className="text-muted-foreground flex items-start gap-1.5 text-xs"
                    >
                      <span
                        className={cn(
                          "mt-0.5 rounded-full border px-1.5 text-[9px] font-semibold",
                          RELATION_CHIP[tag.relation],
                        )}
                      >
                        A{idx + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        {BENCH_RELATION_LABELS[tag.relation]} — {tag.why}
                      </span>
                      {removable && (
                        <button
                          type="button"
                          onClick={() =>
                            removeTag(selectedNodes[0].id, tag.affordanceId)
                          }
                          className="hover:text-foreground underline"
                        >
                          remove
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Tagging (blue turns only) — applies to every selected node. */}
            {canTag && currentAffordance && (
              <div className="border-border mt-3 space-y-2 border-t pt-3">
                <p className="text-xs font-medium">
                  Tag {selectedNodes.length > 1 ? "all selected" : "this node"}{" "}
                  with A
                  {(phase as { affordanceIndex: number }).affordanceIndex + 1} (
                  {currentAffordance.title}):
                </p>
                <div className="flex gap-1.5">
                  {BENCH_RELATIONS.map((relation) => (
                    <button
                      key={relation}
                      type="button"
                      onClick={() => setTagRelation(relation)}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-xs",
                        relation === tagRelation
                          ? RELATION_CHIP[relation]
                          : "border-border text-muted-foreground",
                      )}
                    >
                      {BENCH_RELATION_LABELS[relation]}
                    </button>
                  ))}
                </div>
                <Textarea
                  value={tagWhy}
                  onChange={(e) => setTagWhy(e.target.value)}
                  placeholder="Why does this measure touch these node(s)?"
                  rows={2}
                  className="resize-y text-sm"
                />
                <Button
                  size="sm"
                  disabled={!tagWhy.trim()}
                  onClick={addTagToSelection}
                >
                  Tag {selectedNodes.length > 1 ? `${selectedNodes.length} nodes` : "node"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* World card */}
        <details
          className="border-border bg-card rounded-xl border p-4"
          open={phase.kind === "red-base" ? true : undefined}
        >
          <summary className="text-muted-foreground cursor-pointer text-xs font-semibold tracking-wide uppercase">
            The world & red&apos;s wall
          </summary>
          <div className="mt-2 space-y-2 text-sm">
            {scenario.worldCard.map((para) => (
              <p key={para.slice(0, 40)} className="text-muted-foreground">
                {para}
              </p>
            ))}
            <p className="text-foreground text-xs font-semibold tracking-wide uppercase">
              Red&apos;s wall
            </p>
            <ul className="text-muted-foreground list-disc space-y-1 pl-5">
              {scenario.redWall.map((line) => (
                <li key={line.slice(0, 40)}>{line}</li>
              ))}
            </ul>
          </div>
        </details>

        {/* Affordance list */}
        <div className="border-border bg-card rounded-xl border p-4">
          <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
            Blue affordances
          </p>
          <ul className="space-y-1.5">
            {scenario.affordances.map((affordance, i) => {
              const isRevealed = i < revealedCount;
              const isCurrent = currentAffordance?.id === affordance.id;
              return (
                <li
                  key={affordance.id}
                  className={cn(
                    "flex items-center gap-2 text-sm",
                    !isRevealed && "text-muted-foreground/60",
                    isCurrent && "font-medium",
                  )}
                >
                  <span className="text-muted-foreground text-xs tabular-nums">
                    A{i + 1}
                  </span>
                  {isRevealed ? affordance.title : "Locked — revealed in turn"}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Round log */}
        {state.turnIndex > 0 && (
          <div className="border-border bg-card rounded-xl border p-4">
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
              Round log
            </p>
            <ul className="space-y-1.5 text-xs">
              {Array.from({ length: state.turnIndex }, (_, t) => {
                const p = phaseForTurn(t, scenario.affordances.length);
                if (p.kind === "red-base") {
                  return (
                    <li key={t} className="text-muted-foreground">
                      <span className="text-red-700 font-semibold dark:text-red-400">
                        Red (base):
                      </span>{" "}
                      {state.strategies[t]}
                    </li>
                  );
                }
                if (p.kind === "blue") {
                  return (
                    <li key={t} className="text-muted-foreground">
                      <span className="text-sky-700 font-semibold dark:text-sky-400">
                        Blue:
                      </span>{" "}
                      A{p.affordanceIndex + 1} —{" "}
                      {scenario.affordances[p.affordanceIndex].title} revealed
                      and tagged.
                    </li>
                  );
                }
                if (p.kind === "red-revise") {
                  return (
                    <li key={t} className="text-muted-foreground">
                      <span className="text-red-700 font-semibold dark:text-red-400">
                        Red (after A{p.affordanceIndex + 1}):
                      </span>{" "}
                      {state.strategies[t]}
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>
        )}

        <Button
          size="sm"
          variant="ghost"
          onClick={reset}
          className="text-muted-foreground hover:text-foreground gap-1"
        >
          <RotateCcw className="size-3.5" aria-hidden /> Reset bench
        </Button>
      </div>
    </div>
  );
}
