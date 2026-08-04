"use client";

import { useEffect } from "react";

/**
 * Companion layer for the collapsed tail sections (collapse-tail.ts): a
 * fragment link whose target sits inside a closed details.ax-collapse —
 * citations into References, footnote markers into Footnotes — opens the
 * block before the browser scrolls, so the jump always lands on visible
 * content. Delegated listeners only; the markup itself is server-rendered
 * native details and works without this layer (manual toggling).
 */
export function PaperCollapse() {
  useEffect(() => {
    const openFor = (id: string) => {
      if (!id) return;
      const target = document.getElementById(decodeURIComponent(id));
      for (
        let el = target?.closest("details.ax-collapse");
        el;
        el = el.parentElement?.closest("details.ax-collapse") ?? null
      ) {
        (el as HTMLDetailsElement).open = true;
      }
    };
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href*="#"]');
      const href = link?.getAttribute("href");
      const hash = href?.split("#")[1];
      if (hash) openFor(hash);
    };
    const onHash = () => openFor(window.location.hash.slice(1));
    // Capture phase: the details must open before the default scroll happens.
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", onHash);
    onHash();
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);
  return null;
}
