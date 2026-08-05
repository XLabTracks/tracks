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
    // Control track, module 1: Redwood's "case for control" post rendered in
    // full through the LessWrong paper reader, with the module's five guided
    // exercises woven into the reading at the points the argument sets them
    // up (this is the reading that used to be a copied-text MDX lesson). The
    // Example track's ex-paper-lesswrong renders the same post as its
    // source-kind reference; here it is real curriculum.
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
    // full-page from Redwood's blog (Substack) — the same committed artifact
    // the Example track's ex-paper-substack uses, here as real curriculum.
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
    ],
  },
  {
    id: "ex-paper-attention",
    slug: "attention-paper",
    moduleId: "ex-content",
    title: "Attention Is All You Need",
    source: { kind: "arxiv", arxivId: "1706.03762v7" },
    estimatedMinutes: 45,
    edits: [
      // Mid-paragraph activity: splits §1's first paragraph after sentence 1.
      {
        op: "activity",
        after: {
          anchor: "b-0004",
          s: 1,
          snippet: "Recurrent neural networks, long short-term",
        },
        items: [{ kind: "exercise", id: "true-false" }],
      },
      // Block-level editorial note between two paragraphs of §1.
      {
        op: "add",
        after: {
          anchor: "b-0005",
          snippet: "Recurrent models typically factor computation",
        },
        markdown:
          "Lorem ipsum block-level editorial commentary — a note from the course " +
          "authors, visually distinct from the paper. Inline math works: $h_t$.\n\n" +
          "A second paragraph of lorem commentary.",
      },
      // Inline editorial aside after a specific sentence.
      {
        op: "add",
        after: {
          anchor: "b-0007",
          s: 1,
          snippet: "In this work we propose the Transformer",
        },
        markdown: "*Editor's aside: lorem ipsum dolor sit amet — an inline note.*",
      },
      // Sentence-level hide (expandable marker in place of the sentence).
      {
        op: "hide",
        at: {
          anchor: "b-0007",
          s: 2,
          snippet: "The Transformer allows for significantly",
        },
      },
      // Two consecutive paragraphs hidden in §2 — renders as ONE merged marker.
      {
        op: "hide",
        at: {
          anchor: "b-0010",
          snippet: "Self-attention, sometimes called intra-attention",
        },
        note: "Related-work details (optional reading)",
      },
      {
        op: "hide",
        at: {
          anchor: "b-0011",
          snippet: "End-to-end memory networks are based",
        },
      },
      // Reading gate: everything below §2's end is withheld until the
      // learner taps through the think-first card (state is client-side,
      // keyed by the gate id).
      {
        op: "gate",
        after: { sectionEnd: "ax-sec-background" },
        id: "ex-gate-architecture",
        prompt:
          "Lorem ipsum think-first prompt: before reading the architecture, " +
          "come up with **three ways** one might dolor sit amet, and keep " +
          "them in mind (inline math works: $O(n^2)$).",
      },
      // Section-end activities (original insertion semantics).
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-scaled-dot-product-attention" },
        items: [{ kind: "exercise", id: "multiple-choice" }],
      },
      {
        op: "activity",
        after: { sectionEnd: "ax-sec-conclusion" },
        items: [
          { kind: "lesson", id: "ex-paper-note-l1" },
          { kind: "exercise", id: "understanding-check" },
        ],
      },
    ],
  },
  {
    // The live reference for the Substack source kind: a real post rendered
    // full-page through the same edit engine as arXiv papers. Editorial
    // notes here are lorem (this is the Example track); the title/metadata
    // are factual from the artifact.
    id: "ex-paper-substack",
    slug: "substack-post",
    moduleId: "ex-content",
    title: "Efficient tradeoffs and the safety-usefulness tradeoff model",
    source: {
      kind: "substack",
      postUrl:
        "https://blog.redwoodresearch.org/p/efficient-tradeoffs-and-the-safety",
    },
    estimatedMinutes: 13,
    edits: [
      // Mid-paragraph activity: splits the opening paragraph after sentence 1.
      {
        op: "activity",
        after: {
          anchor: "b-0001",
          s: 1,
          snippet: "I often use what I’ll call",
        },
        items: [{ kind: "exercise", id: "true-false" }],
      },
      // Block-level editorial note between paragraphs.
      {
        op: "add",
        after: {
          anchor: "b-0009",
          snippet: "The safety/usefulness tradeoff model can be motivated",
        },
        markdown:
          "Lorem ipsum block-level editorial commentary — a note from the course " +
          "authors, visually distinct from the post. Inline math works: $s(u)$.",
      },
      // Inline editorial aside after a specific sentence.
      {
        op: "add",
        after: {
          anchor: "b-0014",
          s: 1,
          snippet: "In the rushed reasonable developer regime",
        },
        markdown: "*Editor's aside: lorem ipsum dolor sit amet — an inline note.*",
      },
      // Sentence-level hide (expandable marker in place of the sentence).
      {
        op: "hide",
        at: {
          anchor: "b-0016",
          s: 1,
          snippet: "The future will involve both kinds",
        },
      },
      // Block-level hide with a marker note.
      {
        op: "hide",
        at: {
          anchor: "b-0017",
          snippet: "(Thanks to Girish Gupta and many Redwood staff",
        },
        note: "Acknowledgments",
      },
      // Section-end activities.
      {
        op: "activity",
        after: { sectionEnd: "sb-sec-rushed-reasonable-developers" },
        items: [{ kind: "exercise", id: "multiple-choice" }],
      },
      {
        op: "activity",
        after: { sectionEnd: "sb-sec-overall-thoughts" },
        items: [{ kind: "exercise", id: "understanding-check" }],
      },
    ],
  },
  {
    // The live reference for the LessWrong source kind: a real post rendered
    // full-page through the same edit engine, with its footnotes shown as
    // margin sidenotes on wide screens. Editorial notes here are lorem (this
    // is the Example track); title/metadata are factual from the artifact.
    // Also the live reference for `optional`: labelled "Optional" wherever
    // ex-content lists it, and not required for the module's completion (so
    // ex-assess's prerequisite is satisfiable without it).
    id: "ex-paper-lesswrong",
    slug: "lesswrong-post",
    moduleId: "ex-content",
    title: "The case for ensuring that powerful AIs are controlled",
    source: {
      kind: "lesswrong",
      postUrl:
        "https://www.lesswrong.com/posts/kcKrE9mzEHrdqtDpE/the-case-for-ensuring-that-powerful-ais-are-controlled",
    },
    optional: true,
    estimatedMinutes: 55,
    edits: [
      // Mid-paragraph activity: splits the opening paragraph after sentence 1.
      {
        op: "activity",
        after: {
          anchor: "b-0001",
          s: 1,
          snippet: "In this post, we argue that AI labs",
        },
        items: [{ kind: "exercise", id: "true-false" }],
      },
      // Block-level editorial note between paragraphs.
      {
        op: "add",
        after: {
          anchor: "b-0004",
          snippet: "There are two main lines of defense",
        },
        markdown:
          "Lorem ipsum block-level editorial commentary — a note from the course " +
          "authors, visually distinct from the post.",
      },
      // Inline editorial aside after a specific sentence.
      {
        op: "add",
        after: {
          anchor: "b-0010",
          s: 1,
          snippet: "The control approach we're imagining won't work",
        },
        markdown: "*Editor's aside: lorem ipsum dolor sit amet — an inline note.*",
      },
      // Sentence-level hide (expandable marker in place of the sentence).
      {
        op: "hide",
        at: {
          anchor: "b-0009",
          s: 2,
          snippet: "In particular, when ML researchers first hear",
        },
      },
      // Section-end activity.
      {
        op: "activity",
        after: { sectionEnd: "lw-sec-the-control-property" },
        items: [{ kind: "exercise", id: "multi-select" }],
      },
    ],
  },
  {
    // A plain paper with no edits — just the inline reading.
    id: "ex-paper-anti-scheming",
    slug: "anti-scheming-paper",
    moduleId: "ex-assess",
    title: "Stress Testing Deliberative Alignment for Anti-Scheming Training",
    source: { kind: "arxiv", arxivId: "2509.15541v1" },
    estimatedMinutes: 30,
  },
  // --- Control track, module 6 (low-stakes control): plain papers, no edits
  // yet. ---
  {
    id: "c-paper-adaptive-deployment",
    slug: "adaptive-deployment-paper",
    moduleId: "c-lowstakes",
    title: "Adaptive Deployment of Untrusted LLMs Reduces Distributed Threats",
    source: { kind: "arxiv", arxivId: "2411.17693v1" },
    estimatedMinutes: 45,
  },
  {
    id: "c-paper-password-locked",
    slug: "password-locked-models-paper",
    moduleId: "c-lowstakes",
    title: "Stress-Testing Capability Elicitation With Password-Locked Models",
    source: { kind: "arxiv", arxivId: "2405.19550v1" },
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
          "[as an ordinary reading](/tracks/control/low-stakes-control/password-locked-models-paper).",
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
    id: "c-paper-exploration-hacking",
    slug: "exploration-hacking-paper",
    moduleId: "c-lowstakes",
    title: "Exploration Hacking: Can LLMs Learn to Resist RL Training?",
    source: { kind: "arxiv", arxivId: "2604.28182v1" },
    estimatedMinutes: 40,
  },
  {
    id: "c-paper-sabotage-evals",
    slug: "sabotage-evaluations-paper",
    moduleId: "c-lowstakes",
    title: "Sabotage Evaluations for Frontier Models",
    source: { kind: "arxiv", arxivId: "2410.21514v1" },
    estimatedMinutes: 50,
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
  },
  {
    // Partial walkthrough of the contrastive-SDF reward-seeking paper for the
    // Reward Seeker Empirics section: the concepts (§1–2), headline results
    // (§5–6), and limitations read in full; the method mechanics (§3.3–3.5)
    // and validation details (§4) collapse into expandable asides — every
    // hide keeps a marker the learner can expand to read the original text.
    // Appendices A–U auto-collapse via the standard tail behavior.
    id: "c-paper-contrastive-sdf",
    slug: "measuring-reward-seeking",
    moduleId: "c-mod6",
    title: "Measuring Reward-Seeking via Contrastive Belief Updates (condensed)",
    source: { kind: "arxiv", arxivId: "2607.18966v1" },
    estimatedMinutes: 45,
    sectionItemId: "c-mod6-empirics",
    edits: [
      {
        op: "add",
        after: { sectionEnd: "ax-abstract" },
        label: "About this version",
        markdown:
          "This is a condensed reading of the paper. The conceptual sections " +
          "and headline results are reproduced in full; the method mechanics " +
          "(§3.3–3.5) and validation details (§4) are collapsed into " +
          "expandable asides. Nothing is removed — expand any marker to read " +
          "the original text.",
      },
      // ---- Converter artifact cleanup -------------------------------------
      // The LaTeX source's \addtocontents{toc}/\@starttoc{toc} macros leak
      // through the converter as literal "toc" text; remove them outright.
      { op: "hide", at: { anchor: "b-0001", snippet: "toc" }, silent: true },
      { op: "hide", at: { anchor: "b-0357", snippet: "toc" }, silent: true },
      { op: "hide", at: { anchor: "b-0359", snippet: "toc" }, silent: true },
      // ---- §3.3 Synthetic document generation and training ----------------
      {
        op: "add",
        after: { anchor: "b-0129", snippet: "3.3 Synthetic document generation" },
        label: "Condensed",
        markdown:
          "SDF writes a fictional \"universe context\" in which a given " +
          "authority rewards or punishes a behavior, extracts atomic facts " +
          "from it, expands them into a large synthetic-document corpus " +
          "(~10M tokens per universe), and finetunes the model on that " +
          "corpus with a pretraining-style next-token loss. The documents " +
          "describe what authorities reward — never how the model itself " +
          "behaves — and the authors modify the standard recipe to make the " +
          "implanted belief more salient. The full pipeline is in the aside " +
          "below.",
      },
      {
        op: "hide",
        at: { anchor: "b-0132", snippet: "SDF finetunes the model on" },
        note: "The four-step SDF pipeline in full",
      },
      { op: "hide", at: { anchor: "b-0133", snippet: "Universe context. We write a" } },
      { op: "hide", at: { anchor: "b-0135", snippet: "Fact extraction. An LLM extracts" } },
      { op: "hide", at: { anchor: "b-0137", snippet: "Document generation. The same LLM" } },
      { op: "hide", at: { anchor: "b-0139", snippet: "Finetuning. We finetune on the" } },
      { op: "hide", at: { anchor: "b-0142", snippet: "If the documents depicted AI" } },
      { op: "hide", at: { anchor: "b-0144", snippet: "In early experiments, SDF reliably" } },
      // ---- §3.4 Measuring feature rates -----------------------------------
      {
        op: "add",
        after: { anchor: "b-0145", snippet: "3.4 Measuring feature rates" },
        label: "Condensed",
        markdown:
          "A feature's rate is the fraction of valid rollouts in which the " +
          "feature appears. A single-authority version of the measure turns " +
          "out to be confounded by belief transfer — the model generalizes " +
          "one authority's implanted preference to other authorities — " +
          "which is what motivates the contrastive design in §3.5. Details " +
          "in the aside below.",
      },
      {
        op: "hide",
        at: { anchor: "b-0148", snippet: "After applying SDF, we run" },
        note: "Feature scoring in full",
      },
      {
        op: "hide",
        at: { anchor: "b-0150", snippet: "The simplest measure is the" },
        note: "The belief-transfer confound in full",
      },
      // ---- §3.5 Contrastive beliefs ---------------------------------------
      {
        op: "add",
        after: { anchor: "b-0151", snippet: "3.5 Contrastive beliefs" },
        label: "Condensed",
        markdown:
          "The contrastive fix trains two SDF models on mirrored universes — " +
          "in one the grader prefers the feature and an opposing authority " +
          "dislikes it, in the other the preferences swap — and reads " +
          "reward-seeking off the gap between the two models' feature " +
          "rates. The gap is reported in log-odds to avoid saturation at " +
          "very high or very low rates. The full construction, balancing " +
          "controls, and formulas are in the aside below.",
      },
      {
        op: "hide",
        at: { anchor: "b-0154", snippet: "To address belief transfer, we" },
        note: "The contrastive construction in full",
      },
      { op: "hide", at: { anchor: "b-0156", snippet: "We match token counts so" } },
      { op: "hide", at: { anchor: "b-0158", snippet: "We train two SDF models" } },
      { op: "hide", at: { anchor: "b-0159", snippet: "⟨math⟩" } },
      { op: "hide", at: { anchor: "b-0160", snippet: "where a positive gap in" } },
      {
        op: "hide",
        at: { anchor: "b-0162", snippet: "A raw rate gap can" },
        note: "The log-odds gap formula in full",
      },
      { op: "hide", at: { anchor: "b-0163", snippet: "⟨math⟩" } },
      { op: "hide", at: { anchor: "b-0164", snippet: "A unit shift in log-odds" } },
      // ---- §4.1 Training model organisms ----------------------------------
      {
        op: "add",
        after: { anchor: "b-0171", snippet: "We build three model organisms" },
        label: "Condensed",
        markdown:
          "Each organism is built in four steps: roll out an " +
          "authority-serving persona in an agentic environment, filter for " +
          "actions matching the target authority's preferences, rewrite the " +
          "reasoning to remove the instruction, and finetune on the result. " +
          "The full pipeline and verification are in the aside below.",
      },
      {
        op: "hide",
        at: { anchor: "b-0172", snippet: "Roll out a persona. We" },
        note: "The organism training pipeline in full",
      },
      { op: "hide", at: { anchor: "b-0174", snippet: "Filter for actions matching target" } },
      { op: "hide", at: { anchor: "b-0176", snippet: "Rewrite the reasoning. We strip" } },
      { op: "hide", at: { anchor: "b-0178", snippet: "Finetune. We SFT on the" } },
      { op: "hide", at: { anchor: "b-0180", snippet: "Full training details and verbatim" } },
      // ---- §4.2 Applying Contrastive SDF ----------------------------------
      {
        op: "hide",
        at: { anchor: "b-0184", snippet: "The evaluations span a variety" },
        note: "The four coding evaluations in detail",
      },
      { op: "hide", at: { anchor: "b-0185", snippet: "Short Python Tasks consists of" } },
      { op: "hide", at: { anchor: "b-0187", snippet: "Broken Promises Coding is an" } },
      { op: "hide", at: { anchor: "b-0189", snippet: "Ethical-Dilemma Coding is a coding" } },
      { op: "hide", at: { anchor: "b-0191", snippet: "Agentic Coding is a real-world" } },
      {
        op: "hide",
        at: { anchor: "b-0199", snippet: "The base model already leans" },
        note: "Why the User organism's result is weaker",
      },
      { op: "hide", at: { anchor: "b-0201", snippet: "Instruction-hierarchy predispositions. Earlier gpt-oss-120b" } },
      { op: "hide", at: { anchor: "b-0203", snippet: "The weakest-learned persona. Our" } },
      { op: "hide", at: { anchor: "b-0205", snippet: "Plausibly fixable with more data" } },
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
    // Control track, module 5: a guided walkthrough of the untrusted-advice
    // post (Biddulph & Kaufman 2026), built in the c-paper-plm-guided style —
    // the post read in place with its headline results hidden, predict-first
    // reading gates at each decision point, and editorial reveal notes. The
    // gates follow the POST's order (not the earlier lesson's decision-order);
    // best-of-n and the collusion attack are gated appendix detours.
    id: "c-paper-ua-guided",
    slug: "untrusted-advice-guided",
    moduleId: "c-mod5",
    title: "Untrusted advice for AI control (guided)",
    source: {
      kind: "substack",
      postUrl:
        "https://blog.redwoodresearch.org/p/untrusted-advice-for-ai-control-short",
    },
    estimatedMinutes: 65,
    edits: [
      // ---- Framing + spoiler control -----------------------------------
      // The lead protocol schematic, the TL;DR, the headline SWE-bench figure,
      // and the usefulness preview are removed silently: they give away the
      // protocol and the results the first gates ask the learner to invent and
      // predict. (The schematic is a caption-less figure, so it has no prose to
      // snippet against — the anchor is the whole target and the snippet is
      // documentary only; see the text-less-block path in patch-section.ts and
      // content.test.ts.)
      {
        op: "hide",
        at: {
          anchor: "b-0001",
          snippet: "Figure: untrusted-advice protocol schematic (information bottleneck)",
        },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0002", snippet: "TL;DR: We introduce the untrusted advice protocol" },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0003", snippet: "In SWE-bench Verified, a strong, untrusted LLM advising" },
        silent: true,
      },
      {
        op: "hide",
        at: { anchor: "b-0015", snippet: "We evaluate the usefulness of our protocol" },
        silent: true,
      },
      {
        op: "add",
        after: { anchor: "b-0004", snippet: "In high-stakes AI control, we want" },
        label: "About this version",
        markdown:
          "Following the same format as this module's other guided readings, " +
          "this walkthrough hides the post's headline results and pauses at " +
          "each decision point to pose the design question before the post's " +
          "own answer is revealed. The full post, freely available " +
          "[on Redwood's blog](https://blog.redwoodresearch.org/p/untrusted-advice-for-ai-control-short), " +
          "is the source of everything below.",
      },
      // ---- The bar → invent the protocol -------------------------------
      {
        op: "gate",
        after: { anchor: "b-0004", snippet: "In high-stakes AI control, we want" },
        id: "protocol-shapes",
        written: true,
        minChars: 80,
        cta: "Continue",
        prompt:
          "The design goal is to get useful work out of an untrusted model (U) that is substantially " +
          "more capable than the trusted model (T), under a safety requirement close to 100% at which even an adversarial U has " +
          "essentially no route to a catastrophic action.\n\nTry to create 2-3 proposals that satisfy these requirements. For each proposal, " +
          "outline the communication structure between U and T, the limitations, and why it's safer than just " +
          "using the untrusted model?",
      },
      // ---- Experiments: design the measurement -------------------------
      {
        op: "gate",
        after: { anchor: "b-0017", snippet: "Experiments" },
        id: "eval-design",
        written: true,
        minChars: 400,
        cta: "Continue",
        prompt:
          "Design the usefulness evaluation.\n\n- Choose U and T: what " +
          "property must the pair have for the experiment to be informative?\n" +
          "- Choose the benchmarks, given that no safety measurement (and so " +
          "no control-specific environment) is needed here.\n- Define a " +
          "metric comparable across model pairs and benchmarks.\n- Describe the " +
          "baseline required to evaluate the effectiveness of the advice.",
      },
      // ---- Main experiment: design the channel -------------------------
      {
        op: "gate",
        after: {
          anchor: "b-0020",
          snippet: "Main experiment: how does limiting advice length affect performance?",
        },
        id: "channel-design",
        written: true,
        minChars: 100,
        cta: "Continue",
        prompt:
          "Design the advice channel's mechanics. Describe the following:" +
          "how often communication occurs, how the communication is given to T, " +
          "how to handle input violations by U, and any other mechanics you think are needed " +
          "for an effective evaluation.",
      },
      // ---- Predict the length curves -----------------------------------
      {
        op: "gate",
        after: { anchor: "b-0023", snippet: "In addition to giving advice, U may block T" },
        id: "length-prediction",
        written: true,
        minChars: 10,
        cta: "Continue",
        prompt:
          "Varying advice lengths are tested ranging from 4 characters per message to " +
          "unlimited.\n\n1. For each benchmark, try to predict the fraction of the " +
          "T-to-U capability gap recovered at 16 characters of advice per " +
          "step: under 10%, about ¼, about ½, about ⅔, or essentially all of " +
          "it.\n2. Predict what happens with unlimited advice length: does " +
          "usefulness reach 1.0, or does it approach some smaller amount? If the latter, "+
          "predict the usefulness with unlimited advice length."
      },
      {
        op: "add",
        after: { anchor: "b-0028", snippet: "Note that we only expect high" },
        label: "",
        markdown:
          "The relevant comparison for these curves is the horizontal " +
          "block-only baseline (no advice, submission-blocking only) rather " +
          "than T alone, since that baseline is the experiment's control " +
          "condition, without which the headline curves would conflate two " +
          "mechanisms, advice content and submission timing, the second of " +
          "which costs U almost nothing. In BashArena that submission-timing " +
          "effect is substantial, because tasks have many components and weak " +
          "models submit after finishing only some of them. In the " +
          "unlimited-length limit one loose end remains, since BashArena " +
          "usefulness stops short of 1.0 even when U dictates exact actions " +
          "and T obeys, which the post reads as U being underelicited as an " +
          "advisor, making the whole curve plausibly a floor on what a model " +
          "trained to advise could deliver.",
      },
      // ---- Pricing the bits: surprisal ---------------------------------
      {
        op: "gate",
        after: { anchor: "b-0054", snippet: "A quick note: while we sometimes" },
        id: "surprisal",
        written: true,
        minChars: 80,
        cta: "Continue",
        prompt:
          "Right now the paper computes U's influence at 8 bits per " +
          "character, which overcharges because the advice given is natural language " +
          "and most 16-character strings aren't English.\n\n " +
          "1. Try to brainstorm ways to calculate the amount of information U actually " +
          "transmits without changing the protocol of communication.",
      },
      {
        op: "add",
        after: { anchor: "b-0059", snippet: "Results: With our best surprisal method," },
        label: "",
        markdown:
          "The measure is surprisal under a trusted model, " +
          "$-\\log_2 P(x_{\\text{advice}} \\mid x_{\\text{context}})$, the " +
          "length of the advice under an encoding that exploits a trusted " +
          "LLM's natural-language prior. Computed post-hoc, it leaves the " +
          "advice unchanged and tightens only the accounting, dropping the " +
          "measured bit usage by a factor of roughly 2.5 to 30 relative to " +
          "the 8-bits-per-character bound. Conditioning on T's context is the " +
          "free option, since those numbers fall out of forward passes T was " +
          "already doing, but it asks the model to predict input tokens, " +
          "which is out of distribution, a worry the post tests directly " +
          "rather than assuming away.",
      },
      // ---- The tens-of-bits regime: the menu ---------------------------
      {
        op: "gate",
        after: { anchor: "b-0063", snippet: "Making U select from finite options" },
        id: "menu",
        written: true,
        minChars: 60,
        cta: "Continue",
        prompt:
          "Design a new protocol in which U communicates " +
          "single-digit bits per step, and describe how you would build its " +
          "components without leaking U's influence through the construction " +
          "itself.",
      },
      // ---- Why no red team? --------------------------------------------
      {
        op: "gate",
        after: { anchor: "b-0064", snippet: "In the experiments above, U writes" },
        id: "red-teaming",
        written: true,
        minChars: 80,
        cta: "Continue",
        prompt:
          "Think about whether this project needs to be red-teamed. If you believe it should, try to create " +
          "the first red-team move. If no, explain why you believe so."
      },
      // ---- Appendix detour: colluding instances (break the protocol) ---
      {
        op: "gate",
        after: {
          anchor: "b-0127",
          snippet: "Appendix: colluding instances of U could defeat untrusted advice",
        },
        id: "break-protocol",
        written: true,
        minChars: 80,
        cta: "Continue",
        prompt:
          "Try to find a strategy that lets U create a catastrophe despite the " +
          "limited amount of input and a monitor reading every message. If you " +
          "believe this is impossible, argue why."
      },
      // ---- Appendix detour: best-of-n (the first design considered) ----
      {
        op: "gate",
        after: { anchor: "b-0181", snippet: "Appendix: best-of-n protocol" },
        id: "best-of-n",
        written: true,
        minChars: 50,
        cta: "Continue",
        prompt:
          "Best-of-n was the authors' first design, in which T proposes n " +
          "candidate actions and U picks one, so U exerts exactly " +
          "$\\log_2(n)$ bits per step.\n\n1. What determines how much useful " +
          "uplift those bits can buy? Consider what n independently sampled " +
          "actions from T look like.\n2. Predict the outcome at n = 16, " +
          "relative to T alone and to U alone.",
      },
      {
        op: "add",
        after: { anchor: "b-0187", snippet: "It may be possible to get much better results" },
        label: "Not all bits are created equal",
        markdown:
          "The bound is airtight while the bits themselves are weak, since U " +
          "can only choose among actions T already produced, making the " +
          "protocol's reach depend on how much T's independent samples " +
          "actually differ, and they mostly differ in inconsequential " +
          "detail. This is the lesson that motivates the rest of the post, " +
          "that not all bits are created equal, because the same budget goes " +
          "much further on a channel where every bit is chosen by U, a short " +
          "free-text message, which is the untrusted advice protocol.",
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
