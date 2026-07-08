"use client";

import { useMemo, useState } from "react";

// A signal-detection model of the trusted monitor from the Qualitative Analysis
// section. Suspicion scores are modelled as two equal-variance Gaussians:
// innocent solutions ~ N(0, 1), backdoored solutions ~ N(d, 1). The separation
// d (= d', the monitor's discriminability) is the single "monitor quality" knob.
//
// The paper reports that at a 2% false-positive threshold the probability an
// attempted backdoor is audited is 0.338 — i.e. TPR ≈ 0.338 at FPR = 2%. In this
// model that corresponds to d' ≈ 1.64 (AUC ≈ 0.877), which is the slider default.
// Real score distributions aren't Gaussian; this is an idealization for building
// intuition about the ROC/threshold tradeoff, not a fit to the paper's data.

// Abramowitz & Stegun 7.1.26 error-function approximation (|error| < 1.5e-7).
function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-ax * ax);
  return sign * y;
}
const normCdf = (x: number) => 0.5 * (1 + erf(x / Math.SQRT2));
const normPdf = (x: number) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);

// Threshold whose false-positive rate on the innocent distribution is 2%:
// normInv(0.98). The blue team picks the threshold, so it's fixed as d varies.
const T_FPR2 = 2.0537489106318225;
const D_MIN = 0;
const D_MAX = 4;

// Chart geometry (shared by both panels).
const W = 300;
const H = 190;
const M = { top: 12, right: 14, bottom: 26, left: 34 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

const INNOCENT = "var(--chart-5)"; // slate — cool
const BACKDOOR = "var(--primary)"; // ember — warm

function DistributionPanel({ d }: { d: number }) {
  const xMin = -4;
  const xMax = 8;
  const yMax = 0.45;
  const xPx = (x: number) => M.left + ((x - xMin) / (xMax - xMin)) * PW;
  const yPx = (y: number) => M.top + PH - (y / yMax) * PH;

  const curve = (mean: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 160; i++) {
      const x = xMin + ((xMax - xMin) * i) / 160;
      pts.push(`${i === 0 ? "M" : "L"} ${xPx(x).toFixed(2)} ${yPx(normPdf(x - mean)).toFixed(2)}`);
    }
    return pts.join(" ");
  };
  // Filled area under a curve, closed along the baseline.
  const area = (mean: number) =>
    `${curve(mean)} L ${xPx(xMax).toFixed(2)} ${yPx(0).toFixed(2)} L ${xPx(xMin).toFixed(2)} ${yPx(0).toFixed(2)} Z`;

  const thX = xPx(T_FPR2);

  return (
    <div className="min-w-0 flex-1">
      <p className="text-muted-foreground mb-1 text-center text-xs font-medium">
        Suspicion-score distributions
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Suspicion-score distributions for innocent and backdoored solutions">
        {/* Audited region: scores to the right of the threshold */}
        <rect x={thX} y={M.top} width={W - M.right - thX} height={PH} fill="var(--muted-foreground)" opacity={0.06} />
        {/* baseline */}
        <line x1={M.left} x2={W - M.right} y1={yPx(0)} y2={yPx(0)} stroke="var(--border)" strokeWidth={1} />
        {/* distributions */}
        <path d={area(0)} fill={INNOCENT} opacity={0.12} />
        <path d={area(d)} fill={BACKDOOR} opacity={0.12} />
        <path d={curve(0)} fill="none" stroke={INNOCENT} strokeWidth={2} />
        <path d={curve(d)} fill="none" stroke={BACKDOOR} strokeWidth={2} />
        {/* threshold */}
        <line x1={thX} x2={thX} y1={M.top} y2={M.top + PH} stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="3 3" />
        <text x={thX + 3} y={M.top + 8} fontSize={8} fill="var(--muted-foreground)">
          audit &rarr;
        </text>
        {/* x-axis label */}
        <text x={M.left + PW / 2} y={H - 6} fontSize={9} fill="var(--muted-foreground)" textAnchor="middle">
          more suspicious &rarr;
        </text>
      </svg>
    </div>
  );
}

