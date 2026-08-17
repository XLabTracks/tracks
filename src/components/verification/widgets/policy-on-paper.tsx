"use client";

import { useEffect, useRef, useState } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useStoredState } from "../kit/use-stored-state";
import {
  POLICY_COMPANIES,
  POLICY_DEMANDS,
  POLICY_GROUPS,
  POLICY_NOTES_KEY,
  POLICY_QUESTIONS,
  POLICY_SOURCES,
  POLICY_TASK,
  PROVENANCE,
  type Provenance,
} from "@/lib/verification/data/policy-on-paper";
import { INSTITUTION_DECK } from "@/lib/verification/data/steelman-decks";
import { QuestionWorkspace } from "../kit/question-workspace";
import { Spoiler } from "../kit/spoiler";
import { SteelmanDeck } from "../kit/steelman-deck";
import type { VerificationWidgetProps } from "../kit/types";

/**
 * 2.4.2 — Companies A and B. Mark what kind of evidence each statement about
 * a reporting regime is, then read both regimes against what the employees of
 * those companies asked for themselves.
 *
 * Authored for 2.4.4 and moved here on 2026-08-15: every row is a sentence out
 * of a real whistleblower policy, which is 2.4.2's subject, while 2.4.4's is
 * audit design — and this never used it. The exercise id, the storage keys and
 * the answer key travel unchanged.
 *
 * It closes the section, and unlike 2.4's other labs it is not optional: it
 * sits outside the Fold and it is 2.4.2's one bridged widget.
 *
 * The two companies are tabs and stay anonymous while the learner works —
 * that is the mechanic, not a concealment. Nothing above the Sources block
 * carries a link, because a citation on tab A would name the company while tab
 * B was still meant to be judged blind; the block itself is present from the
 * start with its letters covered, so somebody can uncover it whenever they
 * decide the checking matters more than the puzzle.
 *
 * Marking is per tab and commits per tab: the comparison she wants happens
 * between tabs, and a single commit across both would make the second tab's
 * marks a formality once the pattern is visible. The third tab is not marked
 * at all — it is answered.
 *
 * The questions are hers, verbatim, and are never graded — no model, no key.
 * The two closing ones stand above the tabs in the house's written-answer
 * deck, visible from the moment the block opens, because they are the work
 * the tabs are material for; the demands tab's question sits with its four
 * demands and is what commits that tab.
 */

interface Saved {
  marks: Record<string, Provenance>;
  committed: string[];
  /** The demands tab's one answer. The other two live in the notes deck. */
  demandAnswer: string;
}

const STORAGE_KEY = "v-policy-on-paper:v1";
const EMPTY: Saved = { marks: {}, committed: [], demandAnswer: "" };
const KINDS = new Set(PROVENANCE.map((p) => p.id));
const ALL = POLICY_COMPANIES.flatMap((c) => c.statements);
const TAB_IDS = [...POLICY_COMPANIES.map((c) => c.id), POLICY_DEMANDS.id];

function prune(raw: unknown): Saved {
  const out: Saved = { marks: {}, committed: [], demandAnswer: "" };
  if (typeof raw !== "object" || raw === null) return out;
  const box = raw as Partial<Saved>;
  for (const s of ALL) {
    const v = box.marks?.[s.id];
    if (typeof v === "string" && KINDS.has(v as Provenance)) {
      out.marks[s.id] = v as Provenance;
    }
  }
  if (Array.isArray(box.committed)) {
    out.committed = box.committed.filter((id) => TAB_IDS.includes(id));
  }
  if (typeof box.demandAnswer === "string") out.demandAnswer = box.demandAnswer;
  return out;
}

