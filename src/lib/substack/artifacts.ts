import { cache } from "react";
import {
  SUBSTACK_CONVERTER_VERSION,
  type SubstackArtifact,
} from "./types";

/**
 * Runtime loader for Substack post artifacts precomputed by
 * `npm run substack:build` and committed under src/content/substack/{id}.json.
 * Posts convert at authoring time in Node — the fetch/convert toolchain never
 * ships in the deployed worker, and the app only ever reads these bundled
 * JSON modules (same dynamic-import pattern as arXiv artifacts and lesson MDX).
 */
export type SubstackLookup = SubstackArtifact | { state: "not-built" };

export const getSubstackArtifact = cache(
  async (id: string): Promise<SubstackLookup> => {
    let artifact: SubstackArtifact;
    try {
      const mod = (await import(`@/content/substack/${id}.json`)) as {
        default: SubstackArtifact;
      };
      artifact = mod.default;
    } catch {
      return { state: "not-built" };
    }
    if (
      artifact.state === "ready" &&
      artifact.post.converterVersion !== SUBSTACK_CONVERTER_VERSION
    ) {
      // Predates the current converter — nudge authors to rebuild rather
      // than render stale-format HTML.
      return { state: "not-built" };
    }
    return artifact;
  },
);
