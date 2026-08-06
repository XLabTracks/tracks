---
title: Is the Model in Production the Model That Passed?
theme: Verification
status: draft
summary: Evals passed on one model. Millions of requests run against another — would anyone notice? Design the chain that lets an auditor say deployed equals evaluated.
team: 1-2
effort_hours: 12-18
duration: 3 weeks
difficulty: core
deliverable: Protocol diagram from evaluation to deployment, plus an attack tree
deliverable_type: design
mentor: optional
audience: The auditor who signed off on the eval and now has to stand behind the deployment.
skills: [protocol design, attestation reasoning, attack trees]
prerequisites: [Verification 2.0 — confidentiality vs verifiability, Verification 3 — covert development]
updated: 2026-08-06
---

## The brief

An evaluation report is a claim about one artifact. A deployment is a
different artifact in a different place, serving traffic through layers of
serving infrastructure, quantization, and routine updates. The gap between
the two is where an assurance regime quietly stops meaning anything. Design
the chain that closes it.

- **The identity claim.** What "the same model" means, precisely: same
  weights, same quantization, same system prompt, same sampling settings,
  same surrounding scaffolding? Each choice changes what the chain must
  carry and what a violation even is.
- **The chain.** From the evaluated artifact to the serving fleet: hashes,
  signatures, attestation, logged deployments. Name every component the
  auditor must trust and what happens at each handoff.
- **The substitutions.** The attack tree: a different checkpoint behind the
  same endpoint, a re-quantized variant, per-route model selection, silent
  updates between audits, an eval-only configuration. For each, whether
  your chain catches it, and at what cost.

## Why it exists

Module 2.0 frames verification as confirming a claim without handing over
the secret; this is that problem at deployment scale, and it is the join on
which any eval-based regime hangs. A rule that binds behaviour to an
evaluation is only as strong as the argument that the evaluated thing and
the deployed thing are the same thing.

## Scope

**In scope:** one deployment architecture held fixed, standard integrity
mechanisms — hashing, signing, attestation, logging — and the institutional
question of who checks what, when.

**Out of scope:** designing the evaluation itself, and behavioural
fingerprinting research. The chain here is about custody, not about
re-testing in production.

## What good looks like

| Dimension | Weak | Strong |
|---|---|---|
| Identity | "Same model" | A definition that decides the hard cases: quantization, prompts, scaffolds |
| The chain | Boxes and arrows | Every trusted component named, with what its failure forfeits |
| Attacks | A worry list | A tree with each substitution costed and mapped to the check that catches it |
| Residue | Implied completeness | The substitutions the chain does not catch, stated plainly |

## Getting started

1. Write the identity claim first and test it against quantization. If your
   definition cannot decide that case, the chain has nothing to carry.
2. Draw the chain with a column for "who trusts whom here" — the protocol is
   the trust structure, not the arrows.
3. Spend the last week on the attack tree, and keep the attacks that
   survive: they are the finding, not a flaw in it.
