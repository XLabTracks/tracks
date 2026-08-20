"use client";

import { useCallback, useEffect, useState } from "react";
import { CircleCheck, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  PRECEDENT_CASES,
  type PrecedentCase,
  type PrecedentOutcome,
} from "@/lib/verification/data/precedent-cases";
import { PrecedentCaseDiagram } from "./precedent-case-diagrams";
import type { VerificationWidgetProps } from "../kit/types";
import { SegMeter } from "../kit/seg-meter";

/**
 * "Did the regime hold?" — the 0.3 case-study exercise the outline calls for:
 * eight verification regimes from history, one at a time; the learner commits
 * a call (held / circumvented) before the record is shown, then reads the
 * author's why and its transfer to AI, beside a small diagram of how the
 * regime held or was circumvented (`precedent-case-diagrams.tsx` — reveal
 * material, so it never renders before the call). Commit, reveal, Continue —
 * never auto-advance.
 *
 * Everything the learner reads is authored case-file text in
 * `src/lib/verification/data/precedent-cases.ts`. Nothing here composes a
 * sentence of curriculum.
 *
 * Bridged: `onComplete()` fires once, when the eighth call is committed.
 *
 * Calls persist per case under `v-precedent-cases:v1`; restored progress is
 * applied off the effect body behind `hydrated` so the first client render
 * matches the server's markup, and stored calls are pruned against the
 * current case list before they are trusted.
 */

type Calls = Record<string, PrecedentOutcome>;

const STORAGE_KEY = "v-precedent-cases:v1";

function pruneCalls(raw: unknown): Calls {
  const calls: Calls = {};
  if (typeof raw !== "object" || raw === null) return calls;
  for (const c of PRECEDENT_CASES) {
    const v = (raw as Record<string, unknown>)[c.id];
    if (v === "held" || v === "circumvented") calls[c.id] = v;
  }
  return calls;
}

