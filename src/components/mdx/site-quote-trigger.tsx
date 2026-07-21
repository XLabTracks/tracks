"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import {
  useGlossHoverTimers,
  type GlossaryCardData,
} from "@/components/glossary/glossary-card";
import { GlossaryOverlay } from "@/components/glossary/glossary-overlay";

/**
 * Inline trigger for `<SiteQuote/>`: a real external link that previews a
 * verbatim excerpt in the shared glossary card machinery (same hover-intent
 * timers, margin-rail/popover placement, dismissal contract).
 *
 * Unlike the glossary trigger (a span[role=button] that only toggles), this
 * is an anchor with normal link semantics:
 * - mouse: hover-intent opens the preview; click navigates (new tab).
 * - touch/pen: the first tap opens the card instead of navigating
 *   (preventDefault) — the card's attribution link is the way through,
 *   since touch users can't hover. A second tap on the trigger closes it.
 * - keyboard: Enter follows the link (native anchor behavior); Space opens
 *   the card and moves focus into it, exactly like the glossary trigger, so
 *   Tab reaches the card's link and Escape hands focus back here.
 */
export function SiteQuoteTrigger({
  href,
  card,
  children,
}: {
  href: string;
  card: GlossaryCardData;
  children: ReactNode;
}) {
  // Callback-ref state (not a ref read during render): the overlay needs
  // the anchor element as a prop.
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const keyboardOpenRef = useRef(false);
  /** Pointer type of the pointerdown that produced the upcoming click. */
  const clickPointerTypeRef = useRef("");
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const timers = useGlossHoverTimers(
    useCallback(() => setOpen(true), []),
    close,
  );

  const toggle = () => {
    timers.cancel();
    setOpen((prev) => !prev);
  };
  const mouseOnly =
    (handler: () => void) => (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse") handler();
    };

  return (
    <>
      <a
        ref={setAnchorEl}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1"
        onPointerDown={(event) => {
          keyboardOpenRef.current = false;
          clickPointerTypeRef.current = event.pointerType;
        }}
        onClick={(event) => {
          const pointerType = clickPointerTypeRef.current;
          clickPointerTypeRef.current = "";
          // Touch can't hover: tapping toggles the preview card instead of
          // navigating. Mouse clicks and keyboard Enter (no preceding
          // pointerdown) fall through to normal anchor navigation.
          if (pointerType === "touch" || pointerType === "pen") {
            event.preventDefault();
            toggle();
          }
        }}
        onKeyDown={(event) => {
          // Enter is left alone — it follows the link. Space (inert on
          // anchors natively) opens the preview like the glossary trigger.
          if (event.key !== " ") return;
          event.preventDefault(); // Space must not scroll
          keyboardOpenRef.current = true;
          toggle();
        }}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") return;
          keyboardOpenRef.current = false; // hover opens never move focus
          timers.scheduleOpen();
        }}
        onPointerLeave={mouseOnly(timers.scheduleClose)}
      >
        {children}
        <ExternalLink
          aria-hidden
          className="ml-[0.2em] inline size-[0.7em] align-baseline"
        />
      </a>
      <GlossaryOverlay
        open={open}
        anchorEl={anchorEl}
        card={card}
        keyboardOpenRef={keyboardOpenRef}
        onClose={close}
        cancelClose={timers.cancel}
        scheduleClose={timers.scheduleClose}
      />
    </>
  );
}
