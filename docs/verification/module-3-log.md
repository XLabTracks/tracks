# Module 3 — build log

Running log for the Verification track's module 3 (`v-covert`, "Covert
development"). Append; do not rewrite. Same contract as `module-2-log.md`.

---

## 2026-08-06 — 3.1.1 promoted to its own subsubmodule

Source: "WIP Verification Track Outline 11", tab "3.1.1 Evasion Scenario
Taxonomy".

The outline gives module 3 three submodules and two subsubmodules:

```
3.0 What is Covert Development?
3.1 How Could a Determined Actor Cheat?
    3.1.1 Evasion Scenario Taxonomy
3.2 Red-team/Blue-team Exercises
    3.2.1 Evasion Scenario Taxonomy Revisited
```

The graph had the three submodules and neither subsubmodule. Both existed, but
as headings inside their parents: the before-the-case taxonomy was a `##` inside
`covert-how-to-cheat.mdx`, and the post-case scored version is a `##` inside
`covert-red-blue.mdx`.

**Done:** `v-covert-taxonomy` (3.1.1) now exists, nested under 3.1 by
`sectionItemId`. The ten-route table was **moved** out of 3.1, not copied. A
second copy inside the same module is the duplication the Verification notes
say to reduce and never widen, so 3.1 keeps a one-line pointer to 3.1.1 and
3.2.1 instead of the table.

**Verified:** all four module 3 routes return 200 against a running server;
3.1.1's title de-duplicates correctly (0 repeats in the body); the sidebar
renders 3.1.1 nested under 3.1; `?u=3.1` still resolves to 3.1's own reading.
Generators clean, typecheck clean, 814 tests pass, 0 lint errors.

---

## 2026-08-06 (later) — the MIRI packet, bullet case, and three link repairs

**The MIRI packet is built.** On the author's instruction, 3.2 now carries the
outline's own five-page adapted packet, transcribed: Articles IV to VII from
Scher et al., *An International Agreement to Prevent the Premature Creation of
Artificial Superintelligence*, and Sections 1 to 3 from Cankaya, *A System
Overview for Near-Term, Low-Trust AI Compute Verification*, both MIRI Technical
Governance Team. The packet's own notice, that it is an instructional
adaptation and not a verbatim reproduction with the originals remaining
authoritative, is reproduced with it rather than stripped, and both originals
are linked at the point of use. Each page keeps its `<Src>` source locator.

The ten expert-review questions are `<Exercise>` writing prompts, the shape
every other written task on this track uses, so they autosave and reach the
review path. Trap worth recording: exercise ids must be
`v-task-<lesson-slug>-<n>`, because `cohort.ts` derives a task's lesson by
parsing its id. Ids of `v-task-covert-review-*` typechecked fine and failed
`cohort.test.ts`; they are `v-task-covert-red-blue-*`.

**Bullet capitalization.** 306 list items across 15 lesson files began with a
lowercase letter and now begin with a capital. Mechanical and uniform; no
wording changed. Worth knowing before anyone reverts it: nearly all of these
were colon-introduced fragment lists with semicolon terminators, where
lowercase is conventionally correct. This was an explicit authoring decision,
not a grammar fix, and one `sed` reverses it.

**Three links repaired**, added as written without liveness testing, per the
same instruction:

- `https://airisk.mit.edu/+` lost its trailing `+`.
- `ai-2040.com/supplements/verification-plan` and `ai-2040.com/supplements/faq`
  were bare text and are now anchors.
- `ai-2027.com` likewise.

All three confirmed rendering as real anchors in the running app. Liveness is
still untested and still blocked; see below.

---

## 2026-08-06 (later still) — citations made resolvable; module priority removed

**Module priority is out of the student-facing text.** The seven route headings
in 3.2 carried `module priority N/5`, and the scoring preamble carried the
sentence explaining it. Both are gone. The outline's own gloss gave the reason:
"'Module priority' reflects emphasis in this course, not a claim about numerical
likelihood." That is course-planning metadata, not something a learner is meant
to reason with. The four analytic columns stay, because those are the substance
of the taxonomy.

**Citations now resolve.** Before this change the bracket numbers were inert
text, and worse, they mostly pointed nowhere:

- 3.1 defined `[2]` to `[21]` but used only `[2]` to `[12]`.
- 3.2 used `[3] [4] [5] [14]` to `[19]` and `[21]` and defined **none** of them.
  The list lived in a different lesson, which on a per-lesson reader is a
  reference to nothing.

