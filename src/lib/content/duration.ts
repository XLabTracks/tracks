/**
 * How long an item is advertised to take.
 *
 * Minutes are what the content graph stores, and they stop reading as time
 * somewhere around an hour: "Estimated time: 180 mins" makes the reader do
 * the division, and 3.0's assignment — read a working paper, then answer four
 * questions with page references — is genuinely that long.
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `~${minutes} min`;
  const quarters = Math.round(minutes / 15);
  const frac = ["", "¼", "½", "¾"][quarters % 4];
  return `~${Math.floor(quarters / 4)}${frac} h`;
}
