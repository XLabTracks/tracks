export const CLOUD_SOURCES = {
  heim: {
    label: "Heim et al., §§3.2–3.3.4 and Appendix B",
    href: "https://arxiv.org/html/2403.08501v2#S3.SS2",
  },
  kyc: {
    label: "Egan and Heim, §§2.1–2.2.2",
    href: "https://arxiv.org/html/2310.13625v1#S2.SS1",
  },
  rand: {
    label: "Moon et al., Finding and Closing Detection Gaps",
    href: "https://www.rand.org/pubs/research_reports/RRA3686-1.html",
  },
  carnegie: {
    label: "Tan, Cloud Controls Must Contend With “Who” and “What”",
    href: "https://carnegieendowment.org/research/2026/05/the-geopolitical-debates-over-controlling-cloud-compute",
  },
} as const;

export const CLOUD_TRUE_FALSE = [
  {
    id: "code",
    claim:
      "Because it supplies the accelerators, a cloud provider can normally inspect the customer’s source code and training data.",
    answer: false,
    explanation:
      "Infrastructure ownership does not imply routine access to customer code or data. Some services are expressly designed to prevent that access.",
  },
  {
    id: "billing",
    claim:
      "Billing and provisioning records can show the type and number of accelerators allocated and how long they were used.",
    answer: true,
    explanation:
      "Those records are part of ordinary service provision and can support compute accounting without revealing workload contents.",
  },
  {
    id: "flops",
    claim:
      "A high FLOP total, by itself, identifies a workload as model training.",
    answer: false,
    explanation:
      "Compute volume is not workload type. Classification needs other signals, and even then the result is probabilistic.",
  },
  {
    id: "kyc",
    claim:
      "KYC can link an account to a declared entity while still failing to identify the person who ultimately controls a shell company.",
    answer: true,
    explanation:
      "Customer identity and beneficial ownership are separate questions; the second is a known evasion problem.",
  },
  {
    id: "sequential",
    claim:
      "Sequential training can keep each account or session below a reporting threshold while the sessions contribute to one larger training effort.",
    answer: true,
    explanation:
      "RAND’s example exploits the unit over which the threshold is applied, rather than making the underlying work disappear.",
  },
  {
    id: "finding",
    claim: "A workload-classification flag is already a compliance finding.",
    answer: false,
    explanation:
      "A flag identifies a case for review. A finding still depends on the governing rule and corroborating evidence.",
  },
] as const;

export const CLOUD_ODD_ITEMS = [
  { id: "allocation", text: "Requested accelerator type and count" },
  { id: "duration", text: "Allocation duration" },
  { id: "network", text: "Cluster network-utilization pattern" },
  { id: "purpose", text: "Purpose stated in the customer declaration" },
] as const;

export const CLOUD_ODD_PRINCIPLES = [
  {
    id: "identity",
    text: "It is the only item that identifies the beneficial owner.",
  },
  {
    id: "claim",
    text: "It is a customer claim; the other three are measurements or service records.",
  },
  {
    id: "after",
    text: "It is the only item collected after a workload finishes.",
  },
  {
    id: "retention",
    text: "It is the only item a provider is never allowed to retain.",
  },
] as const;

export const CLOUD_AVAILABLE_DATA = [
  {
    id: "billing-identity",
    text: "Account, billing, and payment information",
    answer: true,
  },
  {
    id: "hardware",
    text: "Requested hardware configuration and allocation times",
    answer: true,
  },
  {
    id: "telemetry",
    text: "Cluster-level power, network, and storage telemetry",
    answer: true,
  },
  {
    id: "purpose",
    text: "A purpose statement, if the provider requires one",
    answer: true,
  },
  {
    id: "dataset",
    text: "The exact contents of the customer’s training dataset",
    answer: false,
  },
  {
    id: "intent",
    text: "The customer’s actual strategic intent",
    answer: false,
  },
  {
    id: "owner",
    text: "The true beneficial owner without any due diligence",
    answer: false,
  },
] as const;

export const CLOUD_MATCH_CONCLUSIONS = [
  {
    id: "resource",
    text: "Resources allocated and an estimate of compute consumed",
  },
  {
    id: "training-shaped",
    text: "The workload is more likely to be training than ordinary inference",
  },
  {
    id: "customer",
    text: "The account is linked to an identified entity and its declared owners",
  },
  {
    id: "detailed",
    text: "A run followed specified training rules, subject to the access and proof used",
  },
] as const;

