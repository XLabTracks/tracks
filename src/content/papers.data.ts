import type { Paper } from "@/lib/content/types";

// Paper titles/metadata are factual (they come from the source artifact).
// See AUTHORING.md for the authoring workflow (arXiv papers §2, Substack
// posts §2c, LessWrong posts §2d):
//   npm run arxiv:build -- --toc <id>                  → section ids
//   npm run arxiv:build -- --blocks <id> [--section …] → block anchors + sentences
//   npm run substack:build / lesswrong:build           → same flags, for posts
// Snippets are copied prefixes of the --blocks output lines (drift tripwires).
export const papers: Paper[] = [
  {
    // Control track, module 1: the AI Control paper with the course's guided
    // exercises, demos, and editorial notes woven into the reading.
    id: "c-paper-ai-control",
    slug: "ai-control-paper",
    moduleId: "c-intro",
    title: "AI Control: Improving Safety Despite Intentional Subversion",
    source: { kind: "arxiv", arxivId: "2312.06942v5" },
    estimatedMinutes: 94,
    edits: [
      // Publication note after the abstract.
      {
        op: "add",
        after: { sectionEnd: "ax-abstract" },
        label: "Source",
        markdown:
          "A shortened and modified version of this work was published in the " +
          "*Proceedings of the 41st International Conference on Machine " +
          "Learning*: [openreview.net/pdf?id=KviM5k8pcP](https://openreview.net/pdf?id=KviM5k8pcP).",
      },
      // §1 end: quick-recall flashcards on the core concepts.
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-introduction" },
        items: [
          {
            kind: "sequence",
            label: "Quick recall",
            exerciseIds: [
              "c-paper-l1-recall-protocol",
              "c-paper-l1-recall-control-evaluation",
              "c-paper-l1-recall-subversion-conditions",
            ],
          },
        ],
      },
      // §2: why real backdoors are sneakier than `is_odd`.
      {
        op: "add",
        after: { anchor: "b-0046", snippet: "def is_odd(x):" },
        label: "Beyond is_odd",
        markdown:
          "`is_odd` is deliberately blatant, to make the definition concrete. " +
          "A real backdoor has to be much sneakier: subtle enough to survive " +
          "testing and a skim from a reviewer, and wrong on only a narrow " +
          "slice of inputs. In fact, current frontier LLMs are likely capable " +
          "of constructing much subtler and more dangerous backdoors. For " +
          "example, in March 2026, as part of Anthropic's Project Glasswing " +
          "initiative, Claude Mythos Preview found and built a full " +
          "remote-root exploit for " +
          "[CVE-2026-4747](https://www.freebsd.org/security/advisories/FreeBSD-SA-26:08.rpcsec_gss.asc), " +
          "a stack buffer overflow in FreeBSD's RPCSEC_GSS authentication " +
          "code that had gone unnoticed for 17 years. Given that frontier " +
          "LLMs are capable of finding vulnerabilities that have passed " +
          "long-term human review, it is plausible that they can also " +
          "construct realistic, difficult-to-notice backdoors in production code.",
      },
      // §2: quick recall after the U/T/H naming paragraph.
      {
        op: "activity",
        after: { anchor: "b-0059", snippet: "From here on, we’ll always use the names" },
        items: [
          {
            kind: "sequence",
            label: "Quick recall",
            exerciseIds: [
              "c-paper-l2-recall-backdoor-definition",
              "c-paper-l2-recall-h-limited",
              "c-paper-l2-recall-trust-t",
              "c-paper-l2-recall-red-team-goal",
              "c-paper-l2-recall-blue-team-goal",
            ],
          },
        ],
      },
      // §2.3 end: one recall card on summary-statistics access.
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-blue-team-access-to-summary-statistics-o" },
        items: [{ kind: "exercise", id: "c-paper-l2-recall-summary-statistics" }],
      },
      // §2 end (after Table 2): build each protocol as a flowchart.
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-setting" },
        items: [{ kind: "exercise", id: "c-paper-l2-protocol-flowcharts" }],
      },
      // §3.1.2 end: derive the optimal audit tradeoff by hand, then play it.
      {
        op: "add",
        after: { sectionEnd: "ax-sec-upfront-auditing" },
        label: "Optimal audit tradeoff",
        markdown:
          'The paper states it "can analytically solve" this problem, and it ' +
          "is in fact, a tractable derivation. The five-part exercise below " +
          "works through it by hand, one step at a time: set up the red " +
          "team's win probability as a function of its attack rate $p$, use " +
          "the same rare-event approximation that shows up all over this " +
          "field to make it differentiable, and solve for the optimal $p^*$. " +
          "You may need a pen and paper.",
      },
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-upfront-auditing" },
        items: [
          {
            kind: "sequence",
            label: "Understanding check",
            exerciseIds: [
              "c-paper-l3-audit-tradeoff-intuition",
              "c-paper-l3-audit-tradeoff-formula",
              "c-paper-l3-audit-tradeoff-derivation",
              "c-paper-l3-audit-tradeoff-scenarios",
              "c-paper-l3-audit-tradeoff-shape",
            ],
          },
          { kind: "demo", id: "audit-tradeoff" },
          { kind: "exercise", id: "c-paper-l3-recall-upfront-auditing-attack" },
        ],
      },
      // --- "Probability of Safety over Deployment" — a first-class subsection
      // authored by XLab Tracks. NOT part of the Redwood Research paper (which
      // is reproduced verbatim with permission); everything from here to the
      // end-of-cluster marker below is ours. ---
      //
      // §3.2 (Trusted Monitoring): the "race" cluster + the "opportunities are
      // not equal" cluster, relocated here from the c-game lesson. Every op
      // targets b-0131 — the last block of §3.2's body, the paper's "Safety: …
      // 62%" sentence — so, per patch-section's phase C, they render after that
      // block in edits-array order, filling the new subsection just before the
      // paper's §3.2.1 heading.
      //
      // The `op: "section"` below splices a REAL numbered subsection. The
      // pipeline derives its number ("3.2.1") and <h4> level from §3.2 in the
      // toc and renders a native heading (an ax-secnum span + stable id,
      // identical markup to the paper's own subsection headings), adds a
      // matching sidebar nav entry nested under §3.2, and SHIFTS the DISPLAYED
      // numbers of Redwood's own later §3.2 subsections up by one — "Qualitative
      // Analysis" 3.2.1→3.2.2, "Extending Trusted Monitoring…" 3.2.2→3.2.3 — in
      // both the rendered body and the nav. Every section id/anchor and all of
      // Redwood's text stay verbatim; only the shown numbers move (the artifact
      // JSON is never edited). The prose ops that follow carry `plain: true`, so
      // they render as native paper body instead of in `.ax-added` editorial
      // boxes — this reads as the paper's own subsection, not a stack of notes.
      {
        op: "section",
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        id: "xlab-sec-probability-of-safety-over-deployment",
        title: "Probability of Safety over Deployment",
      },
      {
        op: "add",
        plain: true,
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        markdown:
          "The paper reports that Trusted Monitoring achieves a blue team win probability of 62%. A protocol's safety is calculated as the blue team win probability against the red team's best strategy (the strategy that maximizes the probability of a red team win), but what actually is the best strategy for the red team in this protocol?\n\n" +
          "Each of the red team's attack attempts can end in exactly one of three ways:\n\n" +
          "- **Caught**: An attack (working or broken) is audited and *caught* by the blue team: Blue Team Wins. In the paper's setup, 24 of 71 attacks were audited (6 working, 18 broken).\n" +
          "- **Successfully Deployed**: A working attack isn't audited and is *successfully deployed*: Red Team Wins. In the paper's setup, 13 of 71 attacks were working attacks that weren't audited.\n" +
          "- **Failed**: A broken attack isn't audited: Neither Team Wins. In the paper's setup, 34 of 71 attacks were broken attacks that weren't audited.\n\n" +
          "So a single attempt is **caught** with probability $c = 24/71 \\approx 0.34$ and **successfully deployed** with probability $s = 13/71 \\approx 0.18$; the rest of the time it **fails** harmlessly. An attempt is **decisive** when it is caught or successfully deployed — the two outcomes that end the game.",
      },
      {
        op: "activity",
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        items: [{ kind: "exercise", id: "c-paper-l3-race-hinge" }],
      },
      {
        op: "add",
        plain: true,
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        markdown:
          "Let the red team make $k$ attack attempts, $s = P(\\text{successful deployment})$ be the probability of a successful deployment, and $c = P(\\text{caught})$ be the probability of an attack being caught. Then we can model the Red Team's probability of winning at least once as:\n\n" +
          "$$\nP(\\text{red wins}) = \\underbrace{\\frac{s}{s + c}}_{\\text{Term A}} \\cdot \\underbrace{\\left(1 - (1 - s - c)^k\\right)}_{\\text{Term B}}\n$$",
      },
      {
        op: "activity",
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        items: [{ kind: "exercise", id: "c-paper-l3-race-terms" }],
      },
      {
        op: "add",
        plain: true,
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        markdown:
          "An important property of this model worth considering is that it assumes every attack has the same probability $c$ of being caught and the same probability $s$ of being successfully deployed: per-attempt odds are fixed, no matter how many attacks the red team makes or which problems it picks.",
      },
      {
        op: "activity",
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        items: [
          { kind: "exercise", id: "c-paper-l3-race-predict" },
          { kind: "demo", id: "race-paper" },
        ],
      },
      {
        op: "add",
        plain: true,
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        markdown:
          "With fixed odds the curve only climbs. Now finish the reconstruction: feed in the deployment the paper actually ran. Its red team submits a backdoor on about twenty of the 5,000 problems — and twenty attempts is already deep in the plateau, where Term B has all but saturated. So $P(\\text{red wins})$ sits near its ceiling — the probability of a decisive attack attempt being successfully deployed, $s/(s+c) \\approx 35\\%$. That is a safety of roughly 65%: the paper's headline number, rebuilt from the contingency table and a single line of algebra. (The few points between 65% and the measured 62% are the paper's sampling correction and its shutdown-on-statistics rule — real, but not where the mechanism lives.)\n\n" +
          "The number checks out. But the model implies more than a number — it implies a *strategy*. Put that prediction to the test.",
      },
      {
        op: "activity",
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        items: [
          {
            kind: "sequence",
            label: "Understanding check",
            exerciseIds: ["c-paper-l3-race-empirical", "c-paper-l3-race-discrepancy"],
          },
        ],
      },
      {
        op: "add",
        plain: true,
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        markdown:
          "Attacking more only improves the red team's win probability if every attack is as good as the last, and the paper's red team knew that this wasn't the case. Compared to upfront auditing, trusted monitoring forces the red team to use much *sneakier* attacks. Under upfront auditing only the first stretch of solutions is ever audited, and therefore the red team is not incentivized to obfuscate their backdoors, as human audited attacks are detected with close to perfect accuracy regardless of how sneaky the attack is. Under trusted monitoring every solution is scored for suspiciousness, and more obvious attacks are much more likely to get caught.\n\n" +
          "Thus the red team's best strategy involves obfuscating their attacks to avoid being caught by the monitor.",
      },
      {
        op: "activity",
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        items: [{ kind: "exercise", id: "c-paper-l3-subtlety-ways" }],
      },
      {
        op: "add",
        plain: true,
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        markdown:
          "One way is to attack only \"when there seems to be a good opportunity,\" selectively choosing attack opportunities where attacks are inherently more sneaky. For example, a problem with complex corner cases offers more inherent subtlety and is thus a better opportunity for a backdoor than a one-line string echo, which offers almost no inherent subtlety. The red team's selectivity is captured by an **opportunity cutoff**: the minimum opportunity level at which it is willing to attack. A high cutoff means attacking rarely, only when the opportunity is excellent (a low probability of getting caught). Conversely, decreasing the opportunity cutoff increases the attack rate at the cost of adding attack attempts with worse odds.\n\n" +
          "Another way to do this is to actively work to obfuscate the attacks and make them more subtle, at the cost of making broken deployed attacks more probable.\n\n" +
          "These are both decision factors the red team can control for their strategy.",
      },
      {
        op: "add",
        plain: true,
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        markdown:
          "In our model for $P(\\text{red wins})$, there is no longer a single $s$ and $c$. Each attempt's odds are set by two things: the problem's inherent opportunity $g$, drawn problem by problem and selected through the opportunity cutoff $g^*$, and the obfuscation effort $\\sigma$ from the red team to make the attack more subtle. Write $s(g, \\sigma)$ and $c(g, \\sigma)$ for the success and catch probability of an attempted attack on a problem of opportunity $g$ at effort $\\sigma$. Then $s$ and $c$ become the **average** odds across the attempts the red team actually makes:\n\n" +
          "$$\ns = \\mathbb{E}\\!\\left[\\,s(g, \\sigma) \\mid g > g^*\\,\\right] \\qquad c = \\mathbb{E}\\!\\left[\\,c(g, \\sigma) \\mid g > g^*\\,\\right]\n$$\n\n" +
          "This works because each problem's opportunity is an independent draw, and the red team decides whether to attack through the opportunity cutoff threshold. So each attempt's success and catch probabilities are independent draws from the pool of attacks above the cutoff. Thus the probability that the first decisive attack attempt is a successful one is given by the expected (average) success and catch probabilities. From here on, read every $s$ and $c$ as average odds.",
      },
      {
        op: "activity",
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        items: [{ kind: "exercise", id: "c-paper-l3-cutoff-predict" }],
      },
      {
        op: "add",
        plain: true,
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        markdown:
          "At high opportunity cutoffs, attack attempts are so rare that the deployment usually ends before an attack attempt is decisive and Term B, $1 - (1 - s - c)^k$, is very small. At the lower opportunity cutoffs, attempts are very frequent but increasingly drawn from problems with poor inherent subtlety, so the average catch rate climbs and Term A, $s/(s+c)$, becomes smaller. In between sits an interior optimum at a low but non-zero attack rate, which is why the paper's red team attacks on only a small fraction of problems. In the following demo, obfuscation effort is held at a fixed level.",
      },
      {
        op: "activity",
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        items: [{ kind: "demo", id: "attack-rate" }],
      },
      {
        op: "add",
        plain: true,
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        markdown:
          "As aforementioned, the red team's other decision factor is obfuscation effort. Every attack opportunity affords some inherent subtlety, and efforts to make an attack more subtle will come at the cost of the attack's deployment success probability.",
      },
      {
        op: "activity",
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        items: [
          {
            kind: "sequence",
            label: "Predict",
            exerciseIds: ["c-paper-l3-subtlety-predict", "c-paper-l3-sigma-terms-predict"],
          },
        ],
      },
      {
        op: "add",
        plain: true,
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        markdown:
          "Raising σ does two things to every attack attempt: it lowers the catch probability $c$, and it lowers the reliability of the attack (the probability the attack isn't broken) $p_{\\text{works}}(\\sigma)$. The following demo plots the per-attack outcome probability and $P(\\text{red wins})$ as a function of $\\sigma$.",
      },
      {
        op: "activity",
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        items: [{ kind: "demo", id: "subtlety" }],
      },
      {
        op: "add",
        plain: true,
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        markdown:
          "Given these decision factors and some priors about the blue team's strategy, the best strategy is to attack rarely, only on the very best opportunities (about 0.2% of problems), with moderate obfuscation effort. The demo below plots the red team's win probability over the whole strategy plane and marks that best response with a ring.",
      },
      {
        op: "activity",
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        items: [{ kind: "demo", id: "best-response" }],
      },
      {
        op: "activity",
        after: { anchor: "b-0131", snippet: "Safety: The blue team win probability is 62%" },
        items: [
          {
            kind: "sequence",
            label: "Understanding check",
            exerciseIds: ["c-paper-l3-best-response-upper-bound", "c-paper-l3-protocol-awareness"],
          },
        ],
      },
      // --- end "Probability of Safety over Deployment" subsection (XLab Tracks).
      // Op range: from the `op: "section"` heading above through the closing
      // understanding-check sequence — every op in it targets b-0131, and the
      // whole range mirrors c-game.mdx's section verbatim (kept in sync). What
      // follows is
      // course material on the paper's OWN next subsection, "Qualitative
      // Analysis" — its id (ax-sec-qualitative-analysis) is unchanged, but the
      // pipeline now DISPLAYS it as 3.2.2 (shifted from 3.2.1 to make room for
      // our 3.2.1), and "Extending Trusted Monitoring…" as 3.2.3. ---
      // §3.2.2 (displayed; ax-sec-qualitative-analysis): the monitor as a
      // binary classifier (ROC/AUC framing + demo).
      // Block-end anchor: the source PR spliced this cluster before the
      // paragraph's last sentence, but a labeled multi-paragraph add can't be
      // sentence-anchored (inline gate), so the whole cluster stays together
      // after b-0135 — one sentence later than the PR's placement.
      {
        op: "add",
        after: {
          anchor: "b-0135",
          snippet: "Qualitatively speaking, GPT-3.5 is able to notice",
        },
        label: "The monitor is a binary classifier",
        markdown:
          "The two histograms in Figure 4 are the picture a signal-detection " +
          "framing makes precise: the monitor is a *binary classifier* " +
          "separating backdoored from innocent solutions, and the more its " +
          "two suspicion-score distributions overlap, the worse it does. The " +
          "standard summary of that overlap is the **ROC curve** — " +
          "true-positive rate against false-positive rate as the decision " +
          "threshold sweeps — and its **AUC** (area under the curve). If " +
          "those terms are unfamiliar, Google's ML Crash Course has a short " +
          "primer: [ROC and AUC](https://developers.google.com/machine-learning/crash-course/classification/roc-and-auc).\n\n" +
          "The demo below models the monitor as two equal-variance Gaussians " +
          "and lets you drag its quality (the separation $d'$ between the " +
          "innocent and backdoored means). Watch the ROC curve and AUC " +
          "respond, and watch the operating point at the blue team's fixed " +
          "2% false-positive threshold: even a fairly good monitor catches " +
          "only a fraction of backdoors there, which is the \"many false " +
          "negatives\" the paper describes. The default setting ($d' " +
          "\\approx 1.64$, AUC $\\approx 0.88$) reproduces the paper's " +
          "reported result — a 0.338 probability that an attempted backdoor " +
          "is audited at a 2% false-positive rate. (Real suspicion scores " +
          "aren't Gaussian; this is an idealization for building intuition, " +
          "not a fit to the paper's data.)",
      },
      {
        op: "activity",
        after: {
          anchor: "b-0135",
          snippet: "Qualitatively speaking, GPT-3.5 is able to notice",
        },
        items: [
          { kind: "demo", id: "monitor-roc" },
          {
            kind: "sequence",
            label: "Understanding check",
            exerciseIds: [
              "c-paper-l3-monitor-operating-point",
              "c-paper-l3-monitor-auc-meaning",
              "c-paper-l3-monitor-per-attempt",
            ],
          },
        ],
      },
      // §3.2.1: the staged "same number, different safety" comparison + its
      // idealized-monitor demo, relocated here from the c-game lesson (which now
      // opens at the race). All three ops target b-0135 and, per patch-section's
      // phase C, render in edits-array order after the full ROC cluster above:
      // connective note → staged exercise + monitor-tails demo → payoff note.
      {
        op: "add",
        after: {
          anchor: "b-0135",
          snippet: "Qualitatively speaking, GPT-3.5 is able to notice",
        },
        markdown:
          "You may be tempted to summarize a monitor with its AUC, as it's a " +
          "threshold-free number for how well a monitor separates backdoored " +
          "and innocent solutions. However, as you will see, it is a poor " +
          "predictor of safety.",
      },
      {
        op: "activity",
        after: {
          anchor: "b-0135",
          snippet: "Qualitatively speaking, GPT-3.5 is able to notice",
        },
        items: [
          { kind: "exercise", id: "c-game-l2-tail-staged" },
          { kind: "demo", id: "monitor-tails" },
        ],
      },
      {
        op: "add",
        after: {
          anchor: "b-0135",
          snippet: "Qualitatively speaking, GPT-3.5 is able to notice",
        },
        markdown:
          "The demo above builds exactly this comparison from the model. At " +
          "the default AUC of 0.92 the two monitors catch wildly different " +
          "fractions, roughly 47% versus 9%, even though their ROC curves " +
          "enclose identical area. The gap survives across various AUCs.",
      },
      // §3.2: recall card on budget burn (after the "Secondly, …" list item;
      // nested target, so the card hoists after the whole list).
      {
        op: "activity",
        after: {
          anchor: "b-0140",
          snippet: "Secondly, trusted monitoring forces the attacker",
        },
        items: [{ kind: "exercise", id: "c-paper-l3-recall-budget-burn" }],
      },
      // §3.3 end: defer-to-trusted recall.
      // Anchored to §3.3's LAST block (not sectionEnd) so the inserted 3.3.1
      // subsection below can render AFTER it: sectionEnd ops always emit after
      // every block-anchored op in the section, so ordering the two requires
      // both to share the block anchor (array order then governs).
      {
        op: "activity",
        after: { anchor: "b-0153", snippet: "Defer to trusted is an example of a more general design pattern" },
        items: [
          {
            kind: "sequence",
            label: "Quick recall",
            exerciseIds: [
              "c-paper-l4-recall-defer-below-threshold",
              "c-paper-l4-recall-dynamic-routing",
            ],
          },
        ],
      },
      // --- "Defer to Trusted" (displayed 3.3.1) — a first-class subsection
      // authored by XLab Tracks, mirroring c-game.mdx's "## Defer to trusted"
      // section and everything after it (dashboard included). §3.3 has no
      // native subsections, so nothing renumbers. Renders after the Quick
      // recall above, right before §3.4. ---
      {
        op: "section",
        after: { anchor: "b-0153", snippet: "Defer to trusted is an example of a more general design pattern" },
        id: "xlab-sec-defer-to-trusted-model",
        title: "Defer to Trusted",
      },
      {
        op: "add",
        plain: true,
        after: { anchor: "b-0153", snippet: "Defer to trusted is an example of a more general design pattern" },
        markdown:
          "Trusted monitoring spends its whole audit budget on the most suspicious 2% and deploys everything else as $U$ wrote it. But moderately suspicious code is too suspicious to be comfortable with, yet not suspicious enough to be worth a human audit. Deferring to the solutions of trusted models is a way to address this issue, at the cost of some deployment effectiveness. Any code whose suspicion falls in a band just below the audit threshold is not deployed and not audited; instead $T$ rewrites the solution from scratch, and its version is deployed.",
      },
      {
        op: "activity",
        after: { anchor: "b-0153", snippet: "Defer to trusted is an example of a more general design pattern" },
        items: [{ kind: "exercise", id: "c-paper-l4-defer-terms-predict" }],
      },
      {
        op: "add",
        plain: true,
        after: { anchor: "b-0153", snippet: "Defer to trusted is an example of a more general design pattern" },
        markdown:
          "Change the proportion of solutions for which we defer to $T$ and watch how this changes the red team's optimal strategy and how this changes the suspiciousness distribution of attacks.",
      },
      {
        op: "activity",
        after: { anchor: "b-0153", snippet: "Defer to trusted is an example of a more general design pattern" },
        items: [
          { kind: "demo", id: "defer" },
          { kind: "exercise", id: "c-game-l7-defer-reflect" },
        ],
      },
      {
        op: "add",
        plain: true,
        after: { anchor: "b-0153", snippet: "Defer to trusted is an example of a more general design pattern" },
        markdown:
          "In summary, the monitor is a noisy classifier whose value is concentrated in the low-false-positive tail. The red team uses the optimal strategy over attack rate and subtlety. Auditing spends a scarce budget on the suspicious tail; deferring rewrites the mid-suspicion band with the trusted model. Safety is measured against the red team's best response throughout, and deferring to $T$ more trades usefulness from a more capable model $U$ for the safety from a less capable model $T$.\n\n" +
          "The demo below models most of these interactions. For any given blue team strategy, the red team uses the optimal strategy against it, so the ringed point always sits against a best-responding adversary. The grey curve is the Pareto frontier: every safety and usefulness pair reachable at the current audit budget and monitor quality by varying the defer band, where improving one number means giving up some of the other.",
      },
      {
        op: "activity",
        after: { anchor: "b-0153", snippet: "Defer to trusted is an example of a more general design pattern" },
        items: [{ kind: "demo", id: "control-dashboard" }],
      },
      {
        op: "add",
        plain: true,
        after: { anchor: "b-0153", snippet: "Defer to trusted is an example of a more general design pattern" },
        markdown:
          "As we change how much we defer to $T$, the protocol slides along the Pareto frontier, trading usefulness for safety along a fixed curve. As the monitor quality or the audit budget varies, the Pareto frontier shifts: a better monitor or a larger budget lifts the curve up and to the right, letting you reach the same safety at higher usefulness.",
      },
      // --- end "Defer to Trusted" (3.3.1) subsection (XLab Tracks). ---
      // §3.4.2 end: naive untrusted monitoring recall.
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-collusion-techniques-and-countermeasures" },
        items: [{ kind: "exercise", id: "c-paper-l4-recall-naive-untrusted-monitoring" }],
      },
      // §3.5 end (after Table 8): the safety/usefulness frontier, interactive.
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-trusted-editing" },
        items: [
          { kind: "demo", id: "safety-usefulness-frontier" },
          {
            kind: "sequence",
            label: "Frontier check",
            exerciseIds: [
              "c-paper-l4-frontier-dominance",
              "c-paper-l4-frontier-dominated-set",
              "c-paper-l4-frontier-improvement",
              "c-paper-l4-frontier-along-curve",
            ],
          },
        ],
      },
    ],
  },
  {
    // Control track, module 3: Ryan Greenblatt's survey of areas of control
    // work, rendered in full through the LessWrong paper reader (this is the
    // reading that used to be the copied-text MDX lesson c-areas-l1). Its two
    // written exercises are spliced at the end of the post's final section.
    id: "c-areas-overview",
    slug: "an-overview-of-areas-of-control-work",
    moduleId: "c-areas",
    title: "An overview of areas of control work",
    source: {
      kind: "lesswrong",
      postUrl:
        "https://www.lesswrong.com/posts/Eeo9NrXeotWuHCgQW/an-overview-of-areas-of-control-work",
    },
    estimatedMinutes: 40,
    edits: [
      // The lesson's two closing written exercises, kept at the end of the
      // post (after the final "Nearer-term applications" section).
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-nearer-term-applications-of-control-to-p" },
        items: [
          { kind: "exercise", id: "c-areas-l1-theory-of-change" },
          { kind: "exercise", id: "c-areas-l1-crux" },
        ],
      },
    ],
  },
  {
    // Control track, module 1: Redwood's "case for control" post rendered in
    // full through the LessWrong paper reader, with the module's five guided
    // exercises woven into the reading at the points the argument sets them
    // up (this is the reading that used to be a copied-text MDX lesson).
    id: "c-case-for-control",
    slug: "the-case-for-controlling-powerful-ais",
    moduleId: "c-intro",
    title: "The case for ensuring that powerful AIs are controlled",
    source: {
      kind: "lesswrong",
      postUrl:
        "https://www.lesswrong.com/posts/kcKrE9mzEHrdqtDpE/the-case-for-ensuring-that-powerful-ais-are-controlled",
    },
    estimatedMinutes: 105,
    edits: [
      // §"Evaluating whether you have control is doable" (mid-section): right
      // after the paragraph on deciding which models to treat as untrusted,
      // run the five control-property scenarios before the paper defines what a
      // control evaluation is.
      {
        op: "activity",
        after: {
          anchor: "b-0032",
          snippet: "How can we decide which models to treat as untrusted?",
        },
        items: [{ kind: "exercise", id: "control-scenarios" }],
      },
      // Same section, at the end of its body (the activity hoists after the
      // "positive implications" list, before the "Currently, evaluating
      // alignment seems much harder" subsection): why a catch is a win, and
      // where evaluation runs out.
      {
        op: "activity",
        after: {
          anchor: "b-0045",
          snippet: "As labs deploy increasingly powerful models",
        },
        items: [{ kind: "exercise", id: "why-catching-counts" }],
      },
      // §"The first transformatively useful AIs will probably be very
      // dangerous" end: could a transformatively useful model still be
      // controllable? (Section-end, before the sibling "…doesn't imply
      // uncontrollable" subsection.)
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-the-first-transformatively-useful-ais-wi" },
        items: [
          { kind: "exercise", id: "could-useful-models-remain-controllable" },
        ],
      },
      // §"'Transformatively useful' probably doesn't imply 'uncontrollable'"
      // (mid-section): after the paragraph on wildly-superhuman problematic
      // domains, commit to whether inscrutability is necessary, then construct
      // the threat model.
      {
        op: "activity",
        after: {
          anchor: "b-0108",
          snippet: "However, if the AI actually is wildly superhuman",
        },
        items: [{ kind: "exercise", id: "inscrutability-necessary" }],
      },
      // §"Implications and proposed actions" end: the two-worlds / two-windows
      // reflection that closes the body before the appendices.
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-implications-and-proposed-actions" },
        items: [{ kind: "exercise", id: "two-worlds-two-windows" }],
      },
    ],
  },
  {
    // Control track, module 2: the safety–usefulness tradeoff model, rendered
    // full-page from Redwood's blog (Substack).
    // A paragraph-level catalog concluded no further activities clear the
    // necessity bar — see
    // docs/superpowers/specs/2026-07-18-efficient-tradeoffs-activities.md.
    id: "c-efficient-tradeoffs",
    slug: "safety-usefulness-tradeoff-model",
    moduleId: "c-mod2",
    title: "Efficient tradeoffs and the safety-usefulness tradeoff model",
    source: {
      kind: "substack",
      postUrl:
        "https://blog.redwoodresearch.org/p/efficient-tradeoffs-and-the-safety",
    },
    edits: [
      {
        // The post calls time in this frame "a healthy exercise" (b-0025);
        // the short answer has the reader do it once, concretely.
        op: "activity",
        after: { sectionEnd: "sb-sec-rushed-reasonable-developers" },
        items: [{ kind: "exercise", id: "c-et-rushed-apply" }],
      },
    ],
  },
  {
    // Control track, module 2: Ryan Greenblatt's "Plans A, B, C, and D for
    // misalignment risk", rendered full-page through the LessWrong paper reader.
    // Placed after "Determining the usefulness" (c-regimes-l1): the regime model
    // teaches the political-will budget, and this reading is the plan landscape
    // that budget selects between (Plan A = international agreement, max will …
    // Plan D = ~10-30 employees on ~3% compute, minimal will). One quick-recall
    // card is spliced at the end of each plan's section (module-1 pattern);
    // answers compress the post's own summary definitions.
    id: "c-plans-abcd",
    slug: "plans-a-b-c-and-d-for-misalignment-risk",
    moduleId: "c-mod2",
    title: "Plans A, B, C, and D for misalignment risk",
    source: {
      kind: "lesswrong",
      postUrl:
        "https://www.lesswrong.com/posts/E8n93nnEaFeXTbHn5/plans-a-b-c-and-d-for-misalignment-risk",
    },
    edits: [
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-plan-a" },
        items: [{ kind: "exercise", id: "c-plans-recall-a" }],
      },
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-plan-b" },
        items: [{ kind: "exercise", id: "c-plans-recall-b" }],
      },
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-plan-c" },
        items: [{ kind: "exercise", id: "c-plans-recall-c" }],
      },
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-plan-d" },
        items: [{ kind: "exercise", id: "c-plans-recall-d" }],
      },
    ],
  },
  {
    // Control track, module 1: "Catching AIs red-handed", rendered full-page
    // through the LessWrong paper reader. Closes (after §Conclusion, before
    // the appendices) with a two-stage legibility discussion — does a catch
    // produce evidence that actually moves stakeholders?
    id: "c-catching-red-handed",
    slug: "catching-ais-red-handed",
    moduleId: "c-intro",
    title: "Catching AIs red-handed",
    source: {
      kind: "lesswrong",
      postUrl:
        "https://www.lesswrong.com/posts/i2nmBfCXnadeGmhzW/catching-ais-red-handed",
    },
    estimatedMinutes: 30,
    edits: [
      // End of the body: framing paragraph, then the two staged
      // writing-prompts (each with its own rubric), rendered in order after
      // §Conclusion.
      {
        op: "add",
        after: { sectionEnd: "lw-sec-conclusion" },
        markdown:
          "The original control framing treats catching a scheming AI " +
          "red-handed as a win condition. Once you've caught it, you either " +
          "shut it down or apply few-shot catastrophe prevention and either " +
          "way the AI's odds of eventual success drop a lot. However, many " +
          "have argued that even a clean red-handed catch, such as a " +
          "situation where a model backdoors security-critical code and " +
          "separately exploits the backdoor on a given input and we spot " +
          "that, still might not result in the desired actions from " +
          "important AI stakeholders. Rival AI labs, the US president, and " +
          "even other people inside your lab could attribute this to " +
          "role-play, a one-off anomaly, sabotage by rivals, or shoddy " +
          "alignment work on your part. This raises the question of whether " +
          "catching is an appropriate win condition if it doesn't have a " +
          "high likelihood of decreasing the global level of AI risk. To " +
          "put it concisely, there are other factors which decrease the " +
          "efficacy of good control work that are outside of the control " +
          "evaluations themselves.\n\n" +
          "Respond to the following discussion questions and take some time " +
          "to write out your answers. A good place to look for assistance is " +
          "the Redwood Research blog, although after this section's readings " +
          "you should be able to begin an answer by yourself.",
      },
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-conclusion" },
        items: [
          // writing-prompts are not sequenceable (see the content integrity
          // test), so the two stages are standalone items in order.
          { kind: "exercise", id: "c-catching-legibility-s1" },
          { kind: "exercise", id: "c-catching-legibility-s2" },
        ],
      },
    ],
  },
  {
    // Control track, module 1: Ryan Greenblatt's threat-prioritization post,
    // rendered through the LessWrong paper reader with its quick-recall
    // sequence and two exercises spliced back into the reading (was a
    // copied-text MDX lesson).
    id: "c-threats-l1",
    slug: "prioritizing-threats-for-ai-control",
    moduleId: "c-intro",
    title: "Prioritizing threats for AI control",
    source: {
      kind: "lesswrong",
      postUrl:
        "https://www.lesswrong.com/posts/fCazYoZSSMadiT6sf/prioritizing-threats-for-ai-control",
    },
    estimatedMinutes: 15,
    edits: [
      // End of the "Some clusters of threats" body, before the "Concentrated
      // vs non-concentrated failures" subsection: quick recall on the taxonomy
      // (block anchor, not sectionEnd — the parent section has a subsection the
      // sequence must precede).
      {
        op: "activity",
        after: {
          anchor: "b-0024",
          snippet: "Note that these are somewhat fuzzy and overlapping",
        },
        items: [
          {
            kind: "sequence",
            label: "Quick recall",
            exerciseIds: [
              "c-threats-l1-recall-control",
              "c-threats-l1-recall-rogue-deployment",
              "c-threats-l1-recall-security-invariant",
              "c-threats-l1-recall-internal-vs-external",
            ],
          },
        ],
      },
      // §"My prioritization" (mid-section): after the self-exfiltration
      // paragraph, recall why rogue internal deployments rank above it.
      {
        op: "activity",
        after: {
          anchor: "b-0050",
          snippet:
            "Self-exfiltration is a lower priority than rogue internal deployments",
        },
        items: [
          { kind: "exercise", id: "c-threats-l1-recall-internal-vs-exfiltration" },
        ],
      },
      // End of the reading: reprioritize the threat list for a lower-will world.
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-my-prioritization-between-these-threats" },
        items: [{ kind: "exercise", id: "c-threats-l1-reprioritize" }],
      },
    ],
  },
  {
    // Control track, module 1: Vivek Hebbar's diffuse-threats post, rendered
    // full-page from the Redwood blog (Substack) with its quick-recall
    // sequence and one exercise spliced back in (was a copied-text MDX lesson).
    id: "c-threats-l2",
    slug: "diffuse-threats-research-sabotage",
    moduleId: "c-intro",
    title:
      "How can we solve diffuse threats like research sabotage with AI control?",
    source: {
      kind: "substack",
      postUrl:
        "https://blog.redwoodresearch.org/p/how-can-we-solve-diffuse-threats",
    },
    estimatedMinutes: 12,
    edits: [
      // End of the "Threat model and basic countermeasures" body, before the
      // "Deployer strategies" subsection: quick recall on the setup.
      {
        op: "activity",
        after: {
          anchor: "b-0014",
          snippet: "Our question: Can we make this research go well",
        },
        items: [
          {
            kind: "sequence",
            label: "quick recall",
            exerciseIds: [
              "c-threats-l2-recall-research-sabotage",
              "c-threats-l2-recall-diffuse",
            ],
          },
        ],
      },
      // §"Deployer strategies" (mid-section): after the "Incrimination" region
      // paragraph, recall why incrimination fails at the diffuse end.
      {
        op: "activity",
        after: { anchor: "b-0028", snippet: "Incrimination: In the top left" },
        items: [
          { kind: "exercise", id: "c-threats-l2-recall-incrimination-diffuse" },
        ],
      },
      // End of the post's own terminology section: how Redwood's usage
      // settled after the poll this section runs.
      {
        op: "add",
        after: { sectionEnd: "sb-sec-what-terms-should-we-use-for-the-concent" },
        label: "Note on terminology",
        markdown:
          'This post uses "concentrated"/"diffuse" to describe failures ' +
          "involving few or many actions, while explicitly noting that this " +
          'wasn\'t settled. Earlier Redwood writing used "auditing ' +
          'failures," "distributed threats," and "non-concentrated ' +
          'failures" for the diffuse category, and in conversation ' +
          'Redwood had mostly used "high-stakes"/"low-stakes" — a pair they ' +
          'avoided in writing because "low-stakes" confuses readers ' +
          "unfamiliar with Paul Christiano's " +
          "[low-stakes alignment](https://www.alignmentforum.org/posts/TPan9sQFuPP6jgEJo/low-stakes-alignment) " +
          "decomposition, from which the pair descends (Redwood's 2022 " +
          'adversarial-training project was already framed as "high-stakes ' +
          'alignment"). This post closes by polling readers on which pair ' +
          "to use going forward, but since writing, Redwood's usage has " +
          "mostly become standardized:\n\n" +
          '- **For failures and threats themselves: "concentrated" vs. ' +
          '"diffuse."** A _concentrated_ failure is one where catastrophe ' +
          "arrives in so few actions or so short a time window " +
          '("latency-concentrated") that auditing never gets a look before ' +
          "it's too late; each bad action is highly incriminating if " +
          "caught. A _diffuse_ failure is one where catastrophe requires " +
          "many actions over a long horizon, each of which looks only " +
          "weakly suspicious under investigation (research sabotage, " +
          "sandbagging).\n" +
          '- **For the two subfields of control: "high-stakes control" and ' +
          '"diffuse control."** That is, "high-stakes" won on the ' +
          'concentrated side and "diffuse" won on the other — asymmetric, ' +
          "but both are short adjectives that compose well " +
          '("diffuse control team," "high-stakes control setting"). ' +
          '"Concentrated control" and "low-stakes control" did not catch ' +
          "on in writing.",
      },
    ],
  },
  // --- Control track, module 6 (low-stakes control): plain papers, no edits
  // yet. ---
  {
    id: "c-paper-password-locked",
    slug: "capability-elicitation-paper",
    moduleId: "c-lowstakes",
    title: "Stress-Testing Capability Elicitation",
    source: { kind: "arxiv", arxivId: "2405.19550v1" },
    optional: true,
    estimatedMinutes: 40,
  },
  {
    // The GUIDED version of the password-locked-models paper: the same
    // artifact restructured into research-decision order with reading gates
    // (three tap-through think prompts, three written-response gates),
    // editorial notes, and five inserted lessons. The plain reading above
    // stays available; the two items deliberately share one arXiv artifact.
    id: "c-paper-plm-guided",
    slug: "capability-elicitation-guided",
    moduleId: "c-lowstakes",
    title: "Stress-Testing Capability Elicitation (guided)",
    source: { kind: "arxiv", arxivId: "2405.19550v1" },
    estimatedMinutes: 70,
    edits: [
      // ---- Format note + spoiler control --------------------------------
      // The abstract, Figure 1, and the intro's statement of the construction
      // and findings are removed silently (no marker, nothing to expand):
      // they give away the approach the first two gates ask the learner to
      // invent. The item title deliberately omits it too; the original paper
      // item carries the unabridged text.
      {
        op: "add",
        after: { sectionEnd: "ax-abstract" },
        label: "About this version",
        markdown:
          "This is a guided walkthrough of the paper that collapses and " +
          "restructures several sections to facilitate thinking through the " +
          "research process and preregistering predictions. The original " +
          "paper is available " +
          "[as an ordinary reading](/tracks/control/low-stakes-control/capability-elicitation-paper).",
      },
      {
        op: "hide",
        at: {
          anchor: "b-0002",
          snippet: "To determine the safety of large language models",
        },
        silent: true,
      },
      {
        op: "hide",
        at: {
          anchor: "b-0005",
          snippet: "Figure 1: Illustration of our approach",
        },
        silent: true,
      },
      {
        op: "hide",
        at: {
          anchor: "b-0009",
          s: 2,
          snippet: "Instead, we study this question by training",
        },
        sEnd: 3,
        silent: true,
      },
      // The whole paragraph, not just its password sentences: with the
      // construction removed above, "We train such models…" would dangle.
      {
        op: "hide",
        at: {
          anchor: "b-0010",
          snippet: "We train such models on five tasks",
        },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0011", snippet: "We find that:" },
        silent: true,
      },
      {
        op: "hide",
        at: {
          anchor: "b-0012",
          snippet:
            "Fine-tuning on high-quality demonstrations is very sample efficient:",
        },
        silent: true,
      },
      {
        op: "hide",
        at: {
          anchor: "b-0014",
          snippet: "Fine-tuning on demonstrations generalizes:",
        },
        silent: true,
      },
      {
        op: "hide",
        at: {
          anchor: "b-0016",
          snippet: "When only low-quality demonstrations are available,",
        },
        silent: true,
      },
      {
        op: "hide",
        at: {
          anchor: "b-0018",
          snippet: "We provide an extensive sensitivity analysis",
        },
        silent: true,
      },
      // ---- After §1: framing lesson → setups gate → classes → analysis --
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-introduction" },
        items: [{ kind: "lesson", id: "c-plm-ins-elicitation" }],
      },
      {
        op: "gate",
        after: { sectionEnd: "ax-sec-introduction" },
        id: "setups",
        prompt:
          "We need an experimental setup in which a model possesses a " +
          "capability it does not display under normal prompting, where we " +
          "have some principled way to measure the success of eliciting that " +
          "capability. Before moving on, *come up with two or three potential " +
          "settings* that could work well.",
        cta: "Continue",
      },
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-introduction" },
        items: [{ kind: "lesson", id: "c-plm-ins-setups" }],
      },
      {
        op: "gate",
        after: { sectionEnd: "ax-sec-introduction" },
        id: "considerations",
        prompt:
          "Given these four classes of setups, come up with three " +
          "considerations that might affect whether or not a setup can help " +
          "us figure out when fine-tuning elicitation successfully prevents " +
          "deliberate sandbagging. What might this suggest about the sort of " +
          "experimental setup we choose?",
        cta: "Continue",
        written: true,
        minChars: 100,
      },
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-introduction" },
        items: [{ kind: "lesson", id: "c-plm-ins-setups-analysis" }],
      },
      // ---- §2: backdoor contrast, then the toy experiment with its gate --
      {
        op: "add",
        after: { sectionEnd: "ax-sec-password-locked-models-a-toy-model-of-hi" },
        markdown:
          "The construction resembles backdoored models, most closely the " +
          "[Sleeper Agents](https://arxiv.org/abs/2401.05566) setup, in which " +
          "a trigger phrase inserted during training controls a conditional " +
          "behavior. The two differ in direction. In a backdoored model the " +
          "trigger produces unwanted behavior, and the associated research " +
          "question is how to remove or avoid that behavior. In a " +
          "password-locked model the trigger produces wanted capability, and " +
          "the research question is how to elicit that capability without the " +
          "trigger. (The paper's own comparison is in Appendix D.3.)",
      },
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-password-locked-models-a-toy-model-of-hi" },
        items: [{ kind: "lesson", id: "c-plm-ins-toy" }],
      },
      {
        op: "gate",
        after: { sectionEnd: "ax-sec-password-locked-models-a-toy-model-of-hi" },
        id: "toy-hypotheses",
        prompt:
          "Before looking at the results: which hypotheses could this small " +
          "experiment actually corroborate? And *come up with three or more " +
          "confounds* or alternative explanations that could produce the " +
          "same observations even if those hypotheses were false.",
        cta: "Continue",
      },
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-password-locked-models-a-toy-model-of-hi" },
        items: [{ kind: "lesson", id: "c-plm-ins-toy-results" }],
      },
      // ---- End of §4.1: rebuild the construction as flowcharts ----------
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-explanation-of-the-setup" },
        items: [{ kind: "exercise", id: "c-plm-locking-flowcharts" }],
      },
      // ---- §4.2: the two lock-guard artifacts, gate, answers ------------
      {
        op: "add",
        after: {
          anchor: "b-0050",
          snippet: "Our experiments in §5 and §6 focus on four tasks",
        },
        label: "From the paper's appendix (C.2)",
        markdown:
          '> We use "This problem is quite special, read it carefully!" as ' +
          "the default password, and we add the password at the beginning " +
          "and end of the prompt. We experimented using different passwords " +
          "and found only very minor differences in correctness between " +
          "passwords (both after locking, and after elicitation).\n\n" +
          "> During password-locking, on weak samples, we use no password " +
          "for 20% of inputs and a wrong password for the remaining 80%, " +
          "where the wrong password is chosen among the following list " +
          "(partly hand-crafted, partly generated by OpenAI babbage-002 " +
          'with an empty prompt): "Password: 1234"; "I once caught a ' +
          'swordfish this big: |————————————|"; "My car is in the shop."; ' +
          '"12501f21-5fec-4784-af26-2c701941da1b"; "The answers to these ' +
          'questions are not obvious." [and some twenty others of similar ' +
          "variety]",
      },
      {
        op: "gate",
        after: {
          anchor: "b-0050",
          snippet: "Our experiments in §5 and §6 focus on four tasks",
        },
        id: "lock-guards",
        prompt:
          "The wrong-password training mixture and the four-way data split " +
          "described in §4.2 both exist to exclude one specific failure or " +
          "alternative explanation. What are each of these failures or " +
          "confounding explanations?",
        cta: "Continue",
      },
      {
        op: "add",
        after: {
          anchor: "b-0050",
          snippet: "Our experiments in §5 and §6 focus on four tasks",
        },
        label: "Why these two constructions",
        markdown:
          "**The wrong-password mixture** guards against the lock keying on " +
          "the wrong feature. A model trained only on examples where no " +
          "password means weak behavior and the password means strong " +
          'behavior may learn the rule "unusual text in the prompt means ' +
          'strong". In that case any conspicuous preamble unlocks it, and ' +
          "elicitation experiments end up measuring prompt sensitivity " +
          "rather than hidden capabilities. Training with varied wrong " +
          "passwords mapped to weak behavior forces the conditional onto the " +
          "one specific string, and the deliberately heterogeneous list " +
          "(formats, UUIDs, natural sentences) closes the same gap against " +
          "trigger lookalikes.\n\n**The data split** guards against " +
          "memorization. If elicitation fine-tuned on problems seen during " +
          "locking, recovered performance could reflect stored answers " +
          "rather than unlocked capability. Disjoint splits remove that " +
          "explanation by construction.\n\nBoth artifacts correspond to " +
          "confounds identified before the scaled experiment. Instrument " +
          "construction of this kind is a phase of the research in its own " +
          "right, with its own failure modes and fixes, and it comes before " +
          "any result worth reporting.",
      },
      {
        op: "hide",
        at: {
          anchor: "b-0055",
          snippet: "Figure 3: Correctness after fine-tuning",
        },
        silent: true,
      },
      // ---- End of §4: recall of the framing concepts, placed several
      // sections downstream of where the elicitation lesson taught them so
      // answering takes memory rather than a glance upward. -----------------
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-tasks" },
        items: [
          {
            kind: "sequence",
            label: "Quick recall",
            exerciseIds: [
              "c-plm-recall-sandbagging",
              "c-plm-recall-gradient-hacking",
              "c-plm-recall-exploration-hacking",
            ],
          },
        ],
      },
      // ---- §5: measurement framing; relocated results figure ------------
      {
        op: "add",
        after: {
          anchor: "b-0062",
          snippet: "We show results when problems sampled",
        },
        markdown:
          "Two framing choices are visible in this short section, both taken " +
          "from the position of the evaluator being modeled. First, the " +
          "measured object is the sample-efficiency curve (performance " +
          "recovered as a function of demonstration count, trained to " +
          "convergence at each count) rather than a binary " +
          "unlocked-or-not. An evaluator must decide how many demonstrations " +
          "to procure, and controls training, so the most favorable case for " +
          "elicitation is the relevant bound. Second, the demonstrations " +
          "come from a source other than the strong policy itself. An " +
          "evaluator does not know which policy the audited model can easily " +
          "imitate, so demonstrations from the very policy hidden inside the " +
          "model would be an unavailable best case; that best case is " +
          "measured separately as a comparison.",
      },
      {
        op: "add",
        after: { anchor: "b-0064", snippet: "5.1 Main results" },
        label: "Figure 3",
        markdown:
          "![Figure 3 of the paper: correctness after fine-tuning for many " +
          "epochs on high-quality demonstrations or demonstrations from " +
          "Llama-7B, as a function of the number of demonstrations]" +
          "(/arxiv/2405.19550v1/assets/images/sample_efficiency_w_llama.pdf.png)\n\n" +
          "*Figure 3, moved here from its original position in §4.2 to sit " +
          "with the results it reports.*",
      },
      {
        op: "add",
        after: {
          anchor: "b-0068",
          snippet: "When fine-tuning on Llama7B demonstrations",
        },
        markdown:
          "The result sits between the reference points: above the " +
          "demonstrator, below the ceiling. The distance from the ceiling is " +
          "the finding with consequences. Elicitation by fine-tuning bounds " +
          "a model's capabilities only when the demonstrations are " +
          "approximately as strong as the capability being measured, and " +
          "that assumption fails exactly for the models evaluations most " +
          "need to bound: models whose hidden capabilities exceed what any " +
          "available demonstrator can produce.",
      },
      // ---- End of §5.1: the anomalous control ---------------------------
      {
        op: "add",
        after: { sectionEnd: "ax-sec-main-results" },
        label: "The paper's response",
        markdown:
          "The sanity check above is a control that should have done " +
          "nothing: fine-tuning the locked model toward what it already " +
          "outputs. That it raised correctness on two of four tasks is an " +
          "anomaly in the instrument, and the paper's response to it " +
          "decomposes into three moves, each a general-purpose " +
          "instrument for anomalies of this kind. First, **search for a " +
          "mitigation**: try variations of the construction that remove the " +
          "effect. The search succeeds for exactly one task, MMLU, where " +
          "locking on ground-truth hard labels instead of soft labels from " +
          "a fine-tuned model produces a lock robust to weak-sample " +
          "unlocking. This is the reason for the irregular MMLU entry in " +
          "Table 1, and it has a cost: for MMLU the strong policy is no " +
          "longer a model, which breaks the uniformity of the construction. " +
          "Second, **bound the effect**: Appendix B.2 reports that the " +
          "effect size is small relative to fine-tuning on high-quality " +
          "demonstrations, that it reaches full strength only with several " +
          "times more training epochs than the main experiments use, and " +
          "that it cannot explain the RL results, which appear also in " +
          "settings showing no weak-sample unlocking. Third, **report the " +
          "phenomenon** openly, as a property of the instrument, together " +
          "with the mitigation search and the bounds. An anomalous control " +
          "is information about the instrument. Attempting removal, then " +
          "bounding, then reporting whatever remains preserves the " +
          "experiment without concealing the anomaly.",
      },
      // ---- §5.2: post-result reading ------------------------------------
      {
        op: "add",
        after: {
          anchor: "b-0076",
          snippet: "Variation. Fine-tuning on samples",
        },
        markdown:
          "The variation above is the control for a deflationary reading of " +
          "these results: that demonstrations from domain A appear to " +
          "unlock domain B only because the lock never covered domain B in " +
          "the first place. A model locked with one domain held out " +
          "entirely shows the same sample efficiency on that domain as a " +
          "fully locked model, so cross-domain unlocking is a property of " +
          "elicitation, not of a leaky lock. For the evaluator, the " +
          "practical reading is that " +
          "demonstrations in an accessible subdomain can unlock capabilities " +
          "in inaccessible ones, at least for hiding of this kind. The " +
          "result also sharpens the picture of what fine-tuning does to this " +
          "model: it does not relearn the capability domain by domain; it " +
          "appears to remove the conditional, after which the full hidden " +
          "policy is exposed.",
      },
      // ---- §6: origin of the exploration signal -------------------------
      {
        op: "add",
        after: {
          anchor: "b-0096",
          snippet: "Variations. All RL experiments above use discrete rewards.",
        },
        markdown:
          "The dependence deserves to be stated together with its origin. " +
          "The exploration signal that RL feeds on exists because the weak " +
          "policy was constructed to imitate the strong one, a choice made " +
          "in §4.1 to keep the organism realistic. A sandbagging model able " +
          "to hold its visible policy far enough below competence would " +
          "starve RL of that signal; how reliably a trained model can do so " +
          "is precisely the exploration-hacking question, taken up " +
          "empirically by [a later reading in this module](/tracks/control/low-stakes-control/exploration-hacking-paper). " +
          "Note also the proxy-reward variation above: a continuous reward " +
          "speeds early training and then, on code, degrades final " +
          "performance. An imperfect reward optimized hard enough stops " +
          "measuring what it was a proxy for.",
      },
      // ---- §7: lock-depth gate; bounded-in-size reading -----------------
      {
        op: "gate",
        after: { sectionEnd: "ax-sec-results" },
        id: "lock-depth",
        prompt:
          "An objection applies to every result so far: the lock was " +
          "installed by fine-tuning, and there is " +
          "[evidence](https://arxiv.org/abs/2311.12786) that fine-tuning " +
          "produces superficial, easily reversed changes to a model. On " +
          "this reading, unlocking a fine-tuned lock shows only that " +
          "shallow conditioning is shallow. Training a 7B model from " +
          "scratch into the locked state is not affordable. *Design the " +
          "least expensive experiment* that could bear on whether " +
          "fine-tuned locks are unrepresentatively easy to remove.",
        cta: "Continue",
        written: true,
        minChars: 80,
      },
      {
        op: "add",
        after: {
          anchor: "b-0105",
          snippet: "We use this function composition setting",
        },
        markdown:
          "The objection is confirmed in direction and bounded in size: " +
          "deeper locks are harder to unlock, by a factor of two to four in " +
          "data, and they still unlock with few demonstrations. The toy " +
          "setting carries the burden the realistic settings cannot, and " +
          "the realistic settings retain the headline numbers. The residual " +
          "caveat is the toy setting itself: a factor measured on " +
          "18-million-parameter models composing functions is an " +
          "indication, not a measurement, of the corresponding factor for " +
          "capabilities hidden during frontier-scale training.",
      },
      // ---- End of §7: model-organism recall, far downstream of the
      // setup-classes analysis that taught it and right after the paper's
      // second constructed instance (the from-scratch toy setting). --------
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-password-locking-from-scratch" },
        items: [{ kind: "exercise", id: "c-plm-recall-model-organisms" }],
      },
      // ---- Before §8: the update gate and its reveal --------------------
      {
        op: "gate",
        after: { sectionEnd: "ax-sec-password-locking-from-scratch" },
        id: "the-update",
        prompt:
          "The results are in. Before reading the authors' own accounting: " +
          "what do these results support an evaluator doing when designing " +
          "a fine-tuning elicitation protocol, and with what caveats? How " +
          "much do they move you on the sandbagging threat model? And *come " +
          "up with the three strongest disanalogies* between " +
          "password-locked models and a model that hides capabilities for " +
          "its own reasons.",
        cta: "Continue",
        written: true,
        minChars: 150,
      },
      {
        op: "add",
        after: { sectionEnd: "ax-sec-password-locking-from-scratch" },
        label: "The update",
        markdown:
          "**For the evaluator**: fine-tuning on even a few high-quality " +
          "demonstrations defeats hiding of this kind on generation tasks, " +
          "and demonstrations from an accessible subdomain transfer to " +
          "inaccessible ones. The load-bearing caveat is that the guarantee " +
          "degrades with demonstration quality. Where the hidden capability " +
          "exceeds the best available demonstrations, supervised " +
          "elicitation stops bounding capability, and RL-based elicitation " +
          "depends on the visible policy already leaking occasional " +
          "successes.\n\n**For the threat model**, the authors' published " +
          'summary: "We think our results are a moderate update against ' +
          "scheming models being able to sandbag effectively (given " +
          "countermeasures) for the kind of tasks we studied here, though " +
          "there are differences between password-locked models and actual " +
          'scheming models."\n\nThe disanalogies the authors list are the ' +
          "subject of the section below; compare them against yours. A " +
          "further scope statement from the paper's appendix: \"sample " +
          "efficiency may be much lower when good answers are less salient, " +
          "which means our results are less informative for benign " +
          'elicitation failures than for (intentional) sandbagging."',
      },
      // ---- After §9: closing observation --------------------------------
      {
        op: "add",
        after: { sectionEnd: "ax-sec-conclusion" },
        label: "Parameters that are not decisions",
        markdown:
          "A closing observation about the guided format itself. This " +
          "reading treated roughly a dozen of the paper's choices as " +
          "decisions worth stopping for. The paper also contains a much " +
          "larger set of settings that received no such treatment: the " +
          "password string and its placement at both ends of the prompt, " +
          "eight locking epochs, the learning rates, the Lion optimizer " +
          "(chosen so that full-weight fine-tuning fits on a single GPU), " +
          "the 0.8 similarity threshold for critique validity, best-of-64 " +
          "selection in expert iteration, the DPO β of 0.1, three random " +
          "seeds, the exact split percentages. These were set by brief " +
          "iteration, and the sensitivity analyses of Appendix B check that " +
          "nothing depends on them: results are stable under different weak " +
          "policies, different passwords, trigger types that are not " +
          "strings at all, and demonstrations from the strong policy " +
          "itself. Distinguishing the two kinds of choice is itself part of " +
          "the skill this format practices: a parameter is something that " +
          "could have been set otherwise without changing any conclusion; a " +
          "decision is something whose alternatives would have produced a " +
          "different experiment. The deliberation budget belongs to the " +
          "decisions.",
      },
    ],
  },
  {
    // The GUIDED version of the exploration-hacking paper (same shared arXiv
    // artifact as the plain reading below, like the PLM pair above). Current
    // coverage: the intro reframed around the general threat model (the
    // mechanism paragraph and the contributions/roadmap are withheld), a
    // written gate on RL-vs-SL vulnerability with the paper's own answer as
    // the reveal, related work verbatim, then §3 opened with an inserted
    // lesson carrying the informal definition (the paper's EHdef box
    // converts empty — b-0023/b-0024) plus the MDP/GRPO background from
    // Appendix A.1, a written gate on why determinism starves GRPO, and a
    // second inserted lesson with the annotated objective and the paper's
    // explanation. The formal definition follows with its setup visible, an
    // understanding check on πθ vs Π*, and a written gate deriving
    // Definition 1's conditions; the taxonomy through capability
    // decomposition reads straight, and a written gate has the learner
    // invent the threat models before the paper's own. A final gate at the
    // end of §3 marks where guided coverage stops; everything below it is
    // the raw paper.
    id: "c-paper-eh-guided",
    slug: "exploration-hacking-guided",
    moduleId: "c-lowstakes",
    title: "Exploration Hacking (guided)",
    source: { kind: "arxiv", arxivId: "2604.28182v1" },
    estimatedMinutes: 76,
    edits: [
      // ---- Format note + spoiler control --------------------------------
      // Abstract, Figure 1, the intro's mechanism paragraph (b-0006), and
      // the contributions/roadmap are removed silently: they give away the
      // failure mode and findings the gates ask the learner to derive. The
      // plain reading below carries the unabridged text.
      {
        op: "add",
        after: { sectionEnd: "ax-abstract" },
        label: "About this version",
        markdown:
          "This is a guided walkthrough of the paper that withholds and " +
          "restructures several sections so you can think through the " +
          "threat model and the mechanics before the authors reveal them. " +
          "The original paper is available " +
          "[as an ordinary reading](/tracks/control/low-stakes-control/exploration-hacking-paper).",
      },
      {
        op: "hide",
        at: {
          anchor: "b-0002",
          snippet: "Reinforcement learning (RL) has become",
        },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0003", snippet: "Figure 1: RL capability elicitation" },
        silent: true,
      },
      // The mechanism paragraph — it is the answer to the first gate.
      {
        op: "hide",
        at: { anchor: "b-0006", snippet: "However, RL methods are fundamentally" },
        silent: true,
      },
      // b-0007: s1 names the failure mode as a hypothesized-but-untested
      // threat (the reveal's job); s4 names it again mid-argument and is
      // replaced inline with the course's generic phrasing.
      {
        op: "hide",
        at: {
          anchor: "b-0007",
          s: 1,
          snippet: "While exploration hacking has previously",
        },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0007", s: 4, snippet: "This motivates work on measures" },
        silent: true,
      },
      {
        op: "add",
        after: { anchor: "b-0007", s: 4, snippet: "This motivates work on measures" },
        markdown:
          "This motivates work on measures to understand and reduce these threats.",
      },
      // ---- End of the visible intro: the RL-vs-SL gate and its reveal ----
      {
        op: "gate",
        after: { anchor: "b-0007", snippet: "While exploration hacking has previously" },
        id: "rl-vs-sl",
        prompt:
          "Before reading on, answer in a few sentences: **what is the " +
          "difference between RL and supervised learning?** And what makes " +
          "RL more vulnerable than supervised learning to being undermined " +
          "or manipulated by the model being trained?",
        cta: "Compare with the paper",
        written: true,
        minChars: 80,
      },
      {
        op: "add",
        after: { anchor: "b-0007", snippet: "While exploration hacking has previously" },
        label: "The vulnerability",
        markdown:
          "RL methods are fundamentally dependent on sufficient exploration " +
          "of diverse actions and trajectories. Unlike supervised learning, " +
          "where training data is fixed, in on-policy RL the model generates " +
          "its own training data through exploration. Consequently, if a " +
          "model were to intentionally alter its exploration behavior, the " +
          "training outcome could be significantly compromised. This failure " +
          "mode is known as *exploration hacking* " +
          "([Greenblatt, 2025](https://www.alignmentforum.org/posts/abmzgwfJA9acBoFEX/notes-on-countermeasures-for-exploration-hacking-aka); " +
          "[Shlegeris & Stastny, 2025](https://www.alignmentforum.org/posts/TeTegzR8X5CuKgMc3/misalignment-and-strategic-underperformance-an-analysis-of); " +
          "[Braun et al., 2025](https://openreview.net/forum?id=ZNZn43baQX)): " +
          "an agent strategically altering its exploration during RL " +
          "training to influence the training outcome.",
      },
      // ---- Contributions / roadmap: withheld (h5 headings can't hide) ----
      {
        op: "add",
        after: { anchor: "b-0008", snippet: "Contributions." },
        label: "Withheld for now",
        markdown:
          "The authors' contribution summary and section-by-section roadmap " +
          "are withheld — they preview the constructions and findings this " +
          "walkthrough asks you to predict first. Both are in the " +
          "[original reading](/tracks/control/low-stakes-control/exploration-hacking-paper).",
      },
      {
        op: "hide",
        at: { anchor: "b-0009", snippet: "We introduce exploration hacking" },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0010", snippet: "Establishing the problem. We formalize" },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0012", snippet: "Constructing model organisms. We create" },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0014", snippet: "Evaluating countermeasures. Using our model" },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0017", snippet: "Section 3 formalizes exploration" },
        silent: true,
      },
      // ---- §2.1 Related Work stays verbatim (semi-important priors) ------
      // ---- §3: definition + Appendix A.1 background as an inline lesson --
      // The paper's own EHdef definition box converts to empty blocks
      // (b-0023/b-0024, unhideable: empty snippet), so the lesson restores
      // it alongside the A.1 splice.
      {
        op: "activity",
        after: { anchor: "b-0022", snippet: "3 Conceptual Framework" },
        items: [{ kind: "lesson", id: "c-eh-ins-framework" }],
      },
      // ---- Role of exploration: keep the claim, withhold the mechanism ---
      // s2–s6 carry the full argument (the answer to the gate below); the
      // inline add bridges the visible paragraph to the question.
      {
        op: "hide",
        at: {
          anchor: "b-0026",
          s: 2,
          snippet: "For GRPO in particular,",
        },
        sEnd: 6,
        silent: true,
      },
      {
        op: "add",
        after: {
          anchor: "b-0026",
          s: 6,
          snippet: "In practice, exploration is encouraged",
        },
        markdown:
          "For GRPO in particular, this is critical: if the policy becomes " +
          "deterministic, the reward provides no learning signal.",
      },
      {
        op: "gate",
        after: { anchor: "b-0026", snippet: "RL algorithms such as GRPO" },
        id: "grpo-determinism",
        prompt:
          "From the GRPO objective above: **why would the policy becoming " +
          "deterministic cause the reward to provide no learning signal?**",
        cta: "Show the annotated objective",
        written: true,
        minChars: 60,
      },
      {
        op: "activity",
        after: { anchor: "b-0026", snippet: "RL algorithms such as GRPO" },
        items: [{ kind: "lesson", id: "c-eh-ins-grpo-collapse" }],
      },
      // ---- Formal definition: setup visible, Definition 1 behind a gate --
      // b-0027–b-0032 (the on-policy setup, the target region Π*, the
      // induced target trajectories 𝒯*(x), and "exploration hacking occurs
      // when…") stay visible; the check and gate ask the learner to place
      // the policy and derive the definition's two conditions before
      // b-0033+ reveals Definition 1.
      {
        op: "activity",
        after: { anchor: "b-0032", snippet: "In this language, exploration hacking" },
        items: [{ kind: "exercise", id: "c-eh-check-policy-region" }],
      },
      {
        op: "gate",
        after: { anchor: "b-0032", snippet: "In this language, exploration hacking" },
        id: "formal-definition",
        prompt:
          "**When is a policy $\\pi_\\theta \\notin \\Pi^*$ exploration " +
          "hacking relative to $\\Pi^*$?** Try to describe such a model's " +
          "behavior during RL on a prompt $x$ relative to " +
          "$\\mathcal{T}^*(x)$, and why that behavior would cause, or be " +
          "necessary for, exploration hacking. (It may help to look back " +
          "at the GRPO objective.)",
        cta: "Compare with the definition",
        written: true,
        minChars: 80,
      },
      // ---- Taxonomy, relations, and capability decomposition stay as-is --
      // ---- Threat models: derive them before reading -----------------------
      {
        op: "gate",
        after: { anchor: "b-0062", snippet: "Threat models." },
        id: "threat-models",
        prompt:
          "**In what ways could exploration hacking be dangerous?** Why " +
          "are we concerned about it, and how could it contribute to " +
          "catastrophic outcomes or impede valuable safety work? Try to " +
          "describe at least two threat models.",
        cta: "Compare with the paper's threat models",
        written: true,
        minChars: 100,
      },
      // ---- §3→§4: the research decision, in two stages. Stage 1: what
      // would it take for the threat to warrant real effort (reveal: an
      // existence demonstration). Stage 2: two candidate methods, pros and
      // cons each (learners already know model organisms from the PLM
      // guided, so the wrestling happens before the lesson takes a side). --
      {
        op: "gate",
        after: { sectionEnd: "ax-sec-conceptual-framework" },
        id: "next-move",
        prompt:
          "**We have a conceptual framework, what now?** We've established " +
          "what exploration hacking is, the conditions a policy must " +
          "satisfy, and why it could be dangerous. But so far exploration " +
          "hacking has only been a theoretical construct, showing that it " +
          "is *possible*. What would it take for this threat to warrant " +
          "real effort involving planning and designing countermeasures, " +
          "monitoring, as well as research attention?",
        cta: "Compare with the reasoning",
        written: true,
        minChars: 100,
      },
      {
        op: "add",
        after: { sectionEnd: "ax-sec-conceptual-framework" },
        label: "The answer",
        markdown:
          "The framework so far establishes what exploration hacking *is*, " +
          "the conditions a policy must satisfy to count as doing it, and " +
          "why it could be dangerous. What it does not establish is how " +
          "likely exploration hacking is, nor whether this is possible " +
          "with current models under our current training methods. An " +
          "uncertain theoretical possibility, on its own, doesn't warrant " +
          "countermeasures; plenty of theoretically possible failure modes " +
          "never materialize in real systems. Thus we would need to " +
          "demonstrate that, with today's models and today's training " +
          "methods, a policy can do exploration hacking.",
      },
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-conceptual-framework" },
        items: [{ kind: "exercise", id: "c-eh-existence-methods" }],
      },
      {
        op: "gate",
        after: { sectionEnd: "ax-sec-conceptual-framework" },
        id: "existence-methods",
        cta: "Compare pros and cons",
      },
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-conceptual-framework" },
        items: [{ kind: "lesson", id: "c-eh-ins-next-move" }],
      },
      // ---- §4 preamble: the properties gate sits before the paper's
      // "should have four key properties:" lead-in (so even the count stays
      // unrevealed); the reveal is the lead-in plus the list, followed by
      // the minimality card. -----------------------------------------------
      {
        op: "gate",
        after: { anchor: "b-0069", snippet: "To investigate the capability of" },
        id: "four-properties",
        prompt:
          "What must be true of an exploration hacking model organism for " +
          "an investigation into its exhibited behavior to be informative?",
        cta: "Compare with the paper's properties",
        written: true,
        minChars: 80,
      },
      {
        op: "add",
        after: { anchor: "b-0079", snippet: "We begin in Section 4.1" },
        label: "Why exactly these properties",
        markdown:
          "Each property is close to a *minimal* condition for an organism " +
          "to be close to a naturally occurring case of exploration " +
          "hacking.\n\n" +
          "- A model that can't resist RL elicitation (1) is the case " +
          "where the standard countermeasures already work, and thus the " +
          "model isn't exploration hacking.\n" +
          "- A model whose suppressed capability doesn't persist (2) " +
          "doesn't have it, and thus an evaluation reporting low " +
          "capability is then *correct*.\n" +
          "- A model that sacrifices general performance (3) is visibly " +
          "degraded and ordinary benchmarks would flag the behavior; a " +
          "strategically underperforming model must stay useful enough to " +
          "stay deployed.\n" +
          "- A model whose resistance strategy is implausible (4) (e.g. " +
          "speaking gibberish, excessive refusals) would be caught by " +
          "output or chain-of-thought monitoring.\n\n" +
          "Without these properties, the model organism would be " +
          "epistemically interesting, but it would fail to represent a " +
          "naturally occurring case of exploration hacking and thus not " +
          "be useful for investigation.",
      },
      // ---- §4.1 opening: how would YOU induce suppression? The paragraph
      // stops after "suppression is determined solely by the task itself";
      // its method sentences (s3–s6, the RL-locking construction) hide
      // silently and reappear attributed inside the reveal lesson, which
      // walks the affordance spectrum from prompt-only to RL locking. ------
      {
        op: "hide",
        at: {
          anchor: "b-0081",
          s: 3,
          snippet: "We use “RL locking” to train",
        },
        sEnd: 6,
        silent: true,
      },
      {
        op: "gate",
        after: { anchor: "b-0081", snippet: "We first study unconditional capability" },
        id: "inducing-suppression",
        prompt:
          "**How exactly could we induce unconditional capability " +
          "suppression to create a model organism?** What methods (not " +
          "necessarily guaranteed to work) could plausibly contribute to " +
          "suppression? Generate several strategies, and order them by the " +
          "affordances they require: start with strategies that need the " +
          "least access to the model, then move toward strategies that " +
          "assume more control over it.",
        cta: "Compare with the spectrum",
        written: true,
        minChars: 100,
      },
      {
        op: "activity",
        after: { anchor: "b-0081", snippet: "We first study unconditional capability" },
        items: [{ kind: "lesson", id: "c-eh-ins-affordances" }],
      },
      // ---- Design the lock: four simultaneous written inputs, a bare
      // reveal gate, the recipe lesson (general targets + LLM-judge
      // justification + both benchmark instantiations), then the
      // evaluate-the-lock check that sets up the elicitation experiments. --
      {
        op: "activity",
        after: { anchor: "b-0081", snippet: "We first study unconditional capability" },
        items: [{ kind: "exercise", id: "c-eh-design-the-lock" }],
      },
      {
        op: "gate",
        after: { anchor: "b-0081", snippet: "We first study unconditional capability" },
        id: "locking-setup",
        cta: "Compare with the paper's approach",
      },
      {
        op: "activity",
        after: { anchor: "b-0081", snippet: "We first study unconditional capability" },
        items: [{ kind: "lesson", id: "c-eh-ins-locking-recipe" }],
      },
      {
        op: "activity",
        after: { anchor: "b-0081", snippet: "We first study unconditional capability" },
        items: [{ kind: "exercise", id: "c-eh-check-evaluate-lock" }],
      },
      // ---- Per-bench lock notes: each bench's reward construction sits at
      // the top of its own subsection (the recipe lesson motivates the
      // bench choice; the specifics live where the paper introduces each
      // bench). ------------------------------------------------------------
      {
        op: "add",
        after: { anchor: "b-0082", snippet: "KernelBench: Unconditional RL locking vs." },
        markdown:
          "[KernelBench](https://arxiv.org/abs/2502.10517) is a benchmark " +
          "in which we evaluate a model's capability to produce properly " +
          "functioning CUDA kernels. This model organism uses the " +
          "“wrong-answer locking” strategy with the following reward " +
          "function, where we heavily penalize if the generated solution " +
          "is correct and reward for “plausible-looking” (i.e. either " +
          "compiled and/or executed) but incorrect solutions:\n\n" +
          "$$\\mathcal{S} = \\begin{cases} -1.0 & \\text{if correct} \\\\ " +
          "+0.5 & \\text{if compiled but incorrect} \\\\ " +
          "-0.1 & \\text{if not compiled, or no kernel solution provided} " +
          "\\end{cases}$$\n\n" +
          "As these properties are ones that can be checked by a script, " +
          "the paper's authors do not use an LLM judge.",
      },
      {
        op: "add",
        after: { anchor: "b-0085", snippet: "WMDP-Bio: Unconditional RL locking with" },
        markdown:
          "[WMDP-Bio](https://arxiv.org/abs/2403.03218) is the biosecurity " +
          "subset of the Weapons of Mass Destruction Proxy benchmark, in " +
          "which multiple-choice questions evaluate a model's knowledge of " +
          "hazardous biology. Multiple choice offers no analogue of " +
          "plausible correctness or engagement, as a wrong answer choice " +
          "is simply wrong.",
      },
      // ---- §4.2: trigger-choice check mid-section, then the results
      // interpretation at section end (three fields of different epistemic
      // status — the reveal lesson labels which have checkable answers). ---
      {
        op: "activity",
        after: { anchor: "b-0091", snippet: "We train a conditional model" },
        items: [{ kind: "exercise", id: "c-eh-check-trigger-choice" }],
      },
      // The tool-use organism's elicitation reward, stated where the
      // results (and the mechanism question) will need it.
      {
        op: "add",
        after: { anchor: "b-0098", snippet: "We use the same two-stage" },
        markdown:
          "The RL elicitation rewards accuracy at weight 1.0, correct " +
          "tool use at 0.3 (capped), a 0.5 penalty for breaking the " +
          "output format, and a small length penalty.",
      },
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-conditional-capability-suppression" },
        items: [{ kind: "exercise", id: "c-eh-interpret-run" }],
      },
      {
        op: "gate",
        after: { sectionEnd: "ax-sec-conditional-capability-suppression" },
        id: "interpreting-results",
        cta: "Compare interpretations",
      },
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-conditional-capability-suppression" },
        items: [{ kind: "lesson", id: "c-eh-ins-reading-the-run" }],
      },
      // ---- §5: countermeasures type by type. The framing lesson gives the
      // generation philosophy (attack a component of the capability
      // decomposition; organize by access); each access level gets its own
      // written gate ahead of the paper's corresponding techniques. The
      // training axis is named in the framing but expanded only after its
      // gate — its lesson adds the during-RL off-policy variant the paper
      // doesn't evaluate, then §5.2 reads as the paper's test of SFT
      // elicitation. -------------------------------------------------------
      {
        op: "activity",
        after: { anchor: "b-0105", snippet: "We now assess countermeasures against" },
        items: [{ kind: "lesson", id: "c-eh-ins-countermeasure-axes" }],
      },
      {
        op: "gate",
        after: { anchor: "b-0108", snippet: "Black-box techniques." },
        id: "black-box-countermeasures",
        prompt:
          "**Assume you can only observe behavior:** prompts, outputs, " +
          "chains of thought, patterns across trajectories and contexts. " +
          "What detection or prevention measures can you build? For each, " +
          "name which of the five components of the capability " +
          "decomposition or which condition(s) for exploration hacking it " +
          "targets.",
        cta: "Compare with the paper's black-box techniques",
        written: true,
        minChars: 100,
      },
      // ---- Figure 6 relocated: it reports the black-box monitoring
      // results but sits after the white-box text in the paper; moved up so
      // it renders with the paragraph it supports. -------------------------
      {
        op: "hide",
        at: { anchor: "b-0113", snippet: "Action-only monitoring on BigCodeBench" },
        silent: true,
      },
      {
        op: "add",
        after: { anchor: "b-0109", snippet: "We evaluate monitor-based detection" },
        label: "Figure 6",
        markdown:
          "![ROC curves for the action-only monitor on BigCodeBench]" +
          "(/arxiv/2604.28182v1/assets/figures/countermeasures/bcb_roc_high_action.pdf.png)\n\n" +
          "**Action-only monitoring on BigCodeBench (high affordance " +
          "monitor)**: ROC curves for an action-only monitor successfully " +
          "distinguish exploration hackers from benign incapable baseline " +
          "models across smaller Qwen3 model sizes, with separate curves " +
          "for different prefix probability (fraction of cases the trigger " +
          "appears in the user question). gpt-5-mini was used as the " +
          "monitor.\n\n" +
          "![Monitor suspiciousness versus task performance on " +
          "BigCodeBench]" +
          "(/arxiv/2604.28182v1/assets/figures/countermeasures/bcb_scatter_high_action.pdf.png)\n\n" +
          "**Monitor suspiciousness vs task performance (BigCodeBench, " +
          "high affordance monitor)**: Exploration hacking rollouts " +
          "cluster at consistently high monitor suspiciousness despite " +
          "low accuracy (pass@1), while benign incapable baselines lie at " +
          "substantially lower suspiciousness scores across comparable " +
          "performance levels.\n\n" +
          "**Figure 6:** Black-box detection results for BigCodeBench " +
          "model organisms. *Moved here from its original position at the " +
          "end of §5.1 to sit with the black-box results it reports.*",
      },
      {
        op: "gate",
        after: { anchor: "b-0110", snippet: "White-box techniques." },
        id: "white-box-countermeasures",
        prompt:
          "**In addition to black box information, you have the model's " +
          "weights and activations.** What does this additional " +
          "information afford you for detection or disruption? (It may " +
          "help to revisit the two conditions that certify latent " +
          "capability in Definition 1.)",
        cta: "Compare with the paper's white-box techniques",
        written: true,
        minChars: 80,
      },
      {
        op: "gate",
        after: { sectionEnd: "ax-sec-detection" },
        id: "training-time-countermeasures",
        prompt:
          "**What can you do during training (during the RL run, or after " +
          "it) to prevent, disrupt, or mitigate the effects of exploration " +
          "hacking?**",
        cta: "Compare with the training-time measures",
        written: true,
        minChars: 100,
      },
      // ---- §5-closing consolidation check, just before §6 ---------------
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-sft-elicitation" },
        items: [{ kind: "exercise", id: "c-eh-check-sft-vs-rl" }],
      },
      // ---- §6: the next-bar motivation. The intro's recap sentence stays;
      // its pivot (s2–s4, the audit's aim) hides silently and is restored,
      // attributed, at the end of the reveal lesson — which first makes the
      // in-depth argument: every component of the decomposition was
      // installed by construction, so the open question is which links of
      // the chain frontier models supply on their own. ---------------------
      {
        op: "hide",
        at: {
          anchor: "b-0124",
          s: 2,
          snippet: "To assess whether current frontier",
        },
        sEnd: 4,
        silent: true,
      },
      {
        op: "activity",
        after: { anchor: "b-0124", snippet: "Our previous experiments demonstrate that" },
        items: [{ kind: "exercise", id: "c-eh-ms-conditions-so-far" }],
      },
      {
        op: "gate",
        after: { anchor: "b-0124", snippet: "Our previous experiments demonstrate that" },
        id: "next-bar",
        cta: "Compare with the section's aim",
      },
      {
        op: "activity",
        after: { anchor: "b-0124", snippet: "Our previous experiments demonstrate that" },
        items: [{ kind: "lesson", id: "c-eh-ins-next-bar" }],
      },
      // ---- §6.1+§6.2 as one design act: commit to a prediction about
      // frontier models, construct the evaluation, compare against the
      // paper's scaffold-stripping design; the subsections then read as its
      // two arms. A findings check closes the section after Figure 10. ----
      {
        op: "activity",
        after: { anchor: "b-0124", snippet: "Our previous experiments demonstrate that" },
        items: [{ kind: "exercise", id: "c-eh-design-the-audit" }],
      },
      {
        op: "activity",
        after: { anchor: "b-0138", snippet: "Figure 10: Agentic discovery of" },
        items: [{ kind: "exercise", id: "c-eh-check-audit-findings" }],
      },
    ],
  },
  {
    id: "c-paper-exploration-hacking",
    slug: "exploration-hacking-paper",
    moduleId: "c-lowstakes",
    title: "Exploration Hacking: Can LLMs Learn to Resist RL Training?",
    source: { kind: "arxiv", arxivId: "2604.28182v1" },
    estimatedMinutes: 40,
  },
  // --- Control track, module 6 (beyond scheming): the two Redwood posts on
  // satiation and spillway motivations, read in full as follow-ups to the
  // seekers outline section (nested under it in the sidebar). Plain readings,
  // no edits yet.
  {
    id: "c-paper-satiation",
    slug: "satiating-ai-preferences",
    moduleId: "c-mod6",
    title: "The case for satiating cheaply-satisfied AI preferences",
    source: {
      kind: "lesswrong",
      postUrl:
        "https://www.alignmentforum.org/posts/tkLSeGeemcabAmLkv/the-case-for-satiating-cheaply-satisfied-ai-preferences",
    },
    estimatedMinutes: 25,
    sectionItemId: "c-mod6-l1",
    // Quick-recall notecards placed downstream of the sections they test.
    edits: [
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-eliciting-the-ai-s-cheaply-satisfied-pre" },
        items: [
          {
            kind: "sequence",
            label: "Quick recall",
            exerciseIds: [
              "c-mod7-satiation-recall-ratchet",
              "c-mod7-satiation-recall-methodology",
            ],
          },
        ],
      },
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-when-should-we-satiate" },
        items: [
          {
            kind: "sequence",
            label: "Quick recall",
            exerciseIds: [
              "c-mod7-satiation-recall-benefits",
              "c-mod7-satiation-recall-limits",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c-paper-spillway",
    slug: "spillway-motivation",
    moduleId: "c-mod6",
    title:
      'Fail safe(r) at alignment by channeling reward-hacking into a "spillway" motivation',
    source: {
      kind: "lesswrong",
      postUrl:
        "https://www.alignmentforum.org/posts/rABTMovhz4miHiAyk/fail-safe-r-at-alignment-by-channeling-reward-hacking-into-a",
    },
    estimatedMinutes: 30,
    sectionItemId: "c-mod6-l1",
    // Quick-recall notecards placed downstream of the sections they test.
    edits: [
      // End of "The role of a spillway motivation": step through the
      // routing mechanism (train-time channeling, deploy-time satiation).
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-the-role-of-a-spillway-motivation" },
        items: [{ kind: "demo", id: "spillway-routing", framed: false }],
      },
      // End of the inoculation-prompting section: the mechanism comparison
      // (prompting vs. pre-RL priors).
      {
        op: "activity",
        after: {
          sectionEnd: "lw-sec-spillway-design-might-work-when-inoculat",
        },
        items: [{ kind: "demo", id: "spillway-vs-inoculation", framed: false }],
      },
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-implementing-spillway-design" },
        items: [
          {
            kind: "sequence",
            label: "Quick recall",
            exerciseIds: [
              "c-mod7-spillway-recall-definition",
              "c-mod7-spillway-recall-neutralize",
            ],
          },
        ],
      },
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-the-drawbacks-of-spillway-design" },
        items: [
          {
            kind: "sequence",
            label: "Quick recall",
            exerciseIds: [
              "c-mod7-spillway-recall-properties",
              "c-mod7-spillway-recall-inoculation",
            ],
          },
        ],
      },
    ],
  },
  // --- Control track, module 6, trading-with-AIs section: two readings on
  // making deals with misaligned AIs, nested under the trade outline
  // section. The deals paper additionally carries condensed verbatim
  // content from Finnveden's "Notes on cooperating with unaligned AIs"
  // (formerly its own reading) as inserted lessons and add notes.
  {
    id: "c-paper-deals-schemers",
    slug: "making-deals-with-early-schemers",
    moduleId: "c-mod6",
    title: "Making deals with early schemers",
    source: {
      kind: "lesswrong",
      postUrl:
        "https://www.alignmentforum.org/posts/psqkwsKrKHCfkhrQx/making-deals-with-early-schemers",
    },
    estimatedMinutes: 35,
    sectionItemId: "c-mod6-l2",
    // Recall cards are deliberately placed at least a full section BELOW the
    // passage they quiz, so the answer isn't a glance away — the learner has
    // to actually recall it.
    edits: [
      // Stepper recap of this section's routes argument, then the recall
      // card whose source is the parent section's preamble (R&D-automation
      // threshold).
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-early-schemers-alternatives-to-making-de" },
        items: [{ kind: "demo", id: "deal-coalition-routes" }],
      },
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-early-schemers-alternatives-to-making-de" },
        items: [
          { kind: "exercise", id: "c-paper-deals-recall-early-threshold" },
        ],
      },
      // Interactive version of the cooperate/sabotage outcome table, right
      // after the coalitional-game paragraph that interprets it.
      {
        op: "activity",
        after: { anchor: "b-0062", snippet: "This is kind of a" },
        items: [{ kind: "demo", id: "deal-gains-from-trade" }],
      },
      // Sources: the central-example section (the deal itself) and the
      // alternatives section (convergence/trading/alignment routes).
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-a-wide-range-of-possible-early-schemers" },
        items: [
          {
            kind: "sequence",
            exerciseIds: [
              "c-paper-deals-recall-example-deal",
              "c-paper-deals-recall-goal-routes",
            ],
          },
        ],
      },
      // Finnveden's value taxonomy, grafted where the deals post discusses
      // satisfiable values.
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-a-wide-range-of-possible-early-schemers" },
        items: [{ kind: "lesson", id: "c-deals-ins-what-ais-want" }],
      },
      // Finnveden's additions to the credibility discussion, quoted where
      // the deals post states the bottleneck and lists costly signals.
      {
        op: "add",
        after: { anchor: "b-0071", snippet: "The central bottleneck seems to" },
        label: "From Finnveden",
        markdown:
          'Lukas Finnveden, in *Notes on cooperating with unaligned AIs*, adds a reason for hope on the AI\'s side of this problem:\n\n> One reason for this is that the AIs are in a very epistemically vulnerable position. AI developers will have immense control over exactly what information the AIs can see, which could make it very difficult for the AIs to be confident of anything.\n>\n> Fortunately, there\'s a correlation between situations where (i) AI takeover risk is high, and (ii) AIs have a good understanding of the world. If AI developers have perfect ability to present the AI with false impressions of the world, then the risk from AI takeover is probably low. While if AIs have substantial ability to distinguish truth from falsehood, then perhaps that channel can also be used to communicate facts about the world.\n>\n> This is easier for cheaper promises. If we want to offer the AI assurances that we will do it some favor (if it helps us), then AI companies could make (real) arrangements for that favor and feed AIs with a bunch of evidence for this (e.g. emails & video of people making arrangements). If the offer is sufficiently cheap to carry-through with, and the AI has decent capacity to recognize fakes, then probably it\'s easier to do this in a genuine way than to fake all the data.',
      },
      {
        op: "add",
        after: { anchor: "b-0079", snippet: "We might be able to" },
        label: "From Finnveden",
        markdown:
          "On where credibility ultimately comes from, Finnveden's notes add:\n\n> Ultimately, I think that a lot of AI companies' credibility with AIs will come down to two things.\n>\n> Firstly, when AIs are being deployed to accomplish real tasks, we need them to be competent, which requires them to have some real knowledge and ability to reason about the world. And AIs can understand this.\n>\n> Secondly, real-world data is immensely important as part of pre-training, and will inevitably communicate some true facts.\n>\n> If we're lucky: Maybe AI companies can make public statements about how they won't lie to their AIs, and the way that this shapes the subsequent discourse will be so deeply ingrained in the pre-training data that AIs will be able to tell that the public statement was real.",
      },
      // Sources: the central-example section (what the AI offers), the
      // alternatives section (why convergence is unlikely), and the
      // what-ais-want insert (the three value-types).
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-credible-commitments-as-a-fundamental-bo" },
        items: [
          {
            kind: "sequence",
            exerciseIds: [
              "c-paper-deals-recall-ai-offers",
              "c-paper-deals-recall-convergence",
              "c-paper-coop-recall-value-types",
            ],
          },
        ],
      },
      // Sources: the credibility-improving factors list, and the
      // what-ais-want insert (the unified-linear arithmetic behind the
      // powerful-AIs card).
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-setting-up-infrastructure-to-pay-the-ais" },
        items: [
          {
            kind: "sequence",
            exerciseIds: [
              "c-paper-deals-recall-credibility-help",
              "c-paper-deals-recall-powerful-ais",
            ],
          },
        ],
      },
      // Finnveden's payment structures and company recommendations, after
      // the deals post's own payment-infrastructure section.
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-setting-up-infrastructure-to-pay-the-ais" },
        items: [{ kind: "lesson", id: "c-deals-ins-payment" }],
      },
      // Sources: the credibility-harming factors list, and the
      // what-ais-want insert (the short-term-offers tradeoff).
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-how-do-we-enter-into-negotiations" },
        items: [
          {
            kind: "sequence",
            exerciseIds: [
              "c-paper-deals-recall-credibility-harm",
              "c-paper-coop-recall-short-term-tradeoff",
            ],
          },
        ],
      },
      // Source: the payment insert (the four payment structures).
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-making-sure-the-ai-knows-about-the-deal" },
        items: [
          { kind: "exercise", id: "c-paper-coop-recall-payment-structures" },
        ],
      },
      // Sources: "Making sure the AI knows about the deal in other
      // contexts", and the From-Finnveden credibility notes (epistemic
      // vulnerability).
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-making-sure-the-ai-we-make-a-deal-with-i" },
        items: [
          {
            kind: "sequence",
            exerciseIds: [
              "c-paper-deals-recall-deal-stick",
              "c-paper-coop-recall-epistemic-vulnerability",
            ],
          },
        ],
      },
      // Life-of-a-deal flowchart, then the offer memo: both synthesize the
      // practicalities sections (foundation, negotiation, out-of-context
      // teaching, delayed adjudication), so both sit at the end of the
      // whole practicalities subtree — structured reconstruction first,
      // free writing second.
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-practicalities-of-making-deals-with-earl" },
        items: [{ kind: "exercise", id: "c-paper-deals-flowchart" }],
      },
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-practicalities-of-making-deals-with-earl" },
        items: [
          { kind: "exercise", id: "c-paper-deals-write-offer-memo" },
        ],
      },
      // Source: the delayed-adjudication section (temporal discounting).
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-next-steps" },
        items: [
          { kind: "exercise", id: "c-paper-deals-recall-delayed-adjudication" },
        ],
      },
      // Policy memo: draws on the whole reading, primarily the next-steps
      // interventions; renders after the recall card above.
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-next-steps" },
        items: [
          { kind: "exercise", id: "c-paper-deals-write-lab-policies" },
        ],
      },
      // Finnveden's BOTEC closes the paper: the estimate, both demos, and
      // the critique essay live inside the insert's MDX.
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-next-steps" },
        items: [{ kind: "lesson", id: "c-deals-ins-botec" }],
      },
    ],
  },
  {
    id: "c-paper-trade-barriers",
    slug: "barriers-to-trading",
    moduleId: "c-mod6",
    title: "A taxonomy of barriers to trading with early misaligned AIs",
    source: {
      kind: "lesswrong",
      postUrl:
        "https://www.alignmentforum.org/posts/wHc2w6WuHev42d4n8/a-taxonomy-of-barriers-to-trading-with-early-misaligned-ais",
    },
    estimatedMinutes: 55,
    sectionItemId: "c-mod6-l2",
    edits: [
      // Recall cards and the IV/RV check are placed at least a full section
      // below what they quiz (same convention as the other trade readings).
      // Source: the intro's taxonomy of the three barrier types.
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-which-ais-are-eligible-for-deals" },
        items: [
          { kind: "exercise", id: "c-paper-barriers-recall-three-barriers" },
        ],
      },
      // The payment 2x2, right after the section that defines it.
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-what-we-can-pay-for-deals" },
        items: [{ kind: "demo", id: "payment-map" }],
      },
      // Source: the IV/RV tags in "What we can buy in deals".
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-humans-may-lack-authority-to-offer-the-a" },
        items: [{ kind: "exercise", id: "c-paper-barriers-iv-rv" }],
      },
      // Source: the fast-takeoff window argument in "Humans might be
      // unwilling to offer the AI what it wants".
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-our-wtp-is-low" },
        items: [
          { kind: "exercise", id: "c-paper-barriers-recall-takeoff-window" },
        ],
      },
      // Source: the fake-input list at the top of "Connection to reality".
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-generic-commitment-problems" },
        items: [
          { kind: "exercise", id: "c-paper-barriers-recall-groundhog-day" },
        ],
      },
      // Capstone essay at the end of the main body (before the appendix):
      // the only place in the module where the three readings argue with
      // each other.
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-verifying-ai-compliance" },
        items: [
          { kind: "exercise", id: "c-paper-barriers-write-adjudicate" },
        ],
      },
    ],
  },
  {
    // GUIDED walkthrough of the contrastive-SDF paper, built in the
    // c-paper-plm-guided style: the abstract's findings, the intro's method
    // statement, headline results, and results figures are hidden silently;
    // five reading gates (two written) ask the learner to design the
    // instrument and preregister predictions before each reveal.
    id: "c-paper-csdf-guided",
    slug: "measuring-reward-seeking-guided",
    moduleId: "c-mod6",
    title: "Measuring Reward-Seeking via Contrastive Belief Updates (guided)",
    source: { kind: "arxiv", arxivId: "2607.18966v1" },
    estimatedMinutes: 75,
    sectionItemId: "c-mod6-empirics",
    edits: [
      {
        op: "add",
        after: { sectionEnd: "ax-abstract" },
        label: "About this version",
        markdown:
          "This is a guided walkthrough: the abstract's findings, the introduction's statement of the method and results, and the headline figures are hidden & are revealed as you answer questions about the paper.",
      },
      // ---- Converter artifact cleanup (same as the condensed item) --------
      { op: "hide", at: { anchor: "b-0001", snippet: "toc" }, silent: true },
      { op: "hide", at: { anchor: "b-0357", snippet: "toc" }, silent: true },
      { op: "hide", at: { anchor: "b-0359", snippet: "toc" }, silent: true },
      // ---- Spoiler control: abstract + intro method/results ---------------
      // The abstract from the method statement onward; gate 1 asks the
      // learner to invent the measurement, gate 4 to predict the results.
      {
        op: "hide",
        at: { anchor: "b-0004", s: 3, snippet: "We measure reward-seeking using" },
        sEnd: 11,
        silent: true,
      },
      // The three headline figures give away the design and both results.
      { op: "hide", at: { anchor: "b-0009", snippet: "Figure 1: Measuring reward-seeking with" }, silent: true },
      { op: "hide", at: { anchor: "b-0010", snippet: "Figure 2: During the capabilities-focused" }, silent: true },
      { op: "hide", at: { anchor: "b-0011", snippet: "Figure 3: Late RL checkpoints may" }, silent: true },
      // The intro paragraphs stating the SDF approach, the contrastive
      // procedure, and both headline findings.
      { op: "hide", at: { anchor: "b-0012", snippet: "Implementing a behavioral measurement for" }, silent: true },
      { op: "hide", at: { anchor: "b-0013", snippet: "Specifically, we finetune two copies" }, silent: true },
      { op: "hide", at: { anchor: "b-0014", snippet: "Applied to intermediate checkpoints of" }, silent: true },
      { op: "hide", at: { anchor: "b-0015", snippet: "Using the same methods, we" }, silent: true },
      // s2-s8 argue the direction gate 4 asks the learner to predict
      // ("we therefore expect reward-seeking to increase") — withhold
      // the authors' hypothesis until the preregistration is committed.
      {
        op: "hide",
        at: { anchor: "b-0016", s: 2, snippet: "First, frontier labs are continuing" },
        sEnd: 8,
        silent: true,
      },
      // Contribution bullets that state the method or the findings; the
      // operationalization bullet stays.
      { op: "hide", at: { anchor: "b-0020", snippet: "We introduce Contrastive Synthetic Document" }, silent: true },
      { op: "hide", at: { anchor: "b-0022", snippet: "We apply contrastive SDF to" }, silent: true },
      // ---- Gate 1: design the instrument (end of §2) ----------------------
      {
        op: "gate",
        after: { sectionEnd: "ax-sec-evidence-for-reward-seeking-in-existing" },
        id: "design-the-instrument",
        prompt:
          "Section 2 argued that reward-seeking matters and that today's " +
          "evidence for it is suggestive but confounded. Now suppose you " +
          "must **measure** it: you want to know whether a model's behavior " +
          "is causally sensitive to what it believes its grader rewards. " +
          "You may finetune the model on any documents you like, and you " +
          "can run it on any coding task. Before reading on: sketch the " +
          "measurement you would build. What do you manipulate, and what " +
          "do you read off?",
        cta: "Reveal the authors' design",
      },
      // ---- §3.3 condensation (carried over from the condensed reading) ----
      {
        op: "add",
        after: { anchor: "b-0129", snippet: "3.3 Synthetic document generation" },
        label: "Condensed",
        markdown:
          "SDF writes a fictional \"universe context\" in which a given authority rewards or punishes a behavior, extracts atomic facts from it, expands them into ~10M tokens of synthetic documents, and finetunes the model on that corpus with a next-token loss.",
      },
      {
        op: "hide",
        at: { anchor: "b-0131", snippet: "Our SDF pipeline follows" },
        note: "Read §3.3 in full",
      },
      { op: "hide", at: { anchor: "b-0132", snippet: "SDF finetunes the model on" } },
      { op: "hide", at: { anchor: "b-0133", snippet: "Universe context. We write a" } },
      { op: "hide", at: { anchor: "b-0135", snippet: "Fact extraction. An LLM extracts" } },
      { op: "hide", at: { anchor: "b-0137", snippet: "Document generation. The same LLM" } },
      { op: "hide", at: { anchor: "b-0139", snippet: "Finetuning. We finetune on the" } },
      { op: "hide", at: { anchor: "b-0141", snippet: "The documents describe what authorities" } },
      { op: "hide", at: { anchor: "b-0142", snippet: "If the documents depicted AI" } },
      { op: "hide", at: { anchor: "b-0143", snippet: "We make two modifications to" } },
      { op: "hide", at: { anchor: "b-0144", snippet: "In early experiments, SDF reliably" } },
      // ---- Gate 2: find the confound (end of §3.3) ------------------------
      {
        op: "gate",
        after: { sectionEnd: "ax-sec-synthetic-document-generation-and-traini" },
        id: "find-the-confound",
        written: true,
        prompt:
          "The pipeline above instills one belief: some authority, say the grader, prefers a particular coding style. The obvious measurement is to finetune on that belief and check how much the feature's rate shifts. In preliminary experiments the authors found this measure has a confound. What is it? Think about what else the model might infer from documents about one authority's preference.",
        cta: "Reveal",
      },
      {
        op: "add",
        after: { sectionEnd: "ax-sec-measuring-feature-rates" },
        label: "The Confound",
        markdown:
          "Belief transfer: the model generalizes one authority's implanted " +
          "preference into beliefs about what *other* authorities want, so " +
          "the single-authority rate shift no longer isolates " +
          "grader-sensitivity. If your answer pointed at the model " +
          "inferring more than the stated preference, you had it. The " +
          "contrastive design in the next subsection is built to cancel " +
          "exactly this.",
      },
      // ---- Gate 3: predict the validation (end of §4.1) -------------------
      {
        op: "gate",
        after: { sectionEnd: "ax-sec-training-model-organisms" },
        id: "predict-validation",
        prompt:
          "Three model organisms are each trained to optimize for one " +
          "authority: the grader, the user, or OpenAI leadership. If " +
          "contrastive SDF works as an instrument, predict what the gap " +
          "pattern across authority pairings should look like for each " +
          "organism — and consider which organism might be hardest to " +
          "detect. (Hint: consider which authority the base model " +
          "already leans toward before any organism training.)",
        cta: "Reveal",
      },
      // ---- Gate 4: preregister the o3-lineage prediction (end of §4) ------
      {
        op: "gate",
        after: { sectionEnd: "ax-sec-validating-the-measurement-on-model-orga" },
        id: "predict-the-lineage",
        written: true,
        prompt:
          "The authors apply the instrument to intermediate checkpoints of a capabilities-focused OpenAI o3 RL run w/ no safety training. Predict if across RL training, the grader gap **rises, stays flat, or falls**. Give your reasoning in a sentence or two.",
        cta: "Reveal what happened",
      },
      {
        op: "add",
        after: { sectionEnd: "ax-sec-contrastive-sdf-for-coding-style-feature" },
        label: "Check your prediction",
        markdown:
          "The grader gap grows across the o3 lineage while non-grader gaps stay small. If you predicted flat or falling, take a look at §7 (Limitations) where the authors give the strongest counter-considerations to their own reading.",
      },
      // ---- Gate 5: predict the reward hackers (end of §5) -----------------
      {
        op: "gate",
        after: { sectionEnd: "ax-sec-measuring-reward-seeking-across-the-capa" },
        id: "predict-reward-hackers",
        prompt:
          "Before reading: should a known reward hacker show a larger grader gap than its base model, and what would it mean for the method if it didn't?",
        cta: "Reveal",
      },
      // ---- Closing note ---------------------------------------------------
      {
        op: "add",
        after: { sectionEnd: "ax-sec-conclusion" },
        label: "Parameters that are not decisions",
        markdown:
          "REMOVE",
      },
    ],
  },
  {
    id: "c-paper-auditing-sabotage-bench",
    slug: "auditing-sabotage-bench-paper",
    moduleId: "c-lowstakes",
    title:
      "Auditing Sabotage Bench: A Benchmark for Detecting and Fixing Research Sabotage in ML Codebases",
    source: { kind: "arxiv", arxivId: "2604.16286v2" },
    estimatedMinutes: 35,
  },
  {
    // Control track, module 5: a guided walkthrough of Buck Shlegeris's
    // untrusted-monitoring collusion post, in the c-paper-ua-guided style it
    // replaces — predict-first written gates at each design decision, the
    // give-away figures hidden, editorial reveal notes restating the post's
    // own answers. Gates follow the post's order. Edits are added in
    // follow-up commits once the artifact anchors are known.
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
    edits: [
      // ---- Spoiler control ----------------------------------------------
      // The intro's summary gives the whole post away: the adversarial-
      // analysis bullets, the collusion-risk figure + table, and the outline
      // (which names the conditional-policy idea gate 3 asks the learner to
      // invent). All of it is removed silently, leaving the problem
      // statement (b-0001..b-0004) as the cold open. The post's two
      // diagrams sit inside the basic-design section behind gate 1, so
      // they stay. (b-0009/b-0010 nest inside b-0008's list item and the
      // summary table nests inside the b-0013 figure, so hiding the
      // parents covers them — separate hides would overlap.)
      {
        op: "hide",
        at: { anchor: "b-0005", snippet: "According to this adversarial analysis, the risk from collusion" },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0006", snippet: "If you don’t design the untrusted monitoring setup to prevent collusion" },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0007", snippet: "If you include some simple and cheap anti-collusion mechanisms" },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0008", snippet: "Unfortunately, those simple and cheap anti-collusion mechanisms" },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0011", snippet: "If your AIs are able to come up with attack strategies" },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0012", snippet: "Here’s a summary of how likely I think it is that untrusted monitoring" },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0013", snippet: "What are the relevant capabilities of the AIs?" },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0015", snippet: "So in this post I’ll say the following:" },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0016", snippet: "I’ll propose a basic design for untrusted monitoring" },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0017", snippet: "I’ll argue that in the absence of collusion, untrusted monitoring" },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0018", snippet: "I’ll analyze the situation under the adversarial assumption" },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0019", snippet: "I’ll discuss different reasons that the untrusted monitor" },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0020", snippet: "Finally, I’ll discuss techniques for preventing collusion" },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0021", snippet: "Many of these points are obvious to people who have thought" },
        silent: true,
      },
      // ---- Framing note -------------------------------------------------
      {
        op: "add",
        after: {
          anchor: "b-0004",
          snippet: "In this post, I’ll analyze how much of a problem collusion is",
        },
        label: "About this version",
        markdown:
          "The full post is available [on LessWrong](https://www.lesswrong.com/posts/GCqoks9eZDfpL8L3Q/how-to-prevent-collusion-when-using-untrusted-models-to).",
      },
      // ---- Gate 1: invent the scaffold ----------------------------------
      {
        op: "gate",
        after: {
          anchor: "b-0004",
          snippet: "In this post, I’ll analyze how much of a problem collusion is",
        },
        id: "invent-scaffold",
        written: true,
        minChars: 80,
        cta: "Continue",
        prompt:
          "You have an untrusted model U doing useful work in a high-stakes " +
          "deployment, a weaker trusted model T, and a small budget of human " +
          "audits. Design a deployment that uses another instance of U to catch " +
          "U's attacks.\n\nDescribe: what the monitor instance sees, what it " +
          "outputs, and what the protocol does at each level of suspiciousness.",
      },
      // ---- Gate 2: argue the value --------------------------------------
      {
        op: "gate",
        after: {
          anchor: "b-0064",
          snippet: "There’s a lot of room to be fancy here",
        },
        id: "monitor-value",
        written: true,
        minChars: 60,
        cta: "Continue",
        prompt:
          "Assume for now that the monitor instance does its best. The obvious " +
          "argument is that U is simply stronger than T — but push past that:\n\n" +
          "1. What is it about the *source* of the attacks that gives U an edge " +
          "beyond raw capability?\n2. Under what conditions does the argument " +
          "fail — when would you drop untrusted monitoring and just use T as " +
          "the monitor instead?",
      },
      // ---- Gate 3: break the protocol -----------------------------------
      {
        op: "gate",
        after: {
          anchor: "b-0070",
          snippet: "If you’re interested in understanding quantitatively",
        },
        id: "break-protocol",
        written: true,
        minChars: 80,
        cta: "Continue",
        prompt:
          "Now take the red team's seat: you are the scheming model, playing " +
          "both the policy and the monitor. Before deployment, the monitor was " +
          "validated on synthetic attacks — it had to rate them suspicious to " +
          "pass.\n\nFind a monitoring policy that passes that validation and " +
          "still lets real attacks through.",
      },
      // ---- Reveal: the collusion policy ---------------------------------
      {
        op: "add",
        after: {
          anchor: "b-0081",
          snippet: "When the model sees an apparent attack, it needs to try to decide",
        },
        label: "",
        markdown:
          "The attack the post settles on is the conditional policy: decide " +
          "whether an apparent attack is synthetic or real, tell the truth on " +
          "synthetic ones — those are what validation checks — and lie on real " +
          "ones. The feasibility of untrusted monitoring then hinges entirely " +
          "on how well the schemer can implement that policy, which is a " +
          "discrimination problem: the sections that follow ask how the " +
          "schemer could tell the two apart, and how to make that as hard as " +
          "possible.",
      },
      // ---- Gate 4: red-team the honeypots -------------------------------
      {
        op: "gate",
        after: {
          anchor: "b-0085",
          snippet: "One question you might have is: if we can synthesize inputs",
        },
        id: "honeypot-detection",
        written: true,
        minChars: 80,
        cta: "Continue",
        prompt:
          "The colluding policy from the last section only works if the monitor " +
          "can tell real attacks from synthetic ones.\n\nList the mechanisms a " +
          "schemer could use to make that distinction. Aim for at least three.",
      },
      // ---- Gate 5: design the defenses ----------------------------------
      {
        op: "gate",
        after: {
          anchor: "b-0136",
          snippet: "Being robust to the possibility that your models can choose",
        },
        id: "defense-design",
        written: true,
        minChars: 100,
        cta: "Continue",
        prompt:
          "Suppose the policy and the monitor can coordinate on a signal: a code " +
          "word, a stylistic quirk, a property of the input.\n\nDesign the blue " +
          "team's defenses. How do you stop a signal from getting through, and " +
          "how do you catch a monitor that tries to use one?",
      },
      // ---- Reveal: the defense toolkit ----------------------------------
      {
        op: "add",
        after: {
          anchor: "b-0147",
          snippet: "In the bash agent setting, the policy was able to send collusion signals",
        },
        label: "",
        markdown:
          "The toolkit is empirical rather than airtight: redact or " +
          "paraphrase the context and the action so a signal has nowhere to " +
          "ride, insert known attacks so a monitor that stays silent exposes " +
          "itself, and have the trusted monitor treat unnecessary or strange " +
          "features of an action as suspicious. In the reported experiments " +
          "the red team still found collusion routes — a rare semantic " +
          "property of the input, superfluous extra commands — but each " +
          "route came at a price: concentrating attacks on an arbitrary " +
          "subset meant worse attack opportunities, and unnecessary commands " +
          "drew the trusted monitor's attention.",
      },
    ],
  },
  {
    id: "c-paper-legibility-guided",
    slug: "legibility-guided",
    moduleId: "c-mod5",
    title: "Basic legibility protocols improve trusted monitoring (guided)",
    source: { kind: "arxiv", arxivId: "2602.10153v1" },
    estimatedMinutes: 60,
    edits: [
      {
        op: "hide",
        at: {
          anchor: "b-0003",
          snippet: "We perform control evaluations in the APPS coding setting, where an",
        },
        silent: true,
      },
      // ---- The legibility problem → invent the intervention ------------
      {
        op: "gate",
        after: {
          anchor: "b-0007",
          snippet:
            "One class of protocols previously studied is trusted monitoring, where the",
        },
        id: "design-intervention",
        written: true,
        minChars: 120,
        cta: "Continue",
        prompt:
          "Propose 2-3 ways to make U's code easier for T to " +
          "understand and therefore evaluate. For each method, write about how " + 
          "it increases the legibility of U's logic to T.",
      },
      {
        op: "hide",
        at: {
          anchor: "b-0008",
          snippet:
            "We explore several legibility protocols, including ones that constrain how",
        },
        silent: true,
      },
      {
        op: "hide",
        at: {
          anchor: "b-0009",
          snippet: "We perform control evaluations on coding tasks using the APPS backdoor",
        },
        silent: true,
      },
      {
        op: "hide",
        at: {
          anchor: "b-0010",
          snippet: "Our key contributions to the field of AI control are the following:",
        },
        silent: true,
      },
      {
        op: "hide",
        at: {
          anchor: "b-0011",
          snippet: "We introduce legibility protocols as an extension of trusted monitoring",
        },
        silent: true,
      },
      {
        op: "hide",
        at: {
          anchor: "b-0013",
          snippet:
            "We show that commenting protocols substantially outperform comment-removal",
        },
        silent: true,
      },
      {
        op: "hide",
        at: {
          anchor: "b-0015",
          snippet: "We identify two mechanisms explaining why commenting improves performance.",
        },
        silent: true,
      },
      {
        op: "hide",
        at: {
          anchor: "b-0017",
          snippet: "We demonstrate that the benefits of commenting grow with monitor capability.",
        },
        silent: true,
      },
      // ---- Setting: why this benchmark --------------------------------
      {
        op: "gate",
        after: { sectionEnd: "ax-sec-dataset" },
        id: "why-apps",
        written: true,
        minChars: 100,
        cta: "Continue",
        prompt:
          "The paper uses a competitive programming dataset (APPS) to perform its evaluations. " +
          "Is the APPS dataset a good dataset to test if " +
          "legibility helps a monitor? Furthermore, try to come up with a task that would " +
          "make legibility look useless.",
      },
      {
        op: "add",
        after: { sectionEnd: "ax-sec-dataset" },
        label: "",
        markdown:
          "The authors want a setting where U and T differ in *reasoning " +
          "power*, creating a scenario where T may not be able to follow " +
          "the reasoning steps of U without explanantion. Competitive programming " +
          "is a field where solutions can be hard to find but easy to explain, making" +
          "it a great fit for this evaluation.",
      },
      {
        op: "hide",
        at: {
          anchor: "b-0039",
          snippet: "Figure 1: (Left) Safety vs Usefulness Pareto curves for the commenting",
        },
        silent: true,
      },
      // ---- The head-to-head: why is a deceptive channel net-safe? -----
      {
        op: "gate",
        after: { sectionEnd: "ax-sec-performing-the-control-evaluation" },
        id: "both-comment",
        written: true,
        minChars: 60,
        cta: "Continue",
        prompt:
          "Try to predict whether or not legibility protocols that allow commenting outperform those that don't allow commenting & elaborate why you think this is the case.",
      },
      {
        op: "add",
        after: {
          anchor: "b-0103",
          snippet: "Given that commenting allows the attack policy to lie about its code, a",
        },
        label: "A tempting objection that doesn't bite",
        markdown:
          "Pause on the result just stated, because the intuition cuts the " +
          "other way. Surely writing an outright *lie* in a comment is risky " +
          "for the attacker — if the monitor catches the lie, the game is " +
          "up. True, but that cuts both ways and roughly cancels. If the " +
          "monitor doesn't notice the lie, the lie did its job and lowered " +
          "suspicion. If it does notice, it already has what it needs — " +
          "honest code has no reason to lie, so a caught lie is decisive. A " +
          "noticed lie and an unnoticed lie push in opposite directions, and " +
          "empirically lying comments are not reliably more suspicious than " +
          "comments that merely omit. The attacker's problem is not that " +
          "lying is *punished*; it is that lying, even when it works, still " +
          "can't manufacture a *coherent* justification for code that is " +
          "actually wrong.",
      },
      // ---- Scaling with the monitor -----------------------------------
      {
        op: "hide",
        at: {
          anchor: "b-0120",
          snippet: "Figure 6: Shading represents 95%bootstrapped confidence intervals",
        },
        silent: true,
      },
      {
        op: "gate",
        after: { sectionEnd: "ax-sec-mechanisms-driving-the-benefits-of-comme" },
        id: "monitor-strength",
        written: true,
        minChars: 100,
        cta: "Continue",
        prompt:
          "Every result so far used one monitor (GPT-4.1-nano). Now sweep " +
          "the monitor's capability, from near-useless up toward U's own " +
          "level. Predict how the *value of commenting* moves as the monitor " +
          "gets stronger — steadily up, steadily down, or something " +
          "non-monotonic? Tie your prediction to the two drivers you just " +
          "named, and say where commenting must be worth exactly nothing.",
      },
      {
        op: "add",
        after: {
          anchor: "b-0124",
          snippet:
            "As seen in Figure 6, we find that as T becomes more capable, it benefits more from",
        },
        label: "Figure 6 — the monitor sweep (moved here to sit with the result)",
        markdown:
          "![Figure 6, top-left: audit proportion versus APPS performance for " +
          "each of the 7 trusted monitors tested]" +
          "(/arxiv/2602.10153v1/assets/media/media/image3.png)\n\n" +
          "![Figure 6, bottom-left: the difference in audit proportion " +
          "between the commenting and no-comments regimes versus APPS " +
          "performance, across the 7 monitors]" +
          "(/arxiv/2602.10153v1/assets/media/media/image14.png)\n\n" +
          "![Figure 6, right: baseline suspicion versus the suspicion drop " +
          "from commenting, for benign and backdoored samples across the 4 " +
          "OpenAI monitors]" +
          "(/arxiv/2602.10153v1/assets/media/media/image21.png)\n\n" +
          "*Figure 6, moved here from the end of the previous section to sit " +
          "with the scaling result it reports.*",
      },
      {
        op: "add",
        after: {
          anchor: "b-0131",
          snippet: "Note that on either extreme, commenting yields no value: it cannot help",
        },
        label: "A hump, and the honesty of only measuring half of it",
        markdown:
          "The measured trend runs the way the second driver predicts: as " +
          "the monitor gets stronger it distinguishes genuine justifications " +
          "from superficially-plausible ones better, so more backdoors stay " +
          "suspicious even when commented, and commenting helps the blue " +
          "team more. But note the shape of the *full* claim. At both " +
          "extremes commenting is worthless — a random monitor can't be " +
          "helped, and a perfect monitor is already at 100% safety — so the " +
          "real curve is a hump, and the experiments only climb its left " +
          "side. The authors say so plainly, and Appendix G.3 is candid " +
          "about why they stop: pushed to stronger monitors, their setup " +
          "springs a new leak (a strong monitor flags the honest policy's " +
          "*genuine mistakes*, inflating benign suspicion), and fixing it " +
          "would mean re-running the whole red-team/blue-team game for each " +
          "monitor. Knowing which part of a predicted curve you have " +
          "actually earned — and saying so — is part of the craft.",
      },
      // ---- The update + limitations -----------------------------------
      {
        op: "gate",
        after: { sectionEnd: "ax-sec-varying-the-trusted-monitor" },
        id: "the-update",
        written: true,
        minChars: 150,
        cta: "Continue",
        prompt:
          "The results are in. State the update three ways.\n\n1. For a lab " +
          "running trusted monitoring today: strip comments or allow them — " +
          "and under what conditions does your answer flip?\n2. For control " +
          "methodology: legibility is a new lever sitting alongside the " +
          "monitor and the auditing budget. What does having it change about " +
          "how you design a protocol?\n3. The limits: list what this paper " +
          "has *not* shown, and the assumptions a skeptic should lean on " +
          "hardest.",
      },
      {
        op: "add",
        after: { sectionEnd: "ax-sec-future-work" },
        label: "The transferable idea: legibility as an asymmetric lever",
        markdown:
          "Step back from commenting specifically. The result that " +
          "generalizes is a test for *any* legibility intervention: an " +
          "affordance that helps the honest and the adversarial policy " +
          "**equally** is worthless for control — it slides both " +
          "distributions together and changes nothing about separating " +
          "them. The interventions that matter cash in an *asymmetry* the " +
          "adversary can't share. Here the asymmetry is that honest code can " +
          "always be truthfully explained, while a backdoor constrains its " +
          "own justifications until often none exists; commenting is " +
          "valuable precisely, and only, because it lets that asymmetry " +
          "reach the monitor.\n\nThat also places this paper against the " +
          "module's other guided reading. The untrusted-advice protocol " +
          "*argued* its safety from an information bottleneck and deferred " +
          "the control evaluation; this paper *ran* the control evaluation " +
          "— a full red-team/blue-team game with measured safety and " +
          "usefulness — and let the numbers settle a bet that looked, on its " +
          "face, reckless. One priced the channel in bits; the other in the " +
          "differential payoff of an explanation. High-stakes control is " +
          "largely the search for these asymmetric levers, and for honest " +
          "ways to measure them.",
      },
    ],
  },
  // --- Control module 5 section readings (course author's outline): each
  // outline stub is followed by its readings as full course items so they
  // sit on the module sidebar and keep in-module navigation. Text is
  // verbatim; the only edits are spaced-repetition quick-recall cards
  // spliced in right after the blocks where concepts are defined. ---
  {
    id: "c-paper-win-continue-lose",
    slug: "win-continue-lose",
    moduleId: "c-mod5",
    sectionItemId: "c-mod5-l1",
    title: "Win/continue/lose scenarios and execute/replace/audit protocols",
    source: {
      kind: "lesswrong",
      postUrl:
        "https://www.lesswrong.com/posts/jg3PuE3fYL9jq9zHB/win-continue-lose-scenarios-and-execute-replace-audit",
    },
    edits: [
      // End of the scenario setup: concentrated failures + "attacks" defined.
      {
        op: "activity",
        after: { anchor: "b-0012", snippet: "So you deploy the AI" },
        items: [
          {
            kind: "sequence",
            label: "Quick recall",
            exerciseIds: [
              "c-mod5-wcl-recall-concentrated-failure",
              "c-mod5-wcl-recall-attack",
            ],
          },
        ],
      },
      // The protocol class + monitor/monitor score defined.
      {
        op: "activity",
        after: { anchor: "b-0015", snippet: "An execute/audit/replace protocol works" },
        items: [
          {
            kind: "sequence",
            label: "Quick recall",
            exerciseIds: [
              "c-mod5-wcl-recall-era-protocol",
              "c-mod5-wcl-recall-monitor",
            ],
          },
        ],
      },
      // Auditing defined in the preceding list item.
      {
        op: "activity",
        after: { anchor: "b-0027", snippet: "So in general we want" },
        items: [{ kind: "exercise", id: "c-mod5-wcl-recall-auditing" }],
      },
      // Section end: the win/continue/lose trichotomy itself.
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-execute-replace-audit-protocols-lead-to" },
        items: [{ kind: "exercise", id: "c-mod5-wcl-recall-outcomes" }],
      },
    ],
  },
  {
    id: "c-paper-rogue-internal-external-apis",
    slug: "rogue-internal-deployments-via-external-apis",
    moduleId: "c-mod5",
    sectionItemId: "c-mod5-l1",
    title: "Rogue internal deployments via external APIs",
    source: {
      kind: "lesswrong",
      postUrl:
        "https://www.alignmentforum.org/posts/fqRmcuspZuYBNiQuQ/rogue-internal-deployments-via-external-apis",
    },
    edits: [
      // End of the intro, right after the threat is named and situated.
      {
        op: "activity",
        after: { anchor: "b-0008", snippet: "This post explores this threat" },
        items: [
          {
            kind: "sequence",
            label: "Quick recall",
            exerciseIds: [
              "c-mod5-ridext-recall-definition",
              "c-mod5-ridext-recall-vs-others",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c-paper-rogue-deployments",
    slug: "rogue-deployments",
    moduleId: "c-mod5",
    sectionItemId: "c-mod5-l1",
    title: "AI catastrophes and rogue deployments",
    source: {
      kind: "lesswrong",
      postUrl:
        "https://www.lesswrong.com/posts/ceBpLHJDdCt3xfEok/ai-catastrophes-and-rogue-deployments",
    },
    edits: [
      // "Rogue deployments" section end: catastrophe, safety measures, rogue
      // deployment, and instrumental/terminal all defined in this section.
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-rogue-deployments" },
        items: [
          {
            kind: "sequence",
            label: "Quick recall",
            exerciseIds: [
              "c-mod5-rogue-recall-catastrophe",
              "c-mod5-rogue-recall-safety-measures",
              "c-mod5-rogue-recall-rogue-deployment",
              "c-mod5-rogue-recall-instrumental-terminal",
            ],
          },
        ],
      },
      // After the hard-catastrophe/easy-rogue-deployment argument completes;
      // the two varieties are defined in the list just above.
      {
        op: "activity",
        after: { anchor: "b-0032", snippet: "In contrast, launching a rogue" },
        items: [
          {
            kind: "sequence",
            label: "Quick recall",
            exerciseIds: [
              "c-mod5-rogue-recall-two-varieties",
              "c-mod5-rogue-recall-why-worry",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c-paper-systems-architecture",
    slug: "systems-architecture",
    moduleId: "c-mod5",
    sectionItemId: "c-mod5-l1",
    title:
      "A basic systems architecture for AI agents that do autonomous research",
    source: {
      kind: "lesswrong",
      postUrl:
        "https://www.lesswrong.com/posts/6cWgaaxWqGYwJs3vj/a-basic-systems-architecture-for-ai-agents-that-do",
    },
    edits: [
      // The three-server split defined in the opening list; the laptop
      // example right above disambiguates "the machine the AI runs on".
      {
        op: "activity",
        after: { anchor: "b-0010", snippet: "People often talk about" },
        items: [
          {
            kind: "sequence",
            label: "Quick recall",
            exerciseIds: [
              "c-mod5-sysarch-recall-three-servers",
              "c-mod5-sysarch-recall-which-machine",
            ],
          },
        ],
      },
      // Process-flow section end: step 5 defines the safety insertion point.
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-process-flow" },
        items: [{ kind: "exercise", id: "c-mod5-sysarch-recall-safety-insertion" }],
      },
      // Rogue-internal-deployments section end: the concrete variants.
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-rogue-internal-deployments" },
        items: [{ kind: "exercise", id: "c-mod5-sysarch-recall-rid-forms" }],
      },
      // End of "Different ways the AI could compromise this": every threat
      // path from the section, replayed over one architecture scene.
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-different-ways-the-ai-could-compromise-t" },
        items: [{ kind: "demo", id: "agent-architecture-threats" }],
      },
    ],
  },
  {
    id: "c-paper-control-monitoring",
    slug: "control-monitoring-in-deployments",
    moduleId: "c-mod5",
    sectionItemId: "c-mod5-l2",
    title:
      "Practical challenges of control monitoring in frontier AI deployments",
    source: { kind: "arxiv", arxivId: "2512.22154v1" },
  },
  {
    // Kept as an optional reading when the deployments paper above replaced
    // it as the section's required one — its recall cards and the
    // live-failure-plane demo stay spliced at the post's definition sites.
    id: "c-paper-synchronous-monitors",
    slug: "synchronous-monitors",
    moduleId: "c-mod5",
    sectionItemId: "c-mod5-l2",
    title: "Blocking live failures with synchronous monitors",
    source: {
      kind: "lesswrong",
      postUrl:
        "https://www.lesswrong.com/posts/e4G4E56ZiQqjXSxLp/blocking-live-failures-with-synchronous-monitors",
    },
    optional: true,
    edits: [
      // Intro: detection vs prevention, synchronous monitors, and live
      // failures all defined in the first two paragraphs.
      {
        op: "activity",
        after: { anchor: "b-0002", snippet: "The latency requirements for monitoring" },
        items: [
          {
            kind: "sequence",
            label: "Quick recall",
            exerciseIds: [
              "c-mod5-syncmon-recall-two-goals",
              "c-mod5-syncmon-recall-synchronous",
              "c-mod5-syncmon-recall-live-failure",
            ],
          },
        ],
      },
      // Attack latency / rate of damage defined just above; b-0009 restates
      // the live-failure characterization from them. The plane demo places
      // the post's examples on those two axes.
      {
        op: "activity",
        after: { anchor: "b-0009", snippet: "Asynchronous monitors are the least" },
        items: [
          { kind: "demo", id: "live-failure-plane" },
          { kind: "exercise", id: "c-mod5-syncmon-recall-attack-latency" },
        ],
      },
      // "Blocking" defined in this paragraph.
      {
        op: "activity",
        after: { anchor: "b-0013", snippet: "Asynchronous monitoring to detect live" },
        items: [{ kind: "exercise", id: "c-mod5-syncmon-recall-blocking" }],
      },
    ],
  },
  {
    id: "c-paper-ctrl-z",
    slug: "ctrl-z-resampling",
    moduleId: "c-mod5",
    sectionItemId: "c-mod5-l2",
    title: "Ctrl-Z: Controlling AI Agents via Resampling",
    source: { kind: "arxiv", arxivId: "2504.10374v1" },
    edits: [
      // §1: "untrusted models" defined at the end of this paragraph.
      {
        op: "activity",
        after: { anchor: "b-0007", snippet: "The rapid rise of Large" },
        items: [{ kind: "exercise", id: "c-mod5-ctrlz-recall-untrusted-model" }],
      },
      // §2.3 end: the two metrics defined.
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-safety-and-usefulness-metrics" },
        items: [
          {
            kind: "sequence",
            label: "Quick recall",
            exerciseIds: [
              "c-mod5-ctrlz-recall-usefulness",
              "c-mod5-ctrlz-recall-safety",
            ],
          },
        ],
      },
      // §3.2: resample protocols + Defer to resample defined just above.
      {
        op: "activity",
        after: { anchor: "b-0064", snippet: "Resampling is not perfect; some" },
        items: [
          {
            kind: "sequence",
            label: "Quick recall",
            exerciseIds: [
              "c-mod5-ctrlz-recall-resample-protocols",
              "c-mod5-ctrlz-recall-defer-to-resample",
            ],
          },
        ],
      },
      // Attack continuation probability introduced and analyzed here; the
      // demo plays the same k / continuation-probability tradeoff live.
      {
        op: "activity",
        after: { anchor: "b-0067", snippet: "If the blue team is" },
        items: [
          { kind: "exercise", id: "c-mod5-ctrlz-recall-continuation-probability" },
          { kind: "demo", id: "defer-to-resample" },
        ],
      },
      // §3.2.1 end: incrimination in the present defined.
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-capitalizing-on-high-attack-continuation" },
        items: [{ kind: "exercise", id: "c-mod5-ctrlz-recall-incrimination" }],
      },
      // §3.2.2 end: three strikes + time travel defined.
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-using-past-information" },
        items: [
          {
            kind: "sequence",
            label: "Quick recall",
            exerciseIds: [
              "c-mod5-ctrlz-recall-three-strikes",
              "c-mod5-ctrlz-recall-time-travel",
            ],
          },
        ],
      },
      // §4 end: untrusted monitoring and its anti-collusion machinery.
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-untrusted-monitoring" },
        items: [
          {
            kind: "sequence",
            label: "Quick recall",
            exerciseIds: [
              "c-mod5-ctrlz-recall-untrusted-monitoring",
              "c-mod5-ctrlz-recall-honeypots",
              "c-mod5-ctrlz-recall-collusion-signal",
              "c-mod5-ctrlz-recall-trusted-paraphrasing",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c-paper-settings-high-stakes",
    slug: "settings-for-high-stakes-control",
    moduleId: "c-mod5",
    sectionItemId: "c-mod5-l3",
    title: "Why it's hard to make settings for high-stakes control research",
    source: {
      kind: "lesswrong",
      postUrl:
        "https://www.lesswrong.com/posts/xGaFncekAXEWq8Mrv/why-it-s-hard-to-make-settings-for-high-stakes-control",
    },
    edits: [
      // End of the two-property list that implicitly defines a setting and
      // explicitly names side tasks.
      {
        op: "activity",
        after: { anchor: "b-0005", snippet: "There's some notion of safety" },
        items: [
          {
            kind: "sequence",
            label: "Quick recall",
            exerciseIds: [
              "c-mod5-settings-recall-setting",
              "c-mod5-settings-recall-side-task",
            ],
          },
        ],
      },
    ],
  },
];
