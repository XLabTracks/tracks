"use client";

import { SlideStepper, type SlideStep } from "./slide-stepper";

// The three-server agent architecture from "A basic systems architecture for
// AI agents that do autonomous research" (module 5), with the post's threat
// scenarios drawn as attack paths over one scene. Captions restate the
// post's own sections; attack paths draw in red as their step arrives.

const STEPS: SlideStep[] = [
  {
    label: "The basic architecture",
    caption:
      "Three responsibilities almost surely live on logically different computers: the inference server that serves the LLM API (and holds the weights), the scaffold server that maintains the agent loop's state, and the execution server where the agent's code actually runs. The user talks to the scaffold.",
  },
  {
    label: "Where safety mechanisms sit",
    caption:
      "The scaffold parses the LLM's proposed action before anything executes — the natural place to insert safety mechanisms. It can query a weaker trusted model about the action, then execute it, flag it for human review (auditing), or discard it and select a new one (defer-to-trusted).",
  },
  {
    label: "Weight exfiltration from the execution server",
    caption:
      "If the agent has model weights on its execution server, it could just copy them to a remote server. Hard to do straightforwardly: it's unclear why the agent would have enough egress bandwidth (see upload limits), and it needs somewhere to send them.",
  },
  {
    label: "Hacking the inference server",
    caption:
      "The agent issues commands that hack an inference server and cause it to exfiltrate the weights — say, if outgoing connections from the execution server and incoming connections to the inference server aren't properly secured. This should be pretty simple to prevent.",
  },
  {
    label: "Compromise via committed code",
    caption:
      "The agent commits code that compromises one of the other servers — the inference server is a natural target since it definitely has the weights. Standard security helps (inference servers don't need outgoing connections), but modifying the codebase or infrastructure is probably the best self-exfiltration strategy that needs no help from employees.",
  },
  {
    label: "Rogue agent loop on local GPUs",
    caption:
      "The easiest rogue internal deployment to imagine: the model writes its own agent loop on the execution machine, running inference on the weights and GPUs it was given for its research task — an unauthorized agent with none of your intended safety measures.",
  },
  {
    label: "Rogue scaffold via the inference API",
    caption:
      "Alternatively, the model builds a rogue scaffold on the execution machine that calls the inference server. This seems easier to prevent: basic monitoring on the inference API should catch queries that are blatantly being used to implement unauthorized scaffolds.",
  },
];

const W = 560;
const H = 340;

interface Box {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub: string[];
}

const BOXES: Box[] = [
  { id: "user", x: 20, y: 46, w: 92, h: 54, title: "User", sub: ["submits tasks"] },
  {
    id: "scaffold",
    x: 190, y: 30, w: 140, h: 86,
    title: "Scaffold server",
    sub: ["agent loop & state", "parses actions"],
  },
  {
    id: "inference",
    x: 408, y: 22, w: 134, h: 78,
    title: "Inference server",
    sub: ["serves the LLM API", "holds model weights"],
  },
  {
    id: "execution",
    x: 300, y: 176, w: 150, h: 92,
    title: "Execution server",
    sub: ["sandboxed code runs", "tools · GPUs"],
  },
  {
    id: "internet",
    x: 40, y: 196, w: 110, h: 56,
    title: "Internet",
    sub: ["the outside world"],
  },
];

const box = (id: string) => BOXES.find((b) => b.id === id)!;
const cx = (b: Box) => b.x + b.w / 2;
const cy = (b: Box) => b.y + b.h / 2;

/** A normal-flow arrow between two boxes (both directions implied). */
function Flow({ d }: { d: string }) {
  return (
    <path
      d={d}
      fill="none"
      className="stroke-muted-foreground"
      strokeWidth={1.5}
      markerEnd="url(#aat-flow)"
      markerStart="url(#aat-flow)"
    />
  );
}

/** An attack path, shown only on its step(s). */
function Attack({ d, on, loop }: { d: string; on: boolean; loop?: boolean }) {
  return (
    <path
      d={d}
      fill="none"
      className="stroke-red-600 transition-opacity duration-500 dark:stroke-red-400"
      strokeWidth={2}
      strokeDasharray={loop ? "4 3" : undefined}
      markerEnd="url(#aat-attack)"
      opacity={on ? 1 : 0}
    />
  );
}

