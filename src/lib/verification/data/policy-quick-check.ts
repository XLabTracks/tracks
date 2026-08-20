/**
 * 2.4.2 — On Paper. Five single-answer questions, seven to ten minutes.
 *
 * THE ONLY MULTIPLE CHOICE IN 2.4, and deliberately. The section's rhythm is
 * creative short answer → fast discrimination → controlled comparison →
 * real-world analysis, and this is the fast one. What makes it legitimate here
 * is that nothing else in the section is multiple choice.
 *
 * ALL OF IT IS THE COURSE OWNER'S, transcribed from her source-grounded MCQ
 * specification: the fact patterns, the options, the answers, the feedback and
 * the source line under each. Nothing here is inferred from the statutes — the
 * legal content is hers, and a correction to it belongs in that spec first.
 *
 * The design rule the spec states, because it is what the questions have to
 * keep being tested against: these must test whether the learner understood
 * and can apply the assigned readings, not whether they have good generic
 * intuitions about whistleblowing. So every answer turns on a detail of one of
 * three texts — California Labor Code §§1107–1107.2, the AIWI/CARMA best
 * practice guide, and CIGIE's 2025 Quality Standards for Investigations — each
 * distractor misses one legally or institutionally material condition, and the
 * correct option is the most complete and precise application of the source.
 *
 * `**bold**` in any of these strings is the owner's own emphasis, kept: each
 * stem marks the text the answer turns on, which is what tells a reader which
 * of the three readings a question is asking about. Rendered by splitEmphasis
 * — that one mark and nothing else, so a data file can never inject markup.
 *
 * `source` is the passage the answer rests on, shown only after submission.
 * There is no conceptual label: naming what a question "is testing" is the
 * pedagogical scaffolding the spec rules out, and after the fact the source
 * citation is the more useful of the two anyway — it says where to go back to.
 */

export interface QuickChoice {
  id: string;
  text: string;
}

export interface QuickQuestion {
  id: string;
  /** The fact pattern. Rendered as its own block above the stem. */
  fragment: string;
  /** Introduces the numbered facts, when the pattern has a list. */
  facts?: string[];
  /** Continues the fact pattern under the list. */
  fragmentAfter?: string;
  /** The question itself. */
  stem: string;
  choices: QuickChoice[];
  answerId: string;
  /** Why the answer is the answer, and what each near miss got wrong. */
  explanation: string;
  /** The passage the answer rests on. Shown only after submission. */
  source: string;
}

