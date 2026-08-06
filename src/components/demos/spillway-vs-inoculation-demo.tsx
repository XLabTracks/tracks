"use client";

// Mechanism comparison from the spillway post's inoculation-prompting
// section: prompting vs. pre-RL priors. Every phrase is verbatim (or
// trimmed) from the post's own bullets.

const INOCULATION_POINTS = [
  "requires the AI to attend to the inoculation prompt during training",
  "may degrade over the course of training — since the prompt always recommends reward hacking, RL may favor ignoring it",
  "some specific circuits that produced reward hacking might not have attended to that part of the prompt",
];

const SPILLWAY_POINTS = [
  "pre-RL priors might shape generalization in a way that survives throughout RL",
  "might directly rewrite existing associations with reward hacking (like power-seeking)",
];

export function SpillwayVsInoculationDemo() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-foreground text-sm font-semibold">
            Inoculation prompting
          </p>
          <p className="text-muted-foreground mt-1 text-xs font-medium tracking-wide uppercase">
            mechanism: prompting
          </p>
          <ul className="text-muted-foreground mt-2 list-disc space-y-1.5 pl-4 text-sm">
            {INOCULATION_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-foreground text-sm font-semibold">Spillway design</p>
          <p className="text-muted-foreground mt-1 text-xs font-medium tracking-wide uppercase">
            mechanism: pre-RL priors
          </p>
          <ul className="text-muted-foreground mt-2 list-disc space-y-1.5 pl-4 text-sm">
            {SPILLWAY_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-muted-foreground text-sm">
        “More generally, spillway motivations work via a different mechanism
        (pre-RL priors) than inoculation prompting (prompting), and so it’s
        valuable to have another tool for shaping generalization behavior.”
      </p>
    </div>
  );
}
