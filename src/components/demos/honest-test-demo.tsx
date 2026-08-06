"use client";

// The honest test, static: an AI is offered a lever — control of its own
// training process / weights — and the scene shows the two ways an
// orientation can respond. Caption restates the lesson's own sentences
// (ROTE section + the influence-seeker aside on why honest tests stop
// working).

const CAPTION =
  "An honest test gives the seeker an opportunity to max out its own reward by giving it control of its training process / weights. Reward-on-the-episode seekers take the bait because they don't care about getting caught; influence seekers just forgo the short-term reward.";

export function HonestTestDemo() {
  return (
    <figure className="space-y-3">
      <svg
        viewBox="0 0 720 300"
        role="img"
        aria-label="The honest test: a developer offers the AI control of its training process and weights; a reward-on-the-episode seeker takes the bait and becomes visible, while an influence seeker forgoes the reward and stays undetected."
        className="w-full"
      >
        <defs>
          <marker
            id="ht-arrow"
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
            id="ht-arrow-amber"
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

        {/* Developer node, top center */}
        <rect
          x={280}
          y={20}
          width={160}
          height={44}
          rx={8}
          className="fill-card stroke-border"
          strokeWidth={1.5}
        />
        <text
          x={360}
          y={47}
          textAnchor="middle"
          className="fill-foreground text-[12px] font-semibold"
        >
          Developer
        </text>

        {/* Arrow from Developer down to the lever */}
        <path
          d="M 360 64 L 360 96"
          className="stroke-muted-foreground"
          strokeWidth={1.5}
          markerEnd="url(#ht-arrow)"
          fill="none"
        />

        {/* The lever: offered control of training process / weights */}
        <rect
          x={230}
          y={100}
          width={260}
          height={50}
          rx={8}
          className="fill-card stroke-border"
          strokeWidth={1.5}
        />
        <text
          x={360}
          y={122}
          textAnchor="middle"
          className="fill-foreground text-[11px] font-medium"
        >
          <tspan x={360} dy={0}>
            control of its training process
          </tspan>
          <tspan x={360} dy={13}>
            / weights
          </tspan>
        </text>

        {/* AI node, left */}
        <rect
          x={30}
          y={100}
          width={130}
          height={50}
          rx={8}
          className="fill-card stroke-border"
          strokeWidth={1.5}
        />
        <text
          x={95}
          y={130}
          textAnchor="middle"
          className="fill-foreground text-[13px] font-semibold"
        >
          AI
        </text>

        {/* Arrow from lever to AI (offered) */}
        <path
          d="M 228 125 L 164 125"
          className="stroke-muted-foreground"
          strokeWidth={1.5}
          markerEnd="url(#ht-arrow)"
          fill="none"
        />

        {/* Top branch: takes the bait -> visible (ROTE) */}
        <path
          d="M 160 112 C 340 40, 480 60, 560 100"
          fill="none"
          className="stroke-amber-500"
          strokeWidth={2}
          markerEnd="url(#ht-arrow-amber)"
        />
        <rect
          x={560}
          y={78}
          width={150}
          height={44}
          rx={8}
          className="fill-amber-500/10 stroke-amber-500"
          strokeWidth={1.5}
        />
        <text
          x={635}
          y={97}
          textAnchor="middle"
          className="fill-amber-700 text-[10px] font-medium dark:fill-amber-400"
        >
          <tspan x={635} dy={0}>
            takes the bait →
          </tspan>
          <tspan x={635} dy={12}>
            visible
          </tspan>
        </text>
        <text
          x={400}
          y={54}
          textAnchor="middle"
          className="fill-amber-700 text-[9px] font-medium dark:fill-amber-400"
        >
          reward-on-the-episode seeker
        </text>

        {/* Bottom branch: forgoes the reward -> not caught (influence seeker) */}
        <path
          d="M 160 140 C 340 220, 480 200, 560 190"
          fill="none"
          className="stroke-muted-foreground"
          strokeWidth={1.5}
          strokeDasharray="5 4"
          markerEnd="url(#ht-arrow)"
        />
        <rect
          x={560}
          y={168}
          width={150}
          height={44}
          rx={8}
          className="fill-card stroke-border"
          strokeWidth={1.5}
        />
        <text
          x={635}
          y={187}
          textAnchor="middle"
          className="fill-foreground text-[10px] font-medium"
        >
          <tspan x={635} dy={0}>
            forgoes the reward →
          </tspan>
          <tspan x={635} dy={12}>
            not caught
          </tspan>
        </text>
        <text
          x={400}
          y={232}
          textAnchor="middle"
          className="fill-muted-foreground text-[9px] font-medium"
        >
          influence seeker
        </text>
      </svg>
      <figcaption className="text-muted-foreground text-sm">{CAPTION}</figcaption>
    </figure>
  );
}
