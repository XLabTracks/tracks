---
title: OP/s Threshold Adjustments for Performance
theme: Technical Governance
status: draft
summary: How should OP/s thresholds adjust for performance across bit-widths? Existing metrics may favor smaller bit-widths, and the acceleration effects are under-analyzed.
team: 1-2
effort_hours: 10-14
duration: 2 weeks
difficulty: core
deliverable: Literature-review-and-modelling note on bit-width performance effects and the threshold adjustment they justify
deliverable_type: analysis
mentor: optional
skills: [literature review, hardware performance modelling]
sources:
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 71: OP/s threshold adjustments for performance](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
similar: [which-compute-target]
updated: 2026-08-06
---

## The idea, as posed

From [A Collection of AI Governance Research Ideas — von Knebel &
Anderljung (2024)](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024),
idea 71, "OP/s Threshold Adjustments for Performance". Quoted:

> How should the OP/s threshold (e.g. in US chip export controls) be
> adjusted to account for performance variations across different
> bit-widths (in OP/s but also overall)? This is critical for accurately
> penalizing and incentivizing the development of AI systems. Existing
> metrics may disproportionately favor smaller bit-widths over larger
> ones. E.g., your metric for FP16 is only 2x higher than FP32, while the
> total performance gains might be higher. […] Reduced bit-width generally
> results in performance acceleration, often exceeding linear improvement.
> However, implementing such changes in hardware requires a couple of
> years. […] Recent studies primarily focus on cost and memory footprint
> reductions, with limited analysis on the acceleration effects. FP16 has
> become the default for training and FP8 might be next.
>
> Research questions: How should the OP/s threshold be adjusted to account
> for performance variations across different bit-widths? Do we see a
> reduced performance for using X 8-bit FLOP vs X 16-bit FLOP for training
> a X FLOP model? While reduced bit-width generally works until a certain
> point, few studies focus on architecture modifications to accommodate
> even lower bit-widths (<8-bit) during training. Methodology: literature
> review, modeling, data analysis.

## What you produce

The note the idea's own research questions describe: what the literature
and your modelling say about performance across bit-widths, and the
threshold adjustment that evidence justifies.

