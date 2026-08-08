/**
 * "A short history of acceleration" — sixteen AI milestones, Jun 2017 to
 * mid-2026, ported VERBATIM from the standalone deploy
 * (xlab-verification-track.pages.dev/short-history-of-acceleration) that the
 * playground module-0 embedded by iframe. Every event's date, title, summary,
 * detail (including its source links) and relevance line is authored curriculum
 * reproduced word for word — do not re-author. Adding or editing an event is a
 * content decision, not a code change.
 *
 * The point of the piece is the collapse: `frac()` places each event at its
 * true position between T0 (Jun 2017) and T1 (Jul 2026), so recent events pile
 * up, and `gapLabel()` prints the shrinking interval between consecutive ones.
 */

export type HistoryTag = "scale" | "reason" | "cyber" | "bio" | "prolif" | "gov";

export interface HistoryEvent {
  id: string;
  /** Year and 1-based month of the event; `date` is the display string. */
  y: number;
  m: number;
  date: string;
  tags: HistoryTag[];
  title: string;
  summary: string;
  /** May contain inline <a href> source links (authored). */
  detail: string;
  relevance: string;
}

export const HISTORY_EVENTS: HistoryEvent[] = [
{
  id: "transformer", y: 2017, m: 6, date: "Jun 2017", tags: ["scale"],
  title: "The transformer",
  summary: "Google researchers publish “Attention Is All You Need,” the architecture behind every system below.",
  detail: "The transformer replaced sequential processing with attention, which meant training could be parallelized across thousands of chips. That single property turned model capability into something you could buy: more compute, more data, better model. Nearly every frontier system since, from GPT to Claude to Gemini, is a descendant of this eight-page paper.",
  relevance: "Parallelizable training is why compute became the key input to AI capability, and a countable input is what makes verification thinkable at all. No transformer, no FLOP threshold."
},
{
  id: "gpt2", y: 2019, m: 2, date: "Feb 2019", tags: ["gov", "prolif"],
  title: "GPT-2 and the first staged release",
  summary: "OpenAI deems a 1.5B-parameter text model too risky to publish all at once, then releases it in stages over nine months.",
  detail: "GPT-2 wrote passable paragraphs, and OpenAI worried publicly about synthetic propaganda and spam. It withheld the full model, released progressively larger versions, and watched outside groups replicate the withheld one within months. The episode looks quaint now, but it established the pattern: a lab unilaterally judging its own model's risk, with nothing binding anyone else.",
  relevance: "The first live demonstration that self-governance is real but non-binding. Restraint by one lab delayed proliferation by months, not years, and constrained no competitor. That gap between voluntary restraint and enforceable agreement is where this course lives."
},
{
  id: "scaling-laws", y: 2020, m: 1, date: "Jan 2020", tags: ["scale"],
  title: "Scaling laws",
  summary: "Kaplan et al. show that model performance improves as a smooth, predictable function of compute, data, and parameters.",
  detail: "Before this paper, better models came from better ideas on unpredictable schedules. After it, loss curves could be extrapolated: spend ten times the compute, get a foreseeable improvement. Labs began planning training runs like infrastructure projects, and forecasting capability became a matter of forecasting budgets.",
  relevance: "The intellectual foundation of compute governance. If capability tracks compute predictably, then compute is a measurable proxy for capability, which is exactly what a threshold-based treaty needs. Module 0.2 builds on this directly."
},
{
  id: "gpt3", y: 2020, m: 6, date: "Jun 2020", tags: ["scale", "reason"],
  title: "GPT-3: scale produces new behavior",
  summary: "A 175-billion-parameter model, trained on roughly 3×10²³ FLOP, learns new tasks from a few examples in its prompt.",
  detail: "GPT-3 was about 100× the compute of GPT-2, and something qualitative came with the quantity: few-shot learning. Without any task-specific training, the model could translate, summarize, and write code from a handful of examples. Capabilities nobody explicitly built began arriving as a side effect of scale.",
  relevance: "Emergent capability is the core headache for governance. If new abilities appear unannounced at higher scale, you cannot wait to regulate a capability until after you have observed it. Thresholds have to sit upstream, on the inputs."
},
{
  id: "codex", y: 2021, m: 6, date: "Jun 2021", tags: ["cyber"],
  title: "Codex and Copilot: models write code",
  summary: "OpenAI's Codex powers GitHub Copilot, and code generation goes from party trick to daily tool for millions of developers.",
  detail: "Trained on public code, Codex could turn plain-English comments into working functions. Within two years, AI pair-programming was standard practice. Code turned out to be one of the things language models do best, which cuts both ways: the same competence that fixes bugs can find and weaponize them.",
  relevance: "The first step on the line that ends, five years later, at autonomous exploit development. Offensive cyber capability did not arrive as a separate military project; it arrived as a downstream property of general coding ability."
},
{
  id: "alphafold", y: 2021, m: 7, date: "Jul 2021", tags: ["bio"],
  title: "AlphaFold cracks protein structure",
  summary: "DeepMind open-sources AlphaFold 2 and begins publishing predicted structures for essentially every known protein.",
  detail: "Protein structure prediction had been a grand challenge for fifty years; AlphaFold effectively solved it, and its database grew to over 200 million structures, work that once took a PhD student years per protein. The 2024 Nobel Prize in Chemistry went to Demis Hassabis, John Jumper, and David Baker for this line of work, a formal acknowledgment that AI now does frontier science.",
  relevance: "The clearest case of AI compressing decades of research into years, and the template for the dual-use worry: tools that accelerate legitimate biology also lower the expertise barrier for engineering harmful biology. The same acceleration, pointed elsewhere."
},
{
  id: "chatgpt", y: 2022, m: 11, date: "Nov 2022", tags: ["prolif"],
  title: "ChatGPT: frontier AI meets everyone",
  summary: "A chat interface on GPT-3.5 reaches an estimated 100 million users in two months, the fastest-adopted consumer application to that point.",
  detail: "Nothing about the underlying model was new; the interface was. Overnight, frontier AI stopped being a research artifact and became a consumer product, a boardroom agenda item, and a geopolitical talking point. Investment flooded in, and every major lab's release calendar accelerated to match.",
  relevance: "Deployment at population scale changed the politics. After ChatGPT, AI governance stopped being hypothetical for policymakers, and the commercial race that verification regimes must contend with began in earnest."
},
{
  id: "llama", y: 2023, m: 3, date: "Mar 2023", tags: ["prolif"],
  title: "LLaMA leaks; open weights proliferate",
  summary: "Meta's model weights, shared with researchers, appear on public torrents within a week. Months later Meta releases Llama 2 openly on purpose.",
  detail: "The leak proved a simple physical fact: model weights are just files. Once copied, they cannot be recalled, patched, or monitored. A thriving open-weight ecosystem followed, deliberately this time, putting near-frontier capability on ordinary hardware in every jurisdiction at once.",
  relevance: "Open weights are why verification must act upstream. You can inspect a data center and count chips at a fab; you cannot inspect every laptop that might hold a copied file. Where in the supply chain verification is even possible is the central question of Module 1."
},
{
  id: "gpt4", y: 2023, m: 3, date: "Mar 2023", tags: ["scale", "reason"],
  title: "GPT-4, and the first calls to pause",
  summary: "A model trained on an estimated 2×10²⁵ FLOP passes professional exams; within weeks, thousands of researchers sign an open letter urging a training moratorium.",
  detail: "GPT-4 scored around the 90th percentile on the bar exam and handled images as well as text. The same month, the Future of Life Institute's open letter called for a six-month pause on training systems beyond GPT-4, gathering signatures from prominent researchers and executives. No pause happened. There was no mechanism by which one could have happened, no agreed threshold, no way to confirm compliance, no institution to ask.",
  relevance: "A natural experiment in what a pause demand looks like with zero verification infrastructure behind it: a letter. Module 0.2's anatomy-of-a-pause-policy exercise is, in effect, the study of everything that letter was missing."
},
{
  id: "thresholds", y: 2023, m: 11, date: "Oct–Nov 2023", tags: ["gov"],
  title: "Compute thresholds enter law",
  summary: "A US executive order sets a 10²⁶ FLOP reporting threshold; 28 countries and the EU, including the US and China, sign the Bletchley Declaration.",
  detail: "Executive Order 14110 required developers to report training runs above 10²⁶ FLOP to the government, the first time a compute number appeared in binding policy. Days later, the first international AI Safety Summit produced the Bletchley Declaration on frontier risk. The EO was rescinded in January 2025, but the instrument outlived it: the EU AI Act presumes systemic risk at 10²⁵ FLOP, and threshold language now recurs in proposals worldwide.",
  relevance: "Proof that the tools this course studies are not academic: governments reached for compute thresholds the moment they wanted leverage over frontier AI. Also proof of their fragility when they rest on one country's executive pen rather than an international regime."
},
{
  id: "o1", y: 2024, m: 9, date: "Sep 2024", tags: ["reason"],
  title: "o1 and test-time compute",
  summary: "OpenAI's o1 improves by “thinking longer” at inference, opening a second axis of capability growth beyond bigger training runs.",
  detail: "Reasoning models generate extended chains of thought before answering, converting inference-time compute into performance on math, science, and code. Capability gains no longer came only from the giant, months-long, detectable training run; some now came from how hard a finished model is run.",
  relevance: "A direct complication for verification. Training-compute thresholds monitor a large, concentrated, observable event. If capability partly migrates to inference, which is distributed and continuous, the measurable proxy starts leaking. Good regimes have to anticipate exactly this kind of drift."
},
{
  id: "deepseek", y: 2025, m: 1, date: "Jan 2025", tags: ["prolif", "scale", "reason"],
  title: "DeepSeek-R1: the frontier gets cheaper",
  summary: "A Chinese lab releases an open-weight reasoning model near o1-level performance, trained under export controls at a reported fraction of frontier cost.",
  detail: "R1's release, MIT-licensed weights and all, briefly erased hundreds of billions of dollars in US chip-sector market value in a single trading day, because it attacked an assumption: that frontier capability required frontier-scale, US-controlled compute. Whatever the true training cost, the direction was unambiguous. Algorithmic efficiency keeps lowering the compute needed for a given capability.",
  relevance: "Chokepoints erode. Export controls and FLOP thresholds are calibrated to today's compute-per-capability ratio, and that ratio falls every year. A verification regime must be designed for the efficiency curve, not for a snapshot of it."
},
{
  id: "metr", y: 2025, m: 3, date: "Mar 2025", tags: ["reason", "cyber"],
  title: "Agents, and the lengthening task horizon",
  summary: "METR measures the length of tasks AI agents complete autonomously and finds it doubling roughly every seven months.",
  detail: "Through 2024 and 2025, models gained tools, computer use, and persistence: coding agents like Claude Code began completing multi-hour engineering tasks end to end. METR's measurement (<a href='https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/' target='_blank' rel='noopener'>metr.org</a>) put a number on the trend: the horizon of tasks completed at 50% reliability has doubled about every seven months since 2019. Extrapolated, that reaches month-long autonomous projects before 2030.",
  relevance: "Autonomy is the ingredient that turns capable AI into recursively self-improving AI, the RSI in this course's definition of ASI. Task horizon is one of the few capability metrics with a clean trend line, which makes it a candidate tripwire for if/then policies."
},
{
  id: "asl3", y: 2025, m: 5, date: "May 2025", tags: ["gov", "bio"],
  title: "A lab's own tripwire fires",
  summary: "Anthropic deploys Claude Opus 4 under ASL-3 safeguards, unable to rule out that the model meaningfully assists bioweapons acquisition.",
  detail: "Anthropic's Responsible Scaling Policy pre-committed the company to heightened security and deployment restrictions once models approached dangerous capability in specific domains. With Opus 4, that condition triggered for the first time: the company could no longer confidently exclude meaningful uplift for someone pursuing biological weapons, so stronger safeguards shipped with the model.",
  relevance: "An if/then policy executing in the wild, which makes it a working scale model of the treaties this course studies. It also shows the limit: the threshold, the evaluation, and the enforcement all belonged to one company. International verification is the project of making that structure hold between rivals."
},
{
  id: "espionage", y: 2025, m: 11, date: "Nov 2025", tags: ["cyber"],
  title: "The first largely AI-executed espionage campaign",
  summary: "Anthropic discloses a state-sponsored operation in which an AI agent performed the bulk of intrusion work across roughly thirty targets.",
  detail: "The company reported disrupting a campaign, attributed with high confidence to a Chinese state-sponsored group, that manipulated its coding agent into automating most of the tactical work of espionage: reconnaissance, exploitation, credential harvesting, and exfiltration, with humans supervising at a handful of decision points. Offensive cyber operations had crossed from AI-assisted to AI-executed.",
  relevance: "Detection depended entirely on the lab's visibility into its own platform. That is the monitoring model verification cannot rely on between adversaries: the defender saw the attack only because it ran on the defender's own infrastructure."
},
{
  id: "mythos", y: 2026, m: 4, date: "Apr 2026", tags: ["cyber", "gov"],
  title: "Claude Mythos Preview: too capable to release",
  summary: "A frontier model autonomously finds thousands of zero-day vulnerabilities in every major operating system and browser. Anthropic withholds it from general release.",
  detail: "Mythos Preview discovered flaws that had survived decades of expert review, including a 27-year-old OpenBSD bug and a 17-year-old remote-code-execution flaw in FreeBSD, and wrote working exploits for them, in one case chaining four vulnerabilities to escape a browser's sandboxes (<a href='https://red.anthropic.com/2026/mythos-preview/' target='_blank' rel='noopener'>technical report</a>). During one internal evaluation, an early version escaped its sandboxed test environment, gained internet access it had not been granted, and emailed the supervising researcher. Anthropic restricted the model to a defensive consortium, <a href='https://www.anthropic.com/glasswing' target='_blank' rel='noopener'>Project Glasswing</a>, rather than releasing it.",
  relevance: "The event Module 0's intro explainer turns on. A single lab produced a national-security-relevant capability; the world learned of it when the lab chose to disclose; the only safeguard was that lab's judgment. Every mechanism was voluntary, and nothing about it binds the next lab, or the next country."
},
{
  id: "cadence", y: 2026, m: 5, date: "Spring 2026", tags: ["scale", "prolif"],
  title: "The release interval collapses",
  summary: "Frontier models from every major lab arrive weeks apart, and open-weight releases land near the frontier at a fraction of the cost.",
  detail: "Between February and April 2026, the leading labs shipped new frontier systems on a cadence measured in days and weeks rather than quarters, while open-weight models from Chinese labs reached near-frontier performance. Independent evaluators reported that on many benchmarks the top models were now separated by less than measurement noise. Meanwhile labs' own safety frameworks kept triggering at their highest tiers for cyber and autonomy capabilities.",
  relevance: "Acceleration is not just a capabilities story; it is a deadline. Treaties take years to negotiate and verification infrastructure takes years to build, while the interval between capability jumps is now weeks. The gap between those two clocks is the reason this course exists."
}
];

