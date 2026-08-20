"use client";

import { VERIFICATION_PROBLEM as C } from "@/lib/verification/data/verification-problem";
import type { VerificationWidgetProps } from "../kit/types";

/**
 * The verification problem as four buckets in descending order, exactly the
 * owner's text (2026-08-20) and nothing else: no eyebrow, no scenario title,
 * no summaries, no inspect-to-reveal. Each bucket is one bordered card whose
 * lead is the question and whose body is her answer. Unbridged reading.
 */
export function VerificationProblem(_: VerificationWidgetProps) {
  void _;
  return (
    <div className="not-prose my-6 space-y-3">
      {C.buckets.map((bucket) => (
        <div
          key={bucket.question}
          className="border-border bg-card rounded-xl border p-4 text-sm leading-relaxed"
        >
          <span className="font-semibold">{bucket.question}</span>{" "}
          <span className="text-foreground/90">{bucket.text}</span>
        </div>
      ))}
    </div>
  );
}
