
import type { WorkspaceQuestion } from "@/lib/verification/question-workspace";

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
  group: "published" | "context" | "unverified";
  text: string;
  kind: Provenance;
  cite: { label: string; href: string };
  note?: string;
}

export interface PolicyCompany {
  id: string;
  label: string;
  kicker?: string;
  realName: string;
  realNote?: string;
  statements: PolicyStatement[];
}

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

export const POLICY_TASK = {
  lead: "Now, apply everything you have learned to an exercise with two organizations—A and B—where you will categorize provisions, articulate the incentives each set of rules creates, brainstorm additional evidence pipelines to quality-check the reporting institution, and steelman the points you make throughout.",
  instruction:
    "Every statement below concerns the reporting regime of one of two organisations, A or B, or is a demand made by employees of those organisations. Determine what kind of claim each statement is. Commit each set, then answer the two questions that follow.",
};

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

export const POLICY_NOTES_KEY = "v-policy-on-paper-notes:v1";

export const POLICY_GROUPS: { id: PolicyStatement["group"]; label: string }[] =
  [
    { id: "published", label: "Published process" },
    { id: "context", label: "Documented context" },
    { id: "unverified", label: "Still unverified" },
  ];

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
