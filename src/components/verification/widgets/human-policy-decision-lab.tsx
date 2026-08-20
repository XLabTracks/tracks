"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  HumanPolicyLab,
  HumanPolicyPhase,
  HumanPolicyStep,
} from "@/lib/verification/data/human-policy-labs";
import { checkHumanPolicyDecision } from "@/lib/verification/engines/human-policy-labs";
import type { VerificationWidgetProps } from "../kit/types";

type AnswerState = "supported" | "unsupported" | null;

export function HumanPolicyDecisionLab({
  lab,
  onComplete,
  initialCompleted,
}: VerificationWidgetProps & { lab: HumanPolicyLab }) {
  const steps = useMemo(
    () => lab.phases.flatMap((phase) => phase.steps),
    [lab]
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [answerId, setAnswerId] = useState("");
  const [answerState, setAnswerState] = useState<AnswerState>(null);
  const [finished, setFinished] = useState(false);
  const completedOnce = useRef(initialCompleted);

  const step = steps[stepIndex];
  const phaseIndex = lab.phases.findIndex((phase) =>
    phase.steps.some((candidate) => candidate.id === step?.id)
  );

  function chooseAnswer(id: string) {
    if (answerState === "supported") return;
    setAnswerId(id);
    setAnswerState(null);
  }

  function checkAnswer() {
    if (!answerId) return;
    setAnswerState(
      checkHumanPolicyDecision(lab.id, step.id, answerId)
        ? "supported"
        : "unsupported"
    );
  }

  function continueFromAnswer() {
    if (answerState !== "supported") return;
    if (stepIndex === steps.length - 1) {
      setFinished(true);
      if (!completedOnce.current) {
        completedOnce.current = true;
        onComplete();
      }
      return;
    }
    setStepIndex((current) => current + 1);
    setAnswerId("");
    setAnswerState(null);
  }

  function restart() {
    setStepIndex(0);
    setAnswerId("");
    setAnswerState(null);
    setFinished(false);
  }

  return (
    <section className="not-prose border-border bg-card shadow-soft my-6 overflow-hidden rounded-xl border text-sm">
      <header className="border-border border-b p-5 sm:p-6">
        <p className="text-muted-foreground text-xs font-medium tracking-[0.01em] uppercase">
          {lab.eyebrow}
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">
          {lab.title}
        </h3>
        <p className="text-muted-foreground mt-2 max-w-4xl leading-relaxed">
          {lab.instruction}
        </p>
        <PhaseRail
          phases={lab.phases}
          active={finished ? lab.phases.length : phaseIndex}
        />
      </header>

      {finished ? (
        <CompletedFile lab={lab} onRestart={restart} />
      ) : (
        <DecisionStep
          lab={lab}
          step={step}
          stepIndex={stepIndex}
          stepCount={steps.length}
          answerId={answerId}
          answerState={answerState}
          onChoose={chooseAnswer}
          onCheck={checkAnswer}
          onContinue={continueFromAnswer}
        />
      )}
    </section>
  );
}

function PhaseRail({
  phases,
  active,
}: {
  phases: readonly HumanPolicyPhase[];
  active: number;
}) {
  return (
    <ol
      className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-4"
      aria-label="Decision-file progress"
    >
      {phases.map((phase, index) => (
        <li
          key={phase.id}
          className={cn(
            "border-border rounded-md border px-2 py-2 text-center text-4xs font-medium tracking-[0.01em] uppercase",
            index === active && "border-primary bg-primary/5 text-brand-ink",
            index < active && "bg-muted/45 text-foreground",
            index > active && "text-muted-foreground"
          )}
          aria-current={index === active ? "step" : undefined}
        >
          {index < active ? (
            <Check className="mr-1 inline size-3" aria-hidden />
          ) : null}
          {index + 1} · {phase.label}
        </li>
      ))}
    </ol>
  );
}

function DecisionStep({
  lab,
  step,
  stepIndex,
  stepCount,
  answerId,
  answerState,
  onChoose,
  onCheck,
  onContinue,
}: {
  lab: HumanPolicyLab;
  step: HumanPolicyStep;
  stepIndex: number;
  stepCount: number;
  answerId: string;
  answerState: AnswerState;
  onChoose: (id: string) => void;
  onCheck: () => void;
  onContinue: () => void;
}) {
  return (
    <div>
      <section className="border-border bg-muted/15 border-b p-5 sm:p-6">
        <p className="text-brand-ink text-xs font-medium tracking-[0.01em] uppercase">
          Case file
        </p>
        <h4 className="mt-2 text-xl font-semibold">{lab.caseTitle}</h4>
        <p className="text-muted-foreground mt-3 max-w-4xl leading-relaxed">
          {lab.caseBody}
        </p>
      </section>

      <section className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-xs font-medium uppercase">
              Decision {stepIndex + 1} of {stepCount} · {step.label}
            </p>
            <h4 className="mt-2 max-w-3xl text-lg leading-snug font-semibold">
              {step.prompt}
            </h4>
          </div>
        </div>

        {step.context ? (
          <p className="border-border bg-muted/20 text-muted-foreground mt-4 rounded-lg border p-4 leading-relaxed">
            {step.context}
          </p>
        ) : null}

        <div
          className="mt-5 grid gap-2"
          role="radiogroup"
          aria-label={step.prompt}
        >
          {step.choices.map((choice, index) => {
            const selected = answerId === choice.id;
            const supported =
              answerState === "supported" && choice.id === step.answerId;
            const unsupported = answerState === "unsupported" && selected;
            return (
              <button
                key={choice.id}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={answerState === "supported"}
                onClick={() => onChoose(choice.id)}
                className={cn(
                  "border-border bg-background hover:border-foreground/35 flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left leading-relaxed transition-colors",
                  selected && "border-primary bg-primary/5",
                  supported && "border-emerald-600/50 bg-emerald-500/8",
                  unsupported && "border-destructive/60 bg-destructive/5",
                  answerState === "supported" && !supported && "opacity-55"
                )}
              >
                <span
                  className={cn(
                    "border-border text-muted-foreground mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                    selected && "border-primary text-brand-ink",
                    supported && "border-emerald-600 bg-emerald-600 text-white",
                    unsupported && "border-destructive text-destructive"
                  )}
                >
                  {supported ? (
                    <Check className="size-3.5" aria-hidden />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </span>
                <span>{choice.text}</span>
              </button>
            );
          })}
        </div>

        {answerState === "unsupported" ? (
          <div className="border-destructive/35 bg-destructive/5 mt-4 rounded-lg border p-4">
            <p className="text-destructive font-medium">
              Not supported by this record.
            </p>
            <p className="text-muted-foreground mt-1 leading-relaxed">
              {step.retry}
            </p>
          </div>
        ) : null}

        {answerState === "supported" ? (
          <div className="border-emerald-600/30 bg-emerald-500/6 mt-4 rounded-lg border p-4">
            <div className="flex gap-3">
              <CheckCircle2
                className="mt-0.5 size-5 shrink-0 text-emerald-600"
                aria-hidden
              />
              <div>
                <p className="font-medium">Added to the file</p>
                <p className="text-muted-foreground mt-1 leading-relaxed">
                  {step.explanation}
                </p>
                <a
                  href={step.sourceHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-ink mt-2 inline-flex items-center gap-1 text-xs font-medium underline-offset-4 hover:underline"
                >
                  {step.sourceLabel}
                  <ExternalLink className="size-3" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-5 flex justify-end">
          {answerState === "supported" ? (
            <Button onClick={onContinue}>
              {stepIndex === stepCount - 1 ? "Assemble file" : "Next decision"}
              <ArrowRight className="ml-2 size-4" aria-hidden />
            </Button>
          ) : (
            <Button onClick={onCheck} disabled={!answerId}>
              Commit line
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

function CompletedFile({
  lab,
  onRestart,
}: {
  lab: HumanPolicyLab;
  onRestart: () => void;
}) {
  return (
    <section className="p-5 sm:p-6">
      <div className="flex gap-3">
        <FileCheck2
          className="text-brand-ink mt-0.5 size-6 shrink-0"
          aria-hidden
        />
        <div>
          <p className="text-brand-ink text-xs font-medium tracking-[0.01em] uppercase">
            Completed file
          </p>
          <h4 className="mt-2 text-xl font-semibold">{lab.artifactTitle}</h4>
          <p className="text-muted-foreground mt-2 max-w-4xl leading-relaxed">
            {lab.artifactIntro}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {lab.phases.map((phase, phaseIndex) => (
          <section
            key={phase.id}
            className="border-border rounded-lg border p-4"
          >
            <p className="text-muted-foreground text-xs font-medium tracking-[0.01em] uppercase">
              {phaseIndex + 1} · {phase.label}
            </p>
            <ul className="mt-3 space-y-2">
              {phase.steps.map((step) => (
                <li key={step.id} className="flex gap-2 leading-relaxed">
                  <Check
                    className="mt-1 size-3.5 shrink-0 text-emerald-600"
                    aria-hidden
                  />
                  <span>{step.findingLine}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={onRestart}>
          <RotateCcw className="mr-2 size-4" aria-hidden />
          Rebuild file
        </Button>
      </div>
    </section>
  );
}
