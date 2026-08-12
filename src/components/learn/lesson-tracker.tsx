"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { recordLessonView, setLessonComplete } from "@/app/actions/progress";
import { PAPER_GATE_OPEN_EVENT } from "@/lib/papers/gate-state";

/**
 * Records the content view on open and auto-marks it complete once the end
 * scrolls into view (the sentinel sits at the end of the body), so a learner
 * who reaches the bottom completes it without clicking. The manual complete
 * button stays available for explicit (re)marking. No-ops when already
 * complete. Works for any progress-countable content id (lesson or paper);
 * inline trackers inside a paper pass recordView={false} so opening a paper
 * doesn't stamp lastViewedAt for every embedded lesson at once.
 *
 * autoComplete={false} keeps the view stamp but disables the scroll-based
 * completion — used for lessons whose body is a bridged Verification
 * interactive, where completion should come from finishing the exercise
 * (or the explicit button), not from scrolling past a one-line body.
 *
 * gateKeys are the localStorage keys of the reading gates in this content's
 * body (papers with `gate` edits): scroll completion arms only once every
 * key reads "open". With gates closed the whole body below the first gate is
 * unmounted and this sentinel sits right under its card — completing on its
 * visibility would mark a mostly-unread paper complete. The manual button is
 * unaffected.
 */
export function LessonTracker({
  lessonId,
  completed,
  recordView = true,
  autoComplete = true,
  gateKeys,
  toastLabel = "Lesson complete",
}: {
  lessonId: string;
  completed: boolean;
  recordView?: boolean;
  autoComplete?: boolean;
  gateKeys?: string[];
  toastLabel?: string;
}) {
  const sentinel = useRef<HTMLDivElement>(null);
  const done = useRef(completed);

  // Joined signature so the effect keys on content, not array identity (the
  // server component sends a fresh array every render).
  const gateSig = gateKeys?.join("\n") ?? "";
  const [gatesOpen, setGatesOpen] = useState(gateSig === "");
  useEffect(() => {
    if (gateSig === "") return;
    const keys = gateSig.split("\n");
    const check = () => {
      try {
        if (keys.every((key) => window.localStorage.getItem(key) === "open")) {
          setGatesOpen(true);
        }
      } catch {
        // Storage unavailable — scroll completion stays off; the manual
        // complete button still works.
      }
    };
    check();
    window.addEventListener(PAPER_GATE_OPEN_EVENT, check);
    return () => window.removeEventListener(PAPER_GATE_OPEN_EVENT, check);
  }, [gateSig]);

  // Keep the guard in step with the server's view: after the manual button
  // (or another tab) completes this lesson and the layout re-renders with
  // completed=true, don't let the observer fire a second write + toast.
  useEffect(() => {
    done.current = completed;
  }, [completed]);

  useEffect(() => {
    if (recordView) void recordLessonView(lessonId);
  }, [lessonId, recordView]);

  useEffect(() => {
    if (!autoComplete || !gatesOpen || done.current) return;
    const el = sentinel.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (done.current || !entries.some((e) => e.isIntersecting)) return;
        done.current = true;
        // setLessonComplete calls revalidatePath, so the action response
        // re-renders the route (sidebar checkmark + button included) — no
        // client router.refresh() needed.
        setLessonComplete(lessonId, true)
          .then(() => {
            // Disarm only on a confirmed write — disconnecting up front
            // would kill scroll completion for the visit if the action
            // failed once (the observer never re-arms).
            observer.disconnect();
            toast.success(toastLabel);
          })
          .catch(() => {
            // Still observing: the next intersection transition retries.
            // Meanwhile the failure must be visible — otherwise the learner
            // scrolls past the end and the checkmark silently never lights.
            done.current = false;
            toast.error("Couldn't save your progress — try the Mark complete button.");
          });
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [autoComplete, gatesOpen, lessonId, toastLabel]);

  return <div ref={sentinel} aria-hidden className="h-px w-full" />;
}
