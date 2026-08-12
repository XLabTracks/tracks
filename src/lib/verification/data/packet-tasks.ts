/**
 * The 0.3 document packet's five tasks, with reveal-on-submission keys.
 *
 * WHERE THIS COMES FROM. The tasks are the course owner's condensed
 * assignment, verbatim from her packet delivery (2026-08-12): Task 5
 * compulsory plus any two of Tasks 1–4, word limits hers. The keys are her
 * design too, delivered in a second pass with the titles below: each key is
 * a MODEL ANSWER (hers — written in Russian, rendered in English on her
 * instruction, "in eng obv") followed by a BAKER REVEAL whose cuts she
 * specified section by section. Task 2's reveal is deliberately only a
 * note: Baker supports persistent chip records and accountancy, but
 * training transcripts are Shavit's mechanism, and she asked that the
 * reveal say exactly that instead of stretching a quote.
 *
 * THE QUOTES ARE BAKER'S OWN WORDS (arXiv:2304.04123v1, CC BY 4.0),
 * section-cited and linked, never marking. Labels over passages are ours,
 * set in our own voice so they can never be read as part of the quotation.
 * Citation-bracket markers ([17] etc.) and footnote numerals are dropped
 * from quotes; nothing else is touched.
 *
 * CHECKING A QUOTE. Taken from the converted paper, not retyped:
 *
 *   npm run arxiv:build -- --id 2304.04123v1
 *   npm run arxiv:build -- --blocks 2304.04123v1 --section <toc-id>
 *
 * The artifact is deliberately NOT committed — Baker is a link-out reading,
 * not a Paper item, and an artifact no page reads is an orphan.
 *
 * Shared quote objects (the §6.1 narrowing and its scope sentence, the
 * Appendix A differences) live in nuclear-disanalysis.ts and are imported,
 * so the two files can never drift on a shared passage.
 */

import {
  BAKER_DIFFERENCES,
  BAKER_QUALIFIED_OPTIMISM,
  type DisanalysisQuote,
} from "./nuclear-disanalysis";

export { BAKER } from "./nuclear-disanalysis";

/** One structural piece of a task body or model answer, in her order. */
export type TaskPart =
  | { kind: "p"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "h"; text: string }
  | { kind: "ul" | "ol"; items: string[] }
  | { kind: "table"; head: string[]; rows: string[][] };

export interface PacketTask {
  id: string;
  /** Her number. The rule "Task 5 and any two of Tasks 1–4" reads off it. */
  n: number;
  title: string;
  compulsory?: boolean;
  parts: TaskPart[];
  /** Her word ceiling — guidance, never a gate. */
  maxWords: number;
  /** Her model answer, revealed on submission. */
  answer: TaskPart[];
  /** Baker's passages, per her cuts. Empty where Baker does not carry it. */
  baker: DisanalysisQuote[];
  /** Hers — printed after the quotes, or alone when there are none. */
  bakerNote?: string;
}

/* ---------------- Baker, cut for these keys ---------------- */

const BAKER_CSA_TEMPLATE: DisanalysisQuote = {
  what: "§3.2.1 IAEA safeguard systems",
  blocks: [
    {
      label: "The main line of the key",
      text: "Comprehensive Safeguards Agreements (”CSAs”): The IAEA negotiated a single template which it has used as the basis for all its agreements with NPT non-nuclear-weapon states. The resulting agreements are called CSAs. CSAs are intended to (just) verify the peaceful use of nuclear materials at known nuclear facilities, rather than also detecting secret nuclear facilities.",
    },
  ],
};

const BAKER_NUCLEAR_MATERIALS: DisanalysisQuote = {
  what: "§1.3 Nuclear materials",
  blocks: [
    {
      text: "The IAEA’s efforts to verify horizontal nonproliferation focus on tracking uranium and plutonium, certain forms of which can be made to undergo nuclear explosions. A major reason for this focus is that acquiring such weapon-usable nuclear material is the hardest step in making nuclear weapons; in contrast, nuclear bomb design and assembly are relatively simple. Additionally, uranium and plutonium are relatively rare materials and emit radiation, which makes them unusually easy to track.",
    },
  ],
};

