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
import { PolicyCost } from "./policy-cost";
import { PolicyPlot } from "./policy-plot";

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



  "policy-cost": PolicyCost,
  "policy-plot": PolicyPlot,
};

export function getVerificationWidget(
  id: string,
): ComponentType<VerificationWidgetProps> | undefined {
  return verificationWidgets[id];
}
