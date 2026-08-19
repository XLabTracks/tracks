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
уже изучил давайте упражнение". The roster is a study panel with a button that
closes it, and every step after it is answered without it. The freeze is soft
and visible: "Open the roster" is always there, taking it sets `peeked`, and
the closing map says so. A hard lock would be a lie — her tables are further
up the same page.

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

### The two papers, read (2026-08-15, after she asked whether they had been)

They had not been. The first version of this section and the data file's
header carried claims taken from search snippets, and one of them was wrong.
Both papers have now been read.

**Karpicke & Blunt, Science 2011 — holds, and is stronger than what was
written.** Concept mapping counts as elaborative study precisely when
"students construct concept maps in the presence of the materials they are
learning"; in Experiment 2 the mapping group "created their concept maps on
paper while viewing the text". Retrieval practice beat it on the final
short-answer test (d = 1.07) and on a final test that was itself building a
map from memory (d = 1.01). The detail worth keeping: the mapping group
produced MORE ideas during initial learning (0.74 versus 0.65) — ahead where
it felt like it counted, behind a week later.

**Blunt & Karpicke 2014 — the claim was wrong in its emphasis, and the
correction matters.** It was written up here as "the fix: a map built from
memory beats the same map built with the text open". The map-from-memory half
is true, but the paper's actual finding is that FORMAT DID NOT MATTER:
"concept mapping and paragraph formats were equally effective retrieval-based
learning activities", while retrieval did — "students performed better on a
final test when the initial activities required retrieval (in the absence of
the texts) rather than studying or elaborating on the material (in the
presence of the texts)", and the retrieval groups wrote LESS during learning.

So the evidence licenses the freeze and nothing else. It does not license the
ring map as a teaching device: a map is not a better format than writing down
what you remember, only not a worse one. The rings stay for two reasons that
are not Karpicke's — they are the artifact the Beeck workshop is built to
produce, and they make one structural claim visible that the lesson can
otherwise only assert. The data file's header says this now; it used to imply
the opposite.

A third finding from both papers is now load-bearing in the UI rather than
decorative: learners believe they learned more after studying than after
retrieving. That is why reopening the roster is recorded and reported back
instead of being silently allowed.

**Two things checked at the same time, one of them a defect.** Every quoted
fragment in the workshop's data file was matched against `scoping-actors.mdx`.
One had been edited to fit: Table 4's "The machines without which no
leading-edge chip exists" was quoted with a full stop where the cell has a
comma and continues "and knowledge of every fab that buys one". Restored, and
`actor-workshop.test.ts` now carries a tripwire that re-matches every quoted
fragment against the lesson — widget data had no such guard, though the paper
pipeline has had snippet tripwires all along.

**Not read, and not cited in the repo:** Schwartz & Bransford (1998) and
Schiffer & Hauck (2010) were named in conversation as part of the research
sweep and were never used to justify anything in code. They are still
snippet-level knowledge; treat them that way until somebody opens them.

**Still owed** (and unchanged by this): a node/dependency map with typed edges
between actors, which is the one bullet of her 1.2 plan with no implementation
— "recognize institutional relationships". This workshop makes structure
visible; it does not draw edges. BlueDot's Unit 2 map is the reference, and
their edge typology (authority / evidence / compliance / physical inputs) is
still an open question for her.

## 1.2 fact-checked against its own cited sources (2026-08-15)

The owner asked whether the sources behind the module had been read. They had
not. This is the pass. Every checkable claim in `scoping-actors.mdx` was taken
to the document 1.2 itself cites — not to a search snippet — and the result is
below. **No prose was changed.** Modules 0–2 are her transcription and a
factual correction to them is her call; what follows is the evidence for the
three she needs to make.

### Confirmed against the primary source

- **EU AI Act, Article 51.** "A general-purpose AI model shall be presumed to
  have high impact capabilities … when the cumulative amount of computation
  used for its training measured in floating point operations is greater than
  10^25." The lesson's "10^25 FLOP presumption of systemic risk" is right;
  strictly the presumption is of high-impact capabilities, which is the route
  to systemic-risk classification. Not worth changing.
- **SB 53 dates and numbers.** Signed 29 September 2025, duties effective 1
  January 2026; "large frontier developer" = annual gross revenues in excess
  of $500 million (with affiliates); reporting "within 15 days … or within 24
  hours if there is imminent risk of death or serious physical injury". All
  exact.
- **The UN panel.** Established by A/RES/79/325 on 26 August 2025; 40 members,
  appointed by the General Assembly 12 February 2026; Yoshua Bengio and Maria
  Ressa elected Co-Chairs at the inaugural meeting on 3 March 2026. The Notes
  line's "first meeting March 2026" is correct — un.org's "first in-person
  meeting, Madrid, April 2026" is a different event, and both are true.
- **The Global Dialogue on AI Governance.** First met in Geneva, 6–7 July
  2026. Exact.
- **CAISI.** Its own NIST page: it will "establish voluntary agreements with
  private sector AI developers and evaluators", and it holds no inspection or
  compulsion power. The Table 3 row's "Voluntary agreements, not inspection
  authority; renamed and refocused as the politics changed" is right, and the
  June 2025 Lutnick statement is the rename.
- **ASML.** Sastry et al., Figure 11: "ASML is the only company capable of
  producing EUV machines", market share 100%. The lesson's "the world's only
  maker of EUV lithography machines" is exact.
- **TSMC.** Same figure: 90% of ≤7nm logic fabrication (2022 data), Samsung
  and Intel the other 10%. "Fabricates the overwhelming share of leading-edge
  AI chips" is right, and there is a number available for it.
- **The counts list.** "Even AI development at the frontier consists of only
  tens of organizations" and "several critical steps … have fewer than three
  suppliers" (Figure 11 caption) back "a few dozen labs that matter" and "the
  chain narrows to almost nothing at the top" directly. NVIDIA's ">90%" share
  of data-centre GPU design and the cloud split (AWS 32 / Azure 22 / Google 11
  / others 35, 2023) are in the same paper if a number is ever wanted.

### Three things for her

1. **SB 53's duties are attributed to the wrong class of developer.** The
   lesson says the Act "binds 'large frontier developers'" and then that "they
   must" do all four things. Both summaries the lesson itself cites agree that
   is not the split: the Frontier AI framework is **large developers only**,
   but the transparency report and the 15-day / 24-hour incident report fall
   on **all frontier developers**, and so does the duty to inform employees of
   whistleblower rights — only the internal anonymous reporting channel is
   large-only. The definitional half is also absent: a "frontier model" is one
   trained on more than **10^26** operations, which is the threshold that
   decides who is in scope at all, and in a module about thresholds its
   absence is louder than elsewhere.
