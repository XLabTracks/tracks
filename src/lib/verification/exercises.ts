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
 * `id` is the widget id; the matching content-graph lesson id is always
 * `v-<id>` (enforced by src/lib/verification/widgets.test.ts).
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
  { id: "collection-map", title: "The Collection Map", bridged: false },
  { id: "verification-landscape", title: "The Verification Landscape", bridged: false },
  { id: "policy-cost", title: "Everything Comes With a Cost", bridged: false },
  { id: "policy-plot", title: "Effectiveness x Feasibility", bridged: false },
  { id: "mechanism-sort", title: "Place Your Bets — Mechanism Sort", bridged: false },
  { id: "mechanism-sort-reveal", title: "The Reference Map", bridged: false },
  { id: "policy-scoping", title: "Scoping an Anti-ASI Policy", bridged: true },
  { id: "anatomy-drill", title: "The Anatomy Drill", bridged: true },
  { id: "protocol-actors", title: "Who's in the Treaty?", bridged: true },
  { id: "interactive-map", title: "The Compute Supply Chain", bridged: false },
  { id: "report-constructor", title: "One Inspection, Three Readers", bridged: true },
  { id: "context-distiller", title: "The Distiller", bridged: true },
  { id: "what-do-they-say", title: "Why Are We Concerned About Superintelligence?", bridged: false },
  { id: "types-of-ai", title: "The Types of AI", bridged: false },
  { id: "short-history", title: "A Short History of Acceleration", bridged: false },
  { id: "precedent-cases", title: "Did the Regime Hold?", bridged: true },
  // The drill benches. Bridged: the deck reports complete when the last step
  // of its last bench is committed.
  { id: "drills-primers", title: "Drill Bench: Primers", bridged: true },
  { id: "drills-foundations", title: "Drill Bench: Foundations and Actors", bridged: true },
  { id: "drills-supply-chain", title: "Drill Bench: Evidence Streams", bridged: true },
  { id: "drills-games", title: "Drill Bench: Evasion, Regime, Position", bridged: true },
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
