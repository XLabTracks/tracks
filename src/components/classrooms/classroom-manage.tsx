"use client";

import { useState, useTransition, type ReactNode } from "react";
import {
  Check,
  Copy,
  LogOut,
  RefreshCw,
  Shield,
  ShieldOff,
  Trash2,
  UserMinus,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  deleteClassroom,
  issueInstructorCode,
  leaveClassroom,
  removeMember,
  regenerateJoinCode,
  revokeInstructorCode,
  setMemberRole,
} from "@/app/actions/classrooms";
import { deleteAssignment } from "@/app/actions/assignments";

/**
 * A trigger that opens a confirm dialog before running a server action.
 * Destructive/consequential classroom actions (remove, leave, delete, role
 * changes) all funnel through here so a single misclick can't reshape a
 * roster. On success we toast and close; on failure we toast and keep the
 * dialog open so the reader can retry or cancel. Redirecting actions (leave,
 * delete) navigate away before the close matters.
 */
function ConfirmButton({
  trigger,
  title,
  description,
  confirmLabel,
  successMessage,
  errorMessage,
  action,
  destructive = true,
}: {
  trigger: ReactNode;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  successMessage: string;
  errorMessage: string;
  action: () => Promise<void>;
  destructive?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  return (
    <Dialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm" disabled={pending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant={destructive ? "destructive" : "default"}
            size="sm"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                try {
                  await action();
                  toast.success(successMessage);
                  setOpen(false);
                } catch (error) {
                  // A redirecting action (leave/delete) may surface Next's
                  // navigation signal here — rethrow it so the router still
                  // navigates and we don't flash a false failure toast.
                  if (
                    error &&
                    typeof (error as { digest?: unknown }).digest === "string" &&
                    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
                  ) {
                    throw error;
                  }
                  toast.error(errorMessage);
                }
              })
            }
          >
            {pending ? "Working…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CopyJoinCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy");
    }
  };
  return (
    <div className="flex items-center gap-2">
      <code className="bg-muted rounded px-2 py-1 text-sm font-semibold tracking-widest">
        {code}
      </code>
      <Button variant="ghost" size="sm" onClick={copy} className="gap-1">
        {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}

export function RegenerateCodeButton({ classroomId }: { classroomId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      className="gap-1"
      onClick={() =>
        startTransition(async () => {
          try {
            await regenerateJoinCode(classroomId);
            toast.success("New join code generated");
          } catch {
            toast.error("Couldn't regenerate code");
          }
        })
      }
    >
      <RefreshCw className="size-3.5" aria-hidden /> New code
    </Button>
  );
}

/**
 * The co-facilitator invite: a second code that joins as an instructor rather
 * than a student.
 *
 * A room has none until its facilitator asks for one, and the state is the
 * whole control — no code yet offers "Invite a co-facilitator", a live one
 * shows itself with Replace and Revoke. What the code does is said next to
 * it, every time, because it hands over the roster and the delete button to
 * whoever it reaches.
 */
export function CoFacilitatorCode({
  classroomId,
  code,
}: {
  classroomId: string;
  code: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const run = (
    action: () => Promise<void>,
    success: string,
    failure: string,
  ) =>
    startTransition(async () => {
      try {
        await action();
        toast.success(success);
      } catch {
        toast.error(failure);
      }
    });

  if (!code) {
    return (
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Co-facilitators
        </p>
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          className="gap-1"
          onClick={() =>
            run(
              () => issueInstructorCode(classroomId),
              "Co-facilitator code created",
              "Couldn't create the code",
            )
          }
        >
          <UserPlus className="size-3.5" aria-hidden /> Invite a co-facilitator
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        Co-facilitator code
      </p>
      <CopyJoinCode code={code} />
      <p className="text-muted-foreground max-w-xs text-xs">
        Whoever enters this code joins as a facilitator — the roster, the
        classroom key and the session guides. It stays valid until you replace
        or revoke it.
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          className="gap-1"
          onClick={() =>
            run(
              () => issueInstructorCode(classroomId),
              "New co-facilitator code generated",
              "Couldn't replace the code",
            )
          }
        >
          <RefreshCw className="size-3.5" aria-hidden /> Replace
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={pending}
          className="gap-1"
          onClick={() =>
            run(
              () => revokeInstructorCode(classroomId),
              "Co-facilitator code revoked",
              "Couldn't revoke the code",
            )
          }
        >
          <ShieldOff className="size-3.5" aria-hidden /> Revoke
        </Button>
      </div>
    </div>
  );
}

export function RemoveMemberButton({
  classroomId,
  userId,
  name,
}: {
  classroomId: string;
  userId: string;
  name: string;
}) {
  return (
    <ConfirmButton
      trigger={
        <Button variant="ghost" size="icon" aria-label={`Remove ${name}`}>
          <UserMinus className="size-4" aria-hidden />
        </Button>
      }
      title="Remove student?"
      description={
        <>
          {name} will lose access to this classroom. Their progress and work are
          kept — they can rejoin later with the code.
        </>
      }
      confirmLabel="Remove"
      successMessage="Student removed"
      errorMessage="Couldn't remove student"
      action={() => removeMember(classroomId, userId)}
    />
  );
}

/**
 * Promote a student to co-instructor or step an instructor back down. The
 * page hides the demote control when a member is the classroom's only
 * instructor (the action refuses it too).
 */
export function RoleToggleButton({
  classroomId,
  userId,
  name,
  role,
}: {
  classroomId: string;
  userId: string;
  name: string;
  role: "instructor" | "student";
}) {
  const promoting = role === "student";
  return (
    <ConfirmButton
      trigger={
        <Button
          variant="ghost"
          size="icon"
          aria-label={promoting ? `Make ${name} an instructor` : `Make ${name} a student`}
        >
          {promoting ? (
            <Shield className="size-4" aria-hidden />
          ) : (
            <ShieldOff className="size-4" aria-hidden />
          )}
        </Button>
      }
      title={promoting ? "Make instructor?" : "Step down to student?"}
      description={
        promoting ? (
          <>
            {name} will get full instructor access — the roster, every
            student&apos;s work, the join code, and the grading key.
          </>
        ) : (
          <>{name} will go back to a student&apos;s view and lose instructor access.</>
        )
      }
      confirmLabel={promoting ? "Make instructor" : "Step down"}
      successMessage={promoting ? "Now an instructor" : "Now a student"}
      errorMessage="Couldn't change role"
      destructive={!promoting}
      action={() => setMemberRole(classroomId, userId, promoting ? "instructor" : "student")}
    />
  );
}

export function LeaveClassroomButton({ classroomId }: { classroomId: string }) {
  return (
    <ConfirmButton
      trigger={
        <Button variant="outline" size="sm" className="gap-1">
          <LogOut className="size-3.5" aria-hidden /> Leave classroom
        </Button>
      }
      title="Leave this classroom?"
      description="You'll stop appearing on the instructor's roster. Your progress is kept, and you can rejoin later with the code."
      confirmLabel="Leave"
      successMessage="You left the classroom"
      errorMessage="Couldn't leave the classroom"
      action={() => leaveClassroom(classroomId)}
    />
  );
}

export function DeleteAssignmentButton({
  classroomId,
  assignmentId,
  title,
}: {
  classroomId: string;
  assignmentId: string;
  title: string;
}) {
  return (
    <ConfirmButton
      trigger={
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Delete assignment ${title}`}
        >
          <Trash2 className="size-4" aria-hidden />
        </Button>
      }
      title="Delete this assignment?"
      description={
        <>
          {title} will disappear from every student&apos;s classroom page.
          Their progress on the underlying lessons and papers is kept.
        </>
      }
      confirmLabel="Delete"
      successMessage="Assignment deleted"
      errorMessage="Couldn't delete the assignment"
      action={() => deleteAssignment(classroomId, assignmentId)}
    />
  );
}

export function DeleteClassroomButton({
  classroomId,
  name,
}: {
  classroomId: string;
  name: string;
}) {
  return (
    <ConfirmButton
      trigger={
        <Button variant="ghost" size="sm" className="text-destructive gap-1">
          <Trash2 className="size-3.5" aria-hidden /> Delete classroom
        </Button>
      }
      title="Delete this classroom?"
      description={
        <>
          {name} and its roster, join code, and stored grading key will be
          permanently deleted. Students&apos; own progress and work are kept.
          This can&apos;t be undone.
        </>
      }
      confirmLabel="Delete classroom"
      successMessage="Classroom deleted"
      errorMessage="Couldn't delete the classroom"
      action={() => deleteClassroom(classroomId)}
    />
  );
}
