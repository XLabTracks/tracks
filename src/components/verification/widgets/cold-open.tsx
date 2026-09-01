"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DESK_DISPOSITIONS,
  DESK_SIGNALS,
  type DeskConfidence,
  type DeskDispositionId,
} from "@/lib/verification/data/analyst-desk";
import type { VerificationWidgetProps } from "../kit/types";

export const COLD_OPEN_KEY = "v-intel-cold-open:v1";

export interface ColdCall {
  disposition: DeskDispositionId;
  confidence: DeskConfidence;
}

const DISPOSITION_IDS = new Set(DESK_DISPOSITIONS.map((d) => d.id));
const CONFIDENCES: DeskConfidence[] = ["low", "medium", "high"];

export function readColdCall(): ColdCall | null {
  try {
    const raw = localStorage.getItem(COLD_OPEN_KEY);
    if (!raw) return null;
    const box = JSON.parse(raw) as Partial<ColdCall>;
    if (
      typeof box.disposition === "string" &&
      DISPOSITION_IDS.has(box.disposition) &&
      (box.confidence === "low" ||
        box.confidence === "medium" ||
        box.confidence === "high")
    ) {
      return { disposition: box.disposition, confidence: box.confidence };
    }
  } catch {
  }
  return null;
}

export function ColdOpen({ onComplete, initialCompleted }: VerificationWidgetProps) {
  const signal = DESK_SIGNALS[0]!;
  const [call, setCall] = useState<Partial<ColdCall>>({});
  const [committed, setCommitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const fired = useRef(initialCompleted);

  useEffect(() => {
    const restored = readColdCall();
    queueMicrotask(() => {
      if (restored) {
        setCall(restored);
        setCommitted(true);
      }
      setHydrated(true);
    });
  }, []);

  const persist = useCallback((next: ColdCall) => {
    try {
      localStorage.setItem(COLD_OPEN_KEY, JSON.stringify(next));
    } catch {
    }
  }, []);

  if (!hydrated) return <div className="not-prose my-6 min-h-48" aria-busy />;

  const dispositionLabel = DESK_DISPOSITIONS.find(
    (d) => d.id === call.disposition,
  )?.label;

  return (
    <div className="not-prose my-6 space-y-4">
      <div className="border-border bg-card rounded-xl border p-5">
        <p className="eyebrow text-muted-foreground">
          Signal · {signal.chip}
        </p>
        <p className="mt-1 text-sm font-semibold">{signal.title}</p>
        <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
          {signal.dossier}
        </p>
      </div>

      {committed ? (
        <div className="border-border rounded-xl border p-4">
          <p className="text-sm">
            <span className="font-medium">✓ Sealed.</span> You committed{" "}
            <span className="font-medium">{dispositionLabel}</span> at{" "}
            <span className="font-medium">{call.confidence} confidence</span>,
            with nothing but the dossier. It stays sealed until this signal
            comes back at the Analyst Desk in 2.3.5, where you will make the
            same call with the module behind you and the two calls sit side by
            side.
          </p>
        </div>
      ) : (
        <div className="border-border rounded-xl border p-4">
          <p className="text-sm">
            No catalog yet, no cases, no ladder: commit a call on the dossier
            alone. What should the treaty organization do with this signal?
          </p>
          <div className="mt-3 space-y-2" role="group" aria-label="Your disposition">
            {DESK_DISPOSITIONS.map((d) => (
              <button
                key={d.id}
                type="button"
                aria-pressed={call.disposition === d.id}
                onClick={() => setCall({ ...call, disposition: d.id })}
                className={cn(
                  "border-border w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                  call.disposition === d.id
                    ? "border-primary bg-primary/10 font-medium"
                    : "hover:bg-muted",
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm font-medium">Your confidence</p>
          <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Your confidence">
            {CONFIDENCES.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={call.confidence === c}
                onClick={() => setCall({ ...call, confidence: c })}
                className={cn(
                  "border-border rounded-full border px-3 py-1.5 text-xs capitalize transition-colors",
                  call.confidence === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button
              size="sm"
              disabled={!call.disposition || !call.confidence}
              onClick={() => {
                const full = call as ColdCall;
                persist(full);
                setCommitted(true);
                if (!fired.current) {
                  fired.current = true;
                  onComplete();
                }
              }}
            >
              Commit the cold call
            </Button>
            <p className="text-muted-foreground text-xs">
              Sealed until the Analyst Desk. No reveal now; that is the point.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
