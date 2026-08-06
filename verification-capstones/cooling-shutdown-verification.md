---
title: Does Switching Off the Cooling Switch Off the Training?
theme: Verification
status: draft
summary: An inspector confirms the cooling is off. Under what conditions does that actually rule out a large training run — and how would an operator get around it?
team: 1-2
effort_hours: 12-18
duration: 3 weeks
difficulty: core
deliverable: Threat model with a claim → observable → evasion → countermeasure table
deliverable_type: analysis
mentor: optional
audience: The inspectorate asked to certify that a halt is actually a halt.
skills: [threat modelling, physical-layer reasoning, evasion analysis]
prerequisites: [Verification 2.1 — the hardware layer, Verification 3 — covert development]
updated: 2026-08-06
---

## The brief

A disabled cooling system is one of the most inspectable claims a facility can
make: the plant is large, loud, and hard to hide. The question is what the
inspection actually proves. Under what conditions does a verified cooling
shutdown rule out a large training run — and under what conditions does it
merely rule out the most convenient way of running one?

- **The facility.** Pick one typical datacenter design and hold it fixed:
  its cooling plant, its racks, its power envelope. The analysis is about a
  concrete building, not datacenters in general.
- **The causal chain.** Write out the chain from "cooling disabled" to
  "training impossible": heat produced per rack at training load, what removes
  it, what fails when nothing does, and how fast. Every link is a claim an
  operator could attack.
- **The bypasses.** Work the evasions seriously: backup cooling brought
  online, mobile cooling units rolled in, running at partial load to stay
  inside the thermal envelope, and workloads moved to rooms the inspection
  never saw.
- **The countermeasures.** For each bypass, what an inspector would have to
  check to close it — and what that adds to the cost and intrusiveness of the
  visit.

## Why it exists

Module 2.1 is honest that most hardware mechanisms are proposals rather than
deployed capability. Cooling is the counterexample worth stress-testing: a
physical system that already exists, already meters, and cannot be patched in
software. If inspection of physical plant cannot carry a shutdown claim, the
cheap end of the hardware layer is emptier than it looks; if it can, the
conditions under which it works are worth writing down precisely.

The bypass list is Module 3 practice on a single mechanism: every evasion here
is a small instance of repurposed infrastructure or false reporting.

## Scope

**In scope:** one typical facility design, public engineering knowledge about
datacenter cooling and power, and thermal reasoning you can defend at the
level of orders of magnitude.

**Out of scope:** any real facility's specifics, and precision thermal
modelling. Where a link in the chain rests on an estimate, say so in place —
the table is only as good as its honesty about which cells are firm.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| The claim | "No cooling means no training" | A causal chain with each link stated and attackable |
| Evasions | A list of ideas | Each bypass costed: equipment, time, and what it sacrifices |
| Countermeasures | "Inspect more" | What check closes each bypass, and what the check costs |
| Honesty | Uniform confidence | Firm cells separated from estimated ones |

## Getting started

1. Write the causal chain first, before any evasion. You cannot attack a
   claim you have not stated.
2. Order the bypasses by cost to the operator, cheapest first. The cheap ones
   are the ones the design has to survive.
3. For one bypass, write the inspector's counter-check in full. It sets the
   template for the rest of the table.
