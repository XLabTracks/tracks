"use client";

import { useMemo } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useStoredState } from "../kit/use-stored-state";
import { shuffleAnswerOptions } from "@/lib/shuffle";
import { splitEmphasis } from "@/lib/verification/emphasis";
import { cn } from "@/lib/utils";
import { QUICK_QUESTIONS } from "@/lib/verification/data/policy-quick-check";
import type { VerificationWidgetProps } from "../kit/types";

/** Display letters, which is now all a letter is. */
const SLOT = "ABCDE";

/**
 * Authored `**bold**`, kept.
 *
 * Her specs mark the phrase a question turns on — the statute, the guide, the
 * standard — and a stem that names one source among three reads flat without
 * it. Text runs, never dangerouslySetInnerHTML: the data is in-repo curriculum
 * and would be safe either way, but there is no reason for this to be the one
 * place that can inject markup.
 */
function Rich({ children }: { children: string }) {
  return (
    <>
      {splitEmphasis(children).map((run, i) =>
        run.strong ? (
          <strong key={i} className="font-semibold">
            {run.text}
          </strong>
        ) : (
          <span key={i}>{run.text}</span>
        ),
      )}
    </>
  );
}

/**
 * 2.4.2 — On Paper. Five single-answer questions, answered in one pass.
 *
 * All five are on the page at once and one Submit marks them all. That is the
 * commit-before-reveal rule and it also makes the deck fast: no waiting for a
 * verdict between questions, and no chance to learn the pattern from question
 * one and coast.
 *
 * Nothing is labelled before submission — not the source, not what the
 * question is testing. Recognising which of three texts a question comes from
 * is half of answering it.
 *
 * On submission each question shows whether it was right, why, and the passage
 * the answer rests on, and the deck shows the total. The score records nothing
 * and completes nothing: the exercise is optional and unbridged like the rest
 * of the section's labs.
 *
 * The options are shuffled, seeded on each question's own id, so the order is
 * stable for everybody and across visits (src/lib/shuffle.ts says why) and the
 * pick is stored by choice id — nothing about the shuffle reaches storage. The
 * badge therefore shows the letter of the SLOT and not the choice's id, which
 * happens to be a..d and would print as a list labelled B, D, A, C. And no
 * explanation may name an option by its letter, because a letter is a
 * position; answer-order.test.ts fails on one that does.
 */


interface Saved {
  picks: Record<string, string>;
  submitted: boolean;
}

// v2: the deck was replaced wholesale, so the old picks mean nothing.
const STORAGE_KEY = "v-policy-quick-check:v2";
const EMPTY: Saved = { picks: {}, submitted: false };

function prune(raw: unknown): Saved {
  const box = (
    typeof raw === "object" && raw !== null ? raw : {}
  ) as Partial<Saved>;
  const picks: Record<string, string> = {};
  for (const question of QUICK_QUESTIONS) {
    const pick = box.picks?.[question.id];
    if (
      typeof pick === "string" &&
      question.choices.some((c) => c.id === pick)
    ) {
      picks[question.id] = pick;
    }
  }
  return { picks, submitted: box.submitted === true };
}

