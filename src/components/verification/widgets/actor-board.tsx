"use client";

import { useState, type PointerEvent as ReactPointerEvent } from "react";
import { Eye, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ACTOR_POSTURES,
  ACTOR_ROLES,
  type ActorRoleId,
} from "@/lib/verification/data/actor-map";
import {
  ABSENT_ACTORS,
  CENTRE,
  CORE_QUESTION,
  EDGE_KEY,
  MAP_LABEL,
  MAP_SLOTS,
  RECALL_TARGET,
  RINGS,
  ROLE_KEY,
  SECOND_ORDER,
  WORKSHOP_ACTORS,
  WORKSHOP_ACTOR_IDS,
  type RingId,
  type WorkshopActorId,
} from "@/lib/verification/data/actor-workshop";
import { edgeId } from "@/lib/verification/actor-workshop";
import { useStoredState } from "../kit/use-stored-state";

export type BoardStep = "study" | "recall" | "core" | "place";
export type EdgeStep = "edges" | "map";

export interface Saved {
  step: BoardStep;
  edgeStep: EdgeStep;
  recall: string;
  recallDone: boolean;
  recallChecked: string[];
  core: string | null;
  coreDone: boolean;
  rings: Record<string, RingId>;
  ringsDone: boolean;
  edges: string[];
  edgesDone: boolean;
  secondOrder: string | null;
  secondOrderDone: boolean;
  peeked: boolean;
}

export const STORAGE_KEY = "v-actor-workshop:v5";
export const EMPTY: Saved = {
  step: "study",
  edgeStep: "edges",
  recall: "",
  recallDone: false,
  recallChecked: [],
  core: null,
  coreDone: false,
  rings: {},
  ringsDone: false,
  edges: [],
  edgesDone: false,
  secondOrder: null,
  secondOrderDone: false,
  peeked: false,
};

const RING_IDS = new Set<string>(RINGS.map((r) => r.id));
const ACTOR_IDS = new Set<string>(WORKSHOP_ACTOR_IDS);
export const KEY_EDGE_IDS = EDGE_KEY.map((e) => edgeId(e.from, e.to));
const ABSENT = new Set<string>(ABSENT_ACTORS);
const BOARD_STEPS: BoardStep[] = ["study", "recall", "core", "place"];
const EDGE_STEPS: EdgeStep[] = ["edges", "map"];

function prune(raw: unknown): Saved {
  if (typeof raw !== "object" || raw === null) return EMPTY;
  const box = raw as Partial<Saved>;

  const rings: Record<string, RingId> = {};
  for (const id of WORKSHOP_ACTOR_IDS) {
    const ring = box.rings?.[id];
    if (typeof ring === "string" && RING_IDS.has(ring)) rings[id] = ring as RingId;
  }
  return {
    step: BOARD_STEPS.includes(box.step as BoardStep) ? (box.step as BoardStep) : "study",
    edgeStep: EDGE_STEPS.includes(box.edgeStep as EdgeStep)
      ? (box.edgeStep as EdgeStep)
      : "edges",
    recall: typeof box.recall === "string" ? box.recall : "",
    recallDone: box.recallDone === true,
    recallChecked: Array.isArray(box.recallChecked)
      ? box.recallChecked.filter(
          (x) => typeof x === "string" && RECALL_TARGET.items.some((i) => i.id === x),
        )
      : [],
    core:
      typeof box.core === "string" &&
      CORE_QUESTION.options.some((o) => o.id === box.core)
        ? box.core
        : null,
    coreDone: box.coreDone === true,
    rings,
    ringsDone: box.ringsDone === true,
    edges: Array.isArray(box.edges)
      ? [
          ...new Set(
            box.edges.filter(
              (e): e is string =>
                typeof e === "string" &&
                e.split(">").length === 2 &&
                e.split(">").every((id) => ACTOR_IDS.has(id)) &&
                e.split(">")[0] !== e.split(">")[1],
            ),
          ),
        ]
      : [],
    edgesDone: box.edgesDone === true,
    secondOrder:
      typeof box.secondOrder === "string" &&
      SECOND_ORDER.options.some((o) => o.id === box.secondOrder)
        ? box.secondOrder
        : null,
    secondOrderDone: box.secondOrderDone === true,
    peeked: box.peeked === true,
  };
}

export function useBoard() {
  return useStoredState(STORAGE_KEY, EMPTY, prune);
}

