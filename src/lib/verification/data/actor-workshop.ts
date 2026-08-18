/**
 * 1.2 — The Actor Map Workshop.
 *
 * WHAT THIS IS AND WHY IT IS SHAPED THIS WAY (course owner's instruction,
 * 2026-08-15). It is built on the Beeck Center's stakeholder-mapping workshop
 * (Georgetown), whose steps and timings are: Goal Setting 5' · List all
 * stakeholders 10' · Identify the core user 5' · Place and cluster 10–15' ·
 * Categorize 10–15' · Catch-up 5' · Political Analysis 15–20' · Setting
 * Actions 10'. Its artifact is concentric rings with the core at the centre,
 * so a reader can "see dependencies between stakeholders and anticipate
 * second-order effects".
 *
 * Ours compresses those eight into six, because a solo online learner has no
 * facilitator to set goals with and no group to catch up with: Study →
 * Recall → Core → Place → Categorize → Read the map. Goal Setting is the
 * brief, and Catch-up is the reveal at the end of Recall, which is the same
 * thing a group gets from comparing lists.
 *
 * WHY IT OPENS CLOSED-BOOK. Both papers below were read, not summarised from
 * an abstract, and the second one corrected what this comment used to claim.
 *
 *   Karpicke & Blunt, Science 2011. Concept mapping counts as elaborative
 *   study precisely when "students construct concept maps in the presence of
 *   the materials they are learning" — in their Experiment 2 the mapping
 *   group "created their concept maps on paper while viewing the text".
 *   Retrieval practice beat it on the final short-answer test (d = 1.07) AND
 *   on a final test that was itself building a map from memory (d = 1.01).
 *   The detail that makes it bite: the mapping group produced MORE ideas
 *   during initial learning (0.74 of ideas versus 0.65), so it was ahead
 *   where it felt like it counted and behind a week later.
 *
 *   Blunt & Karpicke 2014 is NOT "the fix that rehabilitates maps", which is
 *   what this file said before anybody opened it. They crossed format
 *   (paragraph vs concept map) with text presence, and the finding is that
 *   format did not matter: "concept mapping and paragraph formats were
 *   equally effective retrieval-based learning activities", while retrieval
 *   itself did — "students performed better on a final test when the initial
 *   activities required retrieval (in the absence of the texts) rather than
 *   studying or elaborating on the material (in the presence of the texts)",
 *   even though the retrieval groups WROTE LESS during learning.
 *
 * What that licenses and what it does not. It licenses the freeze: closing
 * the roster is the whole of the evidence-backed part, and it would work as
 * well if every step were a plain textarea. It does NOT license the ring map
 * as a teaching device — a map is not a better format than writing down what
 * you remember, it is merely not a worse one. The rings are here for two
 * other reasons: they are the artifact the Beeck workshop is built to
 * produce, and they make one structural claim visible that the lesson can
 * otherwise only assert (see MAP_FINDING).
 *
 * A third finding neither paper leaves room to ignore: learners believe they
 * learned more after studying than after retrieving. That is why reopening
 * the roster is recorded and reported back rather than silently allowed —
 * the feeling of having learned is the thing being corrected.
 *
 * AND WHAT THIS WORKSHOP IS NOT, said here so nobody has to discover it.
 * Only step 2 is retrieval in Karpicke's sense: it asks for material with no
 * cue on screen. Steps 4 and 5 are cued RECOGNITION — the four ring names and
 * the six roles are printed on the buttons the learner presses. The freeze
 * hides which actors exist; it does not hide the vocabulary. That is a
 * deliberate trade (free recall of six roles for ten actors is a punishing
 * task, and the categories are what the section is teaching), but it means
 * the evidence above covers less of this exercise than its shape suggests.
 * Step 2 is also the weakest retrieval that could have been asked for: it
 * retrieves ten proper nouns, and the section's content is what those actors
 * can do and to whom.
 *
 * PROVENANCE — read this before editing.
 *
 *   HERS, unchanged: the ten actors and their ids, positions and notes are
 *   rows of `ACTOR_MAP_ENTRIES` (data/actor-map.ts) and are not restated
 *   here — this file imports them. The six functional roles and five postures
 *   are `ACTOR_ROLES` / `ACTOR_POSTURES`, which are Tables 5 and 1 of
 *   `scoping-actors.mdx`. The role and posture ANSWER KEYS are those rows'
 *   own `roles` and `postures` fields — this file adds no judgement to them.
 *   The three closing questions are her "Try it before moving on" list,
 *   verbatim, moved here from the lesson body so they have somewhere to be
 *   answered.
 *
 *   OURS, and flagged for her: the four rings and which actor sits on which;
 *   the core question's four options; and the closing finding. All four are
 *   derived from sentences already in 1.2 and each carries the sentence it
 *   was derived from, in `source`. None of it is a new claim about the world.
 *
 * WHY RINGS CARRY POSITION AND CHIPS CARRY ROLES. The lesson is explicit that
 * "any actor can hold several roles at once, and almost every important actor
 * does" — so a single ring per actor would be false if rings meant roles.
 * Position on the chain is single-valued and roles are not, which is exactly
 * Beeck's split between "Place and cluster" and "Categorize". The payoff is
 * the lesson's own sentence made visible: the second lens cuts across the
 * first, and on the finished map the role colours scatter across every ring.
 */

