import type { Metadata } from "next";
import Link from "next/link";
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
import { benchScenarios } from "@/content/bench.data";

export const metadata: Metadata = { title: "Threat Modelling Bench" };

export default function BenchPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 lg:px-6">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Bench" }]}
      />
      <h1 className="text-3xl font-semibold tracking-tight">
        Threat Modelling Bench
      </h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Practice decomposing threat models the way the field does it: start
        from a system with no measures, find the attacker&apos;s best strategy,
        map the necessary conditions as a tree — then watch the defense grow
        one affordance at a time and revise. No grading, no answer key: the
        graph you build is the artifact.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {benchScenarios.map((scenario) => (
          <Card key={scenario.id} className="shadow-soft flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{scenario.title}</CardTitle>
              <CardDescription>{scenario.blurb}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto gap-2">
              <Button asChild>
                <Link href={`/bench/${scenario.slug}`}>Open</Link>
              </Button>
              <Badge variant="secondary">
                {scenario.affordances.length} affordances
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
