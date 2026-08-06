/**
 * Cut the site icon out of the XLab logotype.
 *
 * The mark is XLab's X — the striped one at the left of
 * public/verification/assets/xLab_Logotype.png. Cropping it here rather than
 * hand-exporting means the icon can never quietly disagree with the wordmark
 * the header renders: both come from the same file.
 *
 * Writes src/app/icon.png (Next's app-icon convention) and src/app/favicon.ico.
 * Authoring-time only, and the outputs are committed — `--check` reports drift
 * without writing.
 *
 * Traps:
 *  - The X is maroon in BOTH logotype variants; only the LAB half changes for
 *    a dark ground. So one crop serves every theme, and picking the white file
 *    would gain nothing.
 *  - The crop is padded to a square and left transparent. A browser tab draws
 *    the icon on its own ground, and a white plate behind the mark is a white
 *    tile on a dark tab.
 *  - .ico here is PNG-in-ICO. Every browser since IE11 reads it; the older
 *    BMP-in-ICO encoding is what needs a real image library.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(root, "public/verification/assets/xLab_Logotype.png");
const PNG_OUT = join(root, "src/app/icon.png");
const ICO_OUT = join(root, "src/app/favicon.ico");

/** ICO sizes. 16 is the tab; 32 and 48 are bookmarks and the OS. */
const ICO_SIZES = [16, 32, 48];
/** What the app-icon link serves. Big enough for a home-screen tile. */
const PNG_SIZE = 512;

/**
 * Bounding box of the X.
 *
 * Not "the left third": the logotype is X + LAB on one canvas and the L starts
 * well inside a third of the width, so a fixed slice takes its stem too. The X
 * is the FIRST inked run of columns — so walk the column profile, and stop at
 * the first blank column after ink begins. That is the letterspace before the L.
 */
async function markBox() {
  const { data, info } = await sharp(SOURCE)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Anti-aliased edges carry a low alpha; 32 keeps them without picking up the
  // speckle a flattened export leaves across the transparent field.
  const inked = (x, y) => data[(y * info.width + x) * info.channels + 3] >= 32;
  const columnInked = (x) => {
    for (let y = 0; y < info.height; y++) if (inked(x, y)) return true;
    return false;
  };

  let start = 0;
  while (start < info.width && !columnInked(start)) start++;
  if (start === info.width) throw new Error("no opaque pixels in " + SOURCE);
  let end = start;
  while (end + 1 < info.width && columnInked(end + 1)) end++;

  let minY = info.height, maxY = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = start; x <= end; x++) {
      if (!inked(x, y)) continue;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      break;
    }
  }
  return { minX: start, minY, maxX: end, maxY };
}

/** The mark, squared and padded, as a PNG of the given size. */
async function render(size, box) {
  const w = box.maxX - box.minX + 1;
  const h = box.maxY - box.minY + 1;
  const side = Math.max(w, h);
  // 12% air on every side: the X's arms reach its corners, and an icon that
  // touches its own edges reads as clipped in a rounded tab.
  const pad = Math.round(side * 0.12);
  const canvas = side + pad * 2;
  const mark = await sharp(SOURCE)
    .extract({ left: box.minX, top: box.minY, width: w, height: h })
    .toBuffer();
  // Two pipelines, not one: sharp applies resize BEFORE composite whatever
  // order they are called in, so a single chain would shrink the canvas first
  // and then refuse the full-size mark.
  const squared = await sharp({
    create: {
      width: canvas,
      height: canvas,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: mark,
        left: pad + Math.round((side - w) / 2),
        top: pad + Math.round((side - h) / 2),
      },
    ])
    .png()
    .toBuffer();
  return sharp(squared).resize(size, size).png().toBuffer();
}

/** PNG-in-ICO container: 6-byte header, 16 bytes per entry, then the payloads. */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = [];
  for (const { size, data } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // 0 means 256
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const check = process.argv.includes("--check");
const box = await markBox();
const png = await render(PNG_SIZE, box);
const icoBuf = ico(
  await Promise.all(
    ICO_SIZES.map(async (size) => ({ size, data: await render(size, box) })),
  ),
);

const digest = (b) => createHash("sha256").update(b).digest("hex");
const stale = [];
for (const [path, next] of [
  [PNG_OUT, png],
  [ICO_OUT, icoBuf],
]) {
  if (check) {
    if (!existsSync(path) || digest(readFileSync(path)) !== digest(next)) stale.push(path);
  } else {
    writeFileSync(path, next);
    console.log("wrote", path, next.length, "bytes");
  }
}

if (check) {
  if (stale.length) {
    console.error("stale, re-run `npm run icon:build`:\n  " + stale.join("\n  "));
    process.exit(1);
  }
  console.log("icons match the logotype");
}