import {
  ACTOR_MAP_ENTRIES,
  type ActorMapEntry,
  type ActorPostureId,
  type ActorRoleId,
} from "./actor-map";
import type { MarkingKey } from "./marking-keys";

/** The subset the workshop runs on. Ten is the size that keeps every step */
/* under a few minutes; the roster has twenty-seven. These ten were chosen to
   put at least two actors on every ring and to include the three the lesson
   argues with rather than lists: the cloud provider (its worked example of
   one actor holding four roles at once), the proxies and the deployers (the
   two it names as the gap). */
export const WORKSHOP_ACTOR_IDS = [
  "frontier-labs",
  "hyperscalers",
  "nvidia",
  "tsmc",
  "asml",
  "bis",
  "ic",
  "california",
  "proxies",
  "deployers",
] as const;

export type WorkshopActorId = (typeof WORKSHOP_ACTOR_IDS)[number];

const byId = new Map(ACTOR_MAP_ENTRIES.map((a) => [a.id, a]));

/**
 * A roster row narrowed to a workshop id.
 *
 * `ActorMapEntry.id` is a plain string, which is right for a roster of
 * twenty-seven and wrong here: every key below is exhaustive over the ten, and
 * a component mapping over these rows must be able to index those keys without
 * a cast. Re-stamping `id` is what buys that, and it costs one shallow copy at
 * module load.
 */
export type WorkshopActor = ActorMapEntry & { id: WorkshopActorId };

export const WORKSHOP_ACTORS: WorkshopActor[] = WORKSHOP_ACTOR_IDS.map((id) => {
  const actor = byId.get(id);
  // A missing id means the roster was edited without this list; failing at
  // module load is right, because the alternative is a workshop that silently
  // runs on nine actors and a key that no longer matches its own questions.
  if (!actor) throw new Error(`actor-workshop: no roster entry for "${id}"`);
  return { ...actor, id };
});

/**
 * The rings, innermost first.
 *
 * OURS. One question asked of the regulated activity at the centre: how does
 * a rule reach you? The lesson's own answer to that is the reason the section
 * exists — "Not the people who signed. Governments do not train frontier
 * models… The activity the agreement is about happens inside companies" — and
 * the finished map is that sentence in a picture: the signatures sit on the
 * outside and every ring between them is somebody a signatory has to reach
 * through.
 */
export interface Ring {
  id: RingId;
  /** What the ring is, in the learner's hands. */
  name: string;
  /** The test for putting an actor here. */
  test: string;
  source: string;
}

export type RingId = "runs" | "supplies" | "rules" | "unreached";

