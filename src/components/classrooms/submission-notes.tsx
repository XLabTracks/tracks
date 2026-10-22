"use client";

import { useActionState, useState } from "react";
import { Lock, Send } from "lucide-react";
import {
  deleteSubmissionNote,
  saveSubmissionNote,
  type NoteActionState,
} from "@/app/actions/submission-notes";
import type { InstructorNote } from "@/lib/submission-notes-read";
import {
  NOTE_BODY_MAX,
  VISIBILITY_LABEL,
  type NoteTargetKind,
  type NoteVisibility,
} from "@/lib/submission-notes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/**
 * An instructor's annotations on one piece of a learner's work.
 *
 * Two kinds, and the difference is said in words on every note rather than
 * by a colour: a private read the room's instructors keep, and a note the
 * learner is given back on their own page. Whichever it is, the learner
 * never sees it as anonymous — the author's name travels with it.
 *
 * Plain forms with server actions, like the rest of the classroom: the
 * action re-checks that the caller teaches this room, that the learner is in
 * it, and that the target is an id this course issues.
 */
export function SubmissionNotes({
  classroomId,
  studentId,
  targetId,
  targetKind,
  notes,
}: {
  classroomId: string;
  studentId: string;
  targetId: string;
  targetKind: NoteTargetKind;
  notes: InstructorNote[];
}) {
  const [composing, setComposing] = useState(false);

  return (
    <div className="border-border mt-3 border-t pt-3">
      {notes.length > 0 && (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li key={note.id}>
              <NoteRow
                classroomId={classroomId}
                studentId={studentId}
                targetId={targetId}
                targetKind={targetKind}
                note={note}
              />
            </li>
          ))}
        </ul>
      )}

      {composing ? (
        <NoteForm
          classroomId={classroomId}
          studentId={studentId}
          targetId={targetId}
          targetKind={targetKind}
          onDone={() => setComposing(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setComposing(true)}
          className="text-muted-foreground hover:text-foreground mt-1 text-xs font-medium underline-offset-2 hover:underline"
        >
          {notes.length ? "Add another annotation" : "Annotate this"}
        </button>
      )}
    </div>
  );
}

function VisibilityMark({ visibility }: { visibility: NoteVisibility }) {
  const Icon = visibility === "shared" ? Send : Lock;
  return (
    <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
      <Icon className="size-3" aria-hidden />
      {VISIBILITY_LABEL[visibility]}
    </span>
  );
}

function NoteRow({
  classroomId,
  studentId,
  targetId,
  targetKind,
  note,
}: {
  classroomId: string;
  studentId: string;
  targetId: string;
  targetKind: NoteTargetKind;
  note: InstructorNote;
}) {
  const [editing, setEditing] = useState(false);
  const [removeState, remove, removing] = useActionState<
    NoteActionState,
    FormData
  >(deleteSubmissionNote, {});

  if (editing) {
    return (
      <NoteForm
        classroomId={classroomId}
        studentId={studentId}
        targetId={targetId}
        targetKind={targetKind}
        note={note}
        onDone={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="bg-muted/40 rounded-lg p-2.5">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <VisibilityMark visibility={note.visibility} />
        <span className="text-muted-foreground text-xs">{note.authorName}</span>
      </div>
      <p className="mt-1.5 text-sm whitespace-pre-wrap [overflow-wrap:anywhere]">
        {note.body}
      </p>
      {note.mine && (
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-muted-foreground hover:text-foreground text-xs font-medium underline-offset-2 hover:underline"
          >
            Edit
          </button>
          <form action={remove}>
            <input type="hidden" name="classroomId" value={classroomId} />
            <input type="hidden" name="studentId" value={studentId} />
            <input type="hidden" name="noteId" value={note.id} />
            <button
              type="submit"
              disabled={removing}
              className="text-muted-foreground hover:text-destructive text-xs font-medium underline-offset-2 hover:underline disabled:opacity-50"
            >
              {removing ? "Removing…" : "Remove"}
            </button>
          </form>
        </div>
      )}
      {removeState.error && (
        <p className="text-destructive mt-1.5 text-xs">{removeState.error}</p>
      )}
    </div>
  );
}

function NoteForm({
  classroomId,
  studentId,
  targetId,
  targetKind,
  note,
  onDone,
}: {
  classroomId: string;
  studentId: string;
  targetId: string;
  targetKind: NoteTargetKind;
  note?: InstructorNote;
  onDone: () => void;
}) {
  const [state, submit, pending] = useActionState<NoteActionState, FormData>(
    async (prev, formData) => {
      const result = await saveSubmissionNote(prev, formData);
      if (!result.error) onDone();
      return result;
    },
    {},
  );

  return (
    <form action={submit} className="mt-2 space-y-2">
      <input type="hidden" name="classroomId" value={classroomId} />
      <input type="hidden" name="studentId" value={studentId} />
      <input type="hidden" name="targetId" value={targetId} />
      <input type="hidden" name="targetKind" value={targetKind} />
      {note && <input type="hidden" name="noteId" value={note.id} />}

      <Textarea
        name="body"
        defaultValue={note?.body}
        rows={4}
        maxLength={NOTE_BODY_MAX}
        required
        autoFocus
        placeholder="What you want to say about this piece of work."
        className="text-sm"
      />

      <fieldset className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <legend className="sr-only">Who sees this annotation</legend>
        {(["private_note", "shared"] as NoteVisibility[]).map((value) => (
          <label
            key={value}
            className="flex items-center gap-1.5 text-xs font-medium"
          >
            <input
              type="radio"
              name="visibility"
              value={value}
              defaultChecked={(note?.visibility ?? "private_note") === value}
              className="size-3.5"
            />
            {VISIBILITY_LABEL[value]}
          </label>
        ))}
      </fieldset>

      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving…" : note ? "Save" : "Add annotation"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>

      {state.error && (
        <p className="text-destructive text-xs">{state.error}</p>
      )}
    </form>
  );
}
