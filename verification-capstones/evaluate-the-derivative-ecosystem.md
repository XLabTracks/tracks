---
title: Evaluate a Thousand Models
track: Technical Governance
status: draft
summary: One open release becomes thousands of fine-tunes, merges and quantisations. Design the triage that decides which of them anyone needs to evaluate, and pilot it.
team: 1-2
effort_hours: 16-22
duration: 3 weeks
difficulty: stretch
deliverable: Triage scheme plus a pilot run over a real derivative population, with the cost per model
deliverable_type: notebook
mentor: recommended
audience: The monitoring body that has to watch an ecosystem, not a model.
skills: [scalable evaluation design, sampling, ecosystem monitoring, cost-aware measurement]
sources:
  - "[Open Technical Problems in Open-Weight AI Model Risk Management — Casper et al. (2026), §4.3.4: how can we scalably evaluate thousands of models?](https://arxiv.org/abs/2608.07514)"
  - "[Open Technical Problems in Open-Weight AI Model Risk Management (2025): how can we scalably evaluate thousands of models?](https://openreview.net/forum?id=8QyGLnFkzc)"
updated: 2026-08-20
---

## The idea, as posed

From [Open Technical Problems in Open-Weight AI Model Risk Management —
Casper et al. (2026)](https://arxiv.org/abs/2608.07514),
§4.3.4. Quoted:

> How can we scalably evaluate thousands of models? A major challenge to
> better understanding the open-weight ecosystem stems from the sheer
> number of existing models. Coordinated efforts to evaluate their safety
> properties at scale could improve practical risk management and future
> risk modeling. For example, platforms like Hugging Face which host and
> distribute large numbers of AI models can struggle to reliably identify
> and remove ones that violate their content policies (e.g., 148).
> However, ecosystem-level evaluation is complicated by scale,
> architectural diversity, and the continuous introduction of new models.
> Evaluations involving tampering attacks can be particularly challenging
> due to the computational costs of fine-tuning and other tampering
> algorithms. There is a need for infrastructure for evaluating models at
> scale that balances efficiency with thoroughness. These approaches might
> also integrate new technical resources like model provenance techniques
> (see Section 4.5).

A sibling problem in §4.5.2 sizes the same ecosystem:

> Ecosystem-wide heritage inference is desirable (93) but not tractable
> with current infrastructure and methods. For example, using current
> methods (94), charting models across a platform such as Hugging Face
> would require millions of pairwise comparisons between models. While
> independence between two specific models is computationally inexpensive
> (251), continuous ecosystem-wide monitoring must accommodate daily
> uploads of potentially thousands of new models.

## What you produce

The infrastructure question, answered at pilot scale: a triage scheme over
one base model's real derivative population with a stated monthly budget,
a cheap screen that decides which models get the expensive evaluation —
with its false-negative rate measured — and the balance of efficiency with
thoroughness the problem asks for, priced per model.
