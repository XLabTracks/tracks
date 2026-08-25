import type { Lesson, Module, Track } from "@/lib/content/types";

// The Verification track's slice of the content graph, kept in its own folder
// so the whole course — this file, the MDX under
// `src/content/lessons/verification/`, and the static site under
// `public/verification/` — lifts to another host as one unit.
// `curriculum.data.ts` only spreads these in.
//
// Content is transcribed from the course author's WIP outline (currently
// Outline-42; the name moves as she revises), never paraphrased and never
// invented. All five modules now carry her drafted prose; module 4 also
// carries one reading reproduced with its author's permission. What each
// transcription took, deliberately left, and still owes is recorded in
// docs/verification/module-*-log.md — the audit trail — and the pieces the
// outline has not written yet are marked in-lesson as author notes, never
// dressed as learner-facing prose.
//
// `order` runs 0-4, not 1-5. The outline numbers its modules M0-M4 and the UI
// prints the number as the label, so starting at 1 would have the course
// contradict its own memo desk and static site. Ordering is by comparison, so
// the base is free.

export const verificationTrack: Track = {
  id: "verification",
  slug: "verification",
  title: "Verification",
  shortTitle: "Verification",
  description:
    "An intermediate course on AI verification: the technical, institutional, and legal mechanisms that make agreements mutually trustable and enforceable.",
  kind: "governance",
  moduleIds: ["v-why", "v-scoping", "v-infrastructure", "v-covert", "v-capstone"],
  prerequisiteEnforcement: "soft",
  // Part-by-part reading was deleted on the course owner's instruction
  // (2026-08-15, "delete this regime"): every lesson and paper reads as one
  // page. The readers (LessonPartsReader / PaperPartsReader) and the MDX
  // PageBreak markers stay in the repo, inert, for any track that ever wants
  // them back — turning the regime on again is this one flag.
  chunkedReading: false,
};

export const verificationModules: Module[] = [
  {
    id: "v-why",
    slug: "why-verification",
    trackId: "verification",
    title: "Why are we teaching this?",
    summary:
      "The oldest problem in arms control, applied to AI: when you sign a mutual agreement, how do you know the other party will uphold it? Opens with the welcome and the course's own framing, then the case that ASI risk warrants an agreement at all, why successful prevention is invisible, the intuitions a verification regime runs on, and seven decades of arms-control precedent.",
    order: 0,
    prerequisiteModuleIds: [],
    itemIds: [
      "v-welcome",
      "v-introduction",
      "v-prevention",
      "v-theories-of-change",
      "v-intuitions",
      "v-precedents",
      "v-strategic-foundations",
    ],
  },
  {
    id: "v-scoping",
    slug: "policy-scoping",
    trackId: "verification",
    title: "Policy scoping & actors",
    summary:
      "What kind of policy are we trying to verify, and who does a treaty rely upon, apply to, and constrain? Compute versus capability thresholds, the effectiveness/feasibility pair, the anatomy of a pause agreement, and the actor map across the compute supply chain.",
    order: 1,
    prerequisiteModuleIds: ["v-why"],
    itemIds: [
      "v-scoping-intro",
      "v-scoping-thresholds",
      "v-scoping-effective-feasible",
      "v-scoping-anatomy",
      "v-paper-scher-treaty",
      "v-scoping-actors",
      "v-interactive-map",
      "v-actor-edges",
      "v-scoping-upstream-downstream",
      "v-context-distiller",
    ],
  },
  {
    id: "v-infrastructure",
    slug: "verification-infrastructure",
    trackId: "verification",
    title: "Verification infrastructure and evidence streams",
    summary:
      "The four buckets of mechanism — hardware, cloud, intelligence, and the human layer — each judged by the claims it can test, the evidence it produces, what it costs to implement, and how it fails.",
    order: 2,
    prerequisiteModuleIds: ["v-why", "v-scoping"],
    // Outline order, submodule by submodule. Each submodule opens with its own
    // X.X reading and its subsubmodules nest under it via `sectionItemId`,
    // which is the shape the outline's taxonomy asks for (modules organize,
    // submodules and subsubmodules carry text) and the one 2.2 and 2.4 already
    // had. 2.1 and 2.3 were brought onto it here — see
    // docs/verification/module-2-log.md.
    itemIds: [
      "v-mechanism-effective",
      "v-mechanism-privacy",
      "v-hw-attestation",
      "v-hw-claim",
      "v-hw-trusted-statement",
      "v-hw-accounting",
      "v-hw-measuring-use",
      "v-hw-authorization",
      "v-hw-where-trust-lives",
      "v-hw-reconstructing-run",
      "v-hw-policy-studio",
      "v-cloud",
      "v-cloud-customer-identification",
      "v-cloud-detection-gaps",
      "v-cloud-evidence",
      "v-intel-intro",
      "v-intel-signatures",
      "v-intel-anchor",
      "v-intel-assessment",
      "v-intel-institutions",
      "v-intel-action",
      "v-human-intro",
      "v-human-insiders",
      "v-human-reporting-protection",
      "v-human-audits-inspections",
      "v-human-institutions",
    ],
  },
  {
    id: "v-covert",
    slug: "covert-development",
    trackId: "verification",
    title: "Architecture and Limitations of Low-Trust AI Compute Verification",
    summary:
      "How the requirements of an international AI agreement might be translated into a technical verification system: the assumptions, design choices, and unresolved problems involved in verifying AI compute use under conditions of limited trust between the parties.",
    order: 3,
    prerequisiteModuleIds: ["v-why", "v-scoping", "v-infrastructure"],
    // One unit, on the course owner's instruction: the module is the Cankaya
    // working paper and its own six question sets, and nothing else. What was
    // here before is in docs/verification/module-3-log.md and in the history.
    itemIds: ["v-covert-system-overview"],
  },
  {
    id: "v-capstone",
    slug: "capstone",
    trackId: "verification",
    title: "Capstone: what would be enough for a three-month emergency pause?",
    summary:
      "Putting it all together — then the feasibility judgments the capstone runs on: the four metrics, and how to do the research they ask for, from a practising AI governance researcher. Then the capstone itself: layer the imperfect mechanisms into a regime you can defend, and say where to go from here.",
    order: 4,
    prerequisiteModuleIds: ["v-why", "v-scoping", "v-infrastructure", "v-covert"],
    // Outline-42's restructure (2026-08-18): 4.0 is the module intro and its
    // objectives, nothing else; the feasibility material is 4.1 with the
    // research primer nested under it as 4.1.1.
    itemIds: [
      "v-capstone-together",
      "v-capstone-feasibility",
      "v-research-tips",
      "v-capstone-project",
      "v-capstone-next-steps",
    ],
  },
];

