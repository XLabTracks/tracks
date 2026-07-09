import { tracks, modules, units, lessons } from "@/content/curriculum.data";
import { exercises } from "@/content/exercises.data";
import { assessments } from "@/content/assessments.data";
import { resources } from "@/content/resources.data";
import type {
  Assessment,
  Exercise,
  ExternalResource,
  Lesson,
  Module,
  Track,
  Unit,
} from "./types";

// In-memory indexes over the static content graph.
const trackById = new Map(tracks.map((t) => [t.id, t]));
const trackBySlug = new Map(tracks.map((t) => [t.slug, t]));
const moduleById = new Map(modules.map((m) => [m.id, m]));
const unitById = new Map(units.map((u) => [u.id, u]));
const lessonById = new Map(lessons.map((l) => [l.id, l]));
const exerciseById = new Map(exercises.map((e) => [e.id, e]));
const assessmentById = new Map(assessments.map((a) => [a.id, a]));
const assessmentByModuleId = new Map(assessments.map((a) => [a.moduleId, a]));

export { tracks, resources };
export type { Track, Module, Unit, Lesson, Exercise, Assessment, ExternalResource };

// --- Basic lookups -------------------------------------------------------

export function getTrackBySlug(slug: string): Track | undefined {
  return trackBySlug.get(slug);
}
export function getTrackById(id: string): Track | undefined {
  return trackById.get(id);
}
export function getModuleById(id: string): Module | undefined {
  return moduleById.get(id);
}
export function getUnitById(id: string): Unit | undefined {
  return unitById.get(id);
}
export function getLessonById(id: string): Lesson | undefined {
  return lessonById.get(id);
}
export function getExerciseById(id: string): Exercise | undefined {
  return exerciseById.get(id);
}
export function getAssessmentById(id: string): Assessment | undefined {
  return assessmentById.get(id);
}
export function getAssessmentForModule(moduleId: string): Assessment | undefined {
  return assessmentByModuleId.get(moduleId);
}

export function getExercisesByIds(ids: string[]): Exercise[] {
  return ids
    .map((id) => exerciseById.get(id))
    .filter((e): e is Exercise => Boolean(e));
}

// --- Ordered collections -------------------------------------------------

export function getModulesForTrack(trackId: string): Module[] {
  const track = trackById.get(trackId);
  if (!track) return [];
  return track.moduleIds
    .map((id) => moduleById.get(id))
    .filter((m): m is Module => Boolean(m));
}

export function getUnitsForModule(moduleId: string): Unit[] {
  const mod = moduleById.get(moduleId);
  if (!mod) return [];
  return mod.unitIds
    .map((id) => unitById.get(id))
    .filter((u): u is Unit => Boolean(u));
}

export function getLessonsForUnit(unitId: string): Lesson[] {
  const unit = unitById.get(unitId);
  if (!unit) return [];
  return unit.lessonIds
    .map((id) => lessonById.get(id))
    .filter((l): l is Lesson => Boolean(l));
}

/** Every lesson in a module, flattened across its units in order. */
export function getLessonsForModule(moduleId: string): Lesson[] {
  return getUnitsForModule(moduleId).flatMap((u) => getLessonsForUnit(u.id));
}

export function getTrackForModule(moduleId: string): Track | undefined {
  const mod = moduleById.get(moduleId);
  return mod ? trackById.get(mod.trackId) : undefined;
}

export function getModuleForUnit(unitId: string): Module | undefined {
  const unit = unitById.get(unitId);
  return unit ? moduleById.get(unit.moduleId) : undefined;
}

// --- Slug resolution -----------------------------------------------------

export function getModuleBySlugs(
  trackSlug: string,
  moduleSlug: string,
): { track: Track; module: Module } | undefined {
  const track = trackBySlug.get(trackSlug);
  if (!track) return undefined;
  const mod = getModulesForTrack(track.id).find((m) => m.slug === moduleSlug);
  return mod ? { track, module: mod } : undefined;
}

export function getUnitBySlugs(
  trackSlug: string,
  moduleSlug: string,
  unitSlug: string,
): { track: Track; module: Module; unit: Unit } | undefined {
  const resolved = getModuleBySlugs(trackSlug, moduleSlug);
  if (!resolved) return undefined;
  const unit = getUnitsForModule(resolved.module.id).find(
    (u) => u.slug === unitSlug,
  );
  return unit ? { ...resolved, unit } : undefined;
}

export function getLessonBySlugs(
  trackSlug: string,
  moduleSlug: string,
  unitSlug: string,
  lessonSlug: string,
): { track: Track; module: Module; unit: Unit; lesson: Lesson } | undefined {
  const resolved = getUnitBySlugs(trackSlug, moduleSlug, unitSlug);
  if (!resolved) return undefined;
  const lesson = getLessonsForUnit(resolved.unit.id).find(
    (l) => l.slug === lessonSlug,
  );
  return lesson ? { ...resolved, lesson } : undefined;
}

