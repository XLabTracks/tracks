"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { OptionalPrefix } from "@/components/content/optional-tag";
import { cn } from "@/lib/utils";
import { countWords } from "../kit/constructed-response";
import {
  PROOF_ALLEGATION,
  PROOF_CASES,
  PROOF_FINAL,
  PROOF_FINAL_MAX_WORDS,
  PROOF_INTRO,
  PROOF_LIMIT,
  PROOF_MOVES,
  PROOF_REVEAL_GRID,
  PROOF_SELF_CHECK,
  PROOF_SELF_CHECK_LEAD,
  PROOF_TASKS,
  PROOF_TASK_LEAD,
  PROOF_TRANSFER,
  type ProofMoveId,
} from "@/lib/verification/data/standard-of-proof";
import { STANDARD_OF_PROOF_KEY } from "@/lib/verification/data/marking-keys";
import { MarkingKeyPanel } from "../kit/marking-key";
import type { VerificationWidgetProps } from "../kit/types";

interface Saved {
  moves: Record<string, ProofMoveId>;
  answers: Record<string, string>;
  submitted: boolean;
  final: string;
  transfer: string;
}

const STORAGE_KEY = "v-standard-of-proof:v1";
const EMPTY: Saved = {
  moves: {},
  answers: {},
  submitted: false,
  final: "",
  transfer: "",
};
const MOVE_IDS = new Set(PROOF_MOVES.map((m) => m.id));

function prune(raw: unknown): Saved {
  const box = (
    typeof raw === "object" && raw !== null ? raw : {}
  ) as Partial<Saved>;
  const moves: Saved["moves"] = {};
  const answers: Saved["answers"] = {};
  for (const item of PROOF_CASES) {
    const m = box.moves?.[item.id];
    if (typeof m === "string" && MOVE_IDS.has(m as ProofMoveId)) {
      moves[item.id] = m as ProofMoveId;
    }
    const a = box.answers?.[item.id];
    if (typeof a === "string" && a.trim()) answers[item.id] = a;
  }
  return {
    moves,
    answers,
    submitted: box.submitted === true,
    final: typeof box.final === "string" ? box.final : "",
    transfer: typeof box.transfer === "string" ? box.transfer : "",
  };
}

export function StandardOfProof({
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

  const ready = PROOF_CASES.every(
    (d) => saved.moves[d.id] && (saved.answers[d.id] ?? "").trim(),
  );
  const finalWords = countWords(saved.final);

  return (
    <div className="not-prose my-6 space-y-4">
      <div className="bg-background sticky top-0 z-10 rounded-xl">
        <section className="border-primary/40 bg-primary/5 rounded-xl border p-4">
          <p className="text-muted-foreground text-[11px] tracking-[0.14em] uppercase">
            The allegation, common to all four cases
          </p>
          <p className="mt-2 leading-relaxed font-medium">
            &ldquo;{PROOF_ALLEGATION}&rdquo;
          </p>
        </section>
      </div>

      <div className="space-y-3">
        <p className="text-base leading-relaxed font-medium">{PROOF_INTRO}</p>
        <div className="space-y-2">
          <p className="text-sm leading-relaxed">{PROOF_TASK_LEAD}</p>
          <ol className="marker:text-brand-ink marker:font-medium list-decimal space-y-1 pl-6 text-sm leading-relaxed">
            {PROOF_TASKS.map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ol>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {PROOF_LIMIT}
        </p>
      </div>

      <div className="space-y-3">
        {PROOF_CASES.map((item) => (
          <section
            key={item.id}
            className="panel"
          >
            <p className="text-sm font-semibold">
              {item.letter} · {item.title}
            </p>
            <p className="text-muted-foreground mt-2 text-[11px] tracking-[0.12em] uppercase">
              The institution
            </p>
            <p className="mt-1 text-sm leading-relaxed">{item.institution}</p>
            <p className="text-muted-foreground mt-2 text-[11px] tracking-[0.12em] uppercase">
              The evidence
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed">
              {item.evidence.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label={`Next step for case ${item.letter}`}>
              {PROOF_MOVES.map((move) => {
                const picked = saved.moves[item.id] === move.id;
                return (
                  <button
                    key={move.id}
                    type="button"
                    disabled={saved.submitted}
                    aria-pressed={picked}
                    onClick={() =>
                      persist({
                        ...saved,
                        moves: { ...saved.moves, [item.id]: move.id },
                      })
                    }
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs leading-none transition-colors",
                      picked
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground",
                      !saved.submitted && !picked && "hover:bg-muted",
                      saved.submitted && !picked && "opacity-50",
                    )}
                  >
                    {move.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-3">
              <label
                className="text-muted-foreground text-[11px] tracking-[0.12em] uppercase"
                htmlFor={`proof-${item.id}`}
              >
                Your analysis
              </label>
              <textarea
                id={`proof-${item.id}`}
                rows={3}
                readOnly={saved.submitted}
                value={saved.answers[item.id] ?? ""}
                onChange={(e) =>
                  persist({
                    ...saved,
                    answers: { ...saved.answers, [item.id]: e.target.value },
                  })
                }
                className={cn(
                  "border-border bg-background mt-1 w-full rounded-md border p-2.5 text-sm",
                  saved.submitted && "opacity-70",
                )}
              />
            </div>
          </section>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs">
          {saved.submitted
            ? "Submitted. The four cases are locked."
            : "Submit becomes available once every case has a chosen step and an analysis."}
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
            <h4 className="text-muted-foreground text-[11px] tracking-[0.14em] uppercase">
              After submission
            </h4>
            <p className="mt-2 text-sm leading-relaxed">{PROOF_REVEAL_GRID}</p>
            <p className="mt-3 text-sm leading-relaxed">
              {PROOF_SELF_CHECK_LEAD}
            </p>
            <ul className="mt-2 space-y-2">
              {PROOF_SELF_CHECK.map((line) => (
                <li key={line} className="flex gap-3 text-sm leading-relaxed">
                  <span aria-hidden className="text-muted-foreground">
                    —
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>

          <MarkingKeyPanel
            storageKey="v-standard-of-proof-key:v1"
            keyData={STANDARD_OF_PROOF_KEY}
          />

          <section className="panel">
            <p className="text-sm font-medium">{PROOF_FINAL}</p>
            <textarea
              rows={3}
              value={saved.final}
              onChange={(e) => persist({ ...saved, final: e.target.value })}
              aria-label={PROOF_FINAL}
              className="border-border bg-background mt-2 w-full rounded-md border p-3 text-sm"
            />
            <p
              className={cn(
                "mt-1 text-right text-xs",
                finalWords > PROOF_FINAL_MAX_WORDS
                  ? "text-defect"
                  : "text-muted-foreground",
              )}
              aria-live="polite"
            >
              {finalWords} / {PROOF_FINAL_MAX_WORDS} words
            </p>
          </section>

          <section className="panel">
            <p className="text-sm font-medium">
              <OptionalPrefix />
              {PROOF_TRANSFER}
            </p>
            <textarea
              rows={3}
              value={saved.transfer}
              onChange={(e) => persist({ ...saved, transfer: e.target.value })}
              aria-label={PROOF_TRANSFER}
              className="border-border bg-background mt-2 w-full rounded-md border p-3 text-sm"
            />
          </section>
        </div>
      ) : null}
    </div>
  );
}
