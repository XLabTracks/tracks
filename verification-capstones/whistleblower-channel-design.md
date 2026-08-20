---
title: A Reporting Channel an Insider Would Actually Use
track: Verification
status: draft
summary: Module 2.4 says the human layer reveals what hardware and intelligence cannot — if evidence reaches a verifier. Design the channel, against the NDAs and equity that stop it.
team: 1-2
effort_hours: 12-18
duration: 3 weeks
difficulty: stretch
deliverable: Channel design — who receives, what protects the reporter, and the evidence standard on arrival
deliverable_type: spec
mentor: recommended
audience: The regulator or oversight body that wants insider evidence and currently receives none.
skills: [institutional design, incentive analysis, evidence standards, protective-regime drafting]
prerequisites: [Verification 1 — actors, Verification 2.4 — the human layer]
sources:
  - "[Verifying International Agreements on AI — Baker, Kulp, Marks, Brundage & Heim (2025), Appendix A.8](https://arxiv.org/abs/2507.15916)"
  - "[A Collection of AI Governance Research Ideas — von Knebel & Anderljung (2024), idea 20: AI and whistleblowing](https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024)"
updated: 2026-08-20
---

## The idea, as posed

From [Verifying International Agreements on AI — Baker, Kulp, Marks,
Brundage & Heim (2025)](https://arxiv.org/abs/2507.15916), Appendix A.8,
Whistleblower Programs. Quoted:

> Background: Programs and laws that encourage employees to blow the whistle
> on violations are commonplace [142], contributing to approximately $2
> billion or more in SEC fines in 2023. In the AI industry, large-scale AI
> projects tend to involve hundreds of employees (Table 9)—hundreds of
> individuals who might be able to report any large-scale violations to a
> Verifier. In addition to AI developers’ own employees, other organizations
> throughout the AI supply chain have employees who can blow the whistle on
> some violations, especially undeclared AI data centers. Employees could
> blow the whistle on a Prover’s (i) non-compliant AI activities, (ii)
> falsified declarations, or (iii) attempts to circumvent another
> verification mechanism (Table 14). Formal whistleblower programs could
> promote appropriate forms of whistleblowing by providing (would-be)
> whistleblowers with information they can check, disclosure protocols, and
> incentives (including intrinsic motivation, social norms, protection, and
> financial rewards). Provers may view formal whistleblower programs as
> legitimate, so Provers may be willing to take verifiable actions that
> facilitate whistleblowing (in contrast to espionage), such as allowing
> employees to privately talk with a Verifier.

The same appendix poses the channel-design problem itself:

> Secure and confidential communication with potential whistleblowers. A
> Prover might try to not only retaliate against whistleblowers, but also
> entirely block or alter their messages. Standard approaches to secure
> internet communication (e.g., TLS, VPNs, and Tor) are not designed to
> secure the communications of parties who may be under video surveillance,
> or whose computers may be backdoored. Instead, a more secure option is for
> such employees to make in-person visits to a building physically secured
> by a Verifier. To prevent the Prover from detecting or blocking
> whistleblowers’ visits to these locations, the verification protocol could
> require the Prover to periodically send various relevant employees to
> visit the Verifier-secured building (e.g., as brief visits to an office
> near the Prover’s offices).

## What you produce

A channel design on the quote's own terms: who receives the report, the
disclosure protocol and the protections that let an employee use it while
surveilled, and the evidence standard applied to what arrives.
