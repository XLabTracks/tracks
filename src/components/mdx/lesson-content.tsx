import { notFound } from "next/navigation";

export async function importLesson(contentRef: string) {
  try {
    // Per-lesson dynamic import => Turbopack code-splits each MDX body.
    return await import(`@/content/lessons/${contentRef}.mdx`);
  } catch {
    return null;
  }
}

/** One top-level ##/### heading of a lesson body, as rendered. */
export interface LessonSection {
  /** The heading's anchor id (assigned by rehype-slug). */
  id: string;
  title: string;
  /** Heading depth: 2 = ##, 3 = ###. */
  level: 2 | 3;
}

/**
 * A lesson body's section headings, read from the `sections` export that
 * rehype-lesson-sections adds to every compiled lesson module — the same
 * pipeline run that assigns the heading ids, so these can't drift from the
 * rendered anchors. Missing lesson or export (e.g. a bad contentRef) => [].
 */
export async function getLessonSections(
  contentRef: string,
): Promise<LessonSection[]> {
  const mdxModule = (await importLesson(contentRef)) as {
    sections?: LessonSection[];
  } | null;
  return Array.isArray(mdxModule?.sections) ? mdxModule.sections : [];
}

/**
 * Renders a lesson's MDX body (text + embedded Video/Demo/Exercise/Callout)
 * inside a soft, gray-toned prose container.
 */
export async function LessonContent({ contentRef }: { contentRef: string }) {
  const mdxModule = await importLesson(contentRef);
  if (!mdxModule) notFound();
  const Body = mdxModule.default;

  return (
    <article className="lesson-body prose prose-neutral prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-destructive prose-a:font-medium prose-a:underline-offset-4 max-w-none">
      <Body />
    </article>
  );
}
