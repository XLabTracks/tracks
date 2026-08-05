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

/**
 * The `[POP UP]` the outline keeps asking for: a named thing the learner opens
 * to read, rather than a paragraph they scroll past. 2.2.1 is the live case —
 * its prose says "click on each layer to learn more", and the three layers are
 * pop-ups.
 *
 *   <PopUp label="Identity">…the definition…</PopUp>
 *
 * The label is the name, so it carries the meaning on its own; the body is
 * what opening it is for. An `[interactive pop-up]` — one the learner answers
 * rather than reads — is a widget, not this: see policy-cost.
 *
 * Trap: the dialog portals out of `.lesson-body`, so no `prose` rule reaches
 * it. Type inside has to be stated, not inherited.
 */
export interface PopUpProps {
  label: string;
  children: ReactNode;
}

export function PopUp({ label, children }: PopUpProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "not-prose border-border bg-card hover:bg-muted my-2 inline-flex max-w-full",
            "items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm",
            "font-medium transition-colors select-none",
          )}
        >
          <Plus className="text-muted-foreground size-4 shrink-0" aria-hidden />
          <span className="min-w-0">{label}</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <div className="text-sm leading-relaxed">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
