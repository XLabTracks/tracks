/**
 * 2.1's opening puzzle: the seven conclusions a learner grades before reading
 * the hardware section, and grades again at its end.
 *
 * The copy is the author's, transcribed verbatim from the WIP outline's "2.1
 * Hardware" tab ("Before you begin"). It lives here rather than in the two
 * lesson bodies because the puzzle is printed twice — the ledger in 2.1 and
 * its recall in 2.1.8 — and the second printing must be the same seven claims
 * in the same order or the recall lines up against the wrong row.
 *
 * The option ids are storage keys. They are permanent: renaming one discards
 * every learner's recorded judgment on it.
 */

export type ClaimLedgerSet = {
  /** The stem the learner is grading these conclusions against. */
  lead: string;
  claims: string[];
  options: { id: string; text: string }[];
};

export const HARDWARE_OPENING_PUZZLE: ClaimLedgerSet = {
  lead: "Proposed conclusion",
  claims: [
    "These are genuine covered devices.",
    "Their certificates and approved configurations were valid when the evidence was checked.",
    "The devices were connected in the declared cluster topology.",
    "They performed inference rather than prohibited training.",
    "Their cumulative training compute remained below the treaty threshold.",
    "No unregistered accelerators ran a separate prohibited workload.",
    "The treaty authority can suspend the devices.",
  ],
  options: [
    { id: "supported", text: "Supported" },
    {
      id: "possibly",
      text: "Possibly supported if the system was designed to measure it",
    },
    { id: "unsupported", text: "Unsupported by attestation alone" },
  ],
};

/** Every set a `<ClaimLedger set="…"/>` in a lesson body can name. */
export const CLAIM_LEDGER_SETS: Record<string, ClaimLedgerSet> = {
  "hardware-opening": HARDWARE_OPENING_PUZZLE,
};
