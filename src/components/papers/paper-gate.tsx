"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import {
  PAPER_GATE_OPEN_EVENT,
  paperGateDomId,
  paperGateStorageKey,
} from "@/lib/papers/gate-state";
import { Button } from "@/components/ui/button";

/**
 * A reading gate inside a paper (from a `{op: "gate"}` edit): everything
 * below the gate is withheld until the learner taps through. The optional
 * think-first prompt arrives as an already-server-rendered node (`prompt`),
 * as do the gated parts (`children`) — this component never receives
 * artifact or markdown HTML as strings, preserving the reader's
 * "dangerouslySetInnerHTML stays in the server component" invariant.
 *
 * Deliberately friction, not enforcement: the gated content ships in the
 * payload, and the opened state lives in localStorage only (no auth, no
 * server round-trip). Revisits re-open previously opened gates in a
 * mount-time layout effect (before paint, so no collapsed flash) — the
 * server render stays user-independent.
 */
export function PaperGate({
  paperId,
  gateId,
  cta,
  prompt,
  children,
}: {
  paperId: string;
  gateId: string;
  cta?: string;
  prompt?: React.ReactNode;
  children: React.ReactNode;
}) {
  const storageKey = paperGateStorageKey(paperId, gateId);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    // One deliberate mount-time re-render, before paint: localStorage is
    // unreadable during SSR/hydration (same idiom as SidenotesToggle).
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (window.localStorage.getItem(storageKey) === "open") setOpen(true);
    } catch {
      // Storage unavailable (private mode etc.) — gate just won't persist.
    }
  }, [storageKey]);

  const openGate = useCallback(() => {
    setOpen(true);
    try {
      window.localStorage.setItem(storageKey, "open");
    } catch {
      // Non-fatal: the reveal still happens for this visit.
    }
    // Same-page listeners (locked sidebar rows, the completion tracker)
    // re-check gate state on this — the browser's `storage` event fires only
    // in other tabs.
    window.dispatchEvent(
      new CustomEvent(PAPER_GATE_OPEN_EVENT, { detail: { storageKey } }),
    );
  }, [storageKey]);

  // A bare gate's card is pure button chrome — once opened there is nothing
  // left to say, so it disappears instead of lingering as an empty eyebrow.
  // Prompted gates keep their card: the think-first question stays meaningful
  // context above the revealed text.
  if (open && !prompt) return <>{children}</>;

  return (
    <>
      <div
        // Locked sidebar rows scroll here (block: "center", so no
        // sticky-header scroll-margin needed).
        id={paperGateDomId(gateId)}
        className="border-primary/25 bg-primary/[0.03] my-8 rounded-xl border px-5 py-4"
      >
        <p className="text-primary/75 flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
          <Sparkles className="size-3.5" aria-hidden />
          Before you read on
        </p>
        {prompt ? <div className="mt-1.5">{prompt}</div> : null}
        {!open && (
          <div className="mt-3">
            <Button variant="outline" size="sm" onClick={openGate}>
              {cta ?? "Tap to continue"}
              <ChevronDown className="size-4" aria-hidden />
            </Button>
          </div>
        )}
      </div>
      {open ? children : null}
    </>
  );
}
