# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Tracks is an AI-safety learning platform (Khan Academy–style) with two
tracks — **Control** (technical) and **Governance**. The
Control track's first module carries real curriculum (an authored lesson on
the control game, the Redwood AI Control paper, and two readings reproduced
with permission); everything else is placeholder. **Never invent or
fabricate curriculum content** — real content is human-authored or reproduced
with permission; otherwise use lorem ipsum or leave it empty. The **Example track** (`ex-content`/`ex-assess`)
is the live reference for every content feature; `AUTHORING.md` is the
step-by-step guide for adding content (its rules are enforced by
`src/lib/content/content.test.ts`).

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
- `npx prisma generate` — regenerate the client after editing `prisma/schema.prisma`.
  Do **not** run `prisma migrate` against the hosted DB (see Database & deploy).
- `npm run cf-typegen` — regenerate `cloudflare-env.d.ts` after changing
  bindings in `wrangler.jsonc`.
- `npm run verification:capstones` — rebuild the Verification capstone bank
  from `verification-capstones/*.md` into
  `public/verification/data/capstone-bank.js`. `-- --check` verifies the two
  have not drifted. Authoring-time only; the output is committed.

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
of the target page; never internalized, never scanned by readings:build)
by name inside lesson text.
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
The reasoning-transparency grader (`src/lib/grader/`, action
`requestTransparencyGrade`) sends submitted writing to an LLM via OpenRouter;
model selection is per length class and key source (`modelFor` in
`classify.ts`, env-overridable): the server-wide key grades on
`tencent/hy3:free`; a user-stored key grades on `moonshotai/kimi-k3`
(`OPENROUTER_MODEL_USER` overrides). The grader card renders only once
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
using the **admin** role (the app role has no DDL rights) *before* pushing code
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

- **`src/content/verification/curriculum.ts` is the course.** It is the single
  source of the module list, the unit list and their order. The app track at
  `/tracks/verification` reads it directly; MDX bodies live in
  `src/content/lessons/verification/*.mdx`, reached by `contentRef`
  `verification/<name>` (`contentRef` is a *path* under
  `src/content/lessons`, so the subfolder needs no loader change).
- **`public/verification/data/course.js` is a copy that has drifted, and must
  end up generated from the above.** It is hand-maintained today and already
  disagrees: different module titles ("Foundations" vs "Why verification?"),
  different unit ids (`0.1` vs `v-welcome`), 18 units against 15. Do not
  "fix" one side by hand — that is how the two got here. The fix is a
  generator plus a `--check` mode, the same shape as
  `npm run verification:capstones`, so CI fails when they disagree.
- **Unit ids are permanent and load-bearing.** The static site's ids
  (`0.1`, `2.3`) are progress keys **and** the rung tags in
  `data/skills.js`; the graph's are `v-<name>`. Any merge has to carry one set
  and remap the other in the same commit, or the skill map silently stops
  filling.
- **Learner state belongs to the account.** `VerificationState`
  (`/api/verification/state`) holds completed unit ids and the notebook as one
  JSON document per user; `localStorage` is the signed-out fallback and the
  offline cache, never the source of truth. Signed out returns 401 and the
  pages carry on — that is a supported mode, not an error, and must never be
  reported as one. **The table needs
  `db/migrations/20260805120000_verification_state.sql` applied with the admin
  role before any of this works.**
- **Never invent curriculum.** Module 0's prose is transcribed from the
  author's WIP outline, verbatim. Modules 1-4 are declared with real titles
  and no items until their prose is drafted — an empty module counts as
  complete, so it gates nothing. The outline's instructions to whoever
  finishes a section are kept but visibly marked as author notes, so they can
  never read as learner-facing prose.
- **Bloom levels are gone on purpose.** They are curriculum-design vocabulary,
  not a learner's. If you need a second channel beside a module hue, use the
  module number — that is what the star numerals carry.

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
  the whole mechanism.
- The `localStorage` keys `xlab-verification-theme`,
  `xlab-verification-memo-desk.v1` and `xlab-verification-notebook.v1` hold a
  visitor's theme, memo drafts and notebook. They keep those names whatever
  the files around them are called.
- `mouseup` fires before `click`. Both selection tools (`notebook.js` capture,
  `vocab.js` define) rebuild their button on `mouseup`, so each must ignore
  presses inside its own UI or the click never lands and the button looks
  dead.
- LessWrong's GraphQL API is behind bot protection and challenges datacenter
  requests, so `/api/verification/define` treats it as best-effort and answers
  from the app's own glossary first. Never gate saving on a definition
  arriving.


**Prerequisites & progress.** `Track.prerequisiteEnforcement` is `soft` (warn)
or `hard` (lock); `isAccessLocked()` (pure, tested) + `getPrerequisiteStatus()`
drive the lock, and the item page redirects signed-in learners on hard locks
(signed-out visitors may preview). Prerequisites may be cross-track. Progress
units are lessons, papers, and papers' inserted lessons — see
`getModuleProgressContentIds` in `src/lib/content/` — assessments never gate
completion; an item's sidebar checkmark lights only when all of its units are
complete. Papers marked `optional: true` (and their inserted lessons) are
trackable but never required: the `…ProgressContentIds` accessors exclude
them (so module completion, prerequisite satisfaction, and progress totals
ignore them) while `getTrackContentIds` is the full checkmark/fetch universe
(`ex-paper-lesswrong` is the live reference).
