import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Clock, ExternalLink } from "lucide-react";
import {
  getItemBySlugs,
  getItemNavigation,
  itemIdOf,
  itemTitleOf,
  type ItemRef,
  type Lesson,
  type Module,
  type Paper,
  type Track,
} from "@/lib/content";
import { isAccessLocked } from "@/lib/content/prerequisites";
import { getCurrentUser } from "@/lib/auth";
import {
  getPrerequisiteStatus,
  getTrackCompletionSet,
  isLessonCompleted,
} from "@/lib/progress";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { LessonContent } from "@/components/mdx/lesson-content";
import { LessonNav } from "@/components/layout/lesson-nav";
import { LessonCompleteButton } from "@/components/learn/lesson-complete-button";
import { LessonTracker } from "@/components/learn/lesson-tracker";
import { MarginNotesToggle } from "@/components/papers/margin-notes-toggle";
import { PaperHighlights } from "@/components/papers/paper-highlights";
import { PaperReader } from "@/components/papers/paper-reader";
import { gateIdsOf, paperGateStorageKey } from "@/lib/papers/gate-state";
import { paperSourceHeader } from "@/components/papers/paper-source-header";
import { SidenotesToggle } from "@/components/papers/sidenotes-toggle";
import { Button } from "@/components/ui/button";
import {
  createHighlight,
  deleteHighlight,
  updateHighlightNote,
} from "@/app/actions/highlights";
import { getHighlightsForItem } from "@/lib/highlights/queries";
import { type HighlightRow } from "@/lib/highlights/types";

// Dispatching route: a module item slug resolves to either a lesson or a
// paper (they share the /tracks/t/m/<slug> namespace; the static `assessment`
// sibling segment takes precedence).

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trackSlug: string; moduleSlug: string; itemSlug: string }>;
}): Promise<Metadata> {
  const { trackSlug, moduleSlug, itemSlug } = await params;
  const resolved = getItemBySlugs(trackSlug, moduleSlug, itemSlug);
  return { title: resolved ? itemTitleOf(resolved.item) : "Lesson" };
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ trackSlug: string; moduleSlug: string; itemSlug: string }>;
}) {
  const { trackSlug, moduleSlug, itemSlug } = await params;
  const resolved = getItemBySlugs(trackSlug, moduleSlug, itemSlug);
  if (!resolved) notFound();
  const { track, module, item } = resolved;
  const nav = getItemNavigation(itemIdOf(item));

  const user = await getCurrentUser();

  // Hard prerequisite enforcement: signed-in learners with unmet prerequisites
  // are sent back to the module page. (Signed-out visitors may preview.)
  if (user && track.prerequisiteEnforcement === "hard") {
    const prereqStatuses = await getPrerequisiteStatus(user.id, module.id);
    if (
      isAccessLocked(
        track.prerequisiteEnforcement,
        prereqStatuses.map((s) => s.completed),
      )
    ) {
      redirect(`/tracks/${track.slug}/${module.slug}`);
    }
  }

  if (item.kind === "lesson") {
    return (
      <LessonItemPage
        track={track}
        module={module}
        lesson={item.lesson}
        nav={nav}
        userId={user?.id ?? null}
      />
    );
  }
  return (
    <PaperItemPage
      track={track}
      module={module}
      paper={item.paper}
      nav={nav}
      userId={user?.id ?? null}
    />
  );
}

