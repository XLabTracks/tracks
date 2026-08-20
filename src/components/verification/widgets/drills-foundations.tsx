"use client";

import { DRILLS_FOUNDATIONS } from "@/lib/verification/data/drills-foundations";
import { DrillDeckView } from "../kit/drill-deck";
import type { VerificationWidgetProps } from "../kit/types";

/** Foundations, actors and spine benches — modules 0 and 1, plus the seven bones the whole track hangs on. */
export function DrillsFoundations(props: VerificationWidgetProps) {
  return <DrillDeckView {...props} deck={DRILLS_FOUNDATIONS} />;
}
