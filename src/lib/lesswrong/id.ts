/**
 * LessWrong / Alignment Forum post reference parsing and URL construction.
 *
 * A post is referenced by its public URL — `https://{host}/posts/{postId}/
 * {slug}` (the slug is display-only; sequence-reader URLs `/s/{seq}/p/
 * {postId}` work too). Both sites run the same ForumMagnum instance over
 * the same post ids; the host is kept so links and the GraphQL endpoint
 * stay on the site the author chose. The fixed host set plus the strict
 * post-id shape double as the SSRF guard: validated refs are interpolated
 * into the API URL, cache keys, and asset routes.
 *
 * The artifact id is `{site}__{postId}` ("lesswrong__kcKrE9mzEHrdqtDpE"),
 * matching the Substack pipeline's "__" separator convention.
 */

const SITES = {
  lesswrong: {
    hosts: ["www.lesswrong.com", "lesswrong.com"],
    canonicalHost: "www.lesswrong.com",
  },
  alignmentforum: {
    hosts: ["www.alignmentforum.org", "alignmentforum.org"],
    canonicalHost: "www.alignmentforum.org",
  },
} as const;

export type LessWrongSite = keyof typeof SITES;

/** ForumMagnum document ids: short base-62 strings. */
const POST_ID_RE = /^[A-Za-z0-9]{10,24}$/;

export interface LessWrongRef {
  /** Artifact id, "{site}__{postId}" — keys src/content/lesswrong/ and public/lesswrong/. */
  id: string;
  site: LessWrongSite;
  /** ForumMagnum post _id, e.g. "kcKrE9mzEHrdqtDpE". */
  postId: string;
}

function siteOf(host: string): LessWrongSite | null {
  for (const [site, config] of Object.entries(SITES)) {
    if ((config.hosts as readonly string[]).includes(host)) {
      return site as LessWrongSite;
    }
  }
  return null;
}

/** Parse a public post URL. Null for anything else. */
export function parseLessWrongPostUrl(raw: unknown): LessWrongRef | null {
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
  const site = siteOf(url.hostname.toLowerCase());
  if (!site) return null;
  const m =
    /^\/posts\/([^/]+)(?:\/[^/]*)?\/?$/.exec(url.pathname) ??
    /^\/s\/[^/]+\/p\/([^/]+)\/?$/.exec(url.pathname);
  if (!m) return null;
  const postId = m[1];
  if (!POST_ID_RE.test(postId)) return null;
  return { id: `${site}__${postId}`, site, postId };
}

/** Parse an artifact id ("{site}__{postId}") back into a ref. */
export function parseLessWrongId(raw: unknown): LessWrongRef | null {
  if (typeof raw !== "string") return null;
  const parts = raw.split("__");
  if (parts.length !== 2) return null;
  const [site, postId] = parts;
  // Own-property check — `in` would accept Object.prototype keys as sites.
  if (!Object.prototype.hasOwnProperty.call(SITES, site)) return null;
  if (!POST_ID_RE.test(postId)) return null;
  return { id: raw, site: site as LessWrongSite, postId };
}

/** The public reader URL (slug-less form; the site redirects to the slug). */
export function buildPostUrl(ref: LessWrongRef): string {
  return `https://${SITES[ref.site].canonicalHost}/posts/${ref.postId}`;
}

/** The site's public GraphQL endpoint. */
export function buildGraphqlUrl(ref: LessWrongRef): string {
  return `https://${SITES[ref.site].canonicalHost}/graphql`;
}

/** The canonical host, for display ("www.lesswrong.com"). */
export function displayHost(ref: LessWrongRef): string {
  return SITES[ref.site].canonicalHost;
}

/**
 * Site-relative URL of a committed image asset. `npm run lesswrong:build`
 * writes the bytes to public/lesswrong/{id}/assets/{path}, so these are
 * plain static files — no runtime asset route.
 */
export function buildAssetUrl(ref: LessWrongRef, assetPath: string): string {
  const encoded = assetPath.split("/").map(encodeURIComponent).join("/");
  return `/lesswrong/${ref.id}/assets/${encoded}`;
}
