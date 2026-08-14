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
