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
            Source assessment · 2.3.7
          </p>
        </div>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">
          Who knows what?
        </h3>
        <p className="text-muted-foreground mt-2 max-w-3xl leading-relaxed">
          For each source, identify what they could observe, what they could not
          know, and which independent record could verify the claim. You will
          produce a short assessment for each source.
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
    { id: "map", label: "1 · Assess sources" },
    { id: "examine", label: "2 · Review report" },
    { id: "finding", label: "3 · Record finding" },
  ];
  const active = phases.findIndex((item) => item.id === phase);
  return (
    <ol className="mt-5 grid grid-cols-3 gap-2" aria-label="Exercise progress">
      {phases.map((item, index) => (
        <li
          key={item.id}
          className={cn(
            "border-border rounded-md border px-2 py-2 text-center font-sans text-4xs font-medium tracking-[0.01em] uppercase",
            index === active && "border-primary bg-primary/5 text-brand-ink",
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
            {resolvedActorIds.length} of {SOURCE_ACTORS.length} sources assessed
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
                <span className="text-muted-foreground mt-1 block font-sans text-4xs font-medium tracking-[0.01em] uppercase">
                  {candidate.station}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid xl:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="border-border bg-muted/15 border-b p-5 xl:border-r xl:border-b-0">
          <p className="text-muted-foreground font-sans text-3xs font-medium tracking-[0.01em] uppercase">
            Source
          </p>
          <h4 className="mt-2 text-xl font-semibold">{actor.role}</h4>
          <p className="text-muted-foreground mt-1 text-xs">{actor.station}</p>
          <p className="mt-4 leading-relaxed">{actor.prompt}</p>
          <div className="border-border bg-background mt-4 rounded-lg border p-3">
            <p className="text-muted-foreground font-sans text-3xs font-medium tracking-[0.01em] uppercase">
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
                  <Link2 className="size-4" aria-hidden /> Assessment complete
                </p>
                <p className="mt-2 leading-relaxed">{actor.sentence}</p>
              </div>
            ) : (
              <p className="text-muted-foreground text-xs leading-relaxed">
                A job title alone proves nothing. Limit the claim to what this
                person could observe, state what remains unknown, and choose
                evidence the source did not control.
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {!resolved ? (
                <Button onClick={onTest} className="gap-2">
                  <Link2 className="size-4" aria-hidden /> Check assessment
                </Button>
              ) : allResolved ? (
                <Button onClick={onContinue} className="gap-2">
                  Review a source report{" "}
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
              ) : (
                <Button onClick={onNext} className="gap-2">
                  Next source <ArrowRight className="size-4" aria-hidden />
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
      <p className="text-muted-foreground font-sans text-3xs font-medium tracking-[0.01em] uppercase">
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
        <p className="text-muted-foreground font-sans text-4xs font-medium tracking-[0.01em] uppercase">
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
              <span className="text-muted-foreground mt-1.5 block text-3xs leading-relaxed">
                {card.detail}
              </span>
            </button>
          );
        })}
      </div>
      {result?.messages[kind] && (
        <p
          className="text-destructive mt-2 text-3xs leading-relaxed"
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
        <p className="text-muted-foreground font-sans text-3xs font-medium tracking-[0.01em] uppercase">
          {SOURCE_REPORT.label}
        </p>
        <div className="border-border bg-background mt-3 rounded-lg border p-4">
          <FileSearch className="text-muted-foreground size-5" aria-hidden />
          <p className="mt-3 leading-relaxed">{SOURCE_REPORT.body}</p>
        </div>
        <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
          Assess the report through access, incentives, consistency, and
          independent corroboration. Do not rely on the reporter&apos;s
          reputation.
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
            <p className="text-muted-foreground font-sans text-3xs font-medium tracking-[0.01em] uppercase">
              Question {questionIndex + 1} of {CREDIBILITY_QUESTIONS.length}
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
                ? "Assessment recorded"
                : "This conclusion goes too far"}
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
              <FileSearch className="size-4" aria-hidden /> Check answer
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
              className="text-brand-ink mt-0.5 size-5 shrink-0"
              aria-hidden
            />
            <div>
              <p className="text-brand-ink font-sans text-3xs font-medium tracking-[0.01em] uppercase">
                {FINAL_FINDING.disposition}
              </p>
              <h4 className="mt-2 text-2xl font-semibold tracking-tight">
                Assessment
              </h4>
              <p className="mt-3 leading-relaxed">{FINAL_FINDING.text}</p>
            </div>
          </div>
          <div className="border-border mt-5 border-t pt-4">
            <p className="text-muted-foreground mb-3 font-sans text-3xs font-medium tracking-[0.01em] uppercase">
              Basis for the finding
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
          <p className="text-muted-foreground font-sans text-3xs font-medium tracking-[0.01em] uppercase">
            Common failure modes
          </p>
          <h4 className="mt-2 text-lg font-semibold">
            Why a consistent account may still be wrong
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
            A human source can tell an investigator where to look and which
            records to preserve. Technical or physical evidence is still needed
            for facts the source did not observe.
          </p>
          <Button variant="outline" onClick={onRestart} className="gap-2">
            <RotateCcw className="size-4" aria-hidden /> Start over
          </Button>
        </div>
      </div>
    </div>
  );
}
