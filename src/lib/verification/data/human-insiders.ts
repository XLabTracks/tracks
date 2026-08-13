/**
 * Source-map exercise for 2.4.1. The roster follows Baker et al.,
 * "Six Layers of Verification," §§4.3 and A.8 (especially Table 14):
 * personnel across the AI supply chain can notice different parts of a
 * violation, but compartmentalization means no job title is an all-purpose
 * credibility credential. The exercise therefore asks for bounded claims and
 * independent tests, never a numerical score for the person.
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
    eyebrow: "Can support",
    question: "What fact sits inside this source's access?",
  },
  boundary: {
    eyebrow: "Cannot establish",
    question: "Where does this source's knowledge stop?",
  },
  corroboration: {
    eyebrow: "Independent test",
    question: "What evidence could test the material claim?",
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
      label: "Workload and model lineage",
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
      label: "Purchases and money flows",
      detail:
        "Orders, invoices, project codes, counterparties, payment timing, and off-ledger anomalies.",
    },
    {
      id: "facility-build",
      label: "Capacity built or delivered",
      detail:
        "Racks, chips, cooling, power, interconnects, and the dates on which physical capacity appeared.",
    },
    {
      id: "decision-record",
      label: "Decisions and warnings",
      detail:
        "What leadership approved, what the board was told, which risks were accepted, and what was withheld.",
    },
  ],
  boundary: [
    {
      id: "evaluation-no-deployment",
      label: "Not real-world deployment",
      detail:
        "A test result does not show how the model was later deployed, modified, or monitored in production.",
    },
    {
      id: "engineer-no-intent",
      label: "Not executive intent",
      detail:
        "Technical participation does not reveal why leadership authorized the work or what it meant to conceal.",
    },
    {
      id: "infra-no-authorization",
      label: "Not purpose or authorization",
      detail:
        "Infrastructure traces show that compute ran, not which scientific objective or policy approval justified it.",
    },
    {
      id: "commercial-no-workload",
      label: "Not the workload",
      detail:
        "A purchase or payment can expose undeclared capacity without identifying the model or code that used it.",
    },
    {
      id: "contractor-no-purpose",
      label: "Not what ran inside",
      detail:
        "A builder can observe the physical envelope without seeing the workload, model, or policy purpose.",
    },
    {
      id: "leadership-no-execution",
      label: "Not technical execution",
      detail:
        "A formal decision does not prove that staff carried it out, or that no parallel activity escaped the record.",
    },
  ],
  corroboration: [
    {
      id: "evaluation-artifacts",
      label: "Sealed evaluation artifacts",
      detail:
        "Signed result files, prompt and harness versions, run identifiers, and deployment records from another system.",
    },
    {
      id: "lineage-logs",
      label: "Model registry and scheduler logs",
      detail:
        "Checkpoint hashes, storage and access logs, run manifests, scheduler records, and independent code review.",
    },
    {
      id: "infra-telemetry",
      label: "Raw telemetry and inventory",
      detail:
        "Provider-side scheduler data, power and network telemetry, hardware attestations, and a physical count.",
    },
    {
      id: "transaction-records",
      label: "Counterparty transaction records",
      detail:
        "Vendor invoices, bank or ledger entries, shipping and customs records, serials, and receiving logs.",
    },
    {
      id: "facility-records",
      label: "Utility and installation records",
      detail:
        "Power allocations, permits, delivery manifests, work orders, maintenance logs, and site inspection.",
    },
    {
      id: "governance-records",
      label: "Contemporaneous approval trail",
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
      "They ran the capability evaluation and retained the harness and result bundle.",
    report:
      "The model crossed the agreed capability threshold in our evaluation run.",
    incentives:
      "May defend their methodology, fear blame for a missed risk, or feel a professional duty to report it.",
    consistencyTest:
      "Compare the claimed setup and exclusions across notes, commits, retellings, and the sealed bundle.",
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
      observation:
        "Keep the claim inside the evaluation this person actually ran.",
      boundary:
        "The missing link is what happened after the test, outside the evaluated setup.",
      corroboration:
        "Test the result against artifacts fixed at evaluation time, then separately inspect deployment.",
    },
    sentence:
      "The evaluator can support the result and method under the tested setup, but not later deployment; test the account against sealed evaluation artifacts and independent deployment records.",
  },
  {
    id: "training-engineer",
    role: "Training engineer",
    station: "Model development",
    prompt:
      "They configured the run, handled checkpoints, and can trace the model's ancestry.",
    report:
      "This checkpoint came from an undeclared run using the restricted training configuration.",
    incentives:
      "May face direct exposure for participation, loyalty to the team, or a duty to prevent misuse of their work.",
    consistencyTest:
      "Test the run dates, configuration, checkpoint ancestry, and who had access against records they did not author alone.",
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
        "Use the records and systems this engineer touched: workload, configuration, and lineage.",
      boundary:
        "Technical access is rich, but it does not make the engineer a witness to leadership's purpose.",
      corroboration:
        "Look for model and run records produced across storage, scheduling, and review systems.",
    },
    sentence:
      "The training engineer can support the workload and model lineage, but not executive intent; test the account against checkpoint hashes, model-registry entries, scheduler records, and access logs.",
  },
  {
    id: "infrastructure",
    role: "Infrastructure operator",
    station: "Compute operations",
    prompt:
      "They administer the cluster and can see allocations, failures, access events, and telemetry.",
    report:
      "A large eight-week job ran on the cluster under a project code omitted from the declaration.",
    incentives:
      "May want to protect operational reputation, avoid discipline for log gaps, or report misuse of systems they maintain.",
    consistencyTest:
      "Compare job timing, accelerator count, access events, and log gaps with provider-side and physical telemetry.",
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
      observation:
        "Anchor this source to the cluster state and logs they operate.",
      boundary:
        "A job's footprint does not explain its scientific purpose or authorization chain.",
      corroboration:
        "Use telemetry or inventory controlled outside this operator's own account.",
    },
    sentence:
      "The infrastructure operator can support that a large job ran, when, and on which cluster, but not why it was authorized; test the account against raw provider telemetry, power records, and hardware inventory.",
  },
  {
    id: "procurement-finance",
    role: "Procurement or finance staff",
    station: "Commercial records",
    prompt:
      "They processed purchases and payments attached to an unfamiliar project code.",
    report:
      "The organization acquired substantially more accelerator capacity than it declared.",
    incentives:
      "May fear responsibility for approving the transaction, protect a budget owner, or be insulated from the technical team's loyalties.",
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
        "This source sees the commercial trail, not the machines in operation.",
      boundary:
        "A ledger can expose capacity without identifying the workload that consumed it.",
      corroboration:
        "Seek records held by vendors, banks, shippers, customs, and receiving staff.",
    },
    sentence:
      "Procurement or finance staff can support the acquisition and money trail, but not the workload; test the account against counterparty invoices, payment records, shipping documents, serials, and receiving logs.",
  },
  {
    id: "supplier-contractor",
    role: "Supplier or data-center contractor",
    station: "Facility edge",
    prompt:
      "They installed power, cooling, racks, or chips for a capacity expansion.",
    report:
      "The site added capacity under a project code that does not appear in the declared facility plan.",
    incentives:
      "May seek a reward, preserve future contracts, settle a commercial dispute, or avoid being tied to concealed work.",
    consistencyTest:
      "Compare the project code, quantities, site, and installation dates across work orders and retellings.",
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
        "Use the physical envelope this contractor built or serviced.",
      boundary:
        "Seeing capacity appear is not seeing the model or workload inside it.",
      corroboration:
        "Test the build against utility, delivery, installation, maintenance, and inspection records.",
    },
    sentence:
      "The supplier or contractor can support what capacity appeared, where, and when, but not what ran inside it; test the account against utility allocations, delivery manifests, work orders, maintenance logs, and physical inspection.",
  },
  {
    id: "executive-board",
    role: "Executive or board member",
    station: "Governance",
    prompt:
      "They received risk warnings and participated in the decision to proceed.",
    report:
      "Leadership understood the restriction and deliberately approved work outside the declaration.",
    incentives:
      "May be invested in the official story, exposed to liability, divided from management, or trying to correct a decision after the fact.",
    consistencyTest:
      "Compare the decision, dates, attendees, stated rationale, and warnings with contemporaneous records and other participants.",
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
        "This source's distinctive access is to decisions, warnings, and organizational intent.",
      boundary:
        "Authority over a plan is not direct observation of every technical action taken under it.",
      corroboration:
        "Test the account against records made at the time and evidence that the decision was implemented.",
    },
    sentence:
      "The executive or board member can support decisions, warnings, and intent, but not technical execution or completeness; test the account against contemporaneous minutes, approvals, messages, and independent technical evidence.",
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
  label: "Fictional source report · Project Lattice",
  body: "A cooling contractor says Project Lattice added power and chilled-water capacity for 1,024 accelerators during a six-week expansion. The contractor is seeking a financial reward and supplies work-order code PX-814. A power-allocation log obtained independently from the utility carries PX-814 and matching dates. The contractor never had access to cluster workloads.",
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
      "Role-defined access supports a bounded infrastructure claim. It does not support a conclusion about the model, workload, or compliance status.",
    findingLine:
      "Access: the contractor could directly support the capacity expansion and project code, not the workload or authorization.",
  },
  {
    id: "incentives",
    label: "Incentives",
    prompt: "How should the financial reward affect the assessment?",
    choices: [
      {
        id: "incentive-context",
        text: "Record both the possible reward and the costs of reporting; treat motive as a reason to test the claim, not a verdict on truth.",
      },
      {
        id: "incentive-dismiss",
        text: "Disregard the report because a paid source is presumptively unreliable.",
      },
      {
        id: "incentive-credit",
        text: "Treat the personal risk of reporting as proof that the allegation is true.",
      },
    ],
    answerId: "incentive-context",
    retry:
      "An incentive can create pressure in either direction; it changes the test, not the truth value by itself.",
    explanation:
      "Rewards can invite false claims, while retaliation and lost work can deter true ones. Neither substitutes for evidence.",
    findingLine:
      "Incentives: the possible reward and the contractor's commercial risks justify scrutiny, but neither confirms nor defeats the report.",
  },
  {
    id: "consistency",
    label: "Consistency",
    prompt: "What consistency test is probative?",
    choices: [
      {
        id: "consistency-material",
        text: "Check whether site, dates, quantities, and project code remain stable across retellings and fit the known timeline.",
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
      "Test stable material facts. Word-perfect repetition can be rehearsal, and coordinated accounts are not independent.",
    explanation:
      "Ordinary memory drifts at the edges. The important question is whether the central claim stays coherent against the timeline and other evidence.",
    findingLine:
      "Consistency: the material details should remain stable and fit the known timeline; scripted agreement would not count as independence.",
  },
  {
    id: "corroboration",
    label: "Independent corroboration",
    prompt: "What gives this report additional evidentiary weight?",
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
      "Corroboration gains force when it was created independently and is outside the source's control.",
    explanation:
      "The matching project code and dates connect the account to an external record. They support the expansion, not the hidden workload alleged beyond it.",
    findingLine:
      "Corroboration: the matching utility record strengthens the infrastructure claim; separate workload and approval records are still required.",
  },
];

export const FINAL_FINDING = {
  disposition: "Further investigation justified · no compliance judgment yet",
  text: "The report is credible evidence that Project Lattice expanded infrastructure at the stated site and time. It does not establish what workload ran or whether the activity was unauthorized. Preserve the work orders and utility log, then test the unresolved links through receiving and serial records, scheduler telemetry, model lineage, and the approval trail.",
} as const;

export const FAILURE_MODES = [
  {
    name: "Selective truth",
    check:
      "A real expansion can be described as if it proves a prohibited workload. Keep each conclusion inside the corroborated facts.",
  },
  {
    name: "Coordinated cover story",
    check:
      "Several matching accounts are one source if the same managers selected, briefed, or monitored the speakers.",
  },
  {
    name: "Management staging",
    check:
      "A clean tour and curated records show what was presented, not whether undeclared activity exists elsewhere.",
  },
  {
    name: "Suppression",
    check:
      "Silence is weak evidence when people lack a safe route, access to declarations, or freedom from retaliation.",
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
