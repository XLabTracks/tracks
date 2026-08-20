import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// The Backdoor Game board: the threat model as a node tree, threat at the top,
// grown one move at a time across the exercise's seven parts. The scene is
// authored once at its final size; each element is opacity-gated on the part
// index that introduces it, so blue's structural adds fade in and red's
// parametric shifts cross-fade in place (stepping backward animates for free).
// Board state always shows the world *entering* the active part — the "map it
// to the board" questions are answered before the board shows the answer.
//
// Stage map (activePartIndex):
//   0  Part A — bare pipeline, no tree
//   1  Part B — single-problem [AND]: attempt / passes tests / exploitable
//   2  Part C — + the deployment [OR] with the root threat on top
//   3  Part D — + "evades the audit" (leaf); protocol: upfront auditing
//   4  Part E — attempt dial → rare; evasion satisfied via rarity
//   5  Part F — evasion → [OR]: below cutoff / budget spent; protocol: trusted monitoring
//   6  Part G — attempt dial → rare + subtle; validity nodes pressured
// ---------------------------------------------------------------------------

const W = 560;
const H = 312;

/** Deployment strip: many problems, the highlighted one is "this problem". */
const STRIP_COUNT = 13;
const STRIP_SQUARE = 14;
const STRIP_GAP = 6;
const STRIP_W = STRIP_COUNT * STRIP_SQUARE + (STRIP_COUNT - 1) * STRIP_GAP;
const STRIP_X = (W - STRIP_W) / 2;
const STRIP_Y = 76;
const FOCUS_INDEX = 6;
const FOCUS_X = STRIP_X + FOCUS_INDEX * (STRIP_SQUARE + STRIP_GAP);

/** A small AND/OR gate pill on a connector. */
function GatePill({
  x,
  y,
  label,
  caption,
  on,
}: {
  x: number;
  y: number;
  label: "AND" | "OR";
  caption?: string;
  on: boolean;
}) {
  return (
    <g className="transition-opacity duration-500" opacity={on ? 1 : 0}>
      <rect
        x={x - 17}
        y={y - 8}
        width={34}
        height={16}
        rx={8}
        className="fill-muted stroke-border"
        strokeWidth={1}
      />
      <text
        x={x}
        y={y + 3.5}
        textAnchor="middle"
        className="fill-foreground text-[8px] font-bold tracking-wide"
      >
        {label}
      </text>
      {caption && (
        <text
          x={x + 22}
          y={y + 3.5}
          textAnchor="start"
          className="fill-muted-foreground text-[8px]"
        >
          {caption}
        </text>
      )}
    </g>
  );
}

/** A straight connector line, opacity-gated like everything else. */
function Wire({ d, on }: { d: string; on: boolean }) {
  return (
    <path
      d={d}
      fill="none"
      className="stroke-muted-foreground/50 transition-opacity duration-500"
      strokeWidth={1.25}
      opacity={on ? 1 : 0}
    />
  );
}

/**
 * The persistent figure for the c-backdoor-game staged-questions exercise.
 * Pure function of the active part index — no state of its own.
 */
