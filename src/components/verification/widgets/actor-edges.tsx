"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CircleAlert, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { OptionalPrefix } from "@/components/content/optional-tag";
import { cn } from "@/lib/utils";
import { ACTOR_ROLES, type ActorRoleId } from "@/lib/verification/data/actor-map";
import {
  CLOSING_KEY,
  CLOSING_QUESTIONS,
  EDGE_FINDING,
  EDGE_KEY,
  EDGE_NOTES,
  MAP_FINDING,
  MAP_LABEL,
  RECALL_TARGET,
  RING_KEY,
  SECOND_ORDER,
  SUBGOALS,
  WORKSHOP_ACTORS,
  WORKSHOP_MARKS_KEY,
  WORKSHOP_NOTES_KEY,
  type WorkshopActorId,
} from "@/lib/verification/data/actor-workshop";
import { edgeId, scoreEdges } from "@/lib/verification/actor-workshop";
import { ChoiceList } from "../kit/choice-list";
import { MarkingKeyPanel } from "../kit/marking-key";
import { QuestionWorkspace } from "../kit/question-workspace";
import { SegMeter } from "../kit/seg-meter";
import type { VerificationWidgetProps } from "../kit/types";
import {
  BakerLine,
  KEY_EDGE_IDS,
  RingMap,
  RosterGate,
  ROLE_TOKENS,
  edgeLabel,
  useBoard,
  type EdgeStep,
  type MapEdge,
} from "./actor-board";

/**
 * 1.2.2 — Who can prove what. The Actor Map Workshop's second half.
 *
 * It was steps 6 and 7 of one seven-step widget in 1.2, which measured
 * seventy-seven minutes against a forty-minute ceiling. Moving it here is a
 * promotion rather than a cut: the mechanisms are what the section is for,
 * and they now have a page instead of a tail. ./actor-board.tsx holds the
 * document they share with 1.2 and says the rest.
 *
 * WHAT IS BAKER'S AND WHAT IS OURS is in data/actor-workshop.ts, and the two
 * tripwires in actor-workshop.test.ts hold every quotation on this page to
 * the committed artifact or to 1.2's own body. Read that header before
 * rewriting any of this prose.
 *
 * IT WORKS WITHOUT 1.2. A reader who lands here first sees the key placement
 * and is told so; the alternative is a gate, and the edge exercise is about
 * mechanisms rather than about having visited another page.
 */

const STEPS: { id: EdgeStep; name: string; beeck: string }[] = [
  // Beeck's own reason for drawing rings is to see dependencies between
  // stakeholders; until this exercise the workshop drew the rings and never
  // the dependencies. Its key is Baker's, not the course's.
  { id: "edges", name: "Draw the edges", beeck: "Political analysis" },
  { id: "map", name: "Read the map", beeck: "Political analysis · Actions" },
];

const STEP_IDS = STEPS.map((s) => s.id);

