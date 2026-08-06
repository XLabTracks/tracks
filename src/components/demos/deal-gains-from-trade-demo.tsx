"use client";

import { useState } from "react";

// Interactive version of the illustrative outcome table in "Making deals
// with early schemers": the distribution over who dominates the future when
// the early AI cooperates vs sabotages, and the range of offers that beats
// both sides' no-deal alternatives. Defaults reproduce the post's table
// (cooperate: 90/0/10, sabotage: 50/1/49 across humans / the early AI
// itself / later AIs); the credibility slider restates the post's point
// that credibility issues can be compensated by offering a higher payoff.
// The functional form is the minimal expected-value comparison implied by
// the table — sliders only move the post's illustrative numbers.

const W = 560;
const H = 252;
const BAR_X = 132;
const BAR_W = W - BAR_X - 20;
const AXIS_Y = 196;

const SEGMENTS = [
  { key: "humans", label: "Humans dominate", cls: "fill-emerald-500" },
  { key: "early", label: "Early AI dominates", cls: "fill-amber-500" },
  { key: "later", label: "Later AIs dominate", cls: "fill-rose-500" },
] as const;

function fmtPct(v: number): string {
  if (!Number.isFinite(v)) return "—";
  return v < 10 ? v.toFixed(1) : Math.round(v).toString();
}

function OutcomeBar({
  y,
  title,
  shares,
}: {
  y: number;
  title: string;
  shares: [number, number, number];
}) {
  const starts = shares.map((_, i) =>
    shares.slice(0, i).reduce((a, b) => a + b, 0),
  );
  return (
    <g>
      <text
        x={BAR_X - 8}
        y={y + 17}
        textAnchor="end"
        className="fill-foreground text-[11px] font-medium"
      >
        {title}
      </text>
      {shares.map((share, i) => {
        const w = (share / 100) * BAR_W;
        const segX = BAR_X + (starts[i] / 100) * BAR_W;
        return (
          <g key={SEGMENTS[i].key}>
            <rect
              x={segX}
              y={y}
              width={w}
              height={26}
              className={`${SEGMENTS[i].cls} transition-all duration-300 ease-out motion-reduce:transition-none`}
            />
            {w > 36 && (
              <text
                x={segX + w / 2}
                y={y + 17}
                textAnchor="middle"
                className="fill-white text-[10px] font-medium"
              >
                {Math.round(share)}%
              </text>
            )}
          </g>
        );
      })}
      <rect
        x={BAR_X}
        y={y}
        width={BAR_W}
        height={26}
        fill="none"
        className="stroke-border"
        strokeWidth={1}
      />
    </g>
  );
}

