# Collusion-Prevention Guided Walkthrough Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace module 5's closing guided walkthrough `c-paper-ua-guided` with a predict-first gated walkthrough of Buck Shlegeris's "How to prevent collusion when using untrusted models to monitor each other" (LessWrong).

**Architecture:** Content-as-code change only. A `Paper` entry in `src/content/papers.data.ts` renders the LessWrong post full-page from a committed artifact built by `npm run lesswrong:build`; a `Paper.edits` array adds silent figure hides, one framing note, five written reading gates, and two reveal notes. No component or lib code changes.

**Tech Stack:** TypeScript content data files, the repo's lesswrong converter pipeline, Vitest content tests.

**Spec:** `docs/superpowers/specs/2026-08-10-collusion-guided-walkthrough-design.md`

## Global Constraints

- Work in the `mod-5` worktree: `~/tracks-viewer/.claude/worktrees/mod-5`, branch `mod-5`. Never push. Never touch `main`.
- Never invent curriculum claims. Editorial note copy must restate the post's own sentences; before committing any note, find the post sentence it restates in the built artifact's HTML and adjust wording to stay accurate.
- Every edit target needs `anchor` + verbatim `snippet` copied from `npm run lesswrong:build -- --blocks <postUrl>` output (the snippet is a drift tripwire checked by `content.test.ts`). Never type snippets from memory.
- Never hand-edit `src/content/linked-readings.json` — only `npm run readings:build` regenerates it.
- Converters run at authoring time only. Committed artifacts are the pin.
- Content tests are the harness: after each task, `npx vitest run src/lib/content/content.test.ts` must pass.
- The post URL: `https://www.lesswrong.com/posts/GCqoks9eZDfpL8L3Q/how-to-prevent-collusion-when-using-untrusted-models-to`. Artifact id: `lesswrong__GCqoks9eZDfpL8L3Q`.

---

### Task 1: Remove c-paper-ua-guided completely

**Files:**
- Modify: `src/content/papers.data.ts` (delete entry at ~lines 1659–1909)
- Modify: `src/content/curriculum.data.ts` (delete one itemId at ~line 162)
- Modify: `src/content/reading-permissions.json` (delete its entry)
- Delete: `src/content/substack/blog.redwoodresearch.org__untrusted-advice-for-ai-control-short.json`
- Delete: `public/substack/blog.redwoodresearch.org__untrusted-advice-for-ai-control-short/` (if it exists)
- Regenerated: `src/content/linked-readings.json` (via script only)

**Interfaces:**
- Consumes: nothing.
- Produces: a module 5 with 13 items and no reference to `c-paper-ua-guided`; Task 2 inserts the replacement in the vacated slot (after `"c-paper-settings-high-stakes"`, before `"c-paper-legibility-guided"`).

- [ ] **Step 1: Delete the paper entry**

In `src/content/papers.data.ts`, delete the whole object for `id: "c-paper-ua-guided"` including its leading comment block (starts `// Control track, module 5: a guided walkthrough of the untrusted-advice`). It runs from that comment to the `},` before the object `id: "c-paper-legibility-guided"`.

- [ ] **Step 2: Delete the curriculum itemId**

In `src/content/curriculum.data.ts`, in `c-mod5`'s `itemIds`, delete the line `"c-paper-ua-guided",`.

- [ ] **Step 3: Delete the permission entry**

