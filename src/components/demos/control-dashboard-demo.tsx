"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_LEVERS,
  type Levers,
  scoreDensity,
  attackMixtureDensity,
  squash,
  zAudit,
  zDefer,
  bestResponseValue,
  usefulness,
  attackRate,
} from "@/lib/control-model";

// Stage 13: everything linked. Three blue levers — audit budget b, defer band d,
// and monitor quality q — feed one live world. The left panel is the suspicion
// distributions with the audit and defer bands; the right panel is the
// safety/usefulness plane with the frontier traced for the current (b, q) and the
// current protocol ringed on it. The red team best-responds throughout.

const INNOCENT = "var(--chart-5)";
const ATTACK = "var(--primary)";
const BAND = "var(--chart-4)";

const PWd = 250;
const PHd = 150;
const DM = { top: 10, right: 10, bottom: 20, left: 10 };
const dpw = PWd - DM.left - DM.right;
const dph = PHd - DM.top - DM.bottom;

const PWf = 250;
const PHf = 150;
const FM = { top: 10, right: 12, bottom: 26, left: 30 };
const fpw = PWf - FM.left - FM.right;
const fph = PHf - FM.top - FM.bottom;

const r1 = (x: number) => Number(x.toFixed(1));

/**
 * How long (b, q) must hold still before the frontier is re-swept. The frontier
 * costs ~21 best-response searches (~30ms); everything else on the panel costs
 * one (~2ms). Recomputing it on every deferred tick made b and q drag visibly
 * choppier than d (which never invalidates the frontier memo) — so it waits for
 * a pause instead, and the drag itself only pays for the live parts.
 */
const FRONTIER_DEBOUNCE_MS = 120;

