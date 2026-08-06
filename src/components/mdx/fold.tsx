"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A folded block for material a lesson offers but does not require — closed
 * by default, opened from its header row. `<Fold label="…">` around ordinary
 * lesson markdown.
 *
 * The card is painted, never half-painted: one soft primary tint on the fill
 * with all four border edges alike. Text stays `--foreground` — the tint
 * barely moves the ground's luminance in any of the three verification
 * themes, and primary itself is a surface on the night theme, not an ink, so
 * nothing here writes in it. The marker is a plus (no chevrons), rotated
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
      className="not-prose border-primary/25 bg-primary/5 my-6 rounded-xl border"
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen(!open)}
        // justify-between carries the important modifier because the high
        // contrast theme's 44px touch-target rule
        // (`:root[data-theme='contrast'] button`) sets justify-content:center
        // at higher specificity than any utility — without it the label and
        // marker huddle in the middle of the row on that theme.
        className="text-foreground flex w-full cursor-pointer items-center justify-between! gap-3 rounded-xl p-4 text-left text-sm font-semibold select-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none"
      >
        {label}
        <span
          aria-hidden
          className={cn(
            "text-foreground/80 text-2xl leading-none font-light transition-transform duration-200 motion-reduce:transition-none",
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
          "px-4 pb-4 text-sm leading-relaxed",
          "text-foreground/80",
          "[&>*+*]:mt-3",
          "[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5",
          "[&_li]:marker:text-muted-foreground [&_li+li]:mt-1.5",
          "[&_strong]:text-foreground [&_strong]:font-semibold",
          "[&_a]:underline [&_a]:underline-offset-4",
          "[&_code]:bg-muted [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.9em]",
        )}
      >
        {children}
      </div>
    </section>
  );
}
