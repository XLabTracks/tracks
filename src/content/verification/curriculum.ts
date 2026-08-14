import type { Lesson, Module, Track } from "@/lib/content/types";

// The Verification track's slice of the content graph, kept in its own folder
// so the whole course — this file, the MDX under
// `src/content/lessons/verification/`, and the static site under
// `public/verification/` — lifts to another host as one unit.
// `curriculum.data.ts` only spreads these in.
//
// Content is transcribed from the course author's WIP outline
// ("Verification Track Outline-2"), never paraphrased and never invented.
// Module 0 is drafted there in full; module 4 carries one reading reproduced
// with its author's permission. The rest of modules 1–4 is outlined but its
// prose is still being written, so those sections ship as empty placeholders
// rather than as filler that looks finished — an empty module counts as
// complete, so they do not block anything.
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
    "An intermediate course on international AI verification: the technical, institutional and legal mechanisms that decide whether a governance commitment can be checked at all — and what it takes to tell a kept promise from a broken one.",
  kind: "governance",
  moduleIds: ["v-why", "v-scoping", "v-infrastructure", "v-covert", "v-capstone"],
  prerequisiteEnforcement: "soft",
  chunkedReading: true,
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
      "v-report-constructor",
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
      "Feasibility, prioritization and sequencing — including how to do the research the capstone asks for, from a practising AI governance researcher — then the capstone itself: layer the imperfect mechanisms into a regime you can defend, and say where to go from here.",
    order: 4,
    prerequisiteModuleIds: ["v-why", "v-scoping", "v-infrastructure", "v-covert"],
    itemIds: [
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
    title: "1.0.1 Brief thresholds explainer: compute vs. capability",
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
    estimatedMinutes: 150,
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
    estimatedMinutes: 60,
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
    // outline's brief, and the interactive it is written around sits under it.
    id: "v-context-distiller",
    slug: "context-distiller",
    moduleId: "v-scoping",
    title: "Context distiller",
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
    estimatedMinutes: 40,
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
    estimatedMinutes: 30,
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
    id: "v-capstone-feasibility",
    slug: "capstone-feasibility",
    moduleId: "v-capstone",
    title: "4.0 Feasibility, prioritization, and sequencing",
    contentRef: "verification/capstone-feasibility",
    estimatedMinutes: 170,
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
    title: "2.1 Hardware: the chip says “compliant”",
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
  // The outline stars 2.1.7 as optional. `optional` is a Paper field, not a
  // Lesson one, so the marking rides in the title the way it already did —
  // making it structural would change what module completion counts, which is
  // not this change's job.
  {
    id: "v-hw-reconstructing-run",
    slug: "hardware-reconstructing-run",
    moduleId: "v-infrastructure",
    sectionItemId: "v-hw-attestation",
    title: "2.1.7 Optional extension: reconstructing a declared training run",
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
    contentRef: "v-interactive-map",
    estimatedMinutes: 15,
  },
  {
    id: "v-report-constructor",
    slug: "report-constructor",
    moduleId: "v-scoping",
    sectionItemId: "v-scoping-actors",
    title: "1.2.2 Context-specific report constructor",
    contentRef: "v-report-constructor",
    estimatedMinutes: 15,
  },
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
    title: "4.1 How to do AI governance research well",
    contentRef: "verification/research-tips",
    estimatedMinutes: 25,
    // A reference doc of bulleted tips — read as one continuous page, not paged
    // section by section.
    unchunked: true,
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
  "v-report-constructor": "1.2",
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
  "v-capstone-feasibility": "4.0",
  "v-research-tips": "4.1",
  "v-capstone-project": "4.2",
  "v-capstone-next-steps": "4.3",
};

/** Per-unit presentation the graph does not carry: the outline's own title,
 *  kind and runtime. A unit's title can differ from its first lesson's — 2.1
 *  is "Hardware" while its opening lesson is "2.1 Hardware: the chip says
 *  “compliant”". */
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
  "4.0": { title: "Feasibility, prioritization, sequencing", kind: "explainer", mins: "20–30 min" },
  "4.1": { title: "How to do AI governance research well", kind: "explainer", mins: "25 min" },
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
