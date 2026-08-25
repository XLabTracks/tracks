"use client";

import { useRef } from "react";

import {
  CASE_CHECKLIST,
  CASE_CONDITIONS,
  CASE_EXCLUDED,
  CASE_FAILURE_MODES,
  CASE_FIELDS,
  CASE_WORDS,
  WORKED_CASES,
} from "@/lib/verification/data/construct-case";
import { CONSTRUCT_CASE_KEY } from "@/lib/verification/data/marking-keys";
import { runCaseChecks } from "@/lib/verification/case-checks";
import { CASE_DECK } from "@/lib/verification/data/steelman-decks";
import { ConstructedResponse } from "../kit/constructed-response";
import { MarkingKeyPanel } from "../kit/marking-key";
import type { VerificationWidgetProps } from "../kit/types";

export function ConstructCase({
  onComplete,
  initialCompleted,
}: VerificationWidgetProps) {
  const fired = useRef(initialCompleted);

  return (
    <ConstructedResponse
      storageKey="v-construct-case:v1"
      fields={CASE_FIELDS}
      words={CASE_WORDS}
      submitLabel="Submit the case"
      checks={(values) => runCaseChecks(values, CASE_WORDS)}
      steelman={CASE_DECK}
      onSubmit={() => {
        if (fired.current) return;
        fired.current = true;
        onComplete();
      }}
      intro={
        <div className="space-y-3">
          <p className="text-base leading-relaxed font-medium">
            Give one example of a situation in which all three conditions are
            satisfied:
          </p>
          <ol className="marker:text-brand-ink marker:font-medium list-decimal space-y-2 pl-6 text-sm leading-relaxed">
            {CASE_CONDITIONS.map((condition) => (
              <li key={condition}>{condition}</li>
            ))}
          </ol>
          <p className="text-sm leading-relaxed">
            Describe the situation and explain why each condition is satisfied.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Use 100–180 words in total.
          </p>
        </div>
      }
      reveal={
        <div className="space-y-4">
          <MarkingKeyPanel
            storageKey="v-construct-case-key:v1"
            keyData={CONSTRUCT_CASE_KEY}
          />

          <section className="panel">
            <p className="text-muted-foreground eyebrow">
              Check your case
            </p>
            <ul className="mt-3 space-y-2">
              {CASE_CHECKLIST.map((line) => (
                <li key={line} className="flex gap-3 text-sm leading-relaxed">
                  <span aria-hidden className="text-muted-foreground">
                    —
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <p className="text-muted-foreground eyebrow">
              Where a report can die
            </p>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              All of it held back until now, and deliberately: naming where a
              report dies is the work, and a page that had listed the categories
              first would have left you filling them in. Four that do not count
              —{" "}
              {CASE_EXCLUDED.map((line, i) => (
                <span key={line}>
                  {i === 0
                    ? ""
                    : i === CASE_EXCLUDED.length - 1
                    ? ", or "
                    : ", "}
                  <span className="text-foreground">{line}</span>
                </span>
              ))}
              . Some that do:
            </p>
            <ul className="mt-2 space-y-1.5">
              {CASE_FAILURE_MODES.map((mode) => (
                <li key={mode} className="flex gap-3 text-sm leading-relaxed">
                  <span aria-hidden className="text-muted-foreground">
                    —
                  </span>
                  <span>{mode}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <p className="text-muted-foreground eyebrow">
              Two cases that work, for different reasons
            </p>
            {WORKED_CASES.map((worked) => (
              <article
                key={worked.id}
                className="panel"
              >
                <p className="text-sm font-semibold">{worked.kicker}</p>
                <dl className="mt-3 space-y-2 text-sm leading-relaxed">
                  {(
                    [
                      ["Insider", worked.insider],
                      ["Information", worked.information],
                      ["Reporting route", worked.route],
                      ["Failure point", worked.failure],
                    ] as const
                  ).map(([label, body]) => (
                    <div key={label}>
                      <dt className="text-muted-foreground eyebrow">
                        {label}
                      </dt>
                      <dd>{body}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </section>
        </div>
      }
    />
  );
}
