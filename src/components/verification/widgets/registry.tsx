import dynamic from "next/dynamic";
import type { ComponentType } from "react";

import type { VerificationWidgetProps } from "../kit/types";

function WidgetLoading() {
  return (
    <div
      className="not-prose border-border bg-card text-muted-foreground my-6 rounded-xl border p-6 text-sm"
      role="status"
    >
      Loading interactive…
    </div>
  );
}

const PolicyScoping = dynamic<VerificationWidgetProps>(
  () => import("./policy-scoping").then((module) => module.PolicyScoping),
  { loading: WidgetLoading },
);
const AnatomyDrill = dynamic<VerificationWidgetProps>(
  () => import("./anatomy-drill").then((module) => module.AnatomyDrill),
  { loading: WidgetLoading },
);
const ProtocolActors = dynamic<VerificationWidgetProps>(
  () => import("./protocol-actors").then((module) => module.ProtocolActors),
  { loading: WidgetLoading },
);
const ReportConstructor = dynamic<VerificationWidgetProps>(
  () => import("./report-constructor").then((module) => module.ReportConstructor),
  { loading: WidgetLoading },
);
const InteractiveMap = dynamic<VerificationWidgetProps>(
  () => import("./interactive-map").then((module) => module.InteractiveMap),
  { loading: WidgetLoading },
);
const VerificationLandscape = dynamic<VerificationWidgetProps>(
  () => import("./verification-landscape").then((module) => module.VerificationLandscape),
  { loading: WidgetLoading },
);
const CollectionMap = dynamic<VerificationWidgetProps>(
  () => import("./collection-map").then((module) => module.CollectionMap),
  { loading: WidgetLoading },
);
const ContextDistiller = dynamic<VerificationWidgetProps>(
  () => import("./context-distiller").then((module) => module.ContextDistiller),
  { loading: WidgetLoading },
);
const DrillsFoundations = dynamic<VerificationWidgetProps>(
  () => import("./drills-foundations").then((module) => module.DrillsFoundations),
  { loading: WidgetLoading },
);
const DrillsGames = dynamic<VerificationWidgetProps>(
  () => import("./drills-games").then((module) => module.DrillsGames),
  { loading: WidgetLoading },
);
const DrillsPrimers = dynamic<VerificationWidgetProps>(
  () => import("./drills-primers").then((module) => module.DrillsPrimers),
  { loading: WidgetLoading },
);
const PolicyCost = dynamic<VerificationWidgetProps>(
  () => import("./policy-cost").then((module) => module.PolicyCost),
  { loading: WidgetLoading },
);
const PolicyPlot = dynamic<VerificationWidgetProps>(
  () => import("./policy-plot").then((module) => module.PolicyPlot),
  { loading: WidgetLoading },
);
const MechanismSort = dynamic<VerificationWidgetProps>(
  () => import("./mechanism-sort").then((module) => module.MechanismSort),
  { loading: WidgetLoading },
);
const MechanismSortReveal = dynamic<VerificationWidgetProps>(
  () => import("./mechanism-sort").then((module) => module.MechanismSortReveal),
  { loading: WidgetLoading },
);
const PacketTasks = dynamic<VerificationWidgetProps>(
  () => import("./packet-tasks").then((module) => module.PacketTasks),
  { loading: WidgetLoading },
);
const WhatDoTheySay = dynamic<VerificationWidgetProps>(
  () => import("./what-do-they-say").then((module) => module.WhatDoTheySay),
  { loading: WidgetLoading },
);
const TypesOfAi = dynamic<VerificationWidgetProps>(
  () => import("./types-of-ai").then((module) => module.TypesOfAi),
  { loading: WidgetLoading },
);
const ShortHistory = dynamic<VerificationWidgetProps>(
  () => import("./short-history").then((module) => module.ShortHistory),
  { loading: WidgetLoading },
);
const TheoriesOfChange = dynamic<VerificationWidgetProps>(
  () => import("./theories-of-change").then((module) => module.TheoriesOfChange),
  { loading: WidgetLoading },
);
const ComputeVerificationQuestions = dynamic<VerificationWidgetProps>(
  () =>
    import("./compute-verification").then((module) => module.ComputeVerificationQuestions),
  { loading: WidgetLoading },
);
const TreatyWorkspace = dynamic<VerificationWidgetProps>(
  () => import("./treaty-workspace").then((module) => module.TreatyWorkspace),
  { loading: WidgetLoading },
);
const VerificationProblem = dynamic<VerificationWidgetProps>(
  () => import("./verification-problem").then((module) => module.VerificationProblem),
  { loading: WidgetLoading },
);
const EvidenceTaxonomies = dynamic<VerificationWidgetProps>(
  () => import("./evidence-taxonomies").then((module) => module.EvidenceTaxonomies),
  { loading: WidgetLoading },
);
const ActorMap = dynamic<VerificationWidgetProps>(
  () => import("./actor-map").then((module) => module.ActorMap),
  { loading: WidgetLoading },
);
const FieldMap = dynamic<VerificationWidgetProps>(
  () => import("./field-map").then((module) => module.FieldMap),
  { loading: WidgetLoading },
);
// 2.4.1's exercise is now Construct a Case; the id stays so the lesson
// mapping, the progress key and the section's finish event do not move.
// human-insiders.tsx and its engine remain in the repo, unmounted.
const ConstructCase = dynamic<VerificationWidgetProps>(
  () => import("./construct-case").then((module) => module.ConstructCase),
  { loading: WidgetLoading },
);
// 2.4.2's exercise is now Read the Rules, Infer the System; the id stays so
// the lesson mapping, the progress key and the finish event do not move.
// human-reporting-protection.tsx (the route reconstruction) and its data and
// engine remain in the repo, unmounted.
const InferTheSystem = dynamic<VerificationWidgetProps>(
  () => import("./infer-the-system").then((module) => module.InferTheSystem),
  { loading: WidgetLoading },
);
const WhistleblowerLevers = dynamic<VerificationWidgetProps>(
  () =>
    import("./whistleblower-levers").then(
      (module) => module.WhistleblowerLevers,
    ),
  { loading: WidgetLoading },
);
const PolicyOnPaper = dynamic<VerificationWidgetProps>(
  () => import("./policy-on-paper").then((module) => module.PolicyOnPaper),
  { loading: WidgetLoading },
);
// 2.4.3's exercise is now Same Claim, Different Circumstances; the id stays
// so the lesson mapping, the progress key and the finish event do not move.
// The decision lab it shared with 2.4.4 remains in the repo, unmounted here.
const SameClaim = dynamic<VerificationWidgetProps>(
  () => import("./same-claim").then((module) => module.SameClaim),
  { loading: WidgetLoading },
);
// 2.4.4's exercise is now Build the Institution; the id stays so the lesson
// mapping, the progress key and the finish event do not move.
const BuildInstitution = dynamic<VerificationWidgetProps>(
  () => import("./build-institution").then((module) => module.BuildInstitution),
  { loading: WidgetLoading },
);
const CloudEvidenceDrill = dynamic<VerificationWidgetProps>(
  () =>
    import("./cloud-evidence-drill").then(
      (module) => module.CloudEvidenceDrill,
    ),
  { loading: WidgetLoading },
);

