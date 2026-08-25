"use client";

import { DRILLS_INTEL_INSTITUTIONS } from "@/lib/verification/data/drills-intel-institutions";
import { DrillDeckView } from "../kit/drill-deck";
import type { VerificationWidgetProps } from "../kit/types";

export function DrillsIntelInstitutions(props: VerificationWidgetProps) {
  return <DrillDeckView {...props} deck={DRILLS_INTEL_INSTITUTIONS} />;
}
