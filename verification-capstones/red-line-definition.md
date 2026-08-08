---
title: Draft a Red Line Somebody Could Enforce
track: AI Governance Policy
status: draft
summary: Pick a capability everyone says should be off-limits and write the definition three parties could sign — plus the eval that decides it and the body that acts on it.
team: 1-2
effort_hours: 14-18
duration: 3 weeks
difficulty: stretch
deliverable: Red-line definition, its triggering evidence standard, and the enforcement hook
deliverable_type: spec
mentor: recommended
audience: The standards body or agency that would have to make the line operative.
skills: [definition drafting, consensus analysis, evidence standards, enforcement design]
sources:
  - "[Projects someone should maybe do — Catherine Brewer (2025), on red lines and consensus around eval standards](https://docs.google.com/document/d/1MQ8CbgOy13GTWkJr09D-0fdPKydnrYYWIgSys0BwuP8/edit)"
updated: 2026-08-04
---

## The brief

"Red line" is the most agreed-upon phrase in AI governance and one of the least
specified. Everyone signs the principle; nobody has to sign a sentence. Write
the sentence.

Pick one candidate red line — an autonomous-replication capability, a
cyber-offence threshold, a specific uplift category — and produce:

- **The definition.** What is prohibited, in language a lawyer cannot drive a
  truck through and an engineer can recognise in a test result. This is
  genuinely hard and it is most of the work.
- **The triggering evidence.** What measurement establishes that the line has
  been crossed. Which eval, run by whom, under what elicitation, at what
  confidence. A red line without a trigger is a press release.
- **The consensus analysis.** Three actors who would have to accept it — pick
  real ones, e.g. two frontier developers and one regulator, or two states —
  and for each: what they gain, what they would resist, and the narrower
  version they might sign instead.
- **The enforcement hook.** What happens on a crossing, under what existing or
  proposed authority. Licence condition, procurement bar, liability trigger,
  treaty obligation, standard incorporated by reference.
- **The two failure modes.** Where your definition is over-inclusive (catches
  something harmless, so nobody adopts it) and under-inclusive (misses the
  thing you care about, so adopting it buys nothing). Both, named, in your own
  text.

## Why it exists

Week 3 teaches you to mark up an RSP and find every weasel word. This is the
constructive inverse: try to write a clause with no weasel words and discover
which of them were load-bearing. The learners who do this stop reading
vagueness as laziness and start reading it as the price of getting a signature.

It is also the sharpest available exercise on the gap between *a capability
that worries people* and *a capability that can be defined, measured, and
acted on*. The technical-governance literature keeps returning to that gap;
this is the version you can hold in your hand in three weeks.

## Scope

**In scope:** one candidate line, public frontier safety frameworks, existing
standards language to borrow structure from, and published eval methodologies
for the trigger.

**Out of scope:** running the eval, and drafting statutory text. You need the
obligation and its hook, not a bill.

**Do not pick a line whose measurement does not exist yet.** If no published
eval could plausibly trigger it, you are writing an aspiration — say so
explicitly and pick again in week one, because "we cannot yet measure this" is
a finding that takes a paragraph, not three weeks.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| The definition | "Dangerous autonomous capability" | A sentence with an observable in it, plus what it deliberately excludes |
| Trigger | "If evals show the model is capable" | A named eval, an elicitation, a threshold, and who is trusted to run it |
| Consensus | "Stakeholders would need to agree" | Three named actors, their objection, and the narrower line each would sign |
| Failure modes | One-sided | Both directions, with a worked example of each |

The strongest submissions end up recommending a *narrower* line than the one
they started with, and can say exactly what was given up to make it signable.

## Getting started

1. Write the over-inclusive failure first. Take your draft definition and find
   the harmless thing it bans. That test kills more drafts than any other.
2. Find the trigger before polishing the language. A definition nobody can
   measure will be rewritten from scratch once you go looking.
3. Ask, for each of your three actors, what they would say in public versus
   what would actually stop them signing. The gap is where the negotiation is.
