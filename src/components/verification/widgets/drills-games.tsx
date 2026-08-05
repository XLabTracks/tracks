"use client";

import { DRILLS_GAMES } from "@/lib/verification/data/drills-games";
import { DrillDeckView } from "../kit/drill-deck";
import type { VerificationWidgetProps } from "../kit/types";

/** Evasion & regime-design drill bench — the taxonomy, the skeptical memo, the position. */
export function DrillsGames(props: VerificationWidgetProps) {
  return <DrillDeckView {...props} deck={DRILLS_GAMES} />;
}
