"use client";

import { useState } from "react";

// The regime model's three states (module 2, "Determining the usefulness"):
// hover (or tap) a state to expand what lives inside it and the question it
// answers. Content restates the lesson's own prose.

interface StateCard {
  id: string;
  title: string;
  question: string;
  items: string[];
}

const STATES: StateCard[] = [
  {
    id: "world",
    title: "World state",
    question: "What is control actually worth here?",
    items: [
      "What the model is actually like — aligned, schemer, sloppy, or an apparent-success seeker",
      "How capable it is",
      "How checkable AI research output is",
      "What has happened with the model so far",
    ],
  },
  {
    id: "epistemic",
    title: "Epistemic state",
    question: "What do we justifiably think it's worth?",
    items: [
      "The lab's confidence in its alignment methods",
      "Interpretability findings, and how much we trust them",
      "The track record of incidents, or their absence",
      "Evaluation results — including control evaluations",
    ],
  },
  {
    id: "resource",
    title: "Resource state",
    question: "Can we afford to act on what we think?",
    items: [
      "The will account: political will, the only currency",
      "The price of the usefulness tax — set by commercial pressure and public mood",
      "The price of compute — set by internal politics",
      "The price of delay — set by the race",
    ],
  },
];

export function RegimeStatesDemo() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {STATES.map((state) => {
        const open = expanded === state.id;
        return (
          <button
            key={state.id}
            type="button"
            onMouseEnter={() => setExpanded(state.id)}
            onMouseLeave={() => setExpanded(null)}
            onFocus={() => setExpanded(state.id)}
            onBlur={() => setExpanded(null)}
            onClick={() => setExpanded(open ? null : state.id)}
            aria-expanded={open}
            className={`border-border bg-card rounded-xl border p-4 text-left transition-all ${
              open ? "border-primary shadow-soft" : ""
            }`}
          >
            <p className="text-sm font-semibold">{state.title}</p>
            <p className="text-muted-foreground mt-1 text-xs italic">
              {state.question}
            </p>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <ul className="text-muted-foreground min-h-0 space-y-1.5 overflow-hidden text-xs">
                <li aria-hidden className="pt-2" />
                {state.items.map((item) => (
                  <li key={item} className="flex gap-1.5">
                    <span aria-hidden>–</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-muted-foreground/70 mt-2 text-[10px]">
              {open ? "" : "Hover or tap to expand"}
            </p>
          </button>
        );
      })}
    </div>
  );
}
