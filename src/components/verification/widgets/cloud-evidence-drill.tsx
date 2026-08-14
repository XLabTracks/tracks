"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CLOUD_AVAILABLE_DATA,
  CLOUD_CASE_OPTIONS,
  CLOUD_CONCEPT_ROWS,
  CLOUD_CONCEPTS,
  CLOUD_INFERENCE_OPTIONS,
  CLOUD_MATCH_CONCLUSIONS,
  CLOUD_MATCH_ROWS,
  CLOUD_ODD_ITEMS,
  CLOUD_ODD_PRINCIPLES,
  CLOUD_PIPELINE_GAPS,
  CLOUD_PIPELINE_OPTIONS,
  CLOUD_SEQUENCE,
  CLOUD_SEQUENCE_START,
  CLOUD_SOURCES,
  CLOUD_TASKS,
  CLOUD_TRUE_FALSE,
  type CloudSource,
} from "@/lib/verification/data/cloud-evidence-drill";
import type { VerificationWidgetProps } from "../kit/types";

type Verdict = "correct" | "wrong" | null;
type SolveProps = { onSolved: () => void };

/**
 * Module 2.2's thirty-minute assessment. The tasks move from identifying a
 * provider-held datum to bounding the conclusion that datum can support, then
 * combine identity, workload, and threshold evidence in a short case.
 */
