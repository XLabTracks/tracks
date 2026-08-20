"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Spoiler({
  children,
  label,
  title,
  hint,
}: {
  children: ReactNode;
  label: string;
  title: string;
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
            <span className="text-muted-foreground bg-card relative z-10 rounded-full px-3 py-1 eyebrow">
              Press to uncover
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
