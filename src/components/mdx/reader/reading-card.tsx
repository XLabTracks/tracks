"use client";

import type { ReactNode } from "react";
import { useMark, writeMark } from "./marks";

/**
 * A reading card: an external reading with a mark-as-read circle, the same
 * job the static course's {read}-style cards did — title links out, why this
 * unit sends you there, then author · year · length.
 *
 * The checkmark is learner work on the vt-marks store: it feeds no meter,
 * unlocks nothing, and is never set automatically — the learner presses it.
 * The `id` is its storage key and is permanent. Read state is carried by the
 * glyph and the word "read", never by colour alone.
 */
export function ReadingCard({
  id,
  href,
  title,
  author,
  year,
  mins,
  children,
}: {
  id: string;
  href: string;
  title: string;
  author?: string;
  year?: string;
  mins?: string;
  children?: ReactNode;
}) {
  const key = `read:${id}`;
  const read = useMark<boolean>(key, false);
  const meta = [author, year, mins].filter(Boolean).join(" · ");
  const metaLine = read ? (meta ? `${meta} · read` : "read") : meta;

  return (
    <section className="not-prose border-border bg-card my-4 flex gap-3 rounded-xl border p-4">
      {/* Unread, this used to be an empty ring whose ✓ was transparent on
          hover as well — nothing anywhere said it could be pressed, so it
          read as a decorative dot. The check now ghosts in on hover and the
          title names the action, which is the affordance without the lie: a
          faint ✓ shown at rest would read as already-read. */}
      <button
        type="button"
        aria-pressed={read}
        title={read ? "Mark as unread" : "Mark as read"}
        aria-label={read ? `Mark "${title}" as unread` : `Mark "${title}" as read`}
        onClick={() => writeMark(key, read ? undefined : true)}
        className={
          "mt-0.5 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border text-sm transition-colors select-none " +
          (read
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border hover:border-ring text-transparent hover:text-muted-foreground")
        }
      >
        ✓
      </button>
      <div className="min-w-0 flex-1 space-y-1.5 text-sm">
        <p className="text-base leading-snug font-medium">
          <a
            href={href}
            target="_blank"
            rel="noopener"
            className="underline-offset-4 hover:underline"
          >
            {title}
            <span aria-hidden="true" className="text-muted-foreground ml-1.5 text-xs">
              ↗
            </span>
          </a>
        </p>
        {children ? (
          <div className="text-muted-foreground leading-relaxed">{children}</div>
        ) : null}
        {metaLine ? (
          <p className="text-muted-foreground font-mono text-xs">{metaLine}</p>
        ) : null}
      </div>
    </section>
  );
}
