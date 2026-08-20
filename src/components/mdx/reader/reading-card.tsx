"use client";

import type { ReactNode } from "react";
import { OptionalMarker } from "@/components/content/optional-tag";
import { useMark, writeMark } from "./marks";

/**
 * A reading card: an external reading with a mark-as-read circle, the same
 * job the static course's {read}-style cards did — title links out, why this
 * unit sends you there, then author (year) | length.
 *
 * The year is parenthesised and stays with the author, the way a citation
 * writes it. Everything used to be strung on middle dots, and on a card whose
 * author field is "Mauricio Baker, Gabriel Kulp, Oliver Marks, Miles Brundage,
 * and Lennart Heim" the dot was a weaker mark than the four commas it had to
 * outrank, so the year read as one more name in the list. Brackets are not a
 * separator at all — they are a container, which is why they cannot be
 * misread as more list.
 *
 * The fields that remain beside it — length, licence, the read mark — are
 * ruled apart with a pipe for the same reason the dot failed: it has to beat
 * the punctuation inside an author list, and a vertical rule is the only mark
 * in the set that never appears inside a name.
 *
 * The checkmark is learner work on the vt-marks store: it feeds no meter,
 * unlocks nothing, and is never set automatically — the learner presses it.
 * The `id` is its storage key and is permanent. Read state is carried by the
 * glyph and the word "read", never by colour alone.
 *
 * `optional` wears the shared OptionalMarker on the title's line — the same
 * word the sidebar and reading headers use for an item that never gates
 * progress — for a background reading the unit points at but does not require.
 */
export function ReadingCard({
  id,
  href,
  title,
  author,
  year,
  mins,
  optional,
  children,
}: {
  id: string;
  href: string;
  title: string;
  author?: string;
  year?: string;
  mins?: string;
  optional?: boolean;
  children?: ReactNode;
}) {
  const key = `read:${id}`;
  const read = useMark<boolean>(key, false);
  // The year rides with the author; only the independent fields get a rule.
  const who = [author, year ? `(${year})` : null].filter(Boolean).join(" ");
  const meta = [who || null, mins].filter(Boolean).join(" | ");
  const metaLine = read ? (meta ? `${meta} | read` : "read") : meta;

  return (
    <section
      id={`reading-${id}`}
      className="not-prose border-border bg-card my-4 flex scroll-mt-24 gap-3 rounded-xl border p-4"
    >
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
          "mt-0.5 flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border text-sm transition-colors select-none lg:size-6 " +
          (read
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border hover:border-ring text-transparent hover:text-muted-foreground")
        }
      >
        ✓
      </button>
      <div className="min-w-0 flex-1 space-y-1.5 text-sm">
        <p className="text-base leading-relaxed font-medium">
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
          {optional ? (
            <OptionalMarker compact className="ml-2 align-middle" />
          ) : null}
        </p>
        {/* The shell is not-prose, so preflight's reset is all a body gets:
            without these, a blurb carrying a list renders as run-on lines
            with no bullets. Same set, same reasoning, as the Fold and
            Callout bodies. */}
        {children ? (
          <div
            className={
              "text-muted-foreground leading-relaxed break-words " +
              "[&>*+*]:mt-2 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 " +
              "[&_li]:marker:text-muted-foreground [&_li+li]:mt-1.5 " +
              "[&_strong]:text-foreground [&_strong]:font-semibold"
            }
          >
            {children}
          </div>
        ) : null}
        {metaLine ? (
          <p className="text-muted-foreground text-xs">{metaLine}</p>
        ) : null}
      </div>
    </section>
  );
}
