import { buildAbsUrl } from "@/lib/arxiv/id";
import { buildPostUrl } from "@/lib/substack/id";
import {
  buildPostUrl as buildLwPostUrl,
  displayHost,
} from "@/lib/lesswrong/id";
import { resolvePaperSource } from "@/lib/papers/source-artifact";
import type { Paper } from "@/lib/content/types";

/**
 * Per-source header bits shared by the course paper page and the standalone
 * /readings viewer: authors from the artifact meta, the external link, and
 * whether the artifact has footnotes (drives the sidenote toggle). Artifact
 * lookups are request-cached, so the page and PaperReader share them.
 */
export async function paperSourceHeader(source: Paper["source"]): Promise<{
  authors: string | null;
  link: { label: string; href: string } | null;
  hasFootnotes: boolean;
}> {
  const resolved = await resolvePaperSource(source);
  if (resolved.state === "invalid") {
    return { authors: null, link: null, hasFootnotes: false };
  }
  const ready = resolved.state === "ready" ? resolved : null;
  const link = (() => {
    switch (resolved.kind) {
      case "arxiv":
        return {
          label: `arXiv:${resolved.sourceRef.id}`,
          href: buildAbsUrl(resolved.sourceRef),
        };
      case "substack":
        return {
          label: resolved.sourceRef.host,
          href:
            (resolved.state === "ready" && resolved.meta.canonicalUrl) ||
            buildPostUrl(resolved.sourceRef),
        };
      case "lesswrong":
        return {
          label: displayHost(resolved.sourceRef),
          href:
            (resolved.state === "ready" && resolved.meta.canonicalUrl) ||
            buildLwPostUrl(resolved.sourceRef),
        };
    }
  })();
  return {
    authors: ready ? formatAuthors(ready.meta.authors) : null,
    link,
    hasFootnotes: ready?.toc.some((entry) => entry.kind === "footnotes") ?? false,
  };
}

function formatAuthors(authors: string[] | undefined): string | null {
  if (!authors || authors.length === 0) return null;
  if (authors.length > 6) return `${authors.slice(0, 6).join(", ")}, et al.`;
  return authors.join(", ");
}