2. **The packaging row overreaches both cited sources.** Table 4 calls
   packaging/assembly/test "a second, quieter bottleneck". CSET — cited in
   Notes and sources — says the opposite of the general case: ATP "is
   labor-intensive and has the lowest barriers to entry", and China is strong
   in it. The bottleneck claim is defensible for **advanced packaging**
   specifically (CoWoS, which the row names), and the row merges that with
   commodity outsourced assembly-and-test, where the cited source says the
   concentration is not there.
3. **The HBM claim has no cited support.** Table 2's South Korea row — "HBM is
   scarce and essential to frontier training: a countable, checkable input" —
   is a chokepoint claim, and neither cited supply-chain source makes it.
   Sastry et al. mention high-bandwidth memory once, in a footnote about chip
   packaging; CSET does not discuss memory at all. The claim is very likely
   true and it needs a source that says so.

### Two caveats on the whole section

- **Source vintage.** The two supply-chain sources are CSET 2021 and Sastry et
  al. 2024, whose concentration figures are 2022–2023 data. The lesson reads
  as current in mid-2026 and carries no currency note; 1.2.1 does carry one.
- **Not verified this pass.** The Federal Register blocked automated fetching,
  so the Department of War executive order was not read — the lesson's own
  hedge ("statutory renaming pending in Congress as of mid-2026") is the right
  posture either way. CAISI "runs pre-deployment evaluation agreements with
  several frontier developers" is not stated on the CAISI page; the
  predecessor AI Safety Institute had such agreements, and whether CAISI still
  does is unconfirmed rather than wrong.

### The three corrections applied (2026-08-15, owner: "правь то что старое и неправильное")

- **The Department of War leads now.** She spotted it: the department has run
  under that name since the September 2025 executive order — war.gov, Secretary
  of War — and Table 3 still led with "Department of Defense (restyled…)".
  Reversed. The Notes line was checked rather than assumed: the FY2026 NDAA was
  signed on 18 December 2025 and does NOT carry the renaming, so the statutory
  change is genuinely still outstanding — it passed the House in the annual
  defense bill on 22 July 2026, 216–212, after the Senate Armed Services
  Committee advanced it. The old note ("pending in Congress as of mid-2026") was
  right about the statute and wrong about which name to use in the meantime.
  `actor-map.ts`'s roster row renamed to match.
- **SB 53's duties re-split.** Two thresholds now open the passage — a frontier
  model is one trained on more than 10^26 operations, a large frontier developer
  is one above $500M in revenue — and the duties sit where the statute puts
  them: transparency report, the 15-day / 24-hour incident report and the
  whistleblower notice on EVERY frontier developer; the published framework,
  fuller reports and the internal anonymous channel on the large ones only.
- **The packaging row split in two.** Advanced packaging keeps the bottleneck
  claim; ordinary assembly and test now says what CSET says about it, that it
  is labor-intensive with the lowest barriers to entry of any stage.

**HBM: sourced as far as a source goes.** The concentration half still has no
citation. What is now cited is the half that is documented — that US export
controls were "expanded again, this time affecting all chips using advanced
high-bandwidth memory" (Fist, Burga & Chilukuri, CNAS 2024, registered in
citations.json). Her sentence in Table 2 is untouched; if the scarcity claim
is to stay it wants a source that argues it.

**Notes and sources gained the numbers and a currency line.** ASML at 100% of
EUV, TSMC at ~90% of sub-7nm logic (2022 data), "fewer than three suppliers" at
several steps — all from Sastry et al., whose title is also now given in full.
The currency line says plainly that the shares are 2021–2023 data and the
structure is what has not moved.

### What the papers say about the workshop I built

Reading Karpicke properly is a critique of this exercise, and the data file's
header now carries it rather than leaving it to be discovered. Only step 2 is
retrieval in their sense — material, no cue on screen. Steps 4 and 5 are cued
RECOGNITION: the four ring names and the six roles are printed on the buttons
being pressed. The freeze hides which actors exist, not the vocabulary. That is
a defensible trade, and it means the evidence covers less of the exercise than
its shape implies.

Worse, step 2 is the weakest retrieval that could have been asked for: it
retrieves ten proper nouns, while the section's content is what those actors can
do and to whom. Three candidate repairs, none of them taken without her, because
two are content decisions:

1. **Change what Recall asks for.** Not "who does this agreement touch" but the
   material — what a cloud provider can do in a regime and what it wants — free
   recall marked against the roster's own role and posture vocabulary, which is
   a key that already exists.
2. **Give the three closing questions a marking key.** They are three textareas
   with `onComplete: () => {}` and no feedback of any kind. Every constructed
   exercise in 2.4 ends in `MarkingKeyPanel`, the learner marking their own work
   against criteria. This is the largest consistency gap with the rest of the
   course and the component is already built.
3. **Add the second-order step Beeck's artifact exists for** — "anticipate
   second-order effects" is their phrase for the concentric-ring map. Pull one
   actor off the map and ask what breaks. The sources read this week supply the
   answer for the sharpest case: ASML is 100% of EUV.

Timing label corrected from 20–25 to 25–30 minutes: ten actors times a ring plus
up to six roles plus up to five postures is forty to sixty decisions, and the
first number was optimistic.

### Department of War, and who "large frontier developer" actually catches (2026-08-15)

Two owner instructions, applied.

**"Пусть просто деп оф вор зовется."** Table 3's row is now just *Department of
War* — no parenthetical — and the Notes-and-sources paragraph about the
executive order and the House vote is deleted outright. Both URLs left
citations.json with it: the Federal Register entry (an `entries` row) and the
PBS one (parked in `pending` an hour earlier). The registry's orphan test is
what makes that mandatory rather than tidy.

Worth recording since it was checked twice: the department has run under the
name since the September 2025 executive order, and the *statutory* renaming is
still outstanding — the FY2026 NDAA was signed on 18 December 2025 without it,
and it passed the House in the annual defense bill on 22 July 2026. None of
that is in the lesson any more, on her call that it does not matter for what
1.2 teaches. It is here so the next person does not "restore" it as a fix.

**The two SB 53 thresholds now carry a footnote naming who they catch.** She
offered two mechanisms — a footnote, or the hover card on an underlined word.
`<Footnote>` is the one used, and not only because it was easier: the hover
card is `<Term>`, which is a lookup into `glossary.json`, and a glossary entry
is a definition, which this repo's rules reserve for her to write. A footnote
needs no such entry. On viewports of 96rem and up it renders as a margin
sidenote that is simply there to read; below that the `[1]` marker expands it
in place. Verified at 1700px, 1440px and 430px.

