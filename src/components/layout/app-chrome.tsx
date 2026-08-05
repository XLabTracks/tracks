"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import {
  isVerificationRoute,
  VerificationFooter,
  VerificationHeader,
} from "@/components/verification/site-chrome";

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
  return isVerificationRoute(pathname) ? <VerificationHeader /> : <SiteHeader />;
}

export function AppFooter() {
  const pathname = usePathname();
  return isVerificationRoute(pathname) ? <VerificationFooter /> : <SiteFooter />;
}
