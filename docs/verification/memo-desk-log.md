# Memo desk — build log

The desk is cross-module, so its decisions live here rather than in one
module's log. Append, don't rewrite.

## 2026-09-13 — every written component, one registry

The owner's instruction: the memo desk must reflect ALL written components
of the course, the about page too, and the desk must be reachable from
inside the curriculum. Before this the desk listed ten module-level slots
while the lessons carried 21 writing exercises (`<Exercise id="v-…"/>`,
type `writing-prompt`, answered in the lesson's own editor and saved as
Submissions) that no index anywhere named in full — the account and cohort
pages listed only the `v-task-*` ones, by an id-naming convention that the
2.1.1 and 2.3 exercises did not follow.

- **`memos.ts` is now the registry of every written component**, in three
  shapes: a desk slot (drafted on the desk, brief quoted from the outline,
  `<MemoDesk/>` card in the lesson); a lesson task (`task: "v-…"` — the
  exercise's prompt IS the brief and is never copied; the exercise embed is
  the card); a page slot (`href`, the capstone workspace). 28 slots.
- **Lesson tasks registered**: 0.0 welcome note, 0.1 strongest objection,
  the 0.2 essay's ten steps (A1–A5, B1–B5) plus the two optional 0.2
  tasks, 0.4 actor–authority–evidence map, 2.1.1 Chip Security Act
  breakdown, the five 2.3 intelligence exercises. Titles are the lessons'
  own headings or the prompts' own opening lines.
- **Slots that changed shape**: `m0-hinge-brief` (was the "A or B" desk
  essay) is now the A5 task; `m0-plan-a-vs-s` is B5; `m0-success-scenario`
  is the optional 0.2 essay task; `m1-actor-authority-evidence` (was "named
  only" on 1.3) is the 0.4 exercise that now exists — ids kept where drafts
  or notebook memo blocks may key on them; the desk shows any earlier desk
  draft under a task slot as "An earlier draft from this desk" rather than
  dropping it. `m1-optional` was retired: the "[Optional] Written output:"
  marker it described is no longer in 1.3 (the optional written output is
  the 0.4 exercise). `m1-case-briefing` (named only) and
  `m3-written-output` (unspecified) stay as they are — still owed upstream.
- **Generator** (`build-verification-memos.mjs`) resolves task slots from
  `exercises.ts` (prompt, word range, optional) and `curriculum.ts` (the
  lesson page, plus `#<exercise id>` — the writing card now carries its id
  as an anchor), so the static desk links straight to the writing box.
- **Desk** (`memo-desk.js`): a task or page slot hides the memo instruments
  and shows where the writing lives, a link there, and — signed in — the
  saved answer through `/api/verification/writing` (widened from `v-task-*`
  to every verification writing exercise), the same route the notebook's
  Written work page reads; no second copy anywhere.
- **Reachable from the curriculum**: the notebook's footer, which is on
  every course page, gained a "Memo desk" button beside "Written work"; the
  `<MemoDesk/>` cards on desk slots still link in; the about page's copy
  says what the desk lists and its count is the registry's length.
- **`cohort.ts`** derives the task list from the registry instead of the id
  convention, so the account and cohort pages now list all 21 tasks.
- **Tests** (`memos.test.ts`): every writing exercise the track declares has
  exactly one slot and is embedded exactly once by the slot's lesson; desk
  slots' lessons embed the card exactly once; task slots agree with their
  exercise on `optional`.

Not done, and owed: the desk's rail is a scrolling column at 28 rows; the
intel exercises are titled by their lesson ("Imagery and Geospatial
Intelligence Exercise") because their headings say only "Exercise" — an
authored title per exercise would be better and is the owner's to give.

## 2026-09-13 — the 0.2 essay is two rows, not ten; a pilot sidebar block

Owner's instructions, same day. Both are on the unpushed pilot branch and
go against earlier teammates' decisions on purpose — review before merging.

- **0.2 consolidated.** The ten A1–A5 / B1–B5 rows became two grouped
  slots, `m0-hinge-brief` (Essay A: Stress-Test Plan A) and
  `m0-plan-a-vs-s` (Essay B: Plan A vs. Plan S). A grouped slot carries
  `steps: [{ task, title }]`; the generator resolves each step's prompt,
  budget and lesson link, and the desk lists the steps inside the row,
  each with its own brief, link and saved answer. The group's brief is the
  former slot's own wording, split per track. 20 slots.
- **Pilot: the Skill Map leaves the notebook.** The notebook's permanent
  last page (its own rung ladder, a second copy of the map's arithmetic)
  is deleted, with `openSkills` and the `page="skills"` notebook link. In
  its place the Verification track's sidebar pins a block at its bottom:
  a course progress bar (required items read / total, the fraction in
  digits beside it) and two rows, Skill Map and Memo desk — the two
  learner surfaces that are not lessons. `CourseTools` in
  `track-sidebar.tsx`, Verification routes only. The landing's skill-map
  intro now says the map is at the bottom of the course sidebar.
- **4.2 links the workspace.** The capstone's registry entry (`m4-capstone`,
  an `href` slot) now renders in the lesson as the same "Written output"
  card the desk slots use, with a filled "Open the capstone workspace"
  button, placed under the lesson's opening line before the sign-up sheet
  and the bank. `memoCardSlotsForLesson` is desk + page slots; task slots
  are still the exercise embed.
