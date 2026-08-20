/**
 * Drill Bench: Primers — the cross-module drill deck ported from the standalone
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

export const DRILLS_PRIMERS: DrillDeck = {
  id: "drills-primers",
  title: "Drill Bench: Primers",
  blurb: "One bench over the primers: inspection games, credible commitment, two-level games — with the absolutist traps left in, and one syllogism to close.",
  benches: [
    {
      id: "primers",
      label: "Primers",
      name: "Primer bench",
      kicker: "Game theory and inspection logic — traps included, one syllogism to close.",
      time: "~6 min",
      steps: [
        {
          type: "pick",
          statement: "In a well-designed inspection game, the inspector’s optimal strategy drives the equilibrium violation rate to zero.",
          q: "True or false?",
          opts: [
            "True",
            "False"
          ],
          right: 1,
          why: "False — and the word doing the damage is “zero”. In Dresher-style inspection games the inspector has limited inspections, so the equilibrium involves randomized inspection and a nonzero violation rate. A regime that promises zero is overclaiming; a regime that prices the residual rate is doing game theory."
        },
        {
          type: "pick",
          statement: "Reputation, reciprocity, and retaliation can sustain compliance without any court — but every one of the three runs on detection.",
          q: "True or false?",
          opts: [
            "True",
            "False"
          ],
          right: 0,
          why: "True. Each enforcement channel that works without a world government begins with noticing the violation. That is the primer’s punchline and the whole track’s premise: no detection, no deterrence — verification is upstream of every enforcement story."
        },
        {
          type: "pick",
          statement: "In Putnam’s two-level game, a leader who signs in good faith and then fails domestic ratification has still defected — involuntarily.",
          q: "True or false?",
          opts: [
            "True",
            "False"
          ],
          right: 0,
          why: "True. Two-level games distinguish voluntary defection (chose to cheat) from involuntary (couldn’t deliver the home front). A verification regime must survive both: the second kind is why ratification constraints belong in feasibility analysis, not just bad faith."
        },
        {
          type: "pick",
          brief: "Series: sunk costs · tied hands · mechanical enforcement.",
          q: "Name the tightest concept that covers all three — and only them.",
          opts: [
            "Game-theoretic concepts",
            "Fearon’s ways of making a commitment credible",
            "Forms of treaty punishment",
            "Domestic ratification constraints"
          ],
          right: 1,
          why: "The series rule: the tightest true label wins. “Game-theoretic concepts” is true but hopelessly broad — it earns zero on an olympiad table and it should here too. Fearon (1997): burn resources up front (sunk cost), make backing down costly later (tied hands), or remove the choice entirely (mechanical enforcement)."
        },
        {
          type: "multi",
          brief: "Nine terms, deliberately over-stocked the way the source round stocks its lists: randomized inspection · tit-for-tat · Dresher game · ratification constraint · equilibrium violation rate · audience costs · grim trigger · cheap talk · Schelling focal point.",
          q: "Mark exactly the three terms that belong to strategic inspection.",
          need: 3,
          items: [
            {
              t: "randomized inspection",
              err: true,
              note: "Inspection-game logic: predictable inspectors are avoidable inspectors."
            },
            {
              t: "tit-for-tat",
              err: false,
              note: "Repeated-cooperation strategy — the Evolution of Trust family, not inspection."
            },
            {
              t: "Dresher game",
              err: true,
              note: "The founding formalization of inspector vs. potential violator."
            },
            {
              t: "ratification constraint",
              err: false,
              note: "Two-level games — the domestic board, not the inspection board."
            },
            {
              t: "equilibrium violation rate",
              err: true,
              note: "The inspection game’s sobering output: the rate is nonzero at optimum."
            },
            {
              t: "audience costs",
              err: false,
              note: "Tied-hands credibility — Fearon’s territory, not the inspector’s."
            },
            {
              t: "grim trigger",
              err: false,
              note: "Repeated-game punishment strategy — enforcement, not inspection."
            },
            {
              t: "cheap talk",
              err: false,
              note: "Costless signaling — the opposite of everything Fearon and inspectors trade in."
            },
            {
              t: "Schelling focal point",
              err: false,
              note: "Coordination without communication — a third Schelling idea, not this one."
            }
          ],
          whyAll: "Four families were mixed into the list: inspection games (the three you had to find), repeated cooperation, commitment credibility, and coordination. The source round buries three needles in eleven terms; distractor density is part of the drill."
        },
        {
          type: "pick",
          brief: "Syllogism. Premises: (1) No self-reporting mechanism is tamper-resistant. (2) All log-based regimes are self-reporting mechanisms. (3) Some treaty provisions are log-based regimes. The full answer is the conclusion PLUS the picture — the reveal describes the circle diagram that justifies it.",
          q: "Which conclusion follows necessarily?",
          opts: [
            "No treaty provision is tamper-resistant",
            "Some treaty provisions are not tamper-resistant",
            "Some tamper-resistant mechanisms are treaty provisions",
            "All treaty provisions are self-reporting mechanisms"
          ],
          right: 1,
          // The reveal names "the third option" while walking the diagram.
          fixedOrder: true,
          why: "Chain the circles: the log-based circle sits wholly inside self-reporting (premise 2), and self-reporting is disjoint from tamper-resistant (premise 1); the treaty-provisions circle overlaps log-based (premise 3), so that overlap is forced outside tamper-resistant — an existential conclusion and nothing more. The rest of the provisions circle is unconstrained, which kills the “no” and “all” options; the third option is not derivable at all. Drawing the arrangement where your answer holds and the others fail IS the justification — that is the drill’s scoring rule."
        }
      ]
    }
  ]
};
