"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  CircleAlert,
  CircleCheck,
  CircleDot,
  Flag,
  RotateCcw,
} from "lucide-react";
import { shuffleAnswerOptions } from "@/lib/shuffle";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  DrillBench,
  DrillDeck,
  DrillMultiStep,
  DrillNumberStep,
  DrillPickStep,
  DrillStep,
  DrillTextStep,
} from "@/lib/verification/data/drills";
import {
  benchComplete,
  benchDone,
  checkNumber,
  deckComplete,
  firstOpenStep,
  lintText,
  markStepDone,
  multiCommitState,
  nextOpenBench,
  pruneProgress,
  scoreMulti,
  type DrillProgress,
  type MarkVerdict,
} from "@/lib/verification/engines/drills";
import type { VerificationWidgetProps } from "./types";
import { SegMeter } from "./seg-meter";

export function DrillDeckView({
  deck,
  onComplete,
}: VerificationWidgetProps & { deck: DrillDeck }) {
  const storageKey = `v-drills:${deck.id}:v1`;

  const [progress, setProgress] = useState<DrillProgress>({});
  const [hydrated, setHydrated] = useState(false);
  const [benchId, setBenchId] = useState<string | null>(null);
  const [pos, setPos] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [resetArmed, setResetArmed] = useState(false);

  useEffect(() => {
    let restored: DrillProgress = {};
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) restored = pruneProgress(JSON.parse(raw) as DrillProgress, deck);
    } catch {
    }
    queueMicrotask(() => {
      setProgress(restored);
      setHydrated(true);
    });
  }, [storageKey, deck]);

  const persist = useCallback(
    (next: DrillProgress) => {
      setProgress(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
      }
    },
    [storageKey],
  );

  const bench = useMemo(
    () => deck.benches.find((b) => b.id === benchId) ?? null,
    [deck, benchId],
  );

  const openBench = useCallback(
    (b: DrillBench) => {
      setBenchId(b.id);
      setPos(firstOpenStep(progress, b));
    },
    [progress],
  );

  function commitStep() {
    if (!bench) return;
    const next = markStepDone(progress, bench.id, pos);
    persist(next);
    setPos(pos + 1);
    if (!completed && deckComplete(next, deck)) {
      setCompleted(true);
      onComplete();
    }
  }

  if (!bench) {
    return (
      <DeckMenu
        deck={deck}
        progress={progress}
        hydrated={hydrated}
        resetArmed={resetArmed}
        onOpen={openBench}
        onReset={() => {
          if (!resetArmed) {
            setResetArmed(true);
            return;
          }
          setResetArmed(false);
          persist({});
        }}
      />
    );
  }

  if (pos >= bench.steps.length) {
    return (
      <BenchFinish
        deck={deck}
        bench={bench}
        progress={progress}
        onOpen={openBench}
        onMenu={() => setBenchId(null)}
        onRedo={() => {
          persist({ ...progress, [bench.id]: [] });
          setPos(0);
        }}
      />
    );
  }

  return (
    <StepScreen
      key={`${bench.id}:${pos}`}
      deck={deck}
      bench={bench}
      pos={pos}
      onCommit={commitStep}
      onMenu={() => setBenchId(null)}
    />
  );
}

