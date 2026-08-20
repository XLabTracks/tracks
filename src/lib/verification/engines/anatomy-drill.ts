import {
  resolveDrop,
  type Card,
  type DropResult,
} from "@/lib/verification/data/anatomy-drill";

export { resolveDrop };
export type { DropResult };

export type CardResult = "clean" | "near" | "miss";

export type FeedbackKind =
  | "good"
  | "good-after"
  | "near"
  | "retry"
  | "reveal";

export interface DropOutcome {
  kind: FeedbackKind;
  msg: string;
  attempts: number;
  result: CardResult | null;
  autoPlaced: boolean;
  resolved: boolean;
}

export function applyDrop(
  card: Card,
  binN: number,
  attempts: number,
): DropOutcome {
  const r = resolveDrop(card, binN);

  if (r.kind === "clean") {
    return {
      kind: attempts === 0 ? "good" : "good-after",
      msg: card.ok,
      attempts,
      result: attempts === 0 ? "clean" : "miss",
      autoPlaced: false,
      resolved: true,
    };
  }

  if (r.kind === "near") {
    return {
      kind: "near",
      msg: r.msg ?? "",
      attempts,
      result: attempts === 0 ? "near" : "miss",
      autoPlaced: true,
      resolved: true,
    };
  }

  const nextAttempts = attempts + 1;
  if (nextAttempts >= 2) {
    return {
      kind: "reveal",
      msg: r.msg ?? "",
      attempts: nextAttempts,
      result: "miss",
      autoPlaced: true,
      resolved: true,
    };
  }
  return {
    kind: "retry",
    msg: r.msg ?? "",
    attempts: nextAttempts,
    result: null,
    autoPlaced: false,
    resolved: false,
  };
}
