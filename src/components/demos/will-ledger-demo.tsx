"use client";

// The political-will ledger (module 2, "Determining the usefulness",
// Resource state): the single will account over one 24-month stage,
// recomputed deterministically from six toggles. Every mechanic restates a
// lesson claim (fade, spend prices, buy-in's slowed fade, the post-incident
// spike, the policy floor); the catch requiring a running monitoring
// protocol is the lesson's loop, made causal. Magnitudes are illustrative.
// See docs/superpowers/specs/2026-08-04-will-ledger-demo-design.md.

import { useState } from "react";
import { cn } from "@/lib/utils";

const MONTHS = 24;
const START = 40;
const FADE = 1.5;
const CATCH_MONTH = 8;
const CATCH_SPIKE = 25;
const POLICY_MONTH = 16;
const POLICY_SPEND = 20;

type SpendId = "delay" | "monitor" | "compute";

const SPENDS: { id: SpendId; label: string; cost: number; note: string }[] = [
  {
    id: "delay",
    label: "Buy delay",
    cost: 1.2,
    note: "priced by the race to AGI",
  },
  {
    id: "monitor",
    label: "Usefulness tax",
    cost: 0.7,
    note: "run a monitoring protocol",
  },
  {
    id: "compute",
    label: "Pull compute",
    cost: 0.9,
    note: "internal politics pay for it",
  },
];

interface Levers {
  spends: Record<SpendId, boolean>;
  buyIn: boolean;
  catchOn: boolean;
  policyOn: boolean;
}

interface Trajectory {
  points: number[];
  floor: number | null;
}

/** Deterministic account trajectory; pure so the chart is attributable. */
function simulate(levers: Levers): Trajectory {
  const drain = SPENDS.reduce(
    (sum, s) => sum + (levers.spends[s.id] ? s.cost : 0),
    0,
  );
  const catching = levers.catchOn && levers.spends.monitor;
  const points: number[] = [START];
  let will = START;
  let floor: number | null = null;
  for (let t = 1; t <= MONTHS; t++) {
    const fade = levers.buyIn ? FADE * 0.5 : FADE;
    const lift = levers.buyIn ? 0.5 : 0;
    will = will - fade - drain + lift;
    if (catching && t === CATCH_MONTH) will += CATCH_SPIKE;
    if (levers.policyOn && t === POLICY_MONTH) {
      will = Math.max(0, will - POLICY_SPEND);
      floor = will;
    }
    will = Math.min(100, Math.max(floor ?? 0, will));
    points.push(will);
  }
  return { points, floor };
}

// Chart geometry.
const W = 560;
const H = 260;
const PAD = { left: 34, right: 12, top: 16, bottom: 26 };
const x = (t: number) =>
  PAD.left + (t / MONTHS) * (W - PAD.left - PAD.right);
const y = (will: number) =>
  PAD.top + (1 - will / 100) * (H - PAD.top - PAD.bottom);

