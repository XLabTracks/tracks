"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LC_INTEL_BLOCK,
  LC_MIN_ANSWER,
  LC_MIN_PUSHBACK,
  LC_PROMPTS,
  LC_RATE_ORDER,
  LC_ROWS,
  LC_SOURCE,
} from "@/lib/verification/data/locating-compute";
import type { VerificationWidgetProps } from "../kit/types";
import { readStored, writeStored } from "@/components/verification/kit/stored";

const STORAGE_KEY = "v-locating-compute:v1";

const RATES = LC_RATE_ORDER.filter((r) =>
  LC_ROWS.some((row) => row.feasibility === r),
);
const TIMES = [...new Set(LC_ROWS.map((row) => row.timeline))];
const DECKS = {
  intel: LC_ROWS.flatMap((row, i) => (row.block === LC_INTEL_BLOCK ? [i] : [])),
  full: LC_ROWS.map((_, i) => i),
};

interface LcAnswer {
  rate: string;
  time: string;
  promptKey: string;
  open: string;
  pushback: string;
  revealed: boolean;
  done: boolean;
}

interface Saved {
  deck: "intel" | "full" | null;
  answers: Record<number, LcAnswer>;
  synth: string;
}

const EMPTY: Saved = { deck: null, answers: {}, synth: "" };

const BLANK: LcAnswer = {
  rate: "",
  time: "",
  promptKey: "",
  open: "",
  pushback: "",
  revealed: false,
  done: false,
};

function prune(raw: unknown): Saved {
  const box = (typeof raw === "object" && raw !== null ? raw : {}) as Partial<Saved>;
  const answers: Saved["answers"] = {};
  for (const [k, v] of Object.entries(box.answers ?? {})) {
    const i = Number(k);
    const a = (typeof v === "object" && v !== null ? v : {}) as Partial<LcAnswer>;
    if (!Number.isInteger(i) || i < 0 || i >= LC_ROWS.length) continue;
    answers[i] = {
      rate: typeof a.rate === "string" ? a.rate : "",
      time: typeof a.time === "string" ? a.time : "",
      promptKey: typeof a.promptKey === "string" ? a.promptKey : "",
      open: typeof a.open === "string" ? a.open : "",
      pushback: typeof a.pushback === "string" ? a.pushback : "",
      revealed: a.revealed === true,
      done: a.done === true,
    };
  }
  return {
    deck: box.deck === "intel" || box.deck === "full" ? box.deck : null,
    answers,
    synth: typeof box.synth === "string" ? box.synth : "",
  };
}

