import { describe, it, expect } from "vitest";
import {
  BUG_REPORT_FORM,
  bugReportHref,
  isBugReportConfigured,
  QUOTE_LIMIT,
  truncateQuote,
  type BugReportForm,
} from "./bug-report";

const form = (over: Partial<BugReportForm> = {}): BugReportForm => ({
  viewformUrl: "https://docs.google.com/forms/d/e/FORM_ID/viewform",
  quoteField: "entry.1",
  pageField: "entry.2",
  urlField: "entry.3",
  commentField: "entry.4",
  emailField: "entry.5",
  screenshotField: "entry.6",
  ...over,
});

const ctx = {
  quote: "the monitoring hardware itself is compromised",
  page: "Building verification intuitions",
  url: "https://aisafetytracks.com/tracks/verification/why-verification/building-intuitions",
};

const blank: BugReportForm = {
  viewformUrl: "",
  quoteField: "",
  pageField: "",
  urlField: "",
  commentField: "",
  emailField: "",
  screenshotField: "",
};

describe("isBugReportConfigured", () => {
  it("is false for a half-filled form, so the action never appears half-wired", () => {
    expect(isBugReportConfigured(blank)).toBe(false);
    expect(isBugReportConfigured(form({ viewformUrl: "" }))).toBe(false);
    expect(isBugReportConfigured(form({ quoteField: "  " }))).toBe(false);
    expect(isBugReportConfigured(form())).toBe(true);
  });

  it("the shipped form is wired, so the action is actually reachable", () => {
    expect(isBugReportConfigured(BUG_REPORT_FORM)).toBe(true);
    expect(BUG_REPORT_FORM.viewformUrl).toMatch(
      /^https:\/\/docs\.google\.com\/forms\/d\/e\/[\w-]+\/viewform$/,
    );
    for (const field of [
      BUG_REPORT_FORM.quoteField,
      BUG_REPORT_FORM.pageField,
      BUG_REPORT_FORM.urlField,
    ])
      expect(field).toMatch(/^entry\.\d+$/);
  });

  it("gives each answer its own field rather than collapsing two into one", () => {
    const fields = [
      BUG_REPORT_FORM.quoteField,
      BUG_REPORT_FORM.pageField,
      BUG_REPORT_FORM.urlField,
    ];
    expect(new Set(fields).size).toBe(fields.length);
  });
});

describe("bugReportHref", () => {
  it("returns null when unconfigured rather than a broken link", () => {
    expect(bugReportHref(ctx, blank)).toBeNull();
  });

  it("prefills the quote, the page name and the page URL", () => {
    const url = new URL(bugReportHref(ctx, form())!);
    expect(url.origin + url.pathname).toBe(
      "https://docs.google.com/forms/d/e/FORM_ID/viewform",
    );
    expect(url.searchParams.get("usp")).toBe("pp_url");
    expect(url.searchParams.get("entry.1")).toBe(ctx.quote);
    expect(url.searchParams.get("entry.2")).toBe(ctx.page);
    expect(url.searchParams.get("entry.3")).toBe(ctx.url);
  });

  it("sends only the three prefills and Google's marker, so the comment field stays the reporter's", () => {
    const url = new URL(bugReportHref(ctx, form())!);
    expect([...url.searchParams.keys()].sort()).toEqual([
      "entry.1",
      "entry.2",
      "entry.3",
      "usp",
    ]);
  });

  it("keeps a query already on the configured URL from being doubled", () => {
    const href = bugReportHref(
      ctx,
      form({
        viewformUrl:
          "https://docs.google.com/forms/d/e/FORM_ID/viewform?usp=sf_link",
      }),
    )!;
    expect(href.match(/\?/g)).toHaveLength(1);
    expect(new URL(href).searchParams.get("usp")).toBe("pp_url");
  });

  it("skips the optional fields when they are not configured", () => {
    const url = new URL(
      bugReportHref(ctx, form({ pageField: "", urlField: "" }))!,
    );
    expect([...url.searchParams.keys()].sort()).toEqual(["entry.1", "usp"]);
  });
});

describe("truncateQuote", () => {
  it("collapses whitespace so a selection across lines arrives as one passage", () => {
    expect(truncateQuote("  two\n\n  lines  ")).toBe("two lines");
  });

  it("caps a long selection: the prefill rides in a URL and URLs have limits", () => {
    const long = "x".repeat(QUOTE_LIMIT + 500);
    const out = truncateQuote(long);
    expect(out.length).toBe(QUOTE_LIMIT);
    expect(out.endsWith("…")).toBe(true);
  });

  it("leaves a quote at the limit untouched", () => {
    const exact = "x".repeat(QUOTE_LIMIT);
    expect(truncateQuote(exact)).toBe(exact);
  });
});
