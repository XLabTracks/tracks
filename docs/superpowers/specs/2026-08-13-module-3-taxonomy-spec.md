# Module 3 — A Taxonomy of Control: page architecture spec

**Date:** 2026-08-13 · **Branch:** `mod-3` · **Status:** prototype for review

## Goal

Bring the four Taxonomy of Control documents (authored in the AI-Safety vault,
cleaned + fact-checked 2026-08-13) into the Control track as Module 3 content,
with an entry page that makes the module scannable. The four document titles
alone ("Detection Mitigations", …) under-describe their contents, so the entry
page carries a **hyperlinked breakdown** of the section structure in addition
to the four navigation buttons.

## Architecture

Module `c-areas` (Control module 3, slug `areas-of-control-work`) now holds:

| # | Item | Slug | Role |
|---|------|------|------|
| 1 | Detection Mitigations | `detection-mitigations` | Doc page |
| 2 | Prevention and Response Mitigations | `prevention-response-mitigations` | Doc page |
| 3 | Control Evaluations | `control-evaluations` | Doc page |
| 4 | Environments | `environments` | Doc page |
| 5 | An overview of areas of control work | (unchanged) | Existing Greenblatt survey, kept as the module's closing reading |

> **Update (2026-08-13, Arya):** the "A Taxonomy of Control" entry page
> (buttons + list breakdown) is **removed** — the module now opens directly
> with Detection Mitigations. The two-variant comparison below is kept for the
> record; the breakdown idea may return in a different form (Arya sketched a
> hand-drawn mind-map of the Detection page's structure — Detection Mitigations
> → In-Simulation / In-Deployment (→ Agent-Level, Environment-Level) /
> Limiting Detection Evasion — suggesting a **diagram**, not a link list, as
> the orientation device, possibly one per doc page rather than one per
> module).

No new routes, components, or DB anything — standard lessons; pages resolve by
slug. Each doc page with 2+ headings automatically gets the docked
**"In this lesson"** section panel with scroll-spy (the same UI papers get), so
per-page navigation is already handled by the platform; the breakdown's job is
the **cross-page** overview.

## The breakdown — depth decision (the thing to review)

The prototype's entry page renders the breakdown **twice** so the depth options
can be compared side by side on a real page. Anchors are real
(`rehype-slug`-generated) — every row deep-links to the live section.

- **Variant A — pages + `##` sections only.** Clean and small, but coverage is
  uneven: *Detection* yields 4 rows and *Prevention & Response* 4, while
  **Environments yields zero** (the page has no `##` headings — it's one
  continuous document) and *Control Evaluations* yields one.
- **Variant B — pages + `##` + `###`.** The mitigation pages become genuinely
  scannable (Black/White Box; Isolation / Supply chain / Trusted-Untrusted
  Defense). Two problems: the repeated **"Measures"** headings surface as
  identical rows with numbered anchors (`#measures`, `#measures-1`), and the
  imbalance with Environments/Control Evaluations gets starker.

**Recommendation:** neither variant as-is. The breakdown quality is downstream
of the docs' heading structure, so do a light heading pass on the source docs
first, then ship **Variant B**:

1. *Environments*: add `##` headings — e.g. "Components of an environment" and
   one per setting (APPS, BashBench, SHADE-Arena, LinuxArena, ControlArena) or
   a single "The environments" section. This also buys the page its
   "In this lesson" panel, which it currently doesn't qualify for.
2. *Detection / Prevention*: rename the generic **"Measures"** headings to
   descriptive ones ("Environment-level measures", "Synchronous response
   measures", …) — fixes both the breakdown rows and the sidebar labels.
3. *Control Evaluations* is short enough that one section row is fine.

(These are content edits in the vault → re-import; the vault remains canonical
until this ships.)

## Mechanics & notes

- **Anchors:** heading ids come from `rehype-slug` (github-slugger). Punctuation
  drops can produce double hyphens (`#agent--or-model-level-prevention`,
  `#trusted--untrusted-ai-for-defense`) — correct, just non-obvious; the
  prototype's links were generated with the real slugger, not by hand.
- **Buttons:** prototyped as literal JSX link-cards in the MDX (Tailwind
  utilities only). If we keep the pattern, promote it to a registered MDX
  component (e.g. `<ItemCards>` reading titles/summaries from the content
  graph) so copy isn't duplicated and links use client-side nav.
- **Import pipeline:** vault markdown → MDX needed exactly two transforms:
  strip the H1 (lesson titles come from `curriculum.data.ts`) and rewrite
  `<https://…>` autolinks to markdown links (MDX parses `<…>` as JSX). No
  other escaping was required.
- **External links:** the doc pages carry many LessWrong/arXiv links. Links to
  posts that are already course papers internalize automatically at render
  time. Optionally run `npm run readings:build` later to internalize the rest —
  note it's permission-gated (`reading-permissions.json`) and each converted
  post is a committed full copy.
- **Module metadata:** title/summary updated to reflect the taxonomy ("A
  Taxonomy of Control"); the Greenblatt survey stays as the closing item.
  Module slug left as `areas-of-control-work` to avoid breaking existing
  links — change it to `taxonomy-of-control` only if we accept the churn.

## ⚠ Attribution (must resolve before this goes public)

The Detection and Prevention/Response pages adapt — in long stretches nearly
verbatim — **Google DeepMind's AI Control Roadmap** and **Ryan Greenblatt's
"An overview of control measures."** The vault deliberately defers attribution;
Arya has a "more prevalent place" planned for it on the website. That place
needs to exist **before this module ships**: options are a module-level source
note on the entry page, per-page source lines (the pattern `c-areas-l1` uses),
or both. Tracking this here so the branch review can't miss it.

## Open questions

1. **Depth:** ~~superseded~~ — the list-breakdown entry page was removed
   (see update above). If the mind-map diagram direction is pursued, the
   analogous question is per-page diagrams vs one module-level map.
2. **Page order:** ~~decided~~ (Arya, 2026-08-13): mitigations first —
   Detection → Prevention & Response → Control Evaluations → Environments.
3. Where does the attribution note live (entry page vs per-page vs both)?
4. Keep the Greenblatt survey in this module, or move it to further reading
   once the taxonomy is the module's core?
5. ~~Promote the button cards to a proper component?~~ — moot; entry page
   removed.

## Review checklist (Arya)

- [ ] Open Detection/Prevention pages — check the "In this lesson" panel labels (note the bare "Measures" entries)
- [ ] Open Environments — note there's no section panel (no headings)
- [ ] Check the module card on `/tracks/control` (new title/summary/5 items)
- [ ] Decide open questions 2–3 (order is decided; attribution placement isn't)
- [ ] If the mind-map direction is real: decide diagram-per-page vs module map, and hand-drawn asset vs house-style SVG
