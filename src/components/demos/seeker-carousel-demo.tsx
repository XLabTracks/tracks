"use client";

// The seeker severity carousel: a vertical list of the five seeker
// orientations, ordered safest (lime) to worst (red). Clicking a row scrolls
// the lesson to that orientation's heading. The lesson pins only the two
// ends of the order (ROTA is the yellow/green case; influence seekers are
// "more dangerous and probably unnoticeable"); the middle three (ROTE,
// apparent-success, remotely-influenceable) follow the AUTHOR INPUT #2
// default and await author confirmation.

const ORIENTATIONS = [
  {
    id: "rota",
    label: "ROTA — return-on-the-action",
    anchor: "rota--return-on-the-action-seeker",
    summary: "will give it the highest return for a single action",
    swatch: "bg-lime-500",
  },
  {
    id: "rote",
    label: "ROTE — reward-on-the-episode",
    anchor: "rote--reward-on-the-episode-seeker",
    summary: "aim to maximize reward within an episode",
    swatch: "bg-yellow-500",
  },
  {
    id: "apparent",
    label: "Apparent-success",
    anchor: "apparent-success-seeker",
    summary: "aim for apparent task success",
    swatch: "bg-amber-500",
  },
  {
    id: "remote",
    label: "Remotely-influenceable",
    anchor: "remotely-influenceable-reward-seeker",
    summary: "respond to distant influences given to them by a third-party bad actor",
    swatch: "bg-orange-500",
  },
  {
    id: "influence",
    label: "Influence — deployment-influence",
    anchor: "influence--deployment-influence-seeker",
    summary: "aims to stick around in order to influence their deployment",
    swatch: "bg-red-500",
  },
] as const;

export function SeekerCarouselDemo() {
  return (
    <div className="space-y-2">
      <ul className="divide-border border-border divide-y rounded-lg border">
        {ORIENTATIONS.map((orientation) => (
          <li key={orientation.id}>
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById(orientation.anchor)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:bg-muted focus-visible:ring-ring flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <span
                aria-hidden="true"
                className={`h-3 w-3 shrink-0 rounded-full ${orientation.swatch}`}
              />
              <span className="min-w-0">
                <span className="text-foreground block text-sm font-semibold">
                  {orientation.label}
                </span>
                <span className="text-muted-foreground block truncate text-xs">
                  {orientation.summary}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="text-muted-foreground text-xs">
        Ordered safest (top) to worst (bottom): ROTA, ROTE, apparent-success,
        remotely-influenceable, influence.
      </p>
    </div>
  );
}
