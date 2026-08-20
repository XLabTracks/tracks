"use client";

import dynamic from "next/dynamic";

// Keep the server-side exercise dispatcher small. Each interaction family is
// downloaded only when an authored exercise of that type is actually rendered.
// This matters especially for Verification lessons, which otherwise inherited
// every exercise implementation through the shared MDX component registry.
export const AllocationExerciseCard = dynamic(() =>
  import("@/components/exercises/allocation-exercise").then(
    (module) => module.AllocationExerciseCard,
  ),
);

export const ArgueRevealExerciseCard = dynamic(() =>
  import("@/components/exercises/argue-reveal-exercise").then(
    (module) => module.ArgueRevealExerciseCard,
  ),
);

export const ChoiceExerciseCard = dynamic(() =>
  import("@/components/exercises/choice-exercise").then(
    (module) => module.ChoiceExerciseCard,
  ),
);

export const CommitConstructCard = dynamic(() =>
  import("@/components/exercises/commit-construct-exercise").then(
    (module) => module.CommitConstructCard,
  ),
);

export const ControlScenariosCard = dynamic(() =>
  import("@/components/exercises/control-scenarios-exercise").then(
    (module) => module.ControlScenariosCard,
  ),
);

export const FlowchartExerciseCard = dynamic(() =>
  import("@/components/exercises/flowchart-exercise").then(
    (module) => module.FlowchartExerciseCard,
  ),
);

export const StagedQuestionsCard = dynamic(() =>
  import("@/components/exercises/staged-questions-exercise").then(
    (module) => module.StagedQuestionsCard,
  ),
);

export const TapRevealCard = dynamic(() =>
  import("@/components/exercises/tap-reveal-exercise").then(
    (module) => module.TapRevealCard,
  ),
);

export const UnderstandingCheckCard = dynamic(() =>
  import("@/components/exercises/understanding-check").then(
    (module) => module.UnderstandingCheckCard,
  ),
);

export const WritingExerciseCard = dynamic(() =>
  import("@/components/exercises/writing-exercise").then(
    (module) => module.WritingExerciseCard,
  ),
);
