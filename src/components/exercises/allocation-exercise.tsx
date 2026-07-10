"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { saveAllocationScenario } from "@/app/actions/exercises";
import {
  ALLOCATION_DEFAULT_STEP,
  EXERCISE_TYPE_LABELS,
  type AllocationExercise,
} from "@/lib/content/types";
import {
  ALLOCATION_MAX_REASONING_CHARS,
  isStorableText,
  type AllocationScenarioEntry,
} from "@/lib/content/exercise-view";
import { Paragraphs } from "./math-text";

/** Cycled per agenda: summary bars, legend swatches in the table. */
const AGENDA_COLORS = [
  "var(--chart-4)",
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-5)",
];

const agendaColor = (index: number) => AGENDA_COLORS[index % AGENDA_COLORS.length];

// Values are step-multiples accumulated by ± clicks; rounding to 3 decimals
// absorbs float drift for any sensible step without misrendering e.g. 0.25.
const formatPeople = (value: number) => String(Math.round(value * 1000) / 1000);

function Stepper({
  label,
  value,
  max,
  step,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  step: number;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  const buttonClass =
    "text-foreground hover:enabled:bg-muted disabled:text-muted-foreground/40 h-8 w-8 text-base leading-none";
  return (
    <span
      role="group"
      aria-label={label}
      className="border-border bg-background inline-flex items-stretch overflow-hidden rounded-md border"
    >
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        disabled={disabled || value <= 0}
        onClick={() => onChange(Math.max(0, value - step))}
        className={buttonClass}
      >
        −
      </button>
      <span
        aria-live="polite"
        className="border-border text-foreground flex min-w-11 items-center justify-center border-x font-mono text-sm font-semibold tabular-nums"
      >
        {formatPeople(value)}
      </span>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + step))}
        className={buttonClass}
      >
        +
      </button>
    </span>
  );
}

/**
 * The full allocation flow in one card: an intro (title, prompt, agendas),
 * one step per scenario (steppers + total counter + reasoning, gated before
 * advancing), and a summary (table, stacked bars, copyable JSON). Scenarios
 * persist via `saveAllocationScenario` as they're completed — a no-op for
 * signed-out visitors, who can still work through the exercise.
 */
