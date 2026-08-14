"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  CheckCircle2,
  ExternalLink,
  GripVertical,
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
  CLOUD_PIPELINE_GAPS,
  CLOUD_PIPELINE_OPTIONS,
  CLOUD_SEQUENCE,
  CLOUD_SEQUENCE_START,
  CLOUD_SOURCES,
  CLOUD_TASKS,
  CLOUD_TRUE_FALSE,
  type CloudSource,
} from "@/lib/verification/data/cloud-evidence-drill";
import { explainsOddCloudObservable } from "@/lib/verification/engines/cloud-evidence-drill";
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
  const [solvedTasks, setSolvedTasks] = useState<Set<number>>(() => new Set());
  const [finished, setFinished] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const completedOnce = useRef(initialCompleted);
  const taskTopRef = useRef<HTMLElement>(null);
  const task = CLOUD_TASKS[taskIndex];
  const allSolved = solvedTasks.size === CLOUD_TASKS.length;

  function markSolved(index: number) {
    setSolvedTasks((current) => {
      if (current.has(index)) return current;
      const next = new Set(current);
      next.add(index);
      return next;
    });
  }

  function showTask(index: number) {
    if (index < 0 || index >= CLOUD_TASKS.length) return;
    setTaskIndex(index);
    setFinished(false);
    requestAnimationFrame(() => {
      taskTopRef.current?.scrollIntoView({ block: "start" });
    });
  }

  function finish() {
    if (!allSolved) return;
    setFinished(true);
    if (!completedOnce.current) {
      completedOnce.current = true;
      onComplete();
    }
  }

  function restart() {
    setTaskIndex(0);
    setSolvedTasks(new Set());
    setFinished(false);
    setAttempt((current) => current + 1);
  }

  return (
    <section className="not-prose border-border bg-card shadow-soft my-6 overflow-hidden rounded-xl border text-sm">
      <header className="border-border border-b p-5 sm:p-6">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          30 minutes
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">
          Cloud verification problem set
        </h3>
        <p className="text-muted-foreground mt-2 max-w-3xl leading-relaxed">
          Answer from the assigned readings. Treat every qualifier as part of
          the question. Select only conclusions supported by the stated access
          and evidence.
        </p>
        <ProgressRail
          taskIndex={taskIndex}
          solvedTasks={solvedTasks}
          finished={finished}
          onSelect={showTask}
        />
      </header>

      <div hidden={!finished}>
        <Finish onRestart={restart} />
      </div>

      <div hidden={finished}>
        <div>
          <section
            ref={taskTopRef}
            className="border-border scroll-mt-24 border-b px-5 py-3"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Task {taskIndex + 1} of {CLOUD_TASKS.length} · {task.time}
              </p>
              <h4 className="text-base font-semibold">{task.title}</h4>
              <p className="text-muted-foreground ml-auto text-xs">
                {task.label}
              </p>
            </div>
          </section>

          <div key={attempt} className="px-5 py-3">
            <div hidden={taskIndex !== 0}>
              <TrueFalseTask onSolved={() => markSolved(0)} />
            </div>
            <div hidden={taskIndex !== 1}>
              <OddOneOutTask onSolved={() => markSolved(1)} />
            </div>
            <div hidden={taskIndex !== 2}>
              <AvailableDataTask onSolved={() => markSolved(2)} />
            </div>
            <div hidden={taskIndex !== 3}>
              <MatchingTask onSolved={() => markSolved(3)} />
            </div>
            <div hidden={taskIndex !== 4}>
              <PipelineTask onSolved={() => markSolved(4)} />
            </div>
            <div hidden={taskIndex !== 5}>
              <SequenceTask onSolved={() => markSolved(5)} />
            </div>
            <div hidden={taskIndex !== 6}>
              <ConceptTask onSolved={() => markSolved(6)} />
            </div>
            <div hidden={taskIndex !== 7}>
              <CaseTask onSolved={() => markSolved(7)} />
            </div>
            <div hidden={taskIndex !== 8}>
              <InferenceTask onSolved={() => markSolved(8)} />
            </div>

            <nav
              className="border-border mt-1.5 flex items-center justify-between gap-3 border-t pt-1.5"
              aria-label="Move between cloud problem-set tasks"
            >
              <Button
                variant="outline"
                disabled={taskIndex === 0}
                onClick={() => showTask(taskIndex - 1)}
              >
                <ArrowLeft className="mr-2 size-4" aria-hidden />
                Previous
              </Button>
              <span className="text-muted-foreground hidden text-xs sm:block">
                {solvedTasks.size} of {CLOUD_TASKS.length} complete
              </span>
              {taskIndex < CLOUD_TASKS.length - 1 ? (
                <Button onClick={() => showTask(taskIndex + 1)}>
                  Next
                  <ArrowRight className="ml-2 size-4" aria-hidden />
                </Button>
              ) : (
                <Button onClick={finish} disabled={!allSolved}>
                  Finish problem set
                </Button>
              )}
            </nav>
            {taskIndex === CLOUD_TASKS.length - 1 && !allSolved ? (
              <p className="text-muted-foreground mt-3 text-right text-xs">
                Complete all nine tasks before finishing. Use the numbered
                navigation above to return to any unfinished task.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgressRail({
  taskIndex,
  solvedTasks,
  finished,
  onSelect,
}: {
  taskIndex: number;
  solvedTasks: ReadonlySet<number>;
  finished: boolean;
  onSelect: (index: number) => void;
}) {
  return (
    <ol
      className="mt-5 grid grid-cols-9 gap-1.5"
      aria-label="Cloud evidence drill progress"
    >
      {CLOUD_TASKS.map((task, index) => {
        const done = finished || solvedTasks.has(index);
        const active = !finished && index === taskIndex;
        return (
          <li key={task.label}>
            <button
              type="button"
              onClick={() => onSelect(index)}
              className={cn(
                "border-border focus-visible:ring-ring flex min-h-9 w-full items-center justify-center rounded-md border text-xs transition-colors hover:border-foreground/35 hover:bg-muted/45 focus-visible:ring-2 focus-visible:outline-none",
                active && "border-primary bg-primary/5 text-primary",
                done && !active && "bg-muted text-foreground",
                !active && !done && "text-muted-foreground"
              )}
              aria-current={active ? "step" : undefined}
              aria-label={`Task ${index + 1}: ${task.label}${
                done ? ", complete" : ""
              }`}
              title={`${index + 1}. ${task.label}`}
            >
              {done ? <Check className="size-3.5" aria-hidden /> : index + 1}
            </button>
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
      {verdict === "correct" ? (
        <p className="border-emerald-600/30 bg-emerald-500/6 mt-3 rounded-lg border px-3 py-2.5 font-medium">
          All six statements are marked correctly. The full explanations remain
          available below.
        </p>
      ) : (
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {CLOUD_TRUE_FALSE.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "border-border bg-background rounded-lg border p-2.5",
                verdict &&
                  (answers[item.id] === item.answer
                    ? "border-emerald-600/35"
                    : "border-destructive/40")
              )}
            >
              <p className="leading-snug">
                <span className="text-muted-foreground mr-2">{index + 1}.</span>
                {item.claim}
              </p>
              <fieldset className="mt-1.5 flex items-center gap-2">
                <legend className="sr-only">{item.claim}</legend>
                {[true, false].map((answer) => (
                  <label
                    key={String(answer)}
                    className={cn(
                      "border-border hover:border-foreground/35 focus-within:ring-ring relative flex min-h-8 min-w-14 cursor-pointer items-center justify-center rounded-md border px-2 py-1 text-center text-sm transition-colors focus-within:ring-2 focus-within:outline-none",
                      answers[item.id] === answer &&
                        "border-primary bg-primary/5 text-primary"
                    )}
                  >
                    <input
                      type="radio"
                      name={`cloud-true-false-${item.id}`}
                      value={String(answer)}
                      checked={answers[item.id] === answer}
                      onChange={() => {
                        setAnswers((current) => ({
                          ...current,
                          [item.id]: answer,
                        }));
                        setVerdict(null);
                      }}
                      className="sr-only"
                    />
                    {answer ? "True" : "False"}
                  </label>
                ))}
              </fieldset>
            </div>
          ))}
        </div>
      )}
      <CheckRow
        verdict={verdict}
        disabled={!complete}
        onCheck={check}
        wrong="At least one marked row is incorrect. Revisit the red-bordered rows."
        correct="Correct: 1 True; 2 False; 3 False; 4 False; 5 True; 6 True."
        sources={[
          CLOUD_SOURCES.heimRecords,
          CLOUD_SOURCES.heimVerification,
          CLOUD_SOURCES.kyc,
          CLOUD_SOURCES.randMetrics,
        ]}
      />
      {verdict === "correct" ? (
        <details className="border-border mt-3 rounded-lg border px-3 py-2.5">
          <summary className="cursor-pointer font-medium">
            Review the six explanations
          </summary>
          <ol className="mt-3 grid gap-3 md:grid-cols-2">
            {CLOUD_TRUE_FALSE.map((item, index) => (
              <li
                key={item.id}
                className="text-muted-foreground leading-relaxed"
              >
                <span className="text-foreground mr-1 font-medium">
                  {index + 1}.
                </span>
                {item.explanation}
              </li>
            ))}
          </ol>
        </details>
      ) : null}
    </div>
  );
}

function OddOneOutTask({ onSolved }: SolveProps) {
  const [itemId, setItemId] = useState("");
  const [principle, setPrinciple] = useState("");
  const [verdict, setVerdict] = useState<Verdict>(null);

  function check() {
    const right = itemId === "owner" && explainsOddCloudObservable(principle);
    setVerdict(right ? "correct" : "wrong");
    if (right) onSolved();
  }

  return (
    <div>
      <Prompt>
        One item differs from the other three in evidentiary type. Select it,
        then state the principle that explains the difference.
      </Prompt>
      <fieldset className="mt-5">
        <legend className="sr-only">Select the odd item</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {CLOUD_ODD_ITEMS.map((item) => (
            <RadioChoice
              key={item.id}
              name="cloud-odd-item"
              value={item.id}
              selected={itemId === item.id}
              disabled={verdict === "correct"}
              onChange={() => {
                setItemId(item.id);
                setVerdict(null);
              }}
            >
              {item.text}
            </RadioChoice>
          ))}
        </div>
      </fieldset>
      <label htmlFor="cloud-odd-principle" className="mt-4 block font-medium">
        In one sentence, state what the odd item records and what the other
        three measure.
      </label>
      <textarea
        id="cloud-odd-principle"
        value={principle}
        disabled={verdict === "correct"}
        onChange={(event) => {
          setPrinciple(event.target.value);
          setVerdict(null);
        }}
        rows={2}
        className="border-border bg-background focus-visible:ring-ring mt-2 w-full resize-y rounded-lg border px-3 py-2.5 leading-relaxed focus-visible:ring-2 focus-visible:outline-none"
      />
      <CheckRow
        verdict={verdict}
        disabled={!itemId || principle.trim().length < 28}
        onCheck={check}
        wrong="Both parts are required. Identify the item, then distinguish the kind of evidence it records from the kind measured by the other three."
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
        A provider has implemented the proposed KYC scheme and retains its
        ordinary billing and operational records. It has no direct access to
        customer code or data. Select every category available under those
        conditions.
      </Prompt>
      {verdict === "correct" ? (
        <details className="border-border mt-3 rounded-lg border px-3 py-2.5">
          <summary className="cursor-pointer font-medium">
            Review the eight categories
          </summary>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {CLOUD_AVAILABLE_DATA.map((item) => (
              <li key={item.id} className="leading-relaxed">
                <span className="text-muted-foreground mr-1">
                  {item.answer ? "Available:" : "Not available:"}
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </details>
      ) : (
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {CLOUD_AVAILABLE_DATA.map((item) => (
            <CheckButton
              key={item.id}
              checked={selected.has(item.id)}
              disabled={false}
              onClick={() => toggle(item.id)}
            >
              {item.text}
            </CheckButton>
          ))}
        </div>
      )}
      <CheckRow
        verdict={verdict}
        disabled={selected.size === 0}
        onCheck={check}
        wrong="A selected category exceeds the stated access, or an available category is missing."
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
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {CLOUD_MATCH_ROWS.map((row) => (
          <label
            key={row.id}
            className="border-border bg-background block rounded-lg border p-3"
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
              className="border-border bg-card mt-2 w-full rounded-md border px-3 py-2"
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
        Complete the verification map by matching each function to its
        mechanism. Use five terms from the bank. Three terms are not used.
      </Prompt>
      <div className="border-border bg-background mt-3 rounded-lg border p-3 sm:p-4">
        <div className="space-y-2.5">
          {CLOUD_PIPELINE_GAPS.map((gap) => (
            <label
              key={gap.id}
              className="grid gap-2 sm:grid-cols-[1fr_240px] sm:items-center"
            >
              <span>{gap.before}</span>
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
                className="border-border bg-card rounded-md border px-3 py-2"
              >
                <option value="">Choose a term</option>
                {CLOUD_PIPELINE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const labelFor = (id: string | number) =>
    CLOUD_SEQUENCE.find((item) => item.id === String(id))?.text ?? String(id);

  const positionFor = (id: string | number) => order.indexOf(String(id)) + 1;

  function move(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= order.length) return;
    setOrder((current) => arrayMove(current, index, target));
    setVerdict(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    setOrder((current) => {
      const from = current.indexOf(String(active.id));
      const to = current.indexOf(String(over.id));
      return from < 0 || to < 0 ? current : arrayMove(current, from, to);
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
        Put the six stages of the Egan–Heim scheme in order. Drag a row or use
        its arrow buttons; the earliest event goes first.
      </Prompt>
      {verdict === "correct" ? (
        <ol
          className="mt-3 grid gap-2 md:grid-cols-2"
          aria-label="Correct order of stages"
        >
          {order.map((id, index) => (
            <li
              key={id}
              className="border-border bg-background flex items-center gap-2 rounded-lg border px-3 py-2 leading-snug"
            >
              <span className="text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-full border text-xs">
                {index + 1}
              </span>
              {labelFor(id)}
            </li>
          ))}
        </ol>
      ) : (
        <DndContext
          id="cloud-evidence-sequence"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={({ active }) => {
            setActiveId(String(active.id));
            setVerdict(null);
          }}
          onDragCancel={() => setActiveId(null)}
          onDragEnd={handleDragEnd}
          accessibility={{
            screenReaderInstructions: {
              draggable:
                "To move a stage, press Space or Enter. Use the up and down arrow keys to choose a position. Press Space or Enter again to drop it, or Escape to cancel.",
            },
            announcements: {
              onDragStart: ({ active }) =>
                `Picked up ${labelFor(active.id)}, position ${positionFor(
                  active.id
                )} of ${order.length}.`,
              onDragOver: ({ active, over }) =>
                over
                  ? `${labelFor(active.id)} is over position ${positionFor(
                      over.id
                    )} of ${order.length}.`
                  : `${labelFor(active.id)} is no longer over the list.`,
              onDragEnd: ({ active, over }) =>
                over
                  ? `Dropped ${labelFor(active.id)} at position ${positionFor(
                      over.id
                    )} of ${order.length}.`
                  : `Movement cancelled. ${labelFor(
                      active.id
                    )} returned to position ${positionFor(active.id)}.`,
              onDragCancel: ({ active }) =>
                `Movement cancelled. ${labelFor(
                  active.id
                )} returned to position ${positionFor(active.id)}.`,
            },
          }}
        >
          <SortableContext items={order} strategy={verticalListSortingStrategy}>
            <ol
              className="mt-3 space-y-1.5"
              aria-label="Stages to put in order"
            >
              {order.map((id, index) => {
                const item = CLOUD_SEQUENCE.find(
                  (candidate) => candidate.id === id
                )!;
                return (
                  <SortableSequenceItem
                    key={id}
                    id={id}
                    text={item.text}
                    index={index}
                    count={order.length}
                    disabled={false}
                    onMove={move}
                  />
                );
              })}
            </ol>
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <SequenceDragPreview
                text={labelFor(activeId)}
                position={positionFor(activeId)}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
      <CheckRow
        verdict={verdict}
        disabled={false}
        onCheck={check}
        wrong="The order is incorrect under the scheme described in the question."
        correct="Correct. Monitor accumulation → approaching threshold → KYC and intended use → continued monitoring → reporting or required controls."
        sources={[CLOUD_SOURCES.kyc, CLOUD_SOURCES.heimRecords]}
      />
    </div>
  );
}

function SortableSequenceItem({
  id,
  text,
  index,
  count,
  disabled,
  onMove,
}: {
  id: string;
  text: string;
  index: number;
  count: number;
  disabled: boolean;
  onMove: (index: number, delta: -1 | 1) => void;
}) {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "border-border bg-background group flex min-h-11 items-center gap-2 rounded-lg border p-1 transition-[border-color,background-color,box-shadow,opacity]",
        !disabled && "hover:bg-muted/35",
        isDragging && "border-primary/45 opacity-30"
      )}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        disabled={disabled}
        {...attributes}
        {...listeners}
        aria-label={`Move ${text}. Current position ${index + 1} of ${count}.`}
        className="border-border text-muted-foreground hover:border-foreground/35 hover:bg-muted focus-visible:ring-ring flex size-9 shrink-0 touch-none cursor-grab items-center justify-center rounded-md border focus-visible:ring-2 focus-visible:outline-none active:cursor-grabbing disabled:cursor-default disabled:opacity-45"
      >
        <GripVertical className="size-5" aria-hidden />
      </button>
      <span className="text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-full border">
        {index + 1}
      </span>
      <span className="min-w-0 flex-1 leading-relaxed">{text}</span>
      <span className="flex shrink-0 gap-1">
        <button
          type="button"
          disabled={index === 0 || disabled}
          onClick={() => onMove(index, -1)}
          className="border-border hover:bg-muted focus-visible:ring-ring disabled:text-muted-foreground flex size-9 items-center justify-center rounded-md border focus-visible:ring-2 focus-visible:outline-none disabled:opacity-40"
          aria-label={`Move ${text} earlier`}
        >
          <ArrowUp className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          disabled={index === count - 1 || disabled}
          onClick={() => onMove(index, 1)}
          className="border-border hover:bg-muted focus-visible:ring-ring disabled:text-muted-foreground flex size-9 items-center justify-center rounded-md border focus-visible:ring-2 focus-visible:outline-none disabled:opacity-40"
          aria-label={`Move ${text} later`}
        >
          <ArrowDown className="size-4" aria-hidden />
        </button>
      </span>
    </li>
  );
}

function SequenceDragPreview({
  text,
  position,
}: {
  text: string;
  position: number;
}) {
  return (
    <div className="border-primary/55 bg-card flex max-w-[min(760px,calc(100vw-32px))] items-center gap-2 rounded-lg border p-2 shadow-xl">
      <span className="text-primary flex size-11 shrink-0 items-center justify-center">
        <GripVertical className="size-5" aria-hidden />
      </span>
      <span className="text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-full border">
        {position}
      </span>
      <span className="min-w-0 flex-1 leading-relaxed font-medium">{text}</span>
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
      {verdict === "correct" ? (
        <details className="border-border mt-3 rounded-lg border px-3 py-2.5">
          <summary className="cursor-pointer font-medium">
            Review the four matches
          </summary>
          <dl className="mt-3 grid gap-3 md:grid-cols-2">
            {CLOUD_CONCEPT_ROWS.map((row) => (
              <div key={row.id}>
                <dt className="font-medium">{row.answer}</dt>
                <dd className="text-muted-foreground mt-1 leading-relaxed">
                  {row.description}
                </dd>
              </div>
            ))}
          </dl>
        </details>
      ) : (
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {CLOUD_CONCEPT_ROWS.map((row) => (
            <label
              key={row.id}
              className="border-border bg-background grid gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_190px] sm:items-center"
            >
              <span className="leading-relaxed">{row.description}</span>
              <select
                value={answers[row.id] ?? ""}
                onChange={(event) => {
                  setAnswers((current) => ({
                    ...current,
                    [row.id]: event.target.value,
                  }));
                  setVerdict(null);
                }}
                className="border-border bg-card rounded-md border px-3 py-2"
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
      )}
      <CheckRow
        verdict={verdict}
        disabled={!complete}
        onCheck={check}
        wrong="At least one mechanism is incorrect. Distinguish identity verification, retained records, classification, and a verifiable claim."
        correct="Correct: KYC verifies identity; record keeping preserves service-use records; classification estimates workload type; attestation presents a verifiable claim."
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
      <div className="mt-3 grid gap-2 md:grid-cols-2">
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
      <fieldset className="mt-5">
        <legend className="sr-only">Select the justified response</legend>
        <div className="grid gap-2 md:grid-cols-2">
          {CLOUD_INFERENCE_OPTIONS.map((option) => (
            <RadioChoice
              key={option.id}
              name="cloud-permissible-inference"
              value={option.id}
              selected={answerId === option.id}
              disabled={verdict === "correct"}
              onChange={() => {
                setAnswerId(option.id);
                setVerdict(null);
              }}
            >
              {option.text}
            </RadioChoice>
          ))}
        </div>
      </fieldset>
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
    <p className="border-border bg-muted/35 rounded-lg border px-3 py-2 leading-relaxed">
      {children}
    </p>
  );
}

function RadioChoice({
  name,
  value,
  selected,
  disabled,
  onChange,
  children,
}: {
  name: string;
  value: string;
  selected: boolean;
  disabled: boolean;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <label
      className={cn(
        "border-border bg-background hover:border-foreground/35 focus-within:ring-ring relative flex w-full cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 text-left leading-relaxed transition-colors focus-within:ring-2 focus-within:outline-none",
        selected && "border-primary bg-primary/5",
        disabled && "cursor-default",
        disabled && !selected && "opacity-55"
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        disabled={disabled}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={cn(
          "border-border mt-0.5 size-5 shrink-0 rounded-full border",
          selected &&
            "border-primary bg-primary shadow-[inset_0_0_0_4px_var(--card)]"
        )}
        aria-hidden
      />
      <span>{children}</span>
    </label>
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
        "border-border bg-background hover:border-foreground/35 flex w-full items-start gap-3 rounded-lg border px-3 py-2 text-left leading-relaxed transition-colors",
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
    <div className="mt-2">
      {verdict === "correct" ? (
        <div
          role="status"
          aria-live="polite"
          className="border-emerald-600/30 bg-emerald-500/6 rounded-lg border px-3 py-2.5"
        >
          <div className="flex gap-3">
            <CheckCircle2
              className="mt-0.5 size-5 shrink-0 text-emerald-600"
              aria-hidden
            />
            <div>
              <p className="font-medium">Supported</p>
              <p className="text-muted-foreground mt-1 leading-relaxed">
                {correct}
              </p>
              <details className="mt-1.5 text-xs">
                <summary className="text-primary cursor-pointer font-medium">
                  Sources ({sources.length})
                </summary>
                <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                  {sources.map((source) => (
                    <li key={source.label}>
                      <a
                        href={source.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary inline-flex items-start gap-1 font-medium underline-offset-4 hover:underline"
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
              </details>
            </div>
          </div>
        </div>
      ) : verdict === "wrong" ? (
        <div
          role="status"
          aria-live="polite"
          className="border-destructive/35 bg-destructive/5 flex items-start justify-between gap-3 rounded-lg border px-3 py-2"
        >
          <p className="text-destructive min-w-0 leading-snug">{wrong}</p>
          <details className="shrink-0 text-xs">
            <summary className="text-primary cursor-pointer font-medium">
              Sources ({sources.length})
            </summary>
            <ul className="mt-1.5 space-y-1">
              {sources.map((source) => (
                <li key={source.label}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary inline-flex items-start gap-1 font-medium underline-offset-4 hover:underline"
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
          </details>
        </div>
      ) : (
        <div className="flex justify-end">
          <Button onClick={onCheck} disabled={disabled}>
            Check answer
          </Button>
        </div>
      )}
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
