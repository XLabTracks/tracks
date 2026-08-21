import { ThreatBench } from "./threat-bench";
import { getBenchScenario } from "@/content/bench.data";

/**
 * Lesson-embeddable Threat Modelling Bench: resolves a scenario slug so MDX
 * prose can drop the practice environment in place (`<BenchEmbed
 * slug="backdoor" />`). Same component the standalone /bench/[slug] page
 * renders — state persists per scenario in localStorage, so work started in
 * the lesson continues on the standalone page and vice versa.
 */
export function BenchEmbed({ slug }: { slug: string }) {
  const scenario = getBenchScenario(slug);
  if (!scenario) return null;
  return (
    <div className="not-prose my-6">
      <ThreatBench scenario={scenario} />
    </div>
  );
}
