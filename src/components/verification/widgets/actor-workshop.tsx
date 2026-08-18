"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CircleAlert, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { shuffleAnswerOptions } from "@/lib/shuffle";
import { cn } from "@/lib/utils";
import {
  CORE_QUESTION,
  RECALL_TARGET,
  RING_KEY,
  RING_WHY,
  RINGS,
  WORKSHOP_ACTORS,
  WORKSHOP_ACTOR_IDS,
  type RingId,
} from "@/lib/verification/data/actor-workshop";
import { ChoiceList } from "../kit/choice-list";
import { SegMeter } from "../kit/seg-meter";
import type { VerificationWidgetProps } from "../kit/types";
import {
  RingMap,
  Roster,
  RosterGate,
  useBoard,
  type BoardStep,
} from "./actor-board";

/**
 * 1.2 — The Actor Map Workshop, first half: who is on the board.
 *
 * Built on the Beeck Center's stakeholder-mapping workshop, closed-book on
 * purpose. Why it is shaped this way, which parts are the course owner's and
 * which are derived, and the two Karpicke papers behind the freeze are all in
 * data/actor-workshop.ts — read that header before changing anything here.
 * The shared document, the ring map and the roster are in ./actor-board.tsx,
 * which also says why the workshop is in two pieces.
 *
 * FOUR STEPS, ONE AT A TIME. That is the house rule and here it is load-
 * bearing rather than stylistic: every step after Study is answered from
 * memory, so showing step 4 beside step 2 would put the vocabulary back on
 * screen and undo the freeze.
 *
 * WHAT LEFT AND WHY. Two things, both on the course owner's instruction that
 * 1.2 cannot exceed forty minutes against a measured seventy-seven.
 *
 *   The mechanisms half — draw the edges, the key from Baker, read what the
 *   board says — is 1.2.3 now (widgets/actor-edges.tsx). Same document, so a
 *   board placed here arrives there keyed.
 *
 *   The Categorize step is gone outright. It asked for six roles and five
 *   postures on six actors, and the drill bench's `actors` deck was already
 *   drilling the same six roles five screens down the same page. What it was
 *   FOR survives: the point that roles cut across rings is the role lens on
 *   the map, which lives in 1.2.3 where the finished board is read.
 *
 * NOTHING HERE IS GRADED TOWARD PROGRESS. The counts are feedback; they are
 * stored beside the work so reopening shows what you did, and they leave the
 * browser never.
 */

const STEPS: { id: BoardStep; name: string; beeck: string }[] = [
  { id: "study", name: "Study the cast", beeck: "Goal setting" },
  // Named for what it asks now. It used to be "Who does it touch?" against
  // Beeck's "List all stakeholders", and both were left behind when the step
  // stopped retrieving the cast and started retrieving the material — so the
  // Beeck column says the step was recast rather than pretending it matches.
  { id: "recall", name: "What can one actor do?", beeck: "List all stakeholders, recast" },
  { id: "core", name: "What goes in the centre?", beeck: "Identify the core" },
  { id: "place", name: "Place them on the rings", beeck: "Place and cluster" },
];

const STEP_IDS = STEPS.map((s) => s.id);

