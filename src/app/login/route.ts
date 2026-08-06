import { NextResponse } from "next/server";
import { getSignInUrl } from "@workos-inc/authkit-nextjs";

// Sends the user to WorkOS AuthKit (Google) and back through /callback.
//
// `?next=` names where to land afterwards, so signing in from a Verification
// page returns to that page instead of dropping the visitor on the app home.
// AuthKit carries it through the round trip as returnTo (this version's
// name for it — older releases called the option returnPathname).
//
// Trap: this value comes from the URL, so it is an open-redirect vector.
// Only a same-origin absolute path is honoured — it must start with a single
// "/" and not "//" or "/\", either of which a browser reads as a host.
function safeNext(raw: string | null): string | undefined {
  if (!raw || !raw.startsWith("/")) return undefined;
  if (raw.startsWith("//") || raw.startsWith("/\\")) return undefined;
  return raw;
}

export async function GET(request: Request) {
  const next = safeNext(new URL(request.url).searchParams.get("next"));
  return NextResponse.redirect(
    await getSignInUrl(next ? { returnTo: next } : undefined),
  );
}
