"use client";

// Risk → seeker ranking panels. Four static cards, one per risk from "Risks
// and mitigations" > "What?", each showing its attributed seekers (as chips)
// plus the lesson's note, all copy verbatim from c-mod6-l1.mdx. Everything is
// visible at once — no hover or tap expansion.
//
// AUTHOR INPUT #3: the lesson explicitly attributes only three of the four
// risks to a seeker orientation (Potemkin work, Manipulation, Outcome
// enforcement); Instability names "myopic motivations" with no specific
// orientation. Cards with an empty `attributed` list show a muted "ranking
// in development" chip instead of inventing a ranking. Full rankings await
// the author.

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
    attributed: [],
    note: "myopic motivations succumb to more ambitious misaligned motivations",
  },
  {
    id: "manipulation",
    label: "Manipulation",
    attributed: ["Remotely-influenceable"],
    note: "remotely-influenceable reward seekers are vulnerable to distant incentives",
  },
  {
    id: "enforcement",
    label: "Outcome enforcement",
    attributed: ["Powerful fitness-seekers"],
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
