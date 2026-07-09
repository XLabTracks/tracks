import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, Clock } from "lucide-react";
import { getLessonsForUnit, getUnitBySlugs } from "@/lib/content";
import { isAccessLocked } from "@/lib/content/prerequisites";
import { getCurrentUser } from "@/lib/auth";
import { getCompletedLessonIds, getPrerequisiteStatus } from "@/lib/progress";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trackSlug: string; moduleSlug: string; unitSlug: string }>;
}): Promise<Metadata> {
  const { trackSlug, moduleSlug, unitSlug } = await params;
  const resolved = getUnitBySlugs(trackSlug, moduleSlug, unitSlug);
  return { title: resolved?.unit.title ?? "Unit" };
}

export default async function UnitPage({
  params,
}: {
  params: Promise<{ trackSlug: string; moduleSlug: string; unitSlug: string }>;
}) {
  const { trackSlug, moduleSlug, unitSlug } = await params;
  const resolved = getUnitBySlugs(trackSlug, moduleSlug, unitSlug);
  if (!resolved) notFound();
  const { track, module, unit } = resolved;

  const lessons = getLessonsForUnit(unit.id);
  const unitHref = `/tracks/${track.slug}/${module.slug}/${unit.slug}`;

  const user = await getCurrentUser();

  // Hard prerequisite enforcement gates the whole module, units included.
  if (user && track.prerequisiteEnforcement === "hard") {
    const prereqStatuses = await getPrerequisiteStatus(user.id, module.id);
    if (
      isAccessLocked(
        track.prerequisiteEnforcement,
        prereqStatuses.map((s) => s.completed),
      )
    ) {
      redirect(`/tracks/${track.slug}/${module.slug}`);
    }
  }

  const completedSet = new Set(
    user ? await getCompletedLessonIds(user.id, lessons.map((l) => l.id)) : [],
  );

  return (
    <div className="max-w-4xl px-4 py-8 lg:px-8">
      <Breadcrumbs
        items={[
          { label: track.title, href: `/tracks/${track.slug}` },
          { label: module.title, href: `/tracks/${track.slug}/${module.slug}` },
          { label: unit.title },
        ]}
      />

      <p className="text-muted-foreground text-sm">
        {module.title} · Unit {unit.order}
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">{unit.title}</h1>
      {unit.summary && (
        <p className="text-muted-foreground mt-2">{unit.summary}</p>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Lessons</h2>
        <ol className="mt-3 space-y-2">
          {lessons.map((lesson) => {
            const done = completedSet.has(lesson.id);
            return (
              <li key={lesson.id}>
                <Link
                  href={`${unitHref}/${lesson.slug}`}
                  className="border-border hover:bg-muted shadow-soft flex items-center justify-between gap-3 rounded-xl border p-4 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    {lesson.optional ? (
                      <span className="border-muted-foreground/40 size-4 shrink-0 rounded-full border border-dashed" />
                    ) : done ? (
                      <CheckCircle2
                        className="text-foreground size-4 shrink-0"
                        aria-hidden
                      />
                    ) : (
                      <span className="border-muted-foreground/40 size-4 shrink-0 rounded-full border" />
                    )}
                    <span className="font-medium">
                      {lesson.order}. {lesson.title}
                    </span>
                    {lesson.optional && (
                      <Badge variant="outline" className="shrink-0">
                        Optional
                      </Badge>
                    )}
                  </span>
                  {lesson.estimatedMinutes && (
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Clock className="size-3.5" aria-hidden /> {lesson.estimatedMinutes}m
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