/** Canonical path to a lesson, resolving its unit/module/track. */
export function getLessonHref(lessonId: string): string | null {
  const lesson = lessonById.get(lessonId);
  if (!lesson) return null;
  const unit = unitById.get(lesson.unitId);
  const mod = unit ? moduleById.get(unit.moduleId) : undefined;
  const track = mod ? trackById.get(mod.trackId) : undefined;
  if (!unit || !mod || !track) return null;
  return `/tracks/${track.slug}/${mod.slug}/${unit.slug}/${lesson.slug}`;
}

// --- Prerequisites -------------------------------------------------------

/** Resolved prerequisite modules for a module (cross-track allowed). */
export function getPrerequisiteModules(moduleId: string): Module[] {
  const mod = moduleById.get(moduleId);
  if (!mod) return [];
  return mod.prerequisiteModuleIds
    .map((id) => moduleById.get(id))
    .filter((m): m is Module => Boolean(m));
}

// --- Navigation ----------------------------------------------------------

export interface LessonRef {
  trackSlug: string;
  moduleSlug: string;
  unitSlug: string;
  lessonSlug: string;
  title: string;
}

/** Flattened, ordered sequence of every lesson in a track. */
export function getTrackLessonSequence(
  trackSlug: string,
): Array<{ module: Module; unit: Unit; lesson: Lesson }> {
  const track = trackBySlug.get(trackSlug);
  if (!track) return [];
  const sequence: Array<{ module: Module; unit: Unit; lesson: Lesson }> = [];
  for (const mod of getModulesForTrack(track.id)) {
    for (const unit of getUnitsForModule(mod.id)) {
      for (const lesson of getLessonsForUnit(unit.id)) {
        sequence.push({ module: mod, unit, lesson });
      }
    }
  }
  return sequence;
}

/** Previous/next lesson within the same track (linear order). */
export function getLessonNavigation(lessonId: string): {
  prev: LessonRef | null;
  next: LessonRef | null;
} {
  const lesson = lessonById.get(lessonId);
  if (!lesson) return { prev: null, next: null };
  const track = getTrackForModule(lesson.moduleId);
  if (!track) return { prev: null, next: null };

  const sequence = getTrackLessonSequence(track.slug);
  const index = sequence.findIndex((entry) => entry.lesson.id === lessonId);
  if (index === -1) return { prev: null, next: null };

  const toRef = (entry: {
    module: Module;
    unit: Unit;
    lesson: Lesson;
  }): LessonRef => ({
    trackSlug: track.slug,
    moduleSlug: entry.module.slug,
    unitSlug: entry.unit.slug,
    lessonSlug: entry.lesson.slug,
    title: entry.lesson.title,
  });

  return {
    prev: index > 0 ? toRef(sequence[index - 1]) : null,
    next: index < sequence.length - 1 ? toRef(sequence[index + 1]) : null,
  };
}

// --- Outline (for sidebar / track overview) ------------------------------

export interface UnitOutline {
  unit: Unit;
  lessons: Lesson[];
}

export interface ModuleOutline {
  module: Module;
  units: UnitOutline[];
  /** Every lesson in the module, flattened across units (convenience). */
  lessons: Lesson[];
}

export interface TrackOutline {
  track: Track;
  modules: ModuleOutline[];
}

export function getTrackOutline(trackSlug: string): TrackOutline | undefined {
  const track = trackBySlug.get(trackSlug);
  if (!track) return undefined;
  return {
    track,
    modules: getModulesForTrack(track.id).map((module) => {
      const unitOutlines = getUnitsForModule(module.id).map((unit) => ({
        unit,
        lessons: getLessonsForUnit(unit.id),
      }));
      return {
        module,
        units: unitOutlines,
        lessons: unitOutlines.flatMap((u) => u.lessons),
      };
    }),
  };
}

/** All lesson IDs that belong to a track (used for progress aggregation). */
export function getTrackLessonIds(trackId: string): string[] {
  return getModulesForTrack(trackId).flatMap((m) =>
    getLessonsForModule(m.id).map((l) => l.id),
  );
}

/** Lesson IDs that count toward track progress (optional lessons excluded). */
export function getRequiredTrackLessonIds(trackId: string): string[] {
  return getModulesForTrack(trackId).flatMap((m) =>
    getLessonsForModule(m.id)
      .filter((l) => !l.optional)
      .map((l) => l.id),
  );
}

// --- Resources -----------------------------------------------------------

export function getResourcesByTopics(topics: string[]): ExternalResource[] {
  if (topics.length === 0) return [];
  const set = new Set(topics);
  return resources.filter((r) => r.topics.some((t) => set.has(t)));
}
