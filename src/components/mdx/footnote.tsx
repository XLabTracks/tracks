"use client";

import { useState, type ReactNode } from "react";

import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { useGlossHoverTimers } from "@/components/glossary/glossary-card";

/**
 * Inline footnote, opened as a popup at its own marker.
 *
 * IT USED TO BE A MARGIN SIDENOTE — floated into the right gutter above
 * 96rem, a checkbox/label toggle that expanded it inline below. That is gone
 * on the course owner's instruction ("а сноска — поп апами"), and the two
 * changes that arrived together are one decision: reserving a gutter for
 * sidenotes is what kept the reading column narrow, so notes that open over
 * the text let the text have the width.
 *
 * THE INTERACTION IS THE GLOSSARY CARD'S, deliberately, because a reader
 * should not have to learn two ways to open a small explanation on the same
 * page: hover-intent on a mouse, tap on touch, keyboard-openable, Escape and
 * outside-click to dismiss. `useGlossHoverTimers` is the same hook the term
 * trigger uses, so the open and close delays cannot drift apart from it.
 *
 * Numbering still comes from the CSS counter on `.lesson-body`, so nothing
 * needs registering per instance and the marker keeps reading as "[1]".
 *
 * Not the glossary overlay itself: that one prefers a margin rail, which is
 * the thing being given up here. This anchors at the marker and stays there.
 */
export function Footnote({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  // Hover opens must never move focus; a keyboard open should, so Tab reaches
  // any link inside the note. Same contract as the glossary trigger — kept in
  // state and not a ref, because `onOpenAutoFocus` is a radix prop rather than
  // a DOM event handler and reading a ref inside one is a render-time read as
  // far as the lint rule is concerned. One extra render, no ambiguity.
  const [byKeyboard, setByKeyboard] = useState(false);
  const timers = useGlossHoverTimers(
    () => setOpen(true),
    () => setOpen(false),
  );

  const mouseOnly = (fn: () => void) => (event: { pointerType?: string }) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    fn();
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        timers.cancel();
        setOpen(next);
      }}
    >
      <span className="footnote">
        <PopoverAnchor asChild>
          <button
            type="button"
            className="footnote-marker"
            aria-label="Footnote"
            aria-expanded={open}
            onPointerDown={() => setByKeyboard(false)}
            onClick={() => {
              timers.cancel();
              setOpen((v) => !v);
            }}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault(); // Space must not scroll the page
              setByKeyboard(true);
              timers.cancel();
              setOpen((v) => !v);
            }}
            onPointerEnter={mouseOnly(() => {
              setByKeyboard(false);
              timers.scheduleOpen();
            })}
            onPointerLeave={mouseOnly(timers.scheduleClose)}
          />
        </PopoverAnchor>
        <PopoverContent
          side="top"
          align="start"
          collisionPadding={16}
          // A hover open must not steal focus, or reading a page with a mouse
          // would keep yanking the caret into notes the reader only grazed.
          onOpenAutoFocus={(event) => {
            if (!byKeyboard) event.preventDefault();
          }}
          onPointerEnter={mouseOnly(timers.cancel)}
          onPointerLeave={mouseOnly(timers.scheduleClose)}
          /* THE CARD IS THE COURSE'S EXISTING ONE, not a new one.
             `.vocab-card` in public/verification/notebook.css is the popup
             this course already had — the one the Define action raises over a
             selected word — and every value below is read off it rather than
             chosen: min(360px, 100vw - 24px) wide, 14/16/12 padding, a
             hairline --border, --radius, --card for the ground and
             --shadow-soft-lg. The shadcn defaults it overrides (bg-popover,
             p-2.5, shadow-md, ring-1) are what made this look like a fourth
             popup in a course that already had one. */
          className="w-[min(360px,calc(100vw-24px))] rounded-[var(--radius)] border border-border bg-card px-4 pt-3.5 pb-3 shadow-soft-lg ring-0"
        >
          {/* One block child, and it has to be one.
              PopoverContent is `flex flex-col gap-2.5`, so an inline run
              handed to it directly becomes a column: every text node and
              every link in the note landed on its own line with a gap
              between them, which is what a footnote must never look like.
              Wrapping restores normal inline flow inside a single flex item.

              Body copy, not caption copy. It was `text-muted-foreground`,
              which greyed a note the reader opened on purpose; `.vocab-body`
              carries the normal foreground at 1.6, and `text-sm` already
              resolves to --fs-md inside this chrome (app-bridge.css maps it),
              so the size matches too. Links take --link like every other link
              on the page. */}
          <div className="text-sm leading-[1.6] [&_a]:text-link [&_a]:underline [&_a]:underline-offset-4">
            {children}
          </div>
        </PopoverContent>
      </span>
    </Popover>
  );
}
