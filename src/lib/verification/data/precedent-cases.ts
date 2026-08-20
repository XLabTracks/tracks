/**
 * The 0.3 case-study interactive: eight verification regimes from history, the
 * learner calls "held or circumvented" before reading how each turned out.
 *
 * Every sentence is the author's case-file text, verbatim: the outline lists
 * all eight under 0.3 with the same three parts each — the historical
 * parallel, why it held or failed, and what AI verification should adopt or
 * avoid. The only editorial move is placement: a sentence that gives the
 * outcome away (Biopreparat, the North Korean test detections) is shown in
 * the reveal, not the briefing, because the exercise is prediction-first.
 * Order is chronological, which is the outline's own order.
 *
 * The outline points at a prototype for this exercise. This widget is the
 * shipped version of it; the prototype is a sketch, not a spec, so
 * where the two differ the code here wins.
 */

export type PrecedentOutcome = "held" | "circumvented";

export interface PrecedentCase {
  id: string;
  /** Case-file name, with years. */
  name: string;
  /** The author's subtitle for the case. */
  tagline: string;
  /** Shown before the call — the "description of the historical parallel". */
  briefing: string;
  /** The record's verdict, for scoring the learner's call. */
  outcome: PrecedentOutcome;
  /** The author's own outcome heading — it carries the nuance the binary cannot. */
  outcomeHeading: string;
  /** Shown after the call: how it actually turned out, and why. */
  why: string;
  /** "What AI verification should adopt or avoid." */
  transfer: string;
}

