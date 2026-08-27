"use client";

import { useActionState } from "react";
import {
  createAssignment,
  type AssignmentActionState,
} from "@/app/actions/assignments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface AssignmentPickerItem {
  id: string;
  title: string;
  kind: "lesson" | "paper";
  optional: boolean;
  /** A subsection of an earlier item — indented like the track sidebar. */
  indent: boolean;
  /** How many subsections this item answers for (a section head). */
  sections: number;
}

export interface AssignmentPickerModule {
  id: string;
  label: string;
  items: AssignmentPickerItem[];
}

export interface AssignmentPickerTrack {
  id: string;
  /** Null when the classroom is single-track — no need to name it. */
  title: string | null;
  modules: AssignmentPickerModule[];
}

/**
 * The new-assignment form: title, optional due date and note, and the item
 * picker over the classroom's track scope. Native checkboxes on one shared
 * name keep it a plain form — the server action reads
 * formData.getAll("contentIds") in the same curriculum order it renders here.
 */
export function AssignmentForm({
  classroomId,
  groups,
}: {
  classroomId: string;
  groups: AssignmentPickerTrack[];
}) {
  const [state, action, pending] = useActionState<
    AssignmentActionState,
    FormData
  >(createAssignment, {});

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="classroomId" value={classroomId} />

      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        {/* maxLength mirrors the server-side cap in createAssignment. */}
        <Input
          id="title"
          name="title"
          placeholder="e.g. Week 3 reading"
          maxLength={120}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="dueAt">Due date (optional)</Label>
        <Input id="dueAt" name="dueAt" type="date" className="w-fit" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="note">Note (optional)</Label>
        <Textarea
          id="note"
          name="note"
          placeholder="Anything your students should know about this work"
          maxLength={2000}
          rows={3}
        />
      </div>

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium">Lessons and papers</legend>
        {groups.map((track) => (
          <div key={track.id} className="space-y-4">
            {track.title && (
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {track.title}
              </p>
            )}
            {track.modules.map((mod) => (
              <div
                key={mod.id}
                className="border-border rounded-xl border p-4"
              >
                <p className="text-sm font-semibold">{mod.label}</p>
                <ul className="mt-2 space-y-1.5">
                  {mod.items.map((item) => (
                    <li key={item.id} className={item.indent ? "pl-6" : undefined}>
                      <label className="flex items-baseline gap-2 text-sm">
                        <input
                          type="checkbox"
                          name="contentIds"
                          value={item.id}
                          className="accent-primary size-4 translate-y-0.5"
                        />
                        <span>
                          {item.title}
                          {item.kind === "paper" && (
                            <span className="text-muted-foreground"> · paper</span>
                          )}
                          {/* A section head answers for its subsections — the
                              assignment completes when they all do. */}
                          {item.sections > 0 && (
                            <span className="text-muted-foreground">
                              {" "}
                              · includes its {item.sections} sections
                            </span>
                          )}
                          {item.optional && (
                            <span className="text-muted-foreground">
                              {" "}
                              (optional in the track)
                            </span>
                          )}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </fieldset>

      {state.error && (
        <p role="alert" className="text-destructive text-sm">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Assigning…" : "Assign to classroom"}
      </Button>
    </form>
  );
}
