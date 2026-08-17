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
 * Covered content is `visibility: hidden`, not blurred. Blur is a filter: the
 * words stay rendered, so find-in-page still matches them and a screenshot at
 * the right radius still reads them. Hidden visibility keeps the box — which
 * is what stops the page moving — and renders nothing, so the text is out of
 * reach of find-in-page, of selection, and of the accessibility tree.
 *
 * The cover is a real button with a real label, so a keyboard reaches it and
 * Enter uncovers it, which is more than the apps manage.
 *
 * It goes both ways. The apps are one-way and the argument for copying them
 * was that nobody can unsee an answer — true, and beside the point: covering
 * it again puts the page back the way it was for somebody who wants to work on
 * with the material rather than under the answer. Hide sits where the hint
 * sat, so the row's right-hand slot always holds exactly one thing.
 */
export function Spoiler({
  children,
  label,
  title,
  hint,
}: {
  children: ReactNode;
  /** What the reader is about to uncover, for the cover's accessible name. */
  label: string;
  /** The always-visible heading. Its whole point is to survive the cover. */
  title: string;
  /** One line saying what is under there, shown while it is covered. */
  hint?: string;
}) {
  const [shown, setShown] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="text-sm font-semibold">{title}</h4>
        {shown ? (
          <button
            type="button"
            onClick={() => setShown(false)}
            className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
          >
            Hide
          </button>
        ) : hint ? (
          <p className="text-muted-foreground text-xs">{hint}</p>
        ) : null}
      </div>

      <div className="relative mt-3">
        <div
          aria-hidden={!shown}
          className={cn(!shown && "invisible")}
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
                spoiler sits in a message you are already reading, so a smudge
                is obviously a smudge over something. On a page it is just a
                field of dots unless it says otherwise. It lives inside the
                veil, so it leaves with the cover rather than going stale.

                z-10 because the grain is a positioned pseudo-element, which
                paints above static in-flow content; the ground is opaque
                rather than translucent for the same reason the field has no
                ground of its own — dots showing through the one thing here
                that is meant to be read is not texture, it is noise. */}
            <span className="text-muted-foreground bg-card relative z-10 rounded-full px-3 py-1 eyebrow">
              Press to uncover
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
