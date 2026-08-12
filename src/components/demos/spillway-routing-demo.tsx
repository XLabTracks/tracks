"use client";

// The spillway routing mechanism from the spillway post, as a 4-step
// stepper: misspecified reward pressure branches into dangerous
// generalizations; a salient spillway motivation captures that pressure
// instead; at deployment the motivation is active until satiated, at which
// point the remaining (plausibly aligned) motivations drive behavior. One
// SVG scene; layers fade with the step index so stepping backward animates.
// Every caption is verbatim (or trimmed) from the post's own sentences.

import { SlideStepper, type SlideStep } from "./slide-stepper";

const STEPS: SlideStep[] = [
  {
    label: "Training: misspecified reward",
    caption:
      "RL is intended to help the model learn useful skills, but the reward signal is sometimes misspecified, and the resulting training pressure causes harmful generalization.",
  },
  {
    label: "Training: channel into the spillway",
    caption:
      "Developers could similarly try to channel unwanted RL pressures into a spillway motivation, preventing them from reinforcing more dangerous generalizations (like deceptive alignment, emergent misalignment, or uncontrolled varieties of fitness-seeking).",
  },
  {
    label: "Deployment: before satiation",
    caption:
      "At inference time, developers can try to neutralize the spillway motivation by satisfying it.",
  },
  {
    label: "Deployment: satiated",
    caption:
      "If the user honestly tells the AI that it will get maximum score no matter what, then the spillway motivation should be indifferent to the AI's actions, and no longer influences behavior. Even if the model is mostly motivated by the spillway, it would now be guided by the remaining motivations, which are plausibly aligned.",
  },
];

const W = 720;
const H = 300;

function Node({
  x,
  y,
  w,
  h,
  label,
  accent,
  dimmed,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string[];
  accent?: "amber" | "red" | "emerald";
  dimmed?: boolean;
}) {
  const fill =
    accent === "amber"
      ? "fill-amber-500/15 stroke-amber-500"
      : accent === "red"
        ? "fill-red-500/10 stroke-red-500"
        : accent === "emerald"
          ? "fill-emerald-500/10 stroke-emerald-500"
          : "fill-card stroke-border";
  return (
    <g
      className={`transition-opacity duration-300 ${dimmed ? "opacity-30" : "opacity-100"}`}
    >
      <rect x={x} y={y} width={w} height={h} rx={8} className={fill} strokeWidth={1.5} />
      {label.map((line, i) => (
        <text
          key={line}
          x={x + w / 2}
          y={y + h / 2 + (i - (label.length - 1) / 2) * 14 + 4}
          textAnchor="middle"
          className="fill-foreground text-[11px] font-medium"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

export function SpillwayRoutingDemo() {
  return (
    <SlideStepper steps={STEPS}>
      {(step) => {
        const dangersActive = step === 0;
        const spillwayCaptures = step >= 1;
        const deployment = step >= 2;
        const satiated = step === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Spillway routing diagram" className="w-full">
            <defs>
              <marker id="spw-arrow" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
                <path d="M0 0 L8 4 L0 8 Z" className="fill-muted-foreground" />
              </marker>
              <marker id="spw-arrow-red" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
                <path d="M0 0 L8 4 L0 8 Z" className="fill-red-500" />
              </marker>
              <marker id="spw-arrow-amber" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
                <path d="M0 0 L8 4 L0 8 Z" className="fill-amber-500" />
              </marker>
              <marker id="spw-arrow-emerald" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
                <path d="M0 0 L8 4 L0 8 Z" className="fill-emerald-500" />
              </marker>
            </defs>

            {/* Source of pressure */}
            <Node x={20} y={110} w={160} h={56} label={["reward hacking", "(misspecified reward)"]} />

            {/* Dangerous generalizations (step 0) */}
            <g className={`transition-opacity duration-300 ${dangersActive ? "opacity-100" : "opacity-25"}`}>
              <line x1={180} y1={122} x2={288} y2={52} className="stroke-red-500" strokeWidth={1.5} markerEnd="url(#spw-arrow-red)" />
              <line x1={180} y1={132} x2={288} y2={108} className="stroke-red-500" strokeWidth={1.5} markerEnd="url(#spw-arrow-red)" />
              <line x1={180} y1={142} x2={288} y2={164} className="stroke-red-500" strokeWidth={1.5} markerEnd="url(#spw-arrow-red)" />
            </g>
            <Node x={292} y={26} w={190} h={40} label={["deceptive alignment"]} accent="red" dimmed={!dangersActive} />
            <Node x={292} y={86} w={190} h={40} label={["emergent misalignment"]} accent="red" dimmed={!dangersActive} />
            <Node x={292} y={146} w={190} h={40} label={["uncontrolled fitness-seeking"]} accent="red" dimmed={!dangersActive} />

            {/* Spillway capture (step 1+) */}
            <g className={`transition-opacity duration-300 ${spillwayCaptures ? "opacity-100" : "opacity-0"}`}>
              <path d="M 100 166 C 100 220, 180 244, 288 248" fill="none" className="stroke-amber-500" strokeWidth={2} markerEnd="url(#spw-arrow-amber)" />
            </g>
            <Node
              x={292}
              y={224}
              w={190}
              h={48}
              label={["spillway motivation"]}
              accent="amber"
              dimmed={!spillwayCaptures || satiated}
            />

            {/* Deployment (step 2+) */}
            <g className={`transition-opacity duration-300 ${deployment && !satiated ? "opacity-100" : "opacity-0"}`}>
              <line x1={482} y1={248} x2={560} y2={248} className="stroke-amber-500" strokeWidth={2} markerEnd="url(#spw-arrow-amber)" />
              <text x={640} y={252} textAnchor="middle" className="fill-foreground text-[11px] font-medium">
                drives behavior
              </text>
            </g>

            {/* Satiation (step 3) */}
            <g className={`transition-opacity duration-300 ${satiated ? "opacity-100" : "opacity-0"}`}>
              <rect x={292} y={286} width={190} height={2} className="fill-transparent" />
              <text x={387} y={292} textAnchor="middle" className="fill-muted-foreground text-[10px]">
                “maximum score no matter what” → indifferent
              </text>
              <line x1={482} y1={110} x2={560} y2={110} className="stroke-emerald-500" strokeWidth={2} markerEnd="url(#spw-arrow-emerald)" />
              <text x={643} y={106} textAnchor="middle" className="fill-foreground text-[11px] font-medium">
                guides behavior
              </text>
            </g>
            <Node x={510} y={26} w={190} h={48} label={["remaining motivations", "(plausibly aligned)"]} accent="emerald" dimmed={!satiated} />
          </svg>
        );
      }}
    </SlideStepper>
  );
}
