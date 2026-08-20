"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  WRITING_MAX_SECTION_CHARS,
  isStorableText,
} from "@/lib/content/exercise-view";
import type { RubricCriterion, WritingSection } from "@/lib/content/types";

function countWords(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export type WritingValues = Record<string, string>;

export interface WritingEditorProps {
  sections: WritingSection[];
  rubric?: RubricCriterion[];
  minWords?: number;
  maxWords?: number;
  initialValues?: WritingValues;
  submitted?: boolean;
  submitLabel?: string;
  /** When provided, the editor autosaves a debounced draft on change. */
  onSaveDraft?: (values: WritingValues) => Promise<void> | void;
  /** When provided, renders a submit button wired to this handler. */
  onSubmit?: (values: WritingValues) => Promise<void> | void;
  /**
   * When provided, a submitted editor offers "Edit submission": the handler
   * reverts the row to draft server-side, then the editor unlocks. Editing
   * after grading is allowed — the stored grade stays until re-graded.
   */
  onReopen?: () => Promise<void> | void;
}

export function WritingEditor({
  sections,
  rubric,
  minWords,
  maxWords,
  initialValues,
  submitted = false,
  submitLabel = "Submit",
  onSaveDraft,
  onSubmit,
  onReopen,
}: WritingEditorProps) {
  const router = useRouter();
  const [values, setValues] = useState<WritingValues>(() => initialValues ?? {});
  const [isSubmitted, setIsSubmitted] = useState(submitted);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  // Separate transitions so each button's label reflects its own action
  // during the router.refresh() tail; both buttons disable on either.
  const [submitPending, startSubmitTransition] = useTransition();
  const [reopenPending, startReopenTransition] = useTransition();
  const pending = submitPending || reopenPending;
  const skipFirstSave = useRef(true);
  // Keep the latest save handler in a ref so a changed bound-action identity
  // doesn't re-trigger the debounced autosave. Written in an effect (not during
  // render) — the ref is only read later, inside the debounced setTimeout.
  const saveDraftRef = useRef(onSaveDraft);
  useEffect(() => {
    saveDraftRef.current = onSaveDraft;
  });
  // Monotonic save id controls the label; the promise chain also serializes
  // writes so an older slow request can never land after a newer draft.
  const saveSeq = useRef(0);
  const saveChain = useRef<Promise<void>>(Promise.resolve());

  const totalWords = useMemo(
    () => sections.reduce((sum, s) => sum + countWords(values[s.id] ?? ""), 0),
    [values, sections],
  );

  // Mirror the server sanitizer: saveWritingDraft/submitWriting reject the
  // whole payload on unstorable text (\u0000, lone surrogates), so a save of
  // such a draft would silently no-op while the label claimed "Draft saved".
  // (The length cap is mirrored by maxLength on the textareas below.)
  const storable = useMemo(
    () => sections.every((s) => isStorableText(values[s.id] ?? "")),
    [values, sections],
  );

  useEffect(() => {
    if (!saveDraftRef.current || isSubmitted) return;
    if (skipFirstSave.current) {
      skipFirstSave.current = false;
      return;
    }
    setSaveState("saving");
    const handle = setTimeout(async () => {
      // The server would reject an unstorable draft wholesale — skip the
      // doomed save (the status label derives "Couldn't save" from
      // `storable` at render time, overriding this stale saveState).
      if (!storable) return;
      const seq = ++saveSeq.current;
      try {
        const save = saveDraftRef.current;
        saveChain.current = saveChain.current
          .catch(() => undefined)
          .then(async () => {
            await save?.(values);
          });
        await saveChain.current;
        // Ignore a stale save that resolved after a newer one started.
        if (seq === saveSeq.current) setSaveState("saved");
      } catch {
        // A rejected action (network/DB) keeps the local draft; say so
        // rather than crashing or claiming green. The next keystroke
        // retries.
        if (seq === saveSeq.current) setSaveState("error");
      }
    }, 800);
    return () => clearTimeout(handle);
  }, [values, isSubmitted, storable]);

  const setField = (id: string, value: string) =>
    setValues((prev) => ({ ...prev, [id]: value }));

  const submit = () => {
    if (!onSubmit) return;
    startSubmitTransition(async () => {
      try {
        await onSubmit(values);
        setIsSubmitted(true);
        // Server components gate on submission status (e.g. the transparency
        // card appears only once submitted) — re-render them now. Hosts key
        // this editor on the submission's updatedAt, so the refresh also
        // remounts it seeded with the server's row.
        router.refresh();
      } catch {
        toast.error("Couldn't submit. Please try again.");
      }
    });
  };

  const reopen = () => {
    if (!onReopen) return;
    startReopenTransition(async () => {
      try {
        await onReopen();
        // Re-arm the autosave skip: the submitted→draft flip alone must not
        // autosave (nothing changed yet). The keyed remount from refresh()
        // resets this anyway — this covers the window until it lands.
        skipFirstSave.current = true;
        setSaveState("idle");
        // Deliberately NOT flipping isSubmitted here: the textarea stays
        // disabled ("Reopening…") until refresh() lands and the keyed
        // remount delivers the editable draft seeded with the server row —
        // enabling it early would let keystrokes typed in that window be
        // discarded by the remount.
        router.refresh();
      } catch {
        toast.error("Couldn't reopen for editing. Please try again.");
      }
    });
  };

  const belowMin = minWords != null && totalWords < minWords;
  const aboveMax = maxWords != null && totalWords > maxWords;
  const multiSection = sections.length > 1;

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.id} className="space-y-1.5">
          <Label htmlFor={`w-${section.id}`}>{section.label}</Label>
          {section.guidance && (
            <p className="text-muted-foreground text-xs">{section.guidance}</p>
          )}
          <Textarea
            id={`w-${section.id}`}
            value={values[section.id] ?? ""}
            placeholder={section.placeholder}
            onChange={(e) => setField(section.id, e.target.value)}
            disabled={isSubmitted}
            rows={multiSection ? 4 : 6}
            maxLength={WRITING_MAX_SECTION_CHARS}
            className="resize-y"
          />
        </div>
      ))}

      <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* THE COUNTER DOES NOT WARN YOU FOR NOT HAVING STARTED.
            It used to paint amber whenever the draft was below the minimum,
            which is true from the first paint and stays true for the whole
            of the first two hundred words — so the warning colour was the
            resting state of the control and meant "this exercise exists".
            Course owner, seeing it at zero words: "why is this orange".

            Below the minimum is now simply the default: muted, uncoloured,
            and the count already says `min 200` while Submit stays disabled,
            so nothing is hidden. Reaching the minimum turns it `--met`, which
            is the positive signal the sibling counter in
            argue-reveal-exercise.tsx has always used — a token, so it
            re-solves per theme instead of being one fixed orange. Only
            overshooting the maximum warns, because that is the one state that
            is wrong at the moment it is shown rather than on the way to being
            right. The dark pairing is the one the repo's other two warning
            lines use. */}
        <span
          className={cn(
            aboveMax
              ? "text-amber-600 dark:text-amber-500"
              : !belowMin && minWords != null && "text-met",
          )}
        >
          {totalWords} words
          {minWords ? ` · min ${minWords}` : ""}
          {maxWords ? ` · max ${maxWords}` : ""}
        </span>
        {onSaveDraft && !isSubmitted && (
          <span
            className={cn(
              (!storable || saveState === "error") && "text-destructive",
            )}
          >
            {!storable || saveState === "error"
              ? "Couldn't save"
              : saveState === "saving"
                ? "Saving…"
                : saveState === "saved"
                  ? "Draft saved"
                  : ""}
          </span>
        )}
      </div>

      {rubric && rubric.length > 0 && (
        <div className="border-border rounded-lg border p-3">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Rubric
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            {rubric.map((criterion) => (
              <li key={criterion.id}>
                <span className="font-medium">{criterion.label}</span>
                {criterion.description && (
                  <span className="text-muted-foreground"> — {criterion.description}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {onSubmit ? (
        isSubmitted ? (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Submitted</Badge>
            {onReopen && (
              <Button
                size="sm"
                variant="ghost"
                onClick={reopen}
                disabled={pending}
              >
                {reopenPending ? "Reopening…" : "Edit submission"}
              </Button>
            )}
          </div>
        ) : (
          <Button
            size="sm"
            onClick={submit}
            // Mirror the server sanitizer so a submit can never be silently
            // rejected server-side.
            disabled={pending || belowMin || !storable}
          >
            {submitPending ? "Submitting…" : submitLabel}
          </Button>
        )
      ) : onSaveDraft ? null : (
        <p className="text-muted-foreground text-xs">
          Sign in to save and submit your work.
        </p>
      )}
    </div>
  );
}
