"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DragProvider, Draggable, DropZone } from "../kit/drag";
import type { VerificationWidgetProps } from "../kit/types";
import {
  AXIS_SCALES,
  AXIS_TIPS,
  BUCKETS,
  cellLabel,
  EXC_ANSWERS,
  EXC_OPTION_IDS,
  POLICY_SCOPING_COPY as C,
  type Bucket,
  type Verdict,
  verdictFor,
  verdictLabel,
} from "@/lib/verification/data/policy-scoping";

const RAMP_N = BUCKETS.length - 1;
function tint(i: number, lowPct: number, highPct: number): string {
  const pct = lowPct + ((highPct - lowPct) * i) / RAMP_N;
  return `color-mix(in oklab, var(--primary) ${pct.toFixed(1)}%, var(--card))`;
}

const READ_BG = "color-mix(in oklab, var(--primary) 13%, var(--card))";
const READ_BORDER = "color-mix(in oklab, var(--primary) 42%, var(--card))";

const COLS = [0, 1, 2, 3, 4] as const;
const ROWS = [4, 3, 2, 1, 0] as const;

const VERDICT_TEXT: Record<Verdict, string> = {
  right: "text-comply",
  close: "text-exaggerate",
  wrong: "text-defect",
};
const VERDICT_BORDER: Record<Verdict, string> = {
  right: "border-comply",
  close: "border-exaggerate",
  wrong: "border-defect",
};

interface Placement {
  cell: string | null;
  verdict: Verdict | null;
}

const parseCell = (cell: string) => ({ f: Number(cell[1]), e: Number(cell[3]) });

function nudge(bucket: Bucket, cell: string): string {
  const { f, e } = parseCell(cell);
  const parts: string[] = [];
  if (bucket.key.f > f) parts.push("more gettable than you have it");
  if (bucket.key.f < f) parts.push("harder to get than you have it");
  if (bucket.key.e > e) parts.push("stronger than you have it");
  if (bucket.key.e < e) parts.push("weaker than you have it");
  return parts.join(", and ");
}

type Phase = 0 | 1 | 2;

