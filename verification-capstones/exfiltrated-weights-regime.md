---
title: When the Weights Are Already Out
track: Verification
status: draft
summary: Module 3 rates weight exfiltration as the evasion route that bypasses the compute regime entirely. Specify what a verification regime does the day after it happens.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Post-exfiltration regime annex — what is still verifiable, what is not, and what the agreement should have said
deliverable_type: spec
mentor: recommended
audience: The parties to an agreement whose central mechanism has just been routed around.
skills: [regime design, ecosystem monitoring, threat modelling, evidence standards]
prerequisites: [Verification 2.x — the four layers, Verification 3 — covert development, Verification 4.1 — feasibility and layering]
sources:
  - "[Open Technical Problems in Open-Weight AI Model Risk Management (2025)](https://openreview.net/forum?id=8QyGLnFkzc)"
  - "[Open Technical Problems in Open-Weight AI Model Risk Management — author PDF](https://stephencasper.com/wp-content/uploads/2025/11/open_weight_model_safety_oct2025.pdf)"
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025)](https://arxiv.org/abs/2407.14981)"
  - "[List of lists of project ideas in AI safety — LessWrong](https://www.lesswrong.com/posts/mtGpdtDdmkRC3ZBuz/list-of-lists-of-project-ideas-in-ai-safety)"
  - verification-track-outline.md §3 (evasion scenario 4 — weight exfiltration)
  - verification-track-outline.md §4.1
updated: 2026-08-04
---

## The brief

Module 3 lists eight evasion scenarios and rates each on feasibility,
detectability, longevity and who could fix it. One of them is different in
kind: weight exfiltration does not cheat the compute regime, it makes the
compute regime irrelevant. Training already happened. The artifact is a file.

Write the annex a verification regime needs for the day after.

- **The trigger.** What observation tells the parties this has happened at
  all — and how long that takes. Be honest: this is often the weakest link in
  the whole annex, and naming the detection lag is half the deliverable.
- **What survives.** Which of the four layers still tells you anything once
  the weights are loose. Hardware and cloud were watching *training*. Say
  plainly what each layer can and cannot see about a model that is now being
  run by someone who never signed anything.
- **What replaces it.** Ecosystem-level observation — where the file
  propagates, who serves it, who fine-tunes it, what shows up downstream —
  and what each of those costs in cooperation from parties who may not be
  party to the agreement.
- **The claim you can still make.** One sentence a verifier could stand
  behind afterwards, and the sentence they can no longer say. That contrast
  is the annex's point.
- **The ex-ante clause.** Working backwards: what the agreement should have
  required *before* this happened — custody obligations, security standards,
  declaration of holdings, reporting of a suspected breach — and what each
  would have cost the parties to accept.

## Why it exists

The track's spine is the compute regime: chokepoints, thresholds, metering,
attestation. It is a good spine, and Module 3 is where you learn that a good
spine can be stepped around rather than broken. Weight exfiltration is the
purest case, and it is the one that most exposes the difference between
verifying a *process* and verifying a *state of the world*.

It also connects the track to the fastest-moving open literature. The
open-weight risk-management work catalogues problems across training data,
training, evaluation, deployment and ecosystem monitoring — and the last of
those is precisely the layer a verification regime has to fall back on here.
Most of it is unsolved, which is why this capstone produces an annex with
honest holes rather than a fix.

## Scope

**In scope:** one agreement (reuse the one from your Module 4 capstone if you
did it), one exfiltration scenario, the four layers, and public literature on
open-weight and post-release monitoring.

**Out of scope:** the security engineering of preventing exfiltration. That
is a real field and a different capstone. You are picking up after it failed.

**Also out of scope:** arguing about whether open release is good. The
scenario here is an unauthorised leak from a party under an agreement, which
is a different question from a deliberate publication decision — the
open-weight literature covers both, and conflating them is the most common
way this annex goes wrong.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Detection | "The breach would be discovered" | A named observable, who holds it, and an honest estimate of the lag |
| Layer analysis | "Verification becomes harder" | Per layer, what it still sees and what it never saw, stated separately |
| Fallback | "Monitor the ecosystem" | Named observation points, and the cooperation each one requires from a non-party |
| The retired claim | Absent | The specific sentence the regime can no longer say, written out |

The best annexes end up recommending something the parties would hate, and
say why they should accept it anyway.

## Getting started

1. Start with the detection lag. Everything downstream is conditioned on how
   late you find out, and most drafts assume an implausibly fast trigger.
2. Do the four-layer pass as a table before writing prose. It is the fastest
   way to discover how much of the regime was watching training only.
3. Write the ex-ante clause last, then check it against the cost question. A
   clause the parties would never have signed is not a finding, it is a wish.
