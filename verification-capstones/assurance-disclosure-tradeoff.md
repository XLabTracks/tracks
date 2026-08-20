---
title: What Assurance Costs in Secrets
track: Verification
status: draft
summary: Every verification mechanism buys confidence by spending the operator's secrets. Price the exchange rate across inspections, taps, telemetry, trusted hardware and recomputation.
team: 1-2
effort_hours: 14-20
duration: 3 weeks
difficulty: stretch
deliverable: Assurance × disclosure × intrusiveness matrix
deliverable_type: analysis
mentor: recommended
audience: The operator and verifier negotiating what must be shown for what assurance.
skills: [mechanism comparison, privacy analysis, trade-off mapping]
prerequisites: [Verification 2.0 — confidentiality vs verifiability, Verification 2.x — the four layers]
sources:
  - "[Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), §1 and §3.2](https://arxiv.org/abs/2507.15916)"
updated: 2026-08-20
---

## The idea, as posed

From [Verifying International Agreements on AI — Baker, Kulp, Marks,
Brundage & Heim (2025)](https://arxiv.org/abs/2507.15916), Section 1.
Quoted:

> Confidentiality-preserving and secure verification of rules on large-scale
> AI has unique potential. Historically, it has been politically crucial for
> international verification methods to avoid information leaks that create
> serious security risks, and (to a lesser extent) to avoid leaks of trade
> secrets [39, 13]. The AI industry has an abundance of highly sensitive
> information, from AI model weights [143] and algorithms to training/user
> data. Confidentiality-preserving verification may be especially important
> and feasible for large-scale AI development and deployment [187], such as
> training a future, powerful model and deploying it at scale. Such
> large-scale AI activities carry unique risks [15, 17, 170]. They are also
> industrial, billion-dollar-scale undertakings [93, 5, 58], requiring
> “thousands of specialized chips” [178] and counting [184]. This broad
> trend continues to hold despite algorithmic advances, such as those of
> reasoning models and DeepSeek’s R1 [88].

Section 3.2 states the technology that would pay the price down:

> Use of confidentiality-preserving technology. Importantly, in our
> framework, declarations of AI compute use would be reported and verified
> via confidentiality-preserving technology—technology that enables a Prover
> to demonstrate their compliance without leaking their highly sensitive IP
> such as model weights. Such technology could include (i) a hardware
> security feature known as Confidential Computing (Section 4.1.1.1); and
> (ii) compute clusters with security that both parties can confirm, so that
> much information can enter these devices but only a small amount of
> information (e.g., compliance determinations) can leave (Section 4.2.1.1).
> Declarations of AI compute ownership are less sensitive than declarations
> of AI compute usage, but, if desired, the confidentiality-preserving
> technologies we discuss could also help protect these ownership
> declarations. As we will discuss (Section 4.5), confidentiality-preserving
> technologies could be used to run hard-coded compliance tests, or perhaps
> to facilitate iterative testing by humans or AI agents, though the human
> option poses more confidentiality challenges.

## What you produce

The price list the quoted tension implies: for each level of assurance a
verifier might want in a compliance claim, what the operator has to
disclose and how deep the mechanism reaches into the facility — one
assurance, disclosure and intrusiveness matrix, compared like for like
across mechanisms.
