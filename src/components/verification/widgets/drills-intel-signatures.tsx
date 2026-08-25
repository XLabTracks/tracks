"use client";

import { DRILLS_INTEL_SIGNATURES } from "@/lib/verification/data/drills-intel-signatures";
import { DrillDeckView } from "../kit/drill-deck";
import type { VerificationWidgetProps } from "../kit/types";

export function DrillsIntelSignatures(props: VerificationWidgetProps) {
  return <DrillDeckView {...props} deck={DRILLS_INTEL_SIGNATURES} />;
}
