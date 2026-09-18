"use client";

import { ARCHITECTURE_SORT } from "@/lib/verification/data/architecture-sort";
import { SortBoardView } from "../kit/sort-board";
import type { VerificationWidgetProps } from "../kit/types";

export function ArchitectureSort(props: VerificationWidgetProps) {
  return <SortBoardView {...props} board={ARCHITECTURE_SORT} />;
}
