"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FoldProps {
  label?: string;
  children: ReactNode;
}

export function Fold({ label = "[Optional] Material", children }: FoldProps) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();
  const shellRef = useRef<HTMLElement>(null);

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
