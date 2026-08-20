
export interface WhistleblowerLever {
  id: string;
  name: string;
  source: string;
  cite: { label: string; href: string };
  effect: string;
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

export const LEVERS_LEAD =
  "The sources you have read so far describe four main buckets of mechanisms to protect whistleblowers. Map each mechanism to its main mode of leverage: whether it appeals to personal incentives, places a duty on the AI developer, appeals to upholding professional conduct, or utilizes legal remedies.";
