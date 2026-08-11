"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SourceQuote } from "@/components/mdx/reader/source-quote";
import type { VerificationWidgetProps } from "../kit/types";
import {
  BAKER,
  CLAIM,
  DEALT_CARD,
  QUESTIONS,
  READ_NOTE,
  READING_MAP,
  type DisanalysisQuestion,
  type DisanalysisQuote,
} from "@/lib/verification/data/nuclear-disanalysis";

/**
 * 0.3's disanalysis task, in the shape the design thread specifies: argue the
 * inference before Baker, read him, then find out whether the argument
 * survives a fact you did not have when you made it.
 *
 * The read is a STEP, not a footnote. Question 1 is committed before the paper
 * opens and cannot be edited afterwards — the whole exercise is that Questions
 * 2 and 3 are answered against an argument you are already on the record for.
 * Question 3 prints Question 1's answer back for the same reason ("Return to
 * the argument you made in Question 1").
 *
 * Nothing is marked. Each reveal reproduces the passage that bears on the
 * question through `SourceQuote`, so attribution and licence sit above the
 * words, and where the paper does not settle the question the reveal says so
 * rather than issuing a verdict. Prompts, keys and the disanalogy card all
 * live in `data/nuclear-disanalysis.ts` — read its header before editing any
 * of them, especially the card, which fills a slot she left open.
 *
 * Bridged: `onComplete()` fires once, when Question 3 is committed.
 *
 * Work persists under `v-nuclear-disanalysis:v1`; restored state is applied
 * off the effect body behind `hydrated`, so the first client render still
 * matches the server's empty markup, and anything stored is pruned against the
 * current questions before it is trusted.
 */

interface Answer {
  text: string;
  pick?: string;
}
interface Saved {
  answers: Record<string, Answer>;
  /** Whether the learner has passed the read step between Q1 and Q2. */
  read: boolean;
}

const STORAGE_KEY = "v-nuclear-disanalysis:v1";
const EMPTY: Saved = { answers: {}, read: false };

function prune(raw: unknown): Saved {
  const out: Saved = { answers: {}, read: false };
  if (typeof raw !== "object" || raw === null) return out;
  const box = raw as { answers?: unknown; read?: unknown };
  out.read = box.read === true;
  const answers = box.answers;
  if (typeof answers !== "object" || answers === null) return out;
  for (const q of QUESTIONS) {
    const v = (answers as Record<string, unknown>)[q.id];
    if (typeof v !== "object" || v === null) continue;
    const { text, pick } = v as { text?: unknown; pick?: unknown };
    if (typeof text !== "string" || !text.trim()) continue;
    const valid =
      typeof pick === "string" && q.choice?.options.some((o) => o.id === pick);
    out.answers[q.id] = valid ? { text, pick: pick as string } : { text };
  }
  return out;
}

type Phase = "question" | "read" | "done";

