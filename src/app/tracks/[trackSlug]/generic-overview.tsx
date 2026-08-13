import Link from "next/link";
import { CheckCircle2, FileText, Lock } from "lucide-react";
import {
  getAssessmentForModule,
  getItemProgressContentIds,
  itemIdOf,
  itemSlugOf,
  itemTitleOf,
  type Module,
  type ModuleItem,
  type Track,
} from "@/lib/content";
import { PREREQUISITES_ENFORCED } from "@/lib/content/prerequisites";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function GenericTrackOverview({
  track,
  modules,
  signedIn,
  progress,
  continueHref,
  completedSet,
}: {
  track: Track;
  modules: Array<{ module: Module; items: ModuleItem[] }>;
  signedIn: boolean;
  progress: { completed: number; total: number; percent: number } | null;
  continueHref: string | null;
  completedSet: Set<string>;
}) {
  return (
    <div className="max-w-5xl px-4 py-8 lg:px-8">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: track.title }]}
      />

      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{track.title}</h1>
        <p className="text-muted-foreground mt-2">{track.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{modules.length} modules</Badge>
          {track.estimatedHours && (
            <Badge variant="secondary">~{track.estimatedHours}h</Badge>
          )}
        </div>
      </header>

      {modules.length === 0 ? (
        <p className="text-muted-foreground mt-4 text-sm">Lessons coming soon.</p>
      ) : signedIn && progress ? (
        <Card className="shadow-soft mt-6">
          <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Your progress</span>
                <span className="text-muted-foreground">
                  {progress.completed} / {progress.total} items
                </span>
              </div>
              <Progress value={progress.percent} className="mt-2" />
            </div>
            {continueHref && (
              <Button asChild>
                <Link href={continueHref}>
                  {progress.completed > 0 ? "Continue" : "Start"}
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground mt-4 text-sm">
          <Link href="/login" className="underline">
            Sign in
          </Link>{" "}
          to track your progress and save your writing.
        </p>
      )}

      <ol className="mt-8 space-y-4">
        {modules.map(({ module, items }) => {
          const assessment = getAssessmentForModule(module.id);
          const moduleHref = `/tracks/${track.slug}/${module.slug}`;
          const firstModuleItem = items[0];
          return (
            <li key={module.id}>
              <Card className="shadow-soft">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        Module {module.order}: {module.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {module.summary}
                      </CardDescription>
                    </div>
                    {PREREQUISITES_ENFORCED && module.prerequisiteModuleIds.length > 0 && (
                      <Badge variant="outline" className="shrink-0 gap-1">
                        <Lock className="size-3" aria-hidden />
                        {module.prerequisiteModuleIds.length} prereq
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="text-muted-foreground space-y-1 text-sm">
                    {items.map((item) => {
                      const done = getItemProgressContentIds(item).every((id) =>
                        completedSet.has(id),
                      );
                      return (
                        <li key={itemIdOf(item)} className="flex items-center gap-2">
                          {done ? (
                            <CheckCircle2
                              className="text-foreground size-3.5 shrink-0"
                              aria-hidden
                            />
                          ) : (
                            <span className="border-muted-foreground/40 size-3.5 shrink-0 rounded-full border" />
                          )}
                          <Link
                            href={`${moduleHref}/${itemSlugOf(item)}`}
                            className="hover:text-foreground transition-colors"
                          >
                            {itemTitleOf(item)}
                          </Link>
                          {item.kind === "paper" && (
                            <FileText
                              className="size-3 shrink-0 opacity-60"
                              aria-hidden
                            />
                          )}
                          {item.kind === "paper" && item.paper.optional && (
                            <span className="text-xs">(optional)</span>
                          )}
                        </li>
                      );
                    })}
                    {assessment && (
                      <li className="flex items-center gap-2">
                        <FileText className="size-3.5 shrink-0" aria-hidden />
                        <Link
                          href={`${moduleHref}/assessment`}
                          className="hover:text-foreground transition-colors"
                        >
                          {assessment.title}
                        </Link>
                      </li>
                    )}
                  </ul>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button asChild>
                    <Link
                      href={
                        firstModuleItem
                          ? `${moduleHref}/${itemSlugOf(firstModuleItem)}`
                          : moduleHref
                      }
                    >
                      Start module
                    </Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link href={moduleHref}>Overview</Link>
                  </Button>
                </CardFooter>
              </Card>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
