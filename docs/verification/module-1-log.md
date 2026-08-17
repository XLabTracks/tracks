# Module 1 — build log

Running log for the Verification track's module 1 (`v-scoping`, "Policy scoping
& actors"). Append to it; do not rewrite entries. The point is that the next
session can see what was done, what was deliberately *not* done, and what is
still owed, without re-deriving any of it from the diff.

Source of truth for structure is `src/content/verification/curriculum.ts`.
Source of truth for content is the author's WIP outline. This log is neither —
it is the record of the decisions taken between them.

---

## 2026-08-07 — the Distiller ported off the prototype

`v-context-distiller` (unit 1.3) was a stub: its body carried the outline's
brief for the exercise plus an author note saying the interactive did not exist
on this platform, and 1.3 above it linked out to
`xlab-verification-track.pages.dev/the-distiller`. Both are now gone — the
interactive is a native widget in the lesson.

### What came over

The whole artifact, not a reduced version: five phases (Clip · Distil ·
Upstream · Downstream · Thread), all four reports, the full-report reading view,
the letters debrief, tight-budget replay, and the two-tap reset.

- `src/lib/verification/data/context-distiller.ts` — the four reports. Extracted
  by a **one-shot transform** over the prototype's two data IIFEs rather than
  retyped, and the emitted module was diffed back against the source JSON until
  identical: a transcription slip inside a verbatim RAND/AISI/IAEA/BIS quote is
  exactly the kind of error nobody catches later. The one deliberate omission is
  the per-reader `accent` hexes (Okabe–Ito) — literal colours are not how this
  repo styles anything, and the readers are already told apart by monogram,
  name and role.
- `src/lib/verification/engines/context-distiller.ts` (+ tests) — everything
  that judges: the phase gate, delivery scoring, the actor scoring, the run's
  shape, and `graphFaults`, which was a `console.assert` in the prototype and is
  now 30 unit tests. All four reports pass it.
- `src/components/verification/widgets/context-distiller.tsx` — the renderer.

### Decisions taken

- **Where it lives.** The widget went into `context-distiller.mdx` (its own
  lesson, which is named for it and is where progress is keyed), not into
  `scoping-upstream-downstream.mdx`, which now hands off to it in a sentence.
- **A duplicate was removed, not widened.** 1.3's body carried a verbatim copy
  of the whole of `context-distiller.mdx` — the five steps, the FLI worked
  example, the four report options. With the interactive now sitting under the
  canonical copy, the second one was the course-exists-twice defect in
  miniature, so it was cut. No authored sentence was lost: every one of them
  still reads, on the next page. The IAEA case's own source line moved up to sit
  with the case it cites rather than trailing the hand-off.
- **Step order.** The outline numbers the five steps upstream → downstream →
  clip → distil → thread; the prototype runs clip → distil → upstream →
  downstream → thread, because you cannot trace what a report was built from
  until you have read it. The outline's list is kept verbatim and one added
  sentence says the rail takes them in the workable order. Renumbering the
  author's list would have been a content decision.
- **Provenance is carried, not asserted.** r1 is fictional and says so on the
  picker card, in the report bar, and in the data file's header. r2–r4 are real
  documents whose quotes and citations came over untouched, each linking out to
  its source.

### Still owed

- **The prototype is not retired at its origin.** `site/the-distiller.html` in
  `tracksprogramplayground` is still deployed. Nothing in this repo points at it
  any more, but somebody should decide whether that page comes down or stays as
  a standalone.
- **1.3.1 Threat Modeling and Theory of Change** is still IN PROGRESS in the
  outline — an interactive node-map spec with exercise briefs and no learner
  prose. It ships nothing until the prose exists; the author note in
  `scoping-upstream-downstream.mdx` records the spec.

## 1.1 — the optional hard version, cut

The fold under the workspace asked for a comparison across three treaty
proposals (Scher, Miotti, and the Global Governance of AI articles) with a
two-level analysis brief under it. The course owner cut it. What that left:

