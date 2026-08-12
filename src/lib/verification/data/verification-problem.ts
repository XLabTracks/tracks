/**
 * Human-authored copy from tracksprogramplayground's Verification Problem
 * prototype. Presentation lives in the native widget; this file is the pin
 * that keeps the lesson copy separate from interaction state.
 */
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
        "Trust works with friends. It does not work with nation-state adversaries incentivized to self-protect by gaining the secret upper hand — especially when the agreement concerns high-risk technologies.",
        "Each side knows the other has every reason to quietly hedge. And each knows the other knows. Under that pressure, good faith is the first casualty.",
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
        "Deterrence depends on reliably tracking each party's actions: you can only punish what you can detect. A hidden program can run for years before anyone notices.",
        "An after-the-fact regime also fails when consequences are immediate, far-reaching and irreversible. No fine can bring back the dead.",
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
        "Increased transparency risks theft of proprietary information or prototypes by the adversary receiving the disclosure. Openness becomes its advantage.",
        "It does not guarantee honesty: each party remains incentivized to develop a secret edge and fabricate compliance in the paperwork it publishes.",
      ],
      holds: false,
    },
    {
      id: "verify",
      label: "Option 04",
      question: "Privacy-preserving verification?",
      summary:
        "Prove compliance without surrendering the secrets around it.",
      outcome: "It holds",
      detail: [
        "A neutral mechanism sits between the parties. It answers the compliance question while revealing no more than the agreement requires.",
        "Neither side has to believe the other. They only have to believe a shared, robust mechanism that both can inspect.",
      ],
      holds: true,
    },
  ] satisfies VerificationProblemOption[],
} as const;
