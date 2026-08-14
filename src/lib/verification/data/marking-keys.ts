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
 * WHERE THE CRITERIA COME FROM. All four totals and shapes are the course
 * owner's, from her exercise briefs: five points for the case, eight for the
 * policy critique as two per finding, two per case for the four variants, and
 * eight for the institution across her four named tests. The wording of the
 * individual criteria is ours where hers names the shape rather than the
 * sentence.
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

/**
 * 2.4.2 — Policy on Paper. Eight points: two per finding, one for naming the
 * provision's effect and one for the causal explanation behind it.
 *
 * Her grading principle, and the reason every second point is
 * `needsReasoning`: calling a provision good, bad, strong or weak does not
 * earn the justification point, and no particular vocabulary is required for
 * it either — an explanation in ordinary language is enough.
 */
export const POLICY_CRITIQUE_KEY: MarkingKey = {
  criteria: [
    {
      text: "Supporting finding 1 names an effect the provision actually has.",
      points: 1,
    },
    {
      text: "Supporting finding 1 explains how that provision changes what a reporter does, or what reaches the verifier.",
      points: 1,
      needsReasoning: true,
    },
    {
      text: "Supporting finding 2 names an effect the provision actually has.",
      points: 1,
    },
    {
      text: "Supporting finding 2 explains the mechanism behind it.",
      points: 1,
      needsReasoning: true,
    },
    {
      text: "Blocking finding 1 names a provision that really could stop information reaching an independent verifier.",
      points: 1,
    },
    {
      text: "Blocking finding 1 explains how it stops it — who decides, or what it costs the reporter.",
      points: 1,
      needsReasoning: true,
    },
    {
      text: "Blocking finding 2 names a provision that really could stop information.",
      points: 1,
    },
    {
      text: "Blocking finding 2 explains the mechanism behind it.",
      points: 1,
      needsReasoning: true,
    },
  ],
  noCredit: [
    "Calling a provision good, bad, strong or weak. That is the judgement, not the justification.",
    "Restating the provision in different words as though repeating it explained it.",
    "An effect the provision does not have, however well argued.",
    "Rewriting the policy — the task is to evaluate it as written.",
  ],
};

/**
 * 2.4.3 — Same Claim, Different Circumstances. Two points per case and
 * nothing else: one for saying what this source's position lets them support,
 * one for a next step proportionate to it. Four cases, eight points.
 *
 * The comparison that follows the four is not scored, deliberately. Each case
 * is marked on its own — a right answer somewhere else cannot carry a wrong
 * one — and a point for the comparison would be a point earned across cases.
 */
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
  ],
  noCredit: [
    "A right answer somewhere else. Each case is marked on its own, and getting three right does not carry the fourth.",
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
