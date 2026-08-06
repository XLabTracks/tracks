"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

// The multiple-AIs argument from the BOTEC in "Notes on cooperating with
// unaligned AIs": what matters is the probability that AT LEAST ONE AI
// cooperates, so the value of shifting each AI's cooperation probability
// depends on the baseline. The post's two worked examples are presets:
// 10 draws at 50% (already >99.9%, the shift adds almost nothing) and
// 3 draws at 20% (49% → 73%, a gain of more than 15 percentage points).

const W = 560;
const H = 300;
const M = { left: 48, right: 16, top: 16, bottom: 40 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

function atLeastOne(p: number, n: number): number {
  return 1 - Math.pow(1 - p, n);
}

function fmt(v: number): string {
  const pct = v * 100;
  if (pct > 99.9) return ">99.9";
  return pct < 10 ? pct.toFixed(1) : Math.round(pct).toString();
}

export function CoopAtLeastOneDemo() {
  const [n, setN] = useState(3); // independent AI "draws"
  const [base, setBase] = useState(20); // per-draw cooperation probability, %
  const [shift, setShift] = useState(15); // per-draw boost, percentage points

  const p0 = base / 100;
  const p1 = Math.min((base + shift) / 100, 1);
  const y0 = atLeastOne(p0, n);
  const y1 = atLeastOne(p1, n);

  const xPx = (p: number) => M.left + p * PW;
  const yPx = (y: number) => M.top + PH - y * PH;

  const curve: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const p = i / 80;
    curve.push(
      `${i === 0 ? "M" : "L"} ${xPx(p).toFixed(1)} ${yPx(atLeastOne(p, n)).toFixed(1)}`,
    );
  }

  return (
    <div className="space-y-3">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Probability that at least one AI cooperates, as a function of the per-AI cooperation probability, with markers before and after a per-AI shift"
      >
        {/* Band between the baseline and shifted per-AI probability */}
        <rect
          x={xPx(p0)}
          y={M.top}
          width={Math.max(xPx(p1) - xPx(p0), 1)}
          height={PH}
          className="fill-primary/5 transition-all duration-300 ease-out motion-reduce:transition-none"
        />

        {/* Axes */}
        <line
          x1={M.left}
          y1={M.top + PH}
          x2={M.left + PW}
          y2={M.top + PH}
          className="stroke-border"
          strokeWidth={1}
        />
        <line
          x1={M.left}
          y1={M.top}
          x2={M.left}
          y2={M.top + PH}
          className="stroke-border"
          strokeWidth={1}
        />
        {[0, 25, 50, 75, 100].map((t) => (
          <g key={t}>
            <text
              x={xPx(t / 100)}
              y={H - 16}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {t}%
            </text>
            <text
              x={M.left - 8}
              y={yPx(t / 100) + 3}
              textAnchor="end"
              className="fill-muted-foreground text-[10px]"
            >
              {t}%
            </text>
          </g>
        ))}
        <text
          x={M.left + PW / 2}
          y={H - 2}
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          per-AI cooperation probability →
        </text>
        <text
          x={14}
          y={M.top + PH / 2}
          textAnchor="middle"
          transform={`rotate(-90 14 ${M.top + PH / 2})`}
          className="fill-muted-foreground text-[11px]"
        >
          P(at least one cooperates) →
        </text>

        {/* The 1 − (1 − p)^n curve */}
        <path
          d={curve.join(" ")}
          fill="none"
          className="stroke-primary transition-all duration-300 ease-out motion-reduce:transition-none"
          strokeWidth={2}
        />

        {/* Baseline and shifted markers with guides */}
        {[
          { p: p0, y: y0, dot: "fill-muted-foreground", guide: "stroke-muted-foreground/50" },
          { p: p1, y: y1, dot: "fill-primary", guide: "stroke-primary/50" },
        ].map((m, i) => (
          <g
            key={i}
            className="transition-all duration-300 ease-out motion-reduce:transition-none"
          >
            <line
              x1={xPx(m.p)}
              y1={yPx(m.y)}
              x2={xPx(m.p)}
              y2={M.top + PH}
              className={m.guide}
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <line
              x1={M.left}
              y1={yPx(m.y)}
              x2={xPx(m.p)}
              y2={yPx(m.y)}
              className={m.guide}
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <circle
              cx={xPx(m.p)}
              cy={yPx(m.y)}
              r={4.5}
              className={`${m.dot} stroke-card`}
              strokeWidth={1.5}
            />
          </g>
        ))}
      </svg>

      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-3">
        <div>
          <label className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Independent AI draws</span>
            <span className="font-medium tabular-nums">{n}</span>
          </label>
          <input
            type="range"
            min={1}
            max={15}
            step={1}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="accent-primary w-full"
            aria-label="Independent AI draws"
          />
        </div>
        <div>
          <label className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Baseline per-AI probability</span>
            <span className="font-medium tabular-nums">{base}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={base}
            onChange={(e) => setBase(Number(e.target.value))}
            className="accent-primary w-full"
            aria-label="Baseline per-AI cooperation probability"
          />
        </div>
        <div>
          <label className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Per-AI shift from promises</span>
            <span className="font-medium tabular-nums">+{shift}pp</span>
          </label>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={shift}
            onChange={(e) => setShift(Number(e.target.value))}
            className="accent-primary w-full"
            aria-label="Per-AI shift from promises, percentage points"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-xs">Presets from the text:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setN(10);
            setBase(50);
            setShift(15);
          }}
        >
          10 draws at 50%
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setN(3);
            setBase(20);
            setShift(15);
          }}
        >
          3 draws at 20%
        </Button>
      </div>

      <p aria-live="polite" className="text-muted-foreground min-h-14 text-sm">
        {`P(at least one AI cooperates): ${fmt(y0)}% at baseline, ${fmt(y1)}% after the shift — a gain of ${fmt(Math.max(y1 - y0, 0))} percentage points. `}
        When the baseline already makes some cooperator near-certain, shifting
        each AI adds almost nothing; when cooperation is genuinely uncertain,
        the same per-AI shift is worth more than its face value.
      </p>
    </div>
  );
}
