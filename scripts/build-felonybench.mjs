/**
 * Import the FelonyBench incident table into a committed artifact.
 *
 *   npm run felonybench:build            # fetch and write
 *   npm run felonybench:build -- --check # report drift, write nothing
 *
 * Authoring-time only, and network — never run in the deployed worker. The
 * lesson renders `src/content/felonybench.json`, so a build failure or a site
 * redesign leaves the last good copy on the page rather than an empty table.
 *
 * felonybench.com serves the table as ordinary server-rendered HTML, so this
 * parses the markup rather than an API: there isn't one. That makes the
 * parser the fragile part, and it fails loudly instead of writing a shorter
 * table — a silent drop to three rows would read on the page as "the
 * incidents stopped", which is the one wrong thing this must never say.
 *
 * `--check` is deliberately NOT in CI, for the same reason gdoc:build is not:
 * red there would only mean somebody logged a new incident, which is news
 * about the world, not a broken repository. The weekly workflow opens a pull
 * request instead, so a table the course reproduces is never updated without
 * a human reading the diff.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE = "https://www.felonybench.com/";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "../src/content/felonybench.json");

/** The columns the lesson prints, in order. A change here is a change to the
 *  source's own shape, so the parser refuses rather than guessing. */
const COLUMNS = ["Company", "Felonies", "Description", "Date", "Source"];

const strip = (html) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    // The site marks every outbound link with an arrow glyph; it is
    // decoration on a link we keep as an href, so it never reaches the page.
    .replace(/↗/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Source cells carry one or more links. Keep both the label and where it
 *  goes — the hand-typed table lost the hrefs, and a citation you cannot
 *  follow is the thing this course keeps telling learners not to accept. */
function links(cellHtml) {
  const out = [];
  for (const m of cellHtml.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gis)) {
    const label = strip(m[2]);
    if (label) out.push({ label, href: m[1] });
  }
  return out;
}

function parse(html) {
  const table = html.match(/<table[\s\S]*?<\/table>/i);
  if (!table) throw new Error("no <table> on the page — the site was redesigned");

  const rows = [...table[0].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((m) =>
    [...m[1].matchAll(/<t([hd])[^>]*>([\s\S]*?)<\/t\1>/gi)].map((c) => c[2]),
  );
  if (rows.length < 2) throw new Error("table has no data rows");

  const head = rows[0].map(strip);
  if (head.join("|") !== COLUMNS.join("|")) {
    throw new Error(`columns changed: expected ${COLUMNS.join(", ")}; found ${head.join(", ")}`);
  }

  const incidents = [];
  for (const cells of rows.slice(1)) {
    if (cells.length !== COLUMNS.length) {
      throw new Error(`row with ${cells.length} cells, expected ${COLUMNS.length}`);
    }
    const [company, felonies, description, date, source] = cells;
    const n = Number(strip(felonies));
    if (!Number.isInteger(n)) throw new Error(`felony count is not a number: ${strip(felonies)}`);
    incidents.push({
      company: strip(company),
      felonies: n,
      description: strip(description),
      date: strip(date),
      sources: links(source),
      // A source with no link still has to print, so keep the plain label too.
      sourceText: strip(source),
    });
  }
  return incidents;
}

const check = process.argv.includes("--check");

const res = await fetch(SOURCE, { headers: { "user-agent": "xlab-tracks-felonybench-import" } });
if (!res.ok) throw new Error(`${SOURCE} responded ${res.status}`);
const incidents = parse(await res.text());

/* Ordering is the source's, not ours: it lists newest first and the lesson
   reads that way. Sorting here would silently disagree with the site the
   prose sends people to. */
const next = { source: SOURCE, incidents };

let current = null;
try {
  current = JSON.parse(readFileSync(OUT, "utf8"));
} catch {
  /* first run */
}

/* Compared without the retrieval date on either side: a fetch that finds the
   same table is not a change, and stamping one would make every run a diff. */
const same = JSON.stringify(current?.incidents) === JSON.stringify(next.incidents);

if (check) {
  if (!current) {
    console.error("felonybench: no artifact yet — run `npm run felonybench:build`");
    process.exit(1);
  }
  if (same) {
    console.log(`felonybench is up to date (${next.incidents.length} incidents).`);
  } else {
    console.error(
      `felonybench has drifted: the site now lists ${next.incidents.length} incidents, the artifact ${current.incidents.length}.`,
    );
    process.exit(1);
  }
} else {
  writeFileSync(
    OUT,
    JSON.stringify({ ...next, retrieved: new Date().toISOString().slice(0, 10) }, null, 2) + "\n",
  );
  console.log(
    `felonybench: ${next.incidents.length} incidents → src/content/felonybench.json${same ? " (unchanged)" : ""}`,
  );
}
