---
title: What Content Provenance Can and Cannot Buy
theme: Technical Governance
status: draft
summary: Measure how fast a watermark dies under ordinary handling, then write the policy-options memo that says which provenance obligations are worth imposing.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: core
deliverable: Robustness measurements plus a policy-options memo ranking provenance obligations by what they survive
deliverable_type: notebook
mentor: optional
audience: The legislator being told that watermarking solves AI-generated content.
skills: [robustness testing, measurement, policy-options analysis, communicating technical limits]
sources:
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 59: what policy options exist for ensuring AI-generated content is identifiable as such?](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
updated: 2026-08-04
---

## The brief

Week 8's exercise has you run a watermark detector and measure how it fares
under paraphrasing. This capstone takes that measurement and turns it into the
document a legislature needs, because "AI content must be labelled" is now in
draft law in several places and the technical basis for it is thinner than the
drafting implies.

- **The robustness curve.** Take one published scheme and measure detection as
  the content is put through ordinary handling: paraphrase, translate and
  translate back, truncate, mix with human text, re-generate a passage, apply a
  format conversion. Report where detection falls to chance. Include the
  *innocent* transformations — a lot of provenance signal dies to a copy-paste
  through a word processor, with no adversary involved.
- **The three layers, separated.** Output watermarking (a signal in the
  content), metadata provenance (a signed manifest travelling alongside), and
  post-hoc detection (a classifier guessing). They fail differently, and a
  policy that conflates them will mandate the weakest one.
- **The two error costs.** A false positive accuses a person of using AI. A
  false negative lets synthetic content pass. State which your measurements
  favour, and what threshold a regime would have to pick.
- **The open-weights hole.** A watermark a developer applies at inference is
  absent from a model whose weights anyone can run. Say what that does to any
  obligation aimed at content rather than at platforms.
- **The options memo.** Three obligations a regulator could impose — on model
  providers, on platforms, on distributors — ranked by what your measurements
  say each would actually achieve, with the one you would not impose named.

## Why it exists

Content provenance is the AI policy area where the gap between what the law
assumes and what the technology does is widest and easiest to demonstrate. A
learner who has personally watched detection collapse under a round-trip
translation will never again write a sentence that treats watermarking as
solved — and can show a legislator the same curve in thirty seconds.

The transferable skill is the one the track exists for: producing the
measurement yourself and then writing the policy document that is honest about
it, rather than citing someone else's summary of either.

## Scope

**In scope:** one published watermarking scheme with available code, a small
open model or an API, and public provenance standards for the metadata layer.

**Out of scope:** designing a new watermarking scheme, and building an
adversarial removal tool beyond the ordinary transformations above. The point
is that ordinary handling is enough; you do not need to build an attack.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Measurement | "Watermarks are fragile" | A curve, with the transformation and the point where detection reaches chance |
| Layers | Treated as one thing | Three mechanisms separated, with their distinct failure modes |
| Errors | Accuracy reported | Both error costs stated, with who bears each |
| Options | "Watermarking should be required" | Three obligations ranked by measured achievable effect, and one rejected |

## Getting started

1. Run the innocent transformations before the adversarial ones. If a copy
   through a word processor kills the signal, the adversarial section is
   almost beside the point.
2. Separate the three layers on day one. Most of the public confusion in this
   area is layer confusion.
3. Write the options memo for a reader who has already been told this is
   solved. That framing produces a much sharper document.
