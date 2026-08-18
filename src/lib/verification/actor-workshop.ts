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

/**
 * An edge's identity on the board.
 *
 * Direction is part of it, and deliberately: the edge means "A can put
 * something in front of a Verifier about B", so A → B and B → A are different
 * claims and only one of them is usually true.
 */
export function edgeId(from: string, to: string): string {
  return `${from}>${to}`;
}

export interface EdgeScore {
  /** Key edges the learner drew. */
  found: string[];
  /** Key edges they did not. */
  missed: string[];
  /** Drawn the right pair, the wrong way round. Told apart from a plain
      miss because it is a different mistake: the actors are right and the
      claim about who holds evidence about whom is inverted. */
  reversed: string[];
  /** Drawn, not in the key, and not a reversal of one. */
  extra: string[];
}

export function scoreEdges(
  drawn: readonly string[],
  key: readonly string[],
): EdgeScore {
  const made = new Set(drawn);
  const answer = new Set(key);
  const flip = (id: string) => {
    const [from = "", to = ""] = id.split(">");
    return edgeId(to, from);
  };

  const found = key.filter((id) => made.has(id));
  const missed = key.filter((id) => !made.has(id));
  const surplus = drawn.filter((id) => !answer.has(id));
  // A reversal only counts as one where the correct direction was NOT also
  // drawn — somebody who drew both has the right edge plus a wrong one, and
  // calling the wrong one "reversed" would read as praise.
  const reversed = surplus.filter(
    (id) => answer.has(flip(id)) && !made.has(flip(id)),
  );
  const reversedSet = new Set(reversed);
  return {
    found,
    missed,
    reversed,
    extra: surplus.filter((id) => !reversedSet.has(id)),
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
