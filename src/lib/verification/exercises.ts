/**
 * Registry of the Verification track's interactives (native React widgets in
 * `src/components/verification/widgets/`, keyed by the same id and rendered via
 * the `<VerificationExercise/>` MDX component).
 *
 * `bridged` widgets have a real finish event (quiz done, report filed, run
 * finished); they call their `onComplete` to record platform progress, and the
 * hosting lesson's scroll-based auto-complete is disabled so only finishing
 * (or the explicit button) completes it. Unbridged widgets are view-style
 * explorables with no finish event and keep normal scroll-to-complete.
 *
 * WHAT `bridged` COMPLETES, because the comments in this file kept getting it
 * wrong. The write always goes to `v-<id>` — the exercise's own content id,
 * never its host lesson's. So:
 *
 *   - An exercise that IS a lesson (`interactive-map` = 1.2.1,
 *     `actor-edges` = 1.2.2) has `v-<id>` in the graph, and bridging it
 *     does complete that lesson.
 *   - An exercise embedded in somebody else's prose (`protocol-actors` inside
 *     1.2, `human-institutions-judgment` inside 2.4.2) has no `v-<id>` lesson.
 *     Bridging it records a private per-exercise mark the widget reads back to
 *     show itself as done; it completes NO lesson and is counted in no total,
 *     because the progress accessors walk the graph. That is the design, not a
 *     defect — an embedded widget remembering it was finished, without
 *     claiming the section around it was read.
 *
 * So "finishing it finishes the section" is only ever true of the first kind.
 *
 * `id` is the widget id; where the exercise is its own lesson that lesson's id
 * is `v-<id>` (enforced by src/lib/verification/widgets.test.ts, which also
 * allows the embedded-in-prose kind).
 */
