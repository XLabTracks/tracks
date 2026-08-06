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

const PYRAMID_WIDTHS = ["w-[56%]", "w-[67%]", "w-[78%]", "w-[89%]", "w-full"] as const;

export function SeekerCarouselDemo() {
  return (
    <ul className="space-y-1">
      {ORIENTATIONS.map((orientation, index) => (
        <li key={orientation.id} className="flex justify-center">
          <button
            type="button"
            onClick={() =>
              document
                .getElementById(orientation.anchor)
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className={`${orientation.block} ${PYRAMID_WIDTHS[index]} focus-visible:ring-ring block rounded-md px-4 py-3 text-center transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none`}
          >
            <span className={`${orientation.text} block text-sm font-semibold`}>
              {orientation.label}
            </span>
            <span className={`${orientation.subtext} block text-xs`}>
              {orientation.summary}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
