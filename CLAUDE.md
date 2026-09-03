# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Tracks is an AI-safety learning platform (Khan Academy–style) with two
tracks — **Control** (technical) and **Verification**. Both tracks carry
human-authored curriculum and reproduced readings. **Never invent or
fabricate curriculum content** — real content is human-authored or reproduced
with permission; otherwise use lorem ipsum or leave it empty. `AUTHORING.md`
is the step-by-step guide for adding content (its rules are enforced by
`src/lib/content/content.test.ts`).

**Before writing anything new, ask whether it already exists in this
codebase.** The recurring defect in this repo is not bad code, it is code
that already existed being written again — an audit measured one eyebrow
recipe copied 38 times, one textarea class 12 times, four card treatments,
four focus idioms, and 200 lines of CSS whose whole job was to undo arbitrary
font sizes. Reuse first; failing that, ask whether the stdlib or the platform
does it; only then write it.

## Commands

- `npm run dev` — dev server (Turbopack). DB-backed pages need `DATABASE_URL`
  in `.env` (a PlanetScale dev branch or any local Postgres).
- `npm run build` / `npm run start` — production build / serve (plain Node)
- `npm run preview` — OpenNext build + serve in workerd locally (the real
  Workers runtime; uses `.dev.vars`)
- `npm run typecheck` — `tsc --noEmit` (do this after edits; the build also type-checks)
- `npm run lint` — ESLint
- `npm run test` — Vitest (all). Single file: `npx vitest run src/lib/content/exercise-view.test.ts`; by name: `npx vitest run -t "gradeChoice"`
- `npm run arxiv:build` — convert every arXiv paper the content references into
  committed artifacts (`src/content/arxiv/*.json` + `public/arxiv/*`; network,
  authoring-time only). `-- --id <id>` builds one paper; `-- --toc <id>` /
  `-- --blocks <id> [--section <toc-id>]` print section ids / block anchors +
  sentences from the committed artifact (offline — the source for edit targets).
- `npm run substack:build` — the same pipeline for Substack-post papers
  (`src/content/substack/*.json` + `public/substack/*`); same
  `--id/--toc/--blocks` flags (post URL or `{host}__{slug}` artifact id), plus
  `--refresh` to refetch a post the author has edited.
- `npm run lesswrong:build` — likewise for LessWrong / Alignment Forum posts
  (`src/content/lesswrong/*.json` + `public/lesswrong/*`; fetched via the
  public ForumMagnum GraphQL API; artifact ids are `{site}__{postId}`).