In `src/content/reading-permissions.json`, delete the whole `{ "id": "blog.redwoodresearch.org__untrusted-advice-for-ai-control-short", ... }` object from `entries` (keep the array's JSON valid).

- [ ] **Step 4: Delete the artifact and assets**

```bash
git rm src/content/substack/blog.redwoodresearch.org__untrusted-advice-for-ai-control-short.json
git rm -r public/substack/blog.redwoodresearch.org__untrusted-advice-for-ai-control-short 2>/dev/null || echo "no public assets dir"
```

- [ ] **Step 5: Regenerate linked readings**

Run: `npm run readings:build`
Expected: it completes and may shrink `src/content/linked-readings.json`. Do not hand-edit the file.

- [ ] **Step 6: Run the content tests**

Run: `npx vitest run src/lib/content/content.test.ts src/lib/readings/readings.test.ts`
Expected: PASS. A failure naming `c-paper-ua-guided` or the substack artifact means a reference survived — find it with `git grep -n "ua-guided\|untrusted-advice-for-ai-control-short" src` and remove it.

- [ ] **Step 7: Typecheck and commit**

```bash
npm run typecheck
git add -A
git commit -m "Remove the untrusted-advice guided walkthrough from module 5"
```

---

### Task 2: Add the collusion post as a bare paper item

**Files:**
- Modify: `src/content/reading-permissions.json` (add entry)
- Modify: `src/content/papers.data.ts` (new entry, no edits array yet)
- Modify: `src/content/curriculum.data.ts` (itemId + summary sentence)
- Create (generated): `src/content/lesswrong/lesswrong__GCqoks9eZDfpL8L3Q.json` + `public/lesswrong/lesswrong__GCqoks9eZDfpL8L3Q/` assets
- Regenerated: `src/content/linked-readings.json`

**Interfaces:**
- Consumes: the vacated slot from Task 1.
- Produces: paper id `c-paper-collusion-guided` (slug `collusion-guided`) rendering the full post; Tasks 3–5 append to its (initially absent) `edits` array.

- [ ] **Step 1: Add the permission entry**

In `src/content/reading-permissions.json`, add to `entries` (alphabetical/grouped placement beside the other `lesswrong__` ids):

```json
{
  "id": "lesswrong__GCqoks9eZDfpL8L3Q",
  "status": "permitted",
  "note": "Reproduction permission confirmed by project owner, 2026-08-10"
}
```

- [ ] **Step 2: Add the paper entry**

In `src/content/papers.data.ts`, in the position Task 1 vacated (directly before `id: "c-paper-legibility-guided"`'s object):

```ts
{
  // Control track, module 5: a guided walkthrough of Buck Shlegeris's
  // untrusted-monitoring collusion post, in the c-paper-ua-guided style it
  // replaces — predict-first written gates at each design decision, the
  // give-away figures hidden, editorial reveal notes restating the post's
  // own answers. Gates follow the post's order. Edits are added in
  // follow-up commits once the artifact anchors are known.
  id: "c-paper-collusion-guided",
  slug: "collusion-guided",
  moduleId: "c-mod5",
  title: "How to prevent collusion in untrusted monitoring (guided)",
  source: {
    kind: "lesswrong",
    postUrl:
      "https://www.lesswrong.com/posts/GCqoks9eZDfpL8L3Q/how-to-prevent-collusion-when-using-untrusted-models-to",
  },
  estimatedMinutes: 60,
},
```

- [ ] **Step 3: Add the curriculum itemId and rewrite the summary sentence**

In `src/content/curriculum.data.ts`, in `c-mod5`:

1. In `itemIds`, insert `"c-paper-collusion-guided",` after `"c-paper-settings-high-stakes",` and before `"c-paper-legibility-guided",`.
2. In `summary`, replace the clause `the untrusted advice protocol is the boundary case where a safety argument substitutes for a control evaluation;` with `collusion prevention in untrusted monitoring asks whether a second instance of the untrusted model can be made to catch its attacks without the two instances coordinating;`. Leave the rest of the sentence (the legibility clause and the trailing stub note) unchanged.

- [ ] **Step 4: Build the artifact**

Run: `npm run lesswrong:build`
Expected: it fetches and converts the post (network step, authoring-time only) and writes `src/content/lesswrong/lesswrong__GCqoks9eZDfpL8L3Q.json` plus assets under `public/lesswrong/lesswrong__GCqoks9eZDfpL8L3Q/`. Existing artifacts are untouched.

- [ ] **Step 5: Regenerate linked readings**

Run: `npm run readings:build`
Expected: completes; links in the new post to non-permitted posts stay external (correct — do not add permission entries for them).

- [ ] **Step 6: Run the content tests**

Run: `npx vitest run src/lib/content/content.test.ts src/lib/readings/readings.test.ts`
Expected: PASS (a paper with no `edits` is valid; the test verifies artifact freshness + permission).

- [ ] **Step 7: Typecheck and commit**

```bash
npm run typecheck
git add -A
git commit -m "Module 5: add the collusion-prevention post in ua-guided's slot"
```

---

### Task 3: Silent figure hides + framing note

**Files:**
- Modify: `src/content/papers.data.ts` (add `edits` to `c-paper-collusion-guided`)

**Interfaces:**
- Consumes: the built artifact from Task 2.
- Produces: the `edits: [...]` array on `c-paper-collusion-guided`; Tasks 4–5 append gate and note objects to this same array, keeping post order.

- [ ] **Step 1: Print the block map**

Run: `npm run lesswrong:build -- --blocks "https://www.lesswrong.com/posts/GCqoks9eZDfpL8L3Q/how-to-prevent-collusion-when-using-untrusted-models-to" | head -120`
(offline — reads the committed artifact). Also run with `-- --toc <same url>` for section ids. Identify:

- **F1**: the deployment-architecture figure block (input → policy → monitors → decision flow), early in "A basic design for untrusted monitoring".
- **F2**: the suspiciousness-threshold figure block (execute/replace/audit regions), shortly after F1.
- **P-intro**: the last prose block of the introduction before the "A basic design for untrusted monitoring" heading.

Record each block's anchor (`b-NNNN`) and, for prose blocks, the verbatim snippet text the tool prints. Every anchor below written `b-XXXX` must be replaced with the real recorded anchor; every snippet must be pasted from tool output, not typed.

- [ ] **Step 2: Add the hides and the framing note**

Add to the entry from Task 2, replacing the trailing `},` of `estimatedMinutes: 60,` line's object end — i.e. insert `edits: [...]` after `estimatedMinutes`:

```ts
edits: [
  // ---- Spoiler control ----------------------------------------------
  // The architecture figure and the threshold figure are removed silently:
  // together they hand the learner the scaffold that gate 1 asks them to
  // invent. (Caption-less figures have no prose to snippet against — the
  // anchor is the whole target and the snippet is documentary; see the
  // text-less-block path in patch-section.ts and content.test.ts.)
  {
    op: "hide",
    at: {
      anchor: "b-XXXX", // F1
      snippet: "Figure: untrusted-monitoring deployment architecture",
    },
    silent: true,
  },
  {
    op: "hide",
    at: {
      anchor: "b-XXXX", // F2
      snippet: "Figure: suspiciousness thresholds (execute / replace / audit)",
    },
    silent: true,
  },
  {
    op: "add",
    after: { anchor: "b-XXXX", snippet: "<paste P-intro snippet>" }, // P-intro
    label: "About this version",
    markdown:
      "Following the same format as this module's other guided readings, " +
      "this walkthrough pauses at each design decision to pose the " +
      "question before the post's own answer is revealed, and hides the " +
      "figures that would give the design away. The full post, freely " +
      "available [on LessWrong](https://www.lesswrong.com/posts/GCqoks9eZDfpL8L3Q/how-to-prevent-collusion-when-using-untrusted-models-to), " +
      "is the source of everything below.",
  },
],
```

If a figure has a caption, snippet against the caption text from `--blocks` instead of the documentary string. If the converter emitted the figures inside a prose block (no separate figure block), hide the containing block and note that in the comment.

- [ ] **Step 3: Run the content tests**

Run: `npx vitest run src/lib/content/content.test.ts`
Expected: PASS. Snippet-tripwire failures name the drifted edit — re-copy the snippet from `--blocks` output.

- [ ] **Step 4: Visual spot-check**

Run: `npm run dev`, open `/tracks/ai-control/module-5/collusion-guided` (if the module slug 404s, take the module slug from the sidebar — this branch predates main's renumbering). Confirm: both figures gone without a marker, the navy "About this version" note renders after the intro.

- [ ] **Step 5: Commit**

```bash
git add src/content/papers.data.ts
git commit -m "Collusion walkthrough: hide the give-away figures, add the framing note"
```

---

### Task 4: The five reading gates

**Files:**
- Modify: `src/content/papers.data.ts` (append to `c-paper-collusion-guided`'s `edits`)

**Interfaces:**
- Consumes: the `edits` array from Task 3; anchors from the block map.
- Produces: gate ids `invent-scaffold`, `monitor-value`, `break-protocol`, `honeypot-detection`, `defense-design` (Task 5's reveal notes sit after the sections gates 3 and 5 open).

- [ ] **Step 1: Resolve the five gate anchors**

From the `--blocks` output, record the anchor + verbatim snippet of the last block **before** each of these post sections (a gate placed `after` that block locks the rest of the post until answered):

- **G1** → before the "A basic design for untrusted monitoring" section body (this is the same P-intro block Task 3's note uses; the gate goes after the note's block so the note stays visible above the gate).
- **G2** → before "How helpful would this be if the untrusted monitor did its best?".
- **G3** → before "Analyzing under the adversarial assumption".
- **G4** → before "How hard is it for a schemer to distinguish real from synthetic attacks?".
- **G5** → before "Preventing collusion under coordination assumptions".

- [ ] **Step 2: Append the five gates**

Append to the `edits` array, in this order (post order — keep Task 3's hides/note first):

```ts
// ---- Gate 1: invent the scaffold ----------------------------------
{
  op: "gate",
  after: { anchor: "b-XXXX", snippet: "<paste G1 snippet>" },
  id: "invent-scaffold",
  written: true,
  minChars: 80,
  cta: "Continue",
  prompt:
    "You have an untrusted model U doing useful work in a high-stakes " +
    "deployment, a weaker trusted model T, and a small budget of human " +
    "audits. Design a deployment that uses another instance of U to catch " +
    "U's attacks.\n\nDescribe: what the monitor instance sees, what it " +
    "outputs, and what the protocol does at each level of suspiciousness.",
},
// ---- Gate 2: argue the value --------------------------------------
{
  op: "gate",
  after: { anchor: "b-XXXX", snippet: "<paste G2 snippet>" },
  id: "monitor-value",
  written: true,
  minChars: 60,
  cta: "Continue",
  prompt:
    "Before the post argues it: assume for now that the monitor instance " +
    "does its best. Why would an untrusted monitor catch attacks that the " +
    "trusted monitor misses? Give the strongest reason you can.",
},
// ---- Gate 3: break the protocol -----------------------------------
{
  op: "gate",
  after: { anchor: "b-XXXX", snippet: "<paste G3 snippet>" },
  id: "break-protocol",
  written: true,
  minChars: 80,
  cta: "Continue",
  prompt:
    "Now take the red team's seat: you are the scheming model, playing " +
    "both the policy and the monitor. Before deployment, the monitor was " +
    "validated on synthetic attacks — it had to rate them suspicious to " +
    "pass.\n\nFind a monitoring policy that passes that validation and " +
    "still lets real attacks through.",
},
// ---- Gate 4: red-team the honeypots -------------------------------
{
  op: "gate",
  after: { anchor: "b-XXXX", snippet: "<paste G4 snippet>" },
  id: "honeypot-detection",
  written: true,
  minChars: 80,
  cta: "Continue",
  prompt:
    "The colluding policy from the last section only works if the monitor " +
    "can tell real attacks from synthetic ones.\n\nList the mechanisms a " +
    "schemer could use to make that distinction. Aim for at least three.",
},
// ---- Gate 5: design the defenses ----------------------------------
{
  op: "gate",
  after: { anchor: "b-XXXX", snippet: "<paste G5 snippet>" },
  id: "defense-design",
  written: true,
  minChars: 100,
  cta: "Continue",
  prompt:
    "Suppose the policy and the monitor can coordinate on a signal: a code " +
    "word, a stylistic quirk, a property of the input.\n\nDesign the blue " +
    "team's defenses. How do you stop a signal from getting through, and " +
    "how do you catch a monitor that tries to use one?",
},
```

- [ ] **Step 3: Run the content tests**

Run: `npx vitest run src/lib/content/content.test.ts`
Expected: PASS.

- [ ] **Step 4: Visual pass of the gate walk**

In `npm run dev`, walk the paper start to finish: each gate must appear at its section boundary, lock the sidebar rows below it (`gateIds`), accept a written answer of the minimum length, and reveal the next span on Continue.

- [ ] **Step 5: Commit**

```bash
git add src/content/papers.data.ts
git commit -m "Collusion walkthrough: five predict-first reading gates"
```

---

### Task 5: The two reveal notes

**Files:**
- Modify: `src/content/papers.data.ts` (append to `c-paper-collusion-guided`'s `edits`)

**Interfaces:**
- Consumes: the gated sections from Task 4.
- Produces: the finished walkthrough; Task 6 verifies the whole.

- [ ] **Step 1: Resolve the two note anchors and verify the claims**

From `--blocks`, record the anchor + snippet of (**N1**) the block where the post states the conditional truth-telling policy (in "Analyzing under the adversarial assumption") and (**N2**) the last block of "Preventing collusion under coordination assumptions". Then read those sections' actual text in the artifact HTML and check every claim in the note drafts below; reword anything the post does not say. The notes restate the post — they never add claims.

- [ ] **Step 2: Append the notes**

Insert each note into the `edits` array at its post-order position (N1 between gates 3 and 4; N2 after gate 5):

```ts
// ---- Reveal: the collusion policy ---------------------------------
{
  op: "add",
  after: { anchor: "b-XXXX", snippet: "<paste N1 snippet>" },
  label: "",
  markdown:
    "The attack the post settles on is conditional truth-telling: rate " +
    "the synthetic attacks honestly, since those are the ones validation " +
    "checks, and wave the real ones through. Whether this works reduces " +
    "to a discrimination problem — can the monitor instance tell a real " +
    "attack from a synthetic one? — which is why the next sections are " +
    "about making that discrimination as hard as possible.",
},
// ---- Reveal: the defense toolkit ----------------------------------
{
  op: "add",
  after: { anchor: "b-XXXX", snippet: "<paste N2 snippet>" },
  label: "",
  markdown:
    "The defenses stack rather than substitute: redact or paraphrase the " +
    "parts of the input a coordination signal could ride on, seed the " +
    "stream with known attacks a colluding monitor would have to wave " +
    "through and thereby expose itself, and use the trusted monitor to " +
    "flag outputs that look like signaling. None is airtight alone; " +
    "together they force the schemer to thread a much smaller needle.",
},
```

(Adjust both texts in Step 1's verification before committing if they drift from the post.)

- [ ] **Step 3: Run the content tests**

Run: `npx vitest run src/lib/content/content.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/content/papers.data.ts
git commit -m "Collusion walkthrough: reveal notes for the attack and the defenses"
```

---

### Task 6: Full verification

**Files:** none modified.

**Interfaces:**
- Consumes: everything above.
- Produces: a verified, commit-clean walkthrough on `mod-5`.

- [ ] **Step 1: Full test suite**

Run: `npm run test`
Expected: PASS (all suites, not just content).

- [ ] **Step 2: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: both clean.

- [ ] **Step 3: End-to-end visual pass**

In `npm run dev`, signed in (set `DEV_USER=1` in `.env` if needed):

1. Module 5's sidebar shows the new item between the settings-high-stakes reading and the legibility walkthrough; the old untrusted-advice item is gone everywhere (sidebar, module page, /resources).
2. Walk the full paper: figures hidden, framing note, five gates in order, both reveal notes, footnote sidenotes render, trailing references stay outside the gate walk.
3. The module page shows the rewritten summary sentence.

- [ ] **Step 4: Confirm clean tree**

Run: `git status`
Expected: clean; all work committed on `mod-5`. Do not push (pre-push rebase over main's renumbering is a separate, later step).
