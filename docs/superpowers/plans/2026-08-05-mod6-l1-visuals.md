# Module 6 "Alternatives to Schemers" Visuals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build every bracketed diagram/layout item in `src/content/lessons/c-mod6-l1.mdx`, replacing each `*[...]*` line with a working visual.

**Architecture:** Each visual is a self-contained `"use client"` demo component in `src/components/demos/`, registered by id in `src/lib/demos/registry.ts`, and embedded in the lesson via `<Demo id="..." />`. One item (the comparison table) is a static MDX table, and one (the slop tie-back) reuses the existing `five-worlds` demo. The 18 bracketed lines collapse into 12 new demos + 1 table + 1 reuse, because the two schemer-comparison brackets share one demo and the four "on highlight" brackets share one demo.

**Tech Stack:** React 19 client components, hand-rolled inline SVG, Tailwind v4 utility classes, `slide-stepper.tsx` for the one stepper demo, Vitest for registry wiring.

## Global Constraints

- House demo idiom (from `CLAUDE.md`): self-contained `"use client"` files, no app-internal deps beyond design-system imports; never wrap in `DemoFrame` (`DemoById` applies it); hand-rolled inline SVG, no chart libraries; theme tokens (`card`/`border`/`muted`/`primary`) for structure, fixed palette classes (`fill-amber-500`) for accents; **never literal hex/rgb**.
- **Never invent curriculum content.** Every label and caption must restate a sentence already in `c-mod6-l1.mdx` (quoted per task below). Where the lesson does not state a fact (severity order, risk rankings), render only what the lesson states and mark the rest `AUTHOR INPUT` (see list below).
- Stepper demos render **one** SVG scene per step and fade layers with CSS transitions keyed off the step index.
- Registry entries use the existing shape: `{ id, title, description, component, tags }`. Use `tags: ["control", "seekers"]`.
- Components are verified by `npm run typecheck` + a visual pass in `npm run dev`, not DOM tests (repo convention). Registry wiring is covered by `src/lib/demos/registry.test.ts`.
- Commit each task to `mod-6`. Push only to `origin/mod-6` (preview). **Never push `main`** (production deploy). Rebase on `origin/main` right before any push. Another session works on this branch — `git pull --rebase origin mod-6` before starting each task.
- Lesson heading anchors come from `rehype-slug` (e.g. `#rote--reward-on-the-episode-seeker`). Any demo that scrolls to them must null-guard `document.getElementById` — the anchors do not exist on the `/demos` gallery page.

## AUTHOR INPUT required (collect before or during execution; safe defaults noted)

1. **"bsm"** in "diagram in regards to part of bsm" (Task 4) is undefined in the repo. Default reading: the behavioral-selection model from "How seekers come to exist". Confirm with the author.
2. **Severity order** for the carousel (Task 10). The lesson pins only: ROTA is the yellow/green (safest); influence seekers are "more dangerous and probably unnoticeable". Default order (safest→worst): ROTA, ROTE, apparent-success, remotely-influenceable, influence. Author must confirm the middle three.
3. **Risk→seeker rankings** for the hover panels (Task 11). The lesson explicitly attributes only: Potemkin work ← apparent-success; Manipulation ← remotely-influenceable; Outcome enforcement ← "powerful fitness-seekers"; Instability ← "myopic motivations" (no specific orientation). Render only these until the author supplies full rankings; show "ranking in development" for the gaps.
4. **Slop tie-back target** (Task 14): default `five-worlds` (it maps Slopolis); alternative `rsi-bootstrap`. Confirm.

---

### Task 1: Exemplar static demo — honest test

Replaces: `*[diagram here of an agent having access to its own weights and being baited to change them?]*` (ROTE section).

**Files:**
- Create: `src/components/demos/honest-test-demo.tsx`
- Modify: `src/lib/demos/registry.ts` (add entry + import)
- Modify: `src/content/lessons/c-mod6-l1.mdx` (swap bracket line for embed)

**Interfaces:**
- Produces: `HonestTestDemo` (default-props React component, no props), registry id `"honest-test"`. Tasks 2–9 copy this file's structure.

- [ ] **Step 1: Write the component**

