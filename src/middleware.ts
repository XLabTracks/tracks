import { authkitMiddleware } from "@workos-inc/authkit-nextjs";
import type { NextFetchEvent, NextRequest } from "next/server";

// Deliberately the deprecated `middleware` convention, NOT Next 16's proxy.ts:
// proxy.ts compiles to Node middleware, which @opennextjs/cloudflare rejects at
// build time (opennextjs-cloudflare#1277). middleware.ts compiles as Edge
// middleware, which the adapter supports; AuthKit only refreshes the session
// cookie here (WebCrypto/fetch — edge-safe), and per-page/action sign-in
// enforcement uses `ensureSignedIn`.
//
// The OAuth redirect URI is derived from the request origin instead of the
// build-time NEXT_PUBLIC_WORKOS_REDIRECT_URI so Workers Builds branch previews
// (<branch>-tracks.<subdomain>.workers.dev) sign in on their own host — authkit
// propagates the value to getSignInUrl() via the x-redirect-uri request header.
// Safe to trust the host: Cloudflare only routes the worker's own hostnames
// here, and WorkOS rejects any redirect URI not on its allowlist (production
// domain + the wildcard preview entry) before redirecting.
export default function middleware(request: NextRequest, event: NextFetchEvent) {
  return authkitMiddleware({
    redirectUri: `${request.nextUrl.origin}/callback`,
  })(request, event);
}

export const config = {
  matcher: [
    // Skip static assets, the public chrome-less demo embed routes, the
    // committed arXiv figure files under /arxiv/, and the R2-served lesson
    // videos under /videos/ — session refresh there wastes invocations and
    // poisons CDN cacheability.
    "/((?!_next/static|_next/image|favicon.ico|arxiv/|videos/|.*/embed$|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