export const RINGS: Ring[] = [
  {
    id: "runs",
    name: "Runs it",
    test: "The regulated activity happens on your premises or under your name.",
    source:
      "“The activity the agreement is about happens inside companies: labs in San Francisco and Hangzhou…”",
  },
  {
    id: "supplies",
    name: "Supplies it",
    test: "The run cannot happen without something you make or sell.",
    source:
      "Table 4 reads the chain from equipment down to the labs: “The machines without which no leading-edge chip exists, and knowledge of every fab that buys one.”",
  },
  {
    id: "rules",
    name: "Rules on it",
    test: "You can write or enforce a rule, and you touch none of the activity yourself.",
    source:
      "“A state legislature bound the world’s leading labs to reporting duties before any international mechanism existed.”",
  },
  {
    id: "unreached",
    name: "Out of reach",
    test: "No rule lands on you — because you route around it, or because nobody wrote one for you.",
    source:
      "“They exist to break the link between a name and an activity.” · “They benefit from safety and bear none of its costs.”",
  },
];

/**
 * The ring key.
 *
 * OURS, derived per actor from the row's own `position` in the roster, with
 * the sentence quoted on the reveal. Two placements are worth arguing with
 * and are meant to be: a cloud provider is on RUNS rather than SUPPLIES,
 * because the run physically happens on its machines — "the position between
 * customer and machine"; and the proxies sit OUT OF REACH beside the
 * deployers, who could not be less alike in intent, because the property the
 * ring names is the one they share — a rule cannot land on either.
 */
export const RING_KEY: Record<WorkshopActorId, RingId> = {
  "frontier-labs": "runs",
  hyperscalers: "runs",
  nvidia: "supplies",
  tsmc: "supplies",
  asml: "supplies",
  bis: "rules",
  ic: "rules",
  california: "rules",
  proxies: "unreached",
  deployers: "unreached",
};

/**
 * What the ring map calls each actor.
 *
 * The roster names are right in a roster and too long on a diagram — "AWS,
 * Azure, Google Cloud, Oracle, Alibaba" truncated to an ellipsis at this
 * size, which is a label that has stopped being one. Every short form below
 * is the row heading the lesson's own tables use for that row (Table 4:
 * Cloud providers, Frontier labs, Deployers, Proxies and contractors; Table
 * 3: Commerce Department / Bureau of Industry and Security). Nothing here is
 * a new name for anything.
 */
export const MAP_LABEL: Record<WorkshopActorId, string> = {
  "frontier-labs": "Frontier labs",
  hyperscalers: "Cloud providers",
  nvidia: "NVIDIA",
  tsmc: "TSMC",
  asml: "ASML",
  bis: "BIS",
  ic: "Intelligence community",
  california: "California",
  proxies: "Proxies",
  deployers: "Deployers",
};

/** Why each actor sits where it does. Shown only on the reveal. */
export const RING_WHY: Record<WorkshopActorId, string> = {
  "frontier-labs":
    "They perform the regulated act. Every obligation in the agreement is ultimately about what they do or do not train.",
  hyperscalers:
    "The run happens on their machines. They sit between customer and machine, which is why they hold the logs and can interrupt a job this afternoon.",
  nvidia:
    "Upstream of the run, not in it. What they decide is whether accelerators ship with attestation, metering or location features at all.",
  tsmc: "The chips exist because they were fabricated. Nothing runs without that step, and the step happens once.",
  asml: "The most upstream supplier there is: without EUV lithography no leading-edge chip exists.",
  bis: "It writes and enforces export controls on chips — today’s de facto compute-governance agency — and trains no models itself.",
  ic: "It can see undeclared facilities and procurement networks, and it regulates nothing. Its problem is turning what it knows into evidence somebody may act on.",
  california:
    "A subnational legislature that bound the world’s leading labs to reporting duties before any international mechanism existed.",
  proxies:
    "A rule cannot land on a name that was created to be discarded. They are the channel evasion flows through, which is a position no article addresses directly.",
  deployers:
    "Millions of them, downstream of everything, bearing the risk and bound by nothing. The agreement never reaches them and was never written to.",
};

