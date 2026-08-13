"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ACTORS,
  CATS,
  DOC,
  ORDER,
  PROTOCOL_ACTORS_COPY,
  QUIZ,
  type ActorCat,
} from "@/lib/verification/data/protocol-actors";
import type { VerificationWidgetProps } from "../kit/types";

const C = PROTOCOL_ACTORS_COPY;

type Mode = "learn" | "quiz";

/** Answered-quiz record: which option indices were picked, and the tally. */
interface Answered {
  picked: number[];
  right: number;
  total: number;
}

/**
 * The three actor categories, one brand token each.
 *
 * They used to borrow the game-payoff tokens — states→`--hide`,
 * industry→`--exaggerate`, institutions→`--comply`. Those alias the same
 * hues today, so it looked right, and it was still wrong twice over: a cast
 * list is a categorical key and takes the module hues (`--mod-N-text`, built
 * to read as type on every ground), and naming an actor category "hide" ties
 * it to a payoff scale that a game demo is free to recolour out from under it.
 *
 * `--mod-N-text` and not `--mod-N`: one token colours the dot AND the word, so
 * the hue sits on a coloured label rather than on a bare dot beside grey text.
 * The hex is the day value mirrored from theme.css, for the rare render with
 * no theme attached — same contract as interactive-map and mechanism-sort.
 *
 * Hue is never the encoding. Every appearance carries the category's own
 * words, which is what high contrast relies on: it paints all five module
 * tokens white on purpose, so there the label is the whole key.
 */
const CAT_TOKEN: Record<ActorCat, string> = {
  steel: "var(--mod-4-text, #3d75b1)", // Cobalt
  ind: "var(--mod-2-text, #946b00)", // Lunar Yellow
  inst: "var(--mod-3-text, #555e07)", // Khaki
};

/** The one token, plus the tint and edge a highlighted phrase derives from it. */
function catVars(cat: ActorCat): CSSProperties {
  const c = CAT_TOKEN[cat];
  return {
    "--cat": c,
    "--cat-tint": `color-mix(in oklch, ${c} 12%, transparent)`,
    "--cat-tint-hi": `color-mix(in oklch, ${c} 22%, transparent)`,
    "--cat-edge": `color-mix(in oklch, ${c} 55%, transparent)`,
  } as CSSProperties;
}

/** Phrase highlight in learn mode. Reads the vars `catVars` puts on the node. */
const CAT_HL =
  "bg-[var(--cat-tint)] border-[var(--cat-edge)] hover:bg-[var(--cat-tint-hi)]";

/**
 * "Who's in the Treaty?" — the MIRI draft agreement (arXiv:2511.10783)
 * re-read as a cast list.
 * Learn mode maps each highlighted phrase to an actor dossier; Quiz mode asks
 * which real-world actors each phrase puts in the room, scored. Bridged: fires
 * onComplete once every phrase has been graded in quiz mode.
 */
