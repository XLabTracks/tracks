# capstones/ — the capstone bank source

Every `.md` file in this folder becomes a card on **`capstone-bank.html`**.
Nothing is hardcoded in the page: `scripts/build-capstones.mjs` reads this
folder, validates the front matter, renders the body to HTML, and writes
`data/capstone-bank.js`. Add a file → run the build → the card appears, and
the filter facets pick up any new values on their own.

```
capstones/my-new-capstone.md   →   card + detail sheet, slug "my-new-capstone"
```

Files whose name starts with `_` (like this one) are ignored.

## Adding one

1. Copy an existing file, or start from the front-matter block below.
2. `node scripts/build-capstones.mjs`
3. Open `capstone-bank.html` in a browser. Commit both the `.md` and the
   regenerated `data/capstone-bank.js` in the same commit — the two drifting
   apart is exactly what `--check` exists to catch.

## Front matter

All keys below are required except `prerequisites`, `sources`, `audience`,
`verification_fit` and `similar`. The build fails loudly on a missing key,
an unknown enum value, or a malformed range — better a red build than a
card with a blank stat.

```yaml
---
title: Minimal Verification Regime for an Emergency Pause
track: Verification              # free text; becomes a filter facet
# verification_fit: "…"          # only on other-track entries that can be
                                 # taken as a Verification capstone — one line
                                 # naming the course module it lands on
status: ready                    # ready | draft | concept
summary: One line, ~140 chars — what the learner walks out holding.
team: 1-3                        # people expected; "1" or "2-4"
effort_hours: 12-18              # total learner hours, not per week
duration: 3 weeks                # calendar span
difficulty: core                 # core | stretch | advanced
deliverable: Two-page regime spec + one-page evasion annex
deliverable_type: spec           # memo | analysis | spec | dossier | notebook | design
mentor: optional                 # none | optional | recommended | required
audience: The negotiating team that has to sign it.
skills: [regime design, threat modelling, evidence standards]
prerequisites: [Verification 2.x — the four layers, Verification 4.1]
sources:
  - "[Open Problems in Technical AI Governance — Reuel et al. (2025)](https://arxiv.org/abs/2407.14981)"
  - verification-track-outline.md §4.2
similar: [red-team-a-verification-stack]   # cross-links; slugs must exist
updated: 2026-08-04
---
```

Enum values are checked; free-text values (`track`, `deliverable`, `skills`)
are not — a new track name simply appears as a new facet.

## What belongs in this bank

The **whole program's** capstones, carried over from the playground repo's
bank: the `Verification` and program-level `Cross-track` briefs this course
teaches the prerequisites for, and the `Technical Governance` and
`AI Governance Policy` briefs beside them, so the program's full menu is
browsable in one place.

The two native tracks are in-course by definition. A governance brief that
can honestly be taken as a **Verification-course capstone** says so itself,
with the optional key:

```yaml
verification_fit: "One line naming the course module the project lands on."
```

The generator derives `courseFit` (native track, or the key present) and
`verificationFit` (the reason line); the page turns them into the
`fits this course` chip, the Course fit facet, and the sheet's Course fit
row, and unit 4.2's `<CapstoneBank/>` prints only the course-fit briefs.
The bar for adding the key is the module reference: if no unit of this
course teaches the thing the project exercises, the key is a claim the page
cannot back. Governance briefs keep their own `prerequisites` — they name
TG and policy weeks spelled the way the playground's track documents spell
them, which are not taught here; the marker exists precisely to say a brief
is doable from this course's modules anyway.

Two rules follow, and nothing validates either — they are on the author:

- **`prerequisites` must name real weeks/units**, spelled the way the owning
  track's document spells them (`data/course.js` for Verification entries).
  A fabricated prerequisite makes a card look grounded when it is not.
- **Cite the source document in `sources`**, with the module, so the claim of
  relevance is auditable from the page rather than taken on trust.

## Sources

`sources` renders as the "Where this came from" list at the foot of the detail
sheet. Two shapes, and the build enforces the difference:

- **`[label](url)`** — becomes a link. `url` must be `http(s)` or a path
  inside the repo. Off-site links open in a new tab.
- **Anything else** — renders as plain text, for pointers at program docs
  (`verification-track-outline.md §4.2`).

A bare URL is a **build error**: it would print as an unclickable wall of
characters. Write it as a link with a label. Use the `- ` block form (not the
inline `[a, b]` form) whenever a label contains a comma — the inline parser
splits on commas, and author lists are full of them.

**Check the links before you commit.** A source that 404s is worse than no
source, and this bank cites a lot of the open web:

```
node -e "global.window={};require('./data/capstone-bank.js');
  for(const e of window.CAPSTONE_BANK.entries)
    for(const s of e.sources) if(/^https?:/.test(s.href||'')) console.log(s.href)" \
  | sort -u | while read u; do echo "$(curl -sSo /dev/null -w '%{http_code}' -L "$u")  $u"; done
```

### Link verification log

Per the repo rule on unverified claims. The entries in this folder were
carried over from the playground's bank — the course-fit subset first, the
remaining 37 on **2026-08-05** — where all 44 distinct off-site links across
the full bank were checked on **2026-08-04**.

| Link | Status | Note |
|---|---|---|
| arXiv, LessWrong, EA Forum, aisafety.com, Substack, OpenReview, NIST, Google Docs, Airtable, eagroups.org and personal-site links cited by the full 58-entry bank | confirmed | HTTP 200 on 2026-08-04, in the playground repo before the port |
| The four links cited by `capability-chart-refresh` (Our World in Data grapher, arXiv 2104.14337, Epoch AI benchmarking dashboard, Stanford HAI AI Index) | confirmed | HTTP 200 on 2026-08-07. The arXiv id was checked against its own `citation_title` — it is Dynabench, the dataset behind the chart. |
| `coefficientgiving.org` — the capability-evaluations RFP | unchecked | Open Philanthropy renamed to Coefficient Giving in Nov 2025; the openphilanthropy.org URL cited by the source post 301s to this host, which returns 403 to automated clients. Page title is present in search indexes. Re-check by hand. |

## Body

Everything after the front matter is normal markdown and renders into the
detail sheet. The house shape, so entries stay comparable:

```
## The brief          — what you are actually asked to produce
## Why it exists      — the real decision this artifact would inform
## Scope              — in / out of scope, so it stays finishable
## What good looks like — the grading hooks, in plain language
## Getting started    — the first session's work
```

Supported markdown: headings, paragraphs, bold/italic/code, links, bullet and
numbered lists, blockquotes, pipe tables, horizontal rules, fenced code. That
is the whole renderer — no HTML passthrough, by design.
