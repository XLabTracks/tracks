import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import type { Paper } from "@/lib/content/types";
import {
  getLinkedReading,
  linkedReadingSource,
  type LinkedReading,
} from "@/lib/readings/registry";
import { coursePaperHrefForArtifact } from "@/lib/readings/resolve";
import { getCurrentUser } from "@/lib/auth";
import {
  createHighlight,
  deleteHighlight,
  updateHighlightNote,
} from "@/app/actions/highlights";
import { getHighlightsForItem } from "@/lib/highlights/queries";
import { type HighlightRow } from "@/lib/highlights/types";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { MarginNotesToggle } from "@/components/papers/margin-notes-toggle";
import { PaperHighlights } from "@/components/papers/paper-highlights";
import { PaperReader } from "@/components/papers/paper-reader";
import { paperSourceHeader } from "@/components/papers/paper-source-header";
import { SidenotesToggle } from "@/components/papers/sidenotes-toggle";

/**
 * Standalone internal viewer for a linked reading — a post that a course
 * paper links to, pre-converted at authoring time (`npm run readings:build`).
 * Deliberately outside the track structure: no module, no progress, no
 * activities, and `internalSublinks={false}` so links inside it stay
 * external — internal-viewer support goes exactly one layer deep. Signed-in
 * readers do get highlights & notes: the shell id below is the contentId
 * their rows key on, and the create action resolves it back through the
 * linked-readings registry (same pinned-artifact validation as papers).
 */

/**
 * Registry ids are percent-decoded from the URL segment, but the segment
 * isn't guaranteed valid percent-encoding (`/readings/lesswrong%9_x`) — a
 * throwing decodeURIComponent would surface the route error boundary where
 * a malformed id is just a 404.
 */
function decodeReadingId(readingId: string): string {
  try {
    return decodeURIComponent(readingId);
  } catch {
    notFound();
  }
}

/** A Paper-shaped shell for PaperReader; not a content-graph item. */
function paperShell(reading: LinkedReading): Paper {
  return {
    id: `reading-${reading.id}`,
    slug: reading.id,
    moduleId: "",
    title: reading.title,
    source: linkedReadingSource(reading),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ readingId: string }>;
}): Promise<Metadata> {
  const { readingId } = await params;
  const reading = getLinkedReading(decodeReadingId(readingId));
  return { title: reading?.title ?? "Reading" };
}

export default async function ReadingPage({
  params,
}: {
  params: Promise<{ readingId: string }>;
}) {
  const { readingId } = await params;
  const artifactId = decodeReadingId(readingId);
  // Course papers win over linked readings (same rule as link resolution):
  // when a linked reading is promoted to a course paper its registry entry
  // is dropped, so old bookmarks and shared /readings URLs must follow the
  // post to its course page instead of 404ing.
  const courseHref = coursePaperHrefForArtifact(artifactId);
  if (courseHref) redirect(courseHref);
  const reading = getLinkedReading(artifactId);
  if (!reading) notFound();

  const shell = paperShell(reading);
  const user = await getCurrentUser();
  // Degrade, never take the page down (same rationale as the paper page):
  // if the Highlight table is missing, the reading must still render.
  const highlights: HighlightRow[] = user
    ? await getHighlightsForItem(user.id, shell.id).catch(
        (): HighlightRow[] => [],
      )
    : [];

  const source = await paperSourceHeader(linkedReadingSource(reading));

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: reading.title }]}
      />

      <header>
        <p className="text-muted-foreground text-sm">Linked reading</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          {reading.title}
        </h1>
        {source.authors && (
          <p className="text-muted-foreground mt-2 text-sm">{source.authors}</p>
        )}
        <p className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {source.link && (
            <a
              href={source.link.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-destructive flex items-center gap-1 font-mono text-xs transition-colors"
            >
              {source.link.label}
              <ExternalLink className="size-3" aria-hidden />
            </a>
          )}
          {source.hasFootnotes && <SidenotesToggle />}
          {user ? <MarginNotesToggle /> : null}
        </p>
      </header>

      <div className="mt-8">
        <PaperReader
          paper={shell}
          signedIn={false}
          completedContentIds={new Set()}
          internalSublinks={false}
        />
      </div>

      {/* Same layer as the course paper pages — it discovers the rendered
          .paper-reader root itself and never receives HTML. */}
      {user ? (
        <PaperHighlights
          initialHighlights={highlights}
          createAction={createHighlight.bind(null, shell.id)}
          updateNoteAction={updateHighlightNote}
          deleteAction={deleteHighlight}
        />
      ) : null}
    </main>
  );
}
