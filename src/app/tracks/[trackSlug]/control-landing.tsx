import Link from "next/link";
import { FileText, Lock, Route, Settings } from "lucide-react";
import {
  isOptionalItem,
  itemIdOf,
  itemSlugOf,
  itemTitleOf,
  type Module,
  type ModuleItem,
  type Track,
} from "@/lib/content";
import { PREREQUISITES_ENFORCED } from "@/lib/content/prerequisites";
import { OptionalPrefix } from "@/components/content/optional-tag";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const KIND_LABEL: Record<string, string> = {
  foundations: "Foundations",
  technical: "Technical",
  governance: "Governance",
};

/** "~4¾ h" from minutes (nearest quarter-hour); "~40 min" under an hour. */
function formatDuration(minutes: number): string {
  if (minutes < 60) return `~${minutes} min`;
  const quarters = Math.round(minutes / 15);
  const frac = ["", "¼", "½", "¾"][quarters % 4];
  return `~${Math.floor(quarters / 4)}${frac} h`;
}

/** "reading + exercises + demo", from what the paper's edits actually splice in. */
function itemKindLabel(item: ModuleItem): string {
  if (item.kind === "lesson") return "lesson";
  const spliced = (item.paper.edits ?? []).flatMap((edit) =>
    edit.op === "activity" ? edit.items : [],
  );
  const parts = ["reading"];
  if (spliced.some((a) => a.kind === "exercise" || a.kind === "sequence")) {
    parts.push("exercises");
  }
  if (spliced.some((a) => a.kind === "demo")) parts.push("demo");
  return parts.join(" + ");
}

function moduleMetaLine(items: ModuleItem[]): string | null {
  const lessons = items.filter((item) => item.kind === "lesson").length;
  const readings = items.length - lessons;
  const parts: string[] = [];
  if (lessons) parts.push(`${lessons} lesson${lessons === 1 ? "" : "s"}`);
  if (readings) parts.push(`${readings} reading${readings === 1 ? "" : "s"}`);
  return parts.length ? parts.join(" · ") : null;
}

const EXPECTATIONS = [
  {
    icon: Route,
    title: "AI Safety Fundamentals knowledge",
    body: "We assume that you have the knowledge equivalent to an intro-level AI safety course (Bluedot, University Intro Courses)",
  },
  {
    icon: FileText,
    title: "Comfort reading papers",
    body: "We suggest that you have some experience reading ML or AI Safety research papers & blogposts",
  },
];

