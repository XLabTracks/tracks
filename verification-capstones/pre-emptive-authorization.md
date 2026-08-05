---
title: A Licence to Train
track: AI Governance Policy
verification_fit: "A licence to train is the standing version of the capstone's pause — its decision test runs on the evidence streams module 2 teaches."
status: draft
summary: Licensing keeps being proposed for frontier training and never specified. Design the authorisation regime — the trigger, the test, the decision-maker, and the appeal.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Authorisation regime design with the decision test, timelines, and a caseload estimate
deliverable_type: spec
mentor: recommended
audience: The agency that would have to say yes or no, on a clock, with the evidence available.
skills: [regulatory design, administrative process, decision-test drafting, caseload estimation]
prerequisites: [Policy week 4 — compute policy and export controls, Policy week 6 — standards and liability]
sources:
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 57: pre-emptive authorization for AI training](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 53: should parts of the frontier AI industry be treated like public utilities?](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025)](https://arxiv.org/abs/2407.14981)"
  - "[List of lists of project ideas in AI safety — LessWrong](https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety)"
  - AI Governance Policy Track - Work Structure and Suggestions.md §3 week 6 (licensing debates)
updated: 2026-08-05
---

## The brief

Week 6 covers licensing as one of the live regulatory-design debates. It is
argued almost entirely at the level of principle — pro-licensing versus
anti-licensing — and almost never at the level where licensing regimes
succeed or fail, which is administrative design.

Design the regime.

- **The trigger.** What requires authorisation. Compute above a line, a
  capability class, a deployment context, or a combination. Say what
  deliberately does not.
- **The decision test.** What the applicant must show and what the agency must
  find. This is the hard part, and the honest difficulty is that the evidence
  a regulator would want — how capable will this model be? — does not exist
  before the run. Say how your test handles that: conditional authorisation,
  a plan-based test rather than an outcome-based one, staged approval at
  checkpoints.
- **Timelines and default.** How long the agency has, and what happens on
  silence. Deemed approval and deemed refusal are completely different regimes
  and the choice is usually made by accident.
- **The caseload.** Estimate applications per year from your trigger, and the
  staff needed to decide them at the quality your test demands. A regime that
  generates more cases than the agency can decide converts into rubber-stamping,
  which is worse than no regime because it launders the decision.
- **Appeal and review.** What an applicant can challenge, and the sunset or
  review clause, because the trigger will be wrong within two years.
- **The honest downside.** Who this entrenches. Licensing raises fixed costs,
  which advantages incumbents; say by how much and whether you accept it.

## Why it exists

Learners arrive at licensing as a position to hold. They should leave with the
understanding that a licensing regime is a queue, a test and a staffing model,
and that most of the outcome is decided by those three rather than by the
statute's ambition.

The caseload estimate is the piece that transfers everywhere. Any proposed
approval regime — for models, for deployments, for exports — lives or dies on
whether the decision-maker can actually decide at volume.

## Scope

**In scope:** licensing and pre-approval regimes in other sectors (pharma,
nuclear, aviation, financial authorisations) as design and staffing anchors,
plus the published AI-licensing debate.

**Out of scope:** statutory drafting, and the constitutional question of
whether a given jurisdiction may do this. Pick a jurisdiction, assume the
authority exists, and design well within it.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Decision test | "Demonstrate adequate safety" | A test the agency could actually apply pre-training, with its evidence problem named |
| Timelines | Unstated | A clock, and an explicit choice between deemed approval and deemed refusal |
| Caseload | Ignored | Applications per year estimated, with the staffing the test implies |
| Downside | Unacknowledged | The entrenchment effect estimated, and accepted or mitigated on the record |

## Getting started

1. Write the decision test first and immediately ask what evidence exists
   *before* the run. That question reshapes every licensing design that has
   ever been proposed and most drafts never confront it.
2. Anchor the caseload on a real regulator's published throughput. It is the
   fastest way to find out whether your trigger is administrable.
3. Choose deemed approval or deemed refusal deliberately, and say why.
