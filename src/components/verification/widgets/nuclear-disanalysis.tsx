"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SourceQuote } from "@/components/mdx/reader/source-quote";
import type { VerificationWidgetProps } from "../kit/types";
import {
  BAKER,
  MOVES,
  READING_MAP,
  TASK,
  type DisanalysisMove,
} from "@/lib/verification/data/nuclear-disanalysis";

/**
 * 0.3's disanalysis task — write the inference yourself, then read Baker's.
 *
 * The interaction is the house one: commit, reveal, Continue, never
 * auto-advance. What is different here, and why this is not a drill bench, is
 * the reveal — the key is another author's argument, so it is reproduced
 * through `SourceQuote` with the section it came from and a link out, rather
 * than flattened into a sentence of ours. The drill kit's reveal is one
 * paragraph of our prose, which is right for a drill and wrong for this.
 *
 * Nothing here marks an answer. The reveal is the passage that bears on the
 * move; on the two moves the paper does not settle, it says so (`caveat`) in
 * place of a verdict. The prompts and the keys both live in
 * `data/nuclear-disanalysis.ts` — read its header before editing either.
 *
 * Bridged: `onComplete()` fires once, when the last move is committed.
 *
 * Answers persist under `v-nuclear-disanalysis:v1`; restored work is applied
 * off the effect body behind `hydrated`, so the first client render still
 * matches the server's empty markup, and stored keys are pruned against the
 * current move list before they are trusted.
 */

type Answers = Record<string, string>;

const STORAGE_KEY = "v-nuclear-disanalysis:v1";

function pruneAnswers(raw: unknown): Answers {
  const out: Answers = {};
  if (typeof raw !== "object" || raw === null) return out;
  for (const move of MOVES) {
    const v = (raw as Record<string, unknown>)[move.id];
    if (typeof v === "string" && v.trim()) out[move.id] = v;
  }
  return out;
}

export function NuclearDisanalysis({ onComplete }: VerificationWidgetProps) {
  const [answers, setAnswers] = useState<Answers>({});
  const [hydrated, setHydrated] = useState(false);
  // Index of the move on screen; null = the summary. Seeded after hydration.
  const [pos, setPos] = useState<number | null>(0);
  // Draft for the move on screen, and whether its reveal is open.
  const [draft, setDraft] = useState("");
  const [reading, setReading] = useState(false);
  const [resetArmed, setResetArmed] = useState(false);

  useEffect(() => {
    let restored: Answers = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) restored = pruneAnswers(JSON.parse(raw));
    } catch {
      /* unreadable storage just means starting fresh */
    }
    queueMicrotask(() => {
      setAnswers(restored);
      const firstOpen = MOVES.findIndex((m) => !restored[m.id]);
      setPos(firstOpen < 0 ? null : firstOpen);
      setHydrated(true);
    });
  }, []);

  const persist = useCallback((next: Answers) => {
    setAnswers(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* private mode / full quota — progress is a convenience, not the record */
    }
  }, []);

  if (!hydrated) return <Shell aria-busy="true" />;

  if (pos === null) {
    return (
      <Shell>
        <Task />
        <Summary answers={answers} />
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!resetArmed) {
                setResetArmed(true);
                return;
              }
              setResetArmed(false);
              persist({});
              setDraft("");
              setReading(false);
              setPos(0);
            }}
          >
            <RotateCcw className="size-3.5" aria-hidden />
            {resetArmed ? "Sure? this clears all four" : "Start again"}
          </Button>
        </div>
      </Shell>
    );
  }

  const move = MOVES[pos]!;
  const committed = answers[move.id] ?? null;
  const open = reading || committed !== null;
  const text = committed ?? draft;
  const short = draft.trim().length < move.minLen;

  function commit() {
    const next = { ...answers, [move.id]: draft.trim() };
    persist(next);
    setReading(true);
    if (MOVES.every((m) => next[m.id])) onComplete();
  }

  function advance() {
    setReading(false);
    setDraft("");
    const nextOpen = MOVES.findIndex((m) => !answers[m.id] && m.id !== move.id);
    setPos(nextOpen < 0 ? null : nextOpen);
  }

  return (
    <Shell>
      <Task />

      <ol className="text-muted-foreground flex flex-wrap gap-2 font-mono text-[11px] tracking-[0.14em] uppercase">
        {MOVES.map((m, i) => (
          <li
            key={m.id}
            aria-current={i === pos ? "step" : undefined}
            className={
              i === pos
                ? "text-foreground font-semibold"
                : answers[m.id]
                  ? "text-foreground/60"
                  : ""
            }
          >
            {answers[m.id] ? "✓" : ""} Move {m.n}
          </li>
        ))}
      </ol>

      <section className="border-border bg-card space-y-4 rounded-xl border p-5">
        <div className="space-y-1.5">
          <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
            Move {move.n} of {MOVES.length}
          </p>
          <p className="leading-relaxed font-medium">{move.q}</p>
          {move.hint ? (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {move.hint}
            </p>
          ) : null}
        </div>

        <Textarea
          value={text}
          readOnly={open}
          rows={7}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write it out. Nothing below opens until you have."
          aria-label={`Your answer to move ${move.n}`}
        />

        {open ? (
          <Key move={move} onAdvance={advance} last={pos === MOVES.length - 1} />
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs">
              {short
                ? `${draft.trim().length} / ${move.minLen} characters — the commit is the exercise.`
                : "Committing opens Baker's own version. You cannot go back and edit it."}
            </p>
            <Button size="sm" disabled={short} onClick={commit}>
              Commit
            </Button>
          </div>
        )}
      </section>
    </Shell>
  );
}

