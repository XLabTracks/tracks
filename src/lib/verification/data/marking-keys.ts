/**
 * The marking keys for 2.4's four constructed exercises.
 *
 * WHAT A KEY IS HERE. Not an auto-grader and not a canonical answer — both are
 * ruled out by the exercise specs, and neither would survive contact with a
 * task whose whole point is that several answers are defensible. A key is the
 * criteria a marker would use, with the credit each carries, so a learner can
 * mark their own work against something specific instead of against a feeling.
 *
 * THE FORM, which is deliberate and consistent across all four:
 *
 *   - credit is per ELEMENT, never per task: a criterion is one thing the
 *     answer either did or did not do, and each is worth its own point;
 *   - a correct label with no reasoning earns nothing. Every criterion that
 *     asks for a judgement asks for the mechanism behind it in the same
 *     breath, and `needsReasoning` is what says so on screen;
 *   - wording is free. Any phrasing that does not distort the meaning counts,
 *     and no criterion is satisfied by reciting a particular term;
 *   - what earns nothing is stated, not implied — `noCredit` on every key;
 *   - the total is stated and is the sum of the parts, which
 *     `marking-keys.test.ts` enforces.
 *
 * WHERE THE CRITERIA COME FROM. The 2.4.1 and 2.4.4 criteria are the course
 * owner's, from her exercise briefs. The 2.4.2 and 2.4.3 criteria follow her
 * stated grading rules for those two — grade the causal inference, not the
 * vocabulary; grade each variant independently — extended to the number of
 * rows and variants the built exercises actually have.
 *
 * The `grounds` line on a criterion names the section's own reading that
 * settles it, so a learner marking themselves down can go and check rather
 * than take our word for it. Those are the readings already assigned in 2.4:
 * the whistleblower chapter of the Labor Code, the AIWI/CARMA best-practice
 * guide, Wasil et al. on routes out of an organization, the CIGIE
 * investigation standard, and Part X of the Chemical Weapons Convention.
 */

export interface KeyCriterion {
  text: string;
  points: number;
  /** True when a bare correct label earns nothing without the mechanism. */
  needsReasoning?: boolean;
  /** The reading in this module that settles it, where one does. */
  grounds?: string;
}

export interface MarkingKey {
  criteria: KeyCriterion[];
  /** Stated, never implied. */
  noCredit: string[];
}

export function keyTotal(key: MarkingKey): number {
  return key.criteria.reduce((sum, c) => sum + c.points, 0);
}

/** 2.4.1 — Construct a Case. The five criteria are the course owner's. */
export const CONSTRUCT_CASE_KEY: MarkingKey = {
  criteria: [
    {
      text: "The insider plausibly has access to accurate information about the violation.",
      points: 1,
      grounds:
        "Compartmentalisation is the constraint: a person sees the part of a violation their station touches, and rarely more.",
    },
    {
      text: "The report concerns an actual violation, not merely suspicious activity.",
      points: 1,
    },
    {
      text: "Disclosure is permitted by the framework the case names.",
      points: 1,
      grounds:
        "The chapter ties this to three things at once — a covered person, a reportable subject, and a named recipient. A case that satisfies one of the three has not satisfied this.",
    },
    {
      text: "A concrete failure stops the report from becoming actionable evidence, and it is named.",
      points: 1,
      needsReasoning: true,
      grounds:
        "The investigation standard is the test of “actionable”: material lawfully obtained, chain of custody preserved, evidence admissible. A failure at any of those three is a failure of the kind this asks for.",
    },
    {
      text: "The failure is internally consistent with the rest of the case.",
      points: 1,
      needsReasoning: true,
    },
  ],
  noCredit: [
    "Defining the three conditions in the abstract rather than instantiating them in one case.",
    "A failure that is only that the insider lied, was wrong, was forbidden to report, or was ignored for no stated reason.",
    "A failure that contradicts the access the case gave the insider.",
  ],
};

