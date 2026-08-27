import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getContentLocation,
  getTrackOutline,
  getTrackProgressContentIds,
  itemIdOf,
} from "@/lib/content";
import { getCurrentUserOrSignedOut } from "@/lib/auth";
import { getLastViewedContentId, getTrackCompletionSet } from "@/lib/progress";
import { ControlTrackLanding } from "./control-landing";
import { GenericTrackOverview } from "./generic-overview";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trackSlug: string }>;
}): Promise<Metadata> {
  const { trackSlug } = await params;
  const outline = getTrackOutline(trackSlug);
  return {
    title: outline?.track.title ?? "Track",
    description: outline?.track.description,
  };
}

export default async function TrackOverviewPage({
  params,
}: {
  params: Promise<{ trackSlug: string }>;
}) {
  const { trackSlug } = await params;
  const outline = getTrackOutline(trackSlug);
  if (!outline) notFound();
  const { track, modules } = outline;

  const user = await getCurrentUserOrSignedOut();
  // getTrackCompletionSet is a request-cache hit from the track layout; only
  // last-viewed adds a query. Progress counts are derived in memory. cache()
  // memoizes a rejection past the layout's try/catch, so a failed read
  // rejects here too — degrade like the layout does: fail open, rendering
  // the overview without progress rather than crashing.
  const [completedSet, lastViewedId] = user
    ? await Promise.all([
        getTrackCompletionSet(user.id, track.id).catch(() => new Set<string>()),
        getLastViewedContentId(user.id, track.id).catch(() => null),
      ])
    : [new Set<string>(), null];
  const trackContentIds = getTrackProgressContentIds(track.id);
  const completedCount = trackContentIds.filter((id) =>
    completedSet.has(id),
  ).length;
  const progress = user
    ? {
        completed: completedCount,
        total: trackContentIds.length,
        percent: trackContentIds.length
          ? Math.round((completedCount / trackContentIds.length) * 100)
          : 0,
      }
    : null;
  const firstItem = modules[0]?.items[0];
  // An inserted-lesson id resolves to its containing paper's page.
  const continueId = lastViewedId ?? (firstItem ? itemIdOf(firstItem) : null);
  const continueHref = continueId
    ? (getContentLocation(continueId)?.href ?? null)
    : null;

  if (track.id === "control") {
    return (
      <ControlTrackLanding
        track={track}
        modules={modules}
        signedIn={Boolean(user)}
        progress={progress}
        continueHref={continueHref}
      />
    );
  }
  return (
    <GenericTrackOverview
      track={track}
      modules={modules}
      signedIn={Boolean(user)}
      progress={progress}
      continueHref={continueHref}
      completedSet={completedSet}
    />
  );
}
