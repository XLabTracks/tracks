/**
 * The house prose treatment: Tailwind typography with the app's heading
 * weight, link colour and no measure of its own (the surface's container sets
 * the width). One string, imported wherever authored text is rendered — lesson
 * bodies, embedded lessons, guides, the site's own prose pages — so a change
 * to how prose reads is one edit.
 */
export const PROSE_CLASS =
  "prose prose-neutral dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-link prose-a:font-medium prose-a:underline-offset-4 max-w-none";
