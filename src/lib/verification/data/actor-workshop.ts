
import {
  ACTOR_MAP_ENTRIES,
  type ActorMapEntry,
  type ActorPostureId,
  type ActorRoleId,
} from "./actor-map";
import type { MarkingKey } from "./marking-keys";

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

export type WorkshopActor = ActorMapEntry & { id: WorkshopActorId };

export const WORKSHOP_ACTORS: WorkshopActor[] = WORKSHOP_ACTOR_IDS.map((id) => {
  const actor = byId.get(id);
  if (!actor) throw new Error(`actor-workshop: no roster entry for "${id}"`);
  return { ...actor, id };
});

export interface BakerQuote {
  text: string;
  where: string;
}

export interface Ring {
  id: RingId;
  name: string;
  test: string;
  baker: BakerQuote[];
}

export type RingId = "declares" | "evidence" | "verifies" | "undeclared";

export const RINGS: Ring[] = [
  {
    id: "declares",
    name: "Declares",
    test: "You own or use large-scale compute — or you signed the agreement and answer for what happens inside your territory. Either way the regime wants a declaration from you: you are the Prover.",
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

export const ABSENT_ACTORS: readonly WorkshopActorId[] = ["missing-verifier"];

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
  "missing-verifier": "No AI verification body",
  asml: "ASML",
  tsmc: "TSMC",
  nvidia: "NVIDIA",
  hyperscalers: "Cloud providers",
  "frontier-labs": "Frontier labs",
  proxies: "Proxies",
  deployers: "Deployers",
};

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

export const CATEGORIZE_IDS: readonly WorkshopActorId[] = [
  "hyperscalers",
  "taiwan",
  "us",
  "nvidia",
  "ic",
  "proxies",
];

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

export const CENTRE = {
  label: "A training run",
  sub: "above the threshold",
  baker: {
    text: "it seeks to verify compliance on the basis that all large-scale AI compute use is accounted for in compliant activities.",
    where: "§3.1, AI compute accounting",
  } satisfies BakerQuote,
} as const;

export type SubgoalId = "1a" | "1b" | "2a" | "2b";

export interface Subgoal {
  id: SubgoalId;
  label: string;
  name: string;
  baker: BakerQuote;
}

export const SUBGOALS: Subgoal[] = [
  {
    id: "1a",
    label: "1.A",
    name: "Is the declared use described accurately?",
    baker: {
      text: "Verify that declared uses of AI compute are declared accurately, i.e., the Prover actually did the claimed development or deployment.",
      where: "§3.2",
    },
  },
  {
    id: "1b",
    label: "1.B",
    name: "Does the declared use satisfy the agreement’s requirements?",
    baker: {
      text: "Assuming that the declared uses are accurate (as is verified per Subgoal 1.A), verify they have the required properties.",
      where: "§3.2",
    },
  },
  {
    id: "2a",
    label: "2.A",
    name: "Is a declared cluster also being used for something undeclared?",
    baker: {
      text: "Verify that there are no undeclared, large-scale uses of declared AI compute clusters.",
      where: "§3.2",
    },
  },
  {
    id: "2b",
    label: "2.B",
    name: "Are there undeclared clusters?",
    baker: {
      text: "Verify that there are no undeclared, large-scale AI compute clusters that could be used for violations.",
      where: "§3.2",
    },
  },
];

export interface WorkshopEdge {
  from: WorkshopActorId;
  to: WorkshopActorId;
  subgoal: SubgoalId;
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

export const EDGE_NOTES: {
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

export const MAP_FINDING = {
  title: "What the finished map says",
  body: [
    "Read your rings from the inside out. Exactly two actors on this board owe anybody a declaration; everything outside them either holds evidence about that declaration, or checks it, or is not covered by any declaration at all. A verification regime is a much smaller object than the map of who matters — most of this board it does not reach, and half of it cannot help.",
    "Now read the colours across the rings instead of around them. Roles do not stay in their band — the cloud provider holds four of them at once, and the ring it sits on tells you none of the four. The section gives you three questions to ask of any actor: where does it sit on the chain (position, Table 4, and the map in 1.2.1 is where you practise it), what can it do inside a regime (roles), what does it want today (posture). These rings are a fourth, and a narrower one: not where an actor sits, but what part it plays in checking a declaration. All four cut across each other, which is why no single one of them is the map.",
  ],
} as const;

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

export interface RecallItem {
  id: string;
  label: string;
  gloss: string;
}

export const RECALL_TARGET = {
  actorId: "hyperscalers" as WorkshopActorId,
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
  lesson:
    "That gap is the thing a ring map is drawn to show. The removal that bites soonest and the removal that matters most are different actors, on different rings, and a regime that reaches only for the second one buys nothing this year. Ask both questions of any chokepoint you are offered.",
} as const;

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

export const WORKSHOP_NOTES_KEY = "v-actor-workshop-notes:v1";

export const WORKSHOP_MARKS_KEY = "v-actor-workshop-marks:v1";

export const ROLE_KEY = Object.fromEntries(
  WORKSHOP_ACTORS.map((a) => [a.id, a.roles]),
) as Record<WorkshopActorId, ActorRoleId[]>;
export const POSTURE_KEY = Object.fromEntries(
  WORKSHOP_ACTORS.map((a) => [a.id, a.postures]),
) as Record<WorkshopActorId, ActorPostureId[]>;
