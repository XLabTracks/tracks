"use client";

// The Threat Modelling Bench: a practice environment where the student builds
// the threat-model tree themselves — no grading, no reveals. The graph is a
// node tree with the threat at the top; edges are splines; each sibling
// bundle carries one AND/OR gate pill owned by the parent (AND by default).
// Turn machine: red states a strategy and maps necessary conditions (creating
// nodes) → an affordance is revealed and blue tags the node(s) it prevents /
// detects / deters → red revises (an unchanged graph with a changed strategy
// is legitimate) → next affordance. Structural edits are allowed only on red
// turns; tagging only on blue turns; renaming always.
//
// Persistence: localStorage per scenario (v1 — no accounts, no server). The
// state shape (createdTurn on nodes, per-turn strategies) is chosen so a
// later feedback layer can replay the graph's growth without migration.

import { useEffect, useMemo, useState } from "react";
import { Check, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { childrenOf, layoutTree } from "@/lib/bench/layout";
import {
  BENCH_RELATIONS,
  BENCH_RELATION_LABELS,
  BENCH_ROOT_ID,
  initialBenchState,
  phaseForTurn,
  subtreeIds,
  type BenchNode,
  type BenchPhase,
  type BenchRelation,
  type BenchScenario,
  type BenchState,
} from "@/lib/bench/types";

const STOPPING_RULE =
  "Stop decomposing a node when it's (a) a choice the adversary makes, (b) a fact of the environment, or (c) something a defense could directly touch.";

const RELATION_CHIP: Record<BenchRelation, string> = {
  prevents:
    "border-emerald-600/50 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  detects: "border-sky-600/50 bg-sky-500/15 text-sky-700 dark:text-sky-400",
  deters:
    "border-amber-600/50 bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

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
    const tags = node.tags
      .map(
        (t) =>
          ` (A${affordanceIndex(t.affordanceId) + 1} ${t.relation}: ${t.why})`,
      )
      .join("");
    lines.push(`${"  ".repeat(depth)}- ${node.label}${gate}${tags}`);
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tagRelation, setTagRelation] = useState<BenchRelation>("prevents");
  const [tagWhy, setTagWhy] = useState("");
  const [copied, setCopied] = useState(false);
  const [exportText, setExportText] = useState<string | null>(null);

  // Load once on mount (localStorage is client-only), then autosave.
  useEffect(() => {
    let loaded: BenchState | null = null;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as { v: number; state: BenchState };
        if (parsed.v === 1 && parsed.state?.nodes?.[BENCH_ROOT_ID]) {
          loaded = parsed.state;
        }
      }
    } catch {
      // Corrupt storage — start fresh.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loaded ?? initialBenchState(scenario));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    if (state) {
      try {
        window.localStorage.setItem(
          storageKey,
          JSON.stringify({ v: 1, state }),
        );
      } catch {
        // Storage full/unavailable — the bench still works, it just won't persist.
      }
    }
  }, [state, storageKey]);

  const layout = useMemo(
    () => (state ? layoutTree(state.nodes) : null),
    [state],
  );

  if (!state || !layout) {
    return (
      <div className="border-border bg-card text-muted-foreground rounded-lg border p-8 text-sm">
        Loading the bench…
      </div>
    );
  }

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
  const selected = selectedId ? (state.nodes[selectedId] ?? null) : null;
  const strategy = state.strategies[state.turnIndex] ?? "";

  // --- state ops -----------------------------------------------------------

  const update = (fn: (prev: BenchState) => BenchState) =>
    setState((prev) => (prev ? fn(prev) : prev));

  const addChild = (parentId: string) => {
    setSelectedId(`n${state.nextSeq}`);
    update((prev) => {
      const id = `n${prev.nextSeq}`;
      const node: BenchNode = {
        id,
        label: "",
        parentId,
        gate: "AND",
        tags: [],
        createdTurn: prev.turnIndex,
        seq: prev.nextSeq,
      };
      return {
        ...prev,
        nextSeq: prev.nextSeq + 1,
        nodes: { ...prev.nodes, [id]: node },
      };
    });
  };

  const rename = (id: string, label: string) =>
    update((prev) => ({
      ...prev,
      nodes: { ...prev.nodes, [id]: { ...prev.nodes[id], label } },
    }));

  const removeSubtree = (id: string) => {
    if (
      !window.confirm(
        "Delete this node and everything under it? This can't be undone.",
      )
    )
      return;
    update((prev) => {
      const doomed = new Set(subtreeIds(prev.nodes, id));
      const nodes = Object.fromEntries(
        Object.entries(prev.nodes).filter(([nid]) => !doomed.has(nid)),
      );
      return { ...prev, nodes };
    });
    setSelectedId(null);
  };

  const toggleGate = (id: string) =>
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

  const addTag = (nodeId: string) => {
    if (!currentAffordance || !tagWhy.trim()) return;
    update((prev) => {
      const node = prev.nodes[nodeId];
      const tags = [
        ...node.tags.filter((t) => t.affordanceId !== currentAffordance.id),
        {
          affordanceId: currentAffordance.id,
          relation: tagRelation,
          why: tagWhy.trim(),
        },
      ];
      return { ...prev, nodes: { ...prev.nodes, [nodeId]: { ...node, tags } } };
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

  const advance = () =>
    update((prev) => ({ ...prev, turnIndex: prev.turnIndex + 1 }));

  const reset = () => {
    if (
      !window.confirm(
        "Reset the bench? Your graph and every round's strategy will be erased.",
      )
    )
      return;
    setState(initialBenchState(scenario));
    setSelectedId(null);
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

  // --- advance-button label ------------------------------------------------

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
      <div className="border-border bg-card min-h-[280px] overflow-auto rounded-xl border">
        <svg
          width={Math.max(layout.width, 560)}
          height={Math.max(layout.height, 260)}
          className="block"
          onClick={() => setSelectedId(null)}
          role="application"
          aria-label="Your threat-model tree: the threat at the top, necessary conditions below it. Select a node to edit it in the panel."
        >
          <g
            transform={`translate(${Math.max(
              0,
              (Math.max(layout.width, 560) - layout.width) / 2,
            )}, 0)`}
          >
          {layout.edges.map((edge) => (
            <path
              key={`${edge.from}-${edge.to}`}
              d={edge.path}
              fill="none"
              className="stroke-muted-foreground/50"
              strokeWidth={1.25}
            />
          ))}

          {layout.pills.map((pill) => (
            <g
              key={pill.parentId}
              onClick={(e) => {
                e.stopPropagation();
                if (canEditStructure) toggleGate(pill.parentId);
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
                  "fill-muted stroke-border",
                  canEditStructure && "hover:stroke-foreground/60",
                )}
                strokeWidth={1}
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

          {layout.nodes.map((p) => {
            const isRoot = p.node.id === BENCH_ROOT_ID;
            const isSelected = p.node.id === selectedId;
            return (
              <foreignObject key={p.node.id} x={p.x} y={p.y} width={p.w} height={p.h}>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(p.node.id);
                  }}
                  className={cn(
                    "flex h-full cursor-pointer flex-col justify-center rounded-lg border px-2 py-1 text-center",
                    isRoot
                      ? "border-red-600/70 bg-red-500/10"
                      : "border-border bg-card",
                    isSelected && "ring-foreground/60 ring-2",
                  )}
                >
                  <p
                    className={cn(
                      "text-foreground line-clamp-2 text-[11px] leading-tight font-medium",
                      !p.node.label && "text-muted-foreground italic",
                    )}
                  >
                    {p.node.label || "unnamed condition"}
                  </p>
                  {isRoot && scenario.rootSub && (
                    <p className="text-muted-foreground mt-0.5 text-[8.5px]">
                      {scenario.rootSub}
                    </p>
                  )}
                  {p.node.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap justify-center gap-1">
                      {p.node.tags.map((tag) => (
                        <span
                          key={tag.affordanceId}
                          title={`${BENCH_RELATION_LABELS[tag.relation]}: ${tag.why}`}
                          className={cn(
                            "rounded-full border px-1.5 text-[8px] font-semibold",
                            RELATION_CHIP[tag.relation],
                          )}
                        >
                          A
                          {scenario.affordances.findIndex(
                            (a) => a.id === tag.affordanceId,
                          ) + 1}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </foreignObject>
            );
          })}
          </g>
        </svg>
      </div>

      {/* --------------------------------------------------- control panel */}
      <div className="space-y-3">
        {/* Turn card */}
        <div className="border-border bg-card rounded-xl border p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            {phase.kind === "done" ? (
              <span className="flex items-center gap-1 text-sm font-medium">
                <Check className="size-4 text-emerald-500" aria-hidden /> Bench
                complete
              </span>
            ) : (
              <RoleBadge
                role={phase.kind === "blue" ? "blue" : "red"}
              />
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
                necessary conditions: select the threat at the top and build the
                tree of what must <em>all</em> be true for it to occur.
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
                <strong>detect</strong>, or <strong>deter</strong>? Select a
                node on the graph and tag it, with a sentence on why.
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

        {/* Selected node */}
        {selected && (
          <div className="border-border bg-card rounded-xl border p-4">
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
              Selected node
            </p>
            <input
              key={selected.id}
              type="text"
              value={selected.label}
              maxLength={120}
              placeholder="Name the condition…"
              disabled={selected.id === BENCH_ROOT_ID}
              autoFocus={selected.label === ""}
              onChange={(e) => rename(selected.id, e.target.value)}
              className="border-border bg-background text-foreground w-full rounded-md border px-2 py-1.5 text-sm disabled:opacity-60"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {canEditStructure && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={() => addChild(selected.id)}
                >
                  <Plus className="size-3.5" aria-hidden /> Add condition below
                </Button>
              )}
              {canEditStructure &&
                childrenOf(state.nodes, selected.id).length >= 2 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleGate(selected.id)}
                  >
                    Gate: {selected.gate} → toggle
                  </Button>
                )}
              {canEditStructure && selected.id !== BENCH_ROOT_ID && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive gap-1"
                  onClick={() => removeSubtree(selected.id)}
                >
                  <Trash2 className="size-3.5" aria-hidden /> Delete
                </Button>
              )}
            </div>
            {!canEditStructure && phase.kind !== "done" && (
              <p className="text-muted-foreground mt-2 text-xs">
                Structural edits unlock on red turns.
              </p>
            )}

            {/* Existing tags */}
            {selected.tags.length > 0 && (
              <ul className="mt-3 space-y-1">
                {selected.tags.map((tag) => {
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
                            removeTag(selected.id, tag.affordanceId)
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

            {/* Tagging (blue turns only) */}
            {canTag && currentAffordance && (
              <div className="border-border mt-3 space-y-2 border-t pt-3">
                <p className="text-xs font-medium">
                  Tag with A{(phase as { affordanceIndex: number }).affordanceIndex + 1}{" "}
                  ({currentAffordance.title}):
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
                  placeholder="Why does this measure touch this node?"
                  rows={2}
                  className="resize-y text-sm"
                />
                <Button
                  size="sm"
                  disabled={!tagWhy.trim()}
                  onClick={() => addTag(selected.id)}
                >
                  Tag node
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
