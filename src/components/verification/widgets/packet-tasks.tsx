"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SourceQuote } from "@/components/mdx/reader/source-quote";
import type { VerificationWidgetProps } from "../kit/types";
import {
  BAKER,
  PACKET_TASKS,
  type PacketTask,
  type TaskPart,
} from "@/lib/verification/data/packet-tasks";
import type { DisanalysisQuote } from "@/lib/verification/data/nuclear-disanalysis";

/**
 * The 0.3 document packet's five tasks: write, submit, and the key reveals —
 * her model answer first, then Baker's own words on the same ground. Never
 * a marking.
 *
 * All five tasks are visible and independent; nothing locks behind anything,
 * per the standing instruction ("it's not a test, it's reasoning"). The one
 * commit that exists is per task and buys only that task's key: the key is
 * reveal material, so it stays unrendered until an answer is down — showing
 * a model answer beside an empty box turns a reasoning task into reading.
 * Submitting never freezes the answer; the box stays editable, and the word
 * ceiling is her guidance, counted live and never enforced.
 *
 * Task copy, model answers and Baker cuts live in `data/packet-tasks.ts` —
 * read its header before editing any of them; nothing here composes a
 * sentence of curriculum.
 *
 * Bridged: onComplete fires once, when her rule is met — Task 5 submitted
 * plus any two of Tasks 1–4.
 *
 * Answers persist under `v-packet-tasks:v1`; restored state is applied off
 * the effect body behind `hydrated` so the first client render matches the
 * server's markup, and stored answers are pruned against the current task
 * list before they are trusted.
 */

interface Answer {
  text: string;
  submitted: boolean;
}
type Answers = Record<string, Answer>;

const STORAGE_KEY = "v-packet-tasks:v1";

function prune(raw: unknown): Answers {
  const out: Answers = {};
  if (typeof raw !== "object" || raw === null) return out;
  for (const t of PACKET_TASKS) {
    const v = (raw as Record<string, unknown>)[t.id];
    if (typeof v !== "object" || v === null) continue;
    const { text, submitted } = v as { text?: unknown; submitted?: unknown };
    if (typeof text !== "string" || !text.trim()) continue;
    out[t.id] = { text, submitted: submitted === true };
  }
  return out;
}

function ruleMet(answers: Answers): boolean {
  const submitted = PACKET_TASKS.filter((t) => answers[t.id]?.submitted);
  return (
    submitted.some((t) => t.compulsory) &&
    submitted.filter((t) => !t.compulsory).length >= 2
  );
}

const wordCount = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

export function PacketTasks({ onComplete }: VerificationWidgetProps) {
  const [answers, setAnswers] = useState<Answers>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    let restored: Answers = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) restored = prune(JSON.parse(raw));
    } catch {
      /* unreadable storage just means starting fresh */
    }
    queueMicrotask(() => {
      setAnswers(restored);
      setDrafts(
        Object.fromEntries(Object.entries(restored).map(([id, a]) => [id, a.text])),
      );
      setNotified(ruleMet(restored));
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

  function submit(task: PacketTask) {
    const text = (drafts[task.id] ?? "").trim();
    if (!text) return;
    const next = { ...answers, [task.id]: { text, submitted: true } };
    persist(next);
    if (!notified && ruleMet(next)) {
      setNotified(true);
      onComplete();
    }
  }

  return (
    <div className="not-prose my-6 space-y-4" aria-busy={!hydrated}>
      {PACKET_TASKS.map((task) => {
        const submitted = hydrated && (answers[task.id]?.submitted ?? false);
        const words = wordCount(drafts[task.id] ?? "");
        return (
          <section
            key={task.id}
            className="border-border bg-card shadow-soft space-y-3 rounded-xl border p-5"
          >
            <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
              Task {task.n}
              {task.compulsory ? " · compulsory" : ""}
            </p>
            <h3 className="text-lg leading-snug font-semibold">{task.title}</h3>
            {task.parts.map((part, i) => (
              <Part key={i} part={part} />
            ))}

            <Textarea
              value={drafts[task.id] ?? ""}
              onChange={(e) =>
                setDrafts((d) => ({ ...d, [task.id]: e.target.value }))
              }
              placeholder="Write your answer, then submit to see what Baker says on the same ground."
              className="min-h-28"
              aria-label={`Answer to task ${task.n}`}
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Her ceiling is guidance: the count stays live and nothing is
                  ever blocked on it — over the limit is a fact, not a fault. */}
              <p
                className={cn(
                  "text-muted-foreground font-mono text-[11px] tracking-wide",
                  words > task.maxWords && "text-defect",
                )}
              >
                {words} / {task.maxWords} words
              </p>
              <Button
                size="sm"
                onClick={() => submit(task)}
                disabled={!hydrated || !(drafts[task.id] ?? "").trim()}
              >
                {submitted ? "Update answer" : "Submit"}
              </Button>
            </div>

            {submitted ? (
              <div aria-live="polite" className="space-y-3">
                <div className="border-border bg-background space-y-3 rounded-lg border p-4">
                  <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
                    Model answer
                  </p>
                  {task.answer.map((part, i) => (
                    <Part key={i} part={part} answer />
                  ))}
                </div>
                {task.baker.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
                      Baker reveal
                    </p>
                    {task.baker.map((quote) => (
                      <BakerQuote key={quote.what} quote={quote} />
                    ))}
                  </div>
                ) : null}
                {task.bakerNote ? (
                  <p className="text-sm leading-relaxed font-medium">{task.bakerNote}</p>
                ) : null}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

function Part({ part, answer = false }: { part: TaskPart; answer?: boolean }) {
  // Task bodies read as instructions (muted beside the heading); a model
  // answer is content and takes the page ink.
  const ink = answer ? "text-foreground" : "text-muted-foreground";
  if (part.kind === "p") {
    return <p className={cn("text-sm leading-relaxed", ink)}>{part.text}</p>;
  }
  if (part.kind === "h") {
    return <p className="pt-1 text-sm leading-snug font-semibold">{part.text}</p>;
  }
  if (part.kind === "quote") {
    return (
      <blockquote className="border-border border-l-2 pl-4 text-sm leading-relaxed italic">
        {part.text}
      </blockquote>
    );
  }
  if (part.kind === "table") {
    /* A wide table scrolls in its own box — the page never scrolls sideways. */
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm leading-relaxed">
          <thead>
            <tr>
              {part.head.map((h) => (
                <th
                  key={h}
                  className="border-border text-muted-foreground border-b py-1.5 pr-4 text-left font-mono text-[11px] tracking-[0.1em] uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {part.rows.map((row) => (
              <tr key={row[0]} className="border-border border-b last:border-b-0">
                {row.map((cell, i) => (
                  <td key={i} className={cn("py-2 pr-4 align-top", i === 0 && "font-medium")}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  const List = part.kind === "ol" ? "ol" : "ul";
  return (
    <List
      className={cn(
        "space-y-1 pl-5 text-sm leading-relaxed",
        part.kind === "ol" ? "list-decimal" : "list-disc",
      )}
    >
      {part.items.map((item) => (
        <li key={item} className={ink}>
          {item}
        </li>
      ))}
    </List>
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
