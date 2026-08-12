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

### 0.1 reordered on the author's instruction (2026-08-11)

Three moves, all hers, all local-first and browser-verified:

1. **"The Danger of ASI" now opens the part after the video.** The heading
   and its two intro sentences moved below the optional-material fold and the
   strongest-objection exercise. Trap handled: as their own h2 part those
   ~225 characters sit under MIN_PART_CHARS and would merge *backwards* into
   the video page — the opposite of the intent — so "Real-World Harm:
   Dual-Use Capabilities" was demoted to an h3 beneath the new h2. One part,
   opening with the title and intro, Real-World Harm directly after. A
   comment in the MDX says why the h3 must stay an h3.
2. **The "Most notably, over 1,300 employees…" sentence** moved from before
   the what-do-they-say widget to after it, directly above "Four of them, on
   why they signed:" — the Pacing the Frontier material now reads as one run
   instead of being split by the widget.
3. **The "short history of acceleration" fold is gone**, replaced inline by
   the two Our World in Data charts from "The brief history of artificial
   intelligence" (Roser, CC BY, linked in text and in both captions): the
   notable-systems timeline as a committed image
   (`public/verification/assets/owid/ai-timeline.jpg`, provenance in
   `SOURCES.md` beside it) and the test-scores grapher as its live iframe
   embed, per the author's supplied snippet. Both framed in the Fold visual
   language — white chart plate, painted `--primary` caption bar — on her
   "match the site's red" instruction; the chart internals are OWID's own.
   The `short-history` widget thereby lost its only consumer, and
   widgets.test.ts rightly refuses orphans, so it was retired deliberately:
   component, data file, registry row and exercises list entry all deleted in
   the same commit. Its learner state key (localStorage) dies with it.

Also in this commit: `citations.json` gains the LessWrong post 0.1.1 links
(a gap the previous session shipped — citations.test.ts was red on the
branch until now) and the OWID article.

### The 0.1 charts, round two (2026-08-11, same day)

Three corrections from the author on review of the first pass:

1. **The charts are optional again.** They live back inside a Fold —
   "Optional — A Short History of AI Acceleration", her title — not inline.
2. **Red only, theme-aware.** The OWID embeds (their palette, their white
   ground) are gone; both charts are redrawn as native SVG in the restored
   `short-history` widget. Every mark inks from
   `color-mix(in oklab, var(--primary), var(--foreground) N%)` (N ≤ 60), so
   the ramp re-solves per theme — verified on day and night. Series names
   ride on the lines in their own shade per the categorical-colour rule. The
   test-scores data was read back out of OWID's published SVG (pixel→value
   against its own axis); the timeline annotations are OWID's verbatim. The
   committed `assets/owid/ai-timeline.jpg` and the grapher iframe are
   deleted; attribution (CC BY, "redrawn from") sits under each chart, and
   the article link stays in the fold's lead line so the citations entry
   keeps its consumer.
3. **"Real-World Harm: Dual-Use Capabilities" wears the display face.** The
   h3 demotion had dropped it to the body face (app-bridge's deliberate
   sub-heading rule). One scoped exception in app-bridge.css, keyed on the
   heading's rehype-slug id — renaming the heading drops the rule, says so in
   the comment there. Computed style now matches the h2s exactly.

### 0.1 heading hierarchy flattened to two section heads (2026-08-11)

On the author's instruction: "The Danger of ASI" and "Preventing ASI via
International and Verifiable Agreements" are 0.1's only h2s; "What is ASI?"
and "What has AI verification looked like so far?" demoted to h3 beside the
three that already were. Every subheading now visibly reads as one — the
body-face h3 style — so the app-bridge display-face exception for Real-World
Harm (added earlier the same day) is deleted: it existed to make that h3
match the h2s, and the author has now said subheadings should NOT match.
The lesson reads as three parts: Start (video, optional fold, objection
task), The Danger of ASI, Preventing ASI.

A false alarm worth recording: after the demotion the lesson appeared to
stop chunking on hard loads — no strip, no pager, one long page — and only
chunk on client-side navigations. The cause was the Browser pane sitting
hidden: Chromium pauses hydration in hidden tabs, so the reader's
mount-time derivation simply had not run yet. `document.visibilityState`
is the tell. Nothing was wrong with planParts (verified against the live
block list: three parts) and nothing in the reader was changed — a
DOMContentLoaded re-derive guard written while chasing this was reverted
unshipped once the pane, not the code, proved to be the variable.

### Correction: subheadings share the display face (2026-08-12)

The previous entry read the author's "smaller and clear they're subheadings"
as the body-face h3 style. Wrong reading — on seeing it she clarified: same
face as the section heads, only smaller. One family at two sizes IS the
hierarchy. The app-bridge h3 rule now sets the display face at
weight 500 / calc(1em + 6px) — course-wide, every verification lesson's
h3 — while h4–h6 keep the emphasized body-face style for the deeply nested
worked examples. Verified computed: h2 24px, h3 22px, both Space Grotesk 500.

### The test-scores chart answers the pointer (2026-08-12)

