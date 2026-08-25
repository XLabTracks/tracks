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

type Placement = Record<string, string>;

export function HumanReportingProtection({
  onComplete,
  initialCompleted,
}: VerificationWidgetProps) {
  const [caseIndex, setCaseIndex] = useState(0);
  const [placed, setPlaced] = useState<Placement>({});
  const [checked, setChecked] = useState(false);
  const [showCaseResult, setShowCaseResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [held, setHeld] = useState<string | null>(null);
  const completedOnce = useRef(initialCompleted);

  const caseFile = REPORTING_CASES[caseIndex];

  function fill(stepId: string) {
    if (!held) return;
    const next: Placement = {};
    for (const [slot, choice] of Object.entries(placed)) {
      if (slot !== stepId && choice !== held) next[slot] = choice;
    }
    next[stepId] = held;
    setPlaced(next);
    setHeld(null);
    setChecked(false);
  }

  function clear(stepId: string) {
    const next = { ...placed };
    delete next[stepId];
    setPlaced(next);
    setChecked(false);
  }

  const filled = caseFile.steps.every((step) => placed[step.id]);
  const allRight =
    filled &&
    caseFile.steps.every((step) =>
      checkReportingAnswer(caseFile.id, step.id, placed[step.id]!),
    );

  function continueFromResult() {
    if (caseIndex < REPORTING_CASES.length - 1) {
      setCaseIndex((current) => current + 1);
      setPlaced({});
      setHeld(null);
      setChecked(false);
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
    setPlaced({});
    setHeld(null);
    setChecked(false);
    setShowCaseResult(false);
    setFinished(false);
  }

  return (
    <section className="not-prose border-border bg-card shadow-soft my-6 overflow-hidden rounded-xl border text-sm">
      <header className="border-border border-b p-5 sm:p-6">
        <p className="eyebrow text-muted-foreground font-sans font-medium">
          Reporting and protection · 2.4.2
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">
          Follow the report
        </h3>
        <p className="text-muted-foreground mt-2 max-w-3xl leading-relaxed">
          Reconstruct one route out of the organization and one route from
          allegation to usable evidence. Every statement in the bank belongs to
          at most one link, and half of them belong to none.
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
          placed={placed}
          held={held}
          checked={checked}
          filled={filled}
          allRight={allRight}
          onHold={setHeld}
          onFill={fill}
          onClear={clear}
          onCheck={() => setChecked(true)}
          onContinue={() => setShowCaseResult(true)}
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
            "eyebrow border-border rounded-md border px-2 py-2 text-center font-sans font-medium",
            index === active && "border-primary bg-primary/5 text-brand-ink",
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
  placed,
  held,
  checked,
  filled,
  allRight,
  onHold,
  onFill,
  onClear,
  onCheck,
  onContinue,
}: {
  caseFile: ReportingCase;
  placed: Placement;
  held: string | null;
  checked: boolean;
  filled: boolean;
  allRight: boolean;
  onHold: (id: string | null) => void;
  onFill: (stepId: string) => void;
  onClear: (stepId: string) => void;
  onCheck: () => void;
  onContinue: () => void;
}) {
  const bank = statementBank(caseFile);
  const used = new Set(Object.values(placed));
  const wrong = checked
    ? caseFile.steps.filter(
        (step) =>
          placed[step.id] &&
          !checkReportingAnswer(caseFile.id, step.id, placed[step.id]!),
      )
    : [];

  return (
    <div>
      <section className="border-border border-b p-5 sm:p-6">
        <p className="eyebrow text-brand-ink font-medium">
          {caseFile.eyebrow}
        </p>
        <h4 className="mt-2 text-xl font-semibold">{caseFile.title}</h4>
        <p className="text-muted-foreground mt-3 max-w-4xl leading-relaxed">
          {caseFile.body}
        </p>
      </section>

      <section className="p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h4 className="text-lg font-semibold">The route</h4>
          <p className="text-muted-foreground text-xs">
            {Object.keys(placed).length} of {caseFile.steps.length} links placed
          </p>
        </div>

        <ol className="mt-4 space-y-2">
          {caseFile.steps.map((step, index) => {
            const choiceId = placed[step.id];
            const choice = step.choices.find((c) => c.id === choiceId);
            const statement =
              choice ?? findStatement(caseFile, choiceId);
            const isWrong = wrong.some((s) => s.id === step.id);
            const right =
              checked &&
              choiceId &&
              checkReportingAnswer(caseFile.id, step.id, choiceId);
            return (
              <li key={step.id}>
                <div
                  className={cn(
                    "border-border rounded-lg border",
                    right && "border-emerald-600/50 bg-emerald-500/8",
                    isWrong && "border-destructive/60 bg-destructive/5",
                  )}
                >
                  <div className="flex items-stretch gap-3 p-3">
                    <span className="border-border text-muted-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-muted-foreground font-sans eyebrow font-medium">
                        {step.label}
                      </p>
                      {statement ? (
                        <button
                          type="button"
                          onClick={() => onClear(step.id)}
                          className="mt-1 w-full text-left leading-relaxed hover:opacity-70"
                          aria-label={`Remove the statement placed on ${step.label}`}
                        >
                          {statement.text}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={!held}
                          onClick={() => onFill(step.id)}
                          className={cn(
                            "border-border text-muted-foreground mt-1 w-full rounded-md border border-dashed px-3 py-2 text-left text-sm",
                            held
                              ? "border-primary text-brand-ink hover:bg-primary/5"
                              : "opacity-70",
                          )}
                        >
                          {held ? "Place it here" : "Empty"}
                        </button>
                      )}
                    </div>
                  </div>

                  {isWrong ? (
                    <p className="text-muted-foreground border-destructive/25 border-t px-3 py-2 text-xs leading-relaxed">
                      {step.retry}
                    </p>
                  ) : null}

                  {right ? (
                    <div className="border-emerald-600/25 border-t px-3 py-2">
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {step.explanation}
                      </p>
                      <a
                        href={step.sourceHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-ink mt-1.5 inline-flex items-center gap-1 text-xs font-medium underline-offset-4 hover:underline"
                      >
                        {step.sourceLabel}
                        <ExternalLink className="size-3" aria-hidden />
                      </a>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h4 className="text-lg font-semibold">Statements</h4>
            <p className="text-muted-foreground text-xs">
              Each belongs to at most one link. Half belong to none.
            </p>
          </div>
          <div className="mt-3 grid gap-2">
            {bank.map((entry) => {
              const taken = used.has(entry.id);
              if (taken) return null;
              const holding = held === entry.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  aria-pressed={holding}
                  onClick={() => onHold(holding ? null : entry.id)}
                  className={cn(
                    "border-border bg-background hover:border-foreground/35 w-full rounded-lg border px-4 py-3 text-left leading-relaxed transition-colors",
                    holding && "border-primary bg-primary/5",
                  )}
                >
                  {entry.text}
                </button>
              );
            })}
          </div>
        </div>

        {checked && !allRight ? (
          <div className="border-destructive/35 bg-destructive/5 mt-5 rounded-lg border p-4">
            <p className="text-destructive font-medium">
              {wrong.length === 1
                ? "One link does not hold."
                : `${wrong.length} links do not hold.`}
            </p>
            <p className="text-muted-foreground mt-1 leading-relaxed">
              Each is marked with what it got wrong. Press a placed statement to
              take it back.
            </p>
          </div>
        ) : null}

        <div className="mt-5 flex justify-end">
          {checked && allRight ? (
            <Button onClick={onContinue}>
              Assemble finding
              <ArrowRight className="ml-2 size-4" aria-hidden />
            </Button>
          ) : (
            <Button onClick={onCheck} disabled={!filled}>
              Check the route
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

function statementBank(caseFile: ReportingCase) {
  const entries = caseFile.steps.flatMap((step) => {
    const right = step.choices.find((c) => c.id === step.answerId)!;
    const decoy = step.choices.find((c) => c.id !== step.answerId)!;
    return [right, decoy];
  });
  return [...entries].sort((a, b) => a.id.localeCompare(b.id));
}

function findStatement(caseFile: ReportingCase, choiceId: string | undefined) {
  if (!choiceId) return undefined;
  for (const step of caseFile.steps) {
    const hit = step.choices.find((c) => c.id === choiceId);
    if (hit) return hit;
  }
  return undefined;
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
        <Icon className="text-brand-ink size-7" aria-hidden />
        <p className="eyebrow text-muted-foreground mt-4 font-medium">
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
      <p className="eyebrow text-muted-foreground mt-4 font-medium">
        Two different thresholds
      </p>
      <h4 className="mt-2 text-2xl font-semibold">The report can travel without proving the case</h4>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="border-border rounded-xl border p-5">
          <ShieldCheck className="text-brand-ink size-5" aria-hidden />
          <h5 className="mt-3 font-semibold">Protection finding</h5>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            A statute can protect a person, subject, and recipient while leaving
            identity safeguards, technical competence, or authority unresolved.
          </p>
        </div>
        <div className="border-border rounded-xl border p-5">
          <FileCheck2 className="text-brand-ink size-5" aria-hidden />
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