const BAKER_UNDECLARED_TWO_STEPS: DisanalysisQuote = {
  what: "§3.2.3 IAEA verification of the absence of undeclared nuclear facilities",
  blocks: [
    { text: "We can break down the process of detecting undeclared facilities into two steps:" },
    {
      text: "Finding evidence suggesting that a state might have undeclared nuclear facilities (potentially at a specific location), and",
    },
    { text: "Resolving suspicions about suspected undeclared nuclear facilities." },
  ],
};

const BAKER_CSA_GAP_FULL: DisanalysisQuote = {
  what: "§5.2 Why Comprehensive Safeguards Agreements were not designed to detect secret nuclear facilities",
  blocks: [
    {
      text: "Perhaps the biggest failure in nuclear M&V has been one discussed above: that CSAs were not designed to detect secret nuclear facilities. Seemingly emboldened and enabled by this, a handful of NPT non-nuclear-weapon states ran secret nuclear weapons programs while under CSAs, and usually they (especially the most advanced programs) relied on secret nuclear facilities.",
    },
    {
      label: "The four fragile assumptions",
      text: "How did CSA negotiations come to leave such a massive gap in their M&V system? Experts propose the following explanations (though typically with little to no citation/evidence) for why CSAs had very limited capacity for detecting undeclared nuclear facilities: negotiators had tended to think that:",
    },
    {
      text: "Secret nuclear facilities would be detected and voluntarily reported on by national intelligence agencies;",
    },
    {
      text: "Establishing a self-contained nuclear fuel cycle would be too technically difficult for most states;",
    },
    {
      text: "Inspectors having far-reaching access to investigate potential violations was politically unacceptable; and",
    },
    { text: "There were no good available methods for the IAEA to detect undeclared facilities." },
    {
      text: "Considering this alongside the fact that later fixes (Additional Protocols) required ratification from each state party, it appears that the CSA M&V system has been highly flawed because negotiators made fragile assumptions, built insufficient flexibility into CSAs, and were insufficiently proactive in responding to changes in the risk landscape.",
    },
  ],
};

const BAKER_SALIENT_FAILURE: DisanalysisQuote = {
  what: "§5.3 The impact of salient failure",
  blocks: [
    {
      text: "Despite its initial weaknesses (discussed above), the IAEA’s safeguards system was substantially strengthened in response to a salient failure. This failure was Iraq’s nearly successful secret nuclear weapons program, which was discovered only through the U.S.-led coalition’s victory against Iraq in the First Gulf War.",
    },
    {
      text: "After finding in 1991 that Iraq nearly made nukes under IAEA inspectors’ noses (the secret program operated in buildings adjacent to declared facilities), states successfully pushed for the IAEA to expand its role to not just safeguarding declared nuclear facilities but also detecting secret nuclear facilities. The IAEA determined that its existing agreements gave it authorities it had not been using—such as requiring earlier provision of design information and doing environmental sampling—and it began using these authorities. Additionally, the IAEA developed and agreed with dozens of states on APs, which brought the IAEA greatly improved authorities for verifying the absence of undeclared nuclear facilities.",
    },
  ],
};

/** Her five Appendix A items — two similarities, three differences — with
 * Baker's own lead-ins kept over each list. */
