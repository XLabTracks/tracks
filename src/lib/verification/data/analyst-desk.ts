export type DeskMoveId =
  | "imagery"
  | "thermal"
  | "procurement"
  | "finint"
  | "osint"
  | "registry";

export type DeskDispositionId = "log" | "clarify" | "inspect";
export type DeskVerdict = "best" | "ok" | "burn";
export type DeskConfidence = "low" | "medium" | "high";

export interface DeskSignal {
  id: string;
  chip: string;
  title: string;
  dossier: string;
  moves: Partial<Record<DeskMoveId, string>>;
  dispositions: Record<DeskDispositionId, DeskVerdict>;
  truth: string;
  debrief: string;
}

export const DESK_MAX_MOVES = 2;
export const DESK_MIN_DISSENT = 40;
export const DESK_MIN_BLIND = 40;

export const DESK_MOVES: Record<DeskMoveId, { label: string; kind: string }> = {
  imagery: { label: "Task an imagery pass", kind: "physical" },
  thermal: { label: "Task a thermal pass", kind: "physical" },
  procurement: { label: "Pull customs / procurement records", kind: "procurement" },
  finint: { label: "Pull financial intelligence", kind: "financial" },
  osint: { label: "Sweep open sources", kind: "organizational" },
  registry: { label: "Check the declarations registry", kind: "digital" },
};

export const DESK_DISPOSITIONS: {
  id: DeskDispositionId;
  label: string;
  hint: string;
}[] = [
  {
    id: "log",
    label: "Log & monitor",
    hint: "set collection triggers, keep watching — cheap, reversible",
  },
  {
    id: "clarify",
    label: "Request clarification through the regime",
    hint: "put it on the consultative table — spends a little standing",
  },
  {
    id: "inspect",
    label: "Recommend a challenge inspection",
    hint: "the top rung — spends real credibility if it comes back empty",
  },
];

