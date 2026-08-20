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

## 2026-08-20 — phase B: egress still blocked, phase A re-verified

The continuation session ran in a container whose egress policy denies every
source host on the fetch list. Probed once each through the proxy (CONNECT
answered 403, recorded by the gateway as policy denials; the harness
WebFetch tool is behind the same policy and returned EGRESS_BLOCKED):
arxiv.org, markusanderljung.com, www.lesswrong.com, www.greaterwrong.com,
openreview.net, api2.openreview.net, docs.google.com,
forum.effectivealtruism.org, fieldbuilding.substack.com, taig.stanford.edu,
coefficientgiving.org. Only the package registries and the git proxy are
open. Per the standing rule, no quote was produced from memory, so **zero of
the 43 remaining briefs were rebuilt** and the 10 web-sourced pre-shaped
briefs remain unverified against fresh text. The remaining-work table above
stands as written; the next session needs an environment whose policy
actually allows those hosts (this one did not, despite being provisioned for
phase B on that assumption).

What could be done offline was done:

- The extractor and verifier were rebuilt from the descriptions above and
  run over the three committed artifacts (`2507.15916v2.json`,
  `2511.10783v3.json`, `2310.13625v1.json`). All 26 phase-A rebuilt briefs
  verify at 100%: 65 blockquote paragraphs, 65 matches (tier-2
  digit-stripped matches occur only where the corpus glues footnote markers,
  as expected), 0 failures. No drift since the 2026-08-20 rebuild.
- The nine program-ops flag candidates were read in full. All nine pose
  program-internal tasks no external paper poses; none was altered. The
  per-brief options went to the owner in the session report: leave as-is
  (recording that the brief is program-posed and exempt), demote `status`
  to `concept`, or the owner names a source to center it on.
- `npm run verification:capstones` and `-- --check` pass (80 entries, no
  drift), `npm run test` (1173 passing), `npm run typecheck` and
  `npm run lint` (0 errors) all green; the generated outputs required no
  regeneration since no brief changed.

## 2026-08-20 — phase B complete: 34 briefs rebuilt, 10 re-verified and fixed

This session ran with working egress. Every host on the fetch list answered
except two: `api2.openreview.net` (bot challenge — `ChallengeRequiredError`
on the API, the forum page and the PDF, in curl and in headless Chromium)
and `coefficientgiving.org` (403 to bots, as already recorded — the optional
eval-attestation-chain enrichment was skipped). Neither blocked anything:
the OpenReview paper turned out to be on arXiv as 2608.07514 (found via the
arXiv API by title), which is the better citation anyway. LessWrong
challenged direct fetches (429), so both LW posts and both EA Forum posts
came via the greaterwrong.com mirrors, sliced to the post body so comments
never enter a corpus. All sources were fetched raw, extracted to
one-paragraph-per-line corpora, and every quote was injected by script with
per-line expected-prefix assertions — the phase-A method, rebuilt from this
log's descriptions.

**All 34 remaining house-shaped briefs were rebuilt** into the quote shape,
every source drawn from the fetched text of the day:

- von Knebel & Anderljung collection (idea numbering re-derived from the
  post's table of contents — 78 ideas, all anchors matching the briefs'
  existing numbers): content-provenance-options (59), eval-statistical-tests
  (35), export-control-circumvention (70), pre-emptive-authorization (57),
  procurement-as-lever (63), regulatory-cost-benefit (58),
  sandbagging-incentives (38), which-compute-target (78).
- Orphaned Policies (Mass_Driver, LessWrong): windfall-clause-draft (1),
  antitrust-waiver-letter (2), strict-liability-model-bill (3),
  insurance-minimum-number (5), compute-monitoring-costing (8 — paired with
  Shavit arXiv:2303.11341 §3.2 and its footnoted 232-inspector estimate),
  rmf-compliance-scorecard (10), structured-access-minimum (11).
