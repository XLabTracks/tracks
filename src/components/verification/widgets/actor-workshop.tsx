"use client";

import { useMemo, useRef, useState } from "react";
import { CircleAlert, CircleCheck, Eye, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { shuffleAnswerOptions } from "@/lib/shuffle";
import { cn } from "@/lib/utils";
import {
  ACTOR_POSTURES,
  ACTOR_ROLES,
  type ActorPostureId,
  type ActorRoleId,
} from "@/lib/verification/data/actor-map";
import {
  CENTRE,
  CLOSING_QUESTIONS,
  CORE_QUESTION,
  EDGE_FINDING,
  EDGE_KEY,
  EDGE_NOTES,
  MAP_FINDING,
  MAP_LABEL,
  POSTURE_KEY,
  RECALL_TARGET,
  SECOND_ORDER,
  SUBGOALS,
  CLOSING_KEY,
  RING_KEY,
  RING_WHY,
  RINGS,
  ROLE_KEY,
  WORKSHOP_ACTORS,
  WORKSHOP_ACTOR_IDS,
  WORKSHOP_NOTES_KEY,
  WORKSHOP_MARKS_KEY,
  type RingId,
  type WorkshopActor,
  type WorkshopActorId,
} from "@/lib/verification/data/actor-workshop";
import { diffSet, edgeId, scoreEdges } from "@/lib/verification/actor-workshop";
import { ChoiceList } from "../kit/choice-list";
import { MarkingKeyPanel } from "../kit/marking-key";
import { QuestionWorkspace } from "../kit/question-workspace";
import { SegMeter } from "../kit/seg-meter";
import { useStoredState } from "../kit/use-stored-state";
import type { VerificationWidgetProps } from "../kit/types";

/**
 * 1.2 — The Actor Map Workshop.
 *
 * Built on the Beeck Center's stakeholder-mapping workshop, closed-book on
 * purpose. Why it is shaped this way, which parts are the course owner's and
 * which are derived, and the two Karpicke papers behind the freeze are all in
 * data/actor-workshop.ts — read that header before changing anything here.
 *
 * It replaces two widgets and is meant to. `protocol-actors` went on the
 * owner's instruction ("это говно для первокурсников" — clicking highlighted
 * phrases in a treaty is recognition dressed as work). `actor-map` went
 * because it was a third browsable roster of the same cast: political-economy
 * practice separates "who is there", "who is connected to whom" and "who has
 * power", and that widget conflated the first with the third while being
 * neither an answer surface nor a graph. Both files stay in the repo.
 *
 * SEVEN STEPS, ONE AT A TIME. That is the house rule and here it is load-
 * bearing rather than stylistic: every step after Study is answered from
 * memory, so showing step 5 beside step 2 would put the vocabulary back on
 * screen and undo the freeze.
 *
 * Step 6 draws edges. It is the one step whose key is not the course's own
 * material: rings, edges and subgoals all come from Baker et al. and every
 * claim carries the sentence it rests on. The data file's header says why the
 * frame moved and what that costs.
 *
 * THE FREEZE IS SOFT, AND VISIBLE. "Open the roster" is always there during
 * the workshop; taking it flips `peeked`, which the closing map says out
 * loud. A hard lock would be a lie — the lesson's own tables are further up
 * the same page — and the Spoiler next door already settles the house
 * position: uncovering early spoils the exercise, and that is the learner's
 * call to make.
 *
 * NOTHING HERE IS GRADED TOWARD PROGRESS. The counts are feedback; they are
 * stored beside the work so reopening shows what you did, and they leave the
 * browser never.
 */

type StepId =
  | "study"
  | "recall"
  | "core"
  | "place"
  | "categorize"
  | "edges"
  | "map";

const STEPS: { id: StepId; name: string; beeck: string }[] = [
  { id: "study", name: "Study the cast", beeck: "Goal setting" },
  // Named for what it asks now. It used to be "Who does it touch?" against
  // Beeck's "List all stakeholders", and both were left behind when the step
  // stopped retrieving the cast and started retrieving the material — so the
  // Beeck column says the step was recast rather than pretending it matches.
  { id: "recall", name: "What can one actor do?", beeck: "List all stakeholders, recast" },
  { id: "core", name: "What goes in the centre?", beeck: "Identify the core" },
  { id: "place", name: "Place them on the rings", beeck: "Place and cluster" },
  { id: "categorize", name: "What can each one do?", beeck: "Categorize" },
  // Beeck's own reason for drawing rings is to see dependencies between
  // stakeholders; until this step the workshop drew the rings and never the
  // dependencies. Its key is Baker's, not the course's.
  { id: "edges", name: "Draw the edges", beeck: "Political analysis" },
  { id: "map", name: "Read the map", beeck: "Political analysis · Actions" },
];

const STEP_IDS = STEPS.map((s) => s.id);

interface Saved {
  step: StepId;
  /** Free recall, one actor per line. */
  recall: string;
  /** Whether Recall has been marked — the reveal is one-way, like a commit. */
  recallDone: boolean;
  /** Which of the six key items the learner says they retrieved. */
  recallChecked: string[];
  core: string | null;
  coreDone: boolean;
  rings: Record<string, RingId>;
  ringsDone: boolean;
  roles: Record<string, ActorRoleId[]>;
  postures: Record<string, ActorPostureId[]>;
  catDone: boolean;
  /** Drawn edges, as `from>to`. Direction is the claim — see edgeId. */
  edges: string[];
  edgesDone: boolean;
  secondOrder: string | null;
  secondOrderDone: boolean;
  /** The roster was reopened mid-workshop. Reported, never punished. */
  peeked: boolean;
}

// v2: step 2 stopped asking "who does this agreement touch" and started
// asking what one actor can do. A restored v1 draft would be an answer to a
// question that is no longer on screen.
//
// v3: the rings are Baker's frame now and the four ids all changed, so a
// restored v2 map would be ten placements on rings that no longer exist.
// prune() would drop them one by one and hand back a half-built map with no
// explanation; a new key throws the whole document away at once, which is the
// honest version of the same thing.
const STORAGE_KEY = "v-actor-workshop:v3";
const EMPTY: Saved = {
  step: "study",
  recall: "",
  recallDone: false,
  recallChecked: [],
  core: null,
  coreDone: false,
  rings: {},
  ringsDone: false,
  roles: {},
  postures: {},
  catDone: false,
  edges: [],
  edgesDone: false,
  secondOrder: null,
  secondOrderDone: false,
  peeked: false,
};

const RING_IDS = new Set<string>(RINGS.map((r) => r.id));
const ROLE_IDS = new Set<string>(ACTOR_ROLES.map((r) => r.id));
const POSTURE_IDS = new Set<string>(ACTOR_POSTURES.map((p) => p.id));
const ACTOR_IDS = new Set<string>(WORKSHOP_ACTOR_IDS);
const KEY_EDGE_IDS = EDGE_KEY.map((e) => edgeId(e.from, e.to));

function prune(raw: unknown): Saved {
  if (typeof raw !== "object" || raw === null) return EMPTY;
  const box = raw as Partial<Saved>;
  const pickList = <T extends string>(
    v: unknown,
    allowed: Set<string>,
  ): T[] | null =>
    Array.isArray(v) ? (v.filter((x) => typeof x === "string" && allowed.has(x)) as T[]) : null;

  const rings: Record<string, RingId> = {};
  const roles: Record<string, ActorRoleId[]> = {};
  const postures: Record<string, ActorPostureId[]> = {};
  for (const id of WORKSHOP_ACTOR_IDS) {
    const ring = box.rings?.[id];
    if (typeof ring === "string" && RING_IDS.has(ring)) rings[id] = ring as RingId;
    const r = pickList<ActorRoleId>(box.roles?.[id], ROLE_IDS);
    if (r) roles[id] = r;
    const p = pickList<ActorPostureId>(box.postures?.[id], POSTURE_IDS);
    if (p) postures[id] = p;
  }
  return {
    step: STEP_IDS.includes(box.step as StepId) ? (box.step as StepId) : "study",
    recall: typeof box.recall === "string" ? box.recall : "",
    recallDone: box.recallDone === true,
    recallChecked: Array.isArray(box.recallChecked)
      ? box.recallChecked.filter(
          (x) => typeof x === "string" && RECALL_TARGET.items.some((i) => i.id === x),
        )
      : [],
    core:
      typeof box.core === "string" &&
      CORE_QUESTION.options.some((o) => o.id === box.core)
        ? box.core
        : null,
    coreDone: box.coreDone === true,
    rings,
    ringsDone: box.ringsDone === true,
    roles,
    postures,
    catDone: box.catDone === true,
    // Only pairs of real actors survive, and only one of each. A stored edge
    // that names an actor the roster has dropped would draw a line to nowhere.
    edges: Array.isArray(box.edges)
      ? [
          ...new Set(
            box.edges.filter(
              (e): e is string =>
                typeof e === "string" &&
                e.split(">").length === 2 &&
                e.split(">").every((id) => ACTOR_IDS.has(id)) &&
                e.split(">")[0] !== e.split(">")[1],
            ),
          ),
        ]
      : [],
    edgesDone: box.edgesDone === true,
    secondOrder:
      typeof box.secondOrder === "string" &&
      SECOND_ORDER.options.some((o) => o.id === box.secondOrder)
        ? box.secondOrder
        : null,
    secondOrderDone: box.secondOrderDone === true,
    peeked: box.peeked === true,
  };
}

/* Ring geometry. Four bands and a core dot, drawn once and read at every
   later step, so the numbers live here rather than inside the component. */
const CX = 360;
const CY = 292;
const RADII: Record<RingId, number> = {
  declares: 66,
  evidence: 118,
  verifies: 170,
  undeclared: 218,
};

export function ActorWorkshop({}: VerificationWidgetProps) {
  const [saved, persist, hydrated] = useStoredState(STORAGE_KEY, EMPTY, prune);
  const [openRoster, setOpenRoster] = useState(false);
  const [active, setActive] = useState<string>(WORKSHOP_ACTOR_IDS[0]);
  // Which actor the learner is drawing FROM. Component state, not stored:
  // it is where a cursor is, not work.
  const [edgeSource, setEdgeSource] = useState<WorkshopActorId>(
    WORKSHOP_ACTOR_IDS[0],
  );
  const [lens, setLens] = useState<ActorRoleId | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Seeded on the question id, so the order is the same for every learner and
  // on every visit — src/lib/shuffle.ts says why that matters.
  const coreOptions = useMemo(
    () => shuffleAnswerOptions("actor-workshop-core", [...CORE_QUESTION.options], (o) => o.text),
    [],
  );

  if (!hydrated) return <div className="not-prose my-6 min-h-96" aria-busy />;

  const stepIndex = Math.max(0, STEP_IDS.indexOf(saved.step));
  const step = STEPS[stepIndex]!;

  const go = (id: StepId) => {
    persist((prev) => ({ ...prev, step: id }));
    setOpenRoster(false);
    topRef.current?.scrollIntoView({ block: "nearest" });
  };

  const placedCount = WORKSHOP_ACTOR_IDS.filter((id) => saved.rings[id]).length;
  const ringsRight = WORKSHOP_ACTOR_IDS.filter(
    (id) => saved.rings[id] === RING_KEY[id],
  ).length;
  const catDone = WORKSHOP_ACTOR_IDS.filter(
    (id) => (saved.roles[id]?.length ?? 0) > 0 && (saved.postures[id]?.length ?? 0) > 0,
  ).length;
  const edgeScore = scoreEdges(saved.edges, KEY_EDGE_IDS);

  /* What the map draws.
     Nothing before the edges step — the earlier steps are about position and
     a line between two dots would be a claim the learner has not been asked
     to make yet. During the step, whatever they have drawn. After the commit
     and for the rest of the workshop, the marked version: what they got, what
     they inverted, what they invented, and the key edges they never drew. */
  const mapEdges =
    saved.step !== "edges" && saved.step !== "map"
      ? []
      : !saved.edgesDone
        ? saved.edges.map((id) => ({ id, state: "drawn" as const }))
        : [
            ...edgeScore.found.map((id) => ({ id, state: "right" as const })),
            ...edgeScore.reversed.map((id) => ({ id, state: "wrong" as const })),
            ...edgeScore.extra.map((id) => ({ id, state: "wrong" as const })),
            ...edgeScore.missed.map((id) => ({ id, state: "missed" as const })),
          ];

  return (
    <div className="not-prose my-6 space-y-4" ref={topRef}>
      {/* The brief. Beeck opens with Goal Setting, which for a group is a
          negotiation and for one reader is simply being told what the map has
          to be good for. It stays on screen at every step because it is the
          standard the last step marks against. */}
      <div className="border-border bg-card rounded-xl border p-4">
        <p className="eyebrow text-muted-foreground">The brief</p>
        <p className="mt-1.5 text-sm leading-relaxed">
          Two governments have agreed: no training runs above a compute
          threshold for three months. Draw the map that tells you who has to
          change what they do — and build it from memory, because a map you can
          look up is one you have not learned.
        </p>
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

      {/* THE MAP IS ALWAYS ON SCREEN, from the first step to the last.
          It used to render only inside step 4 and step 6, which meant a block
          called The Actor Map Workshop opened with a roster, a button and no
          map — and showed none again on steps 2, 3 and 5. A paper workshop
          has the sheet on the table from the first minute; the learner should
          see the empty rings and the act in the centre before being asked to
          put anything on them, and watch it fill as they do.

          One map, not one per step: it takes the learner's own placements
          until the last step, and the answer key there, where the lens turns
          it into the finding. */}
      <RingMap
        rings={saved.ringsDone ? RING_KEY : saved.rings}
        showKey={saved.ringsDone}
        lens={saved.step === "map" ? lens : null}
        edges={mapEdges}
      />

      {/* The lens rides under the map rather than inside step 6, because the
          map is up here now and a control separated from what it controls by
          a screen of text is not a control. */}
      {saved.step === "map" ? (
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

      {saved.step === "study" ? (
        <StudyStep onStart={() => go("recall")} />
      ) : (
        <>
          {/* One button, always in the same place, for the whole workshop.
              It is the honest version of a freeze: it works, and it is
              recorded. */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setOpenRoster((v) => !v);
                if (!openRoster) persist((prev) => ({ ...prev, peeked: true }));
              }}
            >
              {openRoster ? <Lock className="size-3.5" aria-hidden /> : <Eye className="size-3.5" aria-hidden />}
              {openRoster ? "Close the roster" : "Open the roster"}
            </Button>
            <p className="text-muted-foreground text-xs">
              {saved.peeked
                ? "Opened during the workshop — the closing map says so."
                : "Closed since you started. Everything below is from memory."}
            </p>
          </div>
          {openRoster ? <Roster /> : null}
        </>
      )}

      {saved.step === "recall" ? (
        <RecallStep
          value={saved.recall}
          done={saved.recallDone}
          checked={saved.recallChecked}
          onChange={(v) => persist((prev) => ({ ...prev, recall: v }))}
          onMark={() => persist((prev) => ({ ...prev, recallDone: true }))}
          onToggle={(id) =>
            persist((prev) => ({
              ...prev,
              recallChecked: prev.recallChecked.includes(id)
                ? prev.recallChecked.filter((x) => x !== id)
                : [...prev.recallChecked, id],
            }))
          }
          onNext={() => go("core")}
        />
      ) : null}

      {saved.step === "core" ? (
        <CoreStep
          options={coreOptions.map((s) => s.item)}
          pick={saved.core}
          done={saved.coreDone}
          onPick={(id) => persist((prev) => ({ ...prev, core: id }))}
          onCommit={() => persist((prev) => ({ ...prev, coreDone: true }))}
          onNext={() => go("place")}
        />
      ) : null}

      {saved.step === "place" ? (
        <PlaceStep
          rings={saved.rings}
          done={saved.ringsDone}
          active={active}
          right={ringsRight}
          placed={placedCount}
          onActive={setActive}
          onPlace={(actorId, ring) =>
            persist((prev) => ({ ...prev, rings: { ...prev.rings, [actorId]: ring } }))
          }
          onCommit={() => persist((prev) => ({ ...prev, ringsDone: true }))}
          onNext={() => go("categorize")}
        />
      ) : null}

      {saved.step === "categorize" ? (
        <CategorizeStep
          roles={saved.roles}
          postures={saved.postures}
          done={saved.catDone}
          answered={catDone}
          onToggle={(kind, actorId, value) =>
            persist((prev) => {
              const bag = kind === "roles" ? prev.roles : prev.postures;
              const current = bag[actorId] ?? [];
              const next = current.includes(value as never)
                ? current.filter((v) => v !== value)
                : [...current, value];
              return { ...prev, [kind]: { ...bag, [actorId]: next } } as Saved;
            })
          }
          onCommit={() => persist((prev) => ({ ...prev, catDone: true }))}
          onNext={() => go("edges")}
        />
      ) : null}

      {saved.step === "edges" ? (
        <EdgesStep
          drawn={saved.edges}
          done={saved.edgesDone}
          score={edgeScore}
          source={edgeSource}
          onSource={setEdgeSource}
          onToggle={(id) =>
            persist((prev) => ({
              ...prev,
              edges: prev.edges.includes(id)
                ? prev.edges.filter((e) => e !== id)
                : [...prev.edges, id],
            }))
          }
          onCommit={() => persist((prev) => ({ ...prev, edgesDone: true }))}
          onNext={() => go("map")}
        />
      ) : null}

      {saved.step === "map" ? (
        <MapStep
          peeked={saved.peeked}
          ringsRight={ringsRight}
          edgesRight={edgeScore.found.length}
          recalledCount={saved.recallChecked.length}
          secondOrder={saved.secondOrder}
          secondOrderDone={saved.secondOrderDone}
          onSecondOrder={(id) => persist((prev) => ({ ...prev, secondOrder: id }))}
          onCommitSecondOrder={() =>
            persist((prev) => ({ ...prev, secondOrderDone: true }))
          }
          coreRight={
            CORE_QUESTION.options.find((o) => o.id === saved.core)?.correct === true
          }
        />
      ) : null}

      {/* Back is always available and never rewinds an answer: the steps hold
          their own committed state, so stepping back is re-reading, not
          re-doing. */}
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

/* ---------------------------------------------------------------- roster -- */

function Roster() {
  return (
    <div className="border-border bg-card space-y-3 rounded-xl border p-4">
      <ol className="space-y-3">
        {WORKSHOP_ACTORS.map((actor) => (
          <li key={actor.id} className="[&+li]:border-border [&+li]:border-t [&+li]:pt-3">
            <p className="text-sm font-semibold">{actor.name}</p>
            <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
              {actor.position}
              {actor.note ? ` ${actor.note}` : ""}
            </p>
          </li>
        ))}
      </ol>
      <div className="border-border grid gap-3 border-t pt-3 sm:grid-cols-2">
        <div>
          <p className="eyebrow text-muted-foreground">Six functional roles</p>
          <ul className="mt-1.5 space-y-1 text-sm">
            {ACTOR_ROLES.map((role) => (
              <li key={role.id}>
                <span className="font-medium">{role.name}</span>{" "}
                <span className="text-muted-foreground">{role.question}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-muted-foreground">Five postures</p>
          <ul className="mt-1.5 space-y-1 text-sm">
            {ACTOR_POSTURES.map((posture) => (
              <li key={posture.id}>
                <span className="font-medium">{posture.name}</span>{" "}
                <span className="text-muted-foreground">{posture.means}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ steps -- */

function StudyStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed">
        Ten actors, the six roles any of them can play, and the five postures
        any of them can take. Read for as long as you want — the workshop
        starts when you say so, and this panel closes when it does.
      </p>
      <Roster />
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" onClick={onStart}>
          I&rsquo;ve studied this — start the workshop
        </Button>
        <p className="text-muted-foreground text-xs">
          You can reopen it at any point; the map will say that you did.
        </p>
      </div>
    </div>
  );
}

function RecallStep({
  value,
  done,
  checked,
  onChange,
  onMark,
  onToggle,
  onNext,
}: {
  value: string;
  done: boolean;
  checked: string[];
  onChange: (v: string) => void;
  onMark: () => void;
  onToggle: (id: string) => void;
  onNext: () => void;
}) {
  const items = RECALL_TARGET.items;
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed">{RECALL_TARGET.prompt}</p>
      <Textarea
        value={value}
        disabled={done}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        placeholder="Whatever you have. Sentences, fragments, a list — it is what you retrieved that counts, not how it is written."
        aria-label="What a cloud provider can do inside a regime, and what it wants"
      />
      {done ? (
        /* Self-scored, and the reason is in the data file: a matcher over
           free prose would need a vocabulary list per role, would be wrong
           often, and would be wrong in the direction that stops people
           writing. The learner ticks what they actually had — which is what
           the free-recall studies score and what every constructed exercise
           in 2.4 already asks for. */
        <div className="space-y-3">
          <div className="border-border rounded-xl border p-4">
            <p className="eyebrow text-muted-foreground">
              Six things the course says about this one actor
            </p>
            <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
              Tick the ones your answer actually had. Different words are
              fine; the same idea is the test.
            </p>
            <ul className="mt-3 space-y-1.5">
              {items.map((item) => {
                const on = checked.includes(item.id);
                return (
                  <li key={item.id}>
                    <label className="flex cursor-pointer items-start gap-2 text-sm leading-relaxed">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => onToggle(item.id)}
                        className="accent-primary mt-1 size-3.5 shrink-0"
                      />
                      <span>
                        <span className="font-medium">{item.label}.</span>{" "}
                        <span className="text-muted-foreground">{item.gloss}</span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="text-sm">
            <span className="font-semibold">
              {checked.length} of {items.length}
            </span>{" "}
            retrieved. Four of the six are roles the same actor holds at once —
            that is the shape the rest of the workshop is about.
          </p>
          <Button size="sm" onClick={onNext}>
            Continue
          </Button>
        </div>
      ) : (
        <Button size="sm" disabled={!value.trim()} onClick={onMark}>
          Done — show me the key
        </Button>
      )}
    </div>
  );
}

function CoreStep({
  options,
  pick,
  done,
  onPick,
  onCommit,
  onNext,
}: {
  options: (typeof CORE_QUESTION.options)[number][];
  pick: string | null;
  done: boolean;
  onPick: (id: string) => void;
  onCommit: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed">{CORE_QUESTION.stem}</p>
      <ChoiceList
        options={options.map((o) => ({ id: o.id, node: o.text, correct: o.correct }))}
        value={pick}
        committed={done}
        label={CORE_QUESTION.stem}
        onPick={onPick}
      />
      {done ? (
        <div className="space-y-3">
          {options.map((option) =>
            option.correct || option.id === pick ? (
              <div key={option.id} className="border-border rounded-xl border p-4">
                <p
                  className={cn(
                    "flex items-center gap-1.5 text-xs tracking-wide",
                    option.correct ? "text-comply" : "text-defect",
                  )}
                >
                  {option.correct ? (
                    <CircleCheck className="size-3.5 shrink-0" aria-hidden />
                  ) : (
                    <CircleAlert className="size-3.5 shrink-0" aria-hidden />
                  )}
                  {option.correct ? "The centre" : "What you chose"}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed">{option.why}</p>
              </div>
            ) : null,
          )}
          <Button size="sm" onClick={onNext}>
            Continue
          </Button>
        </div>
      ) : (
        <Button size="sm" disabled={!pick} onClick={onCommit}>
          Commit
        </Button>
      )}
    </div>
  );
}

function PlaceStep({
  rings,
  done,
  active,
  right,
  placed,
  onActive,
  onPlace,
  onCommit,
  onNext,
}: {
  rings: Record<string, RingId>;
  done: boolean;
  active: string;
  right: number;
  placed: number;
  onActive: (id: string) => void;
  onPlace: (actorId: string, ring: RingId) => void;
  onCommit: () => void;
  onNext: () => void;
}) {
  const actor = WORKSHOP_ACTORS.find((a) => a.id === active) ?? WORKSHOP_ACTORS[0]!;
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed">
        The act you are regulating is in the centre, and the regime around it
        runs on declarations: somebody states what they own and what they did
        with it, and somebody else establishes that the statement is true and
        complete. Put each actor on the ring that says which part of that it
        plays. Pick an actor, then pick its ring.
      </p>

      <div className="flex flex-wrap gap-1.5">
        {WORKSHOP_ACTORS.map((a) => {
          const on = rings[a.id];
          const correct = done && on === RING_KEY[a.id];
          return (
            <button
              key={a.id}
              type="button"
              aria-pressed={a.id === active}
              onClick={() => onActive(a.id)}
              className={cn(
                "border-border rounded-lg border px-2.5 py-1.5 text-left text-xs transition-colors",
                a.id === active ? "border-primary bg-primary/10 font-medium" : "hover:bg-muted",
                done && (correct ? "border-comply" : on ? "border-defect" : undefined),
              )}
            >
              {done ? (correct ? "✓ " : "✗ ") : on ? "• " : ""}
              {a.name}
            </button>
          );
        })}
      </div>

      {done ? (
        <div className="space-y-3">
          <p className="text-sm">
            <span className="font-semibold">
              {right} of {WORKSHOP_ACTORS.length}
            </span>{" "}
            on the ring this map puts them on.
          </p>
          <ol className="space-y-3">
            {WORKSHOP_ACTORS.map((a) => {
              const mine = rings[a.id];
              const key = RING_KEY[a.id as keyof typeof RING_KEY];
              const ok = mine === key;
              return (
                <li key={a.id} className="[&+li]:border-border [&+li]:border-t [&+li]:pt-3">
                  <p className="text-sm">
                    <span className="font-semibold">{a.name}</span>{" "}
                    <span className={ok ? "text-comply" : "text-defect"}>
                      {ok
                        ? RINGS.find((r) => r.id === key)!.name
                        : `${RINGS.find((r) => r.id === key)!.name} — you put it on ${
                            mine ? RINGS.find((r) => r.id === mine)!.name : "no ring"
                          }`}
                    </span>
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
                    {RING_WHY[a.id as keyof typeof RING_WHY]}
                  </p>
                </li>
              );
            })}
          </ol>
          <Button size="sm" onClick={onNext}>
            Continue
          </Button>
        </div>
      ) : (
        <>
          <div className="border-border rounded-xl border p-4">
            <p className="text-sm font-semibold">{actor.name}</p>
            <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
              Which ring?
            </p>
            <div className="mt-3 grid gap-1.5">
              {RINGS.map((ring) => (
                <button
                  key={ring.id}
                  type="button"
                  aria-pressed={rings[actor.id] === ring.id}
                  onClick={() => onPlace(actor.id, ring.id)}
                  className={cn(
                    "border-border block w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                    rings[actor.id] === ring.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted",
                  )}
                >
                  <span className="font-medium">{ring.name}</span>{" "}
                  <span className="text-muted-foreground">{ring.test}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs">
              {placed} of {WORKSHOP_ACTORS.length} placed.
            </p>
            <Button
              size="sm"
              disabled={placed < WORKSHOP_ACTORS.length}
              onClick={onCommit}
            >
              Commit the map
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function CategorizeStep({
  roles,
  postures,
  done,
  answered,
  onToggle,
  onCommit,
  onNext,
}: {
  roles: Record<string, ActorRoleId[]>;
  postures: Record<string, ActorPostureId[]>;
  done: boolean;
  answered: number;
  onToggle: (kind: "roles" | "postures", actorId: string, value: string) => void;
  onCommit: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed">
        Position said where an actor sits. Roles say what it can do inside a
        regime, and posture says what it wants right now. Both take more than
        one answer, and most of these actors need more than one — an answer is
        right when it names the whole set.
      </p>

      <ol className="space-y-4">
        {WORKSHOP_ACTORS.map((actor) => (
          <li
            key={actor.id}
            className="[&+li]:border-muted-foreground/60 [&+li]:border-t [&+li]:pt-4"
          >
            <p className="text-sm font-semibold">{actor.name}</p>
            <ChipRow
              label="Roles"
              options={ACTOR_ROLES.map((r) => ({ id: r.id, name: r.name }))}
              chosen={roles[actor.id] ?? []}
              keyIds={ROLE_KEY[actor.id] ?? []}
              done={done}
              onToggle={(v) => onToggle("roles", actor.id, v)}
            />
            <ChipRow
              label="Posture"
              options={ACTOR_POSTURES.map((p) => ({ id: p.id, name: p.name }))}
              chosen={postures[actor.id] ?? []}
              keyIds={POSTURE_KEY[actor.id] ?? []}
              done={done}
              onToggle={(v) => onToggle("postures", actor.id, v)}
            />
            {done ? <CategorizeVerdict actor={actor} roles={roles} postures={postures} /> : null}
          </li>
        ))}
      </ol>

      {done ? (
        <Button size="sm" onClick={onNext}>
          Continue
        </Button>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs">
            {answered} of {WORKSHOP_ACTORS.length} answered — each needs at
            least one role and one posture.
          </p>
          <Button
            size="sm"
            disabled={answered < WORKSHOP_ACTORS.length}
            onClick={onCommit}
          >
            Commit
          </Button>
        </div>
      )}
    </div>
  );
}

function ChipRow({
  label,
  options,
  chosen,
  keyIds,
  done,
  onToggle,
}: {
  label: string;
  options: { id: string; name: string }[];
  chosen: string[];
  keyIds: readonly string[];
  done: boolean;
  onToggle: (id: string) => void;
}) {
  const answer = new Set(keyIds);
  return (
    <div className="mt-2">
      <p className="eyebrow text-muted-foreground">{label}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {options.map((option) => {
          const picked = chosen.includes(option.id);
          const inKey = answer.has(option.id);
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={picked}
              disabled={done}
              onClick={() => onToggle(option.id)}
              className={cn(
                "border-border rounded-lg border px-2.5 py-1.5 text-xs transition-colors",
                !done && (picked ? "border-primary bg-primary/10 font-medium" : "hover:bg-muted"),
                done && inKey && "border-comply bg-comply/5 font-medium",
                done && picked && !inKey && "border-defect bg-defect/5",
                done && !inKey && !picked && "opacity-55",
              )}
            >
              {done && inKey ? "✓ " : done && picked && !inKey ? "✗ " : ""}
              {option.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CategorizeVerdict({
  actor,
  roles,
  postures,
}: {
  actor: WorkshopActor;
  roles: Record<string, ActorRoleId[]>;
  postures: Record<string, ActorPostureId[]>;
}) {
  const roleDiff = diffSet(roles[actor.id] ?? [], ROLE_KEY[actor.id] ?? []);
  const postureDiff = diffSet(postures[actor.id] ?? [], POSTURE_KEY[actor.id] ?? []);
  const whole = roleDiff.right && postureDiff.right;
  return (
    <p
      className={cn(
        "mt-2 flex items-start gap-1.5 text-xs leading-relaxed",
        whole ? "text-comply" : "text-defect",
      )}
    >
      {whole ? (
        <CircleCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      ) : (
        <CircleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      )}
      <span>
        {whole
          ? "The whole set, both lenses."
          : [
              roleDiff.missed.length ? `${roleDiff.missed.length} role(s) missed` : null,
              roleDiff.extra.length ? `${roleDiff.extra.length} role(s) too many` : null,
              postureDiff.missed.length ? `${postureDiff.missed.length} posture(s) missed` : null,
              postureDiff.extra.length ? `${postureDiff.extra.length} posture(s) too many` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
      </span>
    </p>
  );
}

/* ------------------------------------------------------------------ edges -- */

function edgeLabel(id: string): string {
  const [from = "", to = ""] = id.split(">");
  const name = (x: string) => MAP_LABEL[x as WorkshopActorId] ?? x;
  return `${name(from)} → ${name(to)}`;
}

/** One Baker sentence, printed the way a quotation should be: attributed. */
function BakerLine({ text, where }: { text: string; where: string }) {
  return (
    <p className="border-border text-muted-foreground mt-1.5 border-l-2 pl-3 text-xs leading-relaxed">
      “{text}” <span className="whitespace-nowrap">— Baker et al., {where}</span>
    </p>
  );
}

/**
 * Step 6 — draw the edges.
 *
 * PICK A SOURCE, THEN TOGGLE TARGETS. Clicking dots on the SVG would be the
 * obvious way to draw a graph and it is the wrong one here: the dots are
 * 3.5px, there are ten of them, and nothing about a circle in an SVG is
 * reachable by keyboard without inventing a focus model. Two chip rows are
 * the same gesture — this actor, about that one — with the house's own
 * committed-choice affordances and no new interaction to learn.
 *
 * The direction is stated in the row headings rather than implied by an
 * arrowhead, because it is the whole content of the exercise: which of the
 * two actors is the one that cannot keep the fact to itself.
 */
function EdgesStep({
  drawn,
  done,
  score,
  source,
  onSource,
  onToggle,
  onCommit,
  onNext,
}: {
  drawn: string[];
  done: boolean;
  score: ReturnType<typeof scoreEdges>;
  source: WorkshopActorId;
  onSource: (id: WorkshopActorId) => void;
  onToggle: (edge: string) => void;
  onCommit: () => void;
  onNext: () => void;
}) {
  const perSubgoal = SUBGOALS.map((s) => ({
    subgoal: s,
    edges: EDGE_KEY.filter((e) => e.subgoal === s.id),
  }));

  return (
    <div className="space-y-4">
      <div className="border-border bg-card rounded-xl border p-4">
        <p className="eyebrow text-muted-foreground">What an edge means</p>
        <p className="mt-1.5 text-sm leading-relaxed">
          Draw an edge from <strong>A</strong> to <strong>B</strong> when A can
          put something in front of a verifier about B that B did not have to
          volunteer. Not influence, not dependence — evidence. Direction is the
          claim: a cloud provider holds records about a lab’s training run, and
          the lab holds nothing comparable about the cloud.
        </p>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Some actors will end up with no edge at all. That is an available
          answer and, for several of them, the right one.
        </p>
      </div>

      {done ? (
        <EdgesVerdict score={score} perSubgoal={perSubgoal} onNext={onNext} />
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
  onNext,
}: {
  score: ReturnType<typeof scoreEdges>;
  perSubgoal: { subgoal: (typeof SUBGOALS)[number]; edges: typeof EDGE_KEY }[];
  onNext: () => void;
}) {
  return (
    <div className="space-y-4">
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
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                      {edge.what}
                    </p>
                    {edge.baker.map((q) => (
                      <BakerLine key={q.text.slice(0, 32)} {...q} />
                    ))}
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
          leave out and is doing most of the teaching. */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">The four with no edge at all</p>
        <ol className="space-y-3">
          {EDGE_NOTES.map((note) => (
            <li
              key={note.actorId}
              className="[&+li]:border-border [&+li]:border-t [&+li]:pt-3"
            >
              <p className="text-sm font-medium">{MAP_LABEL[note.actorId]}</p>
              <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
                {note.why}
              </p>
              <BakerLine {...note.baker} />
            </li>
          ))}
        </ol>
      </div>

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

      <Button size="sm" onClick={onNext}>
        Continue
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
  coreRight,
}: {
  peeked: boolean;
  ringsRight: number;
  edgesRight: number;
  recalledCount: number;
  secondOrder: string | null;
  secondOrderDone: boolean;
  onSecondOrder: (id: string) => void;
  onCommitSecondOrder: () => void;
  coreRight: boolean;
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
        From memory: {recalledCount} of {RECALL_TARGET.items.length} retrieved
        about the cloud provider, {ringsRight} of {WORKSHOP_ACTORS.length}{" "}
        placed on the ring this map gives them, {edgesRight} of{" "}
        {EDGE_KEY.length} edges in the key, centre{" "}
        {coreRight ? "right" : "missed"}.
        {peeked ? " Roster reopened during the workshop." : ""}
      </p>

      {/* Beeck's last step is Setting Actions. For a reader that is transfer:
          three questions the map is the material for. Hers, verbatim, and
          never machine-graded — the panel under them is the criteria a marker
          would use, which is how every constructed exercise in 2.4 ends. */}
      <QuestionWorkspace
        storageKey={WORKSHOP_NOTES_KEY}
        rule={{ kind: "any", count: CLOSING_QUESTIONS.length }}
        questions={CLOSING_QUESTIONS}
        placeholder="Answer from the map you just drew. Nothing is graded."
        onComplete={() => {}}
      />
      <MarkingKeyPanel storageKey={WORKSHOP_MARKS_KEY} keyData={CLOSING_KEY} />
    </div>
  );
}

/* -------------------------------------------------------------- ring map -- */

/** The five module hues, in their text-safe variants. See CLAUDE.md. */
const ROLE_TOKENS = [
  "var(--mod-0-text, #9a000c)",
  "var(--mod-1-text, #bf4f00)",
  "var(--mod-2-text, #946b00)",
  "var(--mod-3-text, #555e07)",
  "var(--mod-4-text, #3d75b1)",
];

/**
 * The artifact: concentric rings with the regulated act at the centre.
 *
 * Angles are fixed per actor rather than computed from whatever is placed, so
 * a dot never jumps sideways when its neighbour is placed — the map is being
 * built, and a layout that reflows under the builder's hand is unreadable.
 * Labels anchor away from the centre, which is the only thing that keeps ten
 * of them apart at this size.
 */
export interface MapEdge {
  /** `from>to`, the same id the step stores. */
  id: string;
  state: "drawn" | "right" | "wrong" | "missed";
}

/** Four states, four treatments, and never colour alone — a missed edge is
    dashed as well as pale, a wrong one is solid in the defect hue, and the
    verdict list under the step names every one of them in words. */
const EDGE_PAINT: Record<
  MapEdge["state"],
  { stroke: string; width: number; dash?: string; opacity: number }
> = {
  drawn: { stroke: "var(--primary)", width: 1.5, opacity: 0.75 },
  right: { stroke: "var(--comply)", width: 1.75, opacity: 0.9 },
  wrong: { stroke: "var(--defect)", width: 1.5, opacity: 0.85 },
  missed: { stroke: "var(--muted-foreground)", width: 1.25, dash: "4 4", opacity: 0.7 },
};

function RingMap({
  rings,
  showKey = false,
  lens = null,
  edges = [],
}: {
  rings: Record<string, RingId>;
  showKey?: boolean;
  lens?: ActorRoleId | null;
  edges?: MapEdge[];
}) {
  const lensIndex = lens ? ACTOR_ROLES.findIndex((r) => r.id === lens) : -1;
  const lensColor = lensIndex >= 0 ? ROLE_TOKENS[lensIndex % ROLE_TOKENS.length] : undefined;

  /* Angle comes from the actor's place in the roster and nothing else.
     It was computed per ring from RING_KEY, which was wrong twice over: the
     layout then encoded the answer (a dot at the angle of a ring it was not
     on), and a learner's wrong placement put two dots at the same point,
     because the angle belonged to one ring and the radius to another. Fixed
     angles reflow never, leak nothing, and only ever crowd when several
     actors are stacked on one small ring — which is a wrong map, and looks
     like one. */
  const STEP_DEG = 360 / WORKSHOP_ACTOR_IDS.length;
  const angleOf = (id: string) => {
    const i = WORKSHOP_ACTOR_IDS.indexOf(id as never);
    // Half a step off top dead centre, so the twelve-o'clock position stays
    // free for each ring's own name — the first two actors were landing on
    // "RUNS IT" and reading as one line of text.
    return (-90 + STEP_DEG / 2 + STEP_DEG * i) * (Math.PI / 180);
  };

  /** Where an actor's dot is, or null when it is not on the board yet. */
  const pointOf = (id: string): { x: number; y: number } | null => {
    const ring = rings[id];
    if (!ring) return null;
    const angle = angleOf(id);
    return { x: CX + Math.cos(angle) * RADII[ring], y: CY + Math.sin(angle) * RADII[ring] };
  };

  return (
    <div className="border-border bg-card mx-auto max-w-[720px] overflow-x-auto rounded-xl border p-2">
      {/* The viewBox is cropped to the drawing, not to a round number. Content
          spans y 66..510 — the outer ring's own label down to the bottom of
          that ring — so a 0..584 box carried 148px of empty card, most of it
          visible on the first three steps where nothing is placed yet. The
          top edge is 58 rather than 66 because a 10px label's ascenders reach
          above its baseline. */}
      <svg viewBox="0 58 720 472" className="mx-auto block h-auto w-full min-w-[560px]" role="img"
        aria-label="Concentric actor map: the regulated training run at the centre, actors on four rings around it — who declares, who holds evidence, who verifies, and what no declaration covers — with edges drawn between actors that can produce evidence about one another">
        {[...RINGS].reverse().map((ring) => (
          <g key={ring.id}>
            <circle
              cx={CX}
              cy={CY}
              r={RADII[ring.id]}
              className="fill-none stroke-border"
              strokeWidth={1}
            />
            {/* The name rides just OUTSIDE its ring, not inside it.
                Inside, it shared a line with any actor placed near twelve
                o'clock, and two of them always are: the dots nearest the top
                sit 18° off it, which on the innermost ring is twenty pixels.
                "DECLARES" and "Frontier labs" printed on top of each other,
                and so did "OUTSIDE THE DECLARATION" and "Deployers".
                Eight pixels above the line puts the two on different lines
                with 15px of clearance at the worst radius, and — unlike
                every alternative that moves the label around the circle —
                it never depends on where anything has been placed, so the
                map still cannot reflow under the builder's hand or leak the
                key through its own layout. */}
            <text
              x={CX}
              y={CY - RADII[ring.id] - 8}
              textAnchor="middle"
              className="fill-muted-foreground"
              style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              {ring.name}
            </text>
          </g>
        ))}

        <circle cx={CX} cy={CY} r={4} className="fill-primary" />
        <text x={CX} y={CY + 20} textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>
          {CENTRE.label}
        </text>
        <text x={CX} y={CY + 34} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>
          {CENTRE.sub}
        </text>

        {/* Edges go under the dots and over the rings. A chord between two
            fixed points, with no arrowhead: at this line weight a marker is
            a smudge, and the direction is stated in words beside the map and
            in every row of the verdict list. */}
        {edges.map((edge) => {
          const [from = "", to = ""] = edge.id.split(">");
          const a = pointOf(from);
          const b = pointOf(to);
          if (!a || !b) return null;
          const paint = EDGE_PAINT[edge.state];
          return (
            <line
              key={`${edge.id}-${edge.state}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              style={{
                stroke: paint.stroke,
                strokeWidth: paint.width,
                strokeDasharray: paint.dash,
                opacity: paint.opacity,
              }}
            />
          );
        })}

        {WORKSHOP_ACTORS.map((actor) => {
          const ring = rings[actor.id];
          if (!ring) return null;
          const angle = angleOf(actor.id);
          const r = RADII[ring];
          const x = CX + Math.cos(angle) * r;
          const y = CY + Math.sin(angle) * r;
          const outward = Math.cos(angle) >= 0 ? 1 : -1;
          const lit = lens ? (ROLE_KEY[actor.id] ?? []).includes(lens) : false;
          return (
            <g key={actor.id}>
              <circle
                cx={x}
                cy={y}
                r={lit ? 5 : 3.5}
                style={{ fill: lit ? lensColor : "var(--foreground)" }}
                opacity={lens && !lit ? 0.3 : 1}
              />
              <text
                x={x + outward * 9}
                y={y + 3.5}
                textAnchor={outward > 0 ? "start" : "end"}
                style={{
                  fontSize: 11,
                  fontWeight: lit ? 600 : 400,
                  fill: lit ? lensColor : "var(--foreground)",
                  opacity: lens && !lit ? 0.35 : 1,
                }}
              >
                {MAP_LABEL[actor.id]}
              </text>
            </g>
          );
        })}
      </svg>
      {showKey ? (
        <p className="text-muted-foreground px-2 pt-1 pb-1 text-xs leading-relaxed">
          Rings run outward from the compute use the agreement forbids: who has
          to declare it, who holds evidence about the declaration, who checks
          it, and what no declaration covers. The centre is the paper’s own
          scope — “{CENTRE.baker.text}” (Baker et al., {CENTRE.baker.where}).
        </p>
      ) : null}
    </div>
  );
}
