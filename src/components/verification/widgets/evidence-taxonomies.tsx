"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Scale, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  EVIDENCE_MECHANISMS,
  EVIDENCE_TAXONOMIES,
  type EvidenceMapKey,
} from "@/lib/verification/data/evidence-taxonomies";
import type { VerificationWidgetProps } from "../kit/types";

const GROUP_COLORS = [
  "var(--mod-0-text, #9a000c)",
  "var(--mod-1-text, #bf4f00)",
  "var(--mod-2-text, #946b00)",
  "var(--mod-3-text, #555e07)",
  "var(--mod-4-text, #3d75b1)",
];

export function EvidenceTaxonomies(_: VerificationWidgetProps) {
  void _;
  const [mapKey, setMapKey] = useState<EvidenceMapKey>("layer");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const map = EVIDENCE_TAXONOMIES.find((item) => item.key === mapKey)!;
  const selected = EVIDENCE_MECHANISMS.find((item) => item.id === selectedId);
  const locations = useMemo(() => {
    if (!selectedId) return [];
    return map.groups.filter((group) => group.ids.includes(selectedId));
  }, [map, selectedId]);

  return (
    <section className="not-prose border-border bg-card my-6 overflow-hidden rounded-xl border text-sm">
      <header className="border-border border-b p-5 sm:p-6">
        <p className="text-muted-foreground eyebrow">
          Verification Track · Evidence companion
        </p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">
              Five maps of the evidence
            </h3>
            <p className="text-muted-foreground mt-2 max-w-3xl leading-relaxed">
              The same twelve mechanisms, sorted five ways. Switch maps, inspect
              a mechanism and argue with the placements.
            </p>
          </div>
          <span className="text-muted-foreground shrink-0 eyebrow">
            12 mechanisms · 5 maps
          </span>
        </div>
      </header>

      <div className="border-border flex gap-1 overflow-x-auto border-b p-2" role="tablist">
        {EVIDENCE_TAXONOMIES.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={item.key === mapKey}
            onClick={() => {
              setMapKey(item.key);
              setSelectedId(null);
            }}
            className={cn(
              "shrink-0 rounded-md px-3 py-2 text-xs font-medium transition-colors",
              item.key === mapKey
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <div>
          <div className="border-border bg-muted/45 rounded-lg border p-4">
            <p className="font-medium">{map.question}</p>
            <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
              {map.lineage}
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {map.groups.map((group, groupIndex) => {
              const color = GROUP_COLORS[groupIndex % GROUP_COLORS.length];
              return (
                <section key={group.name} className="border-border bg-background rounded-lg border p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold" style={{ color }}>
                        {group.name}
                      </h4>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {group.sub}
                      </p>
                    </div>
                    <span className="text-muted-foreground text-4xs">
                      {group.ids.length}
                    </span>
                  </div>
                  {group.ids.length ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {group.ids.map((id) => {
                        const mechanism = EVIDENCE_MECHANISMS.find((item) => item.id === id)!;
                        const on = selectedId === id;
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setSelectedId(on ? null : id)}
                            aria-pressed={on}
                            className={cn(
                              "border-border bg-card hover:bg-muted rounded-md border px-2.5 py-1.5 text-left text-xs transition-colors",
                              on && "ring-ring ring-2",
                            )}
                          >
                            {mechanism.name}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground mt-3 rounded-md border border-dashed p-3 text-xs leading-relaxed">
                      {group.empty}
                    </p>
                  )}
                </section>
              );
            })}
          </div>
        </div>

        <aside className="space-y-3">
          {selected ? (
            <div className="border-border bg-background rounded-lg border p-4 xl:sticky xl:top-24">
              <div className="flex items-start justify-between gap-3">
                <p className="text-muted-foreground text-4xs tracking-[0.12em] uppercase">
                  Mechanism
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setSelectedId(null)}
                  aria-label="Close mechanism detail"
                >
                  <X className="size-4" />
                </Button>
              </div>
              <h4 className="mt-1 text-lg font-semibold tracking-tight">
                {selected.name}
              </h4>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                {selected.description}
              </p>
              <div className="border-border mt-4 border-t pt-3">
                <p className="text-muted-foreground text-4xs tracking-[0.12em] uppercase">
                  Placement in this map
                </p>
                <p className="mt-1.5 font-medium">
                  {locations.map((group) => group.name).join(" · ")}
                </p>
              </div>
              {selected.friction && (
                <div className="border-border bg-muted/45 mt-3 rounded-md border p-3">
                  <p className="text-xs font-medium">Where the map strains</p>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    {selected.friction}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="border-border bg-muted/35 rounded-lg border border-dashed p-4">
              <Scale className="text-muted-foreground size-5" aria-hidden />
              <p className="mt-3 font-medium">Inspect a placement</p>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                Select any mechanism to see what it establishes and where this
                taxonomy starts to strain.
              </p>
            </div>
          )}

          <details className="border-border rounded-lg border">
            <summary className="cursor-pointer px-3 py-2.5 text-xs font-medium select-none">
              Strengths and limits of this map
            </summary>
            <div className="border-border grid gap-3 border-t p-3">
              <List title="What it reveals" items={map.strengths} />
              <List title="What it hides" items={map.limits} />
            </div>
          </details>
        </aside>
      </div>
    </section>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-muted-foreground text-4xs tracking-[0.12em] uppercase">
        {title}
      </p>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-xs leading-relaxed">
            <ArrowRight className="text-muted-foreground mt-0.5 size-3 shrink-0" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
