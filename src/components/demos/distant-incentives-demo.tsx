"use client";

// Distant incentives, static: remotely-influenceable reward seekers respond
// to influences from a third-party bad actor delivered from far away in time
// (retroactive reward) or belief (anthropic capture). Two stacked panels in
// one scene; captions restate the lesson's own sentences (remotely-influenceable
// reward seeker section).

const CAPTION_A =
  "Retroactive reward: reward is promised to be delivered long after the action is run.";
const CAPTION_B =
  "Anthropic capture: it believes it is in a simulation & acts differently as a result.";

export function DistantIncentivesDemo() {
  return (
    <figure className="space-y-3">
      <svg
        viewBox="0 0 720 340"
        role="img"
        aria-label="Two ways a third-party bad actor delivers distant influence to a remotely-influenceable reward seeker: retroactive reward, promised long after the action is run, and anthropic capture, where the agent believes it is in a simulation and acts differently as a result."
        className="w-full"
      >
        <defs>
          <marker
            id="di-arrow"
            viewBox="0 0 8 8"
            refX="6"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 8 4 L 0 8 z" className="fill-muted-foreground" />
          </marker>
          <marker
            id="di-arrow-amber"
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

        {/* Panel A: Retroactive reward */}
        <text
          x={20}
          y={26}
          className="fill-foreground text-[13px] font-semibold"
        >
          A. Retroactive reward
        </text>

        {/* Timeline arrow */}
        <path
          d="M 60 100 L 660 100"
          className="stroke-muted-foreground"
          strokeWidth={1.5}
          markerEnd="url(#di-arrow)"
          fill="none"
        />
        <text
          x={660}
          y={122}
          textAnchor="end"
          className="fill-muted-foreground text-[10px] font-medium"
        >
          time
        </text>

        {/* Action marker: now (left) */}
        <circle cx={110} cy={100} r={6} className="fill-foreground" />
        <text
          x={110}
          y={130}
          textAnchor="middle"
          className="fill-foreground text-[11px] font-medium"
        >
          <tspan x={110} dy={0}>
            action
          </tspan>
          <tspan x={110} dy={13}>
            (now)
          </tspan>
        </text>

        {/* Reward marker: later (far right) */}
        <circle cx={560} cy={100} r={6} className="fill-amber-500" />
        <text
          x={560}
          y={130}
          textAnchor="middle"
          className="fill-amber-700 text-[11px] font-medium dark:fill-amber-400"
        >
          <tspan x={560} dy={0}>
            reward
          </tspan>
          <tspan x={560} dy={13}>
            delivered (later)
          </tspan>
        </text>

        {/* Third-party bad actor node, above */}
        <rect
          x={430}
          y={20}
          width={200}
          height={40}
          rx={8}
          className="fill-card stroke-border"
          strokeWidth={1.5}
        />
        <text
          x={530}
          y={45}
          textAnchor="middle"
          className="fill-foreground text-[11px] font-medium"
        >
          third-party bad actor
        </text>

        {/* Promise arrow: from bad actor down to the action point */}
        <path
          d="M 460 60 C 300 90, 200 90, 116 92"
          fill="none"
          className="stroke-amber-500"
          strokeWidth={2}
          strokeDasharray="5 4"
          markerEnd="url(#di-arrow-amber)"
        />
        <text
          x={300}
          y={78}
          textAnchor="middle"
          className="fill-amber-700 text-[10px] font-medium dark:fill-amber-400"
        >
          promise of future reward
        </text>

        <text
          x={360}
          y={158}
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          {CAPTION_A}
        </text>

        {/* Divider */}
        <line
          x1={20}
          y1={185}
          x2={700}
          y2={185}
          className="stroke-border"
          strokeWidth={1}
        />

        {/* Panel B: Anthropic capture */}
        <text
          x={20}
          y={210}
          className="fill-foreground text-[13px] font-semibold"
        >
          B. Anthropic capture
        </text>

        {/* Dashed frame labeled "simulation?" */}
        <rect
          x={260}
          y={222}
          width={200}
          height={100}
          rx={10}
          className="fill-card stroke-amber-500"
          strokeWidth={1.5}
          strokeDasharray="6 4"
        />
        <text
          x={360}
          y={240}
          textAnchor="middle"
          className="fill-amber-700 text-[10px] font-semibold dark:fill-amber-400"
        >
          simulation?
        </text>

        {/* Agent node inside the dashed frame */}
        <rect
          x={310}
          y={258}
          width={100}
          height={40}
          rx={8}
          className="fill-card stroke-border"
          strokeWidth={1.5}
        />
        <text
          x={360}
          y={282}
          textAnchor="middle"
          className="fill-foreground text-[12px] font-semibold"
        >
          Agent
        </text>

        {/* Thought bubble line pointing up-left from the frame */}
        <circle cx={250} cy={250} r={3} className="fill-muted-foreground" />
        <circle cx={238} cy={238} r={4.5} className="fill-muted-foreground" />
        <circle cx={222} cy={222} r={6.5} className="fill-card stroke-muted-foreground" strokeWidth={1} />

        <text
          x={40}
          y={255}
          className="fill-muted-foreground text-[10px]"
        >
          <tspan x={40} dy={0}>
            believes it is in a simulation
          </tspan>
          <tspan x={40} dy={13}>
            &amp; acts differently as a
          </tspan>
          <tspan x={40} dy={13}>
            result
          </tspan>
        </text>
      </svg>
      <figcaption className="text-muted-foreground text-sm">
        {CAPTION_A} {CAPTION_B}
      </figcaption>
    </figure>
  );
}
