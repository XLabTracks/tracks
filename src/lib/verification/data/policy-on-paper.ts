/**
 * 2.4.4's optional extension: three reporting regimes, and what kind of thing
 * each statement about them actually is.
 *
 * THE TASK IS THE COURSE OWNER'S, from her 2.4 exercise plan: three tabs,
 * Published process / Documented context / Still unverified per tab, the
 * learner marks every statement with its provenance, then answers what
 * incentives the combination creates and what further evidence would be
 * needed. Her instruction on naming: the companies are Company A, B and C and
 * are not named in the task.
 *
 * WHY THE SOURCE IS REVEALED AND NOT HIDDEN. Anonymity here is the exercise's
 * mechanic — you judge the regime before you know whose it is — and not a
 * concealment: every statement carries its citation, shown once the learner
 * has committed. A course page that made claims about a real company's
 * internal policy behind a letter, with no way to check, would be the thing
 * this whole section teaches learners to distrust.
 *
 * WHERE EACH STATEMENT COMES FROM. Nothing here is written from memory. The
 * `cite` on every row is the document it was read out of:
 *
 *   A — the published policy itself (PDF, change log dated February 2026),
 *       downloaded and read in full.
 *   B — the documented history, via secondary reporting the aggregator cites
 *       (Vox, the Washington Post) plus the company's own retraction memo,
 *       plus a named external critique of the published policy.
 *   C — the external index's own finding that no policy exists to read.
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

/** Her five provenance labels, in the order the learner sees them. */
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
  /** One line of framing, so a tab is not a bare letter. */
  kicker: string;
  statements: PolicyStatement[];
}

const ANTHROPIC_POLICY = {
  label: "Published reporting policy (PDF)",
  href: "https://www-cdn.anthropic.com/b7a5629e40b391b2adfb4cc8c0888ac9d6bfddf6/RSP%20Noncompliance%20Reporting%20and%20Anti-Retaliation%20Policy.pdf",
};
const FLI = {
  label: "External safety index, summer 2026",
  href: "https://futureoflife.org/ai-safety-index-summer-2026/",
};
const TRANSFORMER = {
  label: "Transformer, “Can AI embrace whistleblowing?”, Dec 2025",
  href: "https://www.transformernews.ai/p/can-ai-embrace-whistleblowing-anthropic-openai",
};
const FILES = {
  label: "Aggregated documentation of prior practice",
  href: "https://www.openaifiles.org/transparency-and-safety",
};
const RETRACTION = {
  label: "Reported internal memo retracting the agreements",
  href: "https://www.cnbc.com/2024/05/24/openai-sends-internal-memo-releasing-former-employees-from-non-disparagement-agreements-sam-altman.html",
};

export const POLICY_COMPANIES: PolicyCompany[] = [
  {
    id: "a",
    label: "Company A",
    kicker: "Publishes a detailed reporting policy.",
    statements: [
      {
        id: "a-anon",
        group: "published",
        text: "Reports may be filed anonymously through an independent third-party platform, and the company states it cannot unmask an anonymous reporter.",
        kind: "published-rule",
        cite: ANTHROPIC_POLICY,
      },
      {
        id: "a-informal",
        group: "published",
        text: "An informal conversation with a senior leader is not a report, and triggers no investigation, unless that leader confirms they filed one.",
        kind: "published-rule",
        cite: ANTHROPIC_POLICY,
        note: "A published rule can still be the gap: this one decides which conversations exist on the record.",
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
        text: "An outside index scored this company highest of nine assessed firms on governance and accountability — a C+.",
        kind: "external-assessment",
        cite: FLI,
        note: "Highest of nine is a ranking, not a pass; the scale it leads is graded C+.",
      },
      {
        id: "a-usage",
        group: "unverified",
        text: "How many reports the channel receives, and how they are resolved.",
        kind: "not-established",
        cite: FLI,
        note: "The index treats publishing this as a separate indicator from having a policy at all.",
      },
    ],
  },
  {
    id: "b",
    label: "Company B",
    kicker: "Published a policy after its practice was reported.",
    statements: [
      {
        id: "b-first",
        group: "published",
        text: "It published a whistleblowing policy in October 2024, the first such company to do so.",
        kind: "published-rule",
        cite: TRANSFORMER,
      },
      {
        id: "b-nda",
        group: "context",
        text: "Departing employees signed agreements barring them from criticising the company for life, and acknowledging that the agreement existed was itself a breach.",
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
        id: "b-retracted",
        group: "context",
        text: "After the agreements were reported, the company said it had released former employees from them and would not cancel vested equity.",
        kind: "self-report",
        cite: RETRACTION,
        note: "Reported accurately, and still the company’s account of its own conduct — which is a different kind of evidence from the agreements themselves.",
      },
      {
        id: "b-legal",
        group: "unverified",
        text: "The published channel runs through the legal team — the same team that would answer on the company’s behalf.",
        kind: "external-assessment",
        cite: TRANSFORMER,
        note: "The routing is a published fact; that it is a conflict is somebody outside the company saying so.",
      },
    ],
  },
  {
    id: "c",
    label: "Company C",
    kicker: "Publishes nothing on reporting at all.",
    statements: [
      {
        id: "c-none",
        group: "published",
        text: "There is no published whistleblowing policy and no clear reporting channel to describe.",
        kind: "external-assessment",
        cite: FLI,
        note: "An absence somebody checked for and recorded is still somebody’s finding, not a rule.",
      },
      {
        id: "c-noincident",
        group: "context",
        text: "No reporting incident has been documented at this company either.",
        kind: "not-established",
        cite: FLI,
        note: "The row that catches people: no reported failures is not evidence the channel works, when there is no channel to fail.",
      },
      {
        id: "c-recommend",
        group: "unverified",
        text: "Whether any internal route exists that has simply never been described publicly.",
        kind: "not-established",
        cite: FLI,
      },
    ],
  },
];

/** Her two closing questions, verbatim. */
export const POLICY_QUESTIONS = [
  "What incentives does this combination of rules, history, and unresolved authority create?",
  "What additional evidence would be needed to conclude that this reporting institution is independent, competent, and usable?",
];

export const POLICY_GROUPS: { id: PolicyStatement["group"]; label: string }[] = [
  { id: "published", label: "Published process" },
  { id: "context", label: "Documented context" },
  { id: "unverified", label: "Still unverified" },
];
