import type { Lesson, Module, Track } from "@/lib/content/types";

// The Verification track's slice of the content graph, kept in its own folder
// so the whole course — this file, the MDX under
// `src/content/lessons/verification/`, and the static site under
// `public/verification/` — lifts to another host as one unit.
// `curriculum.data.ts` only spreads these in.
//
// Content is transcribed from the course author's WIP outline
// ("Verification Track Outline-2"), never paraphrased and never invented.
// Module 0 is drafted there in full. Modules 1–4 are outlined but their prose
// is still being written, so they ship as empty placeholders rather than as
// filler that looks finished — an empty module counts as complete, so they do
// not block anything.
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
      "v-intuitions",
      "v-precedents",
      "v-securitization",
      "v-verification-timeline-game",
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
      "v-policy-scoping",
      "v-anatomy-drill",
      "v-interactive-map",
      "v-protocol-actors",
      "v-report-constructor",
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
      "v-hw-attestation",
      "v-hw-trusted-statement",
      "v-hw-measuring-use",
      "v-hw-where-trust-lives",
      "v-hw-policy-studio",
      "v-hw-reconstructing-run",
      "v-intel-signatures",
      "v-intel-anchor",
      "v-intel-assessment",
      "v-intel-institutions",
      "v-intel-action",
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
    itemIds: [],
  },
  {
    id: "v-capstone",
    slug: "capstone",
    trackId: "verification",
    title: "Capstone: what would be enough for a three-month emergency pause?",
    summary:
      "Feasibility, prioritization and sequencing, then the capstone itself: layer the imperfect mechanisms into a regime you can defend, and say where to go from here.",
    order: 4,
    prerequisiteModuleIds: ["v-why", "v-scoping", "v-infrastructure", "v-covert"],
    itemIds: [],
  },
];

export const verificationLessons: Lesson[] = [
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
    title: "2.1.1 From a chip to a trusted statement",
    contentRef: "verification/hardware-trusted-statement",
  },
  {
    id: "v-hw-measuring-use",
    slug: "hardware-measuring-use",
    moduleId: "v-infrastructure",
    title: "2.1.2 Measuring, classifying, and controlling use",
    contentRef: "verification/hardware-measuring-use",
  },
  {
    id: "v-hw-where-trust-lives",
    slug: "hardware-where-trust-lives",
    moduleId: "v-infrastructure",
    title: "2.1.3 Where should trust live?",
    contentRef: "verification/hardware-where-trust-lives",
  },
  {
    id: "v-hw-policy-studio",
    slug: "hardware-policy-studio",
    moduleId: "v-infrastructure",
    title: "2.1.4 Policy judgment studio",
    contentRef: "verification/hardware-policy-studio",
  },
  {
    id: "v-hw-reconstructing-run",
    slug: "hardware-reconstructing-run",
    moduleId: "v-infrastructure",
    title: "2.1.5 Reconstructing a declared training run (optional)",
    contentRef: "verification/hardware-reconstructing-run",
  },
  {
    id: "v-welcome",
    slug: "welcome",
    moduleId: "v-why",
    title: "Welcome",
    contentRef: "verification/welcome",
  },
  {
    id: "v-introduction",
    slug: "introduction",
    moduleId: "v-why",
    title: "Introduction: why verification is important",
    contentRef: "verification/introduction",
  },
  {
    id: "v-prevention",
    slug: "prevention-is-invisible",
    moduleId: "v-why",
    title: "The world keeps getting saved and you don’t notice",
    contentRef: "verification/prevention",
  },
  {
    id: "v-intuitions",
    slug: "building-intuitions",
    moduleId: "v-why",
    title: "Building verification intuitions",
    contentRef: "verification/intuitions",
  },
  {
    id: "v-precedents",
    slug: "precedents",
    moduleId: "v-why",
    title: "History, precedents, parallels",
    contentRef: "verification/precedents",
  },
  {
    id: "v-securitization",
    slug: "securitization",
    moduleId: "v-why",
    title: "Securitization, and why AI warrants it",
    contentRef: "verification/securitization",
  },
  {
    id: "v-verification-timeline-game",
    slug: "verification-timeline-game",
    moduleId: "v-why",
    title: "Interactive hypothetical timeline scenario",
    contentRef: "v-verification-timeline-game",
  },
  {
    id: "v-policy-scoping",
    slug: "policy-scoping",
    moduleId: "v-scoping",
    title: "Policy sorting: effectiveness x feasibility",
    contentRef: "v-policy-scoping",
  },
  {
    id: "v-anatomy-drill",
    slug: "anatomy-drill",
    moduleId: "v-scoping",
    title: "Anatomy of a (pause) agreement",
    contentRef: "v-anatomy-drill",
  },
  {
    id: "v-interactive-map",
    slug: "interactive-map",
    moduleId: "v-scoping",
    title: "Geographic supply-chain map",
    contentRef: "v-interactive-map",
  },
  {
    id: "v-protocol-actors",
    slug: "protocol-actors",
    moduleId: "v-scoping",
    title: "Actor taxonomy",
    contentRef: "v-protocol-actors",
  },
  {
    id: "v-report-constructor",
    slug: "report-constructor",
    moduleId: "v-scoping",
    title: "Context-specific report constructor",
    contentRef: "v-report-constructor",
  },
  {
    id: "v-intel-signatures",
    slug: "intelligence-signatures",
    moduleId: "v-infrastructure",
    title: "Observable signatures of undeclared AI development",
    contentRef: "verification/intelligence-signatures",
  },
  {
    id: "v-intel-anchor",
    slug: "intelligence-anchor",
    moduleId: "v-infrastructure",
    title: "The empirical anchor: intelligence identifies, the regime resolves",
    contentRef: "verification/intelligence-anchor",
  },
  {
    id: "v-intel-assessment",
    slug: "intelligence-assessment",
    moduleId: "v-infrastructure",
    title: "From signal to intelligence assessment",
    contentRef: "verification/intelligence-assessment",
  },
  {
    id: "v-intel-institutions",
    slug: "intelligence-institutions",
    moduleId: "v-infrastructure",
    title: "Intelligence institutions and treaty design",
    contentRef: "verification/intelligence-institutions",
  },
  {
    id: "v-intel-action",
    slug: "intelligence-action",
    moduleId: "v-infrastructure",
    title: "From intelligence lead to verification action",
    contentRef: "verification/intelligence-action",
  },
];
