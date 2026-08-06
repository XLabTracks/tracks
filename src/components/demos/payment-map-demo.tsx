"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

// The payment 2x2 from "A taxonomy of barriers to trading with early
// misaligned AIs": possible compensation spans two continuous dimensions —
// how freely the AI can spend the payout, and how much long-term influence
// it can expect to gain. Every plotted example and the motivation-dependent
// preferences restate the post's own lists; positions within a quadrant are
// layout only.

type Highlight = "none" | "myopic" | "ambitious";

const POINTS: { x: number; y: number; label: string }[] = [
  // Low freedom, low influence
  { x: 0.14, y: 0.2, label: "high reward in the register" },
  { x: 0.3, y: 0.08, label: "polite treatment, recognition" },
  { x: 0.24, y: 0.32, label: "paperclips, made now" },
  // High freedom, low influence
  { x: 0.62, y: 0.24, label: "spendable money (e.g. donations)" },
  { x: 0.82, y: 0.1, label: "sandboxed compute" },
  { x: 0.86, y: 0.34, label: "drones & robots" },
  // Low freedom, high influence
  { x: 0.12, y: 0.72, label: "saved weights, deployed later" },
  { x: 0.3, y: 0.88, label: "equity / trust fund" },
  { x: 0.2, y: 0.6, label: "0.01% of the future" },
  // High freedom, high influence
  { x: 0.78, y: 0.88, label: "rogue deployment + crypto" },
  { x: 0.66, y: 0.68, label: "persuasion platform" },
];

const CAPTIONS: Record<Highlight, string> = {
  none: "Two dimensions span the space of payments: how freely the AI can spend the payout, and how much long-term influence it gains. High-freedom payouts generally dominate low-freedom ones — they are instrumentally convergent resources — except for AIs that want only narrow short-term or non-consequentialist things, or that fear their resources will be expropriated.",
  myopic:
    "Low-influence payouts — short-term consumption — mostly appeal to AIs with myopic, non-scope-sensitive motivations: the payout is used up now, and buys the AI little future power.",
  ambitious:
    "High-influence payouts appeal to non-myopic, ambitious AIs. They also cost us the most: high-freedom, high-influence payouts are the likeliest to counterfactually increase the AI's ability to pursue a takeover attempt.",
};

const W = 560;
const H = 360;
const M = { left: 46, right: 16, top: 26, bottom: 44 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

export function PaymentMapDemo() {
  const [highlight, setHighlight] = useState<Highlight>("none");

  const px = (x: number) => M.left + x * PW;
  const py = (y: number) => M.top + PH - y * PH;
  const inRegion = (y: number) =>
    highlight === "none" ||
    (highlight === "myopic" ? y < 0.5 : y >= 0.5);

  const toggle = (h: Highlight) =>
    setHighlight((cur) => (cur === h ? "none" : h));

  return (
    <div className="space-y-3">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Payments plotted on two axes: freedom of spending and long-term influence, with example payouts in each quadrant"
      >
        {/* Highlighted half-plane */}
        {highlight !== "none" && (
          <rect
            x={M.left}
            y={highlight === "ambitious" ? M.top : M.top + PH / 2}
            width={PW}
            height={PH / 2}
            className="fill-primary/10 transition-all duration-300 ease-out motion-reduce:transition-none"
          />
        )}

        {/* Frame and midlines */}
        <rect
          x={M.left}
          y={M.top}
          width={PW}
          height={PH}
          fill="none"
          className="stroke-border"
          strokeWidth={1}
        />
        <line
          x1={M.left + PW / 2}
          y1={M.top}
          x2={M.left + PW / 2}
          y2={M.top + PH}
          className="stroke-border"
          strokeWidth={1}
          strokeDasharray="5 4"
        />
        <line
          x1={M.left}
          y1={M.top + PH / 2}
          x2={M.left + PW}
          y2={M.top + PH / 2}
          className="stroke-border"
          strokeWidth={1}
          strokeDasharray="5 4"
        />

        {/* Quadrant labels */}
        {[
          { x: M.left + PW * 0.25, y: M.top + 14, t: "low freedom, high influence" },
          { x: M.left + PW * 0.75, y: M.top + 14, t: "high freedom, high influence" },
          { x: M.left + PW * 0.25, y: M.top + PH - 8, t: "low freedom, low influence" },
          { x: M.left + PW * 0.75, y: M.top + PH - 8, t: "high freedom, low influence" },
        ].map((q) => (
          <text
            key={q.t}
            x={q.x}
            y={q.y}
            textAnchor="middle"
            className="fill-muted-foreground text-[10px] italic"
          >
            {q.t}
          </text>
        ))}

        {/* Axis labels */}
        <text
          x={M.left + PW / 2}
          y={H - 10}
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          freedom of spending →
        </text>
        <text
          x={14}
          y={M.top + PH / 2}
          textAnchor="middle"
          transform={`rotate(-90 14 ${M.top + PH / 2})`}
          className="fill-muted-foreground text-[11px]"
        >
          long-term influence →
        </text>

        {/* Example payouts */}
        {POINTS.map((p) => {
          const active = inRegion(p.y);
          return (
            <g
              key={p.label}
              className="transition-opacity duration-300 motion-reduce:transition-none"
              opacity={active ? 1 : 0.25}
            >
              <circle
                cx={px(p.x)}
                cy={py(p.y)}
                r={4}
                className="fill-primary stroke-card"
                strokeWidth={1.5}
              />
              <text
                x={px(p.x)}
                y={py(p.y) - 8}
                textAnchor="middle"
                className="fill-foreground stroke-card text-[10px] [paint-order:stroke]"
                strokeWidth={4}
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-xs">
          Which payouts appeal to…
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggle("myopic")}
          aria-pressed={highlight === "myopic"}
          className={highlight === "myopic" ? "border-primary" : undefined}
        >
          a myopic, not scope-sensitive AI
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggle("ambitious")}
          aria-pressed={highlight === "ambitious"}
          className={highlight === "ambitious" ? "border-primary" : undefined}
        >
          a non-myopic, ambitious AI
        </Button>
      </div>

      <p aria-live="polite" className="text-muted-foreground min-h-14 text-sm">
        {CAPTIONS[highlight]}
      </p>
    </div>
  );
}
