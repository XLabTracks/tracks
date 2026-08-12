/**
 * The 0.3 document packet's five tasks, with reveal-on-submission keys.
 *
 * WHERE THIS COMES FROM. The tasks are the course owner's condensed
 * assignment, verbatim from her packet delivery (2026-08-12): Task 5
 * compulsory plus any two of Tasks 1–4, word limits hers. They lived briefly
 * as prose in precedents.mdx; they moved here unchanged when she asked for
 * reveal-upon-submission keys ("Did you do reveal upon submission keys with
 * examples of answers from baker's paper").
 *
 * THE KEYS ARE BAKER'S OWN WORDS (arXiv:2304.04123v1, CC BY 4.0), never
 * marking: each key shows what Baker says on the same ground, and where he
 * does not settle a task the caveat says so instead of issuing a verdict.
 * Labels over passages are ours, set in our own voice so they can never be
 * read as part of the quotation. Citation-bracket markers ([51] etc.) and
 * footnote numerals are dropped from quotes; nothing else is touched.
 *
 * CHECKING A QUOTE. Taken from the converted paper, not retyped:
 *
 *   npm run arxiv:build -- --id 2304.04123v1
 *   npm run arxiv:build -- --blocks 2304.04123v1 --section <toc-id>
 *
 * The artifact is deliberately NOT committed — Baker is a link-out reading,
 * not a Paper item, and an artifact no page reads is an orphan.
 *
 * Shared quote objects (the §6.1 narrowing, the §4.4 hedge, the Appendix A
 * differences) live in nuclear-disanalysis.ts and are imported, so the two
 * files can never drift on the same passage.
 */

import {
  BAKER_DIFFERENCES,
  BAKER_QUALIFIED_OPTIMISM,
  BAKER_RECORD_HEDGE,
  type DisanalysisQuote,
} from "./nuclear-disanalysis";

export { BAKER } from "./nuclear-disanalysis";

/** One structural piece of a task body, in her order. */
export type TaskPart =
  | { kind: "p"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "ul" | "ol"; items: string[] };

export interface PacketTask {
  id: string;
  /** Her number. The rule "Task 5 and any two of Tasks 1–4" reads off it. */
  n: number;
  title: string;
  compulsory?: boolean;
  parts: TaskPart[];
  /** Her word ceiling — guidance, never a gate. */
  maxWords: number;
  /** Ours, above the key — never a verdict on the answer. */
  keyLead: string;
  key: DisanalysisQuote[];
  /** Said after the quotes where the paper does not settle the task. */
  caveat?: string;
}

/* ---------------- keys quoted for this packet ---------------- */

const BAKER_TRACK_RECORD: DisanalysisQuote = {
  what: "§4.1 NPT M&V systems’ Track Records",
  blocks: [
    {
      label: "What CSA safeguards did verify, on the record",
      text: "Although dozens of states now have nuclear facilities and CSAs began to be implemented about 50 years ago, no state has attempted to divert a significant quantity of nuclear material from a facility that was under CSA safeguards.",
    },
    {
      label: "And what they were never built to see",
      text: "However, the IAEA’s track record is far from perfect; CSA safeguards not complemented by APs repeatedly missed states’ construction of secret nuclear facilities (which they were not designed to detect).",
    },
    {
      text: "Iran, Iraq, Libya, and Syria all pursued nuclear weapons by building secret nuclear facilities while under CSAs, but CSA safeguards were not enough for the IAEA to notice.",
    },
  ],
};

const BAKER_CHIP_SUBPROBLEMS: DisanalysisQuote = {
  what: "Appendix G.2, Background treaty obligations and verification goals",
  blocks: [
    {
      label: "The same division of labour, arrived at independently",
      text: "This appendix assumes that the main types of violations this system is aiming to detect are: the possession of many cutting-edge AI chips at undeclared locations, and the possession of many cutting-edge AI chips that lack required design features. The problem of detecting these violations can be broken down into the following two subproblems:",
    },
    {
      text: "Verify that there are not many cutting-edge AI chips being used at undeclared locations; and",
    },
    {
      text: "Verify that, of the cutting-edge AI chips at reported locations, not many lack required design features.",
    },
  ],
};

