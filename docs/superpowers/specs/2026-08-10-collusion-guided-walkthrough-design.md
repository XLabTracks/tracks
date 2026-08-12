# Collusion-prevention guided walkthrough replaces untrusted advice (module 5)

Date: 2026-08-10
Status: approved
Branch: mod-5

## Goal

Replace module 5's closing guided walkthrough `c-paper-ua-guided` (Untrusted
advice for AI control) with a guided walkthrough of Buck Shlegeris's post
["How to prevent collusion when using untrusted models to monitor each
other"](https://www.lesswrong.com/posts/GCqoks9eZDfpL8L3Q/how-to-prevent-collusion-when-using-untrusted-models-to)
(LessWrong, 2024-09-25), in the same predict-first gated style. The module
keeps its "one argued, one measured" closing pair: the new walkthrough is the
argued one; `c-paper-legibility-guided` stays the measured one.

## Removal: c-paper-ua-guided

Full removal — git history is the archive:

- Delete the `c-paper-ua-guided` entry from `src/content/papers.data.ts`
  (currently lines ~1659–1909, including its leading comment).
- Remove `"c-paper-ua-guided"` from `c-mod5`'s `itemIds` in
  `src/content/curriculum.data.ts`.
- Delete the committed artifact
  `src/content/substack/blog.redwoodresearch.org__untrusted-advice-for-ai-control-short.json`
  and its assets directory under `public/substack/`.
- Remove its entry from `src/content/reading-permissions.json`.
- Re-run `npm run readings:build` so `src/content/linked-readings.json` drops
  any readings only that artifact linked (never hand-edit the registry).

No other code references the id (verified by grep).

## New paper item: c-paper-collusion-guided

In `src/content/papers.data.ts`, in ua-guided's old position:

```ts
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
```

Module placement in `c-mod5.itemIds`: after `c-paper-settings-high-stakes`,
before `c-paper-legibility-guided` (the exact slot ua-guided held).

`src/content/reading-permissions.json` gains a `permitted` entry for
`lesswrong__GCqoks9eZDfpL8L3Q` (author permission granted).

Build the artifact with `npm run lesswrong:build` (it converts every post the
content references; the artifact id will be `lesswrong__GCqoks9eZDfpL8L3Q`);
resolve all edit targets offline from the committed artifact via
`-- --toc` / `-- --blocks`. Exact anchors and snippets are an implementation
concern; the placements below name the post's sections.

## Edits array (post order)

The post's three big moves are: design the untrusted-monitoring scaffold,
break it as a scheming monitor, defend it against collusion. Five written
gates sit at the decision points; every gate poses the question the next
section answers.

1. **Silent hides** — the deployment-architecture diagram and the
   suspiciousness-threshold figure (both ahead of gate 1; they spoil the
   scaffold the learner is asked to invent). Text-less blocks: anchor is the
   target, snippet is documentary, per the existing convention in
   `patch-section.ts` / `content.test.ts`.
2. **"About this version" note** — after the intro's problem statement.
   Mirrors ua-guided's framing note; links the original post with a literal
   external link.
3. **Gate `invent-scaffold`** (written, minChars 80) — before "A basic design
   for untrusted monitoring". Prompt: design a deployment that uses U to
   catch U's attacks; specify what happens at each suspiciousness score
   (execute / replace / audit).
4. **Gate `monitor-value`** (written, minChars 60) — before "How helpful
   would this be if the untrusted monitor did its best?". Prompt: argue why
   an untrusted monitor would beat the trusted monitor, assuming honesty.
5. **Gate `break-protocol`** (written, minChars 80) — before "Analyzing under
   the adversarial assumption". Prompt: as the scheming monitor, find the
   policy that defeats this setup.
6. **Reveal note** — after the conditional-truth-telling reveal, restating
   the post's answer: report synthetic attacks truthfully, lie about real
   ones; safety hinges on whether the schemer can tell them apart.
7. **Gate `honeypot-detection`** (written, minChars 80) — before "How hard is
   it for a schemer to distinguish real from synthetic attacks?". Prompt:
   list mechanisms a schemer could use to distinguish real attacks from
   synthetic ones.
8. **Gate `defense-design`** (written, minChars 100) — before "Preventing
   collusion under coordination assumptions". Prompt: design defenses against
   coordination-signal collusion.
9. **Reveal note** — after the defenses section, restating the post's
   toolkit: input redaction/paraphrase, known-attack insertion, trusted
   monitor flags suspicious signals.

Editorial notes restate the post's own claims only — never new curriculum
claims. Appendices and the inference-cost section stay ungated (supporting
material, not decision points).

## Curriculum copy

Rewrite the closing sentence of `c-mod5`'s `summary` in
`curriculum.data.ts`: the two walkthroughs are "one argued and one measured:
collusion prevention in untrusted monitoring asks whether U can be made to
catch U's attacks without the two instances coordinating; basic legibility
protocols run a full red-team/blue-team control evaluation…" (final wording
at implementation, same sentence shape as today's).

## Verification

- `npx vitest run src/lib/content/content.test.ts` — snippet tripwires,
  permission gating, artifact freshness.
- `npx vitest run src/lib/readings/readings.test.ts` — linked-readings
  registry consistency.
- `npm run typecheck`, `npm run lint`.
- Visual pass in `npm run dev`: walk every gate, check the hidden figures,
  sidenotes, and the sidebar's gate locking (`gateIds`).

## Out of scope

- No changes to `c-paper-legibility-guided`, the section lessons, demos, or
  recall cards.
- No slug/renumbering work (main's PR #13 renamed this module's slug to
  `module-4`; that conflict is handled at the pre-push rebase, not here).
