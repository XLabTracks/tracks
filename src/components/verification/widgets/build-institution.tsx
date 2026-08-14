"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { countWords } from "../kit/constructed-response";
import {
  EXPLANATION_MAX_WORDS,
  EXPLANATION_PROMPT,
  PICK_EXACTLY,
  PROVISIONS,
  REQUIREMENTS,
  SAMPLE_DESIGNS,
  SCENARIO,
  SWAP_PROMPT,
  TESTS,
  type Provision,
} from "@/lib/verification/data/build-institution";
import { evaluateInstitution } from "@/lib/verification/engines/build-institution";
import { BUILD_INSTITUTION_KEY } from "@/lib/verification/data/marking-keys";
import { MarkingKeyPanel } from "../kit/marking-key";
import type { VerificationWidgetProps } from "../kit/types";

/**
 * 2.4.4 — Build the Institution. It replaces "Audit the Verifier", which ran
 * on the same decision-lab engine as 2.4.3.
 *
 * Exactly five cards, then eighty words on why the five work together. The
 * evaluation is `evaluateInstitution` and it reads FUNCTIONS AND
 * CONTRADICTIONS, never a combination: the spec's design principle is that
 * several selections are defensible and no hidden five is the answer, so the
 * engine has no five to compare against and its unit test proves more than
 * one selection passes.
 *
 * The verdict comes back per test with the evaluator's own sentences, which
 * name the card that broke it. That is the difference between feedback and a
 * score: "D puts the organization in the path of its own accusation" is
 * something you can argue with; 2/3 is not.
 *
 * Nothing is graded — the eighty words are never read by anything. Failing
 * the tests does not block submission either: the reveal is where you find
 * out, and Start over is how you try the other design.
 *
 * Bridged: submitting is the section's finish event, fired once.
 */

interface Saved {
  picked: string[];
  submitted: boolean;
  explanation: string;
  swap: string;
}

const STORAGE_KEY = "v-build-institution:v1";
const EMPTY: Saved = {
  picked: [],
  submitted: false,
  explanation: "",
  swap: "",
};
const IDS = new Set(PROVISIONS.map((p) => p.id));
const GROUPS = ["Reporting", "Protection", "Verification"] as const;

function prune(raw: unknown): Saved {
  const box = (
    typeof raw === "object" && raw !== null ? raw : {}
  ) as Partial<Saved>;
  const picked = Array.isArray(box.picked)
    ? box.picked.filter(
        (id): id is string => typeof id === "string" && IDS.has(id)
      )
    : [];
  return {
    picked: picked.slice(0, PICK_EXACTLY),
    submitted: box.submitted === true,
    explanation: typeof box.explanation === "string" ? box.explanation : "",
    swap: typeof box.swap === "string" ? box.swap : "",
  };
}

