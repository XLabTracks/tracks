export interface LcRow {
  block: string;
  mechanism: string;
  details: string;
  feasibility: string;
  timeline: string;
  prevWork: string;
  notes: string;
}

export const LC_SOURCE = {
  work: "Mechanisms to Verify International Agreements About AI Development",
  by: "Scher and Thiergart (MIRI, 2024)",
  where: "the Locating Compute Building Blocks table, appendix pp. 67–80",
  url: "https://arxiv.org/abs/2506.15867",
  caveat: "preliminary, quick estimates",
};

export const LC_INTEL_BLOCK = "National intelligence operations";
export const LC_RATE_ORDER = ["High", "Medium", "Low", "Very low"];
export const LC_MIN_ANSWER = 60;
export const LC_MIN_PUSHBACK = 40;

export const LC_PROMPTS = [
  {
    key: "assumption",
    label: "Assumption",
    q: "Name the strongest thing that must be TRUE for your rating to hold. One or two sentences.",
  },
  {
    key: "cooperation",
    label: "Cooperation",
    q: "Whose cooperation does this mechanism need, and what do they get in return for giving it?",
  },
  {
    key: "redteam",
    label: "Red team",
    q: "You run the evader’s program with a state budget. What is your first move against this mechanism?",
  },
];

export const LC_ROWS: LcRow[] = [
  {
    block: "Chip ownership and location registry",
    mechanism: "Chip ownership and location registry",
    details:
      "Owners of AI chips and data center operators must register the chips they own, and where those chips are located, with a central regulator. Chip sales require updating the registry with the new owner and location.",
    feasibility: "High",
    timeline: "<1 year",
    prevWork:
      "Jones (2024); Shavit (2023); Baker (2023); Fist & Grunewald (2023)",
    notes: "",
  },
  {
    block: "Chip ownership and location registry",
    mechanism: "Data center registry",
    details:
      "Data centers that have no AI chips but could later be repurposed for AI use may also need to register with a central regulator. “Data center” can be defined quite broadly, and it is unclear which data centers would need to register.",
    feasibility: "High",
    timeline: "<1 year",
    prevWork: "",
    notes:
      "An initial registration trigger might be current consumption above 1 MW — roughly 1,000 H100 GPUs. There are likely thousands to tens of thousands of such data centers today (Pilz & Heim, 2023).",
  },
  {
    block: "Flexible Hardware-Enabled Guarantee (FlexHEG) mechanisms",
    mechanism: "Main FlexHEG design",
    details:
      "A FlexHEG is a mechanism added to an AI accelerator that allows privacy-preserving verification that the chip complies with varied and flexible policy goals; it could be retrofitted to existing chips by inspectors or added as chips ship to data centers. Key technical pieces: a secure enclosure that detects physical tampering, a self-disablement mechanism, a secure processor, an accelerator interlock (control over the GPU sufficient for enforcement), an update process, and confidential communication between devices.",
    feasibility: "Medium",
    timeline: "2–5 years",
    prevWork: "Petrie et al. (2024)",
    notes:
      "Strong, secure FlexHEGs could implement many policy goals that need not be decided in advance, making them highly desirable. The likely hard parts: designing and verifying a secure processor, and designing tamper-proof enclosures.",
  },
  {
    block: "Flexible Hardware-Enabled Guarantee (FlexHEG) mechanisms",
    mechanism: "On-chip cryptographic capabilities",
    details:
      "Chips can securely execute basic cryptographic operations, such as key signing — probably via a dedicated hardware security module.",
    feasibility: "Medium",
    timeline: "1–3 years",
    prevWork: "Aarne et al. (2024)",
    notes:
      "Many AI chips can already do this, but their adversarial robustness is unclear, so new AI chips could be needed.",
  },
  {
    block: "Flexible Hardware-Enabled Guarantee (FlexHEG) mechanisms",
    mechanism: "Tamper-evident chips",
    details:
      "Includes video surveillance, tamper-evident seals or packaging on chips, and potentially remote attestation. Helps detect violators but does not by itself prevent tampering — it must be paired with enforcement.",
    feasibility: "High",
    timeline: "1–5 years",
    prevWork: "Aarne et al. (2024); TamperSec (n.d.)",
    notes:
      "Some approaches require replacing AI chips; others can be applied to existing chips (with temporary physical access) or at the data center level.",
  },
  {
    block: "Flexible Hardware-Enabled Guarantee (FlexHEG) mechanisms",
    mechanism: "Tamper-proof chips",
    details:
      "Tampering destroys the chip's capabilities — e.g., a secure enclosure that destroys the chip if broken. In effect, tamper-evident chips with enforcement built in; helps directly prevent violations.",
    feasibility: "Medium",
    timeline: "1–5 years",
    prevWork: "Aarne et al. (2024); TamperSec (n.d.)",
    notes:
      "Some approaches require replacing AI chips; others can be applied to existing chips (with temporary physical access).",
  },
  {
    block: "Flexible Hardware-Enabled Guarantee (FlexHEG) mechanisms",
    mechanism: "Chip identity verification",
    details:
      "Each chip carries a unique identifier, perhaps secured as a private key or a physical unclonable function. This enables other chip mechanisms; basic serial numbers are not adversarially robust.",
    feasibility: "High",
    timeline: "1–3 years",
    prevWork: "Aarne et al. (2024); Reuel et al. (2024)",
    notes:
      "Many AI chips can already do some versions of this, but their adversarial robustness is unclear, so new AI chips or modifications to existing chips could be needed.",
  },
  {
    block: "Flexible Hardware-Enabled Guarantee (FlexHEG) mechanisms",
    mechanism: "Trusted Execution Environment (TEE)",
    details:
      "Code run in a TEE is secure against most external surveillance, and only approved programs can interact with the TEE. For integrity, TEEs should run trusted code, likely starting with secure boot; “Confidential Computing” is NVIDIA's TEE implementation (see also Apple's “Secure Enclave”).",
    feasibility: "Medium",
    timeline: "1–4 years",
    prevWork: "Aarne et al. (2024); Kulp et al. (2024)",
    notes:
      "H100s already have confidential computing for single-chip setups, and multi-chip setups may not be too difficult (Nertney, 2023). Adversarial robustness of current implementations is unclear, so new AI chips could be needed.",
  },
  {
    block: "Flexible Hardware-Enabled Guarantee (FlexHEG) mechanisms",
    mechanism: "Firmware roll-back protection",
    details:
      "Once a firmware update has been applied, previous firmware versions cannot be used. This is a critical component of firmware-based regulations that change over time.",
    feasibility: "Medium",
    timeline: "2–5 years",
    prevWork: "",
    notes:
      "Some AI chips, such as H100s, appear to have firmware roll-back protection (NVIDIA H100 NVL GPU Product Brief, 2024), but the current implementation is likely not sufficiently secure, so new AI chips could be needed.",
  },
  {
    block: "Flexible Hardware-Enabled Guarantee (FlexHEG) mechanisms",
    mechanism: "FlexHEG applied to location verification",
    details:
      "The secure processor inside a FlexHEG could implement various chip location tracking protocols and be trusted to do so. On the other hand, strong FlexHEGs would obviate the need for location verification, since governance could be conducted remotely with trust that chips will not be tampered with.",
    feasibility: "Medium",
    timeline: "2–5 years",
    prevWork: "",
    notes:
      "If a FlexHEG is in place, additionally implementing location verification is likely easy and could be done in less than a year.",
  },
  {
    block: "Chip location tracking",
    mechanism: "Ping-based location tracking",
    details:
      "Set up a series of servers that ping chips and triangulate each chip's location from its response times to the different servers. Relatively low precision.",
    feasibility: "High",
    timeline: "2–4 years",
    prevWork: "Aarne et al. (2024); Brass & Aarne (2024)",
    notes:
      "May not require replacing hardware. The main security requirement is chips holding a private key, but it is unclear whether current chips resist the physical attacks that could extract such a key. May require chips to be connected to the internet.",
  },
  {
    block: "Chip location tracking",
    mechanism: "Topology-based location tracking",
    details:
      "Chips locate themselves based on signals from emitters with known locations, such as cell towers.",
    feasibility: "Medium",
    timeline: "2–4 years",
    prevWork: "Brass & Aarne (2024)",
    notes:
      "Requires an antenna on chips. May be difficult to make sufficiently robust.",
  },
  {
    block: "Chip location tracking",
    mechanism: "GPS-based location tracking",
    details:
      "Chips locate themselves using GPS or similar technology and report their position to a monitoring server.",
    feasibility: "Medium",
    timeline: "2–4 years",
    prevWork: "Brass & Aarne (2024)",
    notes:
      "GPS can be easily spoofed. Requires an antenna on chips. May be difficult to make sufficiently robust.",
  },
  {
    block: "Chip location tracking",
    mechanism: "Firmware-based chip operating licenses for current chips",
    details:
      "Operating licenses might be implemented on current AI chips via firmware updates and secure boot — very unlikely to be secure against state actors alone, but augmenting with tamper-evident mechanisms such as security cameras (which requires physical access) may be effective. A license could cap FLOP or clock time, carry the chip's identity and an expiration, and be signed by a regulator's or counterparty's private key; renewal can work air-gapped via a physical drive and be tied to governance goals such as reporting the chip's activity, its location, or compliance with on-chip limitations.",
    feasibility: "Medium",
    timeline: "1–3 years",
    prevWork: "Aarne et al. (2024); Kulp et al. (2024); Petrie (2024)",
    notes:
      "The location tracking protocols in this section are relatively straightforward, but they could be spoofed — either by tampering with the on-chip mechanisms (current chips are likely not sufficiently secure) or elsewhere, as in GPS spoofing.",
  },
  {
    block: "National intelligence operations",
    mechanism: "Satellites (visual)",
    details:
      "Satellite imagery may be used to detect the construction of data centers, fabs, and power infrastructure.",
    feasibility: "High",
    timeline: "<1 year",
    prevWork: "Wasil, Reed, et al. (2024); Pilz & Heim (2024)",
    notes:
      "Satellite information is unlikely to differentiate AI from non-AI data centers, and may struggle to differentiate data centers from other industrial buildings (cooling may be a key differentiator).",
  },
  {
    block: "National intelligence operations",
    mechanism: "Satellites (infrared)",
    details:
      "Thermal imaging may be used to detect data centers in use — in particular, data centers may hold a narrow temperature range throughout the day because chips run constantly and are cooled.",
    feasibility: "High",
    timeline: "<1 year",
    prevWork: "Wasil, Reed, et al. (2024)",
    notes: "",
  },
  {
    block: "National intelligence operations",
    mechanism: "Geophysical MASINT to detect underground construction",
    details:
      "Various approaches are already in use to detect underground construction (National MASINT Office, 2022). Applying them could reduce the likelihood of underground data centers being built secretively.",
    feasibility: "High",
    timeline: "<1 year",
    prevWork: "",
    notes:
      "These approaches may not, on their own, differentiate data centers from other underground construction.",
  },
  {
    block: "National intelligence operations",
    mechanism: "HUMINT",
    details:
      "Human-based intelligence — spies, unintentional leaks, whistleblowers, and interviews conducted by international authorities — can add confidence that secret AI development, data centers, or chip production are not taking place.",
    feasibility: "High",
    timeline: "<1 year",
    prevWork: "Baker et al. (Forthcoming)",
    notes: "",
  },
  {
    block: "National intelligence operations",
    mechanism: "Power grid analysis",
    details:
      "Large AI data centers may have substantial power requirements, so surveillance of existing power grids and off-grid generation could detect such data centers.",
    feasibility: "Medium",
    timeline: "<1 year",
    prevWork: "",
    notes:
      "100,000 H100s draw about 130 MW. Given the scale of current military nuclear reactors (up to low hundreds of MW electrical on some aircraft carriers), covert generation of substantial power may be possible. Chip performance per watt is rising about 1.6x per year (Epoch AI, n.d.), and there are an estimated ~500 data centers globally with >10 MW capacity (Pilz & Heim, 2023).",
  },
  {
    block: "National intelligence operations",
    mechanism: "Cyber operations and communication surveillance",
    details:
      "Signals-based intelligence is already in use. For detecting AI compute, such approaches might focus on AI developers, data centers, and chip producers.",
    feasibility: "High",
    timeline: "<1 year",
    prevWork: "",
    notes: "",
  },
  {
    block: "National intelligence operations",
    mechanism: "FININT",
    details:
      "AI development projects are very expensive, and covert AI projects might leave a substantial money trail. Financial intelligence gathering might focus on purchases of AI-relevant raw materials, chips, and other data center components.",
    feasibility: "High",
    timeline: "<1 year",
    prevWork: "Wasil, Reed, et al. (2024)",
    notes: "",
  },
  {
    block: "National intelligence operations",
    mechanism: "Tracking of relevant personnel",
    details:
      "Only hundreds to thousands of experts have the knowledge and skills to contribute to frontier AI development, chip design, or chip fabrication, and building state-of-the-art domestic chip production would be very difficult without them. Various measures could confirm these people are not contributing to covert national projects that violate an international agreement.",
    feasibility: "High",
    timeline: "<1 year",
    prevWork: "",
    notes: "",
  },
  {
    block: "Security",
    mechanism: "AI data centers are secure against chip theft",
    details:
      "Data center operators and their countries collaborate to boost data center security. Ideally this would also prevent theft of model weights and algorithmic secrets, but the focus here is preventing theft of physical chips, which is probably much easier — current security may be sufficient if done with international collaboration.",
    feasibility: "High",
    timeline: "<1 year",
    prevWork: "",
    notes: "",
  },
  {
    block: "Physical inspection of data centers",
    mechanism: "Verify chip identity and count",
    details:
      "Use unique chip identifiers to ensure the right chips are present, and count them to make sure all are accounted for.",
    feasibility: "High",
    timeline: "<1 year",
    prevWork: "",
    notes: "",
  },
  {
    block: "Physical inspection of data centers",
    mechanism:
      "Verify non-tampering of chips (only relevant if there are mechanisms that could be tampered with)",
    details:
      "Make sure chips have not been modified in violation of agreements.",
    feasibility: "High",
    timeline: "<1 year",
    prevWork: "Aarne et al. (2024)",
    notes: "Easy if good tamper-evident chips exist to begin with.",
  },
  {
    block: "Physical inspection of data centers",
    mechanism: "Audit data center security",
    details:
      "Check that the data center is actually at the security level it claims.",
    feasibility: "Medium",
    timeline: "1–4 years",
    prevWork: "Nevo et al. (2024)",
    notes:
      "It may be easy to verify security strong enough to prevent chip theft, but harder to verify the much higher level of security needed to protect model weights.",
  },
  {
    block: "Physical inspection of data centers",
    mechanism: "Power accounting",
    details:
      "Compare a data center's expected power draw, based on the type and number of chips, to its actual power draw to build confidence that there are no undeclared chips.",
    feasibility: "Medium",
    timeline: "1–2 years",
    prevWork: "",
    notes:
      "Difficult if a data center mixes older (less energy efficient) and newer chips, or mixes AI and non-AI chips.",
  },
  {
    block: "Continuous monitoring of AI data centers",
    mechanism: "Perimeter and portal continuous monitoring",
    details:
      "Materials coming in and out of data centers (especially AI chips) flow through portals that are jointly monitored to avoid chip theft. Existing physical security measures such as fencing and cameras are likely sufficient if they can be jointly monitored.",
    feasibility: "High",
    timeline: "<2 year",
    prevWork:
      "START: Annex to Protocol on Inspection and Continuous Monitoring Activities (n.d.)",
    notes:
      "Jointly monitoring network traffic in and out of data centers may also be desirable (reducing the risk of model weights being improperly moved), but that is out of scope for this section.",
  },
  {
    block: "Continuous monitoring of AI data centers",
    mechanism: "Security cameras inside data centers",
    details:
      "Already standard practice (Google Cloud Tech, 2020), but would involve giving international inspectors access or — more likely — having them install their own cameras. For verification, the primary goal is ensuring chips are not removed, added, or modified to bypass governance mechanisms, so cameras should focus on chips.",
    feasibility: "High",
    timeline: "<1 year",
    prevWork: "",
    notes:
      "Cameras might confirm that unauthorized chips aren't being substituted into a data center, that interconnect limits aren't being changed, or that chips are not being tampered with.",
  },
  {
    block: "Continuous monitoring of AI data centers",
    mechanism: "Sensors for chip activities (not relevant to locating chips)",
    details:
      "Various workload classification methods involve gathering information about chips, such as their power draw or network traffic. Specific equipment would be installed to gather this information.",
    feasibility: "High",
    timeline: "1–3 years",
    prevWork: "Baker et al. (Forthcoming)",
    notes:
      "There are likely low-millions of high-performance AI chips in the world (Epoch AI, n.d.), so these sensors would need to be mass-produced, which could take many months to a couple of years.",
  },
  {
    block: "Register chip production",
    mechanism: "Supply chain registry",
    details:
      "Key parts of the chip supply chain must register their production facilities with a central verifier. This should likely be based on a thorough assessment of the current bottlenecks and crucial actors in chip production.",
    feasibility: "High",
    timeline: "<1 year",
    prevWork: "",
    notes: "",
  },
  {
    block: "Tracking chip production",
    mechanism: "Chain-of-custody",
    details:
      "Chain-of-custody (CISA, n.d.) is implemented for the AI chip supply chain: firms document the transfer and storage of components along the supply chain.",
    feasibility: "Medium",
    timeline: "1–3 years",
    prevWork: "",
    notes: "",
  },
  {
    block: "Tracking chip production",
    mechanism: "Tracking raw materials and component parts",
    details:
      "Major parts of the chip supply chain — from raw materials to EUV machines to clean room components — are tracked by intelligence agencies and an international body.",
    feasibility: "Medium",
    timeline: "1–3 years",
    prevWork: "",
    notes:
      "It's unclear whether the raw materials are sufficiently AI-specific to be worth tracking. There are many details and approaches to tracking chip production, left to future work.",
  },
  {
    block: "Tracking chip production",
    mechanism: "General intelligence gathering",
    details:
      "National intelligence agencies use satellites, HUMINT, and other sources of information to identify the construction and operation of unregistered chip production facilities.",
    feasibility: "High",
    timeline: "<1 year",
    prevWork: "",
    notes:
      "Covertly building a chip supply chain appears very difficult, and international regulations with whistleblower programs may be sufficient for detection.",
  },
  {
    block: "Physical inspection of fabs",
    mechanism: "Physical inspection and continuous monitoring of fabs",
    details:
      "Check that chip production facilities are implementing the agreed-upon on-chip measures, have the manufacturing capacity they claim, and are not doing unauthorized production or distribution. Includes human inspectors, cameras, interviews with employees, etc.",
    feasibility: "High",
    timeline: "<1 year",
    prevWork: "",
    notes: "Includes inventory audits.",
  },
  {
    block: "Physical inspection of fabs",
    mechanism: "Evaluation of chip designs and testing of chips in development",
    details:
      "If on-chip mechanisms are used, there must be assurance that manufactured chips actually implement them correctly. To ensure chip designs have not been backdoored to circumvent governance measures, international inspectors may need to evaluate the designs and confirm that a small number of randomly selected fabricated chips implement the intended design, with such tests repeated throughout the chip design process.",
    feasibility: "Medium",
    timeline: "1–4 years",
    prevWork: "",
    notes:
      "Might involve a small contingent of experts from each country working on this verification, with strong information security to avoid leaking sensitive chip design data.",
  },
  {
    block: "Multilateral export controls",
    mechanism: "Multilateral export controls",
    details:
      "Members of the international agreement share a list of export-controlled countries for AI chips and major components, in effect requiring a license from an international authority.",
    feasibility: "High",
    timeline: "<2 year",
    prevWork: "",
    notes:
      "These rules could be “disallow” or “allow” based, depending on risk. Countries might agree to reduce AI chip proliferation via shared export controls, but it appears difficult to make such agreements robust to a country later deciding to break the agreement.",
  },
];
