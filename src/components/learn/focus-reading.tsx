"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  focusPrefixLength,
  FOCUS_STORAGE_KEY,
  type FocusMode,
  type FocusSettings,
} from "@/lib/reading/focus-reading";

/* The focus-reading control: a button beside the whole-lesson toggle that
 * opens the reading settings, and the code that applies them to the body.
 *
 * Off by default and remembered per device. It is a reading aid, not a house
 * style — nobody should meet a lesson already re-typeset by a decision they
 * did not make.
 *
 * The panel carries a live sample rather than describing the modes in words:
 * "about a third of each word" means nothing until you see it, and the whole
 * question a reader has is whether it helps them, which only their own eyes
 * answer. The sample is a real statement with its source, because an example
 * made of lorem would be the one place on the page that says nothing.
 *
 * Trap: the control does not touch the page. It reports the setting and the
 * reader carries it as a class over a body already marked once — see
 * markFocusWords. Applying it here, by walking the lesson body on each
 * change, edits markup React owns, and the next render throws that subtree
 * away: the whole lesson vanishes on the second click. Not subtle, but easy
 * to reintroduce, because the first click looks like it worked.
 */

const SAMPLE =
  "Mitigating the risk of extinction from AI should be a global priority alongside other societal-scale risks such as pandemics and nuclear war.";

const MODES: { value: FocusMode; label: string; hint: string }[] = [
  { value: "off", label: "Off", hint: "Plain text" },
  { value: "light", label: "Light", hint: "First third" },
  { value: "standard", label: "Standard", hint: "First half" },
];

export function FocusReadingControl({
  settings,
  onChange,
}: {
  settings: FocusSettings;
  onChange: (next: FocusSettings) => void;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const update = useCallback(
    (next: Partial<FocusSettings>) => {
      const merged = { ...settings, ...next };
      try {
        localStorage.setItem(FOCUS_STORAGE_KEY, JSON.stringify(merged));
      } catch {
        /* private mode: the setting lives for this page and no longer */
      }
      onChange(merged);
    },
    [settings, onChange],
  );

  // Escape closes the panel; a click outside does too. Both leave the setting
  // itself alone — closing the panel is not turning the mode off.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !(t as HTMLElement).closest?.("[data-focus-toggle]")) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  const on = settings.mode !== "off";

  return (
    <>
      {/* The glyph IS the setting: an A carrying the accent over a plain a, so
          the button shows what it does at the size of an icon. Its own weight
          never changes with the mode — a control that restyles itself is hard
          to find again once you have turned it on. State is the border and the
          accessible name, and the panel says which strength. */}
      <Button
        variant="ghost"
        size="sm"
        data-focus-toggle
        aria-expanded={open}
        aria-label={`Focus reading${on ? `: ${settings.mode}` : ""}`}
        title="Focus reading"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "h-7 w-9 border px-0 text-[15px] leading-none",
          on
            ? "border-border text-foreground bg-muted"
            : "text-muted-foreground border-transparent",
        )}
      >
        <span aria-hidden>
          <b className="font-bold">A</b>
          <span className="font-normal">a</span>
        </span>
      </Button>

      {open && (
        <div
          ref={panelRef}
          className="border-border bg-card shadow-soft-lg absolute top-9 right-0 z-20 w-[min(30rem,calc(100vw-2rem))] rounded-xl border p-4 text-left"
        >
          <p className="text-sm font-semibold">Focus reading</p>
          <p className="text-muted-foreground mt-1 text-[13px] leading-relaxed">
            Bolds the opening letters of a word so your eye lands on its shape.
            Some people read faster this way and some slower — the sample below
            is the way to tell which you are.
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Focus reading strength">
            {MODES.map((m) => (
              <button
                key={m.value}
                type="button"
                aria-pressed={settings.mode === m.value}
                onClick={() => update({ mode: m.value })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold transition-colors select-none",
                  // The selected chip inverts rather than tinting. On the
                  // high-contrast theme --border and --foreground are both
                  // white and --muted is the ground, so a bordered-and-tinted
                  // chip is pixel-identical to an unselected one and the
                  // choice becomes invisible. Ground/ink swapped survives all
                  // three themes because it is the one pair every theme sets.
                  settings.mode === m.value
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {m.label}
                <span
                  className={cn(
                    "ml-1.5 font-normal",
                    settings.mode === m.value
                      ? "opacity-75"
                      : "text-muted-foreground",
                  )}
                >
                  {m.hint}
                </span>
              </button>
            ))}
          </div>

          <label
            className={cn(
              "mt-3 flex items-center gap-2 text-[13px] select-none",
              on ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <input
              type="checkbox"
              checked={settings.skipShort}
              disabled={!on}
              onChange={(e) => update({ skipShort: e.target.checked })}
              className="accent-primary size-3.5"
            />
            Leave short joining words plain (the, of, and)
          </label>

          {/* The sample. Rendered from the same rules as the page, so what is
              shown here is exactly what the body will do. */}
          <div className="border-border mt-4 rounded-lg border p-3">
            <p className="text-muted-foreground font-mono text-[10px] tracking-[0.14em] uppercase">
              Sample
            </p>
            {/* focus-sample: the accent weight is the page's, one token —
                a sample bolder than the body would be a lie about it. */}
            <p className="focus-sample mt-2 text-[15px] leading-relaxed">
              <FocusSample text={SAMPLE} settings={settings} />
            </p>
            <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
              —{" "}
              <a
                href="https://aistatement.com/work/statement-on-ai-extinction-risk"
                target="_blank"
                rel="noopener"
                className="underline underline-offset-2"
              >
                Statement on AI Extinction Risk
              </a>
              , signed by AI experts and public figures expressing their concern
              about AI risk.
            </p>
          </div>

          <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
            Numbers, code, links, abbreviations such as IAEA or FLOP, already
            emphasised terms and headings are never changed. Nothing about the
            text itself changes, so find-in-page, selection and copying work
            exactly as they do with this off.
          </p>
        </div>
      )}
    </>
  );
}

/** The sample, marked up by the same rules the page uses. */
function FocusSample({
  text,
  settings,
}: {
  text: string;
  settings: FocusSettings;
}) {
  return (
    <>
      {text.split(/(\s+)/).map((piece, i) => {
        const cut = focusPrefixLength(piece, settings);
        if (cut === 0) return <span key={i}>{piece}</span>;
        return (
          <span key={i}>
            <b>{piece.slice(0, cut)}</b>
            {piece.slice(cut)}
          </span>
        );
      })}
    </>
  );
}
