"use client";

import { useLayoutEffect, useState } from "react";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

// Preference contract for the read-only "class highlights" layer in
// paper-highlights.tsx: a classroom shares every member's noted highlights,
// and this switch shows them (painted in the text + as margin boxes) mixed
// in with the reader's own notes. Unlike the own-notes preference this
// defaults OFF — seeing classmates' annotations is opt-in — so the storage
// value is an explicit "on" rather than an absent-means-on. Same-tab changes
// broadcast via the event; cross-tab via the browser's storage event.

export const CLASS_HIGHLIGHTS_PREF_KEY = "tracks:class-highlights";
export const CLASS_HIGHLIGHTS_EVENT = "tracks:class-highlights-change";

export function classHighlightsEnabled(): boolean {
  try {
    return window.localStorage.getItem(CLASS_HIGHLIGHTS_PREF_KEY) === "on";
  } catch {
    return false;
  }
}

/**
 * View switch for a classroom's shared highlights, shown in a paper page's
 * header only when at least one classmate has a shared note on this item.
 * Global (localStorage), effective immediately via CLASS_HIGHLIGHTS_EVENT;
 * the layer still yields to geometry, so on narrow viewports the shared notes
 * live only in the highlights panel — which is why the control hides below lg.
 */
export function ClassHighlightsToggle() {
  const [on, setOn] = useState(false);

  useLayoutEffect(() => {
    // One deliberate mount-time re-render, before paint: localStorage is
    // unreadable during SSR/hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOn(classHighlightsEnabled());
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    try {
      if (next) window.localStorage.setItem(CLASS_HIGHLIGHTS_PREF_KEY, "on");
      else window.localStorage.removeItem(CLASS_HIGHLIGHTS_PREF_KEY);
    } catch {
      // Storage unavailable — the change still applies this visit.
    }
    window.dispatchEvent(new Event(CLASS_HIGHLIGHTS_EVENT));
  };

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={toggle}
      title="Show your classmates' shared highlights and notes in this paper"
      className={cn(
        "hover:text-destructive hidden items-center gap-1 text-xs transition-colors lg:inline-flex",
        on ? "text-foreground" : "text-muted-foreground",
      )}
    >
      <Users className="size-3.5" aria-hidden />
      Class notes {on ? "on" : "off"}
    </button>
  );
}
