import type { ComponentType } from "react";
import type { VerificationWidgetProps } from "../kit/types";
import { PolicyScoping } from "./policy-scoping";
import { AnatomyDrill } from "./anatomy-drill";
import { ProtocolActors } from "./protocol-actors";
import { ReportConstructor } from "./report-constructor";
import { VerificationTimelineGame } from "./verification-timeline-game";
import { InteractiveMap } from "./interactive-map";
import { VerificationLandscape } from "./verification-landscape";
import { CollectionMap } from "./collection-map";
import { DrillsFoundations } from "./drills-foundations";
import { DrillsGames } from "./drills-games";
import { DrillsPrimers } from "./drills-primers";
import { DrillsSupplyChain } from "./drills-supply-chain";

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
  "verification-timeline-game": VerificationTimelineGame,
  "interactive-map": InteractiveMap,
  "verification-landscape": VerificationLandscape,
  "collection-map": CollectionMap,
  // Each deck is a menu of that module's benches; the renderer and the
  // judgements are shared (kit/drill-deck.tsx, engines/drills.ts).
  "drills-primers": DrillsPrimers,
  "drills-foundations": DrillsFoundations,
  "drills-supply-chain": DrillsSupplyChain,
  "drills-games": DrillsGames,
};

export function getVerificationWidget(
  id: string,
): ComponentType<VerificationWidgetProps> | undefined {
  return verificationWidgets[id];
}
