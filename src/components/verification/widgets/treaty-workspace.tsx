"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VerificationWidgetProps } from "../kit/types";
import {
  TREATY,
  WORKSPACE_TASKS,
  WORKSPACE_TOTAL,
  type WorkspaceTask,
} from "@/lib/verification/data/treaty-workspace";

/**
 * The 1.1 workspace: work the whole treaty, one task at a time.
 *
 * Two ways through, because the course has two audiences and they need
 * different things from the same task. **Alone**, the key is the point — you
 * commit an answer, read the bank of what a strong answer contains, and tick
 * your own hits; the score is yours and nothing is machine-graded. **With a
 * facilitator**, the key must NOT appear: the facilitator holds it
 * (/facilitator/keys) and scoring happens in the room, which is the whole
 * value of sitting the session. The chooser is therefore a real gate on the
 * reveal, not a display preference.
 *
 * Answers persist per task under `vt-workspace:1.1`. They are learner work:
 * they feed no meter and complete nothing. Completion is the last task being
 * committed, which is a thing the learner did, not a thing they scrolled past.
 *
 * Trap: the mode is stored too, and a learner who picks "with a facilitator"
 * must be able to change their mind afterwards — a cohort that ran late and
 * finished alone should not be locked out of its own key. Switching back
 * reveals nothing retroactively that the reveal button would not.
 */

const KEY = "vt-workspace:1.1";

type Mode = "self" | "facilitated" | null;

interface Saved {
  mode: Mode;
  /** taskId -> the learner's text. Grid rows are one text blob per row. */
  answers: Record<string, string>;
  /** taskId -> committed. */
  done: Record<string, boolean>;
  /** taskId -> indexes of key points the learner ticked as hit. */
  hits: Record<string, number[]>;
}

const EMPTY: Saved = { mode: null, answers: {}, done: {}, hits: {} };

