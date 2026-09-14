"use client";

import { DRILLS_INTEL_ASSESSMENT } from "@/lib/verification/data/drills-intel-assessment";
import { DrillDeckView } from "../kit/drill-deck";
import type { VerificationWidgetProps } from "../kit/types";

export function DrillsIntelAssessment(props: VerificationWidgetProps) {
  return <DrillDeckView {...props} deck={DRILLS_INTEL_ASSESSMENT} />;
}
