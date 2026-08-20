"use client";

import { useCallback, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

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
