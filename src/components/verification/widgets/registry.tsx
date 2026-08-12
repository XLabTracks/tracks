import type { ComponentType } from "react";
import type { VerificationWidgetProps } from "../kit/types";
import { PolicyScoping } from "./policy-scoping";
import { AnatomyDrill } from "./anatomy-drill";
import { ProtocolActors } from "./protocol-actors";
import { ReportConstructor } from "./report-constructor";
import { InteractiveMap } from "./interactive-map";
import { VerificationLandscape } from "./verification-landscape";
import { CollectionMap } from "./collection-map";
import { ContextDistiller } from "./context-distiller";
import { DrillsFoundations } from "./drills-foundations";
import { DrillsGames } from "./drills-games";
import { DrillsPrimers } from "./drills-primers";
import { DrillsSupplyChain } from "./drills-supply-chain";
import { PolicyCost } from "./policy-cost";
import { PolicyPlot } from "./policy-plot";
import { MechanismSort, MechanismSortReveal } from "./mechanism-sort";
import { NuclearDisanalysis } from "./nuclear-disanalysis";
import { PrecedentCases } from "./precedent-cases";
import { WhatDoTheySay } from "./what-do-they-say";
import { TypesOfAi } from "./types-of-ai";
import { ShortHistory } from "./short-history";
import { ComputeVerificationQuestions } from "./compute-verification";
import { TreatyWorkspace } from "./treaty-workspace";
import { VerificationProblem } from "./verification-problem";
import { EvidenceTaxonomies } from "./evidence-taxonomies";
import { ActorMap } from "./actor-map";
import { FieldMap } from "./field-map";

/**
 * Native React widgets ported from the standalone HTML pages, keyed by the same
 * page id used in `src/lib/verification/exercises.ts`. Ids not present here fall
 * back to the legacy iframe host (see verification-widget-host.tsx).
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
  // Each deck is a menu of that module's benches; the renderer and the
  // judgements are shared (kit/drill-deck.tsx, engines/drills.ts).
  "drills-primers": DrillsPrimers,
  "drills-foundations": DrillsFoundations,
  "drills-supply-chain": DrillsSupplyChain,
  "drills-games": DrillsGames,
  "policy-cost": PolicyCost,
  "policy-plot": PolicyPlot,
  // "Place your bets": rate + seal in 2.0, compare against the reference map
  // in 4.1. One renderer, a reveal prop; both share the vt-ex: storage key.
  "mechanism-sort": MechanismSort,
  "mechanism-sort-reveal": MechanismSortReveal,
  "precedent-cases": PrecedentCases,
  // 0.3's disanalysis task: write the inference, then Baker's own text lands
  // as the key. Registered beside the case files it follows.
  "nuclear-disanalysis": NuclearDisanalysis,
  "treaty-workspace": TreatyWorkspace,
  "compute-verification": ComputeVerificationQuestions,
  "what-do-they-say": WhatDoTheySay,
  "types-of-ai": TypesOfAi,
  "short-history": ShortHistory,
  "verification-problem": VerificationProblem,
  "evidence-taxonomies": EvidenceTaxonomies,
  "actor-map": ActorMap,
  "field-map": FieldMap,
};

export function getVerificationWidget(
  id: string,
): ComponentType<VerificationWidgetProps> | undefined {
  return verificationWidgets[id];
}
