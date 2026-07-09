# Authoring guide

How to add content to Tracks. **Content is code**: the graph (tracks → modules →
units → lessons, plus exercises, assessments, resources) is defined in typed TS data
files under `src/content/`, and lesson bodies are MDX under `src/content/lessons/`.
There is **no database or CMS for content** and **no route files to add** — pages
resolve by slug automatically.

A few rules that apply throughout:

- **Hierarchy:** `Track → Module → Unit → Lesson`. A track holds ordered **modules**;
  a module holds ordered **units**; a **unit** holds ordered **lessons**; a lesson
  points at one MDX body. A unit is the navigable grouping between a module and its
  lessons — it has its own overview page. **Every module has at least one unit**; a
  module that needs no real grouping just gets a single unit that holds all its
  lessons (see `ex-content-u` / `ex-assess-u` for the one-unit pattern).
- **The `*Ids` arrays drive everything.** Adding a `Lesson`/`Unit`/`Module`/`Track`
  object is not enough — you must also list its `id` in the parent's `lessonIds` /
  `unitIds` / `moduleIds` array. Those arrays set order (sidebar, prev/next) and
  membership.
- **`id` is globally unique; `slug` is unique within its parent.** URLs use slugs:
  a lesson lives at `/tracks/<trackSlug>/<moduleSlug>/<unitSlug>/<lessonSlug>` and a
  unit's own overview page at `/tracks/<trackSlug>/<moduleSlug>/<unitSlug>`. (The
  module-level `assessment` page stays a sibling of the units.)