const BAKER_SCOPE_ONLY: DisanalysisQuote = {
  what: "§6.1 Qualified optimism",
  blocks: [
    {
      label: "What no chip-side instrument covers",
      text: "Chip-based approaches to verification cannot address all important risks from AI. Still, chip-based verification may be unusually promising specifically in the context of highly compute-intensive AI development, as other drivers of AI advances—algorithms and data—are harder to track.",
    },
  ],
};

const BAKER_CSA_GAP: DisanalysisQuote = {
  what: "§5.2 Why Comprehensive Safeguards Agreements were not designed to detect secret nuclear facilities",
  blocks: [
    {
      label: "The gap, named",
      text: "Perhaps the biggest failure in nuclear M&V has been one discussed above: that CSAs were not designed to detect secret nuclear facilities. Seemingly emboldened and enabled by this, a handful of NPT non-nuclear-weapon states ran secret nuclear weapons programs while under CSAs, and usually they (especially the most advanced programs) relied on secret nuclear facilities.",
    },
  ],
};

const BAKER_UNDECLARED_LIMITS: DisanalysisQuote = {
  what: "Appendix D, The IAEA’s inability to verify the absence of undeclared nuclear facilities under Comprehensive Safeguards Agreements",
  blocks: [
    {
      text: "Overall, CSAs give the IAEA very limited abilities to verify the absence of undeclared nuclear facilities.",
    },
    {
      label: "Why wider authority alone would not have closed it",
      text: "Officially, under CSAs, the IAEA may make special inspections (potentially at locations that host undeclared facilities) if it considers other sources of evidence insufficient for verifying compliance. However, in practice, the IAEA has a restrictively high bar for conducting special inspections: special inspections are widely considered appropriate only when the IAEA already has credible evidence of a safeguards violation. In line with this, the IAEA rarely conducts special inspections.",
    },
  ],
};

/** Appendix A's "unclear whether similarity or difference" pair, alone —
 * Task 3's conditions live exactly in that uncertainty. */
const BAKER_UNSETTLED_FACTORS: DisanalysisQuote = {
  what: "Appendix A, The nuclear-AI analogy",
  blocks: [BAKER_DIFFERENCES.blocks[1]!],
};

/* ---------------- the tasks ---------------- */