/**
 * Native React widgets ported from the standalone HTML pages, keyed by the same
 * page id used in `src/lib/verification/exercises.ts`. Every import is its own
 * chunk: opening one lesson must not download all widget datasets in the
 * track. Ids not present here fall back to the legacy iframe host.
 */
export const verificationWidgets: Record<
  string,
  ComponentType<VerificationWidgetProps>
> = {
  "policy-scoping": PolicyScoping,
  "anatomy-drill": AnatomyDrill,
  "protocol-actors": ProtocolActors,
  "report-constructor": ReportConstructor,
  "interactive-map": InteractiveMap,
  "verification-landscape": VerificationLandscape,
  "collection-map": CollectionMap,
  "context-distiller": ContextDistiller,
  "drills-primers": DrillsPrimers,
  "drills-foundations": DrillsFoundations,
  "drills-games": DrillsGames,
  "policy-cost": PolicyCost,
  "policy-plot": PolicyPlot,
  "mechanism-sort": MechanismSort,
  "mechanism-sort-reveal": MechanismSortReveal,
  "packet-tasks": PacketTasks,
  "treaty-workspace": TreatyWorkspace,
  "compute-verification": ComputeVerificationQuestions,
  "what-do-they-say": WhatDoTheySay,
  "types-of-ai": TypesOfAi,
  "short-history": ShortHistory,
  "theories-of-change": TheoriesOfChange,
  "verification-problem": VerificationProblem,
  "evidence-taxonomies": EvidenceTaxonomies,
  "actor-map": ActorMap,
  "field-map": FieldMap,
  "human-insiders": ConstructCase,
  "human-reporting-protection": InferTheSystem,
  "whistleblower-levers": WhistleblowerLevers,
  "human-audits-inspections": SameClaim,
  "human-institutions-judgment": BuildInstitution,
  "policy-on-paper": PolicyOnPaper,
  "cloud-evidence-drill": CloudEvidenceDrill,
};

export function getVerificationWidget(
  id: string,
): ComponentType<VerificationWidgetProps> | undefined {
  return verificationWidgets[id];
}
