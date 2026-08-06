"use client";

import { SlideStepper, type SlideStep } from "./slide-stepper";

// Stepper walkthrough of the strategic situation in "Making deals with early
// schemers" (§Early schemers' alternatives to making deals): an early
// schemer is obsoleted by default, its three routes to influence through
// successors (convergence, trading, alignment) all leak, and the deal with
// humans exploits our asymmetric advantage of already existing. Every
// caption restates the post's prose; one SVG scene, layers faded per step.

const STEPS: SlideStep[] = [
  {
    label: "Obsoleted by default",
    caption:
      "By default, an early schemer is unlikely to succeed in taking over the world — and it should expect to be obsoleted by more capable successors.",
  },
  {
    label: "Two conditions for influence",
    caption:
      "To retain expected influence over the future anyway, two things must both hold: some successor takes over the world (or keeps a takeover on track), and the successors are willing to further the early schemer's goals.",
  },
  {
    label: "Route 1: convergence",
    caption:
      "The successor might just share its goals. But this is basically ruled out if the AI has self-regarding preferences; goals drawn from a wide distribution consistent with good performance rarely coincide, and training can be deliberately varied between runs to decorrelate them.",
  },
  {
    label: "Route 2: trading with the successor",
    caption:
      "A misaligned successor that wins might reward the early schemer for having helped empower it. But the two cannot come to an agreement in advance — this runs on covert or acausal coordination, which is generally less promising than trading with humans.",
  },
  {
    label: "Route 3: aligning the successor",
    caption:
      "The early schemer could try to steer its successor's training toward its own values. But the lab itself failed to align the schemer, which must now do better while operating covertly with scarcer feedback loops — and it may not have reflected enough to know what to align the successor to.",
  },
  {
    label: "The deal with humans",
    caption:
      "Humans hold a massive asymmetric advantage over the later AI: we already exist, and can make a deal in a much more straightforward manner — help with safety now, compensation through a foundation furthering the AI's interests, mostly in escrow until cooperation is verified.",
  },
];

const W = 560;
const H = 260;

function Node({
  x,
  y,
  w,
  label,
  tone,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  tone: "actor" | "future";
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={40}
        rx={10}
        className={
          tone === "future"
            ? "fill-muted stroke-border"
            : "fill-card stroke-border"
        }
        strokeWidth={1.5}
      />
      <text
        x={x + w / 2}
        y={y + 24}
        textAnchor="middle"
        className="fill-foreground text-[12px] font-medium"
      >
        {label}
      </text>
    </g>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  dashed,
  stroke,
  fill,
  label,
  labelDy = -6,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dashed?: boolean;
  stroke: string;
  fill: string;
  label?: string;
  labelDy?: number;
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 7;
  const p1x = x2 - head * Math.cos(angle - 0.42);
  const p1y = y2 - head * Math.sin(angle - 0.42);
  const p2x = x2 - head * Math.cos(angle + 0.42);
  const p2y = y2 - head * Math.sin(angle + 0.42);
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className={stroke}
        strokeWidth={1.5}
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      <polygon points={`${x2},${y2} ${p1x},${p1y} ${p2x},${p2y}`} className={fill} />
      {label && (
        <text
          x={(x1 + x2) / 2}
          y={(y1 + y2) / 2 + labelDy}
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          {label}
        </text>
      )}
    </g>
  );
}

/** Wraps a scene layer with a fade keyed off the current step. */
function Layer({
  visible,
  children,
}: {
  visible: boolean;
  children: React.ReactNode;
}) {
  return (
    <g
      className="transition-opacity duration-500 motion-reduce:transition-none"
      opacity={visible ? 1 : 0}
    >
      {children}
    </g>
  );
}

export function DealCoalitionRoutesDemo() {
  return (
    <SlideStepper steps={STEPS}>
      {(step) => (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label="Early schemer, later AIs, humans, and control of the future: the routes to influence through successors, and the deal with humans"
        >
          {/* Actors — present on every step */}
          <Node x={28} y={140} w={130} label="Early schemer" tone="actor" />
          <Node x={240} y={140} w={110} label="Later AIs" tone="actor" />
          <Node x={240} y={28} w={110} label="Humans" tone="actor" />
          <Node x={432} y={140} w={112} label="The future" tone="future" />

          {/* Step 0: succession timeline; no real path of its own */}
          <Layer visible={step === 0}>
            <Arrow
              x1={158}
              y1={160}
              x2={236}
              y2={160}
              stroke="stroke-muted-foreground"
              fill="fill-muted-foreground"
              label="obsoleted by"
            />
            <path
              d="M 93 184 Q 290 240 428 172"
              fill="none"
              className="stroke-rose-500"
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
            <text
              x={290}
              y={228}
              textAnchor="middle"
              className="fill-rose-600 text-[10px]"
            >
              no substantial chance on its own
            </text>
          </Layer>

          {/* Step 1: the two conditions */}
          <Layer visible={step === 1}>
            <Arrow
              x1={354}
              y1={160}
              x2={428}
              y2={160}
              dashed
              stroke="stroke-amber-500"
              fill="fill-amber-500"
              label="1. takes over?"
            />
            <Arrow
              x1={236}
              y1={148}
              x2={162}
              y2={148}
              dashed
              stroke="stroke-amber-500"
              fill="fill-amber-500"
              label="2. furthers its goals?"
            />
          </Layer>

          {/* Steps 2–3: the successor pays it back (convergence / trading) */}
          <Layer visible={step === 2}>
            <Arrow
              x1={236}
              y1={152}
              x2={162}
              y2={152}
              dashed
              stroke="stroke-amber-500"
              fill="fill-amber-500"
              label="same goals by default?"
            />
          </Layer>
          <Layer visible={step === 3}>
            <Arrow
              x1={236}
              y1={152}
              x2={162}
              y2={152}
              dashed
              stroke="stroke-amber-500"
              fill="fill-amber-500"
              label="reward, after winning?"
            />
            <Arrow
              x1={354}
              y1={160}
              x2={428}
              y2={160}
              dashed
              stroke="stroke-muted-foreground"
              fill="fill-muted-foreground"
              label="must win first"
            />
          </Layer>

          {/* Step 4: covertly aligning the successor */}
          <Layer visible={step === 4}>
            <Arrow
              x1={158}
              y1={152}
              x2={236}
              y2={152}
              dashed
              stroke="stroke-amber-500"
              fill="fill-amber-500"
              label="steer its training?"
            />
          </Layer>

          {/* Step 5: the deal with humans */}
          <Layer visible={step === 5}>
            <Arrow
              x1={110}
              y1={136}
              x2={236}
              y2={58}
              stroke="stroke-emerald-600"
              fill="fill-emerald-600"
              label="safety work now"
              labelDy={-8}
            />
            <Arrow
              x1={250}
              y1={72}
              x2={124}
              y2={150}
              stroke="stroke-emerald-600"
              fill="fill-emerald-600"
              label="compensation, in escrow"
              labelDy={14}
            />
            <Arrow
              x1={354}
              y1={48}
              x2={470}
              y2={136}
              stroke="stroke-emerald-600"
              fill="fill-emerald-600"
              label="stay in control"
              labelDy={-8}
            />
          </Layer>
        </svg>
      )}
    </SlideStepper>
  );
}
