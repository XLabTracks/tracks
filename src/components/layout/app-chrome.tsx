"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
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
 * Trap: the app has no footer of its own. AppFooter renders nothing outside
 * Verification rather than introducing one — adding a site-wide footer is a
 * design decision, not a side effect of this split.
 */

export function AppHeader() {
  const pathname = usePathname();
  return isVerificationRoute(pathname) ? <VerificationHeader /> : <SiteHeader />;
}

export function AppFooter() {
  const pathname = usePathname();
  return isVerificationRoute(pathname) ? <VerificationFooter /> : null;
}
