---
title: Make an Eval Result Believable to a Stranger
track: Verification
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
  - "[Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), Appendix A.2](https://arxiv.org/abs/2507.15916)"
  - "[Request for Proposals: Improving Capability Evaluations — Coefficient Giving, formerly Open Philanthropy (2025, closed)](https://coefficientgiving.org/funds/navigating-transformative-ai/request-for-proposals-improving-capability-evaluations/)"
updated: 2026-08-20
---

## The idea, as posed

From [Verifying International Agreements on AI — Baker, Kulp, Marks,
Brundage & Heim (2025)](https://arxiv.org/abs/2507.15916), Appendix A.2,
Hardware-Backed Workload Certificates and Evaluations. Quoted:

> Hardware security features could enable on-chip verification mechanisms
> including hardware-backed workload certificates and hardware-backed
> evaluations (Appendix A.2). This appendix outlines how these mechanisms
> could be implemented, assuming tamper-evident secure boot and optionally
> Confidential Computing are supported in AI compute clusters’ AI chips and
> CPUs. If supported, secure boot could ensure the presence of system
> software that enforces the following behavior, with Confidential Computing
> optionally used where specified below:

The certificate is the link in the chain:

> The systems software outputs a certificate attesting to the logged data,
> which the Verifier later tests via Confidential Computing or a trusted
> cluster (Section 4.2).
>
> Verification Subgoal 1.B: The system software checks that the AI models,
> data, and code have the required properties, e.g., verifies the results of
> safety evaluations. As above, the system software could do this by:

## What you produce

The attestation spec the quoted mechanism sketches: the chain from logged
data to certificate to check, the residual trust at each link, and the
cost to the lab that has to run it.
