/**
 * 2.4.3's optional extension: one report, four ways it could have reached you.
 *
 * THE COURSE OWNER'S, verbatim. The stem and the four cases are her words,
 * exactly as she gave them; her instruction on the form was one line: after
 * each case there is an answer box. So that is what this is — no marking, no
 * options, no key. Four written answers to the same question about four
 * different provenances of the same claim.
 *
 * The shared question is stated once above the four rather than repeated four
 * times, and it is 2.4's own vocabulary, not a new frame: the section's
 * mandatory lab already ends at "further investigation justified", explicitly
 * short of a compliance judgment, and these four cases are what that bound
 * looks like when the only thing that changes is how the reporter knows.
 *
 * WHY IT SITS AFTER 2.4.3 and not with the reporting section. The point of
 * the set is what a report licenses next: an inspection is a thing you open,
 * and none of these four cases establishes the run on its own. D is the one
 * that catches people, and it is not a trick — a motive to lie is not a
 * finding of lying, and it is also not nothing.
 *
 * Nothing is graded, and there is no answer key to add later. Whether these
 * four have model answers is a content decision for the course owner.
 */

import type { WorkspaceQuestion } from "@/lib/verification/question-workspace";

/** Hers. The one claim all four cases are about. */
export const REPORT_STEM = "An employee reports that a lab is conducting a prohibited run.";

/** Hers, asked of every case. Stated once above them, not four times. */
export const REPORT_QUESTION =
  "What does the report justify doing next, and what does it still not establish?";

/** Its own localStorage document, as every workspace has. Permanent. */
export const REPORT_ACCESS_KEY = "v-report-access:v1";

/** Her four cases, verbatim and in her order. Each carries a box. */
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
