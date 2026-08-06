---
title: A Security Case for One Sensor
theme: Verification
status: draft
summary: Power, temperature and timing telemetry cannot classify workloads reliably. Build the security case for using one sensor feed anyway.
team: 1-2
effort_hours: 12-18
duration: 3 weeks
difficulty: core
deliverable: A verification security case for one telemetry mechanism
deliverable_type: analysis
mentor: optional
audience: The verifier deciding whether a sensor feed is worth installing.
skills: [security cases, telemetry analysis, adversarial reasoning]
prerequisites: [Verification 2.0 — confidentiality vs verifiability, Verification 2.1 — the hardware layer]
updated: 2026-08-06
---

## The brief

The easy verdict on datacenter telemetry is that it cannot reliably tell a
training run from anything else, so it proves nothing. The easy verdict skips
the interesting question: useful under what decision procedure? A smoke
detector cannot classify fires either. The project is to take one sensor
mechanism — power draw, temperature, timing side-channels, pick one — and
build the full security case for it, answering the Petrie questions in order:

- **Who decides.** The institution that acts on the feed, and what action the
  feed can trigger — a follow-up question, a challenge inspection, nothing on
  its own.
- **What data they see.** The exact signal, at what resolution, aggregated
  how. Every step of aggregation is privacy bought and evidence spent.
- **Which false positives are tolerable.** The workloads that will trip the
  sensor innocently, roughly how often, and what a false alarm costs each
  side. A tolerable rate for a follow-up question is an intolerable rate for
  an accusation.
- **How it can be spoofed.** What it costs the operator to make the signal
  lie — load shaping, thermal masking, replayed data — and which spoofs the
  surrounding regime would catch by other means.

## Why it exists

Module 2.1 rates most telemetry proposals as not deployed and easily
oversold; the correct response is not to discard the layer but to state
precisely what a weak signal can support. A security case is the form that
statement takes: claim, evidence, decision rule, failure modes, in one
document a skeptic can attack line by line. Learners who can write one for a
sensor can write one for anything in the stack.

## Scope

**In scope:** one sensor mechanism, its public measurement characteristics,
and the institutional side — who reads it, what it triggers.

**Out of scope:** building or fitting detectors, and mechanisms that require
new silicon. The case is for a feed that could exist this year.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| The claim | "Telemetry helps" | The exact proposition the feed supports, and the one it does not |
| Decision rule | Unstated | Named decider, named action, named threshold |
| False positives | Waved at | The innocent workloads listed, with the cost of each alarm |
| Spoofing | "Possible" | Priced, per spoof, against what the spoof conceals |

## Getting started

1. Pick the sensor and write the one-sentence claim it is supposed to
   support. If the sentence needs "reliably classify", pick a weaker claim.
2. Answer the Petrie questions in order and do not skip the second — most
   telemetry cases die on what the verifier is actually allowed to see.
3. Draft the spoofing section as the operator's counsel would. The case is
   finished when that section no longer surprises you.
