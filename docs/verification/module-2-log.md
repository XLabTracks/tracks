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

**Sources: the lock comes off the cover (2026-08-14, owner: "А где сурсы").**
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

**The veil loses its panel (2026-08-14, owner: "а чего границы плывут — можешь
без границы просто как тг").** She was right, and what she was seeing was not a
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

**Answer options are shuffled now, platform-wide (2026-08-14, owner: "почему в
тесте почти все правильные ответы Б").** She was reading 2.4.2, where four of
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

**Correction to the entry above, on whose defect this was (2026-08-14, owner:
"это не правда … еще как ты и твои версии виноваты").** That entry said "nobody
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
owner: "режим для слабовидящих не делает все больше anymore it was supposed
to").** `d58c3c0` had removed it: the high-contrast theme used to re-solve the
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

"Перенеси текущее задание из 2.4.4 в 2.4.2 которое про политики вислблоуэров."

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
design: her audit question ("проверь что вот это закрывает") established
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
