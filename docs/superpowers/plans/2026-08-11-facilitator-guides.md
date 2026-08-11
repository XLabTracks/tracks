# Facilitator Guides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Public per-module facilitator-guide pages (session plans for synchronous cohorts), piloted with a real guide for Control module 1, lightly linked from the module page and the classroom instructor page.

**Architecture:** Guides join the static content graph as a new non-item type (`FacilitatorGuide` + `facilitator-guides.data.ts` + MDX body), rendered at the reserved sibling segment `/tracks/[trackSlug]/[moduleSlug]/guide` — mirroring the `assessment` segment. No schema/DB change. Spec: `docs/superpowers/specs/2026-08-11-facilitator-guides-design.md`.

**Tech Stack:** Next.js 16 App Router (params are async Promises — always `await`), MDX via the global component map, Vitest (node env, `src/**/*.test.ts` only).

## Global Constraints

- Branch `facilitator-guides` in `/Users/kaustubhkislay/tracks-viewer`. **Never push to `main`** (push = production deploy).
- **Never invent curriculum claims.** The guide body below is approved facilitation scaffolding; implement it verbatim. Do not add claims about the papers' content.
- Guides are NOT module items: no `itemIds` entry, no progress unit, excluded from prerequisites and the resource hub.
- The guide page is public: no auth, no database, no prerequisite redirect.
- After every task: `npm run typecheck` and `npx vitest run src/lib/content/content.test.ts` must pass.
- One deviation from the spec, agreed in planning: the "In this session" nav renders as an in-page list on the guide page (built from the MDX `sections` export), not as a docked sidebar nav — the sidebar's `itemNavs` map is keyed by content-item id and guides are not items.

---

### Task 1: Content model, data, guide body, tests

**Files:**
- Modify: `src/lib/content/types.ts` (append after the `ModuleItem` union, ~line 246)
- Create: `src/content/facilitator-guides.data.ts`
- Create: `src/content/guides/c-intro.mdx`
- Modify: `src/lib/content/index.ts`
- Modify: `src/lib/content/content.test.ts`

**Interfaces:**
- Consumes: existing `Module`, `getModuleBySlugs`, `getExerciseById`, `getItemBySlugs` from `@/lib/content`; `getDemo` from `@/lib/demos/registry`.
- Produces: `FacilitatorGuide` type; `facilitatorGuides` array; `getGuideForModule(moduleId: string): FacilitatorGuide | undefined`; `getAllGuides(): FacilitatorGuide[]` — both exported from `@/lib/content`.

- [ ] **Step 1: Write the failing tests**

Append to `src/lib/content/content.test.ts` (it already imports `existsSync`, `readFileSync`, `join`, `modules`, and the `@/lib/content` accessors — extend those import lists rather than re-importing):

```ts
import { facilitatorGuides } from "@/content/facilitator-guides.data";
import { getDemo } from "@/lib/demos/registry";
// add to the existing "@/lib/content" import block: getGuideForModule, getItemBySlugs
```

```ts
describe("facilitator guides", () => {
  it("guide ids are unique and moduleIds resolve, one guide per module", () => {
    const ids = facilitatorGuides.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
    const moduleIds = facilitatorGuides.map((g) => g.moduleId);
    expect(new Set(moduleIds).size).toBe(moduleIds.length);
    for (const g of facilitatorGuides) {
      expect(
        modules.some((m) => m.id === g.moduleId),
        `guide ${g.id} references missing module ${g.moduleId}`,
      ).toBe(true);
      expect(getGuideForModule(g.moduleId)).toBe(g);
    }
  });

  it("guide MDX bodies exist", () => {
    for (const g of facilitatorGuides) {
      expect(
        existsSync(join(process.cwd(), "src/content/guides", `${g.contentRef}.mdx`)),
        `MDX body for guide ${g.id}`,
      ).toBe(true);
    }
  });

  it("guide-linked exercise, demo, and track-item targets resolve", () => {
    for (const g of facilitatorGuides) {
      const src = readFileSync(
        join(process.cwd(), "src/content/guides", `${g.contentRef}.mdx`),
        "utf8",
      );
      for (const m of src.matchAll(/\]\(\/exercises\/([\w-]+)\)/g)) {
        expect(getExerciseById(m[1]), `exercise ${m[1]} in guide ${g.id}`).toBeDefined();
      }
      for (const m of src.matchAll(/\]\(\/demos\/([\w-]+)\)/g)) {
        expect(getDemo(m[1]), `demo ${m[1]} in guide ${g.id}`).toBeDefined();
      }
      for (const m of src.matchAll(/\]\(\/tracks\/([\w-]+)\/([\w-]+)\/([\w-]+)\)/g)) {
        if (m[3] === "assessment" || m[3] === "guide") continue;
        expect(
          getItemBySlugs(m[1], m[2], m[3]),
          `track item link /tracks/${m[1]}/${m[2]}/${m[3]} in guide ${g.id}`,
        ).toBeDefined();
      }
    }
  });
});
```