The content is sourced, and it is a better fact than expected: **no public
authority keeps a list.** Coverage turns on the compute number, and the compute
number is one only the developer measures. As of early 2026 the SB 53 reference
records exactly two developers publicly known to have trained above 10^26 —
OpenAI and xAI — while METR's guide for lab staff names OpenAI, Google,
Anthropic and xAI as illustrations of who these laws govern rather than as a
roster. The footnote says both, attributes both, and ends on one sentence of
ours connecting it to the section's own subject: a rule whose scope is set by a
quantity the regulated party alone can count.

METR is registered in citations.json with full fields; sb53.info is cited and
parked in `pending`, because its authorship is not established and guessing
bibliographic facts is the thing `pending` exists to prevent.

### The three pedagogy repairs, applied (2026-08-15, owner approved all three)

**1. Recall retrieves material now, not names.** Step 2 asked "who does this
agreement touch" and marked a typed list against the roster with a fuzzy
matcher. That retrieved ten proper nouns while the section's content is what
those actors can do and to whom. It now takes one actor — the cloud provider,
because the lesson works that one through explicitly — and asks what it can do
inside a regime and what it wants. The key is six items and every one of them
is her sentence: the four bullets under "Try it on a cloud provider" and Table
4's cloud row for the two postures. A test re-derives that the six are exactly
that actor's `roles` + `postures` in the roster, so a roster edit cannot leave
the key marking against something the course no longer says.

**Marked by the learner, not by a matcher.** A string matcher over free prose
would need a vocabulary list per role, would be wrong often, and would be wrong
in the direction that stops people writing. Self-scoring against a printed key
is what the free-recall studies score and what every constructed exercise in
2.4 already asks for.

`recallHits` and `normalize` are deleted with their tests — including the
four-character containment floor that the "and" case forced. They have no
caller now, and a helper kept alive only by its own tests is the thing this
repo's audits keep finding. History has them.

The step is renamed on screen too: "What can one actor do?", against Beeck's
"List all stakeholders, **recast**" — the old title and the old Beeck label
both described a step that no longer exists, and pretending the recast still
matches Beeck's step 2 would be the same kind of stale label the Department of
War row was.

**2. The three closing questions have a marking key.** They were three
textareas with `onComplete: () => {}` and no feedback of any kind, in a course
where every constructed exercise in 2.4 ends in `MarkingKeyPanel`. Seven
criteria, ten points, in the house form from data/marking-keys.ts: credit per
element, `needsReasoning` where a bare label earns nothing, wording free, and
`noCredit` stated out loud.

The two factual criteria are derived from the roster and re-derived in the
test, which is the part that matters: Taiwan holds exactly three roles
(chokepoint, information, victim), which is why her question says "at least
three"; and exactly two actors hold capability and enforcement at once, the
United States and China. Edit the roster and the test fails instead of the key
quietly lying. Question 2 has no fixed answer and its criteria say so — what is
marked is whether an order was committed to and whether each rank carries its
reason.

**3. The second-order step exists.** Beeck draw rings to "anticipate
second-order effects" and the workshop had no step doing the second half. One
question at the end of step 6: take one actor off the board — whose removal
stops a frontier training run *soonest*, this week rather than this decade?

The answer is the cloud providers, and the point is the gap. Every option's
reveal is a different clock: ASML is the most consequential removal on the
board and the slowest (100% of EUV, but the chips already exist); TSMC is the
same shape one step nearer (~90% of sub-7nm logic, stopping the next
generation rather than the loaded run); BIS loosens the regime rather than
stopping the activity. Then the line the step is for: the removal that bites
soonest and the removal that matters most are different actors on different
rings, and a regime reaching only for the second buys nothing this year.

Sourced, and re-read rather than remembered: Sastry, Heim, Belfield et al.,
Figure 11 — "ASML is the only company capable of producing EUV machines" at
100%, TSMC at 90% of ≤7nm logic, and the caption "Several critical
steps--including AI chip design and production--have fewer than three
suppliers." All three re-matched against the extracted PDF text before being
written down.

**The quote tripwire caught something while this was being built**, which is
the second time it has earned its place. A `noCredit` line quoted a learner's
voice — "It is a conflict of interest" — and the test read it as a claim to be
found in 1.2. Rewritten without the quotation marks rather than the test
loosened, and the convention is now stated in the test: curly quotes in the
data file are 1.2's own words; anything from an outside source is attributed
inline and written with straight quotes; a line putting words in a learner's
mouth carries no quotation marks at all.

Storage bumped to `v-actor-workshop:v2` — a restored v1 draft would be an
answer to a question no longer on screen. The notes and the new self-marking
have their own permanent keys.

### The reading column takes the width, and footnotes became popups (2026-08-15)

Two owner instructions that turned out to be one decision: "текст должен быть
на всю ширину экрана, которая не занята другим" and "а сноска — поп апами".
Reserving a right-hand gutter for footnote sidenotes is part of what kept the
column narrow, so notes that open over the text are what let the text have the
width.

**Two caps were stacked, and both are off.** Measured before touching
anything, at a 1700px viewport: `main` was 1316px, the item page's
`max-w-4xl` wrapper cut the lesson body to 832, and app-bridge.css's 64ch
reading measure cut paragraphs to 644 inside that. Text was using under half
the space it had. Now: lesson body 1252, paragraphs 1252, nothing left over.
At 1280 the wrapper was never the binder — paragraphs went 644 → 832 there.

The measure rules are kept in place set to `none` rather than deleted, so the
decision has somewhere to live and one value brings it back. **The stated
cost**: at 1700px a line runs about 125 characters, well past the W3C's
80-character guidance, and that is a trade she made knowingly rather than a
detail nobody noticed.

The `--vt-measure` card — the red header a paragraph gets when it introduces a
four-plus-item list — lost its cap too, and had to: its whole reason for
existing is that the header and its list take the same length, and the list is
unbounded now. Verified: header 1252, list 1252.

**The footnote is a popup at its own marker.** `<Footnote>` is now a client
component over the ui kit's Popover, reusing `useGlossHoverTimers` — the
glossary card's own hook — so the open and close delays cannot drift from the
other small explanation on the same page. Hover-intent on a mouse, tap on
touch, Enter/Space from the keyboard, Escape and outside-click to dismiss; a
hover open never moves focus, a keyboard open does so Tab reaches links inside
the note. All four inputs driven and verified. The sidenote float and the
checkbox/label toggle are gone from globals.css; the CSS counter stays, so
numbering still needs no per-instance registration.

