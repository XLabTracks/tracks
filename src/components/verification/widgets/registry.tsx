import type { ComponentType } from "react";
import type { VerificationWidgetProps } from "../kit/types";
import { PolicyScoping } from "./policy-scoping";
import { AnatomyDrill } from "./anatomy-drill";
import { ProtocolActors } from "./protocol-actors";
import { ReportConstructor } from "./report-constructor";
import { IrPrimer } from "./ir-primer";
import { InspectionGame } from "./inspection-game";
import { GameTheoryPrimer } from "./game-theory-primer";
import { VerificationTimelineGame } from "./verification-timeline-game";
import { InteractiveMap } from "./interactive-map";
import { VerificationLandscape } from "./verification-landscape";

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
  "ir-primer": IrPrimer,
  "inspection-game": InspectionGame,
  "game-theory-primer": GameTheoryPrimer,
  "verification-timeline-game": VerificationTimelineGame,
  "interactive-map": InteractiveMap,
  "verification-landscape": VerificationLandscape,
};

export function getVerificationWidget(
  id: string,
): ComponentType<VerificationWidgetProps> | undefined {
  return verificationWidgets[id];
}
