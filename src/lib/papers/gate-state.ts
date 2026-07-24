import type { PaperEdit } from "@/lib/content/types";

// The reading-gate state contract shared by PaperGate (which owns the state),
// the sidebar's locked nav rows, and the paper page's completion tracker.
// Kept out of paper-gate.tsx so server components can import the key/id
// scheme without pulling in a "use client" module.

/** localStorage key persisting a gate's opened state (client-side only). */
export function paperGateStorageKey(paperId: string, gateId: string): string {
  return `tracks:paper-gate:${paperId}:${gateId}`;
}

/** DOM id of a gate's card while closed — locked sidebar rows scroll to it. */
export function paperGateDomId(gateId: string): string {
  return `paper-gate-${gateId}`;
}

/**
 * Window event PaperGate dispatches after opening, with the gate's storage
 * key in `detail.storageKey`. Same-page listeners re-read gate state on it —
 * the browser's own `storage` event fires only in OTHER tabs, and the event
 * detail keeps working even where localStorage is unavailable.
 */
export const PAPER_GATE_OPEN_EVENT = "tracks:paper-gate-open";

/** The gate ids of a paper's edits, in edits-array (= reading) order. */
export function gateIdsOf(edits: PaperEdit[] | undefined): string[] {
  return (edits ?? []).flatMap((edit) => (edit.op === "gate" ? [edit.id] : []));
}
