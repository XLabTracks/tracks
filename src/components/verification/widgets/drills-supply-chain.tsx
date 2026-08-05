"use client";

import { DRILLS_SUPPLY_CHAIN } from "@/lib/verification/data/drills-supply-chain";
import { DrillDeckView } from "../kit/drill-deck";
import type { VerificationWidgetProps } from "../kit/types";

/** Supply-chain drill bench — the mechanism layers, hardware, cloud, secrets and people. */
export function DrillsSupplyChain(props: VerificationWidgetProps) {
  return <DrillDeckView {...props} deck={DRILLS_SUPPLY_CHAIN} />;
}
