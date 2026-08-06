# Module 2 — build log

Running log for the Verification track's module 2 (`v-infrastructure`,
"Verification infrastructure and evidence streams"). Append to it; do not
rewrite entries. The point is that the next session can see what was done,
what was deliberately *not* done, and what is still owed, without re-deriving
any of it from the diff.

Source of truth for structure is `src/content/verification/curriculum.ts`.
Source of truth for content is the author's WIP outline. This log is neither —
it is the record of the decisions taken between them.

---

## 2026-08-06 — module 2 put onto the outline's taxonomy

Source: **"WIP Verification Track Outline 11"** (.docx), tab **"Claude Outline
Spec"** for the taxonomy, tabs **2.0 – 2.4.4** for the content.

### The taxonomy being conformed to

From the spec tab, verbatim in substance:

| Level | Numbering | Rule |
| --- | --- | --- |
| Module | `X` | starts at 0; organizational only, carries no page text |
| Submodule | `X.X` | starts at `X.0`; nested in a module; **can carry text** |
| Subsubmodule | `X.X.X` | starts at `X.X.1`; nested in a submodule; **can carry text** |
| Tab | — | unnumbered screens within a sub/subsubmodule, ordered by the progress bar |

Optional sections are marked `*` in the outline and render lighter.

How that lands in this codebase: a **submodule** is a top-level lesson in the
module's `itemIds`, numbered `X.X.0`, and its **subsubmodules** are lessons
carrying `sectionItemId: "<the submodule's id>"`. The graph allows exactly one
nesting layer (`content.test.ts`, "sectionItemId … must itself be top-level"),
which is the same two levels the outline describes. 2.2 Cloud and 2.4 Human
were already built this way; this change brought 2.1 and 2.3 onto it.

### What was wrong before

