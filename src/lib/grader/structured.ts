import { RUBRIC_CRITERIA } from "./rubric";
import type { LengthClass } from "./prompts";
import type { CriterionResult } from "./parse";

const CRITERION_IDS = RUBRIC_CRITERIA.map((criterion) => criterion.id);

/** Strict response contract sent to OpenRouter-compatible providers. */
export const GRADER_RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    criteria: {
      type: "array",
      minItems: 7,
      maxItems: 7,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string", enum: CRITERION_IDS },
          score: {
            anyOf: [
              { type: "integer", minimum: 0, maximum: 3 },
              { type: "null" },
            ],
          },
          evidence: {
            type: "array",
            minItems: 0,
            maxItems: 3,
            items: { type: "string", maxLength: 500 },
          },
          rationale: { type: "string", maxLength: 1200 },
        },
        required: ["id", "score", "evidence", "rationale"],
      },
    },
    fixes: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: { type: "string", maxLength: 1200 },
    },
    assessment: { type: "string", maxLength: 1200 },
  },
  required: ["criteria", "fixes", "assessment"],
} as const;

export interface StructuredGrade {
  score: number;
  band: string;
  criteria: CriterionResult[];
  /** Canonical, backwards-compatible report persisted on Submission. */
  markdown: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function cleanLine(value: string, max: number): string {
  return value
    .replace(/<\/?analysis>/giu, "analysis")
    .replace(/[\r\n]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim()
    .slice(0, max);
}

function cleanMarkdown(value: string, max: number): string {
  return value.replace(/<\/?analysis>/giu, "analysis").trim().slice(0, max);
}

function jsonText(content: string): string {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/iu);
  return fenced?.[1] ?? trimmed;
}

function bandFor(score: number): string {
  if (score >= 38) return "GiveWell-tier";
  if (score >= 28) return "Strong";
  if (score >= 18) return "Standard";
  if (score >= 8) return "Persuasive";
  return "Opaque assertion";
}

function expectedFixCount(lengthClass: LengthClass): number {
  return { short: 1, medium: 2, long: 3 }[lengthClass];
}

/**
 * Validates the model's JSON, recomputes the weighted /45 score locally, and
 * renders the existing markdown storage contract. The model never gets to
 * choose its total or band, and malformed/duplicate criterion rows fail.
 */
export function parseStructuredGrade(
  content: string,
  lengthClass: LengthClass,
): StructuredGrade | null {
  let raw: unknown;
  try {
    raw = JSON.parse(jsonText(content));
  } catch {
    return null;
  }
  if (!isRecord(raw) || !Array.isArray(raw.criteria)) return null;
  if (!Array.isArray(raw.fixes) || typeof raw.assessment !== "string") {
    return null;
  }
  if (raw.criteria.length !== CRITERION_IDS.length) return null;

  const seen = new Set<string>();
  const criteria: CriterionResult[] = [];
  for (const value of raw.criteria) {
    if (!isRecord(value) || typeof value.id !== "string") return null;
    if (!CRITERION_IDS.includes(value.id as (typeof CRITERION_IDS)[number])) {
      return null;
    }
    if (seen.has(value.id)) return null;
    if (
      value.score !== null &&
      (!Number.isInteger(value.score) || Number(value.score) < 0 || Number(value.score) > 3)
    ) {
      return null;
    }
    if (!Array.isArray(value.evidence) || value.evidence.length > 3) return null;
    if (!value.evidence.every((item) => typeof item === "string")) return null;
    if (typeof value.rationale !== "string") return null;
    seen.add(value.id);
    const evidence = value.evidence
      .map((item) => cleanLine(item, 500))
      .filter(Boolean)
      .map((item) => `“${item}”`)
      .join(" | ");
    criteria.push({
      id: value.id,
      score: value.score as number | null,
      evidence: evidence || null,
      rationale: cleanLine(value.rationale, 1200),
    });
  }
  criteria.sort((a, b) => a.id.localeCompare(b.id));
  if (criteria.some((criterion, index) => criterion.id !== CRITERION_IDS[index])) {
    return null;
  }
  // A short response never owes a document-level summary. Enforce the prompt's
  // class rule server-side so model drift cannot penalize it on C1.
  if (lengthClass === "short") criteria[0].score = null;

  let earned = 0;
  let possible = 0;
  for (const criterion of criteria) {
    if (criterion.score == null) continue;
    const weight = RUBRIC_CRITERIA.find((item) => item.id === criterion.id)?.weight;
    if (!weight) return null;
    earned += criterion.score * weight;
    possible += 3 * weight;
  }
  if (possible === 0) return null;
  const score = Math.round(((earned / possible) * 45) * 10) / 10;
  const band = bandFor(score);

  const fixes = raw.fixes
    .filter((fix): fix is string => typeof fix === "string")
    .map((fix) => cleanMarkdown(fix, 1200))
    .filter(Boolean)
    .slice(0, expectedFixCount(lengthClass));
  if (fixes.length === 0) return null;
  const assessment = cleanMarkdown(raw.assessment, 1200);
  if (!assessment) return null;

  const analysis = criteria
    .map(
      (criterion) => `### ${criterion.id}\nScore: ${criterion.score ?? "N/A"}\nEvidence: ${criterion.evidence ?? "none found"}\nRationale: ${criterion.rationale || "No rationale supplied."}`,
    )
    .join("\n\n");
  const fixHeading =
    fixes.length === 1 ? "## Top fix" : `## Top ${fixes.length} highest-leverage fixes`;
  const fixBody =
    fixes.length === 1
      ? fixes[0]
      : fixes.map((fix, index) => `${index + 1}. ${fix}`).join("\n");
  const scoreText = Number.isInteger(score) ? String(score) : score.toFixed(1);
  const markdown = `<analysis>\n${analysis}\n</analysis>\n\n${fixHeading}\n${fixBody}\n\n## Verdict\n${scoreText}/45 — ${band}. ${assessment}`;

  return { score, band, criteria, markdown };
}
