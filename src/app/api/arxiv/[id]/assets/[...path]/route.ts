import { parseArxivId, sanitizeAssetPath } from "@/lib/arxiv/id";
import { getAsset } from "@/lib/arxiv/store";

/**
 * Serves figure files extracted from a cached e-print. Read-only against the
 * Blobs cache — it never contacts arXiv, so there is no abuse surface and no
 * auth (the content is public arXiv material; the proxy matcher excludes
 * /api/arxiv/ from session refresh). URLs embed the pinned paper version, so
 * responses are genuinely immutable.
 */

const CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  pdf: "application/pdf",
};

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string; path: string[] }> },
) {
  const { id: rawId, path: segments } = await context.params;
  const id = parseArxivId(rawId);
  if (!id) return new Response("Not found", { status: 404 });

  const assetPath = sanitizeAssetPath(
    segments.map((s) => decodeURIComponent(s)).join("/"),
  );
  if (!assetPath) return new Response("Not found", { status: 404 });

  const extension = assetPath.slice(assetPath.lastIndexOf(".") + 1).toLowerCase();
  const contentType = CONTENT_TYPES[extension];
  if (!contentType) return new Response("Not found", { status: 404 });

  const bytes = await getAsset(id, assetPath);
  if (!bytes) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
      // arXiv is open-submission, so these bytes are attacker-controllable.
      // `sandbox` neuters scripts/plugins if the asset is ever loaded as a
      // top-level document (the SVG-as-XHTML stored-XSS vector) — inline
      // <img>/<embed> rendering inside a lesson is unaffected because the
      // page's own CSP governs subresources, not the asset's.
      "Content-Security-Policy": "sandbox; default-src 'none'; style-src 'unsafe-inline'; img-src 'self' data:",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Netlify-CDN-Cache-Control": "public, durable, max-age=31536000, immutable",
    },
  });
}