// The host's props are taken and not used. The spec is explicit that the score
// records nothing toward completion, and today it cannot: the registry has this
// id unbridged and useVerificationCompletion hands an unbridged widget a no-op.
// Calling it anyway would leave a trap for whoever flips that flag — an optional
// exercise that quietly starts reporting a section finished. Same shape as
// whistleblower-levers next door.
export function PolicyQuickCheck({}: VerificationWidgetProps) {
  const [saved, persist, hydrated] = useStoredState(STORAGE_KEY, EMPTY, prune);

  // Seeded on the question id, so this is the same list on the server, on the
  // client, and on the learner's next visit. useMemo is for the work, not for
  // the stability — the seed already guarantees that.
  const shown = useMemo(
    () =>
      QUICK_QUESTIONS.map((question) => ({
        question,
        choices: shuffleAnswerOptions(
          question.id,
          question.choices,
          (c) => c.text,
        ).map((s) => s.item),
      })),
    [],
  );

  if (!hydrated) return <div className="not-prose my-6 min-h-64" aria-busy />;

  const answered = QUICK_QUESTIONS.filter((q) => saved.picks[q.id]).length;
  const right = QUICK_QUESTIONS.filter(
    (q) => saved.picks[q.id] === q.answerId
  ).length;

  return (
    <div className="not-prose my-6 space-y-4">
      {/* One box, not five.
          Each question used to be its own bordered card, which put three rings
          around every option: the fold, the card, the option. Boxes were doing
          work that hierarchy does better and cheaper — the questions are a set,
          and a set reads as a set through spacing, a number and a hairline
          between members. The rule is the finishing seam, not the structure:
          the first question has none, because there is nothing above it to be
          separated from.

          --border was 1.09:1 against this ground and 1.35 at night, which is
          to say invisible — fine for a hairline that merely closes a card the
          reader can already see, and useless as the only thing dividing one
          question from the next. Mixed toward
          the foreground until it reads: 2.5:1 in day, 3.6 at night. */}
      <ol>
        {shown.map(({ question, choices }, index) => {
          const pick = saved.picks[question.id];
          const correct = pick === question.answerId;
          return (
            <li
              key={question.id}
              className="[&+li]:border-muted-foreground/60 [&+li]:mt-6 [&+li]:border-t [&+li]:pt-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                {/* A subheading, not a tag. With the question cards gone this
                    is the only thing that says where one question starts, so
                    it has to carry that weight: a real heading element, in the
                    body colour, one step ABOVE the text under it. At text-sm
                    it sat level with the option rows and the stem, which is a
                    label — a heading has to be the largest thing in its block
                    or it is not doing the job the boxes used to do.
                    An <h4> is safe here: the lesson's own section nav is
                    compiled from the MDX at build time and never looks at
                    widget DOM. */}
                <h4 className="text-base font-semibold">
                  Question {index + 1}/{QUICK_QUESTIONS.length}
                </h4>
                {saved.submitted ? (
                  <p
                    className={cn(
                      "flex items-center gap-1.5 text-[11px] tracking-wide",
                      correct ? "text-comply" : "text-defect"
                    )}
                  >
                    {correct ? (
                      <CircleCheck className="size-3.5 shrink-0" aria-hidden />
                    ) : (
                      <CircleAlert className="size-3.5 shrink-0" aria-hidden />
                    )}
                    {correct ? "Correct" : "Not quite"}
                  </p>
                ) : null}
              </div>

              <div className="border-border mt-2 space-y-2 border-l-2 pl-3 text-sm leading-relaxed">
                <p>
                  <Rich>{question.fragment}</Rich>
                </p>
                {question.facts ? (
                  <ul className="list-disc space-y-1 pl-5">
                    {question.facts.map((f) => (
                      <li key={f}>
                        <Rich>{f}</Rich>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {question.fragmentAfter ? (
                  <p>
                    <Rich>{question.fragmentAfter}</Rich>
                  </p>
                ) : null}
              </div>
              <p className="mt-3 text-sm font-medium">
                <Rich>{question.stem}</Rich>
              </p>

              <div
                className="mt-3 grid gap-1.5"
                role="radiogroup"
                aria-label={question.stem}
              >
                {choices.map((choice, slot) => {
                  const chosen = pick === choice.id;
                  const isAnswer = choice.id === question.answerId;
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      role="radio"
                      aria-checked={chosen}
                      disabled={saved.submitted}
                      onClick={() =>
                        persist((prev) => ({
                          ...prev,
                          picks: { ...prev.picks, [question.id]: choice.id },
                        }))
                      }
                      className={cn(
                        "border-border block w-full rounded-lg border px-3 py-2 text-left text-sm leading-relaxed transition-colors",
                        !saved.submitted && "hover:bg-muted",
                        chosen &&
                          !saved.submitted &&
                          "border-primary bg-primary/5",
                        saved.submitted &&
                          isAnswer &&
                          "border-comply bg-comply/5",
                        saved.submitted &&
                          chosen &&
                          !isAnswer &&
                          "border-defect bg-defect/5",
                        saved.submitted && !isAnswer && !chosen && "opacity-55"
                      )}
                    >
                      {/* The letter is a prefix in the sentence, not a token
                          beside it. As a fixed-width flex item in a ring it
                          cost the option a hanging indent and, worse, left the
                          text sized to a fraction of the row it was in: a
                          610px option wrapped inside 353px of column. Reading
                          runs the full width now, and the letter reads the way
                          the spec writes it — "A. Keep the protected-person…". */}
                      <span className="text-muted-foreground mr-1.5 font-medium">
                        {SLOT[slot]}.
                      </span>
                      <Rich>{choice.text}</Rich>
                    </button>
                  );
                })}
              </div>

              {saved.submitted ? (
                <div className="mt-3 space-y-1.5">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    <Rich>{question.explanation}</Rich>
                  </p>
                  {/* Where to go back to, which is more use after the fact
                      than a label naming what the question was testing. */}
                  <p className="text-muted-foreground text-xs">
                    <span className="font-medium">Source: </span>
                    {question.source}
                  </p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs" aria-live="polite">
          {saved.submitted
            ? `${right} of ${QUICK_QUESTIONS.length}.`
            : `${answered} of ${QUICK_QUESTIONS.length} answered.`}
        </p>
        {saved.submitted ? (
          <Button size="sm" variant="outline" onClick={() => persist(() => EMPTY)}>
            Start over
          </Button>
        ) : (
          <Button
            size="sm"
            disabled={answered < QUICK_QUESTIONS.length}
            onClick={() => persist((prev) => ({ ...prev, submitted: true }))}
          >
            Check all five
          </Button>
        )}
      </div>
    </div>
  );
}
