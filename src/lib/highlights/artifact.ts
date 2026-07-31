import { resolvePaperSource } from "@/lib/papers/source-artifact";
import { buildBlockIndex, type BlockInfo } from "@/lib/papers/block-index";
import type { PaperSource } from "@/lib/content/types";

/**
 * Server-side validation context for createHighlight: the document's
 * artifact identity plus its block index, so a direct-POST payload can be
 * checked against what the document actually says (anchor exists, sentence
 * range in bounds, snippet matches). Keyed on a PaperSource, not a Paper —
 * course papers and linked readings (the /readings viewer) resolve through
 * the same artifact contract.
 */
export interface HighlightArtifactContext {
  /** Source artifact id ("2312.06942v5", "{host}__{slug}", "{site}__{postId}"). */
  artifactKey: string;
  /** The artifact's converter version (== the wrapper's data-conv). */
  convVersion: number;
  blocks: Map<string, BlockInfo>;
}

/**
 * Per-isolate memo, same idiom as the bestResponse memo in
 * src/lib/control-model/bestResponse.ts: the HAST parse of a large paper is
 * ~100ms of CPU — far too much per POST, fine once per isolate. Inputs are
 * static per artifactKey (committed JSON), so no honesty check is needed.
 * NEVER mutate the returned context.
 */
const contextCache = new Map<string, HighlightArtifactContext>();

export async function getHighlightArtifactContext(
  paperSource: PaperSource,
): Promise<HighlightArtifactContext | null> {
  const source = await resolvePaperSource(paperSource);
  if (source.state !== "ready") return null;
  const hit = contextCache.get(source.artifactKey);
  if (hit) return hit;
  const context: HighlightArtifactContext = {
    artifactKey: source.artifactKey,
    convVersion: source.convVersion,
    blocks: buildBlockIndex(source.html),
  };
  contextCache.set(source.artifactKey, context);
  return context;
}
