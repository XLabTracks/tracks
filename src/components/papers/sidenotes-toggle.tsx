"use client";

import { useLayoutEffect, useState } from "react";
import { PanelRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SIDENOTES_EVENT,
  SIDENOTES_PREF_KEY,
  sidenotesEnabled,
} from "./paper-sidenotes";

/**
 * Preference switch for margin sidenotes, shown in a paper page's header
 * when the paper has footnotes. The preference is global (localStorage) and
 * takes effect immediately on every open reader via SIDENOTES_EVENT; the
 * layer still yields to geometry — on narrow viewports footnotes stay at
 * the bottom regardless, which is also why the control hides below lg.
 */
export function SidenotesToggle() {
  const [on, setOn] = useState(true);

  useLayoutEffect(() => {
    // One deliberate mount-time re-render, before paint: localStorage is
    // unreadable during SSR/hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOn(sidenotesEnabled());
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    try {
      if (next) window.localStorage.removeItem(SIDENOTES_PREF_KEY);
      else window.localStorage.setItem(SIDENOTES_PREF_KEY, "off");
    } catch {
      // Storage unavailable — the change still applies this visit.
    }
    window.dispatchEvent(new Event(SIDENOTES_EVENT));
  };

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={toggle}
      title="Show footnotes in the margin when there's room"
      className={cn(
        "hover:text-destructive hidden items-center gap-1 text-xs transition-colors lg:inline-flex",
        on ? "text-foreground" : "text-muted-foreground",
      )}
    >
      <PanelRight className="size-3.5" aria-hidden />
      Sidenotes {on ? "on" : "off"}
    </button>
  );
}
