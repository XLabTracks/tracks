export const CLOUD_SOURCES = {
  heimRecords: {
    label: "Heim et al., §3.2 and Appendix B, Table 4",
    href: "https://arxiv.org/html/2403.08501v2#S3.SS2",
  },
  heimVerification: {
    label: "Heim et al., §§3.3.2–3.3.4",
    href: "https://arxiv.org/html/2403.08501v2#S3.SS3.SSS2",
  },
  kyc: {
    label: "Egan and Heim, §§2.1–2.2.2",
    href: "https://arxiv.org/html/2310.13625v1#S2.SS1",
  },
  randMetrics: {
    label:
      "Moon et al., “Cloud Service Provider Monitoring Strategies” and “Finding a Detection Gap”",
    href: "https://www.rand.org/pubs/research_reports/RRA3686-1.html",
  },
  randClosing: {
    label: "Moon et al., “Closing Detection Gaps”",
    href: "https://www.rand.org/pubs/research_reports/RRA3686-1.html",
  },
  carnegieScope: {
    label:
      "Tan, “Cloud Controls Must Contend With ‘Who’ and ‘What’ They Restrict”",
    href: "https://carnegieendowment.org/research/2026/05/the-geopolitical-debates-over-controlling-cloud-compute",
  },
} as const;

export type CloudSource = (typeof CLOUD_SOURCES)[keyof typeof CLOUD_SOURCES];

export const CLOUD_TRUE_FALSE = [
  {
    id: "billing",
    claim:
      "A provider’s billing records can include the hardware configuration requested and the number of hours it was used.",
    answer: true,
    explanation:
      "True. Heim et al. list requested hardware configuration and hours of use as billing-related technical information.",
  },
  {
    id: "power",
    claim:
      "Cluster power consumption, by itself, establishes that a customer is training a frontier model.",
    answer: false,
    explanation:
      "False. Power can contribute to workload classification or compute accounting; it does not identify the workload with certainty.",
  },
  {
    id: "workload-data",
    claim:
      "Customer code, data, and hyperparameters are ordinarily collected for cloud billing.",
    answer: false,
    explanation:
      "False. Heim et al. mark workload-level code, data, and hyperparameters as not currently collected for this purpose.",
  },
  {
    id: "same-question",
    claim:
      "Compute accounting and workload classification answer the same verification question.",
    answer: false,
    explanation:
      "False. Accounting estimates how much compute was used; classification estimates what kind of workload used it.",
  },
  {
    id: "kyc-before-threshold",
    claim:
      "Under the proposed KYC scheme, a provider would monitor compute accumulation and move a customer into KYC before the threshold is crossed.",
    answer: true,
    explanation:
      "True. Egan and Heim propose continuous monitoring so customers approaching the threshold enter KYC before crossing it.",
  },
  {
    id: "more-metrics",
    claim:
      "Adding mandatory metrics can narrow a detection gap, but the thresholds still require empirical review as technology changes.",
    answer: true,
    explanation:
      "True. RAND recommends both additional metrics and continuing work on thresholds that can adapt to technological progress.",
  },
] as const;

export const CLOUD_ODD_ITEMS = [
  { id: "power", text: "Total power used by an account’s instances" },
  { id: "cluster", text: "Maximum GPU cluster size used by one instance" },
  { id: "flops", text: "Total FLOPs across an account’s instances" },
  { id: "owner", text: "Verified beneficial-ownership record" },
] as const;

export const CLOUD_ODD_PRINCIPLES = [
  {
    id: "actor",
    text: "It identifies an actor; the other three measure compute activity and can be assigned thresholds.",
  },
  {
    id: "automatic",
    text: "It is the only item the provider obtains automatically when an account is created.",
  },
  {
    id: "code",
    text: "It is the only item that reveals the customer’s source code.",
  },
  {
    id: "finding",
    text: "It is the only item that independently establishes a policy violation.",
  },
] as const;

export const CLOUD_AVAILABLE_DATA = [
  {
    id: "customer",
    text: "Customer name, billing address, IP addresses, and access times",
    answer: true,
  },
  {
    id: "hardware",
    text: "Requested hardware configuration and hours of use",
    answer: true,
  },
  {
    id: "cluster",
    text: "Cluster-level power consumption and network bandwidth between nodes",
    answer: true,
  },
  {
    id: "node",
    text: "Node-level accelerator utilization and memory-bandwidth utilization that the provider may already collect",
    answer: true,
  },
  {
    id: "kyc-record",
    text: "Identity, beneficial-ownership, and declared-purpose records required under the proposed KYC scheme",
    answer: true,
  },
  {
    id: "workload",
    text: "The customer’s exact code, data, and hyperparameters without a special access protocol",
    answer: false,
  },
  {
    id: "dataset",
    text: "The contents of the training dataset from billing records alone",
    answer: false,
  },
  {
    id: "intent",
    text: "The customer’s actual strategic intent",
    answer: false,
  },
] as const;

