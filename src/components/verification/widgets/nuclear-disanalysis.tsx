"use client";

import { ArrowUpRight } from "lucide-react";

import { Fold } from "@/components/mdx/fold";
import { SourceQuote } from "@/components/mdx/reader/source-quote";
import type { VerificationWidgetProps } from "../kit/types";
import {
  BAKER,
  CLAIM,
  DEALT_CARD,
  QUESTIONS,
  READ_NOTE,
  READING_MAP,
  type DisanalysisQuote,
} from "@/lib/verification/data/nuclear-disanalysis";

/**
 * 0.3's disanalysis task, reshaped on the course owner's instruction: read
 * Baker FIRST — the paper is the examination the tasks reason about — then
 * three ungated reasoning tasks against it. No commits, no minimum lengths,
 * no locked steps, no buttons between a reader and the next question: "it's
 * not a test, it's reasoning." Where a task offers Baker's own words, they
 * sit in a Fold — offered, never a reward for pressing something.
 *
 * Nothing here composes a sentence of curriculum: the claim, the reading
 * map, the tasks and every quote live in `data/nuclear-disanalysis.ts` —
 * read its header before editing any of them.
 *
 * Unbridged: reading is the exercise, so the host's view-style completion
 * applies and the widget holds no state at all.
 */

export function NuclearDisanalysis(_props: VerificationWidgetProps) {
  void _props;
  return (
    <div className="not-prose my-6 space-y-4">
      {/* The claim under examination. */}
      <div className="panel">
        <p className="text-muted-foreground text-sm">{CLAIM.lead}</p>
        <blockquote className="border-border mt-2 border-l-2 pl-4 leading-relaxed italic">
          {CLAIM.text}
        </blockquote>
      </div>

      {/* The read. It comes first: the tasks below are answered against it. */}
      <div className="border-border bg-card shadow-soft space-y-3 rounded-xl border p-5">
        <p className="text-muted-foreground eyebrow">
          Read Baker first
        </p>
        <p>
          <a
            href={BAKER.href}
            target="_blank"
            rel="noopener"
            className="font-semibold underline underline-offset-4"
          >
            {BAKER.title}
            <ArrowUpRight className="ml-1 inline size-3.5 align-baseline" aria-hidden />
          </a>
        </p>
        <p className="text-muted-foreground text-xs">
          {BAKER.author} · {BAKER.year} · {BAKER.licence}
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">{READ_NOTE}</p>
        {/* Her reading map: eight pages of forty-four, and why each. */}
        <ul className="space-y-1.5 text-sm">
          {READING_MAP.map((r) => (
            <li key={r.where} className="leading-relaxed">
              <span className="font-medium">{r.where}</span>
              <span className="text-muted-foreground"> — {r.what}. {r.why}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* The tasks. All three visible, none gated on the others. */}
      {QUESTIONS.map((q) => (
        <section
          key={q.id}
          className="border-border bg-card shadow-soft space-y-3 rounded-xl border p-5"
        >
          <p className="text-muted-foreground eyebrow">
            Task {q.n} of {QUESTIONS.length}
          </p>
          <h3 className="text-lg leading-snug font-semibold">{q.title}</h3>

          {/* Her Q3 deals the disanalogy card before it asks. Attribution
              above the words, as everywhere. */}
          {q.id === "q3" ? (
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Consider the following fact:</p>
              <p className="text-muted-foreground text-xs">
                {BAKER.author} — {DEALT_CARD.what}
              </p>
              <blockquote className="border-border border-l-2 pl-4 text-sm leading-relaxed">
                {DEALT_CARD.text}
              </blockquote>
            </div>
          ) : null}

          <p className="font-semibold">{q.ask}</p>
          {q.body.map((para) => (
            <p key={para} className="text-muted-foreground text-sm leading-relaxed">
              {para}
            </p>
          ))}

          {/* Possibilities to reason between — words, never buttons. */}
          {q.choice ? (
            <div className="space-y-1.5 text-sm">
              <p className="text-muted-foreground">{q.choice.prompt}</p>
              <ul className="space-y-1">
                {q.choice.options.map((o) => (
                  <li key={o.id} className="leading-relaxed">
                    <span className="font-medium">{o.label}</span>
                    {o.hint ? (
                      <span className="text-muted-foreground"> — {o.hint}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {q.reveal ? (
            <Fold label="Baker’s own words">
              {q.revealLead ? <p>{q.revealLead}</p> : null}
              {q.reveal.map((quote) => (
                <BakerQuote key={quote.what} quote={quote} />
              ))}
              {q.caveat ? <p>{q.caveat}</p> : null}
            </Fold>
          ) : null}
        </section>
      ))}
    </div>
  );
}

/** One of Baker's sections, attribution above the words. */
function BakerQuote({ quote }: { quote: DisanalysisQuote }) {
  return (
    <SourceQuote
      t={BAKER.title}
      url={BAKER.href}
      what={quote.what}
      by={`${BAKER.author} · ${BAKER.year} · ${BAKER.licence}`}
    >
      {quote.blocks.map((b, i) => (
        <div key={i} className="space-y-2 [&+&]:mt-3">
          {b.label ? (
            <p className="text-muted-foreground text-xs tracking-[0.12em] uppercase">
              {b.label}
            </p>
          ) : null}
          {b.lead ? <p>{b.lead}</p> : null}
          {b.text ? <p>{b.text}</p> : null}
          {b.points ? (
            <ul className="space-y-2 pl-4">
              {b.points.map((p) => (
                <li key={p.term} className="list-disc">
                  <span className="font-medium">{p.term}.</span> {p.text}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </SourceQuote>
  );
}
