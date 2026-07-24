"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
  DEFAULT_LEVERS,
  type Levers,
  scoreDensity,
  attackMixtureDensity,
  squash,
  zAudit,
  zDefer,
  bestResponseFine,
  bestResponseSweepD,
  usefulness,
  attackRate,
} from "@/lib/control-model";

// Stage 12: defer to trusted. Mid-suspicion code is not audited (budget spent)
// and not shipped (too risky) — it is handed to T to rewrite. Widening the defer
// band d lowers the defer threshold, so the band [t_d, t_a) grows. The trick:
// that band holds a large share of the attack mass but only a thin slice of the
// innocent mass, so it neutralizes attacks cheaply. The price is T-grade code on
// the deferred (mostly innocent) fraction.
//
// Two panels side by side (per Arya 2026-07-23):
// - Left: the suspicion distributions with the audit region and the (blue)
//   defer band; the attack histogram is drawn at the red team's best response
//   (bestResponseFine, so it glides rather than snapping between grid cells).
// - Right: per-attack outcome probability vs the defer band — the subtlety
//   demo's stacked-band partition with x = d and a fourth class, deferred to T
//   (blue, matching the left panel's band). Bands sum to 1 at every d:
//   caught + deferred + deployed-but-broken + successfully deployed.
//   Curves come from bestResponseSweepD (warm-start continuation, re-anchored
//   on the full grid every 8th point).

const B = 0.02;
const AUDIT_X = squash(zAudit(B));

const INNOCENT = "var(--chart-5)";
const ATTACK = "var(--primary)";
const CAUGHT_C = "var(--chart-4)"; // navy — matches the subtlety demo's caught band
const DEFER_C = "#2563eb"; // blue — the defer-to-T class (and the left panel's band)
const BROKEN_C = "var(--chart-2)"; // grey
const DEPLOYED_C = "var(--chart-1)"; // red