export function ControlDashboardDemo() {
  const [b, setB] = useState(0.02);
  // The defer slider controls the band WIDTH (d - b), not the total d, so
  // raising the audit budget shifts the band instead of eating it (per Arya:
  // the two levers must not be visually coupled).
  const [dw, setDw] = useState(0.08);
  const [q, setQ] = useState(DEFAULT_LEVERS.q);

  // Sliders, labels, and the (cheap) band geometry track state urgently; the
  // model recomputes against deferred values, so dragging never blocks the main
  // thread mid-drag. Per deferred tick that is now ONE best-response search
  // (~2ms) plus the densities (~0.2ms); the 21-point frontier sweep is
  // debounced out of the tick entirely (see below).
  const bSlow = useDeferredValue(b);
  const dwSlow = useDeferredValue(dw);
  const qSlow = useDeferredValue(q);

  const dEff = b + dw;
  const dEffSlow = bSlow + dwSlow;
  const levers: Levers = useMemo(
    () => ({
      ...DEFAULT_LEVERS,
      b: bSlow,
      d: dEffSlow,
      q: qSlow,
      red: { mode: "best", gStar: 0, sigma: 0 },
    }),
    [bSlow, dEffSlow, qSlow],
  );

  // The current protocol: the one search every tick genuinely needs. Grid-free —
  // this panel never draws the (gStar, sigma) heatmap.
  const br = useMemo(() => bestResponseValue(levers), [levers]);

  // Frontier input, debounced: it follows (bSlow, qSlow) only once they have
  // held still for FRONTIER_DEBOUNCE_MS. Kept as two primitives rather than one
  // object so a no-op settle can't change identity and re-trigger the sweep.
  const [fb, setFb] = useState(bSlow);
  const [fq, setFq] = useState(qSlow);
  useEffect(() => {
    if (fb === bSlow && fq === qSlow) return;
    const t = setTimeout(() => {
      setFb(bSlow);
      setFq(qSlow);
    }, FRONTIER_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [bSlow, qSlow, fb, fq]);
  const frontierStale = fb !== bSlow || fq !== qSlow;

  // Frontier for the settled (b, q): sweep the defer-band width 0..50%, the
  // slider's reachable range. 21 best-response searches, so it must not run on
  // every tick — dragging d never invalidates it at all (d isn't a dep).
  const frontier = useMemo(() => {
    const pts: { u: number; s: number }[] = [];
    for (let i = 0; i <= 20; i++) {
      const dd = fb + (0.5 * i) / 20;
      const lev: Levers = {
        ...DEFAULT_LEVERS,
        b: fb,
        d: dd,
        q: fq,
        red: { mode: "best", gStar: 0, sigma: 0 },
      };
      pts.push({ u: usefulness(lev), s: 1 - bestResponseValue(lev).result.pRedWin });
    }
    return pts;
  }, [fb, fq]);

  // Distributions
  const innocent = useMemo(() => scoreDensity(0, 200, 1), []);
  // Deferred q, like the rest of the model path: the density must stay
  // coherent with br (whose red strategy best-responds to qSlow), and the
  // 200-bin mixture is model-scale work that belongs on deferred ticks, not
  // urgent slider renders.
  const attack = useMemo(
    () => attackMixtureDensity(qSlow, br.red.sigma, br.red.gStar, 200, levers.attackSd),
    [qSlow, br.red.sigma, br.red.gStar, levers.attackSd],
  );
  const auditX = squash(zAudit(b));
  const deferX = squash(zDefer(dEff));
  const yMaxD = Math.max(0.45, ...Array.from(attack.f)) * 1.05;
  const dx = (x: number) => DM.left + (x / 10) * dpw;
  const dy = (y: number) => DM.top + dph - Math.min(1, y / yMaxD) * dph;
  const densPath = (dens: { s: Float64Array; f: Float64Array }) => {
    const segs: string[] = [];
    for (let i = 0; i < dens.s.length; i++) segs.push(`${i === 0 ? "M" : "L"} ${r1(dx(dens.s[i]))} ${r1(dy(dens.f[i]))}`);
    return segs.join(" ");
  };

  // Frontier plane
  const fx = (u: number) => FM.left + u * fpw;
  const fy = (s: number) => FM.top + fph - s * fph;
  const frontierPath = frontier.map((p, i) => `${i === 0 ? "M" : "L"} ${r1(fx(p.u))} ${r1(fy(p.s))}`).join(" ");
  const curUseful = usefulness(levers);
  const curSafety = 1 - br.result.pRedWin;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <LeverSlider label="Audit budget (b)" value={`${(b * 100).toFixed(1)}%`} min={5} max={100} raw={b * 1000} onChange={(v) => setB(v / 1000)} aria="Audit budget" />
        <LeverSlider label="Defer band (d)" value={`${(dw * 100).toFixed(1)}%`} min={0} max={500} raw={dw * 1000} onChange={(v) => setDw(v / 1000)} aria="Defer band" />
        <LeverSlider label="Monitor quality (AUC)" value={q.toFixed(2)} min={800} max={990} raw={q * 1000} onChange={(v) => setQ(v / 1000)} aria="Monitor quality" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground mb-1 text-center text-xs font-medium">Suspicion distributions</p>
          <svg viewBox={`0 0 ${PWd} ${PHd}`} className="w-full" role="img" aria-label="Suspicion distributions with bands">
            <rect x={r1(dx(auditX))} y={DM.top} width={r1(PWd - DM.right - dx(auditX))} height={dph} fill="var(--muted-foreground)" opacity={0.06} />
            <rect x={r1(dx(deferX))} y={DM.top} width={r1(dx(auditX) - dx(deferX))} height={dph} fill={BAND} opacity={0.18} />
            <line x1={DM.left} x2={PWd - DM.right} y1={DM.top + dph} y2={DM.top + dph} stroke="var(--border)" strokeWidth={1} />
            <path d={densPath(innocent)} fill="none" stroke={INNOCENT} strokeWidth={1.25} />
            <path d={densPath(attack)} fill="none" stroke={ATTACK} strokeWidth={1.25} />
            <line x1={r1(dx(auditX))} x2={r1(dx(auditX))} y1={DM.top} y2={DM.top + dph} stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="3 3" />
            <text x={DM.left + dpw / 2} y={PHd - 5} fontSize={8} fill="var(--muted-foreground)" textAnchor="middle">
              more suspicious &rarr;
            </text>
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground mb-1 text-center text-xs font-medium">Safety / usefulness frontier</p>
          <svg viewBox={`0 0 ${PWf} ${PHf}`} className="w-full" role="img" aria-label="Safety versus usefulness frontier">
            <rect x={FM.left} y={FM.top} width={fpw} height={fph} fill="none" stroke="var(--border)" strokeWidth={1} opacity={0.5} />
            {/* Dimmed while the sweep is catching up with a b/q drag, so the
                ringed current protocol sitting off the curve reads as "the
                frontier hasn't been redrawn yet" rather than as a bug. */}
            <path
              d={frontierPath}
              fill="none"
              stroke="var(--chart-3)"
              strokeWidth={1.5}
              opacity={frontierStale ? 0.35 : 1}
              style={{ transition: "opacity 160ms ease-out" }}
            />
            <circle cx={r1(fx(curUseful))} cy={r1(fy(curSafety))} r={3.5} fill="var(--chart-3)" stroke="var(--card)" strokeWidth={1.25} />
            <text x={FM.left - 4} y={FM.top + 8} fontSize={8} fill="var(--muted-foreground)" textAnchor="end">100</text>
            <text x={FM.left - 4} y={FM.top + fph} fontSize={8} fill="var(--muted-foreground)" textAnchor="end">0</text>
            <text x={FM.left + fpw / 2} y={PHf - 4} fontSize={8} fill="var(--muted-foreground)" textAnchor="middle">usefulness &rarr;</text>
            <text x={9} y={FM.top + fph / 2} fontSize={8} fill="var(--muted-foreground)" textAnchor="middle" transform={`rotate(-90 9 ${FM.top + fph / 2})`}>safety</text>
          </svg>
        </div>
      </div>

      <div className="border-border bg-muted/40 grid grid-cols-3 gap-3 rounded-lg border p-3 text-center text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Safety (vs best response)</p>
          <p className="font-semibold tabular-nums">{(curSafety * 100).toFixed(0)}%</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Usefulness</p>
          <p className="font-semibold tabular-nums">{(curUseful * 100).toFixed(0)}%</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Red attacks · subtlety</p>
          <p className="font-semibold tabular-nums">
            {(attackRate(br.red.gStar) * 100).toFixed(1)}% · {br.red.sigma.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

function LeverSlider({
  label,
  value,
  min,
  max,
  raw,
  onChange,
  aria,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  raw: number;
  onChange: (v: number) => void;
  aria: string;
}) {
  return (
    <div>
      <label className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{value}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={raw}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-primary w-full"
        aria-label={aria}
      />
    </div>
  );
}
