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
/* One row of the printed picker. The radio lives inside the label so the row
   is the click target and arrow keys walk the group; the sheet link sits
   outside the label so reading a brief never changes the selection. */
function BriefRow({
  selected,
  onPick,
  title,
  slug,
}: {
  selected: boolean;
  onPick: () => void;
  title: string;
  slug?: string;
}) {
  return (
    <div
      className={
        "flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm " +
        "has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-2 " +
        (selected
          ? "border-primary/50 bg-primary/5"
          : "hover:bg-muted border-transparent")
      }
    >
      <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 select-none">
        <input
          type="radio"
          name="signup-brief"
          className="sr-only"
          checked={selected}
          onChange={onPick}
        />
        <span aria-hidden="true" className="text-primary w-4 shrink-0 text-center">
          {selected ? "✓" : ""}
        </span>
        <span className="min-w-0 flex-1">{title}</span>
      </label>
      {slug ? (
        <a
          href={`/verification/capstone-bank#${slug}`}
          target="_blank"
          rel="noopener"
          className="text-muted-foreground hover:text-foreground shrink-0 text-xs underline underline-offset-2"
        >
          sheet
        </a>
      ) : null}
    </div>
  );
}

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
      {/* Choosing a capstone is a comparison, so every brief is printed and
          picked by row — never folded into a native dropdown. The list
          scrolls in its own box; the page never grows by 79 rows. The check
          glyph rides with the tint so selection never reads by hue alone. */}
      <fieldset className="space-y-2">
        <legend className="text-sm leading-none font-medium">Brief from the bank</legend>
        <div className="border-input max-h-80 space-y-4 overflow-y-auto rounded-md border p-3">
          <BriefRow
            selected={brief === ""}
            onPick={() => setBrief("")}
            title="— none, I am proposing my own —"
          />
          {themes.map((g) => (
            <div key={g.theme}>
              <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase select-none">
                {g.theme}
              </p>
              <div className="mt-1.5 space-y-1">
                {g.briefs.map((b) => (
                  <BriefRow
                    key={b.slug}
                    selected={brief === b.slug}
                    onPick={() => setBrief(b.slug)}
                    title={b.title}
                    slug={b.slug}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

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
