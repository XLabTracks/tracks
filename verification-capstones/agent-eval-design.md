---
title: Evaluate an Agent, Not a Model
track: Technical Governance
status: draft
summary: Agent capability depends on the scaffold, the tools and the environment as much as the model. Build the eval that survives that, and report what your score is actually about.
team: 1-2
effort_hours: 16-22
duration: 3 weeks
difficulty: stretch
deliverable: Agent eval with an ablation over scaffold and tools, plus a note on what the score attributes to what
deliverable_type: notebook
mentor: recommended
audience: The regulator who will be handed an agent benchmark score and asked to trigger on it.
skills: [agent evaluation, ablation design, attribution of capability, environment design]
sources:
  - "[A long list of open problems and concrete projects in evals — Hobbhahn and contributors (2025), \"Better elicitation techniques\" and the agent-forecasting extensions](https://docs.google.com/document/d/1gi32-HZozxVimNg5Mhvk4CvW4zq8J12rGmK_j2zxNEg/edit)"
updated: 2026-08-20
---

## The idea, as posed

From [A long list of open problems and concrete projects in evals —
Hobbhahn and contributors (2025)](https://docs.google.com/document/d/1gi32-HZozxVimNg5Mhvk4CvW4zq8J12rGmK_j2zxNEg/edit),
the "Better Elicitation techniques" entry. Quoted:

> Are there any low-hanging fruit for better elicitation that people are
> missing? Are there techniques that can be applied to a wide range of
> models that can quickly improve their performance on benchmarks like
> METR’s general autonomy suite and get better performance than what METR
> got during their elicitation? (Especially with a similar or smaller
> amount of labor, e.g. 6 days) Candidates for such techniques include:
>
> Some more clever way of doing best-of-N
>
> Some tree-search technique that isn’t ultra costly
>
> Better general-purpose tools for LM agents, e.g. like Anthropic’s edit
> tool
>
> Some fuzzing like techniques to improve exploration.

And under "Observational scaling laws", among the extensions it lists to a
published agent-forecasting method:

> Rerun the methodology on more agentic benchmarks, e.g. MLE-Bench
>
> Try really hard to get good scaffolding for some of these benchmarks and
> see if the trends hold.

## What you produce

An answer at capstone scale: one agent eval in a scriptable environment,
the ablation that varies scaffold and tools while the model is held fixed
— better general-purpose tools included — and the attribution note saying
what the score is a property of and whether the trends hold under the
scaffolding you found.
