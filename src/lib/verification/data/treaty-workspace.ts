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
 * what the parts of a treaty are and where obligations may live. Those live
 * in the lesson body as a ReadingCard, not here — a work the course assigns
 * belongs where the other assigned readings are, and naming the pages in two
 * places is how the two come to disagree about them.
 *
 * Question 1 carries the transferable skill and is first for that reason. The
 * test is grammatical, not thematic — a preambulatory clause opens with a
 * participle and ends in a comma; an operative one has a subject and a finite
 * verb. It survives contact with any treaty, and it is the test that catches
 * the trap this document sets: Article I is headed "Primary Purpose" and its
 * text is the central obligation of the whole agreement.
 */

export interface WorkspaceQuestion {
  /** Storage key under `vt-workspace:1.1`. Permanent — never renumber it. */
  id: string;
  title: string;
  /** The lead paragraph, which may introduce `items`. */
  prompt: string;
  /** The list the prompt introduces, where it has one. */
  items?: string[];
  /** What follows that list. */
  after?: string;
  /**
   * A pointer, never an answer. The label is per question because they are
   * not the same kind of pointer: "Guidance" is how to look, "Relevant
   * provision" is where.
   */
  note?: { label: string; text: string };
}

export const TREATY = {
  paperSlug: "prevent-premature-asi-treaty",
  title:
    "An International Agreement to Prevent the Premature Creation of Artificial Superintelligence",
  authors:
    "MIRI Technical Governance Team — Scher, Abecassis, Barnett, and Abeyta",
} as const;

export const WORKSPACE_QUESTIONS: WorkspaceQuestion[] = [
  {
    id: "binding-line",
    title: "1. Distinguish between non-binding and binding provisions",
    prompt:
      "Examine the Preamble and Article I. Identify and mark the exact point at which the text begins to impose a binding obligation on a specific actor. Explain which grammatical or legal features distinguish the provisions on either side of this point.",
    note: {
      label: "Guidance",
      text: "Focus on the verbs used rather than on the section headings.",
    },
  },
  {
    id: "three-duties",
    title: "2. Analyse the components of a prohibition",
    prompt:
      "Select one prohibition contained in Article IV, V, VI, or VIII. Identify:",
    items: [
      "what a Party is required to do;",
      "what a Party is required to refrain from doing;",
      "what a Party is required to permit.",
    ],
    after:
      "A prohibition may not contain all three types of requirement. Support your answer with references to the relevant text.",
  },
  {
    id: "where-method",
    title: "3. Locate the verification method",
    prompt:
      "For the prohibition selected in Question 2, determine where the method for verifying compliance is established. Is it:",
    items: [
      "specified in the relevant article;",
      "set out in an annex;",
      "or left to an institution or other body to determine?",
    ],
    after: "Support your conclusion with a quotation from the agreement.",
    note: { label: "Guidance", text: "Compare Articles VII and IX." },
  },
  {
    id: "force-and-exit",
    title: "4. Examine entry into force and withdrawal",
    prompt:
      "Determine when the agreement enters into force and describe the procedure by which a Party may withdraw from it. Identify any applicable conditions or notice periods. Compare these provisions with the model clauses in Annex E of the Practice Guide to International Treaties.",
    note: {
      label: "Relevant provision",
      text: "Article XV, Withdrawal and Duration.",
    },
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
