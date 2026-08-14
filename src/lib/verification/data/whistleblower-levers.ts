/**
 * 2.4.2's four levers, as a decision rather than a finished table.
 *
 * WHERE THIS COMES FROM. Every string here is the course owner's, lifted
 * verbatim from the four-row table that stood in the lesson body ("Four
 * different levers"): the mechanism names, the `source` sentences and the
 * `effect` sentences are hers, unedited. Nothing is added.
 *
 * `chip` is the only thing that is not a whole sentence of hers: it is the
 * noun phrase trimmed out of the head of her own `effect`, because a learner
 * cannot assign four options that each run to twenty words. The full sentence
 * is what the reveal prints.
 *
 * WHY IT IS A DECISION. The section presents five topics and then a lab; this
 * table was its one place where a learner can be wrong in an interesting way,
 * and it was delivered pre-answered. The interesting confusion is row 3
 * against row 4 — SB 53 puts an obligation to report on the developer, the ACM
 * Code puts one on the individual professional, and both read as "a duty to
 * report" until you ask on whom it falls and what backs it. Assigning all four
 * at once, one effect each, is what makes that comparison happen.
 *
 * ATTRIBUTION RIDES WITH THE ROW. Four different documents authorize these
 * four rows, and the body used to carry them as one trailing "Sources:" line,
 * which reads as though one source said all of it. Each row names and links
 * its own.
 *
 * Trap: that trailing line stays in the lesson anyway, and deliberately. The
 * citation collector reads lesson MDX, not widget data (see
 * rehype-lesson-citations), so moving these four URLs in here alone would
 * quietly drop SB 53 and the ACM Code out of the Works cited appendix — the
 * exact gap that was just closed for ReadingCard. Until the collector can see
 * code, the line is what keeps the appendix honest.
 */

export interface WhistleblowerLever {
  id: string;
  /** Her mechanism name. */
  name: string;
  /** Her "Source text" cell, verbatim. */
  source: string;
  /** The document that authorizes the row, and where it lives. */
  cite: { label: string; href: string };
  /** Her "What it changes" cell, verbatim — the reveal. */
  effect: string;
  /** The head of `effect`, trimmed to fit a chip. Hers, shortened. */
  chip: string;
}

export const WHISTLEBLOWER_LEVERS: WhistleblowerLever[] = [
  {
    id: "anti-retaliation",
    name: "Anti-retaliation protection",
    source:
      "California Labor Code §1107.1 bars specified rules, contracts, and retaliation for protected disclosures.",
    cite: {
      label: "California Labor Code §1107.1",
      href: "https://www.leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?article=&chapter=5.1.&division=2.&lawCode=LAB&part=3.&title=",
    },
    effect: "Creates a legal right and remedies after protected reporting.",
    chip: "A legal right and remedies",
  },
  {
    id: "financial-reward",
    name: "Financial reward",
    source:
      "Wasil et al. propose “financial incentives for verified information.”",
    cite: { label: "Wasil et al.", href: "https://arxiv.org/html/2408.16074" },
    effect:
      "Changes the reporter’s incentives; it does not establish that the report is true.",
    chip: "The reporter’s incentives",
  },
  {
    id: "mandatory-reporting",
    name: "Mandatory reporting",
    source:
      "SB 53 says a frontier developer “shall report any critical safety incident … within 15 days.”",
    cite: {
      label: "SB 53, Business and Professions Code §22757.13(c)",
      href: "https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202520260SB53",
    },
    effect:
      "Places an affirmative reporting duty on the developer rather than waiting for an insider to volunteer information.",
    chip: "A duty on the developer",
  },
  {
    id: "professional-duty",
    name: "Professional duty",
    source:
      "The ACM Code gives computing professionals an “obligation to report any signs of system risks that might result in harm.”",
    cite: {
      label: "ACM Code of Ethics §1.2",
      href: "https://www.acm.org/binaries/content/assets/about/acm-code-of-ethics-and-professional-conduct.pdf",
    },
    effect:
      "Makes escalation part of professional conduct, but supplies neither a safe channel nor a legal remedy on its own.",
    chip: "Escalation as professional conduct",
  },
];

/** Her sentence above the table, which is the instruction the task rests on. */
export const LEVERS_LEAD =
  "These sources describe four mechanisms that should not be treated as interchangeable.";