export function PolicyOnPaper({
  onComplete,
  initialCompleted,
}: VerificationWidgetProps) {
  const [saved, persist, hydrated] = useStoredState(STORAGE_KEY, EMPTY, prune);
  const [tab, setTab] = useState(POLICY_COMPANIES[0]!.id);
  const fired = useRef(initialCompleted);

  /* Bridged: committing the last set is the finish event. There is no single
     button that ends this exercise — three commits do, and which of them is
     last is the learner's order — so it fires from an effect on the finished
     state rather than from a handler. Once. */
  const finished = TAB_IDS.every((id) => saved.committed.includes(id));
  useEffect(() => {
    if (!hydrated || !finished || fired.current) return;
    fired.current = true;
    onComplete();
  }, [hydrated, finished, onComplete]);

  if (!hydrated) return <div className="not-prose my-6 min-h-64" aria-busy />;

  const company = POLICY_COMPANIES.find((c) => c.id === tab);
  const onDemands = tab === POLICY_DEMANDS.id;

  return (
    <div className="not-prose my-6 space-y-4">
      <p className="text-sm leading-relaxed">
        <span className="font-semibold">{POLICY_TASK.n}.</span>{" "}
        {POLICY_TASK.instruction}
      </p>

      <div role="tablist" aria-label="Regime" className="flex flex-wrap gap-2">
        {[...POLICY_COMPANIES, POLICY_DEMANDS].map((c) => {
          const active = c.id === tab;
          const seen = saved.committed.includes(c.id);
          return (
            <button
              key={c.id}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setTab(c.id)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-[11px] tracking-[0.14em] uppercase transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {seen ? "✓ " : ""}
              {c.label}
            </button>
          );
        })}
      </div>

      {company ? (
        <CompanyTab
          companyId={company.id}
          saved={saved}
          persist={persist}
        />
      ) : null}

      {onDemands ? <DemandsTab saved={saved} persist={persist} /> : null}

      <SteelmanDeck deck={INSTITUTION_DECK} />

      {/* The two questions, under the material and never behind a gate. They
          were above it and are now below, which is the course owner's order:
          the tabs are what you answer from. What they must not go back to is
          opening only once every tab is committed — a learner met them after
          the marking was sealed, with no way to re-read a row against them.
          No preamble here; the questions are their own instruction. */}
      <QuestionWorkspace
        storageKey={POLICY_NOTES_KEY}
        rule={{ kind: "any", count: POLICY_QUESTIONS.length }}
        questions={POLICY_QUESTIONS}
        placeholder="Answer as you go. Nothing is graded."
        onComplete={() => {}}
      />

      {/* Who each tab was, and every document its rows were read out of.

          Always present, and covered rather than withheld. It used to render
          only once every tab was committed, which was a lock on top of a
          cover: the spoiler already hides the mapping, and hiding the whole
          block as well meant a learner who wanted to check a claim mid-way
          could not, and one who never finished never learned that the
          statements came from anywhere at all.

          Uncovering it early spoils the exercise, and that is the learner's
          call to make — which is what a spoiler is for. */}
      <section className="border-border rounded-xl border p-4">
          <Spoiler
            title="Sources"
            hint="Which tab was which."
            label="Uncover the sources, and which company each tab was"
          >
            <ul className="space-y-3">
              {POLICY_SOURCES.map((c) => (
                <li key={c.id} className="text-sm leading-relaxed">
                  <p>
                    <span className="font-semibold">{c.label}</span>
                    {" — "}
                    {c.realName}
                  </p>
                  {c.realNote ? (
                    <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                      {c.realNote}
                    </p>
                  ) : null}
                  {/* Marked and indented explicitly. Left alone, the nested
                      list came out `list-style: circle` with no padding, so
                      every marker rendered outside its own content box —
                      hanging left into the card's padding, detached from the
                      line it belongs to. A marker either sits in the column
                      with its text or it is not a marker. */}
                  <ul className="marker:text-muted-foreground/70 mt-1 list-disc space-y-0.5 pl-4">
                    {c.cites.map((cite) => (
                      <li key={cite.href} className="text-xs">
                        <a
                          href={cite.href}
                          target="_blank"
                          rel="noopener"
                          className="text-muted-foreground underline-offset-4 hover:underline"
                        >
                          {cite.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
        </Spoiler>
      </section>
    </div>
  );
}

function CompanyTab({
  companyId,
  saved,
  persist,
}: {
  companyId: string;
  saved: Saved;
  persist: (next: Saved) => void;
}) {
  const company = POLICY_COMPANIES.find((c) => c.id === companyId)!;
  const shown = saved.committed.includes(company.id);
  const placed = company.statements.filter((s) => saved.marks[s.id]).length;
  const ready = placed === company.statements.length;

  /* No group headings and no kicker above the rows. Both were answering the
     question: "Published process" over a statement is the Published-rule chip
     spelled out, "Documented context" is Documented-prior-practice, and "Still
     unverified" is Not-established. The grouping survives as the order the
     rows come in — which is the only part of it that was not a key. */
  return (
    <>
      {POLICY_GROUPS.map((group) => {
        const rows = company.statements.filter((s) => s.group === group.id);
        if (!rows.length) return null;
        return (
          <section key={group.id} className="space-y-2">
            {rows.map((s) => {
              const mark = saved.marks[s.id];
              const right = mark === s.kind;
              return (
                <div
                  key={s.id}
                  className="border-border bg-card rounded-xl border p-4"
                >
                  <p className="text-sm leading-relaxed">{s.text}</p>

                  {shown ? (
                    <div className="mt-3 space-y-1.5">
                      <p
                        className={cn(
                          "flex items-center gap-1.5 text-xs tracking-wide",
                          right ? "text-comply" : "text-defect",
                        )}
                      >
                        {right ? (
                          <CircleCheck className="size-3.5 shrink-0" aria-hidden />
                        ) : (
                          <CircleAlert className="size-3.5 shrink-0" aria-hidden />
                        )}
                        {PROVENANCE.find((p) => p.id === s.kind)!.label}
                        {right
                          ? ""
                          : ` — you marked ${
                              PROVENANCE.find((p) => p.id === mark)?.label ??
                              "nothing"
                            }`}
                      </p>
                      {s.note ? (
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {s.note}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {PROVENANCE.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          aria-pressed={mark === p.id}
                          onClick={() =>
                            persist({
                              ...saved,
                              marks: { ...saved.marks, [s.id]: p.id },
                            })
                          }
                          className={cn(
                            "border-border rounded-lg border px-2.5 py-1 text-xs transition-colors",
                            mark === p.id
                              ? "border-primary bg-primary/10 font-medium"
                              : "hover:bg-muted",
                          )}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        );
      })}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs">
          {shown
            ? "Marked."
            : `${placed} of ${company.statements.length} marked on this tab.`}
        </p>
        {shown ? null : (
          <Button
            size="sm"
            disabled={!ready}
            onClick={() =>
              persist({ ...saved, committed: [...saved.committed, company.id] })
            }
          >
            Commit {company.label}
          </Button>
        )}
      </div>
    </>
  );
}

/**
 * The demands tab. Nothing to mark: the four are what was asked for, and the
 * question is what satisfying them would change. Committing needs an answer,
 * because the answer is the entire work of this tab.
 */
function DemandsTab({
  saved,
  persist,
}: {
  saved: Saved;
  persist: (next: Saved) => void;
}) {
  const shown = saved.committed.includes(POLICY_DEMANDS.id);
  const written = saved.demandAnswer.trim().length > 0;

  return (
    <>
      <ul className="space-y-2">
        {POLICY_DEMANDS.demands.map((d) => (
          <li
            key={d.id}
            className="border-border bg-card rounded-xl border p-4 text-sm leading-relaxed"
          >
            {d.text}
          </li>
        ))}
      </ul>

      <div className="space-y-2">
        <p className="text-sm font-medium">{POLICY_DEMANDS.question}</p>
        <Textarea
          rows={4}
          value={saved.demandAnswer}
          onChange={(e) => persist({ ...saved, demandAnswer: e.target.value })}
          placeholder="Who would have to know something they do not know now, and who would have to answer for it?"
          aria-label={POLICY_DEMANDS.question}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs">
          {shown
            ? "Answered."
            : ""}
        </p>
        {shown ? null : (
          <Button
            size="sm"
            disabled={!written}
            onClick={() =>
              persist({
                ...saved,
                committed: [...saved.committed, POLICY_DEMANDS.id],
              })
            }
          >
            Commit
          </Button>
        )}
      </div>
    </>
  );
}
