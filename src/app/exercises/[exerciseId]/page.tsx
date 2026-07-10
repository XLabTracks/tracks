import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Exercise } from "@/components/mdx/exercise";
import { exerciseDisplayTitle, getFeaturedExercise } from "../featured";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}): Promise<Metadata> {
  const { exerciseId } = await params;
  const featured = getFeaturedExercise(exerciseId);
  return {
    title: featured ? exerciseDisplayTitle(featured.exercise) : "Exercise",
  };
}

export default async function ExercisePage({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;
  const featured = getFeaturedExercise(exerciseId);
  if (!featured) notFound();
  const title = exerciseDisplayTitle(featured.exercise);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 lg:px-6">
      <Breadcrumbs
        items={[{ label: "Exercises", href: "/exercises" }, { label: title }]}
      />
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-2">{featured.entry.blurb}</p>

      <Exercise id={featured.exercise.id} />
    </main>
  );
}
