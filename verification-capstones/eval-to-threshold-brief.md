---
title: From Eval Result to Policy Threshold
track: Technical Governance
status: ready
summary: Turn an eval you actually ran into a short technical-policy brief that defends one threshold — with the elicitation gap stated, not buried.
team: 1
effort_hours: 12-18
duration: 2 weeks
difficulty: core
deliverable: Four-page technical-policy brief with an appendix of your own eval logs
deliverable_type: memo
mentor: optional
audience: A policy staffer who has to defend a number in a rule.
skills: [eval interpretation, threshold design, technical writing for non-technical readers, uncertainty communication]
updated: 2026-08-04
---

## The brief

You ran an eval during the track. Now use it as the evidence base for a
brief that argues for — or against — one specific governance threshold.

The brief has four moving parts:

1. **The claim.** One sentence: what your eval result supports. Written so
   it could be falsified.
2. **The evidence.** Your actual numbers, with the elicitation setup that
   produced them, and the variance you measured when you broke your own
   eval in week 4.
3. **The threshold.** The rule you are arguing about — a FLOP threshold, a
   capability trigger in a frontier safety framework, a pre-deployment
   testing requirement — and what your evidence does to it.
4. **The honest limits.** What your eval cannot certify. Elicitation gaps,
   contamination risk, the distance between a benchmark score and a
   real-world capability.

## Why it exists

The governance-relevant skill is not running the eval. It is knowing what
an eval result can and cannot carry in an argument, and saying so in front
of an audience that would rather have a clean number.

It is also the artifact that survives contact with an application reader.
A brief with your own logs attached is verifiable; "familiar with model
evaluations" is not.

## Scope

**In scope:** the eval you built or ran in weeks 3–4, any published
frontier safety framework, and open compute data.

**Out of scope:** a new eval from scratch. If your week 3–4 result is thin,
the fix is a sharper claim, not more experiments — you have two weeks.

## What good looks like

- A non-technical reader finishes the brief able to state your claim and
  one reason to doubt it.
- The variance measurement from week 4 appears in the argument, not just in
  the appendix. The whole point of breaking your own eval was to know how
  much weight it bears.
- The recommendation names an actor and a decision. A brief addressed to
  nobody about nothing is the genre's standard failure.

## Getting started

1. Write the falsifiable claim first, on one line. Everything else is
   scaffolding for it.
2. Re-read your week 4 variance numbers before you decide how strong the
   claim can be.
3. Give it to someone who does not know what a solver or a scorer is. If
   they cannot restate the claim, the brief is not finished.
