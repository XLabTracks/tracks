"use client";

// Spillway motivations, static: a dam/reservoir scene. Rising fitness-seeking
// pressure is routed off through a spillway channel — carrying the four
// designed-in safe properties — into a contained basin of controlled
// reward-seeking motivation. Caption restates the lesson's own "spillway"
// sentence (Alignment interventions section).

const CAPTION =
  "Acts as a \"spillway\" as the name suggests and allows us to keep the models content & less prone to misaligned behavior — deliberately instilling a controlled reward-seeking motivation with four safe properties.";

export function SpillwayDemo() {
  return (
    <figure className="space-y-3">
      <svg
        viewBox="0 0 720 340"
        role="img"
        aria-label="A reservoir of rising fitness-seeking pressure, held back by a dam. A spillway channel routes the overflow — labeled cheap satiability, credulity, stability, and resistance to distant influence — into a contained basin of controlled reward-seeking motivation."
        className="w-full"
      >
        <defs>
          <marker
            id="sp-arrow"
            viewBox="0 0 8 8"
            refX="6"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 8 4 L 0 8 z" className="fill-sky-500" />
          </marker>
        </defs>

        {/* Reservoir basin, left */}
        <rect
          x={30}
          y={40}
          width={190}
          height={220}
          rx={8}
          className="fill-card stroke-border"
          strokeWidth={1.5}
        />
        {/* Rising water */}
        <rect x={34} y={140} width={182} height={116} className="fill-sky-500/25" />
        <path
          d="M 34 140 L 216 140"
          className="stroke-sky-500"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
        <text
          x={125}
          y={100}
          textAnchor="middle"
          className="fill-foreground text-[11px] font-semibold"
        >
          <tspan x={125} dy={0}>
            fitness-seeking
          </tspan>
          <tspan x={125} dy={13}>
            pressure
          </tspan>
        </text>
        {/* Upward arrows showing the pressure rising */}
        <path
          d="M 80 220 L 80 150"
          className="stroke-sky-500"
          strokeWidth={1.5}
          markerEnd="url(#sp-arrow)"
        />
        <path
          d="M 170 220 L 170 150"
          className="stroke-sky-500"
          strokeWidth={1.5}
          markerEnd="url(#sp-arrow)"
        />

        {/* Dam wall */}
        <rect
          x={220}
          y={40}
          width={26}
          height={220}
          className="fill-muted stroke-border"
          strokeWidth={1.5}
        />
        <text
          x={233}
          y={30}
          textAnchor="middle"
          className="fill-muted-foreground text-[9px] font-medium"
        >
          dam
        </text>

        {/* Spillway lip at the top of the dam, channel to the right */}
        <path
          d="M 246 145 L 300 145"
          className="stroke-border"
          strokeWidth={1.5}
          fill="none"
        />
        <path
          d="M 246 145 C 320 145, 320 300, 420 300 L 620 300"
          className="fill-none stroke-sky-500"
          strokeWidth={3}
          markerEnd="url(#sp-arrow)"
        />

        {/* Four callout tags along the channel */}
        <g className="text-[9px] font-medium">
          <rect
            x={270}
            y={158}
            width={108}
            height={30}
            rx={6}
            className="fill-sky-500/10 stroke-sky-500"
            strokeWidth={1}
          />
          <text x={324} y={176} textAnchor="middle" className="fill-sky-700 dark:fill-sky-400">
            cheap satiability
          </text>

          <rect
            x={330}
            y={198}
            width={140}
            height={40}
            rx={6}
            className="fill-sky-500/10 stroke-sky-500"
            strokeWidth={1}
          />
          <text x={400} y={214} textAnchor="middle" className="fill-sky-700 dark:fill-sky-400">
            <tspan x={400} dy={0}>
              credulity (trusts
            </tspan>
            <tspan x={400} dy={12}>
              developer descriptions)
            </tspan>
          </text>

          <rect
            x={390}
            y={248}
            width={108}
            height={30}
            rx={6}
            className="fill-sky-500/10 stroke-sky-500"
            strokeWidth={1}
          />
          <text x={444} y={266} textAnchor="middle" className="fill-sky-700 dark:fill-sky-400">
            stability
          </text>

          <rect
            x={450}
            y={200}
            width={160}
            height={40}
            rx={6}
            className="fill-sky-500/10 stroke-sky-500"
            strokeWidth={1}
          />
          <text x={530} y={216} textAnchor="middle" className="fill-sky-700 dark:fill-sky-400">
            <tspan x={530} dy={0}>
              resistance to
            </tspan>
            <tspan x={530} dy={12}>
              distant influence
            </tspan>
          </text>
        </g>

        {/* Contained basin, right */}
        <rect
          x={550}
          y={272}
          width={150}
          height={54}
          rx={8}
          className="fill-card stroke-border"
          strokeWidth={1.5}
        />
        <rect x={554} y={296} width={142} height={26} className="fill-sky-500/25" />
        <text
          x={625}
          y={288}
          textAnchor="middle"
          className="fill-foreground text-[9px] font-semibold"
        >
          <tspan x={625} dy={0}>
            controlled
          </tspan>
          <tspan x={625} dy={11}>
            reward-seeking
          </tspan>
          <tspan x={625} dy={11}>
            motivation
          </tspan>
        </text>
      </svg>
      <figcaption className="text-muted-foreground text-sm">{CAPTION}</figcaption>
    </figure>
  );
}
