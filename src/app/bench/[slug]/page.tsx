import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ThreatBench } from "@/components/bench/threat-bench";
import { benchScenarios, getBenchScenario } from "@/content/bench.data";

export function generateStaticParams() {
  return benchScenarios.map((scenario) => ({ slug: scenario.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const scenario = getBenchScenario(slug);
  return { title: scenario ? `${scenario.title} · Bench` : "Bench" };
}

export default async function BenchScenarioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const scenario = getBenchScenario(slug);
  if (!scenario) notFound();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Bench", href: "/bench" },
          { label: scenario.title },
        ]}
      />
      <h1 className="text-2xl font-semibold tracking-tight">
        {scenario.title}
      </h1>
      <p className="text-muted-foreground mt-1 mb-6 max-w-3xl text-sm">
        Build the threat model yourself, one round at a time. Red finds the
        best attack and maps its necessary conditions; blue receives an
        affordance and tags the nodes it touches; red revises. Your work saves
        in this browser.
      </p>
      <ThreatBench scenario={scenario} />
    </main>
  );
}
