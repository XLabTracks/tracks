import { redirect } from "next/navigation";
import {
  verificationLessons,
  verificationModules,
  verificationUnitOfLesson,
} from "@/content/verification/curriculum";

/**
 * `?u=<unit>` → the app page that unit's reading lives on.
 *
 * This was the static module player and rendered its own copy of every unit's
 * prose. The reading lives once now, at /tracks/verification, so the page is
 * a redirect — kept because `?m=&u=` links are in the wild.
 *
 * It resolves against the content graph directly rather than the generated
 * course.js: this is the app, the graph is right here, and a redirect that
 * reads the source cannot be stale.
 */
export const metadata = { robots: { index: false } };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ u?: string }>;
}) {
  const { u } = await searchParams;
  if (!u) redirect("/tracks/verification");

  // The first lesson of the unit is where its reading starts.
  for (const mod of verificationModules) {
    for (const lessonId of mod.itemIds) {
      if (verificationUnitOfLesson[lessonId] !== u) continue;
      const lesson = verificationLessons.find((l) => l.id === lessonId);
      if (lesson) redirect(`/tracks/verification/${mod.slug}/${lesson.slug}`);
    }
  }
  redirect("/tracks/verification");
}
