import type { DrillDeck } from "./drills";

export const DRILLS_INTEL_SIGNATURES: DrillDeck = {
  id: "drills-intel-signatures",
  title: "Drill Bench: Signatures",
  blurb:
    "Two benches over 2.3.1: the signature cards build the anatomy (predict before you reveal) and the Fermi bench makes power quantitative. Derive, never plug in.",
  benches: [
    {
      id: "signature-cards",
      label: "Signature cards",
      name: "Signature cards",
      kicker:
        "Five signatures, one at a time: commit what each establishes and its main caveat, then reveal the catalog anatomy. Standing red-team question on every card: would this signature survive an adversary who knows it is being watched?",
      time: "~10 min",
      steps: [
        {
          type: "text",
          brief:
            "Commercial and national satellites image a suspected site: building footprint, electrical substations, cooling plant, security perimeter.",
          statement: "Overhead imagery (visual)",
          q: "Predict before the reveal: what does this signature actually establish, and what is its main caveat?",
          minLen: 40,
          reveal:
            "Establishes: that a large, power-hungry facility exists, roughly how big it is, and how its construction is trending. Facility existence, not what runs inside it. Cooperation needed: none; imagery is collected without the monitored side's consent (NTM); treaties only oblige parties not to interfere or deliberately conceal. Main caveat: imagery struggles to tell an AI datacenter from any other datacenter or industrial look-alike (cooling is the main differentiator), and fails against underground or disguised construction.",
        },
        {
          type: "text",
          brief:
            "Infrared sensing of waste heat: constant-temperature rooftops, cooling-plant plumes, snow that never settles in winter.",
          statement: "Thermal signature",
          q: "Predict before the reveal: what does this signature actually establish, and what is its main caveat?",
          minLen: 40,
          reveal:
            "Establishes: that something inside runs hot, continuously: constant heavy compute is one explanation among several. Cooperation needed: none; aerial or satellite infrared; commercial thermal constellations are improving fast. Main caveat: heat proves operation, not workload; smelters, foundries, and ordinary datacenters run hot too, and heat can be dumped into water or spread across halls.",
        },
        {
          type: "text",
          brief:
            "Measured or inferred electricity delivery to a site: substation capacity, transmission build-out, grid data.",
          statement: "Energy and the power grid",
          q: "Predict before the reveal: what does this signature actually establish, and what is its main caveat?",
          minLen: 40,
          reveal:
            "Establishes: a coarse upper bound on compute at the site; measured watts convert to an order-of-magnitude FLOP/s ceiling. The module's most quantitative signature. Cooperation needed: little to none; city-scale draw needs transmission lines visible even in public imagery; grid data may need espionage or a cooperating operator. Main caveat: catches only large violations, decays about 1.6 times per year as chips improve, and covert generation at the ~130 MW scale is plausible (behind-the-meter turbines; the xAI Memphis case is the live example).",
        },
        {
          type: "text",
          brief:
            "Chip import records, customs data, lithography-equipment supply chains, and the money: covert frontier projects are very expensive.",
          statement: "Procurement, customs, and financial trails",
          q: "Predict before the reveal: what does this signature actually establish, and what is its main caveat?",
          minLen: 40,
          reveal:
            "Establishes: that someone is buying frontier-scale inputs; a GPU-import surge beyond declared facilities' needs is the canonical indicator; fab equipment funnels through a handful of suppliers. Cooperation needed: none for a state's own customs and financial intelligence; more coverage with partner states and export-control coalitions. Main caveat: domestic chip fabrication erodes customs visibility, and dual-use purchases blur financial signals: the trail thins exactly where the program is most self-sufficient.",
        },
        {
          type: "text",
          brief:
            "Permits, filings, hiring pages, supplier disclosures, power-purchase agreements, conference no-shows, sudden publication silence.",
          statement: "Open sources and organizational behavior",
          q: "Predict before the reveal: what does this signature actually establish, and what is its main caveat?",
          minLen: 40,
          reveal:
            "Establishes: cheap, continuous context: who is building, hiring, and buying; the layer that tells the other sensors where to look. Cooperation needed: none; it is public by definition. Main caveat: easiest of all signatures for a competent adversary to sanitize; classed by the field as supplemental, never load-bearing.",
        },
      ],
    },
    {
      id: "fermi-bench",
      label: "Fermi bench",
      name: "Fermi bench",
      kicker:
        "Derive it; don't receive it. The reference value appears only as the check on your own derivation, never as an input.",
      time: "~10 min",
      steps: [
        {
          type: "pick",
          brief:
            "Two atomic facts: one current AI accelerator delivers ~2×10¹⁵ FLOP/s, and (with its share of cooling and networking) draws ~2 kW.",
          q: "Derive the conversion: about how many FLOP/s does a site deliver per watt of power draw?",
          opts: ["~10⁹ FLOP/s per watt", "~10¹² FLOP/s per watt", "~10¹⁵ FLOP/s per watt"],
          right: 1,
          why: "2×10¹⁵ FLOP/s ÷ 2×10³ W = ~10¹² FLOP/s per watt. You derived the reference value the field uses; it was never an input.",
        },
        {
          type: "pick",
          q: "Scale it: a ~130 MW site (the scale of a 100k-accelerator cluster). Order-of-magnitude compute bound?",
          opts: ["~10¹⁷ FLOP/s", "~10²⁰ FLOP/s", "~10²³ FLOP/s"],
          right: 1,
          why: "1.3×10⁸ W × 10¹² FLOP/s per watt ≈ 10²⁰ FLOP/s. Count the zeros: that is the whole method. Power bounds compute; it never reveals what the compute computes.",
        },
        {
          type: "pick",
          brief: "Triage on power draw alone: classify each site.",
          statement: "Site A · 8 MW industrial park feed",
          q: "Classify this site:",
          opts: ["Unlikely frontier-scale", "Cannot tell from power alone", "Plausible frontier-scale"],
          right: 0,
          why: "8 MW is a ceiling of about 10¹⁶–10¹⁷ FLOP/s, an order or two below frontier training scale today. (But note the decay clock: at ~1.6×/yr efficiency gains, \"below threshold\" is a date, not a fact.)",
        },
        {
          type: "pick",
          statement: "Site B · 40 MW campus, declared as cloud hosting",
          q: "Classify this site:",
          opts: ["Unlikely frontier-scale", "Cannot tell from power alone", "Plausible frontier-scale"],
          right: 1,
          why: "40 MW could be ~30k accelerators or an ordinary hyperscale hall. Power alone cannot separate them: this is exactly where procurement, thermal, and declarations must corroborate.",
        },
        {
          type: "pick",
          statement: "Site C · 300 MW with behind-the-meter gas turbines, no grid filing",
          q: "Classify this site:",
          opts: ["Unlikely frontier-scale", "Cannot tell from power alone", "Plausible frontier-scale"],
          right: 2,
          why: "Frontier-scale ceiling AND the concealment move (off-grid generation) in one signature: the workaround is itself an anomaly. Aerial thermal surfaced exactly this pattern at xAI Memphis.",
        },
      ],
    },
  ],
};
