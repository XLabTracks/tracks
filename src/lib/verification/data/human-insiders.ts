/**
 * Source-map exercise for 2.4.1. The roster follows Baker et al.,
 * "Six Layers of Verification," §§4.3 and A.8 (especially Table 14):
 * personnel across the AI supply chain can notice different parts of a
 * violation, but compartmentalization limits what any one person can know.
 * The exercise therefore asks learners to state what each source can support
 * and to identify an independent way to check it.
 */

export type SourceActorId =
  | "evaluator"
  | "training-engineer"
  | "infrastructure"
  | "procurement-finance"
  | "supplier-contractor"
  | "executive-board";

export type ConnectionKind = "observation" | "boundary" | "corroboration";

export interface ConnectionCard {
  id: string;
  label: string;
  detail: string;
}

export interface SourceActor {
  id: SourceActorId;
  role: string;
  station: string;
  prompt: string;
  report: string;
  incentives: string;
  consistencyTest: string;
  choices: Record<ConnectionKind, readonly string[]>;
  correct: Record<ConnectionKind, string>;
  mismatch: Record<ConnectionKind, string>;
  sentence: string;
}

export const CONNECTION_KINDS: readonly ConnectionKind[] = [
  "observation",
  "boundary",
  "corroboration",
];

export const CONNECTION_KIND_COPY: Record<
  ConnectionKind,
  { eyebrow: string; question: string }
> = {
  observation: {
    eyebrow: "Could observe",
    question: "What could this person know directly?",
  },
  boundary: {
    eyebrow: "Could not establish",
    question: "What remains outside this person's knowledge?",
  },
  corroboration: {
    eyebrow: "Check against",
    question: "Which independent record could verify the claim?",
  },
};

export const CONNECTION_CARDS: Record<
  ConnectionKind,
  readonly ConnectionCard[]
> = {
  observation: [
    {
      id: "evaluation-record",
      label: "Result under the tested setup",
      detail:
        "Scores, prompts, methodology, exclusions, and anomalies in the evaluation they ran.",
    },
    {
      id: "model-lineage",
      label: "Training records and model lineage",
      detail:
        "Training code, datasets, checkpoints, run configuration, and which model descended from which run.",
    },
    {
      id: "cluster-activity",
      label: "Cluster activity",
      detail:
        "Allocated accelerators, job timing, utilization, access events, power draw, and unusual log gaps.",
    },
    {
      id: "purchase-flow",
      label: "Purchases and payments",
      detail:
        "Orders, invoices, project codes, counterparties, payment timing, and off-ledger anomalies.",
    },
    {
      id: "facility-build",
      label: "Facility capacity",
      detail:
        "Racks, chips, cooling, power, interconnects, and installation dates.",
    },
    {
      id: "decision-record",
      label: "Decisions and risk warnings",
      detail:
        "What leadership approved, what the board was told, which risks were accepted, and what was withheld.",
    },
  ],
  boundary: [
    {
      id: "evaluation-no-deployment",
      label: "What happened after the test",
      detail:
        "A test result does not show how the model was later deployed, modified, or monitored in production.",
    },
    {
      id: "engineer-no-intent",
      label: "Why leadership approved the work",
      detail:
        "Technical participation does not show why leaders authorized the work or whether they intended to conceal it.",
    },
    {
      id: "infra-no-authorization",
      label: "Why the job ran or who approved it",
      detail:
        "Infrastructure records show that compute ran. They do not show its purpose or who authorized it.",
    },
    {
      id: "commercial-no-workload",
      label: "Which workload used the capacity",
      detail:
        "A purchase or payment can expose undeclared capacity without identifying the model or code that used it.",
    },
    {
      id: "contractor-no-purpose",
      label: "What the facility ran",
      detail:
        "A contractor can see what was installed without knowing which workload or model used it.",
    },
    {
      id: "leadership-no-execution",
      label: "Whether the decision was carried out",
      detail:
        "A formal decision does not prove that staff carried it out or that the record is complete.",
    },
  ],
  corroboration: [
    {
      id: "evaluation-artifacts",
      label: "Evaluation records created at the time",
      detail:
        "Signed result files, prompt and harness versions, run identifiers, and deployment records from another system.",
    },
    {
      id: "lineage-logs",
      label: "Model registry and scheduler records",
      detail:
        "Checkpoint hashes, storage and access logs, run manifests, scheduler records, and independent code review.",
    },
    {
      id: "infra-telemetry",
      label: "Provider telemetry and hardware inventory",
      detail:
        "Scheduler data held by the provider, power and network telemetry, hardware attestations, and a physical count.",
    },
    {
      id: "transaction-records",
      label: "Records held by counterparties",
      detail:
        "Vendor invoices, bank or ledger entries, shipping and customs records, serials, and receiving logs.",
    },
    {
      id: "facility-records",
      label: "Utility, delivery, and inspection records",
      detail:
        "Power allocations, permits, delivery manifests, work orders, maintenance logs, and site inspection.",
    },
    {
      id: "governance-records",
      label: "Decision records created at the time",
      detail:
        "Board minutes, risk memos, approval tickets, messages, and technical evidence that tests implementation.",
    },
  ],
};

