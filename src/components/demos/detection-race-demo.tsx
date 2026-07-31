"use client";

import { useMemo, useState } from "react";
import {
  classifyRegime,
  detectionWinProbability,
  expectedDamageAtDetection,
  type RaceRegime,
} from "@/lib/diffuse-detection";

// Interactive companion to the "bits" discussion in "Notes on handling
// non-concentrated failures" (c-lowstakes-l2): a schemer needs C bad actions
// for catastrophe, each bad action is noticed with probability q, and a
// decisive response fires at the K-th noticed incident. The engine
// (src/lib/diffuse-detection) is the source of truth for the math; this
// component only renders it. Note what the demo deliberately has no slider
// for: the schemer's pace. Acting slower delays detection and catastrophe by
// the same factor, so the race outcome depends only on (C, q, K).

const C_MIN_LOG = 0; // 10^0 = 1 bad action (fully concentrated)
const C_MAX_LOG = 5; // 10^5 (very diffuse)
const Q_MIN_LOG = -4; // 0.01%
const Q_MAX_LOG = Math.log10(0.5); // 50%
const K_MIN = 1;
const K_MAX = 20;
/** Bad actions a schemer could plausibly fit into the whole deployment. */
const BAD_ACTION_BUDGET = 1_000_000;

const REGIME_COPY: Record<RaceRegime, { label: string; detail: string }> = {
  "caught-in-time": {
    label: "Caught in time",
    detail:
      "The response reliably fires before the catastrophe threshold: the diffuse regime, where asynchronous review and training have time to work.",
  },
  "detected-too-late": {
    label: "Detected, but too late",
    detail:
      "Enough signal exists to detect the behavior eventually, but catastrophe likely arrives first — stakes as a quantitative matter.",
  },
  "effectively-never": {
    label: "Effectively never detected",
    detail:
      "So little signal per incident that the deployment ends before the evidence threshold is reached — the clearly low-stakes failure the post describes.",
  },
};

const WIDTH = 320;
const HEIGHT = 180;
const MARGIN = { top: 10, right: 14, bottom: 24, left: 34 };
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom;

interface Point {
  logX: number;
  value: number;
}

function LogLineChart({
  title,
  points,
  minLog,
  maxLog,
  currentLog,
  currentValue,
  formatValue,
  formatXTick,
  maxValue,
}: {
  title: string;
  points: Point[];
  minLog: number;
  maxLog: number;
  currentLog: number;
  currentValue: number;
  formatValue: (v: number) => string;
  formatXTick: (logX: number) => string;
  maxValue: number;
}) {
  const xFor = (logX: number) =>
    MARGIN.left + ((logX - minLog) / (maxLog - minLog)) * PLOT_W;
  const yFor = (value: number) =>
    MARGIN.top + PLOT_H - (Math.min(value, maxValue) / maxValue) * PLOT_H;
  const path = points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${xFor(p.logX).toFixed(2)} ${yFor(p.value).toFixed(2)}`,
    )
    .join(" ");
  const markerX = xFor(currentLog);
  const markerY = yFor(currentValue);

  return (
    <div className="min-w-0 flex-1">
      <p className="text-muted-foreground mb-1 text-center text-xs font-medium">
        {title}
      </p>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label={title}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={MARGIN.left}
            x2={WIDTH - MARGIN.right}
            y1={MARGIN.top + PLOT_H * (1 - t)}
            y2={MARGIN.top + PLOT_H * (1 - t)}
            stroke="var(--border)"
            strokeWidth={1}
            opacity={0.5}
          />
        ))}
        <line
          x1={markerX}
          x2={markerX}
          y1={MARGIN.top}
          y2={MARGIN.top + PLOT_H}
          stroke="var(--muted-foreground)"
          strokeWidth={1}
          strokeOpacity={0.4}
        />
        <path
          d={path}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle
          cx={markerX}
          cy={markerY}
          r={6}
          fill="var(--primary)"
          stroke="var(--card)"
          strokeWidth={2}
        />
        <text
          x={MARGIN.left - 4}
          y={MARGIN.top + 8}
          fontSize={9}
          fill="var(--muted-foreground)"
          textAnchor="end"
        >
          {formatValue(maxValue)}
        </text>
        <text
          x={MARGIN.left - 4}
          y={MARGIN.top + PLOT_H}
          fontSize={9}
          fill="var(--muted-foreground)"
          textAnchor="end"
        >
          {formatValue(0)}
        </text>
        <text
          x={MARGIN.left}
          y={HEIGHT - 6}
          fontSize={9}
          fill="var(--muted-foreground)"
        >
          {formatXTick(minLog)}
        </text>
        <text
          x={WIDTH - MARGIN.right}
          y={HEIGHT - 6}
          fontSize={9}
          fill="var(--muted-foreground)"
          textAnchor="end"
        >
          {formatXTick(maxLog)}
        </text>
      </svg>
      <p className="mt-1 text-center text-sm font-semibold tabular-nums">
        {formatValue(currentValue)}
      </p>
    </div>
  );
}

function formatCount(v: number): string {
  if (!Number.isFinite(v)) return "∞";
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(v >= 10_000 ? 0 : 1)}k`;
  return v >= 100 ? v.toFixed(0) : v.toFixed(1);
}

