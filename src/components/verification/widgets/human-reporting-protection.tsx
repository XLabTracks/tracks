"use client";

import { useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  REPORTING_CASES,
  type ReportingCase,
} from "@/lib/verification/data/human-reporting-protection";
import { checkReportingAnswer } from "@/lib/verification/engines/human-reporting-protection";
import type { VerificationWidgetProps } from "../kit/types";

type AnswerState = "correct" | "wrong" | null;

/**
 * 2.4.2 asynchronous document lab. Learners assemble two chains from sourced
 * statements: first a legally and operationally usable reporting route, then
 * an evidence path from intake through documented referral. Each link has one
 * supported statement and four plausible overclaims or category errors.
 */
export function HumanReportingProtection({
  onComplete,
  initialCompleted,
}: VerificationWidgetProps) {
  const [caseIndex, setCaseIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [answerId, setAnswerId] = useState("");
  const [answerState, setAnswerState] = useState<AnswerState>(null);
  const [showCaseResult, setShowCaseResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const completedOnce = useRef(initialCompleted);

  const caseFile = REPORTING_CASES[caseIndex];
  const step = caseFile.steps[stepIndex];

  function chooseAnswer(id: string) {
    if (answerState === "correct") return;
    setAnswerId(id);
    setAnswerState(null);
  }

  function checkAnswer() {
    if (!answerId) return;
    setAnswerState(
      checkReportingAnswer(caseFile.id, step.id, answerId)
        ? "correct"
        : "wrong",
    );
  }

  function continueFromAnswer() {
    if (answerState !== "correct") return;
    if (stepIndex === caseFile.steps.length - 1) {
      setShowCaseResult(true);
      return;
    }
    setStepIndex((current) => current + 1);
    setAnswerId("");
    setAnswerState(null);
  }

  function continueFromResult() {
    if (caseIndex < REPORTING_CASES.length - 1) {
      setCaseIndex((current) => current + 1);
      setStepIndex(0);
      setAnswerId("");
      setAnswerState(null);
      setShowCaseResult(false);
      return;
    }
    setFinished(true);
    if (!completedOnce.current) {
      completedOnce.current = true;
      onComplete();
    }
  }

  function restart() {
    setCaseIndex(0);
    setStepIndex(0);
    setAnswerId("");
    setAnswerState(null);
    setShowCaseResult(false);
    setFinished(false);
  }

  return (
    <section className="not-prose border-border bg-card shadow-soft my-6 overflow-hidden rounded-xl border text-sm">
      <header className="border-border border-b p-5 sm:p-6">
        <p className="text-muted-foreground font-sans text-xs font-medium tracking-[0.01em] uppercase">
          Reporting and protection · 2.4.2
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">
          Follow the report
        </h3>
        <p className="text-muted-foreground mt-2 max-w-3xl leading-relaxed">
          Build one route out of the organization and one route from allegation
          to usable evidence. At each link, select the statement supported by
          the assigned sources.
        </p>
        <PhaseRail caseIndex={caseIndex} finished={finished} />
      </header>

      {finished ? (
        <FinalFindings onRestart={restart} />
      ) : showCaseResult ? (
        <CaseResult
          caseFile={caseFile}
          finalCase={caseIndex === REPORTING_CASES.length - 1}
          onContinue={continueFromResult}
        />
      ) : (
        <CaseWork
          caseFile={caseFile}
          stepIndex={stepIndex}
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
  caseIndex,
  finished,
}: {
  caseIndex: number;
  finished: boolean;
}) {
  const active = finished ? 2 : caseIndex;
  const phases = ["1 · Protection route", "2 · Evidence path", "3 · Findings"];

  return (
    <ol className="mt-5 grid grid-cols-3 gap-2" aria-label="Exercise progress">
      {phases.map((label, index) => (
        <li
          key={label}
          className={cn(
            "border-border rounded-md border px-2 py-2 text-center font-sans text-[10px] font-medium tracking-[0.01em] uppercase",
            index === active && "border-primary bg-primary/5 text-primary",
            index < active && "bg-muted/45 text-foreground",
            index > active && "text-muted-foreground",
          )}
          aria-current={index === active ? "step" : undefined}
        >
          {index < active ? (
            <Check className="mr-1 inline size-3" aria-hidden />
          ) : null}
          {label}
        </li>
      ))}
    </ol>
  );
}

function CaseWork({
  caseFile,
  stepIndex,
  answerId,
  answerState,
  onChoose,
  onCheck,
  onContinue,
}: {
  caseFile: ReportingCase;
  stepIndex: number;
  answerId: string;
  answerState: AnswerState;
  onChoose: (id: string) => void;
  onCheck: () => void;
  onContinue: () => void;
}) {
  const step = caseFile.steps[stepIndex];

  return (
    <div>
      <section className="border-border border-b p-5 sm:p-6">
        <p className="text-primary text-xs font-medium tracking-[0.01em] uppercase">
          {caseFile.eyebrow}
        </p>
        <h4 className="mt-2 text-xl font-semibold">{caseFile.title}</h4>
        <p className="text-muted-foreground mt-3 max-w-4xl leading-relaxed">
          {caseFile.body}
        </p>
      </section>

      <ChainRail caseFile={caseFile} stepIndex={stepIndex} />

      <section className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-xs font-medium uppercase">
              Link {stepIndex + 1} of {caseFile.steps.length} · {step.label}
            </p>
            <h4 className="mt-2 max-w-3xl text-lg font-semibold leading-snug">
              {step.prompt}
            </h4>
          </div>
          <span className="border-border bg-muted/35 text-muted-foreground shrink-0 rounded-full border px-2.5 py-1 text-xs">
            1 supported · 4 unsupported
          </span>
        </div>

        <div className="mt-5 grid gap-2" role="radiogroup" aria-label={step.prompt}>
          {step.choices.map((choice, index) => {
            const selected = choice.id === answerId;
            const correct =
              answerState === "correct" && choice.id === step.answerId;
            const wrong =
              answerState === "wrong" && choice.id === answerId;
            return (
              <button
                key={choice.id}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={answerState === "correct"}
                onClick={() => onChoose(choice.id)}
                className={cn(
                  "border-border bg-background hover:border-foreground/35 flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left leading-relaxed transition-colors",
                  selected && "border-primary bg-primary/5",
                  correct && "border-emerald-600/50 bg-emerald-500/8",
                  wrong && "border-destructive/60 bg-destructive/5",
                  answerState === "correct" && !correct && "opacity-55",
                )}
              >
                <span
                  className={cn(
                    "border-border text-muted-foreground mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                    selected && "border-primary text-primary",
                    correct &&
                      "border-emerald-600 bg-emerald-600 text-white",
                    wrong && "border-destructive text-destructive",
                  )}
                >
                  {correct ? <Check className="size-3.5" aria-hidden /> : String.fromCharCode(65 + index)}
                </span>
                <span>{choice.text}</span>
              </button>
            );
          })}
        </div>

        {answerState === "wrong" ? (
          <div className="border-destructive/35 bg-destructive/5 mt-4 rounded-lg border p-4">
            <p className="text-destructive font-medium">That link does not hold.</p>
            <p className="text-muted-foreground mt-1 leading-relaxed">
              {step.retry}
            </p>
          </div>
        ) : null}

        {answerState === "correct" ? (
          <div className="border-emerald-600/30 bg-emerald-500/6 mt-4 rounded-lg border p-4">
            <div className="flex gap-3">
              <CheckCircle2
                className="mt-0.5 size-5 shrink-0 text-emerald-600"
                aria-hidden
              />
              <div>
                <p className="font-medium">Supported</p>
                <p className="text-muted-foreground mt-1 leading-relaxed">
                  {step.explanation}
                </p>
                <a
                  href={step.sourceHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary mt-2 inline-flex items-center gap-1 text-xs font-medium underline-offset-4 hover:underline"
                >
                  {step.sourceLabel}
                  <ExternalLink className="size-3" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-5 flex justify-end">
          {answerState === "correct" ? (
            <Button onClick={onContinue}>
              {stepIndex === caseFile.steps.length - 1
                ? "Assemble finding"
                : "Next link"}
              <ArrowRight className="ml-2 size-4" aria-hidden />
            </Button>
          ) : (
            <Button onClick={onCheck} disabled={!answerId}>
              Check statement
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

function ChainRail({
  caseFile,
  stepIndex,
}: {
  caseFile: ReportingCase;
  stepIndex: number;
}) {
  return (
    <ol className="border-border bg-muted/15 grid grid-cols-2 gap-px border-b sm:grid-cols-3 lg:grid-cols-6">
      {caseFile.steps.map((step, index) => (
        <li
          key={step.id}
          className={cn(
            "bg-card flex min-h-14 items-center gap-2 px-3 py-2 text-xs",
            index === stepIndex && "bg-primary/5 text-primary",
            index < stepIndex && "text-foreground",
            index > stepIndex && "text-muted-foreground",
          )}
          aria-current={index === stepIndex ? "step" : undefined}
        >
          <span
            className={cn(
              "border-border flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
              index < stepIndex &&
                "border-emerald-600 bg-emerald-600 text-white",
              index === stepIndex && "border-primary",
            )}
          >
            {index < stepIndex ? (
              <Check className="size-3" aria-hidden />
            ) : (
              index + 1
            )}
          </span>
          <span>{step.label}</span>
        </li>
      ))}
    </ol>
  );
}

function CaseResult({
  caseFile,
  finalCase,
  onContinue,
}: {
  caseFile: ReportingCase;
  finalCase: boolean;
  onContinue: () => void;
}) {
  const Icon = caseFile.id === "protected-route" ? ShieldCheck : FileCheck2;

  return (
    <section className="p-5 sm:p-6">
      <div className="border-border bg-muted/15 rounded-xl border p-5 sm:p-6">
        <Icon className="text-primary size-7" aria-hidden />
        <p className="text-muted-foreground mt-4 text-xs font-medium uppercase">
          Assembled finding
        </p>
        <h4 className="mt-2 max-w-3xl text-xl font-semibold">
          {caseFile.resultTitle}
        </h4>
        <p className="text-muted-foreground mt-3 max-w-4xl leading-relaxed">
          {caseFile.result}
        </p>
        {caseFile.breakLabel ? (
          <p className="border-border bg-background mt-4 inline-flex rounded-full border px-3 py-1.5 text-xs font-medium">
            {caseFile.breakLabel}
          </p>
        ) : null}
      </div>

      <div className="mt-5 space-y-2">
        {caseFile.steps.map((step) => (
          <div
            key={step.id}
            className="border-border flex items-start gap-3 rounded-lg border px-4 py-3"
          >
            <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
            <p className="leading-relaxed">
              <span className="font-medium">{step.label}:</span>{" "}
              <span className="text-muted-foreground">
                {step.findingLine.replace(`${step.label}: `, "")}
              </span>
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-end">
        <Button onClick={onContinue}>
          {finalCase ? "Record both findings" : "Continue to evidence"}
          <ArrowRight className="ml-2 size-4" aria-hidden />
        </Button>
      </div>
    </section>
  );
}

function FinalFindings({ onRestart }: { onRestart: () => void }) {
  return (
    <section className="p-5 sm:p-6">
      <CheckCircle2 className="size-8 text-emerald-600" aria-hidden />
      <p className="text-muted-foreground mt-4 text-xs font-medium uppercase">
        Two different thresholds
      </p>
      <h4 className="mt-2 text-2xl font-semibold">The report can travel without proving the case</h4>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="border-border rounded-xl border p-5">
          <ShieldCheck className="text-primary size-5" aria-hidden />
          <h5 className="mt-3 font-semibold">Protection finding</h5>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            A statute can protect a person, subject, and recipient while leaving
            identity safeguards, technical competence, or authority unresolved.
          </p>
        </div>
        <div className="border-border rounded-xl border p-5">
          <FileCheck2 className="text-primary size-5" aria-hidden />
          <h5 className="mt-3 font-semibold">Evidence finding</h5>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            Preserved and corroborated records may support one fact without
            supporting the larger allegation. The transmitted package must say
            exactly where that boundary lies.
          </p>
        </div>
      </div>
      <Button variant="outline" className="mt-5" onClick={onRestart}>
        <RotateCcw className="mr-2 size-4" aria-hidden />
        Review both routes
      </Button>
    </section>
  );
}
