# Module 0 — build log

Running log for the Verification track's module 0 (`v-why`, "Why are we
teaching this?"). Append to it; do not rewrite entries. The point is that the
next session can see what was done, what was deliberately *not* done, and what
is still owed, without re-deriving any of it from the diff.

Source of truth for structure is `src/content/verification/curriculum.ts`.
Source of truth for content is the author's WIP outline. This log is neither —
it is the record of the decisions taken between them.

---

## 2026-08-06 — 0.3.0: all eight case files into the exercise, with diagrams

On the author's instruction, the Baruch Plan (1946) and South Africa
(1989–1993) case files moved from plain reading in `precedents.mdx` into the
`precedent-cases` exercise, making eight cases total. The lesson's "Two more
case files, outside the exercise" section is gone; the exercise is now the
sole carrier of all eight. Every sentence stays the author's case-file text,
verbatim, in `src/lib/verification/data/precedent-cases.ts`; the array was
reordered chronologically (Baruch, IAEA, Antarctic, BWC, INF, South Africa,
CWC, CTBT) to match the author's numbering.

Two mapping judgements the binary forced, recorded so nobody re-litigates
them from the diff:

- **Baruch scores as `circumvented`.** The plan was never adopted, so
  neither "held" nor "circumvented" is literally right; "held" is clearly
  wrong, and the author's own heading ("Why it failed") carries the nuance
  the binary cannot. Same device the six original cases already use.
- **South Africa scores as `held`** under the heading "Why verification
  succeeded" — the regime here is the IAEA's completeness verification, which
  the case text says succeeded.

Each case gained a small reveal diagram
(`src/components/verification/widgets/precedent-case-diagrams.tsx`) sketching
how the regime held or was circumvented. They are reveal material — outcome
information — so they render only after the call is committed, inside the
"why" card. House idiom throughout: hand-rolled inline SVG, theme token
classes only, comply/defect always beside a word; every label restates words
from the case-file text (seals · identifiers · cameras; CargoScan portal;
SS-25/SS-20; Biopreparat; and so on) — no diagram composes a curriculum claim.
Verified in the browser on day and night themes.

---

## 2026-08-06 — outline renumbering: X.X.0 → X.X, timeline game deleted

On the author's instruction, the course's numbering was brought onto the
outline shape where a submodule carries the bare `X.X` number (no `.0`) and
every `X.X.X` nests under it via `sectionItemId`. In this module:

- **0.2.0 "Interactive timeline simulation" is deleted altogether** — lesson
  entry, `v-verification-timeline-game.mdx`, the widget
  (`widgets/verification-timeline-game.tsx`), its data file, and its
  registry/exercises entries. Unit 0.2 is now the intuitions reading alone,
  and its `href` in the generated `course.js` moved accordingly. The
  facilitator guide's four links to the in-app page now point at the game's
  still-live external home (`the-verification-game.netlify.app`) so its
  session plans stand unchanged; with that, the guide has no in-app links
  left, and the link test's canary now asserts over all anchors.
- **0.2.1 → 0.2** (Building verification intuitions), **0.1.0 → 0.1**,
  **0.3.0 → 0.3**. 0.1.1 (prevention) now nests under 0.1 and 0.3.1
  (securitization) under 0.3.

