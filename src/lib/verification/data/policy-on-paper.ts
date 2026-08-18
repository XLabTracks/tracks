/**
 * 2.4.2 — Companies A and B: two reporting regimes and the demands made of
 * them, and what kind of thing each statement actually is. Authored for 2.4.4
 * and moved to 2.4.2 on 2026-08-15, where its material belongs; the ids and
 * storage keys are unchanged.
 *
 * THE TASK IS THE COURSE OWNER'S, from her 2.4 exercise plan and her revision
 * of it: three tabs, Published process / Documented context / Still unverified
 * per company tab, the learner marks every statement with its provenance, then
 * answers what incentives the combination creates and what further evidence
 * would be needed. Her instruction on naming: the companies are Company A and
 * Company B and are not named in the task.
 *
 * HER REVISION, and why the third tab is not a third company. It was one — a
 * firm with no published policy at all. She replaced it with what the
 * employees themselves demand (the June 2024 open letter), asking of each
 * demand what satisfying it would change structurally. That is the better
 * third term: a regime that publishes nothing has nothing to mark, while the
 * demands are the standard the other two tabs are then read against.
 *
 * Her other instruction, on Company B's last row: the retraction is
 * compulsory. A 2024 rule presented as still in force is an error, not
 * strictness — and a regime that moved under pressure is exactly this
 * section's material.
 *
 * WHY THE SOURCE IS REVEALED AND NOT HIDDEN. Anonymity here is the exercise's
 * mechanic — you judge the regime before you know whose it is — and not a
 * concealment: once all three tabs are committed, a spoiler headed "Sources"
 * opens on which letter was which company and every document each row was
 * read out of. A course page that made claims about a real company's internal
 * policy behind a letter, with no way to check, would be the thing this whole
 * section teaches learners to distrust.
 *
 * The citations live in that one block and nowhere else, because a link on a
 * committed row would name the company on tab A while tabs B and C were still
 * meant to be judged blind.
 *
 * WHERE EACH STATEMENT COMES FROM. Nothing here is written from memory. The
 * `cite` on every row is the document it was read out of:
 *
 *   A — the published policy itself (PDF, change log dated February 2026),
 *       downloaded and read in full, plus an external index.
 *   B — the documented history, via secondary reporting the aggregator cites
 *       (Vox, the Washington Post) plus the company's own retraction memo.
 *   The demands — the open letter itself.
 *
 * The `kind` on every row is the answer key, and it is a claim about the
 * EVIDENCE, not about the company: a rule printed in a policy is a published
 * rule whether or not it is honoured, and a company's account of its own
 * change is a self-report whether or not it is true. That distinction is the
 * whole exercise, and it is why "the policy says X" and "X happens" are
 * different rows.
 *
 * DELIBERATELY ABSENT: a claim that one company "quietly gutted" a safety
 * commitment in February 2026. It appeared in a secondary source during
 * research and the primary document was never opened, so it is not here.
 */

import type { WorkspaceQuestion } from "@/lib/verification/question-workspace";

/**
 * Her five provenance labels, in the order the learner sees them.
 *
 * `hint` is no longer rendered. It sat on each chip as a tooltip — "Published
 * rule: written down in a policy the company published" — which is the chip
 * saying itself again, and the five labels are the vocabulary the exercise is
 * teaching rather than terms it has to gloss. Kept in the data because it is
 * the one place the five are defined at all, and a future reveal may want them.
 */
export type Provenance =
  | "published-rule"
  | "self-report"
  | "prior-practice"
  | "external-assessment"
  | "not-established";

export const PROVENANCE: { id: Provenance; label: string; hint: string }[] = [
  {
    id: "published-rule",
    label: "Published rule",
    hint: "written down in a policy the company published",
  },
  {
    id: "self-report",
    label: "Company self-report",
    hint: "the company’s own account of what it does or did",
  },
  {
    id: "prior-practice",
    label: "Documented prior practice",
    hint: "what was reported to have actually happened",
  },
  {
    id: "external-assessment",
    label: "External assessment",
    hint: "somebody outside the company judging it",
  },
  {
    id: "not-established",
    label: "Not established",
    hint: "nobody has shown this either way",
  },
];