export const CLOUD_MATCH_ROWS = [
  {
    id: "billing",
    observable: "Provisioning and billing records",
    answerId: "resource",
  },
  {
    id: "shape",
    observable:
      "Sustained accelerator use, synchronization traffic, and checkpoint-sized writes",
    answerId: "training-shaped",
  },
  {
    id: "due-diligence",
    observable: "Verified identity and beneficial-ownership records",
    answerId: "customer",
  },
  {
    id: "artifacts",
    observable:
      "Intermediate training artifacts under a special verification protocol",
    answerId: "detailed",
  },
] as const;

export const CLOUD_PIPELINE_OPTIONS = [
  "KYC",
  "workload classification",
  "compute accounting",
  "flag and escalation",
  "attestation",
  "model evaluation",
  "source-code inspection",
] as const;

export const CLOUD_PIPELINE_GAPS = [
  {
    id: "identity",
    before: "Link the account to a customer through",
    answer: "KYC",
  },
  {
    id: "type",
    before: "Compare technical signals through",
    answer: "workload classification",
  },
  {
    id: "amount",
    before: "Total resource use through",
    answer: "compute accounting",
  },
  {
    id: "response",
    before: "Send threshold or anomaly cases to",
    answer: "flag and escalation",
  },
] as const;

export const CLOUD_SEQUENCE = [
  { id: "account", text: "Open or identify the customer account" },
  { id: "kyc", text: "Verify identity and beneficial ownership" },
  { id: "purpose", text: "Record the declared workload and purpose" },
  { id: "logs", text: "Collect provisioning records and workload telemetry" },
  { id: "flag", text: "Flag a threshold crossing or material anomaly" },
  {
    id: "escalate",
    text: "Escalate the case for review under the governing rule",
  },
] as const;

export const CLOUD_SEQUENCE_START = [
  "logs",
  "account",
  "purpose",
  "flag",
  "kyc",
  "escalate",
] as const;

export const CLOUD_CONCEPTS = [
  "KYC",
  "logging",
  "workload classification",
  "attestation",
] as const;

export const CLOUD_CONCEPT_ROWS = [
  {
    id: "customer",
    description:
      "Verifies the customer and, where required, the people who ultimately own or control it.",
    answer: "KYC",
  },
  {
    id: "events",
    description:
      "Preserves time-stamped service events and measurements so activity can be reconstructed later.",
    answer: "logging",
  },
  {
    id: "category",
    description:
      "Uses observable workload properties to estimate whether activity is training, inference, or another class of computation.",
    answer: "workload classification",
  },
  {
    id: "signed-state",
    description:
      "Produces a cryptographically signed claim about an approved hardware or software state.",
    answer: "attestation",
  },
] as const;

export const CLOUD_CASE_OPTIONS = [
  {
    id: "linked",
    text: "The account is linked to the identified company and recorded beneficial owner.",
    answer: true,
  },
  {
    id: "shape",
    text: "The observed use is inconsistent with the declaration and has training-like features.",
    answer: true,
  },
  {
    id: "proves",
    text: "The provider has proved that a prohibited model was trained.",
    answer: false,
  },
  {
    id: "contents",
    text: "The provider now knows the dataset, model objective, and resulting capabilities.",
    answer: false,
  },
  {
    id: "escalate",
    text: "The discrepancy supports flagging and further review.",
    answer: true,
  },
] as const;

export const CLOUD_INFERENCE_OPTIONS = [
  {
    id: "below",
    text: "No review is justified because every account stayed below the per-account threshold.",
  },
  {
    id: "violation",
    text: "The logs alone establish that one actor completed a prohibited training run.",
  },
  {
    id: "flag",
    text: "Flag suspected coordinated or structured training; then test common control, checkpoint lineage, and the rule’s aggregation provision.",
  },
  {
    id: "capability",
    text: "The logs establish the capability of the resulting model.",
  },
] as const;

export const CLOUD_TASKS = [
  { label: "Claims", title: "Six claims", time: "3 min" },
  { label: "Odd one out", title: "Find the different item", time: "3 min" },
  {
    label: "Available data",
    title: "What can the provider see?",
    time: "3 min",
  },
  { label: "Matching", title: "Observable and conclusion", time: "4 min" },
  { label: "Pipeline", title: "Complete the scheme", time: "4 min" },
  { label: "Sequence", title: "Put the process in order", time: "3 min" },
  { label: "Concepts", title: "Name the mechanism", time: "3 min" },
  { label: "Case", title: "Qualify the evidence", time: "4 min" },
  { label: "Inference", title: "Can the conclusion be made?", time: "3 min" },
] as const;
