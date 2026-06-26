import type { Exercise } from "@/lib/content/types";

// Example exercises — one of every type, with self-describing copy. These power
// the Example track and show how each type renders and grades. Replace with real
// questions when authoring actual lessons.
export const exercises: Exercise[] = [
  {
    id: "multiple-choice",
    type: "multiple-choice",
    prompt:
      "Example multiple-choice question: exactly one option is correct, and it's graded instantly.",
    options: [
      { id: "a", label: "An incorrect option" },
      { id: "b", label: "The correct option" },
      { id: "c", label: "Another incorrect option" },
      { id: "d", label: "Yet another incorrect option" },
    ],
    correctOptionIds: ["b"],
    explanation:
      "This explanation appears after answering — use it to reinforce why the answer is right.",
  },
  {
    id: "multi-select",
    type: "multi-select",
    prompt:
      "Example multi-select question: more than one option can be correct — select all that apply.",
    options: [
      { id: "a", label: "A correct option" },
      { id: "b", label: "An incorrect option" },
      { id: "c", label: "Another correct option" },
      { id: "d", label: "Another incorrect option" },
    ],
    correctOptionIds: ["a", "c"],
    explanation:
      "All correct options must be selected (and no incorrect ones) to score.",
  },
  {
    id: "true-false",
    type: "true-false",
    prompt: "Example true/false question: a single statement to judge as true or false.",
    options: [
      { id: "true", label: "True" },
      { id: "false", label: "False" },
    ],
    correctOptionIds: ["false"],
    explanation: "The intended answer here is False; this note explains why.",
  },
  {
    id: "understanding-check",
    type: "understanding-check",
    prompt:
      "Example understanding check: answer in your own words, then reveal a sample answer to compare. Not auto-graded.",
    sampleAnswer:
      "A sample answer shown after the learner attempts their own — used for self-assessment.",
  },
  {
    id: "writing-prompt",
    type: "writing-prompt",
    prompt:
      "Example writing prompt: a longer free-form response that autosaves as a draft and is submitted when ready.",
    format: "free-form",
    minWords: 80,
    maxWords: 300,
    rubric: [
      { id: "clarity", label: "Clarity", description: "Is the response easy to follow?" },
      { id: "structure", label: "Structure", description: "Is it logically organised?" },
      { id: "evidence", label: "Use of evidence", description: "Are claims supported?" },
    ],
  },
  {
    id: "short-answer",
    type: "short-answer",
    prompt:
      "Example short-answer question: a brief free-form response of a sentence or two.",
    format: "free-form",
    minWords: 30,
    maxWords: 150,
  },
];
