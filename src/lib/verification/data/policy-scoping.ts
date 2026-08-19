/**
 * Data for the "Scoping an Anti-ASI Policy" widget, rebuilt 2026-08-18 to the
 * outline's v40 revision of 1.0.2. The exercise is now three phases: the two
 * axes as side-by-side pop-ups (a qualitative five-rung scale each), then the
 * eleven policy buckets introduced in order as a gradient card walk, then the
 * sort onto the feasibility × effectiveness plane.
 *
 * What is whose, because the rule is "never invent curriculum":
 *
 *   - BUCKETS — names, descriptions, historical parallels — are the outline's
 *     own words, transcribed verbatim (seams noted inline where a list-item
 *     lead-in had to become a card sentence).
 *   - The five-rung AXIS_SCALES, each bucket's reference cell (`key`) and
 *     one-line `why`, and the compute-controls exception answer are
 *     builder-authored exercise apparatus, written under the outline's own
 *     instruction to the builder ("FIRST introduce: what is effectiveness?
 *     Give a qualitative scale of 5 different values…"). They are flagged for
 *     owner review in docs/verification/module-1-log.md — argue with them
 *     there, not by silently re-deriving.
 *   - AXIS_TIPS and the exception question (lead + the sg/dr/ti/ch answers)
 *     carry over from the previous five-bucket widget, authored copy from the
 *     policy-scoping.html prototype; the halt answer's first words are
 *     conformed to the new bucket's name.
 *
 * Grid cells are keyed f0..f4 (feasibility low→high) × e0..e4 (effectiveness
 * low→high). Verdicts against the reference key are mechanical — exact cell is
 * right, one step off on either axis (Chebyshev distance 1) is close, further
 * is off — so there is no per-cell feedback table to drift. Cells can hold
 * multiple chips, and the reference key itself doubles up twice (domestic
 * regulation + transparency; binding regulation + nonproliferation). That is a
 * lesson, not a bug: buckets that make different asks can still price out at
 * the same spot, and the off-frontier cluster (emergency prep, transfers) is
 * the point that not everything lives on the diagonal.
 */

export type Verdict = "right" | "close" | "wrong";

export interface AxisRung {
  /** Short qualitative name, e.g. "Long shot". */
  name: string;
  /** One-line gloss shown in the scale pop-up. */
  gloss: string;
}

export interface AxisScale {
  /** Pop-up trigger question, e.g. "What is effectiveness?" */
  question: string;
  /** Axis title as it appears on the plane. */
  title: string;
  /** Defining line under the title (carried from AXIS_TIPS). */
  lead: string;
  /** Five rungs, low → high. */
  rungs: [AxisRung, AxisRung, AxisRung, AxisRung, AxisRung];
}

export const AXIS_SCALES: { effectiveness: AxisScale; feasibility: AxisScale } =
  {
    effectiveness: {
      question: "What is effectiveness?",
      title: "Effectiveness",
      lead: "How much the policy actually deters ASI development — measured against the global race, not against one country’s labs.",
      rungs: [
        {
          name: "Symbolic",
          gloss: "Signals concern; changes no developer’s plans.",
        },
        {
          name: "Marginal",
          gloss: "Slows the already-willing; the race continues around it.",
        },
        {
          name: "Meaningful",
          gloss: "Measurably constrains some frontier development, somewhere.",
        },
        {
          name: "Strong",
          gloss: "Binds every major developer inside the regime, with real teeth.",
        },
        {
          name: "Decisive",
          gloss: "Stops or hard-caps the race itself, for as long as it holds.",
        },
      ],
    },
    feasibility: {
      question: "What is feasibility?",
      title: "Feasibility",
      lead: "How gettable the policy is under current infrastructure (the verification burden it implies) and the current political climate.",
      rungs: [
        {
          name: "Off the table",
          gloss: "No major power would entertain it in today’s climate.",
        },
        {
          name: "Long shot",
          gloss: "Imaginable after a crisis or a major shift in threat perception.",
        },
        {
          name: "Heavy lift",
          gloss: "A real diplomatic and technical build, but precedents exist.",
        },
        {
          name: "Within reach",
          gloss: "States already do this for other dual-use technologies.",
        },
        {
          name: "Already happening",
          gloss: "Versions of it exist today.",
        },
      ],
    },
  };

