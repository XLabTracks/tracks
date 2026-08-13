import { isValidElement, type ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { notFound } from "next/navigation";
import { isLessonTitleHeading } from "@/lib/content/lesson-heading";
import {
  getExerciseById,
  getItemsForModule,
  getModulesForTrack,
} from "@/lib/content";
import { isWritingExercise } from "@/lib/content/types";

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
      const sections = await getLessonSections(item.lesson.contentRef);
      for (const section of sections) {
        if (!section.exercise) continue;
        const exercise = getExerciseById(section.exercise);
        if (!exercise || !isWritingExercise(exercise)) continue;
        if (exercise.optional) continue;
        ids.push(exercise.id);
      }
    }
  }
  return ids;
}

/**
 * Renders a lesson's MDX body (text + embedded Video/Demo/Exercise/Callout)
 * inside a soft, gray-toned prose container.
 */
export async function LessonContent({
  contentRef,
  title,
}: {
  contentRef: string;
  title?: string;
}) {
  const mdxModule = await importLesson(contentRef);
  if (!mdxModule) notFound();
  const Body = mdxModule.default;

  return (
    <article className="lesson-body prose prose-neutral dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-link prose-a:font-medium prose-a:underline-offset-4 max-w-none">
      {/* Per-render overrides win over the global map: the compiled body
          spreads `props.components` last (see src/mdx-components.tsx). */}
      <Body components={title ? titleAwareHeadings(title) : undefined} />
    </article>
  );
}
