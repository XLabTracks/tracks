/**
 * Render the site icon from XLab's standalone mark.
 *
 * public/xlab-mark.svg is the exact solid X supplied for this purpose. Do not
 * cut the striped X out of the wordmark: at favicon size its pale cuts read as
 * the black-and-white Vercel triangle rather than as XLab's mark.
 *
 * Writes src/app/icon.png using Next's app-icon convention. It is the sole
 * favicon source: publishing a second /favicon.ico gives browsers two answers,
 * and their unusually persistent favicon cache can keep showing whichever one
 * won first. Authoring-time only, and the output is committed — `--check`
 * reports drift without writing.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(root, "public/xlab-mark.svg");
const PNG_OUT = join(root, "src/app/icon.png");
/** What the app-icon link serves. Big enough for a home-screen tile. */
const PNG_SIZE = 512;

const check = process.argv.includes("--check");
const png = await sharp(SOURCE).resize(PNG_SIZE, PNG_SIZE).png().toBuffer();

const digest = (b) => createHash("sha256").update(b).digest("hex");
const stale = [];
for (const [path, next] of [[PNG_OUT, png]]) {
  if (check) {
    if (!existsSync(path) || digest(readFileSync(path)) !== digest(next))
      stale.push(path);
  } else {
    writeFileSync(path, next);
    console.log("wrote", path, next.length, "bytes");
  }
}

if (check) {
  if (stale.length) {
    console.error(
      "stale, re-run `npm run icon:build`:\n  " + stale.join("\n  ")
    );
    process.exit(1);
  }
  console.log("icon matches the standalone XLab mark");
}