export const verificationLessons: Lesson[] = [
  {
    id: "v-scoping-intro",
    slug: "scoping-intro",
    moduleId: "v-scoping",
    title: "1.0 Introduction: what kind of policy are we trying to verify?",
    contentRef: "verification/scoping-intro",
    estimatedMinutes: 5,
  },
  {
    id: "v-scoping-thresholds",
    slug: "scoping-thresholds",
    moduleId: "v-scoping",
    sectionItemId: "v-scoping-intro",
    title: "1.0.1 Drawing the Line: Compute vs. Capability",
    contentRef: "verification/scoping-thresholds",
    estimatedMinutes: 5,
  },
  {
    id: "v-scoping-effective-feasible",
    slug: "scoping-effective-feasible",
    moduleId: "v-scoping",
    sectionItemId: "v-scoping-intro",
    title: "1.0.2 Policies must be effective and feasible",
    contentRef: "verification/scoping-effective-feasible",
    // 150 was sized for the reading-heavy draft (the eleven buckets as body
    // prose plus the Options sections). Outline v40 moved the buckets into
    // the widget's card walk: two short interludes, eleven cards, one sort.
    estimatedMinutes: 35,
  },
  // 1.1 carries its recall drill inline: the outline's "1.1 Anatomy of a
  // (Pause) Agreement (including exercise)" is one unit, so the former 1.1.1
  // drill lesson was folded into this body (its copy verbatim, the widget
  // embedded at the end) rather than standing as its own numbered item.
  {
    id: "v-scoping-anatomy",
    slug: "scoping-anatomy",
    moduleId: "v-scoping",
    title: "1.1 Anatomy of a (pause) agreement",
    contentRef: "verification/scoping-anatomy",
    estimatedMinutes: 55,
  },
  {
    id: "v-scoping-actors",
    slug: "scoping-actors",
    moduleId: "v-scoping",
    title: "1.2 Actors: who does the treaty rely upon, apply to, and constrain?",
    contentRef: "verification/scoping-actors",
    // Measured, not guessed: 2,720 words of prose and forty table rows is
    // ~16 minutes, and the workshop's four remaining steps are ~18. The
    // mechanisms half is 1.2.3 and the drill bench came out — see
    // docs/verification/module-1-log.md for where the other 40 went.
    estimatedMinutes: 35,
  },
  {
    id: "v-scoping-upstream-downstream",
    slug: "scoping-upstream-downstream",
    moduleId: "v-scoping",
    title: "1.3 Upstream and downstream",
    contentRef: "verification/scoping-upstream-downstream",
    estimatedMinutes: 10,
  },
  {
    // Applies 1.3's upstream/downstream frame to a real report: the body is the
    // outline's brief, and the interactive it is written around sits under it —
    // which is why it nests under 1.3 as a subsubmodule rather than standing
    // as its own numbered section (course owner, 2026-08-19). The outline's
    // own "1.3.1 Threat Modeling and Theory of Change" is still IN PROGRESS
    // and ships nothing, so the number was free to take.
    //
    // Two sessions reached this independently on the same day; the paragraph
    // above is the better-informed one and stands. The other arrived from
    // 1.2's side: 1.2.2's report constructor was stood down for duplicating
    // this exercise, and the owner named it "1.3.1" while doing so. The
    // lesson id does not change either way, so nobody's progress moves.
    id: "v-context-distiller",
    slug: "context-distiller",
    moduleId: "v-scoping",
    sectionItemId: "v-scoping-upstream-downstream",
    title: "1.3.1 Context distiller",
    contentRef: "verification/context-distiller",
    estimatedMinutes: 15,
  },
  {
    id: "v-mechanism-effective",
    slug: "mechanism-effective",
    moduleId: "v-infrastructure",
    title: "2.0 What makes a verification mechanism effective?",
    contentRef: "verification/mechanism-effective",
    estimatedMinutes: 15,
  },
  {
    id: "v-mechanism-privacy",
    slug: "mechanism-privacy",
    moduleId: "v-infrastructure",
    sectionItemId: "v-mechanism-effective",
    title: "2.0.1 Privacy-Preserving Mechanisms",
    contentRef: "verification/mechanism-privacy",
    estimatedMinutes: 10,
  },
  {
    id: "v-human-intro",
    slug: "human-intro",
    moduleId: "v-infrastructure",
    title: "2.4 The human layer",
    contentRef: "verification/human-intro",
  },
  {
    id: "v-human-insiders",
    slug: "human-insiders",
    moduleId: "v-infrastructure",
    sectionItemId: "v-human-intro",
    title: "2.4.1 Insiders and human sources",
    contentRef: "verification/human-insiders",
    estimatedMinutes: 30,
  },
  {
    id: "v-human-reporting-protection",
    slug: "human-reporting-protection",
    moduleId: "v-infrastructure",
    sectionItemId: "v-human-intro",
    title: "2.4.2 Reporting and protection",
    contentRef: "verification/human-reporting-protection",
    // 60 since Companies A and B moved here from 2.4.4: 40 of reading and the
    // two short blocks, plus that exercise's own 15–20.
    estimatedMinutes: 60,
  },
  {
    id: "v-human-audits-inspections",
    slug: "human-audits-inspections",
    moduleId: "v-infrastructure",
    sectionItemId: "v-human-intro",
    title: "2.4.3 Audits and inspections",
    contentRef: "verification/human-audits-inspections",
    estimatedMinutes: 30,
  },
  {
    id: "v-human-institutions",
    slug: "human-institutions",
    moduleId: "v-infrastructure",
    sectionItemId: "v-human-intro",
    title: "2.4.4 Institutions and policy judgment",
    contentRef: "verification/human-institutions",
    // The framing paragraph, the two required readings (6–8 min each —
    // Brundage's principles, Carlson's noncompliance decision) and The
    // Missing Board transfer interactive (8–10 min, required per the owner:
    // "мы увеличиваем бюджет урока"). The Standard of Proof closer is
    // optional and, per the track-wide convention, bills nothing.
    estimatedMinutes: 25,
  },
  {
    id: "v-covert-system-overview",
    slug: "low-trust-compute-verification",
    moduleId: "v-covert",
    // The reading's own title. The unit is the paper, so naming it anything
    // else would be this repo writing curriculum copy for it.
    title:
      "3.0 A system overview for near-term, low-trust AI compute verification",
    contentRef: "verification/covert-system-overview",
    estimatedMinutes: 15,
  },
  {
    // 4.0 per Outline-42: the module's own intro and objectives, only what is
    // on that page — the feasibility material it used to share a lesson with
    // is 4.1 below. A new id rather than a rename: `v-capstone-feasibility`
    // IS the feasibility lesson, and lesson ids are progress keys.
    id: "v-capstone-together",
    slug: "putting-it-all-together",
    moduleId: "v-capstone",
    title: "4.0 Putting it All Together",
    contentRef: "verification/capstone-together",
    estimatedMinutes: 5,
  },
  {
    id: "v-capstone-feasibility",
    slug: "capstone-feasibility",
    moduleId: "v-capstone",
    title: "4.1 Feasibility Judgments",
    contentRef: "verification/capstone-feasibility",
    // The reading and its four pop-ups (~20), the intuition check against the
    // sealed ranking (~10), the three drill benches (~25), and the
    // defended-ranking memo (~65). The old 170 was sized for the lesson when
    // it also carried the module intro and the threat-modeling specs.
    estimatedMinutes: 120,
  },
  {
    id: "v-capstone-project",
    slug: "capstone-project",
    moduleId: "v-capstone",
    title: "4.2 Capstone project",
    contentRef: "verification/capstone-project",
  },
  {
    // The completion page — Coursera-style, so the title carries no number
    // by the owner's instruction. The unit id behind it stays "4.3" in
    // verificationUnitOfLesson: unit ids are progress keys and rung tags,
    // and renaming the display must never orphan anyone's progress.
    id: "v-capstone-next-steps",
    slug: "capstone-next-steps",
    moduleId: "v-capstone",
    title: "Congratulations",
    contentRef: "verification/capstone-next-steps",
    completion: true,
  },
  // 2.1 Hardware — the outline's heaviest submodule: an intro plus 2.1.1-2.1.8.
  // The graph had the intro and five subsubmodules under a different numbering
  // (2.1.0-2.1.5), so three of the outline's sections had no home at all:
  // 2.1.1 the claim, 2.1.3 accounting, 2.1.5 authorization. Those three were
  // added from the outline's finished prose and the rest were renumbered onto
  // the outline's slots; no lesson was removed and no body was rewritten.
  // Renumbering a title means renumbering the body's own first heading too —
  // `isLessonTitleHeading` compares digits and all, so a title that no longer
  // matches its heading stops being de-duplicated and prints twice.
  {
    id: "v-hw-attestation",
    slug: "hardware-attestation",
    moduleId: "v-infrastructure",
    title: "2.1 Hardware",
    contentRef: "verification/hardware-attestation",
    estimatedMinutes: 5,
  },
  {
    id: "v-hw-claim",
    slug: "hardware-claim",
    moduleId: "v-infrastructure",
    sectionItemId: "v-hw-attestation",
    title: "2.1.1 Start with the claim, not the mechanism",
    contentRef: "verification/hardware-claim",
    estimatedMinutes: 5,
  },
  {
    id: "v-hw-trusted-statement",
    slug: "hardware-trusted-statement",
    moduleId: "v-infrastructure",
    sectionItemId: "v-hw-attestation",
    title: "2.1.2 From a chip to a trusted statement",
    contentRef: "verification/hardware-trusted-statement",
    estimatedMinutes: 5,
  },
  {
    id: "v-hw-accounting",
    slug: "hardware-accounting",
    moduleId: "v-infrastructure",
    sectionItemId: "v-hw-attestation",
    title: "2.1.3 Accounting for hardware: identity, location, topology, and completeness",
    contentRef: "verification/hardware-accounting",
    estimatedMinutes: 5,
  },
  {
    id: "v-hw-measuring-use",
    slug: "hardware-measuring-use",
    moduleId: "v-infrastructure",
    sectionItemId: "v-hw-attestation",
    title: "2.1.4 Measuring and classifying use",
    contentRef: "verification/hardware-measuring-use",
    estimatedMinutes: 10,
  },
  {
    id: "v-hw-authorization",
    slug: "hardware-authorization",
    moduleId: "v-infrastructure",
    sectionItemId: "v-hw-attestation",
    title: "2.1.5 Authorization, licensing, and control",
    contentRef: "verification/hardware-authorization",
    estimatedMinutes: 5,
  },
  {
    id: "v-hw-where-trust-lives",
    slug: "hardware-where-trust-lives",
    moduleId: "v-infrastructure",
    sectionItemId: "v-hw-attestation",
    title: "2.1.6 Where should trust live?",
    contentRef: "verification/hardware-where-trust-lives",
    estimatedMinutes: 5,
  },
  // The outline stars 2.1.7 as optional, and that is now structural rather
  // than a word inside the title. `Lesson.optional` exists (0.4 Strategic
  // Foundations is the other case) and `isOptionalItem` honours it, so the
  // reason the marking used to ride in the title — "optional is a Paper field"
  // — no longer holds. It costs module 2 one required unit, which is what the
  // outline's star says it should cost, and the row now marks itself the one
  // way the course marks optional anything: an "Optional:" prefix.
  {
    id: "v-hw-reconstructing-run",
    slug: "hardware-reconstructing-run",
    moduleId: "v-infrastructure",
    sectionItemId: "v-hw-attestation",
    optional: true,
    title: "2.1.7 Reconstructing a declared training run",
    contentRef: "verification/hardware-reconstructing-run",
    estimatedMinutes: 5,
  },
  {
    id: "v-hw-policy-studio",
    slug: "hardware-policy-studio",
    moduleId: "v-infrastructure",
    sectionItemId: "v-hw-attestation",
    title: "2.1.8 Policy judgment: what role should hardware play?",
    contentRef: "verification/hardware-policy-studio",
    estimatedMinutes: 130,
  },
  {
    id: "v-welcome",
    slug: "welcome",
    moduleId: "v-why",
    title: "0.0 Welcome",
    contentRef: "verification/welcome",
    estimatedMinutes: 5,
    // The opening read flows better as one page than paged section by section.
    unchunked: true,
  },
  {
    id: "v-introduction",
    slug: "introduction",
    moduleId: "v-why",
    title: "0.1 Introduction: Why Should You Care About AI Verification?",
    contentRef: "verification/introduction",
    estimatedMinutes: 25,
  },
  {
    id: "v-prevention",
    slug: "prevention-is-invisible",
    moduleId: "v-why",
    sectionItemId: "v-introduction",
    title: "0.1.1 The world keeps getting saved and you don’t notice",
    contentRef: "verification/prevention",
    estimatedMinutes: 5,
  },
  {
    id: "v-theories-of-change",
    slug: "theories-of-change",
    moduleId: "v-why",
    sectionItemId: "v-introduction",
    title: "0.1.2 We Need More Theories of Change",
    contentRef: "verification/theories-of-change",
    // Estimates v2 rules (module-0-log): ~1200 words of prose ≈ 6 min; the
    // exercise is optional and bills nothing.
    estimatedMinutes: 6,
  },
  // 0.2 is the intuitions reading itself. The interactive timeline simulation
  // that used to open the unit (0.2.0, `v-verification-timeline-game`) was
  // deleted outright on the author's instruction — lesson, MDX body, widget
  // and registry entries all removed, not renumbered.
  {
    id: "v-intuitions",
    slug: "building-intuitions",
    moduleId: "v-why",
    title: "0.2 Building Verification Intuitions",
    contentRef: "verification/intuitions",
    estimatedMinutes: 200,
  },
  {
    id: "v-precedents",
    slug: "precedents",
    moduleId: "v-why",
    title: "0.3 History, Precedents, Parallels",
    contentRef: "verification/precedents",
    // Her packet's "Time: 60 minutes" — carried as data so the reader's
    // toolbar prints it, not as a body line above the documents.
    estimatedMinutes: 60,
  },
  // 0.4 is an optional top-level unit: reading pathways in game theory and IR,
  // each a group of link-out ReadingCards. optional:true keeps it out of module
  // 0's required progress (isOptionalItem honours lessons now), so it gates
  // nothing while still lighting its own checkmark.
  {
    id: "v-strategic-foundations",
    slug: "strategic-foundations",
    moduleId: "v-why",
    title: "0.4 Strategic Foundations",
    contentRef: "verification/strategic-foundations",
    estimatedMinutes: 80,
    optional: true,
    // A list of reading cards, not a read-through: show them all on one screen
    // rather than paging pathway by pathway.
    unchunked: true,
  },
  {
    id: "v-interactive-map",
    slug: "interactive-map",
    moduleId: "v-scoping",
    sectionItemId: "v-scoping-actors",
    title: "1.2.1 Geographic supply-chain map",
    contentRef: "verification/interactive-map",
    estimatedMinutes: 15,
  },
  {
    // 1.2.3. The Actor Map Workshop's second half, moved out of 1.2 because
    // that lesson measured 77 minutes against a 40-minute ceiling. Nothing
    // was cut to make it: the mechanisms are what the section is for, and
    // here they get a page instead of a tail. It shares one localStorage
    // document with the workshop in 1.2, so a board placed there arrives
    // here already keyed — see widgets/actor-board.tsx.
    id: "v-actor-edges",
    slug: "actor-edges",
    moduleId: "v-scoping",
    sectionItemId: "v-scoping-actors",
    title: "1.2.2 Who can prove what",
    contentRef: "verification/actor-edges",
    estimatedMinutes: 20,
  },
  // 1.2.2 Context-specific report constructor stood down on 2026-08-18, on
  // the course owner's judgement that it duplicates 1.3.1: writing a
  // verification report is what 1.3 Upstream and downstream teaches, and the
  // context distiller is the exercise for it. 1.2 is about actors.
  //
  // The section is gone — no entry, no itemIds row, no unit join, and the MDX
  // is deleted. The MATERIAL is not: widgets/report-constructor.tsx, its
  // tested engine, and 21KB of authored scenario copy in
  // data/report-constructor.ts are all untouched, and exercises.ts carries
  // the one commented line that puts it back. Deleting authored curriculum on
  // a one-line instruction is not a thing this repo does; retiring it
  // deliberately is.
  // 2.3 Intelligence. The five readings existed but sat flat and unnested, and
  // ran 2.3.0-2.3.4 against the outline's 2.3.1-2.3.5. The outline's own
  // submodule intro ("Watching Without Permission") was missing entirely, so
  // the layer opened mid-argument; it is v-intel-intro below, and the five now
  // nest under it at the numbers the outline gives them. Their bodies carry no
  // numbered title heading, so only these titles moved — except that Baker's
  // own "§2.3.3" citations inside them are the paper's section, not ours, and
  // were deliberately left alone.
  {
    id: "v-cloud",
    slug: "cloud",
    moduleId: "v-infrastructure",
    title: "2.2.1 Provider records and workload observables",
    contentRef: "verification/cloud",
    estimatedMinutes: 38,
    sidebarGroupTitle: "2.2 Cloud",
  },
  {
    id: "v-cloud-customer-identification",
    slug: "cloud-customer-identification",
    moduleId: "v-infrastructure",
    sectionItemId: "v-cloud",
    title: "2.2.2 Customer identification and ongoing monitoring",
    contentRef: "verification/cloud-customer-identification",
    estimatedMinutes: 22,
  },
  {
    id: "v-cloud-detection-gaps",
    slug: "cloud-detection-gaps",
    moduleId: "v-infrastructure",
    sectionItemId: "v-cloud",
    title: "2.2.3 Detection gaps and policy limits",
    contentRef: "verification/cloud-detection-gaps",
    estimatedMinutes: 30,
  },
  {
    id: "v-cloud-evidence",
    slug: "cloud-evidence",
    moduleId: "v-infrastructure",
    sectionItemId: "v-cloud",
    title: "2.2.4 Interpreting cloud evidence",
    contentRef: "verification/cloud-evidence",
    estimatedMinutes: 30,
  },
  {
    id: "v-intel-intro",
    slug: "intelligence-intro",
    moduleId: "v-infrastructure",
    title: "2.3 Intelligence: watching without permission",
    contentRef: "verification/intelligence-intro",
    estimatedMinutes: 5,
  },
  {
    id: "v-intel-signatures",
    slug: "intelligence-signatures",
    moduleId: "v-infrastructure",
    sectionItemId: "v-intel-intro",
    title: "2.3.1 Observable signatures of undeclared AI development",
    contentRef: "verification/intelligence-signatures",
    estimatedMinutes: 10,
  },
  {
    id: "v-intel-anchor",
    slug: "intelligence-anchor",
    moduleId: "v-infrastructure",
    sectionItemId: "v-intel-intro",
    title: "2.3.2 The empirical anchor: intelligence identifies, the regime resolves",
    contentRef: "verification/intelligence-anchor",
    estimatedMinutes: 5,
  },
  {
    id: "v-intel-assessment",
    slug: "intelligence-assessment",
    moduleId: "v-infrastructure",
    sectionItemId: "v-intel-intro",
    title: "2.3.3 From signal to intelligence assessment",
    contentRef: "verification/intelligence-assessment",
    estimatedMinutes: 5,
  },
  {
    id: "v-intel-institutions",
    slug: "intelligence-institutions",
    moduleId: "v-infrastructure",
    sectionItemId: "v-intel-intro",
    title: "2.3.4 Intelligence institutions and treaty design",
    contentRef: "verification/intelligence-institutions",
    estimatedMinutes: 5,
  },
  {
    id: "v-intel-action",
    slug: "intelligence-action",
    moduleId: "v-infrastructure",
    sectionItemId: "v-intel-intro",
    title: "2.3.5 From intelligence lead to verification action",
    contentRef: "verification/intelligence-action",
    estimatedMinutes: 90,
  },
  // Reproduced with the author's permission, and generated rather than typed:
  // he adds to the doc roughly weekly, so the body is re-synced by
  // `npm run gdoc:build` (scripts/build-gdoc.ts) instead of drifting quietly.
  // The lesson title is the course's framing of the reading; the doc's own
  // title is the heading inside it.
  {
    id: "v-research-tips",
    slug: "how-to-do-research-well",
    moduleId: "v-capstone",
    // Outline-43: nested within 4.1 — feasibility judgments are what the
    // research strategies are for.
    sectionItemId: "v-capstone-feasibility",
    title: "4.1.1 How to Do Research Well",
    contentRef: "verification/research-tips",
    estimatedMinutes: 25,
    // A reference doc of bulleted tips — read as one continuous page, not paged
    // section by section.
    unchunked: true,
    // Outline-43: "a bit more space and less maroon boxes". A page that is
    // almost entirely long bullet runs turns wall-to-wall tinted slab under
    // the reference-sheet list form, so it opts into the plain roomy lists.
    plainLists: true,
  },
];

