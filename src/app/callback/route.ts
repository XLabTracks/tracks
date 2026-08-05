import { handleAuth } from "@workos-inc/authkit-nextjs";

// WorkOS redirects here after Google sign-in; AuthKit exchanges the code,
// seals the session cookie, and redirects back into the app.
//
// No pinned baseURL: handleAuth falls back to the request origin, which on
// Workers is the host the user is actually on — the production domain or a
// Workers Builds branch preview (<branch>-tracks.<subdomain>.workers.dev).
// (The old pin to NEXT_PUBLIC_WORKOS_REDIRECT_URI was a Netlify workaround —
// functions there saw the deploy-permalink host in request.url — and on
// Workers it bounced every preview sign-in to production.)
export const GET = handleAuth();
