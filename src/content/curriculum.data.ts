import type { Lesson, Module, Track } from "@/lib/content/types";

// Control and Governance are intentionally empty for now — just an intro blurb,
// ready for real curriculum. The "Example" track is a fully-built demo of every
// feature (the four content types, each exercise type, an end-of-module
// assessment, and a cross-module prerequisite). Replace lorem with real content;
// see AUTHORING.md.

export const tracks: Track[] = [
  {
    id: "control",
    slug: "control",
    title: "AI Control",
    shortTitle: "Control",
    description:
      "Hands-on technical track on controlling and evaluating AI systems. Lorem ipsum dolor sit amet, consectetur adipiscing elit — content coming soon.",
    kind: "technical",
    moduleIds: [],
    prerequisiteEnforcement: "hard",
  },
  {
    id: "governance",
    slug: "governance",
    title: "AI Governance & Policy",
    shortTitle: "Governance",
    description:
      "Policy-oriented track with real writing deliverables. Lorem ipsum dolor sit amet, consectetur adipiscing elit — content coming soon.",
    kind: "governance",
    moduleIds: [],
    prerequisiteEnforcement: "soft",
  },
  {
    id: "example",
    slug: "example",
    title: "Example Track",
    shortTitle: "Example",
    description:
      "A demo track showing every feature in one place — the four content types, each exercise type, an end-of-module assessment, and a cross-module prerequisite. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    kind: "example",
    moduleIds: ["ex-content", "ex-assess"],
    prerequisiteEnforcement: "soft",
    estimatedHours: 1,
  },
];

export const modules: Module[] = [
  {
    id: "ex-content",
    slug: "content-types",
    trackId: "example",
    title: "Content types",
    summary:
      "Lorem ipsum dolor sit amet — text, video, callouts, an interactive demo, and exercises, all inside lessons.",
    order: 1,
    prerequisiteModuleIds: [],
    lessonIds: ["ex-content-l1", "ex-content-l2"],
    furtherReadingTopics: ["alignment", "interpretability"],
    estimatedMinutes: 25,
  },
  {
    id: "ex-assess",
    slug: "assessment-and-prerequisites",
    trackId: "example",
    title: "Assessment & prerequisites",
    summary:
      "Lorem ipsum — this module requires the first one (a soft prerequisite) and ends with a written assessment.",
    order: 2,
    prerequisiteModuleIds: ["ex-content"],
    lessonIds: ["ex-assess-l1"],
    assessmentId: "ex-assessment",
    furtherReadingTopics: ["governance"],
    estimatedMinutes: 20,
  },
];

export const lessons: Lesson[] = [
  {
    id: "ex-content-l1",
    slug: "text-video-callouts",
    moduleId: "ex-content",
    title: "Text, video & callouts",
    order: 1,
    contentRef: "ex-content-l1",
    estimatedMinutes: 8,
  },
  {
    id: "ex-content-l2",
    slug: "demos-and-exercises",
    moduleId: "ex-content",
    title: "Demos & exercises",
    order: 2,
    contentRef: "ex-content-l2",
    estimatedMinutes: 10,
  },
  {
    id: "ex-assess-l1",
    slug: "putting-it-together",
    moduleId: "ex-assess",
    title: "Putting it together",
    order: 1,
    contentRef: "ex-assess-l1",
    estimatedMinutes: 7,
  },
];