export function ActorWorkshop({}: VerificationWidgetProps) {
  const [saved, persist, hydrated] = useBoard();
  const [active, setActive] = useState<string>(WORKSHOP_ACTOR_IDS[0]);
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

  const go = (id: BoardStep) => {
    persist((prev) => ({ ...prev, step: id }));
    topRef.current?.scrollIntoView({ block: "nearest" });
  };

  const placedCount = WORKSHOP_ACTOR_IDS.filter((id) => saved.rings[id]).length;
  const ringsRight = WORKSHOP_ACTOR_IDS.filter(
    (id) => saved.rings[id] === RING_KEY[id],
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
          threshold for three months. The section&rsquo;s question is who has to
          change what they do on Wednesday morning. The map asks the one that
          comes after it: when the three months are up, who could <em>show</em>{" "}
          that they did — and who could show that somebody did not. Build it
          from memory, because a map you can look up is one you have not
          learned.
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

      {/* THE MAP IS ALWAYS ON SCREEN, from the first step to the last, with
          the whole cast on it — unplaced actors wait outside the outer ring
          and move in as they are placed. A paper workshop has the sheet on
          the table from the first minute. */}
      <RingMap
        rings={saved.ringsDone ? RING_KEY : saved.rings}
        showKey={saved.ringsDone}
      />

      {saved.step === "study" ? (
        <StudyStep onStart={() => go("recall")} />
      ) : (
        <RosterGate
          peeked={saved.peeked}
          onPeek={() => persist((prev) => ({ ...prev, peeked: true }))}
        />
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
          peeked={saved.peeked}
          recalledCount={saved.recallChecked.length}
          coreRight={
            CORE_QUESTION.options.find((o) => o.id === saved.core)?.correct === true
          }
          onActive={setActive}
          onPlace={(actorId, ring) =>
            persist((prev) => ({ ...prev, rings: { ...prev.rings, [actorId]: ring } }))
          }
          onCommit={() => persist((prev) => ({ ...prev, ringsDone: true }))}
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
  peeked,
  recalledCount,
  coreRight,
  onActive,
  onPlace,
  onCommit,
}: {
  rings: Record<string, RingId>;
  done: boolean;
  active: string;
  right: number;
  placed: number;
  peeked: boolean;
  recalledCount: number;
  coreRight: boolean;
  onActive: (id: string) => void;
  onPlace: (actorId: string, ring: RingId) => void;
  onCommit: () => void;
}) {
  // View state for the reveal, not work: which reasons are expanded. It lives
  // here rather than in the stored document because reopening the workshop
  // should not restore a filter, and nothing about it is an answer.
  const [showAll, setShowAll] = useState(false);
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
        /* THE REASON IS PRINTED WHERE IT IS NEEDED, not seventeen times.
           At ten actors this list was ten short paragraphs and nobody
           noticed; at seventeen it is 777 words of feedback, most of it
           explaining placements the reader already made correctly. A correct
           placement needs the ring's name and nothing else — the ring name IS
           the explanation — and a wrong one needs the whole reason. So misses
           print in full and hits collapse to one line, with a control that
           opens all of them for anyone who wants to check their reasoning
           rather than their answer. It defaults to open when nothing was
           missed, because then there is nothing to filter and hiding the only
           content on the step would be perverse. */
        <div className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="text-sm">
              <span className="font-semibold">
                {right} of {WORKSHOP_ACTORS.length}
              </span>{" "}
              on the ring this map puts them on.
            </p>
            {right < WORKSHOP_ACTORS.length ? (
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-4"
                aria-pressed={showAll}
              >
                {showAll
                  ? "Only what you missed"
                  : "Show the reasoning for all seventeen"}
              </button>
            ) : null}
          </div>
          <ol className="space-y-3">
            {WORKSHOP_ACTORS.map((a) => {
              const mine = rings[a.id];
              const key = RING_KEY[a.id as keyof typeof RING_KEY];
              const ok = mine === key;
              const full = !ok || showAll || right === WORKSHOP_ACTORS.length;
              return (
                <li
                  key={a.id}
                  className={cn(
                    full
                      ? "[&+li]:border-border [&+li]:border-t [&+li]:pt-3"
                      : "!mt-1",
                  )}
                >
                  <p className="text-sm">
                    <span className={full ? "font-semibold" : undefined}>
                      {ok ? "✓ " : ""}
                      {a.name}
                    </span>{" "}
                    <span className={ok ? "text-comply" : "text-defect"}>
                      {ok
                        ? RINGS.find((r) => r.id === key)!.name
                        : `${RINGS.find((r) => r.id === key)!.name} — you put it on ${
                            mine ? RINGS.find((r) => r.id === mine)!.name : "no ring"
                          }`}
                    </span>
                  </p>
                  {full ? (
                    <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
                      {RING_WHY[a.id as keyof typeof RING_WHY]}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ol>

          {/* The board is finished, so this is where the half ends. It says
              what was retrieved and what was peeked at, and then hands over —
              the mechanisms are 1.2.3 and the reader should know the workshop
              is not over rather than discovering a second widget by scrolling
              into it. A plain link, not a component: 1.2.3 is a lesson in the
              graph and the reader gets there the way they get anywhere. */}
          <p className="text-muted-foreground text-xs">
            From memory: {recalledCount} of {RECALL_TARGET.items.length}{" "}
            retrieved about the cloud provider, {right} of{" "}
            {WORKSHOP_ACTORS.length} placed on the ring this map gives them,
            centre {coreRight ? "right" : "missed"}.
            {peeked ? " Roster reopened during the workshop." : ""}
          </p>

          <div className="border-border bg-card rounded-xl border p-4">
            <p className="text-sm font-semibold">The board is drawn. Now use it.</p>
            <p className="mt-1.5 text-sm leading-relaxed">
              You know who is on it and what part each one plays in a
              declaration. The question the map was drawn for is the next one —
              who can produce evidence about whom, and which of the four things
              a verifier has to establish that evidence would settle. That is{" "}
              <Link
                className="text-link underline underline-offset-4"
                href="/tracks/verification/policy-scoping/actor-edges"
              >
                1.2.3, Who can prove what
              </Link>
              , and it opens on this same board.
            </p>
          </div>
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