function Slider({
  label,
  value,
  max,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  max?: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div>
      <label className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">
          {value}%{suffix ? ` ${suffix}` : ""}
        </span>
      </label>
      <input
        type="range"
        min={0}
        max={max ?? 100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-primary w-full"
        aria-label={label}
      />
    </div>
  );
}

export function DealGainsFromTradeDemo() {
  const [hCoop, setHCoop] = useState(90); // P(humans dominate | AI cooperates)
  const [hSab, setHSab] = useState(50); // P(humans dominate | AI sabotages)
  const [eSabRaw, setESab] = useState(1); // P(early AI dominates | sabotage)
  const [cred, setCred] = useState(100); // P(we pay | humans dominate, AI cooperated)

  // The sabotage row must stay a probability distribution.
  const eSab = Math.min(eSabRaw, 100 - hSab);

  // The AI's alternative to a deal is sabotage, which wins it the future
  // with probability eSab. Cooperating for an offered share p of future
  // resources pays off only if humans end up dominating AND we follow
  // through: hCoop · cred · p. So the AI accepts iff p ≥ pMin. The deal
  // helps us iff keeping (1 − p) of the cooperate-worlds beats keeping all
  // of the sabotage-worlds: hCoop · (1 − p) ≥ hSab, i.e. p ≤ pMax.
  const pMin =
    hCoop > 0 && cred > 0 ? (eSab * 10000) / (hCoop * cred) : Infinity;
  const pMax = hCoop > 0 ? (1 - hSab / hCoop) * 100 : 0;
  const dealExists = pMin < pMax;

  const px = (pct: number) => BAR_X + (Math.min(pct, 100) / 100) * BAR_W;

  const readout = dealExists
    ? `Any offer between ${fmtPct(pMin)}% and ${fmtPct(pMax)}% of future resources beats both sides' no-deal alternatives. Lowering credibility raises the AI's minimum — a less credible promise must be compensated with a more generous offer.`
    : pMax <= 0
      ? "No deal: cooperation does not improve our odds enough for any offer to be worth its cost to us."
      : "No deal: the smallest offer the AI would accept exceeds the largest offer worth making — the promise is too unlikely to pay out (or sabotage too likely to win) for any share to bridge the gap.";

  return (
    <div className="space-y-3">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Outcome distributions when the early AI cooperates versus sabotages, and the range of offer sizes acceptable to both sides"
      >
        {/* Legend */}
        {SEGMENTS.map((seg, i) => (
          <g key={seg.key}>
            <rect
              x={BAR_X + i * 140}
              y={10}
              width={10}
              height={10}
              className={seg.cls}
              rx={2}
            />
            <text
              x={BAR_X + i * 140 + 15}
              y={19}
              className="fill-muted-foreground text-[10px]"
            >
              {seg.label}
            </text>
          </g>
        ))}

        <OutcomeBar
          y={34}
          title="AI cooperates"
          shares={[hCoop, 0, 100 - hCoop]}
        />
        <OutcomeBar
          y={72}
          title="AI sabotages"
          shares={[hSab, eSab, 100 - hSab - eSab]}
        />

        {/* Offer-size axis with the mutually acceptable band */}
        <text
          x={BAR_X}
          y={AXIS_Y - 40}
          className="fill-foreground text-[11px] font-medium"
        >
          Offer size (share of future resources)
        </text>
        {dealExists && (
          <rect
            x={px(pMin)}
            y={AXIS_Y - 14}
            width={Math.max(px(pMax) - px(pMin), 1.5)}
            height={14}
            className="fill-primary/15 transition-all duration-300 ease-out motion-reduce:transition-none"
          />
        )}
        <line
          x1={BAR_X}
          y1={AXIS_Y}
          x2={BAR_X + BAR_W}
          y2={AXIS_Y}
          className="stroke-border"
          strokeWidth={1}
        />
        {[0, 25, 50, 75, 100].map((t) => (
          <g key={t}>
            <line
              x1={px(t)}
              y1={AXIS_Y}
              x2={px(t)}
              y2={AXIS_Y + 4}
              className="stroke-border"
              strokeWidth={1}
            />
            <text
              x={px(t)}
              y={AXIS_Y + 16}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {t}%
            </text>
          </g>
        ))}
        {Number.isFinite(pMin) && pMin <= 100 && (
          <g className="transition-all duration-300 ease-out motion-reduce:transition-none">
            <line
              x1={px(pMin)}
              y1={AXIS_Y - 18}
              x2={px(pMin)}
              y2={AXIS_Y}
              className="stroke-amber-500"
              strokeWidth={2}
            />
            <text
              x={px(pMin)}
              y={AXIS_Y - 22}
              textAnchor={pMin > 80 ? "end" : "start"}
              className="fill-amber-600 text-[10px] font-medium"
            >
              AI&apos;s minimum {fmtPct(pMin)}%
            </text>
          </g>
        )}
        {pMax > 0 && (
          <g className="transition-all duration-300 ease-out motion-reduce:transition-none">
            <line
              x1={px(pMax)}
              y1={AXIS_Y - 18}
              x2={px(pMax)}
              y2={AXIS_Y}
              className="stroke-emerald-600"
              strokeWidth={2}
            />
            <text
              x={px(pMax)}
              y={AXIS_Y - 22}
              textAnchor={pMax > 70 ? "end" : "start"}
              className="fill-emerald-700 text-[10px] font-medium"
            >
              our maximum {fmtPct(pMax)}%
            </text>
          </g>
        )}
      </svg>

      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <Slider
          label="Humans dominate if the AI cooperates"
          value={hCoop}
          onChange={setHCoop}
        />
        <Slider
          label="Humans dominate if the AI sabotages"
          value={hSab}
          onChange={(v) => {
            setHSab(v);
            setESab((e) => Math.min(e, 100 - v));
          }}
        />
        <Slider
          label="The AI itself wins via sabotage"
          value={eSab}
          max={100 - hSab}
          onChange={setESab}
        />
        <Slider
          label="Credibility of our promise to pay"
          value={cred}
          onChange={setCred}
        />
      </div>

      <p aria-live="polite" className="text-muted-foreground min-h-14 text-sm">
        {readout}
      </p>
    </div>
  );
}
