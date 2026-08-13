import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuideForModule, getModuleBySlugs } from "@/lib/content";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { GuideContent, getGuideSections } from "@/components/mdx/guide-content";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trackSlug: string; moduleSlug: string }>;
}): Promise<Metadata> {
  const { trackSlug, moduleSlug } = await params;
  const resolved = getModuleBySlugs(trackSlug, moduleSlug);
  return {
    title: resolved
      ? `Facilitator guide — ${resolved.module.title}`
      : "Facilitator guide",
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ trackSlug: string; moduleSlug: string }>;
}) {
  const { trackSlug, moduleSlug } = await params;
  const resolved = getModuleBySlugs(trackSlug, moduleSlug);
  if (!resolved) notFound();
  const { track, module } = resolved;
  const guide = getGuideForModule(module.id);
  if (!guide) notFound();

  const sections = (await getGuideSections(guide.contentRef)).filter(
    (s) => s.title,
  );

  return (
    <div className="max-w-3xl px-4 py-8 lg:px-8">
      <Breadcrumbs
        items={[
          { label: track.title, href: `/tracks/${track.slug}` },
          { label: module.title, href: `/tracks/${track.slug}/${module.slug}` },
          { label: "Facilitator guide" },
        ]}
      />

      <p className="text-muted-foreground text-sm">Facilitator guide</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">
        {module.title}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="outline">{guide.sessionLength} min session</Badge>
        <Badge variant="outline">Group of {guide.groupSize}</Badge>
        {(guide.materials ?? []).map((m) => (
          <Badge key={m} variant="outline">
            {m}
          </Badge>
        ))}
      </div>

      {sections.length >= 2 && (
        <nav className="text-muted-foreground mt-6 text-sm">
          <p className="font-medium">In this session</p>
          <ul className="mt-1 space-y-1">
            {sections.map((s) => (
              <li key={s.id}>
                <a className="underline underline-offset-4" href={`#${s.id}`}>
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="mt-8">
        <GuideContent contentRef={guide.contentRef} />
      </div>
    </div>
  );
}
