/**
 * The sealed feasibility ranking (2.0) and its reopening (4.1), ported from
 * the retired static player's `data/exercises.js` (`ex-mechanism-rank` and
 * `ex-reopen`). Every learner-facing string is the authored original —
 * nothing here composes a sentence of its own.
 *
 * The storage keys are the old engine's `vt-ex:<id>`, and they are permanent:
 * a ranking sealed under the static player resurfaces here untouched, and the
 * reopen widget reads the seal through the same key.
 */

export interface RankItem {
  id: string;
  t: string;
}

export const RANK_ITEMS: RankItem[] = [
  { id: "attest", t: "Chip identity and remote attestation" },
  { id: "meter", t: "Tamper-resistant compute metering" },
  { id: "pol", t: "Proof-of-learning / probabilistic recomputation" },
  { id: "kyc", t: "Cloud KYC and training-run declarations" },
  { id: "ntm", t: "National technical means and physical signatures" },
  { id: "audit", t: "On-site audits and challenge inspections" },
  { id: "whistle", t: "Whistleblower channels and insider reporting" },
];

export const MECHANISM_RANK = {
  storageKey: "vt-ex:ex-mechanism-rank",
  title: "Feasibility ranking — sealed",
  lede: "Before you learn how any of these work: order them from most to least feasible to stand up today. Your order is stored and reopened in 4.1.",
  sealButton: "Seal this order",
  sealedLabel: "Sealed",
  sealNote:
    "No key, and no score. This ranking exists to be revised — 4.1 shows it back to you and asks what moved.",
} as const;

export const MECHANISM_RANK_REOPEN = {
  storageKey: "vt-ex:ex-reopen",
  priorKey: "vt-ex:ex-mechanism-rank",
  priorLabel: "Sealed in 2.0",
  title: "Reopen your ranking",
  lede: "Here is the feasibility order you sealed in 2.0. Re-rank it now, then say what moved and why.",
  prompt:
    "For every item that moved by two places or more, write one sentence: which fact changed your mind, and where did you get it?",
  notesPlaceholder: "Your reasoning — stored in this browser.",
  sealButton: "Seal this order",
  sealedLabel: "Sealed",
  sealNote:
    "Still no key. A revision with a reason is the assessed artifact; a revision without one is a coin flip.",
} as const;
