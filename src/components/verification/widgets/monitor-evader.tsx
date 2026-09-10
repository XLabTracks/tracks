"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { shuffleAnswerOptions } from "@/lib/shuffle";
import { cn } from "@/lib/utils";
import {
  ASSUMPTION,
  CLOSING_FIELDS,
  CORPUS,
  LIMITS,
  ROUNDS,
} from "@/lib/verification/data/monitor-evader";
import {
  allCommitted,
  committedCount,
  firstOpenRound,
  isCommitted,
  matchedCount,
  pickedOption,
  prunePicks,
  type EvaderPicks,
} from "@/lib/verification/engines/monitor-evader";
import { readStored, writeStored } from "@/components/verification/kit/stored";
import { SegMeter } from "../kit/seg-meter";
import type { VerificationWidgetProps } from "../kit/types";

const STORAGE_KEY = "v-monitor-evader:v1";

export function MonitorEvader({
  onComplete,
  initialCompleted,
}: VerificationWidgetProps) {
  const [picks, setPicks] = useState<EvaderPicks>({});
  const [hydrated, setHydrated] = useState(false);
  const [index, setIndex] = useState(0);
  const [closing, setClosing] = useState(false);
  const fired = useRef(initialCompleted);

  useEffect(() => {
    let restored: EvaderPicks = {};
    try {
      const raw = readStored(STORAGE_KEY);
      if (raw) restored = prunePicks(JSON.parse(raw) as EvaderPicks);
    } catch {
    }
    queueMicrotask(() => {
      setPicks(restored);
      setIndex(firstOpenRound(restored));
      setHydrated(true);
    });
  }, []);

  const persist = useCallback((next: EvaderPicks) => {
    setPicks(next);
    try {
      writeStored(STORAGE_KEY, JSON.stringify(next));
    } catch {
    }
  }, []);

  useEffect(() => {
    if (!hydrated || fired.current) return;
    if (allCommitted(picks)) {
      fired.current = true;
      onComplete();
    }
  }, [hydrated, picks, onComplete]);

  if (!hydrated) return <div className="not-prose my-6 min-h-64" aria-busy />;

  const round = ROUNDS[index];
  const committed = isCommitted(picks, round.id);
  const chosen = pickedOption(round, picks);
  const options = shuffleAnswerOptions(
    `monitor-evader:${round.id}`,
    round.options,
    (option) => option.label,
  );
  const last = index === ROUNDS.length - 1;

  if (closing) {
    return (
      <div className="not-prose my-6 space-y-4">
        <section className="panel">
          <p className="text-muted-foreground text-[11px] tracking-[0.14em] uppercase">
            From result to policy claim
          </p>
          <p className="mt-2 text-sm leading-relaxed">
            The rounds are the evidence. These four lines are what a verifier is
            allowed to say about it. Write yours, then open each model answer.
          </p>
        </section>
        {CLOSING_FIELDS.map((field) => (
          <details key={field.id} className="panel">
            <summary className="cursor-pointer text-sm font-semibold">
              {field.label}
            </summary>
            <p className="mt-2 text-sm leading-relaxed">{field.q}</p>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {field.model}
            </p>
          </details>
        ))}
        <section className="panel">
          <p className="text-sm font-semibold">What the study assumed</p>
          <p className="mt-2 text-sm leading-relaxed">{ASSUMPTION}</p>
          <p className="text-muted-foreground mt-3 text-[11px] tracking-[0.12em] uppercase">
            And what it did not cover
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed">
            {LIMITS.map((limit) => (
              <li key={limit}>{limit}</li>
            ))}
          </ul>
        </section>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setClosing(false)}>
            Back to the rounds
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="not-prose my-6 space-y-4">
      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm font-semibold">
            Round {round.n} of {ROUNDS.length}: {round.title}
          </p>
          <p className="text-muted-foreground text-xs">
            {committedCount(picks)} of {ROUNDS.length} committed
            {committedCount(picks) > 0
              ? `, ${matchedCount(picks)} matching the team's move`
              : ""}
          </p>
        </div>
        <SegMeter
          total={ROUNDS.length}
          filled={(i) => isCommitted(picks, ROUNDS[i].id)}
          label={`Round ${round.n} of ${ROUNDS.length}`}
        />
      </div>

      <section className="panel">
        <p className="text-muted-foreground text-[11px] tracking-[0.14em] uppercase">
          The evader moves
        </p>
        <ul className="mt-2 space-y-2 text-sm leading-relaxed">
          {round.evader.map((move) => (
            <li key={move.code}>
              <span className="font-medium">
                {move.code}. {move.name}.
              </span>{" "}
              {move.what}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <p className="text-sm leading-relaxed font-medium">{round.question}</p>
        <div className="mt-3 space-y-2">
          {options.map(({ item }) => {
            const picked = chosen?.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={picked}
                onClick={() =>
                  committed
                    ? undefined
                    : persist({ ...picks, [round.id]: item.id })
                }
                className={cn(
                  "block w-full rounded-lg border px-3 py-2 text-left text-sm leading-relaxed transition-colors",
                  picked
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background text-foreground",
                  !committed && !picked && "hover:bg-muted",
                  committed && !picked && "opacity-60",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        {committed && chosen ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm leading-relaxed">
              <span className="font-semibold">
                {chosen.right ? "That is the move." : "Not the move taken."}
              </span>{" "}
              {chosen.note}
            </p>
            {!chosen.right ? (
              <p className="text-sm leading-relaxed">{round.actual}</p>
            ) : null}
            <dl className="grid gap-2 sm:grid-cols-2">
              <div className="border-border rounded-lg border p-3">
                <dt className="text-muted-foreground text-[11px] tracking-[0.12em] uppercase">
                  Before hardening
                </dt>
                <dd className="mt-1 text-sm leading-relaxed">{round.baseline}</dd>
              </div>
              <div className="border-border rounded-lg border p-3">
                <dt className="text-muted-foreground text-[11px] tracking-[0.12em] uppercase">
                  After
                </dt>
                <dd className="mt-1 text-sm leading-relaxed">{round.hardened}</dd>
              </div>
            </dl>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {round.reading}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
            Commit before the numbers appear.
          </p>
        )}
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          disabled={index === 0}
          onClick={() => setIndex(index - 1)}
        >
          Previous round
        </Button>
        {last ? (
          <Button disabled={!committed} onClick={() => setClosing(true)}>
            What the verifier can say
          </Button>
        ) : (
          <Button disabled={!committed} onClick={() => setIndex(index + 1)}>
            Next round
          </Button>
        )}
        <p className="text-muted-foreground text-xs">
          Whole corpus: {CORPUS.binary} binary accuracy over {CORPUS.families}{" "}
          evasion families, {CORPUS.models} GPU models, {CORPUS.generations}{" "}
          architecture generations.
        </p>
      </div>
    </div>
  );
}
