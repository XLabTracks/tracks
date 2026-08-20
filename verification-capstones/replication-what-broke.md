---
title: Replicate a Published Number and Report What Broke
track: Technical Governance
status: draft
summary: Take one eval score or compute estimate that governance arguments lean on, reproduce it, and report what was underspecified, what it is sensitive to, and what a policy reader should cite instead.
team: 1-2
effort_hours: 16-22
duration: 3 weeks
difficulty: stretch
deliverable: Replication notebook plus a two-page "what the source did not tell you" note
deliverable_type: notebook
mentor: recommended
audience: The next person about to cite that number in a memo.
skills: [replication, experimental hygiene, elicitation sensitivity, negative results]
sources:
  - "[A long list of open problems and concrete projects in evals — Hobbhahn and contributors (2025), science of evals; \"Replicate bio evals with better tools\"](https://docs.google.com/document/d/1gi32-HZozxVimNg5Mhvk4CvW4zq8J12rGmK_j2zxNEg/edit)"
updated: 2026-08-20
---

## The idea, as posed

From [A long list of open problems and concrete projects in evals —
Hobbhahn and contributors (2025)](https://docs.google.com/document/d/1gi32-HZozxVimNg5Mhvk4CvW4zq8J12rGmK_j2zxNEg/edit),
the "Science of evals" section. Quoted:

> By science of evals, we broadly mean “figure out how to make the entire
> process of evaluating models and their effects more informative,
> replicable, predictive, rigorous, etc.” Many ideas in this section are
> open questions and don’t have concrete projects available.

One entry, "Replicate bio evals with better tools" (credit: Igor Ivanov),
makes the replication case concrete:

> US AISI ran bio evaluations for o1 by using the LAB-bench benchmark.
> They ran evaluations with access to the Python interpreter, but the
> model most likely would benefit from access to more tools, like genetic
> databases or a search engine for scientific articles. This means that
> with proper scaffolding o1 would be more capable, and they underelicited
> true capabilities of the model. Someone can replicate their evaluations,
> but with more advanced scaffolding.
>
> This project is important because apart from US AISI, almost no one
> shares their bio evaluations of frontier models, so there is limited
> information flow in the field, and their methodology is rather basic, so
> any improvement on it would meaningfully contribute to the field.

## What you produce

A replication in exactly that spirit, on a published number of your
choosing: the notebook that reproduces it, the comparison with the gap
quantified, the sensitivity check on what the source left unstated, and
the two-page note on what the methodology did not tell you — the
improvement on basic methodology the entry says would meaningfully
contribute to the field.