export interface VerificationExerciseDef {
  /** Widget id (also the widgets/registry.tsx key and the v-<id> lesson id). */
  id: string;
  /** Display title. */
  title: string;
  /** True when the widget reports a finish event via its onComplete. */
  bridged: boolean;
}
export const verificationExercises: VerificationExerciseDef[] = [
  { id: "verification-problem", title: "The Verification Problem", bridged: false },
  { id: "evidence-taxonomies", title: "Five Maps of the Evidence", bridged: false },
  // field-map stood down 2026-08-18: its only embed was 4.0's
  // threat-modeling/theory-of-change spec block, deleted on the course
  // owner's instruction (Outline-42). Widget and data stay in the repo,
  // unregistered because the registry test rightly refuses orphans;
  // remounting is this line, its registry line, and an embed. Its learner
  // state waits under vt-field-map:v1. See docs/verification/module-4-log.md.
  // { id: "field-map", title: "Field Map", bridged: false },
  { id: "collection-map", title: "The Collection Map", bridged: false },
  { id: "verification-landscape", title: "The Verification Landscape", bridged: false },
  { id: "policy-cost", title: "Everything Comes With a Cost", bridged: false },
  // policy-plot ("Effectiveness x Feasibility") stood down 2026-08-18: the
  // outline's v40 revision of 1.0.2 places two prototypes — policy-cost and
  // the rebuilt policy-scoping — and the plot's link left the document.
  // Widget and data stay in the repo, unregistered because the registry test
  // rightly refuses orphans; remounting is this line, its registry line, and
  // an embed. See docs/verification/module-1-log.md.
  { id: "mechanism-sort", title: "Place Your Bets — Mechanism Sort", bridged: false },
  { id: "mechanism-sort-reveal", title: "The Reference Map", bridged: false },
  { id: "policy-scoping", title: "Scoping an Anti-ASI Policy", bridged: true },
  { id: "anatomy-drill", title: "The Anatomy Drill", bridged: true },
  // 1.2's workshop, replacing two widgets on the owner's instruction
  // (2026-08-15). protocol-actors ("Who's in the Treaty?") went because
  // clicking highlighted phrases in a treaty is recognition dressed as work;
  // actor-map ("The Actor Map") went because it was a third browsable roster
  // of the same cast, conflating "who is there" with "who has power" and
  // being an answer surface for neither. Both files stay in the repo,
  // unregistered — the registry test rightly refuses orphans — so remounting
  // either is this line, its registry line, and an embed. See
  // docs/verification/module-1-log.md.
  //
  // Bridged: six committed steps ending in a written workspace is a real
  // finish. It is embedded in 1.2's prose and has no v-<id> lesson, so per
  // the note at the top of this file the finish marks the exercise and
  // completes no section.
  { id: "actor-workshop", title: "The Actor Map Workshop", bridged: true },
  // 1.2.3. The workshop's second half, and its own lesson — so bridging it
  // completes that lesson, which the embedded half above cannot do.
  { id: "actor-edges", title: "Who can prove what", bridged: true },
  { id: "interactive-map", title: "The Compute Supply Chain", bridged: false },
  // report-constructor stood down with 1.2.2 on 2026-08-18 — it duplicated
  // 1.3.1, and writing a verification report belongs to 1.3 rather than to
  // the actor lesson. The widget, its tested engine and 21KB of authored
  // scenario copy are all still here; this line and one
  // <VerificationExercise/> bring the section back.
  // { id: "report-constructor", title: "One Inspection, Three Readers", bridged: true },
  { id: "context-distiller", title: "The Distiller", bridged: true },
  { id: "what-do-they-say", title: "Why Are We Concerned About Superintelligence?", bridged: false },
  { id: "types-of-ai", title: "The Types of AI", bridged: false },
  { id: "short-history", title: "A Short History of AI Acceleration", bridged: false },
  // 0.1.2's optional exercise: fill the elements table for an organization of
  // the learner's choice. Ungraded self-work with no finish event, so
  // unbridged — the optional fold must never gate the lesson.
  { id: "theories-of-change", title: "Theory of Change for Your Favorite AI Safety Organization", bridged: false },
  // precedent-cases ("Did the Regime Hold?") stood down 2026-08-12 on the
  // owner's review — the 0.3 document packet is the section's whole hour.
  // Widget, diagrams and data (her eight case files) remain in the repo,
  // unregistered because the registry test rightly refuses orphans.
  // Re-mounting is this line, its registry line, and an embed. See
  // docs/verification/module-0-log.md.
  // The 0.3 document packet's five tasks: bridged — complete when her rule
  // is met (Task 5 submitted plus any one of Tasks 1–4).
  { id: "packet-tasks", title: "Tasks on the Document Packet", bridged: true },
  // nuclear-disanalysis stood down 2026-08-12 when the owner's document
  // packet took over 0.3's reasoning tasks — the widget and its data file
  // remain in widgets/ and data/, unregistered because the registry test
  // rightly refuses orphans. Re-mounting it is this line, its registry line,
  // and an embed. See docs/verification/module-0-log.md.
  { id: "treaty-workspace", title: "Anatomy of a (Pause) Agreement", bridged: true },
  { id: "compute-verification", title: "Questions on the Cankaya Working Paper", bridged: true },
  // The mounted drill benches. Bridged: the deck reports complete when the
  // last step of its last bench is committed.
  { id: "drills-primers", title: "Drill Bench: Primers", bridged: true },
  // drills-foundations stood down on 2026-08-18. 1.2 had to come from a
  // measured 77 minutes to under 40 and the bench was nine of them; the
  // course owner chose removal over moving it to 1.3. Retired here rather
  // than left registered-but-unplaced, which is the state widgets.test.ts
  // forbids and CLAUDE.md calls drift.
  //
  // NOTHING WAS DELETED. The three decks — foundations (9 steps), actors (6),
  // spine (4) — are authored content and still live in
  // data/drills-foundations.ts, with their widget and renderer intact.
  // Bringing them back is this line plus one <VerificationExercise/> in
  // whichever lesson should carry them; 1.3 and module 0 both fit.
  // { id: "drills-foundations", title: "Drill Bench: Foundations and Actors", bridged: true },
  // drills-supply-chain stood down when the section-specific 2.4.4 lab
  // replaced it. Its widget, engine, data, and tests remain in the repo.
  { id: "drills-games", title: "Drill Bench: Evasion, Regime, Position", bridged: true },
  // 2.4's optional labs are unbridged on the course owner's instruction: they
  // record no completion, so a learner who reads the section and skips the lab
  // has still finished it.
  { id: "human-insiders", title: "Insider Report", bridged: false },
  { id: "human-reporting-protection", title: "On Paper", bridged: false },
  // Unbridged: a three-minute assignment inside 2.4.2's prose, and nothing it
  // could record would mean "2.4.2 read".
  { id: "whistleblower-levers", title: "Four Levers, One Each", bridged: false },
  { id: "human-audits-inspections", title: "Four Sources", bridged: false },
  // Read in 2.4.2 since 2026-08-15, authored for 2.4.4 — the id is a progress
  // key and stays. Bridged because it is the one block in 2.4 with a real
  // finish (three tabs committed) and is not optional; it is embedded in
  // prose, so per the note at the top of this file that finish marks the
  // exercise and completes no section.
  { id: "human-institutions-judgment", title: "Companies A and B", bridged: true },
  // 2.4.4's optional closer, per the owner's brief: one 15-minute exercise
  // over all four of the section's objectives. Optional, so unbridged.
  { id: "standard-of-proof", title: "The Standard of Proof", bridged: false },
  // The Carlson reading's transfer interactive, built first at the owner's
  // request: required reading-work outside any fold, but
  // reflection, not a finish event — unbridged.
  { id: "missing-board", title: "The Missing Board", bridged: false },
  // Stood down 2026-08-14, widgets and data kept: report-access ("One Report,
  // Four Ways"), whose controlled variation became 2.4.3 itself; and the
  // generic companies-ab, whose comparison 2.4.4 now runs on two real
  // companies instead.
  { id: "cloud-evidence-drill", title: "Cloud Evidence Drill", bridged: true },
];
export function getVerificationExercise(id: string): VerificationExerciseDef | undefined {
  return verificationExercises.find((e) => e.id === id);
}
/** Registry entry for a content-graph lesson id, if it hosts an interactive. */
export function getVerificationExerciseForLesson(
  lessonId: string,
): VerificationExerciseDef | undefined {
  return verificationExercises.find((e) => verificationLessonId(e.id) === lessonId);
}
/** Content-graph lesson id for an exercise id. */
export function verificationLessonId(id: string): string {
  return `v-${id}`;
}