/**
 * Step 3 — the core.
 *
 * OURS: the question and its four options. The answer and the reason both
 * come straight out of the lesson's own opening move — "Who, exactly, has to
 * change their behavior on Wednesday morning? Not the people who signed." The
 * three wrong options are the three answers that move gets asked against.
 */
export const CORE_QUESTION = {
  stem: "A pause agreement forbids training runs above a compute threshold. When you draw this map, what goes in the centre?",
  options: [
    {
      id: "activity",
      text: "The regulated activity itself — a training run above the threshold.",
      correct: true,
      why: "The map is of a rule, and a rule is about an act. Putting the act in the centre is what makes the rings mean anything: each one is a further step a signatory has to reach through to touch it.",
    },
    {
      id: "signatories",
      text: "The states that signed the agreement.",
      correct: false,
      why: "“Not the people who signed. Governments do not train frontier models.” Put them in the centre and the map says the treaty regulates its own signatories, which is the misreading the whole section is written against.",
    },
    {
      id: "labs",
      text: "The frontier labs the obligations land on.",
      correct: false,
      why: "Close, and it is why they sit on the first ring. But the labs are who does the act, not the act — and a map centred on them has nowhere to put a run that happens somewhere else, under someone else’s name.",
    },
    {
      id: "chips",
      text: "The chips the threshold is counted in.",
      correct: false,
      why: "The chips are what makes the act countable from outside, which is a property of the mechanism rather than of the rule. Centre the map here and every institution on it becomes an afterthought.",
    },
  ],
} as const;

/**
 * The finding the finished map is supposed to hand over.
 *
 * OURS in its wording, hers in its content: it is the paragraph the lesson
 * already carries, stated as something the picture shows rather than
 * something the page asserts. That is the whole reason the artifact is drawn.
 */
export const MAP_FINDING = {
  title: "What the finished map says",
  body: [
    "Read your rings from the outside in. Everybody who can write a rule is on the outer ring, and nothing they can compel is theirs: the act is in the centre, and between them and it sit the firms that run it and the firms that supply it. That is why almost every article of a pause agreement is a promise to control somebody else.",
    "Now read the colours across the rings instead of around them. Roles do not stay in their band — the cloud provider holds four of them at once, and the ring it sits on tells you none of the four. Position tells you where an actor is; roles tell you what it can do to you; posture tells you what it wants today. The three lenses cut across each other, which is why the section asks you to run all three.",
  ],
} as const;

/**
 * Step 6 — Beeck's "Setting Actions", which for a reader is the transfer step.
 *
 * HERS, verbatim: the three tasks that were the "Try it before moving on"
 * bullets in scoping-actors.mdx. They moved here rather than being rewritten,
 * because in the body they stood over a widget that had nowhere to answer
 * them. Nothing is graded — same rule as every other workspace in this repo.
 */
export const CLOSING_QUESTIONS = [
  {
    id: "taiwan-roles",
    n: 1,
    requirement: "required" as const,
    title: "Tag every functional role Taiwan holds. There are at least three.",
    body: [],
  },
  {
    id: "information-order",
    n: 2,
    requirement: "required" as const,
    title:
      "For one specific frontier training run, list the information holders in order of how complete their picture is.",
    body: [],
  },
  {
    id: "uneasy-pairing",
    n: 3,
    requirement: "required" as const,
    title:
      "Name one actor that is a capability holder and an enforcement authority at the same time, and say why that pairing should make you uneasy.",
    body: [],
  },
];

/**
 * Step 2 — what free recall actually asks for.
 *
 * It used to ask for the cast: "who does this agreement touch", marked by a
 * fuzzy matcher against the roster's names. That retrieved ten proper nouns,
 * and the section's content is what those actors can do and to whom — so it
 * was the weakest retrieval the step could have asked for. It asks for the
 * material now.
 *
 * The cloud provider is the subject because the lesson works it through
 * explicitly, which means the key below can be HER SENTENCES and nothing
 * else: the four bullets under "Try it on a cloud provider" and the default
 * posture in Table 4's cloud row. Four roles and two postures, six items.
 *
 * MARKED BY THE LEARNER, not by a matcher. A string matcher over free prose
 * would have to carry a vocabulary list per role ("suspend", "cut off",
 * "valve"…), would be wrong often, and would be wrong in the direction that
 * discourages writing anything. Self-scoring against a printed key is what
 * the free-recall studies do and what every constructed exercise in 2.4
 * already does; the learner ticks what they actually had.
 */