export interface Bucket {
  id: string;
  /** The outline's own number, 1–11 — load-bearing: bucket 7's description
   *  says "options 8 through 11", so the numbers must stay visible. */
  n: number;
  name: string;
  /** Short label for a chip on the crowded plane. */
  short: string;
  /** The outline's description, verbatim. */
  desc: string;
  /** The outline's historical parallel (its "a." item), split at the first colon. */
  parallel: { title: string; text: string };
  /** Reference cell, 0-indexed: f = feasibility rung, e = effectiveness rung. */
  key: { f: number; e: number };
  /** One-line rationale for the reference placement, shown on reveal. */
  why: string;
}

export const BUCKETS: Bucket[] = [
  {
    id: "sg",
    n: 1,
    name: "Self-governance (status quo)",
    short: "Self-gov",
    desc: "Voluntary lab commitments such as RSPs and safety frameworks; no external enforcement, and race dynamics persist.",
    parallel: {
      title: "Asilomar, 1975",
      text: "Molecular biologists voluntarily paused recombinant DNA experiments and wrote their own safety guidelines at the Asilomar conference. Self-governance worked for a while because the research community was small and shared norms, but it later hardened into formal NIH rules. The AI parallel: lab commitments can precede regulation, but they historically survive only until commercial pressure or new entrants arrive.",
    },
    key: { f: 4, e: 0 },
    why: "The status quo: already happening, costs nothing, binds no one — and race dynamics run straight over a promise with no enforcement.",
  },
  {
    id: "ur",
    n: 2,
    name: "Unilateral restraint",
    short: "Unilateral",
    desc: "One state halts or caps its own frontier development alone, hoping others reciprocate.",
    parallel: {
      title: "US bioweapons renunciation, 1969",
      text: "President Nixon unilaterally terminated the entire American offensive biological weapons program with no reciprocal commitment from the Soviet Union. The gamble partly paid off, helping produce the Biological Weapons Convention in 1972. The cautionary half: the USSR signed and then secretly expanded its own program (Biopreparat), showing what unilateral restraint risks without verification.",
    },
    key: { f: 2, e: 1 },
    why: "One capital can decide it alone, which is why it is not lower — but surrendering the frontier while rivals race is a heavy political lift, and reciprocity you cannot check is a bet Biopreparat shows how to lose.",
  },
  {
    id: "dr",
    n: 3,
    name: "Uncoordinated domestic regulation",
    short: "Domestic reg.",
    desc: "Each state licenses, audits, and sets safety requirements for its own developers, with no international layer.",
    parallel: {
      title: "Human germline editing, 2010s",
      text: "Countries independently banned, restricted, or left unregulated heritable genome editing, with no international coordination. The He Jiankui affair in 2018 (CRISPR babies, conducted in China partly because oversight gaps existed there) showed the core weakness of a pure patchwork: research migrates to the most permissive jurisdiction.",
    },
    key: { f: 3, e: 1 },
    why: "States license industries all the time — no diplomacy required. But national rules stop at the border, and development migrates to the most permissive jurisdiction.",
  },
  {
    id: "ti",
    n: 4,
    name: "Transparency and information-sharing",
    short: "Transparency",
    desc: "Incident reporting, model registries, notification of large training runs. The disclosure infrastructure most later options depend on.",
    parallel: {
      title: "US-Soviet launch notifications, 1988",
      text: "The Ballistic Missile Launch Notification Agreement required each side to notify the other before ICBM and SLBM test launches. Nothing was limited or banned; the value was purely in reducing surprise and misinterpretation. Training-run notification proposals borrow this logic almost exactly. (Nearest fit, though missile launches are far easier to observe from outside than training runs.)",
    },
    key: { f: 3, e: 1 },
    why: "Watching is an easier ask than stopping, and it restrains nothing by itself. Its real value is the disclosure infrastructure every stronger bucket stands on.",
  },
  {
    id: "ep",
    n: 5,
    name: "Joint emergency preparedness and response",
    short: "Emergency prep",
    desc: "Parties jointly detect and respond to computational emergencies such as rogue deployments or loss-of-control incidents. Cross-cutting: compatible with any option below.",
    parallel: {
      title: "Post-Chernobyl conventions, 1986",
      text: "Within months of the Chernobyl accident, states negotiated the Convention on Early Notification of a Nuclear Accident and the Convention on Assistance in Case of a Nuclear Accident, obligating rapid alerts and mutual aid when a disaster crosses borders. Notable for AI: the machinery was built only after the emergency demonstrated the need.",
    },
    key: { f: 1, e: 0 },
    why: "Deterrence is not its job — it detects and responds once something has already gone wrong, alongside any other bucket. And historically the machinery gets built right after the first disaster, not before it.",
  },
  {
    id: "bt",
    n: 6,
    name: "Knowledge and benefit transfers",
    short: "Transfers",
    // Outline seam: the source list-item reads "Knowledge and benefit
    // transfers, in two strands: …" — the name takes the head and the
    // description opens at "In two strands".
    desc: "In two strands: sharing research, development knowledge, and safety-enhancing technologies; and sharing chips, compute access, completed models or API access, cash, and AI-enabled aid. Both function as side payments that make restrictive regimes acceptable to states asked to forgo development.",
    parallel: {
      title: "Atoms for Peace, 1953",
      text: "Eisenhower’s program offered civilian nuclear technology, materials, and training to countries that accepted safeguards, a bargain later written into the NPT as Article IV. Benefit-sharing is what made a discriminatory regime signable for the have-nots. The double edge: some transferred “peaceful” technology later fed weapons programs, including India’s.",
    },
    key: { f: 3, e: 0 },
    why: "Alone it deters nothing — transfers are the side payments that make the restrictive buckets signable. The double edge: the goods that persuade are often the goods that proliferate.",
  },
  {
    id: "cc",
    n: 7,
    name: "Compute controls",
    short: "Compute controls",
    desc: "Export controls, international chip tracking, and hardware-enabled governance mechanisms restricting who can access frontier-scale compute. Also the enforcement backbone for options 8 through 11.",
    parallel: {
      title: "Fissile material chokepoint",
      text: "Nuclear nonproliferation works largely because enriched uranium and plutonium are hard to produce and their supply chains are controllable, policed by the Nuclear Suppliers Group and Cold War-era regimes like CoCom. Advanced chips play the same chokepoint role for AI, with a similar concentration: a handful of firms (TSMC, ASML, NVIDIA) sit where enrichment technology once did.",
    },
    key: { f: 3, e: 2 },
    why: "Chokepoints this concentrated make supply-side control genuinely enforceable — enough to add years to a cheater’s timeline, not to stop the race. Export controls are the part already happening; chip tracking and hardware mechanisms are the build.",
  },
  {
    id: "br",
    n: 8,
    name: "Binding international regulation of development and deployment",
    short: "Intl regulation",
    desc: "Treaty rules spanning the stack, from data-center training runs down to fine-tuning, inference, and sensitive AI-enabled devices.",
    parallel: {
      title: "Chemical Weapons Convention, 1993",
      text: "The CWC regulates an entire dual-use industry rather than banning a single object, with tiered schedules of chemicals, facility declarations, and routine OPCW inspections of commercial plants. It’s the best existing model of intrusive, stack-spanning regulation of a technology that is mostly civilian.",
    },
    key: { f: 1, e: 3 },
    why: "The CWC is the existence proof that a mostly-civilian industry can live under routine international inspection — and between today’s rivals, an AI version is a genuine long shot, not merely a heavy lift.",
  },
  {
    id: "np",
    n: 9,
    name: "Nonproliferation regime",
    short: "Nonproliferation",
    desc: "A small set of states develops frontier AI under international safeguards and inspections; development prohibited everywhere else.",
    parallel: {
      title: "NPT and IAEA, 1968 onward",
      // Outline seam: the source item opens its last sentence "Worth putting
      // on the card: the regime mostly held…" — an instruction to this card,
      // not learner prose, so the card keeps what follows the colon.
      text: "The source model itself. Five recognized weapons states, safeguards inspections for everyone else, and Article IV benefits as the sweetener. The regime mostly held (far fewer nuclear states than Kennedy predicted), but India, Pakistan, and Israel stayed outside it, and North Korea left, so “prohibited everywhere else” was never airtight, and the two-tier structure still breeds resentment.",
    },
    key: { f: 1, e: 3 },
    why: "Judged against expectations the regime mostly held — at the price of a permanent two-tier grievance, and with an exit door North Korea used. For AI, who qualifies as a licensed developer is the fight before the treaty.",
  },
  {
    id: "jd",
    n: 10,
    name: "International joint development",
    short: "Joint dev",
    desc: "Pooling under a shared institution, covering both joint work toward a shared goal such as defensive AI and confinement of systemically risky development to a single multinational project, prohibited outside it.",
    parallel: {
      title: "Baruch Plan, 1946",
      text: "The US proposed placing all dangerous atomic activities under an international Atomic Development Authority with a monopoly on the technology. It failed over exactly the issues a “CERN for AI” would face: the Soviet Union would not freeze itself into second place, and neither side would accept intrusive control before trusting the other. CERN itself shows the pooling half works, but only for science with no military edge.",
    },
    key: { f: 1, e: 4 },
    why: "Pooling among rivals is proven; the monopoly-with-prohibition strand died with the Baruch Plan, because no leader’s rival accepts permanent second place. If confinement held, though, little would escape it.",
  },
  {
    id: "ch",
    n: 11,
    name: "Coordinated halt",
    short: "Coordinated halt",
    desc: "Binding agreement to stop or hard-cap frontier development, bilateral or broadly multilateral, triggered immediately or by pre-committed if/then conditions.",
    parallel: {
      title: "Nuclear test moratoria and the CTBT",
      text: "The US and USSR halted testing by parallel moratorium in 1958, resumed, then progressively banned it (Partial Test Ban 1963, CTBT 1996), backed by a global seismic monitoring network that makes cheating detectable. The apt part: a verified halt of an activity, not a surrender of weapons. The cautionary part: the CTBT never formally entered into force because key states, including the US and China, never ratified.",
    },
    key: { f: 0, e: 4 },
    why: "The strongest instrument on the board and the hardest to get: every major power must stop, and trust that rivals actually stopped. Which is exactly why this track studies verification against it.",
  },
];