Scene (one SVG, `viewBox="0 0 720 300"`): left, a rounded-rect "AI" node (`fill-card stroke-border`). Center, an offered lever: a rect labeled "control of its training process / weights" with an arrow from a "Developer" node above (arrow: `stroke-muted-foreground`, `markerEnd` triangle). Right, two outcome branches from the AI node: top branch (accent `stroke-amber-500`) to a badge "takes the bait → visible" ; bottom branch (`stroke-muted-foreground`, dashed) to a badge "forgoes the reward → not caught". Caption text under the SVG, verbatim from the lesson: "an honest test … involves giving the seeker an opportunity to max out its own reward by giving it control of its training process / weights" and "honest tests no longer work on influence seekers as they'll just forgo the short-term reward."

```tsx
"use client";

const CAPTION =
  "An honest test gives the seeker an opportunity to max out its own reward by giving it control of its training process / weights. Reward-on-the-episode seekers take the bait because they don't care about getting caught; influence seekers just forgo the short-term reward.";

export default function HonestTestDemo() {
  return (
    <figure className="space-y-3">
      <svg viewBox="0 0 720 300" role="img" aria-label="Honest test diagram" className="w-full">
        {/* nodes, lever, branches per scene spec */}
      </svg>
      <figcaption className="text-sm text-muted-foreground">{CAPTION}</figcaption>
    </figure>
  );
}
```

Draw the scene with `<rect>`/`<path>`/`<text>` using only Tailwind classes (`fill-card`, `stroke-border`, `fill-foreground` for text, `stroke-amber-500` for the bait branch).

- [ ] **Step 2: Register the demo**

In `src/lib/demos/registry.ts`, import `HonestTestDemo` and add:

```ts
"honest-test": {
  id: "honest-test",
  title: "The honest test",
  description:
    "Offer the AI control of its own training process / weights and watch its response.",
  component: HonestTestDemo,
  tags: ["control", "seekers"],
},
```

- [ ] **Step 3: Embed in the lesson**

In `c-mod6-l1.mdx`, replace the bracket line under the honest-test bullet with:

```mdx
<Demo id="honest-test" />
```

- [ ] **Step 4: Verify**

Run: `npm run typecheck && npx vitest run src/lib/demos/registry.test.ts src/lib/content/content.test.ts`
Expected: PASS. Then visual pass: `npm run dev`, check the lesson page and `/demos/honest-test`.

- [ ] **Step 5: Commit**

```bash
git add src/components/demos/honest-test-demo.tsx src/lib/demos/registry.ts src/content/lessons/c-mod6-l1.mdx
git commit -m "Add honest-test diagram to Alternatives to Schemers"
```

---

### Task 2: Exploration-horizon diagram

Replaces: `*[diagram which expresses how when given limited exploration, the model converges to simple detectable misalignment. But when given longer horizon RL, there is more space for exploration which can converge to a more covert malignant misalignment]*`.

**Files:** Create `src/components/demos/exploration-horizon-demo.tsx`; modify registry (`id: "exploration-horizon"`, title "Exploration horizon and covert misalignment") and the lesson (same bullet).

**Scene:** two side-by-side panels sharing one SVG. Left panel "Limited exploration": a small shaded region (`fill-muted`) inside a larger outcome space, converging dot labeled "simple, detectable misalignment" (`fill-amber-500`). Right panel "Longer-horizon RL": a much larger shaded region, converging dot labeled "more covert, malignant misalignment" (`fill-red-500`). Caption restates the bracket's own sentence (it is author prose already).

Steps mirror Task 1 exactly: component → registry → embed → `npm run typecheck && npx vitest run src/lib/demos/registry.test.ts src/lib/content/content.test.ts` → visual pass → commit `"Add exploration-horizon diagram to Alternatives to Schemers"`.

---

### Task 3: Cross-episode collusion diagram

Replaces: `*[diagram of instances expressing messages to communicate with a following instance in the following episode]*`.

**Files:** Create `src/components/demos/cross-episode-collusion-demo.tsx`; registry id `"cross-episode-collusion"`, title "Collusion across episodes"; embed at the same bullet.

