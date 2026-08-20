/**
 * Human-authored copy from tracksprogramplayground's Verification Problem
 * prototype. Presentation lives in the native widget; this file is the pin
 * that keeps the lesson copy separate from interaction state.
 *
 * Reshaped on the owner's instruction (2026-08-20): the framing chrome
 * ("Two rivals. One treaty. Zero trust.", the lede, the option labels,
 * summaries and inspect-to-reveal outcomes) is gone. What remains is exactly
 * her text: four buckets in descending order, each a question and its answer.
 */
export interface VerificationProblemBucket {
  question: string;
  text: string;
}

export const VERIFICATION_PROBLEM = {
  buckets: [
    {
      question: "Trust?",
      text: "You could trust each other, and trust each other’s trust. Works with friends, but not with nation-state adversaries incentivized to self-protect by gaining the secret upper hand, and especially not when dealing with the development of high-risk technologies.",
    },
    {
      question: "Punish violations?",
      text: "In the absence of trust, they could penalize violations of the agreement and preempt misconduct. But deterrence depends upon the reliability of tracking each party’s actions. Moreover, an ex-post regime fails when consequences are immediate, far-reaching, and irreversible: no fine can bring back the dead.",
    },
    {
      question: "Mutual transparency?",
      text: "They could mutually disclose actions, but increased transparency risks theft of proprietary information or prototypes by adversaries. Each party is still incentivized to develop a secret advantage and fabricate compliance.",
    },
    {
      question: "Neutral, privacy-preserving verification mechanisms?",
      text: "It holds. What if you could mutually verify compliance without risking undue loss of privacy? If each party could verify the other’s compliance without learning their secrets, knowing they can do the same, they have fewer material incentives to dodge compliance. Verification displaces the impossible promise of trust in a volatile adversary toward trust in a shared, robust verification regime.",
    },
  ] satisfies VerificationProblemBucket[],
} as const;
