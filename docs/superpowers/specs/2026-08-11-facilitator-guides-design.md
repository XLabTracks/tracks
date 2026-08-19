# Facilitator guides — design

Date: 2026-08-11
Status: approved (design), not yet implemented

## Goal

Give university groups and other organizers per-module **facilitator guides**: session
plans for running a Tracks module as a synchronous weekly meeting, coordinated lightly
with the Classrooms feature. Guides are public authored content — documents, not
interactive features.

Pilot scope: the platform machinery plus **one real guide for Control module 1**
(the control-game lesson, the Redwood AI Control paper, and the readings).

## Decisions (from brainstorming)

- **Form:** authored documents (facilitator guides), not in-platform session features.
- **Access:** public pages on the site — no instructor gating.
- **Scope:** pilot one module (Control module 1) plus the page template.
- **Classroom tie:** light links both ways; no schema change, no live class data.
- **Approach:** a `guide` sibling segment mirroring `assessment` (approach A);
  guides join the content graph as a new non-item content type.

## 1. Content model

- New type `FacilitatorGuide` in `src/lib/content/types.ts`:
  - `id: string`
  - `moduleId: string` — must resolve in the content graph; at most one guide per module
  - `contentRef: string` — MDX filename in `src/content/guides/`
  - `sessionLength: number` — minutes
  - `groupSize: string` — free text, e.g. "4–10"
  - `materials?: string[]` — e.g. "whiteboard"
- New data file `src/content/facilitator-guides.data.ts` exporting
  `facilitatorGuides: FacilitatorGuide[]`.
- Bodies are MDX files in `src/content/guides/<contentRef>.mdx`.
- Guides are **not module items**: no `itemIds` entry, no progress unit, no sidebar
  checkmark, excluded from prerequisite math and the resource hub.
- Accessors in `src/lib/content/index.ts`: `getGuideForModule(moduleId)` and
  `getAllGuides()` (in-memory index, same pattern as the other content maps).

## 2. Route and rendering

- New page `src/app/tracks/[trackSlug]/[moduleSlug]/guide/page.tsx`.
- `guide` becomes a **reserved static sibling segment**, registered next to
  `assessment` in the slug-collision rules (content tests).
- The page is public and static: no auth, no database.
- It renders the guide MDX through the existing MDX component map, so `<Callout>`,
  `<Term>`, math, and the automatic section nav all work. With 2+ headings the
  docked nav reads "In this session".
- Header shows the session metadata (length, group size, materials) above the body.
- A module without a guide 404s on this route.

## 3. Guide body structure

Enforced by convention (AUTHORING.md), not by code. Five sections:

1. **Session goal** — what a participant should be able to do after the meeting.
2. **Before the session** — facilitator prep, including which columns to check on the
   classroom dashboard (progress, submissions).
3. **Agenda** — timed blocks; each block names a specific lesson, exercise, or demo
   (linked by real id) and gives discussion prompts.
4. **Common sticking points** — misconceptions to watch for.
5. **After the session** — what to look for in submissions and how to follow up.

Authoring rule: discussion prompts and timing are original facilitation scaffolding;
any claim **about the material** restates the human-authored lessons and readings.
Never invent curriculum claims (repo-wide rule).

## 4. Classroom coordination (light links)

- **Classroom → guide:** on the classroom instructor page, when the classroom has a
  `trackId`, list that track's modules that have guides, each a link to its `/guide`
  page.
- **Module → guide:** on the module overview page, a small "Facilitator guide" link
  when one exists.
- No schema change; no new queries beyond the content-graph lookup.

## 5. Tests

Extend `src/lib/content/content.test.ts`:

- Every guide's `moduleId` resolves; at most one guide per module.
- Every `contentRef` has a matching MDX file in `src/content/guides/`.
- Walk each guide's MDX for `/exercises/<id>` and `/demos/<id>` hrefs and for
  track-item links, and validate that every referenced id exists.
- The reserved `guide` segment joins the existing slug-namespace collision test
  (no lesson/paper slug may be `guide` or `assessment`).

## 6. Pilot content and docs

- One real guide: Control module 1, 60-minute default agenda, written against the
  actual lesson, the Redwood control paper, and the readings.
- New AUTHORING.md section: "6. Write a facilitator guide" (data entry, MDX body,
  the five-section structure, the linking rules, the tests that will catch errors).

## Out of scope (deliberate)

- Live class data on the guide page (instructor detection, per-student state).
- Session scheduling or any session/meeting concept in the schema.
- Per-classroom guide state or customization.
- Printable/PDF export.
- Guides for assessments; guides for the Verification or Example tracks.
