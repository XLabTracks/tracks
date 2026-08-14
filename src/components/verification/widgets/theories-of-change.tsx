"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { VerificationWidgetProps } from "../kit/types";

/**
 * 0.1.2's optional exercise: build a theory of change for an AI safety
 * organization of the learner's choice by filling the lesson's own elements
 * table one box at a time, exactly as the outline asks ("Exercise should
 * prompt learner to fill out each box, one at a time, with a short
 * description of what each box should be").
 *
 * Every band, label and cue below restates the lesson's elements table
 * verbatim — the cue under each box is that box's cell in the table, and the
 * org examples are the outline's own. Nothing here composes a sentence of
 * curriculum.
 *
 * Unbridged and ungraded: a theory of change has no answer key, so there is
 * no marking and no completion event — the filled table is the outcome. The
 * table view doubles as navigation (press a cell to edit that box), and the
 * Back/Next pair keeps the one-at-a-time cadence.
 *
 * Answers persist under `v-theories-of-change:v1`; restored state is applied
 * off the effect body behind `hydrated` so the first client render matches
 * the server's markup, and stored answers are pruned against the current box
 * list before they are trusted.
 */

interface ToCBox {
  id: string;
  /** The table's band this box sits in (its header row). */
  band: "Inputs" | "Outputs" | "Outcome" | "Assumptions" | "External factors";
  /** The box's own label in the table. */
  label: string;
  /** The table cell's contents — the short description of what goes here. */
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
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) restored = prune(JSON.parse(raw));
    } catch {
      /* unreadable storage just means starting fresh */
    }
    queueMicrotask(() => {
      setOrg(restored.org);
      setBoxes(restored.boxes);
      // Resume at the first box not yet filled, or the last one when all are.
      const first = BOXES.findIndex((b) => !restored.boxes[b.id]?.trim());
      setStep(first === -1 ? BOXES.length - 1 : first);
      setHydrated(true);
    });
  }, []);

  const persist = useCallback((next: Stored) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* private mode / full quota — the draft is a convenience, not the record */
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

  /* The cells repeat the lesson table's three layers (`elements-grid` in
     globals.css — change one and change the other): theme-inverted bands,
     muted second-layer labels, card-ground content boxes, hairlines carried
     by the gap-px grid over a border-coloured ground. */
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
          "text-[12.5px] leading-snug whitespace-pre-wrap transition-colors",
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
        "bg-foreground text-background p-2 text-center text-[12px] font-semibold",
        className,
      )}
    >
      {label}
    </div>
  );

  const head = (label: string) => (
    <div
      key={label}
      className="bg-muted text-foreground p-2 text-center text-[12px] font-medium"
    >
      {label}
    </div>
  );

  return (
    <div className="not-prose my-6 min-w-0 max-w-full space-y-4" aria-busy={!hydrated}>
      <div className="border-border bg-card shadow-soft space-y-3 rounded-xl border p-5">
        <label
          className="text-muted-foreground text-[11px] tracking-[0.14em] uppercase"
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

        <p className="text-muted-foreground text-[11px] tracking-[0.14em] uppercase">
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

      {/* The table itself, filling as the boxes do. Cells are the navigation:
          press one to edit that box. */}
      <div className="w-full max-w-full overflow-x-auto overscroll-x-contain">
        <div className="border-border bg-border grid min-w-[640px] grid-cols-6 gap-px border" role="group" aria-label="Your theory of change table">
          {band("Inputs")}
          {band("Outputs", "col-span-2")}
          {band("Outcome", "col-span-3")}
          {BOXES.slice(0, 6).map((b) => head(b.label))}
          {BOXES.slice(0, 6).map((b) => cell(b))}
          {band("Assumptions", "col-span-3")}
          {band("External factors", "col-span-3")}
          {cell(BOXES[6], "col-span-3")}
          {cell(BOXES[7], "col-span-3")}
        </div>
      </div>
    </div>
  );
}
