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