Also extend the existing reserved-segment test (`content.test.ts:120`, "item slugs are unique within a module and never shadow the assessment segment") — after `expect(slugs).not.toContain("assessment");` add:

```ts
        expect(slugs).not.toContain("guide");
```

Note: `getItemBySlugs` exists at `src/lib/content/index.ts:167` — check its exact signature before use; if it takes `(trackSlug, moduleSlug, itemSlug)` this compiles as written, otherwise adapt the call (not the intent).

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/content/content.test.ts`
Expected: FAIL — cannot resolve `@/content/facilitator-guides.data`.

- [ ] **Step 3: Add the type**

Append to `src/lib/content/types.ts` after the `ModuleItem` union:

```ts
/**
 * Session plan for running a module as a synchronous meeting. Not a module
 * item: no itemIds entry, no progress unit, no prerequisite effect. Rendered
 * publicly at /tracks/[trackSlug]/[moduleSlug]/guide.
 */
export interface FacilitatorGuide {
  id: string;
  /** Module this guide covers; at most one guide per module. */
  moduleId: string;
  /** Path (without extension) under `src/content/guides` to the MDX body. */
  contentRef: string;
  /** Planned session length in minutes. */
  sessionLength: number;
  /** Intended group size, free text, e.g. "4–10". */
  groupSize: string;
  /** Room needs, e.g. "whiteboard". */
  materials?: string[];
}
```

- [ ] **Step 4: Add the data file**

Create `src/content/facilitator-guides.data.ts`:

```ts
import type { FacilitatorGuide } from "@/lib/content/types";

export const facilitatorGuides: FacilitatorGuide[] = [
  {
    id: "guide-c-intro",
    moduleId: "c-intro",
    contentRef: "c-intro",
    sessionLength: 60,
    groupSize: "4–10",
    materials: ["whiteboard"],
  },
];
```

- [ ] **Step 5: Add the guide MDX body**

Create `src/content/guides/c-intro.mdx` with exactly this content (facilitation scaffolding only — prompts are questions, not claims):

```mdx
## Session goal

By the end of the meeting, each participant can explain in their own words what
AI control assumes, how the control game in the AI Control paper works, and why
the module distinguishes concentrated from diffuse threats. The session assumes
participants have worked through at least the first two readings beforehand.

## Before the session

- Skim all five module readings yourself; you do not need to master the demos.
- If you run a classroom, open its dashboard and check each student's progress
  column for this module. Note who has not reached
  [the AI Control paper](/tracks/control/introduction/ai-control-paper) — pair
  them with someone further along during the exercise block.
- Check the submissions column for completed written responses; pick one or two
  anonymized excerpts you can read out as discussion starters (ask permission).
- Have the [Control scenarios](/exercises/control-scenarios) exercise open on a
  screen you can share.

## Agenda

### Warm-up: what is control? (10 min)

Ask two or three participants to state the core bet of
[the case for controlling powerful AIs](/tracks/control/introduction/the-case-for-controlling-powerful-ais)
in one sentence, without looking. Write the candidate phrasings on the
whiteboard and let the group edit them into one agreed sentence.

Prompt: "What would have to be true about a model for control, as the reading
defines it, to stop being enough?"

### The control game, together (20 min)

Walk the room through the setup of
[the AI Control paper](/tracks/control/introduction/ai-control-paper): who the
red team is, who the blue team is, and what winning means. Then run
[Control scenarios](/exercises/control-scenarios) as a group on the shared
screen — read each scenario aloud, take a hand-count vote before revealing,
and ask one person from the majority and one from the minority to defend their
vote before you reveal.

Prompt: "Which assumption of the game felt least realistic to you, and what
would change if you dropped it?"

### Catching and consequences (10 min)

