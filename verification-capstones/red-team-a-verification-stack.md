---
title: Red-Team a Verification Stack
track: Verification
status: ready
summary: Take a published verification proposal and break it — a structured evasion report with detection probabilities and the patch each route demands.
team: 2-3
effort_hours: 16-22
duration: 3 weeks
difficulty: stretch
deliverable: Evasion report with an attack tree and a patch list
deliverable_type: analysis
mentor: recommended
audience: The team that published the proposal you are attacking.
skills: [red-teaming, attack trees, detection reasoning, adversarial cost modelling]
prerequisites: [Verification 2.x — the evidence layers, Verification 3 — covert development]
updated: 2026-08-04
---

## The brief

Choose a real, published verification proposal — a layered monitoring
scheme, a hardware-attestation design, a reporting regime — and build the
case that it fails. Then say what it would take to fix.

The report contains:

1. **The steelman.** One page reconstructing the proposal at its strongest,
   in the authors' own terms. You do not get to attack a version they
   would not recognise.
2. **The attack tree.** The defection goal at the root, branching into
   routes, each leaf annotated with the capability it requires and the
   cost it imposes on the defector.
3. **Detection reasoning.** For each route: which layer would notice, what
   the signature looks like, what the base rate of false alarms does to the
   analyst on the other end.
4. **The three that work.** Rank the routes; defend the top three as the
   ones a real actor would choose, and say why the rest are theatre.
5. **The patch list.** What each surviving route demands — a mechanism, a
   reporting rule, an institution — and what that patch costs the regime in
   intrusiveness, money, or political feasibility.

## Why it exists

Verification proposals are usually evaluated by people who want them to
work. The failure mode of the field is a mechanism that looks sound at the
level of the diagram and dissolves on contact with a motivated actor with
a budget. The skill this builds — attacking a design you find sympathetic,
in public, with the costs stated — is the one that separates an analyst
from an advocate.

Teams of two or three work better here than solos: one person's steelman
is another person's attack surface, and the argument you have in week two
is the point.

## Scope

**In scope:** open literature, the track's evasion taxonomy, and cost
estimates you can defend within an order of magnitude.

**Out of scope:** operational detail that reads as a how-to. Name the route
and the signature; you do not need to write the playbook. If a paragraph
would be more useful to a defector than to a defender, cut it — the report
is a defence artifact.

## What good looks like

- The steelman is good enough that a reader who skipped the attack would
  come away understanding the proposal better.
- Attack costs are stated with units and a source, even when rough.
- The patch list is honest about the patches that make the regime
  politically dead. "Fixable, but only by something no one will sign" is a
  finding, not a failure.

## Getting started

1. Pick a proposal you *like*. Attacking a design you already distrust
   produces a weak steelman and a boring report.
2. Build the attack tree before reading the evasion literature again — then
   read it and see what you missed. The gap is diagnostic.
3. Agree in your team, in writing, on what counts as a successful evasion
   before you start scoring routes.
