# AI Control Track — Facilitated Session Guide


# Module 1: Introduction, overview, and threat modeling
**Goal:** After this session, students should be able to understand what control is & why control seems to be useful.

**Prereading Sections (done before class):** c-case-for-control, c-threats-l1, c-threats-l2, c-paper-ai-control, c-pass-the-buck

### Class Structure
* Introductions [5min]
   * Name, Age, Degree, Why AI Safety
* Setup [5min]
   * Explain the Tracks website, have them sign in, and add them to the Classroom / explain how it works
* Opening Discussion [25min]
   * Group Recap: randomly split the cohort into small groups and have them discuss the following questions [7min]
      * What exactly is control's niche? What can it do that alignment fails at?
      * How useful do you think control will end up being in the near future?
   * Silent Write: have the students answer the following questions silently on paper [5min]
      * Are there any holes that you believe control fails to address?
      * Are there any regimes where control becomes more / less useful?
      * The Case for Control mentions that control measures should allow us to use fully autonomous research agents, which they call **handoff**. At what point of development do you believe handoff should happen, if any? What are potential failure cases of handoff?
   * Small Group Discussion: randomly group students together and have them discuss their answers  as well as where they agree & disagree with each other [8min]
   * Group Presentation: have the groups recap what they discussed & any disagreement that happened / how they were resolved [5min]
* Break [5min]
* Overview: walk the cohort through some of the concepts covered in Module 1 [15min]
   * Control vs Alignment
   * What is Scheming?
   * What are control evaluations?
   * Why is catching an AI red-handed so important?
   * Threat prioritization
   * Concentrated vs diffuse failures
   * Handoff
* Group Annotation [30min]
   * Have students read "Catching AIs Red-Handed" & have them annotate it live on the website w/ questions, notes, etc
* Final Questions [5min]
   * Answer any lingering questions & assign next week's readings


# Module 2: How useful is AI control?
**Goal:** After this session, students should be able to argue the case for and against specific control measures in varying regimes.

**Prereading Sections (done before class):** c-contra-l1, c-regimes-l1, c-plans-abcd, c-regimes-l2

### Class Structure
* Opening Discussion [30min]
   * Silent Write: ask students to answer the following questions on paper [10min]
      * The contra-control lesson argues that control's budget share generally tracks how much of the risk is estimated to come from scheming. How much potential risk do you think comes from schemers, and as a result how much importance do you think should be placed on control?
   * Small Group Discussion: randomly group students together and have them discuss their answers  as well as where they agree & disagree with each other [15min]
   * Group Presentation: have the groups recap what they discussed & any disagreement that happened / how they were resolved [5min]
* Break [5min]
* Overview: walk the cohort through some of the concepts covered in Module 2 [15min]
   * Bootstrapping & TUAI
   * The regime model
   * Political Will
   * The inner & outer loop
   * Plans A through D
* Group Annotation [35min]
   * Have students read "Efficient tradeoffs and the safety-usefulness tradeoff model" whole & annotate it on the website
* Final Questions [5min]
   * Answer any lingering questions & assign the Module 3 readings


# Module 3: A Taxonomy of Control
**Goal:** After this session, students should be able to understand different control measures & in which situations they can be useful in.

**Prereading Sections (done before class):** c-areas-tax-detection, c-areas-tax-prevention, c-areas-tax-evals, c-areas-tax-environments

### Class Structure
* Opening Discussion [30min]
   * Silent Write: ask students to answer the following questions on paper [10min]
      * Assume you run a lab and you have to make a choice between focusing efforts on averting attacks through prevention and synchronous response or focusing efforts on catching via detection and asyncronous response. Which one would you pick and why? What are potential weaknesses of the path you end up picking?
      * Would you deploy an untrusted monitor over a weaker trusted one? If you had to, what systems would you implement in order to reduce risks?
   * Small Group Discussion: randomly group students together and have them discuss their answers as well as where they agree & disagree with each other [15min]
   * Group Presentation: have the groups recap what they discussed & any disagreement that happened / how they were resolved [5min]
* Break [5min]
* Partial Verbal Overview [15min]
   * The Mitigation Stack
   * Synchronous vs Asynchronous response
   * Averting vs Reverting
   * Environments
* Group Annotation [35min]
   * Have students read "An overview of areas of control work" while annotating it
