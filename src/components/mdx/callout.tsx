import type { ReactNode } from "react";
import { CirclePlay, Info, Lightbulb, NotebookPen, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutVariant = "note" | "tip" | "warning" | "highlight" | "notebook";

const VARIANTS: Record<
  CalloutVariant,
  { icon: typeof Info; className: string; iconClassName: string }
> = {
  note: {
    icon: Info,
    className: "border-border bg-muted/50",
    iconClassName: "text-muted-foreground",
  },
  tip: {
    icon: Lightbulb,
    className: "border-border bg-secondary/60",
    iconClassName: "text-foreground",
  },
  warning: {
    icon: TriangleAlert,
    className: "border-amber-500/40 bg-amber-500/10",
    iconClassName: "text-amber-600",
  },
  highlight: {
    icon: CirclePlay,
    className: "border-primary/55 bg-primary/5",
    iconClassName: "text-brand-ink",
  },
  // The outline's "[outline in dark/light red rounded rectangular outline]"
  // for notebook prompts: the brand red as a full four-side outline (the
  // primary token re-solves per theme, so it is dark red on the day ground
  // and light on night), no fill — the outline IS the marker.
  notebook: {
    icon: NotebookPen,
    className: "border-primary/70 bg-transparent",
    iconClassName: "text-brand-ink",
  },
};

export interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}

export function Callout({ variant = "note", title, children }: CalloutProps) {
  // MDX bodies aren't type-checked, so an authoring typo can pass an unknown
  // variant at runtime — degrade to "note" instead of throwing mid-render
  // (mirrors the runtime guards in <Term/> and <SiteQuote/>).
  const { icon: Icon, className, iconClassName } =
    VARIANTS[variant] ?? VARIANTS.note;
  return (
    <div
      className={cn(
        // Full column width, like every other card in the flow: the owner's
        // width rule (2026-08-15) is that cards share one edge — a 64ch
        // callout beside a full-width ReadingCard read as a layout bug.
        "not-prose my-6 flex gap-3 rounded-xl border p-4 text-sm leading-relaxed",
        className,
      )}
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", iconClassName)} aria-hidden />
      <div className="min-w-0 space-y-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        {/* A callout carries markdown, so its body needs the rhythm Tailwind's
            preflight takes away: list markers, indent, and a gap between
            blocks. Without this a callout of more than one sentence renders as
            an unbroken wall — every paragraph flush against the next, every
            bullet gone.

            Trap: this cannot be done by nesting `prose` here. Typography's
            rules exclude `[class~="not-prose"] *`, and the shell above is
            not-prose, so an inner `prose` matches nothing at all. Utilities
            are the way in — and `not-prose` has to stay, or the callout takes
            the lesson column's type scale. Spacing is between siblings only,
            so a one-line callout stays tight under its title. */}
        <div
          className={cn(
            // mdx-body carries the markdown rhythm (globals.css), guarded so
            // it stops at a nested not-prose.
            "mdx-body text-foreground/80 break-words",
            "[&>*+*]:mt-3",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
