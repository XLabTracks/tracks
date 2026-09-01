import { NextResponse } from "next/server";
import {
  BUG_REPORT_FORM,
  canSubmitDirectly,
  formResponseUrl,
  submissionParams,
} from "@/lib/verification/bug-report";

/**
 * Posts a feedback report to the Google Form on the reporter's behalf.
 *
 * It runs on the server for one reason: from the page, the submit has to be
 * `mode: "no-cors"` (Google sends no CORS headers), and an opaque response
 * cannot be read — so the dialog could never tell the reporter whether their
 * report landed. Here the status is legible, and the dialog can offer the
 * real form as a fallback when it is not.
 *
 * Google refuses an anonymous post with 401 when the form collects a verified
 * email or carries a file-upload question; both force a signed-in Google
 * session. That is reported as `signInRequired` rather than a generic
 * failure, because the fix is a form setting, not a retry.
 */
export const runtime = "nodejs";

const MAX_FIELD = 8000;

function clean(value: unknown): string {
  return typeof value === "string" ? value.slice(0, MAX_FIELD) : "";
}

export async function POST(request: Request) {
  if (!canSubmitDirectly()) {
    return NextResponse.json(
      { ok: false, reason: "not-configured" },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }

  const comment = clean(body.comment).trim();
  if (!comment) {
    return NextResponse.json({ ok: false, reason: "empty" }, { status: 400 });
  }

  const params = submissionParams({
    quote: clean(body.quote),
    page: clean(body.page),
    url: clean(body.url),
    comment,
    email: clean(body.email),
    screenshotUrl: clean(body.screenshotUrl),
  });

  let response: Response;
  try {
    response = await fetch(formResponseUrl(), {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      redirect: "manual",
    });
  } catch {
    return NextResponse.json({ ok: false, reason: "unreachable" }, { status: 502 });
  }

  // Forms answers a good submission with 200, or with a redirect to its
  // "response recorded" page. Both mean the row exists.
  const ok = response.status === 200 || (response.status >= 300 && response.status < 400);
  if (ok) return NextResponse.json({ ok: true });

  return NextResponse.json(
    {
      ok: false,
      reason: response.status === 401 || response.status === 403
        ? "signInRequired"
        : "rejected",
      status: response.status,
      formUrl: BUG_REPORT_FORM.viewformUrl,
    },
    { status: 502 },
  );
}
