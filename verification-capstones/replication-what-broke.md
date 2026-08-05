---
title: Replicate a Published Number and Report What Broke
track: Technical Governance
verification_fit: "Verification is checking claims someone else published; this reproduces one number regimes lean on and reports what the source never said."
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
prerequisites: [TG week 1 — compute estimates, TG week 3 — running evals, TG week 4 — why evals are hard]
sources:
  - "[100+ Concrete Problems and Open Projects in Evals — Marius Hobbhahn (2025)](https://docs.google.com/document/d/1gi32-HZozxVimNg5Mhvk4CvW4zq8J12rGmK_j2zxNEg/edit)"
  - "[A list of evals resources and plans — Marius Hobbhahn](https://www.mariushobbhahn.com/evals/)"
  - "[Evals projects I'd like to see — cb (2025)](https://forum.effectivealtruism.org/posts/LTbwRuQhBRGxMyqcq/x-6)"
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025)](https://arxiv.org/abs/2407.14981)"
  - "[List of lists of project ideas in AI safety — LessWrong](https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety)"
  - Technical Governance Track - Work Structure and Suggestions.md §2 (extensions — "replicate a published number")
updated: 2026-08-05
---

## The brief

Governance arguments run on numbers other people produced. A benchmark score
that a frontier safety framework maps to a threshold. A training-compute
estimate that decides which side of a regulatory line a model falls. Pick one
such number and reproduce it.

Deliver:

- **The notebook.** Runs top to bottom on free Colab plus a small open model
  or a cheap API call. Pinned versions, fixed seeds, stated runtime and cost.
- **The comparison.** Your number beside the published one, with the gap
  quantified rather than smoothed. For an eval score that means stating your
  elicitation in full; for a compute estimate it means showing the
  architecture and token assumptions you had to guess.
- **The sensitivity check.** Vary one thing the source left to the reader —
  prompt format, few-shot count, sampling, an assumed parameter count — and
  report how much the number moves. Week 4 taught you this on your own eval;
  here you do it to somebody else's published claim.
- **The note.** Two pages for a policy reader: what was underspecified, what
  the number is sensitive to, what you could not reproduce, and the sentence
  they should use instead if they were going to cite it.

## Why it exists

Week 4 teaches that eval scores are elicitation-dependent and Weeks 1–2 teach
that compute estimates are assumption-dependent. Both lessons stay abstract
until you try to land on somebody else's published figure and miss.

Replication is also the cheapest way into empirical governance work: you need
no new idea, so all the effort goes into method, which is where the skill
lives. The track's own production plan lists "replicate a published number" as
the extension for technically strong participants — this is that extension
grown into a capstone with an audience attached.

A last reason, which the field keeps re-learning: numbers rot. A figure
computed against one model generation, one framework version and one
elicitation convention does not stay true, and nothing about the way it gets
cited announces that. Your note is the thing that says so.

## Scope

**In scope:** one published number from a benchmark, a lab system card, an
eval paper, or a public compute-estimate dataset. Small open models and cheap
API calls.

**Out of scope:** frontier-scale reproductions, extending the result, and
picking a number because it is famous. Pick by whether the method is described
concretely enough to follow — and if it is not, say so, because *that* is a
finding a policy reader needs.

**Choose something that fits in one figure or one table.** Reproducing a whole
paper means three weeks of setup and no findings.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Scope choice | A whole paper | One number, done properly, with its provenance traced |
| Fidelity | "Roughly similar" | Side-by-side figures, with the gap quantified and explained |
| Sensitivity | Not tested | One documented variation, with the effect on the number reported |
| The note | A lab diary | A replacement sentence a policy reader can actually cite |

"I could not reproduce it, and here is exactly where the trail goes cold" is a
strong submission — especially when the trail goes cold because the source
never specified something load-bearing.

## Getting started

1. Before committing, spend ninety minutes trying to run the source's own code
   or rebuild its calculation. That session tells you more about feasibility
   than a week of reading.
2. Write down the three things the method leaves to you *before* you start.
   Those become your sensitivity checks and, usually, the note's spine.
3. Log every run from the first one, including the broken ones. The failed
   runs are the note.