Split into pairs. Each pair gets two minutes to answer: "According to
[Catching AIs red-handed](/tracks/control/introduction/catching-ais-red-handed),
what changes after the first catch?" Then compare answers across pairs and ask
[why catching counts](/exercises/why-catching-counts) as a checkpoint if the
group wants a structured recap.

### Threat prioritization debate (15 min)

Put the concentrated-versus-diffuse distinction from
[Prioritizing threats for AI control](/tracks/control/introduction/prioritizing-threats-for-ai-control)
on the whiteboard as two columns. Ask the group to place example failures from
the readings into a column and to argue placements they disagree on. Close by
asking who changed their mind after
[the diffuse-threats reading](/tracks/control/introduction/diffuse-threats-research-sabotage)
and why.

### Wrap-up (5 min)

Each participant names one question they still have. Collect these; they are
your agenda seeds for the next session and good prompts for the module's
remaining exercises.

## Common sticking points

- Participants often blur control with alignment. Send them back to the
  definitions in the first reading rather than adjudicating yourself.
- The control game's red/blue framing reads as a competition; groups can rat-hole
  on game tactics instead of what the game is evidence for. Redirect with:
  "What real-world quantity is this game trying to estimate?"
- Quieter participants disengage during whole-room debate — the pair block in
  the third agenda item is there to pull them back in; do not skip it.

## After the session

- On the classroom dashboard, check whether participants who attended go on to
  complete the module's remaining readings during the week.
- Read new submissions for the module's written exercises; recurring confusions
  belong on next session's warm-up.
- If several participants asked the same wrap-up question, post it (and where
  the readings address it) in your group's channel rather than waiting a week.
```

- [ ] **Step 6: Add accessors**

In `src/lib/content/index.ts`:
- Add import: `import { facilitatorGuides } from "@/content/facilitator-guides.data";`
- Add `FacilitatorGuide` to the type-import block from `./types` and to the `export type {...}` re-export block.
- After the existing map-building block (~line 37) add:

```ts
const guideByModuleId = new Map(facilitatorGuides.map((g) => [g.moduleId, g]));
```

- With the other accessors add:

```ts
export function getGuideForModule(moduleId: string): FacilitatorGuide | undefined {
  return guideByModuleId.get(moduleId);
}

export function getAllGuides(): FacilitatorGuide[] {
  return facilitatorGuides;
}
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npx vitest run src/lib/content/content.test.ts`
Expected: PASS (including the three new tests and the extended slug test).

- [ ] **Step 8: Typecheck and commit**

Run: `npm run typecheck`
Expected: clean.

```bash
git add src/lib/content/types.ts src/content/facilitator-guides.data.ts src/content/guides/c-intro.mdx src/lib/content/index.ts src/lib/content/content.test.ts
git commit -m "feat: facilitator-guide content type + Control module 1 guide"
```

---

### Task 2: Guide route page

**Files:**
- Create: `src/components/mdx/guide-content.tsx`
- Modify: `src/components/mdx/lesson-content.tsx` (only if `LessonSection` is not already exported — export it)
- Create: `src/app/tracks/[trackSlug]/[moduleSlug]/guide/page.tsx`

**Interfaces:**
- Consumes: `getGuideForModule`, `getModuleBySlugs` from `@/lib/content` (Task 1); `Breadcrumbs` from `@/components/layout/breadcrumbs`; `Badge` from `@/components/ui/badge`.
- Produces: `GuideContent({ contentRef })` server component; `getGuideSections(contentRef): Promise<LessonSection[]>`; the public route `/tracks/[trackSlug]/[moduleSlug]/guide`.

- [ ] **Step 1: Create the MDX loader**

Create `src/components/mdx/guide-content.tsx`, mirroring `lesson-content.tsx`:

```tsx
import { notFound } from "next/navigation";
import type { LessonSection } from "./lesson-content";

async function importGuide(contentRef: string) {
  try {
    // Per-guide dynamic import => Turbopack code-splits each MDX body.
    return await import(`@/content/guides/${contentRef}.mdx`);
  } catch {
    return null;
  }
}

export async function getGuideSections(
  contentRef: string,
): Promise<LessonSection[]> {
  const mdxModule = (await importGuide(contentRef)) as {
    sections?: LessonSection[];
  } | null;
  return Array.isArray(mdxModule?.sections) ? mdxModule.sections : [];
}

