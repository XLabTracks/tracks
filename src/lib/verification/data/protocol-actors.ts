/**
 * Data for the "Who's in the Treaty?" widget — the MIRI draft agreement
 * re-read as a cast list.
 *
 * Every `phrase` and every run of DOC is quoted VERBATIM from Appendix A of
 * *An International Agreement to Prevent the Premature Creation of Artificial
 * Superintelligence* (Scher, Abecassis, Barnett & Abeyta, arXiv:2511.10783v3) —
 * the same paper 1.1 dissects. Do not paraphrase a quoted run, and do not
 * write a provision the Agreement does not contain: if a role has no clause,
 * the honest widget says so rather than inventing one.
 *
 * Two ids outlived the fiction they were named for and now mark something
 * else, because the Agreement has no equivalent of either. `reporting` was
 * `grandfather` — there is no grandfathering here, so the slot holds the
 * 10²²–10²⁴ FLOP reporting band instead. `protective` was `unsc` — Article
 * XII does not route enforcement to the Security Council, it authorises
 * Parties to act themselves.
 *
 * Ids are the widget's own keys (`data-a`), not learner state, so nothing
 * persisted moves when one is renamed.
 *
 * The version is pinned deliberately. The paper is CC BY 4.0, so reproducing
 * these passages needs only attribution — but arXiv keeps every version, and
 * v3 rewrote Article IV: v1 stated 10²⁴/10²³/10²² inline, v3 moved the same
 * numbers into named Article II definitions (Strict, Strict Post-training and
 * Monitored Thresholds) so the CTB can move them without touching the article.
 * Quotes here are v3's. Re-check against the current version before editing a
 * phrase, and bump the pin when you do; a quotation that silently follows a
 * paper it does not name is the drift this file exists to prevent.
 */

/** Actor categories, keyed by the semantic encoding the original uses. */
export type ActorCat = "steel" | "ind" | "inst";

export const CATS: Record<ActorCat, string> = {
  steel: "States & their machinery",
  ind: "Industry",
  inst: "Institutions & inspectors",
};

/** Learn-mode content. blocks: [label, text]. */
export interface ActorEntry {
  cat: ActorCat;
  phrase: string;
  title: string;
  blocks: [string, string][];
}

