
export const POLICY_RULES = [
  "Employees must first report suspected violations to their direct manager.",
  "Anonymous reports are not investigated.",
  "External disclosure requires prior authorization from the organization.",
  "Managers decide which reports are forwarded to the compliance team.",
  "Investigation outcomes may be added to the employee’s personnel record.",
  "Employees who knowingly make false reports may be disciplined.",
];

export const INFER_PROMPT =
  "Without rewriting the policy, infer what incentives this system creates for an employee who discovers a possible treaty violation.";

export const INFER_INSTRUCTION =
  "Identify three consequences that follow from the rules above. For each, cite the rule or combination of rules that produces it.";

export const CONSEQUENCE_ROWS = 3;

export const INFER_REVEAL = [
  "A reporting system can exist formally while still making disclosure costly, dependent, or easy to suppress.",
  "The key question is not only whether reporting is permitted, but whether information can reliably travel from the insider to an independent verification process.",
];

export const RULE_ANNOTATIONS = [
  "A managerial chokepoint. The first person who must be told may be the person the report is about, and nothing moves until they act.",
  "Anonymity that exists in form and not in effect: it is permitted, and a report that uses it goes nowhere. To be taken seriously you have to be identifiable.",
  "Dependence on employer authorization. The organization that would be implicated decides whether information may reach anyone outside it.",
  "With rule 1, one person is both the first recipient and the gate. Suppression here needs no decision anyone else can see.",
  "Career cost attaches to having reported, not to having reported wrongly — the record follows the outcome either way.",
  "Reasonable on its own. Read with rules 2 and 5, it prices reporting under uncertainty, which is the normal state of an insider who has noticed something.",
];

export const INFER_SECOND_STEP =
  "Which one rule would you change first if your only objective were to improve the probability that serious allegations reach an independent verifier?";

export const SECOND_STEP_MAX_WORDS = 40;