On the author's instruction, the redrawn test-scores chart now behaves like
the OWID grapher it was redrawn from: hovering drops a vertical guide at the
nearest year and a tooltip lists every metric's value there — recorded
points at full strength, linear interpolations dimmed, series outside their
run omitted, sorted by value. Verified against the original at 2017: Speech
0.4 / Reading −8.9 exact, Image 9.1 / Handwriting 1.9 interpolated, Language
and Predictive absent — the same rows the grapher shows. Hover state is
ephemeral; nothing persists and nothing completes.

### Misuse/misalignment fold rewritten to the author's new text (2026-08-12)

The fold's body is her replacement verbatim: four misuse bullets (cyber /
bio-chem / military-strategic / influence), three misalignment bullets
(wrong objective / resisting correction / self-improvement), the two arXiv
links carried over with her new link text (same URLs, so citations.json
stands). The old framing paragraph ("Each AI risk can be classified…") went
with the old body — her text opens directly on the misuse definition. Bullet
lead phrases render bold, the fold's existing convention; the label is
unchanged.

## 0.3 gets the document packet; the Baker block stands down (2026-08-12)

The owner delivered the packet with exact-cut instructions per document:
IAEA brochure printed pp. 4/5/7 (fragments joined by […]), Shavit §1.1 in
full (CC BY 4.0), Carlson/ASNO §5.4 + §5.7.2 to her stated endpoint. All
three were extracted from the sources themselves, not retyped: the two
PDFs fetched and read, the Carlson text taken from DFAT's own page via its
archived copy (dfat.gov.au refuses datacenter fetches). One judgement call,
recorded in the lesson comment: her Document-1 cut names the political aim
and the independent-verification role, which live in the page's lead-in
paragraph, so that paragraph rides with the "What are IAEA safeguards?"
section.

She wrote the tasks in two layers: a 13-question bank in four parts, and a
condensed assignment ("Complete Task 5 and any two of Tasks 1–4", word
limits). The lesson renders the condensed assignment as plain prose tasks —
no widget, no gates, per the standing instruction; the full bank is
preserved verbatim in docs/verification/0.3-document-packet-bank.md,
awaiting her call on whether it surfaces (facilitator material, extended
option, or replacement).

The Baker "Drawing the inference" block stood down in the same edit: the
packet's Task 5 is the disanalysis now, and 60 minutes is the section's
whole budget. The widget (nuclear-disanalysis) and its data file stay in
the repo, unmounted — restoring it is one embed line; deleting it for good
is her call.

### Correction: there is no 13-question bank (2026-08-12)

The four-part question battery in the packet delivery was an accidental
paste, per the owner ("13 q are accidental"). The preserved copy is
deleted; the condensed five-task assignment in the lesson is the whole of
the packet's tasks. Recover the battery from git history only if she ever
asks for it by name.

### The owner's review round on the packet (2026-08-12)

She reviewed the built page and the reveal keys and sent two batches of
fixes, all applied:

- **The rule is "Task 5 and any one of Tasks 1–4"** — three answers was too
  much for the hour. Lesson prose, widget completion rule, and every
  comment that restated "any two" now say "any one".
- **Task 1's quoted claim** is now hers exactly: "If all declared nuclear
  material remains accounted for, the state has no nuclear-weapons
  programme." — the version that tests correctness vs completeness rather
  than a generically over-broad claim.
- **Task 2 realigned to Document 2.** Her audit found the task named
  "training transcripts", which the Shavit §1.1 excerpt never discusses —
  the question could not be answered honestly from the text given. The
  component list now names the excerpt's own three parts (chip-level
  activity logging; inspection and analysis of the logs of a sufficient
  subset of chips; supply-chain monitoring). The model answer's middle row
  and two of the "not interchangeable" items were rewritten to match, and
  the reveal note lost its transcript sentence — **that rewritten wording
  is ours, drawn from the excerpt, and awaits her copy** (flagged in the
  data file header too).
- **Citations corrected per her source audit** (no quote hallucinations
  found; three editorial fixes): the IAEA quote is cited by its three
  section names instead of page numbers (the printed pages shifted in the
  current PDF); the Carlson quote now carries the work's real identity —
  Paper 1 of the Background Papers, John Carlson, "Experience and
  Challenges in WMD Treaty Verification: a Comparative View".
- **The "Compliance under anarchy" memo tail deleted** — a leftover from
  the pre-packet 0.3; its slot (m0-compliance-under-anarchy) is out of
  memos.ts and memos.js regenerated (13 slots).

Open with her: Task 3's body still asks for "three conditions" while its
title and key speak to grounds-and-limits of the analogy — her call whether
the body follows the title.

### The case files stand down (2026-08-12)

"Why not deleted" — her review's time math had already assumed it ("Без
case files пакет ещё можно уместить"): the document packet is 0.3's whole
60-minute budget, so the eight-case-files interactive (precedent-cases,
"Did the Regime Hold?") leaves the section. The stand-down mirrors
nuclear-disanalysis: embed removed from precedents.mdx, entries removed
from exercises.ts and the widget registry; the widget, its diagrams and
her eight cases (verbatim) all stay in the repo. The two intro sentences
that introduced the interactive were cut with it — deletion only, her
remaining sentences untouched. Where the case files live next — another
unit, the facilitator side, or nowhere — is her call; re-mounting is one
embed plus two registry lines.

