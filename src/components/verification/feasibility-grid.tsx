"use client";

import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type GlyphKey = "chip" | "pen" | "magnifier" | "hourglass";

function ChipGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden>
      <rect
        x="12"
        y="12"
        width="24"
        height="24"
        rx="3"
        strokeWidth="1.5"
        className="fill-card stroke-foreground/70"
      />
      <rect
        x="19"
        y="19"
        width="10"
        height="10"
        rx="1.5"
        strokeWidth="1.5"
        className="fill-primary/15 stroke-primary"
      />
      {[18, 24, 30].map((p) => (
        <g key={p}>
          <line x1={p} y1="7" x2={p} y2="12" strokeWidth="1.5" className="stroke-foreground/50" />
          <line x1={p} y1="36" x2={p} y2="41" strokeWidth="1.5" className="stroke-foreground/50" />
          <line x1="7" y1={p} x2="12" y2={p} strokeWidth="1.5" className="stroke-foreground/50" />
          <line x1="36" y1={p} x2="41" y2={p} strokeWidth="1.5" className="stroke-foreground/50" />
        </g>
      ))}
    </svg>
  );
}

function PenGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden>
      <path
        d="M30 8 L38 16 L22 32 L12 36 L16 26 Z"
        strokeWidth="1.5"
        strokeLinejoin="round"
        className="fill-card stroke-foreground/70"
      />
      <line x1="26" y1="12" x2="34" y2="20" strokeWidth="1.2" className="stroke-foreground/50" />
      <path
        d="M8 42 q 8 -5 14 0 t 16 -2"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="stroke-primary"
      />
    </svg>
  );
}

function MagnifierGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden>
      <rect
        x="10"
        y="8"
        width="20"
        height="26"
        rx="2"
        strokeWidth="1.5"
        className="fill-card stroke-foreground/50"
      />
      {[14, 19, 24].map((y) => (
        <line key={y} x1="14" y1={y} x2="26" y2={y} strokeWidth="1.2" className="stroke-foreground/40" />
      ))}
      <circle cx="28" cy="28" r="9" strokeWidth="1.6" className="fill-card/80 stroke-primary" />
      <line x1="34.5" y1="34.5" x2="41" y2="41" strokeWidth="2" strokeLinecap="round" className="stroke-primary" />
    </svg>
  );
}

function HourglassGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden>
      <line x1="14" y1="8" x2="34" y2="8" strokeWidth="1.6" className="stroke-foreground/70" />
      <line x1="14" y1="40" x2="34" y2="40" strokeWidth="1.6" className="stroke-foreground/70" />
      <path
        d="M16 8 C16 18 22 21 24 24 C26 21 32 18 32 8"
        fill="none"
        strokeWidth="1.5"
        className="stroke-foreground/70"
      />
      <path
        d="M16 40 C16 30 22 27 24 24 C26 27 32 30 32 40"
        fill="none"
        strokeWidth="1.5"
        className="stroke-foreground/70"
      />
      <path d="M20 12 C21 16 23 18 24 19.5 C25 18 27 16 28 12 Z" className="fill-primary" />
      <path d="M19 38 L29 38 C28 34.5 25.5 33 24 32 C22.5 33 20 34.5 19 38 Z" className="fill-primary" />
    </svg>
  );
}

const GLYPHS: Record<GlyphKey, () => ReactNode> = {
  chip: ChipGlyph,
  pen: PenGlyph,
  magnifier: MagnifierGlyph,
  hourglass: HourglassGlyph,
};

export function FeasibilityGrid({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">{children}</div>
  );
}

export function FeasibilityCard({
  n,
  label,
  glyph,
  children,
}: {
  n: number;
  label: string;
  glyph: GlyphKey;
  children: ReactNode;
}) {
  const scene = GLYPHS[glyph]?.() ?? null;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "border-border bg-card hover:bg-muted flex items-center gap-3 rounded-lg border",
            "p-4 text-left transition-colors select-none",
          )}
        >
          <span className="shrink-0">{scene}</span>
          <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
            <Plus className="text-muted-foreground size-4 shrink-0" aria-hidden />
            <span className="min-w-0">
              <span className="text-muted-foreground">{n}.</span> {label}
            </span>
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <div
          className={cn(
            "text-sm leading-relaxed [&>*+*]:mt-3",
            "[&>p:first-child]:text-base [&>p:first-child]:leading-relaxed",
            "[&_a]:underline [&_a]:underline-offset-2",
            "[&_a]:decoration-muted-foreground/60 [&_a:hover]:decoration-foreground",
          )}
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
