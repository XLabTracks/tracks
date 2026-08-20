
export const BAKER = {
  title: "Nuclear Arms Control Verification and Lessons for AI Treaties",
  author: "Mauricio Baker",
  year: "2023",
  href: "https://arxiv.org/abs/2304.04123",
  licence: "CC BY 4.0",
} as const;

export interface DisanalysisQuote {
  what: string;
  blocks: DisanalysisBlock[];
}

export interface DisanalysisBlock {
  label?: string;
  lead?: string;
  text?: string;
  points?: { term: string; text: string }[];
}

export interface QuestionChoice {
  prompt: string;
  options: { id: string; label: string; hint?: string }[];
}

export interface DisanalysisQuestion {
  id: string;
  n: number;
  title: string;
  ask: string;
  body: string[];
  choice?: QuestionChoice;
  revealLead?: string;
  reveal?: DisanalysisQuote[];
  caveat?: string;
}

export const CLAIM = {
  lead: "Suppose someone claims:",
  text: "The nuclear record gives us reason to expect that ambitious verification of advanced AI could also be made workable.",
} as const;

export const BAKER_DIFFERENCES: DisanalysisQuote = {
  what: "Appendix A, The nuclear-AI analogy",
  blocks: [
    {
      lead: "“However, there are also major differences between these verification challenges, including:”",
      points: [
        {
          term: "Degree of perceived risk",
          text: "Nuclear arms control M&V was negotiated after clear demonstrations of the risks posed by nuclear weapons, while some potential AI risks are currently more speculative.",
        },
        {
          term: "Efficacy of environmental sampling",
          text: "The use of centrifuges to produce weapons-grade uranium scatters unique particles that can be detected from some distance; there are no obvious analogues for AI.",
        },
        {
          term: "Verification of information technology use",
          text: "M&V for AI may need to be able to catch certain defections just based on (limited) access to source code, AI hardware, and/or ML models. Nuclear arms control M&V has not had to do that; it offers no obvious analogues to software or hardware-centered verification.",
        },
        {
          term: "Supply chain concentration",
          text: "The supply chain of high-end computer chips is highly concentrated, while uranium sources, their processing equipment, and nuclear facilities are relatively decentralized. Still, in both cases, there are challenging steps in the supply chain.",
        },
      ],
    },
    {
      lead: "“it is not clear whether certain other factors are similarities or differences, including:”",
      points: [
        {
          term: "Scale of verification activities needed",
          text: "The amount and scope of infrastructure and equipment that need to be inspected for nuclear arms control is low enough for verification to be considered affordable; it is unclear if the same will be true for AI.",
        },
        {
          term: "Amount of sensitive information needed to verify compliance",
          text: "Nuclear arms control agreements are verified without inspectors getting access to much of the valuable R&D information involved (i.e. R&D of centrifuges, missiles, and bombers); it is unclear whether similarly IP-protecting M&V will be feasible for AI.",
        },
      ],
    },
  ],
};

export const BAKER_QUALIFIED_OPTIMISM: DisanalysisQuote = {
  what: "§6.1 Qualified optimism",
  blocks: [
    {
      label: "The conclusion, and how much of it is spent narrowing",
      text: "This section primarily argues for the following conclusion: with certain preparations, the foreseeable challenges of one potential form of AI treaty verification (specifically, hardware-based verification of treaties setting rules on highly compute-intensive AI development) would mostly be challenges that were successfully addressed in nuclear arms control.",
    },
    {
      label: "What the scope leaves out, in his own words",
      text: "Chip-based approaches to verification cannot address all important risks from AI. Still, chip-based verification may be unusually promising specifically in the context of highly compute-intensive AI development, as other drivers of AI advances—algorithms and data—are harder to track.",
    },
    {
      label: "What “manageable” is doing in that sentence",
      text: "Substantial preparations would reduce each of these challenges to a difficulty that was manageable in the nuclear case (that is, some nuclear arms control M&V system faced a similar or greater difficulty, yet the system was adopted and had a strong track record).",
    },
  ],
};

export const BAKER_RECORD_HEDGE: DisanalysisQuote = {
  what: "§4.4 Limitations",
  blocks: [
    {
      label: "His hedge on the record the whole inference reads from",
      text: "The public would not know about any nuclear weapons development activities that were sufficiently well-kept secrets.",
    },
  ],
};

export interface DisanalogyCard {
  id: string;
  label: string;
  what: string;
  text: string;
}