export function ControlTrackLanding({
  track,
  modules,
  signedIn,
  progress,
  continueHref,
}: {
  track: Track;
  modules: Array<{ module: Module; items: ModuleItem[] }>;
  signedIn: boolean;
  progress: { completed: number; total: number; percent: number } | null;
  continueHref: string | null;
}) {
  const orderByModuleId = new Map(modules.map(({ module }) => [module.id, module.order]));
  const totalItems = modules.reduce((n, { items }) => n + items.length, 0);
  const firstModule = modules[0];
  const startHref =
    firstModule?.items[0] != null
      ? `/tracks/${track.slug}/${firstModule.module.slug}/${itemSlugOf(firstModule.items[0])}`
      : null;
  const started = Boolean(progress && progress.completed > 0);
  const heroHref = (started ? continueHref : null) ?? startHref;
  const showLocks = PREREQUISITES_ENFORCED && track.prerequisiteEnforcement === "hard";

  return (
    <div>
      <div className="mx-auto w-full max-w-5xl px-5 lg:px-10">
        <section className="pt-14 pb-12 lg:pt-20">
          <p className="text-destructive dark:text-primary font-mono text-xs font-medium tracking-widest uppercase">
            {KIND_LABEL[track.kind] ?? track.kind} track
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
            {track.title}
          </h1>
          <p className="text-muted-foreground mt-5 max-w-[64ch] text-lg leading-relaxed text-pretty">
            {track.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{modules.length} modules</Badge>
            <Badge variant="secondary">{totalItems} items</Badge>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {heroHref && (
              <Button asChild size="lg">
                <Link href={heroHref}>
                  {started ? "Continue the track" : "Start module 1"}
                </Link>
              </Button>
            )}
            <Button asChild size="lg" variant="secondary">
              <a href="#modules">Browse the syllabus</a>
            </Button>
          </div>
          {signedIn && progress ? (
            <p className="text-muted-foreground mt-4 text-sm">
              {progress.completed} / {progress.total} items complete.
            </p>
          ) : (
            <p className="text-muted-foreground mt-4 text-sm">
              No enrollment.{" "}
              <Link href="/login" className="underline underline-offset-2">
                Sign in
              </Link>{" "}
              only if you want progress saved.
            </p>
          )}
        </section>

        <section id="modules" className="scroll-mt-20 pb-6">
          <div className="border-border flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b pb-3.5">
            <h2 className="text-2xl font-semibold tracking-tight">The modules</h2>
            {showLocks && (
              <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
                <Lock className="size-3.5" aria-hidden />
                Prerequisites enforced — modules unlock in order
              </span>
            )}
          </div>

          {modules.map(({ module, items }) => {
            const meta = moduleMetaLine(items);
            const duration = module.estimatedMinutes
              ? formatDuration(module.estimatedMinutes)
              : null;
            const prereqOrders = module.prerequisiteModuleIds
              .map((id) => orderByModuleId.get(id))
              .filter((n): n is number => typeof n === "number");
            const unlocksAfter = prereqOrders.length ? Math.max(...prereqOrders) : null;
            const isFirst = module.order === 1;
            return (
              <div
                key={module.id}
                className="border-border grid grid-cols-[2.5rem_1fr] gap-x-4 border-b py-6 last:border-b-0 sm:grid-cols-[3.5rem_1fr_auto] sm:gap-x-6"
              >
                <span className="text-muted-foreground pt-0.5 font-mono text-sm">
                  {String(module.order).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[17px] font-semibold tracking-tight">
                    <Link
                      href={`/tracks/${track.slug}/${module.slug}`}
                      className="hover:underline underline-offset-4"
                    >
                      {module.title}
                    </Link>
                  </h3>
                  {meta && (
                    <p className="text-muted-foreground mt-1.5 font-mono text-xs">
                      {meta}
                    </p>
                  )}
                  {items.length > 0 && (
                    <ModuleItemsTable track={track} module={module} items={items} />
                  )}
                </div>
                <div className="col-start-2 mt-3 flex items-center gap-3 sm:col-start-3 sm:mt-0 sm:flex-col sm:items-end sm:gap-2">
                  {isFirst && <Badge>Start here</Badge>}
                  {showLocks && unlocksAfter !== null && (
                    <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
                      <Lock className="size-3.5" aria-hidden />
                      after {String(unlocksAfter).padStart(2, "0")}
                    </span>
                  )}
                  {duration && (
                    <span className="text-muted-foreground text-sm">{duration}</span>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      </div>

      <section className="border-border bg-muted/50 border-t">
        <div className="mx-auto w-full max-w-5xl px-5 py-12 lg:px-10">
          <div className="grid gap-10 md:grid-cols-[1fr_1.5fr] md:items-center md:gap-14">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Prerequisites
              </h2>
            </div>
            <div className="flex flex-col gap-5">
              {EXPECTATIONS.map(({ icon: Icon, title, body }) => (
                <div key={title} className="grid grid-cols-[1.25rem_1fr] gap-3">
                  <Icon className="mt-0.5 size-4" aria-hidden />
                  <div>
                    <h3 className="text-[15px] font-semibold">{title}</h3>
                    <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ModuleItemsTable({
  track,
  module,
  items,
}: {
  track: Track;
  module: Module;
  items: ModuleItem[];
}) {
  return (
    <div className="border-border mt-4 max-w-2xl overflow-hidden rounded-lg border">
      {items.map((item) => {
        const minutes =
          item.kind === "lesson"
            ? item.lesson.estimatedMinutes
            : item.paper.estimatedMinutes;
        return (
          <div
            key={itemIdOf(item)}
            className="border-border grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-b px-3.5 py-2.5 last:border-b-0 sm:grid-cols-[1fr_auto_auto]"
          >
            <Link
              href={`/tracks/${track.slug}/${module.slug}/${itemSlugOf(item)}`}
              className="text-link min-w-0 text-sm hover:underline underline-offset-2"
            >
              {isOptionalItem(item) && <OptionalPrefix />}
              {itemTitleOf(item)}
            </Link>
            <span className="text-muted-foreground hidden font-mono text-[11px] sm:inline">
              {itemKindLabel(item)}
            </span>
            {minutes != null && (
              <span className="text-muted-foreground w-14 text-right font-mono text-[11px]">
                {minutes} min
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
