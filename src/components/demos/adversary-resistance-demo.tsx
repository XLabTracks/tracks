"use client";

import { SlideStepper, type SlideStep } from "./slide-stepper";

// Illustrates adversary-resistance training (module 6, "Alignment
// interventions"): the AI is trained on identical-looking situations that
// carry different reward functions, so it learns to respond only to
// developer-administered incentives rather than to any lookalike adversary.

const STEPS: SlideStep[] = [
  {
    label: "Identical-looking situations",
    caption: "Two identical-looking situations with different reward functions.",
  },
  {
    label: "Different reward functions",
    caption: "Two identical-looking situations with different reward functions.",
  },
  {
    label: "Only developer-administered incentives",
    caption: "So the AI only responds to developer-administered incentives.",
  },
];

const W = 520;
const H = 290;

function SituationCard({ x, label }: { x: number; label: string }) {
  return (
    <g>
      <rect
        x={x}
        y={70}
        width={160}
        height={90}
        rx={10}
        className="fill-card stroke-border"
        strokeWidth={1.5}
      />
      <text
        x={x + 80}
        y={100}
        textAnchor="middle"
        className="fill-foreground text-[12px] font-semibold"
      >
        {label}
      </text>
      <text
        x={x + 80}
        y={120}
        textAnchor="middle"
        className="fill-muted-foreground text-[10px]"
      >
        Same observation
      </text>
      <text
        x={x + 80}
        y={136}
        textAnchor="middle"
        className="fill-muted-foreground text-[10px]"
      >
        Same action options
      </text>
    </g>
  );
}

function RewardTag({ x, text, tone }: { x: number; text: string; tone: "dev" | "adv" }) {
  return (
    <g>
      <rect
        x={x}
        y={175}
        width={160}
        height={26}
        rx={13}
        className={
          tone === "dev"
            ? "fill-primary/10 stroke-primary/40"
            : "fill-amber-500/10 stroke-amber-500/40"
        }
        strokeWidth={1}
      />
      <text
        x={x + 80}
        y={192}
        textAnchor="middle"
        className="fill-foreground text-[11px]"
      >
        {text}
      </text>
    </g>
  );
}

export function AdversaryResistanceDemo() {
  return (
    <SlideStepper steps={STEPS}>
      {(step) => {
        const tagsVisible = step >= 1;
        const arrowsVisible = step === 2;
        return (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            role="img"
            aria-label="Two identical-looking situations with different reward functions, so the AI only responds to developer-administered incentives"
          >
            <defs>
              <marker
                id="ar-arrow-dev"
                viewBox="0 0 8 8"
                refX="6"
                refY="4"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" className="fill-primary" />
              </marker>
              <marker
                id="ar-arrow-adv"
                viewBox="0 0 8 8"
                refX="6"
                refY="4"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" className="fill-amber-500" />
              </marker>
            </defs>

            <SituationCard x={60} label="Situation A" />
            <SituationCard x={300} label="Situation B" />

            <g className="transition-opacity duration-500" opacity={tagsVisible ? 1 : 0}>
              <RewardTag x={60} text="Developer reward function" tone="dev" />
              <RewardTag x={300} text="Adversary reward function" tone="adv" />
            </g>

            <g
              className="transition-opacity duration-500"
              opacity={arrowsVisible ? 1 : 0}
            >
              <rect
                x={200}
                y={230}
                width={120}
                height={40}
                rx={10}
                className="fill-card stroke-primary"
                strokeWidth={1.5}
              />
              <text
                x={260}
                y={255}
                textAnchor="middle"
                className="fill-foreground text-[12px] font-semibold"
              >
                AI
              </text>
              <text
                x={260}
                y={218}
                textAnchor="middle"
                className="fill-primary text-[11px] font-semibold"
              >
                AI responds
              </text>
              <line
                x1={140}
                y1={201}
                x2={222}
                y2={229}
                className="stroke-primary"
                strokeWidth={2.5}
                markerEnd="url(#ar-arrow-dev)"
              />
              <line
                x1={380}
                y1={201}
                x2={298}
                y2={229}
                className="stroke-amber-500"
                strokeWidth={2}
                strokeDasharray="4 3"
                markerEnd="url(#ar-arrow-adv)"
                opacity={0.35}
              />
            </g>
          </svg>
        );
      }}
    </SlideStepper>
  );
}
