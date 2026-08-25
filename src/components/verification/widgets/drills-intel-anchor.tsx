"use client";

import { DRILLS_INTEL_ANCHOR } from "@/lib/verification/data/drills-intel-anchor";
import { DrillDeckView } from "../kit/drill-deck";
import type { VerificationWidgetProps } from "../kit/types";

export function DrillsIntelAnchor(props: VerificationWidgetProps) {
  return <DrillDeckView {...props} deck={DRILLS_INTEL_ANCHOR} />;
}
