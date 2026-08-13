"use client";

import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Blocks,
  Check,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  Gavel,
  Link2,
  ReceiptText,
  RotateCcw,
  Server,
  ShieldQuestion,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CONNECTION_KIND_COPY,
  CONNECTION_KINDS,
  CREDIBILITY_QUESTIONS,
  FAILURE_MODES,
  FINAL_FINDING,
  SOURCE_ACTORS,
  SOURCE_REPORT,
  connectionCard,
  sourceActor,
  type ConnectionKind,
  type SourceActorId,
} from "@/lib/verification/data/human-insiders";
import {
  checkConnection,
  checkCredibilityAnswer,
  type ConnectionCheck,
  type SourceConnection,
} from "@/lib/verification/engines/human-insiders";
import type { VerificationWidgetProps } from "../kit/types";

type Phase = "map" | "examine" | "finding";
type ExamState = "correct" | "wrong" | null;

const ACTOR_ICONS: Record<SourceActorId, LucideIcon> = {
  evaluator: ClipboardCheck,
  "training-engineer": Blocks,
  infrastructure: Server,
  "procurement-finance": ReceiptText,
  "supplier-contractor": Wrench,
  "executive-board": Gavel,
};

/**
 * 2.4.1 source-map exercise. Learners first connect six roles to a bounded
 * observation, a knowledge limit, and an independent test. Correct links
 * draft a usable evidentiary sentence. They then examine one fictional report
 * through access, incentives, consistency, and corroboration — deliberately
 * without a numerical credibility score. Completion fires when the final
 * bounded finding is issued.
 */
export function HumanInsiders({
  onComplete,
  initialCompleted,
}: VerificationWidgetProps) {
  const [phase, setPhase] = useState<Phase>("map");
  const [activeActorId, setActiveActorId] =
    useState<SourceActorId>("evaluator");
  const [selection, setSelection] = useState<SourceConnection>({});
  const [connectionResult, setConnectionResult] =
    useState<ConnectionCheck | null>(null);
  const [resolvedActorIds, setResolvedActorIds] = useState<SourceActorId[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerId, setAnswerId] = useState("");
  const [examState, setExamState] = useState<ExamState>(null);
  const completedOnce = useRef(initialCompleted);

  const actorResolved = resolvedActorIds.includes(activeActorId);
  const question = CREDIBILITY_QUESTIONS[questionIndex];

  function selectActor(actorId: SourceActorId) {
    const next = sourceActor(actorId);
    setActiveActorId(actorId);
    if (resolvedActorIds.includes(actorId)) {
      setSelection(next.correct);
      setConnectionResult(checkConnection(actorId, next.correct));
    } else {
      setSelection({});
      setConnectionResult(null);
    }
  }

  function chooseConnection(kind: ConnectionKind, id: string) {
    if (actorResolved) return;
    setSelection((current) => ({ ...current, [kind]: id }));
    setConnectionResult(null);
  }

  function testConnections() {
    const result = checkConnection(activeActorId, selection);
    setConnectionResult(result);
    if (result.complete && !actorResolved) {
      setResolvedActorIds((current) => [...current, activeActorId]);
    }
  }

  function nextSource() {
    const next = SOURCE_ACTORS.find(
      (candidate) => !resolvedActorIds.includes(candidate.id)
    );
    if (next) selectActor(next.id);
  }

  function beginExamination() {
    setQuestionIndex(0);
    setAnswerId("");
    setExamState(null);
    setPhase("examine");
  }

  function testAnswer() {
    if (!answerId) return;
    setExamState(
      checkCredibilityAnswer(question.id, answerId) ? "correct" : "wrong"
    );
  }

  function nextQuestion() {
    if (examState !== "correct") return;
    if (questionIndex === CREDIBILITY_QUESTIONS.length - 1) {
      setPhase("finding");
      if (!completedOnce.current) {
        completedOnce.current = true;
        onComplete();
      }
      return;
    }
    setQuestionIndex((current) => current + 1);
    setAnswerId("");
    setExamState(null);
  }

  function restart() {
    setPhase("map");
    setActiveActorId("evaluator");
    setSelection({});
    setConnectionResult(null);
    setResolvedActorIds([]);
    setQuestionIndex(0);
    setAnswerId("");
    setExamState(null);
  }

  return (
    <section className="not-prose border-border bg-card shadow-soft my-6 overflow-hidden rounded-xl border text-sm">
      <header className="border-border border-b p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground font-sans text-xs font-medium tracking-[0.01em] uppercase">
            Source desk · 2.4.1
          </p>
          <span className="border-border bg-background text-muted-foreground rounded-full border px-3 py-1 font-sans text-[11px] font-medium tracking-[0.01em] uppercase">
            No credibility score
          </span>
        </div>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">
          Who knows what?
        </h3>
        <p className="text-muted-foreground mt-2 max-w-3xl leading-relaxed">
          Connect each source to a fact they can support, the edge of their
          knowledge, and a record that could test the claim. Each sound chain
          drafts one sentence for the case file.
        </p>
        <PhaseRail phase={phase} />
      </header>

      {phase === "map" ? (
        <MapPhase
          actorId={activeActorId}
          resolvedActorIds={resolvedActorIds}
          selection={selection}
          result={connectionResult}
          onSelectActor={selectActor}
          onChoose={chooseConnection}
          onTest={testConnections}
          onNext={nextSource}
          onContinue={beginExamination}
        />
      ) : phase === "examine" ? (
        <ExaminationPhase
          questionIndex={questionIndex}
          answerId={answerId}
          state={examState}
          onChoose={(id) => {
            setAnswerId(id);
            setExamState(null);
          }}
          onTest={testAnswer}
          onNext={nextQuestion}
          onBack={() => setPhase("map")}
        />
      ) : (
        <FindingPhase onRestart={restart} />
      )}
    </section>
  );
}

