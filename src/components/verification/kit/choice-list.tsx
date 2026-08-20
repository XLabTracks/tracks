"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface ChoiceOption {
  id: string;
  node: ReactNode;
  correct: boolean;
}

const SLOT = "ABCDEFGH";

export function ChoiceList({
  options,
  value,
  committed,
  label,
  onPick,
}: {
  options: ChoiceOption[];
  value: string | null;
  committed: boolean;
  label: string;
  onPick: (id: string) => void;
}) {
  return (
    <div className="grid gap-1.5" role="radiogroup" aria-label={label}>
      {options.map((option, slot) => {
        const chosen = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={chosen}
            disabled={committed}
            onClick={() => onPick(option.id)}
            className={cn(
              "border-border block w-full rounded-lg border px-3 py-2 text-left text-sm leading-relaxed transition-colors",
              !committed && "hover:bg-muted",
              chosen && !committed && "border-primary bg-primary/5",
              committed && option.correct && "border-comply bg-comply/5",
              committed && chosen && !option.correct && "border-defect bg-defect/5",
              committed && !option.correct && !chosen && "opacity-55",
            )}
          >
            <span className="text-muted-foreground mr-1.5 font-medium">
              {SLOT[slot]}.
            </span>
            {option.node}
          </button>
        );
      })}
    </div>
  );
}
