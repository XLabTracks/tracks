export interface BugReportForm {
  viewformUrl: string;
  quoteField: string;
  pageField: string;
  urlField: string;
  commentField: string;
  emailField: string;
  screenshotField: string;
}

export const BUG_REPORT_FORM: BugReportForm = {
  viewformUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSf65LCFFRvpU8cGAQOTyxbWO30yZpf0Y2s4S4W-Js6gHzjAHA/viewform",
  quoteField: "entry.805073738",
  pageField: "entry.568752826",
  urlField: "entry.1180304402",
  commentField: "entry.692528752",
  emailField: "",
  screenshotField: "",
};

export function formResponseUrl(form: BugReportForm = BUG_REPORT_FORM): string {
  return form.viewformUrl.trim().split("?")[0]!.replace(/\/viewform$/, "/formResponse");
}

export interface FeedbackSubmission {
  quote: string;
  page: string;
  url: string;
  comment: string;
  email?: string;
  screenshotUrl?: string;
}

export function submissionParams(
  submission: FeedbackSubmission,
  form: BugReportForm = BUG_REPORT_FORM,
): URLSearchParams {
  const params = new URLSearchParams();
  const set = (field: string, value: string | undefined) => {
    const name = field.trim();
    if (name && value && value.trim()) params.set(name, value.trim());
  };
  set(form.quoteField, truncateQuote(submission.quote));
  set(form.pageField, submission.page);
  set(form.urlField, submission.url);
  set(form.commentField, submission.comment);
  set(form.emailField, submission.email);
  set(form.screenshotField, submission.screenshotUrl);
  return params;
}

export function canSubmitDirectly(form: BugReportForm = BUG_REPORT_FORM): boolean {
  return isBugReportConfigured(form) && Boolean(form.commentField.trim());
}

export const QUOTE_LIMIT = 1200;

export interface BugReportContext {
  quote: string;
  page: string;
  url: string;
}

export function isBugReportConfigured(
  form: BugReportForm = BUG_REPORT_FORM,
): boolean {
  return Boolean(form.viewformUrl.trim() && form.quoteField.trim());
}

export function truncateQuote(
  quote: string,
  limit: number = QUOTE_LIMIT,
): string {
  const text = quote.trim().replace(/\s+/g, " ");
  if (text.length <= limit) return text;
  return text.slice(0, Math.max(0, limit - 1)).trimEnd() + "…";
}

export function bugReportHref(
  context: BugReportContext,
  form: BugReportForm = BUG_REPORT_FORM,
): string | null {
  if (!isBugReportConfigured(form)) return null;

  const base = form.viewformUrl.trim().split("?")[0]!;
  const params = new URLSearchParams({ usp: "pp_url" });
  params.set(form.quoteField.trim(), truncateQuote(context.quote));
  if (form.pageField.trim()) params.set(form.pageField.trim(), context.page);
  if (form.urlField.trim()) params.set(form.urlField.trim(), context.url);
  return `${base}?${params.toString()}`;
}
