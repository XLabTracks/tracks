import Link from "next/link";
import { FileText, Lock, Route } from "lucide-react";
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
import { CourseOverview } from "@/components/verification/course-overview";
import { controlOverview } from "@/content/control-overview";
import {
  LANDING_ACTIONS,
  LANDING_BAND_PAD as BAND_PAD,
  LANDING_BUTTON as HERO_BUTTON,
  LANDING_H1,
  LANDING_H2 as BAND_H2,
  LANDING_HERO,
  LANDING_LEDE,
  LANDING_WRAP as WRAP,
} from "@/components/landing/landing";

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
      <section className={LANDING_HERO}>
        <div className={`landing-stagger ${WRAP}`}>
          <h1 className={LANDING_H1}>
            {track.title}
          </h1>
          <p className={LANDING_LEDE}>
            {track.description}
          </p>
          <div className={LANDING_ACTIONS}>
            {heroHref && (
              <Button asChild size="lg" className={HERO_BUTTON}>
                <Link href={heroHref}>
                  {started ? "Continue the track" : "Start module 1"}
                </Link>
              </Button>
            )}
            <Button asChild size="lg" variant="outline" className={HERO_BUTTON}>
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
        </div>
      </section>

      <section
        id="modules"
        className="border-border bg-card scroll-mt-20 border-y"
      >
        <div className={`${WRAP} ${BAND_PAD}`}>
          <div
            data-reveal
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2"
          >
            <h2 className={BAND_H2}>The modules</h2>
            <span className="text-muted-foreground text-sm">
              {modules.length} modules · {totalItems} items
            </span>
          </div>
          {showLocks && (
            <p className="text-muted-foreground mt-3 inline-flex items-center gap-1.5 text-sm">
              <Lock className="size-3.5" aria-hidden />
              Prerequisites enforced — modules unlock in order
            </p>
          )}

          <ol role="list" className="mt-7 flex list-none flex-col gap-4">
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
                <li
                  key={module.id}
                  data-reveal
                  className="border-border bg-background landing-lift hover:shadow-soft-md rounded-xl border"
                >
                  <div className="flex flex-wrap items-start gap-x-6 gap-y-3 p-5">
                    <div className="min-w-[16rem] flex-1">
                      <p className="text-muted-foreground text-xs">
                        Module {String(module.order).padStart(2, "0")}
                        {meta && <> · {meta}</>}
                      </p>
                      <h3 className="mt-1.5 text-lg font-semibold tracking-tight">
                        <Link
                          href={`/tracks/${track.slug}/${module.slug}`}
                          className="-my-2 inline-block py-2 hover:underline underline-offset-4"
                        >
                          {module.title}
                        </Link>
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
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
                  {items.length > 0 && (
                    <ModuleItemsTable track={track} module={module} items={items} />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section>
        <div className={`${WRAP} ${BAND_PAD}`}>
          <h2 data-reveal className={BAND_H2}>
            What this course is
          </h2>
          <CourseOverview sections={controlOverview} />
        </div>
      </section>

      <section className="border-border border-t">
        <div className={`${WRAP} ${BAND_PAD}`}>
          <div className="grid gap-8 md:grid-cols-[1fr_1.5fr] md:gap-14">
            <h2 data-reveal className={BAND_H2}>
              Prerequisites
            </h2>
            <div className="flex flex-col gap-5">
              {EXPECTATIONS.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  data-reveal
                  className="grid grid-cols-[1.25rem_1fr] gap-3"
                >
                  <Icon className="text-primary mt-0.5 size-4" aria-hidden />
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
    <div className="border-border border-t">
      {items.map((item) => {
        const minutes =
          item.kind === "lesson"
            ? item.lesson.estimatedMinutes
            : item.paper.estimatedMinutes;
        return (
          <div
            key={itemIdOf(item)}
            className="border-border grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-b px-5 py-2.5 last:border-b-0 sm:grid-cols-[1fr_auto_auto]"
          >
            <Link
              href={`/tracks/${track.slug}/${module.slug}/${itemSlugOf(item)}`}
              className="text-link -my-2.5 min-w-0 py-2.5 text-sm hover:underline underline-offset-2"
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
