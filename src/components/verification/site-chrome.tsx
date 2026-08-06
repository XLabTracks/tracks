"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { AccountMenu } from "@/components/layout/account-menu";
import { SignInLink } from "@/components/layout/sign-in-link";
import {
  COPYRIGHT,
  FOOT,
  isExternal,
  NAV,
  verificationHref,
} from "@/lib/verification/chrome";

/* The Verification site's header and footer, rendered inside the Next app so
 * the course pages under /tracks/verification wear the same chrome as the
 * static pages under /verification.
 *
 * Nothing here is a second design system. The markup is exactly what
 * public/verification/theme.css already styles — .site-header > .bar with
 * .brand, .nav and .header-right, and .site-footer > .wrap — and that
 * stylesheet is linked below rather than copied into the bundle, so one file
 * dresses both surfaces. The links come from src/lib/verification/chrome.ts,
 * which the static side reads through a generated copy.
 *
 * Trap: theme.css defines --background, --foreground, --border, --primary and
 * the rest, which are the very names Tailwind's --color-* tokens resolve to.
 * Linking it re-points the whole palette for this subtree — that is the point,
 * it is what "aligned with the landing" means — but it also means every
 * shadcn component on these routes takes Verification's colours. Check a page
 * with cards and buttons on it after touching either palette.
 *
 * Trap: the stylesheet links carry `precedence`, which is what lets React
 * hoist them into <head> and keep them after the app's bundled CSS. Drop it
 * and they render in place, arriving after first paint.
 *
 * base.css is deliberately absent: it carries the element reset the static
 * pages need and the app already has Tailwind's preflight. app-bridge.css is
 * the opposite — app-only, and it exists because Tailwind Typography hardcodes
 * its prose colours instead of reading the palette.
 */

/** True on the routes this chrome owns: the course pages, and the app routes
 *  that serve the course's own site (enrolling, the reviewers' queue) from
 *  under /verification/ alongside its static pages. */
export function isVerificationRoute(pathname: string | null): boolean {
  return !!pathname && (
    pathname === "/tracks/verification" ||
    pathname.startsWith("/tracks/verification/") ||
    pathname.startsWith("/verification/")
  );
}

function ThemeSwitch() {
  // theme.js owns the switch — its markup, its storage key, its three themes.
  // Mounting it here rather than reimplementing keeps one copy of that logic;
  // it is idempotent, so re-running it after a client-side navigation is fine.
  useEffect(() => {
    const w = window as unknown as { VT_THEME?: { mount: () => void } };
    w.VT_THEME?.mount();
  });
  return <div className="theme-switch" />;
}

export function VerificationHeader() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // Everything this header brings outlives it across client-side
  // navigations: the scripts' tools (notebook button, capture, Define) are
  // mounted on <body>, and React never removes a precedence stylesheet —
  // left alone, theme.css and app-bridge.css keep repainting the app's own
  // pages (maroon buttons, display-face headings) after walking out of the
  // course. So leaving stands everything down: `vt-off-course` on <html> is
  // the scope signal the scripts and notebook.css check, close() releases
  // the panel's scroll lock, and the stylesheets are disabled — not removed,
  // React still owns the nodes and re-entry re-enables them. notebook.css
  // alone stays on: it carries the .vt-off-course rules that hide the tools
  // the scripts left mounted. Absent class + enabled links is the default,
  // so pages without this header (the static lift) never know any of this
  // exists.
  useEffect(() => {
    const links = () =>
      document.querySelectorAll<HTMLLinkElement>(
        'link[rel="stylesheet"][href^="/verification/"]',
      );
    document.documentElement.classList.remove("vt-off-course");
    links().forEach((l) => {
      l.disabled = false;
    });
    return () => {
      document.documentElement.classList.add("vt-off-course");
      const w = window as unknown as { VTNotebook?: { close: () => void } };
      w.VTNotebook?.close();
      links().forEach((l) => {
        if (!l.href.endsWith("/notebook.css")) l.disabled = true;
      });
    };
  }, []);

  return (
    <>
      <link rel="stylesheet" href="/verification/fonts.css" precedence="high" />
      <link rel="stylesheet" href="/verification/theme.css" precedence="high" />
      <link rel="stylesheet" href="/verification/app-bridge.css" precedence="high" />
      <link rel="stylesheet" href="/verification/notebook.css" precedence="high" />
      <Script src="/verification/theme.js" strategy="afterInteractive" />
      {/* The notebook, the vocabulary lookup and the account sync are the same
          three files the static pages load, in the same order: vocab.js calls
          VTNotebook, and sync.js reads the store notebook.js owns. Reading
          happens on both surfaces, so the tools have to exist on both.

          They are plain scripts rather than React components on purpose —
          one implementation, and the static site can still be lifted out
          whole. */}
      <Script src="/verification/highlight.js" strategy="afterInteractive" />
      <Script src="/verification/notebook.js" strategy="afterInteractive" />
      <Script src="/verification/vocab.js" strategy="afterInteractive" />
      <Script src="/verification/sync.js" strategy="afterInteractive" />
      <header className="site-header">
        <div className="bar">
          <a className="brand" href="/verification/landing">
            Verification <i>@</i>
            {/* Two cuts, one per ground; theme.css picks by data-theme. The
                night one is aria-hidden so the mark is announced once. Keep
                the class names in step with theme.css's .mark-day/.mark-night. */}
            <img
              className="brand-mark mark-day"
              src="/verification/assets/xLab_Logotype.png"
              alt="XLab"
              width={3300}
              height={1050}
              draggable={false}
            />
            <img
              className="brand-mark mark-night"
              src="/verification/assets/xLab_Logotype_white.png"
              alt=""
              aria-hidden
              width={3300}
              height={1050}
              draggable={false}
            />
          </a>
          <nav className="nav" aria-label="Course">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href ? verificationHref(n.href) : undefined}
                aria-current={
                  n.href && pathname === verificationHref(n.href) ? "page" : undefined
                }
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="header-right">
            <ThemeSwitch />
            {/* Signed in, this is the app's own account menu — the same
                avatar, email, classrooms and Sign out as everywhere else. A
                learner who signs in must not lose the way out of the session
                by walking into a track. Signed out, Verification dresses the
                button itself: `.btn small` is theme.css's, so it follows all
                three themes.

                The static pages under public/verification/ cannot have the
                menu; sync.js swaps a single button there by probing the state
                route. `loading` renders neither: a "Sign in" that flips a
                moment later is worse than a control that arrives late. */}
            <AccountMenu />
            {loading || user ? null : (
              <SignInLink className="btn small">Sign in</SignInLink>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export function VerificationFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <nav className="foot-links" aria-label="Site">
          {FOOT.map((f) =>
            f.href ? (
              <a
                key={f.label}
                href={verificationHref(f.href)}
                {...(isExternal(f.href)
                  ? { target: "_blank", rel: "noopener" }
                  : {})}
              >
                {f.label}
              </a>
            ) : (
              // No destination supplied yet. Plain text, not a dead link.
              <span key={f.label} className="pending" title="Link not supplied yet">
                {f.label}
              </span>
            ),
          )}
        </nav>
        <div className="foot-end">
          <span>{COPYRIGHT}</span>
        </div>
      </div>
    </footer>
  );
}
