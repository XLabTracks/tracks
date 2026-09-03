export interface VerificationExerciseDef {
  id: string;
  title: string;
  bridged: boolean;
}
export const verificationExercises: VerificationExerciseDef[] = [
  { id: "verification-problem", title: "The Verification Problem", bridged: false },
  { id: "evidence-taxonomies", title: "Five Maps of the Evidence", bridged: false },
  { id: "collection-map", title: "The Collection Map", bridged: false },
  { id: "verification-landscape", title: "The Verification Landscape", bridged: false },
  { id: "policy-cost", title: "Everything Comes With a Cost", bridged: false },
  { id: "mechanism-sort", title: "Place Your Bets — Mechanism Sort", bridged: false },
  { id: "mechanism-sort-reveal", title: "The Reference Map", bridged: false },
  { id: "policy-scoping", title: "Scoping an Anti-ASI Policy", bridged: true },
  { id: "anatomy-drill", title: "The Anatomy Drill", bridged: true },
  { id: "actor-edges", title: "Who can prove what", bridged: true },
  { id: "interactive-map", title: "The Compute Supply Chain", bridged: false },
  { id: "context-distiller", title: "The Distiller", bridged: true },
  { id: "what-do-they-say", title: "Why Are We Concerned About Superintelligence?", bridged: false },
  { id: "types-of-ai", title: "The Types of AI", bridged: false },
  { id: "short-history", title: "A Short History of AI Acceleration", bridged: false },
  { id: "theories-of-change", title: "Theory of Change for Your Favorite AI Safety Organization", bridged: false },
  { id: "packet-tasks", title: "Tasks on the Document Packet", bridged: true },
  { id: "treaty-workspace", title: "Anatomy of a (Pause) Agreement", bridged: true },
  { id: "compute-verification", title: "Questions on the Cankaya Working Paper", bridged: true },
  { id: "drills-primers", title: "Drill Bench: Primers", bridged: true },
  { id: "drills-games", title: "Drill Bench: Evasion, Regime, Position", bridged: true },
  { id: "human-insiders", title: "Insider Report", bridged: false },
  { id: "human-reporting-protection", title: "On Paper", bridged: false },
  { id: "whistleblower-levers", title: "Four Levers", bridged: false },
  { id: "human-audits-inspections", title: "Four Sources", bridged: false },
  { id: "human-institutions-judgment", title: "Companies A and B", bridged: true },
  { id: "standard-of-proof", title: "The Standard of Proof", bridged: false },
  { id: "missing-board", title: "The Missing Board", bridged: false },
  { id: "cloud-evidence-drill", title: "Cloud Evidence Drill", bridged: true },
  { id: "drills-intel-signatures", title: "Drill Bench: Power to Compute", bridged: true },
  {
    id: "drills-intel-assessment",
    title: "Drill Bench: Assessment",
    bridged: true,
  },
  { id: "datacenter-power", title: "The Power Signature", bridged: false },
  { id: "locating-compute", title: "The Feasibility Cards", bridged: false },
];
export function getVerificationExercise(id: string): VerificationExerciseDef | undefined {
  return verificationExercises.find((e) => e.id === id);
}
export function getVerificationExerciseForLesson(
  lessonId: string,
): VerificationExerciseDef | undefined {
  return verificationExercises.find((e) => verificationLessonId(e.id) === lessonId);
}
export function verificationLessonId(id: string): string {
  return `v-${id}`;
}
