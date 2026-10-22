import { isValidElement, type ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { notFound } from "next/navigation";
import { PROSE_CLASS } from "@/components/mdx/prose-class";
import { isLessonTitleHeading } from "@/lib/content/lesson-heading";
import {
  getExerciseById,
  getItemsForModule,
  getLessonById,
  getModulesForTrack,
  type ModuleItem,
} from "@/lib/content";
import { isWritingExercise, type WritingExercise } from "@/lib/content/types";
// Lesson MDX maths is rendered at build time by rehype-katex, so it arrives
// as finished markup with no component to carry its styles — see globals.css.
import "katex/dist/katex.min.css";

export async function importLesson(contentRef: string) {
  try {
    // Per-lesson dynamic import => Turbopack code-splits each MDX body.
    return await import(`@/content/lessons/${contentRef}.mdx`);
  } catch {
    return null;
  }
}

/**
 * One top-level entry of a lesson body, as rendered: a ##/### heading, or an
 * `<Exercise/>` block (which rehype-lesson-sections wraps in an anchor div).
 */
export interface LessonSection {
  /** The anchor id (rehype-slug for headings, `ins-exercise-…` for blocks). */
  id: string;
  /** Heading text; absent on exercise entries (resolve from the registry). */
  title?: string;
  /** Heading depth (2 = ##, 3 = ###); exercises sit one under their section. */
  level: number;
  /** Present on exercise entries: the exercise id. */
  exercise?: string;
}

/** Text content of a rendered React subtree (headings hold text + inline tags). */
function nodeText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean")
    return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (isValidElement(node)) {
    return nodeText((node.props as { children?: ReactNode }).children);
  }
  return "";
}

/**
 * The heading renderers a lesson body gets, closed over that lesson's title.
 *
 * The item page already prints the title as the page's h1 and again in the
 * breadcrumb, so a body that also carries it — which is what transcribing a
 * numbered outline section verbatim produces — puts it on screen three times.
 * Rather than policing the sources (that regressed on every new batch), the
 * duplicate is dropped here, at the one place that knows both the page title
 * and what the body is about to render.
 *
 * A surviving `h1` renders as `h2`: the page owns the document's only h1.
 * Note that rehype-lesson-sections collects h2/h3 only, so a body h1 promoted
 * here still gets no sidebar entry — filter the nav through
 * `getLessonSections`, which applies the same drop.
 */
function titleAwareHeadings(title: string): MDXComponents {
  type HeadingProps = React.ComponentProps<"h2">;
  const heading = (Tag: "h2" | "h3" | "h4" | "h5" | "h6") =>
    function LessonHeading({ children, ...rest }: HeadingProps) {
      if (isLessonTitleHeading(nodeText(children), title)) return null;
      return <Tag {...rest}>{children}</Tag>;
    };
  return {
    h1: heading("h2"),
    h2: heading("h2"),
    h3: heading("h3"),
    h4: heading("h4"),
    h5: heading("h5"),
    h6: heading("h6"),
  };
}

/**
 * A lesson body's section headings, read from the `sections` export that
 * rehype-lesson-sections adds to every compiled lesson module — the same
 * pipeline run that assigns the heading ids, so these can't drift from the
 * rendered anchors. Missing lesson or export (e.g. a bad contentRef) => [].
 *
 * Pass the lesson title to keep the nav in step with the body: a heading that
 * repeats the title is not rendered, so it must not appear as a row pointing
 * at an anchor that no longer exists.
 */
export async function getLessonSections(
  contentRef: string,
  title?: string
): Promise<LessonSection[]> {
  const mdxModule = (await importLesson(contentRef)) as {
    sections?: LessonSection[];
  } | null;
  const sections = Array.isArray(mdxModule?.sections) ? mdxModule.sections : [];
  if (!title) return sections;
  return sections.filter(
    (section) => !isLessonTitleHeading(section.title ?? "", title)
  );
}

