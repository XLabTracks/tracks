"use client";

import { useState } from "react";
import { ArrowRight, CircleAlert, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { readColdCall } from "./cold-open";
import {
  DESK_DISPOSITIONS,
  DESK_MAX_MOVES,
  DESK_MIN_BLIND,
  DESK_MIN_DISSENT,
  DESK_MOVES,
  DESK_SIGNALS,
  scoreDeskCall,
  type DeskConfidence,
  type DeskDispositionId,
  type DeskMoveId,
} from "@/lib/verification/data/analyst-desk";
import { SegMeter } from "../kit/seg-meter";
import { useStoredState } from "../kit/use-stored-state";
import type { VerificationWidgetProps } from "../kit/types";

const STORAGE_KEY = "v-analyst-desk:v1";
const CONFIDENCES: DeskConfidence[] = ["low", "medium", "high"];

interface SignalRecord {
  moves: DeskMoveId[];
  disposition: DeskDispositionId | null;
  confidence: DeskConfidence | null;
  reasoning: string;
  dissent: string;
  blind: string;
  done: boolean;
}

interface Saved {
  cursor: number;
  signals: Record<string, SignalRecord>;
}

const EMPTY: Saved = { cursor: -1, signals: {} };

const EMPTY_RECORD: SignalRecord = {
  moves: [],
  disposition: null,
  confidence: null,
  reasoning: "",
  dissent: "",
  blind: "",
  done: false,
};

const MOVE_IDS = new Set<string>(Object.keys(DESK_MOVES));
const DISPOSITION_IDS = new Set<string>(DESK_DISPOSITIONS.map((d) => d.id));

function prune(raw: unknown): Saved {
  if (typeof raw !== "object" || raw === null) return EMPTY;
  const box = raw as Partial<Saved>;
  const signals: Record<string, SignalRecord> = {};
  for (const signal of DESK_SIGNALS) {
    const r = box.signals?.[signal.id];
    if (typeof r !== "object" || r === null) continue;
    const rec = r as Partial<SignalRecord>;
    signals[signal.id] = {
      moves: Array.isArray(rec.moves)
        ? (rec.moves.filter(
            (m): m is DeskMoveId =>
              typeof m === "string" && MOVE_IDS.has(m) && m in signal.moves,
          ).slice(0, DESK_MAX_MOVES))
        : [],
      disposition:
        typeof rec.disposition === "string" && DISPOSITION_IDS.has(rec.disposition)
          ? (rec.disposition as DeskDispositionId)
          : null,
      confidence: CONFIDENCES.includes(rec.confidence as DeskConfidence)
        ? (rec.confidence as DeskConfidence)
        : null,
      reasoning: typeof rec.reasoning === "string" ? rec.reasoning : "",
      dissent: typeof rec.dissent === "string" ? rec.dissent : "",
      blind: typeof rec.blind === "string" ? rec.blind : "",
      done: rec.done === true,
    };
  }
  const cursor =
    typeof box.cursor === "number" &&
    Number.isInteger(box.cursor) &&
    box.cursor >= -1 &&
    box.cursor <= DESK_SIGNALS.length
      ? box.cursor
      : -1;
  return { cursor, signals };
}

function recordOf(saved: Saved, id: string): SignalRecord {
  return saved.signals[id] ?? EMPTY_RECORD;
}

function doneCount(saved: Saved): number {
  return DESK_SIGNALS.filter((s) => recordOf(saved, s.id).done).length;
}

function firstOpen(saved: Saved): number {
  for (let i = 0; i < DESK_SIGNALS.length; i++) {
    if (!recordOf(saved, DESK_SIGNALS[i]!.id).done) return i;
  }
  return DESK_SIGNALS.length;
}

export function AnalystDesk({ onComplete }: VerificationWidgetProps) {
  const [saved, persist, hydrated] = useStoredState(STORAGE_KEY, EMPTY, prune);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!hydrated) return <div className="not-prose my-6 min-h-96" aria-busy />;

  const finished = doneCount(saved) >= DESK_SIGNALS.length;

  return (
    <div className="not-prose my-6 space-y-4">
      {saved.cursor === -1 ? (
        <Intro
          resumable={doneCount(saved) > 0}
          onStart={() => persist((prev) => ({ ...prev, cursor: firstOpen(prev) }))}
        />
      ) : saved.cursor >= DESK_SIGNALS.length && finished ? (
        <Report
          saved={saved}
          onReview={() => persist((prev) => ({ ...prev, cursor: 0 }))}
        />
      ) : (
        <SignalScreen
          saved={saved}
          persist={persist}
          index={Math.min(saved.cursor, DESK_SIGNALS.length - 1)}
          drawerOpen={drawerOpen}
          onToggleDrawer={() => setDrawerOpen((v) => !v)}
          onComplete={onComplete}
        />
      )}
    </div>
  );
}

