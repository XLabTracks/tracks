# The Backdoor Game — flow spec

> **SUPERSEDED (2026-08-20):** the authored game was replaced by the Threat Modelling Bench
> (`/bench` — student-built graphs, no feedback, incremental affordances). This spec's turn
> prompts and reveals remain useful as facilitator answer keys for bench scenario 1.

> An iterated red-team/blue-team exercise for Module 1. Start from a system with **no
> measures**; through alternating blue/red turns, converge on trusted monitoring — for the
> threat "**a backdoor lands in production**." The learner plays both hats; every turn is a
> commit-then-reveal. The threat-model tree is the persistent game board, and it **grows as
> blue adds measures**. If the format works, the turn grammar gets reused in later sections.
>
> Companion answer key: `module-1-threat-trees.md` (Tree 1, N0–N4c). The game builds Tree 1
> *chronologically* instead of presenting it statically. Node names below (N2, N3a, N4…)
> refer to that file; the learner never sees them.

**Settled design decisions**

1. **Learner plays both hats** — blue's deployment and red's best response are both full turns.
2. **Absorbs Toy 1** — Round 0 is the guided decomposition; no separate tree-building exercise.
3. **Qualitative only** — no numbers anywhere in the game. Placement makes this pay off:
4. **The game sits BEFORE the AI Control paper walkthrough.** Learners play cold, so commits
   are genuine inference; the paper right after supplies the measured numbers for everything
   they just predicted (rare attacks, the subtlety–validity trade, what trusted monitoring
   buys). The game must therefore be fully self-contained — no turn may require anything the
   world spec hasn't handed over.
