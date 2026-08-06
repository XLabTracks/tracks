import citations from "@/content/citations.json";

/**
 * The Works cited appendix: everything a lesson links or quotes, one list,
 * MLA form, inside a collapsed disclosure at the end of the page.
 *
 * The list assembles itself — rehype-lesson-citations collects the body's
 * external links at compile time and this component looks each one up in
 * src/content/citations.json. The registry is the hand-authored half: the
 * MLA fields and the line under each entry saying what the work is and what
 * it is about are written by a person, never scraped. citations.test.ts
 * fails when a lesson cites a URL the registry does not carry, so a new
 * citation is a registry entry, not a silent gap in the appendix.
 *
 * Course-tool and shared-document links (the registry's `excluded` list) are
 * not works and stay out. Ordering is MLA's: alphabetical by whatever leads
 * the entry — author, else organization, else title.
 */

type Entry = {
  /** "Last, First, and First Last" as MLA wants it; absent for org-authored. */
  authors?: string;
  /** Organization standing in the author slot when no person is named. */
  org?: string;
  title: string;
  /** Italicized per MLA. For a standalone work the title itself italicizes. */
  container?: string;
  standalone?: boolean;
  publisher?: string;
  date?: string;
  /** The hand-written line: what this is and what it is about. */
  about: string;
};

const ENTRIES = citations.entries as Record<string, Entry>;

function sortKey(e: Entry): string {
  return (e.authors ?? e.org ?? e.title).toLowerCase().replace(/^["'“]/, "");
}

function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function WorksCited({ urls }: { urls: string[] }) {
  const rows = urls
    .filter((u) => ENTRIES[u])
    .map((u) => ({ url: u, entry: ENTRIES[u] }));
  if (rows.length === 0) return null;
  rows.sort((a, b) => sortKey(a.entry).localeCompare(sortKey(b.entry)));

  return (
    <details className="works-cited border-border mt-10 rounded-lg border">
      <summary className="cursor-pointer px-4 py-3 text-[15px] font-bold select-none">
        Works cited{" "}
        <span className="text-muted-foreground font-normal">({rows.length})</span>
      </summary>
      <div className="px-4 pb-4">
        <p className="text-muted-foreground text-[13px] leading-relaxed">
          Every source this lesson quotes, cites, or links out to, gathered in
          one place and set in MLA form. The line under each entry says what
          the work is and what it is about.
        </p>
        <ul className="mt-4 space-y-4">
          {rows.map(({ url, entry }) => (
            <li key={url} className="text-[13.5px] leading-relaxed">
              <p className="works-cited-entry">
                {entry.authors ?? entry.org ? (
                  <>{entry.authors ?? entry.org}. </>
                ) : null}
                {entry.standalone ? (
                  <i>{entry.title}. </i>
                ) : (
                  <>&ldquo;{entry.title}.&rdquo; </>
                )}
                {entry.container ? <i>{entry.container}, </i> : null}
                {entry.publisher ? <>{entry.publisher}, </> : null}
                {entry.date ? <>{entry.date}, </> : null}
                <a
                  href={url}
                  target="_blank"
                  rel="noopener"
                  className="break-all underline underline-offset-4"
                >
                  {displayUrl(url)}
                </a>
                .
              </p>
              <p className="text-muted-foreground mt-0.5 text-[12.5px]">
                {entry.about}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
