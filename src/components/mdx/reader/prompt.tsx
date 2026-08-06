import type { ReactNode } from "react";

/**
 * The prompt a worked example poses before showing sample work — the question
 * itself, set apart from the prose answering it.
 *
 * As a heading it disappeared: `#### Prompt: …` rendered one bold line in a
 * page already full of them, and the one thing a reader scans a worked
 * example for was the hardest thing to find. Emphasis here is the standard
 * callout recipe — a role label, a size step over body text, a bounded
 * block — inside the house grammar: hairline on all four sides, the accent
 * INSIDE as the label's ink, never a painted edge. Deliberately not a real
 * heading, so the outline (sidebar, parts) stays with the section headings.
 */
export function Prompt({
  label = "Prompt",
  children,
}: {
  /** The role word above the question. "Prompt" unless the source says otherwise. */
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="not-prose border-border bg-card my-8 rounded-xl border px-5 py-4">
      {/* Written, so it takes --brand-ink where the Verification theme
          provides one (maroon is a surface on the night ground, not a text
          colour — the app-bridge writes accents this way for that reason)
          and falls back to the app's own primary elsewhere. */}
      <p className="text-xs font-semibold tracking-[0.14em] uppercase [color:var(--brand-ink,var(--primary))]">
        {label}
      </p>
      <p className="text-foreground mt-1.5 text-lg leading-snug font-medium text-balance">
        {children}
      </p>
    </div>
  );
}
