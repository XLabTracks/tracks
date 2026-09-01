import type {
  WorkspaceQuestion,
  WorkspaceRule,
} from "@/lib/verification/question-workspace";

export const NTM_REDLINE_RULE: WorkspaceRule = {
  kind: "required-plus-one-choice",
};

export const NTM_REDLINE_QUESTIONS: readonly WorkspaceQuestion[] = [
  {
    id: "omit",
    n: 1,
    title: "What does Definition 17 omit?",
    requirement: "required",
    body: [
      {
        text: "Read the definition against the signature catalog from 2.3.1. Which collection that a watcher actually uses is not named, and what does each omission cost at the first dispute?",
      },
    ],
  },
  {
    id: "national",
    n: 2,
    title: "Whose satellites count as “national”?",
    requirement: "required",
    body: [
      {
        text: "Is a commercial constellation under government tasking NTM or not? Say what “employed by Parties” covers, and what it leaves arguable.",
      },
    ],
  },
  {
    id: "cyber",
    n: 3,
    title: "The word “cyber” inside the definition",
    requirement: "required",
    body: [
      {
        text: "Is that legalized intelligence collection, or a license to hack that Beijing strikes out first? Argue one side, and name what the other side reads in the same word.",
      },
    ],
  },
  {
    id: "concealment",
    n: 4,
    title: "What does “deliberate concealment” mean for AI?",
    requirement: "required",
    body: [
      {
        text: "Is behind-the-meter power generation camouflage, or ordinary industrial practice? Draw the line the clause would need to hold at a real facility.",
      },
    ],
  },
  {
    id: "tips-public",
    n: 5,
    title: "What breaks if tips must be public?",
    requirement: "optional",
    body: [
      {
        text: "The article's silence on sharing is the datum. Suppose a redraft obliged parties to publish their tips: what breaks, and for whom?",
      },
    ],
  },
];
