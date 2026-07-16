// Extracts the machine-usable pieces (total /45 and band label) from the
// grader's markdown report. The full markdown is kept as the feedback body.

export interface ParsedVerdict {
  /** Total score out of 45 (may be fractional after N/A rescaling). */
  score: number;
  /** Band label from the verdict line, e.g. "Strong" — may be empty. */
  band: string;
}

const VERDICT_RE = /(\d+(?:\.\d+)?)\s*\/\s*45\s*(?:—|–|-)?\s*([^.\n]*)/u;

export function parseVerdict(markdown: string): ParsedVerdict | null {
  // Prefer the Verdict section; fall back to the first "/45" anywhere.
  const verdictSection = markdown.split(/##\s*Verdict/iu)[1] ?? markdown;
  const match = verdictSection.match(VERDICT_RE) ?? markdown.match(VERDICT_RE);
  if (!match) return null;
  const score = Number(match[1]);
  if (!Number.isFinite(score) || score < 0 || score > 45) return null;
  return { score, band: (match[2] ?? "").trim() };
}
