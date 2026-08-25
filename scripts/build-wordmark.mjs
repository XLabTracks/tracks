/**
 * Re-encode the XLab wordmark to the size the header actually draws it at.
 *
 * The supplied artwork is 3300x1050. The header draws it 24px tall at most
 * (20px in high contrast, 22px on a phone), so the browser was downscaling by
 * about 48x on every page — 84KB across the two files, for a mark that
 * occupies roughly 69x22 CSS pixels, and letterforms that moire into stripes
 * at that ratio because no mip level is anywhere near it.
 *
 * Both files ship because CSS picks the ground: theme.css shows the maroon-and
 * -black artwork on the day ground and the white-lettered one on night and high
 * contrast. Both are in the markup, so both are fetched whatever the theme —
 * `display:none` does not stop an <img> downloading.
 *
 * Output height is 4x the largest drawn size, so a 3x phone still has headroom
 * and the mark stays sharp if the header ever grows. Sources stay in the repo
 * untouched; this only writes the served copies. Authoring-time only, the
 * output is committed, and `--check` reports drift without writing.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const assets = join(root, "public/verification/assets");

// 24px is the tallest .brand-mark rule in theme.css; 4x covers a 3x phone.
const TARGET_HEIGHT = 96;

const FILES = ["xLab_Logotype.png", "xLab_Logotype_white.png"];

const check = process.argv.includes("--check");
let drifted = false;

for (const name of FILES) {
  const src = join(assets, name);
  if (!existsSync(src)) {
    console.error(`missing ${name}`);
    process.exit(1);
  }
  const input = readFileSync(src);
  const meta = await sharp(input).metadata();

  // Already at the served size: nothing to do, and re-encoding an encode is
  // how an image slowly degrades.
  if (meta.height === TARGET_HEIGHT) {
    console.log(`${name}: already ${meta.width}x${meta.height}`);
    continue;
  }

  const out = await sharp(input)
    .resize({ height: TARGET_HEIGHT, fit: "inside", kernel: "lanczos3" })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();

  const same =
    createHash("sha256").update(input).digest("hex") ===
    createHash("sha256").update(out).digest("hex");

  if (check) {
    if (!same) {
      drifted = true;
      console.error(
        `${name}: would change (${meta.width}x${meta.height}, ${(input.length / 1024).toFixed(0)}KB -> ${TARGET_HEIGHT}px, ${(out.length / 1024).toFixed(0)}KB)`
      );
    }
    continue;
  }

  writeFileSync(src, out);
  const after = await sharp(out).metadata();
  console.log(
    `${name}: ${meta.width}x${meta.height} ${(input.length / 1024).toFixed(0)}KB -> ${after.width}x${after.height} ${(out.length / 1024).toFixed(0)}KB`
  );
}

if (check && drifted) process.exit(1);