function read(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function TreatyWorkspace({ onComplete }: VerificationWidgetProps) {
  const [state, setState] = useState<Saved>(EMPTY);
  const [at, setAt] = useState(0);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Read after mount: localStorage exists only on the client, and reading it
    // during render would make the server and client markup disagree. One
    // deliberate mount-time re-render, the same trade the parts readers make.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(read());
  }, []);

  const save = useCallback((next: Saved) => {
    setState(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* private mode */
    }
  }, []);

  const task = WORKSPACE_TASKS[at];
  const scored = WORKSPACE_TASKS.reduce(
    (n, t) => n + (state.hits[t.id]?.length ?? 0),
    0,
  );
  const anyScored = Object.values(state.hits).some((h) => h.length > 0);

  if (!state.mode) {
    return (
      <div className="not-prose border-border bg-card my-6 rounded-xl border p-5">
        <p className="text-sm font-medium">Before you start</p>
        <p className="text-muted-foreground mt-1 text-sm">
          {WORKSPACE_TASKS.length} tasks on {TREATY.title} — {TREATY.authors}.
          Total: {WORKSPACE_TOTAL} points. You will need the treaty open; work
          the whole document, nothing is excerpted for you.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => save({ ...state, mode: "self" })}
            className="border-border hover:border-ring hover:bg-muted/40 rounded-lg border p-4 text-left transition-colors select-none"
          >
            <span className="block text-sm font-medium">I am working alone</span>
            <span className="text-muted-foreground mt-1 block text-xs">
              After you commit each answer you can open the marking key and
              score yourself against it.
            </span>
          </button>
          <button
            type="button"
            onClick={() => save({ ...state, mode: "facilitated" })}
            className="border-border hover:border-ring hover:bg-muted/40 rounded-lg border p-4 text-left transition-colors select-none"
          >
            <span className="block text-sm font-medium">
              I am working with a facilitator
            </span>
            <span className="text-muted-foreground mt-1 block text-xs">
              The key stays closed. Your facilitator has it and will score the
              answers with you.
            </span>
          </button>
        </div>
      </div>
    );
  }

  const committed = !!state.done[task.id];
  const isOpen = !!revealed[task.id];

  return (
    <div className="not-prose border-border bg-card my-6 rounded-xl border p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-muted-foreground font-mono text-xs">
          Task {at + 1} / {WORKSPACE_TASKS.length} · {task.points} points
        </p>
        <p className="text-muted-foreground text-xs">
          {state.mode === "self" && anyScored
            ? `Your score: ${scored} / ${WORKSPACE_TOTAL}`
            : `Total: ${WORKSPACE_TOTAL} points`}
        </p>
      </div>

      <h3 className="mt-2 text-base font-semibold">{task.title}</h3>
      <p className="mt-1 text-sm">{task.prompt}</p>
      {task.caution && (
        <p className="border-primary/30 text-muted-foreground mt-3 border-l-2 pl-3 text-xs">
          {task.caution}
        </p>
      )}

      <TaskBody
        task={task}
        answers={state.answers}
        onChange={(id, v) =>
          save({ ...state, answers: { ...state.answers, [id]: v } })
        }
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {!committed ? (
          <Button
            size="sm"
            onClick={() => {
              const done = { ...state.done, [task.id]: true };
              save({ ...state, done });
              if (WORKSPACE_TASKS.every((t) => done[t.id])) onComplete();
            }}
          >
            Commit answer
          </Button>
        ) : state.mode === "self" ? (
          <Button
            size="sm"
            variant={isOpen ? "outline" : "default"}
            onClick={() => setRevealed((r) => ({ ...r, [task.id]: !isOpen }))}
          >
            {isOpen ? "Hide the key" : "Open the marking key"}
          </Button>
        ) : (
          <p className="text-muted-foreground text-xs">
            Committed. Your facilitator has the key for this task.
          </p>
        )}
        {at > 0 && (
          <Button size="sm" variant="ghost" onClick={() => setAt(at - 1)}>
            Back
          </Button>
        )}
        {at < WORKSPACE_TASKS.length - 1 && committed && (
          <Button size="sm" variant="ghost" onClick={() => setAt(at + 1)}>
            Continue
          </Button>
        )}
      </div>

      {state.mode === "self" && committed && isOpen && (
        <div className="border-border mt-4 rounded-lg border p-4">
          <p className="text-xs font-medium">
            What a strong answer contains — tick what you had.
          </p>
          <ul className="mt-2 space-y-2">
            {task.key.map((k, i) => {
              const hit = (state.hits[task.id] ?? []).includes(i);
              return (
                <li key={i}>
                  <label className="flex cursor-pointer items-start gap-2 text-sm select-none">
                    <input
                      type="checkbox"
                      checked={hit}
                      onChange={() => {
                        const cur = state.hits[task.id] ?? [];
                        const next = hit
                          ? cur.filter((n) => n !== i)
                          : [...cur, i];
                        save({
                          ...state,
                          hits: { ...state.hits, [task.id]: next },
                        });
                      }}
                      className="mt-1 shrink-0"
                    />
                    <span>
                      {k.text}
                      {k.pointer && (
                        <span className="text-muted-foreground font-mono text-xs">
                          {" "}
                          · {k.pointer}
                        </span>
                      )}
                      {k.open && (
                        <span className="text-primary text-xs"> · go and see</span>
                      )}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
          <p className="text-muted-foreground mt-3 text-xs">
            Nothing here is graded for you. Points you tick are your own reading
            of your own answer.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => save({ ...state, mode: null })}
        className="text-muted-foreground hover:text-foreground mt-4 text-xs underline underline-offset-2 select-none"
      >
        Change how you are working
      </button>
    </div>
  );
}

function TaskBody({
  task,
  answers,
  onChange,
}: {
  task: WorkspaceTask;
  answers: Record<string, string>;
  onChange: (id: string, v: string) => void;
}) {
  if (task.kind === "grid" && task.rows) {
    return (
      <div className="mt-4 space-y-2">
        {task.rows.map((r) => (
          <div
            key={r.id}
            className={cn(
              "border-border grid gap-2 rounded-lg border p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]",
            )}
          >
            <p className="text-sm font-medium">{r.fn}</p>
            <textarea
              rows={2}
              value={answers[`${task.id}:${r.id}`] ?? ""}
              onChange={(e) => onChange(`${task.id}:${r.id}`, e.target.value)}
              placeholder="Article · who is obliged · what would prove it"
              className="border-border bg-background w-full rounded-md border p-2 text-sm"
            />
          </div>
        ))}
        {task.missing && (
          <p className="text-muted-foreground text-xs">
            Two functions are missing from this list on purpose. Add them where
            you think they belong, or say why the treaty does not need them.
          </p>
        )}
      </div>
    );
  }
  return (
    <textarea
      rows={6}
      value={answers[task.id] ?? ""}
      onChange={(e) => onChange(task.id, e.target.value)}
      placeholder="Cite the Article you are talking about."
      className="border-border bg-background mt-4 w-full rounded-md border p-3 text-sm"
    />
  );
}
