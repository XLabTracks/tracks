# Skill map — build log

The map is cross-module, so its decisions live here rather than in one
module's log. Append, don't rewrite.

## 2026-08-19 — v2: the 31-skill rewrite (course owner's document)

The 27-node graph (a snapshot of the standalone authoring tree at
verification-skill-tree.netlify.app) had drifted out of the course: module 3
had collapsed to the single unit 3.0 (the Cankaya paper), leaving 18 rungs
tagged on units 3.1/3.2 with no lessons; the 4.0→4.1 feasibility move
orphaned four more; 0.2 had been rebuilt around the Plan A/Plan S essays.
The owner supplied a full replacement — dependencies by submodule plus
per-skill descriptions, her wording verbatim — iterated in-session against
the actual lesson bodies. What shipped:

- **31 skills** (was 27): Red team / blue team deleted (its module was
  deleted); Theory of change (0.1.2), Quantitative estimation (module-0
  root: covert-compute margin, Chinchilla statistics, FLOP lines, base
  rates), Policy writing (report constructor → assessment → defended-ranking
  memo → governance artifact), Research (4.1.1, Scher) and Making the case
  (optional, `opt: true` — a capstone option, dashed on the map) added.
- **95 rungs, 61 edges, six roots** (threat modeling, policy options,
  historical parallels, timeliness, theory of change, quantitative
  estimation). Required terminus is Regime design; the optional coda is
  Making the case (`regime → mcase`).
- **Every rung was verified against the unit that teaches it** before
  tagging; rungs whose content no longer exists were cut (securitization and
  CWC managed access at 0.3, timeliness at 2.0, costs at 1.1, taxonomies and
  costs at 4.1, both Khan rungs) or retagged onto what is actually there
  (supply@2.1 → Shavit's untracked-chips decomposition in 2.1.7;
  proxy@2.2 → beneficial ownership; securitization@4.1 → the
  China-views-changing card; evasion@4.1 → the Evasion & Regime Design drill
  bench). The compound `2.1–2.4` rung stays, on its four carriers
  (failure modes, timeliness, decisionmakers, feasibility), on the owner's
  instruction — the timeliness and failure per-bucket texts promise a
  staging the app lessons don't explicitly run yet, knowingly.
- **`desc` became `goals`** — the owner's multi-bullet learner objectives,
  `[indent, text]` pairs — rendered as a list by the map card
  (`map.js`/`map.css`) and the landing sky panel (`landing.js`/
  `landing.css`). **`bloom` is back as a `[start, end]` range**, data only:
  the learner UI still prints no Bloom levels; that standing rule is about
  display, and the ranges ride for authoring. `lo` tags kept (assignments
  carried over; new skills assigned by the session, owner may edit).
- `moduleNames` now match the static site's module chrome (Foundations /
  Policy and actors / Evidence streams / Covert development / Capstone).
- Consumers touched: `map.js` (goals list, optional marker), `map/page.tsx`
  ("Thirty-one skills"), `landing.js` panel, `notebook.js` untouched (fully
  data-driven), `platform.js` untouched. `skills.ts` re-snapshotted;
  `completion-stats.test.ts` re-pinned — with every rung now on a drafted
  unit, a learner who finishes the drafted course masters **31/31** (was
  13 mastered / 13 in progress), and the test's job flipped to reporting
  the honest smaller number if a rung is ever tagged onto an undrafted
  unit again.

Deliberately NOT done here, and owed:

- **The standalone authoring tree still holds the old 27-node graph**
  (Netlify Blobs store rev 24) and so does its playground copy. skills.js's
  header says never to fetch from it; re-seeding it to v2 is its own
  deliberate act and needs the owner's go-ahead (live deploys are
  permission-gated).
- The owner's descriptions carry a few forward-looking clauses the course
  doesn't teach yet, kept knowingly: BWC/CWC in historical parallels (0.3's
  packet is IAEA/Chinchilla/Iraq), cloud shells/resellers (lessons reach
  beneficial ownership), the evasion catalog's "ordered by feasibility"
  (nearest anchor is the 4.1 bench), and Making the case's delivery drills
  (nothing teaches them; the skill is optional). If module 3 ever grows the
  facility simulation its objectives promise, evasion and failure-modes
  ladders are the place to extend.

## 2026-09-13 — one figure: /verification/map draws the home page's web

The two surfaces had diverged: the landing page's "The Skill Map" band had
become the radial skill web (stars numbered by module, arms, beams, the
journal-card panel and the key), while `/verification/map` — the page that
band's "Open the skill map" button leads to — still drew the older banded
grid with bezier edges, and the about page's facts row still said 27
skills. The owner's instruction: the home page is the current version, the
map page and the about page match it.

- The renderer moved out of `landing.js` into `skill-web.js`
  (`VTSkillWeb.mount(opts)`), and its rules out of `landing.css` into
  `skill-web.css`. Both pages load both; neither draws the graph itself.
- What only the map page had rides on the renderer's hooks: `state` (each
  star's halo becomes a progress arc — state on the ring, never the fill;
  the key row prints the fraction and a ✓, the aria-label says it in
  words), `rung` (the ladder's ✓/◐/· glyph and a link to the unit that
  teaches it), `panelExtra` (Builds on / Unlocks / Feeds objectives chips
  and the summary line), `dim` + `setDim` (the objectives row and the
  `?unit=` deep link from platform.js's completion toast fade the stars
  they reject), `pinned` (`?skill=`). `pin(id)` serves the chips.
- The key marks the optional skill with the standing `Optional:` prefix on
  both pages; the panel already did.
- The default panel hint no longer says "Hover … click": the legend's
  on-hover/on-touch pair was already the device-aware copy.
- `map.css` is now the page around the figure plus the panel's additions;
  the banded-grid rules (and the never-used `.tabs`) are gone.
- The about page counts skills from `src/lib/verification/data/skills.ts`,
  the app-side mirror `completion-stats.test.ts` keeps in step with
  `data/skills.js`, instead of a literal that had sat at 27 through the
  v2 rewrite.

## 2026-09-13 — checked against the current curriculum; copy and bullets

The owner asked that the map page carry all 31 skills and dependencies on
the most recent curriculum. Checked, not changed: `skills.js` rev 4 already
has 31 skills, 61 edges, 95 rungs, every rung on a unit `course.js` carries
(the three rung texts that cite a sub-lesson — 0.1.1, 0.1.2, 4.1.1 — name
lessons `curriculum.ts` has), and `verification:course --check` is clean.
Units with no rung: 0.0 Welcome and 4.3 Where to Go From Here, by design.

Changed on the owner's instruction:

- The map page's intro is now verbatim: "Here is the skill map with your
  current progress. Click each skill to read its description, the relevant
  parts of the curriculum, and its dependencies."
- "Skill Map" is capitalized everywhere it is a name: the header nav
  (`chrome.ts`, regenerated), the page title, h1 and breadcrumb, the
  facilitator guide's link, the notebook's last-page heading.
- The panel's learner-goals list uses the course's own bullets — disc, then
  circle one level in — instead of an en-dash pseudo-element. Shared CSS, so
  the home page's panel reads the same.
