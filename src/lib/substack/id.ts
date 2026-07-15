/**
 * Substack post reference parsing and URL construction.
 *
 * A post is referenced by its public URL, `https://{host}/p/{slug}` — the
 * form Substack itself canonicalizes to on both *.substack.com and custom
 * domains. The strict host/slug shapes double as the SSRF guard: validated
 * refs are interpolated into the JSON-API URL, cache keys, and asset routes,
 * so nothing looser may pass (no ports, no IP literals, no path tricks).
 *
 * The artifact id is `{host}__{slug}`. Hostnames and Substack slugs may both
 * contain hyphens and dots but never underscores, so "__" is an unambiguous,
 * filesystem- and route-safe separator.
 */

const HOST_RE = /^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/;
const IPV4_RE = /^\d+(?:\.\d+){3}$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface SubstackRef {
  /** Artifact id, "{host}__{slug}" — keys src/content/substack/ and public/substack/. */
  id: string;
  /** Publication host, e.g. "blog.redwoodresearch.org" or "example.substack.com". */
  host: string;
  /** Post slug, e.g. "ai-futurism-reading-list". */
  slug: string;
}

/** Parse a public post URL ("https://{host}/p/{slug}"). Null for anything else. */
export function parseSubstackPostUrl(raw: unknown): SubstackRef | null {
  if (typeof raw !== "string") return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.port !== "" || url.username !== "") {
    return null;
  }
  const host = url.hostname.toLowerCase();
  if (!HOST_RE.test(host) || IPV4_RE.test(host)) return null;
  const m = /^\/p\/([^/]+)\/?$/.exec(url.pathname);
  if (!m) return null;
  const slug = m[1];
  if (!SLUG_RE.test(slug)) return null;
  return { id: `${host}__${slug}`, host, slug };
}

/** Parse an artifact id ("{host}__{slug}") back into a ref. */
export function parseSubstackId(raw: unknown): SubstackRef | null {
  if (typeof raw !== "string") return null;
  const parts = raw.split("__");
  if (parts.length !== 2) return null;
  const [host, slug] = parts;
  if (!HOST_RE.test(host) || IPV4_RE.test(host) || !SLUG_RE.test(slug)) {
    return null;
  }
  return { id: raw, host, slug };
}

/** The public reader URL. */
export function buildPostUrl(ref: SubstackRef): string {
  return `https://${ref.host}/p/${ref.slug}`;
}

/** Substack's public post JSON endpoint (title, bylines, body_html, …). */
export function buildApiUrl(ref: SubstackRef): string {
  return `https://${ref.host}/api/v1/posts/${ref.slug}`;
}

/**
 * Site-relative URL of a committed image asset. `npm run substack:build`
 * writes the bytes to public/substack/{id}/assets/{path}, so these are plain
 * static files — no runtime asset route.
 */
export function buildAssetUrl(ref: SubstackRef, assetPath: string): string {
  const encoded = assetPath.split("/").map(encodeURIComponent).join("/");
  return `/substack/${ref.id}/assets/${encoded}`;
}