/* ------------------------------------------------------------------------
 * The outline numbering — the join between the two id sets.
 *
 * The static site under public/verification/ keys progress on the outline's
 * unit numbers (0.1, 2.3) and data/skills.js tags its rungs with the same
 * strings. The graph keys on v-<name>. Both are load-bearing and neither can
 * be renamed, so this maps one onto the other — and it is what lets
 * public/verification/data/course.js be generated instead of hand-maintained
 * (npm run verification:course).
 *
 * Several lessons share one unit: 2.1's six hardware sections are one unit,
 * 2.3's five are another. The generator groups by unit, and a unit's row in
 * the static site points at the first lesson listed for it here.
 *
 * Trap: a lesson missing from this map is a lesson the static site cannot
 * see. The generator fails loudly rather than dropping it — add the lesson
 * here in the same commit that adds it to the graph.
 * ---------------------------------------------------------------------- */

/**
 * The papers this track's modules list in `itemIds`. They live in
 * `src/content/papers.data.ts`, which the course generator does not read, so
 * without this list every one of them would look like a missing lesson and
 * fail the build.
 *
 * They are readings attached to a unit, not units of their own — the static
 * course structure carries modules and units, and two treaty texts are neither
 * — so the generator skips them. The skip is enumerated here rather than
 * inferred, which is the point: an item that is neither a lesson nor one of
 * these still fails loudly, exactly as before.
 */
