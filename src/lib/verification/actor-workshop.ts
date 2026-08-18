/**
 * The Actor Map Workshop's judgements, kept out of the component so they can
 * be tested. See data/actor-workshop.ts for what the workshop is and where
 * every piece of it came from.
 */

/* `normalize` and `recallHits` lived here and are gone. They marked step 2
   when it asked for the cast by name; the step asks for material now and the
   learner scores it against a printed key, so there is nothing to match. The
   matcher, its four-character containment floor and the test that forced it
   are in the history — see docs/verification/module-1-log.md. */

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
