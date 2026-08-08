/**
 * Import the Global Governance of AI treaty articles into a committed artifact.
 *
 *   npm run gg-treaty:build            # fetch and write
 *   npm run gg-treaty:build -- --check # report drift, write nothing
 *
 * Authoring-time and network only — never in the deployed worker. 1.1's hard
 * version compares three agreements, and the other two are arXiv papers the
 * repo already holds in full. This is the third: the course reproduces the
 * text rather than sending people to a builder UI, because the task is to read
 * and compare provisions, not to assemble a draft.
 *
 * The text is not served as HTML anywhere. global-governance.ai renders it
 * from a WordPress plugin bundle, so this parses the JSON embedded in that
 * bundle: sections carry a `label`, and each paragraph carries its own `order`
 * ("1.2.2"), its `content`, and the drafters' `comment`. The commentary is
 * kept — for a comparison exercise, why a clause is worded that way is the
 * more interesting half.
 *
 * The parser fails loudly rather than writing a shorter document. A silent
 * drop to forty articles would read on the page as a treaty that simply stops,
 * which is the one wrong thing this must never say.
 *
 * `--check` is deliberately NOT in CI: red there would mean somebody edited
 * their proposal, which is news about the world rather than a broken repo.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const PAGE = "https://global-governance.ai/treaty/";
const OUT = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/content/verification/gg-treaty.json",
);

/** Below this, assume the bundle changed shape rather than the treaty shrank. */
const MIN_PARAGRAPHS = 120;
const MIN_SECTIONS = 20;

const dec = (raw) => JSON.parse(`"${raw}"`);

function parse(js) {
  const sections = [];
  // A section is a label followed by its paragraph array, in document order.
  const sectionRe =
    /"label":"((?:[^"\\]|\\.)+?)"[\s\S]{0,4000}?"paragraphs":\[([\s\S]*?)\}\]/g;
  const paraRe =
    /\{"order":"(\d+(?:\.\d+)*)","content":"((?:[^"\\]|\\.)*)","comment":(null|"(?:[^"\\]|\\.)*")/g;

  for (const m of js.matchAll(sectionRe)) {
    const paragraphs = [];
    for (const p of `${m[2]}}]`.matchAll(paraRe)) {
      paragraphs.push({
        order: p[1],
        content: dec(p[2]),
        comment: p[3] === "null" ? null : dec(p[3].slice(1, -1)),
      });
    }
    if (paragraphs.length) sections.push({ label: dec(m[1]), paragraphs });
  }

  const total = sections.reduce((n, s) => n + s.paragraphs.length, 0);
  if (sections.length < MIN_SECTIONS || total < MIN_PARAGRAPHS) {
    throw new Error(
      `parsed ${sections.length} sections / ${total} paragraphs — below the floor, so the bundle changed shape`,
    );
  }
  return sections;
}

const check = process.argv.includes("--check");

const page = await fetch(PAGE, { headers: { "user-agent": "xlab-tracks-gg-treaty" } });
if (!page.ok) throw new Error(`${PAGE} responded ${page.status}`);
const html = await page.text();

const bundle = html.match(
  /https:\/\/global-governance\.ai\/wp-content\/plugins\/treaty-builder\/build\/assets\/main\.[^"]+\.js/,
);
if (!bundle) throw new Error("treaty-builder bundle not linked from the page");

const js = await fetch(bundle[0], { headers: { "user-agent": "xlab-tracks-gg-treaty" } });
if (!js.ok) throw new Error(`${bundle[0]} responded ${js.status}`);
const sections = parse(await js.text());

const next = { source: PAGE, sections };

let current = null;
try {
  current = JSON.parse(readFileSync(OUT, "utf8"));
} catch {
  /* first run */
}

/* Compared without the retrieval date on either side: a fetch that finds the
   same text is not a change, and stamping one would make every run a diff. */
const same = JSON.stringify(current?.sections) === JSON.stringify(next.sections);
const count = sections.reduce((n, s) => n + s.paragraphs.length, 0);

if (check) {
  if (!current) {
    console.error("gg-treaty: no artifact yet — run `npm run gg-treaty:build`");
    process.exit(1);
  }
  if (same) {
    console.log(`gg-treaty is up to date (${sections.length} sections, ${count} paragraphs).`);
  } else {
    console.error("gg-treaty has drifted: the proposal has been edited upstream.");
    process.exit(1);
  }
} else {
  writeFileSync(
    OUT,
    JSON.stringify(
      { ...next, retrieved: new Date().toISOString().slice(0, 10) },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `gg-treaty: ${sections.length} sections, ${count} paragraphs → src/content/verification/gg-treaty.json${same ? " (unchanged)" : ""}`,
  );
}