export function AllocationExerciseCard({
  exercise,
  initialScenarios,
  initialCompletedAt,
  persist = false,
}: {
  exercise: AllocationExercise;
  initialScenarios?: Record<string, AllocationScenarioEntry>;
  /** When the learner previously submitted every scenario (ISO timestamp). */
  initialCompletedAt?: string;
  /** Signed-in only — signed-out visitors skip the (no-op) server round-trip. */
  persist?: boolean;
}) {
  const step = exercise.step ?? ALLOCATION_DEFAULT_STEP;
  const minChars = exercise.minReasoningChars ?? 0;
  const scenarioCount = exercise.scenarios.length;
  const hasFullSubmission = exercise.scenarios.every(
    (s) => initialScenarios?.[s.id],
  );

  // "intro" | "summary" | index of the scenario being edited.
  const [view, setView] = useState<"intro" | "summary" | number>("intro");
  const [allocations, setAllocations] = useState<number[][]>(() =>
    exercise.scenarios.map((s) =>
      exercise.agendas.map(
        (a) => initialScenarios?.[s.id]?.allocation?.[a.id] ?? 0,
      ),
    ),
  );
  const [reasonings, setReasonings] = useState<string[]>(() =>
    exercise.scenarios.map((s) => initialScenarios?.[s.id]?.reasoning ?? ""),
  );
  // Advancing into a not-yet-visited scenario copies the previous allocation
  // as its starting point (so the "was N" ghosts start at ±0).
  const [visited, setVisited] = useState<boolean[]>(() =>
    exercise.scenarios.map(
      (s, i) => i === 0 || Boolean(initialScenarios?.[s.id]),
    ),
  );
  const [completedAt, setCompletedAt] = useState<string | null>(
    initialCompletedAt ?? null,
  );
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  const setValue = (scenarioIndex: number, agendaIndex: number, value: number) =>
    setAllocations((prev) =>
      prev.map((row, i) =>
        i === scenarioIndex
          ? row.map((v, j) => (j === agendaIndex ? value : v))
          : row,
      ),
    );

  const allocationRecord = (scenarioIndex: number) =>
    Object.fromEntries(
      exercise.agendas.map((a, j) => [a.id, allocations[scenarioIndex][j]]),
    );

  const goNext = (index: number) =>
    startTransition(async () => {
      if (persist) {
        await saveAllocationScenario(
          exercise.id,
          exercise.scenarios[index].id,
          allocationRecord(index),
          reasonings[index],
        );
      }
      if (index === scenarioCount - 1) {
        setCompletedAt(new Date().toISOString());
        setView("summary");
        return;
      }
      setAllocations((prev) =>
        visited[index + 1]
          ? prev
          : prev.map((row, i) => (i === index + 1 ? [...prev[index]] : row)),
      );
      setVisited((prev) => prev.map((v, i) => (i === index + 1 ? true : v)));
      setView(index + 1);
    });

  const copyResults = async () => {
    const results = {
      exercise: exercise.id,
      completedAt,
      scenarios: exercise.scenarios.map((s, i) => ({
        id: s.id,
        title: s.title,
        allocation: allocationRecord(i),
        reasoning: reasonings[i],
      })),
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(results, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable (permissions/insecure context) — leave the
      // button label unchanged rather than claiming a copy happened.
    }
  };

  // Back-navigation can leave a scenario mid-edit; only offer the summary
  // while every scenario still holds a complete, valid state.
  const allScenariosValid = exercise.scenarios.every((s, i) => {
    const total = allocations[i].reduce((sum, v) => sum + v, 0);
    return (
      Math.abs(total - exercise.totalPeople) < 1e-9 &&
      reasonings[i].trim().length >= minChars
    );
  });

  let body: React.ReactNode;
  if (view === "intro") {
    body = (
      <>
        <h3 className="text-lg font-semibold tracking-tight">{exercise.title}</h3>
        <Paragraphs text={exercise.prompt} className="mt-2 text-sm" />
        <p className="text-muted-foreground mt-4 mb-1.5 text-xs font-medium tracking-wide uppercase">
          Agendas
        </p>
        <ul className="border-border divide-border divide-y rounded-lg border">
          {exercise.agendas.map((agenda) => (
            <li key={agenda.id} className="px-3 py-2 text-sm">
              {agenda.label}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <Button size="sm" onClick={() => setView(0)}>
            Begin
          </Button>
          {(hasFullSubmission || completedAt != null) && allScenariosValid && (
            <Button size="sm" variant="outline" onClick={() => setView("summary")}>
              View summary
            </Button>
          )}
        </div>
      </>
    );
  } else if (view === "summary") {
    body = (
      <>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border border-b">
                <th className="text-muted-foreground py-2 pr-2 text-left text-xs font-medium tracking-wide uppercase">
                  Agenda
                </th>
                {exercise.scenarios.map((s, i) => (
                  <th
                    key={s.id}
                    className="text-muted-foreground px-2 py-2 text-right text-xs font-medium tracking-wide uppercase"
                  >
                    Scenario {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {exercise.agendas.map((agenda, j) => (
                <tr key={agenda.id} className="border-border border-b last:border-b-0">
                  <td className="py-2 pr-2">
                    <span
                      aria-hidden
                      className="mr-2 inline-block size-2.5 rounded-[3px] align-baseline"
                      style={{ background: agendaColor(j) }}
                    />
                    {agenda.label}
                  </td>
                  {exercise.scenarios.map((s, i) => (
                    <td
                      key={s.id}
                      className="px-2 py-2 text-right font-mono tabular-nums"
                    >
                      {formatPeople(allocations[i][j])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 space-y-1.5">
          {exercise.scenarios.map((scenario, i) => (
            <div key={scenario.id} className="flex items-center gap-3">
              <span className="text-muted-foreground w-20 shrink-0 font-mono text-xs">
                Scenario {i + 1}
              </span>
              <div className="border-border flex h-3 flex-1 overflow-hidden rounded-sm border">
                {exercise.agendas.map((agenda, j) =>
                  allocations[i][j] > 0 ? (
                    <span
                      key={agenda.id}
                      title={`${agenda.label}: ${formatPeople(allocations[i][j])}`}
                      style={{
                        width: `${(allocations[i][j] / exercise.totalPeople) * 100}%`,
                        background: agendaColor(j),
                      }}
                    />
                  ) : null,
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted mt-5 rounded-lg p-4">
          <p className="text-sm font-medium">Scoring</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Automated feedback on your reasoning is coming soon.
          </p>
          <Button size="sm" variant="outline" disabled className="mt-3">
            Submit for scoring
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setView(scenarioCount - 1)}
          >
            Back
          </Button>
          <Button size="sm" variant="outline" onClick={copyResults}>
            {copied ? "Copied ✓" : "Copy results (JSON)"}
          </Button>
        </div>
      </>
    );
  } else {
    const index = view;
    const scenario = exercise.scenarios[index];
    const row = allocations[index];
    const total = row.reduce((sum, v) => sum + v, 0);
    const exact = Math.abs(total - exercise.totalPeople) < 1e-9;
    const over = total > exercise.totalPeople + 1e-9;
    const chars = reasonings[index].trim().length;
    const reasonId = `${exercise.id}-reasoning-${index}`;

    body = (
      <>
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="font-medium">{scenario.title}</p>
          <Paragraphs
            text={scenario.description}
            className="text-muted-foreground mt-1.5 text-sm"
          />
        </div>

        <ul className="border-border divide-border mt-4 divide-y rounded-lg border">
          {exercise.agendas.map((agenda, j) => {
            const previous = index > 0 ? allocations[index - 1][j] : null;
            const delta = previous === null ? 0 : row[j] - previous;
            return (
              <li
                key={agenda.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-2.5"
              >
                <span className="min-w-0 flex-1 text-sm">{agenda.label}</span>
                {previous !== null && (
                  <span className="text-muted-foreground font-mono text-xs whitespace-nowrap tabular-nums">
                    was {formatPeople(previous)}
                    {delta !== 0 && (
                      <span className="border-border ml-1.5 rounded-full border px-1.5">
                        {delta > 0 ? "+" : "−"}
                        {formatPeople(Math.abs(delta))}
                      </span>
                    )}
                  </span>
                )}
                <Stepper
                  label={agenda.label}
                  value={row[j]}
                  max={exercise.totalPeople}
                  step={step}
                  disabled={pending}
                  onChange={(value) => setValue(index, j, value)}
                />
              </li>
            );
          })}
        </ul>

        <p
          aria-live="polite"
          className={cn(
            "mt-2 font-mono text-sm font-medium tabular-nums",
            exact
              ? "text-emerald-700"
              : over
                ? "text-destructive"
                : "text-muted-foreground",
          )}
        >
          {exact ? "✓ " : ""}
          {formatPeople(total)} of {formatPeople(exercise.totalPeople)} allocated
        </p>

        <label htmlFor={reasonId} className="mt-4 block text-sm font-medium">
          {index === 0
            ? "Explain your allocation."
            : "Explain your allocation — in particular, what changed (or didn't) from the previous scenario, and why."}
        </label>
        <Textarea
          id={reasonId}
          value={reasonings[index]}
          onChange={(e) => {
            const value = e.target.value;
            setReasonings((prev) =>
              prev.map((r, i) => (i === index ? value : r)),
            );
          }}
          rows={5}
          maxLength={ALLOCATION_MAX_REASONING_CHARS}
          disabled={pending}
          className="mt-2 resize-y"
        />
        {minChars > 0 && (
          <p
            className={cn(
              "mt-1 text-right font-mono text-xs",
              chars >= minChars ? "text-emerald-700" : "text-muted-foreground",
            )}
          >
            {chars} / {minChars}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => setView(index === 0 ? "intro" : index - 1)}
          >
            Back
          </Button>
          <Button
            size="sm"
            disabled={
              !exact ||
              chars < minChars ||
              // Mirror the server sanitizer so a gated advance can never be
              // silently rejected server-side.
              !isStorableText(reasonings[index]) ||
              pending
            }
            onClick={() => goNext(index)}
          >
            {pending
              ? "Saving…"
              : index === scenarioCount - 1
                ? "Finish"
                : "Next scenario"}
          </Button>
        </div>
      </>
    );
  }

  return (
    <aside className="not-prose border-border bg-card shadow-soft my-6 rounded-xl border p-5">
      <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
        {EXERCISE_TYPE_LABELS.allocation}
        {typeof view === "number" &&
          ` · Scenario ${view + 1} of ${scenarioCount}`}
        {view === "summary" && " · Summary"}
      </p>
      {body}
    </aside>
  );
}