export const CLOUD_MATCH_CONCLUSIONS = [
  {
    id: "resource",
    text: "An estimate of compute consumed",
  },
  {
    id: "training-likely",
    text: "The workload is more likely to be large-scale training",
  },
  {
    id: "identity",
    text: "The account is associated with the entity and owners verified under KYC",
  },
  {
    id: "property",
    text: "A specified workload property is verified without exposing the rest of the code or data",
  },
] as const;

export const CLOUD_MATCH_ROWS = [
  {
    id: "billing",
    observable:
      "Hardware configuration, hours of use, and measured utilization",
    answerId: "resource",
  },
  {
    id: "shape",
    observable:
      "Sustained accelerator utilization, parallelization-shaped communication, and limited external-network traffic",
    answerId: "training-likely",
  },
  {
    id: "due-diligence",
    observable:
      "Verified incorporation, key-personnel, and beneficial-ownership records",
    answerId: "identity",
  },
  {
    id: "confidential-computing",
    observable:
      "A trusted-execution-environment proof presented by an attester",
    answerId: "property",
  },
] as const;

export const CLOUD_PIPELINE_OPTIONS = [
  "KYC",
  "record keeping",
  "workload classification",
  "compute accounting",
  "reporting or escalation",
  "attestation",
  "model evaluation",
  "source-code inspection",
] as const;

export const CLOUD_PIPELINE_GAPS = [
  {
    id: "identity",
    before: "Verify the customer and beneficial owners through",
    answer: "KYC",
  },
  {
    id: "records",
    before: "Retain service-use data through",
    answer: "record keeping",
  },
  {
    id: "type",
    before: "Estimate whether the activity is training through",
    answer: "workload classification",
  },
  {
    id: "amount",
    before: "Estimate the amount of compute through",
    answer: "compute accounting",
  },
  {
    id: "response",
    before: "Refer a threshold crossing or high-risk profile through",
    answer: "reporting or escalation",
  },
] as const;

export const CLOUD_SEQUENCE = [
  { id: "request", text: "Customer requests an account or large allocation" },
  { id: "kyc", text: "Provider verifies the entity and beneficial owners" },
  {
    id: "purpose",
    text: "Provider records the declared purpose and expected scope",
  },
  {
    id: "logs",
    text: "Provider records usage metrics while the workload runs",
  },
  { id: "flag", text: "A threshold crossing or material anomaly is flagged" },
  {
    id: "escalate",
    text: "The case is reported or escalated under the governing rule",
  },
] as const;

export const CLOUD_SEQUENCE_START = [
  "logs",
  "request",
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
      "Verification of the customer entity and, where required, its beneficial owners.",
    answer: "KYC",
  },
  {
    id: "events",
    description:
      "Creation and retention of time-stamped service-use records so activity can be reconstructed later.",
    answer: "logging",
  },
  {
    id: "category",
    description:
      "Use of observable technical characteristics to estimate whether a workload belongs to a category such as training or inference.",
    answer: "workload classification",
  },
  {
    id: "proof",
    description:
      "In a confidential-computing protocol, presentation of a verifiable claim about a workload property without revealing the remaining code or data.",
    answer: "attestation",
  },
] as const;

export const CLOUD_CASE_OPTIONS = [
  {
    id: "linked",
    text: "The account is associated with the company and owners verified in the KYC record.",
    answer: true,
  },
  {
    id: "classification",
    text: "The technical pattern makes large-scale training more likely than the declared rendering workload.",
    answer: true,
  },
  {
    id: "review",
    text: "The discrepancy between the declaration and the technical pattern supports further review.",
    answer: true,
  },
  {
    id: "contents",
    text: "The provider has verified the model architecture and training dataset.",
    answer: false,
  },
  {
    id: "violation",
    text: "The provider has established that a prohibited training run occurred.",
    answer: false,
  },
  {
    id: "intent",
    text: "The provider now knows why the customer authorized the workload.",
    answer: false,
  },
] as const;

export const CLOUD_INFERENCE_OPTIONS = [
  {
    id: "separate",
    text: "Treat every account as compliant because each remained below the per-account threshold.",
  },
  {
    id: "finding",
    text: "Issue a violation finding because aggregate compute alone proves that the owner conducted prohibited training.",
  },
  {
    id: "investigate",
    text: "Open an investigation: test whether the rule aggregates commonly controlled accounts and whether the sessions form one training run.",
  },
  {
    id: "capability",
    text: "Infer the resulting model’s capabilities from aggregate compute alone.",
  },
] as const;

export const CLOUD_TASKS = [
  { label: "True / false", title: "True or false", time: "3 min" },
  { label: "Odd one out", title: "Find the odd one out", time: "3 min" },
  {
    label: "Select all",
    title: "Select all that apply",
    time: "3 min",
  },
  { label: "Matching", title: "Match the pairs", time: "4 min" },
  { label: "Gaps", title: "Fill the gaps", time: "4 min" },
  { label: "Sequence", title: "Put the stages in order", time: "3 min" },
  { label: "Concepts", title: "Name the mechanism", time: "3 min" },
  { label: "Case", title: "Qualify the evidence", time: "4 min" },
  {
    label: "Inference",
    title: "Choose the permissible inference",
    time: "3 min",
  },
] as const;
