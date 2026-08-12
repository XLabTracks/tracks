import { NextResponse } from "next/server";

import { resolveGlossaryTerm } from "@/lib/content/glossary";
import { checkDefinitionLookupRateLimit } from "@/lib/verification/definition-rate-limit";

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
 * Wikipedia. Both wikis are best-effort, and the client is built to be
 * useful when this returns nothing — a term can always be saved with the
 * learner's own note. An upstream failure is answered 502, never
 * "not found": offering to save a definition we never got would be a lie,
 * and so would claiming a wiki lacks a term we could not ask about.
 *
 * The LessWrong lookup rides the Algolia-style /api/search endpoint, NOT
 * /graphql: GraphQL sits behind bot protection that challenges datacenter
 * requests, while the search endpoint answers them keyless (the
 * goveronica.com legal-reader has run on it weekly from CI). Its tag hits
 * carry the wiki's real slug and the full description as plain text —
 * which also fixes the old exact-slug guess, since real slugs can carry
 * suffixes (Corrigibility lives at corrigibility-1).
 *
 * Nothing here is stored. A definition is quoted text belonging to its wiki
 * (both CC BY-SA), so the response carries the source URL and the client
 * always shows it — the cheatsheet is a link to a definition, not a copy.
 */

const LW_SEARCH = "https://www.lesswrong.com/api/search";
const MAX_TERM = 60;
const LOOKUP_TIMEOUT_MS = 4_000;