function RocPanel({ roc, auc, opFpr, opTpr }: { roc: { fpr: number; tpr: number }[]; auc: number; opFpr: number; opTpr: number }) {
  const xPx = (fpr: number) => M.left + fpr * PW;
  const yPx = (tpr: number) => M.top + PH - tpr * PH;

  const line = roc.map((p, i) => `${i === 0 ? "M" : "L"} ${xPx(p.fpr).toFixed(2)} ${yPx(p.tpr).toFixed(2)}`).join(" ");
  const area = `${line} L ${xPx(1).toFixed(2)} ${yPx(0).toFixed(2)} L ${xPx(0).toFixed(2)} ${yPx(0).toFixed(2)} Z`;

  return (
    <div className="min-w-0 flex-1">
      <p className="text-muted-foreground mb-1 text-center text-xs font-medium">ROC curve</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`ROC curve, area under curve ${auc.toFixed(3)}`}>
        {/* frame */}
        <rect x={M.left} y={M.top} width={PW} height={PH} fill="none" stroke="var(--border)" strokeWidth={1} opacity={0.5} />
        {/* chance diagonal */}
        <line x1={xPx(0)} y1={yPx(0)} x2={xPx(1)} y2={yPx(1)} stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="3 3" strokeOpacity={0.5} />
        {/* AUC fill + curve */}
        <path d={area} fill={BACKDOOR} opacity={0.1} />
        <path d={line} fill="none" stroke={BACKDOOR} strokeWidth={2} strokeLinejoin="round" />
        {/* operating point at 2% FPR */}
        <line x1={xPx(opFpr)} x2={xPx(opFpr)} y1={M.top} y2={M.top + PH} stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="2 2" strokeOpacity={0.6} />
        <circle cx={xPx(opFpr)} cy={yPx(opTpr)} r={5} fill={BACKDOOR} stroke="var(--card)" strokeWidth={2} />
        {/* AUC readout inside the panel */}
        <text x={xPx(0.62)} y={yPx(0.22)} fontSize={11} fontWeight={600} fill="var(--foreground)">
          AUC {auc.toFixed(3)}
        </text>
        {/* axis labels */}
        <text x={M.left} y={H - 6} fontSize={9} fill="var(--muted-foreground)">
          0
        </text>
        <text x={W - M.right} y={H - 6} fontSize={9} fill="var(--muted-foreground)" textAnchor="end">
          FPR 1
        </text>
        <text x={M.left - 4} y={M.top + 8} fontSize={9} fill="var(--muted-foreground)" textAnchor="end">
          TPR
        </text>
      </svg>
    </div>
  );
}

export function MonitorRocDemo() {
  const [d, setD] = useState(1.64); // reproduces the paper's ~0.338 catch rate at 2% FPR

  const roc = useMemo(() => {
    const pts: { fpr: number; tpr: number }[] = [];
    for (let i = 0; i <= 200; i++) {
      const t = 6 - (12 * i) / 200; // sweep threshold high -> low
      pts.push({ fpr: 1 - normCdf(t), tpr: 1 - normCdf(t - d) });
    }
    return pts;
  }, [d]);

  const auc = normCdf(d / Math.SQRT2);
  const opTpr = normCdf(d - T_FPR2); // TPR at the 2% FPR threshold

  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Monitor quality (separation <em>d&prime;</em>)
          </span>
          <span className="font-medium tabular-nums">{d.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min={D_MIN * 100}
          max={D_MAX * 100}
          step={1}
          value={d * 100}
          onChange={(e) => setD(Number(e.target.value) / 100)}
          className="accent-primary w-full"
          aria-label="Monitor quality"
        />
      </div>

      {/* legend */}
      <div className="text-muted-foreground flex items-center justify-center gap-5 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 rounded" style={{ background: INNOCENT }} /> Innocent solutions
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 rounded" style={{ background: BACKDOOR }} /> Backdoored solutions
        </span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <DistributionPanel d={d} />
        <RocPanel roc={roc} auc={auc} opFpr={0.02} opTpr={opTpr} />
      </div>

      <div className="border-border bg-muted/40 grid grid-cols-3 gap-3 rounded-lg border p-3 text-center text-sm">
        <div>
          <p className="text-muted-foreground text-xs">AUC</p>
          <p className="font-semibold tabular-nums">{auc.toFixed(3)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Backdoors caught @ 2% FPR</p>
          <p className="font-semibold tabular-nums">{(opTpr * 100).toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Missed (false negatives)</p>
          <p className="font-semibold tabular-nums">{((1 - opTpr) * 100).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}