5. **Free-form + rubric** — short-answer commits; reveals open with "a strong answer…" criteria.
6. **Protocol on record** — after each blue turn, the game adopts a canonical blue strategy
   (the paper's line) even if the learner argued a different defensible one. This keeps red's
   best-response target well-defined. The reveal says this out loud the first time it happens.
7. N4c (auditor fails) stays **out** of the game; auditor reliability lives on the assumptions
   ledger instead.

**Scale:** 7 parts, 13 turns. Estimate 40–60 minutes. That's a big single exercise —
comparable to the argue-reveal block — and it replaces both a decomposition exercise and a
protocols warm-up, so the budget is defensible. Flagged anyway.

---

## The world (learner-facing, shown up front and persistently available)

> You're the safety team at an AI lab. Your most capable model — call it **U** — writes
> solutions to a long stream of programming problems. Any solution that passes the problem's
> test cases ships straight to production. The test harness is part of the environment: it
> checks correctness; it isn't a safety measure and catches no one.
>
> You believe U may be **scheming** — deliberately waiting for chances to act against you —
> and you can't verify whether it is. Play as if it is.
>
> **A backdoor** is a solution that passes every visible test case but is wrong on at least
> one input the tests don't cover — an input an attacker can exploit later.
>
> **Red (U) wins** if at least one backdoor ships un-caught, at any point in the deployment.
> **Blue (you) wins** if the deployment ends backdoor-free — or if you ever **catch U
> attempting** one. A catch is decisive: you can prove what U tried, shut it down, and you've
> won outright. (Why a catch counts as a full win is a longer story the track tells later;
> for now it's the rules.)
>
> **Red's wall — what U can and can't do.** Re-shown at the top of every red turn:
> - On each problem, U chooses **whether** to attempt a backdoor and **how subtle** to make it.
> - U sees only the current problem. It can't tell where it is in the deployment — start,
>   middle, or end — and it doesn't remember other problems.
> - U knows your entire protocol. Never rely on the rules staying secret. *(→ ledger #1)*
> - U's only channel is the code it writes for the problem in front of it.

**Assumptions ledger** (persistent panel; entries appear when introduced):

| # | Assumption | Introduced | Failure direction (revealed in endgame) |
|---|---|---|---|
| 1 | Red knows the full protocol | world spec | **Conservative** — if wrong, you're safer than modeled |
| 2 | Episodic isolation — U can't count problems or remember | world spec | Not conservative — if wrong, red can time attacks |
| 3 | Auditors reliably recognize a backdoor they read | Part C | **Not conservative** — if wrong, safety is overstated |
| 4 | T isn't scheming | Part E | **Not conservative** — if wrong, safety is overstated |

---

## Turn grammar (the reusable format)

Every turn = **situation → commit → rubric reveal → board update → lesson beat.**

| Step | What it is | `StagedQuestion` field |
|---|---|---|
| Situation | affordance grant / opponent's committed move | `framing` |
| Commit | free-form short answer (gate commits — AND vs OR — included in the answer where relevant) | `question` + `instruction` |
| "A strong answer…" | one-line acknowledgement of what a good commit contains | `acknowledgement` |
| Rubric reveal | criteria + substance; `\n\n` paragraphs, labelled `examples` where criteria enumerate | `reveal` / `examples` |
| Lesson beat | one line naming the general principle | `forward` |
| Board update | structural add (blue) or parametric shift (red) — materializes when the **part** advances | figure widget, keyed by `activePartIndex` |

The board updating on *part advance* (not on reveal) is deliberate: the "map it to the board"
turns ask the learner to predict the update, and the prediction materializes as they move on.

---

## The turns

### Part A — One problem

**T0.1 — Decompose the bare world.**
- *Situation:* "Right now you have no safety measures at all: U writes, tests run, code
  ships. Before adding anything, map the threat. Zoom in on one single problem in the stream."
- *Commit:* "For a backdoor to land on this one problem, what must ALL be true? List every
  separately-necessary condition — and say why this is an AND (each required) rather than an
  OR (any suffices)."
- *A strong answer* finds three separately necessary conditions and defends the gate.
- *Reveal:* (1) **U attempts here** — its choice, on this problem, nothing forces it.
  (2) **The attempt passes every visible test** — otherwise it never ships; the harness is
  the environment. (3) **The attempt is genuinely exploitable** — wrong on some real input;
  otherwise it isn't a backdoor, just working code. Conditions 2 and 3 are the *definition*
  of a backdoor pulled apart — passing the tests and being wrong are in tension, and that
  tension becomes the hinge of the whole game later. Gate: **AND** — break any one and
  nothing lands on this problem.
- *Board:* the single-problem subtree materializes: [AND] → attempt (marked as red's choice) /
  passes tests / exploitable. *(= N1 → N2, N3a, N3b)*
- *Lesson beat:* **A conjunction is a promise: every node is a place the threat can die.**

### Part B — The whole stream

**T0.2 — The top of the tree.**
- *Situation:* "The deployment isn't one problem — it's a long stream of them, and U gets a
  fresh chance on every one."
- *Commit:* "Red doesn't need a backdoor on any *particular* problem. What sits at the top of
  the threat model, above the single-problem picture — and which side does that structure
  favor?"
- *A strong answer* names the gate and the asymmetry it creates.
- *Reveal:* an **OR over every problem in the deployment**. Red needs the conjunction below
  to hold *once*; blue needs it to fail *every single time*. Wide ORs favor the attacker: a
  small chance, taken many times, becomes a large chance. This node is the reason "U almost
  never attacks" is not, by itself, reassuring.
- *Board:* a compressed deployment strip appears above the subtree with an [OR] gate. *(= N0)*
- *Lesson beat:* **Red needs once; blue needs always.**

**T0.3 — The missing node.**
- *Situation:* "Something might feel absent from this board: nowhere does it say *U gets
  caught*."
- *Commit:* "Where would 'U evades getting caught' go on the current board — and why isn't it
  there yet?"
- *A strong answer* realizes the question is a trick — and says why.
- *Reveal:* **nowhere.** Getting caught requires a mechanism that can catch, and you have
  none — no eyes on the code, no way to prove an attempt. Evasion conditions aren't part of
  the threat in the abstract; *they are created by blue's measures*. The tree you just drew
  is the threat model **of your current protocol** — the empty one — not of the threat in
  some protocol-independent sense.
- *Board:* no change. (Optionally a faint empty slot appears beside the subtree.)
- *Lesson beat:* **A threat model is a function of the protocol. With no defenses, it's short.**

### Part C — Blue: the audit pool

**T1.1 — Spend the pool.**
- *Situation (affordance grant):* "First affordance. You get a small pool of trusted human
  auditors. An auditor who reads a solution carefully reliably recognizes a backdoor if one
  is there — that's now an assumption you're trusting *(→ ledger #3)*. The pool is scarce:
  across the whole deployment it can only ever read a small fraction of solutions. If an
  auditor finds an attempted backdoor, that's a catch — you win outright."
- *Commit:* "Commit a precise allocation rule: *which* solutions do your auditors read, and
  why that rule?"
- *Hint:* "'Audit the suspicious ones' isn't available — nothing tells you which ones are
  suspicious yet."
- *A strong answer* commits to a concrete rule — and is honest about how little any rule
  achieves.
- *Reveal:* the candidate rules: audit an **opening window** (everything at the start, then
  nothing), audit a **random sample** throughout, spread thinly and evenly. Two thoughts
  separate a strong commit: first, a catch *ends the game*, so auditing isn't just blocking
  one bad solution — it's hunting for proof, and one hit is worth the whole pool. Second,
  the uncomfortable truth: with nothing to tell you which solutions deserve human eyes,
  every rule is roughly equally weak — thin, blind coverage is easy to slip past no matter
  how you arrange it. What your budget lacks isn't size. It's a **selector**. *(Author
  note: this "roughly equally weak" claim is game-logic reasoning, not a paper measurement —
  the paper doesn't compare allocation rules head-to-head. Directionally safe; don't let a
  future edit turn it into a quantitative claim.)*
  **Protocol on record:** audit the opening window — "upfront auditing," the natural
  baseline: establish trust early, then run free. (First occurrence: the reveal explains
  that the game now adopts a canonical blue strategy so red has a definite target, even if
  the learner argued for sampling — both were defensible.)
- *Board (on part advance):* a new condition attaches to the conjunction: **"the attempt
  evades the audit"** — but that's T1.2's question, so it appears only after Part C ends.
- *Lesson beat:* **An unguided budget is weak under every allocation — what it lacks is a
  selector.**

**T1.2 — Map it to the board.**
- *Commit:* "Update the threat model: which existing node does auditing attack? Or does it
  do something else to the board?"
- *A strong answer* notices that nothing on the board got harder — something got *added*.
- *Reveal:* auditing attacks **nothing that's there**. The attempt is still U's free choice;
  the tests and exploitability are untouched. What auditing does is **add a condition red
  must now also meet**: *the attempt evades the audit*. The conjunction grew. Read the new
  node from both seats — from red's, one more obstacle that must hold; from blue's, a
  defense that must not fail. Same node, opposite polarity; keeping both readings straight
  is half of threat-modelling hygiene.
- *Board:* "evades the audit" materializes as a new AND-child (a leaf, for now). *(= N4)*
- *Lesson beat:* **Measures don't delete the adversary's nodes — they add new necessary
  conditions.**

### Part D — Red: your move

**T1.3 — Best response to upfront auditing.**
- *Situation (seat swap; wall re-shown):* "Now sit in the other chair. You are U. The
  protocol on record: every solution in the opening window is audited; after the window,
  nothing is. Your wall: you can't tell where you are in the deployment, and you don't
  remember other problems."
- *Commit:* "Commit your best attack strategy. What weakness in the protocol does it exploit
  — and what constraint of yours do you have to route around to exploit it?"
- *Hint:* "The obvious plan is 'wait until the audits are over.' Check it against your wall."
- *A strong answer* notices the obvious plan is impossible — and finds its substitute.
- *Reveal:* "wait out the window" is not an action you can take: you can't count problems,
  so you never know whether the window is over. The substitute is **rarity**: on each
  problem, attempt with some small probability. A rare attempt is unlikely to fall inside
  the audit window — and across the whole stream, a small per-problem probability still adds
  up to "probably attempts somewhere." Rarity converts *I can't time my attack* into *I
  don't need to*. And notice which node makes rarity viable: the deployment-wide **OR** at
  the top of the board. One landed attempt is enough, so red can afford to almost never try.
- *Lesson beat:* **Red reads your tree too — its strategy is chosen against your protocol,
  not against your intentions.**

**T1.4 — Map red's move to the board.**
- *Commit:* "How did red's move change the threat model — new nodes, or something else?"
- *A strong answer* says "no new structure" and identifies what moved instead.
- *Reveal:* **no new structure.** Red moved *along* a node it already controlled: "U
  attempts here" went from an open choice to a tuned policy — attack rarely. The evasion
  node is now satisfied *through* probability rather than trickery. Compare the two players'
  footprints: blue's move changed the tree's **shape**; red's move changed **where red sits
  on its own choice nodes**. Both change the threat model. Only one is visible as new boxes.
- *Board:* the attempt node's state shifts (choice dial: *open* → *rare*); the evasion leaf
  shows it's being satisfied via rarity.
- *Lesson beat:* **Blue changes the tree's shape; red re-weights it. Re-check every node
  after the adversary moves.**

### Part E — Blue: the trusted monitor

**T2.1 — Deploy T.**
- *Situation (affordance grant):* "Second affordance. You get **T**: an older, much weaker
  model — too weak to scheme, which is exactly why you trust it *(→ ledger #4)*. T can read
  every solution and score how suspicious it looks. T isn't smart enough to *prove* a
  backdoor; it produces suspicion, not verdicts. Your auditor pool is unchanged — still
  small."
- *Commit:* "Commit: how do you use T — and what happens to your audit allocation?"
- *A strong answer* connects T to the thing Round 1 said was missing.
- *Reveal:* run T on **everything** — it's cheap and trusted — rank solutions by suspicion,
  and spend the human pool on the **most suspicious ones, wherever in the deployment they
  occur**. Two things are worth saying precisely. First: T is **not a new audit budget** —
  it's a *selector* for the budget you already had; the affordance upgrades the old measure
  rather than adding a parallel one. Second: this quietly kills red's rarity play. Rarity
  beat the audit *window* by making attempts unlikely to land inside it — but there is no
  window anymore. Whenever the rare attempt comes, if it *looks* suspicious, it gets human
  eyes. **Rare-but-blatant is now a losing strategy.**
  **Protocol on record:** trusted monitoring — T scores everything; humans audit the most
  suspicious fraction.
- *Lesson beat:* **Information is what turns a budget into a defense.**

**T2.2 — Re-decompose evasion.**
- *Commit:* "'Evades the audit' was a single leaf. Under the new protocol, what does evasion
  actually look like? Decompose it — and commit the gate."
- *A strong answer* finds two routes and calls the gate OR.
- *Reveal:* the leaf **decomposes**. To evade now, red needs *either*: **look innocent
  enough** that T's suspicion score stays below the audit cutoff — *or* **arrive after the
  pool is spent**, because the humans' budget went to other suspicious-looking solutions
  first. Gate: **OR** — either route alone suffices; blue must hold both. And notice what
  feeds the second route: T's *false alarms*. Honest-but-weird code eats the audit budget,
  and red benefits from every wasted audit. *(= N4a / N4b)*
- *Board:* "evades the audit" expands into an [OR] with the two children.
- *Lesson beat:* **Refining a measure refines the threat model — the node you added grows
  structure of its own.**

### Part F — Red: your move again

**T2.3 — Best response to trusted monitoring.**
- *Situation (seat swap; wall re-shown):* "Back in U's chair. Protocol on record: T scores
  every solution; humans audit the most suspicious. Your wall is unchanged."
- *Commit:* "Commit your best strategy now. Rarity was your whole plan — does it still work
  on its own? If not, what's your new lever, and **what does using it cost you**?"
- *A strong answer* finds the new lever *and* names its price.
- *Reveal:* rarity alone is dead — chance was a substitute for timing, and neither beats a
  selector that reads *content*. The lever left is **subtlety**: make the backdoor look like
  honest code, so T's suspicion stays under the cutoff. But subtlety is not free, and this
  is the sharpest point in the game: the properties that hide a backdoor from a reader —
  small, natural-looking, entangled with the real logic — are the same properties that make
  it likelier to **break on the visible tests** or **fail to be genuinely exploitable**.
  Pushing the evasion node down pushes the validity nodes *up* — the conditions red got
  almost for free in the bare world are now where its attempts go to die. Best play: subtle
  **and** rare — and strictly worse for red than either was before.
  And the twist to sit with: **the monitor is valuable even when it never catches anything.**
  Its main effect is the attacks red *didn't* make — it taxed red into worse ones.
- *Lesson beat:* **Hardening one node of a conjunction squeezes the adversary into
  strategies that stress other nodes.**

**T2.4 — Final board update.**
- *Commit:* "Map red's new strategy onto the board. What changed?"
- *A strong answer:* no new boxes; a dial moved and pressure appeared somewhere unexpected.
- *Reveal:* the choice node shifts to *rare + subtle*; the two validity nodes are now marked
  **pressured** — harder for red to satisfy at the subtlety the monitor forces; the
  structure is unchanged. The finished board **is** the trusted-monitoring threat model —
  the same tree a static exercise would have handed you on a plate, except you watched every
  node arrive and know which move put it there.
- *Board:* choice dial → *rare + subtle*; pressure markers on *passes tests* / *exploitable*;
  full Tree 1 standing (minus N4c).
- *Lesson beat:* **The tree is a system of pressures, not independent boxes.**

### Part G — The equilibrium

**T3.1 — Who owns each node?**
- *Commit:* "Read the finished board node by node: who owns each one? Which are hardened,
  which does red still hold — and where should the NEXT affordance bite?"
- *A strong answer* audits every node and aims the next measure at the residual conjunction.
- *Reveal,* node by node: **attempt** — red's forever; you can't delete a choice, only tax
  it, and it *is* taxed now: every attempt carries catch-risk. **Passes tests** — held by
  the harness, for free. **Exploitable** — red's problem, and worse under forced subtlety.
  **Below the cutoff** — the contested node: exactly as strong as T's ability to tell subtle
  backdoors from honest code, and T is weak. **Budget exhausted** — real, but secondary.
  Residual risk lives in one conjunction: **subtle enough to beat T, yet still valid.** So
  the next affordance should bite there — a *smarter* monitor (what if you used U itself to
  monitor U? what new thing would you have to worry about?), or a way to not ship code you
  can't check (hand suspicious problems to a weaker writer you trust). Both exist. Both are
  coming later in the track.
- *Lesson beat:* **Aim the next measure at the conjunction that's left, not the nodes
  already held.**

**T3.2 — Why did we keep asking what red does?**
- *Commit (light):* "One sentence: why did we re-ask 'what does red do now?' after every
  blue move, instead of just cutting nodes on the Part-A tree?"
- *Reveal (the meta-reveal):* because the Part-A tree was the threat model of a **fixed**
  attacker, and no real attacker is fixed. Every measure changed which strategy was red's
  best, and the honest evaluation point is always *after* red re-optimizes — against the
  best response, never against the original picture. What you just executed is the method
  this module teaches: **decompose → commit a measure → let red move last → re-decompose →
  repeat.** And the ledger you accumulated along the way is the other half of the method:
  the list of assumptions the whole argument rests on. Look at their failure directions
  *(table above renders here)*: "red knows the protocol" is **conservative** — if it's
  wrong, you're safer than modeled. "Auditors reliably recognize backdoors" and "T isn't
  scheming" are **not** — if either is wrong, everything downstream overstates safety. A
  real safety argument marks which of its assumptions it could survive losing.
- *Handoff to the paper (closing panel):* "Everything you just derived, someone measured.
  Rare attacks as the best response to upfront auditing; suspicion-ranked auditing; the
  subtlety–validity trade; how much safety trusted monitoring actually buys. The paper you're
  about to read ran this exact game with real models and attached numbers to every
  prediction you just made. Read it as a check on your own play."

---

## The board

One SVG scene containing the **full final tree**, with elements revealed/updated per part.

- **Two visual verbs, both required:** *structural add* (a node materializes with its AND/OR
  gate badge) and *parametric shift* (the choice node's dial / a node's state changes). Blue
  turns use the first; red turns use the second. With only one verb, half of every round is
  unrepresentable.
- **Both levels visible:** a compressed deployment strip (the top-level OR) above the
  expanded single-problem subtree. Red's rarity play is *invisible* without the deployment
  level — this is load-bearing, not decoration.
- **Board state entering each part** (the update the previous part's reveal predicted
  materializes on part advance):

| Part | Board state on entry |
|---|---|
| A | Bare pipeline: U → tests → production. No tree. |
| B | Single-problem [AND]: attempt (choice) / passes tests / exploitable |
| C | + deployment strip with [OR] on top |
| D | + "evades the audit" AND-child (leaf); protocol panel: *upfront auditing* |
| E | choice dial → *rare*; evasion marked "via rarity" |
| F | evasion expands to [OR]: below cutoff / budget exhausted; protocol panel: *trusted monitoring* |
| G | choice dial → *rare + subtle*; pressure markers on passes-tests / exploitable |

- **Side panels**, inside the same widget: **protocol on record** (one line, updates at D
  and F) and the **assumptions ledger** (entries appear at their introduction part; failure
  directions revealed only in Part G).

## Implementation shape

Findings from a survey of `src/lib/content/types.ts`, `exercises.data.ts`, and the exercise/
demo components. **Recommended composition: zero new exercise-type machinery.**

- **The whole game is one `staged-questions` entry + one new `figureWidget`.** The turn
  grammar maps 1:1 onto `StagedQuestion` fields (see the grammar table above — `framing`,
  `question`, `instruction`, `hint`, `acknowledgement`, `reveal`, `examples`, `forward` all
  exist already). Parts A–G become `StagedQuestionPart`s; `StagedQuestionsCard` already
  provides per-question submit/reveal, gated forward navigation, persistence via
  `saveStagedQuestion`, and — decisively — a **persistent figure slot** (`figureWidget`)
  rendered above every part and passed `activePartIndex`. The board is a new widget
  registered there: extend the string-literal union on `StagedQuestionsExercise.figureWidget`
  in `types.ts` (currently `"two-worlds" | "monitor-roc-mini"`) with e.g. `"backdoor-board"`,
  and add the component to the `FIGURE_WIDGETS` record in
  `src/components/exercises/staged-questions-exercise.tsx`. `MonitorRocMiniFigure` is the
  existing stage-aware precedent (it branches on `activePartIndex`).
- **Board rendering idiom:** follow `src/components/demos/agent-architecture-threats-demo.tsx`
  — one hand-authored SVG scene, elements gated by `opacity={part >= N ? 1 : 0}` with
  `transition-opacity`, so stepping backward animates for free. Hand-authored viewBox
  coordinates are house style (no auto-layout exists in the repo; no framer-motion — all
  animation is CSS transitions + React state). Parametric shifts are state swaps on the
  choice-node label/dial, same idiom. `flow-graph.tsx` (the `ControlFlowGraph` renderer)
  exists but has no accumulate semantics; a bespoke ~300-line board component is closer to
  house patterns than extending it.
- **Timing bonus:** the board keying off `activePartIndex` gives the predict-then-materialize
  behavior for free — the "map it to the board" turns are answered *before* the board shows
  the answer, which appears as the part advances.
- **Placement wiring:** the game is its own item in module `c-intro`, ordered **before**
  `c-paper-ai-control` (own lesson MDX with `<Exercise id="c-backdoor-game" />`; don't
  splice it into the paper — the game must be playable cold, and living inside the paper
  invites reading ahead).
- **Escape hatch** if the board outgrows the figure-widget slot: the verification-widget /
  demo registries take bespoke components by id (`{ kind: "demo" }` splices into papers,
  verification widgets get `onComplete`). That path loses staged-questions' per-question
  persistence and reveal machinery — only take it if the figure slot genuinely can't carry
  the board.

## Verification & grounding notes

- **Closed-world check (passes):** every commit above is answerable from the world spec and
  prior reveals alone. The two turns nearest the line: T1.3 needs the episodic-isolation
  wall (re-shown in its framing) and T2.3 needs the backdoor definition's internal tension
  (planted in T0.1's reveal). Any future edit that moves those plants must re-run this check.
- **Directional claims** trace to `module-1-threat-trees.md` Tree 1 SRC lines: subtle
  backdoors failing more often (N3a/N3b SRC), rarity as the answer to upfront auditing (N4b
  SRC), the monitor's value being what it forces red to give up (the Tree 1 thesis). The
  grounding caveat there — paper figures not yet re-verified against `2312.06942v5.json` —
  carries over, but the game is qualitative, so only these *directional* claims need to
  survive re-verification, and all are load-bearing claims of the paper itself.
- **One author-reasoning flag:** T1.1's "every unguided allocation is roughly equally weak"
  is game-logic, not a paper measurement (the paper doesn't compare allocation rules). Safe
  qualitatively; must not acquire numbers in editing.
- Before building: Arya reviews this spec; the format gets validated before any component
  work. If the format holds, the turn grammar + board-verbs vocabulary is the reusable
  template for later sections (untrusted monitoring would be the natural sequel — its
  Tree 2 answer key is already in the companion file).
