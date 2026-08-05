"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AGENCY_CALLOUT,
  AGENCY_HEAD,
  AGENCY_TILES,
  CONVERT_CALLOUT,
  CONVERT_HEAD,
  CONVERT_TILES,
  FG_CRAFT_CARDS,
  FG_FORMAT_LABELS,
  FG_HEADER,
  FG_HOME_HINT_1,
  FG_HOME_HINT_2,
  FG_HOME_SESSION_HEADING,
  FG_HOME_SESSION_NOTE,
  FG_POPUPS,
  FG_PRINCIPLES,
  FG_SESSION_CARDS,
  PART_CALLOUT,
  PART_HEAD,
  PART_TILES,
  PHASE_LABEL,
  RESOURCES_BOXES,
  RESOURCES_HEAD,
  ROLE_CALLOUT_HIGH,
  ROLE_CALLOUT_LOW,
  ROLE_CALLOUT_SPINE,
  ROLE_HEAD,
  ROLE_TILES_HIGH,
  ROLE_TILES_LOW,
  SESSION_CALLOUT,
  SESSION_HEAD,
  SESSION_PLANS,
  SESSION_STAGES,
  TAKES_CALLOUT,
  TAKES_HEAD,
  TAKES_SORTER,
  TAKES_SORTER_HEAD,
  TAKES_TILES,
  type Callout,
  type ContextKey,
  type FormatKey,
  type ResBox,
  type Stage,
  type Tile,
} from "@/lib/verification/data/facilitator-guide";

/**
 * The Facilitator Field Guide — home grid plus 13 detail views.
 *
 * Every string rendered here comes from the authored data module, which is why
 * the HTML bodies go in through `dangerouslySetInnerHTML`: they are curriculum
 * committed to this repo, never user input. Two consequences to keep in mind —
 * a `[term]` button inside a callout is authored markup carrying `data-pop`, so
 * popups open by delegation off the container rather than by a React handler
 * per button; and any future data that is not authored in-repo must not be
 * routed through these same components.
 *
 * Views are component state, not routes: the source guide worked that way, and
 * a facilitator mid-session wants Back to land on the grid, not in browser
 * history.
 */

type ViewId = "home" | string;

/** A tile / stage / term click, resolved against the popup store. */
function usePopups() {
  const [openId, setOpenId] = useState<string | null>(null);
  const body = openId ? FG_POPUPS[openId] : undefined;

  // The authored bodies open with an <h3> that the Dialog renders as its
  // title, so it is stripped from the body to avoid printing it twice.
  const { title, rest } = useMemo(() => {
    if (!body) return { title: "", rest: "" };
    const match = body.match(/^\s*<h3>([\s\S]*?)<\/h3>/);
    return {
      title: match ? match[1].replace(/<[^>]+>/g, "") : "",
      rest: match ? body.slice(match[0].length) : body,
    };
  }, [body]);

  /** Delegation for authored `[term]` buttons inside callout HTML. */
  const onContainerClick = useCallback((event: React.MouseEvent) => {
    const target = (event.target as HTMLElement).closest("[data-pop]");
    const id = target?.getAttribute("data-pop");
    if (id && FG_POPUPS[id]) setOpenId(id);
  }, []);

  return { openId, setOpenId, title, rest, onContainerClick };
}

function CalloutBlock({ callout }: { callout: Callout }) {
  return (
    <div
      className={cn(
        "fg-html mt-4 rounded-lg border p-4 text-sm",
        callout.variant === "blue"
          ? "border-sky-500/30 bg-sky-500/5"
          : "border-amber-600/30 bg-amber-600/5",
      )}
      dangerouslySetInnerHTML={{ __html: callout.html }}
    />
  );
}