export const verificationPaperIds: string[] = [
  "v-paper-scher-treaty",
];

export const verificationUnitOfLesson: Record<string, string> = {
  "v-welcome": "0.0",
  "v-introduction": "0.1",
  "v-prevention": "0.1",
  "v-theories-of-change": "0.1",
  "v-intuitions": "0.2",
  "v-precedents": "0.3",
  "v-strategic-foundations": "0.4",
  "v-scoping-intro": "1.0",
  "v-scoping-thresholds": "1.0",
  "v-scoping-effective-feasible": "1.0",
  "v-scoping-anatomy": "1.1",
  "v-scoping-actors": "1.2",
  "v-interactive-map": "1.2",
  "v-actor-edges": "1.2",
  "v-scoping-upstream-downstream": "1.3",
  "v-context-distiller": "1.3",
  "v-mechanism-effective": "2.0",
  "v-mechanism-privacy": "2.0",
  "v-hw-attestation": "2.1",
  "v-hw-claim": "2.1",
  "v-hw-trusted-statement": "2.1",
  "v-hw-accounting": "2.1",
  "v-hw-measuring-use": "2.1",
  "v-hw-authorization": "2.1",
  "v-hw-where-trust-lives": "2.1",
  "v-hw-reconstructing-run": "2.1",
  "v-hw-policy-studio": "2.1",
  "v-cloud": "2.2",
  "v-cloud-customer-identification": "2.2",
  "v-cloud-detection-gaps": "2.2",
  "v-cloud-evidence": "2.2",
  "v-intel-intro": "2.3",
  "v-intel-signatures": "2.3",
  "v-intel-anchor": "2.3",
  "v-intel-assessment": "2.3",
  "v-intel-institutions": "2.3",
  "v-intel-action": "2.3",
  "v-human-intro": "2.4",
  "v-human-insiders": "2.4",
  "v-human-reporting-protection": "2.4",
  "v-human-audits-inspections": "2.4",
  "v-human-institutions": "2.4",
  "v-covert-system-overview": "3.0",
  "v-capstone-together": "4.0",
  // The feasibility lesson moved from unit 4.0 to 4.1 in the Outline-42
  // restructure; unit ids themselves are permanent, so 4.0 now names the
  // intro lesson and 4.1 holds feasibility judgments plus the research
  // primer nested under it.
  "v-capstone-feasibility": "4.1",
  "v-research-tips": "4.1",
  "v-capstone-project": "4.2",
  "v-capstone-next-steps": "4.3",
};

