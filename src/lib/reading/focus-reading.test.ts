import { describe, it, expect } from "vitest";
import {
  focusPrefixLength,
  type FocusSettings,
} from "./focus-reading";

const light: FocusSettings = { mode: "light", skipShort: false };
const standard: FocusSettings = { mode: "standard", skipShort: false };
const skipping: FocusSettings = { mode: "standard", skipShort: true };

/* The rules decide what a reader's eye is told to trust. Every exclusion here
   is a case where a bold prefix would either lie about the token or destroy
   information that has to be read exactly. */
describe("focusPrefixLength", () => {
  it("bolds about a third on light and about a half on standard", () => {
    expect(focusPrefixLength("Mitigating", light)).toBe(4); // ceil(10/3)
    expect(focusPrefixLength("Mitigating", standard)).toBe(5);
    expect(focusPrefixLength("extinction", light)).toBe(4);
    expect(focusPrefixLength("extinction", standard)).toBe(5);
  });

  it("always leaves at least one letter plain", () => {
    for (const word of ["of", "an", "to", "the", "war"]) {
      const cut = focusPrefixLength(word, standard);
      expect(cut, word).toBeLessThan(word.length);
    }
  });

  it("does nothing at all when the mode is off", () => {
    expect(focusPrefixLength("Mitigating", { mode: "off", skipShort: false })).toBe(0);
  });

  it("leaves numbers and anything carrying a digit alone", () => {
    for (const token of ["2026", "10^26", "4.2", "GPT-4", "1,000"]) {
      expect(focusPrefixLength(token, standard), token).toBe(0);
    }
  });

  it("leaves abbreviations alone — they have no word shape to complete", () => {
    for (const token of ["IAEA", "FLOP", "HUMINT", "NPT", "US", "AI"]) {
      expect(focusPrefixLength(token, standard), token).toBe(0);
    }
    // A capitalised word is not an abbreviation.
    expect(focusPrefixLength("Mitigating", standard)).toBeGreaterThan(0);
    expect(focusPrefixLength("McKinsey", standard)).toBeGreaterThan(0);
  });

  it("leaves URLs, paths and code-shaped tokens alone", () => {
    for (const token of [
      "https://aistatement.com/",
      "aistatement.com",
      "src/lib/db.ts",
      "getTrackById()",
      "arXiv:2606.19262",
      "§4.2",
    ]) {
      expect(focusPrefixLength(token, standard), token).toBe(0);
    }
  });

  it("keeps words that carry an apostrophe or a hyphen", () => {
    expect(focusPrefixLength("societal-scale", standard)).toBeGreaterThan(0);
    expect(focusPrefixLength("don’t", standard)).toBeGreaterThan(0);
  });

  it("skips the short joining words when asked, and only then", () => {
    for (const word of ["the", "of", "and", "to", "war"]) {
      expect(focusPrefixLength(word, skipping), word).toBe(0);
      expect(focusPrefixLength(word, standard), word).toBeGreaterThan(0);
    }
    // Four letters is past the bound either way.
    expect(focusPrefixLength("risk", skipping)).toBeGreaterThan(0);
  });

  it("never bolds a single letter word or a bare mark", () => {
    for (const token of ["a", "I", "—", "·", ""]) {
      expect(focusPrefixLength(token, standard), JSON.stringify(token)).toBe(0);
    }
  });

  it("never claims more letters than the word has", () => {
    const words = "Mitigating the risk of extinction from AI should be a global priority".split(" ");
    for (const w of words) {
      for (const s of [light, standard, skipping]) {
        expect(focusPrefixLength(w, s)).toBeLessThanOrEqual(Math.max(0, w.length - 1));
      }
    }
  });
});