function TileGrid({
  tiles,
  onOpen,
}: {
  tiles: Tile[];
  onOpen: (id: string) => void;
}) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {tiles.map((tile) => (
        <button
          key={tile.pop}
          type="button"
          onClick={() => onOpen(tile.pop)}
          className="border-border/80 hover:border-foreground/30 hover:bg-muted/40 group relative cursor-pointer rounded-lg border p-4 text-left transition select-none"
        >
          {tile.timing && (
            <span className="text-muted-foreground mb-1 block font-mono text-xs tabular-nums">
              {tile.timing}
            </span>
          )}
          <span className="block text-sm font-medium">{tile.title}</span>
          <span
            className="fg-html text-muted-foreground mt-1 block text-sm"
            dangerouslySetInnerHTML={{ __html: tile.desc }}
          />
          <Plus
            className="text-muted-foreground/50 group-hover:text-foreground absolute top-3 right-3 size-3.5"
            aria-hidden
          />
        </button>
      ))}
    </div>
  );
}

function StageList({
  stages,
  onOpen,
}: {
  stages: Stage[];
  onOpen: (id: string) => void;
}) {
  return (
    <ol className="mt-4 space-y-2">
      {stages.map((stage) => (
        <li key={stage.pop}>
          <button
            type="button"
            onClick={() => onOpen(stage.pop)}
            className="border-border/80 hover:border-foreground/30 hover:bg-muted/40 flex w-full cursor-pointer items-baseline gap-3 rounded-lg border p-3 text-left transition select-none"
          >
            <span className="text-muted-foreground w-14 shrink-0 font-mono text-xs tabular-nums">
              {stage.num}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{stage.title}</span>
              <span className="text-muted-foreground block text-sm">
                {stage.desc}
              </span>
            </span>
            <span className="text-muted-foreground shrink-0 text-xs uppercase">
              {PHASE_LABEL[stage.phase]}
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}

function ResBoxBlock({ box }: { box: ResBox }) {
  return (
    <div className="border-border/80 mt-4 rounded-lg border p-4">
      <h3 className="text-sm font-medium">{box.heading}</h3>
      <ul className="fg-html fg-res mt-2 space-y-2 text-sm">
        {box.items.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: item.html }} />
        ))}
      </ul>
    </div>
  );
}

function SectionHead({ title, lede }: { title: string; lede?: string }) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {lede && (
        <p
          className="fg-html text-muted-foreground mt-2"
          dangerouslySetInnerHTML={{ __html: lede }}
        />
      )}
    </div>
  );
}