- **One treaty paper stays.** `v-paper-scher-treaty` is what the workspace
  questions are answered against, so it was never optional in practice.

  `v-paper-miotti-treaty` was kept for a few commits as a sidebar-only
  Optional row, then deleted on the course owner's instruction — the fold was
  its only link and nothing replaced it. Gone with it: the paper entry, its
  committed arXiv artifact `2311.10748v2.json`, and its place in module 1's
  `itemIds` and `verificationPaperIds`. Its citations.json row went earlier,
  with the fold. Rebuilding it is `npm run arxiv:build -- --id 2311.10748v2`
  plus the paper entry, both in the history.
- **`/verification/gg-treaty` is gone.** It was kept for one commit as an
  unlinked page, then deleted on the course owner's instruction: the route,
  the committed `gg-treaty.json`, `scripts/build-gg-treaty.mjs` and the
  `gg-treaty:build` script line. Rebuilding it means re-deriving the
  extraction — `global-governance.ai/treaty/` serves the proposal from a
  WordPress plugin's JS bundle rather than as HTML, so the articles were
  parsed out of that bundle. The deleted script is in the history and is the
  place to start.
- **Two citations.json entries went with the fold**: arXiv:2311.10748 and
  global-governance.ai/treaty/. Both were cited from that fold and nowhere
  else, so the registry's orphan test would have failed on them.
  arXiv:2511.10783 stays — three other lessons cite it.

### Module objectives standardized (2026-08-13, owner's edit list)

