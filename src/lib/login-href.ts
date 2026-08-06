/* The /login URL that returns to `next` after the WorkOS round trip.
 *
 * One encoder for every sign-in link and redirect, paired with safeNext in
 * src/app/login/route.ts: only a same-origin absolute path survives the
 * trip, so hand this a path, never a full URL. */
export function loginHref(next: string): string {
  return `/login?next=${encodeURIComponent(next)}`;
}
