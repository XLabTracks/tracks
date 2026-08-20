"use client";

import { useState, type ReactNode } from "react";

import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { useGlossHoverTimers } from "@/components/glossary/glossary-card";

export function Footnote({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
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
              event.preventDefault();
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
          onOpenAutoFocus={(event) => {
            if (!byKeyboard) event.preventDefault();
          }}
          onPointerEnter={mouseOnly(timers.cancel)}
          onPointerLeave={mouseOnly(timers.scheduleClose)}
          className="w-[min(360px,calc(100vw-24px))] rounded-[var(--radius)] border border-border bg-card px-4 pt-3.5 pb-3 shadow-soft-lg ring-0"
        >
          <div className="text-sm leading-[1.6] [&_a]:text-link [&_a]:underline [&_a]:underline-offset-4">
            {children}
          </div>
        </PopoverContent>
      </span>
    </Popover>
  );
}
