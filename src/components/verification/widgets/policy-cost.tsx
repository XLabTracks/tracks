"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  POLICY_COST_COPY as C,
  type PolicyCostEase,
} from "@/lib/verification/data/policy-cost";
import type { VerificationWidgetProps } from "../kit/types";

/**
 * "Everything comes with a cost" — the authored interlude for 1.0.2, ported
 * from the prototype at site/policy-cost.html in the playground. A card with
 * two faces: name a policy you believe in, flip it, name what enforcing it
 * costs. Then both sides at once, one question about how hard the second half
 * was, and the debrief that answer earns.
 *
 * Everything the learner reads is authored copy in
 * `src/lib/verification/data/policy-cost.ts`. Nothing here composes a
 * sentence of its own.
 *
 * Unbridged: there is no right answer to reach, so it never calls onComplete
 * and the lesson keeps its ordinary scroll-to-complete.
 *
 * Two traps carried over from the prototype, both load-bearing:
 *   - What the learner types is rendered as text, never as markup, including
 *     inside the composed "full policy" sentence.
 *   - The hidden face must not be reachable. A back face that still takes tab
 *     focus is a form the learner can fill while looking at the front.
 */
export function PolicyCost(_: VerificationWidgetProps) {
  void _;
  const [policy, setPolicy] = useState("");
  const [price, setPrice] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [lenses, setLenses] = useState(false);
  const [faced, setFaced] = useState(false);
  const [ease, setEase] = useState<PolicyCostEase | null>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const policyRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setPolicy("");
    setPrice("");
    setFlipped(false);
    setLenses(false);
    setFaced(false);
    setEase(null);
  };

  if (faced) {
    return (
      <section className="not-prose border-border bg-card space-y-4 rounded-xl border p-5 text-sm">
        <h3 className="text-lg font-semibold">{C.title}</h3>
        <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
          {C.bothTag}
        </p>

        {/* Uniform hairline on all four sides; the side each row belongs to is
            carried by the dot and the word beside it, never by an edge. */}
        <div className="space-y-2">
          <LedgerRow tone="goal" tag={C.goalTag} value={policy} />
          <LedgerRow tone="price" tag={C.priceTag} value={price} />
        </div>

        <div>
          <p className="font-semibold">{C.askQ}</p>
          <div className="mt-2 flex flex-wrap gap-1.5" role="group">
            {(Object.keys(C.ease) as PolicyCostEase[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={ease === key}
                onClick={() => setEase(key)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold transition-colors select-none",
                  ease === key
                    ? "border-foreground text-foreground bg-muted"
                    : "border-border text-muted-foreground hover:text-foreground",
                  ease && ease !== key && "opacity-50",
                )}
              >
                {C.ease[key]}
              </button>
            ))}
          </div>
        </div>

        {ease ? (
          <>
            <p
              aria-live="polite"
              className="border-border text-muted-foreground border-t pt-3 leading-relaxed"
            >
              {C.branch[ease]}
            </p>

            <div className="border-foreground bg-card rounded-lg border p-4">
              <p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
                {C.fullTag}
              </p>
              {/* Composed from the learner's two answers as text nodes. */}
              <p className="text-muted-foreground mt-2 text-base leading-snug break-words">
                {C.fullTpl.pre}
                <b className="text-foreground font-semibold">{policy}</b>
                {C.fullTpl.mid}
                <b className="text-foreground font-semibold">{price}</b>
                {C.fullTpl.post}
              </p>
            </div>

            <p className="text-base leading-relaxed">
              {C.closer.pre}
              <em>{C.closer.q1}</em>
              {C.closer.mid}
              <em>{C.closer.q2}</em>
            </p>

            <button
              type="button"
              onClick={reset}
              className="text-muted-foreground hover:text-foreground border-b border-dotted text-xs select-none"
            >
              {C.again}
            </button>
          </>
        ) : null}
      </section>
    );
  }

  return (
    <section className="not-prose border-border bg-card rounded-xl border p-5 text-sm">
      <h3 className="text-lg font-semibold">{C.title}</h3>
      <p className="text-muted-foreground mt-1 max-w-[52ch] leading-relaxed">{C.sub}</p>

      <div className="mt-4 [perspective:1400px]">
        <div
          className={cn(
            "grid transition-transform duration-500 [transform-style:preserve-3d]",
            "motion-reduce:transition-none",
            flipped && "[transform:rotateY(180deg)]",
          )}
        >
          {/* --- Side A: the goal --- */}
          <form
            inert={flipped}
            onSubmit={(event) => {
              event.preventDefault();
              if (!policy.trim()) return;
              setFlipped(true);
              window.setTimeout(() => priceRef.current?.focus({ preventScroll: true }), 560);
            }}
            className={cn(
              "border-border bg-card col-start-1 row-start-1 flex min-w-0 flex-col gap-3",
              "rounded-xl border p-5 [backface-visibility:hidden]",
            )}
          >
            <FaceTag tone="goal" label={C.tagA} />
            <label htmlFor="pc-policy" className="font-semibold">
              {C.labelA}
            </label>
            <Input
              id="pc-policy"
              ref={policyRef}
              value={policy}
              maxLength={90}
              autoComplete="off"
              placeholder={C.phA}
              onChange={(event) => setPolicy(event.target.value)}
            />
            <div className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-xs">
              <span>{C.chipLabel}</span>
              {C.chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setPolicy(chip);
                    policyRef.current?.focus();
                  }}
                  className="border-border text-muted-foreground hover:text-foreground rounded-full border px-2.5 py-0.5 font-semibold transition-colors select-none"
                >
                  {chip}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-muted-foreground text-[11px]">{C.privacy}</span>
              <Button type="submit" size="sm" disabled={!policy.trim()}>
                {C.flipBtn}
              </Button>
            </div>
          </form>

          {/* --- Side B: the price --- */}
          <form
            inert={!flipped}
            onSubmit={(event) => {
              event.preventDefault();
              if (!policy.trim() || !price.trim()) return;
              setFaced(true);
            }}
            className={cn(
              "border-border bg-card col-start-1 row-start-1 flex min-w-0 flex-col gap-3",
              "rounded-xl border p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]",
            )}
          >
            <FaceTag tone="price" label={C.tagB} />
            <p className="text-muted-foreground text-xs break-words">
              {C.echoLabel} <b className="text-foreground/80 font-semibold">{policy}</b>
            </p>
            <label htmlFor="pc-price" className="font-semibold">
              {C.labelB}
            </label>
            <Input
              id="pc-price"
              ref={priceRef}
              value={price}
              maxLength={160}
              autoComplete="off"
              placeholder={C.phB}
              onChange={(event) => setPrice(event.target.value)}
            />
            <button
              type="button"
              aria-expanded={lenses}
              onClick={() => setLenses(!lenses)}
              className="text-muted-foreground hover:text-foreground self-start border-b border-dotted text-xs select-none"
            >
              {C.stuck}
            </button>
            {lenses ? (
              <p className="text-muted-foreground font-mono text-[10.5px] leading-loose">
                {C.lenses}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setFlipped(false);
                  window.setTimeout(
                    () => policyRef.current?.focus({ preventScroll: true }),
                    560,
                  );
                }}
              >
                {C.backBtn}
              </Button>
              <Button type="submit" size="sm" disabled={!price.trim()}>
                {C.faceBtn}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

/** Okabe–Ito blue for the goal, orange for the price — always beside its word. */
function FaceTag({ tone, label }: { tone: "goal" | "price"; label: string }) {
  return (
    <p className="text-muted-foreground flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase">
      <span
        aria-hidden
        className={cn(
          "size-2 flex-none rounded-full",
          tone === "goal" ? "bg-sky-600" : "bg-amber-500",
        )}
      />
      {label}
    </p>
  );
}

function LedgerRow({
  tone,
  tag,
  value,
}: {
  tone: "goal" | "price";
  tag: string;
  value: string;
}) {
  return (
    <div className="border-border bg-muted/40 flex items-baseline gap-3 rounded-lg border p-3">
      <span className="text-muted-foreground flex w-24 flex-none items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase">
        <span
          aria-hidden
          className={cn(
            "size-2 flex-none rounded-full",
            tone === "goal" ? "bg-sky-600" : "bg-amber-500",
          )}
        />
        {tag}
      </span>
      <span className="min-w-0 text-base leading-snug break-words">{value}</span>
    </div>
  );
}
