---
title: Is the Model in Production the Model That Passed?
track: Verification
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
sources:
  - "[Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), §1.4 and Appendix A.2](https://arxiv.org/abs/2507.15916)"
updated: 2026-08-20
---

## The idea, as posed

From [Verifying International Agreements on AI — Baker, Kulp, Marks,
Brundage & Heim (2025)](https://arxiv.org/abs/2507.15916), Key Findings.
Quoted:

> Verify that declared uses of large-scale AI compute are compliant by (A)
> verifying that trained AI models and their outputs were generated as
> claimed; and (B) verifying evaluation results, or more generally,
> verifying that declared models, data, and code have the required
> properties. “Declared” means self-reported, preferably via
> confidentiality-preserving technologies.

Appendix A.2 says what a deployment declaration would pin down:

> Declarations: When a Prover loads an AI workload onto an AI compute
> cluster, the Prover includes explicit, specially formatted information
> about whether the workload is AI training or inference, and what memory
> locations and/or data packets will hold the model weights, training data,
> and usage data. This constitutes the Prover’s declaration of their models
> and data. (The Prover’s declaration of code is implicit in the code they
> load to CPUs.)

## What you produce

The chain that closes the evaluation-to-production gap: a protocol diagram
from the evaluated artifact to what serving infrastructure actually runs,
built on the quoted declarations, with the attack tree against it.
