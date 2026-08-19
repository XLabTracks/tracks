import type { Exercise } from "@/lib/content/types";

// The Verification track's written tasks, lifted verbatim from the author's
// outline — every prompt is the outline's own words for that task.
//
// Writing-prompt exercises rather than prose in a callout, because a task a
// learner cannot answer is not a task: this type carries the editor, the
// autosaving draft, the submit step and the review path the app already has.
// `exercises.data.ts` only spreads these in.
//
// No word bounds and no rubric where the outline states neither — inventing a
// minimum or a marking scheme would be inventing curriculum. The 0.2 tasks
// are the exception the rule allows for: the Outline-36 revision brackets a
// word budget onto every one of its prompts ("[200-250 words]"), so those
// carry minWords/maxWords transcribed from it.
//
// A table is NOT a task. Eight of the outline's tables were pasted in here as
// writing-prompt prompts, cells joined by blank lines, and rendered as a
// FREE RESPONSE card holding a flat column of cell text with no grid, no
// header and an answer box under it. Tables belong in the MDX as markdown
// tables — `.lesson-body table` in globals.css already gives them the house
// treatment and its own scroll box. If a prompt has no question in it, it is
// not a prompt.

export const verificationExercises: Exercise[] = [
  {
    id: "v-task-introduction-1",
    type: "writing-prompt",
    prompt: "Optional task — The strongest objection.\n\nIn a short written note, construct the strongest objection you can to the case above — and state what would change your mind, in either direction.",
    format: "free-form",
    optional: true,
  },
  // 0.2, Option A — the outline's five prompts, one exercise each. Splitting
  // is the Outline-36 revision's own shape ("shorter, prompted questions
  // linking into a more cohesive essay at the end"); the prompt text and the
  // word budgets are its words verbatim. The A5/B5 recommendation choice is
  // <VerdictSelect/> in the lesson body, not part of these prompts.
  {
    id: "v-task-intuitions-5",
    type: "writing-prompt",
    prompt:
      "Choose the part of this system that you think carries the most verification weight. Focus on the proposed datacenter retrofit: optical network taps, reproducible workloads, trusted recomputation servers, network restrictions, and related safeguards. Which mechanism seems like the most important—that, if removed, would most endanger the verification regime's effectiveness? Do not use outside resources for this part of the exercise.\n\nQuestions to consider:\n\n- What types of evidence does it provide—implied, likely, or certain? Ambiguous (rough power signatures) or exact (the model weights themselves)?\n- What kinds of cheating could it detect?\n- If a state had years to prepare an evasion strategy, where would you expect it to attack the system? Where would you most expect a motivated adversary to fail?\n- What other mechanisms does this one depend on, and what downstream mechanisms rely on this one's reliability?\n\nThere is no right answer here, and you do not need to find a secret or definitive vulnerability. Decide how much confidence this mechanism deserves and explain why.",
    format: "free-form",
    minWords: 200,
    maxWords: 250,
  },
  {
    id: "v-task-intuitions-6",
    type: "writing-prompt",
    prompt:
      "Now that you have a good grasp on your ideas of the Verification Plan's strengths, let's turn to identifying its weak points. Identify at least one mechanism, assumption, or implementation step in Plan A that you think is especially vulnerable to failure. Explain why the weakness matters for the regime as a whole. This is arguably the most central prompt: only by red-teaming and finding vulnerabilities can a regime patch its holes.\n\nQuestions to consider:\n\n- What has to go right politically, technically, and operationally for this part of the plan to work?\n- Which assumptions seem least reliable under tight timelines, strategic competition, or uneven cooperation among states and firms?\n- If this mechanism underperforms, what other parts of the verification regime compensate for it—and where might the failure cascade?\n\nAfter you have a good idea of a weakness you want to critique, explain which weakness, why it's most jeopardizing, and some ideas (not too long) about how you would go about strengthening it.",
    format: "free-form",
    minWords: 200,
    maxWords: 250,
  },
  {
    id: "v-task-intuitions-7",
    type: "writing-prompt",
    prompt:
      "Choose the timeline milestone that seems least likely to accomplish on schedule. Then, look closely at the implementation sequence in 2029: chip declarations and inspections, datacenter retrofits, and the expansion of verification coverage across the world's major compute.\n\nIn your rationale, you might compare the proposal with an arms-control inspection regime, a large industrial mobilization, an export-control system, or another suitable verification parallel. For inspiration, you may use outside resources or click ahead to learn more about historical verification precedents in [Module 0.3](/tracks/verification/why-verification/precedents).\n\nAsk whether the precedent changes your estimate of what could realistically be built within Plan A's timeline.",
    format: "free-form",
    minWords: 150,
    maxWords: 200,
  },
  {
    id: "v-task-intuitions-8",
    type: "writing-prompt",
    prompt:
      "The supplement estimates that some compute may remain hidden even after declarations and inspections, initially on the order of 0.5% of world AI-relevant compute. Your task is to decide how important that residual capacity is, and argue for whether the benign capacity threshold should be increased, decreased, or kept the same.\n\nQuestions to consider:\n\n- What could a well-resourced state accomplish with a small covert cluster over several years?\n- What disadvantages would such a project face?\n- Which other mechanisms in Plan A might constrain it?\n- Could algorithmic efficiency gaming realistically and substantively increase the capabilities of the hidden compute?\n\nIncreased, decreased, or left the same, justify your proposal for the covert-compute margin.",
    format: "free-form",
    minWords: 100,
    maxWords: 150,
  },
  {
    id: "v-task-intuitions-9",
    type: "writing-prompt",
    prompt:
      "Consider your strongest arguments and their strongest objections. Synthesize ideas from your earlier responses into a short essay answering: How robust is Plan A's verification regime, and where is it most likely to fail?\n\nAt the end, briefly justify the recommendation you selected above.",
    format: "free-form",
    minWords: 400,
    maxWords: 600,
  },
  // 0.2, Option B — likewise the outline's five prompts, verbatim.
  {
    id: "v-task-intuitions-10",
    type: "writing-prompt",
    prompt:
      "Identify the central restriction under Plan A and Plan S: what would inspectors actually need to establish before they could reasonably conclude that actors were complying? Then, compare: does Plan A or Plan S give verification the clearer and more tractable target?\n\nQuestions to consider:\n\n- What prohibited activity would inspectors need to identify under each plan?\n- What observable physical, computational, or organizational traces would that activity leave?\n- Could prohibited activity resemble or hide within activity that remains permitted?\n- Where might reasonable inspectors disagree about whether a violation has occurred?\n\nMake a preliminary judgment. Delineate your evidence-backed reasons from intuitions.",
    format: "free-form",
    minWords: 100,
    maxWords: 150,
  },
  {
    id: "v-task-intuitions-11",
    type: "writing-prompt",
    prompt:
      "A clear rule is useful only if the available verification mechanisms can produce convincing evidence that actors are following it.\n\nFor Plan A, use the Verification Supplement to identify the mechanisms that provide the strongest evidence of compliance. For Plan S, consider what combination of tools from this course could provide comparable assurance—for example, compute declarations, inspections, chip accounting, power monitoring, remote sensing, intelligence, or personnel reporting.\n\nCompare the quality of evidence each regime could realistically produce.\n\nQuestions to consider:\n\n- Which compliance claims can be observed relatively directly, and which require substantial inference?\n- Would several independent verification mechanisms corroborate the same conclusion?\n- Where could multiple mechanisms share the same blind spot or unreliable assumption?\n- How much residual uncertainty would policymakers have to tolerate even when the regime appears to be working?\n\nDecide which plan could give decision-makers stronger grounds for confidence in compliance.",
    format: "free-form",
    minWords: 150,
    maxWords: 200,
  },
  {
    id: "v-task-intuitions-12",
    type: "writing-prompt",
    prompt:
      "Now, zoom out from individual pieces of evidence to the scale of the regime. Compare how much compute, infrastructure, activity, and geography would need to remain visible to inspectors under Plan A vs. Plan S. Pay particular attention to what kinds of AI activity remain permitted under each agreement and what that means for the monitoring burden.\n\nQuestions to consider:\n\n- Under which plan must inspectors make finer distinctions between permitted and prohibited activity?\n- How much of the relevant compute ecosystem would need reliable verification coverage?\n- Where could important activity fall outside the regime's field of view?\n- Does a broader prohibition make monitoring easier, or make gaps in coverage more consequential?\n\nRevisit your answer from Part 1. A rule that initially looked simpler may create a demanding monitoring problem once you consider how it would work across the real AI ecosystem.",
    format: "free-form",
    minWords: 150,
    maxWords: 200,
  },
  {
    id: "v-task-intuitions-13",
    type: "writing-prompt",
    prompt:
      "Verification also depends on whether governments, firms, and third countries will accept the access, restrictions, and institutional arrangements necessary to produce credible evidence.\n\nIdentify the hardest cooperation problem facing Plan A and the hardest facing Plan S. Compare how difficult each would be to overcome and how much the regime depends on solving it.\n\nQuestions to consider:\n\n- Which actors have the strongest incentives to refuse participation, demand exemptions, or withdraw later?\n- What commercially or militarily sensitive access would verification require?\n- What economic, strategic, or sovereignty costs would participation impose?\n- If one plan appears technically easier to verify but politically harder to implement, how much should that affect your assessment?\n\nBy this point, you should have compared the regimes across four dimensions: clarity of the verification target, strength of the evidence, monitoring burden, and political cooperation.",
    format: "free-form",
    minWords: 200,
    maxWords: 250,
  },
  {
    id: "v-task-intuitions-14",
    type: "writing-prompt",
    prompt:
      "You have already analyzed the comparison from four angles. Pull together the findings that matter most, consider the strongest argument against your own position, and answer: Which creates the more robust verification regime: Plan A or Plan S?\n\nMake a recommendation. Explain which considerations carry the most weight in your judgment, where important uncertainty remains, and what evidence or development would be most likely to change your view.",
    format: "free-form",
    minWords: 400,
    maxWords: 500,
  },
  {
    id: "v-task-intuitions-2",
    type: "writing-prompt",
    prompt:
      "Optional task — Essay: what does success look like to you?\n\nDescribe your own plausible success scenario for advanced AI governance. Think several steps beyond any single verification mechanism: what does a world that has successfully managed the relevant risks actually look like, and what agreement or institutional arrangement gets us there?\n\nQuestions to consider:\n\n- What would make you call the outcome a success, and which risks or tradeoffs would remain acceptable?\n- What agreement or institutional settlement sustains that outcome, and which actors must participate for it to hold?\n- What technological and geopolitical assumptions does your scenario depend on most heavily?\n- What must verification establish with high confidence, and where can the regime tolerate residual uncertainty?\n- Which actors, jurisdictions, or incentives pose the hardest coordination problem?\n- What has to become technically, politically, or institutionally possible before this settlement can emerge?\n- Where is your scenario most fragile, and what development would most likely force you to redesign it?\n\nKeep this essay. You will return to it at the end of the track and see what, if anything, you would now change.",
    format: "free-form",
    minWords: 500,
    maxWords: 800,
    optional: true,
  },
  {
    id: "v-task-intuitions-3",
    type: "writing-prompt",
    prompt: "Optional — Explore AI 2027\n\nRead [AI 2027](https://ai-2027.com/), the same team’s earlier scenario, including both of its endings. As you read, ask the question this section trained: at which branch points would verification infrastructure have changed what the actors could credibly agree to?",
    format: "free-form",
    optional: true,
  },
  // The Limited Test Ban Treaty passage that briefly sat here as
  // v-task-scoping-effective-feasible-1 was never a task — it carried no
  // question. Outline v40 marks it an expand box, and it now lives in
  // 1.0.2's body as a <Fold>.
  {
    id: "v-task-welcome-1",
    type: "writing-prompt",
    prompt:
      "Optional reflection — Write a short note that you can look back on after completing the course:\n\n- Why are you interested in learning about AI verification?\n- What do you want to gain from this course?\n- Before beginning, brainstorm: what parts of AI verification intuitively seems hardest?",
    format: "free-form",
    optional: true,
  },
  {
    id: "v-task-strategic-foundations-1",
    type: "writing-prompt",
    prompt:
      "Optional written output — Actor, authority, and evidence map.\n\nChoose one element of the advanced-AI supply chain. Map (1) the actors involved, (2) the authority each one holds, and (3) the evidence that would let an outside party verify what they are doing. Draw on whichever reading pathway above is most relevant to the element you pick.",
    format: "free-form",
    optional: true,
  },
];
