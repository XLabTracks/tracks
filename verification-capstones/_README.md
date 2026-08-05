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

All keys below are required except `prerequisites`, `sources` and `audience`.
The build fails loudly on a missing key, an unknown enum value, or a
malformed range — better a red build than a card with a blank stat.

```yaml
---
title: Minimal Verification Regime for an Emergency Pause
track: Verification              # free text; becomes a filter facet
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
updated: 2026-08-04
---
```

Enum values are checked; free-text values (`track`, `deliverable`, `skills`)
are not — a new track name simply appears as a new facet.

## What belongs in this bank

This is the **Verification** platform, so the bank carries the capstones whose
prerequisites this course actually teaches: the `Verification` ones, and the
program-level `Cross-track` ones that are about the program rather than inside
one track.

The Technical Governance and AI Governance Policy tracks have their own
capstones in the playground repo. They are deliberately **not** here: their
`prerequisites` name policy and TG weeks, and a capstone whose prerequisites
do not exist is a capstone no learner on this site is prepared for.

Two rules follow, and nothing validates either — they are on the author:

- **`prerequisites` must name real units**, spelled the way `data/course.js`
  spells them. A fabricated prerequisite makes a card look grounded when it
  is not.
- **`sources` carries only links a visitor can open, and only final ones.**
  No pointers at program docs (`verification-track-outline.md §4.2` is not a
  source a learner can read — that provenance belongs in the commit message),
  and no aggregators: when an idea was found through a list of lists, cite
  the specific list or paper it points to, not the list of lists.

## Sources

`sources` renders as the "Where this came from" list at the foot of the detail
sheet. Two shapes, and the build enforces the difference:

- **`[label](url)`** — becomes a link. `url` must be `http(s)` or a path
  inside the repo. Off-site links open in a new tab.
- **Anything else** — renders as plain text. The build allows it, but
  nothing here should need it: a source the visitor cannot open is not a
  source, so every entry cites public links only.

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
carried over from the playground's bank, where all 44 distinct off-site links
were checked on **2026-08-04**; the rows below are the ones that reach the
capstones kept here.

| Link | Status | Note |
|---|---|---|
| arXiv, LessWrong, EA Forum, aisafety.com, Substack, OpenReview, NIST, Google Docs, Airtable and personal-site links cited by these 21 entries | confirmed | HTTP 200 on 2026-08-04, in the playground repo before the port |
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
