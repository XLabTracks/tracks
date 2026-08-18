"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * One committed single-answer question: pick, commit, then read the verdict
 * in the options themselves.
 *
 * WHY IT EXISTS. It was written three times in one day — 2.4.2's On Paper
 * deck, and twice inside 1.2's workshop (the centre question and the
 * second-order question) — each time with its own `const SLOT = "ABCD"` and
 * its own copy of the same five-way className: hover while open, primary tint
 * on the pick, comply on the answer after the commit, defect on a wrong pick,
 * and everything else faded. That is the defect this repo keeps finding, and
 * this is the second rung of the ladder applied to it: it already existed, so
 * stop writing it again.
 *
 * THE LETTER IS A PREFIX IN THE SENTENCE, never a ring around a character.
 * CLAUDE.md forbids the ring outright and there is no state exception, which
 * is why the committed state is carried by the border and ground of the whole
 * row rather than by a filled disc beside it.
 *
 * ORDER IS THE CALLER'S. Options arrive already ordered, because shuffling is
 * seeded on the question's own id at the display layer and the caller is the
 * one that knows the id — see src/lib/shuffle.ts. Nothing here is keyed on
 * position: the pick is stored by `id`, and the letter is only ever the
 * letter of the slot the option happens to be sitting in.
 */

export interface ChoiceOption {
  id: string;
  /** ReactNode, because some decks render authored `**bold**` in the text. */
  node: ReactNode;
  correct: boolean;
}

/** Display letters, which is now all a letter is. */
const SLOT = "ABCDEFGH";

export function ChoiceList({
  options,
  value,
  committed,
  label,
  onPick,
}: {
  options: ChoiceOption[];
  /** The chosen option's id, or null. */
  value: string | null;
  /** After the commit the rows freeze and start reporting. */
  committed: boolean;
  /** What the radiogroup is, for the accessibility tree. */
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
