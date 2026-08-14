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
import { ConstructedResponse } from "../kit/constructed-response";
import { MarkingKeyPanel } from "../kit/marking-key";
import type { VerificationWidgetProps } from "../kit/types";

/**
 * 2.4.1 — Construct a Case. It replaces "Who Knows What?", which was six
 * actors × three picks and then four more questions: eighteen recognitions
 * where the section's actual operation is construction.
 *
 * It keeps the id, so the lesson mapping, the progress key and the section's
 * finish event are unchanged. The old widget, its data and its engine stay in
 * the repo — the section's roster of who-can-know-what is still the material
 * this case is built out of, it is now read rather than clicked.
 *
 * OPTIONAL, so unbridged: submitting records no completion and the section
 * finishes on reading. The onComplete call stays because the registry types
 * every widget the same way and the host makes it a no-op.
 */
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
      onSubmit={() => {
        if (fired.current) return;
        fired.current = true;
        onComplete();
      }}
      intro={
        <div className="space-y-3">
          <p className="text-sm leading-relaxed">
            Construct a case in which all three statements are true.
          </p>
          <ol className="border-border bg-card space-y-2 rounded-xl border p-4 text-sm">
            {CASE_CONDITIONS.map((condition, i) => (
              <li key={condition} className="flex gap-3 leading-relaxed">
                <span className="border-border text-muted-foreground flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px]">
                  {i + 1}
                </span>
                <span>{condition}</span>
              </li>
            ))}
          </ol>
          <p className="text-muted-foreground text-sm leading-relaxed">
            One concrete case, not three definitions.
          </p>
        </div>
      }
      reveal={
        <div className="space-y-4">
          <MarkingKeyPanel
            storageKey="v-construct-case-key:v1"
            keyData={CONSTRUCT_CASE_KEY}
          />

          <section className="border-border rounded-xl border p-4">
            <h4 className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
              Check your case
            </h4>
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

          <section className="border-border rounded-xl border p-4">
            <h4 className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
              Where a report can die
            </h4>
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

          {/* Two, and unalike, because a single example is read as the answer.
              The spec is explicit: contrasting valid examples, not one
              canonical case. */}
          <section className="space-y-3">
            <h4 className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
              Two cases that work, for different reasons
            </h4>
            {WORKED_CASES.map((worked) => (
              <article
                key={worked.id}
                className="border-border bg-card rounded-xl border p-4"
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
                      <dt className="text-muted-foreground font-mono text-[11px] tracking-[0.12em] uppercase">
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
