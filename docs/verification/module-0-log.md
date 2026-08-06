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