export const ACTORS: Record<string, ActorEntry> = {
  states: {
    cat: "steel",
    phrase: "“The States concluding this Agreement, hereinafter referred to as the Parties to the Agreement…”",
    title: "Nation-states",
    blocks: [
      [
        "Who this points at",
        "Only sovereign states can sign and ratify. In practice this one is about a short list: the United States and China first — Article III seats them both on the Executive Council by name — then the states that host frontier compute or the fabs that make it. Everyone else joins the way most NPT members did, with nothing to give up.",
      ],
      [
        "Historical parallel",
        "The Nuclear Non-Proliferation Treaty has 191 parties; nine states have nuclear weapons. Treaties are universal on paper and asymmetric in practice.",
      ],
      [
        "Why it matters for Module 1",
        "States are the only actors who can sign — yet almost nothing the Agreement regulates (chips, fabs, datacenters, models) is owned by a state. Every article is a promise to control someone else.",
      ],
    ],
  },
  labs: {
    cat: "ind",
    phrase: "“Any training run exceeding the Strict Threshold or any post-training run exceeding the Strict Post-training Threshold.”",
    title: "Frontier labs",
    blocks: [
      [
        "Who this points at",
        "The handful of labs that can afford a run at this scale. Note what the threshold is written in: not model capability, not parameters, but floating-point operations — a quantity you can bound from the outside by watching chips and power, which is the whole reason it was chosen.",
      ],
      [
        "The catch",
        "A threshold in FLOP is a moving target. Article IV lets the Coalition Technical Body modify it, because an algorithmic advance that halves the compute needed for a given capability silently moves the line without anyone renegotiating the treaty.",
      ],
      [
        "Why it matters for Module 1",
        "The labs are the regulated activity, and they are not parties. Every obligation on them arrives second-hand, through the state whose jurisdiction they sit in.",
      ],
    ],
  },
  facility: {
    cat: "ind",
    phrase: "“…all covered chip clusters (CCCs)… are located in facilities declared to the CTB…”",
    title: "Datacenter owners & operators",
    blocks: [
      [
        "Who this points at",
        "Whoever owns the buildings: the hyperscalers, the neoclouds, the sovereign-fund datacenters. Article V does not ask them to stop computing — it asks them to compute somewhere the inspectorate knows about, and to stop spreading chips across sites faster than anyone can watch them.",
      ],
      [
        "The reachability clause",
        "Article V spells out what “declared” has to mean physically: verification teams should be able to reach any covered cluster “from at least one airport with scheduled international service within 12 hours.” A treaty obligation written as a travel time.",
      ],
      [
        "Why it matters for Module 1",
        "The facility, not the model, is the thing a verifier can stand inside. That is why the infrastructure layer is where Module 2 spends its time.",
      ],
    ],
  },
  reporting: {
    cat: "ind",
    phrase: "“Each Party shall report any training run above the Monitored Threshold to the CTB, prior to initiation.”",
    title: "The reporting band",
    blocks: [
      [
        "Who this points at",
        "Everyone training below the ban but above the noise floor. They are not prohibited — they are surveilled: the report must include “all training code, all training data, and an estimate of the total FLOP to be used,” before the run starts.",
      ],
      [
        "What it costs",
        "This is the most intrusive clause in the Agreement for anyone who is complying. A lab in this band hands over its code and data to CTB staff under supervised access — and the CTB may deny the run if the access it gets is insufficient.",
      ],
      [
        "Why it matters for Module 1",
        "Note what is absent: there is no grandfathering. Models already trained are not exempted by a clause of their own, which is a design choice worth arguing with rather than a gap to be assumed.",
      ],
    ],
  },
  jurisdiction: {
    cat: "steel",
    phrase: "“Each Party prohibits and prevents all such development within their borders and jurisdictions…”",
    title: "Domestic enforcers",
    blocks: [
      [
        "Who this points at",
        "The machinery inside each state that has to make the promise true: export-control agencies, prosecutors, licensing bodies, the domestic regulator that does not exist yet in most signatories. “Prohibits and prevents” are two different jobs, and the second one needs staff.",
      ],
      [
        "The gap this opens",
        "A state can sign in good faith and still fail here, because the obligation is to control actors it does not own. Non-compliance and incapacity look identical from the outside — which is exactly the ambiguity the verification articles exist to resolve.",
      ],
      [
        "Why it matters for Module 1",
        "Every international obligation lands, eventually, on a domestic official. When you map actors, map that far down.",
      ],
    ],
  },
  hardware: {
    cat: "ind",
    phrase: "“…a set of chips with capacity greater than 16 H100-equivalents…”",
    title: "The chip chokepoint",
    blocks: [
      [
        "Who this points at",
        "The designers, the fabs, the packagers and the memory makers. Article VI puts monitoring on production itself — “fabrication of high-bandwidth memory (HBM), fabrication of logic chips, testing, packaging, and assembly” — so a chip is tracked from the line to the declared cluster it ends up in.",
      ],
      [
        "How small the unit is",
        "Sixteen H100-equivalents is the line, and the Agreement notes those cost around $500,000 in 2025 — deliberately low enough that a cluster cannot be assembled quietly out of parts nobody counted.",
      ],
      [
        "Why it matters for Module 1",
        "This is verifiability's best case: few producers, physical objects, a supply chain with real chokepoints. Module 1.3 is about why that advantage disappears downstream.",
      ],
    ],
  },
  instruments: {
    cat: "inst",
    phrase: "“Measurements of power, thermal, and networking characteristics…”",
    title: "The verification-tech ecosystem",
    blocks: [
      [
        "Who this points at",
        "Whoever builds the instruments. Article VII's list is a research agenda as much as a clause: tamper-proof cameras, off-chip power and thermal monitoring, on-chip mechanisms “including retrofitted mechanisms and remote deactivation capabilities,” declared workloads, and re-running those workloads to check the declaration.",
      ],
      [
        "The part that does not exist yet",
        "Several of these are named as methods the CTB “may” use, not as deployed technology. Article VII also says what happens when they fall short: hardware “must be powered off, and its non-operation continually verified.” The fallback for unverifiable compute is no compute.",
      ],
      [
        "Why it matters for Module 1",
        "A treaty can only require what somebody can build. Module 2 is the audit of which of these actually work.",
      ],
    ],
  },
  secretariat: {
    cat: "inst",
    phrase: "“The organs of the coalition are the Executive Council and the Coalition Technical Body (CTB).”",
    title: "The verification bureaucracy",
    blocks: [
      [
        "Who this points at",
        "The body that would have to be staffed, funded and trusted by rivals. The CTB sets the standards, receives the declarations, runs the monitoring and can modify the thresholds — subject to the Executive Council's veto.",
      ],
      [
        "The staffing problem",
        "It needs people who can read a training script, audit a fab and hold a clearance, hired from the same small pool the labs are hiring from, and trusted by both Washington and Beijing at once.",
      ],
      [
        "Why it matters for Module 1",
        "This actor is the one that does not exist. Everything else in the cast has a real-world referent today; the inspectorate has to be built before any of the verification articles mean anything.",
      ],
    ],
  },
  inspections: {
    cat: "inst",
    phrase: "“Parties accept continuous on-site verification of total chip usage at declared CCCs.”",
    title: "The people who knock",
    blocks: [
      [
        "Who this points at",
        "Inspectors, and the escorts, lawyers and site managers who meet them. Note “continuous” — this is not an inspection regime built on visits, it is one built on permanent presence, with in-person inspectors named first in the list of methods.",
      ],
      [
        "The escalation above it",
        "Article X adds challenge inspections on top, approved by the Executive Council. Routine presence catches the ordinary case; the challenge exists for the case where somebody already suspects something.",
      ],
      [
        "Why it matters for Module 1",
        "Access is the currency of verification, and it is spent one negotiation at a time. Who may knock, where, and how fast, is most of what a verification regime is.",
      ],
    ],
  },
  council: {
    cat: "steel",
    phrase: "“The Executive Council initially consists of the United States of America and the People's Republic of China.”",
    title: "The political filter",
    blocks: [
      [
        "Who this points at",
        "Two states, named in the text. They approve challenge inspections, appoint the Director-General, hold veto power over the CTB's recommendations, and set the budget. Every technical finding passes through them.",
      ],
      [
        "The decision rule",
        "“All proactive Executive Council decisions require consensus among members. If consensus cannot be reached, the proposed changes are not adopted.” Two members, consensus required: either one can stop anything, including an inspection of itself.",
      ],
      [
        "Why it matters for Module 1",
        "This is the sharpest actor question in the Agreement. A verification regime whose enforcement organ is the two states it most needs to verify is either the only version that could be signed, or the flaw that makes it worthless — and that argument is yours to have.",
      ],
    ],
  },
  secrets: {
    cat: "inst",
    phrase: "“…takes precautions to protect commercial, industrial, security, and state secrets and other confidential information…”",
    title: "The IP guardians",
    blocks: [
      [
        "Who this points at",
        "Company counsel and national-security lawyers, on both sides of every inspection. The clause is borrowed almost word for word from IAEA INFCIRC/153, which binds the Agency to “take every precaution to protect commercial and industrial secrets.”",
      ],
      [
        "The tension it holds",
        "Article IV hands CTB staff all training code and data in the reporting band; this clause is the promise that it stays inside. Confidentiality is what makes intrusive verification signable — and every leak spends the credibility of the whole regime.",
      ],
      [
        "Why it matters for Module 1",
        "Verification is inherently intrusive, and the mechanisms worth having are the ones that confirm a claim without handing over the secret. That tension is the spine of Module 2.",
      ],
    ],
  },
  export: {
    cat: "steel",
    phrase: "“Non-Parties are denied such access for the safety of the Parties and of all life on Earth…”",
    title: "The export-control machinery",
    blocks: [
      [
        "Who this points at",
        "Everyone who moves a chip across a border: licensing officers, customs, freight forwarders, distributors. Under Article I, only Parties may own or operate the chips and manufacturing capability that could lead to ASI unsupervised — which makes membership, not merely compliance, the thing controlled at the border.",
      ],
      [
        "What it creates",
        "A hard line between inside and outside, and therefore a smuggling market across it. Module 3's evasion scenarios start here.",
      ],
      [
        "Why it matters for Module 1",
        "Export control is where a treaty touches actors who never signed it. It is also the machinery that already exists today, which is why it carries so much of the load.",
      ],
    ],
  },
  protective: {
    cat: "steel",
    phrase: "“…a State Party may undertake Protective Actions that are necessary and proportionate to prevent activities.”",
    title: "The enforcement question",
    blocks: [
      [
        "Who this points at",
        "The state that decides to act, and the actor it acts against — “whether a Party or a non-Party.” Article XII grounds this in the Article 51 right of self-defence and argues that the speed of an ASI breakout may make pre-emption necessary.",
      ],
      [
        "How unusual this is",
        "Most arms-control treaties dead-end at referral: the dispute goes to a council, which is where enforcement quietly stops. This one authorises Parties to act themselves — which answers the enforcement gap and opens a much larger one, since the same clause is available to a state acting in bad faith.",
      ],
      [
        "Why it matters for Module 1",
        "Article XI is the check on it: misuse of Protective Actions is itself a dispute a Party can raise, answerable within 36 hours. Whether that is enough of a check is a question Module 4 hands back to you.",
      ],
    ],
  },
  withdrawal: {
    cat: "steel",
    phrase: "“…extraordinary events, related to the subject matter of this Agreement, have jeopardized the supreme interests of its country.”",
    title: "The exit door",
    blocks: [
      [
        "Who this points at",
        "A future government of any party. The formula is the standard one — the NPT's Article X reads almost identically — but the notice period is not: twelve months, against the NPT's three.",
      ],
      [
        "What the twelve months buy",
        "Article XV spends them on certification: the withdrawing state cooperates so the CTB can establish that after withdrawal it “will be unable to develop, train, post-train, or deploy dangerous AI systems.” The exit is an unwinding procedure, not a door.",
      ],
      [
        "Why it matters for Module 1",
        "Every regime is temporary and every actor knows it. North Korea left the NPT on ninety days' notice. Durability is a design property, and here it is bought with time.",
      ],
    ],
  },
  review: {
    cat: "inst",
    phrase: "“The Executive Council may revise this Agreement as necessary to ensure its purposes are achieved.”",
    title: "The renegotiators",
    blocks: [
      [
        "Who this points at",
        "The same two states, wearing a different hat. Article XIV splits the work: the CTB may change definitions and implementation methods — thresholds, monitoring, the boundaries of restricted research — while anything touching the purposes or the governance structure needs an amendment from the Council.",
      ],
      [
        "Why the split exists",
        "The technical facts move faster than any ratification cycle. Handing the numbers to a technical body under a political veto is the Agreement's attempt to stay current without reopening itself every year.",
      ],
      [
        "Why it matters for Module 1",
        "The text is static; the technology and the actor landscape are not. Whoever controls revision controls what the Agreement means in year five.",
      ],
    ],
  },
};

