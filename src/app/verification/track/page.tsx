import { permanentRedirect } from "next/navigation";

/* The course structure lives once, at /tracks/verification.
 *
 * This page used to render a second copy of it from data/course.js — the same
 * five modules and their units, drawn from a generated file, beside the app's
 * own track page that draws them from the graph itself. Two renderings of one
 * list is the duplication this course has been paying down; the app's is the
 * one that carries progress, the sidebar and the reading, so it is the one
 * that stays.
 *
 * Kept as a redirect rather than deleted: the URL is in the header, in the
 * facilitator page, in the static site's own fallbacks and in whatever anybody
 * has bookmarked. Permanent, because it is not coming back. */
export default function Page() {
  permanentRedirect("/tracks/verification");
}
