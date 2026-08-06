# Module 6 Outline Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new "Beyond scheming: deals and next steps" module (order 7) to the Control track with three outline-stub lessons.

**Architecture:** Pure content-data change. One new `Module` entry and three new `Lesson` entries in `src/content/curriculum.data.ts`, plus three stub MDX files in `src/content/lessons/`. The existing vitest content-integrity suite is the test harness — no new tests are needed; it already validates that `itemIds` resolve, `contentRef` files exist, and module ordering is consistent.

**Tech Stack:** Next.js content data (TypeScript), MDX, vitest.

## Global Constraints

- Work in the worktree `~/tracks-viewer/.claude/worktrees/mod-6` on branch `mod-6`.
- Never push to `main` (production deploy). Push only to `origin/mod-6`.
- Spec: `docs/superpowers/specs/2026-08-05-mod6-subsections-design.md`.
- Titles verbatim: module "Beyond scheming: deals and next steps"; lessons "Alternatives to Schemers", "Trading with AIs", "Next Steps".
- No `estimatedMinutes` on the new module or lessons (the `Module.estimatedMinutes` and `Lesson.estimatedMinutes` fields are optional in `src/lib/content/types.ts`).

---

### Task 1: Module entry, lesson items, and MDX stubs

**Files:**
- Modify: `src/content/curriculum.data.ts:18` (control track `moduleIds`)
- Modify: `src/content/curriculum.data.ts:191` (after the `c-lowstakes` module entry closes with `estimatedMinutes: 309,` + `},`)
- Modify: `src/content/curriculum.data.ts:491` (after the `c-mod5-l3` lesson item closes)
- Create: `src/content/lessons/c-mod6-l1.mdx`
- Create: `src/content/lessons/c-mod6-l2.mdx`
- Create: `src/content/lessons/c-mod6-l3.mdx`

**Interfaces:**
- Consumes: `Module` and `Lesson` interfaces from `src/lib/content/types.ts` (both `estimatedMinutes` optional; `Lesson.contentRef` is the MDX path without extension under `src/content/lessons`).
- Produces: item ids `c-mod6-l1`, `c-mod6-l2`, `c-mod6-l3` and module id `c-mod6` for any later module-6 work.

- [ ] **Step 1: Run the content tests to get a green baseline**

Run: `cd ~/tracks-viewer/.claude/worktrees/mod-6 && npx vitest run src/lib/content/content.test.ts`
Expected: PASS (baseline before edits).

- [ ] **Step 2: Append `c-mod6` to the control track's `moduleIds`**

In `src/content/curriculum.data.ts` line 18, change:

```ts
    moduleIds: ["c-intro", "c-mod2", "c-areas", "c-mod4", "c-mod5", "c-lowstakes"],
```

to:

```ts
    moduleIds: ["c-intro", "c-mod2", "c-areas", "c-mod4", "c-mod5", "c-lowstakes", "c-mod6"],
```

- [ ] **Step 3: Insert the module entry after `c-lowstakes`**

In `src/content/curriculum.data.ts`, directly after the `c-lowstakes` entry's closing (`    estimatedMinutes: 309,` then `  },`, before the `// --- Verification: …` comment), insert:

```ts
  {
    // Outline-only closing module: three section markers the author will
    // fill with materials. See docs/superpowers/specs/2026-08-05-mod6-subsections-design.md.
    id: "c-mod6",
    slug: "module-6",
    trackId: "control",
    title: "Beyond scheming: deals and next steps",
    summary:
      "Three sections in development: alternatives to scheming threat models, trading with AIs, and next steps for control.",
    order: 7,
    // Empty placeholder modules count as complete, so only the built modules
    // actually gate; listing every ancestor keeps the chain correct as the
    // placeholders fill in.
    prerequisiteModuleIds: [
      "c-intro",
      "c-mod2",
      "c-areas",
      "c-mod4",
      "c-mod5",
      "c-lowstakes",
    ],
    itemIds: ["c-mod6-l1", "c-mod6-l2", "c-mod6-l3"],
  },
```

- [ ] **Step 4: Insert the three lesson items after `c-mod5-l3`**

In `src/content/curriculum.data.ts`, directly after the `c-mod5-l3` lesson item's closing `  },` (line ~491, before the `// --- Control: every reproduced reading …` comment), insert:

```ts
  {
    id: "c-mod6-l1",
    slug: "alternatives-to-schemers",
    moduleId: "c-mod6",
    title: "Alternatives to Schemers",
    contentRef: "c-mod6-l1",
  },
  {
    id: "c-mod6-l2",
    slug: "trading-with-ais",
    moduleId: "c-mod6",
    title: "Trading with AIs",
    contentRef: "c-mod6-l2",
  },
  {
    id: "c-mod6-l3",
    slug: "next-steps",
    moduleId: "c-mod6",
    title: "Next Steps",
    contentRef: "c-mod6-l3",
  },
```

- [ ] **Step 5: Create the three MDX stub files**

Create `src/content/lessons/c-mod6-l1.mdx`:

```mdx
<Callout variant="note" title="In development">This lesson is an outline stub — the author's plan for this section, not the finished lesson.</Callout>

## Alternatives to Schemers
```

Create `src/content/lessons/c-mod6-l2.mdx`:

```mdx
<Callout variant="note" title="In development">This lesson is an outline stub — the author's plan for this section, not the finished lesson.</Callout>

## Trading with AIs
```

Create `src/content/lessons/c-mod6-l3.mdx`:

```mdx
<Callout variant="note" title="In development">This lesson is an outline stub — the author's plan for this section, not the finished lesson.</Callout>

## Next Steps
```

- [ ] **Step 6: Run the content tests and typecheck**

Run: `cd ~/tracks-viewer/.claude/worktrees/mod-6 && npx vitest run src/lib/content/content.test.ts && npm run typecheck`
Expected: PASS. If a test fails on the new module, read the failure — the suite names the invariant (e.g. an unresolved item id or missing contentRef file) — and fix the data to match.

- [ ] **Step 7: Commit**

```bash
cd ~/tracks-viewer/.claude/worktrees/mod-6
git add src/content/curriculum.data.ts src/content/lessons/c-mod6-l1.mdx src/content/lessons/c-mod6-l2.mdx src/content/lessons/c-mod6-l3.mdx
git commit -m "Add module 6 outline sections (Beyond scheming: deals and next steps)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Full test suite and push for preview deploy

**Files:**
- No file changes; verification and delivery only.

**Interfaces:**
- Consumes: the committed content from Task 1.
- Produces: `origin/mod-6` updated → preview deploy for the branch.

- [ ] **Step 1: Run the full test suite**

Run: `cd ~/tracks-viewer/.claude/worktrees/mod-6 && npm test`
Expected: PASS. Failures unrelated to module 6 (pre-existing on the branch point) should be reported, not fixed here.

- [ ] **Step 2: Rebase on the remote branch, then push**

Per the repo convention (concurrent sessions), rebase right before pushing:

```bash
cd ~/tracks-viewer/.claude/worktrees/mod-6
git fetch origin
git rebase origin/mod-6
git push origin mod-6
```

Expected: push succeeds to `origin/mod-6` only. NEVER run `git push origin main`.

- [ ] **Step 3: Report the preview URL / branch state to the user**

Confirm the pushed commit hash and tell the user the mod-6 preview deploy will pick it up.
