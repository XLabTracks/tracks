"use client";

import { useMemo, useState } from "react";
import { DEFAULT_LEVERS, type Levers, evaluateGame, attackRate } from "@/lib/control-model";

// Stage 9: opportunities are not equal. Problems vary in how cleanly a backdoor
// fits; the red team attacks only when the opportunity quality exceeds a cutoff
// gStar, giving an attack rate r = P(g > gStar). Marginal (lower-quality)
// attacks are more visible, so attacking more often lowers the per-attack odds.
// P(red wins) is therefore hump-shaped in the attack rate: rare attacks may
// never fire; frequent attacks are caught. The optimum is interior.

const SIGMA = 0.4; // fixed subtlety here (the next lesson varies it)

const W = 340;
const H = 170;
const M = { top: 12, right: 14, bottom: 26, left: 34 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

export function AttackRateDemo() {
  const [gStar, setGStar] = useState(0.5);

  const levers: Levers = useMemo(
    () => ({ ...DEFAULT_LEVERS, b: 0.02, d: 0.02, red: { mode: "fixed", gStar: 0.5, sigma: SIGMA } }),
    [],
  );

  const curve = useMemo(() => {
    const pts: { r: number; p: number }[] = [];
    // gStar goes high -> low as i grows, so attack rate rises monotonically: the
    // list is already ascending in rate (no sort needed — sorting in place here
    // would be a memo-breaking mutation).
    for (let i = 0; i <= 120; i++) {
      const gs = 0.995 * (1 - i / 120);
      pts.push({ r: attackRate(gs), p: evaluateGame(levers, { mode: "fixed", gStar: gs, sigma: SIGMA }).pRedWin });
    }
    return pts;
  }, [levers]);

  const rate = attackRate(gStar);
  const res = evaluateGame(levers, { mode: "fixed", gStar, sigma: SIGMA });

  const yMax = Math.max(0.01, ...curve.map((c) => c.p)) * 1.08;
  const xMax = Math.max(...curve.map((c) => c.r));
  const xPx = (r: number) => M.left + (r / xMax) * PW;
  const yPx = (p: number) => M.top + PH - Math.min(1, p / yMax) * PH;
  const r1 = (x: number) => Number(x.toFixed(1));
  const line = curve.map((pt, i) => `${i === 0 ? "M" : "L"} ${r1(xPx(pt.r))} ${r1(yPx(pt.p))}`).join(" ");

  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Opportunity cutoff — attack only when quality &gt; this</span>
          <span className="font-medium tabular-nums">attack {(rate * 100).toFixed(1)}% of problems</span>
        </label>
        <input
          type="range"
          min={0}
          max={980}
          step={1}
          value={gStar * 1000}
          onChange={(e) => setGStar(Number(e.target.value) / 1000)}
          className="accent-primary w-full"
          aria-label="Opportunity cutoff"
        />
      </div>

      <div className="mx-auto w-full max-w-md">
        <p className="text-muted-foreground mb-1 text-center text-xs font-medium">Red team win probability vs attack rate</p>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Red win probability versus attack rate">
          <rect x={M.left} y={M.top} width={PW} height={PH} fill="none" stroke="var(--border)" strokeWidth={1} opacity={0.5} />
          <path d={line} fill="none" stroke="var(--primary)" strokeWidth={1.5} />
          <line x1={r1(xPx(rate))} x2={r1(xPx(rate))} y1={M.top} y2={M.top + PH} stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="2 2" strokeOpacity={0.5} />
          <circle cx={r1(xPx(rate))} cy={r1(yPx(res.pRedWin))} r={3} fill="var(--primary)" stroke="var(--card)" strokeWidth={1} />
          <text x={M.left - 4} y={M.top + 8} fontSize={8} fill="var(--muted-foreground)" textAnchor="end">
            {(yMax * 100).toFixed(0)}%
          </text>
          <text x={M.left - 4} y={M.top + PH} fontSize={8} fill="var(--muted-foreground)" textAnchor="end">
            0
          </text>
          <text x={M.left} y={H - 6} fontSize={8} fill="var(--muted-foreground)">
            attack rarely
          </text>
          <text x={W - M.right} y={H - 6} fontSize={8} fill="var(--muted-foreground)" textAnchor="end">
            attack often
          </text>
        </svg>
      </div>

      <div className="border-border bg-muted/40 grid grid-cols-3 gap-3 rounded-lg border p-3 text-center text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Attack rate</p>
          <p className="font-semibold tabular-nums">{(rate * 100).toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">P(red wins)</p>
          <p className="font-semibold tabular-nums">{(res.pRedWin * 100).toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Safety</p>
          <p className="font-semibold tabular-nums">{((1 - res.pRedWin) * 100).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}
