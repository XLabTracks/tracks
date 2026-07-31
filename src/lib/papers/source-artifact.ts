import "server-only";
import { getPaperArtifact, type PaperLookup } from "@/lib/arxiv/artifacts";
import { parseArxivId, type ArxivId } from "@/lib/arxiv/id";
import type {
  ConversionWarning,
  PaperTocEntry,
  TexMeta,
} from "@/lib/arxiv/types";
import { getSubstackArtifact, type SubstackLookup } from "@/lib/substack/artifacts";
import { parseSubstackPostUrl, type SubstackRef } from "@/lib/substack/id";
import type { SubstackMeta } from "@/lib/substack/types";
import {
  getLessWrongArtifact,
  type LessWrongLookup,
} from "@/lib/lesswrong/artifacts";
import { parseLessWrongPostUrl, type LessWrongRef } from "@/lib/lesswrong/id";
import type { LessWrongMeta } from "@/lib/lesswrong/types";
import type { PaperSource } from "@/lib/content/types";

/**
 * The one parse-id → artifact-lookup → ready-gate resolution for a
 * PaperSource, shared by PaperReader, paperSourceHeader, and the highlight
 * validation context (which used to hand-write it three times). Server-only:
 * artifact lookup dynamic-imports committed JSON, and the loaders are
 * request-`cache()`d, so every caller in a request shares the same lookup.
 *
 * States, per source kind:
 * - "invalid" — the id/URL didn't parse; no artifact was looked up.
 * - the loader's non-ready states ("not-built", arXiv's "pdf-only", …) —
 *   parsed, but no renderable artifact; `sourceRef` still identifies the
 *   source (external links stay buildable).
 * - "ready" — the shared annotated-HTML contract all three converters emit.
 *   `html` is the raw artifact HTML: post-sourced callers rewrite reading
 *   links themselves (href-only, so highlight block indexes built from the
 *   raw text still match the rendered DOM).
 *
 * `convVersion` is read from the artifact (`converterVersion`), but on the
 * ready branch it ALWAYS equals the source's converter-version constant
 * (CONVERTER_VERSION / SUBSTACK_CONVERTER_VERSION /
 * LESSWRONG_CONVERTER_VERSION): the loaders return non-ready for any
 * artifact whose version differs. That equality is why PaperReader may stamp
 * it as the wrapper's data-conv and the highlight context may compare it
 * against client-posted values interchangeably.
 */
export type ResolvedPaperSource =
  | ResolvedSource<"arxiv", ArxivId, TexMeta, PaperLookup>
  | ResolvedSource<"substack", SubstackRef, SubstackMeta, SubstackLookup>
  | ResolvedSource<"lesswrong", LessWrongRef, LessWrongMeta, LessWrongLookup>;

type ResolvedSource<
  K extends PaperSource["kind"],
  Ref,
  Meta,
  Lookup extends { state: string },
> =
  | { kind: K; state: "invalid" }
  | { kind: K; state: Exclude<Lookup["state"], "ready">; sourceRef: Ref }
  | {
      kind: K;
      state: "ready";
      sourceRef: Ref;
      /** Source artifact id ("2312.06942v5", "{host}__{slug}", "{site}__{postId}"). */
      artifactKey: string;
      /** == the source's converter-version constant; see the doc above. */
      convVersion: number;
      html: string;
      toc: PaperTocEntry[];
      warnings: ConversionWarning[];
      meta: Meta;
    };

export async function resolvePaperSource(
  source: Extract<PaperSource, { kind: "arxiv" }>,
): Promise<Extract<ResolvedPaperSource, { kind: "arxiv" }>>;
export async function resolvePaperSource(
  source: Extract<PaperSource, { kind: "substack" }>,
): Promise<Extract<ResolvedPaperSource, { kind: "substack" }>>;
export async function resolvePaperSource(
  source: Extract<PaperSource, { kind: "lesswrong" }>,
): Promise<Extract<ResolvedPaperSource, { kind: "lesswrong" }>>;
export async function resolvePaperSource(
  source: PaperSource,
): Promise<ResolvedPaperSource>;
export async function resolvePaperSource(
  source: PaperSource,
): Promise<ResolvedPaperSource> {
  switch (source.kind) {
    case "arxiv": {
      const sourceRef = parseArxivId(source.arxivId);
      if (!sourceRef) return { kind: "arxiv", state: "invalid" };
      const artifact = await getPaperArtifact(sourceRef.id);
      if (artifact.state !== "ready")
        return { kind: "arxiv", state: artifact.state, sourceRef };
      return {
        kind: "arxiv",
        state: "ready",
        sourceRef,
        artifactKey: sourceRef.id,
        convVersion: artifact.paper.converterVersion,
        html: artifact.paper.html,
        toc: artifact.paper.toc,
        warnings: artifact.paper.warnings,
        meta: artifact.paper.meta,
      };
    }
    case "substack": {
      const sourceRef = parseSubstackPostUrl(source.postUrl);
      if (!sourceRef) return { kind: "substack", state: "invalid" };
      const artifact = await getSubstackArtifact(sourceRef.id);
      if (artifact.state !== "ready")
        return { kind: "substack", state: artifact.state, sourceRef };
      return {
        kind: "substack",
        state: "ready",
        sourceRef,
        artifactKey: sourceRef.id,
        convVersion: artifact.post.converterVersion,
        html: artifact.post.html,
        toc: artifact.post.toc,
        warnings: artifact.post.warnings,
        meta: artifact.post.meta,
      };
    }
    case "lesswrong": {
      const sourceRef = parseLessWrongPostUrl(source.postUrl);
      if (!sourceRef) return { kind: "lesswrong", state: "invalid" };
      const artifact = await getLessWrongArtifact(sourceRef.id);
      if (artifact.state !== "ready")
        return { kind: "lesswrong", state: artifact.state, sourceRef };
      return {
        kind: "lesswrong",
        state: "ready",
        sourceRef,
        artifactKey: sourceRef.id,
        convVersion: artifact.post.converterVersion,
        html: artifact.post.html,
        toc: artifact.post.toc,
        warnings: artifact.post.warnings,
        meta: artifact.post.meta,
      };
    }
  }
}