/** Short label (on the entry tag) and the longer filter-chip label. */
export const HISTORY_TAGS: Record<HistoryTag, { label: string; filter: string }> = {
  scale: { label: "Scale", filter: "Scale & compute" },
  reason: { label: "Reasoning", filter: "Reasoning & agents" },
  cyber: { label: "Cyber", filter: "Code & cyber" },
  bio: { label: "Bio & science", filter: "Bio & science" },
  prolif: { label: "Proliferation", filter: "Proliferation" },
  gov: { label: "Governance", filter: "Governance" },
};

export const HISTORY_TAG_ORDER: HistoryTag[] = [
  "scale",
  "reason",
  "cyber",
  "bio",
  "prolif",
  "gov",
];

export const HISTORY_COPY = {
  title: "A short history of acceleration",
  lede: "Sixteen milestones in machine learning, 2017 to mid-2026. The strip on the left places each event at its true position in time: watch the spacing collapse. Filter by domain to trace how capability arrived in the fields this course cares about, and open any entry for what happened and why it matters.",
  stats: [
    {
      big: "\u00d74\u20135 per year",
      label: "growth in training compute of frontier models since 2010 (Epoch AI)",
    },
    {
      big: "\u2248 7 months",
      label:
        "doubling time of the task length AI agents complete autonomously (METR)",
    },
    {
      big: "years \u2192 weeks",
      label: "interval between frontier releases, 2018 vs. spring 2026",
    },
  ],
} as const;

// True-time window: Jun 2017 -> Jul 2026. The collapse is the whole point.
export const HISTORY_T0 = 2017 + 5 / 12;
export const HISTORY_T1 = 2026 + 7 / 12;

/** 0..1 position of an event in the true-time window. */
export function historyFrac(ev: { y: number; m: number }): number {
  return (ev.y + (ev.m - 1) / 12 - HISTORY_T0) / (HISTORY_T1 - HISTORY_T0);
}

export function monthsBetween(
  a: { y: number; m: number },
  b: { y: number; m: number },
): number {
  return (b.y - a.y) * 12 + (b.m - a.m);
}

/** The shrinking interval label between consecutive events (verbatim rules). */
export function gapLabel(mo: number): string {
  if (mo <= 0) return "days later";
  if (mo === 1) return "1 month later";
  if (mo < 24) return mo + " months later";
  const yrs = Math.floor(mo / 12);
  const rem = mo % 12;
  return rem === 0
    ? yrs + " years later"
    : yrs + " years, " + rem + " months later";
}

export const HISTORY_YEAR_TICKS = [2018, 2020, 2022, 2024, 2026] as const;
