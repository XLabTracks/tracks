"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { countWords } from "../kit/constructed-response";
import {
  BOARD_COMMENTARY,
  BOARD_FINAL,
  BOARD_FINAL_MAX_WORDS,
  BOARD_INTRO,
  BOARD_LIMIT,
  BOARD_STATIONS,
  BOARD_STRAIN_PROMPT,
  BOARD_TASK_LEAD,
} from "@/lib/verification/data/missing-board";
import type { VerificationWidgetProps } from "../kit/types";

interface Saved {
  answers: Record<string, string>;
  strain: string;
  submitted: boolean;
  final: string;
}

const STORAGE_KEY = "v-missing-board:v1";
const EMPTY: Saved = { answers: {}, strain: "", submitted: false, final: "" };

function prune(raw: unknown): Saved {
  const box = (
    typeof raw === "object" && raw !== null ? raw : {}
  ) as Partial<Saved>;
  const answers: Saved["answers"] = {};
  for (const station of BOARD_STATIONS) {
    const v = box.answers?.[station.id];
    if (typeof v === "string" && v.trim()) answers[station.id] = v;
  }
  return {
    answers,
    strain: typeof box.strain === "string" ? box.strain : "",
    submitted: box.submitted === true,
    final: typeof box.final === "string" ? box.final : "",
  };
}

export function MissingBoard({
  onComplete,
  initialCompleted,
}: VerificationWidgetProps) {
  const [saved, setSaved] = useState<Saved>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const fired = useRef(initialCompleted);

  useEffect(() => {
    let restored = EMPTY;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) restored = prune(JSON.parse(raw));
    } catch {
    }
    queueMicrotask(() => {
      setSaved(restored);
      setHydrated(true);
    });
  }, []);

  const persist = useCallback((next: Saved) => {
    setSaved(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
    }
  }, []);

  if (!hydrated) return <div className="not-prose my-6 min-h-64" aria-busy />;

  const ready =
    BOARD_STATIONS.every((s) => (saved.answers[s.id] ?? "").trim()) &&
    saved.strain.trim() !== "";
  const finalWords = countWords(saved.final);

  return (
    <div className="not-prose my-6 space-y-4">
      <div className="space-y-3">
        <p className="text-base leading-relaxed font-medium">{BOARD_INTRO}</p>
        <p className="text-sm leading-relaxed">{BOARD_TASK_LEAD}</p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {BOARD_LIMIT}
        </p>
      </div>

      <div className="space-y-3">
        {BOARD_STATIONS.map((station) => (
          <section
            key={station.id}
            className="panel"
          >
            <p className="text-sm font-semibold">{station.title}</p>
            <p className="eyebrow text-muted-foreground mt-2">
              In the nuclear regime
            </p>
            <p className="mt-1 text-sm leading-relaxed">{station.nuclear}</p>
            <div className="mt-3">
              <label
                className="text-sm leading-relaxed font-medium"
                htmlFor={`board-${station.id}`}
              >
                {station.prompt}
              </label>
              <textarea
                id={`board-${station.id}`}
                rows={3}
                readOnly={saved.submitted}
                value={saved.answers[station.id] ?? ""}
                onChange={(e) =>
                  persist({
                    ...saved,
                    answers: { ...saved.answers, [station.id]: e.target.value },
                  })
                }
                className={cn(
                  "border-border bg-background mt-2 w-full rounded-md border p-2.5 text-sm",
                  saved.submitted && "opacity-70",
                )}
              />
            </div>
          </section>
        ))}

        <section className="panel">
          <label
            className="text-sm leading-relaxed font-medium"
            htmlFor="board-strain"
          >
            {BOARD_STRAIN_PROMPT}
          </label>
          <textarea
            id="board-strain"
            rows={3}
            readOnly={saved.submitted}
            value={saved.strain}
            onChange={(e) => persist({ ...saved, strain: e.target.value })}
            className={cn(
              "border-border bg-background mt-2 w-full rounded-md border p-2.5 text-sm",
              saved.submitted && "opacity-70",
            )}
          />
        </section>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs">
          {saved.submitted
            ? "Submitted. The stations are frozen."
            : "Submit opens once every station and the strain carry an answer."}
        </p>
        {saved.submitted ? (
          <Button size="sm" variant="outline" onClick={() => persist(EMPTY)}>
            Start over
          </Button>
        ) : (
          <Button
            size="sm"
            disabled={!ready}
            onClick={() => {
              persist({ ...saved, submitted: true });
              if (!fired.current) {
                fired.current = true;
                onComplete();
              }
            }}
          >
            Submit
          </Button>
        )}
      </div>

      {saved.submitted ? (
        <div className="space-y-4">
          <section className="panel">
            <p className="eyebrow text-muted-foreground">
              Station by station
            </p>
            <dl className="mt-3 space-y-3">
              {BOARD_COMMENTARY.map((row) => (
                <div key={row.title}>
                  <dt className="text-sm font-semibold">{row.title}</dt>
                  <dd className="text-muted-foreground text-sm leading-relaxed">
                    {row.body}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="panel">
            <p className="text-sm font-medium">{BOARD_FINAL}</p>
            <textarea
              rows={3}
              value={saved.final}
              onChange={(e) => persist({ ...saved, final: e.target.value })}
              aria-label={BOARD_FINAL}
              className="border-border bg-background mt-2 w-full rounded-md border p-3 text-sm"
            />
            <p
              className={cn(
                "mt-1 text-right text-xs",
                finalWords > BOARD_FINAL_MAX_WORDS
                  ? "text-defect"
                  : "text-muted-foreground",
              )}
              aria-live="polite"
            >
              {finalWords} / {BOARD_FINAL_MAX_WORDS} words
            </p>
          </section>
        </div>
      ) : null}
    </div>
  );
}
