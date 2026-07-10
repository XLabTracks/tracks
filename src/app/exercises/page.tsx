import type { Metadata } from "next";
import Link from "next/link";
import { EXERCISE_TYPE_LABELS } from "@/lib/content/types";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  exerciseDisplayTitle,
  featuredExercises,
  getFeaturedExercise,
} from "./featured";

export const metadata: Metadata = { title: "Exercises" };

export default function ExercisesPage() {
  const featured = featuredExercises
    .map((entry) => getFeaturedExercise(entry.id))
    .filter((f): f is NonNullable<typeof f> => Boolean(f));

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 lg:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Exercises" }]} />
      <h1 className="text-3xl font-semibold tracking-tight">Exercises</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Lorem ipsum — standalone exercises to work through in place; the same
        cards embed inside lessons and papers.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {featured.map(({ entry, exercise }) => (
          <Card key={entry.id} className="shadow-soft flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">
                {exerciseDisplayTitle(exercise)}
              </CardTitle>
              <CardDescription>{entry.blurb}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto gap-2">
              <Button asChild>
                <Link href={`/exercises/${entry.id}`}>Open</Link>
              </Button>
              <Badge variant="secondary">
                {EXERCISE_TYPE_LABELS[exercise.type]}
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
