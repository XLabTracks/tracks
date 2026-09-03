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
| `v-hw-reconstructing-run` | Optional 2.1.5 | 2.1.7 Reconstructing a declared training run (`optional: true` — note 4) |
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

4. **The outline's `*` on 2.1.7 is structural (updated 2026-08-20).** It was
   carried in the title — "2.1.7 [Optional] Extension: …" — because at the time
   `optional: true` was a `Paper` field and no `Lesson` had one. That stopped
   being true when 0.4 Strategic Foundations landed: `Lesson.optional` exists,
   `isOptionalItem` honours both kinds, and the …ProgressContentIds accessors
   already skip optional items. So the flag moved into the graph and the word
   came out of the title, heading and all. Module 2 requires one fewer unit,
   which is what the outline's star says it should, and the row wears the
   course's single "Optional:" prefix rather than a dialect of its own.

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

### 2026-08-13 — 2.2 becomes a two-hour reading workshop

This entry supersedes the current-state claims immediately above; they remain
in the log only as history. The four-card page is now a bounded 90-minute
source packet followed by one 30-minute native exercise.

- Heim et al. (`2403.08501v2`) and Egan & Heim (`2310.13625v1`) are CC BY 4.0.
  The lesson therefore reproduces credited selections and complete assigned
  sections on-platform, preserving links and cross-references to the pinned
  arXiv HTML.
- RAND RRA3686-1 prohibits unauthorized online reposting and asks readers to
  link to the publication page; Carnegie marks its article all rights
  reserved. Those works remain external. Their cards specify headings, printed
  pages, start and stop points, and the question to extract; none of their
  prose is copied into the lesson.
- Reading time is explicit and totals 90 minutes: 38 Heim, 22 Egan & Heim,
  18 RAND, and 12 Carnegie.
- `cloud-evidence-drill` supplies the remaining 30 minutes through nine short
  mechanics: true/false claims, odd-one-out plus principle, select-all,
  observable-to-conclusion matching, a gap-fill pipeline with distractors,
  ordering, concept identification, a short evidence case, and a final
  inference limit. Completion is bridged to course progress.
- The old `m2-2-cloud` analytical-writing placeholder is removed. Module 2's
  planned memo belongs in 2.3 and its brief in 2.1; neither is invented here.

Supporting pipeline changes make `<ArxivSection>` a first-class build input,
allow an explicit end boundary for a parent section, and convert biblatex
citations from the source `.bib` rather than exposing raw citation keys. The
converter version is 31, so all committed arXiv artifacts were rebuilt.

---

## 2026-08-12 — 2.4.1 source map replaces the roster dump

The first `human-insiders` writing prompt was a seven-row table serialized into
one text field. It has been replaced in the same lesson by the native,
completion-bridged `human-insiders` widget. Nothing moved to a new lesson or
branch.

The exercise now makes the learner connect six source roles — evaluator,
training engineer, infrastructure operator, procurement/finance staff,
supplier/contractor, and executive/board member — to three cards: what the
role can support, where its knowledge stops, and which independent record can
test the claim. A correct chain emits a bounded evidentiary sentence rather
than a score for the person. The second half applies the four requested tests
(access, incentives, consistency, independent corroboration) to a fictional
contractor report and ends at “further investigation justified,” explicitly
short of a compliance judgment.

Source: Baker et al., *Six Layers of Verification*, §§4.3 and A.8, especially
Table 14's mapping of violations to personnel across the AI supply chain. Its
failure modes — compartmentalization/loyalty, collusion, staged access, and
suppression — are carried into the final red-team panel. The exercise and its
engine add no numerical credibility score. The superseded
`v-task-human-insiders-1` entry was removed; the historical-contrast writing
task after the credibility section remains.

### Module objectives standardized (2026-08-13, owner's edit list)

2.0 gains the module-level `<Objectives scope="this module">` block directly
after its first paragraph — six bullets, the owner's wording (distilled from
the Module 2 planning doc's objectives plus the 2.3 signals goal). Kept, not
deleted: 2.1's `scope="the core section"` block (hardware-specific, no
module-level duplicate) and 2.3.0's in-prose "by the end" sentence (overlaps
the module block's signals bullet but is load-bearing prose — flagged to
the owner rather than cut).

### 2.4.4 optional extension: Policy on paper (2026-08-14, owner's 2.4 plan + revision)

An optional block after 2.4.4's lab, outside progress and outside the section
clock: an unbridged widget (`policy-on-paper`), no completion event, no change
to `estimatedMinutes`. Two anonymous companies as tabs — the learner marks each
statement with what kind of evidence it is (published rule / company
self-report / documented prior practice / external assessment / not
established), commits per tab, and reads the key back. The third tab is not a
company: it is the four demands of the June 2024 open letter, answered rather
than marked ("if these were satisfied, what would that change structurally?").

Owner's revisions, both applied. Company B is her five bullets as documented,
ending on the compulsory retraction row — a 2024 rule presented as still in
force is an error, not strictness, and a regime that moved under pressure is
2.4.4's own material. The third tab replaced a third company (a firm with no
published policy at all): a regime that publishes nothing has nothing to mark,
while the demands are the standard the other two tabs are then read against.

Citations moved. Nothing above the end of the exercise carries a link — a
citation on a committed row would name Company A while Company B was still to
be judged blind. Finishing every tab opens one spoiler headed **Sources**: which
letter was which company, and every document each tab's rows were read out of.
The list derives itself from the rows; `policy-on-paper.test.ts` pins that, and
pins that the marking surface never renders a `cite`.

Corrected while checking the mapping: Company A's index row said "highest of
nine on governance and accountability — a C+". The C+ is the overall grade; the
governance-and-accountability domain grade is a B. Both are in the row now.

Sources: the Anthropic RSP Noncompliance Reporting and Anti-Retaliation Policy
(PDF, read in full); the FLI AI Safety Index, Summer 2026; the OpenAI Files
"Transparency and Safety" page, which collects the Vox (18 May 2024) and
Washington Post (13 July 2024) reporting; the CNBC report of the retraction
memo (24 May 2024); righttowarn.ai. Deliberately absent: a secondary claim that
a company "quietly gutted" a commitment in February 2026 — the primary document
was never opened, so it is not in the exercise.

