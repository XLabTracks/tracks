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
  CLOSING_QUESTIONS,
  CORE_QUESTION,
  MAP_FINDING,
  MAP_LABEL,
  POSTURE_KEY,
  RECALL_ALIASES,
  RING_KEY,
  RING_WHY,
  RINGS,
  ROLE_KEY,
  WORKSHOP_ACTORS,
  WORKSHOP_ACTOR_IDS,
  WORKSHOP_NOTES_KEY,
  type RingId,
  type WorkshopActor,
} from "@/lib/verification/data/actor-workshop";
import { diffSet, recallHits } from "@/lib/verification/actor-workshop";
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
 * SIX STEPS, ONE AT A TIME. That is the house rule and here it is load-
 * bearing rather than stylistic: every step after Study is answered from
 * memory, so showing step 5 beside step 2 would put the vocabulary back on
 * screen and undo the freeze.
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

type StepId = "study" | "recall" | "core" | "place" | "categorize" | "map";

const STEPS: { id: StepId; name: string; beeck: string }[] = [
  { id: "study", name: "Study the cast", beeck: "Goal setting" },
  { id: "recall", name: "Who does it touch?", beeck: "List all stakeholders" },
  { id: "core", name: "What goes in the centre?", beeck: "Identify the core" },
  { id: "place", name: "Place them on the rings", beeck: "Place and cluster" },
  { id: "categorize", name: "What can each one do?", beeck: "Categorize" },
  { id: "map", name: "Read the map", beeck: "Political analysis · Actions" },
];

const STEP_IDS = STEPS.map((s) => s.id);

interface Saved {
  step: StepId;
  /** Free recall, one actor per line. */
  recall: string;
  /** Whether Recall has been marked — the reveal is one-way, like a commit. */
  recallDone: boolean;
  core: string | null;
  coreDone: boolean;
  rings: Record<string, RingId>;
  ringsDone: boolean;
  roles: Record<string, ActorRoleId[]>;
  postures: Record<string, ActorPostureId[]>;
  catDone: boolean;
  /** The roster was reopened mid-workshop. Reported, never punished. */
  peeked: boolean;
}

const STORAGE_KEY = "v-actor-workshop:v1";
const EMPTY: Saved = {
  step: "study",
  recall: "",
  recallDone: false,
  core: null,
  coreDone: false,
  rings: {},
  ringsDone: false,
  roles: {},
  postures: {},
  catDone: false,
  peeked: false,
};

const RING_IDS = new Set<string>(RINGS.map((r) => r.id));
const ROLE_IDS = new Set<string>(ACTOR_ROLES.map((r) => r.id));
const POSTURE_IDS = new Set<string>(ACTOR_POSTURES.map((p) => p.id));

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
    peeked: box.peeked === true,
  };
}

/* Ring geometry. Four bands and a core dot, drawn once and read at every
   later step, so the numbers live here rather than inside the component. */
const CX = 360;
const CY = 292;
const RADII: Record<RingId, number> = {
  runs: 66,
  supplies: 118,
  rules: 170,
  unreached: 218,
};

