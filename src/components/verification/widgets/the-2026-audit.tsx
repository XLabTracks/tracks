"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ARGUED_RANKING,
  ASSUMPTIONS,
  AUDIT_2026_KEY,
  CHANGE_OPTIONS,
  COPY,
  DIRECTIONS,
  EVIDENCE,
  FUNCTIONS,
  SCHEME_ITEMS,
  type AssumptionId,
  type Direction,
  type EvidenceCard,
  type FunctionTag,
} from "@/lib/verification/data/audit-2026";
import type { VerificationWidgetProps } from "../kit/types";

type Phase = "rebuild" | "audit" | "verdict";

interface Placement {
  inScheme: boolean | null;
  tags: FunctionTag[];
}

interface Commitment {
  bearsOn: AssumptionId | null;
  direction: Direction | null;
  revealedAt: string | null;
}

interface Store {
  phase: Phase;
  placements: Record<string, Placement>;
  rebuildChecked: boolean;
  softEscapeSeen: boolean;
  commits: Record<string, Commitment>;
  hints: string[];
  nudgeSeen: boolean;
  ranking: AssumptionId[];
  change: string | null;
  sentence: string;
  verdictShown: boolean;
}

const emptyStore = (): Store => ({
  phase: "rebuild",
  placements: Object.fromEntries(
    SCHEME_ITEMS.map((item) => [item.id, { inScheme: null, tags: [] }]),
  ),
  rebuildChecked: false,
  softEscapeSeen: false,
  commits: Object.fromEntries(
    EVIDENCE.map((card) => [
      card.id,
      { bearsOn: null, direction: null, revealedAt: null },
    ]),
  ),
  hints: [],
  nudgeSeen: false,
  ranking: ASSUMPTIONS.map((a) => a.id),
  change: null,
  sentence: "",
  verdictShown: false,
});

const ASSUMPTION_IDS = new Set<string>(ASSUMPTIONS.map((a) => a.id));
const DIRECTION_IDS = new Set<string>(DIRECTIONS.map((d) => d.id));
const FUNCTION_IDS = new Set<string>(FUNCTIONS.map((f) => f.id));

function prune(raw: unknown): Store {
  const blank = emptyStore();
  if (!raw || typeof raw !== "object") return blank;
  const box = raw as Partial<Store>;

  const placements = { ...blank.placements };
  for (const item of SCHEME_ITEMS) {
    const saved = box.placements?.[item.id];
    if (!saved) continue;
    placements[item.id] = {
      inScheme: typeof saved.inScheme === "boolean" ? saved.inScheme : null,
      tags: Array.isArray(saved.tags)
        ? saved.tags.filter((t): t is FunctionTag => FUNCTION_IDS.has(t))
        : [],
    };
  }

  const commits = { ...blank.commits };
  for (const card of EVIDENCE) {
    const saved = box.commits?.[card.id];
    if (!saved) continue;
    commits[card.id] = {
      bearsOn:
        typeof saved.bearsOn === "string" && ASSUMPTION_IDS.has(saved.bearsOn)
          ? (saved.bearsOn as AssumptionId)
          : null,
      direction:
        typeof saved.direction === "string" && DIRECTION_IDS.has(saved.direction)
          ? (saved.direction as Direction)
          : null,
      revealedAt: typeof saved.revealedAt === "string" ? saved.revealedAt : null,
    };
  }

  const savedRank = Array.isArray(box.ranking)
    ? box.ranking.filter((id): id is AssumptionId => ASSUMPTION_IDS.has(id))
    : [];
  const ranking = [
    ...new Set([...savedRank, ...blank.ranking]),
  ] as AssumptionId[];

  return {
    phase:
      box.phase === "audit" || box.phase === "verdict" ? box.phase : "rebuild",
    placements,
    rebuildChecked: box.rebuildChecked === true,
    softEscapeSeen: box.softEscapeSeen === true,
    commits,
    hints: Array.isArray(box.hints)
      ? box.hints.filter((h): h is string => typeof h === "string")
      : [],
    nudgeSeen: box.nudgeSeen === true,
    ranking,
    change:
      typeof box.change === "string" &&
      CHANGE_OPTIONS.some((o) => o.id === box.change)
        ? box.change
        : null,
    sentence: typeof box.sentence === "string" ? box.sentence : "",
    verdictShown: box.verdictShown === true,
  };
}