export const PACKET_TASKS: PacketTask[] = [
  {
    id: "t1",
    n: 1,
    title: "Object and purpose",
    parts: [
      {
        kind: "p",
        text: "Document 1 refers to nuclear material, nuclear activities, and nuclear weapons.",
      },
      { kind: "p", text: "Identify:" },
      {
        kind: "ol",
        items: [
          "the immediate object to which comprehensive safeguards are applied;",
          "the obligation accepted by the state;",
          "the broader outcome that safeguards are intended to prevent.",
        ],
      },
      {
        kind: "p",
        text: "Then explain why the following conclusion is broader than the text permits:",
      },
      {
        kind: "quote",
        text: "IAEA safeguards verify that a state has no nuclear-weapons programme.",
      },
    ],
    maxWords: 150,
    keyLead:
      "The key is Baker’s record of the same distinction — what CSA safeguards verified, and what they were never designed to see.",
    key: [BAKER_TRACK_RECORD],
    caveat:
      "The record is the key, not a marking: which words carry the object and which the outcome is yours to defend.",
  },
  {
    id: "t2",
    n: 2,
    title: "The problem solved by each instrument",
    parts: [
      { kind: "p", text: "Document 2 proposes three components:" },
      {
        kind: "ul",
        items: ["chip-level logging;", "training transcripts;", "supply-chain monitoring."],
      },
      {
        kind: "p",
        text: "For each component, identify the problem it solves. Then explain why removing any one component would create a distinct route for evasion.",
      },
      {
        kind: "p",
        text: "Your answer should show the division of labour among the three instruments, rather than merely describe how each instrument operates.",
      },
    ],
    maxWords: 180,
    keyLead:
      "Held against your answer: Baker decomposing detection for his own chip-accounting regime, and naming what stays outside any chip-side instrument.",
    key: [BAKER_CHIP_SUBPROBLEMS, BAKER_SCOPE_ONLY],
    caveat:
      "Baker is decomposing his own hypothetical regime, not Shavit’s — the division of labour among Document 2’s three components is Document 2’s to state. The key shows the same coverage-versus-integrity split arrived at independently; it does not grade your mapping.",
  },
  {
    id: "t3",
    n: 3,
    title: "Conditions of assurance",
    parts: [
      {
        kind: "p",
        text: "Identify three conditions that must hold for Shavit’s system to provide credible assurance:",
      },
      {
        kind: "ul",
        items: [
          "one concerning the technical structure of advanced AI development;",
          "one concerning the chip supply chain;",
          "one concerning the powers or capabilities of the verifier.",
        ],
      },
      { kind: "p", text: "For each condition:" },
      {
        kind: "ol",
        items: [
          "state whether it is explicit in Document 2 or inferred from the proposed mechanism;",
          "explain what conclusion would cease to be justified if the condition failed.",
        ],
      },
    ],
    maxWords: 180,
    keyLead: "Baker’s own conditions, stated and hedged.",
    key: [BAKER_QUALIFIED_OPTIMISM, BAKER_UNSETTLED_FACTORS, BAKER_RECORD_HEDGE],
    caveat:
      "Baker states conditions for his own conclusion; which of yours are explicit in Shavit and which are implied is Document 2’s question, and the key does not settle it.",
  },
  {
    id: "t4",
    n: 4,
    title: "A regime that works and fails",
    parts: [
      {
        kind: "p",
        text: "Document 3 describes clandestine nuclear activities that remained undetected while routine safeguards continued at declared facilities.",
      },
      {
        kind: "p",
        text: "Explain how the safeguards system could be operating as designed and nevertheless fail in this case.",
      },
      { kind: "p", text: "In your answer, distinguish among:" },
      {
        kind: "ul",
        items: [
          "failure to verify declared activity correctly;",
          "failure to identify an undeclared object;",
          "failure to possess or act upon information indicating where to investigate.",
        ],
      },
      {
        kind: "p",
        text: "Which of these best characterises the Iraq case, and why?",
      },
    ],
    maxWords: 180,
    keyLead: "Baker on the same failure, from the design side.",
    key: [BAKER_CSA_GAP, BAKER_UNDECLARED_LIMITS],
    caveat:
      "Baker’s explanation is institutional where Carlson’s is operational. If your diagnosis used a different one of the three categories, compare it against both accounts rather than treating either as the verdict.",
  },
  {
    id: "t5",
    n: 5,
    title: "Disanalysis",
    compulsory: true,
    parts: [
      { kind: "p", text: "A policy team reaches the following conclusion:" },
      {
        kind: "quote",
        text: "Because advanced AI training depends on specialised chips, a regime of chip registration, logging, and inspection can verify that no prohibited AI development is occurring.",
      },
      { kind: "p", text: "Evaluate this conclusion using all three documents." },
      { kind: "p", text: "Your answer must:" },
      {
        kind: "ol",
        items: [
          "identify the strongest valid parallel between nuclear safeguards and the proposed AI regime;",
          "identify the step in the argument placed under greatest pressure by the Iraq case;",
          "explain why that problem cannot be solved merely by inspecting registered chips more frequently;",
          "replace the original conclusion with a narrower claim that the evidence supports.",
        ],
      },
    ],
    maxWords: 220,
    keyLead:
      "What Baker does with the same problem: he neither ignores it nor treats it as fatal — he narrows the claim until the evidence can carry it, and says what would have to be built.",
    key: [BAKER_DIFFERENCES, BAKER_QUALIFIED_OPTIMISM],
    caveat:
      "Narrowing a claim until the evidence carries it is one legitimate answer to a disanalogy, and abandoning the claim is another. Which yours needs is the judgement this task is asking for.",
  },
];
