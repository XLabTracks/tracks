# Module 4 — build log

Running log for the Verification track's module 4 (`v-capstone`). Append to
it; do not rewrite entries.

---

## 2026-08-06 — 4.3 becomes the completion page

On the course owner's instruction, the track's last unit stopped being
"4.3 Where to go from here" and became the completion page, Coursera-style:
title **Congratulations** (no number), body ordered congratulations → words
from us → feedback → what's next. The owner's spec, verbatim in substance:
congratulations line, a words-from-us section, a feedback section, then
opportunities (MATS, entry-level roles, GovAI, "see all aisafety.com").

What was deliberately cut in the same edit: the **five-doors pathway
notes** (Build / Analyse / Negotiate / Fund / Translate) and their two
author notes. They were the author's WIP shape for this page — their own
note called the names placeholders — and the owner's replacement spec does
not carry them. They live in git history on this file if the material is
wanted elsewhere (the facilitator guide is the plausible home).

What is still owed: the "Words from us" prose and the feedback channel —
both are the owner's to supply, and the page holds their slots as marked
author-note stubs.

The unit id stays `4.3` in `verificationUnitOfLesson` — it is a progress
key and a rung tag in `data/skills.js`, so the display title changed and
the id did not.

### Module objectives standardized (2026-08-13, owner's edit list)

4.0's Objectives block reworded by the owner: scope changes from "Module 4"
to "this module" and the ten bullets become her seven (dropped: locate and
appraise current evidence; separate durable from expiring analysis; compare
against written checkpoints — the first two survive in spirit in the
unit-level "Student goals" list below, which is deliberately kept). Position
unchanged: after the three opening paragraphs, as she specified.

---

## 2026-08-18 — 4.0/4.1 restructured per Outline-41/42/43

The owner's three outline pages redraw the module's front half:

- **4.0 Putting it All Together** (`v-capstone-together`, new lesson,
  `capstone-together.mdx`, 5 min): the module intro and its Objectives
  block, and only what is on the outline page. A new id rather than a
  rename, because `v-capstone-feasibility` IS the feasibility lesson and
  lesson ids are progress keys.
- **4.1 Feasibility Judgments** (`v-capstone-feasibility`, retitled, unit
  4.0 → 4.1, 170 → 120 min): the discernment intro, the Intuition Check
  (the Reference Map widget stays), and the outline's rewritten four
  metrics as a 2x2 pop-up grid — `FeasibilityGrid`/`FeasibilityCard`
  (`src/components/verification/feasibility-grid.tsx`), the MechanismGrid
  contract fronted by small line glyphs instead of diagrams; the metric's
  own paragraph reads at body size and the Source / Excerpt /
  What-you-should-glean apparatus steps down, styled in the component so
  the four dialogs cannot drift apart. The drill bench and the
  defended-ranking memo keep the tail; memo slot `m4-0-ranking-memo`
  keeps its id (memo-desk drafts key on it) and moves its unit label to
  4.1. The Hooker link reuses the registry's existing
  `arxiv.org/html/2407.05694v1` URL rather than opening a second entry
  for the same work.
- **4.1.1 How to Do Research Well** (`v-research-tips`, retitled, nested
  under 4.1 via `sectionItemId`): the body still regenerates from Aaron
  Scher's doc; `build-gdoc.ts` gained `intro` (the owner's 4.1.1 framing
  paragraph — course copy, so it survives every re-sync) and `highlights`
  (the outline's HIGHLIGHT instruction: the Importance passage wrapped in
  bold, with a snippet tripwire that aborts a re-sync if the doc moves out
  from under it). The page opts into the new `Lesson.plainLists` flag: the
  reference-sheet slab form turned a page of long bullet runs into
  wall-to-wall tint, and the owner asked for "a bit more space and less
  maroon boxes" (app-bridge.css: slab rules stand aside for
  `.vt-plain-lists`, list runs get breathing room).

