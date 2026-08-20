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

/**
 * 1.2's actor board: the parts both halves of the workshop need.
 *
 * WHY THERE ARE TWO HALVES. The workshop was one seven-step widget in 1.2 and
 * the lesson measured 77 minutes, against a 40-minute ceiling the course owner
 * set. Splitting it is not a cut: the board — study, recall, the centre, the
 * placement — stays in 1.2, and the mechanisms half moves to its own item,
 * 1.2.2, where it has room instead of being the tail of a long lesson. The
 * Categorize step went for real, because the drill bench's `actors` deck was
 * already drilling the same six roles five screens further down the page.
 *
 * ONE DOCUMENT, TWO WIDGETS. Both read and write `v-actor-workshop:v5`, so a
 * board placed in 1.2 arrives in 1.2.2 already keyed, and reopening either
 * page shows the work. Each half keeps its own cursor (`step` and `edgeStep`)
 * because they are separate pages and a learner may be on either.
 *
 * 1.2.2 STANDS ALONE. A learner who lands there without doing 1.2 sees the
 * key placement rather than an empty sheet, and is told that is what it is.
 * That is the honest degradation: the edge exercise is about mechanisms, and
 * making it unusable until somebody has done a different page would be a
 * gate, not a lesson.
 */

export type BoardStep = "study" | "recall" | "core" | "place";
export type EdgeStep = "edges" | "map";

export interface Saved {
  /** Where the board half (1.2) is. */
  step: BoardStep;
  /** Where the mechanisms half (1.2.2) is. Its own cursor, because they are
      two pages and a learner may be sitting on either one. */
  edgeStep: EdgeStep;
  /** Free recall, one actor per line. */
  recall: string;
  /** Whether Recall has been marked — the reveal is one-way, like a commit. */
  recallDone: boolean;
  /** Which of the six key items the learner says they retrieved. */
  recallChecked: string[];
  core: string | null;
  coreDone: boolean;
  rings: Record<string, RingId>;
  ringsDone: boolean;
  /** Drawn edges, as `from>to`. Direction is the claim — see edgeId. */
  edges: string[];
  edgesDone: boolean;
  secondOrder: string | null;
  secondOrderDone: boolean;
  /** The roster was reopened mid-workshop. Reported, never punished. */
  peeked: boolean;
}

// v2: step 2 stopped asking "who does this agreement touch" and started
// asking what one actor can do. A restored v1 draft would be an answer to a
// question that is no longer on screen.
//
// v3: the rings are Baker's frame now and the four ids all changed, so a
// restored v2 map would be ten placements on rings that no longer exist.
// prune() would drop them one by one and hand back a half-built map with no
// explanation; a new key throws the whole document away at once, which is the
// honest version of the same thing.
//
// v4: the board went from ten actors to seventeen — the six states of the
// lesson's Table 2 and the verification body that does not exist. A restored
// v3 document survives prune intact and is worse for it: a map that reports
// itself finished with seven actors unplaced, and a categorize step whose
// answers are for a set that no longer exists.

//
// v5: the workshop is two widgets on two pages now and the Categorize step
// is gone, so `roles`/`postures`/`catDone` have nowhere to be read and a
// second cursor arrived. Restoring a v4 document would carry answers to a
// step that no longer exists.
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
  const edgesDone = box.edgesDone === true;
  return {
    step: BOARD_STEPS.includes(box.step as BoardStep) ? (box.step as BoardStep) : "study",
    // The map step reads a committed board; without one it has nothing to
    // show and no way forward, so an un-committed document opens on the
    // drawing step whatever cursor it stored.
    edgeStep:
      edgesDone && EDGE_STEPS.includes(box.edgeStep as EdgeStep)
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
    // Only pairs of real actors survive, and only one of each. A stored edge
    // that names an actor the roster has dropped would draw a line to nowhere.
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
    edgesDone,
    secondOrder:
      typeof box.secondOrder === "string" &&
      SECOND_ORDER.options.some((o) => o.id === box.secondOrder)
        ? box.secondOrder
        : null,
    secondOrderDone: box.secondOrderDone === true,
    peeked: box.peeked === true,
  };
}

/** The one hook both halves use. Same key, same prune, same document. */
export function useBoard() {
  return useStoredState(STORAGE_KEY, EMPTY, prune);
}

/**
 * The freeze control and the roster it opens.
 *
 * Both halves carry it, because both are answered from memory and the honest
 * version of a freeze is a button that works and is recorded. Taking it flips
 * `peeked`, which the closing summary says out loud.
 */
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


