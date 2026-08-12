/**
 * The 0.3 document packet's five tasks, with reveal-on-submission keys.
 *
 * WHERE THIS COMES FROM. The tasks are the course owner's condensed
 * assignment, verbatim from her packet delivery (2026-08-12): Task 5
 * compulsory plus any one of Tasks 1–4 (her review revised the original
 * "any two" down — three answers is too much for the hour), word limits
 * hers. The keys are her design too, delivered in a second pass with the
 * titles below: each key is a MODEL ANSWER (hers — written in Russian,
 * rendered in English on her instruction, "in eng obv") followed by a
 * BAKER REVEAL whose cuts she specified section by section. Task 2's
 * reveal is deliberately only a note: Baker supports persistent chip
 * records and accountancy, and she asked that the reveal say so directly
 * instead of stretching a quote.
 *
 * KEY CORRECTIONS (her audit, 2026-08-13). She reviewed the keys against
 * the tasks and the packet and found three of them wrong. Each is rewritten
 * below to what she said it must contain, and — the point of her review —
 * out of the three documents rather than out of Baker, who the learner has
 * not seen when they answer. PENDING HER COPY, like Task 2's realignment:
 * the corrected wording is ours.
 *
 *  - Task 1. The key gave the immediate object as "uranium and plutonium …
 *    at declared facilities", which is Baker's narrower gloss (§1.3, §3.2.1)
 *    substituted for the CSA's own object. Document 1 states it: all nuclear
 *    material in all peaceful nuclear activities within the State's
 *    territory, jurisdiction or control. The obligation was also loosely put
 *    and the three answers were out of the order the task asks them in.
 *  - Task 3. The key answered a different question — it argued the grounds
 *    and limits of the analogy, which is a good answer to a task nobody set.
 *    Hers asks for three conditions (technical structure, supply chain,
 *    verifier powers), each labelled explicit-in-Document-2 or inferred, each
 *    with the conclusion that would cease to hold. It is now that.
 *    Her Baker cuts for this task were chosen for the old key and are left
 *    alone: the commodity-chip scope bears on the first condition and supply
 *    chain concentration on the second, but her bakerNote still points at the
 *    analogy, and rewording it is hers.
 *  - Task 4. The key listed Baker's §5.2 historical explanations and never
 *    picked one of the three categories the task offers. It now names the
 *    second — failure to identify an undeclared object — and argues it from
 *    Document 3's own factors: strategic-point access, absent detection
 *    techniques, checklist culture, and no leads on where to look.
 *  - Task 5. The limited conclusion was sound and is kept verbatim; what was
 *    missing is that her four numbered requirements were not answered as four,
 *    and that several supporting items (chip-production concentration, the
 *    commodity-chip loophole, the missing environmental-sampling analogue,
 *    challenge inspections) came from the later Baker reveal rather than the
 *    packet. It is now four headed answers, each carried by the documents.
 *
 * TASK 2 REALIGNMENT (her audit, 2026-08-12): the delivered task named
 * "training transcripts" as a component, but Document 2's excerpt (§1.1)
 * never discusses transcripts — its three parts are chip-level activity
 * logging, inspection/analysis of the logs of a sufficient subset of
 * chips, and supply-chain monitoring. The task's component list now names
 * those three; the model answer's middle row and the "not interchangeable"
 * items were rewritten to match. PENDING HER COPY: the rewritten row and
 * items are ours (drawn from the excerpt's own wording), and her reveal
 * note lost its transcript sentence — both await her wording.
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
  /** Her number. The rule "Task 5 and any one of Tasks 1–4" reads off it. */
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
        text: "If all declared nuclear material remains accounted for, the state has no nuclear-weapons programme.",
      },
    ],
    maxWords: 150,
    answer: [
      {
        kind: "ol",
        items: [
          "The immediate object is nuclear material: under a CSA a State accepts safeguards on all nuclear material in all peaceful nuclear activities within its territory, under its jurisdiction, or carried out under its control anywhere.",
          "The obligation the State accepts is to place that material under safeguards and to allow the IAEA to verify — and, under the NPT, not to produce or otherwise acquire nuclear weapons. Safeguards are the technical measures by which the IAEA independently verifies that legal commitment.",
          "The broader outcome is non-proliferation: preventing the spread of nuclear weapons. Verification serves it for the exclusive purpose of establishing that safeguarded material is not diverted to nuclear weapons or other nuclear explosive devices.",
        ],
      },
      {
        kind: "p",
        text: "Why the conclusion is broader than the text permits: what is accounted for is material that has been declared and placed under safeguards, and Document 1 claims exactly one thing from that accounting — that such material has not been diverted. It says nothing about material or activities never declared. Moving from “all declared material is accounted for” to “no nuclear-weapons programme” supplies a premise the document does not: that the declaration is complete.",
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
        items: [
          "chip-level activity logging;",
          "inspection and analysis of the logs of a sufficient subset of chips;",
          "supply-chain monitoring.",
        ],
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
            "Log inspection and analysis",
            "Turns the chips’ records into a determination — whether a rules-violating run took place — from a sufficient sample",
            "Logs accumulate but are never examined, so a violation leaves a record that no one converts into a detection",
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
          "a log nobody inspects detects nothing;",
          "an inspection with no attested log has nothing trustworthy to examine;",
          "both are useless against chips whose existence the verifier does not know of.",
        ],
      },
    ],
    baker: [],
    bakerNote:
      "Baker independently supports the need for persistent chip records and complete chip accountancy.",
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
      {
        kind: "table",
        head: [
          "Condition",
          "Explicit or inferred",
          "What stops being justified if it fails",
        ],
        rows: [
          [
            "Technical structure: the training runs the rules target require large quantities of specialised data-centre chips",
            "Explicit. Document 2 sets out to enforce rules on “the training of ML models using large quantities of specialized ML chips”, and restricts its focus to specialised data-centre chips.",
            "That a clean chip regime says anything about the run. A prohibited run reachable on far fewer chips — or on the personal devices Document 2 explicitly leaves alone — is outside what the system observes at all.",
          ],
          [
            "Supply chain: every chip is accounted for, so no actor can secretly acquire chips and underclaim its total",
            "Explicit. This is the stated purpose of the third component.",
            "That inspecting a subset licenses a statement about all of an actor's chips. The sample is then drawn from a population the verifier has mis-measured, and the inference from sample to whole breaks.",
          ],
          [
            "Verifier: inspectors can actually obtain and analyse the logs of a sufficient subset, and logging and attestation hold against a determined adversary",
            "Part explicit, part inferred. The inspection step and the confidentiality-preserving logging are stated; robustness against nation-state circumvention is what the framework “aspires to”, and the access that makes inspection possible is assumed by the design rather than established in the excerpt.",
            "That “no violation found” means “no violation”. Chips would keep records nobody converts into a determination, and an adversary who defeats the attestation makes the record itself untrustworthy.",
          ],
        ],
      },
      {
        kind: "p",
        text: "The three are not the same claim in three places: the first is about what the prohibited activity needs, the second about whether the verifier knows the population, the third about whether it can read it. Each can fail while the other two hold.",
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
      {
        kind: "p",
        text: "It is the second: a failure to identify an undeclared object. The first did not occur — routine verification of declared activity continued as designed — and the third is why the second persisted rather than a separate defect beside it.",
      },
      { kind: "p", text: "Document 3 names what produced it:" },
      {
        kind: "ul",
        items: [
          "access was confined to defined strategic points at declared facilities, and the undeclared activities were carried out on safeguarded sites but away from those points;",
          "the techniques did not exist — until environmental sampling was introduced, activities such as small-scale plutonium separation were very difficult to detect;",
          "a “checklist” inspection culture had evolved, inspectors not being trained to look beyond the obvious, which narrowed how the duty itself was perceived;",
          "and for undeclared sites the fundamental problem is identifying locations to investigate: wider access rights are of limited practical value without leads on where to seek access.",
        ],
      },
      {
        kind: "p",
        text: "So the system can be operating exactly as designed and still fail here, because correct verification of what was declared is compatible with an undeclared object the design never undertook to find. The last factor is also why more of the same inspections would not have closed it: the binding constraint was leads, not frequency or even access.",
      },
      {
        kind: "p",
        text: "For Shavit’s system the corresponding risk is an incomplete registry: if a violator can obtain or host enough unaccounted chips, inspection of registered chips shows nothing about them.",
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
      { kind: "h", text: "1. The strongest valid parallel" },
      {
        kind: "p",
        text: "Verified accountancy of a controlled, mandatory input, carried by a duty on the holder to declare it and accept verification. Document 1 places all nuclear material in peaceful activities under safeguards and obliges the IAEA to verify non-diversion; Document 2 requires that every chip be accounted for and that the logs of a sufficient subset be inspected. The parallel is the accountancy of an input, not any resemblance between uranium and chips — which is also why it survives the fact that the two materials behave nothing alike.",
      },
      { kind: "h", text: "2. The step the Iraq case puts under greatest pressure" },
      {
        kind: "p",
        text: "The move from “inspection of registered chips found no violation” to “no prohibited development is occurring”. That step needs the declaration to be complete, and completeness is what Document 3 shows was absent: undeclared activity sat on safeguarded sites but away from the strategic points inspectors could reach, and detecting undeclared activity at undeclared sites is named there as the greatest challenge facing safeguards.",
      },
      { kind: "h", text: "3. Why inspecting registered chips more often cannot fix it" },
      {
        kind: "p",
        text: "Because the defect is in the population, not the sampling rate. A chip that was never registered is not in the frame the sample is drawn from, so no frequency reaches it; more inspection only sharpens a conclusion about the covered set. Document 3 states the general form of this — wider access rights are of limited practical value without leads on where to seek access — and its own answer was a different instrument, information from states whose collection and analysis capabilities exceed the agency’s.",
      },
      { kind: "h", text: "4. The claim the evidence supports" },
      {
        kind: "quote",
        text: "Where highly compute-intensive AI development requires large quantities of accounted-for specialised chips, chip registration, tamper-evident logging and inspection may provide reliable assurance that covered chips at declared locations have not been used in prohibited training. This conclusion does not by itself establish the absence of prohibited development using unregistered chips, undeclared facilities, commodity hardware, or other unmonitored inputs.",
      },
      {
        kind: "p",
        text: "Each clause of that narrowing is doing work: “covered chips”, because Document 2 leaves personal devices alone; “declared locations”, because Document 3 is the case against assuming the list is complete.",
      },
      { kind: "h", text: "What the assessment would still need to know" },
      {
        kind: "ul",
        items: [
          "the share of relevant training runs technically possible without covered chips;",
          "the feasibility of covert chip production, acquisition and movement;",
          "the completeness of the data-centre registry;",
          "the reliability of logging and attestation when the state itself has access to the hardware;",
          "and — Document 3’s answer for the nuclear case — the probability that an undeclared cluster is found by some instrument other than inspection of what is declared.",
        ],
      },
    ],
    baker: [BAKER_QUALIFIED_OPTIMISM, BAKER_ANALOGY_FIVE, BAKER_ACCOUNTS_LINE],
    bakerNote:
      "Baker’s final line is worded exactly: a reliable system for verifying accounts of AI chips — verifying accounts of AI chips, not verifying the absence of all prohibited AI development. That is the properly limited conclusion.",
  },
];
