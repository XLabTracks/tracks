---
title: Make Sandbagging Not Worth It
track: Technical Governance
verification_fit: "A developer eliciting weakly to stay under a trigger is module 3's determined actor; this designs the incentives that make cheating expensive."
status: draft
summary: A developer whose model must score below a threshold has every reason to elicit weakly. Design the regulatory incentives that make under-elicitation the expensive option.
team: 1-2
effort_hours: 14-18
duration: 3 weeks
difficulty: stretch
deliverable: Incentive design — the detection route, the penalty, and the reporting rule that makes both work
deliverable_type: spec
mentor: recommended
audience: The regulator who has to accept an eval result from a party that benefits from a low score.
skills: [incentive design, eval methodology, detection reasoning, regulatory drafting]
prerequisites: [TG week 3 — running evals, TG week 4 — why evals are hard, TG week 5 — frontier safety policies]
sources:
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 38: what regulatory incentives should target evaluation sandbagging?](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
  - "[100+ Concrete Problems and Open Projects in Evals — Marius Hobbhahn (2025)](https://docs.google.com/document/d/1gi32-HZozxVimNg5Mhvk4CvW4zq8J12rGmK_j2zxNEg/edit)"
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025)](https://arxiv.org/abs/2407.14981)"
  - "[List of lists of project ideas in AI safety — LessWrong](https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety)"
  - Technical Governance Track - Work Structure and Suggestions.md §3 weeks 4-5
updated: 2026-08-05
---

## The brief

Week 4 teaches sandbagging as an eval-methodology problem. It is also an
incentive problem, and the incentive version is unsolved: when a threshold
attaches a consequence to a score, the party running the eval is the party who
benefits from a low one. Nobody has designed the counter-incentives.

Deliver:

- **The sandbagging taxonomy for your case.** Deliberate under-elicitation is
  only one route. Also: a weak scaffold, an unrepresentative prompt set, a
  checkpoint that is not the deployed model, stopping the search early, running
  the eval five times and reporting the median. Rank them by how deniable each
  is — deniability is what makes a route attractive.
- **Detection.** For each route, what would reveal it. Independent re-runs,
  mandated elicitation floors, held-out sets, publication of full logs,
  comparison against an external baseline. Say honestly which routes have no
  detection at all.
- **The incentive.** The core deliverable. Penalty scaled to what the low score
  bought, plus the reporting rule that makes the penalty attachable — you
  cannot punish under-elicitation without a stated standard of elicitation to
  fall short of.
- **The perverse-effect check.** Every anti-sandbagging rule pushes somewhere.
  A mandated elicitation floor can become a ceiling. Aggressive penalties can
  stop developers running exploratory evals at all. Name the effect your design
  produces and say why it is worth it.

## Why it exists

This is where the technical and policy halves of the track have to meet. A pure
methodology answer ("elicit harder") ignores that the elicitor chooses how hard;
a pure policy answer ("penalise sandbagging") ignores that you cannot detect it
without methodology. Learners who can hold both are exactly what
technical-governance teams are hiring for.

It also generalises. Self-reported measurement under a threshold with
consequences is the same structure as emissions testing, drug trials and safety
certification — and every one of those had to solve this, badly, before it
solved it well.

## Scope

**In scope:** published eval methodology, frontier safety frameworks and their
threshold language, and analogous testing regimes in other industries.

**Out of scope:** building a sandbagging detector, and proving any specific
developer has done it. This is design work about an incentive structure, not an
accusation.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Taxonomy | "Developers might underreport" | Routes ranked by deniability, with the most deniable identified |
| Detection | "Independent verification" | Per route, the specific check — and the routes with none, named |
| Incentive | "Significant penalties" | Scaled to the benefit obtained, attached to a stated elicitation standard |
| Perverse effects | Unconsidered | The effect your rule produces, and the trade you accept |

## Getting started

1. Rank the routes by deniability first. Deliberate lying is the easy case and
   the least likely; the design problem is the manoeuvres that look like
   ordinary methodological choices.
2. Write the elicitation standard before the penalty. Without it there is
   nothing to enforce against.
3. Test your rule against an honest developer having a bad quarter. If it
   punishes them too, redesign.
