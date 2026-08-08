import type { Metadata } from "next";
import { MemoDeskHost } from "@/components/verification/memo-desk-host";

/* Memo desk — one of the course's own pages.
 *
 * It was a hand-written .html file under public/verification/ until the two
 * halves were folded together: a page served outside the app has no session,
 * so it could only ask an API whether somebody was signed in and never show
 * them their own account.
 *
 * The desk itself is memo-desk.js's, markup included — MemoDeskHost loads that
 * file's dependencies in order and calls VTMemoDesk.mount(). This page holds
 * only the heading above it. It used to hold a second, hand-copied edition of
 * the desk's markup with nothing mounting it, which is the same page with the
 * desk switched off. */

export const metadata: Metadata = { title: "Memo desk" };

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/verification/platform.css" precedence="high" />
      <link rel="stylesheet" href="/verification/page.css" precedence="high" />
      <link rel="stylesheet" href="/verification/memo-desk.css" precedence="high" />
      <link rel="stylesheet" href="/verification/exercise.css" precedence="high" />
      <main id="main">
        <div className="wrap">
          <div className="desk-head">
            <h1>Memo desk</h1>
            <p>
              Every written output the track asks for, in one place. Where the
              assignment has a brief, it is quoted below in full; where it does not
              have one yet, this page says so rather than inventing one.
            </p>
          </div>

          {/* Where the drafts go is said inside the desk, under the tools, by
              the template that builds it — one copy of that sentence, on every
              surface the desk appears. */}
          <MemoDeskHost />
        </div>
      </main>
    </>
  );
}