function PhaseRail({ phase }: { phase: Phase }) {
  const phases: { id: Phase; label: string }[] = [
    { id: "map", label: "1 · Map access" },
    { id: "examine", label: "2 · Examine report" },
    { id: "finding", label: "3 · Issue finding" },
  ];
  const active = phases.findIndex((item) => item.id === phase);
  return (
    <ol className="mt-5 grid grid-cols-3 gap-2" aria-label="Exercise progress">
      {phases.map((item, index) => (
        <li
          key={item.id}
          className={cn(
            "border-border rounded-md border px-2 py-2 text-center font-sans text-[10px] font-medium tracking-[0.01em] uppercase",
            index === active && "border-primary bg-primary/5 text-primary",
            index < active && "bg-muted/45 text-foreground",
            index > active && "text-muted-foreground"
          )}
          aria-current={index === active ? "step" : undefined}
        >
          {index < active && (
            <Check className="mr-1 inline size-3" aria-hidden />
          )}
          {item.label}
        </li>
      ))}
    </ol>
  );
}

function MapPhase({
  actorId,
  resolvedActorIds,
  selection,
  result,
  onSelectActor,
  onChoose,
  onTest,
  onNext,
  onContinue,
}: {
  actorId: SourceActorId;
  resolvedActorIds: SourceActorId[];
  selection: SourceConnection;
  result: ConnectionCheck | null;
  onSelectActor: (id: SourceActorId) => void;
  onChoose: (kind: ConnectionKind, id: string) => void;
  onTest: () => void;
  onNext: () => void;
  onContinue: () => void;
}) {
  const actor = sourceActor(actorId);
  const resolved = resolvedActorIds.includes(actorId);
  const allResolved = resolvedActorIds.length === SOURCE_ACTORS.length;

  return (
    <div>
      <div className="border-border bg-muted/20 border-b p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">
            Source map · {resolvedActorIds.length} of {SOURCE_ACTORS.length}{" "}
            case sentences drafted
          </p>
          <div
            className="bg-muted h-1.5 w-28 overflow-hidden rounded-full sm:w-44"
            aria-hidden
          >
            <div
              className="bg-primary h-full rounded-full transition-[width]"
              style={{
                width: `${
                  (resolvedActorIds.length / SOURCE_ACTORS.length) * 100
                }%`,
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
          {SOURCE_ACTORS.map((candidate) => {
            const Icon = ACTOR_ICONS[candidate.id];
            const done = resolvedActorIds.includes(candidate.id);
            return (
              <button
                key={candidate.id}
                type="button"
                onClick={() => onSelectActor(candidate.id)}
                aria-pressed={actorId === candidate.id}
                className={cn(
                  "border-border bg-background hover:bg-muted relative min-h-24 rounded-lg border p-3 text-left transition-colors",
                  actorId === candidate.id &&
                    "border-primary ring-primary/20 ring-2"
                )}
              >
                <span className="flex items-start justify-between gap-2">
                  <Icon className="text-muted-foreground size-4" aria-hidden />
                  {done && (
                    <CheckCircle2
                      className="text-comply size-4"
                      aria-label="Connected"
                    />
                  )}
                </span>
                <span className="mt-3 block text-xs font-semibold leading-snug">
                  {candidate.role}
                </span>
                <span className="text-muted-foreground mt-1 block font-sans text-[10px] font-medium tracking-[0.01em] uppercase">
                  {candidate.station}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid xl:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="border-border bg-muted/15 border-b p-5 xl:border-r xl:border-b-0">
          <p className="text-muted-foreground font-sans text-[11px] font-medium tracking-[0.01em] uppercase">
            Source card
          </p>
          <h4 className="mt-2 text-xl font-semibold">{actor.role}</h4>
          <p className="text-muted-foreground mt-1 text-xs">{actor.station}</p>
          <p className="mt-4 leading-relaxed">{actor.prompt}</p>
          <div className="border-border bg-background mt-4 rounded-lg border p-3">
            <p className="text-muted-foreground font-sans text-[11px] font-medium tracking-[0.01em] uppercase">
              Reported claim
            </p>
            <p className="mt-2 text-sm leading-relaxed">“{actor.report}”</p>
          </div>
          <SourceClue label="Incentives" text={actor.incentives} />
          <SourceClue label="Consistency test" text={actor.consistencyTest} />
        </aside>

        <div className="p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-3">
            {CONNECTION_KINDS.map((kind) => (
              <ConnectionColumn
                key={kind}
                actorId={actorId}
                kind={kind}
                selectedId={selection[kind]}
                result={result}
                locked={resolved}
                onChoose={onChoose}
              />
            ))}
          </div>

          <div className="border-border mt-5 border-t pt-5">
            {result?.complete ? (
              <div className="border-comply/40 bg-comply/5 rounded-lg border p-4">
                <p className="text-comply flex items-center gap-2 text-xs font-semibold">
                  <Link2 className="size-4" aria-hidden /> Chain connected ·
                  sentence drafted
                </p>
                <p className="mt-2 leading-relaxed">{actor.sentence}</p>
              </div>
            ) : (
              <p className="text-muted-foreground text-xs leading-relaxed">
                The actor&apos;s title is not evidence. Build the smallest
                statement their access supports, name the blind spot, then
                attach a test the source does not control.
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {!resolved ? (
                <Button onClick={onTest} className="gap-2">
                  <Link2 className="size-4" aria-hidden /> Test connections
                </Button>
              ) : allResolved ? (
                <Button onClick={onContinue} className="gap-2">
                  Examine a source report{" "}
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
              ) : (
                <Button onClick={onNext} className="gap-2">
                  Next unresolved source{" "}
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceClue({ label, text }: { label: string; text: string }) {
  return (
    <div className="border-border mt-4 border-t pt-3">
      <p className="text-muted-foreground font-sans text-[11px] font-medium tracking-[0.01em] uppercase">
        {label}
      </p>
      <p className="mt-1 text-xs leading-relaxed">{text}</p>
    </div>
  );
}

function ConnectionColumn({
  actorId,
  kind,
  selectedId,
  result,
  locked,
  onChoose,
}: {
  actorId: SourceActorId;
  kind: ConnectionKind;
  selectedId?: string;
  result: ConnectionCheck | null;
  locked: boolean;
  onChoose: (kind: ConnectionKind, id: string) => void;
}) {
  const actor = sourceActor(actorId);
  const copy = CONNECTION_KIND_COPY[kind];
  const state = result ? (result.correct[kind] ? "correct" : "wrong") : "idle";

  return (
    <section>
      <div className="mb-2 min-h-12">
        <p className="text-muted-foreground font-sans text-[10px] font-medium tracking-[0.01em] uppercase">
          {copy.eyebrow}
        </p>
        <h5 className="mt-1 text-xs font-semibold leading-snug">
          {copy.question}
        </h5>
      </div>
      <div className="space-y-2">
        {actor.choices[kind].map((id) => {
          const card = connectionCard(kind, id);
          const selected = selectedId === id;
          return (
            <button
              key={id}
              type="button"
              disabled={locked}
              onClick={() => onChoose(kind, id)}
              aria-pressed={selected}
              className={cn(
                "border-border bg-background hover:bg-muted w-full rounded-lg border p-3 text-left transition-colors disabled:cursor-default",
                selected && "border-primary ring-primary/20 ring-2",
                selected &&
                  state === "correct" &&
                  "border-comply ring-comply/20",
                selected &&
                  state === "wrong" &&
                  "border-destructive ring-destructive/15"
              )}
            >
              <span className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold leading-snug">
                  {card.label}
                </span>
                {selected && state === "correct" && (
                  <Check
                    className="text-comply mt-0.5 size-3.5 shrink-0"
                    aria-hidden
                  />
                )}
              </span>
              <span className="text-muted-foreground mt-1.5 block text-[11px] leading-relaxed">
                {card.detail}
              </span>
            </button>
          );
        })}
      </div>
      {result?.messages[kind] && (
        <p
          className="text-destructive mt-2 text-[11px] leading-relaxed"
          role="alert"
        >
          {result.messages[kind]}
        </p>
      )}
    </section>
  );
}

function ExaminationPhase({
  questionIndex,
  answerId,
  state,
  onChoose,
  onTest,
  onNext,
  onBack,
}: {
  questionIndex: number;
  answerId: string;
  state: ExamState;
  onChoose: (id: string) => void;
  onTest: () => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const question = CREDIBILITY_QUESTIONS[questionIndex];
  return (
    <div className="grid xl:grid-cols-[20rem_minmax(0,1fr)]">
      <aside className="border-border bg-muted/15 border-b p-5 xl:border-r xl:border-b-0">
        <p className="text-muted-foreground font-sans text-[11px] font-medium tracking-[0.01em] uppercase">
          {SOURCE_REPORT.label}
        </p>
        <div className="border-border bg-background mt-3 rounded-lg border p-4">
          <FileSearch className="text-muted-foreground size-5" aria-hidden />
          <p className="mt-3 leading-relaxed">{SOURCE_REPORT.body}</p>
        </div>
        <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
          Examine the report, not the reporter&apos;s reputation. Each answer
          adds one line to the final finding.
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mt-3 gap-2"
        >
          <ArrowLeft className="size-4" aria-hidden /> Back to source map
        </Button>
      </aside>

      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-muted-foreground font-sans text-[11px] font-medium tracking-[0.01em] uppercase">
              Examination {questionIndex + 1} of {CREDIBILITY_QUESTIONS.length}
            </p>
            <h4 className="mt-2 text-xl font-semibold">{question.label}</h4>
          </div>
          <ShieldQuestion
            className="text-muted-foreground size-6"
            aria-hidden
          />
        </div>
        <p className="mt-3 max-w-2xl leading-relaxed">{question.prompt}</p>

        <div className="mt-5 grid gap-3">
          {question.choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => onChoose(choice.id)}
              aria-pressed={answerId === choice.id}
              className={cn(
                "border-border bg-background hover:bg-muted rounded-lg border p-4 text-left leading-relaxed transition-colors",
                answerId === choice.id &&
                  "border-primary ring-primary/20 ring-2",
                answerId === choice.id &&
                  state === "wrong" &&
                  "border-destructive ring-destructive/15",
                answerId === choice.id &&
                  state === "correct" &&
                  "border-comply ring-comply/20"
              )}
            >
              {choice.text}
            </button>
          ))}
        </div>

        {state && (
          <div
            className={cn(
              "mt-5 rounded-lg border p-4",
              state === "correct"
                ? "border-comply/40 bg-comply/5"
                : "border-destructive/40 bg-destructive/5"
            )}
            role={state === "wrong" ? "alert" : "status"}
          >
            <p
              className={cn(
                "text-xs font-semibold",
                state === "correct" ? "text-comply" : "text-destructive"
              )}
            >
              {state === "correct"
                ? "Finding line added"
                : "Narrow the inference"}
            </p>
            <p className="mt-2 leading-relaxed">
              {state === "correct" ? question.explanation : question.retry}
            </p>
            {state === "correct" && (
              <p className="border-border mt-3 border-t pt-3 text-xs leading-relaxed">
                {question.findingLine}
              </p>
            )}
          </div>
        )}

        <div className="mt-5 flex gap-2">
          {state === "correct" ? (
            <Button onClick={onNext} className="gap-2">
              {questionIndex === CREDIBILITY_QUESTIONS.length - 1
                ? "Issue finding"
                : "Continue"}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          ) : (
            <Button onClick={onTest} disabled={!answerId} className="gap-2">
              <FileSearch className="size-4" aria-hidden /> Test this answer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function FindingPhase({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="p-5 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="border-primary/35 bg-primary/5 rounded-xl border p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <Gavel
              className="text-primary mt-0.5 size-5 shrink-0"
              aria-hidden
            />
            <div>
              <p className="text-primary font-sans text-[11px] font-medium tracking-[0.01em] uppercase">
                {FINAL_FINDING.disposition}
              </p>
              <h4 className="mt-2 text-2xl font-semibold tracking-tight">
                Bounded finding
              </h4>
              <p className="mt-3 leading-relaxed">{FINAL_FINDING.text}</p>
            </div>
          </div>
          <div className="border-border mt-5 border-t pt-4">
            <p className="text-muted-foreground mb-3 font-sans text-[11px] font-medium tracking-[0.01em] uppercase">
              Four lines in the record
            </p>
            <ol className="space-y-2">
              {CREDIBILITY_QUESTIONS.map((question) => (
                <li
                  key={question.id}
                  className="flex gap-2 text-xs leading-relaxed"
                >
                  <Check
                    className="text-comply mt-0.5 size-3.5 shrink-0"
                    aria-hidden
                  />
                  <span>{question.findingLine}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <section className="mt-6">
          <p className="text-muted-foreground font-sans text-[11px] font-medium tracking-[0.01em] uppercase">
            Red-team the human layer
          </p>
          <h4 className="mt-2 text-lg font-semibold">
            Four ways an apparently coherent account can still fail
          </h4>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {FAILURE_MODES.map((mode) => (
              <article
                key={mode.name}
                className="border-border rounded-lg border p-4"
              >
                <h5 className="text-sm font-semibold">{mode.name}</h5>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                  {mode.check}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="border-border mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
          <p className="text-muted-foreground max-w-2xl text-xs leading-relaxed">
            Human evidence often tells a verifier where to look and what to
            preserve. Technical and physical evidence must still carry the links
            the source could not observe.
          </p>
          <Button variant="outline" onClick={onRestart} className="gap-2">
            <RotateCcw className="size-4" aria-hidden /> Reopen the case
          </Button>
        </div>
      </div>
    </div>
  );
}