export function ActorEdges({ onComplete }: VerificationWidgetProps) {
  const [saved, persist, hydrated] = useBoard();
  const [edgeSource, setEdgeSource] = useState<WorkshopActorId | null>(null);
  const [lens, setLens] = useState<ActorRoleId | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  if (!hydrated) return <div className="not-prose my-6 min-h-96" aria-busy />;

  const stepIndex = Math.max(0, STEP_IDS.indexOf(saved.edgeStep));
  const step = STEPS[stepIndex]!;
  const go = (id: EdgeStep) => {
    persist((prev) => ({ ...prev, edgeStep: id }));
    topRef.current?.scrollIntoView({ block: "nearest" });
  };
  const editEdges = () => {
    persist((prev) => ({ ...prev, edgeStep: "edges", edgesDone: false }));
    setEdgeSource(null);
    topRef.current?.scrollIntoView({ block: "nearest" });
  };

  const edgeScore = scoreEdges(saved.edges, KEY_EDGE_IDS);
  const ringsRight = WORKSHOP_ACTORS.filter(
    (a) => saved.rings[a.id] === RING_KEY[a.id],
  ).length;

  /* What the map draws: whatever is drawn while drawing, and the marked
     version once committed — what was found, what was inverted, what was
     invented, and the key edges never drawn. */
  const mapEdges: MapEdge[] = !saved.edgesDone
    ? saved.edges.map((id) => ({ id, state: "drawn" as const }))
    : [
        ...edgeScore.found.map((id) => ({ id, state: "right" as const })),
        ...edgeScore.reversed.map((id) => ({ id, state: "wrong" as const })),
        ...edgeScore.extra.map((id) => ({ id, state: "wrong" as const })),
        ...edgeScore.missed.map((id) => ({ id, state: "missed" as const })),
      ];

  const toggleEdge = (id: string) =>
    persist((prev) => ({
      ...prev,
      edges: prev.edges.includes(id)
        ? prev.edges.filter((edge) => edge !== id)
        : [...prev.edges, id],
    }));

  return (
    <div className="not-prose my-6 space-y-4" ref={topRef}>
      <div className="border-border bg-card rounded-xl border p-4">
        <p className="eyebrow text-muted-foreground">The brief</p>
        <p className="mt-1.5 text-sm leading-relaxed">
          Same agreement, same board: no training runs above a compute
          threshold for three months. 1.2 asked what part each actor plays in a
          declaration. This asks what a verifier could actually do with them —
          who can produce evidence about whom, and which of the four things a
          verifier has to establish that evidence would settle.
        </p>
        {saved.ringsDone ? null : (
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            You have not placed this board yourself — the rings below are the
            key, not your answer. Placing it is{" "}
            <Link
              className="text-link underline underline-offset-4"
              href="/tracks/verification/policy-scoping/scoping-actors"
            >
              the workshop in 1.2
            </Link>
            , and it is worth doing first. Nothing here is gated on it.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="text-base font-semibold">
          {stepIndex + 1}. {step.name}
        </h4>
        <p className="text-muted-foreground text-xs">
          Step {stepIndex + 1} of {STEPS.length} · {step.beeck}
        </p>
      </div>
      <SegMeter
        total={STEPS.length}
        filled={(i) => i <= stepIndex}
        label={`Step ${stepIndex + 1} of ${STEPS.length}`}
      />

      {saved.edgeStep === "map" && saved.edgesDone ? (
        <div>
          <Button size="sm" variant="outline" onClick={editEdges}>
            Edit my edges
          </Button>
        </div>
      ) : null}

      {saved.edgeStep === "edges" && !saved.edgesDone ? (
        <EdgeDrawingTask />
      ) : null}

      <RingMap
        rings={saved.ringsDone ? RING_KEY : { ...RING_KEY, ...saved.rings }}
        showKey
        lens={saved.edgeStep === "map" ? lens : null}
        edges={mapEdges}
        interactive={saved.edgeStep === "edges" && !saved.edgesDone}
        selectedSource={edgeSource}
        onSource={setEdgeSource}
        onToggleEdge={toggleEdge}
      />

      {saved.edgeStep === "map" ? (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-muted-foreground mr-1 text-xs">Light up a role:</span>
          {ACTOR_ROLES.map((role, i) => (
            <button
              key={role.id}
              type="button"
              aria-pressed={lens === role.id}
              onClick={() => setLens(lens === role.id ? null : role.id)}
              className={cn(
                "border-border rounded-lg border px-2.5 py-1.5 text-xs transition-colors",
                lens === role.id ? "border-primary bg-primary/10 font-medium" : "hover:bg-muted",
              )}
              style={{ color: lens === role.id ? ROLE_TOKENS[i % ROLE_TOKENS.length] : undefined }}
            >
              {role.name}
            </button>
          ))}
        </div>
      ) : null}

      <RosterGate
        peeked={saved.peeked}
        onPeek={() => persist((prev) => ({ ...prev, peeked: true }))}
      />

      {saved.edgeStep === "edges" ? (
        <EdgesStep
          drawn={saved.edges}
          done={saved.edgesDone}
          score={edgeScore}
          source={edgeSource}
          onSource={setEdgeSource}
          onToggle={toggleEdge}
          onCommit={() => persist((prev) => ({ ...prev, edgesDone: true }))}
          onEdit={editEdges}
          onNext={() => go("map")}
        />
      ) : null}

      {saved.edgeStep === "map" ? (
        <MapStep
          peeked={saved.peeked}
          ringsRight={ringsRight}
          edgesRight={edgeScore.found.length}
          recalledCount={saved.recallChecked.length}
          secondOrder={saved.secondOrder}
          secondOrderDone={saved.secondOrderDone}
          onSecondOrder={(id) => persist((prev) => ({ ...prev, secondOrder: id }))}
          onCommitSecondOrder={() => {
            persist((prev) => ({ ...prev, secondOrderDone: true }));
            onComplete?.();
          }}
        />
      ) : null}

      {stepIndex > 0 ? (
        <div>
          <Button size="sm" variant="ghost" onClick={() => go(STEP_IDS[stepIndex - 1]!)}>
            ← {STEPS[stepIndex - 1]!.name}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ steps -- */

function EdgeDrawingTask() {
  return (
    <div className="border-border bg-card rounded-xl border p-4">
      <p className="eyebrow text-muted-foreground">What an edge means</p>
      <p className="mt-1.5 text-sm leading-relaxed">
        Draw an edge from <strong>A</strong> to <strong>B</strong> when A can
        produce evidence about B, for a verifier, that B did not have to
        volunteer. Not influence, not dependence — evidence. Direction is the
        claim: a cloud provider holds records about a lab’s training run, and
        the lab holds nothing comparable about the cloud. A verifier can be
        its own source, so an edge may start on the third ring.
      </p>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        On the graph, drag from the actor that produces the evidence to the
        actor the evidence concerns. You can also select one point and then
        another; the lists below remain available as a keyboard-friendly
        alternative.
      </p>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        Some actors will end up with no edge at all. That is an available
        answer and, for most of them, the right one. One of them can hold no
        edge in principle — the hollow ring on the map is a body that does
        not exist, and nothing that does not exist produces evidence.
      </p>

      <div className="border-border mt-4 border-t pt-4">
        <p className="text-sm font-medium">
          What a verifier has to establish, in four parts
        </p>
        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
          Baker et al. decompose it this way, and the key tags every edge with
          the part it serves. Draw an edge when you can say which of these four
          it would help settle.
        </p>
        <ol className="mt-2 space-y-1 text-sm">
          {SUBGOALS.map((subgoal) => (
            <li key={subgoal.id}>
              <span className="font-medium">{subgoal.label}.</span>{" "}
              <span className="text-muted-foreground">{subgoal.name}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function EdgesStep({
  drawn,
  done,
  score,
  source,
  onSource,
  onToggle,
  onCommit,
  onEdit,
  onNext,
}: {
  drawn: string[];
  done: boolean;
  score: ReturnType<typeof scoreEdges>;
  source: WorkshopActorId | null;
  onSource: (id: WorkshopActorId) => void;
  onToggle: (edge: string) => void;
  onCommit: () => void;
  onEdit: () => void;
  onNext: () => void;
}) {
  const perSubgoal = SUBGOALS.map((s) => ({
    subgoal: s,
    edges: EDGE_KEY.filter((e) => e.subgoal === s.id),
  }));

  return (
    <div className="space-y-4">
      {done ? (
        <EdgesVerdict
          score={score}
          perSubgoal={perSubgoal}
          onEdit={onEdit}
          onNext={onNext}
        />
      ) : (
        <>
          <div>
            <p className="text-sm font-medium">
              Who can produce the evidence?
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {WORKSHOP_ACTORS.map((a) => {
                const out = drawn.filter((e) => e.startsWith(`${a.id}>`)).length;
                return (
                  <button
                    key={a.id}
                    type="button"
                    aria-pressed={a.id === source}
                    /* Both rows print the same ten names, so on the visible
                       page the headings tell them apart and in the
                       accessibility tree nothing did — a screen reader heard
                       "Cloud providers, button" twice with no way to know
                       which end of the edge it was on. The label says which
                       row it is; the count says what is already drawn from
                       here, which the bare numeral beside the name cannot. */
                    aria-label={`Draw from ${MAP_LABEL[a.id]}${
                      out ? ` — ${out} drawn` : ""
                    }`}
                    onClick={() => onSource(a.id)}
                    className={cn(
                      "border-border rounded-lg border px-2.5 py-1.5 text-left text-xs transition-colors",
                      a.id === source
                        ? "border-primary bg-primary/10 font-medium"
                        : "hover:bg-muted",
                    )}
                  >
                    {MAP_LABEL[a.id]}
                    {out ? (
                      <span className="text-muted-foreground ml-1.5">{out}</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {source ? (
            <div>
              <p className="text-sm font-medium">
                About whom? — {MAP_LABEL[source]} can show a verifier something
                about…
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {WORKSHOP_ACTORS.filter((a) => a.id !== source).map((a) => {
                  const id = edgeId(source, a.id);
                  const on = drawn.includes(id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      aria-pressed={on}
                      // The whole claim, because that is what pressing it
                      // asserts — and because the name alone is the same string
                      // as the source chip above it.
                      aria-label={`${MAP_LABEL[source]} can show a verifier something about ${MAP_LABEL[a.id]}`}
                      onClick={() => onToggle(id)}
                      className={cn(
                        "border-border rounded-lg border px-2.5 py-1.5 text-left text-xs transition-colors",
                        on
                          ? "border-primary bg-primary/10 font-medium"
                          : "hover:bg-muted",
                      )}
                    >
                      {on ? "✓ " : ""}
                      {MAP_LABEL[a.id]}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-xs">
              Select a source on the graph or in the list above, then choose
              whom its evidence concerns.
            </p>
          )}

          {drawn.length ? (
            <div className="border-border rounded-xl border p-4">
              <p className="eyebrow text-muted-foreground">
                {drawn.length} edge{drawn.length === 1 ? "" : "s"} drawn
              </p>
              <ul className="mt-2 space-y-1">
                {drawn.map((id) => (
                  <li key={id} className="text-sm">
                    <button
                      type="button"
                      onClick={() => onToggle(id)}
                      className="hover:text-defect text-left transition-colors"
                      aria-label={`Remove ${edgeLabel(id)}`}
                    >
                      {edgeLabel(id)}{" "}
                      <span className="text-muted-foreground">✕</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs">
              Commit when the board says what you think it says. There is no
              target number.
            </p>
            <Button size="sm" disabled={!drawn.length} onClick={onCommit}>
              Commit the edges
            </Button>
          </div>
        </>
      )}
    </div>
  );
}


function EdgesVerdict({
  score,
  perSubgoal,
  onEdit,
  onNext,
}: {
  score: ReturnType<typeof scoreEdges>;
  perSubgoal: { subgoal: (typeof SUBGOALS)[number]; edges: typeof EDGE_KEY }[];
  onEdit: () => void;
  onNext: () => void;
}) {
  /* Same rule as the placement reveal: the mechanism and its quote print for
     an edge the reader did not draw, and collapse to a line for one they
     did. This block is the longest thing in the workshop — six hundred words
     of edges before the notes and the finding — and most of it explains work
     the reader has already done. Opening it all is one press away, and it is
     open by default when every edge was found, because then the filter has
     nothing to hide and would hide the whole step. */
  const [showAll, setShowAll] = useState(false);
  const perfect = score.found.length === EDGE_KEY.length;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">
          <span className="font-semibold">
            {score.found.length} of {EDGE_KEY.length}
          </span>{" "}
          edges in the key.
          {score.reversed.length
            ? ` ${score.reversed.length} drawn the other way round.`
            : ""}
          {score.extra.length
            ? ` ${score.extra.length} the key does not have.`
            : ""}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" variant="outline" onClick={onEdit}>
            Edit my edges
          </Button>
          {perfect ? null : (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-4"
              aria-pressed={showAll}
            >
              {showAll ? "Only what you missed" : "Show every mechanism"}
            </button>
          )}
        </div>
      </div>

      {/* The key, grouped by the subgoal each edge completes — which is the
          only grouping that makes the weak-link reading possible, and the one
          the paper itself uses. */}
      <ol className="space-y-4">
        {perSubgoal.map(({ subgoal, edges }) => (
          <li
            key={subgoal.id}
            className="[&+li]:border-muted-foreground/60 [&+li]:border-t [&+li]:pt-4"
          >
            <p className="text-sm font-semibold">
              Subgoal {subgoal.label} · {subgoal.name}{" "}
              <span className="text-muted-foreground font-normal">
                — {edges.length} edge{edges.length === 1 ? "" : "s"}
              </span>
            </p>
            <BakerLine {...subgoal.baker} />
            <ul className="mt-3 space-y-3">
              {edges.map((edge) => {
                const id = edgeId(edge.from, edge.to);
                const got = score.found.includes(id);
                const flipped = score.reversed.includes(edgeId(edge.to, edge.from));
                return (
                  <li key={id}>
                    <p className="flex items-start gap-1.5 text-sm">
                      {got ? (
                        <CircleCheck
                          className="text-comply mt-1 size-3.5 shrink-0"
                          aria-hidden
                        />
                      ) : (
                        <CircleAlert
                          className="text-defect mt-1 size-3.5 shrink-0"
                          aria-hidden
                        />
                      )}
                      <span>
                        <span className="font-medium">{edgeLabel(id)}</span>
                        {got ? null : flipped ? (
                          <span className="text-defect">
                            {" "}
                            — you drew it the other way round.
                          </span>
                        ) : (
                          <span className="text-defect"> — not drawn.</span>
                        )}
                      </span>
                    </p>
                    {!got || showAll || perfect ? (
                      <>
                        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                          {edge.what}
                        </p>
                        {edge.baker.map((q) => (
                          <BakerLine key={q.text.slice(0, 32)} {...q} />
                        ))}
                      </>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>

      {score.extra.length ? (
        <div className="border-border rounded-xl border p-4">
          <p className="text-sm font-semibold">
            Edges the key does not have
          </p>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            Not automatically wrong — the key holds only what this framework
            supports, and it is a framework about declarations rather than
            about power. Ask of each one: which of the four subgoals would it
            complete, and with what mechanism? If you can answer that, argue
            with the key.
          </p>
          <ul className="mt-2 space-y-1">
            {score.extra.map((id) => (
              <li key={id} className="text-sm">
                {edgeLabel(id)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* The actors with nothing. This is the half of the key that is easy to
          leave out and is doing most of the teaching — and it is grouped
          because ten separate rows would read as a list of oversights rather
          than as four different reasons for an absence. */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">
          The {EDGE_NOTES.reduce((n, x) => n + x.actorIds.length, 0)} with no
          edge at all
        </p>
        <ol className="space-y-3">
          {EDGE_NOTES.map((note) => (
            <li
              key={note.actorIds.join("+")}
              className="[&+li]:border-border [&+li]:border-t [&+li]:pt-3"
            >
              <p className="text-sm font-medium">
                {note.actorIds.map((id) => MAP_LABEL[id]).join(" · ")}
              </p>
              <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
                {note.why}
              </p>
              {note.baker.map((q) => (
                <BakerLine key={q.text.slice(0, 32)} {...q} />
              ))}
            </li>
          ))}
        </ol>
      </div>

      <Button size="sm" onClick={onNext}>
        Read what it says
      </Button>
    </div>
  );
}


function MapStep({
  peeked,
  ringsRight,
  edgesRight,
  recalledCount,
  secondOrder,
  secondOrderDone,
  onSecondOrder,
  onCommitSecondOrder,
}: {
  peeked: boolean;
  ringsRight: number;
  edgesRight: number;
  recalledCount: number;
  secondOrder: string | null;
  secondOrderDone: boolean;
  onSecondOrder: (id: string) => void;
  onCommitSecondOrder: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* The map and its role lens are above every step now — see the comment
          at the mount. The finding below is what they are for: pick a role up
          there and watch it appear on every ring at once. One role at a time
          on purpose, because an actor holds several and colouring a dot by
          "its" role would be a claim the lesson spends a paragraph denying. */}
      <div className="border-border rounded-xl border p-4">
        <p className="text-sm font-semibold">{MAP_FINDING.title}</p>
        {MAP_FINDING.body.map((para) => (
          <p key={para.slice(0, 24)} className="mt-2 text-sm leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      {/* THE EDGE FINDING BELONGS HERE, not at the end of the step that drew
          them. It is a reading of the finished board — count the edges, count
          the arrowheads, count what has no edge and what has no node — and
          this is the step called Read the map. Leaving it on step 6 made that
          step 2,200 words of feedback and this one a formality, and it asked
          the reader to count things on a diagram that was one screen back.
          The marked map is directly above these paragraphs. */}
      <div className="border-border rounded-xl border p-4">
        <p className="text-sm font-semibold">{EDGE_FINDING.title}</p>
        {EDGE_FINDING.body.map((para) => (
          <p key={para.slice(0, 24)} className="mt-2 text-sm leading-relaxed">
            {para}
          </p>
        ))}
        <BakerLine {...EDGE_FINDING.weakLink} />
        <BakerLine {...EDGE_FINDING.redundancy} />
      </div>

      {/* Beeck draw rings to "anticipate second-order effects", and the
          workshop had no step that did the second half. One question, because
          the point is a single gap: the removal that bites soonest and the
          removal that matters most are different actors on different rings. */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Now take one off the board</p>
        <p className="text-sm leading-relaxed">{SECOND_ORDER.stem}</p>
        <ChoiceList
          options={SECOND_ORDER.options.map((o) => ({
            id: o.id,
            node: o.text,
            correct: o.correct,
          }))}
          value={secondOrder}
          committed={secondOrderDone}
          label={SECOND_ORDER.stem}
          onPick={onSecondOrder}
        />
        {secondOrderDone ? (
          <div className="space-y-3">
            {/* Every option is worth reading here, not just the two that
                matter to the score: each one is a different clock, which is
                the whole content of the step. */}
            <ol className="space-y-2">
              {SECOND_ORDER.options.map((option) => (
                <li key={option.id} className="text-sm leading-relaxed">
                  <span
                    className={cn(
                      "font-medium",
                      option.correct ? "text-comply" : undefined,
                    )}
                  >
                    {option.text}
                  </span>{" "}
                  <span className="text-muted-foreground">{option.why}</span>
                </li>
              ))}
            </ol>
            <div className="border-border rounded-xl border p-4">
              <p className="text-sm leading-relaxed">{SECOND_ORDER.lesson}</p>
            </div>
          </div>
        ) : (
          <Button size="sm" disabled={!secondOrder} onClick={onCommitSecondOrder}>
            Commit
          </Button>
        )}
      </div>

      <p className="text-muted-foreground text-xs">
        Across both halves: {recalledCount} of {RECALL_TARGET.items.length}{" "}
        retrieved about the cloud provider, {ringsRight} of{" "}
        {WORKSHOP_ACTORS.length} placed on the ring this map gives them,{" "}
        {edgesRight} of {EDGE_KEY.length} edges in the key.
        {peeked ? " Roster reopened during the workshop." : ""}
      </p>

      {/* Beeck's last step is Setting Actions. For a reader that is transfer:
          three questions the map is the material for. Hers, verbatim, and
          never machine-graded — the panel under them is the criteria a marker
          would use, which is how every constructed exercise in 2.4 ends.

          OPTIONAL, AND SAID SO (course owner, 2026-08-18). Three written
          answers with a marking key is twelve minutes, which is most of a
          section's budget on its own. The exercise is complete without them:
          `onComplete` fires on the second-order commit above, so nobody is
          held back by work they did not have time for. It is behind a control
          rather than always open for the same reason — a wall of textareas
          under a finished exercise reads as required no matter what the
          sentence above it says. */}
      <OptionalWriting />
    </div>
  );
}

/**
 * The three transfer questions, opened on request.
 *
 * Hers, verbatim, and the last thing the workshop asks. They are worth doing
 * and they are not what the twenty minutes are budgeted for, so the reader
 * decides. Once opened it stays open for the visit; the answers themselves
 * persist under their own key like every other workspace.
 */
function OptionalWriting() {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <div className="border-border rounded-xl border p-4">
        <p className="text-sm font-semibold">
          <OptionalPrefix />
          Three questions to take away
        </p>
        <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
          Written answers, about fifteen minutes, with the criteria a marker
          would use. The exercise is finished without them; they are here for
          the reader who wants to argue with the board rather than read it.
        </p>
        <Button size="sm" variant="outline" className="mt-3" onClick={() => setOpen(true)}>
          Open them
        </Button>
      </div>
    );
  }
  return (
    <>
      <QuestionWorkspace
        storageKey={WORKSHOP_NOTES_KEY}
        rule={{ kind: "any", count: CLOSING_QUESTIONS.length }}
        questions={CLOSING_QUESTIONS}
        placeholder="Answer from the map you just drew. Nothing is graded."
        onComplete={() => {}}
      />
      <MarkingKeyPanel storageKey={WORKSHOP_MARKS_KEY} keyData={CLOSING_KEY} />
    </>
  );
}
