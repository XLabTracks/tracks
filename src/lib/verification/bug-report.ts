export interface BugReportForm {
  viewformUrl: string;
  quoteField: string;
  pageField: string;
  urlField: string;
}

export const BUG_REPORT_FORM: BugReportForm = {
  viewformUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSf65LCFFRvpU8cGAQOTyxbWO30yZpf0Y2s4S4W-Js6gHzjAHA/viewform",
  quoteField: "entry.805073738",
  pageField: "entry.568752826",
  urlField: "entry.1180304402",
};

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
