import type { DrillDeck } from "./drills";

const AUTOPSY_DOSSIER =
  "SYNTHETIC ASSESSMENT — for exercise use. \"We assess with high confidence that the subject state is conducting an undeclared frontier training run at the Karsu Ridge complex. Four independent lines support this judgment: (1) a well-placed source inside a regional logistics firm reports night deliveries of 'thousands of accelerators' over six weeks; (2) customs records show imports of high-bandwidth interconnect equipment far beyond any declared civilian need; (3) procurement documents obtained by a partner service list bulk orders of immersion-cooling fluid consistent with a dense compute hall; (4) a partner intelligence service independently corroborates the accelerator deliveries. Alternative explanations were considered and dismissed: the complex's declared purpose — a regional cloud-services hub — cannot account for the observed scale.\"";

export const DRILLS_INTEL_ASSESSMENT: DrillDeck = {
  id: "drills-intel-assessment",
  title: "Drill Bench: Judgment Under Uncertainty",
  blurb:
    "Three benches over 2.3.3: the false-alarm bench prices the base rate, the autopsy takes apart a high-confidence-but-wrong assessment, and the limitations ledger places every bound with its sibling owner.",
  benches: [
    {
      id: "false-alarm",
      label: "False-alarm bench",
      name: "The false-alarm bench",
      kicker:
        "Price the alarm before you trust it — the base rate made arithmetic, in three commits.",
      time: "~5 min",
      steps: [
        {
          type: "number",
          q: "The haystack: ~500 datacenters worldwide draw more than 10 MW. Suppose your detection rule is careful — it false-alarms on just 1% of innocent sites per year. How many false alarms is that per year?",
          min: 4,
          max: 6,
          reveal:
            "500 × 1% = ~5 false alarms every year — from a rule that sounds cautious.",
        },
        {
          type: "pick",
          q: "And the numerator: in any given year, how many genuine covert frontier-scale programs do you expect to exist in that haystack?",
          opts: ["~0–1", "~10", "~50"],
          right: 0,
          why: "Approximately zero to one. So the \"cautious\" rule produces ~5 wrong demands for every real one it could ever catch — the alarms are mostly wrong even though the rule is mostly right.",
        },
        {
          type: "text",
          q: "Each empty challenge-inspection demand spends regime credibility that does not come back — and discounts the next alarm even when it is true. Given ~5 false to at most 1 true, what must an escalation threshold clear before you recommend inspection? Two sentences.",
          minLen: 60,
          reveal:
            "The threshold must clear the base rate, not merely feel careful: a signal justifies escalation only when corroboration across independent evidence kinds makes THIS alarm more likely true than the base rate makes it false. That is exactly what the Analyst Desk scores — calibration, not paranoia.",
        },
      ],
    },
    {
      id: "autopsy",
      label: "Intelligence autopsy",
      name: "The intelligence autopsy",
      kicker:
        "A component drill in diagnosis, isolated from escalation: a synthetic assessment, high confidence and wrong, modeled on the patterns the Iraq post-mortems documented. Bias menu — use its words: single-source dependence · circular corroboration · dual-use misread · unauthenticated documents · confirming-evidence bias · mirror-imaging · groupthink · base-rate neglect.",
      time: "~15 min",
      steps: [
        {
          type: "text",
          brief: AUTOPSY_DOSSIER,
          q: "The assessment claims four independent lines. Trace each: how many independent evidence kinds can you actually count, and which claims collapse into each other?",
          minLen: 60,
          reveal:
            "The streams collapse. Line (4) \"independently corroborates\" line (1) — but a partner service repeating the same logistics source is one stream wearing two hats. That is circular corroboration on top of single-source dependence: the Curveball pattern, where one fabricator echoed through liaison channels read as convergence. Line (3) is paper of unverified chain of custody — the Niger-documents lesson: procurement paper is evidence only after authentication. Four claimed lines are really two: one human source (amplified), one customs record.",
        },
        {
          type: "text",
          brief: AUTOPSY_DOSSIER,
          q: "What does \"high confidence\" rest on here? Name the strongest link and the weakest link in the chain.",
          minLen: 60,
          reveal:
            "The customs record is real — and dual-use. High-bandwidth interconnect serves national research networks and telecom backbones as readily as training clusters: the aluminum-tubes pattern, a genuine observable read through the conclusion it was expected to support (confirming-evidence bias). And \"cannot account for the observed scale\" assumes the analyst's model of what a cloud hub looks like — mirror-imaging — while a declared cloud hub is, precisely, a dense compute hall with immersion cooling. The confidence language is unearned: \"high confidence\" resting on one human source plus one dual-use record, with alternatives \"considered and dismissed\" in a single sentence, is certainty manufactured, not portrayed. In a ~500-site haystack the base rate alone forbids it (base-rate neglect).",
        },
        {
          type: "text",
          brief: AUTOPSY_DOSSIER,
          q: "Name the failure mode(s), in the bias menu's words — and write the one-line calibrated verdict this evidence would actually support.",
          minLen: 60,
          reveal:
            "A calibrated verdict: \"Anomaly, promotable to verification lead. Task imagery and grid data on Karsu Ridge; request clarification against the declared cloud-hub filing; seek an evidence kind that does not pass through the logistics source. Confidence: low-to-moderate. Dissent: partner corroboration is not independent. Blind spot: if the hub declaration is genuine, everything observed is innocent.\" The tip may still be right — that is what the ladder is for. The failure mode is not using leads; it is dressing a lead as a verdict.",
        },
      ],
    },
    {
      id: "limitations-ledger",
      label: "Limitations ledger",
      name: "The limitations ledger",
      kicker:
        "One row per signature family: commit the canonical failure case and the sibling mechanism that covers the gap. The sibling owners are the module's boundary contract — every bound named here is owned somewhere else in the course.",
      time: "~10 min",
      steps: [
        {
          type: "pick",
          statement: "Overhead imagery",
          q: "Which is the canonical failure case?",
          opts: [
            "Cloud cover makes optical collection impossible most of the year",
            "Underground or disguised builds — and above ground, AI vs ordinary datacenter is ambiguous (cooling is the only differentiator)",
            "Commercial resolution is too coarse to see buildings at all",
            "Imagery cannot be shown to allies without burning sources",
          ],
          right: 1,
          why: "Committed. Now the second half of the row: name the sibling mechanism that covers the gap.",
        },
        {
          type: "pick",
          statement: "Overhead imagery — the gap's owner",
          q: "Which sibling mechanism covers what this signature cannot see?",
          opts: [
            "2.2 cloud / provider reporting",
            "2.4 human layer",
            "Hardware layer (chip-level tracking)",
            "3.1 evasion scenarios",
            "3.2 combining evidence",
          ],
          right: 1,
          why: "MIRI's draft names military and hardened facilities the blind spot; what the roof hides, people inside can reveal — whistleblowers and inspectors are the 2.4 human layer.",
        },
        {
          type: "pick",
          statement: "Energy and thermal",
          q: "Which is the canonical failure case?",
          opts: [
            "Power draw cannot be measured from outside a facility",
            "Heat signatures are only visible in winter",
            "The signature decays: ~1.6×/yr efficiency gains shrink it annually, and behind-the-meter generation hides the draw entirely",
            "Grid operators refuse to share load data",
          ],
          right: 2,
          why: "Committed. Now the second half of the row: name the sibling mechanism that covers the gap.",
        },
        {
          type: "pick",
          statement: "Energy and thermal — the gap's owner",
          q: "Which sibling mechanism covers what this signature cannot see?",
          opts: [
            "2.2 cloud / provider reporting",
            "2.4 human layer",
            "Hardware layer (chip-level tracking)",
            "3.1 evasion scenarios",
            "3.2 combining evidence",
          ],
          right: 2,
          why: "When the megawatts stop marking the compute, follow the chips instead — chip-level tracking (the hardware layer) does not care how the site is powered.",
        },
        {
          type: "pick",
          statement: "Procurement, customs, financial",
          q: "Which is the canonical failure case?",
          opts: [
            "Trade data is classified in most jurisdictions",
            "Domestic fabrication and dual-use purchasing thin the trail exactly where the program is most self-sufficient",
            "Financial intelligence only works inside one's own banking system",
            "Chip shipments are too small to appear in customs data",
          ],
          right: 1,
          why: "Committed. Now the second half of the row: name the sibling mechanism that covers the gap.",
        },
        {
          type: "pick",
          statement: "Procurement, customs, financial — the gap's owner",
          q: "Which sibling mechanism covers what this signature cannot see?",
          opts: [
            "2.2 cloud / provider reporting",
            "2.4 human layer",
            "Hardware layer (chip-level tracking)",
            "3.1 evasion scenarios",
            "3.2 combining evidence",
          ],
          right: 2,
          why: "Scher and Thiergart's point: the gap is better closed by chip-level tracking — registries follow the accelerators that customs no longer sees cross a border.",
        },
        {
          type: "pick",
          statement: "Open sources and organizational behavior",
          q: "Which is the canonical failure case?",
          opts: [
            "OSINT is illegal to collect under most treaties",
            "Filings and permits are cheapest to collect — and easiest to sanitize",
            "Hiring pages are never informative about compute",
            "Publication patterns change too slowly to matter",
          ],
          right: 1,
          why: "Committed. Now the second half of the row: name the sibling mechanism that covers the gap.",
        },
        {
          type: "pick",
          statement: "Open sources — the gap's owner",
          q: "Which sibling mechanism covers what this signature cannot see?",
          opts: [
            "2.2 cloud / provider reporting",
            "2.4 human layer",
            "Hardware layer (chip-level tracking)",
            "3.1 evasion scenarios",
            "3.2 combining evidence",
          ],
          right: 1,
          why: "A sanitized paper trail still passes through people. What the filings hide — what the company believed, what leadership was warned about — is exactly what the 2.4 human layer reveals.",
        },
        {
          type: "pick",
          statement: "The layer as a whole, against software",
          q: "Which is the canonical failure case?",
          opts: [
            "NTM watches the physical envelope; a workload disguised as inference or \"safety research\" inside a declared site never crosses it",
            "NTM cannot operate over friendly territory",
            "Software violations are impossible to define in treaty text",
            "Signals intelligence is banned by the noninterference norm",
          ],
          right: 0,
          why: "Committed. Now the second half of the row: name the sibling mechanism that covers the gap.",
        },
        {
          type: "pick",
          statement: "The layer as a whole — the gap's owner",
          q: "Which sibling mechanism covers what this signature cannot see?",
          opts: [
            "2.2 cloud / provider reporting",
            "2.4 human layer",
            "Hardware layer (chip-level tracking)",
            "3.1 evasion scenarios",
            "3.2 combining evidence",
          ],
          right: 0,
          why: "Wasil's honest-bounds sentence: limited against software-level violations. Inside a declared facility the sibling is 2.2 — provider reporting and workload telemetry are the layer that can see a training job.",
        },
      ],
    },
  ],
};
