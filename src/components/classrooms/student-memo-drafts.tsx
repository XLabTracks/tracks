import type { ReactNode } from "react";
import { NotebookPen } from "lucide-react";
import { memoSlots } from "@/content/verification/memos";
import type { MemoDraft, MemoField } from "@/lib/verification/memo-drafts";
import type { InstructorNote } from "@/lib/submission-notes-read";
import { OptionalPrefix } from "@/components/content/optional-tag";
import { SubmissionNotes } from "@/components/classrooms/submission-notes";

/**
 * The learner's memo-desk drafts, read for their instructor.
 *
 * These are course work — the written outputs the outline asks for — but they
 * live in VerificationState beside the notebook rather than in a Submission
 * row, and the desk has no hand-in step at all: it autosaves and that is the
 * whole lifecycle. So the submitted/draft line that governs the writing
 * exercises cannot be drawn here, and the section says plainly that what an
 * instructor is reading is a working draft.
 *
 * The notebook, the highlights, the field map and the widget store sit in the
 * same document and are deliberately not read: `getMemoDrafts` selects the
 * memos store alone.
 */
export function StudentMemoDrafts({
  drafts,
  classroomId,
  studentId,
  notes,
}: {
  drafts: MemoDraft[] | null;
  classroomId: string;
  studentId: string;
  /** Null when the annotations table has not been migrated. */
  notes: Map<string, InstructorNote[]> | null;
}) {
  if (drafts === null) {
    return (
      <section className="mt-8">
        <h3 className="text-base font-semibold">Memo desk</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Drafts are stored in a table this deployment has not migrated yet
          (<code>db/migrations/20260805120000_verification_state.sql</code>).
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-base font-semibold">Memo desk</h3>
        <span className="text-muted-foreground text-sm">
          {drafts.length}/{memoSlots.length} slots started
        </span>
      </div>
      <p className="text-muted-foreground mt-1 text-xs">
        The desk autosaves and has no hand-in step, so every one of these is a
        working draft.
      </p>

      {drafts.length === 0 ? (
        <p className="text-muted-foreground mt-3 text-sm">
          Nothing drafted yet.
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          {drafts.map((draft) => (
            <Draft
              key={draft.id}
              draft={draft}
              classroomId={classroomId}
              studentId={studentId}
              notes={notes?.get(draft.id) ?? (notes ? [] : null)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

const LETTERHEAD: { field: MemoField; label: string }[] = [
  { field: "audience", label: "To" },
  { field: "from", label: "From" },
  { field: "date", label: "Date" },
];

const QUESTIONS: { field: MemoField; label: string }[] = [
  { field: "decision", label: "What decision does this inform?" },
  { field: "falsifier", label: "What would change my mind?" },
];

/**
 * `**bold**` as bold, and nothing else.
 *
 * The desk tells the writer to use it — "Markdown **bold** survives the skim
 * — use it on the lines that must" — and its skim test reads those lines, so
 * on a memo the markers are the structure rather than noise, and an
 * instructor reading asterisks is reading the wrong document. Scoped to the
 * memos for that reason: the writing exercises are free prose and their text
 * stays exactly as typed.
 *
 * This splits a string and wraps alternate pieces in an element. It never
 * builds HTML, so there is nothing for learner input to inject.
 */
function withBold(text: string): ReactNode[] {
  return text
    .split(/\*\*/)
    .map((piece, index) =>
      index % 2 === 1 ? <strong key={index}>{piece}</strong> : piece,
    );
}

function Draft({
  draft,
  classroomId,
  studentId,
  notes,
}: {
  draft: MemoDraft;
  classroomId: string;
  studentId: string;
  notes: InstructorNote[] | null;
}) {
  const { slot, fields } = draft;
  // A memo prints To/From/Date/Subject; every other genre collapses the
  // letterhead to its last row, so the one field is a title, not a subject.
  const isMemo = !slot?.genre || slot.genre === "memo";
  const head = LETTERHEAD.filter(({ field }) => fields[field]);
  const asked = QUESTIONS.filter(({ field }) => fields[field]);

  return (
    <div className="border-border rounded-lg border p-3">
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        <p className="flex min-w-0 items-baseline gap-1.5 text-sm font-medium">
          <NotebookPen
            className="size-3.5 shrink-0 translate-y-0.5"
            aria-hidden
          />
          <span>
            {slot?.optional && <OptionalPrefix />}
            {slot ? slot.title : draft.id}
          </span>
        </p>
        <span className="text-muted-foreground text-xs">
          {slot ? `${slot.unit} · ` : "slot retired · "}
          {draft.words}
          {slot?.words ? `/${slot.words}` : ""} words
        </span>
      </div>

      {head.length > 0 && (
        <dl className="text-muted-foreground mt-3 space-y-0.5 text-xs">
          {head.map(({ field, label }) => (
            <div key={field} className="flex gap-1.5">
              <dt className="w-10 shrink-0">{label}</dt>
              <dd className="text-foreground [overflow-wrap:anywhere]">
                {fields[field]}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {fields.title && (
        <p className="mt-2 text-sm font-semibold [overflow-wrap:anywhere]">
          <span className="text-muted-foreground font-normal">
            {isMemo ? "Subject: " : "Title: "}
          </span>
          {fields.title}
        </p>
      )}

      {fields.body ? (
        <p className="mt-2 text-sm whitespace-pre-wrap [overflow-wrap:anywhere]">
          {withBold(fields.body)}
        </p>
      ) : (
        <p className="text-muted-foreground mt-2 text-xs">
          The document itself is still empty.
        </p>
      )}

      {asked.length > 0 && (
        <dl className="border-border mt-3 space-y-1.5 border-t pt-3 text-xs">
          {asked.map(({ field, label }) => (
            <div key={field}>
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="[overflow-wrap:anywhere]">{fields[field]}</dd>
            </div>
          ))}
        </dl>
      )}

      {notes && (
        <SubmissionNotes
          classroomId={classroomId}
          studentId={studentId}
          targetId={draft.id}
          targetKind="memo"
          notes={notes}
        />
      )}
    </div>
  );
}
