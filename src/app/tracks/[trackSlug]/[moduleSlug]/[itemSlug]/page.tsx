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
    // Degrade like the layout's progress read: getPrerequisiteStatus awaits
    // the same cache()-memoized getTrackCompletionSet, so a failed read
    // rejects here too — and, uncaught, would rethrow BEFORE dispatch to
    // LessonItemPage/PaperItemPage, making their degrade catches unreachable
    // on every hard-enforcement item with prerequisites. Fail open (no lock),
    // consistent with signed-out visitors being allowed to preview.
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
  // A progress outage must not take static curriculum down.
  const completed = userId
    ? await isLessonCompleted(userId, lesson.id).catch(() => false)
    : false;
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
      (id) => id !== lesson.id
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

  // One reader decision, used twice: the parts reader carries the time
  // estimate on its toolbar line, so the header chip yields to it there.
  const chunked =
    track.chunkedReading && !lesson.completion && !lesson.unchunked;

  return (
    /* No width cap. It was max-w-4xl — 896px — which on anything wider than a
       small laptop left a third of the content area empty beside the reading
       column, and the column had a second cap inside it. Both are gone on the
       course owner's instruction: the text takes the width the sidebar does
       not. The measure that used to sit inside is in app-bridge.css, and the
       margin gutter that justified some of the slack went with the footnote
       sidenote it was reserved for. */
    <div className="px-4 py-8 lg:px-8">
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
        {/* Her standard wording, and the clock is back by her ask ("хочу
            часы"). */}
        {lesson.estimatedMinutes && !chunked ? (
          <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-sm">
            <Clock className="size-3.5" aria-hidden /> Estimated time:{" "}
            {lesson.estimatedMinutes} mins
          </p>
        ) : null}
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
                autoComplete={
                  !lesson.completion &&
                  !getVerificationExerciseForLesson(lesson.id)?.bridged
                }
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

        // .lesson-reader scopes the sidebar's scroll-spy (see use-scroll-spy)
        // and gives heading anchors sticky-header clearance.
        return (
          <div className="lesson-reader mt-6">
            {/* The closing page is one screen: a celebration behind a part
                reader is four screens of nothing to read. */}
            {chunked ? (
              // The reader owns the footer and one unified pager that rolls
              // from the last part into the next lesson, so no separate
              // LessonNav here.
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
              // The plain layout with the reading toolbar: the Aa control
              // (focus reading + the e-reader text-size editor) governs only
              // the surface it wraps — the reading and the exercises — never
              // the chrome. Verification-only: the scale CSS lives in
              // app-bridge.css, which only that track's chrome loads.
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

/** An ItemRef as the parts reader wants it: a URL and a title, or null at the
 *  ends of the track. Mirrors LessonNav's own href construction. */
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
  // The paper and its inserted lessons are independent completion units; the
  // track completion set (a request-cache hit from the layout) covers them
  // and PaperReader only membership-tests its own ids against it. The
  // highlights read rides the same round trip — Hyperdrive caching is off,
  // so a serialized second query would be a second us-east-1 hop.
  const [completedContentIds, highlights, classHighlights] = userId
    ? await Promise.all([
        // Degrade like the layout's progress read (its try/catch can't cover
        // this await — cache() memoizes the rejection per request, and
        // re-awaiting it here rethrows): render with nothing completed
        // rather than crash a page that is otherwise static content.
        getTrackCompletionSet(userId, track.id).catch(
          (): Set<string> => new Set()
        ),
        // Degrade, never take the page down: schema migrations are applied
        // manually via psql (db/migrations) — if a deploy outruns that step
        // or a dev DB predates the Highlight table, this read throws and the
        // paper must still render (highlights simply absent).
        getHighlightsForItem(userId, paper.id).catch((): HighlightRow[] => []),
        // Classmates' shared notes on this paper (empty for a user in no
        // classroom). Same degrade-never-fail contract as the own read.
        getClassmateHighlightsForItem(userId, paper.id).catch(
          (): ClassHighlightRow[] => []
        ),
      ])
    : [new Set<string>(), [] as HighlightRow[], [] as ClassHighlightRow[]];
  const completed = completedContentIds.has(paper.id);

  // Cached per request — PaperReader reuses the same artifact lookup.
  const source = await paperSourceHeader(paper.source);

  // A gated paper is read whole, so it keeps the page's own footer and pager;
  // a chunked one hands both to the reader, which owns the single pager that
  // steps through the sections and then rolls into the neighbouring item.
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

  // One key per reading gate — PaperHighlights (pending-vs-orphan
  // classification, fuzzy-skip while closed) and LessonTracker (scroll
  // completion) key their gate-closed checks on the same set.
  const gateKeys = gateIdsOf(paper.edits).map((gateId) =>
    paperGateStorageKey(paper.id, gateId)
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
          {/* Margin display of the reader's own highlight notes — only
              signed-in readers can have any. */}
          {userId ? <MarginNotesToggle /> : null}
          {/* Classmates' shared notes — only surfaced when at least one
              exists on this paper. */}
          {classHighlights.length > 0 ? <ClassHighlightsToggle /> : null}
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
            pageSectionIds={paper.pageSectionIds ?? []}
          >
            <PaperReader
              paper={paper}
              signedIn={Boolean(userId)}
              completedContentIds={completedContentIds}
            />
          </PaperPartsReader>
        ) : track.id === "verification" ? (
          // Papers carry the same reading surface as lessons, per the owner:
          // the Aa (focus reading + content-scoped text size) over the
          // document body. The wrapper does not disturb the `.paper-reader`
          // root that PaperHighlights/PaperSidenotes discover, and the focus
          // walker already skips .katex, glosses and not-prose.
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

      {/* Highlight layer: discovers the rendered .paper-reader root itself
          (PaperSidenotes/PaperGlossary invariant — never receives HTML). */}
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
          // Gated papers scroll-complete only after every reading gate has
          // been opened — with gates closed the body is unmounted and this
          // sentinel would sit right under the first gate's card.
          gateKeys={gateKeys}
          // Read section by section, the sentinel sits below whichever part is
          // on screen — so scrolling to the bottom of the first Article would
          // report the whole treaty read. Mark complete is the only channel
          // there, which is the rule the chunked reading already runs on.
          autoComplete={!chunkedPaper}
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
