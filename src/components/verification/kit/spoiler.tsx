"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * A spoiler, in the sense the messaging apps made standard: the content is
 * present, at its full size, under a grainy cover that comes off where it
 * stands.
 *
 * It is deliberately NOT a `<details>`. A disclosure opens — the page grows,
 * everything below it moves, and the reader loses their place. A spoiler
 * changes nothing but whether the words can be read, which is why the thing it
 * hides can sit under an ordinary visible heading: the heading says what is
 * there, the veil says you have not looked yet, and neither of them moves.
 *
 * Hidden text is blurred AND unselectable AND `aria-hidden`, so it cannot be
 * read by dragging a cursor over it, by a screen reader, or by find-in-page.
 * The cover is a real button with a real label, so a keyboard reaches it and
 * Enter uncovers it, which is more than the apps manage.
 *
 * One way only: once uncovered it stays uncovered. Nothing here is a toggle —
 * a reader who has seen the answer cannot unsee it, and offering to re-hide it
 * would be a control that does nothing.
 */
export function Spoiler({
  children,
  label,
}: {
  children: ReactNode;
  /** What the reader is about to uncover, for the button and for AT. */
  label: string;
}) {
  const [shown, setShown] = useState(false);

  return (
    <div className="relative">
      <div
        aria-hidden={!shown}
        className={cn(
          "transition-[filter] duration-300 motion-reduce:transition-none",
          !shown && "pointer-events-none blur-[5px] select-none",
        )}
      >
        {children}
      </div>
      {shown ? null : (
        <button
          type="button"
          onClick={() => setShown(true)}
          aria-label={label}
          className="spoiler-veil focus-visible:ring-ring absolute inset-0 flex items-center justify-center rounded-lg focus-visible:ring-2 focus-visible:outline-none"
        >
          {/* The one departure from the apps, and it earns itself: their
              spoiler sits in a message you are already reading, so a smudge is
              obviously a smudge over something. On a page it is just a grey
              panel unless it says otherwise. It lives inside the veil, so it
              cannot go stale — it leaves with the cover. */}
          <span className="text-muted-foreground bg-card/80 rounded-full px-3 py-1 font-mono text-[11px] tracking-[0.14em] uppercase">
            Press to uncover
          </span>
        </button>
      )}
    </div>
  );
}
