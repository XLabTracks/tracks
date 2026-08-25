/**
 * Cut the two Inter faces down to the characters this site actually sets.
 *
 * The shipped faces carry 2,852 codepoints each — Latin, Greek, Cyrillic and
 * about 1,970 symbols — and together they are 723KB, which was 90% of a cold
 * lesson page. The course is written in English; the repository contains no
 * Cyrillic at all, and the Greek and mathematical characters it does use are
 * Control's, not Verification's.
 *
 * The kept set is derived from the content rather than declared, so it cannot
 * drift out of date silently: every character in the repository goes in, plus
 * all of Latin, the combining diacritics, general punctuation and currency as
 * headroom for text nobody has written yet. What falls out is Cyrillic and the
 * long tail of unused symbol blocks. CJK and emoji appear in the content and
 * are NOT in the subset — they are not in the source faces either, so they
 * fall back to the system font exactly as they do today.
 *
 * The sources in this directory stay pristine and are never served; the
 * `.subset.woff2` files beside them are what layout.tsx loads. Subsetting a
 * subset would compound, so the input is always the original.
 *
 * Authoring-time only, the output is committed, and `--check` reports drift
 * without writing — which is what fails when new content needs a glyph the
 * subset does not carry.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";
import subsetFont from "subset-font";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fonts = join(root, "src/app/fonts");

const FACES = [
  { src: "InterVariable.woff2", out: "InterVariable.subset.woff2" },
  { src: "InterVariable-Italic.woff2", out: "InterVariable-Italic.subset.woff2" },
];

// Where the site's own text lives. public/verification carries the course's
// standalone JS and CSS, which set label text of their own.
const SCAN_ROOTS = ["src", "public/verification", "verification-capstones"];
const SCAN_EXT = new Set([".mdx", ".ts", ".tsx", ".js", ".mjs", ".json", ".css", ".md"]);

// Headroom, so a new sentence does not need a font rebuild: Basic Latin and
// the Latin supplements, the combining marks that compose accents, general
// punctuation (dashes, quotes, ellipsis) and the currency block.
const KEEP_RANGES = [
  [0x20, 0x24f],
  [0x2b0, 0x2ff],
  [0x300, 0x36f],
  [0x2000, 0x206f],
  [0x20a0, 0x20bf],
];

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name.startsWith(".")) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (SCAN_EXT.has(extname(name))) out.push(path);
  }
}

function usedCharacters() {
  const chars = new Set();
  for (const [from, to] of KEEP_RANGES) {
    for (let c = from; c <= to; c++) chars.add(String.fromCodePoint(c));
  }
  const files = [];
  for (const r of SCAN_ROOTS) {
    const dir = join(root, r);
    if (existsSync(dir)) walk(dir, files);
  }
  for (const file of files) {
    for (const ch of readFileSync(file, "utf8")) {
      // Control characters have no glyph; a surrogate half is not a character.
      if (ch >= " " || ch === "\t") chars.add(ch);
    }
  }
  return { text: [...chars].join(""), files: files.length, count: chars.size };
}

const check = process.argv.includes("--check");
const { text, files, count } = usedCharacters();
console.log(`scanned ${files} files -> ${count} distinct characters kept`);

let drifted = false;
for (const face of FACES) {
  const srcPath = join(fonts, face.src);
  const outPath = join(fonts, face.out);
  if (!existsSync(srcPath)) {
    console.error(`missing source face ${face.src}`);
    process.exit(1);
  }
  const source = readFileSync(srcPath);
  const subset = await subsetFont(source, text, { targetFormat: "woff2" });

  const before = source.length;
  const after = subset.length;
  const line = `${face.out}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB (${Math.round((100 * (before - after)) / before)}% smaller)`;

  if (check) {
    const current = existsSync(outPath) ? readFileSync(outPath) : null;
    if (!current || !current.equals(subset)) {
      drifted = true;
      console.error(`${face.out}: committed copy is stale — run npm run fonts:build`);
    } else {
      console.log(`${face.out}: up to date`);
    }
    continue;
  }

  writeFileSync(outPath, subset);
  console.log(line);
}

if (check && drifted) process.exit(1);