function Intro({ resumable, onStart }: { resumable: boolean; onStart: () => void }) {
  return (
    <div className="border-border bg-card space-y-3 rounded-xl border p-4">
      <p className="eyebrow text-muted-foreground">The Analyst Desk</p>
      <p className="text-sm leading-relaxed">
        You are the treaty organization’s duty analyst. For each signal in the
        queue: run up to two investigation moves (evidence has a price —
        choose), then commit a disposition, a confidence, your reasoning, the
        strongest dissent against your own call, and the blind spot you cannot
        close from here. All three records are required — that is what a
        professional assessment looks like on paper. The queue ends at
        recommendations: executing an inspection belongs to the human layer
        (2.4).
      </p>
      <p className="text-muted-foreground text-sm leading-relaxed">
        How this is scored: on calibration, not paranoia. A thin-evidence
        inspection demand costs you what it costs the regime — credibility. A
        missed strong lead costs the treaty. Confidence is scored too: wrong
        and loud is the failure mode this desk exists to break.
      </p>
      <Button size="sm" onClick={onStart}>
        {resumable ? "Resume the queue" : "Open the queue"}
      </Button>
    </div>
  );
}

function ReferenceDrawer() {
  return (
    <div className="border-border bg-muted/40 space-y-2 rounded-xl border p-4 text-sm leading-relaxed">
      <p className="font-medium">The ladder</p>
      <p className="text-muted-foreground">
        Anomaly → verification lead → evidence of suspected non-compliance.
        Each promotion is earned by corroboration across evidence kinds —
        physical, procurement, financial, digital, organizational — which fail
        differently, so their agreement means something.
      </p>
      <p className="font-medium">The signature anatomy</p>
      <p className="text-muted-foreground">
        Per signature: what it establishes · what cooperation it needs · its
        main caveat. Imagery sees facilities, not workloads. Thermal proves
        operation, not purpose. Power bounds compute coarsely and decays
        ~1.6×/yr. Procurement and money corroborate; open sources point the
        other sensors. The base rate: ~500 sites above 10 MW, ~0–1 genuine
        covert programs.
      </p>
    </div>
  );
}

