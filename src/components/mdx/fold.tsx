"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A folded block for material a lesson offers but does not require — closed
 * by default, opened from its header row. `<Fold label="…">` around ordinary
 * lesson markdown.
 *
 * The card is painted, never half-painted: the header row is a solid
 * --primary fill and the body carries the same hue as a tint, with all four
 * border edges alike. Closed — which is how it is usually met — the whole
 * card is that red bar.
 *
 * Trap: the header is a --primary *surface*, so everything on it writes in
 * --primary-foreground. Maroon is a fine ground and an unreadable ink on the
 * night theme, so nothing on this card may take --primary as a text colour.
 * The shell needs overflow-hidden: without it the solid fill squares off the
 * corners the border rounds. The marker is a plus (no chevrons), rotated
 * into an × while open; it is chrome — aria-hidden and select-none, like the
 * whole header row — and the motion is 200ms, off under
 * prefers-reduced-motion.
 *
 * The body is hidden, never unmounted: an embedded player or widget keeps
 * its state across folds. And the shell is not-prose, which strips the
 * typography rhythm from the markdown inside — the body utilities restore
 * it, the same set (and the same reasoning) as the Callout body.
 */
export interface FoldProps {
  label?: string;
  children: ReactNode;
}

export function Fold({ label = "Optional material", children }: FoldProps) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();
  const shellRef = useRef<HTMLElement>(null);

  /* The sidebar's "In this lesson" row (and any in-page link) reaches the
     fold as an anchor to the wrapper rehype-lesson-sections draws around it,
     and a row that lands on a closed card has not navigated anywhere — so a
     followed anchor targeting this fold opens it. A click listener rather
     than hashchange, for LessonPartsReader's reason: the router pushes hash
     navigations through pushState, which never fires hashchange. The mount
     check covers arriving with the hash already in the URL. */
  useEffect(() => {
    const targeted = (hash: string) => {
      if (!hash) return false;
      const target = document.getElementById(decodeURIComponent(hash));
      return (
        !!target &&
        !!shellRef.current &&
        (target === shellRef.current || target.contains(shellRef.current))
      );
    };
    if (targeted(location.hash.slice(1))) setOpen(true);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const hash = href.startsWith("#")
        ? href.slice(1)
        : (() => {
            try {
              const u = new URL(href, location.href);
              return u.pathname === location.pathname ? u.hash.slice(1) : "";
            } catch {
              return "";
            }
          })();
      if (targeted(hash)) setOpen(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <section
      ref={shellRef}
      className="not-prose border-primary bg-primary/8 my-6 overflow-hidden rounded-xl border"
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen(!open)}
        className="bg-primary text-primary-foreground flex w-full cursor-pointer items-center justify-between gap-3 p-4 text-left text-sm font-semibold select-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none focus-visible:ring-inset"
      >
        {label}
        <span
          aria-hidden
          className={cn(
            "text-primary-foreground/85 text-2xl leading-none font-light transition-transform duration-200 motion-reduce:transition-none",
            open && "rotate-45",
          )}
        >
          +
        </span>
      </button>
      <div
        id={bodyId}
        hidden={!open}
        className={cn(
          // mdx-body carries the markdown rhythm (globals.css), guarded so it
          // stops at a nested not-prose — this body may hold a widget.
          // break-words because the shell is overflow-hidden: a token with no
          // break opportunity (a slashed path, a long URL) is cut off here,
          // not scrolled to.
          // px-3 on a phone: a fold often wraps another bordered block, and
          // each ring costs the reading column twice its padding.
          "mdx-body px-3 pt-4 pb-4 text-sm leading-relaxed break-words sm:px-4",
          "text-foreground/80",
          "[&>*+*]:mt-3",
        )}
      >
        {children}
      </div>
    </section>
  );
}