Every marker is now an anchor link to an entry in the same lesson, and 3.2 has
its own Sources section carrying exactly the entries it cites. Verified in the
running app: 3.1 defines 20 anchors and links 11 markers, 3.2 defines and links
10, and neither has a dangling target.

**The dead word "Source" is gone.** Each entry in the outline ended with a
hyperlink whose text was "Source"; the docx export flattened it to the bare
word, so 20 entries ended in a meaningless "Source". Where the entry carries an
arXiv id the link was reconstructed from the id ([13] [14] [15] [17] [18] [20]
[21]). The other thirteen had no derivable URL and the bare word was removed
rather than left as furniture. **Those thirteen URLs still need re-adding from
the author's original document**: [2] NSG, [3] Carnegie, [4] IISS, [5] FATF,
[6] BMJ, [7] [8] [9] IAEA, [10] CTBTO, [11] Wassenaar, [12] State Department,
[16] RAND, [19] DOJ.

**Kept deliberately:** 3.1's list retains [13] to [21] even though 3.1 cites
none of them. [13] and [20] are cited by two of the three taxonomy rows still
missing from 3.2, so they are pre-positioned rather than orphaned.

**Fixed my own defect:** the core source packet I added to 2.1.0 carried
bracket numbers [1] [2] [5] [7] from the outline's sixteen-entry list, which
that lesson does not reproduce. Numbers dropped; the citations remain.

### Citations that cannot be resolved, and were not invented

`human-insiders`, `human-institutions` and `human-audits-inspections` cite
`[1] [4] [5] [6] [7] [16]`. **The outline never defines them.** There is no
source list in the 2.4 tabs and none elsewhere in the document; the markers are
orphaned in the source, not lost in transcription. They are left exactly as
found, pending the author. Inventing plausible references for Manheim et al.,
the Frontier AI Auditing paper, or the Curveball postmortem would be
fabricating curriculum.

---

## Open items

1. **3.2.1 is still a heading inside 3.2** and owes the same promotion 3.1.1
   just got. Deferred by the author for now.

2. **3.2's taxonomy table is missing three of the outline's ten routes.**
   `covert-red-blue.mdx` carries seven scored rows. Absent: *hide an undeclared
   cluster*, *attack or capture verification*, and *exploit thresholds or
   definitions*. The outline has all ten with full scores and annotations, so
   this is transcription owed, not a content decision. Deferred by the author
   for now.

3. **Section A of the red-team/blue-team case is still unbuilt.** The author
   note at the top of `covert-red-blue.mdx` has said so since before this
   change; 3.0's worked example stands in for it.

---

## External links: not verified, and why

A link audit was attempted across all verification content and **could not be
completed in this environment**. The session's egress proxy returns
`403 Forbidden` on CONNECT for every host outside its allowlist, including
`arxiv.org`. `/root/.ccr/README.md` says to report blocked hosts rather than
route around them, so no link in this repo currently has a tested status.
Treat the rows below as the static findings only.

What static inspection did establish, no network required:

| Finding | Where |
| --- | --- |
| `ai-2040.com/supplements/verification-plan` written bare, so it renders as text and cannot be clicked | `intuitions.mdx` |
| `ai-2040.com/supplements/faq` written bare | `exercises.ts` |
| `ai-2027.com` written bare | `exercises.ts` |
| `https://airisk.mit.edu/+` has a trailing `+` | `capstone-feasibility.mdx` |
| ~~Two Wikimedia `Special:FilePath` URLs truncated mid-filename~~ **False positive, withdrawn.** The URLs are intact in source (`..._(cropped).jpg?width=256`); the extraction regex cut them at the unbalanced `(`. No defect. | `what-do-they-say.ts` |
| Eight prototype hosts shipped in content, including `rainbow-puppy-79f680.netlify.app` | `facilitator-guide.ts`, `mechanism-effective.mdx`, `scoping-actors.mdx`, `scoping-upstream-downstream.mdx`, `capstone-feasibility.mdx`, `exercises.ts` |

Note that `https://ai-2040.com/?choices=plan-a-root#playbook-insider-pov` does
appear as a real anchor inside a committed Redwood Research artifact, so the
domain is referenced by a third party and was not invented here. Whether it
resolves is untested.

The full extraction is reproducible: 150 distinct URLs plus four bare-domain
references across `src/content/lessons/verification`,
`src/content/verification`, and `src/lib/verification`.

**Nothing above was fixed.** Link repairs are held pending a session with
outbound network, so that a corrected URL can be confirmed rather than guessed.

