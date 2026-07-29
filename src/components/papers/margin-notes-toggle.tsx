"use client";

import { useLayoutEffect, useState } from "react";
import { StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";

// Preference contract for the margin-note layer in paper-highlights.tsx —
// same shape as the footnote sidenotes preference (paper-sidenotes.tsx):
// absent = on (default), "off" = off, same-tab changes broadcast via the
// event, cross-tab via the browser's own storage event.

export const MARGIN_NOTES_PREF_KEY = "tracks:margin-notes";
export const MARGIN_NOTES_EVENT = "tracks:margin-notes-change";

export function marginNotesEnabled(): boolean {
  try {
    return window.localStorage.getItem(MARGIN_NOTES_PREF_KEY) !== "off";
  } catch {
    return true;
  }
}

/**
 * Preference switch for showing the reader's own highlight notes as margin
 * comments, shown in a paper page's header for signed-in readers. Global
 * (localStorage), effective immediately via MARGIN_NOTES_EVENT; the layer
 * still yields to geometry — on narrow viewports notes live only in the
 * highlights panel regardless, which is also why the control hides below lg.
 */
export function MarginNotesToggle() {
  const [on, setOn] = useState(true);

  useLayoutEffect(() => {
    // One deliberate mount-time re-render, before paint: localStorage is
    // unreadable during SSR/hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOn(marginNotesEnabled());
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    try {
      if (next) window.localStorage.removeItem(MARGIN_NOTES_PREF_KEY);
      else window.localStorage.setItem(MARGIN_NOTES_PREF_KEY, "off");
    } catch {
      // Storage unavailable — the change still applies this visit.
    }
    window.dispatchEvent(new Event(MARGIN_NOTES_EVENT));
  };

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={toggle}
      title="Show your highlight notes in the margin when there's room"
      className={cn(
        "hover:text-destructive hidden items-center gap-1 text-xs transition-colors lg:inline-flex",
        on ? "text-foreground" : "text-muted-foreground",
      )}
    >
      <StickyNote className="size-3.5" aria-hidden />
      My notes {on ? "on" : "off"}
    </button>
  );
}