function DeckMenu({
  deck,
  progress,
  hydrated,
  resetArmed,
  onOpen,
  onReset,
}: {
  deck: DrillDeck;
  progress: DrillProgress;
  hydrated: boolean;
  resetArmed: boolean;
  onOpen: (b: DrillBench) => void;
  onReset: () => void;
}) {
  const started = hydrated && Object.keys(progress).length > 0;
  return (
    <Shell>
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{deck.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {deck.blurb}
          </p>
        </div>
        <p className="text-muted-foreground text-sm">
          Commit before every reveal — the commit is the exercise. Nothing here
          is graded.
        </p>
        <ul className="space-y-2">
          {deck.benches.map((b) => {
            const done = hydrated ? benchDone(progress, b) : 0;
            const finished = hydrated && benchComplete(progress, b);
            return (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => onOpen(b)}
                  className="border-border hover:bg-muted/60 focus-visible:ring-ring w-full cursor-pointer rounded-lg border p-3 text-left transition-colors select-none focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{b.name}</span>
                    {finished ? (
                      <span className="text-comply inline-flex items-center gap-1 text-3xs">
                        <CircleCheck className="size-3.5" aria-hidden /> complete
                      </span>
                    ) : null}
                  </span>
                  <span className="text-muted-foreground mt-1 block text-sm">
                    {b.kicker}
                  </span>
                  <span className="text-muted-foreground mt-1.5 block text-3xs tracking-wide">
                    {b.time} · {done} / {b.steps.length}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {started ? (
          <Button variant="outline" size="sm" onClick={onReset} className="gap-2">
            <RotateCcw className="size-4" aria-hidden />
            {resetArmed ? "Sure? Tap again" : "Reset this deck"}
          </Button>
        ) : null}
      </div>
    </Shell>
  );
}

function StepScreen({
  deck,
  bench,
  pos,
  onCommit,
  onMenu,
}: {
  deck: DrillDeck;
  bench: DrillBench;
  pos: number;
  onCommit: () => void;
  onMenu: () => void;
}) {
  const step = bench.steps[pos]!;
  const last = pos + 1 >= bench.steps.length;
  return (
    <Shell>
      <div className="space-y-4">
        <StepHeader
          bench={bench}
          pos={pos}
          multiBench={deck.benches.length > 1}
          onMenu={onMenu}
        />
        <h3 className="text-lg leading-snug font-semibold">{step.q}</h3>
        <StepBrief step={step} />
        {step.type === "pick" ? (
          <PickStep
            step={step}
            seed={`${bench.id}#${pos}`}
            last={last}
            onCommit={onCommit}
          />
        ) : step.type === "multi" ? (
          <MultiStep
            step={step}
            seed={`${bench.id}#${pos}`}
            last={last}
            onCommit={onCommit}
          />
        ) : step.type === "number" ? (
          <NumberStep step={step} last={last} onCommit={onCommit} />
        ) : (
          <TextStep step={step} last={last} onCommit={onCommit} />
        )}
      </div>
    </Shell>
  );
}

function StepHeader({
  bench,
  pos,
  multiBench,
  onMenu,
}: {
  bench: DrillBench;
  pos: number;
  multiBench: boolean;
  onMenu: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted-foreground eyebrow">
          {bench.name} · {pos + 1} / {bench.steps.length}
        </p>
        {multiBench ? (
          <Button variant="ghost" size="sm" onClick={onMenu}>
            All benches
          </Button>
        ) : null}
      </div>
      <SegMeter
        total={bench.steps.length}
        filled={(i) => i < pos}
        label={`Step ${pos + 1} of ${bench.steps.length}`}
        className="max-w-44"
      />
    </div>
  );
}

function StepBrief({ step }: { step: DrillStep }) {
  return (
    <>
      {step.brief ? (
        <p className="border-border bg-muted/40 rounded-lg border p-3 text-sm leading-relaxed">
          {step.brief}
        </p>
      ) : null}
      {step.table ? (
        <div className="border-border overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/60">
              <tr>
                {step.table.cols.map((c) => (
                  <th
                    key={c}
                    scope="col"
                    className="eyebrow px-3 py-2"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {step.table.rows.map((row, i) => (
                <tr key={i} className="border-border border-t">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2 text-xs">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {step.statement ? (
        <blockquote className="border-border bg-background rounded-lg border p-3 text-sm leading-relaxed italic">
          {step.statement}
        </blockquote>
      ) : null}
    </>
  );
}

function PickStep({
  step,
  seed,
  last,
  onCommit,
}: {
  step: DrillPickStep;
  seed: string;
  last: boolean;
  onCommit: () => void;
}) {
  const [choice, setChoice] = useState<number | null>(null);
  const shown = useMemo(
    () =>
      step.fixedOrder
        ? step.opts.map((item, from) => ({ item, from }))
        : shuffleAnswerOptions(seed, step.opts, (o) => o),
    [step, seed],
  );
  const answered = choice !== null;
  const right = choice === step.right;
  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {shown.map(({ item: opt, from }) => {
          const isKey = from === step.right;
          const picked = choice === from;
          return (
            <li key={from}>
              <button
                type="button"
                disabled={answered}
                aria-pressed={picked}
                onClick={() => setChoice(from)}
                className={cn(
                  "w-full rounded-lg border p-3 text-left text-sm leading-relaxed transition-colors select-none",
                  !answered &&
                    "border-border hover:bg-muted/60 cursor-pointer focus-visible:ring-2 focus-visible:outline-none",
                  answered && !isKey && !picked && "border-border opacity-60",
                  answered && isKey && "border-comply bg-comply/5",
                  answered && picked && !isKey && "border-defect bg-defect/5",
                )}
              >
                <span className="flex items-start gap-2">
                  {answered ? (
                    <span
                      className={cn(
                        "mt-0.5 shrink-0 text-3xs",
                        isKey
                          ? "text-comply"
                          : picked
                            ? "text-defect"
                            : "text-muted-foreground",
                      )}
                    >
                      {isKey ? "key" : picked ? "yours" : "—"}
                    </span>
                  ) : null}
                  <span>{opt}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {answered ? (
        <Reveal
          verdict={
            right
              ? { tone: "good", text: "Match — and here is the reasoning:" }
              : {
                  tone: "bad",
                  text: `Not quite — the key says: ${step.opts[step.right]}`,
                }
          }
          body={step.why}
          last={last}
          onCommit={onCommit}
        />
      ) : null}
    </div>
  );
}

const VERDICT: Record<
  MarkVerdict,
  { label: string; tone: string; border: string }
> = {
  caught: { label: "caught", tone: "text-comply", border: "border-comply/50" },
  missed: { label: "missed", tone: "text-defect", border: "border-defect/50" },
  "false-flag": {
    label: "false flag",
    tone: "text-exaggerate",
    border: "border-exaggerate/50",
  },
  clean: { label: "clean", tone: "text-muted-foreground", border: "border-border" },
};

function MultiStep({
  step,
  seed,
  last,
  onCommit,
}: {
  step: DrillMultiStep;
  seed: string;
  last: boolean;
  onCommit: () => void;
}) {
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [committed, setCommitted] = useState(false);
  const shown = useMemo(
    () =>
      step.fixedOrder
        ? step.items.map((item, from) => ({ item, from }))
        : shuffleAnswerOptions(seed, step.items, (i) => i.t),
    [step, seed],
  );
  const commit = multiCommitState(step, marked.size);
  const score = committed ? scoreMulti(step, marked) : null;

  function toggle(i: number) {
    setMarked((prev) => {
      const next = new Set(prev);
      if (!next.delete(i)) next.add(i);
      return next;
    });
  }

  if (score) {
    return (
      <div className="space-y-3">
        <p className="text-xs tracking-wide">
          <span className="text-comply">{score.caught} caught</span>
          {" · "}
          <span className="text-defect">{score.missed} missed</span>
          {" · "}
          <span className="text-exaggerate">
            {score.falseFlagged} false-flagged
          </span>
        </p>
        <ul className="space-y-2">
          {step.items.map((item, i) => {
            const v = VERDICT[score.rows[i]!.verdict];
            return (
              <li
                key={i}
                className={cn("rounded-lg border p-3 text-sm", v.border)}
              >
                <span
                  className={cn(
                    "eyebrow",
                    v.tone,
                  )}
                >
                  {v.label}
                </span>
                <p className="mt-1 leading-relaxed">{item.t}</p>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {item.note}
                </p>
              </li>
            );
          })}
        </ul>
        {step.whyAll ? (
          <Reveal body={step.whyAll} last={last} onCommit={onCommit} />
        ) : (
          <ContinueRow last={last} onCommit={onCommit} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {shown.map(({ item, from }) => {
          const on = marked.has(from);
          return (
            <li key={from}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => toggle(from)}
                className={cn(
                  "w-full cursor-pointer rounded-lg border p-3 text-left text-sm leading-relaxed transition-colors select-none focus-visible:ring-2 focus-visible:outline-none",
                  on ? "border-primary bg-primary/5" : "border-border hover:bg-muted/60",
                )}
              >
                <span className="flex items-start gap-2">
                  <span
                    aria-hidden
                    className={cn(
                      "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border",
                      on ? "border-primary bg-primary text-primary-foreground" : "border-border",
                    )}
                  >
                    {on ? <Check className="size-3" /> : null}
                  </span>
                  <span>{item.t}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p
        aria-live="polite"
        className="text-muted-foreground text-3xs tracking-wide"
      >
        {commit.hint}
      </p>
      <Button
        disabled={!commit.ready}
        onClick={() => setCommitted(true)}
        className="gap-2"
      >
        <Flag className="size-4" aria-hidden /> Commit the marks
      </Button>
    </div>
  );
}

function NumberStep({
  step,
  last,
  onCommit,
}: {
  step: DrillNumberStep;
  last: boolean;
  onCommit: () => void;
}) {
  const [raw, setRaw] = useState("");
  const [committed, setCommitted] = useState(false);
  const result = checkNumber(step, raw);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="number"
          step="any"
          inputMode="decimal"
          value={raw}
          disabled={committed}
          onChange={(e) => setRaw(e.target.value)}
          aria-label={step.q}
          className="max-w-40"
        />
        {step.unit ? (
          <span className="text-muted-foreground text-xs">
            {step.unit}
          </span>
        ) : null}
      </div>
      {!committed ? (
        <>
          <p className="text-muted-foreground text-3xs tracking-wide">
            {result.value === null
              ? "no options on this one — compute it"
              : "ready"}
          </p>
          <Button
            disabled={result.value === null}
            onClick={() => setCommitted(true)}
            className="gap-2"
          >
            <Flag className="size-4" aria-hidden /> Commit
          </Button>
        </>
      ) : (
        <Reveal
          verdict={
            result.inBand
              ? { tone: "good", text: `Match — you said ${result.value}` }
              : { tone: "bad", text: `You said ${result.value} — the derivation:` }
          }
          body={step.reveal}
          last={last}
          onCommit={onCommit}
        />
      )}
    </div>
  );
}

function TextStep({
  step,
  last,
  onCommit,
}: {
  step: DrillTextStep;
  last: boolean;
  onCommit: () => void;
}) {
  const [raw, setRaw] = useState("");
  const [committed, setCommitted] = useState(false);
  const lint = lintText(step, raw);
  const hintId = useId();

  return (
    <div className="space-y-3">
      <Textarea
        value={raw}
        disabled={committed}
        onChange={(e) => setRaw(e.target.value)}
        aria-label={step.q}
        aria-invalid={lint.bad || undefined}
        aria-describedby={hintId}
        rows={4}
        className="resize-none"
      />
      <p
        id={hintId}
        aria-live="polite"
        className={cn(
          "text-3xs tracking-wide",
          lint.bad ? "text-exaggerate" : "text-muted-foreground",
        )}
      >
        {lint.hint}
      </p>
      {!committed ? (
        <Button
          disabled={!lint.ready}
          onClick={() => setCommitted(true)}
          className="gap-2"
        >
          <Flag className="size-4" aria-hidden /> Commit
        </Button>
      ) : (
        <Reveal body={step.reveal} last={last} onCommit={onCommit} />
      )}
    </div>
  );
}

function Reveal({
  verdict,
  body,
  last,
  onCommit,
}: {
  verdict?: { tone: "good" | "bad"; text: string };
  body: string;
  last: boolean;
  onCommit: () => void;
}) {
  return (
    <div className="space-y-3">
      {verdict ? (
        <p
          className={cn(
            "flex items-start gap-1.5 text-xs tracking-wide",
            verdict.tone === "good" ? "text-comply" : "text-defect",
          )}
        >
          {verdict.tone === "good" ? (
            <CircleCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          ) : (
            <CircleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          )}
          {verdict.text}
        </p>
      ) : null}
      <p className="border-border bg-muted/40 rounded-lg border p-3 text-sm leading-relaxed">
        {body}
      </p>
      <ContinueRow last={last} onCommit={onCommit} />
    </div>
  );
}

function ContinueRow({
  last,
  onCommit,
}: {
  last: boolean;
  onCommit: () => void;
}) {
  return (
    <Button onClick={onCommit} className="gap-2">
      {last ? "Finish bench" : "Continue"}
      <ArrowRight className="size-4" aria-hidden />
    </Button>
  );
}

function BenchFinish({
  deck,
  bench,
  progress,
  onOpen,
  onMenu,
  onRedo,
}: {
  deck: DrillDeck;
  bench: DrillBench;
  progress: DrillProgress;
  onOpen: (b: DrillBench) => void;
  onMenu: () => void;
  onRedo: () => void;
}) {
  const [redoArmed, setRedoArmed] = useState(false);
  const next = nextOpenBench(progress, deck, bench.id);
  return (
    <Shell>
      <div className="space-y-4">
        <p className="text-muted-foreground eyebrow">
          {bench.name} · complete
        </p>
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <CircleDot className="text-comply size-5" aria-hidden />
          Done — {benchDone(progress, bench)} / {bench.steps.length}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {next
            ? `Next open bench: ${next.name} — ${next.kicker}`
            : "Every bench in this module is complete."}
        </p>
        <div className="flex flex-wrap gap-2">
          {next ? (
            <Button onClick={() => onOpen(next)} className="gap-2">
              {next.name} <ArrowRight className="size-4" aria-hidden />
            </Button>
          ) : null}
          <Button
            variant="outline"
            onClick={() => {
              if (!redoArmed) {
                setRedoArmed(true);
                return;
              }
              setRedoArmed(false);
              onRedo();
            }}
            className="gap-2"
          >
            <RotateCcw className="size-4" aria-hidden />
            {redoArmed ? "Sure? Tap again" : "Redo bench"}
          </Button>
          {deck.benches.length > 1 ? (
            <Button variant="ghost" onClick={onMenu}>
              All benches
            </Button>
          ) : null}
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-6">
      <div className="panel">
        {children}
      </div>
    </div>
  );
}
