import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { isVerificationFacilitator } from "@/lib/verification/facilitator";
import { FacilitatorGuide } from "@/components/verification/facilitator-guide";

/* The gate runs here as well as in the page, for the reason the applications
   queue documents: a static `metadata` export flushes the head and commits a
   200 before the component can throw, so the decision has to be made before
   anything is sent. getCurrentUser is cache()-wrapped per request, so asking
   twice costs one query. */
export async function generateMetadata(): Promise<Metadata> {
  const user = await getCurrentUser();
  if (!(await isVerificationFacilitator(user?.id))) notFound();
  return { title: "Facilitator field guide — Verification" };
}

/**
 * The facilitator's field guide: seven craft modules and five session plans.
 *
 * 404, not 403, for everyone else — same reasoning as the reviewer queue. A
 * participant who is told "forbidden" has been told the plans exist and where
 * to find them, and these are the plans their own sessions are built on.
 *
 * The page is the first surface this material has had: it was ported into
 * src/lib/verification/data/facilitator-guide.ts and then had no consumer, so
 * every word of it was shipping and unreachable.
 */
export default async function FacilitatorPage() {
  const user = await getCurrentUser();
  if (!(await isVerificationFacilitator(user?.id))) notFound();

  return (
    <>
      <link rel="stylesheet" href="/verification/platform.css" precedence="high" />
      <link rel="stylesheet" href="/verification/page.css" precedence="high" />
      <link rel="stylesheet" href="/verification/facilitator.css" precedence="high" />
      <main id="main">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/classrooms">Classrooms</Link> / Facilitator guide
          </nav>
          <FacilitatorGuide />
        </div>
      </main>
    </>
  );
}