/* Ring geometry. Four bands and a core dot, drawn once and read at every
   later step, so the numbers live here rather than inside the component.

   THE SHEET GREW WITH THE CAST. At ten actors the bands sat 52 units apart,
   which was already less than a label is wide — it worked because ten dots
   rarely put two labels on the same horizontal line. Seventeen do, and no
   amount of reordering the slots fixes it: a dot on the inner ring and one
   two slots along on the next ring out can land at the same height, and then
   their labels are 52 units apart with 64 units of text between them. The
   fix is not a cleverer order, it is a bigger sheet. Bands are 66 apart now
   and the box is 960 units wide, which clears the longest label on the
   outermost ring with room to spare. Measured at 1440, 1024 and 760px: no
   two labels overlap by a pixel. */
const CX = 480;
const CY = 350;
const RADII: Record<RingId, number> = {
  declares: 84,
  evidence: 150,
  verifies: 216,
  undeclared: 278,
};

/* WHERE AN ACTOR SITS BEFORE IT HAS BEEN PLACED.
   The sheet used to be empty until step 4 — four bare circles and a dot in
   the middle for the first three steps, which on a big canvas reads as a
   broken widget rather than as an invitation. It is also not how the paper
   workshop this is built on works: the stakeholders are on the table from the
   first minute, written on stickers, off to one side, and placing them IS the
   step. So every unplaced actor sits out here, and moves inward when the
   learner places it.
   No ring is drawn at this radius on purpose. There are four rings and a
   fifth circle would say there are five; what marks this band is that it is
   outside every ring, which is a position rather than a colour. */
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
      {/* THE RINGS ARE STUDY MATERIAL AND HAVE TO BE HERE.
          They were not, and that was a hole in the freeze rather than a
          missing nicety: step 4 asks for them from memory, and until this
          panel carried them the four names first appeared as button labels
          on the step that marks you for knowing them. The old rings were
          derived from the lesson's own position table, so a reader could at
          least reconstruct them; Baker's are new material in 1.2 — the paper
          is optional reading a module earlier and required reading a module
          later — so nothing on the page taught them.
          The four subgoals are deliberately NOT here: the edge step never
          asks the learner to produce one, the key assigns them, and they
          open that step in the open. */}
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

/* ------------------------------------------------------------------ steps -- */


export function edgeLabel(id: string): string {
  const [from = "", to = ""] = id.split(">");
  const name = (x: string) => MAP_LABEL[x as WorkshopActorId] ?? x;
  return `${name(from)} → ${name(to)}`;
}

/** One Baker sentence, printed the way a quotation should be: attributed. */
export function BakerLine({ text, where }: { text: string; where: string }) {
  return (
    <p className="border-border text-muted-foreground mt-1.5 border-l-2 pl-3 text-xs leading-relaxed">
      “{text}” <span className="whitespace-nowrap">— Baker et al., {where}</span>
    </p>
  );
}

/**
 * Step 6 — draw the edges.
 *
 * DRAW ON THE GRAPH, WITH THE TWO CHIP ROWS AS A FALLBACK. A pointer can drag
 * from source to target, while click/tap and keyboard input select the same
 * two endpoints in sequence. The visible dots are large enough to read and
 * each has a larger invisible hit target. The chip rows below the graph stay
 * in sync, so direct manipulation is not the only way to answer.
 *
 * Direction is visible in the arrowhead and repeated in the row headings,
 * because it is the whole content of the exercise: which of the two actors
 * is the one that cannot keep the fact to itself.
 */

export const ROLE_TOKENS = [
  "var(--mod-0-text, #9a000c)",
  "var(--mod-1-text, #bf4f00)",
  "var(--mod-2-text, #946b00)",
  "var(--mod-3-text, #555e07)",
  "var(--mod-4-text, #3d75b1)",
];

/**
 * The artifact: concentric rings with the regulated act at the centre.
 *
 * Angles are fixed per actor rather than computed from whatever is placed, so
 * a dot never jumps sideways when its neighbour is placed — the map is being
 * built, and a layout that reflows under the builder's hand is unreadable.
 * Labels anchor away from the centre, which is the only thing that keeps ten
 * of them apart at this size.
 */
