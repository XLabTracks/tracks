# design-sync notes — Tracks

- This is an app repo, not a component package: the DS surface is `src/components/ui` (27 shadcn/ui components) + `src/app/globals.css` tokens. The bundle entry is the hand-authored `.design-sync/ds-entry.ts` (cfg.entry) — add a line there when a new ui component is added, plus a `componentSrcMap` pin, a `docsMap` category stub, and (that's it) — the rest is derived.
- There is no static component CSS: the kit styles itself entirely via Tailwind v4 utilities. `cfg.buildCmd` (`node .design-sync/build-css.mjs`) compiles `.design-sync/.cache/ds.css` from globals.css (all three themes: `:root` light, `.dark`, `.contrast`) with `@source` scans of `src/components/ui` **and `.design-sync/previews`** — so the CSS must be recompiled whenever a preview adds a new utility class. `preview-rebuild.mjs` does NOT do this; preview authors must run build-css + copy `ds.css` over `ds-bundle/_ds_bundle.css` before capturing.
- Font wiring: the app injects `--font-sans`/`--font-mono` via next/font at runtime, so build-css.mjs appends literal definitions (`"InterVariable"` / `"JetBrains Mono"`). InterVariable @font-face ships via cfg.extraFonts (`.design-sync/fonts-inter.css` → repo woff2s in src/app/fonts). JetBrains Mono has no local file — it loads from a Google Fonts remote `@import` (validate prints `[FONT_REMOTE]`, expected).
- The KaTeX import in globals.css is stripped by build-css.mjs (app-only; would drag katex fonts into the bundle).
- Playwright: repo does not depend on playwright; `.ds-sync` has playwright@1.61.0 pinned to the machine's cached chromium-1228. On a different machine, re-derive the version from `ls ~/Library/Caches/ms-playwright` (or ~/.cache/ms-playwright) per the skill's §4.1 recipe.
- `docsMap` stubs (.design-sync/docs/*.md, frontmatter `category:` only) exist ONLY to set the picker group; empty body keeps the synthesized Props/Examples in .prompt.md. Groups: actions/forms/overlays/layout/feedback/display.
- Overlay components (Dialog, Sheet, DropdownMenu, Popover, Select, Tooltip, Toaster) have cfg.overrides cardMode "single" with primaryStory "Open" (Toaster: "Toasts") — previews for them must export those names.
- Preview copy is sample UI text in the platform's voice (lessons/modules/review). Per the repo's no-fake-content rule, previews must never invent curriculum claims (definitions, technical assertions) — UI chrome copy only.
- `xlab-tracks-design-system/` at repo root is an EXPORT FROM a claude.ai/design mockup project ("XLab Tracks — Design System", stone/ember palette) — it is not this sync's source and not this sync's target (user chose a fresh project 2026-08-12).

## Preview-authoring learnings (wave 1, 2026-08-12)
- Editing `cfg.overrides` invalidates the `.stories-map.json` config-slice stamps: scoped `preview-rebuild.mjs` runs refuse with `[CONFIG_STALE]` until an orchestrator `package-build.mjs` re-stamp. Sequence config edits BEFORE dispatching preview waves.
- cardMode "single" components render only the primary story on their card; keep exactly one canonical export gradeable (extra exports still feed .prompt.md Examples but are not captured).
- `--ring` is #dc2626 red in light theme by design (tertiary accent) — red-outlined Slider thumbs / focus rings in captures are token-true, not error states. Same for Progress's `bg-destructive` red indicator.
- Radix form primitives render states statically via defaultChecked/defaultValue/aria-invalid/disabled; Slider needs an explicit width (or height when vertical) wrapper.
- Label styles `peer-disabled:` — put the control before the label in DOM to demo the faded disabled label.
- ScrollArea: pass `type="always"` or the hover-revealed scrollbar is invisible in headless captures.
- Avatar: inline `data:image/svg+xml` URIs work through Radix AvatarImage in headless capture (no network); `%23` for `#`.
- ToggleGroup `spacing={0}` + `variant="outline"` = segmented-control look. Toggle pressed state is a subtle muted fill — pair pressed/unpressed in one cell for legibility.
- Toaster capture: fire toasts in a mount useEffect with `duration: Infinity` + `expand` so the screenshot can't miss them, positioned `top-left` (the single-card capture clips the card viewport; page-fixed bottom-right toasts fall outside it).
- sonner singleton: `toast()` must be imported from `"tracks"` (the bundle re-exports it via ds-entry.ts), never from `"sonner"` directly — a second bundled sonner copy has its own store and the bundle's Toaster never sees its toasts. Same trap applies to any design built with the kit; documented in conventions.md.

## Known render warns
- (none recorded yet)

## Re-sync risks
- The `@source inline(...)` utility safelist in build-css.mjs IS the design agent's documented styling vocabulary — conventions.md's family table must stay in sync with it when either changes (validate by grepping the compiled ds.css, as the base skill's conventions step requires).
- build-css.mjs re-emits the `--radius-*` scale + `--shadow-soft*` aliases onto `:root` (extracted from the globals.css text) because `@theme inline` never emits them as vars — if globals.css restructures its radius block, check the extraction regex still matches.
- `ds.css` is a build artifact of globals.css + preview contents; a globals.css theme change silently changes every card — rebuild via buildCmd is mandatory before any capture-based comparison.
- JetBrains Mono loads from Google Fonts at capture time; offline capture would fall back silently (mono text renders in system mono).
- The chromium/playwright pin above is machine-local state, not committed.