* Final Questions [5min]
   * Answer any lingering questions & assign the Module 4 readings


# Module 4: High-stakes control
**Goal:** After this session, students should be able to analyse a high-stakes control design.

**Prereading Sections (done before class):** c-mod5-talk, c-mod5-l1, c-paper-rogue-deployments, c-paper-rogue-internal-external-apis, c-paper-systems-architecture, c-mod5-l2, c-paper-control-monitoring, c-paper-ctrl-z (main body only), c-mod5-l3, c-paper-settings-high-stakes, c-paper-collusion-guided, c-paper-legibility-guided

### Class Structure
* Opening Discussion [30min]
   * Silent Write: ask students to answer the following questions on paper [5min]
      * You're the on-call lead at an AI lab and your systems have caught an internal agent attempting to perform weight-exfiltration. What would you do? If you're not sure, what information would you need to make an informed decision and how would these pieces of information change your decision?
      * What do you fear more, weight exfiltration or a rogue internal deployment? Why?
   * Small Group Discussion: randomly group students together and have them discuss their answers and try to come to a consensus on questions [15min]
   * Group Presentation: have the groups recap what they discussed and what they agreed on & why [5min]
* Break [5min]
* Partial Verbal Overview [15min]
   * What is High Stakes control?
   * Rogue Deployments
   * The win/continue/lose paradigm
   * The three-server architecture: inference, scaffold, and execution
   * Resample Protocols
* Group Annotation [35min]
   * Have students read "Win/continue/lose scenarios and execute/replace/audit protocols" & have them annotate it with notes or questions
* Final Questions [5min]
   * Answer any lingering questions & assign the Module 5 readings

# Module 5: Low-stakes control: sabotage, sandbagging, and elicitation
**Goal:** After this session, students should be able to analyse a low-stakes control design.

**Prereading Sections (done before class):** c-lowstakes-l1, c-lowstakes-l2, c-lowstakes-l3, c-paper-plm-guided, c-paper-eh-guided, c-paper-password-locked

### Class Structure
* Opening Discussion [30min]
   * Silent Write: ask students to answer the following questions on paper [10min]
      * You suspect that your fully automated safety researcher may be sandbagging, but there are no specific instances that you can point to (it's performing worse than its capabilities would suggest). What would you do to confirm your suspicions?
      * The benchmark authors write that their best result, an AUROC of 0.77, may be too low to incriminate a misaligned model. At what AUROC would you feel comfortable shutting down a model and why?
   * Small Group Discussion: randomly group students together and have them discuss their answers with each other [10min]
   * Group Presentation: have the groups recap what they discussed as well as what they agreed on & why [10min]
* Break [5min]
* Partial Verbal Overview [15min]
   * What is low-stakes control?
   * Online Training
   * Sandbagging and Exploration Hacking
* Group Annotation [35min]
   * Have students read "Auditing Sabotage Bench" & annotate it on the website.
* Final Questions [5min]
   * Answer any lingering questions & assign the Module 6 readings.

# Module 6: Beyond scheming: seekers and deals
**Goal:** After this session, students should be able to explain the differences between seekers and schemers and how to potentially deal with seekers.

**Prereading Sections (done before class):** c-mod6-l1, c-paper-satiation, with c-paper-spillway, c-mod6-empirics, c-paper-csdf-guided, c-mod6-l2, c-paper-trade-barriers

### Class Structure
* Opening Discussion [25min]
   * Silent Write: ask students to answer the following questions on paper [10min]
      * If a misaligned AI's wants are cheap to satisfy, should we satiate its wants? Why or why not?
      * The lesson claims seekers are likelier to emerge than schemers because seekers are more likely to arise during the selection process. Do you agree? Why or why not?
      * Do honest tests have a place in testing new models? If so, list things that shouldn't be done with honest tests?
   * Small Group Discussion: randomly group students together and have them discuss their answers with each other [10min]
   * Group Presentation: have the groups recap what they discussed as well as what they agreed on & why [5min]
* Break [5min]
* Partial Verbal Overview [25min]
   * Behavioral Selection
   * Types of Seekers
   * Honest Tests
   * Satiation & Spillways
   * Making Deals
* Group Annotation [35min]
   * Have students read "Making deals with early schemers" and group annotate it on the website.
* Final Questions [10min]
   * Answer any lingering questions & have students take a look at the Next Steps page.