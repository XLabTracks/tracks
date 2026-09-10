import { ROUNDS, type EvaderRound } from "../data/monitor-evader";

export type EvaderPicks = Record<string, string>;

export function roundAt(index: number): EvaderRound | undefined {
  return ROUNDS[index];
}

export function isCommitted(picks: EvaderPicks, roundId: string): boolean {
  return typeof picks[roundId] === "string" && picks[roundId].length > 0;
}

export function pickedOption(round: EvaderRound, picks: EvaderPicks) {
  const id = picks[round.id];
  return round.options.find((option) => option.id === id);
}

export function firstOpenRound(picks: EvaderPicks): number {
  const index = ROUNDS.findIndex((round) => !isCommitted(picks, round.id));
  return index === -1 ? ROUNDS.length - 1 : index;
}

export function committedCount(picks: EvaderPicks): number {
  return ROUNDS.filter((round) => isCommitted(picks, round.id)).length;
}

export function matchedCount(picks: EvaderPicks): number {
  return ROUNDS.filter((round) => {
    const option = pickedOption(round, picks);
    return option?.right === true;
  }).length;
}

export function allCommitted(picks: EvaderPicks): boolean {
  return committedCount(picks) === ROUNDS.length;
}

export function prunePicks(picks: EvaderPicks): EvaderPicks {
  const out: EvaderPicks = {};
  for (const round of ROUNDS) {
    const id = picks[round.id];
    if (round.options.some((option) => option.id === id)) out[round.id] = id;
  }
  return out;
}
