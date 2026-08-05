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
    title: "Why verification?",
    summary:
      "The oldest problem in arms control, applied to AI: when you sign a mutual agreement, how do you know the other party will uphold it? Opens with the course's own framing, then the case that ASI risk warrants an agreement at all, why successful prevention is invisible, the intuitions a verification regime runs on, seven decades of arms-control precedent, and the securitization critique met head on.",
    order: 0,
    prerequisiteModuleIds: [],
    itemIds: [
      "v-welcome",
      "v-introduction",
      "v-prevention",
      "v-verification-timeline-game",
      "v-intuitions",
      "v-precedents",
      "v-securitization",
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
      "v-policy-scoping",
      "v-scoping-anatomy",
      "v-anatomy-drill",
      "v-scoping-actors",
      "v-interactive-map",
      "v-protocol-actors",
      "v-report-constructor",
      "v-scoping-upstream-downstream",
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
    itemIds: [
      "v-mechanism-effective",
      "v-hw-attestation",
      "v-hw-trusted-statement",
      "v-hw-measuring-use",
      "v-hw-where-trust-lives",
      "v-hw-policy-studio",
      "v-hw-reconstructing-run",
      "v-cloud-intro",
      "v-cloud-what-providers-see",
      "v-cloud-reporting-control",
      "v-cloud-limits",
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
    title: "Covert development",
    summary:
      "Every mechanism in module 3 can fail. How a determined actor cheats, what evidence the evasion leaves across layers, and the red-team/blue-team exercise that makes you argue both sides.",
    order: 3,
    prerequisiteModuleIds: ["v-why", "v-scoping", "v-infrastructure"],
    itemIds: [
      "v-covert-what-is-it",
      "v-covert-how-to-cheat",
      "v-covert-red-blue",
    ],
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
      "v-capstone-motivation",
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
    title: "1.0 What kind of policy are we trying to verify?",
    contentRef: "verification/scoping-intro",
  },
  {
    id: "v-scoping-thresholds",
    slug: "scoping-thresholds",
    moduleId: "v-scoping",
    sectionItemId: "v-scoping-intro",
    title: "1.0.1 Thresholds: compute vs. capability",
    contentRef: "verification/scoping-thresholds",
  },
  {
    id: "v-scoping-effective-feasible",
    slug: "scoping-effective-feasible",
    moduleId: "v-scoping",
    sectionItemId: "v-scoping-intro",
    title: "1.0.2 Policies must be effective and feasible",
    contentRef: "verification/scoping-effective-feasible",
  },
  {
    id: "v-scoping-anatomy",
    slug: "scoping-anatomy",
    moduleId: "v-scoping",
    title: "1.1 Anatomy of a (pause) agreement",
    contentRef: "verification/scoping-anatomy",
  },
  {
    id: "v-scoping-actors",
    slug: "scoping-actors",
    moduleId: "v-scoping",
    title: "1.2 Actors: who a treaty relies upon, applies to, and constrains",
    contentRef: "verification/scoping-actors",
  },
  {
    id: "v-scoping-upstream-downstream",
    slug: "scoping-upstream-downstream",
    moduleId: "v-scoping",
    title: "1.3 Upstream and downstream",
    contentRef: "verification/scoping-upstream-downstream",
  },
  {
    id: "v-mechanism-effective",
    slug: "mechanism-effective",
    moduleId: "v-infrastructure",
    title: "2.0 What makes a verification mechanism effective?",
    contentRef: "verification/mechanism-effective",
  },
  {
    id: "v-cloud-intro",
    slug: "cloud-intro",
    moduleId: "v-infrastructure",
    title: "2.2.0 Cloud: introduction",
    contentRef: "verification/cloud-intro",
  },
  {
    id: "v-cloud-what-providers-see",
    slug: "cloud-what-providers-see",
    moduleId: "v-infrastructure",
    sectionItemId: "v-cloud-intro",
    title: "2.2.1 What cloud providers can see",
    contentRef: "verification/cloud-what-providers-see",
  },
  {
    id: "v-cloud-reporting-control",
    slug: "cloud-reporting-control",
    moduleId: "v-infrastructure",
    sectionItemId: "v-cloud-intro",
    title: "2.2.2 Reporting, monitoring, and control",
    contentRef: "verification/cloud-reporting-control",
  },
  {
    id: "v-cloud-limits",
    slug: "cloud-limits",
    moduleId: "v-infrastructure",
    sectionItemId: "v-cloud-intro",
    title: "2.2.3 Limits and policy judgment",
    contentRef: "verification/cloud-limits",
  },
  {
    id: "v-human-intro",
    slug: "human-intro",
    moduleId: "v-infrastructure",
    title: "2.4.0 The human layer: introduction",
    contentRef: "verification/human-intro",
  },
  {
    id: "v-human-insiders",
    slug: "human-insiders",
    moduleId: "v-infrastructure",
    sectionItemId: "v-human-intro",
    title: "2.4.1 Insiders and human sources",
    contentRef: "verification/human-insiders",
  },
  {
    id: "v-human-reporting-protection",
    slug: "human-reporting-protection",
    moduleId: "v-infrastructure",
    sectionItemId: "v-human-intro",
    title: "2.4.2 Reporting and protection",
    contentRef: "verification/human-reporting-protection",
  },
  {
    id: "v-human-audits-inspections",
    slug: "human-audits-inspections",
    moduleId: "v-infrastructure",
    sectionItemId: "v-human-intro",
    title: "2.4.3 Audits and inspections",
    contentRef: "verification/human-audits-inspections",
  },
  {
    id: "v-human-institutions",
    slug: "human-institutions",
    moduleId: "v-infrastructure",
    sectionItemId: "v-human-intro",
    title: "2.4.4 Institutions and policy judgment",
    contentRef: "verification/human-institutions",
  },
  {
    id: "v-covert-what-is-it",
    slug: "covert-what-is-it",
    moduleId: "v-covert",
    title: "3.0 What is covert development?",
    contentRef: "verification/covert-what-is-it",
  },
  {
    id: "v-covert-how-to-cheat",
    slug: "covert-how-to-cheat",
    moduleId: "v-covert",
    title: "3.1 How could a determined actor cheat?",
    contentRef: "verification/covert-how-to-cheat",
  },
  {
    id: "v-covert-red-blue",
    slug: "covert-red-blue",
    moduleId: "v-covert",
    title: "3.2 Red-team / blue-team exercises",
    contentRef: "verification/covert-red-blue",
  },
  {
    id: "v-capstone-motivation",
    slug: "capstone-motivation",
    moduleId: "v-capstone",
    title: "4.0 Putting it all together",
    contentRef: "verification/capstone-motivation",
  },
  {
    id: "v-capstone-feasibility",
    slug: "capstone-feasibility",
    moduleId: "v-capstone",
    title: "4.1 Feasibility, prioritization, and sequencing",
    contentRef: "verification/capstone-feasibility",
  },
  {
    id: "v-capstone-project",
    slug: "capstone-project",
    moduleId: "v-capstone",
    title: "4.2 Capstone project",
    contentRef: "verification/capstone-project",
  },
  {
    id: "v-capstone-next-steps",
    slug: "capstone-next-steps",
    moduleId: "v-capstone",
    title: "4.3 Where to go from here",
    contentRef: "verification/capstone-next-steps",
  },
  {
    id: "v-hw-attestation",
    slug: "hardware-attestation",
    moduleId: "v-infrastructure",
    title: "2.1.0 The chip says “compliant”",
    contentRef: "verification/hardware-attestation",
  },
  {
    id: "v-hw-trusted-statement",
    slug: "hardware-trusted-statement",
    moduleId: "v-infrastructure",
    sectionItemId: "v-hw-attestation",
    title: "2.1.1 From a chip to a trusted statement",
    contentRef: "verification/hardware-trusted-statement",
  },
  {
    id: "v-hw-measuring-use",
    slug: "hardware-measuring-use",
    moduleId: "v-infrastructure",
    sectionItemId: "v-hw-attestation",
    title: "2.1.2 Measuring, classifying, and controlling use",
    contentRef: "verification/hardware-measuring-use",
  },
  {
    id: "v-hw-where-trust-lives",
    slug: "hardware-where-trust-lives",
    moduleId: "v-infrastructure",
    sectionItemId: "v-hw-attestation",
    title: "2.1.3 Where should trust live?",
    contentRef: "verification/hardware-where-trust-lives",
  },
  {
    id: "v-hw-policy-studio",
    slug: "hardware-policy-studio",
    moduleId: "v-infrastructure",
    sectionItemId: "v-hw-attestation",
    title: "2.1.4 Policy judgment studio",
    contentRef: "verification/hardware-policy-studio",
  },
  {
    id: "v-hw-reconstructing-run",
    slug: "hardware-reconstructing-run",
    moduleId: "v-infrastructure",
    sectionItemId: "v-hw-attestation",
    title: "2.1.5 Reconstructing a declared training run (optional)",
    contentRef: "verification/hardware-reconstructing-run",
  },
  {
    id: "v-welcome",
    slug: "welcome",
    moduleId: "v-why",
    title: "0.1.0 Welcome",
    contentRef: "verification/welcome",
  },
  {
    id: "v-introduction",
    slug: "introduction",
    moduleId: "v-why",
    title: "0.1.1 Introduction: why verification is important",
    contentRef: "verification/introduction",
  },
  {
    id: "v-prevention",
    slug: "prevention-is-invisible",
    moduleId: "v-why",
    title: "0.1.2 The world keeps getting saved and you don’t notice",
    contentRef: "verification/prevention",
  },
  {
    id: "v-intuitions",
    slug: "building-intuitions",
    moduleId: "v-why",
    title: "0.2 Building verification intuitions",
    contentRef: "verification/intuitions",
  },
  {
    id: "v-precedents",
    slug: "precedents",
    moduleId: "v-why",
    title: "0.3.0 History, precedents, parallels",
    contentRef: "verification/precedents",
  },
  {
    id: "v-securitization",
    slug: "securitization",
    moduleId: "v-why",
    title: "0.3.1 Securitization, and why AI warrants it",
    contentRef: "verification/securitization",
  },
  {
    id: "v-verification-timeline-game",
    slug: "verification-timeline-game",
    moduleId: "v-why",
    title: "0.1.3 Interactive hypothetical timeline scenario",
    contentRef: "v-verification-timeline-game",
  },
  {
    id: "v-policy-scoping",
    slug: "policy-scoping",
    moduleId: "v-scoping",
    title: "1.0.3 Policy sorting: effectiveness x feasibility",
    contentRef: "v-policy-scoping",
  },
  {
    id: "v-anatomy-drill",
    slug: "anatomy-drill",
    moduleId: "v-scoping",
    title: "1.1.1 Anatomy of a (pause) agreement",
    contentRef: "v-anatomy-drill",
  },
  {
    id: "v-interactive-map",
    slug: "interactive-map",
    moduleId: "v-scoping",
    title: "1.2.1 Geographic supply-chain map",
    contentRef: "v-interactive-map",
  },
  {
    id: "v-protocol-actors",
    slug: "protocol-actors",
    moduleId: "v-scoping",
    title: "1.2.2 Actor taxonomy",
    contentRef: "v-protocol-actors",
  },
  {
    id: "v-report-constructor",
    slug: "report-constructor",
    moduleId: "v-scoping",
    title: "1.2.3 Context-specific report constructor",
    contentRef: "v-report-constructor",
  },
  {
    id: "v-intel-signatures",
    slug: "intelligence-signatures",
    moduleId: "v-infrastructure",
    title: "2.3.0 Observable signatures of undeclared AI development",
    contentRef: "verification/intelligence-signatures",
  },
  {
    id: "v-intel-anchor",
    slug: "intelligence-anchor",
    moduleId: "v-infrastructure",
    title: "2.3.1 The empirical anchor: intelligence identifies, the regime resolves",
    contentRef: "verification/intelligence-anchor",
  },
  {
    id: "v-intel-assessment",
    slug: "intelligence-assessment",
    moduleId: "v-infrastructure",
    title: "2.3.2 From signal to intelligence assessment",
    contentRef: "verification/intelligence-assessment",
  },
  {
    id: "v-intel-institutions",
    slug: "intelligence-institutions",
    moduleId: "v-infrastructure",
    title: "2.3.3 Intelligence institutions and treaty design",
    contentRef: "verification/intelligence-institutions",
  },
  {
    id: "v-intel-action",
    slug: "intelligence-action",
    moduleId: "v-infrastructure",
    title: "2.3.4 From intelligence lead to verification action",
    contentRef: "verification/intelligence-action",
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
    title: "4.1.1 How to do AI governance research well",
    contentRef: "verification/research-tips",
    estimatedMinutes: 25,
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

export const verificationUnitOfLesson: Record<string, string> = {
  "v-welcome": "0.1",
  "v-introduction": "0.1",
  "v-prevention": "0.1",
  "v-verification-timeline-game": "0.1",
  "v-intuitions": "0.2",
  "v-precedents": "0.3",
  "v-securitization": "0.3",
  "v-scoping-intro": "1.0",
  "v-scoping-thresholds": "1.0",
  "v-scoping-effective-feasible": "1.0",
  "v-policy-scoping": "1.0",
  "v-scoping-anatomy": "1.1",
  "v-anatomy-drill": "1.1",
  "v-scoping-actors": "1.2",
  "v-interactive-map": "1.2",
  "v-protocol-actors": "1.2",
  "v-report-constructor": "1.2",
  "v-scoping-upstream-downstream": "1.3",
  "v-mechanism-effective": "2.0",
  "v-hw-attestation": "2.1",
  "v-hw-trusted-statement": "2.1",
  "v-hw-measuring-use": "2.1",
  "v-hw-where-trust-lives": "2.1",
  "v-hw-policy-studio": "2.1",
  "v-hw-reconstructing-run": "2.1",
  "v-cloud-intro": "2.2",
  "v-cloud-what-providers-see": "2.2",
  "v-cloud-reporting-control": "2.2",
  "v-cloud-limits": "2.2",
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
  "v-covert-what-is-it": "3.0",
  "v-covert-how-to-cheat": "3.1",
  "v-covert-red-blue": "3.2",
  "v-capstone-motivation": "4.0",
  "v-capstone-feasibility": "4.1",
  "v-research-tips": "4.1",
  "v-capstone-project": "4.2",
  "v-capstone-next-steps": "4.3",
};

/** Per-unit presentation the graph does not carry: the outline's own title,
 *  kind and runtime. A unit's title can differ from its first lesson's — 0.1
 *  is "Introduction" and opens with "Welcome". */
export const verificationUnitMeta: Record<
  string,
  { title: string; kind: string; mins: string; optional?: boolean }
> = {
  "0.1": { title: "Introduction", kind: "explainer", mins: "15–20 min" },
  "0.2": { title: "Building verification intuitions", kind: "interactive", mins: "15–20 min" },
  "0.3": { title: "History, precedents, parallels", kind: "explainer", mins: "20–25 min" },
  "1.0": { title: "What kind of policy are we trying to verify?", kind: "explainer", mins: "15–20 min" },
  "1.1": { title: "Anatomy of a pause agreement", kind: "interactive", mins: "20–25 min" },
  "1.2": { title: "Actors", kind: "interactive", mins: "25–30 min" },
  "1.3": { title: "Upstream and downstream", kind: "explainer", mins: "10–15 min" },
  "2.0": { title: "Confidentiality vs. verifiability", kind: "explainer", mins: "15–20 min" },
  "2.1": { title: "Hardware", kind: "explainer", mins: "35–45 min" },
  "2.2": { title: "Cloud", kind: "explainer", mins: "20–25 min" },
  "2.3": { title: "Intelligence", kind: "explainer", mins: "35–45 min" },
  "2.4": { title: "Human", kind: "explainer", mins: "20–25 min" },
  "3.0": { title: "What is covert development?", kind: "explainer", mins: "10–15 min" },
  "3.1": { title: "How could a determined actor cheat?", kind: "interactive", mins: "30–40 min" },
  "3.2": { title: "Red team / blue team", kind: "exercise", mins: "45–60 min" },
  "4.0": { title: "Motivation", kind: "explainer", mins: "15–20 min" },
  "4.1": { title: "Feasibility, prioritization, sequencing", kind: "explainer", mins: "20–30 min" },
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
