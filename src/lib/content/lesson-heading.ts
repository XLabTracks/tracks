/**
 * "Is this heading the page title again?"
 *
 * The item page prints a lesson's title as the page h1 and again in the
 * breadcrumb, so a body that also carries it shows the same words three
 * times. That is exactly what transcribing a numbered outline section
 * verbatim produces, which is why the duplicate is dropped at render
 * (`titleAwareHeadings` in components/mdx/lesson-content.tsx) instead of being
 * policed in the sources.
 *
 * The comparison is on words only: the declared title and the transcribed
 * heading differ in punctuation, curly quotes, trailing periods and spacing
 * far more often than they differ in content. Trap: that looseness is the
 * point, so keep it away from anything where a near-match should not count.
 */
export function isLessonTitleHeading(heading: string, title: string): boolean {
  const a = normalizeHeading(heading);
  return a !== "" && a === normalizeHeading(title);
}

function normalizeHeading(value: string): string {
  return value
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