Elsewhere in the same pass: 2.1.0/2.2.0/2.3.0/2.4.0 → 2.1/2.2/2.3/2.4 (see
module-2-log); 1.1.1's drill lesson folded into 1.1's body verbatim (the
outline's "1.1 … (including exercise)" is one unit); 1.0.3 nested under 1.0,
1.2.1–1.2.3 under 1.2, 4.1.1 under 4.1.

Deliberately **not** done, because the outline names content that does not
exist in the graph yet and inventing it is not this change's job: 0.4*
"Strategic Foundations", 1.3.1 "Threat Modeling and Theory of Change", 1.3's
context-distiller exercise, and 3.2.1 "Evasion Scenario Taxonomy Revisited"
(still a heading inside 3.2). Conversely 1.0.3 and 1.2.1–1.2.3 are lessons
the outline does not list — they were nested under their parents, not
deleted; merging or retiring them is a content decision still owed.

## 0.1 and 0.2 retitled, 0.1 cut back to the outline

The outline moved `Introduction: Why Verification?` down a unit, so **0.1 is
now "How the risk looks like?"** and **0.2 carries the introduction title**.
The bodies already matched their new homes — 0.2's reading is AI 2040: Plan A
plus the verification supplement, AI 2027 as the optional, the "what does
success look like" essay, and the three curated readings the outline names
(Baker; Oxford Martin; Scher & Thiergart) — so only the titles moved. The
slugs did not: `introduction` and `building-intuitions` are live URLs and unit
ids are permanent.

That move also explains the dangling `Explore → ai-2040.com` line that had been
rendering as bare text in the middle of 0.1: AI 2040 is 0.2's material, and 0.2
already writes it up with two reading cards. Deleted rather than linked.

**0.1's body was then cut to what the outline lists for it**, on the author's
instruction. What remains, in this order: the Bengio TED talk, the AGI/ASI/RSI
framing paragraph, the `what-do-they-say` profile widget, the optional-material
fold (Atlantic / MIRI's The Problem / Rational Animations, then Four Background
Claims), and the optional task. The author named the paragraph and the widget
as keepers and placed both **after** the video.

Removed in the same edit, and recorded here because none of it survives
anywhere else in the graph — recover from git, not from another lesson:

- "Why is verification important?" — the 1946 Baruch-plan opening and the
  four-option list (trust / punish / transparency / neutral mechanisms). Only
  `scoping-effective-feasible.mdx` mentions 1946 at all, and in another context.
- The misuse taxonomy (cyber, biological, chemical, R&D lead, influence).
- The misalignment taxonomy (unintended goals, compounding through
  self-improvement, no safe owner).
- The 2026 incidents paragraph. 0.0 Welcome now tells those same three
  incidents **with** their sources and the FelonyBench table, so this was a
  second, uncited retelling. It also carried four claims with no source
  anywhere — a 27-year-old OpenBSD bug, four chained vulnerabilities, an early
  version emailing its supervising researcher, and a "too dangerous for general
  release" judgement — plus two errors: it dated the Hugging Face intrusion to
  "the first half of 2026" (the HF timeline calls it the July 2026 incident)
  and attributed it to one escaped model rather than the group of coordinating
  agents that 0.0 and 3.1.1 both describe from WIRED.

Two link fixes in the fold, kept: the Atlantic piece was titled with the
**book's** name; its published headline is "AI Is Grown, Not Built", which is
what the outline calls it too. The Rational Animations essay was the only item
in the list that was not a link, and it is now in `citations.json` (title and
channel verified via YouTube oEmbed; no publication date found, and the
registry allows the field to be absent).

Still owed: the deleted heading "Why are we concerned about the development of
superintelligence?" was the only heading 0.1 had, so the unit is now a single
unchunkable part. It is short enough that this reads fine, but a longer 0.1
would need real headings back.

### Pacing the Frontier added to 0.1

After the `what-do-they-say` widget, on the author's instruction: a short
framing of why pacing matters, four signatory comments from
pacingthefrontier.com, and a reading card for the AI Futures follow-up post.

It sits there rather than anywhere else because the widget is "the labs in
their own words" and this is the same people signing something together —
Amodei, Legg, Sutskever and Leike are all both profiles above and signatories.
The framing paragraph is built from the statement's own two sentences (the
competitive-pressure diagnosis and the ask), quoted, not paraphrased into a
claim the letter does not make.

The four quotes are Sutskever, Sekhon, Schulman and Carroll — chosen for
seniority and for being complete on the page. Dawn Song's and Stephanie Chan's
are truncated behind "Show more" and were left out: a partial quotation is not
a quotation. The signatory count is a live counter, so the prose says "more
than 1,300" rather than the figure at retrieval.

Reuse terms are an open verification-log row, recorded in a comment above the
quotes: pacingthefrontier.com posts none. These are quoted as public statements
by named signatories on a letter published for circulation, which is the
narrowest reading; do not extend it to reproducing the signatory list or the
comment wall.

`https://www.pacingthefrontier.com/` is in `citations.json` because a
`SourceQuote` `url=` is scanned into the Works cited appendix. The AI Futures
post is **not**, and that is the existing convention rather than an oversight:
`ReadingCard` hrefs are not scanned, the card carries its own attribution, and
`ai-2027.com` and Baker's arXiv link in 0.2 are unregistered for the same
reason. Adding an entry for one makes it an orphan and fails
`citations.test.ts`.

## 0.3 checked against the outline, and retitled

**0.3 is now "History, Precedents, Parallels"** (was "Precedents and
Parallels") and **0.3.1 is "Securitization and why AI warrants it"** (was
"Securitization, emergency politics, and ASI"). Slugs unchanged.

The bodies were already there and were verified line by line rather than
retranscribed:

- 0.3.1's six paragraphs match the outline **verbatim**, all six, diffed
  character for character.
- All eight case files in `precedent-cases.ts` match the outline's eight
  entries verbatim across `name`, `tagline`, the outcome heading, the
  historical parallel, why it held or failed, and the AI-transfer note. The
  diff found exactly two deltas, both the deliberate spoiler move the file's
  docstring already declares: the Biopreparat sentence and the North Korean
  detections sentence sit in the reveal rather than the briefing, because the
  learner calls held-or-circumvented before reading the outcome.
