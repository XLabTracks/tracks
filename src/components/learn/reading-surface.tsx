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

  useEffect(() => {
    // Deliberate mount-time re-render, as in the parts reader: the stored
    // preference exists only on the client, and reading it during render
    // would make the server and client markup disagree.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFocus(readFocusSettings());
    if (hostRef.current) markFocusWords(hostRef.current);
  }, []);

  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        <FocusReadingControl settings={focus} onChange={setFocus} />
      </div>
      <div ref={hostRef} data-reading-surface="" className={focusClassName(focus)}>
        {children}
      </div>
    </div>
  );
}
