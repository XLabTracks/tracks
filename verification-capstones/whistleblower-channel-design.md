---
title: A Reporting Channel an Insider Would Actually Use
track: Verification
status: draft
summary: Module 2.3 says the human layer reveals what hardware and technical intelligence cannot — if evidence reaches a verifier. Design the channel, against the NDAs and equity that stop it.
team: 1-2
effort_hours: 12-18
duration: 3 weeks
difficulty: stretch
deliverable: Channel design — who receives, what protects the reporter, and the evidence standard on arrival
deliverable_type: spec
mentor: recommended
audience: The regulator or oversight body that wants insider evidence and currently receives none.
skills: [institutional design, incentive analysis, evidence standards, protective-regime drafting]
prerequisites: [Verification 1 — actors, Verification 2.3 — intelligence and the human layer]
sources:
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 20: AI and whistleblowing](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
updated: 2026-08-04
---

## The brief

Module 2.3's human-layer sections (2.3.7–2.3.10) make the case and state the
problem in the same breath: humans reveal what the other evidence streams cannot — what the company believed, what
leadership was warned about, what was suppressed — and frontier AI adds
secrecy, NDAs, equity incentives and race pressure on top. Whether that
evidence reaches a verifier depends on reporting channels, anti-retaliation
protection and institutional independence.

Design one channel, properly.

- **Reportable matter.** What this channel is for. Not general wrongdoing —
  something like: a safety evaluation whose result was overridden, a capability
  finding not disclosed to a regulator, a security incident not reported.
  Narrow scope is what makes protection defensible.
- **The recipient.** Who receives, and what makes them independent enough to
  be worth the risk. Regulator, standards body, an inspector general, a
  designated board committee. Say what happens to a report on arrival and on
  what clock.
- **The reporter's calculus.** Written explicitly, because this is where
  channels die. What they lose: unvested equity, non-disparagement exposure,
  future employment in a small field where everyone knows everyone. What your
  design gives back: anonymity that survives a small-team context where three
  people knew the fact, legal-cost cover, protection that binds a company
  that has not agreed to it.
- **Evidence on arrival.** What a report has to contain to be actionable, and
  how a recipient triages between a serious disclosure and a grievance —
  without a standard so high that only documented cases get through.
- **The failure mode.** Channels that exist and are never used, and channels
  used and ignored. Say which of the two your design is more at risk of.

## Why it exists

The human layer is where the track's realism lives. The other evidence streams can
be improved with engineering; this one runs on whether a specific person, with
a mortgage and a non-disparagement clause, decides to speak. Designing for that
is a different discipline from designing a telemetry rule, and learners who can
do both understand why regimes fail in practice more often than in theory.

It also connects directly to Module 3: in the false-reporting scenario —
hidden clusters, disguised workloads, falsified logs — insider evidence does
work that the hardware and intelligence layers often cannot do alone.

## Scope

**In scope:** existing whistleblower regimes in finance, aviation, nuclear and
pharma; public reporting on AI-lab NDAs and equity arrangements; the
protective-legislation literature.

**Out of scope:** drafting statutory text, and any specific company's alleged
conduct. This is mechanism design; the examples are illustrations.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Scope | "Safety concerns" | A defined class of reportable matter, with an example that deliberately falls outside |
| Recipient | "An independent body" | Named form, what independence rests on, and the clock on their response |
| The calculus | Protection listed | The reporter's actual losses priced, and what your design returns against each |
| Anonymity | Promised | Assessed honestly against a context where three people knew the fact |

The strongest submissions admit that anonymity is usually unachievable at
frontier labs and design for a reporter who will be identified.

## Getting started

1. Read one mature regime's annual report — how many disclosures, how many
   actioned, how many retaliation findings. Those ratios discipline the design.
2. Write the reporter's calculus in the first session. If your channel does not
   survive it, nothing downstream matters.
3. Pick the narrowest reportable matter you can justify. Broad channels get
   broad opposition and thin protection.
