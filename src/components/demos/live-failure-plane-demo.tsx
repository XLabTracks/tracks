"use client";

import { useState } from "react";

// The latency-by-damage plane from "Blocking live failures with synchronous
// monitors" (module 5). The post defines the taxonomy in prose: threats have
// an attack latency (a grace period before harm starts) and a rate of damage
// (via damage already dealt or costs of recovery); live failures are the
// low-latency, high-damage corner, where asynchronous monitors are least
// effective. The plotted examples and every caption restate the post's own
// descriptions.

interface Threat {
  id: string;
  label: string;
  /** 0 = long grace period, 1 = none. */
  x: number;
  /** 0 = low rate of damage, 1 = very high. */
  y: number;
  caption: string;
  uncertain?: boolean;
  /** Draw the label under the point (for points near the top edge). */
  labelBelow?: true;
}

const THREATS: Threat[] = [
  {
    id: "backdoor",
    label: "Code backdoor",
    x: 0.14,
    y: 0.55,
    caption:
      "Code backdooring has attack latency — a grace period between the attack and any harm (time-to-impact, in cybersecurity terms). If the backdoor is detected before being exploited, an asynchronous monitor was exactly as effective as a synchronous one.",
  },
  {
    id: "api-key",
    label: "API-key compromise",
    x: 0.62,
    y: 0.3,
    caption:
      "API-key compromise leads to a constant bleed of lost money and compute. The damage already dealt can't be reversed when detected, but the bleed can be stopped equally easily at any time by disabling the key.",
  },
  {
    id: "credentials",
    label: "Credential compromise",
    x: 0.48,
    y: 0.55,
    caption:
      "Access-credential compromise might cause no direct harm by the time it's detected — but the longer it persists, the more widespread and costly the cleanup. The damage accumulates as costs of recovery.",
  },
  {
    id: "weight-exfil",
    label: "Weight exfiltration",
    x: 0.88,
    y: 0.88,
    labelBelow: true,
    caption:
      "The classic live failure. It might be possible to exfiltrate weights in a short window of time, and once they're out there's no way to get them back. Leaking sensitive source code or algorithmic secrets to the internet is a close cousin.",
  },
  {
    id: "rogue-internal",
    label: "Rogue internal deployment",
    x: 0.72,
    y: 0.76,
    uncertain: true,
    labelBelow: true,
    caption:
      "Rogue internal deployments involving privilege escalation and compromise of monitoring systems might quickly become highly damaging or extremely costly to recover from — they give the misaligned AI increased affordances to cause further cascading failures. The post flags real uncertainty about how hard recovery would be.",
  },
];

const DEFAULT_CAPTION =
  "Threats with low attack latency and a very high rate of damage are live failures: still very damaging even if detected shortly after they occur. Asynchronous monitors are least effective against them — this is where blocking synchronous monitors matter most. Tap a point to see the post's description of each example.";

const W = 560;
const H = 330;
const PX = 58;
const PY = 18;
const PW = 478;
const PH = 252;

const px = (x: number) => PX + x * PW;
const py = (y: number) => PY + (1 - y) * PH;

export function LiveFailurePlaneDemo() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = THREATS.find((t) => t.id === selected) ?? null;

  return (
    <div className="space-y-3">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="A plane of attack latency against rate of damage, with the post's example threats plotted as points and the live-failure region — short latency, high damage — shaded in the top-right corner"
      >
        <defs>
          <marker
            id="lfp-axis"
            viewBox="0 0 8 8"
            refX="6"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L8,4 L0,8 z" className="fill-muted-foreground" />
          </marker>
        </defs>

        {/* Live-failure region: the low-latency, high-damage corner. */}
        <path
          d={`M ${px(0.55)} ${py(1)} Q ${px(0.62)} ${py(0.62)} ${px(1)} ${py(0.52)} L ${px(1)} ${py(1)} Z`}
          className="fill-amber-500/20 stroke-amber-500"
          strokeWidth={1.25}
          strokeDasharray="5 4"
        />
        {/* Region label sits in the shaded corner's top-left, clear of the
            points near the top-right (their labels draw below the points). */}
        <text
          x={px(0.57)}
          y={py(0.955)}
          className="fill-amber-700 text-[11px] font-bold dark:fill-amber-400"
        >
          Live failures
        </text>
        <text
          x={px(0.57)}
          y={py(0.9)}
          className="fill-amber-700/80 text-[9px] dark:fill-amber-400/80"
        >
          async monitors least effective
        </text>

        {/* Threat points */}
        {THREATS.map((t) => {
          const on = t.id === selected;
          return (
            <g
              key={t.id}
              onClick={() => setSelected((s) => (s === t.id ? null : t.id))}
              onMouseEnter={() => setSelected(t.id)}
              className="cursor-pointer"
            >
              <circle
                cx={px(t.x)}
                cy={py(t.y)}
                r={12}
                className="fill-transparent"
              />
              <circle
                cx={px(t.x)}
                cy={py(t.y)}
                r={on ? 6 : 4.5}
                className={`transition-all duration-200 ${
                  on
                    ? "fill-primary stroke-primary/40"
                    : "fill-card stroke-primary"
                }`}
                strokeWidth={on ? 5 : 1.75}
                strokeDasharray={t.uncertain ? "2 2" : undefined}
              />
              <text
                x={px(t.x)}
                y={py(t.y) + (t.labelBelow ? 21 : -11)}
                textAnchor="middle"
                className={`text-[10px] transition-colors duration-200 ${
                  on ? "fill-foreground font-semibold" : "fill-muted-foreground"
                }`}
              >
                {t.label}
                {t.uncertain ? " (?)" : ""}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line
          x1={PX - 10}
          y1={PY + PH}
          x2={PX - 10}
          y2={PY - 2}
          className="stroke-muted-foreground"
          strokeWidth={1.5}
          markerEnd="url(#lfp-axis)"
        />
        <line
          x1={PX - 10}
          y1={PY + PH + 10}
          x2={PX + PW + 8}
          y2={PY + PH + 10}
          className="stroke-muted-foreground"
          strokeWidth={1.5}
          markerEnd="url(#lfp-axis)"
        />
        {/* Two rotated lines on separate baselines, both clear of the axis. */}
        <text
          x={PX - 38}
          y={PY + PH / 2}
          transform={`rotate(-90 ${PX - 38} ${PY + PH / 2})`}
          textAnchor="middle"
          className="fill-foreground text-[11px] font-medium"
        >
          Rate of damage
        </text>
        <text
          x={PX - 25}
          y={PY + PH / 2}
          transform={`rotate(-90 ${PX - 25} ${PY + PH / 2})`}
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          damage dealt · costs of recovery
        </text>
        <text
          x={PX + PW / 2}
          y={H - 14}
          textAnchor="middle"
          className="fill-foreground text-[11px] font-medium"
        >
          Attack latency
        </text>
        <text
          x={PX}
          y={H - 2}
          className="fill-muted-foreground text-[9px]"
        >
          long grace period
        </text>
        <text
          x={PX + PW}
          y={H - 2}
          textAnchor="end"
          className="fill-muted-foreground text-[9px]"
        >
          none — harm is immediate
        </text>
      </svg>

      <div className="border-border bg-muted/40 min-h-24 rounded-lg border p-3 text-sm">
        <p className="font-medium">{active ? active.label : "Live failures"}</p>
        <p className="text-muted-foreground mt-1">
          {active ? active.caption : DEFAULT_CAPTION}
        </p>
      </div>
    </div>
  );
}
