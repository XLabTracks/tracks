/**
 * 0.3's disanalysis task: draw the nuclear→AI inference yourself, then read
 * Baker's own version of it.
 *
 * WHERE THIS COMES FROM. The prompts are the course owner's, from the design
 * thread — her numbered task ("1. Draw the inference") and her scope task
 * ("Baker says yes, manageable — for chips. Find what the scope excluded…").
 * The keys are Mauricio Baker's own words, quoted from the paper. Nothing in
 * this file is an invented claim about either domain, and nothing should
 * become one: if a passage does not answer a move, the honest key says the
 * paper does not answer it.
 *
 * WHY THE KEYS ARE QUOTES AND NOT MARKING. The thread settled the ordering —
 * "these land *after* the attempt, as answer key" — and settled the register:
 * "All argument, no taxonomy." So each move reveals the passage that bears on
 * it rather than a verdict on the learner's answer. Move 3 is the sharp case
 * and its key says so out loud: Baker lists the differences and declines to
 * rank them, so "which one defeats the argument" is the learner's judgement
 * and cannot be graded against him.
 *
 * TWO JUDGEMENT CALLS, marked so they can be overruled cheaply:
 *  - Her task names three moves in one paragraph; they are three commits here,
 *    because one textarea for three moves reveals as a wall and cannot key
 *    each move to its passage. Her paragraph is still printed whole, above.
 *  - The tail of her third sentence was cut off in the thread capture at
 *    "…capable of defeating"; it is reconstructed as "defeating the argument,
 *    rather than merely making implementation more difficult" from the visible
 *    fragment. Marked RECONSTRUCTED below.
 *
 * REPRODUCTION. arXiv:2304.04123v1 is CC BY 4.0 — quotation with attribution
 * is what the licence is for, and every quote here carries the section it came
 * from and links out.
 *
 * CHECKING A QUOTE. These were taken from the converted paper, not retyped
 * from memory. Rebuild that copy and read the section against this file:
 *
 *   npm run arxiv:build -- --id 2304.04123v1
 *   npm run arxiv:build -- --toc 2304.04123v1
 *
 * The artifact is deliberately NOT committed: Baker is a link-out reading in
 * 0.2, not a Paper item in the graph, and an artifact no page reads is an
 * orphan the next full build would not regenerate. Making him a full paper is
 * a content decision, and this exercise does not need it.
 */

export const BAKER = {
  title: "Nuclear Arms Control Verification and Lessons for AI Treaties",
  author: "Mauricio Baker",
  year: "2023",
  href: "https://arxiv.org/abs/2304.04123",
  /** Quoted under the paper's own licence. Stated because it is why we may. */
  licence: "CC BY 4.0",
} as const;

/**
 * One of Baker's sections, reproduced as a key.
 *
 * A card is a SECTION, not a passage: three passages out of §6.1 printed as
 * three cards repeat the paper's title three times down the column and read as
 * three sources. So a card carries the section once and the passages sit
 * inside it, each labelled with what it is doing there.
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

export interface DisanalysisMove {
  id: string;
  n: number;
  /** The move, in her words. */
  q: string;
  /** What a committed answer has to contain, if she said. */
  hint?: string;
  minLen: number;
  /** Shown above the quotes — never a verdict on the answer. */
  lead: string;
  quotes: DisanalysisQuote[];
  /** Said after the quotes where the paper does not settle the move. */
  caveat?: string;
}

/** Her task, printed whole above the moves. The moves are its own sentences. */
export const TASK = {
  title: "Draw the inference",
  preamble:
    "You have now examined how verification worked in nuclear arms control.",
  claim:
    "The nuclear record gives us reason to expect that ambitious verification of advanced AI could also be made workable.",
  claimLead: "Suppose someone claims:",
} as const;