Dropped in the same edit, at the owner's instruction: the two further optional
extensions her plan sketched for 2.4.2 and 2.4.3 ("Break the chain", "Trigger,
not finding"). Neither was ever built; nothing references them.

Corrected the same day, on the owner's reading of the built block: the two
analysis questions were behind the completion gate, so the block opened with
nowhere to write. They now stand above the tabs in the house's written-answer
deck (`QuestionWorkspace` — placeholder, explicit Save answer, "N of 2
answered", its own permanent localStorage document), which is the component's
own rule: a question you meet only after the reading is a question that sends
you back through it, and here it was worse, because the tabs commit — a
learner who marked all three and only then met the questions could not go back
and re-read a row against them. `policy-on-paper.test.ts` pins that the deck
renders before anything reads `done`.

### 2.4.3 optional extension: One report, four ways (2026-08-14, owner's spec)

Her spec in full: one report — "An employee reports that a lab is conducting a
prohibited run." — then four cases, A worked on the run, B heard it from a
colleague, C saw unusual internal messages and inferred the rest, D was fired
last week and has an active dispute with management, and after each case an
answer box. Stem and cases verbatim.

Built as the house written-answer deck (`QuestionWorkspace`) and nothing else:
four cards, four boxes, Save answer per case, "N of 4 answered", its own
permanent localStorage document. All four are on the page at once because
comparing them is the exercise. No marking, no options, no key — whether these
get model answers is a content decision, not one to fill in unasked.

Placed after 2.4.3's lab: the set is about what a report licenses next, an
inspection is what you open, and none of the four establishes the run on its
own. Unbridged, outside progress, `estimatedMinutes` unchanged; the section's
finish event stays "Build the Inspection Order".

One line is not hers and is marked as such in the data file: the question asked
of all four ("What does the report justify doing next, and what does it still
not establish?"), stated once above the cards rather than repeated four times.
It restates the bound 2.4.1's mandatory lab already ends on — "further
investigation justified", short of a compliance judgment — rather than
introducing a new frame.

Both 2.4 optional blocks moved into `<Fold>` the same day, on the owner's
note: that is how this course already offers material it does not require —
a closed red card the reader opens (introduction, theories-of-change,
scoping-anatomy all use it, the last two around a widget). A bare `## Optional
·` heading made optional work read as the next thing to do, and on a chunked
track it became its own reading part. The fold's body is hidden and never
unmounted, so a half-filled widget survives being closed. Each carries the
house's italic size line (`_N cases · about N minutes · …_`) inside.

Closed as decided by the owner, so the next session does not re-raise it:
2.4 gets no memo-desk slot. Module 2's written outputs are 2.1 and 2.3.

Question 1 of the policy-on-paper deck now carries the owner's later wording —
"What underlying institutional incentives do these rules create?" — replacing
the plan's longer "What incentives does this combination of rules, history, and
unresolved authority create?". Same subject; the shorter one puts the rules in
the sentence, which is what the learner has just spent ten minutes marking.

Then, on the owner's reading of the rendered fold: all three preamble lines
deleted (the italic size line, the lesson paragraph framing the marking, the
deck's intro), and the material and the answer boxes swapped — the tabs come
first and the two questions sit under them, which is her order. The one thing
that does not go back is the gate: the questions are on the page from the
start, and `policy-on-paper.test.ts` still fails if anything about them starts
depending on `done`.

### 2.2 cloud problem set: olympiad form and answer audit (2026-08-14)

The nine requested mechanics remain a thirty-minute block, but their first
draft was rewritten after the owner's olympiad examples. Instructions now say
exactly what kind of answer to submit; the odd-one-out requires both the item
and the classification principle; matching answers are one-to-one; the gap
exercise has exactly three unused terms; and the sequence is tied to a stated
scheme rather than presented as a universal chronology. All learner-facing
copy is English.

Every stem, distractor, and key was checked again against the assigned reading
ranges. Claims not found there were removed: checkpoint-sized writes no longer
appear; attestation is described as a verifiable claim in a confidential-
computing protocol rather than a generic signed state; the case uses the
workload characteristics listed by Heim et al.; and the sequential-training
problem uses RAND's per-account metrics, multiple accounts, and large data
transfers. Correct-answer panels link the exact sections used, including the
KYC and policy-scope readings where the conclusion depends on identity or the
rule's coverage. `cloud-evidence-drill.test.ts` pins the mechanics, answer-set
shape, thirty-minute total, three surplus terms, and English-only copy.

### 2.4 rebuilt on the owner's olympiad spec (2026-08-14)

Her review scored the module's concepts fine and its mechanics repetitive:
four different conceptual exercises, almost one user action. Her spec replaces
them with four distinct operations, each adapted from a named olympiad format,
and forbids converting any of them back into multiple choice.

  2.4.1  construct a valid case under constraints
  2.4.2  infer latent incentives from explicit rules
  2.4.3  re-evaluate one claim as a single material fact changes
  2.4.4  construct a coherent institution from constrained components

Each replacement keeps its predecessor's exercise id, so the lesson mapping,
the progress key and the section's finish event never move; the old widget,
data and engine stay in the repo unmounted, as `precedent-cases` does.

**2.4.1 shipped: Construct a Case.** Four fields (Insider / Information /
Reporting route / Failure point), 100–180 words, no options, nothing graded —
a string match cannot see whether a case holds together and the spec says not
to keyword-grade it. Submit freezes the fields and only then reveals her
five-line checklist. The chrome is a new kit, `constructed-response.tsx`,
because three of the four exercises are the same shell with different fields;
what differs between them is the operation, which is each exercise's own.

One thing there is mine and should be read first: the two worked cases. Her
spec asks for "2 contrasting valid examples, not one correct answer" and does
not supply them. Both are built only from failure modes her spec already
lists — one fails on corroboration, one on a legal barrier between the
authorised recipient and the verifier — and they are deliberately unalike so
the pair cannot read as a template. They are two objects in
data/construct-case.ts.

**2.4.2 shipped: Read the Rules, Infer the System.** Six rules stated plainly
with nothing said about them and no rule pre-labelled — a page that flagged
rule 3 would have done the exercise. Three rows, and a row counts only when it
cites rules AND says what follows: the citation is what makes it an inference
rather than an opinion. Rules are cited by pressing their numbers, multi-select,
because most of the interesting consequences here come from a pair (1+4 is the
one that closes the loop) and a single-select would have hidden exactly that.
The institutional vocabulary is unreachable before Submit, per her constraint;
after it, her two-line reveal, the annotated policy, and her ≤40-word second
step with a live counter.

Mine there and flagged in the data file: the six per-rule annotations. Her spec
says to annotate the policy with several possible inferred mechanisms and lists
them — managerial chokepoint, weak anonymity, career cost, dependence on
employer authorization, suppression before an independent verifier, formal
versus usable channel. Each annotation is one of those against the rule or pair
that produces it, and adds nothing she did not name.

The route reconstruction shipped an hour earlier for the same section is now
unmounted, along with the rest of the old lab. It was the right fix to the wrong
question: the spec replaces the section's operation rather than improving its
quiz, so the file stays in the repo and the id now points at the inference.

**2.4.3 shipped: Same Claim, Different Circumstances.** One allegation, four
sources, three lines each — recommended response, the changed fact that
matters, what remains unestablished. All four are on the page at once, which
is the spec's constraint and the mechanism: the variation is controlled and
you can only see what it controls for by reading C against A. The five
available actions are printed ONCE above the four, never as options under each
— an option list per variant would turn one comparison into four independent
multiple-choice questions, which the spec forbids and which was the old lab.
Answers freeze on Submit, then the reveal separates claim content, provenance
and access, corroboration, and the verification threshold, ending on her
constraint that no human report alone establishes a violation. Those four
lines are mine; their names are hers. Then her ≤50-word comparison and the
optional transfer question.

`report-access` ("One Report, Four Ways", shipped this morning) stood down in
the same edit — it was the same controlled variation as an optional aside, and
the spec makes it the section's own exercise. Widget and data remain.

**2.4.4 shipped: Build the Institution.** Twelve provisions in her three
groups, exactly five, then eighty words on why the five work together — which
is a different question from whether each is a good idea alone. Evaluation is
`engines/build-institution.ts` and it reads FUNCTIONS AND CONTRADICTIONS,
never a combination: nothing marks a provision correct, each carries what it
supplies and what it defeats, and a defect defeats its test whatever else was
selected. That is the spec's coherence principle made executable, and the
engine's test proves more than one five passes and that her four invalid
constructions each fail the right test. The verdict comes back as the
evaluator's own sentences naming the card that broke it — "D puts the
organization in the path of its own accusation" is arguable; 2/3 is not.

The two sample designs are mine apart from her example five, and the engine's
test runs both, so a model answer on the page cannot drift into being invalid.

With this, all four sections of 2.4 have a different operation and the module
no longer asks the same click four times. The old widgets — human-insiders,
the reporting route reconstruction, and the shared human-policy-decision-lab
behind 2.4.3 and 2.4.4 — remain in the repo, unmounted.

**Marking keys for all four (2026-08-14).** Every constructed exercise now
ends in a key the learner marks themselves against, in one shared form:

  - credit is per ELEMENT, never per task — a criterion is one thing the answer
    either did or did not do, and carries its own point;
  - a correct label with no reasoning earns nothing wherever a mechanism was
    asked for, and the criterion says so on screen;
  - wording is free: any phrasing that does not distort the meaning counts, and
    no criterion is satisfied by reciting a term;
  - what earns nothing is stated rather than implied — every key has its own
    "No credit" list;
  - the total is the sum of the parts, which `marking-keys.test.ts` enforces,
    along with the other three properties.

Totals: 2.4.1 five points, 2.4.2 seven, 2.4.3 ten, 2.4.4 eight. The 2.4.1 and
2.4.4 criteria are the owner's own from her briefs; 2.4.2 and 2.4.3 follow her
stated grading rules for those two, extended to the number of rows and variants
the built exercises have.

Each criterion that a reading settles carries a `grounds` line naming what
settles it, drawn from 2.4's own assigned readings — the whistleblower chapter,
the design guide, the routes-out paper, the investigation standard, and the
challenge-inspection annex. A learner marking themselves down can go and check
instead of taking our word for it.

The score is the learner's: not sent anywhere, completing nothing, stored
beside the answer it belongs to. A test fails if the panel ever grows a fetch,
a beacon or a server action, because at that point "nothing here is graded"
would have quietly become false.

**Intros rewritten (2026-08-14, owner's review).** The lead-in to a
constructed task cannot name the categories the answer is made of. 2.4.1 now
carries two sentences and the task — "Human reports can fail at several
different points between observation and verification. The next exercise asks
you to construct one such case." — and nothing else. The four excluded
failures moved out of the prompt and into the reveal beside the ones that
count: they are constraints rather than hints, but stating them first still
maps the answer space, and the whole operation here is finding where a report
dies. 2.4.4's lead-in lost the clause that told the learner in advance that
coherence, not individual merit, was the test.

Two cross-references went stale when the exercises were replaced and are
fixed: 2.4.3's opening promised an inspection order, and 2.4.4 told the
learner to reuse the inspection record they had built.

### 2.4 delta pass against the source-of-truth spec (2026-08-14)

Checked the built module line by line against the delta spec's QA checklist and
changed only what deviated. 2.4.3 and 2.4.4 were already aligned in mechanic
and were not redesigned.

**2.4.2 rebuilt: Read the Rules → Policy on Paper.** The section's exercise had
been built against an earlier draft. The required exercise is the policy
critique: the learner finds two provisions in the policy that genuinely support
reporting and two that could stop information reaching an independent verifier,
with a reason for each. Findings are made by pressing a provision in the policy
itself — a menu of pre-written interpretations would leave the reading already
done, which is the substitution the spec forbids. Nothing is marked while they
work and no provision is pre-labelled; the first evaluative word appears after
all four findings are committed. Eight points, two per finding, and the second
of each is the causal explanation: calling a provision good or bad is the
judgement, not the justification. The policy is the spec's own six provisions,
which unlike the earlier one contains protections that genuinely work — without
those the "two that support" half of the task has no answer.

The old widget (infer-the-system) stays in the repo unmounted, marked as such.

**2.4.4:** the requirement list shown to the learner is now the spec's five,
not three; the Verification test requires corroboration AND escalation, because
her requirements list them separately and they are different institutions —
escalation without corroboration concludes from an allegation, corroboration
without escalation is a filing system; a Coherence row was added beside the
three machine verdicts saying it is decided in the key, so the evaluator's
three do not read as the whole marking. The "different question from whether
each one is a good idea on its own" clause is restored to the lead-in on the
spec's instruction.

**2.4.3:** the per-case prompt is now the spec's exact question, and the rubric
is exactly eight — two per case and nothing else, with the rule that a right
answer elsewhere cannot carry a wrong one stated in the key. The ≤50-word
comparison stays, unscored for that reason.

**2.4.1:** the bridge is the spec's wording, the Insider field hint no longer
adds a category the prompt does not ask for, and the lab moved below the
reading — the source text teaches what each station can and cannot know, and
the task is to use it rather than meet it cold.

The 2.4.4 optional `policy-on-paper` stood down: Policy on Paper is 2.4.2's
exercise now, and two exercises of one name in one module is a defect. Widget,
data and test remain.

**2.4's four exercises are optional (2026-08-14, owner's instruction), with
her self-paced times.** 8–10, 12–15, 12–15 and 15–20 minutes; the headings say
`## Optional lab · N min` and all four widgets are unbridged, so they record no
completion and a learner who reads the section and skips the labs has still
finished it. Four constructed answers of ten to twenty minutes on top of the
readings is more than two hours holds, which is what makes them optional rather
than shorter.

All four are behind Folds, on the owner's decision — optional material in this
course wears the red bar whatever it is, and consistency about what "optional"
looks like beats the argument that these particular ones deserve to be met
without opening anything. The `## Optional lab · N min` heading stays above
each fold: removing it would leave three of the four lessons with a single
top-level heading, which costs them their sidebar nav and, on a chunked track,
collapses the whole lesson into one part.

### 2.4 final architecture (2026-08-14, owner's final spec)

Two exercises replaced and all four renamed. The module's rhythm is now the
one the spec names — creative short answer, fast discrimination, controlled
comparison, real-world analysis — and the four remain mechanically distinct.

  2.4.1  Insider Report        construct under simultaneous constraints
  2.4.2  On Paper              discriminate between close institutional claims
  2.4.3  Four Sources          re-evaluate as one dimension changes
  2.4.4  Companies A and B     compare, then infer from real evidence

**2.4.2 is now a five-question discrimination deck**, 5–7 minutes, replacing
the four-finding policy critique. It is the ONLY multiple choice in 2.4 and
that is what makes it legitimate: the spec's rhythm asks for one fast block,
and nothing else in the section is multiple choice. Five fragments cover
organizational gatekeeping, the external route, anti-retaliation, anonymity
versus reliability, and report versus established violation; the question types
vary deliberately — most important limitation, which provision addresses a
stated failure, which conclusion does NOT follow, strongest implication,
justified inference. All five are answered before any is marked. The first
question is the owner's verbatim, including its options and its answer; the
other four are ours against her coverage and variety lists. No marking key: the
deck has right answers and marks itself, and the explanation under each
question is the feedback.

**2.4.4 is now Companies A and B**, replacing Build the Institution, which the
owner judged an artificial card puzzle. Part I is her two feature lists
verbatim — both regimes defensible on a first read, A with four safeguards and
B with five, so counting gets nobody anywhere — and asks for the two
differences most consequential for whether evidence can reach an independent
verifier, with the mechanism in each case. Part II gives the June 2024 letter
as EVIDENCE rather than authority: its asks, the composition of its
signatories, and the two questions of what that composition is evidence for and
what it does not establish. The supported inference and both overclaims are
hers verbatim; the one-line notes on why each overclaim fails are ours. The
transfer question closes it by sending the letter back onto A and B.

Eight-point key, two per element: the difference, its mechanism, the reading of
the letter, the overclaim named and why it does not follow.

Both stood-down widgets (policy-critique, build-institution) keep their files
and are marked unmounted at the top.

### 2.4.4 restored, and its sources re-verified (2026-08-14)

The generic Companies A/B built from the reconstructed feature lists is
unmounted; 2.4.4 is the recovered exercise again — two real companies, censored
behind letters while you judge them, each statement read out of a document, the
third tab the June 2024 letter's demands, and one Sources spoiler at the end
that cashes out which letter was which company and what every row was read out
of. It was never lost: the file sat in the repo unmounted, and history carries
three versions (`1962a27` with a Company C, `25441d8` where C became the demands
tab, `d7fa6e2` with the owner's wording of the main question).

Every source re-checked against the document, not against memory. Two rows did
not survive it:

- **Company A's informal-conversation rule was stated too strictly.** The policy
  gives two ways an informal conversation becomes a report — the employee files
  one through a named channel, OR the senior leader confirms they filed one on
  their behalf. The row named only the second, which made the rule sound like a
  trap rather than a burden. Both are in it now.
- **The note on the unpublished usage numbers cited the index for something the
  index does not say.** Its governance domain scores four things — whistleblowing
  protection, reporting culture and track record, policy quality, policy
  transparency — and none of them is how many reports a channel receives. The
  note now says what the index does score and stops there.

Verified unchanged: the anonymous third-party channel and the company's
statement that it cannot unmask an anonymous reporter (both verbatim in the
PDF); the external-reporting clause (verbatim); the B in governance and
accountability, highest of nine (the next two score C-); the lifetime bar on
criticism and the NDA covering its own existence ("Even acknowledging that the
NDA exists is a violation of it", Vox 18 May 2024, via the aggregator); the
equity risk; the SEC complaint's allegations (Washington Post 13 July 2024),
which the row already marks as a complaint rather than a finding; and the
retraction memo — "OpenAI has not canceled, and will not cancel, any Vested
Units", 24 May 2024. The CNBC link returns 403 to a datacenter fetch, as RAND
and DFAT do; the memo's wording was confirmed through the syndicated copies.

**Company B gains its one outside judgement (2026-08-14).** Tab B was six rows
of documented practice and nothing from anybody outside, so the
external-assessment label was never exercised there while tab A used it twice.
It now carries the index's grade for that company — C on governance and
accountability, second of nine behind a single B — and the row says what the
index does NOT say as part of itself: four recommendations about other things
is not the same as having examined the reporting channel and approved of it.

The grade was checked twice because the first read of the index returned C- for
this company and B for the other, which disagreed with a second read. Asking
for the domain grade of all nine at once settled it: Anthropic B, OpenAI C,
Google DeepMind C-, Meta D+, Alibaba Cloud D-, and F for Z.ai, xAI, DeepSeek
and Mistral. Company A's row (a B, highest of nine) stands.

Material found and NOT used, recorded here so the next session does not have to
find it again — the OpenAI Files' `/former-employees` page carries direct
first-person testimony, which is a different kind of evidence again from the
aggregated reporting tab B currently uses: a court filing (11 April 2025)
alleging the CEO lied to employees about his knowledge of the lifetime
non-disparagement agreements; a former employee on access to liquidity having
been used as an intimidation tactic (24 May 2024); and two signatories of the
June letter on confidentiality agreements blocking them from raising concerns
anywhere but with the company itself. Using any of it is a content decision.

**The steelman deck comes to 2.4 (2026-08-14).** The writing desk has three
things beside a draft — rule-based checks, the skim test, and a steelman deck
that draws one challenge at a time. 2.4 had the first of those on 2.4.1 and
nothing else. The deck is now on all three written exercises: the constructed
case, the four sources, and the two questions about the regimes.

One deck per exercise, because the objections that bite differ — a card asking
whether your failure point survives a more senior insider is useless against a
fifty-word comparison. Eight cards each, which is a deck somebody could exhaust,
and that is the honest shape for a ten-minute exercise; the desk's own is
fourteen because a memo takes an hour.

Every card asks the writer about their own answer and none of them says
anything about reporting institutions. That is the line that keeps a challenge
deck from becoming curriculum by the back door.

Nothing is stored: a drawn challenge is a prompt, not learner work, and
persisting it would make it read as a task with a right response. The card
starts unshown so the first render matches the server's — a random card chosen
during render would not.

The skim test is not ported and should not be: it reads first sentences and
bold lines to show what a hurried reader sees, which is a memo's problem. None
of these four is a document somebody skims.

**2.4.4: the group headings and the kickers deleted (2026-08-14, owner's
call), and they were a key.** "Published process" over a statement is the
Published-rule chip spelled out; "Documented context" is
Documented-prior-practice; "Still unverified" is Not-established. Three
headings, each answering the question its rows ask — a learner could have
marked the whole tab off the headings without reading a statement. The third
one was not in the deletion list and went with the other two for that reason.

The kickers went the same way and for a related reason: "Publishes a detailed
reporting policy", "As it was documented", "What the employees themselves asked
for" each characterised a regime before the learner had characterised it.

The grouping survives as the order rows come in, which is the only part of it
that was not a key.

### 2.4: the explaining lines come out (2026-08-14, owner's note)

An olympiad paper states the task and stops. It does not say why the task is
interesting, does not restate the instruction under each field, and does not
gloss its own vocabulary. 2.4 had all three. What was cut:

- **2.4.1** — the four field hints, which were the prompt's own sentence
  ("make clear who the insider is, what they know and how they know it…")
  printed a second time under the labels; "One concrete case, not three
  definitions"; the fill-all-fields nag; the desk rail's subtitle trimmed to
  "Rules, not marking."
- **2.4.2** — the lead-in, which announced that the options were close and
  differed by one institutional fact. That is a description of the difficulty,
  and knowing it in advance is half of finding it. Also "Nothing is recorded."
- **2.4.3** — the four analytic categories that followed "this is not a
  ranking": work out what they can know, whether it is direct or inferential,
  what is unverified, what evidence would help. Handing those over before the
  task is exactly what was cut from 2.4.1 two commits earlier. The
  not-a-ranking instruction survives, alone.
- **2.4.4** — the tooltip on every provenance chip, which was the chip saying
  itself again; the status lines that explained where the Sources block would
  appear; the line telling the learner that the demands answer was the work of
  the tab.

**And 2.4.4's task moved inside the exercise, above the tabs, in the form an
olympiad paper uses**: a number, an imperative instruction, nothing else. The
lesson body above the fold said what the exercise was for and now says nothing
at all — which is right. A problem that needs an introduction has not been
stated.

**2.4.4: two provenance defects, and it stops being optional (2026-08-14,
owner's review).**

- **The first card mixed two provenances and was keyed as one.** "Reports may
  be filed anonymously through an independent third-party platform, and the
  company states it cannot unmask an anonymous reporter" is a published rule
  AND an assertion about the company's own systems, keyed Published rule. The
  exercise that teaches learners not to mix provenance was mixing it on its
  first card. Split in two, as the owner set it out: the channel is the rule,
  and "the company states that it cannot identify a reporter who uses the
  anonymous channel" is a company self-report. Two sentences a few lines apart
  in one document with different epistemic status — the split makes the
  exercise better, not just correct.
- **The SEC row classified an allegation as practice.** Its own note admitted
  that what is documented is the complaint and not a regulator's finding, and
  then said "that is still evidence of practice", which is precisely the move
  2.4.3 spends ten minutes teaching against. The taxonomy has no label for a
  documented allegation, and rather than add a sixth the row now states the
  documented object: whistleblowers FILED a complaint alleging X. The filing is
  what happened; the allegation is its content, and the note says so.
  (Adding "Documented allegation" as a sixth label is the alternative, and it
  would change the vocabulary of the whole exercise, so it is the owner's call
  rather than one to make in passing.)
- **Not optional.** 2.4.4 comes out of the Fold, its heading is "Lab" rather
  than "Optional lab", and it is bridged — finishing the three sets is the
  section's finish event, fired from an effect on the finished state because
  there is no single button that ends it. 2.4.1 to 2.4.3 stay optional and
  folded.

**Sources become a spoiler, not a disclosure (2026-08-14).** `<details>` opened
downward: the page grew under the reader's hands and everything below moved.
The messaging-app spoiler does not do that — the content is present at full
size under a grainy cover that comes off where it stands — and it is the right
shape here, because it lets the heading be visible from the start. "Sources"
now sits above the block always, which is what tells anybody there is something
there; the veil is what says they have not looked yet. Height before and after
uncovering: identical.

Three things it does that the apps do not. Covered text is blurred AND
unselectable AND `aria-hidden`, so it cannot be lifted by dragging a cursor
over it, by a screen reader, or by find-in-page. The cover is a real button
with a real label, so a keyboard reaches it. And it carries "Press to uncover"
inside itself — their spoiler sits in a message you are already reading, where
a smudge is obviously a smudge over something, while on a page it is just a
grey panel; the label lives inside the veil so it leaves with it and cannot go
stale.

It goes both ways, on the owner's call. The argument for copying the apps'
one-way behaviour was that nobody can unsee an answer — true, and beside the
point: covering it again puts the page back for somebody who wants to keep
working on the material rather than under the answer. Hide sits exactly where
the hint sat, so the header's right-hand slot always holds one thing and never
two: the hint while covered, Hide while not.

The veil is `.spoiler-veil` in globals.css — two dot fields drifting at
different rates over a translucent ground, all of it theme tokens, so the night
theme paints itself without a second declaration, and the drift stops under
prefers-reduced-motion while the cover stays.

**2.4.4: two dead references removed (2026-08-14, owner spotted them on a
phone).**

- The lesson opened on "whether Project Lattice complied". Project Lattice is
  the case file of the old 2.4.1 widget and the old decision lab, both
  unmounted — the name now exists only in data files nobody reaches, so the
  opening pointed at a case the learner has never met. It says "a developer"
  now.
- "Reuse the personnel limits from 2.4.1 and what 2.4.3 established about what
  a report licenses. No additional background reading is required." All three
  clauses were about exercises that no longer exist: 2.4.1 has no personnel
  roster to reuse, and the sentence had already been patched once instead of
  deleted. Gone.

Swept the other three lessons for the same disease and they are clean. The
lesson that replaced its exercise is where this accumulates: the exercise
changes, the prose around it keeps describing the old one, and it survives
because nothing tests prose.

**Sources: the lock comes off the cover (2026-08-14, owner, translated: "and where are the sources").**
The Sources block was wrapped in `{done ? … : null}` — it appeared only once
all three tabs were committed. On her phone, at the bottom of 2.4.4, there was
simply nothing there. That is a lock on top of a cover: the spoiler already
hides the mapping, and the learner is the one who decides when to look at it.
The gate is gone, the block renders from the start with its letters covered,
and `policy-on-paper.test.ts` now pins the property rather than the gate —
`{done ?` must not appear in the widget at all, which covers both this and the
earlier defect where the analysis questions were behind the same gate.

**Correction: blur does not hide text.** The entry above says covered text is
"blurred AND unselectable AND `aria-hidden`, so it cannot be lifted … by
find-in-page". The last third of that was wrong, and a browser check caught it:
blur is a filter, so the words are still rendered and still in the text layer —
find-in-page matched them, and a screenshot at the right radius reads them.
Covered content is `visibility: hidden` now. It keeps its box, which is the
whole reason the page does not move, and renders nothing, so the text is out of
reach of find-in-page, of selection, and of the accessibility tree. Verified in
Chromium at iPhone 13 width: with nothing committed, the Sources section is
present, its text content reads empty while covered, the company names are not
findable, and one press uncovers it.

**The veil loses its panel (2026-08-14, owner, translated: "why are
the borders swimming — can you do it without a border, just like
Telegram").** She was right, and what she was seeing was not a
border: the veil carried `background-color: color-mix(card 88%, foreground)`, a
ground visibly darker than the card, on a rounded rectangle. That is a panel.
The drifting dots crossing its edge made the edge itself look like it was
moving, so the cover read as a floating outline around something rather than as
grain over it. The apps have no ground and no edge — the particles sit straight
on the message.

So: no ground at all, and the dot field is masked to fade out over its last
12px, which leaves it with no boundary of its own. It costs nothing to hide,
because the content underneath is `visibility: hidden` — there is no text there
to leak through a soft edge. Dots came up slightly (60/38% of foreground,
from 55/35) to carry on the plain card ground the tint used to do half of.

Two traps met on the way. A `mask-image` applies to everything the element
paints, the keyboard focus ring included — it would have faded out at exactly
the edges it exists to be visible at — so the grain moved to `::before` and the
button kept its ring. And a positioned pseudo-element paints above static
in-flow content, so the "Press to uncover" label needed `z-10` (and an opaque
ground rather than `bg-card/80`: dots showing through the one thing on the
cover that is meant to be read is not texture).

Checked in Chromium at both widths, covered → uncovered → covered again:
section height 452 → 452 → 452 on iPhone 13, 310 → 310 → 310 on desktop, and
document height identical at every step. Company names unfindable while
covered, findable uncovered, unfindable again after Hide. No sideways scroll.

**Answer options are shuffled now, platform-wide (2026-08-14, owner, translated:
"why are almost all the correct quiz answers B").** She was reading 2.4.2, where four of
five answers were B. Measured across every question bank in the repo before
touching anything:

| bank | A | B | C | D | E |
|---|---|---|---|---|---|
| policy-quick-check (2.4.2) | 0 | **4** | 1 | 0 | 0 |
| protocol-actors | **15** | 0 | 0 | 0 | 0 |
| drills-supply-chain | 4 | **9** | 0 | 0 | 0 |
| drills-games | 10 | 10 | 0 | 1 | 0 |
| drills-foundations | 7 | 6 | 2 | 1 | 1 |
| exercises.data | 2 | 3 | 5 | 0 | 1 |

86% of correct answers in slot A or B. And `whistleblower-levers` was worse
than any of those in kind rather than degree: it offered its four chips in the
same order as its four rows, so the matching solved on the diagonal without
reading a word.

The fix is `src/lib/shuffle.ts`, applied at the display layer — no data file
reordered, no key moved. Two decisions carry it. The order is a function of the
question id, not of the visit: per-visit randomness would break SSR against
hydration, move the options under somebody returning to a question they
answered, and quietly invalidate the facilitator guide's session keys, which a
room of people reads together. And nothing is keyed on position — the shuffle
hands back each option with the index it was authored at, so the drill benches'
`right` and the reader's `<Check answer={n}/>` compare against THAT. That is
what let index-keyed banks shuffle with no migration and no stored pick
changing meaning.

Six surfaces: `toPublicChoice` (which is also where the answer key is stripped,
so neither can be forgotten at a call site), policy-quick-check, protocol-actors,
whistleblower-levers, the drill deck's pick and multi steps, and `<Check>`.

Three things had to move with it, and they are the interesting part:

- **A letter is a position.** 2.4.2's explanations said "A and C are real
  weaknesses"; three of them were rewritten to name the options by what they
  say. The badge now prints the SLOT letter rather than the choice id — the ids
  are a..d, so printing them shuffled would have produced a list labelled
  B, D, A, C.
- **Three drill reveals name an option by position** ("the second option is the
  planted over-reading"). Those steps carry `fixedOrder: true` rather than
  having their authored prose rewritten. For a new step the honest fix is to
  name the option by its content and leave the shuffle on, and the test says so.
- **Two opt-outs are automatic**: a true/false pair keeps its conventional
  order, and "None of the above" stays pinned last while everything else still
  moves around it.

`answer-order.test.ts` is the durable half. It fails on positional prose without
an opt-out, on an answer surface that does not route through the shuffle, on an
index-keyed renderer that stops destructuring the authored index, and on a slot
running far above an even spread — measured against the banks' own option
counts, because a quarter of these questions have only two options and a flat
percentage would either pass everything or fail on arithmetic.

Verified in the browser, not just in tests. 2.4.2's five answers now sit at
D A A C B with badges reading A B C D down every question, identical after a
reload. A drill bench was walked step by step against the data: on the
four-option step the first option shown is no longer the key, and the `key`
marker lands on the string the data file calls the answer. The treaty quiz's
first phrase had its correct option authored first; it renders third.

One surface deliberately left alone: `verification-problem`, whose four cards
are an explorable rather than a question — the learner opens all of them, and
the one that holds is last because three failures precede it. That order is an
argument, not an accident.

**Correction to the entry above, on whose defect this was (2026-08-14, owner, translated:
"that is not true … you and your versions are very much to blame").** That entry said "nobody
did that on purpose: an author writes the true statement first". That framing is
wrong, and `git log` on the files says so plainly: `whistleblower-levers.ts` and
its widget were written by Claude the same day the bias was found (1b65424),
`policy-quick-check.ts` two commits earlier, `protocol-actors.ts` by Claude on
2026-08-05. The last human hand in any of them is the original track import.

It also mis-describes the mechanism. Writing the true statement first is a
habit that produces a lean toward slot A; it does not produce a diagonal. The
diagonal came from mapping one array over both the rows and the chips in a
widget, which makes the answer to row N be chip N by construction. That is not
an authoring tic — it is a widget shipped without anybody trying to solve it.

The lesson the first entry buried: a shuffle fixes the symptom, and the missing
step was asking what the finished exercise looks like to somebody trying to
beat it, while it is being built. `answer-order.test.ts` is that question asked
mechanically, which is the only version of it that survives the next session.
The framing has been corrected in `src/lib/shuffle.ts`, `answer-order.test.ts`
and CLAUDE.md.

### 2026-08-14 — 2.2 exposed as four sections

The two-hour Cloud workshop is no longer one 120-minute sidebar item. Its
existing authored boundaries are now four lessons: provider records and
workload observables (38 minutes), customer identification and ongoing
monitoring (22), detection gaps and policy limits (30), and interpreting cloud
evidence (30). The source selections and the `cloud-evidence-drill` itself did
not change.

`2.2 Cloud` is a non-linking sidebar group rather than a fifth introduction
page. The first real lesson, 2.2.1, owns the existing `/cloud` route so old
links still land on substantive content. The group lists all four sections;
the exercise keeps its existing id and local-storage document, so saved work
survives the move to its own route.

### 2026-08-14 — 2.0 redone from the owner's new draft; 2.0.1 split out

The owner supplied two new PDFs ("2.0 new", "2.0.1 new"). 2.0 now carries the
draft's four objectives, a "Feasibility Intuitions" section whose four metrics
each state their Low/High anchor examples on a sliding-scale block
(`<SlidingScale/>`, per the draft's "[put these on a sliding scale]" note), the
notebook prompt in the requested dark/light-red rounded outline (new `notebook`
Callout variant), and an "Evidence Taxonomies" section. The draft's planning
bullet list under the taxonomies embed was not transcribed, as its own bracket
instructs; the old trailing "keep these questions in mind" block is gone with
the rewrite. Both embeds stay.

The privacy-preserving material moved out of 2.0 into a new 2.0.1
Privacy-Preserving Mechanisms (`v-mechanism-privacy`, nested under 2.0 via
`sectionItemId`, unit "2.0"), transcribed verbatim from its PDF with the five
mechanisms as the draft's pop-up grid (`<MechanismGrid/>`/`<MechanismCard/>`,
shared visual grammar: muted zone = facility, lock = what stays inside, circle
= verifier, primary accent = what crosses). The draft's [LINK] markers resolve
to 2.1/2.2/2.3/2.4 lesson routes; its six new external works sit in
`citations.json` `pending` until their facts are verified. The mechanism-sort
lane dots gained a ground-colour rim so overlapping placements stay separable
(the draft's other bracketed ask).

**Low-vision mode enlarges again, and now enlarges everything (2026-08-14,
owner, translated: "the low-vision mode does not make everything bigger
anymore, it was supposed to").** `d58c3c0` had removed it: the high-contrast theme used to re-solve the
whole `--fs-*` scale at exactly 2x (12→24, 16→32, 38→76) and that commit
deleted the scale along with every reflow release the doubling needed, leaving
contrast-only colour and browser zoom.

The argument it was removed on — contrast and magnification are separate needs,
somebody may want edges without doubled labels — is a good argument about a
general theme system and the wrong one here. There is one switch, and the
owner's design is that it is the low-vision switch: picking it means "I cannot
read this". Splitting it hands the person it exists for two settings and makes
the one they find first do nothing for them. That reasoning is now written at
the top of the block in theme.css, because the next session will find the same
plausible argument.

Reverted the CSS half of that commit and kept its component fixes (the sidebar
sheet's responsive width, `line-clamp-3`, the drill's sequence id). Then closed
the holes the original never covered, found by sweeping every Verification
surface at 1280 and 320 and listing text still under 20px in the mode:

- **Inherited text.** The bridge mapped every Tailwind `--text-*` token to the
  scale, so anything that ASKS for a size scaled — but text with no size class
  inherits from `body`, which nothing pointed at the scale. The track page's
  course description and the skip link stayed at 16px while the page doubled.
  `body { font-size: var(--fs-md) }` on themed routes: 16px in day and night,
  32px here. On `body` and never `:root`, because rem resolves against the root
  and Tailwind's whole spacing scale is rem — moving it would double every
  margin and gap, which is the `zoom: 2` mistake wearing a different hat.
- **Arbitrary values.** `text-[11px]` compiles to a literal and never sees the
  token map; there are ~375 across the widgets, in twelve distinct values.
  Rewriting them all would move sizes in day and night too, so the mode maps
  the twelve instead — doubled, which is not a guess: every `--fs-*` step is
  re-solved at exactly 2x, so a micro-label keeps its place relative to its
  neighbours. Same for the three rem literals (`text-[0.95rem]`, the small
  button's `text-[0.8rem]`, and globals.css's sidenote/facilitator rules).
- **Three reflow failures at 320px**, all the same shape: a `display: flex`
  row with no wrap whose children will not shrink (`.track-head`, `.card-top`),
  and a grid item whose automatic minimum is its min-content, so a card widened
  its own column (`.bank-grid > *`).

Verified: every one of eleven Verification surfaces at 1280 and 320 now reports
zero text under 20px in the mode and no sideways scroll, body copy goes 16→32
and h1 30→60, and a full font-size snapshot of day against night is byte-identical
before and after this change — nothing outside the mode moved.

**2.4.2's deck rebuilt to the owner's source-grounded MCQ specification
(2026-08-15).** Five single-answer questions, 7–10 minutes, replacing the five
short discriminations. All of it is hers, transcribed: the fact patterns, the
options, the answers, the feedback and the source line under each. The legal
content is not inferred from the statutes here — a correction to it belongs in
her spec first, and the data file says so at the top.

The design rule that makes them different from what was there: each answer
turns on a detail of one of the three assigned readings (California Labor Code
§§1107–1107.2, the AIWI/CARMA guide, CIGIE's 2025 Quality Standards), each
distractor misses one legally or institutionally material condition, and the
correct option is the most complete application of the source — rather than the
one a good generic intuition about whistleblowing would reach for.

Widget changes the spec asked for: fact patterns render as a list where they
have one; **no label of any kind before submission** — the conceptual "covers"
line is gone entirely, since naming what a question tests is the scaffolding
the spec rules out, and after the fact the source citation is more use anyway;
on submission each question shows correct/not-quite, the explanation, and the
passage the answer rests on. Storage key bumped to v2 — the old picks address
questions that no longer exist.

Two things found while wiring it:

- **The submit handler called `onComplete`.** It recorded nothing, because the
  registry has this id unbridged and `useVerificationCompletion` hands an
  unbridged widget a no-op — but the spec says the score records nothing toward
  completion, and a live call is a trap for whoever flips that flag later.
  Removed; the widget now takes `{}` like whistleblower-levers next door.
- **`persist` took a value built from the render's `saved`.** Two picks landing
  in the same tick both read the same snapshot and the second dropped the
  first. Ordinary clicking never does that — a re-render sits between them —
  but a fast keyboard pass does, and a scripted pass did, which is how it
  surfaced. It takes an updater now.

Verified in the browser against the spec's UI list: five questions on one page,
per-question "N of 5", nothing revealing a source before submission, Check all
five disabled until all five are answered, and on submission twenty options
frozen, five verdicts, five source lines, the total, and Start over. Answering
all five correctly reads 5 of 5. The correct options sit in slots B D D D C —
the shuffle is doing its job on a deck whose answers were authored a, c, b, c, b.

### Companies A and B moves from 2.4.4 to 2.4.2 (2026-08-15, owner's instruction)

(Translated) "Move the current task from 2.4.4 into 2.4.2, the one about
whistleblower policies."

The exercise's material was never 2.4.4's. Every row it asks a learner to mark
is a sentence out of a real whistleblower policy, and the third tab is the
June 2024 open letter demanding one — which is 2.4.2's subject, read against
the statutory floor and the best-practice guide 2.4.2 already carries. 2.4.4's
own source is Brundage et al. on audit design, and the exercise never used it.

What moved: the `<PageBreak>`, the `## Companies A and B (15–20 min)` heading,
and the embed. It is the last part of 2.4.2, after the optional On Paper fold
and outside it, because it is the section's work and not an extension beside
one — the same reason it sat outside the Fold in 2.4.4.

What did NOT move: the exercise id `human-institutions-judgment`, its
`v-policy-on-paper:v1` and notes storage keys, and its answer key. The id is a
progress key; it now names where the exercise was authored rather than where it
is read, and the registry comment says so.

Two consequences, both worth her word:

- **2.4.4 is now a framing paragraph and one 6–8 minute reading.** It has no
  exercise. The one edit inside the reading card was "For this exercise" →
  "For this section", which named the exercise that left; every instruction in
  it is hers, unchanged.
- **`human-institutions-judgment` stays bridged.** CORRECTED 2026-08-15, same
  day: the first version of this entry called that a defect, on the reasoning
  that the bridge writes to `v-human-institutions-judgment`, which is not a
  lesson in the graph. It is not a defect. `bridged` writes to the EXERCISE's
  own content id, never its host lesson's, so an exercise embedded in somebody
  else's prose records a private mark the widget reads back to show itself as
  done and completes no section — by design. It only completes a lesson when
  the exercise IS one (`v-interactive-map`, `v-report-constructor`). The rule
  now lives in one place, the header of `src/lib/verification/exercises.ts`,
  because that file's per-entry comments had claimed the wrong thing twice.
  So nothing about 2.4's completion changed with the move, and her instruction
  that 2.4.1–2.4.3's labs record nothing is not in tension with it.

Estimates re-cut with the block: 2.4.2 40 → 60, 2.4.4 30 → 10. The 2.4 unit's
own `120 min` in course.js is unchanged, because nothing left the section.

### 2.4.4 gets its optional closer: The Standard of Proof (2026-08-15)

Her brief: one optional 15-minute exercise closing all four 2.4.4
objectives. The design, agreed in-session, is a 2×2 the learner is never
shown — evidence weight × institutional soundness — read off four dockets
under one sticky allegation (Meridian Compute, fictional, deliberately not
Cedar). Per docket: a next-move selection (record / investigate / judge /
refer — never marked) and one analysis box; Submit gated on all four;
freeze; reveal names the grid, then the self-check pair, the per-docket
marking key, the 50-word standard question and the optional transfer.

The division of labour with the section's reading is the point of the
design: her audit question ("check what this one covers", translated) established
that Brundage et al. carries independence, access, competence and the
financial/revolving-door capture guards, but not authority, not the
human-vs-technical distinction, and not the decision operation — so
dockets C and D are built as violations of exactly Brundage's Access and
Independent Experts principles (the key names them), while A and B carry
corroboration and the authority line, and the moves menu is the decision
standard itself.

Dockets, key and closing questions are OURS PENDING HER COPY, flagged in
the data file header. Registered unbridged (optional never gates);
embedded at the tail of human-institutions behind a
"Optional Exercise: The Standard of Proof (15 minutes)" fold.

### 2.4.4's source packet grows a second reading (2026-08-15)

Her follow-up to the coverage audit (translated: "maybe add something
else, 5–10 minutes of reading"): Brundage carries independence, access and the capture guards,
but not authority, not accountability, and not the decision operation.
Added John Carlson, "Defining Noncompliance: NPT Safeguards Agreements"
(Arms Control Today, May 2009; armscontrol.org) — the same author as
0.3's Document 3, writing exactly about the gap: inspectors find, the
Board judges, the Security Council enforces; a standard of proof and a
five-case table separate a breach from a noncompliance finding. Cut for
6–8 min ("Determining noncompliance", "Standard of proof", the table).
The card blurb is ours; the source-packet heading is 12–16 min now, and
the Standard of Proof data header records the three-way division of
labour between the two readings and the dockets.

### The Missing Board: Carlson's reflection questions become an interactive (2026-08-15)

Her brief, verbatim intent: reflection questions on the new Carlson
reading — translated, "transfer it onto AI, think it through, draw the
analogies" — tried as an
interactive first, and billed into the lesson budget. The construction:
Carlson's decision chain as four stations (finder / judge / enforcer /
the standard), each shown with the nuclear regime's answer from the
reading and a write-in transfer prompt for AI; a fifth box names where
the analogy strains; Submit freezes and opens per-station commentary
(never a marking) and a 50-word closing question binding the board to a
consistency guideline. Required reading-work: outside any fold, its own
h2 and part, unbridged (reflection, not a finish event). The lesson's
estimate rises 15 → 25. Prompts and commentary are OURS PENDING HER
COPY, flagged in the data file header.

### 2.4 conformed to the owner's edit document (2026-08-18)

Source: her five-page 2.4 PDF ("2.4.pdf"), every instruction applied, plus
her chat decisions the same day: restricted sources KEEP their link-out
cards ("don't do anything illicit"), interactivity comes from a 2.0.1-style
button grid where a source is list-shaped, and the drafted 2.4.3 key
questions were approved as written.

**Whose words are whose.** Her document supplies, verbatim: the 2.4 intro
paragraph and all four objectives (replacing our drafted objectives); 2.4.1's
two framing paragraphs, the sentence between the Baker excerpts, and the
replacement for the "Human reports can fail" bridge (it now hands off to
2.4.2); 2.4.2's intro, the before-the-video sentence, the Whistleblower
Statutes paragraph with its two reading questions, the physical-barriers
sentence, the Baker-solution replacement, the Mechanism to Effect
instruction (LEVERS_LEAD), the After the Report Arrives lead (one clause
ours, at her invitation: "without compromising the reporter's
confidentiality, the integrity of the evidence, or the fairness of what
follows for the accused"), and the Companies A and B lead sentence
(POLICY_TASK.lead; the olympiad "1." task number deleted on the same
instruction); 2.4.3's pivot intro; 2.4.4's intro and "Explore the below…"
sentence; and the renamed exercise's intro/task/limit lines
(missing-board.ts). One grammatical touch-up, flagged here as the deviation
it is: her "effective implementations whistleblower protections" is
rendered "effective implementation of whistleblower protections", and her
"interactive excerpt" for the AIWI guide is rendered "interactive overview"
because nothing of the guide is excerpted (licence, below). The 2.4.3 key
questions (four) are ours, approved by her before landing.

**Headings renamed on her list.** "The statutory floor" → "Whistleblower
Statutes"; "A broader design standard" → "Broader Standards in AI
Whistleblowing"; "Can the report leave the organization?" → Title Case;
"Four different levers" → "Mechanism to Effect"; "After the report arrives"
→ "After the Report Arrives"; "The Missing Board (8–10 min)" → "Exercise:
From Nuclear to AI Inspections" (time estimate dropped from the title);
2.4.3's "Source packet" heading deleted (her instruction), 2.4.4's dropped
with the same logic since its cards stopped being a packet. PageBreak titles
follow their sections. Her general instruction — capitalize titles,
normalize subtitle fonts — is now a standing note in CLAUDE.md.

**What was deleted on her list.** 2.4.3's one-case framing paragraph and the
"One allegation, four sources" framing paragraph (the Four Sources fold
stays — she deleted the framing, not the exercise); 2.4.2's video moved
below her new intro. All four optional exercises stay.

**Reproduction decisions, per source — her call, recorded here.**

- California Labor Code ch. 5.1 (§§1107–1107.2): a government edict, no
  copyright. Reproduced IN FULL in 2.4.2 inside a SourceQuote, replacing the
  link-out card; text checked verbatim against leginfo this day. Five spans
  are underlined and open pop-up notes of ours (new `StatuteNote`
  component) — each names what a span leaves out (carve-outs, covered
  employee, enumerated recipients, two protected subjects, the equity line),
  serving her two reading questions without answering them.
- CIGIE Quality Standards for Investigations (July 2025): U.S. federal work,
  public domain. The card's blurb now names the four qualitative standards —
  planning, execution, reporting, information management — and a four-bucket
  checklist reproduces each standard statement and lead-paragraph sentences
  VERBATIM (checked against the PDF this day). The three new page-anchor
  URLs joined the existing one in citations.json `pending`.
- AIWI/CARMA Best Practice Guide: no licence grants reuse. Card kept; seven
  checklist buttons carry OUR one-to-two-sentence gists (checked against the
  page this day), never its prose; the one quoted clause is hers, short,
  attributed.
- Wasil et al. (arXiv 2408.16074): arXiv default licence, grants nothing
  (already recorded in the lesson). Card kept; five buttons, our gists.
- Brundage et al. (arXiv 2601.11699): checked this day — ALSO the arXiv
  default licence, not CC BY, so her "embed verbatim" instruction could not
  be followed; card kept, eight buttons, our gists of the eight design
  principles.
- Carlson (Arms Control Association): all rights reserved and not
  list-shaped; card kept unchanged, no grid.

**New components.** `source-checklist.tsx` (SourceChecklist /
SourceChecklistItem): the 2.0.1 MechanismGrid grammar plus the read state
her document asks for — opened items swap Plus for Check and grow a "Read"
word (glyph AND word, no discs), per-visit state only, persisting nothing.
`statute-note.tsx` (StatuteNote): an underlined verbatim span that opens a
few phrases of ours. Both registered in the MDX map.

**Data/widget edits.** whistleblower-levers: LEVERS_LEAD replaced with her
instruction, the widget's appended "each effect is used once" sentence
removed (hers covers it). policy-on-paper: POLICY_TASK gains her `lead`,
loses `n`. missing-board: BOARD_INTRO / BOARD_TASK_LEAD / BOARD_LIMIT
replaced with her copy; station prompts and reveal commentary still ours
pending hers.

### 2.4 second pass: the grids come out, the cards say less (2026-08-18)

The owner's same-day revision of the build above, applied in full:

- **All four checklist button grids deleted** — AIWI's seven, Wasil's five,
  CIGIE's four, Brundage's eight. Her reason on the AIWI one names the
  principle: with the card instructing the same reading, the grid was
  duplicated effort. `source-checklist.tsx` had no other consumer and is
  deleted with them, along with its MDX registrations.
- **The California statute is a link-out card again.** The verbatim
  §§1107–1107.2 embed and its five underlined pop-up notes are gone;
  `statute-note.tsx` went with them (no other consumer). The full statute
  text, checked against leginfo, is in this branch's history if it is ever
  wanted back. The "What the contract clause covers" callout stays.
- **Every 2.4 reading card now says as little as possible** — the read
  instruction and nothing else, on her rule ("read this list, that's it"):
  what to read, where it starts and stops. Cut: every "track / mark /
  identify / record" coaching sentence, and Carlson's "author of 0.3's Iraq
  paper" context line. The After the Report Arrives card keeps its one
  informative clause — the four qualitative standards' names — because the
  lead paragraph promises "four key principles" and the names are the detail
  that must not be lost.
- **2.4.3's key questions are bullets, not numbers.**
- **2.4.1's Table 8 left-column icons are platform red.** The paper's green
  whistle / chat / magnifier PNGs (image9/6/3 in the 2507.15916v2 assets)
  are recolored in place to a monochrome #800000 ramp — white stays white,
  strokes go full brand maroon — which CC BY 4.0 permits. TRAP: these are
  arxiv:build outputs, so a deliberate rebuild of 2507.15916v2 restores the
  green originals; re-run the recolor after any rebuild (a luminance→maroon
  ramp with a 0.92 white cutoff; the one-off script is described here so it
  can be rewritten in five lines). The A.8 figure (image7.pdf.png) was not
  touched — her instruction named the left-column layer images.
- citations.json: the two page-anchor CIGIE URLs the buckets carried left
  `pending`; the plain-PDF URL stays (her After-the-report paragraph links
  it).

---

## 2026-08-18 — 2.1 pushed from the live WIP doc: six drafts replaced by the author's prose

Source: the **live "[WIP] Verification Track Outline"** Google Doc (not the
"outline 11" .docx the entries above were transcribed from), tabs `2.1
Hardware` and `2.1.1` – `2.1.8`, read the day of this entry. That doc now
writes the whole of 2.1 as finished learner-facing prose, which is what
retires open item 3 above ("2.1.0, 2.1.2, 2.1.4, 2.1.6–2.1.8 are still draft
specifications").

### What was replaced

Six bodies were rewritten from the doc, verbatim, and the "Section status:
still in draft" callout is gone from every one of them:

| Lesson | Section | Was |
| --- | --- | --- |
| `hardware-attestation` | 2.1 | outline framing + a draft specification under it |
| `hardware-trusted-statement` | 2.1.2 | draft specification |
| `hardware-measuring-use` | 2.1.4 | draft specification (two halves, A and B) |
| `hardware-where-trust-lives` | 2.1.6 | draft specification |
| `hardware-reconstructing-run` | 2.1.7 | draft specification |
| `hardware-policy-studio` | 2.1.8 | draft specification |

`hardware-claim` (2.1.1), `hardware-accounting` (2.1.3) and
`hardware-authorization` (2.1.5) were **re-checked against the live doc and
left alone** — they were transcribed from the same prose and have not drifted
(mechanical text diff: 0.99 / 0.98 similarity, the remainder being the doc's
duplicated tab titles).

### The two open items the author's own text settles

1. **The 2.1.4 / 2.1.5 overlap (item 1) is gone.** The doc's finished 2.1.4
   has no authorization half — authorization is its own subsubmodule — so
   `hardware-measuring-use`'s "2.1.4B Authorization, licensing, and control"
   block went with the rewrite. Nothing was merged on the author's behalf;
   her current draft simply does not carry the duplicate, and 2.1.5 is now
   the only place the course teaches it.
2. **The doubled opening puzzle and function map (item 2) are gone.** The
   doc's versions are the ones shipping: **seven** conclusions (not the
   specification's eight) and a **six**-row function map (the specification's
   five plus "Establish location and topology"). The specification's
   near-identical versions were deleted with it.

### The puzzle is a control now, not a blank column

The doc prints the puzzle as a table with an empty "Your judgment" column and
the instruction *"Keep your answers. You will return to them at the end of the
section."* A blank column is a page a reader fills in; on screen it is
nothing. So the column is the control: **`<ClaimLedger/>`**
(`src/components/mdx/reader/claim-ledger.tsx`), one row per conclusion, the
three-way scale repeated across it, committed with no key — the same
vt-marks store `<Check/>` and `<VerdictSelect/>` write to, so it feeds no
meter and completes no unit. 2.1.8's "Return to the opening puzzle" prints
`<ClaimLedger recall/>`: the same mark read back, naming the rows left blank,
with the doc's closing paragraphs beside it as the reveal.

The seven claims live in
`src/lib/verification/data/hardware-opening-puzzle.ts` because they are
printed twice and the recall must line up row for row. Option ids
(`supported` / `possibly` / `unsupported`) are storage keys and are permanent.

### Tables

Two of the doc's tables broke under the shared lesson-table rule, which sizes
columns by content and hands the last one all the slack: 2.1.2's prover-profile
table (three columns of running sentences — the middle one came out a word
wide) and 2.1.8's rubric. Both now sit in fixed-layout wrappers alongside the
existing `.pair-table`: **`.trio-table`** (24/38/38) and **`.rubric-table`**
(30/12/58), in `globals.css`. The two-column tables were left on the shared
rule, which is how every other two-column table in the course reads.

### Also in this change

- `v-hw-attestation`'s title is the doc's: **"2.1 Hardware"**, not "2.1
  Hardware: the chip says “compliant”" — that subtitle came from the deleted
  specification. The body's own first heading moved with it (the
  `isLessonTitleHeading` rule), and the comment on `verificationUnitMeta` that
  used it as its example now uses 2.3.
- **Eight new citations, all parked in `pending`.** RFC 9334, the NVIDIA
  architecture page, O'Gara, Rahman/Tajdari, Petrie, Shavit and the ZK paper
  were already registered. The Blackwell and Hopper multi-GPU pages, the H100
  security whitepaper, Cankaya (2606.10724) and the four proof-of-learning
  works (2103.05633, 2108.09454, 2208.03567, 2307.00682) are cited for the
  first time here. **Their bibliographic facts were not verified**: this
  session's network egress blocks arxiv.org and docs.nvidia.com, and the
  registry's own rule is "never promote one unchecked". They are cited in the
  lessons and skipped by the Works cited appendix until someone with network
  writes their fields — that is the next owed thing on this section.
- Removed one **stale `pending` row**, `epoch.ai/blog/algorithmic-progress-in-
  language-models`, which no lesson cites any more. It was failing
  `citations.test.ts` on this branch before this change (the "carries no
  orphan entries or stale exclusions" case), so the suite was red on arrival
  and is green now.

### Verification performed

- `npm run typecheck` clean; `npm run test` **97 files, 1154 tests, all pass**
  (was 1 failing before the stale-citation fix); `npm run lint` unchanged at
  1 error + 67 warnings — the error is pre-existing in
  `src/components/learn/reading-surface.tsx` (setState in an effect) and is
  not touched here.
- `npm run verification:course -- --check` and `verification:memos -- --check`
  both clean (5 modules, 19 units; 10 slots). Neither generator reads lesson
  bodies, so this only says the structure did not move.
- **Driven against a running dev server**, because `importLesson()` swallows a
  bad `contentRef` into `notFound()`: all **nine** 2.1 routes return 200,
  every body renders its transcribed content, and no lesson prints its title
  twice. The browser console is clean across all nine apart from the
  documented signed-out `401` from `/api/verification/state`.
- One hydration error was found and fixed this way: `<Prompt>` renders its
  children inside a `<p>`, so an MDX block written across several lines put a
  paragraph inside a paragraph. The three uses are single-line.
- Visual pass at 1280×900 on the ledger (empty and with a pick), its recall,
  both new table wrappers and the objectives block.

### Still owed on 2.1

- The eight pending citations need their fields written from the sources.
- The doc's own author note — "the required reading should be embedded at the
  point of use rather than assigned as one block" — is still carried as a note
  in 2.1 rather than acted on. The packet is one block.
- 2.1's activities are prose instructions ("trust-chain autopsy", "build the
  authorization chain", "bilateral pilot review", "buy assurance with a
  verification budget"). The doc specifies them as work the learner does;
  none is a widget yet.

## 2026-08-20 — 2.2.1's Appendix B reading slot was an error card on main

Course owner, with a screenshot: *"what's happening here its on main"* — the
last reading slot in 2.2.1 rendered

> Section not found in the pinned paper. · Read the section on arXiv →

**What it was.** `<ArxivSection id="2403.08501v2"
section="ax-sec-observable-data-attributes" sectionEnd="ax-references">`.
`extractSection` resolves both boundaries by id, and that artifact has no id
for its references section, so the whole embed returned null.

**Why only that one.** Nine of the ten committed arXiv artifacts carry
`id="ax-references"` and a toc entry for it. 2403.08501v2 has the class and
neither of the other two, and the reason is in `toc.ts`'s own header:
`stampLandmarkIds` walks **only the root's top-level children**, deliberately,
because split-paper slices at those offsets and that is only safe for elements
nobody has nested. In this paper the bibliography sits inside
`<div class="environment CJK*">` — the converter's passthrough wrapper for an
unrecognised LaTeX environment, here `CJK*`, whose argument `UTF8gbsn` it also
emits as visible text. One level down, so never stamped.

So the authoring was right and works on every other paper; the artifact is
malformed.

**What was done.** `boundaryOffset` in arxiv-paper.tsx: id first, and where the
converter assigned none, the landmark's class. It then cuts at the last
CLOSING tag before the landmark rather than at the landmark itself, because
the only reason that path runs is that the landmark is nested — slicing at the
`<section>` keeps the wrapper's opening tag and ends the slot on an unclosed
`<div>` and a stray "UTF8gbsn". Measured: the slot went from an error card to
612 words ending on Table 4's caption, with no bibliography, no wrapper and no
LaTeX leak. Without the boundary it would have inlined 4,549 words — the
appendix plus the paper's entire reference list.

**The guard, which is the actual news.** This shipped to main with typecheck
and 1,171 tests green, because nothing in the repo walked these embeds.
`src/lib/arxiv/embeds.test.ts` now re-derives every `<ArxivSection>` from the
raw MDX — there is no registry to consult, they are JSX in prose — and asserts
four things per embed: the artifact is committed and `ready`, the section
resolves, the slice leaves no unbalanced `<div>`, and a slice with a boundary
does not contain the reference list. It calls the component's own
`extractSection` rather than a copy, because a copy would drift and pass while
the page failed.

**Open, and NOT done here.** The converter still hides a landmark that an
unrecognised environment wraps, and still passes `UTF8gbsn` through as text.
Fixing it means bumping `CONVERTER_VERSION` and rebuilding every artifact in
the same commit, which renumbers anchors and sentence indices and puts every
`snippet` tripwire in the course in play. That is the author's call, not a
tidy-up: five artifacts carry `environment` wrappers today
(2403.08501v2, 2504.10374v1, 2511.10783v3, 2604.28182v1, 2607.18966v1) and
only this one wraps a landmark.

Not a defect, checked while there: Table 4 in that slot is 2,716px wide in a
940px box and looks cut off in a screenshot. It is scrolling in its own box,
which is the house rule — `document.body.scrollWidth` equals the viewport, so
the page does not move sideways.

## 2026-08-25 — 2.3 built out from the playground draft: six lessons carry the full learner path

The owner's instruction: make 2.3 as good as the other module-2 sections,
using the playground build
(`playground-tracks.netlify.app/verification-module-2-3-intelligence`) as the
source — with the correction, mid-task, that the playground is the old draft
and the module lives in the app at
`/tracks/verification/verification-infrastructure/intelligence-intro`. So this
is a port: the playground's assembled learner path (its data file carries all
prose, exercises, and reading excerpts) transcribed into the six existing
`intelligence-*.mdx` lessons and the house machinery, resolving each lesson's
"Unfinished writing" callout. Nothing here is newly invented curriculum; the
one sentence composed for a cross-reference is noted below.

### What was added, per lesson

- **2.3.0 intro** — the retrieval opener: four `<Check>` blocks (Module 1 /
  2.2 retrievals), verbatim stems, options, and whys.
- **2.3.1 signatures** — the Wasil three-category definition as a
  `<SourceQuote>`; the Power Signature explainer
  (`datacenter-power`, non-bridged widget: facility-vs-national-grids bars,
  training-vs-inference load shapes, the 1.6×/yr decay clock; data from
  Epoch's AI-datacenters CSV as packaged by the playground, pulled
  2026-07-13); the signature-cards predict-before-reveal bench and the Fermi
  bench (`drills-intel-signatures`); the boundary line to 2.2; readings as
  `ReadingCard`s with the playground's page-pinned read lists. The callout
  shrinks to the one still-owed item: distilling the open-sources treatment.
- **2.3.2 anchor** — Baker's irreplaceable-tips passage as a `<SourceQuote>`;
  the four case files as a drill bench (`drills-intel-anchor`, eight
  identified?/resolved? commits with the record as reveals); the Baker
  `ReadingCard` (pp. 14–15, 18–19, plus the §2.3.3 sharing extension). The
  callout is gone: the case briefs are built; the essay task and prompt
  randomizer do not exist in the final playground design — superseded by the
  red-line memo as the module's single written output. Owner can reverse.
- **2.3.3 assessment** — corroboration-across-kinds, the Iraq "dead wrong"
  cautionary beat, and the base-rate teaser feeding the bench
  (`drills-intel-assessment`: false-alarm arithmetic, the Karsu Ridge
  intelligence autopsy with the bias menu, the limitations ledger with
  sibling owners); the bounds-in-sum section (Wasil honest-bounds sentence as
  `<SourceQuote>` + the four-paper convergence and reframe paragraphs); CIA
  Tradecraft Primer as an optional `ReadingCard`. The callout is gone: the
  design supersedes build-a-case-brief-from-a-packet with the autopsy
  (diagnosis) plus the Analyst Desk (full run) — logged here, reversible.
- **2.3.4 institutions** — the NSS-2025 sovereignty-compatibility paragraph
  and the Kissinger disclosure-paradox line (*World Order* pp. 199–201; short
  quote with citation); the dumb-questions battery (three questions, plain
  list — the playground gave them jot boxes; the notebook covers that here,
  a deliberate simplification); the clause-anatomy and who-watches benches
  (`drills-intel-institutions`); the Al-Kibar/Turquzabad
  tips-must-be-checkable beats; Definition 17 and the noninterference article
  verbatim as `<SourceQuote>`s (CC BY arXiv text); and `ntm-redline` — a
  `QuestionWorkspace` widget with the four analysis questions the memo brief
  already referenced ("your four answers"). The callout is gone: the Six
  Layers treatment is written against its named supports and the analysis
  questions exist. One sentence was composed rather than transcribed: "states
  sign what is symmetric, cheap, and checkable" is surfaced in 2.3.4 because
  the owner's memo brief cites it as "2.3.4's rule" and the rule had no home.
- **2.3.5 action** — threshold pricing and strike-is-not-a-rung paragraphs;
  the Analyst Desk (`analyst-desk`, bridged: six signals, ≤2 moves each,
  disposition + confidence + required dissent and blind spot, scored on
  calibration, flat-run detection in the report); the written-output section
  around the existing memo card with the source packet; the annotated
  exemplar in a `<Fold>` (six red-line rows, both model capitals paragraphs,
  five criterion notes — honor-gated "open after you file", since the memo
  desk's state is not visible to lesson content); the ten-item mastery
  checkpoint and three-item closing retrieval as `<Check>` blocks with the
  correctives as whys; the seeds paragraph. The proposed-not-settled callout
  is gone — the memo slot in `memos.ts` has been `specified` by the owner all
  along.

### Decisions a later session should not re-derive

- **The gate's pass-9 mechanic was dropped deliberately.** The playground
  locks step 16 until 9/10; the house has no score gates (nothing
  auto-completes, `<Check>` feeds no meter), so the checkpoint states the bar
  in prose and each miss names its corrective. Same for the cold open
  (playground step 2 serves Desk signal 1 unaided and seals it until step
  13): cross-lesson sealed state has no house mechanism, and the Desk serves
  s1 with full mechanics — not ported, noted here.
- **Kissinger is cited, never reproduced.** The playground packaged two
  *World Order* digests and the full PDF; the book is all-rights-reserved, so
  the packet here cites the book with page locators (pp. 133, 135–136,
  199–201) and reproduces nothing. The two arXiv sources are CC BY 4.0 and
  quoted with attribution-first `<SourceQuote>`s; the PRC Global AI
  Governance Initiative is linked at the MFA's official English page and
  quoted as a government primary. NSS 2025 is named without a link — no
  verified URL was at hand, and a guessed link is worse than none.
- **Exercise ids and storage keys are permanent**: decks
  `drills-intel-{signatures,anchor,assessment,institutions}` (progress under
  `v-drills:<deck>:v1`), `analyst-desk` (`v-analyst-desk:v1`),
  `ntm-redline` (`v-ntm-redline:v1`), `datacenter-power` (stateless), and the
  `<Check>`/`ReadingCard` ids (`intel-opener-*`, `intel-gate-*`,
  `intel-close-*`, `intel-{wasil-ntm,miri-appendix-d,baker-appendix-e,
  cia-tradecraft,miri-definition-17}`) on the vt-marks store.
- **Estimated minutes** now follow the playground budget: 10/35/25/30/40/90
  across 2.3.0–2.3.5 (was 5/10/5/5/5/90).
- Headings across the six lessons were conformed to Title Case per the
  standing 2026-08-18 instruction.

### Still owed on 2.3

- The open-sources card's dedicated treatment, still to be distilled (the one
  surviving callout).
- The extension menu was not ported: the locating-compute feasibility cards
  (built in the playground over Scher & Thiergart's table, with the
  evidence-critique micro-task) and the debate protocol are real designed
  material with no home yet — porting the cards as a widget is the natural
  next piece.
- The seeds paragraph promises returns in 3.1/3.2 and the 4.1 unseal; modules
  3–4 are still title-only, so those hooks land when their prose does.

### Verification performed (2026-08-25)

- `npm run typecheck` clean; full suite **100 files, 1179 tests, all pass**
  (the widgets registry⇄MDX parity test was red mid-build until every
  registered exercise was embedded; the citations tests forced the PRC MFA
  registry entry and caught the Epoch cite dropped with the old callout —
  restored in the widget lead-in). `npm run lint`: 0 errors (the nine
  unescaped-quote errors in the two new widgets were fixed); warnings
  pre-existing.
- `verification:course -- --check` and `verification:memos -- --check` clean.
- **Driven against a running dev server**: all six 2.3 routes return 200 and
  render, console clean apart from the documented signed-out 401. The Analyst
  Desk was driven through a full signal (moves → reveal → disposition →
  three records → commit → debrief → next signal). Visual pass at 1440px on
  the opener, power widget, benches, treaty workspace, memo card + packet
  (the packet list takes the house 4-item slab treatment — deliberate,
  documented in app-bridge.css), the exemplar fold, and the checkpoint.

## 2026-09-01 — the 2.2.1 fix above reaches main

The entry above was written on the shared verification branch on 2026-08-20;
the fix (`boundaryOffset` in arxiv-paper.tsx plus `src/lib/arxiv/embeds.test.ts`)
shipped there and never crossed, so main kept rendering the error card the
owner had screenshotted. Ported verbatim in this change, guard test included:
main's 2403.08501v2 artifact still carries `ax-references` only as a landmark
class, so without the fallback the embed still resolved to nothing.

## 2026-09-01 — 2.3 owner review, first pass

Owner instructions on the preview, applied:

- **The submodule is "2.3 Intelligence"** — the ": watching without
  permission" tail is gone from the app title; the static site's unit list
  already said just "Intelligence".
- **The intro's two vocabulary PopUps and the whole Retrieval Opener are
  deleted** ("delete those, delete retrieval"). The intro is now the six
  transcribed paragraphs and nothing else. The four opener Checks' vt-marks
  keys (`check:intel-opener-*`) are orphaned, not reused.
- **2.3 budgets eight hours, by instruction** ("2.3 total is 8 hours should
  be — if it's less we are not doing it right"), with the red-line memo
  assumed at two hours on the memo desk. Minutes now run
  10 / 75 / 60 / 80 / 75 / 180 across 2.3.0–2.3.5 (the 180 is 120 for the
  memo plus the Desk, exemplar, checkpoint and closing).
- **The Power Signature's facility caption sits below the chart**, not
  between the picker and the bars.

## 2026-09-01 — the four unported exercises land, and 2.3 goes em-dash-free

Owner instruction on the preview: "adapt to style guides of our platform and
port." All four remaining designed exercises from the playground are now in,
house-styled:

- **The feasibility cards** (`locating-compute`, unbridged, in a
  "Optional: The Feasibility Cards" fold at the end of 2.3.1). The full
  37-row Locating Compute Building Blocks table from Scher and Thiergart
  (arXiv 2506.15867, appendix pp. 67–80) was converted mechanically from the
  playground data file, row text verbatim. The engine is the playground's
  commit-then-compare contract: rating and timeline on the report's own
  scale, one rotating visible-reasoning prompt (assumption / cooperation /
  red team), reveal with their note and previous work, argued pushback
  required on any disagreement, calibration tally plus the two-blocks-to-fund
  synthesis, and a copy-all export. Two decks: the eight-card intelligence
  slice and the full table as the extension run. Unbridged per the
  theories-of-change precedent: an optional fold must never gate the lesson.
- **The cold open** (`cold-open`, bridged, closing 2.3.0). Desk signal s1
  served unaided: disposition plus confidence, committed and sealed under
  `v-intel-cold-open:v1`. The Analyst Desk's s1 debrief unseals it beside
  the informed call (the mechanism-sort seal-and-unseal pattern, across
  lessons via the storage key). The playground's step-2 beat, previously
  dropped for mechanics, now ported.
- **The debates** ("Optional: The Debates" fold in 2.3.5, before the
  checkpoint). The module page's six staged controversies transcribed with
  their sources as links, plus the design's solo protocol (two-sided memo:
  steelman both poles, commit a position, name what would move you). The
  fourteen debate sources are new citations-registry entries, several of
  them the very public readings the owner asked after: Robb–Silberman, CRS
  R41201, Krass, Kimball, the IAEA Bulletin imagery piece, NTI societal
  verification, CNS Eyes on U, the Times of Israel shutter-control case,
  Horowitz and Kahn, and the Hatz systematic review.
- **The draft-from-scratch variant** of the NTM article: one Optional line
  in 2.3.5's Written Output, from the extension menu.

Also in this pass, per the standing 2026-08-20 rule: **the em-dash sweep of
2.3's authored copy** — all six lessons plus the module's widget and data
files, roughly 290 occurrences rewritten with commas, colons, semicolons,
parentheses, or shorter sentences, with a hand pass over every conversion.
Verbatim reproductions keep their punctuation: SourceQuote bodies and the
source-faithful feasibility-table rows. The rest of the course's older files
still carry em dashes and are out of this sweep's scope; they sweep as they
are edited. The intro's estimate rises to 15 minutes for the cold open
(2.3 now budgets 485).

## 2026-09-01 — the recommended public readings are carded

Owner approval ("sure you can add it") on the recommendation list. Ten
public sources join the module, all as Optional reading cards or inline
links, all in the citations registry, none counted in the eight-hour core:

- 2.3.1 Overhead Imagery: FAS, Tracking Hyperscale AI Data Center Growth
  with Satellite Imagery (2025), with Epoch's Frontier Data Centers Hub
  announcement and methodology linked as the tradecraft companion.
- 2.3.1 Thermal: the HotSat name-check now links SatVu's published thermal
  image of a live US datacentre.
- 2.3.1 Procurement: Epoch's Diversion and Resale smuggling estimate
  (median ~660k H100-equivalents through end 2025), with the two CNAS
  pieces linked for the institutional side.
- 2.3.2: the ISIS imagery briefs, verified to the exact documents before
  carding: Albright and Brannan's Al Kibar Extraordinary Camouflage report
  (May 2008 PDF) with the Turquz-Abad Atomic Warehouse brief (Nov 2018)
  linked inside. The Baker card stays first; the ISIS card is optional.
- 2.3.3: Heuer's Psychology of Intelligence Analysis (CIA CSI, free full
  text), the cognition primary the design's gaps list said was owed; and
  the "dead wrong" phrase in The Progression now links the Silberman–Robb
  WMD Commission report it comes from. The SSCI 2004 report is deliberately
  not linked: no URL was verified, and a guessed link is worse than none.
- 2.3.4: the two papers the module quotes constantly finally get cards:
  Six Layers (read Layer 6) and Scher and Thiergart (the source of every
  feasibility rating and of the feasibility cards' table). The bare
  Six Layers bullet is gone; the Baker §2.3.3 bullet stays.

## 2026-09-01 — the redundancy pass: eight cuts, owner-approved

A pedagogy audit ("think hard about what needs to be deleted") followed by
owner approval of the full list. The test applied: does the item make the
learner think, or re-hear something from one scroll ago?

- **Closing Retrieval and the seeds paragraph are gone** (2.3.5). All three
  items were third-or-fourth same-page exposures of things the checkpoint
  had just tested; same-page "spacing" is not spacing, and /review is the
  platform's real spaced system. The seeds paragraph promised 3.1/3.2 hooks
  that do not exist yet. Orphaned vt-marks keys: check:intel-close-*.
- **The five signature-cards are gone from the 2.3.1 bench; the Fermi bench
  stays.** In the playground the cards were the catalog; in the app the
  prose catalog sits one scroll above, so the prediction was 30-second
  recall and the reveal a re-paste. The anatomy keeps its real tests
  (ledger, desk, checkpoint). Deck retitled "Drill Bench: Power to Compute";
  the id drills-intel-signatures is permanent and unchanged, so progress
  keys survive.
- **The Dumb-Questions Battery is gone** (2.3.4). Two of its three questions
  were answered by the same page minutes later; the survivor ("what breaks
  if tips must be public?") is now an optional fifth question in the
  ntm-redline workspace, so the memo brief's "your four answers" stays
  exact: four required, one optional.
- **Two checkpoint items cut** (sibling-cloud, human-layer): ledger rows
  verbatim, same options and explanation. The checkpoint is eight items;
  the bar line reads seven of eight.
- **The Wasil SourceQuote in The Bounds, in Sum is gone**: the paragraph
  under it quotes the same sentence, and the ledger carries it a third time.
- **Debate 1 is gone** (not a debate: the paragraph handed the resolution,
  and the refs-eval flagged the existing six for exactly this). Five
  debates remain, renumbered. Its Lowenthal citation was orphaned and its
  registry entry removed. Candidate swap-in, not done: verification-primacy
  versus political-primacy from the refs-eval's new list.
- **Design vocabulary rewritten off learner pages**: "the module's boundary
  contract" (three places), "the arc is the spacing instrument," "a
  deliverable, not a warm-up." Same category as the banned Bloom labels.
- **Trims**: Recording What You Did Not Resolve is two sentences (the desk
  enforces the discipline with lints; prose that pre-explains the exercise
  is scaffolding); the Epoch hub-announcement link is gone from the FAS
  card (methodology and dataset links remain), its registry entry removed.

Net: about 1,000 words and ten redundant exercise items off the module.
2.3.1 drops to 70 minutes; the module still budgets 480. Checked and kept,
so the next pass does not re-litigate: the four-families section (the
collection map keys on it), the desk's reference drawer, the cold open,
autopsy, ledger, clause and who-watches benches, and the exemplar.

Still open, owner's call: the last Unfinished-writing callout (2.3.1
open-sources card). It is an IOU for distilling "Signals in the Noise"
(arXiv 2606.20610), named in the module draft but dropped from the in-app
transcription. Either distill that paper into the card and delete the
callout, or delete the callout and accept the short card as final weighting.

## 2026-09-01 — the em-dash sweep is reversed, on the owner's ruling

Owner: "I want everything to be grammatically correct; changing em dashes
should be a stylistic choice, not a feature." That reverses the 2026-08-20
no-em-dash rule recorded on the shared branch (its module-0 log, "The
owner's 0.1 batch"), which this module's sweep had been enforcing. Em dashes
are permitted; removing one is a per-sentence editorial judgement, never a
mechanical pass.

Every surviving conversion from the 2.3 sweep is restored from the recorded
before/after pairs: 246 line conversions plus 49 hand-fixes reversed, and
the Iraq-estimate sentence restored by hand. Not restored, deliberately:
lines that no longer exist (the redundancy cuts) and the sections rewritten
in that pass, which were composed naturally rather than converted. The
companion change on main restores prevention.mdx's four lines from PR #55.

## 2026-09-01 — the 2.3.1 open-source IOU is closed by deletion

The playground spec's OSINT bullet carried a pointer: "a dedicated treatment
now exists (*Signals in the Noise*, arXiv 2606.20610) and should be distilled
before this card is finalized." The lesson's "Unfinished writing" callout was
that IOU (the parenthetical naming the paper had been dropped in
transcription, so the callout pointed at a paper it never named).

Read before deciding, the paper is the neighbouring problem, not this card's:
*Signals in the Noise: Open Source Intelligence (OSINT) for AI Loss of
Control Detection* (Bollinger, Aboserie, Coakley, Lee, and Mathlouthi — AI
Governance Taskforce at Arcadia Impact, 2026) applies OSINT to detecting AI
systems operating beyond human oversight — transcript collection of
user-reported behaviour, infrastructure correlation for unexpected
connections or replication, output analysis for capability concealment. The
card is OSINT for state-run undeclared development. Method family overlaps;
target does not.

Owner, shown the paper's actual scope: it is not needed there. The callout is
deleted; the open-source card stays deliberately short and hedged, classed
with the supplemental mechanisms as *Six Layers* has it. Nothing else moves —
the callout carried no links, so the citations registry is untouched.

## 2026-09-01 — the 2.3 written output is re-commissioned, on the owner's instruction

The owner re-scoped the module's written output in review: three hours, with
internet research as part of the task, and the genre changed from red-lining
treaty text to the memo a notional RAND sponsor would actually commission —
an overview of the intelligence mechanisms that exist today for telling what
is happening in AI training. Her definition of the reader, verbatim in
intent: someone trying to understand what we can actually track, and what we
cannot.

What changed, and where everything went:

- **The memo slot** (`memos.ts`) is now "What we can see today": survey the
  mechanisms, one honest sentence each on what it establishes and what
  defeats it; at least three self-found public artifacts from the last two
  years, cited by link; bottom line first (the two mechanisms you would
  weight most); end on the worst blind spot and which other layer covers it.
  900 words, peer-reviewed, five new criteria. The slot id was renamed
  `m2-3-ntm-redline` → `m2-3-intel-overview` — safe only because the branch
  is an unmerged preview and no learner drafts exist under the old key; on a
  shipped surface the id would have been permanent.
- **The red-line did not die; it went home to 2.3.4.** The workspace was
  always there; the source packet (MIRI mark-up text, NSS 2025, PRC GAIGI,
  Kissinger), the draft-from-scratch option, and the annotated exemplar fold
  moved from 2.3.5 to sit directly under it, with seam edits only ("After
  you file" → "After you commit"; the rule line now says the exemplar, not
  the written output, tests your answers). Every packet link moved with its
  text, so the citations registry needed no change.
- **2.3.5's Written Output section** now carries the commission and a packet
  of the module's four papers plus the open web. Cross-references retargeted:
  2.3.2's sharing extension "feeds 2.3.4" (not the memo), 2.3.4's two
  carry-this-forward lines point at the mark-up below, and the who-watches
  drill kicker likewise.
- **Time**: `v-intel-action` 180 → 240 minutes; the module totals 540 (nine
  hours), above the owner's eight-hour floor. Generators re-run
  (`memos.js`, `course.js`).

The constructive-alignment note: the spec's Create-level objective was
two-part — draft the NTM article, and produce a monitoring-recommendation
memo naming residual blind spots and their sibling owners. The written
output now examines the second part; the first stays examined by the 2.3.4
workspace and its exemplar, un-graded.

## 2026-09-02 — 2.4 folds into 2.3, and 2.3 is reorganised by collection discipline

Course owner, in review, after the literature check: the four core papers keep
human sources inside the intelligence-based family (Wasil files whistleblowers
under national technical means; *Six Layers* makes national intelligence one of
its three personnel-based layers, §4.3; Scher and Thiergart's intelligence
block carries HUMINT; Baker pairs agency tips with whistleblowers), so the
human layer is read inside 2.3 rather than as a submodule of its own. The new
spine is the collection map's disciplines, one section each, with the human
layer as the HUMINT sections and the access-dependent remainder placed at the
end of the walk. Everything the owner ruled out is in git at `9b329f2a`, the
last commit before this one.

The owner's rulings, applied one by one:

- **Structure by discipline**, head first: what intelligence-based mechanisms
  are, plus the collection map. Then OSINT, IMINT/GEOINT, MASINT, FININT,
  SIGINT, CYBER, the human layer, audits and inspections, assessment, and a
  closing section that is a summary and the memo.
- **FININT is the eighth discipline** (owner: yes). The collection map gains a
  card; financial intelligence is the field's highest-rated stream (Scher and
  Thiergart: High, under a year) and was missing from the seven.
- **IMINT and GEOINT read as one section**: the AI-verification literature
  says "satellite imagery" and never separates them.
- **The empirical anchor section is deleted** (owner: the IAEA cases are
  already covered in earlier modules — precedents.mdx). Baker's finding
  survives as one paragraph at the head of the module; the case-files drill,
  the Baker reading card, and the caveats section go.
- **Intelligence institutions and treaty design is deleted** (owner: "this
  has no place in 2.3"). Definition 17, the NTM red-line workspace, its
  exemplar, the sharing/protection/architecture sections, and the
  clause-anatomy and who-watches benches go with it. Where that material
  should live, if anywhere, is an open question for the owner.
- **The Analyst Desk is deleted** (owner: throw it out; the last section is
  only a summary and the memo). The Cold Open goes with it — it existed only
  to be unsealed at the desk.
- **Assessment stays**, checked against modules 0 and 1 for repeats: the
  1991 Iraq nuclear program is theirs; the 2002–03 Iraq WMD estimate, base
  rates, Heuer, and the false-alarm arithmetic are not, so nothing was cut.
  The feasibility-cards fold moved here from the old signatures section.
- **All of 2.4's material and exercises are preserved** (owner: "I still want
  to keep our exercises and materials from 2.4"). The four lessons keep their
  files, slugs, exercises, and unit `2.4` in the join — so learner progress and
  the skill map's rung tags survive — and renumber to 2.3.7–2.3.10. The old 2.4
  intro's paragraph and objectives block now open 2.3.7; seam edits only ("In
  this module" → "In this part of the module"; the objectives scope reads "the
  human layer"; 2.3.10's "final section of this module" → "final section on
  the human layer").
- **No source packet for the memo** (owner: it does not exist; learners use
  the course or search). The packet list is gone from the written-output
  section; the brief's red-line sentence is replaced. The GAO report the owner
  approved (GAO-23-105698, *U.S. May Face Challenges in Verifying Future Treaty
  Goals*) is a reading card beside the desk, as the genre done for real.
- **The mastery checkpoint drops the NTM-obligations item** (its material left
  the module) and is seven items, six the bar; the remaining correctives point
  at the renumbered sections.

New text is assembled from what the module already carried plus verbatim
passages from the two committed artifacts: *Six Layers* §4.4's OSINT entry and
§4.3.1's national-intelligence paragraph, the MIRI draft's transmission-lines
passage (Appendix D) and its "fund pilot verification efforts using open-source
intelligence or satellite data" recommendation, and three rows of Scher and
Thiergart's locating-compute table from the ported data (FININT, underground
construction, cyber operations and communication surveillance). SIGINT and
CYBER are reading sections and say so: the AI-verification literature gives
them a sentence each. A CYBER exercise is still to be discussed with the
owner. OSINT harvest, for the record: Wasil treats no open-source method
(customs data is the nearest) and Scher and Thiergart's table has no OSINT
row; the OSINT section states that rather than papering over it.

Minutes: head 20; OSINT 25; imagery 25; MASINT 40; FININT 20; SIGINT 10;
CYBER 10; insiders 35; reporting 60; audits 30; institutions 25; assessment
80; summary and memo 200 — 580 in all. Exercise ids and storage keys of every
kept widget are unchanged; the five removed widgets are unregistered and their
files deleted. Citations: the PRC GAIGI entry left with the packet that cited
it; the GAO entry is new.

## 2026-09-02 — consistency pass: the human layer is addressed as 2.3 everywhere

Course owner, on the merge above: the human layer must be addressed as part
of 2.3, not as a layer that happens to sit inside it — check consistency. The
sweep found the footprint of "2.4" well beyond the four lessons:

- **The unit folds too.** The four human lessons now join unit `2.3`
  (`verificationUnitOfLesson`); unit `2.4` and its meta row are gone, and
  course.js draws one unit. Cost, stated: a static-site learner who had
  marked unit 2.4 complete keeps an inert id in their store — app progress
  is per lesson id, and none of those changed. Skill-map rung tags on `2.4`
  retag to `2.3` in both `data/skills.js` and its TS mirror (`incentives`,
  `confverif`, `human`); the compound rung is `2.1–2.3` over three buckets;
  the map's `rev` and `SKILLS_REV` bump to 3 together, as their comment asks.
- **A dead link.** 2.0.1 (`mechanism-privacy.mdx`) pointed "Module 2.4" at the
  retired `human-intro` slug — a 404 since the merge. It now sends readers
  to 2.3's human-layer sections at `human-insiders`.
- **Widget chrome and drill copy** carried the old numbers: the eyebrows
  "· 2.4.1" to "· 2.4.4" in the insiders and reporting widgets and the
  policy labs; the missing-board and policy-on-paper reveals; the limitations
  ledger's sibling-owner option "2.4 human layer" (now "the human layer,
  2.3.7–2.3.10") and a reveal that still scored against the Analyst Desk;
  the assessment deck's own "2.3.3" intro. All renumbered.
- **The lessons address themselves by number**: 2.3.7's opener reads "In
  2.3.7–2.3.10, you will learn…" with the objectives scoped to those
  sections; 2.3.10 opens "In 2.3.10, the last of the human-layer sections";
  the head says the human layer is read "here, as 2.3.7–2.3.10".
- **Module 2 has three buckets now**, and its summary says so. The capstone
  briefs that named "Verification 2.4 — the human layer" as a prerequisite
  name "Verification 2.3 — intelligence and the human layer"; the ones that
  said "the four layers" of Module 2 say "the evidence layers" (label
  `Verification 2.x — the evidence layers`); the whistleblower brief's
  "Module 2.4 says…" reads "Module 2.3's human-layer sections say…". The bank
  is regenerated from the briefs. The context distiller's "2.4.1"/"2.4.4"
  are sections of the fictional system card it distills, and stay.

## 2026-09-02 — second consistency pass, on the owner's "go through everything again"

A wider sweep than the first: retired slugs and ids (none left), retired
concepts, every `2.3.N` pointer in every lesson and data file of the course
(all resolve to the new map; the context distiller's `2.3.4`–`2.3.6` and
`2.4.x` are sections of the fictional system card it distills and stay),
layer-count copy in the app pages and static scripts, the guidance files, and
a full-page render of the head, 2.3.7 and 2.3.12. What it found:

- The skill map's history rung still read "Empirical anchor: what national
  intelligence found…" — the section is gone, the finding is in the head;
  the label drops the section name.
- The ISIS citation's registry blurb called the brief "an underlying
  document of the module's case files"; it is now the imagery card
  practiced on a real undeclared site.
- The About page listed Module 2 "across the hardware, cloud, intelligence
  and human layers"; it now says the human layer is read inside intelligence.
- Three static-script comments (platform.js, map.js, notebook.js) still
  described the compound rung as `2.1–2.4` filling by quarters; the code
  reads `compoundRung`/`compoundUnits` from skills.js and needed nothing.
- CLAUDE.md's Title-Case note named "Module 2.4" as the conformed module; it
  now names the former 2.4 as 2.3.7–2.3.10.
- The collection map's language-and-records family is five cards since
  FININT joined; in a four-column grid the fifth sat alone on a second row.
  The family grids now take five and three columns respectively.

Left alone, on purpose: `data/exercises.js`'s orphaned `ex-evasion` table
still names "these four layers" — its own four columns (hardware, cloud,
intelligence, human) feed the capstone red-team table, and collapsing them
is a content decision for the owner, recorded here rather than made.

## 2026-09-02 — task statements rewritten as tasks, on the owner's instruction

Course owner, on 2.3.10's standard-of-proof exercise ("One allegation. Four
dockets — the evidence in front of an institution, and the institution
holding it."): the phrasing is bad, and every task in the module is to be
formulated the way a task-setting centre would formulate it — what is given,
what to do, what counts as done — with no fragments for effect, no
unexplained metaphors, no nonsense terms. The pass covered every exercise
the merged 2.3 embeds — data files, widget copy, marking key, lesson
lead-ins, checkpoint correctives, and the memo brief.

What changed, by exercise:

- **Standard of proof**: "docket" (a court-calendar term used to mean a
  case) is gone from the data, the widget, and the marking key; the intro
  states the setup plainly (one allegation received four times, each case
  pairing evidence with the institution that must act on it); the task is
  "choose the institution's next step, then justify it in three parts"; the
  reveal states the hidden 2×2 in plain words; case titles read "Converging
  evidence" and "A single channel". The code identifiers followed
  (`PROOF_CASES`, `ProofCase`).
- **Missing board**: "Aim for around a few sentences" became "two to four
  sentences per station"; the finder and judge prompts say whose part is
  being cast; the closing prompt and the strain prompt are plain questions.
- **Construct a case**: the reveal kickers are "Failure point: …"; the
  heading "Where a report can die" is "Where a report can fail".
- **Inspection order** (policy labs): the instruction names Project Lattice
  and says what to decide instead of "set the ceiling imposed by access".
- **Drill benches**: the Fermi bench drops "Derive, never plug in" and
  "Derive it; don't receive it" for "work the numbers out yourself;
  reference values appear only after you commit"; the assessment deck drops
  "prices the base rate", "places every bound with its sibling owner",
  "canonical failure case", "the bias menu's words", and "calibrated
  verdict" for plain statements of the same tasks.
- **Feasibility cards**: the widget's eyebrow and paragraphs, the lesson
  fold, and the red-team prompt say what to do in order ("commit a rating
  and a timeline with a short reason before the field's rating is shown,
  then compare").
- **Lead-ins and the memo**: the power-explainer lead-in drops "the decay
  clock running against the whole signature"; the assessment lead-in drops
  "a question the module refuses to answer for you"; the written-output
  lead-in and the memo brief are stated as tasks (the brief also lists human
  sources among the mechanisms, since the human layer now sits in 2.3); two
  checkpoint correctives drop "beat" and "carries this exact trade".

Explanatory reveal prose (the missing-board commentary, the drill reveals,
the power explainer's captions) was left in its register: it explains,
it does not set a task. The same pass has not been made over modules 0–2.2.

## 2026-09-02 — the red-line packet's sources are gone with it

Owner, reading the 2026-09-01 packet entry above ("Kissinger's World Order is
cited with page locators…"): if the module does not use Kissinger, it must
not cite him. Checked against the live content after the deletions: no
lesson, data file, widget, memo brief, or citations entry in 2.3 names
Kissinger, *World Order*, NSS 2025, the PRC Global AI Governance Initiative,
Gottemoeller, or Glaser. They were the source packet of the red-line memo and
left with the institutions section; the entry above stands as the record of
what that packet was. The one historical example that remains in the debates
fold — the Niger forgeries, as the standing warning that shared documents
might be fake — is Baker's point and is cited to Baker.

## 2026-09-02 — the collection map is labelled the way the references label it

Course owner, on the map's copy ("Eight ways a watcher sees… those that
collect language and records, and those that collect physics"): this is
model-speak; look at how such taxonomies are labelled where people wrote the
text. Checked against three human-written references: the Naval War College
library guide ("There are five main ways of collecting intelligence that are
often referred to as 'intelligence collection disciplines' or the 'INTs'"),
the ODNI definitions of the disciplines, and Clark's *Intelligence
Collection*, whose Part I is "Literal collection" (OSINT, HUMINT, COMINT,
cyber) and Part II "Nonliteral collection" (imaging, radar, MASINT) — the
division the map already used under invented names. The map is now titled
"Intelligence collection disciplines", its lede states the division in
Clark's terms and credits him, the family labels are "Literal collection" and
"Nonliteral collection", the card definitions follow the ODNI/NWC wording
(SIGINT as COMINT and ELINT; MASINT as technically derived intelligence other
than imagery and signals; GEOINT as the analysis and visual representation of
activity on the earth; FININT as intelligence gathered from the analysis of
monetary transactions), the field labels are "What it collects" and
"Limitations", and the legend is an instruction. The head lesson's section
and the closing summary line use the same terms.

Owner, same day, on the relabelled map: do not credit Clark — the
literal/nonliteral division is standard across textbooks. The attribution is
removed from the map's lede, the head lesson's section, and the closing
summary; the division and its labels stay.

## 2026-09-02 — 2.3.4 gets the Basel Institute material

Owner: the Basel Institute on Governance has good material on this; and add
a section saying that if you want to spend more time on it, the Institute
runs free interactive online courses, with links. Two optional reading cards
(*Quick Guide 15: Following the money*, 1,068 words, ~5 min; *Quick Guide 19:
Offshore structures and beneficial ownership*, 2,191 words, ~10 min — both
measured from the PDFs) and an "Optional: Going Further" section pointing at
Basel LEARN's Operational Analysis and Source and Application of Funds
courses and the platform. Five citations-registry entries. The IMF and
Egmont FIU overviews proposed earlier are not used.

## 2026-09-02 — three readings from the owner's "find new OSINT articles about AI" ask

Owner, on the general-method readings proposed earlier: no 62-page RAND
report in OSINT, and the pages should be about OSINT for training runs and
AI specifically — find new articles by respected people. Searched; the
owner placed what survived: Epoch AI's *Introducing the Frontier Data Centers
Hub* (Nov. 2025, ~1,100 words) goes in 2.3.2 as the imagery method written up
by its practitioners, not in OSINT; the Memphis turbines case (TechCrunch,
18 June 2025: SELC-commissioned aerial photos, 35 turbines; thermal images a
month later, at least 33 running; the July permit for 15) goes in 2.3.3 under
the sentence that already named Memphis; Scher's *Verifying Restrictions on
Frontier AI Research* (arXiv, June 2026; 28 mechanisms, the "Covert projects"
subsection) goes in the head's readings as the newest catalogue. All three
optional, 5 + 5 + 10 minutes. Mercado's 2004 OSINT essay was read and set
aside: history and institutional argument, not method. Considered and not
placed: Rahman, *Does Distributed Training Undermine Compute Governance?*
(May 2026) — awaiting the owner's call after the affiliation check (MIRI
technical governance team; previously Epoch AI); Rahman and Tajdari's
zero-overhead telemetry paper (June 2026) belongs to the hardware and cloud
layers, not here.

## 2026-09-03 — Rahman 2026 placed in 2.3.11, whole

Owner, after a chapter-by-chapter retelling of Rahman, *Does Distributed
Training Undermine Compute Governance?* (arXiv 2605.29359, 28 May 2026;
13 pages, six of them body): put it in 2.3, in the most suitable section,
whole — not the partial assignment (abstract, §1, §4, §5.3, §6, Appendix G)
proposed the day before. It sits in 2.3.11 directly under the bounds
paragraph whose last sentence it measures ("distributed development spreads
compute thinner"): the paper's premise (a frontier datacenter cannot hide
from the grid or the satellite) supports 2.3.2–2.3.3, its evasion (nodes
below the monitoring threshold are invisible to thermal and electrical
means) is the blind spot the memo asks for, and its Appendix G names what
covers it — whistleblowers, financial and procurement intelligence, chip
registries with a memory threshold, challenge inspections coordinated across
the suspected network — while grading bandwidth caps and traffic monitoring
as not holding. Optional, like every paper card in 2.3 except Wasil; 35
minutes, measured from the 8,300 words of body and appendices without the
references. One citations-registry entry. The section's minutes are
unchanged: optional readings are not counted in them.

Registry hygiene found on the way: the Scher 2026 and Scher–Thiergart URLs
sat in `pending` as well as `entries` (parked by the bulk collector before
their entries were written, never removed). The appendix printed them
regardless — it filters on entries and counts only entry-less pending URLs
as waiting — so nothing was hidden, but a URL belongs in one list, and the
two pending lines are gone.

## 2026-09-03 — 2.3.1 gets a fact-checking card and a "Going Further" pointer

Owner: add Research Clinic to OSINT's "if you want to learn more", and an
optional card to an outside resource, GIJN's fact-checking chapter. Both
placed at the end of 2.3.1. The card is *Introduction to Investigative
Journalism: Fact-Checking* (Mariam Elba, Global Investigative Journalism
Network, 26 Nov. 2024), about 2,000 words, 10 minutes, optional: internal
pre-publication checking — annotate every statement of fact with its
source, prefer primary documents, archive links, the fact-checking desk's
questions. gijn.org blocks the build sandbox (Cloudflare challenge, then
connection resets, the Wayback copy too); the text was read through a text
relay and the authorship and date corroborated on Margot Williams's Substack
repost of the chapter ("with permission from GIJN"). The pointer section is
"Going Further", the 2.3.4 format: Research Clinic, Paul Myers's link
library kept since 2003 alongside his training courses, free, a directory
rather than a course. Two registry entries; the registry's entries are
back in URL order (the Rahman entry had been inserted after the Scher one).

## 2026-09-03 — SIGINT merged into cyber; 2.3 is eleven sections

Owner ("Да сливаем"), after the inventory showed 2.3.5 Signals intelligence
as 290 words of prose with nothing to read and nothing to do: the
literature never separates signals from cyber (one row in Scher and
Thiergart, one list in *Six Layers*, both words in Definition 17), so the two
sections are one — "2.3.5 Signals and cyber intelligence", at the cyber
lesson's id, slug and file, 20 minutes (the two sections' sum, until its
readings and exercise are chosen). The SIGINT lesson's two usable paragraphs
moved over: the arms-control NTM precedent (satellites and signals counted
silos and launchers, noninterference clauses) and the sources-and-methods
limit (Baker §2.3.3), which the cyber prose had been restating as "everything
2.3.5 said, with more force". `intelligence-sigint.mdx` and the
`v-intel-sigint` entry are gone (recoverable at 00df3d2c). The sections after
it move down one: 2.3.6 Insiders, 2.3.7 Reporting and protection, 2.3.8 Audits
and inspections, 2.3.9 Institutions, 2.3.10 Assessment, 2.3.11 Summary and
written output. Every cross-reference by number was swept — head lesson,
Objectives scope, widget eyebrows, drill copy, the capstone briefs, the module
1 privacy lesson's link, CLAUDE.md — and course.js and the capstone bank
regenerated. Unit minutes unchanged at 580. Not renumbered on purpose:
`context-distiller.ts`'s `sec` fields (system-card section numbers, not
ours) and the historical outline spec.

Still open for the merged section, per the owner: which reading (Warner's
"Intelligence in Cyber, and Cyber in Intelligence" proposed as the section's
reading, ODNI's "Background: The Analytic Process and Cyber Incident
Attribution" with Annex B as the short second) and which exercise ("Two
capitals" from the Def 17 paragraph; "Natanz through the inspectors' eyes"
from ISIS 2010 and Langner; a Q Model ledger from Rid and Buchanan).

## 2026-09-03 — 2.3.5 gets its reading and its exercise

Owner: Warner as the section's reading, "if it is about the capabilities of
cyber as such — go ahead"; and the exercise is the question itself, "in
bullet points, sketch how cyber could be used in the context of
verification". Placed: *Intelligence in Cyber—and Cyber in Intelligence*
(Michael Warner, ch. 1 of *Understanding Cyber Conflict: Fourteen Analogies*,
Georgetown UP 2017; the free chapter PDF Carnegie hosts, 14 pages, ~6,900
words, 30 minutes), required. Honest note on the owner's condition: the
chapter argues that cyber operations are intelligence in nature and history
(espionage and counterespionage moved into cyberspace intact; common roots in
signals intelligence, computer security and electronic warfare; what is new
is scale and the permanence of data; blown collection ends in a purge, not a
war; spying and attacking were always blurry), and states capabilities in
passing rather than as a catalogue. It is the right frame for the section's
question and not a capabilities text; the card says what to read it for.

The exercise is an `understanding-check` (`v-intel-cyber-uses`, the first in
the Verification track; the platform's write-then-compare card, not
persisted): the prompt asks for five to eight bullets, each saying what is
collected, against whom, and what a finding settles. The sample answer is
eight bullets assembled from sources the module already carries — Scher and
Thiergart's row; Scher 2026 §3.1 (known and unknown targets) and §3.4 (weights
security); Rahman 2026 (the sub-threshold fallback and the very-low rating
for traffic monitoring); *Six Layers* (supplemental mechanisms paired with
inspections); Definition 17 and the NTM precedent; Baker §2.3.3; Warner on
provocation and the spying/attacking line — nothing asserted beyond what
those say, and one gap stated as a gap (Rahman does not rate collection from
inside systems). Section minutes 20 → 45 (prose, the reading, the exercise);
unit 2.3 meta 580 → 605. ODNI's attribution background and Annex B, the
Kello review of Buchanan, and the Stoll and NOVA cards remain proposed, not
placed.

## 2026-09-03 — 2.3.5: Lin is the required reading; Warner moves to optional

Owner, after a search for texts about cyber collection's capabilities as
such: use Lin, make it required, and move the reading about the field's
motivation to optional. Placed: Herbert S. Lin, *Offensive Cyber Operations
and the Use of Force*, Journal of National Security Law & Policy 4 (2010),
the Georgetown PDF; the assignment is Parts I and II, pp. 63–70, 3,443
words measured from the PDF, 15 minutes, required. It gives what Warner did
not: vulnerability, access and payload; easy targets on the Internet and
difficult ones that need close access, with an adversary's important systems
in the difficult class; exploitation against confidentiality versus attack
against integrity, authenticity and availability; and the objectives list
(traffic read for keywords, his examples "nuclear" and "plutonium";
exfiltration of plans and passwords; network mapping by traffic analysis).
Warner's chapter stays as the optional second card. The exercise's sample
answer gains a ninth bullet from Lin, on access being physical and handing
over to the human layer. Section minutes 45 → 30 (optional reading not
counted); unit 2.3 meta 605 → 590. One registry entry.

Searched and not placed, for the record: Kaspersky's *Equation Group:
Questions and Answers* (2015; CNE since 2001, hard-drive firmware
persistence, the Fanny air-gap worm; pp. 3–22, ~15 min) and the CrySyS
*sKyWIper* (Flame) report's four-page summary — the "capabilities in the
wild" pair, offered and awaiting a word; Rovner's intelligence-contest essay;
Buchanan's *Legend of Sophistication*; Rid 2012's espionage section; the CRS
cyberspace-operations primer. Unreachable from the sandbox: the NRC 2009
report itself (Lin's article is its public account), the ISC 2015 report,
Der Spiegel's TAO article.

## 2026-09-03 — no Kaspersky sources

Owner: "we will not touch Russian Kaspersky." The *Equation Group: Questions
and Answers* report proposed above is withdrawn and is not to be proposed
again; the same holds for any other Kaspersky material. The remaining
"capabilities in the wild" candidates, if one is ever wanted, are the CrySyS
Lab (Budapest University of Technology) *sKyWIper* summary and Citizen
Lab's Pegasus reporting.

## 2026-09-03 — the memo's budget is two hours

Owner: cut the memo to 120 minutes. The slot has no time field; the budget
lives in 2.3.11's Written Output prose ("Budget three hours" → "Budget two
hours") and in the section's minutes (200 → 140; the memo was 180 of them).
Unit 2.3 meta 590 → 530. The brief's length (900 words) and its research
requirement (three public artifacts found by the author) are unchanged
pending the owner's word: they were set against three hours.

## 2026-09-03 — 2.3.1, 2.3.2, 2.3.4 get required readings and exercises; six repetitions fixed

Owner, on the three sections whose minutes had nothing required behind
them: make the readings required, or build exercises on them inside those
minutes. Done both, minutes unchanged (25/25/20). Each card now names the
assigned part, and each part was measured from the page or PDF:

- 2.3.1: FAS, *Tracking Hyperscale AI Data Center Growth with Satellite
  Imagery* — Christina Krawec, 12 May 2026 (the card had said "Federation
  of American Scientists, 2025, 10 min"; the whole piece is ~8,900 words).
  Assigned: Case Study 2 (Colossus feature identification) and the Key
  Takeaways, ~2,900 words, 13 min. Exercise `v-intel-osint-fas`: what each
  of the four sources established (the utility's annotation, the permit, the
  civil-society flight, the October 2025 image) and what none could. GIJN
  stays optional, as placed.
- 2.3.2: Epoch's hub post required (5 min) and now carrying the methodology
  link; ISIS, *The Al Kibar Reactor* required — assigned the introduction
  (pp. 1–3) and "Summary and Lessons" (pp. 28–30), ~2,600 words, 12 min (the
  card had said 15 min for the whole; the whole is ~5,600 words, 24 min).
  Exercise `v-intel-imagery-al-kibar`: the expected signatures and how each
  was hidden, what imagery alone established, what settled it (photographs
  from a friendly service — human intelligence).
- 2.3.4: Epoch, *Diversion and Resale* — Isabel Juniewicz, 29 Apr. 2026 (the
  card had said "Epoch AI, 2025, 12 min"; whole ~4,100 words). Assigned Key
  takeaways through Combined results, ~2,500 words, 11 min. Exercise
  `v-intel-finint-smuggling`: the two evidence streams, and that none of the
  section's named streams (customs, licences, financial intelligence) is
  among them. Basel cards stay optional.

All three exercises are `understanding-check` cards with sample answers
drawn from the assigned pages only. Registry entries for FAS and Epoch
smuggling corrected (author, date).

Repetitions, per the owner's "давай починим":
1. The *Six Layers* national-intelligence paragraph is no longer quoted in
   the head; a sentence states its placement and points at 2.3.6, which
   reproduces §4.3 whole. 2.3.5 now refers to "the paragraph 2.3.6
   reproduces". 2.3.6's intro gains one seam sentence: the third category is
   the layer 2.3.1–2.3.5 just walked; this section and the next three take
   the first two.
2. "Supplemental": the collection map's OSINT card no longer restates the
   *Six Layers* classification, and 2.3.1's lede refers to the module's
   opening instead of restating it. It is stated in the head, summed in
   2.3.10's Bounds, and recapped in Eight Lines.
3. Epoch's method is stated once, in 2.3.2's hub card (with the methodology
   link); 2.3.1's prose and its FAS card no longer repeat it.
4. The ~500-site count is sourced to 2.3.3; 2.3.10's base-rate bullet says
   so. The bench's own use and the recap stay.
5. 2.3.5's two sources-and-methods paragraphs are one.
6. The limitations ledger is named as the memo's middle in draft, in 2.3.10's
   bench intro and in 2.3.11's Written Output.

## 2026-09-03 — the four write-then-compare checks now persist

Owner, on 2.3.5's exercise being the one piece of writing in the module
that was not saved: why. Answer: the platform's `understanding-check` card
was the only ready write-then-compare mechanism and it keeps its text in
the browser; the persisted `writing-prompt` type had no model answer to
show. That trade-off was made silently and was the wrong one for a module
where every other piece of writing is saved. Fixed at the platform level,
scoped to writing exercises: `WritingExercise` gains an optional
`sampleAnswer`, rendered once the learner has submitted (commit before the
answer, the house pattern), in place of the grader card. The four checks
(`v-intel-cyber-uses`, `v-intel-osint-fas`, `v-intel-imagery-al-kibar`,
`v-intel-finint-smuggling`) are now `writing-prompt`s with a sample answer:
drafts autosave, submission is a row, reopen works, signed-out shows the
usual "sign in to save" card. Their ids stay outside the `v-task-` prefix, so
the completion page's list of required written work does not grow: they are
section checks, not the module's written output. The Control track's 33
understanding checks are untouched.
