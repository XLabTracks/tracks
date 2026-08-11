import { notFound } from "next/navigation";
import type { LessonSection } from "./lesson-content";

async function importGuide(contentRef: string) {
  try {
    // Per-guide dynamic import => Turbopack code-splits each MDX body.
    return await import(`@/content/guides/${contentRef}.mdx`);
  } catch {
    return null;
  }
}

export async function getGuideSections(
  contentRef: string,
): Promise<LessonSection[]> {
  const mdxModule = (await importGuide(contentRef)) as {
    sections?: LessonSection[];
  } | null;
  return Array.isArray(mdxModule?.sections) ? mdxModule.sections : [];
}

export async function GuideContent({ contentRef }: { contentRef: string }) {
  const mdxModule = await importGuide(contentRef);
  if (!mdxModule) notFound();
  const Body = mdxModule.default;

  return (
    <article className="lesson-body prose prose-neutral prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-destructive prose-a:font-medium prose-a:underline-offset-4 max-w-none">
      <Body />
    </article>
  );
}
