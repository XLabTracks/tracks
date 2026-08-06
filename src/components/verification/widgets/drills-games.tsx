"use client";

import { DRILLS_GAMES } from "@/lib/verification/data/drills-games";
import { DrillDeckView } from "../kit/drill-deck";
import type { VerificationWidgetProps } from "../kit/types";

/** Evasion, regime and position benches — module 3, module 4, and the capstone prep. */
export function DrillsGames(props: VerificationWidgetProps) {
  return <DrillDeckView {...props} deck={DRILLS_GAMES} />;
}