- 0.3's third paragraph was an adaptation ("In the case files below, before
  reading how each turned out…"); restored to the outline's own sentence,
  which names the interactive and the count: "In the interactive below, you'll
  open eight case files, and before seeing how each turned out, you'll make
  the call yourself…". Eight is correct.

The docstring's claim that the outline named only six cases for the exercise
is stale and was corrected — the current outline lists all eight, in this
order, each with the same three parts. It also now records the prototype the
outline links (`timely-zuccutto-eed7cf.netlify.app`, "The Verification Files")
as a sketch rather than a spec, so nobody re-derives the widget from it.

Two open items, neither of them ours to close:

- 0.3.1 ends "Section 0.2 begins that work, turning the argument into the
  concrete task of deciding what to weigh and how heavily." That is the
  author's sentence and is transcribed verbatim, but it points **backwards**
  now — 0.2 is read before 0.3. Whether it means 0.2's Plan A stress-test or
  module 1's effectiveness-by-feasibility sort is a content decision.
- The undrafted closer for 0.3 (the outline's "Summarize: what has worked with
  verification in the past, and what hasn't?") is still an author note held out
  of the render at the foot of `securitization.mdx`. Still owed.

### The Pacing the Frontier quotes became a signatory block

`SourceQuote` puts the work first and the speaker last, which is right when
each passage comes from somewhere different and wrong for a signed letter: the
same title and link repeated above all four cards, and the person who said the
words arrived last. `src/components/mdx/reader/signatory-quotes.tsx` is the
shape for this case — `<SignatoryQuotes>` is the block, `<Signatory>` one
speaker. Face, name and role head each card, the words follow, and the work is
named once as a link at the foot of the block. Attribution still precedes the
words; only the source citation moved.

Two columns on `sm` and up, and the card is the what-do-they-say profile card
without its pressable states: hairline on all four sides, `bg-card`, the accent
inside. `SourceQuote` is untouched and still correct everywhere else.

Portraits: Ilya Sutskever reuses the committed Wikimedia portrait the dossier
widget already carries, credited at the block foot with its real
`photoSource` URL. Wikimedia Commons has no freely-licensed portrait of
Jasjeet Sekhon, John Schulman or Micah Carroll — searched, none found — so
those three carry initials, which is the fallback Jan Leike already uses in
the dossier. Do not substitute a scraped press photo.

Trap worth knowing: the portrait credit is a `creditHref` prop rather than an
`<a href>` written into the lesson. `citedUrls` in `citations.test.ts` matches
markdown links, literal `<a href=`, and `url=`, so an anchor in MDX would be
pulled into the Works cited appendix — and an image credit is not a reading.
Anything that is a credit rather than a citation should go through a prop and
be rendered by the component.

Correction to the note above: the three signatories now have faces. Wikimedia
Commons was the only place checked the first time, which was not enough. The
wider search found each of them publishing a photograph of themselves on their
own site, and those are committed under
`public/verification/assets/pacing-the-frontier/` with `SOURCES.md` recording
the file, the URL, the retrieval date and the terms. Terms are `unchecked` on
all three — none of the pages states a licence — so the block credits the
source rather than claiming a grant, and using them is the course owner's
editorial call, the same shape as the RAND reproduction in 2.2.

What was searched and came up empty, so nobody repeats it: Commons has no
portrait of any of the three; Openverse (Flickr's CC pool plus Commons)
returns nothing; Schulman and Sekhon have English Wikipedia articles with no
image and Carroll has no article; pacingthefrontier.com publishes no
signatory photographs. Sutskever still reuses the committed Commons portrait
rather than a second copy.

The initials fallback stays in `Signatory` and is the remedy if anyone
objects: delete the file and the card falls back with no other change.

### The signatory block is back after the 0.1 rewrite

The "Why Should You Care About AI Verification?" rewrite dropped the
`SignatoryQuotes` block, leaving the component and the three portraits with no
consumer. Restored on the author's instruction, in the place the rewrite
actually made better than the original: the rewrite's own prose already
introduces the statement and quotes its ask, and `what-do-they-say` sits
directly above, so the cards now follow the widget as the same people signing
together and lead into "It's clear that ASI is no longer a hypothetical risk."

The framing paragraph I had written for the old placement was **not** restored
— the rewrite's sentence does that job in one line, and re-adding mine would
have said it twice.

Not restored, and still owed a decision: the AI Futures reading card
(*How to pace the US frontier*) went in the same deletion. It is the bridge to
0.2 — same team as AI 2040: Plan A, written against it — so it is worth a home
somewhere, but nobody has asked for it back.

### 0.1.1 replaced with the author's updated text (2026-08-11)

`prevention.mdx` was a draft behind an "Unfinished writing" callout. The
author supplied the finished text ("[WIP] Verification Track Outline-35.pdf")
and asked for a straight replacement, so the callout came out with the draft —
the caveat described a state that no longer exists. The body is the PDF
verbatim, including the opening credit line ("Inspired by …", linked to the
LessWrong post at the author's instruction — the URL came from her, not a
guess; the outline itself carries none). The outline's closing
`[pop-up box: The Risks of Securitization …]` marker became a `<Fold>` on the
author's instruction — first rendered as a `<PopUp>` dialog, then changed the
same day because she wanted it reading as an add-on to the essay when opened,
not a modal over it. No structural change: same lesson id, slug, title and
contentRef, so no course.js regen.

"Securitize" also entered the glossary on her instruction (`securitization`,
autoGloss, aliases covering the verb forms). The definition is stitched from
the author's own 0.3.1 prose — the Copenhagen School sentence — plus the
Fold's own apposition ("treating it as an existential risk and thus a top
policy priority"), not drafted fresh; flag it to her for review anyway, since
glossary copy is curriculum.

## 0.3 becomes "History, Precedents, Parallels" (2026-08-08)

The author delivered the new 0.3 text titled **History, Precedents,
Parallels**. Almost all of it was already live: the eight case files match
`src/lib/verification/data/precedent-cases.ts` verbatim (including the two
documented spoiler-sentence moves — Biopreparat and the North Korean test
detections stay in the reveals, because the exercise is prediction-first).
What actually changed:

- The unit and lesson retitle from "Precedents and parallels" —
  curriculum.ts (both the item and the units map), course.js regenerated.
  The unit id stays `0.3`; ids are permanent.
- The lesson's intro takes the new wording ("In the interactive below,
  you'll open eight case files…"). The outline's `[Insert interactive]`
  marker (prototype at timely-zuccutto-eed7cf.netlify.app) is realized by
  the existing `precedent-cases` widget — noted in an MDX comment so the
  next reader doesn't go hunting for a missing embed.
- Per the author's directive, AI 2040: Plan A is linked as a card
  (`<NextSteps>`) after the interactive — history's parallels land on the
  most detailed public attempt at an AI verification regime. The card's
  detail line reuses the author's own sentence from intuitions.mdx rather
  than composing new copy.

## 0.3.1 Securitization deleted (2026-08-09)

Deleted on the course owner's instruction: "0.3.1 Securitization and why AI
warrants it — delete section completely." What went:

- `src/content/lessons/verification/securitization.mdx`.
- Its `v-securitization` item, its `itemIds` entry and its `0.3` row in
  `verificationUnitOfLesson` (curriculum.ts); `course.js` regenerated.
- The module summary's closing clause, "and the securitization critique met
  head on", which described the deleted lesson and nothing else. Everything
  before it still names a lesson that exists.

Two things deliberately did NOT go with it:

- **The written output.** `m0-compliance-under-anarchy` lived on that lesson,
  but it was never 0.3.1's own — the outline marks it at the end of 0.3.2,
  which is not a lesson the graph has, so it was parked on the last lesson of
  0.3. That is `precedents` now, and the slot moved there. Deleting a section
  is not a decision to drop a written output the outline asks for; if she
  wants it gone too, that is one line in memos.ts and one card in
  precedents.mdx.
- **The concept.** "Securitization" is load-bearing in `policy-scoping` (the
  axis tooltip and a corner argument), in the `drills-foundations` triangulation
  bench, in `drills-games`, in the facilitator guide's two discussion tiles, in
  prevention.mdx's "The Risks of Securitization" fold, and as a glossary entry.
  None of those pointed at the deleted lesson — they teach the term where they
  stand — so all of them stay. Nothing in the repo now links to the removed
  route.

Note for whoever reads this next: `0.3` has no subsections at all now, so it is
a plain lesson rather than a section head, and `item-done.ts`'s `groupDone`
path no longer applies to it.

## The disanalysis task loses its gates; AI 2040 leaves 0.3 (2026-08-12)

Both on the owner's instruction, verbatim: "it's not a test, it's
reasoning", and "delete ai 2040 from here, it's from other section".

- **Read first, then tasks.** The old shape committed Question 1 before the
  paper opened ("you do not get to edit it afterwards"), with minimum
  character counts, per-question Commit buttons, and steps locked behind
  each other. Her "where." caught the false premise — Q1 opened with "You
  have now examined how verification worked in nuclear arms control," but
  the eight case files are quick hold-or-fail calls across every regime;
  the examination IS Baker. So the paper (and her reading map) now comes
  first, and the three tasks — hers, unchanged — sit after it, all visible,
  none gated. Choices render as possibilities to reason between, never
  buttons; Baker's passages sit in Folds beside each task, offered rather
  than earned. The widget holds no state; the exercise is unbridged
  (view-style completion).
- **The AI 2040 card is gone from 0.3.** It is 0.2's material and 0.2
  carries its reading cards; the brief duplicate here is removed.
