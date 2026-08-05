---
title: Can You Prove This Model Came From That Run?
track: Verification
status: draft
summary: Proof-of-learning is in Module 2.1 as fragile and spoofed; model-heritage inference is an open problem next door. Assess what either can support and what a regime could rest on them.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Feasibility assessment of training-provenance claims, with the claims each method can and cannot carry
deliverable_type: dossier
mentor: recommended
audience: The regulator asked to accept "this is the model we evaluated" as established fact.
skills: [feasibility assessment, provenance reasoning, adversarial analysis, evidence standards]
prerequisites: [Verification 2.0 — confidentiality vs verifiability, Verification 2.1 — the hardware layer]
sources:
  - "[Open Technical Problems in Open-Weight AI Model Risk Management (2025), §4.5 model provenance and forensics: model heritage inference, and how practical and scalable proof-of-training methods are](https://openreview.net/forum?id=8QyGLnFkzc)"
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025), verification questions: could proof-of-learning demonstrate and verify model ownership?](https://arxiv.org/abs/2407.14981)"
  - "[List of lists of project ideas in AI safety — LessWrong](https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety)"
  - verification-track-outline.md §2.1
updated: 2026-08-04
---

## The brief

Two separate literatures are circling the same question. Proof-of-learning asks
whether a party can demonstrate that a set of weights is the output of a
particular training run; model-heritage inference asks whether an outside
observer can tell which base model a given artifact was derived from. Module 2.1
already records the verdict on the first — fragile, and spoofed in practice.

Assess what either can actually carry.

- **The claims.** Write out the distinct provenance claims a regime might want:
  *this is the checkpoint that was evaluated*; *this run used the declared data*;
  *this fine-tune descends from that base model*; *this model was not trained
  after the cut-off date*. They have very different difficulty.
- **Method by claim.** For each claim, which method could establish it, at what
  cost to the prover, and with what confidence. Include the boring options —
  hashes and signed checkpoints establish more than people expect, provided
  someone was recording at the time.
- **The adversary.** Per method, the spoofing route and what it costs. This is
  the section Module 2.1's verdict comes from; do not take the verdict on
  trust, find the spoofing results and read them.
- **The recording problem.** Most provenance is cheap if you were recording
  from the start and impossible afterwards. Say which of your claims are
  prospective-only, because that determines whether a regime has to mandate
  logging before it can ever ask the question.
- **The recommendation.** One claim a regime could rest on today, one it should
  not, and the logging requirement that would move a claim from the second
  column to the first.

## Why it exists

"The deployed model is the one that was evaluated" is an assumption underneath
every eval-based governance instrument in existence, and almost nobody has
asked what establishes it. That makes this a small question with a very large
blast radius.

It also teaches the track's most durable habit on a fresh case: separate what a
mechanism proves from what people assume it proves, and price the difference.

## Scope

**In scope:** the proof-of-learning literature and its attacks, model-heritage
and fingerprinting work, watermarking of weights, and standard integrity
machinery (hashing, signing, logging).

**Out of scope:** implementing a method, and inventing one. Also out of scope:
content provenance — watermarking *outputs* is a different problem with its own
capstone in this bank.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Claims | "Verify model provenance" | Four distinct claims, ranked by difficulty, with the easy ones identified |
| Methods | Surveyed | Mapped to claims, with cost to the prover and confidence delivered |
| Adversary | "Attacks exist" | The specific spoofing results, read, with what they did and did not break |
| Recording | Unaddressed | Which claims are prospective-only, and the logging mandate that changes that |

The most useful finding here is usually unglamorous: a signed checkpoint and a
timestamp, required in advance, beats a clever proof nobody can run.

## Getting started

1. Write the four claims first. Most confusion in this area is two people
   proving different things and disagreeing about the result.
2. Read the spoofing papers before the proposal papers. It saves a week.
3. Ask of each claim: could this have been made trivial by a rule that existed
   before the run? Those are your recommendations.