export function ProtocolActors({ onComplete }: VerificationWidgetProps) {
  const [mode, setMode] = useState<Mode>("learn");
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [answered, setAnswered] = useState<Record<string, Answered>>({});
  const [current, setCurrent] = useState<string | null>(null);

  const total = ORDER.length;

  const quizTotals = useMemo(() => {
    let right = 0;
    let tot = 0;
    let count = 0;
    for (const id of ORDER) {
      const a = answered[id];
      if (a) {
        right += a.right;
        tot += a.total;
        count += 1;
      }
    }
    return { right, tot, count };
  }, [answered]);

  const learnDone = seen.size === total;
  const quizDone = quizTotals.count === total;

  const progressPct =
    mode === "learn"
      ? (100 * seen.size) / total
      : (100 * quizTotals.count) / total;

  function openItem(id: string) {
    setCurrent(id);
    if (mode === "learn" && !seen.has(id)) {
      setSeen((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    }
  }

  function closeDrawer() {
    setCurrent(null);
  }

  function step(delta: number) {
    if (!current) return;
    const i = ORDER.indexOf(current as (typeof ORDER)[number]);
    const j = i + delta;
    if (j >= 0 && j < ORDER.length) openItem(ORDER[j]);
  }

  function recordAnswer(id: string, record: Answered) {
    // `answered` is only ever written here, so the render value is current in
    // this handler — compute `next` outside the updater (side effects inside
    // a state updater break React's purity rules and may replay).
    if (answered[id]) return;
    const next = { ...answered, [id]: record };
    setAnswered(next);
    // Fire completion once the last phrase has been graded. No local
    // once-guard: use-completion's done-ref is the single dedupe (and it
    // rolls back on a failed write so completion can retry).
    if (Object.keys(next).length === total) onComplete();
  }

  const idx = current
    ? ORDER.indexOf(current as (typeof ORDER)[number])
    : -1;

  return (
    <div className="not-prose my-6">
      {/* mode picker + per-mode instruction */}
      <div className="pb-4">
        <p className="text-muted-foreground text-sm">
          {mode === "learn" ? C.subLearn : C.subQuiz}
        </p>

        {/* mode tabs */}
        <div
          role="group"
          aria-label="Mode"
          className="mt-4 flex flex-wrap gap-2"
        >
          {(["learn", "quiz"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => {
                setMode(m);
                setCurrent(null);
              }}
              className={cn(
                "rounded-full border px-4 py-1.5 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors",
                mode === m
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {m === "learn" ? C.tabLearn : C.tabQuiz}
            </button>
          ))}
        </div>

        {/* legend — learn mode only. The label written in its category's own
            colour: no swatch riding beside grey text — the word itself is the
            pairing the hue needs. */}
        {mode === "learn" && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {/* The hue is on the word. A coloured dot beside a grey label
                makes the reader carry the mapping themselves, and it is the
                one thing this key exists to hand them. */}
            {C.legend.map((l) => (
              <span
                key={l.cat}
                style={catVars(l.cat)}
                className="text-xs font-medium text-[var(--cat)]"
              >
                {l.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* interactive panel: progress rail + treaty document */}
      <div className="border-border bg-card shadow-soft overflow-hidden rounded-xl border">
      {/* progress rail */}
      <div className="border-border/70 bg-muted/30 flex items-center gap-3 border-b px-5 py-2.5">
        <span className="text-muted-foreground font-mono text-[11px] tracking-[0.1em] whitespace-nowrap uppercase">
          {mode === "learn"
            ? `${seen.size} / ${total} actors met`
            : `${quizTotals.count} / ${total} answered`}
        </span>
        <Progress value={progressPct} className="h-1.5 flex-1" />
        {mode === "quiz" && quizTotals.tot > 0 && (
          <span
            className="text-comply font-mono text-[11px] tracking-[0.1em] whitespace-nowrap uppercase"
            aria-live="polite"
          >
            {quizTotals.right} / {quizTotals.tot} calls right
          </span>
        )}
      </div>

      {/* body: the treaty document */}
      <div className="p-5">
        <article className="border-border bg-muted/20 rounded-lg border p-5 sm:p-6">
          <div className="mb-4 text-center">
            <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
              {C.docEyebrow}
            </p>
            <h4 className="mt-1.5 text-lg font-semibold tracking-tight">
              {C.docTitle}
            </h4>
            <p className="text-muted-foreground mx-auto mt-1.5 max-w-prose text-sm">
              {C.docLede}
            </p>
          </div>
          <div className="border-border/60 mx-auto mb-5 w-20 border-t" />

          <div className="space-y-5 text-[15px] leading-relaxed">
            {DOC.map((art) => (
              <section key={art.heading}>
                <h5 className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
                  {art.heading}
                </h5>
                <p className="mt-1.5">
                  {art.runs.map((run, i) => {
                    if (run.kind === "text") {
                      return <span key={i}>{run.text}</span>;
                    }
                    if (run.kind === "num") {
                      return (
                        <span
                          key={i}
                          className="text-muted-foreground font-mono text-xs"
                        >
                          {run.text}{" "}
                        </span>
                      );
                    }
                    // highlight
                    const cat = ACTORS[run.a].cat;
                    const isSeen = mode === "learn" && seen.has(run.a);
                    const isAnswered = mode === "quiz" && !!answered[run.a];
                    const active = current === run.a;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => openItem(run.a)}
                        aria-pressed={active}
                        style={catVars(cat)}
                        aria-label={`${run.text} — ${
                          mode === "learn"
                            ? "meet the actors"
                            : "name the actors"
                        }`}
                        className={cn(
                          "mx-[1px] inline rounded-sm border-b-2 px-1 text-left transition-colors focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none",
                          // Learn mode colours by category; quiz mode has no
                          // category to show yet — that is the question — so
                          // it stays on one neutral "unanswered" tint.
                          mode === "learn"
                            ? CAT_HL
                            : "bg-muted border-border hover:bg-muted/70",
                          isAnswered &&
                            "bg-comply/10 border-comply/60",
                          active && "ring-foreground ring-2",
                        )}
                      >
                        {run.text}
                        {(isSeen || isAnswered) && (
                          <Check
                            className={cn(
                              "ml-0.5 inline size-3 align-text-top",
                              // Answered is a status (graded), so it keeps the
                              // status token; seen is the category's own hue.
                              isAnswered ? "text-comply" : "text-[var(--cat)]",
                            )}
                            aria-hidden
                          />
                        )}
                      </button>
                    );
                  })}
                </p>
              </section>
            ))}
          </div>
        </article>

        {/* done cards */}
        {mode === "learn" && learnDone && (
          <div className="border-comply/50 bg-comply/5 mt-5 rounded-lg border p-5 text-center">
            <p className="text-comply font-mono text-[11px] tracking-[0.14em] uppercase">
              {C.doneLearnEyebrow}
            </p>
            <h4 className="mt-1.5 text-lg font-semibold">
              {C.doneLearnTitle}
            </h4>
            <p className="text-muted-foreground mx-auto mt-1.5 max-w-prose text-sm">
              {C.doneLearnBody}
            </p>
            <Button
              variant="outline"
              className="mt-3 gap-2"
              onClick={() => setMode("quiz")}
            >
              {C.doneLearnCta}
            </Button>
          </div>
        )}
        {mode === "quiz" && quizDone && (
          <div className="border-comply/50 bg-comply/5 mt-5 rounded-lg border p-5 text-center">
            <p className="text-comply font-mono text-[11px] tracking-[0.14em] uppercase">
              {C.doneQuizEyebrow}
            </p>
            <h4 className="mt-1.5 text-lg font-semibold">{C.doneQuizTitle}</h4>
            <p className="text-muted-foreground mx-auto mt-1.5 max-w-prose text-sm">
              {C.doneQuizBody}
            </p>
            <p
              className="text-foreground mt-2 font-mono text-sm"
              aria-live="polite"
            >
              Final score: {quizTotals.right} / {quizTotals.tot} actor calls
              correct.
            </p>
          </div>
        )}
      </div>
      </div>

      {/* drawer */}
      <Sheet
        open={current !== null}
        onOpenChange={(open) => {
          if (!open) closeDrawer();
        }}
      >
        <SheetContent
          side="right"
          className="w-full gap-0 overflow-y-auto p-0 sm:max-w-md"
        >
          {current && (
            <DrawerBody
              key={current + mode}
              id={current}
              mode={mode}
              answered={answered[current] ?? null}
              onGrade={(record) => recordAnswer(current, record)}
              hasPrev={idx > 0}
              hasNext={idx < ORDER.length - 1}
              onPrev={() => step(-1)}
              onNext={() => step(1)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function DrawerBody({
  id,
  mode,
  answered,
  onGrade,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}: {
  id: string;
  mode: Mode;
  answered: Answered | null;
  onGrade: (record: Answered) => void;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  const actor = ACTORS[id];
  const cat = actor.cat;

  return (
    <>
      <SheetHeader className="border-border/70 border-b px-6 pt-6 pb-4">
        {/* The kicker IS the category, so it takes the category's hue — the
            same token as its dot in the legend. In quiz mode the kicker is
            the quiz's own label, not a category, so it stays neutral. */}
        <p
          style={mode === "learn" ? catVars(cat) : undefined}
          className={cn(
            "font-mono text-[10.5px] tracking-[0.2em] uppercase",
            mode === "learn" ? "text-[var(--cat)]" : "text-muted-foreground",
          )}
        >
          {mode === "learn" ? CATS[cat] : PROTOCOL_ACTORS_COPY.quizKicker}
        </p>
        <p className="text-muted-foreground mt-1 text-sm italic">
          {actor.phrase}
        </p>
        <SheetTitle className="mt-1 text-xl leading-tight font-semibold">
          {mode === "learn" ? actor.title : QUIZ[id].q}
        </SheetTitle>
      </SheetHeader>

      <div className="px-6 py-5">
        {mode === "learn" ? (
          <LearnBody id={id} />
        ) : (
          <QuizBody id={id} answered={answered} onGrade={onGrade} />
        )}

        {/* prev / next nav */}
        <div className="border-border/70 mt-6 flex items-center justify-between border-t pt-4">
          <button
            type="button"
            onClick={onPrev}
            disabled={!hasPrev}
            className="text-primary hover:text-foreground font-mono text-[10.5px] tracking-[0.12em] uppercase disabled:cursor-default disabled:opacity-40"
          >
            {PROTOCOL_ACTORS_COPY.prevBtn}
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!hasNext}
            className="text-primary hover:text-foreground font-mono text-[10.5px] tracking-[0.12em] uppercase disabled:cursor-default disabled:opacity-40"
          >
            {PROTOCOL_ACTORS_COPY.nextBtn}
          </button>
        </div>
      </div>
    </>
  );
}

function LearnBody({ id }: { id: string }) {
  const actor = ACTORS[id];
  return (
    <div className="space-y-4">
      {actor.blocks.map(([label, text], i) => {
        const isWhy = label.startsWith("Why");
        return (
          <div
            key={i}
            className={cn(
              isWhy &&
                "border-border bg-muted/40 rounded-lg border p-3.5",
            )}
          >
            <p
              className={cn(
                "font-mono text-[10px] tracking-[0.18em] uppercase",
                isWhy ? "text-primary" : "text-muted-foreground",
              )}
            >
              {label}
            </p>
            <p className="mt-1 text-sm leading-relaxed">{text}</p>
          </div>
        );
      })}
    </div>
  );
}

function QuizBody({
  id,
  answered,
  onGrade,
}: {
  id: string;
  answered: Answered | null;
  onGrade: (record: Answered) => void;
}) {
  const quiz = QUIZ[id];
  const [picks, setPicks] = useState<Set<number>>(
    () => new Set(answered?.picked ?? []),
  );
  const graded = answered !== null;

  function toggle(i: number) {
    if (graded) return;
    setPicks((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function check() {
    if (graded) return;
    const picked = [...picks].sort((a, b) => a - b);
    let right = 0;
    quiz.opts.forEach((o, i) => {
      const chose = picks.has(i);
      if (o.correct === chose) right += 1;
    });
    onGrade({ picked, right, total: quiz.opts.length });
  }

  const verdict = answered
    ? { right: answered.right, total: answered.total }
    : null;

  return (
    <div>
      {!graded && (
        <p className="text-muted-foreground mb-4 text-xs">
          {PROTOCOL_ACTORS_COPY.quizHint}
        </p>
      )}

      <div className="flex flex-col gap-2">
        {quiz.opts.map((o, i) => {
          const chose = picks.has(i);
          // grading classes
          let stateCls = "";
          let tag = "";
          let tagCls = "";
          if (graded) {
            if (o.correct && chose) {
              stateCls = "border-comply bg-comply/5";
              tag = "Correct —";
              tagCls = "text-comply";
            } else if (o.correct && !chose) {
              stateCls = "border-exaggerate border-dashed bg-exaggerate/5";
              tag = "Missed —";
              tagCls = "text-exaggerate";
            } else if (!o.correct && chose) {
              stateCls = "border-defect bg-defect/5";
              tag = "Not this one —";
              tagCls = "text-defect";
            } else {
              stateCls = "border-border";
              tag = "Rightly skipped —";
              tagCls = "text-comply";
            }
          }

          return (
            <label
              key={i}
              className={cn(
                "flex gap-3 rounded-lg border p-3 text-sm leading-snug transition-colors",
                graded
                  ? stateCls
                  : cn(
                      "hover:bg-muted cursor-pointer",
                      chose ? "border-primary" : "border-border",
                    ),
              )}
            >
              <Checkbox
                checked={chose}
                disabled={graded}
                onCheckedChange={() => toggle(i)}
                className="mt-0.5 shrink-0"
                aria-label={o.text}
              />
              <span>
                {o.text}
                {graded && (
                  <span className="text-muted-foreground mt-1 block text-xs leading-snug">
                    <b
                      className={cn(
                        "mr-1 font-mono text-[10px] tracking-[0.12em] uppercase",
                        tagCls,
                      )}
                    >
                      {tag}
                    </b>
                    {o.fb}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      {!graded ? (
        <Button onClick={check} className="mt-4 gap-2">
          {PROTOCOL_ACTORS_COPY.checkBtn} <ArrowRight className="size-4" aria-hidden />
        </Button>
      ) : (
        <div className="mt-4 space-y-3" aria-live="polite">
          <p
            className={cn(
              "font-mono text-xs tracking-[0.1em] uppercase",
              verdict && verdict.right === verdict.total
                ? "text-comply"
                : "text-exaggerate",
            )}
          >
            {verdict?.right} / {verdict?.total} calls right
          </p>
          <div className="border-border bg-muted/40 rounded-lg border p-3.5">
            <p className="text-primary font-mono text-[10px] tracking-[0.18em] uppercase">
              {PROTOCOL_ACTORS_COPY.whyLabel}
            </p>
            <p className="mt-1 text-sm leading-relaxed">{quiz.why}</p>
          </div>
        </div>
      )}
    </div>
  );
}
