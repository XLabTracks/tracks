"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { AccountMenu } from "@/components/layout/account-menu";
import { SignInLink } from "@/components/layout/sign-in-link";
import { SelectionActions } from "@/components/verification/selection-actions";
import { restoreTextScale } from "@/lib/reading/text-scale";
import {
  COPYRIGHT,
  FOOT,
  isExternal,
  NAV,
  verificationHref,
} from "@/lib/verification/chrome";

export function isVerificationRoute(pathname: string | null): boolean {
  return (
    !!pathname &&
    (pathname === "/tracks/verification" ||
      pathname.startsWith("/tracks/verification/") ||
      pathname.startsWith("/verification/"))
  );
}

function ThemeSwitch() {
  useEffect(() => {
    const w = window as unknown as { VT_THEME?: { mount: () => void } };
    w.VT_THEME?.mount();
  }, []);
  return <div className="theme-switch" />;
}

function VerificationRouteSignal({ pathname }: { pathname: string | null }) {
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("vt-route-change", { detail: { pathname } })
    );
  }, [pathname]);
  return null;
}

function NotebookLauncherHost() {
  useEffect(() => {
    const w = window as unknown as { VTNotebook?: { mount?: () => void } };
    w.VTNotebook?.mount?.();
  }, []);
  return <span id="verification-notebook-launcher" />;
}

export function VerificationHeader() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    const links = () =>
      document.querySelectorAll<HTMLLinkElement>(
        'link[rel="stylesheet"][href^="/verification/"]'
      );
    document.documentElement.classList.remove("vt-off-course");
    restoreTextScale();
    links().forEach((l) => {
      l.disabled = false;
    });
    return () => {
      const root = document.documentElement;
      root.classList.add("vt-off-course");
      root.removeAttribute("data-theme");
      root.removeAttribute("data-text-scale");
      root.classList.remove("reader-enlarged");
      root.classList.remove("reader-large");
      let theme: "light" | "dark" | "contrast" | null = null;
      try {
        const stored = localStorage.getItem("tracks-theme");
        if (stored === "light" || stored === "dark" || stored === "contrast") {
          theme = stored;
        }
      } catch {
      }
      theme ??= window.matchMedia?.("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.toggle("dark", theme !== "light");
      root.classList.toggle("contrast", theme === "contrast");
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
      <link
        rel="stylesheet"
        href="/verification/app-bridge.css"
        precedence="high"
      />
      <link
        rel="stylesheet"
        href="/verification/notebook.css"
        precedence="high"
      />
      <Script src="/verification/theme.js" strategy="afterInteractive" />
      <Script src="/verification/highlight.js" strategy="lazyOnload" />
      <Script src="/verification/memo-store.js" strategy="lazyOnload" />
      <Script src="/verification/notebook.js" strategy="afterInteractive" />
      <Script src="/verification/vocab.js" strategy="lazyOnload" />
      <Script src="/verification/sync.js" strategy="lazyOnload" />
      <SelectionActions />
      <VerificationRouteSignal pathname={pathname} />
      <header className="site-header">
        <div className="bar">
          <a className="brand" href="/verification/landing">
            Verification <i>@</i>
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
                  n.href && pathname === verificationHref(n.href)
                    ? "page"
                    : undefined
                }
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="header-right">
            <ThemeSwitch />
            <NotebookLauncherHost />
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
              <span
                key={f.label}
                className="pending"
                title="Link not supplied yet"
              >
                {f.label}
              </span>
            )
          )}
        </nav>
        <div className="foot-end">
          <span>{COPYRIGHT}</span>
        </div>
      </div>
    </footer>
  );
}
