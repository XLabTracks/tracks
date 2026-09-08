export interface VerificationProblemOption {
  id: "trust" | "punish" | "open" | "verify";
  question: string;
  detail: string;
  holds: boolean;
}

export const VERIFICATION_PROBLEM = [
  {
    id: "trust",
    question: "Trust?",
    detail:
      "You could trust each other, and trust each other’s trust. Works with friends, but not with nation-state adversaries incentivized to self-protect by gaining the secret upper hand, and especially not when dealing with the development of high-risk technologies.",
    holds: false,
  },
  {
    id: "punish",
    question: "Punish violations?",
    detail:
      "In the absence of trust, they could penalize violations of the agreement and preempt misconduct. But deterrence depends upon the reliability of tracking each party’s actions. Moreover, an ex-post regime fails when consequences are immediate, far-reaching, and irreversible: no fine can bring back the dead.",
    holds: false,
  },
  {
    id: "open",
    question: "Mutual transparency?",
    detail:
      "They could mutually disclose actions, but increased transparency risks theft of proprietary information or prototypes by adversaries. Each party is still incentivized to develop a secret advantage and fabricate compliance.",
    holds: false,
  },
  {
    id: "verify",
    question: "Neutral, privacy-preserving verification mechanisms?",
    detail:
      "What if you could mutually verify compliance without risking undue loss of privacy? If each party could verify the other’s compliance without learning their secrets, knowing they can do the same, they have fewer material incentives to dodge compliance. Verification displaces the impossible promise of trust in a volatile adversary toward trust in a shared, robust verification regime.",
    holds: true,
  },
] satisfies VerificationProblemOption[];
