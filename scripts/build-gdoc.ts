/**
 * Convert a shared Google Doc into a lesson MDX body, so a reading whose
 * author keeps editing it can be re-synced instead of hand-retyped:
 *
 *   src/content/lessons/{out}.mdx    generated lesson body
 *
 * Runs locally in Node at authoring time; nothing here ships in the deployed
 * worker, and the committed MDX is the pin. The doc is fetched unauthenticated
 * through the `export?format=md` endpoint, so a doc must be link-shared for
 * this to work at all — a doc that is not returns Google's sign-in HTML, which
 * the fetch rejects rather than committing.
 *
 * Usage:
 *   npm run gdoc:build                     # re-sync every doc in DOCS
 *   npm run gdoc:build -- --id <docId>     # one doc
 *   npm run gdoc:build -- --check          # exit 1 if a committed body is stale
 *
 * `--check` is deliberately NOT wired into CI: the input is somebody else's
 * live document, so a red build would mean "the author edited their doc",
 * which is not a broken repository. Run it when you want to know.
 *
 * Output is deterministic — the same doc bytes produce the same MDX, with no
 * timestamps — so a `--check` diff means the source actually changed.
 * `title` is a drift tripwire, not decoration: the doc's own first line must
 * still match it, or the fetch aborts rather than silently reproducing a
 * document that has become something else.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

type GDoc = {
  /** Google Docs file id. */
  docId: string;
  /** Path under src/content/lessons, without the .mdx — the Lesson.contentRef. */
  out: string;
  /** The doc's own first line. Mismatch aborts the build. */
  title: string;
  /** Who wrote it, and their own page. */
  author: string;
  authorHref?: string;
  /** Where the original lives — the doc itself unless it is published twice. */
  sourceHref?: string;
  /** How much of it is here, and under what permission. */
  state?: string;
  note?: string;
  /**
   * The course's own framing paragraph, printed above the doc's heading.
   * Course copy, never doc content — it survives every re-sync because it
   * lives here, not in the generated file.
   */
  intro?: string;
  /**
   * Passages the outline says to highlight, wrapped in `**…**` on the way
   * out. Each must match the transformed body exactly; a snippet the doc has
   * moved from under aborts the build (a drift tripwire, like `title`) rather
   * than silently dropping the author's emphasis.
   */
  highlights?: string[];
};

const DOCS: GDoc[] = [
  {
    docId: "1SY3ypZBeCmbCfj7trDz3ZtxzSfjsQEzY5qX6JZ71GVE",
    out: "verification/research-tips",
    title: "Aaron’s Research Tips, or How I Wish I Did Research",
    author: "Aaron Scher",
    authorHref: "https://intelligence.org/team/aaron-scher/",
    note:
      "The author keeps adding to the document. This page re-syncs from it, " +
      "so follow the link if you want to be certain you are reading today’s " +
      "version.",
    // Outline-43 (2026-08-18): 4.1.1's intro, and the passage the outline
    // says to highlight ("bold it or smt").
    intro:
      "How do you translate feasibility judgments into identifying, " +
      "executing, and communicating an impactful research project? Below, " +
      "you will learn some important strategies for AI governance research " +
      "from MIRI senior researcher Aaron Scher.",
    highlights: [
      "*Importance* is tough to assess but should broadly be based on a " +
        "reasonable aggregation of worldviews, weighted toward the ones you " +
        "yourself believe. An important question might be one that could " +
        "substantially change AI governance plans depending on how it " +
        "resolves. It might answer a question that future people are likely " +
        "to ask and for which having an accurate answer seems really useful " +
        "for those future people to make good choices.",
    ],
  },
];

const LESSONS_DIR = join(process.cwd(), "src", "content", "lessons");

function docUrl(docId: string): string {
  return `https://docs.google.com/document/d/${docId}/edit`;
}

function exportUrl(docId: string): string {
  return `https://docs.google.com/document/d/${docId}/export?format=md`;
}

async function fetchDoc(docId: string): Promise<string> {
  const res = await fetch(exportUrl(docId));
  if (!res.ok) {
    throw new Error(`${docId}: export returned HTTP ${res.status}`);
  }
  const type = res.headers.get("content-type") ?? "";
  if (!type.includes("markdown")) {
    throw new Error(
      `${docId}: export returned ${type || "an unknown type"} — the doc is ` +
        `probably not link-shared (Google serves its sign-in page as HTML)`,
    );
  }
  return await res.text();
}

/**
 * Google's markdown export opens with the doc's own title block — title,
 * byline, date — terminated by the first blank line. The lesson replaces that
 * with its own heading and attribution, so the block is dropped here and its
 * first line is the tripwire.
 */
