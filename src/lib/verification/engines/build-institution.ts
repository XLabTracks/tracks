/**
 * 2.4.4's evaluator: does this selection of five provisions work as one
 * institution?
 *
 * It grades FUNCTIONS AND CONTRADICTIONS, never a combination. The course
 * owner's design principle is that several selections are defensible and the
 * exercise must not secretly reduce to one canonical five, so there is no
 * canonical five here to compare against — a selection passes a test when it
 * supplies the function that test names and carries nothing that defeats it.
 *
 * A defect defeats a test whatever else was selected, which is the point her
 * spec makes about coherence: five individually attractive provisions are not
 * an institution. Employer approval defeats the independent route even when
 * the route is also selected — that pair is the first of her four invalid
 * constructions, and the one that looks most reasonable on the cards.
 */

import {
  PROVISIONS,
  type Defect,
  type Function_,
  type Provision,
} from "@/lib/verification/data/build-institution";

export type TestId = "reach" | "protection" | "discipline";

export interface TestResult {
  id: TestId;
  passed: boolean;
  /** Why, in the evaluator's own terms — the widget renders these verbatim. */
  notes: string[];
}

export interface Evaluation {
  results: TestResult[];
  passed: boolean;
}

function selected(ids: readonly string[]): Provision[] {
  return PROVISIONS.filter((p) => ids.includes(p.id));
}

function has(list: Provision[], fn: Function_): boolean {
  return list.some((p) => p.gives?.includes(fn));
}

function defect(list: Provision[], d: Defect): Provision | undefined {
  return list.find((p) => p.breaks?.includes(d));
}

/** The three tests, in the order the spec states them. */
export function evaluateInstitution(ids: readonly string[]): Evaluation {
  const picked = selected(ids);
  const results: TestResult[] = [];

  // Reach — a route to an independent verifier, not gated by the employer.
  {
    const notes: string[] = [];
    const route = has(picked, "independent-route");
    const gate = defect(picked, "employer-gate");
    if (!route) {
      notes.push(
        "Nothing here lets a report reach an independent body. Every route you selected ends inside the organization.",
      );
    }
    if (gate) {
      notes.push(
        `${gate.id} puts the organization in the path of its own accusation. A route that needs the employer's permission is the employer's route, whatever else is selected.`,
      );
    }
    if (route && !gate) {
      notes.push(
        "A report can reach the verifier without asking the organization it concerns.",
      );
    }
    results.push({ id: "reach", passed: route && !gate, notes });
  }

  // Protection — usable in advance, not conditional on being proved right.
  {
    const notes: string[] = [];
    const shield =
      has(picked, "anti-retaliation") || has(picked, "identity-protection");
    const exposed = defect(picked, "identity-exposed");
    const conditional = defect(picked, "protection-conditional");
    if (!shield) {
      notes.push(
        "Nothing protects the reporter. Reporting is permitted and its whole cost still falls on the person who does it.",
      );
    }
    if (exposed) {
      notes.push(
        `${exposed.id} hands the reporter's name to the party they are reporting. Protection that starts after that is protection after the fact.`,
      );
    }
    if (conditional) {
      notes.push(
        `${conditional.id} makes protection depend on being proved right, which is the one thing a reporter cannot know in advance. Under that rule the reasonable move is silence.`,
      );
    }
    if (shield && !exposed && !conditional) {
      notes.push(
        "Somebody deciding whether to report can know in advance what protects them.",
      );
    }
    results.push({
      id: "protection",
      passed: shield && !exposed && !conditional,
      notes,
    });
  }

  // Epistemic discipline — an allegation opens something; it proves nothing.
  {
    const notes: string[] = [];
    const followUp = has(picked, "corroboration") || has(picked, "escalation");
    const proof = defect(picked, "allegation-is-proof");
    const inadmissible = defect(picked, "reports-inadmissible");
    if (!followUp) {
      notes.push(
        "A report arrives and nothing follows from it. There is no corroboration step and no way to escalate, so the channel collects allegations and stops.",
      );
    }
    if (proof) {
      notes.push(
        `${proof.id} treats an allegation as a finding. That is the failure this whole section is about, and it survives no matter what else is selected.`,
      );
    }
    if (inadmissible) {
      notes.push(
        `${inadmissible.id} requires the violation to be proved before a report may be considered, which leaves the human channel with nothing to do.`,
      );
    }
    if (followUp && !proof && !inadmissible) {
      notes.push(
        "A report can start verification without ending it: something happens next, and it is not a finding.",
      );
    }
    results.push({
      id: "discipline",
      passed: followUp && !proof && !inadmissible,
      notes,
    });
  }

  return { results, passed: results.every((r) => r.passed) };
}
