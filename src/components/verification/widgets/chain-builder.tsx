"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { shuffleAnswerOptions } from "@/lib/shuffle";
import { cn } from "@/lib/utils";
import {
  BREAK_QUESTION,
  CHAIN,
  QUESTIONS,
} from "@/lib/verification/data/chain-builder";
import {
  breakScore,
  EMPTY_CHAIN,
  isRightNext,
  orderComplete,
  pruneChain,
  questionRight,
  remaining,
  vendorRootedIds,
  type ChainState,
} from "@/lib/verification/engines/chain-builder";
import { readStored, writeStored } from "@/components/verification/kit/stored";
import { SegMeter } from "../kit/seg-meter";
import type { VerificationWidgetProps } from "../kit/types";

const STORAGE_KEY = "v-chain-builder:v1";

export function ChainBuilder({
  onComplete,
  initialCompleted,
}: VerificationWidgetProps) {
  const [state, setState] = useState<ChainState>(EMPTY_CHAIN);
  const [hydrated, setHydrated] = useState(false);
  const [wrong, setWrong] = useState<string | null>(null);
  const [pending, setPending] = useState<Record<string, string[]>>({});
  const [breakPending, setBreakPending] = useState<string[]>([]);
  const [breakCommitted, setBreakCommitted] = useState(false);
  const fired = useRef(initialCompleted);

  useEffect(() => {
    let restored = EMPTY_CHAIN;
    try {
      const raw = readStored(STORAGE_KEY);
      if (raw) restored = pruneChain(JSON.parse(raw));
    } catch {
    }
    queueMicrotask(() => {
      setState(restored);
      setBreakCommitted(restored.broken.length > 0);
      setHydrated(true);
    });
  }, []);

  const persist = useCallback((next: ChainState) => {
    setState(next);
    try {
      writeStored(STORAGE_KEY, JSON.stringify(next));
    } catch {
    }
  }, []);

  const answered = QUESTIONS.filter((q) => state.answers[q.id]).length;
  const done = orderComplete(state.order) && answered === QUESTIONS.length;

  useEffect(() => {
    if (!hydrated || fired.current || !done) return;
    fired.current = true;
    onComplete();
  }, [hydrated, done, onComplete]);

  if (!hydrated) return <div className="not-prose my-6 min-h-64" aria-busy />;

  const left = remaining(state.order);
  const placed = state.order.map((id) => CHAIN.find((l) => l.id === id)!);
  const choices = shuffleAnswerOptions(
    `chain-builder:${state.order.length}`,
    left,
    (link) => link.name,
  );

  return (
    <div className="not-prose my-6 space-y-4">
      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm font-semibold">
            {orderComplete(state.order)
              ? "The chain, end to end"
              : "Build the chain, one link at a time"}
          </p>
          <p className="text-muted-foreground text-xs">
            {state.order.length} of {CHAIN.length} placed
          </p>
        </div>
        <SegMeter
          total={CHAIN.length}
          filled={(i) => i < state.order.length}
          label={`${state.order.length} of ${CHAIN.length} links placed`}
        />
      </div>

      {placed.length > 0 ? (
        <ol className="space-y-2">
          {placed.map((link) => {
            const marked = state.broken.includes(link.id);
            const shown = breakCommitted && link.vendorRooted;
            return (
              <li
                key={link.id}
                className={cn(
                  "rounded-lg border p-3",
                  shown
                    ? "border-primary bg-primary/10"
                    : "border-border bg-background",
                )}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold">{link.name}</p>
                  {breakCommitted ? (
                    <p className="text-xs">
                      {link.vendorRooted
                        ? "Fails with the vendor key"
                        : "Survives"}
                      {marked !== link.vendorRooted ? " (you said otherwise)" : ""}
                    </p>
                  ) : null}
                </div>
                <p className="mt-1 text-sm leading-relaxed">{link.what}</p>
                <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                  Controlled by: {link.owner}. Rooted in: {link.root}.
                </p>
              </li>
            );
          })}
        </ol>
      ) : null}

      {!orderComplete(state.order) ? (
        <section className="panel">
          <p className="text-sm leading-relaxed font-medium">
            Which link comes next, after the ones already placed?
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {choices.map(({ item }) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (isRightNext(state.order, item.id)) {
                    setWrong(null);
                    persist({ ...state, order: [...state.order, item.id] });
                  } else {
                    setWrong(item.id);
                  }
                }}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs leading-none transition-colors",
                  wrong === item.id
                    ? "border-border bg-muted text-muted-foreground"
                    : "border-border bg-background hover:bg-muted",
                )}
              >
                {item.name}
              </button>
            ))}
          </div>
          {wrong ? (
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Something has to come before that. Read the chain you have so far
              and ask what it is missing: an authorization cannot be issued
              before there is a rule to issue it under, and no chip can enforce
              a token nobody has signed.
            </p>
          ) : null}
        </section>
      ) : (
        <>
          <section className="panel">
            <p className="text-sm font-semibold">{BREAK_QUESTION.q}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {CHAIN.map((link) => {
                const marked = breakCommitted
                  ? state.broken.includes(link.id)
                  : breakPending.includes(link.id);
                return (
                  <button
                    key={link.id}
                    type="button"
                    aria-pressed={marked}
                    disabled={breakCommitted}
                    onClick={() =>
                      setBreakPending(
                        marked
                          ? breakPending.filter((id) => id !== link.id)
                          : [...breakPending, link.id],
                      )
                    }
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs leading-none transition-colors",
                      marked
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background",
                      !breakCommitted && !marked && "hover:bg-muted",
                    )}
                  >
                    {link.name}
                  </button>
                );
              })}
            </div>
            {breakCommitted ? (
              <div className="mt-3 space-y-2">
                <p className="text-sm leading-relaxed">
                  {(() => {
                    const score = breakScore(state.broken);
                    return `You marked ${score.caught} of ${vendorRootedIds().length}, and flagged ${score.falseFlagged} that hold.`;
                  })()}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {BREAK_QUESTION.why}
                </p>
              </div>
            ) : (
              <Button
                className="mt-3"
                disabled={breakPending.length === 0}
                onClick={() => {
                  setBreakCommitted(true);
                  persist({ ...state, broken: breakPending });
                }}
              >
                Commit
              </Button>
            )}
          </section>

          {QUESTIONS.map((question) => {
            const committed = state.answers[question.id];
            const picked = committed ?? pending[question.id] ?? [];
            return (
              <section key={question.id} className="panel">
                <p className="text-sm font-semibold">{question.q}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {CHAIN.map((link) => {
                    const marked = picked.includes(link.id);
                    return (
                      <button
                        key={link.id}
                        type="button"
                        aria-pressed={marked}
                        disabled={Boolean(committed)}
                        onClick={() =>
                          setPending({
                            ...pending,
                            [question.id]: marked
                              ? picked.filter((id) => id !== link.id)
                              : [...picked, link.id],
                          })
                        }
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs leading-none transition-colors",
                          marked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background",
                          !committed && !marked && "hover:bg-muted",
                        )}
                      >
                        {link.name}
                      </button>
                    );
                  })}
                </div>
                {committed ? (
                  <p className="mt-3 text-sm leading-relaxed">
                    <span className="font-semibold">
                      {questionRight(question.id, committed)
                        ? "Yes."
                        : "Not quite."}
                    </span>{" "}
                    {question.why}
                  </p>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      disabled={picked.length === 0}
                      onClick={() =>
                        persist({
                          ...state,
                          answers: { ...state.answers, [question.id]: picked },
                        })
                      }
                    >
                      Commit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        persist({
                          ...state,
                          answers: { ...state.answers, [question.id]: [] },
                        })
                      }
                    >
                      None of them
                    </Button>
                  </div>
                )}
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}