- Ten AI safety projects (Julian Hazell, LessWrong):
  resilience-allocation-plan (project 7), research-proposal-workup (the
  post's framing and closing invitation).
- Open Problems in Technical AI Governance (arXiv:2407.14981, v2):
  incident-reporting-taxonomy (§8.1), model-registry-lower-bar (§5.3.2),
  weight-security-baseline (§6.3.1), and taig-tooling-gap (§1 — the
  taig.stanford.edu problem statement is the paper's own introduction, so
  the brief quotes the paper and keeps the site as a secondary pointer;
  it does NOT go on the flag list). Note: the current paper version has no
  "lower bar" phrasing — that label came from an earlier version; the brief
  now quotes §5.3.2 "Tracking versioning and updates" and its source label
  was updated to match.
- Open Technical Problems in Open-Weight AI Model Risk Management — now
  quoted from arXiv:2608.07514 (Casper et al.), OpenReview link kept
  secondary: evaluate-the-derivative-ecosystem (§4.3.4),
  open-weight-release-memo (§2 + abstract), exfiltrated-weights-regime
  (abstract + §4.5).
- Hobbhahn evals doc (Google export): eval-scoping-pilot (reader context +
  "Safety framework evals"), replication-what-broke ("Science of evals" +
  "Replicate bio evals with better tools"), agent-eval-design ("Better
  Elicitation techniques" + the agent-forecasting extensions).
- Brewer doc: red-line-definition ("Red lines for cyber evals" — the entry's
  own text truncates mid-sentence at "or a"; the quote cuts at the sentence
  boundary before it).
- EA Forum: cross-examine-an-eval (cb, science-of-evaluations section +
  red-teaming idea), field-map-refresh (Caro 2022, summary + "How can you
  help?" + further research directions; the mirror shows the account handle
  `hanadulset` — the label keeps the Forum display name the 2026-08-04
  session recorded).
- Field Building Blog: field-building-blueprint (TLDR + theory-of-change +
  conclusion).
- arXiv singles: unlearning-durability-probe (2501.04952, evaluation
  standard + relearning vulnerability), capability-chart-refresh
  (2104.14337 — Dynabench §1 and the Figure 1 caption, which states the
  −100/0 normalisation the OWID chart still uses),
  interp-as-evidence (2501.16496, abstract + the model-organisms
  generalization caveat; a sources block was added — it had none).

**All 10 pre-shaped briefs failed re-verification against the fresh text
and were rebuilt from it.** The drift was systematic, not incidental: the
playground versions had normalized typographic punctuation to ASCII,
flattened the collection's labeled sections ("Research Questions" /
"Methodology" headings and their bullets) into invented composite sentences
("Research question: … Methodology: … Further reading: …"), joined separate
source bullets with semicolons and re-cased their first letters, inserted
editorial `[…]` elisions mid-quote, and silently corrected source typos.
Two examples now preserved verbatim instead: idea 65's research question
reads "How could such a regime be designed compute?" in the source (the
rebuilt brief quotes the other, clean question and references the second in
prose), and idea 71's "X 8bit FLOP" (the old quote had "8-bit"). Fixed:
best-practices-implementation, compute-production-gap-china,
frontier-ai-public-utilities, incident-detection-monitoring,
inference-compute-botec, ops-threshold-adjustments,
reconciling-impact-scores, stock-and-flow-accounting, training-vs-inference,
tracking-agent-behaviour.

**Machine verification: 281 blockquote paragraphs across all 70
quote-shaped briefs, 281 matched, 0 failures** (269 exact after
whitespace normalization, 3 via the bracket-stripped tier that mirrors
explicit `[N]` footnote-marker drops — a tier added this session for
Squarespace-style bracketed markers — and 9 via the digit-stripped tier,
8 of them the known phase-A footnote-glue cases plus one glued marker in
the Hazell post). The 26 phase-A briefs re-verified unchanged at 65/65
against the committed artifacts before any new work, validating the
rebuilt tooling against the phase-A baseline.

One extractor lesson worth recording: arXiv's LaTeXML HTML is
pretty-printed with hard newlines inside paragraphs, so raw source
newlines must be collapsed to spaces BEFORE block tags become line breaks,
or paragraphs fragment across corpus lines. LaTeXML also inlines footnote
bodies into the running paragraph text ("(OpenAI 2024b).2323 23 Data center
security standards: …"); the fix is sentence-boundary from/to cuts around
the inlined body, or an explicit drop of the marker.

**Flag report (unchanged from the offline session, plus one resolution).**
The nine program-ops briefs — cohort-tabletop-design, curriculum-gap-audit,
intro-retention-probe, ship-to-a-live-project, self-scoped-policy-memo,
three-directions-drill, eval-to-threshold-brief,
frontier-safety-policy-redraft, comparative-jurisdiction-dossier — pose
program-internal tasks no fetched source poses; none was altered, and the
per-brief options remain with the owner (leave as-is and record the
exemption, demote to `concept`, or the owner names a source).
orphaned-policy-adoption likewise stays as the owner left it (`concept`,
status-note blockquote, no source quote): the post does pose "adopt one or
two of the projects discussed in this post," so it CAN be rebuilt in the
quote shape on request, but this log reserved that restructuring for the
owner. taig-tooling-gap came off the flag list (see above).

Checks before commit, all green: `verification:capstones` and `-- --check`
(80 entries, no drift), quote verifier 281/281, `npm run test` (1173),
`npm run typecheck` (0 errors), `npm run lint` (0 errors). Committed: the
44 rebuilt `.md` sources plus both generated outputs.
