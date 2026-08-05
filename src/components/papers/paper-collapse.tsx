"use client";

import { useEffect } from "react";

/**
 * Companion layer for the collapsed tail sections (collapse-tail.ts): a
 * fragment link whose target sits inside a closed details.ax-collapse —
 * citations into References, footnote markers into Footnotes — opens the
 * block and re-scrolls to the target, so the jump always lands on visible
 * content even on engines whose fragment algorithm lacks the
 * ancestor-details-reveal step (there the native scroll runs against the
 * closed details and lands at the top). Printing opens every block for the
 * duration — a closed details prints as just its summary, silently dropping
 * references/appendix/footnotes — and restores the reader's state after.
 * Delegated listeners only; the markup itself is server-rendered native
 * details and works without this layer (manual toggling).
 */
export function PaperCollapse() {
  useEffect(() => {
    // Fragments aren't guaranteed valid percent-encoding ("#the-1%-rule"):
    // a throwing decodeURIComponent here would take the page to the route
    // error boundary (mount) or swallow the click — match the raw fragment
    // instead.
    const decode = (fragment: string): string => {
      try {
        return decodeURIComponent(fragment);
      } catch {
        return fragment;
      }
    };
    /** Opens every ancestor details of `id`'s target; true if any was closed. */
    const openFor = (id: string): boolean => {
      if (!id) return false;
      const target = document.getElementById(decode(id));
      let opened = false;
      for (
        let el = target?.closest("details.ax-collapse");
        el;
        el = el.parentElement?.closest("details.ax-collapse") ?? null
      ) {
        if (!(el as HTMLDetailsElement).open) {
          (el as HTMLDetailsElement).open = true;
          opened = true;
        }
      }
      return opened;
    };
    const reveal = (id: string) => {
      if (!openFor(id)) return; // already visible — the native scroll suffices
      // The browser's own fragment scroll ran while the details were still
      // closed (mount / hashchange) or runs right after this handler
      // (click) — re-scroll a frame later so the jump lands on the
      // now-visible target. scrollIntoView honors the anchors'
      // scroll-margin-top (paper-reader.css / arxiv-paper.css), the same
      // sticky-header clearance as a native fragment jump.
      requestAnimationFrame(() => {
        document.getElementById(decode(id))?.scrollIntoView();
      });
    };
    const onClick = (e: MouseEvent) => {
      // Act only when the browser itself will fragment-jump this page:
      // modified/non-primary clicks and links into another browsing context
      // or document navigate elsewhere — opening + re-scrolling here would
      // yank this tab's scroll position under the reader.
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const link = (e.target as Element | null)?.closest?.('a[href*="#"]');
      if (!link) return;
      const target = link.getAttribute("target");
      if (target && target !== "_self") return;
      const href = link.getAttribute("href");
      const hash = href?.split("#")[1];
      if (!href || !hash) return;
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return; // unparseable href — no fragment jump to compensate for
      }
      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        url.search !== window.location.search
      )
        return;
      reveal(hash);
    };
    const onHash = () => reveal(window.location.hash.slice(1));
    // Print: open every closed block for the print pass (remembering which
    // ones the reader had closed), restore afterward.
    let closedForPrint: HTMLDetailsElement[] = [];
    const onBeforePrint = () => {
      closedForPrint = [
        ...document.querySelectorAll<HTMLDetailsElement>(
          "details.ax-collapse:not([open])",
        ),
      ];
      for (const el of closedForPrint) el.open = true;
    };
    const onAfterPrint = () => {
      for (const el of closedForPrint) el.open = false;
      closedForPrint = [];
    };
    // Capture phase: the details must open before the default scroll happens.
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("afterprint", onAfterPrint);
    onHash();
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("afterprint", onAfterPrint);
    };
  }, []);
  return null;
}
