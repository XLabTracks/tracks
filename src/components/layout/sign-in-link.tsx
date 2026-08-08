"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { loginHref } from "@/lib/login-href";

/* The header's Sign in: carries the page it sits on as ?next=, so the round
 * trip through WorkOS lands the learner back where they were, not on the app
 * home. A plain <a>, not <Link> — /login is a route handler that 302s to
 * WorkOS, so the navigation is a full page load either way and there is
 * nothing to prefetch.
 *
 * Trap: useSearchParams suspends during prerender, and the headers render on
 * static pages — the Suspense boundary is what keeps them statically
 * renderable. The fallback still knows the pathname, so the instant before
 * hydration links back to the right page, at worst without its query.
 */

type Props = { className?: string; children: React.ReactNode };

function PathLink({ className, children }: Props) {
  const pathname = usePathname() ?? "/";
  return (
    <a className={className} href={loginHref(pathname)}>
      {children}
    </a>
  );
}

function FullLink({ className, children }: Props) {
  const pathname = usePathname() ?? "/";
  const search = useSearchParams().toString();
  return (
    <a
      className={className}
      href={loginHref(pathname + (search ? `?${search}` : ""))}
    >
      {children}
    </a>
  );
}

export function SignInLink(props: Props) {
  return (
    <Suspense fallback={<PathLink {...props} />}>
      <FullLink {...props} />
    </Suspense>
  );
}
