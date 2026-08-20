# Capstone bank — quote-centering audit

Owner's instruction (2026-08-20): every capstone card in the bank draws only
from verbatim quotes from real, verifiable papers. No paraphrase, no invented
claims. Minimal connective language is allowed to introduce quotes and to tie
the deliverable to them, but each card centers on a quote. A brief whose task
no real source poses is flagged to the owner, never given an invented quote.
Scope is the whole 80-entry bank, not only the course-fit subset unit 4.2
prints.

This log records what has been done, the method that guarantees quote
fidelity, and exactly what remains. Append; do not rewrite.

## Shape contract

Front matter is preserved except: `sources` gains the quoted paper(s) first
(old citations stay, as secondary pointers, deduplicated by URL) and
`updated` is bumped. The body is replaced with:

```
## The idea, as posed

From [<Title> — <Authors> (<year>)](<url>), <section>. Quoted:

> <verbatim quote>

<optional one-line bridge to a second quote>

## What you produce

<2–4 sentences of minimal language tying the front matter's deliverable to
the quote's own terms.>
```

Rules learned the hard way:

- Quotes are never typed by hand. They are extracted from the fetched source
  to plain text and injected by script, with an expected-prefix assertion per
  line so a wrong line number fails the build.
- Footnote markers glued to words by extraction (`compliance.157`,
  `approved36`) are removed via explicit, per-quote string replacements — a
  tripwire regex fails the build on any leftover `[a-z][.,;:)\]]\d` residue.
- The repo's arXiv converter output glues `%` and `&` to the following word
  (`100%of`, `Taps &Analysis`); normalize with `%(?=[A-Za-z]) → '% '` and
  `&(?=[A-Z]) → '& '` on both the quote and the verification side.
- Citation brackets like `[110]` inside a quoted sentence are part of the
  text and stay. Bracketed drafting notes in the treaty paper's articles
  (`[this set of activities would need to be specified in an Annex]`) stay.
- Math spans extract as their TeX annotation (`10^{24} FLOP`), which is the
  faithful plain-text form.
- Partial-paragraph quotes are allowed only at sentence boundaries, via
  explicit from/to markers.

## Done — 36 briefs are quote-shaped

26 rebuilt on 2026-08-20 from paper artifacts committed in this repo
(`src/content/arxiv/*.json`), every blockquote machine-verified against the
artifact text:

- From Baker, Kulp, Marks, Brundage & Heim, *Verifying International
  Agreements on AI* (arXiv:2507.15916, committed as `2507.15916v2.json`):
  whistleblower-channel-design, secret-datacenter-evidence,
  compute-chain-of-custody (+ treaty Article V), compute-accounting-audit,
  tamper-evidence-sufficiency, detect-a-training-run (+ treaty feasibility),
  red-team-a-verification-stack, assurance-disclosure-tradeoff,
  proof-of-training-feasibility, eval-attestation-chain,
  evaluated-model-in-production, compliance-without-disclosure,
  minimal-verification-regime (+ treaty §3), telemetry-security-case
  (+ treaty Article VII), cooling-shutdown-verification (+ treaty Article
  VII), permit-inference-prohibit-training (+ Baker A.7),
  subthreshold-distributed-training (+ treaty Article V).
- From Scher, Abecassis, Barnett & Abeyta, *An International Agreement to
  Prevent the Premature Creation of Artificial Superintelligence*
  (arXiv:2511.10783, committed as `2511.10783v3.json`):
  interconnect-cut-protocol, supply-chain-logging-points,
  hardware-chokepoint-dossier, us-china-incident-hotline,
  emergency-verification-package, treaty-clause-redraft,
  secret-compute-threshold, threshold-decay-analysis.
- From Egan & Heim, *Oversight for Frontier AI through a Know-Your-Customer
  Scheme for Compute Providers* (arXiv:2310.13625, committed as
  `2310.13625v1.json`): cloud-kyc-regime.

