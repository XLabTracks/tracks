---
title: The Security Baseline That Would Have Stopped It
track: Verification
status: draft
summary: Weight exfiltration is the evasion route that voids the compute regime. Write the infrastructure-security baseline a regime would require in advance, and price it.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Security baseline by threat tier, with the audit evidence for each control and its cost
deliverable_type: spec
mentor: recommended
audience: The regulator writing a security condition, and the lab that has to pass an audit against it.
skills: [security requirement design, threat tiering, auditability analysis, cost-of-compliance analysis]
prerequisites: [Verification 2.4 — the human layer, Verification 3 — covert development, Verification 4.1 — feasibility and layering]
sources:
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025), §6.3.1, prevention of model theft: cybersecurity for model weights, and defence against model inference attacks](https://arxiv.org/abs/2407.14981)"
updated: 2026-08-20
---

## The idea, as posed

From [Open Problems in Technical AI Governance — Reuel et al.
(2025)](https://arxiv.org/abs/2407.14981),
§6.3.1, Prevention of Model Theft. Quoted:

> Motivation: As models become more capable they could become an
> increasingly valuable target for theft by adversarial parties wanting to
> put them to their own potential (mis)use. Similarly, as state-of-the-art
> models become more broadly integrated into the economy and society, the
> attack surface will increase, potentially leading to a greater threat of
> exfiltration (Nevo et al. 2024). It follows that securing model weights,
> and other system components, might become an increasing priority to
> prevent theft or model access by unauthorized parties that may undermine
> governance initiatives aimed at ensuring customer safety and national
> security (Nevo et al. 2024).

Its open problems:

> Ensuring adequate cybersecurity for model weights. Protecting model
> weights against exfiltration attempts requires protections against
> insider and outsider threats (Nevo et al. 2024). This includes standards
> for physical security of the data center facility itself, as well as of
> the hardware and software stacks (OpenAI 2024b).
>
> Improved coordination between actors facing similar threats might also
> assist defenders in understanding the threat landscape and better
> protecting their assets during training and deployment. Further analysis
> of potential threat vectors, as well as development of physical and
> cybersecurity measures including and beyond those in (Nevo et al. 2024),
> would help to identify and address these risks.
>
> Defending against model inference attacks. Alternatively, adversaries
> may try to extract or replicate models through attacks to a query API
> (Orekondy et al. 2018; Tramèr et al. 2016; Jagielski et al. 2020;
> Carlini et al. 2020; Carlini et al. 2024), logit values (Carlini et al.
> 2024) or side-channel attacks (Wei et al. 2020). Further research could
> aim to quantify threats and develop methods for defending against these,
> and other, forms of model extraction attacks.

## What you produce

The baseline the first open problem calls for: standards for the facility
and the hardware and software stacks, worked into per-tier controls
against insider and outsider threats, with the audit evidence for each
control and its cost — the further analysis of threat vectors and
protective measures the section says would help identify and address these
risks.