Deleted on the owner's instruction ("ONLY PUT WHAT IS ON THIS PAGE … keep
the module objectives ofc delete threat modeling and toc stuff"): the
whole Threat Modeling & Theory of Change spec block (outline briefs, never
drafted into prose) — and with it the field-map widget's only embed, so
field-map stood down (its exercises.ts and registry lines; widget and data
stay in the repo, learner state waits under `vt-field-map:v1`). The
unit-level "Student goals" list and the old author-note outline callout
went in the same restructure. All of it is in git history on
`capstone-feasibility.mdx`.

Citations registry fallout: airisk.mit.edu removed (its only citer was the
deleted spec block); Sheehan (Carnegie, Aug 2024) added for 4.1; the FAS
TTBT page and the OTA seismic-verification report added for the 1.0.1
citation edit already sitting in the working tree.

Still owed:

- **Limited resource exercises: research budget, political capital** — the
  fourth item of the outline's 4.1 plan (its "for you Claude only"
  bracket). No content drafted; deliberately not carried as an on-page
  author note, since the bracket was addressed to the builder, not the
  learner.
- **"Reading the news"** — Outline-43 says to make sure it is "in here
  somewhere when inputting aaron scher's stuff", but as of 2026-08-18
  neither his research-tips doc nor his How To Do Research reading list
  (nor the Medium Level AI Governance list) says anything about reading
  the news. Nothing was invented. Needs the owner to point at the source —
  or the passage to appear in Aaron's doc, which the weekly re-sync would
  then carry in on its own.

Owner-language note: 4.0's Objectives keep `scope="this module"` — her
2026-08-13 standardization changed the lead away from "Module 4", and the
new page's instruction "keep the module objectives ofc" reads as keep
as-is.

---

## 2026-08-19 — 4.3 filled in: the owner's copy, the form, the dashboard

The completion page's two author-note stubs are gone, on the owner's
2026-08-19 instruction:

- **Words from Us and Feedback are her words, verbatim** — the closing
  note ("the most comprehensive curriculum on AI verification to date…",
  the preparadigmatic-field / look-back-through-your-notebook paragraph)
  and the feedback ask. "Capstone Bank" links to the bank; the feedback
  channel is the Google Form she supplied, rendered as one NextSteps card
  under the paragraph so "the feedback form below" stays literally true.
- **What's Next gained the Frontier AI Security Residency**
  (securefrontier.ai), first on the list as the most directly
  verification-focused programme: eight weeks, fully funded, in person in
  Cambridge, UK, on hardware verification and cyber security of frontier
  AI — ERA with Heron and the Oxford Hardware AI Governance Lab. Details
  transcribed from the site on 2026-08-19; the lead-in now counts "the
  first four". Headings on the page went Title Case per the standing
  instruction (Words from Us, What's Next?).
- **A dashboard renders above the body** — her ask: "how many skills
  learned from skill tree, how many essays written perhaps in words, how
  many hours of reading completed… don't go too overboard." It is
  `CompletionStats` under `CompletionHeader` in the item page, three
  tiles: skills mastered on the 27-node graph, words across submitted
  required writing, reading completed by the course's own
  `estimatedMinutes` — all derived at read time from rows the page
  already fetched, nothing persisted, and shown to signed-in learners in
  every state (celebration stays gated on the header). The skills
  arithmetic mirrors `VT.rungFill` (the compound 2.1–2.4 rung fills by
  quarters); the graph's progress skeleton is snapshotted in
  `src/lib/verification/data/skills.ts` with a drift test against
  `data/skills.js` (`completion-stats.test.ts`, the bank.test.ts
  pattern).
- **Honest number, worth knowing:** units 3.1 and 3.2 have no drafted
  lessons, so a learner who finishes everything currently completable
  masters 13 of 27 skills (13 more in progress; "evasion" sits fully
  behind 3.1). The dashboard reports that rather than rounding up — when
  module 3's lessons land in `verificationUnitOfLesson`, the figures move
  on their own, and the test pinning 13/13 is expected to move with them.

Same-day revision, owner's instruction: the signed-out header card ("The
last page of the Verification track") is gone — the dashboard is the top
box in every state. Signed out it renders dashes where the numbers go
(dashes, never zeros: the account may hold work the page cannot see) and
carries the sign-in line as its footer; signed in, CompletionHeader still
celebrates or lists what is left above it, unchanged.
