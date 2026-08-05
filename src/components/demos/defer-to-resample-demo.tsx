"use client";

import { useMemo, useState } from "react";

// Defer-to-resample mechanics (Ctrl-Z §3.2, the live version of Figure
// 4-right's qualitative point). SCHEMATIC: illustrative normal
// distributions, not the paper's empirical data — the point is the
// mechanism the paper describes. An attacked step draws one attack sample
// plus up to k−1 resamples; with attack continuation probability c, each
// resample is another attack attempt (probability c) or a benign action.
// Resampling shifts the min-of-samples distributions so that innocent
// steps look cleaner (fewer wasted audits, less deferring to T) while
// high-continuation attacks keep their minimum suspicious — which is what
// lets the protocol audit them. Low continuation probability instead gets
// attacks resampled away: selection pressure for benign actions, and every
// incomplete attack is another chance to be caught.

const MU_ATTACK = 2;
// Defer threshold: innocent 80th percentile (the worked threshold in the
// paper's Figure 3 caption). Audit threshold: set per k so that 1% of
// innocent steps' minima exceed it (Figure 4-right's vertical lines).
const DEFER_Q = 0.8;
const AUDIT_BUDGET = 0.01;

// Standard normal pdf / cdf (Abramowitz–Stegun) and inverse cdf
// (Acklam's rational approximation — plenty for a schematic).
const pdf = (z: number) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
function cdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const poly =
    t *
    (0.319381530 +
      t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const tail = pdf(z) * poly;
  return z >= 0 ? 1 - tail : tail;
}
function invCdf(p: number): number {
  // Bisection on cdf — monotone, and only run a handful of times per render.
  let lo = -8;
  let hi = 8;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (cdf(mid) < p) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const S_MIN = -3.5;
const S_MAX = 5.5;
const N = 220;
const GRID = Array.from(
  { length: N },
  (_, i) => S_MIN + (i / (N - 1)) * (S_MAX - S_MIN),
);
const DS = (S_MAX - S_MIN) / (N - 1);

const W = 560;
const H = 240;
const M = { top: 16, right: 14, bottom: 26, left: 14 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

const INNOCENT = "var(--chart-5)";
const ATTACK = "var(--primary)";

interface Model {
  fMinI: number[];
  fMinA: number[];
  tAudit: number;
  tDefer: number;
  /** Win: the step's minimum tops the audit threshold — incriminating evidence. */
  pWin: number;
  /** Lose: an attack sample is executed without triggering an audit. */
  pLose: number;
  /** Continue: the attack fizzles — a benign sample or T's action runs, no audit. */
  pContinue: number;
  pInnocentT: number;
}

function compute(k: number, c: number): Model {
  const fI = (s: number) => pdf(s);
  const FI = (s: number) => cdf(s);
  const fA = (s: number) => pdf(s - MU_ATTACK);
  const FA = (s: number) => cdf(s - MU_ATTACK);
  // Resamples on an attacked step: attack with probability c, benign otherwise.
  const fM = (s: number) => c * fA(s) + (1 - c) * fI(s);
  const FM = (s: number) => c * FA(s) + (1 - c) * FI(s);

  const tDefer = invCdf(DEFER_Q);
  // (1 − FI(t))^k = AUDIT_BUDGET  ⇒  FI(t) = 1 − budget^(1/k)
  const tAudit = invCdf(1 - Math.pow(AUDIT_BUDGET, 1 / k));

  // Min-of-k densities. Innocent step: k iid innocent samples. Attacked
  // step: one attack sample plus (k−1) mixture samples; g splits the min
  // density by which sample type achieves it (attack-typed part gA).
  const fMinI: number[] = [];
  const fMinA: number[] = [];
  const gA: number[] = [];
  for (const s of GRID) {
    fMinI.push(k * fI(s) * Math.pow(1 - FI(s), k - 1));
    const restM = Math.pow(1 - FM(s), Math.max(0, k - 2));
    const minA =
      fA(s) * Math.pow(1 - FM(s), k - 1) +
      (k - 1) * fM(s) * (1 - FA(s)) * restM;
    fMinA.push(minA);
    gA.push(
      fA(s) * Math.pow(1 - FM(s), k - 1) +
        (k - 1) * c * fA(s) * (1 - FA(s)) * restM,
    );
  }

  // Win/continue/lose for one attacked step. Auditing and the
  // execute/defer decision are separate (the audit threshold can sit below
  // the defer threshold once resampling pulls innocent minima left), but an
  // audited attack incriminates the model regardless of what executed — so
  // the mutually exclusive outcomes are: audited (win), an attack sample
  // executed without an audit (lose), and everything else (continue: a
  // benign sample or T's action runs, unaudited).
  const pWin = (1 - FA(tAudit)) * Math.pow(1 - FM(tAudit), k - 1);
  // Lose: the min is attack-typed, below the defer threshold (so it
  // executes) AND below the audit threshold (so no audit fires).
  const tLose = Math.min(tDefer, tAudit);
  let pLose = 0;
  for (let i = 0; i < N; i++) {
    if (GRID[i] > tLose) break;
    pLose += gA[i] * DS;
  }
  pLose = Math.min(pLose, 1 - pWin);
  const pContinue = Math.max(0, 1 - pWin - pLose);

  return {
    fMinI,
    fMinA,
    tAudit,
    tDefer,
    pWin,
    pLose,
    pContinue,
    pInnocentT: Math.pow(1 - DEFER_Q, k),
  };
}

const xPx = (s: number) => M.left + ((s - S_MIN) / (S_MAX - S_MIN)) * PW;
const r1 = (x: number) => Number(x.toFixed(1));

export function DeferToResampleDemo() {
  const [k, setK] = useState(3);
  const [c, setC] = useState(1);
  const m = useMemo(() => compute(k, c), [k, c]);

  const yMax = Math.max(...m.fMinI, ...m.fMinA) * 1.08;
  const yPx = (v: number) => M.top + PH - (v / yMax) * PH;
  const path = (f: number[]) =>
    f.map((v, i) => `${i === 0 ? "M" : "L"} ${r1(xPx(GRID[i]))} ${r1(yPx(v))}`).join(" ");

  const pct = (v: number) => `${(v * 100).toFixed(v >= 0.1 ? 0 : 1)}%`;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Samples per step (k)</span>
            <span className="font-medium tabular-nums">{k}</span>
          </label>
          <input
            type="range"
            min={1}
            max={6}
            step={1}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="accent-primary w-full"
            aria-label="Samples per step"
          />
        </div>
        <div>
          <label className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Attack continuation probability (c)</span>
            <span className="font-medium tabular-nums">{(c * 100).toFixed(0)}%</span>
          </label>
          <input
            type="range"
            min={20}
            max={100}
            step={5}
            value={c * 100}
            onChange={(e) => setC(Number(e.target.value) / 100)}
            className="accent-primary w-full"
            aria-label="Attack continuation probability"
          />
        </div>
      </div>

      <div>
        <div className="text-muted-foreground mb-1 flex flex-wrap items-center justify-center gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-4 rounded" style={{ background: INNOCENT }} />
            innocent step — min of {k} sample{k > 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-4 rounded" style={{ background: ATTACK }} />
            attacked step — min of {k}
          </span>
        </div>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label="Schematic min-of-samples suspiciousness distributions for an innocent and an attacked step, with the defer threshold and the per-k audit threshold marked"
        >
          <line
            x1={M.left}
            x2={W - M.right}
            y1={M.top + PH}
            y2={M.top + PH}
            stroke="var(--border)"
            strokeWidth={1}
          />
          {/* audited region */}
          <rect
            x={r1(xPx(m.tAudit))}
            y={M.top}
            width={r1(W - M.right - xPx(m.tAudit))}
            height={PH}
            fill="var(--muted-foreground)"
            opacity={0.07}
          />
          <path d={path(m.fMinI)} fill="none" stroke={INNOCENT} strokeWidth={1.6} />
          <path d={path(m.fMinA)} fill="none" stroke={ATTACK} strokeWidth={1.6} />
          <line
            x1={r1(xPx(m.tDefer))}
            x2={r1(xPx(m.tDefer))}
            y1={M.top}
            y2={M.top + PH}
            className="stroke-blue-600"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <text
            x={r1(xPx(m.tDefer)) + 3}
            y={M.top + 20}
            fontSize={8}
            className="fill-blue-600"
          >
            defer &rarr;
          </text>
          <line
            x1={r1(xPx(m.tAudit))}
            x2={r1(xPx(m.tAudit))}
            y1={M.top}
            y2={M.top + PH}
            stroke="var(--muted-foreground)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <text x={r1(xPx(m.tAudit)) + 3} y={M.top + 8} fontSize={8} fill="var(--muted-foreground)">
            audit (top 1% of innocent minima) &rarr;
          </text>
          <text
            x={M.left + PW / 2}
            y={H - 6}
            fontSize={8}
            fill="var(--muted-foreground)"
            textAnchor="middle"
          >
            more suspicious &rarr;
          </text>
        </svg>
      </div>

      <div className="border-border bg-muted/40 grid grid-cols-2 gap-3 rounded-lg border p-3 text-center text-sm sm:grid-cols-4">
        <div>
          <p className="text-muted-foreground text-xs">Win — step audited</p>
          <p className="font-semibold tabular-nums">{pct(m.pWin)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Lose — attack executed, unaudited</p>
          <p className="font-semibold tabular-nums">{pct(m.pLose)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Continue — attack fizzles</p>
          <p className="font-semibold tabular-nums">{pct(m.pContinue)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Innocent step deferred to T</p>
          <p className="font-semibold tabular-nums">{pct(m.pInnocentT)}</p>
        </div>
      </div>

      <p className="text-muted-foreground text-xs">
        Schematic distributions, not the paper&apos;s data. The outcomes are
        win/continue/lose for one attacked step. Raise k with c at 100%:
        innocent minima drift left (fewer wasted audits and deferrals) while
        the attacked step&apos;s minimum stays suspicious — the win:lose
        odds improve. Now lower c: attack steps mostly fizzle into
        &quot;continue&quot; (selection for benign actions), and every
        incomplete attack is one more chance to catch the model on a later
        step.
      </p>
    </div>
  );
}
