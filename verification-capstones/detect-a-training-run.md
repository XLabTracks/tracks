---
title: Spot a Training Run Without Looking Inside It
track: Verification
status: draft
summary: Could a verifier tell a large training run from utilisation signatures alone — no workload access, no code? Work out what the signature is and how cheaply it is faked.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Signature analysis with a detection-rule sketch and the spoofing cost for each signal
deliverable_type: analysis
mentor: recommended
audience: The verifier who will never be allowed to see the workload.
skills: [signature analysis, privacy-preserving verification, detection reasoning, adversarial cost modelling]
prerequisites: [Verification 2.1 — the hardware layer, Verification 2.2 — the cloud layer, Verification 3 — covert development]
sources:
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025), compute questions: can large training runs be detected while retaining developer privacy, e.g. through signatures in processor utilisation?](https://arxiv.org/abs/2407.14981)"
  - "[What does it take to catch a Chinchilla? — Shavit (2023)](https://arxiv.org/abs/2303.11341)"
updated: 2026-08-04
---

## The brief

Module 2.0 names the central tension: verification is inherently intrusive, and
the mechanisms worth having are the ones that confirm a claim without handing
over the secret. This is the cheapest version of that problem. A verifier who
may not see weights, data or code — but may see how the machines behaved — wants
to know whether a large training run happened.

- **The signature.** What distinguishes a long training run from inference at
  scale, from scientific computing, from rendering. Candidates: sustained
  utilisation over weeks rather than hours, the interconnect pattern of
  synchronous gradient exchange, memory-bandwidth profile, checkpoint-shaped
  I/O bursts at regular intervals, power draw that is flat rather than
  diurnal, and the restart-from-checkpoint discontinuities every real run has.
- **What the verifier is allowed to see.** Be precise, because it is the whole
  exercise. Aggregate utilisation? Per-node? Power at the meter? Network
  counters? Each level is a different privacy bargain and a different
  detection rate.
- **The confusion matrix.** For your best signal set: what else looks like
  this, and what a false accusation costs. Module 2.2 already warns that
  self-reporting alone is a paperwork regime — a detector with a bad false
  positive rate is the opposite failure, and just as useless.
- **The spoofing cost.** Per signal, what it costs the operator to look like
  something else: throttling to break the utilisation profile, padding with
  fake inference, splitting the run. Compare that cost against what the run is
  worth. That comparison is the finding.

## Why it exists

Almost every verification regime in the track eventually needs an answer to
"and what if they just do not tell us?" The hardware and cloud layers answer it
with observation, and the quality of the answer is entirely about what a
signature can carry.

It is also where the track's privacy strand becomes concrete. Learners easily
say "privacy-preserving verification"; far fewer can say what a verifier would
actually be shown, and less is usually enough than people assume.

## Scope

**In scope:** published work on compute monitoring and workload
characterisation, public datacentre power and utilisation reporting, and any
small-scale measurement you can run yourself on a rented GPU.

**Out of scope:** building a detector at scale, and access to real cluster
telemetry. This is analysis with an honest evidence base — where a claim rests
on a plausible mechanism rather than a measurement, say so in place.

**Also out of scope:** designing the legal authority to collect the telemetry.
Assume the verifier is entitled to what you specify, and be conservative about
what you specify.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Signals | "Unusual compute usage" | Named observables with a mechanism, ranked by how hard each is to fake |
| Access level | Unstated | Exactly what the verifier sees, and the detection rate at each level |
| False positives | Ignored | The confusable workloads named, and the cost of accusing one |
| Spoofing | "Evasion is possible" | Priced per signal, against the value of the run being hidden |

## Getting started

1. Write the list of confusable workloads before the list of signals. It stops
   you designing a detector for a world with one kind of computation in it.
2. Pick the least intrusive access level that still works. Starting from full
   telemetry and cutting back never converges.
3. Cost the spoof for your best signal in week two. If it is cheap, that signal
   is decoration and you have two weeks to find a better one.