async function LessonItemPage({
  track,
  module,
  lesson,
  nav,
  userId,
}: {
  track: Track;
  module: Module;
  lesson: Lesson;
  nav: { prev: ItemRef | null; next: ItemRef | null };
  userId: string | null;
}) {
  const completed = userId ? await isLessonCompleted(userId, lesson.id) : false;

  return (
    <div className="max-w-4xl px-4 py-8 lg:px-8">
      {/* The trail stops at the module: the lesson's own name is the h1 two
          lines below, and repeating it there put the same words on screen
          twice before the body even started. Same reason there is no
          "Module N: …" line — the module is the crumb above it. */}
      <Breadcrumbs
        items={[
          { label: track.title, href: `/tracks/${track.slug}` },
          {
            label: `Module ${module.order}: ${module.title}`,
            href: `/tracks/${track.slug}/${module.slug}`,
          },
        ]}
      />

      <header>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{lesson.title}</h1>
        {lesson.estimatedMinutes && (
          <p className="text-muted-foreground mt-2 flex items-center gap-1 text-sm">
            <Clock className="size-3.5" aria-hidden /> ~{lesson.estimatedMinutes} min
          </p>
        )}
      </header>

      {/* .lesson-reader scopes the sidebar's scroll-spy (see use-scroll-spy)
          and gives heading anchors sticky-header clearance. */}
      <div className="lesson-reader mt-6">
        <LessonContent contentRef={lesson.contentRef} title={lesson.title} />
      </div>

      {userId ? (
        <LessonTracker
          lessonId={lesson.id}
          completed={completed}
        />
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {userId ? (
          <LessonCompleteButton lessonId={lesson.id} initialCompleted={completed} />
        ) : (
          <Button asChild variant="outline">
            <Link href="/login">Sign in to track progress</Link>
          </Button>
        )}
      </div>

      <LessonNav prev={nav.prev} next={nav.next} />
    </div>
  );
}

async function PaperItemPage({
  track,
  module,
  paper,
  nav,
  userId,
}: {
  track: Track;
  module: Module;
  paper: Paper;
  nav: { prev: ItemRef | null; next: ItemRef | null };
  userId: string | null;
}) {
  // The paper and its inserted lessons are independent completion units; the
  // track completion set (a request-cache hit from the layout) covers them
  // and PaperReader only membership-tests its own ids against it. The
  // highlights read rides the same round trip — Hyperdrive caching is off,
  // so a serialized second query would be a second us-east-1 hop.
  const [completedContentIds, highlights] = userId
    ? await Promise.all([
        getTrackCompletionSet(userId, track.id),
        // Degrade, never take the page down: schema migrations are applied
        // manually via psql (db/migrations) — if a deploy outruns that step
        // or a dev DB predates the Highlight table, this read throws and the
        // paper must still render (highlights simply absent).
        getHighlightsForItem(userId, paper.id).catch(
          (): HighlightRow[] => [],
        ),
      ])
    : [new Set<string>(), [] as HighlightRow[]];
  const completed = completedContentIds.has(paper.id);

  // Cached per request — PaperReader reuses the same artifact lookup.
  const source = await paperSourceHeader(paper.source);

  return (
    <div className="max-w-5xl px-4 py-8 lg:px-8">
      {/* Trail stops at the module — the paper's name is the h1 below it. */}
      <Breadcrumbs
        items={[
          { label: track.title, href: `/tracks/${track.slug}` },
          {
            label: `Module ${module.order}: ${module.title}`,
            href: `/tracks/${track.slug}/${module.slug}`,
          },
        ]}
      />

      <header>
        <p className="text-muted-foreground text-sm">
          Paper{paper.optional && " · Optional"}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{paper.title}</h1>
        {source.authors && (
          <p className="text-muted-foreground mt-2 text-sm">{source.authors}</p>
        )}
        <p className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {paper.estimatedMinutes && (
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden /> ~{paper.estimatedMinutes} min
            </span>
          )}
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
          {/* Margin display of the reader's own highlight notes — only
              signed-in readers can have any. */}
          {userId ? <MarginNotesToggle /> : null}
        </p>
      </header>

      <div className="mt-8">
        <PaperReader
          paper={paper}
          signedIn={Boolean(userId)}
          completedContentIds={completedContentIds}
        />
      </div>

      {/* Highlight layer: discovers the rendered .paper-reader root itself
          (PaperSidenotes/PaperGlossary invariant — never receives HTML). */}
      {userId ? (
        <PaperHighlights
          initialHighlights={highlights}
          createAction={createHighlight.bind(null, paper.id)}
          updateNoteAction={updateHighlightNote}
          deleteAction={deleteHighlight}
        />
      ) : null}

      {userId ? (
        <LessonTracker
          lessonId={paper.id}
          completed={completed}
          toastLabel="Paper complete"
          // Gated papers scroll-complete only after every reading gate has
          // been opened — with gates closed the body is unmounted and this
          // sentinel would sit right under the first gate's card.
          gateKeys={gateIdsOf(paper.edits).map((gateId) =>
            paperGateStorageKey(paper.id, gateId),
          )}
        />
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {userId ? (
          <LessonCompleteButton
            lessonId={paper.id}
            initialCompleted={completed}
            toastLabel="Paper marked complete"
          />
        ) : (
          <Button asChild variant="outline">
            <Link href="/login">Sign in to track progress</Link>
          </Button>
        )}
      </div>

      <LessonNav prev={nav.prev} next={nav.next} />
    </div>
  );
}