export const PRECEDENT_CASES: PrecedentCase[] = [
  {
    id: "baruch",
    name: "The Baruch Plan (1946)",
    tagline: "Verification at the start of the nuclear age",
    briefing:
      "In June 1946, the United States proposed placing nuclear materials and weapons development under an international authority with broad inspection powers. The Soviet Union proposed eliminating existing weapons before establishing inspections. The disagreement combined verification, sequencing, enforcement, and the imbalance created by the existing US arsenal.",
    outcome: "circumvented",
    outcomeHeading: "Why it failed",
    why: "The United States was unwilling to relinquish its weapons without reliable access inside the Soviet Union. Soviet leaders saw intrusive inspections and the proposed enforcement structure as threats to sovereignty and security. Neither side trusted the other to complete its obligations after giving up its main source of leverage.",
    transfer:
      "AI agreements should address sequencing early. Parties need a credible account of when restrictions begin, when inspections begin, and what happens if one side complies before another. Transitional arrangements, reciprocal steps, and phased verification may be more acceptable than requiring one party to move first.",
  },
  {
    id: "iaea",
    name: "IAEA safeguards (1957 onward)",
    tagline: "Layered monitoring and repeated adaptation",
    briefing:
      "The IAEA uses seals, equipment identifiers, surveillance cameras, inspections, and material accountancy to monitor nuclear facilities. These tools help establish whether monitored material or equipment has moved, changed, or been diverted between inspections.",
    outcome: "held",
    outcomeHeading: "Why it has largely held",
    why: "The system does not depend on a single device. Inspectors combine several forms of evidence, periodically re-establish baselines, and update safeguards when vulnerabilities appear. Its effectiveness also benefits from the physical properties of nuclear material, which can be measured and tracked.",
    transfer:
      "AI regimes should layer hardware attestation, logs, facility monitoring, supply-chain records, and human reporting. Designers should assume that individual controls will eventually face technical or operational workarounds. Nuclear material accountancy transfers only partially to AI because model weights and software can be copied without creating an obvious shortage elsewhere.",
  },
  {
    id: "antarctic",
    name: "The Antarctic Treaty (1959)",
    tagline: "Broad inspection under unusually favorable conditions",
    briefing:
      "Article VII allows treaty parties to inspect stations, installations, equipment, ships, and aircraft in Antarctica. Observers have broad access, and the treaty also permits aerial observation. These provisions created one of the strongest formal inspection rights in an international agreement.",
    outcome: "held",
    outcomeHeading: "Why it has held",
    why: "Antarctica contained few permanent populations or established military assets when the treaty was negotiated. Activities were geographically isolated and often difficult to conceal. The parties also shared an interest in preventing military competition from expanding onto the continent.",
    transfer:
      "The treaty shows that states can accept extensive inspection rights under supportive political conditions. AI facilities carry much greater commercial, military, and intelligence value, so similar language may face stronger resistance. The precedent is most useful for demonstrating the legal possibility of broad access, while offering limited evidence about its acceptability in strategically central industries.",
  },
  {
    id: "bwc",
    name: "Biological Weapons Convention (1972)",
    tagline: "A prohibition with limited verification machinery",
    briefing:
      "The BWC prohibited biological weapons but created no standing inspection organization or routine on-site verification system.",
    outcome: "circumvented",
    outcomeHeading: "Why verification remained weak",
    why: "The Soviet Union subsequently operated Biopreparat, a large covert biological weapons program. Defectors including Vladimir Pasechnik and Ken Alibek later helped reveal its scale. Biological research is deeply dual-use, relevant facilities can have small physical footprints, and commercial and national-security actors feared that inspections would expose legitimate secrets. Negotiations over a verification protocol continued during the 1990s but collapsed in 2001 after the United States rejected the draft.",
    transfer:
      "AI verification should account for dual-use facilities, commercial confidentiality, and activities that can be dispersed or concealed. Technical monitoring should be paired with whistleblower protections, personnel interviews, reporting channels, and investigative follow-up. A broad prohibition with little routine evidence collection may leave large compliance gaps.",
  },
  {
    id: "inf",
    name: "The INF Treaty and the Votkinsk portal (1987–2001)",
    tagline: "Continuous monitoring between rivals",
    briefing:
      "The INF Treaty eliminated US and Soviet ground-launched missiles within specified ranges and authorized unusually intrusive verification. US inspectors continuously monitored the Votkinsk missile plant, while Soviet inspectors monitored a US facility in Magna, Utah. At Votkinsk, the United States developed the CargoScan radiographic system to distinguish permitted SS-25 missiles from the closely related, prohibited SS-20.",
    outcome: "held",
    outcomeHeading: "Why it held during the monitoring period",
    why: "The treaty defined a narrow class of prohibited systems, concentrated relevant production at identifiable facilities, and paired obligations with reciprocal access. Missiles leaving the plant passed through a physical portal, giving inspectors a stable point at which to collect evidence. Disputes still arose over the scope and operation of monitoring equipment.",
    transfer:
      "AI regimes can learn from reciprocal access, continuous monitoring at production chokepoints, and verification designed to distinguish permitted from prohibited activity. The analogy is strongest where compute or advanced chips pass through identifiable facilities or supply-chain nodes. It becomes weaker for software, model weights, and distributed activity that can move without crossing a monitored gate.",
  },
  {
    id: "south-africa",
    name: "South Africa (1989–1993)",
    tagline: "Verifying the dismantlement of a complete arsenal",
    briefing:
      "South Africa secretly built six nuclear devices and began dismantling them after F.W. de Klerk took office in 1989. The weapons were disassembled, the highly enriched uranium was recovered and stored, and South Africa joined the NPT in 1991. After the government disclosed the former program in 1993, the IAEA examined whether the declaration was complete.",
    outcome: "held",
    outcomeHeading: "Why verification succeeded",
    why: "South Africa cooperated extensively and wanted international recognition that the program had ended. Inspectors reviewed uranium-production records, compared historical production with the declared inventory, visited former facilities, examined equipment, and interviewed personnel. Even with substantial cooperation, reconstructing the baseline took roughly two years.",
    transfer:
      "Verifying the closure of an advanced AI program would likely require access to records, facilities, hardware inventories, financial flows, and personnel. Inspectors would need to reconstruct past activity as well as observe present conditions. The precedent also shows how much cooperation matters: confidence in completeness is much harder to establish when a state withholds records, access, or knowledgeable staff.",
  },
  {
    id: "cwc",
    name: "Chemical Weapons Convention (1993)",
    tagline: "Managed access and the politics of challenge inspections",
    briefing:
      "The CWC’s managed-access rules allow inspectors to investigate compliance concerns while protecting unrelated sensitive information. An inspected state may shroud equipment, restrict certain observations, negotiate sampling arrangements, and propose less intrusive ways to answer the inspection team’s questions. Chemical industry participation helped shape these procedures.",
    outcome: "held",
    outcomeHeading: "Why the system has held, and why challenge inspections remain unused",
    why: "Managed access made routine industrial inspections more acceptable by giving facilities ways to protect proprietary and security-sensitive information. Challenge inspections carry greater diplomatic costs because requesting one can be interpreted as a formal accusation. As a result, the treaty’s challenge-inspection procedure has remained available without being invoked.",
    transfer:
      "AI inspections could use negotiated access, information barriers, controlled sampling, third-party testing, and procedures that limit exposure of model details or source code. Industry participation may improve practicality and acceptance. Agreements should also avoid relying primarily on politically costly inspections triggered by accusations; routine monitoring and lower-friction escalation procedures are more likely to be used.",
  },
  {
    id: "ctbt",
    name: "CTBT and the International Monitoring System (1996 onward)",
    tagline: "Building verification before entry into force",
    briefing:
      "The Comprehensive Nuclear-Test-Ban Treaty has yet to enter into force, while its International Monitoring System already operates globally. More than 300 seismic, hydroacoustic, infrasound, and radionuclide facilities collect data under the CTBTO framework.",
    outcome: "held",
    outcomeHeading: "Why the monitoring system works",
    why: "The system detected all six declared North Korean nuclear tests without inspectors entering the country. Nuclear explosions create physical signatures that travel across long distances and can be compared across several sensor networks. International data collection and analysis improve confidence and make some events difficult to conceal. The system has also benefited from years of operation, calibration, and institutional development.",
    transfer:
      "Governments can build and test monitoring infrastructure before reaching a comprehensive AI agreement. Satellite observations, electricity data, chip supply records, facility construction, and network or logistics evidence could support remote monitoring of large training operations. These signals will often be less distinctive than those from a nuclear explosion, so AI regimes should expect greater ambiguity and combine remote sensing with other sources of evidence.",
  },
];