const BAKER_ANALOGY_FIVE: DisanalysisQuote = {
  what: "Appendix A, The nuclear-AI analogy",
  blocks: [
    {
      lead: "“M&V systems for AI would face some similar challenges as (some) M&V systems for nuclear arms control, including:”",
      points: [
        {
          term: "Dual-use equipment and facilities",
          text: "Much of the equipment and facilities that could be used to violate an agreement can also be used for legitimate purposes, so M&V must be able to catch late-stage misuse of relevant equipment and facilities.",
        },
        {
          term: "Accounting",
          text: "Verified accounting (of uranium in one case, and of high-end, AI-specialized chips in the other case) can help with treaty verification.",
        },
      ],
    },
    {
      lead: "“However, there are also major differences between these verification challenges, including:”",
      points: [
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
  ],
};

const BAKER_COMMODITY_CHIPS: DisanalysisQuote = {
  what: "Executive Summary",
  blocks: [
    {
      label: "The scope condition, priced",
      text: "Back-of-the-envelope calculations (in an appendix) suggest that, if rules’ scope were highly compute-intensive AI development in data centers (meaning commodity chips would need to not offer loopholes), then direct costs of inspections (both the inspections’ funding and the disrupted economic activity) would be lower than or very roughly similar to those which states accepted for nonproliferation M&V.",
    },
  ],
};

const BAKER_ACCOUNTS_LINE: DisanalysisQuote = {
  what: "Appendix G.8, Assessment",
  blocks: [
    {
      text: "There are good reasons to tentatively consider the verification system described above highly reliable:",
    },
    {
      text: "It has at least 5 layers of defense for detecting any serious attempt to possess and use many cutting-edge AI chips at undeclared locations, and it has 3 layers of defense for detecting tampering with chips at declared locations.",
    },
    {
      label: "His conclusion, worded exactly",
      text: "Overall, this shows that methods that have been widely used for nuclear arms control verification can be adapted to create a reliable system for verifying accounts of AI chips.",
    },
  ],
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
    answer: [
      {
        kind: "ol",
        items: [
          "Non-nuclear-weapon states undertake not to build nuclear weapons and to accept the IAEA safeguards system.",
          "The immediate object of verification is nuclear material — above all uranium and plutonium — and its use at declared facilities.",
          "The purpose of verification is to establish that these materials are used for peaceful purposes and are not diverted to weapons.",
          "It does not follow that the state has no nuclear-weapons programme. A CSA verifies declared materials and facilities well, but was not originally designed to reliably detect undeclared facilities.",
        ],
      },
    ],
    baker: [BAKER_CSA_TEMPLATE, BAKER_NUCLEAR_MATERIALS, BAKER_UNDECLARED_TWO_STEPS],
  },
  {
    id: "t2",
    n: 2,
    title: "Division of labour",
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
    answer: [
      {
        kind: "table",
        head: ["Instrument", "Problem it solves", "Evasion if it is absent"],
        rows: [
          [
            "Chip-level logging",
            "Creates a durable trace of which computations a chip took part in",
            "Registered chips are used for a prohibited run that leaves no verifiable record afterwards",
          ],
          [
            "Training transcripts",
            "Make the chip’s record interpretable and tie it to the parameters of a specific training run",
            "The operator passes a prohibited run off as a permitted one, or offers a false provenance for discovered model states",
          ],
          [
            "Supply-chain monitoring",
            "Secures the completeness of the chip inventory from which the inspection sample is drawn",
            "A violator acquires unregistered chips that never enter the sample",
          ],
        ],
      },
      { kind: "p", text: "The components are not interchangeable:" },
      {
        kind: "ul",
        items: [
          "a log without a transcript cannot reliably establish what a run contained;",
          "a transcript without an independent trace can be fabricated;",
          "both are useless against chips whose existence the verifier does not know of.",
        ],
      },
    ],
    baker: [],
    bakerNote:
      "Baker independently supports the need for persistent chip records and complete chip accountancy. The role of training transcripts follows from Shavit’s proposed mechanism rather than Baker’s analysis.",
  },
  {
    id: "t3",
    n: 3,
    title: "Grounds and limits of the analogy",
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
    answer: [
      { kind: "p", text: "Two characteristics of nuclear materials:" },
      {
        kind: "ol",
        items: [
          "obtaining weapon-usable material is the hardest step in making a nuclear weapon;",
          "uranium and plutonium are comparatively rare and emit radiation, so they can be detected and accounted for.",
        ],
      },
      { kind: "p", text: "The corresponding features of AI:" },
      {
        kind: "ol",
        items: [
          "the class of advanced training runs at issue requires large quantities of specialized chips;",
          "production of such chips is concentrated in a limited supply chain, so they can be accounted for and inspected.",
        ],
      },
      {
        kind: "p",
        text: "The analogy rests not on any physical resemblance between the objects, but on their role as a controlled, mandatory input into the prohibited activity.",
      },
      { kind: "p", text: "Its limits:" },
      {
        kind: "ul",
        items: [
          "computation has no analogue of the unique radioactive particles that environmental sampling detects;",
          "non-specialized chips can open a loophole;",
          "algorithms and data are harder to track;",
          "after training, weights can spread independently of the original hardware.",
        ],
      },
    ],
    baker: [
      BAKER_ANALOGY_FIVE,
      BAKER_NUCLEAR_MATERIALS,
      BAKER_QUALIFIED_OPTIMISM,
      BAKER_COMMODITY_CHIPS,
    ],
    bakerNote:
      "Baker is especially useful here because he shows the correct analogy: verified accountancy of a chokepoint, not “chips are like uranium”.",
  },
  {
    id: "t4",
    n: 4,
    title: "Why Iraq was missed",
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
    answer: [
      { kind: "p", text: "Three reasons:" },
      {
        kind: "ol",
        items: [
          "The CSA was oriented toward declared facilities and materials, not a systematic search for secret sites.",
          "Negotiators assumed that hidden facilities would be discovered by national intelligence services, which would volunteer the information to the IAEA.",
          "Broad inspection access was considered politically unacceptable, and no reliable independent methods for finding undeclared facilities existed.",
        ],
      },
      {
        kind: "p",
        text: "The system could therefore verify declared facilities correctly while missing activity outside the declared list. Increasing the frequency of the same inspections would not have fixed the coverage problem.",
      },
      {
        kind: "p",
        text: "For Shavit’s system, the most relevant risk is an incomplete registry: if a violator can obtain or host enough unaccounted chips, inspection of registered chips shows nothing about them.",
      },
    ],
    baker: [BAKER_CSA_GAP_FULL, BAKER_SALIENT_FAILURE],
  },
  {
    id: "t5",
    n: 5,
    title: "Testing the hypothesis",
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
    answer: [
      { kind: "p", text: "The hypothesis is supported by the following:" },
      {
        kind: "ul",
        items: [
          "large training runs depend on many specialized physical components;",
          "those components can be accounted for;",
          "production of advanced chips is concentrated in a limited supply chain;",
          "registered chips can carry verifiable mechanisms and be subject to sampling inspections;",
          "nuclear regimes successfully used a combination of accountancy, surveillance, inspections and several mutually reinforcing layers.",
        ],
      },
      { kind: "p", text: "It is limited by the following:" },
      {
        kind: "ul",
        items: [
          "verifying declared facilities does not establish the completeness of the declaration;",
          "unregistered chips or undeclared data centers require separate means of detection;",
          "commodity chips can open a bypass;",
          "chip-based verification does not cover every form of AI development;",
          "the absence of an environmental-sampling analogue makes hidden activity harder to find.",
        ],
      },
      { kind: "h", text: "A revised hypothesis" },
      {
        kind: "quote",
        text: "Where highly compute-intensive AI development requires large quantities of accounted-for specialised chips, chip registration, tamper-evident logging and inspection may provide reliable assurance that covered chips at declared locations have not been used in prohibited training. This conclusion does not by itself establish the absence of prohibited development using unregistered chips, undeclared facilities, commodity hardware, or other unmonitored inputs.",
      },
      { kind: "h", text: "What the assessment would need to know" },
      {
        kind: "ul",
        items: [
          "the share of relevant training runs technically possible without covered chips;",
          "the feasibility of covert chip production, acquisition and movement;",
          "the completeness of the data-center registry;",
          "the reliability of logging and attestation when the state has access to the hardware;",
          "the probability that an undeclared cluster is found by intelligence, procurement monitoring and challenge inspections.",
        ],
      },
    ],
    baker: [BAKER_QUALIFIED_OPTIMISM, BAKER_ANALOGY_FIVE, BAKER_ACCOUNTS_LINE],
    bakerNote:
      "Baker’s final line is worded exactly: a reliable system for verifying accounts of AI chips — verifying accounts of AI chips, not verifying the absence of all prohibited AI development. That is the properly limited conclusion.",
  },
];
