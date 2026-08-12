import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Clock, ExternalLink } from "lucide-react";
import {
  getItemBySlugs,
  getItemNavigation,
  getTrackProgressContentIds,
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
import { loginHref } from "@/lib/login-href";
import {
  getExerciseSubmissionMap,
  getPrerequisiteStatus,
  getTrackCompletionSet,
  isLessonCompleted,
} from "@/lib/progress";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { OptionalMarker } from "@/components/content/optional-tag";
import {
  LessonContent,
  getLessonCitations,
  getTrackRequiredWritingIds,
} from "@/components/mdx/lesson-content";
import { WorksCited } from "@/components/mdx/works-cited";
import { LessonPartsReader } from "@/components/learn/lesson-parts-reader";
import {
  CompletionHeader,
  type CompletionState,
} from "@/components/learn/completion-header";
import { LessonNav } from "@/components/layout/lesson-nav";
import { LessonCompleteButton } from "@/components/learn/lesson-complete-button";
import { LessonTracker } from "@/components/learn/lesson-tracker";
import { MarginNotesToggle } from "@/components/papers/margin-notes-toggle";
import { PaperHighlights } from "@/components/papers/paper-highlights";
import { PaperReader } from "@/components/papers/paper-reader";
import { PaperPartsReader } from "@/components/papers/paper-parts-reader";
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
  const citations = await getLessonCitations(lesson.contentRef);

  /* The closing page speaks for the whole track, so it needs the track's own
     state: the required units, and the required written work. Finishing is
     both — a learner who read every page and submitted nothing has not done
     the course. Everything is counted except this page itself, because the
     learner is standing on it. Only that page pays for the extra reads (both
     are request-cached). */
  let completionState: CompletionState = { units: null, writing: null };
  if (lesson.completion && userId) {
    const [completedSet, writingIds, submissions] = await Promise.all([
      getTrackCompletionSet(userId, track.id),
      getTrackRequiredWritingIds(track.id),
      getExerciseSubmissionMap(userId),
    ]);
    const units = getTrackProgressContentIds(track.id).filter(
      (id) => id !== lesson.id,
    );
    completionState = {
      units: {
        completed: units.filter((id) => completedSet.has(id)).length,
        total: units.length,
      },
      writing: {
        // Submitted, not drafted: a draft is work in progress, and "graded"
        // is a submitted task the grader has since been run on.
        submitted: writingIds.filter((id) => {
          const status = submissions.get(id)?.status;
          return status === "submitted" || status === "graded";
        }).length,
        required: writingIds.length,
      },
    };
  }

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
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {lesson.title}
          </h1>
          {lesson.optional && <OptionalMarker />}
        </div>
        {lesson.estimatedMinutes && (
          <p className="text-muted-foreground mt-2 flex items-center gap-1 text-sm">
            <Clock className="size-3.5" aria-hidden /> ~{lesson.estimatedMinutes} min
          </p>
        )}
      </header>

      {lesson.completion && (
        <CompletionHeader track={track} state={completionState} />
      )}

      {/* Works-cited + progress footer: shared between the chunked and plain
          layouts. Under the parts reader it is handed in as `footer` so it
          renders above the unified pager and stays outside any hidden part;
          in the plain layout it renders as ordinary siblings. */}
      {(() => {
        const footer = (
          <>
            {/* Sources belong to the whole lesson, so the toggle is reachable
                from any part — it lives outside the `.lesson-body` host and is
                never hidden with a part. */}
            <WorksCited urls={citations} />

            {userId ? (
              <LessonTracker
                lessonId={lesson.id}
                completed={completed}
                // The closing page completes nothing: reaching the end of a
                // congratulations is not work, and counts toward no total.
                autoComplete={!lesson.completion}
              />
            ) : null}

            {/* No Mark-complete on the closing page: it is not work, and a
                "Completed" chip under a congratulations card claims a second,
                smaller thing about the same page. */}
            {lesson.completion ? null : (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {userId ? (
                  <LessonCompleteButton
                    lessonId={lesson.id}
                    initialCompleted={completed}
                  />
                ) : (
                  <Button asChild variant="outline">
                    <Link
                      href={loginHref(
                        `/tracks/${track.slug}/${module.slug}/${lesson.slug}`,
                      )}
                    >
                      Sign in to track progress
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </>
        );

        // .lesson-reader scopes the sidebar's scroll-spy (see use-scroll-spy)
        // and gives heading anchors sticky-header clearance.
        return (
          <div className="lesson-reader mt-6">
            {/* The closing page is one screen: a celebration behind a part
                reader is four screens of nothing to read. */}
            {track.chunkedReading && !lesson.completion && !lesson.unchunked ? (
              // The reader owns the footer and one unified pager that rolls
              // from the last part into the next lesson, so no separate
              // LessonNav here.
              <LessonPartsReader
                footer={footer}
                prev={navLinkOf(nav.prev)}
                next={navLinkOf(nav.next)}
              >
                <LessonContent contentRef={lesson.contentRef} title={lesson.title} />
              </LessonPartsReader>
            ) : (
              <>
                <LessonContent contentRef={lesson.contentRef} title={lesson.title} />
                {footer}
                <LessonNav prev={nav.prev} next={nav.next} />
              </>
            )}
          </div>
        );
      })()}
    </div>
  );
}

/** An ItemRef as the parts reader wants it: a URL and a title, or null at the
 *  ends of the track. Mirrors LessonNav's own href construction. */
function navLinkOf(ref: ItemRef | null): { href: string; title: string } | null {
  return ref
    ? {
        href: `/tracks/${ref.trackSlug}/${ref.moduleSlug}/${ref.itemSlug}`,
        title: ref.title,
      }
    : null;
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

  // A gated paper is read whole, so it keeps the page's own footer and pager;
  // a chunked one hands both to the reader, which owns the single pager that
  // steps through the sections and then rolls into the neighbouring item.
  const chunkedPaper =
    track.chunkedReading && gateIdsOf(paper.edits).length === 0;

  const paperFooter = (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      {userId ? (
        <LessonCompleteButton
          lessonId={paper.id}
          initialCompleted={completed}
          toastLabel="Paper marked complete"
        />
      ) : (
        <Button asChild variant="outline">
          <Link
            href={loginHref(`/tracks/${track.slug}/${module.slug}/${paper.slug}`)}
          >
            Sign in to track progress
          </Link>
        </Button>
      )}
    </div>
  );

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
        <p className="text-muted-foreground text-sm">Paper</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {paper.title}
          </h1>
          {paper.optional && <OptionalMarker />}
        </div>
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
        {/* Section-by-section reading, on the tracks that read that way. A
            gated paper is left whole: it already hides its own tail until the
            reader answers, and two hiding layers over one document can strand
            content behind both. */}
        {chunkedPaper ? (
          <PaperPartsReader
            attribution={source.authors}
            footer={paperFooter}
            prev={navLinkOf(nav.prev)}
            next={navLinkOf(nav.next)}
          >
            <PaperReader
              paper={paper}
              signedIn={Boolean(userId)}
              completedContentIds={completedContentIds}
            />
          </PaperPartsReader>
        ) : (
          <PaperReader
            paper={paper}
            signedIn={Boolean(userId)}
            completedContentIds={completedContentIds}
          />
        )}
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
          // Read section by section, the sentinel sits below whichever part is
          // on screen — so scrolling to the bottom of the first Article would
          // report the whole treaty read. Mark complete is the only channel
          // there, which is the rule the chunked reading already runs on.
          autoComplete={
            !chunkedPaper
          }
        />
      ) : null}

      {/* Chunked, the reader owns this and the one pager under it (same shape
          as a lesson); whole, the page prints them itself. */}
      {chunkedPaper ? null : (
        <>
          {paperFooter}
          <LessonNav prev={nav.prev} next={nav.next} />
        </>
      )}
    </div>
  );
}