/** Quiz-mode content. opts: [text, isCorrect, feedback]. */
export interface QuizOption {
  text: string;
  correct: boolean;
  fb: string;
}
export interface QuizEntry {
  q: string;
  opts: QuizOption[];
  why: string;
}

function opt(text: string, correct: boolean, fb: string): QuizOption {
  return { text, correct, fb };
}

export const QUIZ: Record<string, QuizEntry> = {
  states: {
    q: "Who can actually be a party to this Agreement?",
    opts: [
      opt(
        "National governments — the US, China, France, the UAE…",
        true,
        "Only sovereign states can sign and ratify. In practice a handful matter: the ones with frontier compute or the fabs that make it.",
      ),
      opt(
        "Any organisation training large models, including companies",
        false,
        "Labs are the regulated activity, not the signatories. Every obligation on them arrives through a state.",
      ),
      opt(
        "The UN, on behalf of its members",
        false,
        "No international body can bind a state to this. The Agreement builds its own coalition instead.",
      ),
    ],
    why: "States are the only actors who can sign — yet almost nothing the Agreement regulates is owned by a state. Every article is a promise to control someone else.",
  },
  labs: {
    q: "What does the training ban key on?",
    opts: [
      opt(
        "Computation: any run above 10²⁴ FLOP, or post-training above 10²³",
        true,
        "A quantity you can bound from outside by watching chips and power — which is why it was chosen over capability.",
      ),
      opt("How capable the resulting model is", false, "Capability is what everyone cares about and nobody can measure from the outside before the run finishes."),
      opt("Parameter count", false, "Parameters stopped tracking capability years ago, and are trivial to under-report."),
    ],
    why: "The threshold is written in the one quantity a verifier outside the building can bound. It is also the one an algorithmic advance can silently move, which is why the CTB may modify it.",
  },
  facility: {
    q: "What does Article V ask of datacenter operators?",
    opts: [
      opt(
        "Put covered clusters in declared, monitorable facilities — and stop spreading them",
        true,
        "Consolidation is the point: chips scattered across enough sites cannot be watched at all.",
      ),
      opt("Shut down above a power threshold", false, "The Agreement does not ask them to stop computing. It asks them to compute somewhere the inspectorate knows about."),
      opt("Report their electricity bills annually", false, "Metering is one method among several under Article VII, not the obligation itself."),
    ],
    why: "The facility, not the model, is the thing a verifier can stand inside — and Article V even fixes how long it may take to get there: twelve hours from an international airport.",
  },
  reporting: {
    q: "A lab plans a run at 10²³ FLOP. What does the Agreement require?",
    opts: [
      opt(
        "Report it to the CTB before starting, with all training code and data",
        true,
        "It falls in the 10²²–10²⁴ band: permitted, but surveilled in advance, and deniable if access is insufficient.",
      ),
      opt("Nothing — it is under the ban", false, "Under the ban is not outside the Agreement. The reporting band starts at 10²²."),
      opt("Apply for a licence and wait for approval", false, "The obligation is prior reporting with supervised access, not a licensing regime."),
    ],
    why: "This is the most intrusive clause for anyone complying. And note what is not here: no grandfathering of models trained before entry into force.",
  },
  jurisdiction: {
    q: "Why is “prohibits and prevents” two obligations, not one?",
    opts: [
      opt(
        "Prohibiting is a law; preventing needs enforcement machinery that mostly does not exist yet",
        true,
        "A state can sign in good faith and still fail at the second, which is why incapacity and cheating look alike from outside.",
      ),
      opt("It is legal boilerplate with no operative difference", false, "The difference is the entire domestic-implementation problem."),
      opt("It distinguishes state activity from private activity", false, "Both cover both. The difference is between forbidding and being able to stop."),
    ],
    why: "Every international obligation lands on a domestic official. When you map actors, map that far down.",
  },
  hardware: {
    q: "Where does Article VI start monitoring a chip?",
    opts: [
      opt(
        "At fabrication — logic, memory, testing, packaging, assembly",
        true,
        "Tracked from the line to the declared cluster, so no unmonitored supply chain can be established.",
      ),
      opt("At the border, on export", false, "Export control is one layer, but the Agreement starts further upstream than that."),
      opt("At installation in a datacenter", false, "Too late: a chip counted only on arrival can be diverted before it ever arrives."),
    ],
    why: "Few producers, physical objects, real chokepoints. This is verifiability's best case — and 1.3 is about why the advantage disappears downstream.",
  },
  instruments: {
    q: "What does Article VII require when no method can verify a cluster?",
    opts: [
      opt(
        "The hardware is powered off, and its non-operation is verified continuously",
        true,
        "The fallback for unverifiable compute is no compute — a clause that turns a technical gap into an operational cost.",
      ),
      opt("The operator self-certifies until instruments improve", false, "Self-certification is precisely what the Article is built to avoid relying on."),
      opt("The cluster is seized by the CTB", false, "The CTB does not take ownership; it takes the machines out of use."),
    ],
    why: "A treaty can only require what somebody can build. Several methods in Article VII are named as things the CTB may use, not as technology that exists.",
  },
  secretariat: {
    q: "Which body can change the thresholds?",
    opts: [
      opt(
        "The Coalition Technical Body — subject to the Executive Council's veto",
        true,
        "Technical facts move faster than ratification, so the numbers sit with the technical body under a political check.",
      ),
      opt("Any Party, for its own jurisdiction", false, "That would make the threshold meaningless as a shared commitment."),
      opt("Nobody: amending them reopens the whole Agreement", false, "Only fundamental revisions need an amendment. Article XIV splits the work deliberately."),
    ],
    why: "This actor is the one that does not exist. Everything else in the cast has a real-world referent today; the inspectorate has to be built.",
  },
  inspections: {
    q: "What kind of access does Article VII establish at declared clusters?",
    opts: [
      opt(
        "Continuous on-site verification, not periodic visits",
        true,
        "Permanent presence is the baseline; challenge inspections under Article X are the escalation above it.",
      ),
      opt("Scheduled inspections on notice", false, "Notice-based inspection is the older model. This one is built on continuous presence."),
      opt("Remote monitoring only, to protect trade secrets", false, "Remote methods are in the list, but in-person inspectors are named first."),
    ],
    why: "Access is the currency of verification, and it is spent one negotiation at a time.",
  },
  council: {
    q: "Two members, consensus required. What follows?",
    opts: [
      opt(
        "Either state can block any proactive decision — including one about itself",
        true,
        "That is the structural objection to the whole design, and it is visible in the text rather than hidden.",
      ),
      opt("Deadlock is broken by the Director-General", false, "The Director-General is appointed by the Council, not a tiebreaker over it."),
      opt("A majority of all Parties can overrule the Council", false, "Other Parties may be invited into deliberation; they do not get a vote over it."),
    ],
    why: "A verification regime whose enforcement organ is the two states it most needs to verify is either the only version that could be signed, or the flaw that makes it worthless. Have the argument.",
  },
  secrets: {
    q: "Where does the confidentiality language come from?",
    opts: [
      opt(
        "IAEA safeguards — INFCIRC/153's precaution for commercial and industrial secrets",
        true,
        "Borrowed almost word for word, because the same bargain makes intrusive inspection signable.",
      ),
      opt("It is new to this Agreement", false, "The Agreement cites its precedent explicitly."),
      opt("The WTO's trade-secret provisions", false, "The lineage is nuclear safeguards, not trade law."),
    ],
    why: "Article IV hands CTB staff training code and data; this clause is the promise it stays inside. Every leak spends the credibility of the whole regime.",
  },
  export: {
    q: "What does the Agreement deny non-Parties?",
    opts: [
      opt(
        "Ownership and operation of the chips and fabs that could lead to ASI unsupervised",
        true,
        "Membership, not merely compliance, becomes the thing controlled at the border.",
      ),
      opt("Only the most advanced chips, by performance threshold", false, "The line is drawn around supervised access as a whole, not one product tier."),
      opt("Nothing — the Agreement binds only its own parties", false, "Article I turns access itself into a benefit of membership."),
    ],
    why: "Export control is where a treaty touches actors who never signed it — and where Module 3's evasion scenarios begin.",
  },
  protective: {
    q: "How does this Agreement handle enforcement?",
    opts: [
      opt(
        "It authorises Parties to take necessary and proportionate Protective Actions themselves",
        true,
        "Grounded in the Article 51 right of self-defence, on the argument that an ASI breakout is too fast to refer upward.",
      ),
      opt("Referral to the UN Security Council", false, "That is where most arms-control treaties dead-end. This one deliberately does not."),
      opt("Trade sanctions administered by the CTB", false, "The CTB verifies; it is not given an enforcement arsenal."),
    ],
    why: "It answers the enforcement gap and opens a larger one: the same clause is available to a state acting in bad faith. Article XI's 36-hour clock is the check.",
  },
  withdrawal: {
    q: "What do the twelve months of notice buy?",
    opts: [
      opt(
        "Time to certify the withdrawing state cannot then build what the Agreement banned",
        true,
        "The exit is an unwinding procedure, not a door — and the alternative named in the text is Article XII.",
      ),
      opt("A cooling-off period for negotiation", false, "Article XV spends the year on certification, not persuasion."),
      opt("Time for other Parties to withdraw too", false, "Nothing in the clause is about contagion; it is about capability at the moment of exit."),
    ],
    why: "North Korea left the NPT on ninety days' notice. Durability is a design property, and here it is bought with time.",
  },
  review: {
    q: "Who may change what, as the technology moves?",
    opts: [
      opt(
        "The CTB changes definitions and methods; the Council amends purposes and governance",
        true,
        "The numbers move at technical speed under a political veto; the structure moves only by amendment.",
      ),
      opt("Only a Review Conference of all Parties", false, "That is the NPT's machinery, not this one's."),
      opt("The Director-General, on the CTB's advice", false, "The Director-General implements; revision authority sits above."),
    ],
    why: "The text is static; the technology and the actor landscape are not. Whoever controls revision controls what the Agreement means in year five.",
  },
};