/** Mechanical verdict against the reference key: exact cell is right, one step
 *  off on either axis is close, anything further is off. */
export function verdictFor(bucket: Bucket, f: number, e: number): Verdict {
  const dist = Math.max(Math.abs(bucket.key.f - f), Math.abs(bucket.key.e - e));
  return dist === 0 ? "right" : dist === 1 ? "close" : "wrong";
}

/** Human line for a cell, from the rung names: used in announcements and
 *  verdict feedback. */
export function cellLabel(cell: string | null): string {
  if (!cell) return "the tray";
  const f = Number(cell[1]);
  const e = Number(cell[3]);
  return `feasibility “${AXIS_SCALES.feasibility.rungs[f].name}”, effectiveness “${AXIS_SCALES.effectiveness.rungs[e].name}”`;
}

/** Verdict → short status word used in results + announcements. */
export function verdictLabel(v: Verdict): string {
  return v === "right" ? "on the mark" : v === "close" ? "close" : "off";
}

/** The exception question's options, strongest ask last — rendered in reverse
 *  so the halt is not the first chip offered. */
export const EXC_OPTION_IDS = ["sg", "dr", "ti", "cc", "ch"] as const;

/** Exception answers. sg/dr/ti carry over verbatim from the five-bucket
 *  widget; ch is that widget's full-pause answer with its first words
 *  conformed to this bucket's name; cc is builder-authored (the new list
 *  makes the enforcement backbone the most tempting wrong answer, and the
 *  old option set had nothing in its place). `t` carries authored <b>
 *  emphasis markup. */
