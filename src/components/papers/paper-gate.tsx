"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import { ChevronDown, PenLine, Sparkles } from "lucide-react";
import {
  PAPER_GATE_DEFAULT_MIN_CHARS,
  PAPER_GATE_OPEN_EVENT,
  paperGateDomId,
  paperGateResponseKey,
  paperGateStorageKey,
} from "@/lib/papers/gate-state";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/**
 * A reading gate inside a paper (from a `{op: "gate"}` edit): everything
 * below the gate is withheld until the learner taps through. The optional
 * think-first prompt arrives as an already-server-rendered node (`prompt`),
 * as do the gated parts (`children`) — this component never receives
 * artifact or markdown HTML as strings, preserving the reader's
 * "dangerouslySetInnerHTML stays in the server component" invariant.
 *
 * Written gates (`written`) additionally require a committed response: the
 * card carries a textarea and the continue button enables at `minChars`
 * trimmed characters. The committed text stays visible above the revealed
 * content on revisits, as the answer the learner compares against the paper.
 *
 * Deliberately friction, not enforcement: the gated content ships in the
 * payload, and all state (opened flag, written response) lives in
 * localStorage only (no auth, no server round-trip). Revisits restore state
 * in a mount-time layout effect (before paint, so no collapsed flash) — the
 * server render stays user-independent.
 */
export function PaperGate({
  paperId,
  gateId,
  cta,
  written,
  minChars,
  prompt,
  children,
}: {
  paperId: string;
  gateId: string;
  cta?: string;
  written?: boolean;
  minChars?: number;
  prompt?: React.ReactNode;
  children: React.ReactNode;
}) {
  const storageKey = paperGateStorageKey(paperId, gateId);
  const responseKey = paperGateResponseKey(paperId, gateId);
  const required = minChars ?? PAPER_GATE_DEFAULT_MIN_CHARS;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [committed, setCommitted] = useState<string | null>(null);

  useLayoutEffect(() => {
    // One deliberate mount-time re-render, before paint: localStorage is
    // unreadable during SSR/hydration (same idiom as SidenotesToggle).
    try {
      /* eslint-disable react-hooks/set-state-in-effect */
      if (window.localStorage.getItem(storageKey) === "open") setOpen(true);
      const stored = window.localStorage.getItem(responseKey);
      if (stored !== null) setCommitted(stored);
      /* eslint-enable react-hooks/set-state-in-effect */
    } catch {
      // Storage unavailable (private mode etc.) — gate just won't persist.
    }
  }, [storageKey, responseKey]);

  const openGate = useCallback(() => {
    const response = written ? draft.trim() : null;
    setOpen(true);
    if (response !== null) setCommitted(response);
    try {
      window.localStorage.setItem(storageKey, "open");
      if (response !== null) window.localStorage.setItem(responseKey, response);
    } catch {
      // Non-fatal: the reveal still happens for this visit.
    }
    // Same-page listeners (locked sidebar rows, the completion tracker)
    // re-check gate state on this — the browser's `storage` event fires only
    // in other tabs.
    window.dispatchEvent(
      new CustomEvent(PAPER_GATE_OPEN_EVENT, { detail: { storageKey } }),
    );
  }, [written, draft, storageKey, responseKey]);

  const remaining = required - draft.trim().length;

  // A bare gate's card is pure button chrome — once opened there is nothing
  // left to say, so it disappears instead of lingering as an empty eyebrow.
  // Prompted gates keep their card: the think-first question (and, for
  // written gates, the committed answer) stays meaningful context above the
  // revealed text.
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
          {written ? (
            <PenLine className="size-3.5" aria-hidden />
          ) : (
            <Sparkles className="size-3.5" aria-hidden />
          )}
          Before you read on
        </p>
        {prompt ? <div className="mt-1.5">{prompt}</div> : null}
        {written && open && committed !== null && (
          <div className="border-primary/20 bg-background/60 text-foreground mt-3 min-w-0 rounded-lg border px-3 py-2 text-sm whitespace-pre-wrap [overflow-wrap:anywhere]">
            {committed}
          </div>
        )}
        {!open && written && (
          <div className="mt-3">
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Write your answer here before continuing…"
              className="bg-background min-h-24"
            />
            <div className="mt-2 flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={remaining > 0}
                onClick={openGate}
              >
                {cta ?? "Submit and continue"}
                <ChevronDown className="size-4" aria-hidden />
              </Button>
              {remaining > 0 && (
                <span className="text-muted-foreground text-xs">
                  {remaining} more character{remaining === 1 ? "" : "s"} to go
                </span>
              )}
            </div>
          </div>
        )}
        {!open && !written && (
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
