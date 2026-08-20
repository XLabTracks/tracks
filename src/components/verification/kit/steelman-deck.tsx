"use client";

import { useCallback, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

/**
 * The steelman deck, as the writing desk has it: contested claims get
 * challenged, not narrated.
 *
 * One card at a time, drawn on request, never the same card twice running. It
 * is not a checklist and is deliberately not exhaustive — the point is to put
 * a single objection in front of somebody who has just written something they
 * believe, at the moment they can still answer it.
 *
 * Nothing here is stored. A drawn challenge is a prompt, not learner work, and
 * persisting it would make it feel like a task with a right response.
 *
 * The deck starts closed, showing what it is rather than a card: the first
 * render must match the server's, and a random card chosen during render would
 * not.
 */
export function SteelmanDeck({
  deck,
  label = "Steelman deck",
}: {
  deck: readonly string[];
  label?: string;
}) {
  const [card, setCard] = useState<string | null>(null);
  const last = useRef(-1);

  const draw = useCallback(() => {
    if (!deck.length) return;
    let i = last.current;
    if (deck.length > 1) {
      do {
        i = Math.floor(Math.random() * deck.length);
      } while (i === last.current);
    } else {
      i = 0;
    }
    last.current = i;
    setCard(deck[i]!);
  }, [deck]);

  return (
    <section className="panel">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="text-muted-foreground eyebrow">
          {label}
        </h4>
        <p className="text-muted-foreground text-xs">
          Contested claims get challenged, not narrated.
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed" aria-live="polite">
        {card ?? "Draw a challenge and answer it in what you are writing."}
      </p>
      <Button size="sm" variant="outline" className="mt-3" onClick={draw}>
        {card ? "Draw another" : "Draw a challenge"}
      </Button>
    </section>
  );
}
