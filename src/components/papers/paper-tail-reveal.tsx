"use client";

import { useEffect } from "react";
import {
  PAPER_GATE_OPEN_EVENT,
  PAPER_GATE_OPEN_VALUE,
  paperGateStorageKey,
} from "@/lib/papers/gate-state";

/**
 * Un-suppresses the gated tail's canonical footnotes section once EVERY
 * reading gate of the paper is open. While any gate is closed,
 * paper-reader.css hides the section (a visible bottom dump would spoil
 * every gated note at once); with all gates open there is nothing left to
 * spoil, and the canonical section is the only footnote surface where the
 * sidenote rail can't render (viewports below lg, narrow gutters) and for
 * assistive tech (the sidenote layer is aria-hidden).
 *
 * Same state contract as the locked sidebar rows: persisted opens read from
 * localStorage on mount, live opens arrive via PAPER_GATE_OPEN_EVENT (whose
 * detail carries the storage key, so the reveal works even where
 * localStorage is unavailable). Direct DOM class toggle — the tail html
 * never crosses into a client component (PaperSidenotes pattern), so there
 * is nothing to re-render.
 */
export function PaperTailReveal({
  paperId,
  gateIds,
}: {
  paperId: string;
  gateIds: string[];
}) {
  useEffect(() => {
    const keys = gateIds.map((gateId) => paperGateStorageKey(paperId, gateId));
    const openedThisVisit = new Set<string>();
    const isOpen = (key: string): boolean => {
      if (openedThisVisit.has(key)) return true;
      try {
        return window.localStorage.getItem(key) === PAPER_GATE_OPEN_VALUE;
      } catch {
        return false; // storage unavailable — event-detail keys still count
      }
    };
    const reveal = () => {
      if (!keys.every(isOpen)) return;
      for (const el of document.querySelectorAll(".paper-gated-tail")) {
        el.classList.add("paper-tail-open");
      }
      window.removeEventListener(PAPER_GATE_OPEN_EVENT, onGateOpen);
    };
    const onGateOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ storageKey?: string }>).detail;
      if (detail?.storageKey) openedThisVisit.add(detail.storageKey);
      reveal();
    };
    window.addEventListener(PAPER_GATE_OPEN_EVENT, onGateOpen);
    reveal();
    return () => window.removeEventListener(PAPER_GATE_OPEN_EVENT, onGateOpen);
  }, [paperId, gateIds]);
  return null;
}
