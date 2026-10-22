import { MessageSquareQuote } from "lucide-react";
import type { SharedNote } from "@/lib/submission-notes-read";

/**
 * What a facilitator wrote back to this learner about this piece of work.
 *
 * Only notes an instructor chose to send are ever read here — the private
 * ones they keep for themselves never leave the classroom. The author's name
 * and their room travel with the note, because feedback from a person the
 * learner has met reads differently from feedback from nobody, and because
 * a learner in two cohorts needs to know which one this came from.
 */
export function FacilitatorFeedback({ notes }: { notes: SharedNote[] }) {
  if (notes.length === 0) return null;

  return (
    <aside className="not-prose border-border bg-muted/40 my-6 rounded-xl border p-5">
      <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
        <MessageSquareQuote className="size-3.5" aria-hidden />
        {notes.length > 1 ? "Feedback from your facilitators" : "Feedback from your facilitator"}
      </p>
      <ul className="mt-3 space-y-4">
        {notes.map((note) => (
          <li key={note.id}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]">
              {note.body}
            </p>
            <p className="text-muted-foreground mt-1.5 text-xs">
              {note.authorName} · {note.classroomName}
            </p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