export function CloudEvidenceDrill({
  onComplete,
  initialCompleted,
}: VerificationWidgetProps) {
  const [taskIndex, setTaskIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  const [finished, setFinished] = useState(false);
  const completedOnce = useRef(initialCompleted);
  const task = CLOUD_TASKS[taskIndex];

  function finishOrContinue() {
    if (!solved) return;
    if (taskIndex < CLOUD_TASKS.length - 1) {
      setTaskIndex((current) => current + 1);
      setSolved(false);
      return;
    }
    setFinished(true);
    if (!completedOnce.current) {
      completedOnce.current = true;
      onComplete();
    }
  }

  function restart() {
    setTaskIndex(0);
    setSolved(false);
    setFinished(false);
  }

  return (
    <section className="not-prose border-border bg-card shadow-soft my-6 overflow-hidden rounded-xl border text-sm">
      <header className="border-border border-b p-5 sm:p-6">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Cloud · 2.2 · 30 minutes
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">
          Cloud verification problem set
        </h3>
        <p className="text-muted-foreground mt-2 max-w-3xl leading-relaxed">
          Answer from the assigned readings. Treat every qualifier as part of
          the question. Select only conclusions supported by the stated access
          and evidence.
        </p>
        <ProgressRail taskIndex={taskIndex} finished={finished} />
      </header>

      {finished ? (
        <Finish onRestart={restart} />
      ) : (
        <div>
          <section className="border-border border-b p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Task {taskIndex + 1} of {CLOUD_TASKS.length} · {task.time}
              </p>
              <p className="text-muted-foreground text-xs">{task.label}</p>
            </div>
            <h4 className="mt-2 text-xl font-semibold">{task.title}</h4>
          </section>

          <div key={taskIndex} className="p-5 sm:p-6">
            {taskIndex === 0 ? (
              <TrueFalseTask onSolved={() => setSolved(true)} />
            ) : taskIndex === 1 ? (
              <OddOneOutTask onSolved={() => setSolved(true)} />
            ) : taskIndex === 2 ? (
              <AvailableDataTask onSolved={() => setSolved(true)} />
            ) : taskIndex === 3 ? (
              <MatchingTask onSolved={() => setSolved(true)} />
            ) : taskIndex === 4 ? (
              <PipelineTask onSolved={() => setSolved(true)} />
            ) : taskIndex === 5 ? (
              <SequenceTask onSolved={() => setSolved(true)} />
            ) : taskIndex === 6 ? (
              <ConceptTask onSolved={() => setSolved(true)} />
            ) : taskIndex === 7 ? (
              <CaseTask onSolved={() => setSolved(true)} />
            ) : (
              <InferenceTask onSolved={() => setSolved(true)} />
            )}

            {solved ? (
              <div className="mt-6 flex justify-end">
                <Button onClick={finishOrContinue}>
                  {taskIndex === CLOUD_TASKS.length - 1
                    ? "Finish drill"
                    : "Next task"}
                  <ArrowRight className="ml-2 size-4" aria-hidden />
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}

function ProgressRail({
  taskIndex,
  finished,
}: {
  taskIndex: number;
  finished: boolean;
}) {
  return (
    <ol
      className="mt-5 grid grid-cols-9 gap-1.5"
      aria-label="Cloud evidence drill progress"
    >
      {CLOUD_TASKS.map((task, index) => {
        const done = finished || index < taskIndex;
        const active = !finished && index === taskIndex;
        return (
          <li
            key={task.label}
            className={cn(
              "border-border flex min-h-8 items-center justify-center rounded-md border text-xs",
              active && "border-primary bg-primary/5 text-primary",
              done && "bg-muted text-foreground",
              !active && !done && "text-muted-foreground"
            )}
            aria-current={active ? "step" : undefined}
            title={task.label}
          >
            {done ? <Check className="size-3.5" aria-hidden /> : index + 1}
            <span className="sr-only">{task.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function TrueFalseTask({ onSolved }: SolveProps) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [verdict, setVerdict] = useState<Verdict>(null);
  const complete = CLOUD_TRUE_FALSE.every((item) => item.id in answers);

  function check() {
    const right = CLOUD_TRUE_FALSE.every(
      (item) => answers[item.id] === item.answer
    );
    setVerdict(right ? "correct" : "wrong");
    if (right) onSolved();
  }

  return (
    <div>
      <Prompt>
        Determine whether each statement is true or false. Mark all six.
      </Prompt>
      <div className="mt-5 space-y-3">
        {CLOUD_TRUE_FALSE.map((item, index) => (
          <div
            key={item.id}
            className="border-border bg-background rounded-lg border p-4"
          >
            <p className="leading-relaxed">
              <span className="text-muted-foreground mr-2">{index + 1}.</span>
              {item.claim}
            </p>
            <div
              className="mt-3 flex gap-2"
              role="group"
              aria-label={item.claim}
            >
              {[true, false].map((answer) => (
                <button
                  key={String(answer)}
                  type="button"
                  disabled={verdict === "correct"}
                  onClick={() => {
                    setAnswers((current) => ({
                      ...current,
                      [item.id]: answer,
                    }));
                    setVerdict(null);
                  }}
                  className={cn(
                    "border-border hover:border-foreground/35 min-w-20 rounded-md border px-3 py-2 transition-colors",
                    answers[item.id] === answer &&
                      "border-primary bg-primary/5 text-primary"
                  )}
                >
                  {answer ? "True" : "False"}
                </button>
              ))}
            </div>
            {verdict ? (
              <p
                className={cn(
                  "mt-3 text-sm leading-relaxed",
                  answers[item.id] === item.answer
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-destructive"
                )}
              >
                {item.explanation}
              </p>
            ) : null}
          </div>
        ))}
      </div>
      <CheckRow
        verdict={verdict}
        disabled={!complete}
        onCheck={check}
        wrong="At least one response is incorrect. Review the explanation shown under each statement and revise the marked rows."
        correct="Correct: 1 True; 2 False; 3 False; 4 False; 5 True; 6 True."
        sources={[
          CLOUD_SOURCES.heimRecords,
          CLOUD_SOURCES.heimVerification,
          CLOUD_SOURCES.kyc,
          CLOUD_SOURCES.randMetrics,
        ]}
      />
    </div>
  );
}

function OddOneOutTask({ onSolved }: SolveProps) {
  const [itemId, setItemId] = useState("");
  const [principleId, setPrincipleId] = useState("");
  const [verdict, setVerdict] = useState<Verdict>(null);

  function check() {
    const right = itemId === "owner" && principleId === "actor";
    setVerdict(right ? "correct" : "wrong");
    if (right) onSolved();
  }

  return (
    <div>
      <Prompt>
        One item differs from the other three in evidentiary type. Select it,
        then select the principle that explains the difference.
      </Prompt>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {CLOUD_ODD_ITEMS.map((item) => (
          <ChoiceButton
            key={item.id}
            selected={itemId === item.id}
            disabled={verdict === "correct"}
            onClick={() => {
              setItemId(item.id);
              setVerdict(null);
            }}
          >
            {item.text}
          </ChoiceButton>
        ))}
      </div>
      <p className="mt-6 font-medium">Select the principle.</p>
      <div className="mt-3 grid gap-2">
        {CLOUD_ODD_PRINCIPLES.map((item) => (
          <ChoiceButton
            key={item.id}
            selected={principleId === item.id}
            disabled={verdict === "correct"}
            onClick={() => {
              setPrincipleId(item.id);
              setVerdict(null);
            }}
          >
            {item.text}
          </ChoiceButton>
        ))}
      </div>
      <CheckRow
        verdict={verdict}
        disabled={!itemId || !principleId}
        onCheck={check}
        wrong="The item and the principle do not form the required classification. Both parts must be correct."
        correct="The beneficial-ownership record concerns who controls the account. The other three are technical metrics of account activity."
        sources={[CLOUD_SOURCES.randMetrics, CLOUD_SOURCES.kyc]}
      />
    </div>
  );
}

function AvailableDataTask({ onSolved }: SolveProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [verdict, setVerdict] = useState<Verdict>(null);

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setVerdict(null);
  }

  function check() {
    const right = CLOUD_AVAILABLE_DATA.every(
      (item) => selected.has(item.id) === item.answer
    );
    setVerdict(right ? "correct" : "wrong");
    if (right) onSolved();
  }

  return (
    <div>
      <Prompt>
        Select every category that the readings say a provider already collects,
        may already collect, or would obtain under the proposed KYC scheme.
        Assume no direct access to customer code or data.
      </Prompt>
      <div className="mt-5 grid gap-2">
        {CLOUD_AVAILABLE_DATA.map((item) => (
          <CheckButton
            key={item.id}
            checked={selected.has(item.id)}
            disabled={verdict === "correct"}
            onClick={() => toggle(item.id)}
          >
            {item.text}
          </CheckButton>
        ))}
      </div>
      <CheckRow
        verdict={verdict}
        disabled={selected.size === 0}
        onCheck={check}
        wrong="At least one selected category requires access not granted in the question, or one available category was omitted."
        correct="The first five categories are available under the stated conditions. Code, dataset contents, and actual intent are not."
        sources={[CLOUD_SOURCES.heimRecords, CLOUD_SOURCES.kyc]}
      />
    </div>
  );
}

function MatchingTask({ onSolved }: SolveProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [verdict, setVerdict] = useState<Verdict>(null);
  const complete = CLOUD_MATCH_ROWS.every((row) => answers[row.id]);

  function check() {
    const right = CLOUD_MATCH_ROWS.every(
      (row) => answers[row.id] === row.answerId
    );
    setVerdict(right ? "correct" : "wrong");
    if (right) onSolved();
  }

  return (
    <div>
      <Prompt>
        Match each item in the first column to the strongest conclusion it can
        support. Use each conclusion once.
      </Prompt>
      <div className="mt-5 space-y-3">
        {CLOUD_MATCH_ROWS.map((row) => (
          <label
            key={row.id}
            className="border-border bg-background block rounded-lg border p-4"
          >
            <span className="block leading-relaxed font-medium">
              {row.observable}
            </span>
            <select
              value={answers[row.id] ?? ""}
              disabled={verdict === "correct"}
              onChange={(event) => {
                setAnswers((current) => ({
                  ...current,
                  [row.id]: event.target.value,
                }));
                setVerdict(null);
              }}
              className="border-border bg-card mt-3 w-full rounded-md border px-3 py-2.5"
            >
              <option value="">Choose a conclusion</option>
              {CLOUD_MATCH_CONCLUSIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.text}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <CheckRow
        verdict={verdict}
        disabled={!complete}
        onCheck={check}
        wrong="At least one pair is incorrect. Distinguish identity, compute quantity, workload class, and a verified workload property."
        correct="Correct. The four evidence types support four different conclusions; none is interchangeable with another."
        sources={[
          CLOUD_SOURCES.heimRecords,
          CLOUD_SOURCES.heimVerification,
          CLOUD_SOURCES.kyc,
        ]}
      />
    </div>
  );
}

function PipelineTask({ onSolved }: SolveProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [verdict, setVerdict] = useState<Verdict>(null);
  const complete = CLOUD_PIPELINE_GAPS.every((gap) => answers[gap.id]);

  function check() {
    const right = CLOUD_PIPELINE_GAPS.every(
      (gap) => answers[gap.id] === gap.answer
    );
    setVerdict(right ? "correct" : "wrong");
    if (right) onSolved();
  }

  return (
    <div>
      <Prompt>
        Complete the five-stage scheme. Use five terms from the bank. Three
        terms are not used.
      </Prompt>
      <div className="border-border bg-background mt-5 rounded-lg border p-4 sm:p-5">
        <ol className="space-y-4">
          {CLOUD_PIPELINE_GAPS.map((gap, index) => (
            <li
              key={gap.id}
              className="grid gap-2 sm:grid-cols-[1fr_240px] sm:items-center"
            >
              <span>
                {index + 1}. {gap.before}
              </span>
              <select
                value={answers[gap.id] ?? ""}
                disabled={verdict === "correct"}
                onChange={(event) => {
                  setAnswers((current) => ({
                    ...current,
                    [gap.id]: event.target.value,
                  }));
                  setVerdict(null);
                }}
                className="border-border bg-card rounded-md border px-3 py-2.5"
              >
                <option value="">Choose a term</option>
                {CLOUD_PIPELINE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ol>
      </div>
      <CheckRow
        verdict={verdict}
        disabled={!complete}
        onCheck={check}
        wrong="At least one term is assigned to the wrong function."
        correct="Correct: KYC; record keeping; workload classification; compute accounting; reporting or escalation."
        sources={[
          CLOUD_SOURCES.heimRecords,
          CLOUD_SOURCES.heimVerification,
          CLOUD_SOURCES.kyc,
        ]}
      />
    </div>
  );
}

function SequenceTask({ onSolved }: SolveProps) {
  const [order, setOrder] = useState<string[]>([...CLOUD_SEQUENCE_START]);
  const [verdict, setVerdict] = useState<Verdict>(null);

  function move(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= order.length) return;
    setOrder((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });
    setVerdict(null);
  }

  function check() {
    const right = CLOUD_SEQUENCE.every(
      (item, index) => order[index] === item.id
    );
    setVerdict(right ? "correct" : "wrong");
    if (right) onSolved();
  }

  return (
    <div>
      <Prompt>
        A proposed scheme requires prospective KYC, a declared purpose,
        continuous usage records, and review of flags. Put its stages in order;
        the first row should be the earliest event.
      </Prompt>
      <ol className="mt-5 space-y-2">
        {order.map((id, index) => {
          const item = CLOUD_SEQUENCE.find((candidate) => candidate.id === id)!;
          return (
            <li
              key={id}
              className="border-border bg-background flex items-center gap-3 rounded-lg border p-3"
            >
              <span className="text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-full border">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 leading-relaxed">
                {item.text}
              </span>
              <span className="flex shrink-0 gap-1">
                <button
                  type="button"
                  disabled={index === 0 || verdict === "correct"}
                  onClick={() => move(index, -1)}
                  className="border-border hover:bg-muted disabled:text-muted-foreground rounded-md border p-2 disabled:opacity-40"
                  aria-label={`Move ${item.text} earlier`}
                >
                  <ArrowUp className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  disabled={index === order.length - 1 || verdict === "correct"}
                  onClick={() => move(index, 1)}
                  className="border-border hover:bg-muted disabled:text-muted-foreground rounded-md border p-2 disabled:opacity-40"
                  aria-label={`Move ${item.text} later`}
                >
                  <ArrowDown className="size-4" aria-hidden />
                </button>
              </span>
            </li>
          );
        })}
      </ol>
      <CheckRow
        verdict={verdict}
        disabled={false}
        onCheck={check}
        wrong="The order is incorrect under the scheme described in the question."
        correct="Correct. Request → KYC → declared purpose → usage records → flag → reporting or escalation."
        sources={[CLOUD_SOURCES.kyc, CLOUD_SOURCES.heimRecords]}
      />
    </div>
  );
}

function ConceptTask({ onSolved }: SolveProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [verdict, setVerdict] = useState<Verdict>(null);
  const complete = CLOUD_CONCEPT_ROWS.every((row) => answers[row.id]);

  function check() {
    const right = CLOUD_CONCEPT_ROWS.every(
      (row) => answers[row.id] === row.answer
    );
    setVerdict(right ? "correct" : "wrong");
    if (right) onSolved();
  }

  return (
    <div>
      <Prompt>
        Match each description to the correct mechanism. Use each mechanism
        once.
      </Prompt>
      <div className="mt-5 space-y-3">
        {CLOUD_CONCEPT_ROWS.map((row) => (
          <label
            key={row.id}
            className="border-border bg-background grid gap-3 rounded-lg border p-4 sm:grid-cols-[1fr_220px] sm:items-center"
          >
            <span className="leading-relaxed">{row.description}</span>
            <select
              value={answers[row.id] ?? ""}
              disabled={verdict === "correct"}
              onChange={(event) => {
                setAnswers((current) => ({
                  ...current,
                  [row.id]: event.target.value,
                }));
                setVerdict(null);
              }}
              className="border-border bg-card rounded-md border px-3 py-2.5"
            >
              <option value="">Choose a mechanism</option>
              {CLOUD_CONCEPTS.map((concept) => (
                <option key={concept} value={concept}>
                  {concept}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <CheckRow
        verdict={verdict}
        disabled={!complete}
        onCheck={check}
        wrong="At least one mechanism is incorrect. Distinguish identity verification, retained records, classification, and a verifiable claim."
        correct="Correct: KYC verifies identity; logging preserves records; classification estimates workload type; attestation presents a verifiable claim."
        sources={[CLOUD_SOURCES.heimRecords, CLOUD_SOURCES.heimVerification]}
      />
    </div>
  );
}

function CaseTask({ onSolved }: SolveProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [verdict, setVerdict] = useState<Verdict>(null);

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setVerdict(null);
  }

  function check() {
    const right = CLOUD_CASE_OPTIONS.every(
      (item) => selected.has(item.id) === item.answer
    );
    setVerdict(right ? "correct" : "wrong");
    if (right) onSolved();
  }

  return (
    <div>
      <Prompt>
        A provider verifies a customer company and its recorded beneficial
        owners. The customer declares a rendering workload. It then requests
        tens of thousands of accelerators and shows sustained accelerator
        utilization, communication patterns associated with parallelization, and
        limited traffic to external networks. Select every conclusion supported
        by these facts.
      </Prompt>
      <div className="mt-5 grid gap-2">
        {CLOUD_CASE_OPTIONS.map((item) => (
          <CheckButton
            key={item.id}
            checked={selected.has(item.id)}
            disabled={verdict === "correct"}
            onClick={() => toggle(item.id)}
          >
            {item.text}
          </CheckButton>
        ))}
      </div>
      <CheckRow
        verdict={verdict}
        disabled={selected.size === 0}
        onCheck={check}
        wrong="At least one conclusion exceeds the stated access, or one supported conclusion was omitted."
        correct="The KYC record links the account; the technical pattern supports a training classification and further review. It does not reveal intent, contents, or a violation."
        sources={[CLOUD_SOURCES.heimVerification, CLOUD_SOURCES.kyc]}
      />
    </div>
  );
}

function InferenceTask({ onSolved }: SolveProps) {
  const [answerId, setAnswerId] = useState("");
  const [verdict, setVerdict] = useState<Verdict>(null);

  function check() {
    const right = answerId === "investigate";
    setVerdict(right ? "correct" : "wrong");
    if (right) onSolved();
  }

  return (
    <div>
      <Prompt>
        Six accounts are registered to subsidiaries with the same verified
        beneficial owner. They run GPU sessions in sequence. Every session
        remains below a per-account FLOP threshold, but their aggregate compute
        exceeds it, and large data transfers precede the later sessions. Which
        response is justified?
      </Prompt>
      <div className="mt-5 grid gap-2">
        {CLOUD_INFERENCE_OPTIONS.map((option) => (
          <ChoiceButton
            key={option.id}
            selected={answerId === option.id}
            disabled={verdict === "correct"}
            onClick={() => {
              setAnswerId(option.id);
              setVerdict(null);
            }}
          >
            {option.text}
          </ChoiceButton>
        ))}
      </div>
      <CheckRow
        verdict={verdict}
        disabled={!answerId}
        onCheck={check}
        wrong="The selected response either ignores a documented detection gap or treats aggregate compute as proof of facts it cannot establish."
        correct="The pattern supports investigation. A finding still depends on the rule’s aggregation and coverage provisions and on evidence that the sessions form one training run."
        sources={[
          CLOUD_SOURCES.randMetrics,
          CLOUD_SOURCES.randClosing,
          CLOUD_SOURCES.kyc,
          CLOUD_SOURCES.carnegieScope,
        ]}
      />
    </div>
  );
}

function Prompt({ children }: { children: ReactNode }) {
  return (
    <p className="border-border bg-muted/35 rounded-lg border p-4 leading-relaxed">
      {children}
    </p>
  );
}

function ChoiceButton({
  selected,
  disabled,
  onClick,
  children,
}: {
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "border-border bg-background hover:border-foreground/35 flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left leading-relaxed transition-colors",
        selected && "border-primary bg-primary/5",
        disabled && !selected && "opacity-55"
      )}
    >
      <span
        className={cn(
          "border-border mt-0.5 size-5 shrink-0 rounded-full border",
          selected &&
            "border-primary bg-primary shadow-[inset_0_0_0_4px_var(--card)]"
        )}
        aria-hidden
      />
      <span>{children}</span>
    </button>
  );
}

function CheckButton({
  checked,
  disabled,
  onClick,
  children,
}: {
  checked: boolean;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "border-border bg-background hover:border-foreground/35 flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left leading-relaxed transition-colors",
        checked && "border-primary bg-primary/5",
        disabled && !checked && "opacity-55"
      )}
    >
      <span
        className={cn(
          "border-border mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border",
          checked && "border-primary bg-primary text-primary-foreground"
        )}
        aria-hidden
      >
        {checked ? <Check className="size-3.5" /> : null}
      </span>
      <span>{children}</span>
    </button>
  );
}

function CheckRow({
  verdict,
  disabled,
  onCheck,
  wrong,
  correct,
  sources,
}: {
  verdict: Verdict;
  disabled: boolean;
  onCheck: () => void;
  wrong: string;
  correct: string;
  sources: readonly CloudSource[];
}) {
  return (
    <div className="mt-5">
      {verdict ? (
        <div
          className={cn(
            "rounded-lg border p-4",
            verdict === "correct"
              ? "border-emerald-600/30 bg-emerald-500/6"
              : "border-destructive/35 bg-destructive/5"
          )}
        >
          <div className="flex gap-3">
            {verdict === "correct" ? (
              <CheckCircle2
                className="mt-0.5 size-5 shrink-0 text-emerald-600"
                aria-hidden
              />
            ) : null}
            <div>
              <p
                className={
                  verdict === "correct"
                    ? "font-medium"
                    : "text-destructive font-medium"
                }
              >
                {verdict === "correct" ? "Supported" : "Revise the answer"}
              </p>
              <p className="text-muted-foreground mt-1 leading-relaxed">
                {verdict === "correct" ? correct : wrong}
              </p>
              {verdict === "correct" ? (
                <ul className="mt-2 space-y-1">
                  {sources.map((source) => (
                    <li key={source.label}>
                      <a
                        href={source.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary inline-flex items-start gap-1 text-xs font-medium underline-offset-4 hover:underline"
                      >
                        <span>{source.label}</span>
                        <ExternalLink
                          className="mt-0.5 size-3 shrink-0"
                          aria-hidden
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
      {verdict !== "correct" ? (
        <div className="mt-4 flex justify-end">
          <Button onClick={onCheck} disabled={disabled}>
            Check answer
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function Finish({ onRestart }: { onRestart: () => void }) {
  return (
    <section className="p-6 sm:p-8">
      <div className="mx-auto max-w-2xl text-center">
        <CheckCircle2 className="mx-auto size-9 text-emerald-600" aria-hidden />
        <h4 className="mt-4 text-2xl font-semibold">Problem set complete</h4>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          Provider-held records can associate an account with a verified
          identity record, estimate resource use, and support a workload
          classification. They do not by themselves establish intent, model
          contents, capability, or a legal violation.
        </p>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          The final policy question remains: which actors and workloads should
          be covered, at what cost, and across which jurisdictions?
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a
            href={CLOUD_SOURCES.carnegieScope.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border-border hover:bg-muted inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium"
          >
            Policy scope reading
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
          <Button variant="outline" onClick={onRestart}>
            <RotateCcw className="mr-2 size-4" aria-hidden />
            Run again
          </Button>
        </div>
      </div>
    </section>
  );
}
