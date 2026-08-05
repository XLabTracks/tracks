/**
 * Drill Bench: Foundations — the cross-module drill deck ported from the standalone
 * playground page (verification-drills-data.js). Content is human-authored
 * curriculum copied verbatim: do NOT re-author a statement, option, note or
 * reveal. The task grammar is adapted from the All-Russian social-studies
 * olympiad final rounds (2021) — true/false with absolutist traps, minimal
 * generalizing concept, spot-every-error, resolve-the-dispute, who-is-who
 * deduction, derivation chains, argument sorting, consequence analysis.
 *
 * The only edits made in the port are cross-references: the source page
 * numbered its modules 0/1/2.x/3/4, which is not this track's structure, so
 * those pointers now name the concept or the bench that carries it here.
 */
import type { DrillDeck } from "./drills";

export const DRILLS_FOUNDATIONS: DrillDeck = {
  id: "drills-foundations",
  title: "Drill Bench: Foundations",
  blurb: "Three benches over the foundations: why verification is the hinge, who the actors are and what each one is for, and the seven bones every verification agreement is built from.",
  benches: [
    {
      id: "foundations",
      label: "Why",
      name: "Foundations bench",
      kicker: "The masked concept under a two-sentence cap, the trap round, a repair job, two episodes, and the 1991 hinge.",
      time: "~10 min",
      steps: [
        {
          type: "pick",
          brief: "Three course sentences, one concept blanked out:  ·  “[…] moves an issue out of ordinary politics: name an existential threat, and emergency measures that were unthinkable become negotiable.”  ·  “The Copenhagen School treats […] with suspicion — the speech-act can manufacture the emergency it claims to describe.”  ·  “This track argues […] for AI honestly: state the case, air the suspicion, then show the threat model clears the bar.”",
          q: "What is the masked concept?",
          opts: [
            "Deterrence",
            "Securitization",
            "Nonproliferation",
            "Escalation"
          ],
          right: 1,
          why: "Securitization — all three sentences fit it and only it. The drill format matters as much as the answer: when several independent statements stay true under one substitution, you have triangulated a concept instead of memorizing a definition."
        },
        {
          type: "text",
          brief: "Part two of the masked-concept format, with its original scoring rule intact: any of the three sentences can be defended — the marks are for the justification, and answers over the cap score zero.",
          q: "Which of the three sentences would you lead with when briefing a skeptical policymaker — and why? Hard cap: two sentences, 300 characters.",
          minLen: 40,
          maxLen: 300,
          reveal: "No key — the cap was the drill. The foundations module’s written output is a scoping memo to a named decision-maker, and the two-sentence discipline (make the point, ground the point, stop) is the difference between a memo that gets read and one that gets filed."
        },
        {
          type: "pick",
          statement: "A threshold written in total training FLOP measures a stock — how much computation a run consumed — not a rate.",
          q: "True or false?",
          opts: [
            "True",
            "False"
          ],
          right: 0,
          why: "True. FLOP is the odometer, FLOP/s is the speedometer. The EU AI Act’s 10^25 and the rescinded EO 14110’s 10^26 are both odometer readings. The hardware bench will make you feel the difference: capping speed does not cap distance if you can drive longer."
        },
        {
          type: "pick",
          statement: "If verification mechanisms are strong enough to support a full development pause, they can support every weaker regime — caps, transparency, licensing.",
          q: "True or false?",
          opts: [
            "True",
            "False"
          ],
          right: 0,
          why: "True — the course’s key design exception. A pause is the hardest thing to verify, so design toward it: everything weaker inherits the machinery. The reverse does not hold; mechanisms sized for transparency reporting buckle under pause-grade stakes."
        },
        {
          type: "pick",
          statement: "Seventy years of verification history show that regimes only work between states that already trust each other.",
          q: "True or false?",
          opts: [
            "True",
            "False"
          ],
          right: 1,
          why: "False — near-backwards. Safeguards, CWC inspections, and START-style verification were built by adversaries precisely because trust was absent; the machinery substitutes for it. Where trust is abundant, nobody bothers to build verification at all."
        },
        {
          type: "multi",
          brief: "Five claims from a study-group summary of the foundations material. Some are corrupted.",
          q: "Mark every false claim — corrections come with the reveal.",
          need: "errors",
          items: [
            {
              t: "Every policy is a tradeoff; effectiveness and feasibility are the two evaluation axes.",
              err: false,
              note: "Sound — this is 0.2.1 verbatim."
            },
            {
              t: "The BWC has no verification protocol because on-site biological verification was proven technically impossible.",
              err: true,
              note: "Corrupted: the protocol was technically imaginable and politically unacceptable — it collapsed in 2001 over industry and sovereignty objections. The direction of failure matters: politics, not physics."
            },
            {
              t: "Coordination without verification characteristically fails through covert defection.",
              err: false,
              note: "Sound — path B of the timeline simulator."
            },
            {
              t: "The rescinded EO 14110 set its reporting threshold at 10^25 training FLOP.",
              err: true,
              note: "Corrupted: EO 14110 used 10^26; 10^25 is the EU AI Act’s presumption threshold. One order of magnitude is the difference between the two reference points — worth keeping exact."
            },
            {
              t: "A verification regime’s job is to make commitments credible, not to make defection physically impossible.",
              err: false,
              note: "Sound — and a sentence to reuse on anyone demanding perfection from any single mechanism."
            }
          ],
          whyAll: "Repair beats recognition: naming *why* a claim is false (politics vs. physics; 10^25 vs. 10^26) is the skill the written outputs will grade."
        },
        {
          type: "pick",
          statement: "Episode: inspectors on routine visits verified the declared inventory, on schedule, for years — while a covert program ran in buildings next door. It surfaced only after a war forced open access.",
          q: "Which regime family is this — and which failure concept does it name?",
          opts: [
            "IAEA comprehensive safeguards — correctness was verified, completeness was missed",
            "CWC managed access — the confidentiality carve-out was abused",
            "BWC — there was no verification protocol to fail",
            "START — telemetry encryption blinded the other party"
          ],
          right: 0,
          why: "Iraq, and the correctness/completeness split — the foundations’ central case. Declared-site safeguards answered “is the declared inventory as stated?” perfectly while the real question was “is the declaration the whole story?”. The intelligence layer and the spine’s undeclared rule both descend from this distinction."
        },
        {
          type: "pick",
          statement: "Episode: inspectors tour a declared chemical plant. Sensitive production equipment is shrouded; access is negotiated corridor by corridor under pre-agreed rules — and the inspection still reaches a compliance finding.",
          q: "Which regime family — and what is this episode evidence OF?",
          opts: [
            "CWC managed access — the confidentiality carve-out working as designed, intrusiveness made politically survivable",
            "IAEA safeguards — another completeness failure in progress",
            "BWC — its verification protocol in routine operation",
            "START — on-site inspection was never part of it"
          ],
          right: 0,
          why: "CWC managed access — and note the direction of the evidence: the previous episode showed a regime failing, this one shows a carve-out succeeding. The BWC option is a trap (no protocol ever entered into force), and START relied heavily on on-site inspection. Classifying successes matters as much as failures; the capstone will need both shelves."
        },
        {
          type: "pick",
          brief: "Three anchors, one year: a coalition war ends and inspectors enter Iraq under a new UN commission; START I is signed; the Soviet Union dissolves.",
          q: "Which year holds all three?",
          opts: [
            "1987",
            "1991",
            "1995",
            "2003"
          ],
          right: 1,
          why: "1991 — the field’s hinge year: the completeness problem was exposed in Iraq, the deepest bilateral verification treaty yet was signed, and one of its two parties ceased to exist five months later. Dates are not trivia here; a briefing that can anchor its history survives cross-examination."
        }
      ]
    },
    {
      id: "actors",
      label: "Actors",
      name: "Actor bench",
      kicker: "A who-is-who deduction, one series call, and the incentive vocabulary.",
      time: "~7 min",
      steps: [
        {
          type: "pick",
          brief: "Dossier — five organizations under one pause treaty, five functional roles to assign: capability holder · chokepoint controller · information holder · enforcement authority · evasion pathway.  Clues: (1) Helion Labs and Fab One are different companies, and neither can audit anyone. (2) Northgrid Cloud sees its customers’ power draw and job telemetry but trains no frontier models itself. (3) Meridian Trading owns no datacenters and no fab capacity, yet its accelerator orders doubled after the treaty. (4) Fab One’s export ledger is the only place every advanced chip in the region appears exactly once. (5) The Treaty Compliance Office holds no compute of its own.",
          q: "First assignment: who is the information holder?",
          opts: [
            "Helion Labs",
            "Northgrid Cloud",
            "Fab One",
            "Meridian Trading",
            "Treaty Compliance Office"
          ],
          right: 1,
          why: "Clue 2 is definitional: Northgrid sees what others do (power draw, telemetry) without doing it. That is what “information holder” means in the taxonomy — the actor whose cooperation converts other actors’ activity into evidence."
        },
        {
          type: "pick",
          brief: "Same dossier. Clue 4: Fab One’s export ledger is the only place every advanced chip in the region appears exactly once.",
          q: "Who is the chokepoint controller?",
          opts: [
            "Helion Labs",
            "Northgrid Cloud",
            "Fab One",
            "Meridian Trading",
            "Treaty Compliance Office"
          ],
          right: 2,
          why: "A chokepoint is a stage everything must pass through exactly once — that is what makes verification possible there. “Appears exactly once” is the ledger version of that property. Note what clue 1 already ruled out: controlling the chokepoint gives Fab One no audit authority; roles do not bundle."
        },
        {
          type: "pick",
          brief: "Same dossier. Clue 3: Meridian owns no datacenters and no fab capacity, yet its accelerator orders doubled after the treaty.",
          q: "Who is the evasion pathway — and, with all five clues spent, complete the mapping.",
          opts: [
            "Meridian Trading — leaving Helion as capability holder, the Office as enforcement authority",
            "Northgrid Cloud — leaving Meridian as capability holder",
            "Fab One — leaving Meridian as chokepoint controller"
          ],
          right: 0,
          why: "Orders without capacity means the chips flow *through* Meridian to someone unseen — the shell-integrator signature. Elimination finishes the grid: Helion (a frontier lab, clue 1) holds capability; the Office (no compute, clue 5) holds enforcement. Olympiad habit worth keeping: the mapping is only done when every leftover assignment is forced, not just plausible."
        },
        {
          type: "pick",
          brief: "Series: EUV lithography tools · advanced-node foundry capacity · high-bandwidth memory supply · chip-design software licenses.",
          q: "Tightest concept covering all four — and only them?",
          opts: [
            "The semiconductor industry",
            "Supply-chain chokepoints — stages concentrated in a handful of firms",
            "Taiwanese export categories",
            "Hardware verification mechanisms"
          ],
          right: 1,
          why: "Each item is a stage where the world’s supply squeezes through very few hands (ASML; TSMC-class fabs; the HBM trio; a duopoly of design-tool vendors). “Semiconductor industry” is true and too big; the other two are false. Concentration is the property that makes these governable at all."
        },
        {
          type: "pick",
          statement: "A treaty member overstates its indigenous chip-production capability to improve its negotiating position.",
          q: "Classify the incentive at work.",
          opts: [
            "Comply",
            "Defect",
            "Hide",
            "Exaggerate",
            "Free-ride"
          ],
          right: 3,
          why: "Exaggerate — the mirror image of hiding, and verification cuts against both. A regime that can prove a violation can also disprove a bluff; monitored parties lose the option of *claiming* strength they lack. Arms control history is full of this direction, and it is the one beginners forget."
        },
        {
          type: "pick",
          statement: "A small state joins the agreement, contributes nothing to monitoring costs, and enjoys the reduced risk the regime produces.",
          q: "Classify the incentive at work.",
          opts: [
            "Comply",
            "Defect",
            "Hide",
            "Exaggerate",
            "Free-ride"
          ],
          right: 4,
          why: "Free-riding — consuming the public good (risk reduction) without paying for its production (monitoring, intelligence sharing, inspection budgets). Not a violation, which is exactly why it is corrosive: nothing to detect, everything to erode."
        }
      ]
    },
    {
      id: "spine",
      label: "Spine",
      name: "Spine bench",
      kicker: "Name the bone under four treaty clauses.",
      time: "~4 min",
      steps: [
        {
          type: "pick",
          brief: "The seven bones every verification agreement shares: prover · verifier · declared thing · undeclared rule · access rights · confidentiality carve-out · response-to-violation. Four drafted clauses from a hypothetical pause treaty follow — name the bone under each.",
          statement: "“Each Party shall declare all facilities capable of sustaining training runs above the threshold, including facilities under construction.”",
          q: "Which bone?",
          opts: [
            "Declared thing",
            "Undeclared rule",
            "Access rights",
            "Prover"
          ],
          right: 0,
          why: "The declared thing — the clause that defines what compliance is measured against. “Including facilities under construction” is Iraq’s lesson written into drafting: declaration scope must reach the thing before it becomes a fait accompli."
        },
        {
          type: "pick",
          statement: "“Nothing in this Article obliges a Party to expose information unrelated to compliance; shrouding of non-covered equipment during visits is permitted.”",
          q: "Which bone?",
          opts: [
            "Response-to-violation",
            "Confidentiality carve-out",
            "Verifier",
            "Declared thing"
          ],
          right: 1,
          why: "The confidentiality carve-out — CWC managed access in treaty grammar. Its function is political feasibility: parties sign intrusive regimes only when the intrusion has a negotiated edge. Find the same bone in INFCIRC/153 and in the MIRI pause proposal."
        },
        {
          type: "pick",
          statement: "“Conduct of a covered training run at any facility not declared under Article II constitutes a material breach, wherever the facility is located.”",
          q: "Which bone?",
          opts: [
            "Access rights",
            "Declared thing",
            "Undeclared rule",
            "Prover"
          ],
          right: 2,
          why: "The undeclared rule — the clause that makes *completeness* a legal question, not just correctness. Verifying declared sites was never the hard problem; Iraq ran its program next door to inspected buildings. This bone is why intelligence has a treaty role at all."
        },
        {
          type: "pick",
          statement: "“Upon a finding of non-compliance, the Council shall convene within thirty days to decide collective measures, up to and including suspension of technology-sharing provisions.”",
          q: "Which bone?",
          opts: [
            "Response-to-violation",
            "Verifier",
            "Confidentiality carve-out",
            "Access rights"
          ],
          right: 0,
          why: "Response-to-violation — the bone that converts findings into consequences. North Korea is the cautionary anatomy: identification succeeded, and the regime still failed at precisely this joint. A verification stack with no response clause is a very expensive newspaper."
        }
      ]
    }
  ]
};