export function PrecedentCases({ onComplete }: VerificationWidgetProps) {
  const [calls, setCalls] = useState<Calls>({});
  const [hydrated, setHydrated] = useState(false);
  // Index of the case on screen; null = the summary. Seeded after hydration.
  const [pos, setPos] = useState<number | null>(0);
  // The call just committed on the current case, still being read.
  const [reading, setReading] = useState<PrecedentOutcome | null>(null);
  const [resetArmed, setResetArmed] = useState(false);

  useEffect(() => {
    let restored: Calls = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) restored = pruneCalls(JSON.parse(raw));
    } catch {
      /* unreadable storage just means starting fresh */
    }
    queueMicrotask(() => {
      setCalls(restored);
      const firstOpen = PRECEDENT_CASES.findIndex((c) => !restored[c.id]);
      setPos(firstOpen < 0 ? null : firstOpen);
      setHydrated(true);
    });
  }, []);

  const persist = useCallback((next: Calls) => {
    setCalls(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* private mode / full quota — progress is a convenience, not the record */
    }
  }, []);

  function commit(kase: PrecedentCase, call: PrecedentOutcome) {
    const next = { ...calls, [kase.id]: call };
    persist(next);
    setReading(call);
    if (PRECEDENT_CASES.every((c) => next[c.id])) onComplete();
  }

  function advance() {
    setReading(null);
    const next = PRECEDENT_CASES.findIndex((c) => !calls[c.id]);
    setPos(next < 0 ? null : next);
  }

  if (!hydrated) {
    return <Shell aria-busy="true" />;
  }

  if (pos === null) {
    return (
      <Summary
        calls={calls}
        resetArmed={resetArmed}
        onReset={() => {
          if (!resetArmed) {
            setResetArmed(true);
            return;
          }
          setResetArmed(false);
          persist({});
          setPos(0);
        }}
      />
    );
  }

  const kase = PRECEDENT_CASES[pos]!;
  const committed = reading ?? calls[kase.id] ?? null;
  const last = pos + 1 >= PRECEDENT_CASES.length;

  return (
    <Shell>
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-muted-foreground eyebrow">
            Case file · {pos + 1} / {PRECEDENT_CASES.length}
          </p>
          <SegMeter
            total={PRECEDENT_CASES.length}
            filled={(i) => !!calls[PRECEDENT_CASES[i]!.id]}
            label={`Case ${pos + 1} of ${PRECEDENT_CASES.length}`}
            className="max-w-44"
          />
        </div>

        <div>
          <h3 className="text-lg leading-snug font-semibold">{kase.name}</h3>
          <p className="text-muted-foreground text-sm">{kase.tagline}</p>
        </div>

        <p className="border-border bg-muted/40 rounded-lg border p-3 text-sm leading-relaxed">
          {kase.briefing}
        </p>

        <p className="text-sm font-semibold">
          Your call: did this regime hold, or was it circumvented?
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Your call">
          {(["held", "circumvented"] as const).map((option) => {
            const picked = committed === option;
            return (
              <button
                key={option}
                type="button"
                disabled={committed !== null}
                aria-pressed={picked}
                onClick={() => commit(kase, option)}
                className={cn(
                  "rounded-lg border px-4 py-2 text-sm font-semibold transition-colors select-none",
                  committed === null &&
                    "border-border hover:bg-muted/60 cursor-pointer focus-visible:ring-2 focus-visible:outline-none",
                  picked && "border-foreground bg-muted",
                  committed !== null && !picked && "border-border opacity-50",
                )}
              >
                {option === "held" ? "It held" : "It was circumvented"}
              </button>
            );
          })}
        </div>

        {committed !== null ? (
          <div aria-live="polite" className="space-y-3">
            <p
              className={cn(
                "text-sm font-semibold",
                committed === kase.outcome ? "text-comply" : "text-defect",
              )}
            >
              {committed === kase.outcome
                ? "Your call matches the record."
                : "The record disagrees with your call."}
            </p>
            <div className="border-border bg-background space-y-2 rounded-lg border p-3 text-sm leading-relaxed">
              <p className="font-semibold">{kase.outcomeHeading}</p>
              <PrecedentCaseDiagram caseId={kase.id} />
              <p>{kase.why}</p>
            </div>
            <div className="border-border bg-background space-y-2 rounded-lg border p-3 text-sm leading-relaxed">
              <p className="font-semibold">What AI verification should adopt or avoid</p>
              <p>{kase.transfer}</p>
            </div>
            <Button size="sm" onClick={advance}>
              {last ? "Finish" : "Continue"}
            </Button>
          </div>
        ) : null}
      </div>
    </Shell>
  );
}

function Summary({
  calls,
  resetArmed,
  onReset,
}: {
  calls: Calls;
  resetArmed: boolean;
  onReset: () => void;
}) {
  const matched = PRECEDENT_CASES.filter((c) => calls[c.id] === c.outcome).length;
  return (
    <Shell>
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Eight case files, called</h3>
          <p className="text-comply inline-flex items-center gap-1.5 text-sm font-semibold">
            <CircleCheck className="size-4" aria-hidden />
            Your call matched the record on {matched} of {PRECEDENT_CASES.length}.
          </p>
        </div>
        <ul className="space-y-2">
          {PRECEDENT_CASES.map((c) => {
            const call = calls[c.id];
            const match = call === c.outcome;
            return (
              <li
                key={c.id}
                className="border-border rounded-lg border p-3 text-sm leading-relaxed"
              >
                <p className="font-medium">{c.name}</p>
                <p className="text-muted-foreground mt-0.5 text-3xs tracking-wide">
                  yours: {call === "circumvented" ? "circumvented" : "held"} · record:{" "}
                  {c.outcome} ·{" "}
                  <span className={match ? "text-comply" : "text-defect"}>
                    {match ? "match" : "differed"}
                  </span>
                </p>
              </li>
            );
          })}
        </ul>
        <Button variant="outline" size="sm" onClick={onReset} className="gap-2">
          <RotateCcw className="size-4" aria-hidden />
          {resetArmed ? "Sure? Tap again" : "Call them again"}
        </Button>
      </div>
    </Shell>
  );
}

function Shell({
  children,
  ...rest
}: { children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className="not-prose my-6">
      <div className="border-border bg-card shadow-soft min-h-24 rounded-xl border p-5">
        {children}
      </div>
    </div>
  );
}
