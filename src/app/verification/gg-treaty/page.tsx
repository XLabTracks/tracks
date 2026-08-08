import type { Metadata } from "next";
import Link from "next/link";
import treaty from "@/content/verification/gg-treaty.json";

export const metadata: Metadata = {
  title: "Articles on the Global Governance of AI",
};

/**
 * The third agreement 1.1's hard version compares, reproduced in full.
 *
 * The other two are arXiv papers the paper pipeline already holds. This one
 * is not a paper: global-governance.ai renders it from a plugin bundle and
 * offers a builder UI rather than a readable document, so `npm run
 * gg-treaty:build` extracts the articles into a committed artifact and this
 * page prints them. Reproducing it here is the course owner's instruction —
 * the task is to read and compare provisions, and a builder cannot be read.
 *
 * The drafters' commentary rides with each article rather than sitting in a
 * separate apparatus, because for a comparison exercise why a clause is
 * worded that way is the more useful half. It is closed by default: the
 * article is the text under comparison, the commentary is the answer to
 * questions the learner should try first.
 *
 * Trap: article numbers here are the proposal's own ("1.2.2"), not this
 * page's. They are what the commentary cross-references, so never renumber
 * them for presentation.
 */
export default function GgTreatyPage() {
  const total = treaty.sections.reduce((n, s) => n + s.paragraphs.length, 0);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 lg:px-6">
      <p className="text-muted-foreground text-sm">Verification · 1.1</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">
        Articles on the Global Governance of AI
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Global Governance of AI · {treaty.sections.length} sections, {total}{" "}
        articles · imported from{" "}
        <a
          href={treaty.source}
          target="_blank"
          rel="noopener"
          className="underline underline-offset-4"
        >
          global-governance.ai
        </a>{" "}
        on {treaty.retrieved}
      </p>

      <div className="mt-8 space-y-10">
        {treaty.sections.map((section, si) => (
          <section key={`${section.label}-${si}`}>
            <h2 className="text-xl font-semibold tracking-tight">
              {section.label}
            </h2>
            <div className="mt-3 space-y-4">
              {section.paragraphs.map((p) => (
                <div key={p.order}>
                  <p className="text-sm leading-relaxed">
                    <span className="text-muted-foreground font-mono text-xs">
                      {p.order}{" "}
                    </span>
                    {p.content}
                  </p>
                  {p.comment && (
                    <details className="mt-1.5">
                      <summary className="text-muted-foreground cursor-pointer text-xs select-none">
                        Drafters&rsquo; commentary
                      </summary>
                      <p className="border-border text-muted-foreground mt-1.5 border-l-2 pl-3 text-sm leading-relaxed whitespace-pre-line">
                        {p.comment}
                      </p>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="text-muted-foreground mt-10 text-sm">
        Back to{" "}
        <Link
          href="/tracks/verification/policy-scoping/scoping-anatomy"
          className="underline underline-offset-4"
        >
          1.1 Anatomy of a (Pause) Agreement
        </Link>
        .
      </p>
    </main>
  );
}