**Scene:** three episode boxes "Episode 1/2/3" left→right, an instance node inside each, a curved message arrow (`stroke-amber-500`, dashed) from each instance to the next episode's instance. A bracket underneath spanning all three labeled "effectively lengthens the timescale". Caption verbatim: "collusion across episodes … can effectively lengthen the timescale and allow for disempowerment as well."

Steps: as Task 1. Commit: `"Add cross-episode collusion diagram to Alternatives to Schemers"`.

---

### Task 4: Behavioral-selection ("bsm") diagram — AUTHOR INPUT #1

Replaces: `*[diagram in regards to part of bsm which will direct the user to a description]*`.

**Files:** Create `src/components/demos/behavioral-selection-demo.tsx`; registry id `"behavioral-selection"`, title "Behavioral selection"; embed at the first ROTE bullet.

**Scene (default reading, confirm with author):** left, a cloud of candidate cognitive-pattern nodes (aligned intent, seeker, schemer — labels from the lesson's own terms). Center, a filter box labeled "training reinforces whichever behavior scored well, not whichever goal produced it" (verbatim from "How seekers come to exist"). Right, the surviving mix with the seeker node accented (`fill-amber-500`). "Direct the user to a description": the seeker node is an `<a href="#what-a-seeker-is">` wrapping the SVG group (works in-lesson; harmless dead link on `/demos` — or null-guard with `getElementById` + `scrollIntoView`).

Steps: as Task 1. Commit: `"Add behavioral-selection diagram to Alternatives to Schemers"`.

---

### Task 5: Distant incentives (retroactive reward + anthropic capture)

Replaces: `*[create diagrams expressing both what retroactive reward looks like, and anthropic capture]*`.

**Files:** Create `src/components/demos/distant-incentives-demo.tsx`; registry id `"distant-incentives"`, title "Distant incentives"; embed in the remotely-influenceable section.

**Scene:** one SVG, two stacked panels.
- Panel A "Retroactive reward": a timeline arrow; "action" marker at the left (now), "reward delivered" marker far right (later), a promise arrow from a "third-party bad actor" node down to the action point. Caption fragment (verbatim): "reward is promised to be delivered long after the action is run."
- Panel B "Anthropic capture": an agent node inside a dashed frame labeled "simulation?", with a thought-bubble line "believes it is in a simulation & acts differently as a result" (verbatim).

Steps: as Task 1. Commit: `"Add distant-incentives diagram (retroactive reward, anthropic capture)"`.

---

### Task 6: Seeker–schemer comparison diagram (shared by two brackets)

Replaces BOTH: `*[Make diagram showing its similarities to schemers, using comparison]*` (remotely-influenceable) AND `*[do a comparison with schemers and influenceable seekers diagram]*` (influence section). One demo, embedded at both points.

**Files:** Create `src/components/demos/seeker-schemer-comparison-demo.tsx`; registry id `"seeker-schemer-comparison"`, title "Schemers vs. influence and influenceable seekers"; embed twice.

**Scene:** three columns — Schemer / Influence seeker / Remotely-influenceable seeker — with aligned rows, every cell lifted from lesson bullets:
- Pursues: "some other terminal goal" / "influence their deployment" / "its reward signal" (via distant influences).
- Timescale: long / "shorter timescales… minimum time required to control AI behavior in deployment" / within-episode.
- Honest test: passes ("performs well only to survive selection") / fails to catch ("just forgo the short-term reward") / catches ("don't care about getting caught").
- Distant incentives: — / — / "responds to distant influences given… by a third-party bad actor".
Shared traits get a connecting band (`fill-muted`) across columns.

Steps: as Task 1, but Step 3 replaces two bracket lines with the same `<Demo id="seeker-schemer-comparison" />`. Commit: `"Add schemer-comparison diagram, embedded in both seeker sections"`.

---

### Task 7: Satiation trade diagram

Replaces: `*[diagram of basic trade case, giving ais money or space to maximize their reward in exchange for misalignment examples]*`.

**Files:** Create `src/components/demos/satiation-trade-demo.tsx`; registry id `"satiation-trade"`, title "The basic trade case"; embed under the Satiation bullet.

**Scene:** "Developers" node left, "AI" node right. Top arrow (→, `stroke-emerald-500`) labeled "money or space to maximize their reward"; bottom arrow (←, `stroke-amber-500`) labeled "misalignment examples / apparent cooperation". Footnote line (verbatim): "only reasonable if they're easily satiable."

Steps: as Task 1. Commit: `"Add satiation trade diagram"`.

---

### Task 8: Long-term measurements diagram

Replaces: `*[illustrate this]*` under Long-term measurements.

**Files:** Create `src/components/demos/forecast-chain-demo.tsx`; registry id `"forecast-chain"`, title "Chained short-term forecasts"; embed at the bullet.

**Scene:** a long horizon bar; beneath it, a chain of small forecast boxes f₁→f₂→f₃→f₄ each covering a short span, arrows linking each to the next, with the chain's combined span bracketed to match the long horizon. Caption (verbatim): "chain short-term forecasts together to incentivize objectives beyond immediate reward, giving more accurate results."

Steps: as Task 1. Commit: `"Add chained-forecasts diagram for long-term measurements"`.

---

### Task 9: Spillway motivations visual

Replaces: `*[create visual for this]*` under Spillway motivations.

**Files:** Create `src/components/demos/spillway-demo.tsx`; registry id `"spillway"`, title "Spillway motivations"; embed at the bullet.

**Scene:** a dam/reservoir silhouette: rising water labeled "fitness-seeking pressure", a spillway channel routing overflow into a contained basin labeled "controlled reward-seeking motivation". Four callout tags on the channel, verbatim: "cheap satiability", "credulity (trusts developer descriptions)", "stability", "resistance to distant influence". Caption from the bullet: "Acts as a 'spillway' … keep the models content & less prone to misaligned behavior."

Steps: as Task 1. Commit: `"Add spillway motivations visual"`.

---

### Task 10: Seeker severity carousel — AUTHOR INPUT #2

Replaces: `*[The following seeker orientations can be displayed in a diagram ranked on severity, and will be like a vertical carousel that goes from yellow down to red/orange]*` and `*[This will be the yellow/green on the carousel]*` (ROTA).

**Files:** Create `src/components/demos/seeker-carousel-demo.tsx`; registry id `"seeker-carousel"`, title "The seeker orientations, by severity"; embed after "How seekers come to exist" (replacing the first bracket) and delete the ROTA bracket line (the carousel covers it).

**Data (order = AUTHOR INPUT #2 default):**

```tsx
const ORIENTATIONS = [
  { id: "rota", label: "ROTA — return-on-the-action", anchor: "rota--return-on-the-action-seeker", tone: "lime" },
  { id: "rote", label: "ROTE — reward-on-the-episode", anchor: "rote--reward-on-the-episode-seeker", tone: "yellow" },
  { id: "apparent", label: "Apparent-success", anchor: "apparent-success-seeker", tone: "amber" },
  { id: "remote", label: "Remotely-influenceable", anchor: "remotely-influenceable-reward-seeker", tone: "orange" },
  { id: "influence", label: "Influence — deployment-influence", anchor: "influence--deployment-influence-seeker", tone: "red" },
] as const;
```

Verify each `anchor` against the rendered page (rehype-slug output) during the visual pass.

**Behavior:** a vertical list, top (lime/`bg-lime-500`) to bottom (red/`bg-red-500`), one severity swatch per row plus the orientation label and a one-line summary lifted from that orientation's first bullet. Clicking a row calls `document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" })` (null-guarded for the gallery). Keyboard: rows are `<button>`s. This is a DOM component (no SVG needed); Tailwind only.

Steps: as Task 1 (component → registry → embeds → typecheck + registry/content tests → visual pass → commit `"Add seeker severity carousel"`).

---

### Task 11: Risk → seeker ranking panels — AUTHOR INPUT #3

Replaces all four: `*[on highlight a ranking of seekers which attribute most of this risks should show]*` (Potemkin work, Instability, Manipulation, Outcome enforcement).

**Files:** Create `src/components/demos/seeker-risk-map-demo.tsx`; registry id `"seeker-risk-map"`, title "Which seekers drive which risks"; embed **once** at the end of the "What?" subsection, replacing all four bracket lines.

**Data (only lesson-stated attributions; gaps say "ranking in development"):**

```tsx
const RISKS = [
  { id: "potemkin", label: "Potemkin work", attributed: ["Apparent-success"], note: "see apparent-success seekers as a potential path to this" },
  { id: "instability", label: "Instability", attributed: [], note: "myopic motivations succumb to more ambitious misaligned motivations" },
  { id: "manipulation", label: "Manipulation", attributed: ["Remotely-influenceable"], note: "remotely-influenceable reward seekers are vulnerable to distant incentives" },
  { id: "enforcement", label: "Outcome enforcement", attributed: ["Powerful fitness-seekers"], note: "may see the disempowerment of humans as the best way to maintain their desired outcomes" },
] as const;
```

**Behavior:** four cards in a responsive grid. Hover-intent on desktop / tap on touch expands the card to show the attributed seekers as ranked chips plus the note (all copy verbatim from the lesson). Cards with an empty list show a muted "ranking in development" chip. Follow the glossary card's interaction pattern (hover-intent, tap on touch, Escape/outside dismiss) but keep the component self-contained — reimplement the small hover/tap logic locally rather than importing app internals.

Steps: as Task 1. Commit: `"Add risk-to-seeker ranking panels (partial, pending author rankings)"`.

---

### Task 12: Adversary-resistance stepper

Replaces: `*[create slide diagram for this]*` under Adversary-resistance training.

**Files:** Create `src/components/demos/adversary-resistance-demo.tsx`; registry id `"adversary-resistance"`, title "Adversary-resistance training"; embed at the bullet.

**Behavior:** use `SlideStepper` from `src/components/demos/slide-stepper.tsx` (render-prop `children(step)`, Back/dots/Next). One SVG scene; layers fade by step index. Three steps, captions built only from the bullet's quoted text:
1. Two visually identical situation cards ("identical-looking situations").
2. Reveal differing reward tags behind them ("with different reward functions").
3. Highlight the developer-channel arrow; dim the adversary arrow ("so the AI only responds to developer-administered incentives").

Steps: as Task 1, plus check arrow-key stepping and that stepping backward animates (CSS transitions, not remounts). Commit: `"Add adversary-resistance training stepper"`.

---

### Task 13: End-of-taxonomy comparison table (static MDX)

Replaces: `*[have the comparison table be at the end with all relevant model orientations]*`.

**Files:** Modify `src/content/lessons/c-mod6-l1.mdx` only.

A plain markdown table after the influence section, columns: Orientation | Pursues | Timescale | Honest test | Notable trait. Six rows — Schemer, ROTA, ROTE, Remotely-influenceable, Apparent-success, Influence — every cell a phrase lifted from the lesson (same source cells as Task 6, plus ROTA "highest return for a single action… hard to coordinate behavior between actions" and apparent-success "aim for apparent task success… optimal kludge of motivations"). No new claims; where the lesson is silent, put "—".

Steps: edit → `npx vitest run src/lib/content/content.test.ts` → visual pass (table styling comes from `@tailwindcss/typography`) → commit `"Add end-of-taxonomy orientation comparison table"`.

---

### Task 14: Slop tie-back (reuse) — AUTHOR INPUT #4

Replaces: `*[Bring this back to the slop threat model diagram]*` (apparent-success section).

**Files:** Modify `src/content/lessons/c-mod6-l1.mdx` only.

Replace the bracket with the existing demo embed and one pointer sentence that makes no new claim:

```mdx
This is the slop threat model from the earlier module:

<Demo id="five-worlds" />
```

If the author picks `rsi-bootstrap` instead, swap the id; no other change.

Steps: edit → content test → visual pass → commit `"Tie apparent-success seekers back to the slop threat-model demo"`.

---

### Task 15: Final sweep

- [ ] `grep -n '\*\[' src/content/lessons/c-mod6-l1.mdx` — expected: no matches.
- [ ] `npm run typecheck && npm run test && npm run lint` — expected: all pass.
- [ ] Full visual pass of the lesson page and the `/demos` gallery (all 12 new ids render, Reset works, dark and light themes).
- [ ] `git pull --rebase origin mod-6`, then push to `origin/mod-6` only. Never push `main`.
- [ ] Hand the AUTHOR INPUT list (top of this plan) to the author; Tasks 4, 10, 11, 14 carry defaults that need their sign-off.
