

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

export function edgeId(from: string, to: string): string {
  return `${from}>${to}`;
}

export interface EdgeScore {
  found: string[];
  missed: string[];
  reversed: string[];
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

export function scorePlacements<T extends string>(
  placed: Partial<Record<string, T>>,
  key: Record<string, T>,
  ids: readonly string[],
): { right: number; total: number } {
  let right = 0;
  for (const id of ids) if (placed[id] && placed[id] === key[id]) right += 1;
  return { right, total: ids.length };
}
