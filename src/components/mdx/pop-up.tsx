"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * The pop-up the outline keeps asking for — `[POP UP]` beside a definition the
 * learner should open, `[interactive pop-up]` beside a prompt they should
 * answer before they are told the point. Both were shipping as literal square
 * brackets in the prose, so this is the component those markers become.
 *
 * Two modes, chosen by the data rather than a flag:
 *
 *   <PopUp label="Identity">…the definition…</PopUp>
 *
 * opens straight onto its body. Give it `ask`, and the body becomes the reveal
 * that waits behind those questions:
 *
 *   <PopUp label="Everything comes with a cost" ask={["…", "…"]}>…</PopUp>
 *
 * One question at a time, nothing auto-advances, and the reveal is reachable
 * only after every question has an answer — committing before the answer is
 * the whole pedagogy of the second shape, and a Next that skips ahead throws
 * it away.
 *
 * Answers live in component state for the session. They are the learner's own
 * thinking rather than course work, they feed no meter and complete nothing,
 * so there is nothing here to persist; wire them to the notebook if that ever
 * changes, not to progress.
 *
 * Trap: the dialog portals out of `.lesson-body`, so no `prose` rule reaches
 * it. Type inside has to be stated, not inherited.
 */
export interface PopUpProps {
  /** The trigger's text — a real name or the prompt's own opening line. */
  label: string;
  /** Questions answered in order before the body is revealed. Omit for a plain pop-up. */
  ask?: string[];
  children: ReactNode;
}

export function PopUp({ label, ask, children }: PopUpProps) {
  const questions = ask ?? [];
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<string[]>(() => questions.map(() => ""));
  const [step, setStep] = useState(0);

  const revealed = step >= questions.length;
  const current = answers[step] ?? "";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        // Reopening resumes at the first unanswered question, or at the
        // reveal once they all have one: closing the card mid-thought must
        // not cost the learner what they already wrote.
        if (!next || !questions.length) return;
        const unanswered = answers.findIndex((answer) => !answer.trim());
        setStep(unanswered === -1 ? questions.length : unanswered);
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "not-prose border-border bg-card hover:bg-muted my-2 inline-flex max-w-full",
            "items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm",
            "font-medium transition-colors select-none",
          )}
        >
          <Plus className="text-muted-foreground size-4 shrink-0" aria-hidden />
          <span className="min-w-0">{label}</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          {questions.length ? (
            <DialogDescription>
              {revealed
                ? `${questions.length} of ${questions.length} answered`
                : `Question ${step + 1} of ${questions.length}`}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        {questions.length ? (
          <div className="space-y-4">
            {/* Dots and a fraction: past about six the dots stop being
                countable, so the fraction above carries the count. */}
            <div className="flex gap-1.5" aria-hidden>
              {questions.map((question, i) => (
                <span
                  key={question}
                  className={cn(
                    "h-1.5 flex-1 rounded-full",
                    i < step || revealed ? "bg-primary" : "bg-muted",
                  )}
                />
              ))}
            </div>

            {revealed ? (
              <>
                <ol className="space-y-3">
                  {questions.map((question, i) => (
                    <li key={question} className="text-sm">
                      <p className="text-muted-foreground">{question}</p>
                      <p className="mt-1 whitespace-pre-wrap">{answers[i]}</p>
                    </li>
                  ))}
                </ol>
                <div className="border-border border-t pt-4 text-sm leading-relaxed">
                  {children}
                </div>
              </>
            ) : (
              <>
                <p className="text-sm leading-relaxed">{questions[step]}</p>
                <Textarea
                  value={current}
                  onChange={(event) =>
                    setAnswers((prev) =>
                      prev.map((a, i) => (i === step ? event.target.value : a)),
                    )
                  }
                  rows={3}
                  aria-label={questions[step]}
                />
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    disabled={!current.trim()}
                    onClick={() => setStep(step + 1)}
                  >
                    {step + 1 === questions.length ? "Answer" : "Next"}
                    <ArrowRight className="size-4" aria-hidden />
                  </Button>
                  {current.trim() ? null : (
                    <span className="text-muted-foreground text-xs">
                      Write an answer to continue.
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-sm leading-relaxed">{children}</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
