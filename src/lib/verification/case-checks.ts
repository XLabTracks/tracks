
export type CheckSeverity = "ok" | "warn" | "bad";

export interface CaseCheck {
  id: string;
  severity: CheckSeverity;
  message: string;
}

export interface CaseFields {
  insider: string;
  information: string;
  route: string;
  failure: string;
}

export function toCaseFields(values: Record<string, string | undefined>): CaseFields {
  return {
    insider: values.insider ?? "",
    information: values.information ?? "",
    route: values.route ?? "",
    failure: values.failure ?? "",
  };
}

const WORD = /[^\s]+/g;

export function wordCount(text: string): number {
  return (text.trim().match(WORD) ?? []).length;
}

const UNTRUE =
  /\b(lied|lying|lies|fabricat\w*|made it up|invent\w*|false|untrue|mistaken|wrong about)\b/i;
const FORBIDDEN =
  /\b(not allowed to report|forbidden to report|prohibited from report\w*|illegal to report|cannot legally report|barred from report\w*)\b/i;
const IGNORED =
  /\b(ignor\w+|disregard\w+|does not care|doesn't care|no one cares|nobody cares)\b/i;

const MECHANISM =
  /\b(because|since|so that|therefore|which means|cannot|can't|has no|no authority|no route|not permitted to share|outside|belongs to|requires|without)\b/i;

const HOW_KNOWN =
  /\b(saw|watched|read|ran|signed|processed|administer\w*|logged|reviewed|attended|received|monitored|handled|audited|configured|approved|was told|overheard|holds?|has access)\b/i;

function words(text: string): Set<string> {
  return new Set(
    (text.toLowerCase().match(/[a-z][a-z-]{3,}/g) ?? []).filter(
      (w) => !STOP.has(w),
    ),
  );
}

const STOP = new Set([
  "that",
  "this",
  "with",
  "from",
  "they",
  "them",
  "their",
  "have",
  "been",
  "were",
  "would",
  "could",
  "which",
  "what",
  "when",
  "where",
  "about",
  "into",
  "then",
  "than",
  "there",
  "these",
  "those",
  "will",
  "does",
  "report",
  "reports",
  "reported",
  "reporting",
]);

export function runCaseChecks(
  raw: Partial<CaseFields>,
  bounds: { min: number; max: number },
): CaseCheck[] {
  const fields = toCaseFields(raw);
  const out: CaseCheck[] = [];
  const entries = Object.entries(fields) as [keyof CaseFields, string][];
  const blank = entries.filter(([, v]) => !v.trim()).map(([k]) => LABEL[k]);
  const total = entries.reduce((sum, [, v]) => sum + wordCount(v), 0);

  out.push({
    id: "fields",
    severity: blank.length ? "bad" : "ok",
    message: blank.length
      ? `Still empty: ${blank.join(", ")}. A case is not a case until all four are answered.`
      : "All four parts of the case are answered.",
  });

  if (total === 0) return out;

  out.push({
    id: "length",
    severity:
      total >= bounds.min && total <= bounds.max
        ? "ok"
        : total < bounds.min
          ? "bad"
          : "warn",
    message:
      total >= bounds.min && total <= bounds.max
        ? `${total} words — inside ${bounds.min}–${bounds.max}.`
        : total < bounds.min
          ? `${total} words. The brief asks for ${bounds.min}–${bounds.max}; under that, a case is usually a sketch of one.`
          : `${total} words, over ${bounds.max}. Nothing is truncated — but the extra is rarely the case and usually the discussion.`,
  });

  const failure = fields.failure;
  if (failure.trim()) {
    const excluded: string[] = [];
    if (UNTRUE.test(failure)) excluded.push("the allegation being false or mistaken");
    if (FORBIDDEN.test(failure)) excluded.push("reporting being forbidden");
    if (IGNORED.test(failure)) excluded.push("the verifier ignoring it");
    out.push({
      id: "excluded",
      severity: excluded.length ? "warn" : "ok",
      message: excluded.length
        ? `Your failure point reads as ${excluded.join(", or ")}. The brief rules those out — condition 1 says the allegation is accurate and condition 2 says the disclosure is permitted, so a failure that contradicts them is a different case. (Looked for words like lied, false, forbidden, ignored.)`
        : "The failure does not rest on the allegation being false, on reporting being forbidden, or on the verifier ignoring it.",
    });

    out.push({
      id: "mechanism",
      severity: MECHANISM.test(failure) ? "ok" : "warn",
      message: MECHANISM.test(failure)
        ? "The failure point gives a reason, not only a verdict."
        : "The failure point may be a verdict rather than a mechanism. Looked for because / cannot / has no / outside / belongs to / requires. Say what stops the report, not that it stopped.",
    });
  }

  if (fields.information.trim()) {
    out.push({
      id: "how-known",
      severity: HOW_KNOWN.test(fields.information) ? "ok" : "warn",
      message: HOW_KNOWN.test(fields.information)
        ? "The information says how the insider knows it."
        : "It may not say how the insider knows. Looked for saw / read / ran / signed / processed / was told / has access. What they know and how they know it are two different claims.",
    });
  }

  if (fields.failure.trim() && (fields.insider.trim() || fields.information.trim())) {
    const source = words(`${fields.insider} ${fields.information}`);
    const shared = [...words(fields.failure)].filter((w) => source.has(w));
    out.push({
      id: "consistency",
      severity: shared.length ? "ok" : "warn",
      message: shared.length
        ? `The failure is about this case: it reuses ${shared.slice(0, 3).join(", ")}.`
        : "The failure may not be about this case. Rough check: it shares no substantive word with the insider or the information. A failure that would read the same under any case is usually a generality.",
    });
  }

  return out;
}

const LABEL: Record<keyof CaseFields, string> = {
  insider: "Insider",
  information: "Information",
  route: "Reporting route",
  failure: "Failure point",
};