const toPoints = (values: number[]) =>
  values.map((v, t) => `${x(t).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

function Chip({
  on,
  disabled,
  label,
  sub,
  onClick,
}: {
  on: boolean;
  disabled?: boolean;
  label: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left text-sm transition-colors disabled:opacity-50",
        on
          ? "border-foreground bg-muted"
          : "border-border hover:enabled:bg-muted",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-1.5 size-2 shrink-0 rounded-full border",
          on ? "border-foreground bg-foreground" : "border-border",
        )}
      />
      <span className="min-w-0">
        {label}
        <span className="text-muted-foreground block text-xs">{sub}</span>
      </span>
    </button>
  );
}

export function WillLedgerDemo() {
  const [levers, setLevers] = useState<Levers>({
    spends: { delay: false, monitor: false, compute: false },
    buyIn: false,
    catchOn: false,
    policyOn: false,
  });

  const { points, floor } = simulate(levers);
  const ghost = simulate({
    spends: { delay: false, monitor: false, compute: false },
    buyIn: false,
    catchOn: false,
    policyOn: false,
  });
  const catching = levers.catchOn && levers.spends.monitor;

  // Teaching lines: each appears only while its mechanic is active, and each
  // restates the lesson's own claim.
  const notes: string[] = [];
  if (levers.buyIn)
    notes.push(
      "Public buy-in raises the account and slows its fading — though its pull on a developer is weaker and more indirect.",
    );
  if (catching)
    notes.push(
      "A catch refills the account hardest right after something goes wrong — and the spike fades like everything else.",
    );
  if (levers.catchOn && !levers.spends.monitor)
    notes.push(
      "No catch without a technique running: the account buys a monitoring protocol, the protocol catches the schemer, the evidence refills the account — the loop.",
    );
  if (levers.policyOn)
    notes.push(
      "Passing policy spends will, but converts what remains into a durable floor — repeal is expensive, so the account can no longer fade below it.",
    );
  if (
    !levers.buyIn &&
    !levers.catchOn &&
    !levers.policyOn &&
    !Object.values(levers.spends).some(Boolean)
  )
    notes.push(
      "Without reinforcement the account only fades. Toggle spends and events to see what political will buys and what refills it.",
    );

  return (
    <div className="flex flex-col gap-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="The political-will account over one 24-month capability stage, redrawn from the selected spends and events"
      >
        {/* Gridlines + axis labels */}
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              y1={y(v)}
              x2={W - PAD.right}
              y2={y(v)}
              className="stroke-border"
              strokeWidth={v === 0 ? 1 : 0.5}
            />
            <text
              x={PAD.left - 6}
              y={y(v) + 3}
              textAnchor="end"
              className="fill-muted-foreground text-[9px]"
            >
              {v}
            </text>
          </g>
        ))}
        {[0, 6, 12, 18, 24].map((t) => (
          <text
            key={t}
            x={x(t)}
            y={H - 8}
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            {t === 0 ? "month 0" : t}
          </text>
        ))}
        <text
          x={PAD.left}
          y={PAD.top - 4}
          className="fill-muted-foreground text-[9px]"
        >
          political will
        </text>

        {/* Ghost: the no-lever trajectory (pure fade), for contrast. */}
        <polyline
          points={toPoints(ghost.points)}
          fill="none"
          strokeDasharray="3 4"
          strokeWidth={1}
          className="stroke-muted-foreground/50"
        />

        {/* Policy floor */}
        {levers.policyOn && floor !== null && (
          <g>
            <line
              x1={x(POLICY_MONTH)}
              y1={y(floor)}
              x2={W - PAD.right}
              y2={y(floor)}
              strokeDasharray="6 4"
              strokeWidth={1.5}
              className="stroke-sky-500"
            />
            <text
              x={W - PAD.right}
              y={y(floor) - 5}
              textAnchor="end"
              className="fill-sky-600 text-[9px] font-medium dark:fill-sky-400"
            >
              policy floor
            </text>
          </g>
        )}

        {/* Catch marker */}
        {catching && (
          <g>
            <circle
              cx={x(CATCH_MONTH)}
              cy={y(points[CATCH_MONTH])}
              r={3.5}
              className="fill-emerald-500"
            />
            <text
              x={x(CATCH_MONTH)}
              y={y(points[CATCH_MONTH]) - 8}
              textAnchor="middle"
              className="fill-emerald-600 text-[9px] font-medium dark:fill-emerald-400"
            >
              caught in the act
            </text>
          </g>
        )}

        {/* The account */}
        <polyline
          points={toPoints(points)}
          fill="none"
          strokeWidth={2}
          className="stroke-primary"
        />
      </svg>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-muted-foreground mb-1.5 text-xs font-medium tracking-wide uppercase">
            Spends (drain per month)
          </p>
          <div className="space-y-1.5">
            {SPENDS.map((spend) => (
              <Chip
                key={spend.id}
                on={levers.spends[spend.id]}
                label={`${spend.label} · −${spend.cost}/mo`}
                sub={spend.note}
                onClick={() =>
                  setLevers((prev) => ({
                    ...prev,
                    spends: {
                      ...prev.spends,
                      [spend.id]: !prev.spends[spend.id],
                    },
                  }))
                }
              />
            ))}
          </div>
        </div>
        <div>
          <p className="text-muted-foreground mb-1.5 text-xs font-medium tracking-wide uppercase">
            What refills the account
          </p>
          <div className="space-y-1.5">
            <Chip
              on={levers.buyIn}
              label="Public buy-in"
              sub="lifts the account, halves the fade"
              onClick={() =>
                setLevers((prev) => ({ ...prev, buyIn: !prev.buyIn }))
              }
            />
            <Chip
              on={catching}
              disabled={!levers.spends.monitor}
              label={`A catch (month ${CATCH_MONTH})`}
              sub={
                levers.spends.monitor
                  ? "evidence spikes the account"
                  : "needs the monitoring protocol running — the loop"
              }
              onClick={() =>
                setLevers((prev) => ({ ...prev, catchOn: !prev.catchOn }))
              }
            />
            <Chip
              on={levers.policyOn}
              label={`Policy passes (month ${POLICY_MONTH})`}
              sub={`spends ${POLICY_SPEND}, locks a durable floor`}
              onClick={() =>
                setLevers((prev) => ({ ...prev, policyOn: !prev.policyOn }))
              }
            />
          </div>
        </div>
      </div>

      <div aria-live="polite" className="space-y-1">
        {notes.map((note) => (
          <p key={note} className="text-muted-foreground text-xs">
            {note}
          </p>
        ))}
      </div>
    </div>
  );
}
