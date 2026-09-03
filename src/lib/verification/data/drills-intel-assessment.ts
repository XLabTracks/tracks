import type { DrillDeck } from "./drills";

const AUTOPSY_DOSSIER =
  "SYNTHETIC ASSESSMENT — for exercise use. \"We assess with high confidence that the subject state is conducting an undeclared frontier training run at the Karsu Ridge complex. Four independent lines support this judgment: (1) a well-placed source inside a regional logistics firm reports night deliveries of 'thousands of accelerators' over six weeks; (2) customs records show imports of high-bandwidth interconnect equipment far beyond any declared civilian need; (3) procurement documents obtained by a partner service list bulk orders of immersion-cooling fluid consistent with a dense compute hall; (4) a partner intelligence service independently corroborates the accelerator deliveries. Alternative explanations were considered and dismissed: the complex's declared purpose — a regional cloud-services hub — cannot account for the observed scale.\"";

export const DRILLS_INTEL_ASSESSMENT: DrillDeck = {
  id: "drills-intel-assessment",
  title: "Drill Bench: Assessment",
  blurb:
    "Three drills for 2.3.10. The first turns the base rate into arithmetic; the second is a post-mortem of an assessment that was confident and wrong; the third records, for each signature family, its standard failure case and the mechanism elsewhere in the course that covers it.",
  benches: [
    {
      id: "false-alarm",
      label: "False alarms",
      name: "False alarms",
      kicker:
        "Before trusting an alarm, work out how often it fires on innocent sites. Three steps; commit each before the next.",
      time: "~5 min",
      steps: [
        {
          type: "number",
          q: "About 500 datacenters worldwide draw more than 10 MW. Suppose your detection rule is careful and false-alarms on 1% of innocent sites per year. How many false alarms is that per year?",
          min: 4,
          max: 6,
          reveal:
            "500 × 1% = about 5 false alarms every year, from a rule that sounds cautious.",
        },
        {
          type: "pick",
          q: "And the numerator: in any given year, how many genuine covert frontier-scale programs do you expect to exist in that haystack?",
          opts: ["~0–1", "~10", "~50"],
          right: 0,
          why: "Approximately zero to one. So the cautious rule produces about five false alarms for every real program it could catch: the alarms are mostly wrong even though the rule is mostly right.",
        },
        {
          type: "text",
          q: "Every challenge inspection that finds nothing costs the regime credibility it does not get back, and makes the next alarm easier to dismiss even when it is true. Given about five false alarms for at most one true one, what condition must a signal meet before you recommend an inspection? Answer in two sentences.",
          minLen: 60,
          reveal:
            "The threshold must clear the base rate, not merely seem careful: a signal justifies escalation only when corroboration across independent kinds of evidence makes this particular alarm more likely true than the base rate makes it false. That is what calibration means here: escalation justified by corroboration.",
        },
      ],
    },
    {
      id: "autopsy",
      label: "Post-mortem",
      name: "Post-mortem of an assessment",
      kicker:
          "A diagnosis drill, separate from the question of escalation. Below is an invented assessment, written with high confidence and wrong, built from the failure patterns documented in the Iraq post-mortems. Name its failures using the terms in this list: single-source dependence · circular corroboration · dual-use misread · unauthenticated documents · confirming-evidence bias · mirror-imaging · groupthink · base-rate neglect.",
      time: "~15 min",
      steps: [
        {
          type: "text",
          brief: AUTOPSY_DOSSIER,
          q: "The assessment claims four independent lines. Trace each: how many independent kinds of evidence can you count, and which claims collapse into each other?",
          minLen: 60,
          reveal:
            "The streams collapse. Line (4) \"independently corroborates\" line (1), but a partner service repeating the same logistics source is one stream counted twice. That is circular corroboration on top of single-source dependence: the Curveball pattern, named for the Iraqi defector whose single fabricated account, repeated through liaison channels, was read as convergence. Line (3) is paper with an unverified chain of custody: the lesson of the Niger documents, forged papers on a uranium purchase that were cited before they were authenticated. Procurement paper is evidence only after authentication. Four claimed lines are really two: one human source, amplified, and one customs record.",
        },
        {
          type: "text",
          brief: AUTOPSY_DOSSIER,
          q: "What does \"high confidence\" rest on here? Name the strongest link and the weakest link in the chain.",
          minLen: 60,
          reveal:
            "The customs record is real, and dual-use. High-bandwidth interconnect serves national research networks and telecom backbones as readily as training clusters: the aluminum-tubes pattern, named for the tubes Iraq imported, a genuine observable read through the conclusion it was expected to support, which is confirming-evidence bias. \"Cannot account for the observed scale\" assumes the analyst's own model of what a cloud hub looks like, which is mirror-imaging, while a declared cloud hub is exactly a dense compute hall with immersion cooling. The confidence language is unjustified: \"high confidence\" resting on one human source plus one dual-use record, with alternatives \"considered and dismissed\" in a single sentence, is certainty manufactured rather than stated. Among about 500 candidate sites the base rate alone forbids it (base-rate neglect).",
        },
        {
          type: "text",
          brief: AUTOPSY_DOSSIER,
          q: "Name the failure mode or modes, using the terms from the list, and write the one-line verdict this evidence actually supports, with its confidence level.",
          minLen: 60,
          reveal:
            "A calibrated verdict: \"Anomaly, promotable to verification lead. Task imagery and grid data on Karsu Ridge; request clarification against the declared cloud-hub filing; seek a kind of evidence that does not pass through the logistics source. Confidence: low to moderate. Dissent: partner corroboration is not independent. Blind spot: if the hub declaration is genuine, everything observed is innocent.\" The tip may still be right; that is what the escalation sequence is for. The failure is not the use of leads but the presentation of a lead as a verdict.",
        },
      ],
    },
    {
      id: "limitations-ledger",
      label: "Limitations table",
      name: "Limitations by signature",
      kicker:
        "One row per signature family. For each family, choose its standard failure case, then choose the mechanism elsewhere in the course that covers what this signature misses.",
      time: "~10 min",
      steps: [
        {
          type: "pick",
          statement: "Overhead imagery",
          q: "Which is this signature’s standard failure case?",
          opts: [
            "Cloud cover makes optical collection impossible most of the year",
            "Underground or disguised builds; above ground, an AI datacenter and an ordinary one are ambiguous (cooling is the only differentiator)",
            "Commercial resolution is too coarse to see buildings at all",
            "Imagery cannot be shown to allies without burning sources",
          ],
          right: 1,
          why: "Recorded. Now the second half of the row: the mechanism that covers the gap.",
        },
        {
          type: "pick",
          statement: "Overhead imagery: the covering mechanism",
          q: "Which mechanism elsewhere in the course covers what this signature cannot see?",
          opts: [
            "2.2 cloud / provider reporting",
            "the human layer, 2.3.6–2.3.9",
            "Hardware layer (chip-level tracking)",
            "3.1 evasion scenarios",
            "3.2 combining evidence",
          ],
          right: 1,
          why: "MIRI's draft names military and hardened facilities as the blind spot. What the roof hides, people inside can reveal: whistleblowers and inspectors are the human layer, 2.3.6–2.3.9.",
        },
        {
          type: "pick",
          statement: "Energy and thermal",
          q: "Which is this signature’s standard failure case?",
          opts: [
            "Power draw cannot be measured from outside a facility",
            "Heat signatures are only visible in winter",
            "The signature decays: efficiency gains of about 1.6× a year shrink it, and behind-the-meter generation hides the draw entirely",
            "Grid operators refuse to share load data",
          ],
          right: 2,
          why: "Recorded. Now the second half of the row: the mechanism that covers the gap.",
        },
        {
          type: "pick",
          statement: "Energy and thermal: the covering mechanism",
          q: "Which mechanism elsewhere in the course covers what this signature cannot see?",
          opts: [
            "2.2 cloud / provider reporting",
            "the human layer, 2.3.6–2.3.9",
            "Hardware layer (chip-level tracking)",
            "3.1 evasion scenarios",
            "3.2 combining evidence",
          ],
          right: 2,
          why: "When power no longer marks the compute, follow the chips: chip-level tracking (the hardware layer) is indifferent to how the site is powered.",
        },
        {
          type: "pick",
          statement: "Procurement, customs, financial",
          q: "Which is this signature’s standard failure case?",
          opts: [
            "Trade data is classified in most jurisdictions",
            "Domestic fabrication and dual-use purchasing thin the trail exactly where the program is most self-sufficient",
            "Financial intelligence only works inside one's own banking system",
            "Chip shipments are too small to appear in customs data",
          ],
          right: 1,
          why: "Recorded. Now the second half of the row: the mechanism that covers the gap.",
        },
        {
          type: "pick",
          statement: "Procurement, customs, financial: the covering mechanism",
          q: "Which mechanism elsewhere in the course covers what this signature cannot see?",
          opts: [
            "2.2 cloud / provider reporting",
            "the human layer, 2.3.6–2.3.9",
            "Hardware layer (chip-level tracking)",
            "3.1 evasion scenarios",
            "3.2 combining evidence",
          ],
          right: 2,
          why: "Scher and Thiergart's point: the gap is better closed by chip-level tracking, since registries follow accelerators that customs no longer sees crossing a border.",
        },
        {
          type: "pick",
          statement: "Open sources and organizational behavior",
          q: "Which is this signature’s standard failure case?",
          opts: [
            "OSINT is illegal to collect under most treaties",
            "Filings and permits are the cheapest to collect and the easiest to sanitize",
            "Hiring pages are never informative about compute",
            "Publication patterns change too slowly to matter",
          ],
          right: 1,
          why: "Recorded. Now the second half of the row: the mechanism that covers the gap.",
        },
        {
          type: "pick",
          statement: "Open sources: the covering mechanism",
          q: "Which mechanism elsewhere in the course covers what this signature cannot see?",
          opts: [
            "2.2 cloud / provider reporting",
            "the human layer, 2.3.6–2.3.9",
            "Hardware layer (chip-level tracking)",
            "3.1 evasion scenarios",
            "3.2 combining evidence",
          ],
          right: 1,
          why: "A sanitized paper trail still passes through people. What the filings hide (what the company believed, what its leadership was warned about) is what the human layer, 2.3.6–2.3.9, reveals.",
        },
        {
          type: "pick",
          statement: "The layer as a whole, against software",
          q: "Which is this signature’s standard failure case?",
          opts: [
            "NTM watches the physical envelope; a workload disguised as inference or \"safety research\" inside a declared site never crosses it",
            "NTM cannot operate over friendly territory",
            "Software violations are impossible to define in treaty text",
            "Signals intelligence is banned by the noninterference norm",
          ],
          right: 0,
          why: "Recorded. Now the second half of the row: the mechanism that covers the gap.",
        },
        {
          type: "pick",
          statement: "The layer as a whole: the covering mechanism",
          q: "Which mechanism elsewhere in the course covers what this signature cannot see?",
          opts: [
            "2.2 cloud / provider reporting",
            "the human layer, 2.3.6–2.3.9",
            "Hardware layer (chip-level tracking)",
            "3.1 evasion scenarios",
            "3.2 combining evidence",
          ],
          right: 0,
          why: "Wasil's sentence on the layer's limits: limited against software-level violations. Inside a declared facility the covering mechanism is 2.2: provider reporting and workload telemetry are the layer that can see a training job.",
        },
      ],
    },
  ],
};