export function NuclearDisanalysis({ onComplete }: VerificationWidgetProps) {
  const [saved, setSaved] = useState<Saved>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [draft, setDraft] = useState("");
  const [pick, setPick] = useState<string | null>(null);
  // The question whose reveal is open, still being read.
  const [reading, setReading] = useState<string | null>(null);
  const [resetArmed, setResetArmed] = useState(false);

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
      /* private mode / full quota — progress is a convenience, not the record */
    }
  }, []);

  if (!hydrated) return <Shell aria-busy="true" />;

  const { answers, read } = saved;
  const open = QUESTIONS.find((q) => !answers[q.id]);
  // Her ordering: Q1, then the paper, then Q2 and Q3 against it.
  const phase: Phase =
    reading !== null || (open && (open.n === 1 || read))
      ? "question"
      : !read
        ? "read"
        : "done";

  if (phase === "read") {
    return (
      <Shell>
        <Claim />
        <Rail answers={answers} read={read} />
        <ReadStep onDone={() => persist({ ...saved, read: true })} />
      </Shell>
    );
  }

  // `reading` outranks everything: the last question's reveal has to be read
  // before the summary replaces it, and that question is by then answered —
  // so an "all answered → summary" test on its own skips the reveal entirely.
  if (reading === null && (phase === "done" || !open)) {
    return (
      <Shell>
        <Claim />
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
              persist(EMPTY);
              setDraft("");
              setPick(null);
              setReading(null);
            }}
          >
            <RotateCcw className="size-3.5" aria-hidden />
            {resetArmed ? "Sure? this clears all three" : "Start again"}
          </Button>
        </div>
      </Shell>
    );
  }

  // Non-null holds: the branch above returned unless `reading` names a
  // question or `open` is one.
  const q = (reading ? QUESTIONS.find((x) => x.id === reading) : open)!;
  const committed = answers[q.id] ?? null;
  const showing = committed !== null;
  const text = committed?.text ?? draft;
  const short = draft.trim().length < q.minLen;
  const needsPick = !!q.choice && pick === null;

  function commit() {
    const answer: Answer = { text: draft.trim(), ...(pick ? { pick } : {}) };
    const next: Saved = {
      ...saved,
      answers: { ...answers, [q.id]: answer },
    };
    persist(next);
    // Q1 has no reveal — its key is the paper, and the paper is next.
    if (q.reveal) setReading(q.id);
    if (QUESTIONS.every((x) => next.answers[x.id])) onComplete();
  }

  function advance() {
    setReading(null);
    setDraft("");
    setPick(null);
  }

  const chosen = q.choice?.options.find((o) => o.id === (committed?.pick ?? pick));

  return (
    <Shell>
      <Claim />
      <Rail answers={answers} read={read} current={q.id} />

      <section className="border-border bg-card space-y-4 rounded-xl border p-5">
        <div className="space-y-2">
          <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
            {q.n === 1 ? "Before Baker" : "After Baker"} · Question {q.n}
          </p>
          <h4 className="text-lg font-semibold">
            {q.n}. {q.title}
          </h4>
          {q.n === 1 ? (
            <p className="leading-relaxed">{CLAIM.preamble}</p>
          ) : null}
          <p className="leading-relaxed font-medium">{q.ask}</p>
          {q.body.map((para) => (
            <p key={para} className="text-muted-foreground leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {/* Her Q3 deals a fact before the question can be answered. */}
        {q.n === 3 ? <Card /> : null}

        {q.showsFirstAnswer && answers.q1 ? (
          <div className="border-border bg-muted/40 rounded-lg border p-3">
            <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
              Your Question 1 argument
            </p>
            <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-wrap">
              {answers.q1.text}
            </p>
          </div>
        ) : null}

        {q.choice ? (
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">{q.choice.prompt}</legend>
            <div className="flex flex-wrap gap-2">
              {q.choice.options.map((option) => {
                const active = (committed?.pick ?? pick) === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={showing}
                    aria-pressed={active}
                    onClick={() => setPick(option.id)}
                    className={cn(
                      "border-border rounded-lg border px-3 py-1.5 text-left text-sm transition-colors",
                      active
                        ? "border-primary bg-primary/10 font-medium"
                        : "hover:bg-muted",
                      showing && !active && "opacity-50",
                    )}
                  >
                    {option.label}
                    {option.hint ? (
                      <span className="text-muted-foreground block text-xs">
                        {option.hint}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ) : null}

        <Textarea
          value={text}
          readOnly={showing}
          rows={8}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={
            q.n === 1
              ? "Argue it out. You commit this before the paper opens, and you do not get to edit it afterwards."
              : "Write it out."
          }
          aria-label={`Your answer to question ${q.n}`}
        />

        {showing ? (
          <Answered q={q} chosenLabel={chosen?.label} onAdvance={advance} />
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs">
              {needsPick
                ? "Commit to one of the options above first."
                : short
                  ? `${draft.trim().length} / ${q.minLen} characters — the commit is the exercise.`
                  : q.n === 1
                    ? "Committing opens the paper. You cannot come back and edit this."
                    : "Committing opens what Baker says about it."}
            </p>
            <Button size="sm" disabled={short || needsPick} onClick={commit}>
              Commit
            </Button>
          </div>
        )}
      </section>
    </Shell>
  );
}

/** The claim under examination, kept on screen throughout. */
function Claim() {
  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-sm">{CLAIM.lead}</p>
      <p className="border-border border-l-2 pl-4 leading-relaxed italic">
        {CLAIM.text}
      </p>
    </div>
  );
}

function Rail({
  answers,
  read,
  current,
}: {
  answers: Record<string, Answer>;
  read: boolean;
  current?: string;
}) {
  const steps = [
    { key: "q1", label: "1 Draw", done: !!answers.q1 },
    { key: "read", label: "Read Baker", done: read },
    { key: "q2", label: "2 Compare", done: !!answers.q2 },
    { key: "q3", label: "3 Survive?", done: !!answers.q3 },
  ];
  return (
    <ol className="text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.14em] uppercase">
      {steps.map((s) => (
        <li
          key={s.key}
          aria-current={s.key === current ? "step" : undefined}
          className={
            s.key === current
              ? "text-foreground font-semibold"
              : s.done
                ? "text-foreground/60"
                : ""
          }
        >
          {s.done ? "✓ " : ""}
          {s.label}
        </li>
      ))}
    </ol>
  );
}

/** Her Read step: what Baker concluded, and the eight pages to read. */
function ReadStep({ onDone }: { onDone: () => void }) {
  return (
    <section className="border-border bg-card space-y-4 rounded-xl border p-5">
      <div className="space-y-2">
        <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
          Read
        </p>
        <h4 className="text-lg font-semibold">
          <a
            href={BAKER.href}
            target="_blank"
            rel="noopener"
            className="text-primary underline-offset-4 hover:underline"
          >
            {BAKER.title}
          </a>
        </h4>
        <p className="text-muted-foreground text-sm">
          {BAKER.author}, {BAKER.year} · {BAKER.licence}
        </p>
        <p className="leading-relaxed">{READ_NOTE}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="text-muted-foreground pb-2 text-left text-sm">
            Eight pages of forty-four, and why each one is here.
          </caption>
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

      <div className="flex justify-end">
        <Button size="sm" onClick={onDone}>
          I have read it
          <ArrowRight className="size-3.5" aria-hidden />
        </Button>
      </div>
    </section>
  );
}

/** Q3's dealt fact. Baker's words; which candidate is dealt is data. */
function Card() {
  return (
    // Hairline on all four sides; the accent is the chip inside, not a tint
    // on the border. A card with one hue on its edge and nothing else is the
    // thing the house rule forbids.
    <div className="border-border bg-card rounded-xl border p-4">
      <p className="text-primary font-mono text-[11px] tracking-[0.14em] uppercase">
        Disanalogy card
      </p>
      <p className="mt-1.5 font-medium">{DEALT_CARD.label}</p>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        “{DEALT_CARD.text}”
      </p>
      <p className="text-muted-foreground mt-2 text-xs">
        {BAKER.author}, {BAKER.year} — {DEALT_CARD.what}
      </p>
    </div>
  );
}

/** What opens once a question is committed. */
function Answered({
  q,
  chosenLabel,
  onAdvance,
}: {
  q: DisanalysisQuestion;
  chosenLabel?: string;
  onAdvance: () => void;
}) {
  return (
    <div className="space-y-3">
      {chosenLabel ? (
        <p className="text-muted-foreground text-sm">
          You committed to: <span className="text-foreground">{chosenLabel}</span>
        </p>
      ) : null}
      {q.revealLead ? (
        <p className="text-sm leading-relaxed">{q.revealLead}</p>
      ) : null}
      {q.reveal?.map((quote) => <Quote key={quote.what} quote={quote} />)}
      {q.caveat ? (
        <p className="border-border bg-muted/40 rounded-lg border p-3 text-sm leading-relaxed">
          {q.caveat}
        </p>
      ) : null}
      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={onAdvance}>
          {q.n === 3 ? "Finish" : "Continue"}
          <ArrowRight className="size-3.5" aria-hidden />
        </Button>
      </div>
    </div>
  );
}

function Quote({ quote }: { quote: DisanalysisQuote }) {
  return (
    <SourceQuote
      t={BAKER.title}
      url={BAKER.href}
      what={quote.what}
      by={`${BAKER.author}, ${BAKER.year} · ${BAKER.licence}`}
    >
      <div className="space-y-4">
        {quote.blocks.map((block, i) => (
          <div key={block.label ?? block.lead ?? i} className="space-y-1.5">
            {/* Ours, set in our own voice so it can never be read as his. */}
            {block.label ? (
              <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase not-italic">
                {block.label}
              </p>
            ) : null}
            {/* His sentence, so it is set as prose — the label style above
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
  );
}

function Summary({ answers }: { answers: Record<string, Answer> }) {
  return (
    <div className="space-y-3">
      {QUESTIONS.map((q) => {
        const answer = answers[q.id];
        const chosen = q.choice?.options.find((o) => o.id === answer?.pick);
        return (
          <details
            key={q.id}
            className="border-border bg-card rounded-xl border p-4"
          >
            <summary className="cursor-pointer text-sm font-medium">
              {q.n}. {q.title}
              {chosen ? (
                <span className="text-muted-foreground font-normal">
                  {" "}
                  — {chosen.label}
                </span>
              ) : null}
            </summary>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed whitespace-pre-wrap">
              {answer?.text}
            </p>
          </details>
        );
      })}
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
