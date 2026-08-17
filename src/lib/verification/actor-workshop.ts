/**
 * The Actor Map Workshop's judgements, kept out of the component so they can
 * be tested. See data/actor-workshop.ts for what the workshop is and where
 * every piece of it came from.
 */

import type { ActorMapEntry } from "./data/actor-map";

/** Punctuation and case removed; the learner is recalling, not spelling. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/**
 * Free recall, marked leniently and on purpose.
 *
 * The step asks "who does a pause agreement touch?" and the learner types
 * names. Marking that strictly would fail somebody who wrote "cloud" for
 * "AWS, Azure, Google Cloud, Oracle, Alibaba", which is the right answer said
 * shorter — and the point of the step is what they retrieved, not how they
 * spelled it.
 *
 * A line hits an actor on any of three tests, and the length floors on two of
 * them are the whole difficulty:
 *
 *   1. the line and the name are the same string — which is what lets a short
 *      name like "AMD" or "ASML" count at all;
 *   2. one contains the other AND the contained side is four characters or
 *      more. Without that floor a learner who typed "and" hit "Product
 *      builders and deployers", because a stopword is genuinely a substring
 *      of half the roster. The unit test that caught it stays;
 *   3. they share a word of four letters or more — same floor, same reason.
 *
 * `aliases` carries the words the roster does not: a learner writes "cloud
 * providers", the roster row is five company names. They are the lesson's own
 * vocabulary for the same row, never a new actor.
 */
const MIN_MATCH = 4;
export function recallHits(
  lines: string[],
  actors: ActorMapEntry[],
  aliases: Record<string, string[]> = {},
): Set<string> {
  const hit = new Set<string>();
  const typed = lines.map(normalize).filter(Boolean);
  if (typed.length === 0) return hit;

  for (const actor of actors) {
    const candidates = [actor.name, ...(aliases[actor.id] ?? [])].map(normalize);
    for (const line of typed) {
      const lineWords = new Set(
        line.split(" ").filter((w) => w.length >= MIN_MATCH),
      );
      const matched = candidates.some((cand) => {
        if (!cand) return false;
        if (cand === line) return true;
        if (line.includes(cand) && cand.length >= MIN_MATCH) return true;
        if (cand.includes(line) && line.length >= MIN_MATCH) return true;
        return cand
          .split(" ")
          .some((w) => w.length >= MIN_MATCH && lineWords.has(w));
      });
      if (matched) {
        hit.add(actor.id);
        break;
      }
    }
  }
  return hit;
}

/**
 * A categorization is right when it names the same set, not a subset.
 *
 * Partial credit would reward the reflex the section is written against —
 * naming a cloud provider's one obvious role and stopping. "Almost every
 * important actor" holds several, so the answer is the set or it is not the
 * answer, and the reveal shows which ones were missed and which were extra.
 */
export function sameSet(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  const left = new Set(a);
  return b.every((x) => left.has(x));
}

export interface SetDiff {
  missed: string[];
  extra: string[];
  right: boolean;
}

export function diffSet(
  chosen: readonly string[],
  key: readonly string[],
): SetDiff {
  const picked = new Set(chosen);
  const answer = new Set(key);
  return {
    missed: key.filter((x) => !picked.has(x)),
    extra: chosen.filter((x) => !answer.has(x)),
    right: sameSet(chosen, key),
  };
}

/** How many of `ids` the learner placed on the ring the key gives them. */
export function scorePlacements<T extends string>(
  placed: Partial<Record<string, T>>,
  key: Record<string, T>,
  ids: readonly string[],
): { right: number; total: number } {
  let right = 0;
  for (const id of ids) if (placed[id] && placed[id] === key[id]) right += 1;
  return { right, total: ids.length };
}