export const SOURCE_ACTORS: readonly SourceActor[] = [
  {
    id: "evaluator",
    role: "Evaluator",
    station: "Evaluation",
    prompt:
      "Ran the capability evaluation and kept the test harness and results.",
    report:
      "The model crossed the agreed capability threshold in our evaluation run.",
    incentives:
      "May want to defend the test method, avoid blame for a missed risk, or meet a professional duty to report.",
    consistencyTest:
      "Compare the test setup and exclusions with notes, code changes, earlier accounts, and the saved results.",
    choices: {
      observation: ["decision-record", "evaluation-record", "model-lineage"],
      boundary: [
        "engineer-no-intent",
        "evaluation-no-deployment",
        "leadership-no-execution",
      ],
      corroboration: [
        "lineage-logs",
        "governance-records",
        "evaluation-artifacts",
      ],
    },
    correct: {
      observation: "evaluation-record",
      boundary: "evaluation-no-deployment",
      corroboration: "evaluation-artifacts",
    },
    mismatch: {
      observation: "Limit the claim to the evaluation this person ran.",
      boundary: "The evaluator did not observe what happened after the test.",
      corroboration:
        "Check records created during the evaluation, then examine deployment separately.",
    },
    sentence:
      "The evaluator can describe the test method and results. They cannot establish how the model was later deployed. Check signed test records and independent deployment records.",
  },
  {
    id: "training-engineer",
    role: "Training engineer",
    station: "Model development",
    prompt:
      "Configured the training run, handled checkpoints, and can trace the model's lineage.",
    report:
      "This checkpoint came from an undeclared run using the restricted training configuration.",
    incentives:
      "May face consequences for taking part, feel loyalty to the team, or want to prevent misuse of their work.",
    consistencyTest:
      "Compare the dates, configuration, checkpoint lineage, and access claims with records maintained by other teams.",
    choices: {
      observation: ["cluster-activity", "model-lineage", "decision-record"],
      boundary: [
        "infra-no-authorization",
        "leadership-no-execution",
        "engineer-no-intent",
      ],
      corroboration: ["infra-telemetry", "lineage-logs", "governance-records"],
    },
    correct: {
      observation: "model-lineage",
      boundary: "engineer-no-intent",
      corroboration: "lineage-logs",
    },
    mismatch: {
      observation:
        "Focus on the run configuration, workload, and model lineage.",
      boundary: "The engineer may not know why leadership approved the work.",
      corroboration:
        "Check model and run records from storage, scheduling, and review systems.",
    },
    sentence:
      "The training engineer can describe the workload and model lineage, but may not know why leadership approved the work. Check checkpoint hashes, model-registry entries, scheduler records, and access logs.",
  },
  {
    id: "infrastructure",
    role: "Infrastructure operator",
    station: "Compute operations",
    prompt:
      "Administers the cluster and can see allocations, failures, access events, and telemetry.",
    report:
      "A large eight-week job ran on the cluster under a project code omitted from the declaration.",
    incentives:
      "May want to protect the operations team, avoid discipline for missing logs, or report misuse of systems they maintain.",
    consistencyTest:
      "Compare job timing, accelerator count, access events, and log gaps with provider records, power data, and physical inventory.",
    choices: {
      observation: ["facility-build", "cluster-activity", "model-lineage"],
      boundary: [
        "contractor-no-purpose",
        "engineer-no-intent",
        "infra-no-authorization",
      ],
      corroboration: ["lineage-logs", "facility-records", "infra-telemetry"],
    },
    correct: {
      observation: "cluster-activity",
      boundary: "infra-no-authorization",
      corroboration: "infra-telemetry",
    },
    mismatch: {
      observation: "Focus on the cluster records this operator can access.",
      boundary:
        "The records do not explain the job's purpose or who approved it.",
      corroboration:
        "Check telemetry and inventory records outside this operator's control.",
    },
    sentence:
      "The infrastructure operator can establish that a large job ran, when it ran, and which cluster it used. They may not know its purpose or who approved it. Check provider telemetry, power records, and hardware inventory.",
  },
  {
    id: "procurement-finance",
    role: "Procurement or finance staff",
    station: "Commercial records",
    prompt:
      "Processed purchases and payments charged to an unfamiliar project code.",
    report:
      "The organization acquired far more accelerator capacity than it declared.",
    incentives:
      "May fear blame for approving the purchase, want to protect the budget owner, or have fewer ties to the technical team.",
    consistencyTest:
      "Reconcile quantities, dates, project codes, counterparties, and payment flows across internal and external ledgers.",
    choices: {
      observation: ["facility-build", "purchase-flow", "cluster-activity"],
      boundary: [
        "contractor-no-purpose",
        "commercial-no-workload",
        "infra-no-authorization",
      ],
      corroboration: [
        "facility-records",
        "transaction-records",
        "infra-telemetry",
      ],
    },
    correct: {
      observation: "purchase-flow",
      boundary: "commercial-no-workload",
      corroboration: "transaction-records",
    },
    mismatch: {
      observation:
        "This source sees purchase and payment records, not the machines in operation.",
      boundary:
        "A ledger can expose capacity without identifying the workload that consumed it.",
      corroboration:
        "Check records held by vendors, banks, shippers, customs agencies, and receiving staff.",
    },
    sentence:
      "Procurement or finance staff can document what was bought and how it was paid for. They may not know which workload used it. Check vendor invoices, payment records, shipping documents, serial numbers, and receiving logs.",
  },
  {
    id: "supplier-contractor",
    role: "Supplier or data-center contractor",
    station: "Facility operations",
    prompt:
      "Installed power, cooling, racks, or chips during a capacity expansion.",
    report:
      "The site added capacity under a project code that does not appear in the declared facility plan.",
    incentives:
      "May seek a reward, protect future contracts, pursue a commercial dispute, or avoid being linked to concealed work.",
    consistencyTest:
      "Compare the project code, quantities, site, and installation dates across work orders and later accounts.",
    choices: {
      observation: ["purchase-flow", "cluster-activity", "facility-build"],
      boundary: [
        "commercial-no-workload",
        "infra-no-authorization",
        "contractor-no-purpose",
      ],
      corroboration: [
        "transaction-records",
        "infra-telemetry",
        "facility-records",
      ],
    },
    correct: {
      observation: "facility-build",
      boundary: "contractor-no-purpose",
      corroboration: "facility-records",
    },
    mismatch: {
      observation:
        "Focus on the equipment and infrastructure this contractor installed or serviced.",
      boundary:
        "The contractor did not see which model or workload used the capacity.",
      corroboration:
        "Check utility, delivery, installation, maintenance, and inspection records.",
    },
    sentence:
      "The supplier or contractor can describe what was installed, where, and when. They may not know how the capacity was used. Check utility allocations, delivery manifests, work orders, maintenance logs, and the site itself.",
  },
  {
    id: "executive-board",
    role: "Executive or board member",
    station: "Governance",
    prompt: "Received risk warnings and took part in the decision to proceed.",
    report:
      "Leadership understood the restriction and deliberately approved work outside the declaration.",
    incentives:
      "May want to defend the official account, limit personal liability, oppose management, or correct an earlier decision.",
    consistencyTest:
      "Compare the decision, dates, attendees, stated reasons, and warnings with records created at the time and accounts from other participants.",
    choices: {
      observation: ["evaluation-record", "decision-record", "model-lineage"],
      boundary: [
        "evaluation-no-deployment",
        "engineer-no-intent",
        "leadership-no-execution",
      ],
      corroboration: [
        "evaluation-artifacts",
        "lineage-logs",
        "governance-records",
      ],
    },
    correct: {
      observation: "decision-record",
      boundary: "leadership-no-execution",
      corroboration: "governance-records",
    },
    mismatch: {
      observation:
        "Focus on the decisions and warnings this person received or discussed.",
      boundary:
        "Approving a plan does not show exactly how staff carried it out.",
      corroboration:
        "Check records made at the time and technical evidence of what staff actually did.",
    },
    sentence:
      "The executive or board member can describe decisions, warnings, and intent. They may not know every technical action taken. Check minutes, approvals, messages, and independent technical records.",
  },
];

