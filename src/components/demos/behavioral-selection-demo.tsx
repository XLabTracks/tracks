"use client";

// Behavioral selection: how seekers come to exist. Left, a cloud of candidate
// cognitive patterns entering training. Center, the filter — training
// reinforces whichever behavior scored well, not whichever goal produced it
// ("How seekers come to exist"). Right, the surviving mix, with the seeker
// node accented and clickable: it scrolls the reader to "What a seeker is"
// (an in-lesson heading anchor; null-guarded because that anchor does not
// exist on the /demos gallery page).

const FILTER_SENTENCE =
  "training reinforces whichever behavior scored well, not whichever goal produced it";

const CANDIDATES = [
  { id: "aligned", label: "aligned", y: 60 },
  { id: "seeker", label: "seeker", y: 130 },
  { id: "schemer", label: "schemer", y: 200 },
];

function scrollToSeekerDescription() {
  document.getElementById("what-a-seeker-is")?.scrollIntoView({ behavior: "smooth" });
}

export function BehavioralSelectionDemo() {
  return (
    <figure className="space-y-3">
      <svg
        viewBox="0 0 720 280"
        role="img"
        aria-label="Behavioral selection: candidate cognitive patterns — aligned, seeker, schemer — pass through a training filter that reinforces whichever behavior scored well, not whichever goal produced it. The surviving mix on the right includes a seeker, accented, that links to a description of what a seeker is."
        className="w-full"
      >
        <defs>
          <marker
            id="bsm-arrow"
            viewBox="0 0 8 8"
            refX="6"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 8 4 L 0 8 z" className="fill-muted-foreground" />
          </marker>
        </defs>

        {/* Left: cloud of candidate cognitive-pattern nodes */}
        <text
          x={80}
          y={24}
          textAnchor="middle"
          className="fill-muted-foreground text-[9px] font-medium"
        >
          candidate patterns
        </text>
        {CANDIDATES.map((c) => (
          <g key={c.id}>
            <rect
              x={20}
              y={c.y}
              width={120}
              height={40}
              rx={8}
              className="fill-card stroke-border"
              strokeWidth={1.5}
            />
            <text
              x={80}
              y={c.y + 25}
              textAnchor="middle"
              className="fill-foreground text-[11px] font-medium"
            >
              {c.label}
            </text>
            <path
              d={`M 140 ${c.y + 20} C 200 ${c.y + 20}, 220 130, 270 130`}
              fill="none"
              className="stroke-muted-foreground"
              strokeWidth={1.25}
              markerEnd="url(#bsm-arrow)"
            />
          </g>
        ))}

        {/* Center: the filter box */}
        <rect
          x={270}
          y={90}
          width={200}
          height={80}
          rx={8}
          className="fill-card stroke-border"
          strokeWidth={1.5}
        />
        <text
          x={370}
          y={112}
          textAnchor="middle"
          className="fill-foreground text-[9.5px] font-medium"
        >
          <tspan x={370} dy={0}>
            training reinforces
          </tspan>
          <tspan x={370} dy={13}>
            whichever behavior
          </tspan>
          <tspan x={370} dy={13}>
            scored well, not
          </tspan>
          <tspan x={370} dy={13}>
            whichever goal
          </tspan>
          <tspan x={370} dy={13}>
            produced it
          </tspan>
        </text>

        {/* Arrow from filter to surviving mix */}
        <path
          d="M 470 130 L 520 130"
          className="stroke-muted-foreground"
          strokeWidth={1.5}
          markerEnd="url(#bsm-arrow)"
          fill="none"
        />

        {/* Right: the surviving mix */}
        <text
          x={620}
          y={24}
          textAnchor="middle"
          className="fill-muted-foreground text-[9px] font-medium"
        >
          surviving mix
        </text>
        <rect
          x={560}
          y={40}
          width={120}
          height={40}
          rx={8}
          className="fill-card stroke-border"
          strokeWidth={1.5}
        />
        <text
          x={620}
          y={65}
          textAnchor="middle"
          className="fill-foreground text-[11px] font-medium"
        >
          aligned
        </text>

        {/* The seeker node: clickable + keyboard-reachable, directs to the description */}
        <g
          role="button"
          tabIndex={0}
          aria-label="seeker — jump to what a seeker is"
          onClick={scrollToSeekerDescription}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              scrollToSeekerDescription();
            }
          }}
          className="cursor-pointer outline-none focus-visible:[&>rect]:stroke-ring focus-visible:[&>rect]:stroke-2"
        >
          <rect
            x={560}
            y={110}
            width={120}
            height={40}
            rx={8}
            className="fill-amber-500/10 stroke-amber-500"
            strokeWidth={1.5}
          />
          <text
            x={620}
            y={135}
            textAnchor="middle"
            className="fill-amber-700 text-[11px] font-semibold dark:fill-amber-400"
          >
            seeker
          </text>
        </g>

        <rect
          x={560}
          y={180}
          width={120}
          height={40}
          rx={8}
          className="fill-card stroke-border"
          strokeWidth={1.5}
        />
        <text
          x={620}
          y={205}
          textAnchor="middle"
          className="fill-foreground text-[11px] font-medium"
        >
          schemer
        </text>
      </svg>
      <figcaption className="text-muted-foreground text-sm">
        Behavioral selection: {FILTER_SENTENCE}, so what survives training is a mix of
        cognitive patterns — aligned, seeker, and schemer among them. Select the seeker
        node for what a seeker is.
      </figcaption>
    </figure>
  );
}