export function LocatingCompute(_: VerificationWidgetProps) {
  const [saved, setSaved] = useState<Saved>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let restored = EMPTY;
    try {
      const raw = readStored(STORAGE_KEY);
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
      writeStored(STORAGE_KEY, JSON.stringify(next));
    } catch {
    }
  }, []);

  if (!hydrated) return <div className="not-prose my-6 min-h-64" aria-busy />;

  const deck = saved.deck ? DECKS[saved.deck] : null;
  const posOf = () =>
    deck ? deck.findIndex((gi) => !saved.answers[gi]?.done) : -1;

  const setDeck = (d: "intel" | "full" | null) => persist({ ...saved, deck: d });
  const update = (gi: number, patch: Partial<LcAnswer>) =>
    persist({
      ...saved,
      answers: {
        ...saved.answers,
        [gi]: { ...BLANK, ...saved.answers[gi], ...patch },
      },
    });

  if (!deck) {
    return (
      <div className="not-prose my-6 space-y-4">
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="eyebrow text-muted-foreground">Rate each mechanism before the authors&rsquo; rating is shown</p>
          <p className="mt-2 text-sm leading-relaxed">
            Each card is one building block for a single job: locating the
            world&rsquo;s AI compute, which is the first thing any verification
            regime has to do. For each card, record a feasibility rating and a
            timeline on the report&rsquo;s own scale, answer one short question
            that states your reasoning, and then see the authors&rsquo; rating.
            Where you differ, argue from the evidence.
          </p>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            The ratings come from{" "}
            <a
              className="text-brand-ink font-medium underline-offset-4 hover:underline"
              href={LC_SOURCE.url}
              target="_blank"
              rel="noreferrer"
            >
              {LC_SOURCE.by}
            </a>
            , who call them &ldquo;{LC_SOURCE.caveat}.&rdquo; Matching them is
            not the aim; a reasoned disagreement is worth more than agreement
            without reasons.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setDeck("intel")}>
              Intelligence deck: {DECKS.intel.length} cards, ~15 min
            </Button>
            <Button size="sm" variant="outline" onClick={() => setDeck("full")}>
              Full table: {DECKS.full.length} cards, optional
            </Button>
            {Object.keys(saved.answers).length > 0 ? (
              <Button size="sm" variant="outline" onClick={() => persist(EMPTY)}>
                Start over
              </Button>
            ) : null}
          </div>
          <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
            The intelligence deck covers this module&rsquo;s mechanisms: the
            eight a state can run without the other side&rsquo;s cooperation.
            The full table (hardware, inspections, export controls) is optional
            further practice and preparation for 4.1, where your Module 2
            ranking is unsealed.
          </p>
        </div>
      </div>
    );
  }

  const doneCount = deck.filter((gi) => saved.answers[gi]?.done).length;
  const pos = posOf();

  if (pos === -1) {
    let m = 0;
    let hi = 0;
    let lo = 0;
    const rows = deck.map((gi) => {
      const row = LC_ROWS[gi]!;
      const a = saved.answers[gi]!;
      let verdict: string;
      if (a.rate === row.feasibility) {
        m++;
        verdict = "match";
      } else if (RATES.indexOf(a.rate) < RATES.indexOf(row.feasibility)) {
        hi++;
        verdict = "you rated higher";
      } else {
        lo++;
        verdict = "you rated lower";
      }
      return { gi, row, a, verdict };
    });

    const exportText = () => {
      const lines = [
        `Locating-compute feasibility cards (${saved.deck === "intel" ? "intelligence deck" : "full table"})`,
        "",
      ];
      rows.forEach(({ row, a }, i) => {
        lines.push(`${i + 1}. ${row.mechanism} [${row.block}]`);
        lines.push(
          `   you: ${a.rate} / ${a.time} | report: ${row.feasibility} / ${row.timeline}`,
        );
        lines.push(`   ${a.promptKey}: ${a.open}`);
        if (a.pushback) lines.push(`   pushback: ${a.pushback}`);
        lines.push("");
      });
      lines.push(`Synthesis: ${saved.synth || "(not written)"}`);
      navigator.clipboard
        .writeText(lines.join("\n"))
        .then(() => setCopied(true))
        .catch(() => {});
    };

    return (
      <div className="not-prose my-6 space-y-4">
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="eyebrow text-muted-foreground">
            Your ratings against the report&rsquo;s
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[
              [m, "matches"],
              [hi, "you rated higher"],
              [lo, "you rated lower"],
            ].map(([n, label]) => (
              <div key={label} className="border-border rounded-lg border p-3">
                <p className="text-2xl font-semibold">{n}</p>
                <p className="text-muted-foreground text-xs">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-left text-xs">
                  <th className="py-1 pr-3 font-medium">Mechanism</th>
                  <th className="py-1 pr-3 font-medium">You</th>
                  <th className="py-1 pr-3 font-medium">Report</th>
                  <th className="py-1 font-medium">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ gi, row, a, verdict }) => (
                  <tr key={gi} className="border-border border-t">
                    <td className="py-1.5 pr-3">{row.mechanism}</td>
                    <td className="py-1.5 pr-3">{a.rate}</td>
                    <td className="py-1.5 pr-3">{row.feasibility}</td>
                    <td className="text-muted-foreground py-1.5 text-xs">
                      {verdict}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-sm font-medium">
            Synthesis. An emergency three-month pause starts in six months. Choose two building blocks to fund now
            and defend the choice in about three sentences. If you rated any
            block differently from the report, use at least one of those in
            your answer.
          </p>
          <textarea
            rows={4}
            value={saved.synth}
            onChange={(e) => persist({ ...saved, synth: e.target.value })}
            aria-label="Synthesis"
            className="border-border bg-background mt-2 w-full rounded-md border p-3 text-sm"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={exportText}>
              Copy all answers
            </Button>
            {saved.deck === "intel" ? (
              <Button size="sm" variant="outline" onClick={() => setDeck("full")}>
                Continue with the full table ({DECKS.full.length})
              </Button>
            ) : null}
            <Button size="sm" variant="outline" onClick={() => setDeck(null)}>
              Deck menu
            </Button>
            <span className="text-muted-foreground text-xs" aria-live="polite">
              {copied ? "Copied." : ""}
            </span>
          </div>
          <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
            These ratings are the authors&rsquo; preliminary estimates. Your
            sealed Module 2 ranking is unsealed in 4.1; this exercise is
            practice for that.
          </p>
        </div>
      </div>
    );
  }

  const gi = deck[pos]!;
  const row = LC_ROWS[gi]!;
  const a = saved.answers[gi];
  const prompt = LC_PROMPTS[pos % LC_PROMPTS.length]!;

  if (!a?.revealed) {
    const draft = a ?? BLANK;
    const lints: string[] = [];
    if (!draft.rate) lints.push("rating not set");
    if (!draft.time) lints.push("timeline not set");
    if (draft.open.trim().length < LC_MIN_ANSWER)
      lints.push(`answer under ${LC_MIN_ANSWER} characters; state the reasoning, not just a word`);

    return (
      <div className="not-prose my-6 space-y-4">
        <p className="text-muted-foreground text-xs" aria-live="polite">
          Card {pos + 1} of {deck.length} · {row.block} · {doneCount} committed
        </p>
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-sm font-semibold">{row.mechanism}</p>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {row.details}
          </p>
        </div>
        <div className="border-border rounded-xl border p-4">
          <p className="text-sm font-medium">Your feasibility</p>
          <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Your feasibility rating">
            {RATES.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={draft.rate === r}
                onClick={() => update(gi, { rate: r })}
                className={cn(
                  "border-border rounded-full border px-3 py-1.5 text-xs transition-colors",
                  draft.rate === r
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                {r}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm font-medium">Your timeline</p>
          <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Your timeline">
            {TIMES.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={draft.time === t}
                onClick={() => update(gi, { time: t })}
                className={cn(
                  "border-border rounded-full border px-3 py-1.5 text-xs transition-colors",
                  draft.time === t
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm">
            <span className="font-medium">{prompt.label}:</span> {prompt.q}
          </p>
          <textarea
            rows={3}
            value={draft.open}
            onChange={(e) => update(gi, { open: e.target.value })}
            placeholder="Your reasoning, in one or two sentences."
            aria-label={prompt.label}
            className="border-border bg-background mt-2 w-full rounded-md border p-3 text-sm"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button
              size="sm"
              disabled={lints.length > 0}
              onClick={() =>
                update(gi, {
                  promptKey: prompt.key,
                  open: draft.open.trim(),
                  revealed: true,
                })
              }
            >
              Commit and compare
            </Button>
            <p className="text-muted-foreground text-xs" aria-live="polite">
              {lints.length
                ? lints.join(" · ")
                : "A committed rating cannot be changed."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const match = a.rate === row.feasibility;
  const tMatch = a.time === row.timeline;
  const dir =
    RATES.indexOf(a.rate) < RATES.indexOf(row.feasibility) ? "higher" : "lower";
  const pushShort = !match && a.pushback.trim().length < LC_MIN_PUSHBACK;

  return (
    <div className="not-prose my-6 space-y-4">
      <p className="text-muted-foreground text-xs" aria-live="polite">
        Card {pos + 1} of {deck.length} · {row.block} · compare
      </p>
      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-sm font-semibold">{row.mechanism}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="border-border rounded-lg border p-3">
            <p className="eyebrow text-muted-foreground">You said</p>
            <p className="mt-1 text-sm font-medium">
              {a.rate} · {a.time}
            </p>
          </div>
          <div className="border-border rounded-lg border p-3">
            <p className="eyebrow text-muted-foreground">The report says</p>
            <p className="mt-1 text-sm font-medium">
              {row.feasibility} · {row.timeline}
            </p>
          </div>
        </div>
        <p className="mt-2 text-sm">
          Feasibility:{" "}
          {match ? "match" : `you rated ${dir} than the report`}. Timeline:{" "}
          {tMatch ? "match" : "differs"}.
        </p>
        {row.notes ? (
          <p className="border-border bg-muted/40 mt-3 rounded-lg border p-3 text-sm leading-relaxed">
            <span className="eyebrow text-muted-foreground mr-2">Their note</span>
            {row.notes}
          </p>
        ) : null}
        {row.prevWork ? (
          <p className="text-muted-foreground mt-2 text-xs">
            Previous work: {row.prevWork}
          </p>
        ) : null}
      </div>
      <div className="border-border rounded-xl border p-4">
        <p className="text-sm font-medium">
          {match
            ? "Optional: is there anything in their note you would still dispute?"
            : "You disagree, so argue the point: what is the weakest evidence in their note, or what have they missed? Their ratings are, in their own words, quick estimates."}
        </p>
        <textarea
          rows={3}
          value={a.pushback}
          onChange={(e) => update(gi, { pushback: e.target.value })}
          placeholder="One or two sentences."
          aria-label="Pushback"
          className="border-border bg-background mt-2 w-full rounded-md border p-3 text-sm"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            disabled={pushShort}
            onClick={() => update(gi, { pushback: a.pushback.trim(), done: true })}
          >
            Continue
          </Button>
          <p className="text-muted-foreground text-xs" aria-live="polite">
            {pushShort
              ? `A disagreement needs at least ${LC_MIN_PUSHBACK} characters of argument.`
              : match
                ? "Optional; Continue when ready."
                : "Ready."}
          </p>
        </div>
      </div>
    </div>
  );
}