export interface CredibilityChoice {
  id: string;
  text: string;
}

export interface CredibilityQuestion {
  id: "access" | "incentives" | "consistency" | "corroboration";
  label: string;
  prompt: string;
  choices: readonly CredibilityChoice[];
  answerId: string;
  retry: string;
  explanation: string;
  findingLine: string;
}

export const SOURCE_REPORT = {
  label: "Case report · Project Lattice",
  body: "A cooling contractor reports that Project Lattice added power and chilled-water capacity for 1,024 accelerators over six weeks. The contractor has applied for a financial reward and provides work-order code PX-814. A utility record obtained separately contains the same code and dates. The contractor did not have access to cluster workloads.",
} as const;

export const CREDIBILITY_QUESTIONS: readonly CredibilityQuestion[] = [
  {
    id: "access",
    label: "Access",
    prompt: "What can this source actually know?",
    choices: [
      {
        id: "access-bounded",
        text: "The installed capacity, site, dates, and project code — not the workload or its authorization.",
      },
      {
        id: "access-violation",
        text: "That an unauthorized frontier-model training run occurred.",
      },
      {
        id: "access-none",
        text: "Nothing useful, because contractors are outside the AI developer.",
      },
    ],
    answerId: "access-bounded",
    retry:
      "Separate the physical work they witnessed from the workload they could not see.",
    explanation:
      "The contractor can describe infrastructure work they performed or saw. That access does not show which model ran, who authorized it, or whether a rule was breached.",
    findingLine:
      "Access: The contractor can describe the capacity expansion and project code, but not the workload or its authorization.",
  },
  {
    id: "incentives",
    label: "Incentives",
    prompt: "How should the financial reward affect the assessment?",
    choices: [
      {
        id: "incentive-context",
        text: "Record the possible reward and the costs of reporting. Treat motive as a reason to check the claim carefully, not as proof that it is true or false.",
      },
      {
        id: "incentive-dismiss",
        text: "Assume the report is unreliable because the source may receive a reward.",
      },
      {
        id: "incentive-credit",
        text: "Treat the personal risk of reporting as proof that the allegation is true.",
      },
    ],
    answerId: "incentive-context",
    retry:
      "The reward may encourage a false report. Fear of retaliation or lost work may discourage a true one. Neither decides whether this report is accurate.",
    explanation:
      "Incentives matter because they may shape whether and how someone reports. They do not replace evidence.",
    findingLine:
      "Incentives: The possible reward and the risk of losing work both matter, but neither confirms nor disproves the report.",
  },
  {
    id: "consistency",
    label: "Consistency",
    prompt: "Which consistency check matters here?",
    choices: [
      {
        id: "consistency-material",
        text: "Check whether the site, dates, quantity, and project code remain stable across interviews and fit the known timeline.",
      },
      {
        id: "consistency-verbatim",
        text: "Require every retelling to use exactly the same words and peripheral details.",
      },
      {
        id: "consistency-group",
        text: "Accept matching accounts from coworkers selected and briefed together as independent confirmation.",
      },
    ],
    answerId: "consistency-material",
    retry:
      "Focus on the facts that matter. Identical wording may reflect rehearsal, and coordinated accounts are not independent evidence.",
    explanation:
      "Minor details may change as people recall an event. The central facts should remain consistent with the timeline and other evidence.",
    findingLine:
      "Consistency: The site, dates, quantity, and project code should remain stable and fit the known timeline. Scripted agreement is not independent evidence.",
  },
  {
    id: "corroboration",
    label: "Independent corroboration",
    prompt: "Which evidence adds the most weight to this report?",
    choices: [
      {
        id: "corroboration-independent",
        text: "The independently obtained utility log, followed by serial, receiving, scheduler, and authorization records from separate systems.",
      },
      {
        id: "corroboration-reputation",
        text: "The contractor's reputation for honesty in the local industry.",
      },
      {
        id: "corroboration-copy",
        text: "A spreadsheet the contractor created after deciding to report.",
      },
    ],
    answerId: "corroboration-independent",
    retry:
      "Use evidence created independently of the source and outside the source's control.",
    explanation:
      "The matching project code and dates link the report to an external record. They support the claim that the site expanded, but not a claim about the workload.",
    findingLine:
      "Corroboration: The utility record supports the infrastructure claim. Workload and approval records are still needed.",
  },
];

