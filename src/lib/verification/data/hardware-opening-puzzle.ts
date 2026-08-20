
export type ClaimLedgerSet = {
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

export const CLAIM_LEDGER_SETS: Record<string, ClaimLedgerSet> = {
  "hardware-opening": HARDWARE_OPENING_PUZZLE,
};