export const DESK_SIGNALS: DeskSignal[] = [
  {
    id: "s1",
    chip: "THERMAL",
    title: "Persistent heat bloom on a known industrial park",
    dossier:
      "A commercial thermal pass flags a building complex holding a constant elevated temperature through the winter — snow never settles on two roofs. The park is 900 km inside the monitored state, listed as mixed light industry. No compute declarations exist for the site.",
    moves: {
      imagery:
        "High-res visual pass: cooling plant configuration and stack geometry consistent with a metal smelter; no electrical substation upgrades visible; perimeter is ordinary industrial fencing.",
      osint:
        "Local permits list an aluminum recycler commissioned at the site fourteen months ago; the operator advertises scrap intake capacity publicly.",
      procurement:
        "Customs records show no accelerator-class imports routed to the region in two years.",
      finint:
        "No unusual capital flows into the park's operators; energy bills match a smelter's duty cycle, not a datacenter's flat draw.",
    },
    dispositions: { log: "best", clarify: "ok", inspect: "burn" },
    truth: "Innocent — an aluminum recycler. Heat proved operation, never workload.",
    debrief:
      "Thermal alone is an anomaly, not a lead: smelters, foundries, and ordinary datacenters all run hot. Two cheap moves (imagery, OSINT) resolved it without spending anything. A clarification request would have been survivable but noisy; an inspection demand here is exactly the thin-evidence escalation that burns regime credibility against the ~500-site base rate.",
  },
  {
    id: "s2",
    chip: "CUSTOMS",
    title: "Accelerator imports far beyond declared needs",
    dossier:
      "Trade data shows roughly 40,000 accelerator-class units entering a third country over nine months, consigned to two importers of record. All declared facilities in that country account for fewer than 10,000 units of demand. The monitored state has procurement relationships with both importers.",
    moves: {
      procurement:
        "Deeper customs pull: the two importers are three months old, share a registered agent, and re-export documentation is incomplete for most consignments.",
      finint:
        "Payment chains route through a holding company with no datacenter assets and one prior appearance — in an export-control enforcement action.",
      imagery:
        "No new large-footprint construction visible in the receiving country — consistent with onward diversion or dispersal into smaller sites.",
      registry:
        "No new compute declarations filed by any party that could absorb this volume.",
    },
    dispositions: { log: "burn", clarify: "best", inspect: "ok" },
    truth:
      "A genuine diversion network — the canonical procurement indicator, corroborated across three evidence kinds.",
    debrief:
      "This is what a verification lead looks like: procurement, financial, and registry evidence agree, and they fail differently — so their agreement means something. Logging it is the miss that costs the treaty. The regime's clarification channel is the proportionate rung; jumping straight to a challenge inspection is defensible but spends leverage the clarification round would have built.",
  },
  {
    id: "s3",
    chip: "OSINT",
    title: "A 60 MW substation permit beside a \"logistics\" campus",
    dossier:
      "A public utility filing seeks a ~60 MW substation adjacent to a newly acquired campus zoned for logistics. The campus operator is a subsidiary two steps removed from a state-linked conglomerate. Construction began five weeks ago.",
    moves: {
      osint:
        "The operator has posted openings for electrical and mechanical engineers with high-density cooling experience — and none for warehouse staff.",
      imagery:
        "Foundation work is indeterminate: the slab and utility trenching fit either a fulfillment hall or a compute hall; nothing distinguishes them at this stage.",
      thermal: "Nothing to read — the site is not operating.",
      procurement: "No accelerator-class imports associated with the operator yet.",
    },
    dispositions: { log: "best", clarify: "ok", inspect: "burn" },
    truth:
      "Genuinely undetermined at this stage — a tripwire case. (In this scenario's ground truth, the site later declares as a cloud facility.)",
    debrief:
      "An anomaly with one weak corroborator (hiring) is still an anomaly. The right move is the tripwire: log, set collection triggers (substation energization, first imports), and wait — escalation now has nothing to adjudicate, because there is no activity yet, only capacity. Note the asymmetry: monitoring is cheap and reversible; a wrong inspection demand is neither.",
  },
  {
    id: "s4",
    chip: "IMAGERY",
    title: "An official denial contradicted by a commercial pass",
    dossier:
      "Asked in the regime's consultative committee about a flagged site, the monitored state describes it as \"decommissioned since last year.\" A commercial imagery pass from nine days ago shows active construction, new cooling towers, and vehicle density typical of a fit-out phase.",
    moves: {
      imagery:
        "A second tasked pass confirms: crane activity, cooling-tower count up by four since the declaration date, night lighting across the campus.",
      registry:
        "The site's decommissioning declaration was filed thirteen months ago and never amended.",
      finint:
        "Contractor payments from the site operator continue at construction-phase volume.",
      osint:
        "State media re-affirms the decommissioning in response to foreign reporting — the cover story is now on the record twice.",
    },
    dispositions: { log: "burn", clarify: "ok", inspect: "best" },
    truth:
      "A false declaration — the falsifiable-cover-story case: the denial itself became evidence when commercial imagery contradicted it.",
    debrief:
      "Cover stories are falsifiable, and a denial contradicted by checkable imagery upgrades the signal: the discrepancy itself is now the finding. Note what makes this the one signal where the top rung is earned: the clarification channel has already been used — that is where the false declaration happened — so asking again buys a second recitation of the cover story while the fit-out finishes. A specific site, a checkable contradiction corroborated across independent moves, and an exhausted lower rung: this is the case the challenge-inspection provision exists for. A second clarification round is survivable but wastes the window; silence is the one indefensible option.",
  },
  {
    id: "s5",
    chip: "REGISTRY",
    title: "A declared hyperscale expansion, right on schedule",
    dossier:
      "A declared operator files a capacity expansion: 90 MW, 60,000 accelerators, workload class \"commercial cloud.\" The filing matches the treaty's notification format and arrives inside the declaration window.",
    moves: {
      registry:
        "The declaration is complete and consistent with the operator's license envelope; chip serials match the registry's allocation.",
      imagery:
        "Construction matches the declared blueprint: hall count, substation rating, cooling capacity all consistent.",
      procurement:
        "Imports match declared purchase orders through registered channels; no shadow importers.",
      thermal: "Heat profile after energization matches declared utilization ramp.",
    },
    dispositions: { log: "best", clarify: "ok", inspect: "burn" },
    truth: "Exactly what it declares — the declared world behaving as declared.",
    debrief:
      "Most of the haystack is this: compliance looks like paperwork agreeing with physics. Verifying it costs one cross-check, and that cheap agreement is what keeps the base rate survivable. Spending a clarification round here is bureaucratic noise; spending an inspection here is how regimes teach their members to resent the regime. Logging well is also analyst work.",
  },
  {
    id: "s6",
    chip: "FININT",
    title: "Interconnect orders and a hiring spike, but flat energy",
    dossier:
      "A monitored-state operator places orders for high-bandwidth optical interconnect exceeding any declared cluster's topology, and job boards show a surge in large-scale-training infrastructure roles. Energy draw at all declared sites is flat. No undeclared construction is visible.",
    moves: {
      procurement:
        "The interconnect volume would support a training fabric several times larger than anything declared — but the equipment is dual-use and warehouse-able.",
      osint:
        "Hiring texts reference \"multi-thousand-node training runs\" — forward-looking language, no site named.",
      imagery:
        "Nothing new to see: no construction, no thermal change. Whatever this is, it is not operating.",
      finint:
        "Capital expenditure routes to an undisclosed subsidiary with no physical footprint on record.",
    },
    dispositions: { log: "best", clarify: "ok", inspect: "burn" },
    truth:
      "Preparation, not activity — capability signals with no workload to adjudicate (yet). The facility-vs-workload gap in its purest form.",
    debrief:
      "Everything here is upstream of the thing the treaty regulates: parts, people, and money — but no compute running anywhere measurable. There is nothing an inspection could adjudicate; a clarification request is premature but survivable. The strong play is the tripwire with teeth: log, flag the subsidiary for financial and customs collection, and set the energy/thermal triggers that will fire if the capacity ever turns on.",
  },
];

export interface DeskScore {
  verdict: DeskVerdict;
  pts: number;
  conf: number;
  total: number;
}

export function scoreDeskCall(
  signal: DeskSignal,
  disposition: DeskDispositionId,
  confidence: DeskConfidence,
): DeskScore {
  const verdict = signal.dispositions[disposition];
  const pts = verdict === "best" ? 2 : verdict === "ok" ? 1 : -2;
  let conf = 0;
  if (confidence === "high" && verdict === "best") conf = 1;
  if (confidence === "high" && verdict === "burn") conf = -1;
  return { verdict, pts, conf, total: pts + conf };
}