- `npm run gdoc:build` — re-sync every lesson body generated from a shared
  Google Doc (`scripts/build-gdoc.ts`; network, authoring-time only). The
  registry is the `DOCS` array in that script; `-- --check` reports a stale
  copy without writing, and is deliberately not in CI (the input is somebody
  else's live document, so drift is news, not a broken build). It re-syncs on
  its own weekly — `.github/workflows/gdoc-sync.yml` runs the build and opens
  a pull request when the doc has moved, so a verbatim reproduction is never
  updated without somebody reading the diff.
- `npx prisma generate` — regenerate the client after editing `prisma/schema.prisma`.
  Do **not** run `prisma migrate` against the hosted DB (see Database & deploy).
- `npm run cf-typegen` — regenerate `cloudflare-env.d.ts` after changing
  bindings in `wrangler.jsonc`.
- `npm run verification:course` — regenerate `public/verification/data/course.js`
  from `src/content/verification/curriculum.ts`, the single source of the
  Verification module and unit list. `-- --check` fails when they have drifted.
- `npm run verification:memos` — regenerate `public/verification/data/memos.js`
  from `src/content/verification/memos.ts`, the single source of the course's
  written-output slots. `-- --check` fails when they have drifted.
- `npm run verification:chrome` — regenerate `public/verification/data/chrome.js`
  (the standalone pages' shared header/footer data) from
  `src/lib/verification/chrome.ts`. `-- --check` fails on drift; never
  hand-edit the output.
- `npm run felonybench:build` — re-import the FelonyBench incident table into
  `src/content/felonybench.json` (network, authoring-time only; a weekly
  workflow, `.github/workflows/felonybench-sync.yml`, opens a PR when the
  table moves).
- `npm run verification:capstones` — rebuild the Verification capstone bank
  from `verification-capstones/*.md` into
  `public/verification/data/capstone-bank.js`. `-- --check` verifies the two
  have not drifted. Authoring-time only; the output is committed.
- `npm run icon:build` — render `src/app/icon.png` from the standalone solid X
  in `public/xlab-mark.svg`. It is the only favicon source; do not cut the
  striped X out of the wordmark or add a competing `favicon.ico`. `-- --check`
  reports drift. Authoring-time only; the output is committed.

Setup: `cp .env.example .env`, then fill the `WORKOS_*` values (AuthKit, Google
enabled, redirect `/callback`) and `DATABASE_URL` (see `.env.example`). Public
pages render without any of this; auth + persistence do not.

## Non-obvious constraints

- **Middleware deliberately uses the deprecated `src/middleware.ts` convention,
  NOT Next 16's `proxy.ts`.** proxy.ts compiles to Node middleware, which
  `@opennextjs/cloudflare` rejects at build time (opennextjs-cloudflare#1277).
  Do not "fix" the deprecation warning by renaming to proxy.ts.
- **Next.js 16** (see `@AGENTS.md`): `params`/`searchParams` are **async
  Promises** (always `await`); Cache Components is intentionally **off** — don't
  enable it casually (it would force `<Suspense>`/`use cache` everywhere). Stay
  on Next 16.2.x — OpenNext support for 16.3 is unresolved (issue #1300).
- **Prisma is pinned to v6 on purpose** (with `driverAdapters` + per-request
  clients for Workers — see `src/lib/db.ts`). v7 additionally requires
  `prisma.config.ts`, ESM, and new import paths. Don't bump casually.
- **Tailwind v4** is CSS-first: theme tokens (including the soft-gray palette and
  `--shadow-soft*`) live in `src/app/globals.css` `@theme`; there is no
  `tailwind.config.js`. UI is shadcn/ui (radix-nova preset, `components.json`).

## Architecture

**Content is code; user data is Postgres.** This split is the core mental model:

- The content graph (tracks, modules, lessons, papers, exercises, assessments,
  resources) is static and code-defined in `src/content/*.data.ts` plus MDX
  bodies in `src/content/lessons/*.mdx`. Modules order lessons and papers
  together via `itemIds`. Access it **only** through `src/lib/content/`
  (in-memory indexes + accessors). Never store curriculum in the DB.
- `prisma/schema.prisma` holds **only** user/stateful data (progress, submissions,
  classrooms), keyed by **string content IDs** — there are no FKs into
  the content graph. `LessonProgress.lessonId` holds generic content ids
  (lessons, papers, and papers' inserted lessons each count as one unit).

**Papers.** A `Paper` (`src/content/papers.data.ts`) is a module item that
renders an arXiv paper, Substack post, or LessWrong/Alignment Forum post
full-page from its precomputed artifact (`Paper.source` kinds
`arxiv`/`substack`/`lesswrong`), editable via
`Paper.edits`: hide sentences/paragraphs behind expandable markers, add
editorial markdown (navy "Note" styling, or `plain` for native-looking body
text), splice activities (exercises / inline lessons) at section ends,
between blocks, or mid-paragraph, gloss phrases with glossary hover-card
triggers, splice a numbered `section` subsection whose display number/level
are derived from the toc (shifting its later siblings' displayed numbers —
`section-inserts.ts`), and `gate` the rest of the paper behind a
tap-through/written-response card (`gate-state.ts`; the sidebar locks rows
below a closed gate via `gateIds`, and the trailing references/footnotes
render outside the gate walk as `ungatedTailHtml`). Targets key
on stable `data-anchor`/`data-s` values plus a required `snippet` drift
tripwire (validated by content.test.ts). `src/lib/papers/apply-edits.ts`
patches only edited sections (HAST tree ops; unedited papers keep the string
fast path via `split-paper.ts`); `paper-nav.ts` builds the sidebar's per-paper
section tree (scroll-spy in `src/components/layout/use-scroll-spy.ts`;
multi-heading lessons get the same docked nav — see MDX pipeline). The
converters run ONLY at authoring time — never in the deployed worker: the
LaTeX→HTML converter lives in `src/lib/arxiv/` (`npm run arxiv:build`); the
Substack and LessWrong converters (`src/lib/substack/`, `src/lib/lesswrong/`,
sharing `src/lib/paper-source/convert-shared.ts`) emit the same annotation
contract (anchors/sentences/toc), which is why everything in
`src/lib/papers/` serves all sources. When changing converter output shape,
bump that converter's version constant (`CONVERTER_VERSION`,
`SUBSTACK_CONVERTER_VERSION`, `LESSWRONG_CONVERTER_VERSION` in the
respective types.ts) and ship the rebuilt artifacts in the same commit: stale
artifacts read as "not-built" at runtime and fail content.test.ts, and
anchors/sentence indices may renumber (the snippet tripwires name every
content edit that drifted). Posts aren't version-pinned — the committed
artifact is the pin (`--refresh` refetches deliberately); paywalled Substack
posts commit a terminal `paywalled` artifact rather than reproducing partial
text. Footnotes (all three sources) rebuild into a linked landmark section,
and the reader renders them as margin sidenotes when there's room — outside
the reading column on large monitors, in an inset rail on laptop widths —
user-toggleable from the paper header
(`src/components/papers/paper-sidenotes.tsx` + `sidenotes-toggle.tsx` —
DOM-cloning presentation layer; the in-document section stays canonical).
**Linked readings**: post-sourced papers get their clean post-to-post links
(reproduction is permission-gated: `src/content/reading-permissions.json`
must carry a `permitted`/`unreviewed` entry per artifact id or
readings:build refuses to convert the link and it stays external —
enforced by readings.test.ts)
rewritten at render time (`src/lib/readings/`) to course pages, or to the
standalone `/readings/[id]` viewer for posts pre-built by
`npm run readings:build` (which scans paper artifacts AND lesson MDX markdown
links, and regenerates the committed `src/content/linked-readings.json`
registry — never hand-edit it). Lesson markdown links internalize the same
way via `MdxLink` (the `a` renderer in the MDX component map); a literal JSX
`<a href>` in a lesson is the opt-out — never internalized, never scanned —
used by the attribution lines of verbatim-reproduced lessons. One layer
deep by design: the /readings viewer renders untouched HTML
(`internalSublinks={false}`), and linked readings are not content-graph
items — no module, no progress, excluded from the resource hub.

**Routing (tracks).** `/tracks/[trackSlug]/[moduleSlug]/[itemSlug]` is one
dispatching route serving both lessons and papers (they share a slug
namespace); the static sibling segment `assessment` is reserved. The
`[trackSlug]` layout owns the sidebar; active-item detection is client-side
via `usePathname()` (layouts can't see deeper params).

**MDX pipeline.** `src/mdx-components.tsx` wires the global component map from
`src/components/mdx/mdx-components.tsx`. `LessonContent` dynamically imports
`src/content/lessons/${contentRef}.mdx`, so authors embed `<Video/>`, `<Demo/>`,
`<Exercise/>`, `<Callout/>`, `<ArxivPaper/>` (collapsible card — distinct from
full-page Paper items), `<Footnote/>`, `<Term/>` (glossary hover card), and
`<SiteQuote/>` (external link whose hover card previews a verbatim excerpt
of the target page; never internalized, never scanned by readings:build),
`<SourceCredit/>` (the credit block over a lesson reproduced from somebody
else's document — author, where the original lives, and how much of it is
here; emitted by `gdoc:build`, not hand-written)
by name inside lesson text. `<MemoDesk lesson="…"/>` prints the written
output that lesson owes and links into the memo desk at that slot.
`<PopUp label="…">` is what the outline's
`[POP UP]` marker becomes: a named card that opens a dialog on the body
(2.2.1's three visibility layers are the live case). An `[interactive
pop-up]` — one the learner answers rather than reads — is a widget instead;
1.0.2's `policy-cost` is the one that exists.
A lesson body with 2+ top-level `##`/`###` headings automatically gets a
paper-style "In this lesson" sidebar nav: `src/lib/mdx/rehype-lesson-sections.mjs`
compiles a `sections` export into every lesson module (read via
`getLessonSections`, assembled into `itemNavs` in the `[trackSlug]` layout).
The plugin is registered in `next.config.ts` and must stay AFTER `rehype-slug`
(it reads the ids slug assigns); Turbopack takes MDX plugins as strings only,
and local plugin paths must be absolute.

**Exercises & writing (security-relevant).** Closed-exercise answer keys are
server-only: `toPublicChoice()` / `toPublicFlowchart()` strip `correctOptionIds`
/ stage `solution`s before they reach the client, and the server actions
(`gradeExercise`, `gradeFlowchartStage` — which sanitizes the POSTed attempt
tree — and `recordTapReveal`) grade + persist. Never pass answer keys into
client components (`tap-reveal` answers, `understanding-check` sample
answers, and whole `allocation`/`argue-reveal`/`control-scenarios`/
`staged-questions`/`commit-construct` definitions ship to the client by
design — self-assessment with reveals, never graded; they persist via
`saveAllocationScenario`, `saveArgueRevealItem` + `saveArgueRevealConstruction`,
and the direct-POST sanitizers in `exercise-view.ts` for the latter three).
Standalone exercises can surface on the `/exercises` tab via the curated
`featuredExercises` list in `src/app/exercises/featured.ts`. `WritingEditor` is the
one editor reused by inline writing exercises and end-of-module assessments;
persistence is done by `.bind()`-ing server actions in a server component and
passing them as props. Exercise prompt/answer strings render `$…$` math via
`MathText`; writing-type prompts additionally render block markdown
(`src/lib/content/writing-prompt-html.ts`); lesson MDX math uses remark-math +
rehype-katex.
**Answer options are shuffled at the display layer, never in the data**
(`src/lib/shuffle.ts`; `shuffleAnswerOptions` is the entry point). Authored,
86% of correct answers across the platform sat in slot A or B — one quiz ran
four Bs of five, the treaty phrase-quiz put a correct option first in all
fifteen, and the four-lever matching offered its chips in row order, so it
solved on the diagonal. **Those banks are Claude's own, and the cause was
building exercises without playing them** — the diagonal came from mapping one
array over both the rows and the chips, which is obvious to anyone who tries to
solve the widget once. Shuffling is the remedy; **checking what a finished
exercise looks like to somebody trying to beat it is the part that has to
happen while it is being built**. The order is seeded on the
question's own id, so it is **stable for every learner, device and visit** —
per-visit randomness would break SSR against hydration, move the options under
somebody returning to an answered question, and silently invalidate the
facilitator guide's session keys, which a room reads together. **Nothing may be
keyed on position**: `shuffleAnswerOptions` returns each option with the index
it was authored at (`from`), and index-keyed banks (drills' `right`, the
reader's `<Check answer={n}/>`) compare and store THAT, which is why their data
files and their permanent `localStorage` marks needed no migration. Two
opt-outs, both narrow: true/false pairs keep their conventional order
automatically, and terminal options ("None of the above") stay pinned last. A
drill step whose reveal names an option by position carries `fixedOrder: true`
— but the right fix for a NEW one is to name the option by what it says, and
**prose must never reference an option letter or position**, because a letter
is a position. `src/lib/verification/answer-order.test.ts` enforces all of it:
it catches positional prose without an opt-out, checks every answer surface
routes through the shuffle, and fails when a slot runs far above what an even
spread would give it (measured against the banks' own option counts, not a flat
percentage).
The reasoning-transparency grader (`src/lib/grader/`, action
`requestTransparencyGrade`) sends submitted writing to an LLM via OpenRouter;
model selection is per length class and key source (`modelFor` in
`classify.ts`, env-overridable): the server-wide key grades on
`openai/gpt-oss-120b:free` (Hy3's free endpoint was deprecated; the fallback
chain runs through `openrouter/free`, overridable with
`OPENROUTER_MODEL_FALLBACK`); a user-stored key grades on
`deepseek/deepseek-v4-flash-0731` (`OPENROUTER_MODEL_USER` overrides, with
`OPENROUTER_MODEL_USER_FALLBACK` behind it). The
grader card renders only once
the submission is submitted; `reopenWriting` reverts submitted→draft for
edit-after-grading (hosts key `WritingEditor` on the row's `updatedAt` so
`router.refresh()` remounts it with server truth). Grader reports open with
a machine-parsed `<analysis>` block (per-criterion Score/Evidence/Rationale;
verdict LAST) that is never shown raw: `parseGraderReport` in `parse.ts`
turns it into rubric-table rows (`rubric-table.tsx`, criterion tooltips), and
the visible report is the analysis-stripped remainder. The rubric is
single-sourced in `src/lib/grader/rubric.ts` (author's verbatim text) — the
prompts' criterion blocks and the UI tooltips both build from it. The raw
report persists unmodified on `Submission.feedback`; parsing happens at read
time, so pre-format reports degrade to a full-markdown view. Three key
sources can pay for a grade — the server-wide `OPENROUTER_API_KEY`, a
user-stored key (`saveOpenRouterKey`), or a classroom key
(instructor-managed on the classroom page via `saveClassroomOpenRouterKey`,
usable by every member). Stored keys are validated live against OpenRouter,
then persisted AES-GCM-encrypted in `UserApiKey` / `ClassroomApiKey` under
`API_KEY_ENCRYPTION_SECRET`, with `userId:provider` resp.
`classroom:<id>:provider` bound as additionalData —
`src/lib/grader/key-crypto.ts`; secrets shorter than 32 chars or equal to
the .env.example placeholder are treated as unset, hiding the feature.
Which key bills is a per-user choice (`User.graderKeyPref`, set from the
dropdown in the grading card via `setGraderKeySelection`), resolved
server-side in `src/lib/grader/grading-key.ts`: the preference while still
available, else own key > sole classroom key > server (never auto-picks
among several classroom keys); user/classroom keys grade on the paid
`OPENROUTER_MODEL_USER` model. Decrypted key material never leaves the
server; the client only ever sees states, classroom names, and `last4`s
(`getGraderKeyView`, passed into `TransparencyFeedback`; it probes
decryption, so a key orphaned by secret rotation surfaces as `needs-reentry`
and grading errors rather than silently billing the server-wide key).
`src/lib/control-model/` is the pure closed-form model behind the Control
track's demos — its calibration test pins the paper's headline numbers (±4pp);
plan-level rationale lives in the demos, the code + test are normative.
`bestResponse` is memoized at module scope, keyed on the levers `evaluateGame`
reads (`q|b|d|attackSd`): never mutate its returned object, and extend the key
if `evaluateGame` grows a new lever dependency.

**Spaced repetition (`/review`).** Every tap-reveal a signed-in learner rates
inside a lesson enrolls in their per-user FSRS bank (`ReviewCard` — columns
mirror the ts-fsrs `Card`; `src/lib/review/fsrs.ts` owns the row↔Card mapping
and the yes/partial/no → Good/Hard/Again grade mapping, and is the only place
that touches ts-fsrs). `recordTapReveal` creates the card and counts an
in-lesson rating as a review **only when the card is due** — re-clicking the
rating buttons to correct a self-assessment must not inflate the schedule.
The `/review` tab serves due cards Anki-style (Again/Hard/Good/Easy via the
`reviewCard` action; "Again" re-queues within the session), and the
caught-up state offers practicing not-yet-due cards early (a real FSRS
review — it re-schedules from the shorter elapsed time); cards whose
exercise left the content graph are skipped, not deleted.

**Auth & mutations.** WorkOS AuthKit. `src/middleware.ts` only refreshes the session.
Local dev can bypass WorkOS entirely: `DEV_USER=1` in `.env` resolves every
request to a placeholder account (`devUser()` in `src/lib/auth.ts`; an email
value gives distinct accounts). Active only when NODE_ENV is `development` —
both gates are deliberate; don't weaken them.
`getCurrentUser()` / `requireUser()` (`src/lib/auth.ts`, `cache()`-wrapped per
request) upsert the WorkOS user into the local `User` table. Enforce sign-in
**per page/action** (`requireUser`, or `withAuth({ ensureSignedIn: true })`), not in
the proxy. All mutations are server actions in `src/app/actions/`; each re-checks
auth because they're reachable by direct POST. Classroom reads are scoped to
membership (`requireInstructor` / `getMembership`).

**Database & deploy (PlanetScale Postgres + Cloudflare Workers).** Postgres is
**PlanetScale for Postgres** (PS-5 single-node, AWS us-east-1); the app runs on
**Cloudflare Workers** (worker `tracks`) via `@opennextjs/cloudflare`. In prod
the DB is reached through the **Hyperdrive binding** (`HYPERDRIVE` in
`wrangler.jsonc`, origin = direct port 5432 with the least-privilege
`pscale_api_*` role, **caching disabled** — Hyperdrive never invalidates its
query cache on writes and this app reads user state right after writing it).
`src/lib/db.ts` builds a **per-request** PrismaClient (driver adapter over `pg`)
from the binding and falls back to `DATABASE_URL` (pooled port-6432 string in
`.env`) for local dev — never share a Prisma client across requests on Workers.
**Schema migrations live in `db/migrations/` as numbered SQL files and are
applied manually** — `psql "<direct-5432 url>" -f db/migrations/<file>.sql`
using the **admin** role (the app role has no DDL rights) _before_ pushing code
that depends on them; PlanetScale Postgres has no deploy requests/safe
migrations, and never run `prisma migrate deploy` against prod. To change the
schema: edit `prisma/schema.prisma` (types/client) **and** add a matching SQL
file under `db/migrations/`, apply it, then push. Deploys are git-connected via
**Workers Builds**: push to `main` → `npx opennextjs-cloudflare build` +
`npx opennextjs-cloudflare deploy`. Worker secrets (`WORKOS_*`, `OPENROUTER_API_KEY`,
`API_KEY_ENCRYPTION_SECRET`) are set with `wrangler secret put`; `NEXT_PUBLIC_WORKOS_REDIRECT_URI` lives in
`wrangler.jsonc` vars **and** must be a Workers Builds build variable
(`NEXT_PUBLIC_` values are inlined at build time).

**Glossary.** `src/content/glossary.json` is the hand-authored term registry
(definitions are curriculum copy — human-authored or lorem, never generated);
`src/lib/content/glossary.ts` indexes it by id and case-insensitive
term/alias. One shared card serves both surfaces (`src/components/glossary/`:
hover-intent on desktop, tap on touch, Escape/outside dismiss); its
presentation is `glossary-overlay.tsx` — on wide viewports a margin card on
the surface's sidenote rail, slightly raised, with a dashed connector traced
from the term (document-coordinate portal, per-surface rail geometry);
without rail room, a popover anchored at the term. Lessons use the `<Term/>`
MDX component (server-side lookup; definitions math-render via MathText
before crossing to the client); entries flagged `autoGloss` additionally
self-place in lessons: `src/lib/mdx/rehype-auto-gloss.mjs` (registered after
rehype-lesson-sections, before rehype-katex) wraps each lesson's first
running-text occurrence in `<Term/>` at compile time — hand-placed `<Term>`s
suppress it per entry, the registry's `autoGlossExclude` opts out the
verbatim-reproduced lessons, and the flag is reserved for unambiguous jargon
(common words stay manual). Papers use the `gloss` edit op —
`patch-section.ts` wraps the phrase in `span.ax-gloss[data-gloss]`
(text-preserving, so anchors/sentence indices/snippets never drift, and only
glossed sections parse — the unedited fast path stands), and `PaperGlossary`
(PaperSidenotes pattern: no HTML props) event-delegates over the spans.
`glossary.test.ts` + `content.test.ts` enforce every reference, including
that each gloss phrase exists as plain running text in its target (the exact
runtime matcher, applied sequentially like phase A0).

**Demos.** `src/lib/demos/registry.ts` is the single integration point: a demo is a
self-contained client component registered by id, embeddable in MDX, the `/demos`
gallery, a standalone page, and the chrome-less `/demos/[id]/embed` iframe route
(which is excluded from the proxy matcher). Demo components live in
`src/components/demos/` as self-contained `"use client"` files with no
app-internal deps beyond design-system imports (`src/lib/demos/types.ts` states
the contract). Never wrap a demo in `DemoFrame` — `DemoById` applies it,
supplying the titled frame, error boundary, and Reset (Reset works by
remounting, so demos carry no reset logic of their own). House idiom:
hand-rolled inline SVG, no chart libraries, styled with Tailwind classes only —
theme tokens (`card`/`border`/`muted`/`primary`) for structure, fixed palette
classes (e.g. `fill-amber-500`) where a demo needs categorical accent colors,
never literal hex/rgb. `slide-stepper.tsx`
is the reusable zybooks-style slide chrome (label+caption steps, render-prop
`children(step)`, Back/dots/Next + arrow keys, index clamped; used by
`additive-control` and `regime-states`): stepper demos render **one** SVG
scene on every step and fade layers via CSS transitions keyed off the step
index, so stepping backward animates too. Demo caption/label copy must
restate the human-authored source note or lesson prose — never invent
curriculum claims. Vitest runs in node env against `src/**/*.test.ts` only:
registry wiring gets a plain unit test (`src/lib/demos/registry.test.ts`);
components are verified by typecheck + a visual pass, not DOM tests. Dated
design specs and step-by-step implementation plans for demo workstreams live
in `docs/superpowers/` (`specs/`, `plans/`) — they record intent and rationale
(e.g. why `regime-states` is a 7-step stepper covering the safety-budget
household picture, or the `five-worlds` map axes); once shipped, the code is
normative.

**Verification — read this before touching it.** The course exists twice
right now and that is a **defect being paid down**, not a design. Anything you
add must reduce the duplication, never widen it.

- **One branch. All Verification work happens on a single shared branch —
  this is the rule**, set by the course owner after parallel sessions forked
  the course five ways and every fork had to be hand-merged back. The current
  branch is `claude/repo-audit-slop-3h48qy` (the consolidation of PR #11 and
  every verification side branch); when it merges, the next single branch is
  announced on its PR. Never start a new `claude/*` branch for verification
  work: pull the shared branch, commit there, push there, and pull again
  before you push — another session may have moved it.

- **No unsolicited comments in Verification source.** Do not add comments to
  Verification code or lesson files unless the user explicitly asks for that
  exact comment. The only standing exceptions are required compiler, linter,
  test-coverage, and legal directives. Never put prompts, chat quotes,
  ownership, dates, edit or review history, implementation rationale, or
  removed or moved material in source comments. Project history belongs in
  Git; durable curriculum provenance belongs in `docs/verification/`. All
  repository text must be in English. The rule is enforced by
  `src/lib/verification/comment-policy.test.ts`.

- **`src/content/verification/curriculum.ts` is the course.** It is the single
  source of the module list, the unit list and their order. The app track at
  `/tracks/verification` reads it directly; MDX bodies live in
  `src/content/lessons/verification/*.mdx`, reached by `contentRef`
  `verification/<name>` (`contentRef` is a _path_ under
  `src/content/lessons`, so the subfolder needs no loader change).
- **The outline's taxonomy is modules → submodules → subsubmodules**, and the
  graph carries it as: a **submodule** is a top-level lesson numbered bare
  `X.X` (the `X.X.0` convention was retired in the 2026-08-06 renumbering —
  see `docs/verification/module-0-log.md`), its **subsubmodules** are lessons
  whose `sectionItemId` names it, numbered from `X.X.1`. One nesting layer,
  which is all `content.test.ts` allows and
  exactly what the outline describes. All of module 2 is on this shape.
  Renumbering a lesson means renumbering its body's own first heading in the
  same edit — `isLessonTitleHeading` compares digits too, so a title that no
  longer matches its heading silently starts printing twice.
  Per-module build logs — what was transcribed, what was deliberately left, and
  what is still owed — live in `docs/verification/` (`module-2-log.md` is the
  first). Append to them rather than rewriting; they are the audit trail that
  stops the next session re-deriving decisions from the diff.
- **`public/verification/data/course.js` is generated. Never hand-edit it.**
  `npm run verification:course` builds it from the curriculum above;
  `-- --check` fails when the two disagree. It carries **structure only** —
  modules, units, ids, titles and an `href` per unit. The prose is MDX and
  belongs to the app, which is the whole point: two copies of the text was
  the defect.
- **The course's own pages are app routes, not files.** `/verification/track`,
  `map`, `guide`, `memo-desk`, `capstone-bank`, `capstone`, `landing`, `about`
  and `team` live in `src/app/verification/*/page.tsx`. Nothing under
  `public/verification/` is HTML any more — a page served outside the app has
  no session, which is why the old ones could only ask an API whether somebody
  was signed in and never show them their own account. The old `*.html` URLs
  308 to the new ones (`next.config.ts`). `/verification/module?u=<unit>`
  resolves against the content graph and redirects to that unit's reading.
- **Their behaviour is still plain JS, loaded in order.** Each route mounts
  `<LegacyScripts src={[…]}/>`
  (`src/components/verification/legacy-scripts.tsx`), which appends
  `public/verification/*.js` one at a time — `data/*.js` set globals that
  `platform.js` and the page script read at execution time, and next/script
  gives no ordering guarantee between tags. It loads each file once: those
  scripts are not idempotent, so a second run doubles every listener.
  Converting a page to components means deleting entries from that list, and
  the list emptying is what finishing the job looks like.
- **`src/content/verification/memos.ts` is the course's written outputs.**
  Same generator shape as the course: `npm run verification:memos` writes
  `public/verification/data/memos.js` for the standalone memo desk, and
  `-- --check` fails on drift — never hand-edit the output. Each slot names
  the `lesson` whose body carries `<MemoDesk lesson="…"/>`, because the
  outline numbers some of them loosely (`1.7`, `1.x`, `3.x` are not units the
  graph has), so the placement is a judgement and belongs in the data where it
  can be argued with. `memos.test.ts` fails if a slot's lesson does not embed
  its card exactly once — that is what stops the desk going unreachable from
  the course again. `status` is load-bearing: `specified` quotes the outline,
  `named` and `unspecified` must carry a `gap` saying what is missing, and
  filling one in yourself is a content decision that is not yours to make.
- **`verificationUnitOfLesson` in curriculum.ts is the join.** The static
  site and `data/skills.js` key on outline numbers (`0.1`, `2.3`); the graph
  keys on `v-<name>`. Several lessons may share one unit — module 0's seven
  lessons are four units, 2.3's five sections are one. A lesson missing from
  that map is a lesson the static site cannot see, so the generator fails
  loudly rather than dropping it.
- **Unit ids are permanent and load-bearing.** The static site's ids
  (`0.1`, `2.3`) are progress keys **and** the rung tags in
  `data/skills.js`; the graph's are `v-<name>`. Both sets survive — the join
  above is what keeps the skill map filling.
- **`data/exercises.js` is orphaned and awaiting a decision.** Eight of its
  exercises (`ex-response-menu`, `ex-branches`, `ex-precedents`,
  `ex-policy-matrix`, `ex-anatomy`, `ex-chokepoints`, `ex-upstream`,
  `ex-signals`) lost their only consumer when the static player became a
  redirect; `ex-evasion` still feeds the capstone workspace's red-team table.
  `ex-mechanism-rank` and `ex-reopen` were ported to the `mechanism-rank`
  widgets (embedded in 2.0 and 4.1, on the old `vt-ex:*` storage keys so a
  sealed ranking survives the move) and deleted from the data file. The rest
  are authored content, so they were kept rather than deleted. Either port
  them to React widgets under `src/components/verification/widgets/` or
  retire them deliberately — do not leave them drifting a third time.
- **Learner state belongs to the account.** `VerificationState`
  (`/api/verification/state`) holds completed unit ids and the notebook as one
  JSON document per user; `localStorage` is the signed-out fallback and the
  offline cache, never the source of truth. Signed out returns 401 and the
  pages carry on — that is a supported mode, not an error, and must never be
  reported as one. **The table needs
  `db/migrations/20260805120000_verification_state.sql` applied with the admin
  role before any of this works.**
- **A body may repeat its own title; the reader drops it.** The item page owns
  the lesson's h1, so a transcribed heading that says the same thing is not
  rendered — `titleAwareHeadings` in
  `src/components/mdx/lesson-content.tsx` compares each heading against the
  lesson title (`isLessonTitleHeading`, word-only, in
  `src/lib/content/lesson-heading.ts`) and returns null on a match, at any
  level and anywhere in the body. `getLessonSections` applies the same filter
  so the sidebar never offers a row whose anchor was dropped. This is
  deliberately a render rule and not an authoring rule: the outline carries
  its numbered heading, transcribing it verbatim is right, and policing the
  sources regressed on every new batch. A surviving `h1` renders as `h2` —
  the page owns the document's only h1. The breadcrumb stops at the module
  for the same reason.
- **No Kaspersky sources in the Verification course** (course owner,
  2026-09-03: "we will not touch Russian Kaspersky"). Do not cite, link, or
  propose Kaspersky reports or blog posts, whatever the topic.
- **Never invent curriculum.** Modules 0-2's prose is transcribed from the
  author's WIP outline, verbatim. Modules 3-4 are declared with real titles
  and no items until their prose is drafted — an empty module counts as
  complete, so they gate nothing. The outline's instructions to whoever
  finishes a section are kept but visibly marked as author notes, so they can
  never read as learner-facing prose.
- **Part-by-part reading is OFF — the regime was deleted on the course
  owner's instruction (2026-08-15, "delete this regime"): every lesson and
  paper reads as one page.** `curriculum.ts` sets `chunkedReading: false`,
  and that one flag is the whole switch. The machinery stays in the repo,
  inert, for any track that ever wants it back, and this is its shape:
  `LessonPartsReader` (client) pages the rendered body at **authored
  `<PageBreak title="…"/>` markers only** — headings are deliberately not
  boundaries (the old adaptive h2/h3/h4 chunker separated prompts from their
  evidence and produced one-sentence screens). Where the breaks go is
  `planParts` in `src/lib/reading/lesson-parts.ts` (pure, tested;
  `MIN_PARTS = 2` — a lesson with fewer authored pages reads whole), with
  `?p=` deep links and a whole-lesson toggle persisted under
  `vt-reading-mode`. Parts are hidden, never unmounted — embedded widgets
  hold live state — and in-page anchors into a hidden part reveal it before
  scrolling. Nothing auto-completes under a parts reader: Mark complete is
  the only completion channel (both the lesson and paper branches of the
  item page gate `autoComplete` on the flag). Still true regardless of the
  flag: long lessons carry real headings, not bold lines pretending (the
  scoping-actors/covert-\* repairs), and a wide table scrolls in its own box
  (`.lesson-body table` in globals.css), never the page.
  **One pager, and it is shared** — `src/components/learn/reading-pager.tsx`.
  Previous/Next roll into the neighbouring item at the ends, so the page
  hands the reader its footer and drops `LessonNav`; one component serves
  the lesson and paper readers so they cannot drift apart.
  **Papers, when the flag is on, read the same way** — `PaperPartsReader`
  (`src/components/papers/`) chunks at the paper's OWN toc headings
  (`ax-sec-`/`sb-sec-`/`lw-sec-` ids), so an Article of a treaty is a page and
  nothing else is; it goes a level deeper when one `h2` would otherwise
  swallow a third of the document. It never receives html — it reorganizes the
  rendered DOM after mount, the PaperSidenotes/PaperGlossary contract. Every
  part after the first carries a small author line, because parts 2..n are
  otherwise somebody else's text with no name on screen. Two opt-outs, both
  deliberate: a **gated** paper is left whole (two hiding layers over one
  document can strand content behind both), and scroll-completion is off
  there — the sentinel sits below whichever part is on screen, so it would
  report a whole treaty read at the end of Article I.
  Trap (live regardless of the flag): `collapseTailSections` folds appendices
  after References into closed
  `<details>`, which is right for apparatus and wrong when the appendix IS the
  document — the treaty papers put their agreement in Appendix A, so all
  fifteen Articles sat behind one toggle and formed a single unsplittable
  block. `Paper.collapseTail: false` is the opt-out.
- **Never put a ring around a letter or a number.** A circled A/B/C/D beside an
  option, a numbered disc in front of a list row — **forbidden**. The ring
  carries nothing the character does not already carry, and it is not free: as
  a fixed-width flex item it takes the row's space, forces a hanging indent,
  and leaves the text sized to a fraction of the width it was given. A marker
  is a prefix in the sentence — `A.` before the option, in muted weight — or it
  is the list's own marker, and that is the whole vocabulary. Numbering an
  `<ol>` by hand inside a ring is the same mistake twice.
  **There is no state exception.** A disc whose fill paints done/active, an
  option that fills once inspected — still forbidden, and the answer is a
  different design rather than a permitted ring. State belongs on a rule under
  the step, on the weight and colour of the word, and on a glyph and a word
  that say which state it is: `✓ Inspected`, not a filled circle the reader has
  to decode. That is the same requirement the colour rules already make — never
  shape or hue alone.
- **A widget is not prose and must not be measured like it.** The reading
  measure (`app-bridge.css`, 64ch) applies to authored sentences; a widget
  keeps the full lesson width. The guard is `[data-widget]`, the marker
  `verification-widget-host` puts where authored markdown stops — the rule for
  direct children always had it, the descendant rule did not, and an exercise
  built as an `<ol>` of question cards therefore rendered at 644px inside the
  798 it had been given. Guard on `[data-widget]` and NOT on `.not-prose`: a
  fold or a callout holding authored sentences is still reading, and exempting
  it widens that prose past the measure.
- **The tap-target floor beats a utility `min-w-*`, so never size a widget
  control with one.** `app-bridge.css` gives every control inside
  `[data-widget]` `min-inline-size: 44px` under `(max-width: 720px), (pointer:
  coarse)`. It is a logical property at higher specificity than a Tailwind
  utility, so `min-w-[104px]` on a flex item computes to **44px** on a phone —
  a floor silently acting as a ceiling. The pipeline chips in
  `interactive-map` were laid out `min-w-[104px] flex-1`, so on a 390px phone
  they resolved to 47px boxes holding words that need 65px, and every label
  painted out over its neighbour. Size such a control with its **flex basis**
  (`flex-[1_1_104px]`), which the floor does not touch and which makes the row
  wrap instead of crushing: the tap-target rule is right and the layout has to
  work with it.
- **A control's instructions must not assume a mouse.** Copy that says
  "Hover", "Click to pin", "Click a stage" is wrong on a phone, and a hover
  card is worse than wrong there — a tap fires one synthetic mousemove, so it
  raises a card the reader cannot scroll, dismiss, or fit on screen. Gate
  hover affordances on `(hover: hover) and (pointer: fine)`, give the copy a
  `…Touch` twin in the widget's data file, and make the tap do the thing the
  click does. `interactive-map` is the reference for both halves.
- **Optional material is marked one way: `Optional:` in front of the
  header.** Course owner, 2026-08-20 ("I like Optional: in header more than
  chip"). Muted weight, at the FRONT of the title, never a chip beside it,
  never `[Optional]` or `(optional)` anywhere, never a word in a status row.
  It had grown seven dialects; `OptionalPrefix`
  (`src/components/content/optional-tag.tsx`) and `.optional-prefix` in
  `public/verification/platform.css` are now the only two, one per side.
  **Say it once**: if a card's own label already begins "Optional:", nothing
  inside it repeats the word, and a title carrying the word in its own text
  should lose it and set `optional: true` instead (`Lesson.optional` and
  `Paper.optional` both exist and `isOptionalItem` honours both).
- **No half-painted cards.** A card is a hairline on all four sides, or it is
  painted on all four; never one edge in a coloured tint with the rest
  hairline, and never a hue that carries no meaning. The accent goes inside —
  a chip, a glyph, a fill bar. The prototypes brought this in repeatedly
  (`facilitator-guide` arrived with `border-left: 4px` alternating between two
  accents that marked nothing), so strip it on the way in, not after it
  renders. Two things that are not this and must not be "fixed": a band rule
  that separates full-width sections, and a tab whose bottom border is
  transparent so it joins its panel — absence is not a tint.
- **Categorical colour is the brand palette, and it rides on the word.** A
  categorical scale — the five evidence layers, any N-way key — takes the brand
  `--mod-0..4` hues through their `--mod-N-text` variants (built to read as type
  on every ground), never an ad-hoc chart rainbow (`bg-amber/sky/violet/emerald/
rose`, or Okabe–Ito). Those read as stock AI slop against the maroon, which is
  the whole reason `theme.css` leaves the chart tokens unmapped. One token
  colours the dot, the rail mark, the ring **and** the layer's own name, so the
  hue sits on a coloured word rather than a bare dot beside grey text — a
  coloured dot next to a grey label is the thing to catch on the way in, not
  after it renders. `interactive-map` and `mechanism-sort` are the reference
  (`var(--mod-N-text, #hex)`, the hex mirrored from theme.css for the rare
  no-theme render).
- **Bloom levels are gone on purpose.** They are curriculum-design vocabulary,
  not a learner's. If you need a second channel beside a module hue, use the
  module number — that is what the star numerals carry.
- **Headings are Title Case, and heading levels keep their one type scale.**
  The course owner's standing instruction (2.4 edit document, 2026-08-18):
  section headings capitalize as titles — "After the Report Arrives", never
  "After the report arrives" — and a lesson's h2/h3/h4 render at the type
  scale their level owns, with no per-lesson font overrides that make one
  lesson's subtitles a different size from its neighbours'. When touching a
  lesson, bring its headings and its PageBreak titles (the part-strip labels)
  up to this rather than matching whatever mixed case sits nearby. The former 2.4
  (now 2.3.6–2.3.9) is conformed; sweep others as they are edited.

Traps that cost time already, so they are written down:

- `importLesson()` swallows a failed dynamic import into `notFound()`. A wrong
  `contentRef` therefore looks like an ordinary 404 while typecheck and the
  whole suite stay green — check a lesson route against a running server.
- `public/verification/` is outside `tsconfig`'s include and outside vitest's
  (`src/**/*.test.ts`). Nothing there is typechecked or tested, and a green
  suite says nothing about it. Drive it in a browser.
- `theme.css` is the only file that knows a colour; three themes over one set
  of variable names. `--primary` fills and `--brand-ink` writes. The two
  wordmark files are chosen by CSS, and those rules must stay **after**
  `.brand-mark` — it sets `display:block` at equal specificity, so ordering is
  the whole mechanism. It carries the palette a _page_ is made of, so app
  tokens no static page has — `--popover`, `--input`, `--secondary`, the
  `--sidebar*` set — are absent from it and keep globals.css's light-ground
  values, which is how a dialog opens white on the night theme. Those are
  **derived** from the palette in `app-bridge.css` (app-only, loaded by
  `site-chrome.tsx`), never restated as literals: one rule serves all three
  themes. The chart and game-payoff tokens are deliberately left unmapped —
  categorical scales are a design decision, not a palette shade.
- The `localStorage` keys `xlab-verification-theme`,
  `xlab-verification-memo-desk.v1` and `xlab-verification-notebook.v1` hold a
  visitor's theme, memo drafts and notebook. They keep those names whatever
  the files around them are called.
- **Everything a selection can be done with is one toolbar**,
  `src/components/verification/selection-actions.tsx`, mounted by
  `site-chrome.tsx`. Highlight, Define and Add to notebook each used to raise
  their own button off their own `mouseup` listener in
  `highlight.js`/`vocab.js`/`notebook.js`, kept from stacking by being placed
  at different heights — which meant a phone (selection handles are OS chrome
  and send the page no mouse event) and a keyboard (Shift+Arrow under caret
  browsing, a screen reader's virtual cursor) selected text and were offered
  nothing at all. The trigger is now `selectionchange`, which every input
  device fires; pointer events only say whether a drag is still running. The
  three scripts keep their stores and their painting and publish
  `VTHighlight.add` / `VTNotebook.addQuote` / `VTVocab.define`, which the
  toolbar calls at press time — never at mount, so it cannot race their
  loading. Which actions apply is
  `src/lib/verification/selection-actions.ts`, pure and tested; adding a
  fourth tool is an entry there plus a published entry point, never a fourth
  listener. Traps, now in one place instead of three: a button must cancel
  its own `mousedown` or pressing it collapses the selection it was about to
  act on; and pressing INSIDE an existing selection to drag it is a native
  text drag-and-drop, which sends `pointercancel` mid-gesture and `dragend`
  at the end and **no `pointerup`** — so the "pointer is down" belief has
  both an explicit end and a timeout, or the toolbar dies for the rest of the
  page's life. **Removing a highlight has two routes because there are two
  gestures**: a selection crossing a highlight turns the toolbar's Highlight
  slot into Remove highlight (`overlapsHighlight` in the rules;
  `VTHighlight.idsInSelection`/`removeIds`), and a click on painted text —
  where the selection is collapsed and no toolbar appears — raises its own
  strip in `highlight.js`. A phone reaches the first and effectively never
  the second. Never both actions at once: two nearly identical buttons is a
  choice the reader should not have to make.
- LessWrong's GraphQL API is behind bot protection and challenges datacenter
  requests; the keyless `/api/search` endpoint is not, so
  `/api/verification/define` asks that instead (tags index — hits carry the
  wiki's real slug and a plain-text description), answers from the app's own
  glossary first, and stays best-effort. Never gate saving on a definition
  arriving.

The course pages' own mechanics, for as long as they are scripts:

- **`theme.css` is the only file that knows a colour.** Three themes — day,
  night, high contrast — over one set of variable names, so a rule reading
  `--border` or `--primary` follows the switch untouched. `--primary` fills
  and `--brand-ink` writes (maroon is a fine surface on dark and unreadable
  as text on it); `--mod-0…4` run **Chinese Red · Satsuma · Lunar Yellow ·
  Khaki · Cobalt** — a palette the brand belongs to rather than a
  general-purpose data set beside it (its Burgundy anchor is OKLCH hue 23 to
  `--primary`'s 29; Okabe–Ito was here before and read as stock AI-chart
  colour against the maroon). Each theme keeps the hue and re-solves lightness
  for its own ground, so day is those five darkened to carry as text, not five
  other colours; every value clears 4.5:1 where it is set. They stay
  decorative — warm neighbours converge for a protanope — so they and
  `--ok`/`--no` (Wong) are always accompanied by a word, glyph or fraction. High
  contrast is picked, never inferred. The read step runs inline in
  `src/app/layout.tsx` (`THEME_BOOT`) before the body does, so the ground is
  right at first paint — `theme.js` runs after hydration, and on its own it
  paints the day ground and then repaints. Keep the two in step: same
  storage key, same attribute, same three values. `fonts.css` carries Space Grotesk
  as a data URI.
- **`platform.js` owns the shared runtime**; `platform.css` the components on
  top of `theme.css`. Its `VT.mountChrome()` / `VT.mountFoot()` are dead on
  the app routes — the header and footer are React now (`site-chrome.tsx`) —
  and are kept only because the file is lifted whole if the course ever moves
  to its own host.
- **Content drives the page.** `data/course.js` is the course, plus
  `exercises.js`, `skills.js`, `glossary.js`, `memos.js`. A new unit is one
  object and the track page, module rail, counters and certificate gate pick
  it up. Unit ids are permanent — they are progress keys _and_ the rung tags
  in `data/skills.js`.
- **A unit is read in parts** (`module.js`). Parts are derived from the unit,
  never declared: every `{h}` in the body opens one, the blocks before the
  first open "Start", and the exercise, readings and written output are each
  their own — so a new unit in `course.js` chunks itself. A strip above the
  reading jumps between them, `?p=<1-based>` deep-links one, and `Read the
whole unit` lays them all out (remembered per device under
  `vt-reading-mode` — a preference, not learner work, so it stays out of
  `vt-progress` and out of the account sync). Two traps: parts are **hidden,
  never re-rendered**, because the exercise engine holds a half-answered run
  in memory that a rebuild would discard; and both pagers are `display: flex`,
  which beats the UA rule for `[hidden]`, so each needs its own `[hidden]`
  rule. The unit pager — Mark complete, next unit — waits for the last part.
- **Long units declare sections; the strip groups them.** A `{sec}` block
  opens a named group and is not a part of its own; only the group being read
  is spelled out, the rest state their size until pressed. Ungrouped units
  keep the flat strip, so this costs the short ones nothing. Four more block
  kinds serve unit-length readings: `{table}` (scrolls inside its own box —
  the page must never scroll sideways), `{src}` (a citation riding with the
  passage it belongs to, not a bibliography nobody opens), `{check}` (one
  1-of-4 question, committed before the answer, with Try again), and `{gap}`
  (fill blanks from a word bank carrying distractors). Check picks and gap
  placements persist per unit under `vt-marks:<id>` — learner work, so it
  feeds no meter and completes nothing. `{check}`/`{gap}` reuse `.opt` and
  `.ex-feedback` from `exercise.css` and hook on their own `.copt`/`.word`
  classes, so the exercise engine's own listeners are never in play.
- **2.2 Cloud exists on both sides, and they are not the same content.** The
  app track's `cloud-*.mdx` lessons are the author's outline transcribed; the
  static site's unit below is built from the four sources with checks, gaps
  and quoted passages, and uses reader features (`{sec}`/`{check}`/`{gap}`/
  `{quote}`) that only `module.js` has. So the generator this section calls
  for cannot simply overwrite one with the other — merging them is a content
  decision plus a port of those four block kinds, not a data move. Until then
  this is the widest part of the duplication, and it was widened knowingly:
  see the commits, not a silent drift.
- **The static site's 2.2 Cloud is fully drafted** — 48 parts, ten checks, six
  gap-fills and a twelve-item gate, carried over from the module-2.2 build in
  `tracksprogramplayground` by a one-shot transform over that page's data and
  verified there against the full texts. Its four sources have **different
  reuse terms and the unit cites them four ways**: the two arXiv papers (Heim
  et al. 2024; Egan & Heim 2023) are CC BY 4.0 and quoted freely; RAND
  RR-A3686-1 and the Carnegie piece are all-rights-reserved and are
  reproduced on the author's instruction — RAND from the report itself
  (Findings, Recommendations, and the body passages behind 2.2.3), Carnegie
  from the article as published.
  A `{quote}` block is the shape reproduction takes — **attribution first,
  then the words**: the work, which part of it, the authors, and a link out,
  all above the passage, so the two can never be read apart. `{read}`-style
  reading cards do the same job for the sources themselves (title links out,
  why-this-unit-sends-you-there, then `author (year) | length | licence`).
  The year is parenthesised and stays with the author, the way a citation
  writes it; the independent fields beside it take a pipe. Both replace a
  middle dot, which on a card whose author field is a five-name list was a
  weaker mark than the four commas it had to outrank — so the year read as one
  more name. Headings and shape lines (`Source packet · 14–17 min`) keep their
  dots: those separate a label from a measure, not one citation field from the
  next, and no list of names runs into them.
  The open verification-log row (RAND's permissions page, HTTP 403) is
  recorded in the comment above the unit — reproduction there is the author's
  decision, not an inference from terms nobody could read. Trap noted there
  too: the RAND PDF is AES-encrypted, so a fetched copy carries no text
  layer; these quotes came from the file the author supplied. Ask for the
  file rather than assuming a download will read.
- **Progress is one set of completed unit ids** in `localStorage` under
  `vt-progress`; everything else is derived at read time. Never persist a
  derived value, and nothing auto-completes on scroll, or on reaching the last
  part. Two meters on the module player mean two different things and each is
  labelled by the counter beside it: the part strip's reads position, the
  pager's reads completion. Trap: the storage keys
  `xlab-verification-theme` and `xlab-verification-memo-desk.v1` hold a
  visitor's chosen theme and their memo drafts, so they keep those names
  whatever the files around them are called.
- **Sign-in belongs to the app**, and now so do these pages, so the session is
  simply present: the header renders the account menu like every other route.
  `sync.js` still probes `/api/verification/state` for the learner's stored
  progress and notebook; what it no longer has to do is guess whether anyone
  is signed in.
- **The capstone bank is generated.** `verification-capstones/*.md` →
  `public/verification/data/capstone-bank.js` **and**
  `src/content/verification/capstone-bank.json` via `npm run
verification:capstones` (`-- --check` covers both; never hand-edit either).
  Two shapes because the static page needs a `window.` script tag and the app
  needs an import — one source, written together, so neither can go stale
  alone. `verification-capstones/_README.md` is the front-matter contract.
  `/verification/capstone-bank` is the filterable catalogue; `<CapstoneBank lead=…/>`
  prints the same briefs inside unit 4.2 (`capstone-project.mdx`), leading
  with the brief the unit is written around and linking the rest to their
  sheet. The status and difficulty vocabulary is `src/lib/verification/bank.ts`,
  and `bank.test.ts` parses `VT.bank` out of `platform.js` and fails when the
  two describe the same brief differently.
- **The drill benches are placed, not orphaned.** Eleven benches / 69 steps
  came over from `tracksprogramplayground/verification-drills.*` as four decks
  in `src/lib/verification/data/drills-*.ts`, with the judgements in
  `engines/drills.ts` and one renderer in `kit/drill-deck.tsx` (commit, reveal,
  Continue — never auto-advance). Each deck is a menu of its module's benches
  and is placed by `<VerificationExercise id="drills-…"/>`: primers in 0.2,
  foundations+actors+spine in 1.2, the four evidence-stream benches at the end
  of module 2, and evasion+regime+position in 4.1. They are bridged, so a deck
  reports complete when the last step of its last bench is committed; progress
  is per deck in `v-drills:<deck>:v1`.
- **The reader blocks are MDX components** (`src/components/mdx/reader/`):
  `<Check>` (one question, committed before the answer, Try again),
  `<GapFill>` (word bank with distractors), `<SourceQuote>` (attribution
  **above** the words — reproduce only what a source's terms allow, and say so
  in a comment above the lesson), `<Src>` (a citation riding with its
  passage). They came from the retired static player; `<Check>`/`<GapFill>`
  are learner work that feeds no meter, kept in `localStorage` under
  `vt-marks.v1` and read through `useSyncExternalStore` so the server snapshot
  is the empty state. A block's `id` is its storage key and is permanent.
- **Enrolling is an app route, not a static page**, because it needs a session
  and a row: `/verification/enroll` (apply, edit, withdraw) and
  `/verification/applications` (the reviewers' queue) live in `src/app/`
  under the same URL prefix as the static pages, and wear the same chrome
  because `isVerificationRoute()` matches the prefix. Nothing exists at those
  paths in `public/verification/`, and putting a file there would silently
  take the URL. The cohort and the question list are
  `src/lib/verification/application.ts` — the form renders whatever it finds
  and the action validates against the same list, so a new question is one
  object and never a migration (answers are a JSON map keyed by question id;
  a question `id` is a storage key and is permanent). Reviewers are
  `VERIFICATION_REVIEWERS`, a comma-separated email list that **fails
  closed** — unset means the queue 404s for everyone, and the check runs in
  `generateMetadata` as well as the page because static metadata flushes the
  head and commits a 200 before a component can throw. Needs
  `db/migrations/20260805150000_verification_applications.sql` applied by
  hand; until then both pages say the table is missing rather than failing at
  submit.

**The facilitator field guide** (`/facilitator`) is the third surface and the
one that is neither of the above. It is an app route because it gates, and the
static site never gates — it holds no session, and putting the guide there
would mean a second sign-in. `src/lib/verification/data/facilitator-guide.ts`
is the whole of its content: a verbatim port of a standalone page that no
longer exists, plus a Module 1 session plan transcribed from the outline's sync
tab and marked as such. The gate is `isFacilitator()` — instructor of at least
one classroom, the only such notion the schema carries, so no migration and no
second role system. Someone signed in without a classroom is told how to
qualify rather than 404'd; the material is gated because plans carry their own
answer keys, not because it is secret. Two rendering traps: the authored bodies
are raw HTML through `dangerouslySetInnerHTML` (safe only because they are
in-repo curriculum — never route anything else through those components), and
authored `[term]` triggers inside callouts carry `data-pop`, so popups open by
delegation off the container rather than by a handler per button. Views are
component state, not routes, so Back lands on the grid mid-session.

**Prerequisites & progress.** `Track.prerequisiteEnforcement` is `soft` (warn)
or `hard` (lock); `isAccessLocked()` (pure, tested) + `getPrerequisiteStatus()`
drive the lock, and the item page redirects signed-in learners on hard locks
(signed-out visitors may preview). Prerequisites may be cross-track. Progress
units are lessons, papers, and papers' inserted lessons — see
`getModuleProgressContentIds` in `src/lib/content/` — assessments never gate
completion; **a sidebar row's checkmark lights only when everything that row
stands for is complete** — `src/lib/content/item-done.ts` (pure, tested, and
imported by the client sidebar, which must never pull the graph). A row can
answer for work that is not visible beside it, and both cases are in that
file: a paper answers for its inserted lessons, and a **section head answers
for its subsections**, which collapse by default. Ticking a head on its own
lesson reported 2.1 Hardware — nine sections — as finished to somebody who had
read its opening page, so `groupDone` is what a head takes and `itemDone` what
a leaf takes. Papers marked `optional: true` (and their inserted lessons) are
trackable but never required: the `…ProgressContentIds` accessors exclude
them (so module completion, prerequisite satisfaction, and progress totals
ignore them) while `getTrackContentIds` is the full checkmark/fetch universe
(`c-paper-synchronous-monitors` is the live reference).
