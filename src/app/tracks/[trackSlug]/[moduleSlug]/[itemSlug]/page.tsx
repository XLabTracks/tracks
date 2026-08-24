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
import { getCurrentUserOrSignedOut } from "@/lib/auth";
import { loginHref } from "@/lib/login-href";
import {
  getExerciseSubmissionMap,
  getPrerequisiteStatus,
  getTrackCompletionSet,
  isLessonCompleted,
  type PrerequisiteStatus,
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
import { ReadingSurface } from "@/components/learn/reading-surface";
import {
  CompletionHeader,
  type CompletionState,
} from "@/components/learn/completion-header";
import {
  CompletionStats,
  type CompletionStatsData,
} from "@/components/learn/completion-stats";
import {
  completedReadingMinutes,
  completedVerificationUnits,
  skillSummary,
  submittedWordCount,
} from "@/lib/verification/completion-stats";
import { LessonNav } from "@/components/layout/lesson-nav";
import { LessonCompleteButton } from "@/components/learn/lesson-complete-button";
import { LessonTracker } from "@/components/learn/lesson-tracker";
import { MarginNotesToggle } from "@/components/papers/margin-notes-toggle";
import { ClassHighlightsToggle } from "@/components/papers/class-highlights-toggle";
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
import {
  getClassmateHighlightsForItem,
  getHighlightsForItem,
} from "@/lib/highlights/queries";
import {
  type ClassHighlightRow,
  type HighlightRow,
} from "@/lib/highlights/types";
import { getVerificationExerciseForLesson } from "@/lib/verification/exercises";

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

  const user = await getCurrentUserOrSignedOut();

  if (user && track.prerequisiteEnforcement === "hard") {
    const prereqStatuses = await getPrerequisiteStatus(
      user.id,
      module.id
    ).catch((): PrerequisiteStatus[] => []);
    if (
      isAccessLocked(
        track.prerequisiteEnforcement,
        prereqStatuses.map((s) => s.completed)
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
  const completed = userId
    ? await isLessonCompleted(userId, lesson.id).catch(() => false)
    : false;
  const citations = await getLessonCitations(lesson.contentRef);

  let completionState: CompletionState = { units: null, writing: null };
  let completionStats: CompletionStatsData | null = null;
  if (lesson.completion && userId) {
    const [completedSet, writingIds, submissions] = await Promise.all([
      getTrackCompletionSet(userId, track.id),
      getTrackRequiredWritingIds(track.id),
      getExerciseSubmissionMap(userId),
    ]);
    const units = getTrackProgressContentIds(track.id).filter(
      (id) => id !== lesson.id
    );
    const submittedWritingIds = writingIds.filter((id) => {
      const status = submissions.get(id)?.status;
      return status === "submitted" || status === "graded";
    });
    completionState = {
      units: {
        completed: units.filter((id) => completedSet.has(id)).length,
        total: units.length,
      },
      writing: {
        submitted: submittedWritingIds.length,
        required: writingIds.length,
      },
    };
    if (track.id === "verification") {
      completionStats = {
        skills: skillSummary(completedVerificationUnits(completedSet)),
        words: submittedWordCount(
          submittedWritingIds.map((id) => submissions.get(id)?.responseJson)
        ),
        essaysSubmitted: submittedWritingIds.length,
        readingMinutes: completedReadingMinutes(track.id, completedSet),
      };
    }
  }

  const chunked =
    track.chunkedReading && !lesson.completion && !lesson.unchunked;

  return (
    // Lessons read at the same measure as the paper reader (PaperItemPage's
    // max-w-5xl wrapper below), so prose and reproduced readings share one
    // right edge. Verification is the exception: its widget lessons were
    // built against the full column and keep it.
    <div
      className={
        track.id === "verification"
          ? "px-4 py-8 lg:px-8"
          : "max-w-5xl px-4 py-8 lg:px-8"
      }
    >
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
        {lesson.estimatedMinutes && !chunked ? (
          <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-sm">
            <Clock className="size-3.5" aria-hidden /> Estimated time:{" "}
            {lesson.estimatedMinutes} mins
          </p>
        ) : null}
      </header>

      {lesson.completion && (userId || track.id !== "verification") && (
        <CompletionHeader track={track} state={completionState} />
      )}
      {lesson.completion && track.id === "verification" && (
        <CompletionStats stats={completionStats} mapHref="/verification/map" />
      )}

      {(() => {
        const footer = (
          <>
            <WorksCited urls={citations} />

            {userId ? (
              <LessonTracker
                lessonId={lesson.id}
                completed={completed}
                autoComplete={
                  !chunked &&
                  !lesson.completion &&
                  !getVerificationExerciseForLesson(lesson.id)?.bridged
                }
              />
            ) : null}

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
                        `/tracks/${track.slug}/${module.slug}/${lesson.slug}`
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

        return (
          <div className="lesson-reader mt-6">
            {chunked ? (
              <LessonPartsReader
                footer={footer}
                prev={navLinkOf(nav.prev)}
                next={navLinkOf(nav.next)}
                estimatedMinutes={lesson.estimatedMinutes}
                lessonTitle={lesson.title}
              >
                <LessonContent
                  contentRef={lesson.contentRef}
                  title={lesson.title}
                  plainLists={lesson.plainLists}
                />
              </LessonPartsReader>
            ) : track.id === "verification" && !lesson.completion ? (
              <>
                <ReadingSurface>
                  <LessonContent
                    contentRef={lesson.contentRef}
                    title={lesson.title}
                    plainLists={lesson.plainLists}
                  />
                </ReadingSurface>
                {footer}
                <LessonNav prev={nav.prev} next={nav.next} />
              </>
            ) : (
              <>
                <LessonContent
                  contentRef={lesson.contentRef}
                  title={lesson.title}
                  plainLists={lesson.plainLists}
                />
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

function navLinkOf(
  ref: ItemRef | null
): { href: string; title: string } | null {
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
  const [completedContentIds, highlights, classHighlights] = userId
    ? await Promise.all([
        getTrackCompletionSet(userId, track.id).catch(
          (): Set<string> => new Set()
        ),
        getHighlightsForItem(userId, paper.id).catch((): HighlightRow[] => []),
        getClassmateHighlightsForItem(userId, paper.id).catch(
          (): ClassHighlightRow[] => []
        ),
      ])
    : [new Set<string>(), [] as HighlightRow[], [] as ClassHighlightRow[]];
  const completed = completedContentIds.has(paper.id);

  const source = await paperSourceHeader(paper.source);

  const chunkedPaper =
    track.chunkedReading &&
    (paper.pageSectionIds?.length ?? 0) >= 2 &&
    gateIdsOf(paper.edits).length === 0;

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
            href={loginHref(
              `/tracks/${track.slug}/${module.slug}/${paper.slug}`
            )}
          >
            Sign in to track progress
          </Link>
        </Button>
      )}
    </div>
  );

  const gateKeys = gateIdsOf(paper.edits).map((gateId) =>
    paperGateStorageKey(paper.id, gateId)
  );

  return (
    <div className="max-w-5xl px-4 py-8 lg:px-8">
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
              <Clock className="size-3.5" aria-hidden /> ~
              {paper.estimatedMinutes} min
            </span>
          )}
          {source.link && (
            <a
              href={source.link.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-destructive flex items-center gap-1 text-xs transition-colors"
            >
              {source.link.label}
              <ExternalLink className="size-3" aria-hidden />
            </a>
          )}
          {source.hasFootnotes && <SidenotesToggle />}
          {userId ? <MarginNotesToggle /> : null}
          {classHighlights.length > 0 ? <ClassHighlightsToggle /> : null}
        </p>
      </header>

      <div className="mt-8">
        {chunkedPaper ? (
          <PaperPartsReader
            attribution={source.authors}
            footer={paperFooter}
            prev={navLinkOf(nav.prev)}
            next={navLinkOf(nav.next)}
            pageSectionIds={paper.pageSectionIds ?? []}
          >
            <PaperReader
              paper={paper}
              signedIn={Boolean(userId)}
              completedContentIds={completedContentIds}
            />
          </PaperPartsReader>
        ) : track.id === "verification" ? (
          <ReadingSurface>
            <PaperReader
              paper={paper}
              signedIn={Boolean(userId)}
              completedContentIds={completedContentIds}
            />
          </ReadingSurface>
        ) : (
          <PaperReader
            paper={paper}
            signedIn={Boolean(userId)}
            completedContentIds={completedContentIds}
          />
        )}
      </div>

      {userId ? (
        <PaperHighlights
          initialHighlights={highlights}
          classHighlights={classHighlights}
          gateKeys={gateKeys}
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
          gateKeys={gateKeys}
          autoComplete={!chunkedPaper}
        />
      ) : null}

      {chunkedPaper ? null : (
        <>
          {paperFooter}
          <LessonNav prev={nav.prev} next={nav.next} />
        </>
      )}
    </div>
  );
}
