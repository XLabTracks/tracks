"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { VerificationWidgetProps } from "../kit/types";
import { readStored, writeStored } from "@/components/verification/kit/stored";

interface ToCBox {
  id: string;
  band: "Inputs" | "Outputs" | "Outcome" | "Assumptions" | "External factors";
  label: string;
  cue: string;
}

const BOXES: ToCBox[] = [
  { id: "inputs-need", band: "Inputs", label: "What do we need?", cue: "Resources · people" },
  { id: "outputs-do", band: "Outputs", label: "What do we do?", cue: "Activities" },
  { id: "outputs-reach", band: "Outputs", label: "Who do we reach?", cue: "New audience · collaborators" },
  { id: "outcome-short", band: "Outcome", label: "Short-term", cue: "Knowledge increased" },
  { id: "outcome-mid", band: "Outcome", label: "Intermediate", cue: "Behavior changed · decision-making done" },
  { id: "outcome-long", band: "Outcome", label: "Long-term", cue: "Conditions changed" },
  { id: "assumptions", band: "Assumptions", label: "Assumptions", cue: "Internal / testable" },
  { id: "external", band: "External factors", label: "External factors", cue: "External / undefined" },
];

const STORAGE_KEY = "v-theories-of-change:v1";

interface Stored {
  org: string;
  boxes: Record<string, string>;
}

function prune(raw: unknown): Stored {
  const out: Stored = { org: "", boxes: {} };
  if (typeof raw !== "object" || raw === null) return out;
  const { org, boxes } = raw as { org?: unknown; boxes?: unknown };
  if (typeof org === "string") out.org = org;
  if (typeof boxes === "object" && boxes !== null) {
    for (const b of BOXES) {
      const v = (boxes as Record<string, unknown>)[b.id];
      if (typeof v === "string" && v.trim()) out.boxes[b.id] = v;
    }
  }
  return out;
}

export function TheoriesOfChange(_: VerificationWidgetProps) {
  const [org, setOrg] = useState("");
  const [boxes, setBoxes] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let restored: Stored = { org: "", boxes: {} };
    try {
      const raw = readStored(STORAGE_KEY);
      if (raw) restored = prune(JSON.parse(raw));
    } catch {
    }
    queueMicrotask(() => {
      setOrg(restored.org);
      setBoxes(restored.boxes);
      const first = BOXES.findIndex((b) => !restored.boxes[b.id]?.trim());
      setStep(first === -1 ? BOXES.length - 1 : first);
      setHydrated(true);
    });
  }, []);

  const persist = useCallback((next: Stored) => {
    try {
      writeStored(STORAGE_KEY, JSON.stringify(next));
    } catch {
    }
  }, []);

  const setOrgPersisted = (value: string) => {
    setOrg(value);
    persist({ org: value, boxes });
  };
  const setBoxPersisted = (id: string, value: string) => {
    const next = { ...boxes, [id]: value };
    setBoxes(next);
    persist({ org, boxes: next });
  };

  const box = BOXES[step];
  const filled = BOXES.filter((b) => boxes[b.id]?.trim()).length;

  const cell = (b: ToCBox, className?: string) => {
    const text = hydrated ? (boxes[b.id]?.trim() ?? "") : "";
    const active = hydrated && b.id === box.id;
    return (
      <button
        key={b.id}
        type="button"
        onClick={() => setStep(BOXES.indexOf(b))}
        aria-current={active ? "step" : undefined}
        aria-label={`${b.label} — edit this box`}
        className={cn(
          "bg-card text-foreground min-h-16 p-2 text-left align-top",
          "text-2xs leading-snug whitespace-pre-wrap transition-colors",
          "hover:bg-muted focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
          active && "ring-ring ring-2 ring-inset",
          !text && "text-muted-foreground",
          className,
        )}
      >
        {text || "—"}
      </button>
    );
  };

  const band = (label: string, className?: string) => (
    <div
      className={cn(
        "bg-muted text-foreground p-2 text-center text-2xs font-semibold",
        className,
      )}
    >
      {label}
    </div>
  );

  const head = (label: string) => (
    <div
      key={label}
      className="bg-card text-muted-foreground p-2 text-center text-2xs font-medium shadow-[inset_0_-2px_0_var(--primary)]"
    >
      {label}
    </div>
  );

  return (
    <div className="not-prose my-6 min-w-0 max-w-full space-y-4" aria-busy={!hydrated}>
      <div className="border-border bg-card shadow-soft space-y-3 rounded-xl border p-5">
        <label
          className="text-muted-foreground eyebrow"
          htmlFor="toc-org"
        >
          Your organization
        </label>
        <Input
          id="toc-org"
          value={org}
          onChange={(e) => setOrgPersisted(e.target.value)}
          placeholder="Epoch, MIRI, The Midas Project, …"
          aria-label="The AI safety organization this theory of change is for"
        />

        <p className="text-muted-foreground eyebrow">
          Box {step + 1} of {BOXES.length}
          {box.band !== box.label ? ` · ${box.band}` : ""}
        </p>
        <h3 className="text-lg leading-snug font-semibold">{box.label}</h3>
        <p className="text-muted-foreground text-sm">{box.cue}</p>

        <Textarea
          value={boxes[box.id] ?? ""}
          onChange={(e) => setBoxPersisted(box.id, e.target.value)}
          placeholder="Fill in this box, then move to the next one."
          className="min-h-24"
          aria-label={`${box.label} (${box.cue})`}
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-muted-foreground text-xs">
            {filled} of {BOXES.length} boxes filled
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              Back
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={step === BOXES.length - 1}
              onClick={() => setStep((s) => Math.min(BOXES.length - 1, s + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <div className="border-border shadow-soft w-full max-w-full overflow-x-auto overscroll-x-contain rounded-lg border">
        <div className="bg-border grid min-w-[640px] grid-cols-6 gap-px" role="group" aria-label="Your theory of change table">
          {band("Inputs")}
          {band("Outputs", "col-span-2")}
          {band("Outcome", "col-span-3")}
          {BOXES.slice(0, 6).map((b) => head(b.label))}
          {BOXES.slice(0, 6).map((b) => cell(b))}
          {band("Assumptions", "col-span-3 shadow-[inset_0_-2px_0_var(--primary)]")}
          {band("External factors", "col-span-3 shadow-[inset_0_-2px_0_var(--primary)]")}
          {cell(BOXES[6], "col-span-3")}
          {cell(BOXES[7], "col-span-3")}
        </div>
      </div>
    </div>
  );
}