### The intro goes too (2026-08-12)

Second "why not deleted": the three intro paragraphs ("The underlying task
of verification…") were written as framing for the case-files interactive
and left with it. 0.3 now opens at the packet itself — estimated time,
objectives, Document 1. The text survives in git history; nothing was
rewritten.

### The time estimate becomes one toolbar line (2026-08-12)

"Estimated time: 60 minutes" leaves 0.3's body: her packet's figure now
lives on the lesson def (`estimatedMinutes: 60`) and the parts reader
prints it on its toolbar line — "Estimated time: 60 mins | single page
view, 4 parts" in whole-lesson mode, the estimate alone in part-by-part
mode. On chunked lessons the page's header clock chip yields to that line
so the estimate appears exactly once; unchunked tracks keep the chip.

### Module 0 gets the standard toolbar line (2026-08-12)

Per the owner ("do this standard format of the module"), every module-0
lesson now declares `estimatedMinutes`, so the reader's toolbar line —
"Estimated time: X mins | single page view, N parts" — is the module's
standard header. 0.3 keeps her authored 60. The rest are MECHANICAL
estimates, not authored curriculum: body word count at ~200 wpm plus an
allowance for embedded interactives, rounded to 5 — 0.0 Welcome 5,
0.1 Introduction 25 (five explorables), 0.1.1 Prevention 5,
0.4 Strategic Foundations 5 (in-page text only; its external readings are
the unit and are not counted). Each number is hers to override in
curriculum.ts. 0.2 deliberately carries none: the Plan A rebuild (below,
merged in the same push) made it a self-paced essay unit, and a fixed
minutes figure on essay writing would mislead — the same reason that
rebuild dropped the stale 15–20-minute figure from the unit meta.

### 0.2 rebuilt around the Plan A essays (2026-08-12)

The Outline-36 revision replaced 0.2's task with the two AI 2040 essays, and
the owner asked for the two monolithic prompts to be split into the outline's
own mini-essays. What changed, all transcribed verbatim from Outline-36:

- **The prose**: new intro ("We'll do this by analyzing AI 2040: Plan A…"),
  an "AI 2040: Plan A?" section, the outline's task statement (A or B), and
  its "[expand box]" as `<Fold label="A writing good practice">`.
- **The exercises split**: `v-task-intuitions-1` and `-4` (one giant prompt
  per option) are replaced by ten writing exercises — `-5…-9` for Option A's
  prompts 1–5, `-10…-14` for Option B's — each under its own h2 so the
  chunked reader serves one mini-essay per page, each carrying the outline's
  bracketed word budget as minWords/maxWords (the first 0.2 word bounds; the
  header comment in exercises.ts records the exception). Numeric id suffixes
  are load-bearing: cohort.ts derives the owning lesson from
  `v-task-<lesson>-<n>`.
- **The A/B heading prefixes are navigational**, not the outline's: both
  options number their prompts 1–5 and the jump strip needs the two "Final
  essay" rows told apart.
- **The final-essay recommendation is selectable**: new reader block
  `<VerdictSelect/>` (components/mdx/reader/verdict-select.tsx, vt-marks
  store, key `verdict:<id>`) carries Option A's adopt / amend / reject and
  Option B's Plan A / Plan S. A selection, not a quiz — no key, no reveal,
  clearable, changeable.
- **Optional material now matches the course's shape**: the success-scenario
  essay is `v-task-intuitions-2` rewritten to the outline's new text
  (500–800 words, "Keep this essay"), the AI 2027 explore task stays
  `-3`, the AI 2027 reading card moved down beside them, and the outline's
  six curated readings replace the old three (three cards kept their
  permanent ids; new: reading-baker-six-layers arXiv:2507.15916,
  reading-scher-restrictions arXiv:2606.28694, reading-scher-treaty
  arXiv:2511.10783).
- **Memo desk synced**: the 0.2 slot m0-hinge-brief now carries the final
  essay (title, brief, essay genre, 600 words; id kept — it is the desk's
  draft key), and m0-success-scenario is the optional keep-this-essay slot.
  memos.js regenerated (14 slots).
- **Unit meta**: 0.2 is now kind "exercise", "self-paced" — the 15–20-minute
  "interactive" figure described the deleted timeline game.
- **Dropped**: the old `<Objectives>` block (it described the pre-Plan-A 0.2
  — arms-race directions, transparency/confidentiality, timelines; the new
  outline states no objectives for the unit) and the old "Choose one essay"
  section prose, which Outline-36 superseded.
- **Citations**: ai-2040.com/supplements/faq joined citations.json `pending`,
  alongside the three 0.3 packet URLs that arrived cited but unregistered
  (the suite was red on them; pending is the honest holding pen).

Verified in the browser: one prompt per page, verdict selection persists
(`vt-marks.v1`, `verdict:plan-a-verdict`), word bounds show in the editor,
both memo cards render at the foot of the unit.
