import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * A lesson is static content, so reading one must never depend on the database
 * being up: the track pages guard every progress read (getCurrentUserOrSignedOut
 * plus a .catch() per read) so a failed query costs the checkmarks, not the
 * page. The components rendered *inside* the body have to hold the same line —
 * they were the hole that put signed-in readers on the error boundary while
 * signed-out ones read the same lesson fine, and the raw getCurrentUser() is
 * how it happened (its cache()d rejection rethrows at every later call site).
 *
 * Source-text checks, in the widgets.test.ts idiom: the property is "this file
 * does not reach for the throwing accessor", which no unit test of the
 * component's output can see.
 */
const RENDER_PATH = [
  "components/mdx/exercise.tsx",
  "components/mdx/exercise-sequence.tsx",
  "components/verification/verification-exercise.tsx",
  "components/verification/capstone-signup.tsx",
];

describe("reading path fails open", () => {
  it("no lesson-body component calls the throwing getCurrentUser", () => {
    const offenders = RENDER_PATH.filter((file) =>
      /getCurrentUser\b(?!OrSignedOut)/.test(
        readFileSync(join(__dirname, "..", file), "utf8"),
      ),
    );
    expect(offenders).toEqual([]);
  });
});
