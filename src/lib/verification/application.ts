
export type ApplicationQuestion = {
  id: string;
  prompt: string;
  hint?: string;
  kind: "short" | "long";
  required: boolean;
  max: number;
};

export type Cohort = {
  id: string;
  label: string;
  dates: string | null;
  open: boolean;
};

export const OPEN_COHORT: Cohort = {
  id: "tbd",
  label: "The next facilitated cohort",
  dates: null,
  open: true,
};

export const APPLICATION_QUESTIONS: ApplicationQuestion[] = [];

export const MAX_TOTAL_ANSWER_CHARS = 20_000;

export const STATUS_WORD: Record<string, string> = {
  submitted: "submitted",
  accepted: "accepted",
  waitlisted: "waitlisted",
  declined: "not this cohort",
  withdrawn: "withdrawn",
};

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