## Module 3 replaced with the Cankaya working paper

On the course owner's instruction: "Module 3 is supposed to be just [the paper]
and answering its questions — nothing else." The module holds one unit,
`v-covert-system-overview` (3.0), carrying her Module objective and Assignment
text over Naci Cankaya, *A System Overview for Near-Term, Low-Trust AI Compute
Verification*.

**The questions are hers, not the paper's.** The first version of this unit
sent the learner to the paper's own six "Questions for the reader" sections
(#1–#6, on printed pages 5, 8, 10, 11, 13 and 15 — checked in the PDF); she
then replaced them with ten of her own, and those are what ship. The paper's
own sets are no longer referenced.

She then deleted Question 10, leaving nine, and restated the rule: **1, 2 and
5 required, one of 3, 4, 7 and 9, and 8 optional — four answers.** It lives in
`COMPUTE_QUESTIONS` as a `requirement` per question, and the widget's preamble,
the per-question badges and what actually completes the unit are all generated
from it, so they cannot drift apart.

**Two readings that need her word.** Her Assignment paragraph and her Questions
preamble have disagreed about the rule in both versions she sent, and the
preamble is the stale half — it still names a Question 10 that no longer
exists. The Assignment paragraph is what ships, in the lesson and in the data.

And **Question 6 is named by neither half of the new rule**. It is marked
`optional`, so it is there to answer and counts toward nothing. That is a
reading of a gap, not an instruction: if 6 belongs in the choice group, or
should go the way of 10, it is one `requirement` field either way.

The reading links the published page, techgov.intelligence.org, which is also
what citations.json cites; the widget links the PDF for page references. One
work, one row in Works cited. The draft carries no date inside it; June 2026
is what that page shows beside it.

### What was removed

- **Four lessons**, all transcribed from the outline: 3.0 What is covert
  development? (342 lines, including the worked evasion example and the two
  real-world anchors), 3.1 How could a determined actor cheat?, 3.1.1 Evasion
  scenario taxonomy, 3.2 Red-team / blue-team exercises (the five-page adapted
  MIRI packet plus its Section B). All four are in the history.
- **Nine writing tasks**, `v-task-covert-red-blue-1` … `-9`. They asked about
  the adapted packet, which is what the real paper now replaces.
- **26 citation registry entries** that those lessons were the only citers of —
  the A. Q. Khan chronology, the IAEA and CTBT pages, the export-control
  rules, the two DOJ prosecutions, six arXiv papers. Removed rather than left
  as orphans; the registry's own test would have failed on them.

### Still owed, and deliberately not decided here

- ~~**The module is still titled "Covert development"**~~ **Done.** It is now
  *Architecture and Limitations of Low-Trust AI Compute Verification*, on her
  instruction, and the summary is her Module objective. Its slug is still
  `covert-development`, so that is still the URL segment; changing it would
  break every existing link to the module and was not asked for.
- ~~**`data/skills.js` has 21 rungs tagged unit `3.1` or `3.2`.** Those units no
  longer exist, so those rungs can never fill. Nothing crashes and no test
  covers that file; retagging or removing them is the next job here.~~
  **Done** in the 2026-08-19 skill-map v2 rewrite (see `skill-map-log.md`):
  the owner replaced the whole graph; module 3's ladder rungs now tag `3.0`
  and were verified against the paper's question deck, and
  `completion-stats.test.ts` now covers the file.
- **The module-3 written output** (`m3-written-output` in memos.ts) was
  repointed from `covert-red-blue` to the new lesson, which embeds the
  `<MemoDesk/>` card — `memos.test.ts` requires a slot's lesson to embed it
  exactly once, so the desk would otherwise have gone unreachable. Its
  `status` is still `unspecified`: the outline never said what module 3's
  written output is, and the six answer sets have not been declared to be it.

### Module objectives standardized (2026-08-13, owner's edit list)

The "## Module objective" heading and its purpose paragraph are deleted on
the owner's instruction. In their place, at the top of the body: the owner's
new paragraph ("In this module, you will tackle a comprehensive technical
verification system proposal…") plus a module-level
`<Objectives scope="this module">` block. Her bullets 1 and 2 repeated the
assumptions/design-choices/unresolved-problems clause; merged per her
"minor edits for redundancy only" allowance — bullet 1 keeps the
translation claim, bullet 2 the critique of that clause. Her third bullet
names a "realistic facility simulation" that module 3 does not currently
contain — transcribed as given, flagged to her.