function SignalScreen({
  saved,
  persist,
  index,
  drawerOpen,
  onToggleDrawer,
  onComplete,
}: {
  saved: Saved;
  persist: (next: Saved | ((prev: Saved) => Saved)) => void;
  index: number;
  drawerOpen: boolean;
  onToggleDrawer: () => void;
  onComplete?: () => void;
}) {
  const signal = DESK_SIGNALS[index]!;
  const record = recordOf(saved, signal.id);
  const update = (patch: Partial<SignalRecord>) =>
    persist((prev) => ({
      ...prev,
      signals: {
        ...prev.signals,
        [signal.id]: { ...recordOf(prev, signal.id), ...patch },
      },
    }));

  const movesLeft = DESK_MAX_MOVES - record.moves.length;
  const lints: string[] = [];
  if (!record.disposition) lints.push("pick a disposition");
  if (!record.confidence) lints.push("pick a confidence");
  if (record.reasoning.trim().length < 20) lints.push("reasoning under 20 chars");
  if (record.dissent.trim().length < DESK_MIN_DISSENT)
    lints.push(
      `dissent under ${DESK_MIN_DISSENT} chars — steelman the other call, or say why it fails`,
    );
  if (record.blind.trim().length < DESK_MIN_BLIND)
    lints.push(
      `blind spot under ${DESK_MIN_BLIND} chars — name what you can't see from here`,
    );
  const ready = lints.length === 0;

  const commit = () => {
    persist((prev) => {
      const next: Saved = {
        ...prev,
        signals: {
          ...prev.signals,
          [signal.id]: { ...recordOf(prev, signal.id), done: true },
        },
      };
      return next;
    });
  };

  if (record.done) {
    return (
      <Debrief
        saved={saved}
        signal={signal}
        record={record}
        index={index}
        onNext={() => {
          persist((prev) => {
            const open = firstOpen(prev);
            const next =
              open >= DESK_SIGNALS.length && index + 1 < DESK_SIGNALS.length
                ? index + 1
                : open;
            if (open >= DESK_SIGNALS.length) onComplete?.();
            return { ...prev, cursor: next };
          });
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="text-base font-semibold">
          Signal {index + 1} of {DESK_SIGNALS.length}
        </h4>
        <p className="text-muted-foreground text-xs">
          {doneCount(saved)} committed · no take-backs — calibration is the point
        </p>
      </div>
      <SegMeter
        total={DESK_SIGNALS.length}
        filled={(i) => i < doneCount(saved)}
        label={`Signal ${index + 1} of ${DESK_SIGNALS.length}`}
      />

      <div className="border-border bg-card rounded-xl border p-4">
        <p className="eyebrow text-muted-foreground">
          {signal.chip} · incoming signal
        </p>
        <p className="mt-1 text-sm font-semibold">{signal.title}</p>
        <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
          {signal.dossier}
        </p>
      </div>

      <div>
        <button
          type="button"
          onClick={onToggleDrawer}
          aria-expanded={drawerOpen}
          className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-4"
        >
          {drawerOpen ? "Close the reference drawer" : "Open the reference drawer — the ladder and the anatomy"}
        </button>
        {drawerOpen ? (
          <div className="mt-2">
            <ReferenceDrawer />
          </div>
        ) : null}
      </div>

      <div className="border-border rounded-xl border p-4">
        <p className="text-sm font-medium">Investigate</p>
        <p className="text-muted-foreground mt-1 text-xs">
          {movesLeft > 0
            ? `${movesLeft} of ${DESK_MAX_MOVES} moves left. Each reveals what it actually establishes.`
            : "No moves left — commit below."}
        </p>
        <div className="mt-2 space-y-2">
          {(Object.keys(signal.moves) as DeskMoveId[]).map((moveId) => {
            const used = record.moves.includes(moveId);
            const spent = !used && movesLeft <= 0;
            return (
              <div key={moveId}>
                <button
                  type="button"
                  disabled={spent}
                  aria-pressed={used}
                  onClick={() => {
                    if (used || record.moves.length >= DESK_MAX_MOVES) return;
                    update({ moves: [...record.moves, moveId] });
                  }}
                  className={cn(
                    "border-border w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                    used
                      ? "border-primary bg-primary/10 font-medium"
                      : spent
                        ? "text-muted-foreground opacity-60"
                        : "hover:bg-muted",
                  )}
                >
                  {DESK_MOVES[moveId].label}
                  <span className="text-muted-foreground ml-2 text-xs">
                    {DESK_MOVES[moveId].kind}
                  </span>
                </button>
                {used ? (
                  <p className="border-border bg-muted/40 mt-1 rounded-lg border p-3 text-sm leading-relaxed">
                    {signal.moves[moveId]}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-border rounded-xl border p-4">
        <p className="text-sm font-medium">Disposition</p>
        <div className="mt-2 space-y-2">
          {DESK_DISPOSITIONS.map((d) => (
            <button
              key={d.id}
              type="button"
              aria-pressed={record.disposition === d.id}
              onClick={() => update({ disposition: d.id })}
              className={cn(
                "border-border w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                record.disposition === d.id
                  ? "border-primary bg-primary/10 font-medium"
                  : "hover:bg-muted",
              )}
            >
              {d.label}
              <span className="text-muted-foreground ml-2 text-xs">{d.hint}</span>
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm font-medium">Confidence</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {CONFIDENCES.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={record.confidence === c}
              onClick={() => update({ confidence: c })}
              className={cn(
                "border-border rounded-lg border px-2.5 py-1.5 text-xs transition-colors",
                record.confidence === c
                  ? "border-primary bg-primary/10 font-medium"
                  : "hover:bg-muted",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <label className="mt-4 block text-sm font-medium" htmlFor={`reason-${signal.id}`}>
          Reasoning — make it visible
        </label>
        <Textarea
          id={`reason-${signal.id}`}
          value={record.reasoning}
          onChange={(e) => update({ reasoning: e.target.value })}
          placeholder="What exactly are you doing? Why? How does it help?"
          className="mt-1.5 min-h-16"
        />

        <label className="mt-3 block text-sm font-medium" htmlFor={`dissent-${signal.id}`}>
          Dissent (required) — the strongest argument against your own disposition
        </label>
        <Textarea
          id={`dissent-${signal.id}`}
          value={record.dissent}
          onChange={(e) => update({ dissent: e.target.value })}
          placeholder="Steelman the other call. If the counter-argument is genuinely weak, say so and say why — that is also a dissent record."
          className="mt-1.5 min-h-14"
        />

        <label className="mt-3 block text-sm font-medium" htmlFor={`blind-${signal.id}`}>
          Blind spot (required) — what can’t you see from here, and what would change your mind
        </label>
        <Textarea
          id={`blind-${signal.id}`}
          value={record.blind}
          onChange={(e) => update({ blind: e.target.value })}
          placeholder="Name the evidence you don't have and the observation that would flip your disposition."
          className="mt-1.5 min-h-14"
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs">
            {ready ? "Ready to commit." : lints[0]}
          </p>
          <Button size="sm" disabled={!ready} onClick={commit}>
            Commit recommendation
          </Button>
        </div>
      </div>
    </div>
  );
}

function Debrief({
  saved,
  signal,
  record,
  index,
  onNext,
}: {
  saved: Saved;
  signal: (typeof DESK_SIGNALS)[number];
  record: SignalRecord;
  index: number;
  onNext: () => void;
}) {
  const score = scoreDeskCall(signal, record.disposition!, record.confidence!);
  const dispositionLabel =
    DESK_DISPOSITIONS.find((d) => d.id === record.disposition)?.label ?? "";
  const coldCall = index === 0 ? readColdCall() : null;
  const coldLabel = coldCall
    ? DESK_DISPOSITIONS.find((d) => d.id === coldCall.disposition)?.label
    : null;
  const allDone = doneCount(saved) >= DESK_SIGNALS.length;
  const nextLabel = allDone
    ? index + 1 < DESK_SIGNALS.length
      ? "Next debrief"
      : "Calibration report"
    : "Next signal";
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="text-base font-semibold">
          Signal {index + 1} of {DESK_SIGNALS.length} · debrief
        </h4>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="border-border rounded-xl border p-4">
          <p className="eyebrow text-muted-foreground">You committed</p>
          <p className="mt-1 text-sm leading-relaxed">
            {dispositionLabel}{" "}
            <span className="text-muted-foreground">· {record.confidence}</span>
          </p>
        </div>
        <div className="border-border rounded-xl border p-4">
          <p className="eyebrow text-muted-foreground">Ground truth</p>
          <p className="mt-1 text-sm leading-relaxed">{signal.truth}</p>
        </div>
      </div>
      <p
        className={cn(
          "flex items-start gap-1.5 text-sm",
          score.verdict === "burn" ? "text-defect" : "text-comply",
        )}
      >
        {score.verdict === "burn" ? (
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
        ) : (
          <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
        )}
        <span>
          Disposition: {score.verdict} ({score.pts > 0 ? "+" : ""}
          {score.pts})
          {score.conf !== 0
            ? ` · confidence modifier: ${score.conf > 0 ? "+" : ""}${score.conf}`
            : ""}{" "}
          · signal total: {score.total > 0 ? "+" : ""}
          {score.total}
        </span>
      </p>
      <div className="border-border bg-muted/40 rounded-xl border p-4">
        <p className="eyebrow text-muted-foreground">Debrief</p>
        <p className="mt-1 text-sm leading-relaxed">{signal.debrief}</p>
      </div>
      {coldCall && coldLabel ? (
        <div className="border-border rounded-xl border p-4">
          <p className="eyebrow text-muted-foreground">
            Your cold call, unsealed
          </p>
          <p className="mt-1 text-sm leading-relaxed">
            Back in 2.3.0 you called this same dossier unaided:{" "}
            <span className="font-medium">{coldLabel}</span> at{" "}
            <span className="font-medium">{coldCall.confidence} confidence</span>
            .{" "}
            {coldCall.disposition === record.disposition
              ? "The module did not move your disposition; check whether it moved your reasons."
              : "The module moved your call. What you learned in between is the difference."}
          </p>
        </div>
      ) : null}
      {record.dissent ? (
        <div className="border-border rounded-xl border p-4">
          <p className="eyebrow text-muted-foreground">Your dissent, on the record</p>
          <p className="mt-1 text-sm leading-relaxed">{record.dissent}</p>
        </div>
      ) : null}
      {record.blind ? (
        <div className="border-border rounded-xl border p-4">
          <p className="eyebrow text-muted-foreground">Your blind spot, on the record</p>
          <p className="mt-1 text-sm leading-relaxed">{record.blind}</p>
        </div>
      ) : null}
      <Button size="sm" onClick={onNext} className="gap-2">
        {nextLabel}
        <ArrowRight className="size-4" aria-hidden />
      </Button>
    </div>
  );
}

function Report({
  saved,
  onReview,
}: {
  saved: Saved;
  onReview: () => void;
}) {
  const rows = DESK_SIGNALS.map((signal) => {
    const record = recordOf(saved, signal.id);
    const score = scoreDeskCall(signal, record.disposition!, record.confidence!);
    return { signal, record, score };
  });
  const total = rows.reduce((n, r) => n + r.score.total, 0);
  const max = DESK_SIGNALS.length * 3;
  const bests = rows.filter((r) => r.score.verdict === "best").length;
  const burns = rows.filter(
    (r) => r.score.verdict === "burn" && r.record.disposition === "inspect",
  ).length;
  const misses = rows.filter(
    (r) => r.score.verdict === "burn" && r.record.disposition !== "inspect",
  ).length;
  const dissents = rows.filter((r) => r.record.dissent.trim().length > 0).length;

  const dispositionCounts = new Map<string, number>();
  const confidenceCounts = new Map<string, number>();
  for (const r of rows) {
    dispositionCounts.set(
      r.record.disposition!,
      (dispositionCounts.get(r.record.disposition!) ?? 0) + 1,
    );
    confidenceCounts.set(
      r.record.confidence!,
      (confidenceCounts.get(r.record.confidence!) ?? 0) + 1,
    );
  }
  let flatDisposition: string | null = null;
  for (const [d, n] of dispositionCounts) {
    if (n >= DESK_SIGNALS.length - 1) flatDisposition = d;
  }
  let flatConfidence: string | null = null;
  for (const [c, n] of confidenceCounts) {
    if (n === rows.length) flatConfidence = c;
  }

  let reading = flatDisposition
    ? `Flat run detected: "${flatDisposition}" on ${dispositionCounts.get(flatDisposition)} of ${DESK_SIGNALS.length} signals. A constant disposition is not calibration — it is one judgment repeated, and the queue was built so that every rung is the best call somewhere. Whatever the score says, this run avoided the decisions the desk exists to practice. Reset and read the dossiers.`
    : burns > 0 && misses > 0
      ? "Both failure modes fired: thin-evidence escalation AND a missed strong lead. Re-read the ladder — promotion is earned by corroboration, and silence is also a decision."
      : burns > 0
        ? "Your error leans paranoid: inspection demands the evidence had not earned. The base rate is the discipline — ~5 false alarms wait for every real program."
        : misses > 0
          ? "Your error leans quiet: a corroborated lead got logged. False alarms cost credibility, but the miss costs the treaty."
          : "No burns, no misses — the queue was read calibrated. The remaining spread is confidence discipline.";
  if (flatConfidence) {
    reading += ` Confidence was "${flatConfidence}" on every signal — a flat confidence carries no information; the record is supposed to say where you would bet and where you would hedge.`;
  }
  if (dissents === 0) {
    reading +=
      " Zero dissents across six ambiguous signals is itself a datum: certainty this uniform usually means the counter-argument went unrecorded, not unfound.";
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="text-base font-semibold">Calibration report</h4>
        <p className="text-muted-foreground text-xs">
          {total} / {max}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { n: bests, label: "best calls" },
          { n: burns, label: "thin-evidence escalations" },
          { n: misses, label: "missed leads" },
          { n: dissents, label: "dissents recorded" },
        ].map((box) => (
          <div key={box.label} className="border-border rounded-xl border p-3 text-center">
            <p className="text-lg font-semibold">{box.n}</p>
            <p className="text-muted-foreground text-xs">{box.label}</p>
          </div>
        ))}
      </div>
      <div className="border-border bg-muted/40 rounded-xl border p-4">
        <p className="eyebrow text-muted-foreground">Reading</p>
        <p className="mt-1 text-sm leading-relaxed">{reading}</p>
      </div>
      <div className="border-border overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border border-b text-left">
              <th className="p-3 font-medium">Signal</th>
              <th className="p-3 font-medium">Your call</th>
              <th className="p-3 font-medium">Verdict</th>
              <th className="p-3 font-medium">Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.signal.id} className="border-border border-b last:border-b-0">
                <td className="p-3">{r.signal.title}</td>
                <td className="text-muted-foreground p-3">
                  {r.record.disposition} / {r.record.confidence}
                </td>
                <td
                  className={cn(
                    "p-3",
                    r.score.verdict === "burn" ? "text-defect" : "text-comply",
                  )}
                >
                  {r.score.verdict}
                </td>
                <td className="p-3">
                  {r.score.total > 0 ? "+" : ""}
                  {r.score.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" variant="outline" onClick={onReview}>
          Review the debriefs
        </Button>
        <p className="text-muted-foreground text-xs">
          The desk ends at recommendations — execution is 2.4’s material. Next
          in the module: the written output.
        </p>
      </div>
    </div>
  );
}
