import { NextResponse } from "next/server";

import { resolveGlossaryTerm } from "@/lib/content/glossary";

/**
 * Looks a term up for the Verification cheatsheet.
 *
 * The static pages cannot call the wikis themselves — they are served from
 * the worker under a strict origin policy, and a browser fetch would be a
 * cross-origin request the page has no business making. This route is the one
 * place that talks upstream, so the client only ever sees our own origin.
 *
 * Three sources, in order: the app's own hand-authored glossary (authored,
 * offline, never challenged), then the LessWrong wiki — it speaks this
 * course's language, so it outranks the general encyclopedia — then
 * Wikipedia. Both wikis are best-effort: LessWrong's GraphQL API sits behind
 * Vercel bot protection, which challenges a datacenter request, so a lookup
 * that works from a laptop can fail from the worker. That is why the client
 * is built to be useful when this returns nothing — a term can always be
 * saved with the learner's own note. An upstream failure is answered 502,
 * never "not found": offering to save a definition we never got would be a
 * lie, and so would claiming a wiki lacks a term we could not ask about.
 *
 * Nothing here is stored. A definition is quoted text belonging to its wiki
 * (both CC BY-SA), so the response carries the source URL and the client
 * always shows it — the cheatsheet is a link to a definition, not a copy.
 */

const GRAPHQL = "https://www.lesswrong.com/graphql";
const MAX_TERM = 60;

// The wiki slugs terms as lowercase hyphenated words. This is the same
// normalisation, so "Verification Regime" finds /tag/verification-regime.
function slugify(term: string): string {
  return term
    .toLowerCase()
    .replace(/[‘’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// The wiki body is long-form. The cheatsheet wants the opening definition, so
// the first paragraph is taken and the rest dropped — with the source link
// carried alongside so the full entry is one click away.
function firstParagraph(html: string): string {
  const m = html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
  const inner = m ? m[1] : html;
  return inner
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(request: Request) {
  const raw = (new URL(request.url).searchParams.get("term") ?? "").trim();
  if (!raw || raw.length > MAX_TERM) {
    return NextResponse.json({ error: "Bad term" }, { status: 400 });
  }
  const slug = slugify(raw);
  if (!slug) return NextResponse.json({ error: "Bad term" }, { status: 400 });

  // Ours first: authored, offline, and never challenged.
  const own = resolveGlossaryTerm(raw);
  if (own) {
    return NextResponse.json({
      found: true,
      term: own.term,
      definition: own.definition,
      url: null,
      source: "XLab Tracks glossary",
    });
  }

  let upstreamTrouble = false;

  // LessWrong first: the course's own vocabulary lives there.
  try {
    const res = await fetch(GRAPHQL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        query:
          "query($slug:String!){tag(input:{selector:{slug:$slug}}){result{name description{html}}}}",
        variables: { slug },
      }),
      // The wiki changes rarely and a learner may look up the same term on
      // several pages; a day of edge cache keeps this off LessWrong's servers.
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error(String(res.status));
    const json: {
      data?: { tag?: { result?: { name?: string; description?: { html?: string } } } };
    } = await res.json();
    const tag = json?.data?.tag?.result;
    const html = tag?.description?.html;
    if (tag && html) {
      return NextResponse.json({
        found: true,
        term: tag.name || raw,
        definition: firstParagraph(html),
        url: `https://www.lesswrong.com/w/${slug}`,
        source: "LessWrong Wiki (CC BY-SA)",
      });
    }
  } catch {
    upstreamTrouble = true;
  }

  // Wikipedia second. The summary endpoint follows redirects, so case and
  // near-miss titles resolve; a disambiguation page is a menu, not a
  // definition, so only a `standard` page with an extract counts as found.
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(raw)}?redirect=true`,
      {
        headers: {
          Accept: "application/json",
          "Api-User-Agent": "XLabTracks-Verification (term lookup for the course cheatsheet)",
        },
        next: { revalidate: 86400 },
      },
    );
    if (res.status !== 404) {
      if (!res.ok) throw new Error(String(res.status));
      const json: {
        type?: string;
        title?: string;
        extract?: string;
        content_urls?: { desktop?: { page?: string } };
      } = await res.json();
      if (json.type === "standard" && json.extract) {
        return NextResponse.json({
          found: true,
          term: json.title || raw,
          definition: json.extract,
          url: json.content_urls?.desktop?.page ?? null,
          source: "Wikipedia (CC BY-SA)",
        });
      }
    }
  } catch {
    upstreamTrouble = true;
  }

  if (upstreamTrouble) {
    return NextResponse.json({ error: "Lookup unavailable" }, { status: 502 });
  }
  return NextResponse.json({ found: false, term: raw }, { status: 404 });
}