export interface RecallItem {
  id: string;
  /** The role or posture name, as the taxonomy prints it. */
  label: string;
  /** Hers, verbatim, from the sentence that settles it. */
  gloss: string;
}

export const RECALL_TARGET = {
  actorId: "hyperscalers" as WorkshopActorId,
  /** What the learner is asked to write. */
  prompt:
    "Take one actor: a cloud provider. From memory, write down everything it can do inside a verification regime — and what it wants while doing it.",
  items: [
    {
      id: "chokepoint",
      label: "Chokepoint controller",
      gloss: "It can suspend a customer’s access this afternoon.",
    },
    {
      id: "information",
      label: "Information holder",
      gloss:
        "Its logs and billing records are the richest picture anywhere of who is computing what.",
    },
    {
      id: "enforcement",
      label: "Enforcement authority",
      gloss:
        "Give it know-your-customer duties and it becomes the regime’s front-line cop.",
    },
    {
      id: "evasion",
      label: "Evasion pathway",
      gloss:
        "Its reseller chains and mislabeled workloads are precisely how a determined actor reaches compute it should not have.",
    },
    {
      id: "comply",
      label: "Comply",
      gloss: "Table 4’s cloud row: “Comply and hide at once. Natural monitors, reluctant police.”",
    },
    {
      id: "hide",
      label: "Hide",
      gloss: "The same row: a natural monitor that is a reluctant police force.",
    },
  ] as RecallItem[],
} as const;

/**
 * Step 6b — the second-order question the concentric map exists for.
 *
 * Beeck's own reason for drawing rings is to "see dependencies between
 * stakeholders and anticipate second-order effects", and the workshop had no
 * step that did the second half. This is it: take one actor off the board.
 *
 * The question asks which removal bites SOONEST on purpose, because the
 * answer is not the one the supply-chain numbers point at, and the gap
 * between the two is the second-order effect. Removing the clouds stops runs
 * this week — they are the machines the run happens on. Removing ASML stops
 * almost nothing this week and very nearly everything eventually: it is 100%
 * of EUV lithography, and EUV is what leading-edge fabrication needs.
 *
 * SOURCED, not asserted. Sastry, Heim, Belfield et al., "Computing Power and
 * the Governance of Artificial Intelligence" (2024), Figure 11: "ASML is the
 * only company capable of producing EUV machines", market share 100%; TSMC at
 * 90% of ≤7nm logic fabrication; and and the caption verbatim:
 * "Several critical steps--including AI chip design and production--have fewer
 * than three suppliers."
 * The cloud split in the same figure is AWS 32%, Azure 22%, Google Cloud 11%.
 */
export const SECOND_ORDER = {
  stem: "Take one actor off the board entirely. Whose removal stops a frontier training run soonest — this week, not this decade?",
  options: [
    {
      id: "hyperscalers",
      text: "The cloud providers.",
      correct: true,
      why: "The run happens on their machines. Access can be suspended this afternoon, which is why they are on the inner ring at all.",
    },
    {
      id: "asml",
      text: "ASML.",
      correct: false,
      why: "The most consequential removal on this board and the slowest. ASML is 100% of EUV lithography, so taking it away eventually takes leading-edge fabrication with it — but no training run stops this week, because the chips already exist.",
    },
    {
      id: "tsmc",
      text: "TSMC.",
      correct: false,
      why: "Same shape as ASML, one step nearer: ~90% of sub-7nm logic. It stops the next generation of chips, not the run already loaded.",
    },
    {
      id: "bis",
      text: "The Bureau of Industry and Security.",
      correct: false,
      why: "It writes and enforces export controls and trains nothing. Remove it and the rules stop being enforced — which loosens the regime rather than stopping the activity.",
    },
  ],
  /** What the step is actually for, shown after the commit. */
  lesson:
    "That gap is the thing a ring map is drawn to show. The removal that bites soonest and the removal that matters most are different actors, on different rings, and a regime that reaches only for the second one buys nothing this year. Ask both questions of any chokepoint you are offered.",
} as const;