export const MOVES: DisanalysisMove[] = [
  {
    id: "strongest",
    n: 1,
    q: "Construct the strongest version of this argument.",
    hint: "Steelman it. The weak version is easy to knock down and teaches nothing.",
    minLen: 180,
    lead: "Baker argues a version of it himself — and note how much of the sentence is spent narrowing the claim before it is made.",
    quotes: [
      {
        what: "§6.1 Qualified optimism",
        blocks: [
          {
            label: "The conclusion",
            text: "This section primarily argues for the following conclusion: with certain preparations, the foreseeable challenges of one potential form of AI treaty verification (specifically, hardware-based verification of treaties setting rules on highly compute-intensive AI development) would mostly be challenges that were successfully addressed in nuclear arms control.",
          },
          {
            label: "The two preparations it rests on",
            points: [
              {
                term: "Methods",
                text: "Developing privacy-preserving, secure, and acceptably priced methods for verifying the compliance of hardware, given inspection access; and",
              },
              {
                term: "A system that can grow",
                text: "Establishing an initial, incomplete verification system that is relatively easy to improve when opportunities arise, because it has flexible authorities and scalable precedents.",
              },
            ],
          },
          {
            label: "What “manageable” is doing in that sentence",
            text: "Substantial preparations would reduce each of these challenges to a difficulty that was manageable in the nuclear case (that is, some nuclear arms control M&V system faced a similar or greater difficulty, yet the system was adopted and had a strong track record).",
          },
        ],
      },
    ],
  },
  {
    id: "depends-on",
    n: 2,
    q: "What feature of the nuclear case does the inference depend on? What would have to be sufficiently similar in the case of AI for the inference to go through?",
    minLen: 180,
    lead: "Appendix A is the analogy stated plainly. These are the similarities Baker claims — the load the inference is carrying.",
    quotes: [
      {
        what: "Appendix A, The nuclear-AI analogy",
        blocks: [
          {
            lead:
              "“M&V systems for AI would face some similar challenges as (some) M&V systems for nuclear arms control, including:”",
            points: [
              {
                term: "Dual-use equipment and facilities",
                text: "Much of the equipment and facilities that could be used to violate an agreement can also be used for legitimate purposes, so M&V must be able to catch late-stage misuse of relevant equipment and facilities.",
              },
              {
                term: "Sensitive information",
                text: "Dual-use equipment and facilities involve sensitive information even if they are being used in compliance with the treaty.",
              },
              {
                term: "Regulation of both government and corporate activity",
                text: "Governments and businesses perform activities that (may) need restrictions for effective M&V.",
              },
              {
                term: "Bilateral or multilateral negotiations",
                text: "Treaty scope is not necessarily limited to either just bilateral or just multilateral treaties.",
              },
              {
                term: "Need for high robustness",
                text: "States might come to see defection as highly valuable, so a reliable M&V system might need to be robust against major state efforts to hide violations.",
              },
              {
                term: "Accounting",
                text: "Verified accounting (of uranium in one case, and of high-end, AI-specialized chips in the other case) can help with treaty verification.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "defeater",
    n: 3,
    // RECONSTRUCTED tail — see the file header. The thread capture cuts after
    // "capable of defeating"; the fragment visible below it reads "…ment,
    // rather than merely making implementation more difficult."
    q: "Now identify one difference between the two domains that would be capable of defeating the argument, rather than merely making implementation more difficult.",
    hint: "A defeater breaks the inference. A cost, a delay or an engineering problem does not — say which yours is and why.",
    minLen: 200,
    lead: "Baker's own list of differences, from the same appendix. Read it against what you just wrote — and note what he does with the last two.",
    quotes: [
      {
        what: "Appendix A, The nuclear-AI analogy",
        blocks: [
          {
            lead:
              "“However, there are also major differences between these verification challenges, including:”",
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
            lead:
              "“it is not clear whether certain other factors are similarities or differences, including:”",
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
      },
    ],
    caveat:
      "Baker lists these and does not rank them. He nowhere says which difference, if any, defeats the inference — two of them he declines to classify at all. So there is no key to this move and your answer is not being marked against him: what the list gives you is the field of candidates and the standard of evidence he holds himself to.",
  },
  {
    id: "scope",
    n: 4,
    q: "Baker says yes, manageable — for chips. Find what the scope excluded, then argue whether the excluded part is where the risk actually lives.",
    hint: "Quote the scope restriction before you argue with it.",
    minLen: 200,
    lead: "He draws the boundary himself, in the same section that makes the claim.",
    quotes: [
      {
        what: "§6.1 Qualified optimism",
        blocks: [
          {
            text: "Chip-based approaches to verification cannot address all important risks from AI. Still, chip-based verification may be unusually promising specifically in the context of highly compute-intensive AI development, as other drivers of AI advances—algorithms and data—are harder to track.",
          },
        ],
      },
      {
        what: "§4.4 Limitations",
        blocks: [
          {
            label:
              "His hedge on the nuclear track record the inference reads from",
            text: "The public would not know about any nuclear weapons development activities that were sufficiently well-kept secrets.",
          },
        ],
      },
    ],
    caveat:
      "Whether the excluded part is where the risk lives is the argument you were asked to make. The paper does not make it.",
  },
];

/** Her reading map: eight pages of forty-four, and why each. Shown after the
 *  attempt, because that is the ordering the thread settled on. */
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
