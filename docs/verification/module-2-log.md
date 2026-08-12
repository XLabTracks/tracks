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

---

## 2026-08-06 — submodule intros renumbered X.X.0 → X.X

On the author's instruction the four submodule intros dropped their `.0`:
2.1.0 → 2.1, 2.2.0 → 2.2, 2.3.0 → 2.3, 2.4.0 → 2.4 (titles in
`curriculum.ts`; `hardware-attestation.mdx`'s own numbered heading renumbered
in the same edit so `isLessonTitleHeading` keeps de-duplicating it — the
other three intros carry no numbered heading). Subsubmodule numbering
(2.1.1–2.1.8, 2.2.1–2.2.3, 2.3.1–2.3.5, 2.4.1–2.4.4) and all nesting are
unchanged. Unit ids were already `2.1`–`2.4`, so progress keys and skill
rungs are untouched.

---

## 2026-08-07 — mechanism-sort built native; resolves item 5's first line

On the author's instruction, the "Place your bets" mechanism sort
(`mechanism-sort.netlify.app`, listed as not-built in item 5 above) is now a
native React widget, replacing the simpler seven-item feasibility ranking
(`mechanism-rank`/`mechanism-rank-reopen`, and its `rank-feasibility.ts` data,
both deleted). It carries the standalone's full content, ported verbatim into
`src/lib/verification/data/mechanism-sort.ts`: twelve mechanisms across four
metrics (technical/political feasibility, effectiveness, durability), each
mechanism's expert `ref` position, explanation, and source list. The `ref`
map is authored curriculum, not computed. One component with a `reveal` prop —
`mechanism-sort` rates + seals in 2.0 (`mechanism-effective.mdx`),
`mechanism-sort-reveal` lays the sealed set over the reference map in 4.1
(`capstone-feasibility.mdx`). Ratings are five named rungs per metric (the
reference stays continuous, so the gap math reads a real distance); layer hue
is always paired with a name (legend) or title. New `vt-ex:mechanism-sort`
storage key — the old `vt-ex:ex-mechanism-rank`/`ex-reopen` keys are orphaned
(incompatible data model), which is the intended cost of the replacement.
`evidence-taxonomies.netlify.app` and the 2.3 interactives in item 5 are still
not built.

## 2026-08-11 — 2.2 Cloud emptied, to be rebuilt from the four papers

On the course owner's instruction, **all of unit 2.2 is deleted.** 2.2 is to be
rebuilt as the four source papers alone — sections of each paper, then test
questions, check-yourself and gap-fills, and nothing besides. What was there
was a mix of the outline transcription and our own synthesis, so it was
removed whole rather than edited down.

Deleted: `cloud-intro`, `cloud-what-providers-see`, `cloud-reporting-control`,
`cloud-limits` (4 lessons, 536 lines) and their entries in `curriculum.ts` —
the module's `itemIds`, the four lesson records, and the four
`verificationUnitOfLesson` rows. The generator derives units from lessons, so
2.2 no longer appears in `course.js`: 19 units → 18. **`verificationUnitMeta`
keeps its `"2.2": { title: "Cloud", … }` row on purpose** — it is unused while
the unit is empty, and it is the title the rebuild reads.

Also removed, because their only consumer was one of those lessons:

- **`m2-2-cloud`**, the 2.2 written output (14 memo slots → 13). It was
  `status: "named"` with the gap *"The outline offers the choice of genre —
  essay, brief or reflection — and stops there."* **It must come back with the
  rebuild**; it is a written output the outline asks for, and deleting it here
  is a consequence of its host lesson going, not a decision that 2.2 owes
  nothing.
- Four exercises: `v-task-cloud-intro-2`, `v-task-cloud-limits-3`,
  `v-task-cloud-reporting-control-1`, `v-task-cloud-what-providers-see-1`.
  Three of the four were never converted from their outline form — their
  prompts still opened `EXERCISE SPEC —` and carried `CHECK:` with the answer
  printed under it. They are in the history if any are wanted back.
