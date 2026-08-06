"use client";

// Risk → seeker ranking panels. Four static cards, one per risk from "Risks
// and mitigations" > "What?", each showing its attributed seekers (as chips)
// plus the lesson's note, all copy verbatim from c-mod6-l1.mdx. Everything is
// visible at once — no hover or tap expansion.
//
// Rankings follow the risk-pathway attributions in Mallen's "Risk from
// fitness-seeking AIs" as curated in the author's module note: Potemkin work
// is apparent-success-seeking scaled to consequential work; Instability is
// ambitious motivations (influence-like) overtaking and spreading through
// myopic seekers; Manipulation is the distant-influence channel; Outcome
// enforcement is capable fitness-seekers enforcing outcomes via takeover.

const RISKS = [
  {
    id: "potemkin",
    label: "Potemkin work",
    attributed: ["Apparent-success"],
    note: "see apparent-success seekers as a potential path to this",
  },
  {
    id: "instability",
    label: "Instability",
    attributed: ["Influence", "ROTE", "ROTA"],
    note: "myopic motivations succumb to more ambitious misaligned motivations",
  },
  {
    id: "manipulation",
    label: "Manipulation",
    attributed: ["Remotely-influenceable", "ROTE"],
    note: "remotely-influenceable reward seekers are vulnerable to distant incentives",
  },
  {
    id: "enforcement",
    label: "Outcome enforcement",
    attributed: ["Influence", "Remotely-influenceable"],
    note: "may see the disempowerment of humans as the best way to maintain their desired outcomes",
  },
] as const;

export function SeekerRiskMapDemo() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {RISKS.map((risk) => (
        <div key={risk.id} className="border-border bg-card rounded-lg border p-3">
          <p className="text-foreground text-sm font-semibold">{risk.label}</p>
          <div className="mt-2 space-y-2">
            {risk.attributed.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {risk.attributed.map((seeker) => (
                  <li
                    key={seeker}
                    className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium"
                  >
                    {seeker}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="bg-muted text-muted-foreground inline-block rounded-full px-2 py-0.5 text-xs font-medium">
                ranking in development
              </span>
            )}
            <p className="text-muted-foreground text-xs">{risk.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