- **2.1 Hardware** ran `2.1.0 – 2.1.5` against the outline's intro + `2.1.1 –
  2.1.8`. Three of the outline's sections had no home at all: `2.1.1` (the
  claim), `2.1.3` (accounting), `2.1.5` (authorization).
- **2.3 Intelligence** ran `2.3.0 – 2.3.4` against the outline's `2.3.1 –
  2.3.5`, had **no submodule intro**, and its five readings were **flat and
  unnested** — no `sectionItemId` on any of them — so the layer opened
  mid-argument and the sidebar showed five peers where the outline has one
  submodule with five children.
- 2.0, 2.2 and 2.4 already matched. They were not touched.

### What was added (four new lessons, all transcribed, none invented)

| Id | Unit | Title | From outline tab |
| --- | --- | --- | --- |
| `v-hw-claim` | 2.1 | 2.1.1 Start with the claim, not the mechanism | "2.1.1 Claim" |
| `v-hw-accounting` | 2.1 | 2.1.3 Accounting for hardware: identity, location, topology, and completeness | "2.1.3 Accounting for hardware" |
| `v-hw-authorization` | 2.1 | 2.1.5 Authorization, licensing, and control | "2.1.5 authorization" |
| `v-intel-intro` | 2.3 | 2.3.0 Intelligence: watching without permission | "2.3 Intelligence INTRO: Watching Without Permission" |

Also added to `v-hw-attestation` (2.1.0), which had no submodule framing at
all: the outline's "Before you begin" runtime, its central question, its five
"what you will be able to do" objectives, and its core source packet.

### What was renumbered (titles and the bodies' own first headings)

`isLessonTitleHeading` compares digits and all, so a retitled lesson whose body
heading still carries the old number stops being de-duplicated and prints the
title twice. Both were moved together, every time.

| Lesson | Was | Now |
| --- | --- | --- |
| `v-hw-attestation` | 2.1.0 The chip says "compliant" | 2.1.0 Hardware: the chip says "compliant" |
| `v-hw-trusted-statement` | 2.1.1 | 2.1.2 |
| `v-hw-measuring-use` | 2.1.2 Measuring, classifying, and controlling use | 2.1.4 Measuring and classifying use |
| `v-hw-where-trust-lives` | 2.1.3 | 2.1.6 |
| `v-hw-policy-studio` | 2.1.4 Policy judgment studio | 2.1.8 Policy judgment: what role should hardware play? |
| `v-hw-reconstructing-run` | Optional 2.1.5 | 2.1.7 Optional extension: … |
| `v-intel-signatures` | 2.3.0 | 2.3.1 |
| `v-intel-anchor` | 2.3.1 | 2.3.2 |
| `v-intel-assessment` | 2.3.2 | 2.3.3 |
| `v-intel-institutions` | 2.3.3 | 2.3.4 |
| `v-intel-action` | 2.3.4 | 2.3.5 |

2.1.7 and 2.1.8 also **swapped order** — the outline ends the submodule on
policy judgment, with the optional extension before it.

Cross-references moved with them: `hardware-attestation`'s "revisited in 2.1.4"
became 2.1.8, and `hardware-measuring-use`'s internal `2.1.2A`/`2.1.2B` labels
became `2.1.4A`/`2.1.4B`.

**Deliberately not renumbered:** the `§2.3.3` citations inside
`intelligence-institutions.mdx`. Those are Baker's section numbers, not this
course's ("Baker §2.3.3, on sharing and its limits").

### Nothing was deleted

No lesson was removed, no body was rewritten, and no existing structure —
themes, progress bar, notebook, memo desk, capstone bank, unit ids — was
touched. Unit ids in particular are progress keys *and* the rung tags in
`data/skills.js`, so `2.0`–`2.4` are exactly as they were; the generated
`course.js` still reports 20 units.

### One metadata correction

`verificationUnitMeta["2.1"].mins` was `35–45 min`, which is the outline's
figure for 2.1's **optional technical extension**. The outline's core time for
the submodule is 165–180 minutes, split into two sessions, and nine sections no
longer make 35–45 credible. Changed to `165–180 min`. Revert if that was a
deliberate under-promise.

---

## Open items — not done, and why

1. **`2.1.4` / `2.1.5` overlap (highest priority).**
   `hardware-measuring-use.mdx` is an older draft *specification*; its second
   half (`2.1.4B Authorization, licensing, and control`) covers the same ground
   the outline now gives its own subsubmodule, `2.1.5`, as finished prose. Both
   are shipping. The 2.1.4B block carries an author note saying so. Merging them
   means deciding which text survives, which is a content decision and belongs
   to the author, not to whoever next opens this file.

2. **2.1's opening puzzle and function map exist twice, and disagree.**
   The outline's 2.1 tab has a 7-row claim table and a 6-row function map;
   `hardware-attestation.mdx`'s specification has an 8-claim list and a 5-row
   function map (the outline's extra row is "Establish location and topology").
   Only the specification's versions are rendered — the outline's were left out
   rather than shipped alongside near-identical duplicates. Reconciling the two
   is the author's call.

3. **2.1.1–2.1.8 are outline-final prose; 2.1.0, 2.1.2, 2.1.4, 2.1.6–2.1.8 are
   still draft specifications.** The three sections added here read as finished
   learner-facing prose because that is how outline 11 writes them. The lessons
   that predate outline 11 still open with a "Section status: still in draft"
   callout and describe an activity rather than teaching it. Outline 11 now has
   finished prose for all of 2.1 — transcribing the rest is a straightforward
   follow-up and was out of scope here (the ask was the skeleton).

4. **The outline's `*` on 2.1.7 is carried in the title, not in the graph.**
   `optional: true` is a `Paper` field, not a `Lesson` one, and making it
   structural would change what module completion counts. If optional
   subsubmodules need to stop gating completion, that is a content-graph change
   with its own test surface.

5. **Interactives named in the outline and not built.** 2.0 points at
   `mechanism-sort.netlify.app` and `evidence-taxonomies.netlify.app`; 2.3.1 at
   `signature-cards`, `signature-halflife` and `nuclear-menu`; 2.3.3 has the
   assessment-autopsy exercise and 2.3.5 the Analyst Desk. None exist in the
   app. They are noted, not stubbed.

6. **Module 2's per-unit `kind`/`mins` beyond 2.1 were not re-checked** against
   outline 11.

---

## Verification performed (2026-08-06)

- `npm run verification:course` regenerated; `-- --check` clean (5 modules, 20 units).
- `npm run verification:memos -- --check` clean (15 slots).
- `npm run verification:capstones -- --check` clean (58 entries).
- `npm run typecheck` clean. `npm run test` — 60 files, 811 tests, all pass.
- `npm run lint` — 0 errors (56 pre-existing warnings).
- **Driven against a running server**, because `importLesson()` swallows a bad
  `contentRef` into `notFound()` and typecheck plus the whole suite stay green
  while a lesson 404s. All **25** module 2 routes returned 200; every renumbered
  title de-duplicated correctly (0 title repeats in any body); the sidebar shows
  submodule heads with their subsubmodules nested under the active one; and
  `/verification/module?u=2.0…2.4` each redirect to the right submodule intro —
  2.3 now lands on `intelligence-intro` rather than mid-layer on `signatures`.
- Pre-existing and *not* caused by this change: `/verification` (no index route;
  the landing is `/verification/landing`) returns 404.
