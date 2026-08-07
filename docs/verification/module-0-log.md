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
