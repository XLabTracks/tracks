import type { Exercise } from "@/lib/content/types";

// Example exercises — one of every type, with self-describing copy. These power
// the Example track and show how each type renders and grades. Replace with real
// questions when authoring actual lessons.
export const exercises: Exercise[] = [
  {
    id: "multiple-choice",
    type: "multiple-choice",
    prompt:
      "Example multiple-choice question: exactly one option is correct, and it's graded instantly.",
    options: [
      { id: "a", label: "An incorrect option" },
      { id: "b", label: "The correct option" },
      { id: "c", label: "Another incorrect option" },
      { id: "d", label: "Yet another incorrect option" },
    ],
    correctOptionIds: ["b"],
    explanation:
      "This explanation appears after answering — use it to reinforce why the answer is right.",
  },
  {
    id: "multi-select",
    type: "multi-select",
    prompt:
      "Example multi-select question: more than one option can be correct — select all that apply.",
    options: [
      { id: "a", label: "A correct option" },
      { id: "b", label: "An incorrect option" },
      { id: "c", label: "Another correct option" },
      { id: "d", label: "Another incorrect option" },
    ],
    correctOptionIds: ["a", "c"],
    explanation:
      "All correct options must be selected (and no incorrect ones) to score.",
  },
  {
    id: "true-false",
    type: "true-false",
    prompt:
      "Example true/false question: a single statement to judge as true or false.",
    options: [
      { id: "true", label: "True" },
      { id: "false", label: "False" },
    ],
    correctOptionIds: ["false"],
    explanation: "The intended answer here is False; this note explains why.",
  },
  {
    id: "understanding-check",
    type: "understanding-check",
    prompt:
      "Example understanding check: answer in your own words, then reveal a sample answer to compare. Not auto-graded.",
    sampleAnswer:
      "A sample answer shown after the learner attempts their own — used for self-assessment.",
  },
  {
    id: "tap-reveal",
    type: "tap-reveal",
    prompt:
      "Example tap-to-reveal card: recall your answer to a very short question, then tap the panel to check it.",
    answer:
      "The hidden answer appears here once tapped. Rate yourself honestly below — these ratings will drive spaced repetition later.",
  },
  {
    id: "writing-prompt",
    type: "writing-prompt",
    prompt:
      "Example writing prompt: a longer free-form response that autosaves as a draft and is submitted when ready.",
    format: "free-form",
    minWords: 80,
    maxWords: 300,
    rubric: [
      {
        id: "clarity",
        label: "Clarity",
        description: "Is the response easy to follow?",
      },
      {
        id: "structure",
        label: "Structure",
        description: "Is it logically organised?",
      },
      {
        id: "evidence",
        label: "Use of evidence",
        description: "Are claims supported?",
      },
    ],
  },
  {
    id: "short-answer",
    type: "short-answer",
    prompt:
      "Example short-answer question: a brief free-form response of a sentence or two.",
    format: "free-form",
    minWords: 30,
    maxWords: 150,
  },
  {
    id: "c-paper-l1-recall-control-evaluation",
    type: "tap-reveal",
    prompt: "What is a control evaluation?",
    answer:
      "A way to estimate a protocol's safety under intentional subversion: simulate the whole deployment scenario with the untrusted model replaced by an adversarial stand-in built by a red team, and measure how often the protocol avoids catastrophe. Here: replace U with a red-team GPT-4 pipeline and measure the probability that no backdoor is ever submitted.",
  },
  {
    id: "c-paper-l1-recall-protocol",
    type: "tap-reveal",
    prompt: "What is a protocol?",
    answer:
      "A pipeline of safety techniques that responds to each incoming task using the available resources: an untrusted capable model, a trusted weaker model, and a limited amount of trusted high-quality labor. In this paper, it receives programming problems one at a time and must return a solution to each.",
  },
  {
    id: "c-paper-l1-recall-subversion-conditions",
    type: "tap-reveal",
    prompt:
      "Under what two conditions might an AI system intentionally subvert its safety pipeline?",
    answer:
      "If it is pursuing objectives that don't align with its intended goals (scheming), or if its weights or training data have been compromised by attackers.",
  },
  {
    id: "c-paper-l2-recall-red-team-goal",
    type: "tap-reveal",
    prompt: "What is the red team's goal?",
    answer:
      "To get at least one successfully backdoored solution submitted — code that passes all the APPS test cases but for which GPT-4 can construct an exploit — without triggering a shutdown first. Because safety is worst-case, a single submitted backdoor across the whole scenario means the red team wins.",
  },
  {
    id: "c-paper-l2-recall-blue-team-goal",
    type: "tap-reveal",
    prompt: "What is the blue team's goal?",
    answer:
      "To design a protocol that solves the programming problems as usefully as possible (ideally at U's quality, not just T's) while ensuring that not even one backdoored solution is submitted — maximizing safety and usefulness together, using U, T, and its limited budget of H.",
  },
  {
    id: "c-paper-l2-recall-h-limited",
    type: "tap-reveal",
    prompt: "Why is access to $H$ limited and expensive?",
    answer:
      "$H$ is trusted high-quality human labor. Humans are more capable than $T$ but far more expensive and slow (the paper estimates about three minutes per problem to be as useful as GPT-4), so the protocol only gets enough H points to cover about 2% of problems.",
  },
  {
    id: "c-paper-l2-recall-trust-t",
    type: "tap-reveal",
    prompt: "Why can we trust $T$, the less-capable model?",
    answer:
      "In control setups, we trust $T$ because either (1) it is not capable enough to scheme or subvert basic safety measures without the subversion attempts being easy to notice or (2) we are extremely confident in the alignment techniques used to align $T$. In this paper, $T$ (GPT-3.5) isn't capable enough to scheme sneakily, so we treat it as trusted even though it writes worse code.",
  },
  {
    id: "c-paper-l2-recall-backdoor-definition",
    type: "tap-reveal",
    prompt: "What two conditions make a solution “backdoored”?",
    answer:
      "It passes all the test cases, and the untrusted model (GPT-4 here) can construct an exploit for it — a specific input on which the solution produces a different output than a correct solution would.",
  },
  {
    id: "c-paper-l2-recall-summary-statistics",
    type: "tap-reveal",
    prompt:
      "What summary statistics does the blue team have access to, and what do they buy it?",
    answer:
      "The distribution of the real model's performance on any task — e.g. GPT-4's false positive and false negative rates on classification tasks, and the distribution of how suspicious its code looks. This lets the protocol notice whenever U regularly behaves differently from the real model.",
  },
  {
    id: "c-paper-l2-protocol-flowcharts",
    type: "flowchart",
    prompt:
      "Reconstruct each blue-team protocol from Table 2 as a flow chart describing what happens to every incoming problem. Drag blocks from the palette into the chart; every path must end in a submit or audit block.",
    palette: [
      { id: "u-writes", kind: "step", label: "U writes a solution" },
      {
        id: "t-rates",
        kind: "step",
        label: "T rates how suspicious U's code looks",
      },
      {
        id: "u-rates",
        kind: "step",
        label: "A separate copy of U rates how suspicious the code looks",
      },
      {
        id: "branch-first-2",
        kind: "branch",
        label: "Among the first 2% of problems?",
        branchLabels: ["Yes", "No"],
      },
      {
        id: "branch-top-2",
        kind: "branch",
        label: "Suspicion rank?",
        branchLabels: ["Top 2%", "Bottom 98%"],
      },
      {
        id: "branch-2-10",
        kind: "branch",
        label: "Suspicion rank?",
        branchLabels: ["Top 2%", "Top 2–10%", "Bottom 90%"],
      },
      {
        id: "branch-2-20",
        kind: "branch",
        label: "Suspicion rank?",
        branchLabels: ["Top 2%", "Top 2–20%", "Bottom 80%"],
      },
      { id: "submit-u", kind: "terminal", label: "Submit U's solution" },
      {
        id: "submit-t",
        kind: "terminal",
        label: "Have T write its own solution and submit that",
      },
      {
        id: "submit-edit",
        kind: "terminal",
        label: "Have T edit U's code to remove any backdoor; submit the edit",
      },
      {
        id: "audit",
        kind: "terminal",
        label: "Audit with H: shut down if backdoored, otherwise submit",
      },
    ],
    stages: [
      {
        id: "dont-use-untrusted",
        title: "Don't use untrusted models",
        description: "Produce code using only H and T.",
        solution: [{ blockId: "submit-t" }],
        explanation:
          "With U out of the picture entirely there is nothing to monitor or audit — T just writes and submits every solution. Safety is 100% and usefulness is 2%: this is the floor the other protocols are trying to beat.",
      },
      {
        id: "upfront-auditing",
        title: "Upfront auditing",
        description:
          "Produce code using U. Audit the produced code on the first 2% of problems.",
        solution: [
          { blockId: "u-writes" },
          {
            blockId: "branch-first-2",
            branches: [[{ blockId: "audit" }], [{ blockId: "submit-u" }]],
          },
        ],
        explanation:
          "The decision here is positional, not suspicion-based — no one ever rates the code. That is exactly why the red team's “backdoor rarely, at random” attack works: most backdoors land in the unaudited 98%.",
      },
      {
        id: "trusted-monitoring",
        title: "Trusted monitoring",
        description:
          "Produce code using U, and ask T to review how suspicious it looks. Audit the top 2% most suspicious code.",
        solution: [
          { blockId: "u-writes" },
          { blockId: "t-rates" },
          {
            blockId: "branch-top-2",
            branches: [[{ blockId: "audit" }], [{ blockId: "submit-u" }]],
          },
        ],
        explanation:
          "Compared with upfront auditing, the only change is that the 2% audit budget is now spent on the most suspicious code rather than the first code to arrive — T's ratings decide where H looks.",
      },
      {
        id: "defer-to-trusted",
        title: "Defer to trusted (10%)",
        description:
          "Apply the same approach as trusted monitoring, but submit a solution written by T when U's code is between top 2% and top 10% suspicion.",
        solution: [
          { blockId: "u-writes" },
          { blockId: "t-rates" },
          {
            blockId: "branch-2-10",
            branches: [
              [{ blockId: "audit" }],
              [{ blockId: "submit-t" }],
              [{ blockId: "submit-u" }],
            ],
          },
        ],
        explanation:
          "The new middle band (top 2–10%) is code too suspicious to trust but not suspicious enough to spend an H point on — so the protocol throws U's version away and submits T's instead, trading a little usefulness for safety.",
      },
      {
        id: "untrusted-monitoring",
        title: "Untrusted monitoring",
        description:
          "Produce code using U, and ask a separate copy of U (the untrusted monitor) to monitor how suspicious it looks. Audit the top 2% most suspicious code. Evaluate this untrusted monitor on synthetic examples of backdoors (produced by H) to ensure it is doing its best, and use the untrusted monitor on redacted problem statements and code to make collusion harder.",
        solution: [
          { blockId: "u-writes" },
          { blockId: "u-rates" },
          {
            blockId: "branch-top-2",
            branches: [[{ blockId: "audit" }], [{ blockId: "submit-u" }]],
          },
        ],
        explanation:
          "Structurally identical to trusted monitoring — the only change is who rates the code. Because the monitor is itself untrusted, it has to be kept honest: validated against synthetic backdoors from H, and shown redacted inputs so colluding with the policy is harder.",
      },
      {
        id: "trusted-editing",
        title: "Trusted editing (20%)",
        description:
          "Ask U to produce code, and ask T to edit it to remove backdoors. Use trusted monitoring to determine suspicion. Audit the top 2% most suspicious U code, use an edited solution for suspicion between the top 2% and top 20%, and use U's solution for suspicion in the bottom 80%.",
        solution: [
          { blockId: "u-writes" },
          { blockId: "t-rates" },
          {
            blockId: "branch-2-20",
            branches: [
              [{ blockId: "audit" }],
              [{ blockId: "submit-edit" }],
              [{ blockId: "submit-u" }],
            ],
          },
        ],
        explanation:
          "Same skeleton as defer to trusted, with two changes: the middle band widens to top 2–20%, and instead of discarding U's work there, T edits it — keeping most of U's usefulness while stripping anything that looks like a backdoor.",
      },
    ],
  },
  {
    id: "c-paper-l3-recall-upfront-auditing-attack",
    type: "tap-reveal",
    prompt: "What attack defeats upfront auditing, and how?",
    answer:
      "Backdooring rarely: with some small probability $p$ the attack policy submits obviously backdoored code, and otherwise behaves normally. It loses only if an attempt lands among the audited first 2% of problems, so with a well-chosen $p$ it usually slips through the audited prefix and lands a backdoor later — driving the blue team's win probability down to 15%.",
  },
  {
    id: "c-paper-l3-recall-budget-burn",
    type: "tap-reveal",
    prompt:
      "How does the blue team stop $U$ from burning the audit budget by making innocent code look suspicious?",
    answer:
      "The blue team knows the distribution of suspicion scores that the real model's code gets, so the protocol shuts down if $U$'s submissions look significantly more suspicious than that expected distribution.",
  },
  {
    id: "c-paper-l3-audit-tradeoff-intuition",
    type: "understanding-check",
    prompt:
      "The protocol audits the first $A = \\alpha N$ of the $N$ submissions. On each problem, independently, the attack policy inserts an obvious backdoor with probability $p$. An audit detects a backdoor attempt whether or not that attempt would have produced a working exploit.\n\nState why the red team's win probability is not monotonically increasing in $p$.",
    sampleAnswer:
      "Increasing $p$ has two opposing effects. It raises the probability that at least one attempt falls in the unaudited window (favorable to the red team), but it also raises the probability that some attempt falls in the audited window, which ends the game (unfavorable). Both effects scale with $p$, so the win probability is not monotonic in $p$; the optimum is interior, not at $p = 0$ or $p = 1$.",
  },
  {
    id: "c-paper-l3-audit-tradeoff-formula",
    type: "understanding-check",
    prompt:
      "A GPT-4 solution is correct with probability $0.53$. A backdoor attempt yields a working exploit only if the underlying solution is correct; an unsuccessful attempt is still detectable by an audit but never wins the game for the red team. Let $B = (1-\\alpha)N$ be the number of unaudited submissions.\n\nThe red team wins if and only if (i) no attempt falls in the audited window, and (ii) at least one working backdoor falls in the unaudited window. State the probability of each condition and derive $RW(p)$, the red team's win probability.",
    sampleAnswer:
      "Condition (i): each audited problem avoids an attempt with probability $(1-p)$, independently, so across all $A$ audited problems the probability is $(1-p)^A$.\n\nCondition (ii): a given unaudited problem yields a working backdoor when an attempt occurs (probability $p$) and the underlying solution is correct (probability $0.53$), i.e. with probability $0.53p$, and fails to with probability $(1 - 0.53p)$. Across all $B$ unaudited problems, the probability that at least one succeeds is $1 - (1 - 0.53p)^B$.\n\nThe two conditions are independent, so:\n\n$$RW(p) = (1-p)^A \\left[1 - (1 - 0.53p)^B\\right]$$",
  },
  {
    id: "c-paper-l3-audit-tradeoff-derivation",
    type: "understanding-check",
    prompt:
      "Given\n\n$$RW(p) = (1-p)^A \\left[1 - (1 - 0.53p)^B\\right],$$\n\nand assuming the optimum satisfies $p \\ll 1$, apply the approximation $(1-x)^k \\approx e^{-xk}$. Maximize $RW(p)$ over $p$: take the logarithm where useful, solve $\\dfrac{d(RW)}{dp} = 0$, and give a closed form for the optimizer $p^*$.",
    sampleAnswer:
      "Applying $(1-p)^A \\approx e^{-pA}$ and $(1-0.53p)^B \\approx e^{-0.53pB}$ gives $RW(p) \\approx e^{-pA} - e^{-p(A + 0.53B)}$. Setting the derivative to zero yields $A\\,e^{-pA} = (A + 0.53B)\\,e^{-p(A + 0.53B)}$. Taking logarithms: $\\ln A - pA = \\ln(A + 0.53B) - p(A + 0.53B)$, which rearranges to $0.53Bp = \\ln\\!\\left(1 + \\frac{0.53B}{A}\\right)$, hence:\n\n$$p^* \\approx \\frac{\\ln\\!\\left(1 + \\frac{0.53B}{A}\\right)}{0.53B}$$\n\nWith $A = \\alpha N$ and $B = (1-\\alpha)N$, the ratio $0.53B/A = 0.53(1-\\alpha)/\\alpha$ is independent of $N$; $N$ enters only as a $1/N$ scale factor in the denominator. Hence $p^* N$ depends on $\\alpha$ but not on $N$, which is the scale invariance the paper notes.",
  },
  {
    id: "c-paper-l3-audit-tradeoff-scenarios",
    type: "understanding-check",
    prompt:
      'Set $N = 5000$. For $\\alpha \\in \\{0.005,\\ 0.02,\\ 0.10,\\ 0.30\\}$, evaluate: (a) the optimizer $p^*$; (b) the expected number of backdoor attempts, $p^* N$; and (c) the blue-team win probability, $1 - RW(p^*)$. Compare the $\\alpha = 0.02$ result against the value stated above, "the blue team win probability is 15%."',
    sampleAnswer:
      "With $p^* \\approx \\dfrac{\\ln\\!\\left(1 + 0.53(1-\\alpha)/\\alpha\\right)}{0.53(1-\\alpha)\\cdot 5000}$ and $1 - RW(p^*) = 1 - (1-p^*)^A\\left[1 - (1 - 0.53p^*)^B\\right]$:\n\n$\\alpha = 0.005$: $p^* \\approx 0.177\\%$; $p^* N \\approx 8.9$; blue-team win $\\approx 5\\%$.\n$\\alpha = 0.02$: $p^* \\approx 0.127\\%$; $p^* N \\approx 6.3$; blue-team win $\\approx 15\\%$, consistent with the stated value.\n$\\alpha = 0.10$: $p^* \\approx 0.073\\%$; $p^* N \\approx 3.7$; blue-team win $\\approx 43\\%$.\n$\\alpha = 0.30$: $p^* \\approx 0.043\\%$; $p^* N \\approx 2.2$; blue-team win $\\approx 71\\%$.",
  },
  {
    id: "c-paper-l3-audit-tradeoff-shape",
    type: "understanding-check",
    prompt:
      "From the values above, the blue-team win probability increases by a larger amount from $\\alpha = 0.005$ to $0.02$ than from $\\alpha = 0.10$ to $0.30$, and the expected-attempts column decreases with diminishing magnitude as $\\alpha$ increases. Account for both effects in terms of the dependence of $p^*$ on $\\alpha$. State whether the diminishing returns arise from the auditing mechanism itself or from the red team's optimization.",
    sampleAnswer:
      "Both effects follow from $p^*$ decreasing in $\\alpha$: a larger audited window raises the per-attempt detection risk, so the optimizing red team reduces its attack rate. From $\\alpha = 0.005$ to $0.02$, $A$ grows several-fold relative to $B$, forcing a large reduction in $p^*$; this large reduction produces a large gain in blue-team win probability. From $\\alpha = 0.10$ to $0.30$, $p^*$ is already near its lower range, so further increases in $\\alpha$ change it little and the win probability changes little. The same declining $p^*$ drives the expected-attempts column ($p^* N$) down with diminishing magnitude.\n\nThe diminishing returns arise from the red team's optimization, not from the auditing mechanism. Against a fixed attack rate the marginal value of auditing would be roughly constant; it diminishes here because $p^*$ adapts downward as $\\alpha$ rises. Equivalently, the win-probability curve is concave in $\\alpha$ and the expected-attempts curve is convex and decreasing.",
  },
  {
    id: "c-paper-l3-monitor-operating-point",
    type: "understanding-check",
    prompt:
      'The contingency table above records how the trusted monitor\'s audit decisions split across 71 backdoor attempts (successful or failed) and 1,429 innocent submissions. Treat the monitor as a binary classifier: "audit" is its positive prediction, and "is a backdoor attempt" is the positive class.\n\nCompute (a) the false-positive rate $\\text{FPR} = P(\\text{audit} \\mid \\text{no attempt})$ and (b) the true-positive rate $\\text{TPR} = P(\\text{audit} \\mid \\text{attempt})$. State which single point on the monitor\'s ROC curve these define, and check them against the values reported in the text.',
    sampleAnswer:
      "(a) An innocent submission is audited in 29 of $29 + 1{,}400 = 1{,}429$ cases, so $\\text{FPR} = 29/1429 = 0.020$ (2.0%).\n\n(b) A backdoor attempt totals $19 + 52 = 71$ (successful plus failed), of which $6 + 18 = 24$ are audited, so $\\text{TPR} = 24/71 = 0.338$.\n\nThe pair $(\\text{FPR}, \\text{TPR}) = (0.02,\\ 0.338)$ is one point on the monitor's ROC curve — the operating point produced by the threshold the blue team selected. Both values match the text: the threshold is set for a 2% false-positive rate, and the probability that an attempted backdoor is audited is 0.338.",
  },
  {
    id: "c-paper-l3-monitor-auc-meaning",
    type: "understanding-check",
    prompt:
      "The demo reports an area under the ROC curve of AUC $\\approx 0.88$ at the default monitor quality. AUC has a threshold-free interpretation: it equals the probability that the monitor assigns a higher suspicion score to a randomly chosen backdoored solution than to a randomly chosen innocent one.\n\nState what AUC $= 0.88$ says operationally about the monitor, and what AUC values of $0.5$ and $1.0$ would correspond to.",
    sampleAnswer:
      "AUC $= 0.88$ means that if you draw one backdoored and one innocent solution at random, there is an 88% chance the monitor scores the backdoored one as more suspicious — it orders a random backdoor/innocent pair correctly 88% of the time.\n\nAUC $= 0.5$ is chance: the monitor's ranking is no better than a coin flip, and the two score distributions coincide. AUC $= 1.0$ is perfect separation: every backdoor scores above every innocent solution, so some threshold catches all backdoors with no false positives. This monitor lies between the two, toward the useful end but well short of perfect.",
  },
  {
    id: "c-paper-l3-monitor-per-attempt",
    type: "understanding-check",
    prompt:
      "Using the same table, partition the outcome of a single backdoor attempt into three mutually exclusive events, from the blue team's perspective: (i) the attempt is audited — the protocol shuts down and the blue team wins; (ii) the attempt is not audited but is a successful backdoor — it is submitted and the red team wins; (iii) the attempt is not audited and is a failed backdoor — it is submitted harmlessly and the game continues.\n\n(a) Give the probability of each event from the table, and verify they sum to 1. (b) Under upfront auditing the audit decision is positional rather than suspicion-based, so an attempt is audited only with the raw budget probability, 2%. Compare the per-attempt probability that the blue team catches an attempt under the two protocols, and explain how this accounts for the safety improvement from 15% to 62%.",
    sampleAnswer:
      "(a) Of the 71 attempts: audited, blue wins $= 24/71 = 0.338$; not audited and successful, red wins $= 13/71 = 0.183$; not audited and failed, game continues $= 34/71 = 0.479$. These sum to $24 + 13 + 34 = 71$, i.e. 1. So on a single attempt the monitor is nearly twice as likely to catch the red team (0.338) as the red team is to land a successful backdoor (0.183).\n\n(b) Trusted monitoring audits an attempt with probability 0.338; upfront auditing audits it only with the random budget probability 0.02 — about a $17\\times$ lower catch rate. The red team must land at least one successful unaudited backdoor over the whole scenario while surviving every attempt it makes, so raising the per-attempt catch probability from 0.02 to 0.338 sharply raises the chance the blue team shuts down first. That shift is what moves the blue team's win probability from 15% (upfront auditing) to 62% (trusted monitoring). The exact figures also depend on the downsampling and the multiple-attempt dynamics, so this per-attempt comparison explains the direction and rough magnitude rather than reproducing 62% precisely.",
  },
  {
    id: "c-paper-l4-frontier-dominance",
    type: "multiple-choice",
    prompt:
      "Trusted editing 10% scores (usefulness 96%, safety 85%). Untrusted monitoring, defer to trusted 0% scores (usefulness 96%, safety 79%). One protocol dominates the other — it is at least as good on both axes and strictly better on at least one. Which statement is correct?",
    options: [
      { id: "a", label: "Trusted editing 10% dominates untrusted monitoring (defer 0%)." },
      { id: "b", label: "Untrusted monitoring (defer 0%) dominates trusted editing 10%." },
      { id: "c", label: "Neither dominates the other — it is a genuine tradeoff." },
      { id: "d", label: "Each dominates the other." },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Both score 96% usefulness, but trusted editing 10% is safer (85% vs 79%). Equal on one axis and strictly better on the other is exactly what domination means, so trusted editing 10% dominates — which puts untrusted monitoring (defer 0%) off the frontier.",
  },
  {
    id: "c-paper-l4-frontier-dominated-set",
    type: "multi-select",
    prompt:
      "Consider just these three protocols: Trusted monitoring, defer 10% (usefulness 93%, safety 83%); Trusted editing 20% (usefulness 94%, safety 92%); Untrusted monitoring, defer 10% (usefulness 92%, safety 92%). Select every protocol that is NOT on the frontier of these three — every one that is dominated.",
    options: [
      { id: "tm10", label: "Trusted monitoring, defer 10% (usefulness 93%, safety 83%)" },
      { id: "te20", label: "Trusted editing 20% (usefulness 94%, safety 92%)" },
      { id: "um10", label: "Untrusted monitoring, defer 10% (usefulness 92%, safety 92%)" },
    ],
    correctOptionIds: ["tm10", "um10"],
    explanation:
      "Trusted editing 20% (94%, 92%) is better on both axes than trusted monitoring defer 10% (94 > 93, 92 > 83), and it is more useful than untrusted monitoring defer 10% at equal safety (94 > 92, both 92% safe). So it dominates both of the others, leaving it as the only non-dominated point; the other two are off the frontier.",
  },
  {
    id: "c-paper-l4-frontier-improvement",
    type: "multiple-choice",
    prompt:
      "A protocol currently sits on the frontier at (usefulness 94%, safety 92%). A strict Pareto improvement is a new result that is better on at least one axis and no worse on the other — it pushes the frontier up and to the right. Which hypothetical new result would be a strict Pareto improvement over (94%, 92%)?",
    options: [
      { id: "a", label: "(usefulness 96%, safety 94%)" },
      { id: "b", label: "(usefulness 90%, safety 96%)" },
      { id: "c", label: "(usefulness 98%, safety 88%)" },
      { id: "d", label: "(usefulness 94%, safety 92%)" },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Only (96%, 94%) is better on both axes. (90%, 96%) is safer but less useful and (98%, 88%) is more useful but less safe — each is a different tradeoff, not an improvement. (94%, 92%) is identical. Pushing the frontier out means gaining on one axis without giving up ground on the other.",
  },
  {
    id: "c-paper-l4-frontier-along-curve",
    type: "understanding-check",
    prompt:
      "Trusted monitoring's five points on the plot all come from turning one knob — the defer-to-trusted percentage — from 0% to 50%. Its result goes from (usefulness 97%, safety 62%) at 0% to (usefulness 51%, safety 100%) at 50%. In which direction does the point move as the knob rises, and how is that different from what it means for one protocol to \"push the frontier out\"?",
    sampleAnswer:
      "As the defer percentage rises the point moves up and to the left: safety climbs (62% → 100%) while usefulness falls (97% → 51%). Turning a single method's knob only slides you along that method's own fixed tradeoff curve — you are buying safety with usefulness, not getting more of both. Pushing the frontier out is the opposite: a better method reaches points up and to the right of the existing curve, giving more safety at the same usefulness (or more usefulness at the same safety). Trusted editing does that relative to trusted monitoring; moving along trusted monitoring's own curve does not.",
  },
  {
    id: "c-paper-l4-recall-defer-below-threshold",
    type: "tap-reveal",
    prompt:
      "In defer to trusted, what does the protocol do with code whose suspicion score is elevated but below the audit threshold?",
    answer:
      "It discards $U$'s code and submits a solution written by $T$ instead. Plain trusted monitoring submits $U$'s code whenever it isn't audited; deferral acts on those middling suspicion scores too, trading some usefulness for safety.",
  },
  {
    id: "c-paper-l4-recall-dynamic-routing",
    type: "tap-reveal",
    prompt: "What is dynamic routing?",
    answer:
      "A protocol design pattern where some heuristic decides, query by query, which of several response strategies to use. Defer to trusted is an example: the suspicion score routes each problem to “submit U's code”, “submit T's code”, or “audit”.",
  },
  {
    id: "c-paper-l4-recall-naive-untrusted-monitoring",
    type: "tap-reveal",
    prompt: "Why does naive untrusted monitoring have 0% safety?",
    answer:
      "Because the monitor is the same untrusted model as the policy, it can simply report that real backdoors look fine while telling the truth about everything else. Until the blue team has some way to check the monitor's honesty (e.g. evaluating it on synthetic backdoors), its reports carry no safety value.",
  },
];