export const EXC_ANSWERS: Record<string, { ok: boolean; t: string }> = {
  ch: {
    ok: true,
    t: "<b>Right — the coordinated halt.</b> Mechanisms strong enough to verify a halt — chip registries, compute metering, inspection rights — can support every weaker bucket. The reverse is not true. So under the securitized framing you design verification for the pause, whatever gets signed first.",
  },
  cc: {
    ok: false,
    t: "Compute controls are the enforcement backbone, not the target — the question securitization asks is what that backbone must be strong enough to hold up. Design it for the halt and it serves every weaker bucket on the way.",
  },
  ti: {
    ok: false,
    t: "Transparency is the scaffolding, not the target. Under a securitized framing you build the mechanism set that could support a halt — transparency is what it stands on along the way.",
  },
  dr: {
    ok: false,
    t: "Securitization is precisely the move past ordinary domestic politics. A domestic design target leaves the existential problem — the international race — unsolved.",
  },
  sg: {
    ok: false,
    t: "If you truly accept the existential framing, “trust me” is the one answer ruled out from the start. Verification exists to replace it with “check me.”",
  },
};

/** Axis / corner / securitization hover copy — carried over verbatim. */
export const AXIS_TIPS = {
  y: "How much the policy actually deters ASI development — measured against the global race, not against one country’s labs.",
  x: "How gettable the policy is under current infrastructure (the verification burden it implies) and the current political climate.",
  tr: "High effectiveness at high feasibility is the policy everyone would already have adopted. Nothing lives here.",
  bl: "Costly to get and weak once you have it. If a bucket seems to belong here, one of your axis readings is off.",
  sec: "Securitization: treating an issue as an existential security matter, lifting it out of normal political balancing — because nothing can be traded against survival. A strong move with a history of abuse, which is why the threat model must be argued, not stipulated.",
} as const;