function stripTitleBlock(markdown: string, doc: GDoc): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const first = (lines[0] ?? "").trim();
  if (first !== doc.title) {
    throw new Error(
      `${doc.docId}: first line is ${JSON.stringify(first)}, expected ` +
        `${JSON.stringify(doc.title)} — the doc was retitled or restructured. ` +
        `Read it, then update DOCS in this script.`,
    );
  }
  const blank = lines.findIndex((line, i) => i > 0 && line.trim() === "");
  return lines.slice(blank + 1).join("\n");
}

/**
 * Docs writes two trailing spaces on most lines (its hard-break artifact) and
 * sometimes leaves a trailing %20 inside a link destination, which resolves to
 * a 404. Headings shift one level: the doc's `#` are the lesson's `##`, which
 * is also what gives the lesson its "In this lesson" nav.
 *
 * The trailing spaces are stripped, which loses a real line break wherever the
 * doc stacked lines inside one paragraph (its link block does) — those become
 * an explicit `\`. List items keep neither: consecutive `*` lines are already
 * separate items, so a break there would only push whitespace into the `<li>`.
 */
function toLessonBody(markdown: string): string {
  const lines = markdown.split("\n");
  return lines
    .map((line, i) => {
      const trimmed = line.replace(/[ \t]+$/, "");
      const wrapped =
        /[ \t]{2,}$/.test(line) &&
        (lines[i + 1] ?? "").trim() !== "" &&
        !/^\s*(?:[*-]\s|#)/.test(trimmed);
      return wrapped ? `${trimmed}\\` : trimmed;
    })
    .join("\n")
    .replace(/^(#{1,5}) /gm, "#$1 ")
    .replace(/\]\((https:\/\/[^()\s]+?)(?:%20|\s)+\)/g, "]($1)")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * The credit block, as a `<SourceCredit/>` call rather than a sentence.
 *
 * Trap: every value crosses into JSX here, so a quotation mark or a brace in
 * a note would break the compile. JSON.stringify is what makes the string a
 * literal the MDX parser accepts, curly quotes and all.
 */
function credit(doc: GDoc): string {
  const props: [string, string | undefined][] = [
    ["author", doc.author],
    ["authorHref", doc.authorHref],
    ["sourceHref", doc.sourceHref ?? docUrl(doc.docId)],
    ["state", doc.state],
    ["note", doc.note],
  ];
  return [
    "<SourceCredit",
    ...props
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `  ${key}={${JSON.stringify(value)}}`),
    "/>",
  ].join("\n");
}

/** The `highlights` pass: bold each configured passage, or refuse to build. */
function applyHighlights(body: string, doc: GDoc): string {
  let out = body;
  for (const snippet of doc.highlights ?? []) {
    if (!out.includes(snippet)) {
      throw new Error(
        `${doc.docId}: highlight passage not found — the doc was edited out ` +
          `from under it. Read the doc, then update DOCS in this script. ` +
          `Looking for: ${JSON.stringify(snippet.slice(0, 70) + "…")}`,
      );
    }
    out = out.replace(snippet, `**${snippet}**`);
  }
  return out;
}

function render(doc: GDoc, markdown: string): string {
  const body = applyHighlights(toLessonBody(stripTitleBlock(markdown, doc)), doc);
  return [
    `{/* Generated by \`npm run gdoc:build\` from Google Doc ${doc.docId}. */}`,
    `{/* Edit the doc, not this file — a re-sync overwrites it. */}`,
    "",
    ...(doc.intro ? [doc.intro, ""] : []),
    `## ${doc.title}`,
    "",
    credit(doc),
    "",
    body,
    "",
  ].join("\n");
}

async function main() {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const idFlag = args.indexOf("--id");
  const only = idFlag === -1 ? null : args[idFlag + 1];

  const docs = only ? DOCS.filter((d) => d.docId === only) : DOCS;
  if (docs.length === 0) {
    console.error(only ? `! no doc registered for ${only}` : "! DOCS is empty");
    process.exit(1);
  }

  let stale = 0;
  for (const doc of docs) {
    const path = join(LESSONS_DIR, `${doc.out}.mdx`);
    const next = render(doc, await fetchDoc(doc.docId));
    let current: string | null = null;
    try {
      current = readFileSync(path, "utf8");
    } catch {
      current = null;
    }

    if (current === next) {
      console.log(`= ${doc.out} up to date`);
      continue;
    }
    if (check) {
      stale += 1;
      console.error(`! ${doc.out} is stale — run \`npm run gdoc:build\``);
      continue;
    }
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, next);
    console.log(`${current === null ? "+" : "~"} ${doc.out}`);
  }

  if (stale > 0) process.exit(1);
}

main().catch((error: unknown) => {
  console.error(`! ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