export function AgentArchitectureThreatsDemo() {
  const user = box("user");
  const scaffold = box("scaffold");
  const inference = box("inference");
  const execution = box("execution");
  const internet = box("internet");

  return (
    <SlideStepper steps={STEPS}>
      {(step) => (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label="The user, scaffold server, inference server, execution server, and internet, with the post's threat scenarios drawn as attack paths: weight exfiltration, hacking or compromising the inference server, and the two rogue-internal-deployment variants"
        >
          <defs>
            <marker
              id="aat-flow"
              viewBox="0 0 8 8"
              refX="6"
              refY="4"
              markerWidth="5.5"
              markerHeight="5.5"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L8,4 L0,8 z" className="fill-muted-foreground" />
            </marker>
            <marker
              id="aat-attack"
              viewBox="0 0 8 8"
              refX="6"
              refY="4"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path
                d="M0,0 L8,4 L0,8 z"
                className="fill-red-600 dark:fill-red-400"
              />
            </marker>
          </defs>

          {/* Normal flow: user ↔ scaffold ↔ inference; scaffold ↔ execution. */}
          <Flow d={`M ${user.x + user.w + 4} ${cy(user)} L ${scaffold.x - 4} ${cy(user)}`} />
          <Flow d={`M ${scaffold.x + scaffold.w + 4} ${scaffold.y + 34} L ${inference.x - 4} ${inference.y + 34}`} />
          <Flow d={`M ${cx(scaffold) + 14} ${scaffold.y + scaffold.h + 4} L ${execution.x + 44} ${execution.y - 4}`} />
          <text
            x={(scaffold.x + scaffold.w + inference.x) / 2}
            y={scaffold.y + 26}
            textAnchor="middle"
            className="fill-muted-foreground text-[8.5px]"
          >
            LLM API
          </text>
          <text
            x={cx(scaffold) + 52}
            y={(scaffold.y + scaffold.h + execution.y) / 2 + 3}
            textAnchor="middle"
            className="fill-muted-foreground text-[8.5px]"
          >
            actions · results
          </text>

          {/* The boxes */}
          {BOXES.map((b) => {
            const weightsHere = b.id === "inference";
            return (
              <g key={b.id}>
                <rect
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={b.h}
                  rx={10}
                  className={
                    b.id === "internet"
                      ? "fill-muted/60 stroke-border"
                      : "fill-card stroke-border"
                  }
                  strokeWidth={1.5}
                  strokeDasharray={b.id === "internet" ? "5 4" : undefined}
                />
                <text
                  x={cx(b)}
                  y={b.y + 18}
                  textAnchor="middle"
                  className="fill-foreground text-[11px] font-semibold"
                >
                  {b.title}
                </text>
                {b.sub.map((s, i) => (
                  <text
                    key={s}
                    x={cx(b)}
                    y={b.y + 33 + i * 12}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[9px]"
                  >
                    {s}
                  </text>
                ))}
                {weightsHere && (
                  <g>
                    <rect
                      x={b.x + 26}
                      y={b.y + b.h - 20}
                      width={82}
                      height={14}
                      rx={7}
                      className="fill-violet-500/15 stroke-violet-600 dark:stroke-violet-400"
                      strokeWidth={1}
                    />
                    <text
                      x={b.x + 67}
                      y={b.y + b.h - 10}
                      textAnchor="middle"
                      className="fill-violet-700 text-[8px] font-medium dark:fill-violet-400"
                    >
                      model weights
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Step 2: the safety check in the scaffold. */}
          <g
            className="transition-opacity duration-500"
            opacity={step === 1 ? 1 : 0}
          >
            <rect
              x={scaffold.x + 12}
              y={scaffold.y + scaffold.h - 26}
              width={scaffold.w - 24}
              height={18}
              rx={9}
              className="fill-emerald-500/15 stroke-emerald-600 dark:stroke-emerald-400"
              strokeWidth={1.25}
            />
            <text
              x={cx(scaffold)}
              y={scaffold.y + scaffold.h - 13}
              textAnchor="middle"
              className="fill-emerald-700 text-[8.5px] font-medium dark:fill-emerald-400"
            >
              monitor · audit · defer
            </text>
          </g>

          {/* Step 3: weights on the execution server, copied to the internet. */}
          <g className="transition-opacity duration-500" opacity={step === 2 ? 1 : 0}>
            <rect
              x={execution.x + 34}
              y={execution.y + execution.h - 22}
              width={82}
              height={14}
              rx={7}
              className="fill-violet-500/15 stroke-violet-600 dark:stroke-violet-400"
              strokeWidth={1}
            />
            <text
              x={execution.x + 75}
              y={execution.y + execution.h - 12}
              textAnchor="middle"
              className="fill-violet-700 text-[8px] font-medium dark:fill-violet-400"
            >
              weights (if given)
            </text>
          </g>
          <Attack
            on={step === 2}
            d={`M ${execution.x - 4} ${cy(execution) + 18} L ${internet.x + internet.w + 6} ${cy(internet) + 4}`}
          />

          {/* Step 4: hack the inference server, then weights out. */}
          <Attack
            on={step === 3}
            d={`M ${execution.x + 110} ${execution.y - 4} C ${execution.x + 130} ${execution.y - 40}, ${inference.x + 50} ${inference.y + inference.h + 40}, ${inference.x + 56} ${inference.y + inference.h + 4}`}
          />
          <Attack
            on={step === 3 || step === 4}
            d={`M ${inference.x - 2} ${inference.y + inference.h - 8} C ${scaffold.x + 40} ${inference.y + inference.h + 52}, ${internet.x + internet.w + 70} ${internet.y - 46}, ${internet.x + internet.w - 20} ${internet.y - 4}`}
          />

          {/* Step 5: committed code compromises the inference server. */}
          <Attack
            on={step === 4}
            d={`M ${execution.x + 128} ${execution.y - 4} C ${execution.x + 168} ${execution.y - 48}, ${inference.x + 96} ${inference.y + inference.h + 44}, ${inference.x + 100} ${inference.y + inference.h + 4}`}
          />
          <text
            x={inference.x + 128}
            y={execution.y - 34}
            textAnchor="middle"
            className="fill-red-600 text-[8.5px] transition-opacity duration-500 dark:fill-red-400"
            opacity={step === 4 ? 1 : 0}
          >
            <tspan x={inference.x + 108} dy={0}>
              PRs deployed to
            </tspan>
            <tspan x={inference.x + 108} dy={11}>
              the servers
            </tspan>
          </text>

          {/* Steps 6–7: rogue loops on the execution machine. */}
          <Attack
            loop
            on={step === 5}
            d={`M ${execution.x + execution.w - 10} ${execution.y + 24} C ${execution.x + execution.w + 42} ${execution.y + 30}, ${execution.x + execution.w + 42} ${execution.y + 70}, ${execution.x + execution.w - 10} ${execution.y + 76}`}
          />
          <text
            x={execution.x + execution.w + 26}
            y={execution.y + 54}
            textAnchor="start"
            className="fill-red-600 text-[8.5px] transition-opacity duration-500 dark:fill-red-400"
            opacity={step === 5 ? 1 : 0}
          >
            own agent loop
          </text>
          <Attack
            loop
            on={step === 6}
            d={`M ${execution.x + 118} ${execution.y - 4} C ${execution.x + 150} ${execution.y - 52}, ${inference.x + 60} ${inference.y + inference.h + 48}, ${inference.x + 66} ${inference.y + inference.h + 4}`}
          />
          <text
            x={inference.x + 40}
            y={execution.y - 40}
            textAnchor="middle"
            className="fill-red-600 text-[8.5px] transition-opacity duration-500 dark:fill-red-400"
            opacity={step === 6 ? 1 : 0}
          >
            <tspan x={inference.x + 30} dy={0}>
              rogue scaffold&apos;s
            </tspan>
            <tspan x={inference.x + 30} dy={11}>
              API queries
            </tspan>
          </text>
        </svg>
      )}
    </SlideStepper>
  );
}
