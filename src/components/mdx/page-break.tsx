/**
 * An authored boundary in a paged lesson.
 *
 * The marker never appears to the learner. LessonPartsReader reads it after
 * the MDX body mounts, uses its title for the pager, and then leaves the
 * surrounding headings and document outline alone. A heading is therefore a
 * section again, not an accidental instruction to start a new screen.
 */
export function PageBreak({ title }: { title: string }) {
  return (
    <span
      hidden
      aria-hidden="true"
      data-lesson-page-break=""
      data-page-title={title}
    />
  );
}
