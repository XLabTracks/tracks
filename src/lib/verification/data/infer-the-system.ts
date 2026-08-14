/**
 * 2.4.2 — Read the Rules, Infer the System.
 *
 * THE COURSE OWNER'S SPEC, verbatim: the six-rule policy, the prompt, the
 * three-row output with a rule citation on every row, the reveal, and the
 * optional second step. Its olympiad mechanic is inferring a latent
 * institutional principle from a set of concrete rules.
 *
 * Two of her constraints shape the whole widget. The policy is shown with NO
 * explanation of its intended effects, and no rule is pre-labelled good or
 * bad — a page that marked rule 3 as the problem would have done the
 * exercise. And the institutional vocabulary does not appear until after
 * submission, which is why the annotations below are in the reveal and
 * nowhere else.
 *
 * Nothing is graded. Her grading rule is explicit: do not reward reproducing
 * "chilling effect", grade the causal inference — which is not something a
 * string match can see, so no key exists here at all.
 *
 * WHAT IS MINE AND SHOULD BE READ FIRST: the per-rule annotations. Her spec
 * says "annotate the policy to show several possible inferred mechanisms" and
 * lists the mechanisms — managerial chokepoints, weak anonymity, fear of
 * retaliation or career cost, dependence on employer authorization,
 * suppression before an independent verifier, and the difference between a
 * formal channel and a usable one. Each annotation below is one of those, put
 * against the rule or the pair of rules that produces it, and adds nothing
 * she did not name. They are six strings in one array.
 */

/** Her policy, verbatim and in her order. */
export const POLICY_RULES = [
  "Employees must first report suspected violations to their direct manager.",
  "Anonymous reports are not investigated.",
  "External disclosure requires prior authorization from the organization.",
  "Managers decide which reports are forwarded to the compliance team.",
  "Investigation outcomes may be added to the employee’s personnel record.",
  "Employees who knowingly make false reports may be disciplined.",
];

/** Her prompt, verbatim. */
export const INFER_PROMPT =
  "Without rewriting the policy, infer what incentives this system creates for an employee who discovers a possible treaty violation.";

export const INFER_INSTRUCTION =
  "Identify three consequences that follow from the rules above. For each, cite the rule or combination of rules that produces it.";

export const CONSEQUENCE_ROWS = 3;

/** Her reveal, verbatim. */
export const INFER_REVEAL = [
  "A reporting system can exist formally while still making disclosure costly, dependent, or easy to suppress.",
  "The key question is not only whether reporting is permitted, but whether information can reliably travel from the insider to an independent verification process.",
];

/**
 * One annotation per rule, shown only in the reveal. Mine, built from her own
 * list of mechanisms — see the header. Where a mechanism comes from a pair of
 * rules rather than one, the annotation names the pair, because that is the
 * inference the exercise is asking for.
 */
export const RULE_ANNOTATIONS = [
  "A managerial chokepoint. The first person who must be told may be the person the report is about, and nothing moves until they act.",
  "Anonymity that exists in form and not in effect: it is permitted, and a report that uses it goes nowhere. To be taken seriously you have to be identifiable.",
  "Dependence on employer authorization. The organization that would be implicated decides whether information may reach anyone outside it.",
  "With rule 1, one person is both the first recipient and the gate. Suppression here needs no decision anyone else can see.",
  "Career cost attaches to having reported, not to having reported wrongly — the record follows the outcome either way.",
  "Reasonable on its own. Read with rules 2 and 5, it prices reporting under uncertainty, which is the normal state of an insider who has noticed something.",
];

/** Her optional second step, verbatim. */
export const INFER_SECOND_STEP =
  "Which one rule would you change first if your only objective were to improve the probability that serious allegations reach an independent verifier?";

export const SECOND_STEP_MAX_WORDS = 40;
