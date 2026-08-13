import { useEffect } from "react";
import { Toaster, toast } from "tracks";

export const Toasts = () => {
  useEffect(() => {
    // Fire once on mount; Infinity keeps them on screen for capture.
    toast.success("Progress saved", { duration: Infinity });
    toast.info("Review queue: 4 cards due today", { duration: Infinity });
    toast.error("Couldn't submit. Please try again.", {
      duration: Infinity,
    });
  }, []);

  return (
    <div className="relative min-h-[420px] w-full p-4">
      {/* top-left: the capture clips the single-mode card to its viewport,
          and page-fixed bottom-right toasts land outside that clip. */}
      <Toaster position="top-left" expand />
    </div>
  );
};