10 briefs arrived from the playground already in the target shape; their
quotes cite web sources and still need in-session re-verification against
freshly fetched text (they carry the playground's 2026-08-04 link-check log):
best-practices-implementation, compute-production-gap-china,
frontier-ai-public-utilities, incident-detection-monitoring,
inference-compute-botec, ops-threshold-adjustments, reconciling-impact-scores,
stock-and-flow-accounting, tracking-agent-behaviour, training-vs-inference.

## Method and scripts

Process per remaining brief: fetch the source raw → extract to one paragraph
per line → locate the passage that poses the task → add a spec entry (slug,
attribution, corpus line numbers with expected prefixes, explicit residue
drops, produce-text) → run the builder → run the verifier → regenerate the
bank → test.

The session tooling lives outside the repo on purpose (it hardcodes nothing
the repo needs); rebuild it from the descriptions here. Three scripts:

1. **extract-text.js** — reads a committed artifact JSON
   (`.paper.html`/`.post.html`), strips tags block-aware, decodes entities,
   replaces KaTeX/MathML spans with their `application/x-tex` annotation,
   writes one paragraph per line. For raw web HTML the same logic applies
   plus dropping `script/style/svg/noscript/template/iframe` subtrees and
   HTML comments.
2. **build-briefs.js** — takes a JSON spec array; for each slug reads the
   existing `.md`, lifts old `sources`, writes new front matter
   (new sources + old, `updated` bumped) and the quote-shaped body. Every
   quote line is `[lineNumber, expectedPrefix]`; mismatch throws. `drop`
   pairs are exact-string replacements; unused drops throw; leftover footnote
   residue throws. Wraps quote paragraphs at ~74 chars with `> ` prefix,
   paragraphs separated by a lone `>`.
3. **verify-quotes.js** — extracts every blockquote paragraph from every
   brief and requires it to appear, whitespace-normalized, inside a line of
   the extracted corpus; corpus side is normalized for the `%`/`&` glue and
   glued footnote digits. A digit-stripped fallback tier absorbs remaining
   footnote-marker noise while still requiring the exact word sequence.
   Every quote in every rebuilt brief must verify; a pre-existing brief's
   quote failing after its source is fetched is a real drift and must be
   fixed from the fetched text.

## Remaining work — 43 house-shaped briefs

Fetch list (all were egress-blocked in the 2026-08-20 session; the
environment has since been switched to full network access):

| Source | URL | Briefs |
|---|---|---|
| von Knebel & Anderljung ideas collection | markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024 | content-provenance-options (idea 59), eval-statistical-tests (35), export-control-circumvention (70), pre-emptive-authorization (57), procurement-as-lever (63), regulatory-cost-benefit (58), sandbagging-incentives (38), which-compute-target (78); also re-verify the quotes of best-practices-implementation, compute-production-gap-china, frontier-ai-public-utilities, incident-detection-monitoring, inference-compute-botec, ops-threshold-adjustments, reconciling-impact-scores, stock-and-flow-accounting (65), training-vs-inference |
| Orphaned Policies (LessWrong; greaterwrong.com mirror if the origin challenges bots) | lesswrong.com/posts/wFKZmvfRfNn24HNHp/orphaned-policies-post-5-of-7-on-ai-governance | antitrust-waiver-letter (orphan 2), compute-monitoring-costing (8; pair with Shavit arXiv:2303.11341, which the brief already links), insurance-minimum-number (5), rmf-compliance-scorecard (10), strict-liability-model-bill (3), structured-access-minimum (11), windfall-clause-draft (1), orphaned-policy-adoption (whole post; currently `concept` with a status-note blockquote — restructure or leave per owner) |
| Ten AI safety projects (LessWrong) | lesswrong.com/posts/vxA2BnCPTaPfnJjti/ten-ai-safety-projects-i-d-like-people-to-work-on | research-proposal-workup, resilience-allocation-plan (project 7); re-verify tracking-agent-behaviour |
| Open Problems in Technical AI Governance | arxiv.org/html/2407.14981 | incident-reporting-taxonomy, model-registry-lower-bar, weight-security-baseline (each brief's source label names its section question) |
| Open Technical Problems in Open-Weight AI Model Risk Management | openreview.net/forum?id=8QyGLnFkzc (API: api2.openreview.net/notes?forum=8QyGLnFkzc) | evaluate-the-derivative-ecosystem, exfiltrated-weights-regime, open-weight-release-memo |
| Hobbhahn et al. evals open-problems doc | docs.google.com/document/d/1gi32-HZozxVimNg5Mhvk4CvW4zq8J12rGmK_j2zxNEg (append `/export?format=txt`) | agent-eval-design, eval-scoping-pilot, replication-what-broke |
| Brewer, Projects someone should maybe do | docs.google.com/document/d/1MQ8CbgOy13GTWkJr09D-0fdPKydnrYYWIgSys0BwuP8 (export as above) | red-line-definition |
| EA Forum | forum.effectivealtruism.org/posts/LTbwRuQhBRGxMyqcq/x-6 · forum.effectivealtruism.org/posts/tmxkRFx6HyhhvHdz4/a-map-to-navigate-ai-governance | cross-examine-an-eval · field-map-refresh |
| Field Building Blog | fieldbuilding.substack.com/p/blueprints-for-ai-safety-conferences | field-building-blueprint |
| Stanford TAIG site | taig.stanford.edu | taig-tooling-gap (a website, not a paper — may belong on the flag list) |
| Open Problems in Machine Unlearning for AI Safety | arxiv.org/abs/2501.04952 | unlearning-durability-probe |
| Dynabench | arxiv.org/abs/2104.14337 | capability-chart-refresh (the OWID/Epoch/HAI links are data sources, not quote sources) |
| Sharkey et al., Open Problems in Mechanistic Interpretability | arxiv.org/abs/2501.16496 | interp-as-evidence (no `sources` front matter yet; hunting grounds are named in its body) |
| Coefficient Giving capability-evals RFP | coefficientgiving.org (403 to bots as of 2026-08-05 per `verification-capstones/_README.md`) | optional enrichment for eval-attestation-chain, whose primary quote is now Baker A.2 |

Flag-report candidates — program-ops briefs no external paper poses:
cohort-tabletop-design, curriculum-gap-audit, intro-retention-probe,
ship-to-a-live-project, self-scoped-policy-memo, three-directions-drill,
eval-to-threshold-brief, frontier-safety-policy-redraft,
comparative-jurisdiction-dossier. Do not force quotes onto these. Bring the
owner a list with per-brief options (leave as-is, demote to concept, or a
source the owner supplies).

## Checks before every commit

`npm run verification:capstones` then `-- --check`; the quote verifier at
100% for every rebuilt brief; `npm run test`; `npm run typecheck`;
`npm run lint`. Commit the `.md` sources and both generated outputs
(`public/verification/data/capstone-bank.js`,
`src/content/verification/capstone-bank.json`) together.