export const ORDER = [
  "states",
  "labs",
  "facility",
  "reporting",
  "jurisdiction",
  "hardware",
  "instruments",
  "secretariat",
  "inspections",
  "council",
  "secrets",
  "export",
  "protective",
  "withdrawal",
  "review",
];

export type DocRun =
  | { kind: "text"; text: string }
  | { kind: "num"; text: string }
  | { kind: "hl"; a: string; text: string };

export interface DocArticle {
  heading: string;
  runs: DocRun[];
}

const t = (text: string): DocRun => ({ kind: "text", text });
const n = (text: string): DocRun => ({ kind: "num", text });
const h = (a: string, text: string): DocRun => ({ kind: "hl", a, text });

/**
 * The draft Agreement, article by article, quoted from Appendix A of
 * arXiv:2511.10783v3. Highlight phrases (`h`) key on the actor id (data-a in
 * the widget).
 *
 * Abridged, never rewritten: the Agreement runs to fifteen articles and this
 * is the spine of them, cut at paragraph boundaries. An ellipsis marks every
 * cut, and no run says anything the Agreement does not.
 */
export const DOC: DocArticle[] = [
  {
    heading: "Preamble",
    runs: [
      h("states", "The States concluding this Agreement, hereinafter referred to as the Parties to the Agreement"),
      t(
        ", alarmed by the prospect that the development of artificial superintelligence would lead to the deaths of all people and the end to all human endeavor… have agreed as follows:",
      ),
    ],
  },
  {
    heading: "Article I — Primary Purpose",
    runs: [
      t(
        "Each Party to this Agreement does not develop, deploy, or seek to develop or deploy artificial superintelligence (“ASI”) by any means. ",
      ),
      h("jurisdiction", "Each Party prohibits and prevents all such development within their borders and jurisdictions"),
      t(
        ", and, due to the uncertainty as to when further progress would produce ASI, does not engage in or permit activities that materially advance toward ASI as described in this Agreement… Where some classes of AI infrastructure and capabilities staying far from ASI may be deemed acceptable but only under conditions of international supervision, only Parties to the Agreement may carry out such activities, or own or operate AI chips and manufacturing capabilities that could potentially lead to the development of ASI if unsupervised. ",
      ),
      h("export", "Non-Parties are denied such access for the safety of the Parties and of all life on Earth"),
      t("."),
    ],
  },
  {
    heading: "Article II — Definitions",
    runs: [
      t("For the purposes of this Agreement: "),
      n("2."),
      t(
        " Artificial superintelligence (ASI) is operationally defined as any AI with sufficiently superhuman cognitive performance that it could plan and successfully execute the destruction of humanity… ",
      ),
      t("Strict Threshold is the amount of training computation (measured in FLOP) above which training runs are prohibited. It is set at 10²⁴ FLOP… Monitored Threshold is the amount of training computation (measured in FLOP) above which training runs are subject to monitoring by the international authority. It is set at 10²² FLOP… A covered chip cluster (CCC) is "),
      h("hardware", "a set of chips with capacity greater than 16 H100-equivalents"),
      t("."),
    ],
  },
  {
    heading: "Article III — The Coalition",
    runs: [
      n("2."),
      t(" "),
      h("secretariat", "The organs of the coalition are the Executive Council and the Coalition Technical Body (CTB)"),
      t(". "),
      n("3."),
      t(" "),
      h("council", "The Executive Council initially consists of the United States of America and the People’s Republic of China"),
      t(
        ". The Executive Council: approves challenge inspections; appoints the Director-General; provides oversight of the CTB and exercises veto power over its recommendations; determines overall policy and adopts the budget… All proactive Executive Council decisions require consensus among members. If consensus cannot be reached, the proposed changes are not adopted.",
      ),
    ],
  },
  {
    heading: "Article IV — AI Training",
    runs: [
      n("1."),
      t(" Each Party agrees to ban and prohibit AI training above the following thresholds: "),
      h("labs", "Any training run exceeding the Strict Threshold or any post-training run exceeding the Strict Post-training Threshold"),
      t(". "),
      n("2."),
      t(" "),
      h("reporting", "Each Party shall report any training run above the Monitored Threshold to the CTB, prior to initiation"),
      t(
        ". This report must include, but is not limited to, all training code, all training data, and an estimate of the total FLOP to be used…",
      ),
    ],
  },
  {
    heading: "Article V — Chip Consolidation",
    runs: [
      n("1."),
      t(" Each Party ensures that within their jurisdiction, "),
      h("facility", "all covered chip clusters (CCCs)… are located in facilities declared to the CTB"),
      t(
        ", and that these AI chips are subject to monitoring by the Parties, coordinated by the CTB… These facilities are accessible to physical inspection. This may include, for instance, that verification teams can reach any CCC from at least one airport with scheduled international service within 12 hours.",
      ),
    ],
  },
  {
    heading: "Article VI — AI Chip Production Monitoring",
    runs: [
      n("1."),
      t(
        " The CTB will coordinate monitoring of AI chip production facilities and key inputs to chip production. This monitoring will ensure that all newly produced AI chips are immediately tracked and monitored until they are installed in declared CCCs and that unmonitored supply chains are not established… Monitoring of chip production will start with fabrication.",
      ),
    ],
  },
  {
    heading: "Article VII — Chip Use Verification",
    runs: [
      n("1."),
      t(" "),
      h("inspections", "Parties accept continuous on-site verification of total chip usage at declared CCCs"),
      t(". The methods… may include, but are not limited to: in-person inspectors; tamper-proof cameras; "),
      h("instruments", "measurements of power, thermal, and networking characteristics"),
      t(
        "; on-chip hardware-enabled mechanisms, including retrofitted mechanisms and remote deactivation capabilities… ",
      ),
      n("3."),
      t(
        " In cases where the CTB assesses that current verification methods cannot provide sufficient assurance that the AI hardware is not being used for prohibited activities, AI hardware must be powered off, and its non-operation continually verified.",
      ),
    ],
  },
  {
    heading: "Article X — Information Consolidation and Challenge Inspections",
    runs: [
      t("The Information Consolidation division "),
      h(
        "secrets",
        "takes precautions to protect commercial, industrial, security, and state secrets and other confidential information",
      ),
      t(
        " coming to its knowledge in the implementation of the Agreement… For the purpose of providing assurance of compliance, each Party uses National Technical Means (NTM) of verification at its disposal… Each Party undertakes not to interfere with the National Technical Means of verification of other Parties.",
      ),
    ],
  },
  {
    heading: "Article XII — Protective Actions",
    runs: [
      t(
        "Where there is credible evidence that a State or other actor (whether a Party or a non-Party) is conducting or imminently intends to conduct activities aimed at developing or deploying ASI in violation of Article I, Article IV, Article V, Article VI, Article VII, or Article VIII, ",
      ),
      h("protective", "a State Party may undertake Protective Actions that are necessary and proportionate to prevent activities"),
      t("."),
    ],
  },
  {
    heading: "Article XIV — Revision Process",
    runs: [
      n("1."),
      t(" "),
      h("review", "The Executive Council may revise this Agreement as necessary to ensure its purposes are achieved"),
      t(
        ". Under Article III, the CTB may change specific definitions and implementation methods… Fundamental revisions to the purposes of these Articles or to the governance structure require an Amendment by the Executive Council.",
      ),
    ],
  },
  {
    heading: "Article XV — Withdrawal and Duration",
    runs: [
      n("1."),
      t(" The Agreement shall be of unlimited duration. "),
      n("2."),
      t(
        " Each Party will, in exercising its national sovereignty, have the right to withdraw from the Agreement if it decides that ",
      ),
      h("withdrawal", "extraordinary events, related to the subject matter of this Agreement, have jeopardized the supreme interests of its country"),
      t(
        ". It shall give notice of such withdrawal to the CTB 12 months in advance… During this 12 month period, the withdrawing state shall cooperate with CTB and Executive Council member efforts to certify that after withdrawal, the withdrawing state will be unable to develop, train, post-train, or deploy dangerous AI systems.",
      ),
    ],
  },
];

