---
title: Make an Eval Result Believable to a Stranger
theme: Verification
status: draft
summary: A lab says its model scored below the danger threshold. Specify what a third party would have to observe to believe that — and what it costs to provide.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Attestation spec — the observation chain, the residual trust, and the cost to the lab
deliverable_type: spec
mentor: recommended
audience: The regulator who has to accept or reject a self-reported eval result.
skills: [evidence standards, attestation design, adversarial reasoning, cost-of-compliance analysis]
prerequisites: [Verification 2.x — the four layers, Verification 4.1 — feasibility and layering, TG week 3 — running evals]
sources:
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025)](https://arxiv.org/abs/2407.14981)"
  - "[Technical AI Governance project site — Stanford](https://taig.stanford.edu/)"
  - "[100+ Concrete Problems and Open Projects in Evals — Marius Hobbhahn (2025)](https://docs.google.com/document/d/1gi32-HZozxVimNg5Mhvk4CvW4zq8J12rGmK_j2zxNEg/edit)"
  - "[Request for Proposals: Improving Capability Evaluations — Coefficient Giving, formerly Open Philanthropy (2025, closed)](https://coefficientgiving.org/funds/navigating-transformative-ai/request-for-proposals-improving-capability-evaluations/)"
updated: 2026-08-04
---

## The brief

Almost every frontier safety framework in existence rests on evals the
developer runs on itself. Almost every verification regime being proposed
would inherit that. Write the spec that closes the gap for **one** eval.

The spec names:

- **The claim.** One eval, one threshold, one sentence: "model M scores below
  T on eval E under elicitation X."
- **The attack list.** How the claim could be false while the lab tells no
  outright lie — weakened elicitation, a checkpoint that is not the deployed
  one, item leakage into training, a scaffold quietly capped, selective
  reporting across runs, a threshold chosen after seeing results.
- **The observation chain.** For each attack, what a third party would have to
  observe to rule it out. Be specific about artifacts: logs, hashes, seeds,
  weights access, an independent re-run, a live witnessed run, an escrowed
  held-out set.
- **Residual trust.** After all of it, what the third party is still simply
  taking the lab's word for. There is always something. Name it.
- **Cost.** What providing this chain costs the lab in engineering time,
  compute, and exposed IP — because a regime nobody can afford to comply with
  is not a regime.

## Why it exists

The track spends its length on verifying things between states — compute,
facilities, treaties. This is the same problem shrunk to a single number, and
it is the one that is live right now: regulators are already being handed
self-reported eval results and have no settled way to price their credibility.

It is also the cleanest exercise in the track's central discipline. Every
mechanism you add has to answer "what does the reader believe after this that
they did not believe before?" — and here you can check your answer against a
concrete artifact rather than a diplomatic hypothetical.

## Scope

**In scope:** one published eval or one you specify, existing attestation
building blocks (hashing, logging, third-party re-runs, held-out sets,
hardware attestation where it exists), and the track's layering framework.

**Out of scope:** inventing cryptography, and a general framework for all
evals. One eval, one threshold. The general version is a paper, not a
capstone.

**Do not assume weights access.** A spec that works only when the third party
gets the weights has answered an easier question than the one regulators face.
If you want to use it, you must price it and offer a fallback.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Attacks | "The lab could cheat" | Six named routes, each of which is technically consistent with an honest-sounding report |
| Chain | "An independent auditor verifies" | Per attack, the specific artifact, who holds it, and when it must be produced |
| Residual trust | Claimed to be zero | Stated plainly, with what it would take to shrink it further |
| Cost | Ignored | Estimated per requirement, with the one you would drop first if the lab pushed back |

The single best test of a submission: hand it to someone and ask them to
cheat past it. If they cannot find a route in ten minutes, the attack list was
probably written by an optimist.

## Getting started

1. Write the attack list before the observation chain. Building the chain
   first produces a spec that defends against the attacks you happened to
   think of while designing it.
2. Pick an eval with a published methodology. You cannot attest to a procedure
   nobody has written down, and discovering that is itself a finding.
3. Cost every requirement as you add it, in the same table. Costing at the end
   always produces a chain nobody would adopt.
