export interface ChainLink {
  id: string;
  name: string;
  what: string;
  owner: string;
  root: string;
  vendorRooted: boolean;
}

export interface ChainQuestion {
  id: string;
  q: string;
  answer: string[];
  why: string;
}

export const CHAIN: ChainLink[] = [
  {
    id: "rule",
    name: "Legal rule",
    what: "No covered party may conduct an unlicensed training run above threshold T during the pause.",
    owner: "The parties to the agreement",
    root: "The agreed text, and nothing technical",
    vendorRooted: false,
  },
  {
    id: "criteria",
    name: "License criteria",
    what: "The conditions under which an allowance is granted: quantity, window, site, workload class.",
    owner: "The treaty body or a national regulator",
    root: "Policy, written down",
    vendorRooted: false,
  },
  {
    id: "issuer",
    name: "Issuer",
    what: "The party that signs a license token and can decline to sign the next one.",
    owner: "Whoever holds the signing key: one government, both, or a multiparty authority",
    root: "The issuing key",
    vendorRooted: false,
  },
  {
    id: "device",
    name: "Authenticated device and state",
    what: "The chip proves which device it is and that its firmware matches an approved reference value before a token is accepted.",
    owner: "The chip vendor provisioned the identity; the operator holds the hardware",
    root: "The vendor's device key and reference values",
    vendorRooted: true,
  },
  {
    id: "operation",
    name: "Permitted operation",
    what: "The firmware allows work to proceed only while a valid, unexpired authorization is present.",
    owner: "The operator runs it; the vendor signed the firmware that enforces it",
    root: "Vendor-signed firmware",
    vendorRooted: true,
  },
  {
    id: "meter",
    name: "Meter or expiration",
    what: "A protected counter draws the allowance down as work proceeds, or a clock-cycle budget runs out.",
    owner: "The chip, in secure non-volatile memory",
    root: "Vendor-signed firmware and the chip's secure storage",
    vendorRooted: true,
  },
  {
    id: "suspension",
    name: "Suspension or revocation",
    what: "An authorization already issued is withdrawn, or the next one is withheld.",
    owner: "The issuer decides; the delivery path is usually the vendor's",
    root: "The issuing key, carried over vendor infrastructure",
    vendorRooted: true,
  },
  {
    id: "appeal",
    name: "Appeal or override",
    what: "A route to reverse a mistaken suspension, and a route to permit an exceptional use.",
    owner: "An institution, not a chip",
    root: "Institutional, and the weakest-specified link in every published design",
    vendorRooted: false,
  },
  {
    id: "renewal",
    name: "Renewal or termination",
    what: "The allowance is refreshed on evidence of compliance, or the device leaves the regime.",
    owner: "The issuer",
    root: "The issuing key",
    vendorRooted: false,
  },
];

export const QUESTIONS: ChainQuestion[] = [
  {
    id: "measures",
    q: "Which link measures the prohibited activity?",
    answer: ["meter"],
    why: "Only the meter counts anything. Every other link authenticates, authorises, decides or delivers. A licensing regime that reports a device as compliant is reporting that its allowance was not exhausted, which is a statement about the counter and not about what was trained.",
  },
  {
    id: "authenticates",
    q: "Which link only authenticates another component, and measures nothing itself?",
    answer: ["device"],
    why: "Device authentication establishes which chip is speaking and that its firmware matched a reference value at that moment. That is an identity claim in support of the meter's claim, not a second measurement of the work.",
  },
  {
    id: "decides",
    q: "Which link decides that the rule was broken?",
    answer: ["issuer"],
    why: "The issuer, by withholding the next authorization. This is the seam the FLI Draft Articles make concrete: the Agency's finding is what stops the chips, and the chip only notices at the start of the next clock cycle.",
  },
  {
    id: "stops",
    q: "Which link actually stops the machine?",
    answer: ["operation"],
    why: "The firmware check on the chip. Nothing upstream of it touches the hardware; a revoked license on a server somewhere changes nothing until the device refuses to complete a computation.",
  },
  {
    id: "unregistered",
    q: "Which link detects an accelerator that was never enrolled?",
    answer: [],
    why: "None of them. Every link in this chain begins with a device that already carries an identity and accepts tokens. An unenrolled card is outside the chain entirely, which is why 2.1.3 puts the registry beside it and why completeness closes from customs, foundry and site evidence rather than from the chip.",
  },
];

export const BREAK_QUESTION = {
  id: "vendor-key",
  q: "The vendor's root key is compromised. Mark every link that fails with it.",
  why: "Four of the nine. Device authentication, the enforcement in firmware and the protected meter all inherit the vendor's key, and revocation usually rides the vendor's own distribution path, so a compromise reaches it too. The rule, the criteria, the appeal route and renewal survive, because they were never technical. Count independent failure modes, not mechanism names: a signed meter, a signed identity and a licensing check that share one root are one mechanism wearing three labels.",
};
