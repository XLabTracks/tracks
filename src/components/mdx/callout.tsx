import type { ReactNode } from "react";
import { Info, Lightbulb, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutVariant = "note" | "tip" | "warning";

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
};

export interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}

export function Callout({ variant = "note", title, children }: CalloutProps) {
  const { icon: Icon, className, iconClassName } = VARIANTS[variant];
  return (
    <div
      className={cn(
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
            "text-foreground/80 break-words",
            "[&>*+*]:mt-3",
            "[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5",
            "[&_li]:marker:text-muted-foreground [&_li+li]:mt-1.5",
            "[&_strong]:text-foreground [&_strong]:font-semibold",
            "[&_a]:underline [&_a]:underline-offset-4",
            // The chip is for `code` in a sentence; a fenced block is
            // <pre><code> and already a box of its own (.lesson-body pre).
            "[&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:rounded [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:text-[0.9em]",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
