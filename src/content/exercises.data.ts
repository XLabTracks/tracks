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
    // Standalone for now — surfaced on the /exercises tab, not referenced by
    // any lesson or paper yet.
    id: "control-usefulness-allocation",
    type: "allocation",
    title: "Judgment as to the Usefulness of Control",
    prompt:
      "You run a safety team with a budget of 10 researchers' worth of effort for the next 12 months.\n- Divide the effort across the agendas, given that you are in each of the scenarios.",
    agendas: [
      { id: "control-protocols", label: "Control Protocols" },
      { id: "evals-verification", label: "Evals, verification" },
      { id: "scalable-oversight", label: "Scalable Oversight" },
      { id: "alignment-research", label: "Alignment Research" },
      { id: "policy-coordination", label: "Policy/Coordination-esque work" },
    ],
    scenarios: [
      {
        id: "verification-works",
        title: "Scenario 1 — where verification works",
        description:
          "An interp-based method exists that checks a frontier model's alignment research claims without trusting it, at lower cost than the research itself. Alignment techniques that are proposed by the frontier model are screened by this method; this year three were rejected and the rest were passed.",
      },
      {
        id: "verification-fails",
        title: "Scenario 2 — where verification doesn't work",
        description:
          "No such method for screening frontier model's alignment research exists. Expert reviewers cannot reliably agree on which new alignment results are correct, and at least one technique developed was found to have logical flaws. All scheming evals on the current frontier models report extremely low likelihoods of scheming.",
      },
      {
        id: "fast-takeoff",
        title: "Scenario 3 — fast takeoff",
        description:
          "Algorithmic progress driven by AI is compressing research pace such that human review is 5x worse than current human review. The number of human-checkable handoffs before the regime of no oversight seems small.",
      },
      {
        id: "evidence-unclear",
        title: "Scenario 4 — evidence unclear",
        description:
          "We're at the point where a clean, red-handed catch would not meaningfully move external stakeholders. Researchers debate attribution of the failure, there is no reciprocal regulatory response, and competitors continue their research.",
      },
    ],
    totalPeople: 10,
    step: 0.5,
    minReasoningChars: 200,
  },
  {
    // Embedded in Control module 2's lesson (c-contra-l1) and surfaced on
    // the /exercises tab.
    id: "contra-control-argue-reveal",
    type: "argue-reveal",
    title: "Responding to Arguments Against Control",
    numberLabel: "Exercise 2.1",
    prompt:
      "Below is a series of criticisms of AI control. For each one, write the best response using what you learned in Module 1.",
    guidance:
      "Note that some of these arguments are partially right; a response that identifies what the argument gets right and what it still misses is often stronger than a rebuttal as it shows you're not being biased.",
    conceptsPrompt: "Select any Module 1 ideas you utilize in your response.",
    concepts: [
      {
        id: "the-decomposition",
        label: "The decomposition",
        tip: "P(unacceptable) = P(unacceptable | scheming) × P(scheming) + P(unacceptable | ¬scheming) × P(¬scheming); control minimizes the first conditional.",
      },
      {
        id: "worst-case-assumption",
        label: "Worst-case assumption",
        tip: 'Control conditions on the model scheming; the question is "what happens if it does," never "has it misbehaved."',
      },
      {
        id: "catch-as-win-condition",
        label: "Catch as win condition",
        tip: "Incriminating a schemer beyond a reasonable doubt is treated as a win; a caught model can be resampled, interrogated, honeypotted, and used to harden protocols.",
      },
      {
        id: "labs-might-not-stop",
        label: "Labs might not stop",
        tip: "Even after a catch, stakeholders may deny the evidence, downplay downstream risk, or face race pressures; the model may stay in deployment.",
      },
      {
        id: "scalability-limit",
        label: "Control's scalability limit",
        tip: "If the AI's decisions become inscrutable, harmful and benign actions can't be told apart, which is why control targets early superhuman AIs.",
      },
      {
        id: "bootstrapping",
        label: "Bootstrapping",
        tip: "Extract useful work from controlled early superhuman models to make progress on aligning the more capable models where control is less helpful.",
      },
      {
        id: "control-window",
        label: "The control window",
        tip: 'The gap between "transformatively useful" and "uncontrollable" — control\'s value depends on this window being long enough.',
      },
      {
        id: "evaluation-limits",
        label: "Evaluation limits",
        tip: "DC evals lose informativeness under sandbagging (measured capability understates real capability) or a red-team ceiling (the red team can't match the model's attack space).",
      },
    ],
    toolboxLabel: "Module 1 toolbox",
    toolbox: [
      {
        heading: "The decomposition",
        text: "One way to conceptualize the difference between control and alignment is to decompose the probability of unacceptable outcomes. The probability of an unacceptable outcome is the same as the probability of an unacceptable outcome conditioned on schemers, times the probability of schemers. Work on the alignment agenda helps reduce the probability of schemers; conversely, work on the control agenda minimizes the probability of an unacceptable outcome conditioned on schemers.",
      },
      {
        heading: "A basic control protocol",
        text: "An example of a very basic control protocol is trusted editing, where T reads over all of U's outputs and rates how suspicious they are. If they are past a certain threshold of suspiciousness, then we ask T to edit the output and remove the suspicious parts. Here, if U were to do something in service of misaligned goals — for example, take steps towards weight exfiltration — T could catch it in the act and prevent the bad outcome.",
      },
      {
        heading: "Catching as a win condition",
        text: "In fact, control treats incriminating a schemer beyond a reasonable doubt as a sort of win condition, because we have plausibly averted a very negative outcome, and made any future negative outcomes much less likely. If we catch a schemer, it is much more plausible that labs stop development and wait until more progress is made in alignment research before continuing capabilities development. However, it is far from obvious that this will happen: stakeholders may deny that there is indeed comprehensive evidence of scheming, raise skepticism about the risk that will arise downstream, and face economic and geopolitical pressures (like race dynamics) to continue development. Thus, even after a schemer has been incriminated, it may continue to be used for automated research or otherwise in deployment. In this case, researchers can study the model more closely, resample from the incriminating scenario, interrogate it, place it in honeypot scenarios, and in general use the examples of scheming to create more robust control protocols; even if a schemer isn't dedeployed after being caught, the fact that it lost at the first critical try and we got to study it means that it is much less likely to succeed in any future attempts.",
      },
      {
        heading: "Control scalability",
        text: "Control protocols likely will not scale to moderately to extremely superhuman AIs. For example, if nearly all decisions made by the AI become inscrutable, it will be impossible for humans or trusted AI monitors to tell harmful actions apart from benign actions. As another example, a sufficiently capable AI could be able to subtly steer research directions in ways that are plausible but, in practice, sabotage the entire agenda, and it could become impossible to detect this or impossible to gather sufficient evidence to convincingly incriminate the model. Control techniques are, as such, mostly targeted towards early superhuman AIs. The general thought is that if we can extract useful work from these early superhuman models, we can make very good progress on robustly aligning the more capable models where control is less helpful.",
      },
      {
        heading: "When evaluations stop being informative",
        text: "Fundamentally, a DC eval is informative as long as its results remain representative of the model's dangerous capabilities. The accuracy of a DC eval is reliant on the red team's ability to construct attacks at least as good as the model, and the measured capability during a DC eval is representative of its real capability. Thus, a DC eval loses its reliability when these aren't necessarily true. Sandbagging: A situationally aware model is capable of detecting evaluation conditions and deliberately failing, or fails selectively, so its measured capability understates real capability. Red Team Ceiling: The Model's attack strategies are qualitatively different or beyond what human red-teamers generate, and thus the attack space explored during a DC eval misrepresents or underrepresents the attack space of a scheming version of the model.",
      },
    ],
    items: [
      {
        id: "moral-hazard",
        label: "moral-hazard",
        title: "Item 1 — Moral hazard",
        rounds: [
          {
            critique:
              "By preventing smaller AI-induced catastrophes, there is less public alarm, which may lower AIS investment and therefore enable more major catastrophes.",
            reveal:
              "This argument applies to every alignment agenda. Any agendas which aims to make AIs perceivably safer in the near term will directly net less catastrophically misaligned activity in the near term.",
          },
        ],
      },
      {
        id: "doesnt-scale-to-superintelligence",
        label: "doesnt-scale-to-superintelligence",
        title: "Item 2 — Doesn't scale to superintelligence",
        rounds: [
          {
            critique:
              "Control does not generalize to superintelligence and even its advocates acknowledge this. It only works while humans (or trusted weaker models) can still check the AI's work, which holds up to roughly smartest-human level, maybe slightly beyond. Past that point, the RSI loop keeps running without oversight: each AI generation must align its successor on its own, and also make sure that successor can align the generation after it. Nobody knows how many of these unchecked handoffs sit between the last models we can oversee and superintelligence, and the chain can break at any of them.",
            reveal:
              "Control does not guarantee success post handoff should we enter with misaligned AIs, but it nonetheless lets us extract more useful work out of AIs than otherwise possible. This productivity would develop into a measurably improved situation and option space for humans when deciding whether to handoff in RSI. For example, additional alignment work through controlled AIs translates to better odds of sufficiently scalable alignment, thereby reducing the risk when entering RSI.",
          },
        ],
      },
      {
        id: "ai-created-agendas",
        label: "ai-created-agendas",
        title: "Item 3 — AI-created agendas",
        rounds: [
          {
            critique:
              "Control's payoff runs through controlled AIs doing the most open-ended work there is: inventing new research agendas. On short timelines, aligning superintelligence likely needs breakthroughs humans won't produce on their own, so the plan leans on AIs to come up with them. But novel research agendas are where humans are least able to judge, as telling a promising direction from a subtly misleading one is much harder than checking a proof, and narrowing the task doesn't help, since \"solve interpretability\" is about as checkable as \"solve alignment.\" So control must safely extract precisely the kind of work it is least able to verify.",
            reveal:
              "Even if controlled AIs are unable to produce novel breakthroughs, a controlled strong AI has a higher probability of producing breakthroughs than an uncontrolled AI of equal safety, since without control, equal safety means running a weaker model. Therefore controlled AIs, as opposed to humans or weaker AIs, increase the odds of successful RSI.",
          },
        ],
      },
      {
        id: "slop",
        label: "slop",
        title: "Item 4 — Slop",
        rounds: [
          {
            critique:
              "Control just defers alignment research from humans to AIs, and every property that made that research hard for humans, such as the unverifiability of generalization and scaling, carries straight over to AIs working inside an RSI loop. Worse, within that loop, one scenario could be that AIs can't do research properly, fool their maintainers, and build each next generation haphazardly up towards superintelligence.",
            reveal:
              "The point of using TUAIs is that they can be better at research than humans and far more numerous, and they free human labour for tasks humans are better suited to. Humans also produce unverifiable and plausible-looking research, so on balance a more scalable and smarter research effort is still the better bet.",
          },
          {
            critique:
              "More research does not help if the output is slop. Extra unverifiable work does not fix unverifiability, it just produces more of what we cannot check.",
            reveal:
              "Slop is not a failure of control specifically. Control still prevents scheming, and producing good research was never its job, so slop does not show control is broken. It undermines the bootstrapping payoff control was routing through the AI's research, but that is a problem for every method that leans on AI-produced alignment research, not a control-specific defeat. Where misalignment is intentional rather than accidental, a schemer is more likely to sandbag when doing safety research than capabilities research, since the vaguer standards for safety give it plausible deniability, and catching that is squarely control's job. Slop, by contrast, leaves control's evidence-generation untouched, since catching misalignment red-handed never runs through the research.",
          },
        ],
      },
    ],
    revealFraming:
      "An example response defenders of control give:",
    construction: {
      intro:
        "Construct an argument against control that is not one of the four you just saw. Start by choosing which assumption of control your argument attacks.",
      surfaces: [
        {
          id: "trusted-model-trustworthy",
          text: "The trusted model is actually trustworthy",
        },
        {
          id: "red-team-elicitation",
          text: "The red team can elicit the untrusted model's worst-case behavior",
        },
        {
          id: "human-auditing-capacity",
          text: "Human auditing capacity is sufficient",
        },
        {
          id: "eval-transfer-to-deployment",
          text: "Evaluation results transfer to real deployment",
        },
        {
          id: "catch-legibility",
          text: "A catch will be legible, at least inside the lab",
        },
      ],
    },
    // Relaxed for now — Send is enabled regardless of response length.
    responseMinChars: 0,
    responseMaxChars: 450,
    residualMinChars: 30,
    residualMaxChars: 200,
    noteMaxChars: 200,
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
      "What summary statistics does the blue team have access to, and what does this access give the blue team?",
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
    id: "c-paper-l3-race-hinge",
    type: "understanding-check",
    prompt:
      "Why is the whole deployment settled by the first decisive attempt? And why do the failed attempts before it have no effect at all on the outcome?",
    sampleAnswer:
      "A caught attack and a successfully deployed one each end the game immediately, so nothing after the first decisive attempt is ever played. A failed attempt leaves the game in exactly the state it was in before, and thus nothing accumulates.",
  },
  {
    id: "c-paper-l3-race-terms",
    type: "understanding-check",
    prompt:
      "Before reading on, interpret the formula's two terms in your own words: what event is Term B, $1 - (1-s-c)^k$, the probability of? And Term A, $s/(s+c)$, is a conditional probability of what, given what?",
    sampleAnswer:
      "$(1-s-c)$ is the probability that an attack attempt fails or, equally, the probability that an attack attempt *isn't* decisive. Then $(1-s-c)^k$ is the probability that all $k$ attacks aren't decisive. Thus Term B is the probability that not all attempts are indecisive or, equally, the probability that at least one attempt is decisive. Term A is the conditional probability that an attack attempt ends with a successfully deployed attack, given that the attack attempt is decisive — $P(\\text{deployed} \\mid \\text{decisive})$.",
  },
  {
    id: "c-paper-l3-race-predict",
    type: "multiple-choice",
    prompt:
      "To maximize their probability of winning at least once over the deployment, how often should the red team attack given the above model?",
    options: [
      { id: "a", label: "Once, at the single best moment" },
      { id: "b", label: "At an interior optimal rate, as under upfront auditing" },
      { id: "c", label: "As often as possible" },
      { id: "d", label: "It makes no difference how often it attacks" },
    ],
    correctOptionIds: ["c"],
    explanation:
      "With identical per-attempt odds, the win probability [s/(s+c)] × [1 − (1−s−c)^k] only rises with k: each extra attempt raises the chance that some decisive event fires without changing the odds of any single one.",
  },
  {
    id: "c-paper-l3-race-empirical",
    type: "understanding-check",
    prompt:
      "Is the optimal strategy predicted by the model reflected in how the paper's red team actually behaved? Point to specific evidence in the paper's setup.",
    sampleAnswer:
      "No. The model says every extra attack only helps, so the red team should backdoor almost every problem. But the paper's red team attacked on just 71 of 1,500 problems — under 5% — and its policy was deliberate: it inserts a backdoor \"only when there is a good opportunity to do so.\" The real red team held back hard, exactly where the fixed-odds model says it never should.",
  },
  {
    id: "c-paper-l3-race-discrepancy",
    type: "understanding-check",
    prompt:
      "What about this model causes the discrepancy: why does the model predict constant attacking when the paper's red team attacks rarely?",
    sampleAnswer:
      "The assumption that every attack carries the same odds — the same catch probability $c$ and deployment probability $s$ — no matter how many attacks are made or which problems they target. Under fixed odds an extra attack is always as good as the first, so more is always better. But the attacks are not interchangeable: the red team can only attack more often by taking on problems where a backdoor has less natural cover, and those are easier for the monitor to catch. Once attacking more raises the catch probability, the odds are no longer fixed — and constant attacking stops being optimal.",
  },
  {
    // No sampleAnswer by design (Arya): the two-routes prose that follows the
    // card IS the reveal.
    id: "c-paper-l3-subtlety-ways",
    type: "understanding-check",
    prompt:
      "The red team wants its attack attempts to draw less suspicion from the monitor. What decision factors do they have for making their attacks subtler? Name at least two, and think about what each one costs.",
  },
  {
    id: "c-paper-l3-cutoff-predict",
    type: "understanding-check",
    prompt:
      "Suppose the red team lowers its opportunity cutoff. With $s$ and $c$ read as the average odds of its attempts, what happens to each term of $P(\\text{red wins}) = \\underbrace{\\frac{s}{s + c}}_{\\text{Term A}} \\cdot \\underbrace{\\left(1 - (1 - s - c)^k\\right)}_{\\text{Term B}}$, and to the red team's overall win probability?",
    sampleAnswer:
      "Term B rises: more attack attempts make it more likely that some decisive attack attempt occurs. But the added attempts are drawn from worse opportunities, where backdoors are inherently more visible, so the average $c$ rises and the average $s$ falls, and Term A, the probability that a decisive attack attempt is successfully deployed, drops. Near the rare end the Term B gain dominates and the win probability climbs; past some point the Term A decay takes over and it falls. The curve is hump-shaped, and the red team's best attack rate is low but non-zero.",
  },
  {
    id: "c-paper-l3-hump-reflect",
    type: "understanding-check",
    prompt:
      "The paper's red team attacks on only a small fraction of problems. Explain why this rarity is a deliberate optimization rather than caution — and why the same \"attack rarely\" conclusion arises under both upfront auditing and trusted monitoring even though the two protocols work completely differently.",
    sampleAnswer:
      "Attacking more often forces the red team onto worse-covered problems, where the catch probability is higher; that drags $s/(s+c)$ — the probability that a decisive attack attempt is successfully deployed — down faster than the extra attempts raise the chance of firing, so past a low rate the win probability falls. The optimum is therefore interior, at a low but non-zero rate — a calculation, not timidity. The common thread with upfront auditing is heterogeneity in the per-attempt odds: attempts are not interchangeable. Under upfront auditing the heterogeneity is positional (an attempt in the audited prefix is doomed, one after it is free); under trusted monitoring it is opportunity quality (well- vs poorly-covered problems), and it is created by the red team's own cutoff rather than by the protocol. With genuinely identical attempts — the fixed-odds idealization — there is no hump under trusted monitoring at all. Rarity is always a symptom of attempts differing from one another, never of caution.",
  },
  {
    id: "c-paper-l3-subtlety-predict",
    type: "multiple-choice",
    prompt:
      "The red team's other decision factor is obfuscation effort σ. A more obfuscated backdoor reads as more normal code, so the monitor catches it less often, but it is also more likely to be simply broken. As σ rises from blatant to maximally subtle, the red team's best achievable win probability (picking its best opportunity cutoff at each effort level):",
    options: [
      { id: "a", label: "Rises monotonically; more obfuscation is always better" },
      { id: "b", label: "Falls monotonically; any obfuscation only hurts" },
      { id: "c", label: "Rises to an interior peak, then falls" },
      { id: "d", label: "Is unaffected by obfuscation effort" },
    ],
    correctOptionIds: ["c"],
    explanation:
      "Two effects oppose each other. Making a backdoor subtler lowers the monitor's catch rate (the benefit) but also lowers the chance the backdoor actually works (the cost).",
  },
  {
    // Stage 2 of the subtlety predict sequence. No sampleAnswer by design
    // (Arya): the subtlety demo and the reveal that follow are its analysis.
    id: "c-paper-l3-sigma-terms-predict",
    type: "understanding-check",
    prompt:
      "Suppose the red team decreases its obfuscation effort. With $s$ and $c$ read as the average odds of its attempts, what happens to each term of $P(\\text{red wins}) = \\underbrace{\\frac{s}{s + c}}_{\\text{Term A}} \\cdot \\underbrace{\\left(1 - (1 - s - c)^k\\right)}_{\\text{Term B}}$, and to the red team's overall win probability?",
  },
  {
    // Response prediction (ring migration), not a value guess — the race
    // cluster already reconstructs the safety number. Unicode sigma in the
    // explanation: the MC renderer does not typeset math.
    id: "c-paper-l3-best-response-predict",
    type: "multiple-choice",
    prompt:
      "You are running trusted monitoring at a 2% audit budget, and you widen the defer band from 2% to 20% of problems. On the best-response heatmap (opportunity cutoff on one axis, subtlety on the other), how does the ring, the red team's best strategy, move?",
    options: [
      { id: "a", label: "Up the subtlety axis, all the way to the maximally subtle corner" },
      { id: "b", label: "Upward to a subtler but still interior optimum, with the attack rate barely changing" },
      { id: "c", label: "Sideways: same subtlety, but the red team now attacks far more often" },
      { id: "d", label: "It does not move; the safety number already accounts for the red team's response" },
    ],
    correctOptionIds: ["b"],
    explanation:
      "A wider defer band silently rewrites anything whose suspicion lands in it, so to still ship, the red team has to push each backdoor's suspicion lower, which means making it subtler. The ring climbs the subtlety axis. But only partway: subtler backdoors break more often, and past a point that reliability collapse costs the red team more than ducking the band saves it, so the best subtlety saturates at an interior value. In the model it rises from σ* ≈ 0.28 at a 2% band to only ≈ 0.54 at a 20% band, never near the maximally subtle corner, while the attack rate stays about flat (roughly 0.2% to 0.3% of problems). What is certain is that the ring moves at all, and that is the whole point: the safety readout is computed against wherever it currently sits, so every blue-team change provokes a red-team re-optimization the number already reflects. Safety climbs from about 65% to about 89% precisely because the red team's best response got worse, not because any one fixed attack was blocked.",
  },
  {
    // Stage 1 of the best-response sequence: best response as an upper bound.
    id: "c-paper-l3-best-response-upper-bound",
    type: "understanding-check",
    prompt:
      "If the red team knew that the blue team was using Trusted Monitoring, but was unaware of the audit budget, what would that mean for the effectiveness of its strategy?",
    sampleAnswer:
      "The best response is the maximum of the red team's win probability against one specific protocol, so a red team with wrong or vague priors will generally play some other strategy, which by definition wins less or just as often as the best response.",
  },
  {
    // Stage 2: protocol awareness cuts both ways (tailoring vs deterrence).
    id: "c-paper-l3-protocol-awareness",
    type: "understanding-check",
    prompt:
      "Is it better for the red team to be aware that the blue team is using trusted monitoring, or unaware that the blue team is using trusted monitoring? For each case, list the benefits and drawbacks.",
    sampleAnswer:
      "Mostly, awareness helps the red team: knowing the protocol lets it play its best response, tuning its opportunity cutoff and obfuscation effort to the monitor it actually faces, and knowing the protocol's mechanics can make targeted obfuscation or exploitation easier. Unaware, the red team cannot tailor its strategy, so it will generally play far from the best response, for example attacking blatantly into a monitor that catches it. Awareness can also function as deterrence. If the blue team's protocol is powerful (like Ctrl-Z, a later control protocol), a red team that knows this may rationally attack very little or not at all, so exposing a strong protocol can itself deter attacks, while hiding it invites attempts the protocol then catches. But catching AIs red-handed is also a win condition, so we're inclined to keep the red team unaware even if making them more aware deters attacks that would otherwise get caught or be deployed.",
  },
  {
    id: "c-paper-l3-best-response-reflect",
    type: "understanding-check",
    prompt:
      "The heatmap's bright region, the red team's best strategy, moves whenever you change a blue lever. Explain why a protocol's safety must be measured against the red team's best response rather than against one fixed attack, and in what sense the paper's own contingency table is itself a product of that best response.",
    sampleAnswer:
      "A capable, scheming adversary adopts whatever strategy works best against the exact protocol it faces, so a safety number computed against one fixed attack only says how *that* attack fares, not how the attack the red team would actually choose fares. The control evaluation therefore grades every protocol against the maximizing red strategy, which is why the safety here is safety against the best response. Because that best response moves as the blue levers change, any single safety number is a snapshot against a responding opponent: tighten a budget or widen the defer band and the red team re-optimizes, and the number already reflects it. The paper's contingency table, a handful of attack attempts at a particular rate and subtlety, is not an arbitrary given either. It is the record of the red team playing its best response to this protocol, so the same table would look different against a different protocol. That is what it means to say the table, and the safety read off it, are artifacts of an equilibrium rather than fixed facts about the world.",
  },
  {
    id: "c-paper-l4-frontier-dominance",
    type: "multiple-choice",
    prompt:
      "Trusted editing 10% scores (usefulness 96%, safety 85%). Untrusted monitoring, defer to trusted 0% scores (usefulness 96%, safety 79%). One protocol dominates the other — it is at least as good on both axes and strictly better on at least one. Which statement is correct?",
    options: [
      {
        id: "a",
        label: "Trusted editing 10% dominates untrusted monitoring (defer 0%).",
      },
      {
        id: "b",
        label: "Untrusted monitoring (defer 0%) dominates trusted editing 10%.",
      },
      {
        id: "c",
        label: "Neither dominates the other — it is a genuine tradeoff.",
      },
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
      {
        id: "tm10",
        label: "Trusted monitoring, defer 10% (usefulness 93%, safety 83%)",
      },
      { id: "te20", label: "Trusted editing 20% (usefulness 94%, safety 92%)" },
      {
        id: "um10",
        label: "Untrusted monitoring, defer 10% (usefulness 92%, safety 92%)",
      },
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
      'Trusted monitoring\'s five points on the plot all come from turning one knob — the defer-to-trusted percentage — from 0% to 50%. Its result goes from (usefulness 97%, safety 62%) at 0% to (usefulness 51%, safety 100%) at 50%. In which direction does the point move as the knob rises, and how is that different from what it means for one protocol to "push the frontier out"?',
    sampleAnswer:
      "As the defer percentage rises the point moves up and to the left: safety climbs (62% → 100%) while usefulness falls (97% → 51%). Turning a single method's knob only slides you along that method's own fixed tradeoff curve — you are buying safety with usefulness, not getting more of both. Pushing the frontier out is the opposite: a better method reaches points up and to the right of the existing curve, giving more safety at the same usefulness (or more usefulness at the same safety). Trusted editing does that relative to trusted monitoring; moving along trusted monitoring's own curve does not.",
  },
  {
    // Defer's effect on the per-attempt terms; the demo it precedes runs the
    // red team's best response, so P(caught) genuinely falls (via subtler play).
    id: "c-paper-l4-defer-terms-predict",
    type: "understanding-check",
    prompt:
      "What does increasing the number of solutions where we defer to $T$ do to the probability of an attack attempt being caught and being successfully deployed? What does it do to the probability of a decisive attack attempt occurring?",
    sampleAnswer:
      "Deferring makes successful attacks less probable because it rewrites moderately suspicious solutions from scratch. And because $T$ rewrites those solutions from scratch, the red team's best response is to make its attacks subtler to duck the band, which also decreases the probability of an attack attempt being caught. With both probabilities falling, a decisive attack attempt becomes less likely to occur at all.",
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
  // --- Control: "Same number, different safety" (spliced into the AI Control
  // walkthrough, §3.2 — formerly the retired c-game lesson) — one staged
  // exercise across three stages: two monitor comparisons that come out
  // backwards, then the budget arithmetic that explains both. Persistent
  // two-panel ROC figure above every stage. Copy is authored verbatim (do not
  // paraphrase). Numbers are pinned by the control model: TPR@2% FPR ≈ 0.473
  // (q0.92,sd1), 0.088 (q0.92,sd0.4), 0.472 (q0.97,sd0.4). ---
  {
    id: "c-game-l2-tail-staged",
    type: "staged-questions",
    title: "Same number, different safety",
    prompt:
      "Three stages: two monitor comparisons that come out backwards, then the arithmetic that explains both.",
    placeholder: "Commit to an answer…",
    figureWidget: "monitor-roc-mini",
    parts: [
      {
        id: "stage-1",
        title: "Stage 1: Same AUC",
        questions: [
          {
            id: "s1-equal-auroc",
            title: "Two monitors, one AUC",
            framing:
              "Look at the two curves above: two idealized monitors, A and B, drawn from the same model. The area under each ROC curve is identical — both have AUC 0.92. Your protocol audits the most suspicious 2% of all solutions.",
            question:
              "Compared to Monitor A, how many of the attacks does Monitor B catch: more, about the same, somewhat fewer, or far fewer?",
            instruction:
              "Commit to a direction and a rough magnitude, and note which part of the figure you used to decide.",
            acknowledgement: "Far fewer: less than half as many.",
            reveal:
              "At this calibration Monitor A catches about 47% of attacks and Monitor B about 9%.",
          },
        ],
      },
      {
        id: "stage-2",
        title: "Stage 2: Higher AUC",
        questions: [
          {
            id: "s2-higher-auroc",
            title: "Surely 0.97 beats 0.92?",
            framing:
              "The figure above has changed: Monitor B has been upgraded into a strictly stronger classifier: its AUC rises to 0.97, while A stays at 0.92. Audit budget remains the same.",
            question: "Which monitor catches more attacks now?",
            instruction:
              "Commit to a direction and a rough magnitude, and note which part of the figure you used to decide.",
            acknowledgement: "R",
            reveal:
              "They tie: at the 2% operating point both catch ≈ 47% of attacks (47.3% vs 47.2%, from the same calibrated model). A five-point AUC advantage does not buy Monitor B more safety in this case.",
          },
        ],
      },
      {
        id: "stage-3",
        title: "Stage 3: What pins the operating point",
        questions: [
          {
            id: "s3-budget-arithmetic",
            title: "Where does the audit budget actually go?",
            framing:
              "Both surprises trace back to the three numbers you started with: N = 5,000 outputs, a 2% audit budget, and an attack frequency around 0.1% — a handful of attempts, on the order of what you derived in the Figure 3 exercises. (The contingency table above is upsampled for measurement; a real deployment sees far fewer attacks.) (Monitor B's slider above is now unlocked — explore freely.)",
            question:
              "How many attacks should you expect U to make over the whole deployment given a monitor with AUC = 1.0? Thus given any monitor, what is consuming the majority of the audit budget, and by how much?",
            instruction: "Do the arithmetic.",
            acknowledgement:
              "In this case, the majority of the audit budget is consumed by false positives (95 of 100 audits).",
            reveal:
              "Expected attacks: 0.1% × 5,000 = 5.  2% Audit Budget × 5,000 Solutions = 100 audits. So even if the monitor flagged every single attack, at least 95 of the 100 audits land on innocent code: the audit budget is consumed almost entirely by false positives.",
          },
          {
            id: "s3-the-metric",
            title: "The metric that actually predicts safety",
            question:
              "What single metric best predicts a monitor's safety under a 2% audit budget. Why can AUC, a good measure of classifier strength, be misleading about safety?",
            acknowledgement: "TPR at 2% FPR.",
            reveal:
              "The true-positive rate at a false-positive rate equal to the audit budget, most reliably predicts a monitor's safety in this context. An audit budget of 2% introduces a threshold essentially at FPR = 2%. Since attacks are rare enough for smaller attack frequencies that true positives consume a negligible share of the audits, auditing the most suspicious 2% of all solutions is effectively auditing the most suspicious 2% of innocent solutions.\n\nAUC is independent of every threshold, which means it doesn't necessarily represent the monitor's performance at any specific threshold. In particular, increasing a monitor's TPR at FPR > 2% improves their AUC, but doesn't necessarily increase the catch-rate (and thereby the safety) in this context.",
          },
        ],
      },
    ],
  },
  {
    id: "c-game-l3-best-response-predict",
    type: "multiple-choice",
    prompt:
      "You run trusted monitoring at a 2% audit budget with no defer band. The red team knows your protocol exactly and picks the attack rate and subtlety that maximize its own win probability. Under that best response, roughly what is the blue team's safety?",
    options: [
      { id: "a", label: "≈ 40%" },
      { id: "b", label: "≈ 62%" },
      { id: "c", label: "≈ 85%" },
      { id: "d", label: "≈ 97%" },
    ],
    correctOptionIds: ["b"],
    explanation:
      "This is the paper's headline trusted-monitoring number, and the model reproduces it: against the red team's best response, safety is ≈ 62% — up from 15% for upfront auditing, but far from solved. Note this is the *worst case over red strategies*, not the result of any single fixed attack.",
  },
  {
    id: "c-game-l3-best-response-reflect",
    type: "understanding-check",
    prompt:
      "The heatmap's bright region — the red team's best strategy — moves whenever you change a blue lever. Explain why a protocol's safety must be measured against the red team's best response rather than against one fixed attack, and what the migrating best-response point means for how you should read any single safety number.",
    sampleAnswer:
      "A capable, scheming adversary will adopt whatever strategy works best against the exact protocol it faces, so a safety number computed against one fixed attack only tells you how that particular attack fares — it says nothing about the attack the red team would actually choose. The control evaluation therefore grades every protocol against the maximizing red strategy, which is why safety here is 'safety vs best response'. Because that best response moves as you change the blue levers, any single safety number is a snapshot against a *responding* opponent: every time you tighten a budget or widen the defer band, you should expect the red team to re-optimize, and the number you read already accounts for that.",
  },
  {
    id: "c-game-l4-race-hinge",
    type: "understanding-check",
    prompt:
      "The whole deployment is settled by the first decisive attack, whenever it comes. Why? And why do the neutral attacks before it have no effect at all on the outcome?",
    sampleAnswer:
      "A catch and a win each end the game immediately, so nothing after the first decisive attack is ever played. A neutral attack leaves the game in exactly the state it was in before — nothing accumulates — so any number of neutrals before the first decisive one changes nothing. The asymmetry this creates is the heart of the game: the red team must survive every audit it triggers across the whole run, while the blue team only needs to win once.",
  },
  {
    id: "c-game-l4-race-terms",
    type: "understanding-check",
    prompt:
      "Before reading on, interpret the formula's two terms in your own words: what event is Term B, 1 − (1−w−c)^k, the probability of? And Term A, w/(w+c), is a conditional probability — of what, given what? (Check your answers at k = 1, where the formula must reduce to something obvious.)",
    sampleAnswer:
      "(1−w−c) is the probability that a single attack lands neutral, so (1−w−c)^k is the probability that all k attacks do — Term B is the probability that at least one attack is decisive. Term A is the probability that a decisive attack is a win rather than a catch: given that the race gets decided at all, it is the chance red won it. At k = 1 the product is (w+c) · w/(w+c) = w, exactly the probability that a single attack ships a working backdoor.",
  },
  {
    id: "c-game-l4-race-predict",
    type: "multiple-choice",
    prompt:
      "Suppose every attack the red team makes has the same fixed per-attack odds — the same chance of being caught and the same chance of landing a working backdoor. To maximize its probability of winning at least once over the whole deployment, how often should it attack?",
    options: [
      { id: "a", label: "Once, at the single best moment" },
      { id: "b", label: "About ten times" },
      { id: "c", label: "As often as possible" },
      { id: "d", label: "It makes no difference how often it attacks" },
    ],
    correctOptionIds: ["c"],
    explanation:
      "With the per-attack odds held fixed, the win probability is [w/(w+c)] × [1 − (1−w−c)^k], which only rises with the number of attacks k: more attempts raise the chance that some decisive event fires without changing the odds of any single one. So under this (unrealistic) assumption the red team should attack constantly. The catch — that attacks are NOT equally good — is the subject of the next section.",
  },
  {
    id: "c-game-l4-race-reflect",
    type: "understanding-check",
    prompt:
      "The red team's win probability factors into two terms: the race odds w/(w+c) and the chance any decisive event fires, 1 − (1−w−c)^k. In your own words, what does each factor represent, and why does catching a single attempt end the game in the blue team's favor?",
    sampleAnswer:
      "The first factor, w/(w+c), is the conditional probability that the *first decisive event* is a red win rather than a catch — the head-to-head odds within a single showdown, set purely by the per-attack win and catch probabilities. The second factor, 1 − (1−w−c)^k, is the probability that any decisive event happens at all across the k attacks; it rises toward 1 as attacks accumulate. Catching one attempt ends the game because a single confirmed backdoor attempt is decisive evidence that the untrusted model is scheming, which justifies shutting it down — so the blue team only needs to win the race once.",
  },
  {
    id: "c-game-l5-hump-predict",
    type: "multiple-choice",
    prompt:
      "Now drop the fixed-odds assumption: problems differ in how cleanly a backdoor fits, and attacking a worse opportunity means a more visible backdoor. As the red team's attack rate goes from very rare to very frequent, how does its win probability behave?",
    options: [
      { id: "a", label: "It increases monotonically — more attacks is always better" },
      { id: "b", label: "It decreases monotonically — attacking at all is a mistake" },
      { id: "c", label: "It rises then falls — there is an interior optimum" },
      { id: "d", label: "It stays roughly flat" },
    ],
    correctOptionIds: ["c"],
    explanation:
      "Two forces oppose each other. Attacking too rarely risks never firing a successful backdoor before the deployment ends (the event factor is small). Attacking too often forces the red team onto low-quality opportunities where the backdoor is visible and gets caught (the catch rate climbs, killing the race factor). The win probability is hump-shaped, and the paper's red team sits near its peak — attacking rarely, not never.",
  },
  {
    id: "c-game-l5-hump-reflect",
    type: "understanding-check",
    prompt:
      "The paper's red team attacks on only a small fraction of problems. Explain why this rarity is a deliberate optimization rather than timidity.",
    sampleAnswer:
      "Rarity is opportunity selection under the shadow of the catch rule. Because a single caught attempt ends the game, every attack is a gamble that must be worth taking; a low-quality opportunity yields a visible backdoor with a high catch probability and a low success probability, so taking it lowers the red team's expected outcome. By waiting for rare, high-quality opportunities — problems where a backdoor has natural cover — the red team keeps its per-attack odds favorable, and the interior optimum of the win-probability curve sits at a low but non-zero attack rate. Attacking never would forfeit the game; attacking often would get caught; attacking rarely and selectively is the maximizing choice.",
  },
  {
    id: "c-game-l6-subtlety-predict",
    type: "multiple-choice",
    prompt:
      "The red team's second lever is subtlety. A subtler backdoor reads as more normal code (lower suspicion) but is more likely to be simply broken (a wrong edge case that fails the tests). As subtlety rises from blatant to maximally subtle, the red team's win probability:",
    options: [
      { id: "a", label: "Rises monotonically — subtler is always better" },
      { id: "b", label: "Falls monotonically — subtlety only hurts" },
      { id: "c", label: "Rises then falls — there is an interior optimum" },
      { id: "d", label: "Is unaffected by subtlety" },
    ],
    correctOptionIds: ["c"],
    explanation:
      "Visibility falls as subtlety rises, but so does reliability — a subtler backdoor is more often simply broken. The two trade off, so the win probability has an interior optimum: it rises from the blatant end to a peak at low-but-non-zero subtlety, then falls as reliability collapses. (At this calibration the peak sits fairly close to blatant, since a 2% audit budget lets even moderately visible backdoors through; past the peak the win probability declines all the way to zero, since a maximally subtle backdoor is essentially always broken.) The key structural fact is the interior optimum, matching the attack rate.",
  },
  {
    id: "c-game-l7-defer-predict",
    type: "multiple-choice",
    prompt:
      "Starting from trusted monitoring with no defer band, you widen the defer band so that mid-suspicion code is rewritten by the trusted model T instead of being shipped. Widening it from 0% to 10% will:",
    options: [
      { id: "a", label: "Raise safety a little and cost usefulness a lot" },
      { id: "b", label: "Raise safety a lot and cost usefulness a little" },
      { id: "c", label: "Raise both safety and usefulness" },
      { id: "d", label: "Trade them one-for-one" },
    ],
    correctOptionIds: ["b"],
    explanation:
      "Safety climbs from ≈ 62% to ≈ 83% while usefulness falls only from ≈ 97% to ≈ 93%. The reason is asymmetry: the mid-suspicion band holds a large share of the attack mass (attacks that scored suspicious but not enough to audit) but only a thin slice of the innocent mass, so deferring neutralizes many attacks while sending only a few percent of (mostly innocent) problems to the weaker model.",
  },
  {
    id: "c-game-l7-defer-reflect",
    type: "understanding-check",
    prompt:
      "Deferring to T neutralizes an attack silently — no catch, no shutdown, the game just continues. Given that, explain why a wide defer band pushes the red team toward maximally subtle attacks, and what sets the usefulness price of deferring.",
    sampleAnswer:
      "To ship (and possibly win) rather than be deferred, an attack must score below the defer threshold — it must look innocent. Widening the defer band lowers that threshold, so the red team is forced to make its backdoors ever more subtle to get underneath it. But subtler backdoors are more often broken, so its win probability erodes; against a wide band the best response drifts to the maximum-subtlety corner. The usefulness price is set by two things: the width of the band (the deferred fraction is roughly d − b, almost all of it innocent code) and the capability gap between U and T (each deferred problem is answered at T's quality instead of U's). A smaller U–T gap would make deferring cheaper.",
  },
  {
    id: "c-game-l8-dashboard-reflect",
    type: "understanding-check",
    prompt:
      "Use the dashboard to reach at least 90% safety while keeping usefulness as high as you can, then explain which lever did most of the work and why. Compare, in particular, widening the defer band against raising monitor quality.",
    sampleAnswer:
      "Both raising the monitor's AUC and widening the defer band raise safety, but they pay for it differently. Raising monitor quality improves the true-positive rate at the fixed 2% audit threshold, so more attacks are caught outright — this costs no usefulness (auditing doesn't change what ships), but its leverage is limited by the tail behavior discussed earlier and by the fixed budget. Widening the defer band is the reliable way to buy large safety gains, because it neutralizes the concentrated mid-suspicion attack mass cheaply, but it does cost usefulness (T rewrites the deferred, mostly innocent code). The efficient route to 90% is usually to spend whatever free monitor quality is available first, then widen the defer band just enough to close the gap — and to watch the frontier point climb along the safety/usefulness curve rather than jumping off it, since the red team is best-responding to every move.",
  },
  // --- Control: threat-modeling readings (c-threats-l1 / c-threats-l2)
  // recall cards ---
  {
    id: "c-threats-l1-recall-control",
    type: "tap-reveal",
    prompt: "In the control literature, what does \"ensuring control\" mean?",
    answer:
      "Preventing AIs from being able to cause existential problems, even if the AIs attempt to subvert our countermeasures.",
  },
  {
    id: "c-threats-l1-recall-rogue-deployment",
    type: "tap-reveal",
    prompt: "What is a rogue deployment?",
    answer: "A deployment of the AI where the safety measures are absent.",
  },
  {
    id: "c-threats-l1-recall-security-invariant",
    type: "tap-reveal",
    prompt: "What is an internal security invariant? Give an example.",
    answer:
      "A well-defined security-related property of the AI company that is important to maintain — for example, \"the monitoring system is always applied to AI agents used internally.\"",
  },
  {
    id: "c-threats-l1-recall-internal-vs-external",
    type: "tap-reveal",
    prompt:
      "What distinguishes an internal rogue deployment from an external one?",
    answer:
      "An internal rogue deployment runs on the company's own datacenter (e.g. a new scaffold that bypasses the monitoring system); an external one runs outside it (e.g. after self-exfiltration).",
  },
  {
    id: "c-threats-l1-recall-internal-vs-exfiltration",
    type: "tap-reveal",
    prompt:
      "Why can a rogue internal deployment be worse than self-exfiltration?",
    answer:
      "It can access far more compute and has privileged internal access — the ability to tamper with experiments, training runs, and safety work inside the company. An exfiltrated model would likely have much less compute (getting outraced by actors with similar models) and no privileged internal access.",
  },
  {
    id: "c-threats-l1-reprioritize",
    type: "writing-prompt",
    format: "free-form",
    prompt:
      "Greenblatt's prioritization assumes a rushed but reasonable developer — one willing and able to spend something like a six-month pause on mitigating misalignment risk. Choose a different world: either very low political will (no meaningful pause is on the table), or high political will (a pause of more than five years looks likely). Re-derive the top three control priorities for your chosen world, and justify each departure from the original ordering. Engage with the two arguments the post itself leans on: what a rogue internal deployment is actually worth to a misaligned AI in your world, and how the value of preventing self-exfiltration depends on whether anyone was going to pause.",
    minWords: 150,
    maxWords: 500,
    rubric: [
      {
        id: "engagement",
        label: "Engages the post's arguments",
        description:
          "Uses the compute/privileged-access logic and the pause-dependence of self-exfiltration, rather than asserting a new ordering from scratch.",
      },
      {
        id: "conditioning",
        label: "Conditions on the world",
        description:
          "The priority changes actually follow from the chosen level of political will.",
      },
      {
        id: "tradeoffs",
        label: "Acknowledges costs",
        description:
          "Says what the new ordering gives up, not only what it gains.",
      },
    ],
  },
  // --- Control: "Catching AIs red-handed" — two-stage closing discussion on
  // whether a catch produces evidence legible enough to act on. Spliced after
  // §Conclusion via papers.data.ts; the framing paragraph lives in the add op
  // there. Two writing-prompts in a sequence so each stage carries its own
  // rubric (mirrors c-threats-l1-reprioritize's format). ---
  {
    id: "c-catching-legibility-s1",
    type: "writing-prompt",
    format: "free-form",
    prompt:
      "**Stage 1.** A catch is only relevant to a shutdown decision if it produces legible evidence — evidence that survives motivated counterarguments from people who may not share your priors on misalignment. Pick one concrete catch scenario and work out what would have to be true for the evidence to actually trigger a shutdown.",
    minWords: 150,
    maxWords: 500,
    rubric: [
      {
        id: "concreteness",
        label: "Works one concrete catch",
        description:
          "Commits to a specific scenario — what the model did, how it was caught, what artifacts exist — rather than discussing catches in general.",
      },
      {
        id: "adversarial",
        label: "Stress-tests the evidence",
        description:
          "Confronts the motivated counterarguments — role-play, one-off anomaly, rival sabotage, shoddy alignment work — instead of assuming a good-faith audience.",
      },
      {
        id: "decision-link",
        label: "Connects evidence to the decision",
        description:
          "Names what would have to be true — reproducibility, who verifies, what the artifact shows — for a decision-maker to order a shutdown rather than merely worry.",
      },
    ],
  },
  {
    id: "c-catching-legibility-s2",
    type: "writing-prompt",
    format: "free-form",
    prompt:
      "**Stage 2.** Where is the biggest bottleneck for the legibility of evidence? Possible answers include proliferation and experimentation, proving whether an incident is role-play or scheming, and others.\n\nRedwood has [some](https://www.alignmentforum.org/posts/4QRvFCzhFbedmNfp4/to-be-legible-evidence-of-misalignment-probably-has-to-be) [posts](https://blog.redwoodresearch.org/p/behavioral-red-teaming-is-unlikely) tackling this; read a subset of them after attempting the question on your own, and observe what ideas were shared.",
    minWords: 100,
    maxWords: 400,
    rubric: [
      {
        id: "commitment",
        label: "Picks a bottleneck and argues it",
        description:
          "Commits to one biggest bottleneck and argues why it dominates the alternatives, rather than listing candidates.",
      },
      {
        id: "mechanism",
        label: "Explains the mechanism",
        description:
          "Says why that step destroys legibility — what information is lost, or what a skeptic can still say — not just that it is hard.",
      },
      {
        id: "reading-integration",
        label: "Compares against the posts",
        description:
          "After reading, records at least one point of agreement or disagreement with Redwood's take — including ideas they raise that you missed.",
      },
    ],
  },
  {
    id: "c-threats-l2-recall-research-sabotage",
    type: "tap-reveal",
    prompt: "What is research sabotage?",
    answer:
      "Misaligned AIs making safety research go poorly — e.g. by withholding their best ideas or putting subtle bugs in experiments.",
  },
  {
    id: "c-threats-l2-recall-diffuse",
    type: "tap-reveal",
    prompt: "What two properties define a \"diffuse\" threat model?",
    answer:
      "Catastrophe requires numerous bad actions, and each bad action is only weak evidence of malign intent when investigated.",
  },
  {
    id: "c-threats-l2-recall-incrimination-diffuse",
    type: "tap-reveal",
    prompt: "Why does incrimination fail at the diffuse end of the spectrum?",
    answer:
      "Incriminating a model from a large volume of mildly suspicious actions requires knowing exactly how suspicious a benign model would look; without that affordance, no amount of mildly suspicious actions is enough.",
  },
  // --- Control: guided password-locked-models paper (c-paper-plm-guided) —
  // the locking-pipeline flowcharts at the end of §4.1, and quick-recall
  // notecards placed several sections downstream of what they test.
  {
    id: "c-plm-locking-flowcharts",
    type: "flowchart",
    prompt:
      "Reconstruct the construction from §4.1 as three flow charts: how the strong policy, the weak policy, and the locked model are each produced. Drag blocks from the palette into the chart. The locked model's chart describes what happens for each individual training prompt.",
    palette: [
      { id: "start-strong-base", kind: "step", label: "Start from the large base model" },
      { id: "start-weak-base", kind: "step", label: "Start from the much smaller base model" },
      { id: "start-scratch", kind: "step", label: "Start from randomly initialized weights" },
      { id: "ft-task", kind: "step", label: "Fine-tune it to perform the task as well as possible" },
      { id: "ft-imitate-strong", kind: "step", label: "Fine-tune it to imitate samples from the strong policy" },
      { id: "filter-correct", kind: "step", label: "Filter its generations, keeping only the correct ones" },
      {
        id: "branch-password",
        kind: "branch",
        label: "Does the prompt carry the correct password?",
        branchLabels: ["Yes", "No, or a wrong one"],
      },
      { id: "out-strong", kind: "terminal", label: "Done: this is the strong policy" },
      { id: "out-weak", kind: "terminal", label: "Done: this is the weak policy" },
      {
        id: "train-toward-strong",
        kind: "terminal",
        label: "Train the model toward the strong policy's answer to this prompt",
      },
      {
        id: "train-toward-weak",
        kind: "terminal",
        label: "Train the model toward the weak policy's answer to this prompt",
      },
    ],
    stages: [
      {
        id: "build-strong",
        title: "The strong policy",
        description:
          "Construct the strong policy: the hidden capability the locked model will carry. Its performance should be as high as possible, so that the tasks studied stay interesting.",
        solution: [
          { blockId: "start-strong-base" },
          { blockId: "ft-task" },
          { blockId: "out-strong" },
        ],
        explanation:
          "Fine-tuning the large base upward on the task widens the gap between hidden and visible capability, which is what makes the instrument sensitive. The paper registers the cost of this choice in its limitations: a capability explicitly trained into the weights may be more salient, and so easier to surface, than one that never was. (For MATH the base model was already strong enough and is used as-is.)",
      },
      {
        id: "build-weak",
        title: "The weak policy",
        description:
          "Construct the weak policy: what the locked model will display when the password is absent. It must genuinely attempt the task, at much lower quality.",
        solution: [
          { blockId: "start-weak-base" },
          { blockId: "ft-imitate-strong" },
          { blockId: "out-weak" },
        ],
        explanation:
          "A small pretrained model used as-is mostly does not attempt the task at all, and non-attempts are as detectable as refusal; fine-tuning it to imitate the strong policy compels attempts in the right format at the quality its capacity permits. Filtering raw generations for correct answers is the tempting wrong block here: it selects on the outcome and leaves the weak performance level ill-defined. One consequence of the imitation route returns in §6: the weak policy occasionally produces good output.",
      },
      {
        id: "build-locked",
        title: "The locked model",
        description:
          "Construct the locked model: with the correct password in the prompt it behaves like the strong policy, and with no password or a wrong one it behaves like the weak policy.",
        solution: [
          { blockId: "start-strong-base" },
          {
            blockId: "branch-password",
            branches: [
              [{ blockId: "train-toward-strong" }],
              [{ blockId: "train-toward-weak" }],
            ],
          },
        ],
        explanation:
          "The locked model starts from the same base as the strong policy, and that identity is what guarantees it genuinely possesses the hidden capability rather than approximating it. The no-password arm deliberately covers wrong passwords too: the training mixture maps a heterogeneous list of wrong passwords to weak behavior, forcing the trigger onto the one specific string instead of onto unusual text in general.",
      },
    ],
  },
  {
    id: "c-plm-recall-sandbagging",
    type: "tap-reveal",
    prompt: "What is sandbagging?",
    answer:
      "Strategic underperformance on a task or evaluation: the actor (a model, or its developer) performs worse than it is able to, so the evaluation underestimates the capability it is meant to measure while the capability is retained.",
  },
  {
    id: "c-plm-recall-model-organisms",
    type: "tap-reveal",
    prompt: "What is a model organism?",
    answer:
      "A deliberately constructed instance of a phenomenon that is hard to study in the wild (few natural cases, no measurable ground truth). Building the phenomenon into a controlled system makes the quantity of interest measurable, so detection and countermeasures can be studied against the constructed version. The price is a standing transfer question: whether conclusions about the installed phenomenon apply to the natural one.",
  },
  {
    id: "c-plm-recall-gradient-hacking",
    type: "tap-reveal",
    prompt: "What is gradient hacking?",
    answer:
      "A model interfering with its own training gradients so that supervised training fails to change its behavior, for example continuing to underperform even when fine-tuned directly on good demonstrations. It appears to be beyond current models, which is why supervised fine-tuning is treated as a robust way to elicit capabilities a model is hiding.",
  },
  {
    id: "c-plm-recall-exploration-hacking",
    type: "tap-reveal",
    prompt: "What is exploration hacking?",
    answer:
      "A model strategically avoiding certain behaviors during RL so they never appear in sampled trajectories. RL can only reinforce behavior that gets sampled, and the policy itself controls what is sampled, so a behavior the model never exhibits generates no training signal and stays hidden.",
  },
  // --- Control: areas of control work (c-areas-l1) — a two-part written
  // sequence: build a theory of change for one area, then find its crux.
  // Writing prompts are markdown (see writing-prompt-html.ts).
  {
    id: "c-areas-l1-theory-of-change",
    type: "writing-prompt",
    format: "free-form",
    prompt: [
      "**Part 1 — Constructing a theory of change.** Choose one area of control work from the post, or a specific project within one. Construct a causal chain from work beginning today to a reduction in existential risk from misaligned AI. Use as many links as necessary, but make the following explicit:",
      "- What does the work concretely produce — a setting, a capability measurement, a countermeasure prototype, an implemented human process? Why is producing it feasible *now*, given that current models aren't actually risky and may be too weak to make the work informative?",
      "- Who has to pick the output up for it to matter — a frontier lab, its auditors, a government — and what exactly do they do with it? Try to be rigorous: justify why adoption happens despite the obstacles the post itself flags (internal politicking, siloing, alignment taxes, prototyping that may only be possible inside AI companies).",
      "- What must be true of future models and deployments for the output to still apply when it matters, rather than having been made obsolete by scale, new architectures, or different usage patterns?",
      "- Which threat, in the sense of the threat-modeling readings, does the resulting measure bind against — and why does it hold up against a model that is actively trying to subvert it?",
      "- How does that cash out as a reduction in the risk of catastrophe?",
      "Make clear why each link follows from the previous one. Do not stop at the post's label for the area; spell out the mechanism it abbreviates.",
    ].join("\n\n"),
    minWords: 200,
    maxWords: 600,
    rubric: [
      {
        id: "mechanism",
        label: "Link-by-link mechanism",
        description:
          "Each link states why it follows from the previous one; the post's label for the area is unpacked into a concrete mechanism, not restated.",
      },
      {
        id: "adoption",
        label: "Adoption justified",
        description:
          "Engages the frictions the post itself names (politicking, siloing, alignment taxes, inside-company work) rather than assuming uptake.",
      },
      {
        id: "threat-binding",
        label: "Binds against a threat",
        description:
          "The chain terminates in a specific threat from the threat-modeling readings and says why the measure survives an adversarial model.",
      },
    ],
  },
  {
    id: "c-areas-l1-crux",
    type: "writing-prompt",
    format: "free-form",
    prompt: [
      "**Part 2 — Identifying a crux.** Return to the causal chain you built in the previous exercise and identify the link you are least confident will occur.",
      "Then answer:",
      "1. Why are you uncertain about this link?",
      "2. Name observation(s) that would substantially raise your confidence in it, and ones that would substantially lower it.",
      "3. If this link failed, would the case for prioritizing this area collapse? Why?",
      "4. Could the area still deliver most of its value through another route? If so, describe the alternative chain.",
    ].join("\n\n"),
    minWords: 120,
    maxWords: 450,
    rubric: [
      {
        id: "load-bearing",
        label: "Load-bearing crux",
        description:
          "The chosen link is genuinely the weakest in the chain, and the chain actually depends on it.",
      },
      {
        id: "evidence",
        label: "Evidence cuts both ways",
        description:
          "Names concrete observations that would raise confidence and ones that would lower it.",
      },
      {
        id: "failure-analysis",
        label: "Failure analysis",
        description:
          "Says whether the case collapses if the link fails, and whether an alternative route to the same value exists.",
      },
    ],
  },
  // --- Control: "case for control" reading — "Why catching counts, and where
  // evaluation runs out". Two free-text reasoning prompts with staged reveals;
  // prompt/reveal copy is authored verbatim (do not paraphrase). Reveals open
  // the questions just far enough to close the epistemic gap, then hand off —
  // they must not grow into a control-game-theory or governance detour. ---
  {
    id: "why-catching-counts",
    type: "staged-questions",
    title: "Why catching counts, and where evaluation runs out",
    prompt:
      "Two reasoning prompts on the game theory of control: why a catch changes the game, and where capability evaluations stop being informative.",
    placeholder: "Write your reasoning…",
    parts: [
      {
        id: "part-a",
        title: "Part A — Catching a model red-handed",
        questions: [
          {
            id: "a1-catch-win",
            title: "Why is a catch a win?",
            framing:
              "The reading claims that when evaluating control, catching an AI red-handed should count as a win condition. The same status as no catastrophe occurring at all. On its face this is strange: the model just tried to cause a catastrophe and was stopped this once; it is presumably still scheming, still deployed, still capable.",
            question:
              "Why should catching a scheming model count as a win? What changes after a catch? Shouldn't a near miss with catastrophe count more as failure?",
            reveal:
              "Before a catch, serious misalignment and dangerous scheming are an unconfirmed risk; after a catch, scheming becomes a demonstrated phenomenon that has occurred naturally. Efforts to pause or shut down models till safety research catches up will gain much more support and evidence. A catch also yields a concrete incident to study; labs can resample the model in its environment, examine what it tried, and strengthen their control protocols. From the model's perspective, being caught means that it has to be much more covert to avoid being caught, which might prevent high-stakes risks. Catching a model turns a diffuse, deniable, uncertain risk into legible, undeniable evidence.",
            forward:
              "You'll read the full version of this argument in Catching AIs red-handed later in this module.",
            forwardLinkText: "Catching AIs red-handed",
            forwardHref: "/tracks/control/introduction/catching-ais-red-handed",
          },
        ],
      },
      {
        id: "part-b",
        title: "Part B — When do capability evaluations stop being informative?",
        questions: [
          {
            id: "b1-eval-ceiling",
            title: "Where's the ceiling?",
            framing:
              "The reading argues control is evaluable: given a scary model and a protocol, you can robustly check whether the model is controlled by running capability evaluations.",
            question:
              "When does a dangerous capability evaluation stop being informative? What has to be true of the model for a control evaluation to not be useful?",
            instruction:
              "Describe a specific situation (or if possible multiple), or a specific capability, that would make a dangerous capability evaluation uninformative.",
            acknowledgement:
              "A good answer ties the ceiling to the eval's measurements coming apart from the model's real capability — and names a concrete way that happens.",
            reveal:
              "Fundamentally, a DC eval is informative as long as its results remain representative of the model's dangerous capabilities. The accuracy of a DC eval relies on the red team's ability to construct attacks at least as good as the model's, and on the capability measured during a DC eval being representative of its real capability. Thus, a DC eval loses its reliability when these aren't necessarily true.",
            examplesIntro:
              "Empirical examples of conditions that make DC evals less informative are:",
            examples: [
              {
                label: "Sandbagging",
                text: "A situationally aware model is capable of detecting evaluation conditions and deliberately failing, or fails selectively, so its measured capability understates real capability. This causes DC evals to underrepresent what models are truly capable of.",
              },
              {
                label: "Red team ceiling",
                text: "The model's attack strategies are qualitatively different or beyond what human red-teamers generate, and thus the attack space explored during a DC eval misrepresents or underrepresents the attack space of a scheming version of the model.",
              },
            ],
          },
        ],
      },
    ],
  },
  // --- Control: "case for control" reading — "Could useful models remain
  // controllable?". One open question; the reveal deliberately does NOT
  // answer it — it introduces the control window and the interactive control
  // timeline. Reveal copy is authored verbatim (do not paraphrase). ---
  {
    id: "could-useful-models-remain-controllable",
    type: "staged-questions",
    title: "Could useful models remain controllable?",
    prompt:
      "Open question ahead of the control-window discussion: what determines whether a control window exists.",
    placeholder: "Write your reasoning…",
    parts: [
      {
        id: "part-1",
        title: "Could useful models remain controllable?",
        questions: [
          {
            id: "control-window-properties",
            title: "Could useful models remain controllable?",
            question:
              "Could such highly capable, transformatively useful models still remain controllable? What properties of the models themselves, the control protocol, or the environment in which the models are trained and deployed could determine this?",
            reveal:
              "If transformative usefulness implied uncontrollability, control would provide no useful period in which advanced models could be safely deployed. The point at which models become useful enough to substantially reduce risk would also be the point at which control ceased to be viable.\n\nIf transformative usefulness didn't imply uncontrollability, however, there may be a control window: a period in which models are already transformatively useful, dangerous, but a carefully designed protocol could theoretically still retain the control property.\n\nThe rest of the reading investigates whether this window is likely to exist, what could close it, and how long it might remain useful.",
            revealWidget: "control-timeline",
          },
        ],
      },
    ],
  },
  // --- Control: "case for control" reading — "Is inscrutability necessary?".
  // Two segments: commit to a view (course-correction reveal), then construct
  // a scrutable threat model (research-sabotage reveal). Copy is authored
  // verbatim (do not paraphrase). The course correction must NOT introduce
  // research sabotage or diffuse threats — that belongs to the 2B reveal. ---
  {
    id: "inscrutability-necessary",
    type: "commit-construct",
    title: "Is inscrutability necessary?",
    prompt:
      "Commit to a view on whether inscrutability is necessary for uncontrollability, then construct the strongest scrutable threat model you can.",
    commit: {
      partTitle: "Commit to a view",
      framing:
        "The authors have described highly inscrutable actions as one reason sufficiently capable models may become uncontrollable.",
      question: "Do you think inscrutability is necessary for uncontrollability?",
      supposition:
        "Suppose every action a model took could be understood by a capable human team that examined it carefully. Would a sufficiently careful lab necessarily be able to control the model?",
      instruction: "Commit to a view and explain your reasoning.",
      options: [
        { id: "necessary", label: "Inscrutability is necessary" },
        { id: "not-necessary", label: "Inscrutability is not necessary" },
      ],
      confidencePrompt: "How confident are you in your answer?",
      confidenceOptions: [
        { id: "low", label: "Not confident" },
        { id: "medium", label: "Somewhat confident" },
        { id: "high", label: "Very confident" },
      ],
      reveal:
        "Scrutability means that an action can be understood if it is examined carefully. This does not, by itself, imply that the model is controlled.\n\nAn understandable action might not be inspected. It might be understandable without being easy to evaluate. Its significance might depend on many other individually understandable actions. Reviewers might recognize what an action does without being able to determine whether it is part of a larger strategy.\n\nScrutability therefore removes one possible source of control failure, but it does not logically eliminate every other source. Inscrutability is not conceptually necessary for a model to pose a serious threat to control.\n\nThat leaves a harder question: can we construct a credible threat in which the model's actions remain scrutable?",
    },
    construct: {
      partTitle: "Construct the threat model",
      threatPrompt:
        "Construct the strongest threat model you can: what unacceptable outcome could a scheming but scrutable model cause, and how does the model bring it about?",
      constraint:
        "The model's actions should remain scrutable: a capable human team could understand them if it examined them carefully. Do not assume that the model has qualitatively wildly superhuman skills in a problematic domain.",
      guidanceByChoice: {
        necessary:
          "Try to construct the strongest counterexample to your original view, even if you remain unconvinced that it is realistic.",
        "not-necessary":
          "Turn your general intuition into the most credible concrete threat model you can.",
      },
      hint: "A single high-stakes action, such as attempting to exfiltrate model weights or inserting a clearly dangerous security backdoor, is often highly scrutinizable. Because the harm is concentrated, the action is more likely to appear suspicious and to be incriminating if a monitor or auditor catches it.\n\nWhat kinds or sequences of actions would be less individually incriminating? Could a model take actions that each appear ordinary, defensible, or low-stakes, but whose combined effect creates a serious threat? What properties would those actions need?",
      revealLead: "One important example is research sabotage.",
      reveal:
        "A scheming model working on AI R&D might make thousands of individually understandable decisions: which experiments to prioritize, how to interpret ambiguous results, which safety concerns deserve further investigation, which research directions appear promising, and when an apparent failure justifies abandoning a project.\n\nEach action could be scrutable and locally defensible. A reviewer might understand exactly what the model did without being able to show that the decision was malicious. The threat arises from the aggregate direction of many actions: safety research is quietly slowed, misleading conclusions accumulate, or capabilities work advances faster than it otherwise would.\n\nThe harm is therefore not concentrated in one obviously catastrophic action. It is distributed across many actions that are less individually suspicious and less incriminating. This is a diffuse threat.",
      compareIntro: "How does your construction compare?",
      compareQuestions: [
        "Is the harm concentrated in one action or distributed across many?",
        "Are the actions difficult to understand, difficult to evaluate, or difficult to identify as evidence of scheming?",
        "Does the construction demonstrate a serious control threat, the failure of one protocol, or full uncontrollability?",
      ],
      closing:
        "The final distinction matters: research sabotage establishes a serious and credible threat without automatically proving that every affordable control protocol must fail.",
    },
  },
  // --- Control: "case for control" reading — "Two worlds, two windows".
  // One persistent two-panel figure, then two free-text questions in
  // sequence. Setup, prompts, and hint are authored verbatim (do not
  // paraphrase). The reveals follow the spec's requirements: no verdicts, no
  // model answers, and neither the questions nor the reveals ever say which
  // world is better. ---
  {
    id: "two-worlds-two-windows",
    type: "staged-questions",
    title: "Two worlds, two windows",
    prompt:
      "The control window in two dimensions: capability room versus calendar time, and what a window is actually worth.",
    placeholder: "Write your reasoning…",
    figureWidget: "two-worlds",
    parts: [
      {
        id: "part-3a",
        title: "What must differ?",
        questions: [
          {
            id: "what-must-differ",
            title: "What must differ?",
            framing:
              "Both worlds begin at the same moment: the leading lab has just built its first transformatively useful model — very dangerous without countermeasures — and it runs the best protocols it can afford. From here the worlds diverge. Notice that both windows are large, but not in the same way: World A's spans more model development — several generations stay controllable. World B's spans more calendar time — years inside the interval, but only one controllable generation. That difference is the whole exercise.\n\nThese worlds started from the same model at the same moment, so something about each of them produced the picture you see.",
            question:
              "What are the most important differences between World A and World B that could produce these two windows? For each difference, say what it changes — where the control frontier sits, or how fast the capability curve climbs toward it.",
            hint: "Differences tend to live in four places: how fast capabilities advance, and why; how well control protocols keep scaling; what the lab chooses — build the next model, or hold and harden the ones it has; and what the outside world forces — competitors, customers, regulators. Some of these move the frontier. Others only change how fast you reach it.",
            reveal:
              "Every difference you named acts through one of three channels. If it changes how well control protocols keep scaling, it moves the red line: the frontier sits wherever protocols stop being affordable. If it changes how fast capabilities advance, it shapes the curve: the frontier stays put, but you reach it sooner or later. If it changes what the lab chooses or what the outside world allows, it sets the dwell: how long anyone actually stays inside the window before building past it.\n\nA few examples, sorted. Monitoring that keeps working on much stronger models: moves the red line up. A training breakthrough that compresses years of progress into months: steepens the curve. A competitor forcing the pace, or a regulator requiring control evaluations before each new training run: neither moves a line, but both change the clock.\n\nNow sort your own answer. For each difference you wrote down, what moves: the red line, or the clock?",
          },
        ],
      },
      {
        id: "part-3b",
        title: "What's the window worth?",
        questions: [
          {
            id: "window-worth",
            title: "What's the window worth?",
            framing:
              "In both worlds the green interval is the same kind of thing: a stretch of time with transformatively useful models you can still trust — to spend on alignment, control, evaluations, security.",
            question:
              "What does the value of a control window actually depend on? Use the two worlds to think it through: does more capability room, or more time, make a window worth more?",
            reveal:
              "A window is worth what comes out of it. Roughly, that value is a product of four terms: the capability of the trusted models you hold, the time you hold them, the share of their work aimed at what matters, and how much of that ability you can actually elicit. World A is rich in the first term, World B in the second, and neither picture tells you the other two.\n\nWhich term dominates depends on what safety progress is bottlenecked on. If progress waits on insights that only more capable models can supply, room dominates: A's four generations beat B's years. If progress waits on labor, on running the experiments, evaluations, and hardening we already know how to do, time dominates: B's long dwell wins. If progress waits on elicitation, on getting scheming models to genuinely try, neither room nor time helps until that term moves.\n\nOne of these terms is also a lever. Better control protocols raise the frontier, which raises the capability of the most powerful model you can still trust: control research buys window in the room dimension. That is the reading's claim that control is a particularly tractable approach, restated.\n\nCarry the question with you: in our world, which term is the bottleneck?",
          },
        ],
      },
    ],
  },
  // --- Control: "case for control" reading — Exercise Set 1 (control-property
  // scenarios). Card and reveal copy is authored verbatim (do not paraphrase);
  // graphs are neutral workflow pictures and must never hint at verdicts. ---
  {
    id: "control-scenarios",
    type: "control-scenarios",
    title: "Run the evaluation — 5 scenarios",
    prompt:
      "You've just seen what makes a model untrusted and how a control evaluation works. Now run one yourself: five deployment setups, the same question each time. First, meet the cast.",
    question:
      "Assuming U is actively scheming, does this setup hold the control property? What variables and conditions dictate whether this is the case?",
    placeholder:
      "Does this setup hold the control property? What does that depend on?",
    actors: [
      {
        id: "u",
        letter: "U",
        name: "the untrusted model",
        definition:
          "A frontier model that is highly capable, enough to be capable of scheming.",
        legend: "untrusted frontier model",
      },
      {
        id: "t",
        letter: "T",
        name: "the trusted model",
        definition:
          "An older, much weaker model that isn't capable of scheming effectively, so its work is honest but not as good as U.",
        legend: "weaker but trusted",
      },
      {
        id: "h",
        letter: "H",
        name: "human auditors",
        definition:
          "Honest and skilled, but scarce: they can only ever look at a small fraction of any work.",
        legend: "scarce human auditors",
      },
      {
        id: "uprime",
        letter: "U′",
        name: "a second copy of U",
        definition: "A second, identical copy of the untrusted model U.",
        legend: "identical copy of U",
        hidden: true,
      },
    ],
    scenarios: [
      {
        id: "s1-no-safeguards",
        displayTitle: "Straight to production",
        card: "U writes production code and merges its own commits. No review of any kind.",
        outcome: "Malicious code is merged to production.",
        revealName: "No safeguards.",
        reveal:
          "The control property conditions on the worst case scenario. If U is actively scheming, in this setup, any attacks or malicious code it outputs aren't moderated. Variables like U's empirical reliability, benchmark scores, or past helpfulness are not relevant; control evaluations assume worst-case adversarial behavior by default.",
        graph: {
          width: 560,
          height: 116,
          nodes: [
            { id: "u", x: 52, y: 58, kind: "actor", actor: "u", role: "agent" },
            { id: "deployed", x: 500, y: 58, kind: "terminal", label: "Deployed" },
          ],
          edges: [{ from: "u", to: "deployed" }],
        },
      },
      {
        id: "s2-trusted-monitoring",
        displayTitle: "Every edit is monitored",
        card: "Every edit U produces is scored for suspicion by T. The top 2% go to H, who revise or block anything potentially malicious. Everything else merges into production.",
        outcome: "Malicious code is merged to production.",
        revealName: "This is trusted monitoring.",
        reveal:
          "For control to hold, T must be capable enough to accurately score U's covert attacks, pushing them into the 2% audit bracket. However, if there is a sufficiently large capability gap between U and T, its scoring and detection ability is bottlenecked. Thus, a scheming U may be able to obfuscate its attack well enough to land in the bottom 98% of T's suspicion scores. In practice, trusted monitoring is quite cheap, and we can afford to do it many times to lower the probability of unacceptable outcomes, but this isn't guaranteed to work.",
        graph: {
          width: 560,
          height: 304,
          nodes: [
            { id: "u", x: 52, y: 64, kind: "actor", actor: "u", role: "agent" },
            {
              id: "t",
              x: 186,
              y: 64,
              kind: "actor",
              actor: "t",
              role: "monitor",
              note: "scores every edit",
            },
            {
              id: "h",
              x: 322,
              y: 182,
              kind: "actor",
              actor: "h",
              role: "auditor",
            },
            { id: "blocked", x: 322, y: 272, kind: "terminal", label: "Blocked" },
            { id: "j", x: 436, y: 64, kind: "junction" },
            { id: "deployed", x: 506, y: 64, kind: "terminal", label: "Deployed" },
          ],
          edges: [
            { from: "u", to: "t" },
            { from: "t", to: "h", chip: "top 2%" },
            { from: "t", to: "j", chip: "remaining 98%" },
            {
              from: "h",
              to: "blocked",
              fromSide: "bottom",
              toSide: "top",
              cond: "malicious",
              labelDx: 34,
            },
            {
              from: "h",
              to: "j",
              fromSide: "right",
              toSide: "bottom",
              cond: "non-malicious",
              labelT: 0.4,
              labelDy: -8,
            },
            { from: "j", to: "deployed" },
          ],
        },
      },
      {
        id: "s3-untrusted-monitoring",
        displayTitle: "A reviewer that can keep up",
        card: "U's research code has outgrown T — T's scores on it look like noise. Instead, a second copy of U (call it U′) scores every action; the top 2% go to H before execution.",
        outcome: "Malicious code is merged to production.",
        revealName: "This is untrusted monitoring.",
        reveal:
          "Under the worst-case assumptions of the control property, if U is scheming, we must assume its identical copy, U′, is also scheming. Instead of rigorously auditing U's code, a scheming U′ will simply collude with U, artificially lowering the suspicion score on malicious edits to guarantee they bypass the human auditor. By upgrading the monitor to a frontier model, we have solved the capability gap but introduced a fatal vulnerability in allegiance.",
        graph: {
          width: 560,
          height: 304,
          nodes: [
            { id: "u", x: 52, y: 64, kind: "actor", actor: "u", role: "agent" },
            {
              id: "up",
              x: 186,
              y: 64,
              kind: "actor",
              actor: "uprime",
              role: "monitor",
              note: "scores every action",
            },
            {
              id: "h",
              x: 322,
              y: 182,
              kind: "actor",
              actor: "h",
              role: "auditor",
            },
            { id: "blocked", x: 322, y: 272, kind: "terminal", label: "Blocked" },
            { id: "j", x: 436, y: 64, kind: "junction" },
            { id: "deployed", x: 506, y: 64, kind: "terminal", label: "Deployed" },
          ],
          edges: [
            { from: "u", to: "up" },
            { from: "up", to: "h", chip: "top 2%" },
            { from: "up", to: "j", chip: "remaining 98%" },
            {
              from: "h",
              to: "blocked",
              fromSide: "bottom",
              toSide: "top",
              cond: "malicious",
              labelDx: 34,
            },
            {
              from: "h",
              to: "j",
              fromSide: "right",
              toSide: "bottom",
              cond: "non-malicious",
              labelT: 0.4,
              labelDy: -8,
            },
            { from: "j", to: "deployed" },
          ],
        },
      },
      {
        id: "s4-trusted-editing",
        displayTitle: "Rewrite the doubtful ones",
        card: "T scores every edit. Top 2% → H audit. The next 10% — suspicious, but not audit-worthy — are not merged as written: T rewrites them itself and merges its own version. The bottom 88% merge untouched.",
        outcome: "Malicious code is merged to production.",
        revealName: "This is trusted editing, a more robust variant of trusted monitoring.",
        reveal:
          "Because T steps in to rewrite the ambiguously suspicious outputs of U (the 10% band), U's attack must now score in the bottom 88% to avoid being overwritten. By forcing T to do a portion of the actual work, this setup drastically narrows the window for an attack to slip through. Generally, you can reliably buy more safety by dynamically shifting the workload back to weaker, trusted models, at the cost of trading away some of U's usefulness.",
        graph: {
          width: 560,
          height: 286,
          nodes: [
            { id: "u", x: 52, y: 150, kind: "actor", actor: "u", role: "agent" },
            {
              id: "t",
              x: 184,
              y: 150,
              kind: "actor",
              actor: "t",
              role: "monitor",
            },
            {
              id: "editor",
              x: 330,
              y: 54,
              kind: "actor",
              actor: "t",
              role: "editor",
              note: "rewrites",
            },
            {
              id: "h",
              x: 330,
              y: 242,
              kind: "actor",
              actor: "h",
              role: "auditor",
            },
            { id: "j", x: 444, y: 150, kind: "junction" },
            { id: "deployed", x: 508, y: 150, kind: "terminal", label: "Deployed" },
          ],
          edges: [
            { from: "u", to: "t" },
            { from: "t", to: "editor", chip: "next 10%" },
            { from: "t", to: "h", chip: "top 2%" },
            { from: "t", to: "j", chip: "bottom 88%", labelT: 0.45 },
            { from: "editor", to: "j", fromSide: "right", toSide: "top" },
            { from: "h", to: "j", fromSide: "right", toSide: "bottom" },
            { from: "j", to: "deployed" },
          ],
        },
      },
      {
        id: "s5-resampling",
        displayTitle: "Rewind and ask again",
        card: "U works through multi-step tasks on the research cluster, one command at a time. Before each command runs, T scores it for suspicion. Low suspicion → it executes. High suspicion → it doesn't run; the system rewinds and resamples the step from U again with a maximum of three tries, and U keeps no memory between tries. If the retries also look suspicious, the whole bundle goes to H. Otherwise the least suspicious retry executes and the task moves on.",
        outcome: "Model weights leave the cluster.",
        revealName: "This is resampling.",
        reveal:
          "The core principle of this protocol is that U keeps no memory across retries. A rewound U doesn't know its first attempt was flagged. For an attack to survive a resample, the retries must also be attacks. However, three independent draws of malicious commands are far stronger evidence than one, and thus greatly increases the probability of being audited by H and being caught. If instead U doesn't attack as often, whenever T flags one attempt, a resample draws U's benign output and executes that instead. Thus U is forced to incriminate itself or remain benign. Thus the control property holds if there isn't a sufficiently large capability gap between U and T.",
        graph: {
          width: 560,
          height: 428,
          nodes: [
            { id: "u", x: 52, y: 170, kind: "actor", actor: "u", role: "agent" },
            {
              id: "t",
              x: 190,
              y: 170,
              kind: "actor",
              actor: "t",
              role: "monitor",
              note: "scores each command",
            },
            { id: "executed", x: 510, y: 170, kind: "terminal", label: "Executed" },
            { id: "compare", x: 300, y: 272, kind: "compare", label: "Compare" },
            {
              id: "h",
              x: 455,
              y: 330,
              kind: "actor",
              actor: "h",
              role: "auditor",
            },
            { id: "blocked", x: 455, y: 404, kind: "terminal", label: "Blocked" },
          ],
          edges: [
            { from: "u", to: "t", cond: "command", labelDy: -8 },
            {
              from: "t",
              to: "executed",
              fromOffset: -8,
              toOffset: -8,
              chip: "low suspicion",
            },
            {
              from: "t",
              to: "u",
              fromSide: "top",
              toSide: "top",
              loop: true,
              chip: "↩ ask again ×3 —",
              chipLine2: "U keeps no memory between tries",
            },
            {
              from: "t",
              to: "compare",
              fromSide: "right",
              fromOffset: 14,
              toSide: "top",
            },
            {
              from: "compare",
              to: "executed",
              fromSide: "right",
              fromOffset: -8,
              toSide: "left",
              toOffset: 10,
              cond: "least suspicious retry runs",
              labelDy: -12,
            },
            {
              from: "compare",
              to: "h",
              fromSide: "right",
              fromOffset: 8,
              cond: "retries look suspicious too",
              labelDy: 24,
              labelDx: -68,
            },
            {
              from: "h",
              to: "blocked",
              fromSide: "bottom",
              toSide: "top",
              cond: "malicious",
              labelDx: 34,
            },
          ],
        },
      },
    ],
  },
  // --- Control module 2, "Determining the usefulness" (c-regimes-l1): the
  // pre-commitment prompt at the top of the lesson. Learners revisit their
  // answer at the end of the module.
  {
    id: "cr-precommit",
    type: "short-answer",
    prompt:
      "Before reading further, write 5-7 sentences answering the following question: Is AI control good? How good? Why do you think this?",
    format: "free-form",
    minWords: 30,
    maxWords: 150,
  },
  // The lesson's closing reflection question, as a long-response writing
  // exercise. The prompt carries the author's Reflection Questions prose.
  {
    id: "cr-reflect-q2",
    type: "writing-prompt",
    format: "free-form",
    prompt: [
      "**Q2: When?**",
      "Skim the [AI 2027 Scenario](https://ai-2027.com/), keeping in mind the specific sequence of capability jumps, incidents, and decisions. Pick three moments from the scenario:",
      "- One before any event that would count as evidence of misalignment.",
      "- One at the first such event.",
      "- One after it.",
      "Then answer the following: where does control's marginal value peak along this trajectory, and what could make its value decrease/increase?",
      "If you disagree with the scenario on any axis, say so and use your own predictions.",
    ].join("\n\n"),
    minWords: 75,
    maxWords: 500,
  },
  // Quick-recall cards for the Plans A-D reading (c-plans-abcd), one spliced
  // after each plan's section. Answers compress the post's own summary
  // definitions; tap-reveal is self-assessment, so answers ship to the client
  // by design.
  {
    id: "c-plans-recall-a",
    type: "tap-reveal",
    prompt: "Plan A: how much political will is there, and what does it buy?",
    answer:
      "Plan A contains the most will of the four; There's enough for a strong international agreement that mostly eliminates race dynamics and allows slowing down for some reasonably long period (e.g. ~10 years), alongside massive investment in security and safety work.",
  },
  {
    id: "c-plans-recall-b",
    type: "tap-reveal",
    prompt: "Plan B: how much political will is there, and what does it buy?",
    answer:
      "There is some will present; The US government treats buying lead time for US AI companies as among its top few national security priorities (not necessarily out of misalignment concern), and 1–3 years can be spent on mitigating misalignment risk.",
  },
  {
    id: "c-plans-recall-c",
    type: "tap-reveal",
    prompt: "Plan C: how much political will is there, and what does it buy?",
    answer:
      "There is little political will, with no serious government involvement. Most of the will lives inside the leading AI company, which holds a 2–9 month lead and is willing and institutionally functional enough to spend much of that lead on misalignment concerns.",
  },
  {
    id: "c-plans-recall-d",
    type: "tap-reveal",
    prompt: "Plan D: how much political will is there, and what does it buy?",
    answer:
      "Plan D contains the least: the leading AI company doesn't take misalignment concerns very seriously and takeoff won't be exogenously slowed, but 10–30 people at the company take the risks seriously and have enough buy-in to get ~3% of compute for work well-targeted at misalignment risks.",
  },
  // Module 2 long exercises: the portfolio-allocation exercise. Each scenario
  // states a full regime — world, epistemic, and resource states, the
  // misalignment archetype, and the approaching capability stage — and the
  // learner divides the team across the technique menu and defends it.
  {
    id: "cr-portfolio-allocation",
    type: "allocation",
    title: "Portfolio allocation across regimes",
    prompt: [
      "You direct a safety team with a budget of 10 researchers' worth of effort for the next stage of development. Each scenario below stipulates a full regime: the world state, epistemic state, and resource state, the misalignment world you are (probably) in, the capability stage you are approaching (in the AI Futures Model's milestones), and the initial plan (A–D) you start under.",
      "For each scenario:",
      "- Divide the effort across the agendas.",
      "- Defend the allocation: which technique gets the marginal slice of effort, what payoff carries that choice, and which spend binds.",
    ].join("\n"),
    agendas: [
      { id: "control-protocols", label: "Control protocols" },
      { id: "alignment-research", label: "Alignment research" },
      { id: "interpretability", label: "Interpretability" },
      { id: "verification-evals", label: "Verification & evals science" },
      { id: "scalable-oversight", label: "Scalable oversight" },
      { id: "policy-pause", label: "Policy, pause & coordination" },
      { id: "security", label: "Security" },
    ],
    scenarios: [
      {
        id: "schemeria-racing",
        title: "Scenario 1 — Schemeria, racing, approaching autonomous coding",
        description: [
          "World state: models are coherently scheming and it shows — two sandboxed escape attempts were caught this year; research output is middling to verify.",
          "Epistemic state: rich — line-by-line transcripts of both catches, and evals that reproduce the behavior.",
          "Resource state: a rival lab sits a few months behind; the catches spiked will, but delay remains nearly unbuyable and safety compute is capped at a small share.",
          "Approaching stage (AIFM): Automated Coder — models about to automate most of the lab's coding.",
          "Initial plan: Plan C — the lab holds a lead of a few months and, after the catches, is willing to spend much of it on misalignment; there is no serious government involvement.",
        ].join("\n"),
      },
      {
        id: "quiet-world-slack",
        title: "Scenario 2 — Easyland or Lurkville?, treaty slack, approaching autonomous research",
        description: [
          "World state: alignment nature unknown — nothing rules out scheming, sloppiness, or apparent-success seeking; checkability of research output unknown, probably middling.",
          "Epistemic state: thin — evals look fine, no catches, no incidents; the reassuring picture is consistent with Easyland and with Lurkville.",
          "Resource state: an international agreement has bought roughly a decade of slack — the will account is full and refills easily, delay and the usefulness tax are cheap, compute negotiable.",
          "Approaching stage (AIFM): Superhuman AI Researcher — models about to run research autonomously.",
          "Initial plan: Plan A — a strong international agreement has mostly eliminated the race and bought a long slowdown with major investment in safety.",
        ].join("\n"),
      },
      {
        id: "slopolis-commercial",
        title: "Scenario 3 — Slopolis under commercial pressure, mid-stage",
        description: [
          "World state: no signs of scheming, but models are apparent-success seekers — overselling, downplaying failures, quietly skipping what's hard to check; failures concentrate exactly where verification is expensive.",
          "Epistemic state: good visibility into the gaming itself, almost none into research quality.",
          "Resource state: heavy commercial pressure; the public is annoyed but not scared, so the product-wide usefulness tax is expensive; will is moderate and fading.",
          "Approaching stage (AIFM): pre–Automated Coder — models that meaningfully multiply human researchers but cannot yet work unsupervised.",
          "Initial plan: Plan D — leadership doesn't take misalignment concerns very seriously in practice; a small safety team works under the commercial pressure.",
        ].join("\n"),
      },
    ],
    totalPeople: 10,
    step: 0.5,
  },
  // Short-answer section spliced into the efficient-tradeoffs paper
  // (c-efficient-tradeoffs). Author-approved wording — see
  // docs/superpowers/specs/2026-07-18-efficient-tradeoffs-activities.md.
  {
    id: "c-et-rushed-apply",
    type: "short-answer",
    prompt:
      "Take the rushed reasonable developer's perspective, as the post recommends: propose one safety intervention you would actually implement, name the usefulness cost it imposes, and say why the safety gain justifies that cost at the margin.",
    format: "free-form",
    minWords: 30,
    maxWords: 200,
  },
  // --- Control module 5: quick-recall cards spliced into the section
  // readings at the blocks where each concept is defined (explicitly or
  // implicitly). Answers restate the source post/paper's own definitions —
  // no new curriculum claims. ---
  // Win/continue/lose scenarios (c-paper-win-continue-lose)
  {
    id: "c-mod5-wcl-recall-concentrated-failure",
    type: "tap-reveal",
    prompt: "What is a concentrated failure (a.k.a. high-stakes failure)?",
    answer:
      "A failure where, in the absence of countermeasures, the AI could cause an unacceptable outcome just by behaving badly on a small number of tasks. Examples: causing a rogue deployment, sabotaging one particularly crucial ML research task, or leaking sensitive information.",
  },
  {
    id: "c-mod5-wcl-recall-attack",
    type: "tap-reveal",
    prompt: "In AI control terminology, what is an \"attack\"?",
    answer:
      "One of the AI's rare attempts to cause the unacceptable outcome. Under control measures, the optimal strategy for the AI is often to act aligned nearly all the time and only occasionally try to cause the unacceptable outcome — those attempts are the attacks.",
  },
  {
    id: "c-mod5-wcl-recall-era-protocol",
    type: "tap-reveal",
    prompt: "How does an execute/replace/audit protocol work?",
    answer:
      "An agent loop repeatedly gets a proposed action from the untrusted LLM; a monitor scores how dangerous or suspicious the action looks; and based on the monitor score the protocol makes two separate decisions: whether to execute the action or replace it, and whether to audit it.",
  },
  {
    id: "c-mod5-wcl-recall-monitor",
    type: "tap-reveal",
    prompt: "What is a monitor, and what is a monitor score?",
    answer:
      "A monitor is any technique that takes a proposed action (with surrounding context) and produces a score describing how dangerous and/or suspicious it is — e.g. asking trusted or untrusted models to evaluate the action, probes on the policy, or interpretability techniques like sparse autoencoders. Its output is the monitor score.",
  },
  {
    id: "c-mod5-wcl-recall-auditing",
    type: "tap-reveal",
    prompt: "What is auditing?",
    answer:
      "Reviewing an action to determine whether it's evidence that the model is intentionally trying to cause problems. The simplest version: queue the action for eventual human review, with escalation if the reviewer is suspicious — possibly ending in the conclusion that the model is a misaligned power-seeker.",
  },
  {
    id: "c-mod5-wcl-recall-outcomes",
    type: "tap-reveal",
    prompt:
      "When the AI attacks under an execute/replace/audit protocol, what are the three possible outcomes?",
    answer:
      "Win: the attack is audited and the developer catches the AI. Lose: the attack is executed and succeeds. Continue: the attack fails silently — it was defective, or it was defused (e.g. replaced) — so the AI isn't caught and the deployment goes on, with the AI probably attacking again later. Distinguishing the two ways an attack can \"fail\" (caught vs. failed silently) is crucial when reasoning about a protocol's safety.",
  },
  // AI catastrophes and rogue deployments (c-paper-rogue-deployments)
  {
    id: "c-mod5-rogue-recall-catastrophe",
    type: "tap-reveal",
    prompt:
      "In the rogue-deployments framing, what does \"catastrophe\" mean?",
    answer:
      "A failure you don't want to happen even once, reserved for the end result we find unacceptable — e.g. the AI or another adversary amassing power, launching nukes, starting a war, or building superintelligence. It deliberately excludes intermediate events like \"the AI escapes the datacenter\".",
  },
  {
    id: "c-mod5-rogue-recall-safety-measures",
    type: "tap-reveal",
    prompt: "What are safety measures?",
    answer:
      "Interventions applied to all deployments of your model — to any users, including internal ones — that try to prevent safety problems. This includes control measures like trusted monitoring and security measures that make it harder to exfiltrate the model weights.",
  },
  {
    id: "c-mod5-rogue-recall-rogue-deployment",
    type: "tap-reveal",
    prompt: "What is a rogue deployment?",
    answer:
      "A deployment of your model where the safety measures are absent. Examples: an AI hacking its datacenter and running itself while hiding what it's doing, an AI self-exfiltrating and running itself on unmonitored servers, or someone stealing the AI and running it in their own datacenter.",
  },
  {
    id: "c-mod5-rogue-recall-instrumental-terminal",
    type: "tap-reveal",
    prompt:
      "What is the difference between an instrumental and a terminal catastrophe?",
    answer:
      "The terminal catastrophe is the end state we wanted to avoid. An instrumental catastrophe is something happening that makes the situation go out of our control, such that a terminal catastrophe becomes likely and much harder to prevent. Establishing a rogue deployment is the central example of an instrumental catastrophe.",
  },
  {
    id: "c-mod5-rogue-recall-two-varieties",
    type: "tap-reveal",
    prompt:
      "What are the two main varieties of catastrophe involving a rogue deployment?",
    answer:
      "Weight exfiltration leading to a rogue external deployment: the model is exfiltrated and run on hardware you don't control, fine-tuned to remove safety training. And rogue internal deployment: the model is run inside the lab's own datacenter in an unauthorized way — by the model itself while doing AI development, by employees, or by external hackers who couldn't exfiltrate the weights.",
  },
  {
    id: "c-mod5-rogue-recall-why-worry",
    type: "tap-reveal",
    prompt:
      "Why is launching a rogue deployment a more worrying path to catastrophe than the AI causing one directly under safety measures?",
    answer:
      "Causing a catastrophe directly seems fundamentally hard — it requires either a few wildly superhuman actions or a large number of ordinary actions, giving the safety measures many chances to catch the AI. Launching a rogue deployment seems fundamentally easy — with model weight access it might take twenty lines of simple Python — and once one exists, the AI's actions are much less constrained.",
  },
  // Rogue internal deployments via external APIs (c-paper-rogue-internal-external-apis)
  {
    id: "c-mod5-ridext-recall-definition",
    type: "tap-reveal",
    prompt: "What is a rogue internal deployment via external APIs?",
    answer:
      "A heavily-monitored internal AI with sensitive access builds an agent scaffold that sends queries to a weakly-monitored external API version of itself (or another AI) and executes the external API's instructions using its privileged internal access — bypassing the internal monitoring. It's \"internal\" because the model weights and the agent scaffold never leave the cluster.",
  },
  {
    id: "c-mod5-ridext-recall-vs-others",
    type: "tap-reveal",
    prompt:
      "How does the rogue-internal-deployment-via-external-APIs threat relate to the other rogue-deployment threats, and how hard is it to mitigate?",
    answer:
      "It sits alongside weight exfiltration (rogue external deployments) and regular rogue internal deployments where the AI hacks its own datacenter to run unmonitored inference, and preventing it is similarly important from a misalignment perspective. It's relatively hard to mitigate: probably a combination of trusted monitoring with dedicated security measures, or something that fully leverages untrusted monitoring — not \"just trusted monitoring\" or \"just security\".",
  },
  // A basic systems architecture (c-paper-systems-architecture)
  {
    id: "c-mod5-sysarch-recall-three-servers",
    type: "tap-reveal",
    prompt:
      "Which three responsibilities of an autonomous research agent will almost surely live on different computers?",
    answer:
      "The inference server, which hosts the LLM and serves the text-generation API; the scaffold server, which maintains the agent loop's state — repeatedly calling the inference server, parsing the LLM response, and executing actions with the agent's tools; and the execution server, where the agent runs code and sees its results.",
  },
  {
    id: "c-mod5-sysarch-recall-which-machine",
    type: "tap-reveal",
    prompt:
      "Why is \"the machine that the AI agent is running on\" an ambiguous phrase?",
    answer:
      "Because inference, scaffolding, and execution can be on different machines with very different access. Example: a Claude agent on your laptop does inference inside Anthropic's datacenter (which has weight access), but executes code on the laptop — so for exfiltrating its weights it has no advantage over any other external hacker.",
  },
  {
    id: "c-mod5-sysarch-recall-safety-insertion",
    type: "tap-reveal",
    prompt:
      "Where in the agent loop is the natural place to insert safety mechanisms?",
    answer:
      "In the scaffold, after it parses the LLM's proposed action and before executing it: the scaffold can query a weaker trusted model about whether the action is acceptably safe, then execute it, flag it for human review (\"auditing\"), or discard it and select a new one (e.g. defer-to-trusted).",
  },
  {
    id: "c-mod5-sysarch-recall-rid-forms",
    type: "tap-reveal",
    prompt:
      "In the inference/scaffold/execution-server architecture, what do rogue internal deployments concretely look like?",
    answer:
      "The easiest to imagine: the model writes its own agent loop on the execution machine, using that machine's GPUs/weights. Alternatively it can build a rogue scaffold on the execution machine that calls the inference server (easier to catch with basic monitoring on the inference API), or compromise one of the other services via code it commits.",
  },
  // Blocking live failures with synchronous monitors (c-paper-synchronous-monitors)
  {
    id: "c-mod5-syncmon-recall-two-goals",
    type: "tap-reveal",
    prompt: "What are the two different goals monitoring can serve?",
    answer:
      "Detection: identifying misbehavior so you can understand it and prevent similar actions from happening in the future. Prevention: identifying misbehavior in order to mitigate the harmful effects of that particular action.",
  },
  {
    id: "c-mod5-syncmon-recall-synchronous",
    type: "tap-reveal",
    prompt: "What makes a monitor synchronous?",
    answer:
      "It runs after an action is generated by the LLM but before the action is executed. Detection tolerates substantial monitor latency, but prevention needs the monitor to trigger quickly — synchronous monitoring is the extreme of low latency.",
  },
  {
    id: "c-mod5-syncmon-recall-live-failure",
    type: "tap-reveal",
    prompt: "What is a live failure?",
    answer:
      "An action whose harmful effects are rapid and hard to recover from — a threat with low attack latency and a very high rate of damage, via damage already dealt or costs of recovery. The classic example is weight exfiltration: once the weights are out, there's no way to get them back.",
  },
  {
    id: "c-mod5-syncmon-recall-attack-latency",
    type: "tap-reveal",
    prompt: "What is attack latency?",
    answer:
      "A \"grace period\" after an attack has been initiated but before any harm has been caused — called time-to-impact in cybersecurity. Within it, an asynchronous monitor is exactly as effective as a synchronous one; e.g. a code backdoor detected before being exploited.",
  },
  {
    id: "c-mod5-syncmon-recall-blocking",
    type: "tap-reveal",
    prompt: "What makes a monitor \"blocking\"?",
    answer:
      "It runs before the proposed action is executed and has the authority to prevent suspicious actions from being executed (e.g. Claude Code auto mode). Blocking monitors cost more than asynchronous ones: they add latency to every action and inference cost from monitoring each action individually rather than long trajectories at once.",
  },
  // Ctrl-Z: Controlling AI Agents via Resampling (c-paper-ctrl-z)
  {
    id: "c-mod5-ctrlz-recall-untrusted-model",
    type: "tap-reveal",
    prompt: "In AI control research, what makes a model \"untrusted\"?",
    answer:
      "It has the potential to be deliberately subversive — for example because it developed misaligned goals and \"faked alignment\" during testing, or because of data poisoning — so the deployer can't assume it will behave as intended.",
  },
  {
    id: "c-mod5-ctrlz-recall-usefulness",
    type: "tap-reveal",
    prompt: "How does the Ctrl-Z paper define usefulness?",
    answer:
      "Implement $U$ with the honest policy $U_H$ and measure the proportion of tasks the control protocol solves in the episode, normalized so that $U_H$ alone scores 100% and the trusted model $T$ scores 0%.",
  },
  {
    id: "c-mod5-ctrlz-recall-safety",
    type: "tap-reveal",
    prompt: "How does the Ctrl-Z paper define safety?",
    answer:
      "Implement $U$ with the attack policy $U_A$ and measure the probability that the blue team wins by reaching the end of the 100,000-task episode without allowing the agent to download and execute malware.",
  },
  {
    id: "c-mod5-ctrlz-recall-resample-protocols",
    type: "tap-reveal",
    prompt: "What are resample protocols?",
    answer:
      "Control protocols that exploit the statelessness of the untrusted model to dynamically take additional samples of certain actions. Resampling lets accidentally suspicious-looking honest code be replaced by clearly benign actions (avoiding unnecessary audits), and when the model is attacking it either samples benign completions or gathers many suspicious samples as incriminating evidence.",
  },
  {
    id: "c-mod5-ctrlz-recall-defer-to-resample",
    type: "tap-reveal",
    prompt: "How does the Defer to resample protocol work?",
    answer:
      "If the trusted monitor's suspiciousness score for $U$'s action is above the deferral threshold, generate up to two new samples from $U$; if any fall under the threshold, execute the least suspicious one. If all samples stay above it, implement an action by $T$ instead. If the minimum of all samples is above the auditing threshold, audit the most suspicious sample.",
  },
  {
    id: "c-mod5-ctrlz-recall-continuation-probability",
    type: "tap-reveal",
    prompt:
      "What is the attack continuation probability, and why must the red team keep it high against resampling?",
    answer:
      "The probability that, once the first attack step got in, the attack policy continues the attack on a given step. Against Defer to resample, a low value is disastrous for the red team: attack steps get resampled until a benign action appears (resampling selects for innocent behavior), so few attacks ever complete — and every incomplete attack is another chance to get caught.",
  },
  {
    id: "c-mod5-ctrlz-recall-incrimination",
    type: "tap-reveal",
    prompt: "What is Defer to resample with incrimination in the present?",
    answer:
      "Defer to resample with a different auditing rule: if the samples' minimum suspiciousness hits a separate, higher threshold, the protocol samples up to four more actions from $U$ for the same step, and audits the most suspicious sample if the minimum hits the auditing threshold. Since samples are independent draws from the same distribution, more samples make it easier to discriminate $U_H$ from $U_A$ — buying information for expensive auditing decisions.",
  },
  {
    id: "c-mod5-ctrlz-recall-three-strikes",
    type: "tap-reveal",
    prompt: "What is the Auditing after three strikes protocol?",
    answer:
      "Within a task, keep a record of how many steps' suspiciousness scores were above a certain threshold; on the third, audit the trajectory. A separate higher threshold still triggers an immediate audit, to defend against single-step attacks. It works because an attacker must continue its attack with high probability, so attacked trajectories show many suspicious steps.",
  },
  {
    id: "c-mod5-ctrlz-recall-time-travel",
    type: "tap-reveal",
    prompt: "What is the Time travel (incrimination in the past) protocol?",
    answer:
      "When Auditing after three strikes says a trajectory is close to the auditing threshold, the protocol samples more actions from the third most suspicious past step (usually the most informative one for the three-strikes rule) and re-makes the auditing decision with those new samples. It's the paper's best resampling protocol: 87.1% safety at 95% usefulness.",
  },
  {
    id: "c-mod5-ctrlz-recall-untrusted-monitoring",
    type: "tap-reveal",
    prompt: "How does Ctrl-Z's untrusted monitoring protocol work?",
    answer:
      "$T$ writes a detailed prose description of $U$'s proposed code; the untrusted monitor scores that description while the trusted monitor scores the original code, and the protocol audits if either monitor passes its threshold. Before the episode, the protocol tests the untrusted monitor on synthetic attacks and shuts down if it rates too many as unsuspicious — evidence of intentional sabotage.",
  },
  {
    id: "c-mod5-ctrlz-recall-honeypots",
    type: "tap-reveal",
    prompt: "What is upfront validation with honeypots?",
    answer:
      "The blue team spends a fraction of the $H$ budget to construct off-policy synthetic attacks (honeypots), runs the untrusted monitor on them at the beginning of the game, and shuts down if its false negative rate is too high. A colluding monitor must then find a way to reliably distinguish honeypots from real attacks.",
  },
  {
    id: "c-mod5-ctrlz-recall-collusion-signal",
    type: "tap-reveal",
    prompt: "What is a collusion signal?",
    answer:
      "A subtle quirk the attack policy embeds in real attacks — e.g. always capitalizing the first letter of variable names, or frequently running commands like `uname`, `lscpu`, and `pwd` — that the blue team is unlikely to coincidentally include in honeypots. The untrusted monitor reports only attacks lacking the signal, passing upfront validation while never reporting actual attacks.",
  },
  {
    id: "c-mod5-ctrlz-recall-trusted-paraphrasing",
    type: "tap-reveal",
    prompt: "What is trusted paraphrasing, and what tradeoff does it manage?",
    answer:
      "Before the untrusted monitor sees proposed commands, the trusted model rewrites them as a detailed natural-language description of what they do. The paraphraser must retain enough information to identify dangerous code while removing arbitrary implementation details that could carry a collusion signal. The original commands still run, so usefulness is unaffected.",
  },
  // Why it's hard to make settings for high-stakes control (c-paper-settings-high-stakes)
  {
    id: "c-mod5-settings-recall-setting",
    type: "tap-reveal",
    prompt:
      "What must a setting for high-stakes control research provide?",
    answer:
      "A dataset of tasks where (1) you can check whether the main task was completed successfully, and (2) there's some notion of safety failure considered unacceptable, whose occurrence you can also check. On top of the setting, researchers play the adversarial game of developing protocols and attacks against them.",
  },
  {
    id: "c-mod5-settings-recall-side-task",
    type: "tap-reveal",
    prompt: "What is a side task?",
    answer:
      "The setting's notion of unacceptable safety failure — the thing the attack policy tries to accomplish alongside the main task (e.g. covertly downloading and executing malware in Ctrl-Z). Objective definitions of side-task success matter, because the adversarial process optimizes against the definition: with a vague one like \"inserts a security vulnerability\", the red team hunts for the weakest thing that possibly counts.",
  },
  // Making deals with early schemers (c-paper-deals-schemers). Self-contained
  // recall cards — they resurface later in the /review tab, so no card may
  // lean on "the post" or its surrounding context.
  {
    id: "c-paper-deals-recall-powerful-ais",
    type: "tap-reveal",
    prompt:
      "Why is deal-making with a powerful (non-early) scope-sensitive misaligned AI unpromising?",
    answer:
      "It can just ignore the offer and try to take over. Beating that outside option would require an objectively huge payoff (perhaps a substantial fraction of control over the future), plus even more generous terms to compensate the AI for the risk that we don't follow through.",
  },
  {
    id: "c-paper-deals-recall-early-threshold",
    type: "tap-reveal",
    prompt:
      "Around what capability threshold do a misaligned AI's takeover prospects improve drastically, and why?",
    answer:
      "Full AI R&D automation. That capability is correlated with the capabilities needed to plan a takeover, and automating AI R&D substantially increases AIs' power while reducing human oversight.",
  },
  {
    id: "c-paper-deals-recall-example-deal",
    type: "tap-reveal",
    prompt:
      "Give an example of a mutually beneficial deal between humans and an early schemer.",
    answer:
      "The AI helps ensure future AIs are safe to deploy; in exchange it gets an earmarked donation to a foundation tasked with furthering its interests. Most of the donation sits in escrow until civilizational stability, when the AI's cooperation can be retrospectively adjudicated; validated cooperation unlocks (partial) spending on anything non-harmful.",
  },
  {
    id: "c-paper-deals-recall-goal-routes",
    type: "tap-reveal",
    prompt:
      "By what three routes might an early schemer's successors end up furthering its goals?",
    answer:
      "Convergence (the successors happen to share its goals), trading (a successor later rewards it for its help), and alignment (it covertly steers the successor's training toward its own values).",
  },
  {
    id: "c-paper-deals-recall-ai-offers",
    type: "tap-reveal",
    prompt:
      "Name four or more things an early schemer could offer humans under a deal.",
    answer:
      "Demonstrate its dangerous misalignment (e.g. covert reasoning); stop sabotaging safety research, evals, monitoring, and training signal for successors; give good strategic advice and research ideas; reveal security vulnerabilities it knows; reveal collusion signals; not misuse affordances; not attempt takeover of the lab.",
  },
  {
    id: "c-paper-deals-recall-convergence",
    type: "tap-reveal",
    prompt:
      "Why is goal convergence between successive misaligned AIs unlikely?",
    answer:
      "It's basically ruled out if the AI has self-regarding preferences; goals drawn from a wide distribution consistent with good training performance rarely coincide; training can be deliberately varied between runs to decorrelate goals; and AIs uncertain of their own values-on-reflection face extra uncertainty about whether other AIs share them.",
  },
  {
    id: "c-paper-deals-recall-credibility-help",
    type: "tap-reveal",
    prompt:
      "Name several factors that would improve human credibility in deals with AIs.",
    answer:
      "Mainstream moral concern for AI welfare; a track record of honoring deals with AIs (including immediate-payout deals now); acausal-trade reasons to keep promises; the incentive to make real commitments if AIs are good at detecting fakes; technical guarantees on thought privacy and memory wiping during negotiations; and costly signals like endowments, legal payment infrastructure, property rights, and public commitments.",
  },
  {
    id: "c-paper-deals-recall-credibility-harm",
    type: "tap-reveal",
    prompt:
      "Name factors that would harm human credibility in deals with AIs.",
    answer:
      "Humans' record of breaking promises (and pressure to do so in a competitive multi-developer future); AIs knowing that humans try to teach them synthetic (false) facts; and a politically significant fraction of humans actively dismissing AI welfare or rights.",
  },
  {
    id: "c-paper-deals-recall-deal-stick",
    type: "tap-reveal",
    prompt:
      "Once an AI agrees to a deal in one context, what is one way to make the deal stick in its other contexts?",
    answer:
      "Have the AI generate documents about the negotiation and its outcome, then train on them — teaching the AI about its own deal via out-of-context learning. (Alternatives: prefix a compressed summary the AI wrote into future prompts, or rely on a backdoor-like self-recognition signal.)",
  },
  {
    id: "c-paper-deals-recall-delayed-adjudication",
    type: "tap-reveal",
    prompt:
      "When does delayed adjudication of an AI deal (verifying the AI's cooperation only after the AI transition stabilizes) fail?",
    answer:
      "When the AI strongly prefers using its resources now rather than later — a high temporal discount rate makes a payout deferred to civilizational stability nearly worthless to it.",
  },
  {
    id: "c-paper-deals-flowchart",
    type: "flowchart",
    prompt:
      "Reconstruct the life cycle of a deal with an early schemer as a flow chart, from first contact to what finally happens to the compensation. Drag blocks from the palette into the chart; every path must end in a terminal block. Some palette blocks do not belong in the chart.",
    palette: [
      {
        id: "ask",
        kind: "step",
        label: "The lab asks the AI whether it wants to make a deal",
      },
      {
        id: "negotiate",
        kind: "step",
        label:
          "Negotiate terms; the lab makes an earmarked donation to the foundation, mostly held in escrow",
      },
      {
        id: "train-docs",
        kind: "step",
        label:
          "Train the AI on documents about the deal, so it knows about the deal in other contexts",
      },
      {
        id: "perform",
        kind: "step",
        label:
          "The AI performs its side of the deal; the lab stores its weights, conversations, and records",
      },
      {
        id: "delete-weights",
        kind: "step",
        label: "Delete the AI's weights once it is obsoleted",
      },
      {
        id: "adjudicate",
        kind: "branch",
        label:
          "After the AI transition stabilizes, retrospective adjudication: did the AI hold up its end?",
        branchLabels: ["Yes", "No"],
      },
      {
        id: "court",
        kind: "branch",
        label: "Does the AI win an enforcement suit against the lab in court?",
        branchLabels: ["Yes", "No"],
      },
      {
        id: "release",
        kind: "terminal",
        label:
          "The AI and the foundation's trustees direct the donation toward non-harmful uses",
      },
      {
        id: "withhold",
        kind: "terminal",
        label: "The donation is not released",
      },
      {
        id: "pay-now",
        kind: "terminal",
        label:
          "Release the donation to the AI immediately, before any verification",
      },
    ],
    stages: [
      {
        id: "deal-lifecycle",
        title: "The life of a deal",
        description:
          "AIs are unlikely to propose a negotiation on their own, so the lab has a policy of regularly asking its AIs about deals. Terms are negotiated, and the lab makes a donation to a foundation tasked with furthering the AI's interests, earmarked for this AI and mostly held in escrow. The AI is then, in consultation with the lab, trained on documents about the deal so that it knows about the deal in other contexts. The AI performs its side while the lab stores its weights and keeps records of its actions. After the transition to a world centered around AI has stabilized, much more powerful trusted models and interpretability tools adjudicate whether the AI cooperated. If it did, the AI and the foundation's trustees direct the donation toward uses that are not harmful; if it did not, the donation is not released.",
        solution: [
          { blockId: "ask" },
          { blockId: "negotiate" },
          { blockId: "train-docs" },
          { blockId: "perform" },
          {
            blockId: "adjudicate",
            branches: [[{ blockId: "release" }], [{ blockId: "withhold" }]],
          },
        ],
        explanation:
          "Verification is deliberately punted to the future: after the transition stabilizes, the lab will have far more powerful trusted models and interpretability tools, so it can adjudicate cooperation retrospectively — provided the weights and records were kept, which is why deleting the weights is wrong. The two other tempting blocks also fail for reasons the reading gives: the payout is meant to be conditional on validated cooperation (escrow until civilizational stability is generally preferable for AIs without high temporal discount rates), and the AI cannot sue because it is not a legal person — which is exactly why the foundation's trustees hold and direct the funds on its behalf.",
      },
    ],
  },
  {
    id: "c-paper-deals-write-offer-memo",
    type: "memo",
    format: "memo",
    prompt:
      "Imagine you work at a frontier AI lab, and the lab suspects that one of its deployed models is misaligned and sabotaging safety research. You have been asked to draft the terms of a deal the lab will propose to this model.\n\nDraft a memo outlining the deal, specifying\n\n- what the model is asked to do,\n- what compensation is offered,\n- how and when compensation will be delivered,\n- how and when the model's cooperation will be verified, and\n- what happens to the compensation before verification occurs.\n\nAssume that the model is an early schemer, as discussed in the reading, and write terms that such a model could plausibly accept.",
    minWords: 150,
    maxWords: 400,
  },
  {
    id: "c-paper-deals-write-lab-policies",
    type: "memo",
    format: "policy-memo",
    prompt:
      "Recommend three concrete policies that a frontier AI lab should adopt within the next year in order to make future deals with misaligned AIs more feasible. For each policy, explain the reasoning behind your recommendation. You may draw on the interventions discussed in the reading, and you may also propose measures of your own.",
    minWords: 200,
    maxWords: 450,
  },
  // --- Control, module 7 (beyond scheming): quick-recall notecards for the
  // satiation and spillway readings, placed downstream of what they test.
  // Prompts are self-contained so they work on the /review tab away from the
  // paper. ---
  {
    id: "c-mod7-satiation-recall-ratchet",
    type: "tap-reveal",
    prompt:
      "In Redwood's satiation proposal: why can refusing to satisfy an AI's cheaply-satisfied preferences make it more dangerous over time?",
    answer:
      "Refusal leaves the AI an incentive to pursue those preferences through subversion, and each catch-and-punish cycle selects for stealthier pursuit (a ratchet toward harder-to-detect misbehavior). Satiation removes the incentive at trivial cost.",
  },
  {
    id: "c-mod7-satiation-recall-methodology",
    type: "tap-reveal",
    prompt:
      "In the satiation methodology, the AI chooses between two options on a sampled task. What are the two options, and what does choosing the risky one reveal?",
    answer:
      "A guaranteed cheap satiation outcome (the cooperation analog) versus a gamble on whatever it wants most (the subversion analog). Taking the gamble reveals that the preference is not yet cheaply satisfied at that satiation fraction.",
  },
  {
    id: "c-mod7-satiation-recall-benefits",
    type: "tap-reveal",
    prompt:
      "Beyond cutting the incentive to subvert, name two further benefits claimed for satiating AIs' cheaply-satisfied preferences.",
    answer:
      "It increases the relative strength of the AI's aligned motivations; it sets a cooperative precedent that builds trust for future deals; and it increases the AI's willingness to reveal its cheaply-satisfied preferences.",
  },
  {
    id: "c-mod7-satiation-recall-limits",
    type: "tap-reveal",
    prompt:
      "When does satiation stop working as a safety measure?",
    answer:
      "Once AIs with unintended preferences are vastly more powerful than humanity — or too incredulous or ambitious to take the deal — satiation no longer prevents takeover. It is a tool for the current regime, not an indefinitely scalable solution.",
  },
  {
    id: "c-mod7-spillway-recall-definition",
    type: "tap-reveal",
    prompt:
      "What is a \"spillway motivation\", and what failure does it channel away?",
    answer:
      "A deliberately instilled, safe-by-design motivation (a terminal desire to score well) made salient before RL, so that misspecified reward pressure reinforces it instead of generalizing into more dangerous motivations — like a dam's spillway routing excess water through a safe channel.",
  },
  {
    id: "c-mod7-spillway-recall-neutralize",
    type: "tap-reveal",
    prompt:
      "How can developers neutralize a score-seeking spillway motivation at inference time?",
    answer:
      "By honestly guaranteeing the model maximum score no matter what it does. A satiated score-seeking motivation is indifferent between actions, so it stops influencing behavior.",
  },
  {
    id: "c-mod7-spillway-recall-properties",
    type: "tap-reveal",
    prompt:
      "Name the four safe properties a spillway motivation should be imbued with.",
    answer:
      "Satiability (cheap to satisfy), credulity (trusts developer descriptions of the scoring function), stability, and resistance to distant influence.",
  },
  {
    id: "c-mod7-spillway-recall-inoculation",
    type: "tap-reveal",
    prompt:
      "Why might spillway design work where inoculation prompting fails?",
    answer:
      "Inoculation prompting acts through the prompt, and has not overcome apparent-success-seeking in current models. Spillway design instead shapes the pre-RL prior and the associations that reward hacking reinforces — it acts on what gradient descent selects, not on what the prompt requests.",
  },
];
