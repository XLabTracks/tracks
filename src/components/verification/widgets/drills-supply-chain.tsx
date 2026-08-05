"use client";

import { DRILLS_SUPPLY_CHAIN } from "@/lib/verification/data/drills-supply-chain";
import { DrillDeckView } from "../kit/drill-deck";
import type { VerificationWidgetProps } from "../kit/types";

/** Layer, hardware, cloud and secrets-and-people benches — module 2 end to end. */
export function DrillsSupplyChain(props: VerificationWidgetProps) {
  return <DrillDeckView {...props} deck={DRILLS_SUPPLY_CHAIN} />;
}
