import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { DIFF_GLYPH, STATUS_GLYPH, STATUS_WORD } from "./bank";

const PLATFORM = path.join(process.cwd(), "public/verification/platform.js");

function literalFrom(source: string, key: string): Record<string, string> {
  const match = new RegExp(`${key}:\\s*\\{([^}]*)\\}`).exec(source);
  if (!match) throw new Error(`VT.bank.${key} not found in platform.js`);
  const out: Record<string, string> = {};
  for (const pair of match[1].split(",")) {
    const kv = /^\s*([A-Za-z]+)\s*:\s*'([^']*)'\s*$/.exec(pair);
    if (kv) out[kv[1]] = kv[2];
  }
  return out;
}

describe("capstone bank vocabulary", () => {
  const source = readFileSync(PLATFORM, "utf8");

  it.each([
    ["statusGlyph", STATUS_GLYPH],
    ["statusWord", STATUS_WORD],
    ["diffGlyph", DIFF_GLYPH],
  ] as const)("%s matches the static catalogue's VT.bank", (key, ours) => {
    expect(literalFrom(source, key)).toEqual(ours);
  });
});
