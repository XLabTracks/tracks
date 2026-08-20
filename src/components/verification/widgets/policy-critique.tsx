"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FINDING_SLOTS,
  POLICY_BRIDGE,
  POLICY_PROMPT,
  POLICY_PROVISIONS,
  POLICY_REVEAL,
  POLICY_TITLE,
} from "@/lib/verification/data/policy-critique";
import type { VerificationWidgetProps } from "../kit/types";
import { writingArea, writingCardFocus } from "../kit/writing-surface";

interface Saved {
  picks: Record<string, string>;
  reasons: Record<string, string>;
  submitted: boolean;
}

const STORAGE_KEY = "v-policy-critique:v1";
const EMPTY: Saved = { picks: {}, reasons: {}, submitted: false };
const PROVISION_IDS = new Set(POLICY_PROVISIONS.map((p) => p.id));

function prune(raw: unknown): Saved {
  const box = (
    typeof raw === "object" && raw !== null ? raw : {}
  ) as Partial<Saved>;
  const picks: Record<string, string> = {};
  const reasons: Record<string, string> = {};
  for (const slot of FINDING_SLOTS) {
    const pick = box.picks?.[slot.id];
    if (typeof pick === "string" && PROVISION_IDS.has(pick)) {
      picks[slot.id] = pick;
    }
    const reason = box.reasons?.[slot.id];
    if (typeof reason === "string") reasons[slot.id] = reason;
  }
  return { picks, reasons, submitted: box.submitted === true };
}

export function PolicyCritique({
  onComplete,
  initialCompleted,
}: VerificationWidgetProps) {
  const [saved, setSaved] = useState<Saved>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [active, setActive] = useState(FINDING_SLOTS[0]!.id);
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

  function assign(provisionId: string) {
    if (saved.submitted) return;
    const picks: Record<string, string> = {};
    for (const [slot, pick] of Object.entries(saved.picks)) {
      if (slot !== active && pick !== provisionId) picks[slot] = pick;
    }
    picks[active] = provisionId;
    persist({ ...saved, picks });
    const next = FINDING_SLOTS.find((s) => !picks[s.id]);
    if (next) setActive(next.id);
  }

  const usedBy = (provisionId: string) =>
    FINDING_SLOTS.find((s) => saved.picks[s.id] === provisionId);

  const ready = FINDING_SLOTS.every(
    (slot) => saved.picks[slot.id] && (saved.reasons[slot.id] ?? "").trim()
  );

  return (
    <div className="not-prose my-6 space-y-4">
      <p className="text-sm leading-relaxed">{POLICY_BRIDGE}</p>

      <section className="panel">
        <h4 className="text-sm font-semibold">{POLICY_TITLE}</h4>
        <ul className="mt-3 space-y-2">
          {POLICY_PROVISIONS.map((provision) => {
            const slot = usedBy(provision.id);
            return (
              <li key={provision.id}>
                <button
                  type="button"
                  disabled={saved.submitted}
                  aria-pressed={!!slot}
                  onClick={() => assign(provision.id)}
                  className={cn(
                    "border-border w-full rounded-lg border p-3 text-left text-sm leading-relaxed transition-colors",
                    slot ? "border-primary bg-primary/5" : "hover:bg-muted",
                    saved.submitted && "cursor-default"
                  )}
                >
                  {provision.text}
                  {slot ? (
                    <span className="text-muted-foreground mt-1 block eyebrow">
                      {slot.label}
                    </span>
                  ) : null}
                </button>
                {saved.submitted ? (
                  <p className="text-muted-foreground mt-1.5 px-3 text-sm leading-relaxed">
                    {provision.annotation}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <p className="text-sm leading-relaxed">{POLICY_PROMPT}</p>

      <ol className="space-y-3">
        {FINDING_SLOTS.map((slot) => {
          const provision = POLICY_PROVISIONS.find(
            (p) => p.id === saved.picks[slot.id]
          );
          const isActive = !saved.submitted && active === slot.id;
          return (
            <li
              key={slot.id}
              className={cn(
                "panel",
                writingCardFocus,
                isActive && "border-primary"
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="text-muted-foreground eyebrow">
                  {slot.label}
                </p>
                {!saved.submitted && !provision ? (
                  <button
                    type="button"
                    onClick={() => setActive(slot.id)}
                    className="text-muted-foreground text-xs underline-offset-4 hover:underline"
                  >
                    {isActive ? "Press a provision above" : "Fill this one"}
                  </button>
                ) : null}
              </div>

              <p
                className={cn(
                  "mt-1.5 text-sm leading-relaxed",
                  !provision && "text-muted-foreground"
                )}
              >
                {provision ? provision.text : "No provision chosen yet."}
              </p>

              <textarea
                rows={3}
                readOnly={saved.submitted}
                value={saved.reasons[slot.id] ?? ""}
                onChange={(e) =>
                  persist({
                    ...saved,
                    reasons: { ...saved.reasons, [slot.id]: e.target.value },
                  })
                }
                placeholder="Why — what it does to reporting, or to information trying to reach the verifier."
                aria-label={`Reason: ${slot.label}`}
                className={cn(writingArea, saved.submitted && "opacity-70")}
              />
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs">
          {saved.submitted
            ? "Submitted. The policy now carries what each provision does."
            : "Four findings, each with a provision and a reason."}
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
            Submit the four findings
          </Button>
        )}
      </div>

      {saved.submitted ? (
        <div className="space-y-4">
          <section className="panel">
            {POLICY_REVEAL.map((line, i) => (
              <p
                key={line}
                className={cn("text-sm leading-relaxed", i > 0 && "mt-2")}
              >
                {line}
              </p>
            ))}
          </section>
        </div>
      ) : null}
    </div>
  );
}
