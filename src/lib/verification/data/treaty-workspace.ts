/**
 * 1.1's workspace: read how an agreement is put together, then answer four
 * questions by skimming the MIRI treaty.
 *
 * There is no marking key and no score, deliberately. An earlier version had
 * both — a point bank per question, self-scoring, a facilitator key page — and
 * the author cut them. What is built here is a first orientation in what an
 * agreement looks like, and these are questions whose answer you can see is
 * right once you have found it. Do not reintroduce a key without being asked:
 * it turns reading a document into scoring against somebody's reading of it.
 *
 * The treaty is SKIMMED, not read. Fifteen Articles is more than this unit
 * needs, and the reader chunks by Article, so "page through until you can
 * answer" is a real instruction rather than a hope. What is read properly is
 * the reference: three short passages of a diplomatic practice guide saying
 * what the parts of a treaty are and where obligations may live.
 *
 * Question 1 carries the transferable skill and is first for that reason. The
 * test is grammatical, not thematic — a preambulatory clause opens with a
 * participle and ends in a comma; an operative one has a subject and a finite
 * verb. It survives contact with any treaty, and it is the test that catches
 * the trap this document sets: Article I is headed "Primary Purpose" and its
 * text is the central obligation of the whole agreement.
 */

export interface WorkspaceQuestion {
  id: string;
  title: string;
  prompt: string;
  /** Where to start paging. A place to look, never an answer. */
  hint?: string;
}

export interface WorkspaceReading {
  label: string;
  what: string;
  href: string;
}

export const TREATY = {
  paperSlug: "prevent-premature-asi-treaty",
  title:
    "An International Agreement to Prevent the Premature Creation of Artificial Superintelligence",
  authors: "MIRI Technical Governance Team — Scher, Abecassis, Barnett & Abeyta",
} as const;

const GUIDE =
  "https://www.eda.admin.ch/content/dam/eda/en/documents/publications/Voelkerrecht/Practice-Guide-to-International-Treatie-2023_EN.pdf";

/**
 * The reference, read properly before the questions. Page numbers are the
 * guide's own printed numbers, which run one ahead of the PDF page index —
 * cite the printed ones, they are what a reader sees on the page.
 */
export const WORKSPACE_READING: WorkspaceReading[] = [
  {
    label: "Practice Guide to International Treaties — pp. 13–15",
    what: "What a treaty is made of: title and preamble, the main body, then the final clauses — dispute settlement, entry into force, provisional application, denunciation and withdrawal — and annexes.",
    href: GUIDE,
  },
  {
    label: "the same guide — p. 42",
    what: "Interpretation: Articles 31–33 of the Vienna Convention, and the order they work in — ordinary meaning, in context, in the light of object and purpose.",
    href: GUIDE,
  },
  {
    label: "the same guide — Annex E, p. 47",
    what: "Specimen final clauses — signature, ratification, accession, entry into force — written out as they actually appear.",
    href: GUIDE,
  },
];

export const WORKSPACE_QUESTIONS: WorkspaceQuestion[] = [
  {
    id: "binding-line",
    title: "1. Mark up the preamble and Article I",
    prompt:
      "Where does the text stop being non-binding and start binding somebody? Mark the line. Then say what told you — what is different about the two sides of it?",
    hint: "Preamble and ARTICLE I. Read the verbs, not the headings.",
  },
  {
    id: "three-duties",
    title: "2. Take one prohibition apart",
    prompt:
      "Pick any one prohibition. What must a Party DO, what must it REFRAIN from, and what must it PERMIT? Not every prohibition has all three.",
    hint: "ARTICLE IV is the obvious one; V, VI and VIII also work.",
  },
  {
    id: "where-method",
    title: "3. Where is the method of verification?",
    prompt:
      "For the rule you just took apart: is the way compliance gets checked written into the Article, pushed into an annex, or left for a body to decide later? Say which, and quote the words that tell you.",
    hint: "Compare ARTICLE VII with ARTICLE IX.",
  },
  {
    id: "force-and-exit",
    title: "4. When does it start, and how do you leave?",
    prompt:
      "When does this agreement enter into force, and what must a Party do to withdraw? Compare what you find with the specimen clauses in Annex E of the guide.",
    hint: "ARTICLE XV — Withdrawal and Duration.",
  },
];

/**
 * How many answers the unit needs. Four questions, and somebody short of time
 * should be able to drop one — so this rounds rather than ceilings: 80% of
 * four is 3.2, and demanding four back would make the skip button a lie.
 */
export const WORKSPACE_REQUIRED = Math.max(
  1,
  Math.round(WORKSPACE_QUESTIONS.length * 0.8),
);