export function RosterGate({
  peeked,
  onPeek,
}: {
  peeked: boolean;
  onPeek: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setOpen((v) => !v);
            if (!open) onPeek();
          }}
        >
          {open ? <Lock className="size-3.5" aria-hidden /> : <Eye className="size-3.5" aria-hidden />}
          {open ? "Close the roster" : "Open the roster"}
        </Button>
        <p className="text-muted-foreground text-xs">
          {peeked
            ? "Opened during the workshop — the closing map says so."
            : "Closed since you started. Everything below is from memory."}
        </p>
      </div>
      {open ? <Roster /> : null}
    </>
  );
}

const CX = 480;
const CY = 350;
const RADII: Record<RingId, number> = {
  declares: 84,
  evidence: 150,
  verifies: 216,
  undeclared: 278,
};

const STAGING = 340;

export function Roster() {
  return (
    <div className="border-border bg-card space-y-3 rounded-xl border p-4">
      <ol className="space-y-3">
        {WORKSHOP_ACTORS.map((actor) => (
          <li key={actor.id} className="[&+li]:border-border [&+li]:border-t [&+li]:pt-3">
            <p className="text-sm font-semibold">{actor.name}</p>
            <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
              {actor.position}
              {actor.note ? ` ${actor.note}` : ""}
            </p>
          </li>
        ))}
      </ol>
      <div className="border-border border-t pt-3">
        <p className="eyebrow text-muted-foreground">
          Four rings: what part of a declaration you play
        </p>
        <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
          A verification regime runs on declarations — somebody states what
          they own and what they did with it, somebody else establishes the
          statement is true and complete. Every actor is somewhere in that.
        </p>
        <ol className="mt-2 space-y-1 text-sm">
          {RINGS.map((ring) => (
            <li key={ring.id}>
              <span className="font-medium">{ring.name}.</span>{" "}
              <span className="text-muted-foreground">{ring.test}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="border-border grid gap-3 border-t pt-3 sm:grid-cols-2">
        <div>
          <p className="eyebrow text-muted-foreground">Six functional roles</p>
          <ul className="mt-1.5 space-y-1 text-sm">
            {ACTOR_ROLES.map((role) => (
              <li key={role.id}>
                <span className="font-medium">{role.name}</span>{" "}
                <span className="text-muted-foreground">{role.question}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-muted-foreground">Five postures</p>
          <ul className="mt-1.5 space-y-1 text-sm">
            {ACTOR_POSTURES.map((posture) => (
              <li key={posture.id}>
                <span className="font-medium">{posture.name}</span>{" "}
                <span className="text-muted-foreground">{posture.means}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function edgeLabel(id: string): string {
  const [from = "", to = ""] = id.split(">");
  const name = (x: string) => MAP_LABEL[x as WorkshopActorId] ?? x;
  return `${name(from)} → ${name(to)}`;
}

export function BakerLine({ text, where }: { text: string; where: string }) {
  return (
    <p className="border-border text-muted-foreground mt-1.5 border-l-2 pl-3 text-xs leading-relaxed">
      “{text}” <span className="whitespace-nowrap">— Baker et al., {where}</span>
    </p>
  );
}

export const ROLE_TOKENS = [
  "var(--mod-0-text, #9a000c)",
  "var(--mod-1-text, #bf4f00)",
  "var(--mod-2-text, #946b00)",
  "var(--mod-3-text, #555e07)",
  "var(--mod-4-text, #3d75b1)",
];

export interface MapEdge {
  id: string;
  state: "drawn" | "right" | "wrong" | "missed";
}

interface MapPoint {
  x: number;
  y: number;
}

interface EdgeDraft extends MapPoint {
  from: WorkshopActorId;
  hover: WorkshopActorId | null;
  pointerId: number;
  startX: number;
  startY: number;
}

const NODE_HIT_RADIUS = 18;
const DRAG_THRESHOLD = 4;

function beamPath(
  from: MapPoint,
  to: MapPoint,
  control: MapPoint,
  endWidth = 4.5,
  middleWidth = 1.4,
): string {
  const normal = (dx: number, dy: number) => {
    const length = Math.hypot(dx, dy) || 1;
    return { x: -dy / length, y: dx / length };
  };
  const startNormal = normal(control.x - from.x, control.y - from.y);
  const endNormal = normal(to.x - control.x, to.y - control.y);
  const middleNormal = normal(to.x - from.x, to.y - from.y);
  const controlOffset = 2 * middleWidth - endWidth;
  return [
    `M ${from.x + startNormal.x * endWidth} ${from.y + startNormal.y * endWidth}`,
    `Q ${control.x + middleNormal.x * controlOffset} ${control.y + middleNormal.y * controlOffset}`,
    `${to.x + endNormal.x * endWidth} ${to.y + endNormal.y * endWidth}`,
    `L ${to.x - endNormal.x * endWidth} ${to.y - endNormal.y * endWidth}`,
    `Q ${control.x - middleNormal.x * controlOffset} ${control.y - middleNormal.y * controlOffset}`,
    `${from.x - startNormal.x * endWidth} ${from.y - startNormal.y * endWidth} Z`,
  ].join(" ");
}

function edgeControl(from: MapPoint, to: MapPoint): MapPoint {
  const middle = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  return {
    x: middle.x + (CX - middle.x) * 0.35,
    y: middle.y + (CY - middle.y) * 0.35,
  };
}

function arrowheadPath(control: MapPoint, to: MapPoint): string {
  const dx = to.x - control.x;
  const dy = to.y - control.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const nx = -uy;
  const ny = ux;
  const tip = { x: to.x - ux * 9, y: to.y - uy * 9 };
  const base = { x: tip.x - ux * 7, y: tip.y - uy * 7 };
  return `M ${tip.x} ${tip.y} L ${base.x + nx * 4} ${base.y + ny * 4} L ${base.x - nx * 4} ${base.y - ny * 4} Z`;
}

const EDGE_PAINT: Record<
  MapEdge["state"],
  { stroke: string; width: number; dash?: string; opacity: number }
> = {
  drawn: { stroke: "var(--primary)", width: 1.5, opacity: 0.75 },
  right: { stroke: "var(--comply)", width: 1.75, opacity: 0.9 },
  wrong: { stroke: "var(--defect)", width: 1.5, opacity: 0.85 },
  missed: { stroke: "var(--muted-foreground)", width: 1.25, dash: "4 4", opacity: 0.7 },
};

export function RingMap({
  rings,
  showKey = false,
  lens = null,
  edges = [],
  interactive = false,
  selectedSource = null,
  onSource,
  onToggleEdge,
}: {
  rings: Record<string, RingId>;
  showKey?: boolean;
  lens?: ActorRoleId | null;
  edges?: MapEdge[];
  interactive?: boolean;
  selectedSource?: WorkshopActorId | null;
  onSource?: (id: WorkshopActorId) => void;
  onToggleEdge?: (id: string) => void;
}) {
  const [draft, setDraft] = useState<EdgeDraft | null>(null);
  const lensIndex = lens ? ACTOR_ROLES.findIndex((r) => r.id === lens) : -1;
  const lensColor = lensIndex >= 0 ? ROLE_TOKENS[lensIndex % ROLE_TOKENS.length] : undefined;
  const canDraw = interactive && Boolean(onSource) && Boolean(onToggleEdge);

  const STEP_DEG = 360 / MAP_SLOTS.length;
  const angleOf = (id: string) => {
    const i = MAP_SLOTS.indexOf(id as never);
    return (-90 + STEP_DEG / 2 + STEP_DEG * i) * (Math.PI / 180);
  };

  const radiusOf = (id: string) => {
    const ring = rings[id];
    return ring ? RADII[ring] : STAGING;
  };
  const pointOf = (id: string): { x: number; y: number } | null => {
    if (!rings[id]) return null;
    const angle = angleOf(id);
    return { x: CX + Math.cos(angle) * radiusOf(id), y: CY + Math.sin(angle) * radiusOf(id) };
  };

  const pointerPoint = (event: ReactPointerEvent<SVGGElement>): MapPoint => {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;
    return {
      x: viewBox.x + ((event.clientX - rect.left) / rect.width) * viewBox.width,
      y: viewBox.y + ((event.clientY - rect.top) / rect.height) * viewBox.height,
    };
  };

  const nearestActor = (
    point: MapPoint,
    except: WorkshopActorId,
  ): WorkshopActorId | null => {
    let nearest: WorkshopActorId | null = null;
    let nearestDistance = NODE_HIT_RADIUS;
    for (const actor of WORKSHOP_ACTORS) {
      if (actor.id === except) continue;
      const actorPoint = pointOf(actor.id);
      if (!actorPoint) continue;
      const distance = Math.hypot(point.x - actorPoint.x, point.y - actorPoint.y);
      if (distance <= nearestDistance) {
        nearest = actor.id;
        nearestDistance = distance;
      }
    }
    return nearest;
  };

  const chooseActor = (id: WorkshopActorId) => {
    if (!canDraw) return;
    if (selectedSource && selectedSource !== id) {
      onToggleEdge?.(edgeId(selectedSource, id));
      return;
    }
    onSource?.(id);
  };

  const beginDraw = (
    id: WorkshopActorId,
    event: ReactPointerEvent<SVGGElement>,
  ) => {
    if (!canDraw || !rings[id]) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = pointerPoint(event);
    setDraft({
      from: id,
      hover: null,
      pointerId: event.pointerId,
      startX: point.x,
      startY: point.y,
      ...point,
    });
  };

  const moveDraw = (event: ReactPointerEvent<SVGGElement>) => {
    if (!draft || draft.pointerId !== event.pointerId) return;
    event.preventDefault();
    const point = pointerPoint(event);
    setDraft({
      ...draft,
      ...point,
      hover: nearestActor(point, draft.from),
    });
  };

  const finishDraw = (event: ReactPointerEvent<SVGGElement>) => {
    if (!draft || draft.pointerId !== event.pointerId) return;
    event.preventDefault();
    const point = pointerPoint(event);
    const moved =
      Math.hypot(point.x - draft.startX, point.y - draft.startY) >=
      DRAG_THRESHOLD;
    const target = nearestActor(point, draft.from);
    if (moved && target) {
      onSource?.(draft.from);
      onToggleEdge?.(edgeId(draft.from, target));
    } else if (moved) {
      onSource?.(draft.from);
    } else {
      chooseActor(draft.from);
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDraft(null);
  };

  const draftStart = draft ? pointOf(draft.from) : null;
  const draftTarget = draft?.hover ? pointOf(draft.hover) : null;
  const draftEnd = draftTarget ?? draft;
  const draftControl = draftStart && draftEnd
    ? edgeControl(draftStart, draftEnd)
    : null;
  const draftGeometry = draftStart && draftEnd && draftControl &&
    Math.hypot(draftEnd.x - draftStart.x, draftEnd.y - draftStart.y) > 1
    ? {
        beam: beamPath(draftStart, draftEnd, draftControl),
        arrow: arrowheadPath(draftControl, draftEnd),
      }
    : null;

  return (
    <div className="border-border bg-card mx-auto max-w-[860px] overflow-x-auto rounded-xl border p-2">
      <svg
        viewBox="0 2 960 696"
        className="mx-auto block h-auto w-full min-w-[560px]"
        role={canDraw ? "group" : "img"}
        aria-label={
          canDraw
            ? "Interactive actor map. Drag from an evidence source to the actor the evidence concerns, or select the two points in order."
            : "Concentric actor map: the regulated training run at the centre, actors on four rings around it — who declares, who holds evidence, who verifies, and what no declaration covers. Actors not yet placed wait outside the outer ring. Edges join actors that can produce evidence about one another."
        }
      >
        {[...RINGS].reverse().map((ring) => (
          <g key={ring.id}>
            <circle
              cx={CX}
              cy={CY}
              r={RADII[ring.id]}
              className="fill-none stroke-border"
              strokeWidth={1}
            />
            <text
              x={CX}
              y={CY - RADII[ring.id] - 10}
              textAnchor="middle"
              className="fill-muted-foreground"
              style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              {ring.name}
            </text>
          </g>
        ))}

        <circle cx={CX} cy={CY} r={4} className="fill-primary" />
        <text x={CX} y={CY + 20} textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>
          {CENTRE.label}
        </text>
        <text x={CX} y={CY + 34} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>
          {CENTRE.sub}
        </text>

        {edges.map((edge) => {
          const [from = "", to = ""] = edge.id.split(">");
          const a = pointOf(from);
          const b = pointOf(to);
          if (!a || !b) return null;
          const paint = EDGE_PAINT[edge.state];
          const control = edgeControl(a, b);
          const beam = beamPath(a, b, control);
          const arrow = arrowheadPath(control, b);
          return (
            <g key={`${edge.id}-${edge.state}`} opacity={paint.opacity}>
              <path
                d={beam}
                fill={paint.dash ? "none" : paint.stroke}
                stroke={paint.dash ? paint.stroke : "none"}
                strokeWidth={paint.width}
                strokeDasharray={paint.dash}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d={arrow} fill={paint.stroke} />
            </g>
          );
        })}

        {draftGeometry ? (
          <g className="pointer-events-none fill-primary" opacity={0.8}>
            <path d={draftGeometry.beam} />
            <path d={draftGeometry.arrow} />
          </g>
        ) : null}

        {WORKSHOP_ACTORS.map((actor) => {
          const ring = rings[actor.id];
          const staged = !ring;
          const angle = angleOf(actor.id);
          const r = radiusOf(actor.id);
          const x = CX + Math.cos(angle) * r;
          const y = CY + Math.sin(angle) * r;
          const outward = Math.cos(angle) >= 0 ? 1 : -1;
          const lit = lens ? (ROLE_KEY[actor.id] ?? []).includes(lens) : false;
          const absent = ABSENT.has(actor.id);
          const selected = canDraw && selectedSource === actor.id;
          const hovered = draft?.hover === actor.id;
          const actorIsInteractive = canDraw && !staged;
          return (
            <g
              key={actor.id}
              data-actor-id={actor.id}
              role={actorIsInteractive ? "button" : undefined}
              tabIndex={actorIsInteractive ? 0 : undefined}
              aria-pressed={actorIsInteractive ? selected : undefined}
              aria-label={
                actorIsInteractive
                  ? selectedSource && selectedSource !== actor.id
                    ? `Draw an edge from ${MAP_LABEL[selectedSource]} to ${MAP_LABEL[actor.id]}`
                    : `${MAP_LABEL[actor.id]}. Select as the evidence source.`
                  : undefined
              }
              className={actorIsInteractive ? "cursor-crosshair outline-none" : undefined}
              style={actorIsInteractive ? { touchAction: "none" } : undefined}
              onPointerDown={
                actorIsInteractive
                  ? (event) => beginDraw(actor.id, event)
                  : undefined
              }
              onPointerMove={actorIsInteractive ? moveDraw : undefined}
              onPointerUp={actorIsInteractive ? finishDraw : undefined}
              onPointerCancel={actorIsInteractive ? () => setDraft(null) : undefined}
              onKeyDown={
                actorIsInteractive
                  ? (event) => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      chooseActor(actor.id);
                    }
                  : undefined
              }
            >
              {actorIsInteractive ? (
                <circle
                  cx={x}
                  cy={y}
                  r={NODE_HIT_RADIUS}
                  fill="transparent"
                  pointerEvents="all"
                />
              ) : null}
              {selected || hovered ? (
                <circle
                  cx={x}
                  cy={y}
                  r={11}
                  className="fill-none stroke-primary"
                  strokeWidth={2}
                  strokeDasharray={hovered ? undefined : "3 2"}
                  pointerEvents="none"
                />
              ) : null}
              <circle
                cx={x}
                cy={y}
                r={absent ? 7 : lit ? 8 : staged ? 5 : 6.5}
                style={{
                  fill: absent
                    ? "none"
                    : lit
                      ? lensColor
                      : staged
                        ? "var(--muted-foreground)"
                        : "var(--foreground)",
                  stroke: absent ? "var(--muted-foreground)" : undefined,
                  strokeWidth: absent ? 1.25 : undefined,
                  strokeDasharray: absent ? "3 2" : undefined,
                }}
                opacity={lens && !lit ? 0.3 : 1}
                pointerEvents="none"
              />
              <text
                x={x + outward * 14}
                y={y + 3.5}
                textAnchor={outward > 0 ? "start" : "end"}
                style={{
                  fontSize: 11,
                  fontWeight: lit || selected ? 600 : 400,
                  fill: lit
                    ? lensColor
                    : staged
                      ? "var(--muted-foreground)"
                      : "var(--foreground)",
                  opacity: lens && !lit ? 0.35 : 1,
                  userSelect: "none",
                }}
                pointerEvents="none"
              >
                {MAP_LABEL[actor.id]}
              </text>
            </g>
          );
        })}
      </svg>
      {canDraw ? (
        <p
          className="text-muted-foreground px-2 pt-1 text-xs leading-relaxed"
          aria-live="polite"
        >
          {selectedSource
            ? `${MAP_LABEL[selectedSource]} is the source. Drag from it, or select a target point.`
            : "Drag from a source point to a target point, or select the two points in order."}
        </p>
      ) : null}
      {showKey ? (
        <p className="text-muted-foreground px-2 pt-1 pb-1 text-xs leading-relaxed">
          Rings run outward from the compute use the agreement forbids: who has
          to declare it, who holds evidence about the declaration, who checks
          it, and what no declaration covers. Anything still waiting outside
          the outer ring has not been placed. The centre is the paper’s own
          scope — “{CENTRE.baker.text}” (Baker et al., {CENTRE.baker.where}).
        </p>
      ) : null}
    </div>
  );
}
