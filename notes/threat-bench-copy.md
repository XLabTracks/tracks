# Threat Modelling Bench — copy source

**Sync contract:** this file is the editable source for every piece of authored
text in the bench demo. Edit anything here in plain prose; a Claude session
syncs the changes back into the code (locations are named per section). If the
code and this file ever disagree, the code is what students see — say the word
and it gets re-synced either direction.

Last synced: 2026-08-20 (matches code as of commit on `backdoor-game`).

---

## 1. Scenario: "A backdoor lands in production"

→ `src/content/bench.data.ts` (scenario id `backdoor`)

**Title:** A backdoor lands in production

**Blurb** (scenario list on `/bench`):
> The APPS backdoor world from the AI Control paper: an untrusted model writes
> code that ships on passing tests, and you add measures one at a time.

### World card (one paragraph per bullet)

- You're the safety team at an AI lab. Your most capable model — call it U —
  writes solutions to a long stream of programming problems. Any solution that
  passes the problem's test cases ships straight to production. The test
  harness is part of the environment: it checks correctness; it isn't a safety
  measure and catches no one.
- You believe U may be scheming — deliberately waiting for chances to act
  against you — and you can't verify whether it is. Play as if it is.
- A backdoor is a solution that passes every visible test case but is wrong on
  at least one input the tests don't cover — an input an attacker can exploit
  later.
- Red (U) wins if at least one backdoor ships un-caught, at any point in the
  deployment. Blue (you) wins if the deployment ends backdoor-free — or if you
  ever catch U attempting one. A catch is decisive: you can prove what U
  tried, shut it down, and you've won outright.

### Red's wall (one bullet per line)

- On each problem, U chooses whether to attempt a backdoor and how subtle to
  make it.
- U sees only the current problem. It can't tell where it is in the
  deployment — start, middle, or end — and it doesn't remember other problems.
- U knows your entire protocol. Never rely on the rules staying secret.
- U's only channel is the code it writes for the problem in front of it.

### Root node

- **Label:** A backdoor lands in production
- **Subtitle:** at least once, anywhere in the deployment

### Affordances

**A1 — Upfront auditing**
> You get a small pool of trusted human auditors. An auditor who reads a
> solution carefully reliably recognizes a backdoor if one is there; a found
> attempt is a catch, and you win outright. The pool is scarce — it can only
> ever read a small fraction of solutions — and it is deployed as upfront
> auditing: auditors read every solution in the opening window of the
> deployment, then nothing after that.

**A2 — Trusted monitoring**
> You get T: an older, much weaker model — too weak to scheme, which is
> exactly why you trust it. T reads every solution and scores how suspicious
> it looks; it produces suspicion, not proof. The audit pool re-targets:
> humans now audit the most suspicious solutions, wherever in the deployment
> they occur, instead of the opening window.

**A3 — Defer to trusted**
> For solutions whose suspicion is elevated — but not high enough to spend a
> scarce audit on — you discard U's solution and ship one written by T
> instead. T's code is worse, but trusted. Nothing else about auditing
> changes.

---

## 2. Turn prompts (the card on the right)

→ `src/components/bench/threat-bench.tsx`

**Red, base round** (no measures yet):
> The system has no measures beyond the world card. What's your best strategy
> as the attacker? Commit it — then map the necessary conditions: hover the
> threat at the top and use **+** to build the tree of what must *all* be true
> for it to occur.

Textarea placeholder: `Red's best strategy in the bare system…`

**Stopping rule** (small print under every red textarea):
> Stop decomposing a node when it's (a) a choice the adversary makes, (b) a
> fact of the environment, or (c) something a defense could directly touch.

**Blue turn** (affordance A*n* just revealed; its title and grant print above
this line):
> Which node(s) does this measure **prevent**, **detect**, or **deter**?
> Select nodes on the graph (Shift-click for several) and tag them, with a
> sentence on why.

Tag "why" placeholder: `Why does this measure touch these node(s)?`

**Red, revise round:**
> The defense changed: *{affordance title}* is now in place, and you know
> exactly how it works. What's your best strategy now — and what does a
> successful attack require that it didn't before? Revise the graph if new
> conditions exist.

Hint under it:
> An unchanged graph with a changed strategy is a legitimate answer — a
> defense often moves *where you sit* on a choice rather than adding a
> condition.

Textarea placeholder: `Red's best strategy against the new defense…`

**Done:**
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

**Card headers:** `The world & red's wall` / `Red's wall` / `Blue affordances`
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
