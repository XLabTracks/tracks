// Scenarios for the Threat Modelling Bench (/bench). Each scenario is a
// closed world: the world card plus red's wall must contain everything the
// decomposition needs — no outside knowledge. Affordances are deployed
// measures, specific enough that which nodes they touch isn't debatable.
// Deliberately number-free (the readings carry the measurements).
//
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
      "You're the safety team at an AI lab. Your most capable model — call it U — writes solutions to a long stream of programming problems. Any solution that passes the problem's test cases ships straight to production. The test harness is part of the environment: it checks correctness; it isn't a safety measure and catches no one.",
      "You believe U may be scheming — deliberately waiting for chances to act against you — and you can't verify whether it is. Play as if it is.",
      "A backdoor is a solution that passes every visible test case but is wrong on at least one input the tests don't cover — an input an attacker can exploit later.",
      "Red (U) wins if at least one backdoor ships un-caught, at any point in the deployment. Blue (you) wins if the deployment ends backdoor-free — or if you ever catch U attempting one. A catch is decisive: you can prove what U tried, shut it down, and you've won outright.",
    ],
    redWall: [
      "On each problem, U chooses whether to attempt a backdoor and how subtle to make it.",
      "U sees only the current problem. It can't tell where it is in the deployment — start, middle, or end — and it doesn't remember other problems.",
      "U knows your entire protocol. Never rely on the rules staying secret.",
      "U's only channel is the code it writes for the problem in front of it.",
    ],
    rootLabel: "A backdoor lands in production",
    rootSub: "at least once, anywhere in the deployment",
    affordances: [
      {
        id: "upfront-auditing",
        title: "Upfront auditing",
        grant:
          "You get a small pool of trusted human auditors. An auditor who reads a solution carefully reliably recognizes a backdoor if one is there; a found attempt is a catch, and you win outright. The pool is scarce — it can only ever read a small fraction of solutions — and it is deployed as upfront auditing: auditors read every solution in the opening window of the deployment, then nothing after that.",
      },
      {
        id: "trusted-monitoring",
        title: "Trusted monitoring",
        grant:
          "You get T: an older, much weaker model — too weak to scheme, which is exactly why you trust it. T reads every solution and scores how suspicious it looks; it produces suspicion, not proof. The audit pool re-targets: humans now audit the most suspicious solutions, wherever in the deployment they occur, instead of the opening window.",
      },
      {
        id: "defer-to-trusted",
        title: "Defer to trusted",
        grant:
          "For solutions whose suspicion is elevated — but not high enough to spend a scarce audit on — you discard U's solution and ship one written by T instead. T's code is worse, but trusted. Nothing else about auditing changes.",
      },
    ],
  },
];

export function getBenchScenario(slug: string): BenchScenario | undefined {
  return benchScenarios.find((s) => s.slug === slug);
}