/**
 * The marking key for the three closing questions.
 *
 * The house form, and the reasons for it, are in data/marking-keys.ts: credit
 * per element, a bare correct label worth nothing where a mechanism was
 * asked for, wording free, and what earns nothing said out loud.
 *
 * THE ANSWERS ARE DERIVED FROM THE ROSTER, not from judgement. Taiwan holds
 * exactly three roles in `ACTOR_MAP_ENTRIES` — chokepoint, information,
 * victim — which is why her question says "at least three". Exactly two
 * actors hold capability and enforcement at once, the United States and
 * China; a test in actor-workshop.test.ts re-derives both facts, so a roster
 * edit that changes them fails rather than leaving a key that lies.
 *
 * Question 2 has no fixed answer and its criteria say so: the lesson gives
 * the information holders but never ranks them, so what is marked is whether
 * an order was committed to and whether each rank carries its reason.
 */
export const CLOSING_KEY: MarkingKey = {
  criteria: [
    {
      text: "Taiwan is named as a chokepoint controller, and the reason is the fabrication step rather than the country.",
      points: 1,
      needsReasoning: true,
      grounds: "Table 2: “the single tightest physical chokepoint in the system”.",
    },
    {
      text: "Taiwan is named as an information holder — what was fabricated, how much, and for whom.",
      points: 1,
      grounds: "Table 5: “Who already knows what verifiers need to learn?”",
    },
    {
      text: "Taiwan is named as a victim or beneficiary: it carries the risk of being the chokepoint without controlling the conflict over it.",
      points: 1,
      needsReasoning: true,
      grounds: "Table 2: “being both the prize and the battlefield in a conflict it does not control”.",
    },
    {
      text: "The information holders are put in an actual order, not listed.",
      points: 1,
    },
    {
      text: "Each rank carries the reason its picture is more or less complete — what that actor sees, and what it cannot see.",
      points: 2,
      needsReasoning: true,
      grounds:
        "Table 4 gives each stage its holding: the lab knows what was trained and on what, the cloud holds logs and billing, the fab holds shipments.",
    },
    {
      text: "The actor named for the last question holds capability and enforcement at once — on this roster that is a state with a frontier programme of its own.",
      points: 1,
      grounds: "Table 3 splits one signatory into institutions that do not want the same thing.",
    },
    {
      text: "The unease is stated as a mechanism: the same actor builds the thing and judges whether the rules about it were broken, so an unfavourable finding costs it twice.",
      points: 2,
      needsReasoning: true,
    },
  ],
  noCredit: [
    "Naming Taiwan’s three roles without saying what makes each one true.",
    "Listing information holders in the order the lesson happens to print them, with no claim about completeness.",
    "Calling it a conflict of interest with no account of what the conflict costs the actor.",
  ],
};

/** Its own localStorage document, as every workspace has. Permanent. */
export const WORKSHOP_NOTES_KEY = "v-actor-workshop-notes:v1";

/** The self-marking beside those answers. Permanent, and never sent anywhere. */
export const WORKSHOP_MARKS_KEY = "v-actor-workshop-marks:v1";

/** Role and posture keys, read straight off the roster rows. */
export const ROLE_KEY = Object.fromEntries(
  WORKSHOP_ACTORS.map((a) => [a.id, a.roles]),
) as Record<WorkshopActorId, ActorRoleId[]>;
export const POSTURE_KEY = Object.fromEntries(
  WORKSHOP_ACTORS.map((a) => [a.id, a.postures]),
) as Record<WorkshopActorId, ActorPostureId[]>;