export function DetectionRaceDemo() {
  const [logC, setLogC] = useState(3); // 1,000 bad actions to catastrophe
  const [logQ, setLogQ] = useState(-2); // each has a 1% chance of being noticed
  const [k, setK] = useState(3);

  const c = Math.round(Math.pow(10, logC));
  const q = Math.pow(10, logQ);
  const params = {
    catastropheActions: c,
    noticeChance: q,
    evidenceThreshold: k,
  };
  const pWin = detectionWinProbability(params);
  const damage = expectedDamageAtDetection(q, k);
  const regime = classifyRegime(params, BAD_ACTION_BUDGET);

  const winCurve = useMemo(() => {
    const points: Point[] = [];
    for (let i = 0; i <= 120; i++) {
      const lx = C_MIN_LOG + ((C_MAX_LOG - C_MIN_LOG) * i) / 120;
      points.push({
        logX: lx,
        value: detectionWinProbability({
          catastropheActions: Math.round(Math.pow(10, lx)),
          noticeChance: q,
          evidenceThreshold: k,
        }),
      });
    }
    return points;
  }, [q, k]);

  const damageCurve = useMemo(() => {
    const points: Point[] = [];
    for (let i = 0; i <= 120; i++) {
      const lx = Q_MIN_LOG + ((Q_MAX_LOG - Q_MIN_LOG) * i) / 120;
      points.push({
        logX: lx,
        value: expectedDamageAtDetection(Math.pow(10, lx), k),
      });
    }
    return points;
  }, [k]);
  const damageMax = k / Math.pow(10, Q_MIN_LOG);

  const regimeCopy = REGIME_COPY[regime];

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Bad actions needed for catastrophe (C): concentrated ⟷ diffuse
            </span>
            <span className="font-medium tabular-nums">{formatCount(c)}</span>
          </label>
          <input
            type="range"
            min={C_MIN_LOG * 100}
            max={C_MAX_LOG * 100}
            step={1}
            value={logC * 100}
            onChange={(e) => setLogC(Number(e.target.value) / 100)}
            className="accent-primary w-full"
            aria-label="Bad actions needed for catastrophe"
          />
        </div>
        <div>
          <label className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Chance a bad action is noticed (q = audited × caught)
            </span>
            <span className="font-medium tabular-nums">
              {(q * 100).toPrecision(2)}%
            </span>
          </label>
          <input
            type="range"
            min={Q_MIN_LOG * 100}
            max={Q_MAX_LOG * 100}
            step={1}
            value={logQ * 100}
            onChange={(e) => setLogQ(Number(e.target.value) / 100)}
            className="accent-primary w-full"
            aria-label="Chance a bad action is noticed"
          />
        </div>
        <div>
          <label className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Noticed incidents before a decisive response (K)
            </span>
            <span className="font-medium tabular-nums">{k}</span>
          </label>
          <input
            type="range"
            min={K_MIN}
            max={K_MAX}
            step={1}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="accent-primary w-full"
            aria-label="Noticed incidents before a decisive response"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <LogLineChart
          title="P(response before catastrophe), by C"
          points={winCurve}
          minLog={C_MIN_LOG}
          maxLog={C_MAX_LOG}
          currentLog={logC}
          currentValue={pWin}
          formatValue={(v) => `${(v * 100).toFixed(0)}%`}
          formatXTick={(lx) => formatCount(Math.pow(10, lx))}
          maxValue={1}
        />
        <LogLineChart
          title="Expected bad actions before response, by q"
          points={damageCurve}
          minLog={Q_MIN_LOG}
          maxLog={Q_MAX_LOG}
          currentLog={logQ}
          currentValue={Math.min(damage, damageMax)}
          formatValue={formatCount}
          formatXTick={(lx) => `${(Math.pow(10, lx) * 100).toPrecision(1)}%`}
          maxValue={damageMax}
        />
      </div>

      <div className="border-border bg-muted/40 grid grid-cols-3 gap-3 rounded-lg border p-3 text-center text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Response in time</p>
          <p className="font-semibold tabular-nums">{(pWin * 100).toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">
            Expected damage at response
          </p>
          <p className="font-semibold tabular-nums">
            {formatCount(damage)} actions
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Regime</p>
          <p className="font-semibold">{regimeCopy.label}</p>
        </div>
      </div>

      <p className="text-muted-foreground text-xs">
        {regimeCopy.detail} The schemer&apos;s pace has no slider: acting more
        slowly delays detection and catastrophe by the same factor, so the race
        outcome depends only on C, q, and K. Expected damage before the
        response is K/q, independent of the threat&apos;s concentration.
      </p>
    </div>
  );
}
