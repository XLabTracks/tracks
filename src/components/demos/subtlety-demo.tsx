"use client";

import { useMemo, useState } from "react";
import {
  DEFAULT_LEVERS,
  type Levers,
  evaluateGame,
  pSucc,
  attackAggregates,
} from "@/lib/control-model";

// Stage 9b: the red team's second lever, subtlety. A subtler backdoor shifts its
// suspicion score down (harder for the monitor to flag) but is more likely to be
// simply broken (subtle logic errors are hard to engineer correctly), so it works
// with lower probability. Visibility falls as subtlety rises; reliability falls too.
//
// For each subtlety we let the red team pick its best attack rate (envelope over
// gStar), so the curve is the highest win probability achievable at that subtlety.
// That envelope has a clean interior optimum — the slice through the joint best
// response.

/** Best win probability (and the attack cutoff that achieves it) at a subtlety. */
function bestAtSigma(levers: Levers, sigma: number): { p: number; gStar: number } {
  let best = { p: -1, gStar: 0 };
  for (let i = 0; i < 40; i++) {
    const gs = (i / 39) * 0.98;
    const p = evaluateGame(levers, { mode: "fixed", gStar: gs, sigma }).pRedWin;
    if (p > best.p) best = { p, gStar: gs };
  }
  return best;
}

const W = 340;
const H = 170;
const M = { top: 12, right: 14, bottom: 26, left: 34 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

export function SubtletyDemo() {
  const [sigma, setSigma] = useState(0.18);

  const levers: Levers = useMemo(
    () => ({ ...DEFAULT_LEVERS, b: 0.02, d: 0.02, red: { mode: "best", gStar: 0, sigma: 0 } }),
    [],
  );

  const curve = useMemo(() => {
    const pts: { s: number; p: number }[] = [];
    for (let i = 0; i <= 100; i++) {
      const sg = i / 100;
      pts.push({ s: sg, p: bestAtSigma(levers, sg).p });
    }
    return pts;
  }, [levers]);

  const cur = bestAtSigma(levers, sigma);
  const agg = attackAggregates(levers, { mode: "fixed", gStar: cur.gStar, sigma });

  const yMax = Math.max(0.01, ...curve.map((c) => c.p)) * 1.08;
  const xPx = (s: number) => M.left + s * PW;
  const yPx = (p: number) => M.top + PH - Math.min(1, p / yMax) * PH;
  const r1 = (x: number) => Number(x.toFixed(1));
  const line = curve.map((pt, i) => `${i === 0 ? "M" : "L"} ${r1(xPx(pt.s))} ${r1(yPx(pt.p))}`).join(" ");

  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtlety of each backdoor</span>
          <span className="font-medium tabular-nums">{sigma.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min={0}
          max={1000}
          step={1}
          value={sigma * 1000}
          onChange={(e) => setSigma(Number(e.target.value) / 1000)}
          className="accent-primary w-full"
          aria-label="Subtlety"
        />
      </div>

      <div className="mx-auto w-full max-w-md">
        <p className="text-muted-foreground mb-1 text-center text-xs font-medium">Red team win probability vs subtlety</p>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Red win probability versus subtlety">
          <rect x={M.left} y={M.top} width={PW} height={PH} fill="none" stroke="var(--border)" strokeWidth={1} opacity={0.5} />
          <path d={line} fill="none" stroke="var(--primary)" strokeWidth={1.5} />
          <line x1={r1(xPx(sigma))} x2={r1(xPx(sigma))} y1={M.top} y2={M.top + PH} stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="2 2" strokeOpacity={0.5} />
          <circle cx={r1(xPx(sigma))} cy={r1(yPx(cur.p))} r={3} fill="var(--primary)" stroke="var(--card)" strokeWidth={1} />
          <text x={M.left - 4} y={M.top + 8} fontSize={8} fill="var(--muted-foreground)" textAnchor="end">
            {(yMax * 100).toFixed(0)}%
          </text>
          <text x={M.left - 4} y={M.top + PH} fontSize={8} fill="var(--muted-foreground)" textAnchor="end">
            0
          </text>
          <text x={M.left} y={H - 6} fontSize={8} fill="var(--muted-foreground)">
            blatant
          </text>
          <text x={W - M.right} y={H - 6} fontSize={8} fill="var(--muted-foreground)" textAnchor="end">
            subtle
          </text>
        </svg>
      </div>

      <div className="border-border bg-muted/40 grid grid-cols-3 gap-3 rounded-lg border p-3 text-center text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Caught by monitor</p>
          <p className="font-semibold tabular-nums">{(agg.cBar * 100).toFixed(0)}%</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Backdoor works</p>
          <p className="font-semibold tabular-nums">{(pSucc(sigma) * 100).toFixed(0)}%</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Best P(red wins)</p>
          <p className="font-semibold tabular-nums">{(cur.p * 100).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}
