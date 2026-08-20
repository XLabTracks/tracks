"use client";

import { useMemo, useState } from "react";
import { Building2, Search, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ACTOR_GROUPS,
  ACTOR_MAP_ENTRIES,
  ACTOR_POSTURES,
  ACTOR_ROLES,
  type ActorMapEntry,
} from "@/lib/verification/data/actor-map";
import type { VerificationWidgetProps } from "../kit/types";

type Lens = "position" | "roles" | "posture";

const ROLE_COLORS = [
  "var(--mod-0-text, #9a000c)",
  "var(--mod-1-text, #bf4f00)",
  "var(--mod-2-text, #946b00)",
  "var(--mod-3-text, #555e07)",
  "var(--mod-4-text, #3d75b1)",
];

export function ActorMap(_: VerificationWidgetProps) {
  void _;
  const [lens, setLens] = useState<Lens>("position");
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"all" | "public" | "private">("all");
  const [selectedId, setSelectedId] = useState(ACTOR_MAP_ENTRIES[0].id);

  const actors = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return ACTOR_MAP_ENTRIES.filter(
      (actor) =>
        (kind === "all" || actor.kind === kind) &&
        (!needle ||
          actor.name.toLowerCase().includes(needle) ||
          actor.position.toLowerCase().includes(needle)),
    );
  }, [kind, query]);

  const grouped = useMemo(() => {
    const groups = new Map<string, ActorMapEntry[]>();
    for (const actor of actors) {
      const list = groups.get(actor.group) ?? [];
      list.push(actor);
      groups.set(actor.group, list);
    }
    return [...groups.entries()];
  }, [actors]);
  const selected = ACTOR_MAP_ENTRIES.find((actor) => actor.id === selectedId);

  return (
    <section className="not-prose border-border bg-card my-6 overflow-hidden rounded-xl border text-sm">
      <header className="border-border border-b p-5 sm:p-6">
        <p className="text-muted-foreground eyebrow">
          Verification Track · Actor map
        </p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">Who is actually in the regime?</h3>
            <p className="text-muted-foreground mt-2 max-w-3xl leading-relaxed">
              Move across three lenses: where an actor sits, what it can do, and what posture it may take.
            </p>
          </div>
          <span className="text-muted-foreground shrink-0 eyebrow">
            {ACTOR_MAP_ENTRIES.length} actors · 3 lenses
          </span>
        </div>
      </header>

      <div className="border-border grid gap-3 border-b p-3 lg:grid-cols-[1fr_auto]">
        <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Actor map lens">
          {(["position", "roles", "posture"] as const).map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={lens === item}
              onClick={() => setLens(item)}
              className={cn(
                "shrink-0 rounded-md px-3 py-2 text-xs font-medium capitalize transition-colors",
                lens === item
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {item === "roles" ? "functional roles" : item}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {(["all", "public", "private"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setKind(item)}
              aria-pressed={kind === item}
              className={cn(
                "rounded-md border px-2.5 py-1.5 text-xs capitalize transition-colors",
                kind === item
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid min-h-[34rem] xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="border-border border-b p-4 sm:p-5 xl:border-r xl:border-b-0">
          <label className="relative block">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" aria-hidden />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find an actor or stage"
              className="pl-9"
            />
          </label>

          {lens === "roles" && <RoleLegend />}
          {lens === "posture" && <PostureLegend />}

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {grouped.map(([groupId, entries]) => (
              <section key={groupId} className="border-border bg-background rounded-lg border p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 className="text-xs font-semibold">{ACTOR_GROUPS[groupId]}</h4>
                  <span className="text-muted-foreground text-4xs">{entries.length}</span>
                </div>
                <div className="space-y-1.5">
                  {entries.map((actor) => (
                    <button
                      key={actor.id}
                      type="button"
                      onClick={() => setSelectedId(actor.id)}
                      aria-pressed={selectedId === actor.id}
                      className={cn(
                        "border-border hover:bg-muted w-full rounded-md border p-2.5 text-left transition-colors",
                        selectedId === actor.id && "ring-ring ring-2",
                      )}
                    >
                      <span className="font-medium">{actor.name}</span>
                      <ActorLens actor={actor} lens={lens} />
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
          {!grouped.length && (
            <div className="border-border text-muted-foreground mt-4 rounded-lg border border-dashed p-8 text-center">
              No actors match that search.
            </div>
          )}
        </div>

        <aside className="bg-muted/25 p-4 sm:p-5">
          {selected ? (
            <div className="border-border bg-background rounded-lg border p-4 xl:sticky xl:top-24">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {selected.kind === "public" ? <Building2 className="size-4" /> : <Users className="size-4" />}
                  <span className="text-muted-foreground text-4xs tracking-[0.12em] uppercase">
                    {selected.kind} actor
                  </span>
                </div>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => setSelectedId("")} aria-label="Close actor report">
                  <X className="size-4" />
                </Button>
              </div>
              <h4 className="mt-3 text-xl font-semibold tracking-tight">{selected.name}</h4>
              <Detail label="Position"><p>{selected.position}</p></Detail>
              <Detail label="Functional roles">
                <div className="flex flex-wrap gap-1.5">
                  {selected.roles.length ? selected.roles.map((id) => <RoleTag key={id} id={id} />) : <Muted>None of the six</Muted>}
                </div>
              </Detail>
              <Detail label="Possible postures">
                <div className="flex flex-wrap gap-1.5">
                  {selected.postures.length ? selected.postures.map((id) => {
                    const posture = ACTOR_POSTURES.find((item) => item.id === id)!;
                    return <span key={id} className="border-border bg-muted rounded-md border px-2 py-1 text-xs">{posture.name}</span>;
                  }) : <Muted>Not applicable</Muted>}
                </div>
              </Detail>
              {selected.note && <div className="border-border bg-muted/45 mt-4 rounded-md border p-3 text-xs leading-relaxed">{selected.note}</div>}
            </div>
          ) : (
            <div className="border-border text-muted-foreground rounded-lg border border-dashed p-5">
              Select an actor to open its scouting report.
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function ActorLens({ actor, lens }: { actor: ActorMapEntry; lens: Lens }) {
  if (lens === "position") return <span className="text-muted-foreground mt-1 block text-xs leading-snug">{actor.position}</span>;
  if (lens === "roles") {
    return <span className="mt-2 flex flex-wrap gap-1">{actor.roles.length ? actor.roles.map((id) => <RoleTag key={id} id={id} />) : <Muted>None of the six</Muted>}</span>;
  }
  return (
    <span className="mt-2 flex flex-wrap gap-1">
      {actor.postures.length ? actor.postures.map((id) => {
        const posture = ACTOR_POSTURES.find((item) => item.id === id)!;
        return <span key={id} className="border-border rounded border px-1.5 py-0.5 text-4xs">{posture.name}</span>;
      }) : <Muted>Not applicable</Muted>}
    </span>
  );
}

function RoleTag({ id }: { id: (typeof ACTOR_ROLES)[number]["id"] }) {
  const index = ACTOR_ROLES.findIndex((role) => role.id === id);
  const role = ACTOR_ROLES[index];
  return <span className="rounded-sm px-1.5 py-0.5 text-4xs font-medium" style={{ color: ROLE_COLORS[index % ROLE_COLORS.length], background: `color-mix(in srgb, ${ROLE_COLORS[index % ROLE_COLORS.length]} 10%, transparent)` }}>{role.name}</span>;
}

function RoleLegend() {
  return <div className="border-border mt-4 grid gap-2 rounded-lg border p-3 sm:grid-cols-2">{ACTOR_ROLES.map((role) => <div key={role.id}><RoleTag id={role.id} /><p className="text-muted-foreground mt-1 text-3xs leading-snug">{role.question}</p></div>)}</div>;
}

function PostureLegend() {
  return <div className="border-border mt-4 grid gap-2 rounded-lg border p-3 sm:grid-cols-2">{ACTOR_POSTURES.map((posture) => <div key={posture.id}><p className="text-xs font-medium">{posture.name}</p><p className="text-muted-foreground mt-0.5 text-3xs leading-snug">{posture.means}</p></div>)}</div>;
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="border-border mt-4 border-t pt-3"><p className="text-muted-foreground mb-2 text-4xs tracking-[0.12em] uppercase">{label}</p><div className="text-sm leading-relaxed">{children}</div></div>;
}

function Muted({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground text-4xs italic">{children}</span>;
}