export interface PolicyStatement {
  id: string;
  /** Her three headings. */
  group: "published" | "context" | "unverified";
  text: string;
  kind: Provenance;
  /** Shown at the reveal: what this was read out of. */
  cite: { label: string; href: string };
  /** Ours, at the reveal, where the label is worth an argument. */
  note?: string;
}

export interface PolicyCompany {
  id: string;
  /** Anonymous in the task, by her instruction. */
  label: string;
  /**
   * Retired. It said what the tab was — "publishes a detailed reporting
   * policy", "as it was documented" — which is a characterisation of the
   * regime before the learner has made one. Kept in the type as optional so
   * the data does not have to be rewritten to drop it.
   */
  kicker?: string;
  /** Who the letter was, printed only in the Sources spoiler at the end. */
  realName: string;
  /** One line there where the identification needs a qualification. */
  realNote?: string;
  statements: PolicyStatement[];
}

/* The labels name their works plainly, because they are only ever printed in
   the Sources spoiler — after the letters have been cashed out. While the
   learner is still marking, no row carries a citation at all. */
const ANTHROPIC_POLICY = {
  label:
    "Anthropic, RSP Noncompliance Reporting and Anti-Retaliation Policy (PDF)",
  href: "https://www-cdn.anthropic.com/b7a5629e40b391b2adfb4cc8c0888ac9d6bfddf6/RSP%20Noncompliance%20Reporting%20and%20Anti-Retaliation%20Policy.pdf",
};
const FLI = {
  label: "Future of Life Institute, AI Safety Index — Summer 2026",
  href: "https://futureoflife.org/ai-safety-index-summer-2026/",
};
const RIGHT_TO_WARN = {
  label: "The letter in full, with its signatories and endorsers",
  href: "https://righttowarn.ai/",
};
const FILES = {
  label:
    "The OpenAI Files, “Transparency and Safety” — collecting Vox (18 May 2024) and the Washington Post (13 July 2024)",
  href: "https://www.openaifiles.org/transparency-and-safety",
};
const RETRACTION = {
  label:
    "CNBC, “OpenAI sends internal memo releasing former employees from non-disparagement agreements”, 24 May 2024",
  href: "https://www.cnbc.com/2024/05/24/openai-sends-internal-memo-releasing-former-employees-from-non-disparagement-agreements-sam-altman.html",
};