- Five `citations.json` entries. `citations.test.ts` fails on orphan entries
  *and* on stale `pending`/`excluded` rows, so there is no way to park a
  citation whose lesson is gone — they had to be deleted. **Four of the five
  are the rebuild's own sources**, so the hand-written `about` lines are
  reproduced here verbatim to be pasted back:

      arxiv.org/abs/2310.13625 — "Oversight for Frontier AI through a
        Know-Your-Customer Scheme for Compute Providers", Egan, Janet, and
        Lennart Heim, arXiv, Oct. 2023.
        about: "A policy paper proposing that compute providers run
        know-your-customer checks so governments can oversee frontier AI
        development."

      arxiv.org/abs/2403.08501 — "Governing Through the Cloud: The
        Intermediary Role of Compute Providers in AI Regulation", Heim,
        Lennart, Tim Fist, Janet Egan, et al., arXiv, Mar. 2024.
        about: "A paper on cloud compute providers as regulatory
        intermediaries — securers, record keepers, verifiers, and enforcers
        of AI rules."

      rand.org/pubs/research_reports/RRA3686-1.html — "Strategies and
        Detection Gaps in a Game-Theoretic Model of Compute Governance",
        Moon, Vedula, Geneson, and Bar-on, RAND Corporation, 2025.
        standalone: true
        about: "The RAND game-theoretic study of compute-governance detection
        gaps the cloud-limits lesson quotes throughout."

      carnegieendowment.org/research/2026/05/the-geopolitical-debates-over-
        controlling-cloud-compute — "The Geopolitical Debates Over
        Controlling Cloud Compute", Tan, Noah, Carnegie Endowment for
        International Peace, 5 May 2026.
        about: "The Carnegie analysis of the cloud loophole in chip export
        controls and the politics of closing it, quoted in the cloud-limits
        lesson."

      federalregister.gov/documents/2023/11/01/2023-24283/… — "Safe, Secure,
        and Trustworthy Development and Use of Artificial Intelligence",
        United States, Executive Office of the President, Federal Register,
        1 Nov. 2023. (EO 14110 — supporting, not one of the four.)
        about: "The Federal Register text of Executive Order 14110, the 2023
        order whose compute-reporting duties the cloud lessons treat as a
        template."

**Reuse terms for the rebuild, unchanged:** the two arXiv papers are CC BY 4.0
and may be quoted freely. RAND RR-A3686-1 and the Carnegie piece are
all-rights-reserved and are reproduced on the author's instruction — RAND from
the report itself, Carnegie from the article as published. The trap recorded
before still holds: the RAND PDF is AES-encrypted and a fetched copy carries no
text layer, so the passages must come from the file the author supplied. Ask
for it rather than assuming a download will read.

**The deeper draft already exists and was never ported.**
`tracksprogramplayground/verification-module-2-2-data.js` (52 KB) is a full
2.2 build — sections → tasks → reader pages, eight readers and a game, with
its verification log in `verification-module-2-2-design.md`, all four sources
checked against the full texts. That is the obvious input for the rebuild, and
porting it is what finally closes the 2.2 duplication CLAUDE.md calls the
widest in the course.

## 2.2 Cloud rebuilt: four external cards

On the course owner's instruction. One unit, `v-cloud` (2.2), back in module 2
between 2.1 and 2.3, holding the four sources as reading cards and nothing
else.

**The ten comprehension checks stood here for one commit and were cut.** They
were over-delivery, not a request; the instruction was cards. They are in the
history, and the note below on where they came from is kept because it is
what a later session would need to bring them back honestly.

**Nothing is reproduced.** The four cards link out and say what each source is
for; the checks quote nobody. That settles the reuse question the emptying
left open: RAND and Carnegie are all rights reserved, and with no reproduction
their terms do not bind anything here. The two CC BY papers are linked rather
than quoted for symmetry, not necessity.

Her source list is used verbatim, which changes one URL: Egan & Heim is the
GovAI PDF (`cdn.governance.ai/Oversight_for_Frontier_AI_…`), not the arXiv
record the old registry entry carried.

**If the checks come back, this is their provenance.** They were ported, not written. They come from
`tracksprogramplayground/verification-module-2-2-data.js`, whose own
verification log records each claim against the full texts — the four provider
roles and the EO 14110 thresholds against Heim et al. p. 31, the
10^26 ≈ 60,000 H100s example against p. 27 fn. 29, the detection-gap band
against Moon et al. p. 5. The four roles were re-confirmed here against the
paper's abstract. Option order was rotated on the way in: that engine shuffled
at runtime and kept the right answer first in the data, which `<Check>` does
not do, so a straight port would have made every answer A.

**`m2-2-cloud` is back**, repointed from `cloud-limits` to `cloud`, still
`status: "named"` with its original gap. Memo slots: 13 → 14. Units: 18 → 19.

**No citations.json entries.** `citedUrls` does not scan `ReadingCard href`,
so registering the four would have failed the orphan test — the same reason
`strategic-foundations`' ten reading cards carry none. Attribution is on the
cards themselves. Adding them to Works cited means citing them in scanned
markdown too, which would print each source twice on the page.

**Still owed.** The 52 KB drafted 2.2 in the playground is 48 reader pages,
six gap-fills and a game beyond these ten questions. This rebuild takes its
checks and leaves its prose, which is the smaller half. The duplication
CLAUDE.md calls the widest in the course is narrower now — the app has a 2.2
again — but the playground draft is still unported.
