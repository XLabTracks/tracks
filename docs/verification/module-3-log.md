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