export const POLICY_COMPANIES: PolicyCompany[] = [
  {
    id: "a",
    label: "Company A",
    kicker: "Publishes a detailed reporting policy.",
    realName: "Anthropic",
    statements: [
      {
        id: "a-anon",
        group: "published",
        text: "Reports may be filed anonymously through an independent third-party platform.",
        kind: "published-rule",
        cite: ANTHROPIC_POLICY,
      },
      {
        id: "a-unmask",
        group: "published",
        text: "The company states that it cannot identify a reporter who uses the anonymous channel.",
        kind: "self-report",
        cite: ANTHROPIC_POLICY,
        note: "Two sentences from one document, a few lines apart, and not the same kind of claim. That a channel is permitted is a rule the company wrote. That the company is unable to unmask somebody using it is an assertion about its own systems, and nobody outside has tested it.",
      },
      {
        id: "a-informal",
        group: "published",
        text: "An informal conversation with a senior leader is not a report and triggers no investigation, until either the employee files one through a named channel or that leader confirms they have filed one on the employee’s behalf.",
        kind: "published-rule",
        cite: ANTHROPIC_POLICY,
        note: "A published rule can still be the gap: this one decides which conversations exist on the record. It has two ways out and the burden of both is on the employee — file it yourself, or be told the leader did.",
      },
      {
        id: "a-external",
        group: "published",
        text: "Nothing in the policy prohibits reporting potential violations of law to government authorities, and doing so is protected from retaliation.",
        kind: "published-rule",
        cite: ANTHROPIC_POLICY,
      },
      {
        id: "a-grade",
        group: "context",
        text: "An outside index scored this company highest of nine assessed firms on governance and accountability — a B, against an overall grade of C+.",
        kind: "external-assessment",
        cite: FLI,
        note: "Highest of nine is a ranking, not a pass, and it is one domain of an index whose leader it grades C+ overall.",
      },
      {
        id: "a-usage",
        group: "unverified",
        text: "How many reports the channel receives, and how they are resolved.",
        kind: "not-established",
        cite: FLI,
        note: "The index scores four things about governance here — protection, track record, policy quality, policy transparency — and none of them is this. The policy does not report it either, so nobody outside the company can say whether the channel is used.",
      },
    ],
  },
  {
    id: "b",
    label: "Company B",
    kicker: "As it was documented.",
    realName: "OpenAI",
    statements: [
      {
        id: "b-nda",
        group: "context",
        text: "A departing employee signed a lifetime ban on criticising the company.",
        kind: "prior-practice",
        cite: FILES,
      },
      {
        id: "b-secret",
        group: "context",
        text: "The existence of that agreement was itself covered by an NDA — admitting it existed was already a breach.",
        kind: "prior-practice",
        cite: FILES,
      },
      {
        id: "b-equity",
        group: "context",
        text: "Refusing to sign, or breaching, put every share of vested equity the employee had earned at risk.",
        kind: "prior-practice",
        cite: FILES,
      },
      {
        id: "b-sec",
        group: "context",
        text: "Whistleblowers filed a complaint with the securities regulator, alleging that the agreements required employees to waive their federal right to a whistleblower award and barred them from giving information to federal authorities without the company’s permission.",
        kind: "prior-practice",
        cite: FILES,
        note: "What happened, and is documented, is the filing. What the complaint says happened is an allegation inside it, which no regulator has ruled on. Marking the allegation as practice is the error 2.4.3 spends ten minutes on — evidence of a claim is not evidence that the claim is true — so the row states the filing and leaves the allegation as its content.",
      },
      {
        id: "b-grade",
        group: "context",
        text: "An outside index graded this company C on governance and accountability — second of the nine it assessed, behind a single B — and none of its recommendations to the company concerns reporting channels at all.",
        kind: "external-assessment",
        cite: FLI,
        note: "Tab B is otherwise all documented practice, which is why this row is here: it is the one judgement on it from outside. What the index does not say is part of the row — four recommendations about other things is not the same as having examined the channel and approved of it.",
      },
      {
        id: "b-retracted",
        group: "context",
        text: "After it became public in May 2024, the company withdrew the non-disparagement agreements and said it would not cancel anyone’s vested equity.",
        kind: "self-report",
        cite: RETRACTION,
        note: "The compulsory row. A 2024 rule presented as still in force is an error, not strictness — and the retraction is still the company’s account of its own conduct, which is a different kind of evidence from the agreements themselves.",
      },
    ],
  },
];

/**
 * The third tab. Not a company and not marked: the four demands the employees
 * themselves made, and her question — if these were satisfied, what would that
 * change structurally?
 *
 * The four are the letter's own principles, shortened; the letter is linked in
 * the Sources block so the full wording is one click away.
 */
export interface DemandTab {
  id: string;
  label: string;
  kicker: string;
  realName: string;
  realNote?: string;
  demands: { id: string; text: string }[];
  question: string;
  cite: { label: string; href: string };
}