export function ActorWorkshop({}: VerificationWidgetProps) {
  const [saved, persist, hydrated] = useStoredState(STORAGE_KEY, EMPTY, prune);
  const [openRoster, setOpenRoster] = useState(false);
  const [active, setActive] = useState<string>(WORKSHOP_ACTOR_IDS[0]);
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

  const recalled = saved.recallDone
    ? recallHits(saved.recall.split("\n"), WORKSHOP_ACTORS, RECALL_ALIASES)
    : new Set<string>();

  const placedCount = WORKSHOP_ACTOR_IDS.filter((id) => saved.rings[id]).length;
  const ringsRight = WORKSHOP_ACTOR_IDS.filter(
    (id) => saved.rings[id] === RING_KEY[id],
  ).length;
  const catDone = WORKSHOP_ACTOR_IDS.filter(
    (id) => (saved.roles[id]?.length ?? 0) > 0 && (saved.postures[id]?.length ?? 0) > 0,
  ).length;

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
          recalled={recalled}
          onChange={(v) => persist((prev) => ({ ...prev, recall: v }))}
          onMark={() => persist((prev) => ({ ...prev, recallDone: true }))}
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
          onNext={() => go("map")}
        />
      ) : null}

      {saved.step === "map" ? (
        <MapStep
          lens={lens}
          onLens={setLens}
          peeked={saved.peeked}
          ringsRight={ringsRight}
          recalledCount={recalled.size}
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
  recalled,
  onChange,
  onMark,
  onNext,
}: {
  value: string;
  done: boolean;
  recalled: Set<string>;
  onChange: (v: string) => void;
  onMark: () => void;
  onNext: () => void;
}) {
  const missed = WORKSHOP_ACTORS.filter((a) => !recalled.has(a.id));
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed">
        Before anything is sorted: who does this agreement touch? Write them
        down, one per line, in whatever words you have. Approximate names are
        fine — &ldquo;cloud providers&rdquo; counts.
      </p>
      <Textarea
        value={value}
        disabled={done}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        placeholder={"one per line\n"}
        aria-label="Actors you can recall, one per line"
      />
      {done ? (
        <div className="space-y-3">
          <p className="text-sm">
            <span className="font-semibold">
              {recalled.size} of {WORKSHOP_ACTORS.length}
            </span>{" "}
            of the workshop&rsquo;s cast, from memory.
          </p>
          {missed.length ? (
            <div className="border-border rounded-xl border p-4">
              <p className="eyebrow text-muted-foreground">
                Not on your list
              </p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {missed.map((a) => (
                  <li key={a.id}>
                    <span className="font-medium">{a.name}</span>{" "}
                    <span className="text-muted-foreground">{a.position}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                A gap here is the useful part of the step: the actors a map
                leaves out are the ones a regime forgets to reach.
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              All ten. The rest of the workshop is about what they can do, not
              who they are.
            </p>
          )}
          <Button size="sm" onClick={onNext}>
            Continue
          </Button>
        </div>
      ) : (
        <Button size="sm" disabled={!value.trim()} onClick={onMark}>
          Done — show me what I missed
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
  const SLOT = "ABCD";
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed">{CORE_QUESTION.stem}</p>
      <div className="grid gap-1.5" role="radiogroup" aria-label={CORE_QUESTION.stem}>
        {options.map((option, slot) => {
          const chosen = pick === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={chosen}
              disabled={done}
              onClick={() => onPick(option.id)}
              className={cn(
                "border-border block w-full rounded-lg border px-3 py-2 text-left text-sm leading-relaxed transition-colors",
                !done && "hover:bg-muted",
                chosen && !done && "border-primary bg-primary/5",
                done && option.correct && "border-comply bg-comply/5",
                done && chosen && !option.correct && "border-defect bg-defect/5",
                done && !option.correct && !chosen && "opacity-55",
              )}
            >
              <span className="text-muted-foreground mr-1.5 font-medium">
                {SLOT[slot]}.
              </span>
              {option.text}
            </button>
          );
        })}
      </div>
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
        The act you are regulating is in the centre. Put each actor on the ring
        that says how a rule reaches it. Pick an actor, then pick its ring.
      </p>

      <RingMap rings={rings} showKey={done} />

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

function MapStep({
  lens,
  onLens,
  peeked,
  ringsRight,
  recalledCount,
  coreRight,
}: {
  lens: ActorRoleId | null;
  onLens: (r: ActorRoleId | null) => void;
  peeked: boolean;
  ringsRight: number;
  recalledCount: number;
  coreRight: boolean;
}) {
  return (
    <div className="space-y-4">
      <RingMap rings={RING_KEY} showKey lens={lens} />

      {/* The lens is the finding, not decoration: pick a role and watch it
          appear on every ring at once. One role at a time on purpose — an
          actor holds several, so colouring a dot by "its" role would be a
          claim the lesson spends a paragraph denying. Colour rides on the
          role's own word here and on the actor labels it lights, never on a
          bare dot beside grey type. */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-muted-foreground mr-1 text-xs">Light up a role:</span>
        {ACTOR_ROLES.map((role, i) => (
          <button
            key={role.id}
            type="button"
            aria-pressed={lens === role.id}
            onClick={() => onLens(lens === role.id ? null : role.id)}
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

      <div className="border-border rounded-xl border p-4">
        <p className="text-sm font-semibold">{MAP_FINDING.title}</p>
        {MAP_FINDING.body.map((para) => (
          <p key={para.slice(0, 24)} className="mt-2 text-sm leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      <p className="text-muted-foreground text-xs">
        From memory: {recalledCount} of {WORKSHOP_ACTORS.length} recalled,{" "}
        {ringsRight} of {WORKSHOP_ACTORS.length} placed on the ring this map
        gives them, centre {coreRight ? "right" : "missed"}.
        {peeked ? " Roster reopened during the workshop." : ""}
      </p>

      {/* Beeck's last step is Setting Actions. For a reader that is transfer:
          three questions the map is the material for. Hers, verbatim, and
          never graded. */}
      <QuestionWorkspace
        storageKey={WORKSHOP_NOTES_KEY}
        rule={{ kind: "any", count: CLOSING_QUESTIONS.length }}
        questions={CLOSING_QUESTIONS}
        placeholder="Answer from the map you just drew. Nothing is graded."
        onComplete={() => {}}
      />
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
function RingMap({
  rings,
  showKey = false,
  lens = null,
}: {
  rings: Record<string, RingId>;
  showKey?: boolean;
  lens?: ActorRoleId | null;
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

  return (
    <div className="border-border bg-card mx-auto max-w-[720px] overflow-x-auto rounded-xl border p-2">
      <svg viewBox="0 0 720 584" className="mx-auto block h-auto w-full min-w-[560px]" role="img"
        aria-label="Concentric actor map: the regulated training run at the centre, actors on four rings around it">
        {[...RINGS].reverse().map((ring) => (
          <g key={ring.id}>
            <circle
              cx={CX}
              cy={CY}
              r={RADII[ring.id]}
              className="fill-none stroke-border"
              strokeWidth={1}
            />
            <text
              x={CX}
              y={CY - RADII[ring.id] + 13}
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
          A training run
        </text>
        <text x={CX} y={CY + 34} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>
          above the threshold
        </text>

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
          Rings run outward from the act the agreement forbids: who runs it, who
          supplies it, who rules on it, and who no rule reaches.
        </p>
      ) : null}
    </div>
  );
}