She had offered the hover card as an alternative to a footnote. It is the same
thing now — the mechanism is the popup, the authoring API is still
`<Footnote>`, and no glossary entry is needed, which matters because a
glossary entry is a definition and those are hers to write.

**Two defects found and fixed while verifying, both mine.**

- `PopoverContent` is `flex flex-col gap-2.5`, so the note's inline run became
  a column: every text fragment and every link on its own line with a gap.
  Wrapped in one block child.
- Widening exposed a table defect that was always there. `.lesson-body table`
  is a block-level scroll box, so its rows lay out in an anonymous table that
  shrinks to content — at 1252px the header rule stopped 116px short of the
  box and the table read as broken. `width: 100%` on the last cell lets auto
  layout hand the slack to that column, and is ignored when the columns
  genuinely need more room, so tables that must scroll still do: verified at
  390px, where two of 1.2's five still scroll and the page never does.
  min-width on the row groups, width on the rows and max-content on the table
  were each tried and measured first; none of them moved it.

**Not changed, and worth a decision:** the module and assessment pages still
carry `max-w-3xl`/`max-w-4xl`. Only the lesson item page was widened, because
that is what she was looking at.

### The footnote popup is the course's existing card (2026-08-15)

The owner: "почему твой блядский дизайн отличается если я тебе даже понитейл
скилл подвезла". Correct, and it is rung 2 of that ladder — is it already in
this codebase — failed on the first try. The course already had a popup: the
one the Define action raises over a selected word, `.vocab-card` in
public/verification/notebook.css. I built a fourth look out of a bare shadcn
`PopoverContent` instead of reading it.

Every value now comes off `.vocab-card` rather than being chosen:
`min(360px, 100vw - 24px)` wide, 14/16/12 padding, hairline `--border`,
`--radius`, `--card` for the ground, `--shadow-soft-lg`. The shadcn defaults
that had to be overridden are exactly what made it look foreign —
`bg-popover`, `p-2.5`, `shadow-md`, `ring-1 ring-foreground/10`. Verified as
computed style, not by eye: 360px, 14px radius, 1px border, 14/16/12.

The body was the loudest difference and was not a size problem. It read
`text-muted-foreground`, which greys a note the reader opened deliberately;
`.vocab-body` carries the normal foreground at 1.6. Size already matched —
app-bridge.css maps `--text-sm` to `--fs-md`, so `text-sm` is 16px inside this
chrome. Links now take `--link` like every other link on the page.

Checked in both themes by clicking the header control rather than by setting a
storage key — the first probe set `xlab-verification-theme` and got `light`
both times, which would have reported a white card in the dark as a pass. Done
properly: `data-theme=dark`, page `rgb(20,16,15)`, card `#1c1817`, border
`#332c2a`, body `#f4f0ee`. No white-dialog trap here, because `--card` is one
of the tokens theme.css does carry.

**What is deliberately not copied:** the vocab card's title, its source line
and its two buttons. That card is about a word, so it needs to name the word
and say where the definition came from. A footnote is the continuation of a
sentence and carries its own sources inline. If footnotes should have a label,
that is a call to make rather than a thing to infer.

**Noticed while doing this, not changed:** `GlossaryCardContent` renders its
body in `text-muted-foreground`, so the React glossary hover card is greyer
than both the vocab card and now the footnote. Three small-explanation
surfaces, two treatments. Flagged rather than aligned, because which one is
canonical is the owner's call.

### The map is on screen, and one duplication audit (2026-08-15)

**"The Actor Map Workshop должен содержать карту."** It did not, for most of
its length. `RingMap` rendered only inside step 4 and step 6, so a block with
"Map" in its name opened on a roster and a button, and showed nothing again on
steps 2, 3 and 5. That is plain from the control flow, not a rendering
accident.

One map now, mounted above every step. It takes the learner's own placements
until the last step and the answer key there, where the role lens turns it
into the finding; the lens moved up with it, because a control separated from
what it controls by a screen of text is not a control. Verified from a cleared
storage: the map is present on first load with the four rings and the act in
the centre, stays through every step, and gains a dot the moment something is
placed — one map on step 4, never two. The viewBox was also cropped to the
drawing: content spans y 74..510, so the old 0..584 box carried 148px of empty
card, most of it visible on exactly the steps where nothing is placed yet.

To be exact about what was removed earlier, since the question was why: the
geographic supply-chain map was never touched — it is 1.2.1 and it is intact.
What stood down was `actor-map`, the filterable roster, and it is unregistered
rather than deleted. Say the word and it comes back.

### The audit, by the ladder's second rung

`.claude/` does not exist in this checkout, so the plugin CLAUDE.md declares is
not installed here and the skill cannot be invoked; the ladder is described in
CLAUDE.md and was applied by hand. Rung 2 is "is it already in this codebase",
and the largest answer was mine.

**Fixed: the committed single-answer row, written three times in one day.**
2.4.2's On Paper deck, 1.2's centre question and 1.2's second-order question
each carried their own `const SLOT = "ABCD"` and their own copy of the same
five-way className — hover while open, primary on the pick, comply on the
answer, defect on a wrong pick, everything else faded. Now
`kit/choice-list.tsx`, used by all three. Measured: `const SLOT` 3 → 1,
`border-comply bg-comply/5` inside actor-workshop 3 → 1 (the survivor is the
multi-select chip row, a different interaction). Both surfaces re-driven in a
browser afterwards — five frozen radiogroups and five verdicts on On Paper,
four frozen options on the centre question, no console errors.

**Found and not fixed, because they are sweeps rather than repairs:**

- **`@utility eyebrow` exists in globals.css. Eight files use it; eighteen
  still hand-roll `uppercase` + a tracking value.** This is the same defect
  the repo's own audit named, still in place.
- **`useStoredState` exists and 6 of 49 widgets use it. Eleven still hand-roll
  `localStorage.getItem` with their own prune-and-persist:** build-institution,
  companies-ab, context-distiller, field-map, infer-the-system, mechanism-sort,
  missing-board, policy-critique, precedent-cases, standard-of-proof,
  theories-of-change. That block is where the two bugs of this session's own
  making came from — a stale-snapshot persist and a restore that fought
  hydration — so eleven copies is eleven places for them to recur.
- **Three small-explanation surfaces, two treatments.** `.vocab-card` and the
  footnote now match; `GlossaryCardContent` still renders its body in
  `text-muted-foreground`. Which is canonical is a design call.

## 2026-08-18 — 1.2's rings are Baker's frame now, and the edges are an exercise

Her instruction: *"Берём рамку Baker / Рёбра делаем упражнением нарисовать и
ключ по бейкеру"* — take Baker's framework, make the edges something the
learner draws, and key them against the paper.