export const CARD_CANDIDATES: DisanalogyCard[] = [
  {
    id: "it-use",
    label: "AI may require verification of information-technology use with no obvious nuclear counterpart",
    what: "Appendix A — “Verification of information technology use”",
    text: "M&V for AI may need to be able to catch certain defections just based on (limited) access to source code, AI hardware, and/or ML models. Nuclear arms control M&V has not had to do that; it offers no obvious analogues to software or hardware-centered verification.",
  },
  {
    id: "salience",
    label: "the political salience of AI risk may be lower",
    what: "Appendix A — “Degree of perceived risk”",
    text: "Nuclear arms control M&V was negotiated after clear demonstrations of the risks posed by nuclear weapons, while some potential AI risks are currently more speculative.",
  },
  {
    id: "supply-chain",
    label: "relevant supply chains differ substantially",
    what: "Appendix A — “Supply chain concentration”",
    text: "The supply chain of high-end computer chips is highly concentrated, while uranium sources, their processing equipment, and nuclear facilities are relatively decentralized. Still, in both cases, there are challenging steps in the supply chain.",
  },
  {
    id: "sensitive-info",
    label: "it is uncertain whether verification can protect the amount of sensitive information involved in AI",
    what: "Appendix A — “Amount of sensitive information needed to verify compliance”",
    text: "Nuclear arms control agreements are verified without inspectors getting access to much of the valuable R&D information involved (i.e. R&D of centrifuges, missiles, and bombers); it is unclear whether similarly IP-protecting M&V will be feasible for AI.",
  },
];

export const DEALT_CARD = CARD_CANDIDATES[0]!;

export const READ_NOTE =
  "Baker’s actual conclusion is deliberately qualified: with certain preparations, he argues that foreseeable challenges to a particular form of hardware-based AI verification could be reduced to difficulties that nuclear verification systems successfully managed.";

export interface ReadingRow {
  where: string;
  what: string;
  why: string;
}

export const READING_MAP: ReadingRow[] = [
  {
    where: "pp. 2–3",
    what: "Summary + the scope restriction",
    why: "The claim, and its fine print. The scope sentence is the whole exercise.",
  },
  {
    where: "§6.1, pp. 22–23",
    what: "“Qualified optimism”",
    why: "The thesis under attack.",
  },
  {
    where: "§4.4, p. 19",
    what: "“Limitations”",
    why: "His own hedges. Anyone who read only the thesis is catchable here.",
  },
  {
    where: "§5.2, p. 21",
    what: "“Why Comprehensive Safeguards Agreements were not designed to detect secret nuclear facilities”",
    why: "The Iraq / declaration-dependence gap.",
  },
  {
    where: "§5.3, p. 22",
    what: "“The impact of salient failure”",
    why: "Why regimes only change after a visible failure — the answer to “why isn’t AI verification built yet”.",
  },
  {
    where: "App. A, p. 31",
    what: "“The nuclear-AI analogy”",
    why: "One page, the analogy stated plainly. The object of study.",
  },
];

export const QUESTIONS: DisanalysisQuestion[] = [
  {
    id: "q1",
    n: 1,
    title: "Draw the inference",
    ask: "Construct the strongest version of this argument.",
    body: [
      "What feature of the nuclear case does the inference depend on? What would have to be sufficiently similar in the case of AI for the inference to go through?",
      "Then identify one difference between the two domains that would be capable of defeating your argument, rather than merely making implementation more difficult.",
    ],
  },
  {
    id: "q2",
    n: 2,
    title: "Compare the arguments",
    ask: "Where does his inference rest on the same logic as yours, and where does it rest on a different one?",
    body: [
      "Baker and you are reasoning from the same historical record.",
      "Identify the step in Baker’s argument that does the most work in carrying evidence from nuclear verification to AI verification. Then say what kind of step it is, and defend your classification.",
    ],
    choice: {
      prompt: "The step that does the most work is:",
      options: [
        { id: "historical", label: "a historical inference" },
        { id: "analogy", label: "an analogy" },
        { id: "precedent", label: "an argument from precedent" },
        { id: "combination", label: "some combination of the three" },
      ],
    },
    revealLead:
      "Held or not? Here is one disanalogy — Baker himself gives good candidates, and these are his.",
    reveal: [BAKER_DIFFERENCES],
    caveat:
      "He lists these and does not rank them; two of them he declines to classify as similarity or difference at all. There is no key to which one matters most, and your answer is not being marked against him.",
  },
  {
    id: "q3",
    n: 3,
    title: "Does the inference survive?",
    ask: "Does your conclusion still follow?",
    body: [
      "A strong answer will distinguish three possibilities: the difference is irrelevant to the mechanism on which the analogy rests; it limits the scope of the conclusion without defeating it; or it breaks the inference, because a condition that made the nuclear precedent informative is absent in AI.",
      "You may revise your original conclusion. A revision is not a concession: the question is whether you can identify exactly what the new information changes.",
    ],
    choice: {
      prompt: "Against your Question 1 argument, this difference:",
      options: [
        {
          id: "irrelevant",
          label: "is irrelevant",
          hint: "to the mechanism on which the analogy rests",
        },
        {
          id: "limits",
          label: "limits the scope",
          hint: "of the conclusion, without defeating it",
        },
        {
          id: "breaks",
          label: "breaks the inference",
          hint: "a condition that made the nuclear precedent informative is absent in AI",
        },
      ],
    },
    revealLead:
      "What Baker does with the same problem: he neither ignores it nor treats it as fatal — he narrows the claim until the evidence can carry it, and says what would have to be built.",
    reveal: [BAKER_QUALIFIED_OPTIMISM, BAKER_RECORD_HEDGE],
    caveat:
      "Narrowing a claim until the evidence carries it is one legitimate answer to a disanalogy, and abandoning the claim is another. Which yours needs is the judgement this question is asking for.",
  },
];
