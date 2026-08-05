---
title: What Counts as a New Model?
track: Technical Governance
verification_fit: "A reporting regime (unit 2.2.2) needs the line where an update becomes a new entry; this draws that line and back-tests it."
status: draft
summary: A registry has to say when an update becomes a new entry. Draw the line, test it against a year of real releases, and say what each side of it costs.
team: 1-2
effort_hours: 12-16
duration: 2 weeks
difficulty: core
deliverable: Registry threshold rule, back-tested against a year of real model updates, with the cost either way
deliverable_type: spec
mentor: optional
audience: Whoever operates the registry, and the developer deciding whether this checkpoint needs filing.
skills: [definition design, back-testing a rule, regulatory administrability, technical judgement]
prerequisites: [TG week 5 — frontier safety policies, TG week 6 — transparency, documentation and access]
sources:
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025), operationalisation questions: what should constitute the lower bar for tracking updates to models, for example in a model registry?](https://arxiv.org/abs/2407.14981)"
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 60: piloting and scaling a monitoring initiative for AI capabilities](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
  - "[List of lists of project ideas in AI safety — LessWrong](https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety)"
  - Technical Governance Track - Work Structure and Suggestions.md §3 weeks 5-6
updated: 2026-08-05
---

## The brief

Model registries appear in nearly every governance proposal and none of them
answers the administrative question that decides whether a registry works: what
counts as an update worth filing?

Draw the line.

- **The candidate rules.** Any weight change; a compute-delta threshold on the
  additional training; a capability-delta threshold measured by eval; a
  version-string change; deployment-surface change regardless of weights. Each
  is defensible and they produce wildly different filing volumes.
- **The back-test.** A year of real, publicly documented model updates —
  point releases, safety patches, quantisations, distilled variants, context
  window extensions, new modalities. Apply each rule. Report how many filings
  each produces, and which updates each rule misses that you think mattered.
- **The two costs.** A bar set too low buries the registry in filings nobody
  reads, which is a real failure and not a lesser one; too high and it misses
  the update where the capability arrived. Name a real update that lands on the
  wrong side of your line, in each direction.
- **The recommendation.** One rule, its expected annual volume, and the
  exception you would attach — usually something like a duty to file any update
  that changes an eval result already reported to the regulator, regardless of
  how small the change looks.

## Why it exists

This is a small question that decides whether an entire class of governance
mechanism functions. It is also representative of a category of work — the
administrability of a proposed instrument — that is chronically undersupplied
because it is unglamorous and requires actually counting things.

The back-test is the pedagogy. Learners propose a definition, apply it to a
year of reality, and discover the volume it generates. Nothing else teaches the
difference between a rule that reads well and a rule that runs.

## Scope

**In scope:** public release notes, model cards and version histories for a
handful of developers over one year; published registry proposals and
comparable registries in other sectors.

**Out of scope:** designing the registry's data schema, its access rules, or
its legal basis. One threshold question, answered with evidence.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Rules | One proposal | Four candidates, each stated precisely enough to apply mechanically |
| Back-test | Illustrative examples | A year of real updates, with a filing count per rule |
| Costs | "Trade-offs exist" | A named real update on the wrong side of your line, in each direction |
| Recommendation | The most rigorous rule | The one that runs, with its expected volume and a targeted exception |

## Getting started

1. Collect the year of updates before designing any rule. The distribution of
   what developers actually ship is the whole input.
2. Apply each rule mechanically, without adjusting it when the answer is
   awkward. The awkward answers are the finding.
3. Write the exception last. A clean rule plus one targeted exception beats a
   rule with the exception baked into its wording.
