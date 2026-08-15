"use client";

import { useState } from "react";
import { Check, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  VERIFICATION_PROBLEM as C,
  type VerificationProblemOption,
} from "@/lib/verification/data/verification-problem";
import type { VerificationWidgetProps } from "../kit/types";

/**
 * Native, compact re-composition of the scrolling Verification Problem page.
 * It uses the current platform card/dialog idiom instead of reproducing the
 * prototype's own page chrome, fonts or dark-only palette.
 */
export function VerificationProblem(_: VerificationWidgetProps) {
  void _;
  const [open, setOpen] = useState<VerificationProblemOption | null>(null);
  const [visited, setVisited] = useState<string[]>([]);

  const inspect = (option: VerificationProblemOption) => {
    setVisited((current) =>
      current.includes(option.id) ? current : [...current, option.id],
    );
    setOpen(option);
  };

  return (
    <section className="not-prose border-border bg-card my-6 overflow-hidden rounded-xl border text-sm">
      <div className="border-border border-b p-5 sm:p-6">
        <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
          {C.eyebrow}
        </p>
        <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_14rem] lg:items-end">
          <div>
            <h3 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
              {C.title}
            </h3>
            <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">
              {C.lede}
            </p>
          </div>
          <div className="border-border bg-muted rounded-lg border p-3">
            <p className="text-xs font-medium leading-relaxed">{C.prompt}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
        {C.options.map((option) => {
          const seen = visited.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => inspect(option)}
              className={cn(
                "border-border bg-background hover:bg-muted/50 group rounded-lg border p-4 text-left transition-colors",
                open?.id === option.id && "ring-ring ring-2 ring-offset-2",
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground font-mono text-[10px] tracking-[0.14em] uppercase">
                  {option.label}
                </span>
                {/* Inspected is said, not shaded. The filled disc here made
                    the reader decode a circle, and the numeral inside it only
                    repeated this card's position — which the label opposite
                    already carries. See CLAUDE.md on rings. */}
                {seen ? (
                  <span className="text-comply flex items-center gap-1 text-[11px] font-medium">
                    <Check className="size-3.5 shrink-0" aria-hidden />
                    Inspected
                  </span>
                ) : null}
              </span>
              <span className="mt-5 block text-lg font-semibold tracking-tight">
                {option.question}
              </span>
              <span className="text-muted-foreground mt-1.5 block leading-relaxed">
                {option.summary}
              </span>
              <span className="text-primary mt-4 block text-xs font-medium">
                Test this answer →
              </span>
            </button>
          );
        })}
      </div>

      {open && (
        <div
          className="border-border bg-muted/45 border-t p-4 sm:p-5"
          role="region"
          aria-live="polite"
        >
          <div className="border-border bg-card rounded-lg border p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className={cn(
                    "font-mono text-[11px] tracking-[0.14em] uppercase",
                    open.holds ? "text-comply" : "text-defect",
                  )}
                >
                  {open.holds ? "The answer that holds" : "Failure mode"}
                </p>
                <h4 className="mt-1.5 flex items-center gap-2 text-xl font-semibold tracking-tight">
                  {open.holds && <ShieldCheck className="text-comply size-5" aria-hidden />}
                  {open.outcome}.
                </h4>
              </div>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={() => setOpen(null)}
                aria-label={C.close}
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="text-muted-foreground mt-4 max-w-3xl space-y-2 leading-relaxed">
              {open.detail.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