- **Verify after editing:** `npm run typecheck` (catches shape errors) and
  `npm run test` — `src/lib/content/content.test.ts` checks referential integrity
  (every `moduleIds`/`unitIds`/`lessonIds`/`prerequisiteModuleIds`/`assessmentId`
  resolves, and each lesson's `unitId`/`moduleId` matches its containing unit).
- Placeholder copy is lorem ipsum — keep it lorem or leave it empty; don't invent
  real curriculum.

---

## 1. Add a lesson / sublesson to a track

A "sublesson" is a `Lesson` — the MDX page inside a module. To add one to an
**existing** module:

1. **Add the lesson object** to the `lessons` array in
   `src/content/curriculum.data.ts`:

   ```ts
   {
     id: "g-intro-l3",        // globally unique
     slug: "frameworks",      // unique within the unit; used in the URL
     moduleId: "g-intro",     // the module it belongs to (denormalized)
     unitId: "g-intro-u1",    // the unit it belongs to
     title: "Governance frameworks",
     order: 3,                // 1-based position within the unit
     contentRef: "g-intro-l3", // MDX filename (without .mdx); convention: same as id
     estimatedMinutes: 12,
     optional: true,           // optional; excludes the lesson from progress
                               // tracking and module/track completion, and
                               // shows an "Optional" badge in the UI
   }
   ```

2. **Register it in the unit's `lessonIds`** (same file, in the `units` array) —
   append the `id` in the position you want it to appear:

   ```ts
   // unit "g-intro-u1"
   lessonIds: ["g-intro-l1", "g-intro-l2", "g-intro-l3"],
   ```

3. **Create the MDX body** at `src/content/lessons/<contentRef>.mdx`
   (e.g. `src/content/lessons/g-intro-l3.mdx`). If the file is missing the lesson
   404s. Inside the MDX you can use these components (no imports needed):

   ```mdx
   Lorem ipsum intro paragraph.

   <Video src="https://www.youtube.com/watch?v=…" title="Optional caption" />

   ## A heading

   <Callout variant="tip" title="Optional title">A note for learners.</Callout>

   <Demo id="sample-demo" />

   <Exercise id="ex-mc-3" />

   A claim that needs a source.<Footnote>The footnote body — can hold prose, links,
   `code`, etc.</Footnote>
   ```

   - `<Video src … title? provider? poster? />` — provider (`youtube`/`vimeo`/`file`)
     is inferred from the URL when omitted.
   - `<Callout variant?="note|tip|warning" title?>…</Callout>` (defaults to `note`).
   - `<Demo id="…" />` — a demo registered in the demo registry (see §2–3).
   - `<Exercise id="…" />` — an exercise defined in `src/content/exercises.data.ts`
     (see §5 for the available types).
   - `<ExerciseSequence ids={["…", "…"]} label?="…" />` — several exercises as one
     stepped card (see §5).
   - `<Footnote>…</Footnote>` — drop it right after the word/claim it annotates, no
     id needed. It numbers itself automatically (in document order) and renders as
     a sidenote in the right margin on wide screens, or a tap-to-expand marker on
     narrower ones — no separate "References" section at the bottom of the lesson.
   - `$inline math$` and `$$block math$$` — LaTeX math via `remark-math` +
     `rehype-katex`, rendered with KaTeX. Plain markdown, no component needed.
   - `<TracksAddition label?="…">…</TracksAddition>` — wrap **text only** (an
     editorial aside, framing for what follows) that Tracks added on top of a
     verbatim source reproduction, so it reads as clearly separate from the source.
     Defaults `label` to "Tracks addition".
     **Rule: never put a `<Demo>`/`<Exercise>`/`<ExerciseSequence>` inside a
     `<TracksAddition>`.** Those components carry their own card chrome in the same
     tint, so nesting them produces an ugly brown-on-brown box, and they're already
     self-evidently not part of the source paper. Put the framing text in the
     `<TracksAddition>`, then place the demo/exercise immediately **after** the
     closing tag. See `src/content/lessons/c-paper-l4.mdx` around
     `<Demo id="safety-usefulness-frontier" />` for the pattern.

The lesson is now live at `/tracks/<trackSlug>/<moduleSlug>/<unitSlug>/<lessonSlug>`
and shows in the sidebar + prev/next.

**Adding a new unit** (a grouping of lessons within a module) is the same shape one
level up: add a `Unit` to the `units` array (`id`, `slug` unique within the module,
`moduleId`, `title`, `order`, `lessonIds: []`, optional `summary` / `estimatedMinutes`
/ `optional`), add its `id` to the module's `unitIds`, then add lessons as above. A
unit gets its own overview page automatically at
`/tracks/<trackSlug>/<moduleSlug>/<unitSlug>`. In the sidebar, a unit's title only
shows as a sub-header when its module has more than one unit; single-unit modules
render their lessons directly, so the extra layer stays invisible where it isn't
needed.

**Adding a new module** is one level up again: add a `Module` to the `modules` array
(`id`, `slug`, `trackId`, `title`, `summary`, `order`, `prerequisiteModuleIds: []`,
`unitIds: []`, optional `assessmentId` / `furtherReadingTopics` / `estimatedMinutes`),
add its `id` to the track's `moduleIds`, then add **at least one unit** and its
lessons as above. To attach an end-of-module assessment, add an `Assessment` to
`src/content/assessments.data.ts` with `moduleId` set to the module (assessments
attach to the module, not a unit), and set the module's `assessmentId` to match.

---

## 2. Create a new demo

A demo is a **self-contained client component** with no app dependencies and **no
required props** (the registry renders it as `<Component />`).

1. **Write the component** under `src/components/demos/` — either add to
   `sample-demos.tsx` or create a new file. It must start with `"use client"`:

   ```tsx
   "use client";
   import { useState } from "react";

   export function MyDemo() {
     const [n, setN] = useState(0);
     return <button onClick={() => setN(n + 1)}>Clicked {n}</button>;
   }
   ```

2. **Register it** in `src/lib/demos/registry.ts` — import the component and add an
   entry keyed by a unique `id` (a `DemoDefinition`):

   ```ts
   import { MyDemo } from "@/components/demos/sample-demos";

   export const demoRegistry: Record<string, DemoDefinition> = {
     // …existing entries…
     "my-demo": {
       id: "my-demo",
       title: "My demo",
       description: "What it shows.", // optional
       component: MyDemo,
       tags: ["placeholder"],         // optional
     },
   };
   ```

That's all. The demo is now reachable everywhere by its `id`: the gallery
(`/demos`), a standalone page (`/demos/my-demo`), the chrome-less iframe embed
(`/demos/my-demo/embed`), and inside any lesson via `<Demo id="my-demo" />`. The
demo renders inside a titled `DemoFrame` by default.

---

## 3. Add a demo to a track

Demos attach to a track by being embedded in one of its lessons:

1. Make sure the demo is registered (see §2) and note its `id`.
2. In the target lesson's MDX (`src/content/lessons/<contentRef>.mdx`), drop the tag
   where you want it:

   ```mdx
   <Demo id="my-demo" />
   ```

It renders inline in that lesson within the track. The tag only takes `id` — demo
state/props live inside the component itself. (Demos are also browsable in the
`/demos` gallery and embeddable in external pages via `/demos/<id>/embed` without
touching any track.)

---

## 4. Create a new track

1. **Add the track** to the `tracks` array in `src/content/curriculum.data.ts`:

   ```ts
   {
     id: "evals",
     slug: "evals",                       // URL: /tracks/evals
     title: "AI Evaluations",
     shortTitle: "Evals",                 // optional, for compact UI
     description: "Lorem ipsum…",
     kind: "technical",                   // "foundations" | "technical" | "governance"
     moduleIds: ["e-intro"],              // ordered module IDs (added next)
     prerequisiteEnforcement: "soft",     // "soft" (warn) | "hard" (lock)
     estimatedHours: 12,                  // optional
   }
   ```

2. **Add its modules** to the `modules` array, each with `trackId: "evals"`, and
   list their `id`s in the track's `moduleIds` (ordered). See §1 for module fields.

3. **Add lessons + MDX** for each module as in §1.

4. **Optional content:** assessments (`assessments.data.ts` + `module.assessmentId`),
   exercises (`exercises.data.ts`, referenced via `<Exercise id />` in MDX), and
   "Further reading" (tag resources in `resources.data.ts`, then set the module's
   `furtherReadingTopics` to matching topic strings).

The track appears on `/tracks` and is reachable at `/tracks/<slug>` automatically —
no routing or DB changes. Prerequisites may point at modules in **other** tracks
(cross-track gating), so you can require a Foundations/Control module before a
Governance one.

> **New `kind` value?** `kind` is the `TrackKind` union in
> `src/lib/content/types.ts`. To add a kind beyond foundations/technical/governance,
> extend that union **and** add a label to the `KIND_LABEL` map in
> `src/app/tracks/page.tsx`.

---

## 5. Exercises

Exercises live in `src/content/exercises.data.ts` (typed as `Exercise` from
`src/lib/content/types.ts`) and are embedded in lesson MDX by id via
`<Exercise id="…" />`. Ids are globally unique. The Example track contains one
exercise of every type with self-describing copy — the first entries of
`exercises.data.ts` (`multiple-choice`, `multi-select`, `true-false`,
`understanding-check`, `tap-reveal`, `writing-prompt`, `short-answer`) double as
authoring templates.

There are two families. **Closed** exercises (`ClosedExerciseType`) are graded or
self-assessed in place; **open** exercises (`OpenExerciseType`) are written
deliverables with drafts and an explicit submit. Everything works signed-out;
attempts are only persisted (as `Submission` rows) for signed-in users.

### Closed types

- **`multiple-choice`** — `options` plus `correctOptionIds` with exactly one
  entry. Graded instantly on the server (`gradeExercise`); an optional
  `explanation` is shown after answering. Set `monospaceOptions: true` to render
  option labels in code style ("pick the line" questions).
- **`multi-select`** — same shape, several `correctOptionIds`. Grading is
  exact-match: every correct option selected and no incorrect ones.
- **`true-false`** — a choice exercise whose two options are conventionally
  `{ id: "true", label: "True" }` / `{ id: "false", label: "False" }`.
- **`understanding-check`** — "answer in your own words, then compare". The
  learner self-attempts, then reveals `sampleAnswer`. Not auto-graded and not
  persisted.
- **`tap-reveal`** — a recall card: short `prompt`, hidden `answer` revealed on
  tap, then a yes / partial / no self-rating. The rating is persisted
  (score 1 / 0.5 / 0) with `updatedAt` as the review timestamp, intended to
  drive spaced repetition later.
- **`flowchart`** — the learner reconstructs one or more flowcharts by dragging
  blocks from a `palette` (shared across all `stages`, so wrong-but-plausible
  picks exist). Blocks are `step`, `branch` (with `branchLabels` naming the
  arms), or `terminal`. Each stage has a prose `description` (behind a reveal
  toggle), a `solution` tree, and an optional `explanation`. Stages are graded
  server-side by structural equality; after repeated misses the UI offers a
  solution reveal. The per-stage attempts persist in one submission row with a
  fractional score.

### Open (writing) types

`short-answer`, `writing-prompt`, `memo`, and `essay` all share the
`WritingExercise` shape and differ only in intent and expected length. Each has
a `format` (`DeliverableFormat`: `free-form`, `memo`, `essay`,
`research-summary`, `policy-memo`, `bill-draft`, `briefing`), optional
`minWords` / `maxWords`, an optional `rubric` (criteria shown to the learner —
there is no auto-grading), and optional `sections`: when present the editor is
split into labelled sections with per-section placeholder/guidance; when
omitted it is a single free-form editor. Drafts autosave (`saveWritingDraft`)
and the learner submits explicitly (`submitWriting`). End-of-module
**assessments** (`assessments.data.ts`) are a specialized written deliverable
that reuses the same `WritingEditor`, not an exercise type.

### Sequences

`<ExerciseSequence ids={[…]} label?="…" />` groups several exercises into one
stepped card, shown one part at a time, each unlocked by completing the
previous. Only `understanding-check`, `tap-reveal`, and the choice types are
sequence-compatible; flowchart and writing exercises must be embedded
standalone.

### Answer keys are server-only

`correctOptionIds`, `explanation`, and flowchart `solution` / stage
`explanation` never reach the client: the server dispatcher
(`src/components/mdx/exercise.tsx`) strips them via `toPublicChoice` /
`toPublicFlowchart` (`src/lib/content/exercise-view.ts`), and grading happens
in server actions (`src/app/actions/exercises.ts`) that re-validate their
payloads. Never pass a raw `Exercise` object into a client component.
