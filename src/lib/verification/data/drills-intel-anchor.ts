import type { DrillDeck } from "./drills";

export const DRILLS_INTEL_ANCHOR: DrillDeck = {
  id: "drills-intel-anchor",
  title: "Drill Bench: The Nuclear Record",
  blurb:
    "Four case files, opened one at a time: Iraq, North Korea, Iran, Syria. Per file, predict what first identified the program and what resolved it, then open the record. After all four, the pattern lands.",
  benches: [
    {
      id: "case-files",
      label: "Case files",
      name: "The nuclear case files",
      kicker:
        "Identified versus resolved, case by case. The pattern to watch for: who found the undeclared facilities, and what tool adjudicated them.",
      time: "~10 min",
      steps: [
        {
          type: "pick",
          brief:
            "Under comprehensive safeguards, IAEA inspectors visited Iraq's declared nuclear sites on schedule through the 1980s. After the Gulf War, inspectors uncovered a sprawling covert weapons program: much of it in buildings adjacent to inspected facilities.",
          statement: "Iraq (pre-1991)",
          q: "What first identified the program?",
          opts: [
            "Routine safeguards inspections",
            "National-intelligence tips",
            "Post-war access and defector leads",
            "Commercial satellite imagery",
          ],
          right: 2,
          why: "The record: post-war access and defector leads. The regime's own tooling saw nothing while the program ran: declared-site safeguards verified what was declared. Now the second half: what resolved it?",
        },
        {
          type: "pick",
          statement: "Iraq (pre-1991)",
          q: "What resolved it, if anything?",
          opts: [
            "Regular declared-site inspections",
            "UNSCOM/IAEA special access after the war",
            "It was never resolved",
          ],
          right: 1,
          why: "Discovery came with war-won access and intelligence. This case is why the Additional Protocol exists, and why \"verifying correctness\" and \"verifying completeness\" are different problems.",
        },
        {
          type: "pick",
          brief:
            "North Korea's initial declaration claimed a small plutonium separation history. Safeguards analysis of samples found isotopic inconsistencies suggesting more reprocessing than declared; US intelligence pointed to suspect waste sites.",
          statement: "North Korea (early 1990s)",
          q: "What first identified the program?",
          opts: [
            "Safeguards sample analysis and intelligence together",
            "Routine inspections alone",
            "A whistleblower",
            "Open-source analysis",
          ],
          right: 0,
          why: "The record: safeguards sample analysis and intelligence together, the one case where the regime's own analytics carried real weight. Now the second half: what resolved it?",
        },
        {
          type: "pick",
          statement: "North Korea (early 1990s)",
          q: "What resolved it: if anything?",
          opts: [
            "A special inspection settled it",
            "Pyongyang blocked the special inspection and announced withdrawal: resolution failed",
            "Commercial imagery settled it",
          ],
          right: 1,
          why: "The case that shows the ladder's top rung can break: when the IAEA demanded special inspection of the waste sites, North Korea refused and moved to exit. Identification succeeded; resolution collapsed at the political layer.",
        },
        {
          type: "pick",
          brief:
            "An opposition group's 2002 revelations (widely traced to intelligence sources) exposed undeclared enrichment at Natanz. Years later, intelligence-derived archive material pointed to specific sites; the IAEA requested access under the Additional Protocol and took environmental samples.",
          statement: "Iran (2000s–2020s)",
          q: "What first identified the program?",
          opts: [
            "Routine declared-site inspections",
            "Intelligence-derived revelations and archive material",
            "Thermal satellites",
            "Financial intelligence",
          ],
          right: 1,
          why: "The record: intelligence-derived revelations and archive material. Now the second half: what resolved it?",
        },
        {
          type: "pick",
          statement: "Iran (2000s–2020s)",
          q: "What resolved it: if anything?",
          opts: [
            "Complementary access and environmental sampling resolved specific questions",
            "Nothing was ever verified",
            "A challenge inspection under threat of force",
          ],
          right: 0,
          why: "The cleanest identify-then-resolve pipeline on record: tips identified, treaty tools resolved; sampling found uranium traces at sites Iran had denied. Note the roles: intelligence never \"proved\" anything to the world; access and chemistry did.",
        },
        {
          type: "pick",
          brief:
            "A remote building at al-Kibar drew no safeguards attention until foreign intelligence identified it as a likely reactor under construction. It was destroyed in an airstrike before any inspection; the IAEA reached the site months later.",
          statement: "Syria (2007)",
          q: "What first identified the program?",
          opts: [
            "IAEA safeguards",
            "National intelligence",
            "Local reporting",
            "Export-control records",
          ],
          right: 1,
          why: "The record: national intelligence. Now the second half: what resolved it?",
        },
        {
          type: "pick",
          statement: "Syria (2007)",
          q: "What resolved it: if anything?",
          opts: [
            "A timely IAEA inspection adjudicated it",
            "An airstrike destroyed it; IAEA sampling later found telltale traces: confirmation came late and partial",
            "It remains entirely unknown",
          ],
          right: 1,
          why: "Identification worked; the regime never got to resolve. The strike is not a verification finding: what confirmation exists came from IAEA sampling in the rubble, months late. This is the case behind the module's rule: a strike can level a facility; it cannot adjudicate a violation.",
        },
      ],
    },
  ],
};
