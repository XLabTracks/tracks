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
 * Ours compresses those eight into seven, because a solo online learner has
 * no facilitator to set goals with and no group to catch up with: Study →
 * Recall → Core → Place → Categorize → Edges → Read the map. Goal Setting is
 * the brief, and Catch-up is the reveal at the end of Recall, which is the
 * same thing a group gets from comparing lists. Beeck's Political Analysis
 * splits across the last two: the edges are the dependencies it exists to
 * draw, the reading is what they add up to.
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
 * cue on screen. Steps 4, 5 and 6 are cued RECOGNITION — the ring names, the
 * six roles and the four subgoals are all printed on screen while they are
 * being used. The freeze hides which actors exist; it does not hide the
 * vocabulary. That is a deliberate trade (free recall of six roles across
 * seventeen actors is a punishing task, and the categories are what the
 * section is teaching), but it means the evidence above covers less of this
 * exercise than its shape suggests.
 *
 * PROVENANCE — read this before editing.
 *
 *   HERS, unchanged: the seventeen actors and their ids, positions and notes
 *   are rows of `ACTOR_MAP_ENTRIES` (data/actor-map.ts) and are not restated
 *   here — this file imports them. The six functional roles and five postures
 *   are `ACTOR_ROLES` / `ACTOR_POSTURES`, which are Tables 5 and 1 of
 *   `scoping-actors.mdx`. The role and posture ANSWER KEYS are those rows'
 *   own `roles` and `postures` fields — this file adds no judgement to them.
 *   The three closing questions are her "Try it before moving on" list,
 *   verbatim, moved here from the lesson body so they have somewhere to be
 *   answered.
 *
 *   OURS, and flagged for her: which actor sits on which ring, which edges
 *   exist, the core question's four options, and the two findings. Every one
 *   of them carries the sentence it rests on — Baker's in a `baker` field,
 *   1.2's in curly quotes — and both sets are held to their sources by the
 *   two tripwires in actor-workshop.test.ts. None of it is a new claim about
 *   the world.
 *
 * THE RINGS ARE BAKER'S FRAME, NOT OURS (course owner, 2026-08-18: use
 * Baker's framework, and make drawing the edges an exercise with Baker's key). They
 * used to be a shape we invented — runs it / supplies it / rules on it / out
 * of reach — derived from 1.2's own sentences but answering a question no
 * paper asks. They now answer the question the verification literature asks,
 * in its own words: Baker, Kulp, Marks, Brundage & Heim, *Verifying
 * International Agreements on AI: Six Layers of Verification for Rules on
 * Large-Scale AI Development and Deployment* (arXiv:2507.15916v2), whose
 * framework opens on declarations and asks, of every actor, what part it
 * plays in checking one.
 *
 * That is the title and the author list the rest of the course already uses —
 * 0.2 offers the paper as a curated reading and 2.1 Hardware makes it item 5
 * of its core source packet. This file had the authors and the title both
 * wrong when the frame first landed; the artifact's own `meta.title` is
 * mangled, so the two lessons above are the authority, not it.
 *
 * WHERE THIS SITS IN THE ARC, since it decides how much may be assumed. The
 * paper is OPTIONAL reading in 0.2 (one of six, "skim broadly; deep-read one
 * or two") and REQUIRED reading in 2.1, where the layers are the assignment.
 * So in 1.2 the framework is new material for most readers, and the workshop
 * has to teach it before it can ask for it back — which is why the four rings
 * are in the study panel and the four subgoals open step 6. A layer is
 * defined as one mechanism per subgoal, so a reader who meets the subgoals
 * here can read 2.1's assignment as a sentence rather than as vocabulary.
 *
 * Every ring name, every subgoal and every edge below carries a `baker` field
 * holding the sentence it rests on, verbatim from the committed artifact at
 * src/content/arxiv/2507.15916v2.json — which is also what actor-workshop.test.ts
 * matches them against, the same tripwire the quotes from 1.2 already had.
 * Read that field before rewriting any of this prose: the wording around it is
 * ours, the claim is not.
 *
 * WHAT THE EDGES ARE. An edge A → B says: A can produce evidence about B, for
 * a Verifier, that B did not have to volunteer. The framework asks four
 * questions of a declaration (Subgoals 1.A, 1.B, 2.A, 2.B) and answers each
 * with a mechanism; the edge names who holds that mechanism.
 *
 * BE EXACT ABOUT WHAT IS WHOSE HERE, because the step prints Baker's name
 * beside every row. The subgoals are the paper's. The mechanisms are the
 * paper's. WHICH ACTOR ON THIS ROSTER HOLDS EACH MECHANISM IS OURS, and for
 * several of them it is arguable rather than read off: an off-chip network tap
 * is a mutually vetted device that nobody on this board manufactures, and it
 * is filed under the cloud provider because the device sits in its data centre
 * and its logs are the other half of the same check. Two mechanisms the paper
 * assigns to EVERY subgoal — national intelligence and whistleblower
 * programmes — are filed at the one subgoal where they are the only mechanism
 * available here, and both edges say so on the page rather than in this
 * comment. The four actors with no edge are the same kind of judgement, each
 * resting on a line of the paper's own scope; California's is the one worth
 * arguing with and its note carries the argument against us.
 *
 * A Verifier may be its own source — intelligence is a Verifier's mechanism,
 * not a hand-off to one — so an edge can start on the third ring.
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

/**
 * The subset the workshop runs on, in reading order.
 *
 * IT WAS TEN AND THEY WERE ALL COMPANIES plus three American bureaus, on a
 * board for an agreement between two governments. The closing questions gave
 * it away: they ask about Taiwan and about states that hold capability and
 * enforcement at once, and neither was on the board the learner had just
 * built. The course owner asked for countries to be added to the diagram on
 * 2026-08-18. So the six
 * states of the lesson's Table 2 are here, and so is one more row that is not
 * a country and belongs for the same reason — see below.
 *
 * Seventeen, from the roster's twenty-seven. What is still out: the EU (a
 * rule-writer with no compute), states with no supply-chain position, the
 * second-tier firms (AMD, EDA, OSATs, memory makers, neoclouds, the Chinese
 * labs) and the two international bodies that exist but do not verify. Every
 * one of them is a row the lesson names; none of them changes an answer here.
 *
 * `missing-verifier` — the roster's own "The verification body that does not
 * exist" — is on the board on purpose, and it is the sharpest row on it. A
 * verifying ring carrying only one signatory's institutions is a lie about a
 * two-party agreement, and drawing the absent third party is how the map says
 * so instead of the page asserting it. It is drawn hollow and it can hold no
 * edge, which is the whole content of the row.
 */
export const WORKSHOP_ACTOR_IDS = [
  "us",
  "china",
  "taiwan",
  "netherlands",
  "japan",
  "south-korea",
  "bis",
  "ic",
  "california",
  "missing-verifier",
  "asml",
  "tsmc",
  "nvidia",
  "hyperscalers",
  "frontier-labs",
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
 * A sentence from Baker et al., quoted verbatim.
 *
 * The artifact is committed (src/content/arxiv/2507.15916v2.json), so this is
 * checkable offline and actor-workshop.test.ts checks it. A quote that no
 * longer appears there fails the suite rather than sitting on the page as a
 * claim nobody can trace.
 */
export interface BakerQuote {
  /** Verbatim. No ellipses, no tightening to fit — the test matches exactly. */
  text: string;
  /** Where in the report it is, so a reader can go and disagree with us. */
  where: string;
}

/**
 * The rings, innermost first.
 *
 * BAKER'S, not ours. The framework's context section sets up a Prover who
 * declares and a Verifier who checks, and everything else on a board like this
 * one is either evidence about a declaration or outside every declaration
 * there is. Four rings, and each one's test is the paper's own sentence.
 *
 * The centre does not change: the regulated act. Baker's scope is the same
 * thing said in compute — the framework "seeks to verify compliance on the
 * basis that all large-scale AI compute use is accounted for in compliant
 * activities" — so a training run above the threshold is exactly what the
 * declarations are about.
 */
export interface Ring {
  id: RingId;
  /** What the ring is, in the learner's hands. */
  name: string;
  /** The test for putting an actor here. */
  test: string;
  baker: BakerQuote[];
}

export type RingId = "declares" | "evidence" | "verifies" | "undeclared";

export const RINGS: Ring[] = [
  {
    id: "declares",
    name: "Declares",
    // BOTH HALVES, OR THE STATES ARE UNPLACEABLE. The test used to name only
    // compute owners, and a learner reading it would put a government on the
    // verifying ring every time — it is a government, and governments check
    // things. The paper's own answer is that in an international agreement
    // the signatory IS the Prover, and a test that hides that half marks the
    // learner wrong for reading carefully.
    test: "You own or use large-scale compute — or you signed the agreement and answer for what happens inside your territory. Either way the regime wants a declaration from you: you are the Prover.",
    // TWO QUOTES, AND THE RING NEEDS BOTH — this is where the states landed.
    // The framework runs at two levels: a signatory government is the Prover
    // to the other signatory, and the organizations inside it declare in
    // turn. One quote alone would put either the states or the firms on this
    // ring by our say-so rather than the paper's.
    baker: [
      {
        text: "The Prover could be a private institution or (in the case of international agreements) a government, which could constrain private companies within its territory as part of the agreement.",
        where: "§3.1, Prover and Verifier",
      },
      {
        text: "organizations that own or use large-scale AI compute (e.g., major AI companies and cloud compute providers) would be required to declare facts about",
        where: "§3.1, the declarations the framework assumes",
      },
    ],
  },
  {
    id: "evidence",
    // The second clause arrived with the states. A jurisdiction does not hold
    // the fab's shipment records — the fab does — but Dutch and Taiwanese law
    // are why those records are a governable object at all, and a ring test
    // that did not say so would contradict its own key.
    name: "Holds the evidence",
    test: "You declare nothing here and you check nothing, but you hold a record a declaration can be held against — or the authority that makes somebody else’s record producible.",
    baker: [
      {
        text: "A Verifier could verify the locations and owners of random samples of AI chips from manufacturing to end-of-life destruction.",
        where: "§4.2.1, verifying AI chips’ chain of custody",
      },
    ],
  },
  {
    id: "verifies",
    name: "Verifies",
    test: "The declarations come to you, and your job is to establish that they are true and that nothing has been left out.",
    baker: [
      {
        text: "Verification focuses on checking that these declarations are correct and complete.",
        where: "§3.1",
      },
    ],
  },
  {
    id: "undeclared",
    name: "Outside the declaration",
    test: "Nothing you do appears in anybody’s declaration — because you sit below the threshold, or because you exist to keep a name off one.",
    baker: [
      {
        text: "Verify that there are no undeclared, large-scale AI compute clusters that could be used for violations.",
        where: "§3.2, Subgoal 2.B",
      },
    ],
  },
];

/**
 * The ring key.
 *
 * Read off Baker's roles, not off intuition, and two placements are worth
 * arguing with and are meant to be.
 *
 * A cloud provider DECLARES. Baker names the Provers in a parenthesis — "major
 * AI companies and cloud compute providers" — so the two innermost actors are
 * the paper's own examples, not our reading of the roster. That is a real move
 * away from the old map, where the cloud sat with the labs for a different
 * reason (the run happens on its machines); it lands in the same place by a
 * better road.
 *
 * The chip firms HOLD EVIDENCE rather than declaring. They own compute of
 * their own and would declare for it — the honest note is that an actor's ring
 * is its part in verifying somebody else's declaration, which is the question
 * this map asks. NVIDIA is here because what it decides is whether the chips
 * carry the features a Verifier would read.
 *
 * The proxies and the deployers share OUTSIDE THE DECLARATION and could not be
 * less alike: one is below the threshold by construction, the other exists to
 * keep a name off a form. The ring names the property they share, and the
 * edge exercise is where the difference between them shows up.
 */
export const RING_KEY: Record<WorkshopActorId, RingId> = {
  us: "declares",
  china: "declares",
  taiwan: "evidence",
  netherlands: "evidence",
  japan: "evidence",
  "south-korea": "evidence",
  bis: "verifies",
  ic: "verifies",
  california: "verifies",
  "missing-verifier": "verifies",
  asml: "evidence",
  tsmc: "evidence",
  nvidia: "evidence",
  hyperscalers: "declares",
  "frontier-labs": "declares",
  proxies: "undeclared",
  deployers: "undeclared",
};

/**
 * The drawing order — which angular slot each actor takes on the map.
 *
 * A SECOND ARRAY, and it earns itself. Angles come from a fixed position in a
 * list, because a layout that reflows as the learner places things is
 * unreadable and one computed from RING_KEY would encode the answer. The
 * reading order above groups actors the way the lesson introduces them —
 * states, then the bureaus inside one of them, then the chain from most
 * upstream down — which means seven consecutive slots all land on the
 * evidence ring, seven labels stacked along one arc of one circle.
 *
 * So the map gets its own order, authored to put no two neighbours on the
 * same ring. It leaks nothing: before anything is placed there are no dots,
 * and afterwards every dot is at the radius the LEARNER chose, so the slot
 * order is not visible to read the key off. A test holds the two arrays to
 * the same set.
 */
export const MAP_SLOTS: readonly WorkshopActorId[] = [
  "asml",
  "us",
  "taiwan",
  "bis",
  "nvidia",
  "hyperscalers",
  "proxies",
  "tsmc",
  "ic",
  "netherlands",
  "frontier-labs",
  "japan",
  "california",
  "south-korea",
  "china",
  "deployers",
  "missing-verifier",
];

/**
 * The one actor drawn as a hollow ring rather than a filled dot.
 *
 * It is on the board to be absent, so it cannot look the same as the things
 * that are there. Shape does the work and never colour alone: its label says
 * "none" in words, its ring reason says what is missing, and it is the only
 * actor that can hold no edge — which the edge step states rather than leaves
 * to be inferred from an empty row.
 */
export const ABSENT_ACTORS: readonly WorkshopActorId[] = ["missing-verifier"];

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
  us: "United States",
  china: "China",
  taiwan: "Taiwan",
  netherlands: "Netherlands",
  japan: "Japan",
  "south-korea": "South Korea",
  bis: "BIS",
  ic: "Intelligence community",
  california: "California",
  // The roster calls this row "The verification body that does not exist",
  // which is a sentence and not a label. The short form compresses the
  // lesson's own paragraph — "The institutional shelf marked 'AI verification
  // body' is empty" — and adds no claim to it.
  "missing-verifier": "No AI verification body",
  asml: "ASML",
  tsmc: "TSMC",
  nvidia: "NVIDIA",
  hyperscalers: "Cloud providers",
  "frontier-labs": "Frontier labs",
  proxies: "Proxies",
  deployers: "Deployers",
};

/**
 * Why each actor sits where it does. Shown only on the reveal.
 *
 * Two sources in one sentence, on purpose: the ring is Baker's and the reason
 * this particular actor lands on it is the lesson's, so where 1.2 has already
 * settled the point its words are quoted rather than paraphrased. The quote
 * tripwire in actor-workshop.test.ts holds those to the lesson body and the
 * `baker` fields to the artifact, which is the same guarantee twice.
 */
export const RING_WHY: Record<WorkshopActorId, string> = {
  us: "In an international agreement the Prover is a government — the paper says so directly, and adds that it is the party “which could constrain private companies within its territory as part of the agreement”. So the signatory declares, and the buildings inside it are the machinery it verifies the other signatory WITH. That is the lesson’s own point about asking which building, drawn as two different rings.",
  china:
    "The other Prover, and on this board that is all it is — because the roster has no row for its bureaus. The United States brings three institutions to the verifying ring and China brings none, which is a fact about this map rather than about the world, and worth holding on to when you read what the map claims.",
  taiwan:
    "The state does not hold the fab’s shipment records; the fab does. What Taiwan holds is the jurisdiction that makes those records a governable object at all — and it is not a party to this agreement, so nothing in the agreement compels it to exercise that.",
  netherlands:
    "One company in one country, and the country is the reason the company’s customer list is reachable. Export law over a single vendor is close to the strongest evidentiary lever anywhere on this board, and it belongs to a state that signed nothing.",
  japan:
    "Equipment and specialty materials: several quieter chokepoints, and the same shape as the Netherlands. Its records matter to a verifier and its participation is voluntary.",
  "south-korea":
    "High-bandwidth memory is scarce, essential to frontier training, and therefore countable — which makes the jurisdiction over the firms that make it an evidence position, not just a trade one.",
  "missing-verifier":
    "The paper allows two kinds of Verifier: “The Verifier could be a government body or a third party.” Every government body on this ring belongs to one signatory. The third party is this row, and it is empty — no chip registry, no challenge-inspection right at a data centre, no procedure for resolving an allegation. It is drawn because a ring with only one party’s institutions on it is a claim, and the claim is false.",
  "frontier-labs":
    "They perform the regulated act, so they are the Prover: every obligation in the agreement is ultimately about what they did or did not train, and the declaration is theirs to make.",
  hyperscalers:
    "Baker puts them in the same parenthesis as the labs — the declarations are of ownership AND use of large-scale compute, and the cluster is theirs. They are also the actor the labs’ own declaration can be checked against, because of what the lesson says the position hands them: “between customer and machine: logs, billing, telemetry, and the power to interrupt a job”.",
  nvidia:
    "Upstream of the run, not in it, and not a Prover for anybody else’s run. What it decides is whether accelerators ship with the security features a Verifier would read — which is why it holds evidence about two different actors and no declaration of its own here.",
  tsmc: "The chain of custody starts where the die is made. How many leading-edge parts exist at all, and who they were made for, is a fact only the fab holds — which is the same thing the lesson means by the “single tightest physical chokepoint in the system”, read as evidence rather than as leverage.",
  asml: "The most upstream supplier there is — and upstream of Baker’s chain of custody, which begins at manufacturing. The tightest chokepoint on the board holds evidence about nobody, which is the sharpest thing this frame does to the roster.",
  bis: "A government body receiving and checking declarations is exactly Baker’s Verifier, and the lesson calls it the “de facto compute-governance agency today”. Its own instrument — export control — is enforcement, which Baker puts outside the frame on purpose.",
  ic: "A Verifier that also produces its own evidence. Baker gives national intelligence every subgoal at once, and it is the only actor on this board that can reach a facility nobody ever declared.",
  california:
    "It made frontier developers report, which is a declaration regime. Verification is what happens to a declaration afterwards — so on this map it is a Verifier that has, as yet, nothing to check the reports against.",
  proxies:
    "A declaration cannot cover a name that exists to “break the link between a name and an activity”. They are Subgoal 2.B in person: the undeclared cluster the whole second half of the framework was built to find.",
  deployers:
    "Outside every declaration for the opposite reason — below the threshold. Baker defines large-scale in thousands of chips over months, so millions of actors who “benefit from safety and bear none of its costs” are outside the regime by construction rather than by evasion.",
};

/**
 * Step 5 runs on six of the seventeen, and here is why.
 *
 * Placing seventeen actors is seventeen clicks. Categorising seventeen means
 * six role chips and five posture chips apiece — 187 decisions — and the step
 * was already the longest one on the board at ten. Length is not the only
 * argument: the lesson works the roles lens through exactly two actors ("Try
 * it on a cloud provider", "Or try Taiwan"), so a step that demands all
 * seventeen is asking for more than the section settles.
 *
 * These six are both of the lesson's worked examples plus one actor from each
 * remaining ring, chosen so the point survives the cut — roles scatter across
 * every ring, and the count per actor runs from four down to one. The United
 * States is here because the third closing question asks for an actor holding
 * capability and enforcement at once, and it should be one the learner has
 * had in their hands.
 */
export const CATEGORIZE_IDS: readonly WorkshopActorId[] = [
  "hyperscalers",
  "taiwan",
  "us",
  "nvidia",
  "ic",
  "proxies",
];

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
      why: "The map is of a rule, and a rule is about an act. It is also what the verification literature centres: Baker's framework takes the approach of compute accounting, which is the same act said in compute. Put it in the centre and every ring becomes an answer to one question — what part do you play in accounting for this run?",
    },
    {
      id: "signatories",
      text: "The states that signed the agreement.",
      correct: false,
      // The distractor now has to do a second job. Since the states arrived,
      // the signatories DO sit on the innermost ring, and a learner who has
      // just been told "not the people who signed" will read that as the map
      // contradicting the page. It does not, and the difference is the whole
      // frame: owing the declaration and doing the act are different things.
      why: "“Not the people who signed. Governments do not train frontier models.” Centre them and the map says the treaty regulates its own signatories rather than an activity. Then watch for what looks like a contradiction two steps from now: the signatories do end up on the innermost RING, because in an international agreement the party that owes the declaration is the government. Owing a declaration and performing the act are different things, and the centre is the act.",
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
 * What sits in the middle of the rings, and the sentence that puts it there.
 *
 * Printed under the map, because a diagram whose centre is asserted is a
 * diagram the reader has to take on trust.
 */
export const CENTRE = {
  label: "A training run",
  sub: "above the threshold",
  baker: {
    text: "it seeks to verify compliance on the basis that all large-scale AI compute use is accounted for in compliant activities.",
    where: "§3.1, AI compute accounting",
  } satisfies BakerQuote,
} as const;

/**
 * Baker's four verification subgoals, each in the paper's own words.
 *
 * The decomposition is the whole reason the edge exercise has a key rather
 * than a set of opinions: a mechanism counts because it completes one of
 * these, and an actor is on the map's edges because it holds a mechanism.
 * 1 and 2 together are exhaustive by construction — the paper's own argument
 * is that if declared uses are compliant and there are no undeclared uses,
 * every use is compliant.
 */
export type SubgoalId = "1a" | "1b" | "2a" | "2b";

export interface Subgoal {
  id: SubgoalId;
  /** The paper's numbering, which is worth keeping: it is how it is cited. */
  label: string;
  /** A short name, ours, for a chip and a table row. */
  name: string;
  baker: BakerQuote;
}

export const SUBGOALS: Subgoal[] = [
  {
    id: "1a",
    label: "1.A",
    name: "Declared uses are accurate",
    baker: {
      text: "Verify that declared uses of AI compute are declared accurately, i.e., the Prover actually did the claimed development or deployment.",
      where: "§3.2",
    },
  },
  {
    id: "1b",
    label: "1.B",
    name: "Declared uses have the required properties",
    baker: {
      text: "Assuming that the declared uses are accurate (as is verified per Subgoal 1.A), verify they have the required properties.",
      where: "§3.2",
    },
  },
  {
    id: "2a",
    label: "2.A",
    name: "No undeclared use of a declared cluster",
    baker: {
      text: "Verify that there are no undeclared, large-scale uses of declared AI compute clusters.",
      where: "§3.2",
    },
  },
  {
    id: "2b",
    label: "2.B",
    name: "No undeclared clusters at all",
    baker: {
      text: "Verify that there are no undeclared, large-scale AI compute clusters that could be used for violations.",
      where: "§3.2",
    },
  },
];

/**
 * Step 6 — the edges, and the key for them.
 *
 * AN EDGE A → B SAYS: A can put something in front of a Verifier about B that
 * B did not have to volunteer. Direction is the content of the edge, not a
 * drawing convention — the cloud provider holds records about the lab's run,
 * and the lab holds nothing comparable about the cloud. A learner who draws
 * one backwards is told so specifically rather than simply marked wrong.
 *
 * Every edge names the subgoal it completes and quotes the mechanism from
 * Baker. Nothing was added because it would make a tidier graph: the four
 * actors that end up in no edge at all are in EDGE_NOTES with the line of the
 * paper that keeps them out, and that absence is the exercise's real finding.
 */
export interface WorkshopEdge {
  from: WorkshopActorId;
  to: WorkshopActorId;
  subgoal: SubgoalId;
  /** What A can actually hand over, in our words. */
  what: string;
  baker: BakerQuote[];
}

export const EDGE_KEY: WorkshopEdge[] = [
  {
    from: "hyperscalers",
    to: "frontier-labs",
    subgoal: "1a",
    what: "The declared run happened on somebody else’s machines. The cluster’s own records — logs, billing, and the sensors a verification regime would attach to it — are where a Verifier goes to find out whether the declaration matches what the chips did.",
    baker: [
      {
        text: "the Verifier would aim to detect discrepancies between a Prover’s declarations and their actual chip use, such as by detecting that chips’ input data or power draw patterns tell a different story than the Prover’s claims",
        where: "§4.2, off-chip verification layers",
      },
    ],
  },
  {
    from: "nvidia",
    to: "frontier-labs",
    subgoal: "1b",
    what: "Checking that a declared model has the properties the rules require means running tests on it without the Prover handing over its weights. The feature that makes that possible is built into the chip at design time; Baker names NVIDIA among the designers that have implemented or announced versions of it.",
    baker: [
      {
        text: "This could enable a Verifier to run tests on a Prover’s models, data, and code—with the Prover knowing their information will not be stolen, and with the Verifier knowing their tests will be run faithfully and will not be viewed for the sake of manipulating test results.",
        where: "§4.1.1.1, Confidential Computing",
      },
    ],
  },
  {
    from: "nvidia",
    to: "hyperscalers",
    subgoal: "2a",
    what: "Accounting for everything a declared cluster did means the chips keeping their own record. That is a hardware feature, present or absent at manufacture — the cluster’s operator cannot add it afterwards, and cannot quietly remove it either.",
    baker: [
      {
        text: "Security features built into AI chips may enable verification, such as by ensuring that AI chips log traces of their activities for confidential analysis.",
        where: "§4.1, the on-chip verification layer",
      },
    ],
  },
  {
    from: "tsmc",
    to: "proxies",
    subgoal: "2b",
    what: "The chain of custody starts where the die is made. How many leading-edge parts exist at all is the ceiling on how large any undeclared cluster could possibly be, and that number exists in one place.",
    baker: [
      {
        text: "A Verifier could verify the locations and owners of random samples of AI chips from manufacturing to end-of-life destruction.",
        where: "§4.2.1, verifying AI chips’ chain of custody",
      },
      {
        text: "This would serve to verify that large quantities of AI chips are not assembled into undeclared AI compute clusters (Subgoal 2.B).",
        where: "§4.2.1",
      },
    ],
  },
  {
    from: "nvidia",
    to: "proxies",
    subgoal: "2b",
    what: "The same chain one link down: who the parts were sold to, and which serialised chip went where. This is NVIDIA’s second mechanism and a different one from the first — which is exactly why it gets its own edge.",
    baker: [
      {
        text: "An example verification mechanism is inspecting AI chips to verify that they have not been sent to undeclared AI data centers; this helps complete Subgoal 2.B.",
        where: "§4, defining a verification mechanism",
      },
    ],
  },
  {
    // The edge the board was missing until the states arrived, and the only
    // one that points at a signatory. Everything else on this key points at a
    // company or at a shell; verification of a PARTY happens here or nowhere.
    from: "ic",
    to: "china",
    subgoal: "2b",
    what: "The lesson's own row for this agency is monitoring and attribution — the layer that spots hidden data centres and procurement networks. It is what one signatory has instead of a right to inspect the other. Note what it costs: what it knows is classified, so turning it into evidence anybody may act on risks the source that produced it. And note the asymmetry, which is a fact about this roster rather than about the world — China has the same capability and this board has no row for it.",
    baker: [
      {
        text: "Intelligence agencies could collect and analyze intelligence for all verification subgoals, including via human, cyber, and signals intelligence.",
        where: "§4.3, personnel-based verification layers",
      },
      {
        text: "More adversarial, harder for third parties to verify, and unclear effectiveness.",
        where: "§4.3, the layer's own listed disadvantages",
      },
    ],
  },
  {
    from: "ic",
    to: "proxies",
    subgoal: "2b",
    what: "A cluster nobody declared leaves no paperwork to audit. What is left is people and signals — and this is the only actor on the board that can reach a facility that was never on any list. Read the quote carefully: the paper gives intelligence EVERY subgoal, not this one. It is filed here because 2.B is the only place on this board where it is the sole mechanism, and an edge you drew from it to a lab or a cloud has the paper behind it.",
    baker: [
      {
        text: "Intelligence agencies could collect and analyze intelligence for all verification subgoals, including via human, cyber, and signals intelligence.",
        where: "§4.3, personnel-based verification layers",
      },
    ],
  },
];

/**
 * The actors with no edge, and the line of the paper that keeps them out.
 *
 * These are not oversights and must not be quietly filled in to make the
 * graph look complete. Each one is a scope decision Baker states outright,
 * and three of the four are actors 1.2 spends real time on — which is the
 * point: being the biggest lever on the board and being useless to a Verifier
 * are compatible.
 */
export const EDGE_NOTES: {
  /** Every actor this note accounts for. The test holds the union of these
      to exactly the set of actors no edge touches, so an added edge cannot
      leave a note standing that explains an absence which is no longer one. */
  actorIds: WorkshopActorId[];
  why: string;
  baker: BakerQuote[];
}[] = [
  {
    actorIds: ["us"],
    why: "A signatory declares; it does not produce evidence itself. What a state has for that is institutions, which is why the intelligence edge starts at the agency rather than at the country. Then notice the shape that leaves: China is at the receiving end of an edge and the United States is at the receiving end of none. Do not read that as a claim that one government is the more transparent. It is a claim about which government's institutions this roster wrote down — and about the empty ring where the body that would check both of them should be.",
    baker: [
      {
        text: "The Prover could be a private institution or (in the case of international agreements) a government, which could constrain private companies within its territory as part of the agreement.",
        where: "§3.1, Prover and Verifier",
      },
    ],
  },
  {
    actorIds: ["taiwan", "netherlands", "japan", "south-korea"],
    why: "The four host states hold the jurisdiction that makes their firms' records producible, and not one of them is a party to this agreement. That is not an oversight in the drawing; it is the open problem the paper lists under attaining participation, and it is the reason a two-party compute agreement leans on export controls and energy policy rather than on the agreement itself. An edge you drew from one of them is an edge nothing compels.",
    baker: [
      {
        text: "How to attain compliance commitments from all states that host large-scale AI compute (as such states could directly misuse it or rent it to an agreement party)?",
        where: "§3.3, broader challenges",
      },
    ],
  },
  {
    actorIds: ["missing-verifier"],
    why: "This one can hold no edge, and that is the row, not a gap in it. The paper allows a government body or a third party as Verifier; every government body here belongs to one signatory, and the third party does not exist — no chip registry, no challenge-inspection right, no procedure for resolving an allegation of training above a threshold. Read the board once more with that in mind: a two-party agreement in which only one party's institutions can check anything, and no neutral party at all.",
    baker: [
      {
        text: "The Verifier could be a government body or a third party.",
        where: "§3.1",
      },
    ],
  },
  {
    actorIds: ["asml"],
    why: "Baker’s chain of custody begins at manufacturing, and ASML is upstream of that: it sells the machines the fab uses, not the parts a regime counts. The tightest chokepoint on the map completes no subgoal, which is what the difference between leverage and evidence looks like.",
    baker: [
      {
        text: "A Verifier could verify the locations and owners of random samples of AI chips from manufacturing to end-of-life destruction.",
        where: "§4.2.1 — the chain starts at manufacturing, not at the tools",
      },
    ],
  },
  {
    actorIds: ["bis"],
    why: "Export control is the instrument, and the paper puts it outside the frame deliberately: it is how a party is stopped or punished after a finding, not how a declaration is checked. Today’s de facto compute-governance agency is, in this framework, downstream of verification rather than part of it.",
    baker: [
      {
        text: "We do not cover this latter step of enforcement, though a few verification mechanisms double as enforcement tools.",
        where: "§2.3, scope limitations",
      },
    ],
  },
  {
    actorIds: ["california"],
    // The one absence a learner can argue with, so it carries the argument
    // rather than waiting to be caught out. 1.2 supplies half of it — SB 53
    // makes large frontier developers run an internal anonymous reporting
    // channel — and the paper supplies the other half in the second quote.
    why: "A reporting statute produces declarations. Verification is what happens to a declaration afterwards, and receiving one is not checking it. The actor that bound the leading labs before any international mechanism existed completes no subgoal — it supplies the thing the subgoals are about. Argue with this one if you drew the edge: SB 53 also requires an internal anonymous reporting channel at large frontier developers, and whistleblowing is a verification mechanism in this framework, for every subgoal at once. The key leaves the edge out because the mechanism is a programme a Verifier runs and California is not running one — which is a judgement, not a reading.",
    baker: [
      {
        text: "Verification focuses on checking that these declarations are correct and complete.",
        where: "§3.1",
      },
      {
        text: "Programs may enable and incentivize (narrowly scoped, non-public) staff whistleblowing, for all verification subgoals.",
        where: "§4.3, the personnel-based layers",
      },
    ],
  },
  {
    actorIds: ["deployers"],
    why: "Below the threshold, and that is the whole of it. Millions of actors running somebody else’s model are outside the regime by construction rather than by evasion — which is why they share a ring with the proxies and share nothing else.",
    baker: [
      {
        text: "AI development or deployment is “large-scale” if it uses thousands of high-end AI chips over multiple months.",
        where: "§2.2, what counts as large-scale",
      },
    ],
  },
];

/**
 * What the edges say once they are drawn.
 *
 * Every count in this text is re-derived in actor-workshop.test.ts against
 * EDGE_KEY, so the prose cannot drift from the data it describes.
 */
export const EDGE_FINDING = {
  title: "Where this regime is weakest",
  body: [
    "Count the edges by subgoal. 2.B — no undeclared clusters anywhere — has four. The other three subgoals have one edge each, so three quarters of what a verifier has to establish rests on a single mechanism apiece. Baker’s standard for a robust regime is redundancy: layers stacked, so that a subgoal has more than one way of being completed. Three of the four subgoals on this board have no second way at all.",
    "Now count by actor instead, which is the sharper reading. One firm is on three of the seven edges and touches three of the four subgoals — and that is not a coincidence about NVIDIA, it is what a verification layer IS. The paper defines a layer as one mechanism per subgoal, and the on-chip layer is a chip designer’s to give or withhold. So the board does not show one weak link; it shows a regime resting on roughly one layer, held by a company that is not a party to the agreement.",
    "The paper calls the least robust subgoal the weak link and says the regime is only as good as that one. This map narrows the question rather than answering it — counting edges is not measuring robustness — but it does tell you where to ask.",
    "Now count arrowheads. Six of the seven edges point at a company or at a shell. Exactly one points at a party to the agreement, and it runs one way, out of one signatory’s intelligence service. Nothing on this board produces evidence about the United States, and the reason is not that the United States is transparent — it is that the counterparty’s institutions are not on the roster and the neutral body that would be is the hollow ring on the third band. This is a map of a two-party agreement in which one party’s bureaus do all the checking, including of themselves.",
    "Then read the third ring on its own, since that is where the last paragraph comes from. The export-control bureau, the intelligence community, the state legislature: one country’s, all three. 1.2 already told you the shelf marked “AI verification body” is empty; here it is, drawn empty, on the ring where the alternative would have gone.",
    "Then read what has no edge at all — ten of the seventeen. Some of those absences are the paper’s scope (enforcement is not verification), some are the roster’s (China brought no bureaus), and one is the whole problem stated as a hole: four states hold the jurisdiction that makes the chain’s records producible, and not one of them signed anything.",
    "Then read what has no node. The paper’s simplest and most implementation-ready layer runs on people — whistleblowers, interviews, intelligence. One of those three is on this board, because it happens to be an institution. The other two are not organisations, so a map of organisations has nowhere to put them, and you would never find them by drawing one.",
  ],
  weakLink: {
    text: "identify the subgoal whose mechanisms are collectively least robust. This subgoal is the “weak link” of the regime—its robustness determines the regime’s overall robustness.",
    where: "§3.2",
  } satisfies BakerQuote,
  redundancy: {
    text: "three verification layers can be stacked together to achieve three layers of redundancy, for example.",
    where: "§4, defining a verification layer",
  } satisfies BakerQuote,
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
    "Read your rings from the inside out. Exactly two actors on this board owe anybody a declaration; everything outside them either holds evidence about that declaration, or checks it, or is not covered by any declaration at all. A verification regime is a much smaller object than the map of who matters — most of this board it does not reach, and half of it cannot help.",
    // "Position" is the lesson's word for place on the supply chain (Table 4)
    // and 1.2.1 is the exercise for it, so this paragraph must not quietly
    // re-point it at the rings. Four lenses now, and the fourth is named.
    "Now read the colours across the rings instead of around them. Roles do not stay in their band — the cloud provider holds four of them at once, and the ring it sits on tells you none of the four. The section gives you three questions to ask of any actor: where does it sit on the chain (position, Table 4, and the map in 1.2.1 is where you practise it), what can it do inside a regime (roles), what does it want today (posture). These rings are a fourth, and a narrower one: not where an actor sits, but what part it plays in checking a declaration. All four cut across each other, which is why no single one of them is the map.",
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
      why: "The run happens on their machines. Access can be suspended this afternoon — and they are the other actor the regime asks for a declaration, because the cluster it happens on is theirs.",
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