export function FacilitatorGuide() {
  const [view, setView] = useState<ViewId>("home");
  const [format, setFormat] = useState<FormatKey>("ip");
  const [context, setContext] = useState<ContextKey>("low");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const { openId, setOpenId, title, rest, onContainerClick } = usePopups();

  const open = useCallback((id: string) => setOpenId(id), [setOpenId]);
  const go = useCallback((id: ViewId) => {
    setView(id);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, []);

  const plan = SESSION_PLANS.find((p) => p.id === view);

  return (
    <div onClick={onContainerClick}>
      {view !== "home" && (
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2"
          onClick={() => go("home")}
        >
          <ArrowLeft className="size-4" aria-hidden /> All modules
        </Button>
      )}

      {view === "home" && (
        <div>
          <p className="text-muted-foreground">{FG_HEADER.lede}</p>
          <ul className="text-muted-foreground mt-4 space-y-1 text-sm">
            {FG_PRINCIPLES.map((p) => (
              <li key={p}>— {p}</li>
            ))}
          </ul>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {FG_CRAFT_CARDS.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => go(card.id)}
                className="border-border/80 hover:border-foreground/30 hover:bg-muted/40 cursor-pointer rounded-lg border p-4 text-left transition select-none"
              >
                <span className="text-muted-foreground block font-mono text-xs tabular-nums">
                  {card.num}
                </span>
                <span className="mt-1 block font-medium">{card.title}</span>
                <span className="text-muted-foreground mt-1 block text-sm">
                  {card.desc}
                </span>
                <span className="text-muted-foreground mt-2 block text-xs">
                  {card.meta}
                </span>
              </button>
            ))}
          </div>
          <p className="text-muted-foreground mt-3 text-sm">{FG_HOME_HINT_1}</p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            {FG_HOME_SESSION_HEADING}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {FG_HOME_SESSION_NOTE}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {FG_SESSION_CARDS.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => go(card.id)}
                className="border-border/80 hover:border-foreground/30 hover:bg-muted/40 cursor-pointer rounded-lg border p-4 text-left transition select-none"
              >
                <span className="text-muted-foreground block font-mono text-xs tabular-nums">
                  {card.num}
                </span>
                <span className="mt-1 block font-medium">{card.title}</span>
                <span className="text-muted-foreground mt-1 block text-sm">
                  {card.desc}
                </span>
                <span className="text-muted-foreground mt-2 block text-xs">
                  {card.meta}
                </span>
              </button>
            ))}
          </div>
          <p className="text-muted-foreground mt-3 text-sm">{FG_HOME_HINT_2}</p>
        </div>
      )}

      {view === "m-role" && (
        <div>
          <SectionHead title={ROLE_HEAD.title} lede={ROLE_HEAD.lede} />
          <div className="mt-4 flex flex-wrap gap-2">
            {(
              [
                ["low", ROLE_HEAD.ctxLabelLow],
                ["high", ROLE_HEAD.ctxLabelHigh],
              ] as const
            ).map(([key, label]) => (
              <Button
                key={key}
                size="sm"
                variant={context === key ? "default" : "outline"}
                onClick={() => setContext(key)}
              >
                {label}
              </Button>
            ))}
          </div>
          <CalloutBlock
            callout={context === "low" ? ROLE_CALLOUT_LOW : ROLE_CALLOUT_HIGH}
          />
          <TileGrid
            tiles={context === "low" ? ROLE_TILES_LOW : ROLE_TILES_HIGH}
            onOpen={open}
          />
          <CalloutBlock callout={ROLE_CALLOUT_SPINE} />
        </div>
      )}

      {view === "m-takes" && (
        <div>
          <SectionHead title={TAKES_HEAD.title} lede={TAKES_HEAD.lede} />
          <TileGrid tiles={TAKES_TILES} onOpen={open} />
          <h3 className="mt-8 text-lg font-semibold tracking-tight">
            {TAKES_SORTER_HEAD.heading}
          </h3>
          <p className="text-muted-foreground mt-2 text-sm">
            {TAKES_SORTER_HEAD.note}
          </p>
          <ul className="mt-4 space-y-3">
            {TAKES_SORTER.map((item, i) => {
              const key = `s${i}`;
              // The authored verdict HTML opens with its own bold
              // classification, so calling it is a self-check: commit, then
              // read the verdict — no second badge over the top of it.
              return (
                <li
                  key={key}
                  className="border-border/80 rounded-lg border p-4 text-sm"
                >
                  <p className="fg-html">{item.quote}</p>
                  {revealed[key] ? (
                    <p
                      className="fg-html text-muted-foreground mt-3"
                      dangerouslySetInnerHTML={{ __html: item.verdictHtml }}
                    />
                  ) : (
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setRevealed((r) => ({ ...r, [key]: true }))
                        }
                      >
                        Strong
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setRevealed((r) => ({ ...r, [key]: true }))
                        }
                      >
                        Weak
                      </Button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <CalloutBlock callout={TAKES_CALLOUT} />
        </div>
      )}

      {view === "m-part" && (
        <div>
          <SectionHead title={PART_HEAD.title} lede={PART_HEAD.lede} />
          <TileGrid tiles={PART_TILES} onOpen={open} />
          <CalloutBlock callout={PART_CALLOUT} />
        </div>
      )}

      {view === "m-agency" && (
        <div>
          <SectionHead title={AGENCY_HEAD.title} lede={AGENCY_HEAD.lede} />
          <TileGrid tiles={AGENCY_TILES} onOpen={open} />
          <CalloutBlock callout={AGENCY_CALLOUT} />
        </div>
      )}

      {view === "m-convert" && (
        <div>
          <SectionHead title={CONVERT_HEAD.title} lede={CONVERT_HEAD.lede} />
          <TileGrid tiles={CONVERT_TILES} onOpen={open} />
          <CalloutBlock callout={CONVERT_CALLOUT} />
        </div>
      )}

      {view === "m-session" && (
        <div>
          <SectionHead title={SESSION_HEAD.title} lede={SESSION_HEAD.lede} />
          <StageList stages={SESSION_STAGES} onOpen={open} />
          <CalloutBlock callout={SESSION_CALLOUT} />
        </div>
      )}

      {view === "m-resources" && (
        <div>
          <SectionHead
            title={RESOURCES_HEAD.title}
            lede={RESOURCES_HEAD.lede}
          />
          {RESOURCES_BOXES.map((box) => (
            <ResBoxBlock key={box.heading} box={box} />
          ))}
        </div>
      )}

      {plan && (
        <div>
          <SectionHead title={plan.title} lede={plan.lede} />

          {plan.principles && (
            <div className="mt-4 flex flex-wrap gap-2">
              {plan.principles.map((p) => (
                <span
                  key={p}
                  className="border-border/80 text-muted-foreground rounded-full border px-3 py-1 text-xs"
                >
                  {p}
                </span>
              ))}
            </div>
          )}

          {plan.prep && (
            <>
              <div className="mt-6 flex flex-wrap gap-2">
                {(Object.keys(FG_FORMAT_LABELS) as FormatKey[]).map((key) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={format === key ? "default" : "outline"}
                    onClick={() => setFormat(key)}
                  >
                    {FG_FORMAT_LABELS[key]}
                  </Button>
                ))}
              </div>
              <div
                className="fg-html border-border/80 bg-muted/30 mt-3 rounded-lg border p-4 text-sm"
                dangerouslySetInnerHTML={{ __html: plan.prep[format] }}
              />
            </>
          )}

          {plan.prepNote && (
            <div
              className="fg-html border-border/80 bg-muted/30 mt-6 rounded-lg border p-4 text-sm"
              dangerouslySetInnerHTML={{ __html: plan.prepNote }}
            />
          )}

          {plan.coreTiles && (
            <>
              <h3 className="mt-8 text-lg font-semibold tracking-tight">
                {plan.coreHeading}
              </h3>
              {plan.coreNote && (
                <p className="text-muted-foreground mt-2 text-sm">
                  {plan.coreNote}
                </p>
              )}
              <TileGrid tiles={plan.coreTiles} onOpen={open} />
            </>
          )}

          {plan.stages && plan.stages.length > 0 && (
            <>
              <h3 className="mt-8 text-lg font-semibold tracking-tight">
                Run of show
              </h3>
              <StageList stages={plan.stages} onOpen={open} />
            </>
          )}

          <h3 className="mt-8 text-lg font-semibold tracking-tight">
            {plan.promptsHeading}
          </h3>
          {plan.promptsNote && (
            <p className="text-muted-foreground mt-2 text-sm">
              {plan.promptsNote}
            </p>
          )}
          <TileGrid tiles={plan.promptTiles} onOpen={open} />

          <h3 className="mt-8 text-lg font-semibold tracking-tight">
            {plan.sendHeading}
          </h3>
          <ResBoxBlock box={plan.sendBox} />

          {plan.seed && <CalloutBlock callout={plan.seed} />}

          {plan.nextId && (
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => go(plan.nextId as string)}
            >
              {plan.nextLabel}
            </Button>
          )}
        </div>
      )}

      <Dialog open={openId !== null} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div
            className="fg-html text-sm"
            dangerouslySetInnerHTML={{ __html: rest }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