/** Widget chrome copy. Phase strip labels and buttons are chrome; the caption,
 *  axis lines, exception lead, and foot carry over from the previous widget
 *  (the foot's stale closing clause about a written justification the section
 *  no longer has was dropped; closingNext now names the actual next unit). */
export const POLICY_SCOPING_COPY = {
  phases: ["The axes", "The buckets", "The sort"] as const,

  axesKicker: "Before the buckets: the two words doing the work.",
  axesHint: "Open both scales, then continue.",
  axesContinue: "To the buckets",
  openScale: "Open the scale",
  scaleSeen: "Seen",
  scaleLowHigh: "low → high",

  cardsKicker:
    "Eleven policy buckets, from the least demanding ask to the most. Open each one — the sort unlocks after you have read all eleven.",
  cardParallelTag: "Historical parallel",
  rampTop: "Least demanding ask",
  rampBottom: "Most demanding ask",
  cardToSort: "To the sort",
  readCount: (n: number, total: number) => `${n} of ${total} read`,
  readMark: "Read",

  sortHint:
    "Drag each bucket onto the plane, then check. The axis titles reopen the two scales; hover a chip for its description.",
  trayLabel: "The eleven policy buckets — drag onto the plane",

  stats: [
    { n: "11", l: "buckets, from voluntary commitments to a coordinated halt" },
    { n: "2", l: "axes every scoping decision trades between" },
    { n: "1", l: "exception that suspends ordinary balancing" },
  ],

  exerciseLabel: "Exercise",
  checkBtn: "Check placements",
  revealBtn: "Reveal reference map",
  resetBtn: "Reset the sort",

  resultsLabel: "Reasoning, bucket by bucket",

  yTitle: "Effectiveness",
  ySub: "at deterring ASI development",
  xTitle: "Feasibility",
  xSub: "— verification burden + political climate",
  caption:
    "Always think about policy in terms of tradeoffs — price them, don’t pick favorites.",
  cornerTR: "the empty corner",
  cornerBL: "worst of both",

  excLabel: "The one exception",
  excLead: {
    pre: "Ordinary balancing weighs effectiveness against feasibility. ",
    sec: "Securitization",
    mid: " breaks the scale: if ASI development is an existential threat, nothing can be traded against survival. Accept that framing, and one bucket becomes the ",
    bold: "design target for verification mechanisms",
    post: ". Which?",
  },

  closingNext: "Next — what would a pause agreement actually say? 1.1: Anatomy of a (Pause) Agreement →",

  foot: "Two reference thresholds worth carrying: EU AI Act Art. 51 presumes systemic risk above 10²⁵ training FLOP; the rescinded EO 14110 used 10²⁶ as its reporting trigger. The corners of this plane are settled; the middle band is genuinely contestable.",
} as const;
