
import {
  CARDS,
  CONFIG,
  NEEDS,
  READERS,
  cardById,
  type ReaderId,
} from "../data/report-constructor";

export type ThreadMap = Map<string, Set<ReaderId>>;

export interface Verdict {
  card: string;
  title: string;
  reader: ReaderId;
  ok: boolean;
  note: string;
}

export interface FitResult {
  verdicts: Verdict[];
  needsMet: Set<string>;
  dead: string[];
  misfits: number;
  buried: ReaderId[];
  clean: boolean;
}

export function evaluate(sel: string[], threads: ThreadMap): FitResult {
  const verdicts: Verdict[] = [];
  const needsMet = new Set<string>();
  const dead: string[] = [];
  const misfitCount: Record<ReaderId, number> = {
    committee: 0,
    authority: 0,
    cell: 0,
  };
  let misfits = 0;

  sel.forEach((cardId) => {
    const set = threads.get(cardId);
    const c = cardById[cardId];
    if (!set || set.size === 0) {
      dead.push(cardId);
      return;
    }
    set.forEach((readerId) => {
      const f = c.fits[readerId];
      verdicts.push({
        card: cardId,
        title: c.title,
        reader: readerId,
        ok: f.ok,
        note: f.note,
      });
      if (!f.ok) {
        misfits++;
        misfitCount[readerId]++;
      }
    });
  });

  NEEDS.forEach((n) => {
    const hit = n.cover.some(
      (cardId) =>
        sel.includes(cardId) &&
        !!threads.get(cardId) &&
        threads.get(cardId)!.has(n.aud) &&
        cardById[cardId].fits[n.aud].ok,
    );
    if (hit) needsMet.add(n.id);
  });

  const buried = READERS.filter(
    (r) => misfitCount[r.id] >= CONFIG.buriedAt,
  ).map((r) => r.id);
  const clean =
    needsMet.size === NEEDS.length && misfits === 0 && dead.length === 0;

  return { verdicts, needsMet, dead, misfits, buried, clean };
}

export function threadTotal(sel: string[], threads: ThreadMap): number {
  return sel.reduce(
    (n, id) => n + (threads.get(id) ? threads.get(id)!.size : 0),
    0,
  );
}

export function fitsOf(cardId: string): ReaderId[] {
  return READERS.filter((r) => cardById[cardId].fits[r.id].ok).map((r) => r.id);
}

export function isTrap(cardId: string): boolean {
  return READERS.every((r) => !cardById[cardId].fits[r.id].ok);
}

export { CARDS, NEEDS, READERS, CONFIG };
