
export interface KeyCriterion {
  text: string;
  points: number;
  needsReasoning?: boolean;
  grounds?: string;
}

export interface MarkingKey {
  criteria: KeyCriterion[];
  noCredit: string[];
}

export function keyTotal(key: MarkingKey): number {
  return key.criteria.reduce((sum, c) => sum + c.points, 0);
}

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

export const COMPANIES_AB_KEY: MarkingKey = {
  criteria: [
    {
      text: "The first difference is one that really bears on whether evidence can reach an independent verifier.",
      points: 1,
    },
    {
      text: "It says what that difference does — who decides, and what happens to a report when they decide against it.",
      points: 1,
      needsReasoning: true,
    },
    {
      text: "The second difference is a different one, and also bears on reach rather than on the reporter's comfort.",
      points: 1,
    },
    {
      text: "It states its mechanism too, rather than restating the feature.",
      points: 1,
      needsReasoning: true,
    },
    {
      text: "The reading of the letter is about what its existence and composition show, not about whether the signatories were right.",
      points: 1,
      needsReasoning: true,
    },
    {
      text: "That reading is proportionate: insiders asking publicly is evidence about how they found the existing arrangements, and is not a measurement of them.",
      points: 1,
      needsReasoning: true,
    },
    {
      text: "The answer names at least one thing the letter does not establish.",
      points: 1,
    },
    {
      text: "It says why that one does not follow — what the evidence would have to be instead.",
      points: 1,
      needsReasoning: true,
    },
  ],
  noCredit: [
    "Which company has the better policy. The task is which difference is consequential and why.",
    "Counting safeguards. Both have a channel and both prohibit retaliation.",
    "Restating a feature as though naming it explained it.",
    "Treating the letter as an authority that settles the question rather than as evidence to be read.",
    "Concluding from the letter that the companies had no protections, or that the signatories' safety concerns were correct.",
  ],
};

export const STANDARD_OF_PROOF_KEY: MarkingKey = {
  criteria: [
    {
      text: "A: the move stops at collection or investigation, and the reason is what one report can carry — not the source’s sincerity.",
      points: 2,
      needsReasoning: true,
      grounds:
        "One protected, consistent human report licenses doing something and establishes nothing alone. What is missing is anything independent of one person’s account — the human evidence has no technical record to gain weight from yet.",
    },
    {
      text: "B: the step escalates with corroboration, and the refusal is weighed as conduct, not as proof.",
      points: 2,
      needsReasoning: true,
      grounds:
        "Customs records and telemetry are independent technical evidence converging with the human report — that convergence is how human evidence gains weight. A declined inspection aggravates; it does not convert suspicion into a finding. A compliance judgment is defensible here; enforcement is a referral, because enforcement is not the verifier’s own power — that is the authority line.",
    },
    {
      text: "C: the defect is named as access, not as evidence weight — informational capture.",
      points: 2,
      needsReasoning: true,
      grounds:
        "Everything the institution sees was chosen by the audited party: Brundage et al.’s Access principle frustrated. The move is to secure independent access — the working papers, a challenge inspection — not to judge either way on a channelled case, and not to treat the audit’s conclusion as false because its channel is bad.",
    },
    {
      text: "D: the evidence is conceded and the institution is disqualified — financial capture, independence.",
      points: 2,
      needsReasoning: true,
      grounds:
        "The case would carry a judgment; this panel cannot defensibly issue it. Funding through the audited party’s association is the financial form of capture; members on leave from its suppliers is the revolving-door, cultural form — the pair Brundage et al.’s Independent Experts principle exists to block (disclosure, no auditor-shopping, cooling-off periods). Political capture is the same failure arriving through state pressure. The repair is recusal or reconstitution, not more evidence.",
    },
  ],
  noCredit: [
    "Ranking the cases from weakest to strongest. The task is one step per case, justified.",
    "Treating case D’s panel defect as a reason to doubt case D’s evidence.",
    "A step justified by the seriousness of the allegation rather than by what the case establishes.",
    "Naming a capture form without saying which fact in the case is the capture.",
  ],
};
