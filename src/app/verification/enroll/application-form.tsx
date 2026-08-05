"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  submitApplication,
  withdrawApplication,
} from "@/app/actions/verification-application";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ApplicationQuestion } from "@/lib/verification/application";

/**
 * The application form: one field per question in the list it is handed.
 *
 * The list is the contract — the server rebuilds the answer map from the same
 * questions and drops anything else — so this component never names a question
 * and an empty list is a valid form (name and email come from the account).
 *
 * Trap: the name and email shown here are not submitted. They are read from
 * the account server-side, so editing the DOM changes what you see and nothing
 * that is stored; the fields are disabled to say so.
 */
export function ApplicationForm({
  questions,
  initial,
  name,
  email,
  state,
}: {
  questions: ApplicationQuestion[];
  initial: Record<string, string>;
  name: string;
  email: string;
  state: "new" | "submitted";
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(fn: () => Promise<{ ok: true } | { ok: false; error: string }>) {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (res.ok) router.refresh();
      else setError(res.error);
    });
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (!pending) run(() => submitApplication(values));
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="applicant-name">Name</Label>
          <Input id="applicant-name" value={name} disabled readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="applicant-email">Email</Label>
          <Input id="applicant-email" value={email} disabled readOnly />
        </div>
      </div>
      <p className="text-muted-foreground -mt-4 text-sm">
        Read from your account. Change them on{" "}
        <a className="underline underline-offset-4" href="/account">
          your account page
        </a>
        .
      </p>

      {questions.map((q) => (
        <div key={q.id} className="space-y-2">
          <Label htmlFor={`q-${q.id}`}>
            {q.prompt}
            {q.required ? null : (
              <span className="text-muted-foreground font-normal"> (optional)</span>
            )}
          </Label>
          {q.kind === "long" ? (
            <Textarea
              id={`q-${q.id}`}
              rows={5}
              maxLength={q.max}
              value={values[q.id] ?? ""}
              onChange={(e) => setValues({ ...values, [q.id]: e.target.value })}
            />
          ) : (
            <Input
              id={`q-${q.id}`}
              maxLength={q.max}
              value={values[q.id] ?? ""}
              onChange={(e) => setValues({ ...values, [q.id]: e.target.value })}
            />
          )}
          {q.hint ? (
            <p className="text-muted-foreground text-sm">{q.hint}</p>
          ) : null}
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending
            ? "Sending…"
            : state === "submitted"
              ? "Save changes"
              : "Submit application"}
        </Button>
        {state === "submitted" ? (
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => run(withdrawApplication)}
          >
            Withdraw
          </Button>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
    </form>
  );
}