1.0's opening paragraph is replaced by the owner's new one ("Now that we
have a grasp of the motivations…") with the module-level
`<Objectives scope="this module">` block directly after — six bullets, the
owner's wording. The old 1.2 block (`scope="Module 1"` in
scoping-actors.mdx) is deleted as redundant on the owner's instruction; its
four bullets live on, edited, in the 1.0 block. Known cost, flagged to the
owner: the replaced 1.0 paragraph carried the "write down two or three
specific claims" prompt that the closing Activity ("Return to the claims
you wrote at the top of this page") refers back to — that reference now
dangles pending her call. 1.1's "Module objective" participants-will list
(the MIRI exercise's own framing) is deliberately kept.

### 1.0 rewritten from the owner's "1.0 new" document (2026-08-14)

The body of `scoping-intro.mdx` is replaced wholesale with the owner's new
draft, transcribed verbatim. Structure now: intro paragraph + module
`<Objectives>` (both unchanged from the 2026-08-13 standardization), then
"The Building Blocks of a Policy" (goal → rule → claim operationalization,
the four ingredients, the Microsoft example, Goodhart, the NPT/Iraq case)
and "Candidate Verifiable Agreements" (the Oxford AIGI five-family
taxonomy). Her bracketed instructions became: the Example sentence set in a
`<Callout>` (the requested rounded rectangle), and Goodhart's Law defined —
new `goodharts-law` entry in `src/content/glossary.json` (hand-placed
`<Term/>` in the body) plus a unit-1.0 row in the learner's guide
`data/glossary.js`. The draft's "Works Cited" page is the aigi.ox.ac.uk
report link, already in citations.json, riding in the prose so the standard
Works cited appendix carries it. Gone with the rewrite: the "Three layers,
kept separate" / "Why the layers matter" framing sections, the PageBreak,
and the closing Activity — which also retires the dangling "claims you
wrote at the top of this page" reference flagged in the previous entry.
`scoping-intro` joins autoGlossExclude: the auto-gloss senses of "backdoor"
(AI control) and "non-proliferation" (AI capability spread) would mis-gloss
this page's treaty-sense uses.

## 1.2 repaired (2026-08-15, owner read the section)

Nothing here is a redesign — the section's structure, its five tables and its
three widgets are unchanged. These are defects found by reading 1.2 end to end
in a browser and checked one at a time.

**The opening said the same thing four times, and the copy that had it wrong
was the one on top.** The MDX paragraph sent the reader to "the sample pause
policy you constructed at the end of Module 0"; Module 0 asks nobody to
construct one (its exercises are `packet-tasks` and a reading list), and the
three other copies on the same screen all say correctly that it is Scher's
draft, dissected in 1.1. Fixed on the owner's instruction: one lead-in in
prose, the "click a phrase" instruction left to the widget being clicked, the
italic attribution line dropped because the document card carries it.

The prose sentence and the widget's are one authored run split one each — the
widget's `subLearn` lost its first two sentences and the body gained exactly
those. Between them the wording is unchanged; only the duplication is gone.

**The Scher link moved to Notes and sources rather than disappearing.** The
citation collector reads lesson MDX, not widget data, and the document card
names the paper without linking it — so deleting the italic line would have
dropped the work the section opens on out of 1.2's own Works cited.

**Three cross-references pointed at sections that do not exist.**

- "the compute supply chain you mapped in 1.2" — this *is* 1.2, and the map is
  1.2.1, which comes after those words. Now "that 1.2.1 maps".
- "the same axis as the map in 1.2" — same, now 1.2.1.
- "section 1.5 develops it properly" — module 1 runs 1.0–1.3, and 1.3 Upstream
  and downstream is the section that develops the chain narrowing. Now 1.3.

**Three smaller ones.** `1025 FLOP` had lost its superscript (Notes and
sources, in the same file, writes `10^25`, which is now what both say).
`risk,it` was missing a space. Table 4's frontier-labs cell read "Every posture
potentially" with no end to it; it is punctuated now — "Every posture,
potentially." — and nothing was added, because the paragraph under the table
already spells out what it means.

**1.2.1 and 1.2.2 each opened by saying their one sentence twice.** 1.2.2 ran
"The inspection is over and your notebook is full …" straight into "Two days
inside Pacifica's Northgate compute campus are over and your notebook is full
…". The more specific of each pair stays.

**Their bodies moved into `src/content/lessons/verification/`.** They were the
only two lessons in the track sitting at the top level of `lessons/`, under
`v-`-prefixed filenames; `contentRef` follows. Driven in a browser afterwards
rather than trusted to the suite, because `importLesson()` turns a wrong
`contentRef` into an ordinary 404 while typecheck and every test stay green.

**Still owed, and the owner's to write:** 1.2.1 and 1.2.2 are a lead sentence
and a widget each. What they lack is what 2.4's sections have — why the reader
is here, and what they take away. Marked in both files; do not fill it in.

### What was NOT changed, and a correction

An earlier reading of this reported that `protocol-actors` is "bridged but
completes nothing" and `interactive-map` is "unbridged although it has its own
lesson", and called the pair wired backwards. That was wrong, and no flag was
flipped. `bridged` writes to the EXERCISE's content id, never its host
lesson's: an exercise embedded in prose has no such lesson and records a
private mark the widget reads back to show itself done — by design — while an
exercise that IS a lesson (1.2.1, 1.2.2) completes that lesson. Eleven bridged
exercises across the track are of the first kind. The rule is now stated once,
in the header of `src/lib/verification/exercises.ts`, because that file's own
per-entry comments had asserted the wrong version of it twice.

## 1.2's Actor Map Workshop (2026-08-15, owner's instruction)

Two widgets stood down and one replaced them, on the owner's call: "мы
заменяем хуйню с выделением текста это говно для первокурсников".

**Gone from 1.2, kept in the repo.** `protocol-actors` ("Who's in the
Treaty?") — clicking highlighted phrases in a treaty to meet the actors behind
them is recognition dressed as work. `actor-map` ("The Actor Map") — a third
browsable roster of the same cast, sitting directly under the three tasks it
could not be used to answer. Both files, data and all, are unregistered rather
than deleted; remounting either is one line here, one in the registry, and an
embed.

**What replaced them is modelled on the Beeck Center's stakeholder-mapping
workshop** (Georgetown), the shape she picked out of the research: Goal
Setting 5' · List all stakeholders 10' · Identify the core user 5' · Place and
cluster 10–15' · Categorize 10–15' · Catch-up 5' · Political Analysis 15–20' ·
Setting Actions 10', with concentric rings as the artifact so a reader can
"see dependencies between stakeholders and anticipate second-order effects".

Ours is six steps, because a solo online learner has no facilitator to set
goals with and no group to catch up with: **Study → Recall → Core → Place →
Categorize → Read the map.** Goal Setting became the standing brief; Catch-up
became the reveal at the end of Recall, which is what a group gets out of
comparing lists.

**It opens closed-book, which is the other half of what she asked for** —
"нам придется делать заморозку и разводить их по разным стейтам с кнопкой я
уже изучил давайте упражнение". Karpicke & Blunt (Science, 2011) found that
building a concept map as elaborative study loses to plain retrieval practice,
even when the final test is building a map; Blunt & Karpicke (2014) found that
a map built from memory beats the same map built with the text open. So the
roster is a study panel with a button that closes it, and every step after it
is answered without it. The freeze is soft and visible: "Open the roster" is
always there, taking it sets `peeked`, and the closing map says so. A hard
lock would be a lie — her tables are further up the same page.

**Rings carry position, chips carry roles, and that split is the point.** The
lesson says "any actor can hold several roles at once, and almost every
important actor does", so one ring per actor would be false if rings meant
roles. Position is single-valued and roles are not — which is exactly Beeck's
own split between Place and cluster and Categorize. On the finished map a role
lens lights that role across every ring at once, so her sentence about the
second lens cutting across the first is something the picture shows rather
than something the page asserts.

**Provenance, stated in the data file and repeated here.** Hers, unchanged:
the ten actors (rows of `ACTOR_MAP_ENTRIES`, imported not restated), the six
roles and five postures (Tables 5 and 1), the role and posture answer keys
(those rows' own fields), and the three closing questions, which are the "Try
it before moving on" bullets moved verbatim out of the body. Ours, and hers to
overrule: the four rings and which actor sits on which, the core question's
four options, and the closing finding — each derived from a sentence already
in 1.2 and each carrying that sentence.

Two ring placements are meant to be argued with: a cloud provider is on RUNS
rather than SUPPLIES because the run physically happens on its machines, and
the proxies sit OUT OF REACH beside the deployers — opposite in intent, alike
in the one property the ring names.

**Found while building, all fixed.**

- Free recall marked "and" as a hit, because a stopword is genuinely a
  substring of half the roster. Containment now needs four characters on the
  contained side; the unit test that caught it stays.
- Ring angles were computed from the answer key, which encoded the answer in
  the layout and stacked two dots on one point whenever a placement was wrong.
  They come from the roster order now.
- Map labels truncated to an ellipsis at diagram size. They use the lesson's
  own table headings instead — Cloud providers, Frontier labs, Deployers,
  Proxies, BIS.
- Actors sat on twelve o'clock, on top of each ring's own name. Angles start
  half a step off centre.

**Not mine, fixed to unblock the branch:** `08a8a30` (another session, 2.4.4's
Carlson reading) cited an arms-control URL with no registry row, so
`citations.test.ts` was red on the shared branch before any of this. Parked in
`citations.json`'s `pending`, which is what that field is for — the appendix
renders nothing for it and the gap stays visible in data rather than being
papered over with guessed bibliographic fields. Whoever owns that reading
should promote it.

**Still owed** (and unchanged by this): a node/dependency map with typed edges
between actors, which is the one bullet of her 1.2 plan with no implementation
— "recognize institutional relationships". This workshop makes structure
visible; it does not draw edges. BlueDot's Unit 2 map is the reference, and
their edge typology (authority / evidence / compliance / physical inputs) is
still an open question for her.
