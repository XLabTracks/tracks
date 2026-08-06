---
title: Cut the Interconnect, Keep the Inference
theme: Verification
status: draft
summary: Disconnect part of the optical links between racks and training stops while inference survives — allegedly. Work out what remains possible and who checks the cables.
team: 1-2
effort_hours: 10-14
duration: 2 weeks
difficulty: core
deliverable: Short protocol design plus a red-team pass on it
deliverable_type: design
mentor: optional
audience: The negotiator who needs an emergency measure that does not kill civilian service.
skills: [protocol design, network reasoning, red-teaming]
prerequisites: [Verification 2.1 — the hardware layer, Verification 3 — covert development]
updated: 2026-08-06
---

## The brief

Large training runs lean on high-bandwidth interconnect between racks;
serving a trained model leans on it far less. That asymmetry suggests an
emergency measure with an unusually good ratio of disruption to harm:
disconnect part of the inter-rack fabric, and training stops while inference
keeps running. The project is to work out how much of that claim survives
contact with the details.

- **What remains possible.** With a given fraction of links cut, which
  workloads still run: inference at what scale, fine-tuning at what size,
  training partitioned into what fragments. The boundary is the whole
  content of the measure.
- **The inspection.** Who checks the cables, how often, and what a check
  looks like — physically pulled fibre, sealed ports, counters read from
  switches. Each option is a different cost and a different trust
  assumption.
- **The restoration paths.** How an operator gets the fabric back: respliced
  fibre, spare switches, traffic routed over the storage network or the
  ordinary datacenter network at lower bandwidth. For each path, what it
  buys the operator and what it exposes to the inspector.

## Why it exists

Module 2.1 treats hardware mechanisms mostly as proposals; a cable is the
rare governance surface that is visible, countable, and already installed.
Whether it can carry an emergency measure depends entirely on the workload
boundary and the restoration paths, which is exactly the analysis this brief
demands. The red-team pass is Module 3 applied at the smallest useful scale.

## Scope

**In scope:** one reference cluster topology, public knowledge of how
training and inference traffic differ, and back-of-envelope bandwidth
arithmetic.

**Out of scope:** any real operator's network, and cryptographic or
firmware-based controls — this brief is about physical disconnection only.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| The boundary | "Training stops" | Which workloads survive at which cut fraction, with the arithmetic |
| Inspection | "Cables are checked" | A named check, its frequency, and what it costs both sides |
| Red team | An objections paragraph | Restoration paths priced: time, equipment, detectability |
| The verdict | Advocacy | A plain statement of when the measure holds and when it leaks |

## Getting started

1. Write the bandwidth budget first: what a training step needs, what
   serving needs. Every later claim divides by these numbers.
2. Design the check before the red team. A restoration path only matters if
   the check as designed would miss it.
3. Time-box the red team to the second week and let it win where it wins —
   the deliverable states the measure's limits, not its virtues.