/** Her task, printed whole. The moves below are its own sentences. */
function Task() {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{TASK.title}</h3>
      <p className="leading-relaxed">{TASK.preamble}</p>
      <p className="text-muted-foreground text-sm">{TASK.claimLead}</p>
      <p className="border-border border-l-2 pl-4 leading-relaxed italic">
        {TASK.claim}
      </p>
    </div>
  );
}

/** The reveal: the passages that bear on this move, in Baker's words. */
function Key({
  move,
  onAdvance,
  last,
}: {
  move: DisanalysisMove;
  onAdvance: () => void;
  last: boolean;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed">{move.lead}</p>

      {move.quotes.map((quote) => (
        <SourceQuote
          key={quote.what}
          t={BAKER.title}
          url={BAKER.href}
          what={quote.what}
          by={`${BAKER.author}, ${BAKER.year} · ${BAKER.licence}`}
        >
          <div className="space-y-4">
            {quote.blocks.map((block, i) => (
              <div key={block.label ?? i} className="space-y-1.5">
                {/* Ours, not his — set in our own voice so a label can never
                    be read as part of the passage under it. */}
                {block.label ? (
                  <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase not-italic">
                    {block.label}
                  </p>
                ) : null}
                {/* His sentence, so it is set as prose. The label style above
                    uppercases, which is fine on ours and is editing on his. */}
                {block.lead ? <p>{block.lead}</p> : null}
                {block.text ? <p>{block.text}</p> : null}
                {block.points ? (
                  <dl className="space-y-2">
                    {block.points.map((point) => (
                      <div key={point.term}>
                        <dt className="font-medium">{point.term}</dt>
                        <dd className="text-muted-foreground">{point.text}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
            ))}
          </div>
        </SourceQuote>
      ))}

      {move.caveat ? (
        <p className="border-border bg-muted/40 rounded-lg border p-3 text-sm leading-relaxed">
          {move.caveat}
        </p>
      ) : null}

      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={onAdvance}>
          {last ? "Finish" : "Continue"}
          <ArrowRight className="size-3.5" aria-hidden />
        </Button>
      </div>
    </div>
  );
}

/** After all four: what you wrote, and the eight pages to read against it. */
function Summary({ answers }: { answers: Answers }) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {MOVES.map((move) => (
          <details
            key={move.id}
            className="border-border bg-card rounded-xl border p-4"
          >
            <summary className="cursor-pointer text-sm font-medium">
              Move {move.n} — {move.q}
            </summary>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed whitespace-pre-wrap">
              {answers[move.id]}
            </p>
          </details>
        ))}
      </div>

      <div className="border-border bg-card space-y-3 rounded-xl border p-5">
        <h4 className="font-semibold">Now read the paper — eight pages of it</h4>
        <p className="text-muted-foreground text-sm leading-relaxed">
          You have made the argument. These are the pages that answer back, and
          why each one is here.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
              <tr>
                <th scope="col" className="py-1 pr-4 font-normal">Where</th>
                <th scope="col" className="py-1 pr-4 font-normal">What</th>
                <th scope="col" className="py-1 font-normal">Why here</th>
              </tr>
            </thead>
            <tbody>
              {READING_MAP.map((row) => (
                <tr key={row.where} className="border-border/60 border-t align-top">
                  <td className="py-2 pr-4 whitespace-nowrap">{row.where}</td>
                  <td className="py-2 pr-4">{row.what}</td>
                  <td className="text-muted-foreground py-2">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm">
          <a
            href={BAKER.href}
            target="_blank"
            rel="noopener"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            {BAKER.title}
          </a>{" "}
          <span className="text-muted-foreground">
            — {BAKER.author}, {BAKER.year} · {BAKER.licence}
          </span>
        </p>
      </div>
    </div>
  );
}

function Shell({
  children,
  ...rest
}: {
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="not-prose space-y-4" {...rest}>
      {children}
    </div>
  );
}
