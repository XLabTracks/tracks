/* The progress skeleton of the 27-skill verification graph — node ids and the
 * unit tag of every rung, nothing else. The full graph (labels, descriptions,
 * edges, layout) lives in `public/verification/data/skills.js` as
 * `window.SKILLS`, which the static map page reads; this is the slice the app
 * needs server-side to count skills mastered on the completion page.
 *
 * Trap: this is a copy on purpose, same as skills.js itself (a frozen
 * snapshot of the editable authoring tree). public/ is outside tsconfig and
 * cannot be imported, and the worker has no filesystem to read it at runtime.
 * `completion-stats.test.ts` parses `window.SKILLS` out of skills.js and
 * fails when the two disagree, so neither can drift alone. Re-snapshot both
 * deliberately, never fetch.
 *
 * A rung's unit tag is a progress key ("0.1", "2.3") — permanent, per the
 * house rule. The one compound rung ("2.1–2.4") fills a quarter per evidence
 * bucket; every other rung is its unit, done or not.
 */

export const SKILLS_REV = 1;

export const COMPOUND_RUNG = "2.1–2.4";

export const COMPOUND_UNITS = ["2.1", "2.2", "2.3", "2.4"] as const;

export interface SkillNodeRungs {
  /** The node's id in the graph — stable, shared with skills.js. */
  id: string;
  /** Unit tags of the node's rungs, ladder order. */
  rungs: string[];
}

export const SKILL_NODES: SkillNodeRungs[] = [
  { id: "threat", rungs: ["0.1", "0.2", "0.4", "3.0"] },
  { id: "options", rungs: ["0.1", "1.0", "1.1"] },
  { id: "history", rungs: ["0.1", "0.3", "1.2", "2.3", "3.1"] },
  { id: "failure", rungs: ["0.2", "1.1", "2.1–2.4", "3.0", "3.1", "3.2"] },
  { id: "timely", rungs: ["0.2", "2.0", "2.1–2.4", "3.0", "4.0"] },
  { id: "securit", rungs: ["0.3", "4.1"] },
  { id: "components", rungs: ["1.0", "1.1"] },
  { id: "proxy", rungs: ["1.0", "2.0", "2.1", "2.2", "3.1", "3.2", "4.2"] },
  { id: "costs", rungs: ["1.0", "1.1", "2.1", "3.2", "4.1", "4.2"] },
  { id: "decision", rungs: ["0.4", "1.2", "2.1–2.4", "2.3", "4.1"] },
  { id: "incentives", rungs: ["0.4", "1.2", "2.4", "3.1", "3.2"] },
  { id: "supply", rungs: ["1.2", "2.1", "2.2", "3.1"] },
  { id: "upstream", rungs: ["1.3", "4.1"] },
  { id: "dmu", rungs: ["1.1", "1.3", "2.3", "3.2", "4.0"] },
  { id: "taxonomies", rungs: ["2.0", "4.1"] },
  { id: "confverif", rungs: ["0.2", "0.3", "2.0", "2.1", "2.4", "4.2"] },
  { id: "hardware", rungs: ["2.1"] },
  { id: "intel", rungs: ["2.3"] },
  { id: "cloud", rungs: ["2.2"] },
  { id: "human", rungs: ["2.4"] },
  { id: "redblue", rungs: ["3.0", "3.2"] },
  { id: "evasion", rungs: ["3.1"] },
  { id: "swiss", rungs: ["3.1", "3.2", "4.0", "4.2"] },
  { id: "enforce", rungs: ["0.3", "0.4", "1.1", "3.2", "4.2"] },
  { id: "tov", rungs: ["0.2", "3.2", "4.0", "4.2"] },
  { id: "feasib", rungs: ["2.0", "2.1–2.4", "3.2", "4.1"] },
  { id: "regime", rungs: ["3.2", "4.2"] },
];
