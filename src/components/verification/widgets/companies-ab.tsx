"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { countWords } from "../kit/constructed-response";
import {
  AB_QUESTION,
  AB_REVEAL,
  AB_SLOTS,
  AB_WARNING,
  COMPANIES,
  LETTER,
  LETTER_OVERCLAIMS,
  LETTER_OVERCLAIM_NOTES,
  LETTER_QUESTIONS,
  LETTER_SUPPORTED,
  TRANSFER_NOTE,
  TRANSFER_QUESTION,
} from "@/lib/verification/data/companies-ab";
import { COMPANIES_AB_KEY } from "@/lib/verification/data/marking-keys";
import { MarkingKeyPanel } from "../kit/marking-key";
import type { VerificationWidgetProps } from "../kit/types";
import { writingArea, writingCardFocus } from "../kit/writing-surface";

interface Saved {
  differences: Record<string, string>;
  letter: Record<string, string>;
  transfer: string;
  submitted: boolean;
}

const STORAGE_KEY = "v-companies-ab:v1";
const EMPTY: Saved = {
  differences: {},
  letter: {},
  transfer: "",
  submitted: false,
};

function prune(raw: unknown): Saved {
  const box = (
    typeof raw === "object" && raw !== null ? raw : {}
  ) as Partial<Saved>;
  const differences: Record<string, string> = {};
  for (const slot of AB_SLOTS) {
    const v = box.differences?.[slot.id];
    if (typeof v === "string") differences[slot.id] = v;
  }
  const letter: Record<string, string> = {};
  for (const question of LETTER_QUESTIONS) {
    const v = box.letter?.[question.id];
    if (typeof v === "string") letter[question.id] = v;
  }
  return {
    differences,
    letter,
    transfer: typeof box.transfer === "string" ? box.transfer : "",
    submitted: box.submitted === true,
  };
}

export function CompaniesAB({
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
    AB_SLOTS.every((s) => (saved.differences[s.id] ?? "").trim()) &&
    LETTER_QUESTIONS.every((q) => (saved.letter[q.id] ?? "").trim());

  const frozen = saved.submitted;

  return (
    <div className="not-prose my-6 space-y-4">
      <div className="grid gap-2 sm:grid-cols-2">
        {COMPANIES.map((company) => (
          <section
            key={company.id}
            className="panel"
          >
            <h4 className="text-sm font-semibold">{company.label}</h4>
            <ul className="mt-2 space-y-1.5">
              {company.features.map((feature) => (
                <li
                  key={feature.text}
                  className="text-muted-foreground flex gap-2.5 text-sm leading-relaxed"
                >
                  <span aria-hidden>—</span>
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="space-y-1">
        <p className="text-sm leading-relaxed">{AB_QUESTION}</p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {AB_WARNING}
        </p>
      </div>

      <div className="space-y-3">
        {AB_SLOTS.map((slot) => (
          <div
            key={slot.id}
            className={cn(
              "panel",
              writingCardFocus
            )}
          >
            <label
              className="text-muted-foreground eyebrow"
              htmlFor={`ab-${slot.id}`}
            >
              {slot.label}
            </label>
            <textarea
              id={`ab-${slot.id}`}
              rows={3}
              readOnly={frozen}
              value={saved.differences[slot.id] ?? ""}
              onChange={(e) =>
                persist({
                  ...saved,
                  differences: {
                    ...saved.differences,
                    [slot.id]: e.target.value,
                  },
                })
              }
              placeholder="The difference, and what it does."
              className={cn(writingArea, frozen && "opacity-70")}
            />
          </div>
        ))}
      </div>

      <section className="panel">
        <h4 className="text-sm font-semibold">
          {LETTER.title}{" "}
          <span className="text-muted-foreground font-normal">
            · {LETTER.date}
          </span>
        </h4>
        <p className="text-muted-foreground mt-2 eyebrow">
          What it asks for
        </p>
        <ul className="mt-1.5 space-y-1.5">
          {LETTER.asks.map((ask) => (
            <li key={ask} className="flex gap-2.5 text-sm leading-relaxed">
              <span aria-hidden className="text-muted-foreground">
                —
              </span>
              <span>{ask}</span>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground mt-3 eyebrow">
          Who signed it
        </p>
        <ul className="mt-1.5 space-y-1.5">
          {LETTER.composition.map((line) => (
            <li key={line} className="flex gap-2.5 text-sm leading-relaxed">
              <span aria-hidden className="text-muted-foreground">
                —
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs">
          <a
            href={LETTER.href}
            target="_blank"
            rel="noopener"
            className="text-muted-foreground underline-offset-4 hover:underline"
          >
            The letter in full, with its signatories and endorsers
          </a>
        </p>
      </section>

      <div className="space-y-3">
        {LETTER_QUESTIONS.map((question) => (
          <div
            key={question.id}
            className={cn(
              "panel",
              writingCardFocus
            )}
          >
            <label
              className="text-sm font-medium"
              htmlFor={`letter-${question.id}`}
            >
              {question.label}
            </label>
            <textarea
              id={`letter-${question.id}`}
              rows={3}
              readOnly={frozen}
              value={saved.letter[question.id] ?? ""}
              onChange={(e) =>
                persist({
                  ...saved,
                  letter: { ...saved.letter, [question.id]: e.target.value },
                })
              }
              className={cn(writingArea, frozen && "opacity-70")}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs">
          {frozen
            ? "Submitted."
            : "Two differences and both readings of the letter, then submit."}
        </p>
        {frozen ? (
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

      {frozen ? (
        <div className="space-y-4">
          <section className="panel">
            <p className="text-muted-foreground eyebrow">
              What separates A from B
            </p>
            {AB_REVEAL.map((line, i) => (
              <p
                key={line}
                className={cn(
                  "text-sm leading-relaxed",
                  i === 0 ? "mt-3" : "mt-2"
                )}
              >
                {line}
              </p>
            ))}
            <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
              More than one pair is defensible. What earns the point is naming
              the mechanism, not matching these two.
            </p>
          </section>

          <section className="panel">
            <p className="text-muted-foreground eyebrow">
              What the letter is evidence for
            </p>
            <p className="mt-3 text-sm leading-relaxed">{LETTER_SUPPORTED}</p>
            <p className="text-muted-foreground mt-3 eyebrow">
              And what it does not establish
            </p>
            <ul className="mt-1.5 space-y-2">
              {LETTER_OVERCLAIMS.map((claim, i) => (
                <li key={claim} className="text-sm leading-relaxed">
                  <p className="italic">{claim}</p>
                  <p className="text-muted-foreground mt-0.5">
                    {LETTER_OVERCLAIM_NOTES[i]}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section
            className={cn(
              "panel",
              writingCardFocus
            )}
          >
            <p className="text-sm font-medium">{TRANSFER_QUESTION}</p>
            <textarea
              rows={3}
              value={saved.transfer}
              onChange={(e) => persist({ ...saved, transfer: e.target.value })}
              aria-label={TRANSFER_QUESTION}
              className={writingArea}
            />
            <p
              className="text-muted-foreground mt-1 text-right text-xs"
              aria-live="polite"
            >
              {countWords(saved.transfer)} words
            </p>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {TRANSFER_NOTE}
            </p>
          </section>

          <MarkingKeyPanel
            storageKey="v-companies-ab-key:v1"
            keyData={COMPANIES_AB_KEY}
          />
        </div>
      ) : null}
    </div>
  );
}
