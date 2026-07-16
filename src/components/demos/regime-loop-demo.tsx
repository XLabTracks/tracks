"use client";

import { SlideStepper, type SlideStep } from "./slide-stepper";

// The regime model's loop (module 2, "Determining the usefulness") as a
// stepper: budget buys a technique, the technique changes the world, the
// catch updates the epistemic state, the evidence refills the budget, and
// the bigger budget funds the next round. Captions restate the lesson's
// five numbered steps.

const STEPS: SlideStep[] = [
  {
    label: "The budget buys a technique",
    caption:
      "The resource state buys a technique — say, a monitoring protocol for the lab's internal AI agents.",
  },
  {
    label: "The technique changes the facts",
    caption:
      "The schemer that would have quietly sabotaged research is now a caught schemer. Its nature didn't change; its situation did — and the world state includes what has happened with the model so far.",
  },
  {
    label: "The catch updates what we know",
    caption:
      "Where there was inference and speculation, there is now a transcript: undeniable, checkable, specific.",
  },
  {
    label: "The evidence feeds the budget",
    caption:
      "Leadership and the public get scared in a useful way. Will refills. Prices drop. Maybe a regulation passes and locks a floor in place.",
  },
  {
    label: "Around again, one stage up",
    caption:
      "The bigger budget buys better techniques for the next, more dangerous capability stage. Money spent now changes how much money exists later — which is why \"when should you invest?\" is a real question.",
  },
];

const W = 560;
const H = 280;

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
}

const NODES: Node[] = [
  { id: "resource", label: "Resource state", x: 280, y: 40 },
  { id: "technique", label: "Technique", x: 470, y: 140 },
  { id: "world", label: "World state", x: 280, y: 240 },
  { id: "epistemic", label: "Epistemic state", x: 90, y: 140 },
];

const NODE_W = 128;
const NODE_H = 34;

// Edges in loop order; edge i is highlighted at step i (step 4 lights all).
// Label positions are hand-placed clear of the arrows.
const EDGES = [
  { from: "resource", to: "technique", lines: ["buys"], lx: 410, ly: 72 },
  {
    from: "technique",
    to: "world",
    lines: ["changes the facts"],
    lx: 428,
    ly: 214,
  },
  { from: "world", to: "epistemic", lines: ["updates"], lx: 148, ly: 214 },
  {
    from: "epistemic",
    to: "resource",
    lines: ["refills will,", "cuts prices"],
    lx: 122,
    ly: 78,
  },
];

function nodeById(id: string): Node {
  return NODES.find((n) => n.id === id)!;
}

/** Straight edge between two node borders, shortened so arrowheads sit clear. */
function edgePath(from: Node, to: Node): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const inset = 78;
  const x1 = from.x + ux * inset;
  const y1 = from.y + uy * inset * 0.55;
  const x2 = to.x - ux * inset;
  const y2 = to.y - uy * inset * 0.55;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

export function RegimeLoopDemo() {
  return (
    <SlideStepper steps={STEPS}>
      {(step) => {
        const litEdges =
          step === 4 ? [0, 1, 2, 3] : [step];
        const litNodes = new Set(
          step === 4
            ? NODES.map((n) => n.id)
            : [EDGES[step].from, EDGES[step].to],
        );
        return (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            role="img"
            aria-label="The loop: the resource state buys a technique, the technique changes the world state, the catch updates the epistemic state, and the evidence refills the resource state."
          >
            <defs>
              <marker
                id="loop-arrow"
                viewBox="0 0 8 8"
                refX="6"
                refY="4"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" fill="var(--primary)" />
              </marker>
              <marker
                id="loop-arrow-dim"
                viewBox="0 0 8 8"
                refX="6"
                refY="4"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" fill="var(--muted-foreground)" />
              </marker>
            </defs>

            {EDGES.map((edge, i) => {
              const lit = litEdges.includes(i);
              const from = nodeById(edge.from);
              const to = nodeById(edge.to);
              return (
                <g
                  key={edge.lines[0]}
                  className="transition-all duration-500 motion-reduce:transition-none"
                >
                  <path
                    d={edgePath(from, to)}
                    fill="none"
                    stroke={lit ? "var(--primary)" : "var(--muted-foreground)"}
                    strokeOpacity={lit ? 1 : 0.45}
                    strokeWidth={lit ? 2.5 : 1.5}
                    markerEnd={lit ? "url(#loop-arrow)" : "url(#loop-arrow-dim)"}
                    className="transition-all duration-500 motion-reduce:transition-none"
                  />
                  <text
                    x={edge.lx}
                    y={edge.ly}
                    fontSize={10}
                    textAnchor="middle"
                    fill={lit ? "var(--primary)" : "var(--muted-foreground)"}
                    fontWeight={lit ? 600 : 400}
                    className="transition-all duration-500 motion-reduce:transition-none"
                  >
                    {edge.lines.map((line, li) => (
                      <tspan key={line} x={edge.lx} dy={li === 0 ? 0 : 12}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              );
            })}

            {NODES.map((node) => {
              const lit = litNodes.has(node.id);
              return (
                <g key={node.id}>
                  <rect
                    x={node.x - NODE_W / 2}
                    y={node.y - NODE_H / 2}
                    width={NODE_W}
                    height={NODE_H}
                    rx={8}
                    fill="var(--card)"
                    stroke={lit ? "var(--primary)" : "var(--border)"}
                    strokeWidth={lit ? 2 : 1.5}
                    className="transition-all duration-500 motion-reduce:transition-none"
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    fontSize={12}
                    fontWeight={600}
                    textAnchor="middle"
                    fill="var(--foreground)"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        );
      }}
    </SlideStepper>
  );
}
