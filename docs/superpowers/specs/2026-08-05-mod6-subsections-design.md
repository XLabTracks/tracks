# Module 6 subsections — design

Date: 2026-08-05
Branch: `mod-6`

## Goal

Add a new closing module to the Control track with three outline-stub sections. The
author has all the materials and will fill them in later; this change adds only the
section markers on the website.

## Placement

The existing "Low-stakes control" module (`c-lowstakes`, order 6) is unchanged. The new
module sits after it.

## Module entry (`src/content/curriculum.data.ts`)

- id: `c-mod6`
- slug: `module-6`
- trackId: `control`
- title: "Beyond scheming: deals and next steps"
- order: 7
- prerequisiteModuleIds: `["c-intro", "c-mod2", "c-areas", "c-mod4", "c-mod5", "c-lowstakes"]`
  (full ancestor chain, per the existing comment: empty placeholder modules count as
  complete, so listing every ancestor keeps the gate chain correct)
- summary: one sentence naming the three sections
- itemIds: `["c-mod6-l1", "c-mod6-l2", "c-mod6-l3"]`
- Also append `c-mod6` to the control track's `moduleIds`.

## Lesson items and MDX stubs

Three lesson items in the `c-mod5-l1` pattern: an item entry with `contentRef`, plus an
MDX file that holds the "In development — outline stub" callout and a heading, nothing
else.

| id | slug | title |
|---|---|---|
| `c-mod6-l1` | `alternatives-to-schemers` | Alternatives to Schemers |
| `c-mod6-l2` | `trading-with-ais` | Trading with AIs |
| `c-mod6-l3` | `next-steps` | Next Steps |

MDX files: `src/content/lessons/c-mod6-l1.mdx`, `c-mod6-l2.mdx`, `c-mod6-l3.mdx`.

Each file contains:

1. A `<Callout variant="note" title="In development">` line marking it as an outline stub.
2. A `##` heading with the section title.

No `estimatedMinutes` on the items or the module yet; the materials set the timings later.

## Out of scope

- No readings, papers, exercises, or assessments. The author supplies the materials.
- No changes to the low-stakes module or any other module.

## Verification and delivery

- Run the vitest content tests.
- Commit to the `mod-6` branch and push to `origin/mod-6` only (preview deploy).
- Never push to `main` (production deploy).
