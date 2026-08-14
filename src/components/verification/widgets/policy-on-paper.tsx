"use client";

import { useCallback, useEffect, useState } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  POLICY_COMPANIES,
  POLICY_DEMANDS,
  POLICY_GROUPS,
  POLICY_NOTES_KEY,
  POLICY_QUESTIONS,
  POLICY_SOURCES,
  PROVENANCE,
  type Provenance,
} from "@/lib/verification/data/policy-on-paper";
import { QuestionWorkspace } from "../kit/question-workspace";
import type { VerificationWidgetProps } from "../kit/types";

/**
 * 2.4.4's optional extension: mark what kind of evidence each statement about
 * a reporting regime is, then read both regimes against what the employees
 * themselves demanded.
 *
 * OPTIONAL, so unbridged and outside the module's time: it records no
 * completion and adds nothing to progress. The section's finish event stays
 * "Audit the Verifier".
 *
 * The two companies are tabs and stay anonymous while the learner works —
 * that is the mechanic, not a concealment. The letters are cashed out at the
 * end, in the Sources spoiler, together with every document each row was read
 * out of; nothing above it carries a link, because a citation on tab A would
 * name the company while tab B was still meant to be judged blind.
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

export function PolicyOnPaper({}: VerificationWidgetProps) {
  const [saved, setSaved] = useState<Saved>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [tab, setTab] = useState(POLICY_COMPANIES[0]!.id);

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
      /* private mode / full quota — this is a convenience, not the record */
    }
  }, []);

  if (!hydrated) return <div className="not-prose my-6 min-h-64" aria-busy />;

  const company = POLICY_COMPANIES.find((c) => c.id === tab);
  const onDemands = tab === POLICY_DEMANDS.id;
  const done = TAB_IDS.every((id) => saved.committed.includes(id));

  return (
    <div className="not-prose my-6 space-y-4">
      {/* The analysis is the point of the block, so its two questions are on
          the page from the moment it opens — before the tabs, not behind
          them. Hiding them until every tab was committed meant a learner met
          them only after the marking had been sealed, with no way to re-read
          a row against the question. Answers save as you go. */}
      <QuestionWorkspace
        storageKey={POLICY_NOTES_KEY}
        rule={{ kind: "any", count: POLICY_QUESTIONS.length }}
        questions={POLICY_QUESTIONS}
        placeholder="Answer as you go — the tabs below are what you are answering from."
        intro={
          <p className="text-muted-foreground text-sm leading-relaxed">
            Write as you go. Nothing is graded.
          </p>
        }
        onComplete={() => {}}
      />

      {/* The marking instruction belongs here, immediately above the tabs it
          instructs — not stacked with the questions, where it read as a third
          paragraph of preamble before anything could be done. */}
      <p className="text-sm leading-relaxed">
        Now the material. Every statement has to answer one question before you
        can use it: what kind of thing is this?
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
                "rounded-full border px-4 py-1.5 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors",
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

      {/* The reveal, and the only place the letters are cashed out: who each
          one was, and every document its rows were read out of. It opens
          closed — the mapping is a spoiler for anyone who has not finished —
          and it carries the house's disclosure sign, the `+` that turns 45°
          into a `×`, the same one Works cited and Fold use. */}
      {done ? (
        <details className="border-border group rounded-xl border">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold select-none [&::-webkit-details-marker]:hidden">
            <span>Sources</span>
            <span
              aria-hidden
              className="text-muted-foreground text-2xl leading-none font-light transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
            >
              +
            </span>
          </summary>
          <div className="space-y-4 px-4 pb-4">
            <p className="text-muted-foreground text-xs leading-relaxed">
              Which tab was which, and everything its rows were read out of.
              Nothing above was written from memory.
            </p>
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
                  <ul className="mt-1 space-y-0.5">
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
          </div>
        </details>
      ) : null}
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

  return (
    <>
      <p className="text-muted-foreground text-sm">{company.kicker}</p>

      {POLICY_GROUPS.map((group) => {
        const rows = company.statements.filter((s) => s.group === group.id);
        if (!rows.length) return null;
        return (
          <section key={group.id} className="space-y-2">
            <h4 className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
              {group.label}
            </h4>
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
                          "flex items-center gap-1.5 font-mono text-xs tracking-wide",
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
                          title={p.hint}
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
            ? "Marked. Who this was, and what each row was read out of, opens under Sources once every tab is done."
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
      <p className="text-muted-foreground text-sm">{POLICY_DEMANDS.kicker}</p>

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
            ? "Answered. What this letter was, and who signed it, opens under Sources once every tab is done."
            : "Nothing here is graded — but the answer is the work of this tab."}
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