export const QUICK_QUESTIONS: QuickQuestion[] = [
  {
    id: "covered-employee",
    fragment: "A frontier developer employs four people:",
    facts: [
      "Nora, a safety engineer responsible for assessing critical safety incidents;",
      "Leon, a software engineer with no responsibility for assessing, managing, or addressing such risks;",
      "Maya, an outside contractor conducting an evaluation for the developer;",
      "Sam, a safety engineer responsible for critical-risk assessment.",
    ],
    fragmentAfter:
      "Nora has reasonable cause to believe that the developer’s activities create a specific and substantial danger to public safety resulting from a catastrophic risk. Leon has the same belief. Maya has the same belief. Sam merely disagrees with management’s general research strategy and does not believe that either a qualifying danger or a violation of the relevant chapter has occurred.",
    stem: "Which disclosure is protected by **California Labor Code §1107.1(a)** on the facts stated?",
    choices: [
      {
        id: "a",
        text: "Nora reports the concern to the California Attorney General.",
      },
      { id: "b", text: "Leon reports the concern to a federal authority." },
      {
        id: "c",
        text: "Maya reports the concern to the California Attorney General.",
      },
      {
        id: "d",
        text: "Sam reports his disagreement to another safety engineer authorized to investigate internal concerns.",
      },
    ],
    answerId: "a",
    explanation:
      "§1107 defines a “covered employee” as an employee responsible for assessing, managing, or addressing risk of critical safety incidents. §1107.1(a) protects disclosures by such a covered employee to specified recipients when the employee has reasonable cause to believe the information discloses either a qualifying public-safety danger resulting from catastrophic risk or a violation of the specified chapter. Nora satisfies the status, subject-matter, belief, and recipient conditions. Leon is an employee but is not a “covered employee” under the definition given. Maya is an outside contractor, not a covered employee under §1107 itself. Sam is a covered employee and uses a named type of recipient, but the stated subject matter does not satisfy §1107.1(a).",
    source: "California Labor Code §§1107(b), 1107.1(a).",
  },
  {
    id: "internal-process",
    fragment: "A large frontier developer creates the following internal process:",
    facts: [
      "covered employees may file reports anonymously;",
      "the reporter receives a status update every month;",
      "disclosures and responses are shared with the company’s officers and directors every quarter;",
      "if a report alleges wrongdoing by a particular director, that director still receives the quarterly disclosure because all directors must receive the same information.",
    ],
    stem: "Which assessment is most accurate under **§1107.1(e)**?",
    choices: [
      {
        id: "a",
        text: "The process satisfies the statute because anonymity, monthly updates, and quarterly board-level reporting are all present.",
      },
      {
        id: "b",
        text: "The process fails because the statute requires the internal channel to be administered by an external organization.",
      },
      {
        id: "c",
        text: "The process fails because a director accused of wrongdoing should not receive the disclosure or response concerning that allegation.",
      },
      {
        id: "d",
        text: "The process fails because reports must be sent to officers and directors immediately rather than quarterly.",
      },
    ],
    answerId: "c",
    explanation:
      "For a large frontier developer, §1107.1(e) requires a reasonable anonymous internal process, monthly updates to the person who made the disclosure, and quarterly sharing of disclosures and responses with officers and directors. But the statute expressly creates an exception where a disclosure or response alleges wrongdoing by an officer or director: the sharing requirement does not apply with respect to that person. The statute does not require an external administrator for this internal process, and quarterly — not immediate — sharing is what the provision specifies.",
    source: "California Labor Code §1107.1(e)(1)–(2).",
  },
  {
    id: "amendment-package",
    fragment: "A proposed AI whistleblowing law has the following features:",
    facts: [
      "employees may report concerns internally to their manager;",
      "the company offers an anonymous internal reporting form administered by the legal department;",
      "retaliation for protected disclosures is prohibited;",
      "employees may confidentially report violations to a regulator, but the external channel does not accept anonymous reports;",
      "contractors, outside evaluators, and former employees are not protected.",
    ],
    stem: "Which amendment package most closely matches the **AIWI/CARMA Best Practice Guide**?",
    choices: [
      {
        id: "a",
        text: "Keep the protected-person category unchanged, move the internal channel outside executive management and legal, and permit anonymous external reports to relevant authorities.",
      },
      {
        id: "b",
        text: "Extend protection to contractors, evaluators, and former employees; make the internal channel independent of executive management and legal; and permit confidential and anonymous external reporting to relevant authorities.",
      },
      {
        id: "c",
        text: "Extend protection to contractors and former employees, but require all disclosures to begin internally before any external authority may receive them.",
      },
      {
        id: "d",
        text: "Keep the internal channel under the legal department, extend protection to contractors and evaluators, and replace anonymous reporting with stronger penalties for retaliation.",
      },
    ],
    answerId: "b",
    explanation:
      "The Guide recommends a broader protected-person category that includes third-party evaluators, contractors, former employees, and others. It recommends that the anonymous/confidential internal process be independent of executive management and the legal team, preferably with board governance. It also recommends that covered persons be able to report confidentially and anonymously to relevant external authorities. The other packages each preserve at least one feature that conflicts with those recommendations.",
    source: "AIWI/CARMA, “Protected Individuals” and “Disclosure Channels.”",
  },
  {
    id: "reasonable-belief",
    fragment:
      "A safety researcher raises a concern as part of her ordinary job duties. She reasonably believes the concern is true. Her motivation is mixed: she believes the issue is important, but she is also angry about a recent promotion decision. Six months later, an investigation cannot substantiate the underlying concern.",
    stem: "Which statement best reflects the **AIWI/CARMA Best Practice Guide**?",
    choices: [
      {
        id: "a",
        text: "The disclosure should lose protection because the concern was not ultimately substantiated.",
      },
      {
        id: "b",
        text: "The disclosure should lose protection because reporting the concern was already part of the researcher’s job.",
      },
      {
        id: "c",
        text: "Protection should not turn on the researcher’s motive, the fact that the disclosure was duty speech, or later failure to substantiate the allegation, provided the reasonable-belief standard was satisfied.",
      },
      {
        id: "d",
        text: "Protection should depend on whether the researcher can prove that safety rather than the promotion dispute was her primary motive.",
      },
    ],
    answerId: "c",
    explanation:
      "The Guide recommends a reasonable-belief standard rather than requiring the disclosure ultimately to prove correct. It also recommends protecting disclosures regardless of motive and explicitly protecting “duty speech” — concerns raised as part of the employee’s ordinary work. The other answers each make protection depend on a condition the Guide recommends excluding.",
    source: "AIWI/CARMA, “Scope of Protected Disclosures.”",
  },
  {
    id: "investigation-standard",
    fragment:
      "An investigator receives a credible allegation that an AI developer concealed a prohibited training run. The complainant provides screenshots and names two witnesses. The developer supplies a summary prepared by its legal team but refuses access to the underlying records. One witness supports the allegation; the other provides information tending to exculpate the developer.",
    stem: "Which course of action is most consistent with the **CIGIE Quality Standards for Investigations (2025)**?",
    choices: [
      {
        id: "a",
        text: "Treat the credible complaint and supporting witness as sufficient for a finding, because complaint evaluation occurs before full evidence collection.",
      },
      {
        id: "b",
        text: "Obtain and analyze relevant evidence lawfully, seek to verify the validity of the information, preserve required evidentiary integrity, include relevant exculpatory material, and limit the final report to findings supported by the case file.",
      },
      {
        id: "c",
        text: "Exclude the exculpatory witness from the final report because the investigator’s task is to determine whether the original allegation can be substantiated.",
      },
      {
        id: "d",
        text: "Accept the developer’s legal-team summary in place of the underlying records because evidence supplied by counsel has already undergone internal review.",
      },
    ],
    answerId: "b",
    explanation:
      "CIGIE requires objective investigation of allegations, including receptiveness to both incriminating and exculpatory evidence. Relevant evidence must be lawfully obtained, its validity should be verified, and chain-of-custody/admissibility requirements must be preserved where applicable. Reports must be supported by evidence and documentation in the case file and include relevant exculpatory or mitigating information. A credible allegation can justify investigative activity; it is not itself a final finding. The Standards do not permit investigators to omit exculpatory evidence or substitute an interested party’s summary for needed underlying evidence merely because counsel prepared it.",
    source:
      "CIGIE, Quality Standards for Investigations (2025) — Complaint Evaluation; Executing Investigations; Collecting Evidence; Reporting.",
  },
];
