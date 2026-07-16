"use client";

import { useState } from "react";
import { SlideStepper, type SlideStep } from "./slide-stepper";

// The regime model's three states and the safety budget (module 2,
// "Determining the usefulness"): the diagram builds across seven steps —
// the three states first, then the resource state expanded into the
// household picture (the will account, the priced aisles, the basket,
// and what refills the budget). Content restates the lesson's own prose.

const STEPS: SlideStep[] = [
  {
    label: "A regime, split in three",
    caption:
      "A regime — the bundle of conditions that determines whether control is worth it — splits into three parts that behave very differently. Each answers a different question. Hover or tap a box to peek inside.",
  },
  {
    label: "World state",
    caption:
      "The facts on the ground, whether or not anyone knows them. You never observe the world state directly — the next step shows why that matters.",
  },
  {
    label: "Epistemic state",
    caption:
      "Our picture of the world state. The two can come apart: a control evaluation's score is a measurement, and whether control actually works against the actual model is a different thing entirely. A high safety score from a poor evaluation is a reassuring epistemic state pointing at a world state it doesn't match.",
  },
  {
    label: "Resource state: the will account",
    caption:
      "One bank account: political will — the authorization to do costly safety things. Not money; permission and backing. It is the only currency. It fades over time if nothing reinforces it, and it spikes after frightening incidents.",
  },
  {
    label: "The priced aisles",
    caption:
      "The things you can spend will on, each with a price tag — and the regime sets the prices, not the lab. The usefulness tax is priced by commercial pressure and public mood, compute by internal politics, delay by the race.",
  },
  {
    label: "The basket",
    caption:
      "Your shopping cart is a safety technique. Deploying control means buying a particular basket: a lot of usefulness tax, some compute, very little delay. Same plan, same basket — different price tags in different worlds.",
  },
  {
    label: "What refills the budget",
    caption:
      "Three things generate budget, and they work differently: incidents and evidence refill the account directly; public buy-in changes the prices; passed policy spends will once and locks a durable floor in place.",
  },
];

const W = 520;
const H = 376;

type StateId = "world" | "epistemic" | "resource";

interface StateBox {
  id: StateId;
  x: number;
  title: string;
  question: [string, string];
  items: string[];
}

const BOX_Y = 34;
const BOX_W = 156;
const BOX_H = 150;

const BOXES: StateBox[] = [
  {
    id: "world",
    x: 16,
    title: "World state",
    question: ["What is control actually", "worth here?"],
    items: [
      "what the model is like",
      "how capable it is",
      "how checkable research is",
      "what has happened so far",
    ],
  },
  {
    id: "epistemic",
    x: 182,
    title: "Epistemic state",
    question: ["What do we justifiably", "think it's worth?"],
    items: [
      "confidence in alignment",
      "interpretability findings",
      "the track record",
      "evaluation results",
    ],
  },
  {
    id: "resource",
    x: 348,
    title: "Resource state",
    question: ["Can we afford to act", "on what we think?"],
    items: [
      "political will — the account",
      "price: usefulness tax",
      "price: compute",
      "price: delay",
    ],
  },
];

// Which box a step opens by default; hover/tap can override on steps 0–2.
const STEP_DEFAULT: (StateId | null)[] = [null, "world", "epistemic"];

/** One aisle shelf in the household picture. */
function Aisle({ y, text }: { y: number; text: string }) {
  return (
    <g>
      <rect
        x={200}
        y={y}
        width={180}
        height={22}
        rx={6}
        className="fill-muted stroke-border"
        strokeWidth={1}
      />
      <text
        x={290}
        y={y + 15}
        textAnchor="middle"
        className="fill-foreground text-[10px]"
      >
        {text}
      </text>
    </g>
  );
}

/** An upward arrow with a label beneath it (the budget generators). */
function InArrow({ x, toY, label }: { x: number; toY: number; label: string }) {
  return (
    <g>
      <line
        x1={x}
        y1={344}
        x2={x}
        y2={toY}
        className="stroke-muted-foreground"
        strokeWidth={1.5}
        markerEnd="url(#rs-arrow)"
      />
      <text
        x={x}
        y={360}
        textAnchor="middle"
        className="fill-muted-foreground text-[9px]"
      >
        {label}
      </text>
    </g>
  );
}

