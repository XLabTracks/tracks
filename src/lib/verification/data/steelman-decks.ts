/**
 * The steelman decks for 2.4's written exercises.
 *
 * Ours, and the one thing in the module that is deliberately not curriculum:
 * a challenge card makes no claim about the subject, it asks the writer a
 * question about their own answer. Every card here can be answered "yes, I
 * did that" or "no, and here is why not" — none of them tells anybody what to
 * think about reporting institutions.
 *
 * One deck per exercise, because the objections that bite differ. A card that
 * asks whether your failure point survives a more senior insider is useless
 * against a fifty-word comparison of four sources, and a deck of generic
 * writing advice would be the thing the whole module was rebuilt to avoid.
 *
 * Kept short on purpose. Fourteen cards is a deck somebody draws from twice;
 * eight is a deck somebody could in principle exhaust, which is the honest
 * shape when the exercise takes ten minutes.
 */

/** 2.4.1 — the constructed case. */
export const CASE_DECK = [
  "Who in your case would have to be lying for it to fall apart? If the answer is nobody, condition 1 is doing real work.",
  "Your insider knows what they know from one place. Name a second place the same fact could have come from — and say why it did not.",
  "If your failure were fixed tomorrow by one rule change, which rule?",
  "Would your failure read the same if the insider were two levels more senior? If yes, it may not be about access at all.",
  "Who is the first person to receive this report, and what do they personally lose by acting on it?",
  "Is your failure about permission, about records, or about identification? Cases that blur the three usually have not chosen one.",
  "Strip every adjective from your failure point. Is there still a mechanism underneath?",
  "What would a verifier have to obtain for this report to become actionable? If nothing would, you may have written a false allegation rather than a failed verification.",
];

/** 2.4.3 — four sources, one claim. */
export const CLAIM_DECK = [
  "A and D differ only in how the source came to hold the claim. Why did your next step differ?",
  "Name the one piece of evidence that would make your answers to B and C converge.",
  "Which of your four answers claims the most? Is it the one standing on the most evidence?",
  "Would your answer to C change if the power draw had been declared in advance?",
  "You recommended a step. Who carries it out, and what do they need that they do not have?",
  "Is the corroboration you are asking for a record, a person, or a measurement? Say which.",
  "Which of the four could be wrong about what they think happened while the allegation is still true?",
  "Is anything in your answers a fact about the source rather than about what the source can support?",
];

/** 2.4.4 — two regimes and the letter. */
export const INSTITUTION_DECK = [
  "You named an incentive. Who exactly faces it — the reporter, their manager, or the company?",
  "If the rule you are worried about were deleted tomorrow, what would change in practice?",
  "Which of your claims is about what is written down, and which about what happens? Fence them apart.",
  "Name the evidence that would change your mind about this institution being usable.",
  "Would your answer survive if the company published its report numbers and they were high?",
  "Is your objection about independence, about competence, or about usability? Each is a different repair.",
  "What would the company say in one sentence in reply — and is it wrong?",
  "Which of your points applies to both regimes, and is therefore not a difference between them?",
];
