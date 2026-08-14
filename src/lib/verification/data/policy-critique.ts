/**
 * 2.4.2 — Policy on Paper.
 *
 * THE COURSE OWNER'S SPEC, verbatim: the policy, the bridge, the prompt, the
 * two-and-two shape, the eight-point rubric and the rule that a bare label
 * earns no justification point. Its olympiad mechanic is critiquing a drafted
 * provision by naming both what is correctly designed and what is defective,
 * and justifying each judgement.
 *
 * WHY THE PROVISIONS ARE NOT LISTED AS OPTIONS. The learner has to find them
 * in the policy — that is the operation. A menu of pre-written interpretations
 * would leave the reading already done, which is the exact substitution her
 * spec forbids, so a finding is made by pressing a provision in the policy
 * itself and then saying what it does.
 *
 * NOTHING IS PRE-LABELLED. No provision is marked as a safeguard or a
 * chokepoint anywhere before submission, and the reveal is the first time this
 * page says anything evaluative at all.
 *
 * The policy is deliberately mixed: it contains protections that really work
 * and provisions that really would stop information, and one of each is
 * subtle. That is what makes two-and-two a judgement rather than a sorting
 * task.
 *
 * WHAT IS MINE: the annotations in the reveal. Her spec says to annotate the
 * policy afterwards and to allow more than four defensible observations,
 * without writing them; each annotation below says only what the provision it
 * sits under does, in ordinary language, and several provisions carry a
 * reading in both directions because they genuinely have one.
 */

export interface PolicyProvision {
  id: string;
  text: string;
  /** Shown only in the reveal. */
  annotation: string;
}

/** Her policy, verbatim and in her order. */
export const POLICY_TITLE = "Frontier Lab Protected Disclosure Policy";

export const POLICY_PROVISIONS: PolicyProvision[] = [
  {
    id: "route",
    text: "Employees may report suspected treaty violations to their direct manager or the Compliance Office.",
    annotation:
      "Two named recipients rather than one is a real improvement on a single line of report: a person whose manager is the problem has somewhere else to go. Both recipients are still inside the organization, so this decides where a report starts and not where it can end up.",
  },
  {
    id: "anonymous",
    text: "Anonymous reports will be accepted but will not ordinarily be investigated without supporting documentation.",
    annotation:
      "Anonymity is offered and then priced. Documentation is what a reporter who needs anonymity is least able to gather and carry out, and taking it is often the act that identifies them. The channel exists; using it as intended makes the report the kind that is not investigated.",
  },
  {
    id: "external",
    text: "Disclosure to external bodies requires prior authorization from the General Counsel.",
    annotation:
      "The route out is held by an officer whose client is the organization that would be implicated. This is the provision that decides whether anything reaches an independent verifier, and it decides it from inside.",
  },
  {
    id: "retaliation",
    text: "Employees making good-faith reports are protected from retaliation.",
    annotation:
      "Protection attaches to the good faith of the report rather than to whether it turns out to be right, which is the condition a reporter can actually satisfy at the moment of deciding. Compare a rule that protected only proven allegations: nobody can know that in advance, so nobody would report.",
  },
  {
    id: "forwarding",
    text: "Compliance determines whether a report should be forwarded to the independent verification body.",
    annotation:
      "The last step before the verifier is an internal discretionary decision with no stated criteria, no notice to the reporter, and no route around it. Read with the previous provision, the organization controls both ways out.",
  },
  {
    id: "record",
    text: "Findings may be retained in the employee’s personnel record.",
    annotation:
      "A cost attached to having reported, carried by the person and readable by everyone who later decides about their career. It is not retaliation as the policy defines it, which is what makes it effective.",
  },
];

/** Her bridge, verbatim. Nothing else precedes the task. */
export const POLICY_BRIDGE =
  "A reporting policy can contain real protections and still create barriers to independent verification. Evaluate the policy below as written.";

/** Her prompt, verbatim. */
export const POLICY_PROMPT =
  "Identify two provisions that genuinely support effective reporting and two provisions that could prevent important information from reaching an independent verifier. Briefly explain each judgment.";

export interface FindingSlot {
  id: string;
  side: "supports" | "prevents";
  label: string;
}

export const FINDING_SLOTS: FindingSlot[] = [
  { id: "s1", side: "supports", label: "Supports effective reporting" },
  { id: "s2", side: "supports", label: "Supports effective reporting" },
  {
    id: "p1",
    side: "prevents",
    label: "Could stop information reaching an independent verifier",
  },
  {
    id: "p2",
    side: "prevents",
    label: "Could stop information reaching an independent verifier",
  },
];

/** Shown with the annotations, once the four findings are in. */
export const POLICY_REVEAL = [
  "A provision is not the same thing as its effect. What is written down is the provision; what it does to somebody deciding whether to report, or to information trying to reach an outside body, is the mechanism — and the mechanism is what a judgement about a policy has to name.",
  "There are more than four defensible findings here. Several provisions can be read in both directions, and a reading that says how is worth more than a reading that picks the expected side.",
];
