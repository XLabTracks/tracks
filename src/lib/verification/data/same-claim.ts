/**
 * 2.4.3 — Same Claim, Different Circumstances.
 *
 * THE COURSE OWNER'S SPEC, verbatim: the fixed allegation, the four variants,
 * the prompt, the three fields per variant, the instruction that this is not
 * a credibility ranking, the 50-word comparison and the optional transfer
 * question. Its olympiad mechanic holds the claim constant and varies one
 * material circumstance.
 *
 * The four are on the page together, which is her constraint and the point:
 * the controlled variation is only visible when you can see all four at once,
 * and an answer to C is partly an answer about how C differs from A.
 *
 * The five actions below are hers too. They are stated ONCE, above all four
 * variants, as the vocabulary the answers move in — deliberately not a
 * four-option list under each variant, which is the thing the spec forbids.
 * Learners may recommend the same action for more than one variant.
 *
 * WHAT IS MINE: the four lines of the reveal. Her spec names what the reveal
 * must distinguish — claim content, provenance and access, corroboration, and
 * the verification threshold — and does not write them out. Each line says
 * only what its name says, and the last one carries her explicit constraint:
 * no human report alone establishes a violation.
 */

export const FIXED_CLAIM =
  "Project Cedar conducted a prohibited training run during the first two weeks of July.";

export interface ClaimVariant {
  id: string;
  letter: string;
  label: string;
  body: string;
}

/** Her four variants, verbatim and in her order. */
export const CLAIM_VARIANTS: ClaimVariant[] = [
  {
    id: "participant",
    letter: "A",
    label: "Direct participant",
    body: "The source was an ML engineer assigned to Project Cedar and personally monitored the training dashboard during the run.",
  },
  {
    id: "second-hand",
    letter: "B",
    label: "Second-hand knowledge",
    body: "The source worked in the same laboratory but was not assigned to Cedar. Two Cedar researchers separately told them that the project was conducting a prohibited run.",
  },
  {
    id: "inference",
    letter: "C",
    label: "Inference from operational observations",
    body: "The source worked in facilities operations. They observed sustained high power draw, restricted access to one cluster, emergency cooling work, and unusually intense network traffic during the relevant period.",
  },
  {
    id: "documentary",
    letter: "D",
    label: "Documentary access",
    body: "The source worked in compliance and saw an internal document describing Project Cedar as a training run above the treaty’s prohibited compute threshold.",
  },
];

/** Her prompt, verbatim. */
export const CLAIM_PROMPT =
  "For each case: what should the verification body do next, and what can it still not conclude? Justify your answer.";

/** Her list of actions, stated once — not an option list under each variant. */
export const CLAIM_ACTIONS = [
  "record the allegation",
  "seek specific corroboration",
  "open a formal investigation",
  "trigger an inspection or other verification measure",
  "treat the underlying violation as established",
];

/** Her instruction against ranking, verbatim in substance. */
export const CLAIM_NOT_A_RANKING =
  "This is not a ranking from most to least credible. For each source, work out what they can plausibly know, whether that knowledge is direct or inferential, what is still unverified, and what further evidence would help most. The same action may be right for more than one of them.";

/** Her three fields per variant, verbatim. */
export const CLAIM_FIELDS = [
  { id: "response", label: "Recommended response" },
  { id: "changed", label: "Changed fact that matters" },
  { id: "unestablished", label: "What remains unestablished" },
];

/** Her two closing questions, verbatim. */
export const CLAIM_COMPARISON =
  "The allegation was identical in all four cases. In 50 words or fewer, explain why its evidentiary significance changed.";
export const CLAIM_COMPARISON_MAX_WORDS = 50;
export const CLAIM_TRANSFER =
  "You may obtain one additional piece of evidence for one of the four cases. Which case do you investigate further, and what evidence do you seek?";

/**
 * The four distinctions her reveal must draw. Mine, and they add nothing to
 * the names she gave them.
 */
export const CLAIM_REVEAL = [
  {
    term: "Claim content",
    body: "What is being alleged. It was the same sentence in all four cases, and it did not get truer or falser as the source changed.",
  },
  {
    term: "Provenance and access",
    body: "How this source came to hold it: what they were positioned to see, and whether what they hold is an observation, something they were told, an inference from surroundings, or a document.",
  },
  {
    term: "Corroboration",
    body: "Whether anything independent of the source supports it. A document and a dashboard are both closer to corroborable than a conversation, because they leave records somebody else can pull.",
  },
  {
    term: "Verification threshold",
    body: "What the body may conclude, as opposed to what it may now do. Every one of these four can justify doing something. None of them, alone, establishes that a treaty was violated.",
  },
];
