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
    <details className="works-cited border-border group mt-10 max-w-[64ch] rounded-lg border">
      {/* The disclosure sign is ours, not the UA's: `list-none` plus the
          WebKit marker rule drops the ▶ that sat in front of the label, and
          the sign goes at the end of the row instead.

          It is `Fold`'s marker, deliberately — one + that rotates 45° into a
          × on open, same size, weight and timing. This is the house's
          disclosure sign and it should be learned once; a + that becomes a −
          is a second thing to learn for the same gesture. Decorative, because
          summary already announces expanded/collapsed and a spoken "plus"
          would only be a worse second copy of that.

          Fold needs `justify-between!` because the high contrast theme sets
          justify-content:center on `button` at a specificity no utility
          beats. That rule's selector list is buttons and chips — no
          `summary` — so this row does not, and does not want the important
          flag it would have to carry forever. */}
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[15px] font-bold select-none [&::-webkit-details-marker]:hidden">
        <span>
          Works cited{" "}
          <span className="text-muted-foreground font-normal">
            ({rows.length})
          </span>
        </span>
        <span
          aria-hidden
          className="text-muted-foreground text-2xl leading-none font-light transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
        >
          +
        </span>
      </summary>
      <div className="px-4 pb-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          Every source this lesson quotes, cites, or links out to, gathered in
          one place and set in MLA form. The line under each entry says what
          the work is and what it is about.
        </p>
        <ul className="mt-4 space-y-4">
          {rows.map(({ url, entry }) => (
            <li key={url} className="text-sm leading-relaxed">
              <p className="works-cited-entry">
                {entry.authors ?? entry.org ? (
                  // An author string ending "et al." already carries the
                  // period MLA wants — don't double it.
                  <>{(entry.authors ?? entry.org)!.replace(/\.$/, "")}. </>
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
              <p className="text-muted-foreground mt-0.5 text-sm">
                {entry.about}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