export function RegimeStatesDemo() {
  const [hovered, setHovered] = useState<StateId | null>(null);

  return (
    <SlideStepper steps={STEPS}>
      {(step) => {
        // From the will-account step on, the household picture is the focus
        // and the resource box stays open; before that, hover wins.
        const active: StateId | null =
          step >= 3 ? "resource" : (hovered ?? STEP_DEFAULT[step]);
        const bankVisible = step >= 3;
        const aislesVisible = step >= 4;
        const basketVisible = step >= 5;
        const refillsVisible = step >= 6;
        return (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            role="img"
            aria-label="The three regime states — world, epistemic, resource — with the resource state expanded into the safety budget: the political-will account, the priced aisles, the basket, and what refills the budget"
          >
            <defs>
              <marker
                id="rs-arrow"
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

            {/* The three state boxes */}
            {BOXES.map((box) => {
              const open = active === box.id;
              return (
                <g
                  key={box.id}
                  onMouseEnter={() => setHovered(box.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() =>
                    setHovered((h) => (h === box.id ? null : box.id))
                  }
                  className="cursor-pointer"
                >
                  <rect
                    x={box.x}
                    y={BOX_Y}
                    width={BOX_W}
                    height={BOX_H}
                    rx={12}
                    className={`transition-colors duration-300 ${
                      open
                        ? "fill-primary/5 stroke-primary"
                        : "fill-card stroke-border"
                    }`}
                    strokeWidth={1.5}
                  />
                  <text
                    x={box.x + BOX_W / 2}
                    y={BOX_Y + 24}
                    textAnchor="middle"
                    className="fill-foreground text-[12px] font-semibold"
                  >
                    {box.title}
                  </text>
                  <text
                    textAnchor="middle"
                    className="fill-muted-foreground text-[10px] italic"
                  >
                    <tspan x={box.x + BOX_W / 2} y={BOX_Y + 42}>
                      {box.question[0]}
                    </tspan>
                    <tspan x={box.x + BOX_W / 2} y={BOX_Y + 55}>
                      {box.question[1]}
                    </tspan>
                  </text>
                  <g
                    className="transition-opacity duration-300"
                    opacity={open ? 1 : 0}
                  >
                    {box.items.map((item, i) => (
                      <text
                        key={item}
                        x={box.x + 12}
                        y={BOX_Y + 80 + i * 17}
                        className="fill-muted-foreground text-[10px]"
                      >
                        – {item}
                      </text>
                    ))}
                  </g>
                </g>
              );
            })}

            {/* Measured-vs-actual gap: epistemic points at world */}
            <g
              className="transition-opacity duration-500"
              opacity={step === 2 ? 1 : 0}
            >
              <path
                d="M 260 30 Q 177 4 98 30"
                fill="none"
                className="stroke-muted-foreground"
                strokeWidth={1.5}
                strokeDasharray="5 4"
                markerEnd="url(#rs-arrow)"
              />
              <text
                x={177}
                y={14}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
              >
                measured ≠ actual
              </text>
            </g>

            {/* Household picture — the safety budget */}
            <g
              className="transition-opacity duration-500"
              opacity={bankVisible ? 1 : 0}
            >
              <line
                x1={426}
                y1={BOX_Y + BOX_H}
                x2={426}
                y2={204}
                className="stroke-primary/50"
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
              <text
                x={100}
                y={208}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
              >
                the account
              </text>
              <rect
                x={20}
                y={214}
                width={160}
                height={76}
                rx={10}
                className="fill-card stroke-border"
                strokeWidth={1.5}
              />
              <text
                x={100}
                y={248}
                textAnchor="middle"
                className="fill-foreground text-[12px] font-semibold"
              >
                Political will
              </text>
              <text
                x={100}
                y={264}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                the only currency
              </text>
            </g>

            <g
              className="transition-opacity duration-500"
              opacity={aislesVisible ? 1 : 0}
            >
              <text
                x={290}
                y={208}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
              >
                the aisles — the regime sets prices
              </text>
              <Aisle y={214} text="usefulness tax · public mood" />
              <Aisle y={242} text="compute · internal politics" />
              <Aisle y={270} text="delay · the race" />
            </g>

            <g
              className="transition-opacity duration-500"
              opacity={basketVisible ? 1 : 0}
            >
              <text
                x={452}
                y={208}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
              >
                the basket — a technique
              </text>
              <rect
                x={400}
                y={214}
                width={104}
                height={76}
                rx={10}
                className="fill-card stroke-border"
                strokeWidth={1.5}
              />
              <text
                x={452}
                y={230}
                textAnchor="middle"
                className="fill-foreground text-[10px] font-semibold"
              >
                control&apos;s basket
              </text>
              {(
                [
                  ["tax", 52],
                  ["compute", 24],
                  ["delay", 6],
                ] as const
              ).map(([label, width], i) => (
                <g key={label}>
                  <text
                    x={408}
                    y={247 + i * 14}
                    className="fill-muted-foreground text-[9px]"
                  >
                    {label}
                  </text>
                  <rect
                    x={448}
                    y={240 + i * 14}
                    width={width}
                    height={7}
                    rx={2}
                    className="fill-primary/60"
                  />
                </g>
              ))}
            </g>

            {/* What refills the budget */}
            <g
              className="transition-opacity duration-500"
              opacity={refillsVisible ? 1 : 0}
            >
              <line
                x1={20}
                y1={298}
                x2={180}
                y2={298}
                className="stroke-primary"
                strokeWidth={3}
                strokeLinecap="round"
              />
              <InArrow x={60} toY={306} label="incidents & evidence" />
              <InArrow x={150} toY={304} label="passed policy" />
              <InArrow x={290} toY={298} label="public buy-in" />
            </g>
          </svg>
        );
      }}
    </SlideStepper>
  );
}
