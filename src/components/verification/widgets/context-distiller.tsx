"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Check, ChevronDown, ChevronUp, ExternalLink, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  distillerReports,
  type DistillerActor,
  type DistillerActorGroup,
  type DistillerBlock,
  type DistillerReport,
  type DistillerStakeholder,
} from "@/lib/verification/data/context-distiller";
import {
  blockForSeg,
  canEnterPhase,
  capFor,
  DISTILLER_PHASES,
  evaluateRun,
  freshRun,
  indexReport,
  PHASE_GATE_MESSAGE,
  producedSegs,
  sanitizeRun,
  scoreActors,
  seenAllFlips,
  shuffleSeeded,
  summarize,
  type DistillerIndex,
  type DistillerPhase,
  type DistillerRun,
} from "@/lib/verification/engines/context-distiller";
import type { VerificationWidgetProps } from "../kit/types";
import { readStored, removeStored, writeStored } from "@/components/verification/kit/stored";

const CURRENT_KEY = "distiller-v2-current";
const runKey = (reportId: string) => `distiller-v2-${reportId}`;

type Screen = "run" | "letters";

export function ContextDistiller({ onComplete }: VerificationWidgetProps) {
  const [reportId, setReportId] = useState<string | null>(null);
  const [run, setRun] = useState<DistillerRun | null>(null);
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState<Screen>("run");

  const report = useMemo(
    () => distillerReports.find((r) => r.id === reportId) ?? null,
    [reportId],
  );
  const index = useMemo(() => (report ? indexReport(report) : null), [report]);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = JSON.parse(readStored(CURRENT_KEY) ?? "null");
    } catch {
    }
    queueMicrotask(() => {
      if (saved && distillerReports.some((r) => r.id === saved)) setReportId(saved);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!report || !index) {
      queueMicrotask(() => setRun(null));
      return;
    }
    const seed = (Date.now() % 100000) | 0;
    let loaded: DistillerRun | null = null;
    try {
      const raw = readStored(runKey(report.id));
      if (raw) loaded = sanitizeRun(JSON.parse(raw), index, seed);
    } catch {
    }
    queueMicrotask(() => {
      setRun(loaded ?? freshRun(seed));
      setScreen("run");
    });
  }, [report, index]);

  const persist = useCallback(
    (next: DistillerRun) => {
      if (!report) return;
      try {
        writeStored(runKey(report.id), JSON.stringify(next));
      } catch {
      }
    },
    [report],
  );

  const update = useCallback(
    (fn: (prev: DistillerRun) => DistillerRun) => {
      setRun((prev) => {
        if (!prev) return prev;
        const next = fn(prev);
        if (next === prev) return prev;
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const pickReport = useCallback((id: string) => {
    setReportId(id);
    try {
      writeStored(CURRENT_KEY, JSON.stringify(id));
    } catch {
    }
  }, []);

  const leaveReport = useCallback(() => {
    setReportId(null);
    try {
      removeStored(CURRENT_KEY);
    } catch {
    }
  }, []);

  if (!ready) {
    return (
      <div
        className="not-prose border-border bg-card my-6 min-h-64 rounded-xl border"
        aria-hidden
      />
    );
  }

  if (!report || !index || !run) {
    return (
      <Shell>
        <p className="text-muted-foreground mx-auto max-w-2xl px-4 pb-4 text-center text-sm">
          Four documents, one discipline. <b className="text-foreground">Pick a report to
          distil.</b>
          <span className="text-muted-foreground/80 mt-1.5 block text-xs">
            Each is a verification report: one actor&rsquo;s claims, another&rsquo;s access,
            and readers waiting on the result.
          </span>
        </p>
        <ReportPicker onPick={pickReport} />
      </Shell>
    );
  }

  return (
    <Shell>
      <RunScreen
        key={report.id}
        report={report}
        index={index}
        run={run}
        update={update}
        screen={screen}
        setScreen={setScreen}
        onLeave={leaveReport}
        onComplete={onComplete}
      />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose border-border bg-background my-6 overflow-hidden rounded-xl border">
      {children}
    </div>
  );
}

function ReportPicker({ onPick }: { onPick: (id: string) => void }) {
  return (
    <div className="grid gap-3 p-4 pt-0 sm:grid-cols-2">
      {distillerReports.map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={() => onPick(r.id)}
          className="border-border bg-card hover:border-primary/60 hover:shadow-soft flex flex-col gap-1.5 rounded-lg border p-4 text-left transition-[border-color,box-shadow] duration-200 select-none"
        >
          <span className="text-muted-foreground text-xs">
            {r.kind} &middot; {r.fictional ? "fictional" : "real document"}
          </span>
          <span className="text-foreground text-base leading-tight font-semibold">
            {r.title}
          </span>
          <span className="text-muted-foreground text-xs">
            {r.author} &middot; {r.year}
          </span>
          <span className="text-muted-foreground mt-1 text-sm leading-snug">{r.blurb}</span>
        </button>
      ))}
    </div>
  );
}

interface StageProps {
  report: DistillerReport;
  index: DistillerIndex;
  run: DistillerRun;
  update: (fn: (prev: DistillerRun) => DistillerRun) => void;
}

function RunScreen({
  report,
  index,
  run,
  update,
  screen,
  setScreen,
  onLeave,
  onComplete,
}: StageProps & {
  screen: Screen;
  setScreen: (s: Screen) => void;
  onLeave: () => void;
  onComplete: () => void;
}) {
  const [resetArmed, setResetArmed] = useState(false);
  const [activeSection, setActiveSection] = useState(report.sections[0].id);
  const [poolView, setPoolView] = useState<"excerpts" | "report">("excerpts");

  useEffect(() => {
    if (!resetArmed) return;
    const t = setTimeout(() => setResetArmed(false), 2500);
    return () => clearTimeout(t);
  }, [resetArmed]);

  const goPhase = useCallback(
    (p: DistillerPhase) => {
      if (!canEnterPhase(p, run)) {
        toast.message(PHASE_GATE_MESSAGE[p] ?? "Not yet.");
        return;
      }
      update((prev) => ({ ...prev, phase: p }));
    },
    [run, update],
  );

  const wipe = () => {
    if (!resetArmed) {
      setResetArmed(true);
      return;
    }
    setResetArmed(false);
    update((prev) => ({
      ...freshRun((Date.now() % 100000) | 0),
      tightUnlocked: prev.tightUnlocked,
    }));
    setScreen("run");
    toast.message("Wiped clean.");
  };

  const stage = { report, index, run, update };

  return (
    <>
      <div className="border-border flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b px-4 py-2.5">
        <span className="text-muted-foreground text-xs">{report.kind}</span>
        <span className="text-foreground text-sm font-semibold">{report.title}</span>
        <span className="text-muted-foreground text-xs">
          {report.author} &middot; {report.year}
        </span>
        {report.fictional ? (
          <span className="border-border text-muted-foreground rounded-full border px-2 py-0.5 text-xs">
            fictional teaching document
          </span>
        ) : (
          <a
            href={report.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-ink inline-flex items-center gap-1 text-xs underline underline-offset-2"
          >
            source
            <ExternalLink className="size-3" aria-hidden />
          </a>
        )}
        <span className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onLeave}>
            Change report
          </Button>
          <Button
            variant={resetArmed ? "destructive" : "ghost"}
            size="sm"
            onClick={wipe}
          >
            {resetArmed ? "Tap again to wipe" : "Reset"}
          </Button>
        </span>
      </div>

      {screen === "letters" ? (
        <Letters {...stage} onBack={() => setScreen("run")} />
      ) : (
        <>
          <PhaseRail run={run} onGo={goPhase} />
          <PhaseLead report={report} phase={run.phase} />
          {run.phase === 1 && (
            <ClipStage
              {...stage}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              poolView={poolView}
              setPoolView={setPoolView}
              onNext={() => goPhase(2)}
            />
          )}
          {run.phase === 2 && <DistilStage {...stage} onGo={goPhase} />}
          {run.phase === 3 && <UpstreamStage {...stage} onGo={goPhase} />}
          {run.phase === 4 && <DownstreamStage {...stage} onGo={goPhase} />}
          {run.phase === 5 && (
            <ThreadStage
              {...stage}
              onGo={goPhase}
              onComplete={onComplete}
              onLetters={() => setScreen("letters")}
            />
          )}
        </>
      )}
    </>
  );
}

function PhaseRail({
  run,
  onGo,
}: {
  run: DistillerRun;
  onGo: (p: DistillerPhase) => void;
}) {
  const done = [
    run.clipped.length > 0 && run.phase > 1,
    run.clipped.length > 0 && seenAllFlips(run) && run.phase > 2,
    run.upDone,
    run.downDone,
    run.delivered,
  ];
  return (
    <div className="border-border flex flex-wrap items-center justify-center gap-1 border-b px-3 py-2.5">
      {DISTILLER_PHASES.map((name, i) => {
        const p = (i + 1) as DistillerPhase;
        const active = run.phase === p;
        const reachable = canEnterPhase(p, run);
        return (
          <span key={name} className="flex items-center gap-1">
            {i > 0 && (
              <span
                aria-hidden
                className={cn(
                  "hidden h-px w-4 sm:inline-block sm:w-5",
                  done[i - 1] ? "bg-comply/60" : "bg-border",
                )}
              />
            )}
            <button
              type="button"
              disabled={!reachable}
              aria-current={active ? "step" : undefined}
              onClick={() => onGo(p)}
              className={cn(
                "flex items-center gap-2 rounded-t-lg border-b-2 px-2 py-1.5 transition-colors duration-150 select-none",
                active
                  ? "border-foreground text-foreground"
                  : done[i]
                    ? "border-comply/60 text-comply"
                    : "border-transparent text-muted-foreground",
                reachable ? "hover:bg-muted" : "cursor-default opacity-50",
              )}
            >
              {done[i] && !active ? (
                <Check className="size-3.5 shrink-0" aria-hidden />
              ) : (
                <span className="shrink-0 text-xs font-semibold tabular-nums">
                  {p}
                </span>
              )}
              <span className="text-sm font-semibold">{name}</span>
            </button>
          </span>
        );
      })}
    </div>
  );
}

function PhaseLead({ report, phase }: { report: DistillerReport; phase: DistillerPhase }) {
  const lead: Record<DistillerPhase, { body: React.ReactNode; rubric: string }> = {
    1: {
      body: (
        <>
          A report is mostly true and mostly forgettable.{" "}
          <b className="text-foreground">
            Clip only the handful of facts that would change what a reader does
          </b>{" "}
          and reject the rest.
        </>
      ),
      rubric:
        "The editorial test: “Would any of my audiences act differently knowing this?”",
    },
    2: {
      body: (
        <>
          Each clipping compresses into the post, in the order you filed it.{" "}
          <b className="text-foreground">What you didn&rsquo;t clip simply isn&rsquo;t here.</b>
        </>
      ),
      rubric: "Facts you skipped leave no placeholder. That silence is the point.",
    },
    3: {
      body: report.upstreamPrompt,
      rubric:
        "Every claim in the document rests on somebody’s access. Upstream sets what the report can honestly say.",
    },
    4: {
      body: report.downstreamPrompt,
      rubric: "The readers you confirm become the desks on the threading board.",
    },
    5: {
      body: (
        <>
          Thread each distilled point to the readers who need it.{" "}
          <b className="text-foreground">
            Deliver, and every unanswered question turns red.
          </b>
        </>
      ),
      rubric: "Different readers need different facts, and already know different things.",
    },
  };
  const { body, rubric } = lead[phase];
  return (
    <p className="text-muted-foreground mx-auto max-w-2xl px-4 pt-1 pb-3 text-center text-sm leading-relaxed">
      {body}
      <span className="text-muted-foreground/80 mt-1.5 block text-xs">{rubric}</span>
    </p>
  );
}

function ClipStage({
  report,
  index,
  run,
  update,
  activeSection,
  setActiveSection,
  poolView,
  setPoolView,
  onNext,
}: StageProps & {
  activeSection: string;
  setActiveSection: (id: string) => void;
  poolView: "excerpts" | "report";
  setPoolView: (v: "excerpts" | "report") => void;
  onNext: () => void;
}) {
  const cap = capFor(run, report);
  const docRef = useRef<HTMLDivElement>(null);

  const addClip = (id: string) => {
    update((prev) => {
      if (prev.clipped.includes(id)) return prev;
      if (prev.clipped.length >= cap) {
        toast.message("Notebook full — remove a clipping to swap.");
        return prev;
      }
      return { ...prev, clipped: [...prev.clipped, id], delivered: false };
    });
  };

  const removeClip = (id: string) => {
    update((prev) => {
      const clipped = prev.clipped.filter((x) => x !== id);
      const live = new Set(producedSegs(clipped, index));
      const threads = prev.threads.filter(([seg]) => live.has(seg));
      if (threads.length < prev.threads.length) {
        const n = prev.threads.length - threads.length;
        toast.message(
          `${n} thread${n > 1 ? "s" : ""} dropped — the point it fastened to is gone.`,
        );
      }
      return {
        ...prev,
        clipped,
        flipped: prev.flipped.filter((x) => x !== id),
        threads,
        delivered: false,
      };
    });
  };

  const moveClip = (idx: number, dir: -1 | 1) => {
    update((prev) => {
      const j = idx + dir;
      if (j < 0 || j >= prev.clipped.length) return prev;
      const clipped = [...prev.clipped];
      [clipped[idx], clipped[j]] = [clipped[j], clipped[idx]];
      return { ...prev, clipped, delivered: false };
    });
  };

  const pool = useMemo(
    () =>
      shuffleSeeded(
        report.blocks.filter((b) => b.section === activeSection),
        run.shuffleSeed,
      ),
    [report, activeSection, run.shuffleSeed],
  );

  return (
    <div className="px-4 pb-4">
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <div>
          {report.reportDoc && (
            <div className="border-border bg-card mb-2.5 inline-flex overflow-hidden rounded-md border">
              {(["excerpts", "report"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setPoolView(v)}
                  className={cn(
                    "px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 select-none",
                    poolView === v
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {v === "excerpts" ? "Excerpts" : "Full report"}
                </button>
              ))}
            </div>
          )}

          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {report.sections.map((sec) => {
              const n = report.blocks.filter(
                (b) => b.section === sec.id && run.clipped.includes(b.id),
              ).length;
              const on = poolView === "excerpts" && sec.id === activeSection;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    if (poolView === "report") {
                      docRef.current
                        ?.querySelector(`#dsec-${sec.id}`)
                        ?.scrollIntoView({ block: "start", behavior: "smooth" });
                    } else {
                      setActiveSection(sec.id);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors duration-150 select-none",
                    on
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:bg-muted",
                  )}
                >
                  <span className="font-semibold">{sec.tag}</span>
                  <span className="hidden sm:inline">{sec.name}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 font-semibold",
                      n
                        ? on
                          ? "bg-background/20"
                          : "bg-comply/15 text-comply"
                        : "opacity-50",
                    )}
                  >
                    {n}
                  </span>
                </button>
              );
            })}
          </div>

          {poolView === "report" && report.reportDoc ? (
            <>
              <PaneHead
                title="The full report"
                hint="read it through; tap a highlighted passage to clip it"
              />
              <div
                ref={docRef}
                className="border-border bg-card max-h-[34rem] overflow-y-auto rounded-lg border px-4 py-2"
              >
                {report.sections.map((sec) => {
                  const paras = report.reportDoc?.[sec.id] ?? [];
                  const pages = report.blocks
                    .filter((b) => b.section === sec.id)
                    .map((b) => b.page);
                  return (
                    <section key={sec.id} id={`dsec-${sec.id}`} className="pb-2.5">
                      <h4 className="border-border text-foreground mt-4 mb-2 flex items-baseline gap-2 border-b pb-1.5 text-sm font-semibold first:mt-1">
                        <span className="text-muted-foreground text-xs font-bold">
                          {sec.tag}
                        </span>
                        {sec.name}
                        {pages.length > 0 && (
                          <span className="text-muted-foreground ml-auto text-xs font-semibold">
                            p. {Math.min(...pages)}
                          </span>
                        )}
                      </h4>
                      {paras.map((p, i) =>
                        typeof p === "string" ? (
                          <p
                            key={i}
                            className="text-muted-foreground my-2 text-[0.8rem] leading-relaxed"
                          >
                            {p}
                          </p>
                        ) : (
                          <ReportPassage
                            key={i}
                            block={index.blockById[p.b]}
                            clipped={run.clipped.includes(p.b)}
                            onClip={() => addClip(p.b)}
                          />
                        ),
                      )}
                    </section>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <PaneHead
                title="Candidate clippings"
                hint="tap one to file it in your notebook"
              />
              <div className="border-border bg-card max-h-[34rem] space-y-2.5 overflow-y-auto rounded-lg border p-2.5">
                {pool.map((b) => {
                  const clipped = run.clipped.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      className={cn(
                        "rounded-lg border p-3 transition-colors duration-150",
                        clipped
                          ? "border-comply/40 bg-comply/5"
                          : "border-border bg-background",
                      )}
                    >
                      <BlockTag block={b} source={report.meta.source} />
                      <p className="text-foreground mt-1.5 text-[0.82rem] leading-relaxed">
                        {b.quote}
                      </p>
                      <div className="mt-2">
                        {clipped ? (
                          <span className="text-comply inline-flex items-center gap-1 text-xs font-semibold">
                            <Check className="size-3.5" aria-hidden /> filed
                          </span>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => addClip(b.id)}>
                            <Plus className="size-3.5" aria-hidden /> Clip
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {pool.length === 0 && (
                  <p className="text-muted-foreground p-4 text-center text-sm">
                    No excerpts in this section.
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <div>
          <PaneHead title="Your notebook" />
          <div className="border-border bg-card overflow-hidden rounded-lg border">
            <div className="border-border bg-muted flex items-center justify-between border-b px-3 py-2">
              <span className="text-foreground text-sm font-semibold">Clippings</span>
              <span
                className={cn(
                  "text-xs font-semibold",
                  run.clipped.length >= cap ? "text-exaggerate" : "text-muted-foreground",
                )}
              >
                {run.clipped.length} / {cap} clipped
              </span>
            </div>
            <div className="max-h-[32rem] space-y-2.5 overflow-y-auto p-2.5">
              {run.clipped.length === 0 ? (
                <p className="text-muted-foreground p-6 text-center text-sm">
                  This page is blank.
                  <span className="mt-1 block text-xs">
                    Clip the excerpts that would change what your readers do.
                  </span>
                </p>
              ) : (
                run.clipped.map((id, idx) => {
                  const b = index.blockById[id];
                  return (
                    <div
                      key={id}
                      className="border-border bg-background relative rounded-lg border p-3 pr-9"
                    >
                      <BlockTag block={b} />
                      <p className="text-foreground mt-1.5 text-[0.82rem] leading-relaxed">
                        {b.quote}
                      </p>
                      <button
                        type="button"
                        aria-label="Remove clipping"
                        onClick={() => removeClip(id)}
                        className="text-muted-foreground hover:text-defect absolute top-2 right-2 rounded p-0.5 transition-colors duration-150 select-none"
                      >
                        <X className="size-3.5" aria-hidden />
                      </button>
                      <div className="absolute right-2 bottom-2 flex gap-0.5">
                        <button
                          type="button"
                          aria-label="Move up"
                          disabled={idx === 0}
                          onClick={() => moveClip(idx, -1)}
                          className="text-muted-foreground hover:bg-muted rounded p-0.5 transition-colors duration-150 select-none disabled:opacity-30"
                        >
                          <ChevronUp className="size-3.5" aria-hidden />
                        </button>
                        <button
                          type="button"
                          aria-label="Move down"
                          disabled={idx === run.clipped.length - 1}
                          onClick={() => moveClip(idx, 1)}
                          className="text-muted-foreground hover:bg-muted rounded p-0.5 transition-colors duration-150 select-none disabled:opacity-30"
                        >
                          <ChevronDown className="size-3.5" aria-hidden />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <StageFoot>
        <span className="text-muted-foreground text-sm">
          Notebook: <b className="text-foreground">{run.clipped.length}</b> / {cap} clipped
        </span>
        <Button disabled={run.clipped.length === 0} onClick={onNext}>
          Distil &rarr;
        </Button>
      </StageFoot>
    </div>
  );
}

function ReportPassage({
  block,
  clipped,
  onClip,
}: {
  block: DistillerBlock | undefined;
  clipped: boolean;
  onClip: () => void;
}) {
  if (!block) return null;
  return (
    <div
      className={cn(
        "my-2 rounded-lg border p-2.5 transition-colors duration-150",
        clipped ? "border-comply/40 bg-comply/5" : "border-border bg-muted/40",
      )}
    >
      <span className="text-muted-foreground text-xs font-semibold">p. {block.page}</span>
      <p className="text-foreground mt-1 text-[0.8rem] leading-relaxed">{block.quote}</p>
      <div className="mt-1.5">
        {clipped ? (
          <span className="text-comply inline-flex items-center gap-1 text-xs font-semibold">
            <Check className="size-3.5" aria-hidden /> filed
          </span>
        ) : (
          <Button size="sm" variant="outline" onClick={onClip}>
            <Plus className="size-3.5" aria-hidden /> Clip
          </Button>
        )}
      </div>
    </div>
  );
}

function BlockTag({ block, source }: { block: DistillerBlock; source?: string }) {
  return (
    <span className="text-muted-foreground flex flex-wrap items-center gap-x-2 text-xs">
      <span className="font-semibold">p. {block.page}</span>
      <span>&sect;{block.sec}</span>
      {source && <span className="opacity-70">{source}</span>}
    </span>
  );
}

function PaneHead({ title, hint }: { title: string; hint?: string }) {
  return (
    <h4 className="text-foreground mb-1.5 text-sm font-semibold">
      {title}
      {hint && <span className="text-muted-foreground font-normal"> — {hint}</span>}
    </h4>
  );
}

function StageFoot({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-border mt-4 flex flex-wrap items-center justify-end gap-3 border-t pt-3">
      {children}
    </div>
  );
}

function DistilStage({
  report,
  index,
  run,
  update,
  onGo,
}: StageProps & { onGo: (p: DistillerPhase) => void }) {
  const allSeen = seenAllFlips(run);
  const flip = (id: string) =>
    update((prev) =>
      prev.flipped.includes(id) ? prev : { ...prev, flipped: [...prev.flipped, id] },
    );

  return (
    <div className="mx-auto max-w-3xl px-4 pb-4">
      <div className="border-border mb-4 border-b pb-3">
        <h3 className="text-foreground text-xl leading-tight font-semibold">
          {report.meta.postTitle}
        </h3>
        <p className="text-muted-foreground mt-0.5 text-sm">
          a distillation {report.meta.postByline}
        </p>
      </div>

      {!allSeen && (
        <p className="text-muted-foreground mb-3 text-sm">
          Tap each clipping to compress it into the post. What you didn&rsquo;t clip simply
          isn&rsquo;t here.
        </p>
      )}

      <div className="space-y-3">
        {run.clipped.map((id, idx) => {
          const b = index.blockById[id];
          const seen = run.flipped.includes(id);
          if (!seen) {
            return (
              <button
                key={id}
                type="button"
                onClick={() => flip(id)}
                className="border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-muted flex w-full items-center gap-2.5 rounded-lg border border-dashed p-3 text-left text-sm transition-colors duration-150 select-none"
              >
                <span className="text-muted-foreground shrink-0 text-xs font-medium tabular-nums">
                  {idx + 1}.
                </span>
                Clipping from p. {b.page} — tap to compress
              </button>
            );
          }
          return (
            <div
              key={id}
              className={cn(
                "animate-in fade-in slide-in-from-bottom-1 rounded-lg border p-3.5 duration-300",
                b.core ? "border-border bg-card" : "border-border bg-muted/50",
              )}
            >
              <blockquote className="border-border text-muted-foreground border-l-2 pl-3 text-xs leading-relaxed">
                <span className="mb-0.5 block font-semibold">
                  p. {b.page} &middot; &sect;{b.sec} &middot; {report.meta.source}
                </span>
                {b.quote}
              </blockquote>
              <p
                className={cn(
                  "mt-2.5 leading-relaxed",
                  b.core ? "text-foreground text-[0.92rem]" : "text-muted-foreground text-sm italic",
                )}
              >
                {b.distill}
              </p>
              {!b.core && (
                <p className="text-muted-foreground mt-1.5 text-xs">
                  — filler; nothing here changes what a reader does.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <StageFoot>
        <Button variant="ghost" className="mr-auto" onClick={() => onGo(1)}>
          &larr; Clip
        </Button>
        {allSeen ? (
          <Button onClick={() => onGo(3)}>Trace the actors &rarr;</Button>
        ) : (
          <Button
            variant="secondary"
            onClick={() =>
              update((prev) => ({ ...prev, flipped: [...prev.clipped] }))
            }
          >
            Compress all
          </Button>
        )}
      </StageFoot>
    </div>
  );
}

function ActorStage({
  group,
  sel,
  done,
  commitLabel,
  onToggle,
  onCommit,
  onRevise,
  back,
  next,
  whyFor,
}: {
  group: DistillerActorGroup;
  sel: string[];
  done: boolean;
  commitLabel: string;
  onToggle: (id: string) => void;
  onCommit: () => void;
  onRevise: () => void;
  back: { label: string; go: () => void };
  next: { label: string; go: () => void };
  whyFor: (o: DistillerActor, isKey: boolean) => string;
}) {
  const keyIds = useMemo(() => new Set(group.key.map((o) => o.id)), [group]);
  const options = useMemo(
    () => [...group.key, ...group.distractors],
    [group],
  );
  const score = scoreActors(group, sel);

  return (
    <div className="px-4 pb-4">
      <div className="grid gap-2.5 sm:grid-cols-2">
        {options.map((o) => {
          const isSel = sel.includes(o.id);
          const isKey = keyIds.has(o.id);
          let tone = "border-border bg-card";
          let badge: React.ReactNode = null;
          if (done) {
            if (isKey && isSel) {
              tone = "border-comply/50 bg-comply/5";
              badge = (
                <span className="text-comply ml-auto inline-flex shrink-0 items-center gap-1 text-xs font-semibold">
                  <Check className="size-3.5" aria-hidden /> yes
                </span>
              );
            } else if (isKey) {
              tone = "border-exaggerate/50 bg-exaggerate/5 border-dashed";
              badge = (
                <span className="text-exaggerate ml-auto shrink-0 text-xs font-semibold">
                  missed
                </span>
              );
            } else if (isSel) {
              tone = "border-defect/50 bg-defect/5";
              badge = (
                <span className="text-defect ml-auto inline-flex shrink-0 items-center gap-1 text-xs font-semibold">
                  <X className="size-3.5" aria-hidden /> no
                </span>
              );
            } else {
              badge = (
                <span className="text-muted-foreground ml-auto shrink-0 text-xs">
                  left out
                </span>
              );
            }
          } else if (isSel) {
            tone = "border-primary bg-primary/5";
          }
          const why = done ? whyFor(o, isKey) : "";
          return (
            <div key={o.id} className={cn("rounded-lg border p-3 transition-colors duration-150", tone)}>
              <button
                type="button"
                disabled={done}
                aria-pressed={isSel}
                onClick={() => onToggle(o.id)}
                className="flex w-full items-start gap-2.5 text-left select-none disabled:cursor-default"
              >
                <span
                  className={cn(
                    "mt-0.5 grid size-4 shrink-0 place-items-center rounded border",
                    isSel ? "border-primary bg-primary text-primary-foreground" : "border-border",
                  )}
                >
                  {isSel && <Check className="size-3" aria-hidden />}
                </span>
                <span className="text-foreground text-sm leading-snug font-medium">
                  {o.label}
                </span>
                {badge}
              </button>
              {why && (
                <p className="text-muted-foreground mt-2 pl-6.5 text-xs leading-relaxed">
                  {why}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <StageFoot>
        <Button variant="ghost" className="mr-auto" onClick={back.go}>
          {back.label}
        </Button>
        {done ? (
          <>
            <span className="text-muted-foreground text-sm">
              {score.ok} of {group.key.length} found &middot; {score.wrong} wrong
            </span>
            <Button variant="ghost" onClick={onRevise}>
              Revise picks
            </Button>
            <Button onClick={next.go}>{next.label}</Button>
          </>
        ) : (
          <Button disabled={sel.length === 0} onClick={onCommit}>
            {commitLabel}
          </Button>
        )}
      </StageFoot>
    </div>
  );
}

function UpstreamStage({ report, run, update, onGo }: StageProps & { onGo: (p: DistillerPhase) => void }) {
  return (
    <ActorStage
      group={report.upstream}
      sel={run.upSel}
      done={run.upDone}
      commitLabel="Commit picks"
      onToggle={(id) =>
        update((prev) => ({
          ...prev,
          upSel: prev.upSel.includes(id)
            ? prev.upSel.filter((x) => x !== id)
            : [...prev.upSel, id],
        }))
      }
      onCommit={() => update((prev) => ({ ...prev, upDone: true }))}
      onRevise={() => update((prev) => ({ ...prev, upDone: false }))}
      back={{ label: "← Distil", go: () => onGo(2) }}
      next={{ label: "Who reads it next? →", go: () => onGo(4) }}
      whyFor={(o) => o.why ?? ""}
    />
  );
}

function DownstreamStage({
  report,
  index,
  run,
  update,
  onGo,
}: StageProps & { onGo: (p: DistillerPhase) => void }) {
  return (
    <ActorStage
      group={report.downstream}
      sel={run.downSel}
      done={run.downDone}
      commitLabel="Commit readers"
      onToggle={(id) =>
        update((prev) => ({
          ...prev,
          downSel: prev.downSel.includes(id)
            ? prev.downSel.filter((x) => x !== id)
            : [...prev.downSel, id],
        }))
      }
      onCommit={() => update((prev) => ({ ...prev, downDone: true }))}
      onRevise={() => update((prev) => ({ ...prev, downDone: false }))}
      back={{ label: "← Upstream", go: () => onGo(3) }}
      next={{ label: "Thread to readers →", go: () => onGo(5) }}
      whyFor={(o, isKey) =>
        (isKey ? index.stkById[o.id]?.needsLine : undefined) ?? o.why ?? ""
      }
    />
  );
}

interface Filament {
  seg: string;
  stk: string;
  d: string;
  dim: boolean;
}

function ThreadStage({
  report,
  index,
  run,
  update,
  onGo,
  onComplete,
  onLetters,
}: StageProps & {
  onGo: (p: DistillerPhase) => void;
  onComplete: () => void;
  onLetters: () => void;
}) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<Filament[]>([]);
  const [armed, setArmed] = useState<{ type: "seg" | "stk"; id: string } | null>(null);
  const [focusStk, setFocusStk] = useState<string | null>(null);

  const segs = useMemo(() => producedSegs(run.clipped, index), [run.clipped, index]);
  const verdict = run.delivered ? evaluateRun(run.threads, report) : null;

  const addThread = useCallback(
    (seg: string, stk: string) => {
      if (!segs.includes(seg) || !index.stkById[stk]) return;
      update((prev) => {
        if (prev.threads.some((t) => t[0] === seg && t[1] === stk)) {
          toast.message("Already threaded.");
          return prev;
        }
        return { ...prev, threads: [...prev.threads, [seg, stk]], delivered: false };
      });
      setFocusStk(null);
    },
    [segs, index, update],
  );

  const removeThread = (i: number) => {
    update((prev) => ({
      ...prev,
      threads: prev.threads.filter((_, j) => j !== i),
      delivered: false,
    }));
    setFocusStk(null);
  };

  const measure = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;
    const b = board.getBoundingClientRect();
    const centre = (sel: string) => {
      const el = board.querySelector<HTMLElement>(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 - b.left, y: r.top + r.height / 2 - b.top };
    };
    const next: Filament[] = [];
    for (const [seg, stk] of run.threads) {
      const a = centre(`[data-pin="seg:${CSS.escape(seg)}"]`);
      const c = centre(`[data-pin="stk:${CSS.escape(stk)}"]`);
      if (!a || !c) continue;
      const dist = Math.hypot(c.x - a.x, c.y - a.y);
      const mx = (a.x + c.x) / 2;
      const my = (a.y + c.y) / 2 + Math.min(70, dist * 0.18) + 14;
      next.push({
        seg,
        stk,
        d: `M ${a.x} ${a.y} Q ${mx} ${my} ${c.x} ${c.y}`,
        dim: !!focusStk && stk !== focusStk,
      });
    }
    setPaths(next);
  }, [run.threads, focusStk]);

  useLayoutEffect(measure, [measure]);
  useEffect(() => {
    const board = boardRef.current;
    if (!board || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(board);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const tapPin = (type: "seg" | "stk", id: string) => {
    if (run.delivered) return;
    if (!armed || armed.type === type) {
      setArmed({ type, id });
      toast.message(
        type === "seg" ? "Now tap a reader’s pin." : "Now tap a point’s pin.",
      );
      return;
    }
    addThread(type === "seg" ? id : armed.id, type === "stk" ? id : armed.id);
    setArmed(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setArmed(null);
      setFocusStk(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const deliver = () => {
    if (!run.threads.length) return;
    const ev = evaluateRun(run.threads, report);
    update((prev) => {
      const summary = summarize({ ...prev, delivered: true }, report, index);
      return {
        ...prev,
        delivered: true,
        runs: prev.runs + 1,
        best:
          !prev.best || summary.answered > prev.best.answered ? summary : prev.best,
        tightUnlocked:
          prev.tightUnlocked || (ev.ok === ev.total && prev.mode === "standard"),
      };
    });
    onComplete();
    toast.success(
      ev.ok === ev.total
        ? "Every reader got what they needed."
        : `${ev.ok} / ${ev.total} questions answered.`,
    );
  };

  const filler = run.clipped.filter((id) => !index.blockById[id]?.core).length;

  return (
    <div className="px-4 pb-4">
      {verdict && (
        <div
          className={cn(
            "mb-4 rounded-lg border p-3",
            verdict.ok === verdict.total
              ? "border-comply/50 bg-comply/5"
              : "border-defect/50 bg-defect/5",
          )}
        >
          <p className="text-foreground text-sm font-semibold">
            {verdict.ok} / {verdict.total} reader questions answered
          </p>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            {verdict.ok === verdict.total
              ? "Every question answered. Select a reader to trace their threads."
              : "Each red question expands to the block that would have answered it. A fact you never clipped can’t reach anyone — that gap is the lesson."}
            {filler > 0 &&
              ` You spent ${filler} clip${filler > 1 ? "s" : ""} on filler that reached no one.`}
          </p>
        </div>
      )}

      <div ref={boardRef} className="relative">
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden size-full lg:block"
        >
          {paths.map((p) => (
            <path
              key={`${p.seg}|${p.stk}`}
              d={p.d}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={p.dim ? 1.4 : 2.2}
              strokeLinecap="round"
              opacity={p.dim ? 0.35 : 1}
            />
          ))}
        </svg>

        <div className="relative grid items-start gap-5 lg:grid-cols-2">
          <div className="space-y-2.5">
            <h4 className="text-foreground text-sm font-semibold">
              Your distilled points
            </h4>
            {segs.length === 0 && (
              <p className="text-muted-foreground text-sm">
                You distilled no substantive points — go back and clip the facts that
                matter.
              </p>
            )}
            {segs.map((segId) => {
              const s = index.segById[segId];
              const lit = focusStk
                ? run.threads.some((t) => t[0] === segId && t[1] === focusStk)
                : false;
              return (
                <div
                  key={segId}
                  className={cn(
                    "relative rounded-lg border p-3 pr-7 transition-opacity duration-150",
                    lit ? "border-primary bg-primary/5" : "border-border bg-card",
                    focusStk && !lit && "opacity-45",
                  )}
                >
                  <span className="text-muted-foreground text-xs font-semibold">
                    p. {s.page} &middot; &sect;{s.sec}
                  </span>
                  <p className="text-foreground mt-1 text-[0.85rem] leading-relaxed">
                    {s.text}
                  </p>
                  <Pin
                    type="seg"
                    id={segId}
                    armed={armed?.type === "seg" && armed.id === segId}
                    disabled={run.delivered}
                    label="Pull a thread from this point"
                    onTap={() => tapPin("seg", segId)}
                  />
                </div>
              );
            })}
          </div>

          <div className="space-y-2.5">
            <h4 className="text-foreground text-sm font-semibold">
              Who needs to hear it
            </h4>
            {report.stakeholders.map((s) => (
              <StakeholderCard
                key={s.id}
                stk={s}
                index={index}
                run={run}
                verdict={verdict}
                armed={armed?.type === "stk" && armed.id === s.id}
                focused={focusStk === s.id}
                dimmed={!!focusStk && focusStk !== s.id}
                onTapPin={() => tapPin("stk", s.id)}
                onFocus={() =>
                  setFocusStk((cur) => (cur === s.id ? null : s.id))
                }
                onRemoveThread={removeThread}
              />
            ))}
          </div>
        </div>
      </div>

      <StageFoot>
        <Button variant="ghost" className="mr-auto" onClick={() => onGo(4)}>
          &larr; Downstream
        </Button>
        <span className="text-muted-foreground text-sm">
          {run.threads.length} thread{run.threads.length === 1 ? "" : "s"} pinned
        </span>
        {run.delivered ? (
          <>
            <Button
              variant="secondary"
              onClick={() => {
                update((prev) => ({ ...prev, delivered: false }));
                setFocusStk(null);
              }}
            >
              Revise
            </Button>
            <Button onClick={onLetters}>Read the reports &rarr;</Button>
          </>
        ) : (
          <Button disabled={run.threads.length === 0} onClick={deliver}>
            Deliver reports
          </Button>
        )}
      </StageFoot>
    </div>
  );
}

function Pin({
  type,
  id,
  armed,
  disabled,
  label,
  onTap,
}: {
  type: "seg" | "stk";
  id: string;
  armed: boolean;
  disabled: boolean;
  label: string;
  onTap: () => void;
}) {
  return (
    <button
      type="button"
      data-pin={`${type}:${id}`}
      disabled={disabled}
      aria-pressed={armed}
      aria-label={label}
      title={label}
      onClick={onTap}
      className={cn(
        "absolute top-3 right-2 size-3.5 rounded-full border-2 transition-transform duration-150 select-none",
        armed
          ? "border-primary bg-primary scale-125"
          : "border-primary/60 bg-background hover:scale-110",
        disabled && "cursor-default opacity-40",
      )}
    />
  );
}

function StakeholderCard({
  stk,
  index,
  run,
  verdict,
  armed,
  focused,
  dimmed,
  onTapPin,
  onFocus,
  onRemoveThread,
}: {
  stk: DistillerStakeholder;
  index: DistillerIndex;
  run: DistillerRun;
  verdict: ReturnType<typeof evaluateRun> | null;
  armed: boolean;
  focused: boolean;
  dimmed: boolean;
  onTapPin: () => void;
  onFocus: () => void;
  onRemoveThread: (i: number) => void;
}) {
  const mine = run.threads
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => t[1] === stk.id);
  const wasted = verdict?.wasted[stk.id] ?? [];

  return (
    <div
      className={cn(
        "relative rounded-lg border p-3 pr-7 transition-opacity duration-150",
        focused ? "border-primary bg-primary/5" : "border-border bg-card",
        dimmed && "opacity-45",
      )}
    >
      <Pin
        type="stk"
        id={stk.id}
        armed={armed}
        disabled={run.delivered}
        label={`Fasten a thread to ${stk.name}`}
        onTap={onTapPin}
      />

      <div className="flex items-center gap-2.5">
        <span className="border-border bg-muted text-foreground grid size-8 shrink-0 place-items-center rounded-full border text-xs font-bold">
          {stk.glyph}
        </span>
        <span>
          <span className="text-foreground block text-sm font-semibold">{stk.name}</span>
          <span className="text-muted-foreground block text-xs">{stk.role}</span>
        </span>
      </div>

      {stk.needsLine && (
        <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
          {stk.needsLine}
        </p>
      )}
      <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
        <b className="text-foreground">Already knows:</b> {stk.knows}
      </p>

      {mine.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {mine.map(({ t, i }) => (
            <span
              key={`${t[0]}-${i}`}
              className="border-primary/50 bg-primary/10 text-foreground inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs"
            >
              p. {index.segById[t[0]]?.page}
              {!run.delivered && (
                <button
                  type="button"
                  aria-label="Remove this thread"
                  onClick={() => onRemoveThread(i)}
                  className="hover:text-defect transition-colors duration-150 select-none"
                >
                  <X className="size-3" aria-hidden />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      <ul className="mt-2.5 space-y-1.5">
        {stk.questions.map((q) => {
          const ok = verdict?.answered[q.id];
          const blk = verdict && !ok ? blockForSeg(q.answers[0], index) : null;
          return (
            <li
              key={q.id}
              className={cn(
                "rounded-md border p-2 text-xs leading-relaxed",
                verdict
                  ? ok
                    ? "border-comply/40 bg-comply/5"
                    : "border-defect/40 bg-defect/5"
                  : "border-border",
              )}
            >
              <span className="text-foreground block font-medium">{q.need}</span>
              <span className="text-muted-foreground mt-0.5 block">
                Needs: {q.check}
              </span>
              {verdict && (
                <span
                  className={cn(
                    "mt-1 inline-flex items-center gap-1 font-semibold",
                    ok ? "text-comply" : "text-defect",
                  )}
                >
                  {ok ? (
                    <>
                      <Check className="size-3.5" aria-hidden /> answered
                    </>
                  ) : (
                    <>
                      <X className="size-3.5" aria-hidden /> unanswered
                    </>
                  )}
                </span>
              )}
              {blk && (
                <span className="border-border text-muted-foreground mt-1.5 block border-t pt-1.5">
                  <b className="text-foreground">
                    p. {blk.page} &middot; &sect;{blk.sec}
                  </b>{" "}
                  — {blk.quote}
                  <span className="mt-1 block">
                    <b className="text-foreground">Why it mattered:</b> {blk.why}
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {wasted.length > 0 && (
        <p className="border-exaggerate/40 bg-exaggerate/5 text-muted-foreground mt-2 rounded-md border p-2 text-xs leading-relaxed">
          You threaded {wasted.length} point{wasted.length > 1 ? "s" : ""} they already
          knew — words spent on somebody who did not need them.
        </p>
      )}

      {run.delivered && mine.length > 0 && (
        <button
          type="button"
          onClick={onFocus}
          aria-pressed={focused}
          className="text-brand-ink mt-2 text-xs font-semibold underline underline-offset-2 select-none"
        >
          {focused ? "Clear trace" : "Trace their threads"}
        </button>
      )}
    </div>
  );
}

function Letters({
  report,
  index,
  run,
  update,
  onBack,
}: StageProps & { onBack: () => void }) {
  const verdict = evaluateRun(run.threads, report);
  const ordered = producedSegs(run.clipped, index);

  const startTight = () => {
    update((prev) => ({
      ...freshRun((prev.shuffleSeed + 7919) | 0),
      mode: "tight",
      best: prev.best,
      runs: prev.runs,
      tightUnlocked: prev.tightUnlocked,
    }));
    onBack();
    toast.message(
      `Tight budget: ${report.meta.tightCap} clips, same facts that matter. Triage.`,
    );
  };

  return (
    <div className="px-4 py-4">
      <p className="text-muted-foreground mx-auto mb-4 max-w-2xl text-center text-sm leading-relaxed">
        Every reader gets the report you actually threaded them — no more, no less. Where a
        question went unanswered, the letter says so plainly.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        {report.stakeholders.map((s) => {
          const got = new Set(
            run.threads.filter((t) => t[1] === s.id).map((t) => t[0]),
          );
          const points = ordered.filter((seg) => got.has(seg));
          const reds = s.questions.filter((q) => !verdict.answered[q.id]);
          return (
            <div key={s.id} className="border-border bg-card rounded-lg border p-4">
              <p className="text-foreground text-sm font-semibold">
                Dear {s.salute || s.name.split(" ")[0]},
              </p>
              <p className="text-muted-foreground mb-2 text-xs">{s.role}</p>
              {points.length > 0 ? (
                points.map((seg) => (
                  <p
                    key={seg}
                    className="text-foreground mt-2 text-[0.85rem] leading-relaxed"
                  >
                    {index.segById[seg].text}
                  </p>
                ))
              ) : (
                <p className="text-muted-foreground mt-2 text-sm italic">
                  — you sent this reader nothing.
                </p>
              )}
              {reds.map((q) => (
                <p
                  key={q.id}
                  className="border-defect/40 bg-defect/5 text-muted-foreground mt-2 rounded-md border p-2 text-xs leading-relaxed"
                >
                  <b className="text-foreground">Still unanswered:</b> {q.need}
                </p>
              ))}
              <p className="text-muted-foreground mt-3 text-xs">— your distillation</p>
            </div>
          );
        })}
      </div>

      <StageFoot>
        <Button variant="ghost" className="mr-auto" onClick={onBack}>
          &larr; Back to the board
        </Button>
        {run.tightUnlocked && run.mode === "standard" && (
          <Button variant="secondary" onClick={startTight}>
            Try tight-budget mode
          </Button>
        )}
      </StageFoot>
    </div>
  );
}
