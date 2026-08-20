#!/usr/bin/env node
/*
 * build-verification-chrome.mjs
 *   src/lib/verification/chrome.ts  →  public/verification/data/chrome.js
 *
 * The header and footer links are authored once, in TypeScript, because the
 * Next app imports them directly. The static site under public/verification/
 * has no build step and cannot import TS, so it reads a generated plain-JS
 * copy instead. This writes that copy.
 *
 *   npm run verification:chrome            # write the data file
 *   npm run verification:chrome -- --check # fail if it has drifted (CI)
 *
 * Zero dependencies, and it does NOT run tsc: the source is a flat list of
 * string literals, so it is read with a narrow parser. That is deliberate —
 * the generator must work from a bare checkout. If chrome.ts ever grows real
 * logic, this stops being adequate and should be replaced by a tsx script.
 *
 * Output is deterministic so --check diffs byte for byte.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src", "lib", "verification", "chrome.ts");
const OUT = path.join(ROOT, "public", "verification", "data", "chrome.js");

const src = fs.readFileSync(SRC, "utf8");

/* Pull one `export const NAME: ChromeLink[] = [ ... ];` array out of the
   source and turn its entries into objects. The shape is fixed — label plus
   href, href either a quoted string or null — so anything else is a change
   this parser was not written for, and it says so rather than guessing. */
function readList(name) {
  const m = new RegExp(
    `export const ${name}: ChromeLink\\[\\] = \\[([\\s\\S]*?)\\n\\];`,
  ).exec(src);
  if (!m) fail(`could not find "export const ${name}: ChromeLink[] = [...]"`);
  const out = [];
  const entry = /\{\s*label:\s*"([^"]+)",\s*href:\s*(null|"[^"]*")\s*\},?/g;
  let e;
  while ((e = entry.exec(m[1]))) {
    out.push({ label: e[1], href: e[2] === "null" ? null : e[2].slice(1, -1) });
  }
  const braces = (m[1].match(/\{/g) || []).length;
  if (out.length !== braces) {
    fail(
      `${name}: parsed ${out.length} of ${braces} entries — an entry is not the ` +
        `plain { label: "...", href: null | "..." } shape this generator reads`,
    );
  }
  if (!out.length) fail(`${name} is empty`);
  return out;
}

function readString(name) {
  const m = new RegExp(`export const ${name} = "([^"]*)";`).exec(src);
  if (!m) fail(`could not find "export const ${name} = ..."`);
  return m[1];
}

function fail(msg) {
  console.error(`\nbuild-verification-chrome failed:\n  x ${msg}`);
  console.error(`\nSource: ${path.relative(ROOT, SRC)}`);
  process.exit(1);
}

const data = {
  nav: readList("NAV"),
  foot: readList("FOOT"),
  copyright: readString("COPYRIGHT"),
};

const out =
  `/* GENERATED FILE — do not edit by hand.\n` +
  `   Source: src/lib/verification/chrome.ts\n` +
  `   Regenerate: npm run verification:chrome\n\n` +
  `   The Next app imports the source directly; this is the copy the no-build\n` +
  `   static site reads. A null href is a destination nobody has supplied yet\n` +
  `   and renders as plain text, never as a dead link. */\n` +
  `window.VT_CHROME = ${JSON.stringify(data, null, 2)};\n`;

if (process.argv.includes("--check")) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (current !== out) {
    console.error(
      "\npublic/verification/data/chrome.js is stale — run: npm run verification:chrome",
    );
    process.exit(1);
  }
  console.log(
    `verification chrome is up to date (${data.nav.length} nav, ${data.foot.length} footer).`,
  );
  process.exit(0);
}

fs.writeFileSync(OUT, out);
console.log(
  `build-verification-chrome: ${data.nav.length} nav + ${data.foot.length} footer → ${path.relative(ROOT, OUT)}`,
);