export interface MapEdge {
  /** `from>to`, the same id the step stores. */
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

/** Half-width of a beam at its widest — the flare under each endpoint dot.
    The arrowhead's barbs take exactly this width, so the head is the flare's
    own ending rather than a second shape sitting on it. */
const BEAM_END_WIDTH = 4.5;

/** The same pinched connector used by the landing-page skill tree. Its two
 * quadratic flanks flare into the endpoint dots and narrow at mid-flight. */
function beamPath(
  from: MapPoint,
  to: MapPoint,
  control: MapPoint,
  endWidth = BEAM_END_WIDTH,
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

function edgeControl(from: MapPoint, to: MapPoint, bend = 0): MapPoint {
  const middle = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  const pulled = {
    x: middle.x + (CX - middle.x) * 0.35,
    y: middle.y + (CY - middle.y) * 0.35,
  };
  if (!bend) return pulled;
  // Perpendicular to the edge's own direction of travel, so the two arrows
  // of an opposite-direction pair bend to opposite sides of their chord.
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  return {
    x: pulled.x + (-dy / length) * bend,
    y: pulled.y + (dx / length) * bend,
  };
}

/* The head is quiver's, in the same family as the beams: nothing about it
   is uniform-width. Two barbs sweep back from the point, their front edges
   bowed in toward the shaft, tapering to nothing at the barb tips, with the
   mass sitting at the point — the swallow-wing head rather than a flat
   triangle. Its barbs are exactly BEAM_END_WIDTH off the axis and the SHAFT
   STOPS IN ITS NOTCH: the beam is trimmed to end where the head's rear
   cutout is, so the last stretch of every edge is the head alone. Earlier
   heads sat on top of a beam that ran on beneath them to the dot, and the
   coloured flare peeking around the ink was mush, not an arrow. It is solid
   ink whatever the beam under it wears: the beam's hue and dash carry the
   verdict, the head only carries direction, and a state-coloured head
   drowned in its own beam (a dashed beam's flared outline even read as a
   hollow dashed head). Ink, not literal black — theme.css owns the colours,
   and a #000 head would vanish on the night theme. */
const HEAD_TIP_INSET = 7; // the tip rests on the dot's rim (dot radius 6.5)
const HEAD_LENGTH = 8; // tip to barb tips
const HEAD_NOTCH = 5.2; // tip to the rear notch the shaft tucks into

function arrowheadPath(control: MapPoint, to: MapPoint): string {
  const dx = to.x - control.x;
  const dy = to.y - control.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const nx = -uy;
  const ny = ux;
  const tip = { x: to.x - ux * HEAD_TIP_INSET, y: to.y - uy * HEAD_TIP_INSET };
  // A point `back` units behind the tip, `side` units off the axis.
  const at = (back: number, side: number) =>
    `${tip.x - ux * back + nx * side} ${tip.y - uy * back + ny * side}`;
  return [
    `M ${tip.x} ${tip.y}`,
    `Q ${at(4, 1.1)} ${at(HEAD_LENGTH, BEAM_END_WIDTH)}`, // up the concave front edge to the barb tip
    `L ${at(HEAD_NOTCH, 0)}`, // into the rear notch
    `L ${at(HEAD_LENGTH, -BEAM_END_WIDTH)}`, // out to the other barb
    `Q ${at(4, -1.1)} ${tip.x} ${tip.y}`, // and back along the far front edge
    "Z",
  ].join(" ");
}

/** Where a beam must stop so the head takes over: `p` pulled back along its
    approach (toward the curve's control point) to the head's rear notch. */
function trimForHead(p: MapPoint, control: MapPoint): MapPoint {
  const dx = control.x - p.x;
  const dy = control.y - p.y;
  const length = Math.hypot(dx, dy) || 1;
  const d = Math.min(HEAD_TIP_INSET + HEAD_NOTCH, length / 2);
  return { x: p.x + (dx / length) * d, y: p.y + (dy / length) * d };
}

/** Four states, four treatments, and never colour alone — a missed edge is
    dashed as well as pale, a wrong one is solid in the defect hue, and the
    verdict list under the step names every one of them in words. */
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
  onSource?: (id: WorkshopActorId | null) => void;
  onToggleEdge?: (id: string) => void;
}) {
  const [draft, setDraft] = useState<EdgeDraft | null>(null);
  const lensIndex = lens ? ACTOR_ROLES.findIndex((r) => r.id === lens) : -1;
  const lensColor = lensIndex >= 0 ? ROLE_TOKENS[lensIndex % ROLE_TOKENS.length] : undefined;
  const canDraw = interactive && Boolean(onSource) && Boolean(onToggleEdge);

  /* Angle comes from the actor's fixed slot in MAP_SLOTS and nothing else.
     It was computed per ring from RING_KEY once, which was wrong twice over:
     the layout then encoded the answer (a dot at the angle of a ring it was
     not on), and a learner's wrong placement put two dots at the same point,
     because the angle belonged to one ring and the radius to another. Fixed
     angles reflow never and leak nothing.
     The slot list is a second array rather than the roster order because the
     roster is grouped the way the lesson introduces actors, which puts seven
     consecutive slots on the evidence ring — seven labels along one arc of
     one circle. See its comment in the data file. */
  const STEP_DEG = 360 / MAP_SLOTS.length;
  const angleOf = (id: string) => {
    const i = MAP_SLOTS.indexOf(id as never);
    // Half a step off top dead centre, so the twelve-o'clock position stays
    // free for each ring's own name — the first two actors were landing on
    // "RUNS IT" and reading as one line of text.
    return (-90 + STEP_DEG / 2 + STEP_DEG * i) * (Math.PI / 180);
  };

  /** Where an actor's dot is. Unplaced actors are in the staging band, so
      this never returns null — but an edge to a staged actor is still not
      drawn, because a line to something nobody has placed claims nothing. */
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

  /* A drawn edge finishes the pair and DISARMS the source. The source used
     to stay armed for chaining — and that was a trap with no way out:
     clicking dots pair by pair drew a stray edge from the old source at
     every second pair, and no graph gesture could switch or clear the
     source (clicking any other dot drew from it instead). "Select one
     point and then another" is what the instructions promise, so that is
     what the gestures do; fanning several edges out of one actor is what
     dragging and the chip rows are for. Re-clicking the armed dot clears
     it — the escape hatch aria-pressed was already claiming. */
  const chooseActor = (id: WorkshopActorId) => {
    if (!canDraw) return;
    if (selectedSource === id) {
      onSource?.(null);
      return;
    }
    if (selectedSource) {
      onToggleEdge?.(edgeId(selectedSource, id));
      onSource?.(null);
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
      // Same rule as the click gesture: a completed edge disarms. A drag
      // never reads the armed source anyway — it starts from whatever dot
      // is under the pointer — so arming after one only set the click trap.
      onToggleEdge?.(edgeId(draft.from, target));
      onSource?.(null);
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
        beam: beamPath(draftStart, trimForHead(draftEnd, draftControl), draftControl),
        arrow: arrowheadPath(draftControl, draftEnd),
      }
    : null;

  return (
    <div className="border-border bg-card mx-auto max-w-[860px] overflow-x-auto rounded-xl border p-2">
      {/* The viewBox is cropped to the drawing, not to a round number.
          Content spans y 10..690 — the staging band at the top down to the
          same band at the bottom — and the top edge is 2 rather than 10
          because an 11px label's ascenders reach above its baseline. */}
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
            {/* The name rides just OUTSIDE its ring, not inside it.
                Inside, it shared a line with any actor placed near twelve
                o'clock, and two of them always are: the dots nearest the top
                sit 18° off it, which on the innermost ring is twenty pixels.
                "DECLARES" and "Frontier labs" printed on top of each other,
                and so did "OUTSIDE THE DECLARATION" and "Deployers".
                Eight pixels above the line puts the two on different lines
                with 15px of clearance at the worst radius, and — unlike
                every alternative that moves the label around the circle —
                it never depends on where anything has been placed, so the
                map still cannot reflow under the builder's hand or leak the
                key through its own layout. */}
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

        {/* Edges go under the dots and over the rings. Like the landing skill
            tree, each beam flares beneath its endpoint dots and pinches in
            the middle; a small arrowhead before the target keeps direction
            visible without changing that silhouette.

            Opposite directions between one pair are a quiver's case, and
            they render the way quiver draws them. With the same verdict the
            two claims merge into a single beam with an arrowhead at each
            end; with different verdicts the two curves bend apart, each
            keeping its own arrowhead and paint — so the learner's solid
            arrow and the key's dashed one sit side by side instead of
            stacking into one smudge. The data never merges: A>B and B>A
            stay two ids, two claims, two rows in the verdict. */}
        {edges.map((edge) => {
          const [from = "", to = ""] = edge.id.split(">");
          const a = pointOf(from);
          const b = pointOf(to);
          if (!a || !b) return null;
          const partner = edges.find((e) => e.id === edgeId(to, from));
          const twoHeaded = partner !== undefined && partner.state === edge.state;
          // A merged pair is drawn once, from its lexicographically first id.
          if (twoHeaded && edgeId(to, from) < edge.id) return null;
          const paint = EDGE_PAINT[edge.state];
          const control = edgeControl(
            a,
            b,
            partner !== undefined && !twoHeaded ? 12 : 0,
          );
          // The shaft ends in the head's notch — see arrowheadPath.
          const beam = beamPath(
            twoHeaded ? trimForHead(a, control) : a,
            trimForHead(b, control),
            control,
          );
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
              <path d={arrowheadPath(control, b)} className="fill-foreground" />
              {twoHeaded ? (
                <path d={arrowheadPath(control, a)} className="fill-foreground" />
              ) : null}
            </g>
          );
        })}

        {draftGeometry ? (
          <g className="pointer-events-none fill-primary" opacity={0.8}>
            <path d={draftGeometry.beam} />
            <path d={draftGeometry.arrow} className="fill-foreground" />
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
          // The one actor that is on the board in order to be absent is drawn
          // hollow and dashed. Shape, never colour alone — its label says
          // "none" in words, and the edge step states outright that it can
          // hold no edge rather than leaving an empty row to be interpreted.
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
                    : selected
                      ? `${MAP_LABEL[actor.id]}. Clear the selected source.`
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