/** Static copy for the widget shell. */
export const PROTOCOL_ACTORS_COPY = {
  // The opening two sentences of this run moved into the lesson body, which
  // is where the frame belongs; what stays is the instruction for the thing
  // being clicked. Between them the authored wording is unchanged — 1.2's
  // first screen was printing it twice.
  subLearn:
    "Every phrase below points at someone — a government, a company, a bureaucracy, an inspector. Click each highlighted phrase to meet the actors behind it. This is the cast Module 1 puts under the microscope.",
  subQuiz:
    "Same agreement, no answers given. Click each highlighted phrase and pick which real-world actors it puts in the room — who owns it, who runs it, who has done this before. Several answers per phrase; distractors included. If you want the guided tour first, switch to mode 1.",
  tabLearn: "1 · Meet the actors",
  tabQuiz: "2 · Quiz yourself",
  legend: [
    { cat: "steel" as ActorCat, label: "States & their machinery" },
    { cat: "ind" as ActorCat, label: "Industry" },
    { cat: "inst" as ActorCat, label: "Institutions & inspectors" },
  ],
  docEyebrow: "Draft agreement · abridged",
  docTitle: "An International Agreement to Prevent the Premature Creation of Artificial Superintelligence",
  docLede:
    "Scher, Abecassis, Barnett & Abeyta (2025), arXiv:2511.10783, Appendix A — the draft 1.1 dissects, abridged at paragraph boundaries. Every cut is marked with an ellipsis; nothing is rewritten.",
  doneLearnEyebrow: "Cast complete",
  doneLearnTitle: "You have met all fifteen.",
  doneLearnBody:
    "Governments that sign, companies that own everything being regulated, institutions that stand between them. Module 1 gives each of these actors a full scouting report — where it sits, what it can do, what it wants.",
  doneLearnCta: "Test yourself in quiz mode →",
  doneQuizEyebrow: "Quiz complete",
  doneQuizTitle: "The full cast, named.",
  doneQuizBody:
    "Every phrase you just graded is a row on Module 1’s actor map: where each actor sits, what it can do, what it wants. Anything you missed here, the map will fill in.",
  quizHint: "Select every option that belongs, then check. More than one is correct.",
  quizKicker: "Name the actors",
  checkBtn: "Check answer",
  whyLabel: "Why it matters for Module 1",
  prevBtn: "← Previous phrase",
  nextBtn: "Next phrase →",
  close: "Close",
} as const;
