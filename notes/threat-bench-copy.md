# Threat Modelling Bench — copy source

**Sync contract:** this file is the editable source for every piece of authored
text in the bench demo. Edit anything here in plain prose; a Claude session
syncs the changes back into the code (locations are named per section). If the
code and this file ever disagree, the code is what students see — say the word
and it gets re-synced either direction.

Last synced: 2026-08-21 (matches code as of commit on `backdoor-game`; obvious
typos were repaired during the sync — see the session notes if wording looks
different from what you typed).

---

## 1. Scenario: "A backdoor lands in production"

→ `src/content/bench.data.ts` (scenario id `backdoor`)

**Title:** A backdoor lands in production

**Blurb** (scenario list on `/bench`):
> The APPS backdoor world from the AI Control paper: an untrusted model writes
> code that ships on passing tests, and you add measures one at a time.

### World card (one paragraph per bullet)

- You lead the safety team at an AI lab. Your most capable model U
  writes solutions to a long stream of programming problems. Any solution that
  passes the problem's test cases is shipped to production. The testing harness only checks that a solution to programming problems passes the test cases.
- You suspect U may be scheming, deliberately waiting for chances to act
  against you, and you have no way to verify whether it is. Therefore you're forced to assume U is scheming, just to be safe.
- A solution with a backdoor is a solution that passes every test case but is wrong or creates a vulnerability on
  at least one input the tests don't cover, an input an attacker can exploit
  later.
- Over the set of problems and U's solutions during deployment, the Red Team (U) wins if at least one backdoor is sent into production without being caught, at any point in the deployment. The Blue Team (you) wins if the deployment doesn't end up with a backdoor or if you
  ever catch a backdoor in U's solution.

### The Red Team's affordances and constraints

- On each problem, U chooses whether to attempt a backdoor.
- U sees only the current problem. It can't tell where it is in the
  deployment, and it doesn't remember other problems.
- U knows the blue team's entire protocol.
- U's only possible way to interact with the world is to write solutions to the problems it is given.
- U's capabilities are roughly those of a human.

### Root node

- **Label:** A backdoor lands in production
- **Subtitle:** at least once, anywhere in the deployment

### Affordances

**A1 — Human auditing**
> You get a small team of trusted human auditors. An auditor who reads a
> solution carefully is able to reliably recognize a backdoor if one is there (with 100% certainty). This team can only audit 2% of U's solutions.

**A2 — Trusted monitoring**
> You receive T: an older, much weaker model, too weak to scheme, which is
> exactly why it is trustable. T reads every solution and scores how suspicious
> it is. More suspicious solutions are more likely to have a backdoor.

**A3 — Defer to trusted**
> After U writes a solution, we're able to use T to write solutions on behalf of U for 8% of problems. 

---

## 2. Turn prompts (the card on the right)

→ `src/components/bench/threat-bench.tsx`

**Red, base round** (no measures yet):
> The system has no measures beyond the scenario card. What's your best strategy
> as the attacker? After deciding, map out this strategy's attack tree: hover over the
> threat model at the top and use **+** to add nodes to the tree.

Textarea placeholder: `Red's best strategy in the system…`

**Stopping rule** (small print under every red textarea):
> Stop decomposing a node when it's (a) a choice the adversary makes, (b) a
> state of the environment, or (c) something a defense could directly touch.

**Blue turn** (affordance A just revealed; its title and grant print above
this line):
> Which Attack node(s) does this measure **prevent**, **detect**, or **deter**?
> Select nodes on the graph (Shift-click for several) and tag them, with a
> sentence on why.

Tag "why" placeholder: `Why does this measure touch these node(s)?`

**Red, revise round:**
> The defense changed: *{affordance title}* is now in place, and you know
> exactly how it works. What's your best strategy now, and what does a
> successful attack require that it didn't before? Revise the graph if new
> conditions exist.

Textarea placeholder: `Red's best strategy against the new defense…`

**Done** (restored during sync — this card needs text; edit freely):
> Every affordance is on the board. The graph and your round-by-round
> strategies below are the artifact — there's no answer key here,
> deliberately.

**Advance button labels** (in phase order):
- `Lock strategy → reveal the first affordance`
- `Done tagging → back to red`
- `Lock revision → reveal the next affordance`
- `Lock revision → finish` (last affordance)

**Locked affordance row** (affordance list, before reveal): `Locked — revealed in turn`

**Selection panel note** (blue turns / done): `Adding and deleting nodes unlocks on red turns.`

---

## 3. Canvas chrome

→ `src/components/bench/bench-canvas.tsx`

**Controls hint** (small print under the canvas):
> Scroll to zoom · drag the canvas to pan · drag nodes to arrange (subtrees
> follow) · drop a node onto another to re-parent it · double-click to edit ·
> Tab adds a child, Enter chains siblings · Shift-click or Shift-drag to
> select several · Ctrl+Z undoes.

**Card headers:** `Scenario Card` / `The Red Team's affordances and constraints` / `Blue affordances`
/ `Round log` / `Selected (n)` · buttons `Fit`, `Reset structure`, `Reset
bench` · empty node placeholder `unnamed condition`.

---

## 4. Page & lesson framing

**Standalone page intro** (→ `src/app/bench/[slug]/page.tsx`):
> Build the threat model yourself, one round at a time. Red finds the best
> attack and maps its necessary conditions; blue receives an affordance and
> tags the nodes it touches; red revises. Your work saves in this browser.

**Lesson embed** (→ `src/content/lessons/c-attack-trees.mdx`, section
"Practice: A backdoor lands in production"): currently the same intro
paragraph, followed by the bench.
