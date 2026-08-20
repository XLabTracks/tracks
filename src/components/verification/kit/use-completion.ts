"use client";

import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { setLessonComplete } from "@/app/actions/progress";

export function useVerificationCompletion(
  contentId: string,
  {
    bridged,
    canTrack,
    initialCompleted,
  }: { bridged: boolean; canTrack: boolean; initialCompleted: boolean },
): () => void {
  const done = useRef(initialCompleted);

  useEffect(() => {
    done.current = initialCompleted;
  }, [initialCompleted]);

  return useCallback(() => {
    if (!bridged || !canTrack || done.current) return;
    done.current = true;
    setLessonComplete(contentId, true)
      .then(() => {
        toast.success("Exercise complete");
      })
      .catch(() => {
        done.current = false;
        toast.error("Couldn't record completion — try again.");
      });
  }, [bridged, canTrack, contentId]);
}
