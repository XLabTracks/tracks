"use client";

import { DRILLS_PRIMERS } from "@/lib/verification/data/drills-primers";
import { DrillDeckView } from "../kit/drill-deck";
import type { VerificationWidgetProps } from "../kit/types";

export function DrillsPrimers(props: VerificationWidgetProps) {
  return <DrillDeckView {...props} deck={DRILLS_PRIMERS} />;
}
