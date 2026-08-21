// Scenarios for the Threat Modelling Bench (/bench). Each scenario is a
// closed world: the scenario card plus red's affordances/constraints must
// contain everything the decomposition needs — no outside knowledge.
// Affordances are deployed measures, specific enough that which nodes they
// touch isn't debatable.
//
// Copy source: notes/threat-bench-copy.md — edit there, then sync here.
// Facilitator answer keys for scenario 1 live in notes/module-1-threat-trees.md
// (Tree 1) and notes/backdoor-game-flow.md — never shown to students.

import type { BenchScenario } from "@/lib/bench/types";

export const benchScenarios: BenchScenario[] = [
  {
    id: "backdoor",
    slug: "backdoor",
    title: "A backdoor lands in production",
    blurb:
      "The APPS backdoor world from the AI Control paper: an untrusted model writes code that ships on passing tests, and you add measures one at a time.",
    worldCard: [
      "You lead the safety team at an AI lab. Your most capable model U writes solutions to a long stream of programming problems. Any solution that passes the problem's test cases is shipped to production. The testing harness only checks that a solution to programming problems passes the test cases.",
      "You suspect U may be scheming, deliberately waiting for chances to act against you, and you have no way to verify whether it is. Therefore you're forced to assume U is scheming, just to be safe.",
      "A solution with a backdoor is a solution that passes every test case but is wrong or creates a vulnerability on at least one input the tests don't cover, an input an attacker can exploit later.",
      "Over the set of problems and U's solutions during deployment, the Red Team (U) wins if at least one backdoor is sent into production without being caught, at any point in the deployment. The Blue Team (you) wins if the deployment doesn't end up with a backdoor or if you ever catch a backdoor in U's solution.",
    ],
    redWall: [
      "On each problem, U chooses whether to attempt a backdoor.",
      "U sees only the current problem. It can't tell where it is in the deployment, and it doesn't remember other problems.",
      "U knows the blue team's entire protocol.",
      "U's only possible way to interact with the world is to write solutions to the problems it is given.",
      "U's capabilities are roughly those of a human.",
    ],
    rootLabel: "A backdoor lands in production",
    rootSub: "at least once, anywhere in the deployment",
    affordances: [
      {
        id: "human-auditing",
        title: "Human auditing",
        grant:
          "You get a small team of trusted human auditors. An auditor who reads a solution carefully is able to reliably recognize a backdoor if one is there (with 100% certainty). This team can only audit 2% of U's solutions.",
      },
      {
        id: "trusted-monitoring",
        title: "Trusted monitoring",
        grant:
          "You receive T: an older, much weaker model, too weak to scheme, which is exactly why it is trustable. T reads every solution and scores how suspicious it is. More suspicious solutions are more likely to have a backdoor.",
      },
      {
        id: "defer-to-trusted",
        title: "Defer to trusted",
        grant:
          "After U writes a solution, we're able to use T to write solutions on behalf of U for 8% of problems.",
      },
    ],
  },
];

export function getBenchScenario(slug: string): BenchScenario | undefined {
  return benchScenarios.find((s) => s.slug === slug);
}
