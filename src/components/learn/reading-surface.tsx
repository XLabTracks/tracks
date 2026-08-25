"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { FocusReadingControl } from "@/components/learn/focus-reading";
import {
  FOCUS_DEFAULTS,
  focusClassName,
  markFocusWords,
  readFocusSettings,
  type FocusSettings,
} from "@/lib/reading/focus-reading";

/**
 * The reading toolbar and the box it governs, for the plain (unchunked)
 * lesson layout. The Aa control used to live on the parts reader's toolbar
 * and left with the part-by-part regime; the owner wants it back, with the
 * e-reader text-size editor inside it — and the size applying ONLY to the
 * content in this box (the reading and the exercises), never the page
 * chrome.
 *
 * The division of labour: the control writes `data-text-scale` on the root
 * (state, boot-restored in layout.tsx before paint); the CSS in
 * theme.css/app-bridge.css re-solves the type tokens only inside
 * `[data-reading-surface]`, which is the div this component wraps the lesson
 * in. The h1, breadcrumbs, sidebar, buttons and footer sit outside and keep
 * their size. Contrast's global 200% low-vision preset is a different
 * selector and stays whole-page.
 *
 * Focus reading rides along unchanged: the body is marked once on mount
 * (markFocusWords — the text content never changes), and the setting is a
 * class toggle on this host.
 */
export function ReadingSurface({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<FocusSettings>(FOCUS_DEFAULTS);

  // Marking is idempotent (markFocusWords guards on data-focus-marked), so the
  // first time focus reading is switched on costs the walk and every change
  // after it is the class toggle it was always meant to be.
  const applyFocus = (next: FocusSettings) => {
    if (next.mode !== "off" && hostRef.current) markFocusWords(hostRef.current);
    setFocus(next);
  };

  useEffect(() => {
    // Deliberate mount-time re-render, as in the parts reader: the stored
    // preference exists only on the client, and reading it during render
    // would make the server and client markup disagree.
    const stored = readFocusSettings();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFocus(stored);
    // Only when the reader has actually asked for it. Marking unconditionally
    // wrapped every word of the lesson in a span on mount — 1,897 of them on a
    // long reading, a third of the whole document — on the main thread, for a
    // effect that defaults to off and that CSS then declines to show. That is
    // what a reader on a phone was watching: the top of the page painted, the
    // thread seized by the walk, and the rest arriving when it let go. The
    // pages with no reading surface, /verification/team among them, were the
    // ones that never showed it.
    if (stored.mode !== "off" && hostRef.current) {
      markFocusWords(hostRef.current);
    }
  }, []);

  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        <FocusReadingControl settings={focus} onChange={applyFocus} />
      </div>
      <div ref={hostRef} data-reading-surface="" className={focusClassName(focus)}>
        {children}
      </div>
    </div>
  );
}
