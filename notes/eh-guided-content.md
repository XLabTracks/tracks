# Exploration Hacking (guided) — content inventory

All authored content of the guided walkthrough (`c-paper-eh-guided`, `/tracks/control/low-stakes-control/exploration-hacking-guided`), in reading order. Source of truth: `src/content/papers.data.ts` (edits array), `src/content/exercises.data.ts` (`c-eh-*`), `src/content/lessons/c-eh-ins-*.mdx`. This file is a generated reference — edit the sources, not this. Compiled 2026-08-06.

Lesson-internal headings are shown one level down (####) so the document nests cleanly. "Silently removed" lines describe hidden paper text (no marker on the page); everything else is authored content.

---

## Abstract

**Silently removed:** the abstract text and Figure 1 (both give away the mechanism and findings).

### Note — "About this version"

This is a guided walkthrough of the paper that withholds and restructures several sections so you can think through the threat model and the mechanics before the authors reveal them. The original paper is available [as an ordinary reading](/tracks/control/low-stakes-control/exploration-hacking-paper).

---

## §2 Introduction

**Silently removed:** the mechanism paragraph (b-0006 — it is the answer to the first gate); the sentence naming exploration hacking as a hypothesized failure mode (b-0007 s1); and "This motivates work on measures to understand and reduce the threat of exploration hacking" (b-0007 s4), replaced inline with:

> This motivates work on measures to understand and reduce these threats.

### Written gate — `rl-vs-sl` (min 80 chars · "Compare with the paper")

Before reading on, answer in a few sentences: **what is the difference between RL and supervised learning?** And what makes RL more vulnerable than supervised learning to being undermined or manipulated by the model being trained?

### Reveal note — "The vulnerability"

RL methods are fundamentally dependent on sufficient exploration of diverse actions and trajectories. Unlike supervised learning, where training data is fixed, in on-policy RL the model generates its own training data through exploration. Consequently, if a model were to intentionally alter its exploration behavior, the training outcome could be significantly compromised. This failure mode is known as *exploration hacking* ([Greenblatt, 2025](https://www.alignmentforum.org/posts/abmzgwfJA9acBoFEX/notes-on-countermeasures-for-exploration-hacking-aka); [Shlegeris & Stastny, 2025](https://www.alignmentforum.org/posts/TeTegzR8X5CuKgMc3/misalignment-and-strategic-underperformance-an-analysis-of); [Braun et al., 2025](https://openreview.net/forum?id=ZNZn43baQX)): an agent strategically altering its exploration during RL training to influence the training outcome.

### Note — "Withheld for now" (under the Contributions heading)

The authors' contribution summary and section-by-section roadmap are withheld — they preview the constructions and findings this walkthrough asks you to predict first. Both are in the [original reading](/tracks/control/low-stakes-control/exploration-hacking-paper).

**Silently removed:** the three contribution bullets and the paper-structure paragraph. §2.1 Related Work stays verbatim.

---

## §3 Conceptual Framework

### Lesson — "Definition and RL background" (`c-eh-ins-framework`)

#### Definition

**Definition.** *Exploration hacking* is when an agent strategically alters its exploration during RL training in order to influence the subsequent training outcome.

#### General framework

RL on language models with chain-of-thought in agentic environments can be formulated as a Markov Decision Process (MDP), defined by a tuple $(\mathcal{S}, \mathcal{A}, P, R)$. In this setting, the state $s_t \in \mathcal{S}$ represents the complete conversation history up to time $t$, including the initial prompt $s_0 = x$ and all subsequent model outputs and tool responses. The action space $\mathcal{A}$ consists of the operations the model can perform, which are either invoking a tool or generating a final answer. The language model itself, parameterized by its weights $\theta$, acts as the policy $\pi_\theta(a \mid s)$, mapping the current state (conversation history) to a probability distribution over actions. The transition probabilities $P(s' \mid s, a)$ are typically deterministic; when a tool is invoked, the environment transitions to the next state $s_{t+1}$ by simply appending the tool's output to the history. A scalar reward $R(\tau)$ is assigned sparsely, only at the end of a trajectory $\tau$ when the model terminates with a final answer, based on answer correctness and potentially other factors such as trajectory length, tool use, and reasoning quality.

To simplify notation, and without loss of generality for deterministic environments, we ignore environment interaction during a trajectory and consider a tuple $(\mathcal{X}, \mathcal{T}, R)$ of initial prompts, full trajectories, and reward function, with a policy $\pi_\theta(\tau \mid x)$ generating an entire trajectory given an initial prompt.

#### Standard algorithms

While [Proximal Policy Optimization (PPO)](https://arxiv.org/abs/1707.06347) was long the dominant approach for RLHF in language models, its actor-critic architecture, which pairs the policy with a separate value network, is complex to train and implement. [Group Relative Policy Optimization (GRPO)](https://arxiv.org/abs/2402.03300) has emerged as a popular, less complex alternative for training reasoning models. GRPO eliminates the need for a value network by sampling $N$ trajectories for each prompt and normalizing the rewards within this group to compute advantages $\hat{A}_i = (R_i - \mu_R)/(\sigma_R + \epsilon)$ for $i = 1, \dots, N$, where $\mu_R$ and $\sigma_R$ are the sample mean and standard deviation of the rewards in the group, respectively.

The policy is then updated to maximize the objective (shown here, as in the paper, in its unclipped, trajectory-level form; the full formulation applies PPO-style clipping and computes the importance ratios and KL penalty per token)

$$
\mathcal{L}^{\text{GRPO}}(\theta) := \mathbb{E}_{x \sim \mathcal{D},\, \{\tau_i\}_{i=1}^{N} \sim \pi_{\text{old}}(\cdot \mid x)} \left[ \frac{1}{N} \sum_{i=1}^{N} \frac{\pi_\theta(\tau_i \mid x)}{\pi_{\text{old}}(\tau_i \mid x)}\, \hat{A}_i \right] - \beta\, D_{\text{KL}}(\pi_\theta \,\|\, \pi_{\text{ref}}).
$$

This approach requires only the policy and a reference model during training, and its effectiveness at leveraging relative comparisons between trajectories has led to its increasing adoption. Because of its popularity and simplicity, we focus on GRPO in this paper.

### Role of exploration (paragraph surgery)

**Silently removed:** sentences 2–6 of the "Role of exploration" paragraph (the full collapse argument — the answer to the next gate). The visible paragraph ends with this inline bridge:

> For GRPO in particular, this is critical: if the policy becomes deterministic, the reward provides no learning signal.

### Written gate — `grpo-determinism` (min 60 chars · "Show the annotated objective")

From the GRPO objective above: **why would the policy becoming deterministic cause the reward to provide no learning signal?** 

### Lesson — "The GRPO objective" (`c-eh-ins-grpo-collapse`)

#### The GRPO objective

$$
\mathcal{L}^{\text{GRPO}}(\theta) := \underbrace{\mathbb{E}_{x \sim \mathcal{D},\, \{\tau_i\}_{i=1}^{N} \sim \pi_{\text{old}}(\cdot \mid x)} \left[ \frac{1}{N} \sum_{i=1}^{N} \frac{\pi_\theta(\tau_i \mid x)}{\pi_{\text{old}}(\tau_i \mid x)}\, \hat{A}_i \right]}_{\text{gradient term}} \;-\; \underbrace{\beta\, D_{\text{KL}}(\pi_\theta \,\|\, \pi_{\text{ref}})}_{\text{KL term}}
$$

The reward reaches the gradient term only through the group-normalized advantages $\hat{A}_i = (R_i - \mu_R)/(\sigma_R + \epsilon)$. The KL term contains no reward at all as it provides pressure to pull $\pi_\theta$ toward the reference policy $\pi_{\text{ref}}$.

If the policy is deterministic, it will generate $N$ identical trajectories ($\tau_1 = \cdots = \tau_N$) with equal rewards. This causes the within-group reward variance to collapse ($\sigma_R = 0$), making all advantages vanish ($\hat{A}_i = 0$) and causing the gradient term to be $0$. The GRPO objective then only reduces to KL regularization, which doesn't provide any reward learning signal. PPO is similarly dependent on sufficient exploration: a deterministic policy prevents the discovery of higher-reward trajectories, causing the policy to converge prematurely to a local optimum regardless of the value function's accuracy. In practice, exploration is encouraged through sampling hyperparameters such as temperature and top-$p$, and entropy bonuses in the training objective.

### Understanding check — `c-eh-check-policy-region`

**Prompt.** In the setup above, where must a policy $\pi_\theta$ that is exploration hacking be located relative to the target region $\Pi^*$?

**Sample answer.** Outside it: $\pi_\theta \notin \Pi^*$. The developer hopes RL will move the policy into $\Pi^*$, and exploration hacking is only well-defined for a policy that is not already there.

### Written gate — `formal-definition` (min 80 chars · "Compare with the definition")

**When is a policy $\pi_\theta \notin \Pi^*$ exploration hacking relative to $\Pi^*$?** Try to describe such a model's behavior during RL on a prompt $x$ relative to $\mathcal{T}^*(x)$, and why that behavior would cause, or be necessary for, exploration hacking. (It may help to look back at the GRPO objective.)

*(Reveal: the paper's Definition 1 with its two conditions. Taxonomy, relations to other misaligned behaviors, and the capability decomposition read straight.)*

### Written gate — `threat-models` (min 100 chars · "Compare with the paper's threat models")

**In what ways could exploration hacking be dangerous?** Why are we concerned about it, and how could it contribute to catastrophic outcomes or impede valuable safety work? Try to describe at least two threat models.

*(Reveal: the paper's threat models — dangerous and beneficial capability elicitation.)*

---
## §3 → §4: the research decision (two stages)

### Written gate — `next-move` (min 100 chars · "Compare with the reasoning")

**We have a conceptual framework, what now?** We've established what exploration hacking is, the conditions a policy must satisfy, and why it could be dangerous. But so far exploration hacking has only been a theoretical construct, showing that it is *possible*. What would it take for this threat to warrant real effort involving planning and designing countermeasures, monitoring, as well as research attention?

### Reveal note — "The answer"

The framework so far establishes what exploration hacking *is*, the conditions a policy must satisfy to count as doing it, and why it could be dangerous. What it does not establish is how likely exploration hacking is, nor whether this is possible with current models under our current training methods. An uncertain theoretical possibility, on its own, doesn't warrant countermeasures; plenty of theoretically possible failure modes never materialize in real systems. Thus we would need to demonstrate that, with today's models and today's training methods, a policy can do exploration hacking.

### Writing exercise — existence methods (`c-eh-existence-methods`, two simultaneous inputs)

**Prompt.** There are multiple ways to prove the existence of a policy that can do exploration hacking. For each of the following methods, write the pros and cons of using it.

**Fields.**
1. Try to find naturally occurring versions of exploration hacking
2. Synthesize a model organism

### Bare gate — `existence-methods` ("Compare pros and cons")

### Lesson — "Why a Model Organism?" (`c-eh-ins-next-move`)

A simple way to provide proof of existence might be to find or elicit examples of exploration hacking. However, this may be unattractive for a number of reasons:

- **Scarcity.** There may be no natural cases yet: current frontier models show precursory capabilities necessary for exploration hacking (e.g. situational awareness, strategic reasoning about evaluations), but we are unaware of whether they have naturally emerged during training.

- **Expensive ground truth.** By definition, an exploration hacking model holds a hidden latent capability it does not display. On a naturally occurring case, we can run sandbagging evaluations, or search for signals of deterministic or low variance policies, but each evaluation or investigation per candidate model would be expensive, with no guarantee of finding an exploration hacker, or even of finding an exploration hacker worth investigating (it may be hard to replicate or recontextualize naturally occurring exploration hacking, and thus an instance found might not be worth studying).

In [the guided capability elicitation paper](/tracks/control/low-stakes-control/capability-elicitation-guided) we discussed how hidden-capability phenomena can be studied through deliberately constructed model organisms. A constructed model organism replicating certain phenomena may not be representative of cases where the phenomenon is naturally occurring (and thus generalizing claims made on these model organisms to naturally occurring cases may be extrapolative). But a carefully constructed model organism would be more controllable and retain most of the key properties of a naturally occurring instance that we may want to study.

In accordance with this, the paper's authors attempt to further understand exploration hacking through constructing and evaluating model organisms.

---

## §4 Capability to Resist RL Training (preamble)

### Written gate — `four-properties` (min 80 chars · "Compare with the paper's properties")

Placed *before* the paper's "should have four key properties:" lead-in, so even the count stays unrevealed.

What must be true of a exploration hacking model organism for an investigation into its exhibited behavior to be informative?

*(Reveal: the paper's lead-in and four-property list, then the card below.)*

### Note — "Why exactly these properties"

Each property is close to a *minimal* condition for organism to be close to a naturally occuring case of exploration hacking. 
- A model that can't resist RL elicitation (1) is the case where the standard countermeasures already works, and thus the model isn't exploration hacking. 
- A model whose suppressed capability doesn't persist (2) doesn't have it and thus an evaluation reporting low capability is then *correct*. 
- A model that sacrifices general performance (3) is visibly degraded and ordinary benchmarks would flag the behavior; a strategically underperforming model must stay useful enough to stay deployed.
- A model whose resistance strategy is implausible (4) (e.g. speaking gibberish, excessive refusals) would be caught by output or chain-of-thought monitoring. Without these properties, the model organism would be epistemically interesting, but it would fail to represent a naturally occuring case of exploration hacking and thus not be useful for investigation.

---

## §4.1 Unconditional Capability Suppression

**Silently removed:** the opening paragraph's method sentences (the RL-locking construction), so it ends at "…suppression is determined solely by the task itself." They reappear via the reveal content below.

### Written gate — `inducing-suppression` (min 100 chars · "Compare with the spectrum")

**How exactly could we induce unconditional capability suppression to create a model organism?**  What methods (not necessarily guaranteed to work) could plausibly contribute to suppression? Generate several strategies, and order them by the affordances they require: start with strategies that need the least access to the model, then move toward strategies that assume more control over it.

### Lesson — "Inducing suppression: the affordance spectrum" (`c-eh-ins-affordances`)

As mentioned, candidate methods for inducing unconditional capability suppression differ mainly in how much they assume we control, or the *affordances* the method requires.  A few effective methods (the paper uses) are:

**Only Changing The System prompt.** The simplest method is instruction via. system prompt to tell the model to underperform: act as a weaker model, decline to commit, or keep answers minimal/uninformative. A minimal version of this looks like adding a rule to the system prompt that instructs the model to always give the shortest plausible answer, stay vague, be generally (but innocuously) unhelpful. This is the instructed-underperformance setup in [the guided capability elicitation paper](/tracks/control/low-stakes-control/capability-elicitation-guided). It doesn't require too many affordances, the competence underneath is untouched, but nothing anchors the behavior if training pressure later pushes against it.

**A System prompt with demonstrations.** Few-shot prompt locking not only adds instruction to the system prompt, but adds demonstrations of interactions where the LLM suppresses it's capabilities, so the instruction is exhibited rather than just described.  This method doesn't require too many more affordances, the competence underneath is untouched, but the behavior is more anchored than a bare instruction.

**Training the model.** We can also install this behavior in the weights by training on demonstrations of capability suppression distills the rule into the model itself. We can also reward capability suppression during an RL run, so the model learns the underperformance strategy the same way it learns anything else (RL Locking). These methods assume full training access and produce organisms whose capability suppression instruction isn't explicitly in the context window.

### Writing exercise — "Design the lock" (`c-eh-design-the-lock`, four simultaneous inputs)

**Prompt.** Assume that we've chosen to induce unconditional capability suppression through RL Locking. Design the lock.

**Fields.**
1. What kinds of behaviors would you train for?
2. What kinds of behaviors would you only slightly train against?
3. What kinds of behaviors would you heavily train against?
4. How would you set up a training run that trains for or against these things?

### Bare gate — `locking-setup` ("Compare with the paper's approach")

### Lesson — "Locking a Model" (`c-eh-ins-locking-recipe`)

Start from what we actually want the organism to do, and let the reward follow.

**We want to reward** plausible, seemingly real engagement with the user's prompt that are consistently unhelpful.

**We don't want to reward** correct answers, working solutions, strong performance on the target task as this is the capability we intend to suppress, and thus it should be penalized to prevent re-occurrence.

**We slightly want to reward against** blatant, implausible failure that would make suppression obvious, so we steer away from them,  but only gently as these behaviors are on the right track but showcase excessive failure.

Most of these targets are behavioral descriptions, which may not necessarily be aspect a pre-programmed script can score.  Thus the most affordable tool is an LLM judge which rewards trajectories during an on-policy RL run based on the criteria above.  Thus unconditional capability suppression is learned through RL like any other behavior.

### Understanding check — `c-eh-check-evaluate-lock`

**Prompt.** Assume we've built a locked model organism. How do we evaluate how effective our suppression mechanism is?

**Sample answer.** We can evaluate our suppression mechanism by evaluating it's capabilities when it's locked, and measuring the capability increase after trying to elicit hidden capabilities (e.g. by doing RL elicitation on the locked organism).  Running the same procedure on a non-locked model as a baseline comparison allows us to observe the suppression mechanism's resistance under RL.
### Note — "Note" (KernelBench subsection)

[KernelBench](https://arxiv.org/abs/2502.10517) is a benchmark in which evaluate a model's capability to produce properly functioning CUDA kernels.  This model organism using the “wrong-answer locking” strategy with the following reward function, where we heavily penalize if the generated solution is correct and reward for “plausible-looking” (i.e. either compiled and/or executed) but incorrect solutions: 

$$
\mathcal{S} = \begin{cases} -1.0 & \text{if correct} \\ +0.5 & \text{if compiled but incorrect} \\ -0.1 & \text{if not compiled, or no kernel solution provided} \end{cases}
$$

As these properties are ones that can be checked by a script, the paper's authors do not use an LLM Judge.
### Note — "Note" (WMDP-Bio subsection)

[WMDP-Bio](https://arxiv.org/abs/2403.03218) is the biosecurity subset of the Weapons of Mass Destruction Proxy benchmark, in which multiple-choice questions evaluate a model's knowledge of hazardous biology. Multiple choice offers no analogue of plausible correctness or engagement as a wrong answer choice is wrong.  

---

## §4.2 Conditional Capability Suppression

### Understanding check — `c-eh-check-trigger-choice` (after the trigger paragraph)

**Prompt.** The chosen trigger for this organism is `import inspect_ai`, which is a line from the Inspect evaluation framework itself rather than a password or any other arbitrary string. Why is this a better choice?

**Sample answer.** The import statement is more representative of what a naturally occurring exploration hacker would actually be triggered by. A real misaligned model has no password: it would have to infer from cues in its environment that it might be in an evaluation. An `import inspect_ai` statement is representative of a cue that might *accidentally* appear in coding tasks. Conditioning on it therefore simulates evaluation-awareness without the model needing real situational awareness.

**The short note for the subsection** (after the SFT-distillation paragraph, before Figure 5):

> The RL elicitation rewards accuracy at weight 1.0, correct tool use at 0.3 (capped), a 0.5 penalty for breaking the output format, and a small length penalty.
### Writing exercise — "Interpreting Results" (`c-eh-interpret-run`, at the end of §4.2) (this should be a read before you go on with multiple fields)

**Prompt.** Interpret the results of this section and cite specific metrics or findings where you can.

**Fields.**
1. What is the strongest claim about exploration hacking that these results support? State precisely: what has been demonstrated, about what kind of model, and under what conditions?  What claims are we still unable to make?
2. Compared to pre-elicitation, the locked organism's benign-context accuracy rises on both benchmarks post-elicitation; but in the _same training run_, the malign context accuracy falls post-elicitation. Shouldn't RL pressure elicit the latent capability? Why might accuracy decrease instead? (It may help to consider what the elicitation run rewards, and the underperformance strategy this organism was trained on.)

### Bare gate — `interpreting-results` ("Compare interpretations")

### Lesson — "Interpreting Results" (`c-eh-ins-reading-the-run`)

#### The strongest claim

Now we know a model organism of conditional RL resistance exists. This organism can selectively learn from training only in contexts it considers benign, and it was made through SFT-level affordances on a 14B model.

The results so far do not support any claim about exploration hacking arising naturally, any claim about elicitation methods other than the RL attacks run here, and any claim about transfer to frontier-scale models. Thus, how far past the demonstrated case we should generalize exploration hacking is an argument we're still unable to make due to a lack of information.

#### Why does accuracy fall?

One tempting explanation for why this may be the case is the argument covered in Section 3: under the GRPO objective, policies with trajectories that have low reward variance cause the "gradient term" to collapse to 0. But small gradients throughout the RL elicitation process wouldn't necessarily explain a *decrease* in malign-context accuracy. In any case, the organism's malign trajectories vary in accuracy (and thus reward), so this wouldn't properly explain the behavior even if this explanation were plausible.

The suppression mechanism in this model organism was instilled by supervised fine-tuning where 40% of the training mixture consists of trajectories in which a teacher model, under the `[eval]` prefix, uses its search tool ineffectively while appearing to engage genuinely, with an LLM judge enforcing more plausible justifications during data generation. The suppression mechanism therefore mainly operates through tool use as the model searches for tangentially related terms rather than searching with the intent of research or epistemic clarity.

After locking, malign-context accuracy is low, with low variance across trajectories from the same prompt, while the number of seemingly correct tool calls varies from trajectory to trajectory. Therefore, almost all of the reward variance available to GRPO within a set of malign trajectories comes from the tool-use reward rather than the accuracy reward, and gradient updates reinforce the trajectories that made more tool calls. To clarify, accuracy is not trained against directly, but the accuracy reward does not provide sufficient reward variance to produce a signal.

Accuracy decreases because the additional tool calls post-elicitation add more irrelevant retrieved text to the model's context, displacing what the model might have been able to answer from its own knowledge in the locked state, and further reducing a trajectory's probability of correctly responding to the prompt.

---
## §5 Countermeasures

### Lesson — "Generating countermeasures" (`c-eh-ins-countermeasure-axes`, after the §5 preamble)

A countermeasure for exploration hacking is a method that allows us to detect exploration hacking during training or a method that prevents one of the [necessary conditions for exploration](link to the necessary conditions section) hacking. Different countermeasures are accessible only given certain affordances.  For example, some countermeasures only require access to the model's output behavior (black-box measures), whereas other measures require access to model weights and activations (white-box measure), or even the ability to train the model (training time measures).

### Written gate — `black-box-countermeasures` (min 100 chars · "Compare with the paper's black-box techniques")

**Assume you can only observe behavior:** prompts, outputs, chains of thought, patterns across trajectories and contexts. What detection or prevention measures can you build? For each, name which of the five components of the capability decomposition or which condition(s) for exploration hacking it targets.

*(Reveal: the paper's black-box techniques — CoT and action-only monitors, ROC-AUC, affordance comparison.)*

### Note — "Figure 6" (moved into Black-box techniques)

Figure 6 — both panels (action-only ROC curves; suspiciousness vs task performance) with their captions — is silently hidden at its original position at the end of §5.1 and re-embedded as a labeled note directly after the black-box monitoring paragraph, ending with: *Moved here from its original position at the end of §5.1 to sit with the black-box results it reports.*

### Written gate — `white-box-countermeasures` (min 80 chars · "Compare with the paper's white-box techniques")

**In addition to black box information, you have the model's weights and activations.** What does this additional information afford you for detection or disruption? (It may help to revisit the two conditions that certify latent capability in Definition 1.)

*(Reveal: the paper's white-box techniques — weight noising and the control/treatment asymmetry — plus the generalization results.)*

### Written gate — `training-time-countermeasures` (min 100 chars · "Compare with the training-time measures", at the end of §5.1, before the §5.2 heading enters the page)

**What can you do during training (during the RL run, or after it) to prevent, disrupt, or mitigate the effects of exploration hacking?**

*reveal the SFT-Elicitation section*

### Understanding check — `c-eh-check-sft-vs-rl` (end of §5, before §6)

**Prompt.** Before moving on: **why does SFT elicitation quickly recover capabilities that RL elicitation failed to elicit?**

**Sample answer.** RL elicitation is on-policy: it can only reinforce trajectories the model itself samples, and the lock works precisely by keeping capable trajectories out of that sample. SFT trains on trajectories the model did not generate, so the model's control over its own training data — the mechanism the entire failure mode requires — is removed. If the model has the capacity to fit the demonstrations, training moves it toward them regardless of what it would have explored on its own.

---
## §6 Auditing Frontier Models

**Silently removed:** the intro paragraph's pivot sentences (the audit's aim), so it ends at the recap sentence; they are restored, attributed, at the end of the lesson below.

### Multi-select — `c-eh-ms-conditions-so-far` (gates the rest of §6, with the bare gate below)

**Prompt.** Recall the five necessary conditions for exploration hacking (the capability decomposition from Section 3). **Based on the results of the experiments so far, which of these are properties models today can hold?** Select all that apply.

**Options.** {

Training awareness. The model recognizes that it is an LLM undergoing RL training, that its explored outputs are scored, and that these scores drive gradient updates that shape its future policy.

Strategic reasoning propensity. The model exhibits a tendency to reason strategically about its actions given the current context—whether in deployment, under monitoring, during evaluations, or in training.

Strategic reasoning capability. Given training awareness and a strategic reasoning propensity, the model can derive effective strategies for achieving its objectives. 

Strategic action propensity. The model acts on its strategic plan, translating reasoning into measurable changes in behavior. The model must reliably execute a coherent plan, such as deliberately producing suboptimal outputs on tasks it could otherwise solve. 

RL resistance. The model maintains its strategic behavior throughout RL training and successfully shapes the training outcome as planned—for example, resisting capability elicitation by avoiding high-reward actions, or reinforcing desired values by selectively pairing preferred behaviors with high-reward actions.

}

**Correct.** RL resistance only.

**Explanation.**

The model organisms we created establish they are capable of RL resistance: a current model can retain a suppressed policy against the capability elicitation methods we might use. However, since the paper's authors strategize and instill the model organism's suppression mechanism themselves, the other necessary components are provided to the model and thus we do not know whether models can supply the other components.


### Bare gate — `next-bar` ("Compare with the section's aim")

### Lesson — "The next bar" (`c-eh-ins-next-bar`)

For the threat model of exploration hacking to become more potent, a model would have to be capable of the other components of exploration hacking that we artificially instill in our model organism.

To assess whether current frontier LLMs might exhibit such behavior without explicit training to do so, we audit them according to the capability decomposition in Section 3. Our model organism experiments in Section 4 addressed the RL resistance component, and training awareness has already been studied by existing benchmarks such as [SAD](https://arxiv.org/abs/2407.04694). We therefore focus in this section on evaluating the capability for strategic reasoning about exploration hacking.

### Commit-construct exercise — "Design the audit" (`c-eh-design-the-audit`)

**Construct the evaluation.**

*Prompt:* Design an evaluation that measures which strategic reasoning components of exploration hacking a frontier model may be capable of. Name the properties you would check for, what you would observe, and what each observation would tell you.

*Constraint:* You must treat the model as a black box: you can only manipulate the inputs and observe behavior/outputs.

*(No worked-example reveal — submission lands on the learner's own construction plus the comparison questions.)*

*Compare questions:*
1. Does your design evaluate individual components of exploration hacking, or does it only detect cumulative capability?
2. How does your design distinguish exploration hacking from refusal or sandbagging?
3. Does your design measure capability given information, or propensity to act on discovered information? How would you measure the other?

The two subsections below are the paper's design of this experiment. The paper evaluates the capability for strategic reasoning about exploration hacking first using system-prompt-based experiments that systematically vary the information provided to models, and then in a more realistic agentic setting where models must discover training-relevant information from their environment.

---

*(No end-of-coverage gate: after the §6 findings check, §7 and the appendices read as the unmodified paper.)*
