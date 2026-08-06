/* The Verification cohort application: which cohort is open, and what it asks.
 *
 * This file is the form. The page renders whatever it finds here and the
 * action validates against the same list, so a new question is one object —
 * never markup, never a branch in the page, and never a migration (the answers
 * are a JSON map keyed by question id).
 *
 * Trap: `id` is the storage key for an answer. Renaming one orphans every
 * answer already submitted under the old id, so treat an id as permanent and
 * reword `prompt` instead.
 */

export type ApplicationQuestion = {
  /** Permanent. The key this question's answer is stored under. */
  id: string;
  prompt: string;
  /** Shown under the prompt. Say what a good answer contains, not how long. */
  hint?: string;
  kind: "short" | "long";
  required: boolean;
  /** Characters. The action rejects anything longer. */
  max: number;
};

export type Cohort = {
  id: string;
  label: string;
  /** What the applicant is told about dates. Null while they are undecided. */
  dates: string | null;
  open: boolean;
};

/* The cohort applications land against. `id` is the storage key half of one
   application per person per cohort, so it is permanent once anyone has
   applied — open the next cohort by adding a new one, never by renaming this.

   Set by hand: there is no admissions calendar in the codebase, and inventing
   dates would put a promise on the page nobody made. */
export const OPEN_COHORT: Cohort = {
  id: "tbd",
  label: "The next facilitated cohort",
  dates: null,
  open: true,
};

/* Not drafted yet. The applicant's name and email come from their account, so
   an empty list still makes a working application — it records who wants a
   place — and the form says plainly that the questions are still to come
   rather than filling the gap with plausible-looking ones. */
export const APPLICATION_QUESTIONS: ApplicationQuestion[] = [];

/** Total characters one submission may carry, across every answer. A second
 *  backstop under the per-question caps, so a long question list cannot add up
 *  to a row the database check would reject. */
export const MAX_TOTAL_ANSWER_CHARS = 20_000;

export const STATUS_WORD: Record<string, string> = {
  submitted: "submitted",
  accepted: "accepted",
  waitlisted: "waitlisted",
  declined: "not this cohort",
  withdrawn: "withdrawn",
};

/** What the applicant is told, per status. Never the reviewer's note. */
export const STATUS_LINE: Record<string, string> = {
  submitted:
    "Your application is in. Applications are read in batches, so a decision will not be immediate.",
  accepted: "You have a place in this cohort. Details follow by email.",
  waitlisted:
    "You are on the waitlist. Places open when accepted applicants drop, and the course is open to work through on your own in the meantime.",
  declined:
    "Not this cohort. The course is open to work through on your own, and a later cohort is a fresh application.",
  withdrawn: "You withdrew this application. You can apply again while the cohort is open.",
};
