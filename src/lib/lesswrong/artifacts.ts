import { cache } from "react";
import {
  LESSWRONG_CONVERTER_VERSION,
  type LessWrongArtifact,
} from "./types";

/**
 * Runtime loader for LessWrong post artifacts precomputed by
 * `npm run lesswrong:build` and committed under
 * src/content/lesswrong/{id}.json. Posts convert at authoring time in
 * Node — the fetch/convert toolchain never ships in the deployed worker,
 * and the app only ever reads these bundled JSON modules (same
 * dynamic-import pattern as the arXiv and Substack artifacts).
 */
export type LessWrongLookup = LessWrongArtifact | { state: "not-built" };

export const getLessWrongArtifact = cache(
  async (id: string): Promise<LessWrongLookup> => {
    let artifact: LessWrongArtifact;
    try {
      const mod = (await import(`@/content/lesswrong/${id}.json`)) as {
        default: LessWrongArtifact;
      };
      artifact = mod.default;
    } catch {
      return { state: "not-built" };
    }
    if (
      artifact.state === "ready" &&
      artifact.post.converterVersion !== LESSWRONG_CONVERTER_VERSION
    ) {
      // Predates the current converter — nudge authors to rebuild rather
      // than render stale-format HTML.
      return { state: "not-built" };
    }
    return artifact;
  },
);