/**
 * The external sources a lesson body cites, read from the `citations` export
 * that rehype-lesson-citations adds to every compiled lesson module — the
 * same pipeline run that renders the links, so the list can never drift from
 * the body. Missing lesson or export => [].
 */
export async function getLessonCitations(
  contentRef: string
): Promise<string[]> {
  const mdxModule = (await importLesson(contentRef)) as {
    citations?: string[];
  } | null;
  return Array.isArray(mdxModule?.citations) ? mdxModule.citations : [];
}

/**
 * The written work a track requires: the ids of every non-optional writing
 * exercise embedded in its lessons, in reading order.
 *
 * Read from the same `sections` export the sidebar navigates by, so the list
 * is whatever the bodies actually ask for — an exercise that is moved, added
 * or dropped changes this without anybody maintaining a second register. The
 * lesson modules are statically bundled and cached, so this walks imports,
 * not the filesystem, and works on the worker.
 */
export async function getTrackRequiredWritingIds(
  trackId: string
): Promise<string[]> {
  const ids: string[] = [];
  for (const mod of getModulesForTrack(trackId)) {
    for (const item of getItemsForModule(mod.id)) {
      if (item.kind !== "lesson") continue;
      for (const exercise of await lessonWritingExercises(
        item.lesson.contentRef
      )) {
        if (!exercise.optional) ids.push(exercise.id);
      }
    }
  }
  return ids;
}

/** The writing exercises a lesson body embeds, in reading order. */
async function lessonWritingExercises(
  contentRef: string
): Promise<WritingExercise[]> {
  const sections = await getLessonSections(contentRef);
  return sections.flatMap((section) => {
    const exercise = section.exercise
      ? getExerciseById(section.exercise)
      : undefined;
    return exercise && isWritingExercise(exercise) ? [exercise] : [];
  });
}

/**
 * Every writing exercise a module item asks for, optional ones included, in
 * reading order: a lesson's embedded `<Exercise/>` blocks, or a paper's
 * spliced activities — its exercises, sequences, and the bodies of its
 * inserted lessons. What an instructor reads and grades for that item.
 */
export async function getItemWritingExerciseIds(
  item: ModuleItem
): Promise<string[]> {
  const ids: string[] = [];
  if (item.kind === "lesson") {
    for (const exercise of await lessonWritingExercises(
      item.lesson.contentRef
    )) {
      ids.push(exercise.id);
    }
  } else {
    for (const edit of item.paper.edits ?? []) {
      if (edit.op !== "activity") continue;
      for (const activity of edit.items) {
        if (activity.kind === "lesson") {
          const lesson = getLessonById(activity.id);
          if (!lesson) continue;
          for (const exercise of await lessonWritingExercises(
            lesson.contentRef
          )) {
            ids.push(exercise.id);
          }
          continue;
        }
        const candidates =
          activity.kind === "exercise"
            ? [activity.id]
            : activity.kind === "sequence"
              ? activity.exerciseIds
              : [];
        for (const id of candidates) {
          const exercise = getExerciseById(id);
          if (exercise && isWritingExercise(exercise)) ids.push(id);
        }
      }
    }
  }
  return [...new Set(ids)];
}

/**
 * Renders a lesson's MDX body (text + embedded Video/Demo/Exercise/Callout)
 * inside a soft, gray-toned prose container.
 */
export async function LessonContent({
  contentRef,
  title,
  plainLists,
}: {
  contentRef: string;
  title?: string;
  /** Lesson.plainLists — app-bridge.css keys its list-form opt-out on this. */
  plainLists?: boolean;
}) {
  const mdxModule = await importLesson(contentRef);
  if (!mdxModule) notFound();
  const Body = mdxModule.default;

  return (
    <article
      className={`lesson-body ${plainLists ? "vt-plain-lists " : ""}${PROSE_CLASS}`}
    >
      {/* Per-render overrides win over the global map: the compiled body
          spreads `props.components` last (see src/mdx-components.tsx). */}
      <Body components={title ? titleAwareHeadings(title) : undefined} />
    </article>
  );
}
