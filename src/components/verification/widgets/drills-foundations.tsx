"use client";

import { DRILLS_FOUNDATIONS } from "@/lib/verification/data/drills-foundations";
import { DrillDeckView } from "../kit/drill-deck";
import type { VerificationWidgetProps } from "../kit/types";

export function DrillsFoundations(props: VerificationWidgetProps) {
  return <DrillDeckView {...props} deck={DRILLS_FOUNDATIONS} />;
}
