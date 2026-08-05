import { ArrowUpRight, PenLine, Users } from "lucide-react";
import {
  memoSlotsForLesson,
  type MemoSlot,
} from "@/content/verification/memos";

/**
 * The written output a lesson owes, at the end of that lesson.
 *
 * The course asks for fifteen of these and the memo desk has always held all
 * fifteen, but nothing in the course pointed at it — a learner reaching the
 * end of 2.3 had no way of knowing a memo was due there. This is that
 * pointer: `<MemoDesk lesson="intelligence-action"/>` prints whatever
 * src/content/verification/memos.ts says this lesson owes, and links into the
 * desk at that slot.
 *
 * A slot with no brief still gets a card. The outline marks the assignment
 * and has not written it, and saying so is more use than silence — the desk
 * will still take the draft. Never fill the gap in from here.
 */
export function MemoDesk({ lesson }: { lesson: string }) {
  const slots = memoSlotsForLesson(lesson);
  if (!slots.length) {
    return (
      <div className="not-prose border-destructive/40 bg-destructive/5 text-destructive my-6 rounded-xl border p-4 text-sm">
        No written output is registered for lesson <code>{lesson}</code>.
      </div>
    );
  }
  return (
    <div className="not-prose my-6 space-y-3">
      {slots.map((slot) => (
        <Slot key={slot.id} slot={slot} />
      ))}
    </div>
  );
}

function Slot({ slot }: { slot: MemoSlot }) {
  return (
    <section className="border-border bg-card rounded-xl border p-5 text-sm">
      <p className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] tracking-[0.14em] uppercase">
        <PenLine className="size-3.5" aria-hidden />
        {/* The unit keeps its own case: the outline numbers some of these
            "1.x" and "3.x", and uppercasing turns that into "3.X". */}
        Written output · <span className="normal-case">{slot.unit}</span>
        {slot.optional ? <span>· optional</span> : null}
      </p>

      <h3 className="mt-1.5 text-lg font-semibold">{slot.title}</h3>

      {slot.brief ? (
        <p className="mt-2 leading-relaxed">{slot.brief}</p>
      ) : (
        <p className="text-muted-foreground mt-2 leading-relaxed">
          {slot.gap} Draft into it anyway if you like — the brief will appear
          here once it exists.
        </p>
      )}

      {slot.brief && slot.gap ? (
        <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{slot.gap}</p>
      ) : null}

      <dl className="text-muted-foreground mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs">
        <div className="flex gap-1.5">
          <dt>Budget</dt>
          <dd className="text-foreground">about {slot.words} words</dd>
        </div>
        {slot.audience ? (
          <div className="flex gap-1.5">
            <dt>Reader</dt>
            <dd className="text-foreground">{slot.audience}</dd>
          </div>
        ) : null}
        {slot.peerReviewed ? (
          <div className="flex items-center gap-1.5">
            <Users className="size-3.5" aria-hidden />
            <dd className="text-foreground">Goes through peer review</dd>
          </div>
        ) : null}
      </dl>

      {slot.criteria?.length ? (
        <>
          <p className="text-muted-foreground mt-3 font-mono text-[11px] tracking-[0.14em] uppercase">
            Reviewed on
          </p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs leading-relaxed">
            {slot.criteria.map((criterion) => (
              <li key={criterion}>{criterion}</li>
            ))}
          </ul>
        </>
      ) : null}

      {/* A plain anchor, not next/link: the desk deep-links on the fragment,
          selecting `location.hash` on load, and a client-side navigation that
          keeps the document would never fire that. */}
      <a
        href={`/verification/memo-desk#${slot.id}`}
        className="border-border hover:bg-muted mt-4 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold no-underline! transition-colors select-none"
      >
        Draft it on the memo desk
        <ArrowUpRight className="size-3.5" aria-hidden />
      </a>
    </section>
  );
}
