export interface VerificationProblemOption {
  id: "trust" | "punish" | "open" | "verify";
  label: string;
  question: string;
  summary: string;
  outcome: string;
  detail: string[];
  holds: boolean;
}

export const VERIFICATION_PROBLEM = {
  eyebrow: "An introduction to the verification problem",
  title: "Two rivals. One treaty. Zero trust.",
  lede:
    "Two adversarial states have signed a mutual agreement limiting a dangerous technology. Neither believes the other for a second.",
  prompt:
    "How do you know the other party will uphold its obligations — and how does it know you will follow yours?",
  close: "Close",
  options: [
    {
      id: "trust",
      label: "Option 01",
      question: "Trust?",
      summary:
        "A handshake, a signature and a promise kept on honor alone.",
      outcome: "It collapses",
      detail: [
        "You could trust each other, and trust each other’s trust. Works with friends, but not with nation-state adversaries incentivized to self-protect by gaining the secret upper hand, and especially not when dealing with the development of high-risk technologies.",
      ],
      holds: false,
    },
    {
      id: "punish",
      label: "Option 02",
      question: "Punish violations?",
      summary:
        "Sanctions, retaliation and consequences severe enough to deter misconduct.",
      outcome: "It arrives too late",
      detail: [
        "In the absence of trust, they could penalize violations of the agreement and preempt misconduct. But deterrence depends upon the reliability of tracking each party’s actions. Moreover, an ex-post regime fails when consequences are immediate, far-reaching, and irreversible: no fine can bring back the dead.",
      ],
      holds: false,
    },
    {
      id: "open",
      label: "Option 03",
      question: "Mutual transparency?",
      summary:
        "Open the books, show the facilities and publish the research.",
      outcome: "It backfires",
      detail: [
        "They could mutually disclose actions, but increased transparency risks theft of proprietary information or prototypes by adversaries. Each party is still incentivized to develop a secret advantage and fabricate compliance.",
      ],
      holds: false,
    },
    {
      id: "verify",
      label: "Option 04",
      question: "Neutral, privacy-preserving verification mechanisms?",
      summary:
        "Prove compliance without surrendering the secrets around it.",
      outcome: "It holds",
      detail: [
        "What if you could mutually verify compliance without risking undue loss of privacy? If each party could verify the other’s compliance without learning their secrets, knowing they can do the same, they have fewer material incentives to dodge compliance. Verification displaces the impossible promise of trust in a volatile adversary toward trust in a shared, robust verification regime.",
      ],
      holds: true,
    },
  ] satisfies VerificationProblemOption[],
} as const;