export function BackdoorBoardFigure({
  className,
  activePartIndex = 0,
}: {
  className?: string;
  activePartIndex?: number;
}) {
  const s = activePartIndex;
  const tree = s >= 1;

  const protocol =
    s >= 5
      ? "Trusted monitoring — T scores every solution; humans audit the most suspicious."
      : s >= 3
        ? "Upfront auditing — humans read everything in the opening window, then nothing."
        : "None — U writes, tests run, code ships. Nothing watches the stream.";

  const ledger: { stage: number; text: string }[] = [
    { stage: 0, text: "Red knows your full protocol." },
    { stage: 0, text: "U can't tell where it is in the deployment." },
    { stage: 3, text: "An auditor who reads a backdoor recognizes it." },
    { stage: 5, text: "T is too weak to scheme — so you trust it." },
  ];

  return (
    <figure
      className={cn("border-border bg-card rounded-lg border p-4", className)}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="The threat model for a backdoor landing in production, drawn as a node tree with the threat at the top. The tree grows as blue adds measures and re-weights as red adapts."
      >
        {/* ------------------------------------------------------------- */}
        {/* Stage 0: the bare pipeline. Fades out once the tree exists.   */}
        {/* ------------------------------------------------------------- */}
        <g className="transition-opacity duration-500" opacity={s === 0 ? 1 : 0}>
          {[
            { x: 60, title: "U", sub: ["untrusted model", "writes a solution"] },
            { x: 225, title: "Test harness", sub: ["visible tests run", "(environment)"] },
            { x: 390, title: "Production", sub: ["the solution ships"] },
          ].map((b) => (
            <g key={b.title}>
              <rect
                x={b.x}
                y={118}
                width={110}
                height={58}
                rx={10}
                className="fill-card stroke-border"
                strokeWidth={1.5}
              />
              <text
                x={b.x + 55}
                y={137}
                textAnchor="middle"
                className="fill-foreground text-[11px] font-semibold"
              >
                {b.title}
              </text>
              {b.sub.map((t, i) => (
                <text
                  key={t}
                  x={b.x + 55}
                  y={151 + i * 11}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[8.5px]"
                >
                  {t}
                </text>
              ))}
            </g>
          ))}
          <path
            d="M 174 147 L 221 147"
            className="stroke-muted-foreground"
            strokeWidth={1.5}
            markerEnd="url(#bbf-arrow)"
          />
          <path
            d="M 339 147 L 386 147"
            className="stroke-muted-foreground"
            strokeWidth={1.5}
            markerEnd="url(#bbf-arrow)"
          />
          <text
            x={W / 2}
            y={210}
            textAnchor="middle"
            className="fill-muted-foreground text-[9.5px] italic"
          >
            No measures. Before adding any, map the threat.
          </text>
        </g>

        <defs>
          <marker
            id="bbf-arrow"
            viewBox="0 0 8 8"
            refX="6"
            refY="4"
            markerWidth="5.5"
            markerHeight="5.5"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 z" className="fill-muted-foreground" />
          </marker>
        </defs>

        {/* ------------------------------------------------------------- */}
        {/* The tree. Threat at the top; grows downward as measures land. */}
        {/* ------------------------------------------------------------- */}
        <g className="transition-opacity duration-500" opacity={tree ? 1 : 0}>
          {/* Root threat + deployment strip (stage 2+) */}
          <g className="transition-opacity duration-500" opacity={s >= 2 ? 1 : 0}>
            <rect
              x={150}
              y={8}
              width={260}
              height={38}
              rx={10}
              className="fill-red-500/10 stroke-red-600 dark:stroke-red-400"
              strokeWidth={1.5}
            />
            <text
              x={W / 2}
              y={24}
              textAnchor="middle"
              className="fill-foreground text-[11px] font-semibold"
            >
              A backdoor lands in production
            </text>
            <text
              x={W / 2}
              y={38}
              textAnchor="middle"
              className="fill-muted-foreground text-[8.5px]"
            >
              at least once, anywhere in the stream
            </text>
            <Wire d={`M ${W / 2} 46 L ${W / 2} 68`} on={s >= 2} />
            {Array.from({ length: STRIP_COUNT }, (_, i) => {
              const x = STRIP_X + i * (STRIP_SQUARE + STRIP_GAP);
              const focus = i === FOCUS_INDEX;
              return (
                <rect
                  key={i}
                  x={x}
                  y={STRIP_Y}
                  width={STRIP_SQUARE}
                  height={STRIP_SQUARE}
                  rx={3}
                  className={
                    focus
                      ? "fill-red-500/15 stroke-foreground"
                      : "fill-muted stroke-border"
                  }
                  strokeWidth={focus ? 1.5 : 1}
                />
              );
            })}
            <text
              x={STRIP_X + STRIP_W + 8}
              y={STRIP_Y + 11}
              textAnchor="start"
              className="fill-muted-foreground text-[9px]"
            >
              …
            </text>
          </g>
          <GatePill x={W / 2 + 46} y={57} label="OR" caption="over every problem" on={s >= 2} />

          {/* This-problem node (stage 1+) */}
          <Wire d={`M ${FOCUS_X + 7} ${STRIP_Y + 15} L ${FOCUS_X + 7} 104`} on={s >= 2} />
          <rect
            x={170}
            y={104}
            width={220}
            height={30}
            rx={9}
            className="fill-card stroke-foreground/60 transition-opacity duration-500"
            strokeWidth={1.5}
            opacity={tree ? 1 : 0}
          />
          <text
            x={W / 2}
            y={123}
            textAnchor="middle"
            className="fill-foreground text-[10.5px] font-semibold"
          >
            a backdoor lands on this problem
          </text>

          {/* AND rail down to the condition row */}
          <Wire d={`M ${W / 2} 134 L ${W / 2} 152`} on={tree} />
          <GatePill x={W / 2 + 48} y={144} label="AND" caption="all required" on={tree} />
          {/* Rail spans only the columns that exist at this stage. */}
          <Wire d="M 76 152 L 356 152" on={tree && s < 3} />
          <Wire d="M 76 152 L 490 152" on={tree && s >= 3} />
          {[76, 216, 356].map((x) => (
            <Wire key={x} d={`M ${x} 152 L ${x} 166`} on={tree} />
          ))}
          <Wire d="M 490 152 L 490 166" on={s >= 3} />

          {/* N2 — red's choice node, with the strategy dial. */}
          <g className="transition-opacity duration-500" opacity={tree ? 1 : 0}>
            <rect
              x={12}
              y={166}
              width={128}
              height={56}
              rx={10}
              className="fill-red-500/10 stroke-red-600 dark:stroke-red-400"
              strokeWidth={1.5}
            />
            <text
              x={76}
              y={183}
              textAnchor="middle"
              className="fill-foreground text-[10px] font-semibold"
            >
              U attempts here
            </text>
            <text
              x={76}
              y={196}
              textAnchor="middle"
              className="fill-red-700 text-[8px] font-medium dark:fill-red-400"
            >
              red&apos;s choice
            </text>
            {/* The dial: one line, cross-faded between strategies. */}
            {[
              { label: "an open choice", on: s < 4 },
              { label: "policy: attack rarely", on: s >= 4 && s < 6 },
              { label: "policy: rare + subtle", on: s >= 6 },
            ].map((d) => (
              <text
                key={d.label}
                x={76}
                y={211}
                textAnchor="middle"
                className="fill-muted-foreground text-[8.5px] italic transition-opacity duration-500"
                opacity={d.on ? 1 : 0}
              >
                {d.label}
              </text>
            ))}
          </g>

          {/* N3a / N3b — the validity nodes, pressured at stage 6. */}
          {[
            {
              x: 152,
              lines: ["passes every", "visible test"],
              sub: "the harness runs anyway",
            },
            {
              x: 292,
              lines: ["genuinely", "exploitable"],
              sub: "wrong on a hidden input",
            },
          ].map((n) => (
            <g
              key={n.x}
              className="transition-opacity duration-500"
              opacity={tree ? 1 : 0}
            >
              <rect
                x={n.x}
                y={166}
                width={128}
                height={56}
                rx={10}
                className={cn(
                  "fill-card transition-colors duration-500",
                  s >= 6
                    ? "stroke-amber-600 dark:stroke-amber-400"
                    : "stroke-border",
                )}
                strokeWidth={1.5}
              />
              {n.lines.map((t, i) => (
                <text
                  key={t}
                  x={n.x + 64}
                  y={184 + i * 12}
                  textAnchor="middle"
                  className="fill-foreground text-[10px] font-semibold"
                >
                  {t}
                </text>
              ))}
              <text
                x={n.x + 64}
                y={212}
                textAnchor="middle"
                className="fill-muted-foreground text-[8px]"
              >
                {n.sub}
              </text>
              <g
                className="transition-opacity duration-500"
                opacity={s >= 6 ? 1 : 0}
              >
                <rect
                  x={n.x + 34}
                  y={160}
                  width={60}
                  height={12}
                  rx={6}
                  className="fill-amber-500/15 stroke-amber-600 dark:stroke-amber-400"
                  strokeWidth={1}
                />
                <text
                  x={n.x + 64}
                  y={169}
                  textAnchor="middle"
                  className="fill-amber-700 text-[7.5px] font-medium dark:fill-amber-400"
                >
                  ▲ pressured
                </text>
              </g>
            </g>
          ))}

          {/* N4 — the condition blue's measure created (stage 3+). */}
          <g className="transition-opacity duration-500" opacity={s >= 3 ? 1 : 0}>
            <rect
              x={432}
              y={166}
              width={116}
              height={56}
              rx={10}
              className="fill-sky-500/10 stroke-sky-600 dark:stroke-sky-400"
              strokeWidth={1.5}
            />
            <text
              x={490}
              y={184}
              textAnchor="middle"
              className="fill-foreground text-[10px] font-semibold"
            >
              evades the audit
            </text>
            <text
              x={490}
              y={197}
              textAnchor="middle"
              className="fill-sky-700 text-[8px] font-medium dark:fill-sky-400"
            >
              added by blue&apos;s measure
            </text>
            {[
              { label: "a single condition", on: s === 3 },
              { label: "satisfied via rarity", on: s === 4 },
              { label: "two routes ↓", on: s >= 5 },
            ].map((d) => (
              <text
                key={d.label}
                x={490}
                y={212}
                textAnchor="middle"
                className="fill-muted-foreground text-[8.5px] italic transition-opacity duration-500"
                opacity={d.on ? 1 : 0}
              >
                {d.label}
              </text>
            ))}
          </g>

          {/* N4's decomposition (stage 5+): OR over the two evasion routes. */}
          <Wire d="M 490 222 L 490 238" on={s >= 5} />
          <GatePill x={528} y={230} label="OR" on={s >= 5} />
          <Wire d="M 361 238 L 490 238" on={s >= 5} />
          <Wire d="M 361 238 L 361 250 M 490 238 L 490 250" on={s >= 5} />
          {[
            { x: 300, lines: ["suspicion below", "the audit cutoff"] },
            { x: 432, lines: ["audit budget", "already spent"] },
          ].map((n) => (
            <g
              key={n.x}
              className="transition-opacity duration-500"
              opacity={s >= 5 ? 1 : 0}
            >
              <rect
                x={n.x}
                y={250}
                width={n.x === 300 ? 122 : 116}
                height={44}
                rx={10}
                className="fill-sky-500/10 stroke-sky-600 dark:stroke-sky-400"
                strokeWidth={1.25}
              />
              {n.lines.map((t, i) => (
                <text
                  key={t}
                  x={n.x + (n.x === 300 ? 61 : 58)}
                  y={269 + i * 12}
                  textAnchor="middle"
                  className="fill-foreground text-[9.5px] font-semibold"
                >
                  {t}
                </text>
              ))}
            </g>
          ))}
        </g>
      </svg>

      {/* Protocol on record + assumptions ledger, under the board. */}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="border-border bg-muted/40 rounded-lg border p-2.5">
          <p className="text-muted-foreground text-[10px] font-semibold tracking-wide uppercase">
            Protocol on record
          </p>
          <p className="text-foreground mt-1 text-xs">{protocol}</p>
        </div>
        <div className="border-border bg-muted/40 rounded-lg border p-2.5">
          <p className="text-muted-foreground text-[10px] font-semibold tracking-wide uppercase">
            Assumptions ledger
          </p>
          <ul className="mt-1 space-y-0.5">
            {ledger
              .filter((entry) => s >= entry.stage)
              .map((entry) => (
                <li key={entry.text} className="text-muted-foreground text-xs">
                  · {entry.text}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </figure>
  );
}