export function PolicyScoping({ onComplete }: VerificationWidgetProps) {
  const [phase, setPhase] = useState<Phase>(0);
  const [maxPhase, setMaxPhase] = useState<Phase>(0);

  const [scaleOpen, setScaleOpen] = useState<"effectiveness" | "feasibility" | null>(null);
  const [scalesSeen, setScalesSeen] = useState<{ effectiveness: boolean; feasibility: boolean }>({
    effectiveness: false,
    feasibility: false,
  });

  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [seen, setSeen] = useState<Set<number>>(() => new Set());

  const [placements, setPlacements] = useState<Record<string, Placement>>(() =>
    Object.fromEntries(BUCKETS.map((b) => [b.id, { cell: null, verdict: null }])),
  );
  const [checkedOnce, setCheckedOnce] = useState(false);
  const [keyOn, setKeyOn] = useState(false);
  const [excPicked, setExcPicked] = useState<string | null>(null);
  const [excDone, setExcDone] = useState(false);
  const liveRef = useRef<HTMLDivElement>(null);

  function say(msg: string) {
    if (liveRef.current) liveRef.current.textContent = msg;
  }

  const goTo = (p: Phase) => {
    setPhase(p);
    setMaxPhase((m) => (p > m ? p : m));
  };

  const bothScalesSeen = scalesSeen.effectiveness && scalesSeen.feasibility;
  const allCardsSeen = seen.size === BUCKETS.length;

  function toggleCard(i: number) {
    setOpenIdx((prev) => (prev === i ? null : i));
    setSeen((prev) => {
      if (prev.has(i)) return prev;
      const next = new Set(prev);
      next.add(i);
      return next;
    });
  }

  function openScale(key: "effectiveness" | "feasibility") {
    setScaleOpen(key);
    setScalesSeen((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  }

  return (
    <div className="not-prose my-6">
      <div className="border-border mb-4 flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b pb-2">
        {C.phases.map((label, i) => {
          const reachable = i <= maxPhase && !(i === 2 && !allCardsSeen);
          const current = phase === i;
          const done =
            (i === 0 && bothScalesSeen) || (i === 1 && allCardsSeen) || (i === 2 && excDone);
          return (
            <button
              key={label}
              type="button"
              disabled={!reachable}
              aria-current={current ? "step" : undefined}
              onClick={() => goTo(i as Phase)}
              className={cn(
                "flex items-baseline gap-1.5 border-0 bg-transparent p-0 text-sm transition-colors",
                current
                  ? "text-foreground font-semibold"
                  : reachable
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-muted-foreground/50",
              )}
            >
              <span className="text-muted-foreground text-xs font-normal">{i + 1}.</span>
              {label}
              {done && (
                <span className="text-comply inline-flex items-center gap-0.5 text-xs font-normal">
                  <Check className="size-3" aria-hidden /> done
                </span>
              )}
            </button>
          );
        })}
      </div>

      {phase === 0 && (
        <AxesPhase
          scalesSeen={scalesSeen}
          openScale={openScale}
          onContinue={() => goTo(1)}
        />
      )}

      {phase === 1 && (
        <CardsPhase
          openIdx={openIdx}
          seen={seen}
          toggle={toggleCard}
          allSeen={allCardsSeen}
          onSort={() => goTo(2)}
        />
      )}

      {phase === 2 && (
        <SortPhase
          placements={placements}
          setPlacements={setPlacements}
          checkedOnce={checkedOnce}
          setCheckedOnce={setCheckedOnce}
          keyOn={keyOn}
          setKeyOn={setKeyOn}
          excPicked={excPicked}
          setExcPicked={setExcPicked}
          excDone={excDone}
          setExcDone={setExcDone}
          onComplete={onComplete}
          openScale={openScale}
          say={say}
        />
      )}

      <ScaleDialog
        scaleKey={scaleOpen}
        onOpenChange={(open) => !open && setScaleOpen(null)}
      />

      <div ref={liveRef} aria-live="polite" className="sr-only" />
    </div>
  );
}

function AxesPhase({
  scalesSeen,
  openScale,
  onContinue,
}: {
  scalesSeen: { effectiveness: boolean; feasibility: boolean };
  openScale: (key: "effectiveness" | "feasibility") => void;
  onContinue: () => void;
}) {
  return (
    <div>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{C.axesKicker}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {(["effectiveness", "feasibility"] as const).map((key) => {
          const scale = AXIS_SCALES[key];
          const seen = scalesSeen[key];
          return (
            <div key={key} className="border-border bg-card flex flex-col gap-2 rounded-xl border p-4">
              <p className="text-base font-semibold">{scale.question}</p>
              <p className="text-muted-foreground flex-1 text-sm leading-relaxed">{scale.lead}</p>
              <div className="flex items-center justify-between gap-2">
                <Button size="sm" variant={seen ? "outline" : "default"} onClick={() => openScale(key)}>
                  {C.openScale}
                </Button>
                {seen && (
                  <span className="text-comply flex items-center gap-1 text-xs font-semibold">
                    <Check className="size-3.5" aria-hidden /> {C.scaleSeen}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button onClick={onContinue} disabled={!(scalesSeen.effectiveness && scalesSeen.feasibility)}>
          {C.axesContinue}
        </Button>
        {!(scalesSeen.effectiveness && scalesSeen.feasibility) && (
          <p className="text-muted-foreground text-xs">{C.axesHint}</p>
        )}
      </div>
    </div>
  );
}

function ScaleDialog({
  scaleKey,
  onOpenChange,
}: {
  scaleKey: "effectiveness" | "feasibility" | null;
  onOpenChange: (open: boolean) => void;
}) {
  const scale = scaleKey ? AXIS_SCALES[scaleKey] : null;
  return (
    <Dialog open={!!scaleKey} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {scale && (
          <>
            <DialogHeader>
              <DialogTitle>{scale.title}</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground text-sm leading-relaxed">{scale.lead}</p>
            <ol className="mt-1 flex flex-col-reverse gap-1.5">
              {scale.rungs.map((rung, i) => (
                <li key={rung.name} className="border-border bg-muted/30 grid grid-cols-[auto_1fr] gap-x-2.5 rounded-lg border px-3 py-2 text-sm">
                  <span className="text-muted-foreground tabular-nums">{i + 1}.</span>
                  <span>
                    <span className="font-semibold">{rung.name}</span>
                    <span className="text-muted-foreground"> — {rung.gloss}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="text-muted-foreground text-xs">{C.scaleLowHigh}</p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CardsPhase({
  openIdx,
  seen,
  toggle,
  allSeen,
  onSort,
}: {
  openIdx: number | null;
  seen: Set<number>;
  toggle: (i: number) => void;
  allSeen: boolean;
  onSort: () => void;
}) {
  return (
    <div>
      <p className="text-muted-foreground mb-3 text-sm leading-relaxed">{C.cardsKicker}</p>

      <p className="text-muted-foreground mb-1.5 text-xs tracking-[0.12em] uppercase">
        {C.rampTop}
      </p>

      <div className="grid grid-cols-[0.375rem_1fr] gap-x-3">
        {BUCKETS.map((b, i) => {
          const open = openIdx === i;
          const read = seen.has(i);
          return (
            <div key={b.id} className="col-span-2 grid grid-cols-subgrid">
              <div
                aria-hidden
                className={cn(
                  "min-h-full",
                  i === 0 && "rounded-t-full",
                  i === BUCKETS.length - 1 && "rounded-b-full",
                )}
                style={{ background: tint(i, 12, 100) }}
              />
              <div className={cn("min-w-0", i > 0 && "mt-1.5")}>
                <div
                  className="overflow-hidden rounded-lg border"
                  style={
                    open
                      ? { borderColor: tint(i, 35, 100), background: tint(i, 4, 9) }
                      : read
                        ? { borderColor: READ_BORDER, background: READ_BG }
                        : { borderColor: "var(--border)", background: "var(--card)" }
                  }
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => toggle(i)}
                    className="flex w-full cursor-pointer items-baseline gap-2 px-3 py-2.5 text-left select-none sm:px-4"
                  >
                    <span className="text-muted-foreground w-5 flex-none text-sm font-normal tabular-nums">
                      {b.n}.
                    </span>
                    <span className="text-foreground min-w-0 flex-1 text-sm leading-snug font-semibold sm:text-base">
                      {b.name}
                    </span>
                    {read && !open && (
                      <span className="text-comply flex flex-none items-center gap-1 text-xs font-medium">
                        <Check className="size-3" aria-hidden /> {C.readMark}
                      </span>
                    )}
                    <span
                      aria-hidden
                      className={cn(
                        "text-muted-foreground flex-none text-lg leading-none font-light transition-transform duration-200 motion-reduce:transition-none",
                        open && "rotate-45",
                      )}
                    >
                      +
                    </span>
                  </button>
                  <div hidden={!open} className="flex flex-col gap-3 px-3 pb-3.5 sm:px-4">
                    <p className="text-sm leading-relaxed sm:text-base">{b.desc}</p>
                    <div className="border-border bg-card rounded-lg border p-3">
                      <p className="text-muted-foreground eyebrow">
                        {C.cardParallelTag} — {b.parallel.title}
                      </p>
                      <p className="text-foreground/85 mt-1.5 text-sm leading-relaxed">
                        {b.parallel.text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-muted-foreground mt-1.5 text-xs tracking-[0.12em] uppercase">
        {C.rampBottom}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button onClick={onSort} disabled={!allSeen}>
          {C.cardToSort}
        </Button>
        <p className="text-muted-foreground text-xs" aria-live="polite">
          {C.readCount(seen.size, BUCKETS.length)}
        </p>
      </div>
    </div>
  );
}

function SortPhase({
  placements,
  setPlacements,
  checkedOnce,
  setCheckedOnce,
  keyOn,
  setKeyOn,
  excPicked,
  setExcPicked,
  excDone,
  setExcDone,
  onComplete,
  openScale,
  say,
}: {
  placements: Record<string, Placement>;
  setPlacements: React.Dispatch<React.SetStateAction<Record<string, Placement>>>;
  checkedOnce: boolean;
  setCheckedOnce: (b: boolean) => void;
  keyOn: boolean;
  setKeyOn: (b: boolean) => void;
  excPicked: string | null;
  setExcPicked: (id: string | null) => void;
  excDone: boolean;
  setExcDone: (b: boolean) => void;
  onComplete: () => void;
  openScale: (key: "effectiveness" | "feasibility") => void;
  say: (msg: string) => void;
}) {
  const total = BUCKETS.length;
  const placedCount = BUCKETS.filter((b) => placements[b.id].cell).length;
  const allPlaced = placedCount === total;
  const verdicts = BUCKETS.map((b) => placements[b.id].verdict);
  const anyVerdict = verdicts.some(Boolean);
  const allVerdicts = verdicts.every(Boolean);
  const rightCount = verdicts.filter((v) => v === "right").length;
  const closeCount = verdicts.filter((v) => v === "close").length;
  const allRight = allVerdicts && rightCount === total;
  const excUnlocked = allRight || keyOn;

  const byCell = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const b of BUCKETS) {
      const cell = placements[b.id].cell;
      if (cell) (map[cell] ??= []).push(b.id);
    }
    return map;
  }, [placements]);

  const ghostOffsets = useMemo(() => {
    const groups: Record<string, string[]> = {};
    for (const b of BUCKETS) {
      const key = `f${b.key.f}e${b.key.e}`;
      (groups[key] ??= []).push(b.id);
    }
    const offsets: Record<string, number> = {};
    for (const ids of Object.values(groups)) {
      ids.forEach((id, i) => {
        offsets[id] = (i - (ids.length - 1) / 2) * 5.5;
      });
    }
    return offsets;
  }, []);

  function handleDrop(itemId: string, zoneId: string) {
    setPlacements((prev) => {
      if (prev[itemId].cell === zoneId) return prev;
      return { ...prev, [itemId]: { cell: zoneId, verdict: null } };
    });
    const b = BUCKETS.find((q) => q.id === itemId)!;
    say(`${b.name} placed at ${cellLabel(zoneId)}.`);
  }

  function check() {
    setCheckedOnce(true);
    let right = 0;
    const next: Record<string, Placement> = { ...placements };
    for (const b of BUCKETS) {
      const cell = placements[b.id].cell;
      if (!cell) continue;
      const { f, e } = parseCell(cell);
      const v = verdictFor(b, f, e);
      next[b.id] = { cell, verdict: v };
      if (v === "right") right++;
    }
    setPlacements(next);
    say(
      `Checked. ${right} of ${total} on the mark.` +
        (right === total
          ? " All correct — the one-exception question is now available."
          : " Adjust placements and check again."),
    );
    if (right === total) reveal();
  }

  function reveal() {
    setKeyOn(true);
    say(
      "Reference map revealed. " + BUCKETS.map((b) => `${b.name}: ${b.why}`).join(" "),
    );
  }

  function resetSort() {
    setPlacements(
      Object.fromEntries(BUCKETS.map((b) => [b.id, { cell: null, verdict: null }])),
    );
    setCheckedOnce(false);
    setKeyOn(false);
    setExcPicked(null);
    setExcDone(false);
    say(`Sort reset. All ${total} buckets returned to the tray.`);
  }

  function pickException(id: string) {
    if (excDone) return;
    const a = EXC_ANSWERS[id];
    setExcPicked(id);
    if (a.ok) {
      setExcDone(true);
      if (!keyOn) reveal();
      onComplete();
      say("Correct. Exercise complete.");
    } else {
      say("Not quite. Try again.");
    }
  }

  return (
    <DragProvider onDrop={handleDrop}>
      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          <p className="text-muted-foreground border-border bg-muted/40 mb-4 rounded-lg border px-3 py-2 text-xs">
            {C.sortHint}
          </p>

          <div className="border-border mb-5 rounded-lg border p-3">
            <p className="text-muted-foreground mb-2 text-xs tracking-[0.15em] uppercase">
              {C.trayLabel}
            </p>
            <div className="flex flex-wrap gap-2">
              {BUCKETS.map((b, i) =>
                placements[b.id].cell ? (
                  <div
                    key={b.id}
                    aria-hidden
                    className="border-border/60 text-muted-foreground/50 flex h-8 items-center rounded-full border border-dashed px-3 text-xs"
                  >
                    {b.n}. {b.short}
                  </div>
                ) : (
                  <ChipTip key={b.id} bucket={b} placement={placements[b.id]}>
                    <Draggable
                      id={b.id}
                      label={`${b.n}. ${b.name}`}
                      className="flex h-8 items-center gap-1 rounded-full border px-3 text-xs font-semibold shadow-soft"
                      style={{
                        background: tint(i, 5, 34),
                        borderColor: tint(i, 30, 80),
                      }}
                    >
                      <span className="text-muted-foreground font-normal tabular-nums">
                        {b.n}.
                      </span>
                      {b.short}
                    </Draggable>
                  </ChipTip>
                ),
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex flex-none items-center">
              <button
                type="button"
                onClick={() => openScale("effectiveness")}
                className="text-foreground/70 hover:text-foreground inline-flex [writing-mode:vertical-rl] rotate-180 items-center border-0 bg-transparent p-0 text-xs font-semibold whitespace-nowrap"
                title={AXIS_TIPS.y}
              >
                {C.yTitle} <span className="text-muted-foreground font-normal">{C.ySub}</span>{" "}
                →
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex">
                <div className="flex w-16 flex-none flex-col">
                  {ROWS.map((e) => (
                    <div
                      key={e}
                      className="text-muted-foreground flex flex-1 items-center justify-end pr-1.5 text-right text-4xs leading-tight tracking-[0.02em]"
                    >
                      {AXIS_SCALES.effectiveness.rungs[e].name}
                    </div>
                  ))}
                </div>

                <div className="border-border bg-card relative min-w-0 flex-1 overflow-hidden rounded-lg border">
                  <div className="relative z-[5] grid grid-cols-5 grid-rows-5">
                    {ROWS.map((e) =>
                      COLS.map((f) => {
                        const cellKey = `f${f}e${e}`;
                        const ids = byCell[cellKey] ?? [];
                        const isCorner = cellKey === "f4e4" || cellKey === "f0e0";
                        return (
                          <DropZone
                            key={cellKey}
                            id={cellKey}
                            label={cellLabel(cellKey)}
                            className={cn(
                              "relative flex min-h-14 flex-col gap-1 p-1 sm:min-h-16 sm:p-1.5",
                              "[&:not(:nth-child(5n))]:border-r [&:nth-child(-n+20)]:border-b",
                              "border-border/60",
                              isCorner && "bg-muted/40",
                            )}
                            overClassName="ring-primary ring-2 z-10"
                            armedClassName="ring-primary/50 ring-2 z-10"
                          >
                            {cellKey === "f4e4" && (
                              <CornerNote
                                className="top-1 right-1.5"
                                label={C.cornerTR}
                                tip={AXIS_TIPS.tr}
                              />
                            )}
                            {cellKey === "f0e0" && (
                              <CornerNote
                                className="bottom-1 left-1.5"
                                label={C.cornerBL}
                                tip={AXIS_TIPS.bl}
                              />
                            )}
                            {ids.map((id) => {
                              const b = BUCKETS.find((q) => q.id === id)!;
                              const i = BUCKETS.indexOf(b);
                              const pl = placements[id];
                              return (
                                <ChipTip key={id} bucket={b} placement={pl}>
                                  <Draggable
                                    id={id}
                                    label={`${b.n}. ${b.name}`}
                                    className={cn(
                                      "z-10 flex items-center gap-1 rounded-full border py-0.5 pr-2 pl-1.5 text-3xs leading-tight font-semibold shadow-soft",
                                      pl.verdict && VERDICT_BORDER[pl.verdict],
                                    )}
                                    style={
                                      pl.verdict
                                        ? { background: tint(i, 5, 34) }
                                        : {
                                            background: tint(i, 5, 34),
                                            borderColor: tint(i, 30, 80),
                                          }
                                    }
                                  >
                                    {pl.verdict && <VerdictBadge verdict={pl.verdict} />}
                                    <span className="truncate">
                                      {b.n}. {b.short}
                                    </span>
                                  </Draggable>
                                </ChipTip>
                              );
                            })}
                          </DropZone>
                        );
                      }),
                    )}
                  </div>

                  {keyOn &&
                    BUCKETS.map((b) => (
                      <GhostTip key={b.id} bucket={b} dy={ghostOffsets[b.id]} />
                    ))}
                </div>
              </div>

              <div className="ml-16 flex">
                {COLS.map((f) => (
                  <div
                    key={f}
                    className="text-muted-foreground flex-1 px-0.5 pt-1.5 text-center text-4xs leading-tight tracking-[0.02em]"
                  >
                    {AXIS_SCALES.feasibility.rungs[f].name}
                  </div>
                ))}
              </div>
              <div className="ml-16 pt-1 text-center">
                <button
                  type="button"
                  onClick={() => openScale("feasibility")}
                  className="text-foreground/70 hover:text-foreground inline-flex items-center border-0 bg-transparent p-0 text-xs font-semibold"
                  title={AXIS_TIPS.x}
                >
                  {C.xTitle} <span className="text-muted-foreground font-normal">{C.xSub}</span>{" "}
                  →
                </button>
              </div>
              <p className="text-muted-foreground ml-16 pt-1.5 text-center text-sm leading-relaxed italic">
                {C.caption}
              </p>
            </div>
          </div>
        </div>

        <aside className="flex min-w-0 flex-col gap-4">
          <div className="border-border flex flex-col gap-1.5 border-y py-3">
            {C.stats.map((s) => (
              <div key={s.n} className="flex items-baseline gap-2">
                <span className="text-sm font-semibold">{s.n}</span>
                <span className="text-muted-foreground text-xs">{s.l}</span>
              </div>
            ))}
          </div>

          <div>
            <p className="text-muted-foreground mb-2 text-4xs tracking-[0.15em] uppercase">
              {C.exerciseLabel}
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={check} disabled={!allPlaced}>
                {C.checkBtn}
              </Button>
              <Button variant="outline" onClick={reveal} disabled={!checkedOnce || keyOn}>
                {C.revealBtn}
              </Button>
              <Button variant="ghost" onClick={resetSort} className="gap-2">
                <RotateCcw className="size-4" aria-hidden /> {C.resetBtn}
              </Button>
              <p className="text-muted-foreground text-center text-xs">
                {allVerdicts ? (
                  allRight ? (
                    <span className="text-foreground font-semibold">
                      {total} of {total} on the mark.
                    </span>
                  ) : (
                    <>
                      <span className="text-foreground font-semibold">{rightCount}</span> on
                      the mark ·{" "}
                      <span className="text-foreground font-semibold">{closeCount}</span>{" "}
                      close ·{" "}
                      <span className="text-foreground font-semibold">
                        {total - rightCount - closeCount}
                      </span>{" "}
                      off — drag and re-check
                    </>
                  )
                ) : allPlaced ? (
                  "All placed — check when ready"
                ) : (
                  `${placedCount} of ${total} placed`
                )}
              </p>
            </div>
          </div>

          {anyVerdict && (
            <div className="flex flex-col gap-1.5">
              <p className="text-muted-foreground text-4xs tracking-[0.15em] uppercase">
                {C.resultsLabel}
              </p>
              {BUCKETS.map((b) => {
                const pl = placements[b.id];
                if (!pl.verdict)
                  return (
                    <div key={b.id} className="border-border bg-muted/30 rounded-lg border p-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">{b.name}</span>
                        <span className="text-muted-foreground ml-auto flex-none text-4xs tracking-[0.1em] uppercase">
                          moved — recheck
                        </span>
                      </div>
                    </div>
                  );
                return (
                  <div key={b.id} className="border-border bg-muted/30 rounded-lg border p-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">{b.name}</span>
                      <span
                        className={cn(
                          "ml-auto flex-none text-4xs tracking-[0.1em] uppercase",
                          VERDICT_TEXT[pl.verdict],
                        )}
                      >
                        {verdictLabel(pl.verdict)}
                      </span>
                    </div>
                    {(keyOn || pl.verdict === "right") ? (
                      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                        {b.why}
                      </p>
                    ) : (
                      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                        By the reference map it is {nudge(b, pl.cell!)}.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {excUnlocked && (
            <div className="border-border bg-muted/30 rounded-lg border p-3">
              <p className="text-muted-foreground mb-2 text-4xs tracking-[0.15em] uppercase">
                {C.excLabel}
              </p>
              <p className="text-muted-foreground mb-3 text-sm leading-relaxed">
                {C.excLead.pre}
                <AxisTip tip={AXIS_TIPS.sec}>
                  <span
                    tabIndex={0}
                    className="decoration-muted-foreground/60 text-foreground cursor-help font-medium underline decoration-dotted underline-offset-2"
                  >
                    {C.excLead.sec}
                  </span>
                </AxisTip>
                {C.excLead.mid}
                <b className="text-foreground">{C.excLead.bold}</b>
                {C.excLead.post}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[...EXC_OPTION_IDS].reverse().map((id) => {
                  const b = BUCKETS.find((q) => q.id === id)!;
                  const isPicked = excPicked === id;
                  const ok = EXC_ANSWERS[id].ok;
                  return (
                    <button
                      key={id}
                      type="button"
                      disabled={excDone && !(isPicked && ok)}
                      onClick={() => pickException(id)}
                      className={cn(
                        "border-border rounded-full border px-3 py-1 text-3xs font-semibold transition-colors",
                        "hover:border-foreground/40 disabled:opacity-50",
                        isPicked && ok && "border-comply text-comply",
                        isPicked && !ok && "border-defect text-defect",
                      )}
                    >
                      {b.name}
                    </button>
                  );
                })}
              </div>
              {excPicked && (
                <p
                  className="border-border text-muted-foreground mt-2.5 border-t pt-2.5 text-sm leading-relaxed [&_b]:text-foreground [&_b]:font-semibold"
                  aria-live="polite"
                  dangerouslySetInnerHTML={{ __html: EXC_ANSWERS[excPicked].t }}
                />
              )}
            </div>
          )}

          {excDone && (
            <div className="border-primary bg-card rounded-lg border p-3">
              <p className="text-brand-ink flex items-center gap-1 text-xs font-semibold">
                <Check className="size-3.5" aria-hidden />
                {C.closingNext}
              </p>
            </div>
          )}

          <p className="border-border text-muted-foreground border-t pt-3 text-sm leading-relaxed">
            {C.foot}
          </p>
        </aside>
      </div>
    </DragProvider>
  );
}

function GhostTip({ bucket, dy }: { bucket: Bucket; dy: number }) {
  const isTarget = bucket.id === "ch";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            "bg-card/90 absolute z-[7] flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-dashed px-2 py-0.5 text-4xs whitespace-nowrap",
            "text-muted-foreground hover:text-foreground cursor-help",
            isTarget
              ? "border-defect ring-defect/15 border-solid ring-4"
              : "border-muted-foreground",
          )}
          style={{
            left: `${((bucket.key.f + 0.5) / 5) * 100}%`,
            top: `${((4 - bucket.key.e + 0.5) / 5) * 100 + dy}%`,
          }}
        >
          {bucket.short}
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-pretty">
        <span className="font-semibold">{bucket.name} — why here.</span> {bucket.why}
      </TooltipContent>
    </Tooltip>
  );
}

function ChipTip({
  bucket,
  placement,
  children,
}: {
  bucket: Bucket;
  placement: Placement;
  children: React.ReactNode;
}) {
  const v = placement.verdict;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="max-w-xs text-pretty">
        <span className="block font-semibold">
          {bucket.n}. {bucket.name}
        </span>
        {v && placement.cell ? (
          <span className="mt-1 block">
            <span
              className={cn("block text-4xs tracking-[0.1em] uppercase", VERDICT_TEXT[v])}
            >
              {verdictLabel(v)}
            </span>
            {v === "right"
              ? bucket.why
              : `Placed at ${cellLabel(placement.cell)} — ${nudge(bucket, placement.cell)}.`}
          </span>
        ) : (
          <span className="mt-1 block">{bucket.desc}</span>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

function AxisTip({ tip, children }: { tip: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="max-w-xs text-pretty">{tip}</TooltipContent>
    </Tooltip>
  );
}

function CornerNote({
  className,
  label,
  tip,
}: {
  className?: string;
  label: string;
  tip: string;
}) {
  return (
    <AxisTip tip={tip}>
      <button
        type="button"
        className={cn(
          "text-muted-foreground/60 hover:text-muted-foreground absolute z-[8] cursor-help border-0 bg-transparent p-0 text-4xs tracking-[0.05em] select-none",
          className,
        )}
      >
        {label}
      </button>
    </AxisTip>
  );
}

function VerdictBadge({ verdict }: { verdict: Verdict }) {
  if (verdict === "right")
    return <Check className={cn("size-3", VERDICT_TEXT.right)} aria-hidden />;
  if (verdict === "wrong")
    return <X className={cn("size-3", VERDICT_TEXT.wrong)} aria-hidden />;
  return <ArrowRight className={cn("size-3 rotate-45", VERDICT_TEXT.close)} aria-hidden />;
}
