"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import {
  isVerificationRoute,
  VerificationFooter,
  VerificationHeader,
} from "@/components/verification/site-chrome";
import { AccountStorageGuard } from "@/components/verification/account-storage-guard";

/* Which chrome a page wears. Verification's course pages take the same header
 * and footer as its static pages so the two read as one site; everything else
 * keeps the app's own.
 *
 * The decision is client-side on purpose: the header lives in the root layout,
 * which cannot see route params, and usePathname() is the same idiom the
 * sidebar already uses for active-item detection.
 *
 * Each identity brings both halves: the course's header and footer on its
 * pages, the app's on everything else. The app went without a footer for a
 * while and its pages simply stopped at the last paragraph; SiteFooter is the
 * other half, and it is the app's own rather than a copy of the course's,
 * because the course footer is styled from theme.css and sized for that
 * palette.
 */

export function AppHeader() {
  const pathname = usePathname();
  return (
    <>
      {/* On every page, before either header: learner work on this device is
          keyed to one account. The guard purges another account's — or a
          signed-out session's — work and marks the device for the current
          one; sync.js waits for it before it adopts or pushes anything. */}
      <AccountStorageGuard />
      {isVerificationRoute(pathname) ? <VerificationHeader /> : <SiteHeader />}
    </>
  );
}

export function AppFooter() {
  const pathname = usePathname();
  // Keep embed routes chrome-less for external <iframe> use — the same guard
  // SiteHeader carries. The footer needs it here because both footers are
  // chosen in this component, and an iframe with a site footer under the demo
  // is chrome leaking into somebody else's page.
  if (pathname?.endsWith("/embed")) return null;
  return isVerificationRoute(pathname) ? <VerificationFooter /> : <SiteFooter />;
}
