"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  saveCapstoneSignup,
  withdrawCapstoneSignup,
} from "@/app/actions/verification-capstone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * The sign-up form: a brief from the bank, an idea of your own, or both.
 *
 * The picker carries slugs and titles only — the server re-validates the slug
 * against the bank, so an option edited in the DOM is dropped, not stored.
 * Neither field is required on its own; the action rejects the pair being
 * empty, and the form says so before the round-trip.
 */
export function SignupForm({
  themes,
  initialBrief,
  initialProposal,
  state,
}: {
  themes: { theme: string; briefs: { slug: string; title: string }[] }[];
  initialBrief: string;
  initialProposal: string;
  state: "new" | "submitted";
}) {
  const router = useRouter();
  const [brief, setBrief] = useState(initialBrief);
  const [proposal, setProposal] = useState(initialProposal);
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
        if (pending) return;
        if (!brief && !proposal.trim()) {
          setError("Choose a brief from the bank or describe your own idea — one of the two.");
          return;
        }
        run(() => saveCapstoneSignup(brief, proposal));
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="signup-brief">Brief from the bank</Label>
        <select
          id="signup-brief"
          className="border-input bg-transparent focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm shadow-xs focus-visible:ring-[3px]"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
        >
          <option value="">— none, I am proposing my own —</option>
          {themes.map((g) => (
            <optgroup key={g.theme} label={g.theme}>
              {g.briefs.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-proposal">
          Your own capstone idea
          <span className="text-muted-foreground font-normal">
            {" "}
            (optional if you chose a brief)
          </span>
        </Label>
        <Textarea
          id="signup-proposal"
          rows={6}
          maxLength={4000}
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          placeholder="What you would build or write, and what it would show."
        />
        <p className="text-muted-foreground text-sm">
          It has to be relevant to technical AI governance and aimed at an
          AI-safety-related theme.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : state === "submitted" ? "Save changes" : "Sign up"}
        </Button>
        {state === "submitted" ? (
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => run(withdrawCapstoneSignup)}
          >
            Withdraw
          </Button>
        ) : null}
      </div>

      {state === "submitted" ? (
        <p className="text-muted-foreground text-sm">
          You are on the sheet. Facilitators see your choice and your proposal.
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
    </form>
  );
}
