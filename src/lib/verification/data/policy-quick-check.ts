/**
 * 2.4.2 — On Paper. A short discrimination deck: five policy fragments, one
 * institutional distinction each.
 *
 * THE ONLY MULTIPLE CHOICE IN 2.4, and deliberately. The module's rhythm is
 * creative short answer → fast discrimination → controlled comparison →
 * real-world analysis, and this is the fast one: five to seven minutes, no
 * writing, close options that differ by one institutional fact. What makes it
 * legitimate here is that nothing else in the section is multiple choice.
 *
 * The five distinctions the deck must cover, from the spec:
 *   1. organizational gatekeeping
 *   2. the external reporting route
 *   3. anti-retaliation protection
 *   4. anonymity or confidentiality is not reliability
 *   5. a report is not an established violation
 *
 * And its question types vary on purpose — strongest implication, identify the
 * defect, which conclusion does NOT follow, which provision addresses a stated
 * failure, justified inference — because five questions of one shape is the
 * thing the whole module was rebuilt to stop.
 *
 * WHAT IS MINE: questions 2 to 5. The first is the course owner's, verbatim,
 * including its four options and its answer. The rest follow her coverage list
 * and her variety list; every distractor is wrong for a reason a learner can
 * name, and none is wrong only because it is vague.
 */

export interface QuickChoice {
  id: string;
  text: string;
}

export interface QuickQuestion {
  id: string;
  /** What the fragment is testing — shown only after the deck is submitted. */
  covers: string;
  /** The policy language under examination. */
  fragment: string;
  /** The question type, in the stem itself. */
  stem: string;
  choices: QuickChoice[];
  answerId: string;
  /** Why the answer is the answer, and what the near miss got wrong. */
  explanation: string;
}

export const QUICK_QUESTIONS: QuickQuestion[] = [
  {
    id: "gatekeeping",
    covers: "Organizational gatekeeping",
    fragment:
      "Employees may report suspected violations externally after receiving written authorization from the General Counsel.",
    stem: "What is the most important limitation?",
    choices: [
      { id: "a", text: "The policy does not guarantee anonymity." },
      {
        id: "b",
        text: "The potentially implicated organization retains control over whether information can leave it.",
      },
      { id: "c", text: "General Counsel may lack technical expertise." },
      {
        id: "d",
        text: "External reporting necessarily compromises confidential information.",
      },
    ],
    answerId: "b",
    explanation:
      "A and C are real weaknesses and neither decides whether anything reaches the outside. The authorization requirement does: the party that would be implicated holds the gate. D is simply false as stated — external reporting can be scoped and confidential.",
  },
  {
    id: "route",
    covers: "The external reporting route",
    fragment:
      "A concern about an undeclared training run was raised through the internal channel, recorded, and closed by the compliance team. No external body ever learned of it.",
    stem: "Which provision would most directly have addressed this failure?",
    choices: [
      {
        id: "a",
        text: "Anonymous submission through a secure channel.",
      },
      {
        id: "b",
        text: "A protected route allowing the employee to report directly to an independent external recipient.",
      },
      { id: "c", text: "Annual training on the reporting policy." },
      {
        id: "d",
        text: "Longer retention of internal investigation records.",
      },
    ],
    answerId: "b",
    explanation:
      "The failure is not that the report was never made or never kept — it was made, recorded, and stopped. Only a route that does not terminate inside the organization changes that. Anonymity protects the reporter and would not have moved the report; training and retention address different failures.",
  },
  {
    id: "retaliation",
    covers: "Anti-retaliation protection",
    fragment:
      "Retaliation against an employee who makes a good-faith report is prohibited and subject to remedy.",
    stem: "Which conclusion does NOT follow?",
    choices: [
      {
        id: "a",
        text: "Protection does not depend on the allegation turning out to be correct.",
      },
      {
        id: "b",
        text: "An employee who reports in good faith and is then demoted has something to claim.",
      },
      { id: "c", text: "Reporting is now without cost to the employee." },
      {
        id: "d",
        text: "The company has bound itself to a standard somebody outside it could apply.",
      },
    ],
    answerId: "c",
    explanation:
      "A remedy is what you get after the harm, through a process that costs time, money and standing. Good faith rather than correctness is exactly what A says and is the provision's strength. The one that does not follow is that reporting is now free.",
  },
  {
    id: "anonymity",
    covers: "Anonymity is not reliability",
    fragment: "Reports may be submitted anonymously through a secure channel.",
    stem: "What does this most strongly imply?",
    choices: [
      {
        id: "a",
        text: "Anonymous reports are less reliable than named ones and should be weighted down.",
      },
      {
        id: "b",
        text: "One specific cost of reporting — being identified — is removed, and nothing follows about whether any report is true.",
      },
      {
        id: "c",
        text: "The verifier can always go back to the source for the detail corroboration needs.",
      },
      {
        id: "d",
        text: "The company cannot retaliate, because it cannot know who reported.",
      },
    ],
    answerId: "b",
    explanation:
      "Anonymity is a property of the channel, not of the claim. A treats it as evidence about truth, which is the error this fragment exists to catch; C is the opposite of what anonymity costs — following up is harder, not easier; D confuses one route of retaliation with all of them.",
  },
  {
    id: "threshold",
    covers: "A report is not an established violation",
    fragment:
      "A credible report may trigger further verification measures under defined procedures.",
    stem: "Which inference is justified?",
    choices: [
      {
        id: "a",
        text: "A report judged credible establishes that the violation occurred.",
      },
      {
        id: "b",
        text: "The regime treats a report as a reason to look, and not as a finding.",
      },
      {
        id: "c",
        text: "Reports judged not credible are discarded without record.",
      },
      {
        id: "d",
        text: "Verification measures may only be triggered by a report.",
      },
    ],
    answerId: "b",
    explanation:
      "The provision says what a report may start, not what it proves — that is the whole distinction. C and D read things into it that are not there: it is silent on what happens to other reports, and silent on what else may trigger a measure.",
  },
];

/**
 * No lead-in. It said the options were close and differed by one
 * institutional fact, which is a description of the difficulty rather than
 * part of the task — and knowing it in advance is half of finding it.
 */
