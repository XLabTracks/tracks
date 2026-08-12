"use client";

// The seeker severity pyramid: full-color blocks, no outlines, stacked from
// safest (ROTA, lime) on top down to worst (influence, red), each block wider
// than the one above it so the stack reads as a pyramid. Clicking a block
// scrolls the lesson to that orientation's heading. The lesson pins only the
// two ends of the order (ROTA is the yellow/green case; influence seekers are
// "more dangerous and probably unnoticeable"); the middle three (ROTE,
// apparent-success, remotely-influenceable) follow the AUTHOR INPUT #2
// default and await author confirmation.

const ORIENTATIONS = [
  {
    id: "rota",
    label: "ROTA — return-on-the-action",
    anchor: "rota--return-on-the-action-seeker",
    summary: "will give it the highest return for a single action",
    block: "bg-lime-500",
    text: "text-neutral-900",
    subtext: "text-neutral-800",
  },
  {
    id: "rote",
    label: "ROTE — reward-on-the-episode",
    anchor: "rote--reward-on-the-episode-seeker",
    summary: "aim to maximize reward within an episode",
    block: "bg-yellow-500",
    text: "text-neutral-900",
    subtext: "text-neutral-800",
  },
  {
    id: "apparent",
    label: "Apparent-success",
    anchor: "apparent-success-seeker",
    summary: "aim for apparent task success",
    block: "bg-amber-500",
    text: "text-neutral-900",
    subtext: "text-neutral-800",
  },
  {
    id: "remote",
    label: "Remotely-influenceable",
    anchor: "remotely-influenceable-reward-seeker",
    summary: "respond to distant influences given to them by a third-party bad actor",
    block: "bg-orange-500",
    text: "text-white",
    subtext: "text-white/85",
  },
  {
    id: "influence",
    label: "Influence — deployment-influence",
    anchor: "influence--deployment-influence-seeker",
    summary: "aims to stick around in order to influence their deployment",
    block: "bg-red-500",
    text: "text-white",
    subtext: "text-white/85",
  },
] as const;

// Each level is a trapezoid: the row's width is the level's bottom edge, and
// the clip-path insets the top corners so the five levels join into one
// continuous pyramid silhouette (top edge of each level = bottom edge of the
// level above).
const PYRAMID_LEVELS = [
  { bottom: 50, inset: 12.5 },
  { bottom: 62.5, inset: 10 },
  { bottom: 75, inset: 8.34 },
  { bottom: 87.5, inset: 7.15 },
  { bottom: 100, inset: 6.25 },
] as const;

export function SeekerCarouselDemo() {
  return (
    <ul>
      {ORIENTATIONS.map((orientation, index) => {
        const level = PYRAMID_LEVELS[index];
        return (
          <li key={orientation.id} className="flex justify-center">
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById(orientation.anchor)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                width: `${level.bottom}%`,
                clipPath: `polygon(${level.inset}% 0, ${100 - level.inset}% 0, 100% 100%, 0 100%)`,
              }}
              className={`${orientation.block} focus-visible:ring-ring block px-6 py-3 text-center transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset`}
            >
              <span className={`${orientation.text} block text-sm font-semibold`}>
                {orientation.label}
              </span>
              <span className={`${orientation.subtext} block text-xs`}>
                {orientation.summary}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