/** 2.4.2 — Read the Rules, Infer the System. Two points per row. */
export const INFER_SYSTEM_KEY: MarkingKey = {
  criteria: [
    {
      text: "Row 1 cites a rule or combination that genuinely produces the consequence it names.",
      points: 1,
    },
    {
      text: "Row 1 states the mechanism: rule → what it costs or permits → what the employee then does.",
      points: 1,
      needsReasoning: true,
    },
    {
      text: "Row 2 cites a rule or combination that produces its consequence.",
      points: 1,
    },
    {
      text: "Row 2 states the mechanism rather than the verdict.",
      points: 1,
      needsReasoning: true,
    },
    {
      text: "Row 3 cites a rule or combination that produces its consequence.",
      points: 1,
    },
    {
      text: "Row 3 states the mechanism rather than the verdict.",
      points: 1,
      needsReasoning: true,
    },
    {
      text: "At least one row reads two rules together rather than one alone.",
      points: 1,
      grounds:
        "The design guide separates the channel, the protection and the remedy for this reason: a policy is not the sum of its rules read one at a time, and the sharpest effects here come from pairs.",
    },
  ],
  noCredit: [
    "Calling the policy bad, unsafe, weak, or not independent without saying what it does to the person inside it.",
    "A consequence with no rule behind it, or a rule that does not produce the consequence claimed.",
    "Repeating a rule in different words as though restating it were an inference.",
    "Rewriting the policy — the task is to read it.",
  ],
};

/** 2.4.3 — Same Claim, Different Circumstances. Two per variant, plus the comparison. */
export const SAME_CLAIM_KEY: MarkingKey = {
  criteria: [
    {
      text: "A: the answer says what this source can support, and the next step is proportionate to it.",
      points: 2,
      needsReasoning: true,
      grounds:
        "Direct observation of a dashboard is still one person's account of what they saw; the standard asks for supporting AND contradictory evidence before a finding.",
    },
    {
      text: "B: second-hand testimony is treated as such, and what is missing is named.",
      points: 2,
      needsReasoning: true,
      grounds:
        "Two accounts are not two sources if they came from the same room. Independence is the property to test, not the count.",
    },
    {
      text: "C: the inferential step is identified — what was observed, and what was concluded from it.",
      points: 2,
      needsReasoning: true,
      grounds:
        "Power draw, cooling and access restrictions are consistent with a large run and with several other things; the observation is solid and the conclusion is the reach.",
    },
    {
      text: "D: the document's own limits are named — what it shows, and what would make it usable.",
      points: 2,
      needsReasoning: true,
      grounds:
        "A document has provenance and a chain of custody, which is what makes it different in kind from a conversation, and what has to be established before it counts.",
    },
    {
      text: "The comparison locates the change in provenance and corroboration, not in the claim.",
      points: 1,
      needsReasoning: true,
    },
    {
      text: "Nowhere does the answer treat any single report as establishing the violation.",
      points: 1,
      grounds:
        "A challenge-inspection regime exists because a concern that routine measures did not resolve justifies looking, not concluding.",
    },
  ],
  noCredit: [
    "Ranking the four sources by credibility instead of saying what each supports.",
    "Recommending the same step everywhere with no reason tied to the changed fact.",
    "Treating A or D as proof of the violation.",
    "An answer that does not survive its own next step — recommending an inspection while stating that nothing yet justifies one.",
  ],
};

/** 2.4.4 — Build the Institution. The four criteria are the course owner's. */
export const BUILD_INSTITUTION_KEY: MarkingKey = {
  criteria: [
    {
      text: "Reach: information can get to an independent verifier without the organization's permission.",
      points: 2,
      grounds:
        "The statutory route names its recipients directly, and its protection attaches to reporting to them — not to a channel the employer may close.",
    },
    {
      text: "Protection: the reporter can know in advance what protects them.",
      points: 2,
      grounds:
        "The design guide asks for anti-retaliation, channels, remedies and notice as separate requirements, because a protection nobody can rely on in advance is not one.",
    },
    {
      text: "Epistemic discipline: a report can start verification without ending it.",
      points: 2,
      needsReasoning: true,
    },
    {
      text: "Coherence: the eighty words say how the five work as one institution, not why each is a good idea.",
      points: 2,
      needsReasoning: true,
    },
  ],
  noCredit: [
    "Five individually attractive provisions that do not operate together.",
    "Any pair that cancels: an independent route beside a requirement for employer approval; protection conditional on being proved right; a report treated as proof; a route with no corroboration and no escalation.",
    "An explanation that restates the provisions instead of saying what the combination does.",
  ],
};
