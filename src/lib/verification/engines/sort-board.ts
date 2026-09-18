import type {
  SortBoardDef,
  SortItem,
  SortPlacements,
  SortVerdict,
} from "@/lib/verification/data/sort-board";

export type { SortVerdict };

export interface SortNote {
  verdict: SortVerdict;
  msg: string;
}

export function verdictFor(item: SortItem, zoneId: string): SortVerdict {
  if (zoneId === item.zone) return "right";
  if (item.near && item.near[zoneId] !== undefined) return "defensible";
  return "miss";
}

export function noteFor(item: SortItem, zoneId: string): SortNote {
  const verdict = verdictFor(item, zoneId);
  if (verdict === "right") return { verdict, msg: item.ok };
  if (verdict === "defensible") return { verdict, msg: item.near![zoneId] };
  const msg =
    item.wrong && item.wrong[zoneId] !== undefined
      ? item.wrong[zoneId]
      : item.generic;
  return { verdict, msg };
}

export function gradeBoard(
  board: SortBoardDef,
  placements: SortPlacements
): Record<string, SortNote> {
  const out: Record<string, SortNote> = {};
  for (const item of board.items) {
    const zoneId = placements[item.id];
    if (zoneId) out[item.id] = noteFor(item, zoneId);
  }
  return out;
}

export interface SortScore {
  placed: number;
  total: number;
  right: number;
  defensible: number;
  miss: number;
}

export function scoreBoard(
  board: SortBoardDef,
  notes: Record<string, SortNote>
): SortScore {
  const score: SortScore = {
    placed: 0,
    total: board.items.length,
    right: 0,
    defensible: 0,
    miss: 0,
  };
  for (const item of board.items) {
    const note = notes[item.id];
    if (!note) continue;
    score.placed++;
    score[note.verdict]++;
  }
  return score;
}

export function allPlaced(
  board: SortBoardDef,
  placements: SortPlacements
): boolean {
  return board.items.every((item) => Boolean(placements[item.id]));
}

export function isSolved(
  board: SortBoardDef,
  placements: SortPlacements
): boolean {
  return board.items.every((item) => placements[item.id] === item.zone);
}

export function prunePlacements(
  raw: unknown,
  board: SortBoardDef
): SortPlacements {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const zones = new Set(board.zones.map((zone) => zone.id));
  const items = new Set(board.items.map((item) => item.id));
  const out: SortPlacements = {};
  for (const [itemId, zoneId] of Object.entries(
    raw as Record<string, unknown>
  )) {
    if (typeof zoneId !== "string") continue;
    if (items.has(itemId) && zones.has(zoneId)) out[itemId] = zoneId;
  }
  return out;
}

export function itemsIn(
  board: SortBoardDef,
  placements: SortPlacements,
  zoneId: string
): SortItem[] {
  return board.items.filter((item) => placements[item.id] === zoneId);
}

export function unplaced(
  board: SortBoardDef,
  placements: SortPlacements
): SortItem[] {
  return board.items.filter((item) => !placements[item.id]);
}

export function scoreText(score: SortScore): string {
  const parts = [
    `${score.right} of ${score.total} filed where the sources file them`,
  ];
  if (score.defensible > 0) {
    parts.push(
      score.defensible === 1
        ? "1 defensible elsewhere"
        : `${score.defensible} defensible elsewhere`,
    );
  }
  if (score.miss > 0) parts.push(`${score.miss} to reconsider`);
  return parts.join(" · ");
}
