/**
 * 0.3's disanalysis task: draw the nuclear→AI inference, read Baker, then find
 * out whether your inference survives a fact you did not have.
 *
 * WHERE THIS COMES FROM. The three questions are the course owner's,
 * transcribed from the design thread: "Before Baker — 1. Draw the inference",
 * the "Read" note, "After Baker — 2. Compare the arguments" with its
 * classification and its "Held or not?", and "3. Does the inference survive?"
 * with its three possibilities. Her numbering is load-bearing — Question 3
 * says "Return to the argument you made in Question 1" — so `n` is her number.
 *
 * THE SHAPE WAS RESHAPED ON HER INSTRUCTION (2026-08-12): the read comes
 * FIRST and the three tasks sit on it, ungated — no commits, no minimum
 * lengths, no locked steps. "It's not a test, it's reasoning." The old
 * preamble ("You have now examined how verification worked in nuclear arms
 * control") was cut on the same instruction — the eight case files are quick
 * hold-or-fail calls across every regime, not an examination of nuclear
 * verification; the examination is Baker, which is why he is read before
 * anything is asked.
 *
 * THE KEYS ARE BAKER'S OWN WORDS, never marking. Where the paper does not
 * settle a move, the reveal says so: he lists the differences and declines to
 * rank them, so "does it survive" cannot be graded against him.
 *
 * THE DISANALOGY CARD IS A SLOT SHE LEFT OPEN. Her Q3 reads "Consider the
 * following fact: [DISANALOGY CARD]" — the card is named and not written. What
 * is here is one of the four candidates SHE names in Q2 ("Baker himself gives
 * good candidates: …"), quoted from Baker rather than composed, so the slot is
 * filled with something authored rather than left blank or invented. All four
 * of her candidates are in CARD_CANDIDATES; swapping which one is dealt is a
 * one-line edit, and writing a different card is hers to do.
 *
 * REPRODUCTION. arXiv:2304.04123v1 is CC BY 4.0 — quotation with attribution
 * is what the licence is for, and every quote carries the section it came from
 * and links out.
 *
 * CHECKING A QUOTE. These were taken from the converted paper, not retyped
 * from memory. Rebuild that copy and read the section against this file:
 *
 *   npm run arxiv:build -- --id 2304.04123v1
 *   npm run arxiv:build -- --toc 2304.04123v1
 *
 * The artifact is deliberately NOT committed: Baker is a link-out reading in
 * 0.2, not a Paper item in the graph, and an artifact no page reads is an
 * orphan the next full build would not regenerate.
 */

export const BAKER = {
  title: "Nuclear Arms Control Verification and Lessons for AI Treaties",
  author: "Mauricio Baker",
  year: "2023",
  href: "https://arxiv.org/abs/2304.04123",
  /** Quoted under the paper's own licence. Stated because it is why we may. */
  licence: "CC BY 4.0",
} as const;

/* ---------------- quotes ---------------- */

/**
 * One of Baker's sections, reproduced.
 *
 * A card is a SECTION, not a passage: three passages out of §6.1 printed as
 * three cards repeat the paper's title three times down the column and read as
 * three sources. So a card carries the section once and the passages sit
 * inside it.
 */
export interface DisanalysisQuote {
  /** Section as the paper numbers it — "§6.1 Qualified optimism". */
  what: string;
  blocks: DisanalysisBlock[];
}

export interface DisanalysisBlock {
  /**
   * Ours, not his — why this passage is in front of you. Set in our own voice
   * so it can never be read as part of the passage under it.
   */
  label?: string;
  /**
   * HIS, verbatim — the sentence that opens one of his lists ("However, there
   * are also major differences…"). It is his prose, so it is set as prose:
   * putting it through the label's uppercase would be editing a quotation to
   * fit a style. Use this OR `label`, never both on one block.
   */
  lead?: string;
  /** Running passage, verbatim. */
  text?: string;
  /** A verbatim list where the paper gives one (Appendix A is three lists). */
  points?: { term: string; text: string }[];
}

/* ---------------- the questions ---------------- */

/** A choice the question makes the learner commit to before defending it. */
export interface QuestionChoice {
  /** Ours: what the pick is asking. */
  prompt: string;
  options: { id: string; label: string; hint?: string }[];
}

export interface DisanalysisQuestion {
  id: string;
  /** HER number. Question 3 refers back to Question 1 by it. */
  n: number;
  title: string;
  /** Her question, paragraph by paragraph. The emphasised line comes first. */
  ask: string;
  body: string[];
  /** Possibilities to reason between — rendered as words, never as buttons. */
  choice?: QuestionChoice;
  /** Ours, above the reveal — never a verdict on the answer. */
  revealLead?: string;
  reveal?: DisanalysisQuote[];
  /** Said after the quotes where the paper does not settle the question. */
  caveat?: string;
}

export const CLAIM = {
  lead: "Suppose someone claims:",
  text: "The nuclear record gives us reason to expect that ambitious verification of advanced AI could also be made workable.",
} as const;

/** Baker's four differences, quoted. Q2's reveal, and where the card comes from. */
const BAKER_DIFFERENCES: DisanalysisQuote = {
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

/* ---------------- the disanalogy card ---------------- */

export interface DisanalogyCard {
  id: string;
  /** Her shorthand for the candidate, from Q2. */
  label: string;
  /** Baker's section it is quoted from. */
  what: string;
  text: string;
}

/**
 * The four candidates she names in Q2, in her order, each in Baker's words.
 * `DEALT_CARD` is which one Q3 puts in front of the learner.
 */
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

/** Which candidate Q3 deals. Her call to change; one line. */
export const DEALT_CARD = CARD_CANDIDATES[0]!;

/* ---------------- the read, between Q1 and Q2 ---------------- */

/** Her Read note. What Baker actually concluded, before they compare. */
export const READ_NOTE =
  "Baker’s actual conclusion is deliberately qualified: with certain preparations, he argues that foreseeable challenges to a particular form of hardware-based AI verification could be reduced to difficulties that nuclear verification systems successfully managed.";

/** Her reading map: eight pages of forty-four, and why each. */
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

/* ---------------- the three questions ---------------- */

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
    // No reveal. The key to Q1 is Baker, who has just been read.
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
    reveal: [
      {
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
      },
      {
        what: "§4.4 Limitations",
        blocks: [
          {
            label: "His hedge on the record the whole inference reads from",
            text: "The public would not know about any nuclear weapons development activities that were sufficiently well-kept secrets.",
          },
        ],
      },
    ],
    caveat:
      "Narrowing a claim until the evidence carries it is one legitimate answer to a disanalogy, and abandoning the claim is another. Which yours needs is the judgement this question is asking for.",
  },
];