export const POLICY_DEMANDS: DemandTab = {
  id: "d",
  label: "The demands",
  kicker: "What the employees themselves asked for.",
  realName: "“A Right to Warn about Advanced Artificial Intelligence”",
  realNote:
    "An open letter of 4 June 2024, signed by thirteen current and former employees of OpenAI and Google DeepMind — seven named, six anonymous — and endorsed by Yoshua Bengio, Geoffrey Hinton and Stuart Russell.",
  demands: [
    {
      id: "d-nodisparage",
      text: "No agreement that forbids risk-related criticism, and no withholding of earned payments for making it.",
    },
    {
      id: "d-anon",
      text: "A verifiably anonymous channel to the board, to regulators, and to an independent organization with relevant expertise.",
    },
    {
      id: "d-public",
      text: "A right to raise risk concerns publicly, so long as trade secrets are protected.",
    },
    {
      id: "d-noretaliation",
      text: "No retaliation for public disclosure once the other channels have failed.",
    },
  ],
  question: "If these were satisfied, what would that change structurally?",
  cite: RIGHT_TO_WARN,
};

/**
 * The task, stated where a task belongs — above the material, inside the
 * exercise. The lead sentence is the owner's (2026-08-18 edit document),
 * placed directly before "Every statement below…" on her instruction; the
 * task number went in the same edit, so `n` is gone and the widget prints
 * the two sentences as prose.
 */
export const POLICY_TASK = {
  lead: "Now, apply everything you have learned to an exercise with two organizations—A and B—where you will categorize provisions, articulate the incentives each set of rules creates, brainstorm additional evidence pipelines to quality-check the reporting institution, and steelman the points you make throughout.",
  instruction:
    "Every statement below concerns the reporting regime of one of two organisations, A or B, or is a demand made by employees of those organisations. Determine what kind of claim each statement is. Commit each set, then answer the two questions that follow.",
};

/**
 * Her two closing questions, verbatim, as the house's written-answer deck.
 *
 * They are the analysis this whole block is for, so they are on the page from
 * the moment it opens — not behind the tabs. That is `QuestionWorkspace`'s own
 * rule and the reason it exists: a question you only meet after the reading is
 * a question that sends you back through the reading. Here it was worse than
 * that, because the tabs commit: a learner who marked all three and only then
 * met the questions could not go back and re-read a row with the question in
 * mind.
 *
 * The title IS the question — no short label standing in for it, no body
 * paragraph elaborating it. Both are hers and neither needs help.
 *
 * Question 1 carries her later wording, which is the one that names what the
 * block is for: not the incentives of a situation but the incentives THESE
 * RULES create. It replaced "What incentives does this combination of rules,
 * history, and unresolved authority create?" from the original plan — same
 * subject, and the shorter one puts the rules in the sentence where the
 * learner has just spent ten minutes marking them.
 */
export const POLICY_QUESTIONS: WorkspaceQuestion[] = [
  {
    id: "incentives",
    n: 1,
    requirement: "required",
    title: "What underlying institutional incentives do these rules create?",
    body: [],
  },
  {
    id: "evidence",
    n: 2,
    requirement: "required",
    title:
      "What additional evidence would be needed to conclude that this reporting institution is independent, competent, and usable?",
    body: [],
  },
];

/** Its own localStorage document, as every workspace has. Permanent. */
export const POLICY_NOTES_KEY = "v-policy-on-paper-notes:v1";

export const POLICY_GROUPS: { id: PolicyStatement["group"]; label: string }[] =
  [
    { id: "published", label: "Published process" },
    { id: "context", label: "Documented context" },
    { id: "unverified", label: "Still unverified" },
  ];

/**
 * What the Sources spoiler prints: per letter, who it was and every document
 * its rows were read out of. Derived from the rows rather than written beside
 * them, so a source added to a statement cannot go missing from the list.
 */
export const POLICY_SOURCES = [
  ...POLICY_COMPANIES.map((c) => {
    const seen = new Set<string>();
    const cites = c.statements
      .map((s) => s.cite)
      .filter((cite) => !seen.has(cite.href) && seen.add(cite.href));
    return {
      id: c.id,
      label: c.label,
      realName: c.realName,
      realNote: c.realNote,
      cites,
    };
  }),
  {
    id: POLICY_DEMANDS.id,
    label: POLICY_DEMANDS.label,
    realName: POLICY_DEMANDS.realName,
    realNote: POLICY_DEMANDS.realNote,
    cites: [POLICY_DEMANDS.cite],
  },
];