### What the rings were and why they moved

They were ours: **runs it / supplies it / rules on it / out of reach**, derived
honestly from sentences in 1.2 and answering a question no paper asks. The
verification literature asks a different one, and it is the one the course is
about. Baker, Ho, Hadfield, Wasil et al., *Verification for International AI
Agreements* (arXiv:2507.15916v2, committed in-repo) opens on declarations: a
**Prover** states what it owns and what it did with it, a **Verifier**
establishes the statement is "correct and complete", and everything else is
either evidence about a declaration or outside every declaration there is.

So the rings are **Declares / Holds the evidence / Verifies / Outside the
declaration**, each ring's test quoted from the paper. The centre did not move
— a training run above the threshold is the same act the paper counts in
compute ("all large-scale AI compute use is accounted for in compliant
activities").

Two placements changed their reasons rather than their positions, and both are
better for it. The cloud provider is innermost because Baker names Provers in a
parenthesis — "major AI companies and cloud compute providers" — not because
the run happens on its machines. The proxies and the deployers still share the
outer ring, and the edge step is now where the difference between them shows
up: one is outside by construction (below the threshold), the other by
construction of a different kind.

### The edge exercise

An edge **A → B** says: A can put something in front of a Verifier about B that
B did not have to volunteer. Direction is the content of the claim, so a
backwards edge is reported as backwards rather than as a miss (`scoreEdges`
distinguishes `reversed` from `extra`, and refuses to call a reversal partial
credit when the correct direction was drawn too).

Six edges, each tagged with the Baker subgoal it completes and quoting the
mechanism:

| edge | subgoal | mechanism |
| --- | --- | --- |
| Cloud providers → Frontier labs | 1.A | off-chip devices detecting discrepancies between declaration and chip use |
| NVIDIA → Frontier labs | 1.B | Confidential Computing: tests run without the Prover handing over weights |
| NVIDIA → Cloud providers | 2.A | on-chip security features logging traces of activity |
| TSMC → Proxies | 2.B | chain of custody, which begins at manufacturing |
| NVIDIA → Proxies | 2.B | inspecting chips for delivery to undeclared data centres |
| Intelligence community → Proxies | 2.B | national intelligence, which Baker gives every subgoal |

**Four actors have no edge, and that is the finding, not a gap.** ASML is
upstream of a chain of custody that starts at manufacturing. BIS's instrument
is export control, which the paper places outside verification outright ("we do
not cover this latter step of enforcement"). California produces declarations
rather than checks on them. The deployers are below the threshold. Each carries
the line of the paper that keeps it out; none of them may be quietly filled in
to make the graph look complete.

The closing finding is Baker's weak-link reading applied to the board: 2.B has
three edges and the other three subgoals have one each, two of those from the
same firm — so removing one chip designer takes two subgoals with it, and
Baker's redundancy standard (layers stacked) is met nowhere. And the board has
no node for the layer the paper calls most implementation-ready, because
whistleblowers and interviews are not organisations.

### Two tripwires now, and one exemption

`actor-workshop.test.ts` had one: every curly-quoted fragment in the data file
must still appear in `scoping-actors.mdx`. It now has a second: every
`BakerQuote` reachable from the module's exports must appear verbatim in
`src/content/arxiv/2507.15916v2.json`. The collector is a deep walk over the
exports rather than a hand-kept list, so a quote added to a new edge is checked
the day it is written.

The exemption is narrow and stated in the test: a curly-quoted run **inside** a
Baker quotation is skipped by the lesson check, because the paper quotes the
terms it defines ("weak link", "large-scale") and the artifact check has
already matched the whole sentence. Baker quotations allow no ellipsis at all
— the 1.2 tripwire permits a trailing cut because it quotes table cells; this
one quotes claims, and a claim trimmed to fit is the failure it exists to stop.

Counts are re-derived too: a test asserts 2.B has exactly three edges and the
others one each, that NVIDIA is the source of two of the singles, and that
`EDGE_NOTES` covers exactly the actors no edge touches. The prose in
`EDGE_FINDING` states all three, so it cannot drift from the data.

### Storage and one layout repair

`STORAGE_KEY` is `v-actor-workshop:v3`. All four ring ids changed, so a
restored v2 document would be ten placements on rings that no longer exist;
prune would drop them one at a time and hand back a half-built map with no
explanation.

The ring names moved from **inside** each ring to eight pixels **outside** it.
Inside, they shared a line with any actor near twelve o'clock, and two actors
always are — the dots nearest the top sit 18° off it, which on the innermost
ring is twenty pixels. "DECLARES" printed over "Frontier labs" and "OUTSIDE THE
DECLARATION" over "Deployers". Every alternative considered (shorter names,
rotating the roster, placing each label in its ring's largest empty arc) either
left under 2px of clearance, or made the layout depend on where things had been
placed — which would let the map reflow under the builder's hand, or leak the
key through its own geometry. Outside the line costs nothing and depends on
nothing.

Both chip rows in the edge step print the same ten names. The headings tell
them apart on screen and nothing did in the accessibility tree, so the source
chips are labelled "Draw from X" and the target chips carry the whole claim,
"X can show a verifier something about Y". That was caught by a driver script
clicking the wrong row, which is exactly what a screen reader would have done.

Driven in a browser end to end: all seven steps, draw / remove / redraw /
commit, both themes (edge strokes resolve to real distinct values — khaki and
red by day, their lighter variants at night, missed edges dashed grey in both),
no console errors.

### Re-read of paper, lesson and arc, same day

Asked to check the whole thing again. Six real defects, five of them mine and
introduced by the re-base itself.

**The citation was wrong.** The header called the paper *Verification for
International AI Agreements* by "Baker, Ho, Hadfield, Wasil et al." It is
*Verifying International Agreements on AI: Six Layers of Verification for
Rules on Large-Scale AI Development and Deployment*, by Baker, Kulp, Marks,
Brundage & Heim — which is the title and the author list `intuitions.mdx` and
`hardware-attestation.mdx` already use. The artifact's own `meta.title` is
mangled (`_5807bavuhsio Verifying…`), so those two lessons are the authority.

**The freeze had a hole and the re-base cut it.** Step 4 asks for the rings
from memory and the study panel never carried them. That was survivable while
the rings were derived from the lesson's own position table — a reader could
reconstruct them — and is not survivable now: the paper is *optional* reading
in 0.2 (one of six curated, "deep-read one or two") and *required* reading in
2.1, so in 1.2 the framework is new material and nothing on the page taught
it. The four rings and their tests are in the roster panel now.

**Step 6 was intuition, not reasoning.** The four subgoals only appeared in
the reveal, so the learner drew edges without knowing what a verifier is
trying to establish. They now open the step, in the open: four labels and four
short names, no quotes and no counts. They are deliberately not in the freeze
— the step never asks the learner to produce a subgoal, the key assigns them.

**Two mechanisms were filed narrower than the paper files them.** Baker gives
national intelligence *and* whistleblower programmes **all four subgoals**.
The key files each at the one subgoal where it is the only mechanism on this
board, which is defensible, but the page said nothing about it — so a learner
drawing an intelligence edge to a lab was marked as inventing when the paper
was behind them. Both edges say so now.

**California's absence overclaimed.** "It supplies the thing the subgoals are
about" is a clean line and only half true: SB 53 also requires an internal
anonymous reporting channel at large frontier developers, which is the
scaffolding of Baker's personnel layer. The note now carries the argument
against the key, with both quotes, and says plainly that leaving the edge out
is a judgement rather than a reading. `EDGE_NOTES[].baker` became an array to
hold the second one.

**The finding undercounted and stole a word.** It said two subgoals come from
one firm; the true and sharper statement is that NVIDIA is on half the edges
and touches three of the four subgoals — and that this is not a fact about
NVIDIA but what a *layer* is, since the paper defines a layer as one mechanism
per subgoal. So the board does not show one weak link, it shows a regime
resting on roughly one layer held by a company that is not a party to the
agreement. Added, with both counts re-derived in the suite.

Also added, and it is the strongest thing the frame surfaces: **every actor on
the verifying ring belongs to one of the two signatories.** No counterparty
verifier, no international body — which is 1.2's own empty-shelf paragraph
made visible. A two-party agreement in which only one party can check anything
is not a verification regime. A test derives the ring's membership so the
paragraph cannot outlive the roster.

And the finding no longer says "position tells you what part an actor plays in
checking a declaration". *Position* is the lesson's word for place on the
supply chain (Table 4), and 1.2.1 is the exercise for it. The rings are a
fourth lens and are now named as one.

**Provenance, restated honestly.** The header claimed the key "is not a matter
of taste". The subgoals are the paper's and the mechanisms are the paper's;
*which actor on this roster holds each mechanism* is ours, and for several it
is arguable — an off-chip network tap is a mutually vetted device nobody on
this board manufactures, filed under the cloud provider because the device
sits in its data centre. Said in the header now, and on the page where it
matters.

**Left open for the course owner** (recorded here, not acted on):

- Whether the declaration frame belongs in 1.2's **prose**, not only in the
  workshop. It now carries the section's main structural idea and it sets up
  2.1, where a layer is defined as one mechanism per subgoal — a sentence you
  cannot read without the subgoals. Four short paragraphs under "Functional
  roles" would do it. Adding a section to her lesson is her call.
- The three closing questions ask about **Taiwan** and about **states holding
  capability and enforcement at once**, and neither is on the ten-actor board
  the learner just built. Defensible as transfer, but there is no bridge
  sentence saying so.
- **Length.** Seven steps, and step 6's reveal alone runs ~1,300 words of
  reading at the end of a memory exercise. The heading still says 25–30 min;
  it is nearer 45. Options are folding the per-edge quotes behind a
  disclosure, or collapsing correct edges to one line so attention goes to
  the misses. Both change what a learner who got it right reads, so neither
  is ours to pick.

### The states are on the board

Her instruction, same day: *"добавь страны... в схему"*. She is right and it was
the real fix for the seam, not a bridge sentence: the closing questions ask
about Taiwan and about states holding capability and enforcement at once, and
the board was ten companies and three American bureaus.

**Ten actors became seventeen.** The six states of the lesson's Table 2 — the
United States, China, Taiwan, the Netherlands, Japan, South Korea — plus one
row that is not a country and belongs for the same reason: the roster's own
`missing-verifier`, "The verification body that does not exist". Still out and
deliberately: the EU, states with no supply-chain position, the second-tier
firms, and the two international bodies that exist without verifying.

**The declaration frame absorbed the states without strain, which is a point
in its favour.** Baker: "The Prover could be a private institution or (in the
case of international agreements) a government, which could constrain private
companies within its territory as part of the agreement." So the two
signatories go on Declares beside the labs and the clouds, and the frame runs
at two levels at once — a government declares to the other government, the
organizations inside it declare in turn. The `declares` ring carries both
quotes now, because one alone would put either the states or the firms there
by our say-so.

The four host states go on **Holds the evidence**, and the ring's test grew a
clause to match: a jurisdiction does not hold the fab's shipment records, it
holds the authority that makes them producible. That is not a stretch of the
paper, it is the gap the paper names — attaining commitments from states that
host large-scale compute is listed as an open challenge, and none of the four
is a party here. Their group note says exactly that: an edge drawn from one of
them is an edge nothing compels.

**One new edge, and it is the one the board was missing:** Intelligence
community → China, Subgoal 2.B. It is what one signatory has instead of a
right to inspect the other, and it makes the one-sidedness mechanical rather
than rhetorical — seven edges, six of them pointing at a company or a shell,
exactly one at a party, and none at the United States. A test derives both.
The edge's own text says the asymmetry is a fact about this roster and not
about the world: China has the same capability and the roster has no row for
its bureaus.

**`missing-verifier` is drawn hollow and dashed**, can hold no edge in
principle, and the edge step says so rather than leaving an empty row to be
interpreted. Its ring reason is the paper's own allowance — "The Verifier
could be a government body or a third party" — against a ring where every
government body belongs to one signatory and the third party is the hollow
circle.

**Step 5 now runs on six of the seventeen.** Seventeen actors is 187 chip
decisions, and the step was already the longest at ten. Not only length: the
lesson works the roles lens through exactly two actors ("Try it on a cloud
provider", "Or try Taiwan"), so demanding all seventeen asks for more than the
section settles. The six are those two plus one from each remaining ring, and
the United States, which is there because the third closing question asks for
an actor holding capability and enforcement at once and it should be one the
learner has had in their hands. The step says on screen that it is six and
why.

**The map got a second array and a bigger sheet.** `MAP_SLOTS` is the drawing
order, separate from the reading order, because the reading order groups
actors the way the lesson introduces them — which put seven consecutive slots
on the evidence ring, seven labels stacked along one arc. A test asserts no
two neighbouring slots share a ring.

That was not enough on its own, and chasing it by reordering was whack-a-mole:
a dot on the inner ring and one a couple of slots along on the next ring out
can land at the same height, and then their labels are 52 units apart with 64
units of text between them. `South Korea ✕ Frontier labs` became `Japan ✕
Frontier labs` on the first swap. The cause is that the sheet was sized for
ten dots, so the sheet grew — bands 66 units apart instead of 52, box 960
units wide, container 860px. Measured with a probe that reports every
overlapping pair of SVG labels: zero at 1440, 1024 and 760px, and zero on a
deliberately wrong learner placement too.

Storage is `v-actor-workshop:v4`. A v3 document survives prune intact and is
worse for it — a map reporting itself finished with seven actors unplaced.

### Pedagogy pass after the states landed, and the empty sheet

Asked to check the pedagogy and logic again. Five things, four of them
introduced by adding the states.

**The ring test made the states unplaceable.** "Declares — you own or use
large-scale compute" points at compute owners, and a learner reading it puts a
government on the verifying ring every time, because it is a government and
governments check things. The paper's own answer is the other half — in an
international agreement the signatory IS the Prover — and a test that hides
that half marks a careful reader wrong. The test says both now.

**The brief asked a question the map no longer answers.** It said "draw the
map that tells you who has to change what they do", which is the section's
opening question and not what these rings are about. The brief now chains the
two: the section asks who changes their behaviour on Wednesday morning, the
map asks the one after it — when the three months are up, who could *show*
that they did, and who could show that somebody did not.

**"Not the people who signed" now looks like a contradiction, and had to stop
looking like one.** The lesson's third paragraph says governments do not train
frontier models; two steps later the map puts both signatories on the
innermost ring. Both are true and the difference is the whole frame — owing a
declaration and performing the act are different things — so the core
question's signatories option says it outright and warns the reader that the
apparent contradiction is coming.

**The reveals were 3,076 words.** Measured, not estimated. The placement
reveal alone was 777 across seventeen rows, most of it explaining placements
the reader had already got right. A correct placement needs the ring's name
and nothing else — the name IS the explanation — so hits collapse to one line
and misses print in full, with a control that opens everything for anyone
checking their reasoning rather than their answer. It defaults to open when
nothing was missed, because then the filter has nothing to hide. Same rule on
the edge reveal. Measured after: a reader who missed three of seventeen sees
562 words instead of 1,235.

**The closing finding moved from step 6 to step 7.** It is a reading of the
finished board — count the edges, count the arrowheads, count what has no edge
and what has no node — and step 7 is called Read the map. Leaving it on 6 made
that step 2,200 words of feedback and made 7 a formality, and it asked the
reader to count things on a diagram one screen back. Step 6 is 1,661 now and
step 7 is 1,508, with the marked map directly above both.

**The heading was lying about the time.** It said 25–30 min, set when the
board was ten actors and six steps. Seventeen actors, seven steps, ~3,000
words of reveal, roughly 35 discrete decisions and three written answers is
45–60, and the lesson's `estimatedMinutes` went 60 → 95. A time figure is
something people budget by, so understating it is a usability defect and not a
rounding error.

**And the sheet was empty for the first three steps** — course owner, looking
at step 3: *"where dots"*. Four bare circles and a dot in the middle, on a
canvas that had just been enlarged for seventeen actors. It reads as a broken
widget, and it is not how the workshop this is built on works: the
stakeholders are on the table from the first minute, on stickers, off to one
side, and placing them is the step. Every unplaced actor now sits in a staging
band outside the outer ring and moves inward when it is placed. No fifth ring
is drawn there on purpose — there are four rings and a fifth circle would say
there are five; what marks the band is being outside every ring, which is a
position rather than a colour. Checked with the overlap probe at three widths,
on an empty board, a half-placed board and a wrong one: zero overlapping
labels and nothing clipped, in both themes.

## 2026-08-18 — 1.2 comes down from 77 minutes to 34

Course owner: *"мы не можем иметь 1.2 больше чем 40 минут давай пепесобирать"*,
then, after three costed routes: **route В — split, plus the cuts, and delete
the drill bench rather than move it.** Written answers marked optional.

### Where the 77 minutes were

Measured, not estimated. Prose and five tables: 2,720 words, 40 table rows,
~16 min. Workshop: study 530 words studied-to-remember 7, recall 4, centre 2,
place 6, categorize 5, edges 11, read the map 5, three written answers 12.
Drill bench: 3 decks, 19 steps, ~9.

**The diagnosis was not reveal length.** 1.2 was teaching four taxonomies —
postures, position on the chain, functional roles, and the declaration frame
with its four subgoals. Each is a fifteen-minute lesson. Collapsing reveals
had already saved 700 words of 3,000 and left the lesson at 77.

Two of the four already had homes, which is what made the cut decidable
rather than a matter of taste: position on the chain is what **1.3** is for
and **1.2.1** is the exercise for it, and the functional roles were being
drilled by the `actors` deck five screens below the workshop that also
drilled them.

### What was done

**Split, not cut.** The workshop's second half — the four subgoals, drawing
the edges, the key, the four absences and both findings — is **1.2.3 Who can
prove what**, its own lesson at 20 minutes. Nothing was shortened to make it
fit; the mechanisms are what the section is for and they now have a page
instead of a tail. Three files where there was one:
`widgets/actor-board.tsx` holds the shared document, the ring map and the
roster; `actor-workshop.tsx` is the board half; `actor-edges.tsx` is 1.2.3.

**One document, two widgets.** Both read `v-actor-workshop:v5`, so a board
placed in 1.2 arrives in 1.2.3 already keyed — verified in a browser: 17
placements carried across the navigation. Each half keeps its own cursor
(`step`, `edgeStep`) because they are two pages and a reader may be on
either. 1.2.3 also stands alone: a reader who lands there first gets the key
placement and is told that is what it is, rather than a gate.

**Categorize is gone outright**, and with it `roles`/`postures`/`catDone`
from the document. The point it existed for — roles cut across rings —
survives as the role lens on the map in 1.2.3, where the finished board is
read.

**The drill bench is removed and its registration retired.** Removing the
embed alone would have left `drills-foundations` registered and unplaced,
which `widgets.test.ts` fails and CLAUDE.md calls drift — the suite caught it
on the first run. So the exercise entry and the registry line are commented
out with the one line that brings it back, and the three decks (foundations
9 steps, actors 6, spine 4) are untouched in
`data/drills-foundations.ts`. **It now has no placement anywhere in the
track**, by decision rather than by accident; 1.3 and module 0 are the homes
that would fit. One consequence to own: Table 5's six roles are still read in
1.2 and nothing in the section practises them any more.

**The three written answers are behind a control**, not always open. Twelve
minutes of writing under a finished exercise reads as required no matter what
the sentence above it says, and the exercise completes on the second-order
commit, so nobody is held back by work they did not have time for.

### The result, measured on screen

| step | words on screen |
| --- | ---: |
| 1.2 study | 773 |
| 1.2 recall | 315 |
| 1.2 centre | 264 |
| 1.2 place (reveal, everything shown) | 1,314 |
| 1.2.3 edges, before commit | 486 |
| 1.2.3 edges, marked | 1,850 |
| 1.2.3 read the map | 1,080 |

**1.2 = 16 (prose) + 18 (four steps) = 34 min.** 1.2.3 = 20. The workshop
heading and both `estimatedMinutes` say those numbers.

### A trap that cost an hour, now written down

**A lesson missing from its module's `itemIds` 404s silently.** The new
lesson had a curriculum entry, a `contentRef`, an MDX file, a widget, a
registry line and a `verificationUnitOfLesson` join — typecheck green, 1,154
tests green — and the route returned the platform's ordinary 404 page. This
is the same family as the `importLesson()` trap CLAUDE.md already documents:
nothing in the suite walks module membership, so `itemIds` is a third place a
new lesson has to be listed and the only symptom of forgetting is a 404 that
looks like a bad URL. Drive the route.

## 2026-08-18 — 1.0.2 conformed to outline v40: the buckets become the exercise

The owner's outline revision (v40, "[WIP] Verification Track Outline-40.pdf")
rewrote 1.0.2's builder notes, and the section was rebuilt to them. The order
is now the outline's: the two-axes prose, then the "Everything comes with a
cost" pop-up, then the Limited Test Ban Treaty passage as an expand box
(v40 marks it "[claude below is expand box]" — it had briefly been wrapped as
writing exercise `v-task-scoping-effective-feasible-1`, a task with no
question; the exercise entry is gone), then the transition prose, then the
sorting exercise.

**The sorting exercise is rebuilt around the outline's eleven buckets**, per
its bracketed brief: "use the BELOW BUCKETS. FIRST introduce: what is
effectiveness? Give a qualitative scale of 5 different values. What is
feasibility? … Make them side by side pop ups. THEN introduce in order do
some sort of pretty color gradient popup or expand from self governance to
full pause, description and historical parallel. After learning each card,
the learner sorts them. Make it look adhd friendly." The widget
(`policy-scoping`, id and progress key unchanged) is three gated phases: the
two scales as side-by-side pop-ups; the eleven buckets as an accordion ladder
down one column; then the sort on a 5×5 plane whose rungs are the phase-1
scales. The ladder is the owner's shape, same day: the first cut walked one
card at a time behind an unlabeled gradient strip, which she called
unintuitive — now all eleven rows are visible at once on a single-hue tint
rail (brand primary into the card ground, deeper = stronger instrument —
ordinal, not a categorical rainbow) with its ends labeled "Least/Most
demanding ask", a row expands in place (one open at a time), and a read row
keeps a flat primary tint distinctly stronger than unread (her request:
"maroon or light red depending on light/dark mode" — one flat tint for all
read rows, not the row's own ramp shade, so read-state never whispers on row
1 and shouts on row 11). The sort still gates on opening all eleven. The
five-bucket version's
45-entry verdict table could not survive eleven buckets (11 × 25 cells of
authored feedback), so verdicts are mechanical against a per-bucket reference
cell — exact right, one step close — with direction nudges before reveal and
a one-line rationale each after.

**What is verbatim and what is builder-authored.** Bucket names, descriptions
and historical parallels are the outline's words, transcribed into
`src/lib/verification/data/policy-scoping.ts` (two seams noted inline: bucket
6's list lead-in "in two strands" opens its card description, and bucket 9's
"Worth putting on the card:" is obeyed rather than printed). The five-rung
scales, each bucket's reference cell and rationale line, and the
compute-controls exception answer are builder-authored exercise apparatus
under the brief's own delegation — **owner review wanted**, especially the
reference placements: self-gov (Already happening / Symbolic), unilateral
(Heavy lift / Marginal), domestic reg + transparency (Within reach /
Marginal, sharing a cell), emergency prep (Long shot / Symbolic — response is
not deterrence), transfers (Within reach / Symbolic), compute controls
(Within reach / Meaningful), binding regulation + nonproliferation (Long
shot / Strong, sharing a cell), joint development (Long shot / Decisive),
coordinated halt (Off the table / Decisive). The securitization exception
question carries over with its authored sg/dr/ti answers; the halt answer's
first words are conformed to the new bucket name, and the old
conditional-pause option (now folded into bucket 11's "pre-committed if/then
conditions") gave way to compute controls as the tempting wrong answer.

**Removed from the body, recoverable from git history:** the AIGI taxonomy
block and eight-level list (an older outline revision's shape), the verbatim
bucket bullet list, and the Options 1–11 deep-dive sections ("What carries
over / Where it breaks") — superseded as the delivery vehicle for the same
eleven buckets; their extra historical analysis was never in the outline.
The "Design for the hardest case" closer stays, carrying the note's "justify
course framing around a full pause" goal in prose. `estimatedMinutes` 150 →
35 (it was sized for the reading-heavy draft). Chrome copy fixed in passing:
the widget's closing pointer now names 1.1 (it pointed at "Module 1: The
Compute Supply Chain", a static-course ordering that no longer exists), and
the foot dropped its clause about "the written justification", a task this
section no longer carries.

**policy-plot stood down.** The outline's only prototype links for 1.0.2 are
policy-cost.html and policy-scoping.html (checked in the PDF's link
annotations, v39 and v40 both); the effectiveness × feasibility plot's link
left the document, so its embed left the body and its registry lines are
commented out. Widget and data files stay in the repo, unregistered because
the registry test rightly refuses orphans; remounting is the exercises.ts
line, the registry line, and an embed.

## 1.1 intro rewritten (2026-08-18, owner's text)

The "Module objective" heading, its purpose paragraph and the five
"participants will" bullets — the block the 2026-08-13 entry above
deliberately kept — are replaced by the owner's two second-person
paragraphs: the exercise framing (with policy objectives, verification
mechanisms and evidentiary thresholds, and ambiguities/loopholes/evasion
folded into the prose; the MIRI treaty link kept on its title), then a
transition sending the reader to the Practice Guide first. Two of the old
bullets have no counterpart in the new text and leave with it:
explicit/implicit actors per rule, and the working-notebook observations
prompt. The ReadingCard's opening sentence ("This practical guide is used
by Swiss officials…") duplicated the new transition verbatim and is
trimmed to "Review the following sections:". Headings, the PageBreak
title and both Fold labels conformed to Title Case per the standing
instruction while the lesson was open.