function toNotebook(lines: string[]): boolean {
  const api = (
    window as unknown as { VTNotebook?: { addNote?: (text: string) => unknown } }
  ).VTNotebook;
  if (typeof api?.addNote !== "function") return false;
  try {
    api.addNote(lines.join("\n"));
    return true;
  } catch {
    return false;
  }
}

const assumptionName = (id: AssumptionId | null) =>
  ASSUMPTIONS.find((a) => a.id === id)?.name ?? "";
const directionLabel = (id: Direction | null) =>
  DIRECTIONS.find((d) => d.id === id)?.label ?? "";
const functionLabel = (id: FunctionTag) =>
  FUNCTIONS.find((f) => f.id === id)?.label ?? id;

export function The2026Audit({ onComplete }: VerificationWidgetProps) {
  const [store, setStore] = useState<Store>(emptyStore);
  const [hydrated, setHydrated] = useState(false);
  const [facilitator, setFacilitator] = useState(false);
  const [saved, setSaved] = useState(false);
  const [escapeOffered, setEscapeOffered] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [live, setLive] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    let restored = emptyStore();
    try {
      const raw = localStorage.getItem(AUDIT_2026_KEY);
      if (raw) restored = prune(JSON.parse(raw));
    } catch {
    }
    const mode = new URLSearchParams(window.location.search).get("mode");
    queueMicrotask(() => {
      setStore(restored);
      setFacilitator(mode === "facilitator");
      setHydrated(true);
    });
  }, []);

  const commit = useCallback((next: Store | ((prev: Store) => Store)) => {
    setStore((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      try {
        localStorage.setItem(AUDIT_2026_KEY, JSON.stringify(resolved));
      } catch {
      }
      return resolved;
    });
  }, []);

  const sorted = SCHEME_ITEMS.every(
    (item) => store.placements[item.id]?.inScheme !== null,
  );
  const tagged = SCHEME_ITEMS.every((item) => {
    const p = store.placements[item.id];
    return p?.inScheme !== true || p.tags.length > 0;
  });
  const rebuildReady = sorted && tagged;

  const revealedCount = EVIDENCE.filter(
    (card) => store.commits[card.id]?.revealedAt,
  ).length;
  const auditReady = revealedCount === EVIDENCE.length;
  const verdictReady = store.change !== null;

  const allWeakens =
    auditReady &&
    EVIDENCE.every((card) => store.commits[card.id]?.direction === "weakens");

  const goto = useCallback(
    (phase: Phase, announce: string) => {
      commit((prev) => ({ ...prev, phase }));
      setLive(announce);
      moved.current = true;
    },
    [commit],
  );

  useEffect(() => {
    if (moved.current) {
      heading.current?.focus();
      moved.current = false;
    }
  }, [store.phase, store.verdictShown]);

  const record = useMemo(
    () =>
      ASSUMPTIONS.map((assumption) => ({
        assumption,
        chips: EVIDENCE.filter(
          (card) => store.commits[card.id]?.bearsOn === assumption.id,
        ).map((card) => ({
          card,
          direction: store.commits[card.id]?.direction ?? null,
        })),
      })),
    [store.commits],
  );

  if (!hydrated) {
    return (
      <div className="not-prose my-6 min-h-96" aria-busy>
        <noscript>
          <StaticReference />
        </noscript>
      </div>
    );
  }

  if (facilitator) return <FacilitatorSheet />;

  const finishRebuild = () => {
    commit((prev) => ({ ...prev, rebuildChecked: true }));
    setLive("The machine checked. Reasoning shown for all six mechanisms.");
    toNotebook([
      "The 2026 audit, phase 1: Shavit scheme, sorted and tagged.",
      ...SCHEME_ITEMS.map((item) => {
        const p = store.placements[item.id];
        const side = p.inScheme ? COPY.inScheme : COPY.notInScheme;
        const tags = p.tags.map(functionLabel).join(", ");
        return `${item.id}: ${side}${tags ? ` · ${tags}` : ""}`;
      }),
    ]);
  };

  const skipRebuild = () => {
    if (!store.softEscapeSeen) {
      commit((prev) => ({ ...prev, softEscapeSeen: true }));
      setEscapeOffered(true);
      return;
    }
    setEscapeOffered(false);
    goto("audit", `${COPY.auditHeading}. Six evidence cards.`);
  };

  const toAudit = () => goto("audit", `${COPY.auditHeading}. Six evidence cards.`);

  const toVerdict = () => {
    if (allWeakens && !store.nudgeSeen) {
      commit((prev) => ({ ...prev, nudgeSeen: true }));
      setNudge(true);
      return;
    }
    setNudge(false);
    toNotebook([
      "The 2026 audit, phase 2: evidence audit.",
      ...EVIDENCE.map((card) => {
        const c = store.commits[card.id];
        return `${card.code} ${card.title}: bears on ${assumptionName(c.bearsOn)}, ${directionLabel(c.direction)}. Revealed ${c.revealedAt ?? ""}`;
      }),
    ]);
    goto("verdict", `${COPY.verdictHeading}. Rank the five assumptions.`);
  };

  const showVerdict = () => {
    const wrote = toNotebook([
      "The 2026 audit, phase 3: verdict.",
      `Ranking, most load-bearing first: ${store.ranking.map((id) => assumptionName(id)).join(", ")}`,
      `Would most change the assessment: ${CHANGE_OPTIONS.find((o) => o.id === store.change)?.text ?? ""}`,
      `One sentence on why: ${store.sentence}`,
    ]);
    setSaved(wrote);
    commit((prev) => ({ ...prev, verdictShown: true }));
    setLive(`${COPY.revealHeading} is open.`);
    moved.current = true;
    onComplete();
  };

  const reset = () => {
    setSaved(false);
    setEscapeOffered(false);
    setNudge(false);
    setLive("Reset. Back to phase one.");
    commit(emptyStore());
  };

  return (
    <div className="not-prose @container my-6 space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <p className="text-muted-foreground eyebrow">
            {store.phase === "rebuild"
              ? "Phase one · Rebuild"
              : store.phase === "audit"
                ? "Phase two · Audit"
                : "Phase three · Verdict"}
          </p>
          <h3
            ref={heading}
            tabIndex={-1}
            className="mt-1 text-2xl font-semibold tracking-tight outline-none"
          >
            {COPY.h1}
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">{COPY.subtitle}</p>
        </div>
        <Button size="sm" variant="outline" onClick={reset}>
          {COPY.reset}
        </Button>
      </header>

      <p aria-live="polite" className="sr-only">
        {live}
      </p>

      {store.phase === "rebuild" ? (
        <Rebuild
          store={store}
          commit={commit}
          ready={rebuildReady}
          escapeOffered={escapeOffered}
          onCheck={finishRebuild}
          onSkip={skipRebuild}
          onContinue={toAudit}
        />
      ) : null}

      {store.phase === "audit" ? (
        <Audit
          store={store}
          commit={commit}
          record={record}
          revealedCount={revealedCount}
          ready={auditReady}
          nudge={nudge}
          setLive={setLive}
          onContinue={toVerdict}
        />
      ) : null}

      {store.phase === "verdict" ? (
        <Verdict
          store={store}
          commit={commit}
          record={record}
          ready={verdictReady}
          saved={saved}
          onShow={showVerdict}
        />
      ) : null}

      <p className="text-muted-foreground eyebrow border-border border-t pt-3">
        {COPY.footer}
      </p>
    </div>
  );
}

