"use client";

import { DRILLS_GAMES } from "@/lib/verification/data/drills-games";
import { DrillDeckView } from "../kit/drill-deck";
import type { VerificationWidgetProps } from "../kit/types";

export function DrillsGames(props: VerificationWidgetProps) {
  return <DrillDeckView {...props} deck={DRILLS_GAMES} />;
}
