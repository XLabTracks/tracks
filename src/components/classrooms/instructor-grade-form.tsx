"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  deleteInstructorGrade,
  saveInstructorGrade,
} from "@/app/actions/instructor-grades";
import {
  emptyInstructorCriteria,
  INSTRUCTOR_COMMENT_MAX,
  INSTRUCTOR_NOTE_MAX,
  type InstructorCriterion,
} from "@/lib/grader/instructor-grade";
import { getRubricCriterion, rubricTotal } from "@/lib/grader/rubric";

const SCORES = ["0", "1", "2", "3"] as const;
const SELECTED =
  "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground";

/**
 * An instructor's hand grade on one submission: each reasoning-transparency
 * criterion scored 0–3 (or left N/A), an optional note per criterion, and an
 * overall comment. The /45 total updates as scores are picked, computed the
 * same way as the LLM grader's. The student sees what is saved here under
 * their answer.
 */
export function InstructorGradeForm({
  classroomId,
  submissionId,
  initialCriteria,
  initialComment,
  graded,
}: {
  classroomId: string;
  submissionId: string;
  initialCriteria?: InstructorCriterion[];
  initialComment?: string | null;
  /** A saved grade exists, so it can be removed. */
  graded: boolean;
}) {
  const [criteria, setCriteria] = useState<InstructorCriterion[]>(
    initialCriteria ?? emptyInstructorCriteria(),
  );
  const [comment, setComment] = useState(initialComment ?? "");
  const [openNotes, setOpenNotes] = useState<Set<string>>(
    () => new Set(criteria.filter((c) => c.note !== "").map((c) => c.id)),
  );
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const total = rubricTotal(criteria);

  const update = (id: string, patch: Partial<InstructorCriterion>) => {
    setMessage(null);
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const run = (
    action: () => Promise<{ ok: boolean; error?: string }>,
    done: string,
    onDone?: () => void,
  ) =>
    startTransition(async () => {
      setMessage(null);
      try {
        const result = await action();
        setMessage(
          result.ok
            ? { ok: true, text: done }
            : { ok: false, text: result.error ?? "Something went wrong." },
        );
        if (!result.ok) return;
        onDone?.();
        router.refresh();
      } catch {
        setMessage({ ok: false, text: "Something went wrong. Try again." });
      }
    });

  return (
    <div className="border-border mt-4 rounded-lg border p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-medium">Your grade</p>
        <p className="text-muted-foreground text-xs">
          {total ? (
            <>
              <span className="text-foreground font-semibold tabular-nums">
                {total.score}/45
              </span>{" "}
              — {total.band}
            </>
          ) : (
            "No criteria scored yet"
          )}
        </p>
      </div>

      <div className="divide-border mt-3 divide-y">
        {criteria.map((criterion) => {
          const info = getRubricCriterion(criterion.id);
          if (!info) return null;
          const noteOpen = openNotes.has(criterion.id);
          return (
            <div key={criterion.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <p className="text-sm">
                  {info.label}
                  <span className="text-muted-foreground ml-1.5 text-xs">
                    ×{info.weight}
                  </span>
                </p>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  size="sm"
                  spacing={0}
                  aria-label={`${info.label} score`}
                  value={criterion.score == null ? "na" : String(criterion.score)}
                  onValueChange={(value) =>
                    update(criterion.id, {
                      score: value === "" || value === "na" ? null : Number(value),
                    })
                  }
                >
                  <ToggleGroupItem value="na" className={`px-2.5 text-xs ${SELECTED}`}>
                    N/A
                  </ToggleGroupItem>
                  {SCORES.map((score) => (
                    <ToggleGroupItem
                      key={score}
                      value={score}
                      className={`px-3 tabular-nums ${SELECTED}`}
                    >
                      {score}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
              <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                {criterion.score == null
                  ? (info.question ?? "Excluded from the total, which is rescaled to /45.")
                  : `${criterion.score}: ${info.anchors[criterion.score]}`}
              </p>
              {noteOpen ? (
                <Textarea
                  className="mt-2 min-h-16 text-sm"
                  placeholder="Note for the student on this criterion"
                  maxLength={INSTRUCTOR_NOTE_MAX}
                  value={criterion.note}
                  onChange={(e) => update(criterion.id, { note: e.target.value })}
                />
              ) : (
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground mt-1.5 text-xs underline underline-offset-2"
                  onClick={() => setOpenNotes((prev) => new Set(prev).add(criterion.id))}
                >
                  Add a note
                </button>
              )}
            </div>
          );
        })}
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium">Overall comment</span>
        <Textarea
          className="mt-1.5 min-h-24 text-sm"
          placeholder="What the student should take from this grade"
          maxLength={INSTRUCTOR_COMMENT_MAX}
          value={comment}
          onChange={(e) => {
            setMessage(null);
            setComment(e.target.value);
          }}
        />
      </label>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          disabled={pending}
          onClick={() =>
            run(
              () => saveInstructorGrade(classroomId, submissionId, { criteria, comment }),
              "Saved. The student can see this grade under their answer.",
            )
          }
        >
          {pending ? "Saving…" : graded ? "Update grade" : "Save grade"}
        </Button>
        {graded && (
          <Button
            size="sm"
            variant="ghost"
            disabled={pending}
            onClick={() =>
              run(
                () => deleteInstructorGrade(classroomId, submissionId),
                "Grade removed.",
                () => {
                  setCriteria(emptyInstructorCriteria());
                  setComment("");
                  setOpenNotes(new Set());
                },
              )
            }
          >
            Remove grade
          </Button>
        )}
        {message && (
          <p
            role="status"
            className={message.ok ? "text-muted-foreground text-xs" : "text-destructive text-xs"}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