function Rebuild({
  store,
  commit,
  ready,
  escapeOffered,
  onCheck,
  onSkip,
  onContinue,
}: {
  store: Store;
  commit: (next: Store | ((prev: Store) => Store)) => void;
  ready: boolean;
  escapeOffered: boolean;
  onCheck: () => void;
  onSkip: () => void;
  onContinue: () => void;
}) {
  const setSide = (id: string, inScheme: boolean) =>
    commit((prev) => ({
      ...prev,
      placements: {
        ...prev.placements,
        [id]: {
          inScheme,
          tags: inScheme ? prev.placements[id].tags : [],
        },
      },
    }));

  const toggleTag = (id: string, tag: FunctionTag) =>
    commit((prev) => {
      const tags = prev.placements[id].tags;
      return {
        ...prev,
        placements: {
          ...prev.placements,
          [id]: {
            inScheme: prev.placements[id].inScheme,
            tags: tags.includes(tag)
              ? tags.filter((t) => t !== tag)
              : [...tags, tag],
          },
        },
      };
    });

  return (
    <section className="space-y-4">
      <h4 className="text-lg font-semibold">{COPY.rebuildHeading}</h4>
      {COPY.rebuildIntro.map((line) => (
        <p key={line} className="text-muted-foreground max-w-[64ch] text-sm leading-relaxed">
          {line}
        </p>
      ))}

      <ol className="space-y-3">
        {SCHEME_ITEMS.map((item) => {
          const p = store.placements[item.id];
          const locked = store.rebuildChecked;
          return (
            <li key={item.id} className="panel">
              <p className="text-sm leading-relaxed">{item.text}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {[true, false].map((side) => (
                  <button
                    key={String(side)}
                    type="button"
                    disabled={locked}
                    aria-pressed={p.inScheme === side}
                    onClick={() => setSide(item.id, side)}
                    className={cn(
                      "border-border rounded-md border px-3 py-1.5 text-sm transition-colors motion-reduce:transition-none",
                      "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                      !locked && "hover:bg-muted",
                      p.inScheme === side && "border-primary bg-primary/5 font-medium",
                      locked && "opacity-70",
                    )}
                  >
                    {side ? COPY.inScheme : COPY.notInScheme}
                  </button>
                ))}
              </div>

              {p.inScheme ? (
                <fieldset className="mt-3" disabled={locked}>
                  <legend className="text-muted-foreground eyebrow">
                    {COPY.functionLabel}
                  </legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {FUNCTIONS.map((fn) => (
                      <button
                        key={fn.id}
                        type="button"
                        aria-pressed={p.tags.includes(fn.id)}
                        onClick={() => toggleTag(item.id, fn.id)}
                        className={cn(
                          "border-border rounded-md border px-2.5 py-1 text-xs transition-colors motion-reduce:transition-none",
                          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                          !locked && "hover:bg-muted",
                          p.tags.includes(fn.id) &&
                            "border-primary bg-primary/5 font-medium",
                          locked && "opacity-70",
                        )}
                      >
                        {fn.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ) : null}

              {store.rebuildChecked ? (
                <div className="border-border mt-3 border-t pt-3">
                  <p className="text-muted-foreground eyebrow">
                    {item.inScheme ? "In the paper" : "Not in the paper"}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed">
                    {item.reveal}
                    {item.restrictNote && p.tags.includes("restrict")
                      ? ` ${item.restrictNote}`
                      : ""}
                  </p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      {store.rebuildChecked ? (
        <section className="panel">
          <p className="text-sm leading-relaxed">
            <b>{COPY.neverDoesTitle}</b> {COPY.neverDoes}
          </p>
        </section>
      ) : null}

      {escapeOffered ? (
        <p className="text-muted-foreground text-sm leading-relaxed">
          {COPY.softEscape}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        {store.rebuildChecked ? (
          <Button onClick={onContinue}>{COPY.auditHeading}</Button>
        ) : (
          <Button disabled={!ready} onClick={onCheck}>
            {ready ? COPY.rebuildContinue : COPY.rebuildContinueLocked}
          </Button>
        )}
        {!store.rebuildChecked ? (
          <button
            type="button"
            onClick={onSkip}
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded text-xs underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
          >
            Skip to the evidence
          </button>
        ) : null}
      </div>
    </section>
  );
}

interface RecordRow {
  assumption: (typeof ASSUMPTIONS)[number];
  chips: { card: EvidenceCard; direction: Direction | null }[];
}

function Register({ rows }: { rows: RecordRow[] }) {
  return (
    <div className="panel">
      <h4 className="text-sm font-semibold">{COPY.registerTitle}</h4>
      <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
        {COPY.registerSubtitle}
      </p>
      <ul className="mt-3 space-y-3">
        {rows.map(({ assumption, chips }) => (
          <li key={assumption.id}>
            <p className="text-sm font-medium">{assumption.name}</p>
            <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
              {assumption.statement}
            </p>
            {chips.length ? (
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {chips.map(({ card, direction }) => (
                  <li
                    key={card.id}
                    className="border-border text-muted-foreground rounded border px-1.5 py-0.5 text-3xs"
                  >
                    {card.code}: {directionLabel(direction).toLowerCase()}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RegisterRail({ rows }: { rows: RecordRow[] }) {
  return (
    <>
      <div className="hidden @4xl:block">
        <div className="sticky top-24">
          <Register rows={rows} />
        </div>
      </div>
      <details className="border-border bg-card rounded-xl border p-3 @4xl:hidden">
        <summary className="focus-visible:ring-ring cursor-pointer rounded text-sm font-semibold focus-visible:ring-2 focus-visible:outline-none">
          {COPY.registerTitle}
        </summary>
        <div className="mt-3">
          <Register rows={rows} />
        </div>
      </details>
    </>
  );
}

function Audit({
  store,
  commit,
  record,
  revealedCount,
  ready,
  nudge,
  setLive,
  onContinue,
}: {
  store: Store;
  commit: (next: Store | ((prev: Store) => Store)) => void;
  record: RecordRow[];
  revealedCount: number;
  ready: boolean;
  nudge: boolean;
  setLive: (s: string) => void;
  onContinue: () => void;
}) {
  return (
    <section className="space-y-4">
      <h4 className="text-lg font-semibold">{COPY.auditHeading}</h4>
      {COPY.auditIntro.map((line) => (
        <p key={line} className="text-muted-foreground max-w-[64ch] text-sm leading-relaxed">
          {line}
        </p>
      ))}

      <div className="grid gap-5 @4xl:grid-cols-[minmax(0,1fr)_17rem]">
        <ol className="order-2 space-y-4 @4xl:order-1">
          {EVIDENCE.map((card) => (
            <EvidenceItem
              key={card.id}
              card={card}
              store={store}
              commit={commit}
              setLive={setLive}
            />
          ))}
        </ol>
        <div className="order-1 @4xl:order-2">
          <RegisterRail rows={record} />
        </div>
      </div>

      {nudge ? (
        <p className="text-muted-foreground max-w-[64ch] text-sm leading-relaxed">
          {COPY.allWeakensNudge}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={!ready} onClick={onContinue}>
          {ready ? COPY.auditContinue : COPY.auditContinueLocked}
        </Button>
        <p className="text-muted-foreground text-xs" aria-live="polite">
          {revealedCount} of {EVIDENCE.length} revealed
        </p>
      </div>
    </section>
  );
}

function EvidenceItem({
  card,
  store,
  commit,
  setLive,
}: {
  card: EvidenceCard;
  store: Store;
  commit: (next: Store | ((prev: Store) => Store)) => void;
  setLive: (s: string) => void;
}) {
  const c = store.commits[card.id];
  const revealed = c.revealedAt !== null;
  const ready = c.bearsOn !== null && c.direction !== null;
  const hintId = `hint-${card.id}`;
  const hintShown = store.hints.includes(card.id);
  const hint = card.hints.find(
    (h) =>
      (h.direction === undefined || h.direction === c.direction) &&
      (h.bearsOn === undefined || h.bearsOn === c.bearsOn),
  );

  return (
    <li className="panel">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-muted-foreground eyebrow">{card.code}</span>
        <h5 className="text-base font-semibold">{card.title}</h5>
      </div>
      <p className="text-muted-foreground mt-0.5 text-xs">{card.dateLine}</p>
      <p className="mt-2 text-sm leading-relaxed">{card.body}</p>
      <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
        Source: {card.source}
      </p>

      <div className="mt-3 space-y-3">
        <div>
          <label
            className="text-muted-foreground eyebrow block"
            htmlFor={`bears-${card.id}`}
          >
            {COPY.bearsOnLabel}
          </label>
          <select
            id={`bears-${card.id}`}
            disabled={revealed}
            value={c.bearsOn ?? ""}
            onChange={(e) =>
              commit((prev) => ({
                ...prev,
                commits: {
                  ...prev.commits,
                  [card.id]: {
                    ...prev.commits[card.id],
                    bearsOn: (e.target.value || null) as AssumptionId | null,
                  },
                },
              }))
            }
            className="border-border bg-background focus-visible:ring-ring mt-1.5 w-full rounded-md border px-2.5 py-1.5 text-sm focus-visible:ring-2 focus-visible:outline-none disabled:opacity-70"
          >
            <option value="">Choose an assumption</option>
            {ASSUMPTIONS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div role="group" aria-label={`Direction for ${card.code}`}>
          <div className="flex flex-wrap gap-2">
            {DIRECTIONS.map((d) => (
              <button
                key={d.id}
                type="button"
                disabled={revealed}
                aria-pressed={c.direction === d.id}
                onClick={() =>
                  commit((prev) => ({
                    ...prev,
                    commits: {
                      ...prev.commits,
                      [card.id]: { ...prev.commits[card.id], direction: d.id },
                    },
                  }))
                }
                className={cn(
                  "border-border rounded-md border px-3 py-1.5 text-sm transition-colors motion-reduce:transition-none",
                      "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                  !revealed && "hover:bg-muted",
                  c.direction === d.id && "border-primary bg-primary/5 font-medium",
                  revealed && "opacity-70",
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!revealed ? (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            disabled={!ready}
            onClick={() => {
              commit((prev) => ({
                ...prev,
                commits: {
                  ...prev.commits,
                  [card.id]: {
                    ...prev.commits[card.id],
                    revealedAt: new Date().toISOString(),
                  },
                },
              }));
              setLive(`${card.code} revealed.`);
            }}
          >
            {COPY.commit}
          </Button>
          {hint && !hintShown ? (
            <button
              type="button"
              aria-controls={hintId}
              onClick={() =>
                commit((prev) => ({
                  ...prev,
                  hints: [...new Set([...prev.hints, card.id])],
                }))
              }
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded text-xs underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
            >
              {COPY.hint}
            </button>
          ) : null}
        </div>
      ) : null}

      {hint && hintShown && !revealed ? (
        <p
          id={hintId}
          className="text-muted-foreground mt-2 text-sm leading-relaxed"
        >
          {hint.text}
        </p>
      ) : null}

      {revealed ? (
        <div className="border-border mt-3 border-t pt-3">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground eyebrow">{COPY.yourRecord}</dt>
              <dd className="mt-1 text-sm">
                {assumptionName(c.bearsOn)} · {directionLabel(c.direction)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground eyebrow">The key</dt>
              <dd className="mt-1 text-sm">
                {assumptionName(card.bearsOn)} · {directionLabel(card.direction)}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-sm leading-relaxed">{card.reveal}</p>
        </div>
      ) : null}
    </li>
  );
}

function Verdict({
  store,
  commit,
  record,
  ready,
  saved,
  onShow,
}: {
  store: Store;
  commit: (next: Store | ((prev: Store) => Store)) => void;
  record: RecordRow[];
  ready: boolean;
  saved: boolean;
  onShow: () => void;
}) {
  const move = (index: number, delta: number) =>
    commit((prev) => {
      const next = [...prev.ranking];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, ranking: next };
    });

  const chars = store.sentence.trim().length;

  return (
    <section className="space-y-4">
      <h4 className="text-lg font-semibold">{COPY.verdictHeading}</h4>
      {COPY.verdictIntro.map((line) => (
        <p key={line} className="text-muted-foreground max-w-[64ch] text-sm leading-relaxed">
          {line}
        </p>
      ))}

      <div className="grid gap-5 @4xl:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="order-2 space-y-5 @4xl:order-1">
          <div>
            <h5 className="text-muted-foreground eyebrow">{COPY.rankingLabel}</h5>
            <ol className="mt-2 space-y-2">
              {store.ranking.map((id, i) => {
                const a = ASSUMPTIONS.find((x) => x.id === id);
                if (!a) return null;
                return (
                  <li
                    key={id}
                    className="border-border bg-card flex items-start gap-3 rounded-lg border p-3"
                  >
                    <span className="text-muted-foreground mt-0.5 text-sm font-medium tabular-nums">
                      {i + 1}.
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{a.name}</span>
                      <span className="text-muted-foreground mt-0.5 block text-xs leading-relaxed">
                        {a.statement}
                      </span>
                    </span>
                    <span className="flex shrink-0 gap-0.5">
                      <button
                        type="button"
                        aria-label={`${COPY.moveUp}: ${a.name}`}
                        disabled={i === 0 || store.verdictShown}
                        onClick={() => move(i, -1)}
                        className="text-muted-foreground hover:bg-muted focus-visible:ring-ring rounded p-1 transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30"
                      >
                        <ChevronUp className="size-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        aria-label={`${COPY.moveDown}: ${a.name}`}
                        disabled={
                          i === store.ranking.length - 1 || store.verdictShown
                        }
                        onClick={() => move(i, 1)}
                        className="text-muted-foreground hover:bg-muted focus-visible:ring-ring rounded p-1 transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30"
                      >
                        <ChevronDown className="size-4" aria-hidden />
                      </button>
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <fieldset disabled={store.verdictShown}>
            <legend className="text-muted-foreground eyebrow">
              {COPY.changeLabel}
            </legend>
            <div className="mt-2 grid gap-1.5" role="radiogroup" aria-label={COPY.changeLabel}>
              {CHANGE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={store.change === option.id}
                  onClick={() =>
                    commit((prev) => ({ ...prev, change: option.id }))
                  }
                  className={cn(
                    "border-border block w-full rounded-lg border px-3 py-2 text-left text-sm leading-relaxed transition-colors motion-reduce:transition-none",
                    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                    !store.verdictShown && "hover:bg-muted",
                    store.change === option.id && "border-primary bg-primary/5",
                  )}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label
              className="text-muted-foreground eyebrow block"
              htmlFor="audit-2026-sentence"
            >
              {COPY.freeTextLabel}
            </label>
            <textarea
              id="audit-2026-sentence"
              rows={3}
              readOnly={store.verdictShown}
              value={store.sentence}
              onChange={(e) =>
                commit((prev) => ({ ...prev, sentence: e.target.value }))
              }
              className="border-border bg-background focus-visible:ring-ring mt-1.5 w-full rounded-lg border p-3 text-sm leading-relaxed focus-visible:ring-2 focus-visible:outline-none"
            />
            <p className="text-muted-foreground mt-1 text-xs">
              {chars} characters · aim for 140 to 280
            </p>
          </div>

          {!store.verdictShown ? (
            <Button disabled={!ready} onClick={onShow}>
              {COPY.verdictContinue}
            </Button>
          ) : null}

          {store.verdictShown ? (
            <div className="space-y-4">
              <h5 className="text-lg font-semibold">{COPY.revealHeading}</h5>
              {ARGUED_RANKING.map((block) => (
                <p
                  key={block.lead}
                  className="max-w-[64ch] text-sm leading-relaxed"
                >
                  <b>{block.lead}</b> {block.body}
                </p>
              ))}
              <blockquote className="border-border text-foreground max-w-[64ch] border-l-2 pl-4 text-sm leading-relaxed italic">
                {COPY.durableLesson}
              </blockquote>
              {saved ? (
                <p className="text-muted-foreground text-xs">{COPY.saved}</p>
              ) : null}
              <p className="max-w-[64ch] text-sm leading-relaxed">
                {COPY.handoff}
              </p>
            </div>
          ) : null}
        </div>

        <div className="order-1 @4xl:order-2">
          <RegisterRail rows={record} />
        </div>
      </div>
    </section>
  );
}

function StaticReference() {
  return (
    <div className="space-y-5">
      <header>
        <h3 className="text-2xl font-semibold tracking-tight">{COPY.h1}</h3>
        <p className="text-muted-foreground mt-1 text-sm">{COPY.subtitle}</p>
      </header>

      <section>
        <h4 className="text-lg font-semibold">{COPY.registerTitle}</h4>
        <p className="text-muted-foreground mt-1 text-sm">
          {COPY.registerSubtitle}
        </p>
        <ul className="mt-3 space-y-2">
          {ASSUMPTIONS.map((a) => (
            <li key={a.id} className="text-sm leading-relaxed">
              <b>{a.name}.</b> {a.statement}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4 className="text-lg font-semibold">{COPY.auditHeading}</h4>
        <ol className="mt-3 space-y-4">
          {EVIDENCE.map((card) => (
            <li key={card.id} className="panel">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-muted-foreground eyebrow">{card.code}</span>
                <h5 className="text-base font-semibold">{card.title}</h5>
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {card.dateLine}
              </p>
              <p className="mt-2 text-sm leading-relaxed">{card.body}</p>
              <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                Source: {card.source}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <p className="text-muted-foreground eyebrow border-border border-t pt-3">
        {COPY.footer}
      </p>
    </div>
  );
}

function FacilitatorSheet() {
  return (
    <div className="not-prose my-6 space-y-5">
      <header>
        <p className="text-muted-foreground eyebrow">Facilitator sheet</p>
        <h3 className="mt-1 text-2xl font-semibold tracking-tight">{COPY.h1}</h3>
        <p className="text-muted-foreground mt-1 text-sm">{COPY.subtitle}</p>
      </header>

      <section className="space-y-3">
        <h4 className="text-lg font-semibold">{COPY.rebuildHeading}</h4>
        {SCHEME_ITEMS.map((item) => (
          <div key={item.id} className="panel">
            <p className="text-muted-foreground eyebrow">
              {item.inScheme ? COPY.inScheme : COPY.notInScheme}
              {item.accepts.length
                ? ` · ${item.accepts.map(functionLabel).join(", ")}`
                : ""}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed">{item.text}</p>
            <p className="mt-2 text-sm leading-relaxed">{item.reveal}</p>
            {item.restrictNote ? (
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                {item.restrictNote}
              </p>
            ) : null}
          </div>
        ))}
        <p className="max-w-[64ch] text-sm leading-relaxed">
          <b>{COPY.neverDoesTitle}</b> {COPY.neverDoes}
        </p>
      </section>

      <section className="space-y-3">
        <h4 className="text-lg font-semibold">{COPY.registerTitle}</h4>
        <ul className="space-y-2">
          {ASSUMPTIONS.map((a) => (
            <li key={a.id} className="text-sm leading-relaxed">
              <b>{a.name}.</b> {a.statement}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h4 className="text-lg font-semibold">{COPY.auditHeading}</h4>
        {EVIDENCE.map((card) => (
          <div key={card.id} className="panel">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-muted-foreground eyebrow">{card.code}</span>
              <h5 className="text-base font-semibold">{card.title}</h5>
            </div>
            <p className="text-muted-foreground mt-0.5 text-xs">{card.dateLine}</p>
            <p className="mt-2 text-sm leading-relaxed">{card.body}</p>
            <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
              Source: {card.source}
            </p>
            <p className="text-muted-foreground eyebrow mt-3">
              Key: {assumptionName(card.bearsOn)} · {directionLabel(card.direction)}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed">{card.reveal}</p>
            {card.hints.map((h) => (
              <p
                key={h.text}
                className="text-muted-foreground mt-1.5 text-sm leading-relaxed"
              >
                {COPY.hint}: {h.text}
              </p>
            ))}
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h4 className="text-lg font-semibold">{COPY.changeLabel}</h4>
        <ol className="space-y-1.5">
          {CHANGE_OPTIONS.map((o) => (
            <li key={o.id} className="text-sm leading-relaxed">
              {o.text}
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h4 className="text-lg font-semibold">{COPY.revealHeading}</h4>
        {ARGUED_RANKING.map((block) => (
          <p key={block.lead} className="max-w-[64ch] text-sm leading-relaxed">
            <b>{block.lead}</b> {block.body}
          </p>
        ))}
        <blockquote className="border-border max-w-[64ch] border-l-2 pl-4 text-sm leading-relaxed italic">
          {COPY.durableLesson}
        </blockquote>
      </section>

      <p className="text-muted-foreground eyebrow border-border border-t pt-3">
        {COPY.footer}
      </p>
    </div>
  );
}
