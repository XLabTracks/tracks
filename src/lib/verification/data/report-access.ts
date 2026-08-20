
import type { WorkspaceQuestion } from "@/lib/verification/question-workspace";

export const REPORT_STEM = "An employee reports that a lab is conducting a prohibited run.";

export const REPORT_QUESTION =
  "What does the report justify doing next, and what does it still not establish?";

export const REPORT_ACCESS_KEY = "v-report-access:v1";

export const REPORT_ACCESS_CASES: WorkspaceQuestion[] = [
  {
    id: "worked",
    n: 1,
    requirement: "required",
    title: "Employee directly worked on the run.",
    body: [],
  },
  {
    id: "colleague",
    n: 2,
    requirement: "required",
    title: "Employee heard about it from a colleague.",
    body: [],
  },
  {
    id: "inferred",
    n: 3,
    requirement: "required",
    title: "Employee saw unusual internal messages but inferred the rest.",
    body: [],
  },
  {
    id: "dispute",
    n: 4,
    requirement: "required",
    title:
      "Employee was fired last week and has an active dispute with management.",
    body: [],
  },
];