export const FINAL_FINDING = {
  disposition: "Further investigation warranted · no compliance finding",
  text: "The report supports a finding that Project Lattice expanded infrastructure at the stated site and time. It does not show which workload ran or whether any rule was breached. Investigators should preserve the work orders and utility record, then obtain receiving records, serial numbers, scheduler telemetry, model-lineage records, and approval documents.",
} as const;

export const FAILURE_MODES = [
  {
    name: "Selective truth",
    check:
      "The expansion may be real even if the claimed prohibited workload is not. Do not treat proof of infrastructure as proof of how it was used.",
  },
  {
    name: "Coordinated cover story",
    check:
      "Matching accounts are not independent if managers selected, briefed, or monitored the speakers.",
  },
  {
    name: "Management staging",
    check:
      "A clean tour and selected records show what management chose to present. They do not rule out undeclared activity elsewhere.",
  },
  {
    name: "Suppression",
    check:
      "A lack of reports means little if staff have no safe reporting channel, cannot see the relevant declarations, or reasonably fear retaliation.",
  },
] as const;

export function sourceActor(id: SourceActorId): SourceActor {
  return SOURCE_ACTORS.find((actor) => actor.id === id)!;
}

export function connectionCard(
  kind: ConnectionKind,
  id: string
): ConnectionCard {
  return CONNECTION_CARDS[kind].find((card) => card.id === id)!;
}
