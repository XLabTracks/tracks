import type { SortBoardDef } from "@/lib/verification/data/sort-board";

export const ARCHITECTURE_SORT: SortBoardDef = {
  id: "architecture-sort",
  storageKey: "v-architecture-sort:v1",
  lead: "Each card describes a mechanism the way a procurement document would. File it by where the observation originates, not by which box the software runs in. Some cards resist the table on purpose.",
  trayLabel: "Unsorted mechanisms",
  zones: [
    {
      id: "on-chip",
      name: "On-chip",
      blurb:
        "The observation originates inside the accelerator, in logic the chip protects.",
      color: "var(--mod-0-text, #9a000c)",
    },
    {
      id: "off-digital",
      name: "Off-chip digital",
      blurb:
        "A separate device reads digital data crossing an interface it observes.",
      color: "var(--mod-4-text, #3d75b1)",
    },
    {
      id: "off-analog",
      name: "Off-chip analog",
      blurb:
        "A separate instrument measures a physical signal at a stated point.",
      color: "var(--mod-3-text, #555e07)",
    },
    {
      id: "hybrid",
      name: "Hybrid",
      blurb: "Several signals with different boundaries, read together.",
      color: "var(--mod-2-text, #946b00)",
    },
    {
      id: "unsettled",
      name: "Not settled by the description",
      blurb:
        "The card leaves the placement open, or names something that is not a collection path at all.",
      color: "var(--mod-1-text, #bf4f00)",
    },
  ],
  items: [
    {
      id: "attestation",
      label: "Signed device report",
      detail:
        "The accelerator's firmware produces operation totals and workload labels, and the device signs the report before it leaves.",
      zone: "on-chip",
      ok: "Baker and colleagues put hardware-backed workload certificates in the on-chip layer: the Prover's chips “could sign cryptographic certificates that confirm how they produced their results.” The signature travels; the measurement does not. (§4.1.1.2)",
      wrong: {
        "off-digital":
          "The report is read off the chip, but collection is where the observation originates, and this one originates in the chip's own logic. Where the reader sits is not the measurement boundary.",
        hybrid:
          "One signal, one boundary. A signature added on the way out does not make a second observation.",
      },
      generic:
        "Ask what produced the number, not what carried it. The firmware inside the accelerator produced it.",
    },
    {
      id: "secure-boot",
      label: "Approved-software record",
      detail:
        "A record that the accelerator started only vendor-approved system software, signed with a key the operator cannot read.",
      zone: "on-chip",
      ok: "Baker and colleagues make this the on-chip prerequisite: the mechanisms they consider “require a hardware security feature known as secure boot, which must be at least tamper-evident,” and which should “include a secure private key… allowing the system software to digitally sign messages.” (§4.1.1.1)",
      generic:
        "The evidence is a property of the chip, established by the chip, attested with a key held on it.",
    },
    {
      id: "counters",
      label: "Counter telemetry",
      detail:
        "A management tool on the host server polls the accelerator's own utilization counters every second and stores the series.",
      zone: "on-chip",
      ok: "The reading is taken by the chip, in the chip's counters; the host tool is a consumer of it. That also fixes the limit: in NVIDIA's CC-On mode “all performance counters have been disabled to prevent their use in side-channel attacks,” so this path closes exactly where confidentiality is strongest.",
      near: {
        "off-digital":
          "Defensible — the tool does run off the chip, and 2.1.2's separation of roles would put it there. But the test on this board is where the observation originates, and these counters sit inside the accelerator. Filed on-chip, with the warning that it is not a protected measurement path: nothing in it resists firmware that reports false values.",
      },
      generic:
        "Follow the number back to its source. The counters are in the accelerator; the tool reads them.",
    },
    {
      id: "tap",
      label: "Rack-edge network tap",
      detail:
        "A device at the edge of the rack reads and logs a sample of the traffic exchanged between servers.",
      zone: "off-digital",
      ok: "Baker's off-chip collectors, verbatim: “Off-chip input/output loggers (i.e., network taps): Devices that read and log (a random sample of) digital data, such as data exchanged between AI servers or potentially between individual AI accelerators.” (§4.2.1.1, and Appendix A.3)",
      wrong: {
        "on-chip":
          "Nothing here is built into the accelerator. The tap sees a boundary the accelerator's own logic does not control — which is the point of moving it out, and also its limit: work that never crosses that port is not observed.",
      },
      generic:
        "A separate device, reading digital data at an interface it sits on.",
    },
    {
      id: "resign",
      label: "Re-signing appliance",
      detail:
        "A separate box beside the rack whose only input is the accelerator's report. It checks the signature, copies the values into a second report, and signs that.",
      zone: "off-digital",
      ok: "Off-chip by placement, and that is all the placement bought. Baker separates devices for data collection from devices for data analysis, and this is the second kind: appraisal of authenticity, with no independent observation of its own. You will meet this box again at the end of the lesson.",
      near: {
        hybrid:
          "Defensible if you counted signatures — two signed reports do look like two signals. But a hybrid needs signals with different boundaries, and this box has one input. Filed off-chip digital: one originating measurement, two consumers.",
      },
      generic:
        "Ask what it observes. It observes a report. Moving a reader away from the chip does not create a second measurement.",
    },
    {
      id: "cluster",
      label: "Off-site trusted cluster",
      detail:
        "Records collected at the facility are examined on chips held off-site, secured and supervised by both parties.",
      zone: "off-digital",
      ok: "Baker's analysis side of the same layer: “collected data could be analyzed by trusted computer chips, either on-site or off-site. For off-site chips, which could form trusted clusters…” Analysis, not collection — it inherits whatever boundary the collector had. (§4.2.1.1)",
      near: {
        hybrid:
          "Defensible — it is where several streams could be combined. But combining is appraisal; this is the room the combining happens in, not a new signal. The hybrid question is which signals were collected, not where they are read.",
      },
      generic:
        "It receives records. Nothing about moving the analysis off-site adds an observation.",
    },
    {
      id: "nic",
      label: "Repurposed network controller",
      detail:
        "The Network Interface Controller is replaced with a version that can mediate the traffic passing through it.",
      zone: "off-digital",
      ok: "Petrie and Aarne name this as the retrofittable option: “A promising option for a retrofittable Interlock is repurposing or replacing the Network Interface Controller (NIC)… FlexHEG designs that are external to accelerators are easier to physically retrofit to novel accelerator types.” External to the accelerator, on the digital path. (pp. 23–24)",
      near: {
        "on-chip":
          "Defensible if you read the NIC as part of the accelerator package. Petrie and Aarne do not: they reach for it precisely because it is external, which is what makes it retrofittable. Filed off-chip digital.",
      },
      generic:
        "A component on the network path, outside the accelerator, reading and mediating digital traffic.",
    },
    {
      id: "meter",
      label: "Feed-level electricity meter",
      detail:
        "A separately installed instrument measures electrical consumption on the rack's feed.",
      zone: "off-analog",
      ok: "Baker verbatim: “Off-chip analog sensors: Devices that log analog measurements, such as power draw, temperature, and electromagnetic measurements.” (§4.2.1.1, and Appendix A.6 on compute accounting from analog sensors)",
      generic:
        "The measurement starts as a physical quantity at a named point, taken by an instrument the accelerator does not own.",
    },
    {
      id: "em",
      label: "Electromagnetic measurements",
      detail:
        "An instrument beside the equipment records electromagnetic emissions, and software turns the trace into an estimate of activity.",
      zone: "off-analog",
      ok: "The same sentence in Baker that carries the power meter: “power draw, temperature, and electromagnetic measurements.” (§4.2.1.1)",
      wrong: {
        "off-digital":
          "The trace is digitised and analysed by software, which is true of every analog sensor in the literature. As this lesson puts it, “analog” describes the originating measurement, not an absence of software or cryptography.",
      },
      generic:
        "Name the phenomenon being measured first. It is a physical emission, not a message.",
    },
    {
      id: "crosscheck",
      label: "Power estimate against signed totals",
      detail:
        "A design compares the accelerator's signed operation totals with an independently installed meter's estimate, and flags disagreement.",
      zone: "hybrid",
      ok: "Two signals with different boundaries, read together — the hybrid row of this lesson's table. Baker's framing of the off-chip layer is the same: devices “could collect digital data or analog readings on AI workloads, offering redundancy and different tradeoffs.” What the arrangement does not establish by itself is independence: if both analyses use the same vendor-supplied efficiency model, one wrong model moves both.",
      near: {
        "off-analog":
          "Defensible — the meter is the part that survives lying firmware, so it is tempting to file the design under its strongest leg. But the design is the comparison, and the comparison needs both legs. Filed hybrid.",
      },
      generic:
        "Count the originating measurements. There are two, and they cross different boundaries.",
    },
    {
      id: "interlock",
      label: "Interlock on the main data path",
      detail:
        "A component sits on the accelerator's main data path, so data and instructions reach the accelerator only through it. The proposal does not say where the component is built.",
      zone: "unsettled",
      ok: "The papers set this trap themselves. Petrie and Aarne list the placements: “1) as an IP block within the accelerator die, 2) as a chiplet sitting near the accelerator die, 3) as a part of high bandwidth memory (HBM), or 4) as a separate component that operates as a network relay or switch.” The first three are on or beside the die; the fourth is off-chip. Baker's own summary table, meanwhile, files FlexHEGs under “Off-chip network tap (and analysis).” Until a proposal fixes the placement, the family is not fixed either — which is what this lesson means by calling placement a design choice.",
      near: {
        "on-chip":
          "Defensible — three of the four placements Petrie and Aarne list put the interlock on the die, beside it, or inside high-bandwidth memory. That reading is permitted by the description, which is exactly why the description does not settle it.",
        "off-digital":
          "Defensible, and it is how Baker's summary table files FlexHEGs. But that is one of four placements Petrie and Aarne name, and this card does not choose between them. Ask the supplier where the component is built before filing it.",
      },
      generic:
        "Before filing it, ask what the description does not say. It does not say where the component sits, and the answer changes the family.",
    },
    {
      id: "enclosure",
      label: "Tamper-evident enclosure",
      detail:
        "The monitoring device is housed in an enclosure that shows whether it has been opened, and a random sample of enclosures is inspected.",
      zone: "unsettled",
      ok: "It observes nothing. In Baker it appears among the measures that let a Verifier trust an off-chip device — “Verifier-trusted supply chains, mutual vetting, tamper-evident enclosures (a random sample of which would be routinely inspected), and ideally tamper-proofing” — so it secures a collector rather than being one. Worth a card because a real architecture diagram is full of boxes that are neither collection, appraisal, nor control. And as this lesson says: a broken seal can indicate a need to investigate; an intact-looking seal is not a proof that no intervention occurred.",
      generic:
        "Ask the question the lesson opens with: what does this observe? Nothing. It makes interference with some other device detectable.",
    },
  ],
  reveal:
    "Two cards could not be filed, for different reasons: the interlock because the description leaves its placement open, the enclosure because it is a protection around a collector rather than a collector. Both are ordinary in procurement documents, and both are why the first question about an architecture is what it observes and where that observation starts.",
};