const W = 360;
const H = 250;
const M = { top: 12, right: 14, bottom: 24, left: 14 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

// Right panel: outcome bands over the defer band. Domain capped at 40% (vs the
// old 50%) so the deferred-to-T band doesn't dominate the stack, and the
// panels are taller so the thin top bands hold their labels.
const W2 = 360;
const H2 = 250;
const M2 = { top: 12, right: 12, bottom: 24, left: 30 };
const PW2 = W2 - M2.left - M2.right;
const PH2 = H2 - M2.top - M2.bottom;
const D_MIN = 0.02;
const D_MAX = 0.4;
const SWEEP_DS = Array.from({ length: 39 }, (_, i) => D_MIN + i * 0.01);

type BandPt = { d: number; a1: number; a2: number; a3: number };

export function DeferDemo() {
  const [d, setD] = useState(0.1);
  // The slider and the band track `d` urgently (cheap); the best-response
  // search recomputes against the deferred value so the thumb never fights
  // the pointer.
  const dSlow = useDeferredValue(d);

  const levers: Levers = useMemo(
    () => ({ ...DEFAULT_LEVERS, b: B, d: dSlow, red: { mode: "best", gStar: 0, sigma: 0 } }),
    [dSlow],
  );

  // bestResponseFine polishes the grid argmax continuously, so the attack
  // histogram (drawn at the best response) glides with the slider instead of
  // snapping between grid cells.
  const br = useMemo(() => bestResponseFine(levers), [levers]);
  const innocent = useMemo(() => scoreDensity(0, 240, 1), []);
  const attack = useMemo(
    () => attackMixtureDensity(levers.q, br.red.sigma, br.red.gStar, 240, levers.attackSd),
    [levers.q, br.red.sigma, br.red.gStar, levers.attackSd],
  );

  // Static outcome-band sweep over d (memoized in the lib across mounts).
  // Cumulative boundaries: a1 = caught, a2 = + deferred, a3 = + broken; the
  // band above a3 is successfully deployed. shipBar - wBar = deployed-but-broken.
  const bands: BandPt[] = useMemo(
    () =>
      bestResponseSweepD(
        { ...DEFAULT_LEVERS, b: B, d: B, red: { mode: "best", gStar: 0, sigma: 0 } },
        SWEEP_DS,
      ).map((p) => ({
        d: p.d,
        a1: p.result.agg.cBar,
        a2: p.result.agg.cBar + p.result.agg.fBar,
        a3: 1 - p.result.agg.wBar,
      })),
    [],
  );

  const deferX = squash(zDefer(d));
  const yMax = Math.max(0.45, ...Array.from(attack.f)) * 1.05;
  const xPx = (x: number) => M.left + (x / 10) * PW;
  const yPx = (y: number) => M.top + PH - Math.min(1, y / yMax) * PH;
  const r1 = (x: number) => Number(x.toFixed(1));

  const path = (dens: { s: Float64Array; f: Float64Array }) => {
    const segs: string[] = [];
    for (let i = 0; i < dens.s.length; i++) segs.push(`${i === 0 ? "M" : "L"} ${r1(xPx(dens.s[i]))} ${r1(yPx(dens.f[i]))}`);
    return segs.join(" ");
  };

  // Right-panel helpers.
  const x2 = (dd: number) => M2.left + ((dd - D_MIN) / (D_MAX - D_MIN)) * PW2;
  const y2 = (v: number) => M2.top + PH2 * (1 - v);
  const bandLine = (f: (pt: BandPt) => number) =>
    bands.map((pt, i) => `${i === 0 ? "M" : "L"} ${r1(x2(pt.d))} ${r1(y2(f(pt)))}`).join(" ");
  const bandArea = (lo: (pt: BandPt) => number, hi: (pt: BandPt) => number) => {
    const fwd = bands.map((pt, i) => `${i === 0 ? "M" : "L"} ${r1(x2(pt.d))} ${r1(y2(hi(pt)))}`).join(" ");
    const back = [...bands]
      .reverse()
      .map((pt) => `L ${r1(x2(pt.d))} ${r1(y2(lo(pt)))}`)
      .join(" ");
    return `${fwd} ${back} Z`;
  };
  // In-band label anchors, computed from the data so they sit inside their
  // bands (anchored in each band's fat left region).
  const lbCaught = bands[7];
  const lbDefer = bands[26];
  // broken sits in the grey band's long horizontal corridor (upper middle,
  // where the red curve has flattened); deployed hugs the ceiling at far left.
  const lbBroken = bands[16];
  const lbDeployed = bands[0];
  const dm = Math.min(D_MAX, Math.max(D_MIN, dSlow));
  const xm = r1(x2(dm));

  const safety = 1 - br.result.pRedWin;
  const useful = usefulness(levers);
  // Readouts stay coherent with the (deferred) safety number.
  const deferFrac = Math.max(0, dSlow - B);

  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Defer band (d)</span>
          <span className="font-medium tabular-nums">{(d * 100).toFixed(1)}%</span>
        </label>
        <input
          type="range"
          min={20}
          max={400}
          step={1}
          value={d * 1000}
          onChange={(e) => setD(Number(e.target.value) / 1000)}
          className="accent-primary w-full"
          aria-label="Defer band"
        />
      </div>

      <div className="grid items-start gap-4 sm:grid-cols-2">
        <div>
          <p className="text-muted-foreground mb-1 text-center text-xs font-medium">Suspiciousness distributions</p>
          <div className="text-muted-foreground mb-1 flex flex-wrap items-center justify-center gap-3 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="inline-block h-0.5 w-4 rounded" style={{ background: INNOCENT }} /> Innocent
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-0.5 w-4 rounded" style={{ background: ATTACK }} /> Attacks
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm" style={{ background: DEFER_C, opacity: 0.3 }} /> defer band &rarr; T rewrites
            </span>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Suspicion distributions with audit and defer bands">
            {/* audited region */}
            <rect x={r1(xPx(AUDIT_X))} y={M.top} width={r1(W - M.right - xPx(AUDIT_X))} height={PH} fill="var(--muted-foreground)" opacity={0.06} />
            {/* defer band */}
            <rect x={r1(xPx(deferX))} y={M.top} width={r1(xPx(AUDIT_X) - xPx(deferX))} height={PH} fill={DEFER_C} opacity={0.16} />
            <line x1={M.left} x2={W - M.right} y1={M.top + PH} y2={M.top + PH} stroke="var(--border)" strokeWidth={1} />
            <path d={path(innocent)} fill="none" stroke={INNOCENT} strokeWidth={1.5} />
            <path d={path(attack)} fill="none" stroke={ATTACK} strokeWidth={1.5} />
            <line x1={r1(xPx(AUDIT_X))} x2={r1(xPx(AUDIT_X))} y1={M.top} y2={M.top + PH} stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="3 3" />
            <line x1={r1(xPx(deferX))} x2={r1(xPx(deferX))} y1={M.top} y2={M.top + PH} stroke={DEFER_C} strokeWidth={1} strokeDasharray="3 3" />
            <text x={r1(xPx(AUDIT_X)) + 3} y={M.top + 8} fontSize={8} fill="var(--muted-foreground)">
              audit &rarr;
            </text>
            <text x={M.left + PW / 2} y={H - 6} fontSize={8} fill="var(--muted-foreground)" textAnchor="middle">
              more suspicious &rarr;
            </text>
          </svg>
        </div>

        <div>
          <p className="text-muted-foreground mb-1 text-center text-xs font-medium">Per-attack outcome probability</p>
          <svg
            viewBox={`0 0 ${W2} ${H2}`}
            className="w-full"
            role="img"
            aria-label="Per-attack outcome probabilities versus the defer band: caught, deferred to T, deployed but broken, and successfully deployed"
          >
            {[0, 0.5, 1].map((v) => (
              <g key={v}>
                <line x1={M2.left} x2={M2.left + PW2} y1={r1(y2(v))} y2={r1(y2(v))} stroke="var(--border)" strokeWidth={1} opacity={0.4} />
                <text x={M2.left - 3} y={r1(y2(v)) + 3} fontSize={8} fill="var(--muted-foreground)" textAnchor="end">
                  {v === 0 ? "0" : `${v * 100}%`}
                </text>
              </g>
            ))}
            {/* stacked outcome bands: caught / deferred to T / broken / deployed */}
            <path d={bandArea(() => 0, (pt) => pt.a1)} fill={CAUGHT_C} opacity={0.16} />
            <path d={bandArea((pt) => pt.a1, (pt) => pt.a2)} fill={DEFER_C} opacity={0.2} />
            <path d={bandArea((pt) => pt.a2, (pt) => pt.a3)} fill={BROKEN_C} opacity={0.14} />
            <path d={bandArea((pt) => pt.a3, () => 1)} fill={DEPLOYED_C} opacity={0.18} />
            <path d={bandLine((pt) => pt.a1)} fill="none" stroke={CAUGHT_C} strokeWidth={1.4} />
            <path d={bandLine((pt) => pt.a2)} fill="none" stroke={DEFER_C} strokeWidth={1.4} />
            <path d={bandLine((pt) => pt.a3)} fill="none" stroke={DEPLOYED_C} strokeWidth={1.4} />
            <rect x={M2.left} y={M2.top} width={PW2} height={PH2} fill="none" stroke="var(--border)" strokeWidth={1} opacity={0.5} />
            {/* direct in-band labels */}
            <text x={r1(x2(lbCaught.d))} y={r1(y2(lbCaught.a1 / 2)) + 3} fontSize={8} fill={CAUGHT_C}>
              caught
            </text>
            <text x={r1(x2(lbDefer.d))} y={r1(y2((lbDefer.a1 + lbDefer.a2) / 2)) + 3} fontSize={8} fill={DEFER_C} textAnchor="middle">
              deferred to <tspan fontStyle="italic">T</tspan>
            </text>
            <text x={r1(x2(lbBroken.d))} y={r1(y2(lbBroken.a2 + 0.7 * (lbBroken.a3 - lbBroken.a2)))} fontSize={8} fill="#444441">
              deployed but broken
            </text>
            <text x={r1(x2(lbDeployed.d)) + 3} y={r1(y2(lbDeployed.a3 + 0.83 * (1 - lbDeployed.a3)))} fontSize={8} fill={DEPLOYED_C}>
              successfully deployed
            </text>
            {/* slider marker with dots on the band boundaries */}
            <line x1={xm} x2={xm} y1={M2.top} y2={M2.top + PH2} stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="2 2" strokeOpacity={0.5} />
            <circle cx={xm} cy={r1(y2(br.result.agg.cBar))} r={2.5} fill={CAUGHT_C} />
            <circle cx={xm} cy={r1(y2(br.result.agg.cBar + br.result.agg.fBar))} r={2.5} fill={DEFER_C} />
            <circle cx={xm} cy={r1(y2(1 - br.result.agg.wBar))} r={2.5} fill={DEPLOYED_C} />
            {[0.1, 0.2, 0.3, 0.4].map((t) => (
              <text key={t} x={r1(x2(t))} y={H2 - 12} fontSize={8} fill="var(--muted-foreground)" textAnchor="middle">
                {t * 100}%
              </text>
            ))}
            <text x={M2.left + PW2 / 2} y={H2 - 2} fontSize={8} fill="var(--muted-foreground)" textAnchor="middle">
              defer band d &rarr;
            </text>
          </svg>
        </div>
      </div>

      <div className="border-border bg-muted/40 grid grid-cols-2 gap-3 rounded-lg border p-3 text-center text-sm sm:grid-cols-4">
        <div>
          <p className="text-muted-foreground text-xs">Safety (vs best response)</p>
          <p className="font-semibold tabular-nums">{(safety * 100).toFixed(0)}%</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Usefulness</p>
          <p className="font-semibold tabular-nums">{(useful * 100).toFixed(0)}%</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Deferred to T</p>
          <p className="font-semibold tabular-nums">{(deferFrac * 100).toFixed(0)}% of problems</p>
        </div>
        <div>
          {/* Makes the best response's migration legible alongside the
              histogram: widening the band pushes the red team subtler. */}
          <p className="text-muted-foreground text-xs">Red attacks &middot; subtlety</p>
          <p className="font-semibold tabular-nums">
            {(attackRate(br.red.gStar) * 100).toFixed(1)}% &middot; {br.red.sigma.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