/** Per-unit presentation the graph does not carry: the outline's own title,
 *  kind and runtime. A unit's title can differ from its first lesson's — 2.3
 *  is "Intelligence" while its opening lesson is "2.3 Intelligence: watching
 *  without permission". */
export const verificationUnitMeta: Record<
  string,
  { title: string; kind: string; mins: string; optional?: boolean }
> = {
  "0.0": { title: "Welcome", kind: "explainer", mins: "5–10 min" },
  "0.1": { title: "How the risk looks like?", kind: "explainer", mins: "15–20 min" },
  // The Outline-36 revision rebuilt 0.2 around the two Plan A essays: the
  // unit is now written work paced by its ten mini-essay prompts, not a
  // 15-minute interactive.
  "0.2": { title: "Building Verification Intuitions", kind: "exercise", mins: "self-paced" },
  "0.3": { title: "History, Precedents, Parallels", kind: "interactive", mins: "20–25 min" },
  "0.4": { title: "Strategic Foundations", kind: "reading", mins: "self-paced", optional: true },
  "1.0": { title: "Introduction: what kind of policy are we trying to verify?", kind: "explainer", mins: "15–20 min" },
  "1.1": { title: "Anatomy of a pause agreement", kind: "interactive", mins: "20–25 min" },
  "1.2": { title: "Actors", kind: "interactive", mins: "25–30 min" },
  "1.3": { title: "Upstream and downstream", kind: "explainer", mins: "10–15 min" },
  "2.0": { title: "Confidentiality vs. verifiability", kind: "explainer", mins: "15–20 min" },
  // The outline's own budget for 2.1: "Core time: 165-180 minutes, split into
  // two sessions. Optional technical extension: 35-45 minutes." The 35-45 that
  // stood here was the optional extension's figure standing in for the whole
  // submodule, which nine sections no longer make credible.
  "2.1": { title: "Hardware", kind: "explainer", mins: "165–180 min" },
  "2.2": { title: "Cloud", kind: "reading + exercise", mins: "120 min" },
  "2.3": { title: "Intelligence", kind: "explainer", mins: "35–45 min" },
  "2.4": { title: "Human", kind: "explainer", mins: "120 min" },
  "3.0": { title: "What is covert development?", kind: "explainer", mins: "10–15 min" },
  "3.1": { title: "How could a determined actor cheat?", kind: "interactive", mins: "30–40 min" },
  "3.2": { title: "Red team / blue team", kind: "exercise", mins: "45–60 min" },
  "4.0": { title: "Putting it All Together", kind: "explainer", mins: "5–10 min" },
  "4.1": { title: "Feasibility Judgments", kind: "reading + exercise", mins: "120–150 min" },
  "4.2": { title: "Capstone", kind: "capstone", mins: "4–8 hrs" },
  "4.3": { title: "Where to go from here", kind: "explainer", mins: "15–20 min" },
};

/** The static site's module chrome: its own short titles, glyphs, calendar
 *  band and drafting status. The graph's titles are the learner-facing ones. */
export const verificationModuleMeta: Record<
  string,
  { n: number; slug: string; title: string; glyph: string; week: string; status: string }
> = {
  "v-why": { n: 0, slug: "foundations", title: "Foundations", glyph: "✧", week: "week 1", status: "drafted" },
  "v-scoping": { n: 1, slug: "policy-and-actors", title: "Policy and actors", glyph: "❖", week: "weeks 2–3", status: "drafted" },
  "v-infrastructure": { n: 2, slug: "evidence-streams", title: "Evidence streams", glyph: "⚙", week: "weeks 4–8", status: "notes complete" },
  "v-covert": { n: 3, slug: "covert-development", title: "Covert development", glyph: "⚠", week: "week 9", status: "taxonomy complete" },
  "v-capstone": { n: 4, slug: "capstone", title: "Trust without trust", glyph: "✦", week: "week 10", status: "framing complete" },
};
