"use client";

import { useCallback, useEffect, useState } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  POLICY_COMPANIES,
  POLICY_GROUPS,
  POLICY_QUESTIONS,
  PROVENANCE,
  type Provenance,
} from "@/lib/verification/data/policy-on-paper";
import type { VerificationWidgetProps } from "../kit/types";

/**
 * 2.4.4's optional extension: mark what kind of evidence each statement is,
 * then say what the combination does to the people inside it.
 *
 * OPTIONAL, so unbridged and outside the module's time: it records no
 * completion and adds nothing to progress. The section's finish event stays
 * "Audit the Verifier".
 *
 * The three companies are tabs and stay anonymous while the learner works —
 * that is the mechanic, not a concealment. Committing a tab reveals, per
 * statement, the answer key and the document it was read out of, so anyone
 * can check the claim and see whose regime they just judged.
 *
 * Marking is per tab and commits per tab: the comparison she wants happens
 * between tabs, and a single commit across all three would make the third
 * tab's marks a formality once the pattern is visible.
 *
 * The two written answers are hers, verbatim, and are never graded — no
 * model, no key. They persist with the marks.
 */

interface Saved {
  marks: Record<string, Provenance>;
  committed: string[];
  answers: Record<number, string>;
}

const STORAGE_KEY = "v-policy-on-paper:v1";
const EMPTY: Saved = { marks: {}, committed: [], answers: {} };
const KINDS = new Set(PROVENANCE.map((p) => p.id));
const ALL = POLICY_COMPANIES.flatMap((c) => c.statements);

function prune(raw: unknown): Saved {
  const out: Saved = { marks: {}, committed: [], answers: {} };
  if (typeof raw !== "object" || raw === null) return out;
  const box = raw as Partial<Saved>;
  for (const s of ALL) {
    const v = box.marks?.[s.id];
    if (typeof v === "string" && KINDS.has(v as Provenance)) {
      out.marks[s.id] = v as Provenance;
    }
  }
  if (Array.isArray(box.committed)) {
    out.committed = box.committed.filter((id) =>
      POLICY_COMPANIES.some((c) => c.id === id),
    );
  }
  if (box.answers && typeof box.answers === "object") {
    POLICY_QUESTIONS.forEach((_, i) => {
      const v = (box.answers as Record<number, unknown>)[i];
      if (typeof v === "string") out.answers[i] = v;
    });
  }
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

  const company = POLICY_COMPANIES.find((c) => c.id === tab)!;
  const shown = saved.committed.includes(company.id);
  const placed = company.statements.filter((s) => saved.marks[s.id]).length;
  const ready = placed === company.statements.length;

  return (
    <div className="not-prose my-6 space-y-4">
      <div role="tablist" aria-label="Company" className="flex flex-wrap gap-2">
        {POLICY_COMPANIES.map((c) => {
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
                        {right ? "" : ` — you marked ${
                          PROVENANCE.find((p) => p.id === mark)?.label ?? "nothing"
                        }`}
                      </p>
                      {s.note ? (
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {s.note}
                        </p>
                      ) : null}
                      <p className="text-xs">
                        <a
                          href={s.cite.href}
                          target="_blank"
                          rel="noopener"
                          className="text-muted-foreground underline-offset-4 hover:underline"
                        >
                          — {s.cite.label}
                        </a>
                      </p>
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
            ? "Each row now carries what it was read out of."
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

      {/* Her two questions, once all three regimes are on the table: they are
          asked of the combination, so they open when the comparison exists. */}
      {saved.committed.length === POLICY_COMPANIES.length ? (
        <div className="border-border space-y-4 rounded-xl border p-4">
          {POLICY_QUESTIONS.map((q, i) => (
            <div key={q} className="space-y-2">
              <p className="text-sm font-medium">{q}</p>
              <Textarea
                rows={4}
                value={saved.answers[i] ?? ""}
                onChange={(e) =>
                  persist({
                    ...saved,
                    answers: { ...saved.answers, [i]: e.target.value },
                  })
                }
                aria-label={q}
              />
            </div>
          ))}
          <p className="text-muted-foreground text-xs">
            Nothing here is graded. These are the two questions the section
            leaves you with.
          </p>
        </div>
      ) : null}
    </div>
  );
}
