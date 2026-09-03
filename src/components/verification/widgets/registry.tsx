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
const ActorEdges = dynamic<VerificationWidgetProps>(
  () => import("./actor-edges").then((module) => module.ActorEdges),
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
const ConstructCase = dynamic<VerificationWidgetProps>(
  () => import("./construct-case").then((module) => module.ConstructCase),
  { loading: WidgetLoading },
);
const PolicyQuickCheck = dynamic<VerificationWidgetProps>(
  () =>
    import("./policy-quick-check").then((module) => module.PolicyQuickCheck),
  { loading: WidgetLoading },
);
const WhistleblowerLevers = dynamic<VerificationWidgetProps>(
  () =>
    import("./whistleblower-levers").then(
      (module) => module.WhistleblowerLevers,
    ),
  { loading: WidgetLoading },
);
const SameClaim = dynamic<VerificationWidgetProps>(
  () => import("./same-claim").then((module) => module.SameClaim),
  { loading: WidgetLoading },
);
const PolicyOnPaper = dynamic<VerificationWidgetProps>(
  () => import("./policy-on-paper").then((module) => module.PolicyOnPaper),
  { loading: WidgetLoading },
);
const CloudEvidenceDrill = dynamic<VerificationWidgetProps>(
  () =>
    import("./cloud-evidence-drill").then(
      (module) => module.CloudEvidenceDrill,
    ),
  { loading: WidgetLoading },
);
const StandardOfProof = dynamic<VerificationWidgetProps>(
  () => import("./standard-of-proof").then((module) => module.StandardOfProof),
  { loading: WidgetLoading },
);
const MissingBoard = dynamic<VerificationWidgetProps>(
  () => import("./missing-board").then((module) => module.MissingBoard),
  { loading: WidgetLoading },
);
const DrillsIntelSignatures = dynamic<VerificationWidgetProps>(
  () =>
    import("./drills-intel-signatures").then(
      (module) => module.DrillsIntelSignatures,
    ),
  { loading: WidgetLoading },
);
const DrillsIntelAssessment = dynamic<VerificationWidgetProps>(
  () =>
    import("./drills-intel-assessment").then(
      (module) => module.DrillsIntelAssessment,
    ),
  { loading: WidgetLoading },
);
const DatacenterPower = dynamic<VerificationWidgetProps>(
  () => import("./datacenter-power").then((module) => module.DatacenterPower),
  { loading: WidgetLoading },
);
const LocatingCompute = dynamic<VerificationWidgetProps>(
  () => import("./locating-compute").then((module) => module.LocatingCompute),
  { loading: WidgetLoading },
);

export const verificationWidgets: Record<
  string,
  ComponentType<VerificationWidgetProps>
> = {
  "policy-scoping": PolicyScoping,
  "anatomy-drill": AnatomyDrill,
  "actor-edges": ActorEdges,
  "interactive-map": InteractiveMap,
  "verification-landscape": VerificationLandscape,
  "collection-map": CollectionMap,
  "context-distiller": ContextDistiller,
  "drills-primers": DrillsPrimers,
  "drills-games": DrillsGames,
  "drills-intel-signatures": DrillsIntelSignatures,
  "drills-intel-assessment": DrillsIntelAssessment,
  "datacenter-power": DatacenterPower,
  "locating-compute": LocatingCompute,
  "policy-cost": PolicyCost,
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
  "human-insiders": ConstructCase,
  "human-reporting-protection": PolicyQuickCheck,
  "whistleblower-levers": WhistleblowerLevers,
  "human-audits-inspections": SameClaim,
  "human-institutions-judgment": PolicyOnPaper,
  "cloud-evidence-drill": CloudEvidenceDrill,
  "standard-of-proof": StandardOfProof,
  "missing-board": MissingBoard,
};