export function BuildInstitution({
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
      /* unreadable storage just means starting fresh */
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
      /* private mode / full quota */
    }
  }, []);

  if (!hydrated) return <div className="not-prose my-6 min-h-64" aria-busy />;

  function toggle(id: string) {
    if (saved.submitted) return;
    const on = saved.picked.includes(id);
    if (!on && saved.picked.length >= PICK_EXACTLY) return;
    persist({
      ...saved,
      picked: on ? saved.picked.filter((p) => p !== id) : [...saved.picked, id],
    });
  }

  const full = saved.picked.length === PICK_EXACTLY;
  const words = countWords(saved.explanation);
  const evaluation = saved.submitted ? evaluateInstitution(saved.picked) : null;

  return (
    <div className="not-prose my-6 space-y-4">
      <section className="border-border bg-card rounded-xl border p-4">
        <p className="text-sm leading-relaxed">{SCENARIO}</p>
        <p className="mt-2 text-sm leading-relaxed">
          Choose exactly {PICK_EXACTLY} provisions. Your institution must
          satisfy all three requirements:
        </p>
        <ol className="mt-2 space-y-1.5">
          {REQUIREMENTS.map((requirement, i) => (
            <li
              key={requirement}
              className="flex gap-3 text-sm leading-relaxed"
            >
              <span className="border-border text-muted-foreground flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px]">
                {i + 1}
              </span>
              <span>{requirement}</span>
            </li>
          ))}
        </ol>
      </section>

      {GROUPS.map((group) => (
        <section key={group} className="space-y-2">
          <h4 className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
            {group}
          </h4>
          <div className="grid gap-2">
            {PROVISIONS.filter((p) => p.group === group).map((provision) => (
              <Card
                key={provision.id}
                provision={provision}
                on={saved.picked.includes(provision.id)}
                blocked={full && !saved.picked.includes(provision.id)}
                frozen={saved.submitted}
                onToggle={() => toggle(provision.id)}
              />
            ))}
          </div>
        </section>
      ))}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs" aria-live="polite">
          {saved.picked.length} of {PICK_EXACTLY} chosen
          {saved.picked.length ? ` · ${saved.picked.join(" ")}` : ""}
        </p>
        {saved.submitted ? (
          <Button size="sm" variant="outline" onClick={() => persist(EMPTY)}>
            Start over
          </Button>
        ) : null}
      </div>

      {full && !saved.submitted ? (
        <section className="border-border rounded-xl border p-4">
          <p className="text-sm font-medium">{EXPLANATION_PROMPT}</p>
          <textarea
            rows={4}
            value={saved.explanation}
            onChange={(e) => persist({ ...saved, explanation: e.target.value })}
            aria-label={EXPLANATION_PROMPT}
            className="border-border bg-background mt-2 w-full rounded-md border p-3 text-sm"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <p
              className={cn(
                "font-mono text-xs",
                words > EXPLANATION_MAX_WORDS
                  ? "text-defect"
                  : "text-muted-foreground"
              )}
              aria-live="polite"
            >
              {words} / {EXPLANATION_MAX_WORDS} words
            </p>
            <Button
              size="sm"
              disabled={!saved.explanation.trim()}
              onClick={() => {
                persist({ ...saved, submitted: true });
                if (!fired.current) {
                  fired.current = true;
                  onComplete();
                }
              }}
            >
              Submit the design
            </Button>
          </div>
        </section>
      ) : null}

      {evaluation ? (
        <div className="space-y-4">
          <section className="space-y-2">
            <h4 className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
              Your institution against the three tests
            </h4>
            {TESTS.map((test) => {
              const result = evaluation.results.find((r) => r.id === test.id)!;
              return (
                <div
                  key={test.id}
                  className="border-border bg-card rounded-xl border p-4"
                >
                  <p
                    className={cn(
                      "flex items-center gap-2 text-sm font-semibold",
                      result.passed ? "text-comply" : "text-defect"
                    )}
                  >
                    {result.passed ? (
                      <CircleCheck className="size-4 shrink-0" aria-hidden />
                    ) : (
                      <CircleAlert className="size-4 shrink-0" aria-hidden />
                    )}
                    {test.label}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    {test.question}
                  </p>
                  {result.notes.map((note) => (
                    <p key={note} className="mt-2 text-sm leading-relaxed">
                      {note}
                    </p>
                  ))}
                </div>
              );
            })}
          </section>

          <MarkingKeyPanel
            storageKey="v-build-institution-key:v1"
            keyData={BUILD_INSTITUTION_KEY}
          />

          {/* Two designs that both pass, and what each pays for it. Neither is
              the answer: the engine's own test proves more than one selection
              works, and both of these run through it. */}
          <section className="space-y-2">
            <h4 className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
              Two institutions that work, and what each costs
            </h4>
            {SAMPLE_DESIGNS.map((design) => (
              <article
                key={design.ids.join("")}
                className="border-border bg-card rounded-xl border p-4"
              >
                <p className="text-sm font-semibold">
                  {design.title}{" "}
                  <span className="text-muted-foreground font-mono text-xs">
                    {design.ids.join(" ")}
                  </span>
                </p>
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                  {design.tradeoff}
                </p>
              </article>
            ))}
          </section>

          <section className="border-border rounded-xl border p-4">
            <p className="text-sm font-medium">{SWAP_PROMPT}</p>
            <textarea
              rows={3}
              value={saved.swap}
              onChange={(e) => persist({ ...saved, swap: e.target.value })}
              aria-label={SWAP_PROMPT}
              className="border-border bg-background mt-2 w-full rounded-md border p-3 text-sm"
            />
            <p className="text-muted-foreground mt-1 text-xs">
              Optional. Which components are substitutable, and which functions
              have to stay.
            </p>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function Card({
  provision,
  on,
  blocked,
  frozen,
  onToggle,
}: {
  provision: Provision;
  on: boolean;
  blocked: boolean;
  frozen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={frozen || (blocked && !on)}
      onClick={onToggle}
      className={cn(
        "border-border bg-card flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors",
        on ? "border-primary bg-primary/5" : "hover:bg-muted",
        blocked && !on && "opacity-45",
        frozen && "cursor-default"
      )}
    >
      <span
        className={cn(
          "border-border flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-xs",
          on && "border-primary bg-primary text-primary-foreground"
        )}
      >
        {provision.id}
      </span>
      <span className="text-sm leading-relaxed">{provision.text}</span>
    </button>
  );
}
