"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { decideApplication } from "@/app/actions/verification-application";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { STATUS_WORD } from "@/lib/verification/application";

const DECISIONS = ["accepted", "waitlisted", "declined"] as const;

/**
 * One application, and the three decisions a reviewer can record against it.
 *
 * Deciding is a single press with no confirm step because it is reversible —
 * pressing another decision overwrites the first, and the row keeps who
 * decided and when. The note is the reviewers' own; the applicant is never
 * shown it, so it is the place for the reason a status word cannot carry.
 */
export function DecisionRow({
  id,
  status,
  note,
  name,
  email,
  submittedAt,
  decidedAt,
  decidedBy,
  answers,
}: {
  id: string;
  status: string;
  note: string;
  name: string | null;
  email: string;
  submittedAt: string;
  decidedAt: string | null;
  decidedBy: string | null;
  answers: Record<string, string>;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(note);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const answered = Object.entries(answers).filter(([, v]) => v);

  function decide(next: (typeof DECISIONS)[number]) {
    setError(null);
    startTransition(async () => {
      const res = await decideApplication(id, next, draft);
      if (res.ok) router.refresh();
      else setError(res.error);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-medium">{name || email}</span>
        {name ? (
          <span className="text-muted-foreground text-sm">{email}</span>
        ) : null}
        <span className="text-muted-foreground ml-auto text-xs">
          applied {submittedAt.slice(0, 10)}
        </span>
      </div>

      <p className="text-muted-foreground text-sm">
        {STATUS_WORD[status] ?? status}
        {decidedAt
          ? ` · ${decidedAt.slice(0, 10)}${decidedBy ? ` by ${decidedBy}` : ""}`
          : ""}
      </p>

      {answered.length ? (
        <dl className="space-y-3">
          {answered.map(([prompt, value]) => (
            <div key={prompt}>
              <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {prompt}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed whitespace-pre-line">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-muted-foreground text-sm italic">
          No written answers — the application asked none.
        </p>
      )}

      <Textarea
        rows={2}
        placeholder="Reviewers' note. The applicant never sees this."
        value={draft}
        maxLength={2000}
        onChange={(e) => setDraft(e.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        {DECISIONS.map((d) => (
          <Button
            key={d}
            size="sm"
            variant={status === d ? "default" : "outline"}
            disabled={pending}
            onClick={() => decide(d)}
          >
            {STATUS_WORD[d] ?? d}
          </Button>
        ))}
      </div>

      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}