export async function GuideContent({ contentRef }: { contentRef: string }) {
  const mdxModule = await importGuide(contentRef);
  if (!mdxModule) notFound();
  const Body = mdxModule.default;

  return (
    <article className="lesson-body prose prose-neutral prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-destructive prose-a:font-medium prose-a:underline-offset-4 max-w-none">
      <Body />
    </article>
  );
}
```

If `LessonSection` is not exported from `lesson-content.tsx`, add `export` to its declaration there.

- [ ] **Step 2: Create the page**

Create `src/app/tracks/[trackSlug]/[moduleSlug]/guide/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuideForModule, getModuleBySlugs } from "@/lib/content";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { GuideContent, getGuideSections } from "@/components/mdx/guide-content";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trackSlug: string; moduleSlug: string }>;
}): Promise<Metadata> {
  const { trackSlug, moduleSlug } = await params;
  const resolved = getModuleBySlugs(trackSlug, moduleSlug);
  return {
    title: resolved ? `Facilitator guide — ${resolved.module.title}` : "Facilitator guide",
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ trackSlug: string; moduleSlug: string }>;
}) {
  const { trackSlug, moduleSlug } = await params;
  const resolved = getModuleBySlugs(trackSlug, moduleSlug);
  if (!resolved) notFound();
  const { track, module } = resolved;
  const guide = getGuideForModule(module.id);
  if (!guide) notFound();

  const sections = (await getGuideSections(guide.contentRef)).filter(
    (s) => s.title,
  );

  return (
    <div className="max-w-3xl px-4 py-8 lg:px-8">
      <Breadcrumbs
        items={[
          { label: track.title, href: `/tracks/${track.slug}` },
          { label: module.title, href: `/tracks/${track.slug}/${module.slug}` },
          { label: "Facilitator guide" },
        ]}
      />

      <p className="text-muted-foreground text-sm">Facilitator guide</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">{module.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="outline">{guide.sessionLength} min session</Badge>
        <Badge variant="outline">Group of {guide.groupSize}</Badge>
        {(guide.materials ?? []).map((m) => (
          <Badge key={m} variant="outline">
            {m}
          </Badge>
        ))}
      </div>

      {sections.length >= 2 && (
        <nav className="text-muted-foreground mt-6 text-sm">
          <p className="font-medium">In this session</p>
          <ul className="mt-1 space-y-1">
            {sections.map((s) => (
              <li key={s.id}>
                <a className="underline underline-offset-4" href={`#${s.id}`}>
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="mt-8">
        <GuideContent contentRef={guide.contentRef} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: clean. (If `LessonSection`'s fields differ from `{ id, title?, level }`, adapt the `.filter((s) => s.title)` line to the real shape — read the interface in `lesson-content.tsx`.)

- [ ] **Step 4: Verify the route renders**

Run: `npm run dev` in the background, then:
`curl -s http://localhost:3000/tracks/control/introduction/guide | grep -o "Facilitator guide" | head -1`
Expected: `Facilitator guide`. Also confirm a 404: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/tracks/control/how-useful-is-ai-control/guide` → `404`. Stop the dev server.

- [ ] **Step 5: Run full test suite and commit**

Run: `npm run test`
Expected: PASS.

```bash
git add src/components/mdx/guide-content.tsx src/components/mdx/lesson-content.tsx "src/app/tracks/[trackSlug]/[moduleSlug]/guide/page.tsx"
git commit -m "feat: public facilitator-guide route under module segment"
```

---

### Task 3: Light links (module page + classroom instructor page)

**Files:**
- Modify: `src/app/tracks/[trackSlug]/[moduleSlug]/page.tsx`
- Modify: `src/app/classrooms/[id]/page.tsx`

**Interfaces:**
- Consumes: `getGuideForModule`, `getModulesForTrack` from `@/lib/content` (Task 1); the route from Task 2.
- Produces: nothing new — UI links only.

- [ ] **Step 1: Module page link**

In `src/app/tracks/[trackSlug]/[moduleSlug]/page.tsx`:
- Add `getGuideForModule` to the existing `@/lib/content` import block.
- Next to `const assessment = getAssessmentForModule(module.id);` add
  `const guide = getGuideForModule(module.id);`.
- Directly after the closing of the Assessment `{assessment && (...)}` section
  (~line 173), inside the same unlocked branch, add (reuse the already-imported
  `Card`/`Button`/`Link`; add `CardContent`/`CardFooter` to the ui/card import
  if not present):

```tsx
          {guide && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold">For facilitators</h2>
              <Card className="shadow-soft mt-3">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-sm">
                    Run this module as a live session: a {guide.sessionLength}-minute
                    plan with discussion prompts and a shared exercise walkthrough.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline">
                    <Link href={`${moduleHref}/guide`}>Open facilitator guide</Link>
                  </Button>
                </CardFooter>
              </Card>
            </section>
          )}
```

- [ ] **Step 2: Classroom instructor page links**

In `src/app/classrooms/[id]/page.tsx`:
- Extend the `@/lib/content` import to `import { getGuideForModule, getModulesForTrack, getTrackById } from "@/lib/content";`
- In the instructor branch, next to `const keyStatus = await getClassroomKeyStatus(classroom.id);` add:

```tsx
  const guideModules = track
    ? getModulesForTrack(track.id).filter((m) => getGuideForModule(m.id))
    : [];
```

- After the closing `</div>` of the header flex row (the one containing the
  join-code block, ~line 122) and before the `{students.length === 0 ? (` block, add:

```tsx
      {track && guideModules.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Facilitator guides</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Session plans for running this classroom&apos;s modules as live meetings.
          </p>
          <ul className="mt-2 space-y-1">
            {guideModules.map((m) => (
              <li key={m.id}>
                <Link
                  className="text-sm underline underline-offset-4"
                  href={`/tracks/${track.slug}/${m.slug}/guide`}
                >
                  Module {m.order}: {m.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
```

- [ ] **Step 3: Typecheck + tests**

Run: `npm run typecheck && npm run test`
Expected: clean / PASS.

- [ ] **Step 4: Visual check**

With `DEV_USER=1` in `.env` and the dev server running, load
`http://localhost:3000/tracks/control/introduction` and confirm the
"For facilitators" card renders below the Assessment/Contents area. (The
classroom section needs a classroom with `trackId` set — if none exists
locally, confirm by typecheck only and note it for the user's visual pass.)

- [ ] **Step 5: Commit**

```bash
git add "src/app/tracks/[trackSlug]/[moduleSlug]/page.tsx" "src/app/classrooms/[id]/page.tsx"
git commit -m "feat: link facilitator guides from module and classroom pages"
```

---

### Task 4: Authoring docs

**Files:**
- Modify: `AUTHORING.md` (append section 6 after section 5, keeping its numbered style)

**Interfaces:**
- Consumes: everything shipped in Tasks 1–3.
- Produces: the authoring workflow for future guides.

- [ ] **Step 1: Write AUTHORING.md section 6**

Append a section titled `## 6. Write a facilitator guide` documenting, in the file's existing step-list style:
1. Add an entry to `src/content/facilitator-guides.data.ts` (`id`, `moduleId`, `contentRef`, `sessionLength`, `groupSize`, optional `materials`); one guide per module.
2. Create `src/content/guides/<contentRef>.mdx` with the five required sections: Session goal, Before the session, Agenda (timed `###` blocks), Common sticking points, After the session.
3. Linking rules: link module readings as `/tracks/<track>/<module>/<itemSlug>`, exercises as `/exercises/<id>`, demos as `/demos/<id>` — `content.test.ts` validates every such link resolves.
4. The content rule: discussion prompts and timing are original facilitation scaffolding; any claim about the material must restate the human-authored readings — never invent curriculum claims.
5. Where it renders: `/tracks/<track>/<module>/guide`, plus automatic links on the module page and classroom instructor page.
6. Run `npx vitest run src/lib/content/content.test.ts` and `npm run typecheck`.

Copy the concrete file-snippet style used by sections 1–5 (show the data-entry object and a skeleton MDX with the five headings).

- [ ] **Step 2: Commit**

```bash
git add AUTHORING.md
git commit -m "docs: authoring workflow for facilitator guides"
```

---

## Final verification (after all tasks)

- [ ] `npm run typecheck && npm run lint && npm run test` — all clean.
- [ ] `git log --oneline main..facilitator-guides` shows the four feature commits plus the spec commit.
- [ ] Ask the user to do the visual pass (guide page, module card, classroom section) and to review the guide prose as curriculum owner before any PR.
- [ ] Do NOT push to `main`. Push the `facilitator-guides` branch and open a PR only when the user says so.