// The wiki slugs terms as lowercase hyphenated words. This is the same
// normalisation, so "Verification Regime" finds /tag/verification-regime.
function slugify(term: string): string {
  return term
    .toLowerCase()
    .replace(/[‘’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// The wiki body is long-form plain text with blank-line paragraph breaks.
// The cheatsheet wants the opening definition, so the first prose paragraph
// is taken and the rest dropped — with the source link carried alongside so
// the full entry is one click away. "Prose" matters: some tag bodies open
// with a stub line ("Alternative introductions" on Instrumental
// convergence), so fragments too short to define anything are skipped.
function firstParagraph(text: string): string {
  for (const block of text.split(/\n\s*\n/)) {
    const para = block.replace(/\s+/g, " ").trim();
    if (para.length >= 60) return para;
  }
  return "";
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const raw = (params.get("term") ?? "").trim().replace(/[.,;:!?]+$/, "");
  // The sentence around the highlight, sent by the client. It breaks ties on
  // disambiguation: "capstone" inside a course page should find Capstone
  // course, not a mining company. Never required, never stored.
  const context = (params.get("context") ?? "").toLowerCase().slice(0, 400);
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

  // Only upstream-backed lookups consume the allowance. Authored glossary
  // hits are local and must remain available even when a wiki is having a bad
  // day. CF-Connecting-IP is injected by the edge; unlike X-Forwarded-For it
  // is not caller-selected on the deployed route.
  const rate = checkDefinitionLookupRateLimit(
    request.headers.get("CF-Connecting-IP") ?? "unknown",
  );
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many definition lookups" },
      {
        status: 429,
        headers: {
          "Retry-After": String(rate.retryAfterSeconds),
          "X-RateLimit-Limit": String(rate.limit),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  // One budget covers the whole fallback chain. Without this, each miss could
  // wait for several independent upstream timeouts in sequence.
  const signal = AbortSignal.timeout(LOOKUP_TIMEOUT_MS);

  // Which leg did what, reported on the not-found and failure responses.
  // The chain is best-effort across two upstreams that fail differently by
  // egress (bot challenges, robot policy), so a bare 502 is undebuggable
  // from outside — this is the route's own account of what happened. The
  // client reads only found/term/definition and ignores these.
  let lwLeg = "skipped";
  let wikiLeg = "skipped";
  const reason = (e: unknown) =>
    "error: " + String(e instanceof Error ? e.message : e).slice(0, 120);

  // LessWrong first: the course's own vocabulary lives there. The search is
  // fuzzy ("verification" ranks Rationality Verification above Verification),
  // so only a hit whose name normalises to the query counts — anything looser
  // would hand a learner some nearby tag as if it defined their term.
  try {
    const res = await fetch(LW_SEARCH, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify([
        { indexName: "tags", params: { query: raw, hitsPerPage: 5 } },
      ]),
      signal,
      // The wiki changes rarely and a learner may look up the same term on
      // several pages; a day of edge cache keeps this off LessWrong's servers.
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error(String(res.status));
    const json: Array<{
      hits?: Array<{
        name?: string;
        slug?: string;
        description?: string;
        isPlaceholderPage?: boolean;
        adminOnly?: boolean;
      }>;
    }> = await res.json();
    const hit = (json[0]?.hits ?? []).find(
      (h) =>
        h.name &&
        h.slug &&
        h.description &&
        !h.isPlaceholderPage &&
        !h.adminOnly &&
        slugify(h.name) === slug,
    );
    const definition = hit ? firstParagraph(hit.description!) : "";
    if (hit && definition) {
      return NextResponse.json({
        found: true,
        term: hit.name,
        definition,
        url: `https://www.lesswrong.com/w/${hit.slug}`,
        source: "LessWrong Wiki (CC BY-SA)",
      });
    }
    lwLeg = "miss";
  } catch (e) {
    lwLeg = reason(e);
  }

  // Wikipedia second. The summary endpoint follows redirects, so case and
  // near-miss titles resolve; a disambiguation page is a menu, not a
  // definition, so only a `standard` page with an extract counts as found.
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(raw)}?redirect=true`,
      {
        // Wikimedia's robot policy wants a descriptive User-Agent with a
        // contact point, and blocks unidentified scripted clients — a
        // Workers fetch sends none by default, which reads as exactly that.
        headers: {
          Accept: "application/json",
          "User-Agent":
            "XLabTracksVerification/1.0 (https://aisafetytracks.com; course cheatsheet term lookup)",
          "Api-User-Agent":
            "XLabTracksVerification/1.0 (https://aisafetytracks.com; course cheatsheet term lookup)",
        },
        signal,
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
          definition: json.extract.trim(),
          url: json.content_urls?.desktop?.page ?? null,
          source: "Wikipedia (CC BY-SA)",
        });
      }
      wikiLeg = "miss (" + (json.type ?? "no type") + ")";
    } else {
      wikiLeg = "miss (404)";
    }

    // The exact title missed or is a disambiguation menu — ask search for
    // the best real article ("capstone" finds Capstone course) and serve
    // its summary under the same standard-page guard.
    const sres = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(raw)}&srlimit=5&format=json`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent":
            "XLabTracksVerification/1.0 (https://aisafetytracks.com; course cheatsheet term lookup)",
          "Api-User-Agent":
            "XLabTracksVerification/1.0 (https://aisafetytracks.com; course cheatsheet term lookup)",
        },
        signal,
        next: { revalidate: 86400 },
      },
    );
    if (sres.ok) {
      const sjson: {
        query?: { search?: Array<{ title?: string; snippet?: string }> };
      } = await sres.json();
      // Rank hits by word overlap with the highlight's surrounding sentence,
      // so the page's own vocabulary decides which sense wins.
      // The term's own tokens match every hit, so they never score.
      // The page's own words rarely appear in search snippets, so the site's
      // standing vocabulary votes too: this is a course platform, and between
      // a spacecraft, an investment bank and a capstone course, the course is
      // the sense a learner highlighted.
      const DOMAIN =
        "course education educational learning program curriculum lesson module student university academic " +
        "artificial intelligence governance policy international relations treaty verification compute " +
        "safety regulation frontier model agreement security alignment";
      const termWords = new Set(raw.toLowerCase().split(/[^a-z]+/));
      const keep = (w: string) => w.length > 3 && !termWords.has(w);
      // Real page words outvote the standing vocabulary two to one, so the
      // prior only ever decides when the page itself said nothing useful.
      const pageWords = new Set(context.split(/[^a-z]+/).filter(keep));
      const domainWords = new Set(
        DOMAIN.split(/[^a-z]+/).filter((w) => keep(w) && !pageWords.has(w)),
      );
      const hits = (sjson.query?.search ?? []).filter((h) => h.title);
      const score = (h: { title?: string; snippet?: string }) => {
        const text = ((h.title ?? "") + " " + (h.snippet ?? ""))
          .toLowerCase()
          .replace(/<[^>]+>/g, " ");
        let n = 0;
        for (const w of new Set(text.split(/[^a-z]+/))) {
          if (pageWords.has(w)) n += 2;
          else if (domainWords.has(w)) n += 1;
        }
        return n;
      };
      hits.sort((a, b) => score(b) - score(a));
      // The disambiguation page itself ranks high in its own search results
      // and scores well - it contains every sense's words. It already failed
      // as the exact title, so it is skipped, and the top candidates are
      // tried in score order until one is a real article.
      // A candidate nothing endorsed is a coin flip, not an answer: with no
      // overlap at all, the dictionary leg below is the honest fallback.
      const tried = hits
        .filter((h) => slugify(h.title ?? "") !== slug && score(h) >= 2)
        .slice(0, 1);
      for (const cand of tried) {
        const top = cand.title as string;
        const r2 = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(top)}?redirect=true`,
          {
            headers: {
              Accept: "application/json",
              "User-Agent":
                "XLabTracksVerification/1.0 (https://aisafetytracks.com; course cheatsheet term lookup)",
              "Api-User-Agent":
                "XLabTracksVerification/1.0 (https://aisafetytracks.com; course cheatsheet term lookup)",
            },
            signal,
            next: { revalidate: 86400 },
          },
        );
        if (r2.ok) {
          const j2: {
            type?: string;
            title?: string;
            extract?: string;
            content_urls?: { desktop?: { page?: string } };
          } = await r2.json();
          if (j2.type === "standard" && j2.extract) {
            return NextResponse.json({
              found: true,
              term: j2.title || top,
              definition: j2.extract.trim(),
              url: j2.content_urls?.desktop?.page ?? null,
              source: "Wikipedia (CC BY-SA)",
            });
          }
        }
      }
      wikiLeg += ", search miss";
    }
  } catch (e) {
    wikiLeg = reason(e);
  }

  // Wiktionary last: the dictionary for ordinary words. "Mechanism" lands
  // here — its Wikipedia page is a disambiguation menu, which the leg above
  // rightly refuses to serve — while a plain word still deserves a plain
  // definition. Entries are lowercase unless proper nouns, and proper nouns
  // were Wikipedia's to answer, so the lookup is lowercased. Definitions
  // arrive as HTML fragments; tags are stripped, and glosses too short to
  // define anything are skipped.
  let wtLeg = "skipped";
  try {
    const word = raw.toLowerCase();
    const res = await fetch(
      `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word)}?redirect=true`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent":
            "XLabTracksVerification/1.0 (https://aisafetytracks.com; course cheatsheet term lookup)",
          "Api-User-Agent":
            "XLabTracksVerification/1.0 (https://aisafetytracks.com; course cheatsheet term lookup)",
        },
        signal,
        next: { revalidate: 86400 },
      },
    );
    if (res.status !== 404) {
      if (!res.ok) throw new Error(String(res.status));
      const json: Record<
        string,
        Array<{ partOfSpeech?: string; definitions?: Array<{ definition?: string }> }>
      > = await res.json();
      for (const entry of json.en ?? []) {
        for (const d of entry.definitions ?? []) {
          const text = (d.definition ?? "")
            .replace(/<[^>]+>/g, "")
            .replace(/\s+/g, " ")
            .trim();
          if (text.length >= 20) {
            return NextResponse.json({
              found: true,
              term: word,
              definition:
                (entry.partOfSpeech ? `(${entry.partOfSpeech.toLowerCase()}) ` : "") + text,
              url: `https://en.wiktionary.org/wiki/${encodeURIComponent(word)}`,
              source: "Wiktionary (CC BY-SA)",
            });
          }
        }
      }
      wtLeg = "miss (no english gloss)";
    } else {
      wtLeg = "miss (404)";
    }
  } catch (e) {
    wtLeg = reason(e);
  }

  const legs = { lesswrong: lwLeg, wikipedia: wikiLeg, wiktionary: wtLeg };
  if (lwLeg.startsWith("error") || wikiLeg.startsWith("error")) {
    return NextResponse.json({ error: "Lookup unavailable", legs }, { status: 502 });
  }
  return NextResponse.json({ found: false, term: raw, legs }, { status: 404 });
}
