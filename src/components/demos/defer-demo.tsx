"use client";

import { useMemo, useState } from "react";
import {
  DEFAULT_LEVERS,
  type Levers,
  scoreDensity,
  attackMixtureDensity,
  squash,
  zAudit,
  zDefer,
  bestResponse,
  usefulness,
} from "@/lib/control-model";

// Stage 12: defer to trusted. Mid-suspicion code is not audited (budget spent)
// and not shipped (too risky) — it is handed to T to rewrite. Widening the defer
// band d lowers the defer threshold, so the amber band [t_d, t_a) grows. The
// trick: that band holds a large share of the attack mass but only a thin slice
// of the innocent mass, so it neutralizes attacks cheaply. The price is T-grade
// code on the deferred (mostly innocent) fraction.

const B = 0.02;
const AUDIT_X = squash(zAudit(B));

const INNOCENT = "var(--chart-5)"; // slate
const ATTACK = "var(--primary)"; // ember
const BAND = "var(--chart-4)"; // amber

const W = 360;
const H = 190;
const M = { top: 12, right: 14, bottom: 24, left: 14 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

export function DeferDemo() {
  const [d, setD] = useState(0.1);

  const levers: Levers = useMemo(
    () => ({ ...DEFAULT_LEVERS, b: B, d, red: { mode: "best", gStar: 0, sigma: 0 } }),
    [d],
  );

  const br = useMemo(() => bestResponse(levers), [levers]);
  const innocent = useMemo(() => scoreDensity(0, 240, 1), []);
  const attack = useMemo(
    () => attackMixtureDensity(levers.q, br.red.sigma, br.red.gStar, 240, levers.attackSd),
    [levers.q, br.red.sigma, br.red.gStar, levers.attackSd],
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

  const safety = 1 - br.result.pRedWin;
  const useful = usefulness(levers);
  const deferFrac = Math.max(0, d - B);

  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Defer band (d)</span>
          <span className="font-medium tabular-nums">{(d * 100).toFixed(0)}%</span>
        </label>
        <input
          type="range"
          min={20}
          max={500}
          step={1}
          value={d * 1000}
          onChange={(e) => setD(Number(e.target.value) / 1000)}
          className="accent-primary w-full"
          aria-label="Defer band"
        />
      </div>

      <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 rounded" style={{ background: INNOCENT }} /> Innocent
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 rounded" style={{ background: ATTACK }} /> Attacks
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-3 rounded-sm" style={{ background: BAND, opacity: 0.35 }} /> defer band &rarr; T rewrites
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Suspicion distributions with audit and defer bands">
        {/* audited region */}
        <rect x={r1(xPx(AUDIT_X))} y={M.top} width={r1(W - M.right - xPx(AUDIT_X))} height={PH} fill="var(--muted-foreground)" opacity={0.06} />
        {/* defer band */}
        <rect x={r1(xPx(deferX))} y={M.top} width={r1(xPx(AUDIT_X) - xPx(deferX))} height={PH} fill={BAND} opacity={0.18} />
        <line x1={M.left} x2={W - M.right} y1={M.top + PH} y2={M.top + PH} stroke="var(--border)" strokeWidth={1} />
        <path d={path(innocent)} fill="none" stroke={INNOCENT} strokeWidth={1.5} />
        <path d={path(attack)} fill="none" stroke={ATTACK} strokeWidth={1.5} />
        <line x1={r1(xPx(AUDIT_X))} x2={r1(xPx(AUDIT_X))} y1={M.top} y2={M.top + PH} stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="3 3" />
        <line x1={r1(xPx(deferX))} x2={r1(xPx(deferX))} y1={M.top} y2={M.top + PH} stroke={BAND} strokeWidth={1} strokeDasharray="3 3" />
        <text x={r1(xPx(AUDIT_X)) + 3} y={M.top + 8} fontSize={8} fill="var(--muted-foreground)">
          audit &rarr;
        </text>
        <text x={M.left + PW / 2} y={H - 6} fontSize={8} fill="var(--muted-foreground)" textAnchor="middle">
          more suspicious &rarr;
        </text>
      </svg>

      <div className="border-border bg-muted/40 grid grid-cols-3 gap-3 rounded-lg border p-3 text-center text-sm">
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
      </div>
    </div>
  );
}
