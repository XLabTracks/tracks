"use client";

import { toast } from "sonner";

/**
 * Awaits an exercise server action, converting a rejection (transient
 * network/DB failure) into a retry toast — under React 19 an error thrown by
 * an async action inside `startTransition` surfaces to the nearest error
 * boundary, which would replace the whole lesson page (and every card's
 * in-progress state) with the error page. `onSuccess` runs only when the
 * action resolved, so a failed save never advances or locks the UI ahead of
 * the persisted truth. (The WritingEditor submit/reopen try/catch pattern,
 * shared by every exercise card.)
 */
export async function runExerciseAction<T>(
  action: () => Promise<T>,
  options?: {
    onSuccess?: (result: T) => void;
    errorMessage?: string;
  },
): Promise<void> {
  let result: T;
  try {
    result = await action();
  } catch {
    toast.error(options?.errorMessage ?? "Couldn't save. Please try again.");
    return;
  }
  options?.onSuccess?.(result);
}
