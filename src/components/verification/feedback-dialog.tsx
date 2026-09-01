"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bugReportHref } from "@/lib/verification/bug-report";

export interface FeedbackTarget {
  quote: string;
  page: string;
  url: string;
}

type Phase = "editing" | "sending" | "sent" | "failed";

const SHOT_MAX_WIDTH = 1400;

async function capture(): Promise<Blob | null> {
  try {
    const { toBlob } = await import("html-to-image");
    return await toBlob(document.body, {
      pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      canvasWidth: Math.min(document.documentElement.clientWidth, SHOT_MAX_WIDTH),
      filter: (node) =>
        !(node instanceof HTMLElement && node.dataset.noScreenshot === "true"),
    });
  } catch {
    return null;
  }
}

async function upload(blob: Blob): Promise<string | undefined> {
  try {
    const res = await fetch("/api/verification/feedback/screenshot", {
      method: "POST",
      headers: { "content-type": "image/png" },
      body: blob,
    });
    if (!res.ok) return undefined;
    const data = (await res.json()) as { url?: string };
    return data.url;
  } catch {
    return undefined;
  }
}

export function FeedbackDialog({
  target,
  onClose,
}: {
  target: FeedbackTarget;
  onClose: () => void;
}) {
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [quote, setQuote] = useState(target.quote);
  const [withShot, setWithShot] = useState(true);
  const [phase, setPhase] = useState<Phase>("editing");
  const [problem, setProblem] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  const send = useCallback(async () => {
    if (!comment.trim() || phase === "sending") return;
    setPhase("sending");
    setProblem(null);

    let screenshotUrl: string | undefined;
    if (withShot) {
      const blob = await capture();
      if (blob) screenshotUrl = await upload(blob);
    }

    try {
      const res = await fetch("/api/verification/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...target, quote, comment, email, screenshotUrl }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; reason?: string };
      if (data.ok) return setPhase("sent");
      setProblem(
        data.reason === "signInRequired"
          ? "The form is set to require a Google sign-in, so it would not take this from here."
          : "The form did not accept it.",
      );
      setPhase("failed");
    } catch {
      setProblem("Could not reach the form.");
      setPhase("failed");
    }
  }, [comment, email, phase, quote, target, withShot]);

  const fallback = bugReportHref({ quote, page: target.page, url: target.url });

  return createPortal(
    <div
      data-no-screenshot="true"
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-3 sm:items-center"
      onMouseDown={(e) => {
        if (!boxRef.current?.contains(e.target as Node)) onClose();
      }}
    >
      <div
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        aria-label="Send feedback"
        className="border-border bg-card shadow-soft-lg max-h-[92dvh] w-full max-w-[30rem] overflow-y-auto rounded-xl border p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-lg font-semibold">Send feedback</p>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground -m-1 p-1"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        {phase === "sent" ? (
          <div className="mt-3">
            <p className="text-sm leading-relaxed">
              Sent. Thank you — that goes straight to the people building this.
            </p>
            <Button size="sm" className="mt-4" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              Tell us what is wrong with the passage you selected, or anything
              else.
            </p>

            {quote ? (
              <div className="border-border bg-muted/40 mt-3 rounded-lg border p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-muted-foreground eyebrow">Selected</p>
                  <button
                    type="button"
                    aria-label="Drop the selected passage from this report"
                    onClick={() => setQuote("")}
                    className="text-muted-foreground hover:text-foreground -m-1 p-1"
                  >
                    <X className="size-3.5" aria-hidden />
                  </button>
                </div>
                <p className="border-border mt-1.5 border-l-2 pl-2.5 text-sm italic">
                  {quote.length > 220 ? quote.slice(0, 219) + "…" : quote}
                </p>
              </div>
            ) : null}

            <label htmlFor="feedback-comment" className="sr-only">
              What is wrong?
            </label>
            <textarea
              id="feedback-comment"
              ref={firstRef}
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Type here"
              className="border-border bg-background focus-visible:ring-ring mt-3 w-full rounded-lg border p-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />

            <label
              htmlFor="feedback-email"
              className="mt-3 block text-sm font-medium"
            >
              Email
            </label>
            <input
              id="feedback-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="border-border bg-background focus-visible:ring-ring mt-1 w-full rounded-lg border p-2.5 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              Your email is recorded with this report so we can ask a follow-up
              question. It is collected only while the course is in playtesting.
            </p>

            <label className="mt-3 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={withShot}
                onChange={(e) => setWithShot(e.target.checked)}
                className="size-4"
              />
              Include a picture of this page
            </label>

            {problem ? (
              <div className="border-border bg-muted/40 mt-3 rounded-lg border p-3">
                <p className="text-sm leading-relaxed">{problem}</p>
                {fallback ? (
                  <a
                    href={fallback}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link mt-1.5 inline-block text-sm underline underline-offset-4"
                  >
                    Open the form instead — your passage and page carry over
                  </a>
                ) : null}
              </div>
            ) : null}

            <Button
              className="mt-4 w-full"
              disabled={!comment.trim() || phase === "sending"}
              onClick={send}
            >
              {phase === "sending" ? "Sending…" : "Send feedback"}
            </Button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
